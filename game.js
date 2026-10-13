// ===== USTAWIENIA =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const groundY = 400;
const maxFallSpeed = 14;
const langButton = document.getElementById("lang-button");

const button = document.getElementById("lang-button");

const translations = {
  pl: {
    points: "Punkty",
    level: "Poziom",
    controls: "Strzałki: ruch, spacja: skok",
    gameOverTitle: "Koniec gry!",
    gameOverHint: "Naciśnij R, aby zagrać jeszcze raz",
    wonTitle: "Wygrałeś!",
    wonHint: "Wynik: {score} pkt. Naciśnij R, aby zagrać jeszcze raz"
  },
  en: {
    points: "Points",
    level: "Level",
    controls: "Arrows: move, space: jump",
    gameOverTitle: "Game Over!",
    gameOverHint: "Press R to play again",
    wonTitle: "You won!",
    wonHint: "Score: {score} pts. Press R to play again"
  }
};

let currentLanguage = "pl";

function t(key) {
  return translations[currentLanguage][key] || key;

}

function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem("language", language);
  document.documentElement.lang = language;
  langButton.textContent = language === "pl" ? "EN" : "PL";
}
    

// ===== DANE GRY =====
const player = {
  x: 50,
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
  onGround: false,
  facing: 1
};

let platforms = [];
let coins = [];
let spikes = [];
let score = 0;
let currentLevel = 0;
let gameOver = false;
let gameWon = false;

const clouds = [
  { x: 120, y: 70 },
  { x: 420, y: 110 },
  { x: 680, y: 60 }
];

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
      { x: 300, y: groundY - 20, width: 30, height: 20 },
      { x: 750, y: groundY - 20, width: 30, height: 20 }
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
      { x: 390, y: 235 },
      { x: 505, y: 185 },
      { x: 690, y: 135 },
      { x: 480, y: 370 }
    ],
    spikes: [
      { x: 250, y: groundY - 10, width: 20, height: 10 },
      { x: 400, y: groundY - 20, width: 30, height: 20 },
      { x: 550, y: groundY - 20, width: 30, height: 20 },
      { x: 700, y: groundY - 20, width: 30, height: 20 }
    ]
  }
];

// ===== KLAWISZE =====
const keys = {};

document.addEventListener("keydown", function (event) {
  keys[event.code] = true;
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
    event.preventDefault();
  }
});

document.addEventListener("keyup", function (event) {
  keys[event.code] = false;
});

// ===== FUNKCJE POMOCNICZE =====
function isOverlapping(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

// ===== POZIOMY =====
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

// ===== AKTUALIZACJA =====
function movePlayerHorizontally() {
  if (keys["ArrowLeft"]) {
    player.velocityX -= player.acceleration;
    player.facing = -1;
  }
  if (keys["ArrowRight"]) {
    player.velocityX += player.acceleration;
    player.facing = 1;
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
        player.x = platform.x - player.width;
      } else if (player.velocityX < 0) {
        player.x = platform.x + platform.width;
      }
      player.velocityX = 0;
    }
  }
}

function movePlayerVertically() {
  // skok
  if ((keys["Space"] || keys["ArrowUp"]) && player.onGround) {
    player.velocityY = player.jumpPower;
  }

  // grawitacja
  player.velocityY += player.gravity;
  if (player.velocityY > maxFallSpeed) {
    player.velocityY = maxFallSpeed;
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
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.onGround = true;
      } else if (player.velocityY < 0) {
        player.y = platform.y + platform.height;
        player.velocityY = 0;
      }
    }
  }
}

function collectCoins() {
  for (const coin of coins) {
    if (!coin.collected && isOverlapping(player, coin)) {
      coin.collected = true;
      score++;
    }
  }
}

function checkSpikes() {
  for (const spike of spikes) {
    if (isOverlapping(player, spike)) {
      gameOver = true;
    }
  }
}

function checkLevelComplete() {
  if (!gameOver && coins.every(function (coin) { return coin.collected; })) {
    nextLevel();
  }
}

function update() {
  if ((gameOver || gameWon) && keys["KeyR"]) {
    restartGame();
  }
  if (gameOver || gameWon) {
    return;
  }

  movePlayerHorizontally();
  movePlayerVertically();
  collectCoins();
  checkSpikes();
  checkLevelComplete();
}

// ===== RYSOWANIE =====
function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#4a90d9");
  sky.addColorStop(1, "#bfe4ff");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  for (const cloud of clouds) {
    drawCircle(cloud.x, cloud.y, 22);
    drawCircle(cloud.x + 25, cloud.y - 8, 28);
    drawCircle(cloud.x + 55, cloud.y, 22);
  }
}

function drawGround() {
  ctx.fillStyle = "#6b4f2a";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(0, groundY, canvas.width, 8);
}

function drawPlatforms() {
  for (const platform of platforms) {
    ctx.fillStyle = "#6b4f2a";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(platform.x, platform.y, platform.width, 5);
  }
}

function drawCoins() {
  for (const coin of coins) {
    if (!coin.collected) {
      const centerX = coin.x + coin.width / 2;
      const centerY = coin.y + coin.height / 2 + Math.sin(Date.now() / 200 + coin.x) * 3;

      ctx.fillStyle = "#d4a017";
      drawCircle(centerX, centerY, 11);
      ctx.fillStyle = "gold";
      drawCircle(centerX, centerY, 8);
      ctx.fillStyle = "#fff6b0";
      drawCircle(centerX - 3, centerY - 3, 2.5);
    }
  }
}

function drawSpikes() {
  ctx.fillStyle = "gray";
  for (const spike of spikes) {
    ctx.beginPath();
    ctx.moveTo(spike.x, spike.y + spike.height);                 // lewy dół
    ctx.lineTo(spike.x + spike.width / 2, spike.y);              // czubek
    ctx.lineTo(spike.x + spike.width, spike.y + spike.height);   // prawy dół
    ctx.closePath();
    ctx.fill();
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  const eyeX = player.facing === 1 ? player.x + player.width - 14 : player.x + 6;
  ctx.fillStyle = "white";
  ctx.fillRect(eyeX, player.y + 10, 8, 8);
  ctx.fillStyle = "black";
  ctx.fillRect(eyeX + (player.facing === 1 ? 4 : 0), player.y + 12, 4, 4);
}

function drawHud() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(10, 10, 170, 70);
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
    ctx.fillText(t("points") + score, 22, 38);
  ctx.fillText(t("level") + (currentLevel + 1) + " / " + levels.length, 22, 64);

  ctx.font = "16px Arial";
  ctx.fillText(t("controls"), 20, groundY + 32);
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
  drawBackground();
  drawGround();
  drawPlatforms();
  drawCoins();
  drawSpikes();
  drawPlayer();
  drawHud();

    if (gameOver) {
    drawEndScreen(t("gameOverTitle"), t("gameOverHint"));
  }
  if (gameWon) {
    drawEndScreen(t("wonTitle"), t("wonHint").replace("{score}", score));
  }
}

// ===== PĘTLA GRY =====
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
langButton.addEventListener("click", function () {
  setLanguage(currentLanguage === "pl" ? "en" : "pl");
  langButton.blur();
});

const savedLanguage = localStorage.getItem("language");
setLanguage(savedLanguage === "en" ? "en" : "pl");

loadLevel(0);
gameLoop();