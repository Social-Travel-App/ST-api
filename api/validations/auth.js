const Joi = require('joi')
const { emailRegex, passwordRegex } = require('./constants')

const register = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': `Valid email required`,
    'string.empty': `Email should not be empty!`,
    'any.required': `Email is required`,
  }),
  password: Joi.string()
    .min(8)
    .max(32)
    .pattern(new RegExp(passwordRegex))
    .required()
    .messages({
      'string.min': `Password must be at least 8 characters`,
      'string.max': `Password must be at max 32 characters`,
      'string.empty': `Password should not be empty!`,
      'any.required': `Password is required!`,
      'string.pattern.base': `Password must be have at least one letter and one number `,
    }),

  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.empty': `Confirm password should not be empty!`,
    'any.only': `Password and confirm password do not match`,
  }),
})

const login = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': `Valid email required`,
    'string.empty': `Email should not be empty!`,
    'any.required': `Email is required`,
  }),
  password: Joi.string()
    .min(8)
    .max(32)
    .pattern(new RegExp(passwordRegex))
    .required()
    .messages({
      'string.min': `Password must be at least 8 characters`,
      'string.max': `Password must be at max 32 characters`,
      'string.empty': `Password should not be empty!`,
      'any.required': `Password is required!`,
      'string.pattern.base': `Password must be have at least one letter and one number `,
    }),
})

module.exports = {
  register,
  login,
}
