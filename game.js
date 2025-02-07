// Global variables
let width, height, fps, tileSize, canvas, ctx, snake, food, score, isPaused, interval;

// Initialize game on window load
window.addEventListener("load", game);

// Event listener for key presses
window.addEventListener("keydown", function (evt) {
  evt.preventDefault();
  switch (evt.key) {
    case " ":
      isPaused = !isPaused;
      if (isPaused) showPaused();
      break;
    case "ArrowUp":
      if (snake.velY === 0) snake.dir(0, -1);
      break;
    case "ArrowDown":
      if (snake.velY === 0) snake.dir(0, 1);
      break;
    case "ArrowLeft":
      if (snake.velX === 0) snake.dir(-1, 0);
      break;
    case "ArrowRight":
      if (snake.velX === 0) snake.dir(1, 0);
      break;
  }
});

// Generate random spawn location on the grid
function spawnLocation() {
  return {
    x: Math.floor(Math.random() * (width / tileSize)) * tileSize,
    y: Math.floor(Math.random() * (height / tileSize)) * tileSize
  };
}

// Display score
function showScore() {
  ctx.font = "25px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`SCORE: ${score}`, width - 120, 30);
}

// Display paused state
function showPaused() {
  ctx.font = "35px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("PAUSED", width / 2, height / 2);
}

// Snake class
class Snake {
  constructor(pos, color) {
    this.x = pos.x;
    this.y = pos.y;
    this.tail = [
      { x: pos.x - tileSize, y: pos.y },
      { x: pos.x - 2 * tileSize, y: pos.y }
    ];
    this.velX = 1;
    this.velY = 0;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    [this, ...this.tail].forEach(({ x, y }) => {
      ctx.fillRect(x, y, tileSize, tileSize);
      ctx.strokeRect(x, y, tileSize, tileSize);
    });
  }

  move() {
    this.tail.unshift({ x: this.x, y: this.y });
    this.tail.pop();
    this.x += this.velX * tileSize;
    this.y += this.velY * tileSize;
  }

  dir(x, y) {
    this.velX = x;
    this.velY = y;
  }

  eat() {
    if (this.x === food.x && this.y === food.y) {
      this.tail.push({});
      return true;
    }
    return false;
  }

  die() {
    return this.tail.some(({ x, y }) => x === this.x && y === this.y);
  }

  border() {
    if (this.x >= width) this.x = 0;
    else if (this.x < 0) this.x = width - tileSize;
    if (this.y >= height) this.y = 0;
    else if (this.y < 0) this.y = height - tileSize;
  }
}

// Food class
class Food {
  constructor(pos, color) {
    this.x = pos.x;
    this.y = pos.y;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillRect(this.x, this.y, tileSize, tileSize);
    ctx.strokeRect(this.x, this.y, tileSize, tileSize);
  }
}

// Initialize game settings
function init() {
  tileSize = 20;
  width = Math.floor(window.innerWidth / tileSize) * tileSize;
  height = Math.floor(window.innerHeight / tileSize) * tileSize;
  fps = 10;

  canvas = document.getElementById("game-area");
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext("2d");

  isPaused = false;
  score = 0;
  snake = new Snake({ x: width / 2, y: height / 2 }, "#39ff14");
  food = new Food(spawnLocation(), "red");
}

// Update game state
function update() {
  if (isPaused) return;

  if (snake.die()) {
    alert("GAME OVER");
    clearInterval(interval);
    window.location.reload();
  }

  snake.border();

  if (snake.eat()) {
    score += 10;
    food = new Food(spawnLocation(), "red");
  }

  ctx.clearRect(0, 0, width, height);
  food.draw();
  snake.draw();
  snake.move();
  showScore();
}

// Start the game
function game() {
  init();
  interval = setInterval(update, 1000 / fps);
}
