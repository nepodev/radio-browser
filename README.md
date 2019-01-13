# RadioBrowser API Client

Nodejs module for [Radio-browser API](http://www.radio-browser.info/webservice)

## Install

```bash
$ npm install radio-browser
```

## Usage

Every method returns a promise so you have to use `then` and `catch`.

```js
const RadioBrowser = require('radio-browser')

let filter = {
    limit: 5,          // list max 5 items
    by: 'tag',       // search in tag
    searchterm: 'jazz' // term in tag
}
RadioBrowser.getStations(filter)
    .then(data => console.log(data))
    .catch(error => console.error(error))
```

## Methods

* `addStation(<params>)` [Add radio station](http://www.radio-browser.info/webservice#Add_radio_station)
* `deleteStation(<stationuuid>)` [Delete a station](http://www.radio-browser.info/webservice#Delete_a_station)
* `editStation(<stationid>, <params>)` [Edit a radio station](http://www.radio-browser.info/webservice#Edit_a_radio_station)
* `getCategory(<category>[, filter])` Get a list of [station check results](http://www.radio-browser.info/webservice#Get_a_list_of_station_check_results), [codecs](http://www.radio-browser.info/webservice#List_of_codecs), [countries](http://www.radio-browser.info/webservice#List_of_countries), [languages](http://www.radio-browser.info/webservice#List_of_languages), [states](http://www.radio-browser.info/webservice#List_of_states), [tags](http://www.radio-browser.info/webservice#List_of_tags)
* `getServerStats()` [Server stats](http://www.radio-browser.info/webservice#Server_stats)
* `getStations([filter])` [List of radio stations](http://www.radio-browser.info/webservice#List_of_radio_stations), Stations by [clicks](http://www.radio-browser.info/webservice#Stations_by_clicks), [Url](http://www.radio-browser.info/webservice#Search_radio_stations_by_url),  [vote](http://www.radio-browser.info/webservice#Stations_by_votes), [recent click](http://www.radio-browser.info/webservice#Stations_by_recent_click), [recent changed](http://www.radio-browser.info/webservice#Stations_by_recently_changed), [deleted](http://www.radio-browser.info/webservice#Stations_that_got_deleted)
* `searchStations([params])` [Advanced station search](http://www.radio-browser.info/webservice#Advanced_station_search)
* `setService(<options>)` Set api host and base_path. Default is www.radio-browser.info
* `undeleteStation(<stationid>)` [UnDelete a station](http://www.radio-browser.info/webservice#UnDelete_a_station)
* `voteStation(<stationid>)` [Vote for station](http://www.radio-browser.info/webservice#Vote_for_station)

## Properties

* `filter_by_types` list of types using in getStations({by: {type}, ...})
* `category_types` list of categories using in getCategory({type} ...)

## Examples:

Get a list of countries with 'aus' in name and sort list by stationscount.

```js
let filter = {
    searchterm: 'aus',
    reverse: true,
    order: 'stationcount'
}
RadioBrowser.getCategory('countries', filter)
    .then(data => console.log(data))
    .catch(err => console.error(err))
```

Returns a Json like [this](http://www.radio-browser.info/webservice/json/countries/aus?reverse=true&order=stationcount)

Get the 5 top voted station 

```js
let filter = {
	by: 'topvote', // stations by topvote
	limit: 5    // top 5 stations
}
RadioBrowser.getStations(filter)
    .then(data => console.log(data))
    .catch(err => console.error(err))
```

Returns a Json like [this](http://www.radio-browser.info/webservice/json/stations/topvote/5)
