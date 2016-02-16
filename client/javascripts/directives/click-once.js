angular
  .module('cassanova')
  .directive('ngClickOnce', [function () {
    return {
      restrict: 'A',
      link: function(scope, element, attribute){
        var clickFunction = function(){
          scope.$eval(attribute.ngClickOnce);
          scope.$apply();
          element.unbind("click", clickFunction);
        };

        element.bind("click", clickFunction);
      }
    };
  }])
