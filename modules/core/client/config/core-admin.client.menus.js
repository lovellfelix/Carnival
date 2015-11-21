'use strict';

angular.module('core.admin').run(['Menus',
  function(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      icon: 'settings',
      type: 'dropdown',
      roles: ['admin'],
      positon: 10

    });
  }
]);
