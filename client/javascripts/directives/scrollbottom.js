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
              element.scrollTop(element[0].scrollHeight)
            })
          })
        }

      }
    });

})();
