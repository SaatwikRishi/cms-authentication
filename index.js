require('dotenv').config()

const cors = require('cors')
const express = require('express')
const authRoutes = require('./src/routes/authRoutes')
const { client } = require('./src/database/redis')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.text())

const PORT = process.env.PORT || 5000

client.connect()
client.on('error', err => console.log('Redis Client Error', err))

app.use('/auth', authRoutes)
app.listen(PORT, () => console.log('Authentication server stored on port ' + PORT))
