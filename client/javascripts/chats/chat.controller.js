(function() {
  'use strict';
    angular
      .module('chat')
      .controller('ChatsController', function($scope, $uibModalInstance,ChatService, SocketService,$window,$auth,CleanTextService) {
        $scope.chatText = "";
        ChatService.getChats()
        .then(function(data) {
          $scope.globalChats = data.data.map(function(el) {
            return {
              room_id: el.room_id,
              text: CleanTextService.cleanText(el.text),
              created_at: el.created_at,
              username: el.username ? el.username : "anon"
            };
          }).filter(function(wrongRoom) {
            return wrongRoom.room_id != "3141592";
          });
          setTimeout(function() {
            var elm = document.getElementsByClassName('modal-content')[0];
            elm.scrollTop = elm.scrollHeight;
          },80);
        });

        $scope.sendChat = function(chat) {
          if(!chat) return;
          var token, chat;
          $scope.chatText = "";
          chat = {
            room_id: 3141592,
            text: CleanTextService.cleanText(chat),
          }
          if($auth.isAuthenticated()) {
            chat.token = $window.localStorage.satellizer_token
          }
          SocketService.emit('global:chat', chat);
        }

        SocketService.on('global:chat', function(info) {
          if(info.room_id == 3141592) {
            info.text = CleanTextService.cleanText(info.text);
            info.username = info.username || "anon";
            $scope.globalChats.push(info);
            setTimeout(function() {
              var elm = document.getElementsByClassName('modal-content')[0];
              elm.scrollTop = elm.scrollHeight;
            },80);
          }
        })

        $scope.ok = function(e) {
          $uibModalInstance.close();
          e.stopPropagation();
        };
        $scope.cancel = function(e) {
          $uibModalInstance.dismiss();
          e.stopPropagation();
        };
      })
}());
