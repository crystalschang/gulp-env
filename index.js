'use strict';

module.exports = function(options) {
  if (options.file) {
    var env = require(process.cwd() + "/" + options.file);

    for (var prop in env) {
      process.env[prop] = env[prop]
    }
  }
}
