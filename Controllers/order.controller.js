const createError = require('http-errors')

const Order = require('../Models/order.model')
const Category = require('../Models/category.model')

const orderController = {
    getOrders: async (req, res, next) => {
        try {
            const { userId } = req.query
            let orders = await Order.find()
                .populate('user')
                .populate('products')
            if (userId) {
                orders = await Order.find({ user: userId })
                    .populate('user')
                    .populate('products')
            }

            res.status(200).json({
                status: 200,
                message: 'Get orders successfully',
                data: orders,
            })
        } catch (error) {
            next(error)
        }
    },
    getAnOrders: async (req, res, next) => {
        try {
            const order = await Order.findById(req.params.id).populate('user')

            res.status(200).json({
                status: 200,
                message: 'Get an order successfully',
                data: order,
            })
        } catch (error) {
            next(error)
        }
    },
    createOrder: async (req, res, next) => {
        try {
            const newOrder = new Order(req.body)
            await newOrder.save()

            res.status(200).json({
                status: 201,
                message: 'Create new order successfully',
            })
        } catch (error) {
            next(error)
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const order = await Order.findByIdAndDelete(req.params.id)

            if (!order) {
                throw createError.NotFound(`Order not found`)
            }

            res.json({ status: 200, message: 'Order successfully delete' })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = orderController
