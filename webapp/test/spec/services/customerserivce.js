'use strict';

describe('Service: customerserivce', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var customerserivce;
  beforeEach(inject(function (_customerserivce_) {
    customerserivce = _customerserivce_;
  }));

  it('should do something', function () {
    expect(!!customerserivce).toBe(true);
  });

});
