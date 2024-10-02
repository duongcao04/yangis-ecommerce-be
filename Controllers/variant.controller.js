const createError = require('http-errors')

const Variant = require('../Models/variant.model')
const Product = require('../Models/product.model')
const { cloudinaryUploadImage } = require('../helpers/cloudinary_services')

const variantController = {
    getVariants: async (req, res, next) => {
        try {
            const { product } = req.query
            let variants = await Variant.find()

            if (product) {
                variants = await Variant.find({ product: product })
            }

            res.status(200).json({
                status: 200,
                message: 'Get variants successfully',
                data: variants,
            })
        } catch (error) {
            next(error)
        }
    },

    createVariant: async (req, res, next) => {
        try {
            const { label, product, inStock } = req.body
            const images = await cloudinaryUploadImage(
                req.files,
                (folder = 'product-variants')
            )

            const newVariant = new Variant({
                label,
                images,
                product,
                inStock,
            })
            const savedVariant = await newVariant.save()

            res.status(200).json({
                status: 201,
                message: 'New variant successfully insert',
                data: savedVariant,
            })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = variantController
