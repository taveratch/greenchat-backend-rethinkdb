var connection = require('./connection');
var thinky = connection.thinky;
var type = connection.type;
var Message = thinky.createModel('Message', {
  id: type.string(),
  message: type.string(),
  time: type.date(),
  channelId: type.string()
});

module.exports = Message;
