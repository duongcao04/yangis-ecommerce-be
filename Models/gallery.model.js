const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GallerySchema = new Schema(
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
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Gallery', GallerySchema)
