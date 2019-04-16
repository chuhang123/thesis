'use strict';

describe('Controller: StandardDeviceinstrumentAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var StandardDeviceinstrumentAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StandardDeviceinstrumentAddCtrl = $controller('StandardDeviceinstrumentAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StandardDeviceinstrumentAddCtrl.awesomeThings.length).toBe(3);
  });
});
