angular
  .module('cassanova')
  .controller('NavbarCtrl', function($scope, $auth, Flash,$location) {
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

  });
