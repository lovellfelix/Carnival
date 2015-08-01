'use strict';

// Configuring the Posts module
angular.module('posts').run(['Menus',
	function(Menus) {
		// Add the Posts dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Posts',
			state: 'posts.list',
			icon: 'google-circles-extended',
			position: 1,
			isPublic: true
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'posts', {
			title: 'List Posts',
			state: 'posts.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'posts', {
			title: 'Create Post',
			state: 'posts.create'
		});
	}
]);
