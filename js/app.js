//Create object to store all of the data relevant to the game as a whole
gameData = {
    "gameWon": false,
    "level": 1,
    "lives": 5,
    "gameFreeze": false,
    "gameCounter": 0
};

// Create Character class
var Character = function(x,y) {
    this.x = x;
    this.y = y;
};

//Add render prototype for characters
Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Create Enemy sub-class of Character
var Enemy = function(x,y) {
    Character.call(this,x,y);
    
    // Random speed multiplier for the enemy bug
    this.speed = Math.random();
    
    // The image/sprite for our enemies
    this.sprite = 'images/enemy-bug.png';

    // Base speed rate for enemies
    this.rate = 250;

    //X coordinate at which the enemy re-spanws
    this.enemyFinish = 500;

    //Set starting row Y coordinates for enemies
    this.rows = {
        "row1": 50,
        "row2": 140,
        "row3": 220
    };

    // Set starting X coordinate
    this.enemyXStart = -140;
};

//Add constructor function and deligate to Character.prototype
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    //check to see if gameWon is true or gameLevel is below
    //zero. If so, respawn more enemies by a factor of the new level
    if (gameData.gameWon === true) {
        allEnemies = [];
        enemy.spawn(gameData.level * 5);
    };
    if (gameData.lives < 0) {
        allEnemies = [];
        enemy.spawn(gameData.level * 5);
    };
    //update the canvas to put the enemy further across
    //the screen by the rate * dt * speed factor;
    //put the enemy back at the starting position with a 
    //new speed factor if it's reached the end of the screen
    if (this.x >= this.enemyFinish) {
        this.x = this.enemyXStart;
        this.speed = Math.random();
    } else {
        this.x += (this.rate * dt * this.speed);
    };
};

// Spawn function adds enemies to allEnemies array in
// An amount corresponding to the number supplied
Enemy.prototype.spawn = function(num) {
    for (i = 0;i < num; i++) {
        //Sets the starting coordinates for the enemy, with y values
        //coresponding to the Enemies.rows object, based upon the
        //divisibility of the index
        switch (i % 3) {
            case 0:
                allEnemies[i] = new Enemy(this.enemyXStart, this.rows.row1);
                break;
            case 1:
                allEnemies[i] = new Enemy(this.enemyXStart, this.rows.row2);
                break;
            case 2:
                allEnemies[i] = new Enemy(this.enemyXStart, this.rows.row3);
                break;
        }; 
    };
};

//The function for our hero 
var Player = function(x,y) {
    Character.call(this,x,y);
    
    //Set the starting x and y coordinates
    this.x = x;
    this.y = y;
    playerStartX = x;
    playerStartY = y;

    // Set the image to be used for player
    this.sprite = 'images/char-boy.png';

    // Set the number of pixels equal to a step
    this.stepSize = 20;

    // Set the collision distance pixels
    this.bugBodyDistance = 60;

    // Set the variable for the goal y coordinate
    this.winner = 0;

    // Set the border pixels
    this.rightBorder = 425
    this.leftBorder = -25
    this.bottomBorder = 425
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

//Update function for player, a required method for engine.js
Player.prototype.update = function() {
    // If player is at winning y coordinate, move to start, increment level
    if (this.y <= this.winner) {
        this.x = playerStartX;
        this.y = playerStartY;
        gameData.gameWon = true;
        gameData.level ++;
        
    //If the game is not a winner, check if the player has fewer 
    //than 0 lives. If so, set the player to start, set level to 1 
    } else if (gameData.lives < 0) {
        gameData.level = 1;
        this.x = playerStartX;
        this.y = playerStartY;
    //If the player is not at the winning y coordinate, check
    //if the player is at one of the borders and do not let 
    //it move beyond them
    } else if (this.x < this.leftBorder) {
        this.x = this.leftBorder;
    } else if (this.x > this.rightBorder) {
        this.x = this.rightBorder;
    } else if (this.y > this.bottomBorder) {
        this.y = this.bottomBorder;
    } else {
        gameData.gameWon = false;
    };
    //Collision detection; if the player is within one of the
    //specified ranges of one of the enemies, set the player
    //x and y coordinates to the starting position
    for (i = 0; i < allEnemies.length; i++) {
        if (player.x > allEnemies[i].x - this.bugBodyDistance &&
            player.x < allEnemies[i].x + this.bugBodyDistance &&
            player.y > allEnemies[i].y - this.bugBodyDistance &&
            player.y < allEnemies[i].y + this.bugBodyDistance) {
            player.x = playerStartX;
            player.y = playerStartY;
            gameData.lives --;
        };
    };
};

//handleInput function to take values passed from allowedKeys object
Player.prototype.handleInput = function(key) {
    if (gameData.gameFreeze === false) {
        switch (key) {
            case 'up':
                this.y -= this.stepSize;
                break;
            case 'down':
                this.y += this.stepSize;
                break;
            case 'left':
                this.x -= this.stepSize;
                break;
            case 'right':
                this.x += this.stepSize;
                break;
        };
    };
};


//Call the enemies.spawn function to populate the allEnemies array

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

//Create HUD object, this contains the text to display
//on screen showing game data
var headsUpDisplay = function() {
    this.livesBegin = "Remaning lives: ";
    this.points = "Score: ";
    this.levelBegin = "Level ";
    this.winnerMessage = "WINNER!!";
    this.levelMessageEnd = "Begin!";
    this.gameOver = "Game Over :(";
    this.gameOverDisplay = false;
    this.messageCounter = 100;
    this.winnerMessageDisplay = false;
    this.levelMessageDisplay = false;
    this.levelMessageCounter = 100;
    this.gameOverCounter = 100;
};


headsUpDisplay.prototype.renderHelper = function(message,condition,x,y,size,color) {
    if (condition) {
    ctx.font = "bold "+ size + " Quicksand";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(message, x, y);
    };
};
// Function to render the game details
headsUpDisplay.prototype.render = function() {

    HUD.renderHelper(this.levelBegin + 
        gameData.level,true,40,80,"20px","yellow");

    HUD.renderHelper(this.livesBegin + 
        gameData.lives,true,410,80,"20px","yellow");

    HUD.renderHelper(this.winnerMessage,this.winnerMessageDisplay,
        210,300,"50px","blue");

    HUD.renderHelper(this.levelBegin + gameData.level + this.levelMessageEnd,
        this.levelMessageDisplay, 210,300,"50px","green");

    HUD.renderHelper(this.gameOver,this.gameOverDisplay, 
        210,300,"50px","green");

};

headsUpDisplay.prototype.update = function() {
    // When a player beats the level, set the message display to true
    if (gameData.gameWon) {
        this.winnerMessageDisplay = true;
    };

    // When the message display is true, start the counter, freeze screen
    if (this.winnerMessageDisplay) {
        this.messageCounter --;
        gameData.gameFreeze = true;
    };

    // If message counter is done, unfreeze, winner off, level display on
    if (this.messageCounter === 0) {
        this.winnerMessageDisplay = false;
        this.messageCounter = 100;
        gameData.gameFreeze = false;
        this.levelMessageDisplay = true;
    };

    //When the level info display is on, start level counter
    if (this.levelMessageDisplay) {
        this.levelMessageCounter --;
    };

    //WHen level counter hits zero, turn level display off
    if (this.levelMessageCounter === 0) {
        this.levelMessageDisplay = false;
        this.levelMessageCounter = 100;
    };

    //Turn on gameOver message when lives are at zero
    if (gameData.lives === 0) {
        this.gameOverDisplay = true
    };

    if (this.gameOverDisplay) {
        this.gameOverCounter --;
        gameData.gameFreeze = true;
    };

    if (this.gameOverCounter === 0) {
        this.gameOverDisplay = false;
        this.gameOverCounter = 100;
        gameData.lives = 5;
        gameData.gameFreeze = false;
        gameData.level = 1;
    };

    //If 
};

//Create allEnemies array; instantiate the Heads Up Display, player and enemy 
var allEnemies = [];
var enemy = new Enemy();
var HUD = new headsUpDisplay();
var player = new Player(200,400);

//Spawn enemies
enemy.spawn(gameData.level * 5);