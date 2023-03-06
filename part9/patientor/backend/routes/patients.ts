import express from 'express'
import service from '../services/patients'
import { Entry, NewPatient } from '../types'
const router = express.Router()

router.get('/', (_req, res) => {
  res.json(service.getAll())
})

router.get('/:id', (req, res) => {
  try {
    res.json(service.get(req.params.id))
  } catch(error: unknown) {
    let message = 'Something went wrong!'
    if(error instanceof Error) {
      message += ' Error: ' + error.message
    }

    res.status(400).send(message)
  }
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

router.post('/:id/entries', (req, res) => {
  try {
    const entryToAdd = req.body as Entry
    const patientId = req.params.id
    const updatedPatient = service.addEntry(patientId, entryToAdd)
    console.log(updatedPatient)
    res.json(updatedPatient)
  } catch(error: unknown) {
    let message = 'Something went wrong!'
    if(error instanceof Error) {
      message += ' Error: ' + error.message
    }

    res.status(400).send(message)
  }
})

export default router