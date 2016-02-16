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
          data.data.forEach(function(elem,idx) {
            if(idx % 6 === 0) {
              elem.age = calculateAge(new Date(elem.birth_date));
              $scope.targets.push(elem);
            }
          });
          window.glob = data.data;
        });

        function calculateAge(birthday) {
          var ageDifMs = Date.now() - birthday.getTime();
          var ageDate = new Date(ageDifMs);
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        }

    }])
})();
