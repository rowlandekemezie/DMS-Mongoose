var dms = require('./../src/documentManager');
var seeds = require('./seeds');
var model = require('./../server/models/index.models');

// model instancies
var User = model.User,
 Role = model.Role,
 Document = model.Document;

describe("Document Management System", function() {
 beforeEach(function(done) {
  User.remove({}, function() {
   Role.remove({}, function() {
    Document.remove({}, function() {
     done();
    });
   });
  });
 });

 describe('User', function() {
  var _roles = {};
  var _users = {};

  beforeEach(function(done) {
   seeds.roles(function(err, roles) {
    if (err) {
     console.log(err);
    } else {
     _roles = roles;
    }
    seeds.users(function(err, users) {
     if (err) {
      console.log(err);
     } else {
      _users = users;
     }
     done();
    });
   });
  });

  afterEach(function(done) {
   User.remove({}, function() {
    Role.remove({}, function() {
     done();
    });
   });
  });

  it('should return created users', function(done) {
   expect(_users.user1.name).toEqual(jasmine.objectContaining({
    firstName: 'igwe',
    lastName: 'ekwe'
   }));
   expect(_users.user1.userName).toEqual('row');
   expect(_users.user1.role).toEqual('admin');
   expect(_users.user1.password).toEqual('awesomeGod');

   expect(_users.user2.name).toEqual(jasmine.objectContaining({
    firstName: 'jumai',
    lastName: 'auntie'
   }));
   expect(_users.user2.userName).toEqual('rukkky');
   expect(_users.user2.role).toEqual('admin');
   expect(_users.user2.password).toEqual('greatness');
   done();
  });

  it('should validates that a new user created is unique.', function(done) {
   dms.createUser("row", "row@gmail.com", "igwe", "ekwe", "admin", "awesomeGod", function(err, user) {
    expect(err).toBeDefined();
    expect(err).toEqual('user already exist');
    expect(err).not.toBeNull();
    done();
   });
  });

  it('should validates that a new user created has a role defined', function(done) {
   dms.createUser("row", "row@gmail.com", "igwe", "ekwe", "superadmin", "awesomeGod", function(err, user) {
    expect(err).toBeDefined();
    expect(err).toEqual('role does not exist');
    done();
   });
  });

  it('should validate that a role is provided before creating a new user', function(done) {
   dms.createUser("row", "row@gmail.com", "igwe", "ekwe", undefined, "awesomeGod", function(err, user) {
    expect(err).not.toBeNull();
    expect(err).toEqual('Please provide a role to continue');
    done();
   });
  });

  it('should validates that a new user created has both first and last names.', function(done) {
   dms.createUser("ade", 'ade@gmail.com', undefined, 'trainer', 'admin', 'wonderful', function(err, user) {
    expect(err).toBeDefined();
    expect(err).toEqual('Please, provide firstName and lastName');
    done();
   });
  });

  it("should validates that all users are returned when getAllUsers is called", function(done) {
   dms.getAllUsers(function(err, users) {
    expect(users.length).toBe(2);
    expect(users).not.toBeUndefined();
    done();
   });
  });
 });

 describe("Roles", function() {
  var _roles = {};
  beforeEach(function(done) {
   seeds.roles(function(err, roles) {
    if (err) {
     console.log(err);
    } else {
     _roles = roles;
     done();
    }
   });
  });
  afterEach(function(done) {
   Role.remove({}, function() {
    done();
   });
  });

  it("should validates that a new role created has a unique title", function(done) {
   dms.createRole("admin", function(err, role) {
    expect(err).toEqual('role exist');
    expect(role).toBeNull();
    expect(err).not.toBeNull();
    expect(_roles.role1.title).toEqual('admin');
    done();
   });
   dms.createRole("manager", function(err, role) {
    expect(err).not.toBeNull();
    expect(err).toEqual('role exist');
    expect(role).toBeNull();
    expect(_roles.role2.title).toEqual('manager');
    done();
   });
  });

  it("should validates that all roles are returned when getAllRoles is called", function(done) {
   dms.getAllRoles(function(err, roles) {
    expect(err).not.toBeUndefined();
    expect(roles.length).toBe(2);
    expect(roles.length).not.toBe(4);
    expect(roles).not.toBeNull();
    done();
   });
  });
 });

 describe("Document", function() {

  var _roles = {};
  var _docs = {};
  beforeEach(function(done) {
   seeds.roles(function(err, roles) {
    if (err) {
     console.log(err);
    } else {
     _roles = roles;
    }
    seeds.docs(function(err, docs) {
     if (err) {
      console.log(err);
     } else {
      _docs = docs;
     }
     done();
    });
   });
  });

  afterEach(function(done) {
   Role.remove({}, function() {
    Document.remove({}, function() {
     done();
    });
   });
  });

  it('should validates that all documents are returned, limited by a specified number, when getAllDocuments is called', function(done) {
   dms.getAllDocuments(1, function(err, docs) {
    expect(docs.length).toBe(1);
    expect(docs).not.toBeNull();
    dms.getAllDocuments(2, function(err, docs) {
     expect(docs.length).toBe(2);
     expect(docs).not.toBeNull();
     done();
    });
   });
  });

  it("should validates that a new user document created has a published date defined", function(done) {
   expect(_docs.doc1.datePublished).toBeTruthy();
   expect(_docs.doc2.datePublished).toBeDefined();
   expect(_docs.doc1.datePublished).not.toBeNull();
   expect(_docs.doc2.datePublished).not.toBeNull();
   done();
  });
 });

 describe('Search', function() {

  var _roles = {};
  var _docs = {};
  // var currentDate = new Date();

  beforeEach(function(done) {
   seeds.roles(function(err, roles) {
    if (err) {
     console.log(err);
    } else {
     _roles = roles;
    }
    seeds.docs(function(err, docs) {
     if (err) {
      console.log(err);
     } else {
      _docs = docs;
     }
     done();
    });
   });
  });

  afterEach(function(done) {
   Role.remove({}, function() {
    Document.remove({}, function() {
     done();
    });
   });
  });

  it('should validate that all documents, limited by a specified number and ordered by published date, that can be accessed by a specified role', function(done) {
   dms.getDocByRole('manager', 2, function(err, docs) {
    expect(docs.length).toBe(2);
    expect(docs[0].docTitle).toBe('The glory of a nation');
    expect(docs[1].docTitle).toBe('The epic battle of world changers');
    expect(docs[0].datePublished).toBeGreaterThan(docs[1].datePublished);
    expect(docs[1].datePublished).toBeLessThan(docs[0].datePublished);
    expect(docs[0].accessTo).toEqual('manager');
    expect(docs[1].accessTo).toEqual('manager');
    done();
   });
  });
 });
});
