require('shelljs/global');
var format = require('util').format;

var _command = function(cmd) {
  return exec(cmd, {silent: true}).output.replace(/\n/, '');
};

module.exports = function(maxlength) {
  if (!maxlength) maxlength = 40;
  return _command(format("git show|head -n1|awk '{print $2}'|cut -c -%s", maxlength));
};
