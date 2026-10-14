const translations = {
  pl: {
    heroTagline: "Skacz, zbieraj monety i omijaj kolce. Dasz radę przejść wszystkie poziomy?",
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
});
const savedLanguage = localStorage.getItem("language");
if (savedLanguage === "pl" || savedLanguage === "en") {
  setLanguage(savedLanguage);
}
const previewFrame = document.getElementById("preview-frame");
const previewStart = document.getElementById("preview-start");

previewStart.addEventListener("click", function () {
  const iframe = document.createElement("iframe");
  iframe.src = "game.html";
  iframe.title = "Gra";
  previewFrame.appendChild(iframe);
  previewStart.remove();
  iframe.focus();
});
const revealElements = document.querySelectorAll(".card, .controls li, .preview-frame");

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