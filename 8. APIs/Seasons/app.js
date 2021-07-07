// binding packages

require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const https = require("https");

// using required packages

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



// Handling requests and responses

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Handling post request

app.post("/", (req,res)=>{
    const city = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&appid=" + apiKey + "&units=" + unit;
    
    https.get(url,(response)=>{
        
        if(response.statusCode >= 400) res.send("error " + response.statusCode);

        response.on("data",(data)=>{
            
            const weatherData = JSON.parse(data);
            
            const temp = weatherData.main.temp;
            const windSpeed = weatherData.wind.speed;
            const tempMIN = weatherData.main.temp_min;
            const tempMAX = weatherData.main.temp_max;
            const pressure = weatherData.main.pressure;
            const humidity = weatherData.main.humidity;
            const feelsLike = weatherData.main.feels_like;
            const weatherIcon = weatherData.weather[0].icon;
            const weatherDesc = weatherData.weather[0].description;
            
            const imgUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
            
            var currentdate = new Date(); 
            var cityName = city.toUpperCase();
            var hour = Number((new Date()).getHours());
            var time = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            var date = currentdate.getDate() + "/" + (currentdate.getMonth()+1) + "/" + currentdate.getFullYear();

            
            res.render("season",{imageURL: imgUrl, hours: hour, cityName: cityName, cityDesc: weatherDesc, cityTemp: temp, currentTime: time, currentDate: date, feelslike: feelsLike, minTemp: tempMIN, maxTemp: tempMAX, Pressure: pressure, Humidity: humidity , windSpeed: windSpeed});

        });

    });

});


// server creation and running

app.listen(3000,()=>{
    console.log("server up and running at port 3000");
});