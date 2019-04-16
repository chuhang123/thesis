'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:SystemStandardinstrumenttypeAddCtrl
 * @description 标准器类别--新增
 * # SystemStandardinstrumenttypeAddCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
  .controller('SystemStandardinstrumenttypeAddCtrl', function ($scope, $uibModal, $state, AccuracyService, CommonService,
                                                               InstrumentTypeService, PurposeService, $stateParams,
                                                               StandardDeviceInstrumentTypeService) {
      var self = this;

      // 为新增界面时，初始化的代码
      self.init = (function () {
          // 初始化
          StandardDeviceInstrumentTypeService.addAndEditInit(self, $scope);
          self.disciplineId = parseInt($stateParams.disciplineId ? $stateParams.disciplineId : 0); // 学科类别id
          $scope.showExtendInfo = true;          // 显示扩展信息
          $scope.data = {};
          $scope.data.name = '';                  // 名称
          $scope.data.pinyin = '';                // 拼音
          $scope.discipline = {id: self.disciplineId};        // 对应的学科类别
          $scope.discipline.accuracies = []; // 学科类别对应的精度
          $scope.data.accuracyDisplayName = {};   // 精度显示名称
          $scope.data.instrumentFirstLevelType = {};  // 一级学科类别

          self.initAboutDiscipline();
      })();

      // 监听一级类别
      $scope.$watch('data.instrumentFirstLevelType', function (newValue) {
          if (newValue && newValue.id) {
              $scope.showExtendInfo = true;
          } else {
              $scope.showExtendInfo = false;
          }
          if (typeof self.initAboutDiscipline === 'function') {
              self.initAboutDiscipline();
          }
      });

      // 保存
      self.save = function (callback) {
          InstrumentTypeService.save($scope.data, callback);
      };

  });

/**
 * 弹窗
 * 直接引用父类的$scope。即:$scope.$parent
 * @author panjie
 */
angular.module('webappApp')
    .controller('InstrumentTypeAddCtrlEditObject', function ($scope, $uibModalInstance) {
        var self = this;
        self.init = function () {
            $scope.name = $scope.$parent.currentEditObject.value;
            $scope.pinyin = $scope.$parent.currentEditObject.pinyin;
        };
        self.init();

        // 点击确定时，进行数据的保存
        $scope.ok = function () {
            $scope.$parent.currentEditObject.value = $scope.name;
            $scope.$parent.currentEditObject.pinyin = $scope.pinyin;
            $uibModalInstance.close();
        };

        // 点击取消息时，关闭窗口
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    });


/**
 * 弹窗
 * 直接引用父类的$scope。即:$scope.$parent
 * @author panjie
 */
angular.module('webappApp')
    .controller('InstrumentTypeAddCtrlModalInstanceCtrl', function ($scope, $uibModalInstance) {
        var self = this;
        self.init = function () {
            $scope.name = '';
            $scope.pinyin = '';
        };
        self.init();

        // 点击确定时，进行数据的保存
        $scope.ok = function () {
            $scope.$parent.saveEntity({name: $scope.name, pinyin: $scope.pinyin}, function () {
                self.init();
                $uibModalInstance.close();
            });
        };

        // 点击取消息时，关闭窗口
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    });

