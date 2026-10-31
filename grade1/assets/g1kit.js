/* Grade 1 hands-on pieces that sit beside the shared tools in manip.js.
   Each one works like a shared tool: var t = G1.objects(el, options); t.reset(), t.state(), options.onChange(state, tool),
   and short moves the "Watch" player can string together.
   - G1.stage: a picture that changes step by step (a short clip made from drawings).
   - G1.objects: pictures (apples, fish ...) to tap and count. Each one lights up and shows its number.
   - G1.pick: cards to tap and choose (all the triangles, the longer ribbon ...). Chosen cards light up.
   - G1.strip: build a row by tapping a tray (patterns, coding steps). */
(function () {
  'use strict';
  var A = window.Atlas, M = window.Manip, G = (window.G1 = {});

  function base(root, kind) {
    var T = { kind: kind, root: root, ep: 0, fast: false };
    T.wait = function (ms) { return T.fast ? Promise.resolve() : new Promise(function (r) { setTimeout(r, ms); }); };
    T.alive = function (ep) { return ep === T.ep; };
    root.classList.add('g1t', 'g1t-' + kind);
    return T;
  }
  function bump(el, cls) { if (el && !el.closest('.g1-still')) M.bump(el, cls); }
  function icon(kind, s) { return '<svg viewBox="0 0 40 40" width="' + s + '" height="' + s + '" aria-hidden="true" focusable="false">' + A.icon(kind, 20, 20, 34) + '</svg>'; }
  G.icon = icon;

  /* ---------- a picture that changes: show(html) swaps it in with a soft fade ---------- */
  G.stage = function (root, o) {
    o = o || {};
    var T = base(root, 'stage');
    T.show = function (html, ms) {
      root.innerHTML = '<div class="g1-frame">' + html + '</div>';
      if (!T.fast) bump(root.firstChild, 'mp-fade');
      return T.wait(ms || 500);
    };
    /* light up the parts of the picture that match a selector, one after another */
    T.glow = function (sel, gap) {
      var ep = T.ep, els = A.$$(sel, root), i = 0;
      function one() {
        if (!T.alive(ep) || i >= els.length) return Promise.resolve();
        els[i++].classList.add('g1-glow');
        return T.wait(gap || 350).then(one);
      }
      return one();
    };
    T.state = function () { return {}; };
    T.reset = function () { T.ep++; root.innerHTML = o.start ? '<div class="g1-frame">' + o.start + '</div>' : ''; };
    T.reset();
    return T;
  };

  /* ---------- pictures to tap and count ----------
     options: kind ('apple' ...), n, max, min, per (in a row, default 10, with a gap after 5), controls (+1 / -1 / mix), size, tap, onChange.
     Moves: setN(n), countAll(gap), clearLit(), lightTo(k). */
  G.objects = function (root, o) {
    o = o || {};
    var T = base(root, 'obj'), n = 0, count = 0, last = '', kind = o.kind || 'apple', mixed = false;
    root.innerHTML = (o.controls ? '<div class="mp-acts"><button type="button" class="mp-act" data-a="less" aria-label="One fewer">&minus; 1</button><button type="button" class="mp-act" data-a="more" aria-label="One more">+ 1</button>' +
      (o.controls === true || o.controls.indexOf('mix') >= 0 ? '<button type="button" class="mp-act" data-a="mix">Mix them up</button><button type="button" class="mp-act" data-a="line">Line them up</button>' : '') + '</div>' : '') +
      '<div class="g1-objs" role="group" aria-label="' + A.NAMES[kind][1] + ' to count"></div><div class="mp-read" aria-live="polite"></div>';
    var box = A.$('.g1-objs', root), read = A.$('.mp-read', root);
    function state() { return { n: n, counted: count, allCounted: n > 0 && count === n, mixed: mixed, last: last }; }
    function readout() {
      if (o.readout === false) { read.innerHTML = ''; return; }
      read.innerHTML = count ? '<p>' + (count === n ? 'You counted <span class="mp-num">' + n + '</span>. The last number tells how many.' : 'Counted so far: <span class="mp-num">' + count + '</span>') + '</p>' :
        (o.showN ? '<p>' + A.nm(kind, n) + '</p>' : '<p class="t2">Tap each one to count it.</p>');
    }
    function change() { readout(); sync(); if (o.onChange) o.onChange(state(), T); }
    function draw() {
      var per = o.per || 10, s = o.size || 46, h = '';
      for (var i = 0; i < n; i++) {
        var gap = !mixed && per === 10 && i % 10 === 5 ? ' g5' : '', brk = !mixed && i && i % per === 0 ? '<i class="g1-br"></i>' : '';
        var off = mixed ? ' style="transform:translate(' + (((i * 37) % 11) - 5) + 'px,' + (((i * 53) % 13) - 6) + 'px) rotate(' + (((i * 29) % 21) - 10) + 'deg)"' : '';
        h += brk + '<button type="button" class="g1-ob' + gap + '" data-i="' + i + '" aria-pressed="false" aria-label="' + A.NAMES[kind][0] + '"' + off + '>' + icon(kind, s) + '<b></b></button>';
      }
      box.innerHTML = h;
      box.classList.toggle('mixed', mixed);
      count = 0;
    }
    function light(b) {
      count++;
      b.classList.add('lit'); b.setAttribute('aria-pressed', 'true');
      A.$('b', b).textContent = count;
      if (!T.fast) bump(b, 'mp-pop');
    }
    function unlightAll() {
      count = 0;
      A.$$('.g1-ob', box).forEach(function (b) { b.classList.remove('lit'); b.setAttribute('aria-pressed', 'false'); A.$('b', b).textContent = ''; });
    }
    function sync() {
      A.$$('.mp-act', root).forEach(function (b) {
        var a = b.getAttribute('data-a');
        b.disabled = a === 'less' ? n <= (o.min || 0) : a === 'more' ? n >= (o.max || 30) : a === 'mix' ? mixed : a === 'line' ? !mixed : false;
      });
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.g1-ob');
      if (!b || o.tap === false) return;
      if (b.classList.contains('lit')) unlightAll(); else light(b);
      last = 'tap'; change();
    });
    if (o.controls) A.$('.mp-acts', root).addEventListener('click', function (e) {
      var b = e.target.closest('.mp-act');
      if (!b || b.disabled) return;
      var a = b.getAttribute('data-a');
      if (a === 'less') T.setN(n - 1); else if (a === 'more') T.setN(n + 1); else T.mix(a === 'mix');
      last = a; change();
    });
    T.setN = function (k) { n = Math.max(0, Math.min(o.max || 30, k)); draw(); change(); return T.wait(300); };
    T.mix = function (on) { mixed = on; draw(); change(); return T.wait(500); };
    T.lightTo = function (k, gap) {
      var ep = T.ep, bs = A.$$('.g1-ob', box);
      unlightAll(); readout();
      var i = 0;
      function one() {
        if (!T.alive(ep) || i >= Math.min(k, bs.length)) return Promise.resolve();
        light(bs[i++]); readout();
        return T.wait(gap || 380).then(one);
      }
      return one().then(function () { last = 'count'; change(); });
    };
    T.countAll = function (gap) { return T.lightTo(n, gap); };
    T.clearLit = function () { unlightAll(); change(); };
    T.state = state;
    T.reset = function () { T.ep++; n = o.n || 0; mixed = !!o.mixed; last = ''; draw(); change(); };
    T.reset();
    return T;
  };

  /* ---------- cards to tap and choose ----------
     options: items [{id, html, label}], multi (choose many, default true), cols, onChange.
     state: { picked: [ids in tap order] }. Moves: pick(id), clear(). */
  G.pick = function (root, o) {
    o = o || {};
    var T = base(root, 'pick'), picked = [];
    root.innerHTML = '<div class="g1-cards"' + (o.cols ? ' style="--cols:' + o.cols + '"' : '') + ' role="group">' + o.items.map(function (it) {
      return '<button type="button" class="g1-card" data-id="' + it.id + '" aria-pressed="false"' + (it.label ? ' aria-label="' + it.label + '"' : '') + '>' + it.html + '</button>';
    }).join('') + '</div>' + (o.readout ? '<div class="mp-read" aria-live="polite"></div>' : '');
    var read = A.$('.mp-read', root);
    function state() { return { picked: picked.slice(), n: picked.length }; }
    function draw(id) {
      A.$$('.g1-card', root).forEach(function (b) {
        var on = picked.indexOf(b.getAttribute('data-id')) >= 0;
        b.classList.toggle('lit', on); b.setAttribute('aria-pressed', String(on));
        if (on && b.getAttribute('data-id') === id && !T.fast) bump(b, 'mp-pop');
      });
      if (read) read.innerHTML = typeof o.readout === 'function' ? o.readout(state()) : '';
      if (o.onChange) o.onChange(state(), T);
    }
    T.pick = function (id) {
      var at = picked.indexOf(id);
      if (at >= 0) picked.splice(at, 1);
      else { if (o.multi === false) picked = []; picked.push(id); }
      draw(id);
      return T.wait(500);
    };
    root.addEventListener('click', function (e) { var b = e.target.closest('.g1-card'); if (b) T.pick(b.getAttribute('data-id')); });
    T.clear = function () { picked = []; draw(); return T.wait(100); };
    T.state = state;
    T.reset = function () { T.ep++; picked = []; draw(); };
    T.reset();
    return T;
  };

  /* ---------- build a row by tapping a tray ----------
     options: tray [{id, html, label}], start [ids] (fixed, cannot be removed), slots (empty boxes to show), max, onChange.
     state: { seq: [all ids], added: [ids the student added] }. Moves: add(id), undo(), clear(). */
  G.strip = function (root, o) {
    o = o || {};
    var T = base(root, 'strip'), added = [], by = {};
    o.tray.forEach(function (t) { by[t.id] = t; });
    root.innerHTML = '<div class="g1-row" aria-live="polite"></div>' +
      (o.tap === false ? '' : '<div class="mp-tray g1-tray">' + o.tray.map(function (t) { return '<button type="button" class="g1-tb" data-id="' + t.id + '" aria-label="Add ' + (t.label || t.id) + '">' + t.html + '</button>'; }).join('') + '</div>' +
      '<div class="mp-acts"><button type="button" class="mp-act" data-a="undo">Take back</button><button type="button" class="mp-act" data-a="clear">Start again</button></div>');
    var row = A.$('.g1-row', root);
    function seq() { return (o.start || []).concat(added); }
    function state() { return { seq: seq(), added: added.slice(), n: seq().length }; }
    function draw(enter) {
      var s = seq(), fixed = (o.start || []).length, slots = Math.max(o.slots || 0, s.length + (o.tap === false ? 0 : 1)), h = '';
      for (var i = 0; i < Math.min(slots, o.max || 99); i++) {
        var id = s[i];
        h += id ? '<span class="g1-cell' + (i >= fixed ? ' mine' : '') + (enter && i === s.length - 1 && !T.fast ? ' mp-enter' : '') + '" role="img" aria-label="' + (by[id].label || id) + '">' + by[id].html + '</span>' : '<span class="g1-cell empty" aria-hidden="true"></span>';
      }
      row.innerHTML = h;
      A.$$('.mp-act', root).forEach(function (b) { b.disabled = !added.length; });
      A.$$('.g1-tb', root).forEach(function (b) { b.disabled = s.length >= (o.max || 99); });
      if (o.onChange) o.onChange(state(), T);
    }
    T.add = function (id) { if (seq().length >= (o.max || 99)) return T.wait(0); added.push(id); draw(true); return T.wait(450); };
    T.undo = function () { added.pop(); draw(); return T.wait(200); };
    T.clear = function () { added = []; draw(); return T.wait(200); };
    root.addEventListener('click', function (e) {
      var b = e.target.closest('.g1-tb'), a = e.target.closest('.mp-act');
      if (b && !b.disabled) T.add(b.getAttribute('data-id'));
      else if (a && !a.disabled) { if (a.getAttribute('data-a') === 'undo') T.undo(); else T.clear(); }
    });
    T.state = state;
    T.reset = function () { T.ep++; added = []; draw(); };
    T.reset();
    return T;
  };

  /* an existing Grade 1 widget (a stepper drawing) as a "Try it" activity: html is the controls, wire(host) hooks them up */
  G.widget = function (html, wire, task) {
    return { do: task, mount: function (host, done) { host.innerHTML = html; wire(host, done); } };
  };
})();
/* make the Grade 1 pieces available by name, like the shared tools: { tool: 'g1objects', opts: {...} } */
(function () { var M = window.Manip, G = window.G1; M.g1objects = G.objects; M.g1pick = G.pick; M.g1strip = G.strip; M.g1stage = G.stage; })();
