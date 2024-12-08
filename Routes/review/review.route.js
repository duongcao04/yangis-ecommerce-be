const router = require('express').Router()

const reviewController = require('../../controllers/review.controller')

router.get('/', reviewController.getReviews)
router.post('/add', reviewController.createReview)

const reviewRouter = router
module.exports = reviewRouter
