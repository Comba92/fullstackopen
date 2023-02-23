const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const dbName = 'phonebook'

const url = `mongodb+srv://comba:${password}@database01.gldvizj.mongodb.net/\
	${dbName}?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

personSchema.set('toObject', {
	transform: (document, returnedObj) => {
		returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
	}
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length<5) {
	Person.find({}).then(results => {
		results.forEach(result => {
			console.log(result)
		})

		mongoose.connection.close()
	})
} else {
	const name = process.argv[3]
	const number = process.argv[4]
	const newPerson = new Person({
		name, number
	})

	newPerson.save().then(result => {
		console.log(dbName, ':')
		console.log(`added ${name} number ${number} to ${dbName}`)
		mongoose.connection.close()
	})
}