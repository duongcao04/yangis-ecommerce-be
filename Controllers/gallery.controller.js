const createError = require('http-errors')

const Gallery = require('../Models/gallery.model')
const { cloudinaryUploadImage } = require('../helpers/cloudinary_services')

const galleryController = {
    getGallery: async (req, res, next) => {
        try {
            const galleries = await Gallery.find()
            res.status(200).json({
                status: 200,
                message: 'Get all gallery successfully',
                data: galleries,
            })
        } catch (error) {
            next(error)
        }
    },

    createGallery: async (req, res, next) => {
        try {
            const { label } = req.body
            const images = await cloudinaryUploadImage(req.files)

            const newGallery = new Gallery({
                label,
                images,
            })
            const savedGallery = await newGallery.save()

            res.status(200).json({
                status: 201,
                message: 'New gallery successfully insert',
                data: savedGallery,
            })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = galleryController
