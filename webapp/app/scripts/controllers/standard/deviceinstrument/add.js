'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardDeviceinstrumentAddCtrl
 * @description
 * # StandardDeviceinstrumentAddCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
  .controller('StandardDeviceInstrumentAddCtrl', function ($scope, $stateParams, $state, CommonService, DeviceInstrumentService) {
      var self = this;

      self.init = function () {
          $scope.data = {
              discipline: '',                 // discipline
              instrumentType: {id: ''},   // 分类一级名称
              accuracy: {id: ''},               // 测量范围
              minMeasureScale: {id: ''},                    // 准确度等级
              maxMeasureScale: {id: ''},                    // 准确度等级
              deviceSet: {id: $stateParams.deviceSetId}   // 计量标准装置
          };
      };
      self.save = function () {
          DeviceInstrumentService.save($scope.data, function () {
              CommonService.success(undefined, undefined, function () {
                  $state.go('standard.deviceInstrument', {deviceSetId: $stateParams.deviceSetId});
              });
          });
      };

      self.init();
      $scope.save = self.save;
  });
