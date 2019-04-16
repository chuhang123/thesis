'use strict';

describe('Filter: imagePath', function () {

  // load the filter's module
  beforeEach(module('webappApp'));

  // initialize a new instance of the filter before each test
  var imagePath;
  beforeEach(inject(function ($filter) {
    imagePath = $filter('imagePath');
  }));

  it('should return the input prefixed with "imagePath filter:"', function () {
    var text = 'angularjs';
    expect(imagePath(text)).toBe('imagePath filter: ' + text);
  });

});
