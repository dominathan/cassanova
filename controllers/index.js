var express = require('express');
var router = express.Router();
var knex = require('knex');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cassanova' });
});

module.exports = router;
