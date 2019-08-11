# Explore Places

This is a simple project for interacting with the Google places API. 
I intend to create an AWS lamba function which collects place information from the Places API
and then caches it in a DynamoDB. I also serve up the data as an excel spreadsheet.

## Usage
```
npm install
// Save-as default.json as custom.json
export NODE_ENV=custom
node place-lookup.js
```  
