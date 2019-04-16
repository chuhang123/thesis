'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:SystemStandardinstrumenttypeEditCtrl
 * @description 标准器类别--编辑
 * # SystemStandardinstrumenttypeEditCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('SystemStandardinstrumenttypeEditCtrl', function ($scope, $stateParams, InstrumentTypeService, StandardDeviceInstrumentTypeService, CommonService) {
        var self = this;

        self.init = (function () {
            // 初始化控制器信息
            StandardDeviceInstrumentTypeService.addAndEditInit(self, $scope);

            // 获取器具类别
            InstrumentTypeService.get($stateParams.id, function (response) {
                if (response.status === 200) {
                    $scope.data           = response.data;
                    $scope.discipline     = $scope.data.instrumentFirstLevelType.discipline;
                    $scope.showExtendInfo = true;

                } else {
                    CommonService.error('数据请求发生错误，请稍后重试');
                }
            });
        })();

        // 更新
        self.save = function (callback) {
            InstrumentTypeService.update($scope.data.id, $scope.data, callback);
        };
    });
