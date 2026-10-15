const translations = {
  pl: {
    heroTagline: "Skacz, zbieraj monety i omijaj kolce. Dasz radę przejść wszystkie poziomy?",
    levelMapTitle: "Droga przez poziomy",
    levelMapHint: "Przejdź poziom, aby odblokować następny.",
    levelLabel: "Poziom ",
    levelLocked: "Zablokowany",
    levelUnlocked: "Odblokowany",
    levelCompleted: "Ukończony",
    levelSelected: "Wybrany",
    playButton: "Zagraj teraz",
    featuresTitle: "Dlaczego warto zagrać?",
    card1Title: "Zbieraj monety",
    card1Text: "Każdy poziom to kilka monet ukrytych na platformach. Zbierz wszystkie, żeby iść dalej.",
    card2Title: "Unikaj pułapek",
    card2Text: "Kolce czekają na ziemi. Jeden błąd i koniec gry, więc skacz uważnie.",
    card3Title: "Kolejne poziomy",
    card3Text: "Im dalej, tym trudniej. Pokaż, że potrafisz przejść całą grę.",
    controlsTitle: "Jak grać",
    control1: "Strzałki lewo / prawo: ruch",
    control2: "Spacja albo strzałka w górę: skok",
    control3: "R: zacznij od nowa po końcu gry",
    footerText: "Zrobione przez Adrian, 2026",
    previewTitle: "Wypróbuj od razu",
    previewStart: "Kliknij, aby zagrać tutaj",
  },
  en: {
    heroTagline: "Jump, collect coins and dodge the spikes. Can you beat every level?",
    levelMapTitle: "Level path",
    levelMapHint: "Complete a level to unlock the next one.",
    levelLabel: "Level ",
    levelLocked: "Locked",
    levelUnlocked: "Unlocked",
    levelCompleted: "Completed",
    levelSelected: "Selected",
    playButton: "Play now",
    featuresTitle: "Why play?",
    card1Title: "Collect coins",
    card1Text: "Every level hides a few coins on the platforms. Collect them all to move on.",
    card2Title: "Avoid the traps",
    card2Text: "Spikes are waiting on the ground. One mistake and it's game over, so jump carefully.",
    card3Title: "More levels",
    card3Text: "The further you go, the harder it gets. Show you can finish the whole game.",
    controlsTitle: "How to play",
    control1: "Left / right arrows: move",
    control2: "Space or up arrow: jump",
    control3: "R: restart after the game ends",
    footerText: "Made by Adrian, 2026",
    previewTitle: "Try it right now",
    previewStart: "Click to play here",
  }
};
let currentLanguage = "pl";

function setLanguage(language) {
  localStorage.setItem("language", language);
  currentLanguage = language;
  document.documentElement.lang = language;

  const elements = document.querySelectorAll("[data-i18n]");
  for (const element of elements) {
    const key = element.dataset.i18n;
    element.textContent = translations[language][key];
  }

  const button = document.getElementById("lang-button");
  button.textContent = language === "pl" ? "EN" : "PL";
}

const langButton = document.getElementById("lang-button");
langButton.addEventListener("click", function () {
  setLanguage(currentLanguage === "pl" ? "en" : "pl");
  updateLevelPath();
});
const savedLanguage = localStorage.getItem("language");
if (savedLanguage === "pl" || savedLanguage === "en") {
  setLanguage(savedLanguage);
}
const previewFrame = document.getElementById("preview-frame");
const previewStart = document.getElementById("preview-start");
const levelPath = document.getElementById("level-path");
const playButton = document.querySelector(".play-button");
let previewIframe;
let selectedLevel = 1;
const levelCount = 8;
const unlockedLevelKey = "unlockedLevel";

function getGameUrl() {
  return "game.html?level=" + selectedLevel;
}

function getUnlockedLevel() {
  const savedLevel = Number(localStorage.getItem(unlockedLevelKey));
  return Number.isInteger(savedLevel) && savedLevel >= 1 && savedLevel <= levelCount
    ? savedLevel
    : 1;
}

function updateLevelPath() {
  const unlockedLevel = getUnlockedLevel();
  levelPath.setAttribute("aria-label", translations[currentLanguage].levelMapTitle);
  if (selectedLevel > unlockedLevel) {
    selectedLevel = unlockedLevel;
  }
  levelPath.replaceChildren();

  for (let level = 1; level <= levelCount; level++) {
    const isUnlocked = level <= unlockedLevel;
    const isSelected = level === selectedLevel;
    const isCompleted = level < unlockedLevel;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "level-node";
    button.dataset.level = String(level);
    button.style.gridColumn = String(level <= 4 ? level : 9 - level);
    button.style.gridRow = level <= 4 ? "1" : "2";
    button.disabled = !isUnlocked;
    button.setAttribute("aria-pressed", String(isSelected));
    button.setAttribute("aria-label",
      translations[currentLanguage].levelLabel + level + ", " +
      (isCompleted
        ? translations[currentLanguage].levelCompleted
        : isUnlocked
          ? translations[currentLanguage].levelUnlocked
          : translations[currentLanguage].levelLocked) +
      (isSelected ? ", " + translations[currentLanguage].levelSelected : ""));
    if (isSelected) {
      button.classList.add("selected");
    }
    if (isCompleted) {
      button.classList.add("completed");
    }

    const number = document.createElement("span");
    number.className = "level-number";
    number.textContent = isUnlocked ? String(level) : "🔒";
    const label = document.createElement("span");
    label.className = "level-label";
    label.textContent = translations[currentLanguage].levelLabel + level;
    button.append(number, label);
    button.addEventListener("click", function () {
      selectedLevel = level;
      updateLevelPath();
      playButton.href = getGameUrl();
      if (previewIframe) {
        previewIframe.src = getGameUrl();
      }
    });
    levelPath.appendChild(button);
  }

  playButton.href = getGameUrl();
}

window.addEventListener("storage", function (event) {
  if (event.key === unlockedLevelKey) {
    updateLevelPath();
  }
});

updateLevelPath();

previewStart.addEventListener("click", function () {
  previewIframe = document.createElement("iframe");
  previewIframe.src = getGameUrl();
  previewIframe.title = "Gra";
  previewFrame.appendChild(previewIframe);
  previewStart.remove();
  previewIframe.focus();
});
const revealElements = document.querySelectorAll(".card, .controls li, .preview-frame, .level-path");

for (const element of revealElements) {
  element.classList.add("reveal");
}

const cards = document.querySelectorAll(".card");
cards.forEach(function (card, index) {
  card.style.transitionDelay = index * 0.15 + "s";
});

const observer = new IntersectionObserver(function (entries) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.2 });

for (const element of revealElements) {
  observer.observe(element);
}