var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/questions');
});


//The passport.authenticate function will return a middleware function
//that does the coordinating with Google's OAuth server.
router.get('/auth/google', passport.authenticate(
  'google',
  {
    scope: ['profile', 'email'],
    //force pick account every time
    //prompt: "select_account"
  }
));

//This is the callback route that Google will call after the user confirms
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/',
    failureRedirect: '/'
  }
));

//OAuth logout route
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
