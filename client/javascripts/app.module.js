import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import '../stylesheets/main.scss';

import BootstrapJs from 'bootstrap/dist/js/bootstrap.min.js';

import angular from 'angular';
require('angular-route');
require('angular-flash-alert');
require('angular-messages');
require('angular-aside');
import satellizer from 'satellizer';

angular.module('cassanova',[
  'ngRoute',
  'messages',
  'home',
  'blocked',
  'ngFlash',
  'users',
  'ngMessages',
  'satellizer',
  'ngAside'
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
