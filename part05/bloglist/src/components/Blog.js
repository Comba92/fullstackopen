import Togglable from './Togglable'

const Blog = ({ blog, updateLikes, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <span>
        {blog.title} {blog.author} <Togglable buttonLabel="view">
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={() => updateLikes(blog)}>like</button> </div>
          <div>{blog.user ? blog.user.username : ''}</div>
          <div><button onClick={() => removeBlog(blog)}>remove</button></div>
        </Togglable>
      </span>
    </div>
  )
}

export default Blog