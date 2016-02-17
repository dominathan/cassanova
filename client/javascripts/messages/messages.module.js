var angular = require('angular');
var angularRoute = require('angular-route');
var humanizeDuration = require('humanize-duration');
// var angularTimer = require('angular-timer');

angular.module('messages',[
  'ngRoute',
  // 'timer'
])
.config(function($routeProvider) {
  $routeProvider
    .when('/account/:account_id/match/:match_id/messages', {
      template: require('./views/messages-view.html'),
      controller: 'MessagesController'
    })
});

require('../directives/scrollbottom');
require('../directives/click-once');
require('../responses/responses.controller')
require('./views/clock.html');
require('./messages.controller');
