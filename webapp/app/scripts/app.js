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
        'ui.select',
        'angularFileUpload'
    ]);
