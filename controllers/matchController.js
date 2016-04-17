var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development';
var config = require("../knexfile");
var moment = require("moment");
var _ = require('lodash');
var timeUntil = require('../services/timeUntil');
var ensureAuthenticated = require('./helpers').ensureAuthenticated;

// Get all fake accounts
router.get('/', function(req,res,next) {
  knex.raw('SELECT tg.id, tg.fake_account_id, tg.name, tg.tinder_id, tg.bio, tg.gender, tg.birth_date, tg.match_id, pho.photo_url FROM targets as tg LEFT JOIN photos as pho ON tg.id = pho.target_id WHERE tg.blocked = false AND tg.accessible = true GROUP BY tg.id, pho.photo_url ORDER BY tg.created_at DESC')
  .then(function(data) {
    return _.uniq(data.rows,'tinder_id');
  })
  .then(function(rows) {
    res.json(rows).status(200);
  })
})


router.get('/:target_id', function(req,res,next) {
  knex('targets')
  .select('*')
  .where('id', req.params.target_id)
  .then(function(data) {
    res.json(data).status(200);
  })
});

router.get('/:target_id/photos', function(req,res,next) {
  knex('photos')
  .select('*')
  .where('target_id', req.params.target_id)
  .then(function(data) {
    res.json(data).status(200);
  })
});


module.exports = router;
