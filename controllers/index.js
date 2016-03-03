var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development';
var config = require("../knexfile");
var knex = require('knex')(config[env]);

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
      res.json(rows);
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
        res.json({conversations: convos, time: new Date()})
      });
});

router.get('/responses/:conversation_id', function(req,res,next) {
  knex.raw(`SELECT msg.response_text, msg.id, msg.created_at, msg.conversation_id, SUM(v.up) as total_ups, SUM(v.down) as total_downs FROM responses as msg LEFT JOIN votes AS v ON msg.id = v.response_id WHERE msg.conversation_id = ${req.params.conversation_id} GROUP BY msg.id`)
      .then(function(rows) {
        res.json('RETURN DATA',rows.rows);
      })
});

router.get('/responses/:conversation_id/sum', function(req,res,next) {
  knex.raw(`SELECT msg.response_text, msg.id, msg.created_at, msg.conversation_id, SUM(v.up) as total_ups, SUM(v.down) as total_downs FROM responses as msg LEFT JOIN votes AS v ON msg.id = v.response_id WHERE msg.conversation_id = ${req.params.conversation_id} GROUP BY msg.id ORDER BY total_ups`)
      .then(function(rows) {
        rows.rows.forEach(function(resp) {
        })
      })
})

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
