const Joi = require("joi");
const { emailRegex } = require("./constants");

 const register = Joi.object({
  email: Joi.string().regex(emailRegex).required(),
  password: Joi.string().min(8).max(16).required(),
  confirmPassword: Joi.ref("password"),
});

 const login = Joi.object({
  email: Joi.string().regex(emailRegex).required(),
  password: Joi.string().min(8).max(16).required(),
});

module.exports={
  register,
  login
}