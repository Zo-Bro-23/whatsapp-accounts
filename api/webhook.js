module.exports = (req, res) => {
    const whatsAppClient = require('@green-api/whatsapp-api-client')
    require('dotenv').config()
    const restAPI = whatsAppClient.restAPI({
        idInstance: process.env.ID,
        apiTokenInstance: process.env.KEY
    })

    try {
        if (req.headers.authorization == `Bearer ${process.env.AUTHOR}`) {
            restAPI.message.sendMessage("919288001128@c.us", null, `${req.body.senderData.chatId}`)
        }
    } catch (error) {
        restAPI.message.sendMessage("919288001128@c.us", null, `Accounts error: ${error.message}`)
    }
}