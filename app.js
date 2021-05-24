const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");
const Date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/toDoListDb", {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

const itemSchema = {
    itemName: String
};

const listSchema = {
    name: String,
    items: [itemSchema]
};

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);


let today="";

app.get("/", function(req,res){

    today = Date.getDate();

    Item.find({},function(err, newItems){
        if(err){
            console.log(err);
        }
        else{
            res.render("list", {title : today, newList : newItems});
        }
    })
})

app.get("/:customName", function(req,res){

    const customListName = req.params.customName;

    List.findOne({name: customListName}, function(err, found){
        if(!err){
            if(!found){
                //console.log("Doesn't Exist");
                const list = new List({
                    name: customListName,
                    items: []
                })
                list.save();
                 res.redirect("/"+customListName);
            }
            else{
                res.render("list", {title : found.name, newList : found.items});
            }
        }
    })
})

app.post("/", function(req,res){

    let toAddItem="";
    const listName = req.body.btn;
    console.log(listName);
    toAddItem = new Item({
        itemName: req.body.item
    });

    if(listName === today){
        toAddItem.save();
        res.redirect("/");
    } 
    else{
        List.findOne({name: listName}, function(err, foundList){
            if(!err){
                foundList.items.push(toAddItem);
                foundList.save();
            }
        })
        res.redirect("/"+listName);
    }
})

app.post("/delete", function(req,res){

    const a = req.body.checkbox.split("+");
    const toDeleteItem = a[0];
    const listName = a[1];
    //console.log(listName);

    if(listName === today){
        Item.findByIdAndRemove(toDeleteItem, function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("successfully removed");
            }
        })
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: toDeleteItem}}}, function(err, foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        })   
    }
    // res.redirect("/");
})

app.get("/about", function(req,res){
    res.render("About");
})

app.listen(3000, () => {
    console.log("server started on port 3000");
})