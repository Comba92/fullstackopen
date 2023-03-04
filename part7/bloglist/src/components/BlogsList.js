import Blog from './Blog'
import { useState, useEffect } from 'react'
import services from '../services/blogs'

const BlogsList = ({ blogs, user }) => {
  const [blogsToShow, setBlogs] = useState([])

  useEffect( () => {
    updateBlogsList(blogs)
  }, [blogs])

  const updateBlogsList = (newBlogs) => {
    setBlogs( newBlogs.sort((a, b) => a.likes < b.likes) )
  }

  const updateLikes = async (blogToUpdate) => {
    const updatedBlog = {
      likes: blogToUpdate.likes + 1
    }

    try {
      await services.updateBlog(blogToUpdate.id, updatedBlog)
      updateBlogsList( blogsToShow.map(blog => {
        if (blog.id === blogToUpdate.id)
          return {
            ...blogToUpdate,
            likes: blogToUpdate.likes + 1
          }
        else return blog
      }))
    } catch(error) { console.log(error.name) }
  }

  const removeBlog = async (blogToRemove) => {
    if(user.username !== blogToRemove.user.username) {
      alert('cant delete blogs added by others!')
      return
    }

    try {
      const prompt = `Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`

      if(window.confirm(prompt)) {
        await services.deleteBlog(blogToRemove)

        updateBlogsList( blogsToShow.filter(blog => {
          return blog.id !== blogToRemove.id
        }))
      }
    } catch(error) { console.log(error.name) }
  }

  return (
    <div>
      {blogsToShow.map(blog =>
        <Blog key={blog.id} blog={blog} updateLikes={updateLikes} removeBlog={removeBlog}/>
      )}
    </div>
  )
}

export default BlogsList