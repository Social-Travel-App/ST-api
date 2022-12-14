const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../utils/auth.config')
const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    avatar: {
      type: String,
    },
    role: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
      },
    ],
    accepted_policy: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'active'],
      default: 'pending', // active - banned - deleted,
    },
    company_name: {
      type: String,
    },
    business_number: {
      type: String,
      unique: true,
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
    confirmation_code: {
      type: String,
      unique: true,
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
