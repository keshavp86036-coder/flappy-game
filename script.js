const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// IMAGE
const birdImg = new Image();
birdImg.src = "player.png";

// MUSIC
const bgMusic = new Audio("music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.4;

const jumpSound = new Audio("jump.mp3");
jumpSound.volume = 0.8;

let musicStarted = false;

// PLAYER
let bird = {
  x: 80,
  y: 200,
  size: 45,
  gravity: 0.6,
  lift: -11,
  velocity: 0
};

let pipes = [];
let frame = 0;
let score = 0;

// START MUSIC
function startMusic() {
  if (!musicStarted) {
    bgMusic.play();
    musicStarted = true;
  }
}

// DRAW CIRCULAR PLAYER
function drawBird() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    bird.x + bird.size / 2,
    bird.y + bird.size / 2,
    bird.size / 2,
    0,
    Math.PI * 2
  );
  ctx.clip();

  ctx.drawImage(birdImg, bird.x, bird.y, bird.size, bird.size);
  ctx.restore();
}

// UPDATE PLAYER
function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y < 0 || bird.y + bird.size > canvas.height) {
    resetGame();
  }
}

// PIPES
function createPipe() {
  let gap = 150;
  let top = Math.random() * 250 + 50;

  pipes.push({
    x: canvas.width,
    top: top,
    bottom: canvas.height - top - gap,
    width: 50
  });
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
  });
}

function updatePipes() {
  pipes.forEach(p => p.x -= 2);

  if (pipes.length && pipes[0].x + pipes[0].width < 0) {
    pipes.shift();
    score++;
  }
}

// COLLISION
function checkCollision() {
  pipes.forEach(p => {
    if (
      bird.x < p.x + p.width &&
      bird.x + bird.size > p.x &&
      (bird.y < p.top ||
       bird.y + bird.size > canvas.height - p.bottom)
    ) {
      resetGame();
    }
  });
}

// SCORE
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// RESET
function resetGame() {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
}

// GAME LOOP
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();

  updateBird();
  updatePipes();
  checkCollision();

  if (frame % 100 === 0) createPipe();
  frame++;

  requestAnimationFrame(gameLoop);
}

// CONTROLS
document.addEventListener("keydown", () => {
  startMusic();
  bird.velocity = bird.lift;
  jumpSound.currentTime = 0;
  jumpSound.play();
});

canvas.addEventListener("click", () => {
  startMusic();
  bird.velocity = bird.lift;
  jumpSound.currentTime = 0;
  jumpSound.play();
});

gameLoop();
