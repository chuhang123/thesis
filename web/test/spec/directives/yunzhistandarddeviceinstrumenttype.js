'use strict';

describe('Directive: yunzhiStandardDeviceInstrumentType', function () {

  // load the directive's module
  beforeEach(module('webappApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<yunzhi-standard-device-instrument-type></yunzhi-standard-device-instrument-type>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the yunzhiStandardDeviceInstrumentType directive');
  }));
});
