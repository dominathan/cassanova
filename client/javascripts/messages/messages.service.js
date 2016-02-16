(function() {
  'use strict';

  angular
    .module('cassanova')
    .factory('MessageServices',function($q,$http,$cacheFactory) {


      var getMessages = function(fakeAccountID,targetID) {
        var url = "/api/fake_accounts/" + fakeAccountID + "/targets/" + targetID;
        return $http.get(url);
      }

      return {
        getMessages: getMessages
      }
    })
})();
