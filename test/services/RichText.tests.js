var RichText = require('../../src/js/app/services/RichText');

describe('RichText', function() {

  it("linkifies a link with a '#' correctly", function() {
    var input = '<p>http://www.foo.com/bar/#baz</p>',
      expected = '<p><a href="http://www.foo.com/bar/#baz" target="_blank">http://www.foo.com/bar/#baz</a></p>'
      output = RichText.present(input);

    expect(output).to.equal(expected);
  });

  it('links hashtags', function() {
    var input = '<p>and #foo</p>',
      expected = '<p>and <a href="/h/search?q=%23foo">#foo</a></p>'
      output = RichText.present(input);

    expect(output).to.equal(expected);
  });

});