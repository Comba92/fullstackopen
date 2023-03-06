import { Button } from "@mui/material"
import { Entry } from "../../types"

import EntryView from "./EntryView"

interface Props {
  entries: Entry[]
}

const EntriesList = ({ entries }: Props) => {
  return (
    <div>
      <h3>entries</h3>
        {entries.map(entry => (
          <EntryView key={entry.id} entry={entry} />
        ))}
        <Button variant="contained" color="primary">Add New Entry</Button>
    </div>
  )
}

export default EntriesList