
if (!process.env.HEROKU_API_TOKEN) {
  throw new Error("HEROKU_API_TOKEN is not set");
}

var instance;

var client = function() {
  if (!instance) {
    instance = new (require('heroku-client'))({token: process.env.HEROKU_API_TOKEN});
  }
  return instance;
};

module.exports = {
  config: function(app) {
    return client().apps(app).configVars();
  }
};
