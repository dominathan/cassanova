

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
        .when('/signup', {
          template: require('./views/register.html'),
          controller: 'UsersController'
        })
        .when('/logout', {
          template: null,
          controller: 'UsersController'
        })
        .when('/profile', {
          template: require('./views/profile.html'),
          controller: "ProfileController",
          resolve: {
            authenticated: function($q, $location, $auth) {
               var deferred = $q.defer();

               if (!$auth.isAuthenticated()) {
                 $location.path('/login');
               } else {
                 deferred.resolve();
               }

               return deferred.promise;
             }
          }
        })
    });

}());


require('./users.controller');
require('./users.service');
require('./directives/passwordMatch');
require('./directives/passwordStrength');
require('./profile.controller');
