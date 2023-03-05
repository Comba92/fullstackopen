import express from 'express'
import calculateBmi from './bmiCalculator'
import calculateExercises from './exerciseCalculator'
const app = express()
app.use(express.json())

app.get('/ping', (_req, res) => {
  res.send('pong')
})

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height)
  const weight = Number(req.query.weight)

  if(isNaN(height) || isNaN(weight)) {
    res.send({
      error: 'malformatted parameters'
    })
  } else {
    res.send({
      height, weight,
      bmi: calculateBmi(height, weight)
    })
  }
})

app.post('/exercises', (req, res) => {
  const daily_exercises = req.body.daily_exercises
  const target = req.body.target
  
  if(!daily_exercises || !target) {
    res.send({
      error: 'parameters missing'
    })
  }

  else if(daily_exercises.some((val: any) => isNaN(val)) || isNaN(target)) {
    res.send({
      error: 'malformatted parameters'
    })
  }

  else {
    res.send(calculateExercises(daily_exercises, target))
  }
})

const PORT = 3003

app.listen(PORT, () => {
  console.log('Server running on port', PORT)
})