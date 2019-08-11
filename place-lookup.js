const fs = require('fs');
const GoogleMaps = require('@google/maps');
const { Observable, from } = require('rxjs');
const config = require('config');

//Get config from file
const TIME_OUT = config.get("timeout");
const GOOGLE_API_KEY = config.get("googleApiKey");
const GOOGLE_MAPS_QUERY_ARGS = config.get("googleMapsQueryArgs");

const googleMapsClient = GoogleMaps.createClient({
    key: GOOGLE_API_KEY,
    Promise: Promise
});

/**
 * Lookup place using the query params in the configuration file using the google places API, which has a restriction
 * of 20 results per page. You may want to use lookupAllPlacesObservable
 * @returns {Observable<ObservedValueOf<ObservableInput<any>>>}
 */
function lookupPlacesObservable(){
    return from(googleMapsClient.places(GOOGLE_MAPS_QUERY_ARGS).asPromise());
}

/**
 * Look up additional information about a place.
 * @param placeId
 * @returns {Observable<ObservedValueOf<ObservableInput<any>>>}
 */
function getRestaurantObservable(placeId){
    return from(googleMapsClient.place({
        placeid: placeId
    }, function(err, response) {
        if (!err) {
            console.log(response.json.result);
        }
    }).asPromise());
}

/**
 * Use a page token to get a supplemental list of places
 * @param pageToken
 * @returns {Observable<ObservedValueOf<ObservableInput<any>>>}
 */
function getResultsFromPageTokenObservable(pageToken){
    return from(googleMapsClient.places({
        pagetoken: pageToken
    }).asPromise());
}

/**
 * Look up as many places as google is willing to return from the places API, which may require multiple page lookups
 * @returns {Observable<any>}
 */
function lookupAllPlacesObserable(){
    return new Observable(subscriber=>{
        let placeList = [];
        let pageKey = "";

        function handleResponse(response){
            response.json.results.forEach((data)=>{
                placeList.push(data);
            });
            pageKey = response.json.next_page_token;
            if(!pageKey){
                subscriber.next(placeList);
                subscriber.complete(placeList);
            } else{
                subscriber.next(placeList);
                getResultsFromPageTokenObservable(pageKey).subscribe({
                    next: handleResponseAfterDelay,
                    error: handleError
                });
            }
        }
        function handleResponseAfterDelay(response){
            setTimeout(()=>{handleResponse(response)}, TIME_OUT);
        }
        function handleError(error){
            console.log(error);
        }
        lookupPlacesObservable().subscribe({
            next: handleResponseAfterDelay,
            error: handleError
        });
    });
}

/**
 * This function is really here for me to test the project manually. It just runs the query and outputs the data to
 * the console.
 */
function main(){
    let observer = lookupAllPlacesObserable();
    let placeList = [];
    let error = "";
    observer.subscribe({
            next(x){
                placeList = x;
            },
            error(x){
                error = x;
            },
            complete(){
                console.log("Found "+placeList.length+" places");
                console.log(JSON.stringify(placeList));
            }
        }
    );
}

exports.lookupAllPlacesObserable = lookupAllPlacesObserable;
exports.main = main;