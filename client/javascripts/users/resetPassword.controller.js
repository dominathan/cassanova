(function() {
  'use strict';

  angular
    .module('users')
    .controller('ResetPasswordController', function($scope, UserService, $location, $routeParams) {

      $scope.sendEmail = function(user) {
        UserService.sendResetPasswordEmail(user)
        .then(function(success) {
          console.log(success);
        })
        .catch(function(err) {
          console.log(err);
        })
      }

      $scope.resetPassword = function(user) {
        UserService.resetPassword(user,$routeParams.token)
        .then(function(success) {
          console.log(success);
          $location.path('/profile');
        })
        .catch(function(err) {
          console.log(err);
        })
      }

    })

}());
