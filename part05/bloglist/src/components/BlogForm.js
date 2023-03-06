import Togglable from './Togglable'

const BlogForm = ({ addBlog, formVisible }) => {
  return (
    <Togglable buttonLabel="new note" ref={formVisible}>
      <div>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
          <div>title:<input name="title"></input></div>
          <div>author:<input name="author"></input></div>
          <div>url:<input name="url"></input></div>
          <div><button>create</button></div>
        </form>
      </div>
    </Togglable>
  )
}

export default BlogForm