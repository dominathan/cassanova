var express = require('express');
var router = express.Router();
var request = require('request');
var moment = require('moment');
var jwt = require('jwt-simple');
var config = require('../config/config');
var bcrypt = require('bcrypt');
var ensureAuthenticated = require('./helpers').ensureAuthenticated;
var CasperCaller = require('../services/callCasper');
var TinderClient = require('../services/tinder-client');
var FakeAccount = require('../models/fake_account')();
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
              res.send({ token: createToken(payload), username: newUser.username});
            })
          });
      });
    });
  });

  router.get('/getTinderInfo', ensureAuthenticated, function(req,res,next) {
    knex('users')
    .select("*")
    .where('email',req.user.email)
    .then(function(data) {
      res.json(data[0]).status(302);
    });
  });

  router.post('/getTinderized',ensureAuthenticated,function(req,res,next) {
    var fbemail = req.body.email
    var fbpassword = req.body.password;
    knex('users')
    .where('email',req.user.email)
    .update({facebook_email: fbemail, facebook_password: fbpassword})
    .then(function(data) {
      console.log('saved user info')
    })

    CasperCaller(fbemail,fbpassword)
    .then(function(data){
      var splitData = data.split("\n");
      var saveData = JSON.parse(splitData[1])
      var objToSave = {
        facebook_authentication_token: saveData.token,
        facebook_user_id: saveData.fbId,
        facebook_expiration_time: saveData.expTime
      };
      knex('users')
      .where('email',req.user.email)
      .update(objToSave)
      .returning('*')
      .then(function(data2) {
        var tc = new TinderClient(objToSave);
        tc.authorize(tc.fbKey,tc.fbId,function(err,data) {
          tc.getProfile(function(err,prof) {
            var saveProfile = FakeAccount.getProfileInfo(prof)
            knex('users')
            .where('email',req.user.email)
            .update(saveProfile)
            .then(function(data) {
              console.log("WE DID IT?!!", data)
            })
          })
        })
      })
    }).catch(function(err) {
      console.log("OF COURSE WE MISSED SOMETHIGN", err)
    })
    res.status(200).end();
  })

module.exports = router;
