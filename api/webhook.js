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
            if (req.body?.messageData?.typeMessage == 'extendedTextMessage') {
                const message = req.body.messageData.extendedTextMessageData.text
                if (message.slice(0, 1) !== '$') {
                    return res.send('Okay')
                }
                const amountIndex = message.indexOf(' ')
                const amount = message.slice(1, amountIndex)
                const description = message.slice(amountIndex + 1)

                restAPI.message.sendMessage("919288001128@c.us", null, `$${amount} - ${description}`)
                    .then(() => {
                        res.send('Okay')
                    })
                    .catch(error => {
                        console.log(error.message)
                        res.status(400).send(error.message)
                    })
            }
        } else {
            res.send('Okay')
        }
    } catch (error) {
        try {
            restAPI.message.sendMessage("919288001128@c.us", null, `Accounts error: ${error.message}`)
                .then(() => {
                    res.send('Okay')
                })
                .catch(error => {
                    console.log(error.message)
                    res.status(400).send(error.message)
                })
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
}