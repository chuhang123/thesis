'use strict';

describe('Service: personal', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var personal;
  beforeEach(inject(function (_personal_) {
    personal = _personal_;
  }));

  it('should do something', function () {
    expect(!!personal).toBe(true);
  });

});
