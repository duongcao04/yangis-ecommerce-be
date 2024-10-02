const router = require('express').Router()
const uploadController = require('../Controllers/upload.controller')
const { upload } = require('../helpers/multer_services')

router.post('/image', upload.single('image'), uploadController.ImageUploader)

module.exports = router
