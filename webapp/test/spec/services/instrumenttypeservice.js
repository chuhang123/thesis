'use strict';

describe('Service: InstrumentTypeService', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var InstrumentTypeService;
  beforeEach(inject(function (_InstrumentTypeService_) {
    InstrumentTypeService = _InstrumentTypeService_;
  }));

  it('should do something', function () {
    expect(!!InstrumentTypeService).toBe(true);
  });

});
