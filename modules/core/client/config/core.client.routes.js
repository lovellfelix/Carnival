'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

		$stateProvider.
			state('not-found', {
				url: '/not-found',
				templateUrl: 'modules/core/client/views/404.client.view.html'
			});
	}
]);
