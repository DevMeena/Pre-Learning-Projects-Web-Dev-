//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

// sessions should be placed here:

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize()); // initializing passport to use it
app.use(passport.session()); // using passport to set up session

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});

// the plugin should be defined before creating a model
// userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});

userSchema.plugin(passportLocalMongoose); // hashes and salts passwords and stores them in DB
userSchema.plugin(findOrCreate); // makes use of mongoose find or create function

const User = new mongoose.model("User",userSchema);

// using passport to serialize and deserialize users
passport.use(User.createStrategy()); // local sign in strategy

// only works for local serialization and deserialization

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// works for all kinds of serializations

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

// it must be here:

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  function(accessToken, refreshToken, profile, cb) {

    // console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/auth/google", passport.authenticate( "google",{ scope: ["profile"] } ));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  });

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/secrets",(req,res)=>{
    // if(req.isAuthenticated()){
    //     res.render("secrets");
    // } else {
    //     res.redirect("/login");
    // }

    User.find({"secret": {$ne: null}}, (e,foundUsers)=>{
        if(e){
            console.log(e);
        } else {
            if(foundUsers){
                res.render("secrets",{usersWithSecrets: foundUsers});
            } else {
                // res.render("secrets",{usersWithSecrets: "No users with secrets found"});
                console.log("no users found");
            }
        }
    })

});

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

app.get("/submit",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.post("/register",(req,res)=>{
    User.register({username: req.body.username}, req.body.password, (e,user)=>{
        if(e) {
            console.log(e);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/secrets");
            })
        }
    })
});

app.post("/login",(req,res)=>{

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user,(e)=>{
        if(e) {
            console.log(e);
        } else {
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/secrets");
            })
        }
    });

});

app.post("/submit",(req,res)=>{
    const submittedSecret = req.body.secret;

    User.findById(req.user.id,(e,foundUser)=>{
        if(e) {
            console.log(e);
        } else {
            if(foundUser) {
                foundUser.secret = submittedSecret;
                foundUser.save(()=>{
                    res.redirect("/secrets");
                });
            }
        }
    });
});

// server running code:

app.listen(3000, ()=>{
    console.log("server up and running at port 3000");
});

// extra packages used previously

// const saltRounds = 10;
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const encrypt = require("mongoose-encryption");

// login

// const username = req.body.username;
//         const password = req.body.password;

//         User.findOne({email: username},(e,foundUser)=>{
//             if(e) {
//                 console.log(e);
//             } else {
//                 if(foundUser){
//                     bcrypt.compare(password, foundUser.password, function(err, result) {
//                         if(result === true) { // result == true
//                             res.render("secrets");
//                         } else {
//                             console.log(err);
//                         }
//                     });
//                 } else {
//                     console.log(e);
//                 }
//             }
//         });

// register

// bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//     const newUser = new User({
//         email: req.body.username,
//         password: hash
//     });

//     newUser.save((e)=>{
//         if(!e){
//             res.render("secrets");
//         } else {
//             console.log(e);
//         }
//     });
// });