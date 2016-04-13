import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import AngularAside from 'angular-aside/dist/css/angular-aside.min.css';
import '../stylesheets/main.scss';

var angular = require('angular');
require('angular-route');
require('angular-messages');
require('angular-aside');
require('satellizer');
require('angularjs-scroll-glue');

angular.module('cassanova',[
  'ngRoute',
  'messages',
  'home',
  'blocked',
  'ngFlash',
  'users',
  'ngMessages',
  'satellizer',
  'ngAside',
  'chat',
  'luegg.directives'
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
require('./chats/chat.module');
require('./messages/messages.module');
require('./utilities/socket.service');
require('./utilities/cleanText.service');
require('./users/users.module');
require('./blocked/blocked.module');
require('./navbar/navbar.controller');
