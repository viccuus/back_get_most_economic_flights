const flightController = require('../controllers/flightController')
const express = require('express')
const router = express.Router()

router.get('/economic', flightController.getFligthsAndWeatherConditions)

module.exports = router