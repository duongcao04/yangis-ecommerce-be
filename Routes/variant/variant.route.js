const router = require('express').Router()
const variantController = require('../../controllers/variant.controller')
const { upload } = require('../../helpers/multer_services')

router.get('/', variantController.getVariants)
router.post('/add', upload.any(), variantController.createVariant)

const variantRouter = router
module.exports = variantRouter
