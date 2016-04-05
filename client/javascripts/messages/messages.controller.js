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
      'Flash',
      function($scope,$routeParams,$location,ResponseService,MessageServices,SocketService,Flash) {
        $scope.responses = [];
        var targetId = $routeParams.match_id;

        MessageServices.getMostRecent()
        .then(function(mostRecent) {
          $scope.mostRecentConvos = mostRecent.data;
        });

        MessageServices.getMessages($routeParams.account_id,$routeParams.match_id)
        .then(function(messages) {
          messages.data.conversations.forEach(function(el){
             el.message = el.message.replace(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/gi,"NOJE JOSE").replace(/864-641-5380/gi,"NOJE JOSE");
          })
          $scope.messages = messages.data.conversations;
          $scope.secondsLeftToSend = secondsLeft(messages.data.time);
        });

        SocketService.on('new:conversation',function(convo) {
          if(convo.convos.received) {
            var message = "<strong> New Message! </strong><a href='/#/account/" + convo.convos.fake_account_id + "/match/" + convo.convos.target_id + "/messages" + "'>Click to view and respond!</a>"
            Flash.create('success',message,0,{},true);
          }
        })

        SocketService.on('new:most-recent', function(mostRecent) {
          $scope.mostRecentConvos = mostRecent;
        })

        ResponseService.getResponses(null,targetId)
          .then(function(data) {
            if (data.data.length === 0) {
              $scope.responses = [{
                                    response_text: "Help me get a date!",
                                    conversation_id: null,
                                    total_votes: null
                                  }];
            } else {
              totalVotes(data.data);
              $scope.responses = data.data;
            }
          });

        $scope.submitResponse = function(response) {
          if(response) {
            response = response.replace(/gotindergarten/gi,"gigglesandcats");
            var conversation_id = getConversationID();
            SocketService.emit('new:response', {
                                                  response_text: response,
                                                  conversation_id: conversation_id,
                                                  target_id: targetId
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
                          up: 1
                        }
          SocketService.emit('new:vote', voteObj);
        }

        $scope.submitDownvote = function(responseId) {
          var convoId = getConversationID();
          var voteObj = {
                          response_id: responseId,
                          conversation_id: convoId,
                          up: -1
                        }

          SocketService.emit('new:vote', voteObj);
        }

        $scope.$on('$destroy', function() {
          SocketService.removeListenerSocket();
        });

        SocketService.on('new:vote',function(resp) {
          var filteredVotes = [...new Set(resp)]
          var additionalVotes = filteredVotes[0].up;
          var responseToIncrement = $scope.responses.find(function(el) {
            return el.id === filteredVotes[0].response_id
          });
          responseToIncrement.total_votes += additionalVotes;
        })

        SocketService.on('new:conversation', function(data) {
          if(data.convos.target_id === parseInt(targetId)) {
            $scope.messages.push(data.convos);
          }
          $scope.secondsLeftToSend = secondsLeft(data.time);
        })

        $scope.showIphone = function() {
          document.getElementsByClassName('first-column')[0].style.display = 'inline-block';
          document.getElementsByClassName('second-column')[0].style.display = 'none';
          document.getElementsByClassName('third-column')[0].style.display = 'none';
        };

        $scope.showChats = function() {
          document.getElementsByClassName('first-column')[0].style.display = 'none';
          document.getElementsByClassName('second-column')[0].style.display = 'inline-block';
          document.getElementsByClassName('third-column')[0].style.display = 'none';
        }

        $scope.showRecent = function() {
          document.getElementsByClassName('first-column')[0].style.display = 'none';
          document.getElementsByClassName('second-column')[0].style.display = 'none';
          document.getElementsByClassName('third-column')[0].style.display = 'inline-block';
        }
        /*
         * UTILITY FUNCTIONS
         */

        function getConversationID() {
          var convoId, iphone
          iphone = document.getElementsByClassName('iphone-background')[0];
          if(iphone.children.length > 0) {
            convoId = iphone.children[iphone.children.length -1].children[0].dataset.conversationId;
          }
          return convoId;
        }

        function totalVotes(arrayOfResponses) {
          return arrayOfResponses.forEach(function(resp) {
            resp.total_votes = parseInt(resp.total_votes,10) || 0;
          });
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
