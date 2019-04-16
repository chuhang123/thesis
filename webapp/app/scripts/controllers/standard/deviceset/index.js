'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardDevicesetIndexCtrl
 * @description
 * # StandardDevicesetIndexCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
      .controller('StandardDeviceSetIndexCtrl', function ($scope, $stateParams, DeviceSetService) {
    var self = this;

    self.init = function () {
        DeviceSetService.initController(self, $scope, $stateParams);
        $scope.params = self.initScopeParams();
        self.load();
    };
    self.init();
  });
