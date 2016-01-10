import './stylesheets/main.scss';

var angular = require('angular');
var angularTimer = require('angular-timer');
var angularRoute = require('angular-route');

angular.module('cassanova',[
  'ngRoute',
  'timer'
]).config(function($routeProvider) {
  $routeProvider
      .when('/', {
        templateUrl: 'home-view.html',
        controller: 'HomeController'
      })
      .when('/account/:account_id/match/:match_id/messages', {
        templateUrl: 'messages-view.html',
        controller: 'MessagesController'
      });
  });

