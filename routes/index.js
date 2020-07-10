var express  = require("express"),
    router   = express.Router(),
    User     = require("../models/user"),
    passport = require("passport");

// Root route
router.get("/",function(req,res){
    res.render("landing");
});

// ===================================================================
//                          AUTH ROUTES
// ===================================================================
// Sign app route
router.get("/register",(req,res)=>{
    res.render("register");
});
// Sign up handling route
router.post("/register",(req,res)=>{
    User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("success","Welcome to YelpCamp" + user.username);
            res.redirect("/campgrounds");
        })
    })
});
// Login route
router.get("/login",(req,res)=>{
    res.render("login");
});
// Login hanling route
router.post("/login",passport.authenticate("local", 
    {
        successRedirect:"/campgrounds", 
        failureRedirect: "/login"
    }),(req,res)=>{
});
// Logout route
router.get("/logout",(req,res)=>{
    req.logOut();
    req.flash("success","Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;