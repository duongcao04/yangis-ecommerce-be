const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            default: '',
        },
        thumbnail: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    },
    { timestamps: true }
)
categorySchema.pre('save', function () {
    if (!this.slug) {
        this.slug = nonAccentVietnamese(this.name)
    }
})

module.exports = mongoose.model('Category', categorySchema)
