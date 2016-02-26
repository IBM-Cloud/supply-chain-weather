/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//---cloudantHelper.js------------------------------------------------------------
module.exports = {

  // Insert a record
  insertRecord: function(db, record, response) {
    db.insert(record, function(err, body, header) {
      if (!err && body.ok === true) {
        console.log("Successfully saved the following record to DB:\n", record);
        response(null, body);
      }
      else {
        console.error("Saving the following record to DB failed:\n", record);
        response(err);
      }
    });
  },

  // Delete a record
  deleteRecord: function(db, uniqueId, revNum, response) {
    db.destroy(uniqueId, revNum, function(err, body, header) {
      if (!err) {
        console.log("Successfully deleted the following event from DB:\n", uniqueId);
        response("Success");
      }
      else {
        console.error("Deleting " + uniqueId + " failed");
        response(err);
      }
    });
  },

  // Returns JSON records from the input view using the index
  getRecords: function(db, view, index, response) {
    db.view(view, index, function(err, body) {
      if (!err) {
        var docs = [];
          body.rows.forEach(function(doc) {
            docs.push(doc.value);
          });
          response(JSON.stringify(docs));
      }
      else {
        console.error("Getting documents from " + view + " failed with error: ", err);
        response(err);
      }
    });
  },

  getRecord: function(db, view, index, key, callback) {
    var params = {
      "keys": [key]
    }
    db.view(view, index, params, function (err, body) {
      if (!err) {
        if (body.rows.length > 0) {
          callback(null, body.rows[0].value);
        }
        else {
          callback(null, JSON.stringify({}));
        }
      }
      else {
        console.error("Getting documents from " + view + " failed with error: ", err);
        response(error);
      }
    });
  },

  updateShipmentStatus: function(db, shipmentID, status, callback){
    db.get(shipmentID, function (error, body) {
      if (error) {
        callback(error);
        return;
      }
      body.status = status;
      db.insert(body, shipmentID, function(error, body, headers) {
        if (error) {
          callback(error);
        }
        else {
          callback(null, body);
        }
      });
    });
  },

  // Returns doc from a view with a field corresponding to input value
  // Result is first doc found with field equivalent to value
  getDoc: function(db, view, index, field, value, response) {
    this.getRecords(db, view, index, function(result) {
      if (!result.name) {
        // Look for the matching record
        var results = JSON.parse(result),
            docFound = false;
        for (var i=0; i < results.length; i++) {
          if (results[i][field] === value) {
            response(results[i]);
            docFound = true;
            break;
          }
        }
        // If doc was not found, respond with error object
        if (!docFound) {
          response({
            'error' : "Record not found in returned results set"
          });
        }
      }
      else {
        response(result);
      }
    });
  },

  // Returns true if input DB exists, otherwise false
  dbExists: function(nano, dbName, response) {
    nano.db.list(function(err, body) {
      if (!err) {
        var dbFound = false;
        body.forEach(function(db) {
          if (db === dbName) {
            dbFound = true;
          }
        });
        response (null, dbFound);
      }
      else {
        var error = "Error getting list of DBs";
        console.error(error);
        response(error, null);
      }
    });
  }
}
