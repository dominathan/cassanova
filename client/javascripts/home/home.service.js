
(function() {
  'use strict';

  angular
    .module('cassanova')
    .factory('HomeServices', function($http, $q, $cacheFactory) {

      var getTargets = function(fakeAcccountID) {
        var url = "api/fake_accounts/" + fakeAcccountID + "/targets/";
        return $http.get(url);
      }

      var getPhotos = function(tinder_id) {
        var url = "/api/fake_accounts/photos/target_id/" + tinder_id;
        return $http.get(url);
      }

      return {
        getTargets: getTargets,
        getPhotos: getPhotos
      }

    })

})()
