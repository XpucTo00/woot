var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
   res.render('newpage2', {
       title: 'Gosho'
   }); 
});

module.exports = router;