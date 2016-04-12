angular
  .module('cassanova')
  .controller('NavbarCtrl', function($scope, $auth, Flash,$location,$aside) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.logout = function logout() {
      if (!$auth.isAuthenticated()) {
        return;
      }
      $auth.logout()
      .then(function(data) {
        var message = "<strong>Signed out successfully.</strong>"
        Flash.create('success',message,0,{},true);
        $location.path('/')
      })
    }

   $scope.openAside = function(position, backdrop) {
      $scope.asideState = {
        open: true,
        position: position
      };

      function postClose() {
        $scope.asideState.open = false;
      }

      $aside.open({
        template: `<div class="modal-header">
                         <h3 class="modal-title">ngAside</h3>
                     </div>
                     <div class="modal-body">
                       Look i'm in aside.
                     </div>
                     <div class="modal-footer">
                         <button class="btn btn-primary" ng-click="ok($event)">OK</button>
                         <button class="btn btn-warning" ng-click="cancel($event)">Cancel</button>
                     </div>`,
        placement: position,
        size: 'sm',
        backdrop: backdrop,
        controller: function($scope, $uibModalInstance) {
          $scope.ok = function(e) {
            $uibModalInstance.close();
            e.stopPropagation();
          };
          $scope.cancel = function(e) {
            $uibModalInstance.dismiss();
            e.stopPropagation();
          };
        }
      }).result.then(postClose, postClose);
    }


  });
