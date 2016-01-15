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
        var url = "/responses/" + conversationID;
        return $http.get(url);
      }

      function submitResponse(response, conversation_id) {
        var url = '/responses/';
        var response = { response: { response_text: response,
                                     conversation_id: conversation_id }
                        }
        return $http.post(url, response);
      }

      function submitVote(response, conversation_id, voteType) {
        var url = "/votes/";
        var submission;
        if(voteType === 'up') {
          submission = { vote: {response_id: response,
                                conversation_id: conversation_id,
                                up: 1,
                                down: 0}
                        }
        } else {
          submission = { vote: {response_id: response,
                                conversation_id: conversation_id,
                                up: 0,
                                down: 1}
                        }
        }
        return $http.post(url, submission);
      }

      return {
        getResponses: getResponses,
        submitResponse: submitResponse,
        submitVote: submitVote
      };

    }])
})();
