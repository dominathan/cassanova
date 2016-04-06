var TinderClient = require('./services/tinder-client');
var env = process.env.NODE_ENV || 'development';
var config = require("./knexfile");
var knex = require('knex')(config[env]);
var FakeAccount = require('./models/fake_account')();
var Target = require('./models/target');
var Conversation = require('./models/conversations');
var Photo = require('./models/photos');

(function() {
  var args = process.argv.slice(2)
  var options = {facebook_authentication_token: args[0], facebook_user_id: args[1]};
  var tc = new TinderClient(options);
  var fk = {id: null}
  tc.authorize(tc.fbKey,tc.fbId, function(err,data,body) {
    if(err) return err;
    tc.getProfile(function(err,newData) {
      console.log('WORK?', newData._id)
      knex('fake_accounts')
      .insert({
        facebook_authentication_token: tc.fbKey,
        facebook_user_id: tc.fbId,
        name: newData.name,
        bio: newData.bio,
        tinder_id: newData._id
      }).returning('*').then(function(data) {
        fk.id = data[0].id
        tc.getHistory(function(err,histData) {
          console.log('THIS NO WORKY?', histData);
          if(err) return err;
          saveNewMatches(histData,fk);
          saveNewMessages(histData);
        });
      })
    });
  })
})();

function saveNewMatches(myNewMatches,fakeAccount) {
  myNewMatches.matches.forEach(function(match) {
    try {
      var insertionTarget = Target(match,fakeAccount)
      console.log('damn', insertionTarget);
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
