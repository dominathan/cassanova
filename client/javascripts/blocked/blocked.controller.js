(function() {
  'use strict';
    angular
      .module('blocked')
      .controller('BlockedController', function($scope,BlockedService, HomeServices, MessageServices,$uibModal,$q,$routeParams) {

        $scope.blocks = [];
        var targetId = $routeParams.id
        BlockedService.getBlocks()
          .then(function(data) {
            $scope.blocks = data.data
        })

        MessageServices.getMatch(targetId)
        .then(function(data) {
          $scope.match = data.data[0];
        })

        $scope.getMatchInfo = function() {
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            template: require("../messages/views/profileModal.html"),
            size: 'md',
            controller: 'ModalProfileCtrl',
            resolve: {
              match: $scope.match
            }
          })
        }


        if($routeParams.id) {
          MessageServices.getMessages(1,$routeParams.id)
          .then(function(data) {
            data.data.conversations.forEach(function(el){
               el.message = el.message.replace(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/gi,"{PHONE NUMBER REMOVED}").replace(/864-641-5380/gi,"{PHONE NUMBER REMOVED}").replace(/\d{9}/gi,"PHONE NUMBER REMOVED");
            })
            if(data.data.conversations[0] && data.data.conversations[0].name) {
              $scope.match = data.data.conversations[0].name
            }
            $scope.messages = data.data.conversations;
          })
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
}());
