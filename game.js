var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;

function startGame() {
    myBackground = new component(480, 270, "img/bg.png", 0, 0, "image")
    myGamePiece = new component(30, 24, "img/ship1.png", 10, 120, "image", "true");
    myScore = new component("18px", "Consolas", "white", 360, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGamePiece.image.src = 'img/ship2.png';
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGamePiece.image.src = 'img/ship1.png';
            myGameArea.keys[e.keyCode] = false; 
        })
    },
    clear: function() {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0 ) { return true;}
    return false;
}

function component(width, height, color, x, y, type, ship) {
    this.type = type
    if (this.type == "image"){
        this.image = new Image();
        this.image.src = color;
        this.bum = new Image();
        this.bum.src = "img/bum.gif";
    }
    this.ship = ship;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (this.type == "image"){
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        if (this.ship == "true") {
            if ( this.y <= 0){
            this.y = 1;
            } else if (this.y + this.height >= myGameArea.canvas.height) {
                this.y = myGameArea.canvas.height - this.height - 1;   
            } else if (this.x <= 0) {
                this.x = 1;   
            } else {
                this.x += this.speedX;
            this.y += this.speedY;
            }
        }
         else {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        
    }
    this.crashWith = function(otherobj) {
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

function updateGameArea() {
    var x, y;
    for ( var i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.canvas.getContext('2d').drawImage(myGamePiece.bum, myGamePiece.x, myGamePiece.y, myGamePiece.width, myGamePiece.height);
            myGameArea.stop();
            return;
        }
    }
    myGameArea.clear();
    myBackground.speedX = -1; 
    myBackground.newPos();
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(50)) {
        x = myGameArea.canvas.width;
        minLeft = 0;
        maxLeft = 40;
        minHeight = 20;
        maxHeight = 60;
        minTop = 0;
        maxTop = myGameArea.canvas.height;
        XXleft = Math.floor(Math.random() * (maxLeft-minLeft+1) + minLeft);
        height = Math.floor(Math.random() * (maxHeight-minHeight+1) + minHeight);
        XXtop = Math.floor(Math.random() * (maxTop-minTop+1) + minTop);
        XXtop2 = Math.floor(Math.random() * (maxTop-minTop+1) + minTop);
        
        if(myGameArea.frameNo > 400 ){
            myObstacles.push( new component(height, height, "red", x, XXtop2));
            myObstacles.push( new component(height, height, "green", x + XXleft, XXtop));
        } else {
            myObstacles.push( new component(height, height, "green", x + XXleft, XXtop));
        }
        
    }
    for (var i = 0; i<myObstacles.length; i++) {
        myObstacles[i].x += -2;
        myObstacles[i].update();
    }
    
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -2; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 2; }
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -2; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 2; }
    myGamePiece.newPos();
    myGamePiece.update();
    
    
    
}










