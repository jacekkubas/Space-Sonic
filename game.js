var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;
var bullets = [];
var wynik;
var name;
var weapon;
var sonicShot;
var bulletShot;
var bgloop;
var bgloop2;
var crashSound;

function startGame() {
    myBackground = new component(480, 270, "img/bg.png", 0, 0, "background");
    myGamePiece = new component(30, 24, "img/ship1.png", 10, 120, "ship");
    weapon = new component(30, 30, "white", 20, 240, "weapons");
    myScore = new component("18px", "Consolas", "white", 360, 40, "text");
    bgloop = new sound('audio/bg-loop5.mp3');
    bgloop2 = new sound('audio/bg-loop6.mp3');
    sonicShot = new sound('audio/sonic.wav');
    bulletShot = new sound('audio/bullet.wav');
    crashSound = new sound('audio/crash.wav');
    myGameArea.start();
}

var myGameArea = {
    canvas: document.getElementById("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.weapon = 'bullets';
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
        $('#wyniki input:nth-child(2)').val(myGameArea.frameNo);
        $('#wyniki').submit();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

function component(width, height, color, x, y, type, destroy) {
    this.type = type
    if (type == "image" || type == "background" || type == "obstacle" || type == "ship") {
        this.image = new Image();
        this.image.src = color;
        this.bum = new Image();
        this.bum.src = "img/bum.gif";
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    if (type == 'ship') {
        this.ship = true;
    }
    if (type == "weapons") {
        this.weapon = 'sonic';
    }
    if (destroy == 'destroy') {
        this.destroy = true;
    }
    this.update = function () {
        ctx = myGameArea.context;
        if (type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "image" || type == "background" || type == "ship") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image,
                    this.x + this.width, this.y, this.width, this.height);
            }
        } else if (type == "bullet") {
            if (this.x > myGameArea.canvas.width) {
                bullets.shift();
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        } else if (type == "weapons") {
            if (this.weapons == 'sonic') {
                ctx.fillStyle = color;
                ctx.fillRect(this.x + 6, this.y - 4, 3, 15);
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, 15, 3);
            }
        } else if (type == "obstacle") {
            if (this.x < -100) {
                myObstacles.shift();
            } else {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        if (this.type == "ship") {
            if (this.y <= 0) {
                this.y = 1;
            } else if (this.y + this.height >= myGameArea.canvas.height) {
                this.y = myGameArea.canvas.height - this.height - 1;
            } else if (this.x <= 0) {
                this.x = 1;
            } else {
                this.x += this.speedX;
                this.y += this.speedY;
            }
        } else {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.type == "background") {
                if (this.x == -(this.width)) {
                    this.x = 0;
                }
            }
        }

    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + this.width;
        var mytop = this.y;
        var mybottom = this.y + this.height;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + otherobj.width;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + otherobj.height;
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }

}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

function updateGameArea() {
    // music 
    bgloop.play();

    // crash
    var x, y;
    for (var i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.canvas.getContext('2d').drawImage(myGamePiece.bum, myGamePiece.x, myGamePiece.y, myGamePiece.width, myGamePiece.height);
            myGameArea.stop();
            bgloop.stop();
            crashSound.play();
            return;
        }
    }

    // clear
    myGameArea.clear();
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();

    //obstacles
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(50)) {
        x = myGameArea.canvas.width;
        minLeft = 0;
        maxLeft = 40;
        minHeight = 20;
        maxHeight = 60;
        minTop = 0;
        maxTop = myGameArea.canvas.height;
        XXleft = Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft);
        XXleft2 = Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft);
        XXleft3 = Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft);
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        XXtop = Math.floor(Math.random() * (maxTop - minTop + 1) + minTop);
        XXtop2 = Math.floor(Math.random() * (maxTop - minTop + 1) + minTop);
        XXtop3 = Math.floor(Math.random() * (maxTop - minTop + 1) + minTop);
        XXtop4 = Math.floor(Math.random() * (maxTop - minTop + 1) + minTop);

        if (myGameArea.frameNo > 1200) {

            myObstacles.push(new component(height, height, "img/asteroid2.png", x + XXleft2, XXtop3, "obstacle", "destroy"));
            myObstacles.push(new component(height, height, "img/asteroid2.png", x, XXtop2, "obstacle", "destroy"));
            myObstacles.push(new component(height, height, "img/asteroid1.png", x + XXleft, XXtop, "obstacle"));
            myObstacles.push(new component(height, height, "img/asteroid1.png", x + XXleft3, XXtop4, "obstacle"));
        } else if (myGameArea.frameNo > 800) {
            myObstacles.push(new component(height, height, "img/asteroid2.png", x + XXleft2, XXtop3, "obstacle", "destroy"));
            myObstacles.push(new component(height, height, "img/asteroid2.png", x, XXtop2, "obstacle", "destroy"));
            myObstacles.push(new component(height, height, "img/asteroid1.png", x + XXleft, XXtop, "obstacle"));
        } else if (myGameArea.frameNo > 400) {
            myObstacles.push(new component(height, height, "img/asteroid2.png", x, XXtop2, "obstacle", "destroy"));
            myObstacles.push(new component(height, height, "img/asteroid1.png", x + XXleft, XXtop, "obstacle"));
        } else {
            myObstacles.push(new component(height, height, "img/asteroid1.png", x + XXleft, XXtop, "obstacle"));
        }

    }
    for (var i = 0; i < myObstacles.length; i++) {
        if (myObstacles[i].hit == true) {
            myObstacles[i].x += -1;
            myObstacles[i].update();
        } else if (myGameArea.frameNo > 2000) {
            myObstacles[i].x += -3;
            myObstacles[i].update();
        } else {
            myObstacles[i].x += -2;
            myObstacles[i].update();
        }

    }

    // bullets
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].x += 3;
        bullets[i].update();
    }
    for (let i = 0; i < bullets.length; i++) {
        var that = i;

        if (myGameArea.weapon == 'sonic') {
            for (let i = 0; i < myObstacles.length; i++) {
                if (bullets[that].crashWith(myObstacles[i])) {
                    myObstacles[i].hit = true;
                }
            }
        } else if (myGameArea.weapon == 'bullets') {
            for (let i = 0; i < myObstacles.length; i++) {
                if (bullets[that].crashWith(myObstacles[i]) && myObstacles[i].destroy == true) {
                    myObstacles.splice(i, 1);
                    bullets.splice(that, 1);
                    return;
                } else if (bullets[that].crashWith(myObstacles[i])) {
                    bullets.splice(that, 1);
                    return;
                }
            }
        }

    }


    // score
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();

    // weapon
    weapon.update();


    // my game piece
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[38]) {
        myGamePiece.speedY = -2;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
        myGamePiece.speedY = 2;
    }
    if (myGameArea.keys && myGameArea.keys[37]) {
        myGamePiece.speedX = -2;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        myGamePiece.speedX = 2;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        myGamePiece.speedX = 2;
    }
    myGamePiece.newPos();
    myGamePiece.update();
}

function restart() {
    clearInterval(myGameArea.interval);
    bgloop.stop();
    myGamePiece = 0;
    myObstacles = [];
    myScore = 0;
    myBackground = 0;
    myGameArea.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    startGame();
}

function pause() {
    clearInterval(myGameArea.interval);
}

function keyPressed (e) {
    myGamePiece.image.src = 'img/ship2.png';
    myGameArea.keys = (myGameArea.keys || []);
    myGameArea.keys[e.keyCode] = true;
    if (e.keyCode == 32 && myGameArea.weapon == 'sonic') {
        if (bullets.length < 1) {
            bullets.push(new component(1, 20, "#fff", myGamePiece.x + myGamePiece.width, myGamePiece.y + myGamePiece.height / 15, "bullet"));
            sonicShot.play();
        }
    } else if (e.keyCode == 32 && myGameArea.weapon == 'bullets') {
        if (bullets.length < 10) {
            bullets.push(new component(20, 5, "#fff", myGamePiece.x + myGamePiece.width, myGamePiece.y + myGamePiece.height / 2.2, "bullet"));
            bulletShot.play();
        }
    } 
    
    if (e.keyCode == 49) {
        myGameArea.weapon = 'sonic';
        weapon.weapons = 'sonic';
    }
    
    if (e.keyCode == 50) {
        weapon.weapons = 'bullets';
        myGameArea.weapon = 'bullets';
    }
    
    if (e.keyCode == 82) {
        restart();
    }
}

function keyUp (e) {
    myGamePiece.image.src = 'img/ship1.png';
    myGameArea.keys[e.keyCode] = false;
}

window.addEventListener('keydown', keyPressed);
window.addEventListener('keyup', keyUp);