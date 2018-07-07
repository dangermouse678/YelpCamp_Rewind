// -----------------------
// REQUIRES
// -----------------------

var express        = require('express');
var app            = express();

var bodyParser     = require('body-parser');
var flash          = require('connect-flash');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var passport       = require('passport');
var LocalStrategy  = require('passport-local');
var seedDB         = require('./seeds.js');

// ---------------
// MODELS
// ---------------
var Campground = require('./models/campground.js');
var Comment    = require('./models/comment.js');
var User       = require('./models/user.js');

// ----------
// ROUTES
// ----------
var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes    = require("./routes/comments.js");
var indexRoutes      = require("./routes/index.js");


// ------------------------------
// GENERAL SETUP
// ------------------------------

// Set view engine to EJS
app.set("view engine", "ejs");

// Set up body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Serve up /public directory
// NOTE: "__dirname" refers to the directory the script was run in,
//       in this case /home/ubuntu/workspace/YelpCamp/v6.
//       Using __dirname is a safer convention in Node.js.
app.use(express.static(__dirname + "/public"));

// Set up database
// NOTE: {useMongoClient:true} no longer required with Mongo 5.0.x
//mongoose.connect("mongodb://localhost/yelp_camp_v4", {useMongoClient: true});
//mongoose.connect("mongodb://localhost/yelp_camp_v12");
mongoose.connect("mongodb://shawn:mouse@ds133570.mlab.com:33570/yelpcamp2");

// Code to seed the database with some camps and comments
// (May not work after changes in v9)
//seedDB();

// Set Method Override
app.use(methodOverride("_method"));

// -------------------------
// FOR FLASH MESSAGES
// -------------------------
// NOTE: This needs to come BEFORE Passport configuration
app.use(flash());

// ------------------------------
// PASSPORT CONFIGURATION
// ------------------------------
app.use(require('express-session')({
   secret: "Whatever text I want!",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// -------------------------
// MAKE USER DATA AVAILABLE
// -------------------------
// Make Current User data available on all routes and templates
// (NOTE: req.user is provided as part of each request by Passport)
// When referencing values in res.locals you only need to specify
// the name of the variable (e.g. currentUser) and not res.locals.xx
app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success");
   next();
});

// ------------------------------------------------------

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// ------------------------------------------------------

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp server is running...");
});