'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardDevicesetEditCtrl
 * @description
 * # StandardDevicesetEditCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('CategoryEditCtrl', function ($scope, $state, $stateParams, CategoryService, CommonService) {
        var self = this;

        self.init = function () {
            CategoryService.get($stateParams.id, function (data) {
                $scope.data = data;
            });
        };

        self.init();

        self.saveAndClose = function () {
            CategoryService.save($scope.data, function () {
                CommonService.success(undefined, undefined, function () {
                    $state.go('system.Category');
                });
            });
        };

        // 统一暴露
        $scope.saveAndClose = self.saveAndClose;
    });
