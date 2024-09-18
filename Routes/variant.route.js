const router = require('express').Router()
const variantController = require('../Controllers/variant.controller')
const { upload } = require('../helpers/multer_services')

router.get('/', variantController.getVariants)
router.post('/add', upload.any(), variantController.createVariant)

module.exports = router
