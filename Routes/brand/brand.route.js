const router = require('express').Router()
const brandController = require('../../controllers/brand.controller')

router.get('/', brandController.getBrands)
router.post('/add', brandController.createBrand)

const brandRouter = router
module.exports = brandRouter
