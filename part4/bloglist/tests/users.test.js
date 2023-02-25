const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')

const agent = supertest(app)

jest.setTimeout(10000)

const initialUsers =  [
  {
    username: 'mluukkai',
    name: 'Matti',
    password: 'prova1'
  },
  {
    username: 'hellas',
    name: 'Arto',
    password: 'prova2'
  },
]

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(initialUsers)
})

test('get all users', async () => {
  const results = await agent
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(results.body).toHaveLength(initialUsers.length)
})

test('add one user', async () => {
  const newUser = {
    username: 'silly',
    name: 'goofy',
    password: 'schizo'
  }

  await agent
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const response = await agent.get('/api/users')
  const usernames = response.body.map(r => r.username)

  expect(usernames).toHaveLength(initialUsers.length + 1)
  expect(usernames).toContain('silly')
})

const addInvalidUser = async (user) => {
  await agent
    .post('/api/users')
    .send(user)
    .expect(400)
}

test('add user with invalid username', async () => {
  const newUser = {
    username: '12',
    password: 'schizo'
  }

  await addInvalidUser(newUser)
})

test('add user with invalid password', async () => {
  const newUser = {
    username: 'chink',
    password: '12'
  }
  await addInvalidUser(newUser)

})

test('add user without username' , async () => {
  const newUser = {
    name: 'nigger',
    password: '1234'
  }
  await addInvalidUser(newUser)
})


test('add user without password', async () => {
  const newUser = {
    username: 'pajeet'
  }
  await addInvalidUser(newUser)
})

test('add user with username already in db', async () => {
  const newUser = {
    username: 'hellas',
    password: '1234'
  }

  await agent.post('/api/users').send(newUser).expect(400)
})

describe('POPULATE tests', () => {
  test('GET returns populated data based on keys', async () => {
    const newBlog = {
      title: 'silly',
      author: 'goofy',
      url: 'none',
      likes: 0,
    }
    await agent.post('/api/blogs').send(newBlog)

    const results = await agent.get('/api/users')
    expect(results.body[0].blogs.length).toBeGreaterThan(0)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})