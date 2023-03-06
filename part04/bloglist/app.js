const config = require('./utils/config')
const blogsApi = require('./controllers/blogs_api')
const usersApi = require('./controllers/users_api')
const loginApi = require('./controllers/login_api')
const express = require('express')
const app = express()
const logger = require('./utils/logger')
const errors = require('./utils/error_handler')
const middleware = require('./utils/middleware')

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


app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsApi)
app.use('/api/users', usersApi)
app.use('/api/login', loginApi)

app.use(errors)

module.exports = app