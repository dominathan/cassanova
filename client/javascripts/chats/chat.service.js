(function() {
  'use strict';
  angular
    .module('chat')
    .factory('ChatService', function($http,SocketService) {

      function getChats() {
        return $http.get('/api/chats/allchats')
      }

      var getChatsRoom = function(roomNumber) {
        var url = "/api/chats/room/" + roomNumber;
        return $http.get(url);
      }

      var postChatRoom = function(roomNumber, chat) {
        var url = "/api/chats/room/";
        var objToSave = {room_id: roomNumber, text: chat}
        return $http.post(url,objToSave);
      }

      var postChat = function(chat) {
        var url = "/api/chats/create";
        return $http.post(url,{text: chat});
      }

      return {
        getChats: getChats,
        getChatsRoom: getChatsRoom,
        postChatRoom: postChatRoom,
        postChat: postChat
      }
    })
}());
