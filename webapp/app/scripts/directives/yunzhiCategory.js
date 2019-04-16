'use strict';

/**
 * @ngdoc directive
 * @name webappApp.directive:yunzhiCategory
 * @description
 * # yunzhiCategory
 */
angular.module('webappApp')
    .directive('yunzhiCategory', ['CategoryService', 'CommonService', function (CategoryService, CommonService) {
        return {
            // 独立scope，使各个指令间不互相影响
            scope:{
                // 将指令中的category属性，双向绑定到scope.category
                ngModel:'='
            },
            // 模板
            templateUrl: 'views/directive/yunzhiCategory.html',
            restrict: 'EA', // 指令类型，多为E（元素）, A(属性)
            //controller里面$element参数没有用到，暂作删除
            controller: function ($scope) {
                var self = {};
                self.addData = function (data) {
                    $scope.categorys = data;
                    console.log($scope.categorys);
                    var category = {name: '请选择'};
                    var index = -1;
                    if (-1 === CommonService.searchByIndexName(category, 'id', $scope.categorys)) {
                        // 添加默认选项
                        $scope.categorys.unshift(category);
                    }
                    if ($scope.ngModel && $scope.ngModel.id) {
                        index = CommonService.searchByIndexName($scope.ngModel, 'id', $scope.categorys);
                    }

                    if (index === -1) {
                        index = 0;          //默认请选择
                    }

                    $scope.category = {};
                    $scope.category.selected = $scope.ngModel = $scope.categorys[index];
                };

                CategoryService.pageAll(undefined, function(data){
                    self.addData(data.content);
                });
            },
            link: function postLink(scope) {
                // 监视区域是否发生变化。如果发生变化，则重置ngModel的值。此时，利用双向数据绑定。将值传回V层
                scope.$watch('category', function(newValue) {
                    if (newValue && newValue.selected && newValue.selected.id) {
                        scope.ngModel = newValue.selected;
                    } else {
                        scope.ngModel = {name: '请选择'};
                    }
                }, true);
            }
        };
    }]);
