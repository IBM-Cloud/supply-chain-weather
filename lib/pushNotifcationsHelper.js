var restler = require("restler");

var PROD_PUSH_SECRET = process.env.PROD_PUSH_SECRET,
    PROD_PUSH_ID = process.env.PROD_PUSH_ID,
    DEV_PUSH_SECRET = process.env.DEV_PUSH_SECRET,
    DEV_PUSH_ID = process.env.DEV_PUSH_ID;

var pushURL = "https://mobile.ng.bluemix.net/imfpush/v1/apps/"

module.export = {
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

        var jsonData = {
            "message": {
                "alert": "There is a snow storm coming, do you want an extra 2 " + shipment.description + " to stock up?"
            },
            "settings": {
                "apns": {
                    "payload": "object",
                    "badge": 0,
                    "sound": "",
                    "iosActionKey": "",
                    "type": "DEFAULT",
                    "category": "TODO"
                }
            }
        }
        var options = {
            headers: {
                "Content-Type": "application/json",
                "appSecret": secret
            }
        }

        rest.postJson(url, jsonData).on("complete", callback);
    }
}
