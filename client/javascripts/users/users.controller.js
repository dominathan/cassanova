(function() {
  'use strict';

  angular
    .module('users')
    .controller('UsersController', function($scope,$rootScope, UserService, $location, $window, AuthenticationService) {

      $scope.login = function login(user) {
        if (user.email && user.password) {
          UserService.login(user).success(function(data) {
            AuthenticationService.isLogged = true;
            $window.sessionStorage.token = data.token;
            $rootScope.currentUser = user.email;
            $location.path("/");
          }).error(function(status, data) {
            console.log(status);
            console.log(data);
          });
        }
      }

      $scope.signup = function(user) {
        if(!user.username || !user.email || !user.password || !user.confirmPassword || user.password !== user.confirmPassword) {
          // flash message that shit isn't work
          return
        }
        UserService.signup(user).success(function(data) {
          AuthenticationService.isLogged = true;
          $window.sessionStorage.token = data.token;
          $rootScope.currentUser = user.username;
          $location.path("/");
        })
        .error(function(err,data) {
          console.log(status);
          console.log(data);
        })
      }

      $scope.logout = function logout() {
        if (AuthenticationService.isLogged) {
          $rootScope.currentUser = null;
          AuthenticationService.isLogged = false;
          delete $window.sessionStorage.token;
        }
      }


    })

}());
