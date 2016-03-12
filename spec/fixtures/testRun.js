var myProfile = require('./my_profile');
var myUpdates = require('./my_updates');
var newUpdates = require('./new_updates');
var timeUntilSqlTime = require('./services/timeUntil');
var Target = require('../../models/target');
var Photo = require('../../models/photos');
var Conversation = require('../../models/conversations');
var _ = require('lodash');

function newMatches(oldMatches, newMatches) {
  return newMatches.length > oldMatches.length;
}

function existingMatchIds(oldMatches) {
  return _.pluck(oldMatches,'id');
};

function newMatchList(oldMatches,newMatches) {
  var oldMatchIds = existingMatchIds(oldMatches);
  return newMatches.filter(function(match) {
    return oldMatchIds.indexOf(match.id) === -1
  });
};

function newMatchObjectsToSave(oldMatches,newMatches,fakeAccountId) {
  var newMatches = newMatchList(oldMatches,newMatches);
  return newMatchList.map(function(match) {
    return Target.getTargetInfo(match,fakeAccountId);
  });
};

/*
 * Probably want to feed this through matches above instead of trying to
 * filtet matches twice
 */
function newMatchPhotosToSave(oldMatches,newMatches,target) {
  var newMatches = newMatchList(oldMatches,newMatches);
  var photoObjectsToSave = [];
  newMatches.forEach(function(match) {
    match.person.photos.forEach(function(pho) {
      photoObjectsToSave.push(Photo.getPhotoInfo(pho,target.id));
    });
  });
  return photoObjectsToSave
}

/*
 * Filter matches where created_at on tinder is normalized and greater than
 * time since my last update.  Maybe feed through newMessages
 * UPDATE:,
 * If we hit the updates/limit on TinderClient  instead of history, it shows updates since last time you checked?
 */
function newConversations(matches,fakeAccont,target,dateSinceLastCheck /*Or time since last check*/) {
   var newMessages = _.chain(matches)
     .pluck('messages')
     .flattenDeep()
     .filter(function(msg) {
       return new Date(msg.created_date) > /* DATE SINCE LAST CHECK */new Date();
     })
     .map(function(msg) {
       return Conversation.getConversationInfo(msg,fakeAccount,target)
     })
     .value();
   return newMessages;
};

function sendMessages(messagesToSend) {
  var tc = new TinderClient();
  if(tc.isAuthorized) {
    messagesToSend.forEach(function(match) {
      tc.sendMessage(match.match_id,match.response_text);

      //IO.emit({response_text: match.repsonse_text, target_id: match.target_id})
    })
  }
}


function saveNewMatches(myNewMatches,fakeAccount) {
  myNewMatches.matches.forEach(function(match) {
    knex('targets').returning(['id','tinder_id']).insert(Target.getTargetInfo(match,fakeAccount))
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
            knex('conversations').insert(Conversation.getConversationInfo(convo,fakeAccount,targetId))
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
}
