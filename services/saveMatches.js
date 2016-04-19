var Target = require('../models/target')();
var FakeAccount = require('../models/fake_account')();
var Conversation = require('../models/conversations')();
var Photo = require('../models/photos')();
var timeUntilSqlTime = require('./timeUntil');
var moment = require("moment");
var bluebird = require("bluebird");
var _ = require('lodash');

module.exports = {
    saveNewMaches: function(io, myNewMatches, fakeAccountId, userId) {
        myNewMatches.forEach(function(match) {
            var insertionTarget = Target.getTargetInfo(match, fakeAccountId, userId)
            knex('targets')
                .returning(['id', 'tinder_id'])
                .insert(insertionTarget)
                .then(function(targetId) {
                    var targetId = {
                        id: targetId[0].id,
                        tinder_id: targetId[0].tinder_id
                    };
                    if (match.person.photos.length > 0) {
                        match.person.photos.forEach(function(photo) {
                            knex('photos')
                                .insert(Photo.getPhotoInfo(photo, targetId))
                                .then(function(data) {
                                    //safety
                                }, function(data) {
                                    return
                                });
                        });
                    }
                });
        });
    },
    newMatches: function(newMatches) {
        return new Promise(function(resolve, reject) {
            knex('targets')
                .select('*')
                .then(function(targets) {
                    return targets
                })
                .then(function(targets) {
                    var oldIds = targets.map(function(target) {
                        return target.match_id
                    });
                    var newMatches = newMatches.matches.filter(function(newMatch) {
                        return oldIds.indexOf(newMatch._id) === -1
                    })
                    resolve(newMatches);
                })
        })
    },
    checkBlocks: function(update) {
        knex('targets')
            .select('*')
            .whereIn('match_id', update.blocks)
            .update({
                blocked: true
            })
            .then(function(data) {
                console.log("BEEN BLOCKED BY MORE PEOPLE", data);
            });
    },
    saveNewMessages: function(io, updates, fakeAccountId) {
        updates.matches.forEach(function(match) {
            if (match.messages.length > 0) {
                match.messages.forEach(function(msg) {
                    knex('targets')
                        .select('*')
                        .where('match_id', msg.match_id)
                        .then(function(data) {
                            knex('conversations')
                                .select('tinder_id')
                                .where('target_id', data[0].id)
                                .then(function(idOfConversations) {
                                    var ids = idOfConversations.map(function(el) {
                                        return el.tinder_id;
                                    })
                                    if (ids.indexOf(msg._id) === -1) {
                                        var convoSave = Conversation.getConversationInfo(msg, fakeAccountId, data[0]);
                                        knex('conversations')
                                            .insert(convoSave)
                                            .then(function(data) {
                                                io.emit('new:conversation', {
                                                    convos: convoSave,
                                                    time: new Date()
                                                });
                                            })
                                    }
                                })
                                .catch(function(err) {
                                    console.log("CONVO ERROR", err);
                                })
                        })
                        .catch(function(err) {
                            console.log("TARGET ERROR: ", err);
                        })
                })
            }
        })
    },
};
