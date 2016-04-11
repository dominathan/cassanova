(function() {
  'use strict';

  angular
    .module('users')
    .controller('UsersController', function($scope,$rootScope, UserService, $location, $window, AuthenticationService,Flash) {
      $rootScope.isSignedIn = false;
      if(AuthenticationService.isAuthenticated && $window.sessionStorage.token) {
        $rootScope.isSignedIn = true;
      }

      $scope.login = function login(user) {
        if (user.email && user.password) {
          UserService.login(user)
          .success(function(data) {
            AuthenticationService.isLogged = true;
            $window.sessionStorage.token = data.token;
            $rootScope.isSignedIn = true;
            $rootScope.currentUser = data.username;
            $location.path("/");
          }).error(function(err, status) {
            var message = "<strong> Failed to login: "+ err.error +"  </strong>"
            Flash.create('danger',message,0,{},true);
          });
        }
      }

      $scope.signup = function(user) {
        if(!user.username || !user.email || !user.password || !user.confirmPassword || user.password !== user.confirmPassword) {
          // flash message that shit isn't work
          return
        }
        UserService.signup(user)
        .success(function(data) {
          AuthenticationService.isLogged = true;
          $window.sessionStorage.token = data.token;
          $rootScope.isSignedIn = true;
          $rootScope.currentUser = user.username;
          var message = "<strong> Welcome: "+ user.username +"  </strong>"
          Flash.create('success',message,0,{},true);
          $location.path("/");
        })
        .error(function(err,status) {
          var message = "<strong> Failed to create account: "+ err.error +"  </strong>"
          Flash.create('danger',message,0,{},true);
        })
      }

      $rootScope.logout = function logout() {
        if (AuthenticationService.isLogged) {
          $rootScope.currentUser = null;
          $rootScope.isSignedIn = false;
          AuthenticationService.isLogged = false;
          delete $window.sessionStorage.token;
          var message = "<strong>Signed out successfully.</strong>"
          Flash.create('success',message,0,{},true);
          $location.path('/')
        }
      }

      // if($location.path('/profile')) {
        UserService.getProfile()
        .then(function(data) {
          $scope.user = data.data;
        })
      // }

      $scope.updateProfile = function(user) {
        UserService.updateProfile(user)
        .success(function(data) {
          if(data.name === "error") {
            var message = "<strong>Failed to update profile: "+data.detail +"</strong>"
            Flash.create('danger',message,0,{},true);
          } else {
            var message = "<strong>Updated your profile successfully.</strong>"
            Flash.create('success',message,0,{},true);
            $location.path('/');
          }

        }).error(function(err,status) {
          console.log("ERROR",err);
          console.log("status",data);
        })
      };


    })

}());
