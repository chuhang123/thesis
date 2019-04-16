'use strict';

describe('Service: DeviceSetService', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var DeviceSetService;
  beforeEach(inject(function (_DeviceSetService_) {
    DeviceSetService = _DeviceSetService_;
  }));

  it('should do something', function () {
    expect(!!DeviceSetService).toBe(true);
  });

});
