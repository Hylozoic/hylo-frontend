var factory = function() {

  var Cache = function() {
    this.store = {};
  };

  _.extend(Cache.prototype, {

    set: function(key, value, options) {
      var options = _.merge({}, options, {
        createdAt: new Date().getTime()
      });

      // expire if maxAge (in seconds) has passed
      if (options.maxAge) {
        options.expireAt = options.createdAt + options.maxAge * 1000;
      }

      this.store[key] = {value: value, options: options};
    },

    get: function(key) {
      if (!_.has(this.store, key))
        return;

      var entry = this.store[key],
        expireAt = entry.options.expireAt;

      if (expireAt && expireAt < new Date().getTime())
        return;

      return entry.value;
    },

    drop: function(key) {
      delete this.store[key];
    }

  });

  return new Cache();
};

module.exports = function(angularModule) {
  angularModule.factory('Cache', factory);
}