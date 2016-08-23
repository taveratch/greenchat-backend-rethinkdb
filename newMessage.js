var Message = require('./message');
var Channel = require('./channel');
var thinky = require('./connection');
var message = new Message({
  message: process.argv[2] || 'default',
  time: new Date()
});


Channel.filter({name: 'ChannelA'}).run().then(function(channel) {
  channel[0].chat = JSON.parse(JSON.stringify(channel[0].chat)).concat([message]);
  channel[0].saveAll().then(function(result) {
    message.channel = channel[0];
    message.saveAll().then(function(result) {
      console.log("Message has been created");
    });
  });
});
