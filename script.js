const STORAGE_KEY = "portfolio-language";

function readStoredLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredLanguage(language) {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    return;
  }
}

function preferredLanguage() {
  const saved = readStoredLanguage();
  if (saved === "en" || saved === "zh") return saved;
  return navigator.language && navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function applyLanguage(language) {
  document.body.dataset.lang = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  writeStoredLanguage(language);

  document.querySelectorAll("[data-lang-option]").forEach((button) => {
    const isActive = button.dataset.langOption === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelectorAll("[data-lightbox]").forEach((item) => {
    const caption = language === "zh" ? item.dataset.captionZh : item.dataset.captionEn;
    if (caption) item.setAttribute("aria-label", caption);
  });
}

function initLanguageToggle() {
  applyLanguage(preferredLanguage());
  document.querySelectorAll("[data-lang-option]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.langOption));
  });
}

function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const active = link.dataset.nav === page;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.14 }
  );

  items.forEach((item) => observer.observe(item));
}

function initLightbox() {
  const triggers = document.querySelectorAll("[data-lightbox]");
  if (!triggers.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button"></button>
    <img alt="" />
    <p></p>
  `;
  document.body.appendChild(lightbox);

  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector("p");
  const closeButton = lightbox.querySelector(".lightbox-close");
  let previousFocus = null;

  function close() {
    lightbox.hidden = true;
    document.body.classList.remove("has-lightbox");
    if (previousFocus) previousFocus.focus();
  }

  function open(trigger) {
    const source = trigger.querySelector("img");
    if (!source) return;

    const language = document.body.dataset.lang;
    const captionText = language === "zh" ? trigger.dataset.captionZh : trigger.dataset.captionEn;
    previousFocus = document.activeElement;
    image.src = source.currentSrc || source.src;
    image.alt = source.alt || "";
    caption.textContent = captionText || source.alt || "";
    closeButton.textContent = language === "zh" ? "关闭" : "Close";
    closeButton.setAttribute("aria-label", language === "zh" ? "关闭图片预览" : "Close image preview");
    lightbox.hidden = false;
    document.body.classList.add("has-lightbox");
    closeButton.focus();
  }

  triggers.forEach((trigger) => {
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("role", "button");
    trigger.addEventListener("click", () => open(trigger));
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(trigger);
      }
    });
  });

  closeButton.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.hidden && event.key === "Escape") close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLanguageToggle();
  setActiveNav();
  initReveal();
  initLightbox();
});
