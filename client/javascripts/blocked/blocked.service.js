
(function() {
  'use strict';

  angular
    .module('blocked')
    .factory('BlockedService', function($http) {

      var getBlocks = function(fakeAcccountID) {
        var url = "/api/fake_accounts/1/allTargs/blocked";
        return $http.get(url);
      }

      var getPhotos = function(tinder_id) {
        var url = "/api/fake_accounts/photos/target_id/" + tinder_id;
        return $http.get(url);
      }

      return {
        getBlocks: getBlocks,
        getPhotos: getPhotos
      }

    })

})()
