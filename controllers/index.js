var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development';
var config = require("../knexfile");
var knex = require('knex')(config[env]);
var moment = require("moment");
var _ = require('lodash');
var timeUntil = require('../services/timeUntil');

// Get all fake accounts
router.get('/fake_accounts', function(req,res,next) {
  knex.select('*').from('fake_accounts').then(function(data,err) {
    res.send(JSON.stringify(data));
  })
});

/*
 * Get targets of specific fake_account
 * Currently, the first (and only) Fake Account is returned
 */
router.get('/:id/targets', function(req,res,next) {
  knex('fake_accounts').select('*')
  .then(function(fk) {
    return fk[0].id
  })
  .then(function(fkID) {
    knex.raw('SELECT tg.id, tg.fake_account_id, tg.name, tg.tinder_id, tg.bio, tg.gender, tg.birth_date, tg.match_id, pho.photo_url FROM targets as tg LEFT JOIN photos as pho ON tg.id = pho.target_id WHERE tg.blocked = false GROUP BY tg.id, pho.photo_url')
    .then(function(data) {
      return _.uniq(data.rows,'tinder_id');
    })
    .then(function(rows) {
      res.json(rows).status(302);
    })
  })
});

router.get('/getMostRecentConvos', function(req,res,next) {
  knex('conversations')
    .select('*')
    .orderBy('sent_date','desc')
    .join('photos','conversations.target_id','photos.target_id')
    .join('targets','targets.id','conversations.target_id')
    .where('conversations.received',true)
    .where('targets.blocked',false)
    .then(function(sortedByMsgSentDate) {
      return _.uniq(sortedByMsgSentDate,function(chat) {
        return chat.target_id;
      })
    })
    .then(function(uniqAndSorted) {
      res.json(uniqAndSorted).status(302);
    })
})

/*
 * Get all converstions of targets
 */

router.get("/:fake_account_id/targets/:target_id", function(req,res,next) {
  knex.raw(`SELECT tg.name, convo.target_id, convo.id, convo.sent_date, convo.received, convo.tinder_id, convo.fake_account_id, convo.message FROM targets AS tg LEFT JOIN conversations as convo ON tg.id = convo.target_id WHERE convo.target_id = ${req.params.target_id} AND tg.id = ${req.params.target_id} ORDER BY convo.sent_date`)
    .then(function(convos) {
      res.json({conversations: convos.rows, time: new Date()}).status(302);
    });
});

router.get('/targets/:target_id/responses/:conversation_id', function(req,res,next) {
  var timeBefore = timeUntil();
  knex.raw(`SELECT msg.response_text, msg.target_id, msg.id, msg.created_at, msg.conversation_id, SUM(v.up) as total_votes FROM responses as msg LEFT JOIN votes AS v ON msg.id = v.response_id WHERE msg.target_id = ${req.params.target_id} AND msg.created_at > '${timeBefore}' GROUP BY msg.id`)
      .then(function(rows) {
        res.json(rows.rows).status(302);
      })
});

router.post('/responses/', function(req,res,next) {
  knex('responses')
    .insert(req.body.response)
    .returning('*')
    .then(function(data) {
      res.json(data).status(302);
    })
})

router.post('/responses/:response_id/votes', function(req,res,next) {
  knex('votes')
    .insert(req.body.vote)
    .returning('*')
    .then(function(data) {
      res.json(data).status(302);
    })
})

router.get('/photos/target_id/:tinder_id',function(req,res,next) {
  knex('photos').where('target_id',req.params.tinder_id)
    .then(function(data) {
      res.json(data).status(302);
    })
})

router.get('/:id/allTargs/blocked', function(req,res,next) {
  knex.raw('SELECT tg.id, tg.blocked,tg.fake_account_id, tg.name, tg.tinder_id, tg.bio, tg.gender, tg.birth_date, tg.match_id, pho.photo_url FROM targets as tg LEFT JOIN photos as pho ON tg.id = pho.target_id WHERE tg.blocked = true GROUP BY tg.id, pho.photo_url')
  .then(function(data) {
    return _.uniq(data.rows,'tinder_id');
  })
  .then(function(data) {
    res.json(data).status(302);
  });
});

router.get('/chats/:targetId', function(req,res,next) {
  knex('chats')
  .select('text','created_at')
  .where('room_id',req.params.targetId)
  .then(function(data) {
    console.log("GET DATA");
    res.json(data).status(302);
  });
});


module.exports = router;
