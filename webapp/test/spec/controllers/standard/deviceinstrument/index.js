'use strict';

describe('Controller: StandardDeviceinstrumentIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var StandardDeviceinstrumentIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StandardDeviceinstrumentIndexCtrl = $controller('StandardDeviceinstrumentIndexCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StandardDeviceinstrumentIndexCtrl.awesomeThings.length).toBe(3);
  });
});
