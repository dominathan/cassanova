'use strict';
function getConversationInfo(convoObj,fakeAccount,target) {
  return {
    fake_account_id: fakeAccount.id,
    target_id: target.id,
    message: convoObj.message,
    sent_date: convoObj.sent_date,
    received: convoObj.from === target.tinder_id ? true : false,
    tinder_id: convoObj._id,
  }
}

module.exports = getConversationInfo;
