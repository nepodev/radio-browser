'use strict'

const RadioBrowser = require('..')

// Sets the property to zero. 
// At the next request an api-host will be set automatically.
RadioBrowser.service_url = null

RadioBrowser.getServerStats()
    .then(data => console.log(RadioBrowser.service_url, data))
    .catch(err => console.error(err))
