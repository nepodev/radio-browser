'use strict'

module.exports = function(station)
{
    console.log(`${station.name}\nStream: ${station.url}\nTags : ${station.tags}\nVotes: ${station.votes}\nClicks: ${station.clickcount}\n`)
}