import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const addBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const request = await axios.post(baseUrl, newBlog, config)
  return request.data
}

const updateBlog = async (id, updatedBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const request = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return request.data
}

const deleteBlog = async (toDeleteBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const request = await axios.delete(`${baseUrl}/${toDeleteBlog.id}`, config)
  return request.data
}

export default { getAll, addBlog, updateBlog, deleteBlog, setToken }