(function() {
  'use strict';

  angular
    .module('cassanova')
    .factory('HomeServices', function($http, $q, $cacheFactory) {
      var targetUrl = "/fake_accounts/:fake_account_id/targets/";

      var getTargets = function(fakeAcccountID) {
        var url = "api/fake_accounts/" + fakeAcccountID + "/targets/";
        return $http.get(url);
      }

      return {
        getTargets: getTargets
      }

    })

})()
