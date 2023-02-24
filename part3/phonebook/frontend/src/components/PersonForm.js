const PersonForm = (props) => {
  const {addEntry, newName, setNewName, newNumber, setNewNumber} = props
  
  return (
    <div>
    <h2>add a new</h2>
      <form onSubmit={addEntry}>
        <div> name: <input value={newName} onChange={(event) => setNewName(event.target.value)}/> </div>
        <div> number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)}/> </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

export default PersonForm