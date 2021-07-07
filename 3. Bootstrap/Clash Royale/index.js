var colors = ["#ffffff","#000000","#EAE2B6","#77ACF1","#FFC074","#FFC107","#3C8DAD"];
var idx = 0;

function setColor(blockId) {
document.getElementById(blockId).style.color = colors[++idx%7];
}