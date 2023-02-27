const router = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


router.get('/', async (request, response) => {
  const results = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(results)
})


router.post('/', middleware.userExtractor, async (request, response, next) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  }

  try {
    const blog = new Blog({
      ...request.body,
      user: request.user.id
    })

    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat( savedBlog._id )
    await request.user.save()

    const result = await Blog
      .findById(savedBlog.id.toString())
      .populate('user', { username: 1, name: 1 })

    response.status(201).json(result)

  } catch(error) { next(error) }
})

router.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if(!blog) {
      return response.status(404).end()
    }

    if ( blog.user.toString() === request.user.id ) {
      await Blog.findByIdAndDelete(blog.id)
      request.user.blogs = request.user.blogs.filter(blog => blog.id !== blog.id)
      await request.user.save()

      return response.status(204).end()
    } else {
      return response.status(403).end()
    }
  } catch(error) { next(error) }
})

router.put('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    ).populate('user', { username: 1, name: 1 })

    if(!result) {
      return response.status(404).end()
    }

    return response.json(result)
  } catch(error) { next(error) }
})

module.exports = router