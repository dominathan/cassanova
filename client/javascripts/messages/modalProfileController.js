angular
  .module('cassanova')
  .controller('ModalProfileCtrl', function ($scope, $uibModalInstance,$location,match, HomeServices,$routeParams) {
    if(match) {
      $scope.match = match;
    }

    HomeServices.getPhotos($routeParams.match_id || $routeParams.id)
    .then(function(data) {
      $scope.photos = data.data;
    })

    $scope.ok = function () {
      $uibModalInstance.close();
    };

});
