const createError = require('http-errors')

const Review = require('../Models/review.model')
const Product = require('../Models/product.model')

const reviewController = {
    getReviews: async (req, res, next) => {
        try {
            const { product_slug } = req.query
            let reviews = await Review.find().lean()
            let totalReview = reviews.length

            if (product_slug) {
                reviews = await Review.find()
                    .populate([
                        { path: 'user', select: 'avatar -_id' },
                        { path: 'product', select: 'name slug -_id' },
                    ])
                    .then((reviews) =>
                        reviews.filter(
                            (review) => review.product.slug === product_slug
                        )
                    )
                totalReview = reviews.length
            }
            res.status(200).json({
                status: 200,
                message: 'Get reviews successfully',
                data: { reviews, totalReview },
            })
        } catch (error) {
            next(error)
        }
    },
    createReview: async (req, res, next) => {
        try {
            const { user, product, rating, comment } = req.body
            const newReview = new Review({ user, product, rating, comment })
            const savedReivew = await newReview.save()

            const getProduct = await Product.findById(product)
            await getProduct.updateOne({
                $push: { reviews: savedReivew._id },
            })

            res.status(200).json({
                status: 201,
                message: 'New review successfully insert',
            })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = reviewController
