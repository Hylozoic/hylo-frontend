describe('bundle', function() {

  it('loads angular', function() {
    expect(typeof(angular)).to.equal('object');
  });

  it('loads filepicker', function() {
    expect(typeof(filepicker)).to.equal('object');
  });

});