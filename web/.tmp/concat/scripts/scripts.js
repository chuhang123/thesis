'use strict';

/**
 * @ngdoc overview
 * @name webappApp
 * @description
 * # webappApp
 *
 * Main module of the application.
 */
angular
    .module('webappApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.router',                // Angular flexible routing
        'ui.bootstrap',                // Angular flexible routing
        'bm.bsTour',                // Angular bootstrap tour
        'angular-loading-bar',       // loading-bar
        'ui.select'
    ]);

'use strict';

function configState($stateProvider, $urlRouterProvider, $compileProvider, config) {
    // Optimize load start with remove binding information inside the DOM element
    $compileProvider.debugInfoEnabled(true);

    // Set default state
    $urlRouterProvider.otherwise(config.defaultRoute);
    $stateProvider

        .state('main', {
            abstract: true, // 表示此路由不对应具体的页面
            url: '/main',
            templateUrl: 'views/dashboard.html' // 模板文件
        })

        // 仪表台 -- 首页
        .state('main.dashboard', {
            url: '/dashboard',
            templateUrl: 'views/dashboard.html',
            data: {},
            controller: 'IndexCtrl'
        })


        //联系我们
        .state('contact', {
            url: '/contact',
            templateUrl: 'views/contact.html', // 模板文件
            controller: 'ContactCtrl'
        })

        //图书管理
        .state('book', {
            url: '/book/:categoryId',
            templateUrl: 'views/book.html', // 模板文件
            params: {
                categoryId: {
                    value: ''
                },
                name: {
                    value: ''
                }
            },
            controller: 'BookCtrl'
        })

            // 图书详情
        .state('bookDetail', {
            url: '/bookDetail/:id',
            templateUrl: 'views/bookdetail.html', // 模板文件
            params: {
                id: {
                    value: ''
                }
            },
            controller: 'BookDetailCtrl'
        })

        // 登录
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html', // 模板文件
            data: {},
            controller: 'LoginCtrl'
        })

        // 结算
        .state('checkout', {
            url: '/checkout',
            templateUrl: 'views/checkout.html', // 模板文件
            data: {},
            controller: 'CheckoutCtrl'
        })

        // 购物车
        .state('cart', {
            url: '/cart',
            templateUrl: 'views/cart.html', // 模板文件
            data: {},
            controller: 'CartCtrl'
        })

        // 用户注册
        .state('registration', {
            url: '/registration',
            templateUrl: 'views/registration.html',
            data: {},
            controller: 'RegistrationCtrl'
        })

        //个人中心
        .state('system.Personal', {
            // 路由值
            url: '/Personal',
            templateUrl: 'views/personal.html',
            data: {
                pageTitle: '个人中心'
            },
            controller: 'PersonalCtrl'
        });
}
configState.$inject = ["$stateProvider", "$urlRouterProvider", "$compileProvider", "config"];

angular
    .module('webappApp')
    // 系统配置文件
    .constant('config', {
        maxDisplayPageCount: 7, // 最大显示的分页数
        size: 10, // 默认每页大小
        xAuthTokenName: 'x-auth-token', // 认证字段
        apiUrl: 'http://localhost:8080', // api接口地址
        loginPath: '/login', // 入口地址
        mainPath: '/dashboard', // 首页地址
        cookiesExpiresTime: 1800000, // cookies过期时间
        rootScopeConfig: { // rootScope的配置信息
            title: '我的代码库',
            owner: '梦云智软件开发团队',
            technicalSupport: '<a href="https://chuhang123.github.io/" target="_blank">chuhang 技术不宅</a>',
            beginYear: 2017,
            currentYear: (new Date()).getFullYear()
        },
        defaultRoute: '/main/dashboard' // 默认路由
    })
    // 注入$http完成对URL请求的统一设置
    .factory('apiUrlHttpInterceptor', ["$cookies", "config", "$q", "$location", function ($cookies, config, $q, $location) {
        // 定义API接口地址
        var apiUrl               = config.apiUrl;
        var shouldPrependApiUrl  = function (reqConfig) {
            if (!apiUrl) {
                return false;
            }
            // todo:以http或https打头时，返回false;
            return !(/[\s\S]*.html/.test(reqConfig.url) || /[\s\S]*.json/.test(reqConfig.url) ||
                (reqConfig.url && reqConfig.url.indexOf(apiUrl) === 0));
        };
        // 获取cookies过期时间
        var getCookiesExpireDate = function () {
            var now = new Date();
            now.setTime(now.getTime() + config.cookiesExpiresTime);
            return now;
        };
        // 是否应该将xAuthToken添加到header信息中
        var shouldAddXAuthToken  = function (reqConfig) {
            // 如果为用户认证，或是已经带有x-auth-token进行提交，则返回 false
            if (reqConfig.headers.authorization || reqConfig.headers[config.xAuthTokenName]) {
                return false;
            } else {
                return true;
            }
        };
        return {
            request: function (reqConfig) {
                // 如果请求不以 .json|html|js|css 结尾，则进行请求url的改写
                if (apiUrl && shouldPrependApiUrl(reqConfig)) {
                    reqConfig.url = apiUrl + reqConfig.url;
                    // 如果用户非认证操作，且并没有带有x-auth-token进行请求，则在headers中加入x-auth-token
                    if (shouldAddXAuthToken(reqConfig)) {
                        reqConfig.headers[config.xAuthTokenName] = $cookies.get(config.xAuthTokenName);
                        $cookies.put(config.xAuthTokenName, $cookies.get(config.xAuthTokenName), {
                            expires: getCookiesExpireDate()
                        });
                    }
                }
                return reqConfig;
            },
            // 响应失败
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    // 错误码为401，则跳转到登录界面
                    $location.path(config.loginPath);
                    return $q.reject(rejection);
                } else {
                    return $q.reject(rejection);
                }
            }
        };
    }])
    // $http 注入，当发生请求时，自动添加前缀
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('apiUrlHttpInterceptor');
    }])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-yz-bar"><div class="loading"><div class="table-cell"><div class="loading-main"><img src="styles/svg/loading-bars.svg" width="256" height="64"><p>正在努力为您加载...</p></div></div></div></div>';
        // cfpLoadingBarProvider.spinnerTemplate = '';
    }])
    .config(configState)
    .run(["$rootScope", "$state", "UserService", "$location", "config", function ($rootScope, $state, UserService, $location, config) {
        // 检测当前用户状态，
        // UserService.checkUserIsLogin(function (status) {
        //     if (status === true) {
        //         // 已登录, 注册路由
        //     } else {
        //         if ($location.path() === '/registration' || $location.path() === '/check') {
        //             //注册界面或者系统核验提示界面
        //         } else {
        //             // 未登录，则跳转至登录界面。所以，登录界面与首页这两个路中需要手动注册。
        //             $location.path(config.loginPath);
        //         }
        //     }
        // });
        // 设置系统信息
        $rootScope.config = config.rootScopeConfig;
        $rootScope.$state = $state;
    }]);


'use strict';
/**
 * HOMER - Responsive Admin Theme
 * version 2.0
 *
 */

function fixWrapperHeight() {

  // // Get and set current height
  // var headerH = 62;
  // var navigationH = $("#navigation").height();
  // var contentH = $(".content").height();
  //
  // // Set new height when contnet height is less then navigation
  // if (contentH < navigationH) {
  //     $("#wrapper").css("min-height", navigationH + 'px');
  // }
  //
  // // Set new height when contnet height is less then navigation and navigation is less then window
  // if (contentH < navigationH && navigationH < $(window).height()) {
  //     $("#wrapper").css("min-height", $(window).height() - headerH  + 'px');
  // }
  //
  // // Set new height when contnet is higher then navigation but less then window
  // if (contentH > navigationH && contentH < $(window).height()) {
  //     $("#wrapper").css("min-height", $(window).height() - headerH + 'px');
  // }
}

function setBodySmall() {
  if ($(window).width() < 769) {
    $('body').addClass('page-small');
  } else {
    $('body').removeClass('page-small');
    $('body').removeClass('show-sidebar');
  }
}

$(document).ready(function () {

  // Set minimal height of #wrapper to fit the window
  fixWrapperHeight();

  // Add special class to minimalize page elements when screen is less than 768px
  setBodySmall();
});

$(window).bind("load", function () {

  // Remove splash screen after load
  $('.splash').css('display', 'none');
});

$(window).bind("resize click", function () {

  // Add special class to minimalize page elements when screen is less than 768px
  setBodySmall();

  // Waint until metsiMenu, collapse and other effect finish and set wrapper height
  setTimeout(function () {
    fixWrapperHeight();
  }, 300);
});

'use strict';
/**
 *
 * 首页 仪表台
 *
 */

angular
  .module('webappApp')
  .controller('appCtrl', ['$http', '$scope', '$timeout', '$location', 'config', 'UserService', function($http, $scope, $timeout, $location, config, UserService) {

    // For iCheck purpose only
    $scope.checkOne = true;

    /**
     * Sparkline bar chart data and options used in under Profile image on left navigation panel
     */

    $scope.barProfileData = [5, 6, 7, 2, 0, 4, 2, 4, 5, 7, 2, 4, 12, 11, 4];
    $scope.barProfileOptions = {
      type: 'bar',
      barWidth: 7,
      height: '30px',
      barColor: '#62cb31',
      negBarColor: '#53ac2a'
    };
    $scope.chartIncomeData = [{
      label: 'line',
      data: [
        [1, 10],
        [2, 26],
        [3, 16],
        [4, 36],
        [5, 32],
        [6, 51]
      ]
    }];

    $scope.chartIncomeOptions = {
      series: {
        lines: {
          show: true,
          lineWidth: 0,
          fill: true,
          fillColor: '#64cc34'

        }
      },
      colors: ['#62cb31'],
      grid: {
        show: false
      },
      legend: {
        show: false
      }
    };

    /**
     * Tooltips and Popover - used for tooltips in components view
     */
    $scope.dynamicTooltip = 'Hello, World!';
    $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';
    $scope.dynamicTooltipText = 'Dynamic';
    $scope.dynamicPopover = 'Hello, World!';
    $scope.dynamicPopoverTitle = 'Title';

    /**
     * Pagination - used for pagination in components view
     */
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;
    };

    /**
     * Typehead - used for typehead in components view
     */
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    // Any function returning a promise object can be used to load values asynchronously
    $scope.getLocation = function(val) {
      return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: val,
          sensor: false
        }
      }).then(function(response) {
        return response.data.results.map(function(item) {
          return item.formattedAddress;
        });
      });
    };

    /**
     * Rating - used for rating in components view
     */
    $scope.rate = 14;
    $scope.max = 14;

    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / this.max);
    };

    /**
     * groups - used for Collapse panels in Tabs and Panels view
     */
    $scope.groups = [{
      title: 'Dynamic Group Header - 1',
      content: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. '
    }, {
      title: 'Dynamic Group Header - 2',
      content: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. '
    }];

    $scope.oneAtATime = true;

    /**
     * Some Flot chart data and options used in Dashboard
     */

    var data1 = [
      [0, 55],
      [1, 48],
      [2, 40],
      [3, 36],
      [4, 40],
      [5, 60],
      [6, 50],
      [7, 51],
      [8, 55],
      [9, 48],
      [10, 40],
      [11, 36],
      [12, 40],
      [13, 60],
      [14, 50],
      [15, 51],
      [16, 40],
      [17, 60],
    ];
    var data2 = [
      [0, 56],
      [1, 49],
      [2, 41],
      [3, 42],
      [4, 46],
      [5, 54],
      [6, 57],
      [7, 59],
      [8, 56],
      [9, 49],
      [10, 41],
      [11, 38],
      [12, 46],
      [13, 67],
      [14, 57],
      [15, 59],
      [16, 56],
      [17, 49],
      [18, 41],
      [19, 38],
      [20, 46],
      [21, 62],
      [22, 57],
      [23, 59],
      [24, 56],
      [25, 49],
      [26, 41],
      [27, 31],
      [28, 46],
      [29, 50],
      [30, 57],
      [31, 59]
    ];

    $scope.chartUsersData = [data1, data2];
    $scope.chartUsersOptions = {
      series: {
        splines: {
          show: true,
          tension: 0.4,
          lineWidth: 1,
          fill: 0.4
        },
      },
      grid: {
        tickColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: 'f0f0f0',
        color: '#6a6c6f'
      },
      // 设置曲线的两种颜色
      colors: ['#62cb31', '#91D473'],
    };


    /**
     * Some Pie chart data and options
     */

    $scope.PieChart = {
      data: [1, 5],
      options: {
        fill: ['#62cb31', '#edf0f5']
      }
    };

    $scope.PieChart2 = {
      data: [226, 360],
      options: {
        fill: ['#62cb31', '#edf0f5']
      }
    };
    $scope.PieChart3 = {
      data: [0.52, 1.561],
      options: {
        fill: ['#62cb31', '#edf0f5']
      }
    };
    $scope.PieChart4 = {
      data: [1, 4],
      options: {
        fill: ['#62cb31', '#edf0f5']
      }
    };
    $scope.PieChart5 = {
      data: [226, 134],
      options: {
        fill: ['#62cb31', '#edf0f5']
      }
    };
    $scope.PieChart6 = {
      data: [0.52, 1.041],
      options: {
        fill: ['#62cb31', '#edf0f5']
      }
    };

    $scope.BarChart = {
      data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2],
      options: {
        fill: ['#dbdbdb', '#62cb31'],
      }
    };

    $scope.LineChart = {
      data: [5, 9, 7, 3, 5, 2, 5, 3, 9, 6, 5, 9, 4, 7, 3, 2, 9, 8, 7, 4, 5, 1, 2, 9, 5, 4, 7],
      options: {
        fill: '#62cb31',
        stroke: '#62cb31',
        width: 64
      }
    };


    $scope.stanimation = 'bounceIn';
    $scope.runIt = true;
    $scope.runAnimation = function() {

      $scope.runIt = false;
      $timeout(function() {
        $scope.runIt = true;
      }, 100);

    };

    // 注销
    $scope.logout = function () {
      UserService.logout(function(){
        $location.path(config.loginPath);
      });
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('IndexCtrl', ['$scope', '$rootScope', '$http', 'BookService', 'UserService', '$state', '$window', function ($scope, $rootScope, $http, BookService, UserService, $state, $window) {
        var self = this;
        $scope.books = [];

        $scope.hideInformation = function () {
            $rootScope.sliderAndContent = false;
        };

        self.findTop4ByOrderByCreateTimeDesc = function() {
            BookService.findTop4ByOrderByCreateTimeDesc(function (data) {
                $scope.latest = data;
            });
        };

        self.findTop4ByOrderByClicks = function() {
            BookService.findTop4ByOrderByClicks(function (data) {
                $scope.clicksMax = data;
            });
        };

        self.getCategorys = function() {
            BookService.getCategorys(function (data) {
                $scope.categorys = data;
            });
        };

        self.addToCart = function(id) {
            var postData = {book: [id], quantity:[1]};
            BookService.addToCart(postData);
        };

        self.getShoppingCart = function() {
            BookService.getShoppingCart(function (data) {
                $scope.books = data.arrayList;
                $scope.treeMap = data.treeMap;
            });
        };

        self.getTotalPrice = function() {
            $scope.totalPrice = 0;
            angular.forEach($scope.books, function (value) {
                $scope.totalPrice += value.price * $scope.treeMap[value.id];
            });
        };

        self.checkUserIsLogin = function() {
            UserService.checkUserIsLogin(function (data) {
                $scope.isLogin = data;
            });
        };

        self.logout = function() {
            UserService.logout(function () {
                $window.location.reload();
            });
        };

        // 跳转到图书菜单，并且携带name参数
        self.goBookAndSpecification = function (data) {
            var params = {name: data};
            $state.go('book', params);
        };

        self.getShoppingCart();
        self.findTop4ByOrderByClicks();
        self.findTop4ByOrderByCreateTimeDesc();
        self.getCategorys();
        self.getShoppingCart();
        self.checkUserIsLogin();
        $scope.$watch('books',function(){
            self.getTotalPrice();
        });
        $scope.logout = self.logout;
        $scope.goBookAndSpecification = self.goBookAndSpecification;
        $scope.addToCart = self.addToCart;
    }]);

'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('ContactCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $rootScope.sliderAndContent = true;

    }]);


'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('BookCtrl', ['$scope', '$rootScope', 'BookService', '$stateParams', function ($scope, $rootScope, BookService, $stateParams) {
        $rootScope.sliderAndContent = true;
        var self = this;
        self.getBySpecification = function() {
            var params = {name: $stateParams.name};
            BookService.getBySpecification(params, function (data) {
                $scope.books = data.content;
            });
        };

        self.getCategorys = function() {
            BookService.getCategorys(function (data) {
                $scope.categorys = data;
            });
        };

        self.getAllBooks = function() {
            BookService.getAll(function (data) {
                $scope.books = data;
            });
        };

        self.findBooksByCategoryId = function() {
            BookService.findBooksByCategoryId($stateParams.categoryId, function (data) {
              $scope.books = data;
            });
        };

        self.addToCart = function(id) {
            var postData = {book: [id], quantity:[1]};
            BookService.addToCart(postData);
        };

        if ($stateParams.categoryId !== '') {
            self.findBooksByCategoryId();
        } else if ($stateParams.name) {
            self.getBySpecification();
        } else {
            self.getAllBooks();
        }

        self.getCategorys();
        $scope.findBooksByCategoryId = self.findBooksByCategoryId;
        $scope.addToCart = self.addToCart;
    }]);


'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$state', 'UserService', 'config', 'SweetAlert', 'CommonService', 'WebAppMenuService', '$window', function ($scope, $rootScope, $state, UserService, config, SweetAlert, CommonService, WebAppMenuService, $window) {
        var self = this;
        $rootScope.sliderAndContent = true;

        //UserService.init();

        // 初始化用户
        self.login = function () {
            UserService.login($scope.user, function (status) {
                if (status === 401) {
                    CommonService.setMessage('对不起', '您的用户名或密码输入有误或用' +
                        '户状态不正常，请重新输入。');
                    $scope.form.$submitted = false;
                } else if (status === 200) {
                    // 登录成功，先清空缓存，然后跳转.自动跳转
                    //WebAppMenuService.init();
                    //$rootScope.sliderAndContent = false;
                    //$state.go('main.dashboard', {}, {reload: true});

                    $window.location.reload();
                } else {
                    CommonService.setMessage('对不起', '系统发生未知错误，请稍后重试，或联系您的管理员。');
                    $scope.form.$submitted = false;
                }
            });
        };


        // 统一暴露
        $scope.login = self.login;
        $scope.user  = {username: '', password: ''};
    }]);

'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('CartCtrl', ['$scope', '$rootScope', 'BookService', '$state', '$timeout', function ($scope, $rootScope, BookService, $state, $timeout) {
        $rootScope.sliderAndContent = true;
        var self = this;

        self.getShoppingCart = function() {
            BookService.getShoppingCart(function (data) {
                $scope.books = data.arrayList;
                $scope.treeMap = data.treeMap;
            });
        };
        self.getShoppingCart();

        self.delete = function(data) {
            data.hide = true;
            $scope.treeMap[data.id] = 0;
        };

        self.updateShoppingCart = function() {
            var book = [];
            var quantity = [];
            $scope.books.forEach(function (value, i) {
                book[i] = value.id;
                quantity[i] = $scope.treeMap[value.id];
            });
            var postData = {book: book, quantity:quantity};
            BookService.addToCart(postData);
        };

        self.checkout = function() {
            self.updateShoppingCart();
            $timeout(function () {
                $state.go('checkout');
            }, 200);

        };

        self.getTotalPrice = function() {
            $scope.totalPrice = 0;
            angular.forEach($scope.books, function (value) {
                $scope.totalPrice += value.price * $scope.treeMap[value.id];
            });
        };

        $scope.delete = self.delete;
        $scope.updateShoppingCart = self.updateShoppingCart;
        $scope.checkout = self.checkout;
        $scope.$watch('books',function(){
            self.getTotalPrice();
        });

        $scope.$watch('treeMap',function(){
            self.getTotalPrice();
        },true);
    }]);


'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('RegistrationCtrl', ['$scope', '$rootScope', 'UserService', 'CommonService', '$state', function ($scope, $rootScope, UserService, CommonService, $state) {
        $rootScope.sliderAndContent = true;
        var self = this;

        self.data = {
            username: '',
            name: '',
            address: '',
            phone: '',
            password: '',
            confirmPassword: ''
        };

        self.saveAndClose = function () {
            if (self.data.password !== self.data.confirmPassword) {
                CommonService.error('两次密码输入不一致', undefined, undefined);
            } else {
                UserService.save($scope.data, function () {
                    CommonService.success('注册成功', undefined, function () {
                        $state.go('login');
                    });
                });
            }
        };

        // 统一暴露
        $scope.data = self.data;
        $scope.saveAndClose = self.saveAndClose;
    }]);


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
                    $rootScope.sliderAndContent = false;
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


'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('BookDetailCtrl', ['$scope', '$rootScope', 'BookService', '$stateParams', function ($scope, $rootScope, BookService, $stateParams) {
        $rootScope.sliderAndContent = true;
        var self = this;

        self.get = function() {
            BookService.get($stateParams.id, function (data) {
                $scope.data = data;
            });
        };

        self.findTop4ByOrderByClicks = function() {
            BookService.findTop4ByOrderByClicks(function (data) {
                $scope.relateBooks = data;
                console.log(data);
            });
        };

        self.addToCart = function(id) {
            var postData = {book: [id], quantity:[$scope.quantity]};
            BookService.addToCart(postData);
        };

        self.get();
        self.findTop4ByOrderByClicks();
        $scope.addToCart = self.addToCart;
        $scope.quantity = 1;

    }]);


'use strict';

/**
 * @ngdoc service
 * @name webappApp.UserServer
 * @description
 * # UserServer
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('UserService', ["$cookies", "$http", "$route", "config", "CommonService", "WebAppMenuService", "$state", function ($cookies, $http, $route, config, CommonService, WebAppMenuService, $state) {
        var self     = this;
        var cacheKey = 'userId';

        self.init = function () {
            self.currentLoginUser = {};
            $cookies.remove(cacheKey);
        };

        // 设置当登录用户
        self.setCurrentLoginUser = function (user) {
            self.currentLoginUser = user;
            $cookies.put(cacheKey, user.id);
        };

        // 获取当前的登录用户
        self.getCurrentLoginUser = function (callback) {
            if (self.currentLoginUser && !angular.equals(self.currentLoginUser, {})) {
                callback(self.currentLoginUser);
            } else if ($cookies.get(cacheKey)) {
                $http.get('/User/' + $cookies.get('userId'))
                    .then(function success(response) {
                        if (response.status === 200) {
                            self.setCurrentLoginUser(response.data);
                            callback(response.data);
                        } else {
                            callback({});
                        }
                    }, function error() {
                        callback({});
                    });
            } else {
                callback({});
            }
        };

        // 登录
        self.login = function (user, callback) {
            var headers = {authorization: 'Basic ' + btoa(user.username + ':' + user.password)};
            $http.get('/User/login', {headers: headers})
                .then(function success(response) {
                    console.log(response);
                        // 获取header中传回的x-auth-token并进行cookie
                        var xAuthToken = response.headers(config.xAuthTokenName);
                        if (xAuthToken) {
                            self.init();
                            $cookies.put(config.xAuthTokenName, xAuthToken, {expires: CommonService.getCookiesExpireDate()});
                            self.setCurrentLoginUser(response.data);
                            callback(response.status);
                        } else {
                            console.log('获取' + config.xAuthTokenName + '发生错误，获取到的值为：' + xAuthToken);
                            callback(400);
                        }
                    },
                    function error(response) {
                        // 发生错误，如果为401，说明用户名密码错误。如果不是401则系统错误
                        var status = response.status;
                        if (status !== 401) {
                            console.log('网络错误');
                            console.log(response);
                        }
                        callback(response.status);
                    });
        };


        // 判断当前用户是否登录
        self.checkUserIsLogin = function (callback) {
            self.getCurrentLoginUser(function (user) {
                if (!angular.equals(user, {})) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        };

        // 判断用户是否登录，如果未登录，跳转登录界面
        self.checkUserLogin = function (callback) {
            self.getCurrentLoginUser(function (user) {
                if (angular.equals(user, {})) {
                    $state.go('login');
                } else if (callback) {
                    callback();
                }
            });
        };

        // 注销
        self.logout = function (callback) {
            // 移除cookie
            $cookies.remove(cacheKey);
            $cookies.remove(config.xAuthTokenName);

            // 重设当前用户菜单
            WebAppMenuService.currentUserMenuTree = [];
            $route.reload();
            callback();
        };

        /*
         * 更新用户密码和姓名
         * @param   用户id
         * @param   用户原密码与新密码，及用户名称
         * @param   callback
         * */
        self.updatePasswordAndNameOfCurrentUser = function (userPasswordAndName, callback) {
            $http.put('/User/updatePasswordAndNameOfCurrentUser/', userPasswordAndName)
                .then(function success(response) {
                    if (callback) {
                        callback(response.status);
                    }
                }, function error() {
                    console.log('error');
                });
        };

        self.save = function(data, callback) {
            var url = '/User/';
            $http.post(url, data)
                .then(function success(response){
                    if (callback) {callback(response.data);}
                }, function error(response){
                    CommonService.httpError(response);
                });
        };

        return {
            init: self.init,
            setCurrentLoginUser: self.setCurrentLoginUser,
            getCurrentLoginUser: self.getCurrentLoginUser,
            checkUserIsLogin: self.checkUserIsLogin,
            login: self.login,
            logout: self.logout,
            save: self.save,
            updatePasswordAndNameOfCurrentUser: self.updatePasswordAndNameOfCurrentUser,
            checkUserLogin: self.checkUserLogin
        };
    }]);

'use strict';

/**
 * @ngdoc service
 * @name webappApp.SweetAlert
 * @description
 * # SweetAlert
 * Factory in the webappApp.
 */
angular.module('webappApp')
  .factory('SweetAlert', ['$window', '$timeout', function ($window, $timeout) {
    var swal = $window.swal;
    return {
      swal: function (arg1, arg2, arg3) {
        $timeout(function () {
          if (typeof(arg2) === 'function') {
            swal(arg1, function (isConfirm) {
              $timeout(function () {
                arg2(isConfirm);
              });
            }, arg3);
          } else {
            swal(arg1, arg2, arg3);
          }
        }, 200);
      },
      success: function (title, message) {
        $timeout(function () {
          swal(title, message, 'success');
        }, 200);
      },
      error: function (title, message) {
        $timeout(function () {
          swal(title, message, 'error');
        }, 200);
      },
      warning: function (title, message) {
        $timeout(function () {
          swal(title, message, 'warning');
        }, 200);
      },
      info: function (title, message) {
        $timeout(function () {
          swal(title, message, 'info');
        }, 200);
      }

    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name webappApp.CommonService
 * @description
 * # CommonService 公共服务
 * 此service中，放置其它服务可能用到一些公用方法
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('CommonService', ["config", "$rootScope", "$state", "SweetAlert", "$stateParams", function (config, $rootScope, $state, SweetAlert, $stateParams) {
        var self           = this;
        // 设置最大的尝试次数
        var UNIQUE_RETRIES = 9999;
        // 种子
        var ALPHABET       = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        // 生成的id长度
        var ID_LENGTH      = 8;
        // 所有的ID
        self.previous      = [];
        self.states        = []; // 历史路由信息
        self.state         = {}; // 路由信息
        self.isBack        = false; // 是否点击了后退按钮

        /**
         * 监听路由状态发生变化, 并进行存储
         *  @param event 监听到的事件
         *  @param to 跳转到的地址
         *  @param toParams 跳转到新地址时带的参数
         *  @param from 从哪个地址跳转过来的
         *  @param fromParam 跳转前的参数
         *  @author panjie
         *  https://github.com/angular-ui/ui-router/wiki/Quick-Reference#events-1
         */
        $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
            var state        = {};
            state.event      = event;
            state.to         = to;
            state.toParams   = toParams;
            state.from       = from;
            state.fromParams = fromParams;
            // 如果用户并不是点击的返回按钮，则将状态值push到数组中
            if (!self.isBack) {
                // 最多支持后退50步
                if (self.states.length > 50) {
                    self.states.splice(0, 1);
                }
                self.states.push(state);
            } else {
                self.isBack = false;
            }
            self.state = state;
        });

        self.getStates = function () {
            return self.states;
        };
        /**
         * 获取当前的路由地址信息
         * @returns {{}|*}
         */
        self.getState = function () {
            return self.state;
        };

        /**
         * 操作成功后进行跳转
         * @param title 标题
         * @param description 描述信息
         * @param state {function | undefined} 传入函数，则进行回调。否则跳转到上一跳的地址
         * @author panjie
         * https://limonte.github.io/sweetalert2/
         * https://github.com/angular-ui/ui-router/wiki/Quick-Reference#state-1
         */
        self.success = function (title, description, state) {
            if (typeof(title) === 'undefined') {
                title = '操作成功';
            }
            if (typeof(description) === 'undefined') {
                description = '点击返回上一操作界面';
            }

            SweetAlert.swal({
                title: title,
                text: description,
                type: 'success'
            }, function () {
                if (typeof(state) === 'undefined') {
                    self.back();
                } else if (typeof(state) === 'function') {
                    state();
                }
            });
        };

        // 发生错误
        self.error = function (title, message, callback) {
            if (typeof(title) === 'undefined') {
                title = '发生错误';
            }
            if (typeof(message) === 'undefined') {
                message = '';
            }
            SweetAlert.swal({
                title: title,
                text: message
            }, function () {
                if (callback) {
                    callback();
                }
            });
        };

        // 返回上一个链接
        self.back = function () {
            if (self.showBack() === true) {
                self.states.pop();
                var state   = self.states[self.states.length - 1];
                self.isBack = true;
                $state.transitionTo(state.to.name, state.toParams);
            }
        };

        /**
         * 是否显示回退按钮
         * @return {[type]} [description]
         * @author：panjie
         */
        self.showBack = function () {
            if (self.states.length > 1) {
                return true;
            } else {
                return false;
            }
        };

        // 带有参数返回
        self.backWithParams = function (params) {
            var state   = self.states.pop();
            self.isBack = true;
            $state.transitionTo(state.from.name, params);
        };

        // 删除当前状态，使得后退或调用success时，忽略本状态
        self.deleteCurrentState = function () {
            self.states.pop();
        };

        // 生成一个新ID
        var generate = function () {
            var id = '';
            for (var i = 0; i < ID_LENGTH; i++) {
                id += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
            }
            return id;
        };

        // 获取一个唯一的新ID
        self.getUniqueId = function () {
            var retries = 0;
            var id;
            while (!id && retries < UNIQUE_RETRIES) {
                id = generate();
                if (self.previous.indexOf(id) !== -1) {
                    id = null;
                    retries++;
                }
            }
            self.previous.push(id);
            return id;
        };

        /**
         * 判断变量是否是无效的
         * @param value 传入变量
         * @returns {boolean} true:无效 false:有效
         * panjie
         */
        self.isValid = function (value) {
            return !value;
        };

        /**
         * 列表转化为二级树
         * @param lists 列表
         * @param parentObjectName 父对象的名称 用于确定父子关系
         * @param childrenName 子对象的名称 用于将子对象集输出到父对象上
         * @returns {Array} 二级树
         */
        self.listToTree = function (lists, parentObjectName, childrenName) {
            // 初始化
            var list, roots = [],
                sons        = [];
            if (self.isValid(childrenName)) {
                childrenName = '_children';
            }
            // 循环遍历，以得到父对象和子对象两个子集。
            for (var i = 0; i < lists.length; i++) {
                list             = lists[i];
                var parentObject = list[parentObjectName];
                // 存在父级，则说明为子级
                if (!self.isValid(parentObject)) {
                    if (self.isValid(sons[parentObject.id])) {
                        sons[parentObject.id] = [];
                    }
                    sons[parentObject.id].push(list);

                } else {
                    list[childrenName] = [];
                    roots.push(list);
                }
            }

            // 将子集放到父对象的属性上
            angular.forEach(roots, function (value, key) {
                var son                  = sons[value.id];
                roots[key][childrenName] = son;
            });

            return roots;
        };


        // 获取cookies过期时间
        self.getCookiesExpireDate = function () {
            var now = new Date();
            now.setTime(now.getTime() + config.cookiesExpiresTime);
            return now;
        };

        /**
         * 树转化为数组
         * @param tree 树
         * @param parentObjectName 父对象的字段名
         * @param childrenName 子集的对象名
         * @returns {Array}
         * @author panjie
         */
        self.treeToList = function (tree, parentObjectName, childrenName) {
            var lists          = [];
            // 必须清空，否则在指令中将出现循环渲染的错误
            var sons           = tree[childrenName];
            tree[childrenName] = [];
            lists.push(tree);
            if (!angular.equals(sons, [])) {
                angular.forEach(sons, function (value) {
                    value[parentObjectName] = tree;
                    lists                   = lists.concat(self.treeToList(value, parentObjectName, childrenName));
                });
            }
            return lists;
        };

        self.listTreeToList = function (listTree, parentObjectName, childrenName) {
            var list = [];

            angular.forEach(listTree, function (data) {
                var sonList = self.treeToList(data, parentObjectName, childrenName);
                list        = list.concat(sonList);
            });

            return list;
        };

        /**
         * 通过键值对数组进行检索
         * @param searchValue 检索值
         * @param keyName 键值
         * @param array 待检索的树组
         * @returns {number} 检索到的索引值
         * @author panjie
         */
        self.searchByIndexName = function (searchValue, keyName, array) {
            var index = -1;
            angular.forEach(array, function (v, key) {
                if (v[keyName] === searchValue[keyName]) {
                    index = key;
                }
            });

            return index;
        };

        /**
         * 点checkbox选中\反选时，将其添加\删除。
         * @param checkedObject 选中\反选的对象
         * @param lists 数组
         * @param idName 关键字
         * @author panjie
         * input:
         * checkedObject = {id:1}
         * lists = [];
         * idName = 'id'
         * output:
         * lists = [{id:1}]
         *
         * input:
         * checkedObject = {id:1}
         * lists = [{id:1}];
         * idName = 'id'
         * output:
         * lists = []
         */
        self.toggleCheckbox = function (checkedObject, lists, idName) {
            if (typeof(idName) === 'undefined') {
                idName = 'id';
            }
            var index = self.searchByIndexName(checkedObject, idName, lists);
            if (index === -1) {
                lists.push(checkedObject);
            } else {
                lists.splice(index, 1);
            }
        };

        /**
         * 将对象转化为query字符串
         * @param obj
         * @returns {string}
         * @author panjie
         * links: https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
         */
        self.querySerialize = function (obj) {
            var str = [];
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    if (typeof(obj[p]) !== 'undefined') {
                        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                    }
                }
            }
            return str.join('&');
        };
        /**
         * 获取项目根URL
         * @return   {string}
         * @author 梦云智 http://www.mengyunzhi.com
         * @DateTime 2017-11-12T16:01:40+0800
         * panjie
         */
        self.getBashUrl = function () {
            return config.apiUrl;
        };

        /**
         * 日期转换为时间戳
         * @param date 日期 2017-06-05
         * @param connector 连接符 -
         * @author panjie
         * 参考：https://stackoverflow.com/questions/9873197/convert-date-to-timestamp-in-javascript
         */
        self.dateToTimestamp = function (date, connector) {
            if (!connector) {
                connector = '-';
            }
            if (date) {
                date        = date.split(connector);
                var newDate = date[0] + "/" + date[1] + "/" + date[2];
                return new Date(newDate).getTime();
            }
        };

        /**
         * 时间戳转化为日期
         * @param timestamp  时间戳 1467734400000
         * @param connector  连接符号 -
         * @returns {string} 返回日期 2016-06-07
         * @author panjie
         * 在不足10月的月份前加0，参考：https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
         */
        self.timestampToDate = function (timestamp, connector) {
            if (!connector) {
                connector = '-';
            }
            var newDate = new Date();
            newDate.setTime(timestamp);
            var date = newDate.getFullYear() + connector + newDate.getMonth() + connector + newDate.getDay();
            return date;
        };

        // 重写警告信息，可以传慈祥title
        self.warningWithTitleAndTextAndConfirmButtonTextAndCancelButtonText = function (title, text, confirmButtonText, cancelButtonText, callback) {
            self.warning(callback, title, text, confirmButtonText, cancelButtonText);
        };

        /**
         * @author chuhang
         * 当用户删除消息时，用于提示用户——是否确认删除
         * */
        self.warning = function (callback, title, text, confirmButtonText, cancelButtonText) {
            if (typeof(title) === 'undefined') {
                title = '该操作不可逆，您确认要继续吗?';
            }
            if (typeof(text) === 'undefined') {
                text = '';
            }
            if (typeof(confirmButtonText) === 'undefined') {
                confirmButtonText = '确认';
            }
            if (typeof(cancelButtonText) === 'undefined') {
                cancelButtonText = '返回';
            }
            SweetAlert.swal({
                    title: title,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: confirmButtonText,
                    cancelButtonText: cancelButtonText,
                    closeOnConfirm: false,
                    closeOnCancel: false,
                    text: text
                },
                function (isConfirm) {
                    if (isConfirm) {
                        callback(
                            function success(type, title, message, callback) {
                                if (!type) {
                                    type = 'success';
                                }
                                if (!title) {
                                    title = '操作成功';
                                }
                                if (!message) {
                                    message = '';
                                }
                                //提示用户，删除成功
                                SweetAlert.swal({title: title, text: message, type: type}, function () {
                                    if (callback) {
                                        callback();
                                    }
                                });
                            },
                            function error(typeOrResponse, title, message, callback) {
                                var type;
                                if (typeOrResponse && typeOrResponse.status) {
                                    title   = typeOrResponse.data.message;
                                    type    = 'error';
                                    message = typeOrResponse.config.method + ':' + typeOrResponse.data.path + '. ' + typeOrResponse.data.exception + '->' + typeOrResponse.data.error + '. ' + typeOrResponse.status;
                                } else {
                                    if (!type) {
                                        type = 'error';
                                    }
                                    if (!title) {
                                        title = '操作失败';
                                    }
                                    if (!message) {
                                        message = '';
                                    }
                                }

                                //提示用户，删除失败
                                SweetAlert.swal({title: title, text: message, type: type}, function () {
                                    if (callback) {
                                        callback();
                                    }
                                });
                            });
                    } else {
                        SweetAlert.swal('操作已取消', '', 'error');
                    }
                });
        };

        // 深度clone一个对象
        self.clone = function (myObj) {
            if (typeof(myObj) !== 'object' || myObj === null) {
                return myObj;
            }
            var newObj = new Object({});
            for (var i = 0; i < myObj.length; i++) {
                newObj[i] = self.clone(myObj[i]);
            }
            return newObj;
        };

        // 初始化分页数据
        self.initPageData = function (scope) {
            scope.data = {
                content: [],
                totalPages: 0,
                totalElements: 0,
                first: true,
                last: true,
                size: $stateParams.size,
                number: $stateParams.page,
                numberOfElements: 0,
                sort: null
            };
        };

        // 增加请选择，并依据model返回，该model在lists中依据ID判断出的对象
        self.addPleaseChoose = function (lists, model) {
            var dataObject = {
                'id': 0,
                'name': '请选择',
                'pinyin': 'qingxuanze'
            };

            lists.unshift(dataObject);
            var index = 0;

            if (model && (model.id || model.id === 0)) {
                index = self.searchByIndexName(model, 'id', lists);
            }
            index = index === -1 ? 0 : index;
            return lists[index];
        };

        /**
         * 由某个数组中 筛选中被选中的元素，组成新的数组并返回
         * @param    {array}                 lists 原数组
         * @param    {string}                 key   健值 默认为 _checked
         * @return   {array}                       选中元素组成的数组
         * @author 梦云智 http://www.mengyunzhi.com
         * @DateTime 2017-10-17T15:05:18+0800
         */
        self.getCheckedElementsByListsAndKey = function (lists, key) {
            if (typeof(key) === 'undefined') {
                key = '_checked';
            }

            var tempList = [];
            angular.forEach(lists, function (list) {
                if (typeof(list[key]) !== 'undefined' && list[key] === true) {
                    tempList.push(list);
                }
            });
            return tempList;
        };

        // 首字母大写
        self.capitalizeFirstLetter = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        String.prototype.capitalizeFirstLetter = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        // 提醒用户
        self.setMessage = function (title, message) {
            SweetAlert.swal({
                title: title,
                text: message
            });
        };

        /**
         * 初始化控制器的分页信息
         * @param controller 控制器
         * @param $scope
         * panjie
         */
        self.initControllerPage = function (controller, $scope) {
            // 点击分页时加载数据
            controller.reloadByPage = function (page) {
                if (typeof(page) !== 'undefined') {
                    $scope.params.page = page;
                }
                controller.reload();
            };

            // 点击每页大小加载数据
            controller.reloadBySize = function (size) {
                if (typeof(size) !== 'undefined') {
                    $scope.params.size = config.size = size;
                }
                controller.reload();
            };

            // 生成查询参数
            controller.generateQueryParams = function () {
                return $scope.params;
            };

            // 重新加载数据
            controller.reload = function () {
                $state.transitionTo($state.current, $scope.params, {
                    reload: true, inherit: false, notify: true
                });
            };

            // 初始化查询参数信息
            controller.initScopeParams = function () {
                return $stateParams;
            };

            $scope.reloadByPage = controller.reloadByPage;
            $scope.reloadBySize = controller.reloadBySize;
            $scope.reload       = controller.reload;
        };

        /**
         * http请求发生错后的处理方式
         * @param  {[type]} response 响应
         * @return {[type]}          [description]
         */
        self.httpError = function(response) {
            if (response.sataus !== 401) {
                self.error('发生错误', '错误代码：' + response.status);
            }
            console.log(response);
        };

        return {
            getUniqueId: self.getUniqueId,
            setEChartsHeightAndWidth: self.setEChartsHeightAndWidth,
            listToTree: self.listToTree,
            isValid: self.isValid,
            treeToList: self.treeToList,
            getBashUrl: self.getBashUrl,
            searchByIndexName: self.searchByIndexName,
            querySerialize: self.querySerialize,
            toggleCheckbox: self.toggleCheckbox,
            getState: self.getState,
            getCookiesExpireDate: self.getCookiesExpireDate,
            success: self.success,
            timestampToDate: self.timestampToDate,
            dateToTimestamp: self.dateToTimestamp,
            warning: self.warning,
            warningWithTitleAndTextAndConfirmButtonTextAndCancelButtonText: self.warningWithTitleAndTextAndConfirmButtonTextAndCancelButtonText,
            back: self.back,
            error: self.error,
            getStates: self.getStates,
            clone: self.clone,
            initPageData: self.initPageData,
            listTreeToList: self.listTreeToList,
            addPleaseChoose: self.addPleaseChoose,
            getCheckedElementsByListsAndKey: self.getCheckedElementsByListsAndKey,
            isBack: self.isBack,
            deleteCurrentState: self.deleteCurrentState,
            capitalizeFirstLetter: self.capitalizeFirstLetter,
            showBack: self.showBack,
            setMessage: self.setMessage,
            initControllerPage: self.initControllerPage,
            httpError: self.httpError
        };
    }]);

'use strict';

/**
 * @ngdoc service
 * @name webappApp.RoleService
 * @description
 * # RoleService
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('BookService', ["$http", "CommonService", "UserService", "$state", function ($http, CommonService, UserService, $state) {
        var self = this;

        self.findTop4ByOrderByCreateTimeDesc = function (callback) {
            // 调用$http获取模拟数据
            $http.get('/Book/findTop4ByOrderByCreateTimeDesc').then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        self.findTop4ByOrderByClicks = function (callback) {
            // 调用$http获取模拟数据
            $http.get('/Book/findTop4ByOrderByClicks').then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };
        
        self.getCategorys = function (callback) {
            $http.get('/Category/getAll').then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        self.findBooksByCategoryId = function (categoryId, callback) {
            // 调用$http获取模拟数据
            $http.get('/Book/findBooksByCategoryId/' + categoryId).then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        self.getAll = function (callback) {
            $http.get('/Book/getAll').then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        self.get = function (id, callback) {
            // 调用$http获取模拟数据
            $http.get('/Book/' + id).then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        self.getShoppingCart = function (callback) {
            // 调用$http获取模拟数据
            $http.get('/ShoppingCart/').then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        self.addToCart = function(postData) {
            UserService.checkUserIsLogin(function (data) {
                if (data === false) {
                    $state.go('login');
                } else {
                    $http.post('/ShoppingCart/', postData)
                        .then(function success(response){
                            console.log(response);
                        }, function error(response){
                            console.log(response);
                        });
                }
            });
        };

        self.generateIndent = function (data, callback) {
            var url = '/Indent/';
            $http.post(url, data)
                .then(function success(response){
                    if (callback) {callback(response.data);}
                }, function error(response){
                    CommonService.httpError(response);
                });
        };

        self.getBySpecification = function (params, callback) {
            $http.get('/Book/getBySpecification', {params: params}).then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        return {
            findTop4ByOrderByCreateTimeDesc: self.findTop4ByOrderByCreateTimeDesc,
            findTop4ByOrderByClicks: self.findTop4ByOrderByClicks,
            getCategorys: self.getCategorys,
            findBooksByCategoryId: self.findBooksByCategoryId,
            getAll: self.getAll,
            get: self.get,
            getShoppingCart: self.getShoppingCart,
            addToCart: self.addToCart,
            generateIndent: self.generateIndent,
            getBySpecification: self.getBySpecification
        };
    }]);

'use strict';

/**
 * @ngdoc directive
 * @name webappApp.directive:yunzhiSideNavigation
 * @description
 * # yunzhiSideNavigation
 */
angular.module('webappApp')
  .directive('yunzhiSideNavigation', ["WebAppMenuService", "$", function (WebAppMenuService, $) {
    return {
      templateUrl: 'views/directive/yunzhiSideNavigation.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        var self = this;
        WebAppMenuService.sideNavigationInit(self, scope, function() {
          // Colapse menu in mobile mode after click on element
          var menuElement = $('#' + attrs.id + ' a:not([href$="\\#"])');
          menuElement.click(function () {
            if ($(window).width() < 769) {
              $('body').toggleClass('show-sidebar');
            }
          });

          // Check if sidebar scroll is enabled
          if ($('body').hasClass('sidebar-scroll')) {
            var navigation = element.parent();
            navigation.slimScroll({
              height: '100%',
              opacity: 0.3,
              size: 0,
              wheelStep: 5,
              allowPageScroll: true
            });
          }
        });
      }
    };
  }]);


'use strict';
/**
 * HOMER - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 */

angular
.module('webappApp')
.directive('pageTitle', ['$rootScope', '$timeout', function pageTitle($rootScope, $timeout) {
	/**
	 * pageTitle - Directive for set Page title - mata title
	 */
	return {
		link: function (scope, element) {
			//listener方法参数toParams, fromState, fromParams没有用到，暂作删除
			var listener = function (event, toState) {
				// Default title
				var title = 'HOMER | AngularJS Responsive WebApp';
				// Create your own title pattern
				if (toState.data && toState.data.pageTitle) {
					title = 'HOMER | ' + toState.data.pageTitle;
					$timeout(function () {
						element.text(title);
					});
				}
				$rootScope.$on('$stateChangeStart', listener);
			};
		}
	};
}])
//方法sideNavigation里面$timeout参数没有用到，暂作删除
.directive('sideNavigation', ["$timeout", "$", function sideNavigation($timeout, $) {
	/**
	 * sideNavigation - Directive for run metsiMenu on sidebar navigation
	 */
	return {
		restrict: 'A',
		link: function (scope, element) {
			var hello = function () {
				// Call the metsiMenu plugin and plug it to sidebar navigation
				element.metisMenu();

				// Colapse menu in mobile mode after click on element
				var menuElement = $('#side-menu a:not([href$="\\#"])');
				menuElement.click(function () {

					if ($(window).width() < 769) {
						$("body").toggleClass("show-sidebar");
					}
				});

				// Check if sidebar scroll is enabled
				if ($('body').hasClass('sidebar-scroll')) {
					var navigation = element.parent();
					navigation.slimScroll({
						height: '100%',
						opacity: 0.3,
						size: 0,
						wheelStep: 5,
						allowPageScroll: true,
					});
				}
			};
			// todo: 解决渲染顺序，防止菜单抖动。
			$timeout(hello, 0);

		}
	};
}])
//方法minimalizaMenu里面$rootScope参数没有用到，暂作删除
.directive('minimalizaMenu', [function minimalizaMenu($) {
	/**
	 * minimalizaSidebar - Directive for minimalize sidebar
	 */
	return {
		restrict: 'EA',
		template: '<div class="header-link hide-menu" ng-click="minimalize()"><i class="fa fa-bars"></i></div>',
		//controller里面$element参数没有用到，暂作删除
		controller: ["$scope", function ($scope) {
			$scope.minimalize = function () {
				if ($(window).width() < 769) {
					$("body").toggleClass("show-sidebar");
				} else {
					$("body").toggleClass("hide-sidebar");
				}
			};
		}]
	};
}])
.directive('sparkline', [function sparkline() {
	/**
	 * sparkline - Directive for Sparkline chart
	 */
	return {
		restrict: 'A',
		scope: {
			sparkData: '=',
			sparkOptions: '=',
		},
		//方法link里面attrs参数没有用到，暂作删除
		link: function (scope) {
			scope.$watch(scope.sparkData, function () {
				render();
			});
			scope.$watch(scope.sparkOptions, function () {
				render();
			});
			var render = function () {
				//$(element).sparkline(scope.sparkData, scope.sparkOptions);
			};
		}
	};
}])
.directive('icheck', ['$timeout', function icheck($timeout, $) {
	/**
	 * icheck - Directive for custom checkbox icheck
	 */
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function ($scope, element, $attrs, ngModel) {
			return $timeout(function () {
				var value;
				value = $attrs.value;
				//方法里面newValue参数没有用到，暂作删除
				$scope.$watch($attrs.ngModel, function () {
					//$(element).iCheck('update');
				});

				return $(element).iCheck({
					checkboxClass: 'icheckbox_square-green',
					radioClass: 'iradio_square-green'

				}).on('ifChanged', function (event) {
					if ($(element).attr('type') === 'checkbox' && $attrs.ngModel) {
						$scope.$apply(function () {
							return ngModel.$setViewValue(event.target.checked);
						});
					}
					if ($(element).attr('type') === 'radio' && $attrs.ngModel) {
						return $scope.$apply(function () {
							return ngModel.$setViewValue(value);
						});
					}
				});
			});
		}
	};
}])
.directive('panelTools', ['$timeout', function panelTools($timeout) {
	/**
	 * panelTools - Directive for panel tools elements in right corner of panel
	 */
	return {
		restrict: 'A',
		scope: true,
		templateUrl: 'views/common/panel_tools.html',
		controller: ["$scope", "$element", function ($scope, $element) {
			// Function for collapse ibox
			$scope.showhide = function () {
				var hpanel = $element.closest('div.hpanel');
				var icon = $element.find('i:first');
				var body = hpanel.find('div.panel-body');
				var footer = hpanel.find('div.panel-footer');
				body.slideToggle(300);
				footer.slideToggle(200);
				// Toggle icon from up to down
				icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
				hpanel.toggleClass('').toggleClass('panel-collapse');
				$timeout(function () {
					hpanel.resize();
					hpanel.find('[id^=map-]').resize();
				}, 50);
			};

			// Function for close ibox
			$scope.closebox = function () {
				var hpanel = $element.closest('div.hpanel');
				hpanel.remove();
			};

		}]
	};
}])
.directive('panelToolsFullscreen', ['$timeout', '$', function panelToolsFullscreen($timeout, $) {
	/**
	 * panelToolsFullscreen - Directive for panel tools elements in right corner of panel with fullscreen option
	 */
	return {
		restrict: 'A',
		scope: true,
		templateUrl: 'views/common/panel_tools_fullscreen.html',
		controller: ["$scope", "$element", function ($scope, $element) {
			// Function for collapse ibox
			$scope.showhide = function () {
				var hpanel = $element.closest('div.hpanel');
				var icon = $element.find('i:first');
				var body = hpanel.find('div.panel-body');
				var footer = hpanel.find('div.panel-footer');
				body.slideToggle(300);
				footer.slideToggle(200);
				// Toggle icon from up to down
				icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
				hpanel.toggleClass('').toggleClass('panel-collapse');
				$timeout(function () {
					hpanel.resize();
					hpanel.find('[id^=map-]').resize();
				}, 50);
			};

			// Function for close ibox
			$scope.closebox = function () {
				var hpanel = $element.closest('div.hpanel');
				hpanel.remove();
				if ($('body').hasClass('fullscreen-panel-mode')) {
					$('body').removeClass('fullscreen-panel-mode');
				}
			};

			// Function for fullscreen
			$scope.fullscreen = function () {
				var hpanel = $element.closest('div.hpanel');
				var icon = $element.find('i:first');
				$('body').toggleClass('fullscreen-panel-mode');
				icon.toggleClass('fa-expand').toggleClass('fa-compress');
				hpanel.toggleClass('fullscreen');
				setTimeout(function () {
					$(window).trigger('resize');
				}, 100);
			};

		}]
	};
}])
.directive('smallHeader', [function smallHeader() {
	/**
	 * smallHeader - Directive for page title panel
	 */
	return {
		restrict: 'A',
		scope: true,
		controller: ["$scope", "$element", function ($scope, $element) {
			$scope.small = function () {
				var icon = $element.find('i:first');
				var breadcrumb = $element.find('#hbreadcrumb');
				$element.toggleClass('small-header');
				breadcrumb.toggleClass('m-t-lg');
				icon.toggleClass('fa-arrow-up').toggleClass('fa-arrow-down');
			};
		}]
	};
}])
//方法animatePanel里面$state参数没有用到，暂作删除
.directive('animatePanel', ['$timeout', '$', function animatePanel($timeout, $) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {

			//Set defaul values for start animation and delay
			var startAnimation = 0;
			var delay = 0.06; // secunds
			var start = Math.abs(delay) + startAnimation;

			// Store current state where directive was start
			//currentState未使用，暂作删除
			//var currentState = $state.current.name;

			// Set default values for attrs
			if (!attrs.effect) {
				attrs.effect = 'zoomIn';
			}
			if (attrs.delay) {
				delay = attrs.delay / 10;
			} else {
				delay = 0.06;
			}
			if (!attrs.child) {
				attrs.child = '.row > div';
			} else {
				attrs.child = "." + attrs.child;
			}

			// Get all visible element and set opactiy to 0
			var panel = element.find(attrs.child);
			panel.addClass('opacity-0');

			// Count render time
			//renderTime未使用，暂作删除
			//var renderTime = panel.length * delay * 1000 + 700;

			// Wrap to $timeout to execute after ng-repeat
			$timeout(function () {

				// Get all elements and add effect class
				panel = element.find(attrs.child);
				panel.addClass('stagger').addClass('animated-panel').addClass(attrs.effect);

				var panelsCount = panel.length + 10;
				var animateTime = (panelsCount * delay * 10000) / 10;

				// Add delay for each child elements
				panel.each(function (i, elm) {
					start += delay;
					var rounded = Math.round(start * 10) / 10;
					$(elm).css('animation-delay', rounded + 's');
					// Remove opacity 0 after finish
					$(elm).removeClass('opacity-0');
				});

				// Clear animation after finish
				$timeout(function () {
					$('.stagger').css('animation', '');
					$('.stagger').removeClass(attrs.effect).removeClass('animated-panel').removeClass('stagger');
					panel.resize();
				}, animateTime);

			});
		}
	};
}])
.directive('landingScrollspy', [function landingScrollspy() {
	return {
		restrict: 'A',
		//link里面attrs参数没有用到，暂作删除
		link: function (scope, element) {
			element.scrollspy({
				target: '.navbar-fixed-top',
				offset: 80
			});
		}
	};
}])
.directive('clockPicker', [function clockPicker() {
	/**
	 * clockPicker - Directive for clock picker plugin
	 */
	return {
		restrict: 'A',
		link: function (scope, element) {
			element.clockpicker();
		}
	};
}])
.directive('dateTimePicker', [function dateTimePicker() {
	return {
		require: '?ngModel',
		restrict: 'AE',
		scope: {
			pick12HourFormat: '@',
			language: '@',
			useCurrent: '@',
			location: '@'
		},
		//link里面attrs参数没有用到，暂作删除
		link: function (scope, elem) {
			elem.datetimepicker({
				pick12HourFormat: scope.pick12HourFormat,
				language: scope.language,
				useCurrent: scope.useCurrent
			});

			//Local event change
			elem.on('blur', function () {

				// For test
				//console.info('this', this);
				//console.info('scope', scope);
				//console.info('attrs', attrs);


				/*// returns moments.js format object
				 scope.dateTime = new Date(elem.data("DateTimePicker").getDate().format());
				 // Global change propagation
				 $rootScope.$broadcast("emit:dateTimePicker", {
				 location: scope.location,
				 action: 'changed',
				 dateTime: scope.dateTime,
				 example: scope.useCurrent
				 });
				 scope.$apply();*/
			});
		}
	};
}]);

'use strict';
/**
 * HOMER - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 */

angular
    .module('webappApp')
    .directive('touchSpin', [function touchSpin($) {
        return {
            restrict: 'A',
            scope: {
                spinOptions: '=',
            },
            //link方法参数attrs没有用到，暂作删除
            link: function (scope, element) {
                scope.$watch(scope.spinOptions, function(){
                    render();
                });
                var render = function () {
                    $(element).TouchSpin(scope.spinOptions);
                };
            }
        };
    }]);


/**
 * touchSpin - Directive for Bootstrap TouchSpin
 */

'use strict';

/**
 * @ngdoc service
 * @name webappApp.WebAppMenuService
 * @description
 * # WebAppMenuService
 * Service in the webappApp.
 */
angular.module('webappApp')
  .service('WebAppMenuService', ['$http', 'CommonService', function ($http, CommonService) {
    var self = this;
    // 数据初始化
    self.init = function () {
      self.all = [];
      self.menuTree = {};
      self.currentUserMenuTree = [];          // 当前用户菜单树
      self.currentMenu = {id: 0};             // 当前菜单
      self.currentUserAllowMenus = [];        // 当前用户拥有的权限
      self.currentUserAllowMenuIds = [];      // 当前用户拥有权限的ID权组
    };

    self.init();

    /**
     * 获取菜单树
     * 由于菜单树一旦确立便不会发生变生，所以进行缓存
     * @param callback
     * @author panjie
     */
    self.getMenuTree = function (callback) {
      if (angular.equals(self.menuTree, {})) {
        this.getAll(function (data) {
          // 将list结构转化为tree结构
          self.menuTree = CommonService.listToTree(data, 'parentWebAppMenu');
          callback(self.menuTree);
        });
      } else {
        callback(self.menuTree);
      }
    };

    //获取后台模拟数据
    self.getAll = function () {
      // if (self.all.length === 0) {
      //   $http.get('/WebAppMenu/').then(function success(response) {
      //     self.all = response.data;
      //     callback(self.all);
      //   });
      // } else {
      //   callback(self.all);
      // }
    };

    // 设置当前菜单 panjie
    self.setCurrentMenu = function (menu) {
      if (self.currentMenu.id === menu.id) {
        self.currentMenu = {id: 0};
      } else {
        self.currentMenu = menu;
      }
    };

    // 获取当前菜单
    self.getCurrentMenu = function (callback) {
      var state = CommonService.getState();
      if (state.to) {
        var names = state.to.name.split('.');
        var name = names.pop();
        self.getMenuByRouteName(name, callback);
      } else {
        state.to  =  {};
        state.to.name = 'main';
        self.getCurrentMenu(callback);
      }
    };

    /**
     * 通过路由名称获取对应菜单
     * @param String routeName 路由名称
     * @param callback
     * @author panjie
     */
    self.getMenuByRouteName = function (routeName, callback) {
      console.log('通过路由名称获取对应菜单');
      self.getAll(function (data) {
        var notFound = true;
        var menu;
        angular.forEach(data, function (value) {
          if (notFound && value.routeName === routeName) {
            notFound = false;
            menu = value;
          }
        });

        if (menu === undefined) {
          // 未获取到菜单，则获取首页菜单
          self.getMenuByRouteName('main', callback);
        } else {
          callback(menu);
        }
      });
    };


    // 检测是否触发了当前菜单 panjie
    self.checkIsCurrentMenu = function (menu) {
      return menu.id === self.currentMenu.id;
    };

    // 过滤掉不被允许的菜单
    var filterAllowMenus = function (tree, menus) {
      angular.forEach(tree, function (menu, key) {
        if (menus.indexOf(menu.id) === -1) {
          tree[key].show = false;
        } else if (tree._children && tree._children.length > 0) {
          filterAllowMenus(menu, menus);
        }
      });
    };

    // 获取当前用户对应的菜单 panjie
    self.getCurrentUserMenuTree = function (callback) {
      // 判断当前用户是否与缓存的一致
      if (self.currentUserMenuTree.length !== 0) {
        callback(self.currentUserMenuTree);
      } else {
        self.getCurrentUserAllowMenus(function(menus){
          self.currentUserMenuTree = CommonService.listToTree(menus, 'parentWebAppMenu');
          callback(self.currentUserMenuTree);
        });
      }
    };

    // 获取当前用户拥有的菜单权限ID列表 @author: panjie@yunzhiclub.com
    self.getCurrentUserAllowMenus = function (callback) {
      if (self.currentUserAllowMenus.length === 0) {
        $http.get('/User/getCurrentUserWebAppMenus/').then(function success(response) {
          angular.forEach(response.data, function (menu) {
            self.currentUserAllowMenus.push(menu);
          });
          callback(self.currentUserAllowMenus);
        });
      } else {
        callback(self.currentUserAllowMenus);
      }
    };

    /**
     * 获取菜单的路由
     * @param menu 菜单
     * @returns {string} 拼接好的路由信息
     */
    self.getRouteFromMenu = function (menu) {
      var route = '';

      // 存在上级菜单的话，则进行拼接
      if (!CommonService.isValid(menu.parentRouteWebAppMenu)) {
        route += menu.parentRouteWebAppMenu.routeName + '.';
      }

      route += menu.routeName;
      return route;
    };

    // 获取全称
    self.getFullName = function (data) {
      if (data.parentWebAppMenu) {
        return data.parentWebAppMenu.name + ' ---- ' + data.name;
      } else {
        return data.name;
      }
    };

    // 获取url
    self.getFullUrl = function (data) {
      if (data.parentRouteWebAppMenu) {
        return data.parentRouteWebAppMenu.routeName + '/' + data.routeName;
      } else {
        return data.routeName;
      }
    };

    /**
     * 检测当前用户是否拥有传入的路由信息
     * @param route String 路由字值串, 例：system.instrumentType  system
     * @param callback
     * @author panjie@yunzhiclub.com
     */
    self.checkCurrentUserIsAllowedByRoute = function (route, callback) {
      var routes = [];
      routes = route.split('.');
      if (routes.length === 0) {
        callback(false);
      } else {
        self.checkCurrentUserIsAllowedByRoutes(routes, callback);
      }
    };

    /**
     * 检测当前用户是否拥有传入的路由信息
     * @param routes Array 路由信息（数组形式） 例：[instrumentType, system] [system]
     * @param callback
     */
    self.checkCurrentUserIsAllowedByRoutes = function (routes, callback) {
      var isFinded = false;
      // 如果为空数组，则返回false
      if (routes.length > 0) {
        // 获取所有的菜单并依次进行查找
        self.getAll(function (menus) {
          var routeName = '';
          routeName = routes.pop();
          // 查找所有的菜单
          angular.forEach(menus, function (value) {
            if (!isFinded && (value.routeName === routeName)) {
              isFinded = true;
              // 找到菜单后，判断当前用户是否拥有权取
              self.checkIsAllowedByMenuId(value.id, function (state) {
                if (state) {
                  // 查看是否用户父级或子级权限（缺一不可）
                  if (routes.length > 0) {
                    self.checkCurrentUserIsAllowedByRoutes(routes, callback);
                  } else {
                    if (callback) {
                      callback(true);
                    }
                  }
                } else {
                  if (callback) {
                    callback(false);
                  }
                }
              });
            }
          });

          // 在未找到的情况下，回调给false值
          if (!isFinded && callback) {
            callback(false);
          }
        });
      } else {
        if (callback) {
          callback(false);
        }
      }
    };


    /**
     * 校验当前用户是否拥有传入的menuId权限
     * @param menuId
     * @param callback
     */
    self.checkIsAllowedByMenuId = function (menuId, callback) {
      self.getCurrentUserAllowMenus(function (menus) {
        var isFinded = false;
        angular.forEach(menus, function (value) {
          if (!isFinded && (menuId === value.id)) {
            isFinded = true;
          }
        });
        callback(isFinded);
      });
    };

    // 左侧导航数据的初始化
    self.sideNavigationInit = function(currentObject, scope, callback) {
      currentObject.init = true;       // 菜单初始化为真
      // 先获取当前菜单，然后再继续操作
      self.getCurrentMenu(function (menu) {
        currentObject.currentClickMenu = menu;

        // 当前当击的一级菜单
        currentObject.currentFirstLevelMenu = {};

        // 取WebAppMenuService中的数据
        self.getCurrentUserMenuTree(function (data) {
          scope.menus = data;
        });

        // 点击当前菜单
        scope.clicked = function (menu) {
          self.setCurrentMenu(menu);
          currentObject.currentClickMenu = menu;
        };

        // 获取路由
        scope.getRoute = function (menu) {
          return self.getRouteFromMenu(menu);
        };

        // 判断是否有子菜单
        currentObject.hasChildren = function (menu) {
          return menu._children && menu._children.length > 0;
        };

        // 检定传入的菜单是否为当前菜单
        currentObject.checkMenuIsCurrentMenu = function (menu) {
          if (currentObject.currentClickMenu && (currentObject.currentClickMenu.id === menu.id)) {
            return true;
          } else {
            return false;
          }
        };

        // 检定传入菜单是否为当前一级菜单
        currentObject.checkMenuIsCurrentFirstLevelMenu = function (menu) {
          if (currentObject.currentFirstLevelMenu.id && (currentObject.currentFirstLevelMenu.id === menu.id)) {
            return true;
          } else {
            return false;
          }
        };

        // 一级菜单是否激活菜单
        currentObject.isActive = function (menu) {
          if (currentObject.currentFirstLevelMenu.id) {
            // 存在当前的一级菜单
            if (currentObject.checkMenuIsCurrentFirstLevelMenu(menu)) {
              // 是当前一级菜单，返回真
              return true;
            } else {
              // 不是当前一级菜单，返回假
              return false;
            }
          } else if (currentObject.init && currentObject.hasChildren(menu)) {
            // 为菜单初始化，则遍历其子菜单
            var state = false;
            angular.forEach(menu._children, function (_menu) {
              if (currentObject.checkMenuIsCurrentMenu(_menu)) {
                state = true;
              }
            });
            return state;
          }
        };

        // 点击父类菜单
        currentObject.clickedParentMenu = function (menu) {
          currentObject.init = false;
          if (currentObject.checkMenuIsCurrentFirstLevelMenu(menu)) {
            currentObject.currentFirstLevelMenu = {};
          } else {
            currentObject.currentFirstLevelMenu = menu;
          }
        };

        // 绑定
        scope.hasChildren = currentObject.hasChildren;
        scope.clickedParentMenu = currentObject.clickedParentMenu;
        scope.isActive = currentObject.isActive;
        if (callback) {callback();}
      });
    };

    return {
      getMenuTree: self.getMenuTree,
      getCurrentUserMenuTree: self.getCurrentUserMenuTree,
      currentUserMenuTree: self.currentUserMenuTree,
      setCurrentMenu: self.setCurrentMenu,
      getCurrentMenu: self.getCurrentMenu,
      checkIsCurrentMenu: self.checkIsCurrentMenu,
      getRouteFromMenu: self.getRouteFromMenu,
      getAll: self.getAll,
      getFullName: self.getFullName,
      getFullUrl: self.getFullUrl,
      init: self.init,
      checkCurrentUserIsAllowedByRoute: self.checkCurrentUserIsAllowedByRoute,
      sideNavigationInit: self.sideNavigationInit
    };
  }]);

'use strict';

/**
 * @ngdoc filter
 * @name webappApp.filter:imagePath
 * @function
 * @description
 * # imagePath
 * Filter in the webappApp.
 */
angular.module('webappApp')
    .filter('imagePath', ['config', function(config) {
        return function(input) {
            if (input) {
                return config.apiUrl + '/Attachment/image/' + input;
            }
        };
    }]);

angular.module('webappApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/book.html',
    "<!-- breadcrumbs-area-start --> <div class=\"breadcrumbs-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"breadcrumbs-menu\"> <ul> <li><a ui-sref=\"main.dashboard\" ng-click=\"hideInformation()\">首页</a></li> <li><a href=\"\" class=\"active\">图书</a></li> </ul> </div> </div> </div> </div> </div> <!-- breadcrumbs-area-end --> <!-- shop-main-area-start --> <div class=\"shop-main-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-12\"> <div class=\"shop-left\"> <div class=\"section-title-5 mb-30\"> <h2>图书类别</h2> </div> <div class=\"left-menu mb-30\"> <ul> <li ng-repeat=\"data in categorys\"><a ui-sref=\"book({categoryId: data.id})\">{{data.name}}<span></span></a></li> </ul> </div> </div> </div> <div class=\"col-lg-9 col-md-9 col-sm-8 col-xs-12\"> <div class=\"section-title-5 mb-30\"> <h2>图书列表</h2> </div> <div class=\"tab-content\"> <div class=\"tab-pane active\"> <div class=\"single-shop mb-30\" ng-repeat=\"data in books\"> <div class=\"row\"> <div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-12\"> <div class=\"product-wrapper-2\"> <div class=\"product-img\"> <a ui-sref=\"bookDetail({id: data.id})\"> <img class=\"image\" ng-src=\"{{data.attachment.saveName | imagePath}}\" alt=\"{{_image.name}}\"> </a> </div> </div> </div> <div class=\"col-lg-8 col-md-8 col-sm-8 col-xs-12\"> <div class=\"product-wrapper-content\"> <div class=\"product-details\"> <h4><a ui-sref=\"bookDetail({id: data.id})\">{{data.name}}</a></h4> <div class=\"product-price\"> <ul> <li>￥{{data.price}}</li> <li class=\"old-price\">￥{{data.originalPrice}}</li> </ul> </div> <p>{{data.briefIntroduction}} </p> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"\" title=\"加入购物车\" ng-click=\"addToCart(data.id)\"><i class=\"fa fa-shopping-cart\"></i>加入购物车</a> </div> <div class=\"add-to-link\"> <ul> <li><a ui-sref=\"bookDetail({id: data.id})\" title=\"产品详情\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> </div> </div> </div> </div> <!--</div>--> <!--&lt;!&ndash; pagination-area-start &ndash;&gt;--> <!--<div class=\"pagination-area mt-50\">--> <!--<div class=\"list-page-2\">--> <!--<p>Items 1-9 of 11</p>--> <!--</div>--> <!--<div class=\"page-number\">--> <!--<ul>--> <!--<li><a href=\"#\" class=\"active\">1</a></li>--> <!--<li><a href=\"#\">2</a></li>--> <!--<li><a href=\"#\">3</a></li>--> <!--<li><a href=\"#\">4</a></li>--> <!--<li><a href=\"#\" class=\"angle\"><i class=\"fa fa-angle-right\"></i></a></li>--> <!--</ul>--> <!--</div>--> <!--</div>--> <!--&lt;!&ndash; pagination-area-end &ndash;&gt;--> </div> </div> </div> </div> <!-- shop-main-area-end --></div>"
  );


  $templateCache.put('views/bookdetail.html',
    "<div class=\"breadcrumbs-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"breadcrumbs-menu\"> <ul> <li><a ui-sref=\"main.dashboard\" ng-click=\"hideInformation()\">首页</a></li> <li><a href=\"\" class=\"active\">图书详情</a></li> </ul> </div> </div> </div> </div> </div> <!-- breadcrumbs-area-end --> <!-- product-main-area-start --> <div class=\"product-main-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-9 col-md-9 col-sm-8 col-xs-12\"> <!-- product-main-area-start --> <div class=\"product-main-area\"> <div class=\"row\"> <div class=\"col-lg-5 col-md-5 col-sm-6 col-xs-12\"> <div class=\"flexslider\"> <ul class=\"slides\"> <a ui-sref=\"bookDetail({id: data.id})\"> <img class=\"image\" ng-src=\"{{data.attachment.saveName | imagePath}}\" alt=\"{{_image.name}}\"> </a> </ul> </div> </div> <div class=\"col-lg-7 col-md-7 col-sm-6 col-xs-12\"> <div class=\"product-info-main\"> <div class=\"page-title\"> <h1>{{data.name}}</h1> </div> <div class=\"product-info-price\"> <div class=\"price-final\"> <span>￥{{data.price}}</span> <span class=\"old-price\">￥40.00</span> </div> </div> <div class=\"product-add-form\"> <form action=\"#\"> <div class=\"quality-button\"> <input class=\"qty\" type=\"number\" ng-value=\"quantity\" ng-model=\"quantity\"> </div> <a ui-sref=\"bookDetail\" title=\"加入购物车\" ng-click=\"addToCart(data.id)\"><i class=\"fa fa-shopping-cart\"></i>加入购物车</a> </form> </div> <div class=\"product-social-links\"> <div class=\"product-addto-links-text\"> <p>{{data.briefIntroduction}}</p> </div> </div> </div> </div> </div> </div> </div> <div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-12\"> <div class=\"shop-left\"> <div class=\"left-title mb-20\"> <h4>人气图书</h4> </div> <div class=\"product-total-2\" ng-repeat=\"data in relateBooks\"> <div class=\"single-most-product bd mb-18\"> <div class=\"most-product-img\"> <a ui-sref=\"bookDetail({id: data.id})\"> <img class=\"image\" ng-src=\"{{data.attachment.saveName | imagePath}}\" alt=\"{{_image.name}}\"> </a> </div> <div class=\"most-product-content\"> <h4><a ui-sref=\"bookDetail({id: data.id})\">{{data.name}}</a></h4> <div class=\"product-price\"> <ul> <li>￥{{data.price}}</li> <li class=\"old-price\">￥33.00</li> </ul> </div> </div> </div> </div> </div> </div> </div> </div> </div>"
  );


  $templateCache.put('views/cart.html',
    "<!-- entry-header-area-start --> <div class=\"breadcrumbs-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"breadcrumbs-menu\"> <ul> <li><a ui-sref=\"main.dashboard\" ng-click=\"hideInformation()\">首页</a></li> <li><a href=\"\" class=\"active\">购物车</a></li> </ul> </div> </div> </div> </div> </div> <div class=\"entry-header-area\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"entry-header-title\"> <h2>购物车</h2> </div> </div> </div> </div> </div> <!-- entry-header-area-end --> <!-- cart-main-area-start --> <div class=\"cart-main-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <form action=\"#\"> <div class=\"table-content table-responsive\"> <table> <thead> <tr> <th class=\"product-thumbnail\">封面</th> <th class=\"product-name\">书名</th> <th class=\"product-price\">价钱</th> <th class=\"product-quantity\">数量</th> <th class=\"product-subtotal\">总价</th> <th class=\"product-remove\">删除</th> </tr> </thead> <tbody> <tr ng-repeat=\"data in books\" ng-hide=\"data.hide\"> <td class=\"product-thumbnail\"> <img class=\"image\" ng-src=\"{{data.attachment.saveName | imagePath}}\" alt=\"{{_image.name}}\" style=\"width: 150px; height: 200px\">  </td> <td class=\"product-name\">{{data.name}}</td> <td class=\"product-price\"><span class=\"amount\">￥{{data.price}}</span></td> <td class=\"product-quantity\"><input type=\"number\" ng-model=\"treeMap[data.id]\" ng-value=\"treeMap[data.id]\"></td> <td class=\"product-subtotal\">￥{{treeMap[data.id]*data.price}}</td> <td class=\"product-remove\"><a ng-click=\"delete(data)\" href=\"\"><i class=\"fa fa-times\"></i></a></td> </tr> </tbody> </table> </div> </form> </div> </div> <div class=\"row\"> <div class=\"col-lg-8 col-md-8 col-sm-6 col-xs-12\"> <div class=\"buttons-cart mb-30\"> <ul> <li><a href=\"\" ng-click=\"updateShoppingCart()\">更新购物车</a></li> <li><a href=\"#\">继续购物</a></li> </ul> </div> </div> <div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12\"> <div class=\"cart_totals\"> <h2>购物车总价</h2> <br> <table> <tr class=\"order-total\"> <td> <strong> <span class=\"amount\">￥{{totalPrice}}</span> </strong> </td> </tr>  </table> <br> <div class=\"wc-proceed-to-checkout\"> <a href=\"\" ng-click=\"checkout()\">继续结算</a> </div> </div> </div> </div> </div> </div>"
  );


  $templateCache.put('views/checkout.html',
    "<div class=\"breadcrumbs-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"breadcrumbs-menu\"> <ul> <li><a ui-sref=\"main.dashboard\" ng-click=\"hideInformation()\">首页</a></li> <li><a href=\"\" class=\"active\">结算</a></li> </ul> </div> </div> </div> </div> </div> <div class=\"checkout-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <form action=\"#\"> <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\"> <div class=\"checkbox-form\"> <h3>订单详情</h3> <div class=\"row\"> <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\"> <div class=\"checkout-form-list\"> <label>用户名<span class=\"required\">*</span></label> <input type=\"text\" placeholder=\"\" ng-model=\"data.username\"> </div> </div> <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\"> <div class=\"checkout-form-list\"> <label>电话<span class=\"required\">*</span></label> <input type=\"text\" placeholder=\"\" ng-model=\"data.phone\"> </div> </div> <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\"> <div class=\"checkout-form-list\"> <label>收货地址<span class=\"required\">*</span></label> <input type=\"text\" placeholder=\"收货地址..\" ng-model=\"data.address\"> </div> </div> </div> <div class=\"order-notes\"> <div class=\"checkout-form-list\"> <label>订单备注</label> <textarea ng-model=\"data.remark\" placeholder=\"备注信息..\" rows=\"10\" cols=\"30\" id=\"checkout-mess\"></textarea> </div> </div> </div> </div> <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\"> <div class=\"your-order\"> <h3>您的订单</h3> <div class=\"your-order-table table-responsive\"> <table> <thead> <tr> <th class=\"product-name\">产品</th> <th class=\"product-total\">总价</th> </tr> </thead> <tbody> <tr class=\"cart_item\" ng-repeat=\"data in books\"> <td class=\"product-name\"> {{data.name}} <strong class=\"product-quantity\"> × {{treeMap[data.id]}}</strong> </td> <td class=\"product-total\"> <span class=\"amount\">￥{{data.price}}</span> </td> </tr> </tbody> <tfoot> <tr class=\"order-total\"> <th>订单金额</th> <td><strong><span class=\"amount\">￥{{totalPrice}}</span></strong> </td> </tr> </tfoot> </table> </div> <div class=\"payment-method\"> <div class=\"order-button-payment\"> <input type=\"submit\" ng-click=\"generateIndent()\" value=\"付款\"> </div> </div> </div> </div> </form> </div> </div> </div>"
  );


  $templateCache.put('views/common/banner.html',
    "<!-- banner-area-start --> <div class=\"banner-area banner-res-large ptb-35\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-12\"> <div class=\"single-banner\"> <div class=\"banner-img\"> <a href=\"#\"><img src=\"images/banner/1.png\" alt=\"banner\"></a> </div> <div class=\"banner-text\"> <h4>免运费</h4> <p>对于订单金额超过50元的商品</p> </div> </div> </div> <div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-12\"> <div class=\"single-banner\"> <div class=\"banner-img\"> <a href=\"#\"><img src=\"images/banner/2.png\" alt=\"banner\"></a> </div> <div class=\"banner-text\"> <h4>退款保证</h4> <p>100%的退款保证</p> </div> </div> </div> <div class=\"col-lg-3 col-md-3 hidden-sm col-xs-12\"> <div class=\"single-banner\"> <div class=\"banner-img\"> <a href=\"#\"><img src=\"images/banner/3.png\" alt=\"banner\"></a> </div> <div class=\"banner-text\"> <h4>放心购物</h4> <p>所有商品均支持货到付款</p> </div> </div> </div> <div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-12\"> <div class=\"single-banner mrg-none-xs\"> <div class=\"banner-img\"> <a href=\"#\"><img src=\"images/banner/4.png\" alt=\"banner\"></a> </div> <div class=\"banner-text\"> <h4>帮助与服务</h4> <p>电话热线: 022-1234567</p> </div> </div> </div> </div> </div> </div> <!-- banner-area-end -->"
  );


  $templateCache.put('views/common/content.html',
    "<!-- Header --> <div id=\"header\" ng-include=\"'views/common/header.html'\"></div> <!-- Navigation --> <aside id=\"menu\" ng-include=\"'views/common/navigation.html'\"></aside> <!-- Main Wrapper --> <div id=\"wrapper\"> <div small-header class=\"normalheader transition\"> <div class=\"hpanel\" tour-step order=\"1\" title=\"Page header\" content=\"Place your page title and breadcrumb. Select small or large header or give the user choice to change the size.\" placement=\"bottom\"> <div class=\"panel-body\"> <a ng-click=\"small()\" href=\"\"> <div class=\"clip-header\"> <i class=\"fa fa-arrow-up\"></i> </div> </a> <div id=\"hbreadcrumb\" class=\"pull-right m-t-lg\"> <ol class=\"hbreadcrumb breadcrumb\"> <li><a ui-sref=\"dashboard\">首页</a></li> <li ng-repeat=\"state in $state.$current.path\" ng-switch=\"$last || !!state.abstract\" ng-class=\"{active: $last}\"> <a ng-switch-when=\"false\" href=\"#{{state.url.format($stateParams)}}\">{{state.data.pageTitle}}</a> <span ng-switch-when=\"true\">{{state.data.pageTitle}}</span> </li> </ol> </div> <div class=\"row\"> <div class=\"col-md-10\"> <h2 class=\"font-light m-b-xs\"> {{ $state.current.data.pageTitle }} </h2> <small>{{ $state.current.data.pageDesc }}</small> </div> </div> </div> </div> </div> <div class=\"content\" style=\"background:white\"> <div ui-view></div> </div> <!-- Footer --> <footer class=\"footer\" ng-include=\"'views/common/footer.html'\"></footer> </div>"
  );


  $templateCache.put('views/common/footer.html',
    "<!-- testimonial-area-end --><!-- footer-area-start --> <footer> <!-- footer-top-start --> <div class=\"footer-top\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"footer-top-menu bb-2\"> <nav> <ul> <li><a href=\"#\">首页</a></li> <li><a href=\"#\">联系我们</a></li> <li><a href=\"https://chuhang123.github.io/\">博客</a></li> </ul> </nav> </div> </div> </div> </div> </div> <!-- footer-top-start --> <!-- footer-bottom-start --> <div class=\"footer-bottom\"> <div class=\"container\"> <div class=\"row bt-2\"> <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\"> <div class=\"copy-right-area\"> <p>Power by <a href=\"https://chuhang123.github.io/\">chuhang</a> Theme ©<a href=\"http://www.bootstrapmb.com/\">Koparion</a></p> </div> </div> <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\"> <div class=\"payment-img text-right\"> <a href=\"#\"><img src=\"images/1.png\" alt=\"payment\"></a> </div> </div> </div> </div> </div> <!-- footer-bottom-end --> </footer>"
  );


  $templateCache.put('views/common/header.html',
    "<header> <!-- header-top-area-start --> <div class=\"header-top-area\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\"> <div class=\"account-area text-left\"> <ul> <li>您好，欢迎光临三人行图书网店！</li> </ul> </div> </div> <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\"> <div class=\"account-area text-right\"> <ul> <ul ng-show=\"isLogin\"> <li><a ui-sref=\"checkout\">结算</a></li> <li><a ui-sref=\"\" ng-click=\"logout()\">注销</a></li> </ul> <ul ng-hide=\"isLogin\"> <li><a ui-sref=\"registration\">注册</a></li> <li><a ui-sref=\"login\">登录</a></li> </ul> </ul> </div> </div> </div> </div> </div> <!-- header-top-area-end --> <!-- header-mid-area-start --> <div class=\"header-mid-area ptb-40\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-3 col-md-3 col-sm-5 col-xs-12\"> <div class=\"header-search\"> <form action=\"\"> <input type=\"text\" ng-model=\"bookName\" placeholder=\"请输入图书名称...\"> <a href=\"\" type=\"submit\" ng-click=\"goBookAndSpecification(bookName)\"><i class=\"fa fa-search\"></i></a> </form> </div> </div> <div class=\"col-lg-6 col-md-6 col-sm-4 col-xs-12\"> <div class=\"logo-area text-center logo-xs-mrg\"> <a ui-sref=\"main.dashboard\"><img src=\"images/logo.jpg\" alt=\"logo\"></a> </div> </div> <div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-12\"> <div class=\"my-cart\"> <ul> <li><a ui-sref=\"cart\"><i class=\"fa fa-shopping-cart\"></i>购物车</a> <span ng-show=\"books.length\">{{books.length}}</span> <div class=\"mini-cart-sub\"> <div class=\"cart-product\"> <div class=\"single-cart\" ng-repeat=\"data in books\"> <div class=\"cart-img\"> <img ng-src=\"{{data.attachment.saveName | imagePath}}\" alt=\"book\"> </div> <div class=\"cart-info\"> <h5><a href=\"#\">{{data.name}}</a></h5> <p>{{treeMap[data.id]}} x ￥{{data.price}}</p> </div> </div> </div> <div class=\"cart-totals\"> <h5>总计 <span>￥{{totalPrice}}</span></h5> </div> <div class=\"cart-bottom\"> <a class=\"view-cart\" ui-sref=\"cart\">查看购物车</a> <a ui-sref=\"checkout\">去结算</a> </div> </div> </li> </ul> </div> </div> </div> </div> </div> <!-- header-mid-area-end --> <!-- main-menu-area-start --> <div class=\"main-menu-area hidden-sm hidden-xs sticky-header-1\" id=\"header-sticky\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"menu-area\"> <nav> <ul> <li class=\"active\"> <a ui-sref=\"main.dashboard\" ng-click=\"hideInformation()\">首页</a> </li> <li><a ui-sref=\"book\">图书<i class=\"fa fa-angle-down\"></i></a> <div class=\"mega-menu\"> <span ng-repeat=\"data in categorys\" style=\"width: 15%\"> <a ui-sref=\"book({categoryId: data.id})\">{{data.name}}</a> </span> </div> </li> </ul> </nav> </div> <div class=\"safe-area\"> <a ui-sref=\"contact\">联系我们</a> </div> </div> </div> </div> </div> <!-- main-menu-area-end --> <!-- mobile-menu-area-start --> <div class=\"mobile-menu-area hidden-md hidden-lg\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"mobile-menu\"> <nav id=\"mobile-menu-active\"> <ul id=\"nav\"> <li><a href=\"index.html\">Home</a> <ul> <li><a href=\"index-2.html\">Home-2</a></li> <li><a href=\"index-3.html\">Home-3</a></li> <li><a href=\"index-4.html\">Home-4</a></li> <li><a href=\"index-5.html\">Home-5</a></li> <li><a href=\"index-6.html\">Home-6</a></li> </ul> </li> <li><a href=\"product-details.html\">Book</a> <ul> <li><a href=\"shop.html\">Tops & Tees</a></li> <li><a href=\"shop.html\">Polo Short Sleeve</a></li> <li><a href=\"shop.html\">Graphic T-Shirts</a></li> <li><a href=\"shop.html\">Jackets & Coats</a></li> <li><a href=\"shop.html\">Fashion Jackets</a></li> <li><a href=\"shop.html\">Crochet</a></li> <li><a href=\"shop.html\">Sleeveless</a></li> <li><a href=\"shop.html\">Stripes</a></li> <li><a href=\"shop.html\">Sweaters</a></li> <li><a href=\"shop.html\">hoodies</a></li> <li><a href=\"shop.html\">Heeled sandals</a></li> <li><a href=\"shop.html\">Polo Short Sleeve</a></li> <li><a href=\"shop.html\">Flat sandals</a></li> <li><a href=\"shop.html\">Short Sleeve</a></li> <li><a href=\"shop.html\">Long Sleeve</a></li> <li><a href=\"shop.html\">Polo Short Sleeve</a></li> <li><a href=\"shop.html\">Sleeveless</a></li> <li><a href=\"shop.html\">Graphic T-Shirts</a></li> <li><a href=\"shop.html\">Hoodies</a></li> <li><a href=\"shop.html\">Jackets</a></li> </ul> </li> <li><a href=\"product-details.html\">Audio books</a> <ul> <li><a href=\"shop.html\">Tops & Tees</a></li> <li><a href=\"shop.html\">Sweaters</a></li> <li><a href=\"shop.html\">Hoodies</a></li> <li><a href=\"shop.html\">Jackets & Coats</a></li> <li><a href=\"shop.html\">Long Sleeve</a></li> <li><a href=\"shop.html\">Short Sleeve</a></li> <li><a href=\"shop.html\">Polo Short Sleeve</a></li> <li><a href=\"shop.html\">Sleeveless</a></li> <li><a href=\"shop.html\">Sweaters</a></li> <li><a href=\"shop.html\">Hoodies</a></li> <li><a href=\"shop.html\">Wedges</a></li> <li><a href=\"shop.html\">Vests</a></li> <li><a href=\"shop.html\">Polo Short Sleeve</a></li> <li><a href=\"shop.html\">Sleeveless</a></li> <li><a href=\"shop.html\">Graphic T-Shirts</a></li> <li><a href=\"shop.html\">Hoodies</a></li> </ul> </li> <li><a href=\"product-details.html\">children’s books</a> <ul> <li><a href=\"shop.html\">Shirts</a></li> <li><a href=\"shop.html\">Florals</a></li> <li><a href=\"shop.html\">Crochet</a></li> <li><a href=\"shop.html\">Stripes</a></li> <li><a href=\"shop.html\">Shorts</a></li> <li><a href=\"shop.html\">Dresses</a></li> <li><a href=\"shop.html\">Trousers</a></li> <li><a href=\"shop.html\">Jeans</a></li> <li><a href=\"shop.html\">Heeled sandals</a></li> <li><a href=\"shop.html\">Flat sandals</a></li> <li><a href=\"shop.html\">Wedges</a></li> <li><a href=\"shop.html\">Ankle boots</a></li> </ul> </li> <li><a href=\"#\">blog</a> <ul> <li><a href=\"blog.html\">Blog</a></li> <li><a href=\"blog-details.html\">blog-details</a></li> </ul> </li> <li><a href=\"product-details.html\">Page</a> <ul> <li><a href=\"shop.html\">Shop</a></li> <li><a href=\"product-details.html\">product-details</a></li> <li><a href=\"blog.html\">Blog</a></li> <li><a href=\"blog-details.html\">blog-details</a></li> <li><a href=\"about.html\">About</a></li> <li><a href=\"contact.html\">Contact</a></li> <li><a href=\"checkout.html\">Checkout</a></li> <li><a href=\"cart.html\">Cart</a></li> <li><a ui-route=\"login.html\">Login</a></li> <li><a href=\"register.html\">Register</a></li> <li><a href=\"wishlist.html\">Wishlist</a></li> <li><a href=\"404.html\">404 Page</a></li> </ul> </li> </ul> </nav> </div> </div> </div> </div> </div> <!-- mobile-menu-area-end --> </header>"
  );


  $templateCache.put('views/common/middle.html',
    "<div class=\"product-area pt-95 xs-mb\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"section-title text-center mb-50\"> <h2>点击量Top5</h2> <p>这里我们收集了用户点击量最大的五本图书<br> 看看有没有你想要的吧..</p> </div> </div> </div> <!-- tab-area-start --> <div class=\"tab-content\"> <div class=\"tab-pane active\" id=\"Audiobooks\"> <div class=\"tab-active owl-carousel owl-loaded owl-drag\"> <!-- single-product-start --> <!-- single-product-end --> <!-- single-product-start --> <!-- single-product-end --> <!-- single-product-start --> <!-- single-product-end --> <!-- single-product-start --> <!-- single-product-end --> <!-- single-product-start --> <!-- single-product-end --> <!-- single-product-start --> <!-- single-product-end --> <div class=\"owl-stage-outer\"><div class=\"owl-stage\" style=\"transform: translate3d(-1160px, 0px, 0px); transition: all 0s ease 0s; width: 4060px\"><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/5.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Set of Sprite Yoga Straps</a></h4> <div class=\"product-price\"> <ul> <li>$34.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/7.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Strive Shoulder Pack</a></h4> <div class=\"product-price\"> <ul> <li>$30.00</li> <li class=\"old-price\">$32.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/9.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Wayfarer Messenger Bag</a></h4> <div class=\"product-price\"> <ul> <li>$35.00</li> <li class=\"old-price\">40.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/11.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Impulse Duffle</a></h4> <div class=\"product-price\"> <ul> <li>$74.00</li> <li class=\"old-price\">78.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item active\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/1.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span></li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Joust Duffle Bag</a></h4> <div class=\"product-price\"> <ul> <li>$60.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item active\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/3.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Chaz Kangeroo Hoodie</a></h4> <div class=\"product-price\"> <ul> <li>$52.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item active\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/5.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Set of Sprite Yoga Straps</a></h4> <div class=\"product-price\"> <ul> <li>$34.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item active\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/7.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Strive Shoulder Pack</a></h4> <div class=\"product-price\"> <ul> <li>$30.00</li> <li class=\"old-price\">$32.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/9.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Wayfarer Messenger Bag</a></h4> <div class=\"product-price\"> <ul> <li>$35.00</li> <li class=\"old-price\">40.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/11.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Impulse Duffle</a></h4> <div class=\"product-price\"> <ul> <li>$74.00</li> <li class=\"old-price\">78.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/1.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span></li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Joust Duffle Bag</a></h4> <div class=\"product-price\"> <ul> <li>$60.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/3.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Chaz Kangeroo Hoodie</a></h4> <div class=\"product-price\"> <ul> <li>$52.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/5.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Set of Sprite Yoga Straps</a></h4> <div class=\"product-price\"> <ul> <li>$34.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/7.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Strive Shoulder Pack</a></h4> <div class=\"product-price\"> <ul> <li>$30.00</li> <li class=\"old-price\">$32.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div></div></div></div><div class=\"owl-nav\"><button type=\"button\" role=\"presentation\" class=\"owl-prev\"><i class=\"fa fa-angle-left\"></i></button><button type=\"button\" role=\"presentation\" class=\"owl-next\"><i class=\"fa fa-angle-right\"></i></button></div><div class=\"owl-dots disabled\"></div></div> </div> </div> <!-- tab-area-end --> </div> </div> <div class=\"banner-area-5 mtb-95\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"banner-img-2\"> <a href=\"#\"><img src=\"images/banner/5.jpg\" alt=\"banner\"></a> <div class=\"banner-text\"> <h3>G. Meyer Books &amp; Spiritual Traveler Press</h3> <h2>Sale up to 30% off</h2> </div> </div> </div> </div> </div> </div> <div class=\"new-book-area pb-100\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"section-title bt text-center pt-100 mb-30 section-title-res\"> <h2>最新上架</h2> </div> </div> </div> <div class=\"tab-active owl-carousel owl-loaded owl-drag\"> <div class=\"owl-stage-outer\"><div class=\"owl-stage\" style=\"transform: translate3d(-1160px, 0px, 0px); transition: all 0s ease 0s; width: 4060px\"><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/5.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Set of Sprite Yoga Straps</a></h4> <div class=\"product-price\"> <ul> <li>$34.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/19.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Compete Track Tote</a></h4> <div class=\"product-price\"> <ul> <li>$32.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/7.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Strive Shoulder Pack</a></h4> <div class=\"product-price\"> <ul> <li>$30.00</li> <li class=\"old-price\">$32.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/4.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Chaz Kangeroo Hoodie</a></h4> <div class=\"product-price\"> <ul> <li>$52.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/9.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Wayfarer Messenger Bag</a></h4> <div class=\"product-price\"> <ul> <li>$35.00</li> <li class=\"old-price\">$40.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/8.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Rival Messenger</a></h4> <div class=\"product-price\"> <ul> <li>$35.00</li> <li class=\"old-price\">$40.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/11.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Impulse Duffle</a></h4> <div class=\"product-price\"> <ul> <li>$74.00</li> <li class=\"old-price\">$78.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/3.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Crown Summit</a></h4> <div class=\"product-price\"> <ul> <li>$36.00</li> <li class=\"old-price\">$38.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item active\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/1.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Joust Duffle Bag</a></h4> <div class=\"product-price\"> <ul> <li>$60.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/18.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Driven Backpack</a></h4> <div class=\"product-price\"> <ul> <li>$34.00</li> <li class=\"old-price\">$36.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item active\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/3.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Chaz Kangeroo Hoodie</a></h4> <div class=\"product-price\"> <ul> <li>$52.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/10.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Fusion Backpack</a></h4> <div class=\"product-price\"> <ul> <li>$59.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item active\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/5.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Set of Sprite Yoga Straps</a></h4> <div class=\"product-price\"> <ul> <li>$34.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/19.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Compete Track Tote</a></h4> <div class=\"product-price\"> <ul> <li>$32.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item active\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/7.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Strive Shoulder Pack</a></h4> <div class=\"product-price\"> <ul> <li>$30.00</li> <li class=\"old-price\">$32.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/4.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Chaz Kangeroo Hoodie</a></h4> <div class=\"product-price\"> <ul> <li>$52.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/9.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Wayfarer Messenger Bag</a></h4> <div class=\"product-price\"> <ul> <li>$35.00</li> <li class=\"old-price\">$40.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/8.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Rival Messenger</a></h4> <div class=\"product-price\"> <ul> <li>$35.00</li> <li class=\"old-price\">$40.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/11.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Impulse Duffle</a></h4> <div class=\"product-price\"> <ul> <li>$74.00</li> <li class=\"old-price\">$78.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/3.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Crown Summit</a></h4> <div class=\"product-price\"> <ul> <li>$36.00</li> <li class=\"old-price\">$38.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/1.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Joust Duffle Bag</a></h4> <div class=\"product-price\"> <ul> <li>$60.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/18.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Driven Backpack</a></h4> <div class=\"product-price\"> <ul> <li>$34.00</li> <li class=\"old-price\">$36.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/3.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Chaz Kangeroo Hoodie</a></h4> <div class=\"product-price\"> <ul> <li>$52.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/10.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Fusion Backpack</a></h4> <div class=\"product-price\"> <ul> <li>$59.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/5.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Set of Sprite Yoga Straps</a></h4> <div class=\"product-price\"> <ul> <li>$34.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/19.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Compete Track Tote</a></h4> <div class=\"product-price\"> <ul> <li>$32.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div><div class=\"owl-item cloned\" style=\"width: 270px; margin-right: 20px\"><div class=\"tab-total\"> <!-- single-product-start --> <div class=\"product-wrapper mb-40\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/7.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> <br></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Strive Shoulder Pack</a></h4> <div class=\"product-price\"> <ul> <li>$30.00</li> <li class=\"old-price\">$32.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> <!-- single-product-start --> <div class=\"product-wrapper\"> <div class=\"product-img\"> <a href=\"#\"> <img src=\"images/product/4.jpg\" alt=\"book\" class=\"primary\"> </a> <div class=\"quick-view\"> <a class=\"action-view\" href=\"#\" data-target=\"#productModal\" data-toggle=\"modal\" title=\"Quick View\"> <i class=\"fa fa-search-plus\"></i> </a> </div> <div class=\"product-flag\"> <ul> <li><span class=\"sale\">new</span> </li> <li><span class=\"discount-percentage\">-5%</span></li> </ul> </div> </div> <div class=\"product-details text-center\"> <div class=\"product-rating\"> <ul> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> <li><a href=\"#\"><i class=\"fa fa-star\"></i></a></li> </ul> </div> <h4><a href=\"#\">Chaz Kangeroo Hoodie</a></h4> <div class=\"product-price\"> <ul> <li>$52.00</li> </ul> </div> </div> <div class=\"product-link\"> <div class=\"product-button\"> <a href=\"#\" title=\"Add to cart\"><i class=\"fa fa-shopping-cart\"></i>Add to cart</a> </div> <div class=\"add-to-link\"> <ul> <li><a href=\"product-details.html\" title=\"Details\"><i class=\"fa fa-external-link\"></i></a></li> </ul> </div> </div> </div> <!-- single-product-end --> </div></div></div></div><div class=\"owl-nav\"><button type=\"button\" role=\"presentation\" class=\"owl-prev\"><i class=\"fa fa-angle-left\"></i></button><button type=\"button\" role=\"presentation\" class=\"owl-next\"><i class=\"fa fa-angle-right\"></i></button></div><div class=\"owl-dots disabled\"></div></div> </div> </div>"
  );


  $templateCache.put('views/common/navigation.html',
    "<div id=\"navigation\"> <div class=\"profile-picture\"> <a href=\"index.html\"> <img src=\"images/profile.jpg\" class=\"img-circle m-b\" alt=\"logo\"> </a> <div class=\"stats-label text-color\"> <span class=\"font-extra-bold font-uppercase\">{{config.title}}</span> <div class=\"small-chart m-t-sm\"> <div sparkline spark-data=\"barProfileData\" spark-options=\"barProfileOptions\"></div> </div> <div> <small class=\"text-muted\">所属团队:{{config.owner}}</small> </div> </div> </div> <ul yunzhi-side-navigation class=\"nav\" id=\"side-menu\"> </ul> </div>"
  );


  $templateCache.put('views/common/panel_tools.html',
    "<!-- This is template for panel tools --><!-- It contains collapse function (showhide) and close function (closebox) --><!-- All function is handled from directive panelTools in directives.js file --> <div class=\"panel-tools\"> <a ng-click=\"showhide()\"><i class=\"fa fa-chevron-up\"></i></a> <a ng-click=\"closebox()\"><i class=\"fa fa-times\"></i></a> </div>"
  );


  $templateCache.put('views/common/panel_tools_fullscreen.html',
    "<!-- This is template for panel tools --><!-- It contains collapse function (showhide) and close function (closebox) --><!-- All function is handled from directive panelTools in directives.js file --> <div class=\"panel-tools\"> <a ng-click=\"showhide()\"><i class=\"fa fa-chevron-up\"></i></a> <a ng-click=\"fullscreen()\"><i class=\"fa fa-expand\"></i></a> <a ng-click=\"closebox()\"><i class=\"fa fa-times\"></i></a> </div>"
  );


  $templateCache.put('views/common/slider.html',
    "<div class=\"slider-area\"> <div class=\"slider-active owl-carousel\"> <div class=\"single-slider pt-125 pb-130 bg-img\" style=\"background-image:url(images/slider/1.jpg)\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-md-5\"> <div class=\"slider-content slider-animated-1 text-center\"> <h1>全场八折</h1> <h2>三人行</h2> <h3>现在19.9元起</h3> <a href=\"#\">购物吧</a> </div> </div> </div> </div> </div> <div class=\"single-slider slider-h1-2 pt-215 pb-100 bg-img\" style=\"background-image:url(images/slider/2.jpg)\"> <div class=\"container\"> <div class=\"slider-content slider-content-2 slider-animated-1\"> <h1>We can help get your</h1> <h2>Books in Order</h2> <h3>and Accessories</h3> <a href=\"#\">Contact Us Today!</a> </div> </div> </div> </div> </div>"
  );


  $templateCache.put('views/contact.html',
    "<div class=\"breadcrumbs-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"breadcrumbs-menu\"> <ul> <li><a ui-sref=\"main.dashboard\" ng-click=\"hideInformation()\">首页</a></li> <li><a href=\"\" class=\"active\">联系我们</a></li> </ul> </div> </div> </div> </div> </div> <div class=\"contact-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\"> <div class=\"contact-info\"> <h2>联系信息</h2> <ul> <li> <i class=\"fa fa-map-marker\"></i> <span>地址: </span> 天津市天津职业技术师范大学 </li> <li> <i class=\"fa fa-envelope\"></i> <span>电话: </span> (86) 022-1234567 </li> <li> <i class=\"fa fa-mobile\"></i> <span>邮箱: </span> <a href=\"#\">10a10150106@tute.edu.cn</a> </li> </ul> </div> </div> </div> </div> </div>"
  );


  $templateCache.put('views/dashboard.html',
    "<!-- Header --><!--<div id=\"header\" ng-include=\"'views/common/header.html'\"></div>--><!--<div id=\"banner\" ng-include=\"'views/common/banner.html'\"></div>--><!--<div ng-include=\"'views/common/slider.html'\"></div>--><!--<div ng-include=\"'views/common/middle.html'\"></div>--><!--<div ng-include=\"'views/common/footer.html'\"></div>-->"
  );


  $templateCache.put('views/directive/yunzhiAccuracyDisplayName.html',
    "<!--精度显示名称--> <ui-select ng-model=\"accuracyDisplay.selected\" theme=\"bootstrap\" ng-disabled=\"disabled\" ng-change=\"update(accuracyDisplay.selected)\"> <ui-select-match placeholder=\"请选择\">{{$select.selected.name}}</ui-select-match> <ui-select-choices repeat=\"data in datas | propsFilter: {name: $select.search, pinyin: $select.search}\"> <div ng-bind-html=\"data.name | highlight: $select.search\"></div> </ui-select-choices> </ui-select>"
  );


  $templateCache.put('views/directive/yunzhiDate.html',
    "<!--日期--> <p class=\"input-group\"> <input type=\"text\" name=\"{{name}}\" required class=\"form-control\" ng-click=\"open()\" ng-change=\"change(date)\" uib-datepicker-popup=\"{{format}}\" ng-model=\"date\" is-open=\"opened\" max-date=\"maxDate\" datepicker-options=\"dateOptions\" ng-required=\"required\" close-text=\"关闭\" clear-text=\"清空\" current-text=\"今天\" alt-input-formats=\"altInputFormats\"> <span class=\"input-group-btn\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"open()\"><i class=\"glyphicon glyphicon-calendar\"></i></button> </span> </p>"
  );


  $templateCache.put('views/directive/yunzhiDiscipline.html',
    "<!--学科类别--> <ui-select ng-model=\"discipline.selected\" theme=\"bootstrap\" ng-disabled=\"disabled\" ng-change=\"updateModel(discipline.selected)\"> <ui-select-match placeholder=\"请选择\">{{$select.selected.name}}</ui-select-match> <ui-select-choices repeat=\"discipline in disciplines | propsFilter: {name: $select.search, pinyin: $select.search}\"> <div ng-bind-html=\"discipline.name | highlight: $select.search\"></div> </ui-select-choices> </ui-select>"
  );


  $templateCache.put('views/directive/yunzhiInstrumentType.html',
    "<!--器具类别--> <ui-select ng-model=\"instrumentType.selected\" theme=\"bootstrap\" ng-change=\"updateModel(instrumentType.selected)\"> <ui-select-match placeholder=\"请选择\">{{$select.selected.name}}</ui-select-match> <ui-select-choices repeat=\"instrumentType in instrumentTypes | propsFilter: {name: $select.search, pinyin: $select.search}\"> <div ng-bind-html=\"instrumentType.name | highlight:$select.search\"></div> </ui-select-choices> </ui-select>"
  );


  $templateCache.put('views/directive/yunzhiInstrumentTypeFirstLevel.html',
    "<select ng-model=\"ngModel\" class=\"form-control\" required> <option ng-repeat=\"list in lists\" ng-value=\"list\">{{list.name}}</option> </select>"
  );


  $templateCache.put('views/directive/yunzhiSideNavigation.html',
    "<li ng-class=\"{active: isActive(menu)}\" ng-repeat=\"menu in menus | orderBy: 'weight'\"> <a ng-if=\"!hasChildren(menu) && menu.show\" ui-sref=\"{{getRoute(menu)}}\" ng-click=\"clickedParentMenu(menu)\"><span class=\"nav-label\">{{menu.name}}</span><span class=\"label label-success pull-right\">{{menu.badgeContent}}</span></a> <a ng-if=\"hasChildren(menu)&& menu.show\" href=\"javascript:void(0);\" ng-click=\"clickedParentMenu(menu)\"><span class=\"nav-label\">{{menu.name}}</span><span class=\"fa arrow\"></span> </a> <ul aria-expanded=\"menu.isClicked\" ng-if=\"hasChildren(menu) && menu.show\" ng-show=\"isActive(menu)\" class=\"nav nav-second-level\" ng-class=\"{in: $state.includes('{{menu.module}}')}\" ng-repeat=\"_menu in menu._children\"> <li ng-if=\"_menu.show\" ui-sref-active=\"active\" ng-class=\"{active: _menu.isClicked}\" ng-click=\"clicked(_menu)\"><a ui-sref=\"{{getRoute(_menu)}}\">{{_menu.name}}</a></li> </ul> </li>"
  );


  $templateCache.put('views/login.html',
    "<!-- breadcrumbs-area-start --> <div class=\"breadcrumbs-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"breadcrumbs-menu\"> <ul> <li><a ui-sref=\"main.dashboard\" ng-click=\"hideInformation()\">首页</a></li> <li><a href=\"\" class=\"active\">登录</a></li> </ul> </div> </div> </div> </div> </div> <!-- breadcrumbs-area-end --> <!-- user-login-area-start --> <div class=\"user-login-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"login-title text-center mb-30\"> <h2>登录</h2> </div> </div> <form method=\"get\" name=\"addForm\"> <div class=\"col-lg-offset-3 col-lg-6 col-md-offset-3 col-md-6 col-sm-12 col-xs-12\"> <div class=\"login-form\"> <div class=\"single-login\"> <label>用户名<span>*</span></label> <input type=\"text\" ng-model=\"user.username\" name=\"user.username\" required> </div> <div class=\"single-login\"> <label>密码 <span>*</span></label> <input type=\"password\" ng-model=\"user.password\" name=\"user.password\" required> </div> <div class=\"single-login single-login-2\"> <a ui-sref=\"main.dashboard\" ng-click=\"login()\" class=\"btn btn-default\" style=\"margin-top: 15px\" ng-hide=\"addForm.$submitted\" type=\"submit\">&nbsp;&nbsp;登录 </a> </div> <a ui-sref=\"registration\">没有账号?注册一个吧</a> </div> </div> </form> </div> </div> </div> <!-- user-login-area-end -->"
  );


  $templateCache.put('views/main.html',
    "fdsfds"
  );


  $templateCache.put('views/registration.html',
    "<!-- breadcrumbs-area-start --> <div class=\"breadcrumbs-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"breadcrumbs-menu\"> <ul> <li><a ui-sref=\"main.dashboard\" ng-click=\"hideInformation()\">首页</a></li> <li><a href=\"\" class=\"active\">注册</a></li> </ul> </div> </div> </div> </div> </div> <!-- breadcrumbs-area-end --> <!-- user-login-area-start --> <div class=\"user-login-area mb-70\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-lg-12\"> <div class=\"login-title text-center mb-30\"> <h2>注册</h2> </div> </div> <div class=\"col-lg-offset-2 col-lg-8 col-md-offset-2 col-md-8 col-sm-12 col-xs-12\"> <div class=\"billing-fields\"> <div class=\"row\"> <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\"> <div class=\"single-register\"> <form method=\"get\" name=\"addForm\" ng-submit=\"saveAndClose()\"> <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\"> <label>用户名<span>*</span></label> <input type=\"text\" ng-model=\"data.username\" name=\"username\" required> </div> <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\"> <label>姓名<span>*</span></label> <input type=\"text\" ng-model=\"data.name\" name=\"name\" required> </div> <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\"> <label>收货地址<span>*</span></label> <input type=\"text\" ng-model=\"data.address\" name=\"address\" required> </div> <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\"> <label>手机号<span>*</span></label> <input type=\"text\" ng-model=\"data.phone\" name=\"phone\" required> </div> <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\"> <label>密码<span>*</span></label> <input type=\"password\" ng-model=\"data.password\" name=\"password\" required> </div> <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\"> <label>确认密码<span>*</span></label> <input type=\"password\" ng-model=\"data.confirmPassword\" name=\"password\" required> </div> <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\"> <button class=\"btn btn-default\" style=\"margin-top: 15px\" ng-hide=\"addForm.$submitted\" type=\"submit\"><i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i>&nbsp;&nbsp;注册 </button> </div> </form> </div> </div> </div> </div> </div> </div> </div> </div> <!-- user-login-area-end -->"
  );

}]);
