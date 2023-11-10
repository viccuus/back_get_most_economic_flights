const { WEATHER_API_KEY, WEATHER_API_URL, WEATHER_DAILY } = require("../properties/config.js")
const axios = require('axios');

async function getForecastDays(city) {
    console.debug("getForecastDays:" + city);
    try {
        const response = await axios.get(`${WEATHER_API_URL}${WEATHER_DAILY}?APPID=${WEATHER_API_KEY}&q=${city}`)
        const data = response.data
        const nextDaysWeather = getFirstObjectOfEachDay(data.list)
        return nextDaysWeather
    } catch (error) {
        console.error(error)
        return { error: 'Error al obtener el clima' }
    }
}

function getFirstObjectOfEachDay(data) {
    const result = []
    let previousDate = null
  
    for (const item of data) {
      const currentDate = new Date(item.dt * 1000).toDateString()
  
      if (currentDate !== previousDate) {
        result.push(item)
        previousDate = currentDate
      }
    }
  
    return result
  }

module.exports = {
    getForecastDays
};