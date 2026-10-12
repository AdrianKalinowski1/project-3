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
  friction: 0.85
};


const keys = {};

document.addEventListener("keydown", function (event) {
  keys[event.code] = true;
});

document.addEventListener("keyup", function (event) {
  keys[event.code] = false;
});

function update() {
  if (keys["ArrowLeft"]) {
    player.velocityX -= player.acceleration;
  }
  if (keys["ArrowRight"]) {
    player.velocityX += player.acceleration;
  }

  player.velocityX *= player.friction;
  player.x += player.velocityX;

  if (player.x < 0) {
    player.x = 0;
    player.velocityX = 0;
  }
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
    player.velocityX = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

       