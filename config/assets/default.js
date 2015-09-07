'use strict';

module.exports = {
  client: {
    lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/mdi/css/materialdesignicons.css',
				'public/lib/angular-material/angular-material.css'
			],
			js: [
        'public/lib/jquery/dist/jquery.js',
        'public/lib/jquery-bridget/jquery.bridget.js',
        'publc/lib/get-style-property/get-style-property.js',
        'publc/lib/get-size/get-size.js',
        'publc/lib/eventEmitter/EventEmitter.js',
        'publc/lib/eventie/eventie.js',
        'publc/lib/doc-ready/doc-ready.js',
        'publc/lib/matches-selector/matches-selector.js',
        'publc/lib/outlayer/item.js',
        'publc/lib/outlayer/outlayer.js',
        'public/lib/masonry/dist/masonry.pkgd.min.js',
        'public/lib/imagesloaded/imagesloaded.pkgd.min.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-aria/angular-aria.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-material/angular-material.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-file-upload/angular-file-upload.js',
				'public/lib/angular-gravatar/build/angular-gravatar.js',
				'public/lib/angular-timeago/dist/angular-timeago.js',
        'public/lib/angular-img-fallback/angular.dcb-img-fallback.js',
				'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.js',
        'public/lib/angular-masonry/angular-masonry.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/twemoji/twemoji.js',
        'public/lib/angular-twemoji/dist/angular-twemoji.js',
        'public/lib/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js'
			],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
