'use strict';

/**
 * @ngdoc directive
 * @name webappApp.directive:yunzhiUploadImage
 * @description
 * # yunzhiUploadImage
 */
angular.module('webappApp')
    .directive('yunzhiUploadImage', ['FileUploader', 'CommonService', 'AttachmentService', 'config', 'SweetAlert', function(FileUploader, CommonService, AttachmentService, config, SweetAlert) {
        return {
            scope: {
                ngModel: '='
            },
            templateUrl: 'views/directive/yunzhiUploadImage.html',
            restrict: 'EA',
            controller: function($scope, FileUploader) {
                var self = this;
                var uploader = $scope.uploader = new FileUploader();

                $scope.apiUrl = config.apiUrl; // 后台请求域名
                $scope.ngModel = false;

                // FILTERS
                uploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item /*{File|FileLikeObject}, options*/ ) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                });

                uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                    console.info('onWhenAddingFileFailed', item, filter, options);
                    // 当上传非图片类型的文件时，提示用户
                    SweetAlert.swal({
                        title: '对不起',
                        text: '只能上传图片类型的文件，请检查选择的文件是否为图片类型'
                    });
                };
                uploader.onAfterAddingFile = function(fileItem) {
                    console.info('onAfterAddingFile', fileItem);
                    // 上传图片
                    self.upload = function(data) {
                        try {
                            // 上传文件
                            AttachmentService.uploadImage(data._file)
                                .then(function success(response) {
                                    // 将上传成功的图片绑定再ngModel中
                                    //$scope.ngModel = [];
                                    $scope.ngModel = response.data;

                                }, function error() {
                                    // 提示用户上传失败
                                    SweetAlert.swal({
                                        title: '对不起',
                                        text: '上传的附件不能大于1M，请确认附件是否大于1M'
                                    });
                                });
                        } catch (e) {
                            console.log(e.name + ':' + e.message);
                        }
                    };

                    self.upload(fileItem);
                };
                uploader.onBeforeUploadItem = function(item) {
                    console.info('onBeforeUploadItem', item);
                };
                uploader.onProgressItem = function(fileItem, progress) {
                    console.info('onProgressItem', fileItem, progress);
                };
                uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    console.info('onSuccessItem', fileItem, response, status, headers);
                };
                uploader.onErrorItem = function(fileItem, response, status, headers) {
                    console.info('onErrorItem', fileItem, response, status, headers);
                };
                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                    console.info('onCompleteItem', fileItem, response, status, headers);
                };

            },
            link: function postLink(scope) {
                // 删除
                scope.delete = function(data, index) {
                    CommonService.warning(function(success, error) {
                        AttachmentService.delete(data.id, function(status) {
                            if (status === 204) {
                                success();
                                scope.ngModel.splice(index, 1);
                            } else {
                                error('error', '系统或网络异常', '');
                            }
                        });
                    });
                };
            }
        };
    }]);
