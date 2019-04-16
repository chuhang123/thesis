'use strict';

describe('Controller: SystemMenuIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var SystemMenuIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SystemMenuIndexCtrl = $controller('SystemMenuIndexCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SystemMenuIndexCtrl.awesomeThings.length).toBe(3);
  });
});
