module.exports = (req, res) => {
    const whatsAppClient = require('@green-api/whatsapp-api-client')
    const TelegramBot = require('node-telegram-bot-api')
    require('dotenv').config()
    const restAPI = whatsAppClient.restAPI({
        idInstance: process.env.ID,
        apiTokenInstance: process.env.KEY
    })
    const bot = new TelegramBot(process.env.TOKEN)

    try {
        console.log(req.body)
        if (req.headers.typeWebhook == 'incomingMessageReceived') {
            restAPI.message.sendMessage("919288001128@c.us", `${req.body.message.text}`)
        }
    } catch (error) {
        restAPI.message.sendMessage("919288001128@c.us", `Accounts error: ${error.message}`)
    }
    res.send('Okay')
}