(function() {
  'use strict';

  angular
  .module('users')
  .controller('UserMatchesController',function($scope, $auth, UserService) {

    UserService.getUserMatches()
    .then(function(data) {
      data.data.forEach(function(el) {
        el.age = calculateAge(el.birth_date);
      })
      $scope.targets = data.data;
    })
    .catch(function(err) {
    })

    $scope.updateTargetAccesibility = function(target,toggle) {
      UserService.updateTargetAccesibility(target,!!toggle)
      .then(function(data) {
      })
    }

    function calculateAge(birthday) {
      var jsBirthday = new Date(birthday);
      var ageDifMs = Date.now() - jsBirthday.getTime();
      var ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

  })

}());
