'use strict';

/**
 * @ngdoc service
 * @name webappApp.accuracyDisplayNameService
 * @description
 * # accuracyDisplayNameService
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('accuracyDisplayNameService', function ($http, CommonService) {
        var self  = this;
        // 初始化数据
        self.init = function () {
            self.cache     = {};
            self.cache.all = [];
        };

        self.init();

        // 获取所有数据
        self.all = function (callback) {
            if (angular.equals(self.cache.all, [])) {
                var url = '/AccuracyDisplayName/getAll';
                $http.get(url)
                    .then(function success(response) {
                        self.cache.all = response.data;
                        callback(self.cache.all);
                    }, function error(response) {
                        CommonService.httpError(response);
                    });
            } else {
                callback(self.cache.all);
            }
        };

        return {
            init: self.init,
            getAll: self.all
        };
    });
