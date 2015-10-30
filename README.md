# Supply Chain Weather Overview

Supply Chain Weather is a sample Bluemix application which utilizes the [Weather Channel][weather_api_url] service and two mapping APIs, [Leaflet][leaflet_url] and [Esri Leaflet][esri_leaflet_url] to dynamically create and augment shipments for a retail chain store's supply chain.

[![Build Status](https://travis-ci.org/IBM-Bluemix/supply-chain-weather.svg?branch=master)](https://travis-ci.org/IBM-Bluemix/supply-chain-weather)
![Bluemix Deployments](https://deployment-tracker.mybluemix.net/stats/a8b5d364b1994a80342395cc781ea890/badge.svg)


## Example REST Calls

### Creating a shipment (example)
`POST /api/v1/db/shipments`

Body:

```
{  
    "_id": "S7",
    "type": "shipment",  
    "service": "ground",
    "desc": "Cold weather clothes",
    "distribution": "D3",
    "retail": "R4",
    "status": "pending",
    "curLoc": "Charleston, South Carolina, US",
    "curLat": 32.780891,
    "curLon": -79.93471,
    "estDel": "Thu, 24 Oct 2015",
    "lastUpdate": "Thu, 24 Oct 2015 12:15:37 GMT",
    "items": [
        {
            "item": "I1",
            "quantity": 85
        },
        {
            "item": "I2",
            "quantity": 100
        },
        {
            "item": "I3",
            "quantity": 40
        }
    ]
}
```

### Sending a notification for a new shipment (example)
`GET /api/v1/db/shipments/notify?shipment=S7&environment=dev`

## Troubleshooting

The primary source of debugging information for your Bluemix app is the logs. To see them, run the following command using the Cloud Foundry CLI:

  ```
  $ cf logs supply-chain-weather --recent
  ```
For more detailed information on troubleshooting your application, see the [Troubleshooting section](https://www.ng.bluemix.net/docs/troubleshoot/tr.html) in the Bluemix documentation.

## Contribute
We are more than happy to accept external contributions to this project, be it in the form of issues and pull requests. If you find a bug, please report it via the [Issues section][issues_url] or even better, fork the project and submit a pull request with your fix! Pull requests will be evaulated on an individual basis based on value add to the sample application.

### Credit
* Warning icon made by [Alain Loubet][alain_loubet_url] [[source]][warning_icon_url]
* Siren icon made by [Daniel Canabrava Torres][freepik_url] [[source]][daniel_canabrava_url]
* Distribution center icon made by [freepik][freepik_url] [[source]][dist_center_icon_url]
* Retail location icon made by [SimpleIcon][simple_icon_url] [[source]][retail_loc_icon_url]
* Ground shipment icon made by [freepik][freepik_url] [[source]][ship_ground_icon_url]
* Express shipment icon made by [freepik][freepik_url] [[source]][ship_express_icon_url]
* Accepted icon made by [Yamini Ahluwalia][yamini_ahluwalia_url] [[source]][accepted_icon_url]
* Rejected icon made by [Kris Brauer][kris_brauer_url] [[source]][rejected_icon_url]
* Pending icon made by [Leonardo Schneider][leaonardo_schneider_url] [[source]][pending_icon_url]
* Shipped icon made by [Nicholas Menghini][nicholas_menghini_url] [[source]][shipped_icon_url]
* Delivered icon made by [addylord][addylord_url] [[source]][delivered_icon_url]
* Notify icon made by [Edward Boatman][edward_boatman_url] [[source]][notify_icon_url]

## Privacy Notice
The supply-chain-weather sample web application includes code to track deployments to Bluemix and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/cloudant-labs/deployment-tracker) service on each deployment:

* Application Name (application_name)
* Space ID (space_id)
* Application Version (application_version)
* Application URIs (application_uris)

This data is collected from the VCAP_APPLICATION environment variable in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

### Disabling Deployment Tracking

Deployment tracking can be disabled by removing `require("cf-deployment-tracker-client").track();` from the beginning of the `app.js` file.

[weather_api_url]: http://www.wunderground.com/weather/api/
[leaflet_url]: http://leafletjs.com/
[esri_leaflet_url]: http://esri.github.io/esri-leaflet/
[bluemix_signup_url]: https://ibm.biz/supply-chain-weather-signup
[cloud_foundry_url]: https://github.com/cloudfoundry/cli
[download_node_url]: https://nodejs.org/download/
[cake_url]: http://coffeescript.org/#cake
[issues_url]: https://github.com/IBM-Bluemix/supply-chain-weather/issues
[warning_icon_url]: https://thenounproject.com/search/?q=warning&i=14055
[freepik_url]: http://www.freepik.com/
[siren_icon_url]: https://thenounproject.com/search/?q=siren&i=16370
[dist_center_icon_url]: http://www.flaticon.com/free-icon/warehouse-with-boxes_75762
[simple_icon_url]: http://simpleicon.com/
[retail_loc_icon_url]: http://www.flaticon.com/free-icon/store_33658
[ship_ground_icon_url]: http://www.flaticon.com/free-icon/delivery-truck_31520
[ship_express_icon_url]: http://www.flaticon.com/free-icon/airplane-flight_67076
[accepted_icon_url]: https://thenounproject.com/search/?q=processing&i=117179
[pending_icon_url]: https://thenounproject.com/search/?q=progress&i=99631
[rejected_icon_url]: https://thenounproject.com/search/?q=rejected&i=182502
[shipped_icon_url]: https://thenounproject.com/search/?q=in+progress&i=17052
[delivered_icon_url]: https://thenounproject.com/search/?q=completed&i=21729
[notify_icon_url]: https://thenounproject.com/search/?q=alarm&i=291
[addylord_url]: https://thenounproject.com/adelime/
[nicholas_menghini_url]: http://nicholasmenghini.com/
[leaonardo_schneider_url]: http://www.leonardoschneider.com/
[kris_brauer_url]: https://thenounproject.com/Krisb/
[yamini_ahluwalia_url]: https://www.behance.net/yaminiahluwalia
[alain_loubet_url]: https://thenounproject.com/PictaMan/
[daniel_canabrava_url]: https://www.behance.net/DanielCanabrava
[edward_boatman_url]: https://thenounproject.com/edward/
