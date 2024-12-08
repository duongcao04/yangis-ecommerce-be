const router = require('express').Router()
const uploadController = require('../../controllers/upload.controller')
const { upload } = require('../../helpers/multer_services')

router.post('/image', upload.single('image'), uploadController.ImageUploader)

const uploadRouter = router
module.exports = uploadRouter
