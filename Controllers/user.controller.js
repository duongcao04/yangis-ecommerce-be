const createError = require('http-errors')

const User = require('../models/user.model')
const Review = require('../models/review.model')

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
                throw createError.Unauthorized('Mật khẩu không chính xác')
            }
            console.log(user)

            const accessToken = await signAccessToken(user)
            const refreshToken = await signRefreshToken(user)
            //Don't res password in object user
            const { password, ...others } = user._doc

            res.status(200).json({
                status: 200,
                message: 'Đăng nhập thành công',
                data: { user: others, token: accessToken },
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
    getAllUsers: async (req, res, next) => {
        try {
            const user = await User.find().lean()
            res.status(200).json({
                status: 200,
                message: 'Get all users successfully',
                data: user,
            })
        } catch (error) {
            next(error)
        }
    },
    getUsersWithPaginate: async (req, res, next) => {
        try {
            const { page = 1, limit = 10 } = req.query

            let totalUser

            const users = await User.find()
                .lean()
                .then((result) => {
                    totalUser = result.length

                    const currentPage = page

                    const startIndex = (currentPage - 1) * limit // Tính chỉ số bắt đầu
                    const endIndex = currentPage * limit // Tính chỉ số kết thúc
                    return result.slice(startIndex, endIndex) // Cắt mảng theo giới hạn
                })
            const totalPage = Math.ceil(totalUser / limit)

            res.status(200).json({
                status: 200,
                message: 'Get users with paginate successfully',
                data: { users, totalUser, totalPage },
            })
        } catch (error) {
            next(error)
        }
    },
    getUserById: async (req, res, next) => {
        try {
            const { userId } = req.params

            const user = await User.findById(userId)
            res.status(200).json({
                status: 200,
                message: 'Get user by user id successfully',
                data: user,
            })
        } catch (error) {
            next(error)
        }
    },
    updateUser: async (req, res, next) => {
        try {
            const { userId } = req.params
            const user = await User.updateOne({ _id: userId }, req.body)

            if (!user) {
                throw createError.NotFound(`User not found`)
            }
            res.json({ status: 200, message: 'User updated successfully' })
        } catch (error) {
            next(error)
        }
    },
    deleteUser: async (req, res, next) => {
        try {
            const { userId } = req.params
            const update = {
                isDisabled: true,
            }

            const user = await User.findByIdAndUpdate(userId, update)

            if (!user) {
                throw createError.NotFound('User not found')
            }

            await Review.deleteMany({ user_id: userId })

            res.status(200).json({
                status: 200,
                message: 'User deleted successfully',
            })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = userController
