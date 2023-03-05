import patients from '../data/patients'
import { Patient, NewPatient, NonSensitivePatient } from '../types'

import { v1 as uuid } from 'uuid'

const getNonSensitivePatient = (p: Patient): NonSensitivePatient => {
  const { id, name, dateOfBirth, gender, occupation } = p
  return { id, name, dateOfBirth, gender, occupation }
}

const get = (): NonSensitivePatient[] => {
  const patientsToReturn = patients as Patient[]
  return patientsToReturn.map(p => getNonSensitivePatient(p))
}

const add = (patientToAdd: NewPatient): NonSensitivePatient => {
  const newPatient = {
    ...patientToAdd,
    id: uuid()
  }
  
  patients.push(newPatient)
  return getNonSensitivePatient(newPatient)
}

export default { get, add }