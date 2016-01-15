var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development';
var config = require("../knexfile");
var knex = require('knex')(config[env]);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cassanova' });
});

// Get all fake accounts
router.get('/fake_accounts', function(req,res,next) {
  knex.select('*').from('fake_accounts').then(function(data,err) {
    res.send(JSON.stringify(data));
  })
});

router.get('/:id/targets', function(req,res,next) {
  var fakeAccountId = req.params.id;
  knex('fake_accounts').select('*')
  .then(function(fk) {
    return fk[0].id
  })
  .then(function(fkID) {
    knex('targets').where('fake_account_id',fkID).then(function(data) {
      res.json(data);
    });
  })
});

// Get al targets
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
