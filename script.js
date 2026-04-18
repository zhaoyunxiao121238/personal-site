const STORAGE_KEY = "portfolio-language";

function readStoredLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function writeStoredLanguage(language) {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch (error) {
    return;
  }
}

function getPreferredLanguage() {
  const saved = readStoredLanguage();
  if (saved === "en" || saved === "zh") return saved;

  return navigator.language && navigator.language.toLowerCase().startsWith("zh")
    ? "zh"
    : "en";
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
}

function initLanguageToggle() {
  applyLanguage(getPreferredLanguage());

  document.querySelectorAll("[data-lang-option]").forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.dataset.langOption);
    });
  });
}

function setActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const isActive = link.dataset.nav === page;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function initRevealOnScroll() {
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
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

function initAccordions() {
  document.querySelectorAll(".js-accordion").forEach((card, index) => {
    const button = card.querySelector(".card-toggle");
    const details = card.querySelector(".card-details");
    if (!button || !details) return;

    if (!details.id) details.id = `card-details-${index + 1}`;
    button.setAttribute("aria-controls", details.id);

    const setOpen = (isOpen) => {
      card.classList.toggle("is-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
      details.hidden = !isOpen;

      const labelEn = button.querySelector(".toggle-label-en");
      const labelZh = button.querySelector(".toggle-label-zh");
      if (labelEn) labelEn.textContent = isOpen ? "Hide details" : "View details";
      if (labelZh) labelZh.textContent = isOpen ? "收起详情" : "查看详情";
    };

    setOpen(card.classList.contains("is-open"));
    button.addEventListener("click", () => {
      setOpen(!card.classList.contains("is-open"));
    });
  });
}

function initLightbox() {
  const triggers = document.querySelectorAll("[data-lightbox]");
  if (!triggers.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Image preview");
  lightbox.hidden = true;

  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close image preview">Close</button>
    <img alt="" />
    <p></p>
  `;

  document.body.appendChild(lightbox);

  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector("p");
  const closeButton = lightbox.querySelector(".lightbox-close");
  let previousFocus = null;

  const close = () => {
    lightbox.hidden = true;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("has-lightbox");
    if (previousFocus) previousFocus.focus();
  };

  const open = (trigger) => {
    const source = trigger.querySelector("img");
    if (!source) return;

    previousFocus = document.activeElement;
    image.src = source.currentSrc || source.src;
    image.alt = source.alt || "";
    caption.textContent = trigger.dataset.caption || source.alt || "";
    const isChinese = document.body.dataset.lang === "zh";
    closeButton.textContent = isChinese ? "关闭" : "Close";
    closeButton.setAttribute("aria-label", isChinese ? "关闭图片预览" : "Close image preview");
    lightbox.hidden = false;
    lightbox.classList.add("is-open");
    document.body.classList.add("has-lightbox");
    closeButton.focus();
  };

  triggers.forEach((trigger) => {
    if (!trigger.hasAttribute("tabindex")) trigger.setAttribute("tabindex", "0");
    if (!trigger.hasAttribute("role")) trigger.setAttribute("role", "button");

    trigger.addEventListener("click", () => {
      open(trigger);
    });

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
  initRevealOnScroll();
  initAccordions();
  initLightbox();
});
