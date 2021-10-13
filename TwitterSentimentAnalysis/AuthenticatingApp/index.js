/*eslint no-console: 0*/

"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');

passport.use(new Strategy({
    consumerKey: 'KKBIawUSE_OWNPJwM',
    consumerSecret: 'BJCahJjoUSE_OWNTStPFAj',
    callbackURL: 'http://localhost:3000/twitter/return'
}, function(token, tokenSecret, profile, callback) {
    return callback(null, profile);
}));

passport.serializeUser(function(user, callback) {
    callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
    callback(null, obj);
})

const app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'whatever', resave: true, saveUninitialized: true}))

app.use(passport.initialize())
app.use(passport.session())


app.get('/twitter/login', passport.authenticate('twitter'))

app.get('/twitter/return', passport.authenticate('twitter', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/')
})

app.get('/user', function (req, res, next) {
	var user = req.user;
	console.log(user);
	res.send({
        Name:"Joseph Byreddy"
		
	});
	// res.send(user);
});

const port = process.env.PORT || 6005;

app.listen(port, function () {
	console.log('app listening on port ' + port);
});