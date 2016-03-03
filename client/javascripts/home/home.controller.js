require('./home.service');

(function() {
  'use strict'

  angular
    .module('cassanova')
    .controller('HomeController', [
      '$scope',
      'HomeServices',
      function ($scope,HomeServices) {
        $scope.targets = []
        HomeServices.getTargets().then(function(data) {
          data.data.forEach(function(el) {
            el.age = calculateAge(el.birth_date);
          })
          $scope.targets = data.data;
        });

        function calculateAge(birthday) {
          var jsBirthday = new Date(birthday);
          var ageDifMs = Date.now() - jsBirthday.getTime();
          var ageDate = new Date(ageDifMs);
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        }

    }])
})();
