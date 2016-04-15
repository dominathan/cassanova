var express = require('express');
var router = express.Router();
var config = require('../config/config');
var ensureAuthenticated = require('./helpers').ensureAuthenticated;
var createToken = require('./helpers').createToken;

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;
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
      res.json(data[0]).status(200);
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
    .returning('*')
    .then(function(data) {
      delete data[0].password;
      var payload = { email: data[0].email, username: data[0].username, id: data[0].id }
      res.send({token: createToken(payload), data: data[0]})
      res.send(payload).status(202);
    })
    .catch(function(error) {
      res.json(error).status(401);
    })
  });

module.exports = router;
