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

let platforms = [];
let coins = [];
let spikes = [];

let currentLevel = 0;
let gameWon = false;

const levels = [
  {
    platforms: [
      { x: 200, y: 330, width: 150, height: 15 },
      { x: 420, y: 260, width: 150, height: 15 },
      { x: 620, y: 190, width: 150, height: 15 }
    ],
    coins: [
      { x: 260, y: 300 },
      { x: 480, y: 230 },
      { x: 680, y: 160 },
      { x: 500, y: 370 },
      { x: 700, y: 370 }
    ],
    spikes: [
      { x: 360, y: groundY - 20, width: 30, height: 20 },
      { x: 600, y: groundY - 20, width: 30, height: 20 }
    ]
  },
  {
    platforms: [
      { x: 120, y: 325, width: 110, height: 15 },
      { x: 350, y: 275, width: 100, height: 15 },
      { x: 470, y: 225, width: 100, height: 15 },
      { x: 640, y: 175, width: 120, height: 15 }
    ],
    coins: [
      { x: 160, y: 285 },
      { x: 335, y: 235 },
      { x: 505, y: 185 },
      { x: 690, y: 135 },
      { x: 480, y: 370 }
    ],
    spikes: [
      { x: 250, y: groundY - 20, width: 20, height: 10 },
      { x: 400, y: groundY - 20, width: 30, height: 20 },
      { x: 550, y: groundY - 20, width: 30, height: 20 },
      { x: 700, y: groundY - 20, width: 30, height: 20 }
    ]
  }
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

function loadLevel(index) {
  const level = levels[index];

  platforms = level.platforms;
  spikes = level.spikes;
  coins = level.coins.map(function (coin) {
    return { x: coin.x, y: coin.y, width: 20, height: 20, collected: false };
  });

  player.x = 50;
  player.y = 300;
  player.velocityX = 0;
  player.velocityY = 0;
}

function nextLevel() {
  if (currentLevel + 1 >= levels.length) {
    gameWon = true;
  } else {
    currentLevel++;
    loadLevel(currentLevel);
  }
}

function restartGame() {
  score = 0;
  gameOver = false;
  gameWon = false;
  currentLevel = 0;
  loadLevel(0);
}
function update() {
    if ((gameOver || gameWon) && keys["KeyR"]) {
      restartGame();
    }

    if (gameOver || gameWon) {
    }
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
   // kolce
  for (const spike of spikes) {
    if (isOverlapping(player, spike)) {
      gameOver = true;
    }
  }
    // koniec poziomu
  if (!gameOver && coins.every(function (coin) { return coin.collected; })) {
    nextLevel();
  }
}

function drawEndScreen(title, subtitle) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "40px Arial";
  ctx.fillText(title, canvas.width / 2, canvas.height / 2);
  ctx.font = "20px Arial";
  ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 40);
  ctx.textAlign = "left";
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
  // kolce
  ctx.fillStyle = "gray";
  for (const spike of spikes) {
    ctx.beginPath();
    ctx.moveTo(spike.x, spike.y + spike.height);                 // lewy dół
    ctx.lineTo(spike.x + spike.width / 2, spike.y);              // czubek
    ctx.lineTo(spike.x + spike.width, spike.y + spike.height);   // prawy dół
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = "black";
  ctx.font = "18px Arial";
  ctx.fillText("Use Arrow Keys to Move", 10, 20);
   // licznik punktów
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
   ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Punkty: " + score, 20, 60);
  ctx.fillText("Poziom: " + (currentLevel + 1) + " / " + levels.length, 20, 90);
   
    if (gameOver) {
    drawEndScreen("Koniec gry!", "Naciśnij R, aby zagrać jeszcze raz");
  }
  if (gameWon) {
    drawEndScreen("Wygrałeś!", "Wynik: " + score + " pkt. Naciśnij R, aby zagrać jeszcze raz");
  }
  
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

loadLevel(0);
gameLoop();

       