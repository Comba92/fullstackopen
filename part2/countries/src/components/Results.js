const Results = ({ results, viewCountry }) => {
	const getResultsToShow = () => {
    // This runs everytime we update the search box!

    if(results.length === 0) return <div>No results.</div>
    if(results.length <= 10) {
      return results.map(result => 
        <div key={result.cca2}>
          {result.name.common} 
          <button onClick={() => viewCountry(result)}> show </button>
        </div>
      )
    } else {
      return <div>Too many matches, specify another filter</div>
    }
  }
	
	return (
		<div>
        {getResultsToShow()}
    </div>
	)
}

export default Results
