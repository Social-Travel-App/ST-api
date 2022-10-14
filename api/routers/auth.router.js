const express = require("express");
const AuthController = require("../controllers/auth.controller");

const Auth = express.Router();

Auth.post("/register",AuthController.register);

module.exports = Auth;
  