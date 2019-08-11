# Explore Places

This is a simple project for interacting with the Google places API. 
I intend to create an AWS lamba function which collects place information from the Places API
and then caches it in a DynamoDB. I also serve up the data as an excel spreadsheet.

## Local Usage
```
npm install
// Save-as config/default.json to config/custom.json
export NODE_ENV=custom
node index.js
// This will output place JSON to the console
```  

## Lambda Usage
This does not cover creation of a lambda function. Once a function has been created, follow this steps

```
npm install
npm build
npm zip
// Upload the resulting zip file in the Lamba console

```
