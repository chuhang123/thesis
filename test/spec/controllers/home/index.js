'use strict';

describe('Controller: HomeIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('thesisApp'));

  var HomeIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HomeIndexCtrl = $controller('HomeIndexCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HomeIndexCtrl.awesomeThings.length).toBe(3);
  });
});
