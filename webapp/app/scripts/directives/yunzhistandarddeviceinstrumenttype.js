'use strict';

/**
 * @ngdoc directive
 * @name webappApp.directive:yunzhiStandardDeviceInstrumentType
 * @description 标准器具类别
 * # yunzhiStandardDeviceInstrumentType
 */
angular.module('webappApp')
    .directive('yunzhiStandardDeviceInstrumentType', function (CommonService, StandardDeviceInstrumentTypeService) {
        return {
            //独立scope，使各个指令之间互不影响
            scope: {
                ngModel: '=',
                instrumentFirstLevelType: '=',             // 一级器具类别
                hide: '@'                                  // 单项绑定data-hide
            },
            //模板
            templateUrl: 'views/directive/yunzhiInstrumentType.html',
            restrict: 'EA', //指令类型，多为E（元素），A（属性）
            controller: function ($scope) {
                $scope.hide = false;    // 初始化是否隐藏本元素
                $scope.instrumentTypes = [];     // 初始化所有器具名称
                $scope.instrumentType = {};

                // 当用户进行选择时，更新ngModel。
                $scope.updateModel = function (newValue) {
                    $scope.ngModel = newValue;
                };
            },
            link: function postLink(scope) {
                var self = {};

                // 监视一级类别是否发生变化
                self.watchInstrumentFirstLevelType = function (newValue) {
                    if (newValue && newValue.id) {
                        // 获取用户可见的标准器具类别列表
                        StandardDeviceInstrumentTypeService.getAllByInstrumentFirstLevelTypeId(newValue.id, function (response) {
                            scope.instrumentTypes = response.data;
                            scope.ngModel = scope.instrumentType.selected = CommonService.addPleaseChoose(scope.instrumentTypes, scope.ngModel);
                        });
                    } else {
                        scope.instrumentTypes = [];
                        scope.ngModel = scope.instrumentType.selected = CommonService.addPleaseChoose(scope.instrumentTypes, scope.ngModel);
                    }
                };

                // 监听传入的data-instrumentFirstLevelType是否发生了变化，如果发生了变化，则重新获取器具列表
                scope.$watch('instrumentFirstLevelType', self.watchInstrumentFirstLevelType, true);
            }
        };
    });

