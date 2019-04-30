'use strict';

/**
 * @ngdoc service
 * @name webappApp.customerserivce
 * @description
 * # customerserivce
 * Service in the webappApp.
 */
angular.module('webappApp')
  .service('CustomerService', function ($http, CommonService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
      var self = this;

      self.initController = function (controller, scope, stateParams) {
          CommonService.initControllerPage(controller, scope);

          controller.initScopeParams = function () {
              return {
                  //discipline: stateParams.discipline,
                  page: stateParams.page,
                  size: stateParams.size
              };
          };

          controller.load = controller.reload = function () {
              self.pageAll(controller.generateQueryParams(), function (data) {
                      scope.datas = data;
                  }
              );
          };

      };

      self.pageAll = function (params, callback) {
          $http.get('/User/getByRole', params)
              .then(function success(response) {
                  if (callback) {
                      callback(response.data);
                  }
              }, function error(response) {
                  CommonService.httpError(response);
              });
      };

  });
