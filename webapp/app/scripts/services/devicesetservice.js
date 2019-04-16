'use strict';

/**
 * @ngdoc service
 * @name webappApp.DeviceSetService
 * @description
 * # DeviceSetService
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('DeviceSetService', function ($http, CommonService) {
        var self = this;

        self.initController = function (controller, scope, stateParams) {
            CommonService.initControllerPage(controller, scope);

            controller.initScopeParams = function () {
                return {
                    //discipline: stateParams.discipline,
                    page: stateParams.page,
                    size: stateParams.size,
                    code: '',
                    name: ''
                };
            };

            controller.load = controller.reload = function () {
                self.pageAll(controller.generateQueryParams(), function (data) {
                        scope.data = data;
                    }
                );
            };

            // 删除
            controller.delete = scope.delete = function (object) {
                CommonService.warning(function (success, error) {
                    self.delete(object.id, function (response) {
                        if (response.status === 204) {
                            // 隐藏该实体
                            object.hide = true;
                            success();
                        } else {
                            error();
                        }
                    });
                });
            };

        };

        self.pageAll = function (params, callback) {
            $http.get('/DeviceSet', params)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.get = function (id, callback) {
            $http.get('/DeviceSet/' + id)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.delete = function (id, callback) {
            $http.delete('/DeviceSet/' + id)
                .then(function success(response) {
                    if (callback) {
                        callback(response);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.update = function (id, data, callback) {
            $http.put('/DeviceSet/' + id, data)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.save = function (data, callback) {
            $http.post('/DeviceSet/', data)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.pageAllBySpecification = function (params, callback) {
            $http.get('/DeviceSet/pageAllBySpecification', {params: params})
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
            pageAll: self.pageAll,
            save: self.save,
            initController: self.initController,
            pageAllBySpecification: self.pageAllBySpecification
        };
    });
