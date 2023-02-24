import axios from 'axios'
import { useState, useEffect } from 'react'

const weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY

const Weather = ({ country }) => {
  const [weather, setWeather] = useState({})

  const getGeocode = async () => {
    const requestUrl = `https://api.openweathermap.org/geo/1.0/\
      direct?q=${country.capital}\
      &limit=1\
      &appid=${weatherApiKey}`

    return axios.get(requestUrl).then(response => {
      const geocode = {
        lat: response.data[0].lat,
        lon: response.data[0].lon
      }
      
      return Promise.resolve(geocode)
    })
  }

  const getWeatherData = async (geocode) => {
    const requestUrl = `https://api.openweathermap.org/data/2.5/\
      weather?lat=${geocode.lat}&lon=${geocode.lon}\
      &units=metric\
      &appid=${weatherApiKey}`

    return axios.get(requestUrl).then(response => {
      const iconUrl = `https://openweathermap.org/img/wn/\
        ${response.data.weather[0].icon}@2x.png`
      
      const weatherObject = {
        temp: response.data.main.temp,
        wind: response.data.wind.speed,
        icon: iconUrl
      }

      return Promise.resolve(weatherObject)
    })
  }

  const getWeather = () => {
    // useEffect wants a sync function so we have to wrap the async like this
    const asyncFetch = async () => {
      const geocode = await getGeocode()
      const weatherData = await getWeatherData(geocode)

      setWeather(weatherData)
    }
    asyncFetch()
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getWeather, [country.capital])

  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <div>temperature {weather.temp} Celcius</div>
      <div><img src={weather.icon} alt='...'></img></div>
      <div>wind {weather.wind} m/s</div>
    </div>
  )
}

export default Weather