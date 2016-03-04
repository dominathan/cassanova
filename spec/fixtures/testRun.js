var myProfile = require('./my_profile');
var myUpdates = require('./my_updates');
var newUpdates = require('./new_updates');
var timeUntilSqlTime = require('./services/timeUntil');
var target = require('../../models/target.js');
var photo = require('../../models/photos.js')
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
    return target.getTargetInfo(match,fakeAccountId);
  });
};

function newMatchPhotosToSave(oldMatches,newMatches) {
  var newMatches = newMatchList(oldMatches,newMatches);
  var photoObjectsToSave = [];
  newMatches.forEach(function(match) {
    match.person.photos.forEach(function(pho) {
      photoObjectsToSave.push(photo.getPhotoInfo(pho,match.person._id));
    });
  });
  return photoObjectsToSave
}

function newMsgs(matches,dateSinceLastCheck /*Or time since last check*/) {
  /*
   * Filter matches where created_at on tinder is normalized and greater than
   * time since my last update
   */
   var newMessages = _.chain(matches)
               .pluck('messages')
               .flattenDeep()
               .filter(function(msg) {
                 return new Date(el.created_date) > /* DATE SINCE LAST CHECK */new Date();
               })
               .value();

};
