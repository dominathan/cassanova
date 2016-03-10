var CronJob = require('cron').CronJob;
var TinderClient = require('./tinder-client');
var env = process.env.NODE_ENV || 'development';
var config = require("../knexfile");
var knex = require('knex')(config[env]);
var timeUntilSqlTime = require('./timeUntil');
var moment = require("moment");
var bluebird = require("bluebird");
var _ = require('lodash');


function CronExecutables(io) {
  // new CronJob('48 9,19,29,39,49,59 * * * *', function() {

  new CronJob('48 0-59 * * * *', function() {
    console.log("TIME STAMP", new Date(Date.now()));
    var responsesToSend = sumTopResponses();
    knex('fake_accounts')
      .select('*')
      .then(function(data) {
        return data[0];
      })
     .then(function(tcOptions) {
       console.log('TC OPTIONS',tcOptions)
       var tc = new TinderClient(tcOptions)
       responsesToSend.then(function(data) {
         console.log("THIS WORKS?: ", data);
         if(tc.isAuthorized() && data.length > 0) {
           data.forEach(function(msg) {
            tc.sendMessage(msg.match_id,msg.response_text,function(err,data) {
              if(err) {
                throw err
              } else {
                knex('targets').select("id").where('match_id',msg.match_id)
                  .then(function(id) {
                    console.log('THIS IS THE MATCH', id);
                    var insertThing = {
                      target_id: id[0].id,
                      message: msg.response_text,
                      received: false,
                      sent_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
                    }
                    console.log("INSERT ME",insertThing);
                    knex('conversations')
                      .insert(insertThing)
                      .then(function(rows) {
                        io.emit('new:conversation', {convos: insertThing, time: new Date()});
                      })
                });
              };
            })
          })
        }
     })
    })

  },null,true,'America/New_York');

  function sumTopResponses() {
    return new Promise(function(resolve, reject) {
      var timeBefore = timeUntilSqlTime();
      var messagesToSend = [];
      knex.raw(`SELECT SUM(v.up) as total_votes, msg.response_text, msg.conversation_id, msg.created_at, msg.id, tg.id, tg.tinder_id, tg.match_id FROM responses as msg LEFT JOIN votes as v on msg.id = v.response_id LEFT JOIN targets as tg on msg.target_id = tg.id WHERE msg.created_at > '${timeBefore}' AND v.up IS NOT NULL GROUP BY tg.id, msg.id ORDER BY total_votes`)
          .then(function(data) {
             var sortedChatsByTinderAndTotalVotes = _.chain(data.rows)
               .groupBy(function(el) {
                 return el.tinder_id;
               })
               .sortByOrder(['total_votes'],['desc'])
             .value()

             sortedChatsByTinderAndTotalVotes.forEach(function(el) {
               messagesToSend.push(_.last(el));
             })
              resolve(messagesToSend);
          })
    })
  }
}

module.exports = CronExecutables;
