const express = require('express')
const passport = require('passport')
const router = express.Router()

//Register and login handle for Google strategy
router.get("/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  
  //Google auth callback
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/dashboard",
      failureRedirect: "/",
    })
  );

  module.exports = router