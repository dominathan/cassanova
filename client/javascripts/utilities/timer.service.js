angular
  .module('cassanova')
  .service('TimerService',function() {
    function convertTime(time) {
      var minutes, time, seconds;
        minutes = Math.floor(time / 1000 / 60);
        time -= minutes * 60 * 1000;
        seconds = Math.floor(time / 1000);
        return [minutes + 'm', seconds + 's'].join(' ');
      }
    return {
      convertTime: convertTime
    }
  })
