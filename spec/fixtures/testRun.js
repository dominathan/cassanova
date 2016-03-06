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
