(function() {
  'use strict';
  angular
  .module('users')
  .controller('ProfileController',function($scope, $auth,UserService) {



      UserService.getProfile()
      .success(function(data) {
        console.log(data);
        $scope.user = data;
      })
      .error(function(error) {
        console.log(eror)
      });

  /**
   * Update user's profile information.
   */
  $scope.updateProfile = function() {
    Account.updateProfile({
      displayName: $scope.user.displayName,
      email: $scope.user.email
    }).then(function() {
      // $alert({
      //   content: 'Profile has been updated',
      //   animation: 'fadeZoomFadeDown',
      //   type: 'material',
      //   duration: 3
      // });
    });
  };

})

}());
