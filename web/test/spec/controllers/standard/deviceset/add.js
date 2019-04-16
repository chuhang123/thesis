'use strict';

describe('Controller: StandardDevicesetAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var StandardDevicesetAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StandardDevicesetAddCtrl = $controller('StandardDevicesetAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StandardDevicesetAddCtrl.awesomeThings.length).toBe(3);
  });
});
