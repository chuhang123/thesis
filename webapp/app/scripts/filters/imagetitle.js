'use strict';

/**
 * @ngdoc filter
 * @name webappApp.filter:imageTitle
 * @function
 * @description
 * # imageTitle
 * Filter in the webappApp.
 */
angular.module('webappApp')
    .filter('imageTitle', function () {
        return function (input) {
            var r=/[^\x00-\xff]/g;
            if (input !== undefined) {
                if(input.replace(r,'mm').length<=20){return input;}
                var m=Math.floor(20/2);
                for(var i=m;i<input.length;i++){
                    if(input.substr(0,i).replace(r,'mm').length>=20){
                        return input.substr(0,i)+'...';
                    }
                }
            }

            return input;

        };
    });
