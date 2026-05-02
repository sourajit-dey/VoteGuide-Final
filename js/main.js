/**
 * @file main.js
 * @description App initialization and global UI behaviors.
 *              Single IntersectionObserver for all animations.
 *              Named functions throughout — no anonymous handlers.
 * @author VoteGuide India
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
  buildTimeline();
  buildEligibilityChecker();
  buildRegistrationTabs();
  buildGlossary();
  buildFAQ();
  buildChatbot();

  initNavObserver();
  initSmoothScroll();
  initBackToTop();
  initScrollAnimations();
  initMobileMenu();

  if (typeof initGoogleCharts === 'function') {
    initGoogleCharts();
  }

  const fbReady = initFirebase();
  trackVisit().then(function(count) {
    const el = document.getElementById('visitor-count');
    const label = document.getElementById('visitor-label');
    if (el) el.textContent = count.toLocaleString('en-IN');
    if (label) {
      label.textContent = count === 1
        ? ' citizen has explored VoteGuide'
        : ' citizens have explored VoteGuide';
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js')
        .catch(function() { /* fail silently */ });
    });
  }
});

/**
 * @description Builds registration tabs (new voter, NRI, corrections)
 * @returns {void}
 */
function buildRegistrationTabs() {
  const wrap = document.getElementById('register-content');
  if (!wrap) return;

  const tabs = [
    { key: 'newVoter', label: 'New Voter' },
    { key: 'overseasVoter', label: 'Overseas (NRI)' },
    { key: 'corrections', label: 'Corrections' }
  ];

  let html = '<div class="reg-tab-bar" role="tablist">';
  tabs.forEach(function(t, i) {
    html += '<button class="reg-tab' + (i===0?' active':'') + '"';
    html += ' data-tab="' + t.key + '"';
    html += ' role="tab"';
    html += ' aria-selected="' + (i===0?'true':'false') + '">';
    html += t.label + '</button>';
  });
  html += '</div>';

  tabs.forEach(function(t, i) {
    const steps = ELECTION_DATA.registrationSteps[t.key];
    html += '<div class="reg-panel' + (i===0?' active':'') + '"';
    html += ' data-panel="' + t.key + '"';
    html += ' role="tabpanel">';
    steps.forEach(function(st) {
      html += '<div class="reg-step animate-on-scroll">';
      html += '<div class="reg-step-num">' + st.stepNumber + '</div>';
      html += '<div class="reg-step-content">';
      html += '<h3>' + st.title + '</h3>';
      html += '<p>' + st.description + '</p>';
      html += '<div class="reg-step-tip">' + st.tip + '</div>';
      html += '</div></div>';
    });
    html += '</div>';
  });

  wrap.innerHTML = html;

  const tabBtns = wrap.querySelectorAll('.reg-tab');
  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', handleTabClick);
  });

  /**
   * @description Switches active registration tab
   * @returns {void}
   */
  function handleTabClick() {
    const key = this.getAttribute('data-tab');
    trackRegistrationTab(key);
    wrap.querySelectorAll('.reg-tab').forEach(function(b) {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    wrap.querySelectorAll('.reg-panel').forEach(function(p) {
      p.classList.remove('active');
    });
    this.classList.add('active');
    this.setAttribute('aria-selected', 'true');
    const panel = wrap.querySelector('[data-panel="' + key + '"]');
    if (panel) panel.classList.add('active');
    initScrollAnimations();
  }
}

/** @type {IntersectionObserver|null} Single shared observer */
let scrollObserver = null;

/**
 * @description Initializes scroll animations with single observer
 * @returns {void}
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.animate-on-scroll:not(.visible)'
  );
  if (!elements.length) return;

  if (!scrollObserver) {
    scrollObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
  }

  elements.forEach(function(el) { scrollObserver.observe(el); });
}

/**
 * @description Active nav link observer based on scroll position
 * @returns {void}
 */
function initNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  /**
   * @description Updates active nav link on intersection
   * @param {Array} entries - Intersection entries
   * @returns {void}
   */
  function handleNavIntersect(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  const navObserver = new IntersectionObserver(
    handleNavIntersect,
    { rootMargin: '-30% 0px -60% 0px' }
  );
  sections.forEach(function(s) { navObserver.observe(s); });
}

/**
 * @description Smooth scroll for all anchor links
 * @returns {void}
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  /**
   * @description Handles anchor click with smooth scroll
   * @param {MouseEvent} e - Click event
   * @returns {void}
   */
  function handleAnchorClick(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      const navLinks = document.querySelector('.nav-links');
      const hamburger = document.querySelector('.hamburger');
      if (navLinks) navLinks.classList.remove('open');
      if (hamburger) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  }

  links.forEach(function(link) {
    link.addEventListener('click', handleAnchorClick);
  });
}

/**
 * @description Back to top button behavior
 * @returns {void}
 */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  /**
   * @description Shows/hides button on scroll
   * @returns {void}
   */
  function handleScroll() {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  /**
   * @description Scrolls to top on click
   * @returns {void}
   */
  function handleBackToTopClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('scroll', handleScroll);
  btn.addEventListener('click', handleBackToTopClick);
}

/**
 * @description Mobile hamburger menu
 * @returns {void}
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  /**
   * @description Toggles mobile menu with aria-expanded
   * @returns {void}
   */
  function handleHamburgerClick() {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  }

  hamburger.addEventListener('click', handleHamburgerClick);
}
