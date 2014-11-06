(function() {
  describe('Simple filedrop', function() {
    return it('should inherit from SimpleModule', function() {
      var filedrop;
      filedrop = simple.filedrop();
      return expect(filedrop instanceof SimpleModule).toBe(true);
    });
  });

}).call(this);
