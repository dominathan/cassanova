var angular = require('angular');
require('angular-route');
require('./home.controller');
require('angular-bootstrap-npm');
require('angular-flash-alert');
require('angular-moment');
require('angular-ui-bootstrap');

angular.module('home',[
  'ngRoute',
  'ngFlash',
  'angularMoment',
  'ui.bootstrap'
])
.config(function($routeProvider) {
  $routeProvider
      .when('/', {
        template: require('./views/home-view.html'),
        controller: 'HomeController'
      })
      .when('/faq', {
        template: require('./views/faq.html')
      })
});
