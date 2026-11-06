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
     options: h, t, o (start counts); cols ['h','t','o'] or ['t','o'] (the Toolbox adds 'k', thousands); controls (tray of buttons);
     readout (place value chart); words(n) (number words); expanded (show 100 + 40 + 7); tap (light up on tap, default true);
     max {h,t,o}; hideTotal; u / uMax (block size); onChange(state, tool).
     drag: the Toolbox version. The mat keeps one size and the blocks get smaller as more are added. A tray of blocks to drag (or tap) onto the mat; drag a block off the mat to put it back,
     drag a ten into Ones to break it, drag a one into Tens to snap 10 ones into a ten; tap a square inside a ten or hundred
     to number it 1, 2, 3, or a layer of a thousand cube to count 100, 200, 300 (when "Tap to count" is on Small squares). Adds undo() and showNumbers(on).
     Moves: add(kind, n), remove(kind, n), set(h,t,o), group('o'|'t'), split('t'|'h', piece), countAll(), lightKind(kind), clearLit(). */
  var VAL = { k: 1000, h: 100, t: 10, o: 1 }, NAME = { k: 'thousand cube', h: 'hundred flat', t: 'ten rod', o: 'one cube' }, NAMES = { k: 'thousand cubes', h: 'hundred flats', t: 'ten rods', o: 'one cubes' };
  var PLACE = { k: 'Thousands', h: 'Hundreds', t: 'Tens', o: 'Ones' }, ONE = { k: 'Thousand', h: 'Hundred', t: 'Ten', o: 'One' };
  var KINDS = ['k', 'h', 't', 'o'], UP = { o: 't', t: 'h', h: 'k' }, DOWN = { k: 'h', h: 't', t: 'o' };
  /* Toolbox mat: how wide each column is, in block units (a thousand cube needs room for its depth) */
  var WIDE = { k: 16.5, h: 11.2, t: 10, o: 8 };
  M.base10 = function (root, o) {
    o = o || {};
    var T = base(root, 'b10'), cols = o.cols || ['h', 't', 'o'], pieces = [], litOrder = [], last = '', hist = [], dragEnd = 0, countMode = 'block';
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
    var readHtml = '<div class="mp-read" aria-live="polite"></div>';
    var matHtml = '<div class="mp-mat" style="--n:' + cols.length + '">' + cols.map(function (k) { return '<div class="mp-col mp-c' + k + '" data-k="' + k + '"><span>' + PLACE[k] + '</span></div>'; }).join('') +
      '<div class="mp-layer"></div>' + (o.drag ? '<p class="mp-empty">Drag blocks here</p><div class="mp-snaps"></div><p class="mp-say" aria-live="polite"></p>' : '') + '</div>' +
      (o.drag ? '' : readHtml) + '<p class="mp-live sr" aria-live="polite"></p>';
    if (o.drag) {
      root.classList.add('mp-tool', 'mp-b10d');
      root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray" role="group" aria-label="Blocks to drag onto the mat">' + cols.map(function (k) {
        return '<button type="button" class="mp-tp" data-k="' + k + '" aria-label="Add a ' + NAME[k] + '"><span class="mp-pc mp-' + k + '"><i class="mp-blk"></i></span><small>' + ONE[k] + '</small></button>';
      }).join('') + '</div><div class="mp-dmain"><div class="mp-cmode" role="group" aria-label="What a tap counts"><span>Tap to count</span>' +
        '<button type="button" data-m="block" aria-pressed="true">Whole blocks</button><button type="button" data-m="unit" aria-pressed="false">Small squares</button></div>' +
        /* in the Toolbox the number sits above the mat, where it is easy to see; the mat shrinks to make room */
        readHtml + matHtml + '</div></div>';
    } else root.innerHTML = tray + matHtml;
    var mat = qs('.mp-mat', root), layer = qs('.mp-layer', root), read = qs('.mp-read', root);
    if (o.drag) mat.style.gridTemplateColumns = cols.map(function (k) { return WIDE[k] + 'fr'; }).join(' ');

    function counts() {
      var c = { k: 0, h: 0, t: 0, o: 0 };
      pieces.forEach(function (p) { c[p.k]++; });
      return c;
    }
    function value() { var c = counts(); return c.k * 1000 + c.h * 100 + c.t * 10 + c.o; }
    /* Toolbox: where the i-th of n blocks of a kind sits inside its column (width W), at block size u */
    function dslot(k, i, n, u, W) {
      /* piled hundreds and thousands leave a strip of each block behind showing, wide enough to tap */
      if (k === 'k') return { x: 0, y: 5 * u + i * 2 * u, w: 10 * u, h: 10 * u };
      if (k === 'h') return { x: 0, y: 0.2 * u + i * 1.8 * u, w: 10 * u, h: 10 * u };
      if (k === 't') {
        var per = Math.max(1, Math.floor((W - 0.2 * u + 0.5 * u) / (1.5 * u)));
        return { x: (i % per) * 1.5 * u, y: 0.2 * u + Math.floor(i / per) * 10.8 * u, w: u, h: 10 * u };
      }
      var gpr = Math.max(1, Math.floor((W + 0.9 * u) / (6.9 * u))), g = Math.floor(i / 10), j = i % 10;
      return { x: (g % gpr) * 6.9 * u + (j % 5) * 1.2 * u, y: 0.2 * u + Math.floor(g / gpr) * 3.3 * u + Math.floor(j / 5) * 1.2 * u, w: u, h: u };
    }
    /* Toolbox: the mat keeps its size; the biggest block size at which every column's blocks fit */
    function dgeom() {
      var W = mat.clientWidth || 600, H = mat.clientHeight || 400, c = counts(), tot = 0, x = {}, cw = {}, at = 0, top = 64;
      cols.forEach(function (k) { tot += WIDE[k]; });
      cols.forEach(function (k) { cw[k] = W * WIDE[k] / tot; x[k] = at; at += cw[k]; });
      /* the bottom strip stays clear for the snap buttons; when they wrap to more rows, the blocks shrink to make room */
      var pad = clamp(W / tot * 0.4, 4, 12), u = o.uMax || 34, foot = Math.max(72, snapH + 28);
      var need = { k: 15.4, h: 10.4, t: 1.4, o: 6.2 };
      function fits(u) {
        return cols.every(function (k) {
          if (need[k] * u > cw[k] - 2 * pad) return false;
          if (!c[k]) return true;
          var r = dslot(k, c[k] - 1, c[k], u, cw[k] - 2 * pad);
          return r.y + r.h + 0.2 * u <= H - top - foot;
        });
      }
      while (u > 3 && !fits(u)) u -= 0.5;
      return { u: u, x: x, cw: cw, pad: pad, top: top };
    }
    function geom() {
      if (o.drag) return dgeom();
      var W = mat.clientWidth || 600, cw = W / cols.length, pad = clamp(cw * 0.07, 6, 16), inner = cw - 2 * pad;
      /* without a hundreds column the blocks can be bigger, which makes them easier to tap */
      var big = cols.indexOf('h') < 0;
      return { cw: cw, pad: pad, inner: inner, u: clamp(Math.min(o.u || (big ? 22 : 16), inner / (big ? 7.4 : 10.4)), 5, o.uMax || 22), top: o.drag ? 64 : 44 };
    }
    /* where the i-th piece of a kind sits, given how many of that kind there are */
    function slot(k, i, n, g) {
      if (o.drag) {
        var d = dslot(k, i, n, g.u, g.cw[k] - 2 * g.pad);
        return { x: g.x[k] + g.pad + d.x, y: g.top + d.y, w: d.w, h: d.h };
      }
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
      var g = geom(), c = counts(), idx = { k: 0, h: 0, t: 0, o: 0 }, bottom = g.top + 10.4 * g.u;
      mat.style.setProperty('--u', g.u + 'px');
      pieces.forEach(function (p) {
        var r = slot(p.k, idx[p.k]++, c[p.k], g);
        put(p, r);
        bottom = Math.max(bottom, r.y + r.h);
      });
      if (!o.drag) mat.style.height = Math.ceil(bottom + g.pad + 4) + 'px';
    }
    function make(k, enter) {
      var p = { k: k, lit: false, el: button('mp-pc mp-' + k, '<i class="mp-blk"></i><b class="mp-cnt"></b>', NAME[k] + ', worth ' + VAL[k]) };
      p.el.setAttribute('aria-pressed', 'false');
      if (o.tap === false) p.el.tabIndex = -1;
      p.el.addEventListener('click', function (e) {
        if (o.tap === false || Date.now() - dragEnd < 400) return;
        if (o.drag && k !== 'o' && countMode === 'unit' && e.detail) unit(p, e); else toggle(p);
      });
      if (o.drag) p.el.addEventListener('pointerdown', function (e) { drag(e, k, p); });
      if (enter && !T.fast) p.el.classList.add('mp-enter');
      layer.appendChild(p.el);
      return p;
    }
    /* keep pieces sorted hundreds, tens, ones so new ones land at the end of their column */
    function insert(p) {
      var order = { k: 0, h: 1, t: 2, o: 3 }, at = pieces.length;
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
      /* lessons show the running count (10, 20, 21); the Toolbox shows each block's own value (100, 10, 1) */
      litOrder.forEach(function (p) { sum += VAL[p.k]; qs('.mp-cnt', p.el).textContent = fmt(o.drag ? VAL[p.k] : sum); });
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
      return { k: c.k, h: c.h, t: c.t, o: c.o, value: value(), lit: litOrder.length, litValue: lt, allLit: pieces.length > 0 && litOrder.length === pieces.length, last: last, pieces: pieces.length };
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
        if (o.expanded && v) h += ' <span class="mp-exp">= ' + KINDS.filter(function (k) { return c[k]; }).map(function (k) { return '<b class="mp-c' + k + 't">' + fmt(c[k] * VAL[k]) + '</b>'; }).join(' + ') + '</span>';
        if (o.words && v <= 999) h += ' <span class="mp-words">' + o.words(v) + '</span>';
        h += '</p>';
      }
      if (litOrder.length && litOrder.length < pieces.length && !(o.drag && o.hideTotal)) h += '<p class="mp-litline">Counted so far: <b>' + fmt(state().litValue) + '</b></p>';
      var before = read.getAttribute('data-v');
      read.innerHTML = h;
      if (before !== String(v)) { var n = qs('.mp-num', read); if (n && before !== null && !T.fast) bump(n); }
      read.setAttribute('data-v', String(v));
    }
    function sync() {
      if (o.drag) snaps();
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
      var up = UP[k], list = pieces.filter(function (p) { return p.k === k; });
      if (list.length < 10 || cols.indexOf(up) < 0) return Promise.resolve(false);
      var ep = T.ep, ten = list.slice(-10), g = geom(), c = counts(), u = g.u;
      var target = slot(up, c[up], c[up] + 1, g);
      ten.forEach(function (p, i) {
        unlit(p);
        p.el.classList.add('mp-merge');
        put(p, up === 't' ? { x: target.x, y: target.y + i * u, w: u, h: u } : up === 'h' ? { x: target.x + i * u, y: target.y, w: u, h: 10 * u } : { x: target.x, y: target.y + i * 0.3 * u, w: 10 * u, h: 10 * u });
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
    T.split = function (k, piece) {
      var down = DOWN[k], list = pieces.filter(function (p) { return p.k === k; });
      if (!list.length || cols.indexOf(down) < 0) return Promise.resolve(false);
      var ep = T.ep, p = piece || list[list.length - 1], r = p.r, u = geom().u, made = [];
      for (var i = 0; i < 10; i++) {
        var np = make(down, false);
        np.el.classList.add('mp-merge');
        put(np, down === 'o' ? { x: r.x, y: r.y + i * u, w: u, h: u } : down === 't' ? { x: r.x + i * u, y: r.y, w: u, h: 10 * u } : { x: r.x, y: r.y + i * 0.3 * u, w: 10 * u, h: 10 * u });
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
    /* put exactly these blocks on the mat at once, with no animation */
    function rebuild(c) {
      T.ep++;
      pieces.slice().forEach(function (p) { p.el.remove(); });
      pieces = []; litOrder = [];
      var f = T.fast; T.fast = true;
      KINDS.forEach(function (k) { if (cols.indexOf(k) >= 0) for (var i = 0; i < (c[k] || 0); i++) insert(make(k, false)); });
      T.fast = f;
      layout(); change();
    }
    T.reset = function () { hist = []; last = ''; rebuild(o); };

    /* ---- the Toolbox version (o.drag): drag, snap, undo, and a number that stays hidden until asked for ---- */
    function act(fn) { hist.push(counts()); if (hist.length > 60) hist.shift(); fn(); }
    T.undo = function () { if (!hist.length) return; last = 'undo'; rebuild(hist.pop()); };
    T.canUndo = function () { return hist.length > 0; };
    T.showNumbers = function (on) { o.readout = !!on; o.hideTotal = !on; change(); };
    function canAdd(k) { return counts()[k] < max[k] && value() + VAL[k] <= (o.limit || 999); }
    var sayTimer;
    function say(text) {
      var s = qs('.mp-say', root);
      s.textContent = text; s.classList.add('on');
      announce(T, text);
      clearTimeout(sayTimer);
      sayTimer = setTimeout(function () { s.classList.remove('on'); }, 2600);
    }
    /* Toolbox: tap a small square inside a ten or a hundred to light it and number it 1, 2, 3... (that block's own count) */
    function unit(p, e) {
      var blk = qs('.mp-blk', p.el), r = blk.getBoundingClientRect(), w = k10(p).w;
      var col = clamp(Math.floor((e.clientX - r.left) / (r.width / w)), 0, w - 1), row = clamp(Math.floor((e.clientY - r.top) / (r.height / 10)), 0, 9);
      var id = row * 10 + col, marks = p.marks = p.marks || [], at = marks.indexOf(id);
      if (at >= 0) marks.splice(at, 1); else marks.push(id);
      qsa('.mp-u', blk).forEach(function (m) { m.remove(); });
      /* placed in tenths of the block, inside it, so the squares stay lined up when the block grows as it lights up */
      marks.forEach(function (m, i) {
        var s = el('span', 'mp-u', String((i + 1) * k10(p).each));
        s.style.cssText = 'left:' + (m % 10) * 100 / w + '%;top:' + Math.floor(m / 10) * 10 + '%;width:' + 100 / w + '%;height:10%;font-size:' + Math.max(8, geom().u * 0.42) + 'px';
        blk.appendChild(s);
      });
      announce(T, marks.length ? 'Counted ' + marks.length * k10(p).each + ' of ' + VAL[p.k] : 'Nothing counted');
    }
    /* what one tap marks: a square of a hundred, a square of a ten, or a whole layer (a hundred) of a thousand cube */
    function k10(p) { return p.k === 'h' ? { w: 10, each: 1 } : p.k === 'k' ? { w: 1, each: 100 } : { w: 1, each: 1 }; }
    var snapH = 0;
    function snaps() {
      var c = counts(), b = [];
      if (c.o >= 10 && cols.indexOf('t') >= 0) b.push(['go', 'Snap<i> 10 ones into</i> a ten', 1]);
      if (c.t >= 10 && cols.indexOf('h') >= 0) b.push(['gt', 'Snap<i> 10 tens into</i> a hundred', 1]);
      if (c.h >= 10 && cols.indexOf('k') >= 0) b.push(['gh', 'Snap<i> 10 hundreds into</i> a thousand', 1]);
      if (c.t && cols.indexOf('o') >= 0 && c.o + 10 <= max.o) b.push(['st', 'Break a ten', 0]);
      if (c.h && cols.indexOf('t') >= 0 && c.t + 10 <= max.t) b.push(['sh', 'Break a hundred', 0]);
      if (c.k && cols.indexOf('h') >= 0 && c.h + 10 <= max.h) b.push(['sk', 'Break a thousand', 0]);
      qs('.mp-snaps', root).innerHTML = b.map(function (x) { return '<button type="button" class="mp-snap' + (x[2] ? ' go' : '') + '" data-a="' + x[0] + '">' + x[1] + '</button>'; }).join('');
      mat.classList.toggle('is-empty', !pieces.length);
      var h = qs('.mp-snaps', root).offsetHeight;
      if (h !== snapH) { snapH = h; layout(); }
    }
    function colAt(x, y) {
      var hit = null;
      qsa('.mp-col', mat).forEach(function (c) { var r = c.getBoundingClientRect(); if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) hit = c.getAttribute('data-k'); });
      return hit;
    }
    function over(k) { qsa('.mp-col', mat).forEach(function (c) { c.classList.toggle('mp-over', c.getAttribute('data-k') === k); }); }
    /* a block dropped from the tray (piece is null) or from the mat, on column col (null: off the mat) */
    function dropped(k, piece, col) {
      var i = cols.indexOf(k), j = cols.indexOf(col);
      if (!piece) {
        if (!col) return;
        if (canAdd(k)) act(function () { T.add(k, 1); }); else say('The mat is full. Take some blocks away first.');
      } else if (!col) act(function () { drop(piece); last = 'remove'; relabel(); layout(); change(); });
      else if (j === i + 1) {
        if (counts()[cols[j]] + 10 <= max[cols[j]]) act(function () { T.split(k, piece); });
        else say('No room for 10 more. Take some away first.');
      } else if (j === i - 1) {
        if (counts()[k] >= 10) act(function () { T.group(k); });
        else say(k === 'o' ? 'You need 10 ones to make a ten.' : 'You need 10 tens to make a hundred.');
      }
    }
    function drag(e, k, piece) {
      if (e.button > 0) return;
      var sx = e.clientX, sy = e.clientY, ghost = null, ox = 0, oy = 0;
      function move(ev) {
        if (ev.pointerId !== e.pointerId) return;
        if (!ghost) {
          if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 8) return;
          var u = geom().u, w = (k === 'h' || k === 'k' ? 10 : 1) * u, h = (k === 'o' ? 1 : 10) * u;
          if (piece) { var r = piece.el.getBoundingClientRect(); ox = sx - r.left; oy = sy - r.top; unlit(piece); relabel(); piece.el.classList.add('mp-lift'); }
          else { ox = w / 2; oy = Math.min(h / 2, 24); }
          ghost = el('span', 'mp-pc mp-' + k + ' mp-ghost', '<i class="mp-blk"></i>');
          ghost.style.cssText = 'width:' + w + 'px;height:' + h + 'px;--u:' + u + 'px';
          document.body.appendChild(ghost);
        }
        ev.preventDefault();
        ghost.style.transform = 'translate(' + (ev.clientX - ox) + 'px,' + (ev.clientY - oy) + 'px)';
        over(colAt(ev.clientX, ev.clientY));
      }
      function up(ev) {
        if (ev.pointerId !== e.pointerId) return;
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        document.removeEventListener('pointercancel', up);
        if (!ghost) return;
        dragEnd = Date.now();
        ghost.remove(); over(null);
        if (piece) piece.el.classList.remove('mp-lift');
        if (ev.type === 'pointerup') dropped(k, piece, colAt(ev.clientX, ev.clientY));
      }
      document.addEventListener('pointermove', move, { passive: false });
      document.addEventListener('pointerup', up);
      document.addEventListener('pointercancel', up);
    }
    if (o.drag) {
      qsa('.mp-tp', root).forEach(function (b) { b.addEventListener('pointerdown', function (e) { drag(e, b.getAttribute('data-k'), null); }); });
      root.addEventListener('click', function (e) {
        var m = e.target.closest('.mp-cmode button');
        if (m) {
          countMode = m.getAttribute('data-m');
          qsa('.mp-cmode button', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === m)); });
          return;
        }
        var b = e.target.closest('.mp-tp, .mp-snap');
        if (!b || !root.contains(b) || Date.now() - dragEnd < 400) return;
        var k = b.getAttribute('data-k'), a = b.getAttribute('data-a');
        if (k) { if (canAdd(k)) act(function () { T.add(k, 1); }); else say('The mat is full. Take some blocks away first.'); }
        else act(function () { if (a === 'go') T.group('o'); else if (a === 'gt') T.group('t'); else if (a === 'gh') T.group('h'); else if (a === 'st') T.split('t'); else if (a === 'sh') T.split('h'); else T.split('k'); });
      });
    }

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
    /* the Toolbox mat follows the screen's height too (turning an iPad) */
    if (o.drag && window.ResizeObserver) { var mh = 0; new ResizeObserver(function () { if (mat.clientHeight !== mh) { mh = mat.clientHeight; layout(); } }).observe(mat); }
    return T;
  };

  /* ================= Counters (dots you can tap, pair up, and group) =================
     options: n, max, arrange ('scatter' | 'tens' | 'pairs' | 'row'), seed, controls (+/- and arrange buttons), tap (count by tapping), onChange.
     Moves: arrange(name), setN(n), countAll(), clearLit(). */
  M.counters = function (root, o) {
    o = o || {};
    if (o.tool) return toolCounters(root, o);
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
    if (o.tool) return toolChart(root, o);
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

  /* ================= Counters and ten-frames, Toolbox version =================
     Manip.counters(root, { tool: true }). Red and yellow counters are tapped or dragged from the tray onto the mat.
     The mat is free, or holds 1 or 2 ten-frames (a counter dropped on a frame snaps into a box; counters can also sit
     beside the frames). Tap a counter to turn it over (red to yellow). Drag a counter off the mat to put it back.
     "Pair up", "Rows of ten" and "Share into" (2 to 10 groups) line the counters up on the free mat.
     Numbers show only with Show number. Up to 100 counters (20 fit on two frames). Adds undo() and showNumbers(on). */
  var CT_MAX = 100, CT_NAME = { a: 'red', b: 'yellow' };
  function toolCounters(root, o) {
    var T = base(root, 'ctt');
    root.classList.add('mp-tool', 'mp-ctt');
    root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray mp-cttray"><small>Counters</small>' +
      ['a', 'b'].map(function (c) { return '<button type="button" class="mp-cpile" data-c="' + c + '" aria-label="Add a ' + CT_NAME[c] + ' counter"><i class="mp-ctr ' + c + '"></i><i class="mp-ctr ' + c + '"></i></button>'; }).join('') +
      '<small>Sort them</small><div class="mp-csort" role="group" aria-label="Sort the counters"><button type="button" data-s="pairs" aria-pressed="false">Pair up</button><button type="button" data-s="tens" aria-pressed="false">Rows of ten</button><button type="button" data-s="share" aria-pressed="false">Share into&hellip;</button></div></div>' +
      '<div class="mp-dmain"><div class="mp-cmode" role="group" aria-label="Mat"><span>Mat</span>' +
      '<button type="button" data-f="free" aria-pressed="true">Free mat</button><button type="button" data-f="one" aria-pressed="false">1 ten-frame</button><button type="button" data-f="two" aria-pressed="false">2 ten-frames</button></div>' +
      '<div class="mp-read" aria-live="polite"></div><div class="mp-mat mp-cmat"><div class="mp-clayer"></div><p class="mp-empty">Tap or drag a counter from the tray.</p><div class="mp-snaps"></div><p class="mp-say" aria-live="polite"></p></div><p class="mp-live sr" aria-live="polite"></p></div></div>';
    var mat = qs('.mp-mat', root), layer = qs('.mp-clayer', mat), read = qs('.mp-read', root), sayEl = qs('.mp-say', root);
    /* state: counters {c: 'a' or 'b', cell (box number, or -1), x, y (centre, as a share of the mat)}, the mat, the sort and its groups */
    var ctrs = [], kind = 'free', sort = '', k = 3, picking = false, shown = false, hist = [], last = '', G = null, P = [], drag = null, sayT = 0, seed = 5;
    function nF() { return kind === 'one' ? 1 : kind === 'two' ? 2 : 0; }
    function geom() {
      var r = mat.getBoundingClientRect(), W = r.width || 700, H = r.height || 420, F = nF(), g = { W: W, H: H, F: F, boxes: [] }, room = H - 76;
      g.D = clamp(Math.min(W, H) / 8.5, 34, 56);
      if (F) {
        var side = F === 1 || W >= 560, gap = 22, cs;
        if (F === 1) cs = Math.min((W - 40) / 5, (room - 20) / 2, 84);
        else if (side) cs = Math.min((W - 64 - gap) / 10, (room - 20) / 2, 80);
        else cs = Math.min((W - 40) / 5, (room - 20 - gap) / 4, 80);
        cs = Math.floor(cs);
        var fw = cs * 5, fh = cs * 2, tw = side ? F * fw + (F - 1) * gap : fw, th = side ? fh : F * fh + (F - 1) * gap;
        var extra = ctrs.some(function (c) { return c.cell < 0; }) ? cs : 0, x0 = (W - tw) / 2, y0 = Math.max(14, (room - th) / 2 - extra / 2);
        for (var f = 0; f < F; f++) g.boxes.push({ x: x0 + (side ? f * (fw + gap) : 0), y: y0 + (side ? 0 : f * (fh + gap)), w: fw, h: fh });
        g.cs = cs; g.D = Math.round(cs * 0.72); g.fbottom = y0 + th;
      }
      return g;
    }
    function cellXY(i) { var b = G.boxes[Math.floor(i / 10)], j = i % 10; return { x: b.x + (j % 5 + 0.5) * G.cs, y: b.y + (Math.floor(j / 5) + 0.5) * G.cs }; }
    /* sorted layouts on the free mat: the biggest counters that still fit */
    function fit(build) {
      for (var D = clamp(Math.min(G.W, G.H) / 8.5, 34, 56); D >= 14; D -= 2) { var L = build(D); if (L.w <= G.W - 24 && L.h <= G.H - 92) return center(L, D); }
      return center(build(14), 14);
    }
    function center(L, D) {
      var dx = (G.W - L.w) / 2, dy = Math.max(12, (G.H - 76 - L.h) / 2);
      L.pos.forEach(function (p) { p.x += dx; p.y += dy; });
      (L.deco || []).forEach(function (d) { d.x += dx; d.y += dy; });
      L.D = D; return L;
    }
    function layout() {
      var n = ctrs.length;
      if (sort === 'pairs') return fit(function (D) {
        var g = D * 1.18, per = Math.max(1, Math.floor((G.W - 24) / (g * 1.25))), cols = Math.ceil(n / 2), bands = Math.ceil(cols / per) || 1, bh = 2 * g + D * 0.5, pos = [], deco = [];
        for (var i = 0; i < n; i++) { var c = Math.floor(i / 2), b = Math.floor(c / per); pos.push({ x: (c % per) * g * 1.25 + D / 2, y: b * bh + (i % 2) * g + D / 2 }); }
        if (n % 2) { var p = pos[n - 1]; deco.push({ t: 'odd', x: p.x - D * 0.75, y: p.y - D * 0.75, w: D * 1.5, h: D * 1.5 }); }
        return { pos: pos, deco: deco, w: (Math.min(per, cols) - 1) * g * 1.25 + D, h: (bands - 1) * bh + g + D };
      });
      if (sort === 'tens') return fit(function (D) {
        var g = D * (G.W < 520 ? 1.08 : 1.15), pos = [], deco = [], rows = Math.ceil(n / 10) || 1;
        for (var i = 0; i < n; i++) { var c = i % 10; pos.push({ x: c * g + (c >= 5 ? g * 0.4 : 0) + D / 2, y: Math.floor(i / 10) * g + D / 2 }); }
        if (shown) for (var r = 0; r < rows; r++) deco.push({ t: 'lab', x: 10.4 * g + D * 0.2, y: r * g + D / 2, s: fmt(Math.min(n, r * 10 + 10)) });
        return { pos: pos, deco: deco, w: 10.4 * g + (shown ? D * 1.6 : D - g), h: (rows - 1) * g + D };
      });
      if (sort === 'share') return fit(function (D) {
        var q = Math.floor(n / k), left = n - q * k, g = D * 1.15, gc = Math.max(1, Math.min(q, q > 6 ? Math.ceil(Math.sqrt(q)) : 2)), gr = Math.max(1, Math.ceil(q / gc));
        var rw = gc * g + D * 0.5 + 8, rh = gr * g + D * 0.5 + 8 + (shown ? 22 : 0), gap = D * 0.45, per = Math.max(1, Math.floor((G.W - 24 + gap) / (rw + gap))), pos = [], deco = [], i = 0;
        for (var j = 0; j < k; j++) {
          var ox = (j % per) * (rw + gap), oy = Math.floor(j / per) * (rh + gap);
          deco.push({ t: 'ring', x: ox, y: oy, w: rw, h: rh, s: shown ? fmt(q) : '' });
          for (var m = 0; m < q; m++, i++) pos.push({ x: ox + 4 + D * 0.25 + (m % gc) * g + D / 2, y: oy + 4 + D * 0.25 + Math.floor(m / gc) * g + D / 2 });
        }
        var top = Math.ceil(k / per) * (rh + gap) + (left ? D * 0.2 : 0), lw = left * g;
        for (var e = 0; e < left; e++, i++) pos.push({ x: e * g + D / 2, y: top + D / 2, left: true });
        var w = Math.min(k, per) * (rw + gap) - gap;
        pos.forEach(function (p) { if (p.left) p.x += (w - lw) / 2; });
        if (left) deco.push({ t: 'left', x: w / 2, y: top + D + 8, s: shown ? left + ' left over' : 'left over' });
        return { pos: pos, deco: deco, w: Math.max(w, lw), h: top + (left ? D + 30 : -gap) };
      });
      return null;
    }
    function draw() {
      G = geom();
      var L = layout(), h = '';
      G.boxes.forEach(function (b, f) {
        h += '<div class="mp-cframe" style="left:' + b.x + 'px;top:' + b.y + 'px;width:' + b.w + 'px;height:' + b.h + 'px;--cs:' + G.cs + 'px" aria-hidden="true">';
        for (var i = 0; i < 10; i++) h += '<i></i>';
        h += '</div>';
      });
      if (L) L.deco.forEach(function (d) {
        if (d.t === 'odd' || d.t === 'ring') h += '<span class="mp-c' + d.t + '" style="left:' + d.x + 'px;top:' + d.y + 'px;width:' + d.w + 'px;height:' + d.h + 'px">' + (d.s ? '<b>' + d.s + '</b>' : '') + '</span>';
        else h += '<span class="mp-c' + d.t + '" style="left:' + d.x + 'px;top:' + d.y + 'px">' + d.s + '</span>';
      });
      P = ctrs.map(function (c, i) {
        if (L) return { x: L.pos[i].x, y: L.pos[i].y, D: L.D };
        if (c.cell >= 0 && G.F) { var q = cellXY(c.cell); return { x: q.x, y: q.y, D: G.D }; }
        return { x: c.x * G.W, y: c.y * G.H, D: G.D };
      });
      ctrs.forEach(function (c, i) {
        var p = P[i];
        h += '<button type="button" class="mp-ctr ' + c.c + '" data-i="' + i + '" aria-label="' + CT_NAME[c.c] + ' counter. Tap to turn it over." style="width:' + p.D + 'px;height:' + p.D + 'px;transform:translate(' + (p.x - p.D / 2) + 'px,' + (p.y - p.D / 2) + 'px)"></button>';
      });
      layer.innerHTML = h;
      mat.classList.toggle('is-empty', !ctrs.length);
      readout(); snaps(); sync();
    }
    function counts() {
      var a = ctrs.filter(function (c) { return c.c === 'a'; }).length;
      return { n: ctrs.length, a: a, b: ctrs.length - a, framed: G && G.F ? ctrs.filter(function (c) { return c.cell >= 0; }).length : 0 };
    }
    function readout() {
      var s = counts(), n = s.n, h = '', eq = '';
      if (!shown || !n) { read.innerHTML = ''; return; }
      h += '<p class="mp-total"><span class="mp-num">' + fmt(n) + '</span></p>';
      var both = s.a && s.b ? '<b class="mp-ka">' + s.a + '</b> + <b class="mp-kb">' + s.b + '</b> = <b>' + fmt(n) + '</b>' : '';
      if (sort === 'pairs') eq = pl(Math.floor(n / 2), 'pair', 'pairs') + (n % 2 ? ' and <b>1 left over</b>: ' + fmt(n) + ' is <b>odd</b>' : ', none left over: ' + fmt(n) + ' is <b>even</b>');
      else if (sort === 'tens') eq = '<b>' + pl(Math.floor(n / 10), 'ten', 'tens') + '</b> and <b>' + pl(n % 10, 'one', 'ones') + '</b> make <b>' + fmt(n) + '</b>';
      else if (sort === 'share') { var q = Math.floor(n / k), lf = n - q * k; eq = 'shared into <b>' + k + '</b> groups: <b>' + q + '</b> in each' + (lf ? ', <b>' + lf + '</b> left over' : ', none left over'); }
      else if (G.F && s.framed === n && n <= 10 && G.F === 1) eq = (both ? both + ', ' : '') + (n === 10 ? 'a full ten' : (n > 5 ? '<b>5</b> and <b>' + (n - 5) + '</b>, ' : '') + '<b>' + (10 - n) + '</b> more make 10');
      else if (G.F && s.framed === n && n > 10) eq = (both ? both + ', that is ' : '') + '<b>10</b> and <b>' + (n - 10) + '</b>';
      else if (G.F === 2 && s.framed === n) eq = (both ? both + ', ' : '') + (n === 10 ? 'a full ten' : '<b>' + (10 - n) + '</b> more make 10');
      else eq = both;
      if (eq) h += '<p class="mp-ceq">' + eq + '</p>';
      read.innerHTML = h;
    }
    function snaps() {
      var b = '';
      if (sort === 'share' || picking) {
        b += '<span class="mp-cgrp" role="group" aria-label="How many groups"><small>Groups</small>';
        for (var g = 2; g <= 10; g++) b += '<button type="button" class="mp-snap" data-k="' + g + '" aria-pressed="' + (sort === 'share' && g === k) + '">' + g + '</button>';
        b += '</span>';
      }
      if (ctrs.length) b += '<button type="button" class="mp-snap" data-a="clear">Clear</button>';
      qs('.mp-snaps', mat).innerHTML = b;
    }
    function sync() {
      qsa('.mp-csort button', root).forEach(function (x) { var s = x.getAttribute('data-s'); x.setAttribute('aria-pressed', String(sort === s || (s === 'share' && picking))); });
      qsa('.mp-cmode [data-f]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-f') === kind)); });
    }
    function say(t) { sayEl.textContent = t; sayEl.classList.add('on'); clearTimeout(sayT); sayT = setTimeout(function () { sayEl.classList.remove('on'); }, 1800); announce(T, t); }
    function snapshot() { return JSON.stringify({ ctrs: ctrs, kind: kind, sort: sort, k: k }); }
    function act(fn) { var before = snapshot(); fn(); if (snapshot() !== before) { hist.push(before); if (hist.length > 60) hist.shift(); } draw(); change(); }
    function change() { if (o.onChange) o.onChange(state(), T); }
    function state() { var s = counts(); s.mat = kind; s.sort = sort; s.groups = k; s.last = last; return s; }
    /* the counters keep where they are drawn now, so a sorted mat can be moved about freely */
    function freeze() {
      ctrs.forEach(function (c, i) { if (sort || c.cell < 0 || !G.F) { c.x = P[i].x / G.W; c.y = P[i].y / G.H; } });
      sort = ''; picking = false;
    }
    function emptyCell(nearX, nearY) {
      var used = {}, best = -1, bd = 1e9;
      ctrs.forEach(function (c) { if (c.cell >= 0) used[c.cell] = 1; });
      for (var i = 0; i < G.F * 10; i++) {
        if (used[i]) continue;
        if (nearX == null) return i;
        var p = cellXY(i), d = Math.hypot(p.x - nearX, p.y - nearY);
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    }
    function onFrame(x, y) { return G.boxes.some(function (b) { return x > b.x - 20 && x < b.x + b.w + 20 && y > b.y - 20 && y < b.y + b.h + 20; }); }
    function freeSpot() {
      var D = G.D, step = D * 1.3, R = rng(seed += 7), spots = [];
      for (var y = D * 0.8; y < G.H - 80; y += step) for (var x = D * 0.8; x < G.W - D * 0.6; x += step) spots.push([x, y]);
      for (var i = spots.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)), t = spots[i]; spots[i] = spots[j]; spots[j] = t; }
      for (var s = 0; s < spots.length; s++) {
        var ok = !onFrame(spots[s][0], spots[s][1]) && P.every(function (p) { return Math.hypot(p.x - spots[s][0], p.y - spots[s][1]) > D * 1.1; });
        if (ok) return { x: spots[s][0] / G.W, y: spots[s][1] / G.H };
      }
      return { x: 0.15 + R() * 0.7, y: 0.1 + R() * 0.6 };
    }
    function add(c, x, y) {
      if (ctrs.length >= CT_MAX) { say('The mat holds 100 counters.'); return; }
      act(function () {
        var cell = G.F ? emptyCell(x, y) : -1;
        if (x != null && G.F && !onFrame(x, y)) cell = -1;
        if (sort) { ctrs.push({ c: c, cell: -1, x: 0.5, y: 0.5 }); last = 'add'; return; }
        if (cell >= 0) { ctrs.push({ c: c, cell: cell, x: 0.5, y: 0.5 }); last = 'add'; return; }
        if (x == null && G.F && emptyCell() < 0) say('The frames are full.');
        var p = x == null ? freeSpot() : { x: clamp(x, G.D / 2, G.W - G.D / 2) / G.W, y: clamp(y, G.D / 2, G.H - G.D / 2) / G.H };
        ctrs.push({ c: c, cell: -1, x: p.x, y: p.y }); last = 'add';
      });
      announce(T, CT_NAME[c] + ' counter');
    }
    /* switching mats: frames fill box by box with the counters in order, any more wait below the frames */
    function setMat(f) {
      act(function () {
        freeze(); kind = f; last = 'mat';
        G = geom();
        var order = ctrs.slice().sort(function (a, b) { return (a.cell < 0 ? 1e3 : a.cell) - (b.cell < 0 ? 1e3 : b.cell); });
        if (!G.F) { ctrs.forEach(function (c) { c.cell = -1; }); return; }
        var cap = G.F * 10;
        order.forEach(function (c, i) { c.cell = i < cap ? i : -1; });
        G = geom();
        var extra = order.slice(cap), D = G.D, g = D * 1.15, per = Math.max(1, Math.floor((G.W - 24) / g));
        extra.forEach(function (c, i) {
          var row = Math.floor(i / per), inRow = Math.min(per, extra.length - row * per);
          c.x = (G.W / 2 + ((i % per) - (inRow - 1) / 2) * g) / G.W;
          c.y = Math.min(G.H - 80 - D / 2, G.fbottom + 18 + D / 2 + row * g) / G.H;
        });
      });
    }
    function setSort(s, groups) {
      if (!ctrs.length && s !== 'share') { say('Put some counters on the mat first.'); return; }
      act(function () {
        if (kind !== 'free') { freeze(); kind = 'free'; ctrs.forEach(function (c) { c.cell = -1; }); G = geom(); }
        sort = s; if (groups) k = groups; picking = false; last = s;
      });
    }
    /* pointer handling: drag a counter (or tap it to turn it over); counters dragged in from the tray */
    var ghost = null;
    function local(e) { var r = mat.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom }; }
    layer.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('.mp-ctr');
      if (!b) return;
      drag = { i: +b.getAttribute('data-i'), el: b, x: e.clientX, y: e.clientY, moved: false };
      e.preventDefault();
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      if (!drag.moved && Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 6) { drag.moved = true; drag.el.classList.add('mp-lift'); }
      if (!drag.moved) return;
      var p = local(e), D = P[drag.i].D;
      drag.el.style.transform = 'translate(' + (p.x - D / 2) + 'px,' + (p.y - D / 2) + 'px)';
      drag.el.classList.toggle('off', !p.inside);
    });
    function endDrag(e, cancel) {
      if (!drag) return;
      var d = drag; drag = null;
      if (cancel) { draw(); return; }
      if (!d.moved) { act(function () { var c = ctrs[d.i]; c.c = c.c === 'a' ? 'b' : 'a'; last = 'flip'; }); return; }
      var p = local(e);
      act(function () {
        freeze();
        var c = ctrs[d.i];
        if (!p.inside) { ctrs.splice(d.i, 1); last = 'remove'; return; }
        last = 'move';
        if (G.F && onFrame(p.x, p.y)) { var was = c.cell; c.cell = -1; var cell = emptyCell(p.x, p.y); c.cell = cell >= 0 ? cell : was; if (c.cell >= 0) return; }
        c.cell = -1; c.x = clamp(p.x, G.D / 2, G.W - G.D / 2) / G.W; c.y = clamp(p.y, G.D / 2, G.H - G.D / 2) / G.H;
      });
    }
    window.addEventListener('pointerup', function (e) { endDrag(e, false); });
    window.addEventListener('pointercancel', function (e) { endDrag(e, true); });
    layer.addEventListener('click', function (e) {
      var b = e.target.closest('.mp-ctr');
      if (b && e.detail === 0) act(function () { var c = ctrs[+b.getAttribute('data-i')]; c.c = c.c === 'a' ? 'b' : 'a'; last = 'flip'; });
    });
    var tray = qs('.mp-dtray', root), tdrag = null;
    tray.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('.mp-cpile');
      if (!b) return;
      tdrag = { c: b.getAttribute('data-c'), x: e.clientX, y: e.clientY, moved: false };
      e.preventDefault();
    });
    /* the drag is followed on the whole window, so letting go anywhere ends it (a browser can drop the pointer capture) */
    window.addEventListener('pointermove', function (e) {
      if (!tdrag) return;
      if (!tdrag.moved && Math.abs(e.clientX - tdrag.x) + Math.abs(e.clientY - tdrag.y) > 6) {
        tdrag.moved = true;
        ghost = el('i', 'mp-ctr mp-cghost ' + tdrag.c); ghost.style.width = ghost.style.height = G.D + 'px'; document.body.appendChild(ghost);
      }
      if (ghost) ghost.style.transform = 'translate(' + (e.clientX - G.D / 2) + 'px,' + (e.clientY - G.D / 2) + 'px)';
    });
    function trayEnd(e, cancel) {
      if (!tdrag) return;
      var d = tdrag; tdrag = null;
      if (ghost) { ghost.remove(); ghost = null; }
      if (cancel) return;
      if (!d.moved) { add(d.c); return; }
      var p = local(e);
      if (p.inside) add(d.c, p.x, p.y);
    }
    window.addEventListener('pointerup', function (e) { trayEnd(e, false); });
    window.addEventListener('pointercancel', function (e) { trayEnd(e, true); });
    window.addEventListener('blur', function () { trayEnd(null, true); endDrag(null, true); });
    tray.addEventListener('click', function (e) {
      var p = e.target.closest('.mp-cpile'), s = e.target.closest('.mp-csort button');
      if (p && e.detail === 0) add(p.getAttribute('data-c'));
      if (!s) return;
      var v = s.getAttribute('data-s');
      if (v === 'share') { if (sort === 'share' || picking) { picking = false; if (sort === 'share') act(function () { freeze(); last = 'unsort'; }); else draw(); } else { picking = true; draw(); } return; }
      if (sort === v) act(function () { freeze(); last = 'unsort'; }); else setSort(v);
    });
    qs('.mp-cmode', root).addEventListener('click', function (e) {
      var b = e.target.closest('[data-f]');
      if (b && b.getAttribute('data-f') !== kind) setMat(b.getAttribute('data-f'));
    });
    mat.addEventListener('click', function (e) {
      var b = e.target.closest('.mp-snap');
      if (!b) return;
      if (b.hasAttribute('data-k')) setSort('share', +b.getAttribute('data-k'));
      else act(function () { ctrs = []; sort = ''; picking = false; last = 'clear'; });
    });
    T.undo = function () {
      if (!hist.length) return;
      var s = JSON.parse(hist.pop());
      ctrs = s.ctrs; kind = s.kind; sort = s.sort; k = s.k; picking = false; last = 'undo';
      draw(); change();
    };
    T.canUndo = function () { return hist.length > 0; };
    T.showNumbers = function (on) { shown = !!on; draw(); change(); };
    T.state = state;
    T.reset = function () { ctrs = []; kind = 'free'; sort = ''; picking = false; hist = []; draw(); };
    if (window.ResizeObserver) new ResizeObserver(function () { if (!drag) draw(); }).observe(mat); else window.addEventListener('resize', draw);
    T.reset();
    return T;
  }

  /* ================= Number chart, Toolbox version =================
     Manip.hundred(root, { tool: true }). A 10 by 10 chart: 1 to 100, 101 to 200 or 0 to 99, sized to fill the mat.
     "Colour it": tap squares to colour them with the chosen pen (3 colours). "Skip count by" colours every 2nd, 3rd,
     4th, 5th, 10th or 25th number with the pen, one after another; a square can hold more than one colour (fill, ring, dot).
     "Jump": tap a start and an end; a path shows the jumps of ten down (or up) and of one across, and with Show number
     the sum. "Hide some" blanks a few numbers; tap one to show it. Adds undo() and showNumbers(on). */
  var HC_FROM = { c1: 1, c101: 101, c0: 0 };
  var hcUid = 0;
  function toolChart(root, o) {
    var T = base(root, 'hct');
    T.uid = ++hcUid;
    root.classList.add('mp-tool', 'mp-hct');
    var SKIPS = [2, 3, 4, 5, 10, 25];
    root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray mp-hctray"><small>Colour</small><div class="mp-pens" role="group" aria-label="Colour">' +
      NL_COL.map(function (c, i) { return '<button type="button" class="mp-pen" data-p="' + i + '" aria-label="' + NL_NAME[i] + '" aria-pressed="' + (i === 0) + '" style="--c:' + c + '"></button>'; }).join('') +
      '</div><small>Skip count by</small><div class="mp-skips" role="group" aria-label="Skip count by">' + SKIPS.map(function (k) { return '<button type="button" class="mp-jb" data-k="' + k + '">' + k + '</button>'; }).join('') +
      '</div><button type="button" class="mp-hide" aria-pressed="false">Hide some</button></div>' +
      '<div class="mp-dmain"><div class="mp-cmode" role="group" aria-label="Chart and tap"><span>Chart</span>' +
      '<button type="button" data-c="c1" aria-pressed="true">1 to 100</button><button type="button" data-c="c101" aria-pressed="false">101 to 200</button><button type="button" data-c="c0" aria-pressed="false">0 to 99</button>' +
      '<i class="mp-cgap"></i><span>Tap</span><button type="button" data-t="colour" aria-pressed="true">Colour it</button><button type="button" data-t="jump" aria-pressed="false">Jump from&hellip; to&hellip;</button></div>' +
      '<div class="mp-read" aria-live="polite"></div><div class="mp-mat mp-hcmat"><div class="mp-hcgrid" role="group" aria-label="Number chart"></div><div class="mp-snaps"></div></div><p class="mp-live sr" aria-live="polite"></p></div></div>';
    var mat = qs('.mp-mat', root), grid = qs('.mp-hcgrid', mat), read = qs('.mp-read', root);
    /* state: the chart, colours on each square (a set of pens as bits), the pen, what a tap does, the jump, hidden squares */
    var chart = 'c1', marks = {}, pen = 0, tap = 'colour', jump = { a: null, b: null }, hidden = {}, shown = false, hist = [], last = '', lastSkip = null, skipBy = {}, peek = null, anim = 0;
    function from() { return HC_FROM[chart]; }
    function idx(n) { var i = n - from(); return { r: Math.floor(i / 10), c: i % 10 }; }
    /* the jump path: tens down (or up) to the end's row, then ones across */
    function path(a, b) {
      var p = [a], A = idx(a), B = idx(b), n = a, s = B.r > A.r ? 10 : -10, t = B.c > A.c ? 1 : -1, i;
      for (i = 0; i < Math.abs(B.r - A.r); i++) { n += s; p.push(n); }
      for (i = 0; i < Math.abs(B.c - A.c); i++) { n += t; p.push(n); }
      return p;
    }
    function size() {
      var r = mat.getBoundingClientRect(), W = r.width || 700, H = r.height || 500, gap = W < 520 ? 3 : 5;
      var s = Math.floor(Math.min((W - 24 - 9 * gap) / 10, (H - 84 - 9 * gap) / 10, 66));
      grid.style.setProperty('--s', Math.max(22, s) + 'px'); grid.style.setProperty('--g', gap + 'px');
    }
    function draw() {
      size();
      var h = '', onPath = {}, f = from();
      if (jump.a != null && jump.b != null) path(jump.a, jump.b).forEach(function (n) { onPath[n] = 1; });
      for (var n = f; n < f + 100; n++) {
        var m = marks[n] || 0, cs = [0, 1, 2].filter(function (k) { return m & (1 << k); }), cls = 'mp-hcn', st = '';
        if (cs.length) { cls += ' f'; st = '--f:' + NL_COL[cs[0]] + (cs[1] != null ? ';--r:' + NL_COL[cs[1]] : '') + (cs[2] != null ? ';--d:' + NL_COL[cs[2]] : ''); if (cs[1] != null) cls += ' r'; if (cs[2] != null) cls += ' d'; }
        if (n === jump.a) cls += ' ja'; else if (n === jump.b) cls += ' jb'; else if (onPath[n]) cls += ' jp';
        var hid = hidden[n] && n !== peek;
        if (hid) cls += ' hid'; else if (n === peek) cls += ' peek';
        h += '<button type="button" class="' + cls + '" data-n="' + n + '" style="' + st + '" aria-label="' + (hid ? 'Hidden number' : n) + '">' + (hid ? '' : n) + '</button>';
      }
      grid.classList.toggle('w3', chart === 'c101');
      grid.innerHTML = h + '<svg class="mp-hcpath" aria-hidden="true"></svg>';
      drawPath(); readout(); snaps(); sync();
    }
    function centre(n) {
      var b = qs('[data-n="' + n + '"]', grid), g = grid.getBoundingClientRect(), r = b.getBoundingClientRect();
      return [r.left - g.left + r.width / 2, r.top - g.top + r.height / 2];
    }
    function drawPath() {
      if (jump.a == null || jump.b == null || jump.a === jump.b) return;
      var svg = qs('.mp-hcpath', grid), p = path(jump.a, jump.b).map(centre);
      svg.innerHTML = '<path d="M' + p.map(function (q) { return q[0] + ' ' + q[1]; }).join(' L') + '"/>';
    }
    function list(ns) { return ns.slice(0, 5).map(fmt).join(', ') + (ns.length > 5 ? ' &hellip;' : ''); }
    function readout() {
      if (!shown) { read.innerHTML = ''; return; }
      var h = '';
      if (peek != null) {
        var f = from(), bits = [];
        if (peek - 1 >= f) bits.push('one more than <b>' + fmt(peek - 1) + '</b>');
        if (peek - 10 >= f) bits.push('ten more than <b>' + fmt(peek - 10) + '</b>');
        h += '<p class="mp-total"><span class="mp-num">' + fmt(peek) + '</span></p>' + (bits.length ? '<p class="mp-ceq">' + bits.join(', ') + '</p>' : '');
      } else if (tap === 'jump' && jump.a != null && jump.b != null) {
        var d = jump.b - jump.a, A = idx(jump.a), B = idx(jump.b), dr = B.r - A.r, dc = B.c - A.c, parts = [];
        if (dr) parts.push('<b>' + (dr > 0 ? '+10' : '−10') + (Math.abs(dr) > 1 ? ' × ' + Math.abs(dr) : '') + '</b> ' + (dr > 0 ? 'down' : 'up'));
        if (dc) parts.push('<b>' + (dc > 0 ? '+1' : '−1') + (Math.abs(dc) > 1 ? ' × ' + Math.abs(dc) : '') + '</b> across');
        h += '<p class="mp-total"><span class="mp-num">' + fmt(Math.abs(d)) + '</span></p><p class="mp-ceq">from <b>' + fmt(jump.a) + '</b> to <b>' + fmt(jump.b) + '</b>' + (parts.length ? ': ' + parts.join(', ') : '') + ', so <b>' + fmt(jump.a) + (d >= 0 ? ' + ' : ' − ') + fmt(Math.abs(d)) + ' = ' + fmt(jump.b) + '</b></p>';
      } else {
        var by = [0, 1, 2].map(function (k) { return Object.keys(marks).map(Number).filter(function (n) { return marks[n] & (1 << k); }).sort(function (x, y) { return x - y; }); });
        var used = [0, 1, 2].filter(function (k) { return by[k].length; });
        if (lastSkip && by[lastSkip.p].length) h += '<p class="mp-total"><span class="mp-num" style="color:' + NL_COL[lastSkip.p] + '">' + list(by[lastSkip.p]).replace(' &hellip;', '') + ' &hellip;</span></p>';
        if (used.length) h += '<p class="mp-ceq">' + used.map(function (k) { return '<b style="color:' + NL_COL[k] + '">' + NL_NAME[k] + '</b>: ' + pl(by[k].length, 'square', 'squares') + (skipBy[k] ? ', counting by <b>' + skipBy[k] + '</b>' : ''); }).join('; ') + '</p>';
        if (used.length > 1) { var both = by[used[0]].filter(function (n) { return marks[n] & (1 << used[1]); }); if (both.length) h += '<p class="mp-ceq">both: <b>' + list(both) + '</b></p>'; }
      }
      read.innerHTML = h;
    }
    function snaps() {
      var any = Object.keys(marks).length || jump.a != null, hint = tap !== 'jump' ? '' : jump.a == null || jump.b != null ? 'Tap where a jump starts.' : 'Now tap where it ends.';
      qs('.mp-snaps', mat).innerHTML = (hint ? '<span class="mp-hint">' + hint + '</span>' : '') + (any ? '<button type="button" class="mp-snap" data-a="clear">Clear</button>' : '');
    }
    function sync() {
      qsa('.mp-pen', root).forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-p') === pen)); });
      qsa('.mp-cmode [data-c]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-c') === chart)); });
      qsa('.mp-cmode [data-t]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-t') === tap)); });
      qs('.mp-hide', root).setAttribute('aria-pressed', String(Object.keys(hidden).length > 0));
    }
    function snapshot() { return JSON.stringify({ chart: chart, marks: marks, jump: jump, hidden: hidden, lastSkip: lastSkip, skipBy: skipBy }); }
    function act(fn) { anim++; var before = snapshot(); fn(); if (snapshot() !== before) { hist.push(before); if (hist.length > 60) hist.shift(); } draw(); change(); }
    function change() { if (o.onChange) o.onChange(state(), T); }
    function state() {
      return { chart: chart, from: from(), marked: Object.keys(marks).map(Number).sort(function (a, b) { return a - b; }), jump: { a: jump.a, b: jump.b }, hidden: Object.keys(hidden).map(Number), last: last };
    }
    /* skip counting: colour the multiples one after another, so the pattern grows */
    function skip(k) {
      var f = from(), ns = [];
      for (var n = Math.ceil(Math.max(f, 1) / k) * k; n < f + 100; n += k) ns.push(n);
      act(function () { ns.forEach(function (n) { marks[n] = (marks[n] || 0) | (1 << pen); }); lastSkip = { k: k, p: pen }; skipBy[pen] = k; peek = null; last = 'skip'; });
      if (T.fast) return;
      var ep = anim, sq = ns.map(function (n) { return qs('[data-n="' + n + '"]', grid); });
      sq.forEach(function (b) { b.classList.add('mp-wait'); });
      sq.forEach(function (b, i) { setTimeout(function () { if (ep === anim) { b.classList.remove('mp-wait'); bump(b, 'mp-pop'); } }, 60 + i * Math.min(90, 1600 / ns.length)); });
      announce(T, 'Counting by ' + k);
    }
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.mp-hcn');
      if (!b) return;
      var n = +b.getAttribute('data-n');
      if (hidden[n] && n !== peek) { peek = n; last = 'peek'; draw(); change(); announce(T, String(n)); return; }
      if (tap === 'jump') {
        act(function () {
          if (jump.a == null || jump.b != null) { jump = { a: n, b: null }; } else jump.b = n;
          peek = null; last = 'jump';
        });
        announce(T, jump.b == null ? 'Now tap where it ends.' : 'Jump from ' + jump.a + ' to ' + jump.b);
        return;
      }
      act(function () { marks[n] = (marks[n] || 0) ^ (1 << pen); if (!marks[n]) delete marks[n]; peek = null; last = 'tap'; });
    });
    qs('.mp-dtray', root).addEventListener('click', function (e) {
      var p = e.target.closest('.mp-pen'), k = e.target.closest('.mp-skips button'), hd = e.target.closest('.mp-hide');
      if (p) { pen = +p.getAttribute('data-p'); sync(); }
      if (k) { if (tap !== 'colour') { tap = 'colour'; } skip(+k.getAttribute('data-k')); }
      if (hd) act(function () {
        peek = null; last = 'hide';
        if (Object.keys(hidden).length) { hidden = {}; return; }
        var R = rng(Date.now() % 9973), f = from(), pick = [];
        while (pick.length < 10) { var n = f + Math.floor(R() * 100); if (pick.indexOf(n) < 0 && n !== jump.a && n !== jump.b) pick.push(n); }
        hidden = {}; pick.forEach(function (n) { hidden[n] = 1; });
      });
    });
    qs('.mp-cmode', root).addEventListener('click', function (e) {
      var c = e.target.closest('[data-c]'), t = e.target.closest('[data-t]');
      if (c && c.getAttribute('data-c') !== chart) act(function () { chart = c.getAttribute('data-c'); marks = {}; jump = { a: null, b: null }; hidden = {}; lastSkip = null; skipBy = {}; peek = null; last = 'chart'; });
      if (t && t.getAttribute('data-t') !== tap) { tap = t.getAttribute('data-t'); peek = null; last = 'mode'; draw(); change(); }
    });
    mat.addEventListener('click', function (e) {
      if (e.target.closest('.mp-snap')) act(function () { marks = {}; jump = { a: null, b: null }; lastSkip = null; skipBy = {}; peek = null; last = 'clear'; });
    });
    T.undo = function () {
      if (!hist.length) return;
      var s = JSON.parse(hist.pop());
      chart = s.chart; marks = s.marks; jump = s.jump; hidden = s.hidden; lastSkip = s.lastSkip; skipBy = s.skipBy; peek = null; last = 'undo'; anim++;
      draw(); change();
    };
    T.canUndo = function () { return hist.length > 0; };
    T.showNumbers = function (on) { shown = !!on; draw(); change(); };
    T.state = state;
    T.reset = function () { chart = 'c1'; marks = {}; jump = { a: null, b: null }; hidden = {}; lastSkip = null; skipBy = {}; peek = null; hist = []; draw(); };
    if (window.ResizeObserver) new ResizeObserver(function () { size(); drawPath(); }).observe(mat); else window.addEventListener('resize', draw);
    T.reset();
    return T;
  }

  /* ================= Number line, Toolbox version =================
     Manip.numberline(root, { tool: true }). The line fills the mat (across on a wide screen, standing up on a phone).
     Line: 0 to 20, 0 to 100, 0 to 1 000, or Blank (ticks, no numbers). Tap the line between two numbers to zoom in
     (0 to 100 becomes 30 to 40); "Zoom out" goes back. Up to 3 markers, dragged or tapped from the tray. Drag a marker
     along the line to move it, or off the line to put it back. Drag the round handle by the chosen marker to draw a jump,
     or tap a "Jump by" button. Nearest ten / Nearest hundred shade the tens (or hundreds) around the chosen marker and
     mark halfway. Values and the sum of the jumps show only with Show number. Adds undo() and showNumbers(on). */
  var NL_COL = ['var(--accent,#0b6e78)', 'var(--p4,#7646bf)', 'var(--p3,#c25a12)'], NL_NAME = ['teal', 'purple', 'orange'];
  var NL_RANGE = { r20: [0, 20], r100: [0, 100], r1000: [0, 1000], blank: [0, 100] };
  var nlUid = 0;
  function toolLine(root, o) {
    var T = base(root, 'nlt');
    T.uid = ++nlUid;
    root.classList.add('mp-tool', 'mp-nlt');
    var JUMPS = o.jumps || [1, 2, 5, 10, 20, 25, 50, 100];
    root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray mp-nltray"><div class="mp-nlmk" role="group" aria-label="Markers">' +
      NL_COL.map(function (c, i) { return '<button type="button" class="mp-mkb" data-m="' + i + '" aria-label="Put the ' + NL_NAME[i] + ' marker on the line" style="--c:' + c + '"><i></i></button>'; }).join('') +
      '</div><div class="mp-nljb" role="group" aria-label="Jump by"><small>Jump</small><div class="mp-dir"><button type="button" data-d="1" aria-pressed="true" aria-label="Jump forward">+</button><button type="button" data-d="-1" aria-pressed="false" aria-label="Jump back">&minus;</button></div>' +
      '<div class="mp-jbs">' + JUMPS.map(function (j) { return '<button type="button" class="mp-jb" data-j="' + j + '">' + j + '</button>'; }).join('') + '</div></div></div>' +
      '<div class="mp-dmain"><div class="mp-cmode" role="group" aria-label="Line and helpers"><span>Line</span>' +
      '<button type="button" data-r="r20" aria-pressed="false">0 to 20</button><button type="button" data-r="r100" aria-pressed="true">0 to 100</button><button type="button" data-r="r1000" aria-pressed="false">0 to 1 000</button><button type="button" data-r="blank" aria-pressed="false">Blank</button>' +
      '<i class="mp-cgap"></i><span>Show</span><button type="button" data-n="10" aria-pressed="false">Nearest ten</button><button type="button" data-n="100" aria-pressed="false">Nearest hundred</button></div>' +
      '<div class="mp-read" aria-live="polite"></div><div class="mp-mat mp-nlmat"><svg class="mp-nlsvg" aria-label="Number line"></svg><div class="mp-snaps"></div><p class="mp-say" aria-live="polite"></p></div><p class="mp-live sr" aria-live="polite"></p></div></div>';
    var mat = qs('.mp-mat', root), svg = qs('svg', mat), read = qs('.mp-read', root), sayEl = qs('.mp-say', root);
    /* state: the line, the view (zoomed part of it), markers {v} by colour, jumps {m, from, to}, the chosen marker */
    var range = 'r100', view = [0, 100], zooms = [], marks = [null, null, null], jumps = [], cur = -1, dir = 1, near = 0, shown = false, hist = [], last = '';
    var G = null, drag = null, sayT = 0;
    function full() { return NL_RANGE[range].slice(); }
    function snapStep() { var s = view[1] - view[0]; return s > 200 ? 10 : 1; }
    function geom() {
      var r = mat.getBoundingClientRect(), W = r.width || 600, H = r.height || 300, vert = W < 520 && H > W * 1.15;
      var pad = vert ? 34 : 48, a0 = vert ? H - pad - 54 : pad, a1 = vert ? pad + 10 : W - pad, C = vert ? Math.round(W * 0.3) : Math.round(H * 0.56);
      return { W: W, H: H, vert: vert, a0: a0, a1: a1, C: C, sg: vert ? 1 : -1, r: vert ? 13 : 15 };
    }
    function P(v) { return G.a0 + (G.a1 - G.a0) * (v - view[0]) / (view[1] - view[0]); }
    function V(a) { return view[0] + (a - G.a0) / (G.a1 - G.a0) * (view[1] - view[0]); }
    function xy(along, across) { return G.vert ? [across, along] : [along, across]; }
    function S(tag, at, p) { var e = document.createElementNS(SVGNS, tag); for (var k in at) e.setAttribute(k, at[k]); (p || svg).appendChild(e); return e; }
    function Tx(along, across, txt, at, par) { var p = xy(along, across); var t = S('text', Object.assign({ x: p[0], y: p[1] }, at || {}), par); t.textContent = txt; return t; }
    function L(a1, c1, a2, c2, cls, par) { var p = xy(a1, c1), q = xy(a2, c2); return S('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], class: cls }, par); }
    /* the smallest label step that leaves room between numbers */
    function labelStep() {
      var span = view[1] - view[0], len = Math.abs(G.a1 - G.a0), digits = String(Math.round(view[1])).length, need = G.vert ? 26 : digits * 12 + 16;
      var c = [1, 2, 5, 10, 20, 50, 100, 200, 500];
      for (var i = 0; i < c.length; i++) if (len * c[i] / span >= need) return c[i];
      return 1000;
    }
    function draw() {
      G = geom();
      svg.setAttribute('viewBox', '0 0 ' + G.W + ' ' + G.H);
      svg.innerHTML = '';
      var span = view[1] - view[0], tick = span > 200 ? 10 : 1, lab = labelStep(), blank = range === 'blank', C = G.C;
      /* jumps that start or end beyond a zoomed view are cut off at the ends of the line */
      var clip = S('clipPath', { id: 'mp-nlclip' + T.uid }, S('defs', {})), ce = xy(Math.min(G.a0, G.a1) - 2, 0);
      S('rect', G.vert ? { x: 0, y: ce[1], width: G.W, height: Math.abs(G.a1 - G.a0) + 4 } : { x: ce[0], y: 0, width: Math.abs(G.a1 - G.a0) + 4, height: G.H }, clip);
      var gLens = S('g', {}), gLine = S('g', { class: 'mp-nlline' }), gHops = S('g', { 'clip-path': 'url(#mp-nlclip' + T.uid + ')' }), gMk = S('g', {});
      /* rounding: shade the ten (or hundred) around the chosen marker and mark halfway */
      var lensOn = near && cur >= 0 && marks[cur], lo = 0, hi = 0;
      if (lensOn) {
        var v = marks[cur].v;
        lo = Math.floor(v / near) * near; hi = lo + near;
        var pa = P(lo), pb = P(hi), half = (lo + hi) / 2, bw = G.vert ? 150 : 170;
        S('rect', G.vert ? { x: C - 30, y: Math.min(pa, pb), width: bw, height: Math.abs(pb - pa), rx: 12, class: 'mp-nlband' } : { x: Math.min(pa, pb), y: C - bw + 30, width: Math.abs(pb - pa), height: bw, rx: 12, class: 'mp-nlband' }, gLens);
        L(P(half), C + G.sg * 4, P(half), C + G.sg * (bw - 46), 'mp-nlhalf', gLens);
        Tx(P(half), C + G.sg * (bw - 34), 'halfway', { class: 'mp-nlhw', 'text-anchor': G.vert ? 'start' : 'middle', 'dominant-baseline': 'middle' }, gLens);
        if (shown && !G.vert) {
          var to = v - lo < hi - v ? lo : hi, msg = v === lo ? fmt(v) + ' is already a ' + (near === 10 ? 'ten' : 'hundred') : v === half ? fmt(v) + ' is halfway: it rounds up to ' + fmt(hi) : fmt(v) + ' is closer to ' + fmt(to);
          Tx(P(half), C + 118, msg, { class: 'mp-nlmsg', 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, gLens);
        }
      }
      /* the line, ticks and numbers */
      var ends = [G.a0 + (G.vert ? 14 : -14), G.a1 + (G.vert ? -14 : 14)];
      L(ends[0], C, ends[1], C, 'mp-nlaxis', gLine);
      var first = Math.ceil(view[0] / tick) * tick;
      for (var t = first; t <= view[1] + 1e-9; t += tick) {
        var big = t % lab === 0, mid = !big && (t % (tick * 5) === 0), h = big ? 13 : mid ? 9 : 5;
        if (blank && !big && !mid && tick === 1 && span > 20) continue;
        L(P(t), C - h, P(t), C + h, big ? 'mp-nltk big' : 'mp-nltk', gLine);
        if (big && !blank) Tx(P(t), C + (G.vert ? -24 : 40), fmt(t), { class: 'mp-nltl' + (lensOn && (t === lo || t === hi) ? ' on' : ''), 'text-anchor': G.vert ? 'end' : 'middle', 'dominant-baseline': 'middle' }, gLine);
      }
      /* jumps: arcs above the line (to the right when it stands up), each with its size */
      jumps.forEach(function (j) {
        if (!marks[j.m]) return;
        hop(gHops, j.from, j.to, NL_COL[j.m], (j.to > j.from ? '+' : '−') + fmt(Math.abs(j.to - j.from)));
      });
      if (drag && drag.kind === 'hop' && drag.to !== drag.from) hop(gHops, drag.from, drag.to, NL_COL[drag.m], (drag.to > drag.from ? '+' : '−') + fmt(Math.abs(drag.to - drag.from)), true);
      /* markers: beads on the line; the chosen one has a jump handle */
      marks.forEach(function (m, i) {
        if (!m || m.v < view[0] - 1e-9 || m.v > view[1] + 1e-9) return;
        var p = xy(P(m.v), C), g = S('g', { class: 'mp-nlm' + (i === cur ? ' on' : '') + (drag && drag.kind === 'move' && drag.m === i && drag.off ? ' off' : ''), 'data-m': i, tabindex: 0, role: 'slider', 'aria-label': NL_NAME[i] + ' marker', 'aria-valuenow': m.v, 'aria-valuemin': full()[0], 'aria-valuemax': full()[1], style: '--c:' + NL_COL[i] }, gMk);
        S('circle', { cx: p[0], cy: p[1], r: 26, class: 'mp-nlhit' }, g);
        S('circle', { cx: p[0], cy: p[1], r: G.r, class: 'mp-nlbead' }, g);
        S('circle', { cx: p[0], cy: p[1], r: 4.5, class: 'mp-nldot' }, g);
        if (shown) { var t = Tx(P(m.v), C + (G.vert ? 0 : 76), fmt(m.v), { class: 'mp-nlval', 'text-anchor': G.vert ? 'end' : 'middle', 'dominant-baseline': 'middle' }, g); if (G.vert) t.setAttribute('x', C - 62); }
        if (i === cur) {
          /* the jump handle sits up and to the right of the bead (above it, when the line stands up), clear of the jumps that land on it */
          var k = xy(P(m.v) + (G.vert ? -24 : 24), C + G.sg * 34), hg = S('g', { class: 'mp-nlknob', 'data-k': i, role: 'button', 'aria-label': 'Drag to make a jump' }, gMk);
          S('circle', { cx: k[0], cy: k[1], r: 26, class: 'mp-nlhit' }, hg);
          S('circle', { cx: k[0], cy: k[1], r: 15 }, hg);
          S('path', { d: G.vert ? 'M' + (k[0] - 5) + ' ' + (k[1] + 6) + 'q9 -1 9 -6t-9 -6m0 0l3 -3m-3 3l3 3' : 'M' + (k[0] - 6) + ' ' + (k[1] + 5) + 'q1 -9 6 -9t6 9m0 0l-3 -3m3 3l3 -3' }, hg);
        }
      });
      mat.classList.toggle('is-empty', !marks.some(Boolean));
      readout(); snaps();
    }
    function hop(gp, from, to, col, label, ghost) {
      var pa = P(from), pb = P(to), len = Math.abs(pb - pa), h = clamp(len * 0.6, 30, 130), sg = G.sg, C = G.C;
      var a = xy(pa, C + sg * 17), b = xy(pb, C + sg * 17), c1 = xy(pa, C + sg * (17 + h * 1.3)), c2 = xy(pb, C + sg * (17 + h * 1.3));
      S('path', { d: 'M' + a[0] + ' ' + a[1] + 'C' + c1[0] + ' ' + c1[1] + ' ' + c2[0] + ' ' + c2[1] + ' ' + b[0] + ' ' + b[1], class: 'mp-nlhop' + (ghost ? ' ghost' : ''), style: 'stroke:' + col }, gp);
      var ah = G.vert ? 'M' + b[0] + ' ' + b[1] + 'l' + 9 + ' ' + (to > from ? 4 : -4) + 'l-2 ' + (to > from ? 9 : -9) + 'z' : 'M' + b[0] + ' ' + b[1] + 'l' + (to > from ? -10 : 10) + ' -5l' + (to > from ? 4 : -4) + ' -8z';
      S('path', { d: ah, style: 'fill:' + col }, gp);
      var l = xy((pa + pb) / 2, C + sg * (17 + h * 1.0 + 18)), w = label.length * 10 + 22;
      S('rect', { x: l[0] - w / 2, y: l[1] - 15, width: w, height: 30, rx: 10, class: 'mp-nllab', style: 'stroke:' + col }, gp);
      var t = S('text', { x: l[0], y: l[1] + 1, class: 'mp-nllabt', 'text-anchor': 'middle', 'dominant-baseline': 'middle', style: 'fill:' + col }, gp); t.textContent = label;
    }
    function readout() {
      if (!shown) { read.innerHTML = ''; return; }
      var on = marks.map(function (m, i) { return m ? { v: m.v, i: i } : null; }).filter(Boolean), h = '';
      if (!on.length) { read.innerHTML = ''; return; }
      var c = cur >= 0 && marks[cur] ? cur : on[0].i, js = jumps.filter(function (j) { return j.m === c; });
      h += '<p class="mp-total"><span class="mp-num" style="color:' + NL_COL[c] + '">' + fmt(marks[c].v) + '</span></p>';
      if (js.length) {
        var parts = fmt(js[0].from) + js.map(function (j) { return (j.to > j.from ? ' + ' : ' − ') + fmt(Math.abs(j.to - j.from)); }).join('');
        var net = marks[c].v - js[0].from;
        h += '<p class="mp-nleq">' + parts + ' = <b>' + fmt(marks[c].v) + '</b><span>' + (net >= 0 ? 'jumped ' + fmt(net) + ' forward' : 'jumped ' + fmt(-net) + ' back') + '</span></p>';
      } else if (on.length > 1) {
        on.sort(function (a, b) { return a.v - b.v; });
        h += '<p class="mp-nleq">' + on.map(function (m) { return '<b style="color:' + NL_COL[m.i] + '">' + fmt(m.v) + '</b>'; }).reduce(function (s, x, k) { return s + (k ? (on[k - 1].v === on[k].v ? ' = ' : ' &lt; ') : '') + x; }, '') + '</p>';
      }
      if (near && marks[c]) {
        var v = marks[c].v, lo = Math.floor(v / near) * near, hi = lo + near, r = v - lo < hi - v ? lo : hi;
        h += '<p class="mp-nleq">nearest ' + (near === 10 ? 'ten' : 'hundred') + ': <b>' + fmt(v === lo ? v : r) + '</b></p>';
      }
      read.innerHTML = h;
    }
    function snaps() {
      var b = [];
      if (jumps.length) b.push(['clear', 'Clear jumps']);
      if (zooms.length) b.push(['out', 'Zoom out']);
      qs('.mp-snaps', mat).innerHTML = b.map(function (x) { return '<button type="button" class="mp-snap" data-a="' + x[0] + '">' + x[1] + '</button>'; }).join('');
      qsa('.mp-mkb', root).forEach(function (e, i) { e.classList.toggle('used', !!marks[i]); e.setAttribute('aria-pressed', String(i === cur)); });
      qsa('.mp-jb', root).forEach(function (e) { e.disabled = cur < 0 || !marks[cur]; });
    }
    function say(t) { sayEl.textContent = t; sayEl.classList.add('on'); clearTimeout(sayT); sayT = setTimeout(function () { sayEl.classList.remove('on'); }, 1800); announce(T, t); }
    function snapV(v) { var s = snapStep(), f = full(); return clamp(Math.round(v / s) * s, f[0], f[1]); }
    function snapshot() { return JSON.stringify({ range: range, view: view, zooms: zooms, marks: marks, jumps: jumps, cur: cur }); }
    function act(fn) { var before = snapshot(); fn(); if (snapshot() !== before) { hist.push(before); if (hist.length > 60) hist.shift(); } draw(); change(); }
    function change() { if (o.onChange) o.onChange(state(), T); }
    function state() { return { range: range, view: view.slice(), marks: marks.map(function (m) { return m ? m.v : null; }), jumps: jumps.length, cur: cur, near: near, last: last }; }
    /* zoom: animate the view to a new part of the line */
    var anim = 0;
    function zoomTo(to) {
      var from = view.slice(), t0 = null, ep = ++anim;
      if (T.fast || !window.requestAnimationFrame) { view = to; draw(); return; }
      requestAnimationFrame(function step(ts) {
        if (ep !== anim) return;
        if (t0 === null) t0 = ts;
        var k = Math.min(1, (ts - t0) / 420), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        view = [from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e];
        if (k >= 1) view = to.slice();
        draw();
        if (k < 1) requestAnimationFrame(step);
      });
    }
    function zoomAt(v) {
      var span = view[1] - view[0];
      if (span < 100) { say(span <= 10 ? 'This is as close as it zooms.' : 'Zoom works on 0 to 100 and 0 to 1 000.'); return; }
      var n = span / 10, lo = clamp(Math.floor(v / n) * n, view[0], view[1] - n);
      act(function () { zooms.push(view.slice()); last = 'zoom'; });
      zoomTo([lo, lo + n]);
      say(fmt(lo) + ' to ' + fmt(lo + n));
    }
    function zoomOut() { if (!zooms.length) return; var to = zooms[zooms.length - 1]; act(function () { zooms.pop(); last = 'zoom'; }); zoomTo(to); }
    function place(i, v) {
      act(function () {
        marks[i] = { v: snapV(v) }; cur = i; last = 'place';
        jumps = jumps.filter(function (j) { return j.m !== i; });
      });
    }
    function freeSpot(i) {
      var span = view[1] - view[0], lab = labelStep(), want = view[0] + span * [0, 1 / 3, 2 / 3][i], v = Math.round(want / lab) * lab;
      while (marks.some(function (m) { return m && m.v === v; }) && v + lab <= view[1]) v += lab;
      return v;
    }
    function jumpBy(n) {
      if (cur < 0 || !marks[cur]) { say('Put a marker on the line first.'); return; }
      var from = marks[cur].v, to = from + dir * n, f = full();
      if (to < f[0] || to > f[1]) { say('That jump goes off the line.'); return; }
      act(function () { jumps.push({ m: cur, from: from, to: to }); marks[cur].v = to; last = 'jump'; });
      if (to < view[0] || to > view[1]) { var s = view[1] - view[0], lo = clamp(Math.floor(to / s) * s, f[0], f[1] - s); zoomTo([lo, lo + s]); }
      announce(T, (dir > 0 ? 'Jumped forward ' : 'Jumped back ') + n);
    }
    /* pointer handling: markers, the jump handle, the line (zoom), and markers dragged in from the tray */
    function along(e) { var r = svg.getBoundingClientRect(); return G.vert ? e.clientY - r.top : e.clientX - r.left; }
    function across(e) { var r = svg.getBoundingClientRect(); return G.vert ? e.clientX - r.left : e.clientY - r.top; }
    function inMat(e) { var r = mat.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; }
    svg.addEventListener('pointerdown', function (e) {
      var k = e.target.closest('.mp-nlknob'), m = e.target.closest('.mp-nlm');
      if (k) drag = { kind: 'hop', m: +k.getAttribute('data-k'), from: marks[+k.getAttribute('data-k')].v, to: marks[+k.getAttribute('data-k')].v };
      else if (m) { var i = +m.getAttribute('data-m'); drag = { kind: 'move', m: i, start: marks[i].v, moved: false, x: e.clientX, y: e.clientY }; if (cur !== i) { cur = i; draw(); } }
      else drag = { kind: 'tap', x: e.clientX, y: e.clientY };
      svg.setPointerCapture && svg.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    svg.addEventListener('pointermove', function (e) {
      if (!drag) return;
      if (drag.kind === 'hop') { var v = snapV(V(along(e))); v = clamp(v, view[0], view[1]); if (v !== drag.to) { drag.to = v; draw(); } }
      if (drag.kind === 'move') {
        if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 6) drag.moved = true;
        if (!drag.moved) return;
        drag.off = Math.abs(across(e) - G.C) > 110 || !inMat(e);
        var nv = clamp(snapV(V(along(e))), view[0], view[1]);
        if (nv !== marks[drag.m].v || drag.offWas !== drag.off) { marks[drag.m].v = nv; drag.offWas = drag.off; draw(); }
      }
    });
    function endDrag(e, cancel) {
      if (!drag) return;
      var d = drag; drag = null;
      if (d.kind === 'hop') {
        if (!cancel && d.to !== d.from) act(function () { jumps.push({ m: d.m, from: d.from, to: d.to }); marks[d.m].v = d.to; last = 'jump'; });
        else draw();
      } else if (d.kind === 'move') {
        var end = marks[d.m].v; marks[d.m].v = d.start;
        if (cancel || !d.moved) { draw(); return; }
        if (d.off) act(function () { marks[d.m] = null; jumps = jumps.filter(function (j) { return j.m !== d.m; }); cur = marks.findIndex(Boolean); last = 'remove'; });
        else if (end !== d.start) act(function () { marks[d.m].v = end; jumps = jumps.filter(function (j) { return j.m !== d.m; }); last = 'move'; });
        else draw();
      } else if (!cancel && Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) < 10 && Math.abs(across(e) - G.C) < 70) zoomAt(V(along(e)));
    }
    svg.addEventListener('pointerup', function (e) { endDrag(e, false); });
    svg.addEventListener('pointercancel', function (e) { endDrag(e, true); });
    svg.addEventListener('keydown', function (e) {
      var m = e.target.closest && e.target.closest('.mp-nlm');
      if (!m) return;
      var i = +m.getAttribute('data-m'), s = snapStep(), d = { ArrowRight: s, ArrowUp: s, ArrowLeft: -s, ArrowDown: -s }[e.key];
      if (d == null) return;
      e.preventDefault();
      var f = full(), nv = clamp(marks[i].v + d, f[0], f[1]);
      act(function () { cur = i; marks[i].v = nv; jumps = jumps.filter(function (j) { return j.m !== i; }); last = 'move'; });
      var el = qs('.mp-nlm[data-m="' + i + '"]', svg); if (el) el.focus();
    });
    /* the tray: tap a marker to put it on the line (or choose it), drag it to a spot; jump buttons */
    var tray = qs('.mp-dtray', root), ghost = null, tdrag = null;
    tray.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('.mp-mkb');
      if (!b) return;
      tdrag = { i: +b.getAttribute('data-m'), x: e.clientX, y: e.clientY, moved: false };
      e.preventDefault();
    });
    /* followed on the whole window, so letting go anywhere ends the drag */
    window.addEventListener('pointermove', function (e) {
      if (!tdrag) return;
      if (!tdrag.moved && Math.abs(e.clientX - tdrag.x) + Math.abs(e.clientY - tdrag.y) > 6) {
        tdrag.moved = true;
        ghost = el('span', 'mp-nlghost'); ghost.style.setProperty('--c', NL_COL[tdrag.i]); document.body.appendChild(ghost);
      }
      if (ghost) ghost.style.transform = 'translate(' + (e.clientX - 16) + 'px,' + (e.clientY - 16) + 'px)';
    });
    function trayEnd(e, cancel) {
      if (!tdrag) return;
      var d = tdrag; tdrag = null;
      if (ghost) { ghost.remove(); ghost = null; }
      if (cancel) return;
      if (!d.moved) {
        if (marks[d.i]) { cur = d.i; draw(); change(); } else place(d.i, freeSpot(d.i));
        return;
      }
      if (inMat(e)) place(d.i, clamp(V(along(e)), view[0], view[1]));
    }
    window.addEventListener('pointerup', function (e) { trayEnd(e, false); });
    window.addEventListener('pointercancel', function (e) { trayEnd(e, true); });
    window.addEventListener('blur', function () { trayEnd(null, true); });
    tray.addEventListener('keydown', function (e) {
      var b = e.target.closest('.mp-mkb');
      if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); var i = +b.getAttribute('data-m'); if (marks[i]) { cur = i; draw(); } else place(i, freeSpot(i)); }
    });
    tray.addEventListener('click', function (e) {
      var j = e.target.closest('.mp-jb'), d = e.target.closest('.mp-dir button');
      if (j) jumpBy(+j.getAttribute('data-j'));
      if (d) { dir = +d.getAttribute('data-d'); qsa('.mp-dir button', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === d)); }); }
    });
    qs('.mp-cmode', root).addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-r')) {
        var r = b.getAttribute('data-r');
        if (r === range) return;
        act(function () {
          range = r; var f = full(); view = f.slice(); zooms = []; jumps = []; last = 'range';
          marks = marks.map(function (m) { return m ? { v: clamp(m.v, f[0], f[1]) } : null; });
        });
      } else {
        var n = +b.getAttribute('data-n');
        near = near === n ? 0 : n; last = 'near'; draw(); change();
      }
      syncChips();
    });
    function syncChips() {
      qsa('.mp-cmode [data-r]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-r') === range)); });
      qsa('.mp-cmode [data-n]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(+x.getAttribute('data-n') === near)); });
    }
    mat.addEventListener('click', function (e) {
      var b = e.target.closest('.mp-snap');
      if (!b) return;
      if (b.getAttribute('data-a') === 'clear') act(function () { jumps = []; last = 'clear'; });
      else zoomOut();
    });
    T.undo = function () {
      if (!hist.length) return;
      var s = JSON.parse(hist.pop());
      range = s.range; view = s.view; zooms = s.zooms; marks = s.marks; jumps = s.jumps; cur = s.cur; last = 'undo';
      anim++; syncChips(); draw(); change();
    };
    T.canUndo = function () { return hist.length > 0; };
    T.showNumbers = function (on) { shown = !!on; draw(); change(); };
    T.state = state;
    T.reset = function () { range = 'r100'; view = [0, 100]; zooms = []; marks = [null, null, null]; jumps = []; cur = -1; hist = []; syncChips(); draw(); };
    if (window.ResizeObserver) new ResizeObserver(function () { draw(); }).observe(mat); else window.addEventListener('resize', draw);
    T.reset();
    return T;
  }

  /* ================= Number line (lessons; tool: true gives the Toolbox version above) =================
     options: min, max, tick, every (label every), start (marker), step (jump buttons, a number or a list), marks [{v,t}],
     tap (tap or drag to move the marker, default true), onChange.
     Moves: hop(to, label), jumps(step, count), moveTo(v), mark(v, text), clearHops(). */
  M.numberline = function (root, o) {
    o = o || {};
    if (o.tool) return toolLine(root, o);
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
     words (true: fraction words only, "one half", "two sixths", for Grades 1 and 2;
     'both': standard notation with the word name beside it, for Grade 3 on), onChange.
     Tap a part to shade it. Moves: split(d), shade(k). */
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  M.fractions = function (root, o) {
    o = o || {};
    if (o.tool) return toolFrac(root, o);
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
    function label(d) { return d === 1 ? (o.words === true ? 'one whole' : '1') : o.words === true ? '<span class="mp-fw">' + name(1, d) + '</span>' : '<span class="mp-fr"><b>1</b><i>' + d + '</i></span>'; }
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
        return s.n ? '<p>' + (o.words === true ? '<b class="mp-fwb">' + name(s.n, s.d) + '</b>' : '<span class="mp-fr big"><b>' + s.n + '</b><i>' + s.d + '</i></span> ' + name(s.n, s.d)) + ' shaded' + (s.d > 1 ? ' (' + s.n + ' of ' + s.d + ' equal parts)' : '') + '</p>' : '';
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

  /* ================= Fraction kit, Toolbox version =================
     Manip.fractions(root, { tool: true }). The mat holds an amount made of fraction pieces (1 whole, 1/2 ... 1/10), up to 3 wholes.
     Tap or drag a piece from the tray to add it; tap a piece on the mat to take it off.
     "See it as" shows the same amount as strips under the whole, circles, a set of counters and a point on a number line, together.
     "Do": Share (things shared by people, the leftovers cut; one share can go on the mat), Split (cut every piece into 2 to 5),
     Line up (amounts under each other, to compare), Fill wholes (pack pieces into whole bars, or break wholes into pieces),
     Count on (add or take away one piece at a time). Numbers show only with Show number. Adds undo() and showNumbers(on).
     Grade 4 on (stage 2) adds: decimal pieces (0.1; 0.01 from Grade 5; 0.001 from Grade 6), a Grid window (tenths and hundredths
     on a 10 by 10 grid; a hundredth zoomed into thousandths from Grade 6), a Symbols window (the amount as fraction, simplest form,
     tenths or hundredths, mixed number, decimal and, from Grade 5, percent), Split into 10, Count on to 10, and Groups of
     (whole number times a fraction). Grade 5 on adds twelfths, Join (simplify), Combine and take away, and Fit into
     (a whole number divided by a fraction). Grade 6 on adds Cut into same-size pieces (unlike denominators) and typing a
     fraction, decimal or percent into Line up. */
  var FK_D = [1, 2, 3, 4, 5, 6, 8, 10], FK_MAX = 3, FK_TOP = 24, FK_BIG = 10;
  var FK_COL = { 1: '#132039', 2: '#0b6e78', 3: '#7646bf', 4: '#c25a12', 5: '#2f9e44', 6: '#b4283f', 8: '#2f62c4', 10: '#9a6e00', 9: '#8a3f9e', 12: '#8a4f7d', 15: '#3c8d6e', 16: '#1f7a9c', 20: '#a0522d', 100: '#2f62c4', 1000: '#b4283f' };
  var FK_EXTRA = ['#5b6fb5', '#3c8d6e', '#a0522d', '#8a3f9e', '#1f7a9c'];
  var FK_ORD = ['', 'whole', 'half', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth',
    'seventeenth', 'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third', 'twenty-fourth'];
  var FK_THING = { cookie: ['cookie', 'cookies'], pie: ['pie', 'pies'], pizza: ['pizza', 'pizzas'] };
  var FK_TIMES = { 2: ['twice', 'half'], 3: ['3 times', 'a third of'], 4: ['4 times', 'a fourth of'], 5: ['5 times', 'a fifth of'], 6: ['6 times', 'a sixth of'], 10: ['10 times', 'a tenth of'] };
  var fkUid = 0;
  function fkCol(d) { return FK_COL[d] || FK_EXTRA[d % FK_EXTRA.length]; }
  function fkName(d) { return d === 100 ? 'hundredth' : d === 1000 ? 'thousandth' : FK_ORD[d] || d + 'th'; }
  function fkNames(d) { return d === 2 ? 'halves' : d === 1 ? 'wholes' : fkName(d) + 's'; }
  function fkPow(d) { return d === 10 || d === 100 || d === 1000; }
  function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function toolFrac(root, o) {
    var T = base(root, 'fkt');
    T.uid = ++fkUid;
    root.classList.add('mp-tool', 'mp-fkt');
    var gr = window.Atlas && +Atlas.grade || 0, early = !!gr && gr <= 2, mid = !gr || gr >= 4, g5 = !gr || gr >= 5, g6 = !gr || gr >= 6;
    var FD = g5 ? FK_D.concat(12) : FK_D, DEC = g6 ? [10, 100, 1000] : g5 ? [10, 100] : mid ? [10] : [];
    var CUTS = mid ? [2, 3, 4, 5, 10] : [2, 3, 4, 5];
    var WINS = [['s', 'Strips'], ['c', 'Circle'], ['k', 'Counters'], ['n', 'Number line']].concat(mid ? [['g', 'Grid'], ['y', 'Symbols']] : []);
    var DO = [['share', 'Share'], ['split', 'Split']].concat(g5 ? [['join', 'Join']] : [], [['line', 'Line up'], ['fill', 'Fill wholes'], ['count', 'Count on']],
      g5 ? [['comb', 'Combine']] : [], mid ? [['groups', 'Groups of']] : [], g5 ? [['fit', 'Fit into']] : []);
    /* with many moves, the Do row shows one set at a time: Explore (show and change an amount) or Calculate (work with two amounts) */
    var CALC = { comb: 1, groups: 1, fit: 1 }, sets = DO.length > 7, dset = 'e', tset = 'f';
    root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray mp-fktray"></div>' +
      '<div class="mp-dmain"><div class="mp-cmode mp-fkwin" role="group" aria-label="See it as"><span>See it as</span>' + WINS.map(function (w) { return '<button type="button" data-w="' + w[0] + '">' + w[1] + '</button>'; }).join('') + '</div>' +
      '<div class="mp-cmode mp-fkdo" role="group" aria-label="Do"><span>Do</span>' + (sets ? '<span class="mp-fkseg" role="group" aria-label="Kind of move"><button type="button" data-set="e">Explore</button><button type="button" data-set="c">Calculate</button></span>' : '') +
      DO.map(function (d) { return '<button type="button" data-m="' + d[0] + '">' + d[1] + '</button>'; }).join('') + '</div>' +
      '<div class="mp-read" aria-live="polite"></div><div class="mp-mat mp-fkmat"><div class="mp-fkwins"></div><div class="mp-snaps"></div></div><p class="mp-live sr" aria-live="polite"></p></div></div>';
    var tray = qs('.mp-fktray', root), mat = qs('.mp-mat', root), wins = qs('.mp-fkwins', mat), read = qs('.mp-read', root), snapsEl = qs('.mp-snaps', mat);
    /* state: the amounts (rows of piece sizes, 1 = a whole) and how each row was made (decimal pieces, or a typed number),
       the row pieces go to, the move, the windows on, the amount before the last split, join or packing, the sharing story,
       the piece Count on uses, Combine or Take away, the number of groups, and the wholes to fit pieces into */
    var rows, tag, sel, mode, win, before, did, share, unit, op, grp, fitW, shown = false, hist = [], last = '';
    function fresh() {
      rows = [[]]; tag = [null]; sel = 0; mode = 'build'; win = { s: 1, c: 0, k: 0, n: 0, g: 0, y: 0 }; before = null; did = null;
      share = { n: 7, p: 2, dealt: 0, cut: false, thing: 'cookie' }; unit = 4; op = '+'; grp = 3; fitW = 3;
    }
    /* ---- fraction arithmetic ---- */
    function amount(row) {
      var L = 1, n = 0;
      row.forEach(function (d) { L = lcm(L, d); });
      row.forEach(function (d) { n += L / d; });
      return [n, L];
    }
    function simp(f) { var g = gcd(f[0], f[1]) || 1; return [f[0] / g, f[1] / g]; }
    function val(row) { var a = amount(row); return a[0] / a[1]; }
    function oneSize(row) { var s = row.filter(function (d, i) { return row.indexOf(d) === i; }); return s.length === 1 ? s[0] : 0; }
    /* a fraction written for the child: notation from Grade 3, words before */
    function frac(n, d) { return d === 1 ? fmt(n) : n + '/' + d; }
    function words(n, d) { return d === 1 ? n + (n === 1 ? ' whole' : ' wholes') : n + ' ' + (n === 1 ? fkName(d) : fkNames(d)); }
    function say(n, d) { return early ? words(n, d) : frac(n, d); }
    function mixed(n, d) {
      var w = Math.floor(n / d), r = n % d;
      if (!r) return fmt(w);
      return early ? w + ' and ' + words(r, d) : w + ' ' + r + '/' + d;
    }
    /* decimals: exact when the fraction ends, otherwise 3 places and "…"; a row of decimal pieces keeps its places (0.30) */
    function ends(d) { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; }
    function decStr(n, d) { var v = n / d; return ends(simp([n, d])[1]) ? String(+v.toFixed(6)) : (Math.floor(v * 1000 + 1e-9) / 1000).toFixed(3) + '…'; }
    function pctStr(n, d) { var v = n / d * 100; return ends(simp([n, d])[1]) ? String(+v.toFixed(4)) + '%' : (Math.floor(v * 10 + 1e-9) / 10).toFixed(1) + '…%'; }
    function isDec(r) { var row = rows[r]; return !!(tag[r] && tag[r].dec && row.length && row.every(function (d) { return d === 1 || fkPow(d); })); }
    function decLook(r) { return isDec(r) || !!(tag[r] && tag[r].t && !/\//.test(tag[r].t)); }
    function rowCol(row) { var p = row.filter(function (d) { return d !== 1; }); return fkCol(oneSize(row) || (p.length ? Math.min.apply(null, p) : 1)); }
    function places(row) { return row.reduce(function (p, d) { return Math.max(p, d === 1000 ? 3 : d === 100 ? 2 : d === 10 ? 1 : 0); }, 0); }
    function decRow(row) { return val(row).toFixed(places(row)); }
    function placeWords(row) {
      var t = Math.round(val(row) * 1000), w = Math.floor(t / 1000), parts = [];
      if (w) parts.push('<b>' + w + '</b> ' + (w === 1 ? 'whole' : 'wholes'));
      [[100, 'tenth'], [10, 'hundredth'], [1, 'thousandth']].forEach(function (p) { var k = Math.floor(t / p[0]) % 10; if (k) parts.push('<b>' + k + '</b> ' + p[1] + (k === 1 ? '' : 's')); });
      return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts.join('');
    }
    /* fractions are shown stacked (numerator over denominator); a hidden slash keeps them readable as "3/4" to screen readers */
    function stk(h) {
      return String(h).split(/(<[^>]*>)/).map(function (t) { return t.charAt(0) === '<' ? t : t.replace(/(\d+)\/(\d+)/g, '<span class="mp-fr"><b>$1</b><s class="sr">/</s><i>$2</i></span>'); }).join('');
    }
    function rowSay(row, r) {
      if (r != null && tag[r] && tag[r].t) return tag[r].t;
      if (r != null && isDec(r)) return decRow(row);
      var a = oneSize(row) ? [row.length, oneSize(row)] : simp(amount(row));
      return say(a[0], a[1]);
    }
    /* ---- what each move allows ---- */
    function multi() { return mode === 'line' || mode === 'comb'; }
    function allowed(k) {
      if (mode === 'share') return false;
      if (mode === 'groups' || mode === 'fit' || mode === 'comb') return k === 's' || k === 'n';
      return true;
    }
    function on(k) { return !!win[k] && allowed(k); }
    function cap() { return mode === 'count' && mid ? FK_BIG : FK_MAX; }
    function full(d, r) {
      var nv = val(rows[r]) + 1 / d;
      if (mode === 'fit') return nv > 1 + 1e-9 ? 'The piece to fit is 1 whole or less.' : fitW / nv > 120 ? 'Use a bigger piece.' : '';
      if (mode === 'groups') return grp * nv > FK_BIG + 1e-9 ? 'All the groups together make up to ' + FK_BIG + '.' : '';
      if (mode === 'comb' && op === '+' && rows.length > 1) return nv + val(rows[1 - r]) > FK_MAX + 1e-9 ? 'Together they make up to ' + FK_MAX + ' wholes.' : '';
      return nv > cap() + 1e-9 ? 'The mat holds up to ' + cap() + ' wholes.' : '';
    }
    /* ---- the tray ---- */
    function trayHtml() {
      if (mode === 'share') {
        return '<small>Things</small><div class="mp-fkstep" data-s="n"><button type="button" data-v="-1" aria-label="One fewer">&minus;</button><b>' + share.n + '</b><button type="button" data-v="1" aria-label="One more">+</button></div>' +
          '<small>People</small><div class="mp-fkstep" data-s="p"><button type="button" data-v="-1" aria-label="One fewer person">&minus;</button><b>' + share.p + '</b><button type="button" data-v="1" aria-label="One more person">+</button></div>' +
          '<small>Share</small><div class="mp-fkthings">' + Object.keys(FK_THING).map(function (t) { return '<button type="button" data-t="' + t + '" aria-pressed="' + (share.thing === t) + '">' + FK_THING[t][1].replace(/^./, function (c) { return c.toUpperCase(); }) + '</button>'; }).join('') + '</div>';
      }
      var tabs = DEC.length ? '<div class="mp-fktabs" role="group" aria-label="Pieces"><button type="button" data-ts="f" aria-pressed="' + (tset === 'f') + '">Fractions</button><button type="button" data-ts="d" aria-pressed="' + (tset === 'd') + '">Decimals</button></div>' : '<small>Pieces</small>';
      if (tset === 'd') return tabs + DEC.map(function (d) {
        return '<button type="button" class="mp-fkpc mp-fkdec" data-d="' + d + '" data-x="dec" aria-label="Add ' + (1 / d) + '"><i style="--c:' + fkCol(d) + ';--w:' + (d === 10 ? 12 : d === 100 ? 8 : 4) + 'px"></i><b>' + (1 / d) + '</b></button>';
      }).join('');
      return tabs + FD.map(function (d) {
        return '<button type="button" class="mp-fkpc" data-d="' + d + '" aria-label="Add ' + (d === 1 ? '1 whole' : '1 ' + fkName(d)) + '"' + (mode === 'count' && d === unit ? ' aria-pressed="true"' : '') + '><i style="--c:' + fkCol(d) + ';--w:' + (d === 1 ? 100 : Math.max(10, Math.round(100 / d))) + 'px"></i><b>' + (d === 1 ? '1' : early ? fkName(d) : '1/' + d) + '</b></button>';
      }).join('');
    }
    /* ---- drawing the windows ---- */
    function combRes() {
      if (rows.length < 2 || !rows[0].length || !rows[1].length) return null;
      var a = oneSize(rows[0]), b = oneSize(rows[1]);
      if (!a || a !== b) return null;
      var n = op === '+' ? rows[0].length + rows[1].length : rows[0].length - rows[1].length;
      return n < 0 ? null : { n: n, d: a };
    }
    function span() {
      var m = 1;
      rows.forEach(function (r) { m = Math.max(m, Math.ceil(val(r) - 1e-9)); });
      if (before) m = Math.max(m, Math.ceil(val(before) - 1e-9));
      var c = mode === 'comb' && combRes();
      if (c) m = Math.max(m, Math.ceil(c.n / c.d - 1e-9));
      return Math.min(FK_BIG, m);
    }
    function width() { return Math.max(240, Math.min(680, (mat.clientWidth || 700) - 40)); }
    function pieceLabel(d, px, dec) {
      if (d === 1) return px > 70 ? '1 whole' : '1';
      var t = dec && fkPow(d) ? String(1 / d) : early ? fkName(d) : '1/' + d;
      return px >= (/\//.test(t) ? t.length * 5 + 14 : t.length * 9 + 10) ? stk(t) : '';
    }
    function stripRow(row, r, S, W, still, dec) {
      var x = 0, h = '', one = oneSize(row), v = val(row);
      row.forEach(function (d, i) {
        var w = 1 / d / S;
        h += '<' + (still ? 'i' : 'button type="button"') + ' class="mp-fkp' + (w * W < 8 ? ' tiny' : '') + '" data-r="' + r + '" data-i="' + i + '" style="left:' + (x * 100) + '%;width:' + (w * 100) + '%;--c:' + fkCol(d) + '"' + (still ? '' : ' aria-label="' + (d === 1 ? '1 whole' : '1 ' + fkName(d)) + ', tap to take it off"') + '>' + pieceLabel(d, w * W, dec) + '</' + (still ? 'i' : 'button') + '>';
        x += w;
      });
      if (one && one > 1 && one <= FK_TOP) {
        var end = Math.max(1, Math.ceil(v - 1e-9)), k = row.length;
        for (; k < one * end && k < one * S; k++) h += '<i class="mp-fkg" style="left:' + (k / one / S * 100) + '%;width:' + (100 / one / S) + '%"></i>';
      }
      return h;
    }
    function wholeBar(S, W) {
      var h = '<div class="mp-fktrack mp-fkwhole">';
      for (var i = 0; i < S; i++) h += '<i class="mp-fkp" style="left:' + (i / S * 100) + '%;width:' + (100 / S) + '%;--c:' + fkCol(1) + '">' + pieceLabel(1, W / S) + '</i>';
      return h + '</div>';
    }
    function strips(W) {
      var S = span(), h = '<div class="mp-fkw mp-fks"><div class="mp-fkwl">Strips</div>' + wholeBar(S, W);
      if (before) h += '<div class="mp-fkwl">' + (did && did.k ? 'Before' : did && did.j ? 'Before' : 'Before packing') + '</div><div class="mp-fktrack mp-fkbefore">' + stripRow(before, -1, S, W, true, isDec(sel)) + '</div><div class="mp-fkwl">' + (did && did.k ? 'Each piece cut into ' + did.k : did && did.j ? 'Every ' + did.j + ' pieces joined' : 'Packed into wholes') + '</div>';
      rows.forEach(function (row, r) {
        if (mode === 'comb' && r === 1) h += '<div class="mp-fkwl">' + (op === '+' ? 'Add' : 'Take away') + '</div>';
        h += '<div class="mp-fktrack mp-fkrow' + (rows.length > 1 && r === sel ? ' sel' : '') + '" data-r="' + r + '"' + '>' + stripRow(row, r, S, W, false, decLook(r)) +
          (!row.length ? '<span class="mp-fkempty">' + (rows.length > 1 ? 'Tap a piece to fill this row' : 'Tap or drag a piece') + '</span>' : '') + '</div>';
      });
      if (mode === 'comb' && rows.length > 1 && rows[0].length && rows[1].length) {
        var c = combRes(), out = [];
        if (c) { for (var i = 0; i < c.n; i++) out.push(c.d); h += '<div class="mp-fkwl">' + (op === '+' ? 'Together' : 'What is left') + '</div><div class="mp-fktrack mp-fkres">' + stripRow(out, -2, S, W, true) + '</div>'; }
        else h += '<p class="mp-fknote">' + (oneSize(rows[0]) && oneSize(rows[0]) === oneSize(rows[1]) ? 'There is not enough to take that away.' : 'The pieces are different sizes.') + '</p>';
      }
      if (before && rows[0].length) h += '<i class="mp-fkvl" style="left:' + (val(rows[0]) / S * 100) + '%"></i>';
      return h + '</div>';
    }
    function groupsHtml(W) {
      var row = rows[0], v = val(row), S1 = Math.max(1, Math.ceil(v - 1e-9)), per = Math.min(grp, 5), bw = Math.floor((W - (per - 1) * 12) / per) - 24;
      var h = '<div class="mp-fkw mp-fks"><div class="mp-fkwl">Strips</div><div class="mp-fkgrps" style="--per:' + per + '">';
      for (var i = 0; i < grp; i++) {
        h += '<div class="mp-fkbox"><div class="mp-fkwl">Group ' + (i + 1) + '</div><div class="mp-fktrack' + (i ? '' : ' mp-fkrow') + '" data-r="0">' + stripRow(row, i ? -1 : 0, S1, bw, !!i) +
          (!row.length && !i ? '<span class="mp-fkempty">Make one group</span>' : '') + '</div></div>';
      }
      h += '</div>';
      if (row.length) {
        var all = [], St = Math.min(FK_BIG, Math.max(1, Math.ceil(grp * v - 1e-9)));
        for (i = 0; i < grp; i++) all = all.concat(row);
        h += '<div class="mp-fkwl">All together</div>' + wholeBar(St, W) + '<div class="mp-fktrack mp-fkres">' + stripRow(all, -2, St, W, true) + '</div>';
      }
      return h + '</div>';
    }
    function fitParts() {
      var row = rows[0], v = val(row);
      if (!row.length || v > 1 + 1e-9) return null;
      var f = oneSize(row) ? [row.length, oneSize(row)] : simp(amount(row)), q = Math.floor(fitW / v + 1e-9);
      return { f: f, v: v, q: q, rest: simp([fitW * f[1] - q * f[0], f[0]]) };
    }
    function fitHtml(W) {
      var S = fitW, h = '<div class="mp-fkw mp-fks"><div class="mp-fkwl">Strips</div>' + wholeBar(S, W);
      h += '<div class="mp-fkwl">The piece to fit</div><div class="mp-fktrack mp-fkrow" data-r="0">' + stripRow(rows[0], 0, S, W) + (!rows[0].length ? '<span class="mp-fkempty">Tap a piece</span>' : '') + '</div>';
      var p = fitParts();
      if (p) {
        var bw = p.v / S, c = rowCol(rows[0]), t = '', n = '';
        for (var i = 0; i < p.q; i++) {
          t += '<i class="mp-fkp mp-fkcopy' + (i % 2 ? ' odd' : '') + '" style="left:' + (i * bw * 100) + '%;width:' + (bw * 100) + '%;--c:' + c + '"></i>';
          if (bw * W >= 16) n += '<span style="left:' + ((i + 0.5) * bw * 100) + '%">' + (i + 1) + '</span>';
        }
        if (p.rest[0]) t += '<i class="mp-fkg mp-fkpart" style="left:' + (p.q * bw * 100) + '%;width:' + ((1 - p.q * bw) * 100) + '%"></i>';
        h += '<div class="mp-fkwl">How many fit</div><div class="mp-fktrack mp-fkres">' + t + '</div><div class="mp-fkcnt">' + n + '</div>';
      } else if (rows[0].length) h += '<p class="mp-fknote">Make a piece of 1 whole or less.</p>';
      return h + '</div>';
    }
    function sector(a0, a1, R) {
      var p0 = a0 * 2 * Math.PI - Math.PI / 2, p1 = a1 * 2 * Math.PI - Math.PI / 2, big = a1 - a0 > 0.5 ? 1 : 0;
      if (a1 - a0 >= 0.9999) return '<circle r="' + R + '"/>';
      return '<path d="M0 0L' + (R * Math.cos(p0)).toFixed(2) + ' ' + (R * Math.sin(p0)).toFixed(2) + 'A' + R + ' ' + R + ' 0 ' + big + ' 1 ' + (R * Math.cos(p1)).toFixed(2) + ' ' + (R * Math.sin(p1)).toFixed(2) + 'Z"/>';
    }
    function circles(R) {
      var h = '<div class="mp-fkw mp-fkc"><div class="mp-fkwl">Circle</div><div class="mp-fkcs">';
      rows.forEach(function (row) {
        var v = val(row), n = Math.max(1, Math.ceil(v - 1e-9)), one = oneSize(row);
        h += '<div class="mp-fkcg">';
        for (var c = 0; c < n; c++) {
          var s = '', x = 0;
          row.forEach(function (d) {
            var a = Math.max(x, c), b = Math.min(x + 1 / d, c + 1);
            if (b - a > 1e-9) s += '<g style="fill:' + fkCol(d) + '">' + sector(a - c, b - c, R) + '</g>';
            x += 1 / d;
          });
          var cut = '';
          if (one > 1 && one <= FK_TOP) for (var k = 0; k < one; k++) { var p = k / one * 2 * Math.PI - Math.PI / 2; cut += '<path d="M0 0L' + (R * Math.cos(p)).toFixed(2) + ' ' + (R * Math.sin(p)).toFixed(2) + '"/>'; }
          h += '<svg viewBox="' + (-R - 4) + ' ' + (-R - 4) + ' ' + (2 * R + 8) + ' ' + (2 * R + 8) + '" width="' + (2 * R + 8) + '" height="' + (2 * R + 8) + '" aria-hidden="true"><circle class="mp-fkcb" r="' + R + '"/>' + s + '<g class="mp-fkcut">' + cut + '</g><circle class="mp-fkco" r="' + R + '"/></svg>';
        }
        h += '</div>';
      });
      return h + '</div></div>';
    }
    function counters() {
      var h = '<div class="mp-fkw mp-fkk"><div class="mp-fkwl">Counters</div><div class="mp-fkks">';
      rows.forEach(function (row) {
        var d = oneSize(row);
        if (!d || d === 1 || d > FK_TOP) { h += '<p class="mp-fknote">' + (row.length ? 'Counters show pieces of one size.' : '') + '</p>'; return; }
        var g = Math.ceil(12 / d), sets = Math.max(1, Math.ceil(row.length / d)), s = '';
        for (var k = 0; k < sets * d; k++) {
          s += '<span class="mp-fkgrp' + (k < row.length ? ' on' : '') + '"' + (k % d === 0 && k ? ' data-new="1"' : '') + ' style="--c:' + fkCol(d) + ';--kc:' + (g <= 3 ? g : Math.ceil(g / 2)) + '">' + new Array(g + 1).join('<i></i>') + '</span>';
        }
        h += '<div class="mp-fkset">' + s + '</div>';
      });
      return h + '</div></div>';
    }
    /* the 10 by 10 grid: whole columns are tenths, single squares hundredths, and a sliver of a square thousandths */
    function gridSvg(part, G) {
      var c = G / 10, h100 = part * 100, fullN = Math.floor(h100 + 1e-6), sl = h100 - fullN, tens = Math.floor(fullN / 10) * 10, s = '';
      for (var i = 0; i < 100; i++) {
        var x = Math.floor(i / 10) * c, y = (i % 10) * c;
        s += '<rect class="' + (i < tens ? 'mp-fkg1' : i < fullN ? 'mp-fkg2' : 'mp-fkg0') + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + c.toFixed(1) + '" height="' + c.toFixed(1) + '"/>';
      }
      if (sl > 1e-6) {
        var X = Math.floor(fullN / 10) * c, Y = (fullN % 10) * c;
        s += '<rect class="mp-fkg3" x="' + X.toFixed(1) + '" y="' + Y.toFixed(1) + '" width="' + (c * sl).toFixed(1) + '" height="' + c.toFixed(1) + '"/>' + (g6 ? '<rect class="mp-fkgz" x="' + X.toFixed(1) + '" y="' + Y.toFixed(1) + '" width="' + c.toFixed(1) + '" height="' + c.toFixed(1) + '"/>' : '');
      }
      return '<svg class="mp-fkgrid" width="' + (G + 4) + '" height="' + (G + 4) + '" viewBox="-2 -2 ' + (G + 4) + ' ' + (G + 4) + '" aria-hidden="true">' + s + '<rect class="mp-fkgo" width="' + G + '" height="' + G + '"/></svg>';
    }
    function zoomSvg(sl, Z) {
      var s = '', w = Z / 10;
      for (var i = 0; i < 10; i++) s += '<rect class="' + (i + 1 <= sl * 10 + 1e-6 ? 'mp-fkg3' : 'mp-fkg0') + '" x="' + (i * w).toFixed(1) + '" y="0" width="' + w.toFixed(1) + '" height="' + Z + '"/>';
      var rest = sl * 10 - Math.floor(sl * 10 + 1e-6);
      if (rest > 1e-6) s += '<rect class="mp-fkg3" x="' + (Math.floor(sl * 10 + 1e-6) * w).toFixed(1) + '" y="0" width="' + (rest * w).toFixed(1) + '" height="' + Z + '"/>';
      return '<svg class="mp-fkgrid" width="' + (Z + 4) + '" height="' + (Z + 4) + '" viewBox="-2 -2 ' + (Z + 4) + ' ' + (Z + 4) + '" aria-hidden="true">' + s + '<rect class="mp-fkgo" width="' + Z + '" height="' + Z + '"/></svg>';
    }
    function grids(G) {
      var h = '<div class="mp-fkw mp-fkgw"><div class="mp-fkwl">Grid</div><div class="mp-fkgs">';
      rows.forEach(function (row, r) {
        if (!row.length && rows.length > 1) return;
        var v = val(row), n = Math.max(1, Math.ceil(v - 1e-9)), zoom = 0;
        h += '<figure class="mp-fkgf">' + (shown && rows.length > 1 ? '<figcaption>' + stk(rowSay(row, r)) + '</figcaption>' : '') + '<div>';
        for (var i = 0; i < n; i++) {
          var part = Math.min(1, Math.max(0, v - i)), sl = part * 100 - Math.floor(part * 100 + 1e-6);
          h += gridSvg(part, G);
          if (sl > 1e-6) zoom = sl;
        }
        if (zoom && g6 && rows.length === 1) h += '<div class="mp-fkzoom"><span>One hundredth, zoomed in</span>' + zoomSvg(zoom, Math.round(G * 0.7)) + '</div>';
        h += '</div></figure>';
      });
      return h + '</div></div>';
    }
    /* the same amount in every way of writing it */
    function forms(row, r) {
      var f = simp(amount(row)), one = oneSize(row), out = [], seen = {};
      function put(t, lab) { if (!seen[t]) { seen[t] = 1; out.push([t, lab]); } }
      if (isDec(r)) put(decRow(row), 'decimal');
      else if (one && one > 1) put(frac(row.length, one), fkNames(one));
      put(frac(f[0], f[1]), f[1] === 1 ? 'whole number' : 'simplest');
      var P = [10, 100, 1000].filter(function (p) { return p % f[1] === 0; })[0];
      if (P && f[1] > 1) put(frac(f[0] * P / f[1], P), fkNames(P));
      if (f[0] > f[1] && f[1] > 1) put(mixed(f[0], f[1]), 'mixed number');
      put(decStr(f[0], f[1]), 'decimal');
      if (g5) put(pctStr(f[0], f[1]), 'percent');
      return out;
    }
    function symbols() {
      var h = '<div class="mp-fkw mp-fky"><div class="mp-fkwl">Symbols</div>';
      if (!shown) return h + '<p class="mp-fknote">Turn on Show number to see the symbols.</p></div>';
      var any = false;
      rows.forEach(function (row, r) {
        if (!row.length) return;
        any = true;
        h += '<div class="mp-fksym">' + forms(row, r).map(function (t, i) { return (i ? '<em>=</em>' : '') + '<span><b>' + stk(t[0]) + '</b><small>' + t[1] + '</small></span>'; }).join('') + '</div>';
      });
      return h + (any ? '' : '<p class="mp-fknote">Add pieces to see the symbols.</p>') + '</div>';
    }
    function nline(W) {
      var S = span(), L = 1, top = 0, pad = 16, hops = [], pts = [], v0, p;
      rows.forEach(function (row) { row.forEach(function (d) { L = lcm(L, d); }); });
      function run(row, from, dir, col) { var at = from; row.forEach(function (d) { hops.push([at, at + dir / d, col || fkCol(d)]); at += dir / d; }); return at; }
      if (mode === 'groups') {
        v0 = val(rows[0]); S = Math.min(FK_BIG, Math.max(1, Math.ceil(grp * v0 - 1e-9)));
        if (rows[0].length) { for (var i = 0; i < grp; i++) hops.push([i * v0, (i + 1) * v0, 'var(--accent,#0b6e78)']); pts.push([grp * v0]); }
      } else if (mode === 'fit') {
        S = fitW; p = fitParts();
        if (p) { for (i = 0; i < p.q; i++) hops.push([i * p.v, (i + 1) * p.v, rowCol(rows[0])]); if (p.rest[0]) hops.push([p.q * p.v, fitW, rowCol(rows[0]), 1]); pts.push([fitW]); }
      } else if (mode === 'comb' && rows.length > 1) {
        v0 = run(rows[0], 0, 1);
        if (rows[1].length) { var end = run(rows[1], v0, op === '+' ? 1 : -1); if (combRes()) pts.push([end]); else hops = hops.filter(function (q) { return q[1] >= -1e-9; }); }
        else if (rows[0].length) pts.push([v0]);
      } else {
        rows.forEach(function (row, r) {
          if (rows.length === 1 && row.length <= 40) run(row, 0, 1);
          if (row.length) pts.push([val(row), rows.length > 1 ? rowCol(row) : null, shown && rows.length > 1 ? rowSay(row, r) : '']);
        });
      }
      if (mode === 'groups' || mode === 'fit') { L = 1; rows[0].forEach(function (d) { L = lcm(L, d); }); }
      if (L > FK_TOP || (W - 2 * pad) / S / L < 7) L = (W - 2 * pad) / S / 10 >= 7 && L % 10 === 0 ? 10 : 1;
      var x = function (v) { return pad + v / S * (W - 2 * pad); }, labs = pts.filter(function (q) { return q[2]; });
      /* labels for amounts lined up sit on up to 4 levels so they do not overlap */
      var lv = [], used = [];
      labs.slice().sort(function (a, b) { return a[0] - b[0]; }).forEach(function (q) {
        var k = 0, px = x(q[0]), wd = q[2].length * 9 + 10;
        while (used[k] != null && px - wd / 2 < used[k] + 4 && k < 3) k++;
        lv.push([q, k]); used[k] = px + wd / 2;
      });
      top = labs.length ? 16 * (1 + Math.max.apply(null, lv.map(function (z) { return z[1]; }).concat(0))) : 0;
      var H = 92 + top, s = '<svg class="mp-fknl" width="' + W + '" height="' + H + '" viewBox="0 ' + (-top) + ' ' + W + ' ' + H + '" aria-hidden="true"><line class="mp-fkax" x1="' + x(0) + '" y1="60" x2="' + x(S) + '" y2="60"/>';
      for (i = 0; i <= S * L; i++) {
        var big = i % L === 0;
        s += '<line class="' + (big ? 'mp-fkt1' : 'mp-fkt2') + '" x1="' + x(i / L) + '" y1="' + (big ? 48 : 53) + '" x2="' + x(i / L) + '" y2="' + (big ? 72 : 67) + '"/>';
        if (big) s += '<text x="' + x(i / L) + '" y="89">' + (i / L) + '</text>';
      }
      hops.forEach(function (q) { var a = x(q[0]), b = x(q[1]); s += '<path class="mp-fkhop' + (q[3] ? ' part' : '') + '" style="stroke:' + q[2] + '" d="M' + a + ' 54Q' + ((a + b) / 2) + ' ' + (54 - Math.min(36, Math.abs(b - a) * 0.7)) + ' ' + b + ' 54"/>'; });
      pts.forEach(function (q) { s += '<circle class="mp-fkpt" cx="' + x(q[0]) + '" cy="60" r="10" style="fill:' + (q[1] || 'var(--accent,#0b6e78)') + '"/>'; });
      lv.forEach(function (z) { var q = z[0]; s += '<text class="mp-fkpl" x="' + x(q[0]) + '" y="' + (36 - z[1] * 16) + '" style="fill:' + q[1] + '">' + q[2] + '</text>'; });
      return '<div class="mp-fkw mp-fkn"><div class="mp-fkwl">Number line</div>' + s + '</svg></div>';
    }
    /* ---- sharing ---- */
    function thingSvg(t, part) {
      var body = t === 'pizza' ? '<circle r="26" fill="#e9b65a"/><circle r="21" fill="#c8432b"/><g fill="#f3d27a"><circle cx="-8" cy="-9" r="5"/><circle cx="9" cy="-4" r="5"/><circle cx="-2" cy="11" r="5"/></g><g fill="#7a1f12"><circle cx="5" cy="9" r="3"/><circle cx="-12" cy="3" r="3"/></g>'
        : t === 'pie' ? '<circle r="26" fill="#c98b3c"/><circle r="20" fill="#7b2a3b"/><path d="M-18 -8h36M-20 3h40M-15 13h30M-8 -18v36M3 -20v40M13 -15v30" stroke="#e8b46a" stroke-width="3.5" stroke-linecap="round"/>'
        : '<circle r="26" fill="#d9a35b" stroke="#a8742f" stroke-width="3"/><g fill="#5b3a1a"><circle cx="-9" cy="-8" r="3.5"/><circle cx="8" cy="-4" r="3.5"/><circle cx="-2" cy="10" r="3.5"/><circle cx="12" cy="11" r="2.5"/></g>';
      var clip = part ? ' clip-path="url(#fkcut' + T.uid + '-' + part + ')"' : '';
      return '<svg class="mp-fkthing" viewBox="-30 -30 60 60" aria-hidden="true"><g' + clip + '>' + body + '</g>' + (part ? '<g class="mp-fkedge"' + clip + '><circle r="26" fill="none"/></g>' : '') + '</svg>';
    }
    function shareParts() {
      var each = Math.floor(share.dealt / share.p), left = share.n - share.dealt;
      return { each: each, left: left, cut: share.cut ? left : 0 };
    }
    function shareHtml() {
      var s = shareParts(), p = share.p, h = '<svg width="0" height="0" class="mp-fkdefs" aria-hidden="true"><defs><clipPath id="fkcut' + T.uid + '-' + p + '"><path d="M0 0L0 -30A30 30 0 ' + (p === 1 ? 1 : 0) + ' 1 ' + (30 * Math.sin(2 * Math.PI / p)).toFixed(2) + ' ' + (-30 * Math.cos(2 * Math.PI / p)).toFixed(2) + 'Z"/></clipPath></defs></svg>';
      var pile = s.cut ? 0 : s.left;
      h += '<div class="mp-fkpile' + (pile ? '' : ' none') + '"><span>' + (pile ? (shown ? pile + ' to share' : 'To share') : '') + '</span><div>' + new Array(pile + 1).join(thingSvg(share.thing)) + '</div></div><div class="mp-fkplates">';
      for (var i = 0; i < p; i++) {
        var items = new Array(s.each + 1).join(thingSvg(share.thing)) + new Array(s.cut + 1).join(thingSvg(share.thing, p));
        h += '<div class="mp-fkplate"><div>' + items + '</div>' + (shown && (s.each || s.cut) ? '<b>' + shareSay(s) + '</b>' : '') + '</div>';
      }
      return h + '</div>';
    }
    function shareSay(s) {
      var f = simp([s.cut, share.p]);
      if (!s.cut) return fmt(s.each);
      if (!s.each) return say(f[0], f[1]);
      return early ? s.each + ' and ' + words(f[0], f[1]) : s.each + ' ' + f[0] + '/' + f[1];
    }
    /* ---- one redraw of everything ---- */
    function draw() {
      tray.innerHTML = stk(trayHtml());
      tray.classList.toggle('mp-fkshare', mode === 'share');
      readout();
      var W = width();
      if (mode === 'share') wins.innerHTML = shareHtml();
      else {
        var any = WINS.some(function (w) { return on(w[0]); }), sOn = on('s') || !any;
        /* fit every window on the mat: draw at full size, then make strips thinner, circles and grids smaller and counters
           tighter, step by step, until it all fits (a very full mat may still scroll) */
        var midOn = on('c') || on('k') || on('g'), nc = rows.reduce(function (t, r) { return t + Math.max(1, Math.ceil(val(r) - 1e-9)); }, 0);
        var cs = getComputedStyle(mat), room = mat.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        var R0 = Math.max(30, Math.floor(Math.min(74, ((W - (on('k') ? 240 : 0) - (on('g') ? 220 : 0)) / nc - 36) / 2))), th0 = W < 500 ? 42 : 52;
        var G0 = Math.max(90, Math.min(200, Math.floor((on('c') || on('k') ? W / 2 : W) / Math.min(nc, 4)) - 24));
        wins.style.setProperty('--fkw', W + 'px');
        for (var lv = 0; lv < 8; lv++) {
          wins.style.setProperty('--fkh', Math.max(30, th0 - lv * 4) + 'px');
          wins.style.setProperty('--kd', Math.max(10, 18 - lv * 1.5) + 'px');
          wins.style.setProperty('--fkg', Math.max(8, 18 - lv * 2) + 'px');
          wins.classList.toggle('tight', lv >= 3);
          wins.classList.toggle('tighter', lv >= 5);
          var sh = mode === 'groups' ? groupsHtml(W) : mode === 'fit' ? fitHtml(W) : strips(W);
          wins.innerHTML = (sOn ? sh : '') +
            (midOn ? '<div class="mp-fkmid">' + (on('c') ? circles(Math.max(24, Math.round(R0 * (1 - lv * 0.1)))) : '') + (on('k') ? counters() : '') + (on('g') ? grids(Math.max(70, Math.round(G0 * (1 - lv * 0.08)))) : '') + '</div>' : '') +
            (on('n') ? nline(W) : '') + (on('y') ? symbols() : '');
          if (!room || wins.offsetHeight <= room) break;
        }
      }
      wins.style.setProperty('--fkw', W + 'px');
      qsa('.mp-fkwin button', root).forEach(function (b) { var k = b.getAttribute('data-w'); b.setAttribute('aria-pressed', String(on(k))); b.disabled = !allowed(k); });
      if (CALC[mode]) dset = 'c';
      qsa('.mp-fkdo [data-m]', root).forEach(function (b) { var m = b.getAttribute('data-m'); b.setAttribute('aria-pressed', String(m === mode)); b.hidden = sets && (dset === 'c') !== !!CALC[m]; });
      qsa('.mp-fkdo [data-set]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set') === dset)); });
      snaps();
    }
    function readout() {
      if (!shown) { read.innerHTML = ''; return; }
      var filled = rows.filter(function (r) { return r.length; }), row = filled.length === 1 ? filled[0] : rows[0], ri = rows.indexOf(row);
      var big = '', eq = '', one = oneSize(row), a = amount(row), f = simp(a), wh = row.filter(function (d) { return d === 1; }).length, rest = row.filter(function (d) { return d !== 1; });
      var nd = one ? [row.length, one] : f;
      if (mode === 'share') {
        var s = shareParts(), th = FK_THING[share.thing];
        if (!share.dealt && !s.cut) eq = '<b>' + share.n + '</b> ' + th[share.n === 1 ? 0 : 1] + ' to share by <b>' + share.p + '</b>';
        else if (s.left && !s.cut) { big = s.each + ' each so far'; eq = '<b>' + s.left + '</b> left over' + (s.left < share.p ? ': not enough for one each' : ''); }
        else { big = shareSay(s) + ' each'; eq = '<b>' + share.n + '</b> ' + th[share.n === 1 ? 0 : 1] + ' shared by <b>' + share.p + '</b>: ' + (s.each ? '<b>' + s.each + '</b> each' : 'none whole') + (s.cut ? ', and ' + (s.cut === 1 ? 'the last one is' : 'the last ' + s.cut + ' are') + ' cut into <b>' + share.p + '</b>' : ', none left over'); }
      } else if (mode === 'groups') {
        if (!row.length) eq = 'Make one group with the pieces';
        else {
          var tn = grp * nd[0], td = nd[1];
          big = grp + ' &times; ' + say(nd[0], td) + ' = ' + say(tn, td) + (td > 1 && tn % td === 0 ? ' = ' + fmt(tn / td) : td > 1 && tn > td ? ' = ' + mixed(tn, td) : '');
          eq = nd[0] === 1 && grp <= 6 && grp > 1 ? new Array(grp + 1).join('+' + say(1, td)).slice(1).replace(/\+/g, ' + ') + ' = <b>' + say(tn, td) + '</b>'
            : '<b>' + grp + '</b> ' + (grp === 1 ? 'group' : 'groups') + ' of <b>' + words(nd[0], td) + '</b> is <b>' + words(tn, td) + '</b>' + (td > 1 && tn >= td ? ', and <b>' + words(td, td) + '</b> make 1 whole' : '');
        }
      } else if (mode === 'fit') {
        var p = fitParts();
        if (!row.length) eq = 'Make the piece to fit into <b>' + pl(fitW, 'whole', 'wholes') + '</b>';
        else if (!p) eq = 'The piece to fit is <b>1 whole</b> or less';
        else {
          var P = say(p.f[0], p.f[1]), Q = simp([fitW * p.f[1], p.f[0]]);
          big = fitW + ' &divide; ' + P + ' = ' + (Q[1] === 1 ? fmt(Q[0]) : mixed(Q[0], Q[1]));
          if (p.f[0] === 1 && p.f[1] > 1) eq = '<b>' + words(p.f[1], p.f[1]) + '</b> fit in each whole, and there ' + (fitW === 1 ? 'is <b>1</b> whole' : 'are <b>' + fitW + '</b> wholes');
          else if (!p.rest[0]) eq = '<b>' + P + '</b> fits into <b>' + fitW + '</b> exactly <b>' + p.q + '</b> ' + (p.q === 1 ? 'time' : 'times');
          else eq = '<b>' + P + '</b> fits <b>' + p.q + '</b> ' + (p.q === 1 ? 'time' : 'times') + ', and <b>' + say(p.rest[0], p.rest[1]) + '</b> of another one fits in what is left';
        }
      } else if (mode === 'comb' && rows.length > 1) {
        var A = rows[0], B = rows[1], c = combRes(), sign = op === '+' ? ' + ' : ' &minus; ';
        if (!A.length) eq = 'Make the first amount';
        else if (!B.length) { big = rowSay(A, 0); eq = 'Now make the amount to ' + (op === '+' ? 'add' : 'take away'); }
        else if (c) {
          big = say(A.length, c.d) + sign + say(B.length, c.d) + ' = ' + say(c.n, c.d);
          var cf = simp([c.n, c.d]);
          if (c.d > 1 && c.n >= c.d) big += ' = ' + mixed(c.n, c.d); else if (c.d > 1 && cf[1] !== c.d && c.n) big += ' = ' + say(cf[0], cf[1]);
          eq = (did && did.same ? 'cut into <b>' + fkNames(c.d) + '</b>, then count: ' : 'same-size pieces, so count them: ') + '<b>' + words(A.length, c.d) + '</b> ' + (op === '+' ? 'and' : 'take away') + ' <b>' + words(B.length, c.d) + '</b>';
        } else if (oneSize(A) && oneSize(A) === oneSize(B)) { big = rowSay(A, 0) + sign + rowSay(B, 1); eq = 'there is not enough to take that away'; }
        else { big = rowSay(A, 0) + sign + rowSay(B, 1) + ' = ?'; eq = 'the pieces are <b>different sizes</b>, so they cannot be counted together yet'; }
      } else if (mode === 'line' && filled.length > 1) {
        var fl = rows.map(function (r, i) { return { i: i, v: val(r), t: rowSay(r, i) }; }).filter(function (q) { return rows[q.i].length; });
        if (fl.length === 2) {
          var X = fl[0], Y = fl[1], same = Math.abs(X.v - Y.v) < 1e-9;
          big = X.t + (same ? ' = ' : X.v > Y.v ? ' &gt; ' : ' &lt; ') + Y.t;
          eq = same ? 'the same length: <b>equal' + (isDec(X.i) || isDec(Y.i) || tag[X.i] || tag[Y.i] ? ' amounts' : ' fractions') + '</b>' : '<b>' + (X.v > Y.v ? X.t : Y.t) + '</b> is longer' + (oneSize(rows[X.i]) && oneSize(rows[Y.i]) && rows[X.i].length === rows[Y.i].length && rows[X.i].length && !tag[X.i] && !tag[Y.i] ? ': ' + (oneSize(rows[X.i]) < oneSize(rows[Y.i]) ? 'fewer' : 'more') + ' people sharing means ' + (X.v > Y.v ? 'bigger' : 'smaller') + ' pieces' : '');
        } else {
          fl.sort(function (p, q) { return p.v - q.v; });
          big = fl.map(function (q) { return q.t; }).reduce(function (s, t, i) { return i ? s + (Math.abs(fl[i].v - fl[i - 1].v) < 1e-9 ? ' = ' : ' &lt; ') + t : t; }, '');
          eq = 'from shortest to longest';
        }
      } else if (did && (did.k || did.j) && before) {
        var bo = oneSize(before), k = did.k || did.j, dec = isDec(sel);
        big = (dec ? decRow(before) : say(before.length, bo)) + ' = ' + (dec ? decRow(row) : say(row.length, one));
        eq = did.k ? 'same length: <b>' + FK_TIMES[k][0] + '</b> as many pieces, each <b>' + FK_TIMES[k][1] + '</b> the size'
          : 'same length: <b>' + (k === 2 ? 'half' : FK_TIMES[k][1].replace(/ of$/, '')) + '</b> as many pieces, each <b>' + FK_TIMES[k][0] + '</b> the size' + (one > 1 && gcd(row.length, one) === 1 ? '. <b>Simplest form</b>: they cannot be joined evenly any more' : '');
      } else if (did && did.fill && before) {
        var bf = oneSize(before), ba = amount(before);
        big = (bf ? say(before.length, bf) : say(simp(ba)[0], simp(ba)[1])) + ' = ' + (rest.length ? (early ? wh + ' and ' + rowSay(rest) : wh + ' ' + rowSay(rest)) : fmt(wh));
        eq = (bf && bf > 1 ? '<b>' + words(bf, bf) + '</b> make 1 whole' : 'the pieces fill <b>' + pl(wh, 'whole', 'wholes') + '</b>') + (rest.length ? ', and <b>' + (oneSize(rest) ? words(rest.length, oneSize(rest)) : rowSay(rest)) + '</b> ' + (rest.length === 1 ? 'is' : 'are') + ' left' : '');
      } else if (did && did.brk && before) {
        big = (function () { var w2 = before.filter(function (d) { return d === 1; }).length, r2 = before.filter(function (d) { return d !== 1; }); return r2.length ? (early ? w2 + ' and ' + rowSay(r2) : w2 + ' ' + rowSay(r2)) : fmt(w2); })() + ' = ' + rowSay(row);
        eq = 'each whole is <b>' + words(did.brk, did.brk) + '</b>';
      } else if (row.length && (isDec(ri) || (tag[ri] && tag[ri].t))) {
        big = rowSay(row, ri);
        eq = row.every(function (d) { return d === 1 || fkPow(d); }) ? placeWords(row) : '';
      } else if (wh && rest.length && mode !== 'count') {
        var rf = oneSize(rest) ? [rest.length, oneSize(rest)] : simp(amount(rest));
        big = (early ? wh + ' and ' + say(rf[0], rf[1]) : wh + ' ' + frac(rf[0], rf[1])) + (early || rf[0] >= rf[1] ? '' : ' = ' + frac(f[0], f[1]));
        eq = '<b>' + pl(wh, 'whole', 'wholes') + '</b> and <b>' + words(rf[0], rf[1]) + '</b>';
      } else if (row.length) {
        if (one) {
          var n = row.length, d = one;
          big = say(n, d) + (d > 1 && n >= d ? ' = ' + mixed(n, d) : '');
          if (mode === 'count') eq = n > 8 && d > 1 ? '<b>' + words(d, d) + '</b> make each whole' + (n % d === 0 ? ', so <b>' + words(n, d) + '</b> make <b>' + fmt(n / d) + '</b>' : '')
            : n > 1 ? new Array(n + 1).join('+' + say(1, d)).slice(1).replace(/\+/g, ' + ') + ' = <b>' + say(n, d) + '</b>' : 'count on by <b>' + say(1, d) + '</b>';
          else if (d === 1) eq = '<b>' + pl(n, 'whole', 'wholes') + '</b>';
          else if (n < d) eq = '<b>' + n + '</b> ' + (n === 1 ? 'piece' : 'pieces') + ' when a whole is cut into <b>' + d + '</b> equal parts' + (on('k') && d <= FK_TOP ? '; <b>' + n * Math.ceil(12 / d) + '</b> of <b>' + d * Math.ceil(12 / d) + '</b> counters' : '');
          else eq = '<b>' + words(d, d) + '</b> make 1 whole';
        } else {
          big = say(f[0], f[1]) + (f[0] > f[1] && f[1] > 1 ? ' = ' + mixed(f[0], f[1]) : '');
          eq = row.length <= 8 ? row.map(function (x) { return say(1, x); }).join(' + ') + ' = <b>' + say(f[0], f[1]) + '</b>' : '';
        }
      }
      read.innerHTML = stk((big ? '<p class="mp-total"><span class="mp-num">' + big + '</span></p>' : '') + (eq ? '<p class="mp-ceq">' + eq + '</p>' : ''));
    }
    function btn(a, t, on, dis, extra) { return '<button type="button" class="mp-snap" data-a="' + a + '"' + (extra || '') + (on != null ? ' aria-pressed="' + on + '"' : '') + (dis ? ' disabled' : '') + '>' + t + '</button>'; }
    function cutOk(row, k) { return row.length && !row.some(function (d) { return k === 10 ? !(d === 1 || fkPow(d)) || d * k > 1000 : d * k > FK_TOP; }); }
    function sameSize() { var L = 1; rows.slice(0, 2).forEach(function (r) { r.forEach(function (d) { L = lcm(L, d); }); }); return L <= FK_TOP || fkPow(L) ? L : 0; }
    function snaps() {
      var h = '', row = rows[sel] || [], any = rows.some(function (r) { return r.length; }), inp = qs('.mp-fkin', snapsEl), typed = inp ? inp.value : '', focus = inp && document.activeElement === inp;
      if (mode === 'share') {
        var s = shareParts();
        if (s.left >= share.p) h += btn('deal', 'Share one each') + btn('dealall', 'Share them all');
        else if (s.left && !share.cut) h += btn('cut', 'Cut the rest into ' + share.p);
        if (share.dealt || share.cut) h += (s.left < share.p ? btn('toMat', 'One share as pieces') : '') + btn('again', 'Start again');
      } else if (mode === 'split') {
        h += '<span class="mp-hint">Cut each piece into</span>' + CUTS.map(function (k) { return btn('split', String(k), null, !cutOk(row, k), ' data-k="' + k + '"'); }).join('');
      } else if (mode === 'join') {
        var one = oneSize(row);
        h += '<span class="mp-hint">Join every</span>' + CUTS.concat(6).sort(function (a, b) { return a - b; }).map(function (k) { return btn('join', String(k), null, !one || one % k || row.length % k, ' data-k="' + k + '"'); }).join('');
      } else if (mode === 'fill') {
        var wh = row.filter(function (d) { return d === 1; }).length, rest = row.filter(function (d) { return d !== 1; });
        h += btn('pack', 'Pack into wholes', null, val(rest) < 1 - 1e-9) + btn('break', 'Break a whole into ' + (oneSize(rest) ? fkNames(oneSize(rest)) : fkNames(unit === 1 ? 4 : unit)), null, !wh);
      } else if (mode === 'count') {
        h += btn('add', '+ ' + say(1, unit), null, val(row) + 1 / unit > cap() + 1e-9) + btn('back', '&minus; ' + say(1, unit), null, row.lastIndexOf(unit) < 0) + (mid ? btn('to10', 'Count to ' + FK_BIG, null, val(row) + 1 / unit > FK_BIG + 1e-9 || unit > FK_TOP) : '');
      } else if (mode === 'line') {
        if (rows.length < (mid ? 4 : 3)) h += btn('row', 'Add a row');
        if (g6 && rows.length < 4) h += '<input class="mp-fkin" type="text" inputmode="decimal" autocomplete="off" aria-label="Type a fraction, decimal or percent" placeholder="3/4, 0.7 or 65%">' + btn('type', 'Add number');
      } else if (mode === 'comb') {
        h += btn('op', 'Combine', op === '+', null, ' data-o="+"') + btn('op', 'Take away', op === '-', null, ' data-o="-"');
        if (g6 && rows[1] && rows[0].length && rows[1].length && !combRes() && !(oneSize(rows[0]) && oneSize(rows[0]) === oneSize(rows[1]))) h += btn('same', 'Cut into same-size pieces', null, !sameSize());
      } else if (mode === 'groups') {
        h += '<span class="mp-hint">Groups</span>' + btn('grp', '&minus;', null, grp <= 1, ' data-v="-1" aria-label="One fewer group"') + '<b class="mp-fkcount">' + grp + '</b>' + btn('grp', '+', null, grp >= FK_BIG || (grp + 1) * val(rows[0]) > FK_BIG + 1e-9, ' data-v="1" aria-label="One more group"');
      } else if (mode === 'fit') {
        h += '<span class="mp-hint">Wholes</span>' + btn('fitw', '&minus;', null, fitW <= 1, ' data-v="-1" aria-label="One fewer whole"') + '<b class="mp-fkcount">' + fitW + '</b>' + btn('fitw', '+', null, fitW >= FK_BIG || (rows[0].length && (fitW + 1) / val(rows[0]) > 120), ' data-v="1" aria-label="One more whole"');
      }
      if (any && mode !== 'share') h += btn('clear', 'Clear');
      snapsEl.innerHTML = stk(h);
      var ni = qs('.mp-fkin', snapsEl);
      if (ni) { ni.value = typed; if (focus) ni.focus(); }
    }
    /* a typed fraction, mixed number, decimal or percent becomes pieces: n pieces of the fraction, or place-value pieces */
    function parseTyped(t) {
      t = t.replace(/\s+/g, ' ').trim();
      var m, row = [], i;
      if ((m = t.match(/^(?:(\d+) )?(\d+)\/(\d+)$/))) {
        var w = +(m[1] || 0), n = +m[2], d = +m[3];
        if (!d || d > FK_TOP && !fkPow(d) || w + n / d > FK_MAX + 1e-9 || w + n / d <= 0) return null;
        for (i = 0; i < w; i++) row.push(1);
        for (i = 0; i < n; i++) row.push(d);
        return n > 60 ? null : { row: row, t: t };
      }
      var pct = /%$/.test(t), num = t.replace(/ ?%$/, '');
      if (!/^(\d+(\.\d*)?|\.\d+)$/.test(num)) return null;
      var v = +num / (pct ? 100 : 1), k = Math.round(v * 1000);
      if (Math.abs(v * 1000 - k) > 1e-6 || v <= 0 || v > FK_MAX) return null;
      [[1000, 1], [100, 10], [10, 100], [1, 1000]].forEach(function (p) { var c = Math.floor(k / p[0]) % (p[0] === 1000 ? 10 : 10); for (var j = 0; j < c; j++) row.push(p[1]); });
      return { row: row, t: pct ? +num + '%' : String(+num) };
    }
    /* ---- moves ---- */
    function snapshot() { return JSON.stringify({ rows: rows, tag: tag, sel: sel, mode: mode, win: win, before: before, did: did, share: share, unit: unit, op: op, grp: grp, fitW: fitW }); }
    function act(fn) { var b = snapshot(); fn(); if (snapshot() !== b) { hist.push(b); if (hist.length > 60) hist.shift(); } draw(); change(); }
    function change() { if (o.onChange) o.onChange(state(), T); }
    function state() {
      var f = simp(amount(rows[0]));
      return { mode: mode, rows: rows.map(function (r) { return r.slice(); }), value: f, wins: Object.keys(win).filter(function (k) { return win[k]; }), share: { n: share.n, p: share.p, dealt: share.dealt, cut: share.cut }, op: op, groups: grp, wholes: fitW, last: last };
    }
    function settle() { before = null; did = null; }
    function plain(r) { if (tag[r] && tag[r].t) tag[r] = null; }
    function add(d, r, dec) {
      if (r == null) r = sel;
      var no = full(d, r);
      if (no) { announce(T, no); bump(mat, 'mp-shake'); return; }
      act(function () {
        plain(r);
        if (dec) tag[r] = { dec: 1 };
        rows[r].push(d); settle(); if (mode === 'count') unit = d; last = 'add';
        if (d >= 100 && allowed('g')) win.g = 1;
      });
      var p = qsa('.mp-fkrow[data-r="' + r + '"] .mp-fkp', wins).pop();
      if (p) bump(p, 'mp-pop');
      announce(T, 'Added ' + (d === 1 ? '1 whole' : dec ? String(1 / d) : '1 ' + fkName(d)));
    }
    function setMode(m) {
      act(function () {
        var to = mode === m ? 'build' : m, many = to === 'line' || to === 'comb';
        if (multi() && !many) { rows = [rows[0]]; tag = [tag[0]]; sel = 0; }
        if (many) {
          if (to === 'comb') { rows = rows.slice(0, 2); tag = tag.slice(0, 2); }
          if (rows.length === 1 && (rows[0].length || to === 'comb')) { rows.push([]); tag.push(null); sel = rows[0].length ? 1 : 0; }
          if (sel >= rows.length) sel = rows.length - 1;
        }
        if (to !== mode) settle();
        if (to === 'count' && rows[0].length) unit = oneSize(rows[0]) || rows[0][rows[0].length - 1];
        if (to === 'fill' && !win.n) win.n = 1;
        if (to === 'groups' && rows[0].length) grp = Math.max(1, Math.min(grp, Math.floor(FK_BIG / val(rows[0]) + 1e-9)));
        mode = to; last = 'mode';
      });
    }
    function deal(all) {
      act(function () {
        do { share.dealt += share.p; } while (all && share.n - share.dealt >= share.p);
        last = 'deal';
      });
      if (!T.fast) qsa('.mp-fkplate .mp-fkthing', wins).slice(-1).forEach(function (e) { bump(e, 'mp-pop'); });
    }
    /* ---- events ---- */
    var drag = null, eat = false;
    tray.addEventListener('pointerdown', function (e) {
      var p = e.target.closest('.mp-fkpc');
      if (!p || mode === 'share') return;
      drag = { d: +p.getAttribute('data-d'), dec: p.hasAttribute('data-x'), x: e.clientX, y: e.clientY, g: null };
    });
    function move(e) {
      if (!drag) return;
      if (!drag.g && Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 8) {
        drag.g = document.createElement('div');
        drag.g.className = 'mp-ghost mp-fkghost';
        var S = span(), w = Math.max(18, width() / S / drag.d);
        drag.g.innerHTML = '<i style="--c:' + fkCol(drag.d) + ';width:' + w + 'px"></i>';
        document.body.appendChild(drag.g);
      }
      if (drag.g) { e.preventDefault(); drag.g.style.transform = 'translate(' + (e.clientX - 12) + 'px,' + (e.clientY - 26) + 'px)'; }
    }
    function up(e) {
      if (!drag) return;
      var d = drag;
      drag = null;
      if (!d.g) return;
      d.g.remove(); eat = true;
      var m = mat.getBoundingClientRect();
      if (e.type !== 'pointerup' || e.clientX < m.left || e.clientX > m.right || e.clientY < m.top || e.clientY > m.bottom) return;
      var over = document.elementFromPoint(e.clientX, e.clientY), r = over && over.closest('.mp-fkrow') ? +over.closest('.mp-fkrow').getAttribute('data-r') : sel;
      if (rows.length > 1) sel = r;
      add(d.d, r, d.dec);
    }
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('blur', function () { if (drag && drag.g) drag.g.remove(); drag = null; });
    tray.addEventListener('click', function (e) {
      if (eat) { eat = false; return; }
      var p = e.target.closest('.mp-fkpc'), st = e.target.closest('.mp-fkstep button'), th = e.target.closest('.mp-fkthings button'), tb = e.target.closest('[data-ts]');
      if (tb) { tset = tb.getAttribute('data-ts'); tray.innerHTML = stk(trayHtml()); return; }
      if (p) add(+p.getAttribute('data-d'), null, p.hasAttribute('data-x'));
      if (st) {
        var k = st.parentNode.getAttribute('data-s'), v = +st.getAttribute('data-v'), lim = k === 'n' ? [1, 20] : [2, 10];
        var nv = share[k] + v;
        if (nv >= lim[0] && nv <= lim[1]) act(function () { share[k] = nv; share.dealt = 0; share.cut = false; last = 'share-set'; });
      }
      if (th) act(function () { share.thing = th.getAttribute('data-t'); last = 'thing'; });
    });
    qs('.mp-fkwin', root).addEventListener('click', function (e) {
      var b = e.target.closest('[data-w]');
      if (!b || b.disabled) return;
      var k = b.getAttribute('data-w');
      act(function () { win[k] = win[k] ? 0 : 1; if (!WINS.some(function (w) { return win[w[0]]; })) win[k] = 1; last = 'win'; });
    });
    qs('.mp-fkdo', root).addEventListener('click', function (e) {
      var st = e.target.closest('[data-set]'), b = e.target.closest('[data-m]');
      if (st) { dset = st.getAttribute('data-set'); if (mode !== 'build' && (dset === 'c') !== !!CALC[mode]) setMode(mode); else draw(); return; }
      if (b) setMode(b.getAttribute('data-m'));
    });
    function typeIn() {
      var inp = qs('.mp-fkin', snapsEl), got = inp && parseTyped(inp.value);
      if (!got) { if (inp) { bump(inp, 'mp-shake'); announce(T, 'Type a fraction, decimal or percent up to ' + FK_MAX + ', like 3/4, 0.7 or 65%.'); } return; }
      act(function () {
        var r = rows.map(function (x) { return x.length; }).indexOf(0);
        if (r < 0) { rows.push([]); tag.push(null); r = rows.length - 1; }
        rows[r] = got.row; tag[r] = { t: got.t }; sel = Math.min(r + 1, rows.length - 1); last = 'type';
      });
      var ni = qs('.mp-fkin', snapsEl);
      if (ni) { ni.value = ''; ni.focus(); }
    }
    snapsEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.classList.contains('mp-fkin')) { e.preventDefault(); typeIn(); } });
    mat.addEventListener('click', function (e) {
      var s = e.target.closest('.mp-snap'), p = e.target.closest('button.mp-fkp'), r = e.target.closest('.mp-fkrow');
      if (s) {
        var a = s.getAttribute('data-a'), k = +s.getAttribute('data-k'), v = +s.getAttribute('data-v');
        if (a === 'clear') act(function () { rows = rows.map(function () { return []; }); tag = rows.map(function () { return null; }); settle(); last = 'clear'; });
        if (a === 'split') {
          act(function () { plain(sel); before = rows[sel].slice(); did = { k: k }; rows[sel] = [].concat.apply([], rows[sel].map(function (d) { var out = []; for (var i = 0; i < k; i++) out.push(d * k); return out; })); last = 'split'; });
          announce(T, 'Each piece cut into ' + k);
        }
        if (a === 'join') {
          act(function () { var row = rows[sel], d = oneSize(row), out = []; plain(sel); before = row.slice(); did = { j: k }; for (var i = 0; i < row.length / k; i++) out.push(d / k); rows[sel] = out; last = 'join'; });
          announce(T, 'Every ' + k + ' pieces joined');
        }
        if (a === 'pack') act(function () {
          var row = rows[sel], wh = row.filter(function (d) { return d === 1; }), rest = row.filter(function (d) { return d !== 1; }), keep = [], run = [], x = 0;
          plain(sel); before = row.slice(); did = { fill: 1 };
          rest.forEach(function (d) {
            run.push(d); x += 1 / d;
            if (Math.abs(x - Math.round(x)) < 1e-9 && x > 0.5) { for (var i = 0; i < Math.round(x); i++) wh.push(1); run = []; x = 0; }
            else if (x > 1 + 1e-9) { keep = keep.concat(run); run = []; x = 0; }
          });
          rows[sel] = wh.concat(keep, run); last = 'pack';
        });
        if (a === 'break') act(function () {
          var row = rows[sel], rest = row.filter(function (d) { return d !== 1; }), d = oneSize(rest) || (unit === 1 ? 4 : unit), i = row.indexOf(1), out = [];
          plain(sel); before = row.slice(); did = { brk: d };
          for (var j = 0; j < d; j++) out.push(d);
          row.splice(i, 1);
          rows[sel] = row.filter(function (x) { return x === 1; }).concat(out, rest); last = 'break';
        });
        if (a === 'add') add(unit, null, isDec(sel) && fkPow(unit));
        if (a === 'to10') act(function () { var row = rows[sel]; plain(sel); while (val(row) + 1 / unit <= FK_BIG + 1e-9) row.push(unit); settle(); last = 'to10'; });
        if (a === 'back') act(function () { var row = rows[sel]; plain(sel); row.splice(row.lastIndexOf(unit), 1); settle(); last = 'back'; });
        if (a === 'row') act(function () { rows.push([]); tag.push(null); sel = rows.length - 1; last = 'row'; });
        if (a === 'type') typeIn();
        if (a === 'op') act(function () { op = s.getAttribute('data-o'); settle(); last = 'op'; });
        if (a === 'same') act(function () {
          var L = sameSize();
          rows = rows.map(function (row, i) { if (i > 1) return row; plain(i); var out = []; row.forEach(function (d) { for (var j = 0; j < L / d; j++) out.push(L); }); return out; });
          did = { same: L }; last = 'same';
        });
        if (a === 'grp') act(function () { grp += v; last = 'grp'; });
        if (a === 'fitw') act(function () { fitW += v; last = 'fitw'; });
        if (a === 'deal') deal(false);
        if (a === 'dealall') deal(true);
        if (a === 'cut') act(function () { share.cut = true; last = 'cut'; });
        if (a === 'again') act(function () { share.dealt = 0; share.cut = false; last = 'again'; });
        if (a === 'toMat') act(function () {
          var sp = shareParts(), row = [];
          for (var i = 0; i < sp.each; i++) row.push(1);
          for (i = 0; i < sp.cut; i++) row.push(share.p);
          rows = [row]; tag = [null]; sel = 0; mode = 'build'; settle(); last = 'toMat';
        });
        return;
      }
      if (p && mode !== 'share') { var rr = +p.getAttribute('data-r'), ii = +p.getAttribute('data-i'); act(function () { plain(rr); rows[rr].splice(ii, 1); if (!rows[rr].length) tag[rr] = null; settle(); last = 'remove'; }); return; }
      if (r && rows.length > 1) { sel = +r.getAttribute('data-r'); draw(); }
    });
    T.add = add;
    T.undo = function () {
      if (!hist.length) return;
      var s = JSON.parse(hist.pop());
      rows = s.rows; tag = s.tag; sel = s.sel; mode = s.mode; win = s.win; before = s.before; did = s.did; share = s.share; unit = s.unit; op = s.op; grp = s.grp; fitW = s.fitW; last = 'undo';
      draw(); change();
    };
    T.canUndo = function () { return hist.length > 0; };
    T.showNumbers = function (on) { shown = !!on; draw(); change(); };
    T.state = state;
    T.reset = function () { fresh(); hist = []; draw(); };
    var lw = 0, lh = 0;
    if (window.ResizeObserver) new ResizeObserver(function () { var w = mat.clientWidth, h = mat.clientHeight; if (w && (w !== lw || Math.abs(h - lh) > 2)) { lw = w; lh = h; draw(); } }).observe(mat); else window.addEventListener('resize', draw);
    T.reset();
    return T;
  }

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
    /* put exactly these coins and bills on the mat, e.g. T.set([100, 25, 10]) */
    T.set = function (list) { items = list.slice(); draw(false); return T.wait(300); };
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
     options: x2 (offer x squared tiles), ones (unit tiles only, for integers), kinds (e.g. ['x', 'one']), start {x2, x, one} (negative numbers make red tiles), onChange.
     Tap the tray to add, tap a tile to take it away, "Remove zero pairs" cancels a positive and a negative tile. */
  M.tiles = function (root, o) {
    o = o || {};
    var T = base(root, 'tile'), kinds = o.kinds || (o.ones ? ['one'] : o.x2 ? ['x2', 'x', 'one'] : ['x', 'one']), tiles = [];
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

  /* ================= Clock, area grid and kitchen scale (from Grade 4) =================
     Manip.clock(el, { t: 540, controls: true })           analog clock with a.m./p.m. readout; t is minutes after midnight. Moves: set(t), advance(min). State {t, h, m, elapsed}.
     Manip.areagrid(el, { cols: 10, rows: 6, unit: 'cm' }) tap squares to cover them. Moves: fill(l, w), clear(). State {count, l, w, isRect}.
     Manip.scale(el, { g: 0, max: 5000 })                   a kitchen scale with 1 kg, 100 g and 10 g blocks. Moves: add(kind, n), remove(kind, n). State {g, kg, h, t}. */
  function abtn(a, label) { return '<button type="button" class="mp-act" data-a="' + a + '">' + label + '</button>'; }
  function svgBox(w, h, inner, label) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" class="mp-fill" style="max-width:' + w + 'px" role="img" aria-label="' + label + '">' + inner + '</svg>'; }
  function pulse(el) { if (el) bump(el); }

  /* ================= Clock ================= */
  function hm(t) { t = ((t % 1440) + 1440) % 1440; var h = Math.floor(t / 60), m = t % 60; return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h < 12 ? 'a.m.' : 'p.m.'); }
  function dur(m) { var s = m < 0 ? '&minus;' : ''; m = Math.abs(m); var h = Math.floor(m / 60), r = m % 60; return s + (h ? h + ' h ' : '') + r + ' min'; }
  M.clock = function (root, o) {
    o = o || {};
    var T = base(root, 'clock'), start = o.t == null ? 540 : o.t, t = start, last = '';
    root.innerHTML = (o.controls === false ? '' : '<div class="mp-acts">' + abtn('-60', '&minus;1 hour') + abtn('-5', '&minus;5 min') + abtn('5', '+5 min') + abtn('60', '+1 hour') + abtn('reset', 'Start again') + '</div>') +
      '<div class="mp-clock"></div><div class="mp-read" aria-live="polite"></div>';
    var face = qs('.mp-clock', root), read = qs('.mp-read', root);
    function draw() {
      var cx = 120, cy = 120, r = 104, s = '<circle cx="120" cy="120" r="' + r + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="5"/>';
      for (var i = 0; i < 60; i++) { var b = (90 - i * 6) * Math.PI / 180, r1 = i % 5 ? 97 : 90; s += '<line x1="' + (cx + r1 * Math.cos(b)).toFixed(1) + '" y1="' + (cy - r1 * Math.sin(b)).toFixed(1) + '" x2="' + (cx + 101 * Math.cos(b)).toFixed(1) + '" y2="' + (cy - 101 * Math.sin(b)).toFixed(1) + '" style="stroke:var(--ink)" stroke-width="' + (i % 5 ? 1.5 : 3) + '"/>'; }
      for (i = 1; i <= 12; i++) { var a = (90 - i * 30) * Math.PI / 180; s += '<text x="' + (cx + 72 * Math.cos(a)).toFixed(1) + '" y="' + (cy - 72 * Math.sin(a) + 8).toFixed(1) + '" text-anchor="middle" font-size="22" font-weight="700" style="fill:var(--ink)">' + i + '</text>'; }
      /* the minutes passed since the start, as a shaded wedge */
      var el = t - start;
      if (el > 0 && el < 60) {
        var a0 = (90 - (start % 60) * 6) * Math.PI / 180, a1 = (90 - (t % 60) * 6) * Math.PI / 180;
        s += '<path d="M120 120 L' + (cx + 86 * Math.cos(a0)).toFixed(1) + ' ' + (cy - 86 * Math.sin(a0)).toFixed(1) + ' A86 86 0 ' + (el > 30 ? 1 : 0) + ' 1 ' + (cx + 86 * Math.cos(a1)).toFixed(1) + ' ' + (cy - 86 * Math.sin(a1)).toFixed(1) + ' Z" style="fill:color-mix(in srgb,var(--accent) 22%,transparent)"/>';
      }
      var m = t % 60, h = (t / 60) % 12, am = (90 - m * 6) * Math.PI / 180, ah = (90 - h * 30) * Math.PI / 180;
      s += '<line x1="120" y1="120" x2="' + (cx + 52 * Math.cos(ah)).toFixed(1) + '" y2="' + (cy - 52 * Math.sin(ah)).toFixed(1) + '" style="stroke:var(--ink)" stroke-width="8" stroke-linecap="round"/>';
      s += '<line x1="120" y1="120" x2="' + (cx + 82 * Math.cos(am)).toFixed(1) + '" y2="' + (cy - 82 * Math.sin(am)).toFixed(1) + '" style="stroke:var(--strand,var(--accent))" stroke-width="5" stroke-linecap="round"/><circle cx="120" cy="120" r="7" style="fill:var(--ink)"/>';
      face.innerHTML = svgBox(240, 240, s, 'Clock showing ' + hm(t).replace(/\./g, ''));
      read.innerHTML = '<p><span class="mp-num">' + hm(t) + '</span>' + (t !== start ? ' &nbsp;<span class="t2">' + dur(t - start) + ' since ' + hm(start) + '</span>' : '') + '</p>';
    }
    function change() { draw(); if (o.onChange) o.onChange(T.state(), T); }
    T.state = function () { return { t: t, h: Math.floor(((t % 1440) + 1440) % 1440 / 60), m: ((t % 60) + 60) % 60, elapsed: t - start, last: last }; };
    T.set = function (v) { t = v; last = 'set'; change(); return T.wait(300); };
    /* move the hands minute by minute, so the clock visibly runs */
    T.advance = function (mins) {
      var ep = T.ep, dir = mins < 0 ? -1 : 1, left = Math.abs(mins), stepM = left > 120 ? 5 : 1;
      last = 'advance';
      if (T.fast) { t += mins; change(); return Promise.resolve(); }
      function one() {
        if (!T.alive(ep) || left <= 0) return Promise.resolve();
        var k = Math.min(stepM, left); t += dir * k; left -= k; change();
        return T.wait(Math.max(8, 700 / Math.abs(mins) * k)).then(one);
      }
      return one();
    };
    T.reset = function () { T.ep++; t = start; last = ''; change(); };
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]'); if (!b || !root.contains(b)) return;
      var a = b.getAttribute('data-a');
      if (a === 'reset') T.reset(); else { T.ep++; t += +a; last = 'step'; change(); pulse(read.firstChild); }
    });
    draw();
    return T;
  };

  /* ================= Area grid ================= */
  M.areagrid = function (root, o) {
    o = o || {};
    var T = base(root, 'area'), C = o.cols || 10, Rw = o.rows || 6, unit = o.unit || 'cm', on = {}, last = '';
    root.innerHTML = '<div class="mp-acts">' + abtn('clear', 'Clear') + '</div><div class="mp-agrid" style="grid-template-columns:repeat(' + C + ',minmax(0,1fr));gap:2px;max-width:' + (C * 46) + 'px"></div><div class="mp-read" aria-live="polite"></div>';
    var g = qs('.mp-agrid', root), read = qs('.mp-read', root), h = '';
    for (var r = 0; r < Rw; r++) for (var c = 0; c < C; c++) h += '<button type="button" class="mp-asq" data-r="' + r + '" data-c="' + c + '" aria-pressed="false" aria-label="Square ' + (r + 1) + ', ' + (c + 1) + '"></button>';
    g.innerHTML = h;
    function cell(r, c) { return qs('[data-r="' + r + '"][data-c="' + c + '"]', g); }
    function shape() {
      var k = Object.keys(on); if (!k.length) return { l: 0, w: 0, rect: false };
      var rs = k.map(function (x) { return +x.split(',')[0]; }), cs = k.map(function (x) { return +x.split(',')[1]; });
      var l = Math.max.apply(null, cs) - Math.min.apply(null, cs) + 1, w = Math.max.apply(null, rs) - Math.min.apply(null, rs) + 1;
      return { l: l, w: w, rect: l * w === k.length };
    }
    function paint(r, c) { var b = cell(r, c), v = !!on[r + ',' + c]; b.classList.toggle('on', v); b.setAttribute('aria-pressed', String(v)); }
    function readout() {
      var n = Object.keys(on).length, sh = shape();
      read.innerHTML = '<p><span class="mp-num">' + n + ' ' + unit + '<sup>2</sup></span>' + (sh.rect && n ? ' &nbsp;<span class="t2">a rectangle ' + sh.l + ' by ' + sh.w + ': ' + sh.l + ' &times; ' + sh.w + ' = ' + n + '</span>' : '') + '</p>';
    }
    function change() { readout(); if (o.onChange) o.onChange(T.state(), T); }
    T.state = function () { var sh = shape(); return { count: Object.keys(on).length, l: sh.l, w: sh.w, isRect: sh.rect, last: last }; };
    T.clear = function () { on = {}; for (var r = 0; r < Rw; r++) for (var c = 0; c < C; c++) paint(r, c); last = 'clear'; change(); return T.wait(200); };
    /* cover an l by w rectangle row by row, so the rows can be counted */
    T.fill = function (l, w) {
      var ep = T.ep, r = 0; last = 'fill';
      function row() {
        if (!T.alive(ep) || r >= Math.min(w, Rw)) return Promise.resolve();
        for (var c = 0; c < Math.min(l, C); c++) { on[r + ',' + c] = 1; paint(r, c); }
        pulse(cell(r, 0)); r++; change();
        return T.wait(350).then(row);
      }
      return row();
    };
    T.reset = function () { T.ep++; on = {}; for (var r = 0; r < Rw; r++) for (var c = 0; c < C; c++) paint(r, c); last = ''; if (o.l && o.w) { for (r = 0; r < o.w; r++) for (c = 0; c < o.l; c++) { on[r + ',' + c] = 1; paint(r, c); } } change(); };
    g.addEventListener('click', function (e) {
      var b = e.target.closest('.mp-asq'); if (!b) return;
      var k = b.getAttribute('data-r') + ',' + b.getAttribute('data-c');
      if (on[k]) delete on[k]; else on[k] = 1;
      paint(+b.getAttribute('data-r'), +b.getAttribute('data-c')); if (on[k]) pulse(b); last = 'tap'; change();
    });
    qs('[data-a="clear"]', root).addEventListener('click', function () { T.ep++; T.clear(); });
    T.reset();
    return T;
  };

  /* ================= Kitchen scale with mass blocks ================= */
  var MB = { kg: 1000, h: 100, t: 10 }, MBL = { kg: '1 kg', h: '100 g', t: '10 g' };
  M.scale = function (root, o) {
    o = o || {};
    var T = base(root, 'scale'), max = o.max || 5000, n = { kg: 0, h: 0, t: 0 }, last = '';
    root.innerHTML = '<div class="mp-acts">' + ['kg', 'h', 't'].map(function (k) { return abtn('+' + k, '+ ' + MBL[k]) + abtn('-' + k, '&minus; ' + MBL[k]); }).join('') + '</div><div class="mp-pan"></div><div class="mp-read" aria-live="polite"></div>';
    var pan = qs('.mp-pan', root), read = qs('.mp-read', root);
    function g() { return n.kg * 1000 + n.h * 100 + n.t * 10; }
    function draw() {
      var s = '', x = 20, y = 150, W = 460, gv = g();
      /* blocks sit on the pan, biggest first */
      [['kg', 70, 'var(--strand,var(--accent))'], ['h', 40, 'var(--hi,var(--accent))'], ['t', 24, 'var(--accent)']].forEach(function (b) {
        for (var i = 0; i < n[b[0]]; i++) {
          if (x + b[1] > W - 20) { x = 20; y -= 74; }
          s += '<rect x="' + x + '" y="' + (y - b[1]) + '" width="' + b[1] + '" height="' + b[1] + '" rx="6" style="fill:color-mix(in srgb,' + b[2] + ' 45%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
          if (b[0] !== 't') s += '<text x="' + (x + b[1] / 2) + '" y="' + (y - b[1] / 2 + 6) + '" text-anchor="middle" font-size="' + (b[0] === 'kg' ? 18 : 12) + '" font-weight="700" style="fill:var(--ink)">' + MBL[b[0]] + '</text>';
          x += b[1] + 6;
        }
      });
      s += '<rect x="6" y="152" width="' + (W - 12) + '" height="12" rx="6" style="fill:var(--ink)"/><rect x="' + (W / 2 - 90) + '" y="164" width="180" height="56" rx="10" style="fill:var(--card);stroke:var(--ink)" stroke-width="3"/>';
      s += '<text x="' + W / 2 + '" y="202" text-anchor="middle" font-size="28" font-weight="700" style="fill:var(--ink)">' + fmt(gv) + ' g</text>';
      pan.innerHTML = svgBox(W, 226, s, 'A scale showing ' + gv + ' grams');
      var kg = Math.floor(gv / 1000), rest = gv % 1000;
      read.innerHTML = '<p><span class="mp-num">' + gv + ' g</span>' + (kg ? ' &nbsp;<span class="t2">= ' + kg + ' kg' + (rest ? ' ' + rest + ' g' : '') + '</span>' : '') + '</p>';
      qsa('[data-a]', root).forEach(function (b) { var a = b.getAttribute('data-a'), k = a.slice(1); b.disabled = a.charAt(0) === '+' ? gv + MB[k] > max : !n[k]; });
    }
    function change() { draw(); if (o.onChange) o.onChange(T.state(), T); }
    T.state = function () { return { g: g(), kg: n.kg, h: n.h, t: n.t, last: last }; };
    T.add = function (k, c) {
      var ep = T.ep, i = 0; c = c || 1; last = 'add';
      function one() { if (!T.alive(ep) || i >= c || g() + MB[k] > max) return Promise.resolve(); i++; n[k]++; change(); return T.wait(220).then(one); }
      return one();
    };
    T.remove = function (k, c) { n[k] = Math.max(0, n[k] - (c || 1)); last = 'remove'; change(); return T.wait(250); };
    T.reset = function () { T.ep++; var v = o.g || 0; n = { kg: Math.floor(v / 1000), h: Math.floor(v % 1000 / 100), t: Math.floor(v % 100 / 10) }; last = ''; change(); };
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]'); if (!b || !root.contains(b)) return;
      var a = b.getAttribute('data-a'), k = a.slice(1);
      T.ep++; if (a.charAt(0) === '+') { n[k]++; last = 'add'; } else { n[k] = Math.max(0, n[k] - 1); last = 'remove'; }
      change(); pulse(read.firstChild);
    });
    T.reset();
    return T;
  };

  /* ================= Place value disks (from Grade 5) =================
     options: places (high to low: 5 = hundred thousands ... 0 = ones, -1 tenths, -2 hundredths; default [4,3,2,1,0]),
     start {place: count}, controls, max per column (default 19), onChange(state, tool).
     Tap a disk to light it and count. Moves: add(p, n, ms), remove(p, n), set(counts), group(p), split(p), countAll(ms), pulseCol(p), clearLit(). */
  var PN = { 5: 'hundred thousands', 4: 'ten thousands', 3: 'thousands', 2: 'hundreds', 1: 'tens', 0: 'ones', '-1': 'tenths', '-2': 'hundredths' };
  var PS = { 5: '100 000s', 4: '10 000s', 3: '1000s', 2: '100s', 1: '10s', 0: '1s', '-1': '0.1s', '-2': '0.01s' };
  var PC = { 5: 'var(--p6,#0b6e78)', 4: 'var(--p4,#7646bf)', 3: 'var(--p5,#c02e76)', 2: 'var(--mh)', 1: 'var(--mt)', 0: 'var(--mo)', '-1': 'var(--p3,#c25a12)', '-2': '#5b6b8a' };
  function clean(x) { return Math.round(x * 1e6) / 1e6; }
  function pv(p) { return clean(Math.pow(10, p)); }
  function plab(p) { return p >= 0 ? fmt(pv(p)) : String(pv(p)); }
  /* a grade can recolour a place with --mp-d5 ... --mp-d0, --mp-dm1, --mp-dm2 */
  function pcol(p) { return 'var(--mp-d' + (p < 0 ? 'm' + -p : p) + ',' + PC[p] + ')'; }
  M.disks = function (root, o) {
    o = o || {};
    var T = base(root, 'disks'), places = o.places || [4, 3, 2, 1, 0], cnt = {}, lit = [], last = '', max = o.max || 19, mode = '';
    root.innerHTML = (o.controls ? '<div class="mp-tray">' + places.map(function (p) {
      return '<div class="mp-tg"><button type="button" class="mp-add" data-p="' + p + '" aria-label="Add a ' + plab(p) + ' disk"><i class="mp-dk sm" style="--c:' + pcol(p) + '"></i><span>+ ' + plab(p) + '</span></button>' +
        '<button type="button" class="mp-sub" data-p="' + p + '" aria-label="Take away a ' + plab(p) + ' disk">&minus;</button></div>';
    }).join('') + '</div><div class="mp-acts"><button type="button" class="mp-act" data-a="group">Group 10 into 1</button><button type="button" class="mp-act" data-a="split" aria-pressed="false">Break 1 into 10</button>' +
      '<button type="button" class="mp-act" data-a="count">Count them</button><button type="button" class="mp-act" data-a="clear">Clear</button></div>' : '') +
      '<div class="mp-dmat" style="--n:' + places.length + '">' + places.map(function (p) {
        return '<div class="mp-dcol" data-p="' + p + '"><span class="mp-dh" style="--c:' + pcol(p) + '"><span class="lg">' + PN[p] + '</span><span class="sm">' + PS[p] + '</span></span><div class="mp-dstack"></div><span class="mp-dn"></span></div>';
      }).join('') + '</div><div class="mp-read" aria-live="polite"></div>';
    var read = qs('.mp-read', root);
    function total() { var t = 0; places.forEach(function (p) { t += cnt[p]; }); return t; }
    function value() { var v = 0; places.forEach(function (p) { v += cnt[p] * pv(p); }); return clean(v); }
    function state() { return { value: value(), counts: Object.assign({}, cnt), last: last, lit: lit.length, allLit: lit.length > 0 && lit.length === total() }; }
    function fire() { if (o.onChange) o.onChange(state(), T); }
    function stack(p) { return qs('.mp-dcol[data-p="' + p + '"] .mp-dstack', root); }
    function draw(p, fresh) {
      var st = stack(p), have = st.children.length;
      while (have > cnt[p]) { st.lastChild.remove(); have--; }
      while (have < cnt[p]) {
        var d = button('mp-dk' + (fresh && !T.fast ? ' mp-drop' : ''), '<b>' + plab(p) + '</b>', plab(p) + ' disk');
        d.style.setProperty('--c', pcol(p));
        d.setAttribute('data-p', p); d.setAttribute('data-l', String(plab(p).replace(/\s/g, '').length));
        st.appendChild(d); have++;
      }
      qs('.mp-dcol[data-p="' + p + '"] .mp-dn', root).textContent = cnt[p];
    }
    function line(html) { var l = qs('.mp-litline', read); if (l) l.innerHTML = html; }
    function readout() {
      var parts = places.filter(function (p) { return cnt[p]; }).map(function (p) { return '<b style="color:' + pcol(p) + '">' + fmt(clean(cnt[p] * pv(p))) + '</b>'; });
      var over = places.filter(function (p) { return cnt[p] > 9; });
      read.innerHTML = (o.readout === false ? '' : '<p><span class="mp-num">' + fmt(value()) + '</span></p>') + '<p class="mp-litline">' + (parts.join(' + ') || '0') + '</p>' +
        (over.length ? '<p class="mp-tip">' + over.map(function (p) { return cnt[p] + ' ' + PN[p]; }).join(', ') + ': ten of them can be grouped.</p>' : '');
    }
    function all(fresh) { places.forEach(function (p) { draw(p, fresh); }); readout(); }
    T.clearLit = function () { lit = []; qsa('.mp-dk.on', root).forEach(function (d) { d.classList.remove('on'); }); };
    T.set = function (c) { places.forEach(function (p) { cnt[p] = c[p] || 0; }); last = 'set'; T.clearLit(); qsa('.mp-dstack', root).forEach(function (x) { x.innerHTML = ''; }); all(true); fire(); return T.wait(500); };
    T.add = function (p, n, ms) {
      n = n || 1;
      var ep = T.ep, k = 0;
      function one() {
        if (!T.alive(ep) || k >= n || cnt[p] >= max) { fire(); return Promise.resolve(); }
        cnt[p]++; k++; last = 'add'; T.clearLit(); draw(p, true); readout();
        return T.wait(ms || 260).then(one);
      }
      return one();
    };
    T.remove = function (p, n) { cnt[p] = Math.max(0, cnt[p] - (n || 1)); last = 'remove'; T.clearLit(); draw(p); readout(); fire(); return T.wait(300); };
    T.pulseCol = function (p) { var c = qs('.mp-dcol[data-p="' + p + '"]', root); if (!T.fast) bump(c, 'mp-glow'); return T.wait(1200); };
    /* 10 disks of a place slide together into 1 disk of the next place to the left */
    T.group = function (p) {
      var up = p + 1;
      if (places.indexOf(up) < 0 || cnt[p] < 10) return Promise.resolve(false);
      var ep = T.ep;
      qsa('.mp-dk', stack(p)).slice(-10).forEach(function (d) { d.classList.add('on', 'mp-go'); });
      return T.wait(650).then(function () {
        if (!T.alive(ep)) return false;
        cnt[p] -= 10; cnt[up]++; last = 'group-' + p; T.clearLit(); draw(p); draw(up, true); readout();
        var nd = stack(up).lastChild;
        if (nd && !T.fast) { nd.classList.add('on'); bump(nd); }
        fire();
        return T.wait(700).then(function () { return true; });
      });
    };
    /* 1 disk breaks into 10 disks of the next place to the right */
    T.split = function (p) {
      var dn = p - 1;
      if (places.indexOf(dn) < 0 || cnt[p] < 1 || cnt[dn] > max - 10) return Promise.resolve(false);
      var ep = T.ep, d = stack(p).lastChild;
      if (d) d.classList.add('on', 'mp-go');
      return T.wait(500).then(function () {
        if (!T.alive(ep)) return false;
        cnt[p]--; cnt[dn] += 10; last = 'split-' + p; T.clearLit(); draw(p); draw(dn, true); readout(); fire();
        return T.wait(800).then(function () { return true; });
      });
    };
    /* light every disk, biggest place first, with the running total */
    T.countAll = function (ms) {
      var ep = T.ep, ds = [], run = 0, i = 0;
      T.clearLit();
      places.forEach(function (p) { qsa('.mp-dk', stack(p)).forEach(function (d) { ds.push(d); }); });
      function step() {
        if (!T.alive(ep) || i >= ds.length) { last = 'count'; fire(); return Promise.resolve(); }
        var d = ds[i++];
        run = clean(run + pv(+d.getAttribute('data-p'))); d.classList.add('on'); lit.push(d);
        if (!T.fast) { bump(d); floatText(root, d.offsetLeft + d.offsetWidth / 2, d.offsetTop, fmt(run)); }
        line('Counted so far: <b>' + fmt(run) + '</b>');
        return T.wait(ms || 220).then(step);
      }
      return step();
    };
    T.state = state;
    T.reset = function () { T.ep++; places.forEach(function (p) { cnt[p] = (o.start && o.start[p]) || 0; }); last = ''; lit = []; mode = ''; qsa('.mp-dstack', root).forEach(function (x) { x.innerHTML = ''; }); all(false); };
    root.addEventListener('click', function (e) {
      var h = e.target.closest('.mp-dh');
      if (h && mode === 'split') {
        mode = '';
        var sb = qs('[data-a="split"]', root); if (sb) sb.setAttribute('aria-pressed', 'false');
        T.split(+h.parentNode.getAttribute('data-p')).then(function (ok) { if (ok === false) line('<span class="mp-tip">There is nothing to break there.</span>'); });
        return;
      }
      var b = e.target.closest('button');
      if (!b || o.tap === false) return;
      if (b.classList.contains('mp-dk')) {
        if (b.classList.contains('on')) return;
        b.classList.add('on'); lit.push(b); bump(b);
        var run = 0; lit.forEach(function (x) { run = clean(run + pv(+x.getAttribute('data-p'))); });
        floatText(root, b.offsetLeft + b.offsetWidth / 2, b.offsetTop, fmt(run));
        line('Counted so far: <b>' + fmt(run) + '</b>');
        last = 'tap'; fire(); return;
      }
      var p = b.hasAttribute('data-p') ? +b.getAttribute('data-p') : null, a = b.getAttribute('data-a');
      if (b.classList.contains('mp-add')) T.add(p, 1, 1);
      else if (b.classList.contains('mp-sub')) T.remove(p, 1);
      else if (a === 'count') T.countAll(180);
      else if (a === 'clear') T.set({});
      else if (a === 'group') {
        var g = places.slice().reverse().filter(function (q) { return cnt[q] >= 10 && places.indexOf(q + 1) >= 0; })[0];
        if (g == null) line('<span class="mp-tip">You need 10 disks in one column to group them.</span>'); else T.group(g);
      } else if (a === 'split') { mode = 'split'; b.setAttribute('aria-pressed', 'true'); line('Now tap the <b>column heading</b> of the disk you want to break.'); }
    });
    T.reset();
    return T;
  };

  /* ================= Frames: a Watch clip from drawings (from Grade 5) =================
     Manip.frames([{ say, fig, ms }, ...]) or ([[say, fig, ms], ...]) returns a watch spec: { mount, steps }.
     Each frame swaps in a new picture (usually one svg); the parts that are new pop in, the parts that stay still do not move.
     A frame with several parts (say a drawing, then a line of text) stacks them top to bottom, centred. */
  M.frames = function (frames) {
    frames = frames.map(function (f) { return Array.isArray(f) ? { say: f[0], fig: f[1], ms: f[2] } : f; });
    return {
      mount: function (stage) {
        var T = { root: stage, fast: false, prev: {} };
        stage.classList.add('mp-scene');
        T.show = function (html) {
          var seen = T.prev, now = {}, first = !Object.keys(seen).length;
          stage.innerHTML = html;
          qsa('svg > *, .mp-anim > *', stage).forEach(function (n, i) {
            var key = n.outerHTML;
            now[key] = 1;
            if (!seen[key] && !T.fast && !first) { n.classList.add('mp-new'); n.style.animationDelay = Math.min(i * 18, 500) + 'ms'; }
          });
          if (first && !T.fast) bump(stage, 'mp-fade');
          T.prev = now;
          return T.fast ? Promise.resolve() : new Promise(function (r) { setTimeout(r, 450); });
        };
        T.reset = function () { T.prev = {}; stage.innerHTML = frames[0].fig || ''; };
        T.reset();
        return T;
      },
      steps: frames.map(function (f) { return { say: f.say, ms: f.ms == null ? 1500 : f.ms, act: function (t) { return t.show(f.fig); } }; })
    };
  };

  /* ================= "Watch" player =================
     A short animated demonstration, like a video clip, built from a tool's own moves.
     steps: [{say: caption, act: function (tool) { return promise }, ms: pause after}]
     The student plays it, or steps through it; it starts by itself only when "Auto-play" is on. */
  /* Auto-play is off unless the student or a grown-up switches it on. The choice is remembered in this browser for every grade. */
  function autoOn() { try { return localStorage.getItem('atlas:autoplay') === '1'; } catch (e) { return false; } }
  function setAuto(on) { try { localStorage.setItem('atlas:autoplay', on ? '1' : '0'); } catch (e) { /* storage blocked */ } }
  /* A "Watch" clip: the student plays it, pauses it, or steps one part at a time. Each step is { say, act(tool), ms }. */
  M.player = function (root, tool, steps, o) {
    o = o || {};
    var k = 0, playing = false, run = 0, started = false, n = steps.length;
    root.classList.add('mp-player');
    root.innerHTML = '<div class="mp-stage"></div><p class="mp-cap" aria-live="polite"></p>' +
      '<div class="mp-pctl"><button type="button" class="mp-pb mp-prev" aria-label="Back one part">&lsaquo;</button>' +
      '<button type="button" class="mp-pb mp-play">Play</button>' +
      '<button type="button" class="mp-pb mp-step" aria-label="Next part">&rsaquo;</button>' +
      '<span class="mp-dots">' + steps.map(function (s, i) { return '<button type="button" class="mp-sd" data-i="' + i + '" aria-label="Part ' + (i + 1) + ' of ' + n + '"></button>'; }).join('') + '</span>' +
      '<button type="button" class="mp-auto mp-ap" aria-pressed="false"></button></div>';
    var stage = qs('.mp-stage', root), cap = qs('.mp-cap', root), playB = qs('.mp-play', root), prevB = qs('.mp-prev', root), stepB = qs('.mp-step', root), autoB = qs('.mp-ap', root);
    stage.appendChild(tool.root);
    /* k counts the parts already shown; the caption is the part on screen */
    function dots(i) { qsa('.mp-sd', root).forEach(function (d, j) { d.classList.toggle('on', j < k); d.classList.toggle('cur', j === i); }); }
    function caption(i) {
      cap.innerHTML = steps[i] ? steps[i].say : '';
      if (steps[i] && !tool.fast) bump(cap, 'mp-fade');
      dots(i);
    }
    function ui() {
      playB.textContent = playing ? 'Pause' : k >= n ? 'Play again' : 'Play';
      prevB.disabled = playing || k === 0;
      stepB.disabled = playing || k >= n;
      root.classList.toggle('playing', playing);
      var on = autoOn();
      autoB.setAttribute('aria-pressed', String(on));
      autoB.textContent = 'Auto-play: ' + (on ? 'on' : 'off');
    }
    /* show part k with its animation, then count it as shown */
    function one(my) {
      var s = steps[k];
      caption(k);
      return Promise.resolve(s.act ? s.act(tool) : null).then(function () { if (my === run) { k++; dots(k - 1); } });
    }
    function go() {
      if (k >= n) return jump(0, true);
      playing = true; started = true; ui();
      var my = ++run;
      (function next() {
        if (my !== run || !playing) return;
        if (k >= n) { playing = false; ui(); if (o.onEnd) o.onEnd(); return; }
        var ms = steps[k].ms == null ? 1100 : steps[k].ms;
        one(my).then(function () { return new Promise(function (r) { setTimeout(r, ms); }); }).then(next);
      })();
    }
    function pause() { playing = false; run++; ui(); }
    /* rebuild the picture instantly with parts 0 to j-1 already shown */
    function jump(j, play) {
      pause();
      tool.fast = true;
      tool.reset();
      var p = Promise.resolve();
      steps.slice(0, j).forEach(function (s) { p = p.then(function () { return s.act ? s.act(tool) : null; }); });
      return p.then(function () { tool.fast = false; k = j; caption(j ? j - 1 : 0); if (play) go(); else ui(); });
    }
    function stepOn() { if (playing || k >= n) return; started = true; var my = ++run; stepB.disabled = true; one(my).then(ui); }
    playB.addEventListener('click', function () { if (playing) pause(); else go(); });
    stepB.addEventListener('click', stepOn);
    prevB.addEventListener('click', function () { if (!playing && k > 0) jump(k - 1); });
    qs('.mp-dots', root).addEventListener('click', function (e) { var d = e.target.closest('.mp-sd'); if (d) jump(+d.getAttribute('data-i') + 1); });
    autoB.addEventListener('click', function () { setAuto(!autoOn()); ui(); if (autoOn() && !started && !playing) go(); });
    caption(0); ui();
    /* with auto-play on, start by itself the first time it is on screen */
    if (o.autoplay !== false && autoOn() && window.IntersectionObserver) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && !started) { io.disconnect(); setTimeout(function () { if (!started && document.body.contains(root)) go(); }, 500); } });
      }, { threshold: 0.5 });
      io.observe(root);
    }
    return { play: go, pause: pause, jump: jump, restart: function () { return jump(0, true); }, step: stepOn, tool: tool, get playing() { return playing; }, get at() { return k; } };
  };

  /* ================= Toolbox page (#tools) =================
     Manip.toolbox(app, sub, ids): one tool fills the screen under a slim bar; the Tools menu groups the grade's tools on shelves.
     ids is the grade's list (Atlas.tools); unset shows every tool. A tool that has undo() or showNumbers() gets those buttons. */
  var SHELVES = [['num', 'Numbers'], ['parts', 'Parts and groups'], ['alg', 'Patterns and equations'], ['space', 'Shapes and space'], ['meas', 'Measure, money and data']];
  /* [id, shelf, name, one line on how to use it (none when the tool shows its own), options, icon] */
  var BOX = [
    ['counters', 'num', 'Counters and ten-frames', '', { tool: true },
      '<rect x="4" y="8" width="40" height="18" rx="2" style="fill:none;stroke:var(--ink,#132039);stroke-width:2"/><path d="M12 8v18M20 8v18M28 8v18M36 8v18M4 17h40" style="stroke:var(--ink,#132039);stroke-width:1.2"/><circle cx="8" cy="12.5" r="3" style="fill:#c0392b"/><circle cx="16" cy="12.5" r="3" style="fill:#c0392b"/><circle cx="24" cy="12.5" r="3" style="fill:var(--mp-ones,#e0a100)"/><circle cx="16" cy="37" r="6" style="fill:#c0392b"/><circle cx="31" cy="37" r="6" style="fill:var(--mp-ones,#e0a100)"/>'],
    ['base10', 'num', 'Place value blocks', '', { drag: true, cols: ['k', 'h', 't', 'o'], readout: false, hideTotal: true, u: 34, uMax: 34, limit: 9999, max: { k: 9, h: 19, t: 19, o: 29 } },
      '<rect x="6" y="14" width="18" height="18" rx="2" style="fill:var(--mp-hund,#2f62c4)"/><rect x="28" y="8" width="6" height="30" rx="1.5" style="fill:var(--mp-tens,#2f9e44)"/><rect x="37" y="30" width="7" height="7" rx="1.5" style="fill:var(--mp-ones,#e0a100)"/>'],
    ['disks', 'num', 'Place value disks', 'Tap + to add disks. Tap a disk to light it and count. Group 10 disks into 1 of the next place, or break 1 into 10.', { controls: true, places: [3, 2, 1, 0, -1] },
      '<circle cx="15" cy="17" r="9" style="fill:var(--mp-hund,#2f62c4)"/><circle cx="33" cy="17" r="9" style="fill:var(--mp-tens,#2f9e44)"/><circle cx="24" cy="33" r="9" style="fill:var(--mp-ones,#e0a100)"/>'],
    ['hundred', 'num', 'Number chart', '', { tool: true },
      '<g style="fill:var(--line,#dfe5ee)"><rect x="7" y="7" width="7" height="7" rx="1.5"/><rect x="25" y="7" width="7" height="7" rx="1.5"/><rect x="16" y="16" width="7" height="7" rx="1.5"/><rect x="34" y="16" width="7" height="7" rx="1.5"/><rect x="7" y="25" width="7" height="7" rx="1.5"/><rect x="25" y="25" width="7" height="7" rx="1.5"/><rect x="16" y="34" width="7" height="7" rx="1.5"/><rect x="34" y="34" width="7" height="7" rx="1.5"/></g><g style="fill:var(--accent,#0b6e78)"><rect x="16" y="7" width="7" height="7" rx="1.5"/><rect x="34" y="7" width="7" height="7" rx="1.5"/><rect x="7" y="16" width="7" height="7" rx="1.5"/><rect x="25" y="16" width="7" height="7" rx="1.5"/><rect x="16" y="25" width="7" height="7" rx="1.5"/><rect x="34" y="25" width="7" height="7" rx="1.5"/><rect x="7" y="34" width="7" height="7" rx="1.5"/><rect x="25" y="34" width="7" height="7" rx="1.5"/></g>'],
    ['numberline', 'num', 'Number line', '', { tool: true },
      '<path d="M5 31h38M8 27v8M18 27v8M28 27v8M38 27v8" style="stroke:var(--ink,#132039);stroke-width:2"/><path d="M8 27Q13 13 18 27M18 27Q23 13 28 27" style="fill:none;stroke:var(--accent,#0b6e78);stroke-width:2.5"/>'],
    ['fractions', 'parts', 'Fraction kit', '', { tool: true },
      '<rect x="5" y="15" width="38" height="18" rx="2" style="fill:var(--card,#fff);stroke:var(--accent,#0b6e78);stroke-width:2"/><rect x="5" y="15" width="19" height="18" rx="2" style="fill:#7646bf"/><path d="M24 15v18M14.5 15v18M33.5 15v18" style="stroke:var(--accent,#0b6e78);stroke-width:1.5"/>'],
    ['areagrid', 'parts', 'Area grid', 'Tap squares to cover a shape and count its area.', { cols: 10, rows: 6 },
      '<g style="fill:#c25a12"><rect x="7" y="9" width="9" height="9" rx="1"/><rect x="18" y="9" width="9" height="9" rx="1"/><rect x="29" y="9" width="9" height="9" rx="1"/><rect x="7" y="20" width="9" height="9" rx="1"/><rect x="18" y="20" width="9" height="9" rx="1"/><rect x="29" y="20" width="9" height="9" rx="1"/></g><g style="fill:var(--line,#dfe5ee)"><rect x="7" y="31" width="9" height="9" rx="1"/><rect x="18" y="31" width="9" height="9" rx="1"/><rect x="29" y="31" width="9" height="9" rx="1"/></g>'],
    ['tiles', 'alg', 'Algebra tiles', 'Add positive and negative tiles. Remove zero pairs.', { x2: true },
      '<rect x="5" y="9" width="20" height="20" rx="2" style="fill:var(--mp-hund,#2f62c4)"/><rect x="28" y="9" width="7" height="20" rx="1.5" style="fill:var(--mp-tens,#2f9e44)"/><rect x="38" y="9" width="7" height="7" rx="1.5" style="fill:var(--mp-ones,#e0a100)"/><rect x="38" y="20" width="7" height="7" rx="1.5" style="fill:var(--bad,#b4283f)"/>'],
    ['geoboard', 'space', 'Geoboard', 'Tap pegs to stretch a band into a shape.', { size: 5 },
      '<g style="fill:var(--ink,#132039)"><circle cx="10" cy="10" r="2.2"/><circle cx="24" cy="10" r="2.2"/><circle cx="38" cy="10" r="2.2"/><circle cx="10" cy="24" r="2.2"/><circle cx="24" cy="24" r="2.2"/><circle cx="38" cy="24" r="2.2"/><circle cx="10" cy="38" r="2.2"/><circle cx="24" cy="38" r="2.2"/><circle cx="38" cy="38" r="2.2"/></g><path d="M24 10L38 38H10Z" style="fill:none;stroke:#c25a12;stroke-width:2.5;stroke-linejoin:round"/>'],
    ['clock', 'meas', 'Clock', 'Move the time forward or back and see how much time has passed.', { t: 540 },
      '<circle cx="24" cy="24" r="17" style="fill:var(--card,#fff);stroke:var(--ink,#132039);stroke-width:2.5"/><path d="M24 24V12" style="stroke:var(--mp-hund,#2f62c4);stroke-width:2.5"/><path d="M24 24h8" style="stroke:var(--ink,#132039);stroke-width:3"/>'],
    ['scale', 'meas', 'Kitchen scale', 'Put 1 kg, 100 g and 10 g blocks on the scale.', {},
      '<rect x="8" y="12" width="32" height="4" rx="2" style="fill:var(--ink2,#55627a)"/><path d="M14 16h20l3 22H11Z" style="fill:var(--line,#dfe5ee);stroke:var(--ink2,#55627a);stroke-width:1.5"/><circle cx="24" cy="28" r="6" style="fill:var(--card,#fff);stroke:var(--ink,#132039);stroke-width:1.5"/><path d="M24 28l3-3" style="stroke:var(--bad,#b4283f);stroke-width:1.5"/>'],
    ['coins', 'meas', 'Coins and bills', 'Tap coins and bills to add them. Tap one on the mat to take it away.', { set: [5, 10, 25, 100, 200, 500, 1000, 2000] },
      '<circle cx="18" cy="26" r="11" style="fill:#d9b44a;stroke:#a8862a;stroke-width:1.5"/><circle cx="31" cy="21" r="10" style="fill:#dfe3ea;stroke:#9aa3b2;stroke-width:1.5"/><circle cx="31" cy="21" r="5.5" style="fill:#d9b44a"/>']
  ];
  function icon(b) { return '<svg class="tb-ic" viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" focusable="false">' + b[5] + '</svg>'; }
  var SVG_UNDO = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 7L4 12l5 5M4 12h11a5 5 0 0 1 0 10h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SVG_MENU = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  M.toolbox = function (app, sub, ids) {
    var box = ids ? BOX.filter(function (b) { return ids.indexOf(b[0]) >= 0; }) : BOX;
    var cur = box.filter(function (b) { return b[0] === sub; })[0] || box[0], t = null;
    var grade = window.Atlas && Atlas.grade ? '<span class="tb-g">Grade ' + Atlas.grade + '</span>' : '';
    var menu = '<dialog class="tb-menu" aria-labelledby="tbmh"><div class="tb-mh"><h2 id="tbmh">Tools</h2>' + grade +
      '<button type="button" class="tb-x" aria-label="Close">&#10005;</button></div>' +
      SHELVES.map(function (s) {
        var on = box.filter(function (b) { return b[1] === s[0]; });
        if (!on.length) return '';
        return '<section class="tb-shelf"><h3><i class="tb-s-' + s[0] + '"></i>' + s[1] + '</h3><div class="tb-cards">' + on.map(function (b) {
          return '<a class="tb-card" href="#tools/' + b[0] + '"' + (b === cur ? ' aria-current="page"' : '') + '>' + icon(b) + '<span>' + b[2] + '</span></a>';
        }).join('') + '</div></section>';
      }).join('') + '</dialog>';
    app.innerHTML = '<div class="tb"><div class="tb-bar"><a class="tb-back" href="#home" aria-label="Back to the chapters">&#8249;</a><h1>' + cur[2] + '</h1><span class="tb-sp"></span>' +
      '<button type="button" class="tb-b" data-a="undo" hidden>' + SVG_UNDO + '<span>Undo</span></button>' +
      '<button type="button" class="tb-b" data-a="show" role="switch" aria-checked="false" hidden><span>Show number</span><i class="tb-sw" aria-hidden="true"></i></button>' +
      '<button type="button" class="tb-b" data-a="menu" aria-haspopup="dialog">' + SVG_MENU + '<span>Tools</span></button></div>' +
      (cur[3] ? '<p class="tb-how">' + cur[3] + '</p>' : '') + '<div class="tb-stage"></div>' + menu + '</div>';
    var undo = qs('[data-a="undo"]', app), show = qs('[data-a="show"]', app), dlg = qs('.tb-menu', app);
    function sync() { if (t && t.canUndo) undo.disabled = !t.canUndo(); }
    var opts = {}, k;
    for (k in cur[4]) opts[k] = cur[4][k];
    if (cur[0] === 'base10' && window.Atlas && Atlas.words) opts.words = Atlas.words;
    opts.onChange = sync;
    t = M.make(cur[0], qs('.tb-stage', app), opts);
    undo.hidden = !t.undo; show.hidden = !t.showNumbers;
    sync();
    undo.addEventListener('click', function () { t.undo(); });
    show.addEventListener('click', function () {
      var on = show.getAttribute('aria-checked') !== 'true';
      show.setAttribute('aria-checked', String(on));
      t.showNumbers(on);
    });
    qs('[data-a="menu"]', app).addEventListener('click', function () { dlg.showModal(); });
    qs('.tb-x', dlg).addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('.tb-card')) dlg.close(); });
    return t;
  };

  /* make a tool by name: Manip.make('base10', element, options) */
  M.make = function (name, root, opts) {
    if (!M[name] || typeof M[name] !== 'function') throw new Error('Unknown manipulative: ' + name);
    return M[name](root, opts || {});
  };
  M.list = ['base10', 'disks', 'clock', 'areagrid', 'scale', 'counters', 'tenframe', 'hundred', 'numberline', 'fractions', 'coins', 'geoboard', 'tiles'];
})();
