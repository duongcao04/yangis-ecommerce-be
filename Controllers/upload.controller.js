const createError = require('http-errors')
const { cloudinaryUploadImage } = require('../helpers/cloudinary_services')

const uploadController = {
    ImageUploader: async (req, res, next) => {
        try {
            const Image = req.file

            const folder = 'images'
            const resImage = await cloudinaryUploadImage(Image, folder)

            res.status(201).json({
                status: 201,
                message: 'Upload image successfully',
                data: resImage,
            })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = uploadController
