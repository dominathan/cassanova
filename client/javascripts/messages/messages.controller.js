require('./messages.service');
require('../responses/responses.service');

(function() {
  'use strict';

  angular
    .module("cassanova")
    .controller('MessagesController',[
      '$scope',
      '$routeParams',
      '$location',
      'ResponseService',
      'MessageServices',
      'SocketService',
      function($scope,$routeParams,$location,ResponseService,MessageServices) {
        $scope.responses = [];

        MessageServices.getMessages($routeParams.account_id,$routeParams.match_id).then(function(messages) {
          $scope.messages = messages.data;
        });

        $scope.getResponses = function(conversationID) {
          ResponseService.getResponses(conversationID)
            .then(function(data) {
              console.log("ALL RESPONESS: ", data);
              if (data.data.length === 0) {
                $scope.responses = [{ response_text: "Be the first to start a conversation",
                                      conversation_id: null,
                                      total_votes: null }];
              } else {
                data.data.forEach(function(el) {
                  if(el.total_ups) {
                    if(el.total_downs) {
                      el.total_votes = el.total_ups - el.total_downs;
                    }
                    el.total_votes = el.total_ups;
                  } else {
                    el.total_votes = 0
                  }
                });
                $scope.responses = data.data;
              }
            });
        };

        $scope.submitResponse = function(response) {
          if(response) {
            var conversation_id = getConversationID();
            // What if there is no conversation to begin with?
            ResponseService.submitResponse(response,conversation_id)
              .then(function(data) {
                var newObj = data.data.pop();
                newObj.total_votes = 0;
                $scope.responses.push(newObj);
              });
            angular.element($("input[type='text']").val(""));
          }
        };

        $scope.submitUpvote = function(responseId) {
          var convoId = getConversationID();
          ResponseService.submitVote(responseId,convoId,'up')
            .then(function(data) {
              var additionalVotes = data.data[0].up - data.data[0].down;
              $scope.responses.forEach(function(el) {
                if(el.id === data.data[0].response_id) {
                  el.total_votes = parseInt(el.total_votes);
                  el.total_votes += additionalVotes;
                }
              });
            })
        }

        $scope.submitDownvote = function(responseId) {
          var convoId = getConversationID();
          ResponseService.submitVote(responseId,convoId,'down')
            .then(function(data) {
              var additionalVotes = data.data[0].up - data.data[0].down;
              $scope.responses.forEach(function(el) {
                if(el.id === data.data[0].response_id) {
                  el.total_votes = parseInt(el.total_votes);
                  el.total_votes += additionalVotes;
                }
              });
            })
        }

        function getConversationID() {
          var elm = angular.element($('.iphone-background').children()[$('.iphone-background').children().length - 1]);
          return elm.children().data('conversationId');
        }

      }
    ]);
})()
