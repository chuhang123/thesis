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
.directive('sideNavigation', function sideNavigation($timeout, $) {
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
})
//方法minimalizaMenu里面$rootScope参数没有用到，暂作删除
.directive('minimalizaMenu', [function minimalizaMenu($) {
	/**
	 * minimalizaSidebar - Directive for minimalize sidebar
	 */
	return {
		restrict: 'EA',
		template: '<div class="header-link hide-menu" ng-click="minimalize()"><i class="fa fa-bars"></i></div>',
		//controller里面$element参数没有用到，暂作删除
		controller: function ($scope) {
			$scope.minimalize = function () {
				if ($(window).width() < 769) {
					$("body").toggleClass("show-sidebar");
				} else {
					$("body").toggleClass("hide-sidebar");
				}
			};
		}
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
		controller: function ($scope, $element) {
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

		}
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
		controller: function ($scope, $element) {
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

		}
	};
}])
.directive('smallHeader', [function smallHeader() {
	/**
	 * smallHeader - Directive for page title panel
	 */
	return {
		restrict: 'A',
		scope: true,
		controller: function ($scope, $element) {
			$scope.small = function () {
				var icon = $element.find('i:first');
				var breadcrumb = $element.find('#hbreadcrumb');
				$element.toggleClass('small-header');
				breadcrumb.toggleClass('m-t-lg');
				icon.toggleClass('fa-arrow-up').toggleClass('fa-arrow-down');
			};
		}
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
