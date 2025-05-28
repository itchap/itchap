# SFDC to Atlas Data Exporter

This chrome extension exports table data from Salesforce views and sends the data to the MongoDB Atlas Data API for storage. The extension is designed to make it easy for users to export data from Salesforce and store it in a MongoDB Atlas cluster for further analysis and use.

## How it works

1. The extension uses the `content.js` script to extract the data from the table on the Salesforce Opportunity View.

2. The extracted data is then cleaned up and converted to a JSON format by the `background.js` script.

3. The cleaned data is sent to the MongoDB Atlas Data API using the credentials provided by the user in the extension's `popup.html` page.

4. The data is stored in the specified cluster, database and collection in MongoDB Atlas.

## Getting Started

1. Clone the repository 

git clone https://github.com/USERNAME/SFDC-to-Atlas-Data-Exporter.git

2. Go to chrome://extensions/ in chrome and turn on developer mode.

3. Click on load unpacked and select the cloned directory

4. Fill in the necessary credentials in the `popup.html` page

5. Visit the Salesforce Opportunity View and click on the extension to start exporting the data.

## Built With

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Bootstrap](https://getbootstrap.com/)
- [MongoDB Atlas Data API](https://www.mongodb.com/docs/atlas/app-services/data-api/)

## Authors

- **Peter Smith** - *Initial work* - [ITChap](https://github.com/itchap)
