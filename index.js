'use strice'

const Http = require('http');
const Querystring = require('querystring')

const PARAM_TYPES = {
    hidebroken: 'boolean',
    limit: 'number',
    offset: 'number',
    order: 'string',
    reverse: 'boolean',
    seconds: 'number',
    url: 'string'
}

/**
 * parts can be in route
 * order is importent
 */
const ROUTE_KEYS = [
    'country',     // 1st
    'by',          // 1st
    'searchterm',  // 1st or 2nd
    'rowcount'     // 2nd
]

/**
 * default request options can overwrite on request.
 */
var request_options = {
    host: 'www.radio-browser.info',
    path: '/webservice/json/', // base path. will extend on request.
    method: 'POST',            // default is POST because GET request at radiobrowser-api dosen't work as espected.
    headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
    }
}

/**
 * send request to radiobrowser-api.
 * 
 * @param {string} route
 * @param {object} param
 * @param {object} option
 * @returns {promise}
 */
const queryApi = function(route, param={}, option={})
{
    let options = Object.assign({}, request_options, option)
        queryString = Querystring.stringify(param)

    options.path += route;
    if (queryString) {
        if (options.method === 'GET') {
            options.path += '?' + queryString
        }
        else {
            options.headers['Content-Length'] = Buffer.byteLength(queryString)
        }
    }
    
    return new Promise((resolve, reject) => {
        const req = Http.request(options, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type']
            let error;
            let rawData = ''

            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
            }
            else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`)
            }
            if (error) {
                res.resume()
                reject(error)
            }
        
            res.setEncoding('utf8')
            res.on('data', (chunk) => { rawData += chunk; })
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData)
                }
                catch (e) {
                    reject(e)
                }
            });        
        })

        if (options.headers['Content-Length']) {
            req.write(queryString)
        }

        req.on('error', (e) => reject(e))
        req.end()
    })
}

/**
 * extract params from filter
 * 
 * @param {object} filter 
 * @returns {object}
 */
const extractParams = function(filter)
{
    let params = {}
    Object.keys(PARAM_TYPES).forEach((name) => {
        if (filter[name] && typeof filter[name] === PARAM_TYPES[name]) {
            params[name] = filter[name]
        }
    })
    return params
}

/**
 * extend route with parts from filter
 * 
 * @example
 * let filter = {
 *  country: 'Germany'
 *  searchterm: 'ber'
 * }
 * let route = extractRoute('states', filter)
 * // route is: states/Germany/ber
 * 
 * @param {string} route 
 * @param {object} filter 
 */
const extractRoute = function (route, filter)
{
    ROUTE_KEYS.forEach((name) => {
        if (filter[name]) {
            route += '/' + encodeURI(filter[name])
        }
    })
    return route
}

/**
 * complete route and set params if any
 * 
 * @param {string} route 
 * @param {object} filter 
 * @returns {object} {route:<string>, params:<object>}
 */
const parseFilter = function(route, filter={})
{
    return {
        route: extractRoute(route, filter),
        params: extractParams(filter)
    }
}

const RadioBrowser = module.exports = {
    
    /**
     * set radiobrowser-api host and base_path.
     * default host is www.radio-browser.info
     * default base_path is /webservice
     * 
     * @param {object} options {host: <string>, base_path: <string>}
     * 
     * @example
     * setService({
     *  host: 'localhost' // set api-host to localhost. 
     * })
     * 
     */
    setService: (options) => {
        if (options.host) {
            request_options.host = options.host;
        }
        if (options.base_path) {
            request_options.path = options.base_path + '/json/'
        }
    },

    /**
     * returns a list of category.
     * http://www.radio-browser.info/webservice#List_of_countries
     * http://www.radio-browser.info/webservice#List_of_codecs
     * http://www.radio-browser.info/webservice#List_of_languages
     * http://www.radio-browser.info/webservice#List_of_states
     * http://www.radio-browser.info/webservice#List_of_tags
     * 
     * @param {string} category <countries|codecs|states|languages|tags>
     * @param {object} filter {country: <string>, searchterm: <string>, order: <string>, reverse: <boolean>, hidebroken: <boolean>}
     * @returns {promise}
     */
    getCategory: (category, filter) => {
        let {route, params} = parseFilter(category, filter)
        return queryApi(route, filter)
    },

    /**
     * Get a list of countries
     * @deprecated use getCategory('countries', filter)
     * @param {object} filter {searchterm: <string>, order: <string>, reverse: <boolean>, hidebroken: <boolean>}
     * @returns {promise} 
     */
    getCountries: (filter) => RadioBrowser.getCategory('countries', filter),

    /**
     * get a list of codecs
     * @deprecated use getCategory('codecs', filter)
     * @param {object} filter {searchterm: <string>, order: <string>, reverse: <boolean>, hidebroken: <boolean>}
     * @returns {promise}
     */
    getCodecs: (filter) => RadioBrowser.getCategory('codecs', filter),

    /**
     * Get a list of states
     * @deprecated use getCategory('states', filter)
     * @example
     * let filter = {
     *  country: 'germany',
     *  searchterm: 'ber'
     * }
     * @param {object} filter {country: <string>, searchterm: <string>, order: <string>, reverse: <boolean>, hidebroken: <boolean>}
     * @returns {promise}
     */
    getStates: (filter) => RadioBrowser.getCategory('states', filter),

    /**
     * get a list of languages
     * @deprecated use getCategory('languages', filter)
     * @param {object} filter {searchterm: <string>, order: <string>, reverse: <boolean>, hidebroken: <boolean>}
     * @returns {promise}
     */
    getLanguages: (filter) => RadioBrowser.getCategory('languages', filter),

    /**
     * get list of tags
     * @deprecated use getCategory('tags', filter)
     * @param {object} filter {searchterm: <string>, order: <string>, reverse: <boolean>, hidebroken: <boolean>}
     * @returns {promise}
     */
    getTags: (filter) => RadioBrowser.getCategory('tags', filter),

    /**
     * List of radio stations
     * http://www.radio-browser.info/webservice#List_of_radio_stations
     * http://www.radio-browser.info/webservice#Search_radio_stations_by_url
     * http://www.radio-browser.info/webservice#Stations_by_clicks
     * http://www.radio-browser.info/webservice#Stations_by_votes
     * http://www.radio-browser.info/webservice#Stations_by_recent_click
     * http://www.radio-browser.info/webservice#Stations_by_recently_changed
     * http://www.radio-browser.info/webservice#Stations_that_got_deleted
     * http://www.radio-browser.info/webservice#Old_versions_of_stations
     * http://www.radio-browser.info/webservice#Stations_that_need_improvement
     * http://www.radio-browser.info/webservice#Broken_stations
     * 
     * @param {object} filter {by: <string>, searchterm: <string>, url: <string>, rowcount: <integer>, order: <string>, reverse: <boolean>, offset: <integer>, limit: <integer>}
     * @returns {promise}
     * @example
     * let filter = {
     *  by: "bytag",       // will search in tags. for possible values see links above
     *  searchterm: "ska", // searchterm. possible values see links above
     *  order: "name",     // sort list by name
     *  limit: 5,          // returns a list of max. 5 stations
     *  offset: 0          // starting value of list
     * }
     * RadioBrowser.getStations(filter).then(...).catch(...)
     */
    getStations: (filter) => {
        let {route, params} = parseFilter('stations', filter)
        return queryApi(route, params)
    },
    
    /**
     * Get a list of station check results
     * http://www.radio-browser.info/webservice#Get_a_list_of_station_check_results
     * 
     * @param {string} stationuuid
     * @param {number} seconds
     */
    getChecks: (stationuuid, seconds=0) => {
        let route = 'checks',
            params = false

        if (stationuuid) {
            route += '/' + stationuuid
        }
        if (seconds > 0) {
            params = {seconds: seconds}
        }
        return queryApi(route, params)
    },

    /**
     * Advanced Search Stations
     * http://www.radio-browser.info/webservice#Advanced_station_search
     * 
     * @param {object} params for parameters see link above
     * @returns {promise}
     */
    searchStations: (params) => queryApi('stations/search', params),
    
    /**
     * Vote for station
     * http://www.radio-browser.info/webservice#Vote_for_station
     * 
     * @param {number} stationid 
     */
    voteStation: (stationid) => queryApi('vote/' + stationid),

    /**
     * delete a station by staionuuid
     * http://www.radio-browser.info/webservice#Delete_a_station
     * 
     * @param {string} stationuuid 
     */
    deleteStation: stationuuid => queryApi('delete/' + encodeURI(stationuuid)),

    /**
     * undelete a station by staionid
     * http://www.radio-browser.info/webservice#Delete_a_station
     * 
     * @param {number} stationid 
     */
    undeleteStation: (stationid) => queryApi('undelete/' + stationid),

    /**
     * Revert a station
     * http://www.radio-browser.info/webservice#Revert_a_station
     * 
     * disabled because is broken
     */
    // revertStation: (stationid, changeid) => queryApi('revert/' + stationid + '/' + changeid),

    /**
     * Add radio station. 
     * http://www.radio-browser.info/webservice#Add_radio_station
     * 
     * @param {object} params See link above for parameters
     */
    addStation: (params) => queryApi('add', params),

    /**
     * edit a station by stationid
     * http://www.radio-browser.info/webservice#Edit_a_radio_station
     * 
     * @param {number} stationid See link above for parameters
     * @param {object} params
     */
    editStation: (stationid, params) => queryApi('edit/' + stationid, params),

    /**
     * Server stats
     * http://www.radio-browser.info/webservice#Server_stats
     */
    getServerStats: () => queryApi('stats')
}
