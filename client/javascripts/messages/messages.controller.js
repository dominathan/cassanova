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
          $scope.messages = messages.data.conversations;
          $scope.secondsLeftToSend = secondsLeft(messages.data.time);
        });

        $scope.getResponses = function(conversationID) {
          ResponseService.getResponses(conversationID)
          .then(function(data) {
            if (data.data.length === 0) {
              $scope.responses = [{
                                    response_text: "Be the first to start a conversation",
                                    conversation_id: null,
                                    total_votes: null
                                  }];
            } else {
              var responsesWithTotalVotes = totalVotes(data.data);
              $scope.responses = responsesWithTotalVotes;
            }
          });
        };

        $scope.submitResponse = function(response) {
          if(response) {
            var conversation_id = getConversationID();
            // What if there is no conversation to begin with?
            SocketService.emit('new:response', {
                                                  response_text: response,
                                                  conversation_id: conversation_id
                                                }
                               )
            $scope.newResponse = "";
          }
        };

        SocketService.on('new:response',function(response) {
          var newObj = response;
          newObj.total_votes = 0;
          $scope.responses.push(newObj)
        })

        $scope.submitUpvote = function(responseId) {
          var convoId = getConversationID();
          var voteObj = {
                          response_id: responseId,
                          conversation_id: convoId,
                          up: 1,
                          down: 0
                        }
          SocketService.emit('new:vote', voteObj);
        }

        $scope.submitDownvote = function(responseId) {
          var convoId = getConversationID();
          var voteObj = {
                          response_id: responseId,
                          conversation_id: convoId,
                          up: -1,
                          down: 0
                        }

          SocketService.emit('new:vote', voteObj);
        }

        SocketService.on('new:vote',function(resp) {
          var additionalVotes = resp[0].up - resp[0].down;
            $scope.responses.forEach(function(el) {
              if(el.id === resp[0].response_id) {
                el.total_votes = parseInt(el.total_votes);
                el.total_votes += additionalVotes;
              }
            });
        })
        /*
         * UTILITY FUNCTIONS
         */

        function getConversationID() {
          var elm = angular.element($('.iphone-background').children()[$('.iphone-background').children().length - 1]);
          return elm.children().data('conversationId');
        }

        function totalVotes(arrayOfResponses) {
          arrayOfResponses.forEach(function(resp) {
            resp.total_votes = parseInt(resp.total_votes,10) || 0;
          });
          return arrayOfResponses;
        };

        function secondsLeft(time) {
          var time = new Date(time);
          if(time.getSeconds() !== 0) {
            var min = (10 - time.getMinutes() % 10 - 1) * 60;
            var seconds = 60 - time.getSeconds();
            var secondsUntil = min + seconds;
          } else {
            var secondsUntil = (10 - time.getMinutes() % 10) * 60;
          }
          return secondsUntil;
        };

      }
    ]);
})()
