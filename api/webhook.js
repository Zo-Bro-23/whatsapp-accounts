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
                await client.connect()
                const db = client.db(dbName)
                const collection = db.collection(collectionName)

                if (message == 'Accounts') {
                    let accounts = []
                    let response = ''
                    let total = 0
                    const documents = await collection.find({}).toArray()
                    documents.forEach(document => {
                        if (Date.now() - document._id <= 604800000) {
                            accounts.push(document)
                        }
                    })
                    accounts.forEach(account => {
                        const amount = parseFloat(account.amount)
                        if (amount != NaN) {
                            total -= parseFloat(account.amount)
                        }
                    })
                    accounts.forEach(account => {
                        response += `*$${account.amount}:* ${account.description}\n`
                    })

                    response += `---------------------\n*_Total: $${total}_*`

                    await restAPI.message.sendMessage("919288001128@c.us", null, response)
                        .catch(error => {
                            console.log(error.message)
                            return res.status(400).send(error.message)
                        })
                    return res.send('Okay')
                }

                if (message.slice(0, 1) !== '$') {
                    return res.send('Okay')
                }
                const amountIndex = message.indexOf(' ')

                if (amountIndex == -1) {
                    await restAPI.message.sendMessage("919288001128@c.us", null, `You forgot to add a space!`)
                        .catch(error => {
                            console.log(error.message)
                            return res.status(400).send(error.message)
                        })
                    return res.send('Okay')
                }
                const amount = message.slice(1, amountIndex)
                const description = message.slice(amountIndex + 1)

                await collection.insertOne({ _id: Date.now(), amount, description })
                
                await restAPI.message.sendMessage("919288001128@c.us", null, `*Entry added:*\n_Amount:_ $${amount}\n_Description:_ ${description}`)
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