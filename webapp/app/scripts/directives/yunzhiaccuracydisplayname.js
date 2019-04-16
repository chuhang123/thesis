'use strict';

/**
 * @ngdoc directive
 * @name webappApp.directive:yunzhiAccuracyDisplayName
 * @description
 * # yunzhiAccuracyDisplayName
 */
angular.module('webappApp')
    .directive('yunzhiAccuracyDisplayName', function (accuracyDisplayNameService, CommonService) {
        return {
            //独立scope，使各个指令之间互不影响
            scope: {
                ngModel: '=', // 双向数据绑定
                instrumentType: '=' // 双向绑定data-instrument-type
            },
            templateUrl: 'views/directive/yunzhiAccuracyDisplayName.html',
            restrict: 'EA',
            link: function ($scope) {
                var self               = this;
                $scope.datas           = [];
                $scope.accuracyDisplay = {};

                // 获取所有准确度等级
                self.getAll = function () {
                    accuracyDisplayNameService.getAll(function (datas) {
                        $scope.datas = datas;
                        self.setNgModel();

                    });
                };

                // 设置ngModel
                self.setNgModel = function () {
                    $scope.accuracyDisplay.selected = $scope.ngModel;
                    var dataObject                  = {
                        'id': 0,
                        'name': '请选择',
                        'pinyin': 'qingxuanze'
                    };
                    if (CommonService.searchByIndexName(dataObject, 'id', $scope.datas) === -1) {
                        // 如果还没有添加过“请选择”， 则将id为0的项添加到数组的起始位置
                        $scope.datas.unshift(dataObject);
                    }
                    // 如果未传值，则取第一个。否则，按传入的值进行取值
                    if ((typeof($scope.accuracyDisplay.selected) === 'undefined' || angular.equals($scope.accuracyDisplay.selected, {})) && $scope.datas.length) {
                        $scope.accuracyDisplay.selected = $scope.datas[0];
                    } else {
                        var index                       = CommonService.searchByIndexName($scope.accuracyDisplay.selected, 'id', $scope.datas);
                        $scope.accuracyDisplay.selected = $scope.datas[index];
                    }
                };


                $scope.update = function (data) {
                    self.getAll();
                    $scope.ngModel = data;
                };

                // 监视二级类别是否发生变化。如果发生变化，则重置ngModel的值。此时，利用双向数据绑定。将值传回V层
                $scope.$watch('instrumentType', function (newValue) {
                    if (newValue && newValue.id) {
                        // 由于二级类别只对应一个准确度等级，所有只显示一条记录，且状态为选中
                        $scope.ngModel                  = newValue.accuracyDisplayName;
                        $scope.datas                    = [newValue.accuracyDisplayName];
                        $scope.accuracyDisplay.selected = $scope.datas[0];
                    } else {
                        // 如果二级类别没有选择项，则重新显示所有准确度等级
                        self.getAll();
                    }

                }, true);

                // 监视ngModel是否发生变化
                $scope.$watch('ngModel', function (newValue, oldValue) {
                    // 如果有新值，且老值为undefined 或 新老值ID不相等时，更新ngModel
                    if (newValue && (!oldValue || (newValue.id !== oldValue.id))) {
                        self.setNgModel();
                    }
                }, true);
            }
        };
    });
