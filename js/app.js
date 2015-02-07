// Enemies our player must avoid
var Enemy = function(x,y) {
    this.x = x;
    this.y = y;
    this.speed = Math.random();
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    var rate = 250
    if (this.x >= 500) {
        this.x = -140;
        this.speed = Math.random();
    } else {
        this.x = this.x + (rate * dt * this.speed);
    };
};

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var playerXStart = 200;
var playerYStart = 400;

var player = function() {
    this.x = playerXStart;
    this.y = playerYStart;

    this.sprite = 'images/char-boy.png';
};

player.prototype.update = function() {
    var rightBorder = 425;
    var leftBorder = -25;
    var bottomBorder = 425;
    var enemyDistance = 25;
    var bugBodyDistance = 60;
    var winner = 0;

    if (this.y <= winner) {
        this.x = playerXStart;
        this.y = playerYStart;
    } else if (this.x < leftBorder) {
        this.x = leftBorder;
    } else if (this.x > rightBorder) {
        this.x = rightBorder;
    } else if (this.y > bottomBorder) {
        this.y = bottomBorder;
    };
    for (i = 0; i < allEnemies.length; i++) {
        if (player.x > allEnemies[i].x - bugBodyDistance && 
            player.x < allEnemies[i].x + bugBodyDistance &&
             player.y > allEnemies[i].y - enemyDistance && 
             player.y < allEnemies[i].y + enemyDistance) {
            player.x = playerXStart;
            player.y = playerYStart;
        };
    };
};

player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

player.prototype.handleInput = function(key) {
    var stepSize = 20;
    switch (key) {
        case 'up':
            this.y -= stepSize;
            break;
        case 'down':
            this.y += stepSize;
            break;
        case 'left':
            this.x -= stepSize;
            break;
        case 'right':
            this.x += stepSize;
            break;
    }
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Now instantiate your objects.

var allEnemies = [];

var Enemies = {
    "level": {
        "easy": 5,
        "medium": 10,
        "hard": 20
    },
    "rows": {
        "row1": 50,
        "row2": 140,
        "row3": 220
    }
};

Enemies.spawn = function(num) {
    var enemyXStart = -140; 

    for (i = 0;i < num; i++) {
        switch (i % 3) {
            case 0:
                allEnemies[i] = new Enemy(enemyXStart, Enemies.rows.row1);
                break;
            case 1:
                allEnemies[i] = new Enemy(enemyXStart, Enemies.rows.row2);
                break;
            case 2:
                allEnemies[i] = new Enemy(enemyXStart, Enemies.rows.row3);
                break;
        }; 
    };
};

Enemies.spawn(Enemies.level.easy);


// Place the player object in a variable called player
var player = new player();


var checkCollisions = function() {
    
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
