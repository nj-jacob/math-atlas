/* Math Atlas manipulatives: hands-on tools a student can tap, light up, group and break apart.
   Shared by every grade. Colours come from the grade's own theme (CSS variables in manip.css), so each grade keeps its look.
   Every tool is made the same way:  var t = Manip.base10(element, options);
   and has t.reset(), t.state() and options.onChange(state, tool). Tools also have short animated moves
   (group, break, hop, count) that the "Watch" player strings together like a short video. No dependencies. */
(function () {
  'use strict';
  var M = (window.Manip = {});
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- small helpers ---------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function button(cls, html, label) {
    var b = el('button', cls, html);
    b.type = 'button';
    if (label) b.setAttribute('aria-label', label);
    return b;
  }
  function qs(s, r) { return r.querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call(r.querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function fmt(n) { return window.Atlas && Atlas.fmt ? Atlas.fmt(n) : String(n); }
  function pl(k, one, many) { return k + ' ' + (k === 1 ? one : many); }
  /* replay a CSS animation class */
  function bump(e, cls) { cls = cls || 'mp-bump'; e.classList.remove(cls); void e.offsetWidth; e.classList.add(cls); }
  M.bump = bump;
  /* a number that floats up from a spot and fades: +10 */
  function floatText(host, x, y, text) {
    var f = el('span', 'mp-float', text);
    f.style.left = x + 'px'; f.style.top = y + 'px';
    host.appendChild(f);
    setTimeout(function () { f.remove(); }, 1000);
  }
  M.floatText = floatText;
  function rng(seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }

  /* Each tool keeps an "epoch". reset() bumps it, so a move that is still animating stops changing things.
     tool.fast = true makes every wait instant (the player uses it to skip ahead). */
  function base(root, kind) {
    var T = { kind: kind, root: root, ep: 0, fast: false };
    T.wait = function (ms) {
      if (T.fast) return Promise.resolve();
      return new Promise(function (r) { setTimeout(r, ms); });
    };
    T.alive = function (ep) { return ep === T.ep; };
    root.classList.add('mp', 'mpt-' + kind);
    return T;
  }
  function announce(T, text) { var s = qs('.mp-live', T.root); if (s) s.textContent = text; }
  function watchSize(T, fn) {
    var w = 0;
    if (window.ResizeObserver) new ResizeObserver(function () { var nw = T.root.clientWidth; if (nw && nw !== w) { w = nw; fn(); } }).observe(T.root);
    else window.addEventListener('resize', fn);
  }

  /* ================= Base-ten blocks =================
     options: h, t, o (start counts); cols ['h','t','o'] or ['t','o']; controls (tray of buttons);
     readout (place value chart); words(n) (number words); expanded (show 100 + 40 + 7); tap (light up on tap, default true);
     max {h,t,o}; hideTotal; onChange(state, tool).
     Moves: add(kind, n), remove(kind, n), set(h,t,o), group('o'|'t'), split('t'|'h'), countAll(), lightKind(kind), clearLit(). */
  var VAL = { h: 100, t: 10, o: 1 }, NAME = { h: 'hundred flat', t: 'ten rod', o: 'one cube' }, NAMES = { h: 'hundred flats', t: 'ten rods', o: 'one cubes' };
  var PLACE = { h: 'Hundreds', t: 'Tens', o: 'Ones' };
  M.base10 = function (root, o) {
    o = o || {};
    var T = base(root, 'b10'), cols = o.cols || ['h', 't', 'o'], pieces = [], litOrder = [], last = '';
    var max = o.max || { h: 9, t: 19, o: 19 };
    var tray = '';
    if (o.controls) {
      tray = '<div class="mp-tray">' + cols.map(function (k) {
        return '<div class="mp-tg"><button type="button" class="mp-add" data-k="' + k + '" aria-label="Add a ' + NAME[k] + '"><i class="mp-ic mp-ic-' + k + '"></i><span>+ ' + (k === 'h' ? '100' : k === 't' ? '10' : '1') + '</span></button>' +
          '<button type="button" class="mp-sub" data-k="' + k + '" aria-label="Take away a ' + NAME[k] + '">&minus;</button></div>';
      }).join('') + '</div>' +
        '<div class="mp-acts">' +
        (cols.indexOf('t') >= 0 ? '<button type="button" class="mp-act" data-a="go">Group 10 ones</button><button type="button" class="mp-act" data-a="st">Break a ten</button>' : '') +
        (cols.indexOf('h') >= 0 ? '<button type="button" class="mp-act" data-a="gt">Group 10 tens</button><button type="button" class="mp-act" data-a="sh">Break a hundred</button>' : '') +
        '<button type="button" class="mp-act" data-a="count">Count them</button><button type="button" class="mp-act" data-a="clear">Clear</button></div>';
    }
    root.innerHTML = tray +
      '<div class="mp-mat" style="--n:' + cols.length + '">' + cols.map(function (k) { return '<div class="mp-col mp-c' + k + '" data-k="' + k + '"><span>' + PLACE[k] + '</span></div>'; }).join('') +
      '<div class="mp-layer"></div></div>' +
      '<div class="mp-read" aria-live="polite"></div><p class="mp-live sr" aria-live="polite"></p>';
    var mat = qs('.mp-mat', root), layer = qs('.mp-layer', root), read = qs('.mp-read', root);

    function counts() {
      var c = { h: 0, t: 0, o: 0 };
      pieces.forEach(function (p) { c[p.k]++; });
      return c;
    }
    function value() { var c = counts(); return c.h * 100 + c.t * 10 + c.o; }
    function geom() {
      var W = mat.clientWidth || 600, cw = W / cols.length, pad = clamp(cw * 0.07, 6, 16), inner = cw - 2 * pad;
      /* without a hundreds column the blocks can be bigger, which makes them easier to tap */
      var big = cols.indexOf('h') < 0;
      return { cw: cw, pad: pad, inner: inner, u: clamp(Math.min(o.u || (big ? 22 : 16), inner / (big ? 7.4 : 10.4)), 5, 22), top: 44 };
    }
    /* where the i-th piece of a kind sits, given how many of that kind there are */
    function slot(k, i, n, g) {
      var u = g.u, x0 = cols.indexOf(k) * g.cw + g.pad, y0 = g.top;
      if (k === 'h') {
        var step = n > 3 ? Math.max(2.2 * u, (7 * u) / (n - 1) + 0.5 * u) : 10.8 * u;
        return { x: x0 + (n > 3 ? i * 0.35 * u : 0), y: y0 + i * step, w: 10 * u, h: 10 * u };
      }
      if (k === 't') {
        var per = Math.max(1, Math.floor((g.inner + 0.5 * u) / (1.5 * u)));
        return { x: x0 + (i % per) * 1.5 * u, y: y0 + Math.floor(i / per) * 10.8 * u, w: u, h: 10 * u };
      }
      var grp = Math.floor(i / 10), j = i % 10;
      return { x: x0 + (j % 5) * 1.2 * u, y: y0 + grp * 3.3 * u + Math.floor(j / 5) * 1.2 * u, w: u, h: u };
    }
    function put(p, r) {
      p.el.style.width = r.w + 'px'; p.el.style.height = r.h + 'px';
      p.el.style.transform = 'translate(' + r.x + 'px,' + r.y + 'px)';
      p.r = r;
    }
    function layout() {
      var g = geom(), c = counts(), idx = { h: 0, t: 0, o: 0 }, bottom = g.top + 10.4 * g.u;
      mat.style.setProperty('--u', g.u + 'px');
      pieces.forEach(function (p) {
        var r = slot(p.k, idx[p.k]++, c[p.k], g);
        put(p, r);
        bottom = Math.max(bottom, r.y + r.h);
      });
      mat.style.height = Math.ceil(bottom + g.pad + 4) + 'px';
    }
    function make(k, enter) {
      var p = { k: k, lit: false, el: button('mp-pc mp-' + k, '<i class="mp-blk"></i><b class="mp-cnt"></b>', NAME[k] + ', worth ' + VAL[k]) };
      p.el.setAttribute('aria-pressed', 'false');
      if (o.tap === false) p.el.tabIndex = -1;
      p.el.addEventListener('click', function () { if (o.tap !== false) toggle(p); });
      if (enter && !T.fast) p.el.classList.add('mp-enter');
      layer.appendChild(p.el);
      return p;
    }
    /* keep pieces sorted hundreds, tens, ones so new ones land at the end of their column */
    function insert(p) {
      var order = { h: 0, t: 1, o: 2 }, at = pieces.length;
      for (var i = 0; i < pieces.length; i++) if (order[pieces[i].k] > order[p.k]) { at = i; break; }
      pieces.splice(at, 0, p);
    }
    function drop(p) {
      pieces.splice(pieces.indexOf(p), 1);
      unlit(p);
      if (T.fast) { p.el.remove(); return; }
      p.el.classList.add('mp-leave');
      setTimeout(function () { p.el.remove(); }, 320);
    }
    function relabel() {
      var sum = 0;
      litOrder.forEach(function (p) { sum += VAL[p.k]; qs('.mp-cnt', p.el).textContent = fmt(sum); });
      return sum;
    }
    function unlit(p) {
      if (!p.lit) return;
      p.lit = false; p.el.classList.remove('lit'); p.el.setAttribute('aria-pressed', 'false');
      litOrder.splice(litOrder.indexOf(p), 1);
      qs('.mp-cnt', p.el).textContent = '';
    }
    function light(p) {
      if (p.lit) return;
      p.lit = true; p.el.classList.add('lit'); p.el.setAttribute('aria-pressed', 'true');
      litOrder.push(p);
      var sum = relabel();
      if (!T.fast && p.r) floatText(layer, p.r.x + p.r.w / 2, p.r.y, '+' + VAL[p.k]);
      announce(T, 'Counted ' + fmt(sum));
    }
    function toggle(p) {
      if (p.lit) { unlit(p); relabel(); } else light(p);
      last = 'tap';
      change();
    }
    function state() {
      var c = counts(), lt = litOrder.reduce(function (s, p) { return s + VAL[p.k]; }, 0);
      return { h: c.h, t: c.t, o: c.o, value: c.h * 100 + c.t * 10 + c.o, lit: litOrder.length, litValue: lt, allLit: pieces.length > 0 && litOrder.length === pieces.length, last: last, pieces: pieces.length };
    }
    function readout() {
      var c = counts(), v = value(), h = '';
      if (o.readout !== false) {
        h += '<div class="mp-pvt">' + cols.map(function (k) {
          var d = c[k], over = d > 9 && k !== cols[0];
          return '<div class="mp-c' + k + (over ? ' over' : '') + '"><span>' + PLACE[k] + '</span><b>' + d + '</b></div>';
        }).join('') + '</div>';
        var over = cols.filter(function (k, i) { return i > 0 && c[k] > 9; });
        if (over.length) h += '<p class="mp-tip">' + (over[over.length - 1] === 'o' ? 'More than 9 ones. Group 10 ones into a ten.' : 'More than 9 tens. Group 10 tens into a hundred.') + '</p>';
      }
      if (!o.hideTotal) {
        h += '<p class="mp-total"><span class="mp-num">' + fmt(v) + '</span>';
        if (o.expanded && v) h += ' <span class="mp-exp">= ' + ['h', 't', 'o'].filter(function (k) { return c[k]; }).map(function (k) { return '<b class="mp-c' + k + 't">' + fmt(c[k] * VAL[k]) + '</b>'; }).join(' + ') + '</span>';
        if (o.words && v <= 999) h += ' <span class="mp-words">' + o.words(v) + '</span>';
        h += '</p>';
      }
      if (litOrder.length && litOrder.length < pieces.length) h += '<p class="mp-litline">Counted so far: <b>' + fmt(state().litValue) + '</b></p>';
      var before = read.getAttribute('data-v');
      read.innerHTML = h;
      if (before !== String(v)) { var n = qs('.mp-num', read); if (n && before !== null && !T.fast) bump(n); }
      read.setAttribute('data-v', String(v));
    }
    function sync() {
      if (!o.controls) return;
      var c = counts();
      qsa('.mp-add', root).forEach(function (b) { var k = b.getAttribute('data-k'); b.disabled = c[k] >= max[k] || value() + VAL[k] > (o.limit || 999); });
      qsa('.mp-sub', root).forEach(function (b) { b.disabled = !c[b.getAttribute('data-k')]; });
      qsa('.mp-act', root).forEach(function (b) {
        var a = b.getAttribute('data-a');
        b.disabled = a === 'go' ? c.o < 10 : a === 'gt' ? c.t < 10 : a === 'st' ? !c.t || c.o + 10 > max.o + 10 : a === 'sh' ? !c.h : !pieces.length;
        b.classList.toggle('mp-hint', (a === 'go' && c.o >= 10) || (a === 'gt' && c.t >= 10));
      });
    }
    function change() {
      readout(); sync();
      if (o.onChange) o.onChange(state(), T);
    }

    T.add = function (k, n, gap) {
      n = n || 1;
      var ep = T.ep, i = 0;
      last = 'add';
      function one() {
        if (!T.alive(ep) || i >= n) return Promise.resolve();
        i++;
        var p = make(k, true); insert(p); layout(); change();
        return T.wait(gap == null ? 160 : gap).then(one);
      }
      return one();
    };
    T.remove = function (k, n) {
      n = n || 1;
      for (var i = 0; i < n; i++) {
        var list = pieces.filter(function (p) { return p.k === k; });
        if (!list.length) break;
        drop(list[list.length - 1]);
      }
      last = 'remove';
      relabel(); layout(); change();
      return T.wait(250);
    };
    T.set = function (h, t, ones) {
      var want = { h: h || 0, t: t || 0, o: ones || 0 }, c = counts(), p = Promise.resolve();
      ['h', 't', 'o'].forEach(function (k) {
        if (c[k] > want[k]) T.remove(k, c[k] - want[k]);
        else if (c[k] < want[k]) { var d = want[k] - c[k]; p = p.then(function () { return T.add(k, d, 90); }); }
      });
      return p;
    };
    /* 10 ones slide together into a ten (or 10 tens into a hundred) */
    T.group = function (k) {
      var up = k === 'o' ? 't' : 'h', list = pieces.filter(function (p) { return p.k === k; });
      if (list.length < 10 || cols.indexOf(up) < 0) return Promise.resolve(false);
      var ep = T.ep, ten = list.slice(-10), g = geom(), c = counts(), u = g.u;
      var target = slot(up, c[up], c[up] + 1, g);
      ten.forEach(function (p, i) {
        unlit(p);
        p.el.classList.add('mp-merge');
        put(p, up === 't' ? { x: target.x, y: target.y + i * u, w: u, h: u } : { x: target.x + i * u, y: target.y, w: u, h: 10 * u });
      });
      relabel();
      return T.wait(700).then(function () {
        if (!T.alive(ep)) return false;
        ten.forEach(function (p) { pieces.splice(pieces.indexOf(p), 1); p.el.remove(); });
        var np = make(up, false);
        insert(np); layout();
        if (!T.fast) bump(np.el, 'mp-flash');
        last = 'group-' + k;
        change();
        announce(T, 'Ten ' + NAMES[k] + ' make one ' + NAME[up] + '.');
        return T.wait(500).then(function () { return true; });
      });
    };
    /* a ten breaks into 10 ones (or a hundred into 10 tens) */
    T.split = function (k) {
      var down = k === 't' ? 'o' : 't', list = pieces.filter(function (p) { return p.k === k; });
      if (!list.length || cols.indexOf(down) < 0) return Promise.resolve(false);
      var ep = T.ep, p = list[list.length - 1], r = p.r, u = geom().u, made = [];
      for (var i = 0; i < 10; i++) {
        var np = make(down, false);
        np.el.classList.add('mp-merge');
        put(np, down === 'o' ? { x: r.x, y: r.y + i * u, w: u, h: u } : { x: r.x + i * u, y: r.y, w: u, h: 10 * u });
        insert(np); made.push(np);
      }
      pieces.splice(pieces.indexOf(p), 1); unlit(p); p.el.remove(); relabel();
      void layer.offsetWidth;
      return T.wait(40).then(function () {
        if (!T.alive(ep)) return false;
        layout();
        last = 'split-' + k;
        change();
        announce(T, 'One ' + NAME[k] + ' is the same as ten ' + NAMES[down] + '.');
        return T.wait(750).then(function () { made.forEach(function (m) { m.el.classList.remove('mp-merge'); }); return true; });
      });
    };
    T.clearLit = function () { litOrder.slice().forEach(unlit); relabel(); change(); };
    T.lightKind = function (k, gap) {
      var ep = T.ep, list = pieces.filter(function (p) { return p.k === k && !p.lit; }), i = 0;
      function one() {
        if (!T.alive(ep) || i >= list.length) return Promise.resolve();
        light(list[i++]); change();
        return T.wait(gap || 420).then(one);
      }
      return one();
    };
    /* light every block in order, hundreds then tens then ones, with the running count */
    T.countAll = function (gap) {
      T.clearLit();
      var ep = T.ep;
      return T.lightKind('h', gap).then(function () { if (T.alive(ep)) return T.lightKind('t', gap); }).then(function () { if (T.alive(ep)) return T.lightKind('o', gap); }).then(function () { last = 'count'; });
    };
    T.pulseCol = function (k) { var c = qs('.mp-c' + k, mat); if (c && !T.fast) bump(c, 'mp-glow'); return T.wait(900); };
    T.state = state;
    T.value = value;
    T.reset = function () {
      T.ep++;
      pieces.slice().forEach(function (p) { p.el.remove(); });
      pieces = []; litOrder = []; last = '';
      var f = T.fast; T.fast = true;
      ['h', 't', 'o'].forEach(function (k) { for (var i = 0; i < (o[k] || 0); i++) insert(make(k, false)); });
      T.fast = f;
      layout(); change();
    };

    if (o.controls) {
      root.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b || b.disabled || !root.contains(b)) return;
        var k = b.getAttribute('data-k'), a = b.getAttribute('data-a');
        if (b.classList.contains('mp-add')) T.add(k, 1);
        else if (b.classList.contains('mp-sub')) T.remove(k, 1);
        else if (a === 'go') T.group('o');
        else if (a === 'gt') T.group('t');
        else if (a === 'st') T.split('t');
        else if (a === 'sh') T.split('h');
        else if (a === 'count') T.countAll(o.countGap || 380);
        else if (a === 'clear') { T.set(0, 0, 0); last = 'clear'; }
      });
    }
    T.reset();
    watchSize(T, layout);
    return T;
  };

  /* ================= Counters (dots you can tap, pair up, and group) =================
     options: n, max, arrange ('scatter' | 'tens' | 'pairs' | 'row'), seed, controls (+/- and arrange buttons), tap (count by tapping), onChange.
     Moves: arrange(name), setN(n), countAll(), clearLit(). */
  M.counters = function (root, o) {
    o = o || {};
    var T = base(root, 'cnt'), dots = [], mode = o.arrange || 'scatter', seed = o.seed || 7, count = 0, last = '';
    root.innerHTML = (o.controls ? '<div class="mp-acts">' +
      '<button type="button" class="mp-act" data-a="less" aria-label="One fewer counter">&minus; 1</button><button type="button" class="mp-act" data-a="more" aria-label="One more counter">+ 1</button>' +
      (o.controls === true || o.controls.indexOf('pairs') >= 0 ? '<button type="button" class="mp-act" data-a="pairs">Pair them up</button>' : '') +
      (o.controls === true || o.controls.indexOf('tens') >= 0 ? '<button type="button" class="mp-act" data-a="tens">Group in tens</button>' : '') +
      '<button type="button" class="mp-act" data-a="scatter">Mix them up</button></div>' : '') +
      '<div class="mp-area"></div><div class="mp-read" aria-live="polite"></div><p class="mp-live sr" aria-live="polite"></p>';
    var area = qs('.mp-area', root), read = qs('.mp-read', root);
    function d() { return clamp((area.clientWidth || 500) / 22, 16, o.size || 30); }
    function positions() {
      var W = area.clientWidth || 500, D = d(), n = dots.length, out = [], H = 0;
      if (mode === 'scatter') {
        var cols = Math.max(4, Math.floor(W / (D * 1.25))), rows = Math.max(3, Math.ceil(n * 1.7 / cols)), cw = W / cols, ch = D * 1.3, rnd = rng(seed), cells = [];
        for (var i = 0; i < cols * rows; i++) cells.push(i);
        for (var j = cells.length - 1; j > 0; j--) { var k = Math.floor(rnd() * (j + 1)), t = cells[j]; cells[j] = cells[k]; cells[k] = t; }
        for (var a = 0; a < n; a++) {
          var c = cells[a];
          out.push({ x: (c % cols) * cw + (cw - D) / 2 + (rnd() - 0.5) * (cw - D) * 0.8, y: Math.floor(c / cols) * ch + 6 + (rnd() - 0.5) * D * 0.25 });
        }
        H = rows * ch + 12;
      } else if (mode === 'pairs') {
        var g = D * 1.18, per = Math.max(2, Math.floor((W - 10) / g)), cut = 0;
        for (var b = 0; b < n; b++) {
          var col = Math.floor(b / 2), band = Math.floor(col / per);
          out.push({ x: 6 + (col % per) * g, y: 6 + band * (2 * g + D * 0.7) + (b % 2) * g });
          cut = band;
        }
        H = (cut + 1) * (2 * g + D * 0.7) + 6;
      } else {
        var size = mode === 'row' ? n : 10, gg = Math.min(D * 1.18, (W - 60) / (size + 0.6)), DD = Math.min(D, gg / 1.18);
        for (var e = 0; e < n; e++) {
          var r = Math.floor(e / size), cc = e % size;
          out.push({ x: 6 + cc * gg + (size === 10 && cc >= 5 ? gg * 0.5 : 0), y: 6 + r * gg * 1.12, s: DD });
        }
        H = Math.ceil(n / size) * gg * 1.12 + 10;
      }
      return { pos: out, H: Math.max(H, D * 2) };
    }
    function layout() {
      var p = positions(), D = d();
      area.style.height = Math.ceil(p.H) + 'px';
      qsa('.mp-rowlab,.mp-ring', area).forEach(function (x) { x.remove(); });
      dots.forEach(function (dot, i) {
        var q = p.pos[i], s = q.s || D;
        dot.el.style.width = dot.el.style.height = s + 'px';
        dot.el.style.transform = 'translate(' + q.x + 'px,' + q.y + 'px)';
        dot.x = q.x; dot.y = q.y; dot.s = s;
        dot.el.classList.toggle('alt', mode === 'tens' ? Math.floor(i / 10) % 2 === 1 : mode === 'pairs' ? i % 2 === 1 : false);
      });
      if (mode === 'tens' && dots.length) {
        for (var r = 0; r * 10 < dots.length; r++) {
          var lastDot = dots[Math.min(dots.length, r * 10 + 10) - 1], lab = el('span', 'mp-rowlab', fmt(Math.min(dots.length, r * 10 + 10)));
          lab.style.transform = 'translate(' + (lastDot.x + lastDot.s * 1.35 + (dots.length - r * 10 < 10 ? 0 : 0)) + 'px,' + (lastDot.y) + 'px)';
          lab.style.lineHeight = lastDot.s + 'px';
          area.appendChild(lab);
        }
      }
      if (mode === 'pairs' && dots.length % 2) {
        var odd = dots[dots.length - 1], ring = el('span', 'mp-ring');
        ring.style.width = ring.style.height = odd.s * 1.5 + 'px';
        ring.style.transform = 'translate(' + (odd.x - odd.s * 0.25) + 'px,' + (odd.y + dots[0].s * 1.18 - odd.s * 0.25) + 'px)';
        area.appendChild(ring);
      }
    }
    function make() {
      var dot = { lit: false, el: button('mp-dot', '<b></b>', 'counter') };
      dot.el.setAttribute('aria-pressed', 'false');
      if (o.tap === false) dot.el.tabIndex = -1;
      dot.el.addEventListener('click', function () { if (o.tap === false) return; if (dot.lit) unlightAll(); else lightOne(dot); last = 'tap'; change(); });
      area.appendChild(dot.el);
      return dot;
    }
    function lightOne(dot) {
      dot.lit = true; count++;
      dot.el.classList.add('lit'); dot.el.setAttribute('aria-pressed', 'true');
      qs('b', dot.el).textContent = count;
      announce(T, String(count));
    }
    function unlightAll() {
      count = 0;
      dots.forEach(function (x) { x.lit = false; x.el.classList.remove('lit'); x.el.setAttribute('aria-pressed', 'false'); qs('b', x.el).textContent = ''; });
    }
    function state() {
      var n = dots.length;
      return { n: n, mode: mode, counted: count, allCounted: n > 0 && count === n, even: n % 2 === 0, pairs: Math.floor(n / 2), leftover: n % 2, tens: Math.floor(n / 10), ones: n % 10, last: last };
    }
    function readout() {
      var s = state(), h = '';
      if (o.readout === false) { read.innerHTML = ''; return; }
      if (mode === 'pairs') h = '<p><b>' + pl(s.pairs, 'pair', 'pairs') + '</b>' + (s.leftover ? ' and <b>1 left over</b>. ' + s.n + ' is <b>odd</b>.' : ', none left over. ' + s.n + ' is <b>even</b>.') + '</p>';
      else if (mode === 'tens') h = '<p><b>' + pl(s.tens, 'ten', 'tens') + '</b> and <b>' + pl(s.ones, 'one', 'ones') + '</b> make <span class="mp-num">' + fmt(s.n) + '</span></p>';
      else if (o.showN !== false) h = '<p>Counters: <span class="mp-num">' + s.n + '</span></p>';
      if (count && count < s.n) h += '<p class="mp-litline">Counted so far: <b>' + count + '</b></p>';
      read.innerHTML = h;
    }
    function sync() {
      if (!o.controls) return;
      qsa('.mp-act', root).forEach(function (b) {
        var a = b.getAttribute('data-a');
        b.disabled = a === 'less' ? dots.length <= (o.min || 0) : a === 'more' ? dots.length >= (o.max || 60) : a === mode;
      });
    }
    function change() { readout(); sync(); if (o.onChange) o.onChange(state(), T); }
    T.arrange = function (m) { mode = m; unlightAll(); layout(); last = m; change(); return T.wait(800); };
    T.setN = function (n) {
      n = clamp(n, 0, o.max || 200);
      while (dots.length < n) { var dt = make(); if (!T.fast) dt.el.classList.add('mp-enter'); dots.push(dt); }
      while (dots.length > n) dots.pop().el.remove();
      unlightAll(); layout(); change();
      return T.wait(300);
    };
    T.countAll = function (gap) {
      unlightAll(); change();
      var ep = T.ep, i = 0;
      function one() {
        if (!T.alive(ep) || i >= dots.length) return Promise.resolve();
        lightOne(dots[i++]); readout();
        return T.wait(gap || 260).then(one);
      }
      return one().then(function () { last = 'count'; change(); });
    };
    T.clearLit = function () { unlightAll(); change(); };
    T.shuffle = function (s) { seed = s || seed + 11; return T.arrange('scatter'); };
    T.state = state;
    T.reset = function () {
      T.ep++;
      dots.forEach(function (x) { x.el.remove(); });
      dots = []; mode = o.arrange || 'scatter'; seed = o.seed || 7; last = '';
      var f = T.fast; T.fast = true; T.setN(o.n || 0); T.fast = f;
    };
    if (o.controls) root.addEventListener('click', function (e) {
      var b = e.target.closest('.mp-act');
      if (!b || b.disabled) return;
      var a = b.getAttribute('data-a');
      if (a === 'less') { T.setN(dots.length - 1); last = 'less'; }
      else if (a === 'more') { T.setN(dots.length + 1); last = 'more'; }
      else if (a === 'scatter') T.shuffle();
      else T.arrange(a);
      change();
    });
    T.reset();
    watchSize(T, layout);
    return T;
  };

  /* ================= Ten-frames =================
     options: frames (1 or 2), n, two (two colours: tap fills, tap again changes colour, then empties), onChange. */
  M.tenframe = function (root, o) {
    o = o || {};
    var T = base(root, 'tf'), F = o.frames || 1, cells = [];
    root.innerHTML = '<div class="mp-frames">' + Array.apply(null, Array(F)).map(function (x, f) {
      var h = '<div class="mp-frame">';
      for (var i = 0; i < 10; i++) h += '<button type="button" class="mp-cell" data-i="' + (f * 10 + i) + '" aria-label="Box ' + (f * 10 + i + 1) + '"><i></i></button>';
      return h + '</div>';
    }).join('') + '</div><div class="mp-read" aria-live="polite"></div>';
    var read = qs('.mp-read', root);
    function state() {
      var a = cells.filter(function (c) { return c === 1; }).length, b = cells.filter(function (c) { return c === 2; }).length;
      return { n: a + b, a: a, b: b, full: a + b === F * 10 };
    }
    function draw() {
      qsa('.mp-cell', root).forEach(function (b, i) {
        var was = b.getAttribute('data-c'), c = String(cells[i]);
        b.setAttribute('data-c', c);
        b.setAttribute('aria-pressed', cells[i] ? 'true' : 'false');
        if (was !== c && cells[i] && !T.fast) bump(qs('i', b), 'mp-pop');
      });
      var s = state();
      read.innerHTML = '<p><span class="mp-num">' + s.n + '</span>' + (o.two && s.b ? ' = <b class="mp-ka">' + s.a + '</b> + <b class="mp-kb">' + s.b + '</b>' : s.n > 5 && s.n <= 10 && F === 1 ? ' = 5 + ' + (s.n - 5) : s.n > 10 ? ' = 10 + ' + (s.n - 10) : '') + '</p>';
      if (o.onChange) o.onChange(s, T);
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('.mp-cell');
      if (!b) return;
      var i = +b.getAttribute('data-i');
      cells[i] = o.two ? (cells[i] + 1) % 3 : cells[i] ? 0 : 1;
      draw();
    });
    /* fill the first n boxes; boxes already full are skipped without a pause */
    T.fill = function (n, gap) {
      var ep = T.ep, i = 0;
      function one() {
        while (i < n && cells[i]) i++;
        if (!T.alive(ep) || i >= n) return Promise.resolve();
        cells[i++] = 1; draw();
        return T.wait(gap || 220).then(one);
      }
      return one();
    };
    T.state = state;
    T.reset = function () { T.ep++; cells = []; for (var i = 0; i < F * 10; i++) cells.push(i < (o.n || 0) ? 1 : 0); var f = T.fast; T.fast = true; draw(); T.fast = f; };
    T.reset();
    return T;
  };

  /* ================= Hundred chart =================
     options: from (1, or 101 for 101 to 200), to (last number shown, e.g. 50 for a 1 to 50 chart), pages (true: buttons for 1 to 100 and 101 to 200), lit [numbers], onChange.
     Moves: skip(step, start, upto), clear(), page(from). Tap a number to light it. */
  M.hundred = function (root, o) {
    o = o || {};
    var T = base(root, 'hc'), from = o.from || 1, lit = {}, order = [], last = '';
    root.innerHTML = (o.pages ? '<div class="mp-acts"><button type="button" class="mp-act" data-p="1">1 to 100</button><button type="button" class="mp-act" data-p="101">101 to 200</button><button type="button" class="mp-act" data-p="clear">Clear</button></div>' : '') +
      '<div class="mp-grid" role="group" aria-label="Hundred chart"></div><div class="mp-read" aria-live="polite"></div>';
    var grid = qs('.mp-grid', root), read = qs('.mp-read', root);
    function draw() {
      var h = '';
      for (var i = 0; i < lastN() - from + 1; i++) {
        var n = from + i;
        h += '<button type="button" class="mp-hn' + (lit[n] ? ' lit' : '') + '" data-n="' + n + '" aria-pressed="' + !!lit[n] + '">' + n + '</button>';
      }
      grid.innerHTML = h;
      qsa('.mp-act[data-p]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-p') === from)); });
      readout();
    }
    function lastN() { return Math.min(from + 99, o.to || from + 99); }
    function readout() {
      var list = order.slice(0, 40);
      read.innerHTML = order.length ? '<p class="mp-seq">' + list.map(function (n) { return '<b>' + n + '</b>'; }).join(', ') + (order.length > 40 ? ' &hellip;' : '') + '</p>' : '<p class="t2">Tap a number to light it up.</p>';
      if (o.onChange) o.onChange(state(), T);
    }
    function set(n, on) {
      if (!!lit[n] === on) return;
      if (on) { lit[n] = 1; order.push(n); } else { delete lit[n]; order.splice(order.indexOf(n), 1); }
      var b = qs('[data-n="' + n + '"]', grid);
      if (b) { b.classList.toggle('lit', on); b.setAttribute('aria-pressed', String(on)); if (on && !T.fast) bump(b, 'mp-pop'); }
    }
    function state() { return { lit: order.slice().sort(function (a, b) { return a - b; }), order: order.slice(), from: from, last: last }; }
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.mp-hn');
      if (!b) return;
      var n = +b.getAttribute('data-n');
      set(n, !lit[n]); last = 'tap'; readout();
    });
    if (o.pages) qs('.mp-acts', root).addEventListener('click', function (e) {
      var b = e.target.closest('.mp-act');
      if (!b) return;
      var p = b.getAttribute('data-p');
      if (p === 'clear') T.clear(); else T.page(+p);
    });
    T.page = function (f) { from = f; draw(); return T.wait(200); };
    T.clear = function () { lit = {}; order = []; last = 'clear'; draw(); return T.wait(100); };
    T.skip = function (step, start, upto, gap) {
      var ep = T.ep, n = start == null ? step : start;
      upto = Math.min(upto || lastN(), lastN());
      function one() {
        if (!T.alive(ep) || n > upto) return Promise.resolve();
        if (n >= from && n <= lastN()) set(n, true);
        readout(); n += step;
        return T.wait(gap || 180).then(one);
      }
      return one();
    };
    T.state = state;
    T.reset = function () { T.ep++; from = o.from || 1; lit = {}; order = []; last = ''; (o.lit || []).forEach(function (n) { lit[n] = 1; order.push(n); }); draw(); };
    T.reset();
    return T;
  };

  /* ================= Number line =================
     options: min, max, tick, every (label every), start (marker), step (jump buttons, a number or a list), marks [{v,t}],
     tap (tap or drag to move the marker, default true), onChange.
     Moves: hop(to, label), jumps(step, count), moveTo(v), mark(v, text), clearHops(). */
  M.numberline = function (root, o) {
    o = o || {};
    var T = base(root, 'nl'), min = o.min || 0, max = o.max == null ? 20 : o.max, tick = o.tick || 1, every = o.every || tick * 5;
    var W = 640, H = 120, x0 = 26, x1 = W - 26, Y = 80, pos = o.start == null ? min : o.start, hops = 0, last = '', steps = [].concat(o.step || []);
    var stepNow = steps[0] || 0;
    root.innerHTML = (steps.length ? '<div class="mp-acts">' + (steps.length > 1 ? steps.map(function (s) { return '<button type="button" class="mp-act mp-st" data-s="' + s + '">Jumps of ' + s + '</button>'; }).join('') : '') +
      '<button type="button" class="mp-act" data-j="-1">Jump back</button><button type="button" class="mp-act mp-fwd" data-j="1">Jump +' + stepNow + '</button><button type="button" class="mp-act" data-j="0">Start again</button></div>' : '') +
      '<div class="mp-nlbox"></div><div class="mp-read" aria-live="polite"></div>';
    var box = qs('.mp-nlbox', root), read = qs('.mp-read', root), svg, gHops, gMarks, marker, start0 = pos;
    function X(v) { return x0 + (x1 - x0) * (v - min) / (max - min); }
    function V(x) { return min + (x - x0) / (x1 - x0) * (max - min); }
    function S(tag, attrs, parent) {
      var e = document.createElementNS(SVGNS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    }
    /* the drawing is as wide as its box, so text stays readable on a phone */
    function build() {
      W = Math.max(280, (box.clientWidth || 648) - 8); x1 = W - 26;
      box.innerHTML = '';
      svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'mp-nl', role: 'img', 'aria-label': 'Number line from ' + min + ' to ' + max });
      box.appendChild(svg);
      S('line', { x1: x0 - 12, y1: Y, x2: x1 + 12, y2: Y, class: 'mp-axis' }, svg);
      var n = Math.round((max - min) / tick), lab = every, fs = W < 420 ? 13 : 15;
      while ((x1 - x0) * lab / (max - min) < String(max).length * fs * 0.75 + 8) lab *= 2;
      for (var i = 0; i <= n; i++) {
        var v = min + i * tick, r = Math.abs((v - min) % lab), big = r < 1e-9 || Math.abs(r - lab) < 1e-9;
        S('line', { x1: X(v), y1: Y - (big ? 9 : 5), x2: X(v), y2: Y + (big ? 9 : 5), class: 'mp-tk' }, svg);
        if (big) { var t = S('text', { x: X(v), y: Y + 28, 'text-anchor': 'middle', class: 'mp-tl', 'font-size': fs }, svg); t.textContent = fmt(Math.round(v * 1000) / 1000); }
      }
      gHops = S('g', {}, svg); gMarks = S('g', {}, svg);
      marker = S('g', { class: 'mp-mk' }, svg);
      S('circle', { r: 10, cx: 0, cy: Y }, marker);
      var lab = S('text', { x: 0, y: Y - 20, 'text-anchor': 'middle', class: 'mp-mkt' }, marker);
      lab.textContent = fmt(pos);
      place(pos);
      if (o.tap !== false) {
        var drag = false;
        svg.addEventListener('pointerdown', function (e) { drag = true; svg.setPointerCapture && svg.setPointerCapture(e.pointerId); pick(e, true); });
        svg.addEventListener('pointermove', function (e) { if (drag) pick(e, true); });
        svg.addEventListener('pointerup', function (e) { if (drag) { drag = false; pick(e, false); } });
        svg.addEventListener('pointercancel', function () { drag = false; });
      }
      (o.marks || []).forEach(function (m) { T.mark(m.v, m.t, true); });
    }
    function pick(e, moving) {
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var p = pt.matrixTransform(svg.getScreenCTM().inverse()), snap = o.snap || tick;
      var v = clamp(Math.round(V(p.x) / snap) * snap, min, max);
      v = Math.round(v * 1000) / 1000;
      if (v !== pos || !moving) { pos = v; place(v); last = 'tap'; if (!moving) change(); else readout(); }
    }
    function place(v) {
      marker.setAttribute('transform', 'translate(' + X(v) + ',0)');
      marker.querySelector('text').textContent = fmt(v);
    }
    function state() { return { at: pos, hops: hops, step: stepNow, last: last }; }
    function readout() {
      if (o.readout === false) { read.innerHTML = ''; return; }
      read.innerHTML = '<p>The marker is at <span class="mp-num">' + fmt(pos) + '</span>' + (hops ? ' after ' + pl(hops, 'jump', 'jumps') + (stepNow ? ' of ' + stepNow : '') : '') + '.</p>';
    }
    function change() { readout(); if (o.onChange) o.onChange(state(), T); }
    /* an arc that draws itself while the marker rides along it */
    T.hop = function (to, label) {
      var from = pos, a = X(from), b = X(to), hgt = clamp(Math.abs(b - a) * 0.45, 18, 60), ep = T.ep;
      var d = 'M' + a + ' ' + (Y - 4) + ' Q' + (a + b) / 2 + ' ' + (Y - 4 - hgt * 2) + ' ' + b + ' ' + (Y - 4);
      var path = S('path', { d: d, class: 'mp-hop' }, gHops), len = path.getTotalLength ? path.getTotalLength() : 200;
      if (label) { var t = S('text', { x: (a + b) / 2, y: Y - 8 - hgt, 'text-anchor': 'middle', class: 'mp-hopt' }, gHops); t.textContent = label; if (!T.fast) bump(t, 'mp-fade'); }
      hops++; pos = to; last = 'hop';
      if (T.fast) { place(to); change(); return Promise.resolve(); }
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      var t0 = null, dur = 650;
      return new Promise(function (res) {
        function frame(ts) {
          if (!T.alive(ep)) return res();
          if (t0 === null) t0 = ts;
          var k = Math.min(1, (ts - t0) / dur), e2 = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          path.style.strokeDashoffset = len * (1 - e2);
          var pt = path.getPointAtLength(len * e2);
          marker.setAttribute('transform', 'translate(' + pt.x + ',' + (pt.y - Y + 4) + ')');
          if (k < 1) requestAnimationFrame(frame);
          else { place(to); change(); res(); }
        }
        requestAnimationFrame(frame);
      });
    };
    T.jumps = function (step, count, gap) {
      var ep = T.ep, i = 0;
      function one() {
        if (!T.alive(ep) || i >= count || pos + step > max || pos + step < min) return Promise.resolve();
        i++;
        return T.hop(Math.round((pos + step) * 1000) / 1000, (step > 0 ? '+' : '') + step).then(function () { return T.wait(gap || 250); }).then(one);
      }
      return one();
    };
    T.moveTo = function (v) { pos = v; place(v); change(); return T.wait(300); };
    T.mark = function (v, text, quiet) {
      var g = S('g', { class: 'mp-pt' }, gMarks);
      S('circle', { cx: X(v), cy: Y, r: 7 }, g);
      var t = S('text', { x: X(v), y: Y - 16, 'text-anchor': 'middle' }, g);
      t.textContent = text == null ? fmt(v) : text;
      if (!T.fast && !quiet) bump(g, 'mp-fade');
      return T.wait(500);
    };
    T.clearHops = function () { gHops.innerHTML = ''; hops = 0; return T.wait(50); };
    T.setStep = function (s) {
      stepNow = s;
      var f = qs('.mp-fwd', root);
      if (f) f.textContent = 'Jump +' + s;
      qsa('.mp-st', root).forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-s') === s)); });
    };
    T.state = state;
    T.reset = function () { T.ep++; pos = start0; hops = 0; last = ''; build(); change(); };
    watchSize(T, function () { var keep = pos; build(); pos = keep; place(pos); });
    if (steps.length) qs('.mp-acts', root).addEventListener('click', function (e) {
      var b = e.target.closest('.mp-act');
      if (!b) return;
      if (b.hasAttribute('data-s')) { T.setStep(+b.getAttribute('data-s')); T.clearHops(); T.moveTo(start0); return; }
      var j = +b.getAttribute('data-j');
      if (j === 0) { T.clearHops(); T.moveTo(start0); last = 'restart'; }
      else if (pos + j * stepNow <= max && pos + j * stepNow >= min) T.hop(Math.round((pos + j * stepNow) * 1000) / 1000, (j > 0 ? '+' : '−') + stepNow);
    });
    T.reset();
    T.setStep(stepNow);
    return T;
  };

  /* ================= Fraction strips =================
     options: parts (start), choices [2,3,4,6,8], wall [1,2,3,6] (a stack of strips to compare),
     words (label parts and the readout with fraction words only, "one half", "two sixths", for Grades 1 to 3), onChange.
     Tap a part to shade it. Moves: split(d), shade(k). */
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  M.fractions = function (root, o) {
    o = o || {};
    var T = base(root, 'fr'), rows = o.wall ? o.wall.slice() : [o.parts || 1], shade = rows.map(function () { return {}; });
    var choices = o.choices || (o.wall ? null : [1, 2, 3, 4, 6, 8]);
    root.innerHTML = (choices ? '<div class="mp-acts">' + choices.map(function (d) { return '<button type="button" class="mp-act" data-d="' + d + '">' + (d === 1 ? '1 whole' : d + ' parts') + '</button>'; }).join('') + '</div>' : '') +
      '<div class="mp-wall"></div><div class="mp-read" aria-live="polite"></div>';
    var wall = qs('.mp-wall', root), read = qs('.mp-read', root);
    function name(n, d) {
      var w = { 1: 'whole', 2: 'half', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 8: 'eighth', 10: 'tenth', 12: 'twelfth' }[d] || (d + 'th');
      var k = o.words ? (NUMW[n] || String(n)) : n;
      if (d === 1) return k + (n === 1 ? ' whole' : ' wholes');
      return k + ' ' + (n === 1 ? w : (d === 2 ? 'halves' : w + 's'));
    }
    function label(d) { return d === 1 ? (o.words ? 'one whole' : '1') : o.words ? '<span class="mp-fw">' + name(1, d) + '</span>' : '<span class="mp-fr"><b>1</b><i>' + d + '</i></span>'; }
    function draw(anim) {
      wall.innerHTML = rows.map(function (d, r) {
        var h = '<div class="mp-strip' + (anim && !T.fast ? ' mp-split' : '') + '" data-r="' + r + '">';
        for (var i = 0; i < d; i++) h += '<button type="button" class="mp-part' + (shade[r][i] ? ' on' : '') + '" data-r="' + r + '" data-i="' + i + '" aria-pressed="' + !!shade[r][i] + '" aria-label="Part ' + (i + 1) + ' of ' + d + '">' + label(d) + '</button>';
        return h + '</div>';
      }).join('');
      qsa('.mp-act[data-d]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-d') === rows[0])); });
      readout();
    }
    function state() {
      return rows.map(function (d, r) { var n = Object.keys(shade[r]).length; return { d: d, n: n, value: n / d }; });
    }
    function readout() {
      read.innerHTML = state().map(function (s) {
        return s.n ? '<p>' + (o.words ? '<b class="mp-fwb">' + name(s.n, s.d) + '</b>' : '<span class="mp-fr big"><b>' + s.n + '</b><i>' + s.d + '</i></span> ' + name(s.n, s.d)) + ' shaded' + (s.d > 1 ? ' (' + s.n + ' of ' + s.d + ' equal parts)' : '') + '</p>' : '';
      }).join('') || '<p class="t2">Tap a part to shade it.</p>';
      if (o.onChange) o.onChange(state(), T);
    }
    wall.addEventListener('click', function (e) {
      var b = e.target.closest('.mp-part');
      if (!b) return;
      var r = +b.getAttribute('data-r'), i = +b.getAttribute('data-i');
      if (shade[r][i]) delete shade[r][i]; else shade[r][i] = 1;
      b.classList.toggle('on', !!shade[r][i]); b.setAttribute('aria-pressed', String(!!shade[r][i]));
      if (shade[r][i]) bump(b, 'mp-pop');
      readout();
    });
    if (choices) qs('.mp-acts', root).addEventListener('click', function (e) {
      var b = e.target.closest('[data-d]');
      if (b) T.split(+b.getAttribute('data-d'));
    });
    T.split = function (d, r) { r = r || 0; rows[r] = d; shade[r] = {}; draw(true); return T.wait(600); };
    T.shade = function (k, r, gap) {
      r = r || 0;
      var ep = T.ep, i = 0;
      function one() {
        if (!T.alive(ep) || i >= k) return Promise.resolve();
        shade[r][i++] = 1; draw(false);
        var b = qs('.mp-part[data-r="' + r + '"][data-i="' + (i - 1) + '"]', wall);
        if (b && !T.fast) bump(b, 'mp-pop');
        return T.wait(gap || 350).then(one);
      }
      return one();
    };
    T.state = state;
    T.reset = function () { T.ep++; rows = o.wall ? o.wall.slice() : [o.parts || 1]; shade = rows.map(function () { return {}; }); draw(false); };
    T.reset();
    return T;
  };

  /* ================= Canadian coins and bills =================
     options: set (values in cents, default 5, 10, 25, 100, 200), start [values], onChange.
     Tap the tray to add, tap a coin on the mat to take it away. Moves: add(v), sort(), countAll(). */
  var CASH = {
    5: { n: 'nickel', t: '5¢', r: 21, c: 'mp-silver' }, 10: { n: 'dime', t: '10¢', r: 18, c: 'mp-silver' }, 25: { n: 'quarter', t: '25¢', r: 24, c: 'mp-silver' },
    100: { n: 'loonie', t: '$1', r: 26, c: 'mp-gold' }, 200: { n: 'toonie', t: '$2', r: 28, c: 'mp-two' },
    500: { n: '$5 bill', t: '$5', bill: 'mp-b5' }, 1000: { n: '$10 bill', t: '$10', bill: 'mp-b10b' }, 2000: { n: '$20 bill', t: '$20', bill: 'mp-b20' },
    5000: { n: '$50 bill', t: '$50', bill: 'mp-b50' }, 10000: { n: '$100 bill', t: '$100', bill: 'mp-b100' }
  };
  M.CASH = CASH;
  function cents(c) { return c < 100 ? c + '¢' : '$' + (c % 100 ? (c / 100).toFixed(2) : fmt(c / 100)); }
  M.cents = cents;
  function cashHtml(v) {
    var k = CASH[v];
    if (k.bill) return '<span class="mp-bill ' + k.bill + '">' + k.t + '</span>';
    return '<span class="mp-coin ' + k.c + '" style="--d:' + k.r * 2 + 'px">' + k.t + '</span>';
  }
  M.cashHtml = cashHtml;
  M.coins = function (root, o) {
    o = o || {};
    var T = base(root, 'coin'), set = o.set || [5, 10, 25, 100, 200], items = [], counted = 0;
    root.innerHTML = '<div class="mp-tray mp-ctray">' + set.map(function (v) { return '<button type="button" class="mp-cadd" data-v="' + v + '" aria-label="Add a ' + CASH[v].n + '">' + cashHtml(v) + '</button>'; }).join('') + '</div>' +
      '<div class="mp-acts"><button type="button" class="mp-act" data-a="sort">Sort, biggest first</button><button type="button" class="mp-act" data-a="count">Count it</button><button type="button" class="mp-act" data-a="clear">Clear</button></div>' +
      '<div class="mp-purse" role="group" aria-label="Money on the mat"></div><div class="mp-read" aria-live="polite"></div>';
    var purse = qs('.mp-purse', root), read = qs('.mp-read', root);
    function total() { return items.reduce(function (s, v) { return s + v; }, 0); }
    function draw(enterLast) {
      purse.innerHTML = items.map(function (v, i) { return '<button type="button" class="mp-cash' + (enterLast && i === items.length - 1 && !T.fast ? ' mp-enter' : '') + '" data-i="' + i + '" aria-label="' + CASH[v].n + ', tap to take away">' + cashHtml(v) + '<b class="mp-cnt"></b></button>'; }).join('') || '<p class="t2">Tap a coin or bill above to put it here.</p>';
      readout();
    }
    function readout() {
      read.innerHTML = '<p>Total: <span class="mp-num">' + cents(total()) + '</span></p>';
      if (o.onChange) o.onChange({ total: total(), items: items.slice(), n: items.length }, T);
    }
    root.addEventListener('click', function (e) {
      var a = e.target.closest('.mp-cadd'), c = e.target.closest('.mp-cash'), act = e.target.closest('.mp-act');
      if (a) T.add(+a.getAttribute('data-v'));
      else if (c) { items.splice(+c.getAttribute('data-i'), 1); draw(false); }
      else if (act) { var k = act.getAttribute('data-a'); if (k === 'sort') T.sort(); else if (k === 'count') T.countAll(); else { items = []; draw(false); } }
    });
    T.add = function (v) { items.push(v); draw(true); return T.wait(300); };
    T.sort = function () { items.sort(function (a, b) { return b - a; }); draw(false); return T.wait(400); };
    T.countAll = function (gap) {
      var ep = T.ep, i = 0, sum = 0, els = qsa('.mp-cash', purse);
      els.forEach(function (x) { x.classList.remove('lit'); });
      function one() {
        if (!T.alive(ep) || i >= els.length) return Promise.resolve();
        sum += items[i]; els[i].classList.add('lit'); qs('.mp-cnt', els[i]).textContent = cents(sum); i++;
        return T.wait(gap || 450).then(one);
      }
      return one();
    };
    T.state = function () { return { total: total(), items: items.slice(), n: items.length, counted: counted }; };
    T.reset = function () { T.ep++; items = (o.start || []).slice(); draw(false); };
    T.reset();
    return T;
  };

  /* ================= Geoboard =================
     options: size (pegs per side, default 5), onChange. Tap pegs to stretch a band. Tap the first peg again to close the shape.
     Reports sides, perimeter in units (straight sides) and area in squares. */
  M.geoboard = function (root, o) {
    o = o || {};
    var T = base(root, 'geo'), N = o.size || 5, pts = [], closed = false, G = 60, P = 30;
    root.innerHTML = '<div class="mp-acts"><button type="button" class="mp-act" data-a="undo">Undo</button><button type="button" class="mp-act" data-a="clear">Clear</button></div><div class="mp-gbox"></div><div class="mp-read" aria-live="polite"></div>';
    var box = qs('.mp-gbox', root), read = qs('.mp-read', root);
    function area() { var s = 0; for (var i = 0; i < pts.length; i++) { var a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; }
    function state() {
      var straight = true, per = 0;
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i], b = pts[(i + 1) % pts.length];
        if (a[0] !== b[0] && a[1] !== b[1]) straight = false;
        per += Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
      }
      return { closed: closed, sides: closed ? pts.length : 0, points: pts.slice(), area: closed ? area() : 0, perimeter: closed && straight ? per : null };
    }
    function draw() {
      var S = (N - 1) * G + 2 * P, h = '<svg viewBox="0 0 ' + S + ' ' + S + '" class="mp-geo" role="group" aria-label="Geoboard">';
      for (var y = 0; y < N - 1; y++) for (var x = 0; x < N - 1; x++) h += '<rect x="' + (P + x * G) + '" y="' + (P + y * G) + '" width="' + G + '" height="' + G + '" class="mp-gsq"/>';
      if (pts.length) {
        var d = pts.map(function (p) { return (P + p[0] * G) + ',' + (P + p[1] * G); }).join(' ');
        h += closed ? '<polygon points="' + d + '" class="mp-band on"/>' : '<polyline points="' + d + '" class="mp-band"/>';
      }
      for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
        var used = pts.some(function (p) { return p[0] === i && p[1] === j; });
        h += '<circle cx="' + (P + i * G) + '" cy="' + (P + j * G) + '" r="11" class="mp-peg' + (used ? ' on' : '') + '" data-x="' + i + '" data-y="' + j + '" tabindex="0" role="button" aria-label="Peg ' + (i + 1) + ', ' + (j + 1) + '"/>';
      }
      box.innerHTML = h + '</svg>';
      var s = state();
      read.innerHTML = closed ? '<p><b>' + s.sides + ' sides.</b> Area: <span class="mp-num">' + s.area + '</span> ' + (s.area === 1 ? 'square' : 'squares') + (s.perimeter != null ? '. Perimeter: ' + s.perimeter + ' units' : '') + '.</p>' : '<p class="t2">' + (pts.length ? 'Tap the first peg again to close the shape.' : 'Tap pegs to stretch the band.') + '</p>';
      if (o.onChange) o.onChange(s, T);
    }
    function tapPeg(x, y) {
      if (closed) return;
      if (pts.length >= 3 && pts[0][0] === x && pts[0][1] === y) closed = true;
      else if (!pts.some(function (p) { return p[0] === x && p[1] === y; })) pts.push([x, y]);
      draw();
    }
    box.addEventListener('click', function (e) { var c = e.target.closest('.mp-peg'); if (c) tapPeg(+c.getAttribute('data-x'), +c.getAttribute('data-y')); });
    box.addEventListener('keydown', function (e) { var c = e.target.closest('.mp-peg'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); tapPeg(+c.getAttribute('data-x'), +c.getAttribute('data-y')); } });
    qs('.mp-acts', root).addEventListener('click', function (e) {
      var b = e.target.closest('.mp-act'); if (!b) return;
      if (b.getAttribute('data-a') === 'undo') { if (closed) closed = false; else pts.pop(); } else { pts = []; closed = false; }
      draw();
    });
    T.shape = function (list, gap) {
      var ep = T.ep, i = 0;
      pts = []; closed = false; draw();
      function one() {
        if (!T.alive(ep)) return Promise.resolve();
        if (i >= list.length) { closed = true; draw(); return T.wait(400); }
        pts.push(list[i++]); draw();
        return T.wait(gap || 350).then(one);
      }
      return one();
    };
    T.state = state;
    T.reset = function () { T.ep++; pts = []; closed = false; draw(); };
    T.reset();
    return T;
  };

  /* ================= Algebra tiles =================
     options: x2 (offer x squared tiles), start {x2, x, one} (negative numbers make red tiles), onChange.
     Tap the tray to add, tap a tile to take it away, "Remove zero pairs" cancels a positive and a negative tile. */
  M.tiles = function (root, o) {
    o = o || {};
    var T = base(root, 'tile'), kinds = o.x2 ? ['x2', 'x', 'one'] : ['x', 'one'], tiles = [];
    var LAB = { x2: 'x²', x: 'x', one: '1' };
    root.innerHTML = '<div class="mp-tray">' + kinds.map(function (k) {
      return '<div class="mp-tg"><button type="button" class="mp-tadd" data-k="' + k + '" data-s="1" aria-label="Add a positive ' + LAB[k] + ' tile"><i class="mp-tl-' + k + '">+' + LAB[k] + '</i></button>' +
        '<button type="button" class="mp-tadd" data-k="' + k + '" data-s="-1" aria-label="Add a negative ' + LAB[k] + ' tile"><i class="mp-tl-' + k + ' neg">&minus;' + LAB[k] + '</i></button></div>';
    }).join('') + '</div><div class="mp-acts"><button type="button" class="mp-act" data-a="zero">Remove zero pairs</button><button type="button" class="mp-act" data-a="clear">Clear</button></div>' +
      '<div class="mp-tmat"></div><div class="mp-read" aria-live="polite"></div>';
    var mat = qs('.mp-tmat', root), read = qs('.mp-read', root);
    function sum(k) { return tiles.filter(function (t) { return t.k === k; }).reduce(function (s, t) { return s + t.s; }, 0); }
    function expr() {
      var parts = [];
      kinds.forEach(function (k) {
        var c = sum(k);
        if (!c) return;
        var mag = Math.abs(c), body = k === 'one' ? String(mag) : (mag === 1 ? '' : mag) + LAB[k];
        parts.push((c < 0 ? (parts.length ? ' − ' : '−') : (parts.length ? ' + ' : '')) + body);
      });
      return parts.join('') || '0';
    }
    function draw(enterLast) {
      mat.innerHTML = kinds.map(function (k) {
        return '<div class="mp-trow">' + tiles.map(function (t, i) { return t.k === k ? '<button type="button" class="mp-tile mp-tl-' + k + (t.s < 0 ? ' neg' : '') + (t.z ? ' mp-zero' : '') + (enterLast && i === tiles.length - 1 && !T.fast ? ' mp-enter' : '') + '" data-i="' + i + '" aria-label="' + (t.s < 0 ? 'negative ' : 'positive ') + LAB[k] + ' tile">' + (t.s < 0 ? '&minus;' : '+') + LAB[k] + '</button>' : ''; }).join('') + '</div>';
      }).join('');
      read.innerHTML = '<p>The tiles show <span class="mp-num">' + expr() + '</span></p>';
      if (o.onChange) o.onChange(T.state(), T);
    }
    root.addEventListener('click', function (e) {
      var a = e.target.closest('.mp-tadd'), t = e.target.closest('.mp-tile'), act = e.target.closest('.mp-act');
      if (a) T.add(a.getAttribute('data-k'), +a.getAttribute('data-s'));
      else if (t) { tiles.splice(+t.getAttribute('data-i'), 1); draw(false); }
      else if (act) { if (act.getAttribute('data-a') === 'zero') T.zeroPairs(); else { tiles = []; draw(false); } }
    });
    T.add = function (k, s) { tiles.push({ k: k, s: s }); draw(true); return T.wait(250); };
    T.zeroPairs = function () {
      var ep = T.ep;
      kinds.forEach(function (k) {
        var pos = tiles.filter(function (t) { return t.k === k && t.s > 0; }), neg = tiles.filter(function (t) { return t.k === k && t.s < 0; });
        for (var i = 0; i < Math.min(pos.length, neg.length); i++) pos[i].z = neg[i].z = true;
      });
      draw(false);
      return T.wait(T.fast ? 0 : 750).then(function () { if (!T.alive(ep)) return; tiles = tiles.filter(function (t) { return !t.z; }); draw(false); });
    };
    T.state = function () { var s = { expr: expr(), n: tiles.length }; kinds.forEach(function (k) { s[k] = sum(k); }); return s; };
    T.reset = function () {
      T.ep++; tiles = [];
      var st = o.start || {};
      kinds.forEach(function (k) { var c = st[k] || 0; for (var i = 0; i < Math.abs(c); i++) tiles.push({ k: k, s: c < 0 ? -1 : 1 }); });
      draw(false);
    };
    T.reset();
    return T;
  };

  /* ================= "Watch" player =================
     A short animated demonstration, like a video clip, built from a tool's own moves.
     steps: [{say: caption, act: function (tool) { return promise }, ms: pause after}]
     Plays once when it scrolls into view. Pause, replay, and step dots to jump to any part. */
  M.player = function (root, tool, steps, o) {
    o = o || {};
    var k = 0, playing = false, run = 0, started = false;
    root.classList.add('mp-player');
    root.innerHTML = '<div class="mp-stage"></div><p class="mp-cap" aria-live="polite"></p>' +
      '<div class="mp-pctl"><button type="button" class="mp-pb mp-play" aria-label="Play">Play</button>' +
      '<button type="button" class="mp-pb mp-again">Replay</button>' +
      '<span class="mp-dots">' + steps.map(function (s, i) { return '<button type="button" class="mp-sd" data-i="' + i + '" aria-label="Part ' + (i + 1) + ' of ' + steps.length + '"></button>'; }).join('') + '</span></div>';
    var stage = qs('.mp-stage', root), cap = qs('.mp-cap', root), playB = qs('.mp-play', root);
    stage.appendChild(tool.root);
    function caption(i) {
      cap.innerHTML = steps[i] ? steps[i].say : '';
      if (steps[i] && !tool.fast) bump(cap, 'mp-fade');
      qsa('.mp-sd', root).forEach(function (d, j) { d.classList.toggle('on', j < i || (j === i && playing)); d.classList.toggle('cur', j === i); });
    }
    function ui() {
      playB.textContent = playing ? 'Pause' : k >= steps.length ? 'Play again' : started ? 'Play' : 'Play';
      playB.setAttribute('aria-label', playB.textContent);
      root.classList.toggle('playing', playing);
    }
    function go() {
      if (k >= steps.length) { return restart(); }
      playing = true; started = true; ui();
      var my = ++run;
      function next() {
        if (my !== run || !playing) return;
        if (k >= steps.length) { playing = false; ui(); caption(steps.length - 1); qsa('.mp-sd', root).forEach(function (d) { d.classList.add('on'); }); if (o.onEnd) o.onEnd(); return; }
        var s = steps[k];
        caption(k);
        Promise.resolve(s.act ? s.act(tool) : null).then(function () {
          return new Promise(function (r) { setTimeout(r, s.ms == null ? 1100 : s.ms); });
        }).then(function () { if (my !== run) return; k++; next(); });
      }
      next();
    }
    function pause() { playing = false; run++; ui(); }
    /* jump: rebuild the picture instantly up to part j, then play from there */
    function jump(j, play) {
      pause();
      tool.fast = true;
      tool.reset();
      var p = Promise.resolve();
      steps.slice(0, j).forEach(function (s) { p = p.then(function () { return s.act ? s.act(tool) : null; }); });
      return p.then(function () { tool.fast = false; k = j; caption(j); if (play) go(); else ui(); });
    }
    function restart() { return jump(0, true); }
    playB.addEventListener('click', function () { if (playing) pause(); else go(); });
    qs('.mp-again', root).addEventListener('click', restart);
    qs('.mp-dots', root).addEventListener('click', function (e) { var d = e.target.closest('.mp-sd'); if (d) jump(+d.getAttribute('data-i'), true); });
    caption(0); ui();
    /* start by itself the first time it is on screen */
    if (o.autoplay !== false && window.IntersectionObserver) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && !started) { io.disconnect(); setTimeout(function () { if (!started && document.body.contains(root)) go(); }, 500); } });
      }, { threshold: 0.5 });
      io.observe(root);
    }
    return { play: go, pause: pause, jump: jump, restart: restart, tool: tool, get playing() { return playing; }, get step() { return k; } };
  };

  /* make a tool by name: Manip.make('base10', element, options) */
  M.make = function (name, root, opts) {
    if (!M[name] || typeof M[name] !== 'function') throw new Error('Unknown manipulative: ' + name);
    return M[name](root, opts || {});
  };
  M.list = ['base10', 'counters', 'tenframe', 'hundred', 'numberline', 'fractions', 'coins', 'geoboard', 'tiles'];
})();
