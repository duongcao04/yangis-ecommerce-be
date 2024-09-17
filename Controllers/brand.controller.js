const createError = require('http-errors')

const Brand = require('../Models/brand.model')

const brandController = {
    getBrands: async (req, res, next) => {
        try {
            const brands = await Brand.find().populate({ path: 'products' }).lean()
            res.status(200).json({
                status: 200,
                message: 'Get brands successfully',
                data: brands,
            })
        } catch (error) {
            next(error)
        }
    },

    createBrand: async (req, res, next) => {
        try {
            const isExist = await Brand.findOne({ name: req.body.name })
            if (isExist) {
                throw createError.Conflict(`${req.body.name} is exist`)
            }

            const newBrand = new Brand(req.body)
            await newBrand.save()

            res.status(201).json({
                status: 201,
                message: 'Insert new brand successfully',
            })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = brandController
