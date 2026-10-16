// Napisy używane przez stronę główną; te same klucze występują w obu językach.
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
    levelPreview: "Podgląd poziomu ",
    playButton: "Zagraj teraz",
    featuresTitle: "Dlaczego warto zagrać?",
    card1Title: "Zbieraj monety",
    card1Text: "Każdy poziom to kilka monet ukrytych na platformach. Zbierz wszystkie, żeby iść dalej.",
    card2Title: "Unikaj pułapek",
    card2Text: "Kolce czekają na ziemi. Jeden błąd i koniec gry, więc skacz uważnie.",
    card3Title: "Kolejne poziomy",
    card3Text: "Im dalej, tym trudniej. Pokaż, że potrafisz przejść całą grę.",
    controlsTitle: "Jak grać",
    control1: "A/D albo strzałki lewo / prawo: ruch",
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
    levelPreview: "Preview of level ",
    playButton: "Play now",
    featuresTitle: "Why play?",
    card1Title: "Collect coins",
    card1Text: "Every level hides a few coins on the platforms. Collect them all to move on.",
    card2Title: "Avoid the traps",
    card2Text: "Spikes are waiting on the ground. One mistake and it's game over, so jump carefully.",
    card3Title: "More levels",
    card3Text: "The further you go, the harder it gets. Show you can finish the whole game.",
    controlsTitle: "How to play",
    control1: "A/D or left / right arrows: move",
    control2: "Space or up arrow: jump",
    control3: "R: restart after the game ends",
    footerText: "Made by Adrian, 2026",
    previewTitle: "Try it right now",
    previewStart: "Click to play here",
  }
};
// Język strony używany do wyboru odpowiedniego zestawu napisów.
let currentLanguage = "pl";

// Zmienia napisy strony, a wybór języka zachowuje po odświeżeniu.
function setLanguage(language) {
  localStorage.setItem("language", language);
  currentLanguage = language;
  document.documentElement.lang = language;

  // Każdy element z data-i18n dostaje tłumaczenie o pasującym kluczu.
  const elements = document.querySelectorAll("[data-i18n]");
  for (const element of elements) {
    const key = element.dataset.i18n;
    element.textContent = translations[language][key];
  }

  // Przycisk pokazuje język, na który można się przełączyć.
  const button = document.getElementById("lang-button");
  button.textContent = language === "pl" ? "EN" : "PL";
}

const langButton = document.getElementById("lang-button");
// Kliknięcie przełącza język i odświeża teksty na kafelkach poziomów.
langButton.addEventListener("click", function () {
  setLanguage(currentLanguage === "pl" ? "en" : "pl");
  updateLevelPath();
});
// Przywraca ostatni zapisany język, jeśli jest jednym z obsługiwanych.
const savedLanguage = localStorage.getItem("language");
if (savedLanguage === "pl" || savedLanguage === "en") {
  setLanguage(savedLanguage);
}
// Elementy strony potrzebne do tworzenia mapy, uruchamiania podglądu i gry.
const previewFrame = document.getElementById("preview-frame");
const previewStart = document.getElementById("preview-start");
const levelPath = document.getElementById("level-path");
const playButton = document.querySelector(".play-button");
let previewIframe;
// Poziom wybrany na mapie; na początku zaznaczony jest pierwszy.
let selectedLevel = 1;
// Liczba poziomów w grze oraz klucz, pod którym zapisano postęp.
const levelCount = 8;
const unlockedLevelKey = "unlockedLevel";

// Tworzy adres strony gry dla aktualnie wybranego poziomu.
function getGameUrl() {
  return "game.html?level=" + selectedLevel;
}

// Odczytuje najwyższy odblokowany poziom i zabezpiecza wynik przed błędnymi danymi.
function getUnlockedLevel() {
  const savedLevel = Number(localStorage.getItem(unlockedLevelKey));
  return Number.isInteger(savedLevel) && savedLevel >= 1 && savedLevel <= levelCount
    ? savedLevel
    : 1;
}

// Tworzy kafelki poziomów albo odświeża ich status i tłumaczenia.
function updateLevelPath() {
  const unlockedLevel = getUnlockedLevel();
  levelPath.setAttribute("aria-label", translations[currentLanguage].levelMapTitle);
  if (selectedLevel > unlockedLevel) {
    selectedLevel = unlockedLevel;
  }
  // Nie odtwarza iframe przy każdej zmianie postępu lub języka.
  const cardsAlreadyCreated = levelPath.children.length === levelCount;
  if (!cardsAlreadyCreated) {
    levelPath.replaceChildren();
  }

  for (let level = 1; level <= levelCount; level++) {
    // Poziomy niższe od limitu są ukończone; limit sam jest odblokowany.
    const isUnlocked = level <= unlockedLevel;
    const isSelected = level === selectedLevel;
    const isCompleted = level < unlockedLevel;
    let card = cardsAlreadyCreated
      ? levelPath.querySelector('[data-level="' + level + '"]')
      : null;

    // Buduje strukturę kafelka tylko raz, aby nie przeładowywać miniatur.
    if (!card) {
      card = document.createElement("div");
      card.dataset.level = String(level);

      const thumbnail = document.createElement("iframe");
      // Ładuje właściwą planszę w trybie nieruchomej miniatury.
      thumbnail.src = "game.html?level=" + level + "&thumbnail=1";
      thumbnail.loading = "lazy";
      thumbnail.tabIndex = -1;
      thumbnail.setAttribute("aria-hidden", "true");
      thumbnail.className = "level-thumbnail-frame";

      const status = document.createElement("span");
      status.className = "level-status";
      status.setAttribute("aria-hidden", "true");

      const button = document.createElement("button");
      button.type = "button";
      button.className = "level-node";
      // Kliknięcie zaznacza poziom i aktualizuje podgląd, jeśli już działa.
      button.addEventListener("click", function () {
        selectedLevel = level;
        updateSelectedLevel();
        if (previewIframe) {
          previewIframe.src = getGameUrl();
        }
      });

      card.append(thumbnail, status, button);
      levelPath.appendChild(card);
    }

    card.className = "level-card";
    if (!isUnlocked) {
      card.classList.add("locked");
    }
    const thumbnail = card.querySelector(".level-thumbnail-frame");
    // Tytuł miniatury pojawia się po najechaniu kursorem.
    thumbnail.title = translations[currentLanguage].levelPreview + level;
    const status = card.querySelector(".level-status");
    const button = card.querySelector(".level-node");
    // Zablokowany poziom nie może być wybrany, także klawiaturą.
    button.disabled = !isUnlocked;
    button.setAttribute("aria-pressed", String(isSelected));
    // Etykieta dostępności łączy numer poziomu z jego statusem.
    button.setAttribute("aria-label",
      translations[currentLanguage].levelLabel + level + ", " +
      (isCompleted
        ? translations[currentLanguage].levelCompleted
        : isUnlocked
          ? translations[currentLanguage].levelUnlocked
          : translations[currentLanguage].levelLocked) +
      (isSelected ? ", " + translations[currentLanguage].levelSelected : ""));
    if (isSelected) {
      card.classList.add("selected");
    }
    if (isCompleted) {
      card.classList.add("completed");
    }

    // Pokazuje znacznik ukończenia, blokadę albo brak dodatkowej ikony.
    const label = translations[currentLanguage].levelLabel.trim() + " " + level;
    status.textContent = isCompleted ? "✓" : isUnlocked ? "" : "🔒";
    button.textContent = label;
  }

  // Link głównego przycisku zawsze otwiera wybrany poziom.
  playButton.href = getGameUrl();
  updateSelectedLevel();
}

// Aktualizuje wizualne zaznaczenie bez ponownego tworzenia miniatur.
function updateSelectedLevel() {
  for (const card of levelPath.querySelectorAll(".level-card")) {
    const level = Number(card.dataset.level);
    const isSelected = level === selectedLevel;
    card.classList.toggle("selected", isSelected);
    card.querySelector(".level-node").setAttribute("aria-pressed", String(isSelected));
  }
  playButton.href = getGameUrl();
}

// Synchronizuje mapę, gdy postęp zmieni się w innej karcie lub ramce.
window.addEventListener("storage", function (event) {
  if (event.key === unlockedLevelKey) {
    updateLevelPath();
  }
});

// Rysuje mapę przy pierwszym wczytaniu strony.
updateLevelPath();

// Po kliknięciu uruchamia grę w ramce podglądu zamiast przechodzić na inną stronę.
previewStart.addEventListener("click", function () {
  previewIframe = document.createElement("iframe");
  previewIframe.src = getGameUrl();
  previewIframe.title = "Gra";
  previewFrame.appendChild(previewIframe);
  previewStart.remove();
  previewIframe.focus();
});
// Elementy, które pojawiają się animacją dopiero po przewinięciu do nich.
const revealElements = document.querySelectorAll(".card, .controls li, .preview-frame, .level-path");

for (const element of revealElements) {
  element.classList.add("reveal");
}

// Rozkłada w czasie pojawianie się kart, żeby nie animowały się jednocześnie.
const cards = document.querySelectorAll(".card");
cards.forEach(function (card, index) {
  card.style.transitionDelay = index * 0.15 + "s";
});

// Obserwator wykrywa wejście elementu w ekran i uruchamia jego animację.
const observer = new IntersectionObserver(function (entries) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.2 });

// Rejestruje obserwację dla każdego elementu, który ma się pojawić przy przewijaniu.
for (const element of revealElements) {
  observer.observe(element);
}