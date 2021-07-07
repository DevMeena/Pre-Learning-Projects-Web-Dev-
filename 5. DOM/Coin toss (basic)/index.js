function select1(clicked_id)
{
    document.querySelector("#dropdownMenuButton1").textContent = document.getElementById(clicked_id).textContent;
    var coinType = "images/" + document.querySelector("#dropdownMenuButton1").textContent + ".png";
    document.querySelector("#coin1").setAttribute("src",coinType);
}

function select2(clicked_id)
{
    document.querySelector("#dropdownMenuButton2").textContent = document.getElementById(clicked_id).textContent;
    var coinType = "images/" + document.querySelector("#dropdownMenuButton2").textContent + ".png";
    document.querySelector("#coin2").setAttribute("src",coinType);
}

function result()
{
    // TOSS RNG:

    var rng1 = Math.floor((Math.random()*2) + 1);
    var rng2 = Math.floor((Math.random()*2) + 1);
    var ans1,ans2;
    if(rng1 === 1) ans1 = "Heads";
    else ans1 = "Tails";
    if(rng2 === 1) ans2 = "Heads";
    else ans2 = "Tails";

    var coinType1 = "images/" + ans1 + ".png";
    var coinType2 = "images/" + ans2 + ".png";

    document.querySelector("#coin1").setAttribute("src",coinType1);
    document.querySelector("#coin2").setAttribute("src",coinType2);

    var p1 = document.querySelector("#dropdownMenuButton1").textContent
    var p2 = document.querySelector("#dropdownMenuButton2").textContent
    
    var win1 = 0;
    var win2 = 0;

    
    if(ans1 === p1)
    win1 = 1;
    
    if(ans2 === p2)
    win2 = 1;
    
    // console.log(rng1 + " " + rng2);
    // console.log("Hello : " + win1 + " " + win2);

    if(win1 === win2)
    {
        document.querySelector("h1").textContent = "❌ DRAW ❌"; // '<i class="fas fa-times-circle"></i> DRAW <i class="fas fa-times-circle"></i>';
        // console.log("D");
    }
    else if(win1 > win2)
    {
        document.querySelector("h1").textContent = "🚩 PLAYER 1 WINS"; // 'PLAYER 1 WINS <i class="fas fa-flag-checkered"></i>';
        console.log("p1");
        // document.querySelector("body").setAttribute("backgroundColor","#ffbb91");
    }
    else
    {
        document.querySelector("h1").textContent = "PLAYER 2 WINS 🚩"; // '<i class="fas fa-flag-checkered"></i> PLAYER 1 WINS';
        // console.log("p2");
        // document.querySelector("body").setAttribute("backgroundColor","#CCF2F4");
    }
}