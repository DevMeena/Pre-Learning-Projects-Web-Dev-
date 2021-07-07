// binding packages

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const myDate = require(__dirname + "/date.js");

// using packages

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var addNewItem = ["Cofee","Tea","Cold Drink"];
var addNewWorkItem = ["eat","sleep","code"];

// response and request handling

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("list", {ListType : "Home", newAddedItem: addNewItem});
});


app.get("/work",(req,res)=>{
    res.render("list", {ListType : "Work", newAddedItem: addNewWorkItem});
});

// form post handling

app.post("/",(req,res)=>{

    var Item = req.body.newItem;

    if(req.body.list === "Work")
    {
        addNewWorkItem.push(Item);
        res.redirect("/work");
    }
    else if(req.body.list === "Home")
    {
        addNewItem.push(Item);
        res.redirect("/");
    }
    else
    {
        console.log("this is being printed");
    }

});


// server creation

app.listen(3000, ()=>{
    console.log("server up and running at port 3000");
});