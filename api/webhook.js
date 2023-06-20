module.exports = async (req, res) => {
    const whatsAppClient = require('@green-api/whatsapp-api-client')
    const { MongoClient } = require('mongodb')
    require('dotenv').config()
    const restAPI = whatsAppClient.restAPI({
        idInstance: process.env.ID,
        apiTokenInstance: process.env.KEY
    })
    const client = new MongoClient(process.env.MONGO)
    const dbName = 'personal'
    const collectionName = 'accounts'

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

                await client.connect()
                const db = client.db(dbName)
                const collection = db.collection(collectionName)
                await collection.insertOne({ _id: Date.now(), amount, description })
                await restAPI.message.sendMessage("919288001128@c.us", null, `**Entry inserted: $${amount}**\n(${description})`)
                    .catch(error => {
                        console.log(error.message)
                        return res.status(400).send(error.message)
                    })
                return res.send('Okay')
            }
        } else {
            return res.send('Okay')
        }
    } catch (error) {
        try {
            await restAPI.message.sendMessage("919288001128@c.us", null, `Accounts error: ${error.message}`)
                .catch(error => {
                    console.log(error.message)
                    return res.status(400).send(error.message)
                })
            return res.send('Okay')
        } catch (error) {
            return res.status(400).send(error.message)
        }
    }
}