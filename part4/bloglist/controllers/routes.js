const router = require('express').Router()
const Blog = require('../schemas/blog')

router.get('/blogs', async (request, response) => {
  const results = await Blog.find({})
  response.json(results)
})

router.post('/blogs', async (request, response) => {
  if (!request.body.likes)
    request.body.likes = 0

  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = router