import { useEffect, useState } from 'react' 
import { useParams } from 'react-router-dom'

import { Male, Female } from '@mui/icons-material'

import patientService from "../../services/patients";
import { Entry, Patient } from "../../types"
import Entries from "./Entries"


const PatientViewPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [error, setError] = useState<string>('')
  const { id } = useParams()

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setPatient(await patientService.get(id as string))
      } catch(error: unknown) {
        if (error instanceof Error) {
          setError('Error: ' + error.message)
        } else { setError('') }
      }
    }

    void fetchPatient()
  }, [])

  if(patient) {
    return (
      <div>
        <h2>
          {patient.name}
          {patient.gender === 'male' ? <Male></Male> : ''}
          {patient.gender === 'female' ? <Female></Female> : ''}
        </h2>
        <div>
          <div>ssn: {patient.ssn}</div>
          <div>occupation: {patient.occupation}</div>
        </div>
        <Entries entries={patient.entries as Entry[]}/>
      </div>
    )
  } else return <div>{error}</div>
}

export default PatientViewPage