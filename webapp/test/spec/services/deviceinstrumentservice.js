'use strict';

describe('Service: DeviceInstrumentService', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var DeviceInstrumentService;
  beforeEach(inject(function (_DeviceInstrumentService_) {
    DeviceInstrumentService = _DeviceInstrumentService_;
  }));

  it('should do something', function () {
    expect(!!DeviceInstrumentService).toBe(true);
  });

});
