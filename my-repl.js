var repl = require('repl');
var env = process.env.NODE_ENV || 'development';
var db = require("./knexfile");
var knex = require('knex')(db[env]);
var config = require('./config/config')
var jwt = require('jwt-simple');
var moment = require('moment');
var bluebird = require('bluebird');

var TinderClient = require('./services/tinder-client');
var myProfile = require('./spec/fixtures/my_profile.json');
var myUpdates = require('./spec/fixtures/new_updates.json');
var oldUpdates = require('./spec/fixtures/my_updates.json');
var FakeAccount = require('./models/fake_account')();
var Target = require('./models/target');
var Photo = require('./models/photos');
var Conversation = require('./models/conversations');
var lodash = require('lodash');

var replServer = repl.start({
  prompt: 'cassanova :> '
});


replServer.context.repl = repl;
replServer.context.knex = knex;
replServer.context.env = env;
replServer.context.jwt = jwt;
replServer.context.config = config;
replServer.context.moment = moment;
replServer.context.bluebird = bluebird;

replServer.context.myProfile = myProfile;
replServer.context.myUpdates = myUpdates;
replServer.context.oldUpdates = oldUpdates;
replServer.context.FakeAccount = FakeAccount;
replServer.context.TinderClient = TinderClient;
replServer.context.Target = Target;
replServer.context.Photo = Photo;
replServer.context.Conversation = Conversation;
replServer.context.lodash = lodash;

// https://www.facebook.com/connect/login_success.html#access_token=CAAGm0PX4ZCpsBAF3pZAVWX45YJQEVahOlsSOIiwrbwhIeHmAZCDtGaIjJW6jJir6QTIZCt1WpByCULWUs2zKCFks2uuUlBaZBHeIrs6algJmXP3QGEs31kZCRD3QHVYKCksj3LZBJexmHBZCC8wDkzZCAjJN7x9WVvJhGCrSpKLJDcZCLMTKhthdRHVSyfOMil2cZC0rOrFS25b6QZDZD&expires_in=3969


function getFakeAccounts() {
 return new Promise(function(resolve,reject) {
   knex('fake_accounts')
    .then(function(fks) {
     resolve(fks);
    }).catch(function(err) {
     reject(err);
    });
  })
 }
