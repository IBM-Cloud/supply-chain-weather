# Supply Chain Weather Overview

Supply Chain Weather is a sample Bluemix application which utilizes the [Insights for Weather][weather_service_url] service and two mapping APIs, [Leaflet][leaflet_url] and [Esri Leaflet][esri_leaflet_url] to dynamically create and augment shipments for a retail chain store's supply chain.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy)  
[![Build Status](https://travis-ci.org/IBM-Bluemix/supply-chain-weather.svg?branch=master)](https://travis-ci.org/IBM-Bluemix/supply-chain-weather)
![Bluemix Deployments](https://deployment-tracker.mybluemix.net/stats/a8b5d364b1994a80342395cc781ea890/badge.svg)

## Running the app on Bluemix

The easiest way to deploy the app is to click the `Deploy to Bluemix` button above, but here you will find the instructions on manually deploying the application.

1. If you do not already have a Bluemix account, [sign up here][bluemix_signup_url]

2. Download and install the [Cloud Foundry CLI][cloud_foundry_url] tool

3. Clone the app to your local environment from your terminal using the following command:

  ```
  git clone https://github.com/IBM-Bluemix/supply-chain-weather.git
  ```

4. `cd` into this newly created directory

5. Open the `manifest.yml` file and change the `host` value to something unique.

  The host you choose will determinate the subdomain of your application's URL:  `<host>.mybluemix.net`

6. Connect to Bluemix in the command line tool and follow the prompts to log in.

  ```
  $ cf api https://api.ng.bluemix.net
  $ cf login
  ```

7. Create the Weather Channel service in Bluemix.

  ```
  $ cf create-service weatherinsights Free supply-chain-weather-insights
  ```
  
8. Create the Cloudant service in Bluemix.

  ```
  $ cf create-service cloudantNoSQLDB Shared supply-chain-datastore
  ```

9. Push the app to Bluemix.

  ```
  $ cf push
  ```

## Run the app locally
1. If you do not already have a Bluemix account, [sign up here][bluemix_signup_url]

2. If you have not already, [download node.js][download_node_url] and install it on your local machine.

3. Clone the app to your local environment from your terminal using the following command:

  ```
  git clone https://github.com/IBM-Bluemix/supply-chain-weather.git
  ```

4. `cd` into this newly created directory

5. Install the required npm and bower packages using the following command

  ```
  npm install
  ```

6. Create an instance of both the [Weather Channel service][weather_service_url] and the [Cloudant service][cloudant_service_url] using your Bluemix account. Once you have these services, replace the corresponding credentials in your `vcap-local.json` file

9. Start your app locally with the following command

  ```
  npm run watch
  ```

This command will trigger [`cake`][cake_url] to build and start your application. When your app has started, your console will print that your `server started on: http://localhost:6020`.

Since we are using `cake`, the app is rebuilt continuously as changes are made to the local file system. Therefore, you do not have to constantly stop and restart your app as you develop locally. Execute `npm run cake` to see the other commands available in the `Cakefile`.

Happy developing!

## REST API

### Conditions
**Current Conditions**  
Description: Retrieve the current conditions at the input coordinates  
Example: `GET /api/v1/currentConditions?latitude=32.36&longitude=-86.27&units=e`  
**Forecasted Conditions**  
Description: Retrieve the 10 day forecast at the input coordinates  
Example: `GET /api/v1/forecastedConditions?latitude=32.36&longitude=-86.27&units=e`

### Database (CRUD)
**Distribution Centers**  
Description: Retrieve a list of all the distribution centers  
Retrieve Example: `GET /api/v1/db/distribution`  
**Retail Locations**  
Description: Retrieve a list of all the retail locations  
Retrieve Example: `GET /api/v1/db/retail`  
**Shipments**  
Description: Retrieve a list of all the shipments  
Create Example: `POST /api/v1/db/shipments` with payload:

	{  
	    "_id": "S9",
	    "type": "shipment",  
	    "service": "ground",
	    "desc": "This is a sample shipment description",
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
	        }
	    ]
	}

Retrieve Example: `GET /api/v1/db/shipments`  
**Items**  
Description: Retrieve a list of all the items  
Retrieve Example: `GET /api/v1/db/items`  

### Mobile Push
**Shipment Notification**  
Description: Notifies the store manager than a new shipment has been created  
Example: `GET /api/v1/db/shipments/notify?shipment=S7&environment=dev`  
**Shipment Status Update**  
Description: Change the status of a shipment based on a manager response  
Example: `GET /api/v1/db/shipments/status?shipment=S7&status=accepted&environment=dev`  

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
* Help icon made by [Consumer Financial Protection Bureau][cfpb_url] [[source]][help_icon_url]

## Privacy Notice
The supply-chain-weather sample web application includes code to track deployments to Bluemix and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/cloudant-labs/deployment-tracker) service on each deployment:

* Application Name (application_name)
* Space ID (space_id)
* Application Version (application_version)
* Application URIs (application_uris)

This data is collected from the VCAP_APPLICATION environment variable in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

### Disabling Deployment Tracking

Deployment tracking can be disabled by removing `require("cf-deployment-tracker-client").track();` from the beginning of the `app.js` file.


<!--Links-->
[weather_service_url]: https://console.ng.bluemix.net/catalog/services/insights-for-weather/
[cloudant_service_url]: https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db/
[leaflet_url]: http://leafletjs.com/
[esri_leaflet_url]: http://esri.github.io/esri-leaflet/
[bluemix_signup_url]: https://ibm.biz/supply-chain-weather-signup
[cloud_foundry_url]: https://github.com/cloudfoundry/cli
[download_node_url]: https://nodejs.org/en/download/
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
[help_icon_url]: https://thenounproject.com/search/?q=help&i=89674
[addylord_url]: https://thenounproject.com/adelime/
[nicholas_menghini_url]: http://nicholasmenghini.com/
[leaonardo_schneider_url]: http://www.leonardoschneider.com/
[kris_brauer_url]: https://thenounproject.com/Krisb/
[yamini_ahluwalia_url]: https://www.behance.net/yaminiahluwalia
[alain_loubet_url]: https://thenounproject.com/PictaMan/
[daniel_canabrava_url]: https://www.behance.net/DanielCanabrava
[edward_boatman_url]: https://thenounproject.com/edward/
[cfpb_url]: https://thenounproject.com/cfpb_minicons/
