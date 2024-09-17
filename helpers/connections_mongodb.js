const mongoose = require('mongoose')
const _CONF = require('../config/variables')

const conn = mongoose.connect(_CONF.mongodb_uri)

mongoose.connection.on('connected', function () {
    console.log(`Mongodb::: connected:::${this.name}`)
})
mongoose.connection.on('disconnected', function () {
    console.log(`Mongodb::: disconnected:::${this.name}`)
})
mongoose.connection.on('error', function (error) {
    console.log(`Mongodb::: connection ${this.name}:::${JSON.stringify(error)}`)
})

process.on('SIGINT', () => {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected on app termination')
        process.exit(0)
    })
})

module.exports = conn
