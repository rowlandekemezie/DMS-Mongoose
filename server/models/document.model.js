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
  createdAt: {
    type: String
  }
});

//set createdAt to current date before saving a document
documentSchema.pre('save', function(next) {
  var doc = this;
  var datetime = new Date();

  // format the output
  var month = datetime.getMonth() + 1;
  var day = datetime.getDate();
  var year = datetime.getFullYear();

  var hour = datetime.getHours();
  if (hour < 10)
    hour = "0" + hour;

  var min = datetime.getMinutes();
  if (min < 10)
    min = "0" + min;

  var sec = datetime.getSeconds();
  if (sec < 10)
    sec = "0" + sec;

  // put it all togeter
  var dateTimeString = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
  doc.createdAt = dateTimeString;
  next();
});

// The mongoose API requires the model name and schema to create the model
module.exports = mongoose.model("Document", documentSchema);
