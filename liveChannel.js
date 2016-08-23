var Channel = require('./channel');

Channel.changes().then(function(feed) {
  feed.each(function(err, doc) {
    if (err) throw err;
    console.log(doc);
  });
});
