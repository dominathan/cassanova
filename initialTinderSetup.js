var TinderClient = require('./services/tinder-client');
var env = process.env.NODE_ENV || 'development';
var config = require("./knexfile");
var knex = require('knex')(config[env]);
var FakeAccount = require('./models/fake_account')();
var Target = require('../models/target');
var Conversation = require('../models/conversations');
var Photo = require('../models/photos');

(function() {
  var naynay = { id: 1,
    bio: 'University of Virginia grad, but an Auburn fan at heart. \n\nMake me laugh and there\'s a 50% chance I\'ll let you meet Woodrow, the best damn dog in the world. Except when he pees on people. \n\nIt\'s tough being a single dad. Or so I\'m told. I wouldn\'t know. I don\'t have kids. \n\nSupport gay marriage. Fear gay divorce. \n\nI will bring you coffee.',
    birth_date: 'Wed Sep 16 1987 20:00:00 GMT-0400 (EDT)',
    gender: '0',
    latitude: '32.81310847891687',
    longitude: '-79.95211340861005',
    name: 'Nathan',
    tinder_id: '55f0ab2151a84db35e78dfe8',
    facebook_user_id: '83486237662128',
    facebook_authentication_token: 'CAAGm0PX4ZCpsBAIzhZC7xtPZAI7CRjqtwFcWnvF7LIHlOYDGDu2wRbVkhj4RgvCd6rA8mOPqTiObIp2Hck2gUw1XNbWfizLdP7SJzKdpiyTBrIE3SOj0OkjOnwxmEpxlwoTqLe6RRerw7SX8kddbQkVW0pZAGoZAY6iYBGrwDvh8IyijiZB2xuZAsJbNyzv4nRm86LFTh9hPwZDZD',
    tinder_authentication_token: 'd82e2975-e063-42fc-b0f3-1cfe0393b53f',
    created_at: 'Thu Mar 10 2016 18:52:05 GMT-0500 (EST)',
    updated_at: 'Thu Mar 10 2016 18:52:05 GMT-0500 (EST)',
    facebook_expiration_time: null,
    tinder_expiration_time: null
  }
  var tc = new TinderClient(naynay);
  var profile
  tc.getProfile(function(err,data) {
    profile = data;
    var acct = FakeAccount.getProfileInfo(profile);
    knex('fake_accounts').insert(acct).then(function(data) {
      console.log(data);
    })
  })

  tc.getHistory(function(err,data) {
    if(err) return err;
    saveNewMaches(data,{id: 1});
    saveNewMessages(data);
  })
})()

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
            knex('conversations').select('tinder_id').where('target_id',data[0].id)
              .then(function(idOfConversations) {
                var ids = idOfConversations.map(function(el) {
                  return el.tinder_id
                })
                if(ids.indexOf(msg._id) === -1) {
                  var fakeAcc = {
                    id: data[0].fake_account_id
                  }
                  var convoSave = Conversation(msg,fakeAcc,data[0])

                  io.emit('new:conversation', {convos: convoSave, time: new Date()});
                  try {
                    knex('conversations').insert(convoSave).then(function(data) {
                      console.log('saving convo', data);
                    })
                  } catch(err) {
                    console.error("Probably unique key constraint", err);
                  }
                }
              })
          })
        })
    }
  })
}
