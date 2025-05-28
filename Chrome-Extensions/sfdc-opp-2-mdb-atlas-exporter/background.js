// The background script listens for messages from the content script. When it receives a
// message of type "all_data", it receives the table data, cleans it up by removing unnecessary
// elements, formatting data types, and creating a new key called Currency to the object if the
// value had "USD" or "EUR". Then it sends the cleaned data to the MongoDB Atlas Data API with
// the data source, database, and collection specified in the request message, and sends a
// response message to the popup script with the number of documents processed.

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Check if the message received is of type "all_data"
    if (request.type === "all_data") {
        // Receive the table data from the content script
        const tableData = request.oppData;
        // Get the headers (first row) of the table
        const headers = tableData.slice(0, 1)[0];
        // Use map to create an array of objects, where each object represents a row in the table
        const jsonData = tableData.slice(1).map(row => {
            return headers.reduce((acc, curr, i) => {
                acc[curr] = row[i];
                return acc;
            }, {})
        });
        // Iterate through each object and clean them up with the appropriate data types
        jsonData.forEach(obj => {
            // Remove the 'Action' key from each object
            Object.keys(obj).forEach(key => {
                if(key === 'Action'){
                    delete obj[key];
                }
            });
            // Iterate through each key-value pair of the object
            Object.entries(obj).forEach(([key, value]) => {
                // If the value is a string
                if (obj[key] && typeof obj[key] === "string") {
                    // Remove any "USD " or "EUR " or " [Change]" text from the value
                    obj[key] = obj[key].replace(/USD |EUR | \[Change\]/g,'');
                    //create a new key called currency
                    obj['Currency'] = null;
                    //checking if the string had USD or EUR
                    if(value.indexOf("USD") !== -1){
                        obj['Currency'] = "USD";
                    }
                    else if(value.indexOf("EUR") !== -1){
                        obj['Currency'] = "EUR";
                    }
                    // Remove any "," from the value
                    const cleanedFloatString = obj[key].replace(",", "");
                    // Check if the value matches the date format "dd/mm/yyyy"
                    let dateFormat = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                    if (obj[key].match(dateFormat)) {
                        // Split the value by "/" and create a new Date object
                        let dateArray = obj[key].split("/");
                        obj[key] = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
                    }
                    // Check if the value is a number
                    else if (cleanedFloatString.match(/^\d+(\.\d{1,2})?$/)) {
                        // Check if the number is an integer or a float
                        if (!cleanedFloatString.includes(".")) {
                            obj[key] = parseInt(cleanedFloatString);
                        }
                        else {
                            obj[key] = parseFloat(cleanedFloatString);
                        }
                    }
                }
                // If the value is null, undefined, or an empty string
                if (obj[key] === null || obj[key] === undefined || (typeof obj[key] === 'string' && obj[key].trim().length === 0)) {
                    obj[key] = null;
                }
            });
        });
        // Define the MongoDB Atlas Data API endpoint, app ID and API key
        const API_KEY = request.configData.apiKey;
        const DataAPI_APP_ID = request.configData.appId;
        const apiUrl = `https://data.mongodb-api.com/app/${DataAPI_APP_ID}/endpoint/data/v1/action/updateOne`;
        // Define the data source, database, and collection
        const dataSource = request.configData.dataSource;
        const database = request.configData.db;
        const collection = request.configData.collection;
        // Loop through the jsonData array and send each object to the MongoDB Atlas Data API
        for (let x=0; x<jsonData.length; x++) {
            // Define the body of the request
            const body = {
                "dataSource": dataSource,
                "database": database,
                "collection": collection,
                "filter": {"_id": jsonData[x]._id},
                "update": {"$set": jsonData[x]},
                "upsert": true
            };
            // Define the options for the request
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': API_KEY
                },
                body: JSON.stringify(body)
            };
            // Use the fetch API to send the data to the MongoDB Atlas Data API endpoint
            fetch(apiUrl, options)
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error(error));
        }
    } else if (request.type === "no_data") {
        console.log("No data received");
    }
});
