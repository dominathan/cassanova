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
      function($scope,$routeParams,$location,ResponseService,MessageServices) {

        MessageServices.getMessages($routeParams.account_id,$routeParams.match_id).then(function(messages) {
          console.log(messages);
          window.glob = messages.data;
          $scope.messages = messages.data;
        });

        $scope.getResponses = function(conversationID) {
          ResponseService.getResponses(conversationID)
            .then(function(data) {
              console.log(data);
              if (data.length === 0) {
                $scope.responses = [{ response_text: "Be the first to start a conversation",
                                      conversation_id: null,
                                      total_votes: null }];
              } else {
                $scope.responses = data;
              }
            });
        };

        $scope.submitResponse = function(response) {
          if(response) {
            var conversation_id = getConversationID();
            // What if there is no conversation to begin with?
            ResponseService.submitResponse(response,conversation_id)
              .then(function(data) {
                var newObj = data.data;
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
              $scope.responses.forEach(function(el) {
                if(el.id === data.data.response_id) {
                  el.total_votes = data.data.total_votes;
                }
              });
            })
        }

        $scope.submitDownvote = function(responseId) {
          var convoId = getConversationID();
          ResponseService.submitVote(responseId,convoId,'down')
            .then(function(data) {
              $scope.responses.forEach(function(el) {
                if(el.id === data.data.response_id) {
                  el.total_votes = data.data.total_votes;
                }
              });
            })
        }

        function getConversationID() {
          var elm = angular.element($('.iphone-container').children()[$('.iphone-container').children().length - 1]);
          return elm.children().data('conversationId');
        }

      }
    ]);
})()
