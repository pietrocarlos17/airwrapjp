// ============================
// COUNTDOWN TIMER
// ============================
(function () {
  const targetMs = 5 * 3600 * 1000 + 42 * 60 * 1000 + 18 * 1000;
  const start = Date.now();
  const targets = [
    { el: document.getElementById('countdown-top'), format: 'long' },
    { el: document.getElementById('countdown-offer'), format: 'short' },
    { el: document.getElementById('countdown-cart'), format: 'short' },
  ];

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const elapsed = Date.now() - start;
    let remaining = Math.max(0, targetMs - elapsed);
    const h = Math.floor(remaining / 3600000);
    remaining -= h * 3600000;
    const m = Math.floor(remaining / 60000);
    remaining -= m * 60000;
    const s = Math.floor(remaining / 1000);

    const longText = `${pad(h)}時間 : ${pad(m)}分 : ${pad(s)}秒`;
    const shortText = `${pad(h)}:${pad(m)}:${pad(s)}`;

    targets.forEach(({ el, format }) => {
      if (!el) return;
      el.textContent = format === 'long' ? longText : shortText;
    });
  }

  tick();
  setInterval(tick, 1000);
})();

// ============================
// STICKY BAR (show after hero)
// ============================
(function () {
  const stickyBar = document.getElementById('sticky-bar');
  if (!stickyBar) return;
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 600) stickyBar.classList.add('show');
    else stickyBar.classList.remove('show');
    lastScroll = y;
  });
})();

// ============================
// CART DRAWER
// ============================
(function () {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const openBtn = document.getElementById('bag-btn');
  const closeBtn = document.getElementById('cart-close');
  const continueBtn = document.getElementById('cart-continue');
  const addToBag = document.getElementById('add-to-bag');
  const bagCount = document.querySelector('.bag-count');
  const cartCount = document.getElementById('cart-count');
  let count = 0;

  function open() {
    drawer.classList.add('open');
    overlay.classList.add('show');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  continueBtn?.addEventListener('click', close);
  addToBag?.addEventListener('click', () => {
    count++;
    if (bagCount) bagCount.textContent = `(${count})`;
    if (cartCount) cartCount.textContent = count;
    open();
  });
})();

// ============================
// QTY CONTROL (drawer)
// ============================
(function () {
  document.querySelectorAll('.qty-control').forEach(ctrl => {
    const buttons = ctrl.querySelectorAll('button');
    const span = ctrl.querySelector('span');
    if (buttons.length < 2 || !span) return;
    let qty = parseInt(span.textContent, 10) || 1;
    buttons[0].addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      span.textContent = qty;
    });
    buttons[1].addEventListener('click', () => {
      qty++;
      span.textContent = qty;
    });
  });
})();

// ============================
// FAQ — ensure only one open at a time
// ============================
(function () {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        items.forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();

// ============================
// SCROLL REVEAL — IntersectionObserver
// ============================
(function () {
  // Tag elements that should reveal on scroll
  const tagSelectors = [
    { sel: '.section-title', cls: 'reveal' },
    { sel: '.section-sub', cls: 'reveal' },
    { sel: '.section-eyebrow', cls: 'reveal' },
    { sel: '.benefits-grid', cls: 'stagger' },
    { sel: '.tech-grid', cls: 'stagger' },
    { sel: '.styles-grid', cls: 'stagger' },
    { sel: '.attachments-grid', cls: 'stagger' },
    { sel: '.reviews-grid', cls: 'stagger' },
    { sel: '.faq-list', cls: 'stagger' },
    { sel: '.editorial-quote', cls: 'reveal reveal-scale' },
    { sel: '.editorial-source', cls: 'reveal' },
    { sel: '.offer-image', cls: 'reveal reveal-left' },
    { sel: '.offer-details', cls: 'reveal reveal-right' },
    { sel: '.reviews-summary', cls: 'reveal' },
    { sel: '.newsletter h2', cls: 'reveal' },
    { sel: '.newsletter-form', cls: 'reveal' },
    { sel: '.footer-col', cls: 'reveal' },
  ];
  tagSelectors.forEach(({ sel, cls }) => {
    document.querySelectorAll(sel).forEach(el => {
      cls.split(' ').forEach(c => el.classList.add(c));
    });
  });

  // Set rating bar widths via CSS var so they animate from 0 → target
  document.querySelectorAll('.rating-row .fill').forEach(fill => {
    const w = fill.style.width;
    if (w) fill.style.setProperty('--bar-width', w);
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .stagger').forEach(el => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal, .stagger').forEach(el => io.observe(el));
})();

// ============================
// HEADER SHADOW ON SCROLL
// ============================
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 8);
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ============================
// ANIMATED NUMBER COUNTERS
// ============================
(function () {
  const animate = (el) => {
    const raw = el.textContent;
    // Match numbers like 4.8, 500,000, 110,000, 12,438
    const match = raw.match(/([\d,]+(?:\.\d+)?)/);
    if (!match) return;
    const targetStr = match[1];
    const target = parseFloat(targetStr.replace(/,/g, ''));
    if (!isFinite(target) || target < 1) return;
    const isDecimal = targetStr.includes('.');
    const hasComma = targetStr.includes(',');
    const prefix = raw.slice(0, match.index);
    const suffix = raw.slice(match.index + match[0].length);
    const duration = 1400;
    const start = performance.now();

    const fmt = (n) => {
      const v = isDecimal ? n.toFixed(1) : Math.round(n).toString();
      if (hasComma) return Number(v).toLocaleString('ja-JP') + (isDecimal ? '' : '');
      return v;
    };

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + fmt(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = raw;
    };
    requestAnimationFrame(step);
  };

  const targets = document.querySelectorAll('.metric strong, .rating-score');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(animate);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  targets.forEach(el => io.observe(el));
})();

// ============================
// LIGHTBOX — click review photos to view full resolution
// ============================
(function () {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbClose = document.getElementById('lightbox-close');
  if (!lb || !lbImg) return;

  const open = (src, alt, w, h) => {
    lbImg.src = src;
    lbImg.alt = alt || '';
    if (lbCaption && w && h) lbCaption.textContent = `${w} × ${h}`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  };

  document.querySelectorAll('.review-photo').forEach(photo => {
    photo.addEventListener('click', () => {
      const img = photo.querySelector('img');
      if (!img) return;
      open(img.src, img.alt, img.naturalWidth, img.naturalHeight);
    });
    photo.setAttribute('role', 'button');
    photo.setAttribute('tabindex', '0');
    photo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        photo.click();
      }
    });
  });

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target === lbImg) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('open')) close();
  });
})();

// ============================
// PARALLAX HERO BACKGROUND (subtle)
// ============================
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  // Inject a style tag we can update efficiently for the ::before pseudo
  const styleEl = document.createElement('style');
  styleEl.id = 'hero-parallax-style';
  document.head.appendChild(styleEl);
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    const max = hero.offsetHeight;
    if (y < max) {
      const offset = y * 0.25;
      styleEl.textContent = `.hero::before { transform: translate3d(0, ${offset}px, 0) scale(1.05); }`;
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  });
})();
