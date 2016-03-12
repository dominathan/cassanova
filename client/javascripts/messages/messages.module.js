var angular = require('angular');
var angularRoute = require('angular-route');
require('angular-flash-alert');

angular.module('messages',[
  'ngRoute',
  'ngFlash'
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
require('../directives/timer');
require('../responses/responses.controller')
require('./messages.controller');
