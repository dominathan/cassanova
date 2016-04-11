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

        function getProfile() {
          return $http.get('/api/me');
        }

        function updateProfile(user) {
          return $http.put("/api/me",user);
        }

        return {
          login: login,
          logout: logout,
          signup: signup,
          getProfile: getProfile,
          updateProfile: updateProfile
        };


    });

}());
