import '../stylesheets/main.scss';

var angular = require('angular');
require('angular-route');
require('angular-flash-alert');
require('angular-messages');
require('ngstorage');

angular.module('cassanova',[
  'ngRoute',
  'messages',
  'home',
  'blocked',
  'ngFlash',
  'ngStorage',
  'users',
  'ngMessages'
])
.config(function($routeProvider) {
  $routeProvider
      .when('/404', {
        template: '<h1>Sorry, page not found</h1>'
      })
      .when('/weird', {
        template: '<h1> MUST BE LOGGED IN TO SEE </h1>',
        // access: { requiredLogin: true }
      })
      .otherwise({
        redirectTo: '/404'
      });
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');
});


// .run(function($rootScope, $location, AuthenticationService) {
//     $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
//       console.log(nextRoute);
//         if (!AuthenticationService.isLogged) {
//             $location.path("/login");
//         }
//     });
// });

require('./home/home.module');
require('./messages/messages.module');
require('./utilities/socket.service');
require('./utilities/pagination.service');
require('./users/users.module');
require('./utilities/tokenInterceptor');
require('./blocked/blocked.module');
