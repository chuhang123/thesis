'use strict';

/**
 * @ngdoc directive
 * @name webappApp.directive:yunzhiSideNavigation
 * @description
 * # yunzhiSideNavigation
 */
angular.module('webappApp')
  .directive('yunzhiSideNavigation', function (WebAppMenuService, $) {
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
  });

