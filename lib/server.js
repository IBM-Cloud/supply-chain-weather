// Licensed under the Apache License. See footer for details.
var hapi  = require("hapi"),
    cfenv = require("cfenv"),
    async = require("async");

//---Environment Vars-----------------------------------------------------------
var vcapLocal = null
try {
  vcapLocal = require("../vcap-local.json")
}
catch (e) {}

var appEnvOpts = vcapLocal ? {vcap:vcapLocal} : {}
var appEnv = cfenv.getAppEnv(appEnvOpts);

//---Set up Cloudant------------------------------------------------------------
var cloudantCreds = getServiceCreds(appEnv, "supply-chain-datastore"),
    nano = require("nano")(cloudantCreds.url),
    dbHelper = require("./cloudantHelper.js"),
    pushNotifcationsHelper = require("./pushNotifcationsHelper.js"),
    dbName = "inventory",
    db;

//Construct 'intercom' DB if it does not exist
dbHelper.dbExists(nano, dbName, function (err,res) {
  if (!err) {
    if (res) {
      db = nano.db.use(dbName);
      console.log("'" + dbName + "' found - using DB");
    }
    else {
      console.log("'" + dbName + "' not found - creating DB");
      nano.db.create(dbName, function(err, body) {
        if (err) {
          console.error('Error creating ' + dbName);
        }
        else {
          console.log("'" + dbName + "' DB created");
          db = nano.db.use(dbName);
          seedDB(true);
        }
      });
    }
  }
  else {
    console.error("Could not verify if DB exists. Issues may result");
  }
});

//---Set up Weather-------------------------------------------------------------
var weather = getServiceCreds(appEnv, "supply-chain-weather-insights"),
    wService = require("./weatherService").create(weather.url, weather.port);

//------------------------------------------------------------------------------
process.on("exit", function(code) {
  console.log("exiting: code: " + code);
})

process.on("uncaughtException", function(err) {
  console.log("uncaught exception: " + err.stack);
  process.exit(1);
})

//------------------------------------------------------------------------------

var server = new hapi.Server({
  connections: {
    routes: {
      cors: true
    }
  }
});
server.connection({host: appEnv.bind, port: appEnv.port});

// Route calls to main page
server.route({
  method:  "GET",
  path:    "/{param*}",
  handler: { directory: { path: "www" } }
})

// Route API calls to retrieve current weather data
server.route({
  method:  "GET",
  path:    "/api/currentConditions",
  handler: api_currentConditions
})

// Route API calls to retrieve historical weather data
server.route({
  method:  "GET",
  path:    "/api/forecastedConditions",
  handler: api_forecastedConditions
})

// Route API calls to get location of the distribution centers
server.route({
  method:  "GET",
  path:    "/api/v1/db/distribution",
  handler: api_getDistributionCenters
})

// Route API calls to get location of the retail locations
server.route({
  method:  "GET",
  path:    "/api/v1/db/retail",
  handler: api_getRetailLocations
})

// Route API calls to get shipments
server.route({
  method:  "GET",
  path:    "/api/v1/db/shipments",
  handler: api_getShipments
})

server.route({
  method:  "POST",
  path:    "/api/v1/db/shipments",
  handler: api_createShipment
})

server.route({
  method:  "GET",
  path:    "/api/v1/db/shipments/notify",
  handler: api_notifyStoreOwner
})

server.route({
  method:  "GET",
  path:    "/api/v1/db/shipments/status",
  handler: api_updateShipmentStatusFromPush
})

server.route({
  method:  "GET",
  path:    "/api/v1/db/reset",
  handler: api_resetDB
})

// Route API calls to get shipments
server.route({
  method:  "GET",
  path:    "/api/v1/db/items",
  handler: api_getItems
})

console.log("server starting on: " + appEnv.url)
server.start(function() {
  console.log("server started  on: " + appEnv.url)
})

//----Weather APIs--------------------------------------------------------------
// Reqest Handler for getting current weather data
function api_currentConditions(request, reply) {
  var lat = request.query.latitude;
  var lon = request.query.longitude;
  var units = request.query.units;

  console.log("Server.js - Getting current conditions @ " + lat + ", " + lon + " in '" + units + "' units");
  wService.getCurrentConditions(lat, lon, units, function(result) {
    // If error, log error and return
    var resultJSON = JSON.parse(result);
    if (resultJSON.statusCode !== 200) reply(result);
    // If success, extract important results and return data
    else {
      var currentConditions = {
        iconCode:         resultJSON.observation.icon_code,
        conditionPhrase:  resultJSON.observation.phrase_32char,
        temp:             (resultJSON.observation.imperial) ? resultJSON.observation.imperial.temp : resultJSON.observation.metric.temp,
        statusCode:       200
      };

      var ccString = JSON.stringify(currentConditions);
      reply(ccString);
    }
  })
}

// Reqest Handler for getting forecasted weather data
function api_forecastedConditions(request, reply) {
  var lat = request.query.latitude;
  var lon = request.query.longitude;
  var units = request.query.units;

  console.log("Server.js - Getting forecasted conditions @ " + lat + ", " + lon + " in '" + units + "' units");
  /*wService.getForecastedConditions(lat, lon, function(result) {
    if (result && result.length > 0) {
      // Loop through returned historical results
      var conditions = [],
          conditionDate,
          conditionYear,
          obs;
      for (var i=0; i < result.length; i++) {
        // If no results for year, skip result
        if (result[i].error) {
          continue;
        }

        // Check for null values
        obs = result[i].observations[0];
        if (!obs.valid_time_gmt) continue;
        if (!obs.temp) continue;
        if (!obs.wx_phrase) obs.wx_phrase = "Unknown";

        // Extract important info from the historical condition
        conditionDate = new Date(obs.valid_time_gmt * 1000);
        conditionYear = conditionDate.getYear() + 1900;
        conditions.push(JSON.stringify([conditionYear, obs.temp, obs.wx_phrase]));
      }
      reply(conditions);
    }
    else
      reply(null);
  })*/
}

//----Database APIs-------------------------------------------------------------
// Reqest Handler for getting distribution centers
function api_getDistributionCenters(request, reply) {
  dbHelper.getRecords(db, 'distribution_centers', 'dist_index', function(result) {
    reply(result);
  });
}

// Reqest Handler for getting retail locations
function api_getRetailLocations(request, reply) {
  dbHelper.getRecords(db, 'retail_locations', 'retail_index', function(result) {
    reply(result);
  });
}

// Reqest Handler for getting distribution centers
function api_getShipments(request, reply) {
  dbHelper.getRecords(db, 'shipments', 'shipments_index', function(result) {
    reply(result);
  });
}

// Reqest Handler for getting items
function api_getItems(request, reply) {
  dbHelper.getRecords(db, 'items', 'items_index', function(result) {
    reply(result);
  });
}

function api_resetDB(request, response) {
  try {
    // Retrieve chat records and delete them
    dbHelper.getRecords(db, 'shipments', 'shipments_index', function(result) {
      var shipments = JSON.parse(result);
      for (var i=0; i < shipments.length; i++) {
        dbHelper.deleteRecord(db, shipments[i].uniqueId, shipments[i].revNum, function(result) {});
      }
      // Retrieve message records and delete them
      dbHelper.getRecords(db, 'distribution_centers', 'dist_index', function(result) {
        var dists = JSON.parse(result);
        for (var i=0; i < dists.length; i++) {
          dbHelper.deleteRecord(db, dists[i].uniqueId, dists[i].revNum, function(result) {});
        }
        // Retrieve rep records and mark them all as Available
        dbHelper.getRecords(db, 'retail_locations', 'retail_index', function(result) {
          var rets = JSON.parse(result);
          for (var i=0; i < rets.length; i++) {
            dbHelper.deleteRecord(db, rets[i].uniqueId, rets[i].revNum, function(result) {});
          }
          dbHelper.getRecords(db, 'items', 'items_index', function(result) {
          var items = JSON.parse(result);
            for (var i=0; i < items.length; i++) {
              dbHelper.deleteRecord(db, items[i].uniqueId, items[i].revNum, function(result) {});
            }
            setTimeout(function() {
              seedDB(false);
              response({
                'success': true
              });
            }, 5000)
          });
        });
      });
    });
  }
  catch (err) {
    console.error("Error cleansing the Cloudant DB", err);
    response({
      'success': false,
      'error': 'Error cleansing Cloudant DB'
    });
  }
}

function api_createShipment(request, response) {
  request.payload.curLat = parseFloat(request.payload.curLat);
  request.payload.curLon = parseFloat(request.payload.curLon);

  for (var i = 0; i < request.payload.items.length; i++) {
    request.payload.items[i].quantity = parseInt(request.payload.items[i].quantity)
  }
  dbHelper.insertRecord(db, request.payload, response);
}

function api_notifyStoreOwner(request, response) {
  var shipmentID = request.query.shipment,
    environment = request.query.environment;

  dbHelper.getRecord(db, 'shipments', 'shipments_index', shipmentID, function (error, result) {
    if (error) {
      response(error);
      return;
    }

    pushNotifcationsHelper.notifyShipmentCreated(result, environment, function (data) {
      response(data);
    });
  });
}

function api_updateShipmentStatusFromPush(request, response) {
  var shipmentID = request.query.shipment,
    status = request.query.status,
    environment = request.query.environment;

  async.waterfall([
      function (next) {
        dbHelper.updateShipmentStatus(db, shipmentID, status, next);
      },
      function (result, next) {
        dbHelper.getRecord(db, 'shipments', 'shipments_index', shipmentID, next);
      },
      function (result, next) {
        //sleep a bit to simulate a real backend system creating a shipment
        if (status === "accepted") {
          setTimeout(function() {
            status = "shipped";
            dbHelper.updateShipmentStatus(db, shipmentID, status, next);
          }, 15000);
        }
        else {
          next(null, null);
        }
      },
      function (result, next) {
        dbHelper.getRecord(db, 'shipments', 'shipments_index', shipmentID, next);
      },
      function (result, next) {
        if (status === "shipped") {
          pushNotifcationsHelper.notifyShipmentShipped(result, environment, function (data) {
            console.log("sent notification");
            next();
          });
        }
        else {
          next();
        }
      }
    ], response
  );
}

//---Server Functions-----------------------------------------------------------
// Ensures an input service is found in VCAPS
// If found, returns the service credentials
function getServiceCreds(appEnv, serviceName) {
  var serviceCreds = appEnv.getServiceCreds(serviceName)
  if (!serviceCreds) {
    console.log("service " + serviceName + " not bound to this application");
    return null;
  }
  return serviceCreds;
}

// Set up the DB to default status
function seedDB(design) {
  // Retrieve design and sample data docs and insert them
  var sampleDataDocs = require("./starter_docs/sample-data-docs.json");
  insertDocs(sampleDataDocs);

  if (design) {
    var designDocs = require("./starter_docs/design-docs.json");
    insertDocs(designDocs);
  }
}

// Inserts an array of JSON documents into the DB
function insertDocs(docArray) {
  docArray.forEach(function(doc) {
    db.insert(doc, doc._id, function(err, body) {
      if (!err)
        console.log(body);
      else
        console.error(err);
    });
  });
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
