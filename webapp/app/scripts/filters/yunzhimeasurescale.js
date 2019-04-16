'use strict';

/**
 * @ngdoc filter
 * @name webappApp.filter:yunzhiMeasureScale
 * @function
 * @description 测量范围
 * 1. 判断权重
 * 2. 先输出权重小的，再输出权重大的
 * 3. 如果一般大，则只输出一个值
 * 当存在最大最小值时，显示 最小值 ~ 最大值
 * 当只在存在一个值时，显示
 * # yunzhiMeasureScale
 * Filter in the webappApp.
 */
angular.module('webappApp')
    .filter('yunzhiMeasureScale', function() {
        return function(minMeasureScale, maxMeasureScale) {
            if (minMeasureScale && maxMeasureScale && minMeasureScale.id && maxMeasureScale.id) {
                if (minMeasureScale.weight < maxMeasureScale.weight) {
                    return minMeasureScale.value + ' ~ ' + maxMeasureScale.value;
                }

                if (minMeasureScale.weight > maxMeasureScale.weight) {
                    return maxMeasureScale.value + ' ~ ' + minMeasureScale.value;
                }

                if (minMeasureScale.weight === maxMeasureScale.weight) {
                    return minMeasureScale.value;
                }
            } else {
                console.log('输入的最大最小测量范围有异常');
                return '-';
            }

        };
    });

