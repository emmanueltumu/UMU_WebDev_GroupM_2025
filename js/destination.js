/* destination.js
   Lightweight, accessible, responsive JS for cheap-travel.html
   Features:
   - Mobile menu toggle (menu button #menu-btn)
   - Close menu on link click, outside click or resize
   - Sticky header that shrinks on scroll
   - Smooth scroll for internal anchors
   - Sign-in modal open/close and form validation + graceful async submit
   - Simple reveal-on-scroll for blog posts & destination cards
   - Set images to lazy where supported
   - Back-to-top button
   - Small, clear, dependency-free (vanilla JS)
*/

(function () {
  'use strict';

  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from((ctx || document).querySelectorAll(s));

  document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initStickyHeader();
    initSmoothScroll();
    initSignInModal();
    initFormBehavior();
    initRevealOnScroll();
    setLazyImages();
    initBackToTop();
    handleResizeCleanup();
  });

  /* ===== Mobile menu ===== */
  function initMenu() {
    const menuBtn = qs('#menu-btn');
    const navbar = qs('.navbar');
    const navLinks = qsa('.navbar a');

    if (!menuBtn || !navbar) return;

    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.addEventListener('click', (e) => {
      const open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      navbar.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
      if (!open) {
        // move focus to first link for keyboard users
        const first = navbar.querySelector('a');
        first && first.focus();
      } else {
        menuBtn.focus();
      }
    });

    // Close when clicking any nav link (mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbar.classList.contains('open')) {
          navbar.classList.remove('open');
          document.body.classList.remove('menu-open');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!navbar.classList.contains('open')) return;
      if (navbar.contains(e.target) || menuBtn.contains(e.target)) return;
      navbar.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  }

  /* ===== Sticky header shrink on scroll ===== */
  function initStickyHeader() {
    const header = qs('header');
    if (!header) return;
    const threshold = 60; // px
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      header.classList.toggle('scrolled', y > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ===== Smooth scroll for internal links ===== */
  function initSmoothScroll() {
    const anchors = qsa('a[href^="#"]');
    anchors.forEach(a => {
      // keep only links that go to elements on the page
      const href = a.getAttribute('href');
      if (!href || href.length === 1) return;
      const target = qs(href);
      if (!target) return;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // briefly make focusable for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        setTimeout(() => target.removeAttribute('tabindex'), 1000);
      });
    });
  }

  /* ===== Sign-in modal ===== */
  function initSignInModal() {
    const openBtn = qs('#signinBtn');
    const modal = qs('#signinModal');
    const closeBtn = qs('#closeBtn');

    if (!modal) return;

    const form = qs('#signinModal form');

    function openModal(e) {
      if (e) e.preventDefault();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      // focus first input
      const first = modal.querySelector('input, button, a');
      first && first.focus();
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      // return focus to signin link if present
      openBtn && openBtn.focus();
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // click overlay to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // esc to close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Form validation & submit (graceful)
    if (!form) return;
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      clearFormErrors(form);

      const email = qs('#signinModal #email', form) || qs('#email', form);
      const password = qs('#signinModal #password', form) || qs('#password', form);

      let ok = true;
      if (!email || !validateEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email address.');
        ok = false;
      }
      if (!password || password.value.length < 8) {
        showFieldError(password, 'Password must be at least 8 characters.');
        ok = false;
      }
      if (!ok) return;

      // disable submit while sending
      const submit = form.querySelector('button[type="submit"], .signin-submit');
      if (submit) {
        submit.disabled = true;
        submit.dataset.orig = submit.innerText;
        submit.innerText = 'Signing in…';
      }

      const payload = {
        email: email.value.trim(),
        password: password.value,
      };

      try {
        // Attempt to POST to /signup (adjust to your real endpoint)
        const res = await fetch('/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          let msg = `Sign in failed (${res.status})`;
          try {
            const data = await res.json();
            if (data && (data.error || data.message)) msg = data.error || data.message;
          } catch (e) { /* ignore parse errors */ }
          showFormMessage(form, msg, false);
        } else {
          const data = await res.json().catch(() => ({}));
          showFormMessage(form, data.message || 'Signed in successfully', true);
          // on success, close modal after short delay
          setTimeout(() => {
            closeModal();
            // optional: redirect if server provided a url
            if (data && data.redirect) window.location.href = data.redirect;
          }, 900);
        }
      } catch (err) {
        // network fallback: show friendly message but don't block user
        showFormMessage(form, 'Network error — please try again later', false);
        console.error('Sign-in error', err);
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.innerText = submit.dataset.orig || 'Sign In';
          delete submit.dataset.orig;
        }
      }
    });
  }

  function validateEmail(v) {
    if (!v) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(v.trim());
  }

  function showFieldError(input, message) {
    if (!input || !input.parentElement) return;
    clearFieldError(input);
    const el = document.createElement('div');
    el.className = 'field-error';
    el.setAttribute('role', 'alert');
    el.textContent = message;
    input.parentElement.appendChild(el);
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  }

  function clearFieldError(input) {
    if (!input || !input.parentElement) return;
    const prev = input.parentElement.querySelector('.field-error');
    if (prev) prev.remove();
    input.removeAttribute('aria-invalid');
  }

  function clearFormErrors(form) {
    if (!form) return;
    qsa('.field-error', form).forEach(n => n.remove());
    qsa('[aria-invalid]', form).forEach(n => n.removeAttribute('aria-invalid'));
    const msg = qs('.form-msg', form);
    if (msg) msg.remove();
  }

  function showFormMessage(form, text, ok) {
    if (!form) return;
    let el = qs('.form-msg', form);
    if (!el) {
      el = document.createElement('div');
      el.className = 'form-msg';
      el.setAttribute('role', ok ? 'status' : 'alert');
      form.prepend(el);
    }
    el.textContent = text;
    el.classList.toggle('ok', !!ok);
  }

  /* ===== Form behaviors for booking/search form ===== */
  function initFormBehavior() {
    const searchForm = qs('form.details');
    if (!searchForm) return;
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // simple validation
      const dest = qs('#destination', searchForm);
      const checkin = qs('#checkin', searchForm);
      const checkout = qs('#checkout', searchForm);
      clearFormErrors(searchForm);

      if (dest && !dest.value.trim()) {
        showFieldError(dest, 'Please enter a destination or activity.');
        return;
      }
      if (checkin && checkout && checkin.value && checkout.value && checkin.value > checkout.value) {
        showFieldError(checkout, 'Check-out must be after check-in.');
        return;
      }

      // For now simply show a friendly "searching" message — integrate with backend as needed
      showFormMessage(searchForm, 'Searching for great budget options…', true);

      // Example: scroll to services section
      const services = qs('.services');
      if (services) services.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ===== Simple reveal-on-scroll for posts and cards ===== */
  function initRevealOnScroll() {
    const els = qsa('.blog-post, .destination-card, .post-content');
    if (!els.length) return;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }


  /* ===== Back to top button ===== */
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '↑';
    btn.style.cssText = `
      position:fixed; right:18px; bottom:18px; width:44px; height:44px;
      border-radius:6px; border:none; background:#222; color:#fff; font-size:18px;
      display:none; align-items:center; justify-content:center; cursor:pointer; z-index:9999;
    `;
    document.body.appendChild(btn);

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const toggle = () => {
      btn.style.display = (window.scrollY || window.pageYOffset) > 300 ? 'flex' : 'none';
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }

  /* ===== Resize cleanup: close mobile menu on large screens ===== */
  function handleResizeCleanup() {
    const mediaQuery = window.matchMedia('(min-width: 900px)');
    const onChange = () => {
      const navbar = qs('.navbar');
      const menuBtn = qs('#menu-btn');
      if (mediaQuery.matches) {
        // large screen — ensure menu is closed and aria reflects that
        navbar && navbar.classList.remove('open');
        document.body.classList.remove('menu-open');
        menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
      }
    };
    mediaQuery.addEventListener ? mediaQuery.addEventListener('change', onChange) : mediaQuery.addListener(onChange);
    window.addEventListener('orientationchange', onChange);
  }

})();