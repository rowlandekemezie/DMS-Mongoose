var mongoose = require('mongoose');
var Role = require('./role.model');
var documentSchema = new mongoose.Schema({
  docTitle: {
    type: String,
    require: true,
    validate: /[a-zA-Z\^w]/
  },
  accessTo: {
    type: String,
    ref: 'Role',
    required: true,
    validate: /[a-zA-Z0-9]/
  },
  datePublished: {
    type: Date,
    default: Date.now
  },
  versionKey: false
});

// The mongoose API requires the model name and schema to create the model
module.exports = mongoose.model("Document", documentSchema);
