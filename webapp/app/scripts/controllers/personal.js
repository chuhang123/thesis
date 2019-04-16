'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:PersonalCtrl
 * @description
 * # PersonalCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('PersonalCtrl', function ($scope, $state, UserService, CommonService, SweetAlert, PersonalService) {
        var self = this;

        self.init = function () {
            PersonalService.initController(self, $scope);
            self.load();
        };

        self.init();
        $scope.submit = self.submit;
    });
