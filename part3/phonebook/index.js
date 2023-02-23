require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

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

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(loggingFormat))
app.use(cors())


app.get('/info', (request, response) => {
	Person.count()
		.then(result => {
			response.send(
				`<p>Phonebook has info for ${result} people</p>${Date()}`
			)
		})
})

app.get('/api/persons', (request, response) => {
	Person.find().then(results => {
		response.json(results)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	const id = request.params.id
	Person.findById(id)
		.then(result => {
			if (result) {
				response.json(result)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
	const id = request.params.id
	Person.findByIdAndRemove(id)
		.then(result => {
			if(result) {
				response.status(204).end()
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const id = request.params.id
	const body = request.body

	const newPerson = {
		...body
	}

	Person.findOneAndUpdate(
		id, newPerson, 
		{ new: true, runValidators: true, context: 'query' }
	)
		.then(result => {
			response.json(result)
		})
		.catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
	const body = request.body

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'content missing'
		})
	}

	Person.find({name: body.name})
		.then(result => {
			console.log(result)
			return response.status(400).json({
				error: 'name must be unique'
			})
		})

	const newPerson = new Person({
		...body
	})

	newPerson.save()
		.then(result => {
			console.log(`${body.name} saved.`)
			response.json(newPerson)
		})
		.catch(error => next(error))
})


const unknownEndpoint = (req, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return res.status(400).json({
			error: 'malformatted id'
		})
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({
			error: error.message
		})
	}

	next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})