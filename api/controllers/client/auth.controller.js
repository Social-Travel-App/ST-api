const UserModel = require('../../schemas/User')
const { register } = require('../../validations/auth')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const config = require('../../utils/auth.config')
const sendConfirmationEmail = require('../../utils/nodemailer.config')
class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password, confirmPassword, accepted_policy } = req.body

      const { error } = await register.validate({
        email,
        password,
        confirmPassword,
      })
      if (error) throw new createError.BadRequest(error.details[0].message)
      const confirmation_code =
        await AuthController.generateRandomConfirmationCode()
      let user_model = new UserModel({
        email: email.toLowerCase().trim(),
        confirmation_code,
        accepted_policy,
      })

      user_model.setPassword(req.body.password)
      return user_model
        .save()
        .then((user) => {
          res.status(200).send('Register Success ! Please check your email')
          sendConfirmationEmail(user.email, user.confirmation_code)
        })
        .catch(() => {
          throw new createError.Conflict('Email Exits')
        })
    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      const { error } = await login.validateAsync(req.body)
      if (error) throw new createError.BadRequest(error.details[0].message)
      const existing_user = await UserModel.findOne({
        email: req.body.email.trim().toLowerCase(),
      })

      if (!existing_user) throw new createError.NotFound('User Not Found')
      if (!existing_user.validatePassword(req.body.password))
        throw new createError.Forbidden('Password Is Incorrect')
      if (existing_user.status !== 'active')
        throw new createError.Unauthorized(
          'Pending Account. Please Verify Your Email!'
        )

      let token = await AuthController.generateToken({
        id: existing_user._id,
        email: existing_user.email,
        status: existing_user.status,
        role: existing_user.role,
      })
      const data = existing_user.jsonData()
      data.token = token
      return res.status(200).send({ status: 'success', token })
    } catch (error) {
      next(error)
    }
  }

  static async verifyConfirmationCode(req, res, next) {
    try {
      await UserModel.findOne({
        confirmation_code: res.body.confirmation_code,
      }).then((user) => {
        if (!user) {
          throw new createError[404]('User Not Found.')
        }
        user.status = 'active'
        user.save((err) => {
          if (err) {
            throw new Error()
          }
          return res.status(200).send('Verify Success')
        })
      })
    } catch (error) {
      next(error)
    }
  }
  // static async generateToken(payload) {
  //   const options = { expiresIn: '1h' }
  //   let access_token = jwt.sign(payload, process.env.JWT_USER_SECRET, options)

  //   let refresh_token = jwt.sign(payload, process.env.JWT_USER_SECRET, {
  //     expiresIn: '7d',
  //   })
  //   await UserModel.findByIdAndUpdate(
  //     {
  //       _id: payload.id,
  //     },
  //     {
  //       refresh_token,
  //       access_token,
  //     },
  //     {
  //       new: true,
  //     }
  //   )
  //   return {
  //     access_token,
  //     refresh_token,
  //   }
  // }

  static async generateRandomConfirmationCode() {
    const numbers = '0123456789'
    const codeLength = 6
    let code = ''
    for (let i = 0; i < codeLength; i++) {
      code += numbers[Math.round(Math.random() * numbers.length)]
    }
    return code
  }
}

module.exports = AuthController
