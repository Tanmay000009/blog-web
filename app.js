const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));
var mongoDB = 'mongodb+srv://admin-tanmay:tanmay12345@todolist.wgndj.mongodb.net/blogsDB';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const blogSchema = {
    name: String,
    about: String,
    blogs: [String]
}

var Blog = mongoose.model("Blog",blogSchema);


var content = ["Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse, quos fugiat commodi accusantium adipisci unde accusamus atque nemo neque et dolorum veritatis impedit error nostrum consequatur labore delectus ex itaque quam qui totam magni eos. Impedit sapiente quae consequuntur consequatur. Provident molestias repellendus earum consequatur soluta deserunt ratione debitis vel?","Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse, quos fugiat commodi accusantium adipisci unde accusamus atque nemo neque et dolorum veritatis impedit error nostrum consequatur labore delectus ex itaque quam qui totam magni eos. Impedit sapiente quae consequuntur consequatur. Provident molestias repellendus earum consequatur soluta deserunt ratione debitis vel?"];


var demo = new Blog({
    name: "Home",
    about: "This is your about section. Press button below to add your custom info.",
    blogs: ["a","b"]
})


app.get("/",function(req,res) {
    Blog.findOne({name: "HOME"}, function(err,foundItems){
        if(!err) {
            if (!foundItems) {
                // Creating a new list
                var home = new Blog({
                    name: "HOME",
                    about: "This is your about section. Press button below to add your custom info.",
                    blogs: ["a","b"]
                })
            
                home.save();
                res.redirect("/");
            } else {
                res.render('home', {name: "HOME", redirect: "/",contents: foundItems});
            }
        }
    });
});


app.get("/:customListName", function(req,res) {         // We can get whaetever user enters after customListName
    var customListName = req.params.customListName;
    customListName = customListName.toUpperCase();
    Blog.findOne({name: customListName}, function(err,foundItems){
        if(!err) {
            if (!foundItems) {
                // Creating a new list
                var demo = new Blog({
                    name: customListName,
                    about: "This is your about section. Press button below to add your custom info.",
                    blogs: ["a","b"]
                })
            
                demo.save();
                res.redirect("/"+customListName);
            } else {
                res.render('home', {name: customListName,redirect: "/"+customListName,contents: foundItems});
            }
        }
    })
    
    
})

app.post("/addUsingNavbar",function(req,res) {
    var ListName = req.body.addName;
    if (ListName==="HOME") {
        res.render('/add',{name: ListName,redirect: "/"});
    } else {
        res.render('/add',{name: ListName,redirect: "/"+ListName});
    }
})

app.post("/add",function(req,res) {
    var customListName = req.body.pageName;
    var ListName = req.body.addName;
    if (customListName === null) {
        customListName = ListName;
    } 
    if (customListName==="HOME") {
        res.render('add',{name: customListName,redirect: "/"});
    } else {

    res.render('add',{name: customListName,redirect: "/"+customListName});
    }
});

app.post("/addContent",function(req,res) {
    var blog = req.body.content;
    var customListName = req.body.pageName;
    Blog.findOneAndUpdate(
        {name: customListName},
        { $push: {blogs: blog}},
        function(err, result) {
            if (err) {
              console.log(err);
            } 
        }  
    );
    if (customListName === "HOME") {
    res.redirect('/');
    } else {
        res.redirect('/'+customListName);
    }
});


app.listen( process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});
