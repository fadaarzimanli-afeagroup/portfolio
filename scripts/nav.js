export function initNav() {
  const header = document.getElementById('site-header');
  const toggle = document.querySelector('.nav__toggle');
  const navLinks = document.getElementById('nav-links');

  if (!header || !toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setNavState(!isOpen);
  });

  navLinks.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => setNavState(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) {
      setNavState(false);
      toggle.focus();
    }
  });

  function setNavState(open) {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.style.overflow = open ? 'hidden' : '';
    navLinks.inert = mq.matches && !open;
  }

  const mq = window.matchMedia('(max-width: 767px)');

  syncInertToViewport();

  mq.addEventListener('change', () => {
    if (!mq.matches) {
      navLinks.inert = false;
      setNavState(false);
    } else {
      syncInertToViewport();
    }
  });

  function syncInertToViewport() {
    navLinks.inert = mq.matches && !header.classList.contains('nav-open');
  }

  const SCROLL_THRESHOLD = 24;
  let ticking = false;

  function updateScrollState() {
    header.classList.toggle('site-header--scrolled', window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });

  updateScrollState();
}

export function initActiveSection() {
  const sections = document.querySelectorAll('main > section[id]');
  const links = document.querySelectorAll('.nav__link[href^="#"]');

  if (!sections.length || !links.length) return;

  const linkMap = new Map(
    [...links].map((link) => [link.getAttribute('href').slice(1), link])
  );

  let currentId = null;

  function activate(id) {
    if (id === currentId) return;
    currentId = id;
    links.forEach((l) => l.removeAttribute('aria-current'));
    if (id && linkMap.has(id)) {
      linkMap.get(id).setAttribute('aria-current', 'true');
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length) activate(visible[0].target.id);
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}
