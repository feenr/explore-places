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
This does not cover creation of a lambda function. Once a function has been created, follow these steps

```
npm install
npm run zip-layer
publish-layer-version --layer-name explore-places-dependencies --zip-file fileb://dist/lambda-layer.zip
npm run zip
aws lambda update-function-code --function-name [lambda-name] --zip-file fileb://dist/lambda.zip
// Add explor-places-dendencies layer to Lambda runtime
aws lambda invoke --function-name explore-stoneham-restaurants --payload '{"httpMethod":"GET"}'  test.txt
```
