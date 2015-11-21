'use strict';

// Setting up gravatar defaults
angular.module('theme').config(['gravatarServiceProvider',
  function(gravatarServiceProvider) {
    gravatarServiceProvider.defaults = {
      size: 100,
      default: 'retro' // Mystery man as default for missing avatars
    };

    // Use https endpoint
    gravatarServiceProvider.secure = true;
  }
]);
