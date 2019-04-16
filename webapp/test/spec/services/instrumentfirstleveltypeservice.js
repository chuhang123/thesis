'use strict';

describe('Service: InstrumentFirstLevelTypeService', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var InstrumentFirstLevelTypeService;
  beforeEach(inject(function (_InstrumentFirstLevelTypeService_) {
    InstrumentFirstLevelTypeService = _InstrumentFirstLevelTypeService_;
  }));

  it('should do something', function () {
    expect(!!InstrumentFirstLevelTypeService).toBe(true);
  });

});
