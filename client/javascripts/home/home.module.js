var angular = require('angular');
require('angular-route');
require('./home.controller');
require('angular-bootstrap-npm');
require('angular-flash-alert');

angular.module('home',[
  'ngRoute',
  'ui.bootstrap',
  'ngFlash'
])
.config(function($routeProvider) {
  $routeProvider
      .when('/', {
        template: require('./views/home-view.html'),
        controller: 'HomeController'
      })
  });
