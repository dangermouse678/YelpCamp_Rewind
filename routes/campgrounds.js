var express = require('express');
var router  = express.Router();
var Campground = require('../models/campground.js');

// NOTE: When doing a 'require' on a directory without specifying a filename,
//       Express will by default look for a file called "index.js", which is
//       why we named our middleware "index.js" and why/how Node.js packages
//       only need a 'require' on the package name.
var middleware = require('../middleware');

// INDEX ROUTE -- Show all campground
router.get("/", function(req, res) {
   // Get all campgrounds from DB
   Campground.find({}, function(err, allCampgrounds) {
      if (err) {
         console.log(err);
      } else {
         res.render("campgrounds/index.ejs", {campgrounds: allCampgrounds});
      }
   });
});

// CREATE ROUTE -- Add new Campground to array
router.post("/", middleware.isLoggedIn, function(req, res) {
   // Get data from form and add to campgrounds array
   var name   = req.body.name;
   var price  = req.body.price;
   var image  = req.body.image;
   var desc   = req.body.description;
   var author = {
      id: req.user._id,
      username: req.user.username
   };
   
   var newCampground = {
      name:        name,
      price:       price,
      image:       image,
      description: desc,
      author:      author
   };
   
   // Create a new campground and save to database
   Campground.create(newCampground, function(err, newlyCreated) {
      if (err) {
         console.log(err);
      } else {
         // Redirect back to campgrounds page
         res.redirect("/campgrounds");
      }
   });
});

// NEW ROUTE - Display form to add new Campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new.ejs");
});

// SHOW ROUTE - Display details for an individual campground
router.get("/:id", function(req, res) {
   // Find the campground with the matching ID
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
      if (err) {
         console.log(err);
      } else {
         // Render show template with that campground
         res.render("campgrounds/show.ejs", {campground: foundCampground});
      }
   });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
      if (err || !foundCampground) {
         req.flash("error", "Campground not found");
         res.redirect("back");
      } else {
         res.render("campgrounds/edit.ejs", {campground: foundCampground});
      }
   });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
      if (err) {
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds");
      }
   });
});

module.exports = router;