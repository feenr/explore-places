const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const placeLookup = require('./place-lookup');

/**
 * Short term plan for this endpoint is that GET will fetch places from dynamo DB
 * POST will fetch places from google API.
 *
 * In the future GET should have a cacheing strategy and dynamically pull from dynamo DB or google API
 * @param event
 * @param context
 * @param callback
 */

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {
        case 'DELETE':
        // break;
        case 'GET':
            dynamo.scan({ TableName: 'explore-stoneham-restaurants' }, done);
            break;
        case 'POST':
            let placeList = [];
            placeLookup.lookupAllPlacesObserable().subscribe({
                next(response){
                    placeList = response;
                },
                complete(){
                    done(placeList);
                }
            });
            break;
        //break;
        case 'PUT':

        // break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};



