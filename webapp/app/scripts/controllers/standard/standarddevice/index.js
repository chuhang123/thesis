'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardStandarddeviceIndexCtrl
 * @description
 * # StandardStandarddeviceIndexCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('StandardStandardDeviceIndexCtrl', function ($scope, $stateParams, StandardDeviceService, CommonService) {
        var self = this;

        self.init = function () {
            $scope.deviceSetId = $stateParams.deviceSetId;

            StandardDeviceService.getStandardDevicesByDeviceSetId($scope.deviceSetId, function (data) {
                $scope.data = data;
            });
        };

        self.delete = function (object) {
            CommonService.warning(function (success, error) {
                StandardDeviceService.delete(object.id, function (response) {
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
