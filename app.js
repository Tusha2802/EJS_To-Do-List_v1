const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");
const Date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

const newItems = [];
const workItems=[];

app.get("/", function(req,res){

    const today = Date.getDate();

    res.render("list", {title : today, newList : newItems});
})

app.get("/work", function(req,res){
    res.render("list", {title: "WorkList", newList: workItems});
})

app.post("/", function(req,res){

    const newItem = req.body.item;
    if(req.body.btn === "WorkList"){
        workItems.push(newItem);
        res.redirect("/work");
    }
    else{
        newItems.push(newItem);
        res.redirect("/");
    }
    
})

app.get("/about", function(req,res){
    res.render("About");
})



app.listen(3000, () => {
    console.log("server started on port 3000");
})