// ===== USTAWIENIA =====
// Znajdujemy w HTML element <canvas> o id "game" (to nasze płótno)
const canvas = document.getElementById("game");
// "Pędzel" do rysowania w 2D na tym płótnie
const ctx = canvas.getContext("2d");

// Wysokość podłogi: wszystko poniżej linii y = 400 to ziemia
const groundY = 400;
// Maksymalna prędkość spadania (piksele na klatkę), żeby postać nie przyspieszała w nieskończoność
const maxFallSpeed = 14;
// Kruszące się platformy: po ilu klatkach od wejścia znikają i po ilu wracają (60 klatek = 1 sekunda)
const crumbleDelay = 60;
const respawnDelay = 180;
// Przycisk zmiany języka z pliku game.html
const langButton = document.getElementById("lang-button");
const menuButton = document.getElementById("menu-button");

// ===== TŁUMACZENIA =====
// Wszystkie napisy w grze, osobno dla każdego języka (pl = polski, en = angielski)
const translations = {
  pl: {
    points: "Punkty: ",
    level: "Poziom: ",
    best: "Rekord: ",
    controls: "A/D lub strzałki: ruch, spacja: skok",
    mainMenu: "Menu główne",
    gameOverTitle: "Koniec gry!",
    gameOverHint: "Naciśnij R, aby zagrać jeszcze raz",
    wonTitle: "Wygrałeś!",
    // {score} to miejsce, w które później wstawiamy prawdziwy wynik
    wonHint: "Wynik: {score} pkt. Naciśnij R, aby zagrać jeszcze raz"
  },
  en: {
    points: "Score: ",
    level: "Level: ",
    best: "Best: ",
    controls: "A/D or arrows: move, space: jump",
    mainMenu: "Main menu",
    gameOverTitle: "Game over!",
    gameOverHint: "Press R to play again",
    wonTitle: "You win!",
    wonHint: "Score: {score}. Press R to play again"
  }
};

// Aktualnie wybrany język (na start polski)
let currentLanguage = "pl";

// Krótka funkcja pomocnicza: podajesz klucz (np. "points"), dostajesz napis w aktualnym języku
function t(key) {
  return translations[currentLanguage][key];
}

// Zmienia język gry
function setLanguage(language) {
  currentLanguage = language;                          // zapamiętujemy nowy język
  localStorage.setItem("language", language);          // zapisujemy wybór w przeglądarce (zostaje po odświeżeniu)
  document.documentElement.lang = language;            // ustawiamy język strony w znaczniku <html>
  langButton.textContent = language === "pl" ? "EN" : "PL"; // przycisk pokazuje język, na który się przełączy
  menuButton.textContent = t("mainMenu");
}

// ===== DANE GRY =====
// Gracz: jeden obiekt, który trzyma wszystko o postaci
const player = {
  x: 50,               // pozycja w poziomie (lewa krawędź)
  y: 300,              // pozycja w pionie (górna krawędź)
  width: 40,           // szerokość postaci
  height: 50,          // wysokość postaci
  color: "red",        // kolor postaci
  velocityX: 0,        // prędkość w poziomie (+ prawo, - lewo)
  acceleration: 0.8,   // o ile rośnie prędkość, gdy trzymasz strzałkę
  friction: 0.85,      // tarcie: w każdej klatce zostaje 85% prędkości (płynne hamowanie)
  velocityY: 0,        // prędkość w pionie (+ w dół, - w górę)
  gravity: 0.6,        // grawitacja: o tyle rośnie prędkość w dół w każdej klatce
  jumpPower: -13,      // siła skoku (ujemna, bo w górę)
  onGround: false,     // czy postać stoi na podłodze lub platformie
  facing: 1,           // w którą stronę patrzy: 1 = prawo, -1 = lewo
  standingOn: null     // platforma, na której stoi (albo null, gdy stoi na ziemi lub jest w powietrzu)
};

// Listy rzeczy w aktualnym poziomie (wypełnia je funkcja loadLevel)
let platforms = [];    // platformy
let coins = [];        // monety
let spikes = [];       // kolce
let enemies = [];      // wrogowie
let score = 0;         // punkty w tej grze
// Najlepszy wynik: odczytany z pamięci przeglądarki (jeśli go tam nie ma, to 0)
let bestScore = Number(localStorage.getItem("bestScore")) || 0;
let currentLevel = 0;  // numer poziomu (0 = pierwszy)
let startingLevel = 0;
let gameOver = false;  // czy gracz przegrał
let gameWon = false;   // czy gracz wygrał całą grę

// Współrzędne chmur na niebie (tylko ozdoba)
const clouds = [
  { x: 120, y: 70 },
  { x: 420, y: 110 },
  { x: 680, y: 60 }
];

const backgroundThemes = [
  { top: "#4a90d9", bottom: "#bfe4ff", clouds: "rgba(255, 255, 255, 0.8)" },
  { top: "#e97962", bottom: "#ffd59a", clouds: "rgba(255, 245, 220, 0.8)" },
  { top: "#342b67", bottom: "#8273b5", clouds: "rgba(230, 225, 255, 0.75)", stars: true },
  { top: "#329b87", bottom: "#b8e6bd", clouds: "rgba(240, 255, 245, 0.8)" }
];

// Rząd kolców na ziemi: startX = gdzie zaczyna się rząd, count = ile kolców
function spikeRow(startX, count) {
  const row = [];                                   // pusta lista na kolce
  for (let i = 0; i < count; i++) {                 // powtarzamy count razy
    // Każdy kolec: rozmiar 30 x 20, stoi na ziemi, kolejny 30 pikseli za poprzednim
    row.push({ x: startX + i * 30, y: groundY - 20, width: 30, height: 20 });
  }
  return row;                                       // oddajemy gotowy rząd
}

// Dane wszystkich poziomów: każdy poziom to obiekt z platformami, monetami, kolcami i wrogami
const levels = [
  {
    // poziom 1
    platforms: [
      // x, y = pozycja lewego górnego rogu; width, height = rozmiar
      { x: 200, y: 330, width: 150, height: 15 },
      { x: 420, y: 260, width: 150, height: 15 },
      { x: 620, y: 190, width: 150, height: 15 }
    ],
    coins: [
      // pozycje monet (rozmiar dodaje loadLevel)
      { x: 260, y: 300 },
      { x: 480, y: 230 },
      { x: 680, y: 160 },
      { x: 500, y: 370 },
      { x: 700, y: 370 }
    ],
    spikes: [
      // kolce stoją na ziemi (groundY - 20 = wysokość kolca nad podłogą)
      { x: 300, y: groundY - 20, width: 30, height: 20 },
      { x: 750, y: groundY - 20, width: 30, height: 20 }
    ],
    enemies: [
      // wróg chodzi między minX a maxX; y = jego wysokość; speed = prędkość
      { minX: 400, maxX: 650, y: groundY - 30, speed: 1.5 }
    ]
  },
  {
    // poziom 2
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
      // pierwszy kolec jest mniejszy (20 x 10), reszta standardowa
      { x: 250, y: groundY - 10, width: 20, height: 10 },
      { x: 400, y: groundY - 20, width: 30, height: 20 },
      { x: 550, y: groundY - 20, width: 30, height: 20 },
      { x: 700, y: groundY - 20, width: 30, height: 20 }
    ],
    enemies: [
      { minX: 440, maxX: 520, y: groundY - 30, speed: 1.2 }
    ]
  },
  {
    // poziom 3: platformy ruszające się w poziomie
    platforms: [
      { x: 140, y: 320, width: 90, height: 15 },
      // axis "x" = jeździ w poziomie; min i max = skrajne pozycje; speed = prędkość
      { x: 260, y: 320, width: 80, height: 15, axis: "x", min: 260, max: 400, speed: 1.4 },
      { x: 530, y: 290, width: 80, height: 15 }
    ],
    coins: [
      { x: 170, y: 290 },
      { x: 340, y: 290 },
      { x: 560, y: 260 },
      { x: 660, y: 370 },
      { x: 740, y: 370 }
    ],
    spikes: spikeRow(180, 14),   // 14 kolców pod rząd od x = 180
    enemies: []                  // na tym poziomie nie ma wrogów
  },
  {
    // poziom 4: windy, czyli platformy ruszające się w pionie
    platforms: [
      { x: 120, y: 330, width: 90, height: 15 },
      // axis "y" = jeździ w pionie (min i max to teraz wysokości)
      { x: 270, y: 320, width: 80, height: 15, axis: "y", min: 150, max: 320, speed: 1.2 },
      { x: 380, y: 150, width: 110, height: 15 },
      { x: 540, y: 230, width: 90, height: 15 },
      { x: 670, y: 230, width: 80, height: 15, axis: "y", min: 230, max: 330, speed: 1.0 }
    ],
    coins: [
      { x: 150, y: 300 },
      { x: 430, y: 120 },
      { x: 570, y: 200 },
      { x: 640, y: 370 },
      { x: 760, y: 370 }
    ],
    spikes: spikeRow(250, 4),
    enemies: [
      { minX: 430, maxX: 600, y: groundY - 30, speed: 1.3 }
    ]
  },
  {
    // poziom 5: finał, wszystko razem
    platforms: [
      { x: 130, y: 320, width: 80, height: 15 },
      { x: 260, y: 300, width: 70, height: 15, axis: "x", min: 260, max: 360, speed: 1.6 },
      { x: 470, y: 300, width: 70, height: 15, axis: "y", min: 200, max: 300, speed: 1.0 },
      { x: 590, y: 200, width: 170, height: 15 }
    ],
    coins: [
      { x: 160, y: 290 },
      { x: 330, y: 270 },
      { x: 500, y: 175 },
      { x: 610, y: 170 },
      { x: 730, y: 370 }
    ],
    spikes: spikeRow(160, 18),
    enemies: [
      // wróg chodzi po górnej platformie (y = 170, bo platforma jest na 200, a wróg ma 30 wysokości)
      { minX: 640, maxX: 720, y: 170, speed: 1.2 }
    ]
  },
  {
    // poziom 6: kruszące się platformy nad polem kolców
    platforms: [
      { x: 120, y: 330, width: 80, height: 15 },
      { x: 250, y: 310, width: 70, height: 15, crumble: true },
      { x: 380, y: 280, width: 70, height: 15, crumble: true },
      { x: 510, y: 250, width: 70, height: 15, crumble: true },
      { x: 640, y: 220, width: 120, height: 15 }
    ],
    coins: [
      { x: 150, y: 300 },
      { x: 275, y: 280 },
      { x: 405, y: 250 },
      { x: 535, y: 220 },
      { x: 690, y: 190 }
    ],
    spikes: spikeRow(150, 20),
    enemies: []
  },
  {
    // poziom 7: ruchoma platforma, potem dwie kruszące się
    platforms: [
      { x: 110, y: 330, width: 80, height: 15 },
      // pozioma platforma jeździ między x = 230 a x = 330
      { x: 230, y: 310, width: 70, height: 15, axis: "x", min: 230, max: 330, speed: 1.3 },
      { x: 430, y: 280, width: 70, height: 15, crumble: true },
      { x: 550, y: 250, width: 70, height: 15, crumble: true },
      { x: 670, y: 220, width: 100, height: 15 }
    ],
    coins: [
      { x: 140, y: 300 },
      { x: 455, y: 250 },
      { x: 575, y: 220 },
      { x: 700, y: 190 }
    ],
    spikes: spikeRow(150, 21),
    enemies: []
  },
  {
    // poziom 8: finał (kruszące platformy, winda i wróg na ostatniej platformie)
    platforms: [
      { x: 100, y: 330, width: 70, height: 15 },
      { x: 220, y: 310, width: 60, height: 15, crumble: true },
      // winda: jeździ w pionie między y = 180 a y = 300
      { x: 340, y: 300, width: 60, height: 15, axis: "y", min: 180, max: 300, speed: 1.0 },
      { x: 460, y: 170, width: 90, height: 15 },
      { x: 600, y: 200, width: 60, height: 15, crumble: true },
      { x: 700, y: 230, width: 90, height: 15 }
    ],
    coins: [
      { x: 120, y: 300 },
      { x: 240, y: 280 },
      { x: 485, y: 140 },
      { x: 620, y: 170 },
      { x: 745, y: 170 }
    ],
    spikes: spikeRow(130, 22),
    enemies: [
      // wróg patroluje ostatnią platformę (y = 200, bo platforma jest na 230, a wróg ma 30 wysokości)
      { minX: 710, maxX: 750, y: 200, speed: 1.2 }
    ]
  }
];

// ===== KLAWISZE =====
// Obiekt, w którym zapamiętujemy, które klawisze są teraz wciśnięte
const keys = {};

// Gdy naciśniesz klawisz: zapisujemy, że jest wciśnięty
document.addEventListener("keydown", function (event) {
  keys[event.code] = true;
  // Spacja i strzałki normalnie przewijają stronę, więc to blokujemy
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
    event.preventDefault();
  }
});

// Gdy puścisz klawisz: zapisujemy, że już nie jest wciśnięty
document.addEventListener("keyup", function (event) {
  keys[event.code] = false;
});

// ===== FUNKCJE POMOCNICZE =====
// Sprawdza, czy dwa prostokąty (a i b) na siebie nachodzą. Zwraca true albo false.
function isOverlapping(a, b) {
  return (
    a.x < b.x + b.width &&      // lewa krawędź a jest przed prawą krawędzią b
    a.x + a.width > b.x &&      // prawa krawędź a jest za lewą krawędzią b
    a.y < b.y + b.height &&     // góra a jest nad dołem b
    a.y + a.height > b.y        // dół a jest pod górą b
  );
}

// Rysuje wypełnione koło o środku (x, y) i podanym promieniu
function drawCircle(x, y, radius) {
  ctx.beginPath();                            // zaczynamy nowy kształt
  ctx.arc(x, y, radius, 0, Math.PI * 2);      // pełny okrąg (od 0 do 2π)
  ctx.fill();                                 // wypełniamy aktualnym kolorem
}

// ===== POZIOMY =====
// Ładuje poziom o numerze index: wstawia do gry jego platformy, monety, kolce i wrogów
function loadLevel(index) {
  const level = levels[index];   // dane wybranego poziomu

  // Tworzymy KOPIE platform (bo ruchome platformy zmieniają pozycję, a nie chcemy psuć oryginalnych danych)
  platforms = level.platforms.map(function (platform) {
    return {
      x: platform.x,
      y: platform.y,
      width: platform.width,
      height: platform.height,
      axis: platform.axis,         // "x", "y" albo brak (platforma stoi)
      min: platform.min,           // skrajna pozycja trasy
      max: platform.max,           // druga skrajna pozycja trasy
      speed: platform.speed,       // prędkość
      direction: 1,                // kierunek jazdy: 1 lub -1
      dx: 0,                       // ile platforma przesunęła się w poziomie w tej klatce
      dy: 0,                       // ile przesunęła się w pionie w tej klatce
      crumble: platform.crumble,   // czy platforma się kruszy (true albo brak)
      touched: false,              // czy gracz już na niej stanął
      gone: false,                 // czy platforma właśnie zniknęła
      timer: 0                     // licznik klatek od chwili, gdy gracz stanął
    };
  });
  spikes = level.spikes;           // kolce się nie ruszają, więc bierzemy je wprost
  // Monety: kopie z rozmiarem 20 x 20 i znacznikiem, że jeszcze nie zebrane
  coins = level.coins.map(function (coin) {
    return { x: coin.x, y: coin.y, width: 20, height: 20, collected: false };
  });
  // Wrogowie: kopie z rozmiarem 30 x 30, startują z lewego końca trasy, żyją
  enemies = level.enemies.map(function (enemy) {
    return {
      x: enemy.minX,
      y: enemy.y,
      width: 30,
      height: 30,
      speed: enemy.speed,
      minX: enemy.minX,
      maxX: enemy.maxX,
      direction: 1,          // na początku idzie w prawo
      alive: true            // żyje
    };
  });

  // Pozycja startowa gracza na początku każdego poziomu
  player.x = 50;
  player.y = 300;
  player.velocityX = 0;          // zerujemy prędkości, żeby nie "dojechał" z poprzedniego poziomu
  player.velocityY = 0;
  player.standingOn = null;      // na starcie nie stoi na żadnej platformie
}

// Przechodzi do następnego poziomu (albo kończy grę wygraną, jeśli to był ostatni)
function nextLevel() {
  const savedUnlockedLevel = Number(localStorage.getItem("unlockedLevel"));
  const unlockedLevel = Number.isInteger(savedUnlockedLevel) && savedUnlockedLevel >= 1 && savedUnlockedLevel <= levels.length
    ? savedUnlockedLevel
    : 1;
  const nextUnlockedLevel = Math.min(levels.length, Math.max(unlockedLevel, currentLevel + 2));
  localStorage.setItem("unlockedLevel", String(nextUnlockedLevel));

  if (currentLevel + 1 >= levels.length) {
    gameWon = true;                  // nie ma więcej poziomów -> wygrana
  } else {
    currentLevel++;                  // następny numer poziomu
    loadLevel(currentLevel);         // ładujemy go
  }
}

// Zaczyna grę od nowa
function restartGame() {
  score = 0;             // zerujemy punkty
  gameOver = false;      // zdejmujemy ekran przegranej
  gameWon = false;       // i ekran wygranej
  currentLevel = startingLevel;
  loadLevel(startingLevel);
}

// Zapisuje najlepszy wynik, jeśli ten jest lepszy od poprzedniego rekordu
function saveBestScore() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);   // zapis w przeglądarce, żeby został po odświeżeniu
  }
}

// ===== AKTUALIZACJA =====
// Ruch gracza w lewo i w prawo (z rozpędzaniem, hamowaniem i kolizjami z bokami platform)
function movePlayerHorizontally() {
  if (keys["ArrowLeft"] || keys["KeyA"]) {
    player.velocityX -= player.acceleration;   // rozpędzamy się w lewo
    player.facing = -1;                        // postać patrzy w lewo
  }
  if (keys["ArrowRight"] || keys["KeyD"]) {
    player.velocityX += player.acceleration;   // rozpędzamy się w prawo
    player.facing = 1;                         // postać patrzy w prawo
  }

  player.velocityX *= player.friction;   // tarcie: prędkość z każdą klatką maleje
  player.x += player.velocityX;          // przesuwamy postać o aktualną prędkość

  // ściany ekranu
  if (player.x < 0) {                                   // za daleko w lewo
    player.x = 0;
    player.velocityX = 0;
  }
  if (player.x + player.width > canvas.width) {         // za daleko w prawo (liczymy prawą krawędź)
    player.x = canvas.width - player.width;
    player.velocityX = 0;
  }

  // kolizje poziome z platformami
  for (const platform of platforms) {
    if (!platform.gone && isOverlapping(player, platform)) {
      if (player.velocityX > 0) {
        player.x = platform.x - player.width;            // szliśmy w prawo: stajemy przy lewej krawędzi platformy
      } else if (player.velocityX < 0) {
        player.x = platform.x + platform.width;          // szliśmy w lewo: stajemy przy prawej krawędzi platformy
      }
      player.velocityX = 0;                              // zatrzymujemy się
    }
  }
}

// Ruch gracza w górę i w dół: skok, grawitacja, podłoga i lądowanie na platformach
function movePlayerVertically() {
  // skok: tylko gdy naciśnięta spacja albo strzałka w górę ORAZ postać stoi na podłożu
  if ((keys["Space"] || keys["ArrowUp"]) && player.onGround) {
    player.velocityY = player.jumpPower;       // nadajemy prędkość w górę
  }

  // grawitacja
  player.velocityY += player.gravity;          // prędkość w dół rośnie w każdej klatce
  if (player.velocityY > maxFallSpeed) {
    player.velocityY = maxFallSpeed;           // ale nie szybciej niż limit
  }
  player.y += player.velocityY;                // przesuwamy postać w pionie

  player.onGround = false;                     // zakładamy, że jest w powietrzu...
  player.standingOn = null;                    // ...i nie stoi na żadnej platformie

  // podłoga
  if (player.y + player.height >= groundY) {   // dolna krawędź postaci dotknęła podłogi
    player.y = groundY - player.height;        // ustawiamy ją równo na podłodze
    player.velocityY = 0;
    player.onGround = true;                    // stoi, więc może skakać
  }

  // kolizje pionowe z platformami
  for (const platform of platforms) {
    if (!platform.gone && isOverlapping(player, platform)) {
      if (player.velocityY > 0) {
        // spadaliśmy: lądujemy na górze platformy
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.onGround = true;
        player.standingOn = platform;          // zapamiętujemy, na której platformie stoimy
      } else if (player.velocityY < 0) {
        // lecieliśmy w górę: uderzamy głową w spód platformy
        player.y = platform.y + platform.height;
        player.velocityY = 0;
      }
    }
  }
}

// Ruch ruchomych platform
function movePlatforms() {
  for (const platform of platforms) {
    platform.dx = 0;                                   // na początku klatki: jeszcze się nie ruszyła
    platform.dy = 0;

    if (platform.axis === "x") {                       // platforma jeżdżąca w poziomie
      platform.dx = platform.speed * platform.direction;   // o ile się przesunie
      platform.x += platform.dx;                           // przesuwamy ją

      if (platform.x <= platform.min) {                // doszła do lewego końca trasy
        platform.dx += platform.min - platform.x;      // korygujemy przesunięcie (żeby gracz jechał dokładnie tyle samo)
        platform.x = platform.min;                     // ustawiamy równo na końcu
        platform.direction = 1;                        // zawracamy w prawo
      }
      if (platform.x >= platform.max) {                // doszła do prawego końca trasy
        platform.dx += platform.max - platform.x;
        platform.x = platform.max;
        platform.direction = -1;                       // zawracamy w lewo
      }
    }

    if (platform.axis === "y") {                       // platforma jeżdżąca w pionie (winda)
      platform.dy = platform.speed * platform.direction;
      platform.y += platform.dy;

      if (platform.y <= platform.min) {                // doszła do górnego końca trasy
        platform.dy += platform.min - platform.y;
        platform.y = platform.min;
        platform.direction = 1;                        // zawracamy w dół
      }
      if (platform.y >= platform.max) {                // doszła do dolnego końca trasy
        platform.dy += platform.max - platform.y;
        platform.y = platform.max;
        platform.direction = -1;                       // zawracamy w górę
      }
    }
  }
}

// Zabiera gracza razem z platformą, na której stoi
function carryPlayer() {
  if (player.standingOn) {
    player.x += player.standingOn.dx;    // gracz przesuwa się o tyle, o ile platforma w poziomie
    player.y += player.standingOn.dy;    // i o tyle, o ile w pionie
  }
}

// Ruch wrogów: chodzą tam i z powrotem między minX a maxX
function moveEnemies() {
  for (const enemy of enemies) {
    if (enemy.alive) {                                   // ruszamy tylko żywych
      enemy.x += enemy.speed * enemy.direction;          // krok w swoją stronę

      if (enemy.x <= enemy.minX) {                       // lewy koniec trasy
        enemy.x = enemy.minX;                            // ustawiamy równo na krawędzi
        enemy.direction = 1;                             // zawracamy w prawo
      }
      if (enemy.x >= enemy.maxX) {                       // prawy koniec trasy
        enemy.x = enemy.maxX;
        enemy.direction = -1;                            // zawracamy w lewo
      }
    }
  }
}

// Zbieranie monet
function collectCoins() {
  for (const coin of coins) {
    // jeśli moneta nie jest jeszcze zebrana i gracz jej dotyka
    if (!coin.collected && isOverlapping(player, coin)) {
      coin.collected = true;    // oznaczamy jako zebraną (przestaje się rysować i liczyć)
      score++;                  // +1 punkt
    }
  }
}

// Gdy gracz dotknie kolców, umiera i gra się kończy
function checkSpikes() {
  for (const spike of spikes) {
    if (isOverlapping(player, spike)) {
      gameOver = true;
    }
  }
}

// Zderzenie z wrogiem: skok na głowę zabija wroga, dotknięcie z boku zabija gracza
function checkEnemies() {
  for (const enemy of enemies) {
    if (enemy.alive && isOverlapping(player, enemy)) {
      // jak głęboko stopy gracza weszły w wroga
      const feetDepth = player.y + player.height - enemy.y;

      if (player.velocityY > 0 && feetDepth < 20) {
        // skok na głowę (gracz spada i uderzył w górną część wroga) -> wróg pokonany
        enemy.alive = false;
        player.velocityY = -8;      // odbicie w górę
        score += 2;                 // 2 punkty za wroga
      } else {
        // dotknięcie z boku -> koniec gry
        gameOver = true;
      }
    }
  }
}

// Gdy wszystkie monety zostaną zebrane, przechodzimy na kolejny poziom
function checkLevelComplete() {
  // "every" sprawdza, czy KAŻDA moneta jest zebrana; warunek !gameOver = nie przechodzimy dalej, gdy właśnie zginąłeś
  if (!gameOver && coins.every(function (coin) { return coin.collected; })) {
    nextLevel();
  }
}

// Kruszące się platformy: gdy staniesz, po chwili znikają, a po kilku sekundach wracają
function updateCrumblingPlatforms() {
  for (const platform of platforms) {
    if (platform.crumble) {
      // gracz właśnie na niej stanął: uruchamiamy odliczanie
      if (!platform.touched && player.standingOn === platform) {
        platform.touched = true;
        platform.timer = 0;
      }

      if (platform.touched) {
        platform.timer++;                                    // liczymy klatki

        if (!platform.gone && platform.timer >= crumbleDelay) {
          platform.gone = true;                              // platforma znika
        }

        // po czasie wraca, ale nie wtedy, gdy gracz akurat jest w tym miejscu
        const timeToReturn = crumbleDelay + respawnDelay;
        if (platform.gone && platform.timer >= timeToReturn && !isOverlapping(player, platform)) {
          platform.gone = false;
          platform.touched = false;
          platform.timer = 0;
        }
      }
    }
  }
}

// Główna funkcja aktualizacji: wywoływana w każdej klatce, liczy co się dzieje w grze
function update() {
  // Po końcu gry klawisz R uruchamia grę od nowa
  if ((gameOver || gameWon) && keys["KeyR"]) {
    restartGame();
  }
  // Gdy gra się skończyła: zapisujemy rekord i nic więcej nie liczymy (wszystko stoi)
  if (gameOver || gameWon) {
    saveBestScore();
    return;
  }

  // Kolejność ma znaczenie: najpierw platformy i przenoszenie gracza, potem jego własny ruch
  movePlatforms();            // ruszamy platformy
  carryPlayer();              // platforma zabiera gracza
  movePlayerHorizontally();   // ruch w lewo i prawo
  movePlayerVertically();     // skok, grawitacja, lądowanie
  updateCrumblingPlatforms(); // kruszące się platformy
  moveEnemies();              // ruszamy wrogów
  collectCoins();             // zbieramy monety
  checkSpikes();              // sprawdzamy kolce
  checkEnemies();             // sprawdzamy wrogów
  checkLevelComplete();       // sprawdzamy, czy poziom ukończony
}

// ===== RYSOWANIE =====
// Niebo i chmury; motyw zmienia się co dwa poziomy
function drawBackground() {
  const theme = backgroundThemes[Math.floor(currentLevel / 2) % backgroundThemes.length];
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, theme.top);
  sky.addColorStop(1, theme.bottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (theme.stars) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    for (let i = 0; i < 32; i++) {
      const x = (i * 137 + 29) % canvas.width;
      const y = (i * 71 + 17) % (groundY - 40);
      drawCircle(x, y, i % 5 === 0 ? 2 : 1);
    }
  }

  ctx.fillStyle = theme.clouds;
  for (const cloud of clouds) {
    drawCircle(cloud.x, cloud.y, 22);
    drawCircle(cloud.x + 25, cloud.y - 8, 28);
    drawCircle(cloud.x + 55, cloud.y, 22);
  }
}

// Podłoga: brązowa ziemia z zielonym paskiem trawy na górze
function drawGround() {
  ctx.fillStyle = "#6b4f2a";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(0, groundY, canvas.width, 8);
}

// Platformy: zwykłe zielone, ruchome pomarańczowe, kruszące się piaskowe (drżą po wejściu)
function drawPlatforms() {
  for (const platform of platforms) {
    if (!platform.gone) {                                               // zniknięte platformy nie są rysowane
      const isMoving = platform.axis === "x" || platform.axis === "y";
      const shake = platform.touched ? (Math.random() - 0.5) * 4 : 0;   // drżenie po wejściu gracza

      let bodyColor = isMoving ? "#8a4b1f" : "#6b4f2a";
      let topColor = isMoving ? "#ff9f43" : "#4caf50";
      if (platform.crumble) {
        bodyColor = "#a8844f";
        topColor = "#e6cf8b";
      }

      ctx.fillStyle = bodyColor;
      ctx.fillRect(platform.x + shake, platform.y, platform.width, platform.height);
      ctx.fillStyle = topColor;
      ctx.fillRect(platform.x + shake, platform.y, platform.width, 5);
    }
  }
}

// Monety: złote koła, które lekko kołyszą się w górę i w dół
function drawCoins() {
  for (const coin of coins) {
    if (!coin.collected) {                                              // rysujemy tylko niezebrane
      const centerX = coin.x + coin.width / 2;                          // środek monety w poziomie
      // środek w pionie + kołysanie (sinus zmienia się w czasie, dlatego moneta "buja się")
      const centerY = coin.y + coin.height / 2 + Math.sin(Date.now() / 200 + coin.x) * 3;

      ctx.fillStyle = "#d4a017";                                        // ciemniejszy obrys
      drawCircle(centerX, centerY, 11);
      ctx.fillStyle = "gold";                                           // złoty środek
      drawCircle(centerX, centerY, 8);
      ctx.fillStyle = "#fff6b0";                                        // mały jasny połysk
      drawCircle(centerX - 3, centerY - 3, 2.5);
    }
  }
}

// Kolce: szare trójkąty
function drawSpikes() {
  ctx.fillStyle = "gray";
  for (const spike of spikes) {
    ctx.beginPath();                                                    // zaczynamy kształt
    ctx.moveTo(spike.x, spike.y + spike.height);                        // lewy dół
    ctx.lineTo(spike.x + spike.width / 2, spike.y);                     // czubek
    ctx.lineTo(spike.x + spike.width, spike.y + spike.height);          // prawy dół
    ctx.closePath();                                                    // zamykamy trójkąt
    ctx.fill();                                                         // wypełniamy
  }
}

// Wrogowie: fioletowe kwadraty z oczami
function drawEnemies() {
  for (const enemy of enemies) {
    if (enemy.alive) {                                                  // pokonanych nie rysujemy
      ctx.fillStyle = "#7b2d8e";
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);        // ciało

      // oczy (białka)
      ctx.fillStyle = "white";
      ctx.fillRect(enemy.x + 6, enemy.y + 7, 7, 7);
      ctx.fillRect(enemy.x + enemy.width - 13, enemy.y + 7, 7, 7);

      // źrenice patrzą w stronę ruchu
      const pupilOffset = enemy.direction === 1 ? 3 : 0;                // przesunięcie źrenic w prawo lub brak
      ctx.fillStyle = "black";
      ctx.fillRect(enemy.x + 6 + pupilOffset, enemy.y + 9, 4, 4);
      ctx.fillRect(enemy.x + enemy.width - 13 + pupilOffset, enemy.y + 9, 4, 4);
    }
  }
}

// Gracz: czerwony prostokąt z jednym okiem, które patrzy w stronę ruchu
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);        // ciało

  // pozycja oka zależy od tego, w którą stronę patrzy postać
  const eyeX = player.facing === 1 ? player.x + player.width - 14 : player.x + 6;
  ctx.fillStyle = "white";
  ctx.fillRect(eyeX, player.y + 10, 8, 8);                              // białko
  ctx.fillStyle = "black";
  ctx.fillRect(eyeX + (player.facing === 1 ? 4 : 0), player.y + 12, 4, 4);   // źrenica
}

// Panel z punktami, poziomem i rekordem oraz podpowiedź sterowania
function drawHud() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";                                 // półprzezroczyste czarne tło panelu
  ctx.fillRect(10, 10, 170, 96);
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText(t("points") + score, 22, 38);                            // "Punkty: ..."
  ctx.fillText(t("level") + (currentLevel + 1) + " / " + levels.length, 22, 64);   // "Poziom: x / 5"
  ctx.fillText(t("best") + bestScore, 22, 90);                          // "Rekord: ..."

  ctx.font = "16px Arial";
  ctx.fillText(t("controls"), 20, groundY + 32);                        // podpowiedź sterowania na ziemi
}

// Ciemna nakładka z dużym napisem (używana przy przegranej i wygranej)
function drawEndScreen(title, subtitle) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);                      // przyciemniamy cały ekran

  ctx.fillStyle = "white";
  ctx.textAlign = "center";                                             // tekst wyśrodkowany względem podanego x
  ctx.font = "40px Arial";
  ctx.fillText(title, canvas.width / 2, canvas.height / 2);             // duży tytuł na środku
  ctx.font = "20px Arial";
  ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 40);     // mniejszy podtytuł pod spodem
  ctx.textAlign = "left";                                               // przywracamy domyślne wyrównanie
}

// Rysuje całą klatkę: od tyłu do przodu (co narysujesz później, jest na wierzchu)
function draw() {
  drawBackground();
  drawGround();
  drawPlatforms();
  drawCoins();
  drawSpikes();
  drawEnemies();
  drawPlayer();
  drawHud();

  if (gameOver) {
    drawEndScreen(t("gameOverTitle"), t("gameOverHint"));
  }
  if (gameWon) {
    // w tekście podpowiedzi zamieniamy {score} na prawdziwy wynik
    drawEndScreen(t("wonTitle"), t("wonHint").replace("{score}", score));
  }
}

// ===== PĘTLA GRY =====
// Serce gry: w każdej klatce liczy, rysuje i prosi przeglądarkę o następną klatkę
function gameLoop() {
  update();                          // 1. policz, co się dzieje
  draw();                            // 2. narysuj
  requestAnimationFrame(gameLoop);   // 3. zaplanuj kolejną klatkę (zwykle 60 razy na sekundę)
}

// ===== START =====
// Kliknięcie przycisku języka: przełączamy PL <-> EN
langButton.addEventListener("click", function () {
  setLanguage(currentLanguage === "pl" ? "en" : "pl");
  langButton.blur();     // zdejmujemy z przycisku "aktywność", żeby spacja nie klikała go przy skokach
});

// Odczytujemy zapisany język i ustawiamy go (jeśli nic nie zapisano, zostaje polski)
const savedLanguage = localStorage.getItem("language");
setLanguage(savedLanguage === "en" ? "en" : "pl");

const requestedLevel = Number(new URLSearchParams(window.location.search).get("level"));
const savedUnlockedLevel = Number(localStorage.getItem("unlockedLevel"));
const unlockedLevel = Number.isInteger(savedUnlockedLevel) && savedUnlockedLevel >= 1 && savedUnlockedLevel <= levels.length
  ? savedUnlockedLevel
  : 1;
startingLevel = Number.isInteger(requestedLevel) && requestedLevel >= 1 && requestedLevel <= unlockedLevel
  ? requestedLevel - 1
  : new URLSearchParams(window.location.search).has("level")
    ? unlockedLevel - 1
    : 0;
currentLevel = startingLevel;
loadLevel(startingLevel);
gameLoop();     // uruchamiamy pętlę gry