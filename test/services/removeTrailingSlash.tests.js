var removeTrailingSlash;

var mockModule = {
  config: function(args) {
    // args[0] is annotation, args[1] is function
    args[1]({
      rule: function(method) {
        removeTrailingSlash = method;
      }
    })
  }
};

require('../../src/js/app/services/removeTrailingSlash')(mockModule);

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