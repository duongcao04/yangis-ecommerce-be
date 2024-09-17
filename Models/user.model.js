const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const { required } = require('joi')

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default:
                'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png',
        },
        bonusPoints: {
            type: Number,
            default: 0,
        },
        orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
        role: {
            type: String,
            emum: ['admin', 'member'],
            default: 'member',
        },
    },
    { timestamps: true }
)

UserSchema.pre('save', async function (next) {
    try {
        console.log(`Called before save::: ${this.email} ${this.password} `)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.isCheckedPasswrod = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)
