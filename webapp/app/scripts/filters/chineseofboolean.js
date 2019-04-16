'use strict';

/**
 * @ngdoc filter
 * @name webappApp.filter:ChineseOfBoolean
 * @function
 * @description 将boolean转化为汉语
 * # ChineseOfBoolean
 * Filter in the webappApp.
 */
angular.module('webappApp')
  .filter('ChineseOfBoolean', function () {
    return function (input) {
      if (input) {
        return '是';
      } else {
        return '否';
      }
    };
  });
