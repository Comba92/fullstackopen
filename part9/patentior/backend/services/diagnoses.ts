import diagnoses from '../data/diagnoses'
import { Diagnosis } from '../types'

const get = (): Diagnosis[] => {
  return diagnoses
}

const add = (d: Diagnosis) => {
  diagnoses.concat(d)
}

export default { get, add }