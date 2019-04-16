'use strict';

describe('Controller: StandardStandarddeviceIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var StandardStandarddeviceIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StandardStandarddeviceIndexCtrl = $controller('StandardStandarddeviceIndexCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StandardStandarddeviceIndexCtrl.awesomeThings.length).toBe(3);
  });
});
