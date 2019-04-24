'use strict';

/**
 * @ngdoc service
 * @name webappApp.UserServer
 * @description
 * # UserServer
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('UserService', function ($cookies, $http, $route, config, CommonService, WebAppMenuService) {
        var self     = this;
        var cacheKey = 'userId';

        self.init = function () {
            self.currentLoginUser = {};
            $cookies.remove(cacheKey);
        };

        // 设置当登录用户
        self.setCurrentLoginUser = function (user) {
            self.currentLoginUser = user;
            $cookies.put(cacheKey, user.id);
        };

        // 获取当前的登录用户
        self.getCurrentLoginUser = function (callback) {
            if (self.currentLoginUser && !angular.equals(self.currentLoginUser, {})) {
                callback(self.currentLoginUser);
            } else if ($cookies.get(cacheKey)) {
                $http.get('/User/' + $cookies.get('userId'))
                    .then(function success(response) {
                        if (response.status === 200) {
                            self.setCurrentLoginUser(response.data);
                            callback(response.data);
                        } else {
                            callback({});
                        }
                    }, function error() {
                        callback({});
                    });
            } else {
                callback({});
            }
        };

        // 登录
        self.login = function (user, callback) {
            var headers = {authorization: 'Basic ' + btoa(user.username + ':' + user.password)};
            $http.get('/User/login', {headers: headers})
                .then(function success(response) {
                    console.log(response);
                        // 获取header中传回的x-auth-token并进行cookie
                        var xAuthToken = response.headers(config.xAuthTokenName);
                        if (xAuthToken) {
                            self.init();
                            $cookies.put(config.xAuthTokenName, xAuthToken, {expires: CommonService.getCookiesExpireDate()});
                            self.setCurrentLoginUser(response.data);
                            callback(response.status);
                        } else {
                            console.log('获取' + config.xAuthTokenName + '发生错误，获取到的值为：' + xAuthToken);
                            callback(400);
                        }
                    },
                    function error(response) {
                        // 发生错误，如果为401，说明用户名密码错误。如果不是401则系统错误
                        var status = response.status;
                        if (status !== 401) {
                            console.log('网络错误');
                            console.log(response);
                        }
                        callback(response.status);
                    });
        };


        // 判断当前用户是否登录
        self.checkUserIsLogin = function (callback) {
            self.getCurrentLoginUser(function (user) {
                if (!angular.equals(user, {})) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        };

        // 注销
        self.logout = function (callback) {
            // 移除cookie
            $cookies.remove(cacheKey);
            $cookies.remove(config.xAuthTokenName);

            // 重设当前用户菜单
            WebAppMenuService.currentUserMenuTree = [];
            $route.reload();
            callback();
        };

        /*
         * 更新用户密码和姓名
         * @param   用户id
         * @param   用户原密码与新密码，及用户名称
         * @param   callback
         * */
        self.updatePasswordAndNameOfCurrentUser = function (userPasswordAndName, callback) {
            $http.put('/User/updatePasswordAndNameOfCurrentUser/', userPasswordAndName)
                .then(function success(response) {
                    if (callback) {
                        callback(response.status);
                    }
                }, function error(response) {
                    console.log('error');
                });
        };

        self.save = function(data, callback) {
            var url = '/User/';
            $http.post(url, data)
                .then(function success(response){
                    if (callback) {callback(response.data);}
                }, function error(response){
                    CommonService.httpError(response);
                });
        };

        return {
            init: self.init,
            setCurrentLoginUser: self.setCurrentLoginUser,
            getCurrentLoginUser: self.getCurrentLoginUser,
            checkUserIsLogin: self.checkUserIsLogin,
            login: self.login,
            logout: self.logout,
            save: self.save,
            updatePasswordAndNameOfCurrentUser: self.updatePasswordAndNameOfCurrentUser
        };
    });
