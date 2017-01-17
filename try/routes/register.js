var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.get('/', function(req, res){
   res.render('register');
});

router.post('/', function(req, res){
   res.json(req.body);
});

module.exports = router;