const router = require('express').Router()
const brandController = require('../Controllers/brand.controller')

router.get('/', brandController.getBrands)
router.post('/add', brandController.createBrand)

module.exports = router
