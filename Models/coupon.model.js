const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CouponSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        expiryDate: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Coupon', CouponSchema)
