angular
  .module('cassanova')
  .service('TimerService',function() {
    function convertTime(time) {
        var minutes, seconds;
        minutes = Math.floor(time / 60);
        seconds = time - minutes * 60;
        return minutes + ':' + seconds;
      }
    return {
      convertTime: convertTime
    }
  })
