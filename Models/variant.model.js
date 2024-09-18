const mongoose = require('mongoose')
const Schema = mongoose.Schema

const variantSchema = new Schema(
    {
        label: {
            type: String,
            required: true,
        },
        images: [
            {
                type: String,
                required: true,
            },
        ],
        inStock: {
            type: Number,
            default: 0,
        },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Variant', variantSchema)
