'use strict';

/**
 * @ngdoc directive
 * @name webappApp.directive:discipline
 * @description 学科类别 指令
 * # discipline
 */
angular.module('webappApp')
    .directive('yunzhiDiscipline', function (DisciplineService) {
        return {
            // 独立scope，使各个指令间不互相影响
            scope: {
                // 将指令中的discipline属性，双向绑定到scope.discipline
                ngModel: '='
            },
            // 模板
            templateUrl: 'views/directive/yunzhiDiscipline.html',
            restrict: 'EA', // 指令类型，多为E（元素）, A(属性)
            controller: function ($scope, CommonService) {
                var self                   = this;
                $scope.disciplines         = []; // 初始化所有学科类别
                $scope.discipline          = {}; // 初始化学科类别
                $scope.discipline.selected = $scope.ngModel; // ngModel的值传给V层

                var pleaseChooseObject = {
                    'name': '请选择',
                    'pinyin': 'qingxuanze'
                };

                // 添加请选择
                self.addPleaseChooseObject = function () {
                    // 防止重复进行添加
                    if (CommonService.searchByIndexName(pleaseChooseObject, 'id', $scope.disciplines) === -1) {
                        // 将新项添加到数组起始位置
                        $scope.disciplines.unshift(pleaseChooseObject);
                    }
                };

                // 当用户进行选择时，更新ngModel。
                $scope.updateModel = function (newValue) {
                    $scope.ngModel = newValue;
                };

                // 监听ngModel
                self.watchNgModel = function (newValue) {
                    if (newValue && newValue.id) {
                        console.log('监听到了ngModel发生了变化', newValue);
                        var index = 0;
                        if (newValue.id !== 0) {
                            // 找到，则进行赋值。否则，保持ngModel不变
                            index = CommonService.searchByIndexName(newValue, 'id', $scope.disciplines);
                            if (index !== -1) {
                                $scope.ngModel = $scope.discipline.selected = $scope.disciplines[index];
                            }
                        }
                    } else {
                        $scope.ngModel = pleaseChooseObject;
                    }
                };

                // 获取用户可见的学科类别列表
                DisciplineService.getAll(function (datas) {
                    // 初始化
                    $scope.disciplines = datas;
                    self.addPleaseChooseObject();

                    // 初始化
                    $scope.$watch('ngModel', self.watchNgModel, true);
                    self.addPleaseChooseObject();
                });
            }

        };
    });
