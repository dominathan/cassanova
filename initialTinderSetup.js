var TinderClient = require('./services/tinder-client');
var env = process.env.NODE_ENV || 'development';
var config = require("./knexfile");
var knex = require('knex')(config[env]);
var FakeAccount = require('./models/fake_account')();
var Target = require('./models/target');
var Conversation = require('./models/conversations');
var Photo = require('./models/photos');

(function() {
  knex('fake_accounts').select('*').then(function(data) {
    var tc = new TinderClient(data[0]);
    var fk = data[0]

    tc.getHistory(function(err,data) {
      if(err) return err;
      saveNewMaches(data,fk);
      saveNewMessages(data);
    })
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

                  // io.emit('new:conversation', {convos: convoSave, time: new Date()});
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
