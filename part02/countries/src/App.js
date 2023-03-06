import axios from 'axios'
import { useEffect, useState } from 'react'

import Search from './components/Search'
import Results from './components/Results'
import Country from './components/Country'
import Weather from './components/Weather'

const countriesUrl = 'https://restcountries.com/v3.1/all'

const App = () => {
  const [countries, setCountries] = useState([])
  const [results, setResults] = useState(null)
  const [countryToView, setCountryToView] = useState(null)

  const getAllCountries = () => {
    axios.get(countriesUrl).then(response => {
      setCountries(response.data)
    })
  }

  const handleInputSearch = (event) => {
    if(event.target.value === '') {
      setResults(null)
      setCountryToView(null)
    } else {
      setSearchedCountries(event.target.value)
    }
  }

  const setSearchedCountries = (searchString) => {
    searchString = searchString.toLowerCase()
    const results = countries
      .filter(country => country.name.common.toLowerCase().includes(searchString))

    if(countryToView !== null) setCountryToView(null)
    setResults(results)

    if(results.length === 1) {
      setCountryToView(results[0])
    }
  }

  const enableCountryView = (country) => {
    setCountryToView(country)
  }

  useEffect(getAllCountries, [])
  
  return (
    <div>
      <Search onChange={handleInputSearch} />
      { results !== null && results.length !== 1
        ? <Results results={results} viewCountry={enableCountryView}/>
        : <></>
      }
      { countryToView !== null
        ? <div>
            <Country country={countryToView} />
            <Weather country={countryToView} />
          </div>
        : <></>
      }
    </div>
  )
}

export default App