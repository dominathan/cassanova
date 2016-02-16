var angular = require('angular');
var angularRoute = require('angular-route');

angular.module('messages',[
  'ngRoute'
])
.config(function($routeProvider) {
  $routeProvider
    .when('/account/:account_id/match/:match_id/messages', {
      template: require('./views/messages-view.html'),
      controller: 'MessagesController'
    })
});

require('./messages.controller');
require('../directives/scrollbottom');
require('../directives/click-once');
require('../responses/views/chat-window.html');
require('./views/clock.html');
require('./messages.controller');
