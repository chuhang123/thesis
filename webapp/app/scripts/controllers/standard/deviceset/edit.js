'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardDevicesetEditCtrl
 * @description
 * # StandardDevicesetEditCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('StandardDeviceSetEditCtrl', function ($scope, $state, $stateParams, DeviceSetService, CommonService) {
        var self = this;

        self.init = function () {
            DeviceSetService.get($stateParams.id, function (data) {
                $scope.data = data;
            });
        };

        self.init();

        self.saveAndClose = function () {
            DeviceSetService.save($scope.data, function () {
                CommonService.success(undefined, undefined, function () {
                    $state.go('standard.deviceSet');
                });
            });
        };

        // 统一暴露
        $scope.saveAndClose = self.saveAndClose;
    });
