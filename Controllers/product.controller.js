const createError = require('http-errors')

const Variant = require('../Models/variant.model')
const Product = require('../Models/product.model')
const Category = require('../Models/category.model')
const Brand = require('../Models/brand.model')

const { cloudinaryUploadImage } = require('../helpers/cloudinary_services')

const productController = {
    getProducts: async (req, res, next) => {
        try {
            const { name, order, sort, category, brand } = req.query

            // Pagination argument
            const { limit, page } = req.query

            let products = await Product.find().lean()
            let totalProduct = products.length
            if (limit) {
                products = await Product.find().pagination(limit, page).lean()
            }

            // const buildQuery = (filters) => {
            //     let query = {};
            //     if (filters.name) {query.name = new RegExp(filters.name, 'i')}
            //     if (filters.category) {query['category.name'] = category}
            // }

            if (name || category || brand) {
                let options = {}
                if (name) {
                    options['name'] = new RegExp(name, 'i')
                }

                products = await Product.find(options).then((products) => {
                    if (category && brand) {
                        return products.filter(
                            (product) =>
                                product.category.name === category &&
                                product.brand.name === brand
                        )
                    } else {
                        if (category) {
                            return products.filter(
                                (product) => product.category.name === category
                            )
                        }
                        if (brand) {
                            return products.filter(
                                (product) => product.brand.name === brand
                            )
                        }
                    }

                    return products
                })

                totalProduct = products.length
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
            const { name, price, sale, category, brand, variants } = req.body
            let inStock = 0
            let thumbnail = ''
            const isExist = await Product.findOne({ name: name })
            if (isExist) {
                throw createError.Conflict(
                    `${req.body.name} đã tồn tại trong kho`
                )
            }

            const featureImageFile = req.files
            const folder = 'products'
            const featureImage = await cloudinaryUploadImage(
                featureImageFile,
                folder
            )

            const newProduct = new Product({
                name,
                featureImage,
                price,
                sale,
                inStock,
                category,
                brand,
                variants,
            })
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

            if (variants) {
                let index = 0
                variants.forEach(async (item) => {
                    const getVariant = await Variant.findById(item)
                    inStock += +getVariant.inStock
                    await getVariant.updateOne({ product: savedProduct._id })

                    if (index === 0) {
                        thumbnail = getVariant.images[0]
                    }

                    index++

                    if (index === variants.length) {
                        await savedProduct.updateOne({ inStock, thumbnail })
                    }
                })
            }

            res.status(201).json({
                status: 201,
                message: 'Thêm mới sản phẩm thành công',
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

            res.json({ status: 200, message: 'Cập nhật sản phẩm thành công' })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = productController
