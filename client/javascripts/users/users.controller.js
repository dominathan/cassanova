(function() {
  'use strict';

  angular
    .module('users')
    .controller('UsersController', function($scope,$rootScope, UserService, $location, $window, AuthenticationService) {
      $rootScope.isSignedIn = false;
      if(AuthenticationService.isAuthenticated && $window.sessionStorage.token) {
        $rootScope.isSignedIn = true;
      }

      $scope.login = function login(user) {
        if (user.email && user.password) {
          UserService.login(user).success(function(data) {
            AuthenticationService.isLogged = true;
            $window.sessionStorage.token = data.token;
            $rootScope.isSignedIn = true;
            $rootScope.currentUser = data.username;
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
          $rootScope.isSignedIn = true;
          $rootScope.currentUser = user.username;
          $location.path("/");
        })
        .error(function(err,data) {
          console.log(status);
          console.log(data);
        })
      }

      $rootScope.logout = function logout() {
        if (AuthenticationService.isLogged) {
          $rootScope.currentUser = null;
          $rootScope.isSignedIn = false;
          AuthenticationService.isLogged = false;
          delete $window.sessionStorage.token;
          $location.path('/')
        }
      }


    })

}());
