/**
 * resolve dns via https
 * using cloudflare dns
 * 
 * @todo use only one https request client
 */

const { request } = require('https')
const querystring = require('querystring')

const OPTIONS = {
    method: 'GET',
    host: 'cloudflare-dns.com',
    path: '/dns-query?',
    protocol: 'https:',
    headers: {
        accept: 'application/dns-json'
    }
}

/**
 * 
 * @param {object} params 
 */
const requestService = (params) => {
    let options = Object.assign({}, OPTIONS)
    options.path += querystring.stringify(params)

    return new Promise((resolve, reject) => {
        const req = request(options, res => {
            let rawData = ''
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
        req.end()
    })
}

module.exports = {
    resolve4: name => {
        return requestService({name, type: 'A'})
            .then(data => data.Answer.map(item => item.data))
    },

    reverse: ip => {
        const name = ip.split('.').reverse().join('.') + '.in-addr.arpa'
        return requestService({name, type: 'PTR'})
            .then(data => data.Answer.map(item => item.data.slice(0, -1)))
    }
}
