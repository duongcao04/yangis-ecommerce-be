const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const _CONF = require('../config/variables')

const signAccessToken = (user) => {
    const userId = user.id
    const userRole = user.role
    return new Promise((resolve, reject) => {
        const payload = {
            userId,
            userRole,
        }
        const secret = _CONF.access_token_secret
        const options = {
            expiresIn: _CONF.access_token_life,
        }

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

const signRefreshToken = (user) => {
    const userId = user.id
    const userRole = user.role
    return new Promise((resolve, reject) => {
        const payload = {
            userId,
            userRole,
        }
        const secret = _CONF.refresh_token_secret
        const options = {
            expiresIn: _CONF.refresh_token_life,
        }

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return next(createError.Unauthorized())
    }

    const headers = req.headers['authorization']
    const bearerToken = headers.split(' ')
    const token = bearerToken[1]

    jwt.verify(token, _CONF.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) next(createError.Unauthorized())
        req.payload = payload
        next()
    })
}

const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, _CONF.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) reject(err)
            resolve(payload)
        })
    })
}

module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
}
