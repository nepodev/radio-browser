/**
 * get random api host
 */
'use strict'

// got from https://github.com/flexdinesh/browser-or-node
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

const { resolve4, reverse } = isNode ? require('./dns-nativ') : require('./dns-https')

const BASE_HOST = 'all.api.radio-browser.info'

module.exports = () => {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let ips = await resolve4(BASE_HOST)
                let ip = ips[Math.floor(Math.random() * ips.length)]
                let hostnames = await reverse(ip)
                resolve(hostnames.shift())
            }
            catch(e) {
                reject(e)
            }
        })()
    })
}
