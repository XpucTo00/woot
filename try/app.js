var express = require('express');
var cons = require('consolidate');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema;
var ObjectId = userSchema.ObjectId;

var User = mongoose.model('User', new userSchema({
    id: ObjectId,
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    password: String
}));

//connect mongo
mongoose.connect('mongodb://localhost/projectNOIT');

app = express();

//middleware
app.use(bodyParser.urlencoded({extended: true}));

/*// view engine setup
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');*/

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

console.log(path.join(__dirname, 'views'));


//index page
app.get('/', function(req, res){
   res.render('home'); 
});

app.get('/inside', function( req, res){
   res.render('inside'); 
});

//register page
app.get('/register', function(req, res){
   res.render('register', {warn: 0,firstName: '', lastName:'', email:'',password:''});
});

app.post('/register', function(req, res){
   var user = new User({
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       email: req.body.email,
       password: req.body.password
   });
      var err = '';
    if(req.body.firstName == '')
       err +=  'Моля попълнете своето име!'
    if(req.body.lastName == '')
       err += 'Моля попълнете вашата фамилия!';
    if(req.body.email == '')
       err += 'Моля въведете вашия email!'
    if(req.body.password == '')
        err += 'Моля пoпълнете вашата парола!'
    if(req.body.password2 == '')
        err += 'Моля потвърдете вашата паролат!';
    if(req.body.password2 != req.body.password)
        err += 'Паролите не съвпадат!'
    
    if(!err){
        user.save(function(error){
            if(error){
                if(error.code){
                    err += 'Email вече е зает!Моля опитайте с друг.';
                    res.render('register', { warn: err, firstName: req.body.firstName, lastName:req.body.lastName, email:'', password:req.body.password});
                } 
            } else {
                res.redirect('/inside');
            }
        });
    } else {
        res.render('register', { warn: err, firstName: req.body.firstName, lastName:req.body.lastName, email:'', password:req.body.password});
    }  
});

app.get('/login', function(req, res){
    var error;
   res.render('login', {warn: error}); 
});

app.post('/login', function(req, res){
    User.findOne({email: req.body.email}, function(err, user){
        if(!user){
            res.render('login', { warn: "Неправилен email или парола!"});
        } else {
            if(req.body.password === user.password){
                res.redirect('/inside')
            } else {
                res.render('login', { warn: "Неправилен email или парола!"});
            }
        }
    })
});

app.listen(3000);