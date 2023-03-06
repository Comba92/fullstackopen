import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducer'

const counter = createStore(counterReducer)

const App = () => {
  return (
    <div>
      <div>
        <button onClick={() => counter.dispatch({ type: 'GOOD'})}>good</button>
        <button onClick={() => counter.dispatch({ type: 'OK'})}>ok</button>
        <button onClick={() => counter.dispatch({ type: 'BAD'})}>bad</button>
        <button onClick={() => counter.dispatch({ type: 'ZERO'})}>reset stats</button>
      </div>
      <div>
        {Object.entries(counter.getState()).map(([key, value]) => (
          <div>{key}: {value}</div>
        ))}
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
const renderApp = () => {
  root.render(<App />)
}

renderApp()
counter.subscribe(renderApp)