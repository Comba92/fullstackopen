import { useSelector, useDispatch } from 'react-redux'
import Filter from './Filter'
import Notification from './Notification'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    return state.anecdotes.filter(anecdote => 
      anecdote.content.toLowerCase().includes(state.filter)
    )
  })
  const dispatch = useDispatch()
  
  const vote = (anecdote) => {
    const action = {
      type: 'VOTE',
      payload: { 
        notification: `you voted ${anecdote.content}`,
        id: anecdote.id
      }
    }
    dispatch(action)
    setTimeout(() => dispatch({type: 'HIDE-NOTIFY'}), 5000)
  }
  
  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <Notification />
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList