const firstPhrase = "Hi, I'm zrxhq";
const fixedPrefix = "Hi, I'm ";
const roles = [
  "a Photographer",
  "a Web Developer",
  "a Community Manager",
  "a Python Programmer"
];

let baseSpeed = 80;
let eraseSpeed = 40;
let delayBetween = 1500;

let isFirstPhrase = true;
let roleIndex = 0;
let charIndex = 0;

const typedText = document.getElementById("typed-text");

function type() {
  if (isFirstPhrase) {
    // Prima animazione: digita "Hi, I'm zrxhq"
    if (charIndex < firstPhrase.length) {
      typedText.textContent += firstPhrase.charAt(charIndex);
      charIndex++;
      setTimeout(type, 120);
    } else {
      setTimeout(erase, delayBetween);
    }
  } else {
    // Animazione ruoli: digita il ruolo dopo "Hi, I'm "
    let currentRole = roles[roleIndex];
    if (charIndex < currentRole.length) {
      typedText.textContent = fixedPrefix + currentRole.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(type, baseSpeed);
    } else {
      setTimeout(erase, delayBetween);
    }
  }
}

function erase() {
  if (isFirstPhrase) {
    // Cancella "Hi, I'm zrxhq" fino a "Hi, I'm ", poi passa ai ruoli
    if (charIndex > fixedPrefix.length) {
      charIndex--;
      typedText.textContent = firstPhrase.substring(0, charIndex);
      setTimeout(erase, eraseSpeed);
    } else {
      // Fine della cancellazione della prima frase
      isFirstPhrase = false;
      roleIndex = 0;
      charIndex = 0;
      typedText.textContent = fixedPrefix;
      setTimeout(type, 500);
    }
  } else {
    // Cancella il ruolo, mantenendo "Hi, I'm "
    if (charIndex > 0) {
      charIndex--;
      typedText.textContent = fixedPrefix + roles[roleIndex].substring(0, charIndex);
      setTimeout(erase, eraseSpeed);
    } else {
      roleIndex++;
      if (roleIndex >= roles.length) roleIndex = 0;
      setTimeout(type, 500);
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(type, 1000);
});

// Hamburger menu toggle
document.addEventListener("DOMContentLoaded", function() {
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');

  if (!nav || !toggle) return;

  function setOpen(open) {
    toggle.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', function(e) {
    const isOpen = nav.classList.contains('open');
    setOpen(!isOpen);
  });

  // Close menu when a nav link is clicked
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', (e) => {
      // Smooth-scroll to target and center it in viewport instead of sticking to top
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          // compute desired scroll; `alignFactor` controls vertical alignment: 0 = top, 0.5 = center.
          const elementTop = target.getBoundingClientRect().top + window.scrollY;
          const alignFactor = 0.5; // increased to place the container lower (more centered)
          const desiredTop = elementTop - ((window.innerHeight - target.offsetHeight) * alignFactor);
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const scrollTo = Math.max(0, Math.min(desiredTop, maxScroll));
          window.scrollTo({ top: scrollTo, behavior: 'smooth' });
          // update the URL hash without jumping
          history.replaceState(null, '', href);
        }
      }

      // close mobile menu
      setOpen(false);
    });
  });

  // Close on resize to larger screens
  window.addEventListener('resize', () => {
    if (window.innerWidth > 500) setOpen(false);
  });

  // helper to scroll to a hash target using the same alignment logic
  function scrollToHash(hash, instant = false) {
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;
    const elementTop = target.getBoundingClientRect().top + window.scrollY;
    const alignFactor = 0.5; // same factor used for clicks
    const desiredTop = elementTop - ((window.innerHeight - target.offsetHeight) * alignFactor);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollToPos = Math.max(0, Math.min(desiredTop, maxScroll));
    if (instant) window.scrollTo(0, scrollToPos);
    else window.scrollTo({ top: scrollToPos, behavior: 'smooth' });
    // update active menu after scrolling
    setTimeout(() => { if (typeof activateMenu === 'function') activateMenu(); }, 300);
  }
});

// ================= ULTRA PRO LIGHTBOX =================
document.addEventListener("DOMContentLoaded", function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("close-lightbox");
  const images = document.querySelectorAll(".photo-card img");
  const leftArrow = document.querySelector(".nav-arrow.left");
  const rightArrow = document.querySelector(".nav-arrow.right");

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex].src;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden"; // blocca scroll
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  function showImage(index) {
    lightboxImg.classList.add("fade");

    setTimeout(() => {
      currentIndex = (index + images.length) % images.length;
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.classList.remove("fade");
    }, 200);
  }

  function nextImage() {
    showImage(currentIndex + 1);
  }

  function prevImage() {
    showImage(currentIndex - 1);
  }

  images.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
  });

  closeBtn.addEventListener("click", closeLightbox);

  rightArrow.addEventListener("click", nextImage);
  leftArrow.addEventListener("click", prevImage);

  // Click outside image closes
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // ESC closes
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  });

  // ================= SWIPE MOBILE =================
  let startX = 0;

  lightbox.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  lightbox.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  });
});

// If the page is loaded with a hash, adjust scroll to the aligned position.
window.addEventListener('load', () => {
  if (location.hash) {
    // small timeout to allow browser layout and any default jump to finish
    setTimeout(() => {
      // use instant reposition so the page doesn't visibly jump after load
      scrollToHash(location.hash, true);
    }, 50);
  }
});

// ================= HEADER SCURO ALLO SCROLL =================
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (!header) return;
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ================= SEZIONE ATTIVA NEL MENU =================
const sections = document.querySelectorAll('section, .container[id]');
const navLinks = document.querySelectorAll('.site-nav a');

function activateMenu() {
  let scrollPos = window.scrollY + header.offsetHeight + 5; // offset
  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.site-nav a[href="#${section.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}
window.addEventListener('scroll', activateMenu);
window.addEventListener('load', activateMenu);

// ================= REVEAL CONTAINER ALLO SCROLL =================
const revealElements = document.querySelectorAll('.container.reveal');
function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add('active');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);