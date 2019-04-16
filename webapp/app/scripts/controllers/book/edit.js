'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardDevicesetEditCtrl
 * @description
 * # StandardDevicesetEditCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('BookEditCtrl', function ($scope, $state, $stateParams, BookService, CommonService) {
        var self = this;
        $scope.test = true;

        self.init = function () {
            BookService.get($stateParams.id, function (data) {
                $scope.data = data;
            });
        };

        self.init();

        self.saveAndClose = function () {
            BookService.save($scope.data, function () {
                CommonService.success(undefined, undefined, function () {
                    $state.go('system.Book');
                });
            });
        };

        // 统一暴露
        $scope.saveAndClose = self.saveAndClose;
    });
