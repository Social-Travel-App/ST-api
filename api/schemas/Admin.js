const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { emailRegex, passwordRegex } = require('../validations/constants')

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
    },
    email: {
      type: String,
      match: emailRegex,
      require: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: 'admin',
    },
    status: {
      type: String,
      default: 'active', // active - banned - deleted,
    },

    salt: {
      type: String,
    },
    hash: {
      type: String,
    },
    refresh_token: {
      type: String,
    },
  },
  {
    timestamps: {
      createAt: 'created_at',
      updatedAt: 'updated_at',
      currentTime: () => new Date().toLocaleString(),
    },
  }
)

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
}

userSchema.methods.validatePassword = function (password) {
  const hash = password
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
  return this.hash === hash
}

userSchema.methods.generateRefreshToken = function () {
  const payload = {
    email: this.email,
    role: this.role,
    status: this.status,
    id: this._id,
  }
  const options = {
    expiresIn: '4h',
  }
  let access_token = jwt.sign(payload, process.env.JWT_ADMIN_SECRET, options)

  let refresh_token = jwt.sign(payload, process.env.JWT_ADMIN_SECRET, {
    expiresIn: '7d',
  })

  return {
    refresh_token,
    access_token,
  }
}

userSchema.methods.jsonData = function () {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    address: this.address,
    avatar: this.avatar,
  }
}
userSchema.pre(/'updateOne | findOneAndUpdate'/, function (next) {
  this.set({
    updatedAt: new Date().toLocaleString(),
  })

  next()
})
const userModel = mongoose.model('user', userSchema, 'user')
module.exports = userModel
