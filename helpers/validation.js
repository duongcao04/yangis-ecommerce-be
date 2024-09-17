const joi = require('joi')

const userValidate = (data) => {
    const userSchema = joi.object({
        username: joi.string().alphanum().min(3).max(30),
        email: joi
            .string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        phone: joi.string().min(10).max(10),
        password: joi
            .string()
            .min(8)
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
        fullName: joi.string().min(3).max(30),
        avatar: joi.string(),
        role: joi.string().valid('admin', 'member'),
    })
    return userSchema.validate(data)
}

const loginValidate = (data) => {
    const registerSchema = joi.object({
        email: joi
            .string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi
            .string()
            .min(6)
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
    })
    return registerSchema.validate(data)
}

module.exports = {
    userValidate,
    loginValidate,
}
