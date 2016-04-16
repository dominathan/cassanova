(function() {
  'use strict';
  angular
  .module('users')
  .controller('ProfileController',function($http,$scope, $auth,UserService, Flash,$window) {

    UserService.getProfile()
    .success(function(data) {
      $scope.user = data;
    })

    // UserService.getTinderInfo()
    // .then(function(data) {
    //   $scope.myAccount = data.data;
    // }).catch(function(err) {
    //   console.log('getting data', err)
    // })
  

  $scope.tinderizer = function(fb) {
    UserService.tinderizer(fb)
    .then(function(data) {
      // console.log(data);
      // $scope.myAccount = data.data
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




})

}());
