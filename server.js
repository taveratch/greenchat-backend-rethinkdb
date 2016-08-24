var _ = require('lodash');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');

var Message = require('./message');
var Channel = require('./channel');
var Account = require('./account');
var secret = require('./config').secret;

var bodyParse = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var io = require('socket.io')(server);
var r = require('rethinkdb');
var colors = require('colors');

app.use(bodyParse.json());
app.use(morgan('dev'));
app.set('secret', secret);

function startListenDatabase(channel, socket) {
  Channel.filter({name: channel}).changes().then(function(feed) {
    feed.each(function(err, doc) {
      if (err) throw err;
      console.log(doc.chat + ' has been changed');
      socket.emit('updateChat', doc.chat);
    });
  });
}

io.on('connection', function(socket) {
  socket.on('channel', function(data) {
    console.log(colors.green("Subscribing on channel " + data));
    startListenDatabase(data, socket);
  });
});

app.get('/', function(req, res) {
  res.send('Welcome to GreenChat APIs');
});

app.get('/channels', function(req, res) {
  Channel.filter({}).run().then(function(data) {
    console.log(colors.white('Request channel list'));
    res.send(_.map(data, 'name'));
  });
});

app.post('/user/create', function(req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  var createAccount = function() {
    return new Account({
      username: username,
      email: email,
      password: Account.encrypt(password, secret)
    });
  };
  var saveAccount = function(account) {
    account.saveAll().then(function(result) {
      res.json(result);
    });
  };

  var checkCallback = function(response) {
    if(response.success) { //username and email are available
      var account = createAccount();
      saveAccount(account);
      account.password = null;
      res.json({success: true, token: jwt.sign(account, secret, {expiresIn: '24h'})}); //Return token to client (expire in 24 hours)
    }else { //either username or email is exist
      res.json(response);
    }
  };
  Account.isExist(username,email, checkCallback); //check for existing account
});

app.post('/user/signin', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var encryptedPassword = Account.encrypt(password, secret);
  var callback = function(response) {
    if(response.success) {
      var user = response.data;
      user.password = null;
      res.json({success: true, token: jwt.sign(user, secret, {expiresIn: '24h'})});
    }else {
      res.json(response);
    }
  };
  Account.find(username,encryptedPassword, callback);
});
server.listen(9090);
console.log('Server is running on port : 9090');
