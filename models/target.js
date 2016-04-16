module.exports = function() {
  return {
    getTargetInfo: function(targetObj,fakeAccountId,userId) {
      return {
        name: targetObj['person']['name'],
        tinder_id: targetObj['person']['_id'],
        bio: targetObj['person']['bio'] || "Empty Bio",
        birth_date: targetObj['person']['birth_date'],
        gender: targetObj['person']['gender'],
        match_id: targetObj['_id'],
        fake_account_id: fakeAccountId,
        blocked: false,
        user_id: userId,
        accessible: false
      }
    }
  }
}
