const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

// using all the packages and then routing different pages!

const homeContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// let posts = []; // using let just to be safe instead of var or consts

mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

// mongoose schema

const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

// mongoose model

const Post = mongoose.model("Post",postSchema);

// get requests

app.get("/",(req,res)=>{
    
    // displays all the posts on the home route

    Post.find({},(e,posts)=>{
        if(!e){
            res.render("home",{
                homeContent: homeContent,
                allPosts: posts
            });
        } else {
            console.log(e);
        }
    });  
});

app.get("/about",(req,res)=>{
    res.render("about",{aboutContent: aboutContent});
});

app.get("/contact",(req,res)=>{
    res.render("contact",{contactContent: contactContent});
});

app.get("/compose",(req,res)=>{
    res.render("compose");
});

// dynamic url set-up

app.get("/post/:postId",(req,res)=>{

    const currentPostId = req.params.postId; // stores post id

    // searches the post by its id and renders if found else renders error page

    Post.findById({_id: currentPostId},(e,post)=>{
        if(!e){
            res.render("post",{
                title: post.title,
                content: post.content
            });
        } else {
            res.render("post",{
                title: "Error 404",
                content: "Page not found. The page you searched for do not exists"
            });
        }
    });

});

// post requests

app.post("/compose",(req,res)=>{

    // creates a new post document when composing

    const post = new Post({
        title: req.body.blogTitle,
        content: req.body.blogPost
    });

    // saving the post document if no errors were detected

    post.save((e)=>{
        if(!e){
            res.redirect("/");
        } else {
            console.log(e);
        }
    });

});

// server running code:

app.listen(3000,()=>{
    console.log("server running @ 3000");
});