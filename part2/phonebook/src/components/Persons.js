const Persons = ({ persons, removeEntry }) => {
	return (
		<div>
		<h2>Numbers</h2>
      {persons.map(person => {
        return (
					<div key={person.id}>
						<span> {person.name} - {person.number} </span>
						<span> <button onClick={() => {removeEntry(person)}}>delete</button> </span>
					</div>
				)
      })}
		</div>
	)
}

export default Persons