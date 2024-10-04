const createError = require('http-errors')

const Variant = require('../Models/variant.model')
const Product = require('../Models/product.model')
const Category = require('../Models/category.model')
const Brand = require('../Models/brand.model')

const { cloudinaryUploadImage } = require('../helpers/cloudinary_services')

const productController = {
    getProducts: async (req, res, next) => {
        try {
            const { limit, page, orderBy, sort, ...filters } = req.query

            const { name, category, brand } = filters
            let totalProduct
            const products = await Product.find()
                .byName(name)
                .byCategory(category)
                .byBrand(brand)
                .orderBy(orderBy, sort)
                .lean()
                .then((result) => {
                    const products = result.filter(
                        (product) =>
                            product.category !== null && product.brand !== null
                    )
                    totalProduct = result.length
                    const startIndex = (page - 1) * limit // Tính chỉ số bắt đầu
                    const endIndex = page * limit // Tính chỉ số kết thúc
                    return products.slice(startIndex, endIndex) // Cắt mảng theo giới hạn
                })
            const totalPage = Math.round(totalProduct / limit) ?? 1
            return res.status(200).json({
                status: 200,
                message: 'Get products successfully',
                data: {
                    totalProduct,
                    totalPage,
                    products: products,
                },
            })
        } catch (error) {
            next(error)
        }
    },
    getBySlug: async (req, res, next) => {
        try {
            const { slug } = req.params
            const product = await Product.findOne({ slug: slug }).replaceIds()
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
            const { name, price, sale, category, brand, variants, slug } =
                req.body
            let inStock = 0
            let thumbnail = ''
            const isExist = await Product.findOne({ name: name })
            if (isExist) {
                throw createError.Conflict(
                    `${req.body.name} đã tồn tại trong kho`
                )
            }
            const isExistSlug = await Product.findOne({ slug: slug })
            if (isExistSlug) {
                throw createError.Conflict(
                    `Đường dẫn ${req.body.slug} đã tồn tại`
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
                slug,
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
            const product = await Product.findById(req.params.id)

            if (!product) {
                throw createError.NotFound(`Không tìm thấy sản phẩm`)
            }
            product.variants.forEach(async (variant) => {
                await Variant.findByIdAndDelete(variant)
            })

            await Product.deleteOne({ _id: product._id })
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
