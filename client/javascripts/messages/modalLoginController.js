angular
  .module('cassanova')
  .controller('ModalLoginCtrl', function ($scope, $uibModalInstance,$location) {


    $scope.login = function() {
      $uibModalInstance.close();
      $location.path("/login")
    }

    $scope.signup = function() {
      $uibModalInstance.close();
      $location.path("/registration")
    }

    $scope.ok = function () {
      $uibModalInstance.close();
    };

});
