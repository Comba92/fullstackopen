import { useState } from 'react'
import {
  Routes, Route, Link,
  useParams, useNavigate, useMatch
} from 'react-router-dom'
import { useField } from './hooks'

const Menu = ( { anecdotes, addNew } ) => {
  const padding = {
    paddingRight: 5
  }
  return (
      <div>
        <Link to="/" style={padding}>anecdotes</Link>
        <Link to="/create" style={padding}>create new</Link>
        <Link to='/about' style={padding}>about</Link>
      </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
        <li key={anecdote.id} > 
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)

const AnecdoteView = ({ anecdote }) => {
  return (  
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see {anecdote.info}</p>
    </div>  
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const content = useField('content')
  const author = useField('author')
  const info = useField('info')
  const redirect = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.field.value,
      author: author.field.value,
      info: info.field.value,
      votes: 0
    })

    props.setNotification(`a new anecdote ${content.field.value} created!`)
    setTimeout(() => props.setNotification(''), 5000)
    redirect('/')
  }

  const resetFields = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.field} />
        </div>
        <div>
          author
          <input {...author.field} />
        </div>
        <div>
          url for more info
          <input {...info.field} />
        </div>
        <button>create</button>
        <button onClick={resetFields}>reset</button>
      </form>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')
  const match = useMatch('/anecdotes/:id')
  const anecdote = match 
    ? anecdotes.find(a => a.id === Number(match.params.id))
    : null

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <div>
        <h1>Software anecdotes</h1>
        <Menu anecdotes={anecdotes} addNew={addNew} />
        {notification ? notification : ''}
      </div>

      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes}/>} />
        <Route path="/anecdotes/:id" element={<AnecdoteView anecdote={anecdote} />} />
        <Route path="create" element={
          <CreateNew 
            addNew={addNew} 
            setNotification={(text) => setNotification(text)} 
          />
        } />
        <Route path="/about" element={<About />} />
      </Routes>
    
      <Footer />
    </div>
  )
}

export default App
