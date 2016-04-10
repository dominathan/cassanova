var express = require('express');
var router = express.Router();
var request = require('request');
var moment = require('moment');
var jwt = require('jwt-simple');
var config = require('../config/config');
var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;
var db = require("../knexfile");
var knex = require('knex')(db[env]);
var bcrypt = require('bcrypt');
// var ensureAuthenticated = require('./helpers').ensureAuthenticated;

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createToken(user) {
  var payload = {
    sub: user,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */

router.route('/login')
  .post(function(req, res, next) {
    knex('users')
    .select('*')
    .where('email', req.body.email)
    .then(function(data) {
      if(!data[0]) {
        return res.status(401).send({error: "Incorrect email/or password" });
      }
      bcrypt.compare(req.body.password,data[0].password,function(err,isMatch) {
        if(!isMatch) {
          return res.status(401).send({error:  "Incorrect email/or password" });
        }
        var payload = { email: data[0].email, username: data[0].username, id: data[0].id }
        res.send({token: createToken(payload), username: data[0].username})
      })
    })
  });

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
 router.route('/signup')
  .post(function(req, res, next) {
    knex('users')
    .select('email','password','username')
    .where('email', req.body.email)
    .orWhere('username', req.body.username)
    .then(function(data) {
      if(data[0]) {
        return res.status(401).send({error: "Email/Username address is already taken."})
      };

      bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
            var newUser = {
              email: req.body.email,
              password: hash,
              username: req.body.username
            }
            knex('users')
            .insert(newUser)
            .returning('id')
            .then(function(id) {
              var payload = { email: newUser.email, id: id[0] }
              res.send({ token: createToken(payload)});
            })
          });
      });
    });
  });

module.exports = router;
