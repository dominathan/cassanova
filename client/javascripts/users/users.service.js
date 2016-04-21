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

        function getUserMatches() {
          return $http.get('/api/user-matches/targets');
        }

        function updateTargetAccesibility(target,toggle) {
          return $http.put('/api/user-matches/targets/' + target.target_id, {accessible: toggle});
        }

        function sendResetPasswordEmail(user) {
          return $http.post('/auth/send-reset-password-email/', user);
        }

        function resetPassword(user, token) {
          return $http.post('/auth/reset/' + token, user);
        }

        return {
          login: login,
          logout: logout,
          signup: signup,
          getProfile: getProfile,
          updateProfile: updateProfile,
          tinderizer: tinderizer,
          getTinderInfo: getTinderInfo,
          getUserMatches: getUserMatches,
          updateTargetAccesibility: updateTargetAccesibility,
          sendResetPasswordEmail: sendResetPasswordEmail,
          resetPassword: resetPassword
        };


    });

}());
