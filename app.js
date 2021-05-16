const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

let newItems = [];
let workItems=[];

app.get("/", function(req,res){

    var date = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    var today = date.toLocaleString("en-US", options);

    res.render("list", {title : today, newList : newItems});
})

app.get("/work", function(req,res){
    res.render("list", {title: "Work", newList: workItems});
})

app.post("/", function(req,res){

    let newItem = req.body.item;
    if(req.body.btn === "Work"){
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