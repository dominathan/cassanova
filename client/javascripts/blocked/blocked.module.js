(function() {
  'use strict';
  angular.module('blocked',[])
    .config(function($routeProvider) {
    $routeProvider
        .when('/blocked-matches', {
          template: require('./views/blocked.html'),
          controller: 'BlockedController'
        })
        .when('/blocked-matches/:id', {
          template: require('./views/blocked-person.html'),
          controller: 'BlockedController'
        })

  });
}());


require('./blocked.controller');
require('./blocked.service');
