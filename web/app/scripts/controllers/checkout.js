'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('CheckoutCtrl', ['$scope', '$rootScope', 'BookService', 'UserService', 'CommonService', '$state', function ($scope, $rootScope, BookService, UserService, CommonService, $state) {
        $rootScope.sliderAndContent = true;
        var self = this;
        $scope.data = {
            username: '',
            address: '',
            phone: '',
            remark: '',
        };

        self.getShoppingCart = function() {
            BookService.getShoppingCart(function (data) {
                $scope.books = data.arrayList;
                $scope.treeMap = data.treeMap;
            });
        };

        self.getInfo = function() {
            UserService.getCurrentLoginUser(function (data) {
                $scope.data.username = data.username;
                $scope.data.address = data.address;
                $scope.data.phone = data.phone;
            });
        };

        self.getTotalPrice = function() {
            $scope.totalPrice = 0;
            angular.forEach($scope.books, function (value) {
                $scope.totalPrice += value.price * $scope.treeMap[value.id];
            });
        };

        // 生成订单
        self.generateIndent = function() {
            var data = {
                address: $scope.data.address,
                phone: $scope.data.phone,
                remark: $scope.data.remark,
                totalPrice: $scope.totalPrice
            };
            BookService.generateIndent(data, function () {
                CommonService.success('支付成功', '请耐心等耐，我们会尽快为您发货', function () {
                    $state.go('main.dashboard');
                });
            });
        };

        // 判断用户是否登录
        UserService.checkUserLogin(function () {
            self.getInfo();
        });
        self.getShoppingCart();
        $scope.generateIndent = self.generateIndent;
        $scope.$watch('books',function(){
            self.getTotalPrice();
        });

    }]);

