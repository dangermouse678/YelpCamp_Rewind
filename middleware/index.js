var Campground = require('../models/campground.js');
var Comment    = require('../models/comment.js');

// ALL MIDDLEWARE ADDED HERE

var middlewareObj = {};

// ---------------------------------------
// AUTHENTICATION MIDDLEWARE
// ---------------------------------------

middlewareObj.isLoggedIn = function(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   
   req.flash("error", "You need to be logged in to do that");
   res.redirect("/login");
}

// ---------------------------------------
// AUTHORIZATION MIDDLEWARE
// ---------------------------------------

// Middleware to check if the current user owns the Campground
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
   // Is user logged in?
   if (req.isAuthenticated()) {
      Campground.findById(req.params.id, function(err, foundCampground) {
         if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
         } else {
            // Does the user own the campground?
            // (NOTE: You cannot directly compare foundCampground.author.id to req.user._id
            //        because even though they will print out and appear equal, they are not.
            //        foundCampground.author.id is an Object while req.user._id is a String.)
            if (foundCampground.author.id.equals(req.user._id)) {
               next();
            } else {
               req.flash("error", "You don't have permission to do that");
               res.redirect("back");
            }
         }
      });
   } else {
      // Redirect to "back" sends user to previous page
      req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
   }
};

// Middleware to check if the current user owns the Comment
middlewareObj.checkCommentOwnership = function(req, res, next) {
   // Is user logged in?
   if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, foundComment) {
         if (err || !foundComment) {
            req.flash("error", "Comment not found");
            res.redirect("back");
         } else {
            // Does the user own the comment?
            // (NOTE: You cannot directly compare foundComment.author.id to req.user._id
            //        because even though they will print out and appear equal, they are not.
            //        foundComment.author.id is an Object while req.user._id is a String.)
            if (foundComment.author.id.equals(req.user._id)) {
               next();
            } else {
               req.flash("error", "You don't have permission to do that");
               res.redirect("back");
            }
         }
      });
   } else {
      // Redirect to "back" sends user to previous page
      req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
   }
};

module.exports = middlewareObj;