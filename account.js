var connection = require('./connection');
var thinky = connection.thinky;
var type = connection.type;
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

Account.isExist = isExist;
module.exports = Account;
