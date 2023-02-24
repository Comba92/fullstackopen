const Filter = ({ filter, setNewFilter }) => {
	return (
		<div>filter show with <input value={filter} onChange={setNewFilter} /></div>
	)
}

export default Filter