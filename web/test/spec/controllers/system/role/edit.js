'use strict';

describe('Controller: SystemRoleEditCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var SystemRoleEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SystemRoleEditCtrl = $controller('SystemRoleEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SystemRoleEditCtrl.awesomeThings.length).toBe(3);
  });
});
