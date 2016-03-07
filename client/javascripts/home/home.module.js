var angular = require('angular');
var angularRoute = require('angular-route');
require('./home.controller');
require('angular-bootstrap-npm');

angular.module('home',[
  'ngRoute',
  'ui.bootstrap'
])
.config(function($routeProvider) {
  $routeProvider
      .when('/', {
        template: require('./views/home-view.html'),
        controller: 'HomeController'
      })
  });
