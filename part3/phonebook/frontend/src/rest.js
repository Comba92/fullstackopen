import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
	return axios
		.get(baseUrl)
		.then(response => response.data)
}

const add = (newObject) => {
	return axios
		.post(baseUrl, newObject)
		.then(response => response.data)
}

const remove = (id) => {
	return axios
		.delete(`${baseUrl}/${id}`)
}

const update = (id, updatedObject) => {
	return axios
		.put(`${baseUrl}/${id}`, updatedObject)
		.then(response => response.data)
}

const rest = {getAll, add, remove, update}

export default rest