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
    knex('targets').where('fake_account_id', fkID)
                   .innerJoin('photos','targets.id','photos.target_id')
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

module.exports = router;
