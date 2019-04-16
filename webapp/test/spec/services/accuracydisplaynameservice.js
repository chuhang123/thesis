'use strict';

describe('Service: accuracyDisplayNameService', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var accuracyDisplayNameService;
  beforeEach(inject(function (_accuracyDisplayNameService_) {
    accuracyDisplayNameService = _accuracyDisplayNameService_;
  }));

  it('should do something', function () {
    expect(!!accuracyDisplayNameService).toBe(true);
  });

});
