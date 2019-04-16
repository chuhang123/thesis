'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardDeviceinstrumentIndexCtrl
 * @description
 * # StandardDeviceinstrumentIndexCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('StandardDeviceInstrumentIndexCtrl', function ($scope, $stateParams, DeviceInstrumentService, CommonService) {
        var self           = this;
        $scope.deviceSetId = $stateParams.deviceSetId;

        self.init = function () {
            if ($stateParams.deviceSetId) {
                $scope.isShowAdd = true;
                DeviceInstrumentService.pageAllByDeviceSetId($stateParams.deviceSetId, function (data) {
                    $scope.data = data;
                });
            } else {
                $scope.isShowAdd = false;
                DeviceInstrumentService.pageAll(function (data) {
                    $scope.data = data;
                });
            }
        };

        self.delete = function (object) {
            CommonService.warning(function (success, error) {
                DeviceInstrumentService.delete(object.id, function (response) {
                    if (response.status === 204) {
                        // 隐藏该实体
                        object.hide = true;
                        success();
                    } else {
                        error();
                    }
                });
            });
        };

        self.init();
        $scope.delete = self.delete;
    });
