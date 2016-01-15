(function() {
  'use strict';

  angular
    .module('cassanova')
    .factory('HomeServices', function($http, $q, $cacheFactory) {
      var targetUrl = "/fake_account/:fake_account_id/targets/";

      var getTargets = function(fakeAcccountID) {
        var url = "/fake_account/" + fakeAcccountID + "/targets/";
        return $http.get(url);
      }

      return {
        getTargets: getTargets
      }

    })

})()
