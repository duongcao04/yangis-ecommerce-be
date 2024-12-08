const router = require('express').Router()
const productController = require('../../controllers/product.controller')
const { upload } = require('../../helpers/multer_services')

router.get('/', productController.getAllProducts)
router.get('/paginate', productController.getProductsAndPagination)
router.get('/:slug', productController.getBySlug)
router.post(
    '/add',
    upload.array('featureImage'),
    productController.createProduct
)
router.delete('/:id', productController.deleteProduct)
router.put('/:id', productController.updateProduct)

const productRouter = router
module.exports = productRouter
