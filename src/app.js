// package imports
const express = require('express')
const app = express()
const cors = require('cors')

// function imports
const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middleware')
const resourcesRouter = require('./controllers/resource')
const authRouter = require('./controllers/auth')
require('./database/mongodb')

// allow cors
app.use(cors())
// exposing public directory
app.use(express.json())
// logs incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger)

// resources route handler
app.use('/', resourcesRouter)

app.use('/auth', authRouter)

// handles unknown endpoints
app.use(unknownEndpoint)

// Handle internal server errors which are not caught
app.use(errorHandler);

module.exports = app
