const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  }
})


const User = mongoose.model('User', userSchema);

module.exports = User;
