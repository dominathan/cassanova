var repl = require('repl');
var env = process.env.NODE_ENV || 'development';
var config = require("./knexfile");
var knex = require('knex')(config[env]);
var Q = require('./node_modules/q/q.js');
var myProfile = require('./spec/fixtures/my_profile.json');
var myUpdates = require('./spec/fixtures/new_updates.json');
var fakeAccount = require('./models/fake_account')();

var replServer = repl.start({
  prompt: 'cassanova :> '
});


replServer.context.repl = repl;
replServer.context.knex = knex;
replServer.context.myProfile = myProfile;
replServer.context.myUpdates = myUpdates;
replServer.context.fakeAccount = fakeAccount;
replServer.context.Q = Q;
replServer.context.env = env;


(function() {
    knex('fake_accounts').delete()
                         .then(function(dat) { console.log("DELETING FAKE ACCOUNTS", dat) },
                               function(dat) { console.log('failed deletion',dat) }
                         );
})();
(function() {
    knex('fake_accounts').insert(fakeAccount.getProfileInfo(myProfile))
                         .then(function(dat) { console.log("INSERTING TO FAKE ACCOUNTS", dat) },
                               function(dat) { console.log('FAILED INSERT TO FAKE ACCOUNTS',dat) }
                               );
})()
