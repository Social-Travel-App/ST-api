const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { emailRegex } = require("../validations/constants");
const Helpers = require("../../plugins/Helpers");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: false,
    },
    lastName: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      match: emailRegex,
      require: true,
    },
    phone: {
      type: String,
      require: false,
    },
    password: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: false,
      default: "",
    },
    avatar: {
      type: String,
      required: false,
      default: "",
    },
    backgroundImage: {
      type: String,
      required: false,
      default: "",
    },
    headline: {
      type: String,
      required: false,
      default: "",
    },

  },
  {
    timestamps: {
      createAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

userSchema.index({ email: 1, phone: 1 }, { unique: true });

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512");
};

userSchema.methods.validatePassword = function (password) {
  const hash = password
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

userSchema.methods.generateToken = function (member = false) {
  let expiresIn = "1d";
  if (member) expiresIn = "365d";
  const payload = {
    email: this.email,
    phone: this.phone,
    id: this._id,
  };

  const secret = process.env.SECRET;
  const options = {
    expiresIn,
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};

userSchema.methods.jsonData = function () {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    address: this.address,
    avatar: this.avatar,
    backgroundImage: this.backgroundImage,
    headline: this.headline,
    position: this.position,
    education: this.education,
    location: this.location,
  };
};
userSchema.pre(/'updateOne | findOneAndUpdate'/, function (next) {
  this.set({
    updatedAt: Helpers.getTimeWithoutMilliSeconds(),
  });

  next();
});
const userModel = mongoose.model("user", userSchema, "user");
module.exports = userModel;
