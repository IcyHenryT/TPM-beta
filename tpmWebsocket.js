const WebSocket = require('ws');
const { config } = require('./config.js');
const { solveCaptcha } = require('./websocketHelper.js');
const { logmc } = require('./logger.js');
const { sendPingStats } = require('./utils.js');
const { ws } = require(`./websocketHelper.js`);

let bot, handleCommand, bought = 0, sold = 0;

let tws = new WebSocket('ws://107.152.36.217:1241');//This is just a random VPS
const uuid = config.uuid;
const discordID = config.discordID
const ign = config.username;
tws.on('open', () => {
    logmc('§6[§bTPM§6] §3Connected to the TPM websocket!');
    setTimeout(() => {
        tws.send(JSON.stringify({
            type: "loggedIn",
            data: JSON.stringify({
                discordID: discordID,
                webhook: config.webhook
            })
        }))
    }, 5000)
});

function sendFlip(auctionId, profit, price, bed, name) {
    bought++
    tws.send(JSON.stringify({
        type: "flip",
        data: JSON.stringify({
            user: ign,
            bed: bed,
            flip: name,
            price: price,
            profit: profit,
            uuid: uuid,
            auctionId: auctionId
        })
    }))
}

function updateSold(){
    sold++
}

function giveTheFunStuff(BOT, handleThoseCommands) {
    bot = BOT;
    handleCommand = handleThoseCommands;
}

tws.on('message', (message) => {
    const msg = JSON.parse(message);
    const data = JSON.parse(msg.data);
    switch (msg.type) {
        case "captcha":
            solveCaptcha(data.line);
            logmc(`§6[§bTPM§6] §3Solving a captcha from discord by user ${data.user}`);
            break;
        case "stats":
            sendPingStats(ws, handleCommand, bot, sold, bought);
            break;
    }
})

tws.on('close', () => {
    setTimeout(() => {
        tws = new WebSocket('ws://107.152.36.217:1241');
    }, 3000)
})

module.exports = { sendFlip, giveTheFunStuff, updateSold }