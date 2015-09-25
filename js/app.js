var allEnemies = [];
var player;

var PLAYER_INITIAL_X = 200;
var PLAYER_INITIAL_Y = 400;
var MAX_ENEMY_NUM = 1000;

var MIN_MAP_LEFT_COOR = 100;
var MAX_MAP_RIGHT_COOR = 399;
var MAX_MAP_DOWN_COOR = 399;

var LOC_STEP_X = 100;
var LOC_STEP_Y = 85;

var RIVER_START_LOC_Y = 60;

// Start game
var startGame = function() {
    for(var i = 0; i < MAX_ENEMY_NUM; i++) {
        allEnemies[i] = new Enemy(getRandomX(i), getRandomY(), getRandomSpeed());
    }

    player = new Player(PLAYER_INITIAL_X, PLAYER_INITIAL_Y);
};

// Reset enemies
var resetEnemies = function() {
    for(var i = 0; i < MAX_ENEMY_NUM; i++) {
        allEnemies[i].resetEnemy(i);
    }
};

// Get random speed
var getRandomSpeed = function() {
    return 50 * Math.floor((Math.random() * 4) + 1);
};

// Get random y-location
var getRandomY = function() {
    return (RIVER_START_LOC_Y + (Math.floor(Math.random() * 3) * LOC_STEP_Y));
};

// Get random x-location
var getRandomX = function(i) {
    if(i < 4) {
        return -1 * LOC_STEP_X * (Math.ceil((i + 1) / 3));
    }
    else {
        return -3 * LOC_STEP_X * (Math.ceil((i + 1) / 3));
    }
};

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += (this.speed * dt);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset one enemy for coordinates and speed
Enemy.prototype.resetEnemy = function(i) {
    this.x = getRandomX(i);
    this.y = getRandomY();
    this.speed = getRandomSpeed()
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
};

Player.prototype.update = function() {
    if(this.y < RIVER_START_LOC_Y) {
        resetEnemies();
        player.reset();
    }

    for(var i = 0; i < allEnemies.length; i++) {
        var enemy = allEnemies[i];
        if(enemy.y === this.y && enemy.x >= this.x - 75 && enemy.x <= this.x + 50) {
            resetEnemies();
            player.reset();
        }
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset Player coordinates
Player.prototype.reset = function() {
    player.x = PLAYER_INITIAL_X;
    player.y = PLAYER_INITIAL_Y;
};

// Receives code from Player
Player.prototype.handleInput = function(keyCode) {
    if(keyCode === 'left') {
        if(this.x >= MIN_MAP_LEFT_COOR) {
            this.x -= LOC_STEP_X;
        }
    }
    else if(keyCode === 'right') {
        if(this.x <= MAX_MAP_RIGHT_COOR) {
            this.x += LOC_STEP_X;
        }
    }
    else if(keyCode === 'up') {
        this.y -= LOC_STEP_Y;
    }
    else if(keyCode === 'down') {
        if(this.y <= MAX_MAP_DOWN_COOR) {
            this.y += LOC_STEP_Y;
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
startGame();
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
