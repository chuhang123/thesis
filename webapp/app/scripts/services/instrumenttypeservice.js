'use strict';

/**
 * @ngdoc service
 * @name webappApp.InstrumentTypeService
 * @description
 * # InstrumentTypeService
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('InstrumentTypeService', function ($http, CommonService) {
        var self = this;

        // 获取某条数据信息
        self.get = function (id, callback) {
            var url = '/StandardDeviceInstrumentType/' + id;
            $http.get(url)
                .then(function success(response) {
                    if (callback) {
                        callback(response);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        /**
         * 更新
         * @param id 实体id
         * @param data 数据
         * @param callback
         * @author panjie
         */
        self.update = function(id, data, callback) {
            var url = '/StandardDeviceInstrumentType/' + id;
            $http.put(url, data)
                .then(function success(response) {
                    if (callback) {
                        callback(response.status);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.save = function(data, callback) {
            var url = '/StandardDeviceInstrumentType/';
            $http.post(url, data)
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
            save: self.save,
            update: self.update
        };
    });
