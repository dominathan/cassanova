angular
  .module('cassanova')
  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, photos) {
    $scope.photos = photos;

    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
});
