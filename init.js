var game = null;

function init() {
    var startGameDiv = document.getElementById("startGame");
    var canvas = document.getElementById("myCanvas");
    game = new Game(canvas);
    game.splash();



    console.log("dom fully loaded!");
}

document.addEventListener("DOMContentLoaded", init);