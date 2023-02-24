const config = require('./utils/config')
const router = require('./controllers/routes')
const express = require('express')
const app = express()
const logger = require('./utils/logger')

const cors = require('cors')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then( () => {
    logger.info('Connected to MongoDB')
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use('/api', router)

module.exports = app