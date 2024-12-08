const router = require('express').Router()

const orderController = require('../../controllers/order.controller')

router.get('/', orderController.getOrders)
router.get('/:id', orderController.getAnOrders)
router.post('/add', orderController.createOrder)

const orderRouter = router
module.exports = orderRouter
