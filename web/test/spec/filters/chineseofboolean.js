'use strict';

describe('Filter: ChineseOfBoolean', function () {

  // load the filter's module
  beforeEach(module('webappApp'));

  // initialize a new instance of the filter before each test
  var ChineseOfBoolean;
  beforeEach(inject(function ($filter) {
    ChineseOfBoolean = $filter('ChineseOfBoolean');
  }));

  it('should return the input prefixed with "ChineseOfBoolean filter:"', function () {
    var text = 'angularjs';
    expect(ChineseOfBoolean(text)).toBe('ChineseOfBoolean filter: ' + text);
  });

});
