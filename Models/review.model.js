const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Review', ReviewSchema)
