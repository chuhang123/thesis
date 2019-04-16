'use strict';

/**
 * @ngdoc service
 * @name webappApp.DeviceInstrumentService
 * @description
 * # DeviceInstrumentService
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('DeviceInstrumentService', function ($http, CommonService) {
        var self = this;

        self.pageAllByDeviceSetId = function (deviceSetId, callback) {
            $http.get('/DeviceInstrument/pageAllByDeviceSetId/' + deviceSetId)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.get = function (id, callback) {
            $http.get('/DeviceInstrument/' + id)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.delete = function (id, callback) {
            $http.delete('/DeviceInstrument/' + id)
                .then(function success(response) {
                    if (callback) {
                        callback(response);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.update = function (id, data, callback) {
            $http.put('/DeviceInstrument/' + id, data)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.save = function (data, callback) {
            $http.post('/DeviceInstrument/', data)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.pageAll = function (callback) {
            $http.get('/DeviceInstrument/pageAll')
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        return {
            get: self.get,
            delete: self.delete,
            update: self.update,
            pageAllByDeviceSetId: self.pageAllByDeviceSetId,
            save: self.save,
            pageAll: self.pageAll
        };
    });
