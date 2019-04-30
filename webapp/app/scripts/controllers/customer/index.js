'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:CustomerIndexCtrl
 * @description
 * # CustomerIndexCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
  .controller('CustomerIndexCtrl', function ($scope, $stateParams, $http, CustomerService, CommonService) {
      var self = this;

      self.init = function () {
          CustomerService.initController(self, $scope, $stateParams);
          $scope.params = self.initScopeParams();
          self.load();
      };

      self.resetPassword = function (id) {
          $http.put('/User/resetPassword/' + id)
              .then(function success(response) {
                  CommonService.success('密码已重置', '', function () {});

              }, function error(response) {
                  CommonService.httpError(response);
              });
          console.log('reset');
      };

      self.init();
      $scope.resetPassword = self.resetPassword;
  });
