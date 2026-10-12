const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const player = {
  x: 100,
  y: 300,
  width: 40,
  height: 50,
  color: "red",
  velocityX: 0,
  acceleration: 0.8,
  friction: 0.85,
  velocityY: 0,
  gravity: 0.6,
  jumpPower: -13,
  onGround: false
};
const groundY = 400;

const platforms = [
  { x: 200, y: 330, width: 150, height: 15 },
  { x: 420, y: 260, width: 150, height: 15 },
  { x: 620, y: 190, width: 150, height: 15 }
];
const coins = [
  { x: 260, y: 300, width: 20, height: 20, collected: false },
  { x: 480, y: 230, width: 20, height: 20, collected: false },
  { x: 680, y: 160, width: 20, height: 20, collected: false },
  { x: 500, y: 370, width: 20, height: 20, collected: false },
  { x: 700, y: 370, width: 20, height: 20, collected: false }
];

const keys = {};

document.addEventListener("keydown", function (event) {
  keys[event.code] = true;
});

document.addEventListener("keyup", function (event) {
  keys[event.code] = false;
});
let score  = 0;
let gameOver = false;

function isOverlapping(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
function update() {
  // ===== RUCH POZIOMY =====
  if (keys["ArrowLeft"]) {
    player.velocityX -= player.acceleration;
  }
  if (keys["ArrowRight"]) {
    player.velocityX += player.acceleration;
  }

  player.velocityX *= player.friction;
  player.x += player.velocityX;

  // ściany ekranu
  if (player.x < 0) {
    player.x = 0;
    player.velocityX = 0;
  }
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
    player.velocityX = 0;
  }

  // kolizje poziome z platformami
  for (const platform of platforms) {
    if (isOverlapping(player, platform)) {
      if (player.velocityX > 0) {
        // szliśmy w prawo -> stajemy przy lewej krawędzi platformy
        player.x = platform.x - player.width;
      } else if (player.velocityX < 0) {
        // szliśmy w lewo -> stajemy przy prawej krawędzi platformy
        player.x = platform.x + platform.width;
      }
      player.velocityX = 0;
    }
  }

  // ===== RUCH PIONOWY =====
  // skok
  if ((keys["Space"] || keys["ArrowUp"]) && player.onGround) {
    player.velocityY = player.jumpPower;
  }

  // grawitacja
  player.velocityY += player.gravity;
  if (player.velocityY > 14) {
    player.velocityY = 14;   // maksymalna prędkość spadania
  }
  player.y += player.velocityY;

  player.onGround = false;

  // podłoga
  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.onGround = true;
  }

  // kolizje pionowe z platformami
  for (const platform of platforms) {
    if (isOverlapping(player, platform)) {
      if (player.velocityY > 0) {
        // spadaliśmy -> lądujemy na górze platformy
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.onGround = true;
      } else if (player.velocityY < 0) {
        // lecieliśmy w górę -> uderzamy głową w spód platformy
        player.y = platform.y + platform.height;
        player.velocityY = 0;
      }
    }
  }
    // zbieranie monet
  for (const coin of coins) {
    if (!coin.collected && isOverlapping(player, coin)) {
      coin.collected = true;
      score++;
    }
  }
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
   // podłoga
  ctx.fillStyle = "#6b4f2a";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
    // platformy
  ctx.fillStyle = "#3a7d2c";
  for (const platform of platforms) {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  }
   // monety
  ctx.fillStyle = "gold";
  for (const coin of coins) {
    if (!coin.collected) {
      ctx.beginPath();
      ctx.arc(
        coin.x + coin.width / 2,
        coin.y + coin.height / 2,
        coin.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = "black";
  ctx.font = "18px Arial";
  ctx.fillText("Use Arrow Keys to Move", 10, 20);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

       