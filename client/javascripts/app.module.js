import '../stylesheets/main.scss';

var angular = require('angular');
var angularRoute = require('angular-route');

angular.module('cassanova',[
  'ngRoute',
  'messages',
  'home'
]).config(function($routeProvider) {
  $routeProvider
      .when('/404', {
        template: '<h1>Sorry, page not found</h1>'
      })
      .otherwise({
        redirectTo: '/404'
      });
  });

require('./home/home.module');
require('./messages/messages.module');
require('./utilities/socket.service');
