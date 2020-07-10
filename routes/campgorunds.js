var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../Middleware");

// ===================================================================
//                       CAMPGROUNDS ROUTES
// ===================================================================
// Campgroud route
router.get("/",function(req,res){
    Campground.find({},(err,campgrounds)=>{
        if(err){
            console.log(err);
        }else {
            res.render("campgrounds/index",{campgrounds:campgrounds});
        }
    })  
});
// Add campground route
router.post("/",middleware.isLoggedIn,(req,res)=>{
    // push the posted object 
    var name   = req.body.name;
    var image  = req.body.image;
    var desc   = req.body.description;
    var price  = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    //create campground and save to DB
    Campground.create({name:name,image:image,price:price,description:desc,author:author},(err)=>{
        if(err){
            console.log(err);
        }else{
            // redirect to campground page
            res.redirect("/campgrounds");
        }
    });
});
// Add new camp route
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render("campgrounds/new");
});
// Show route 
router.get("/:id",(req,res)=>{
    let id = req.params.id;
    Campground.findById(id).populate("comments").exec((err,foundCampGround)=>{
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground:foundCampGround});
        }
    }) 
});
// Edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCampground)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit",{campground: foundCampground}); 
        }
    });      
});
//Update campground route
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })
});
// Destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds")
        }
    })
});

module.exports = router;