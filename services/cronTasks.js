var CronJob = require('cron').CronJob;
var TinderClient = require('./tinder-client');
var moment = require("moment");
var bluebird = require("bluebird");
var _ = require('lodash');


var saveMatches = require('./saveMatches');
var Target = require('../models/target')();
var FakeAccount = require('../models/fake_account')();
var Conversation = require('../models/conversations')();
var Photo = require('../models/photos')();
var timeUntilSqlTime = require('./timeUntil');

function CronExecutables(io) {
    new CronJob('0 0,5,10,15,20,25,30,35,40,45,50,55 * * * *', function() {
        io.emit('responses:clear-old', {});
    }, null, true, 'America/New_York');

    // new CronJob('*/20 * * * * *', function() {
    new CronJob('58 4,9,14,19,24,29,34,39,44,49,54,59 * * * *', function() {
        console.log("SENDING MESSAGES:", new Date(Date.now()));

        getFakeAccounts()
        .then(function(allFakeAccounts) {
          allFakeAccounts.forEach(function(oneFakeAccount) {
              var tc = new TinderClient(oneFakeAccount)
              var responsesToSend = sumTopResponses(oneFakeAccount);

              responsesToSend.then(function(data) {
                  if (tc.isAuthorized() && data.length > 0) {
                      data.forEach(function(msg) {
                          tc.sendMessage(msg.match_id, msg.response_text, function(err, data) {
                              if (err) {
                                  console.log('cannot send', err)
                                  throw err
                              }
                              console.log("SENT MESSAGE", data);
                          })
                      })
                  }
              })
          })
        })
    }, null, true, 'America/New_York');

    /* LIKING NEW PEOPLE */
    new CronJob('0 */30 * * * *', function() {
      console.log("Checking for new matches: ", new Date(Date.now()));
      getFakeAccounts()
         .then(function(allFakeAccounts) {
           allFakeAccounts = Array.from(allFakeAccounts);
           allFakeAccounts.forEach(function(oneFakeAccount) {
              var tc = new TinderClient(oneFakeAccount);
              try {
                  tc.getRecommendations(1000, function(err, data) {
                      if (parseInt(data.status, 10) > 399) {
                          switch (parseInt(data.status)) {
                              case 401:
                                  console.error('You are not authorized to sign in. Either reset the header or get another access token from facebook.')
                                  break;
                              default:
                                  console.error('Something went wrong, check the status code', data);
                          }
                      } else {
                          data.results.forEach(function(el) {
                              tc.like(el._id, function(err, data) {
                                  if (err) console.log(err);
                              })
                          })
                      }
                  })
              } catch (err) {
                  console.log(`Authorization failed for ${oneFakeAccount.name}: ${oneFakeAccount.id}\n`, err);
              }
          })
      })
  }, null, true, 'America/New_York');

  /* Checking for new matches and new messages */
     new CronJob('2 */1 * * * *', function() {
         console.log("LOGGING new cron to check updates: ", new Date(Date.now()))
         io.emit('time:update', {
             time: new Date()
         });
         getFakeAccounts()
         .then(function(allFakeAccounts) {
           allFakeAccounts.forEach(function(oneFakeAccount) {
              try {
                 var tc = new TinderClient(oneFakeAccount);
                 tc.getUpdates(function(err, data) {
                     if (err) console.error("unable to reach tinder", err);
                     if (data) {
                         if (parseInt(data.status, 10) > 399) {
                             switch (parseInt(data.status)) {
                                 case 401:
                                     console.error('You are not authorized to sign in. Either reset the header or get another access token from facebook.')
                                     break;
                                 default:
                                     console.error('Something went wrong, check the status code', data);
                             }
                         } else {
                             saveMatches.saveNewMaches(data.matches, oneFakeAccount.id);
                             saveMatches.saveNewMessages(data, oneFakeAccount.id);
                             saveMatches.checkBlocks(data);
                         }
                     }
                 })
              } catch (err) {
                  console.error(`Authorization failed for ${oneFakeAccount.name}: ${oneFakeAccount.id}\n`, err);
              }
         })
         mostRecentFirst().then(function(data) {
             io.emit('new:most-recent', data);
         });
       });
     }, null, true, 'America/New_York')

    function mostRecentFirst() {
        return new Promise(function(resolve, reject) {
            knex('conversations')
            .select('*')
            .orderBy('sent_date', 'desc')
            .join('photos', 'conversations.target_id', 'photos.target_id')
            .join('targets', 'targets.id','conversations.target_id')
            .where('conversations.received', true)
            .where('targets.blocked', false)
            .then(function(sortedByMsgSentDate) {
                return _.uniq(sortedByMsgSentDate, function(chat) {
                    return chat.target_id;
                })
            }).then(function(uniqAndSorted) {
                resolve(uniqAndSorted);
            })
        })
    }

    function sumTopResponses(fakeAccount) {
      console.log("THIS IS FAKE ACCONUT", fakeAccount);
        return new Promise(function(resolve, reject) {
            var timeBefore = timeUntilSqlTime();
            var messagesToSend = [];
            knex.raw(`SELECT SUM(v.up) as total_votes, msg.response_text, msg.conversation_id, msg.created_at, msg.id, tg.id, tg.tinder_id, tg.match_id FROM responses as msg LEFT JOIN votes as v on msg.id = v.response_id LEFT JOIN targets as tg on msg.target_id = tg.id WHERE tg.fake_account_id = ${fakeAccount.id} AND msg.created_at > '${timeBefore}' AND v.up IS NOT NULL GROUP BY tg.id, msg.id ORDER BY total_votes`)
            .then(function(data) {
                var sortedChatsByTinderAndTotalVotes = _.chain(data.rows).filter(function(el) {
                    return parseInt(el.total_votes, 10) > 0;
                }).groupBy(function(el) {
                    return el.tinder_id;
                }).sortByOrder(['total_votes'], ['desc']).value()
                sortedChatsByTinderAndTotalVotes.forEach(function(el) {
                    messagesToSend.push(_.last(el));
                })
                resolve(messagesToSend);
            })
        })
    }

    function getFakeAccounts() {
        return new Promise(function(resolve, reject) {
            knex('fake_accounts').then(function(fks) {
                resolve(fks);
            }).catch(function(err) {
                reject(err);
            });
        })
    }
}


module.exports = CronExecutables;
