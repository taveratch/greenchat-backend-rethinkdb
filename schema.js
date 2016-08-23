var thinky = require('thinky')({db: 'simpleChat'});
var type = thinky.type;

var Channel = thinky.createModel('Channel', {
  id: type.string(),
  name: type.string(),
  chats: type.array()
});

var Chat = thinky.createModel('Chat', {
  id: type.string(),
  authorId: type.string(),
  message: type.string(),
  time: type.date()
});

var Author = thinky.createModel('Author', {
  id: type.string(),
  name: type.string()
});

Chat.belongsTo(Author, 'author', 'authorId', 'id');
