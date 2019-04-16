'use strict';

describe('Controller: SystemStandardinstrumenttypeAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var SystemStandardinstrumenttypeAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SystemStandardinstrumenttypeAddCtrl = $controller('SystemStandardinstrumenttypeAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SystemStandardinstrumenttypeAddCtrl.awesomeThings.length).toBe(3);
  });
});
