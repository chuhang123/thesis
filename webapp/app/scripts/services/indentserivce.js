'use strict';

/**
 * @ngdoc service
 * @name webappApp.indentserivce
 * @description
 * # indentserivce
 * Service in the webappApp.
 */
angular.module('webappApp')
  .service('IndentService', function ($http, CommonService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
      var self = this;

      self.initController = function (controller, scope, stateParams) {
          CommonService.initControllerPage(controller, scope);

          controller.initScopeParams = function () {
              return {
                  //discipline: stateParams.discipline,
                  page: stateParams.page,
                  size: stateParams.size,
              };
          };

          controller.load = controller.reload = function () {
              self.pageAll(controller.generateQueryParams(), function (data) {
                      scope.datas = data;
                      angular.forEach(scope.datas, function (key, index) {
                          scope.datas[index].commodityKeys = Object.keys(scope.datas[index].commodity);
                      });


                  }
              );
          };

      };

      self.pageAll = function (params, callback) {
          $http.get('/Indent/getAll', params)
              .then(function success(response) {
                  if (callback) {
                      callback(response.data);
                  }
              }, function error(response) {
                  CommonService.httpError(response);
              });
      };

  });
