(function() {
  'use strict';
    angular
      .module('chat')
      .controller('ChatsController', function($scope, $uibModalInstance,ChatService, SocketService,$window,$auth,CleanTextService) {
        $scope.glued = true;
        ChatService.getChats()
        .then(function(data) {
          var stuff = data.data.map(function(el) {
            return {
              text: CleanTextService.cleanText(el.text),
              created_at: el.created_at,
              username: el.username ? el.username : "anon"
            };
          })
          $scope.currentChats = stuff;
          setTimeout(function() {
            var elm = document.getElementsByClassName('modal-content')[0];
            elm.scrollTop = elm.scrollHeight;
          },80);
        });

        $scope.sendChat = function(chat) {
          if(!chat) return;
          var token, chat;
          var chat = {
            room_id: 3141592,
            text: CleanTextService.cleanText(chat),
          }
          if($auth.isAuthenticated()) {
            chat.token = $window.localStorage.satellizer_token
          }
          SocketService.emit('new:global-chat', chat);
          document.getElementById("chatBox").value = ""
        }

        SocketService.on('new:global-chat', function(info) {
          info.text = CleanTextService.cleanText(info.text);
          info.username = info.username || "anon";
          $scope.currentChats.push(info);
          setTimeout(function() {
            var elm = document.getElementsByClassName('modal-content')[0];
            elm.scrollTop = elm.scrollHeight;
          },80);
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
