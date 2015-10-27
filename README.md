# Supply Chain Weather Overview

Supply Chain Weather is a sample Bluemix application which utilizes the [Weather Channel][weather_api_url] service and two mapping APIs, [Leaflet][leaflet_url] and [Esri Leaflet][esri_leaflet_url] to dynamically create and augment shipments for a retail chain store's supply chain.

![Bluemix Deployments](https://deployment-tracker.mybluemix.net/stats/a8b5d364b1994a80342395cc781ea890/badge.svg)


## Troubleshooting

The primary source of debugging information for your Bluemix app is the logs. To see them, run the following command using the Cloud Foundry CLI:

  ```
  $ cf logs supply-chain-weather --recent
  ```
For more detailed information on troubleshooting your application, see the [Troubleshooting section](https://www.ng.bluemix.net/docs/troubleshoot/tr.html) in the Bluemix documentation.

## Contribute
We are more than happy to accept external contributions to this project, be it in the form of issues and pull requests. If you find a bug, please report it via the [Issues section][issues_url] or even better, fork the project and submit a pull request with your fix! Pull requests will be evaulated on an individual basis based on value add to the sample application.

### Credit
 Warning icon made by [Amit Jakhu][amit_jakhu_url] [[source]][warning_icon_url]  
Stop icon made by [freepik][freepik_url] [[source]][stop_icon_url]  
Distribution center icon made by [freepik][freepik_url] [[source]][dist_center_icon_url]  
Retail location icon made by [SimpleIcon][simple_icon_url] [[source]][retail_loc_icon_url]  
Ground shipment icons made by [freepik][freepik_url] [[source]][ship_ground_icon_url]  
Express shipment icons made by [freepik][freepik_url] [[source]][ship_express_icon_url]

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
[amit_jakhu_url]: http://www.amitjakhu.com/
[warning_icon_url]: http://www.flaticon.com/free-icon/warning-triangle_10190
[freepik_url]: http://www.freepik.com/
[stop_icon_url]: http://www.flaticon.com/free-icon/stop-sign_1722
[dist_center_icon_url]: http://www.flaticon.com/free-icon/warehouse-with-boxes_75762
[simple_icon_url]: http://simpleicon.com/
[retail_loc_icon_url]: http://www.flaticon.com/free-icon/store_33658
[ship_ground_icon_url]: http://www.flaticon.com/free-icon/delivery-truck_31520
[ship_express_icon_url]: http://www.flaticon.com/free-icon/airplane-flight_67076