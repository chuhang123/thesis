'use strict';

describe('Service: indentserivce', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var indentserivce;
  beforeEach(inject(function (_indentserivce_) {
    indentserivce = _indentserivce_;
  }));

  it('should do something', function () {
    expect(!!indentserivce).toBe(true);
  });

});
