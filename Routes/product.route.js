const router = require('express').Router()
const productController = require('../Controllers/product.controller')
const { upload } = require('../helpers/multer_services')

router.get('/', productController.getProducts)
router.get('/:id', productController.getOneProduct)
router.post('/add', upload.any(), productController.createProduct)
router.delete('/:id', productController.deleteProduct)
router.put('/:id', productController.updateProduct)

module.exports = router
