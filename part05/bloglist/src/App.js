import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogsList from './components/BlogsList'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [loggedUser, setLoggedUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])

  const [notification, setNotification] = useState(null)
  const blogFormVisible = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setLoggedUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(response => {
      setBlogs(response)
    })
  }, [loggedUser])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login(username, password)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setLoggedUser(user)
    } catch(error) {
      showError(error.message)
    }

    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setLoggedUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const newBlog = {
      title: formData.get('title'),
      author: formData.get('author'),
      url: formData.get('url')
    }

    const result = await blogService.addBlog(newBlog)
    setBlogs( blogs.concat(result) )
    showNotificaiton(`a new blog: ${result.title} by ${result.author} added`)
    blogFormVisible.current.toggleVisibility()
  }

  const showNotificaiton = (message) => {
    setNotification({
      text: message,
      color: 'green'
    })
    setTimeout(() => { setNotification(null)}, 5000)
  }

  const showError = (message) => {
    setNotification({
      text: message,
      color: 'red'
    })
    setTimeout(() => setNotification(null), 10000)
  }

  return (
    <div>
      {notification !== null && (
        <Notification message={notification} />
      )}
      {loggedUser === null && (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleLogin={handleLogin}
        />
      )}
      {loggedUser !== null && (
        <div>
          <h2>blogs</h2>
          <div>
            <p>
              {loggedUser.name} logged in
              <button onClick={handleLogout}>logout</button>
            </p>
          </div>
          <BlogForm addBlog={addBlog} formVisible={blogFormVisible}/>
          <BlogsList user={loggedUser} blogs={blogs} />
        </div>
      )}

    </div>
  )
}

export default App