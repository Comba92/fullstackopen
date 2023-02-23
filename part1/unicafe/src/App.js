import { useState } from 'react'

const Entry = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value} </td>
  </tr>
)

const Button = ({ text, onClick }) => (
  <><button onClick={onClick}>{text}</button></>
)

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad

  if (all === 0) return (
    <div>
      <h1>statistics</h1>
      <p>No feedback given</p>
    </div>
  )

  const avg = (good - bad) / all
  const positive = good / all
  return (
    <div>
      <h1>statistics</h1>
      <table>
       <Entry text="good" value={good}/>
       <Entry text="neutral" value={neutral}/>
       <Entry text="bad" value={bad}/>
       <Entry text="all" value={all}/>
       <Entry text="average" value={avg}/>
       <Entry text="positive" value={positive + ' %'}/>
      </table>
    </div>
  )
}
 
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good+1)} text="good"/>
      <Button onClick={() => setNeutral(neutral+1)} text="neutral"/>
      <Button onClick={() => setBad(bad+1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App