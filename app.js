var        express        = require("express"),
           app            = express(),
           bodyParser     = require("body-parser"),
           mongoose       = require("mongoose"),
           passport       = require("passport"),
           LocalStratgy   = require("passport-local"),
           flash          = require("connect-flash"),
           methodOverride = require("method-override"),
           User           = require("./models/user"),
           seedDB         = require("./seeds");

// Requiring routes
var campgroundRoutes = require("./routes/campgorunds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

// App configuration
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser:true, useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// Seed the database 
//seedDB();
// Passport configration
app.use(require("express-session")({
    secret: "David is awesome",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratgy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//Routes
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(3000,function (){
    console.log("The Yelpcamp Server has started");
    console.log("the app is listining at port 3000");
});