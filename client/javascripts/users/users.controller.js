(function() {
  'use strict';

  angular
    .module('users')
    .controller('UsersController', function($scope, UserService, $location, $window, Flash,$auth) {
      // $rootScope.isSignedIn = false;
      // if(AuthenticationService.isAuthenticated && $window.sessionStorage.token) {
      //   $rootScope.isSignedIn = true;
      // }

      $scope.login = function login(user) {
        if (user.email && user.password) {
          $auth.login({
            email: user.email,
            password: user.password
          })
          .then(function(res) {
            console.log("LOGIN", res)
            var message = "<strong> Welcome Back, "+ res.data.username +"  </strong>"
            Flash.create('success',message,0,{},true);
            $location.path('/');
          })
          .catch(function(err) {
            console.log("FAIL LOGIN", err);
              var message = "<strong> Failed to login: "+ err.data.error +"  </strong>"
              Flash.create('danger',message,0,{},true);
          })
        }
      }

      $scope.signup = function(user) {
        if(!user.username || !user.email || !user.password || !user.confirmPassword || user.password !== user.confirmPassword) {
          // flash message that shit isn't work
          return
        }
        $auth.signup({
         username: user.username,
         email: user.email,
         password: user.password
       })
       .then(function(res) {
         var message = "<strong> Welcome Back, "+ res.data.username +"  </strong>"
         Flash.create('success',message,0,{},true);
         $location.path('/login');
       })
       .catch(function(err) {
         console.log("FAIL LOGIN", err);
           var message = "<strong> Failed to login: "+ err.data.error +"  </strong>"
           Flash.create('danger',message,0,{},true);
       })
      }

    })

}());
