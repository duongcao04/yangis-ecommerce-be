const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Category = require('./category.model')
const Brand = require('./brand.model')
const Gallery = require('./gallery.model')

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        thumbnail: { type: String, required: true },
        featureImage: [{ type: String }],
        price: {
            type: Number,
            required: true,
        },
        sale: {
            type: String,
        },
        inStock: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
        },
        attribute: {
            type: Object,
            color: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Gallery',
                },
            ],
            storage: [{ type: String }],
        },
        properties: {
            type: Schema.Types.Mixed,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        brand: {
            type: Schema.Types.ObjectId,
            ref: 'Brand',
        },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    },
    { timestamps: true }
)

// Automatic reference all field ids
// https://viblo.asia/p/tim-hieu-ve-populate-trong-mongoogse-GrLZDvpE5k0
ProductSchema.pre('find', function () {
    this.populate([
        { path: 'category', model: Category, select: 'name -_id' },
        { path: 'brand', model: Brand, select: 'name -_id' },
    ]).populate({
        path: 'attribute',
        populate: {
            path: 'color',
            model: Gallery,
            select: 'label images -_id',
        },
    })
})

ProductSchema.pre('findOne', function () {
    this.populate([
        { path: 'category', model: Category, select: 'name -_id' },
        { path: 'brand', model: Brand, select: 'name -_id' },
    ]).populate({
        path: 'attribute',
        populate: {
            path: 'color',
            model: Gallery,
            select: 'label images -_id',
        },
    }) // Automatic reference all field ids
})

// Search by $name
ProductSchema.query.byName = function (name) {
    return this.where({ name: new RegExp(name, 'i') })
}

// $order by $sort
ProductSchema.query.orderBy = function (orderBy, sort) {
    if (sort.toLowerCase() === 'asc')
        return this.collation({ locale: 'en' }).sort(`${orderBy}`)
    if (sort.toLowerCase() === 'desc')
        return this.collation({ locale: 'en' }).sort(`-${orderBy}`)
}

// Pagination
ProductSchema.query.pagination = function (limit, page) {
    return this.skip((page - 1) * limit).limit(limit)
}

module.exports = mongoose.model('Product', ProductSchema)
