(function() {
  'use strict';

  angular
    .module('users')
    .factory('AuthenticationService', function() {

      var auth = {
        isLogged: false
      };

      return {
        auth: auth
      };


    });

}());
