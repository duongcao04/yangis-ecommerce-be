const router = require('express').Router()

const orderController = require('../Controllers/order.controller')

router.get('/', orderController.getOrders)
router.get('/:id', orderController.getAnOrders)
router.post('/add', orderController.createOrder)

module.exports = router
