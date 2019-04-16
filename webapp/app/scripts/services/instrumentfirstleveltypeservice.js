'use strict';

/**
 * @ngdoc service
 * @name webappApp.InstrumentFirstLevelTypeService
 * @description
 * # InstrumentFirstLevelTypeService
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('InstrumentFirstLevelTypeService', function ($http, CommonService) {
        var self = this;

        self.getAllByDisciplineId = function (disciplineId, callback) {
            var url = '/InstrumentFirstLevelType/getAllByDisciplineId/' + disciplineId;
            $http.get(url)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.save = function(data, callback) {
            var url = '/InstrumentFirstLevelType/';
            $http.post(url, data)
                .then(function success(response){
                    if (callback) {callback(response.data);}
                }, function error(response){
                    CommonService.httpError(response);
                });
        };

        return {
            getAllByDisciplineId: self.getAllByDisciplineId,
            save: self.save
        };
    });
