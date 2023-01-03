'use strict'
const { expect } = require('chai');
const RadioBrowser = require('../index')

var serverStats = {}

describe('#RadioBrowser.getServerStats()', function() {
    this.timeout(10000)
    it('should return server stats', () => {
        return RadioBrowser.getServerStats().then((data) => {
            serverStats = data;
            expect(data).to.contain.keys('stations','tags','languages','countries')
        })
    })
})

describe('#RadioBrowser lists', function() {
    this.timeout(10000)
    it('should return all languages', () => {
        return RadioBrowser.getCategory('languages').then(data => {
            expect(data.length).to.equal(parseInt(serverStats.languages))
            expect(data[0]).to.contain.keys('stationcount')
        })
    })

    it('should return countries with string "de"', () => {
        let filter = {
            searchterm: 'de'
        }
        return RadioBrowser.getCategory('countries', filter).then(data => {
            expect(data.length).to.be.above(0)
            expect(data[0]).to.contain.keys('stationcount')

            let name = data[0].iso_3166_1.toLowerCase()
            expect(name).to.include(filter.searchterm)
        })
    })

    it('should return a list of 2 stations', () => {
        let filter = {
            limit: 2
        }
        return RadioBrowser.getStations(filter).then(data => {
             expect(data.length).to.equal(2)
        })
    })

    it('should return a list of 2 stations with tag ska', () => {
        let filter = {
            limit: 2,
            by: 'bytag',
            searchterm: 'ska'
        }
        return RadioBrowser.getStations(filter).then(data => {
            expect(data.length).to.equal(2)
            expect(data[0].tags).to.include(filter.searchterm)
        })
    })
})

describe('#RadioBrowser.addStation()', function() {
    it('should return failure message', () => {
        let params = {url: 'http://example.com'}
        return RadioBrowser.addStation(params).then((data) => {
            expect(data).to.deep.equal({"ok":false,"message":"AddStationError 'name is empty'","uuid":""})
        })
    })
})
