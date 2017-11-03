"use strict";

function Game(canvasElement) {
    var self = this;
    self.canvas = canvasElement;
    self.ctx = self.canvas.getContext("2d");
    self.ballRadius = 10;
    self.x = self.canvas.width / 2;
    self.y = self.canvas.height - 30;
    self.dx = 6;
    self.dy = -5;
    self.paddleHeight = 20;
    self.paddleWidth = 120;
    self.paddleX = (self.canvas.width - self.paddleWidth) / 2;
    self.rightPressed = false;
    self.leftPressed = false;
    self.spacePressed = false;
    self.brickRowCount = 4;
    self.brickColumnCount = 5;
    self.brickWidth = 70;
    self.brickHeight = 15;
    self.brickPadding = 3;
    self.brickOffsetTop = 100;
    self.brickOffsetLeft = 220;
    self.score = 0;
    self.lives = 3;
    self.intervalId;

    //Array for the bricks.
    self.bricks = [];

    self.generateBricks = function () {
        for (var c = 0; c < self.brickColumnCount; c++) {
            self.bricks[c] = [];
            for (var r = 0; r < self.brickRowCount; r++) {
                self.bricks[c][r] = {
                    x: 0,
                    y: 0,
                    status: 1
                };
            }
        }
    }
    self.splash = function () {

        var startGameDiv = document.createElement("div");
        startGameDiv.setAttribute("id", "startGame");
        startGameDiv.innerHTML = "<img id='picture' src='startgame.png'/>";
        document.getElementById("main").appendChild(startGameDiv);


        startGameDiv.addEventListener("click", function () {

            startGameDiv.parentNode.removeChild(startGameDiv);
            var canvasDiv = document.getElementById("myCanvas");
            canvasDiv.style.zIndex = "20";
            canvasDiv.style.position = "absolute";
            canvasDiv.style.alignitems = "center";

            self.startGame();
        });
    };

    // //Check if space is pressed.

    self.keySpaceDown = function (e) {
        if (e.keycode == 32) {
            self.spacePressed = true;
        }
    };

    self.keySpaceUp = function (e) {
        if (e.keyCode == 32) {
            self.spacePressed = false;
        }
    };


    //Check if the keys are pulsed.
    self.keyDownHandler = function (e) {
        if (e.keyCode == 39) {

            self.rightPressed = true;

        } else if (e.keyCode == 37) {

            self.leftPressed = true;

        }

    };

    //Check if the keys are not pulsed.
    self.keyUpHandler = function (e) {
        console.log(e.keyCode);
        if (e.keyCode == 39) {

            self.rightPressed = false;
        } else if (e.keyCode == 37) {

            self.leftPressed = false;

        }
    };

    //Method to draw the ball.
    self.drawBall = function () {
        self.ctx.beginPath();
        self.ctx.arc(self.x, self.y, self.ballRadius, 0, 2 * Math.PI);
        self.ctx.fillstyle = "#FF9A3C";
        self.ctx.fillStroke = "#FF9A3C";
        self.ctx.lineTo(90, 80);
        self.ctx.Stroke = "10";
        self.ctx.fill();
        self.ctx.closePath();
    };

    //Method to draw the paddle.
    self.drawPaddle = function () {
        self.ctx.beginPath();
        self.ctx.rect(self.paddleX, self.canvas.height - self.paddleHeight, self.paddleWidth, self.paddleHeight);
        self.ctx.fillstyle = "#FF9A3C";
        self.ctx.fill();
        self.ctx.closePath();
    };

    //Method to draw bricks.
    self.drawBricks = function () {
        for (var c = 0; c < self.brickColumnCount; c++) {
            for (var r = 0; r < self.brickRowCount; r++) {
                if (self.bricks[c][r].status == 1) {
                    var brickX = (c * (self.brickWidth + self.brickPadding)) + self.brickOffsetLeft;
                    var brickY = (r * (self.brickHeight + self.brickPadding)) + self.brickOffsetTop;
                    self.bricks[c][r].x = brickX;
                    self.bricks[c][r].y = brickY;
                    self.ctx.beginPath();
                    self.ctx.rect(brickX, brickY, self.brickWidth, self.brickHeight);
                    self.ctx.fillStyle = "#FFC93C";
                    self.ctx.fill();
                    self.ctx.closePath();
                }
            }
        }
    };
    //Method to control colision.
    self.collisionDetection = function () {
        for (var c = 0; c < self.brickColumnCount; c++) {
            for (var r = 0; r < self.brickRowCount; r++) {
                var b = self.bricks[c][r];
                if (b.status == 1) {
                    if (self.x > b.x && self.x < b.x + self.brickWidth && self.y > b.y && self.y < b.y + self.brickHeight) {
                        self.dy = -self.dy;
                        b.status = 0;
                        new Audio("smb2_coin.wav").play();
                        self.score += 50;
                        if (self.score == self.brickRowCount * self.brickColumnCount * 50) {
                            var youwin = document.getElementById("youwin");
                            youwin.style.display = "block";
                            youwin.style.justifyContent = "center";
                            youwin.style.alignItems = "center";
                            youwin.style.display = "flex";
                            var reset = document.getElementById("reset");
                            reset.style.position = "absolute";
                            reset.style.display = "block";
                            reset.style.justifyContent = "center";
                            reset.style.display = "flex";
                            reset.style.marginTop = "150px";
                            clearInterval(self.intervalId);
                            reset.addEventListener("click", self.nextlevel);

                        }
                    }
                }
            }
        }
    };
    //Counter method.
    self.drawScore = function () {
        self.ctx.font = "36px Comic-Sans";
        self.ctx.fillStyle = "#FFDE25";
        self.ctx.fillText("$ " + self.score, 8, 20);
    };
    //Lives
    self.drawLives = function () {
        self.ctx.font = "30px Arial";
        self.ctx.fillStyle = "#FFDE25";
        self.ctx.fillText("♥ " + self.lives, self.canvas.width - 65, 20);
    };


    //Draw method.
    self.draw = function () {
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.drawBricks();
        self.drawBall();
        self.drawPaddle();
        self.drawLives();
        self.drawScore();
        self.collisionDetection();
        if (self.x + self.dx > self.canvas.width - self.ballRadius || self.x + self.dx < self.ballRadius) {
            self.dx = -self.dx;
        }
        if (self.y + self.dy < self.ballRadius) {
            self.dy = -self.dy;
        } else if (self.y + self.dy > self.canvas.height - self.ballRadius) {
            if (self.x > self.paddleX && self.x < self.paddleX + self.paddleWidth) {
                if (self.y = self.y - self.paddleHeight) {
                    self.dy = -self.dy;
                }
            } else {
                self.lives--;

                if (self.lives === 0) {
                    var gameOver = document.getElementById("gameover");
                    gameOver.style.display = "block";
                    gameOver.style.justifyContent = "center";
                    gameOver.style.alignItems = "center";
                    gameOver.style.display = "flex";
                    var reset = document.getElementById("reset");
                    reset.style.position = "absolute";
                    reset.style.display = "block";
                    reset.style.justifyContent = "center";
                    reset.style.display = "flex";
                    reset.style.marginTop = "150px";
                    new Audio("lose.mp3").play();
                    clearInterval(self.intervalId);
                    reset.addEventListener("click", self.gameOver);


                } else {
                    self.x = self.canvas.width / 2;
                    self.y = self.canvas.height - 30;
                    self.dx = +self.dy;
                    self.dy = -self.dy;
                    self.paddleX = (self.canvas.width - self.paddleWidth) / 2;
                }
            }
        }
        if (self.rightPressed && self.paddleX < self.canvas.width - self.paddleWidth) {

            self.paddleX += 10;
        } else if (self.leftPressed && self.paddleX > 0) {
            self.paddleX -= 10;

        }

        self.x = self.x + self.dx;
        self.y = self.y + self.dy;
    };



    //Main method.

    self.startGame = function () {
        self.generateBricks();
        //listener of the keys starting false.
        document.addEventListener("keydown", self.keyDownHandler, false);
        document.addEventListener("keyup", self.keyUpHandler, false);
        document.addEventListener("spacedown", self.keySpaceDown, false);
        document.addEventListener("spaceup", self.keySpaceUp, false);
        var canvasDiv = document.getElementById("myCanvas");
        canvasDiv.style.display = "block";
        self.intervalId = setInterval(self.draw, 10);

    };


    self.gameOver = function () {
        //clear HTML
        var canvas = document.getElementById("myCanvas");
        canvas.innerHTML = "";
        //hide both pictures of game over
        var gameOverpic = document.getElementById("gameover");
        gameOverpic.style.display = "none";
        var resetpic = document.getElementById("reset");
        resetpic.style.display = "none";
        //hide canvas
        var canvasDiv = document.getElementById("myCanvas");
        canvasDiv.style.display = "none";
        self.lives = 4;
        self.score = 0;
        //display splash
        self.splash();
    };
    self.nextlevel = function () {
        //clear HTML
        var canvas = document.getElementById("myCanvas");
        canvas.innerHTML = "";
        //hide both pictures of game over
        var youwinpic = document.getElementById("youwin");
        youwinpic.style.display = "none";
        var resetpic = document.getElementById("reset");
        resetpic.style.display = "none";
        var content = document.getElementById("main");
        content.appendChild("startGame");
        //hide canvas
        var canvasDiv = document.getElementById("myCanvas");
        canvasDiv.style.display = "none";
        self.lives = 4;
        self.score = 0;
        self.brickRowCount = 9;
        self.brickColumnCount = 1;
        self.dx = ++self.dx;
        self.dy = --self.dy;
        self.brickOffsetTop = 100;
        self.brickOffsetLeft = 160;
        //display splash
        self.splash();

    };
}