'use strict';

/**
 * @ngdoc service
 * @name webappApp.PurposeService
 * @description
 * # PurposeService
 * Service in the webappApp.
 */
angular.module('webappApp')
  .service('PurposeService', function ($http) {
      var self = this;
      //获取后台数据
      self.all = function (callback) {
          $http.get('/Purpose/getAll').then(function success(response) {
              callback(response.data);
          });
      };

      return {
          getPurposeArray: self.all,
          all: self.all
      };
  });
