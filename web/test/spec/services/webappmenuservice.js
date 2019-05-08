'use strict';

describe('Service: WebAppMenuService', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var WebAppMenuService;
  beforeEach(inject(function (_WebAppMenuService_) {
    WebAppMenuService = _WebAppMenuService_;
  }));

  it('should do something', function () {
    expect(!!WebAppMenuService).toBe(true);
  });

});
