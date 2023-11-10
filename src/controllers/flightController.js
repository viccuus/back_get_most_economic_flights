const googleFlightsService = require('../services/googleFlightsService');
const weatherApi = require('../services/weatherAPIService');


async function getFligthsAndWeatherConditions(req, res) {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    let {placeFrom, placeTo, dateFrom, dateTo} = req.query

    let info = {}

    let weatherNextDays = await weatherApi.getForecastDays(placeTo);
    if(weatherNextDays.length >0) {
        info['weatherNextDays'] = weatherNextDays
    }

    let flights = await googleFlightsService.generalScrapGoogleFlights(placeFrom, placeTo, dateFrom, dateTo)
    console.debug(flights)
    if (flights.length > 0) {
        info['flightsInfo'] = flights
    }
    
    console.debug("Result: ", info)

    res.send(info)
}


module.exports = {
    getFligthsAndWeatherConditions
}