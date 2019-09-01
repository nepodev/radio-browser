/**
 * api-client.js
 * 
 */
'use strice'

const Url = require('url')
const Http = require('http')
const Https = require('https')
const Querystring = require('querystring')
const apiHost = require('./api-host')

var HttpRequest = null

/**
 * default request options can overwrite on request.
 */
 const request_options = {
    host: null, // default is null to get random api-host
    protocol: 'https:',
    path: '/', // base path. will extend on request.
    method: 'POST',            // default is POST because GET request at radiobrowser-api dosen't work as expected.
    headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'user-agent': 'nodejs radio-browser (https://gitlab.com/nepodev/radio-browser)'
    }
}

/**
 * 
 * @param {object} options 
 * @param {string} queryString 
 * @returns {promise}
 */
const queryApi = function(options, param)
{

    let queryString = Querystring.stringify(param)

    if (queryString) {
        if (options.method === 'GET') {
            options.path += '?' + queryString
        }
        else {
            options.headers['Content-Length'] = Buffer.byteLength(queryString)
        }
    }


    return new Promise((resolve, reject) => {
        const req = HttpRequest(options, (res) => {
            const { statusCode } = res
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
            res.on('data', (chunk) => {
                rawData += chunk
            })
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
 * set api-host options.
 * 
 * @param {object} options {host: <string>, protocol: '<string>, path: <string>, port: <number>, hostname: <string>}
 * @returns {void}
 */
const setService = function(options)
{
    ['host', 'hostname', 'port', 'path', 'protocol'].forEach((key) => {
        request_options[key] = options[key]
    })
    if (typeof options.path === 'string' && options.path.substr(-1) !== '/') {
        options.path += '/'
    }
    HttpRequest = (options.protocol === 'https:' ? Https : Http).request
}

const ApiClient = module.exports = {

    get service_url()
    {
        return request_options.host === null ? null : [
                request_options.protocol,
                '//',
                request_options.host,
                request_options.path
            ].join('')
    },

    set service_url(url)
    {
        if (url === null) {
            url = ''
        }
        let opt = Url.parse(url)
        setService(opt)
    },

    /**
     * send request to radiobrowser-api.
     * 
     * @param {string} route
     * @param {object} param
     * @param {object} option
     * @returns {promise}
     */
    request: async function(route, param={}, option={})
    {
        if (request_options.host === null) {
            try {
                // get random host
                let host = await apiHost()
                ApiClient.service_url = 'https://' + host + '/'
            }
            catch(err) {
                return new Promise((res, rej) => rej(err))
            }
            
        }

        let options = Object.assign({}, request_options, option)

        options.path += 'json/' + route
        return queryApi(options, param)
    }
}