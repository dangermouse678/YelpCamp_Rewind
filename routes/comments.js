var express    = require('express');
var router     = express.Router({mergeParams: true});
var Campground = require('../models/campground.js');
var Comment    = require('../models/comment.js');

// NOTE: When doing a 'require' on a directory without specifying a filename,
//       Express will by default look for a file called "index.js", which is
//       why we named our middleware "index.js" and why/how Node.js packages
//       only need a 'require' on the package name.
var middleware = require('../middleware');

// NEW ROUTE - Display form to add new Comment to a Campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
   // Find campground by ID
   Campground.findById(req.params.id, function(err, campground) {
      if (err) {
         console.log(err);
      } else {
         res.render("comments/new.ejs", {campground: campground});
      }
   });
});

// CREATE ROUTE - Add Comment to Campground
router.post("/", middleware.isLoggedIn, function(req, res) {
   
   // Look up Campground using ID
   Campground.findById(req.params.id, function(err, campground) {
      if (err) {
         console.log(err);
         res.redirect("/campgrounds");
      } else {
         Comment.create(req.body.comment, function(err, comment) {
            if (err) {
               req.flash("error", "Something went wrong!");
               console.log(err);
            } else {
               // Add Username and ID to comment and save updated comment to DB
               comment.author.id       = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               
               // Save comment
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Successfully added comment!");
               res.redirect("/campgrounds/" + campground._id);
            }
         });
      }
   });
   
});

// EDIT ROUTE - Edit a comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
      if (err || !foundCampground) {
         req.flash("error", "Campground not found");
         return res.redirect("back");
      } 
      
      Comment.findById(req.params.comment_id, function(err, foundComment) {
         if (err) {
            res.redirect("back");
         } else {
            res.render("comments/edit.ejs", {campground_id: req.params.id, comment: foundComment});
         }
      });
   });
});

// UPDATE ROUTE - Send an updated comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
      if (err) {
         res.redirect("back");
      } else {
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

// DESTROY ROUTE - Delete a comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
      if (err) {
         res.redirect("back");
      } else {
         req.flash("success", "Comment deleted");
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

module.exports = router;