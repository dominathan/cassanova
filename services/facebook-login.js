var request = require('request');
var express = require('express');
var path = require('path')
var router = express.Router();


router.get('/login', function(req, res){
  res.redirect('https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token');
});

router.get('/update/the/tokens/please', function(req,res) {
  res.render('facebook-access-token');
});

router.post('/update/the/token/please/', function(req,res) {
  console.log("DO IT")
  console.log(req.body);
  knex('fake_accounts')
    .where('facebook_user_id',req.body.fbId)
    .update({facebook_authentication_token: req.body.fbKey})
    .then(function(data) {
      res.json(data);
    })
});

module.exports = router;
