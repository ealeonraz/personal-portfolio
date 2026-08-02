/* Learn RAG — shell: routing, progress, quizzes, theme. No dependencies. */
(function () {
  'use strict';

  var LS_DONE = 'learnrag.done.v1';
  var LS_THEME = 'learnrag.theme.v1';

  var modules = [];        // [{id, title, el, navEl}]
  var doneSet = new Set();
  // "Learn RAG — Journal — Ezequiel Alcaraz" -> " — Journal — Ezequiel Alcaraz"
  var TITLE_SUFFIX = document.title.indexOf(' — ') > -1
    ? document.title.slice(document.title.indexOf(' — '))
    : '';

  /* ---------------- storage ---------------- */
  function loadDone() {
    try {
      var raw = localStorage.getItem(LS_DONE);
      if (raw) JSON.parse(raw).forEach(function (id) { doneSet.add(id); });
    } catch (e) { /* private mode / disabled storage — progress just won't persist */ }
  }
  function saveDone() {
    try { localStorage.setItem(LS_DONE, JSON.stringify(Array.from(doneSet))); } catch (e) {}
  }

  /* ---------------- theme ---------------- */
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    var b = document.getElementById('themebtn');
    if (b) b.textContent = t === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(LS_THEME, t); } catch (e) {}
  }
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(LS_THEME); } catch (e) {}
    if (!saved) {
      saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    applyTheme(saved);
  }

  /* ---------------- progress ---------------- */
  function refreshProgress() {
    var total = modules.length;
    var n = 0;
    modules.forEach(function (m) {
      var isDone = doneSet.has(m.id);
      if (isDone) n++;
      if (m.navEl) m.navEl.classList.toggle('done', isDone);
      var cb = m.el.querySelector('.donecheck');
      if (cb) cb.checked = isDone;
    });
    var pct = total ? Math.round((n / total) * 100) : 0;
    var fill = document.getElementById('progfill');
    var lbl = document.getElementById('progtext');
    if (fill) fill.style.width = pct + '%';
    if (lbl) lbl.textContent = n + ' of ' + total + ' complete';
  }

  function setDone(id, val) {
    if (val) doneSet.add(id); else doneSet.delete(id);
    saveDone();
    refreshProgress();
  }

  /* ---------------- routing ---------------- */
  function show(id, push) {
    // The journal index reuses this script for the theme toggle alone and has
    // no modules, so there is nothing to route.
    if (!modules.length) return;
    var target = modules.filter(function (m) { return m.id === id; })[0] || modules[0];
    modules.forEach(function (m) {
      m.el.hidden = (m !== target);
      if (m.navEl) m.navEl.classList.toggle('active', m === target);
    });
    var crumb = document.getElementById('crumb');
    if (crumb) crumb.textContent = target.crumb || target.title;
    document.title = target.title + TITLE_SUFFIX;
    if (push && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    window.scrollTo(0, 0);
    var sb = document.getElementById('sidebar');
    if (sb) sb.classList.remove('open');
    // let labs know a module became visible (canvas/SVG sizing)
    document.dispatchEvent(new CustomEvent('module:shown', { detail: { id: target.id } }));
  }

  function currentFromHash() {
    var h = location.hash.replace(/^#/, '');
    return h || (modules[0] && modules[0].id);
  }

  /* ---------------- quizzes ---------------- */
  function initQuiz(root) {
    root.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.opt');
      if (!btn || btn.disabled) return;
      var q = btn.closest('.q');
      if (!q) return;
      var opts = Array.prototype.slice.call(q.querySelectorAll('.opt'));
      var correct = q.getAttribute('data-answer');
      opts.forEach(function (o) {
        o.disabled = true;
        if (o.getAttribute('data-key') === correct) o.classList.add('right');
      });
      if (btn.getAttribute('data-key') !== correct) btn.classList.add('wrong');
      var expl = q.querySelector('.expl');
      if (expl) expl.classList.add('show');
    });
  }

  /* ---------------- boot ---------------- */
  function init() {
    loadDone();
    initTheme();

    var navLinks = {};
    Array.prototype.forEach.call(document.querySelectorAll('nav a[data-mod]'), function (a) {
      navLinks[a.getAttribute('data-mod')] = a;
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        show(a.getAttribute('data-mod'), true);
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('section.module'), function (el) {
      modules.push({
        id: el.id,
        title: el.getAttribute('data-title') || el.id,
        crumb: el.getAttribute('data-crumb') || '',
        el: el,
        navEl: navLinks[el.id] || null
      });
    });

    // internal links that jump between modules
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest('a[data-go]');
      if (!a) return;
      ev.preventDefault();
      show(a.getAttribute('data-go'), true);
    });

    // completion checkboxes
    Array.prototype.forEach.call(document.querySelectorAll('.donecheck'), function (cb) {
      cb.addEventListener('change', function () {
        var sec = cb.closest('section.module');
        if (sec) setDone(sec.id, cb.checked);
      });
    });

    initQuiz(document);

    var tb = document.getElementById('themebtn');
    if (tb) tb.addEventListener('click', function () {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });

    var mb = document.getElementById('menubtn');
    if (mb) mb.addEventListener('click', function () {
      document.getElementById('sidebar').classList.toggle('open');
    });

    var rb = document.getElementById('resetbtn');
    if (rb) rb.addEventListener('click', function () {
      if (!confirm('Clear your progress on all modules? This cannot be undone.')) return;
      doneSet.clear(); saveDone(); refreshProgress();
    });

    window.addEventListener('popstate', function () { show(currentFromHash(), false); });

    refreshProgress();
    show(currentFromHash(), false);

    if (window.RAGLabs && typeof window.RAGLabs.init === 'function') window.RAGLabs.init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
