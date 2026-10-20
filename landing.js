// Napisy używane przez stronę główną; te same klucze występują w obu językach.
const translations = {
  pl: {
    heroTagline: "Skacz, zbieraj monety i omijaj kolce. Dasz radę przejść wszystkie poziomy?",
    appearanceTitle: "Dostosuj wygląd gry", // tytuł sekcji ustawień wyglądu po polsku.
    appearanceHint: "Twój wybór zapisze się automatycznie.", // informacja o automatycznym zapisywaniu wyglądu.
    themeHint: "Wybrany motyw zmienia się dalej co dwa poziomy.", // wyjaśnia, że tła nadal zmieniają się w trakcie gry.
    playerColorLabel: "Kolor postaci", // etykieta wyboru koloru postaci.
    backgroundLabel: "Motyw tła", // etykieta wyboru motywu tła.
    colorRed: "Czerwony", // polska nazwa czerwonego koloru.
    colorBlue: "Niebieski", // polska nazwa niebieskiego koloru.
    colorGreen: "Zielony", // polska nazwa zielonego koloru.
    colorPurple: "Fioletowy", // polska nazwa fioletowego koloru.
    colorOrange: "Pomarańczowy", // polska nazwa pomarańczowego koloru.
    themeDefault: "Domyślny", // polska nazwa klasycznej rotacji teł.
    themeSunset: "Zachód słońca", // polska nazwa motywu zachodzącego słońca.
    themeNight: "Noc", // polska nazwa nocnego motywu z gwiazdami.
    themeForest: "Las", // polska nazwa zielonego motywu.
    levelMapTitle: "Droga przez poziomy",
    levelMapHint: "Ukończ poziom, by odblokować następny. 1★ za wszystkie monety, 2★ poniżej 90 s, 3★ poniżej 45 s.",
    levelLabel: "Poziom ",
    levelLocked: "Zablokowany",
    levelUnlocked: "Odblokowany",
    levelCompleted: "Ukończony",
    levelSelected: "Wybrany",
    levelPreview: "Podgląd poziomu ",
    levelCoins: "Monety: ", // początek opisu zebranych monet w języku polskim.
    levelBestScore: "Rekord: ", // początek opisu najlepszego wyniku poziomu po polsku.
    levelPointsUnit: " pkt", // skrót jednostki punktów po polsku.
    levelStars: "Gwiazdki: ", // podpis liczby gwiazdek zdobytych za poziom.
    noLevelStars: "brak oceny", // informuje o ukończeniu sprzed wprowadzenia systemu gwiazdek.
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
    control4: "Dotknij złotej flagi, aby aktywować punkt kontrolny", // wyjaśnia sposób aktywowania checkpointu po polsku.
    control5: "Na telefonie użyj przycisków pod planszą", // objaśnia obsługę dotykową w polskiej instrukcji.
    footerText: "Zrobione przez Adrian, 2026",
    previewTitle: "Wypróbuj od razu",
    previewStart: "Kliknij, aby zagrać tutaj",
  },
  en: {
    heroTagline: "Jump, collect coins and dodge the spikes. Can you beat every level?",
    appearanceTitle: "Customize your game", // title of the appearance settings section.
    appearanceHint: "Your choices are saved automatically.", // explains that appearance choices are saved.
    themeHint: "Your chosen theme continues changing every two levels.", // explains how level background rotation works.
    playerColorLabel: "Character color", // label for the character color selector.
    backgroundLabel: "Background theme", // label for the background theme selector.
    colorRed: "Red", // English name for the red character color.
    colorBlue: "Blue", // English name for the blue character color.
    colorGreen: "Green", // English name for the green character color.
    colorPurple: "Purple", // English name for the purple character color.
    colorOrange: "Orange", // English name for the orange character color.
    themeDefault: "Default", // English name for the classic background rotation.
    themeSunset: "Sunset", // English name for the warm sunset theme.
    themeNight: "Night", // English name for the starry night theme.
    themeForest: "Forest", // English name for the green theme.
    levelMapTitle: "Level path",
    levelMapHint: "Finish a level to unlock the next. 1★ for all coins, 2★ under 90 sec, 3★ under 45 sec.",
    levelLabel: "Level ",
    levelLocked: "Locked",
    levelUnlocked: "Unlocked",
    levelCompleted: "Completed",
    levelSelected: "Selected",
    levelPreview: "Preview of level ",
    levelCoins: "Coins: ", // angielski początek opisu liczby zebranych monet.
    levelBestScore: "Best: ", // angielski początek opisu najlepszego wyniku poziomu.
    levelPointsUnit: " pts", // angielski skrót jednostki punktów.
    levelStars: "Stars: ", // label for the number of stars earned on a level.
    noLevelStars: "not rated", // describes levels completed before star ratings were added.
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
    control4: "Touch the golden flag to activate a checkpoint", // explains how to activate checkpoints in English.
    control5: "On a phone, use the buttons below the game", // explains touch controls in the English instructions.
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
const playerColorSelect = document.getElementById("player-color"); // pobiera listę kolorów bohatera.
const backgroundThemeSelect = document.getElementById("background-theme"); // pobiera listę początkowych motywów tła.
let previewIframe;
// Poziom wybrany na mapie; na początku zaznaczony jest pierwszy.
let selectedLevel = 1;
// Liczba poziomów w grze oraz klucz, pod którym zapisano postęp.
const levelCount = 8;
const unlockedLevelKey = "unlockedLevel";
const playerColorKey = "playerColor"; // klucz localStorage przechowujący wybrany kolor postaci.
const backgroundThemeKey = "backgroundTheme"; // klucz localStorage przechowujący wybrany motyw tła.

// Przywraca i zapisuje wygląd gry, aby wybory działały na stronie i w podglądzie.
function updateAppearanceSettings() { // synchronizuje listy wyglądu z pamięcią przeglądarki.
  const savedColor = localStorage.getItem(playerColorKey); // pobiera poprzednio zapisany kolor postaci.
  const availableColors = Array.from(playerColorSelect.options, function (option) { return option.value; }); // pobiera dozwolone kolory z listy wyboru.
  playerColorSelect.value = availableColors.includes(savedColor) ? savedColor : playerColorSelect.options[0].value; // odrzuca nieznane wartości i wybiera kolor domyślny.
  const savedTheme = localStorage.getItem(backgroundThemeKey); // pobiera poprzednio zapisany motyw tła.
  const availableThemes = Array.from(backgroundThemeSelect.options, function (option) { return option.value; }); // pobiera dozwolone motywy z listy wyboru.
  backgroundThemeSelect.value = availableThemes.includes(savedTheme) ? savedTheme : backgroundThemeSelect.options[0].value; // odrzuca nieznane wartości i wybiera motyw domyślny.
  document.documentElement.style.setProperty("--player-color", playerColorSelect.value); // aktualizuje kolor bohatera w ozdobnej ilustracji strony.
} // kończy przywracanie ustawień wyglądu.

// Zapisuje wybrany kolor i natychmiast odświeża powiązane podglądy gry.
playerColorSelect.addEventListener("change", function () { // reaguje na wybór nowego koloru bohatera.
  localStorage.setItem(playerColorKey, playerColorSelect.value); // zapisuje dozwolony kolor na potrzeby gry.
  updateAppearanceSettings(); // aktualizuje także kolor postaci w nagłówkowej ilustracji.
}); // kończy obsługę zmiany koloru postaci.

// Zapisuje wybrany motyw, zachowując zmianę tła co dwa poziomy.
backgroundThemeSelect.addEventListener("change", function () { // reaguje na wybór nowego motywu tła.
  localStorage.setItem(backgroundThemeKey, backgroundThemeSelect.value); // zapisuje początkowy motyw poziomów.
}); // kończy obsługę zmiany motywu tła.

updateAppearanceSettings(); // wczytuje zapisany wygląd lub ustawia wartości domyślne.

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
    const savedCoins = Number(localStorage.getItem("levelCoins_" + level)); // odczytuje liczbę monet zachowaną po ukończeniu poziomu.
    const savedBestScore = Number(localStorage.getItem("levelBestScore_" + level)); // odczytuje najlepszy wynik punktowy poziomu.
    const hasSavedStats = Number.isInteger(savedCoins) && savedCoins > 0 && Number.isFinite(savedBestScore); // rozpoznaje istniejący zapis ukończonego poziomu.
    const savedStarsText = localStorage.getItem("levelStars_" + level); // odczytuje zapis gwiazdek, aby odróżnić go od jego braku.
    const savedStars = Number(savedStarsText); // zamienia zapis tekstowy na liczbę gwiazdek.
    const hasStarRating = ["0", "1", "2", "3"].includes(savedStarsText); // akceptuje tylko zapis liczby gwiazdek z zakresu 0–3.
    const isCompleted = level < unlockedLevel || hasSavedStats || hasStarRating; // uwzględnia także ukończenie ostatniego poziomu.
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
      const levelName = document.createElement("span"); // etykieta z numerem poziomu pozostaje czytelna na kafelku.
      levelName.className = "level-name"; // klasa pozwala wystylizować nazwę niezależnie od statystyk.
      const levelDetails = document.createElement("span"); // osobny wiersz pokazuje wynik i monety ukończonego poziomu.
      levelDetails.className = "level-details"; // klasa nadaje statystykom mniejszy, pomocniczy wygląd.
      button.append(levelName, levelDetails); // umieszcza nazwę i statystyki wewnątrz przycisku poziomu.
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
    const label = translations[currentLanguage].levelLabel.trim() + " " + level; // tworzy nazwę poziomu w aktualnym języku.
    status.textContent = isCompleted ? "✓" : isUnlocked ? "" : "🔒"; // zachowuje ikonę ukończenia albo kłódki na miniaturze.
    button.querySelector(".level-name").textContent = label; // wpisuje nazwę poziomu do pierwszego wiersza kafelka.
    const starsText = hasStarRating ? "★".repeat(savedStars) + "☆".repeat(3 - savedStars) : translations[currentLanguage].noLevelStars; // tworzy ocenę gwiazdkową albo informację o starszym zapisie.
    const levelDetailsText = isCompleted && hasSavedStats // statystyki pokazujemy tylko dla ukończonego poziomu z zapisanymi danymi.
      ? translations[currentLanguage].levelCoins + savedCoins + "/" + savedCoins + "\n" + translations[currentLanguage].levelBestScore + savedBestScore + translations[currentLanguage].levelPointsUnit + "\n" + translations[currentLanguage].levelStars + starsText // pokazuje monety, rekord i gwiazdki w osobnych wierszach.
      : isCompleted ? translations[currentLanguage].levelCompleted : ""; // dla starych zapisów wyświetla samo ukończenie, a w innych przypadkach pusty tekst.
    button.querySelector(".level-details").textContent = levelDetailsText; // pokazuje szczegóły pod nazwą poziomu.
    button.setAttribute("aria-label", button.getAttribute("aria-label") + (isCompleted && hasSavedStats ? ", " + levelDetailsText : "")); // udostępnia zapisane wyniki czytnikom ekranu.
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

// Synchronizuje mapę, gdy postęp lub wynik zmieni się w innej karcie albo ramce.
window.addEventListener("storage", function (event) {
  if (event.key === unlockedLevelKey || (typeof event.key === "string" && (event.key.startsWith("levelStars_") || event.key.startsWith("levelCoins_") || event.key.startsWith("levelBestScore_")))) { // odświeża kartę po odblokowaniu albo zapisaniu statystyk poziomu.
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