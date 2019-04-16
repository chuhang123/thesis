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
            data: {}
        })

        // 登录
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            data: {}
        })

        // 用户注册
        .state('registration', {
            url: '/registration',
            templateUrl: 'views/registration.html',
            data: {},
            controller: 'RegistrationCtrl'
        })

        // 系统设置
        .state('system', {
            // 路由值
            abstract: true, // 表示此路由不对应具体的页面
            url: '/system',
            templateUrl: 'views/common/content.html', // 模板文件
            data: {
                pageTitle: '系统设置'
            }
        })

        // 菜单管理
        .state('system.Menu', {
            // 路由值, 表示该值继承于system
            url: '/Menu',
            templateUrl: 'views/system/menu/index.html',
            data: {
                pageTitle: '菜单管理',
                pageDesc: '计量系统菜单管理'
            },
            controller: 'SystemMenuIndexCtrl'
        })

        // 角色管理
        .state('system.role', {
            url: '/role',
            templateUrl: 'views/system/role/index.html',
            data: {
                pageTitle: '角色管理',
                pageDesc: '计量系统角色管理'
            },
            controller: 'SystemRoleIndexCtrl'
        })

        .state('system.roleEdit', {
            url: '/role/edit',
            templateUrl: 'views/system/role/edit.html',
            data: {
                pageTitle: '角色管理——编辑',
                pageDesc: '计量系统角色管理'
            },
            controller: 'SystemRoleEditCtrl',
            params: {
                data: { // 角色对象
                    value: {}
                }
            }
        })

        // 标准器类别管理
        .state('system.standardInstrumentType', {
            url: '/standardInstrumentType/page/:page/size/:size',
            templateUrl: 'views/system/standardInstrumentType/index.html',
            data: {
                pageTitle: '标准器类别管理',
                pageDesc: '计量系统角色管理'
            },
            params: {
                discipline: {id: 1},
                page: {
                    value: '0'
                },
                size: {
                    value: config.size.toString()
                }
            },
            controller: 'SystemStandardinstrumenttypeIndexCtrl'
        })

        .state('system.standardInstrumentTypeAdd', {
            url: '/standardInstrumentType/add',
            templateUrl: 'views/system/standardInstrumentType/add.html',
            data: {
                pageTitle: '标准器类别管理--新增',
                pageDesc: '计量系统角色管理'
            },
            params: {
                disciplineId: {
                    value: ''
                }
            },
            controller: 'SystemStandardinstrumenttypeAddCtrl'
        })

        .state('system.standardInstrumentTypeEdit', {
            url: '/standardInstrumentType/edit/:id',
            templateUrl: 'views/system/standardInstrumentType/add.html',
            data: {
                pageTitle: '标准器类别管理--编辑',
                pageDesc: '计量系统角色管理'
            },
            params: {
                id: {
                    value: ''
                }
            },
            controller: 'SystemStandardinstrumenttypeEditCtrl'
        })

        // 标准装置管理
        .state('standard', {
            // 路由值
            abstract: true, // 表示此路由不对应具体的页面
            url: '/standard',
            templateUrl: 'views/common/content.html', // 模板文件
            data: {
                pageTitle: '标准装置管理'
            }
        })

        // 档案管理
        .state('standard.deviceSet', {
            url: '/deviceSet/page/:page/size/:size',
            templateUrl: 'views/standard/deviceset/index.html',
            data: {
                pageTitle: '档案管理',
                pageDesc: '标准装置--档案管理'
            },
            params: {
                page: {
                    value: '0'
                },
                size: {
                    value: config.size.toString()
                }
            },
            controller: 'StandardDeviceSetIndexCtrl'
        })

        .state('standard.deviceSetAdd', {
            url: '/deviceSet/add',
            templateUrl: 'views/standard/deviceset/add.html',
            data: {
                pageTitle: '档案管理--新增',
                pageDesc: '标准装置--档案管理'
            },
            controller: 'StandardDeviceSetAddCtrl'
        })

        .state('standard.deviceSetEdit', {
            url: '/deviceSet/edit/:id',
            templateUrl: 'views/standard/deviceset/add.html',
            data: {
                pageTitle: '档案管理--编辑',
                pageDesc: '标准装置--档案管理'
            },
            params: {
                id: {
                    value: ''
                }
            },
            controller: 'StandardDeviceSetEditCtrl'
        })

        // 标准器信息
        .state('standard.standardDevice', {
            url: '/standardDevice/deviceSetId/:deviceSetId',
            templateUrl: 'views/standard/standarddevice/index.html',
            data: {
                pageTitle: '标准器管理',
                pageDesc: '标准装置--标准器管理'
            },
            params: {
                deviceSetId: {
                    value: ''
                },
                page: {
                    value: '0'
                },
                size: {
                    value: config.size.toString()
                }
            },
            controller: 'StandardStandardDeviceIndexCtrl'
        })

        .state('standard.standardDeviceAdd', {
            url: '/standardDevice/deviceSetId/:deviceSetId/add',
            templateUrl: 'views/standard/standarddevice/add.html',
            data: {
                pageTitle: '标准器管理--新增',
                pageDesc: '标准装置--标准器管理'
            },
            params: {
                deviceSetId: {
                    value: ''
                }
            },
            controller: 'StandardStandardDeviceAddCtrl'
        })

        .state('standard.standardDeviceEdit', {
            url: '/standardDevice/edit/:id',
            templateUrl: 'views/standard/standarddevice/edit.html',
            data: {
                pageTitle: '标准器管理--编辑',
                pageDesc: '标准装置--标准器管理'
            },
            params: {
                id: {
                    value: ''
                }
            },
            controller: 'StandardStandardDeviceEditCtrl'
        })

        // 授权检定项目管理
        .state('standard.deviceInstrument', {
            url: '/deviceInstrument',
            templateUrl: 'views/standard/deviceinstrument/index.html',
            data: {
                pageTitle: '授权检定项目管理--新增',
                pageDesc: '标准装置--授权检定项目管理'
            },
            params: {
                deviceSetId: {
                    value: ''
                }
            },
            controller: 'StandardDeviceInstrumentIndexCtrl'
        })

        // 授权检定项目管理
        .state('standard.deviceInstrumentAdd', {
            url: '/deviceInstrument/deviceSetId/:deviceSetId/add',
            templateUrl: 'views/standard/deviceinstrument/add.html',
            data: {
                pageTitle: '授权检定项目管理',
                pageDesc: '标准装置--授权检定项目管理'
            },
            params: {
                deviceSetId: {
                    value: ''
                }
            },
            controller: 'StandardDeviceInstrumentAddCtrl'
        })

        // 综合查询
        .state('standard.integratedQuery', {
            url: '/integratedQuery/page/:page/size/:size',
            templateUrl: 'views/standard/integratedquery/index.html',
            data: {
                pageTitle: '综合查询',
                pageDesc: '标准装置--综合查询'
            },
            params: {
                page: {
                    value: '0'
                },
                size: {
                    value: config.size.toString()
                },
                code: {
                    value: ''
                },
                name: {
                    value: ''
                }
            },
            controller: 'StandardIntegratedQueryIndexCtrl'
        })

        //类别管理
        .state('system.Category', {
            // 路由值
            url: '/Category',
            templateUrl: 'views/category/index.html',
            data: {
                pageTitle: '类别管理'
            },
            params: {
                page: {
                    value: '0'
                },
                size: {
                    value: config.size.toString()
                }
            },
            controller: 'CategoryIndexCtrl'
        })

        .state('system.CategoryAdd', {
            url: '/Category/add',
            templateUrl: 'views/category/add.html',
            data: {
                pageTitle: '类别管理--新增'
            },
            controller: 'CategoryAddCtrl'
        })

        .state('standard.categoryEdit', {
            url: '/Category/edit/:id',
            templateUrl: 'views/category/add.html',
            data: {
                pageTitle: '类别管理--编辑'
            },
            params: {
                id: {
                    value: ''
                }
            },
            controller: 'CategoryEditCtrl'
        })

        //图书管理
        .state('system.Book', {
            // 路由值
            url: '/Book',
            templateUrl: 'views/book/index.html',
            data: {
                pageTitle: '图书管理'
            },
            params: {
                page: {
                    value: '0'
                },
                size: {
                    value: config.size.toString()
                }
            },
            controller: 'BookIndexCtrl'
        })

        .state('system.BookAdd', {
            url: '/Book/add',
            templateUrl: 'views/book/add.html',
            data: {
                pageTitle: '图书管理--新增'
            },
            controller: 'BookAddCtrl'
        })

        .state('standard.bookEdit', {
            url: '/Book/edit/:id',
            templateUrl: 'views/book/add.html',
            data: {
                pageTitle: '图书管理--编辑'
            },
            params: {
                id: {
                    value: ''
                }
            },
            controller: 'BookEditCtrl'
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
            title: '三人行图书销售网店',
            owner: '梦云智软件开发团队',
            technicalSupport: '<a href="https://chuhang123.github.io/" target="_blank">chuhang 技术不宅</a>',
            beginYear: 2017,
            currentYear: (new Date()).getFullYear()
        },
        defaultRoute: '/main/dashboard' // 默认路由
    })
    // 注入$http完成对URL请求的统一设置
    .factory('apiUrlHttpInterceptor', function ($cookies, config, $q, $location) {
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
    })
    // $http 注入，当发生请求时，自动添加前缀
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('apiUrlHttpInterceptor');
    }])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-yz-bar"><div class="loading"><div class="table-cell"><div class="loading-main"><img src="styles/svg/loading-bars.svg" width="256" height="64"><p>正在努力为您加载...</p></div></div></div></div>';
        // cfpLoadingBarProvider.spinnerTemplate = '';
    }])
    .config(configState)
    .run(function ($rootScope, $state, UserService, $location, config) {
        // 检测当前用户状态，
        UserService.checkUserIsLogin(function (status) {
            if (status === true) {
                // 已登录, 注册路由
            } else {
                if ($location.path() === '/registration' || $location.path() === '/check') {
                    //注册界面或者系统核验提示界面
                } else {
                    // 未登录，则跳转至登录界面。所以，登录界面与首页这两个路中需要手动注册。
                    $location.path(config.loginPath);
                }
            }
        });
        // 设置系统信息
        $rootScope.config = config.rootScopeConfig;
        $rootScope.$state = $state;
    });

