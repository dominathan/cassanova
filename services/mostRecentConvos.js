module.exports = function mostRecentFirst() {
  return new Promise(function(resolve,reject) {
    knex('conversations')
      .select('*')
      .where('received',true)
      .orderBy('sent_date','desc')
      .join('photos','conversations.target_id','photos.target_id')
      .join('targets','targets.id','conversations.target_id')
      .then(function(sortedByMsgSentDate) {
        return _.uniq(sortedByMsgSentDate,function(chat) {
          return chat.target_id;
        })
      })
      .then(function(uniqAndSorted) {
        resolve(uniqAndSorted);
      })
  })
}
