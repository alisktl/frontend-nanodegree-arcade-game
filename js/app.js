var allEnemies = [];
var player;

// Put all enemies and player to starting locations
var resetAll = function() {
    allEnemies = [1000];
    for(var i = 0; i < 1000; i++) {
        allEnemies[i] = new Enemy(getRandomX(i), getRandomY(), getRandomSpeed());
    }

    player = new Player();
};

// Get random speed
var getRandomSpeed = function() {
    return 50 * Math.floor((Math.random() * 4) + 1);
};

// Get random y-location
var getRandomY = function() {
    return (60 + (Math.floor(Math.random() * 3) * 85));
};

// Get random x-location
var getRandomX = function(i) {
    if(i < 4)
        return -100 * (Math.ceil((i + 1) / 3));
    else
        return -300 * (Math.ceil((i + 1) / 3));
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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
};

Player.prototype.update = function() {
    if(this.y < 60)
        resetAll();

    for(var i = 0; i < allEnemies.length; i++) {
        var enemy = allEnemies[i];
        if(enemy.y === this.y && enemy.x >= this.x - 75 && enemy.x <= this.x + 50) {
            resetAll();
        }
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Receives code from Player
Player.prototype.handleInput = function(keyCode) {
    if(keyCode === 'left') {
        if(this.x >= 100)
            this.x -= 100;
    }
    else if(keyCode === 'right') {
        if(this.x <= 399)
            this.x += 100;
    }
    else if(keyCode === 'up') {
        this.y -= 85;
    }
    else if(keyCode === 'down') {
        if(this.y <= 399)
            this.y += 85;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
resetAll();
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
