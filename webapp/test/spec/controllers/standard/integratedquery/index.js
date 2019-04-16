'use strict';

describe('Controller: StandardIntegratedqueryIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var StandardIntegratedqueryIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StandardIntegratedqueryIndexCtrl = $controller('StandardIntegratedqueryIndexCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StandardIntegratedqueryIndexCtrl.awesomeThings.length).toBe(3);
  });
});
