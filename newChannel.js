var Channel = require('./channel');

var newChannel = new Channel({
  name: process.argv[2] || 'Default Channel',
  chat: []
});

newChannel.saveAll().then(function(result) {
  console.log(result);
  console.log('Channel created');
});
