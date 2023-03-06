const Country = ({ country }) => {
    const languages = Object.entries(country.languages).map(language => {
      const [key, value] = language
      return <li key={key}>{value}</li>
    })

    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>

        <h3>languages:</h3>
          <ul>
            {languages}
          </ul>
          <div><img 
            src={country.flags.png} alt={country.flags.alt}
            width='150' height='100'/>
            </div>
      </div>
    )
}

export default Country