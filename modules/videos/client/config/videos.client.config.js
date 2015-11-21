'use strict';

// Configuring the Videos module
angular.module('videos').run(['Menus',
  function(Menus) {
    // Add the Video dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Videos',
      state: 'videos.slick',
      icon: 'video',
      isPublic: true,
      position: 3
    });
  }
]);
