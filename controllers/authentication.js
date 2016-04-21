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
var crypto = require('crypto');
var emailConfig = require('../config/emailConfig');
var sendgrid  = require('sendgrid')(emailConfig.SENDGRID_KEY);


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
          prof.photos.forEach(function(pho) {
            var photoToSave = UserPhoto.getPhotoInfo(pho,fk_account[0])
            knex('usersphotos')
            .insert(photoToSave)
            .then(function(data) {

            }).catch(function(err) {
              console.log("GOD DAMN PHOTOS", err);
            });
          });
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
               saveMatches.saveNewMaches(io,updates.matches,fk_account[0],req.user.id);
               saveMatches.saveNewMessages(io,updates,fk_account[0]);
               saveMatches.checkBlocks(updates);
             }
           }
         })

        })
        .then(function(data) {
          res.status(202).json(data);
        })
      })
    })
  }).catch(function(err) {
    // console.log("OF COURSE WE MISSED SOMETHIGN", err)
    res.status(401).json(err);
  })
})

router.post('/send-reset-password-email', function(req,res,next) {
  console.log(req.body);
	if(!req.body.email) {
		return res.status(400).json({error: "You must supply an email address."})
	}
  knex('users')
  .where('email', req.body.email)
	.then(function(user) {
		// No user found, flash message and redirect to to forgot-password
		if(!user.length) {
			return res.status(404).json({error: "No user found by that email address."})
		}
		// generate random token and send to user
		crypto.randomBytes(20, function(err,buff) {
			var token = buff.toString('hex');
			knex('users')
      .where('email',req.body.email)
      .update({
        reset_password_token: token,
				reset_password_expires:  new Date(Date.now() + 360000).toISOString().slice(0,19).replace('T',' ')
      })
			.returning('reset_password_token')
			.then(function(passwordToken) {

        sendgrid.send({
          to: req.body.email,
          from: 'support@gotindergarten.com',
          subject: 'Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }, function(err, json) {
          if(err) {
            return res.status(503).json({message: "Unable to send email", error: err})
          }
          res.status(201).json({message: 'An e-mail has been sent to ' + req.body.email + ' with further instructions.'});
        })
  		})
      .catch(function(err) {
        return res.status(500).json({error: err});
      });
  	})
  });
})

router.post('/reset/:token', function(req,res,next) {
  knex('users')
  .where('reset_password_token',req.params.token)
  .then(function(user) {
    if(user.length === 0 ) {
      return res.status(401).json({message: "Please resend the token to your email address"});
    }
    var tokenDate = Date.parse(user[0].reset_password_expires)
    var timeNow = Date.parse(new Date(Date.now()))
    if(tokenDate < timeNow)  {
      return res.status(401).json({message: "Your token has expired. Resend to your email address.", token_date: tokenDate, date_now: timeNow})
    }
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        knex('users')
        .where('reset_password_token',req.params.token)
        .update({reset_password_token: null, reset_password_expires: null, password: hash})
        .then(function(data) {
          var payload = {
            email: user[0].email,
            id: user[0].id
          }
          return res.status(200).json({message: 'Updated your password successfully', token: createToken(payload), username: user[0].username });
        })
        .catch(function(err) {
          return res.status(500).json({message: "Something went wrong updating your password"})
        })
      })
    })
  })
  .catch(function(err) {
    return res.status(500).json({message: "Something went wrong updating your password"})
  });
})


module.exports = router;
