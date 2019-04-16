'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardStandarddeviceAddCtrl
 * @description
 * # StandardStandarddeviceAddCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
  .controller('StandardStandardDeviceAddCtrl', function ($scope, $stateParams, $state, StandardDeviceService, CommonService) {
    var self = this;

    self.init = function () {
        $scope.data = {
            code: '',                       // 代码
            name: '',                       // 名称
            manufacturerName: '',           // 生产企业名称
            factoryNum: '',                 // 出厂编号
            licenseNum: '',                 // 许可证号
            main: '',                       // 主标准器
            discipline: '',                 // discipline
            instrumentFirstLevelType: '',   // 分类一级名称
            standardDeviceInstrumentType: {id: ''},   // 标准器类别
            specification: {id: ''},              // 型号规格
            measureScale: {id: ''},               // 测量范围
            accuracy: {id: ''},                    // 准确度等级
            deviceSet: {id: $stateParams.deviceSetId}   // 计量标准装置
        };
    };

    self.save = function () {
        StandardDeviceService.save($scope.data, function () {
            CommonService.success(undefined, undefined, function () {
                $state.go('standard.standardDevice', {deviceSetId: $stateParams.deviceSetId});
            });
        });
    };

    self.init();
    $scope.save = self.save;

  });
