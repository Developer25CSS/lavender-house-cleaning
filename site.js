/* ============================================================
   Lavender House Cleaning — motion & interaction layer
   ============================================================ */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile drawer: open/close, scroll lock, focus trap ---------- */
  var nav      = document.querySelector('.main-nav');
  var toggle   = document.querySelector('.menu-toggle');
  var backdrop = document.querySelector('.nav-backdrop');
  var closeBtn = document.querySelector('.drawer-close');
  var lastFocus = null;

  function drawerOpen() { return nav && nav.classList.contains('open'); }

  function openDrawer() {
    if (!nav) return;
    lastFocus = document.activeElement;
    nav.classList.add('open');
    if (backdrop) { backdrop.hidden = false; requestAnimationFrame(function () { backdrop.classList.add('on'); }); }
    document.body.classList.add('nav-open');
    if (toggle) { toggle.setAttribute('aria-expanded', 'true'); toggle.setAttribute('aria-label', 'Close menu'); }
    var first = nav.querySelector('a, button');
    if (first) first.focus();
  }

  function closeDrawer() {
    if (!nav) return;
    nav.classList.remove('open');
    if (backdrop) {
      backdrop.classList.remove('on');
      setTimeout(function () { if (!drawerOpen()) backdrop.hidden = true; }, 300);
    }
    document.body.classList.remove('nav-open');
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (toggle) toggle.addEventListener('click', function () { drawerOpen() ? closeDrawer() : openDrawer(); });
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // close when a link inside the drawer is followed
  if (nav) nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeDrawer();
  });

  document.addEventListener('keydown', function (e) {
    if (!drawerOpen()) return;
    if (e.key === 'Escape') { closeDrawer(); return; }
    if (e.key !== 'Tab') return;
    var f = nav.querySelectorAll('a[href], button:not([disabled])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // reset state if the viewport grows back to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && drawerOpen()) closeDrawer();
  });

  /* ---------- Footer accordion (phones only) ---------- */
  document.addEventListener('click', function (e) {
    var h = e.target.closest('.foot-col > h4');
    if (!h || window.innerWidth > 620) return;
    h.parentElement.classList.toggle('open');
  });

  /* ---------- Scroll progress ---------- */
  var bar = document.createElement('div');
  bar.className = 'progress-bar';
  document.body.appendChild(bar);

  /* ---------- Parallax targets ---------- */
  var pxTargets = [];
  function collectParallax() {
    pxTargets = [].slice.call(document.querySelectorAll('[data-parallax]')).map(function (el) {
      return { el: el, speed: parseFloat(el.dataset.parallax) || 0.12 };
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.pageYOffset;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';

      if (!reduced) {
        var vh = window.innerHeight;
        for (var i = 0; i < pxTargets.length; i++) {
          var t = pxTargets[i];
          var r = t.el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) continue;
          var mid = r.top + r.height / 2 - vh / 2;
          t.el.style.transform = 'translate3d(0,' + (-mid * t.speed).toFixed(2) + 'px,0)';
        }
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { collectParallax(); onScroll(); }, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal], [data-stagger]');
    if (!('IntersectionObserver' in window)) {
      [].forEach.call(items, function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(function () { el.classList.add('in'); }, delay);
        if (el.hasAttribute('data-stagger')) {
          var step = parseInt(el.dataset.stagger || '90', 10) || 90;
          [].forEach.call(el.children, function (kid, i) {
            kid.style.transitionDelay = (i * step) + 'ms';
          });
        }
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    [].forEach.call(items, function (el) { io.observe(el); });
  }

  /* ---------- Count-up stats ---------- */
  function initCounters() {
    var stats = document.querySelectorAll('[data-count]');
    if (!stats.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || en.target.dataset.done) return;
        en.target.dataset.done = '1';
        var end = parseFloat(en.target.dataset.count);
        var sfx = en.target.dataset.suffix || '';
        var pfx = en.target.dataset.prefix || '';
        var t0 = performance.now(), dur = 1500;
        (function step(now) {
          var p = Math.min((now - t0) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);
          en.target.textContent = pfx + Math.round(end * e).toLocaleString() + sfx;
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.4 });
    [].forEach.call(stats, function (s) { io.observe(s); });
  }

  /* ---------- Image fallback tiles ---------- */
  function initFallbacks() {
    [].forEach.call(document.querySelectorAll('img[data-fallback]'), function (img) {
      function fail() {
        if (img.dataset.failed) return;
        img.dataset.failed = '1';
        var tile = document.createElement('div');
        tile.className = 'ph';
        tile.textContent = img.dataset.fallback;
        if (img.parentElement) img.parentElement.replaceChild(tile, img);
      }
      img.addEventListener('error', fail);
      // only treat it as broken once it has genuinely finished and produced nothing
      if (img.complete && img.naturalWidth === 0 && /^https?:/i.test(img.src)) fail();
    });
  }

  /* ---------- Floating lavender petals ---------- */
  function initPetals() {
    if (reduced) return;
    [].forEach.call(document.querySelectorAll('[data-petals]'), function (host) {
      var layer = document.createElement('div');
      layer.className = 'petals';
      var n = parseInt(host.dataset.petals, 10) || 12;
      for (var i = 0; i < n; i++) {
        var p = document.createElement('span');
        p.className = 'petal';
        p.innerHTML = '<svg viewBox="0 0 16 28" width="100%" height="100%" aria-hidden="true">' +
          '<line x1="8" y1="13" x2="8" y2="26" stroke="#8a9a6b" stroke-width="1.3" stroke-linecap="round"/>' +
          '<circle cx="8" cy="4" r="1.9" fill="#a870d6"/>' +
          '<circle cx="5.8" cy="6.8" r="1.7" fill="#9b5ecf"/>' +
          '<circle cx="10.2" cy="6.8" r="1.7" fill="#9b5ecf"/>' +
          '<circle cx="8" cy="9.6" r="1.7" fill="#a870d6"/>' +
          '<circle cx="6.2" cy="12" r="1.4" fill="#b085d8"/>' +
          '<circle cx="9.8" cy="12" r="1.4" fill="#b085d8"/>' +
          '</svg>';
        p.style.left = (Math.random() * 100) + '%';
        var sz = (13 + Math.random() * 12);
        p.style.width = sz + 'px';
        p.style.height = (sz * 1.75) + 'px';
        p.style.animationDuration = (14 + Math.random() * 16) + 's';
        p.style.animationDelay = (-Math.random() * 24) + 's';
        p.style.setProperty('--dx', ((Math.random() - 0.5) * 200).toFixed(0) + 'px');
        layer.appendChild(p);
      }
      host.appendChild(layer);
    });
  }

  /* ---------- Before/After sliders (drag + touch) ---------- */
  function initBA() {
    [].forEach.call(document.querySelectorAll('.ba'), function (ba) {
      var range = ba.querySelector('input[type=range]');
      var after = ba.querySelector('.after-layer');
      var handle = ba.querySelector('.ba-handle');
      if (!range || !after || !handle) return;
      function paint() {
        var v = range.value;
        after.style.clipPath = 'inset(0 0 0 ' + v + '%)';
        handle.style.left = v + '%';
      }
      range.addEventListener('input', paint);
      paint();

      // nudge animation the first time it scrolls into view
      if (!reduced && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (en) {
          if (!en[0].isIntersecting) return;
          io.disconnect();
          var t0 = performance.now();
          (function sweep(now) {
            var p = Math.min((now - t0) / 1600, 1);
            var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            range.value = 50 + Math.sin(e * Math.PI) * 26;
            paint();
            if (p < 1) requestAnimationFrame(sweep);
            else { range.value = 50; paint(); }
          })(t0);
        }, { threshold: 0.45 });
        io.observe(ba);
      }
    });
  }

  /* ---------- Draggable photo rails ---------- */
  function initRails() {
    [].forEach.call(document.querySelectorAll('.rail'), function (rail) {
      var down = false, startX = 0, startScroll = 0, moved = 0;

      rail.addEventListener('pointerdown', function (e) {
        down = true; moved = 0;
        startX = e.clientX;
        startScroll = rail.scrollLeft;
        rail.classList.add('dragging');
        rail.setPointerCapture(e.pointerId);
      });
      rail.addEventListener('pointermove', function (e) {
        if (!down) return;
        var dx = e.clientX - startX;
        moved = Math.abs(dx);
        rail.scrollLeft = startScroll - dx;
      });
      function release(e) {
        if (!down) return;
        down = false;
        rail.classList.remove('dragging');
        try { rail.releasePointerCapture(e.pointerId); } catch (err) {}
      }
      rail.addEventListener('pointerup', release);
      rail.addEventListener('pointercancel', release);
      rail.addEventListener('pointerleave', release);
      // suppress click-through after a real drag
      rail.addEventListener('click', function (e) {
        if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
      }, true);

      // arrows + dots
      var wrap = rail.closest('.rail-wrap');
      if (!wrap) return;
      var prev = wrap.querySelector('.rail-btn.prev');
      var next = wrap.querySelector('.rail-btn.next');
      var dots = wrap.querySelector('.rail-dots');
      var items = rail.querySelectorAll('.rail-item');

      function step() {
        var it = items[0];
        return it ? it.getBoundingClientRect().width + 18 : 320;
      }
      if (prev) prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
      if (next) next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: 'smooth' }); });

      if (dots) {
        for (var i = 0; i < items.length; i++) {
          var d = document.createElement('i');
          (function (idx) {
            d.addEventListener('click', function () {
              rail.scrollTo({ left: idx * step(), behavior: 'smooth' });
            });
          })(i);
          dots.appendChild(d);
        }
        var kids = dots.querySelectorAll('i');
        function sync() {
          var idx = Math.round(rail.scrollLeft / step());
          [].forEach.call(kids, function (k, i) { k.classList.toggle('on', i === idx); });
        }
        rail.addEventListener('scroll', function () {
          window.requestAnimationFrame(sync);
        }, { passive: true });
        sync();
      }
    });
  }

  /* ---------- Lightbox ---------- */
  var lb, lbImg, lbCap, lbCount, gallery = [], gIndex = 0;
  function buildLightbox() {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">✕</button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous">‹</button>' +
      '<button class="lb-btn lb-next" aria-label="Next">›</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('img');
    lbCap = lb.querySelector('figcaption');
    lbCount = lb.querySelector('.lb-count');

    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); go(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); go(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'FIGURE') close(); });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });

    // swipe
    var sx = 0;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    }, { passive: true });
  }
  function show(i) {
    if (!gallery.length) return;
    gIndex = (i + gallery.length) % gallery.length;
    var g = gallery[gIndex];
    lbImg.src = g.src;
    lbImg.alt = g.title;
    lbCap.innerHTML = g.title + (g.sub ? '<small>' + g.sub + '</small>' : '');
    lbCount.textContent = (gIndex + 1) + ' / ' + gallery.length;
  }
  function go(d) { show(gIndex + d); }
  function close() { lb.classList.remove('on'); document.body.style.overflow = ''; }

  function initLightbox() {
    var nodes = document.querySelectorAll('[data-lightbox]');
    if (!nodes.length) return;
    buildLightbox();
    gallery = [].map.call(nodes, function (n) {
      var img = n.querySelector('img');
      return {
        src: n.dataset.full || (img ? img.src : ''),
        title: n.dataset.title || (img ? img.alt : ''),
        sub: n.dataset.sub || ''
      };
    });
    [].forEach.call(nodes, function (n, i) {
      n.style.cursor = 'zoom-in';
      n.addEventListener('click', function (e) {
        if (n.closest('.rail') && n.closest('.rail').classList.contains('dragging')) return;
        e.preventDefault();
        show(i);
        lb.classList.add('on');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  /* ---------- 3D tilt on cards ---------- */
  function initTilt() {
    if (reduced || window.matchMedia('(hover: none)').matches) return;
    [].forEach.call(document.querySelectorAll('.tilt'), function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          'perspective(900px) rotateY(' + (px * 7).toFixed(2) + 'deg) rotateX(' +
          (-py * 7).toFixed(2) + 'deg) translateY(-6px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (reduced || window.matchMedia('(hover: none)').matches) return;
    [].forEach.call(document.querySelectorAll('.btn-lg, .nav-btn'), function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
        el.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + (dy - 2).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  function initHeader() {
    var h = document.querySelector('.site-header');
    if (!h) return;
    window.addEventListener('scroll', function () {
      h.style.boxShadow = window.pageYOffset > 20 ? 'var(--sh-sm)' : 'none';
    }, { passive: true });
  }


  /* ============================================================
     PHOTO LOADER — builds the galleries from photos/photos.json
     To add photos: drop the file in photos/ and add a line to
     photos.json. Nothing here needs editing.
     ============================================================ */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function buildBeforeAfter(list, host) {
    if (!host) return;
    host.innerHTML = list.map(function (p, i) {
      var t = esc(p.title), c = esc(p.caption);
      if (p.composite) {
        return '<div data-reveal="scale" data-delay="' + (i*90) + '">' +
          '<figure class="ba-static" data-lightbox data-title="' + t + '" data-sub="' + c + '">' +
            '<img src="photos/' + esc(p.composite) + '" alt="' + t + ' before and after cleaning" loading="lazy">' +
            '<span class="zoom">&#10530;</span>' +
          '</figure>' +
          '<p class="ba-caption">' + t + '</p><p class="ba-hint">' + c + '</p></div>';
      }
      return '<div data-reveal="scale" data-delay="' + (i*90) + '">' +
        '<div class="ba">' +
          '<img src="photos/' + esc(p.before) + '" alt="' + t + ' before cleaning" loading="lazy">' +
          '<img class="after-layer" src="photos/' + esc(p.after) + '" alt="' + t + ' after cleaning" loading="lazy">' +
          '<span class="tag tag-before">Before</span><span class="tag tag-after">After</span>' +
          '<div class="ba-handle"><div class="ba-knob">&#8646;</div></div>' +
          '<input type="range" min="0" max="100" value="50" aria-label="Compare before and after ' + t + '">' +
        '</div>' +
        '<p class="ba-caption">' + t + '</p><p class="ba-hint">' + c + '</p></div>';
    }).join('');
  }

  function buildCards(list, host, cls) {
    if (!host) return;
    host.innerHTML = list.map(function (p) {
      var t = esc(p.title), c = esc(p.caption);
      return '<figure class="' + cls + '" data-lightbox data-title="' + t + '" data-sub="' + c + '">' +
        '<img src="photos/' + esc(p.file) + '" alt="' + t + '" loading="lazy">' +
        '<span class="zoom">&#10530;</span>' +
        '<figcaption' + (cls === 'rail-item' ? ' class="cap"' : '') + '><b>' + t + '</b><span>' + c + '</span></figcaption>' +
      '</figure>';
    }).join('');
  }

  function loadPhotos(done) {
    var ba = document.getElementById('beforeAfter');
    var dt = document.getElementById('detailGrid');
    var gl = document.getElementById('galleryRail');
    if (!ba && !dt && !gl) { done(); return; }
    fetch('photos/photos.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        buildBeforeAfter(d.beforeAfter || [], ba);
        buildCards(d.details || [], dt, 'detail-card');
        buildCards(d.gallery || [], gl, 'rail-item');
        done();
      })
      .catch(function (e) {
        // opened straight from disk (file://) — fetch is blocked, so say so plainly
        [ba, dt, gl].forEach(function (el) {
          if (el) el.innerHTML = '<p class="note" style="grid-column:1/-1">' +
            'Photos load when the site is served over http. Run a local server or view the live site.</p>';
        });
        done();
      });
  }

  /* ---------- Failsafe: never leave content hidden ---------- */
  function revealAll() {
    [].forEach.call(document.querySelectorAll('[data-reveal],[data-stagger]'), function (el) {
      el.classList.add('in');
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.clipPath = 'none';
      [].forEach.call(el.children, function (k) {
        k.style.opacity = '1'; k.style.transform = 'none';
      });
    });
  }
  setTimeout(revealAll, 2500);
  window.addEventListener('error', revealAll);

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    try {
      loadPhotos(function () {
      initFallbacks();
      initReveal();
      initCounters();
      initPetals();
      initBA();
      initRails();
      initLightbox();
      initTilt();
      initMagnetic();
      initHeader();
      collectParallax();
      onScroll();
      });
    } catch (e) {
      revealAll();          // any failure -> show everything rather than hide it
    }
  });
})();
