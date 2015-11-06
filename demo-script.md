#### Disclaimer

This is **work in progress** and not all steps and/or technical details are fully thought out or implemented yet.

## Pre-Demo Preparation

Follow the detailed instruction in the [README.md file](/README.md).

## The Demo

### 1. Set the stage

Start the conversation off by going over the impact that weather has on day-to-day business operations. The [IBM & Weather Company website](http://www.weathermeansbusiness.com/) provides a great overview on how businesses can leverage weather analytics to make smarter and dynamic decisions. Some great examples include:

*  **Insurance** - Alert customers to impending weather for claims avoidance
*  **Emergency Response** - Precision weather insights to foster advanced planning and faster responses
*  **Utilities** - Better predict locations of costly outages to enable faster responses after bad weather

### 2. Go over retail scenario

In this demo, we will be modeling the supply chain management system of a national big box retailer. Currently, the inventory management team has a web application where they are able to track current shipments and create additional shipments on demand. Shipments are scheduled weekly and based entirely on past buying habits at each of the retail locations.

To demonstrate how Bluemix and weather data can be used to enhance this simple supply chain management app, we will augment it with weather analytics and an accompanying mobile app.

Retail sales are heavily affected by disruptive weather events, but it is difficult to predict these events and take action on them. This [video on Watson Analytics](https://www.youtube.com/watch?v=UwbGd520u_o) demonstrates how combining weather data with retail analytics can help retailers understand how weather impacts their business. Once we understand this, we can use this knowledge to augment existing systems to incorporate this data and make smarter decisions.

### 3. Show the initial app

Log into Bluemix

Bring up the dashboard and click on the running application

Explain that this a node.js app running on the Bluemix cloud, emphasizing that it was built in a small amount of time using various 3rd party services like the open source [Esri Leflet](http://esri.github.io/esri-leaflet/) mapping APIs.

Show the application's UI. Demonstrate how all shipments are located on the map and we can examine each shipment by drilling down on it's corresponding card in the list view. Show how we can trigger a new shipment via the web app, too.

Pull out your tablet or mobile device and show the same app on the device, demonstrating how it was built with responsive web design in mind.

Briefly mention that the datastore used for inventory is Cloudant, our managed NoSQL DB in the cloud. Most importantly, this means it will scale dynamically along with the web app.

### 4. Add weather analytics

Bring weather back into the conversation. Mention how often the supply chain is disrupted due to various weather events:

* A week-long snowstorm in New York blocks our shipping routes and non-perishables are not restocked
* An impending thunderstorm in Texas causes our umbrellas and rain gear to sell out well before it hits

These events are not only missed opportunities for sales, but result in a decrease in customer satisfaction. Applying predictive analytics to our supply chain using real-time weather insights will allow us to create relevant shipments

Go to the catalog and add the Insights for Weather service, then bind it to the supply-chain-weather app. This will automatically trigger the analytics code in the back end node.js app. We will then make edits to the front end code, removing the `hidden` class from the Weather Alerts accordian. Repush the app to Bluemix.

Open up the web app once again. You will now see that each shipment now has the weather details for its current location. In addition, there is a section to view weather alerts and corresponding shipment suggestions.

### 5. Introduce the mobile app

So now we are getting shipment suggestions based on weather, but how do we handle these. Ultimately, we need all roles in the process to be informed of additional shipments. This is why we have built a mobile app for the managers of our retail locations.

Attach the already existing Mobile Access Management service to your Bluemix. Then attach the Push Notification service and build your push notifications. Have the app pre-installed on your phone for this part.

In the web UI, create a new store to demonstrate the weather events simulation. Several shipments will be automatically created for this store based on the nearest distribution center.

Next, open up the mobile app. Select the store you just created. You will be presented with a list of the current shipments. Show how the app works, then dismiss the app to the background. **It is very important to close the app, or else you will not get the push notification in the next step**

Finally, trigger a weather simulation for the store you just created using the web UI. This will inject severe weather predictions for the location you selected and automatically trigger a shipment suggestion.

As the shipment manager, approve the newly suggested shipment.

The retail manager should receive a notification on their phone stating that an order was created based on the weather. They can either take action directly from the notification, or click it and make the decision in the app. Meanwhile, refresh the web UI and show that the shipment has been added in 'pending' mode. Accept the shipment as the retail manager.

The shipment then enters 'accepted' mode. This is where the order would be expedited and processed based on time before the weather arrives. For the sake of the demo, the app waits 15 seconds and then sends a notification to the manager saying that the order has shipped. Refreshing the UI will show that the order is now 'in transit'.

### 6. Re-iterate (maybe with a slide) what we have just done

After the applause dies down, re-iterate what we did during the demo. Ideally using a slide (with animation) that walks through the various steps again.
node.js web app <---> weather insights <---> mobile app

## Links to more information

#### [Insights for Weather](https://console.ng.bluemix.net/catalog/insights-for-weather/)


#### [Mobile Client Access](https://console.ng.bluemix.net/catalog/mobile-client-access/)


#### [IBM Push Notifications](https://console.ng.bluemix.net/catalog/ibm-push-notifications/)