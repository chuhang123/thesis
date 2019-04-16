'use strict';

describe('Service: PurposeService', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var PurposeService;
  beforeEach(inject(function (_PurposeService_) {
    PurposeService = _PurposeService_;
  }));

  it('should do something', function () {
    expect(!!PurposeService).toBe(true);
  });

});
