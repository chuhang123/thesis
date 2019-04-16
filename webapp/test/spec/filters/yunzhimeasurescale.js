'use strict';

describe('Filter: yunzhiMeasureScale', function () {

  // load the filter's module
  beforeEach(module('webappApp'));

  // initialize a new instance of the filter before each test
  var yunzhiMeasureScale;
  beforeEach(inject(function ($filter) {
    yunzhiMeasureScale = $filter('yunzhiMeasureScale');
  }));

  it('should return the input prefixed with "yunzhiMeasureScale filter:"', function () {
    var text = 'angularjs';
    expect(yunzhiMeasureScale(text)).toBe('yunzhiMeasureScale filter: ' + text);
  });

});
