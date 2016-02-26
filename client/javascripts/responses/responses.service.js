(function () {
  'use strict'
  angular
    .module("cassanova")
    .factory('ResponseService', ["$http","$q",function ($http,$q) {

      function getResponses(conversationID) {
        var deferred = $q.defer();
        if(!conversationID) {
          deferred.resolve([{ response_text: "Be the first to start a conversation",
                              conversation_id: null,
                              total_votes: null }])
          return deferred.promise;
        }
        var url = "/api/fake_accounts/responses/" + conversationID;
        return $http.get(url);
      }

      return {
        getResponses: getResponses,
      };

    }])
})();
