'use strict';

describe('Service: AccuracyService', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var AccuracyService;
  beforeEach(inject(function (_AccuracyService_) {
    AccuracyService = _AccuracyService_;
  }));

  it('should do something', function () {
    expect(!!AccuracyService).toBe(true);
  });

});
