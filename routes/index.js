var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  return console.log('we inhere')
});

module.exports = router;
