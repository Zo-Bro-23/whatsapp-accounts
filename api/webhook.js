module.exports = (req, res) => {
    const whatsAppClient = require('@green-api/whatsapp-api-client')
    require('dotenv').config()
    const restAPI = whatsAppClient.restAPI({
        idInstance: process.env.ID,
        apiTokenInstance: process.env.KEY
    })

    try {
        restAPI.message.sendMessage("919288001128@c.us", null, `${JSON.stringify(req.query)} ${JSON.stringify(req.headers)}`)
    } catch (error) {
        restAPI.message.sendMessage("919288001128@c.us", null, `Accounts error: ${error.message}`)
    }
}