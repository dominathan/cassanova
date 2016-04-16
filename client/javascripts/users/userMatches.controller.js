(function() {
  'use strict';



  angular
  .module('users')
  .controller('UserMatchesController',function($scope, $auth, UserService) {

    UserService.getUserMatches()
    .then(function(data) {
      $scope.targets = data.data;
    })

    $scope.updateTargetAccesibility = function(target,toggle) {
      UserService.updateTargetAccesibility(target,!!toggle)
      .then(function(data) {
        console.log("RESPONSE", data.data[0]);
      })
    }

  })

}());
