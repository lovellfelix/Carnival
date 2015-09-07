'use strict';

// Posts module config
angular.module('posts').config(['LightboxProvider',
	function(LightboxProvider) {
		// lightbox template url
		LightboxProvider.templateUrl = 'modules/posts/client/views/view-post.client.view.html';
	}
]);
