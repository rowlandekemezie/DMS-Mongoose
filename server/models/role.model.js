var mongoose = require('mongoose');

var roleSchema = new mongoose.Schema({
 title: {
  type: String,
  required: true,
  validate: /[a-zA-Z]/
 },
 versionKey: false
});
//console.log(roleSchema);
// The mongoose API requires the model name and schema to create the model
module.exports = mongoose.model("Role", roleSchema);
