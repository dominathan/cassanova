angular
  .module('cassanova')
  .service('TimerService',function() {
    function convertTime(time) {
      var minutes, time, seconds;
        minutes = Math.floor(time / 1000 / 60);
        time -= minutes * 60 * 1000;
        seconds = Math.floor(time / 1000);
        if(seconds.toString().length !== 2) {
          seconds = "0".concat(seconds);
        }
        return minutes + ':' + seconds;
      }
    return {
      convertTime: convertTime
    }
  })
