var express  = require('express');
var router   = express.Router();
var passport = require('passport');
var User     = require('../models/user.js');

// Main Entry Route
router.get("/", function(req, res) {
   res.render("landing.ejs");
});

// -------------------------------------------------------
// AUTHENTICATION ROUTES
// -------------------------------------------------------

// Show Register form
router.get("/register", function(req, res) {
   res.render("register.ejs");
});

// Handle Signup logic
router.post("/register", function(req, res) {
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user) {
      if (err) {
         req.flash("error", err.message);
         return res.redirect("/register");
      }
      
      passport.authenticate("local")(req, res, function() {
         req.flash("success", "Welcome to YelpCamp, " + user.username);
         res.redirect("/campgrounds");
      });
   });
});

// Show Login form
router.get("/login", function(req, res) {
   res.render("login.ejs");
});

// Handle Login logic
router.post("/login", passport.authenticate("local",
   {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
   }),
   function(req, res) {
      // Nothing to do here --
      // If Login was successful the user will be redirected to /campgrounds
      // as part of middleware logic above
});

// Logout route
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});

module.exports = router;