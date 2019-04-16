'use strict';

/**
 * @ngdoc service
 * @name webappApp.WebAppMenuService
 * @description
 * # WebAppMenuService
 * Service in the webappApp.
 */
angular.module('webappApp')
  .service('WebAppMenuService', ['$http', 'CommonService', '$timeout', '$state', function ($http, CommonService, $timeout, $state) {
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
    self.getAll = function (callback) {
      if (self.all.length === 0) {
        $http.get('/WebAppMenu/').then(function success(response) {
          self.all = response.data;
          callback(self.all);
        });
      } else {
        callback(self.all);
      }
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
