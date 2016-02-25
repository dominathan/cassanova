(function() {
  'use strict';

  angular
    .module('cassanova')
    .factory('MessageServices',function($q,$http,$cacheFactory) {


      var getMessages = function(fakeAccountID,targetID) {
        console.log()
        var url = "/api/fake_accounts/" + "dont_matter" + "/targets/" + targetID;
        return $http.get(url);
      }

      return {
        getMessages: getMessages
      }
    })
})();
