/* ==========================================================================
   OLYMPIC ENTREPRENEUR — Interactions
   Every animation here expresses one idea: Movement → Progress → Growth.
   ========================================================================== */
(function () {
  'use strict';
  window.OE_READY = true;

  var doc = document;
  var root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var raf = window.requestAnimationFrame.bind(window);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 4); };
  var easeInOut = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Shared scroll loop (one listener, rAF-throttled) ---------- */
  var scrollFns = [];
  var scrollQueued = false;
  function onScroll(fn) { scrollFns.push(fn); fn(); }
  function runScroll() { scrollQueued = false; for (var i = 0; i < scrollFns.length; i++) scrollFns[i](); }
  function queueScroll() { if (!scrollQueued) { scrollQueued = true; raf(runScroll); } }
  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', queueScroll);

  function whenVisible(el, cb, opts) {
    if (!el) return;
    if (!hasIO) { cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { cb(); io.disconnect(); } });
    }, opts || { threshold: 0.3 });
    io.observe(el);
  }
  function watchVisibility(el, cb) {
    if (!el || !hasIO) { cb(true); return; }
    new IntersectionObserver(function (entries) { cb(entries[0].isIntersecting); }).observe(el);
  }

  /* ---------- Page entrance & exit ---------- */
  function initTransitions() {
    raf(function () { doc.body.classList.add('is-ready'); });
    window.addEventListener('pageshow', function () { doc.body.classList.remove('is-leaving'); doc.body.classList.add('is-ready'); });
    doc.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === '_blank' || a.hasAttribute('download') || reduce) return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.protocol !== location.protocol || url.host !== location.host) return;
      if (url.pathname === location.pathname) return; // same-page anchors scroll natively
      if (!/\.html?$/i.test(url.pathname) && !/\/$/.test(url.pathname)) return;
      e.preventDefault();
      doc.body.classList.add('is-leaving');
      setTimeout(function () { location.href = a.href; }, 260);
    });
  }

  /* ---------- Navigation: compact on scroll + reading progress ---------- */
  function initNav() {
    var nav = $('[data-nav]');
    var bar = $('[data-progress]');
    if (!nav) return;
    onScroll(function () {
      var y = window.scrollY || window.pageYOffset;
      nav.classList.toggle('is-scrolled', y > 24);
      var max = root.scrollHeight - window.innerHeight;
      if (bar) bar.style.setProperty('--p', max > 0 ? clamp(y / max, 0, 1).toFixed(4) : 0);
    });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var btn = $('[data-burger]');
    var menu = $('[data-menu]');
    if (!btn || !menu) return;
    function set(open) {
      root.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open) {
        var first = $('a', menu);
        setTimeout(function () { if (first) first.focus({ preventScroll: true }); }, 450);
      }
    }
    btn.addEventListener('click', function () { set(!root.classList.contains('menu-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { set(false); btn.focus(); }
    });
    var mq = window.matchMedia('(min-width: 1181px)');
    var onChange = function (e) { if (e.matches) set(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = $$('[data-reveal], [data-word]');
    if (!hasIO) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Animated statistics ---------- */
  function formatCount(el, v) {
    var dec = +(el.dataset.dec || 0);
    var pad = +(el.dataset.pad || 0);
    var s = pad ? String(Math.round(v)).padStart(pad, '0')
      : Number(v).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    return (el.dataset.prefix || '') + s + (el.dataset.suffix || '');
  }
  function tweenCount(el, from, to, dur) {
    if (reduce || !dur) { el.textContent = formatCount(el, to); return; }
    var t0 = performance.now();
    (function step(t) {
      var p = clamp((t - t0) / dur, 0, 1);
      el.textContent = formatCount(el, from + (to - from) * easeOut(p));
      if (p < 1) raf(step);
    })(t0);
  }
  function initCounters() {
    $$('[data-count]').forEach(function (el) {
      el.textContent = formatCount(el, 0);
      whenVisible(el, function () { tweenCount(el, 0, parseFloat(el.dataset.count), 1800); }, { threshold: 0.5 });
    });
  }

  /* ---------- Cursor spotlight on premium cards ---------- */
  function initSpotlight() {
    if (!finePointer) return;
    doc.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.spot');
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
    }, { passive: true });
  }

  /* ---------- Hero particles: gold dust rising, faint network links ---------- */
  function initParticles() {
    var canvas = $('[data-particles]');
    if (!canvas || reduce || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, parts = [], running = false, visible = true;
    var LINK = 110;
    function make() {
      return {
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.25 + 0.35,
        vy: -(Math.random() * 0.22 + 0.05), vx: (Math.random() - 0.5) * 0.1,
        a: Math.random() * 0.55 + 0.15, tw: Math.random() * 6.28, ts: Math.random() * 0.02 + 0.004,
        cyan: Math.random() < 0.16
      };
    }
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(w < 700 ? 34 : 88, Math.round((w * h) / 15000));
      parts = []; for (var i = 0; i < count; i++) parts.push(make());
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      var i, j, p, q, dx, dy, d2;
      ctx.lineWidth = 0.6;
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        for (j = i + 1; j < parts.length; j++) {
          q = parts[j]; dx = p.x - q.x; dy = p.y - q.y; d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            ctx.strokeStyle = 'rgba(212,175,55,' + ((1 - Math.sqrt(d2) / LINK) * 0.085).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        p.x += p.vx; p.y += p.vy; p.tw += p.ts;
        if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w; }
        if (p.x < -8) p.x = w + 8; else if (p.x > w + 8) p.x = -8;
        var al = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        ctx.fillStyle = p.cyan ? 'rgba(56,189,248,' + (al * 0.8).toFixed(3) + ')' : 'rgba(236,205,120,' + al.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
        if (p.r > 1.3) {
          ctx.fillStyle = 'rgba(236,205,120,' + (al * 0.12).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.2832); ctx.fill();
        }
      }
      raf(frame);
    }
    function sync() {
      var should = visible && !doc.hidden;
      if (should && !running) { running = true; raf(frame); } else if (!should) running = false;
    }
    resize();
    window.addEventListener('resize', function () { resize(); });
    doc.addEventListener('visibilitychange', sync);
    watchVisibility(canvas, function (v) { visible = v; sync(); });
  }

  /* ---------- Mouse parallax for hero compositions ---------- */
  function initParallax() {
    if (!finePointer || reduce) return;
    $$('[data-parallax]').forEach(function (scene) {
      var layers = $$('[data-depth]', scene);
      var host = scene.closest('section') || scene;
      var tx = 0, ty = 0, cx = 0, cy = 0, active = false;
      function loop() {
        cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
        for (var i = 0; i < layers.length; i++) {
          var d = +layers[i].dataset.depth;
          layers[i].style.transform = 'translate3d(' + (-cx * d).toFixed(2) + 'px,' + (-cy * d).toFixed(2) + 'px,0)';
        }
        if (Math.abs(tx - cx) > 0.0015 || Math.abs(ty - cy) > 0.0015) raf(loop); else active = false;
      }
      host.addEventListener('pointermove', function (e) {
        var r = scene.getBoundingClientRect();
        tx = clamp((e.clientX - (r.left + r.width / 2)) / r.width, -1, 1);
        ty = clamp((e.clientY - (r.top + r.height / 2)) / r.height, -1, 1);
        if (!active) { active = true; raf(loop); }
      });
      host.addEventListener('pointerleave', function () { tx = 0; ty = 0; if (!active) { active = true; raf(loop); } });
    });
  }

  /* ---------- Mini-site mockups (fictional concept brands) ---------- */
  var MS = {
    brand: {
      logo: 'YOUR BRAND', links: ['Services', 'Work', 'About', 'Contact'], eyebrow: 'Premium studio',
      title: 'Your brand, <i>elevated.</i>', sub: 'A digital home designed to earn trust at first glance.',
      cta: 'Get started', ghost: 'Our work', cards: ['Strategy', 'Design', 'Growth'],
      quote: 'Clarity, craft and a clear next step.', stats: [['01', 'Vision'], ['02', 'Build'], ['03', 'Launch']], art: ''
    },
    business: {
      logo: 'NORTHVALE', links: ['Advisory', 'Sectors', 'Insights', 'Contact'], eyebrow: 'Strategy & advisory',
      title: 'Clarity for <i>complex</i> decisions.', sub: 'Independent advisory for founders and leadership teams.',
      cta: 'Book a call', ghost: 'Our approach', cards: ['Strategy', 'Operations', 'Growth'],
      quote: 'Decisions deserve evidence, not assumptions.', stats: [['12', 'Sectors'], ['3', 'Offices'], ['1', 'Standard']],
      art: '<span class="bars"><i></i><i></i><i></i><i></i><i></i></span><span class="line"></span>'
    },
    realestate: {
      logo: 'MAISON SOLENNE', links: ['Residences', 'Locations', 'Journal', 'Contact'], eyebrow: 'Private residences',
      title: 'Homes with a <i>sense of place.</i>', sub: 'Curated coastal properties, presented with care.',
      cta: 'View residences', ghost: 'Book a viewing', cards: ['Villas', 'Apartments', 'Estates'],
      quote: 'Light, space and the sound of the sea.', stats: [['4', 'Coastlines'], ['28', 'Residences'], ['1', 'Advisor']],
      art: '<span class="sun"></span><span class="house"><i></i><i></i><i></i><i></i><i></i></span><span class="pool"></span>'
    },
    restaurant: {
      logo: 'OSTERIA LUMINA', links: ['Menu', 'Wine', 'Events', 'Visit'], eyebrow: 'Seasonal Italian kitchen',
      title: 'Slow dinners, <i>bright</i> flavours.', sub: 'Handmade pasta and wood-fired plates, served late.',
      cta: 'Reserve a table', ghost: 'See the menu', cards: ['Menu', 'Wine list', 'Private dining'],
      quote: 'Every plate starts at the market.', stats: [['6', 'Courses'], ['40', 'Wines'], ['1', 'Kitchen']],
      art: '<span class="plate"></span><span class="fork"></span>'
    },
    ecommerce: {
      logo: 'ATELIER OMBRE', links: ['Shop', 'Collections', 'Journal', 'Cart (0)'], eyebrow: 'New collection',
      title: 'Objects made to last.', sub: 'Considered design for everyday rituals.',
      cta: 'Shop now', ghost: 'Lookbook', cards: ['Eau de parfum', 'Stoneware cup', 'Linen throw'],
      quote: 'Fewer things, chosen well.', stats: [['€68', 'Parfum'], ['€32', 'Cup'], ['€95', 'Throw']],
      art: '<span class="pedestal"></span><span class="bottle"></span>'
    },
    professional: {
      logo: 'HARLOW & FINCH', links: ['Practice', 'People', 'Insights', 'Contact'], eyebrow: 'Legal counsel',
      title: 'Counsel you can <i>build on.</i>', sub: 'Corporate, property and private client law.',
      cta: 'Arrange a consultation', ghost: 'Practice areas', cards: ['Corporate', 'Property', 'Private client'],
      quote: 'Precise advice, plainly explained.', stats: [['3', 'Practices'], ['9', 'Partners'], ['1', 'Firm']],
      art: '<span class="pediment"></span><span class="cols"><i></i><i></i><i></i><i></i><i></i></span><span class="base"></span>'
    },
    personal: {
      logo: 'ELENA MARSH', links: ['Keynotes', 'Books', 'Advisory', 'Contact'], eyebrow: 'Speaker · Author · Advisor',
      title: 'Ideas that <i>move</i> rooms.', sub: 'Keynotes and advisory on leadership and change.',
      cta: 'Book Elena', ghost: 'Watch talks', cards: ['Keynotes', 'Books', 'Advisory'],
      quote: 'Leadership is a practice, not a title.', stats: [['2', 'Books'], ['5', 'Keynotes'], ['1', 'Mission']],
      art: '<span class="head"></span><span class="body"></span>'
    }
  };
  var MS_NAMES = { business: 'Northvale Advisory', realestate: 'Maison Solenne', restaurant: 'Osteria Lumina', ecommerce: 'Atelier Ombre', professional: 'Harlow & Finch', personal: 'Elena Marsh' };
  var MS_CATS = { business: 'Business', realestate: 'Real Estate', restaurant: 'Restaurant', ecommerce: 'E-commerce', professional: 'Professional Services', personal: 'Personal Brand' };

  function msMarkup(key) {
    var d = MS[key] || MS.brand;
    var h = '<div class="ms ms--' + key + '"><div class="ms__page">';
    h += '<div class="ms-nav"><span class="ms-logo">' + d.logo + '</span><span class="ms-links">' +
      d.links.map(function (l) { return '<span>' + l + '</span>'; }).join('') +
      '</span><span class="ms-cta">' + d.cta + '</span><span class="ms-burger"><i></i><i></i><i></i></span></div>';
    h += '<div class="ms-hero"><div class="ms-copy"><div class="ms-eyebrow">' + d.eyebrow + '</div><div class="ms-title">' + d.title +
      '</div><div class="ms-sub">' + d.sub + '</div><div class="ms-btns"><span class="ms-btn">' + d.cta +
      '</span><span class="ms-btn ms-btn--ghost">' + d.ghost + '</span></div></div><div class="ms-art"><div class="art art--' + key + '">' + d.art + '</div></div></div>';
    h += '<div class="ms-cards">' + d.cards.map(function (c) {
      return '<div class="ms-card"><div class="ms-thumb"></div><b>' + c + '</b><span class="ms-lines"><i></i><i></i></span></div>';
    }).join('') + '</div>';
    h += '<div class="ms-band"><q>' + d.quote + '</q><div class="ms-stats">' + d.stats.map(function (s) {
      return '<span><b>' + s[0] + '</b>' + s[1] + '</span>';
    }).join('') + '</div></div>';
    h += '<div class="ms-foot"><span class="ms-logo">' + d.logo + '</span><span class="ms-lines"><i></i><i></i></span><span class="ms-lines"><i></i><i></i></span><span class="ms-lines"><i></i><i></i></span></div>';
    return h + '</div></div>';
  }
  function measureMs(host) {
    var ms = host.firstElementChild;
    if (!ms) return;
    var page = ms.firstElementChild;
    var dist = Math.max(0, page.offsetHeight - ms.clientHeight);
    ms.style.setProperty('--ms-scroll', (-dist) + 'px');
    if (host.hasAttribute('data-ms-static')) page.style.transform = 'translateY(' + (-dist * 0.55) + 'px)';
  }
  function renderMs(host) {
    host.innerHTML = msMarkup(host.dataset.ms);
    host.setAttribute('aria-hidden', 'true');
    measureMs(host);
  }
  function initMiniSites() {
    var hosts = $$('[data-ms]');
    if (!hosts.length) return;
    hosts.forEach(renderMs);
    var remeasure = function () { hosts.forEach(measureMs); };
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(remeasure);
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () { remeasure(); });
      hosts.forEach(function (h) { ro.observe(h.parentElement); });
    } else window.addEventListener('resize', remeasure);
  }

  /* ---------- Websites: concept showcase with device trio ---------- */
  function initShowcase() {
    var sc = $('[data-showcase]');
    if (!sc) return;
    var tabs = $$('[role="tab"]', sc);
    var stage = $('.showcase__stage', sc);
    var name = $('[data-showcase-name]', sc);
    var cat = $('[data-showcase-cat]', sc);
    function select(tab, focus) {
      tabs.forEach(function (t) { var on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      if (focus) tab.focus();
      var key = tab.dataset.concept;
      stage.classList.add('is-swapping');
      setTimeout(function () {
        $$('[data-ms]', stage).forEach(function (h) { h.dataset.ms = key; renderMs(h); });
        if (name) name.textContent = MS_NAMES[key];
        if (cat) cat.textContent = MS_CATS[key];
        raf(function () { stage.classList.remove('is-swapping'); });
      }, reduce ? 0 : 320);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (n) { e.preventDefault(); select(tabs[(i + n + tabs.length) % tabs.length], true); }
      });
    });
  }

  /* ---------- Websites: wireframe → final design split ---------- */
  function initBuild() {
    var b = $('[data-build]');
    if (!b) return;
    var screen = $('.win__screen', b);
    var split = 50, auto = !reduce, dragging = false, t0 = performance.now(), resumeTimer, visible = true;
    function set(v) {
      split = clamp(v, 3, 97);
      screen.style.setProperty('--split', split.toFixed(2) + '%');
      screen.setAttribute('aria-valuenow', Math.round(split));
    }
    function fromEvent(e) { var r = screen.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); }
    function pause() { auto = false; clearTimeout(resumeTimer); resumeTimer = setTimeout(function () { if (!reduce) { auto = true; t0 = performance.now() - Math.asin((split - 50) / 34) * 2600; } }, 5000); }
    screen.addEventListener('pointerdown', function (e) { dragging = true; pause(); screen.setPointerCapture(e.pointerId); fromEvent(e); });
    screen.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    screen.addEventListener('pointerup', function () { dragging = false; });
    screen.addEventListener('pointercancel', function () { dragging = false; });
    screen.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); pause(); set(split + (e.key === 'ArrowRight' ? 5 : -5)); }
    });
    watchVisibility(b, function (v) { visible = v; });
    set(50);
    (function loop(t) {
      if (auto && !dragging && visible) set(50 + Math.sin((t - t0) / 2600) * 34);
      raf(loop);
    })(t0);
  }

  /* ---------- Home: scroll-linked process timeline ---------- */
  function initProcess() {
    var wrap = $('[data-process]');
    if (!wrap) return;
    var list = $('.steps', wrap);
    var steps = $$('.step', wrap);
    var fill = $('[data-steps-fill]', wrap);
    var num = $('[data-step-num]', wrap);
    var name = $('[data-step-name]', wrap);
    var bar = $('[data-step-bar]', wrap);
    var current = -1;
    onScroll(function () {
      var mark = window.innerHeight * 0.58;
      var r = list.getBoundingClientRect();
      var p = clamp((mark - r.top - 24) / Math.max(1, r.height - 48), 0, 1);
      fill.style.setProperty('--p', p.toFixed(4));
      var idx = 0, started = r.top < mark;
      steps.forEach(function (s, i) { if (s.getBoundingClientRect().top + 24 < mark) idx = i; });
      steps.forEach(function (s, i) {
        s.classList.toggle('is-done', started && i < idx);
        s.classList.toggle('is-active', started && i === idx);
      });
      if (idx !== current) {
        current = idx;
        if (num) num.textContent = String(idx + 1).padStart(2, '0');
        if (name) name.textContent = steps[idx].dataset.step;
      }
      if (bar) bar.style.setProperty('--p', started ? ((idx + 1) / steps.length).toFixed(3) : 0);
    });
  }

  /* ---------- Home: chronograph dial — ascent to the goal ---------- */
  function initDial() {
    var dial = $('[data-dial]');
    if (!dial) return;
    var g = $('[data-ticks]', dial);
    var NS = 'http://www.w3.org/2000/svg';
    var ticks = [];
    for (var i = 0; i < 60; i++) {
      var major = i % 5 === 0;
      var a = (i / 60) * Math.PI * 2 - Math.PI / 2;
      var r1 = major ? 224 : 232, r2 = 244;
      var ln = doc.createElementNS(NS, 'line');
      ln.setAttribute('x1', (270 + r1 * Math.cos(a)).toFixed(2));
      ln.setAttribute('y1', (270 + r1 * Math.sin(a)).toFixed(2));
      ln.setAttribute('x2', (270 + r2 * Math.cos(a)).toFixed(2));
      ln.setAttribute('y2', (270 + r2 * Math.sin(a)).toFixed(2));
      ln.setAttribute('class', 'tick' + (major ? ' tick--major' : ''));
      g.appendChild(ln); ticks.push(ln);
    }
    var prog = $('[data-dial-progress]', dial);
    var runner = $('[data-runner]', dial);
    var inner = $$('[data-inner]', dial);
    var len = prog.getTotalLength();
    function render(e) {
      prog.style.strokeDashoffset = (1 - e).toFixed(4);
      var pt = prog.getPointAtLength(len * e);
      runner.setAttribute('cx', pt.x.toFixed(2)); runner.setAttribute('cy', pt.y.toFixed(2));
      var lit = 30 + 30 * e;
      ticks.forEach(function (t, k) { t.classList.toggle('on', (k >= 30 && k <= lit) || (k === 0 && e >= 0.999)); });
      inner.forEach(function (c, k) { c.style.strokeDashoffset = (1 - clamp(e * 1.25 - k * 0.12, 0, 1)).toFixed(4); });
    }
    render(0);
    whenVisible(dial, function () {
      if (reduce) { render(1); return; }
      var t0 = performance.now(), dur = 3200;
      (function frame(t) {
        var p = clamp((t - t0) / dur, 0, 1);
        render(easeInOut(p));
        if (p < 1) raf(frame);
      })(t0);
    }, { threshold: 0.45 });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    $$('[data-faq]').forEach(function (faq) {
      var items = $$('.faq__item', faq);
      items.forEach(function (item) {
        var btn = $('button', item);
        btn.addEventListener('click', function () {
          var open = !item.classList.contains('is-open');
          items.forEach(function (o) {
            if (o !== item) { o.classList.remove('is-open'); $('button', o).setAttribute('aria-expanded', 'false'); }
          });
          item.classList.toggle('is-open', open);
          btn.setAttribute('aria-expanded', String(open));
        });
      });
    });
  }

  /* ---------- Advertising: conceptual campaign dashboard ---------- */
  function initDashboard() {
    var dash = $('[data-dash]');
    if (!dash) return;
    // Illustrative figures only — they visualise the management process, not client results.
    var DATA = {
      google: {
        impressions: 184200, clicks: 9640, conversions: 412, cpc: 0.62, spend: 5977, reach: 96400, split: [100, 0],
        a: [420, 510, 560, 610, 590, 700, 760, 820, 880, 910, 980, 1040], b: [14, 17, 19, 22, 21, 27, 30, 33, 37, 40, 45, 49]
      },
      meta: {
        impressions: 326800, clicks: 7150, conversions: 286, cpc: 0.41, spend: 2932, reach: 158300, split: [0, 100],
        a: [380, 420, 470, 450, 520, 560, 610, 590, 650, 700, 720, 780], b: [9, 11, 13, 12, 16, 18, 21, 20, 24, 27, 29, 33]
      },
      combined: {
        impressions: 511000, clicks: 16790, conversions: 698, cpc: 0.53, spend: 8909, reach: 231700, split: [59, 41],
        a: [800, 930, 1030, 1060, 1110, 1260, 1370, 1410, 1530, 1610, 1700, 1820], b: [23, 28, 32, 34, 37, 45, 51, 53, 61, 67, 74, 82]
      }
    };
    var LOG = [
      ['search-ads', 'Search terms reviewed, negatives added', 'Google Ads'],
      ['wallet', 'Daily budget pacing checked', 'All channels'],
      ['edit', 'New ad variation launched for testing', 'Google Ads'],
      ['users', 'Audience segment refined', 'Meta Ads'],
      ['crosshair', 'Conversion tracking verified', 'All channels'],
      ['spark', 'Creative refreshed to limit ad fatigue', 'Meta Ads'],
      ['sliders', 'Bids adjusted on top keywords', 'Google Ads'],
      ['return', 'Retargeting audience updated', 'Meta Ads'],
      ['chart', 'Weekly performance summary prepared', 'All channels']
    ];
    var W = 640, H = 240, PL = 34, PR = 12, PT = 14, PB = 28;
    var chart = $('[data-chart]', dash);
    var l1 = $('.l1', chart), l2 = $('.l2', chart), a1 = $('.a1', chart);
    var cursor = $('.cursor', chart), d1 = $('.dot1', chart), d2 = $('.dot2', chart);
    var tip = $('[data-tip]', dash);
    var wrap = $('.chart-wrap', dash);
    var state = { a: DATA.combined.a.map(function () { return 0; }), b: DATA.combined.b.map(function () { return 0; }) };
    var shown = null, key = 'combined';

    // axis & grid
    var gGrid = $('.grid', chart), gAxis = $('.axis', chart), NS = 'http://www.w3.org/2000/svg';
    for (var gi = 0; gi <= 4; gi++) {
      var y = PT + ((H - PT - PB) / 4) * gi;
      var gl = doc.createElementNS(NS, 'line');
      gl.setAttribute('x1', PL); gl.setAttribute('x2', W - PR); gl.setAttribute('y1', y); gl.setAttribute('y2', y);
      gGrid.appendChild(gl);
    }
    for (var wi = 0; wi < 12; wi += 1) {
      if (wi % 2) continue;
      var tx = doc.createElementNS(NS, 'text');
      tx.setAttribute('x', xAt(wi)); tx.setAttribute('y', H - 8); tx.setAttribute('text-anchor', 'middle');
      tx.textContent = 'W' + (wi + 1);
      gAxis.appendChild(tx);
    }
    function xAt(i) { return PL + ((W - PL - PR) / 11) * i; }
    function pts(arr, max) { return arr.map(function (v, i) { return [xAt(i), PT + (H - PT - PB) * (1 - v / max)]; }); }
    function smooth(p) {
      var d = 'M' + p[0][0].toFixed(1) + ' ' + p[0][1].toFixed(1);
      for (var i = 0; i < p.length - 1; i++) {
        var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
        var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
        var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += 'C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
      }
      return d;
    }
    var MAXA = 1900, MAXB = 90;
    function draw() {
      var pa = pts(state.a, MAXA), pb = pts(state.b, MAXB);
      var da = smooth(pa);
      l1.setAttribute('d', da);
      a1.setAttribute('d', da + 'L' + xAt(11) + ' ' + (H - PB) + 'L' + PL + ' ' + (H - PB) + 'Z');
      l2.setAttribute('d', smooth(pb));
    }
    function hover(i) {
      var pa = pts(state.a, MAXA)[i], pb = pts(state.b, MAXB)[i];
      cursor.setAttribute('x1', pa[0]); cursor.setAttribute('x2', pa[0]);
      d1.setAttribute('cx', pa[0]); d1.setAttribute('cy', pa[1]);
      d2.setAttribute('cx', pb[0]); d2.setAttribute('cy', pb[1]);
      var rect = chart.getBoundingClientRect(), scale = rect.width / W;
      tip.style.left = (pa[0] * scale) + 'px';
      tip.style.top = (Math.min(pa[1], pb[1]) * scale) + 'px';
      tip.innerHTML = 'Week ' + (i + 1) + ' · <b>' + Math.round(state.a[i]).toLocaleString('en-US') + '</b> clicks · <b>' + Math.round(state.b[i]) + '</b> conversions';
    }
    wrap.addEventListener('pointermove', function (e) {
      var r = chart.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * W;
      hover(clamp(Math.round((x - PL) / ((W - PL - PR) / 11)), 0, 11));
    });

    var kpiEls = {};
    $$('[data-kpi]', dash).forEach(function (el) { kpiEls[el.dataset.kpi] = el; });
    function kpiValues(d) {
      return { impressions: d.impressions, clicks: d.clicks, ctr: (d.clicks / d.impressions) * 100, conversions: d.conversions, cpc: d.cpc, spend: d.spend, reach: d.reach };
    }
    function setDataset(k) {
      key = k;
      chart.classList.add('is-live');
      var d = DATA[k], from = { a: state.a.slice(), b: state.b.slice() };
      var prev = shown ? kpiValues(DATA[shown]) : null, next = kpiValues(d);
      Object.keys(kpiEls).forEach(function (n) { tweenCount(kpiEls[n], prev ? prev[n] : 0, next[n], 1300); });
      var t0 = performance.now(), dur = reduce ? 0 : 1100;
      (function frame(t) {
        var p = dur ? clamp((t - t0) / dur, 0, 1) : 1, e = easeInOut(p);
        state.a = from.a.map(function (v, i) { return v + (d.a[i] - v) * e; });
        state.b = from.b.map(function (v, i) { return v + (d.b[i] - v) * e; });
        draw(); hover(11);
        if (p < 1) raf(frame);
      })(t0);
      // funnel (square-root scale keeps small stages visible)
      var f = [['impressions', d.impressions], ['reach', d.reach], ['clicks', d.clicks], ['conversions', d.conversions]];
      f.forEach(function (row) {
        var el = $('[data-funnel="' + row[0] + '"]', dash);
        if (!el) return;
        $('i', el.parentElement.nextElementSibling || el).style.setProperty('--w', (Math.sqrt(row[1] / d.impressions) * 100).toFixed(1) + '%');
        el.textContent = row[1].toLocaleString('en-US');
      });
      var C = 2 * Math.PI * 36;
      var dg = $('.d-g', dash), dm = $('.d-m', dash);
      dg.setAttribute('stroke-dasharray', (C * d.split[0] / 100).toFixed(1) + ' ' + C.toFixed(1));
      dm.setAttribute('stroke-dasharray', (C * d.split[1] / 100).toFixed(1) + ' ' + C.toFixed(1));
      dm.setAttribute('stroke-dashoffset', (-C * d.split[0] / 100).toFixed(1));
      $('[data-split="g"]', dash).textContent = d.split[0] + '%';
      $('[data-split="m"]', dash).textContent = d.split[1] + '%';
      shown = k;
    }
    var tabs = $$('[data-set]', dash);
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (o) { o.setAttribute('aria-selected', String(o === t)); });
        setDataset(t.dataset.set);
      });
    });

    // optimisation log — shows the ongoing management work
    var logEl = $('[data-log]', dash), li = 0;
    function logItem(entry, isNew, ago) {
      return '<div class="log__item' + (isNew ? ' is-new' : '') + '"><svg class="icon"><use href="#i-' + entry[0] + '"/></svg><div>' + entry[1] + '<small>' + entry[2] + ' · ' + ago + '</small></div></div>';
    }
    function renderLog(isNew) {
      var html = '';
      var ages = ['just now', '12 min ago', '1 h ago', '3 h ago'];
      for (var k = 0; k < 4; k++) html += logItem(LOG[(li - k + LOG.length * 4) % LOG.length], isNew && k === 0, ages[k]);
      logEl.innerHTML = html;
    }
    li = 3; renderLog(false);

    draw();
    var started = false, visible = false;
    whenVisible(dash, function () { started = true; setDataset('combined'); }, { threshold: 0.25 });
    watchVisibility(dash, function (v) { visible = v; });
    if (!reduce) setInterval(function () { if (started && visible && !doc.hidden) { li++; renderLog(true); } }, 3400);
  }

  /* ---------- Advertising: relay process (baton passes stage to stage) ---------- */
  function initRelay() {
    var relay = $('[data-relay]');
    if (!relay) return;
    var stages = $$('.relay__stage', relay);
    var loopBadge = $('.relay__loop', relay);
    if (reduce) { stages.forEach(function (s) { s.classList.add('is-done'); }); return; }
    var seq = [0, 1, 2, 3, 4, 5, 4, 5, 4, 5], pos = 0, visible = false;
    function tick() {
      if (!visible || doc.hidden) return;
      var cur = seq[pos], nxt = seq[(pos + 1) % seq.length];
      stages.forEach(function (s, k) {
        s.classList.toggle('is-active', k === cur);
        s.classList.toggle('is-done', k < cur || (pos > 5 && k < 4));
        s.classList.remove('is-passing');
      });
      if (nxt === cur + 1) { void stages[cur].offsetWidth; stages[cur].classList.add('is-passing'); }
      if (loopBadge) loopBadge.classList.toggle('is-on', pos >= 5);
      pos = (pos + 1) % seq.length;
    }
    watchVisibility(relay, function (v) { visible = v; });
    setInterval(tick, 1300);
  }

  /* ---------- Pricing: plan builder ---------- */
  function initBuilder() {
    var form = $('[data-builder]');
    if (!form) return;
    var one = $('[data-sum-one]', form), mon = $('[data-sum-month]', form), list = $('[data-sum-list]', form), cta = $('[data-sum-cta]', form);
    var prevOne = 0, prevMon = 0;
    function update() {
      var web = $('input[name="web"]:checked', form);
      var ads = $$('input[name="ads"]:checked', form);
      var oneTime = web ? +web.value : 0;
      var monthly = ads.reduce(function (s, a) { return s + +a.value; }, 0);
      tweenCount(one, prevOne, oneTime, 700); tweenCount(mon, prevMon, monthly, 700);
      prevOne = oneTime; prevMon = monthly;
      var items = [], planText = [];
      if (web && oneTime) { items.push([web.dataset.label, '€' + oneTime.toLocaleString('en-US') + ' one-time']); planText.push(web.dataset.label + ' (€' + oneTime.toLocaleString('en-US') + ')'); }
      ads.forEach(function (a) { items.push([a.dataset.label, '€' + a.value + '/month']); planText.push(a.dataset.label + ' (€' + a.value + '/month)'); });
      list.innerHTML = items.length
        ? items.map(function (it) { return '<li><span>' + it[0] + '</span><span>' + it[1] + '</span></li>'; }).join('')
        : '<li class="empty">Select a website package or advertising service.</li>';
      var service = 'custom';
      if (oneTime && ads.length) service = 'website-ads';
      else if (oneTime) service = web.dataset.key;
      else if (ads.length === 1) service = ads[0].dataset.key;
      var q = '?service=' + encodeURIComponent(service) + (planText.length ? '&plan=' + encodeURIComponent(planText.join(' + ')) : '');
      cta.setAttribute('href', 'contact.html' + q);
    }
    form.addEventListener('change', update);
    update();
  }

  /* ---------- Contact: premium form with validation ---------- */
  function initForm() {
    var form = $('[data-contact-form]');
    if (!form) return;
    var params = new URLSearchParams(location.search);
    var sel = form.elements.service;
    var msg = form.elements.message;
    var hint = $('[data-service-hint]', form);
    var count = $('[data-count-msg]', form);
    var HINTS = {
      simple: 'One-time project price · <b>€300</b>',
      advanced: 'One-time project price · <b>€500</b> · Our most popular package',
      premium: 'One-time project price · <b>€1,000</b> · Our flagship package',
      google: 'Monthly management · <b>€300/month</b>',
      meta: 'Monthly management · <b>€300/month</b>',
      'website-ads': 'A website package plus Google and/or Meta Ads management',
      custom: 'Tell us what you need — we\'ll discuss scope together'
    };
    var svc = params.get('service');
    if (svc && Array.prototype.some.call(sel.options, function (o) { return o.value === svc; })) sel.value = svc;
    var plan = params.get('plan');
    if (plan && !msg.value) msg.value = 'I\'m interested in: ' + plan.slice(0, 200) + '.\n\n';

    var rules = {
      name: function (v) { return v.trim().length >= 2 || 'Please enter your name.'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.'; },
      phone: function (v) { var t = v.trim(); return !t || (/^[+()\d\s.\-]+$/.test(t) && t.replace(/\D/g, '').length >= 6) || 'Please enter a valid phone number.'; },
      company: function () { return true; },
      service: function (v) { return !!v || 'Please choose a service.'; },
      message: function (v) { return v.trim().length >= 20 || 'Please tell us a little more (at least 20 characters).'; }
    };
    function fieldOf(input) { return input.closest('.field'); }
    function check(input, show) {
      var rule = rules[input.name];
      if (!rule) return true;
      var res = rule(input.value);
      var f = fieldOf(input), ok = res === true;
      if (show || f.classList.contains('is-invalid')) {
        f.classList.toggle('is-invalid', !ok);
        var err = $('.field__err span', f);
        if (err && !ok) err.textContent = res;
        input.setAttribute('aria-invalid', String(!ok));
      }
      f.classList.toggle('is-valid', ok && input.value.trim() !== '');
      return ok;
    }
    function updateHint() {
      if (hint) hint.innerHTML = sel.value ? HINTS[sel.value] || '' : '';
    }
    function updateCount() { if (count) count.textContent = msg.value.length + ' / 1500'; }
    Object.keys(rules).forEach(function (n) {
      var input = form.elements[n];
      if (!input) return;
      input.addEventListener('blur', function () { if (input.value.trim() !== '' || n === 'service') check(input, input.value.trim() !== ''); });
      input.addEventListener('input', function () { check(input, false); });
      input.addEventListener('change', function () { check(input, true); });
    });
    sel.addEventListener('change', updateHint);
    msg.addEventListener('input', updateCount);
    updateHint(); updateCount();
    if (sel.value) check(sel, true);
    if (msg.value) check(msg, false);

    var btn = $('[type="submit"]', form);
    var success = $('[data-success]');
    var successName = $('[data-success-name]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (n) {
        var input = form.elements[n];
        if (input && !check(input, true)) {
          if (!firstBad) firstBad = input;
          var f = fieldOf(input);
          f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake');
        }
      });
      if (firstBad) { firstBad.focus(); return; }

      btn.classList.add('is-loading');
      $('.btn__label', btn).textContent = 'Sending…';
      var endpoint = form.getAttribute('data-endpoint');
      var done = function (ok) {
        btn.classList.remove('is-loading');
        $('.btn__label', btn).textContent = 'Send Project Request';
        if (!ok) { alert('Sorry — your request could not be sent. Please try again in a moment.'); return; }
        if (successName) successName.textContent = form.elements.name.value.trim().split(' ')[0];
        success.classList.add('is-shown');
        var focusable = $('button', success);
        if (focusable) setTimeout(function () { focusable.focus(); }, 400);
      };
      if (endpoint) {
        fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
          .then(function (r) { done(r.ok); })
          .catch(function () { done(false); });
      } else {
        // No endpoint configured yet — see the note above the <form> in contact.html.
        setTimeout(function () { done(true); }, 1200);
      }
    });
    var again = $('[data-again]');
    if (again) again.addEventListener('click', function () {
      form.reset();
      $$('.field', form).forEach(function (f) { f.classList.remove('is-valid', 'is-invalid'); });
      updateHint(); updateCount();
      success.classList.remove('is-shown');
      form.elements.name.focus();
    });
  }

  /* ---------- Focus the form from "Let's Talk" ---------- */
  function initFocusForm() {
    $$('[data-focus-form]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = doc.getElementById('project-form');
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        setTimeout(function () { var n = doc.getElementById('f-name'); if (n) n.focus({ preventScroll: true }); }, reduce ? 0 : 700);
      });
    });
  }

  /* ---------- Legal dialogs, year, back-to-top ---------- */
  function initMisc() {
    $$('[data-legal]').forEach(function (b) {
      b.addEventListener('click', function () {
        var d = doc.getElementById('legal-' + b.dataset.legal);
        if (d && d.showModal) d.showModal();
      });
    });
    $$('dialog.legal').forEach(function (d) {
      d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
    });
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
    $$('[data-top]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
    });
  }

  /* ---------- Boot ---------- */
  [initTransitions, initNav, initMenu, initMiniSites, initReveal, initCounters, initSpotlight, initParticles, initParallax,
    initShowcase, initBuild, initProcess, initDial, initFaq, initDashboard, initRelay, initBuilder, initForm, initFocusForm, initMisc]
    .forEach(function (fn) { try { fn(); } catch (err) { if (window.console) console.error(err); } });
})();
