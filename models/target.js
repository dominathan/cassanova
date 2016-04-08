module.exports = function() {
  return {
    getTargetInfo: function(targetObj,fakeAccount) {
      return {
        name: targetObj['person']['name'],
        tinder_id: targetObj['person']['_id'],
        bio: targetObj['person']['bio'] || "Empty Bio",
        birth_date: targetObj['person']['birth_date'],
        gender: targetObj['person']['gender'],
        match_id: targetObj['_id'],
        fake_account_id: fakeAccount.id,
        blocked: false
      }
    }
  }
}
