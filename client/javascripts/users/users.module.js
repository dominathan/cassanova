

(function() {
  'use strict';
  angular
    .module('users',['ngMessages'])
    .config(function($routeProvider) {
      $routeProvider
        .when('/login', {
          template: require('./views/login.html'),
          controller: 'UsersController'
        })
        .when('/register', {
          template: require('./views/register.html'),
          controller: 'UsersController'
        })
    });

}());


require('./users.controller');
require('./users.service');
require('./directives/passwordMatch');
require('./directives/passwordStrength');
require('./authentication.service');
