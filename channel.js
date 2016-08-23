var connection = require('./connection');
var thinky = connection.thinky;
var type = connection.type;
var Message = require('./message');
var Channel = thinky.createModel('Channel', {
  id: type.string(),
  name: type.string(),
  chat: type.array()
});
Channel.hasMany(Message, 'chats', 'id', 'channelId');
Message.belongsTo(Channel, 'channel', 'channelId', 'id');
module.exports = Channel;
