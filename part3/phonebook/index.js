const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const loggingFormat = (tokens, req, res) => {
	return [
		tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
		JSON.stringify(req.body)
	].join(' ')
}

app.use(express.json(), morgan(loggingFormat))
app.use(express.static('build'))
app.use(cors())

let persons = [
	{ 
		"id": 1,
		"name": "Arto Hellas", 
		"number": "040-123456"
	},
	{ 
		"id": 2,
		"name": "Ada Lovelace", 
		"number": "39-44-5323523"
	},
	{ 
		"id": 3,
		"name": "Dan Abramov", 
		"number": "12-43-234345"
	},
	{ 
		"id": 4,
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122"
	}
]


app.get('/info', (req, res) => {
	res.send(`<p>Phonebook has info for ${persons.length} people</p>${Date()}`)
})

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const note = persons.find(person => person.id === id)

	if (note) response.json(note)
	else return response.status(400).json({
      error: 'person not present'
  })
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)

	response.status(204).end()
})

const generateID = () => {
  const maxID = persons.length > 0
  ? Math.max(...persons.map(person => person.id))
  : 0

  return maxID + 1
}

app.post('/api/persons', (request, response) => { 
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'some data is missing'
    })
  }

	if (persons.map(p => p.name).includes(body.name)) {
		return response.status(400).json({
      error: 'name must be unique'
    })
	}

  const note = {
    ...body,
    id: generateID(),
  }

  persons = persons.concat(note)

  response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})