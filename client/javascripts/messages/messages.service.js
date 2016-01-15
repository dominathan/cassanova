(function() {
  'use strict';

  angular
    .module('cassanova')
    .factory('MessageServices',function($q,$http,$cacheFactory) {


      var getMessages = function(fakeAccountID,targetID) {
        var url = "/fake_account/" + fakeAccountID + "/targets/" + targetID;
        return $http.get(url);
      }

      return {
        getMessages: getMessages
      }
    })
})();
