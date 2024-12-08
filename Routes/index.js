const rootRouter = require('express').Router()

const variantRouter = require('./variant/variant.route')
const productRouter = require('./product/product.route')
const categoryRouter = require('./category/category.route')
const brandRouter = require('./brand/brand.route')
const orderRouter = require('./order/order.route')
const uploadRouter = require('./upload/upload.route')
const reviewRouter = require('./review/review.route')
const userRouter = require('./user/user.route')

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
rootRouter.use('/users', userRouter)

rootRouter.use('/products', productRouter)

rootRouter.use('/variant', variantRouter)
rootRouter.use('/review', reviewRouter)

rootRouter.use('/category', categoryRouter)
rootRouter.use('/brand', brandRouter)

rootRouter.use('/order', orderRouter)

rootRouter.use('/upload', uploadRouter)

module.exports = rootRouter
