//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// using mongoose to store data

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

// items Schema 

const itemsSchema = {
  name: String
}

// mongoose model for item schema

const Item = mongoose.model("item",itemsSchema);

// creating documents for list schema

const task1 = new Item({
  name: "Welcome to your to-do list"
});

const task2 = new Item({
  name: "hit + to add a new item"
});

const task3 = new Item({
  name: "<--- hit this to delete an item"
});

// array of documents of default items that should be in to do list

const defaultItems = [task1,task2,task3];

// List Schema

const listSchema = {
  name: String,
  items: [itemsSchema] // relationship between list schema and items schema
};

// mongoose model for list schema

const List = mongoose.model("List",listSchema);

// handling get requests for home route

app.get("/", function(req, res) {

  Item.find({},(e,foundItems)=>{

    if(foundItems.length === 0) {
      Item.insertMany(defaultItems,(e)=>{
        if(e){
          console.log(e);
        } else {
          console.log("successfully inserted items");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });


});

// handling post request for home route

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName},(e,foundList)=>{
      if(!e){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      } else {
        console.log(e);
      }
    })
  }

});

// handling post request for delete route

app.post("/delete", function(req, res){

  const checkedItemId = req.body.checkbox;
  const checkedListName = req.body.listName;

  if(checkedListName === "Today") {

    Item.findByIdAndRemove(checkedItemId, function(err) {
      if(!err) {
        console.log("successfully deleted item");
      } else {
        console.log(err);
      }
    });
  
    res.redirect("/");

  } else {

    List.findOneAndUpdate(
      {name: checkedListName},
      {$pull: {items: {_id: checkedItemId}}},
      (e,foundList)=>{
          if(!e) {
            res.redirect("/" + checkedListName);
          } else {
            console.log(e);
          }
      }
    )
  }

});

// handling get request for dynamic url i.e. custom list route

app.get("/:customList", function(req,res){
  const customListName = _.capitalize(req.params.customList);

  List.findOne({name: customListName},(err,foundList)=>{
    if(!err){
      if(!foundList) {
        // console.log("list doesn't exist");        
        const list = new List({
          name: customListName,
          items: defaultItems
        });
      
        list.save();
        res.redirect("/" + customListName);

      } else {
        // console.log("list exists");
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  })

});

// server creation and running

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
