'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('RegistrationCtrl', ['$scope', '$rootScope', 'UserService', 'CommonService', '$state', function ($scope, $rootScope, UserService, CommonService, $state) {
        $rootScope.sliderAndContent = true;
        var self = this;

        self.data = {
            username: '',
            name: '',
            address: '',
            phone: '',
            password: ''
        };

        self.saveAndClose = function () {
            UserService.save($scope.data, function () {
                CommonService.success('注册成功', undefined, function () {
                    $state.go('login');
                });
            });
        };

        // 统一暴露
        $scope.data = self.data;
        $scope.saveAndClose = self.saveAndClose;
    }]);

