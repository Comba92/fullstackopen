require('dotenv').config()
const jwt = require('jsonwebtoken')
const { Sequelize, QueryTypes, DataTypes, Model } = require('sequelize')

const express = require('express')
const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DB_URL)

class Note extends Model {}
Note.init({ 
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    content: { type: DataTypes.TEXT, allowNull: false }, 
    important: { type: DataTypes.BOOLEAN },
    date: { type: DataTypes.DATE } 
  }, { 
    sequelize, 
    underscored: true,
    modelName: 'note' 
})

class User extends Model {}
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'user'
})


User.hasMany(Note)
Note.belongsTo(User)
User.sync({ alter: true })
Note.sync({ alter: true })


app.post('/login', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

app.get('/users', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Note
    }
  })
  res.json(users)
})

app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.get('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: {
      model: Note
    }
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({
      error: 'User not found'
    })
  }
})

app.get('/notes', async (req, res) => {
  const notes = await Note.findAll({
    attributes: {
      exclude: ['userId']
    },
    include: {
      model: User,
      attributes: {
        exclude: ['id']
      }
    }
  })
  res.json(notes)
})

app.get('/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)

  if (note) {
    res.json(note)
  } else {
    res.status(400).json({
      error: 'Note not found'
    })
  }
})

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(auth.split(' ')[1], process.env.SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

app.delete('/notes/:id', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const note = await Note.findOne({
      where: {
        userId: user.id
      }
    })
    
    if (note) {
      note.destroy()
      res.status(204).end()
    } else {
      res.status(400).end()
    }
  } catch (error) {
    return res.status(400).json(error)
  }
})

app.post('/notes', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const note = await Note.create({
      ...req.body, userId: user.id, date: new Date()
    })
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

app.put('/notes/:id', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const note = await Note.findByPk(req.params.id)

    if (note) {
      await note.update(req.body)
      res.json(note)
    } else {
      res.status(404).end()
    }
  } catch(error) {
    return res.status(400).json(error)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate()
    console.log('Connected to postgres database.')
  } catch (error) {
    console.error('Unable to connect to postgres:', error)
    return process.exit(1)
  }
})