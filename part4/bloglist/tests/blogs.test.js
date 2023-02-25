const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')

const { initialBlogs, getBlogsAsJson, generateFakeId } = require('../utils/blogs_helper')
const users = require('../utils/users_helper')
const User = require('../models/user')

// Used to make HTTP requests
const agent = supertest(app)

jest.setTimeout(10000)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})


describe('HTTP GET', () => {
  test('blogs are returned as json', async () => {
    await agent
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await agent.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('blogs id is not named as _id', async () => {
    const response = await agent.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('HTTP POST', () => {
  test('succedes with valid data', async () => {
    const newBlog = {
      title: 'silly',
      author: 'goofy',
      url: 'none',
      likes: 0,
    }

    await agent
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await agent.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    expect(titles).toHaveLength(initialBlogs.length + 1)
    expect(titles).toContain('silly')
  })

  test('succeds with status code 201 and likes set to 0 if likes is omitted', async () => {
    const newBlog = {
      title: 'silly',
      author: 'goofy',
      url: 'none'
    }

    const response = await agent
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    expect(response.body.likes).toBeDefined()
    expect(response.body.likes).toBe(0)
  })

  test('fails with statuscode 400 if required data is missing', async () => {
    const newBlog = {
      author: 'goofy'
    }

    await agent
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('HTTP DELETE', () => {
  test('succedes with status code 204', async () => {
    const blogsAtStart = await getBlogsAsJson()
    const blogToDelete = blogsAtStart[0]

    await agent
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await getBlogsAsJson()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const blogsAtStart = await getBlogsAsJson()
    const wrongId = await generateFakeId()

    await agent
      .delete(`/api/blogs/${wrongId}`)
      .expect(404)

    const blogsAtEnd = await getBlogsAsJson()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe('HTTP PUT', () => {
  test('succedes with valid data', async () => {
    const blogsAtStart = await getBlogsAsJson()

    const updatedBlog = {
      ...blogsAtStart[0],
      likes: 5000
    }

    const update = {
      likes: 5000
    }

    await agent
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(update)
      .expect(updatedBlog)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const wrongId = await generateFakeId()

    await agent
      .put(`/api/blogs/${wrongId}`)
      .expect(404)
  })
})

describe('POPULATE tests', () => {
  beforeEach( async () => {
    await User.deleteMany({})
    await User.insertMany(users)
    await Blog.deleteMany({})
  })

  test('GET returns populated data based on keys', async () => {
    const newBlog = {
      title: 'silly',
      author: 'goofy',
      url: 'none',
      likes: 0,
    }
    await agent.post('/api/blogs').send(newBlog)

    const results = await agent.get('/api/blogs')
    expect(results.body[0].user).toBeDefined()
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
