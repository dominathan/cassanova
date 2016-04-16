var CronJob = require('cron').CronJob;
var TinderClient = require('./tinder-client');
var Target = require('../models/target')();
var FakeAccount = require('../models/fake_account')();
var Conversation = require('../models/conversations')();
var Photo = require('../models/photos')();
var timeUntilSqlTime = require('./timeUntil');
var moment = require("moment");
var bluebird = require("bluebird");
var _ = require('lodash');


function CronExecutables(io) {
  // new CronJob('0 0,5,10,15,20,25,30,35,40,45,50,55 * * * *', function() {
  //   io.emit('responses:clear-old', {});
  // },null,true,'America/New_York');
  //
  // new CronJob('58 4,9,14,19,24,29,34,39,44,49,54,59 * * * *', function() {
  //   console.log("TIME STAMP", new Date(Date.now()));
  //   var responsesToSend = sumTopResponses();
  //
  //   knex('fake_accounts')
  //     .select('*')
  //     .then(function(data) {
  //       return data[0];
  //     })
  //    .then(function(tcOptions) {
  //      var tc = new TinderClient(tcOptions)
  //      responsesToSend.then(function(data) {
  //        if(tc.isAuthorized() && data.length > 0) {
  //          data.forEach(function(msg) {
  //           tc.sendMessage(msg.match_id,msg.response_text,function(err,data) {
  //             if(err) {
  //               console.log('cannot send', err)
  //               throw err
  //             }
  //             console.log("SENT MESSAGE", data);
  //           })
  //         })
  //       }
  //    })
  //   })
  //
  // },null,true,'America/New_York');
  //
  // new CronJob('0 */30 * * * *', function() {
  //   console.log("Checking for new matches: ",new Date(Date.now()));
  //   knex('fake_accounts').select('*').then(function(data) {
  //     return data[0];
  //   })
  //   .then(function(fk_account) {
  //     var tc = new TinderClient(fk_account);
  //     try {
  //       tc.getRecommendations(1000,function(err,data) {
  //         if(parseInt(data.status,10) > 399) {
  //           switch(parseInt(data.status)) {
  //             case 401:
  //               console.error('You are not authorized to sign in. Either reset the header or get another access token from facebook.')
  //               break;
  //
  //             default:
  //               console.error('Something went wrong, check the status code', data);
  //           }
  //         } else {
  //           data.results.forEach(function(el) {
  //             tc.like(el._id, function(err, data) {
  //               if(err) console.log(err);
  //             })
  //           })
  //         }
  //       })
  //     } catch(err) {
  //       console.log("Authorization failed: ",err);
  //     }
  //
  //   })
  // }, null, true, 'America/New_York');
  //
  // new CronJob('2 */1 * * * *', function() {
  //   console.log("LOGGING new cron to check updates: ", new Date(Date.now()))
  //   io.emit('time:update', {time: new Date()});
  //   knex('fake_accounts').select('*').then(function(data) {
  //     return data[0];
  //   })
  //   .then(function(fk_account) {
  //     try {
  //       var tc = new TinderClient(fk_account);
  //       tc.getUpdates(function(err,data) {
  //         if(err) console.error("unable to reach tinder", err);
  //         if(data) {
  //           if(parseInt(data.status,10) > 399) {
  //             switch(parseInt(data.status)) {
  //               case 401:
  //                 console.error('You are not authorized to sign in. Either reset the header or get another access token from facebook.')
  //                 break;
  //
  //               default:
  //                 console.error('Something went wrong, check the status code', data);
  //             }
  //           } else {
  //             saveNewMaches(data.matches,fk_account);
  //             saveNewMessages(data);
  //             checkBlocks(data);
  //           }
  //         }
  //       })
  //     } catch(err) {
  //       console.error('Catch error on update check', err);
  //     }
  //   })
  //
  //   mostRecentFirst()
  //   .then(function(data) {
  //     io.emit('new:most-recent', data);
  //   });
  // },null,true,'America/New_York')
  //
  // function mostRecentFirst() {
  //   return new Promise(function(resolve,reject) {
  //     knex('conversations')
  //       .select('*')
  //       .orderBy('sent_date','desc')
  //       .join('photos','conversations.target_id','photos.target_id')
  //       .join('targets','targets.id','conversations.target_id')
  //       .where('conversations.received',true)
  //       .where('targets.blocked',false)
  //       .then(function(sortedByMsgSentDate) {
  //         return _.uniq(sortedByMsgSentDate,function(chat) {
  //           return chat.target_id;
  //         })
  //       })
  //       .then(function(uniqAndSorted) {
  //         resolve(uniqAndSorted);
  //       })
  //   })
  // }
  //
  // function sumTopResponses() {
  //   return new Promise(function(resolve, reject) {
  //     var timeBefore = timeUntilSqlTime();
  //     var messagesToSend = [];
  //     knex.raw(`SELECT SUM(v.up) as total_votes, msg.response_text, msg.conversation_id, msg.created_at, msg.id, tg.id, tg.tinder_id, tg.match_id FROM responses as msg LEFT JOIN votes as v on msg.id = v.response_id LEFT JOIN targets as tg on msg.target_id = tg.id WHERE msg.created_at > '${timeBefore}' AND v.up IS NOT NULL GROUP BY tg.id, msg.id ORDER BY total_votes`)
  //         .then(function(data) {
  //            var sortedChatsByTinderAndTotalVotes = _.chain(data.rows)
  //              .filter(function(el) {
  //                return parseInt(el.total_votes,10) > 0;
  //              })
  //              .groupBy(function(el) {
  //                return el.tinder_id;
  //              })
  //              .sortByOrder(['total_votes'],['desc'])
  //            .value()
  //            sortedChatsByTinderAndTotalVotes.forEach(function(el) {
  //              messagesToSend.push(_.last(el));
  //            })
  //           resolve(messagesToSend);
  //         })
  //   })
  // }
  //
  // function saveNewMaches(myNewMatches,fakeAccount) {
  //   myNewMatches.forEach(function(match) {
  //     try {
  //       var insertionTarget = Target.getTargetInfo(match,fakeAccount)
  //       knex('targets').returning(['id','tinder_id']).insert(insertionTarget)
  //        .then(function(targetId) {
  //           var targetId = {id: targetId[0].id, tinder_id: targetId[0].tinder_id};
  //           if(match.person.photos.length > 0) {
  //             match.person.photos.forEach(function(photo) {
  //               knex('photos').insert(Photo.getPhotoInfo(photo,targetId))
  //                 .then(function(data) {
  //                   //safety
  //                 },function(data) {
  //                   return
  //                 });
  //             });
  //           }
  //        },
  //        function(dat) {
  //        });
  //     } catch(err) {
  //       console.error('Could not save, probably unique key constraint', err)
  //     }
  //   });
  // }
  //
  // function newMatches(newMatches) {
  //   return new Promise(function(resolve,reject) {
  //     knex('targets')
  //     .select('*')
  //     .then(function(targets) {
  //       return targets
  //     })
  //     .then(function(targets) {
  //       var oldIds = targets.map(function(target) { return target.match_id });
  //       var newMatches = newMatches.matches.filter(function(newMatch) {
  //         return oldIds.indexOf(newMatch._id) === -1
  //       })
  //       resolve(newMatches);
  //     })
  //
  //   })
  // }
  //
  // function checkBlocks(update) {
  //   knex('targets')
  //     .select('*')
  //     .whereIn('match_id',update.blocks)
  //     .update({blocked: true}).then(function(data) {
  //       console.log("BEEN BLOCKED BY MORE PEOPLE",data);
  //     });
  // }
  //
  // function saveNewMessages(updates) {
  //   updates.matches.forEach(function(match) {
  //     if(match.messages.length > 0) {
  //         match.messages.forEach(function(msg) {
  //           knex('targets').select('*').where('match_id',msg.match_id)
  //           .then(function(data) {
  //             knex('conversations').select('tinder_id').where('target_id',data[0].id)
  //               .then(function(idOfConversations) {
  //                 var ids = idOfConversations.map(function(el) {
  //                   return el.tinder_id
  //                 })
  //                 if(ids.indexOf(msg._id) === -1) {
  //                   var fakeAcc = {
  //                     id: data[0].fake_account_id
  //                   }
  //                   var convoSave = Conversation.getConversationInfo(msg,fakeAcc,data[0])
  //
  //                   io.emit('new:conversation', {convos: convoSave, time: new Date()});
  //                   try {
  //                     knex('conversations').insert(convoSave).then(function(data) {
  //                     })
  //                   } catch(err) {
  //                     console.error("Probably unique key constraint", err);
  //                   }
  //                 }
  //               })
  //           })
  //         })
  //     }
  //   })
  // }
  //
}
module.exports = CronExecutables;
