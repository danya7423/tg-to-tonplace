const {
    Telegraf
} = require('telegraf')
const fetch = require('node-fetch')

const config = require('./config.js')

function checkConfig() {
    if (!config.botToken) {
        throw new Error('The "botToken" parameter is missing')
    }
    if (!config.tonPlaceId) {
        throw new Error('The "tonPlaceId" parameter is missing')
    }
    if (!Number(config.tonPlaceId)) {
        throw new Error('tonPlaceId should be a number')
    }
    if (!config.tonPlaceToken) {
        throw new Error('The "tonPlaceToken" parameter is missing')
    }
}
checkConfig()

const bot = new Telegraf(config.botToken)

bot.on('channel_post', (ctx, next) => {
    console.log('new post')
    fetch("https://api.ton.place/posts/new", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "ru",
            "authorization": config.tonPlaceToken,
            "content-type": "application/json"
        },
        "body": JSON.stringify({
            "ownerId": config.tonPlaceId,
            "text": ctx.update.channel_post.text,
            "parentId": 0,
            "attachments": [],
            "timer": 0
        }),
        "method": "POST"
    }).then((res) => res.json()).then((res) => {
        if (res.post) {
            console.log('posted at ton place')
        } else {
            console.log('error posting on ton place ', res)
        }
    })
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))