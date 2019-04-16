'use strict';

/**
 * @ngdoc service
 * @name webappApp.StandardDeviceService
 * @description
 * # StandardDeviceService
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('StandardDeviceService', function ($http, CommonService) {
        var self = this;

        self.save = function (data, callback) {
            var url = '/StandardDevice/';
            $http.post(url, data)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.getStandardDevicesByDeviceSetId = function (deviceSetId, callback) {
            var url = '/StandardDevice/getStandardDevicesByDeviceSetId/' + deviceSetId;
            $http.get(url)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.delete = function(id, callback) {
            $http.delete('/StandardDevice/' + id)
                .then(function success(response) {
                    if (callback) {
                        callback(response);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.get = function (id, callback) {
            $http.get('/StandardDevice/' + id)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.update = function (id, data, callback) {
            var url = '/StandardDevice/' + id;
            $http.put(url, data)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        return {
            save: self.save,
            getStandardDevicesByDeviceSetId: self.getStandardDevicesByDeviceSetId,
            delete: self.delete,
            get: self.get,
            update: self.update
        };
    });
