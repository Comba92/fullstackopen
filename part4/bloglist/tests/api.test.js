const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../schemas/blog')

// Used to make HTTP requests
const agent = supertest(app)

test('blogs are returned as json', async () => {
  await agent
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are 6 blogs', async () => {
  const blogsBeforeRequest = await Blog.count({})

  const response = await agent.get('/api/blogs')
  expect(response.body).toHaveLength(blogsBeforeRequest)
})

test('id is not name as _id', async () => {
  const response = await agent.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a note can be added', async () => {
  const blogsBeforeAdd = await Blog.count({})

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

  expect(titles).toHaveLength(blogsBeforeAdd + 1)
  expect(titles).toContain('silly')
})

test('a blog without likes property can be added', async () => {
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

afterAll(async () => {
  await mongoose.connection.close()
})