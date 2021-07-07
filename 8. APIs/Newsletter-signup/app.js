// defining packages

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

// using packages

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// loading static files from public folder

app.use(express.static("public"));

// GET Request to load signup.html

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/signup.html");
});

// POSTing user data and storing it

app.post("/", (req,res)=>{

    const firstName = req.body.Fname;
    const lastName = req.body.Lname;
    const Email = req.body.Email;

    console.log(firstName, lastName, Email);
    
    var data = {
        members: [
            {
                email_address: Email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    // console.log(data);
    // console.log(data.members[0].merge_fields);

    const jsonData = JSON.stringify(data);

    // console.log(jsonData);

    const url = process.env.URL;
    
    const options = {
        method: "POST",
        auth: process.env.AUTH
    }

    const request = https.request(url, options, (response) => {
        
            if(response.statusCode === 200)
            {
                console.log("pass");
                res.sendFile(__dirname + "/success.html");
            }
            else
            {
                console.log("fail");
                res.sendFile(__dirname + "/failure.html");
            }

            response.on("data", function (data) {
            // console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

// Failiure

app.post("/failure",(req,res)=>{
    res.redirect("/");
})


// server creation and running it

app.listen(3000, ()=>{
    console.log("server running on port 3000");
});