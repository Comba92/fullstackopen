const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
  const auth = request.get('Authorization')
  if(auth && auth.toLowerCase().startsWith('bearer ')) {
    request.token = auth.replace('Bearer ', '')
  }

  next()
}

const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = await User.findById(decodedToken.id)
    next()
  } catch(error) { next(error) }
}

module.exports = {
  tokenExtractor, userExtractor
}