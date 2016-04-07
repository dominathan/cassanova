(function() {
  'use strict';
  angular
    .module('cassanova')
    .service('PaginationService',function($sessionStorage){
       var service = {};
       service.currentPageNumber = $sessionStorage.currentPageNumber || 1;

       service.setNewPageNumber = function(newPageNumber) {
         $sessionStorage.currentPageNumber = newPageNumber;
         service.currentPageNumber = newPageNumber;
       };

       return service;
    });
}());
