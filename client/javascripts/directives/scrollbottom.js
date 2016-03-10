(function() {
  'use strict'
  angular
    .module('cassanova')
    .directive('scrollBottom', function() {
      return {
        scope: {
          scrollBottom: "="
        },
        link: function(scope, element) {
          scope.$watch('$last', function() {
            setTimeout(function() {
              element[0].scrollTop = element[0].scrollHeight;
            },40)
          })

          scope.$watchCollection('messages', function() {
            setTimeout(function() {
              element[0].scrollTop = element[0].scrollHeight;
            },40)
          })
        }

      }
    });

})();
