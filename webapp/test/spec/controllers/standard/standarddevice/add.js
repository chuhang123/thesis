'use strict';

describe('Controller: StandardStandarddeviceAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var StandardStandarddeviceAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StandardStandarddeviceAddCtrl = $controller('StandardStandarddeviceAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StandardStandarddeviceAddCtrl.awesomeThings.length).toBe(3);
  });
});
