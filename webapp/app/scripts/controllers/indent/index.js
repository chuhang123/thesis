'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:IndentIndexCtrl
 * @description
 * # IndentIndexCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
  .controller('IndentIndexCtrl', function ($scope, $stateParams, IndentService) {
      var self = this;

      self.init = function () {
          IndentService.initController(self, $scope, $stateParams);
          $scope.params = self.initScopeParams();
          self.load();
      };
      self.init();
  });
