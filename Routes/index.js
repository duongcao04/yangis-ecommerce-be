const rootRouter = require('express').Router()
const variantRoute = require('./variant.route')
const galleryRoute = require('./gallery.route')
const productRoute = require('./product.route')
const categoryRoute = require('./category.route')
const brandRoute = require('./brand.route')
const orderRoute = require('./order.route')
const userRoute = require('./user.route')
const uploadRoute = require('./upload.route')

// Root router
rootRouter.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        message:
            'Welcome to Yangis Ecommerce RESTful API using nodeJS, ExpressJS and Mongoose, You can read the documentation at README.md',
        author: 'Cao Hai Duong',
        email: 'caohaiduong04@gmail.com',
        github: 'https://github.com/haiduongg',
    })
})

rootRouter.use('/variant', variantRoute)
rootRouter.use('/gallery', galleryRoute)

rootRouter.use('/product', productRoute)
rootRouter.use('/category', categoryRoute)
rootRouter.use('/brand', brandRoute)

rootRouter.use('/order', orderRoute)

rootRouter.use('/user', userRoute)

rootRouter.use('/upload', uploadRoute)

module.exports = rootRouter
