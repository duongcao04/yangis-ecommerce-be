const createError = require('http-errors')

const Gallery = require('../Models/gallery.model')
const Product = require('../Models/product.model')
const Category = require('../Models/category.model')
const Brand = require('../Models/brand.model')

const { cloudinaryUploadImage } = require('../helpers/cloudinary_services')

const productController = {
    getProducts: async (req, res, next) => {
        try {
            const { name, order, sort } = req.query

            // Pagination argument
            const { limit, page } = req.query

            let products = await Product.find().lean()
            let totalProduct = products.length
            if (limit) {
                products = await Product.find().pagination(limit, page).lean()
            }

            // Search by name
            if (name) {
                products = await Product.find().byName(name)
                totalProduct = products.length
                if (limit) {
                    products = await Product.find()
                        .byName(name)
                        .pagination(limit, page)
                }
            }

            // Order by
            if (order) {
                products = await Product.find().orderBy(order, sort)
                totalProduct = products.length
                if (limit) {
                    products = await Product.find()
                        .orderBy(order, sort)
                        .pagination(limit, page)
                }
            }

            const totalPage = Math.ceil(totalProduct / limit) || 1

            res.status(200).json({
                status: 200,
                message: 'Get products successfully',
                data: {
                    totalProduct,
                    totalPage: totalPage,
                    products: products,
                },
            })
        } catch (error) {
            next(error)
        }
    },
    getOneProduct: async (req, res, next) => {
        try {
            const product = await Product.findById(req.params.id)
            res.status(200).json({
                status: 200,
                message: 'Get a product successfully',
                data: product,
            })
        } catch (error) {
            next(error)
        }
    },
    createProduct: async (req, res, next) => {
        try {
            const { name, price, sale, category, brand, attribute } = req.body
            const isExist = await Product.findOne({ name: name })
            if (isExist) {
                throw createError.Conflict(
                    `${req.body.name} is exist in inventory`
                )
            }

            const [thumbnailFile, ...featureImageFile] = req.files
            const folder = 'products'
            const thumbnail = await cloudinaryUploadImage(thumbnailFile, folder)
            const featureImage = await cloudinaryUploadImage(
                featureImageFile,
                folder
            )

            const newProduct = new Product({
                name,
                thumbnail,
                featureImage,
                price,
                sale,
                category,
                brand,
                attribute,
            })
            res.send(newProduct)
            const savedProduct = await newProduct.save()

            if (category) {
                const getCategory = await Category.findById(category)
                await getCategory.updateOne({
                    $push: { products: savedProduct._id },
                })
            }
            if (brand) {
                const getBrand = await Brand.findById(brand)
                await getBrand.updateOne({
                    $push: { products: savedProduct._id },
                })
            }

            if (attribute) {
                if (attribute.color) {
                    attribute.color.forEach(async (item) => {
                        const gallery = await Gallery.findById(item)
                        await gallery.updateOne({ product: savedProduct._id })
                    })
                }
            }
            res.status(201).json({
                status: 201,
                message: 'Insert new product successfully',
            })
        } catch (error) {
            next(error)
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id)

            if (!product) {
                throw createError.NotFound(`Không tìm thấy sản phẩm`)
            }

            res.json({ status: 200, message: 'Xóa sản phẩm thành công' })
        } catch (error) {
            next(error)
        }
    },
    updateProduct: async (req, res, next) => {
        try {
            const product = await Product.updateOne(
                { _id: req.params.id },
                req.body
            )

            if (!product) {
                throw createError.NotFound(`Không tìm thấy sản phẩm`)
            }

            res.json({ status: 200, message: 'Cập ' })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = productController
