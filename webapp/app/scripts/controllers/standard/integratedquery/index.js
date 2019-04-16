'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardIntegratedqueryIndexCtrl
 * @description
 * # StandardIntegratedqueryIndexCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
  .controller('StandardIntegratedQueryIndexCtrl', function ($scope, $stateParams, DeviceSetService, CommonService) {
      var self = this;

      self.init = function () {
          CommonService.initControllerPage(self, $scope);

          $scope.params = {
              page: $stateParams.page,
              size: $stateParams.size,
              code: $stateParams.code,
              name: $stateParams.name
          };

          self.load();
      };

      self.load = self.reload = self.submit = function () {
          console.log($scope.params)
          DeviceSetService.pageAllBySpecification($scope.params, function (data) {
              console.log(data)
              $scope.data = data;
          });
      };

      self.init();
      $scope.load = self.load;
      $scope.submit = self.submit;
  });
