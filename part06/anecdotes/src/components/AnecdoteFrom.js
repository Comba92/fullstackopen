import { useDispatch } from 'react-redux'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  
  const add = (event) => {
    event.preventDefault()

    const action = {
      type: 'ADD',
      payload: { 
        anecdote: event.target.input.value,
        notification: `you added ${event.target.input.value}`
      }
    }
    dispatch(action)
    setTimeout(() => dispatch({type: 'HIDE-NOTIFY'}), 5000)
  }
  
  return (
    <div>
      <h2>create new</h2>
        <form onSubmit={add}>
          <div><input name="input"/></div>
          <button>create</button>
        </form>
    </div>
  )
}

export default AnecdoteForm