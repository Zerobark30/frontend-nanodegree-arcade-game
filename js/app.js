//Create object to store all of the data relevant to the game as a whole
var gameData = {
    "gameLevel":1,
    "gameLives":5,
    "gameWon": false,
    "rows": {
        "row1": 50,
        "row2": 140,
        "row3": 220
    },
    "enemyXStart":-140,
};

// Create Character class
var Character = function(x,y) {
    this.x = x;
    this.y = y;

    // Player level
    this.level = 1;

    //Player lives
    this.lives = 5;
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
        enemy.spawn(this.level * 5);
    };
    if (this.lives < 0) {
        allEnemies = [];
        this.level = 1;
        enemy.spawn(this.level * 5);
        this.lives = 5;
    };
    //update the canvas to put the enemy further across
    //the screen by the rate * dt * speed factor;
    //put the enemy back at the starting position with a 
    //new speed factor if it's reached the end of the screen
    if (this.x >= this.enemyFinish) {
        this.x = gameData.enemyXStart;
        this.speed = Math.random();
    } else {
        this.x += (this.rate * dt * this.speed);
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

    // Player lives remaining
    this.lives = 5;

    // Set the border pixels
    this.rightBorder = 425
    this.leftBorder = -25
    this.bottomBorder = 425
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

//Update function for player, a required method for engine.js
Player.prototype.update = function() {
    //if the player is at the winning y coordinate, move it back
    //to the start TODO other winning events
    if (this.y <= this.winner) {
        this.x = playerStartX;
        this.y = playerStartY;
        gameData.gameWon = true;
        this.level ++;
        gameData.winnerMessageDisplay = true;
        
    //If the game is not a winner, check if the player has fewer 
    //than 0 lives. If so, set the player to start, set level to 1 
    } else if (this.lives < 0) {
        this.level = 1;
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
            this.lives -= 1;
        };
    };
};

//handleInput function to take values passed from allowedKeys object
Player.prototype.handleInput = function(key) {
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

//Create the allEnemies array to hold enemy objects
var allEnemies = [];

// Spawn function adds enemies to allEnemies array in
// An amount corresponding to the number supplied
Enemy.prototype.spawn = function(num) {
    for (i = 0;i < num; i++) {
        //Sets the starting coordinates for the enemy, with y values
        //coresponding to the Enemies.rows object, based upon the
        //divisibility of the index
        switch (i % 3) {
            case 0:
                allEnemies[i] = new Enemy(gameData.enemyXStart, gameData.rows.row1);
                break;
            case 1:
                allEnemies[i] = new Enemy(gameData.enemyXStart, gameData.rows.row2);
                break;
            case 2:
                allEnemies[i] = new Enemy(gameData.enemyXStart, gameData.rows.row3);
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
    this.livesBegin = "Remaning lives: "
    this.points = "Score: "
    this.levelBegin = "Level: "
    this.winnerMessage = "WINNER!!"
    this.levelMessageEnd = "Begin!"
    this.messageCounter = 100
    this.winnerMessageDisplay = false
    this.levelMessageDisplay = false
};

// Function to render the game details
headsUpDisplay.prototype.render = function() {
    ctx.font = "bold 20px Quicksand";
    ctx.fillStyle = "yellow";
    ctx.fillText(this.livesBegin + player.lives, 325, 80);
    ctx.fillText(this.levelBegin + player.level, 5, 80);

    if (this.messageCounter === 0) {
        this.winnerMessageDisplay = false;
        this.messageCounter = 50;
    };

    if (this.winnerMessageDisplay) {
        ctx.font = "bold 50px Quicksand";
        ctx.fillStyle = "blue";
        ctx.fillText(this.winnerMessage, 150, 300);
        this.messageCounter -= 1;
    };
};

//Instantiate the Heads Up Display, player and enemy 
var enemy = new Enemy();
var HUD = new headsUpDisplay();
var player = new Player(200,400);

//Spawn enemies TODO fix spawn function
enemy.spawn(enemy.level * 5);