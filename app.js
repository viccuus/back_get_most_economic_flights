const express = require('express')
const app = express()
const port = 3000

const flightRouter = require('./src/routing/flight')

app.use('/flights', flightRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})