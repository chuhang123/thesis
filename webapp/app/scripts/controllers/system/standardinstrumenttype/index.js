'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:SystemStandardinstrumenttypeIndexCtrl
 * @description 标准器类别--显示
 * # SystemStandardinstrumenttypeIndexCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('SystemStandardinstrumenttypeIndexCtrl', function ($stateParams, $scope, CommonService, StandardDeviceInstrumentTypeService) {
        var self = this;

        self.init = function () {
            StandardDeviceInstrumentTypeService.initController(self, $scope, $stateParams);
            $scope.params = self.initScopeParams();
            self.load();

            $scope.$watch('params.discipline', function(newValue, oldValue) {
                // 使用以下判断，防止在初始化时，造成重载页面的死循环。
                if (newValue && oldValue && (newValue.id !== oldValue.id)) {
                    self.reload();
                }
            });
        };

        self.init();
    });
