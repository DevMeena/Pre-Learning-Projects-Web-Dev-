// requiring modules

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

// binding express to app

const app = express();

// app methods

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose code

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article",articleSchema);

// chaining routes for requests targeting all the articles

app.route("/articles")
.get((req,res)=>{
    Article.find((e,foundArticles)=>{
        if(!e){
            // console.log(foundArticles);
            res.send(foundArticles);
        } else {
            res.send(e);
        }
    });
})
.post((req,res)=>{

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((e)=>{
        if(!e){
            console.log("save successful");
        } else {
            console.log("save failed");
        }
    });
    
})
.delete((req,res)=>{
    Article.deleteMany((e)=>{
        if(!e){
            console.log("successfully deleted");
        } else {
            console.log("failed to delete");
        }
    });
});

// chaining routes for requests targeting single article

app.route("/articles/:articleTitle")
.get((req,res)=>{
    Article.findOne({title: req.params.articleTitle},(e,foundArticle)=>{
        if(!e){
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No Article found with this name");
            }
        } else {
            console.log(e);
        }
    })
})
.put((req,res)=>{
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (e)=>{
            if(!e){
                console.log("update successful");
            } else {
                console.log("update failed");
            }
        }
    )
})
.patch((req,res)=>{
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        (e)=>{
            if(!e){
                console.log("patch update successful");
            } else {
                console.log("patch update failed");
            }
        }
    )
})
.delete((req,res)=>{
    Article.deleteOne(
        {title: req.params.articleTitle},
        (e)=>{
            if(!e){
                console.log("successfully deleted");
            } else {
                console.log("failed to delete");
            }
        }
    )
});

// server creation and running code

app.listen(3000,()=>{
    console.log("server up and running at port 3000");
});

// app.get("/articles",);

// app.post("/articles",);

// app.delete("/articles",);