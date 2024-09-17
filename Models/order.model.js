const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        deliveryInformation: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String },
        },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        totalAmount: { type: Number, required: true },
        shippingFee: { type: Number, required: true },
        bonusPoints: {
            type: Number,
        },
        paymentMethod: {
            type: String,
            enum: ['bank', 'cash'],
            default: 'cash',
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Order', OrderSchema)
