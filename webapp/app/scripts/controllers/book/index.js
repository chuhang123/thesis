'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:SystemRoleIndexCtrl
 * @description
 * # SystemRoleIndexCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('BookIndexCtrl', function ($scope, $stateParams, BookService) {
        var self = this;

        self.init = function () {
            BookService.initController(self, $scope, $stateParams);
            $scope.params = self.initScopeParams();
            self.load();
        };
        self.init();
    });
