var model = require('../server/models/index.models');
var strftime = require('strftime');

// model instancies
var User = model.User,
  Role = model.Role,
  Document = model.Document;

/**
 * [method to create  User if it does not exist]
 * @param  {[STRING]}   userName     [a unique username to be supplied]
 * @param  {[STRING]}   email        [a unique email to be supplied]
 * @param  {[STRING]}   firstName    [user's firstName must be provided]
 * @param  {[STRING]}   lastName     [user's lastName must be provided]
 * @param  {[STRING]}   role         [a role must be provided for succesful registration]
 * @param  {]STRING]}   password     [the user provides a password]
 * @param  {STRING} cb               [the callback reports to return based on the outcome]
 * @return {[JSON]}                  [a json object of the new user is returned on success]
 */
var createUser = function(userName, email, firstName, lastName, role, password, cb) {
  if (!role) {
    cb('Please provide a role to continue', null);
  } else {
    return Role.findOne({
      title: role
    }).then(function(roles) {
      if (roles) {
        return User.findOne({
          userName: userName,
          email: email
        }).then(function(users) {
          if (!users) {
            if (firstName && lastName) {
              var newUser = {
                email: email,
                userName: userName,
                name: {
                  firstName: firstName,
                  lastName: lastName
                },
                role: role,
                password: password
              };
              User.create(newUser, function(err, nuser) {
                if (err) {
                  cb(err, null);
                } else {
                  cb(null, nuser);
                }
              });
            } else {
              cb("Please, provide firstName and lastName", null);
            }
          } else {
            cb("user already exist", null);
          }
        });
      } else {
        cb("role does not exist", null);
      }
    });
  }
};

/**
 * [method to get a single user]
 * @method getAUser
 * @param  {[STRING]} name [the username of the user must be provided]
 * @return {[JSON]}      [a json object of new user is returned on success]
 */
var getAUser = function(userName, cb) {
  return User.findOne({
      userName: userName
    })
    .then(function(user) {
      if (user) {
        cb(null, user);
      } else {
        cb("user does not exist", null);
      }
    });
};

/**
 * [A method that gets all the users from the users table]
 * @method getAllUsers
 * @param  {Function} cb [a callback that returns the result of the method]
 * @return {[JSON]}      [a json object  of all the users is returned on success]
 */
var getAllUsers = function(cb) {
  return User.find({})
    .exec(function(err, users) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, users);
      }
    });
};

/**
 *  [ method to create A role if it does not exist]
 * @method createRole
 * @param  {[STRING]} role [a role to be created must be supplied]
 * @param  {Function} cb       [a callback for the method's return value]
 * @return {[JSON]}         [returns a json object of the new role created on success]
 */
var createRole = function(role, cb) {
  Role.findOne({
    title: role
  }).then(function(rol) {
    if (rol) {
      cb("role exist", null);
    } else {
      Role.create({
        title: role
      }, function(err, result) {
        if (err) {
          cb(err, null);
        } else {
          cb(null, result);
        }
      });
    }
  });
};

/**
 * [Method to get the record of a single role]
 * @method getARole
 * @param  {STRING}   title [the roles must be provided as a search criteria]
 * @param  {Function} cb    [a callback for a success or failure]
 * @return {[JSON]}         [returns a json object of the role record]
 */
var getARole = function(role, cb) {
  Role.findOne({
      title: role
    })
    .then(function(rol) {
      if (rol)
        cb(null, rol);
      else {
        cb('Role does not exist', null);
      }
    });
};

/**
 * [Method that returns all the roles in the roles table]
 * @method getAllRoles
 * @param  {Function} cb [a callback for success or failure of the search]
 * @return {[JSON]} [returns the json object of all the record in the table]
 */
var getAllRoles = function(cb) {
  return Role.find()
    .exec(function(err, roles) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, roles);
      }
    });
};

/**
 * [method to create documents into the documents table]
 * @method createDocument
 * @param  {[STRING]}   title       [description]
 * @param  {[STRING]}   accessRight [description]
 * @param  {Function} cb          [description]
 * @return {[JSON]}               [description]
 */
var createDocument = function(bookTitle, role, cb) {
  Role.findOne({
    title: role
  }).then(function(rol) {
    if (rol) {
      Document.findOne({
        docTitle: bookTitle
      }).then(function(doc) {
        if (!doc) {
          var newDoc = {
            docTitle: bookTitle,
            accessTo: role,
            datePublished: new Date()
          };
          Document.create(newDoc, function(err, ndoc) {
            cb(null, ndoc);
          });
        } else {
          cb("document already exist", null);
        }
      });
    } else {
      cb("Role does not exist", null);
    }
  });
};

/**
 * method to get all documents
 * @method getAllDocuments
 * @param  {[integer]} limit [limits the number of rows to output]
 * @return {[JSON]}       [returns a json object of all the documents in the table]
 */
var getAllDocuments = function(limit, cb) {
  Document.find()
    .sort({
      datePublished: -1
    })
    .limit(limit)
    .exec(function(err, docs) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, docs);
      }
    });
};

/**
 *  [method to get documents by roles]
 * @method getDocByRole
 * @param  {[integer]} limit [An optional parameter to limit the search result]
 * @param  {[STRING]} role  [role must be provided to use this function]
 * @return {[JSON]}       [returns the rows that matches the query role]
 */
var getDocByRole = function(role, limit, cb) {
  return Document.find({
      accessTo: role
    })
    .sort({
      datePublished: -1
    })
    .limit(limit)
    .exec(function(err, docs) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, docs);
      }
    });
};

/**
 * [method to get document by Date created
 * @method getDocByDate
 * @param  {[integer]} limit [an optional parameter could be provided to limit the result]
 * @param  {[STRING]} date  [data must be supplied as a string value]
 * @return {[JSON]}       [returns the rows that matches the query date]
 */
var getDocByDate = function(date, limit, cb) {
  return Document.find({
      datePublished: date
    })
    .limit(limit)
    .exec(function(err, docs) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, docs);
      }
    });
};

// Export methods to expose them to other files
module.exports = {
  createUser: createUser,
  getAUser: getAUser,
  getAllUsers: getAllUsers,
  createRole: createRole,
  getARole: getARole,
  getAllRoles: getAllRoles,
  createDocument: createDocument,
  getAllDocuments: getAllDocuments,
  getDocByDate: getDocByDate,
  getDocByRole: getDocByRole
};
