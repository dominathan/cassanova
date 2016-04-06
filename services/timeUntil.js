var moment = require('moment');

module.exports = function timeUntil() {
  var time, minutes, seconds, timeTest, timeBefore;
  time = new Date();
  minutes = time.getMinutes() % 5;
  seconds = time.getSeconds();
  timeBefore = new Date(time.valueOf() - (minutes * 60000 + seconds * 1000));
  timeBefore = moment(timeBefore).format('YYYY-MM-DD HH:mm:ss');
  return timeBefore;
};
