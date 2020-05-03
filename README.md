# RadioBrowser API Client

Nodejs module for [Radio-browser API](https://de1.api.radio-browser.info/)

## Install

```bash
npm install radio-browser
```

## Usage

Every method returns a promise so you have to use `then` and `catch`.

```js
const RadioBrowser = require('radio-browser')

let filter = {
    limit: 5,          // list max 5 items
    by: 'tag',         // search in tag
    searchterm: 'jazz' // term in tag
}
RadioBrowser.getStations(filter)
    .then(data => console.log(data))
    .catch(error => console.error(error))
```

## Methods

* `addStation(<params>)` [Add radio station](https://de1.api.radio-browser.info/#Add_radio_station)
* ~~`deleteStation(<stationuuid>)` [Delete a station](https://de1.api.radio-browser.info/#Delete_a_station)~~
* ~~`editStation(<stationid>, <params>)` [Edit a radio station](https://de1.api.radio-browser.info/#Edit_a_radio_station)~~
* `getCategory(<category>[, filter])` Get a list of [codecs](https://de1.api.radio-browser.info/#List_of_codecs), [countries](https://de1.api.radio-browser.info/#List_of_countries), [countrycodes](https://de1.api.radio-browser.info/#List_of_countrycodes), [languages](https://de1.api.radio-browser.info/#List_of_languages), [states](https://de1.api.radio-browser.info/#List_of_states), [tags](https://de1.api.radio-browser.info/#List_of_tags)
* `getChecks([stationuuid][, seconds])` [Get a list of station check results](https://de1.api.radio-browser.info/#Get_a_list_of_station_check_results)
* `getServerStats()` [Server stats](https://de1.api.radio-browser.info/#Server_stats)
* `getStations([filter])` [List of radio stations](https://de1.api.radio-browser.info/#List_of_radio_stations), Stations by [clicks](https://de1.api.radio-browser.info/#Stations_by_clicks), [Url](https://de1.api.radio-browser.info/#Search_radio_stations_by_url),  [vote](https://de1.api.radio-browser.info/#Stations_by_votes), [recent click](https://de1.api.radio-browser.info/#Stations_by_recent_click), [recent changed](https://de1.api.radio-browser.info/#Stations_by_recently_changed), [deleted](https://de1.api.radio-browser.info/#Stations_that_got_deleted)
* `searchStations([params])` [Advanced station search](https://de1.api.radio-browser.info/#Advanced_station_search)
* ~~`setService(<options>)` Set api host and base_path. Default is www.radio-browser.info~~
  Deprecated. Use Property `service_url`. i.e. `service_url = 'http://localhost'`
* ~~`undeleteStation(<stationid>)` [UnDelete a station](https://de1.api.radio-browser.info/#UnDelete_a_station)~~
* `voteStation(<stationuuid>)` [Vote for station](https://de1.api.radio-browser.info/#Vote_for_station)

## Properties

* `filter_by_types` list of types using in getStations({by: {type}, ...})
* `category_types` list of categories using in getCategory({type} ...)
* `service_url` get or set the api-url. Default is `null` to get a random API host at first request.

## Examples:

Get Server Stats from a random API-Host

```js
// file: examples/server-stats.js

const RadioBrowser = require('radio-browser')

RadioBrowser.getServerStats()
  .then(data => console.log(RadioBrowser.service_url, data))
  .catch(err => console.error(err))
```

```bash
// example output
https://de1.api.radio-browser.info/ { supported_version: 1,
  status: 'OK',
  stations: 24101,
  stations_broken: 601,
  tags: 6384,
  clicks_last_hour: 0,
  clicks_last_day: 5,
  languages: 313,
  countries: 208 }
```

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

`data` looks like [this](https://de1.api.radio-browser.info/json/stations/topvote/5)
