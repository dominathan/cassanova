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
      '$uibModal',
      '$window',
      '$auth',
      function($scope,$routeParams,$location,ResponseService,MessageServices,SocketService,Flash,$uibModal,$window,$auth) {
        $scope.chat = "";
        $scope.responses = [];
        $scope.currentChats = [];
        var targetId = $routeParams.match_id;

        MessageServices.getChats(targetId)
        .then(function(chats) {
          $scope.mostRecentShow = false;
          $scope.groupChatShow = true;
          var stuff = chats.data.map(function(el) {
            return {
              text: el.text.replace(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/gi,"{PHONE NUMBER REMOVED}")
                            .replace(/864-641-5380/gi,"{PHONE NUMBER REMOVED}")
                            .replace(/\d{9}/gi,"PHONE NUMBER REMOVED").replace(/\d{3}-\d{3}-\d{4}/gi,"PHONE NUMBER REMOVED")
                            .replace(/nigga|cunt|nigger/gi,"angel")
                            .replace(/(\d\s){9}/gi, "NUMBER REMOVED"),
              created_at: el.created_at
            };
          })
          $scope.currentChats = stuff;
          setTimeout(function() {
            var elm = document.getElementsByClassName('gartner-chats')[0];
            elm.children[0].scrollTop = elm.children[0].scrollHeight;
          },80);
        });

        $scope.mostRecent = function () {
          MessageServices.getMostRecent()
          .then(function(mostRecent) {
            $scope.mostRecentShow = true;
            $scope.groupChatShow = false;
            $scope.mostRecentConvos = mostRecent.data;
          });
        };

        $scope.showGroupChat = function() {
          $scope.mostRecentShow = false;
          $scope.groupChatShow = true;
          MessageServices.getChats(targetId)
          .then(function(data) {
            data.data.forEach(function(el) {
              el.text.replace(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/gi,"{PHONE NUMBER REMOVED}")
                      .replace(/864-641-5380/gi,"{PHONE NUMBER REMOVED}")
                      .replace(/\d{9}/gi,"PHONE NUMBER REMOVED")
                      .replace(/nigga|cunt|nigger/gi,"angel")
                      .replace(/(\d\s){9}/gi, "NUMBER REMOVED");
            });
            $scope.currentChats = data.data;
            setTimeout(function() {
              var elm = document.getElementsByClassName('gartner-chats')[0];
              elm.children[0].scrollTop = elm.children[0].scrollHeight;
            },80);
          })
        };

        MessageServices.getMatch(targetId)
        .then(function(data) {
          $scope.match = data.data[0];
        })

        $scope.getMatchInfo = function() {
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            template: require("./views/profileModal.html"),
            size: 'md',
            controller: 'ModalProfileCtrl',
            resolve: {
              match: $scope.match
            }
          })
        }

        $scope.sendChat = function(chat) {
          if(chat) {
            document.getElementById("chatBox").value = ""
            SocketService.emit('new:chat', {
              room_id: targetId,
              text: chat.replace(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/gi,"{PHONE NUMBER REMOVED}")
                        .replace(/864-641-5380/gi,"{PHONE NUMBER REMOVED}").replace(/\d{9}/gi,"PHONE NUMBER REMOVED")
                        .replace(/nigga|cunt|nigger/gi,"angel")
                        .replace(/(\d\s){9}/gi, "NUMBER REMOVED")
            });
          }
        };

        SocketService.on('new:chat', function(info) {
          $scope.currentChats.push(info);
          setTimeout(function() {
            var elm = document.getElementsByClassName('gartner-chats')[0];
            elm.children[0].scrollTop = elm.children[0].scrollHeight;
          },80);
        });

        MessageServices.getMessages($routeParams.account_id,$routeParams.match_id)
        .then(function(messages) {
          messages.data.conversations.forEach(function(el){
             el.message = el.message.replace(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/gi,"{PHONE NUMBER REMOVED}")
                                    .replace(/864-641-5380/gi,"{PHONE NUMBER REMOVED}")
                                    .replace(/\d{9}/gi,"PHONE NUMBER REMOVED")
                                    .replace(/nigga|cunt|nigger/gi,"angel")
                                    .replace(/(\d\s){9}/gi, "NUMBER REMOVED");
          });
          $scope.messages = messages.data.conversations;
          $scope.secondsLeftToSend = secondsLeft(messages.data.time,5);
        });

        SocketService.on('new:conversation',function(convo) {
          if(convo.convos.received) {
            var message = "<strong> New Message! </strong><a href='/#/account/" + convo.convos.fake_account_id + "/match/" + convo.convos.target_id + "/messages" + "'>Click to view and respond!</a>"
            Flash.create('success',message,0,{},true);
          }
        });

        SocketService.on('responses:clear-old', function() {
          $scope.responses = [];
        });

        SocketService.on('new:most-recent', function(mostRecent) {
          $scope.mostRecentConvos = mostRecent;
        });

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
          if($auth.isAuthenticated()) {
            response = response.replace(/gotindergarten/gi,"gigglesandcats").replace(/nigga|cunt|nigger/gi,"angel");
            var conversation_id = getConversationID();
            SocketService.emit('new:response', {
                                                  response_text: response,
                                                  conversation_id: conversation_id,
                                                  target_id: targetId,
                                                  token: $window.localStorage.satellizer_token
                                                }
                               )
            $scope.newResponse = "";
          } else {
            mustBeLoggedIn()
          }
        };

        SocketService.on('new:response',function(response) {
          var newObj = response;
          if(newObj.target_id == targetId) {
            newObj.total_votes = 0;
            $scope.responses.push(newObj)
          }
        });
        
        $scope.submitUpvote = function(responseId) {
          if($auth.isAuthenticated()) {
            var convoId = getConversationID();
            var voteObj = {
                            response_id: responseId,
                            conversation_id: convoId,
                            up: 1,
                            token: $window.localStorage.satellizer_token
                          }
            SocketService.emit('new:vote', voteObj);
          } else {
            mustBeLoggedIn()
          }
        };

        $scope.submitDownvote = function(responseId) {
          if($auth.isAuthenticated()) {
            var convoId = getConversationID();
            var voteObj = {
                            response_id: responseId,
                            conversation_id: convoId,
                            up: -1,
                            token: $window.localStorage.satellizer_token
                          }

            SocketService.emit('new:vote', voteObj);
          } else {
            mustBeLoggedIn();
          }
        };

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
        });

        SocketService.on('new:conversation', function(data) {
          if(data.convos.target_id === parseInt(targetId)) {
            $scope.messages.push(data.convos);
          }
          $scope.secondsLeftToSend = secondsLeft(data.time,5);
        });

        $scope.iphoneShow = true;
        $scope.showIphone = function() {
          $scope.iphoneShow = true;
          $scope.chatShow = false;
          $scope.recentShow = false;
          document.getElementsByClassName('first-column')[0].style.display = 'inline-block';
          document.getElementsByClassName('second-column')[0].style.display = 'none';
          document.getElementsByClassName('third-column')[0].style.display = 'none';
        };

        $scope.showChats = function() {
          $scope.iphoneShow = false;
          $scope.chatShow = true;
          $scope.recentShow = false;
          document.getElementsByClassName('first-column')[0].style.display = 'none';
          document.getElementsByClassName('second-column')[0].style.display = 'inline-block';
          document.getElementsByClassName('third-column')[0].style.display = 'none';
        }

        $scope.showRecent = function() {
          $scope.iphoneShow = false;
          $scope.chatShow = false;
          $scope.recentShow = true;
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

        function secondsLeft(time,offset) {
          var time = new Date(time);
          if(time.getSeconds() !== 0) {
            var min = (offset - time.getMinutes() % offset - 1) * 60;
            var seconds = 60 - time.getSeconds();
            var secondsUntil = min + seconds;
          } else {
            var secondsUntil = (offset - time.getMinutes() % offset) * 60;
          }
          return secondsUntil;
        };


        function mustBeLoggedIn() {
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            template: require('./views/must-login-modal.html'),
            size: 'sm',
            controller: 'ModalLoginCtrl'
          })
        };

    }]);
})()
