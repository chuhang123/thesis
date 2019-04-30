'use strict';

describe('Controller: IndentIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var IndentIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IndentIndexCtrl = $controller('IndentIndexCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IndentIndexCtrl.awesomeThings.length).toBe(3);
  });
});
