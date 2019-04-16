'use strict';

/**
 * @ngdoc service
 * @name webappApp.personal
 * @description
 * # personal 个人中心
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('PersonalService', function (UserService, CommonService) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var self = this;

        self.initController = function (controller, scope) {
            controller.load = function () {
                // 手机号正则表达式
                scope.regex = '^1[34578]\\d{9}$';
                // 原密码
                scope.password = '';
                // 重置密码
                scope.resetPassword = '';
                // 确认密码
                scope.confirmPassword = '';

                UserService.getCurrentLoginUser(function (user) {
                    scope.data = user;
                });
            };

            controller.submit = function () {
                var userPasswordAndName = {
                    name: scope.data.name,
                    password: scope.password,
                    rePassword: scope.confirmPassword
                };
                // 更新用户姓名和密码
                UserService.updatePasswordAndNameOfCurrentUser(userPasswordAndName, function (status) {

                    if (204 === status) {
                        // 更新成功
                        // 传入空回调函数，因为如果用户直接访问的个人中心，则报错
                        CommonService.success('操作成功', '', function () {});
                    } else if (205 === status) {
                        // 原密码错误
                        CommonService.setMessage('对不起', '您的原密码输入有误，请重新输入');
                    } else {
                        CommonService.setMessage('对不起', '系统或网络异常，请稍后再试');
                    }

                    controller.load();
                });
            };

        };

        return {
            initController: self.initController
        };
    });
