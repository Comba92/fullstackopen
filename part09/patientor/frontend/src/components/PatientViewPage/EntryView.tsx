import { useEffect, useState } from "react"
import diagnosesService from "../../services/diagnoses"

import { Diagnosis, Entry } from "../../types"

interface Props {
  entry: Entry
}

const EntryView = ({ entry }: Props) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])

  useEffect(() => {
    const fetchDiagnoses = async () => {
      if (entry.diagnosisCodes) {
        const allDiagnoses = await diagnosesService.getAll()
        setDiagnoses(allDiagnoses)
      }
    }

    void fetchDiagnoses()
  }, [])
  
  return (
    <div>
      <div>{entry.date} {entry.description}</div>
      <div>diagnose by {entry.specialist}</div>
      <ul>
        {entry.diagnosisCodes?.map(code => (
          <li key={code}>
            {code}: {diagnoses.find(d => d.code === code)?.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EntryView