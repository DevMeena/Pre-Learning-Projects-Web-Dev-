const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use(express.static("public"));


// managing requests and responses


app.get("/",function(req,res){
    res.sendFile( __dirname + "/index.html");
});

app.get("/Imperial",function(req,res){
    res.sendFile( __dirname + "/public/Imperial.html");
});

app.get("/Metric",function(req,res){
    res.sendFile( __dirname + "/public/Metric.html");
});

app.post("/result_imperial", function(req,res){

    var height_inch = parseFloat(req.body.inc);
    var weight_lbs = parseFloat(req.body.lbs);

    var intermediate_height = height_inch / 39.37;
    var intermediate_weight = weight_lbs / 2.205;
    var result_imperial = intermediate_weight / (intermediate_height * intermediate_height);

    resultSend(res,result_imperial);

});

app.post("/result_metric", function(req,res){

    var height_mtr = parseFloat(req.body.cm);
    var weight_kg = parseFloat(req.body.kg);

    var intermediate_height = height_mtr / 100;
    var intermediate_weight = weight_kg;
    var result_metric = intermediate_weight / (intermediate_height * intermediate_height);


    resultSend(res,result_metric);

});

function resultSend(resp,resultBMI){
    resp.render("result",{BMI_Message: resultBMI.toFixed(3)});
}

// server hosting code :

app.listen(3000, function (){
    console.log("server started at port 3000");
});