// Licensed under the Apache License. See footer for details.
var path = require("path"),
    async    = require("async"),
    request  = require("request");

//------------------------------------------------------------------------------
exports.create = createService;

//------------------------------------------------------------------------------
function createService(insightsUrl, port) {
  return new Service(insightsUrl, port);
}

//------------------------------------------------------------------------------
function Service(insightsUrl, port) {
  this.insightsUrl    = insightsUrl + ":" + port + "/api/weather";
  this.version = "/v2";
  this.observations = "/observations";
  this.forecasts = "/forecast";
  this.language = "en-US";
}

Service.prototype.getCurrentConditions2  = Service__getCurrentConditions2;
Service.prototype.getForecastedConditions = Service__getForecastedConditions;

//------------------------------------------------------------------------------
// Gets current weather data for lat/lon
function Service__getCurrentConditions2(lat, lon, units, cb) {

  // Builds REST URL for requesting current weather
  var url = this.insightsUrl + this.version + this.observations + "/current";

  // Add request parameters
  var requestOpts = {
    url: url,
    qs: {
      units:   units,
      geocode: lat + "," + lon,
      language:    this.language
    }
  };

  // Caches and returns current weather data for input lat/lon
  request(requestOpts, function(err, message, result) {
    var result = checkError(result);
    //console.log(JSON.parse(result));
    cb(result);
  })
}

//------------------------------------------------------------------------------
// Gets forecasted weather data for next 10 days
function Service__getForecastedConditions(lat, lon, units, cb) {

  // Builds REST URL for requesting current weather
  var url = this.insightsUrl + this.version + this.forecasts + "/daily/10day";

  // Add request parameters
  var requestOpts = {
    url: url,
    qs: {
      units:   units,
      geocode: lat + "," + lon,
      language:    this.language
    }
  };

  // Caches and returns current weather data for input lat/lon
  request(requestOpts, function(err, message, result) {
    var result = checkError(result);
    //console.log(JSON.parse(result));
    cb(result);
  })
}

//------------------------------------------------------------------------------
function right(s, pad, len) {
  s   = "" + s
  pad = "" + pad

  while (s.length < len) s = pad + s

  return s
}

//------------------------------------------------------------------------------
// Checks if the API response contains an error and adds an statusCode parameter
// Also logs to error stream
function checkError(result) {
  var resultJSON = JSON.parse(result);
  if (resultJSON.metadata.status_code !== 200) {
    // Create log entries for each returned error
    var errors = resultJSON.errors;
    if (errors.length > 0) {
      for (var i=0; i < errors.length; i++) {
        console.error("(" + errors[i].error.code + "): " + errors[i].error.message);
      }
    }
    resultJSON.statusCode = resultJSON.metadata.status_code;
    return JSON.stringify(resultJSON);
  }
  else {
    resultJSON.statusCode = 200;
    return JSON.stringify(resultJSON);
  }
}

//------------------------------------------------------------------------------
// Adjusts date if Feb 28
function adjustDayForLeapYear(month, day) {
  return ((month == 2) && (day == 29)) ? 28 : day;
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
