var connection = require('./connection');
var thinky = connection.thinky;
var type = connection.type;
var crypto = require('crypto');
var Account = thinky.createModel('Account', {
  username: type.string(),
  email: type.string(),
  password: type.string()
});

function isExist(username, email, callback) {
  var checkByUsername = function() {
    return Account.filter({username: username}).run();
  };
  var checkByEmail = function() {
    return Account.filter({email: email}).run();
  };

  checkByUsername().then(function(users) {
    if(users.length > 0) {
      callback({ success: false, message: 'Username already exists'});
      return;
    }
    checkByEmail().then(function(emails) {
      if(emails.length > 0) {
        callback({ success: false, message: 'Email already exists'});
        return;
      }
      callback({ success: true, message: 'Success'});
    });
  });
}

function encrypt(password, secret) {
  return crypto.createHmac('sha256', secret).update(password).digest('hex');
}

function find(username, password, callback) {
  Account.filter({username: username, password: password}).run().then(function(users) {
    if(users.length === 1) {
      callback({success: true, data: users[0]});
    }else{
      callback({success: false, message: 'Wrong username or password'});
    }
  });
}

function isValid(password) {
  return password.length >= 6;
}

Account.isValid = isValid;
Account.find = find;
Account.encrypt = encrypt;
Account.isExist = isExist;
module.exports = Account;
