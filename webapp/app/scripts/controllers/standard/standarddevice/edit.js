'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardStandarddeviceEditCtrl
 * @description
 * # StandardStandarddeviceEditCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
  .controller('StandardStandardDeviceEditCtrl', function ($scope, $stateParams, $state, StandardDeviceService, CommonService) {
    var self = this;

    self.init = function () {
        StandardDeviceService.get($stateParams.id, function (data) {
            $scope.data = data;
            $scope.instrumentFirstLevelType = $scope.data.standardDeviceInstrumentType.instrumentFirstLevelType;
            $scope.discipline = $scope.instrumentFirstLevelType.discipline;
        });
    };

    self.update = function () {
        StandardDeviceService.update($stateParams.id, $scope.data, function () {
            CommonService.success(undefined, undefined, function () {
                console.log($scope.data)
                $state.go('standard.standardDevice', {deviceSetId: $scope.data.deviceSet.id});
            });
        });
    };
    self.init();
    $scope.update = self.update;
  });
