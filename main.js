const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

//KEYPRESS
let leftPress = false;
let rightPress = false;
let upPress = false;
let downPress = false;
addEventListener("keydown", keydownHandler, false);
addEventListener("keyup", keyupHandler, false);

function keydownHandler(e) {
    if (e.keyCode == 37) {
        leftPress = true;
    }
    if (e.keyCode == 38) {
        upPress = true;
    }
    if (e.keyCode == 39) {
        rightPress = true;
    }
    if (e.keyCode == 40) {
        downPress = true;
    }
}

function keyupHandler(e) {
    if (e.keyCode == 37) {
        leftPress = false;
    }
    if (e.keyCode == 38) {
        upPress = false;
    }
    if (e.keyCode == 39) {
        rightPress = false;
    }
    if (e.keyCode == 40) {
        downPress = false;
    }
}

function random(min, max) {
    const num = (Math.floor(Math.random() * (max - min + 1)) + min);
    return num;
}

//SHAPE 

function Shape(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}

Shape.prototype.update = function() {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }
    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }
    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }
    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }
};


//CONTROL BALL

// function ControlBall(x, y, velX, velY, color, size) {
//     Shape.call(this, x, y, velX, velY, color, size);
// }
class ControlBall extends Shape {
    constructor(x, y, velX, velY, color, size) {
        super(x, y, velX, velY, color, size);
    }
}

ControlBall.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.stroke();
}

ControlBall.prototype.move = function() {
    if (leftPress == true) {
        this.x -= 4;
    }
    if (rightPress == true) {
        this.x += 4;
    }
    if (upPress == true) {
        this.y -= 4;
    }
    if (downPress == true) {
        this.y += 4;
    }
}

let playerSize = 10;

let player = new ControlBall(
    random(0 + playerSize, width - playerSize),
    random(0 + playerSize, height - playerSize),
    2,
    2,
    "rgb(255, 255, 255)",
    playerSize
);



//BALL

class Ball extends Shape {
    constructor(x, y, velX, velY, color, size) {
        super(x, y, velX, velY, color, size);
    }
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

Ball.prototype.move = function() {
    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collision = function() {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + "," + random(0, 255) + ',' + random(0, 255) + ")";
            }
        }
    }
};

ControlBall.prototype.collision = function() {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls.splice(j, 1);
                this.size += 2;
            }
        }
    }
};

let balls = [];
while (balls.length < 25) {
    let size = random(10, 20);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        'rgb(' + random(0, 255) + "," + random(0, 255) + ',' + random(0, 255) + ")",
        size
    );
    balls.push(ball);
}

function finishGame() {
    if (balls.length == 0) {
        alert("You Win!");
        document.location.reload();
    }
}


//LOOP

function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].move();
        balls[i].update();
        balls[i].collision();
    }

    player.draw();
    player.move();
    player.update();
    player.collision();
    finishGame();

    requestAnimationFrame(loop);
}

loop();
