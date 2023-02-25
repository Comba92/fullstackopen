const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/', async (request, response) => {
  const results = await User
    .find({})
    .populate('blogs', { title:1, author:1, url:1, likes:1 })
  response.json(results)
})

router.post('/', async (request, response, next) => {
  if (!request.body.username || !request.body.password) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  if (request.body.password.length < 3) {
    return response.status(400).json({
      error: 'password should be at least 3 character long'
    })
  }

  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(request.body.password, saltRounds)

  const user = new User({
    username: request.body.username,
    name: request.body.name,
    password: hashedPassword,
    blogs: []
  })

  try {
    const result = await user.save()
    response.status(201).json(result)
  }
  catch(error) {
    next(error)
  }
})

module.exports = router