const express = require("express");

const Auth = express.Router();

Auth.post("/auth/register");

module.exports = Auth;
