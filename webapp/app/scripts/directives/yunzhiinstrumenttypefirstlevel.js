'use strict';

/**
 * @ngdoc directive
 * @name webappApp.directive:yunzhiInstrumentTypeFirstLevel
 * @description
 * # yunzhiInstrumentTypeFirstLevel
 */
angular.module('webappApp')
  .directive('yunzhiInstrumentTypeFirstLevel', function (InstrumentFirstLevelTypeService, CommonService) {
      return {
          scope: {
              ngModel: '=',
              discipline: '=', // 学科类别
              config: '=' // 配置信息
          },
          templateUrl: 'views/directive/yunzhiInstrumentTypeFirstLevel.html',
          restrict: 'EA',

          link: function postLink($scope) {
              var self = this;
              $scope.lists = [];
              var dataObject = {
                  'name': '请选择',
                  'pinyin': 'qingxuanze'
              };

              if (!$scope.ngModel) {
                  $scope.ngModel = dataObject;
              }

              self.setNgModel = function(ngModel) {
                  var index = 0;
                  if (ngModel && ngModel.id) {
                      index = CommonService.searchByIndexName(ngModel, 'id', $scope.lists);
                  }
                  index = index === -1 ? 0 : index;
                  $scope.ngModel = $scope.lists[index];
              };

              $scope.$watch('discipline', function(newValue, oldValue) {
                  if (newValue && newValue.id) {
                      /**
                       * 由于discipline是自身的一个属性。
                       * 所以改变自己(A)会改变到discipline(B)。
                       * 那么此时，如果不做判断，则会产生A的变化，使用得B变生了变化。监听B的变化，重新设置A的值；A的变化，使用B产生变化。。。。的死循环
                       * 所以需要加入新值的id是否与老值相等的判断。
                       * 同时，为了防止初始化时未进行数据请求，进行lists的长度是否为0的判断
                       * panjie
                       */
                      if (!(oldValue && oldValue.id && (oldValue.id === newValue.id) && ($scope.lists.length !== 0))) {
                          InstrumentFirstLevelTypeService.getAllByDisciplineId(newValue.id, function(lists) {
                              $scope.lists = lists;
                              // 将新项添加到数组起始位置
                              $scope.lists.unshift(dataObject);
                              self.setNgModel($scope.ngModel);
                          });
                      }
                  } else {
                      $scope.lists = [];
                      // 将新项添加到数组起始位置
                      $scope.lists.unshift(dataObject);
                      self.setNgModel($scope.ngModel);
                  }
              });
          }
      };
  });
