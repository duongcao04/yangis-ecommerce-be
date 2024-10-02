const router = require('express').Router()
const productController = require('../Controllers/product.controller')
const { upload } = require('../helpers/multer_services')

router.get('/', productController.getProducts)
router.get('/:slug', productController.getBySlug)
router.post(
    '/add',
    upload.array('featureImage'),
    productController.createProduct
)
router.delete('/:id', productController.deleteProduct)
router.put('/:id', productController.updateProduct)

module.exports = router
