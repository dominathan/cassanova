var CronJob = require('cron').CronJob;
var TinderClient = require('./tinder-client');
var Target = require('../models/target');
var FakeAccount = require('../models/fake_account');
var Conversation = require('../models/conversations');
var Photo = require('../models/photos');
var env = process.env.NODE_ENV || 'development';
var config = require("../knexfile");
var knex = require('knex')(config[env]);
var timeUntilSqlTime = require('./timeUntil');
var moment = require("moment");
var bluebird = require("bluebird");
var _ = require('lodash');


function CronExecutables(io) {
  new CronJob('48 9,19,29,39,49,59 * * * *', function() {
    console.log("TIME STAMP", new Date(Date.now()));
    var responsesToSend = sumTopResponses();
    knex('fake_accounts')
      .select('*')
      .then(function(data) {
        return data[0];
      })
     .then(function(tcOptions) {
       var tc = new TinderClient(tcOptions)
       responsesToSend.then(function(data) {
         console.log("THIS WORKS?: ", data);
         if(tc.isAuthorized() && data.length > 0) {
           data.forEach(function(msg) {
            tc.sendMessage(msg.match_id,msg.response_text,function(err,data) {
              if(err) {
                throw err
              } else {
                var messageToEmit = {
                  target_id: msg.target_id,
                  message: msg.response_text,
                  received: false,
                  sent_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
                }
                io.emit('new:conversation', {convos: messageToEmit, time: new Date()});
              };
            })
          })
        }
     })
    })

  },null,true,'America/New_York');


  new CronJob('5 */2 * * * *', function() {
    console.log("LOGGING new cron to check updates: ", new Date(Date.now()))
    knex('fake_accounts').select('*').then(function(data) {
      return data[0];
    })
    .then(function(fk_account) {
      var tc = new TinderClient(fk_account);
      tc.getUpdates(function(err,data) {
        if(err) throw new Error("unable to reach tinder", err);
        if(parseInt(data.status,10) > 399) {
          switch(parseInt(data.status)) {
            case 401:
              console.error('You are not authorized to sign in. Either reset the header or get another access token from facebook.')
              break;

            default:
              console.error('Something went wrong, check the status code', data);
          }
        } else {
          console.log("GETTING UPDATES", data);

          saveNewMaches(data,fk_account);
          saveNewMessages(data);
          checkBlocks(data);
        }
      })
    })
  },null,true,'America/New_York')

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

  function saveNewMaches(myNewMatches,fakeAccount) {
    myNewMatches.matches.forEach(function(match) {
      try {
        var insertionTarget = Target(match,fakeAccount)
        knex('targets').returning(['id','tinder_id']).insert(insertionTarget)
         .then(function(targetId) {
            var targetId = {id: targetId[0].id, tinder_id: targetId[0].tinder_id};
            if(match.person.photos.length > 0) {
              match.person.photos.forEach(function(photo) {
                knex('photos').insert(Photo(photo,targetId))
                  .then(function(data) {
                    //safety
                  },function(data) {
                    return
                  });
              });
            }
         },
         function(dat) {
         });
      } catch(err) {
        console.error('Could not save, probably unique key constraint', err)
      }
    });
  }

  function newMatches(newMatches) {
    return new Promise(function(resolve,reject) {
      knex('targets')
      .select('*')
      .then(function(targets) {
        return targets
      })
      .then(function(targets) {
        var oldIds = targets.map(function(target) { return target.match_id });
        var newMatches = newMatches.matches.filter(function(newMatch) {
          return oldIds.indexOf(newMatch._id) === -1
        })
        resolve(newMatches);
      })

    })
  }

  function checkBlocks(update) {
    knex('targets')
      .select('*')
      .whereIn('match_id',update.blocks)
      .update({blocked: true}).then(function(data) {
        console.log("BEEN BLOCKED BY MORE PEOPLE",data);
      });
  }

  function saveNewMessages(updates) {
    updates.matches.forEach(function(match) {
      if(match.messages.length > 0) {
          match.messages.forEach(function(msg) {
            knex('targets').select('*').where('match_id',msg.match_id)
            .then(function(data) {
              var fakeAcc = {
                id: data[0].fake_account_id
              }
              var convoSave = Conversation(msg,fakeAcc,data[0])

              try {
                knex('conversations').insert(convoSave).then(function(data) {
                  console.log('saving convo', data);
                })
              } catch(err) {
                console.error("Probably unique key constraint", err);
              }
            })
          })
      }
    })
  }

}
module.exports = CronExecutables;
