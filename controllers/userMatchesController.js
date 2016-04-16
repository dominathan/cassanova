var express = require('express');
var router = express.Router();
var moment = require("moment");
var _ = require('lodash');
var ensureAuthenticated = require('./helpers').ensureAuthenticated;

// Get all fake accounts
router.get('/targets',ensureAuthenticated,function(req,res,next) {
  knex('targets')
  .where('user_id',req.user.id)
  .orderBy('accessible','desc')
  .then(function(targets) {
    res.json(targets).status(200);
  })
})

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
