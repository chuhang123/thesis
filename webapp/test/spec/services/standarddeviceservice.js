'use strict';

describe('Service: StandardDeviceService', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var StandardDeviceService;
  beforeEach(inject(function (_StandardDeviceService_) {
    StandardDeviceService = _StandardDeviceService_;
  }));

  it('should do something', function () {
    expect(!!StandardDeviceService).toBe(true);
  });

});
