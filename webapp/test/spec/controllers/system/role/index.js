'use strict';

describe('Controller: SystemRoleIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var SystemRoleIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SystemRoleIndexCtrl = $controller('SystemRoleIndexCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SystemRoleIndexCtrl.awesomeThings.length).toBe(3);
  });
});
