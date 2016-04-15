(function() {
  'use strict';

  angular
    .module('cassanova')
    .factory('MessageServices',function($q,$http,$cacheFactory) {

      var getMessages = function(fakeAccountID,targetID) {
        var url = "/api/fake_accounts/" + "dont_matter" + "/targets/" + targetID;
        return $http.get(url);
      }

      var getMostRecent = function() {
        var url = '/api/fake_accounts/getMostRecentConvos'
        return $http.get(url);
      }

      var getMatch = function(matchId) {
        return $http.get('/api/targets/' + matchId);
      }

      return {
        getMessages: getMessages,
        getMostRecent: getMostRecent,
        getMatch: getMatch
      }
    })
})();
