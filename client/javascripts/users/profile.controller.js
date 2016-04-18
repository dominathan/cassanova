(function() {
  'use strict';
  angular
  .module('users')
  .controller('ProfileController',function($http,$scope, $auth,UserService, Flash,$window) {
    $scope.loading = false;

    UserService.getProfile()
    .success(function(data) {
      $scope.user = data;
    })

    UserService.getTinderInfo()
    .then(function(data) {
      console.log('match', data)
      $scope.myAccount = data.data;
    }).catch(function(err) {
      console.log('No match', err)
    })


  $scope.tinderizer = function(fb) {
    $scope.loading = true
    UserService.tinderizer(fb)
    .success(function(data) {
      var message = "<strong>Your account has been added successfully. Visit Profile -> My Matches to select the ones you want help dating!</strong>"
      Flash.create('success',message,0,{},true);
    })
    .error(function(err) {
      console.log('something went wrong', err);
      var message = "<strong> Failed to access your tinder account: Please try again in a few minutes.</strong>"
      Flash.create('danger',message,0,{},true);
    })
    .finally(function() {
      $scope.loading = false;
    })
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
