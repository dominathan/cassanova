require('../utilities/timer.service');

angular
  .module('cassanova')
  .directive('timer', function(TimerService,$interval) {
    return {
      restrict: 'A',
      scope: {
        minutes: '@',
        countdown: '@'
      },
      link: function(scope, element) {
        var timeNow = new Date()
        var futureTime = new Date(timeNow.getTime() + parseInt(scope.minutes) * 60000);
        var timeDifference = futureTime.getTime() - timeNow.getTime();
        $interval(function() {
          timeDifference -= 1000;
          return element.text(TimerService.convertTime(timeDifference));
        },1000);
      }
    };
  });
