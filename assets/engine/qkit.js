/* Math Atlas question kit: more ways to answer, shared by every grade.
   Needs site.js (Atlas) first; uses Manip (manip.js) for "build" questions when it is there.

   The old answer types stay as they are: 'mc' (pick one) and 'num' (type a number).
   New types, all with the usual q, fig, hint, steps, explain:
     tap    tap one part of a picture.  pic: svg/html whose parts carry data-hit="key", or tiles: [html, ...]
            answer: key (or tile index).  answerText: words for the reveal.
     pick   pick all that apply.        options: [html], answer: [indices]
     order  put in order.               items: [html] IN THE RIGHT ORDER (shown shuffled); first/last: labels
     line   place on a number line.     min, max, tick, every (labels), snap, answer, tol
     match  match pairs.                pairs: [[left, right], ...] (right side shown shuffled)
     tf     true or false, then why.    answer: true/false, why: { options: [...], answer: index }
     fill   fill the blanks.            fill: 'html with [[]] for each blank', answers: [number, ...], tol
     build  build it with a tool.       tool: 'base10' | 'coins', opts, answer (value; coins in cents)
   Atlas.Q.mount(el, q, cb) draws the answer area. cb(ok, givenText) runs when the child commits an answer.
   Atlas.Q.diag(q, givenText) gives the fix for a known wrong answer, from q.wrong (see below).
   It returns { lock(), reveal(), focus() }. Atlas.Q.text(q) gives the right answer in words.
   Atlas.Q.vary(id, lv, list) picks a question shape for a skill: list = [[minLevel, shapeName, fn(lv)], ...].
   Atlas.Q.shapes(chapterId, SHAPES) wires a chapter's shapes into all its practice skills. */
(function () {
  'use strict';
  var A = window.Atlas;
  if (!A) return;
  var $ = A.$, $$ = A.$$;
  var Q = (A.Q = {});
  var TYPES = { tap: 1, pick: 1, order: 1, line: 1, match: 1, tf: 1, fill: 1, build: 1 };
  Q.has = function (q) { return !!(q && TYPES[q.type]); };
  function strip(h) { var d = document.createElement('div'); d.innerHTML = String(h); return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
  function fmt(n) { return A.fmt ? A.fmt(n) : String(n); }
  function shuffle(a) { return A.R && A.R.shuffle ? A.R.shuffle(a) : a.slice().sort(function () { return Math.random() - 0.5; }); }
  function bump(el) { if (window.Manip && Manip.bump && el) Manip.bump(el, 'mp-shake'); }
  /* shuffle, but never leave a list in its right order (that would give the answer away) */
  function mixed(n) {
    var idx = [], i;
    for (i = 0; i < n; i++) idx.push(i);
    if (n < 2) return idx;
    for (var t = 0; t < 20; t++) { var s = shuffle(idx); for (i = 0; i < n; i++) if (s[i] !== i) return s; }
    return idx.slice(1).concat([0]);
  }
  Q.mixed = mixed;

  Q.text = function (q) {
    switch (q.type) {
      case 'tap': return q.answerText || (q.tiles ? strip(q.tiles[q.answer]) : String(q.answer));
      case 'pick': return q.answer.map(function (i) { return strip(q.options[i]); }).join(', ');
      case 'order': return q.items.map(strip).join(', ');
      case 'line': return fmt(q.answer) + (q.unit ? ' ' + q.unit : '');
      case 'match': return q.pairs.map(function (p) { return strip(p[0]) + ' with ' + strip(p[1]); }).join('; ');
      case 'tf': return (q.answer ? 'True' : 'False') + (q.why ? '. ' + strip(q.why.options[q.why.answer]) : '');
      case 'fill': return q.answers.map(fmt).join(', ');
      case 'build': return q.tool === 'coins' ? '$' + (q.answer / 100).toFixed(2) : fmt(q.answer);
    }
    return '';
  };
  /* the fix for a known wrong answer: q.wrong maps a wrong answer (as the child gave it, in plain words) to a short
     correction that names the mistake, for example { '1/8': 'More pieces means smaller pieces.' }. Empty when none fits. */
  Q.diag = function (q, given) { return (q && q.wrong && given != null && q.wrong[strip(given)]) || ''; };
  function checkBtn(label) { return '<div class="qk-act"><button type="button" class="btn qk-go">' + (label || 'Check') + '</button><span class="qk-msg" aria-live="polite"></span></div>'; }

  Q.mount = function (el, q, cb) {
    el.classList.add('qk', 'qk-' + q.type);
    var api = { locked: false, lock: function () { api.locked = true; $$('button, input', el).forEach(function (b) { b.disabled = true; }); el.classList.add('qk-done'); }, reveal: function () {}, focus: function () { var f = $('button:not(:disabled), input', el); if (f) f.focus(); } };
    function msg(t) { var m = $('.qk-msg', el); if (m) m.textContent = t || ''; }
    var mk = MAKERS[q.type];
    mk(el, q, function (ok, given) { if (!api.locked) cb(ok, given); }, api, msg);
    return api;
  };

  var MAKERS = {
    /* ---------- tap on the picture ---------- */
    tap: function (el, q, cb, api) {
      var tiles = !!q.tiles;
      el.innerHTML = tiles ? '<div class="qk-tiles">' + q.tiles.map(function (t, i) { return '<button type="button" class="qk-tile" data-hit="' + i + '">' + t + '</button>'; }).join('') + '</div>'
        : '<div class="qk-pic">' + q.pic + '</div>';
      var keyOf = function (n) { return tiles ? +n.getAttribute('data-hit') : n.getAttribute('data-hit'); };
      function isRight(k) { return [].concat(q.answer).some(function (a) { return String(a) === String(k); }); }
      $$('[data-hit]', el).forEach(function (n) {
        n.classList.add('qk-hit');
        if (!tiles) { n.setAttribute('tabindex', '0'); n.setAttribute('role', 'button'); }
        function go() {
          if (api.locked || n.classList.contains('qk-no')) return;
          var k = keyOf(n), ok = isRight(k);
          n.classList.add(ok ? 'qk-yes' : 'qk-no');
          cb(ok, n.getAttribute('aria-label') || strip(n.textContent) || String(k));
        }
        n.addEventListener('click', go);
        if (!tiles) n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      });
      api.reveal = function () { $$('[data-hit]', el).forEach(function (n) { if (isRight(keyOf(n))) n.classList.add('qk-yes'); }); };
    },

    /* ---------- pick all that apply ---------- */
    pick: function (el, q, cb, api, msg) {
      el.innerHTML = '<p class="qk-tip">Pick every answer that fits, then press Check.</p><div class="opts">' + q.options.map(function (o, j) { return '<button type="button" class="opt qk-tg" aria-pressed="false" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>' + checkBtn();
      $$('.qk-tg', el).forEach(function (b) {
        b.addEventListener('click', function () { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); b.classList.toggle('qk-on', on); $$('.qk-tg', el).forEach(function (x) { x.classList.remove('qk-no', 'qk-miss'); }); msg(''); });
      });
      $('.qk-go', el).addEventListener('click', function () {
        var on = $$('.qk-tg', el).filter(function (b) { return b.classList.contains('qk-on'); }).map(function (b) { return +b.getAttribute('data-j'); });
        if (!on.length) { msg('Pick at least one first.'); return; }
        var right = q.answer.slice().sort().join(','), ok = on.slice().sort().join(',') === right;
        if (!ok) on.forEach(function (j) { if (q.answer.indexOf(j) < 0) $$('.qk-tg', el)[j].classList.add('qk-no'); });
        cb(ok, on.map(function (j) { return strip(q.options[j]); }).join(', '));
      });
      api.reveal = function () { $$('.qk-tg', el).forEach(function (b, j) { b.classList.remove('qk-no'); if (q.answer.indexOf(j) >= 0) b.classList.add('qk-yes'); }); };
    },

    /* ---------- put in order: tap the cards in order ---------- */
    order: function (el, q, cb, api, msg) {
      var n = q.items.length, show = mixed(n), placed = [];
      el.innerHTML = '<p class="qk-tip">Tap the cards in order' + (q.first ? ', starting with <b>' + q.first + '</b>' : '') + '. Tap a placed card to take it back.</p>' +
        '<div class="qk-slots"></div><div class="qk-pool"></div>' + checkBtn();
      var slots = $('.qk-slots', el), pool = $('.qk-pool', el);
      function draw() {
        var h = '';
        for (var i = 0; i < n; i++) h += placed[i] != null ? '<button type="button" class="qk-card qk-in" data-k="' + placed[i] + '"><span class="qk-n">' + (i + 1) + '</span>' + q.items[placed[i]] + '</button>' : '<span class="qk-slot"><span class="qk-n">' + (i + 1) + '</span></span>';
        slots.innerHTML = (q.first ? '<span class="qk-end">' + q.first + '</span>' : '') + h + (q.last ? '<span class="qk-end">' + q.last + '</span>' : '');
        pool.innerHTML = show.filter(function (k) { return placed.indexOf(k) < 0; }).map(function (k) { return '<button type="button" class="qk-card" data-k="' + k + '">' + q.items[k] + '</button>'; }).join('');
        $$('.qk-card', el).forEach(function (b) {
          b.addEventListener('click', function () {
            if (api.locked) return;
            var k = +b.getAttribute('data-k'), at = placed.indexOf(k);
            if (at >= 0) placed.splice(at, 1); else placed.push(k);
            msg(''); draw();
            var nb = $('.qk-pool .qk-card', el) || $('.qk-go', el); if (nb) nb.focus();
          });
        });
        if (api.locked) api.lock();
      }
      draw();
      $('.qk-go', el).addEventListener('click', function () {
        if (placed.length < n) { msg('Place every card first.'); return; }
        var ok = placed.every(function (k, i) { return k === i; });
        if (!ok) { $$('.qk-slots .qk-card', el).forEach(function (b, i) { if (placed[i] !== i) b.classList.add('qk-no'); }); bump(slots); }
        cb(ok, placed.map(function (k) { return strip(q.items[k]); }).join(', '));
      });
      api.reveal = function () { placed = []; for (var i = 0; i < n; i++) placed.push(i); draw(); $$('.qk-slots .qk-card', el).forEach(function (b) { b.classList.add('qk-yes'); }); };
    },

    /* ---------- place it on a number line ---------- */
    line: function (el, q, cb, api, msg) {
      var min = q.min, max = q.max, tick = q.tick || 1, every = q.every || tick * 5, snap = q.snap || tick, tol = q.tol == null ? 0 : q.tol;
      var W = 420, H = 112, x0 = 26, x1 = W - 26, Y = 52, pos = null;
      /* keep labels readable on a phone: at most 6 labels */
      while ((max - min) / every > 6) every *= 2;
      function X(v) { return x0 + (x1 - x0) * (v - min) / (max - min); }
      var s = '<line x1="' + x0 + '" y1="' + Y + '" x2="' + x1 + '" y2="' + Y + '" stroke="currentColor" stroke-width="3"/>';
      var nt = Math.round((max - min) / tick);
      for (var i = 0; i <= nt; i++) {
        var v = A.clean ? A.clean(min + i * tick) : min + i * tick, lab = Math.abs(((v - min) / every) - Math.round((v - min) / every)) < 1e-9;
        s += '<line x1="' + X(v) + '" y1="' + (Y - (lab ? 12 : 7)) + '" x2="' + X(v) + '" y2="' + (Y + (lab ? 12 : 7)) + '" stroke="currentColor" stroke-width="' + (lab ? 2.5 : 1.5) + '"/>' +
          (lab ? '<text x="' + X(v) + '" y="' + (Y + 36) + '" text-anchor="middle" font-size="19" fill="currentColor">' + (q.label ? q.label(v) : fmt(v)) + '</text>' : '');
      }
      el.innerHTML = '<p class="qk-tip">Tap or drag on the line to place the marker' + (q.place ? ' for <b>' + q.place + '</b>' : '') + '. Then press Check.</p>' +
        '<div class="qk-nl"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Number line from ' + fmt(min) + ' to ' + fmt(max) + '">' + s +
        '<g class="qk-true" style="display:none"><line x1="0" y1="' + (Y - 26) + '" x2="0" y2="' + (Y + 4) + '" stroke-width="3"/><text x="0" y="' + (Y - 30) + '" text-anchor="middle" font-size="17" font-weight="700"></text></g>' +
        '<g class="qk-mark" style="display:none"><circle cx="0" cy="' + Y + '" r="11"/><text x="0" y="' + (Y - 18) + '" text-anchor="middle" font-size="18" font-weight="700"></text></g>' +
        '<rect class="qk-hitbar" x="0" y="0" width="' + W + '" height="' + H + '" fill="transparent"/></svg></div>' +
        '<div class="qk-nudge"><button type="button" class="btn alt qk-l" aria-label="Move left">&larr;</button><span class="qk-at">Not placed yet</span><button type="button" class="btn alt qk-r" aria-label="Move right">&rarr;</button></div>' + checkBtn();
      var svg = $('svg', el), mark = $('.qk-mark', el), drag = false;
      function setPos(v) {
        v = Math.round((v - min) / snap) * snap + min;
        v = A.clean ? A.clean(Math.max(min, Math.min(max, v))) : Math.max(min, Math.min(max, v));
        pos = v; mark.style.display = '';
        $('circle', mark).setAttribute('cx', X(v)); var t = $('text', mark); t.setAttribute('x', X(v)); t.textContent = q.hideValue ? '' : (q.label ? q.label(v) : fmt(v));
        $('.qk-at', el).textContent = q.hideValue ? 'Placed' : 'Marker at ' + (q.label ? q.label(v) : fmt(v)); msg('');
        $$('.qk-nl', el)[0].classList.remove('qk-no');
      }
      function fromEvent(e) {
        var r = svg.getBoundingClientRect(), cx = (e.touches ? e.touches[0].clientX : e.clientX);
        var sx = (cx - r.left) / r.width * W;
        setPos(min + (sx - x0) / (x1 - x0) * (max - min));
      }
      svg.addEventListener('pointerdown', function (e) { if (api.locked) return; drag = true; fromEvent(e); try { svg.setPointerCapture(e.pointerId); } catch (x) {} });
      svg.addEventListener('pointermove', function (e) { if (drag && !api.locked) fromEvent(e); });
      svg.addEventListener('pointerup', function () { drag = false; });
      $('.qk-l', el).addEventListener('click', function () { setPos(pos == null ? min : pos - snap); });
      $('.qk-r', el).addEventListener('click', function () { setPos(pos == null ? min : pos + snap); });
      api.setPos = setPos; /* for automated checks */
      $('.qk-go', el).addEventListener('click', function () {
        if (pos == null) { msg('Place the marker first.'); return; }
        var off = Math.abs(pos - q.answer), ok = off <= tol + 1e-9;
        if (!ok) { $$('.qk-nl', el)[0].classList.add('qk-no'); msg(q.hideValue ? 'Not quite there yet.' : 'You are ' + fmt(A.clean ? A.clean(off) : off) + ' away.'); }
        cb(ok, q.label ? q.label(pos) : fmt(pos));
      });
      api.reveal = function () {
        var g = $('.qk-true', el); g.style.display = '';
        $('line', g).setAttribute('x1', X(q.answer)); $('line', g).setAttribute('x2', X(q.answer));
        var t = $('text', g); t.setAttribute('x', X(q.answer)); t.textContent = q.label ? q.label(q.answer) : fmt(q.answer);
      };
    },

    /* ---------- match pairs: tap one on the left, then its partner on the right ---------- */
    match: function (el, q, cb, api, msg) {
      var n = q.pairs.length, rorder = mixed(n), link = {}, sel = null;
      el.innerHTML = '<p class="qk-tip">Tap a card on the left, then the card that matches it on the right.</p><div class="qk-cols"><div class="qk-col qk-left"></div><div class="qk-col qk-right"></div></div>' + checkBtn();
      function draw() {
        var used = {};
        Object.keys(link).forEach(function (l) { used[link[l]] = +l + 1; });
        $('.qk-left', el).innerHTML = q.pairs.map(function (p, i) {
          return '<button type="button" class="qk-card' + (sel === i ? ' qk-sel' : '') + (link[i] != null ? ' qk-linked' : '') + '" data-l="' + i + '">' + (link[i] != null ? '<span class="qk-n">' + (i + 1) + '</span>' : '<span class="qk-n qk-n0">' + (i + 1) + '</span>') + p[0] + '</button>';
        }).join('');
        $('.qk-right', el).innerHTML = rorder.map(function (r) {
          return '<button type="button" class="qk-card' + (used[r] ? ' qk-linked' : '') + '" data-r="' + r + '">' + (used[r] ? '<span class="qk-n">' + used[r] + '</span>' : '') + q.pairs[r][1] + '</button>';
        }).join('');
        $$('[data-l]', el).forEach(function (b) { b.addEventListener('click', function () { if (api.locked) return; var i = +b.getAttribute('data-l'); if (link[i] != null) { delete link[i]; sel = i; } else sel = sel === i ? null : i; msg(''); draw(); }); });
        $$('[data-r]', el).forEach(function (b) {
          b.addEventListener('click', function () {
            if (api.locked) return;
            var r = +b.getAttribute('data-r');
            Object.keys(link).forEach(function (l) { if (link[l] === r) delete link[l]; });
            if (sel == null) { for (var i = 0; i < n; i++) if (link[i] == null) { sel = i; break; } }
            if (sel != null) { link[sel] = r; sel = null; for (var k = 0; k < n; k++) if (link[k] == null) { sel = k; break; } }
            msg(''); draw();
          });
        });
        if (api.locked) api.lock();
      }
      sel = 0; draw();
      $('.qk-go', el).addEventListener('click', function () {
        if (Object.keys(link).length < n) { msg('Match every card first.'); return; }
        var bad = [];
        for (var i = 0; i < n; i++) if (link[i] !== i) bad.push(i);
        var given = q.pairs.map(function (p, i) { return strip(p[0]) + ' with ' + strip(q.pairs[link[i]][1]); }).join('; ');
        if (bad.length) { bad.forEach(function (i) { delete link[i]; }); sel = bad[0]; draw(); bad.forEach(function (i) { $$('[data-l]', el)[i].classList.add('qk-no'); }); msg(bad.length === 1 ? 'One match is not right. Fix it.' : bad.length + ' matches are not right. The right ones stay.'); }
        cb(!bad.length, given);
      });
      api.reveal = function () { for (var i = 0; i < n; i++) link[i] = i; sel = null; draw(); $$('.qk-card', el).forEach(function (b) { b.classList.add('qk-yes'); }); };
    },

    /* ---------- true or false, then why ---------- */
    tf: function (el, q, cb, api) {
      var pickTF = null;
      el.innerHTML = '<div class="opts qk-tfrow"><button type="button" class="opt" data-tf="1">True</button><button type="button" class="opt" data-tf="0">False</button></div><div class="qk-why"></div>';
      function why() {
        if (!q.why) return cb(pickTF === q.answer, pickTF ? 'True' : 'False');
        var w = $('.qk-why', el);
        w.innerHTML = '<p class="qk-tip"><b>Why?</b> Pick the best reason.</p><div class="opts">' + q.why.options.map(function (o, j) { return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>';
        $$('[data-j]', w).forEach(function (b) {
          b.addEventListener('click', function () {
            if (api.locked) return;
            var j = +b.getAttribute('data-j'), ok = j === q.why.answer;
            b.classList.add(ok ? 'qk-yes' : 'qk-no'); if (!ok) b.disabled = true;
            cb(ok, (pickTF ? 'True' : 'False') + '. ' + strip(q.why.options[j]));
          });
        });
        var f = $('[data-j]', w); if (f) f.focus();
      }
      $$('[data-tf]', el).forEach(function (b) {
        b.addEventListener('click', function () {
          if (api.locked || pickTF !== null) return;
          var v = b.getAttribute('data-tf') === '1';
          if (v !== q.answer) { b.classList.add('qk-no'); b.disabled = true; cb(false, v ? 'True' : 'False'); return; }
          pickTF = v; b.classList.add('qk-yes'); $$('[data-tf]', el).forEach(function (x) { x.disabled = true; });
          why();
        });
      });
      api.reveal = function () {
        $$('[data-tf]', el).forEach(function (b) { if ((b.getAttribute('data-tf') === '1') === q.answer) b.classList.add('qk-yes'); });
        if (q.why) {
          if (!$('[data-j]', el)) { pickTF = q.answer; why(); }
          $$('[data-j]', el).forEach(function (b, j) { if (j === q.why.answer) b.classList.add('qk-yes'); });
        }
      };
    },

    /* ---------- fill the blanks ---------- */
    fill: function (el, q, cb, api, msg) {
      var k = 0;
      var body = String(q.fill).replace(/\[\[\]\]/g, function () { var i = k++; return '<input type="text" inputmode="decimal" autocomplete="off" class="qk-blank" data-b="' + i + '" aria-label="Blank ' + (i + 1) + '">'; });
      el.innerHTML = '<div class="qk-fill">' + body + '</div>' + checkBtn();
      var ins = $$('.qk-blank', el);
      ins.forEach(function (inp, i) {
        inp.addEventListener('input', function () { inp.classList.remove('qk-no', 'qk-yes'); msg(''); });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (i + 1 < ins.length && !ins[i + 1].value) ins[i + 1].focus(); else $('.qk-go', el).click(); } });
      });
      function val(t) { return parseFloat(String(t).replace(/[^0-9.\-]/g, '')); }
      $('.qk-go', el).addEventListener('click', function () {
        var vs = ins.map(function (i) { return val(i.value); });
        if (vs.some(isNaN)) { msg('Fill every blank first.'); var e0 = ins.filter(function (i) { return isNaN(val(i.value)); })[0]; if (e0) e0.focus(); return; }
        var ok = true;
        vs.forEach(function (v, i) { var good = Math.abs(v - q.answers[i]) <= (q.tol || 1e-9); ins[i].classList.add(good ? 'qk-yes' : 'qk-no'); if (!good) ok = false; });
        cb(ok, vs.map(fmt).join(', '));
      });
      api.reveal = function () { ins.forEach(function (inp, i) { inp.value = fmt(q.answers[i]); inp.classList.remove('qk-no'); inp.classList.add('qk-yes'); }); };
    },

    /* ---------- build it with a tool ---------- */
    build: function (el, q, cb, api, msg) {
      el.innerHTML = '<div class="qk-tool"></div>' + checkBtn('Check my build');
      var M = window.Manip, tool = null;
      if (M && M[q.tool]) {
        var o = {}; for (var key in (q.opts || {})) o[key] = q.opts[key];
        if (q.tool === 'base10') { o.controls = true; o.hideTotal = true; if (o.h == null) { o.h = 0; o.t = 0; o.o = 0; } }
        tool = M[q.tool]($('.qk-tool', el), o);
      }
      api.tool = tool;
      function value() { if (!tool) return NaN; var s = tool.state(); return q.tool === 'coins' ? s.total : s.value; }
      $('.qk-go', el).addEventListener('click', function () {
        var v = value();
        if (!v) { msg('Build something first.'); return; }
        var ok = v === q.answer;
        if (!ok) { bump($('.qk-tool', el)); msg(q.tool === 'coins' ? 'You made $' + (v / 100).toFixed(2) + '.' : 'Your blocks show ' + fmt(v) + '.'); }
        cb(ok, q.tool === 'coins' ? '$' + (v / 100).toFixed(2) : fmt(v));
      });
      api.reveal = function () { if (tool && tool.set && q.tool === 'base10') tool.set(Math.floor(q.answer / 100), Math.floor(q.answer / 10) % 10, q.answer % 10); };
    }
  };

  /* ---------- question shapes ----------
     A skill keeps one idea but asks it in different ways. list = [[minLevel, name, fn(lv)], ...].
     Shapes unlock with the level, so level 1 stays plain and pictorial. The last shape used is not repeated. */
  var lastShape = {};
  Q.vary = function (id, lv, list) {
    var ok = list.filter(function (s) { return lv >= s[0] && (!s[3] || lv <= s[3]); });
    if (!ok.length) ok = [list[0]];
    var choice = ok.length > 1 ? ok.filter(function (s) { return s[1] !== lastShape[id]; }) : ok;
    var s = choice[Math.floor(Math.random() * choice.length)];
    lastShape[id] = s[1];
    var q = s[2](lv);
    q.shape = s[1];
    return q;
  };
  /* Give every practice skill in a chapter its extra shapes, and turn on fresh quizzes.
     SHAPES = { skillId: [[minLevel, name, fn(lv)], ...] }. Each skill keeps its first way of asking as 'plain'.
     Call it once at the end of the chapter file: Atlas.Q.shapes('chapter-id', SHAPES). */
  Q.shapes = function (id, SHAPES) {
    var ch = A.chapters[id];
    if (!ch) return;
    ch.quizFresh = true;
    ch.practice.forEach(function (sk) {
      var plain = sk.gen, extra = SHAPES[sk.id] || [];
      sk.shapes = ['plain'].concat(extra.map(function (s) { return s[1]; }));
      sk.gen = function (lv) { return Q.vary(sk.id, lv, [[1, 'plain', plain]].concat(extra)); };
    });
    ch._shapes = SHAPES;
  };
  /* names and places for word problems: short, everyday, Canadian */
  Q.names = ['Ava', 'Liam', 'Noor', 'Ethan', 'Mei', 'Arjun', 'Chloe', 'Kai', 'Zara', 'Owen', 'Amara', 'Lucas', 'Sofia', 'Jayden', 'Leila', 'Mateo', 'Hana', 'Theo'];
  Q.name = function () { return Q.names[Math.floor(Math.random() * Q.names.length)]; };
  Q.two = function () { var a = Q.name(), b; do { b = Q.name(); } while (b === a); return [a, b]; };
})();
