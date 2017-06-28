'use strict'
const TgClient = require('node-telegram-bot-api')
const fs = require('fs')
const fetch = require('node-fetch')
require('dotenv').config()

const TG_API_TOKEN = process.env.TG_API_TOKEN
const INSPIRO_API_URL = process.env.INSPIRO_API_URL;

/* don't have an SSL cert for webhook, use polling instead */
const client = new TgClient(TG_API_TOKEN, { polling: true })
client.onText(/\/inspireme/, inspireCommand)

function inspireCommand(msg) {
    const headers = { 'User-Agent': getUserAgent() }
    const options = { headers, timeout: 5000 }

    fetch(INSPIRO_API_URL, options)
        .then(body => body.text())
        .catch(err => {
            client.sendMessage(
                msg.chat.id,
                'Something went wrong when begging the universe for inspiration. Sorry!'
            )
        })
        .then(inspiringImageUrl => {
            if (!inspiringImageUrl) return
            client.sendPhoto(msg.chat.id, inspiringImageUrl)
        })
}

function getUserAgent() {
    return 'Inspiro Telegram Bot v0.2.1 (github.com/cxcorp/inspirobot_bot)'
}