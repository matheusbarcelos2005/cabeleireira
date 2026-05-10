/* ════════════════════════════════════════
   HEADER — scroll state + altura dinâmica
════════════════════════════════════════ */
const header = document.getElementById('header');

const updateHeaderHeight = () => {
  document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
};

const handleScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeaderHeight();
};

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', updateHeaderHeight, { passive: true });
handleScroll();

/* ════════════════════════════════════════
   MOBILE NAV
════════════════════════════════════════ */
const navToggle = document.getElementById('navToggle');
const nav       = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.classList.toggle('is-active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ════════════════════════════════════════
   FAQ ACCORDION
════════════════════════════════════════ */
document.querySelectorAll('.faq-item__question').forEach(button => {
  button.addEventListener('click', () => {
    const item   = button.closest('.faq-item');
    const answer = item.querySelector('.faq-item__answer');
    const isOpen = item.classList.contains('is-open');

    document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
      openItem.classList.remove('is-open');
      openItem.querySelector('.faq-item__answer').style.maxHeight = null;
      openItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('is-open');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ════════════════════════════════════════
   COUNTER ANIMATION
════════════════════════════════════════ */
const animateCounter = (el) => {
  const target    = parseInt(el.dataset.count, 10);
  const duration  = 1800;
  const fps       = 60;
  const steps     = duration / (1000 / fps);
  const increment = target / steps;
  let current     = 0;

  const tick = () => {
    current = Math.min(current + increment, target);
    el.textContent = Math.round(current).toLocaleString('pt-BR');
    if (current < target) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

/* ════════════════════════════════════════
   INTERSECTION OBSERVER
════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
