'use strict';

/**
 * @ngdoc directive
 * @name webappApp.directive:yunzhiInstrumentType
 * @description 器具类别
 * # yunzhiInstrumentType
 */
angular.module('webappApp')
    .directive('yunzhiInstrumentType', ['$http', 'StandardDeviceInstrumentTypeService', 'CommonService', function($http, StandardDeviceInstrumentTypeService, CommonService) {
        return {
            //独立scope，使各个指令之间互不影响
            scope: {
                ngModel: '=',
                instrumentFirstLevelType: '=?', // 一级器具类别(非必选项)
                hide: '@', // 单项绑定data-hide
                discipline: '=?', // 学科类别(非必选项)
                config: '=?' // 配置信息(非必选项)
            },
            //模板
            templateUrl: 'views/directive/yunzhiInstrumentType.html',
            restrict: 'EA', //指令类型，多为E（元素），A（属性）
            controller: function($scope) {
                $scope.hide = false; // 初始化是否隐藏本元素
                $scope.instrumentTypes = []; // 初始化所有器具名称
                $scope.instrumentType = {};
                $scope.instrumentType.selected = $scope.ngModel; // 传值

                // 当用户进行选择时，更新ngModel。
                $scope.updateModel = function(newValue) {
                    $scope.ngModel = newValue;
                };
            },
            link: function postLink(scope) {
                var self = {};
                if (typeof(scope.config)) {
                    scope.config = {};
                }

                self.dataObject = {
                    'id': 0,
                    'name': '请选择',
                    'pinyin': 'qingxuanze'
                };

                self.addDataObject = function(datas, ngModel) {
                    scope.instrumentTypes = datas;
                    scope.ngModel = ngModel;
                    // 声明变量
                    // 将新项添加到数组起始位置
                    scope.instrumentTypes.unshift(self.dataObject);
                    var index = 0;
                    if (scope.ngModel && scope.ngModel.id) {
                        index = CommonService.searchByIndexName(scope.ngModel, 'id', datas);
                    }
                    index = index === -1 ? 0 : index;
                    scope.ngModel = scope.instrumentType.selected = datas[index];
                };

                // 监视一级类别是否发生变化
                self.watchInstrumentFirstLevelType = function(newValue, oldValue) {
                    if (newValue && newValue.id && !angular.equals(newValue, {}) && (newValue.id !== 0)) {
                        scope.hide = false;
                        var instrumentType = scope.ngModel;
                        //获取强检器具类别列表
                        StandardDeviceInstrumentTypeService.getAllByInstrumentFirstLevelTypeId(newValue.id, function(datas) {
                            self.addDataObject(datas, instrumentType);
                        });
                    } else if (oldValue) {
                        self.clear();
                    }
                };

                // 清空冗余数据
                self.clear = function() {
                    scope.instrumentTypes = [];
                    scope.instrumentTypes.push(self.dataObject);
                    scope.hide = true;
                    //隐藏器具，则将 选中的器具 初始化，并传给V层，供下级关联使用。
                    scope.ngModel = scope.instrumentType.selected = self.dataObject;
                };

                // 监视学科类别
                self.watchDiscipline = function(newValue, oldValue) {
                    if (newValue && newValue.id && !angular.equals(newValue, {}) && (newValue.id !== 0)) {
                        scope.hide = false;
                        // 获取用户可见的器具列表
                        StandardDeviceInstrumentTypeService.getAllByDisciplineId(newValue.id, function(datas) {
                            scope.instrumentTypes = datas;
                            // 如果大小不为0，而且用户并没有传入ngModel实体，则将第一个器具给当前器具(或者刚传入器具用户id，则初始化器具)
                            if (datas.length > 0) {
                                scope.ngModel = scope.instrumentType.selected = datas[0];
                            }
                        });
                    } else if (oldValue) {
                        self.clear();
                    }
                };

                // 监听传入的data-instrumentFirstLevelType是否发生了变化，如果发生了变化，则重新获取器具列表
                scope.$watch('instrumentFirstLevelType', self.watchInstrumentFirstLevelType, true);
                scope.$watch('discipline', self.watchDiscipline, true);

            }
        };
    }]);

