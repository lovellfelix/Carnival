'use strict';

// Configuring the Tweets module
angular.module('tweets').run(['Menus',
  function(Menus) {
    // Add the Tweets dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Tweets',
      state: 'tweets.list',
      icon: 'pound-box',
      type: 'dropdown',
      position: 2,
      isPublic: true
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'tweets', {
      title: 'List Tweets',
      state: 'tweets.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'tweets', {
      title: 'Create Tweet',
      state: 'tweets.create'
    });
  }
]);
