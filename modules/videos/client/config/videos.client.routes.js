'use strict';

//Setting up route
angular.module('videos').config(['$stateProvider',
    function ($stateProvider) {
        // Videos state routing
        $stateProvider.
            state('videos', {
                abstract: true,
                url: '/videos',
                template: '<ui-view/>'
            }).
            state('videos.slick', {
                url: '',
                templateUrl: 'modules/videos/views/slick-videos.client.view.html'
            }).
            state('videos.list', {
                url: '/list',
                templateUrl: 'modules/videos/views/list-videos.client.view.html'
            }).
            state('videos.create', {
                url: '/create',
                templateUrl: 'modules/videos/views/create-video.client.view.html'
            }).
            state('videos.view', {
                url: '/:videoId',
                templateUrl: 'modules/videos/views/view-video.client.view.html'
            }).
            state('videos.edit', {
                url: '/:videoId/edit',
                templateUrl: 'modules/videos/views/edit-video.client.view.html'
            });
    }
]);
