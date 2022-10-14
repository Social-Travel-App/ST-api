const express = require('express')
const AuthController = require('../controllers/auth.controller')

const Auth = express.Router()

Auth.post('/register', AuthController.register)
Auth.get('/test', (req, res) => {
  return res.send('welcome')
})

module.exports = Auth
