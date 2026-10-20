// ===== USTAWIENIA =====
// Znajdujemy w HTML element <canvas> o id "game" (to nasze płótno)
const canvas = document.getElementById("game");
// "Pędzel" do rysowania w 2D na tym płótnie
const ctx = canvas.getContext("2d");
// Parametr URL uruchamia jednorazowe rysowanie planszy zamiast pełnej gry, gdy tworzymy miniaturę.
const isLevelThumbnail = new URLSearchParams(window.location.search).get("thumbnail") === "1";

// Wysokość podłogi: wszystko poniżej linii y = 400 to ziemia
const groundY = 400;
// Maksymalna prędkość spadania (piksele na klatkę), żeby postać nie przyspieszała w nieskończoność
const maxFallSpeed = 14;
// Kruszące się platformy: po ilu klatkach od wejścia znikają i po ilu wracają (60 klatek = 1 sekunda)
const crumbleDelay = 60;
const respawnDelay = 180;
// Przycisk zmiany języka z pliku game.html
const langButton = document.getElementById("lang-button");
// Link powrotu do menu; jego tekst zmienia się razem z językiem gry.
const menuButton = document.getElementById("menu-button");
const victoryScreen = document.getElementById("victory-screen"); // pobiera ukryte podsumowanie końcowe z dokumentu gry.
const victoryTitle = document.getElementById("victory-title"); // pobiera nagłówek ekranu zwycięstwa.
const victoryMessage = document.getElementById("victory-message"); // pobiera opis ukończenia wszystkich poziomów.
const victoryScore = document.getElementById("victory-score"); // pobiera miejsce na końcowy wynik.
const replayButton = document.getElementById("replay-button"); // pobiera przycisk rozpoczęcia całej gry od nowa.
const victoryMenuButton = document.getElementById("victory-menu-button"); // pobiera link powrotu do menu z ekranu zwycięstwa.
const completionTime = document.getElementById("completion-time"); // pobiera pole czasu przejścia ukończonego poziomu.
const completionCoins = document.getElementById("completion-coins"); // pobiera pole zebranych monet ukończonego poziomu.
const completionStars = document.getElementById("completion-stars"); // pobiera pole oceny gwiazdkowej ukończonego poziomu.
const completionLevelScore = document.getElementById("completion-level-score"); // pobiera pole punktów zdobytych na ukończonym poziomie.

// ===== TŁUMACZENIA =====
// Wszystkie napisy w grze, osobno dla każdego języka (pl = polski, en = angielski)
const translations = {
  pl: {
    points: "Punkty: ",
    level: "Poziom: ",
    best: "Rekord: ",
    timer: "Czas: ", // podpis licznika czasu aktualnego poziomu.
    controls: "A/D lub strzałki: ruch, spacja: skok",
    mainMenu: "Menu główne",
    touchControls: "Sterowanie dotykowe", // etykieta grupy przycisków dotykowych po polsku.
    moveLeft: "Ruch w lewo", // opis dostępności przycisku ruchu w lewo po polsku.
    moveRight: "Ruch w prawo", // opis dostępności przycisku ruchu w prawo po polsku.
    jump: "Skok", // opis dostępności przycisku skoku po polsku.
    victoryMessage: "Ukończyłeś wszystkie poziomy!", // gratuluje przejścia całej gry po polsku.
    levelCompleteTitle: "Poziom ukończony!", // tytuł podsumowania pojedynczego poziomu.
    levelCompleteMessage: "Świetna robota! Możesz przejść dalej albo wrócić do menu.", // opis po ukończeniu poziomu.
    completedTime: "Czas przejścia: ", // podpis czasu ukończonego poziomu.
    completedCoins: "Monety: ", // podpis zebranych monet.
    completedStars: "Zdobyte gwiazdki: ", // podpis oceny poziomu.
    completedLevelScore: "Punkty za poziom: ", // podpis punktów zdobytych na poziomie.
    nextLevel: "Następny poziom", // przechodzi do kolejnej planszy.
    finishReplay: "Zagraj ponownie", // rozpoczyna grę od początku po finale.
    victoryScore: "Wynik końcowy: ", // podpis sumy punktów po polsku.
    victoryPoints: " pkt", // skrót jednostki punktów na ekranie podsumowania.
    replay: "Zagraj ponownie", // opisuje przycisk ponownego przejścia gry po polsku.
    victoryMenu: "Wróć do menu", // opisuje przycisk powrotu do menu po polsku.
    gameOverTitle: "Koniec gry!",
    gameOverHint: "Naciśnij R, aby zagrać jeszcze raz",
    checkpointShort: "PK", // krótki napis na fladze punktu kontrolnego.
    checkpointReached: "Punkt kontrolny zapisany!", // informuje o aktywowaniu flagi.
    checkpointRespawn: "Powrót do punktu kontrolnego!", // informuje o odrodzeniu po błędzie.
    wonTitle: "Wygrałeś!" // tytuł wyświetlany po ukończeniu wszystkich poziomów.
  },
  en: {
    points: "Score: ",
    level: "Level: ",
    best: "Best: ",
    timer: "Time: ", // label for the current level timer.
    controls: "A/D or arrows: move, space: jump",
    mainMenu: "Main menu",
    touchControls: "Touch controls", // label for the touch-control group in English.
    moveLeft: "Move left", // accessible label for the left movement button.
    moveRight: "Move right", // accessible label for the right movement button.
    jump: "Jump", // accessible label for the jump button.
    victoryMessage: "You completed every level!", // congratulates the player for finishing the game.
    levelCompleteTitle: "Level complete!", // title shown after finishing an individual level.
    levelCompleteMessage: "Great job! Continue to the next level or return to the menu.", // message shown after a level.
    completedTime: "Completion time: ", // label for the completed level time.
    completedCoins: "Coins: ", // label for coins collected on the level.
    completedStars: "Stars earned: ", // label for the level rating.
    completedLevelScore: "Level score: ", // label for points earned on this level.
    nextLevel: "Next level", // starts the next level.
    finishReplay: "Play again", // starts over after the final level.
    victoryScore: "Final score: ", // labels the total score in English.
    victoryPoints: " pts", // score unit shown on the completion screen.
    replay: "Play again", // labels the button that starts a new full playthrough.
    victoryMenu: "Return to menu", // labels the button that returns to the main menu.
    gameOverTitle: "Game over!",
    gameOverHint: "Press R to play again",
    checkpointShort: "CP", // krótki angielski napis na fladze punktu kontrolnego.
    checkpointReached: "Checkpoint saved!", // informs the player that the flag is active.
    checkpointRespawn: "Back at the checkpoint!", // informs the player after respawning.
    wonTitle: "You win!" // title shown after completing every level.
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
  document.querySelector(".touch-controls").setAttribute("aria-label", t("touchControls")); // tłumaczy opis grupy przycisków dotykowych.
  document.getElementById("touch-left").setAttribute("aria-label", t("moveLeft")); // tłumaczy opis przycisku ruchu w lewo.
  document.getElementById("touch-right").setAttribute("aria-label", t("moveRight")); // tłumaczy opis przycisku ruchu w prawo.
  document.getElementById("touch-jump").setAttribute("aria-label", t("jump")); // tłumaczy opis przycisku skoku.
  victoryTitle.textContent = t("wonTitle"); // ustawia przetłumaczony tytuł zwycięstwa.
  victoryMessage.textContent = t("victoryMessage"); // ustawia przetłumaczone gratulacje ukończenia gry.
  victoryScore.textContent = t("victoryScore") + score + t("victoryPoints"); // pokazuje wynik bieżącej rozgrywki w aktualnym języku.
  replayButton.textContent = t("replay"); // tłumaczy przycisk rozpoczęcia gry od początku.
  victoryMenuButton.textContent = t("victoryMenu"); // tłumaczy przycisk powrotu do menu.
  if (levelComplete && !victoryScreen.hidden) { // odświeża napisy podsumowania, jeśli język zmienił się po przejściu poziomu.
    renderLevelCompletion(); // ponownie pokazuje statystyki w wybranym języku.
  } // kończy aktualizowanie napisów podsumowania.
}

// ===== DANE GRY =====
const playerColors = { // ogranicza wybór koloru do bezpiecznych wartości z menu wyglądu.
  "#e94b4b": "#e94b4b", // domyślny czerwony kolor postaci.
  "#3988e8": "#3988e8", // dostępny niebieski kolor postaci.
  "#38a86b": "#38a86b", // dostępny zielony kolor postaci.
  "#a65be0": "#a65be0", // dostępny fioletowy kolor postaci.
  "#f08a32": "#f08a32" // dostępny pomarańczowy kolor postaci.
}; // kończy listę dozwolonych kolorów bohatera.
const savedPlayerColor = localStorage.getItem("playerColor"); // pobiera ostatnio wybrany kolor bohatera.
// Gracz: jeden obiekt, który trzyma wszystko o postaci
const player = {
  x: 50,               // pozycja w poziomie (lewa krawędź)
  y: 300,              // pozycja w pionie (górna krawędź)
  width: 40,           // szerokość postaci
  height: 50,          // wysokość postaci
  color: Object.prototype.hasOwnProperty.call(playerColors, savedPlayerColor) ? playerColors[savedPlayerColor] : "#e94b4b", // używa zapisanego koloru lub bezpiecznej wartości domyślnej.
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
// Zapamiętany poziom startowy, do którego wraca klawisz R po końcu gry.
let startingLevel = 0;
let levelStartingScore = 0; // wynik na początku poziomu pozwala policzyć punkty zdobyte tylko na nim.
let levelStartedAt = performance.now(); // mierzy czas poziomu, aby przyznać dodatkowe gwiazdki za szybkość.
let levelComplete = false; // zatrzymuje grę i otwiera podsumowanie ukończonego poziomu.
let completedLevelTime = 0; // przechowuje czas właśnie ukończonego poziomu w sekundach.
let completedLevelStars = 0; // przechowuje liczbę gwiazdek w podsumowaniu poziomu.
let completedLevelCoins = 0; // przechowuje liczbę zebranych monet w podsumowaniu poziomu.
let completedLevelScore = 0; // przechowuje punkty zdobyte w ukończonym poziomie.
let gameOver = false;  // czy gracz przegrał
let gameWon = false;   // czy gracz wygrał całą grę
let checkpoint = null; // aktywny punkt kontrolny bieżącego poziomu albo null, gdy go nie ma.
let checkpointNoticeTimer = 0; // liczba klatek, przez które pokazujemy komunikat o punkcie kontrolnym.
let checkpointNoticeText = ""; // tekst ostatniego komunikatu o punkcie kontrolnym.

// Współrzędne chmur na niebie (tylko ozdoba)
const clouds = [
  { x: 120, y: 70 },
  { x: 420, y: 110 },
  { x: 680, y: 60 }
];

// Zestawy kolorów tła; poziomy korzystają z nich po kolei, po dwa poziomy na motyw.
const backgroundThemes = [
  { top: "#4a90d9", bottom: "#bfe4ff", clouds: "rgba(255, 255, 255, 0.8)" },
  { top: "#e97962", bottom: "#ffd59a", clouds: "rgba(255, 245, 220, 0.8)" },
  { top: "#342b67", bottom: "#8273b5", clouds: "rgba(230, 225, 255, 0.75)", stars: true },
  { top: "#329b87", bottom: "#b8e6bd", clouds: "rgba(240, 255, 245, 0.8)" }
];
const backgroundThemeStorageKey = "backgroundTheme"; // klucz ustawienia motywu wybranego w menu.
let backgroundThemeOffset = Number(localStorage.getItem(backgroundThemeStorageKey)); // odczytuje numer motywu początkowego z pamięci.
backgroundThemeOffset = Number.isInteger(backgroundThemeOffset) && backgroundThemeOffset >= 0 && backgroundThemeOffset < backgroundThemes.length ? backgroundThemeOffset : 0; // przywraca domyślny motyw, gdy zapis jest nieprawidłowy.

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
    ], // zamyka listę wrogów poziomu przed definicją punktu kontrolnego.
    checkpoint: { x: 710, y: 140 } // bezpieczne miejsce odrodzenia na ostatniej platformie poziomu.
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
    ], // zamyka listę wrogów poziomu przed definicją punktu kontrolnego.
    checkpoint: { x: 710, y: 125 } // bezpieczne miejsce odrodzenia na ostatniej platformie poziomu.
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
    enemies: [],                 // na tym poziomie nie ma wrogów.
    checkpoint: { x: 580, y: 240 } // bezpieczne miejsce odrodzenia na końcowej platformie.
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
    ], // zamyka listę wrogów poziomu przed definicją punktu kontrolnego.
    checkpoint: { x: 590, y: 180 } // bezpieczne miejsce odrodzenia na stałej platformie.
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
    ], // zamyka listę wrogów poziomu przed definicją punktu kontrolnego.
    checkpoint: { x: 670, y: 150 } // miejsce odrodzenia po lewej stronie przeciwnika i monety.
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
    enemies: [], // na tym poziomie nie ma wrogów.
    checkpoint: { x: 670, y: 170 } // bezpieczne miejsce odrodzenia na ostatniej platformie.
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
    enemies: [], // na tym poziomie nie ma wrogów.
    checkpoint: { x: 730, y: 170 } // bezpieczne miejsce odrodzenia na ostatniej platformie.
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
    ], // zamyka listę wrogów poziomu przed definicją punktu kontrolnego.
    checkpoint: { x: 510, y: 120 } // bezpieczne miejsce odrodzenia przed przeciwnikiem finałowego poziomu.
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

// Łączy przytrzymanie ekranowego przycisku z odpowiednim klawiszem gry.
function bindTouchButton(buttonId, keyCode) { // podpina dotykowy przycisk do istniejącego systemu sterowania.
  const button = document.getElementById(buttonId); // pobiera przycisk z dokumentu HTML.
  button.addEventListener("pointerdown", function (event) { // rozpoczyna ruch lub skok po dotknięciu przycisku.
    event.preventDefault(); // zapobiega zaznaczaniu strony i gestom przeglądarki podczas gry.
    keys[keyCode] = true; // zgłasza wciśnięty klawisz do logiki gry.
    button.setPointerCapture(event.pointerId); // utrzymuje śledzenie dotyku, nawet gdy palec zsunie się z przycisku.
  }); // kończy obsługę naciśnięcia przycisku dotykowego.
  for (const eventName of ["pointerup", "pointercancel", "lostpointercapture"]) { // obsługuje zwykłe puszczenie i przerwanie dotyku.
    button.addEventListener(eventName, function (event) { // kończy ruch lub skok po puszczeniu palca.
      event.preventDefault(); // blokuje domyślne działanie przeglądarki na przycisku.
      keys[keyCode] = false; // zwalnia klawisz, aby postać nie poruszała się dalej.
    }); // kończy obsługę zwolnienia przycisku dotykowego.
  } // kończy rejestrację zdarzeń kończących dotyk.
} // kończy konfigurację pojedynczego przycisku dotykowego.

bindTouchButton("touch-left", "KeyA"); // przypisuje lewy przycisk ekranowy do ruchu w lewo.
bindTouchButton("touch-right", "KeyD"); // przypisuje prawy przycisk ekranowy do ruchu w prawo.
bindTouchButton("touch-jump", "Space"); // przypisuje przycisk skoku do spacji.

window.addEventListener("blur", function () { // czyści sterowanie, gdy użytkownik przełączy kartę lub aplikację.
  for (const keyCode of Object.keys(keys)) { // przechodzi po wszystkich zapamiętanych klawiszach.
    keys[keyCode] = false; // zwalnia klawisze, by ruch nie pozostał zablokowany po powrocie.
  } // kończy zwalnianie zapamiętanych klawiszy.
}); // kończy obsługę utraty fokusu okna gry.

window.addEventListener("storage", function (event) { // aktualizuje wygląd gry, gdy ustawienie zmieni się w innym oknie.
  if (event.key === "playerColor") { // reaguje wyłącznie na zmianę koloru postaci.
    player.color = Object.prototype.hasOwnProperty.call(playerColors, event.newValue) ? playerColors[event.newValue] : "#e94b4b"; // przyjmuje tylko dozwolony kolor albo wraca do czerwieni.
  } // kończy aktualizowanie koloru postaci.
  if (event.key === backgroundThemeStorageKey) { // reaguje wyłącznie na zmianę motywu tła.
    const selectedTheme = Number(event.newValue); // zamienia zapisany numer motywu na liczbę.
    backgroundThemeOffset = Number.isInteger(selectedTheme) && selectedTheme >= 0 && selectedTheme < backgroundThemes.length ? selectedTheme : 0; // waliduje numer albo ustawia motyw domyślny.
  } // kończy aktualizowanie motywu tła.
}); // kończy synchronizację wyglądu między kartami.

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

  checkpoint = level.checkpoint // pobiera punkt kontrolny zaprojektowany dla bieżącego poziomu.
    ? { x: level.checkpoint.x, y: level.checkpoint.y, activated: false } // kopiuje współrzędne i rozpoczyna go jako nieaktywny.
    : null; // pozostawia poziom bez punktu kontrolnego, jeśli nie został skonfigurowany.
  checkpointNoticeTimer = 0; // usuwa komunikat poprzedniego poziomu.
  checkpointNoticeText = ""; // czyści tekst poprzedniego komunikatu.

  // Pozycja startowa gracza na początku każdego poziomu
  player.x = 50;
  player.y = 300;
  player.velocityX = 0;          // zerujemy prędkości, żeby nie "dojechał" z poprzedniego poziomu
  player.velocityY = 0;
  player.standingOn = null;      // na starcie nie stoi na żadnej platformie
  levelStartingScore = score;    // zapisujemy wynik wejściowy, aby później wyliczyć rekord tego poziomu.
  levelStartedAt = performance.now(); // rozpoczyna pomiar czasu bieżącego poziomu.
}

// Przechodzi do następnego poziomu (albo kończy grę wygraną, jeśli to był ostatni)
function nextLevel() {
  const completedLevel = currentLevel + 1; // zamienia indeks zaczynający się od zera na numer poziomu dla pamięci.
  const levelScore = score - levelStartingScore; // oblicza punkty zdobyte od rozpoczęcia właśnie ukończonego poziomu.
  const elapsedSeconds = (performance.now() - levelStartedAt) / 1000; // oblicza czas przejścia poziomu w sekundach.
  const coinStar = coins.every(function (coin) { return coin.collected; }) ? 1 : 0; // przyznaje gwiazdkę za zebranie wszystkich monet.
  const speedStars = elapsedSeconds <= 15 ? 2 : elapsedSeconds <= 40 ? 1 : 0; // przyznaje dodatkowe gwiazdki za szybkie ukończenie.
  const earnedStars = Math.min(3, coinStar + speedStars); // ogranicza ocenę do maksymalnie trzech gwiazdek.
  completedLevelTime = elapsedSeconds; // zachowuje czas do podsumowania ukończonego poziomu.
  completedLevelStars = earnedStars; // zachowuje gwiazdki zdobyte w tej próbie.
  completedLevelCoins = coins.filter(function (coin) { return coin.collected; }).length; // zlicza zebrane monety przed pokazaniem podsumowania.
  completedLevelScore = levelScore; // zachowuje punkty zdobyte w bieżącym poziomie.
  const levelStarsKey = "levelStars_" + completedLevel; // tworzy osobny klucz pamięci dla gwiazdek poziomu.
  const previousStars = Number(localStorage.getItem(levelStarsKey)); // odczytuje poprzednio zdobyte gwiazdki.
  const bestStars = Number.isInteger(previousStars) && previousStars >= 0 && previousStars <= 3 ? Math.max(previousStars, earnedStars) : earnedStars; // zachowuje najlepszą ocenę bez jej obniżania.
  localStorage.setItem(levelStarsKey, String(bestStars)); // zapisuje najlepszą ocenę poziomu w przeglądarce.
  const levelBestTimeKey = "levelBestTime_" + completedLevel; // tworzy osobny klucz dla najlepszego czasu poziomu.
  const savedLevelBestTime = localStorage.getItem(levelBestTimeKey); // odczytuje poprzedni najlepszy czas z pamięci.
  const previousLevelBestTime = Number(savedLevelBestTime); // zamienia poprzedni czas tekstowy na liczbę sekund.
  if (savedLevelBestTime === null || !Number.isFinite(previousLevelBestTime) || previousLevelBestTime <= 0 || elapsedSeconds < previousLevelBestTime) { // zachowuje pierwszy lub szybszy poprawny czas ukończenia.
    localStorage.setItem(levelBestTimeKey, String(elapsedSeconds)); // zapisuje najszybszy czas przejścia tego poziomu.
  } // kończy aktualizowanie rekordu czasu poziomu.
  const levelBestScoreKey = "levelBestScore_" + completedLevel; // tworzy osobny klucz localStorage dla rekordu poziomu.
  const savedLevelBestScore = localStorage.getItem(levelBestScoreKey); // odczytuje poprzedni zapis rekordu, aby wykryć jego brak.
  const previousLevelBestScore = Number(savedLevelBestScore); // zamienia zapis tekstowy na liczbę do porównania.
  if (savedLevelBestScore === null || !Number.isFinite(previousLevelBestScore) || levelScore > previousLevelBestScore) { // zapisuje wynik, gdy rekordu brakuje, jest błędny lub nowy wynik jest lepszy.
    localStorage.setItem(levelBestScoreKey, String(levelScore)); // zachowuje najlepszy wynik w tym konkretnym poziomie.
  } // zamyka warunek aktualizowania rekordu.
  localStorage.setItem("levelCoins_" + completedLevel, String(coins.length)); // zapisuje liczbę monet zebraną przy ukończeniu poziomu.

  // Odczytuje dotychczasowy postęp i naprawia go, jeśli zapis jest nieprawidłowy.
  const savedUnlockedLevel = Number(localStorage.getItem("unlockedLevel"));
  const unlockedLevel = Number.isInteger(savedUnlockedLevel) && savedUnlockedLevel >= 1 && savedUnlockedLevel <= levels.length
    ? savedUnlockedLevel
    : 1;
  // Odblokowuje następny poziom, nie cofając postępu zdobytego wcześniej.
  const nextUnlockedLevel = Math.min(levels.length, Math.max(unlockedLevel, currentLevel + 2));
  localStorage.setItem("unlockedLevel", String(nextUnlockedLevel));

  if (currentLevel + 1 >= levels.length) {
    gameWon = true;                  // nie ma więcej poziomów -> wygrana
  }
  levelComplete = true; // wstrzymuje planszę do chwili wybrania kolejnej akcji.
}

// Zamienia czas w sekundach na czytelny zapis minut i sekund.
function formatElapsedTime(totalSeconds) { // formatuje licznik i podsumowanie poziomu.
  const wholeSeconds = Math.floor(Math.max(0, totalSeconds)); // usuwa ułamki sekund i zabezpiecza przed ujemnym czasem.
  const minutes = Math.floor(wholeSeconds / 60); // oblicza pełne minuty.
  const seconds = String(wholeSeconds % 60).padStart(2, "0"); // zapisuje sekundy zawsze na dwóch pozycjach.
  return minutes + ":" + seconds; // zwraca czas w formacie mm:ss.
} // kończy formatowanie czasu gry.

// Wypełnia ekran podsumowania tekstami i statystykami w aktualnym języku.
function renderLevelCompletion() { // aktualizuje podsumowanie po ukończeniu poziomu.
  const isFinalLevel = currentLevel === levels.length - 1; // sprawdza, czy właśnie ukończono ostatni poziom.
  victoryTitle.textContent = isFinalLevel ? t("wonTitle") : t("levelCompleteTitle"); // dobiera tytuł zwykłego ukończenia albo finału.
  victoryMessage.textContent = isFinalLevel ? t("victoryMessage") : t("levelCompleteMessage"); // pokazuje informację o kolejnym poziomie lub finale.
  completionTime.textContent = t("completedTime") + formatElapsedTime(completedLevelTime); // pokazuje czas ostatniego przejścia.
  completionCoins.textContent = t("completedCoins") + completedLevelCoins + "/" + coins.length; // pokazuje zebrane monety względem całej planszy.
  completionStars.textContent = t("completedStars") + "★".repeat(completedLevelStars) + "☆".repeat(3 - completedLevelStars); // pokazuje zdobyte oraz niezdobyte gwiazdki.
  completionLevelScore.textContent = t("completedLevelScore") + completedLevelScore + t("victoryPoints"); // pokazuje punkty zdobyte tylko w tym poziomie.
  victoryScore.textContent = t("victoryScore") + score + t("victoryPoints"); // przygotowuje także łączny wynik całej gry.
  victoryScore.hidden = !isFinalLevel; // pokazuje wynik całej gry tylko na ekranie finałowym.
  replayButton.textContent = isFinalLevel ? t("finishReplay") : t("nextLevel"); // wybiera przycisk następnego poziomu lub ponownej gry.
} // kończy aktualizowanie ekranu podsumowania.

// Kontynuuje rozgrywkę po zamknięciu podsumowania bieżącego poziomu.
function continueAfterLevel() { // uruchamia kolejny poziom albo zaczyna grę od początku po finale.
  victoryScreen.hidden = true; // chowa podsumowanie przed wznowieniem gry.
  levelComplete = false; // odblokowuje aktualizowanie gry.
  if (gameWon) { // po ostatnim poziomie przycisk główny rozpoczyna nową grę.
    replayFromBeginning(); // zaczyna od pierwszego poziomu, nie kasując odblokowań.
    return; // nie próbuje wczytać poziomu poza końcem listy.
  } // kończy obsługę finału.
  currentLevel++; // wybiera następny poziom po zakończonym.
  loadLevel(currentLevel); // wczytuje następną planszę i zeruje jej licznik czasu.
}

// Zaczyna grę od nowa
function restartGame() {
  score = 0;             // zerujemy punkty
  gameOver = false;      // zdejmujemy ekran przegranej
  gameWon = false;       // i ekran wygranej
  levelComplete = false; // usuwa ekran podsumowania przed ponowną próbą.
  victoryScreen.hidden = true; // ukrywa podsumowanie przed ponowną próbą na bieżącym poziomie.
  loadLevel(currentLevel); // po śmierci uruchamia ponownie poziom, na którym gracz właśnie grał.
}

// Uruchamia pełną rozgrywkę od pierwszego poziomu bez kasowania zapisanego postępu.
function replayFromBeginning() { // rozpoczyna nową próbę przejścia całej gry.
  score = 0; // zeruje punkty tylko dla nowej próby.
  gameOver = false; // usuwa stan przegranej.
  gameWon = false; // usuwa stan zwycięstwa.
  levelComplete = false; // usuwa stan ukończenia poziomu przed nową grą.
  startingLevel = 0; // ustawia pierwszy poziom jako punkt startowy także dla klawisza R.
  currentLevel = 0; // wybiera pierwszy poziom gry.
  victoryScreen.hidden = true; // chowa ekran podsumowania przed ponowną grą.
  loadLevel(0); // wczytuje planszę pierwszego poziomu.
} // kończy ponowne rozpoczynanie całej gry.

// Zapisuje najlepszy wynik, jeśli ten jest lepszy od poprzedniego rekordu
function saveBestScore() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);   // zapis w przeglądarce, żeby został po odświeżeniu
  }
}

// Odradza gracza przy fladze, zachowując zdobyte monety i punkty.
function respawnAtCheckpoint() { // odtwarza gracza przy aktywnej fladze po śmierci.
  const collectedCoinIndexes = coins // rozpoczyna odczyt monet zebranych przed śmiercią.
    .map(function (coin, index) { return coin.collected ? index : -1; }) // zapamiętuje indeks każdej zebranej monety.
    .filter(function (index) { return index !== -1; }); // pomija indeksy monet, których gracz jeszcze nie zebrał.
  const savedScore = score; // zachowuje punkty zdobyte przed odrodzeniem.
  const savedLevelStartingScore = levelStartingScore; // zachowuje bazę do obliczenia rekordu bieżącego poziomu.
  loadLevel(currentLevel); // odtwarza przeszkody, wrogów i platformy w ich początkowym stanie.
  for (const coinIndex of collectedCoinIndexes) { // przechodzi po monetach zebranych przed śmiercią.
    coins[coinIndex].collected = true; // nie każe graczowi ponownie zbierać zachowanej monety.
  } // kończy przywracanie zebranych monet.
  score = savedScore; // przywraca zachowany wynik po ponownym załadowaniu poziomu.
  levelStartingScore = savedLevelStartingScore; // zachowuje prawidłowe liczenie punktów w tym poziomie.
  checkpoint.activated = true; // utrzymuje flagę jako aktywną po odtworzeniu poziomu.
  player.x = checkpoint.x; // ustawia postać w poziomym miejscu punktu kontrolnego.
  player.y = checkpoint.y; // ustawia postać na platformie przypisanej do punktu kontrolnego.
  player.velocityX = 0; // zatrzymuje ruch poziomy po odrodzeniu.
  player.velocityY = 0; // zatrzymuje spadanie po odrodzeniu.
  player.onGround = true; // pozwala od razu skoczyć z bezpiecznej platformy.
  player.standingOn = platforms.find(function (platform) { // wyszukuje platformę pod odrodzoną postacią.
    return !platform.gone && player.x + player.width > platform.x && player.x < platform.x + platform.width && Math.abs(player.y + player.height - platform.y) < 1; // wybiera widoczną platformę dokładnie pod stopami.
  }) || null; // nie przypisuje platformy, jeśli pod postacią jej nie znaleziono.
  gameOver = false; // wznawia grę zamiast wyświetlać ekran końca.
  checkpointNoticeText = t("checkpointRespawn"); // wybiera komunikat o powrocie w aktualnym języku.
  checkpointNoticeTimer = 120; // pokazuje komunikat przez około dwie sekundy.
} // kończy procedurę odrodzenia przy punkcie kontrolnym.

// ===== AKTUALIZACJA =====
// Ruch gracza w lewo i w prawo (z rozpędzaniem, hamowaniem i kolizjami z bokami platform)
function movePlayerHorizontally() {
  // Każdy kierunek można wybrać strzałką albo klawiszem A/D.
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

// Aktywuje flagę, gdy gracz dotknie jej po raz pierwszy.
function checkCheckpoint() { // wykrywa dotknięcie flagi i aktywuje punkt kontrolny.
  if (checkpoint && !checkpoint.activated) { // sprawdza tylko istniejący i jeszcze nieaktywny punkt kontrolny.
    const trigger = { x: checkpoint.x - 8, y: checkpoint.y - 8, width: player.width + 16, height: player.height + 16 }; // tworzy nieco większą strefę, aby łatwo dotknąć flagi.
    if (isOverlapping(player, trigger)) { // wykrywa wejście gracza w strefę flagi.
      checkpoint.activated = true; // oznacza punkt kontrolny jako aktywny.
      checkpointNoticeText = t("checkpointReached"); // ustawia komunikat w aktualnym języku.
      checkpointNoticeTimer = 120; // wyświetla potwierdzenie przez około dwie sekundy.
    } // kończy sprawdzanie kontaktu z flagą.
  } // kończy sprawdzanie dostępności punktu kontrolnego.
} // kończy obsługę aktywowania flagi.

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
  if (gameOver && checkpoint && checkpoint.activated) { // sprawdza, czy śmierć nastąpiła po aktywowaniu punktu kontrolnego.
    respawnAtCheckpoint(); // odradza postać zamiast kończyć grę.
  } // kończy obsługę automatycznego odrodzenia.
  // Po końcu gry klawisz R uruchamia grę od nowa
  if ((gameOver || levelComplete) && keys["KeyR"]) { // pozwala zacząć poziom od nowa także z ekranu podsumowania.
    restartGame();
  }
  // Po śmierci lub ukończeniu poziomu zapisujemy rekord i zatrzymujemy symulację.
  if (gameOver || levelComplete) {
    saveBestScore();
    if (levelComplete && !isLevelThumbnail && victoryScreen.hidden) { // pokazuje podsumowanie raz po ukończeniu poziomu w pełnej grze.
      renderLevelCompletion(); // wstawia czas, monety, punkty i gwiazdki do podsumowania.
      victoryScreen.hidden = false; // odsłania podsumowanie i akcje dla gracza.
      replayButton.focus(); // przenosi fokus na kontynuację lub ponowną grę.
    } // kończy jednorazowe pokazywanie podsumowania.
    return;
  }
  if (checkpointNoticeTimer > 0) { // odlicza czas wyświetlania informacji o punkcie kontrolnym.
    checkpointNoticeTimer--; // skraca komunikat o jedną klatkę.
  } // kończy odliczanie komunikatu.

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
  if (!gameOver) { // nie aktywuje checkpointu w tej samej chwili, gdy gracz zginął.
    checkCheckpoint(); // sprawdza, czy gracz dotknął flagi.
  } // kończy zabezpieczenie sprawdzania flagi.
  checkLevelComplete();       // sprawdzamy, czy poziom ukończony
}

// ===== RYSOWANIE =====
// Niebo i chmury; motyw zmienia się co dwa poziomy
function drawBackground() {
  // Math.floor grupuje poziomy parami; modulo powtarza motywy, gdy skończą się zestawy.
  const theme = backgroundThemes[(Math.floor(currentLevel / 2) + backgroundThemeOffset) % backgroundThemes.length]; // zmienia tła co dwa poziomy, zaczynając od motywu wybranego w menu.
  // Tworzy płynne przejście od koloru u góry do koloru u dołu ekranu.
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, theme.top);
  sky.addColorStop(1, theme.bottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (theme.stars) {
    // Wzory modulo rozkładają gwiazdy po niebie w stałych pozycjach.
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

// Rysuje flagę punktu kontrolnego, zmieniając jej kolor po aktywowaniu.
function drawCheckpoint() { // rysuje flagę wskazującą miejsce odrodzenia.
  if (checkpoint) { // rysuje flagę tylko na poziomie, który ma punkt kontrolny.
    ctx.fillStyle = "#f5f5f5"; // ustawia jasny kolor masztu flagi.
    ctx.fillRect(checkpoint.x - 8, checkpoint.y - 22, 4, 72); // rysuje maszt od góry flagi do powierzchni platformy.
    ctx.fillStyle = checkpoint.activated ? "#45d483" : "#ffcc00"; // aktywna flaga jest zielona, a nieaktywna złota.
    ctx.beginPath(); // rozpoczyna kształt materiału flagi.
    ctx.moveTo(checkpoint.x - 4, checkpoint.y - 22); // ustawia lewy górny narożnik flagi przy maszcie.
    ctx.lineTo(checkpoint.x + 24, checkpoint.y - 12); // tworzy wystający prawy górny narożnik flagi.
    ctx.lineTo(checkpoint.x - 4, checkpoint.y - 2); // tworzy dolny narożnik flagi.
    ctx.closePath(); // zamyka trójkątny kształt flagi.
    ctx.fill(); // wypełnia flagę wybranym kolorem.
    ctx.fillStyle = "#222"; // ustawia ciemny kolor krótkiego napisu na fladze.
    ctx.font = "bold 10px Arial"; // ustawia czytelną, małą czcionkę skrótu.
    ctx.fillText(t("checkpointShort"), checkpoint.x, checkpoint.y - 11); // umieszcza skrót językowy na fladze.
  } // kończy rysowanie flagi.
} // kończy funkcję rysowania punktu kontrolnego.

// Wyświetla krótkie potwierdzenie po aktywowaniu flagi albo odrodzeniu.
function drawCheckpointNotice() { // pokazuje krótki komunikat o aktywacji lub odrodzeniu.
  if (checkpointNoticeTimer > 0 && !isLevelThumbnail) { // pomija komunikat w małych miniaturach.
    ctx.fillStyle = "rgba(0, 0, 0, 0.72)"; // ustawia półprzezroczyste tło dla napisu.
    ctx.fillRect(canvas.width / 2 - 170, 118, 340, 42); // rysuje pasek komunikatu na górze planszy.
    ctx.fillStyle = "white"; // ustawia jasny kolor tekstu komunikatu.
    ctx.font = "18px Arial"; // dobiera rozmiar tekstu do szerokości planszy.
    ctx.textAlign = "center"; // centruje napis względem środka płótna.
    ctx.fillText(checkpointNoticeText, canvas.width / 2, 145); // wyświetla informację o punkcie kontrolnym.
    ctx.textAlign = "left"; // przywraca domyślne wyrównanie dla pozostałych napisów.
  } // kończy wyświetlanie komunikatu.
} // kończy funkcję rysowania komunikatu.

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
  ctx.fillRect(10, 10, 190, 126); // zwiększa panel, aby zmieścić licznik czasu poziomu.
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText(t("points") + score, 22, 38);                            // "Punkty: ..."
  ctx.fillText(t("level") + (currentLevel + 1) + " / " + levels.length, 22, 64);   // "Poziom: x / 5"
  ctx.fillText(t("best") + bestScore, 22, 90);                          // "Rekord: ..."
  ctx.fillText(t("timer") + formatElapsedTime((performance.now() - levelStartedAt) / 1000), 22, 116); // pokazuje bieżący czas poziomu.

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
  drawCheckpoint(); // pokazuje lokalizację i stan flagi na planszy.
  drawCoins();
  drawSpikes();
  drawEnemies();
  drawPlayer();
  if (!isLevelThumbnail) { // pomija nieczytelny panel gry w małych miniaturach poziomów.
    drawHud(); // zostawia licznik punktów, poziomu i sterowania w normalnej grze.
    drawCheckpointNotice(); // pokazuje potwierdzenie w pełnym widoku gry.
  }

  if (gameOver) {
    drawEndScreen(t("gameOverTitle"), t("gameOverHint"));
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

replayButton.addEventListener("click", function () { // rozpoczyna ponownie pełną grę po wybraniu przycisku.
  continueAfterLevel(); // przechodzi do następnego poziomu albo zaczyna ponownie po finale.
}); // kończy obsługę przycisku ponownej gry.

// Odczytujemy zapisany język i ustawiamy go (jeśli nic nie zapisano, zostaje polski)
const savedLanguage = localStorage.getItem("language");
setLanguage(savedLanguage === "en" ? "en" : "pl");

// Czyta numer poziomu z adresu i sprawdza zapisany postęp odblokowań.
const gameUrlParams = new URLSearchParams(window.location.search);
const requestedLevel = Number(gameUrlParams.get("level"));
const savedUnlockedLevel = Number(localStorage.getItem("unlockedLevel"));
const unlockedLevel = Number.isInteger(savedUnlockedLevel) && savedUnlockedLevel >= 1 && savedUnlockedLevel <= levels.length
  ? savedUnlockedLevel
  : 1;
// Miniatury mogą wyświetlić dowolny poziom; zwykła gra dopuszcza tylko odblokowane.
const highestAllowedLevel = isLevelThumbnail ? levels.length : unlockedLevel;
// Nie pozwala otworzyć zablokowanego poziomu przez ręczną zmianę adresu URL.
startingLevel = Number.isInteger(requestedLevel) && requestedLevel >= 1 && requestedLevel <= highestAllowedLevel
  ? requestedLevel - 1
  : gameUrlParams.has("level") && !isLevelThumbnail
    ? unlockedLevel - 1
    : 0;
currentLevel = startingLevel;
loadLevel(startingLevel);
if (isLevelThumbnail) {
  // Miniatura rysuje tylko jedną klatkę i ukrywa przyciski sterujące.
  document.body.classList.add("level-thumbnail");
  draw();
} else {
  gameLoop();     // uruchamiamy pętlę gry
}