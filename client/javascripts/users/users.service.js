(function() {
  'use strict';

  angular
    .module('users')
    .factory('UserService', function($http) {

        function login(user) {
          return $http.post('/auth/login', user);
        };

        function logout() {
          return
        };

        function signup(user) {
          return $http.post('/auth/signup', user);
        }

        function getProfile() {
          return $http.get('/api/me');
        }

        function updateProfile(user) {
          return $http.put("/api/me",user);
        }

        function tinderizer(fb) {
          return $http.post('/auth/getTinderized', fb);
        }

        function getTinderInfo() {
          return $http.get('/auth/getTinderInfo/');
        }

        return {
          login: login,
          logout: logout,
          signup: signup,
          getProfile: getProfile,
          updateProfile: updateProfile,
          tinderizer: tinderizer,
          getTinderInfo: getTinderInfo
        };


    });

}());
