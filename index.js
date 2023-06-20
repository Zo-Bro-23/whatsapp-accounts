const express = require('express')
const app = express()
const webhook = require('./api/webhook')

app.get('/webhook', webhook)

app.listen(5210)