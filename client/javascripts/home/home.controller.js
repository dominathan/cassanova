require('./home.service');

(function() {
  'use strict'

  angular
    .module('cassanova')
    .controller('HomeController', [
      '$scope',
      'HomeServices',
      'Flash',
      'SocketService',
      function ($scope,HomeServices,Flash,SocketService) {
        $scope.currentPage = 1;
        $scope.numPerPage = 9;
        $scope.targets = [];
        $scope.maxSize = 3;

        SocketService.on('new:conversation',function(convo) {
          if(convo.convos.received) {
            var message = "<strong> New Message! </strong><a href='/#/account/" + convo.convos.fake_account_id + "/match/" + convo.convos.target_id + "/messages" + "'>Click to view and respond!</a>"
            Flash.create('success',message,0,{},true);
          }
        })

        HomeServices.getTargets()
        .then(function(data) {

          data.data.forEach(function(el) {
            el.age = calculateAge(el.birth_date);
          })
          $scope.targets = data.data;
          $scope.$watch('currentPage + numPerPage', function() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage)
            var end = begin + $scope.numPerPage;
            $scope.filteredTargets = $scope.targets.slice(begin, end);
          });
        });

        /* Utiltiy */
        function calculateAge(birthday) {
          var jsBirthday = new Date(birthday);
          var ageDifMs = Date.now() - jsBirthday.getTime();
          var ageDate = new Date(ageDifMs);
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        }

    }])
})();
