const router = require('express').Router()
const categoryController = require('../Controllers/category.controller')
const { upload } = require('../helpers/multer_services')

router.get('/', categoryController.getCategories)
router.post('/add', upload.any(), categoryController.createCategory)
router.delete('/:id', categoryController.deleteCategory)

module.exports = router
