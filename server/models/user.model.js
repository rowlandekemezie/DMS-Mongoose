var mongoose = require('mongoose');
var Role = require('./role.model');

var userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    validate: /[a-zA-Z0-9]/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  name: {
    firstName: {
      type: String,
      required: true,
      validate: /[a-zA-Z]/,
    },
    lastName: {
      type: String,
      required: true,
      validate: /[a-zA-Z]/,
    }
  },
  role: {
    type: String,
    refs: 'Role',
    required: true,
    validate: /[a-zA-Z]/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  versionKey: false
});
// The mongoose API requires the model name and schema to create the model
module.exports = mongoose.model("User", userSchema);
