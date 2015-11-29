var mongoose = require('mongoose');
var userModel = require('./user.model');
var documentModel = require('./document.model');
var roleModel = require('./role.model');

var uri = "mongodb://localhost/andela";
mongoose.connect(uri, function(err){
  if(err) console.log("error connecting to the database", err);
  console.log("Succesfully connected to mongodb://localhost/andela");
});

// export model definitions
module.exports = {
  User: userModel,
  Role: roleModel,
  Document: documentModel
};
