const router = require('express').Router()
const galleryController = require('../Controllers/gallery.controller')
const { upload } = require('../helpers/multer_services')

router.get('/', galleryController.getGallery)
router.post('/add', upload.any(), galleryController.createGallery)

module.exports = router
