var thinky = require('thinky')({db: 'simpleChat'});
var type = thinky.type;

module.exports = {
  thinky: thinky,
  type: thinky.type
};
