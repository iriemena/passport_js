const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../model/User')
require('dotenv/config')


module.exports = function(passport){
    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user)
        })
      })

      // ************************ LOCAL STRATEGY ************************
    passport.use(new LocalStrategy({usernameField: 'email'}, 
    (email, password, done) =>{
      // match user
      User.findOne({email})
      .then(user => {
        if(!user){
          return done(null, false, {message: 'Email is not registered' })
        }
        // match password
        bcrypt.compare(password, user.password, (err, isMatch) =>{
          // if(err) throw err;
          if(isMatch){
            return done(null, user)
          }
          return done(null, false, {message: 'Password incorrect!'})
        })
      })
      .catch(err => console.log(err))
    }))


    // ************************ GOOGLE STRATEGY ************************
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          callbackURL: "/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
          const newUser = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
          });
  
          User.findOne({ googleId: profile.id })
          .then((user) => {
            if (user) {
              done(null, user);
            } else {
              newUser.save().then((userd) => {
                done(null, userd);
              });
            }
          })
          .catch((err) => console.log(err));
      }
    )
  );
}
