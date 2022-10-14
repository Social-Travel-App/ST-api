const express = require("express")
const app = express()

require('./routers/index')(app)
module.exports = app