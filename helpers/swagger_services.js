const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const { userRouteDoc } = require('../routes/user/user.doc')
const _CONF = require('../config/variables')

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Yangis Shop API',
            version: '1.0.0',
            description: 'This is a REST API application made with Express',
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'JSONPlaceholder',
                url: 'https://jsonplaceholder.typicode.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${_CONF.port}/api`,
                // description: 'Development server',
            },
        ],
        paths: {
            '/user': userRouteDoc,
        },
    },
    apis: ['./Routes/*.js'],
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = {
    swaggerUi,
    swaggerSpec,
}
