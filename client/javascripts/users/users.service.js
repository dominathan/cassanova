(function() {
  'use strict';

  angular
    .module('users')
    .factory('UserService', function($http) {

        function login(user) {
          return $http.post('/api/auth/login', user);
        };

        function logout() {
          return
        };

        function signup(user) {
          return $http.post('/api/auth/signup', user);
        }

        return {
          login: login,
          logout: logout,
          signup: signup
        };


    });

}());
