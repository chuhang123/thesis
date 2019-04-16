'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:SystemRoleIndexCtrl
 * @description
 * # SystemRoleIndexCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('CategoryIndexCtrl', function ($scope, $stateParams, CategoryService) {
        var self = this;

        self.init = function () {
            CategoryService.initController(self, $scope, $stateParams);
            $scope.params = self.initScopeParams();
            self.load();
        };
        self.init();
    });
