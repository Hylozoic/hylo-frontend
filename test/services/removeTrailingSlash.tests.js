var removeTrailingSlash;

require('../../src/js/app/services/removeTrailingSlash')({
  config: function(callback) {
    callback({
      rule: function(method) {
        removeTrailingSlash = method;
      }
    })
  }
});

// mock the $location service
var location = function(path) {
  return {
    url: function() { return path; }
  };
};

describe('removeTrailingSlash', function() {

  it('removes the slash from a simple path', function() {
    var output = removeTrailingSlash(null, location('/foo/bar/'))
    expect(output).to.equal('/foo/bar');
  });

  it('removes the slash from a path with query parameters', function() {
    var output = removeTrailingSlash(null, location('/foo/bar/?baz=bonk'));
    expect(output).to.equal('/foo/bar?baz=bonk');
  });

  it('returns null if no change is necessary', function() {
    var output = removeTrailingSlash(null, location('/foo/bar'));
    expect(output).to.be.undefined;
  });

});