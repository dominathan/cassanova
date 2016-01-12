'use strict';

module.exports = function() {
  return {
    getConversationInfo: function(convoObj,fakeAccount,target) {
      // knex('fake_accounts')
      //  .select('id')
      //  .whereExists(knex.select('*')
        //  .from('targets')
        //  .whereRaw('targets.fake_account_id = fake_accounts.id')
        //  .andWhere('id',target.id))
      return {
        fake_account_id: fakeAccount.id,
        target_id: target.id,
        message: convoObj.message,
        sent_date: convoObj.sent_date,
        received: convoObj.from === target.tinder_id ? true : false,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
    }
  }
};
