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
    .service('CommonService', function (config, $rootScope, $state, SweetAlert, $stateParams) {
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
                var newDate = date[0] + '/' + date[1] + '/' + date[2];
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
    });
