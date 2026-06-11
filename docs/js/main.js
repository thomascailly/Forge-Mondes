/* ============================================================
   FORGEBORN — MAIN.JS
   Navbar, Scroll Reveal, Particles, Shared utilities
   ============================================================ */

/* ── NAVBAR ─────────────────────────────────────────────── */
(function initNavbar() {
  const navbar  = document.querySelector('.navbar');
  const burger  = document.querySelector('.navbar-burger');
  const mobileNav = document.querySelector('.navbar-mobile');
  const links   = document.querySelectorAll('.navbar-links a, .navbar-mobile a');

  if (!navbar) return;

  // Active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Scroll shrink
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);
    lastY = y;
  }, { passive: true });

  // Burger toggle
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileNav.contains(e.target)) {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
})();

/* ── SCROLL REVEAL ───────────────────────────────────────── */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

/* ── HERO PARALLAX ───────────────────────────────────────── */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        heroBg.style.transform = `translateY(${y * 0.35}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── AMBIENT PARTICLES (HERO) ────────────────────────────── */
(function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  const count = 60;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${20 + Math.random() * 70}%;
      --duration: ${6 + Math.random() * 8}s;
      --delay: ${Math.random() * 6}s;
      opacity: 0;
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
    `;
    container.appendChild(p);
  }
})();

/* ── LANGUAGE SWITCHER ───────────────────────────────────── */
(function initLanguage() {
  const flags = document.querySelectorAll('.lang-flag');
  const translatable = document.querySelectorAll('[data-en], [data-fr]');

  function updateLanguage(lang) {
    const isFr = lang === 'fr';
    
    // Update active class on flags
    flags.forEach(f => {
      f.classList.toggle('active', f.dataset.lang === lang);
    });

    // Update text content or attributes
    translatable.forEach(el => {
      const text = isFr ? el.dataset.fr : el.dataset.en;
      if (!text) return;

      // Handle Title and Meta tags specifically
      if (el.tagName === 'TITLE') {
        document.title = text;
        return;
      }
      if (el.tagName === 'META' && el.getAttribute('name') === 'description') {
        el.setAttribute('content', text);
        return;
      }

      // If it's a placeholder
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.hasAttribute('placeholder')) el.placeholder = text;
      }
      
      // Update direct text nodes (preserves SVGs and other elements)
      let foundText = false;
      el.childNodes.forEach(node => {
        if (node.nodeType === 3 && node.textContent.trim().length > 0) {
          node.textContent = text;
          foundText = true;
        }
      });
      
      // Fallback for elements without direct text nodes (e.g. empty spans or buttons with only text)
      if (!foundText && el.children.length === 0) {
        el.textContent = text;
      }
    });

    // Save preference
    localStorage.setItem('forge-mondes-lang', lang);
    document.documentElement.lang = lang;
    
    // Dispatch event for other scripts to respond
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  // Global helper to get translated text in JS
  window.getLangText = function(en, fr) {
    const lang = localStorage.getItem('forge-mondes-lang') || 'en';
    return lang === 'fr' ? fr : en;
  };

  // Event listeners
  flags.forEach(flag => {
    flag.addEventListener('click', () => {
      const lang = flag.dataset.lang;
      updateLanguage(lang);
    });
  });

  // Load saved preference or default
  const saved = localStorage.getItem('forge-mondes-lang') || 'en';
  updateLanguage(saved);
})();

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = document.querySelector('.navbar')?.offsetHeight || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function animateCounter(el, target, duration = 1800, suffix = '') {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, 1800, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initCounters);

/* ── TOAST NOTIFICATION ──────────────────────────────────── */
window.showToast = function(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
    <span>${message}</span>
  `;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: ${type === 'success' ? 'rgba(201,168,106,0.15)' : 'rgba(220,80,80,0.15)'};
    border: 1px solid ${type === 'success' ? 'rgba(201,168,106,0.4)' : 'rgba(220,80,80,0.4)'};
    backdrop-filter: blur(12px);
    color: ${type === 'success' ? '#c9a86a' : '#e05252'};
    padding: 14px 22px;
    border-radius: 12px;
    font-size: 0.88rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 9999;
    animation: toastIn 0.35s ease-out forwards;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  `;
  document.body.appendChild(toast);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastIn {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};
