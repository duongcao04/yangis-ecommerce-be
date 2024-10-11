const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { nonAccentVietnamese } = require('../helpers/text_services')

const Category = require('./category.model')
const Brand = require('./brand.model')
const Variant = require('./variant.model')

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            default: '',
        },
        thumbnail: { type: String, default: '' },
        featureImage: [{ type: String, default: [] }],
        price: {
            type: Number,
            required: true,
        },
        sale: {
            type: String,
        },
        description: {
            type: String,
        },
        inStock: {
            type: Number,
            default: 0,
        },
        variants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Variant',
            },
        ],
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

ProductSchema.pre('save', function () {
    if (!this.slug) {
        this.slug = nonAccentVietnamese(this.name)
    }
})
// Automatic reference all field ids
// https://viblo.asia/p/tim-hieu-ve-populate-trong-mongoogse-GrLZDvpE5k0
ProductSchema.query.replaceIds = function () {
    return this.populate([
        { path: 'category', model: Category, select: 'name -_id' },
        { path: 'brand', model: Brand, select: 'name -_id' },
        {
            path: 'variants',
            model: Variant,
            select: 'label images inStock -_id',
        },
    ]) // Automatic reference all field ids
}

// Search by $name
ProductSchema.query.byName = function (name) {
    if (!name) return this
    return this.where({ name: new RegExp(name, 'i') })
}
ProductSchema.query.byCategory = function (category) {
    if (!category) return this
    return this.populate({
        path: 'category',
        match: { slug: category },
        select: 'name slug -_id',
    })
}
ProductSchema.query.byBrand = function (brand) {
    if (!brand) return this
    return this.populate({
        path: 'brand',
        match: { slug: brand },
        select: 'name slug -_id',
    })
}

// $order by $sort
ProductSchema.query.orderBy = function (orderBy, sort) {
    if (!orderBy) return this
    else {
        if (sort.toLowerCase() === 'desc')
            return this.collation({ locale: 'en' }).sort(`${orderBy}`)
        else return this.collation({ locale: 'en' }).sort(`-${orderBy}`)
    }
}

// Pagination
ProductSchema.query.pagination = function (limit, page) {
    if (!limit) return this
    else {
        const currentPage = page ?? 1
        return this.skip((currentPage - 1) * limit).limit(limit)
    }
}

module.exports = mongoose.model('Product', ProductSchema)
