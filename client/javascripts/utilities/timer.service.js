angular
  .module('cassanova')
  .service('TimerService',function() {
    function convertTime(time) {
        var minutes, seconds;
        minutes = Math.floor(time / 60);
        seconds = time - minutes * 60;
        if (seconds.toString().length < 2) {
          return minutes + ':0' + seconds;
        } else {
          return minutes + ":" + seconds;
        }
      }
    return {
      convertTime: convertTime
    }
  })
