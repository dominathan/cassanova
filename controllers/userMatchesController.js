var express = require('express');
var router = express.Router();
var moment = require("moment");
var _ = require('lodash');
var ensureAuthenticated = require('./helpers').ensureAuthenticated;

// Get all fake accounts
router.get('/targets',ensureAuthenticated,function(req,res,next) {
  knex('targets')
  .select('targets.id','photos.id','targets.name','photos.photo_url','targets.bio','targets.gender','targets.birth_date','targets.accessible','photos.target_id')
  .where('user_id',req.user.id)
  .leftOuterJoin('photos','targets.id','photos.target_id')
  .orderBy('targets.accessible','desc')
  .then(function(data) {
    return _.uniq(data,'target_id');
  })
  .then(function(targets) {
    res.json(targets).status(200);
  })
});

router.put('/targets/:id',ensureAuthenticated,function(req,res,next) {
  knex('targets')
  .where('user_id',req.user.id)
  .where('id',req.params.id)
  .update({accessible: req.body.accessible})
  .returning('*')
  .then(function(data) {
    res.status(202).json(data)
  })
});

module.exports = router;
