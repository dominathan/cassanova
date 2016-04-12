import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import '../stylesheets/main.scss';

import angular from 'angular';
require('angular-route');
require('angular-flash-alert');
require('angular-messages');
import satellizer from 'satellizer';
import AngularStrap from 'angular-strap';
import AngularStrapTpl from 'angular-strap/dist/angular-strap.tpl';

angular.module('cassanova',[
  'ngRoute',
  'messages',
  'home',
  'blocked',
  'ngFlash',
  'users',
  'ngMessages',
  'satellizer',
  'mgcrea.ngStrap'
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
