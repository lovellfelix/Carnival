'use strict';

//Setting up route
angular.module('tweets').config(['$stateProvider',
	function($stateProvider) {
		// Tweets state routing
		$stateProvider.
		state('tweets', {
			abstract: true,
			url: '/tweets',
			template: '<ui-view/>'
		}).
		state('tweets.list', {
			url: '',
			templateUrl: 'modules/tweets/views/list-tweets.client.view.html'
		}).
		state('tweets.create', {
			url: '/create',
			templateUrl: 'modules/tweets/views/create-tweet.client.view.html'
		}).
		state('tweets.view', {
			url: '/:tweetId',
			templateUrl: 'modules/tweets/views/view-tweet.client.view.html'
		}).
		state('tweets.edit', {
			url: '/:tweetId/edit',
			templateUrl: 'modules/tweets/views/edit-tweet.client.view.html'
		});
	}
]);