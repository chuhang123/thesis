'use strict';

/**
 * @ngdoc service
 * @name webappApp.InstrumentTypeService
 * @description 标准器类别
 * # InstrumentTypeService
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('StandardDeviceInstrumentTypeService', function ($http, $uibModal, $state, CommonService, InstrumentFirstLevelTypeService, PurposeService) {
        var self = this;

        self.initController = function (controller, scope, stateParams) {
            CommonService.initControllerPage(controller, scope);

            controller.initScopeParams = function () {
                return {
                    discipline: stateParams.discipline,
                    page: stateParams.page,
                    size: stateParams.size
                };
            };

            controller.load = controller.reload = function () {
                self.pageByDisciplineId(scope.params.discipline.id, controller.generateQueryParams(), function (data) {
                        scope.data = data;
                    }
                );
            };

            // 删除
            controller.delete = scope.delete = function (object) {
                CommonService.warning(function (success, error) {
                    self.delete(object.id, function (response) {
                        if (response.status === 204) {
                            // 隐藏该实体
                            object.hide = true;
                            success();
                        } else {
                            error();
                        }
                    });
                });
            };
        };

        self.addAndEditInit = function (controller, scope) {
            // 学科变化后对应的初始化
            controller.initAboutDiscipline = function () {
                scope.data.accuracies = [];            // 已选精度
                scope.data.measureScales = [];         // 已选测试量范
                scope.data.specifications = [];        // 已选规格型号
                scope.data.purposes = [];              // 用途
            };

            // 添加实体
            controller.addEntity = function (type) {
                controller.currentAddEntityType = type;
                controller.modalInstance();
            };

            controller.modalInstance = function (type) {
                $uibModal.open({
                    templateUrl: 'views/system/standardInstrumentType/addEntity.html',
                    size: 'small',
                    controller: 'InstrumentTypeAddCtrlModalInstanceCtrl',
                    scope: scope
                });
            };

            // 編輯实体
            controller.editEntity = function(object) {
                scope.currentEditObject = object;
                controller.modalEditInstance();
            };

            // 弹出窗口初始化(编辑)
            controller.modalEditInstance = function () {
                $uibModal.open({
                    templateUrl: 'views/system/standardInstrumentType/addEntity.html',
                    size: 'small',
                    controller: 'InstrumentTypeAddCtrlEditObject',
                    scope: scope
                });
            };


            // 保存实体
            controller.saveEntity = function (object, callback) {
                var currentAddEntityType = controller.currentAddEntityType;
                // 精度
                if (currentAddEntityType === 'accuracy') {
                    controller.saveAccuarcy(object, function () {
                        callback();
                    });
                } else if (currentAddEntityType === 'measureScale') { // 测量范围
                    controller.saveMeasureScale(object, callback);
                } else if (currentAddEntityType === 'specification') { // 规格型号
                    controller.saveSpecification(object, callback);
                } else if (currentAddEntityType === 'instrumentFirstLevelType') {
                    controller.saveInstrumentFirstLevelType(object, callback);
                }

                // 初始化当前添加的实体类型
                controller.currentAddEntityType = '';
            };

            // 添加测量范围
            controller.saveMeasureScale = function (object, callback) {
                scope.data.measureScales.push({value: object.name, pinyin: object.pinyin, weight:scope.data.measureScales.length});
                callback();
            };

            // 添加规格型号
            controller.saveSpecification = function (object, callback) {
                scope.data.specifications.push({value: object.name, pinyin: object.pinyin, weight:scope.data.specifications.length});
                callback();
            };

            // 新增精度
            controller.saveAccuarcy = function (object, callback) {
                scope.data.accuracies.push({value: object.name, pinyin: object.pinyin, weight:scope.data.accuracies.length});
                callback();
            };

            // 新增分类一级名称
            controller.saveInstrumentFirstLevelType = function (object, callback) {
                // 先存一学科类别，再重置为0，数据获取后来恢复学科类别。目的是为了触发分类一级名称指类重新请求最新的数据
                var discipline = scope.discipline;
                scope.discipline = {id: 0};
                var data = {
                    name: object.name,
                    pinyin: object.pinyin,
                    discipline: {id: discipline.id}
                };
                InstrumentFirstLevelTypeService.save(data, function (response) {
                    scope.discipline = discipline;
                    if (callback) {
                        callback(response);
                    }
                });
            };

            // 删除一个规格型号
            controller.popSpecificationsByIndex = function (value) {
                controller.popListByListAndDateValue(scope.data.specifications, value);
            };

            // 删除一个测试范围
            controller.popMeasureScalesByIndex = function (value) {
                controller.popListByListAndDateValue(scope.data.measureScales, value);
            };

            // 删除一个精确度
            controller.popAccuraciesByIndex = function (index) {
                controller.popListByListAndDateValue(scope.data.accuracies, index);
            };

            // 上浮测量范围
            controller.upMeasureScale = function(MeasureScale) {
                controller.upObjectByListAndObject(scope.data.measureScales, MeasureScale);
            };

            // 下沉测量范围
            controller.downMeasureScale = function(MeasureScale) {
                controller.downObjectByListAndObject(scope.data.measureScales, MeasureScale);
            };

            // 上浮精度
            controller.upAccuracy = function(accuracy) {
                controller.upObjectByListAndObject(scope.data.accuracies, accuracy);
            };

            // 下沉精度
            controller.downAccuracy = function(accuracy) {
                controller.downObjectByListAndObject(scope.data.accuracies, accuracy);
            };

            // 上浮可选规格型号
            controller.upSpecification = function (specification) {
                controller.upObjectByListAndObject(scope.data.specifications, specification);
            };

            // 下沉可选规格型号
            controller.downSpecification = function(specification) {
                controller.downObjectByListAndObject(scope.data.specifications, specification);
            };

            // 将对象由原数组中，上浮一个
            controller.upObjectByListAndObject = function(list, object) {
                if (object.weight > 0) {
                    angular.forEach(list, function(value) {
                        if (value.weight === object.weight - 1) {
                            value.weight++;
                        }
                    });
                    object.weight--;
                }
            };

            // 将对象由原数组中，下沉一个
            controller.downObjectByListAndObject = function(list, object) {
                if (object.weight < list.length - 1) {
                    angular.forEach(list, function(value) {
                        if (value.weight === object.weight + 1) {
                            value.weight--;
                        }
                    });
                    object.weight++;
                }
            };

            // 从数组中删除一个元素，并重新设置权限
            controller.popListByListAndIndex = function(list, index) {
                var object = list[index];
                list.splice(index, 1);
                angular.forEach(list, function(value){
                    if (value.weight > object.weight) {
                        value.weight--;
                    }
                });
            };

            // //从数组中删除一个元素，并重新设置权限
            controller.popListByListAndDateValue = function(list, value) {
                var object = {};
                angular.forEach(list, function(data, key) {
                    if (data.value === value) {		//如果value值相等就删除
                        object = list[key];
                        list.splice(key, 1);
                    }
                });

                angular.forEach(list, function(value){
                    if (value.weight > object.weight) {
                        value.weight--;
                    }
                });
            };

            // 选中/反选 精度
            controller.toggleAccuracy = function (accuracy) {
                CommonService.toggleCheckbox(accuracy, scope.data.accuracies);
            };

            // 选中/反选 用途
            controller.togglePurpose = function (purpose) {
                CommonService.toggleCheckbox(purpose, scope.data.purposes);
            };

            // 是否添加了精确度
            controller.isAccuraciesError = function () {
                if (scope.data && scope.data.accuracies) {
                    if (scope.data.accuracies.length > 0) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            };
            // 是否添加了测量范围
            controller.isMeasureScalesError = function () {
                if (scope.data && scope.data.measureScales) {
                    if (scope.data.measureScales.length > 0) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            };

            // 是否选择了精确度类别名称
            controller.isAccuracyDisplayNameError = function () {
                if (scope.data) {
                    if (scope.data.accuracyDisplayName && scope.data.accuracyDisplayName.id && scope.data.accuracyDisplayName.id > 0) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            };

            // 判断用途是否被默认选中
            controller.isPurposeChecked = function (purpose) {
                if (scope.data) {
                    var index = CommonService.searchByIndexName(purpose, 'id', scope.data.purposes);
                    if (index === -1) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            };

            // 获取所有的用途
            controller.getAllPurpose = (function () {
                PurposeService.all(function (data) {     // 可选用途
                    scope.purposes = data;
                });
            })();

            // 保存并关闭
            controller.saveAndClose = function () {
                scope.form.submitted = true;   // 设置提交
                if (controller.isAccuraciesError() || controller.isMeasureScalesError() || controller.isAccuracyDisplayNameError()) {
                } else {
                    scope.submiting = true;
                    controller.save(function () {
                        CommonService.success(undefined, undefined, $state.go('system.standardInstrumentType', {discipline: {id: scope.discipline.id}}));
                    });
                }
            };

            scope.addEntity = controller.addEntity;
            scope.editEntity = controller.editEntity;
            scope.saveEntity = controller.saveEntity;
            scope.popSpecificationsByIndex = controller.popSpecificationsByIndex;
            scope.popMeasureScalesByIndex = controller.popMeasureScalesByIndex;
            scope.popAccuraciesByIndex = controller.popAccuraciesByIndex;
            scope.downAccuracy = controller.downAccuracy;
            scope.upAccuracy = controller.upAccuracy;
            scope.upMeasureScale = controller.upMeasureScale;
            scope.downMeasureScale = controller.downMeasureScale;
            scope.toggleAccuracy = controller.toggleAccuracy;
            scope.saveAndNew = controller.saveAndNew;
            scope.saveAndClose = controller.saveAndClose;
            scope.togglePurpose = controller.togglePurpose;
            scope.isPurposeChecked = controller.isPurposeChecked;
            scope.isAccuracyChecked = controller.isAccuracyChecked;
            scope.showAddInstrumentTypeFirstLevel = controller.showAddInstrumentTypeFirstLevel;
            scope.submiting = false;
            scope.isAccuraciesError = controller.isAccuraciesError;
            scope.isMeasureScalesError = controller.isMeasureScalesError;
            scope.isAccuracyDisplayNameError = controller.isAccuracyDisplayNameError;
            scope.deleteAccuracy = controller.deleteAccuracy;
            scope.edit = controller.edit;
            scope.upSpecification = controller.upSpecification;
            scope.downSpecification = controller.downSpecification;
        };

        self.pageByDisciplineId = function (disciplineId, params, callback) {
            var url = '/StandardDeviceInstrumentType/pageByDisciplineId/' + disciplineId;
            $http.get(url, params)
                .then(function success(response) {
                    callback(response.data);
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.getAllByDisciplineId = function (disciplineId, callback) {
            var url = '/StandardDeviceInstrumentType/getAllByDisciplineId/' + disciplineId;
            $http.get(url)
                .then(function success(response) {
                    callback(response.data);
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        self.delete = function(id, callback) {
            $http.delete('/StandardDeviceInstrumentType/' + id)
                .then(function success(response) {
                    if (callback) {
                        callback(response);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        /**
         * 获取某个一级类别下的所有数据
         * @param instrumentFirstLevelTypeId 器具一级类别ID
         * @param callback
         * @author panjie
         */
        self.getAllByInstrumentFirstLevelTypeId = function (instrumentFirstLevelTypeId, callback) {
            var url = '/StandardDeviceInstrumentType/getAllByInstrumentFirstLevelTypeId/' + instrumentFirstLevelTypeId;
            $http.get(url)
                .then(function success(response) {
                    if (callback) {
                        callback(response);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });

        };


        return {
            initController: self.initController,
            pageByDisciplineId: self.pageByDisciplineId,
            addAndEditInit: self.addAndEditInit,
            getAllByInstrumentFirstLevelTypeId: self.getAllByInstrumentFirstLevelTypeId,
            getAllByDisciplineId: self.getAllByDisciplineId
        };
    });
