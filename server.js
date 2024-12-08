const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const createError = require('http-errors')
const bodyParser = require('body-parser')
const rootRouter = require('./routes')
const _CONF = require('./config/variables')
const { swaggerSpec, swaggerUi } = require('./helpers/swagger_services')
require('./helpers/connections_mongodb')

const app = express()
const PORT = _CONF.port || 3001

app.use(bodyParser.json({ limit: '50mb' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('common'))

//Routes
app.use('/api', rootRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Fowrard to handle error
app.all('*', (req, res, next) => {
    next(createError.NotFound('This route does not exist.'))
})

// Handle error
app.use((err, req, res, next) => {
    if (!err) return next()
    res.json({
        status: err.status || 500,
        message: err.message,
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on:::http://localhost:${PORT}`)
})
