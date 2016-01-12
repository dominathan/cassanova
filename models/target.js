'use strict'

module.exports = function() {
  return {
    getTargetInfo: function(targetObj,fakeAccountId) {
      return {
        name: targetObj['person']['name'],
        tinder_id: targetObj['person']['_id'],
        bio: targetObj['person']['bio'] || "FILL ME OUT",
        birth_date: targetObj['person']['birth_date'],
        gender: targetObj['person']['gender'],
        match_id: targetObj['_id'],
        fake_account_id: fakeAccountId.id,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
    }
  }
};
