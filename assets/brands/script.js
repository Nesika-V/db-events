/* ================================================================
   DB EVENTS & PRODUCTIONS — JAVASCRIPT
   Cursor · Loader · Nav · Scroll Reveal · Counters · Horizontal Drag
================================================================ */

(function () {
  'use strict';

  /* ── CUSTOM CURSOR ─────────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover interactions
  const hoverTargets = document.querySelectorAll(
    'a, button, .svc-card, .value-item, .moment-card, .founder-card, .stat-box'
  );
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });

  /* ── LOADER ────────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
      document.body.style.overflow = 'auto';

      // Trigger hero animations after loader
      document.querySelectorAll('.hero-content > *').forEach((el, i) => {
        el.style.animationPlayState = 'running';
      });
    }, 2000);
  });

  /* ── NAV: SCROLL GLASS EFFECT ──────────────────────────────── */
  const nav = document.getElementById('nav');
  function onNavScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onNavScroll, { passive: true });

  /* ── NAV DRAWER ────────────────────────────────────────────── */
  const navToggle  = document.getElementById('navToggle');
  const navDrawer  = document.getElementById('navDrawer');
  let drawerOpen   = false;

  function toggleDrawer(force) {
    drawerOpen = typeof force !== 'undefined' ? force : !drawerOpen;
    navToggle.classList.toggle('active', drawerOpen);
    navDrawer.classList.toggle('open', drawerOpen);
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
  }

  navToggle.addEventListener('click', () => toggleDrawer());

  // Close drawer on link click
  navDrawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // Close on backdrop click
  navDrawer.querySelector('.drawer-bg').addEventListener('click', () => toggleDrawer(false));

  // Stagger drawer links
  const drawerLinks = navDrawer.querySelectorAll('.drawer-links li');
  navToggle.addEventListener('click', () => {
    if (drawerOpen) {
      drawerLinks.forEach((li, i) => {
        li.style.opacity = '0';
        li.style.transform = 'translateX(-20px)';
        setTimeout(() => {
          li.style.transition = `opacity 0.4s ${0.1 + i * 0.07}s, transform 0.4s ${0.1 + i * 0.07}s`;
          li.style.opacity = '1';
          li.style.transform = 'translateX(0)';
        }, 50);
      });
    }
  });

  /* ── NAV DOTS ──────────────────────────────────────────────── */
  const sections = ['hero', 'video-section', 'about', 'services', 'why', 'contact'];
  const navDots  = document.querySelectorAll('.nav-dot');

  navDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  function updateNavDots() {
    const scrollMid = window.scrollY + window.innerHeight / 2;
    sections.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const top    = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (scrollMid >= top && scrollMid < bottom) {
        navDots.forEach((d) => d.classList.remove('active'));
        if (navDots[i]) navDots[i].classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateNavDots, { passive: true });

  /* ── SCROLL REVEAL ─────────────────────────────────────────── */
  function addRevealClasses() {
    const targets = document.querySelectorAll(
      '.about-text, .about-visual, .service-block-text, .service-block-visual, ' +
      '.why-text, .why-values, .exp-text, .exp-visual, .contact-inner, ' +
      '.footer-top, .svc-card, .value-item, .stat-box, .founder-card, ' +
      '.moment-card, .pillar, .service-list li'
    );
    targets.forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger siblings
      if (el.parentElement && el.parentElement.children.length > 1) {
        const sibIdx = Array.from(el.parentElement.children).indexOf(el);
        if (sibIdx > 0) el.classList.add('reveal-delay-' + Math.min(sibIdx, 3));
      }
    });
  }
  addRevealClasses();

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ── COUNTER ANIMATION ─────────────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.target === '100' ? '%' : '+';
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('.stat-number[data-target]').forEach((el) =>
    counterObserver.observe(el)
  );

  /* ── PARALLAX ──────────────────────────────────────────────── */
  function onParallax() {
    const scrollY = window.scrollY;

    // Orbs
    document.querySelectorAll('.orb').forEach((orb, i) => {
      const speed = 0.08 + i * 0.03;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });

    // Hero title lines
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, i) => {
      const speed = 0.04 + i * 0.02;
      if (scrollY < window.innerHeight) {
        line.style.transform = `translateY(${scrollY * speed}px)`;
      }
    });
  }
  window.addEventListener('scroll', onParallax, { passive: true });

  /* ── HORIZONTAL SERVICES DRAG ──────────────────────────────── */
  const track = document.getElementById('servicesTrack');
  if (track) {
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX    = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.style.cursor = 'grab';
    });
    track.addEventListener('mouseup', () => {
      isDown = false;
      track.style.cursor = 'grab';
    });
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });

    // Touch
    track.addEventListener('touchstart', (e) => {
      startX     = e.touches[0].pageX - track.offsetLeft;
      scrollLeft  = track.scrollLeft;
    }, { passive: true });
    track.addEventListener('touchmove', (e) => {
      const x    = e.touches[0].pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    }, { passive: true });
  }

  /* ── SMOOTH ANCHOR SCROLL ──────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── CONTACT FORM ──────────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn  = form.querySelector('.btn-submit');
      const span = btn.querySelector('span');
      btn.style.background = 'linear-gradient(135deg, #4CAF50, #2e7d32)';
      span.textContent = 'Enquiry Sent! ✓';
      btn.disabled = true;
      setTimeout(() => {
        span.textContent = 'Send Enquiry';
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 4000);
    });
  }

  /* ── MAGNETIC BUTTONS ──────────────────────────────────────── */
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x    = e.clientX - rect.left - rect.width  / 2;
      const y    = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── VIDEO POSTER FALLBACK ─────────────────────────────────── */
  const video = document.getElementById('bgVideo');
  if (video) {
    video.addEventListener('error', () => {
      video.parentElement.style.background =
        'url("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80") center/cover';
    });
  }

  /* ── SECTION TRANSITION LINES ──────────────────────────────── */
  // Subtle background shift on scroll
  const sectionColors = {
    'hero':          'var(--dark)',
    'video-section': '#050403',
    'about':         'var(--dark)',
    'services':      'var(--dark2)',
    'why':           'var(--dark)',
    'experience':    'var(--dark2)',
    'contact':       'var(--dark)',
  };

  function updateBg() {
    const scrollMid = window.scrollY + window.innerHeight / 2;
    Object.keys(sectionColors).forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (scrollMid >= el.offsetTop && scrollMid < el.offsetTop + el.offsetHeight) {
        document.body.style.background = sectionColors[id];
      }
    });
  }
  window.addEventListener('scroll', updateBg, { passive: true });

  console.log('%cDB Events & Productions', 'font-size:20px;color:#C8A96E;font-weight:bold');
  console.log('%cBuilt with ♥ in Coimbatore', 'font-size:12px;color:#888');
})();