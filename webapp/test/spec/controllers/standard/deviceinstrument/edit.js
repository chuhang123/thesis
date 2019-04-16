'use strict';

describe('Controller: StandardDeviceinstrumentEditCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var StandardDeviceinstrumentEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StandardDeviceinstrumentEditCtrl = $controller('StandardDeviceinstrumentEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StandardDeviceinstrumentEditCtrl.awesomeThings.length).toBe(3);
  });
});
