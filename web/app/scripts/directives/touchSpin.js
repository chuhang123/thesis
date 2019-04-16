'use strict';
/**
 * HOMER - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 */

angular
    .module('webappApp')
    .directive('touchSpin', [function touchSpin() {
        return {
            restrict: 'A',
            scope: {
                spinOptions: '=',
            },
            //link方法参数attrs没有用到，暂作删除
            link: function (scope, element) {
                scope.$watch(scope.spinOptions, function(){
                    render();
                });
                var render = function () {
                    $(element).TouchSpin(scope.spinOptions);
                };
            }
        };
    }]);


/**
 * touchSpin - Directive for Bootstrap TouchSpin
 */
