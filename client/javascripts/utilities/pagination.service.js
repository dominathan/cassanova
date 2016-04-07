(function() {
  'use strict';
  angular
    .module('cassanova')
    .service('PaginationService',function($sessionStorage){
       var service = {};
       service.currentPageNumber = $sessionStorage.currentPageNumber || 1;

       service.setNewPageNumber = function(newPageNumber) {
         console.log("OLD PAGE? ",$sessionStorage.currentPageNumber);
         $sessionStorage.currentPageNumber = newPageNumber;
         service.currentPageNumber = newPageNumber;
         console.log("NEW PAGE? ", $sessionStorage.currentPageNumber);
       };

       return service;
    });
}());
