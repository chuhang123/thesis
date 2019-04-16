'use strict';

describe('Controller: StandardDevicesetIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var StandardDevicesetIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StandardDevicesetIndexCtrl = $controller('StandardDevicesetIndexCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StandardDevicesetIndexCtrl.awesomeThings.length).toBe(3);
  });
});
