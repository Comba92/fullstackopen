const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 3
	},
	number: {
		type: String,
		required: true,
		minLength: 8,
		match: new RegExp('^([0-9]){2,3}-([0-9])+$')
	}
})

personSchema.set('toJSON', {
	transform: (document, returnedObj) => {
		returnedObj.id = returnedObj._id.toString()
		delete returnedObj._id
		delete returnedObj.__v
	}
})
	
module.exports = mongoose.model('Person', personSchema)