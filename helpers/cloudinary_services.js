const createError = require('http-errors')
const cloudinary = require('cloudinary').v2

const _CONF = require('../config/variables')

cloudinary.config({
    cloud_name: _CONF.cloudinary_cloud_name,
    api_key: _CONF.cloudinary_api_key,
    api_secret: _CONF.cloudinary_api_secret,
})

const cloudinaryUploadImage = async function (files, folder = '') {
    const options = {
        folder: `yangis-ecommerce${folder.length !== 0 && `/${folder}`}`,
        resource_type: 'image',
    }
    try {
        switch (Array.isArray(files)) {
            case true:
                var sourceImage = []
                for (const file of files) {
                    const image = await cloudinary.uploader.upload(
                        file.path,
                        options
                    )
                    sourceImage.push(image.url)
                }
                return sourceImage
            default:
                var sourceImage = ''
                const image = await cloudinary.uploader.upload(
                    files.path,
                    options
                )
                sourceImage = image.url
                return sourceImage
        }
    } catch (error) {
        throw createError(error)
    }
}

const cloudinaryDeleteImage = async function (publicIds) {
    await cloudinary.api.delete_resources(publicIds)
}

module.exports = { cloudinary, cloudinaryUploadImage, cloudinaryDeleteImage }
