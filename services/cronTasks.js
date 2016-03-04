var CronJob = require('cron').CronJob;
var env = process.env.NODE_ENV || 'development';
var config = require("../knexfile");
var knex = require('knex')(config[env]);
var timeUntil = require('./timeUntil');

function CronExecutables() {
  new CronJob('0 0,10,20,30,40,50 * * * *', function() {
    console.log('HOW EVEN YOU RUNNING' + " " + new Date(Date.now()) + " " + new Date(Date.now()).getMinutes());
  },null, true, 'America/New_York');

  new CronJob('*/60 * * * * *', function() {
    sumTopResponses();
  },null,true,'America/New_York');

  function sumTopResponses() {
    var timeBefore = timeUntil();
    knex.raw(`SELECT SUM(v.up) as total_votes, msg.conversation_id, msg.created_at, msg.id FROM responses as msg LEFT JOIN votes as v on msg.id = v.response_id WHERE msg.created_at > '${timeBefore}' AND v.up IS NOT NULL GROUP BY msg.id ORDER BY total_votes`)
        .then(function(data) {
          console.log("TEST STUFF",data.rows);
        })
  }
}

module.exports = CronExecutables;
