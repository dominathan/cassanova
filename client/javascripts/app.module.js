import '../stylesheets/main.scss';
//@require "./views/**/*.html"

var angular = require('angular');
require('angular-route');
require('angular-flash-alert');
require('angular-messages');
require('satellizer');


angular.module('cassanova',[
  'ngRoute',
  'messages',
  'home',
  'blocked',
  'ngFlash',
  'users',
  'ngMessages',
  'satellizer'
])
.config(function($routeProvider) {
  $routeProvider
      .when('/404', {
        template: '<h1>Sorry, page not found</h1>'
      })
      .otherwise({
        redirectTo: '/404'
      });
})

require('./home/home.module');
require('./messages/messages.module');
require('./utilities/socket.service');
require('./utilities/pagination.service');
require('./users/users.module');
require('./utilities/tokenInterceptor');
require('./blocked/blocked.module');
require('./navbar/navbar.controller');
