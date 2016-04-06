require('./home.service');
require('./modalInstance.controller');
(function() {
  'use strict'
  angular
    .module('cassanova')
    .controller('HomeController',
      function ($scope,HomeServices,Flash,SocketService,$uibModal, $q) {
        $scope.currentPage = 1;
        $scope.numPerPage = 9;
        $scope.targets = [];
        $scope.maxSize = 3;
        $scope.animationsEnabled = true;

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
          var females = data.data.filter(function(el) {
            return el.gender === '1';
          });
          $scope.targets = females;
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

        $scope.open = function (size,target_id,name) {
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            template: `<div class="modal-header">
                           <h3 class="modal-title">Photos for ${name}</h3>
                       </div>
                       <div class="modal-body">
                           <ul>
                             <li ng-repeat="photo in photos">
                               <img ng-src="{{photo.photo_url}}" alt="" />
                             </li>
                           </ul>

                       </div>
                       <div class="modal-footer">
                           <button class="btn btn-primary" type="button" ng-click="ok()">OK</button>
                           </div>`,
            size: size,
            controller: 'ModalInstanceCtrl',
            resolve: {
              photos: function () {
                var $defer = $q.defer();
                HomeServices.getPhotos(target_id)
                  .then(function(data) {
                    $scope.photos = data.data;
                    $defer.resolve(data.data);
                });
                return $defer.promise;
              }
            }
          });
        };


    })
})();
