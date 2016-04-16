var express = require('express');
var router = express.Router();
var request = require('request');
var moment = require('moment');
var jwt = require('jwt-simple');
var config = require('../config/config');
var bcrypt = require('bcrypt');
var ensureAuthenticated = require('./helpers').ensureAuthenticated;
var createToken = require('./helpers').createToken;
var CasperCaller = require('../services/callCasper');
var TinderClient = require('../services/tinder-client');
var FakeAccount = require('../models/fake_account')();
var Target = require('../models/target')();
var Photo = require('../models/photos')();
var UserPhoto = require('../models/users_photos')();
var createTokenPassword = require('./helpers').createTokenPassword;
var saveMatches = require('../services/saveMatches');


/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
router.route('/login').post(function(req, res, next) {
  knex('users').select('*').where('email', req.body.email).then(function(data) {
    if (!data[0]) {
      return res.status(401).send({
        error: "Incorrect email/or password"
      });
    }
    bcrypt.compare(req.body.password, data[0].password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({
          error: "Incorrect email/or password"
        });
      }
      var payload = {
        email: data[0].email,
        username: data[0].username,
        id: data[0].id
      }
      res.send({
        token: createToken(payload),
        username: data[0].username
      })
    })
  })
});
/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
router.route('/signup').post(function(req, res, next) {
  knex('users').select('email', 'password', 'username').where('email', req.body.email).orWhere('username', req.body.username).then(function(data) {
    if (data[0]) {
      return res.status(401).send({
        error: "Email/Username address is already taken."
      })
    };
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        var newUser = {
          email: req.body.email,
          password: hash,
          username: req.body.username
        }
        knex('users').insert(newUser).returning('id').then(function(id) {
          var payload = {
            email: newUser.email,
            id: id[0]
          }
          res.send({
            token: createToken(payload),
            username: newUser.username
          });
        })
      });
    });
  });
});
router.get('/getTinderInfo', ensureAuthenticated, function(req, res, next) {
  knex('fake_accounts')
  .select("*")
  .where('fake_accounts.user_id', req.user.id)
  .join('usersphotos','fake_accounts.id','usersphotos.fake_account_id')
  .then(function(data) {
    res.json(data[0]).status(200);
  });
});

router.post('/getTinderized', ensureAuthenticated, function(req, res, next) {
  var fbemail = req.body.email
  var fbpassword = req.body.password;
  var encryptedPassword = createTokenPassword(fbpassword)
  var encryptedEmail = createTokenPassword(fbemail)
  CasperCaller(fbemail, fbpassword).then(function(data) {
    var saveData = JSON.parse(data)
    var objToSave = {
      facebook_authentication_token: saveData.token,
      facebook_user_id: saveData.fbId,
      facebook_expiration_time: new Date(Date.now() + parseInt(saveData.expTime,10) * 1000).toISOString().replace('T',' '),
      facebook_password: encryptedPassword,
      facebook_email: encryptedEmail,
      user_id: req.user.id
    };
    var tc = new TinderClient(objToSave);
    tc.authorize(tc.fbKey, tc.fbId, function(err, data) {
      tc.getProfile(function(err, prof) {
        var saveProfile = FakeAccount.getProfileInfo(prof)
        saveProfile.tinder_authentication_token = tc.getAuthToken();
        objToSave = Object.assign(objToSave,saveProfile);
        knex('fake_accounts').insert(objToSave).returning('id')
        .then(function(fk_account) {
          console.log("WHAT IS FAKE ACCOUNT", fk_account);
          tc.getUpdates(function(err,updates) {
           if(err) console.error("unable to reach tinder", err);
           if(updates) {
             if(parseInt(updates.status,10) > 399) {
               switch(parseInt(updates.status)) {
                 case 401:
                   console.error('You are not authorized to sign in. Either reset the header or get another access token from facebook.')
                   break;

                 default:
                   console.error('Something went wrong, check the status code', updates);
               }
             } else {
               saveMatches.saveNewMaches(updates.matches,fk_account[0],req.user.id);
               saveUserPhotos(prof,fk_account.id)
              //  saveMatches.saveNewMessages(updates);
              //  saveMatches.checkBlocks(updates);
             }
           }
         })

        })
        .then(function(data) {

        })
      })
    })
  }).catch(function(err) {
    console.log("OF COURSE WE MISSED SOMETHIGN", err)
    res.status(401).end();
  })
})


function saveUserPhotos(profileObject,fakeAccountId) {
  profileObject.photos.forEach(function(pho) {

    var photoToSave = UserPhoto.getPhotoInfo(pho,fakeAccountId)

    knex('usersphotos')
    .insert(photoToSave)
    .then(function(data) {

    }).catch(function(err) {
      console.log("GOD DAMN PHOTOS", err);
    });
  });
};


module.exports = router;
