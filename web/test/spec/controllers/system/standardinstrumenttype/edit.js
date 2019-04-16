'use strict';

describe('Controller: SystemStandardinstrumenttypeEditCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var SystemStandardinstrumenttypeEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SystemStandardinstrumenttypeEditCtrl = $controller('SystemStandardinstrumenttypeEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SystemStandardinstrumenttypeEditCtrl.awesomeThings.length).toBe(3);
  });
});
