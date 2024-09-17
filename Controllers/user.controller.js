const createError = require('http-errors')

const User = require('../Models/user.model')
const Review = require('../Models/review.model')

const { userValidate, loginValidate } = require('../helpers/validation')
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require('../helpers/jwt_services')

const userController = {
    registerUser: async (req, res, next) => {
        try {
            const { error } = userValidate(req.body)
            if (error) {
                throw createError(error.details[0].message)
            }

            const isExist = await User.findOne({ email: req.body.email })
            if (isExist) {
                throw createError.Conflict(`${req.body.email} đã được đăng ký`)
            } else {
                const newUser = new User(req.body)
                await newUser.save()

                const { password, ...others } = newUser._doc

                res.status(201).json({
                    status: 201,
                    message: 'Đăng ký người dùng thành công',
                    data: others,
                })
            }
        } catch (error) {
            next(error)
        }
    },
    loginUser: async (req, res, next) => {
        try {
            const { error } = loginValidate(req.body)
            if (error) {
                throw createError(error.details[0].message)
            }

            const { email, username } = req.body

            const user = await User.findOne({ email: email })
            if (!user) {
                throw createError.NotFound(`Người dùng chưa được đăng ký`)
            }

            const isValid = await user.isCheckedPasswrod(req.body.password)
            if (!isValid) {
                throw createError.Unauthorized("Mật khẩu không chính xác")
            }
            const accessToken = await signAccessToken(user)
            const refreshToken = await signRefreshToken(user)
            //Don't res password in object user
            const { password, ...others } = user._doc

            res.status(200).json({
                status: 200,
                data: others,
                token: accessToken,
            })
        } catch (error) {
            next(error)
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) throw createError.BadRequest()

            const { userId, userRole } = await verifyRefreshToken(refreshToken)
            const newAccessToken = await signAccessToken({
                id: userId,
                role: userRole,
            })
            const newRefreshToken = await signRefreshToken({
                id: userId,
                role: userRole,
            })
            res.json({ newAccessToken, newRefreshToken })
        } catch (error) {
            next(error)
        }
    },
    getAllUser: async (req, res, next) => {
        try {
            const { username, email, name } = req.query

            const optionsHandler = () => {
                let result = {}

                if (name) {
                    result['fullName'] = { $regex: name }
                }
                if (username) {
                    result['username'] = username
                }
                if (email) {
                    result['email'] = email
                }

                return result
            }

            const options = optionsHandler()

            const user = await User.find(options)
            res.status(200).json({ status: 200, elements: user })
        } catch (error) {
            next(error)
        }
    },
    getOneUser: async (req, res, next) => {
        try {
            const { id } = req.params

            const user = await User.findById(id)
            res.status(200).json({ status: 200, data: user })
        } catch (error) {
            next(error)
        }
    },
    deleteUser: async (req, res, next) => {
        try {
            const userId = req.params.id
            const user = await User.findByIdAndDelete(req.params.id)
            await Review.deleteMany({ user_id: userId })

            res.status(200).json({
                status: 200,
                message: 'Delete successfully',
                elements: user,
            })
        } catch (error) {
            next(error)
        }
    },
    updateUser: async (req, res, next) => {
        try {
            const user = await User.updateOne({ _id: req.params.id }, req.body)

            if (!user) {
                throw createError.NotFound(`User not exist`)
            }
            res.json({ status: 200, message: 'User updated' })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = userController
