require('dotenv').config()
const jwt = require('jsonwebtoken')
const { Sequelize, Op, DataTypes, Model } = require('sequelize')
const { Umzug } = require('umzug')

const express = require('express')
const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DB_URL)
const migratorConfig = require('./migrator')

const runMigrations = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migratorConfig)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
} 

class Note extends Model {}
Note.init({ 
    id: { 
      type: DataTypes.INTEGER, primaryKey: true, 
      autoIncrement: true 
    }, 
    content: { 
      type: DataTypes.TEXT, 
      allowNull: false,
      validate: {
        len: {
          args: [10, undefined],
          msg: 'Note should be at least 10 characters'
        }
      }
    }, 
    important: { 
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
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
  name:  DataTypes.STRING,
  admin: { type: DataTypes.BOOLEAN, defaultValue: false }, 
  disabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  session: { type: DataTypes.STRING }
}, {
  sequelize,
  underscored: true,
  modelName: 'user'
})

class Group extends Model {}
Group.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
  }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'group'
})

class GroupNote extends Model {}
GroupNote.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  noteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'notes', key: 'id' },
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'groups', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'group_notes'
})

User.hasMany(Note)
Note.belongsTo(User)
Group.belongsToMany(Note, { through: GroupNote })
Note.belongsToMany(Group, { through: GroupNote })


const tokenExtractor = async (req, res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    try {
      const encodedToken = auth.split(' ')[1]

      const user = await User.findOne({
        where: {
          'session': encodedToken
        }
      })

      if(!user) {
        return res.status(401).json({ error: 'token invalid' })
      }

      const decodedToken = jwt.verify(encodedToken, process.env.SECRET)
      req.user = await User.findByPk(decodedToken.id)

    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}


const isAdmin = async (req, res, next) => {
  if (!req.user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }

  next()
}


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

  if(user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  user.session = token
  await user.save()

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

app.delete('/logout', tokenExtractor, async (req, res) => {
  if(!req.user) {
    return response.status(401).json({
      error: 'something went wrong.'
    })
  }

  req.user.session = null
  await req.user.save()

  res.status(204).end()
})

app.get('/users', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Note
    },
  })
  res.json(users)
})

app.get('/usersnotes', async (req, res) => {
  const users = await User.findAll({
    attributes: {
      include: [
        [sequelize.fn('COUNT', sequelize.col('notes.id')), 'notesCount']
      ]
    },
    include: {
      model: Note,
      attributes: [],
      required: false
    },
    order: [['notesCount', 'DESC']],
    group: [['user.id']]
  })

  res.json(users)
})


app.put('/users/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    if(req.body.disabled) {
      req.body.session = null
    }

    user.set(req.body)
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
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
  const where = {}

  if (req.query.important) {
    where.important = req.query.important === 'true'
  }

  if (req.query.search) {
    where.content = {
      [Op.iLike]: req.query.search ? '%' + req.query.search + '%' : ''
    }
  }

  const notes = await Note.findAll({
    attributes: {
      exclude: ['userId']
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ['id']
        }
      },
      {
        model: Group,
        attributes: ['name', 'description'],
        through: {
          attributes: []
        }
      }
    ],
    where,
    order: [['content', 'DESC']]
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

app.delete('/notes/:id', tokenExtractor, async (req, res) => {
  try {
    const note = await Note.findOne({
      where: {
        userId: req.user.id
      }
    })
    
    if (note && note.userId === req.user.id) {
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
    const note = await Note.create({
      ...req.body, userId: req.user.id, date: new Date()
    })
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

app.put('/notes/:id', tokenExtractor, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id)

    if (note && note.userId === req.user.id) {
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
    await runMigrations()
    console.log('Connected to postgres database.')
  } catch (error) {
    console.error('Unable to connect to postgres:', error)
    return process.exit(1)
  }
})