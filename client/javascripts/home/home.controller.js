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
          console.log(data);
          data.data.forEach(function(elem,idx) {
            if(idx % 6 === 0) {
              $scope.targets.push(elem);
            }
          });

        });

    }])
})();
