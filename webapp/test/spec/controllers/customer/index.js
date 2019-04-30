'use strict';

describe('Controller: CustomerIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var CustomerIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CustomerIndexCtrl = $controller('CustomerIndexCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CustomerIndexCtrl.awesomeThings.length).toBe(3);
  });
});
