'use strict';

module.exports = {
	client: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/mdi/css/materialdesignicons.min.css',
				'public/lib/angular-material/angular-material.min.css'
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-aria/angular-aria.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-material/angular-material.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/angular-file-upload/angular-file-upload.min.js',
				'public/lib/angular-gravatar/build/angular-gravatar.min.js',
				'public/lib/angular-timeago/dist/angular-timeago.min.js',
				'public/lib/angular-img-fallback/angular.dcb-img-fallback.min.js',
				'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	}
};
