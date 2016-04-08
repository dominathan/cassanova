(function() {
  'use strict';

  angular
    .module('cassanova')
    .factory('MessageServices',function($q,$http,$cacheFactory) {

      var getMessages = function(fakeAccountID,targetID) {
        var url = "/api/fake_accounts/" + "dont_matter" + "/targets/" + targetID;
        return $http.get(url);
      }

      var getMostRecent = function() {
        var url = '/api/fake_accounts/getMostRecentConvos'
        return $http.get(url);
      }

      var getChats = function(roomNumber) {
        var url = "/api/fake_accounts/chats/" + roomNumber;
        return $http.get(url);
      }

      var postChat = function(roomNumber, chat) {
        var url = "/api/fake_accounts/chats/";
        var objToSave = {room_id: roomNumber, text: chat}
        return $http.post(url,objToSave);
      }

      return {
        getMessages: getMessages,
        getMostRecent: getMostRecent,
        getChats: getChats,
        postChat: postChat
      }
    })
})();
