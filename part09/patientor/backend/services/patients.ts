import patients from '../data/patients'
import { Patient, NewPatient, NonSensitivePatient, Entry } from '../types'

import { v1 as uuid } from 'uuid'

const getNonSensitivePatient = (p: Patient): NonSensitivePatient => {
  const { id, name, dateOfBirth, gender, occupation } = p
  return { id, name, dateOfBirth, gender, occupation }
}

const getAll = (): NonSensitivePatient[] => {
  const patientsToReturn = patients as Patient[]
  return patientsToReturn.map(p => getNonSensitivePatient(p))
}

const get = (id: string): Patient => {
  const patientToReturn = patients.find(p => p.id === id) as Patient
  
  if (!patientToReturn) throw new Error('Patient not found')
  if(!patientToReturn.entries) patientToReturn.entries = []

  return patientToReturn
}

const add = (patientToAdd: NewPatient): NonSensitivePatient => {
  const newPatient = {
    ...patientToAdd,
    id: uuid(),
    entries: []
  }
  
  patients.push(newPatient)
  return getNonSensitivePatient(newPatient)
}

const addEntry = (patientId: string, newEntry: Entry): NonSensitivePatient => {
  const index = patients.findIndex(p => p.id === patientId)

  if(index < 0) throw new Error('Patient not found')

  patients[index].entries.push(newEntry)
  return getNonSensitivePatient(patients[index])
}

export default { getAll, get, add, addEntry }