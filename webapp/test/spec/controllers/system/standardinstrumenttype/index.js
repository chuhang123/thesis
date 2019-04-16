'use strict';

describe('Controller: SystemStandardinstrumenttypeIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var SystemStandardinstrumenttypeIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SystemStandardinstrumenttypeIndexCtrl = $controller('SystemStandardinstrumenttypeIndexCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SystemStandardinstrumenttypeIndexCtrl.awesomeThings.length).toBe(3);
  });
});
