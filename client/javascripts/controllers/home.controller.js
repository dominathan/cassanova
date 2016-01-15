require('../services/home.service');

(function(){
  'use strict';

  angular
    .module('cassanova')
    .controller("HomeController", [
    '$scope',
    '$location',
    'HomeServices',
    function ($scope, $location, HomeServices) {
      HomeServices.getTargets(69).success(function(resp){
        $scope.targets = resp;
      });


  }]);

})()
