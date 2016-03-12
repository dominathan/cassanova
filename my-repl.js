var repl = require('repl');
var env = process.env.NODE_ENV || 'development';
var config = require("./knexfile");
var knex = require('knex')(config[env]);
var Q = require('./node_modules/q/q.js');
var TinderClient = require('./services/tinder-client');
var myProfile = require('./spec/fixtures/my_profile.json');
var myUpdates = require('./spec/fixtures/new_updates.json');
var oldUpdates = require('./spec/fixtures/my_updates.json');
var FakeAccount = require('./models/fake_account')();
var Target = require('./models/target')();
var Photo = require('./models/photos')();
var Conversation = require('./models/conversations')();
var lodash = require('lodash');

var myQueryFunction = function(tableName,selection) {
  var defer = Q.defer()
  return function() {
    knex(tableName).select(selection).then(function(data) {
      defer.resolve(data);
    }).catch(function(err) {
      defer.reject(err);
    })
    return defer.promise;
  }
}

var replServer = repl.start({
  prompt: 'cassanova :> '
});


replServer.context.repl = repl;
replServer.context.knex = knex;
replServer.context.Q = Q;
replServer.context.env = env;

replServer.context.myProfile = myProfile;
replServer.context.myUpdates = myUpdates;
replServer.context.oldUpdates = oldUpdates;
replServer.context.FakeAccount = FakeAccount;
replServer.context.TinderClient = TinderClient;
replServer.context.Target = Target;
replServer.context.Photo = Photo;
replServer.context.Conversation = Conversation;
replServer.context.myQueryFunction = myQueryFunction;
replServer.context.lodash = lodash;


// All functions below clear and re-seed database;
(function() {
    knex('conversations').delete()
                .then(function(dat) { console.log("DELETING Conversations", dat) },
                       function(dat) { console.log('failed Conversations deletion',dat) }
                 );
    knex('photos').delete()
                .then(function(dat) { console.log("DELETING PHOTOS", dat) },
                       function(dat) { console.log('failed photo deletion',dat) }
                 );
    knex('targets').delete()
      .then(function(dat) { console.log("DELETING Targets", dat) },
            function(dat) { console.log('failed Target deletion',dat) }
      );

    // knex('fake_accounts').delete()
    //                      .then(function(dat) { console.log("DELETING FAKE ACCOUNTS", dat) },
    //                            function(dat) { console.log('failed deletion',dat) }
    //                      );

    return
})();
(function() {
    var fake_account;
    knex('fake_accounts').select('*')
       .then(function(dat) {
         var fakeAccountId = {id: dat[0].id};
           myUpdates.matches.forEach(function(match) {
              knex('targets').returning(['id','tinder_id']).insert(Target.getTargetInfo(match,fakeAccountId))
               .then(function(targetId) {
                  var targetId = {id: targetId[0].id, tinder_id: targetId[0].tinder_id};
                  if(match.person.photos.length > 0) {
                    match.person.photos.forEach(function(photo) {
                      knex('photos').insert(Photo.getPhotoInfo(photo,targetId))
                        .then(function(data) {
                          //safety
                        },function(data) {
                          console.log("FAIL INSERTION TO PHOTOS", data);
                          throw new Error('Failed insertion to photos dbtable:', data);
                          return
                        });
                    });
                  }
                  if(match.messages.length > 0) {
                    match.messages.forEach(function(convo) {
                      knex('conversations').insert(Conversation.getConversationInfo(convo,fakeAccountId,targetId))
                        .then(function(convoSave) {
                          //convo saved;
                        },
                        function(convoErr) {
                          throw new Error('failed insertion to conversation: ', convoErr);
                        })
                    })
                  }
               },
               function(dat) {
                console.log('FAILED INSERT TO TARGETS',dat);
                throw new Error('Failed insertion to targets dbtable: ', dat);
               });
            });
        },function(dat) {
          console.log('FAILED INSERT TO FAKE ACCOUNTS',dat);
          throw new Error('Failed insertion to fake accounts fake accounts', dat);
      })
})();

// https://www.facebook.com/connect/login_success.html#access_token=CAAGm0PX4ZCpsBAF3pZAVWX45YJQEVahOlsSOIiwrbwhIeHmAZCDtGaIjJW6jJir6QTIZCt1WpByCULWUs2zKCFks2uuUlBaZBHeIrs6algJmXP3QGEs31kZCRD3QHVYKCksj3LZBJexmHBZCC8wDkzZCAjJN7x9WVvJhGCrSpKLJDcZCLMTKhthdRHVSyfOMil2cZC0rOrFS25b6QZDZD&expires_in=3969
