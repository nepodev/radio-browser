# RadioBrowser API Client

Nodejs module for [Radio-browser API](http://www.radio-browser.info/webservice)

## Install

```bash
$ npm install radio-browser
```

## Usage

Every method returns a promise so you have to use `then` and `catch`.

```js
const RadioBrowser = requier('radio-browser')

let filter = {
    limit: 5,          // list max 5 items
    by: 'bytag',       // search in tag
    searchterm: 'jazz' // term in tag
}
RadioBrowser.getStations(filter)
    .then(data => console.log(data))
    .catch(data => console.errror(error))
```

## Methods

* `addStation(<params>)` [Add radio station](http://www.radio-browser.info/webservice#Add_radio_station)
* `deleteStation(<stationuuid>)` [Delete a station](http://www.radio-browser.info/webservice#Delete_a_station)
* `editStation(<stationid>, <params>)` [Edit a radio station](http://www.radio-browser.info/webservice#Edit_a_radio_station)
* `getChecks: ([stationuuid][, seconds])` [Get a list of station check results](http://www.radio-browser.info/webservice#Get_a_list_of_station_check_results)
* `getCodecs([filter])` [List of codecs](http://www.radio-browser.info/webservice#List_of_codecs)
* `getCountries([filter])` [List of countries](http://www.radio-browser.info/webservice#List_of_countries)
* `getLanguages([filter])` [List of languages](http://www.radio-browser.info/webservice#List_of_languages)
* `getServerStats()` [Server stats](http://www.radio-browser.info/webservice#Server_stats)
* `getStates([filter])` [List of states](http://www.radio-browser.info/webservice#List_of_states)
* `getStations([filter])` [List of radio stations](http://www.radio-browser.info/webservice#List_of_radio_stations), [Stations by clicks](http://www.radio-browser.info/webservice#Stations_by_clicks), [Search station by Url](http://www.radio-browser.info/webservice#Search_radio_stations_by_url),  [Stations by vote](http://www.radio-browser.info/webservice#Stations_by_votes), [Stations by recent click](http://www.radio-browser.info/webservice#Stations_by_recent_click), [Stations by recent changed](http://www.radio-browser.info/webservice#Stations_by_recently_changed), [Stations that got deleted](http://www.radio-browser.info/webservice#Stations_that_got_deleted)
* `getTags([filter])` [List of tags](http://www.radio-browser.info/webservice#List_of_tags)
* `searchStations([params])` [Advanced station search](http://www.radio-browser.info/webservice#Advanced_station_search)
* `setService(<options>)` Set api host and base_path. Default is www.radio-browser.info
* `undeleteStation(<stationid>)` [Delete a station](http://www.radio-browser.info/webservice#Delete_a_station)
* `voteStation(<stationid>)` [Vote for station](http://www.radio-browser.info/webservice#Vote_for_station)

### Examples:

Get a list of countries with 'aus' in name and sort list by stationscount.

```js
let filter = {
    searchterm: 'aus',
    reverse: true,
    order: 'stationcount'
}
RadioBrowser.getCountries(filter)
    .then(data => console.log(data))
    .catch(err => console.error(err))
```

Returns a Json like [this](http://www.radio-browser.info/webservice/json/countries/aus?reverse=true&order=stationcount)

Get the 5 top voted station 

```js
let filter = {
	by: 'topvote', // stations by topvote
	rowcount: 5    // top 5 stations
}
RadioBrowser.getStations(filter)
    .then(data => console.log(data))
    .catch(err => console.error(err))
```

Returns a Json like [this](http://www.radio-browser.info/webservice/json/stations/topvote/5)
