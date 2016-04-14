var express = require('express');
var router = express.Router();
var moment = require("moment");

router.get('/room/:targetId', function(req,res,next) {
  knex('chats')
  .select('text','created_at','username')
  .where('room_id',req.params.targetId)
  .then(function(data) {
    res.json(data).status(302);
  });
});

router.get('/allchats', function(req,res,next) {
  knex('chats')
  .select('text','created_at','username')
  .where('room_id',3141592)
  .limit(100)
  .orderBy('created_at','desc')
  .then(function(data) {
    res.json(data).status(302);
  });
});

router.post('/create', function(req,res,next) {
  knex('chats')
  insert(req.body.text)
  .then(function(data) {
    res.json(data).status(302);
  })
  .catch(function(err) {
    console.log(err);
  })
});

module.exports = router;
