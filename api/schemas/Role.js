const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
  },
})

const roleModel = mongoose.model('role', roleSchema, 'role')
module.exports = roleModel
