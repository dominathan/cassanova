var repl = require('repl');
var env = process.env.NODE_ENV || 'development';
var config = require("./knexfile");
var knex = require('knex')(config[env]);
var Q = require('./node_modules/q/q.js');
var myProfile = require('./spec/fixtures/my_profile.json');
var myUpdates = require('./spec/fixtures/new_updates.json');
var FakeAccount = require('./models/fake_account')();
var Target = require('./models/target')();
var Photo = require('./models/photos')();

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
replServer.context.fakeAccount = FakeAccount;
replServer.context.target = Target;
replServer.context.photo = Photo;
replServer.context.myQueryFunction = myQueryFunction;


// All functions below clear and re-seed database;
(function() {
    knex('photos').delete()
                .then(function(dat) { console.log("DELETING PHOTOS", dat) },
                       function(dat) { console.log('failed photo deletion',dat) }
                 );
    knex('targets').delete()
      .then(function(dat) { console.log("DELETING Targets", dat) },
            function(dat) { console.log('failed Target deletion',dat) }
      );

    knex('fake_accounts').delete()
                         .then(function(dat) { console.log("DELETING FAKE ACCOUNTS", dat) },
                               function(dat) { console.log('failed deletion',dat) }
                         );

    return
})();
(function() {
    var fake_account;
    knex('fake_accounts').returning('id').insert(FakeAccount.getProfileInfo(myProfile))
       .then(function(dat) {
         var fakeAccountId = {id: dat.pop()};
           myUpdates.matches.forEach(function(match) {
              knex('targets').returning('id').insert(Target.getTargetInfo(match,fakeAccountId))
               .then(function(targetId) {
                  var targetId = {id: targetId.pop()};
                  if(match.person.photos.length > 0) {
                    match.person.photos.forEach(function(photo) {
                      knex('photos').insert(Photo.getPhotoInfo(photo,targetId))
                        .then(function(data) {
                          //safety
                        },function(data) {
                          console.log("FAIL INSERTION TO PHOTOS", data);
                          throw new Error('Failed insertion to photos dbtable');
                          return
                        });
                    });
                  }
               },
               function(dat) {
                console.log('FAILED INSERT TO TARGETS',dat);
                throw new Error('Failed insertion to targets dbtable');
               });
            });
        },function(dat) {
          console.log('FAILED INSERT TO FAKE ACCOUNTS',dat);
          throw new Error('Failed insertion to fake accounts dbtable');
      })
})();
