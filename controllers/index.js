var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development';
var config = require("../knexfile");
var knex = require('knex')(config[env]);
var moment = require("moment");
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
    knex.raw('SELECT tg.id, tg.fake_account_id, tg.name, tg.tinder_id, tg.bio, tg.gender, tg.birth_date, tg.match_id, pho.photo_url FROM targets as tg LEFT OUTER JOIN photos as pho ON tg.id = pho.target_id LIMIT 9')
    .then(function(data) {
      var obj = data.rows
      return obj
    }).then(function(rows) {
      res.json(rows).status(302);
    })
  })
});

/*
 * Get all converstions of targets
 */

router.get("/:fake_account_id/targets/:target_id", function(req,res,next) {
  knex.select('*')
      .from('conversations')
      .where('target_id',req.params.target_id)
      .orderBy('sent_date')
      .then(function(convos) {
        res.json({conversations: convos, time: new Date()}).status(302);
      });
});

router.get('/responses/:conversation_id', function(req,res,next) {
  var timeBefore = timeUntil();
  knex.raw(`SELECT msg.response_text, msg.id, msg.created_at, msg.conversation_id, SUM(v.up) as total_votes FROM responses as msg LEFT JOIN votes AS v ON msg.id = v.response_id WHERE msg.conversation_id = ${req.params.conversation_id} AND msg.created_at > '${timeBefore}' GROUP BY msg.id`)
      .then(function(rows) {
        res.json(rows.rows).status(302);
      })
});

router.post('/responses/', function(req,res,next) {
  knex('responses')
    .insert(req.body.response)
    .returning('*')
    .then(function(data) {
      res.json(data);
    })
})

router.post('/responses/:response_id/votes', function(req,res,next) {
  knex('votes')
    .insert(req.body.vote)
    .returning('*')
    .then(function(data) {
      res.json("VOTE SUBMITTED", data);
    })
})


module.exports = router;
