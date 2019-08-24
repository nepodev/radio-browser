/**
 * get dynamic api host
 * 
 * thanks to segler-alex <https://github.com/segler-alex>
 * issue: https://github.com/nepodev/radio-browser/issues/1
 */
'use strict'

const dns = require('dns')
const util = require('util')
const resolve4 = util.promisify(dns.resolve4)
const reverse = util.promisify(dns.reverse)

const BASE_HOST = 'all.api.radio-browser.info'

module.exports = function()
{
    return resolve4(BASE_HOST).then(ips => {
        let ip = ips[Math.floor(Math.random() * ips.length)]
        return reverse(ip).then(hostname => hostname[0])
    })
}
