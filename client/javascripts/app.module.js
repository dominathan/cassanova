import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import AngularAside from 'angular-aside/dist/css/angular-aside.min.css';
// import stuff from '../stylesheets/main.scss';
import variables from '../stylesheets/_variables.scss';
import globals from '../stylesheets/_globals.scss';
import navbar from '../stylesheets/_navbar.scss';
import login from'../stylesheets/_login.scss';
import footer from '../stylesheets/_footer.scss';
import chatModal from '../stylesheets/_chat_modal.scss';
import chatWindow from '../stylesheets/_chat_window.scss';
import iPhoneWindow from '../stylesheets/_iphone_window.scss';
import profileModal from '../stylesheets/_profile_modal.scss';
import photoModal from '../stylesheets/_photo_modal.scss';
import blocked from '../stylesheets/_blocked.scss';
import home from '../stylesheets/_home.scss';
import clock from '../stylesheets/_clock.scss';
import recent from '../stylesheets/_recents.scss';
import communityChats from '../stylesheets/_community_chats.scss';
import responsive from '../stylesheets/_responsive.scss';


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
