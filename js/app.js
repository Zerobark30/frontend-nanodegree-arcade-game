//Global variable for the enemy start x coordinate
var enemyXStart = -140;

//Global variable that toggles on/off if the player wins
var gameWon = false;

//Global variable for the level of the game
var gameLevel = 1;

//Global variable for number of lives the player has
var gameLives = 5;

//Global variables for the player start coordinates
var playerXStart = 200;
var playerYStart = 400;

//Global variables for enemy area border y coordinates
var enemyAreaTop = 25;
var enemyAreaBottom = 250;

// Enemies our player must avoid
var Enemy = function(x,y) {
    //set the x and y coordinates equal to the supplied numbers
    this.x = x;
    this.y = y;
    
    //Create an initial speed multiplier for the enemy bug
    this.speed = Math.random();
    
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    //set the base rate at which all bugs move across
    //the screen
    var rate = 250;

    //set the variable for x coordinate at which the 
    //enemy should start back at the left side of the screen
    var enemyFinish = 500;

    //check to see if gameWon is true or gameLevel is below
    //zero. If so, respawn more enemies by a factor of the new level
    if (gameWon === true || gameLevel < 0) {
        allEnemies = [];
        Enemies.spawn(gameLevel * 5);
    };
    //update the canvas to put the enemy further across
    //the screen by the rate * dt * this.speed factor;
    //put the enemy back at the starting position with a 
    //new speed factor if it's reached the end of the screen
    if (this.x >= enemyFinish) {
        this.x = enemyXStart;
        this.speed = Math.random();
    } else {
        this.x += (rate * dt * this.speed);
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//The function for our hero 
var player = function() {
    //Set the starting x and y coordinates
    this.x = playerXStart;
    this.y = playerYStart;

    //set the image to be used for player
    this.sprite = 'images/char-boy.png';
};

//Update function for player, a required method for engine.js
player.prototype.update = function() {
    //Set the variables for the canvas border coordinates
    var rightBorder = 425;
    var leftBorder = -25;
    var bottomBorder = 425;

    //Set the variable for collision ranges 
    var enemyDistance = 25;
    var bugBodyDistance = 60;

    //Set the variable for the goal y coordinate for the player
    var winner = 0;

    //if the player is at the winning y coordinate, move it back
    //to the start TODO other winning events
    if (this.y <= winner) {
        this.x = playerXStart;
        this.y = playerYStart;
        gameWon = true;
        gameLevel ++;
    //If the game is not a winner, check if the player has fewer 
    //than 0 lives. If so, set the player to start, set level to 1 
    } else if (gameLives < 0) {
        gameLevel = 1;
        this.x = playerYStart;
        this.y = playerYStart;
    //If the player is not at the winning y coordinate, check
    //if the player is at one of the borders and do not let 
    //it move beyond them
    } else if (this.x < leftBorder) {
        this.x = leftBorder;
    } else if (this.x > rightBorder) {
        this.x = rightBorder;
    } else if (this.y > bottomBorder) {
        this.y = bottomBorder;
    } else {
        gameWon = false;
    };
    //Collision detection; if the player is within one of the
    //specified ranges of one of the enemies, set the player
    //x and y coordinates to the starting position
    for (i = 0; i < allEnemies.length; i++) {
        if (player.x > allEnemies[i].x - bugBodyDistance && 
            player.x < allEnemies[i].x + bugBodyDistance &&
            player.y > allEnemies[i].y - enemyDistance &&
            player.y < allEnemies[i].y + enemyDistance) {
            player.x = playerXStart;
            player.y = playerYStart;
            gameLives -= 1;
        };
    };
};

//render function to draw the player on the canvas
player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//handleInput function to take values passed from allowedKeys object
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

//Create the allEnemies array to hold enemy objects
var allEnemies = [];


//Create the Enemies object to store globally available
//data on enemies
var Enemies = {
    //level object contains values for number of 
    //enemies to appear in the game; TODO allow for 
    ///easy, medium or hard selection
    "level": {
        "Easy": 5,
        "Medium": 10,
        "Hard": 20
    },
    //rows object contains values for y coordinates of 
    //enemies to start at
    "rows": {
        "row1": 50,
        "row2": 140,
        "row3": 220
    }
};

//Spanw function adds enemies to allEnemies array in
//an amount corresponding to the number supplied
Enemies.spawn = function(num) { 
    for (i = 0;i < num; i++) {
        //Sets the starting coordinates for the enemy, with y values
        //coresponding to the Enemies.rows object, based upon the
        //divisibility of the index
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

//Call the enemies.spawn function to populate the allEnemies array
Enemies.spawn(gameLevel * 5);

//Place the player object in a variable called player
var player = new player();

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
var headsUpDisplay = {
    "Lives":"Remaning lives: ",
    "Points":"Score: ",
    "Level":"Level: "
};

headsUpDisplay.render = function() {
    ctx.fillText(headsUpDisplay.Lives + gameLives, 325, 80);
    ctx.font = "bold 20px Quicksand";
    ctx.fillStyle = "yellow";
    ctx.fillText(headsUpDisplay.Level + gameLevel, 5, 80);
    ctx.font = "bold 20px Quicksand";
    ctx.fillStyle = "yellow";
};

