var env = process.env.NODE_ENV || 'development';
var config = require("../knexfile");
var knex = require('knex')(config[env]);
var FakeAccount = require('../models/fake_account')();
var Target = require('../models/target')();
var Conversation = require('../models/conversations')();
var Photo = require('../models/photos')();
var myProfile = require('../spec/fixtures/my_profile.json');
var myUpdates = require('../spec/fixtures/new_updates.json');

(function() {
  knex('users').insert({
    username: "dominathan",
    email: 'test@test.com',
    password: 'password',
  }).returning('id')
  .then(function(user) {


    knex('fake_accounts').insert({
      tinder_id: myProfile._id,
      facebook_user_id: '2394290342390',
      user_id: user[0]
    })
    .returning('*')
    .then(function(thing) {
      knex('fake_accounts')
      .select('*')
      .then(function(dat) {
        var fakeAccountId = {id: dat[0].id};

          myUpdates.matches.forEach(function(match) {
             var tg = Target.getTargetInfo(match,fakeAccountId.id,user[0])
             knex('targets').returning(['id','tinder_id']).insert(tg)
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
                     knex('conversations').insert(Conversation.getConversationInfo(convo,fakeAccountId.id,targetId))
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
    })


  })





})();


function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}
