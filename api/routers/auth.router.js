const express = require('express')
const AuthController = require('../controllers/auth.controller')

const Auth = express.Router()

Auth.post('/register', AuthController.register)
Auth.get('/test', (req, res) => {
  return res.status(200).json({ text: 'welcome' })
})

module.exports = Auth
