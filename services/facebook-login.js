var request = require('request');
var express = require('express');
var router = express.Router();

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;
var config = require("../knexfile");
var knex = require('knex')(config[env]);

var FBClientId = '464891386855067';

router.get('/fbtoken', function(req, res){
  res.render('facebook-access-token', { data: req });
});

/**
 * Since the Facebook access_token is only available in the browser URL fragment,
 * it is not available server-side so we need to post it to the server from the browser.
 * This is the entry point for persisting that token
 */
router.post('/fbtoken', function(req, res){
  var fbUserId;
  var hash = req.body.hash;
  var tokenField = "access_token=";
  var expiresField = "&expires_in=";
  var access_token = hash.substring(hash.indexOf(tokenField) + tokenField.length, hash.indexOf(expiresField));
  var expiryInSeconds = hash.substring(hash.indexOf(expiresField) + expiresField.length);
  var fbTokenExpiresIn = new Date(new Date().getTime() + expiryInSeconds * 1000);

  // Once we have the Facebook access token, we need the user ID associated with the token.
  request({
    url: 'https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token',
    method: 'GET'
  }, function(err, response, body){

    if (err) {
      throw new "Failed to get user id: " + err;
    } else {

      body = JSON.parse(body);
      if (!body.data.user_id) {
        throw new "Failed to get user id.";
      } else {
        fbUserId = body.data.user_id;
      }
    }
      /**
      * Supply facebook_auth_token, expiration_date, and userId to knex
      * Need to change it so it is the user that logs in and not all users
      */
    knex('fake_accounts')
      .update({ facebook_user_id: fbUserId,
                 facebook_authentication_token: access_token,
                 facebook_expiration_time: fbTokenExpiresIn.toISOString().slice(0, 19).replace('T', ' ')
               },['id','facebook_user_id','facebook_authentication_token','facebook_expiration_time'])
      .then(function(dbResponse) {
        res.json({data: dbResponse});
      })
      .catch(function(err) {
        throw new Error('Failed Saving to Database: ', err);
      })
  });


});
//https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=http://localhost:3000/api/facebook/fbtoken'
router.get('/login', function(req, res){
  res.redirect('https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token');
});

module.exports = router;
