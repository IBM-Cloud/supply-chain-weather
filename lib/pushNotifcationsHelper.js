var restler = require("restler");

var PROD_PUSH_SECRET = process.env.PROD_PUSH_SECRET,
    PROD_PUSH_ID = process.env.PROD_PUSH_ID,
    DEV_PUSH_SECRET = process.env.DEV_PUSH_SECRET,
    DEV_PUSH_ID = process.env.DEV_PUSH_ID;

var pushURL = "https://mobile.ng.bluemix.net/imfpush/v1/apps/"

module.exports = {
    notifyShipmentCreated: function (shipment, environment, callback) {
        var secret = "";
        var url = pushURL;
        if (environment === "prod") {
            url += PROD_PUSH_ID + "/messages"
            secret = PROD_PUSH_SECRET;
        }
        else {
            url += DEV_PUSH_ID + "/messages"
            secret = DEV_PUSH_SECRET;
        }
        var itemsCount = 0;

        for (var i = 0; i < shipment.items.length; i++) {
            itemsCount += shipment.items[i].quantity;
        }
        var jsonData = {
            "message": {
                "alert": "There is a snow storm coming, do you want an extra " + itemsCount + " " + shipment.description + " to stock up?"
            },
            "settings": {
                "apns": {
                    "payload": shipment.uniqueId,
                    "badge": 0,
                    "sound": "",
                    "iosActionKey": "",
                    "type": "DEFAULT",
                    "category": "NEW_SHIPMENT"
                }
            }
        }
        var options = {
            headers: {
                "Content-Type": "application/json",
                "appSecret": secret
            }
        }

        restler.postJson(url, jsonData, options).on("complete", callback);
    },

    notifyShipmentShipped: function (shipment, environment, callback) {
        var secret = "";
        var url = pushURL;
        if (environment === "prod") {
            url += PROD_PUSH_ID + "/messages"
            secret = PROD_PUSH_SECRET;
        }
        else {
            url += DEV_PUSH_ID + "/messages"
            secret = DEV_PUSH_SECRET;
        }

        var itemsCount = 0;

        for (var i = 0; i < shipment.items.length; i++) {
            itemsCount += shipment.items[i].quantity;
        }

        var jsonData = {
            "message": {
                "alert": itemCount + "of " shipment.description + " have been shipped!"
            }
        }
        var options = {
            headers: {
                "Content-Type": "application/json",
                "appSecret": secret
            }
        }

        restler.postJson(url, jsonData, options).on("complete", callback);
    }
}
