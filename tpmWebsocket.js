const WebSocket = require('ws');
const { config } = require('./config.js');
const { formatNumber } = require('./utils.js')

let ws = new WebSocket('ws://107.152.36.217:1241');//This is just a random VPS
const uuid = config.uuid;
const discordID = config.discordID
const ign = config.username;
ws.on('open', () => {
    console.log('Connected!');
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: "loggedIn",
            data: JSON.stringify({
                discordID: discordID
            })
        }))
    }, 5000)
});

function sendFlip(auctionId, profit, price, bed, name) {
    ws.send(JSON.stringify({
        type: "flip",
        data: JSON.stringify({
            user: ign,
            bed: bed,
            flip: name,
            price: price,
            profit: formatNumber(profit),
            uuid: uuid,
            auctionId: auctionId
        })
    }))
}

ws.on('message', () => {
    console.log('Got message');
})

ws.on('close', () => {
    setTimeout(() => {
        ws = new WebSocket('ws://107.152.36.217:1241');
    }, 3000)
})

module.exports = { sendFlip }