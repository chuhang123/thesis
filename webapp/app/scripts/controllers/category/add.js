'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardDevicesetEditCtrl
 * @description
 * # StandardDevicesetEditCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('CategoryAddCtrl', function ($scope, $state, $stateParams, CategoryService, CommonService) {
        var self = this;
        $scope.data = {
            name: '' // 名称
        };

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
