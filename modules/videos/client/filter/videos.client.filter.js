/**
 * Created by Volker on 24.06.2015.
 */
'use strict';
//Inputs a number and outputs an array with that length.
//(3 | array) => [0,1,2]

angular.module('videos').filter('trusted', ['$sce', function ($sce) {
    return function(input) {
        return $sce.trustAsResourceUrl(input);
    };
}]);
