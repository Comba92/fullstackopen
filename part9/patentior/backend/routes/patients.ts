import express from 'express'
import service from '../services/patients'
import { NewPatient } from '../types'
const router = express.Router()

router.get('/', (_req, res) => {
  res.send(service.get())
})

router.post('/', (req, res) => {
  try {
    const patientToAdd = req.body as NewPatient
    const addedPatient = service.add(patientToAdd)
    console.log(addedPatient)
    res.json(addedPatient)
  } catch(error: unknown) {
    let message = 'Something went wrong!'
    if(error instanceof Error) {
      message += ' Error: ' + error.message
    }

    res.status(400).send(message)
  }
})

export default router