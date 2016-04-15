(function() {
  'use strict';
  angular
  .module('users')
  .controller('ProfileController',function($scope, $auth,UserService, Flash,$window) {

    UserService.getProfile()
    .success(function(data) {
      $scope.user = data;
      $scope.myAccount = data.data;
      // console.log(data);
    })
    .error(function(error) {
      console.log(eror)
    });

  $scope.tinderizer = function(fb) {
    UserService.tinderizer(fb)
    .then(function(data) {
      // console.log(data);
      $scope.myAccount = data.data
    });
  }

  $scope.updateProfile = function(user) {
    UserService.updateProfile({
      username: user.username,
      email: user.email
    }).success(function(data) {
      if(data.name === "error") {
        var message = "<strong> Failed to login: "+ data.detail +"  </strong>";
        Flash.create('danger',message,0,{},true);
      } else {
        $auth.setToken(data.token);
        var message = "<strong> Profile Updated: "+ data.username +"  </strong>";
        Flash.create('success',message,0,{},true);
      }
    }).error(function(err) {
        var message = "<strong> Failed to login: "+ err.data.error +"  </strong>";
        Flash.create('danger',message,0,{},true);
    })
  };

  UserService.getTinderInfo()
  .then(function(data) {
    console.log(data);
    $scope.myAccount = data.data;
  });



})

}());
