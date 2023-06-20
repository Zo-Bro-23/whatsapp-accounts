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
        if (req.headers['X-Telegram-Bot-Api-Secret-Token'] == process.env.AUTHOR) {
            bot.sendMessage("@zobro23", `${req.body.message.text}`)
        }
    } catch (error) {
        bot.sendMessage("@zobro23", `Accounts error: ${error.message}`)
    }
    res.send('Okay')
}