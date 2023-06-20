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
        if (req.body?.typeWebhook == 'outgoingMessageReceived' && req.headers?.authorization == `Bearer ${process.env.AUTHOR}` && req.body?.senderData?.chatId == '919288001128@c.us') {
            console.log('received')
            restAPI.message.sendMessage("919288001128@c.us", null, `received`)
                .then(() => {
                    res.send('Okay')
                })
                .catch(error => { res.status(400).send(error.message) })
        }

        res.send('Okay')
    } catch (error) {
        try {
            restAPI.message.sendMessage("919288001128@c.us", null, `Accounts error: ${error.message}`)
                .then(() => {
                    res.send('Okay')
                })
                .catch(error => { res.status(400).send(error.message) })
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
}