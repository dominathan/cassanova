'use strict';

module.exports = function() {
  return {
    getConversationInfo: function(convoObj,fakeAccount,target) {
      return {
        fake_account_id: fakeAccount.id,
        target_id: target.id,
        message: convoObj.message,
        sent_date: convoObj.sent_date,
        received: convoObj.from === target.tinder_id ? true : false,
        tinder_id: convoObj._id,
      }
    }
  }
}
