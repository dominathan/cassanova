(function () {
  'use strict';

  angular
    .module('cassanova')
    .factory('SocketService', function ($rootScope) {
      var socket = io();

      function on(eventName,callback) {
        socket.on(eventName,function(){
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket,args);
          });
        });
      };

      function emit(eventName,data,callback) {
        socket.emit(eventName,data,function() {
          var args = arguments;
          $rootScope.$apply(socket,function() {
            if(callback) {
              callback.apply(socket,args);
            };
          });
        });
      };

      function removeListenerSocket() {
        socket.removeListener();
      }

      return {
        on: on,
        emit: emit,
        removeListenerSocket
      };
    });


})();
