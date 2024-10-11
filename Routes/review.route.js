const router = require('express').Router()

const reviewController = require('../Controllers/review.controller')

router.get('/', reviewController.getReviews)
router.post('/add', reviewController.createReview)

module.exports = router
