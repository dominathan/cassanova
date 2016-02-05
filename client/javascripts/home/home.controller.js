require('./home.service');

(function() {
  'use strict'

  angular
    .module('cassanova')
    .controller('HomeController', [
      '$scope',
      'HomeServices',
      function ($scope,HomeServices) {
        HomeServices.getTargets().then(function(data) {
          console.log(data);
          $scope.targets = data.data;
        })

    }])
})()
