'use strict';

/**
 * @ngdoc directive
 * @name webappApp.directive:yunzhiDate
 * @description 日期指令
 * # yunzhiDate
 */
angular.module('webappApp')
    .directive('yunzhiDate', function(CommonService, $filter) {
        return {
            //独立scope，使各个指令之间互不影响
            scope: {
                //将指令中的date属性，双向绑定到$scope.date
                ngModel: '=',
                name: '@?',
                required: '=?'
            },
            templateUrl: 'views/directive/yunzhiDate.html',
            restrict: 'EA', //指令类型，多为E（元素），A（属性）
            controller: function($scope) {
                // 实始化required
                if (typeof($scope.required) === 'undefined') {
                    $scope.required = true;
                }

                //传值给V层
                $scope.date = CommonService.dateToTimestamp($scope.ngModel);

                //对Datepicker控件的配置
                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                //显示多种日期格式
                $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                //默认选择第二种
                $scope.format = $scope.formats[1];
                // 可选最大日期
                // $scope.maxDate = new Date();

                //设置手动输入日期时可接受的格式
                $scope.altInputFormats = ['yyyy/M!/d!'];

                //点击显示日期控件
                $scope.open = function () {
                    $scope.opened = true;
                };

                // 发生变化时，将返回的UTC时间戳，转换为日期。Mon Jul 24 2017 00:00:00 GMT+0800 (CST) -> 2017-07-24
                // 参考 ：https://stackoverflow.com/questions/30816563/get-the-date-from-datepicker-programmatically-as-text
                $scope.change = function (data) {
                    if (data !== null) {
                        $scope.ngModel = $filter('date')(data, 'yyyy-MM-dd');
                    } else {
                        $scope.ngModel = undefined;
                    }
                };
            },
            link: function (scope) {
                scope.$watch('ngModel', function (newValue) {
                    scope.date = CommonService.dateToTimestamp(newValue);
                });
            }
        };
    });

