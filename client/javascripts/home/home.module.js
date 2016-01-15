var angular = require('angular');
var angularRoute = require('angular-route');
// var angularCache = require('angular-cache');
// require('./views/home-view.html');

angular.module('home',[
  'ngRoute',
  // 'ng-cache'
])
.config(function($routeProvider) {
  $routeProvider
      .when('/', {
        templateUrl: 'views/home-view.html',
        controller: 'HomeController'
      })
  });

require('./home.controller');
