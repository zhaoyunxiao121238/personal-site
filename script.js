// Shared JavaScript for the multi‑page personal website

// Typewriter effect for page taglines. Each page can define its own
// descriptors by setting an entry in pageTypewriterMap. The array
// associated with the current page will be used for the typing cycle.
let typewriterTexts = [];

const pageTypewriterMap = {
  index: [
    "AI & Software Engineer",
    "Product‑minded Problem Solver",
    "Lifelong Learner & Adventurer",
    "Leader & Collaborator"
  ],
  internships: [
    "Solution Intern",
    "Test Engineer Intern",
    "Student Union President",
    "Team Leader"
  ],
  projects: [
    "Deep Learning Innovator",
    "Full‑stack Web Developer",
    "Real‑time Vision Engineer",
    "Project Manager",
    "Medical AI Researcher"
  ],
  hobbies: [
    "Hiking Explorer",
    "Ski & Snow Lover",
    "Diving Enthusiast",
    "Fitness & Gym",
    "Photography Fan"
  ]
};

let typewriterIndex = 0;
let charIndex = 0;
let currentText = '';
// Speed of typing and erasing (milliseconds). Adjust these values to
// control the feel of the typewriter effect. A faster type helps reduce
// the time the user sees a partially typed phrase.
const typeDelay = 80;
const eraseDelay = 40;
const nextTextDelay = 2000; // Delay between text changes

function typeWriter() {
  // Find the tagline element for either hero on the homepage or page heroes
  const taglineElement = document.querySelector('.hero-content h2, .page-hero h2');
  if (!taglineElement) return;
  if (charIndex < typewriterTexts[typewriterIndex].length) {
    currentText += typewriterTexts[typewriterIndex][charIndex];
    taglineElement.textContent = currentText;
    charIndex++;
    setTimeout(typeWriter, typeDelay);
  } else {
    // pause then erase the text
    setTimeout(() => eraseText(taglineElement), nextTextDelay);
  }
}

function eraseText(element) {
  if (charIndex > 0) {
    currentText = currentText.substring(0, currentText.length - 1);
    element.textContent = currentText;
    charIndex--;
    setTimeout(() => eraseText(element), eraseDelay);
  } else {
    // Move to next text
    typewriterIndex = (typewriterIndex + 1) % typewriterTexts.length;
    setTimeout(typeWriter, typeDelay);
  }
}

// Reveal animations using IntersectionObserver. Elements with the
// class `.hidden` will transition into view when scrolled into
// the viewport.
function initRevealOnScroll() {
  const hiddenElements = document.querySelectorAll('.hidden');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  hiddenElements.forEach((el) => observer.observe(el));
}

// Accordion toggle for cards on internships and projects pages. Each card
// contains a title row, an optional simple-info summary and a hidden
// details section. Clicking the title row toggles the `expanded`
// class on the parent card, revealing or hiding the details.
function initAccordions() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    const titleRow = card.querySelector('.card-title-row');
    if (titleRow) {
      titleRow.addEventListener('click', () => {
        card.classList.toggle('expanded');
      });
    }
  });
}

// Lightbox functionality for gallery images on the hobbies page. When an
// image is clicked, display a modal overlay with a larger version and
// caption. Clicking on the overlay closes it.
function initLightbox() {
  // Select both traditional gallery items and photo items from the
  // photography masonry grid so all images can trigger the lightbox.
  const galleryItems = document.querySelectorAll('.gallery-item, .photo-masonry .photo-item');
  const lightbox = document.createElement('div');
  lightbox.classList.add('lightbox');
  document.body.appendChild(lightbox);
  const img = document.createElement('img');
  const caption = document.createElement('span');
  lightbox.appendChild(img);
  lightbox.appendChild(caption);
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const image = item.querySelector('img');
      const title = item.querySelector('span').textContent;
      img.src = image.src;
      caption.textContent = title;
      lightbox.classList.add('show');
    });
  });
  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('show');
  });
}

// Set active nav link based on current page. Each page should set
// `data-page` on the body element to the name of the page.
function setActiveNav() {
  const page = document.body.getAttribute('data-page');
  if (!page) return;
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.includes(page)) {
      link.classList.add('active');
    }
  });
}

// Initialize functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initRevealOnScroll();
  initLightbox();
  // Initialize accordions after reveal animations so that cards can be expanded/collapsed
  initAccordions();
  // Set up page specific typewriter texts based on data-page attribute
  const page = document.body.getAttribute('data-page') || 'index';
  if (pageTypewriterMap[page]) {
    typewriterTexts = pageTypewriterMap[page];
  } else {
    typewriterTexts = pageTypewriterMap['index'];
  }
  // Start typewriter effect if there is a tagline element
  const taglineElement = document.querySelector('.hero-content h2, .page-hero h2');
  if (taglineElement) {
    // Clear any existing text before starting the typewriter effect to avoid
    // showing a partially typed phrase on initial load.
    taglineElement.textContent = '';
    typeWriter();
  }
  // Page transition: slide in on load
  document.body.classList.add('page-enter');
  setTimeout(() => {
    document.body.classList.remove('page-enter');
  }, 600);
  // Intercept nav link clicks for smooth transitions
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      document.body.classList.add('page-exit');
      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });
  });
});