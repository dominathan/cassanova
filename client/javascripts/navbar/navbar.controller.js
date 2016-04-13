angular
  .module('cassanova')
  .controller('NavbarCtrl', function($scope, $auth, Flash,$location,$aside,ChatService) {
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
        template: require('./views/chat-modal-aside.html'),
        placement: position,
        size: 'sm',
        backdrop: backdrop,
        controller: 'ChatsController'
      }).result.then(postClose, postClose);
    }


  });
