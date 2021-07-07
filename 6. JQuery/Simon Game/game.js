var flag = false; // started or not
var level = 0;
var colors = ["green","red","yellow","blue"];
var gamePattern = [];
var userPattern = [];


// Start Game Function
$(document).keypress(function (){
    if(!flag)
    {
        flag = true;
        startGame();
    }
})

// Game code:
function startGame()
{
        userPattern = [];
        $("h1").text("level " + ++level);
        var rng = Math.floor((Math.random() * 4)); // Random Number Generator
        var color = colors[rng]; // converting rng to button color
        gamePattern.push(color); // adding random button color to in game sequence
        makeSound(color); // producing sound and effect of random button
        $("#" + color).fadeIn(100).fadeOut(100).fadeIn(100); // Animates auto press
}

// checks if user entered correct i/p
function checkAnswer(n)
{
    if(userPattern[n] === gamePattern[n]){
        if(userPattern.length === gamePattern.length)
        {
            var correctAns = new Audio('sounds/correct.mp3');
            correctAns.play();
            $("body").addClass("pass");
            setTimeout(function (){
                $("body").removeClass("pass");
            },200);

            setTimeout(function (){
                startGame();
            },1000);
        }
    }
    else {
        gameOver();
    }
}



// Game Over COde:

function gameOver() {
    $("h1").text("Game Over");
    var game_over = new Audio('sounds/wrong.mp3');
    game_over.play();

    $("body").addClass("over");

    setTimeout(function (){
        $("body").removeClass("over");
    },200);

    setTimeout(function (){
        $("h1").text("Press Any Key to Try Again!");

    },1000);

    Restart();
}


// Sound code :

$(".box").click( function ()
{
    var id = $(this).attr('id');
    userPattern.push(id);
    makeSound(id);
    animateButton(id);
    checkAnswer(userPattern.length - 1);
});

function animateButton(id)
{
    $("#" + id).addClass("pressed");

    setTimeout(function (){
        $("#" + id).removeClass("pressed");
    },200);
}

function makeSound(id)
{
    var aud = new Audio('sounds/' + id + '.mp3');
    aud.play();
}

function Restart()
{
    level = 0;
    gamePattern = [];
    userPattern = [];
    flag = false;
}
