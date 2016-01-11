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


// All functions below clear and re-seed database;
(function() {
    knex('fake_accounts').delete()
                         .then(function(dat) { console.log("DELETING FAKE ACCOUNTS", dat) },
                               function(dat) { console.log('failed deletion',dat) }
                         );
    knex('targets').delete()
                   .then(function(dat) { console.log("DELETING FAKE ACCOUNTS", dat) },
                         function(dat) { console.log('failed photo deletion',dat) }
                   );
    knex('photos').delete()
                  .then(function(dat) { console.log("DELETING PHOTOS", dat) },
                         function(dat) { console.log('failed photo deletion',dat) }
                   );

    return
})();
(function() {
    knex('fake_accounts').insert(FakeAccount.getProfileInfo(myProfile))
                         .then(function(dat) {
                                console.log("SUCCESS: INSERTING TO FAKE ACCOUNTS", dat)
                              },
                               function(dat) {
                                console.log('FAILED INSERT TO FAKE ACCOUNTS',dat);
                                throw new Error('Failed insertion to fake accounts dbtable');
                              }
                          );
    myUpdates.matches.forEach(function(el) {
      knex('targets').insert(Target.getTargetInfo(el,knex('fake_accounts').where('id','=','55f0ab2151a84db35e78dfe8')))
                     .then(function(dat) {
                            console.log('SUCCESS: INSERTION TO TARGETS',dat);
                            if(el.person.photos.length > 0) {
                              el.person.photos.forEach(function(photo) {
                                knex('photos').insert(Photo.getPhotoInfo(el,dat))
                                            .then(function(data) {
                                              console.log("SUCCESS INSERTION TO PHOTOS",data);
                                            },function(data) {
                                              console.log("FAIL INSERTION TO PHOTOS", data);
                                              throw new Error('Failed insertion to photos dbtable');
                                            });
                              });
                            }

                           },
                           function(dat) {
                            console.log('FAILED INSERT TO TARGETS',dat);
                            throw new Error('Failed insertion to targets dbtable');
                           }
                     );
    });
    return
})();
