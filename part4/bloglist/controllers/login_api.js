const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

router.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const tokenData = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(tokenData, process.env.SECRET)

  response
    .status(200)
    .send({
      token,
      username: user.username,
      password: user.password
    })
})

module.exports = router