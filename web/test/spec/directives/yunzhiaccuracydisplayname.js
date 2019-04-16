'use strict';

describe('Directive: yunzhiAccuracyDisplayName', function () {

  // load the directive's module
  beforeEach(module('webappApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<yunzhi-accuracy-display-name></yunzhi-accuracy-display-name>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the yunzhiAccuracyDisplayName directive');
  }));
});
