const createError = require('http-errors')

const Category = require('../Models/category.model')
const { cloudinaryUploadImage } = require('../helpers/cloudinary_services')

const categoryController = {
    getCategories: async (req, res, next) => {
        try {
            const categories = await Category.find().populate('products')
            res.status(200).json({
                status: 200,
                message: 'Get all category successfully',
                data: categories,
            })
        } catch (error) {
            next(error)
        }
    },
    createCategory: async (req, res, next) => {
        try {
            const { name, icon } = req.body
            const isExist = await Category.findOne({ name: name })
            if (isExist) {
                throw createError.Conflict(`${req.body.name} is exist`)
            }

            const thumbnail = await cloudinaryUploadImage(
                req.files[0],
                (folder = 'categories')
            )

            const newCategory = new Category({ name, icon, thumbnail })
            await newCategory.save()

            res.status(200).json({
                status: 201,
                message: 'New category successfully insert',
            })
        } catch (error) {
            next(error)
        }
    },
    deleteCategory: async (req, res, next) => {
        try {
            const category = await Category.findByIdAndDelete(req.params.id)

            if (!category) {
                throw createError.NotFound(`Category not found`)
            }

            res.json({ status: 200, message: 'Category successfully delete' })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = categoryController
