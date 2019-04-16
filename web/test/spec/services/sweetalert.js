'use strict';

describe('Service: SweetAlert', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var SweetAlert;
  beforeEach(inject(function (_SweetAlert_) {
    SweetAlert = _SweetAlert_;
  }));

  it('should do something', function () {
    expect(!!SweetAlert).toBe(true);
  });

});
