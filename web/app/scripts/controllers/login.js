'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$state', 'UserService', 'config', 'SweetAlert', 'CommonService', 'WebAppMenuService', '$window', function ($scope, $rootScope, $state, UserService, config, SweetAlert, CommonService, WebAppMenuService, $window) {
        var self = this;
        $rootScope.sliderAndContent = true;

        //UserService.init();

        // 初始化用户
        self.login = function () {
            UserService.login($scope.user, function (status) {
                if (status === 401) {
                    CommonService.setMessage('对不起', '您的用户名或密码输入有误或用' +
                        '户状态不正常，请重新输入。');
                    $scope.form.$submitted = false;
                } else if (status === 200) {
                    // 登录成功，先清空缓存，然后跳转.自动跳转
                    //WebAppMenuService.init();
                    //$rootScope.sliderAndContent = false;
                    //$state.go('main.dashboard', {}, {reload: true});

                    $window.location.reload();
                } else {
                    CommonService.setMessage('对不起', '系统发生未知错误，请稍后重试，或联系您的管理员。');
                    $scope.form.$submitted = false;
                }
            });
        };


        // 统一暴露
        $scope.login = self.login;
        $scope.user  = {username: '', password: ''};
    }]);
