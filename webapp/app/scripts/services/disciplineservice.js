'use strict';

/**
 * @ngdoc service
 * @name webappApp.DisciplineService
 * @description
 * # DisciplineService
 * Service in the webappApp.
 */
angular.module('webappApp')
  .service('DisciplineService', function ($http) {
    var self = this;

      self.data = {};
      self.data.all = [];
      self.getAll = function (callback) {
          if (self.data.all.length === 0) {
              $http.get('/Discipline').then(function (response) {
                  self.data.all = response.data;
                  callback(self.data.all);
              });
          } else {
              callback(self.data.all);
          }
      };

      self.getTopOne = function(callback) {
          self.getAll(function(data){
              var result = {};
              if (data.length > 0) {
                  result = data[0];
              }
              callback(result);
          });
      };

      return {
          getAll: self.getAll,
          getTopOne: self.getTopOne
      };
  });
