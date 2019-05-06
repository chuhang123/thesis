'use strict';

describe('Directive: yunzhiPage', function () {

    // load the directive's module
    beforeEach(module('webappApp'));

    //var element,
    var scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    // 单元测试
    // it('should make hidden element visible', inject(function ($compile) {
    //     element = angular.element('<yunzhi-page></yunzhi-page>');
    //     element = $compile(element)(scope);
    //     expect(element.text()).toBe('this is the yunzhiPage directive');
    // }));
});
