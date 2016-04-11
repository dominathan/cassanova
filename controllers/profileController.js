var express = require('express');
var router = express.Router();
var config = require('../config/config');
var ensureAuthenticated = require('./helpers').ensureAuthenticated;

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;
var db = require("../knexfile");
var knex = require('knex')(db[env]);

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
router.route('/me')
  .all(ensureAuthenticated)
  .get(function(req, res) {
    knex('users')
    .select('email','username')
    .where('email',req.user.email)
    .then(function(data) {
      res.json(data[0]).status(302);
    });
  })
  .put(function(req, res) {
    var oldUser = req.user;
    var newUser = {
      email: req.body.email || oldUser.email,
      username: req.body.username || oldUser.username
    }
    knex('users')
    .where('email', oldUser.email)
    .update(newUser)
    .then(function(data) {
      res.json(data[0]).status(302);
    })
    .catch(function(error) {
      res.json(error).status(401);
    })
  });

module.exports = router;
