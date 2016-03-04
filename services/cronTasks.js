var CronJob = require('cron').CronJob;
var env = process.env.NODE_ENV || 'development';
var config = require("../knexfile");
var knex = require('knex')(config[env]);
var timeUntilSqlTime = require('./timeUntil');
var _ = require('lodash');

function CronExecutables() {
  new CronJob('*/0,10,20,30,40,50 * * * *', function() {
    console.log("TIME STAMP", new Date(Date.now()));
    sumTopResponses();
  },null,true,'America/New_York');

  function sumTopResponses() {
    var timeBefore = timeUntilSqlTime();
    knex.raw(`SELECT SUM(v.up) as total_votes, msg.response_text, msg.conversation_id, msg.created_at, msg.id, tg.id, tg.tinder_id, tg.match_id FROM responses as msg LEFT JOIN votes as v on msg.id = v.response_id LEFT JOIN targets as tg on msg.target_id = tg.id WHERE msg.created_at > '${timeBefore}' AND v.up IS NOT NULL GROUP BY tg.id, msg.id ORDER BY total_votes`)
        .then(function(data) {

           var sortedChatsByTinderAndTotalVotes = _.chain(data.rows)
             .groupBy(function(el) {
               return el.tinder_id;
             })
             .sortByOrder(['total_votes'],['desc'])
           .value()

           var messagesToSend = [];
           sortedChatsByTinderAndTotalVotes.forEach(function(el) {
             messagesToSend.push(_.last(el));
           })
           console.log(messagesToSend);
           return messagesToSend;
        })
  }
}

module.exports = CronExecutables;
