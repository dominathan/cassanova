'use strict';

module.exports = function() {
  return {
    getConversationInfo: function(convoObj,fakeAccountId,target) {
      return {
        fake_account_id: fakeAccountId,
        target_id: target.id,
        message: convoObj.message,
        sent_date: convoObj.sent_date,
        received: convoObj.from === target.tinder_id ? true : false,
        tinder_id: convoObj._id,
      }
    }
  }
}
