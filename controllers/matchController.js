var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development';
var config = require("../knexfile");
var knex = require('knex')(config[env]);
var moment = require("moment");
var _ = require('lodash');
var timeUntil = require('../services/timeUntil');
var ensureAuthenticated = require('./helpers').ensureAuthenticated;

// Get all fake accounts
router.get('/:target_id', function(req,res,next) {
  knex('targets')
  .select('*')
  .where('id', req.params.target_id)
  .then(function(data) {
    res.json(data).status(302);
  })
});

router.get('/:target_id/photos', function(req,res,next) {
  knex('photos')
  .select('*')
  .where('target_id', req.params.target_id)
  .then(function(data) {
    res.json(data).status(302);
  })
});


module.exports = router;
