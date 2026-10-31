/* Grade 5 lesson kit: helpers the Grade 5 chapters use with the shared lesson engine (lesson.js, manip.js).
   K.watch(frames)   a "Watch" clip built from drawings: each frame swaps in a new picture, and the parts that are new animate in.
   K.widget(ch, i)   a "Try it" activity that reuses the i-th interactive drawing of a chapter's original lesson.
   K.disks(el, o)    place value disks from hundredths to hundred thousands: tap to light and count, group 10 into 1, break 1 into 10.
   K.P(ch, skill, lv) a quick check made by a practice skill's question maker.
   K.why, K.tf, K.pick, K.digits help build more ways to ask each practice skill (see docs/QUESTIONS.md). */
(function () {
  'use strict';
  var A = window.Atlas, M = window.Manip, K = (A.kit = {});
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- Watch clips from drawings ---------- */
  function sceneTool(root, first) {
    var T = { root: root, fast: false, prev: {} };
    root.classList.add('g5-scene');
    T.show = function (html) {
      var seen = T.prev, now = {};
      root.innerHTML = html;
      A.$$('svg > *, .g5-anim > *', root).forEach(function (n, i) {
        var key = n.outerHTML;
        now[key] = 1;
        if (!seen[key] && !T.fast && Object.keys(seen).length) { n.classList.add('g5-new'); n.style.animationDelay = Math.min(i * 18, 500) + 'ms'; }
      });
      if (!Object.keys(seen).length && !T.fast) M.bump(root, 'mp-fade');
      T.prev = now;
      return T.fast ? null : new Promise(function (r) { setTimeout(r, 450); });
    };
    T.reset = function () { T.prev = {}; root.innerHTML = first || ''; };
    T.reset();
    return T;
  }
  /* frames: [{ say, fig, ms }] ; fig is html (usually one svg) */
  K.watch = function (frames) {
    return {
      mount: function (stage) { return sceneTool(stage, frames[0].fig); },
      steps: frames.map(function (f) { return { say: f.say, ms: f.ms == null ? 1500 : f.ms, act: function (t) { return t.show(f.fig); } }; })
    };
  };

  /* ---------- reuse a chapter's original interactive drawing as "Try it" ---------- */
  var labs = {};
  function labsOf(chId) {
    if (!labs[chId]) { var d = document.createElement('div'); d.innerHTML = A.chapters[chId].html; labs[chId] = A.$$('.lab', d).map(function (x) { return x.innerHTML; }); }
    return labs[chId];
  }
  K.widget = function (chId, i, msg) {
    return {
      do: '',
      mount: function (host, done) {
        var box = el('div', 'lab g5-lab', labsOf(chId)[i]), lt = A.$('.lt', box), told = false, moves = 0;
        if (lt) lt.remove();
        host.appendChild(box);
        /* the chapter's init wires every widget; on this screen only one is present, so missing parts get a stand-in */
        var real = A.$;
        A.$ = function (sel, r) { return real(sel, r) || document.createElement('div'); };
        try { A.chapters[chId].init(box); } finally { A.$ = real; }
        function hit() { if (++moves >= 3 && !told) { told = true; done(msg || 'Nice work. Keep exploring, then try the questions below.'); } }
        box.addEventListener('input', hit); box.addEventListener('change', hit);
        box.addEventListener('click', function (e) { if (e.target.closest('button')) hit(); });
      }
    };
  };

  /* ---------- a "Try it" task on a shared tool ----------
     check(state, tool) says when the task is met; pre(tool) sets the tool up first (runs instantly) */
  K.task = function (name, opts, task, check, msg, pre) {
    return {
      do: task,
      mount: function (host, done) {
        var ready = !pre, told = false, t;
        t = window.Manip.make(name, host, Object.assign({}, opts, { onChange: function (s, T) {
          if (ready && !told && check(s, T || t)) { told = true; done(msg); }
        } }));
        if (pre) { t.fast = true; Promise.resolve(pre(t)).then(function () { t.fast = false; ready = true; }); }
      }
    };
  };

  /* ---------- more ways to ask: question shapes (assets/engine/qkit.js, docs/QUESTIONS.md) ---------- */
  /* the reason list for a true-or-false question */
  K.why = function (right, wrong) { var o = A.R.mc(right, wrong); return { options: o.options, answer: o.answer }; };
  /* a "mistake" question: who said claim; truth says if they are right; right is the true reason */
  K.tf = function (who, claim, truth, right, wrong, extra) {
    return Object.assign({ q: who + ' says ' + claim + ' True or false: ' + who + ' is right.', type: 'tf', answer: truth,
      why: K.why(right, wrong), steps: [right], explain: right }, extra);
  };
  /* a "pick every answer that fits" question; fits(v) says which values are right */
  K.pick = function (q, values, fits, show, extra) {
    var ans = [];
    values.forEach(function (v, j) { if (fits(v)) ans.push(j); });
    return Object.assign({ q: q, type: 'pick', options: values.map(show || A.fmt), answer: ans }, extra);
  };
  /* a number in big digits; each digit can be tapped (data-hit = its index in the plain digits) */
  K.digits = function (n) {
    var s = String(n), w = Math.min(76, 380 / s.length), gap = s.length > 4 ? 14 : 0, h = '', x = 4;
    for (var i = 0; i < s.length; i++) {
      if (gap && i === s.length - 3) x += gap;
      h += '<g data-hit="' + i + '" aria-label="the ' + s.charAt(i) + ' in the ' + A.PLACES[s.length - 1 - i] + ' place"><rect x="' + x + '" y="4" width="' + (w - 8) + '" height="84" rx="12" style="fill:var(--card);stroke:var(--line)" stroke-width="2.5"/>' +
        '<text x="' + (x + (w - 8) / 2) + '" y="64" text-anchor="middle" font-size="50" font-weight="700" style="fill:var(--ink);font-family:var(--display)">' + s.charAt(i) + '</text></g>';
      x += w;
    }
    return A.svg(x + 4, 92, h, 'The number ' + A.fmt(n) + ' in big digits');
  };

  /* ---------- quick checks from practice skills ---------- */
  K.P = function (chId, sid, lv) {
    return function () {
      var s = A.chapters[chId].practice.filter(function (x) { return x.id === sid; })[0];
      return s.gen(typeof lv === 'function' ? lv() : lv || 1);
    };
  };
  K.mc = function (q, right, wrong, extra) {
    var o = A.R.mc(right, wrong);
    return Object.assign({ q: q, type: 'mc', options: o.options, answer: o.answer }, extra || {});
  };

  /* ---------- place value disks ----------
     options: places (list of place indexes, high to low: 5 = hundred thousands ... 0 = ones, -1 tenths, -2 hundredths),
     start {p: count}, controls (add, take away, group, break, count, clear), max per column (default 19), onChange(state, tool).
     state: { value, counts, last, lit, allLit }. Moves: add(p, n, ms), remove(p, n), group(p), split(p), set(counts), countAll(ms), pulseCol(p), clearLit(). */
  var PN = { 5: 'hundred thousands', 4: 'ten thousands', 3: 'thousands', 2: 'hundreds', 1: 'tens', 0: 'ones', '-1': 'tenths', '-2': 'hundredths' };
  var SHORT = { 5: '100 000s', 4: '10 000s', 3: '1000s', 2: '100s', 1: '10s', 0: '1s', '-1': '0.1s', '-2': '0.01s' };
  function pv(p) { return A.clean(Math.pow(10, p)); }
  function lab(p) { return p >= 0 ? A.fmt(pv(p)) : String(pv(p)); }
  function col(p) { return p >= 0 ? 'var(--p' + p + ')' : 'var(--pm' + (-p) + ')'; }
  K.disks = function (root, o) {
    o = o || {};
    var places = o.places || [4, 3, 2, 1, 0], cnt = {}, lit = [], last = '', max = o.max || 19;
    var T = { root: root, fast: false, ep: 0 };
    T.wait = function (ms) { return T.fast ? Promise.resolve() : new Promise(function (r) { setTimeout(r, ms); }); };
    places.forEach(function (p) { cnt[p] = (o.start && o.start[p]) || 0; });
    root.classList.add('mp', 'g5-disks');
    root.innerHTML = (o.controls ? '<div class="mp-tray">' + places.map(function (p) {
      return '<div class="mp-tg"><button type="button" class="mp-add" data-p="' + p + '" aria-label="Add a ' + lab(p) + ' disk"><i class="g5-dk sm" style="--c:' + col(p) + '"></i><span>+ ' + lab(p) + '</span></button>' +
        '<button type="button" class="mp-sub" data-p="' + p + '" aria-label="Take away a ' + lab(p) + ' disk">&minus;</button></div>';
    }).join('') + '</div><div class="mp-acts"><button type="button" class="mp-act" data-a="group">Group 10 into 1</button><button type="button" class="mp-act" data-a="split">Break 1 into 10</button>' +
      '<button type="button" class="mp-act" data-a="count">Count them</button><button type="button" class="mp-act" data-a="clear">Clear</button></div>' : '') +
      '<div class="g5-mat" style="--n:' + places.length + '">' + places.map(function (p) {
        return '<div class="g5-col" data-p="' + p + '"><span class="g5-h" style="--c:' + col(p) + '"><span class="lg">' + PN[p] + '</span><span class="sm">' + SHORT[p] + '</span></span><div class="g5-stack"></div><span class="g5-n"></span></div>';
      }).join('') + '</div><div class="mp-read" aria-live="polite"></div>';
    var read = A.$('.mp-read', root), mode = '';
    function value() { var v = 0; places.forEach(function (p) { v += cnt[p] * pv(p); }); return A.clean(v); }
    function state() { return { value: value(), counts: Object.assign({}, cnt), last: last, lit: lit.length, allLit: lit.length && lit.length === total() }; }
    function total() { var t = 0; places.forEach(function (p) { t += cnt[p]; }); return t; }
    T.state = state;
    function fire() { if (o.onChange) o.onChange(state(), T); }
    function stack(p) { return A.$('.g5-col[data-p="' + p + '"] .g5-stack', root); }
    function draw(p, fresh) {
      var s = stack(p), have = s.children.length;
      while (have > cnt[p]) { s.lastChild.remove(); have--; }
      while (have < cnt[p]) {
        var d = el('button', 'g5-dk' + (fresh && !T.fast ? ' g5-drop' : ''), '<b>' + lab(p) + '</b>');
        d.type = 'button'; d.style.setProperty('--c', col(p)); d.setAttribute('aria-label', lab(p) + ' disk');
        d.dataset.p = p; d.dataset.l = String(lab(p).replace(/\s/g, '').length);
        s.appendChild(d); have++;
      }
      A.$('.g5-col[data-p="' + p + '"] .g5-n', root).textContent = cnt[p];
    }
    function readout() {
      var v = value(), parts = places.filter(function (p) { return cnt[p]; }).map(function (p) { return '<b style="color:' + col(p) + '">' + A.fmt(A.clean(cnt[p] * pv(p))) + '</b>'; });
      var over = places.filter(function (p) { return cnt[p] > 9; });
      read.innerHTML = '<p><span class="mp-num">' + A.fmt(v) + '</span></p><p class="mp-litline">' + (parts.join(' + ') || '0') + '</p>' +
        (over.length ? '<p class="mp-tip">' + over.map(function (p) { return cnt[p] + ' ' + PN[p]; }).join(', ') + ': ten of them can be grouped.</p>' : '');
    }
    function all(fresh) { places.forEach(function (p) { draw(p, fresh); }); readout(); }
    T.clearLit = function () { lit = []; A.$$('.g5-dk.on', root).forEach(function (d) { d.classList.remove('on'); }); };
    T.reset = function () { T.ep++; places.forEach(function (p) { cnt[p] = (o.start && o.start[p]) || 0; }); last = ''; lit = []; A.$$('.g5-stack', root).forEach(function (s) { s.innerHTML = ''; }); all(false); };
    T.set = function (c) { places.forEach(function (p) { cnt[p] = c[p] || 0; }); last = 'set'; T.clearLit(); A.$$('.g5-stack', root).forEach(function (s) { s.innerHTML = ''; }); all(true); fire(); return T.wait(500); };
    T.add = function (p, n, ms) {
      n = n || 1; var ep = T.ep, k = 0;
      function one() {
        if (ep !== T.ep || k >= n || cnt[p] >= max) { fire(); return Promise.resolve(); }
        cnt[p]++; k++; last = 'add'; T.clearLit(); draw(p, true); readout();
        return T.wait(ms || 260).then(one);
      }
      return one();
    };
    T.remove = function (p, n) { cnt[p] = Math.max(0, cnt[p] - (n || 1)); last = 'remove'; T.clearLit(); draw(p); readout(); fire(); return T.wait(300); };
    T.pulseCol = function (p) { var c = A.$('.g5-col[data-p="' + p + '"]', root); M.bump(c, 'mp-glow'); return T.wait(1200); };
    /* 10 disks of a place slide together into 1 disk of the next place to the left */
    T.group = function (p) {
      var up = p + 1;
      if (places.indexOf(up) < 0 || cnt[p] < 10) { if (read) { var t = read.querySelector('.mp-tip'); } return Promise.resolve(false); }
      var ep = T.ep, ds = A.$$('.g5-dk', stack(p)).slice(-10);
      ds.forEach(function (d) { d.classList.add('on', 'g5-go'); });
      return T.wait(650).then(function () {
        if (ep !== T.ep) return;
        cnt[p] -= 10; cnt[up]++; last = 'group-' + p; T.clearLit(); draw(p); draw(up, true); readout();
        var nd = stack(up).lastChild; if (nd && !T.fast) { nd.classList.add('on'); M.bump(nd, 'mp-bump'); }
        fire(); return T.wait(700);
      });
    };
    /* 1 disk breaks into 10 disks of the next place to the right */
    T.split = function (p) {
      var dn = p - 1;
      if (places.indexOf(dn) < 0 || cnt[p] < 1 || cnt[dn] > max - 10) return Promise.resolve(false);
      var ep = T.ep, d = stack(p).lastChild;
      if (d) d.classList.add('on', 'g5-go');
      return T.wait(500).then(function () {
        if (ep !== T.ep) return;
        cnt[p]--; cnt[dn] += 10; last = 'split-' + p; T.clearLit(); draw(p); draw(dn, true); readout(); fire(); return T.wait(800);
      });
    };
    /* light every disk, biggest place first, with the running total */
    T.countAll = function (ms) {
      var ep = T.ep, ds = [], run = 0;
      T.clearLit();
      places.forEach(function (p) { A.$$('.g5-dk', stack(p)).forEach(function (d) { ds.push(d); }); });
      var i = 0;
      function step() {
        if (ep !== T.ep || i >= ds.length) { last = 'count'; fire(); return Promise.resolve(); }
        var d = ds[i++], p = +d.dataset.p;
        run = A.clean(run + pv(p)); d.classList.add('on'); lit.push(d);
        if (!T.fast) { M.bump(d, 'mp-bump'); M.floatText(root, d.offsetLeft + d.offsetWidth / 2, d.offsetTop, A.fmt(run)); }
        return T.wait(ms || 220).then(step);
      }
      return step();
    };
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.classList.contains('g5-dk')) {
        if (b.classList.contains('on')) return;
        b.classList.add('on'); lit.push(b); M.bump(b, 'mp-bump');
        var run = 0; lit.forEach(function (x) { run = A.clean(run + pv(+x.dataset.p)); });
        M.floatText(root, b.offsetLeft + b.offsetWidth / 2, b.offsetTop, A.fmt(run));
        read.querySelector('.mp-litline').innerHTML = 'Counted so far: <b>' + A.fmt(run) + '</b>';
        last = 'tap'; fire(); return;
      }
      var p = b.dataset.p != null ? +b.dataset.p : null, a = b.dataset.a;
      if (b.classList.contains('mp-add')) T.add(p, 1, 1);
      else if (b.classList.contains('mp-sub')) T.remove(p, 1);
      else if (a === 'count') T.countAll(180);
      else if (a === 'clear') T.set({});
      else if (a === 'group') {
        var g = places.slice().reverse().filter(function (q) { return cnt[q] >= 10 && places.indexOf(q + 1) >= 0; })[0];
        if (g == null) { read.querySelector('.mp-litline').innerHTML = '<span class="mp-tip">You need 10 disks in one column to group them.</span>'; return; }
        T.group(g);
      } else if (a === 'split') {
        if (mode !== 'split') { mode = 'split'; b.setAttribute('aria-pressed', 'true'); read.querySelector('.mp-litline').innerHTML = 'Now tap the <b>column heading</b> of the disk you want to break.'; return; }
      }
    });
    root.addEventListener('click', function (e) {
      var h = e.target.closest('.g5-h');
      if (!h || mode !== 'split') return;
      mode = ''; var bt = A.$('[data-a="split"]', root); if (bt) bt.setAttribute('aria-pressed', 'false');
      var p = +h.parentNode.dataset.p;
      T.split(p).then(function (ok) { if (ok === false) read.querySelector('.mp-litline').innerHTML = '<span class="mp-tip">There is nothing to break there.</span>'; });
    });
    all(false);
    return T;
  };
  M.g5disks = K.disks;
})();
