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
      function($scope,$routeParams,$location,ResponseService,MessageServices,SocketService) {
        $scope.responses = [];

        MessageServices.getMessages($routeParams.account_id,$routeParams.match_id)
        .then(function(messages) {
          $scope.messages = messages.data;
        });

        $scope.getResponses = function(conversationID) {
          console.log("CONVO ID", conversationID);
          ResponseService.getResponses(conversationID)
          .then(function(data) {
            console.log("RESPONSESE", data);
            if (data.data.length === 0) {
              $scope.responses = [{ response_text: "Be the first to start a conversation",
                                    conversation_id: null,
                                    total_votes: null }];
            } else {
              var responsesWithTotalVotes = totalVotes(data.data);
              $scope.responses = responsesWithTotalVotes;
              window.glob = responsesWithTotalVotes;
            }
          });
        };

        $scope.submitResponse = function(response) {
          if(response) {
            var conversation_id = getConversationID();
            // What if there is no conversation to begin with?
            SocketService.emit('new:response', {response_text: response, conversation_id: conversation_id})
            $scope.newResponse = "";
          }
        };

        SocketService.on('new:response',function(response) {
          var newObj = response.pop();
          newObj.total_votes = 0;
          $scope.responses.push(newObj)
        })

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


        /*
         * UTILITY FUNCTIONS
         */

        function getConversationID() {
          var elm = angular.element($('.iphone-background').children()[$('.iphone-background').children().length - 1]);
          return elm.children().data('conversationId');
        }

        function totalVotes(arrayOfResponses) {
          arrayOfResponses.forEach(function(resp) {
            if(resp.total_ups) {
              if(resp.total_downs) {
                resp.total_votes = resp.total_ups - resp.total_downs;
              }
              resp.total_votes = resp.total_ups;
            } else {
              resp.total_votes = 0;
            }
            resp.total_votes = parseInt(resp.total_votes,10);
          });
          return arrayOfResponses;
        };

      }
    ]);
})()
