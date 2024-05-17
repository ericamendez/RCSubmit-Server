const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  password: {
      type: String,
      required: true
  },
  accountType: {
    type: String,
    required: true
  },
  name: String,
  email: String,
  pronouns: String,
  picture: String,
  cohort: String,
})

module.exports = mongoose.model('User', schema)