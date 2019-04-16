'use strict';

describe('Filter: imageTitle', function () {

  // load the filter's module
  beforeEach(module('webappApp'));

  // initialize a new instance of the filter before each test
  var imageTitle;
  beforeEach(inject(function ($filter) {
    imageTitle = $filter('imageTitle');
  }));

  it('should return the input prefixed with "imageTitle filter:"', function () {
    var text = 'angularjs';
    expect(imageTitle(text)).toBe('imageTitle filter: ' + text);
  });

});
