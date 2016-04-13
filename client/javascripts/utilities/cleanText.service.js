(function() {
  'use strict';
  angular
    .module('cassanova')
    .factory('CleanTextService',function(){

      var cleanText = function(text) {
        return text.replace(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/gi,"{PHONE NUMBER REMOVED}")
                               .replace(/864-641-5380/gi,"{PHONE NUMBER REMOVED}")
                               .replace(/\d{9}/gi,"PHONE NUMBER REMOVED")
                               .replace(/nigga|cunt|nigger/gi,"angel")
                               .replace(/(\d\s){9}/gi, "NUMBER REMOVED");
      }

       return {
         cleanText: cleanText
       }
    });
}());
