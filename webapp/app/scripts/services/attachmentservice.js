'use strict';

/**
 * @ngdoc service
 * @name webappApp.attachmentService
 * @description
 * # attachmentService
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('AttachmentService', function($http, CommonService) {
        var self = this;

        // 删除附件与图片
        self.delete = function(id, callback) {
            // 利用$http获取代码
            $http.delete('/Attachment/' + id).then(function successCallback(response) {
                if (callback) {
                    callback(response.status);
                }
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        // 删除文件与附件
        self.deleteFile = function(id, callback) {
            // 拼接url
            var url = '/Attachment/file/' + id;
            // 删除附件
            $http.delete(url)
                .then(function success(response) {
                    if (callback) {
                        callback(response.data);
                    }
                }, function error(response) {
                    CommonService.httpError(response);
                });
        };

        // 上传图片类型的附件
        self.uploadImage = function(image) {
            var url = "/Attachment/uploadImage";

            // post文件类型的参数，使Content-Type:multipart/form-data;
            var formData = new FormData();
            formData.append('attachment', image);

            return $http.post(url, formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

        /**
         * 上传文件
         */
        self.uploadFile = function(file) {
            var url = "/Attachment/uploadFile";

            // post文件类型的参数，使Content-Type:multipart/form-data;
            var formData = new FormData();
            formData.append('attachment', file);

            return $http.post(url, formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

        /**
         * 下载文件
         * @param  {[type]} attachment 附件
         */
        self.downloadFile = function(attachment) {
            var url  = '/Attachment/file/' + attachment.saveName;
            var name = '检定档案.' + attachment.ext;
            CommonService.downloadPdfByUrlAndName(url, name);
        };

        return {
            delete: self.delete,
            deleteFile: self.deleteFile,
            uploadImage: self.uploadImage,
            uploadFile: self.uploadFile,
            downloadFile: self.downloadFile
        };
    });
