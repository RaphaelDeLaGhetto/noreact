/**
 * Inspired by Greg Wang, 2013-11-5
 * http://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder
 *
 * This module does not check for duplicate action names. If duplicate names
 * exist, the former will be overwritten by the latter.
 */
module.exports = function(gebo) {

    require('fs').readdirSync(__dirname + '/').forEach(function(file) {
        if (file.match(/^.+\.js$/g) !== null && file !== 'index.js') {
          var actions = require('./' + file)(gebo);
          var keys = Object.keys(actions);
          for (var i = 0; i < keys.length; i++) {
            if (!exports[keys[i]]) {
              exports[keys[i]] = actions[keys[i]];
            }
          }
        }
      });

    return exports;
  };
