'use strict';

describe('Controller: StandardDevicesetEditCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var StandardDevicesetEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StandardDevicesetEditCtrl = $controller('StandardDevicesetEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StandardDevicesetEditCtrl.awesomeThings.length).toBe(3);
  });
});
