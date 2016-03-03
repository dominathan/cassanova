require('../utilities/timer.service');

angular
  .module('cassanova')
  .directive('timer', function(TimerService,$interval) {
    return {
      restrict: 'A',
      scope: {
        seconds: '@'
      },
      link: function(scope, element) {
        var timeLeft = parseInt(scope.seconds,10);
        $interval(function() {
          timeLeft -= 1;
          return element.text(TimerService.convertTime(timeLeft));
        },1000);
        return element.text(TimerService.convertTime(timeLeft));
      }
    };
  });
