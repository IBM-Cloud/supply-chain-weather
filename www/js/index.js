// Licensed under the Apache License. See footer for details.

//------------------------------------------------------------------------------
// leaflet - the "L" things:
//   http://leafletjs.com/reference.html
//
// esri-leaflet - the "L.esri" things
//   http://esri.github.io/esri-leaflet/api-reference/
//------------------------------------------------------------------------------

var Map,
    Locations = [],
    Help,
    geocoder = new google.maps.Geocoder,
    curZoom,
    datePicker,
    capitalsLeft;

$(onLoad)

//------------------------------------------------------------------------------
function onLoad() {

  // Get distribution centers and retail locations
  getLocations();

  // Initialize map in a disabled state
  Map = L.map("map", {
    zoom: 4
  });
  curZoom = getIconZoom(4);

  // Create the help buttons in bottom-left of map
  Help = L.popup()
    .setContent(getHelpHTML())
  createHelpBtn("help", "Help", displayHelp);

  /*Key = L.popup()
    .setContent(getKeyHTML())
  createHelpBtn("key", "Key", displayKey);*/

  // Add layer control
  var ngLayer = L.esri.basemapLayer("NationalGeographic");
  ngLayer.addTo(Map);

  var baseMaps = {
    Streets:            L.esri.basemapLayer("Streets"),
    NationalGeographic: ngLayer,
  };

  L.control.layers(baseMaps).addTo(Map);

  // Fit map to initial bounds
  var bounds = [
    { lat: 44.32, lon:  -69.76 }, // maine
    { lat: 38.55, lon: -121.46 }, // california
  ];
  Map.fitBounds(bounds, {padding:[0,0]});

//---Map Event Listeners--------------------------------------------------------

  // New Zoom Level: Adjusts marker icon size
  Map.on("zoomend", function(e) {
    // Get the corresponding css class for the current zoom level
    curZoom = getIconZoom(e.target._zoom);

    // Adjust size of marker icons based on new zoom level
    Locations.forEach(function(location){
      var marker = location.marker;
      var icon = L.divIcon({
        html:      "<i class='loc " + marker.iconCode + " " + curZoom.zoomClass + "'></i>",
        iconSize:  curZoom.zoomSize,
        className: "location-icon"
      });
      marker.setIcon(icon);
    });
  });

  // Close Popup: Destroy current datepicker instance
  Map.on("popupclose", function(e) {
    destroyDatepicker();
  });
}

//------------------------------------------------------------------------------
// Creates a new help button in the lower-left of the map
function createHelpBtn(bttnId, text, displayFunc) {
  var helpBtn = L.control({position: "bottomleft"});

  helpBtn.onAdd = function (map) {
    var div = L.DomUtil.create("div");

    div.innerHTML = "<button id='" + bttnId + "-button' type='button' class='btn btn-default'>" + text + "</button>";

    $(document).on( "click", "#" + bttnId + "-button", function() {
      displayFunc();
    });

    return div;
  }
  helpBtn.addTo(Map);
}

//------------------------------------------------------------------------------
// Destroys the currently instantiated datpicker object, if existing
function destroyDatepicker() {
  if (datePicker) {
    datePicker.datepicker("hide");
    datePicker.datepicker("destroy");
    datePicker = null;
  }
}

//------------------------------------------------------------------------------
// Displays the help text box in the center of the web page
var displayHelp = function displayHelp(location) {
  Help
    .setLatLng(Map.getCenter())
    .openOn(Map)
}

//------------------------------------------------------------------------------
// Displays the key box in the center of the web page
var displayKey = function displayKey(location) {
  Key
    .setLatLng(Map.getCenter())
    .openOn(Map)
}

//------------------------------------------------------------------------------
// Retrieves the corresponding city/state/country for the input lat/lon
function getLocationName(lat, lon, loc) {
  var latlng = {lat: lat, lng: lon};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var city, state, county, municipality, country = null;
      if (results[0]) {
        for (var i=0; i < results.length; i++) {
          var components = results[0].address_components;
          for (var j=0; j < components.length; j++) {
            if (components[j].types.indexOf("locality") != -1) {
              city = components[j].long_name;
              continue;
            }
            else if (components[j].types.indexOf("administrative_area_level_1") != -1) {
              state = components[j].long_name;
              continue;
            }
            else if (components[j].types.indexOf("administrative_area_level_2") != -1) {
              county = components[j].long_name;
              continue;
            }
            else if (components[j].types.indexOf("administrative_area_level_3") != -1) {
              municipality = components[j].long_name;
              continue;
            }
            else if (components[j].types.indexOf("country") != -1) {
              country = components[j].long_name;
              continue;
            }
          }
          if (city && state && country)
            break;
        }

        if (country === "United States") {
          if (city)
            loc.name = loc.marker.title = loc.marker.alt = (city + ", " + state);
          else if (county)
            loc.name = loc.marker.title = loc.marker.alt = (county + ", " + state);
        }
        else if (country === "Canada") {
          if (city)
            loc.name = loc.marker.title = loc.marker.alt = (city + ", " + state);
          else if (municipality)
            loc.name = loc.marker.title = loc.marker.alt = (municipality + ", " + state);
          else if (state)
            loc.name = loc.marker.title = loc.marker.alt = (state + ", " + country);
        }
        else if (country)
          if (city)
            loc.name = loc.marker.title = loc.marker.alt =  (city + ", " + country);
          else
            loc.name = loc.marker.title = loc.marker.alt =  (state + ", " + country);
      }
      else {
        console.error('No results found for reverse geocoding');
      }
    }
    else {
      console.error('Geocoder failed due to: ' + status);
    }
  });
}

//------------------------------------------------------------------------------
// Sets the popup for the input location
function setPopup(location) {
  if (location.type === "S")
    getCurrentConditions(location);
  else {
    var type = (location.type==="D") ? "Distribution Center" : "Retail Location";
    var table = [
      "<table>",
        "<tr><td class='weather-data-row'><strong>Type: </strong><td class='td-indent'>" + type,
        "<tr><td class='weather-data-row'><strong>Manager: </strong><td class='td-indent'>" + location.manager,
      "</table>"
    ].join("\n");

    var popupText = "<h4 class='popup-header'>" + location.name + "</h4>" + table;

    // Replace default marker with proper icon
    var marker = location.marker;
    if (location.type === "R")
      marker.iconCode = "retail-icon";
    else if (location.type === "D")
      marker.iconCode = "dist-icon";

    var icon = L.divIcon({
      html:      "<i class='loc " + marker.iconCode + " " + curZoom.zoomClass + "''></i>",
      iconSize:  curZoom.zoomSize,
      className: "location-icon"
    });
    marker.setIcon(icon);

    marker.bindPopup(popupText);
    marker.setOpacity(1);
  }
}

//------------------------------------------------------------------------------
// Retrieves the current weather conditions from Jetstream
function getCurrentConditions(location) {
  var lat = location.lat;
  var lon = location.lon;

  $.ajax("/api/currentConditions?latitude=" + lat + "&longitude=" + lon, {
    dataType: "json",
    success: function(data, status, jqXhr) {
      if (!data.error)
        gotCurrentConditions(location, data, status, jqXhr);
    }
  })
}

//------------------------------------------------------------------------------
// Called after successfully retrieving the current weather conditions
function gotCurrentConditions(location, data, status, jqXhr) {

  // Extract the info from the returned data
  if (null == data) return;

  var weatherIcon = code2icon(data.iconCode);
  var desc = data.conditionPhrase;
  var uvPhrase = code2uv(data.uvIndex);
  var service = (location.service==="ground") ? "Ground" : "Express";
  var status = getShipmentStatus(location.status);

  var temp = windSpeed = "???";
  if (data.temp !== null) temp = getTempString(data.temp);
  if (data.windSpeed !== null) windSpeed = getSpeedString(data.windSpeed);

  var loc = JSON.stringify({
    lat:  location.lat,
    lon:  location.lon,
    name: location.name
  });

  var table = [
    "<table>",
      "<tr><td class='weather-data-row'><strong>Service: </strong><td class='td-indent'>" + service,
      "<tr><td class='weather-data-row'><strong>Status: </strong><td class='td-indent'>" + status,
      "<tr><td class='weather-data-row'><strong>Current Location: </strong><td class='td-indent'>" + location.name,
      "<tr><td class='weather-data-row'><strong>Estimated Delivery: </strong><td class='td-indent'>" + location.estimatedDelivery,
      "<tr><td class='weather-data-row'><strong>Conditions: </strong><td class='td-indent'>" + desc,
      "<tr><td class='weather-data-row'><strong>Temperature: </strong><td class='td-indent'>" + temp,
      "<tr><td class='weather-data-row'><strong>Wind Speed: </strong><td class='td-indent'>" + windSpeed,
      "<tr><td class='weather-data-row'><strong>UV Index: </strong><td class='td-indent'>" + uvPhrase,
    "</table>"
  ].join("\n");

  var popupText = "<h4 class='popup-header'>" + location.desc + "</h4>" + table;

  // Replace default marker with proper icon
  var marker = location.marker;
  if (location.service==="ground")
    marker.iconCode = "ship-ground";
  else if (location.service==="express")
    marker.iconCode = "ship-express";

  var icon = L.divIcon({
    html:      "<i class='loc " + marker.iconCode + " " + curZoom.zoomClass + "''></i>",
    iconSize:  curZoom.zoomSize,
    className: "location-icon"
  });
  marker.setIcon(icon);

  marker.bindPopup(popupText);
  marker.setOpacity(1);
}

//------------------------------------------------------------------------------
// Returns shipment info if location.type shipment, otherwise empty string
function getShipmentStatus(status) {
  if (status === "pending")
    return "Under Review";
  else if (status === "accepted")
    return "Accepted";
  else if (status === "rejected")
    return "Rejected";
  else if (status === "shipped")
    return "In Transit";
  else if (status === "delivered")
    return "Delivered";
  else
    return "Unknown";
}

//------------------------------------------------------------------------------
// Returns formatted display C/F temperature when given F
function getTempString(tempF) {
  tempF = parseInt(tempF, 10);
  if (isNaN(tempF)) return "???";

  var tempC = Math.round((tempF - 32) * 5 / 9);

  return "" + tempC + "&deg; C / " + tempF + "&deg; F";
}

//------------------------------------------------------------------------------
// Returns formatted display kph/mph temperature when given mph
function getSpeedString(mph) {
  mph = parseInt(mph, 10);
  if (isNaN(mph)) return "???";

  var kph = Math.round(mph * 1.6);

  return "" + kph + " kph / " + mph + " mph";
}

//------------------------------------------------------------------------------
// Instructs the user to enter a date so they can get past/future weather data
function enterDate(location, getFuture) {

  var onBackClick = "javascript:goBack(\"" + location.name + "\")";
  var backBttn = "<img onclick='" + onBackClick + "' class='back-arrow' src='images/left_gray.png'>";

  var loc = JSON.stringify({
    lat:  location.lat,
    lon:  location.lon,
    name: location.name
  });

  // Sets the pop up text based on if getting past or future date
  var instructions, minMonth, maxMonth, minDay, maxDay, minYear, maxYear, onDateClick, buttonText;
  if (getFuture) {
    instructions = "Select a future date to predict the weather on that day";
    onDateClick = "javascript:getFutureDateData(" + loc + ")";
    buttonText = "Predict";
  }
  else {
    instructions = "Select a past date to get the historical weather data from that date";
    onDateClick = "javascript:getPastDateData(" + loc + ")";
    buttonText = "Retrieve";
  }

  var popUpText = [
    backBttn +
    "<p>" + instructions + "</p>" +
    "<p>Date: <input type='text' id='datepicker'></p>",
    "<p><button class='button' onclick='" + onDateClick + "'>" + buttonText + "</button></p>",
  ].join("\n");

  L.popup()
    .setContent(popUpText)
    .setLatLng(location)
    .openOn(Map)

  $(function() {
    var curDate = new Date(),
        tomorrow = new Date(curDate),
        yesterday = new Date(curDate);
    tomorrow.setDate(curDate.getDate()+1);
    yesterday.setDate(curDate.getDate()-1);

    if (getFuture) {
      datePicker = $('#datepicker').datepicker({
        changeYear: true,
        minDate: tomorrow
      });
    }
    else {
      datePicker = $('#datepicker').datepicker({
        changeYear: true,
        minDate: new Date(1931, 0, 1),
        maxDate: yesterday
      });
    }

    var curYear = curDate.getYear() + 1900,
        curMonth = curDate.getMonth() + 1,
        curDay = curDate.getDate(),
        dateString = curMonth + "/" + curDay + "/" + curYear;
    datePicker.datepicker( "setDate", dateString);
  });
}

//------------------------------------------------------------------------------
// Gets selected date and passes back relevant fields
function getDatepickerData(location) {
  var selectedDate = datePicker.datepicker('getDate');
  var dateInfo = {
    'year': selectedDate.getYear() + 1900,
    'month': selectedDate.getMonth() + 1,
    'day': selectedDate.getDate(),
    'getDisplayDate': function() {return this.month + "/" + this.day + "/" + this.year;}
  };
  return dateInfo;
}

//------------------------------------------------------------------------------
// Gets the weather for the input futuredate
function getFutureDateData(location) {

  var dateInfo = getDatepickerData();
  destroyDatepicker();

  var lat = location.lat;
  var lon = location.lon;

  L.popup()
    .setContent("Predicting weather for " + dateInfo.getDisplayDate() + "... <br><center><img class='loading_gif' src='images/weather_loading.gif'><center>")
    .setLatLng(location)
    .openOn(Map)

  $.ajax("/api/predictConditions?latitude=" + lat + "&longitude=" + lon + "&month=" + dateInfo.month + "&day=" + dateInfo.day, {
    dataType: "json",
    success: function(data, status, jqXhr) {
      gotFutureConditions(location, data, status, jqXhr, dateInfo.getDisplayDate())
    },
    error: function() {
      L.popup()
        .setContent("Error predicting weather for " + dateInfo.getDisplayDate() + ", sorry!")
        .setLatLng(location)
        .openOn(Map)
    }
  })
}

//------------------------------------------------------------------------------
// Take returned weather prediction and parse it for display
function gotFutureConditions(location, data, status, jqXhr, dateString) {
  try {
    // If no data was found, throw an error based on the context
    if (!data.success) {
      if (data.noData)
        throw "No historical data available for " + dateString + " so we are unable to predict the weather. Sorry!";
      else
        throw null;
    }

    var condition = [data.avgTemp, data.frequentCondition, data.iconCode];
    showWeatherForDate(true, location, condition, dateString, data.startYear, data.endYear);
  }
  // If no past results were available or error parsing, print message on pop-up
  catch(e) {
    var errMsg;
    if (typeof e === 'string')
      errMsg = e;
    else
      errMsg = "Error predicting weather for " + dateString + ", sorry!";
    L.popup()
      .setContent(errMsg)
      .setLatLng(location)
      .openOn(Map)
    }
}

//------------------------------------------------------------------------------
// Gets the weather for the input past date
function getPastDateData(location) {

  var dateInfo = getDatepickerData();
  destroyDatepicker();

  var lat = location.lat;
  var lon = location.lon;

  L.popup()
    .setContent("Getting weather data for " + dateInfo.getDisplayDate() + "... <br><center><img class='loading_gif' src='images/weather_loading.gif'><center>")
    .setLatLng(location)
    .openOn(Map)

  $.ajax("/api/pastConditions?latitude=" + lat + "&longitude=" + lon + "&month=" + dateInfo.month + "&day=" + dateInfo.day + "&year=" + dateInfo.year, {
    dataType: "json",
    success: function(data, status, jqXhr) {
      gotPastConditions(location, data, status, jqXhr, dateInfo.getDisplayDate())
    },
    error: function() {
      L.popup()
        .setContent("Error getting weather data for " + dateInfo.getDisplayDate() + ", sorry!")
        .setLatLng(location)
        .openOn(Map)
    }
  })
}

//------------------------------------------------------------------------------
// Take returned past conditions and parse them for display
function gotPastConditions(location, data, status, jqXhr, dateString) {
  try {
    if (data) {
      if (data.error)
        throw null;
      var condition = [data.temp, data.conditionPhrase, data.iconCode];
      showWeatherForDate(false, location, condition, dateString);
    }
    else
      throw "No weather data available for " + dateString + ", sorry!";
    //gotPastConditions_(location, data, status, jqXhr, dateString)
  }
  // If no past results were available or error parsing, print message on pop-up
  catch(e) {
    var errMsg;
    if (typeof e === 'string')
      errMsg = e;
    else
      errMsg = "Error getting weather data for " + dateString + ", sorry!"
    L.popup()
      .setContent(errMsg)
      .setLatLng(location)
      .openOn(Map)
    }
}

//------------------------------------------------------------------------------
// Shows the weather for a particular input date
function showWeatherForDate(showPrediction, location, condition, dateString, startYear, endYear) {
  Map.closePopup();

  var onBackClick = "javascript:goBack(\"" + location.name + "\")";
  var backBttn = "<img onclick='" + onBackClick + "' class='back-arrow' src='images/left_gray.png'>";

  var temp = getTempString(condition[0]);;
  var icon = code2icon(condition[2]);
  var weather = [
    "<table>",
      "<tr><td class='weather-data-row'><strong>Conditions: </strong><td class='td-indent'>" + condition[1],
      "<tr><td class='weather-data-row'><strong>Temperature: </strong><td class='td-indent'>" + temp,
    "</table>"
  ];
  weather = weather.join("\n");

  var iconMarkup = "<i class='wi " + icon + " wi-size-m wi-popup'></i>";

  var descriptor = (showPrediction) ? "will be" : "was";
  var predictionDates = (showPrediction) ? "<p>Based on weather observations from " + startYear.toString() + " to " + endYear.toString() + ", we predict the" : "<p>The";
  var desc = predictionDates + " weather on " + dateString + " " + descriptor + ":</p>";

  var popupHTML = backBttn + "<h4 class='popup-header'>" + location.name + "</h4>" + desc + "<p>" + weather + iconMarkup;

  L.popup()
    .setContent(popupHTML)
    .setLatLng(location)
    .openOn(Map)
}

//------------------------------------------------------------------------------
// Make call to weather API to get past weather conditions
function getHistoricConditions(location) {
  var lat = location.lat
  var lon = location.lon

  L.popup()
    .setContent("Getting historical data... <br><center><img class='loading_gif' src='images/weather_loading.gif'><center>")
    .setLatLng(location)
    .openOn(Map)

  $.ajax("/api/historicConditions?latitude=" + lat + "&longitude=" + lon, {
    dataType: "json",
    success: function(data, status, jqXhr) {
      gotHistoricConditions(location, data, status, jqXhr)
    },
    error: function() {
      L.popup()
        .setContent("Error getting historical data, sorry!")
        .setLatLng(location)
        .openOn(Map)
    }
  })
}

//------------------------------------------------------------------------------
// Take returned historic conditions and check them to ensure results are there
function gotHistoricConditions(location, data, status, jqXhr) {
  try {
    if (data && data.length > 0)
      showHistory(location, data);
    else
      throw "No historical data available, sorry!";
  }
  // If no historical results were available or error parsing, print message on pop-up
  catch(e) {
    var errMsg;
    if (typeof e === 'string')
      errMsg = e;
    else
      errMsg = "Error getting historical data, sorry!"
    L.popup()
      .setContent(errMsg)
      .setLatLng(location)
      .openOn(Map)
    }
}

//------------------------------------------------------------------------------
// Display historical weather results
function showHistory(location, history) {
  Map.closePopup()

  var onBackClick = "javascript:goBack(\"" + location.name + "\")"
  var backBttn = "<img onclick='" + onBackClick + "' class='back-arrow' src='images/left_gray.png'>"

  var table = [
    "<table>",
      "<tr><td><strong>Year</strong> <td class='td-history'><strong>Temp</strong> <td class='td-history'><strong>Conditions</strong>",
  ]

  history.forEach(function(data){
    var historyYear = JSON.parse(data);
    var year  = historyYear[0];
    var temp  = getTempString(historyYear[1]);
    var cond  = historyYear[2];
    var entry = "<tr><td class='history-row'>" + year +
                "<td class='td-history'>" + temp +
                "<td class='td-history'>" + cond;

    table.push(entry)
  })
  table.push("</table>")
  table = table.join("\n")

  var desc = "<p>Conditions on this day in previous years:"

  var popupHTML = backBttn + "<h4 class='popup-header'>" + location.name + "</h4>" + desc + "<p>" + table

  L.popup()
    .setContent(popupHTML)
    .setLatLng(location)
    .openOn(Map)
}

//------------------------------------------------------------------------------
// Retrieve all distribution centers and retail locations and place on map
function getLocations() {
  $.ajax("/api/v1/db/distribution", {
    dataType: "json",
    success: function(data, status, jqXhr) {
      data.forEach(function(distCenter){
        Locations.push({
          uniqueId : distCenter.uniqueId,
          lat : distCenter.latitude,
          lon : distCenter.longitude,
          name : distCenter.location,
          manager : distCenter.manager,
          type : "D"
        });
      });
      $.ajax("/api/v1/db/retail", {
        dataType: "json",
        success: function(data, status, jqXhr) {
          data.forEach(function(retailLoc){
            Locations.push({
              uniqueId : retailLoc.uniqueId,
              lat : retailLoc.latitude,
              lon : retailLoc.longitude,
              name : retailLoc.location,
              manager : retailLoc.manager,
              type : "R"
            });
          });

          // Retrieve all current shipments
          getShipments();
        },
        error: function() {
          L.popup()
            .setContent("Error getting retail locations, please try again later!")
            .setLatLng(Map.getCenter())
            .openOn(Map)
        }
      })
    },
    error: function() {
      L.popup()
        .setContent("Error getting distribution centers, please try again later!")
        .setLatLng(Map.getCenter())
        .openOn(Map)
    }
  })
}

//------------------------------------------------------------------------------
// Retrieve all current shipments and populate list, predictions, and emergencies
function getShipments() {
  $.ajax("/api/v1/db/shipments", {
    dataType: "json",
    success: function(data, status, jqXhr) {
      // Create a list item for each email in the array
      var warnCount = altCount = 0;
      if (data.length > 0) {
        for (var i=0; i < data.length; i++) {

          // Create an alert item if the shipment is in jeopardy
          var skipMarker = true;
          if (data[i].status==="pending") {
            addShipment(data[i], "pending-icon");
            skipMarker = false;
          }
          else if (data[i].status==="accepted") {
            addShipment(data[i], "accepted-icon");
            skipMarker = false;
          }
          else if (data[i].status==="shipped") {
            addShipment(data[i], "shipped-icon");
            skipMarker = false;
          }
          /*else if (data[i].status==="delivered") {
            addShipment(data[i], "delivered-icon");
          }
          else if (data[i].status==="rejected") {
            addShipment(data[i], "rejected-icon");
          }*/

          // Add shipment icon to map
          if (!skipMarker) {
            Locations.push({
              uniqueId : data[i].uniqueId,
              lat : data[i].curLatitude,
              lon : data[i].curLongitude,
              name : data[i].curLocation,
              desc : data[i].description,
              service : data[i].service,
              status : data[i].status,
              estimatedDelivery : data[i].estimatedDelivery,
              type : "S"
            });
          }
        }
      }

      // Add respective markers to all locations
      Locations.forEach(function(location){
        var marker = L.marker(location, {
          title:   location.name,
          alt:     location.name,
          opacity: 1
        })

        location.marker = marker;
        setPopup(location);
        marker.addTo(Map);
      });

      getPredictions();
      getEmergencyShipments();
    },
    error: function() {
      L.popup()
        .setContent("Error getting shipments, please try again later!")
        .setLatLng(Map.getCenter())
        .openOn(Map)
    }
  })
}

//------------------------------------------------------------------------------
// Adds the input shipment to both shipment list views
function addShipment(shipment, icon) {

  // Get info about shipment's origin and destination
  var orig, dest;
  Locations.forEach(function(location) {
    if (location.uniqueId === shipment.distribution)
      orig = location.name;
    else if (location.uniqueId === shipment.retail) {
      dest = location.name;
    }
  });

  // Add shipment to the shipment list
  var li = document.createElement("li");
  li.setAttribute("id", shipment.uniqueId + "-side");
  li.setAttribute("class", "shipment " + icon);
  li.innerHTML = "<a href='javascript:goBack(\"" + shipment.curLocation + "\")'><p class='shipment-text'>" +
                   "<span class='shipment-text-header'>Description: </span>" + shipment.description + "</br>" +
                   "<span class='shipment-text-header'>Origin: </span>" + orig + "</br>" +
                   "<span class='shipment-text-header'>Destination: </span>" + dest + "</br>" +
                 "</p></a>";
  document.getElementById("shipments-list-side").appendChild(li);
  var liNew = document.createElement("li");
  li.setAttribute("id", shipment.uniqueId + "-bottom");
  liNew.setAttribute("class", "shipment " + icon);
  liNew.innerHTML = "<a href='javascript:goBack(\"" + shipment.curLocation + "\")'><p class='shipment-text'>" +
                   "<span class='shipment-text-header'>Description: </span>" + shipment.description + "</br>" +
                   "<span class='shipment-text-header'>Origin: </span>" + orig + "</br>" +
                   "<span class='shipment-text-header'>Destination: </span>" + dest + "</br>" +
                 "</p></a>";
  document.getElementById("shipments-list-bottom").appendChild(liNew);
}

//------------------------------------------------------------------------------
// Retrieves the current weather predictions
function getPredictions() {

  var count = 0;
  Locations.forEach(function(location){
    if (location.type === "R" && count === 0) {
      insertWeatherBadge(location.name, "wi-rain");
      var li = document.createElement("li");
      li.setAttribute("id", location.uniqueId + "-prediction");
      li.setAttribute("class", "alert-item wi wi-size-s " + "wi-rain");
      li.innerHTML = "<a href='javascript:goBack(\"" + location.name + "\")'><p class='alert-text'>" +
                       "<span class='alert-header'>Conditions: </span>" + "Severe Thunderstorms" + "</br>" +
                       "<span class='alert-header'>Suggestion: </span>" + "Order additonal rain gear" + "</br>" +
                       "<span class='alert-header'>Manager: </span>" + location.manager +
                     "</p></a><div class='icon-con'>" +
                     "<i class='accept-icon'></i>" +
                     "<i class='reject-icon'></i>" +
                     "</div>";
      document.getElementById("prediction-list").appendChild(li);
      count++;
    }
  });

  // Set notification badge for imminent weather predictions
  $("a[href='#collapseOne']")[0].innerHTML = "Predictions (" + count + ")";
}

//------------------------------------------------------------------------------
// Retrieves the current emergency shipments requested
function getEmergencyShipments() {

  var count = 0;
  Locations.forEach(function(location){
    if (location.type === "S" && location.status === "pending") {
      insertWeatherBadge(location.name, "wi-snow", location.desc);
      var li = document.createElement("li");
      li.setAttribute("id", location.uniqueId + "-emergency");
      li.setAttribute("class", "alert-item wi wi-size-s " + "wi-snow");
      li.innerHTML = "<a href='javascript:goBack(\"" + location.name + "\")'><p class='alert-text'>" +
                       "<span class='alert-header'>Conditions: </span>" + "Heavy snowstorms" + "</br>" +
                       "<span class='alert-header'>Suggestion: </span>" + "Non-perishables and snow removal equipment" + "</br>" +
                       "<span class='alert-header'>Method: </span>" + "Express" +
                     "</p></a>" +
                     "<div class='icon-con'><i class='notify-icon'></i></div>";
      document.getElementById("emergency-list").appendChild(li);
      count++;
    }
  });

  // Set notification badge for emergency shipments
  $("a[href='#collapseTwo']")[0].innerHTML = "Emergency Shipments (" + count + ")";
}

//------------------------------------------------------------------------------
// Insert a corresponding weather icon on the retail location
function insertWeatherBadge(locationName, iconClass, desc) {
  var icon = document.createElement("sup");
  icon.setAttribute("class", "weather-badge wi wi-size-xs " + iconClass);
  var iconDiv = $("div[title='" + locationName + "']");
  if (iconDiv[0])
    iconDiv[0].appendChild(icon);
  else {
    setTimeout(function() {
      $("div[title='" + locationName + "']")[0].appendChild(icon);
    }, 1000);
  }
}

//------------------------------------------------------------------------------
//
function getIconZoom(zoomLevel) {
  if (zoomLevel < 4) {
    return {
      'zoomClass': "wi-size-xs",
      'zoomSize': [20,20]
    };
  }
  else if (zoomLevel === 4) {
    return {
      'zoomClass': "wi-size-s",
      'zoomSize': [32,32]
    };
  }
  else if (zoomLevel === 5) {
    return {
      'zoomClass': "wi-size-m",
      'zoomSize': [48,48]
    };
  }
  else if (zoomLevel === 6) {
    return {
      'zoomClass': "wi-size-l",
      'zoomSize': [56,56]
    };
  }
  else if (zoomLevel === 7) {
    return {
      'zoomClass': "wi-size-xl",
      'zoomSize': [64,64]
    };
  }
  else if (zoomLevel > 7) {
    return {
      'zoomClass': "wi-size-xxl",
      'zoomSize': [64,64]
    };
  }
}

//------------------------------------------------------------------------------
// Sets back button on popups
function goBack(locationName) {
  $("div[title='" + locationName + "']").click();
}

//------------------------------------------------------------------------------
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------
