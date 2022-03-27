const passport = require('passport');
const User = require('../models/user');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//To configure Passport we will:

// 1. Call the passport.use method to 'plug-in' an instance of the OAuth strategy and provide a
//verify callback function that will be called whenever a user has logged in using OAuth.

// 2. Define a serializeUser method that Passport will call after the verify callback 
//to let Passport know what data we want to store in the session to identify our user.

// 3. Define a deserializeUser method that Passport will call on each request when a 
//user is logged in. What we return will be assigned to the req.user object.


passport.use(
    new GoogleStrategy(
        //configuration object
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK
        },
        //This 'verify' callback func is fired whenever a user logs in with OAuth
        async function(accessToken, refreshToken, profile, cb) {
            let user = await User.findOne({ googleId: profile.id });

            if (user) return cb(null, user); //if user exists in our db, provide that user doc to passport via the cb() we passed to the 'verify' func
            
            //If a matching one doesn't already exist in our db,
            //try to create user in our db given profile info from google
            try {
                user = await User.create({
                    name: profile.displayName,
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value
                });
                return cb(null, user);
            } catch (error) {
                return cb(error);
            }
            
        }
    )
)

//It is the job of serializeUser to return the nugget of data 
//that passport is going to add to the session used to track the user:

//Passport passes in the user document from our db that we provided above^^
passport.serializeUser(function(user, cb) {
    cb(null, user._id);
})

//The passport.deserializeUser method is called every time a request comes in from 
//an existing logged in user - it is this method where we return what we want passport 
//to assign to the req.user object.

passport.deserializeUser(function(userId, cb) {
    User.findById(userId).then(function(user) {
      cb(null, user);
    });
  });

