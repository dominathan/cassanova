(function() {
  'use strict';

  angular
    .module('users')
    .controller('ResetPasswordController', function($scope, UserService, $location, $routeParams, Flash) {

      $scope.sendEmail = function(user) {
        UserService.sendResetPasswordEmail(user)
        .then(function(success) {
          var message = `<strong> ${success.data.message} </strong>`
          Flash.create('success',message,0,{},true);
        })
        .catch(function(err) {
          var message = `<strong> ${err.data.error} </strong>`
          Flash.create('danger',message,0,{},true);
        })
      }

      $scope.resetPassword = function(user) {
        UserService.resetPassword(user,$routeParams.token)
        .then(function(success) {
          var message = `<strong> ${success.data.message} </strong>`
          Flash.create('success',message,0,{},true);
          $location.path('/login');
        })
        .catch(function(err) {
          var message = `<strong> ${err.data.message} </strong>`
          Flash.create('danger',message,0,{},true);
        })
      }

    })

}());
