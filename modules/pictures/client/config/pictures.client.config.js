'use strict';

// Configuring the Pictures module
angular.module('pictures').run(['Menus',
	function(Menus) {
		// Add the Pictures dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Pictures',
			state: 'pictures.list',
			icon: 'picture',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'pictures', {
			title: 'List Pictures',
			state: 'pictures.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'pictures', {
			title: 'Create Picture',
			state: 'pictures.create'
		});

	}
]);
