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
  var fakeAccountId
  if(req.params.id) {
    fakeAccountId = req.params.id
  } else {
    fakeAccountId = 1;
  }

  knex('fake_accounts').select('*')
  .then(function(fk) {
    return fk[0].id
  })
  .then(function(fkID) {
    knex('targets')
      .where('fake_account_id', fkID)
      .leftOuterJoin('photos','targets.id','photos.target_id')
      .orderBy('targets.id')
      .limit(54)
      .then(function(matchObjectsWithPhotos) {
        res.json(matchObjectsWithPhotos);
      })
  })
});

/*
 * Get all targets
 */
router.get('/targets', function(req,res,next) {
  knex.select('*').from('targets').then(function(data) {
    res.send(JSON.stringify(data));
  });
});

router.get('/conversations', function(req,res,next) {
  knex.select('*')
    .from('conversations')
    .then(function(data) {
      res.json(data);
    });
});

router.get("/:fake_account_id/targets/:target_id", function(req,res,next) {
  knex.select('*')
      .from('conversations')
      .where('target_id',req.params.target_id)
      .orderBy('sent_date')
      .then(function(convos) {
        res.json(convos)
      });
});

router.get('/responses/:conversation_id', function(req,res,next) {
  knex.raw('SELECT msg.response_text, msg.id, msg.created_at, msg.conversation_id, SUM(v.up) as total_ups, SUM(v.down) as total_downs FROM responses as msg LEFT OUTER JOIN votes as v ON msg.id = v.response_id GROUP BY msg.id')
      .then(function(data) {
        var obj = data.rows
        return obj
      }).then(function(rows) {
        res.json(rows);
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
