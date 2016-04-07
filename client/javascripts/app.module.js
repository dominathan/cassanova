import '../stylesheets/main.scss';

var angular = require('angular');
require('angular-route');
require('angular-flash-alert');
require('ngstorage');

angular.module('cassanova',[
  'ngRoute',
  'messages',
  'home',
  'blocked',
  'ngFlash',
  'ngStorage'
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
require('./utilities/pagination.service');
require('./blocked/blocked.module');
