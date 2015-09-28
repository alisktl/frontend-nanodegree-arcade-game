'use strict';

var allEnemies = [];
var allGems = [];
var player;
var point;

var GEM_IMAGES = ['images/gem-blue.png',
        'images/gem-green.png',
        'images/gem-orange.png'];
var GEM_IMAGES_LENGTH = GEM_IMAGES.length;

var PLAYER_IMAGES = ['images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'];
var PLAYER_IMAGES_LENGTH = PLAYER_IMAGES.length;

var MAX_ENEMY_NUM = 1000;
var MAX_GEM_NUM = 50;

var PLAYER_INITIAL_POINT_COUNT = 0;
var GEM_TAKE_POINT = 10;
var RIVER_REACH_POINT = 50;
var ENEMY_TOUCH_POINT = -30;
var DEFAULT_POINT_TEXT = 'Points: ';

var PLAYER_INITIAL_X = 200;
var PLAYER_INITIAL_Y = 400;
var MIN_MAP_LEFT_COOR = 100;
var MAX_MAP_RIGHT_COOR = 399;
var MAX_MAP_DOWN_COOR = 399;
var LOC_STEP_X = 100;
var LOC_STEP_Y = 85;
var RIVER_START_LOC_Y = 60;

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
        return -5 * LOC_STEP_X * (Math.ceil((i + 1) / 3));
    }
};

// GameObject ********START******
var GameObject = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the gameObject's position, required method for game
// Parameter: dt, a time delta between ticks
GameObject.prototype.update = function(dt) {
    this.x += (this.speed * dt);
};

// Draw the GameObject on the screen, required method for game
GameObject.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// GameObject ********END******

// Enemy ********START******
// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    GameObject.call(this, x, y, speed);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;

// Reset one enemy for coordinates and speed
Enemy.prototype.reset = function(i) {
    this.x = getRandomX(i);
    this.y = getRandomY();
    this.speed = getRandomSpeed();
};
// Enemy ********END******

// Reset enemies
var resetEnemies = function() {
    for(var i = 0; i < MAX_ENEMY_NUM; i++) {
        allEnemies[i].reset(i);
    }
};

// Gem ********START******
// Gems, our player should collect them
var Gem = function(x, y, speed) {
    GameObject.call(this, x, y, speed);

    this.sprite = this.getRandomImage();
};

Gem.prototype = Object.create(GameObject.prototype);
Gem.prototype.constructor = Gem;

// Reset one gem for coordinates and speed
Gem.prototype.reset = function(i) {
    this.x = getRandomX(i + (i * 5));
    this.y = getRandomY();
    this.speed = getRandomSpeed();

};
// Remove gem from the screen
Gem.prototype.removeFromScreen = function() {
    this.x = -100;
    this.y = 0;
    this.speed = 0;
};

// Get image for gem randomly
Gem.prototype.getRandomImage = function(i) {
    return GEM_IMAGES[Math.floor((Math.random() * GEM_IMAGES_LENGTH))];
};
// Gem ********END******

// Reset gems
var resetGems = function() {
    for(var i = 0; i < MAX_GEM_NUM; i++) {
        allGems[i].reset(i);
    }
};

// Point ********START******
// Point counted, by collecting gems
var Point = function() {
    this.count = PLAYER_INITIAL_POINT_COUNT;
};

// Add counter
Point.prototype.addPoint = function(points) {
    this.count += points;

    if(this.count < 0)
        this.count = 0;

    this.clearCounter();
    this.drawCounter();
};

// Clear counter on the screen
Point.prototype.clearCounter = function() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 505, 100);
};

// Draw counter on the screen
Point.prototype.drawCounter = function() {
    ctx.font = '15px SansSerif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText(DEFAULT_POINT_TEXT + this.count, 400, 25);
};
// Point ********END******

// Player ********START******
// Player, which is controlled by gamer
var Player = function(x, y) {
    this.sprite = this.getRandomImage();
    this.x = x;
    this.y = y;
};

// Update the position, after keys pressed
Player.prototype.update = function() {
    if(this.y < RIVER_START_LOC_Y) {
        point.addPoint(RIVER_REACH_POINT);
        resetEnemies();
        resetGems();
        this.reset();
    }

    var enemy;
    for(var i = 0; i < MAX_ENEMY_NUM; i++) {
        enemy = allEnemies[i];
        if(enemy.y === this.y && enemy.x >= this.x - 75 && enemy.x <= this.x + 50) {
            point.addPoint(ENEMY_TOUCH_POINT);
            resetEnemies();
            resetGems();
            this.reset();
        }
    }

    var gem;
    for(var i = 0; i < MAX_GEM_NUM; i++) {
        gem = allGems[i];
        if(gem.y === this.y && gem.x >= this.x - 75 && gem.x <= this.x + 50) {
            gem.removeFromScreen();
            point.addPoint(GEM_TAKE_POINT);
        }
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset Player coordinates
Player.prototype.reset = function() {
    this.x = PLAYER_INITIAL_X;
    this.y = PLAYER_INITIAL_Y;
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

// Get image for player randomly
Player.prototype.getRandomImage = function(i) {
    return PLAYER_IMAGES[Math.floor((Math.random() * PLAYER_IMAGES_LENGTH))];
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
// Player ********END******

// Start game
var startGame = function() {
    for(var i = 0; i < MAX_ENEMY_NUM; i++) {
        allEnemies[i] = new Enemy(getRandomX(i), getRandomY(), getRandomSpeed());
    }

    for(var j = 0; j < MAX_GEM_NUM; j++) {
        allGems[j] = new Gem(getRandomX(j + (j * 5)), getRandomY(), getRandomSpeed());
    }

    player = new Player(PLAYER_INITIAL_X, PLAYER_INITIAL_Y);

    point = new Point();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
startGame();
