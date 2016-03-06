(function () {
  'use strict'
  angular
    .module("cassanova")
    .factory('ResponseService', ["$http","$q",function ($http,$q) {

      function getResponses(conversationID,targetId) {
        if(!conversationID) {
          var url = "/api/fake_accounts/targets/" + targetId + "/responses/" + '1';
        } else {
          var url = "/api/fake_accounts/targets/" + targetId + "/responses/" + conversationID;
        }
        return $http.get(url);
      }

      return {
        getResponses: getResponses,
      };

    }])
})();
