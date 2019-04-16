'use strict';

describe('Service: DisciplineService', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var DisciplineService;
  beforeEach(inject(function (_DisciplineService_) {
    DisciplineService = _DisciplineService_;
  }));

  it('should do something', function () {
    expect(!!DisciplineService).toBe(true);
  });

});
