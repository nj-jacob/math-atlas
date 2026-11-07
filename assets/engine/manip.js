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
    var gr = window.Atlas && +Atlas.grade || 0, early = !!gr && gr <= 2, mid = !gr || gr >= 4, g5 = !gr || gr >= 5, g6 = !gr || gr >= 6, g7 = !gr || gr >= 7, g8 = !gr || gr >= 8;
    var FD = g5 ? FK_D.concat(12) : FK_D, DEC = g6 ? [10, 100, 1000] : g5 ? [10, 100] : mid ? [10] : [];
    var CUTS = mid ? [2, 3, 4, 5, 10] : [2, 3, 4, 5];
    var WINS = [['s', 'Strips'], ['c', 'Circle'], ['k', 'Counters'], ['n', 'Number line']].concat(mid ? [['g', 'Grid']] : [], g7 ? [['a', 'Area']] : [], mid ? [['y', 'Symbols']] : [],
      /* the Ratio windows (two-letter keys) show only in Ratio, and the windows above only outside it */
      gr === 3 || gr === 4 ? [['rk', 'Counters'], ['rt', 'Table'], ['ry', 'Symbols']] : [['rk', 'Counters'], ['rb', 'Bar'], ['rd', 'Double number line'], ['rt', 'Table']].concat(g7 ? [['rp', 'Graph']] : [], [['ry', 'Symbols']]));
    var DO = [['share', 'Share'], ['split', 'Split']].concat(g5 ? [['join', 'Join']] : [], [['line', 'Line up'], ['fill', 'Fill wholes'], ['count', 'Count on']],
      g5 ? [['comb', 'Combine']] : [], mid ? [['groups', 'Groups of']] : [], g5 ? [['fit', 'Fit into']] : [], g7 ? [['times', 'Times']] : [], !gr || gr >= 3 ? [['ratio', 'Ratio']] : []);
    /* with many moves, the Do row shows one set at a time: Explore (show and change an amount) or Calculate (work with two amounts) */
    var CALC = { comb: 1, groups: 1, fit: 1, times: 1, ratio: 1 }, sets = DO.length > 7, dset = 'e', tset = 'f';
    root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray mp-fktray"></div>' +
      '<div class="mp-dmain"><div class="mp-cmode mp-fkwin" role="group" aria-label="See it as"><span>See it as</span>' + WINS.map(function (w) { return '<button type="button" data-w="' + w[0] + '">' + w[1] + '</button>'; }).join('') + '</div>' +
      '<div class="mp-cmode mp-fkdo" role="group" aria-label="Do"><span>Do</span>' + (sets ? '<span class="mp-fkseg" role="group" aria-label="Kind of move"><button type="button" data-set="e">Explore</button><button type="button" data-set="c">Calculate</button></span>' : '') +
      DO.map(function (d) { return '<button type="button" data-m="' + d[0] + '">' + d[1] + '</button>'; }).join('') + '</div>' +
      '<div class="mp-read" aria-live="polite"></div><div class="mp-mat mp-fkmat"><div class="mp-fkwins"></div><div class="mp-snaps"></div></div><p class="mp-live sr" aria-live="polite"></p></div></div>';
    var tray = qs('.mp-fktray', root), mat = qs('.mp-mat', root), wins = qs('.mp-fkwins', mat), read = qs('.mp-read', root), snapsEl = qs('.mp-snaps', mat);
    /* state: the amounts (rows of piece sizes, 1 = a whole) and how each row was made (decimal pieces, or a typed number),
       the row pieces go to, the move, the windows on, the amount before the last split, join or packing, the sharing story,
       the piece Count on uses, Combine or Take away, the number of groups, the wholes to fit pieces into, whether Fit into fills
       an amount instead (Grade 7 and up), which lined-up amounts are negative (Grade 7 and up), and the ratio (Grade 3 and up) */
    var rows, tag, sel, mode, win, before, did, share, unit, op, grp, fitW, fitA, neg, rat, shown = false, hist = [], last = '';
    function fresh() {
      rows = [[]]; tag = [null]; sel = 0; mode = 'build'; win = { s: 1, c: 0, k: 0, n: 0, g: 0, a: 0, y: 0, rk: !g5 ? 1 : 0, rb: g5 ? 1 : 0, rd: g5 ? 1 : 0, rt: 1, rp: 0, ry: 0 }; before = null; did = null; fitA = 0; neg = []; rat = rFresh();
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
    function many(n, d) { var out = []; for (var i = 0; i < n; i++) out.push(d); return out; }
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
    /* an amount as one fraction (6/8 stays 6/8 when the pieces are one size), and written the way a child reads it best */
    function ratOf(row) { var o = oneSize(row); return o ? [row.length, o] : simp(amount(row)); }
    function nice(n, d) { return d === 1 ? fmt(n) : n > d ? mixed(n, d) : say(n, d); }
    /* a lined-up amount below 0 (Grade 7 and up) */
    function sv(r) { return (neg[r] ? -1 : 1) * val(rows[r]); }
    function sgn(r, t) { return neg[r] && rows[r].length ? '\u2212' + t : t; }
    function anyNeg() { return mode === 'line' && rows.some(function (row, r) { return neg[r] && row.length; }); }
    /* Times (Grade 7 and up): the first amount times a fraction of 1 whole or less, answer not yet simplified (6/12) */
    function timesRes() {
      if (mode !== 'times' || rows.length < 2 || !rows[0].length || !rows[1].length) return null;
      var a = ratOf(rows[0]), b = ratOf(rows[1]), n = a[0] * b[0], d = a[1] * b[1];
      return { a: a, b: b, n: n, d: d, f: simp([n, d]) };
    }
    /* Find one between (Grade 7 and up): cut two lined-up amounts into the same pieces, finer until one fits between */
    function betweenPlan() {
      if (!g7 || mode !== 'line' || rows.length < 2 || !rows[0].length || !rows[1].length || neg[0] || neg[1]) return null;
      var dec = decLook(0) && decLook(1), k = dec ? 10 : 2, L = did && did.btw ? did.btw * k : lcm(amount(rows[0])[1], amount(rows[1])[1]);
      var a = Math.round(val(rows[0]) * L), b = Math.round(val(rows[1]) * L);
      if (a === b) return null;
      while (Math.abs(a - b) < 2) { L *= k; a *= k; b *= k; }
      if (Math.max(a, b) > 120 || L > (dec ? 1000 : 60)) return null;
      return { L: L, a: a, b: b, m: Math.min(a, b) + Math.floor(Math.abs(a - b) / 2), dec: dec };
    }
    /* ---- what each move allows ---- */
    function multi() { return mode === 'line' || mode === 'comb' || mode === 'times' || (mode === 'fit' && fitA); }
    function allowed(k) {
      if ((k.length === 2) !== (mode === 'ratio')) return false;
      if (mode === 'ratio') return WINS.some(function (w) { return w[0] === k; });
      if (mode === 'share') return false;
      if (k === 'a') return mode === 'times';
      if (mode === 'times') return k === 's' || k === 'n' || k === 'y';
      if (mode === 'groups' || mode === 'fit' || mode === 'comb') return k === 's' || k === 'n';
      return true;
    }
    function on(k) { return !!win[k] && allowed(k); }
    function cap() { return mode === 'count' && mid ? FK_BIG : FK_MAX; }
    function full(d, r) {
      var nv = val(rows[r]) + 1 / d;
      if (mode === 'times') return d > FK_TOP ? 'Use fraction pieces.' : r === 1 ? (nv > 1 + 1e-9 ? 'The fraction to take is 1 whole or less.' : '')
        : nv > (g8 ? FK_MAX : 1) + 1e-9 ? (g8 ? 'The first amount is up to ' + FK_MAX + ' wholes.' : 'The first amount is 1 whole or less.') : '';
      if (mode === 'fit' && fitA && r === 0) return nv > FK_MAX + 1e-9 ? 'The amount is up to ' + FK_MAX + ' wholes.' : '';
      if (mode === 'fit') return nv > fitMax() + 1e-9 ? 'The piece to fit is ' + (fitMax() > 1 ? 'up to ' + FK_MAX + ' wholes.' : '1 whole or less.') : fitTo() / nv > 120 ? 'Use a bigger piece.' : '';
      if (mode === 'groups') return grp * nv > FK_BIG + 1e-9 ? 'All the groups together make up to ' + FK_BIG + '.' : '';
      if (mode === 'comb' && op === '+' && rows.length > 1) return nv + val(rows[1 - r]) > FK_MAX + 1e-9 ? 'Together they make up to ' + FK_MAX + ' wholes.' : '';
      return nv > cap() + 1e-9 ? 'The mat holds up to ' + cap() + ' wholes.' : '';
    }
    /* ---- the tray ---- */
    function trayHtml() {
      if (mode === 'ratio') return ratioTray();
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
    /* side: 0 for a strip from the left edge; 1 or -1 for a strip going right or left from 0 in the middle (negative amounts) */
    function stripRow(row, r, S, W, still, dec, side) {
      var x = 0, h = '', one = oneSize(row), v = val(row), q = side ? 2 : 1;
      function at(x, w) { return (side > 0 ? 0.5 + x / 2 : side < 0 ? 0.5 - (x + w) / 2 : x) * 100; }
      row.forEach(function (d, i) {
        var w = 1 / d / S;
        h += '<' + (still ? 'i' : 'button type="button"') + ' class="mp-fkp' + (w / q * W < 8 ? ' tiny' : '') + '" data-r="' + r + '" data-i="' + i + '" style="left:' + at(x, w) + '%;width:' + (w / q * 100) + '%;--c:' + fkCol(d) + '"' + (still ? '' : ' aria-label="' + (d === 1 ? '1 whole' : '1 ' + fkName(d)) + ', tap to take it off"') + '>' + pieceLabel(d, w / q * W, dec) + '</' + (still ? 'i' : 'button') + '>';
        x += w;
      });
      if (one && one > 1 && one <= FK_TOP) {
        var end = Math.max(1, Math.ceil(v - 1e-9)), k = row.length;
        for (; k < one * end && k < one * S; k++) h += '<i class="mp-fkg" style="left:' + at(k / one / S, 1 / one / S) + '%;width:' + (100 / one / S / q) + '%"></i>';
      }
      return h;
    }
    function wholeBar(S, W) {
      var h = '<div class="mp-fktrack mp-fkwhole">';
      for (var i = 0; i < S; i++) h += '<i class="mp-fkp" style="left:' + (i / S * 100) + '%;width:' + (100 / S) + '%;--c:' + fkCol(1) + '">' + pieceLabel(1, W / S) + '</i>';
      return h + '</div>';
    }
    function strips(W) {
      var S = span(), two = anyNeg(), h = '<div class="mp-fkw mp-fks"><div class="mp-fkwl">Strips' + (two ? ', from 0' : '') + '</div>' + wholeBar(two ? 2 * S : S, W);
      if (before) h += '<div class="mp-fkwl">' + (did && did.k ? 'Before' : did && did.j ? 'Before' : 'Before packing') + '</div><div class="mp-fktrack mp-fkbefore">' + stripRow(before, -1, S, W, true, isDec(sel)) + '</div><div class="mp-fkwl">' + (did && did.k ? 'Each piece cut into ' + did.k : did && did.j ? 'Every ' + did.j + ' pieces joined' : 'Packed into wholes') + '</div>';
      rows.forEach(function (row, r) {
        if (mode === 'comb' && r === 1) h += '<div class="mp-fkwl">' + (op === '+' ? 'Add' : 'Take away') + '</div>';
        h += '<div class="mp-fktrack mp-fkrow' + (rows.length > 1 && r === sel ? ' sel' : '') + '" data-r="' + r + '"' + '>' + stripRow(row, r, S, W, false, decLook(r), two ? (neg[r] ? -1 : 1) : 0) +
          (!row.length ? '<span class="mp-fkempty">' + (rows.length > 1 ? 'Tap a piece to fill this row' : 'Tap or drag a piece') + '</span>' : '') + '</div>';
      });
      if (mode === 'comb' && rows.length > 1 && rows[0].length && rows[1].length) {
        var c = combRes(), out = [];
        if (c) { for (var i = 0; i < c.n; i++) out.push(c.d); h += '<div class="mp-fkwl">' + (op === '+' ? 'Together' : 'What is left') + '</div><div class="mp-fktrack mp-fkres">' + stripRow(out, -2, S, W, true) + '</div>'; }
        else h += '<p class="mp-fknote">' + (oneSize(rows[0]) && oneSize(rows[0]) === oneSize(rows[1]) ? 'There is not enough to take that away.' : 'The pieces are different sizes.') + '</p>';
      }
      if (before && rows[0].length) h += '<i class="mp-fkvl" style="left:' + (val(rows[0]) / S * 100) + '%"></i>';
      if (two) h += '<i class="mp-fkvl" style="left:50%"></i>';
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
    /* Fit into: pieces fitted into whole wholes, or (Grade 7 and up) into an amount made in row 0, with the piece in row 1 */
    function fitMax() { return g8 && fitA ? FK_MAX : 1; }
    function fitTo() { return fitA ? val(rows[0]) : fitW; }
    function fitSpan() { return fitA ? Math.max(1, Math.ceil(Math.max(val(rows[0]), val(rows[1] || [])) - 1e-9)) : fitW; }
    function fitParts() {
      var row = rows[fitA ? 1 : 0] || [], v = val(row), t = fitA ? ratOf(rows[0]) : [fitW, 1];
      if (!row.length || !t[0] || v > fitMax() + 1e-9) return null;
      var f = ratOf(row), a = t[0] * f[1], b = t[1] * f[0], q = Math.floor(a / b + 1e-9);
      return { f: f, t: t, T: t[0] / t[1], v: v, q: q, rest: simp([a - q * b, b]), Q: simp([a, b]) };
    }
    function fitHtml(W) {
      var S = fitSpan(), P = fitA ? 1 : 0, h = '<div class="mp-fkw mp-fks"><div class="mp-fkwl">Strips</div>' + wholeBar(S, W);
      if (fitA) h += '<div class="mp-fkwl">The amount</div><div class="mp-fktrack mp-fkrow' + (sel === 0 ? ' sel' : '') + '" data-r="0">' + stripRow(rows[0], 0, S, W) + (!rows[0].length ? '<span class="mp-fkempty">Tap a piece</span>' : '') + '</div>';
      h += '<div class="mp-fkwl">The piece to fit</div><div class="mp-fktrack mp-fkrow' + (fitA && sel === 1 ? ' sel' : '') + '" data-r="' + P + '">' + stripRow(rows[P], P, S, W) + (!rows[P].length ? '<span class="mp-fkempty">Tap a piece</span>' : '') + '</div>';
      var p = fitParts();
      if (p) {
        var bw = p.v / S, c = rowCol(rows[P]), t = '', n = '';
        for (var i = 0; i < p.q; i++) {
          t += '<i class="mp-fkp mp-fkcopy' + (i % 2 ? ' odd' : '') + '" style="left:' + (i * bw * 100) + '%;width:' + (bw * 100) + '%;--c:' + c + '"></i>';
          if (bw * W >= 16) n += '<span style="left:' + ((i + 0.5) * bw * 100) + '%">' + (i + 1) + '</span>';
        }
        if (p.rest[0]) t += '<i class="mp-fkg mp-fkpart" style="left:' + (p.q * bw * 100) + '%;width:' + ((p.T / S - p.q * bw) * 100) + '%"></i>';
        h += '<div class="mp-fkwl">How many fit</div><div class="mp-fktrack mp-fkres">' + t + '</div><div class="mp-fkcnt">' + n + '</div>';
      } else if (rows[P].length) h += '<p class="mp-fknote">Make a piece of ' + (fitMax() > 1 ? 'up to ' + FK_MAX + ' wholes' : '1 whole or less') + '.</p>';
      return h + '</div>';
    }
    /* Times: the first amount, the fraction taken of it, and the answer */
    function timesHtml(W) {
      var S = Math.max(1, Math.ceil(val(rows[0]) - 1e-9)), h = '<div class="mp-fkw mp-fks"><div class="mp-fkwl">Strips</div>' + wholeBar(S, W);
      [['First amount', 0], ['Times', 1]].forEach(function (q) {
        var r = q[1];
        h += '<div class="mp-fkwl">' + q[0] + '</div><div class="mp-fktrack mp-fkrow' + (r === sel ? ' sel' : '') + '" data-r="' + r + '">' + stripRow(rows[r], r, S, W) + (!rows[r].length ? '<span class="mp-fkempty">Tap a piece to fill this row</span>' : '') + '</div>';
      });
      var t = timesRes();
      if (t) {
        var d = t.d <= FK_TOP ? t.d : t.f[1] <= FK_TOP ? t.f[1] : 0;
        h += '<div class="mp-fkwl">Answer</div><div class="mp-fktrack mp-fkres">' + (d ? stripRow(many(t.n * d / t.d, d), -2, S, W, true) : '<i class="mp-fkp" style="left:0;width:' + (t.n / t.d / S * 100) + '%;--c:' + fkCol(3) + '"></i>') + '</div>';
      }
      return h + '</div>';
    }
    /* the area model: each whole of the first amount is a square cut into columns; the fraction taken cuts it into rows */
    function areaHtml(Z) {
      var h = '<div class="mp-fkw mp-fka"><div class="mp-fkwl">Area</div>';
      if (!rows[0].length) return h + '<p class="mp-fknote">Make the first amount.</p></div>';
      var a = ratOf(rows[0]), b = rows[1] && rows[1].length ? ratOf(rows[1]) : [0, 1], n = Math.max(1, Math.ceil(a[0] / a[1] - 1e-9)), s = '';
      if (a[1] > FK_TOP || b[1] > FK_TOP) return h + '<p class="mp-fknote">Use pieces of one size to see the area.</p></div>';
      var cw = Z / a[1], rh = Z / b[1];
      for (var i = 0; i < n; i++) {
        var k = Math.min(a[1], a[0] - i * a[1]), g = '';
        for (var c = 0; c < a[1]; c++) for (var r = 0; r < b[1]; r++) {
          var inA = c < k, inB = r < b[0];
          g += '<rect class="mp-fka' + (inA && inB ? 2 : inA ? 1 : inB ? 3 : 0) + '" x="' + (c * cw).toFixed(1) + '" y="' + (r * rh).toFixed(1) + '" width="' + cw.toFixed(1) + '" height="' + rh.toFixed(1) + '"/>';
        }
        s += '<svg class="mp-fkarea" width="' + (Z + 16) + '" height="' + (Z + 16) + '" viewBox="-13 -13 ' + (Z + 16) + ' ' + (Z + 16) + '" aria-hidden="true">' + g +
          '<line class="mp-fkab" x1="0" y1="-8" x2="' + (k * cw).toFixed(1) + '" y2="-8"/>' + (b[0] ? '<line class="mp-fkac" x1="-8" y1="0" x2="-8" y2="' + (b[0] * rh).toFixed(1) + '"/>' : '') + '<rect class="mp-fkgo" width="' + Z + '" height="' + Z + '"/></svg>';
      }
      var t = timesRes(), leg = shown && t ? '<div class="mp-fkleg"><span><i class="mp-fka1"></i>' + nice(a[0], a[1]) + '</span><span><i class="mp-fka2"></i>' + say(b[0], b[1]) + ' of ' + nice(a[0], a[1]) + '</span><span><b>' + t.n + '</b> small parts, each ' + say(1, t.d) + '</span></div>' : '';
      return h + '<div class="mp-fkas">' + s + stk(leg) + '</div></div>';
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
        h += '<figure class="mp-fkgf">' + (shown && rows.length > 1 ? '<figcaption>' + stk(sgn(r, rowSay(row, r))) + '</figcaption>' : '') + '<div>';
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
      var any = false, t = timesRes(), list = mode === 'times' ? (t ? [[many(t.n, t.d), -1]] : []) : rows.map(function (row, r) { return [row, r]; });
      list.forEach(function (q) {
        var row = q[0], r = q[1];
        if (!row.length) return;
        any = true;
        h += '<div class="mp-fksym">' + forms(row, r).map(function (f, i) { return (i ? '<em>=</em>' : '') + '<span><b>' + stk(sgn(r, f[0])) + '</b><small>' + f[1] + '</small></span>'; }).join('') + '</div>';
      });
      return h + (any ? '' : '<p class="mp-fknote">' + (mode === 'times' ? 'Make both amounts to see the answer.' : 'Add pieces to see the symbols.') + '</p>') + '</div>';
    }
    function nline(W) {
      var S = span(), L = 1, top = 0, pad = 16, hops = [], pts = [], v0, p;
      rows.forEach(function (row) { row.forEach(function (d) { L = lcm(L, d); }); });
      function run(row, from, dir, col) { var at = from; row.forEach(function (d) { hops.push([at, at + dir / d, col || fkCol(d)]); at += dir / d; }); return at; }
      if (mode === 'groups') {
        v0 = val(rows[0]); S = Math.min(FK_BIG, Math.max(1, Math.ceil(grp * v0 - 1e-9)));
        if (rows[0].length) { for (var i = 0; i < grp; i++) hops.push([i * v0, (i + 1) * v0, 'var(--accent,#0b6e78)']); pts.push([grp * v0]); }
      } else if (mode === 'fit') {
        S = fitSpan(); p = fitParts(); var pc = rowCol(rows[fitA ? 1 : 0]);
        if (p) { for (i = 0; i < p.q; i++) hops.push([i * p.v, (i + 1) * p.v, pc]); if (p.rest[0]) hops.push([p.q * p.v, p.T, pc, 1]); pts.push([p.T]); }
      } else if (mode === 'times') {
        var tr = timesRes(); S = Math.max(1, Math.ceil(val(rows[0]) - 1e-9));
        if (rows[0].length) pts.push([val(rows[0]), rowCol(rows[0]), shown ? rowSay(rows[0], 0) : '']);
        if (tr) pts.push([tr.n / tr.d, null, shown ? nice(tr.f[0], tr.f[1]) : '']);
      } else if (mode === 'comb' && rows.length > 1) {
        v0 = run(rows[0], 0, 1);
        if (rows[1].length) { var end = run(rows[1], v0, op === '+' ? 1 : -1); if (combRes()) pts.push([end]); else hops = hops.filter(function (q) { return q[1] >= -1e-9; }); }
        else if (rows[0].length) pts.push([v0]);
      } else {
        rows.forEach(function (row, r) {
          if (rows.length === 1 && row.length <= 40) run(row, 0, neg[r] ? -1 : 1);
          if (row.length) pts.push([sv(r), rows.length > 1 ? rowCol(row) : null, shown && rows.length > 1 ? sgn(r, rowSay(row, r)) : '']);
        });
      }
      if (mode === 'groups' || mode === 'fit') { L = 1; (mode === 'fit' && fitA ? rows : [rows[0]]).forEach(function (row) { row.forEach(function (d) { L = lcm(L, d); }); }); }
      if (mode === 'times') { var tt = timesRes(); L = tt ? tt.d : 1; rows[0].forEach(function (d) { L = lcm(L, d); }); }
      var lo = anyNeg() ? -S : 0;
      if (L > FK_TOP || (W - 2 * pad) / (S - lo) / L < 7) L = (W - 2 * pad) / (S - lo) / 10 >= 7 && L % 10 === 0 ? 10 : 1;
      var x = function (v) { return pad + (v - lo) / (S - lo) * (W - 2 * pad); }, labs = pts.filter(function (q) { return q[2]; });
      /* labels for amounts lined up sit on up to 4 levels so they do not overlap */
      var lv = [], used = [];
      labs.slice().sort(function (a, b) { return a[0] - b[0]; }).forEach(function (q) {
        var k = 0, px = x(q[0]), wd = q[2].length * 9 + 10;
        while (used[k] != null && px - wd / 2 < used[k] + 4 && k < 3) k++;
        lv.push([q, k]); used[k] = px + wd / 2;
      });
      top = labs.length ? 16 * (1 + Math.max.apply(null, lv.map(function (z) { return z[1]; }).concat(0))) : 0;
      var H = 92 + top, s = '<svg class="mp-fknl" width="' + W + '" height="' + H + '" viewBox="0 ' + (-top) + ' ' + W + ' ' + H + '" aria-hidden="true"><line class="mp-fkax" x1="' + x(lo) + '" y1="60" x2="' + x(S) + '" y2="60"/>';
      for (i = lo * L; i <= S * L; i++) {
        var big = i % L === 0;
        s += '<line class="' + (big ? 'mp-fkt1' : 'mp-fkt2') + '" x1="' + x(i / L) + '" y1="' + (big ? 48 : 53) + '" x2="' + x(i / L) + '" y2="' + (big ? 72 : 67) + '"/>';
        if (big) s += '<text x="' + x(i / L) + '" y="89">' + (i < 0 ? '\u2212' + (-i / L) : i / L) + '</text>';
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
    /* ---- Ratio (Grade 3 and up): two amounts compared and scaled up, as counters, a bar, a double number line, a table,
       a graph (Grade 7 and up) and symbols. Grade 3 uses 1 to 2, 1 to 5 and 1 to 10; Grade 6 adds part of the whole and
       the amount for 1; Grade 7 adds Add (not proportional) beside Times; Grade 8 compares two mixes and finds a missing number. */
    var RT = {
      beads: { name: 'Beads', A: 'Red', B: 'Blue', ca: '#b4283f', cb: '#2f62c4', part: 'beads', more: 'has more red',
        pair: function (a, b) { return '<b>' + fmt(a) + '</b> red and <b>' + fmt(b) + '</b> blue'; } },
      juice: { name: 'Juice mix', A: 'Juice', B: 'Water', ca: '#c25a12', cb: '#5aa9d6', part: 'cups', more: 'is stronger',
        pair: function (a, b) { return '<b>' + fmt(a) + '</b> ' + (a === 1 ? 'cup' : 'cups') + ' of juice and <b>' + fmt(b) + '</b> of water'; } },
      apples: { name: 'Apples', A: 'Apples', B: 'Children', ca: '#2f9e44', cb: '#7b879c',
        pair: function (a, b) { return '<b>' + fmt(a) + '</b> ' + (a === 1 ? 'apple' : 'apples') + (b === 1 ? ' for each child' : ' for every <b>' + fmt(b) + '</b> children'); } },
      prices: { name: 'Prices', A: 'Apples', B: 'Dollars', ca: '#2f9e44', cb: '#9a6e00', money: 1,
        pair: function (a, b) { return '<b>' + fmt(a) + '</b> ' + (a === 1 ? 'apple' : 'apples') + ' for <b>' + rMoney(b) + '</b>'; } }
    };
    var RTS = gr === 3 ? ['beads'] : g6 ? ['beads', 'juice', 'apples', 'prices'] : ['beads', 'juice', 'apples'], R3 = [2, 5, 10];
    function rFresh() { return { a: gr === 3 ? 1 : 2, b: gr === 3 ? 5 : 3, k: 1, thing: 'beads', v: '', a2: 3, b2: 5, miss: null }; }
    function rNum(v) { return fmt(+v.toFixed(2)); }
    function rMoney(v) { return '$' + (Math.abs(v - Math.round(v)) < 1e-9 ? fmt(Math.round(v)) : v.toFixed(2)); }
    function rSecond(v) { return RT[rat.thing].money ? rMoney(v) : rNum(v); }
    function rPair(a, b) { return RT[rat.thing].money ? rNum(a) + ' for ' + rMoney(b) : rNum(a) + (gr && gr <= 4 ? ' to ' : ' : ') + rNum(b); }
    function rPct(n, d) { return String(+(n / d * 100).toFixed(1)) + '%'; }
    function rMaxK() { return Math.max(1, Math.min(12, Math.floor(120 / Math.max(rat.a, rat.b)))); }
    /* the columns of the table and double number line: [first, second, highlighted] */
    function rCols() {
      var a = rat.a, b = rat.b, k = rat.k, js = [], out = [];
      if (rat.v === 'miss' && rat.miss) {
        var m = rat.miss, f = m.f;
        if (Math.abs(f - Math.round(f)) < 1e-9 && f >= 1 && f <= 12) { for (var j = 1; j <= f; j++) out.push([m.base[0] * j, m.base[1] * j, j === f]); }
        else out = [[m.base[0], m.base[1], false], [1, m.base[1] / m.base[0], false], [m.t[0], m.t[1], true]].sort(function (p, q) { return p[0] - q[0]; });
        return out;
      }
      for (var i = 1; i <= k; i++) if (k <= 6 || i <= 3 || i === k) js.push(i);
      if (rat.v === 'one' && a > 1) out.push([1, b / a, true]);
      return out.concat(js.map(function (i) { return [i * a, i * b, rat.v !== 'one' && i === k && k > 1]; }));
    }
    function rTape(list, n) {
      return '<div class="mp-rtape">' + list.map(function (r) {
        var u = '';
        for (var i = 0; i < r[1]; i++) { var gs = r[3] && i && i % r[3] === 0; u += '<i class="' + (gs ? 'gs' : '') + '" style="width:calc(' + (100 / n) + '% - ' + (gs ? 6 : 0) + 'px);background:' + r[2] + '"></i>'; }
        return '<div><b>' + r[0] + '</b><div class="mp-ru">' + u + '</div></div>';
      }).join('') + '</div>';
    }
    /* one bar of a mix, out of 100%: the first amount and then the second, over a percent scale */
    function rPartSvg(a, b, W) {
      var t = RT[rat.thing], n = a + b, w = (W - 40) / n, s = '<svg class="mp-rsvg" width="' + W + '" height="110" viewBox="0 0 ' + W + ' 110" aria-hidden="true">';
      for (var i = 0; i < n; i++) s += '<rect x="' + (20 + i * w).toFixed(1) + '" y="8" width="' + w.toFixed(1) + '" height="42" rx="7" style="fill:' + (i < a ? t.ca : t.cb) + '" class="mp-rcell"/>';
      s += '<line class="mp-fkax" x1="20" y1="72" x2="' + (W - 20) + '" y2="72"/>';
      var at = a / n * 100;
      for (var p = 0; p <= 100; p += 10) { var X = 20 + p / 100 * (W - 40); s += '<line class="' + (p % 50 ? 'mp-fkt2' : 'mp-fkt1') + '" x1="' + X + '" y1="' + (p % 50 ? 66 : 62) + '" x2="' + X + '" y2="' + (p % 50 ? 78 : 82) + '"/>' + (p % 20 === 0 && (W > 420 || p % 50 === 0) && !(shown && Math.abs(p - at) < (W > 420 ? 9 : 16)) ? '<text x="' + X + '" y="100">' + p + '%</text>' : ''); }
      var x = 20 + a / n * (W - 40);
      return s + '<line class="mp-rmark" x1="' + x + '" y1="2" x2="' + x + '" y2="86"/>' + (shown ? '<text class="mp-rpl" x="' + x + '" y="100">' + rPct(a, n) + '</text>' : '') + '</svg>';
    }
    function rDnl(W) {
      var t = RT[rat.thing], cols = rCols(), max = Math.max.apply(null, cols.map(function (c) { return c[0]; })), L = W < 420 ? 64 : 84;
      var x = function (v) { return L + v / max * (W - L - 24); }, s = '<svg class="mp-rsvg" width="' + W + '" height="150" viewBox="0 0 ' + W + ' 150" aria-hidden="true">';
      [[42, t.A, t.ca], [110, t.B, t.cb]].forEach(function (q) { s += '<text class="mp-rlab" x="0" y="' + (q[0] + 5) + '" style="fill:' + q[2] + '">' + q[1] + '</text><line class="mp-fkax" x1="' + x(0) + '" y1="' + q[0] + '" x2="' + x(max) + '" y2="' + q[0] + '"/>'; });
      [[0, 0, false]].concat(cols).forEach(function (c) {
        var X = x(c[0]), m = rat.v === 'miss' && rat.miss;
        s += '<line class="' + (c[2] ? 'mp-rmark' : 'mp-rlink') + '" x1="' + X + '" y1="42" x2="' + X + '" y2="110"/>';
        [[42, c[0], -12, 0], [110, c[1], 30, 1]].forEach(function (q) {
          var hide = m && c[2] && q[3] === m.at % 2;
          s += '<line class="mp-fkt1" x1="' + X + '" y1="' + (q[0] - 8) + '" x2="' + X + '" y2="' + (q[0] + 8) + '"/>' + (shown || !q[1] ? '<text class="' + (c[2] ? 'mp-rpl' : '') + '" x="' + X + '" y="' + (q[0] + q[2]) + '">' + (hide ? '?' : q[3] ? rSecond(q[1]) : rNum(q[1])) + '</text>' : '');
        });
      });
      return s + '</svg>';
    }
    function rTable() {
      var t = RT[rat.thing], cols = rCols();
      return '<table class="mp-rtbl">' + [[t.A, 0], [t.B, 1]].map(function (r) {
        return '<tr><th>' + r[0] + '</th>' + cols.map(function (c) { return '<td' + (c[2] ? ' class="hi"' : '') + '>' + (shown ? (r[1] ? rSecond(c[1]) : rNum(c[0])) : '') + '</td>'; }).join('') + '</tr>';
      }).join('') + '</table>';
    }
    function rGraph(Z) {
      var t = RT[rat.thing], a = rat.a, b = rat.b, k = rat.k, pts = [], off = null, i;
      for (i = 1; i <= Math.max(k, rat.v === 'add' ? 3 : 1); i++) pts.push([i * a, i * b]);
      if (rat.v === 'add') off = [a + k, b + k];
      var top = Math.max.apply(null, pts.concat(off ? [off] : []).map(function (p) { return Math.max(p[0], p[1]); }));
      var st = [1, 2, 5, 10, 20, 25, 50].filter(function (q) { return top / q <= 8; })[0] || 100, max = Math.ceil(top / st) * st;
      var x = function (v) { return 40 + v / max * Z; }, y = function (v) { return Z + 30 - v / max * Z; }, s = '<svg class="mp-rsvg" width="' + (Z + 60) + '" height="' + (Z + 74) + '" viewBox="0 0 ' + (Z + 60) + ' ' + (Z + 74) + '" aria-hidden="true">';
      for (i = 0; i <= max; i += st) s += '<line class="mp-rgrid" x1="' + x(i) + '" y1="' + y(0) + '" x2="' + x(i) + '" y2="' + y(max) + '"/><line class="mp-rgrid" x1="' + x(0) + '" y1="' + y(i) + '" x2="' + x(max) + '" y2="' + y(i) + '"/>' +
        (shown ? '<text class="mp-rsm" x="' + x(i) + '" y="' + (y(0) + 18) + '">' + i + '</text>' + (i ? '<text class="mp-rsm" x="' + (x(0) - 10) + '" y="' + (y(i) + 4) + '" text-anchor="end">' + i + '</text>' : '') : '');
      s += '<line class="mp-fkax" x1="' + x(0) + '" y1="' + y(0) + '" x2="' + x(max) + '" y2="' + y(0) + '"/><line class="mp-fkax" x1="' + x(0) + '" y1="' + y(0) + '" x2="' + x(0) + '" y2="' + y(max) + '"/>';
      var e = Math.min(max / a, max / b);
      s += '<line class="mp-rline" x1="' + x(0) + '" y1="' + y(0) + '" x2="' + x(e * a) + '" y2="' + y(e * b) + '"/>';
      pts.forEach(function (p) { s += '<circle class="mp-rpt" cx="' + x(p[0]) + '" cy="' + y(p[1]) + '" r="8"/>'; });
      if (off) s += '<circle class="mp-roff" cx="' + x(off[0]) + '" cy="' + y(off[1]) + '" r="8"/>';
      return s + '<text class="mp-rlab" x="' + x(max / 2) + '" y="' + (Z + 70) + '" text-anchor="middle" style="fill:' + t.ca + '">' + t.A + '</text><text class="mp-rlab" x="0" y="' + (y(max) - 16) + '" style="fill:' + t.cb + '">' + t.B + '</text></svg>';
    }
    function rForms() {
      var t = RT[rat.thing], a = rat.a, b = rat.b, k = rat.k, g = gcd(a, b), out = [[rPair(a, b), 'ratio']];
      if (rat.v === 'miss' && rat.miss) { var m = rat.miss; return [[rPair(m.base[0], m.base[1]), 'ratio'], [rPair(m.t[0], m.t[1]), 'the same ratio']]; }
      if (rat.v === 'cmp') return [[a + '/' + (a + b), 'mix A'], [rPct(a, a + b), 'percent'], [rat.a2 + '/' + (rat.a2 + rat.b2), 'mix B'], [rPct(rat.a2, rat.a2 + rat.b2), 'percent']];
      if (g > 1) out.push([rPair(a / g, b / g), 'simplest']);
      if (k > 1 && rat.v !== 'add') out.push([rPair(k * a, k * b), k + ' times as much']);
      if (g6 && t.part) { var f = simp([a, a + b]); out.push([f[0] + '/' + f[1], t.A.toLowerCase() + ' of the whole'], [rPct(a, a + b), 'percent']); }
      if (g6 && t.money) out.push([rMoney(b / a), 'for 1 apple']);
      return out;
    }
    function ratioHtml(W) {
      var t = RT[rat.thing], a = rat.a, b = rat.b, k = rat.k, h = '', miss = rat.v === 'miss';
      if (miss && !rat.miss) return '<p class="mp-fknote">Type a proportion with one ?, like 3 : 5 = ? : 20.</p>';
      if (on('rk') && !miss) {
        var kid = rat.thing === 'apples' && b === 1, n = rat.v === 'add' ? 1 : k, dots = '';
        if (n * (a + (kid ? 0 : b)) > 150) h += '<div class="mp-fkw"><div class="mp-fkwl">Counters</div><p class="mp-fknote">Too many to show as counters: try the bar.</p></div>';
        else {
          for (var i = 0; i < n; i++) dots += '<div class="mp-rg"><div>' + new Array(a + 1).join('<i style="background:' + t.ca + '"></i>') + (kid ? '' : new Array(b + 1).join('<i style="background:' + t.cb + '"></i>')) + '</div><small>' + (kid ? 'Child ' : 'Group ') + (i + 1) + '</small></div>';
          h += '<div class="mp-fkw"><div class="mp-fkwl">Counters</div><div class="mp-rgs">' + dots + '</div></div>';
        }
      }
      if (on('rb') && !miss) {
        var bar;
        if (rat.v === 'part') bar = rPartSvg(a, b, W);
        else if (rat.v === 'cmp') bar = '<div class="mp-fkwl">Mix A</div>' + rPartSvg(a, b, W) + '<div class="mp-fkwl">Mix B</div>' + rPartSvg(rat.a2, rat.b2, W);
        else if (rat.v === 'add') {
          var N = Math.max(k * Math.max(a, b), Math.max(a, b) + k);
          bar = rTape([[t.A, a, t.ca], [t.B, b, t.cb]], N) + '<div class="mp-fkwl">Add ' + k + ' to both</div>' + rTape([[t.A, a + k, t.ca], [t.B, b + k, t.cb]], N) + '<div class="mp-fkwl">Times ' + k + '</div>' + rTape([[t.A, k * a, t.ca, a], [t.B, k * b, t.cb, b]], N);
        } else bar = (k * Math.max(a, b) > 60 ? '<p class="mp-fknote">Too long to show as a bar: try the double number line.</p>' : rTape([[t.A, k * a, t.ca, a], [t.B, k * b, t.cb, b]], k * Math.max(a, b)));
        h += '<!--bar--><div class="mp-fkw"><div class="mp-fkwl">Bar' + (rat.v === 'part' || rat.v === 'cmp' ? ', out of 100%' : '') + '</div>' + bar + '</div><!--/bar-->';
      }
      if (on('rd') && rat.v !== 'cmp' && rat.v !== 'add') h += '<div class="mp-fkw"><div class="mp-fkwl">Double number line</div>' + rDnl(W) + '</div>';
      if (on('rt') && rat.v !== 'cmp' && rat.v !== 'add') h += '<div class="mp-fkw"><div class="mp-fkwl">Table</div>' + rTable() + '</div>';
      if (on('rp') && !miss && rat.v !== 'cmp') {
        var side = W >= 600 && on('rb'), gw = '<div class="mp-fkw"><div class="mp-fkwl">Graph</div>' + rGraph(side ? Math.min(220, Math.round(W * 0.34)) : Math.min(W < 500 ? 180 : 260, W - 80)) + '</div>';
        h = side ? h.replace(/<!--bar-->([\s\S]*)<!--\/bar-->/, function (m, b) { return '<div class="mp-rtwo">' + b + gw + '</div>'; }) : h + gw;
      }
      if (on('ry')) h += '<div class="mp-fkw mp-fky"><div class="mp-fkwl">Symbols</div>' + (shown ? '<div class="mp-fksym">' + rForms().map(function (f, i) { return (i ? (f[1] === 'mix B' ? '<em class="mp-rsep"></em>' : '<em>=</em>') : '') + '<span><b>' + stk(f[0]) + '</b><small>' + f[1] + '</small></span>'; }).join('') + '</div>' : '<p class="mp-fknote">Turn on Show number to see the symbols.</p>') + '</div>';
      return h || '<p class="mp-fknote">Choose a way to see it.</p>';
    }
    function ratioRead() {
      var t = RT[rat.thing], a = rat.a, b = rat.b, k = rat.k, big = '', eq = '';
      if (rat.v === 'miss') {
        var m = rat.miss;
        if (!m) eq = 'Type a proportion with one <b>?</b>, like 3 : 5 = ? : 20';
        else {
          big = m.txt;
          var i = m.at % 2;
          eq = '<b>' + rNum(m.t[1 - i]) + '</b> is <b>' + rNum(m.f) + '</b> times ' + rNum(m.base[1 - i]) + ', so the missing number is <b>' + rNum(m.f) + '</b> times ' + rNum(m.base[i]) + ': <b>' + rNum(m.x) + '</b>';
        }
      } else if (rat.v === 'cmp') {
        var pa = a / (a + b), pb = rat.a2 / (rat.a2 + rat.b2);
        big = rPair(a, b) + ' or ' + rPair(rat.a2, rat.b2) + '?';
        eq = t.A.toLowerCase() + ' is <b>' + rPct(a, a + b) + '</b> of mix A and <b>' + rPct(rat.a2, rat.a2 + rat.b2) + '</b> of mix B, so ' + (Math.abs(pa - pb) < 1e-9 ? 'they are <b>the same mix</b>' : '<b>' + (pa > pb ? 'A' : 'B') + '</b> ' + t.more);
      } else if (rat.v === 'part') {
        big = rPair(a, b);
        eq = t.A.toLowerCase() + ' is <b>' + a + '</b> of <b>' + (a + b) + '</b> ' + t.part + ': <b>' + rPct(a, a + b) + '</b> of the mix';
      } else if (rat.v === 'one') {
        big = rPair(a, b) + ' = ' + rPair(1, b / a);
        eq = (t.money ? 'the price of <b>1</b>' : 'for <b>1</b>') + ': share ' + rSecond(b) + ' by <b>' + a + '</b>';
      } else if (rat.v === 'add') {
        big = rPair(a, b) + ' &rarr; ' + rPair(a + k, b + k);
        eq = a === b ? 'adding the same keeps <b>1 : 1</b> only because the two amounts are equal' : '<b>adding ' + k + '</b> to both changes the mix; <b>times ' + k + '</b> (' + rPair(k * a, k * b) + ') keeps it';
      } else if (gr && gr <= 4 && rat.thing === 'apples' && b === 1) {
        big = k + ' &times; ' + a + ' = ' + fmt(k * a);
        eq = t.pair(a, b) + ', <b>' + k + '</b> ' + (k === 1 ? 'child' : 'children');
      } else {
        var js = [];
        for (var j = 1; j <= k; j++) if (k <= 4 || j === 1 || j === k) js.push(rPair(j * a, j * b));
        big = js.join(' = ');
        eq = gr && gr <= 4 ? '<b>' + k + '</b> ' + (k === 1 ? 'group' : 'groups') + ' of ' + t.pair(a, b) : k > 1 ? 'the same ratio, <b>' + k + '</b> times as much' : t.pair(a, b);
      }
      return [big, eq];
    }
    /* a typed proportion like 3 : 5 = ? : 20 */
    function rParse(txt) {
      var m = txt.replace(/\s+/g, '').match(/^(\d+(?:\.\d+)?|\?):(\d+(?:\.\d+)?|\?)=(\d+(?:\.\d+)?|\?):(\d+(?:\.\d+)?|\?)$/);
      if (!m) return null;
      var v = m.slice(1, 5), at = v.indexOf('?');
      if (at < 0 || v.lastIndexOf('?') !== at) return null;
      v = v.map(function (q) { return q === '?' ? 0 : +q; });
      if (v.some(function (q, i) { return i !== at && (q <= 0 || q > 1000); })) return null;
      var bp = at < 2 ? [v[2], v[3]] : [v[0], v[1]], tp = at < 2 ? [v[0], v[1]] : [v[2], v[3]], i = at % 2, f = tp[1 - i] / bp[1 - i], x = f * bp[i];
      tp[i] = x;
      return { txt: txt.replace(/\s*:\s*/g, ' : ').replace(/\s*=\s*/g, ' = ').trim(), at: at, base: bp, t: tp, f: f, x: x };
    }
    function ratioTray() {
      var t = RT[rat.thing], cmp = rat.v === 'cmp';
      function step(key, lab, col, v) { return '<small><i class="mp-rdot" style="background:' + col + '"></i>' + lab + '</small><div class="mp-fkstep" data-r="' + key + '"><button type="button" data-v="-1" aria-label="Less ' + lab.toLowerCase() + '">&minus;</button><b>' + (key.charAt(1) === 'b' && t.money ? '$' + v : v) + '</b><button type="button" data-v="1" aria-label="More ' + lab.toLowerCase() + '">+</button></div>'; }
      if (rat.v === 'miss') return '';
      return (gr === 3 ? '<small><i class="mp-rdot" style="background:' + t.ca + '"></i>' + t.A + '</small><div class="mp-fkstep mp-rfix"><b>1</b></div>' : step('ra', (cmp ? 'A: ' : '') + t.A, t.ca, rat.a)) + step('rb', (cmp ? 'A: ' : '') + t.B, t.cb, rat.b) +
        (cmp ? step('ra2', 'B: ' + t.A, t.ca, rat.a2) + step('rb2', 'B: ' + t.B, t.cb, rat.b2) : '') +
        (RTS.length > 1 ? '<small>Things</small><div class="mp-fkthings">' + RTS.map(function (k) { return '<button type="button" data-rt="' + k + '" aria-pressed="' + (rat.thing === k) + '">' + RT[k].name + '</button>'; }).join('') + '</div>' : '');
    }
    function ratioSnaps() {
      var t = RT[rat.thing], v = rat.v, h = '';
      if (v === 'miss') return '<input class="mp-fkin" type="text" autocomplete="off" aria-label="Type a proportion with one question mark" placeholder="3 : 5 = ? : 20">' + btn('rsolve', 'Find it') + btn('rv', 'Find the missing number', true, null, ' data-v="miss"');
      if (g7) h += btn('rv', 'Times', v === '', null, ' data-v=""') + btn('rv', 'Add', v === 'add', null, ' data-v="add"');
      if (v !== 'cmp' && v !== 'part' && v !== 'one') {
        if (!g7) h += '<span class="mp-hint">' + (gr && gr <= 4 ? (rat.thing === 'apples' && rat.b === 1 ? 'Children' : 'Groups') : 'Times') + '</span>';
        h += btn('rk', '&minus;', null, rat.k <= 1, ' data-v="-1" aria-label="Less"') + '<b class="mp-fkcount">' + rat.k + '</b>' + btn('rk', '+', null, rat.k >= rMaxK(), ' data-v="1" aria-label="More"');
      }
      if (g6 && t.part) h += btn('rv', 'Part of the whole', v === 'part', null, ' data-v="part"');
      if (g6) h += btn('rv', 'For 1', v === 'one', null, ' data-v="one"');
      if (g8 && t.part) h += btn('rv', 'Compare two mixes', v === 'cmp', null, ' data-v="cmp"');
      if (g8) h += btn('rv', 'Find the missing number', false, null, ' data-v="miss"');
      return h;
    }
    /* ---- one redraw of everything ---- */
    function draw() {
      tray.innerHTML = stk(trayHtml());
      tray.classList.toggle('mp-fkshare', mode === 'share' || mode === 'ratio');
      tray.classList.toggle('mp-fkrat', mode === 'ratio');
      readout();
      /* the buttons sit over the bottom of the mat; leave room for them, however many rows they wrap to */
      snaps();
      mat.style.paddingBottom = (snapsEl.offsetHeight + 28) + 'px';
      var W = width();
      if (mode === 'share') wins.innerHTML = shareHtml();
      else if (mode === 'ratio') { wins.style.setProperty('--fkg', '18px'); wins.classList.remove('tight', 'tighter'); wins.innerHTML = stk(ratioHtml(W)); }
      else {
        var any = WINS.some(function (w) { return on(w[0]); }), sOn = on('s') || !any;
        /* fit every window on the mat: draw at full size, then make strips thinner, circles and grids smaller and counters
           tighter, step by step, until it all fits (a very full mat may still scroll) */
        var midOn = on('c') || on('k') || on('g') || on('a'), nc = rows.reduce(function (t, r) { return t + Math.max(1, Math.ceil(val(r) - 1e-9)); }, 0);
        var cs = getComputedStyle(mat), room = mat.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        var R0 = Math.max(30, Math.floor(Math.min(74, ((W - (on('k') ? 240 : 0) - (on('g') ? 220 : 0)) / nc - 36) / 2))), th0 = W < 500 ? 42 : 52;
        var G0 = Math.max(90, Math.min(200, Math.floor((on('c') || on('k') ? W / 2 : W) / Math.min(nc, 4)) - 24));
        var na = Math.max(1, Math.ceil(val(rows[0]) - 1e-9)), Z0 = Math.max(90, Math.min(220, Math.floor((W - (shown && W >= 560 ? 200 : 0)) / na) - 40));
        wins.style.setProperty('--fkw', W + 'px');
        for (var lv = 0; lv < 8; lv++) {
          wins.style.setProperty('--fkh', Math.max(30, th0 - lv * 4) + 'px');
          wins.style.setProperty('--kd', Math.max(10, 18 - lv * 1.5) + 'px');
          wins.style.setProperty('--fkg', Math.max(8, 18 - lv * 2) + 'px');
          wins.classList.toggle('tight', lv >= 3);
          wins.classList.toggle('tighter', lv >= 5);
          var sh = mode === 'groups' ? groupsHtml(W) : mode === 'fit' ? fitHtml(W) : mode === 'times' ? timesHtml(W) : strips(W);
          wins.innerHTML = (sOn ? sh : '') +
            (midOn ? '<div class="mp-fkmid">' + (on('c') ? circles(Math.max(24, Math.round(R0 * (1 - lv * 0.1)))) : '') + (on('k') ? counters() : '') + (on('g') ? grids(Math.max(70, Math.round(G0 * (1 - lv * 0.08)))) : '') + (on('a') ? areaHtml(Math.max(80, Math.round(Z0 * (1 - lv * 0.08)))) : '') + '</div>' : '') +
            (on('n') ? nline(W) : '') + (on('y') ? symbols() : '');
          if (!room || wins.offsetHeight <= room) break;
        }
      }
      wins.style.setProperty('--fkw', W + 'px');
      qsa('.mp-fkwin button', root).forEach(function (b) { var k = b.getAttribute('data-w'); b.setAttribute('aria-pressed', String(on(k))); b.hidden = (k.length === 2) !== (mode === 'ratio'); b.disabled = !allowed(k); });
      if (CALC[mode]) dset = 'c';
      qsa('.mp-fkdo [data-m]', root).forEach(function (b) { var m = b.getAttribute('data-m'); b.setAttribute('aria-pressed', String(m === mode)); b.hidden = sets && (dset === 'c') !== !!CALC[m]; });
      qsa('.mp-fkdo [data-set]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set') === dset)); });
    }
    function readout() {
      if (!shown) { read.innerHTML = ''; return; }
      if (mode === 'ratio') { var rr = ratioRead(); read.innerHTML = stk((rr[0] ? '<p class="mp-total"><span class="mp-num">' + rr[0] + '</span></p>' : '') + '<p class="mp-ceq">' + rr[1] + '</p>'); return; }
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
        var p = fitParts(), pr = rows[fitA ? 1 : 0], into = fitA ? nice(p ? p.t[0] : 0, p ? p.t[1] : 1) : fitW;
        if (fitA && !rows[0].length) eq = 'Make the amount to fill';
        else if (!pr.length) eq = fitA ? 'Now make the piece to fit into it' : 'Make the piece to fit into <b>' + pl(fitW, 'whole', 'wholes') + '</b>';
        else if (!p) eq = 'The piece to fit is <b>' + (fitMax() > 1 ? FK_MAX + ' wholes</b> or less' : '1 whole</b> or less');
        else {
          var P = nice(p.f[0], p.f[1]);
          big = into + ' &divide; ' + P + ' = ' + nice(p.Q[0], p.Q[1]);
          if (fitA) eq = (did && did.same ? 'in <b>' + fkNames(did.same) + '</b>: ' : '') + '<b>' + P + '</b> fits ' + (p.rest[0] ? '<b>' + p.q + '</b> ' + (p.q === 1 ? 'time' : 'times') + ', and <b>' + say(p.rest[0], p.rest[1]) + '</b> of another one fits in what is left' : 'exactly <b>' + p.q + '</b> ' + (p.q === 1 ? 'time' : 'times'));
          else if (p.f[0] === 1 && p.f[1] > 1) eq = '<b>' + words(p.f[1], p.f[1]) + '</b> fit in each whole, and there ' + (fitW === 1 ? 'is <b>1</b> whole' : 'are <b>' + fitW + '</b> wholes');
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
      } else if (mode === 'times' && rows.length > 1) {
        var t = timesRes();
        if (!rows[0].length) eq = 'Make the first amount';
        else if (!t) { big = rowSay(rows[0], 0); eq = 'Now make the fraction to take of it'; }
        else {
          var ta = t.a, tb = t.b, rem = ta[0] % ta[1];
          big = nice(ta[0], ta[1]) + ' &times; ' + say(tb[0], tb[1]) + ' = ' + say(t.n, t.d) + (t.f[1] !== t.d || t.n > t.d ? ' = ' + nice(t.f[0], t.f[1]) : '');
          eq = ta[0] <= ta[1] ? '<b>' + say(tb[0], tb[1]) + '</b> of <b>' + say(ta[0], ta[1]) + '</b>: cut the ' + say(ta[0], ta[1]) + ' into <b>' + tb[1] + '</b> rows and take <b>' + tb[0] + '</b>'
            : '<b>' + say(tb[0], tb[1]) + '</b> of each whole' + (rem ? ', and <b>' + say(tb[0], tb[1]) + '</b> of the ' + say(rem, ta[1]) : '') + ', then put them together';
        }
      } else if (mode === 'line' && did && did.btw && rows.length === 3) {
        var bq = rows.map(function (r, i) { return { i: i, v: val(r), n: r.length }; }).sort(function (p, q) { return p.v - q.v; });
        var bt = function (q) { return did.dec ? String(+decRow(rows[q.i])) : nice(simp([q.n, did.btw])[0], simp([q.n, did.btw])[1]); };
        var bp = function (q) { return did.dec ? decRow(rows[q.i]) : frac(q.n, did.btw); };
        big = bq.map(bt).join(' &lt; ');
        var mid3 = bq.filter(function (q) { return q.i === 2; })[0], ends3 = bq.filter(function (q) { return q.i !== 2; });
        eq = 'in <b>' + fkNames(did.btw) + '</b>, <b>' + bp(ends3[0]) + '</b> and <b>' + bp(ends3[1]) + '</b> have <b>' + bp(mid3) + '</b> between them';
      } else if (mode === 'line' && filled.length > 1) {
        var fl = rows.map(function (r, i) { return { i: i, v: sv(i), t: sgn(i, rowSay(r, i)) }; }).filter(function (q) { return rows[q.i].length; });
        if (fl.length === 2) {
          var X = fl[0], Y = fl[1], same = Math.abs(X.v - Y.v) < 1e-9;
          big = X.t + (same ? ' = ' : X.v > Y.v ? ' &gt; ' : ' &lt; ') + Y.t;
          if (!same && (neg[X.i] || neg[Y.i])) eq = '<b>' + (X.v > Y.v ? X.t : Y.t) + '</b> is further right on the number line' + (neg[X.i] && neg[Y.i] ? ': the further a negative number is from 0, the smaller it is' : '');
          else eq = same ? 'the same length: <b>equal' + (isDec(X.i) || isDec(Y.i) || tag[X.i] || tag[Y.i] ? ' amounts' : ' fractions') + '</b>' : '<b>' + (X.v > Y.v ? X.t : Y.t) + '</b> is longer' + (oneSize(rows[X.i]) && oneSize(rows[Y.i]) && rows[X.i].length === rows[Y.i].length && rows[X.i].length && !tag[X.i] && !tag[Y.i] ? ': ' + (oneSize(rows[X.i]) < oneSize(rows[Y.i]) ? 'fewer' : 'more') + ' people sharing means ' + (X.v > Y.v ? 'bigger' : 'smaller') + ' pieces' : '');
        } else {
          fl.sort(function (p, q) { return p.v - q.v; });
          big = fl.map(function (q) { return q.t; }).reduce(function (s, t, i) { return i ? s + (Math.abs(fl[i].v - fl[i - 1].v) < 1e-9 ? ' = ' : ' &lt; ') + t : t; }, '');
          eq = 'from shortest to longest';
        }
      } else if (mode === 'line' && neg[ri] && row.length) {
        big = sgn(ri, rowSay(row, ri)); eq = 'less than <b>0</b>';
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
        if (/%$/.test(big)) {
          var pv = val(row);
          big += ' = ' + nice(f[0], f[1]);
          if (pv > 1 + 1e-9) eq = 'more than <b>100%</b> is more than <b>1 whole</b>';
          else if (pv < 0.01 - 1e-9) eq = 'less than <b>1%</b> is less than <b>1 small square</b> of the grid';
        }
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
      if (mode === 'ratio') h += ratioSnaps();
      else if (mode === 'share') {
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
        if (g7) h += btn('sign', 'Plus', !neg[sel], null, ' data-v="0"') + btn('sign', 'Minus', !!neg[sel], null, ' data-v="1"');
        if (rows.length < (mid ? 4 : 3)) h += btn('row', 'Add a row');
        if (g7 && rows[1] && rows[0].length && rows[1].length && !neg[0] && !neg[1]) h += btn('btw', did && did.btw ? 'Cut finer' : 'Find one between', null, !betweenPlan());
        if (g6 && rows.length < 4) h += typeBox('3/4, 0.7 or 65%') + btn('type', 'Add number');
      } else if (mode === 'build' && g8) {
        h += typeBox('150%, 0.5% or 2/3') + btn('type', 'Show it');
      } else if (mode === 'comb') {
        h += btn('op', 'Combine', op === '+', null, ' data-o="+"') + btn('op', 'Take away', op === '-', null, ' data-o="-"');
        if (g6 && rows[1] && rows[0].length && rows[1].length && !combRes() && !(oneSize(rows[0]) && oneSize(rows[0]) === oneSize(rows[1]))) h += btn('same', 'Cut into same-size pieces', null, !sameSize());
      } else if (mode === 'groups') {
        h += '<span class="mp-hint">Groups</span>' + btn('grp', '&minus;', null, grp <= 1, ' data-v="-1" aria-label="One fewer group"') + '<b class="mp-fkcount">' + grp + '</b>' + btn('grp', '+', null, grp >= FK_BIG || (grp + 1) * val(rows[0]) > FK_BIG + 1e-9, ' data-v="1" aria-label="One more group"');
      } else if (mode === 'times') {
        h += [['First amount', 0], ['Times', 1]].map(function (q) { var r = q[1], a = ratOf(rows[r]); return btn('pick', q[0] + (shown && rows[r].length ? ' <b>' + nice(a[0], a[1]) + '</b>' : ''), sel === r, null, ' data-v="' + r + '"'); }).join('');
      } else if (mode === 'fit' && fitA) {
        h += btn('fita', 'Into wholes', false, null, ' data-v="0"') + btn('fita', 'Into an amount', true, null, ' data-v="1"');
        if (rows[0].length && rows[1].length && (!oneSize(rows[0]) || oneSize(rows[0]) !== oneSize(rows[1]))) h += btn('same', 'Cut into same-size pieces', null, !sameSize());
      } else if (mode === 'fit') {
        if (g7) h += btn('fita', 'Into wholes', true, null, ' data-v="0"') + btn('fita', 'Into an amount', false, null, ' data-v="1"');
        h += '<span class="mp-hint">Wholes</span>' + btn('fitw', '&minus;', null, fitW <= 1, ' data-v="-1" aria-label="One fewer whole"') + '<b class="mp-fkcount">' + fitW + '</b>' + btn('fitw', '+', null, fitW >= FK_BIG || (rows[0].length && (fitW + 1) / val(rows[0]) > 120), ' data-v="1" aria-label="One more whole"');
      }
      if (any && mode !== 'share' && mode !== 'ratio') h += btn('clear', 'Clear');
      snapsEl.innerHTML = stk(h);
      var ni = qs('.mp-fkin', snapsEl);
      if (ni) { ni.value = typed; if (focus) ni.focus(); }
    }
    function typeBox(eg) { return '<input class="mp-fkin" type="text" inputmode="decimal" autocomplete="off" aria-label="Type a fraction, decimal or percent" placeholder="' + eg + '">'; }
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
    function snapshot() { return JSON.stringify({ rows: rows, tag: tag, sel: sel, mode: mode, win: win, before: before, did: did, share: share, unit: unit, op: op, grp: grp, fitW: fitW, fitA: fitA, neg: neg, rat: rat }); }
    function act(fn) { var b = snapshot(); fn(); if (snapshot() !== b) { hist.push(b); if (hist.length > 60) hist.shift(); } draw(); change(); }
    function change() { if (o.onChange) o.onChange(state(), T); }
    function state() {
      var f = simp(amount(rows[0]));
      return { mode: mode, rows: rows.map(function (r) { return r.slice(); }), value: f, wins: Object.keys(win).filter(function (k) { return win[k]; }), share: { n: share.n, p: share.p, dealt: share.dealt, cut: share.cut }, op: op, groups: grp, wholes: fitW, ratio: { a: rat.a, b: rat.b, k: rat.k, thing: rat.thing, view: rat.v, a2: rat.a2, b2: rat.b2, missing: rat.miss ? rat.miss.x : null }, last: last };
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
        var to = mode === m ? 'build' : m, two = to === 'comb' || to === 'times', many = to === 'line' || two;
        if (multi() && !many) { rows = [rows[0]]; tag = [tag[0]]; sel = 0; }
        if (to !== 'fit') fitA = 0;
        if (to !== 'line') neg = [];
        if (many) {
          if (two) { rows = rows.slice(0, 2); tag = tag.slice(0, 2); }
          if (rows.length === 1 && (rows[0].length || two)) { rows.push([]); tag.push(null); sel = rows[0].length ? 1 : 0; }
          if (sel >= rows.length) sel = rows.length - 1;
        }
        if (to !== mode) settle();
        if (to === 'count' && rows[0].length) unit = oneSize(rows[0]) || rows[0][rows[0].length - 1];
        if (to === 'fill' && !win.n) win.n = 1;
        if (to === 'times') { win.a = 1; win.y = 1; win.s = 0; } else if (mode === 'times') win.s = 1;
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
      var rs = st && st.parentNode.getAttribute('data-r'), rth = th && th.getAttribute('data-rt');
      if (rs) { ratioStep(rs, +st.getAttribute('data-v')); return; }
      if (rth) { ratioThing(rth); return; }
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
        var r = mode === 'line' ? rows.map(function (x) { return x.length; }).indexOf(0) : 0;
        if (r < 0) { rows.push([]); tag.push(null); r = rows.length - 1; }
        rows[r] = got.row; tag[r] = { t: got.t }; sel = mode === 'line' ? Math.min(r + 1, rows.length - 1) : 0; settle(); last = 'type';
        if (mode !== 'line' && got.row.some(function (d) { return d >= 100; }) && allowed('g')) win.g = 1;
      });
      var ni = qs('.mp-fkin', snapsEl);
      if (ni) { ni.value = ''; ni.focus(); }
    }
    /* ratio moves: the two amounts (Grade 3 picks the second from 2, 5 and 10), the things compared, the view, and a typed proportion */
    function ratioStep(key, v) {
      var f = key.slice(1), n;
      if (gr === 3 && f === 'b') n = R3[R3.indexOf(rat.b) + v];
      else n = rat[f] + v;
      if (!(n >= 1 && n <= 12)) { bump(tray, 'mp-shake'); return; }
      act(function () { rat[f] = n; if (rat.v === 'miss') { rat.v = ''; rat.miss = null; } rat.k = Math.min(rat.k, rMaxK()); last = 'ratio-set'; });
    }
    var RSTART = { beads: [2, 3], juice: [3, 2], apples: [3, 1], prices: [4, 6] };
    function ratioThing(t) {
      act(function () {
        rat.thing = t; rat.a = RSTART[t][0]; rat.b = RSTART[t][1]; rat.k = 1; rat.miss = null;
        if (!RT[t].part && (rat.v === 'part' || rat.v === 'cmp')) rat.v = '';
        if (rat.v === 'miss') rat.v = '';
        last = 'thing';
      });
    }
    var RVIEW = { none: g5 ? ['rb', 'rd', 'rt'] : ['rk', 'rt'], part: ['rb', 'ry'], cmp: ['rb', 'ry'], one: ['rd', 'rt'], miss: ['rd', 'rt'], add: ['rb', 'rp'] };
    function ratioView(v) {
      act(function () {
        rat.v = rat.v === v && v !== '' ? '' : v; rat.miss = null;
        if (rat.v === 'add' && rat.k < 2) rat.k = 2;
        var w = RVIEW[rat.v] || RVIEW.none;
        ['rk', 'rb', 'rd', 'rt', 'rp', 'ry'].forEach(function (k) { win[k] = w.indexOf(k) >= 0 ? 1 : 0; });
        last = 'ratio-view';
      });
    }
    function ratioSolve() {
      var inp = qs('.mp-fkin', snapsEl), got = inp && rParse(inp.value);
      if (!got) { if (inp) { bump(inp, 'mp-shake'); announce(T, 'Type a proportion with one ?, like 3 : 5 = ? : 20.'); } return; }
      act(function () { rat.miss = got; last = 'ratio-solve'; });
      announce(T, 'The missing number is ' + rNum(got.x));
    }
    snapsEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.classList.contains('mp-fkin')) { e.preventDefault(); if (mode === 'ratio') ratioSolve(); else typeIn(); } });
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
        if (a === 'pick') { sel = v; draw(); }
        if (a === 'rk') act(function () { rat.k = Math.max(1, Math.min(rMaxK(), rat.k + v)); last = 'ratio-k'; });
        if (a === 'rv') ratioView(s.getAttribute('data-v'));
        if (a === 'rsolve') ratioSolve();
        if (a === 'sign') act(function () { neg[sel] = v; settle(); last = 'sign'; });
        if (a === 'fita') act(function () {
          if (v === fitA) return;
          if (v) { rows = [[], rows[0]]; tag = [null, tag[0]]; sel = 0; } else { rows = [rows[1] || []]; tag = [tag[1] || null]; sel = 0; }
          fitA = v; settle(); last = 'fita';
        });
        if (a === 'btw') act(function () {
          var bp = betweenPlan();
          rows = [many(bp.a, bp.L), many(bp.b, bp.L), many(bp.m, bp.L)]; tag = rows.map(function () { return bp.dec ? { dec: 1 } : null; }); neg = [];
          sel = 2; did = { btw: bp.L, dec: bp.dec }; before = null; last = 'btw';
        });
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
      rows = s.rows; tag = s.tag; sel = s.sel; mode = s.mode; win = s.win; before = s.before; did = s.did; share = s.share; unit = s.unit; op = s.op; grp = s.grp; fitW = s.fitW; fitA = s.fitA; neg = s.neg; rat = s.rat; last = 'undo';
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
    if (o.tool) return toolShape(root, o);
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
    if (o.tool) return toolArea(root, o);
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

  /* ================= Balance, Toolbox version =================
     Manip.balance(root, { tool: true }). A pan balance: put cubes (1), tens (Grade 2 and up), bags with a hidden number x
     (Grade 4 and up), 0.1 pieces (Grade 7 and up) and -1 balloons that pull up (Grade 8) on either side, and it tips to the
     heavier side. Moves: Free; Make it balance (dashed cubes show what the lighter side needs); Solve (Grade 4 and up: take
     the same from both sides, add the same to both, split both sides, cancel cube and balloon pairs, with every step listed);
     Try numbers (Grade 4 and up: put a number in the bag and see whether an inequality is true, on a number line).
     Grade 6 and up can type an equation or inequality to set up the balance. Numbers and signs show only with Show number. */
  var BL = { c: 1, k: 1, r: 10, t: 0.1, n: -1 }, BL_MAX = 30;
  function toolBal(root, o) {
    var T = base(root, 'bal');
    root.classList.add('mp-tool', 'mp-fkt', 'mp-balt');
    var gr = window.Atlas && +Atlas.grade || 0, g2 = !gr || gr >= 2, g3 = !gr || gr >= 3, g4 = !gr || gr >= 4, g6 = !gr || gr >= 6, g7 = !gr || gr >= 7, g8 = !gr || gr >= 8;
    var CAP = !gr || gr >= 2 ? 100 : 20;
    var KINDS = [['c', '1'], ['k', '1 red']].concat(g2 ? [['r', '10']] : [], g4 ? [['x', 'Bag of x']] : [], g7 ? [['t', '0.1']] : [], g8 ? [['n', '−1 balloon']] : []);
    var MODES = [['free', 'Free'], ['make', 'Make it balance']].concat(g4 ? [['solve', 'Solve'], ['try', 'Try numbers']] : []);
    root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray mp-fktray mp-btray"><small>Put on</small>' + KINDS.map(function (k) {
      return '<button type="button" class="mp-bpc" data-k="' + k[0] + '" aria-label="Put on ' + k[1] + '">' + trayIcon(k[0]) + '<b>' + k[1] + '</b></button>';
    }).join('') + '</div><div class="mp-dmain"><div class="mp-cmode mp-bdo" role="group" aria-label="Do"><span>Do</span>' +
      MODES.map(function (m) { return '<button type="button" data-m="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>' +
      '<div class="mp-read" aria-live="polite"></div><div class="mp-mat mp-fkmat mp-bmat"><div class="mp-bwin"></div><div class="mp-snaps"></div></div><p class="mp-live sr" aria-live="polite"></p></div></div>';
    var tray = qs('.mp-btray', root), mat = qs('.mp-bmat', root), win = qs('.mp-bwin', mat), read = qs('.mp-read', root), snapsEl = qs('.mp-snaps', mat);
    /* state: the two sides (lists of kinds), the side the tray fills, the move, the hidden number in the bags, whether the
       bags are open, the steps so far (Solve), the number tried (Try numbers), the sign to test and the numbers tried */
    var S, sel, mode, xv, peek, steps, tv, goal, tried, shown = false, hist = [], last = '', ang = 0;
    function fresh() { S = [[], []]; sel = 0; mode = 'free'; xv = 2 + Math.floor(Math.random() * 8); peek = false; steps = []; tv = 1; goal = '<'; tried = []; }
    function trayIcon(k) {
      if (k === 'x') return '<svg width="34" height="38" viewBox="0 0 34 38" aria-hidden="true">' + bagPath(17, 36, 34, 'x', false) + '</svg>';
      if (k === 'n') return '<svg width="28" height="40" viewBox="0 0 28 40" aria-hidden="true"><ellipse cx="14" cy="14" rx="11" ry="13" class="mp-bln"/><path d="M14 27q-4 6 0 12" class="mp-bstr"/></svg>';
      if (k === 'r') return '<svg width="16" height="62" viewBox="0 0 16 62" aria-hidden="true">' + rod(1, 1, 14, 60) + '</svg>';
      if (k === 't') return '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="10" y="2" width="7" height="22" rx="2" class="mp-bt"/></svg>';
      return '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="2" y="2" width="22" height="22" rx="4" class="mp-b' + k + '"/></svg>';
    }
    function rod(x, y, w, h) { var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" class="mp-br"/>'; for (var i = 1; i < 10; i++) s += '<line x1="' + x + '" x2="' + (x + w) + '" y1="' + (y + h * i / 10) + '" y2="' + (y + h * i / 10) + '" class="mp-brl"/>'; return s; }
    function bagPath(cx, by, w, lab, open) {
      var h = w * 1.12, l = cx - w / 2;
      return '<path d="M' + (l + w * .18) + ' ' + (by - h * .8) + ' Q' + cx + ' ' + (by - h) + ' ' + (l + w * .82) + ' ' + (by - h * .8) + ' L' + (l + w) + ' ' + (by - w * .12) + ' Q' + cx + ' ' + (by + w * .05) + ' ' + l + ' ' + (by - w * .12) + ' Z" class="mp-bbag' + (open ? ' open' : '') + '"/>' +
        '<path d="M' + (l + w * .22) + ' ' + (by - h * .8) + ' Q' + cx + ' ' + (by - h * .68) + ' ' + (l + w * .78) + ' ' + (by - h * .8) + '" class="mp-bbagt"/>' +
        '<text x="' + cx + '" y="' + (by - h * .28) + '" class="mp-bbagx' + (open ? ' open' : '') + '" style="font-size:' + Math.round(w * (String(lab).length > 2 ? .34 : .46)) + 'px">' + lab + '</text>';
    }
    /* ---- numbers ---- */
    function bagv() { return mode === 'try' ? tv : xv; }
    function wt(k) { return k === 'x' ? bagv() : BL[k]; }
    function tot(side) { return +side.reduce(function (t, k) { return t + wt(k); }, 0).toFixed(4); }
    function bags(side) { return side.filter(function (k) { return k === 'x'; }).length; }
    function con(side) { return +side.reduce(function (t, k) { return t + (k === 'x' ? 0 : BL[k]); }, 0).toFixed(4); }
    function anyBag() { return bags(S[0]) + bags(S[1]) > 0; }
    function num(v) { v = +(+v).toFixed(4); return v < 0 ? '−' + fmt(-v) : fmt(v); }
    function term(a) { return (a === 1 ? '' : a) + 'x'; }
    /* a side written for the child: x terms and a number once bags are used; before that the parts as they were put on
       (5 + 3), three or more equal parts in a row as times from Grade 3 (3 × 4) */
    function expr(side) {
      if (!side.length) return '0';
      if (anyBag()) {
        var a = bags(side), c = con(side);
        if (!a) return num(c);
        return term(a) + (c > 0 ? ' + ' + num(c) : c < 0 ? ' − ' + num(-c) : '');
      }
      var runs = [], prev = null;
      side.forEach(function (k) { var g = k === 'r' ? 'r' : k === 't' ? 't' : k === 'n' ? 'n' : k; if (g === prev) runs[runs.length - 1] += BL[k]; else runs.push(BL[k]); prev = g; });
      var out = [], i = 0;
      while (i < runs.length) {
        var j = i; while (g3 && j + 1 < runs.length && Math.abs(runs[j + 1] - runs[i]) < 1e-9 && runs[i] > 0) j++;
        if (j - i < 2) j = i;
        out.push(j > i ? (j - i + 1) + ' × ' + num(runs[i]) : num(runs[i]));
        i = j + 1;
      }
      return out.join(' + ').replace(/\+ −/g, '− ');
    }
    function sign() { var d = tot(S[0]) - tot(S[1]); return Math.abs(d) < 1e-9 ? '=' : d < 0 ? '<' : '>'; }
    /* ---- the balance ---- */
    function layout(side, si, PW, S0) {
      /* bags, tens, cubes and 0.1 pieces in rows from the pan floor up; balloons float above */
      var items = side.map(function (k, i) { return { k: k, i: i }; }).filter(function (q) { return q.k !== 'n'; });
      var n = items.length, u = Math.max(12, Math.min(S0, Math.floor((PW - 10) / Math.max(5, Math.ceil(Math.sqrt(n * 2.2)))) - 3));
      function size(k) { return k === 'x' ? [u * 1.8, u * 2] : k === 'r' ? [u * .62, u * 3.2] : k === 't' ? [u * .36, u] : [u, u]; }
      var rows = [], row = [], w = 0;
      items.forEach(function (q) { var s = size(q.k); if (row.length && w + s[0] > PW - 8) { rows.push(row); row = []; w = 0; } row.push(q); q.s = s; w += s[0] + 3; });
      if (row.length) rows.push(row);
      var out = '', y = -3;
      rows.forEach(function (r) {
        var rw = r.reduce(function (t, q) { return t + q.s[0] + 3; }, -3), x = -rw / 2, rh = Math.max.apply(null, r.map(function (q) { return q.s[1]; }));
        r.forEach(function (q) {
          var k = q.k, sw = q.s[0], sh = q.s[1], at = ' data-s="' + si + '" data-i="' + q.i + '"';
          if (k === 'x') out += '<g class="mp-bit"' + at + '>' + bagPath(x + sw / 2, y, sw, mode === 'try' ? num(tv) : peek ? num(xv) : 'x', mode === 'try' || peek) + '</g>';
          else if (k === 'r') out += '<g class="mp-bit"' + at + '>' + rod(x, y - sh, sw, sh) + '</g>';
          else out += '<rect class="mp-bit mp-b' + k + '"' + at + ' x="' + x.toFixed(1) + '" y="' + (y - sh).toFixed(1) + '" width="' + sw.toFixed(1) + '" height="' + sh.toFixed(1) + '" rx="' + (k === 't' ? 2 : 4) + '"/>';
          x += sw + 3;
        });
        y -= rh + 3;
      });
      return { svg: out, top: y, u: u };
    }
    function ghosts(PW, top, u, n) {
      var s = '', per = Math.max(1, Math.floor((PW - 8) / (u + 3))), rows = Math.ceil(n / per);
      for (var i = 0; i < n; i++) { var r = Math.floor(i / per), c = i % per, inRow = r === rows - 1 ? n - r * per : per, x = -(inRow * (u + 3) - 3) / 2 + c * (u + 3); s += '<rect class="mp-bghost" x="' + x.toFixed(1) + '" y="' + (top - (r + 1) * (u + 3)).toFixed(1) + '" width="' + u + '" height="' + u + '" rx="4"/>'; }
      return s;
    }
    function balanceSvg(W, H) {
      var narrow = W < 500, cx = W / 2, py = H * .26, half = W * (narrow ? .3 : .34), PW = W * (narrow ? .38 : .3), drop = H * .5, d = tot(S[1]) - tot(S[0]), sc = Math.max(2, (Math.abs(tot(S[0])) + Math.abs(tot(S[1]))) / 6);
      var a = Math.abs(d) < 1e-9 ? 0 : (d > 0 ? 1 : -1) * Math.max(2.5, Math.min(10, 10 * Math.tanh(Math.abs(d) / sc)));
      var miss = mode === 'make' && Math.abs(d) > 1e-9 ? Math.abs(d) : 0, ghostOn = miss && Math.abs(miss - Math.round(miss)) < 1e-9 && miss <= 40;
      var s = '<svg class="mp-bsvg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="A balance">';
      s += '<path class="mp-bpost" d="M' + cx + ' ' + py + ' L' + (cx - W * .06) + ' ' + (H - 14) + ' H' + (cx + W * .06) + ' Z"/><rect class="mp-bfoot" x="' + (cx - W * .12) + '" y="' + (H - 16) + '" width="' + (W * .24) + '" height="10" rx="5"/>';
      var S0 = Math.round(Math.min(30, W / (narrow ? 17 : 26)));
      [0, 1].forEach(function (i) {
        var side = S[i], L = layout(side, i, PW, S0), ni = [], b = '';
        side.forEach(function (k, q) { if (k === 'n') ni.push(q); });
        var n = ni.length;
        for (var j = 0; j < n; j++) {
          var bx = n === 1 ? 0 : -PW * .4 + j * (PW * .8 / (n - 1)), by = -drop * .62 - (j % 2) * 14, r = Math.max(10, Math.min(16, W / 50));
          b += '<path class="mp-bstr" d="M' + bx * .6 + ' -2 Q' + (bx - 6) + ' ' + (by / 2) + ' ' + bx + ' ' + (by + r * 1.2) + '"/><g class="mp-bit" data-s="' + i + '" data-i="' + ni[j] + '"><ellipse class="mp-bln" cx="' + bx + '" cy="' + by + '" rx="' + r + '" ry="' + r * 1.25 + '"/><text class="mp-blnt" x="' + bx + '" y="' + (by + 5) + '">−1</text></g>';
        }
        var g = ghostOn && ((d > 0 && i === 0) || (d < 0 && i === 1)) ? ghosts(PW, L.top, L.u, Math.round(miss)) : '';
        s += '<g class="mp-bpan' + (sel === i ? ' sel' : '') + '" data-side="' + i + '" style="transform:translate(' + (cx + (i ? 1 : -1) * half).toFixed(1) + 'px,' + (py + drop).toFixed(1) + 'px)">' +
          '<path class="mp-bstr" d="M0 ' + (-drop) + ' L' + (-PW / 2) + ' -6 M0 ' + (-drop) + ' L' + (PW / 2) + ' -6"/>' +
          '<path class="mp-bdish" d="M' + (-PW / 2 - 4) + ' -6 Q0 ' + (PW * .12) + ' ' + (PW / 2 + 4) + ' -6 Z"/><rect class="mp-bhit" x="' + (-PW / 2) + '" y="' + (-drop * .78) + '" width="' + PW + '" height="' + (drop * .78 + 10) + '"/>' +
          L.svg + g + b + '</g>';
      });
      s += '<g class="mp-bbeam" style="transform-origin:' + cx + 'px ' + py + 'px;transform:rotate(' + a + 'deg)"><line x1="' + (cx - half) + '" y1="' + py + '" x2="' + (cx + half) + '" y2="' + py + '"/><circle cx="' + cx + '" cy="' + py + '" r="' + Math.max(6, W / 90) + '"/></g>';
      if (shown && (S[0].length || S[1].length)) { var sg = sign(); s += '<g class="mp-bsign' + (sg === '=' ? ' eq' : '') + '"><circle cx="' + cx + '" cy="' + (py - H * .13) + '" r="' + Math.max(18, W / 32) + '"/><text x="' + cx + '" y="' + (py - H * .13 + Math.max(7, W / 80)) + '" style="font-size:' + Math.max(22, W / 26) + 'px">' + sg + '</text></g>'; }
      return { svg: s + '</svg>', a: a, cx: cx, py: py, half: half, drop: drop };
    }
    /* the pans hang from the ends of the beam: move them with it */
    function hang(svg, g, a) {
      var r = a * Math.PI / 180;
      qsa('.mp-bpan', svg).forEach(function (p, i) {
        var s = i ? 1 : -1, x = g.cx + s * g.half * Math.cos(r), y = g.py + s * g.half * Math.sin(r) + g.drop;
        p.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      qs('.mp-bbeam', svg).style.transform = 'rotate(' + a + 'deg)';
    }
    /* ---- Try numbers: the number line of numbers tried, and (with Show number) every number that works ---- */
    function trueAt(v) { var l = side(0, v), r = side(1, v); return goal === '<' ? l < r - 1e-9 : goal === '>' ? l > r + 1e-9 : Math.abs(l - r) < 1e-9; }
    function side(i, v) { return +(bags(S[i]) * v + con(S[i])).toFixed(4); }
    function trueNow() { return trueAt(tv); }
    function edge() { var a = bags(S[0]) - bags(S[1]); return a ? (con(S[1]) - con(S[0])) / a : null; }
    function range() {
      var b = edge(), lo = g8 ? -10 : 0, top = Math.max(10, tv + 1, b == null ? 0 : b + 3);
      tried.forEach(function (v) { top = Math.max(top, v + 1); });
      var hi = top <= 10 ? 10 : top <= 20 ? 20 : 50;
      return [lo, hi];
    }
    function tryLine(W) {
      var rg = range(), lo = rg[0], hi = rg[1], L = 26, x = function (v) { return L + (v - lo) / (hi - lo) * (W - 2 * L); }, s = '<svg class="mp-bsvg mp-bnl" width="' + W + '" height="76" viewBox="0 0 ' + W + ' 76" aria-hidden="true">';
      s += '<line class="mp-fkax" x1="' + (x(lo) - 10) + '" y1="30" x2="' + (x(hi) + 10) + '" y2="30"/>';
      var step = hi - lo <= 20 ? (W < 500 && hi - lo > 10 ? 2 : 1) : 5;
      for (var v = lo; v <= hi; v++) {
        var big = v % step === 0;
        s += '<line class="' + (big ? 'mp-fkt1' : 'mp-fkt2') + '" x1="' + x(v) + '" y1="' + (big ? 21 : 25) + '" x2="' + x(v) + '" y2="' + (big ? 39 : 35) + '"/>' + (big ? '<text x="' + x(v) + '" y="64">' + num(v) + '</text>' : '');
      }
      var b = edge(), a = bags(S[0]) - bags(S[1]);
      if (shown && b != null && b >= lo - 1e-9 && b <= hi + 1e-9) {
        var right = goal === '=' ? null : (goal === '>') === (a > 0), end = right ? hi : lo;
        if (right != null) s += '<line class="mp-bsol" x1="' + x(b) + '" y1="30" x2="' + x(Math.max(lo, Math.min(hi, end))) + '" y2="30"/>';
        s += '<circle class="' + (goal === '=' ? 'mp-bsolp' : 'mp-bsolo') + '" cx="' + x(b) + '" cy="30" r="9"/>';
      } else if (shown && b == null && trueAt(0)) s += '<line class="mp-bsol" x1="' + x(lo) + '" y1="30" x2="' + x(hi) + '" y2="30"/>';
      tried.concat(tried.indexOf(tv) < 0 ? [tv] : []).forEach(function (v) { s += '<circle class="' + (trueAt(v) ? 'mp-byes' : 'mp-bno') + (v === tv ? ' now' : '') + '" cx="' + x(v) + '" cy="30" r="8"/>'; });
      return '<div class="mp-fkw mp-bline"><div class="mp-fkwl">Numbers tried</div>' + s + '</svg></div>';
    }
    function stepsHtml() {
      if (mode !== 'solve' || !shown || !steps.length) return '';
      return '<div class="mp-bsteps"><div class="mp-fkwl">Steps</div>' + steps.map(function (q, i) { return '<div class="' + (i === steps.length - 1 ? 'now' : '') + '"><b>' + q[0] + '</b>' + (q[1] ? '<small>' + q[1] + '</small>' : '') + '</div>'; }).join('') + '</div>';
    }
    /* ---- one redraw ---- */
    function draw() {
      readout();
      snaps();
      mat.style.paddingBottom = (snapsEl.offsetHeight + 28) + 'px';
      qsa('.mp-bdo [data-m]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === mode)); });
      qsa('.mp-bpc', tray).forEach(function (b) { b.disabled = !!full(b.getAttribute('data-k'), sel); });
      var cs = getComputedStyle(mat), MW = (mat.clientWidth || 700) - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), MH = (mat.clientHeight || 500) - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      var st = stepsHtml(), beside = st && MW >= 760, W = Math.max(280, Math.min(820, MW - (beside ? 230 : 0))), lineH = mode === 'try' ? 110 : 0, stH = st && !beside ? 70 + steps.length * 30 : 0;
      var H = Math.round(Math.max(200, Math.min(W * (W < 500 ? .72 : .56), MH - lineH - stH - 12)));
      var g = balanceSvg(W, H), empty = !S[0].length && !S[1].length;
      win.classList.toggle('side', !!beside);
      win.innerHTML = '<div class="mp-bmain">' + g.svg + (empty ? '<p class="mp-fknote mp-bnote">' + (mode === 'try' ? 'Put a bag of x and some cubes on the balance.' : 'Tap or drag cubes onto a side.') + '</p>' : '') + '</div>' + st + (mode === 'try' ? tryLine(Math.min(W, 640)) : '');
      var svg = qs('.mp-bsvg', win);
      if (!T.fast && ang !== g.a) { hang(svg, g, ang); void svg.getBoundingClientRect(); svg.classList.add('mp-bmove'); }
      hang(svg, g, g.a);
      ang = g.a;
    }
    function readout() {
      if (!shown) { read.innerHTML = ''; return; }
      var big = '', eq = '', l = tot(S[0]), r = tot(S[1]), sg = sign(), empty = !S[0].length && !S[1].length;
      if (empty) { read.innerHTML = ''; return; }
      if (mode === 'try') {
        if (!anyBag()) eq = 'Put a bag of x on the balance to try numbers';
        else {
          var b = edge(), a = bags(S[0]) - bags(S[1]), ok = trueNow();
          big = expr(S[0]) + ' ' + goal + ' ' + expr(S[1]);
          eq = 'x = <b>' + num(tv) + '</b> makes <b>' + num(l) + ' ' + sg + ' ' + num(r) + '</b>: ' + (ok ? 'true' : 'not true');
          if (b == null) eq += trueAt(0) ? '. It is true for <b>every</b> number' : '. It is <b>never</b> true';
          else if (goal === '=') eq += '. It is true only for <b>x = ' + num(b) + '</b>';
          else eq += '. It is true for <b>x ' + (((goal === '>') === (a > 0)) ? '&gt;' : '&lt;') + ' ' + num(b) + '</b>';
        }
      } else if (mode === 'solve') {
        big = expr(S[0]) + ' ' + sg + ' ' + expr(S[1]);
        var done = solved();
        if (sg !== '=') eq = 'the two sides do not balance';
        else if (done) eq = 'one bag is alone: <b>x = ' + num(xv) + '</b>';
        else eq = steps.length > 1 ? steps[steps.length - 1][1] : 'do the same to both sides until one bag is alone';
      } else if (mode === 'make' && sg !== '=') {
        var lt = l < r, m = Math.abs(l - r);
        big = (lt ? expr(S[0]) + ' + ?' : expr(S[0])) + ' = ' + (lt ? expr(S[1]) : expr(S[1]) + ' + ?');
        eq = 'the lighter side needs <b>' + num(m) + '</b> more to make <b>' + num(Math.max(l, r)) + '</b>';
        if (anyBag()) eq = 'the lighter side needs <b>' + num(m) + '</b> more';
      } else {
        big = expr(S[0]) + ' ' + sg + ' ' + expr(S[1]);
        eq = anyBag() ? (sg === '=' ? 'the two sides balance' : 'the ' + (sg === '>' ? 'left' : 'right') + ' side is heavier')
          : sg === '=' ? 'both sides make <b>' + num(l) + '</b>' : '<b>' + num(Math.max(l, r)) + '</b> is more than <b>' + num(Math.min(l, r)) + '</b>';
      }
      read.innerHTML = (big ? '<p class="mp-total"><span class="mp-num">' + big.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span></p>' : '') + (eq ? '<p class="mp-ceq">' + eq + '</p>' : '');
    }
    function solved() { return [0, 1].some(function (i) { return bags(S[i]) === 1 && S[i].length === 1 && !bags(S[1 - i]); }) && sign() === '='; }
    function btn(a, t, on, dis, extra) { return '<button type="button" class="mp-snap" data-a="' + a + '"' + (extra || '') + (on != null ? ' aria-pressed="' + on + '"' : '') + (dis ? ' disabled' : '') + '>' + t + '</button>'; }
    function snaps() {
      var h = '', inp = qs('.mp-fkin', snapsEl), typed = inp ? inp.value : '', focus = inp && document.activeElement === inp, any = S[0].length || S[1].length;
      if (mode === 'solve') {
        h += '<span class="mp-hint">Take from both</span>' + btn('take', '1', null, !canTake(1), ' data-v="1"') + (g2 ? btn('take', '10', null, !canTake(10), ' data-v="10"') : '') + (g7 ? btn('take', '0.1', null, !canTake(0.1), ' data-v="0.1"') : '') + btn('takex', 'x', null, !(bags(S[0]) && bags(S[1])));
        if (g8) h += '<span class="mp-hint">Add to both</span>' + btn('add', '1', null, !canAdd('c'), ' data-v="c"') + btn('add', '−1', null, !canAdd('n'), ' data-v="n"') + btn('pairs', 'Cancel pairs', null, !hasPairs());
        h += '<span class="mp-hint">Split both into</span>' + [2, 3, 4, 5].map(function (n) { return btn('split', String(n), null, !canSplit(n), ' data-v="' + n + '"'); }).join('');
        h += btn('peek', 'Peek in the bag', peek, !anyBag()) + btn('new', 'New puzzle');
        if (g6) h += typeBox('2x + 3 = 11') + btn('type', 'Set up');
      } else if (mode === 'try') {
        h += btn('goal', '&lt;', goal === '<', null, ' data-v="<" aria-label="Less than"') + btn('goal', '=', goal === '=', null, ' data-v="=" aria-label="Equal to"') + btn('goal', '&gt;', goal === '>', null, ' data-v=">" aria-label="Greater than"');
        var rg = range();
        h += '<span class="mp-hint">Try x =</span>' + btn('tv', '&minus;', null, tv <= rg[0], ' data-v="-1" aria-label="One less"') + '<b class="mp-fkcount">' + num(tv) + '</b>' + btn('tv', '+', null, tv >= 50, ' data-v="1" aria-label="One more"');
        h += btn('new', 'New puzzle');
        if (g6) h += typeBox('x + 3 < 9') + btn('type', 'Set up');
      }
      if (any) h += btn('clear', 'Clear');
      snapsEl.innerHTML = h;
      var ni = qs('.mp-fkin', snapsEl);
      if (ni) { ni.value = typed; if (focus) ni.focus(); }
    }
    function typeBox(eg) { return '<input class="mp-fkin" type="text" autocomplete="off" aria-label="Type an equation" placeholder="' + eg + '">'; }
    /* ---- what a move can do ---- */
    function full(k, i) {
      var side = S[i];
      if (side.length >= BL_MAX) return 'A side holds up to ' + BL_MAX + ' things.';
      if (k === 'n' && side.filter(function (q) { return q === 'n'; }).length >= 12) return 'A side holds up to 12 balloons.';
      if (k === 'x' && bags(side) >= 6) return 'A side holds up to 6 bags.';
      if (k !== 'x' && k !== 'n' && con(side) + BL[k] > CAP + 1e-9) return 'A side holds up to ' + CAP + '.';
      return '';
    }
    function count(side, k) { return side.filter(function (q) { return q === k; }).length; }
    function ones(side) { return count(side, 'c') + count(side, 'k'); }
    /* take an amount from one side: a cube, or a ten broken into ones, or ten 0.1 pieces; in Grade 8 a balloon instead */
    function lastOne(side) { return Math.max(side.lastIndexOf('c'), side.lastIndexOf('k')); }
    function takeFrom(side, v) {
      var i, j;
      if (v === 10) {
        if ((i = side.lastIndexOf('r')) >= 0) { side.splice(i, 1); return true; }
        if (ones(side) < 10) return false;
        for (j = 0; j < 10; j++) side.splice(lastOne(side), 1);
        return true;
      }
      if (v === 0.1) {
        if ((i = side.lastIndexOf('t')) >= 0) { side.splice(i, 1); return true; }
        if (!ones(side)) return false;
        side.splice(lastOne(side), 1);
        for (j = 0; j < 9; j++) side.push('t');
        return true;
      }
      if (ones(side)) { side.splice(lastOne(side), 1); return true; }
      if ((i = side.lastIndexOf('r')) >= 0) { side.splice(i, 1); for (j = 0; j < 9; j++) side.push('c'); return true; }
      if (count(side, 't') >= 10) { for (j = 0; j < 10; j++) side.splice(side.lastIndexOf('t'), 1); return true; }
      if (g8 && count(side, 'n') < 12) { side.push('n'); return true; }
      return false;
    }
    function canTake(v) { return S.every(function (s) { return takeFrom(s.slice(), v); }); }
    function canAdd(k) { return S.every(function (s, i) { return !full(k, i); }); }
    function hasPairs() { return S.some(function (s) { return count(s, 'n') && (ones(s) || count(s, 'r')); }); }
    function canSplit(n) {
      return (S[0].length || S[1].length) && S.every(function (s) { var a = bags(s), c = con(s), q = c / n * (g7 ? 10 : 1); return a % n === 0 && Math.abs(q - Math.round(q)) < 1e-9; }) && S.some(function (s) { return s.length; });
    }
    /* an amount as things on the pan: tens, ones, 0.1 pieces; below zero as balloons */
    function build(a, c) {
      var out = [], i;
      for (i = 0; i < a; i++) out.push('x');
      if (c < 0) { for (i = 0; i < Math.round(-c); i++) out.push('n'); return out; }
      var t = Math.round(c * 10), tens = g2 ? Math.floor(t / 100) : 0, on = Math.floor((t - tens * 100) / 10), te = t % 10;
      for (i = 0; i < tens; i++) out.push('r');
      for (i = 0; i < on; i++) out.push('c');
      for (i = 0; i < te; i++) out.push('t');
      return out;
    }
    function fits(a, c) { var b = build(a, c); return b.length <= BL_MAX && count(b, 'n') <= 12 && c <= CAP + 1e-9; }
    /* a new puzzle for the grade: x + 5 = 12 (Grade 4), 3x = 15 or x + 27 = 64 (Grade 5), 2x + 3 = 11 (Grade 6),
       3x + 2 = x + 8 (Grade 7), x + 4 = -2 (Grade 8) */
    function puzzle() {
      var R = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }, p, x;
      for (var guard = 0; guard < 50; guard++) {
        var lvl = gr || 6;
        if (lvl <= 4) { x = R(2, 15); p = [1, R(1, 9), 0, 0]; }
        else if (lvl === 5) { x = R(2, 12); p = Math.random() < .5 ? [R(2, 4), 0, 0, 0] : [1, R(5, 30), 0, 0]; }
        else if (lvl === 6) { x = R(2, 8); p = [R(2, 4), R(1, 9), 0, 0]; }
        else if (lvl === 7) { x = R(1, 6); p = [R(2, 4), R(0, 8), 1, 0]; }
        else { x = R(-6, 6) || -3; p = [R(1, 3), R(-5, 6), 0, 0]; }
        p[3] = p[0] * x + p[1] - p[2] * x;
        if (fits(p[0], p[1]) && fits(p[2], p[3]) && p[3] !== 0) break;
      }
      return { L: build(p[0], p[1]), R: build(p[2], p[3]), x: x };
    }
    /* a typed equation or inequality: 2x + 3 = 11, 3x + 2 = x + 8, x + 4 = -2, x + 3 < 9 */
    function parse(txt, rel) {
      var t = txt.replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/×/g, ''), m = t.match(/^([^<>=]+)([<>=])([^<>=]+)$/);
      if (!m || (rel && rel !== m[2] && !(rel === '<>=' && /[<>=]/.test(m[2])))) return null;
      var sides = [m[1], m[3]].map(function (s) {
        var a = 0, c = 0, ok = true, terms = s.match(/[+-]?[^+-]+/g) || [];
        if (terms.join('') !== s) return null;
        terms.forEach(function (q) {
          var mm = q.match(/^([+-]?)(\d*\.?\d*)(x?)$/);
          if (!mm || (!mm[2] && !mm[3])) { ok = false; return; }
          var v = mm[2] === '' ? 1 : +mm[2], sg = mm[1] === '-' ? -1 : 1;
          if (isNaN(v)) { ok = false; return; }
          if (mm[3]) { if (sg < 0 || v !== Math.round(v)) ok = false; a += v; } else c += sg * v;
        });
        return ok ? [a, +c.toFixed(4)] : null;
      });
      if (!sides[0] || !sides[1]) return null;
      var bad = sides.some(function (s) { return s[0] > 6 || (!g8 && s[1] < 0) || (!g7 && Math.abs(s[1] - Math.round(s[1])) > 1e-9) || Math.abs(s[1] * 10 - Math.round(s[1] * 10)) > 1e-9 || (s[1] < 0 && Math.abs(s[1] - Math.round(s[1])) > 1e-9) || !fits(s[0], s[1]); });
      if (bad || sides[0][0] + sides[1][0] === 0) return null;
      return { s: sides, rel: m[2] };
    }
    function setUp() {
      var inp = qs('.mp-fkin', snapsEl), p = inp && parse(inp.value, mode === 'solve' ? '=' : '<>='), x = null;
      if (p && mode === 'solve') {
        var a = p.s[0][0] - p.s[1][0];
        x = a ? (p.s[1][1] - p.s[0][1]) / a : null;
        if (x == null || Math.abs(x * 10 - Math.round(x * 10)) > 1e-9 || (!g8 && x < 0) || (!g7 && Math.abs(x - Math.round(x)) > 1e-9)) p = null;
      }
      if (!p) { if (inp) { bump(inp, 'mp-shake'); announce(T, mode === 'solve' ? 'Type an equation with x on one or both sides, like 2x + 3 = 11.' : 'Type an inequality with x, like x + 3 < 9.'); } return; }
      act(function () {
        S = [build(p.s[0][0], p.s[0][1]), build(p.s[1][0], p.s[1][1])]; peek = false; tried = [];
        if (mode === 'solve') { xv = +x.toFixed(4); steps = [[expr(S[0]) + ' = ' + expr(S[1]), '']]; } else { goal = p.rel; tv = Math.max(range()[0], 1); }
        last = 'type';
      });
      var ni = qs('.mp-fkin', snapsEl);
      if (ni) ni.value = '';
    }
    function newPuzzle() {
      act(function () {
        var p = puzzle();
        S = [p.L, p.R]; peek = false; tried = [];
        if (mode === 'solve') { xv = p.x; steps = [[expr(S[0]) + ' = ' + expr(S[1]), '']]; }
        else {
          var R = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }, c = R(1, 6), e = c + R(3, 9), two = g6 && Math.random() < .5;
          S = [build(two ? 2 : 1, c), build(0, two ? e + R(2, 8) : e)]; goal = ['<', '>'][R(0, 1)]; tv = 1;
        }
        last = 'new';
      });
    }
    /* each Solve move is done to both sides and listed with the equation it leaves */
    function both(fn, say) {
      act(function () {
        fn();
        steps.push([expr(S[0]) + ' ' + sign() + ' ' + expr(S[1]), say]);
        last = 'solve';
      });
    }
    /* ---- moves ---- */
    function snapshot() { return JSON.stringify({ S: S, sel: sel, mode: mode, xv: xv, peek: peek, steps: steps, tv: tv, goal: goal, tried: tried }); }
    function act(fn) { var b = snapshot(); if (mode === 'try' && anyBag() && tried.indexOf(tv) < 0) tried.push(tv); fn(); if (snapshot() !== b) { hist.push(b); if (hist.length > 60) hist.shift(); } draw(); change(); }
    function change() { if (o.onChange) o.onChange(state(), T); }
    function state() { return { mode: mode, left: S[0].slice(), right: S[1].slice(), sign: sign(), x: xv, steps: steps.map(function (q) { return q[0]; }), tried: tried.slice(), last: last }; }
    function put(k, i) {
      if (i == null) i = sel;
      var no = full(k, i);
      if (no) { announce(T, no); bump(mat, 'mp-shake'); return; }
      act(function () { S[i].push(k); sel = i; if (mode === 'solve') steps = []; if (mode === 'try') tried = []; last = 'put'; });
      announce(T, 'Put ' + ({ c: '1', k: '1', r: '10', x: 'a bag of x', t: '0.1', n: 'a balloon' })[k] + ' on the ' + (i ? 'right' : 'left'));
    }
    function setMode(m) {
      act(function () {
        mode = m; peek = false; steps = []; tried = [];
        if (m === 'solve' && anyBag()) steps = [[expr(S[0]) + ' ' + sign() + ' ' + expr(S[1]), '']];
        last = 'mode';
      });
      if ((m === 'solve' || m === 'try') && !anyBag()) newPuzzle();
    }
    /* ---- events ---- */
    var drag = null, eat = false;
    tray.addEventListener('pointerdown', function (e) { var p = e.target.closest('.mp-bpc'); if (p && !p.disabled) drag = { k: p.getAttribute('data-k'), x: e.clientX, y: e.clientY, g: null }; });
    function move(e) {
      if (!drag) return;
      if (!drag.g && Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 8) {
        drag.g = document.createElement('div');
        drag.g.className = 'mp-ghost mp-bghostd';
        drag.g.innerHTML = trayIcon(drag.k);
        document.body.appendChild(drag.g);
      }
      if (drag.g) { e.preventDefault(); drag.g.style.transform = 'translate(' + (e.clientX - 14) + 'px,' + (e.clientY - 20) + 'px)'; }
    }
    function up(e) {
      if (!drag) return;
      var d = drag; drag = null;
      if (!d.g) return;
      d.g.remove(); eat = true;
      var m = mat.getBoundingClientRect();
      if (e.type !== 'pointerup' || e.clientX < m.left || e.clientX > m.right || e.clientY < m.top || e.clientY > m.bottom) return;
      put(d.k, e.clientX < m.left + m.width / 2 ? 0 : 1);
    }
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    tray.addEventListener('click', function (e) { if (eat) { eat = false; return; } var p = e.target.closest('.mp-bpc'); if (p) put(p.getAttribute('data-k')); });
    qs('.mp-bdo', root).addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b) setMode(b.getAttribute('data-m')); });
    snapsEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.classList.contains('mp-fkin')) { e.preventDefault(); setUp(); } });
    mat.addEventListener('click', function (e) {
      var s = e.target.closest('.mp-snap'), it = e.target.closest('.mp-bit'), pan = e.target.closest('.mp-bpan');
      if (s) {
        var a = s.getAttribute('data-a'), v = s.getAttribute('data-v');
        if (a === 'clear') act(function () { S = [[], []]; steps = []; tried = []; peek = false; last = 'clear'; });
        if (a === 'take') both(function () { S.forEach(function (sd) { takeFrom(sd, +v); }); }, 'take ' + num(+v) + ' from both');
        if (a === 'takex') both(function () { S.forEach(function (sd) { sd.splice(sd.lastIndexOf('x'), 1); }); }, 'take x from both');
        if (a === 'add') both(function () { S.forEach(function (sd) { sd.push(v); }); }, 'add ' + (v === 'n' ? '−1' : '1') + ' to both');
        if (a === 'pairs') both(function () { S.forEach(function (sd) { while (count(sd, 'n') && (ones(sd) || count(sd, 'r'))) { if (!ones(sd)) sd.splice(sd.lastIndexOf('r'), 1, 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'); sd.splice(lastOne(sd), 1); sd.splice(sd.lastIndexOf('n'), 1); } }); }, 'cancel each 1 with a −1');
        if (a === 'split') both(function () { var n = +v; S = S.map(function (sd) { return build(bags(sd) / n, con(sd) / n); }); }, 'split both into ' + v);
        if (a === 'peek') act(function () { peek = !peek; last = 'peek'; });
        if (a === 'new') newPuzzle();
        if (a === 'type') setUp();
        if (a === 'goal') act(function () { goal = v; last = 'goal'; });
        if (a === 'tv') act(function () { tv = +(tv + +v).toFixed(4); last = 'try'; });
        return;
      }
      if (it) { var si = +it.getAttribute('data-s'), ii = +it.getAttribute('data-i'); act(function () { S[si].splice(ii, 1); sel = si; if (mode === 'solve') steps = []; if (mode === 'try') tried = []; last = 'remove'; }); return; }
      if (pan) { sel = +pan.getAttribute('data-side'); draw(); }
    });
    T.put = put;
    T.undo = function () {
      if (!hist.length) return;
      var s = JSON.parse(hist.pop());
      S = s.S; sel = s.sel; mode = s.mode; xv = s.xv; peek = s.peek; steps = s.steps; tv = s.tv; goal = s.goal; tried = s.tried; last = 'undo';
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
  M.balance = function (root, o) { return toolBal(root, o || {}); };

  /* ================= Pattern builder (Toolbox) =================
     Make a pattern three ways: Repeat (a core of shapes repeated; letters, claps and from Grade 3 a table of positions),
     Numbers (start at, then add, take away, multiply or divide each time; on a number line, a number chart (Grades 1 to 3),
     a table and graph (Grade 4 and up), the rule and any term (Grade 6 and up), negative steps from Grade 7 and fractions in
     Grade 8) and Grow (Grade 4 and up: tile figures that grow, or shrink from Grade 5, with a table, a graph, and from Grade 6
     the rule and any step). Grade 7 and up can Compare two linear patterns on one table and graph. */
  var PP = { ro: ['o', 'r', 'red circle'], bs: ['s', 'b', 'blue square'], yt: ['t', 'y', 'yellow triangle'], gh: ['h', 'g', 'green hexagon'], bo: ['o', 'b', 'blue circle'], rs: ['s', 'r', 'red square'] };
  var PACT = ['clap', 'snap', 'stamp', 'tap', 'nod', 'jump'], PMAX = 24;
  /* a labelled window on a Toolbox mat, and a small answer chip (Pattern builder, Data and chance) */
  function box(label, inner, cls) { return '<div class="mp-fkw ' + (cls || '') + '"><div class="mp-fkwl">' + label + '</div>' + inner + '</div>'; }
  function chip(lab, val, on) { return '<div class="mp-pchip' + (on ? ' on' : '') + '"><small>' + lab + '</small><b>' + val + '</b></div>'; }
  function toolPat(root, o) {
    var T = base(root, 'pat');
    root.classList.add('mp-tool', 'mp-fkt', 'mp-patt');
    var gr = window.Atlas && +Atlas.grade || 0, g2 = !gr || gr >= 2, g3 = !gr || gr >= 3, g4 = !gr || gr >= 4, g5 = !gr || gr >= 5, g6 = !gr || gr >= 6, g7 = !gr || gr >= 7, g8 = !gr || gr >= 8;
    var MODES = [['rep', 'Repeat'], ['num', 'Numbers']].concat(g4 ? [['grow', 'Grow']] : [], g7 ? [['cmp', 'Compare']] : []);
    /* the steps a number pattern can take in this grade, smallest first */
    var STEPS = (function () {
      var add = [1, 2, 5, 10].concat(g2 ? [3, 4, 25] : [], g3 ? [50, 100] : [], g4 ? [0.1] : [], g5 ? [0.01] : [], g6 ? [0.5, 0.25] : []), out = [];
      add.forEach(function (v) { out.push({ op: '+', v: v }, { op: '+', v: -v }); });
      if (g8) [2, 3, 4].forEach(function (q) { out.push({ op: '+', v: 1 / q, q: q }, { op: '+', v: -1 / q, q: q }); });
      if (g4) out.push({ op: '×', v: 2 }, { op: '×', v: 10 });
      if (g5) out.push({ op: '÷', v: 10 });
      return out.sort(function (a, b) { return a.op === b.op ? a.v - b.v : a.op === '+' ? -1 : b.op === '+' ? 1 : a.op === '×' ? -1 : 1; });
    }());
    var SMAX = g3 ? 1000 : g2 ? 100 : 50, SMIN = g7 ? -100 : 0;
    root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray mp-fktray mp-ptray"></div><div class="mp-dmain"><div class="mp-cmode mp-pdo" role="group" aria-label="Make"><span>Make</span>' +
      MODES.map(function (m) { return '<button type="button" data-m="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>' +
      '<div class="mp-read" aria-live="polite"></div><div class="mp-mat mp-fkmat mp-pmat"><div class="mp-pwin"></div><div class="mp-snaps"></div></div><p class="mp-live sr" aria-live="polite"></p></div></div>';
    var tray = qs('.mp-ptray', root), mat = qs('.mp-pmat', root), win = qs('.mp-pwin', mat), read = qs('.mp-read', root), snapsEl = qs('.mp-snaps', mat);
    /* state: the move; Repeat: the core, how many times it shows, the hidden place, the view and the place asked about;
       Numbers: start, step, how many terms, the hidden term; Grow: step 1 and the change each step, how many steps;
       Compare: two starts and two rates; the views turned on and the term or step to predict */
    var P, shown = false, hist = [], last = '';
    function fresh() {
      P = { mode: 'rep', core: [], reps: 1, hide: -1, say: '', pos: 0, start: 2, si: idx('+', 2), k: 6, nhide: -1,
        s1: g6 ? 4 : g5 ? 18 : 2, a: g6 ? 3 : g5 ? -3 : 2, steps: 4, ghide: -1, A: [5, 2], B: [1, 4], ck: 4,
        view: { table: g3, graph: g4, rule: g6, line: true, chart: false }, at: 20 };
    }
    function idx(op, v) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i].op === op && Math.abs(STEPS[i].v - v) < 1e-9) return i; return 0; }
    /* ---- numbers ---- */
    function num(v, q) {
      v = +(+v).toFixed(6);
      if (q && Math.abs(v * q - Math.round(v * q)) < 1e-6 && Math.abs(v - Math.round(v)) > 1e-9) {
        var n = Math.round(Math.abs(v) * q), w = Math.floor(n / q), r = n % q;
        return (v < 0 ? '−' : '') + (w ? w + ' ' : '') + r + '/' + q;
      }
      return v < 0 ? '−' + fmt(+(-v).toFixed(4)) : fmt(+v.toFixed(4));
    }
    function rule(a, b, x) { x = x || 'n'; var s = a === 0 ? '' : a === 1 ? x : a === -1 ? '−' + x : num(a) + x; if (!s) return num(b); return s + (b > 0 ? ' + ' + num(b) : b < 0 ? ' − ' + num(-b) : ''); }
    function step() { return STEPS[P.si]; }
    function apply(v, s) { return +(s.op === '+' ? v + s.v : s.op === '×' ? v * s.v : v / s.v).toFixed(6); }
    function okVal(v) { return (g7 || v >= -1e-9) && Math.abs(v) <= 100000 && (s1q() || Math.abs(v * 10000 - Math.round(v * 10000)) < 1e-6); }
    function s1q() { return step().q || 0; }
    /* the terms of the number pattern; it stops before a number the grade does not use yet */
    function terms() { var v = P.start, out = [v]; while (out.length < P.k) { v = apply(v, step()); if (!okVal(v)) break; out.push(v); } return out; }
    function stepWords(s, pre) {
      if (s.op === '×') return 'multiply by <b>' + s.v + '</b> each time';
      if (s.op === '÷') return 'divide by <b>' + s.v + '</b> each time';
      if (s.v < 0 && !g7) return 'take away <b>' + num(-s.v, s.q) + '</b> each ' + pre;
      return 'add <b>' + num(s.v, s.q) + '</b> each ' + pre;
    }
    function stepLab(s) { return s.op === '+' ? (s.v < 0 ? '− ' + num(-s.v, s.q) : '+ ' + num(s.v, s.q)) : s.op + ' ' + s.v; }
    /* Grow: tiles in step n = a × n + b, where step 1 has s1 */
    function tiles(n) { return P.s1 + P.a * (n - 1); }
    function growMax() { var n = 1; while (n < 6 && tiles(n + 1) >= 0 && tiles(n + 1) <= 60) n++; return n; }
    /* Compare: value at step n = start + rate × n */
    function cv(p, n) { return p[0] + p[1] * n; }
    /* ---- Repeat ---- */
    function whole() { var out = []; for (var r = 0; r < P.reps; r++) out = out.concat(P.core); return out; }
    function letters() { var seen = []; return P.core.map(function (k) { if (seen.indexOf(k) < 0) seen.push(k); return String.fromCharCode(65 + seen.indexOf(k)); }); }
    function shapeSvg(k, s, cls) {
      var p = PP[k], h = s / 2, d = '';
      if (p[0] === 'o') d = '<circle cx="' + h + '" cy="' + h + '" r="' + (h - 3) + '"/>';
      if (p[0] === 's') d = '<rect x="4" y="4" width="' + (s - 8) + '" height="' + (s - 8) + '" rx="' + s / 9 + '"/>';
      if (p[0] === 't') d = '<path d="M' + h + ' 4L' + (s - 3) + ' ' + (s - 5) + 'H3Z" stroke-linejoin="round" stroke-width="3"/>';
      if (p[0] === 'h') d = '<path d="M' + h + ' 3L' + (s - 4) + ' ' + s * .27 + 'V' + s * .73 + 'L' + h + ' ' + (s - 3) + 'L4 ' + s * .73 + 'V' + s * .27 + 'Z"/>';
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 ' + s + ' ' + s + '" class="mp-psh mp-pc-' + p[1] + (cls ? ' ' + cls : '') + '" aria-hidden="true">' + d + '</svg>';
    }
    /* ---- the tray: shapes for Repeat, number steppers for the others ---- */
    function stepper(id, lab, val, wide) {
      return '<div class="mp-pst" data-st="' + id + '"><small>' + lab + '</small><b>' + val + '</b><div class="mp-pstr">' +
        '<button type="button" class="mp-pstb" data-st="' + id + '" data-d="-1" aria-label="' + lab + ': less">&minus;</button><button type="button" class="mp-pstb" data-st="' + id + '" data-d="1" aria-label="' + lab + ': more">+</button></div>' +
        (wide ? '<div class="mp-pstr"><button type="button" class="mp-pstb" data-st="' + id + '" data-d="-10" aria-label="' + lab + ': 10 less">&minus;10</button><button type="button" class="mp-pstb" data-st="' + id + '" data-d="10" aria-label="' + lab + ': 10 more">+10</button></div>' : '') + '</div>';
    }
    function trayHtml() {
      if (P.mode === 'rep') return '<small>Put on</small>' + Object.keys(PP).map(function (k) { return '<button type="button" class="mp-bpc mp-ppc" data-k="' + k + '" aria-label="Put on a ' + PP[k][2] + '"' + (P.core.length >= 8 ? ' disabled' : '') + '>' + shapeSvg(k, 34) + '<b>' + PP[k][2] + '</b></button>'; }).join('');
      if (P.mode === 'num') return stepper('start', 'Start at', num(P.start), g2) + stepper('step', 'Each time', stepLab(step()));
      if (P.mode === 'grow') return stepper('s1', 'Step 1 has', P.s1, g5) + stepper('a', 'Each step', (P.a < 0 ? '− ' + -P.a : '+ ' + P.a));
      return stepper('A0', 'A starts at', num(P.A[0])) + stepper('A1', 'A grows by', num(P.A[1])) + stepper('B0', 'B starts at', num(P.B[0])) + stepper('B1', 'B grows by', num(P.B[1]));
    }
    function nudge(id, d) {
      act(function () {
        if (id === 'start') P.start = Math.max(SMIN, Math.min(SMAX, P.start + d));
        if (id === 'step') P.si = Math.max(0, Math.min(STEPS.length - 1, P.si + (d > 0 ? 1 : -1)));
        if (id === 's1') P.s1 = Math.max(1, Math.min(g5 ? 40 : 20, P.s1 + d));
        if (id === 'a') { var a = P.a + d; if (a === 0) a += d; P.a = Math.max(g5 ? -6 : 1, Math.min(6, a)); }
        if (id === 'at') P.at = Math.max(1, Math.min(100, P.at + d));
        if (id === 'pos') P.pos = Math.max(1, Math.min(100, P.pos + d));
        if (id === 'A0' || id === 'B0' || id === 'A1' || id === 'B1') {
          var p = id[0] === 'A' ? P.A : P.B, j = +id[1], lo = j ? (g8 ? -6 : 0) : (g8 ? -20 : 0), hi = j ? 6 : 20;
          p[j] = Math.max(lo, Math.min(hi, p[j] + d));
        }
        P.nhide = -1; P.ghide = -1;
        if (P.mode === 'grow') P.steps = Math.min(P.steps, growMax());
        last = id;
      });
    }
    /* ---- drawing ---- */
    function nice(span, n) { var r = span / n, p = Math.pow(10, Math.floor(Math.log(r) / Math.LN10)), m = r / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }
    function graph(series, xs, W, H, q) {
      var all = [0]; series.forEach(function (s) { s.v.forEach(function (v) { if (v != null) all.push(v); }); });
      var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all); if (hi - lo < 1e-9) hi = lo + 1;
      var st = nice(hi - lo, 5); lo = Math.floor(lo / st + 1e-9) * st; hi = Math.ceil(hi / st - 1e-9) * st;
      var L = 46, B = 34, Tp = 10, R = 14, x0 = xs[0], x1 = xs[xs.length - 1] === x0 ? x0 + 1 : xs[xs.length - 1];
      var X = function (x) { return L + (x - x0) / (x1 - x0) * (W - L - R); }, Y = function (v) { return Tp + (hi - v) / (hi - lo) * (H - Tp - B); };
      var s = '<svg class="mp-pgr" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">';
      for (var v = lo; v <= hi + 1e-9; v += st) s += '<line class="' + (Math.abs(v) < 1e-9 ? 'mp-pgz' : 'mp-pgl') + '" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/><text class="mp-pgy" x="' + (L - 8) + '" y="' + (Y(v) + 4).toFixed(1) + '">' + num(+v.toFixed(6), q) + '</text>';
      xs.forEach(function (x) { s += '<text class="mp-pgx" x="' + X(x).toFixed(1) + '" y="' + (H - 14) + '">' + x + '</text>'; });
      series.forEach(function (sr) {
        var pts = []; xs.forEach(function (x, i) { if (sr.v[i] != null) pts.push(X(x).toFixed(1) + ',' + Y(sr.v[i]).toFixed(1)); });
        if (sr.line && pts.length > 1) s += '<polyline class="mp-pgline ' + sr.c + '" points="' + pts.join(' ') + '"/>';
        xs.forEach(function (x, i) { if (sr.v[i] != null) s += '<circle class="mp-pgd ' + sr.c + '" cx="' + X(x).toFixed(1) + '" cy="' + Y(sr.v[i]).toFixed(1) + '" r="6"/>'; });
      });
      return s + '</svg>';
    }
    function table(head, rows) {
      return '<table class="mp-ptbl"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) { return '<tr>' + r.map(function (c, j) { return '<td' + (j && head.length > 2 ? ' class="mp-pt' + j + '"' : '') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
    }
    function size() { var cs = getComputedStyle(mat); return [(mat.clientWidth || 700) - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), (mat.clientHeight || 500) - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)]; }
    function drawRep(W) {
      if (!P.core.length) return '<p class="mp-fknote">Tap shapes to make the core: the part that repeats.</p>';
      var all = whole(), L = letters(), n = all.length, per = Math.max(P.core.length, Math.floor(W / 62)), s = Math.max(28, Math.min(56, Math.floor(W / Math.min(n, per)) - 12));
      if (W < 500) s = Math.max(28, Math.min(44, s));
      var cell = function (k, i) {
        var c = i % P.core.length, lab = P.say === 'letters' ? L[c] : P.say === 'claps' ? PACT[L[c].charCodeAt(0) - 65] : '';
        if (i === P.hide) return '<button type="button" class="mp-pcell" data-hid="1" aria-label="Hidden: tap to show"><span class="mp-pq" style="width:' + s + 'px;height:' + s + 'px">?</span>' + (P.view.table && g3 ? '<small>' + (i + 1) + '</small>' : lab ? '<i>?</i>' : '') + '</button>';
        return '<button type="button" class="mp-pcell" data-i="' + i + '" aria-label="' + PP[k][2] + (i < P.core.length ? ', tap to take it off' : '') + '">' + shapeSvg(k, s) + (lab ? '<i>' + lab + '</i>' : '') + (P.view.table && g3 ? '<small>' + (i + 1) + '</small>' : '') + '</button>';
      };
      var h = '<div class="mp-pstrip">';
      for (var r = 0; r < P.reps; r++) h += '<div class="mp-pgrp' + (r ? '' : ' mp-pcore') + '">' + P.core.map(function (k, j) { return cell(k, r * P.core.length + j); }).join('') + '</div>';
      h += '</div>';
      if (g3 && P.view.table) {
        var kinds = []; P.core.forEach(function (k) { if (kinds.indexOf(k) < 0) kinds.push(k); });
        h += box('Positions', table(['shape', 'positions'], kinds.map(function (k) { var at = []; all.forEach(function (q, i) { if (q === k) at.push(i === P.hide ? '?' : i + 1); }); return [shapeSvg(k, 26) + ' ' + PP[k][2].split(' ')[1], at.join(', ')]; })), 'mp-pbox');
      }
      return h;
    }
    function drawLine(v, W) {
      var lo = Math.min(0, Math.min.apply(null, v)), hi = Math.max.apply(null, v.concat([lo + 1])), st = nice(hi - lo, W < 500 ? 5 : 10), q = s1q();
      lo = Math.floor(lo / st + 1e-9) * st; hi = Math.ceil(hi / st - 1e-9) * st;
      var Lm = 24, X = function (x) { return Lm + (x - lo) / (hi - lo) * (W - 2 * Lm); }, s = '<svg class="mp-pnl" width="' + W + '" height="110" viewBox="0 0 ' + W + ' 110" aria-hidden="true">';
      s += '<line class="mp-fkax" x1="' + (Lm - 10) + '" y1="70" x2="' + (W - Lm + 10) + '" y2="70"/>';
      var sub = st / (st >= 10 && (hi - lo) / st <= 10 ? 5 : 1);
      if ((hi - lo) / sub <= 100) for (var t = lo; t <= hi + 1e-9; t += sub) s += '<line class="mp-fkt2" x1="' + X(t).toFixed(1) + '" y1="65" x2="' + X(t).toFixed(1) + '" y2="75"/>';
      for (t = lo; t <= hi + 1e-9; t += st) s += '<line class="mp-fkt1" x1="' + X(t).toFixed(1) + '" y1="60" x2="' + X(t).toFixed(1) + '" y2="80"/><text x="' + X(t).toFixed(1) + '" y="102">' + num(+t.toFixed(6), q) + '</text>';
      if (v.length <= 12) for (var i = 0; i + 1 < v.length; i++) {
        var a = X(v[i]), b = X(v[i + 1]), up = Math.min(44, Math.max(14, Math.abs(b - a) * .6));
        s += '<path class="mp-pjump" d="M' + a.toFixed(1) + ' 64Q' + ((a + b) / 2).toFixed(1) + ' ' + (64 - up * 1.6).toFixed(1) + ' ' + b.toFixed(1) + ' 64"/>';
        if (Math.abs(b - a) > 44) s += '<text class="mp-pjl" x="' + ((a + b) / 2).toFixed(1) + '" y="' + (64 - up * .8 - 4).toFixed(1) + '">' + stepLab(step()).replace(' ', '') + '</text>';
      }
      v.forEach(function (x, i) { s += i === P.nhide ? '<text class="mp-pnq" x="' + X(x).toFixed(1) + '" y="76">?</text>' : '<circle class="mp-pnd' + (i === v.length - 1 ? ' last' : '') + '" cx="' + X(x).toFixed(1) + '" cy="70" r="8"/>'; });
      return s + '</svg>';
    }
    /* Grades 1 to 3: the hundred block the numbers sit in, coloured */
    function chartBlock(v) {
      if (!v.every(function (x) { return x >= 1 && Math.abs(x - Math.round(x)) < 1e-9; })) return null;
      var b = Math.floor((Math.min.apply(null, v) - 1) / 100) * 100;
      return Math.max.apply(null, v) <= b + 100 ? b : null;
    }
    function drawChart(v, b) {
      var h = '<div class="mp-pchart">';
      for (var i = 1; i <= 100; i++) { var x = b + i, j = v.indexOf(x); h += '<span class="' + (j >= 0 ? (j === P.nhide ? 'q' : 'on') : '') + '">' + (j === P.nhide ? '?' : x) + '</span>'; }
      return h + '</div>';
    }
    function predictLine(a, b, n, x) {
      var v = a * n + b;
      return (a === 1 ? n : (a === -1 ? '−' + n : num(a) + ' × ' + n)) + (b > 0 ? ' + ' + num(b) : b < 0 ? ' − ' + num(-b) : '') + ' = ' + num(v);
    }
    function drawNum(W) {
      var v = terms(), s = step(), q = s1q(), h = '', wide = W >= 640;
      if (P.view.line) h += box('Number line', drawLine(v, Math.min(W, 820)), 'mp-pbox');
      var b = !g4 && P.view.chart ? chartBlock(v) : null;
      if (b != null) h += box('Number chart', drawChart(v, b), 'mp-pbox');
      var lin = s.op === '+' && !q;
      if (shown && g6 && P.view.rule && s.op === '+') h += '<div class="mp-prow">' + chip('rule', rule(+s.v.toFixed(6), +(P.start - s.v).toFixed(6))) + (lin ? chip('term ' + P.at, predictLine(+s.v.toFixed(6), +(P.start - s.v).toFixed(6), P.at), true) : '') + '</div>';
      var parts = '';
      if (g4 && P.view.table) parts += box('Table', table(['term', 'value'], v.map(function (x, i) { return [i + 1, i === P.nhide ? '?' : num(x, q)]; })));
      if (g4 && P.view.graph) parts += box('Graph', graph([{ v: v.map(function (x, i) { return i === P.nhide ? null : x; }), c: 'a', line: s.op === '+' && g6 }], v.map(function (x, i) { return i + 1; }), wide ? 340 : Math.min(W - 10, 300), wide ? 230 : 200, q));
      if (parts) h += '<div class="mp-prow">' + parts + '</div>';
      return h;
    }
    function drawGrow(W, H) {
      var n = P.steps, figs = [], maxH = 1, cols = 0, a = Math.abs(P.a);
      for (var i = 1; i <= n; i++) {
        var t = tiles(i), f = { t: t, n: i, c: [] };
        if (P.a > 0) {
          /* the tiles there before step 1 sit on the left; each step adds a column, the newest one coloured */
          var base = Math.max(0, P.s1 - P.a), rest = t - base;
          for (var b = base; b > 0; b -= a) f.c.push([Math.min(a, b), 0, 0]);
          var full = Math.floor(rest / a), part = rest - full * a;
          if (part) f.c.push([part, 0, 0]);
          for (var c = 0; c < full; c++) f.c.push([a, c === full - 1 ? a : 0, 0]);
        } else {
          var gone = i > 1 ? a : 0, cnt = t + gone, cc = 0;
          for (var left = cnt; left > 0; left -= a) { var hgt = Math.min(a, left); f.c.unshift([hgt, 0, Math.max(0, Math.min(hgt, gone - cc))]); cc += hgt; }
        }
        f.c.forEach(function (q) { maxH = Math.max(maxH, q[0]); });
        cols += Math.max(1, f.c.length); figs.push(f);
      }
      var gapW = 34 * (n - 1) + 20, u = Math.max(8, Math.min(26, Math.floor((W - gapW) / Math.max(cols, 1)) - 2, Math.floor(Math.min(170, H * .32) / maxH) - 2));
      var h = '<div class="mp-pfigs">' + figs.map(function (f) {
        if (f.n - 1 === P.ghide) return '<div class="mp-pfig"><span class="mp-pq" style="width:' + Math.max(44, u * 2) + 'px;height:' + Math.max(44, u * 2) + 'px">?</span><small>step ' + f.n + '</small>' + (shown ? '<b>?</b>' : '') + '</div>';
        var w = Math.max(1, f.c.length) * (u + 2), hh = maxH * (u + 2), s = '<svg width="' + w + '" height="' + hh + '" viewBox="0 0 ' + w + ' ' + hh + '" aria-hidden="true">';
        f.c.forEach(function (col, x) { for (var y = 0; y < col[0]; y++) { var cls = y >= col[0] - col[2] ? 'mp-ptg' : col[1] ? 'mp-ptn' : 'mp-ptb'; s += '<rect class="' + cls + '" x="' + (x * (u + 2) + 1) + '" y="' + (hh - (y + 1) * (u + 2) + 1) + '" width="' + u + '" height="' + u + '" rx="' + Math.max(2, u / 6).toFixed(1) + '"/>'; } });
        return '<div class="mp-pfig">' + s + '</svg><small>step ' + f.n + '</small>' + (shown ? '<b>' + f.t + '</b>' : '') + '</div>';
      }).join('') + '</div>';
      var bb = P.s1 - P.a;
      if (shown && g6 && P.view.rule) h += '<div class="mp-prow">' + chip('rule', rule(P.a, bb)) + chip('step ' + P.at, predictLine(P.a, bb, P.at), true) + '</div>';
      var v = figs.map(function (f) { return f.n - 1 === P.ghide ? null : f.t; }), parts = '', wide = W >= 640;
      if (P.view.table) parts += box('Table', table(['step', 'tiles'], figs.map(function (f) { return [f.n, f.n - 1 === P.ghide ? '?' : f.t]; })));
      if (P.view.graph) parts += box('Graph', graph([{ v: v, c: 'a', line: g6 }], figs.map(function (f) { return f.n; }), wide ? 320 : Math.min(W - 10, 300), wide ? 210 : 190));
      if (parts) h += '<div class="mp-prow">' + parts + '</div>';
      return h;
    }
    function meet() {
      var da = P.A[1] - P.B[1], db = P.B[0] - P.A[0];
      if (!da) return db ? null : 'same';
      return db / da;
    }
    function drawCmp(W) {
      var xs = []; for (var i = 0; i <= P.ck; i++) xs.push(i);
      var a = xs.map(function (n) { return cv(P.A, n); }), b = xs.map(function (n) { return cv(P.B, n); }), wide = W >= 640, h = '';
      if (shown) {
        var m = meet(), mt = m === 'same' ? 'the same pattern' : m == null ? 'never: same rate' : m < -1e-9 ? 'not after step 0' : Math.abs(m - Math.round(m)) < 1e-9 ? 'step ' + Math.round(m) + ': ' + num(cv(P.A, Math.round(m))) : 'between step ' + Math.floor(m) + ' and ' + Math.ceil(m);
        h += '<div class="mp-prow">' + chip('A', rule(P.A[1], P.A[0])) + chip('B', rule(P.B[1], P.B[0])) + chip('they meet', mt, true) + '</div>';
      }
      h += '<div class="mp-prow">' + box('Table', table(['step', 'A', 'B'], xs.map(function (n, i) { return [n, num(a[i]), num(b[i])]; }))) +
        box('Graph', graph([{ v: a, c: 'a', line: true }, { v: b, c: 'b', line: true }], xs, wide ? 360 : Math.min(W - 10, 300), wide ? 240 : 200)) + '</div>';
      return h;
    }
    function draw() {
      tray.innerHTML = trayHtml();
      readout();
      snaps();
      qsa('.mp-pdo [data-m]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === P.mode)); });
      var sz = size(), W = Math.max(260, sz[0]);
      win.innerHTML = P.mode === 'rep' ? drawRep(W) : P.mode === 'num' ? drawNum(W) : P.mode === 'grow' ? drawGrow(W, sz[1]) : drawCmp(W);
    }
    function readout() {
      if (!shown) { read.innerHTML = ''; return; }
      var big = '', eq = '';
      if (P.mode === 'rep') {
        if (P.core.length) {
          big = letters().join(' ');
          eq = 'the core has <b>' + P.core.length + '</b> part' + (P.core.length > 1 ? 's' : '') + ', repeated <b>' + P.reps + '</b> time' + (P.reps > 1 ? 's' : '');
          if (P.hide >= 0) eq += '. What is at position <b>' + (P.hide + 1) + '</b>?';
          else if (g3 && P.view.table) { var k = P.core[(P.pos - 1) % P.core.length]; eq += '. Position <b>' + P.pos + '</b> is a <b>' + PP[k][2] + '</b>'; }
        }
      } else if (P.mode === 'num') {
        var v = terms(), q = s1q();
        big = v.map(function (x, i) { return i === P.nhide ? '?' : num(x, q); }).join(', ') + ', …';
        eq = 'start at <b>' + num(P.start) + '</b>, ' + stepWords(step(), 'time');
      } else if (P.mode === 'grow') {
        var t = []; for (var i = 1; i <= P.steps; i++) t.push(i - 1 === P.ghide ? '?' : tiles(i));
        big = t.join(', ');
        eq = 'step 1 has <b>' + P.s1 + '</b> tile' + (P.s1 === 1 ? '' : 's') + ', ' + (P.a > 0 ? 'add <b>' + P.a + '</b>' : 'take away <b>' + -P.a + '</b>') + ' each step';
      } else {
        big = 'A = ' + rule(P.A[1], P.A[0]) + ', B = ' + rule(P.B[1], P.B[0]);
        var hiS = P.A[0] === P.B[0] ? 'A and B start at the same number' : (P.A[0] > P.B[0] ? 'A' : 'B') + ' starts higher', fast = P.A[1] === P.B[1] ? 'they grow at the same rate' : (P.A[1] > P.B[1] ? 'A' : 'B') + ' grows faster';
        eq = hiS + ', ' + fast;
      }
      read.innerHTML = (big ? '<p class="mp-total"><span class="mp-num">' + big + '</span></p>' : '') + (eq ? '<p class="mp-ceq">' + eq + '</p>' : '');
    }
    function btn(a, t, on, dis, extra) { return '<button type="button" class="mp-snap" data-a="' + a + '"' + (extra || '') + (on != null ? ' aria-pressed="' + on + '"' : '') + (dis ? ' disabled' : '') + '>' + t + '</button>'; }
    function views(list) { return list.map(function (v) { return btn('view', v[1], !!P.view[v[0]], false, ' data-v="' + v[0] + '"'); }).join(''); }
    function count(id, lab, val, lo, hi) {
      return '<span class="mp-hint">' + lab + '</span>' + btn('st', '&minus;', null, val <= lo, ' data-st="' + id + '" data-d="-1" aria-label="' + lab + ': less"') + '<b class="mp-fkcount">' + val + '</b>' + btn('st', '+', null, val >= hi, ' data-st="' + id + '" data-d="1" aria-label="' + lab + ': more"') +
        (hi >= 50 ? btn('st', '+10', null, val + 10 > hi, ' data-st="' + id + '" data-d="10" aria-label="' + lab + ': 10 more"') : '');
    }
    function snaps() {
      var h = '';
      if (P.mode === 'rep') {
        var n = P.core.length;
        h += btn('rep', 'Repeat the core', null, !n || n * (P.reps + 1) > PMAX) + btn('unrep', 'Take one off', null, P.reps < 2) + btn('hide', P.hide >= 0 ? 'Show it' : 'Hide one', P.hide >= 0, P.reps < 2);
        h += btn('say', 'Letters', P.say === 'letters', !n, ' data-v="letters"') + (g3 ? '' : btn('say', 'Claps', P.say === 'claps', !n, ' data-v="claps"'));
        if (g3) { h += views([['table', 'Table']]); if (P.view.table && shown && n) h += count('pos', 'Position', P.pos, 1, 100); }
        if (n) h += btn('clear', 'Clear');
      } else if (P.mode === 'num') {
        var v = terms(), lin = step().op === '+' && !s1q();
        h += btn('next', 'Next number', null, v.length < P.k || P.k >= 12 || !okVal(apply(v[v.length - 1], step()))) + btn('fewer', 'Take one off', null, P.k <= 2) + btn('nhide', P.nhide >= 0 ? 'Show it' : 'Hide one', P.nhide >= 0, v.length < 3);
        h += views([['line', 'Number line']].concat(!g4 ? [['chart', 'Number chart']] : [], g4 ? [['table', 'Table'], ['graph', 'Graph']] : [], g6 ? [['rule', 'Rule']] : []));
        if (g6 && P.view.rule && shown && lin) h += count('at', 'Term', P.at, 1, 100);
      } else if (P.mode === 'grow') {
        h += btn('gnext', 'Next step', null, P.steps >= growMax()) + btn('gback', 'Take a step off', null, P.steps <= 1) + btn('ghide', P.ghide >= 0 ? 'Show it' : 'Hide a step', P.ghide >= 0, P.steps < 3);
        h += views([['table', 'Table'], ['graph', 'Graph']].concat(g6 ? [['rule', 'Rule']] : []));
        if (g6 && P.view.rule && shown) h += count('at', 'Step', P.at, 1, 100);
      } else {
        h += btn('cnext', 'Next step', null, P.ck >= 10) + btn('cback', 'Take a step off', null, P.ck <= 1);
      }
      snapsEl.innerHTML = h;
      if (P.mode === 'num' && !g4) { var cb = qs('[data-v="chart"]', snapsEl); if (cb) cb.disabled = chartBlock(terms()) == null; }
    }
    /* ---- moves ---- */
    function snapshot() { return JSON.stringify(P); }
    function act(fn) { var b = snapshot(); fn(); if (snapshot() !== b) { hist.push(b); if (hist.length > 60) hist.shift(); } draw(); change(); }
    function change() { if (o.onChange) o.onChange(state(), T); }
    function state() {
      return { mode: P.mode, core: P.core.slice(), reps: P.reps, letters: P.core.length ? letters().join('') : '', terms: terms(), step: stepLab(step()),
        tiles: (function () { var t = []; for (var i = 1; i <= P.steps; i++) t.push(tiles(i)); return t; }()), last: last };
    }
    function put(k) {
      if (P.core.length >= 8) { announce(T, 'A core holds up to 8 shapes.'); bump(mat, 'mp-shake'); return; }
      act(function () { P.core.push(k); while (P.core.length * P.reps > PMAX) P.reps--; P.hide = -1; P.pos = P.core.length * P.reps + 1; last = 'put'; });
      announce(T, 'Put on a ' + PP[k][2]);
    }
    tray.addEventListener('click', function (e) {
      var p = e.target.closest('.mp-ppc'), s = e.target.closest('.mp-pstb');
      if (p && !p.disabled) put(p.getAttribute('data-k'));
      if (s) nudge(s.getAttribute('data-st'), +s.getAttribute('data-d'));
    });
    qs('.mp-pdo', root).addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b) act(function () { P.mode = b.getAttribute('data-m'); last = 'mode'; }); });
    mat.addEventListener('click', function (e) {
      var s = e.target.closest('.mp-snap'), c = e.target.closest('.mp-pcell');
      if (s) {
        var a = s.getAttribute('data-a'), v = s.getAttribute('data-v');
        if (a === 'st') return nudge(s.getAttribute('data-st'), +s.getAttribute('data-d'));
        act(function () {
          var R = function (lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); };
          if (a === 'rep') { P.reps++; P.pos = P.core.length * P.reps + 1; }
          if (a === 'unrep') { P.reps--; if (P.hide >= P.core.length * P.reps) P.hide = -1; P.pos = P.core.length * P.reps + 1; }
          if (a === 'hide') P.hide = P.hide >= 0 ? -1 : R(P.core.length, P.core.length * P.reps - 1);
          if (a === 'say') P.say = P.say === v ? '' : v;
          if (a === 'view') P.view[v] = !P.view[v];
          if (a === 'clear') { P.core = []; P.reps = 1; P.hide = -1; }
          if (a === 'next') P.k++;
          if (a === 'fewer') { P.k = Math.min(terms().length, P.k) - 1; if (P.nhide >= P.k) P.nhide = -1; }
          if (a === 'nhide') P.nhide = P.nhide >= 0 ? -1 : R(1, terms().length - 1);
          if (a === 'gnext') P.steps++;
          if (a === 'gback') { P.steps--; if (P.ghide >= P.steps) P.ghide = -1; }
          if (a === 'ghide') P.ghide = P.ghide >= 0 ? -1 : R(1, P.steps - 1);
          if (a === 'cnext') P.ck++;
          if (a === 'cback') P.ck--;
          last = a;
        });
        return;
      }
      if (c) {
        if (c.hasAttribute('data-hid')) return act(function () { P.hide = -1; last = 'show'; });
        var i = +c.getAttribute('data-i');
        if (i < P.core.length) act(function () { P.core.splice(i, 1); if (!P.core.length) P.reps = 1; P.hide = -1; P.pos = P.core.length * P.reps + 1; last = 'remove'; });
      }
    });
    T.put = put;
    T.undo = function () { if (!hist.length) return; P = JSON.parse(hist.pop()); last = 'undo'; draw(); change(); };
    T.canUndo = function () { return hist.length > 0; };
    T.showNumbers = function (on) { shown = !!on; draw(); change(); };
    T.state = state;
    T.reset = function () { fresh(); hist = []; draw(); };
    var lw = 0, lh = 0;
    if (window.ResizeObserver) new ResizeObserver(function () { var w = mat.clientWidth, h = mat.clientHeight; if (w && (w !== lw || Math.abs(h - lh) > 2)) { lw = w; lh = h; draw(); } }).observe(mat); else window.addEventListener('resize', draw);
    T.reset();
    return T;
  }
  M.patterns = function (root, o) { return toolPat(root, o || {}); };

  /* ================= Data and chance (Toolbox) =================
     Make: Sort (by one rule into groups; from Grade 2 by two rules in a Venn or Carroll diagram), Graph (a survey: tally,
     picture graph, line plot, bar graph; from Grade 4 two classes on a double-bar graph; stacked bar from Grade 5; circle graph from Grade 7),
     Numbers (Grade 4 and up: a list of numbers as a stem-and-leaf plot with mean, median and mode; histogram and range from Grade 6;
     Grade 8 pairs on a scatter plot with a trend line) and Chance (spinner, coin, die and bag: what should happen and what did,
     on a probability line; two at once from Grade 6; tree diagrams in Grade 8). Show number shows the answers. */
  var DCI = { r: 0, b: 1, y: 2 }, DCN = { r: 'red', b: 'blue', y: 'yellow' }, DSN = { o: 'circle', s: 'square', t: 'triangle' }, DZN = { L: 'big', S: 'small' };
  /* the shapes to sort: every colour and shape, big, and three small ones, mixed up */
  var DPC = [['r', 'o', 'L'], ['b', 's', 'L'], ['y', 't', 'L'], ['r', 't', 'S'], ['b', 'o', 'L'], ['y', 's', 'L'], ['r', 's', 'L'], ['b', 'o', 'S'], ['y', 'o', 'L'], ['b', 't', 'L'], ['y', 's', 'S'], ['r', 't', 'L']]
    .map(function (p) { return { c: p[0], s: p[1], z: p[2] }; });
  var DRULE = [['c', 'r', 'red'], ['c', 'b', 'blue'], ['c', 'y', 'yellow'], ['s', 'o', 'circle'], ['s', 's', 'square'], ['s', 't', 'triangle'], ['z', 'L', 'big'], ['z', 'S', 'small']];
  /* surveys: the question, the answers, a first class and a second class (two classes from Grade 4); num: the answers are numbers (line plot) */
  var DSURV = [
    { q: 'Our favourite fruit', a: ['apple', 'banana', 'grapes', 'berries'], d: [7, 5, 4, 2], e: [4, 6, 5, 3] },
    { q: 'Our favourite sport', a: ['soccer', 'hockey', 'swimming', 'dance'], d: [12, 10, 6, 8], e: [9, 11, 8, 6] },
    { q: 'How many pets we have', a: ['0', '1', '2', '3', '4'], d: [5, 7, 4, 2, 1], e: [3, 6, 6, 3, 2], num: true },
    { q: 'Weather this month', a: ['sunny', 'cloudy', 'rain', 'snow'], d: [11, 9, 6, 4], e: [8, 12, 7, 3] },
    { q: 'How we get to school', a: ['bus', 'car', 'walk', 'bike'], d: [84, 56, 40, 20], e: [70, 66, 44, 20] }
  ];
  var DSETS = [
    { name: 'heights', unit: 'cm', lo: 105, hi: 175, d: [118, 121, 124, 124, 127, 128, 130, 133, 135, 140] },
    { name: 'minutes of reading', unit: 'minutes', lo: 0, hi: 90, d: [15, 20, 20, 25, 30, 30, 30, 40, 45, 60] }
  ];
  var DPAIRS = [[142, 140], [145, 147], [150, 148], [152, 150], [155, 157], [158, 155], [160, 163], [163, 160], [166, 168], [170, 169]];
  var DDEV = { spin: ['Spinner', 'Spin', 'spin', 'spins'], coin: ['Coin', 'Flip', 'flip', 'flips'], die: ['Die', 'Roll', 'roll', 'rolls'], bag: ['Bag', 'Pick', 'pick', 'picks'] };
  var DTWO = [['coin', 'die'], ['coin', 'coin'], ['die', 'die'], ['spin', 'coin']];
  var DCOLS = ['red', 'blue', 'yellow', 'green'];
  function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
  function frac(n, d) { if (!n) return '0'; var g = gcd(n, d); return n / g + '/' + d / g; }
  function r1(v) { return Math.round(v * 10) / 10; }
  function toolData(root, o) {
    var T = base(root, 'dat');
    root.classList.add('mp-tool', 'mp-fkt', 'mp-patt', 'mp-datt');
    var gr = window.Atlas && +Atlas.grade || 0, g2 = !gr || gr >= 2, g3 = !gr || gr >= 3, g4 = !gr || gr >= 4, g5 = !gr || gr >= 5, g6 = !gr || gr >= 6, g7 = !gr || gr >= 7, g8 = !gr || gr >= 8;
    var MODES = [['sort', 'Sort'], ['graph', 'Graph']].concat(g4 ? [['nums', 'Numbers']] : [], [['chance', 'Chance']]);
    root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray mp-fktray mp-ptray mp-dtr"></div><div class="mp-dmain"><div class="mp-cmode mp-ddo" role="group" aria-label="Make"><span>Make</span>' +
      MODES.map(function (m) { return '<button type="button" data-m="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>' +
      '<div class="mp-read" aria-live="polite"></div><div class="mp-mat mp-fkmat mp-pmat"><div class="mp-pwin"></div><div class="mp-snaps"></div></div><p class="mp-live sr" aria-live="polite"></p></div></div>';
    var tray = qs('.mp-dtr', root), mat = qs('.mp-pmat', root), win = qs('.mp-pwin', mat), read = qs('.mp-read', root), snapsEl = qs('.mp-snaps', mat);
    /* state: the move; Sort: how, the two rules, where each shape is (null: in the tray) and the order they went in; Graph: the survey,
       the counts for one or two classes, the views and the key; Numbers: the data, the value to add, the stats before the last change, pairs;
       Chance: the thing, its parts, the counts so far, two at once, the views */
    var P, shown = false, hist = [], last = '', sel = -1, skip = false, spinNow = false;
    function fresh() {
      var sv = gr === 7 || gr === 8 ? 4 : gr >= 3 ? 1 : 0;
      P = { mode: 'sort',
        s: { how: g2 ? 'venn' : 'groups', r1: 0, r2: 5, at: DPC.map(function () { return null; }), ord: [], lp: -1 },
        g: { sv: sv, c: DSURV[sv].d.slice(), c2: DSURV[sv].e.slice(), two: false, cls: 0, by: 1, order: false, key: g3 && !g4 ? 2 : 1,
          view: { tally: true, pict: !g3, line: false, bar: g3, stack: false, circle: g7, fair: false } },
        n: { set: 0, v: DSETS[0].d.slice(), cur: 128, prev: null, pairs: DPAIRS.map(function (p) { return p.slice(); }), x: 152, y: 150, two: g8, bin: 10,
          view: { stem: true, hist: g6, mean: true, median: true, mode: true, range: g6, scatter: true, trend: true } },
        c: { dev: 'spin', sec: [2, 1, 1, 0], bag: [3, 2, 1, 0], cnt: [], n: 0, last: -1, ang: 40, two: false, pair: 0, cnt2: [], last2: null,
          view: { should: g4, did: true, line: true, pct: false, tree: false } } };
      P.c.cnt = outs(P.c.dev).map(function () { return 0; });
    }
    function size() { var cs = getComputedStyle(mat); return [(mat.clientWidth || 700) - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), (mat.clientHeight || 500) - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)]; }
    function btn(a, t, on, dis, extra) { return '<button type="button" class="mp-snap" data-a="' + a + '"' + (extra || '') + (on != null ? ' aria-pressed="' + on + '"' : '') + (dis ? ' disabled' : '') + '>' + t + '</button>'; }
    function views(V, list) { return list.map(function (v) { return btn('view', v[1], !!V[v[0]], v[2], ' data-v="' + v[0] + '"'); }).join(''); }
    function sw(i) { return '<i class="mp-dsw mp-dc' + i + '"></i>'; }
    function tbl(head, rows, foot) {
      return '<table class="mp-ptbl mp-dtbl"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) { return '<tr>' + r.map(function (c, j) { return '<td' + (j ? '' : ' class="l"') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
        (foot ? '<tr class="mp-dtot">' + foot.map(function (c, j) { return '<td' + (j ? '' : ' class="l"') + '>' + c + '</td>'; }).join('') + '</tr>' : '') + '</tbody></table>';
    }
    function svgOpen(W, H, cls) { return '<svg class="mp-dsvg ' + (cls || '') + '" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">'; }
    function t(x, y, s, cls, anchor) { return '<text class="' + (cls || 'mp-dtx') + '" x="' + (+x).toFixed(1) + '" y="' + (+y).toFixed(1) + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + s + '</text>'; }
    function chartW(W, wide) { return wide ? Math.min(460, Math.floor(W / 2) - 20) : Math.min(W - 6, 460); }

    /* ======== Sort ======== */
    function has(p, r) { var R = DRULE[r]; return p[R[0]] === R[1]; }
    function phr(r) { return (DRULE[r][0] === 's' ? 'a ' : '') + DRULE[r][2]; }
    function pname(p) { return DZN[p.z] + ' ' + DCN[p.c] + ' ' + DSN[p.s]; }
    function goes(p) { var a = has(p, P.s.r1), b = P.s.how !== 'groups' && has(p, P.s.r2); return a && b ? 'ab' : a ? 'a' : b ? 'b' : 'n'; }
    function rname(R) {
      var a = DRULE[P.s.r1][2], b = DRULE[P.s.r2][2];
      if (P.s.how === 'groups') return R === 'a' ? a : 'not ' + a;
      if (P.s.how === 'venn') return { ab: 'the middle', a: a + ' only', b: b + ' only', n: 'outside' }[R];
      return { ab: a + ' and ' + b, a: a + ', not ' + b, b: b + ', not ' + a, n: 'neither' }[R];
    }
    function shape(p, cx, cy, s, cls) {
      var h = s * (p.z === 'S' ? 0.6 : 1) / 2, c = 'mp-dc' + DCI[p.c] + (cls ? ' ' + cls : '');
      if (p.s === 'o') return '<circle class="' + c + '" cx="' + cx + '" cy="' + cy + '" r="' + (h - 1).toFixed(1) + '"/>';
      if (p.s === 's') return '<rect class="' + c + '" x="' + (cx - h + 2).toFixed(1) + '" y="' + (cy - h + 2).toFixed(1) + '" width="' + (2 * h - 4).toFixed(1) + '" height="' + (2 * h - 4).toFixed(1) + '" rx="' + (h / 5).toFixed(1) + '"/>';
      return '<path class="' + c + '" stroke-linejoin="round" d="M' + cx + ' ' + (cy - h + 1).toFixed(1) + 'L' + (cx + h - 1).toFixed(1) + ' ' + (cy + h * 0.8).toFixed(1) + 'H' + (cx - h + 1).toFixed(1) + 'Z"/>';
    }
    /* the diagram: its size, which part a point is in, and the drawing */
    function sgeom(W, H) {
      var how = P.s.how, a = DRULE[P.s.r1][2], b = DRULE[P.s.r2][2], g = { W: W, H: H }, s = '';
      if (how === 'groups') {
        var gw = (W - 18) / 2;
        g.at = function (x, y) { return y < 30 || y > H - 2 ? null : x < gw ? 'a' : x > gw + 18 ? 'n' : null; };
        s = '<rect class="mp-dreg" x="1" y="30" width="' + gw + '" height="' + (H - 32) + '" rx="18"/><rect class="mp-dreg" x="' + (gw + 17) + '" y="30" width="' + gw + '" height="' + (H - 32) + '" rx="18"/>' +
          t(gw / 2, 20, a, 'mp-dlab', 'middle') + t(gw + 17 + gw / 2, 20, 'not ' + a, 'mp-dlab', 'middle');
      } else if (how === 'venn') {
        /* room under the circles for the shapes that go outside */
        var r = Math.min((H - 30 - (W < 500 ? 56 : 66)) / 2, W * 0.25), cy = 30 + r, ca = W / 2 - r * 0.58, cb = W / 2 + r * 0.58;
        g.at = function (x, y) {
          if (x < 1 || x > W - 1 || y < 1 || y > H - 1) return null;
          var ia = Math.hypot(x - ca, y - cy) < r, ib = Math.hypot(x - cb, y - cy) < r;
          return ia && ib ? 'ab' : ia ? 'a' : ib ? 'b' : 'n';
        };
        s = '<rect class="mp-dreg" x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="18"/>' +
          '<circle class="mp-dven a" cx="' + ca + '" cy="' + cy + '" r="' + r + '"/><circle class="mp-dven b" cx="' + cb + '" cy="' + cy + '" r="' + r + '"/>' +
          t(ca - r * 0.35, cy - r - 8, a, 'mp-dlab a', 'middle') + t(cb + r * 0.35, cy - r - 8, b, 'mp-dlab b', 'middle');
      } else {
        var hx = W < 500 ? 78 : 104, hy = 34, cw = (W - hx) / 2, ch = (H - hy) / 2;
        g.at = function (x, y) { if (x < hx || y < hy || x > W || y > H) return null; var c1 = x < hx + cw, rw = y < hy + ch; return rw && c1 ? 'ab' : rw ? 'a' : c1 ? 'b' : 'n'; };
        s = '<rect class="mp-dreg" x="' + hx + '" y="' + hy + '" width="' + (W - hx - 1) + '" height="' + (H - hy - 1) + '" rx="14"/>' +
          '<path class="mp-dgrid" d="M' + (hx + cw) + ' ' + hy + 'V' + H + 'M' + hx + ' ' + (hy + ch) + 'H' + W + '"/>' +
          t(hx + cw / 2, 22, b, 'mp-dlab b', 'middle') + t(hx + cw * 1.5, 22, 'not ' + b, 'mp-dlab', 'middle') +
          t(hx - 10, hy + ch / 2 + 5, a, 'mp-dlab a', 'end') + t(hx - 10, hy + ch * 1.5 + 5, 'not ' + a, 'mp-dlab', 'end');
      }
      g.svg = s;
      return g;
    }
    /* the places a shape can sit in each part: points on a grid whose shape would not cross a line, nearest the middle of the part first */
    function slots(g, s) {
      var out = { a: [], b: [], ab: [], n: [] }, st = s + 6;
      function scan(step, d, few) {
        for (var y = step / 2 + 2; y < g.H; y += step) for (var x = step / 2 + 2; x < g.W; x += step) {
          var R = g.at(x, y), L = out[R];
          if (!R || few && L.length >= 4) continue;
          var ok = [[d, 0], [-d, 0], [0, d], [0, -d], [d * .7, d * .7], [-d * .7, d * .7], [d * .7, -d * .7], [-d * .7, -d * .7]].every(function (q) { return g.at(x + q[0], y + q[1]) === R; });
          if (ok && L.every(function (p) { return Math.hypot(p[0] - x, p[1] - y) >= s + 4; })) L.push([x, y]);
        }
      }
      scan(st, s / 2 + 5, false);
      /* a thin part (the middle of a Venn diagram) gets places that only just fit */
      scan(st / 3, s / 2 + 1, true);
      Object.keys(out).forEach(function (R) {
        var L = out[R];
        /* a part too thin for a whole shape: use its middle */
        if (!L.length) { var sx = 0, sy = 0, k = 0; for (var yy = 2; yy < g.H; yy += 4) for (var xx = 2; xx < g.W; xx += 4) if (g.at(xx, yy) === R) { sx += xx; sy += yy; k++; } if (k) L.push([Math.round(sx / k), Math.round(sy / k)]); return; }
        var mx = 0, my = 0; L.forEach(function (p) { mx += p[0]; my += p[1]; }); mx /= L.length; my /= L.length;
        if (R === 'n' && P.s.how === 'venn') { mx = g.W / 2; my = g.H; }
        L.sort(function (p, q) { return Math.hypot(p[0] - mx, p[1] - my) - Math.hypot(q[0] - mx, q[1] - my); });
      });
      return out;
    }
    function drawSort(W, H) {
      var g = sgeom(Math.min(W, 760), clamp(H - 150, 240, W < 500 ? 340 : 440)), s = g.W < 500 ? 32 : 42, sl = slots(g, s), used = { a: 0, b: 0, ab: 0, n: 0 }, h = '', anc = {};
      Object.keys(sl).forEach(function (R) { if (sl[R].length) anc[R] = sl[R][0]; });
      var pcs = '';
      P.s.ord.forEach(function (i) {
        var R = P.s.at[i], L = sl[R] || [], k = used[R]++, pt = L.length ? L[k % L.length] : [g.W / 2, g.H / 2], off = L.length && k >= L.length ? 6 : 0, p = DPC[i];
        var bad = shown && goes(p) !== R;
        pcs += '<g class="mp-dpc' + (sel === i ? ' sel' : '') + (bad ? ' bad' : '') + '" data-p="' + i + '" role="button" aria-label="' + pname(p) + (bad ? ', in the wrong place' : '') + '">' +
          '<rect class="mp-dhit" x="' + (pt[0] + off - s / 2 - 3) + '" y="' + (pt[1] + off - s / 2 - 3) + '" width="' + (s + 6) + '" height="' + (s + 6) + '" rx="10"/>' + shape(p, pt[0] + off, pt[1] + off, s) + '</g>';
      });
      h += '<div class="mp-dsort">' + svgOpen(g.W, g.H, 'mp-dsv').replace('aria-hidden="true"', 'role="group" aria-label="Sorting mat" data-anc=\'' + JSON.stringify(anc) + '\'') + g.svg + pcs + '</svg></div>';
      if (!P.s.ord.length) h += '<p class="mp-fknote">' + (sel >= 0 ? 'Now tap where it goes.' : 'Tap or drag a shape from the tray to where it goes.') + '</p>';
      if (shown && P.s.ord.length) {
        var parts = P.s.how === 'groups' ? ['a', 'n'] : ['a', 'b', 'ab', 'n'], wrong = P.s.ord.filter(function (i) { return goes(DPC[i]) !== P.s.at[i]; }).length;
        h += '<div class="mp-prow">' + parts.map(function (R) { return chip(rname(R), P.s.ord.filter(function (i) { return P.s.at[i] === R; }).length, R === 'ab'); }).join('') +
          (wrong ? chip('in the wrong place', wrong, true) : '') + '</div>';
      }
      return h;
    }
    function placeAt(i, R) {
      if (i < 0 || !R) return;
      act(function () { if (P.s.at[i] == null) P.s.ord.push(i); P.s.at[i] = R; P.s.lp = i; last = 'place'; });
      sel = -1; draw();
      announce(T, pname(DPC[i]) + ' in ' + rname(R));
    }
    function unplace(i) {
      if (i < 0 || P.s.at[i] == null) return;
      act(function () { P.s.at[i] = null; P.s.ord = P.s.ord.filter(function (j) { return j !== i; }); if (P.s.lp === i) P.s.lp = -1; last = 'back'; });
      sel = -1; draw();
    }
    function svPoint(svg, x, y) { var b = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal; return [(x - b.left) * vb.width / b.width, (y - b.top) * vb.height / b.height]; }
    function regionAt(x, y) {
      var svg = qs('.mp-dsv', root); if (!svg) return null;
      var p = svPoint(svg, x, y);
      return sgeom(svg.viewBox.baseVal.width, svg.viewBox.baseVal.height).at(p[0], p[1]);
    }
    /* drag a shape from the tray or the mat; a tap picks it up instead (then tap where it goes) */
    root.addEventListener('pointerdown', function (e) {
      skip = false;
      var pc = e.target.closest('[data-p]');
      if (!pc || P.mode !== 'sort' || e.button > 0) return;
      var i = +pc.getAttribute('data-p'), x0 = e.clientX, y0 = e.clientY, ghost = null;
      e.preventDefault();
      function move(ev) {
        if (!ghost && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6) {
          ghost = el('div', 'mp-ghost mp-datt', svgOpen(48, 48) + shape(DPC[i], 24, 24, 42) + '</svg>');
          document.body.appendChild(ghost);
          pc.classList.add('mp-lift');
        }
        if (ghost) ghost.style.transform = 'translate(' + (ev.clientX - 24) + 'px,' + (ev.clientY - 24) + 'px)';
      }
      function up(ev) {
        window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
        skip = true;
        /* a tap: pick the shape up, or put it down; with another shape picked up, a tap on a shape on the mat puts it in that part */
        if (!ghost) { if (sel >= 0 && sel !== i && P.s.at[i] != null) placeAt(sel, P.s.at[i]); else { sel = sel === i ? -1 : i; draw(); } return; }
        ghost.remove(); pc.classList.remove('mp-lift');
        if (ev.type === 'pointercancel') return;
        var at = document.elementFromPoint(ev.clientX, ev.clientY);
        if (at && at.closest('.mp-dsv')) placeAt(i, regionAt(ev.clientX, ev.clientY));
        else if (at && at.closest('.mp-dtr')) unplace(i);
      }
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    });

    /* ======== Graph ======== */
    function sv() { return DSURV[P.g.sv]; }
    function cats() {
      var G = P.g, ix = sv().a.map(function (a, i) { return i; });
      if (G.order && !sv().num) ix.sort(function (a, b) { return (G.c[b] + (G.two ? G.c2[b] : 0)) - (G.c[a] + (G.two ? G.c2[a] : 0)) || a - b; });
      return ix;
    }
    function gmax() { return g7 ? 200 : g4 ? 99 : g3 ? 40 : 30; }
    function sum(a) { return a.reduce(function (s, v) { return s + v; }, 0); }
    function modes(c) { var m = Math.max.apply(null, c); return m ? c.map(function (v, i) { return v === m ? i : -1; }).filter(function (i) { return i >= 0; }) : []; }
    function tally(n) {
      var s = '';
      for (var i = 0; i < Math.floor(n / 5); i++) s += '<span class="mp-dt5">||||</span>';
      return s + (n % 5 ? '<span class="mp-dt1">' + '|'.repeat(n % 5) + '</span>' : '');
    }
    function pct(v, tot) { return tot ? r1(v / tot * 100) + '%' : '0%'; }
    function gTable() {
      var G = P.g, S = sv(), ix = cats(), tot = sum(G.c), tot2 = sum(G.c2), head = ['answer'];
      if (!g4) head.push('tally');
      head = head.concat(G.two ? ['A', 'B'] : ['count']);
      var fr = shown && g5 && !g7, pc = shown && g7;
      if (fr) head.push('fraction'); if (pc) head.push('%');
      var rows = ix.map(function (i) {
        var r = [sw(i) + S.a[i]];
        if (!g4) r.push('<span class="mp-dtal" aria-label="' + G.c[i] + '">' + tally(G.c[i]) + '</span>');
        r = r.concat(G.two ? [G.c[i], G.c2[i]] : [G.c[i]]);
        if (fr) r.push(frac(G.c[i], tot || 1) + (G.two ? ', ' + frac(G.c2[i], tot2 || 1) : ''));
        if (pc) r.push(pct(G.c[i], tot) + (G.two ? ', ' + pct(G.c2[i], tot2) : ''));
        return r;
      });
      var foot = ['total'].concat(!g4 ? [''] : [], G.two ? [tot, tot2] : [tot], fr || pc ? [''] : []);
      return box(S.q, tbl(head, rows, g2 ? foot : null));
    }
    function pict(W) {
      var G = P.g, S = sv(), ix = cats(), k = G.key, m = Math.max(1, Math.max.apply(null, G.c)), lw = 86, n = Math.ceil(m / k);
      var d = Math.max(9, Math.min(30, Math.floor((W - lw - 6) / n))), r = d / 2 - 2, rh = Math.max(d + 8, 34), H = ix.length * rh + 4, s = svgOpen(W, H, 'mp-dpic');
      ix.forEach(function (i, row) {
        var y = row * rh + rh / 2 + 2;
        s += t(0, y + 5, S.a[i], 'mp-dtx');
        for (var j = 0; j < Math.ceil(G.c[i] / k); j++) {
          var cx = lw + j * d + d / 2, part = G.c[i] - j * k;
          if (part >= k) s += '<circle class="mp-dc' + i + '" cx="' + cx + '" cy="' + y + '" r="' + r + '"/>';
          else s += '<path class="mp-dc' + i + '" d="M' + cx + ' ' + (y - r) + 'A' + r + ' ' + r + ' 0 0 0 ' + cx + ' ' + (y + r) + 'Z"/>';
        }
      });
      return box('Picture graph: 1 picture = ' + pl(k, 'person', 'people'), s + '</svg>');
    }
    function axisStep(max, n) { var r = max / n, p = Math.pow(10, Math.floor(Math.log(r) / Math.LN10)), q = r / p; return Math.max(1, (q <= 1 ? 1 : q <= 2 ? 2 : q <= 5 ? 5 : 10) * p); }
    function bars(W, H) {
      var G = P.g, S = sv(), ix = cats(), m = Math.max(1, Math.max.apply(null, G.c.concat(G.two ? G.c2 : [])));
      var st = g4 ? axisStep(m, 5) : G.key, top = Math.ceil(m / st) * st, L = 40, B = 34, Tp = 12, R = 8, bw = (W - L - R) / ix.length;
      var Y = function (v) { return Tp + (1 - v / top) * (H - Tp - B); }, s = svgOpen(W, H, 'mp-dbar');
      for (var v = 0; v <= top + 1e-9; v += st) s += '<line class="' + (v ? 'mp-pgl' : 'mp-pgz') + '" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/>' + t(L - 7, Y(v) + 4, fmt(v), 'mp-pgy');
      ix.forEach(function (i, j) {
        var vs = G.two ? [G.c[i], G.c2[i]] : [G.c[i]], w = bw * 0.64 / vs.length;
        vs.forEach(function (v, q) {
          var x = L + j * bw + bw * 0.18 + q * w;
          if (v) s += '<rect class="' + (G.two ? 'mp-dser' + q : 'mp-dc' + i) + '" x="' + x.toFixed(1) + '" y="' + Y(v).toFixed(1) + '" width="' + Math.max(2, w - 3).toFixed(1) + '" height="' + (Y(0) - Y(v)).toFixed(1) + '" rx="3"/>';
        });
        s += t(L + j * bw + bw / 2, H - 12, S.a[i], 'mp-pgx');
      });
      var mean = sum(G.c) / G.c.length;
      if (shown && G.view.fair && !G.two) s += '<line class="mp-dmean" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(mean).toFixed(1) + '" y2="' + Y(mean).toFixed(1) + '"/>' + t(W - R, Y(mean) - 6, 'fair share ' + fmt(r1(mean)), 'mp-dmeant', 'end');
      var lab = 'Bar graph' + (!g4 && G.key > 1 ? ': 1 square = ' + G.key + ' people' : '');
      return box(lab, s + '</svg>' + (G.two ? legend([['mp-dser0', 'class A'], ['mp-dser1', 'class B']]) : ''));
    }
    function legend(items) { return '<div class="mp-dleg">' + items.map(function (x) { return '<span><i class="mp-dsw ' + x[0] + '"></i>' + x[1] + '</span>'; }).join('') + '</div>'; }
    function linePlot(W) {
      var G = P.g, S = sv(), n = S.a.length, m = Math.max(1, Math.max.apply(null, G.c)), Lm = 30, gap = Math.min(22, 150 / m), H = 54 + m * gap, X = function (i) { return Lm + i * (W - 2 * Lm) / (n - 1); };
      var s = svgOpen(W, H, 'mp-dlp') + '<line class="mp-fkax" x1="' + (Lm - 14) + '" x2="' + (W - Lm + 14) + '" y1="' + (H - 34) + '" y2="' + (H - 34) + '"/>';
      S.a.forEach(function (a, i) {
        s += '<line class="mp-fkt1" x1="' + X(i) + '" x2="' + X(i) + '" y1="' + (H - 40) + '" y2="' + (H - 28) + '"/>' + t(X(i), H - 8, a, 'mp-dtx', 'middle');
        for (var j = 0; j < G.c[i]; j++) s += t(X(i), H - 44 - j * gap, '×', 'mp-dx', 'middle');
      });
      return box('Line plot', s + '</svg>');
    }
    function stack(W) {
      var G = P.g, S = sv(), ix = cats(), sets = G.two ? [G.c, G.c2] : [G.c], bh = 40, H = sets.length * (bh + 16), Lw = G.two ? 26 : 0, s = svgOpen(W, H, 'mp-dstk');
      sets.forEach(function (c, row) {
        var tot = sum(c) || 1, x = Lw, y = row * (bh + 16);
        if (G.two) s += t(0, y + bh / 2 + 5, row ? 'B' : 'A', 'mp-dlab');
        ix.forEach(function (i) {
          var w = c[i] / tot * (W - Lw);
          if (!w) return;
          s += '<rect class="mp-dc' + i + ' mp-dseg" x="' + x.toFixed(1) + '" y="' + y + '" width="' + w.toFixed(1) + '" height="' + bh + '"/>';
          if (shown && w > 46) s += t(x + w / 2, y + bh / 2 + 5, g6 ? pct(c[i], tot) : frac(c[i], tot), 'mp-dsegt', 'middle');
          x += w;
        });
      });
      return box('Stacked bar: parts of the whole', s + '</svg>' + legend(ix.map(function (i) { return ['mp-dc' + i, S.a[i]]; })));
    }
    function pie(c, D, ix) {
      var tot = sum(c), r = D / 2 - 3, cx = D / 2, a0 = -Math.PI / 2, s = svgOpen(D, D, 'mp-dpie');
      if (!tot) return s + '<circle class="mp-dempty" cx="' + cx + '" cy="' + cx + '" r="' + r + '"/></svg>';
      ix.forEach(function (i) {
        var f = c[i] / tot; if (!f) return;
        if (f > 0.9999) { s += '<circle class="mp-dc' + i + ' mp-dseg" cx="' + cx + '" cy="' + cx + '" r="' + r + '"/>'; return; }
        var a1 = a0 + f * 2 * Math.PI;
        s += '<path class="mp-dc' + i + ' mp-dseg" d="M' + cx + ' ' + cx + 'L' + (cx + r * Math.cos(a0)).toFixed(1) + ' ' + (cx + r * Math.sin(a0)).toFixed(1) + 'A' + r + ' ' + r + ' 0 ' + (f > 0.5 ? 1 : 0) + ' 1 ' + (cx + r * Math.cos(a1)).toFixed(1) + ' ' + (cx + r * Math.sin(a1)).toFixed(1) + 'Z"/>';
        a0 = a1;
      });
      return s + '</svg>';
    }
    function circleGraph(W) {
      var G = P.g, S = sv(), ix = cats(), D = Math.min(220, W < 500 ? 170 : 220), h = '<div class="mp-dpies">';
      (G.two ? [G.c, G.c2] : [G.c]).forEach(function (c, k) { h += '<div class="mp-dpiew">' + pie(c, G.two ? Math.min(D, 170) : D, ix) + (G.two ? '<small>class ' + (k ? 'B' : 'A') + '</small>' : '') + '</div>'; });
      var tot = sum(G.c);
      return box('Circle graph', h + '</div>' + legend(ix.map(function (i) { return ['mp-dc' + i, S.a[i] + (shown && !G.two ? ' ' + pct(G.c[i], tot) : '')]; })));
    }
    function drawGraph(W) {
      var G = P.g, V = G.view, wide = W >= 640, cw = chartW(W, wide), parts = [];
      if (V.tally) parts.push(gTable());
      if (V.pict && !g5 && !G.two) parts.push(pict(cw));
      if (V.line && sv().num && g2 && !G.two) parts.push(linePlot(cw));
      if (V.bar && g2) parts.push(bars(cw, wide ? 260 : 220));
      if (V.stack && g5) parts.push(stack(cw));
      if (V.circle && g7) parts.push(circleGraph(cw));
      if (!parts.length) return '<p class="mp-fknote">Turn on a table or a graph below.</p>';
      var h = '<div class="mp-prow">' + parts.join('') + '</div>';
      if (shown) {
        var m = modes(G.c), ch = '';
        if (g2 && m.length) ch += chip('mode', m.map(function (i) { return sv().a[i]; }).join(', '), true);
        if (g3 && V.fair && !G.two) ch += chip('fair share', fmt(sum(G.c)) + ' ÷ ' + G.c.length + ' = ' + fmt(r1(sum(G.c) / G.c.length)));
        if (ch) h = '<div class="mp-prow">' + ch + '</div>' + h;
      }
      return h;
    }
    function gNudge(i, d) {
      var G = P.g, c = G.two && G.cls ? G.c2 : G.c;
      act(function () { c[i] = clamp(c[i] + d * G.by, 0, gmax()); last = d > 0 ? 'tally' : 'untally'; });
    }

    /* ======== Numbers ======== */
    function sorted(v) { return v.slice().sort(function (a, b) { return a - b; }); }
    function stats(v) {
      if (!v.length) return null;
      var s = sorted(v), n = s.length, tot = sum(s), cnt = {}, best = 1, md = [];
      s.forEach(function (x) { cnt[x] = (cnt[x] || 0) + 1; best = Math.max(best, cnt[x]); });
      if (best > 1) Object.keys(cnt).forEach(function (k) { if (cnt[k] === best) md.push(+k); });
      return { n: n, tot: tot, mean: tot / n, med: n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2, mid: n % 2 ? [s[(n - 1) / 2]] : [s[n / 2 - 1], s[n / 2]], mode: md.sort(function (a, b) { return a - b; }), lo: s[0], hi: s[n - 1] };
    }
    function eqv(v) { return Math.abs(v - Math.round(v)) < 1e-9 ? ' = ' + fmt(Math.round(v)) : ' ≈ ' + fmt(r1(v)); }
    function stem(v) {
      var s = sorted(v), rows = [], lo = Math.floor(s[0] / 10), hi = Math.floor(s[s.length - 1] / 10);
      for (var k = lo; k <= hi; k++) rows.push([String(k), s.filter(function (x) { return Math.floor(x / 10) === k; }).map(function (x) { return x % 10; }).join(' ')]);
      return box('Stem and leaf (' + DSETS[P.n.set].unit + ')', tbl(['stem', 'leaves'], rows) + '<small class="mp-dkey">' + rows[0][0] + ' | ' + (s[0] % 10) + ' means ' + s[0] + '</small>');
    }
    function histo(v, W, H) {
      var b = P.n.bin, s = sorted(v), lo = Math.floor(s[0] / b) * b, hi = Math.floor(s[s.length - 1] / b) * b, bins = [];
      for (var x = lo; x <= hi; x += b) bins.push([x, s.filter(function (q) { return q >= x && q < x + b; }).length]);
      var m = Math.max.apply(null, bins.map(function (q) { return q[1]; })), st = axisStep(m, 4), top = Math.ceil(m / st) * st, L = 34, B = 40, Tp = 10, R = 6, bw = (W - L - R) / bins.length;
      var Y = function (q) { return Tp + (1 - q / top) * (H - Tp - B); }, g = svgOpen(W, H, 'mp-dbar');
      for (var q = 0; q <= top; q += st) g += '<line class="' + (q ? 'mp-pgl' : 'mp-pgz') + '" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(q).toFixed(1) + '" y2="' + Y(q).toFixed(1) + '"/>' + t(L - 6, Y(q) + 4, q, 'mp-pgy');
      bins.forEach(function (bn, i) {
        if (bn[1]) g += '<rect class="mp-dhist" x="' + (L + i * bw).toFixed(1) + '" y="' + Y(bn[1]).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (Y(0) - Y(bn[1])).toFixed(1) + '"/>';
        g += t(L + i * bw + bw / 2, H - 22, bn[0] + '–' + (bn[0] + b - 1), 'mp-pgx' + (bins.length > 5 ? ' sm' : ''), 'middle');
      });
      return box('Histogram (' + DSETS[P.n.set].unit + ')', g + '</svg>');
    }
    function fit(ps) {
      var n = ps.length, mx = 0, my = 0; ps.forEach(function (p) { mx += p[0] / n; my += p[1] / n; });
      var sxy = 0, sxx = 0, syy = 0; ps.forEach(function (p) { sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) * (p[0] - mx); syy += (p[1] - my) * (p[1] - my); });
      var m = sxx ? sxy / sxx : 0; return { m: m, b: my - m * mx, r: sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0 };
    }
    function scatter(W, H) {
      var ps = P.n.pairs, xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      var x0 = Math.floor((Math.min.apply(null, xs) - 2) / 10) * 10, x1 = Math.ceil((Math.max.apply(null, xs) + 2) / 10) * 10, y0 = Math.floor((Math.min.apply(null, ys) - 2) / 10) * 10, y1 = Math.ceil((Math.max.apply(null, ys) + 2) / 10) * 10;
      var L = 50, B = 44, Tp = 10, R = 12, X = function (v) { return L + (v - x0) / (x1 - x0) * (W - L - R); }, Y = function (v) { return Tp + (1 - (v - y0) / (y1 - y0)) * (H - Tp - B); };
      var s = svgOpen(W, H, 'mp-dsc'), sx = axisStep(x1 - x0, 5), sy = axisStep(y1 - y0, 5);
      for (var v = y0; v <= y1; v += sy) s += '<line class="mp-pgl" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/>' + t(L - 7, Y(v) + 4, v, 'mp-pgy');
      for (v = x0; v <= x1; v += sx) s += t(X(v), H - B + 18, v, 'mp-pgx', 'middle');
      s += '<line class="mp-pgz" x1="' + L + '" x2="' + L + '" y1="' + Tp + '" y2="' + Y(y0) + '"/><line class="mp-pgz" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(y0) + '" y2="' + Y(y0) + '"/>';
      if (P.n.view.trend && ps.length > 1) {
        var f = fit(ps), cl = function (x) { return Math.max(y0, Math.min(y1, f.m * x + f.b)); }, xa = x0, xb = x1;
        if (f.m) { xa = Math.max(x0, Math.min(x1, ((f.m > 0 ? y0 : y1) - f.b) / f.m)); xb = Math.max(x0, Math.min(x1, ((f.m > 0 ? y1 : y0) - f.b) / f.m)); }
        s += '<line class="mp-dmean" x1="' + X(xa).toFixed(1) + '" y1="' + Y(cl(xa)).toFixed(1) + '" x2="' + X(xb).toFixed(1) + '" y2="' + Y(cl(xb)).toFixed(1) + '"/>';
      }
      ps.forEach(function (p) { s += '<circle class="mp-pgd a" cx="' + X(p[0]).toFixed(1) + '" cy="' + Y(p[1]).toFixed(1) + '" r="6"/>'; });
      s += t((L + W) / 2, H - 6, 'height (cm)', 'mp-dax', 'middle') + '<text class="mp-dax" x="12" y="' + (H / 2) + '" text-anchor="middle" transform="rotate(-90 12 ' + (H / 2) + ')">arm span (cm)</text>';
      return box('Scatter plot', s + '</svg>');
    }
    function relWords(r) { var a = Math.abs(r); return a < 0.3 ? 'no clear relationship' : (a >= 0.7 ? 'strong, ' : 'weak, ') + (r > 0 ? 'positive' : 'negative'); }
    function drawNums(W) {
      var N = P.n, V = N.view, wide = W >= 640, cw = chartW(W, wide), h = '';
      if (g8 && N.two) {
        if (!N.pairs.length) return '<p class="mp-fknote">Add a pair from the tray.</p>';
        var parts = box('Height and arm span', tbl(['height', 'arm span'], N.pairs.map(function (p, i) { return ['<button type="button" class="mp-dval" data-pi="' + i + '" aria-label="Take off ' + p[0] + ' and ' + p[1] + '">' + p[0] + '</button>', p[1]]; })));
        if (V.scatter) parts += scatter(wide ? Math.min(460, W - 280) : cw, wide ? 300 : 250);
        if (shown && N.pairs.length > 2) h += '<div class="mp-prow">' + chip('relationship', relWords(fit(N.pairs).r), true) + '</div>';
        return h + '<div class="mp-prow">' + parts + '</div>';
      }
      if (!N.v.length) return '<p class="mp-fknote">Add numbers from the tray.</p>';
      var S = sorted(N.v), st = stats(N.v);
      h += '<div class="mp-dlist" role="group" aria-label="The numbers, smallest first">' + S.map(function (x) { return '<button type="button" class="mp-dval' + (shown && V.median && st.mid.indexOf(x) >= 0 ? ' mid' : '') + (shown && V.mode && st.mode.indexOf(x) >= 0 ? ' mo' : '') + '" data-nv="' + x + '" aria-label="Take off ' + x + '">' + x + '</button>'; }).join('') + '</div>';
      if (shown) {
        var ch = '';
        if (V.mean) ch += chip('mean', fmt(st.tot) + ' ÷ ' + st.n + eqv(st.mean));
        if (V.median) ch += chip('median', st.n % 2 ? fmt(st.med) : '(' + st.mid[0] + ' + ' + st.mid[1] + ') ÷ 2 = ' + fmt(r1(st.med)));
        if (V.mode) ch += chip('mode', st.mode.length ? st.mode.join(', ') : 'none', true);
        if (V.range && g6) ch += chip('range', st.hi + ' − ' + st.lo + ' = ' + (st.hi - st.lo));
        if (ch) h += '<div class="mp-prow">' + ch + '</div>';
      }
      var parts2 = '';
      if (V.stem) parts2 += stem(N.v);
      if (V.hist && g6) parts2 += histo(N.v, cw, wide ? 240 : 210);
      if (parts2) h += '<div class="mp-prow">' + parts2 + '</div>';
      return h;
    }
    function nAdd(v) {
      var N = P.n;
      act(function () { N.prev = stats(N.v); if (v == null) N.v.push(N.cur); else N.v = N.v.filter(function (x, i, a) { return i !== a.indexOf(v); }); last = v == null ? 'add' : 'takeoff'; });
    }

    /* ======== Chance ======== */
    /* the outcomes of a thing: their names, colours and chances as [top, bottom] */
    function outs(dev, C) {
      C = C || (P && P.c);
      if (dev === 'coin') return [{ n: 'heads', s: 'H', p: [1, 2], c: 'mp-dc1' }, { n: 'tails', s: 'T', p: [1, 2], c: 'mp-dc5' }];
      if (dev === 'die') return [1, 2, 3, 4, 5, 6].map(function (k) { return { n: String(k), s: String(k), p: [1, 6], c: 'mp-dc1' }; });
      var parts = dev === 'spin' ? (C ? C.sec : [2, 1, 1, 0]) : (C ? C.bag : [3, 2, 1, 0]), tot = sum(parts), out = [];
      parts.forEach(function (k, i) { if (k) out.push({ n: DCOLS[i], s: DCOLS[i][0].toUpperCase(), p: [k, tot], c: 'mp-dc' + i, i: i }); });
      return out;
    }
    function pair() { return DTWO[P.c.pair]; }
    function two() { return g6 && P.c.two; }
    function pwords(p) { var f = p[0] / p[1]; return f === 0 ? 'impossible' : f === 1 ? 'certain' : f < 0.5 ? 'unlikely' : f === 0.5 ? 'as likely as not' : 'likely'; }
    function pshow(p) { var f = frac(p[0], p[1]); return P.c.view.pct && g5 ? r1(p[0] / p[1] * 100) + '%' : f; }
    function resetCounts() {
      var C = P.c;
      C.cnt = outs(C.dev).map(function () { return 0; }); C.n = 0; C.last = -1; C.last2 = null;
      var A = outs(pair()[0]), B = outs(pair()[1]);
      C.cnt2 = A.map(function () { return B.map(function () { return 0; }); });
    }
    /* where the spinner stops: somewhere inside the part it landed on */
    function angFor(L, q) { var st = 0; for (var m = 0; m < q; m++) st += L[m].p[0]; return (st + (0.15 + Math.random() * 0.7) * L[q].p[0]) / L[0].p[1] * 360; }
    function pick(L) { var tot = L[0].p[1], r = Math.random() * tot, acc = 0; for (var i = 0; i < L.length; i++) { acc += L[i].p[0]; if (r < acc) return i; } return L.length - 1; }
    function run(k) {
      var C = P.c;
      act(function () {
        if (two()) {
          var A = outs(pair()[0]), B = outs(pair()[1]);
          for (var j = 0; j < k; j++) { var a = pick(A), b = pick(B); C.cnt2[a][b]++; C.last2 = [a, b]; }
          if (pair()[0] === 'spin') C.ang = angFor(A, C.last2[0]);
        } else {
          var L = outs(C.dev);
          for (var i = 0; i < k; i++) { var q = pick(L); C.cnt[q]++; C.last = q; }
          if (C.dev === 'spin') C.ang = angFor(L, C.last);
        }
        C.n += k; last = 'run';
        spinNow = k === 1;
      });
    }
    function spinner(L, D, ang, anim) {
      var r = D / 2 - 4, c = D / 2, a0 = -Math.PI / 2, tot = L[0].p[1], s = svgOpen(D, D, 'mp-dspin');
      L.forEach(function (o) {
        for (var k = 0; k < o.p[0]; k++) {
          var a1 = a0 + 2 * Math.PI / tot;
          s += tot === 1 ? '<circle class="' + o.c + ' mp-dseg" cx="' + c + '" cy="' + c + '" r="' + r + '"/>' : '<path class="' + o.c + ' mp-dseg" d="M' + c + ' ' + c + 'L' + (c + r * Math.cos(a0)).toFixed(1) + ' ' + (c + r * Math.sin(a0)).toFixed(1) + 'A' + r + ' ' + r + ' 0 0 1 ' + (c + r * Math.cos(a1)).toFixed(1) + ' ' + (c + r * Math.sin(a1)).toFixed(1) + 'Z"/>';
          a0 = a1;
        }
      });
      return s + '<g class="mp-dptr' + (anim ? ' go' : '') + '" style="transform:rotate(' + ang.toFixed(1) + 'deg);transform-origin:' + c + 'px ' + c + 'px"><path d="M' + c + ' ' + (c - r * 0.8) + 'L' + (c + 7) + ' ' + c + 'H' + (c - 7) + 'Z"/></g><circle class="mp-dhub" cx="' + c + '" cy="' + c + '" r="8"/></svg>';
    }
    function pips(k, D) {
      var s = svgOpen(D, D, 'mp-ddie'), q = D / 4, at = { 1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]], 4: [[1, 1], [3, 1], [1, 3], [3, 3]], 5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]], 6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]] };
      s += '<rect class="mp-ddf" x="3" y="3" width="' + (D - 6) + '" height="' + (D - 6) + '" rx="' + D / 6 + '"/>';
      (at[k] || []).forEach(function (p) { s += '<circle class="mp-ddp" cx="' + p[0] * q + '" cy="' + p[1] * q + '" r="' + D / 12 + '"/>'; });
      return s + '</svg>';
    }
    function devPic(dev, lastI, D, ang, anim) {
      var L = outs(dev);
      if (dev === 'spin') return spinner(L, D, ang, anim);
      if (dev === 'die') return pips(lastI >= 0 ? lastI + 1 : 0, D * 0.62);
      if (dev === 'coin') return '<div class="mp-dcoin' + (lastI === 1 ? ' tails' : '') + (anim ? ' go' : '') + '" style="width:' + D * 0.62 + 'px;height:' + D * 0.62 + 'px">' + (lastI >= 0 ? L[lastI].s : '?') + '</div>';
      var bag = '<div class="mp-dbag" style="width:' + D * 0.8 + 'px">';
      P.c.bag.forEach(function (k, i) { for (var j = 0; j < k; j++) bag += '<i class="mp-dsw mp-dc' + i + '"></i>'; });
      return bag + '</div>' + (lastI >= 0 ? '<div class="mp-dpick"><small>picked</small><i class="mp-dsw ' + L[lastI].c + '"></i></div>' : '');
    }
    function probLine(L, W) {
      var Lm = 24, X = function (f) { return Lm + f * (W - 2 * Lm); }, s = svgOpen(W, 92, 'mp-dpl'), byP = {};
      s += '<line class="mp-fkax" x1="' + Lm + '" x2="' + (W - Lm) + '" y1="52" y2="52"/>';
      var ticks = g4 ? [[0, '0'], [0.5, '1/2'], [1, '1']] : [[0, 'impossible'], [0.5, 'even chance'], [1, 'certain']];
      ticks.forEach(function (k) { s += '<line class="mp-fkt1" x1="' + X(k[0]) + '" x2="' + X(k[0]) + '" y1="44" y2="60"/>' + t(X(k[0]), 80, k[1], 'mp-dtx', k[0] === 0 ? 'start' : k[0] === 1 ? 'end' : 'middle'); });
      if (!g4) { s += t(X(0.25), 80, 'unlikely', 'mp-dtx2', 'middle') + t(X(0.75), 80, 'likely', 'mp-dtx2', 'middle'); }
      L.forEach(function (o) { var f = o.p[0] / o.p[1], k = f.toFixed(6); (byP[k] = byP[k] || { f: f, o: [] }).o.push(o); });
      Object.keys(byP).forEach(function (k) {
        var b = byP[k], x = X(b.f);
        b.o.forEach(function (o, j) { s += '<circle class="' + o.c + ' mp-dpd" cx="' + (x + (j - (b.o.length - 1) / 2) * 8).toFixed(1) + '" cy="52" r="' + (b.o.length > 2 ? 6 : 8) + '"/>'; });
        var lab = b.o.length > 2 ? 'each' : b.o.map(function (o) { return o.n; }).join(', ');
        s += t(x, 30, lab + (shown && g4 ? ' ' + pshow(b.o[0].p) : ''), 'mp-dtx', b.f < 0.08 ? 'start' : b.f > 0.92 ? 'end' : 'middle');
      });
      return box('Probability line', s + '</svg>');
    }
    function shouldDid(L, cnt, n, W, H) {
      var V = P.c.view, ex = L.map(function (o) { return n * o.p[0] / o.p[1]; }), m = Math.max(1, Math.max.apply(null, cnt.concat(V.should && g4 ? ex : [])));
      var st = axisStep(m, 4), top = Math.ceil(m / st) * st, Lx = 40, B = 30, Tp = 10, R = 6, bw = (W - Lx - R) / L.length, both = V.should && g4 && V.did;
      var Y = function (v) { return Tp + (1 - v / top) * (H - Tp - B); }, s = svgOpen(W, H, 'mp-dbar');
      for (var v = 0; v <= top + 1e-9; v += st) s += '<line class="' + (v ? 'mp-pgl' : 'mp-pgz') + '" x1="' + Lx + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/>' + t(Lx - 7, Y(v) + 4, fmt(v), 'mp-pgy');
      L.forEach(function (o, i) {
        var w = bw * 0.66 / (both ? 2 : 1), x = Lx + i * bw + bw * 0.17;
        if (V.should && g4 && ex[i]) { s += '<rect class="mp-dexp" x="' + x.toFixed(1) + '" y="' + Y(ex[i]).toFixed(1) + '" width="' + Math.max(2, w - 3).toFixed(1) + '" height="' + (Y(0) - Y(ex[i])).toFixed(1) + '" rx="3"/>'; if (both) x += w; }
        if (V.did && cnt[i]) s += '<rect class="' + o.c + '" x="' + x.toFixed(1) + '" y="' + Y(cnt[i]).toFixed(1) + '" width="' + Math.max(2, w - 3).toFixed(1) + '" height="' + (Y(0) - Y(cnt[i])).toFixed(1) + '" rx="3"/>';
        s += t(Lx + i * bw + bw / 2, H - 10, o.n, 'mp-pgx' + (L.length > 4 ? ' sm' : ''), 'middle');
      });
      var leg = [];
      if (V.should && g4) leg.push(['mp-dexp', 'should happen']);
      if (V.did) leg.push(['mp-dser0', 'did happen']);
      return box(g4 ? 'Should happen and did happen' : 'What happened', s + '</svg>' + legend(leg));
    }
    function tree(A, B, W) {
      var nL = A.length * B.length, rowH = 26, H = nL * rowH + 10, x0 = 14, x1 = W * 0.38, x2 = W * 0.72, s = svgOpen(W, H, 'mp-dtree'), k = 0;
      A.forEach(function (a, i) {
        var ya = (i + 0.5) * B.length * rowH + 5;
        s += '<line class="mp-dtl" x1="' + x0 + '" y1="' + (H / 2) + '" x2="' + (x1 - 14) + '" y2="' + ya + '"/>' + t(x1, ya + 5, a.s, 'mp-dtx', 'middle');
        B.forEach(function (b) {
          var yb = (k + 0.5) * rowH + 5; k++;
          s += '<line class="mp-dtl" x1="' + (x1 + 14) + '" y1="' + ya + '" x2="' + (x2 - 14) + '" y2="' + yb + '"/>' + t(x2, yb + 5, b.s, 'mp-dtx', 'middle') +
            t(W - 4, yb + 5, a.s + b.s + (shown ? ' ' + frac(a.p[0] * b.p[0], a.p[1] * b.p[1]) : ''), 'mp-dtx2', 'end');
        });
      });
      return box('Tree diagram: ' + nL + ' outcomes', s + '</svg>');
    }
    function drawChance(W) {
      var C = P.c, V = C.view, wide = W >= 640, cw = chartW(W, wide), D = W < 500 ? 130 : 170, h = '', anim = spinNow;
      if (two()) {
        var pr = pair(), A = outs(pr[0]), B = outs(pr[1]), l2 = C.last2;
        h += '<div class="mp-prow mp-ddev">' + devPic(pr[0], l2 ? l2[0] : -1, D * 0.8, C.ang, anim) + devPic(pr[1], l2 ? l2[1] : -1, D * 0.8, C.ang, anim) + '</div>';
        if (shown && l2) {
          var a = A[l2[0]], b = B[l2[1]], p = [a.p[0] * b.p[0], a.p[1] * b.p[1]], got = C.cnt2[l2[0]][l2[1]];
          h += '<div class="mp-prow">' + chip(a.s + ' and ' + b.s + ' should', frac(a.p[0], a.p[1]) + ' × ' + frac(b.p[0], b.p[1]) + ' = ' + frac(p[0], p[1]) + ' ≈ ' + Math.round(p[0] / p[1] * 100) + '%') +
            chip('did', got + '/' + C.n + ' ≈ ' + Math.round(got / C.n * 100) + '%', true) + '</div>';
        }
        var parts = box('Did happen', tbl([DDEV[pr[0]][0].toLowerCase()].concat(B.map(function (o) { return o.s; })), A.map(function (o, i) { return [o.s].concat(C.cnt2[i]); })));
        if (V.tree && g8 && A.length * B.length <= 12) parts += tree(A, B, cw);
        return h + '<div class="mp-prow">' + parts + '</div>';
      }
      var L = outs(C.dev);
      h += '<div class="mp-prow mp-ddev">' + devPic(C.dev, C.last, D, C.ang, anim) + '</div>';
      var parts2 = '';
      if ((V.did || V.should && g4) && (C.n || V.should && g4)) parts2 += shouldDid(L, C.cnt, C.n, cw, wide ? 240 : 200);
      if (V.line) parts2 += probLine(L, cw);
      if (!C.n) h += '<p class="mp-fknote">' + DDEV[C.dev][1] + ' to see what happens.</p>';
      return h + (parts2 ? '<div class="mp-prow">' + parts2 + '</div>' : '');
    }
    function cNudge(id, d) {
      var C = P.c, a = id[0] === 's' ? C.sec : C.bag, i = +id.slice(1);
      if (d < 0 && sum(a) <= 1 && a[i]) return;
      act(function () { a[i] = clamp(a[i] + d, 0, id[0] === 's' ? 8 : 10); resetCounts(); last = 'parts'; });
    }

    /* ======== tray, readout, snaps ======== */
    function stp(id, lab, val, cls) {
      return '<div class="mp-dans' + (cls ? ' ' + cls : '') + '"><small>' + lab + '</small><div class="mp-pstr"><button type="button" class="mp-pstb" data-st="' + id + '" data-d="-1" aria-label="' + lab.replace(/<[^>]+>/g, '') + ': less">&minus;</button>' +
        '<b>' + val + '</b><button type="button" class="mp-pstb" data-st="' + id + '" data-d="1" aria-label="' + lab.replace(/<[^>]+>/g, '') + ': more">+</button></div></div>';
    }
    function trayHtml() {
      if (P.mode === 'sort') {
        var left = DPC.map(function (p, i) { return P.s.at[i] == null ? i : -1; }).filter(function (i) { return i >= 0; });
        return '<small>Sort these</small>' + (left.length ? left.map(function (i) {
          return '<button type="button" class="mp-bpc mp-dtp" data-p="' + i + '" aria-pressed="' + (sel === i) + '" aria-label="' + pname(DPC[i]) + '">' + svgOpen(44, 44) + shape(DPC[i], 22, 22, 40) + '</svg></button>';
        }).join('') : '<p class="mp-fknote">All sorted</p>');
      }
      if (P.mode === 'graph') {
        var G = P.g, S = sv(), c = G.two && G.cls ? G.c2 : G.c;
        return (G.two ? '<div class="mp-fktabs" role="group" aria-label="Adding to"><button type="button" data-cls="0" aria-pressed="' + !G.cls + '">Class A</button><button type="button" data-cls="1" aria-pressed="' + !!G.cls + '">Class B</button></div>' : '<small>Answers</small>') +
          S.a.map(function (a, i) { return stp('g' + i, sw(i) + a, c[i]); }).join('') +
          (g4 ? '<div class="mp-fktabs mp-dby" role="group" aria-label="Each tap adds"><button type="button" data-by="1" aria-pressed="' + (G.by === 1) + '">1</button><button type="button" data-by="10" aria-pressed="' + (G.by === 10) + '">10</button></div>' : '');
      }
      if (P.mode === 'nums') {
        var N = P.n;
        if (g8 && N.two) return '<small>Pairs</small>' + stp('x', 'height', N.x, 'mp-dbig') + stp('y', 'arm span', N.y, 'mp-dbig') + '<div class="mp-fkthings"><button type="button" data-do="addpair">Add the pair</button><button type="button" data-do="random">Random class</button></div>';
        return '<small>Numbers</small>' + stp('v', DSETS[N.set].name, N.cur, 'mp-dbig') + '<div class="mp-fkthings"><button type="button" data-do="tens" aria-label="10 less">&minus;10</button><button type="button" data-do="tenp" aria-label="10 more">+10</button></div>' +
          '<div class="mp-fkthings"><button type="button" data-do="add">Add it</button><button type="button" data-do="random">Random class</button></div>';
      }
      var C = P.c, devs = ['spin', 'coin', 'die', 'bag'];
      var h = '<small>Use</small><div class="mp-fkthings">' + (two() ? DTWO.map(function (p, i) { return '<button type="button" data-pair="' + i + '" aria-pressed="' + (C.pair === i) + '">' + DDEV[p[0]][0] + ' and ' + DDEV[p[1]][0].toLowerCase() + '</button>'; }).join('') :
        devs.map(function (d) { return '<button type="button" data-dev="' + d + '" aria-pressed="' + (C.dev === d) + '">' + DDEV[d][0] + '</button>'; }).join('')) + '</div>';
      var ed = two() ? (pair()[0] === 'spin' ? 'spin' : '') : C.dev;
      if (ed === 'spin' || ed === 'bag') h += '<small>' + (ed === 'spin' ? 'Parts' : 'Counters') + '</small>' + DCOLS.map(function (n, i) { return stp((ed === 'spin' ? 's' : 'b') + i, sw(i) + n, (ed === 'spin' ? C.sec : C.bag)[i]); }).join('');
      return h;
    }
    function readout() {
      if (!shown) { read.innerHTML = ''; return; }
      var big = '', eq = '';
      if (P.mode === 'sort') {
        big = P.s.ord.length + ' of ' + DPC.length + ' sorted';
        var i = P.s.lp;
        if (i >= 0 && P.s.at[i] != null) {
          var p = DPC[i], a = has(p, P.s.r1), b = has(p, P.s.r2), R = goes(p), w1 = (a ? 'is ' : 'is not ') + '<b>' + phr(P.s.r1) + '</b>';
          if (P.s.how !== 'groups') w1 += (a === b ? (a ? ' and ' : ' and not ') : (b ? ' but is ' : ' but not ')) + '<b>' + phr(P.s.r2) + '</b>';
          eq = 'the ' + pname(p) + ' ' + w1 + ', so it goes ' + (R === 'n' && P.s.how === 'venn' ? '<b>outside</b>' : 'in <b>' + rname(R) + '</b>') + (P.s.at[i] !== R ? '. Move it.' : '');
        }
      } else if (P.mode === 'graph') {
        var G = P.g, S = sv(), tot = sum(G.c), m = modes(G.c), top = m.map(function (k) { return S.a[k]; }).join(' and ');
        big = top || 'no answers yet';
        if (m.length) {
          eq = 'most chose <b>' + top + '</b> (' + G.c[m[0]] + ')';
          if (g7) eq += ': ' + G.c[m[0]] + ' of ' + fmt(tot) + ' = <b>' + pct(G.c[m[0]], tot) + '</b>';
          else if (g5) eq += ': <b>' + frac(G.c[m[0]], tot) + '</b> of the class';
          eq += '. <b>' + fmt(tot) + '</b> answered';
          if (G.two) { var m2 = modes(G.c2); eq += '. Class B: most chose <b>' + m2.map(function (k) { return S.a[k]; }).join(' and ') + '</b>'; }
        }
      } else if (P.mode === 'nums') {
        var N = P.n;
        if (g8 && N.two) { big = pl(N.pairs.length, 'pair', 'pairs'); if (N.pairs.length > 2) { var f = fit(N.pairs); eq = relWords(f.r) + (f.r > 0.3 ? ': taller people have longer arm spans' : ''); } }
        else if (N.v.length) {
          var st = stats(N.v);
          big = pl(st.n, 'number', 'numbers');
          eq = 'from <b>' + st.lo + '</b> to <b>' + st.hi + '</b> ' + DSETS[N.set].unit;
          if (g7 && N.prev && (last === 'add' || last === 'takeoff')) eq += '. The mean went from <b>' + fmt(r1(N.prev.mean)) + '</b> to <b>' + fmt(r1(st.mean)) + '</b>';
        }
      } else {
        var C = P.c;
        if (two()) { big = pl(C.n, 'try', 'tries'); var A = outs(pair()[0]), B = outs(pair()[1]); eq = '<b>' + A.length * B.length + '</b> outcomes'; if (A.every(function (o) { return o.p[0] === A[0].p[0]; }) && B.every(function (o) { return o.p[0] === B[0].p[0]; })) eq += ', each <b>' + frac(1, A.length * B.length) + '</b>'; }
        else {
          var L = outs(C.dev), dv = DDEV[C.dev], j = C.last >= 0 ? C.last : 0, o0 = L[j];
          big = pl(C.n, dv[2], dv[3]);
          if (!g4) {
            var srt = L.slice().sort(function (x, y) { return y.p[0] - x.p[0]; });
            eq = '<b>' + o0.n + '</b> is ' + pwords(o0.p);
            if (srt.length > 1 && srt[0].p[0] > srt[srt.length - 1].p[0]) eq += '. <b>' + srt[0].n + '</b> is more likely than <b>' + srt[srt.length - 1].n + '</b>';
            if (C.n) eq += '. ' + o0.n.replace(/^./, function (c) { return c.toUpperCase(); }) + ' came up <b>' + C.cnt[j] + '</b> time' + (C.cnt[j] === 1 ? '' : 's');
          } else {
            var ex = C.n * o0.p[0] / o0.p[1];
            eq = '<b>' + o0.n + '</b> should come up <b>' + pshow(o0.p) + '</b> of the time' + (C.n ? ' (' + fmt(r1(ex)) + '); it did <b>' + C.cnt[j] + '</b> time' + (C.cnt[j] === 1 ? '' : 's') : '');
          }
        }
      }
      read.innerHTML = (big ? '<p class="mp-total"><span class="mp-num">' + big + '</span></p>' : '') + (eq ? '<p class="mp-ceq">' + eq + '</p>' : '');
    }
    function snaps() {
      var h = '';
      if (P.mode === 'sort') {
        var S = P.s;
        if (g2) h += ['groups', 'venn', 'carroll'].map(function (k) { return btn('how', { groups: 'Groups', venn: 'Venn', carroll: 'Carroll' }[k], S.how === k, false, ' data-v="' + k + '"'); }).join('');
        h += btn('r1', 'Rule: ' + DRULE[S.r1][2]) + (S.how !== 'groups' ? btn('r2', 'Rule 2: ' + DRULE[S.r2][2]) : '');
        if (sel >= 0 && S.at[sel] != null) h += btn('back', 'Put back');
        h += btn('auto', 'Sort them all', null, S.ord.length === DPC.length) + btn('clear', 'Clear', null, !S.ord.length);
      } else if (P.mode === 'graph') {
        var G = P.g, V = G.view;
        h += btn('q', 'Next question');
        h += views(V, [['tally', g4 ? 'Table' : 'Tally']].concat(!g5 ? [['pict', 'Picture graph', G.two]] : [], g2 && sv().num ? [['line', 'Line plot', G.two]] : [], g2 ? [['bar', 'Bar graph']] : [],
          g5 ? [['stack', 'Stacked bar']] : [], g7 ? [['circle', 'Circle graph']] : [], g3 && !g4 ? [['fair', 'Fair share']] : []));
        if (g3 && !g4 && (V.pict || V.bar)) h += btn('key', (V.bar ? '1 square = ' : '1 picture = ') + G.key);
        if (g4) h += btn('two', 'Two classes', G.two);
        if (!sv().num) h += btn('order', 'Most to least', G.order);
        h += btn('new', 'New class') + btn('clear', 'Clear', null, !sum(G.c) && !(G.two && sum(G.c2)));
      } else if (P.mode === 'nums') {
        var N = P.n, NV = N.view;
        if (g8) h += btn('ntwo', 'Pairs', N.two);
        if (g8 && N.two) h += views(NV, [['scatter', 'Scatter plot'], ['trend', 'Trend line']]) + btn('pclear', 'Clear', null, !N.pairs.length);
        else {
          h += btn('set', 'Data: ' + DSETS[N.set].name) + views(NV, [['stem', 'Stem and leaf']].concat(g6 ? [['hist', 'Histogram']] : [], [['mean', 'Mean'], ['median', 'Median'], ['mode', 'Mode']], g6 ? [['range', 'Range']] : []));
          if (g6 && NV.hist) h += btn('bin', 'Bars of ' + N.bin);
          h += btn('undoadd', 'Take one off', null, !N.v.length) + btn('nclear', 'Clear', null, !N.v.length);
        }
      } else {
        var C = P.c, CV = C.view, vb = two() ? '' : DDEV[C.dev][1] + ' ';
        h += btn('run', vb + '1' + (vb ? '' : ' time'), null, false, ' data-v="1"') + btn('run', vb + '10' + (vb ? '' : ' times'), null, false, ' data-v="10"') + (g3 ? btn('run', vb + '100' + (vb ? '' : ' times'), null, false, ' data-v="100"') : '');
        if (!two()) h += views(CV, (g4 ? [['should', 'Should happen']] : []).concat([['did', g4 ? 'Did happen' : 'Graph'], ['line', 'Probability line']], g5 ? [['pct', 'As %']] : []));
        if (g6) h += btn('ctwo', 'Two at once', C.two);
        if (two() && g8) { var n2 = outs(pair()[0]).length * outs(pair()[1]).length; h += btn('view', 'Tree diagram', !!CV.tree, n2 > 12, ' data-v="tree"'); }
        h += btn('cclear', 'Clear', null, !C.n);
      }
      snapsEl.innerHTML = h;
    }
    function draw() {
      tray.innerHTML = trayHtml();
      readout();
      snaps();
      qsa('.mp-ddo [data-m]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === P.mode)); });
      var sz = size(), W = Math.max(260, sz[0]);
      win.innerHTML = P.mode === 'sort' ? drawSort(W, sz[1]) : P.mode === 'graph' ? drawGraph(W) : P.mode === 'nums' ? drawNums(W) : drawChance(W);
      spinNow = false;
      var ptr = qs('.mp-dptr.go', win);
      if (ptr && !T.fast) { var end = ptr.style.transform; ptr.style.transition = 'none'; ptr.style.transform = 'rotate(' + (parseFloat(end.slice(7)) - 720) + 'deg)'; void ptr.getBoundingClientRect(); ptr.style.transition = ''; ptr.style.transform = end; }
    }

    /* ---- moves ---- */
    function snapshot() { return JSON.stringify(P); }
    function act(fn) { var b = snapshot(); fn(); if (snapshot() !== b) { hist.push(b); if (hist.length > 60) hist.shift(); } draw(); change(); }
    function change() { if (o.onChange) o.onChange(state(), T); }
    function state() {
      var st = P.n.v.length ? stats(P.n.v) : null;
      return { mode: P.mode, sorted: P.s.ord.length, wrong: P.s.ord.filter(function (i) { return goes(DPC[i]) !== P.s.at[i]; }).length, counts: P.g.c.slice(), total: sum(P.g.c),
        numbers: sorted(P.n.v), mean: st ? st.mean : null, median: st ? st.med : null, tries: P.c.n, did: P.c.cnt.slice(), last: last };
    }
    function cycleRule(k) {
      var S = P.s, other = k === 'r1' ? S.r2 : S.r1, r = S[k];
      do { r = (r + 1) % DRULE.length; } while (S.how !== 'groups' && r === other);
      S[k] = r;
    }
    function clearSort() { P.s.at = DPC.map(function () { return null; }); P.s.ord = []; P.s.lp = -1; sel = -1; }
    tray.addEventListener('click', function (e) {
      var s = e.target.closest('.mp-pstb'), b = e.target.closest('button');
      if (P.mode === 'sort') { if (!skip && sel >= 0) unplace(sel); skip = false; return; }
      if (s) {
        var id = s.getAttribute('data-st'), d = +s.getAttribute('data-d');
        if (id[0] === 'g') return gNudge(+id.slice(1), d);
        if (id === 'v') return act(function () { P.n.cur = clamp(P.n.cur + d, DSETS[P.n.set].lo, DSETS[P.n.set].hi); last = 'value'; });
        if (id === 'x' || id === 'y') return act(function () { P.n[id] = clamp(P.n[id] + d, 100, 200); last = 'value'; });
        return cNudge(id, d);
      }
      if (!b) return;
      if (b.hasAttribute('data-cls')) return act(function () { P.g.cls = +b.getAttribute('data-cls'); last = 'class'; });
      if (b.hasAttribute('data-by')) return act(function () { P.g.by = +b.getAttribute('data-by'); last = 'by'; });
      if (b.hasAttribute('data-dev')) return act(function () { P.c.dev = b.getAttribute('data-dev'); resetCounts(); last = 'device'; });
      if (b.hasAttribute('data-pair')) return act(function () { P.c.pair = +b.getAttribute('data-pair'); resetCounts(); last = 'pair'; });
      var dd = b.getAttribute('data-do'), N = P.n, set = DSETS[N.set];
      if (dd === 'tens' || dd === 'tenp') act(function () { N.cur = clamp(N.cur + (dd === 'tenp' ? 10 : -10), set.lo, set.hi); last = 'value'; });
      if (dd === 'add') { if (N.v.length >= 40) { announce(T, 'The list holds up to 40 numbers.'); return; } nAdd(); }
      if (dd === 'addpair') act(function () { if (N.pairs.length < 30) N.pairs.push([N.x, N.y]); last = 'addpair'; });
      if (dd === 'random') act(function () {
        var k = 20, R = Math.random;
        if (g8 && N.two) { N.pairs = []; for (var i = 0; i < 12; i++) { var x = 140 + Math.round(R() * 35); N.pairs.push([x, clamp(x + Math.round((R() - 0.5) * 10), 100, 200)]); } }
        else { N.prev = stats(N.v); N.v = []; for (var j = 0; j < k; j++) { var u = (R() + R() + R()) / 3; N.v.push(Math.round(set.lo + 10 + u * (set.hi - set.lo - 20))); } }
        last = 'random';
      });
    });
    qs('.mp-ddo', root).addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b) { sel = -1; act(function () { P.mode = b.getAttribute('data-m'); last = 'mode'; }); } });
    mat.addEventListener('click', function (e) {
      var s = e.target.closest('.mp-snap'), nv = e.target.closest('[data-nv]'), pi = e.target.closest('[data-pi]');
      if (nv) return nAdd(+nv.getAttribute('data-nv'));
      if (pi) return act(function () { P.n.pairs.splice(+pi.getAttribute('data-pi'), 1); last = 'takeoff'; });
      if (!s) {
        if (P.mode === 'sort' && !skip && sel >= 0 && e.target.closest('.mp-dsv')) placeAt(sel, regionAt(e.clientX, e.clientY));
        skip = false;
        return;
      }
      var a = s.getAttribute('data-a'), v = s.getAttribute('data-v');
      if (a === 'back') return unplace(sel);
      act(function () {
        var G = P.g, N = P.n, C = P.c, R = Math.random;
        if (a === 'how') { P.s.how = v; if (v !== 'groups' && P.s.r1 === P.s.r2) cycleRule('r2'); clearSort(); }
        if (a === 'r1' || a === 'r2') { cycleRule(a); clearSort(); }
        if (a === 'auto') { DPC.forEach(function (p, i) { if (P.s.at[i] == null) P.s.ord.push(i); P.s.at[i] = goes(p); }); P.s.lp = -1; sel = -1; }
        if (a === 'clear' && P.mode === 'sort') clearSort();
        if (a === 'view') (P.mode === 'graph' ? G.view : P.mode === 'nums' ? N.view : C.view)[v] = !(P.mode === 'graph' ? G.view : P.mode === 'nums' ? N.view : C.view)[v];
        if (a === 'q') { G.sv = (G.sv + 1) % (g7 ? DSURV.length : DSURV.length - 1); G.c = sv().d.slice(); G.c2 = sv().e.slice(); }
        if (a === 'key') G.key = G.key === 1 ? 2 : 1;
        if (a === 'two') { G.two = !G.two; G.cls = 0; }
        if (a === 'order') G.order = !G.order;
        if (a === 'new') {
          var per = g7 ? 200 : g4 ? 30 : 20;
          [G.c, G.c2].forEach(function (c) { var w = c.map(function () { return 0.4 + R(); }), tw = sum(w), left = per; c.forEach(function (x, i) { c[i] = i === c.length - 1 ? left : Math.round(per * w[i] / tw); left -= c[i]; if (left < 0) { c[i] += left; left = 0; } }); });
        }
        if (a === 'clear' && P.mode === 'graph') { G.c = G.c.map(function () { return 0; }); G.c2 = G.c2.map(function () { return 0; }); }
        if (a === 'ntwo') N.two = !N.two;
        if (a === 'pclear') N.pairs = [];
        if (a === 'set') { N.set = (N.set + 1) % DSETS.length; N.v = DSETS[N.set].d.slice(); N.cur = N.v[Math.floor(N.v.length / 2)]; N.prev = null; }
        if (a === 'bin') N.bin = N.bin === 10 ? 5 : 10;
        if (a === 'undoadd') { N.prev = stats(N.v); N.v.pop(); }
        if (a === 'nclear') { N.prev = null; N.v = []; }
        if (a === 'ctwo') { C.two = !C.two; resetCounts(); }
        if (a === 'cclear') resetCounts();
        last = a;
      });
      if (a === 'run') run(+v);
    });
    T.put = function (i, R) { placeAt(i, R || goes(DPC[i])); };
    T.undo = function () { if (!hist.length) return; P = JSON.parse(hist.pop()); sel = -1; last = 'undo'; draw(); change(); };
    T.canUndo = function () { return hist.length > 0; };
    T.showNumbers = function (on) { shown = !!on; draw(); change(); };
    T.state = state;
    T.reset = function () { fresh(); hist = []; sel = -1; draw(); };
    var lw = 0;
    if (window.ResizeObserver) new ResizeObserver(function () { var w = mat.clientWidth; if (w && w !== lw) { lw = w; draw(); } }).observe(mat); else window.addEventListener('resize', draw);
    T.reset();
    return T;
  }
  M.data = function (root, o) { return toolData(root, o || {}); };

  /* ================= Grid and robot (Toolbox) =================
     Make: Robot (code from blocks: arrows in Grades 1 and 2, two robots at the same time from Grade 2, forward and quarter turns and
     Repeat from Grade 3, a repeat inside a repeat from Grade 4, If wall ahead and Repeat until at the goal from Grade 5, My block
     (a sub-program) from Grade 7), Map (Grades 1 to 3: places on a grid map and directions between two of them), Plot (Grade 4 and up:
     points on a coordinate grid, scales from Grade 5, four quadrants from Grade 6) and Move (Grade 4 and up: slide and flip, turn from
     Grade 5, then another move from Grade 6, grow from Grade 7). Show number shows the counts, directions and coordinates. */
  var GDX = [0, 1, 0, -1], GDY = [-1, 0, 1, 0], GDN = ['up', 'right', 'down', 'left'];
  var GBLK = { U: ['↑ up', 'mv'], R: ['→ right', 'mv'], D: ['↓ down', 'mv'], L: ['← left', 'mv'], F: ['forward', 'mv'], TL: ['turn left', 'tn'], TR: ['turn right', 'tn'], TA: ['turn around', 'tn'],
    REP: ['repeat', 'rp'], IF: ['if wall ahead', 'cd'], UNTIL: ['repeat until at the goal', 'rp'], MY: ['my block', 'my'] };
  var GPLACES = [['school', 'S', 1], ['pond', 'P', 0], ['swings', 'W', 5], ['tree', 'T', 3], ['bench', 'B', 4], ['house', 'H', 2]];
  var GMAZES = [
    { s: [0, 0, 1], g: [7, 5], w: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [6, 2], [6, 3], [5, 3], [4, 3], [3, 3], [2, 3], [1, 3], [1, 4]] },
    { s: [0, 5, 0], g: [7, 0], w: [[1, 5], [1, 4], [1, 3], [1, 2], [3, 0], [3, 1], [3, 2], [3, 3], [5, 5], [5, 4], [5, 3], [5, 2]] },
    { s: [0, 2, 1], g: [7, 3], w: [[2, 0], [2, 1], [2, 2], [4, 3], [4, 4], [4, 5], [6, 0], [6, 1], [6, 2], [2, 4], [2, 5]] }
  ];
  /* shapes to move: on the 0 to 10 grid (Grades 4 and 5), and near (0, 0) on the four-quadrant grid so a turn or grow stays on it */
  var GSHAPES = [[[3, 4], [5, 4], [3, 7]], [[2, 2], [2, 6], [5, 5], [2, 4]], [[1, 1], [4, 1], [4, 2], [2, 2], [2, 4], [1, 4]]];
  var GSHAPES4 = [[[1, 2], [3, 2], [1, 4]], [[1, 0], [1, 4], [3, 3], [1, 2]], [[0, 0], [3, 0], [3, 1], [1, 1], [1, 3], [0, 3]]];
  function toolGrid(root, o) {
    var T = base(root, 'grd');
    root.classList.add('mp-tool', 'mp-fkt', 'mp-patt', 'mp-datt', 'mp-grt');
    var gr = window.Atlas && +Atlas.grade || 0, g2 = !gr || gr >= 2, g3 = !gr || gr >= 3, g4 = !gr || gr >= 4, g5 = !gr || gr >= 5, g6 = !gr || gr >= 6, g7 = !gr || gr >= 7, g8 = !gr || gr >= 8;
    var early = gr && gr <= 3;
    var MODES = [['robot', 'Robot']].concat(!g4 || early ? [['map', 'Map']] : [], g4 ? [['plot', 'Plot'], ['move', 'Move']] : []);
    var COLS = 8, ROWS = 6;
    root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray mp-fktray mp-ptray mp-gtr"></div><div class="mp-dmain"><div class="mp-cmode mp-gdo" role="group" aria-label="Make"><span>Make</span>' +
      MODES.map(function (m) { return '<button type="button" data-m="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>' +
      '<div class="mp-read" aria-live="polite"></div><div class="mp-mat mp-fkmat mp-pmat"><div class="mp-pwin"></div><div class="mp-snaps"></div></div><p class="mp-live sr" aria-live="polite"></p></div></div>';
    var tray = qs('.mp-gtr', root), mat = qs('.mp-pmat', root), win = qs('.mp-pwin', mat), read = qs('.mp-read', root), snapsEl = qs('.mp-snaps', mat);
    /* state: the move; Robot: the code for robot A and B and My block, the maze, the goal, pen and two robots; Map: where each place is
       and the two places picked; Plot: the points, the point to add, joined, the scale; Move: the shape, the move and its settings,
       and earlier moves kept */
    var P, shown = false, hist = [], last = '', k = 0, tgt = 'A', play = null, pickPlace = '';
    function fresh() {
      P = { mode: 'robot',
        r: { A: [], B: [], my: [], two: false, pen: true, maze: -1, goal: g5 ? [6, 1] : [5, 1] },
        m: { at: { school: [1, 4], pond: [3, 1], swings: [6, 2], tree: [5, 5], bench: [2, 2] }, from: '', to: '' },
        p: { pts: [], x: 1, y: 4, join: false, scale: 1 },
        v: { shape: 0, base: shapes()[0].map(function (q) { return q.slice(); }), move: 'slide', dx: 3, dy: -1, line: 0, turn: 90, about: 0, k: 2, done: [] } };
      tgt = 'A'; k = 0;
    }
    function size() { var cs = getComputedStyle(mat); return [(mat.clientWidth || 700) - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), (mat.clientHeight || 500) - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)]; }
    function btn(a, t, on, dis, extra) { return '<button type="button" class="mp-snap" data-a="' + a + '"' + (extra || '') + (on != null ? ' aria-pressed="' + on + '"' : '') + (dis ? ' disabled' : '') + '>' + t + '</button>'; }
    function svgOpen(W, H, cls, lab) { return '<svg class="mp-dsvg ' + (cls || '') + '" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" ' + (lab ? 'role="img" aria-label="' + lab + '"' : 'aria-hidden="true"') + '>'; }
    function t(x, y, s, cls, anchor) { return '<text class="' + (cls || 'mp-dtx') + '" x="' + (+x).toFixed(1) + '" y="' + (+y).toFixed(1) + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + s + '</text>'; }
    function n(v) { v = Math.round(v * 100) / 100; return v < 0 ? '−' + fmt(-v) : fmt(v); }
    function pt(q) { return '(' + n(q[0]) + ', ' + n(q[1]) + ')'; }
    function stp(id, lab, val) {
      return '<div class="mp-dans mp-dbig"><small>' + lab + '</small><div class="mp-pstr"><button type="button" class="mp-pstb" data-st="' + id + '" data-d="-1" aria-label="' + lab + ': less">&minus;</button>' +
        '<b>' + val + '</b><button type="button" class="mp-pstb" data-st="' + id + '" data-d="1" aria-label="' + lab + ': more">+</button></div></div>';
    }
    function tbl(head, rows) {
      return '<table class="mp-ptbl mp-dtbl"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) { return '<tr>' + r.map(function (c, j) { return '<td' + (j ? '' : ' class="l"') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
    }

    /* ======== Robot ======== */
    function maze() { return P.r.maze >= 0 ? GMAZES[P.r.maze] : null; }
    function starts() { var z = maze(); return { A: z ? z.s.slice() : [1, 4, 0], B: [1, 1, 0] }; }
    function goal() { var z = maze(); return z ? z.g : P.r.goal; }
    function walls() { var z = maze(); return z ? z.w : []; }
    function blocked(x, y) { return x < 0 || y < 0 || x >= COLS || y >= ROWS || walls().some(function (w) { return w[0] === x && w[1] === y; }); }
    /* the list a code address points to: A, B or my, then a block number and b (inside) or e (otherwise) */
    function listAt(addr) {
      var parts = addr.split('/'), L = P.r[parts[0]];
      for (var i = 1; i < parts.length; i++) { var b = L[parseInt(parts[i], 10)]; L = b && b[parts[i].slice(-1)]; if (!L) return null; }
      return L;
    }
    function count(L) { var c = 0; L.forEach(function (b) { c++; if (b.b) c += count(b.b); if (b.e) c += count(b.e); }); return c; }
    function depth(addr) { return addr.split('/').length - 1; }
    /* run the code and keep every step: where the robot is, which way it faces, the block doing it, and a bump into a wall */
    function trace(who) {
      var s = starts()[who], st = { x: s[0], y: s[1], d: s[2] }, out = [], stop = false, G = goal();
      function rec(at, bump) { out.push({ x: st.x, y: st.y, d: st.d, at: at, bump: !!bump }); if (bump || out.length >= 300) stop = true; }
      function go(d, at) { var nx = st.x + GDX[d], ny = st.y + GDY[d]; if (blocked(nx, ny)) rec(at, true); else { st.x = nx; st.y = ny; rec(at); } }
      function run(L, addr, lvl) {
        for (var i = 0; i < L.length && !stop; i++) {
          var b = L[i], at = addr + '#' + i, sub = addr + '/' + i;
          if (b.t === 'U' || b.t === 'R' || b.t === 'D' || b.t === 'L') { st.d = 'URDL'.indexOf(b.t); go(st.d, at); }
          else if (b.t === 'F') go(st.d, at);
          else if (b.t === 'TL' || b.t === 'TR' || b.t === 'TA') { st.d = (st.d + (b.t === 'TL' ? 3 : b.t === 'TR' ? 1 : 2)) % 4; rec(at); }
          else if (b.t === 'REP') for (var r = 0; r < b.n && !stop; r++) run(b.b, sub + 'b', lvl);
          else if (b.t === 'IF') { if (blocked(st.x + GDX[st.d], st.y + GDY[st.d])) run(b.b, sub + 'b', lvl); else run(b.e, sub + 'e', lvl); }
          else if (b.t === 'UNTIL') { var guard = 0; while (!stop && !(st.x === G[0] && st.y === G[1]) && guard++ < 60) { var before = out.length; run(b.b, sub + 'b', lvl); if (out.length === before) break; } }
          else if (b.t === 'MY' && lvl < 3) run(P.r.my, 'my', lvl + 1);
        }
      }
      run(P.r[who], who, 0);
      return out;
    }
    function robotSvg(x, y, s, d, cls) { return '<g class="mp-grob ' + cls + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + d * 90 + ')"><rect x="' + (-s / 2) + '" y="' + (-s / 2) + '" width="' + s + '" height="' + s + '" rx="' + s / 4 + '"/><path class="mp-grf" d="M' + (-s * .2) + ' ' + (-s * .04) + 'L0 ' + (-s * .32) + 'L' + (s * .2) + ' ' + (-s * .04) + 'Z"/><circle class="mp-grf" cx="0" cy="' + (s * .17) + '" r="' + (s * .09) + '"/></g>'; }
    function cellGrid(u, inner, lab) {
      var W = COLS * u + 2, H = ROWS * u + 2, s = svgOpen(W, H, 'mp-gsv', lab) + '<rect class="mp-gbg" x="1" y="1" width="' + COLS * u + '" height="' + ROWS * u + '" rx="10"/>';
      for (var i = 1; i < COLS; i++) s += '<line class="mp-gln" x1="' + (1 + i * u) + '" x2="' + (1 + i * u) + '" y1="1" y2="' + (ROWS * u + 1) + '"/>';
      for (var j = 1; j < ROWS; j++) s += '<line class="mp-gln" y1="' + (1 + j * u) + '" y2="' + (1 + j * u) + '" x1="1" x2="' + (COLS * u + 1) + '"/>';
      return s + inner + '</svg>';
    }
    function C(v, u) { return 1 + v * u + u / 2; }
    function codeHtml(L, addr, cur) {
      return L.map(function (b, i) {
        var at = addr + '#' + i, sub = addr + '/' + i, lab = b.t === 'REP' ? 'repeat' : GBLK[b.t][0], h = '<div class="mp-gb k' + GBLK[b.t][1] + (cur === at ? ' cur' : '') + '"><span>' + lab + '</span>';
        if (b.t === 'REP') h += '<span class="mp-grn"><button type="button" data-rn="' + at + '" data-d="-1" aria-label="Repeat fewer times">&minus;</button><b>' + b.n + '</b><button type="button" data-rn="' + at + '" data-d="1" aria-label="Repeat more times">+</button></span><span>times</span>';
        h += '<button type="button" class="mp-gx" data-del="' + at + '" aria-label="Take off ' + lab + '">&#10005;</button></div>';
        if (b.b) h += box2(sub + 'b', b.t === 'IF' ? 'then' : '', b.b, cur);
        if (b.e) h += '<div class="mp-gb kcd mp-gelse"><span>otherwise</span></div>' + box2(sub + 'e', '', b.e, cur);
        return h;
      }).join('');
    }
    function box2(addr, lab, L, cur) { return '<div class="mp-gin' + (tgt === addr ? ' tgt' : '') + '" data-tgt="' + addr + '">' + (L.length ? codeHtml(L, addr, cur) : '<button type="button" class="mp-gadd" data-tgt="' + addr + '">' + (tgt === addr ? 'blocks go here' : 'tap to add here') + '</button>') + '</div>'; }
    function codePanel(who, cur, title) {
      var L = P.r[who];
      return '<div class="mp-gcode' + (tgt === who ? ' tgt' : '') + '" data-tgt="' + who + '"><div class="mp-fkwl">' + title + '</div>' +
        (L.length ? codeHtml(L, who, cur) : '<button type="button" class="mp-gadd" data-tgt="' + who + '">' + (tgt === who ? 'Tap blocks to add them here' : 'tap to add here') + '</button>') + '</div>';
    }
    function drawRobot(W, H) {
      var two = g2 && P.r.two, trA = trace('A'), trB = two ? trace('B') : [], st = starts(), G = goal(), ww = walls();
      var side = W >= 700, u = Math.max(30, Math.min(80, Math.floor((side ? W - 300 : W - 4) / COLS), Math.floor((H - (side ? 40 : 250)) / ROWS)));
      var inner = '';
      ww.forEach(function (w) { inner += '<rect class="mp-gwall" x="' + (1 + w[0] * u + 3) + '" y="' + (1 + w[1] * u + 3) + '" width="' + (u - 6) + '" height="' + (u - 6) + '" rx="6"/>'; });
      inner += '<circle class="mp-ggoal" cx="' + C(G[0], u) + '" cy="' + C(G[1], u) + '" r="' + (u * .3) + '"/><circle class="mp-ggoal2" cx="' + C(G[0], u) + '" cy="' + C(G[1], u) + '" r="' + (u * .1) + '"/>';
      [['A', trA, 'a'], ['B', trB, 'b']].forEach(function (R) {
        if (R[0] === 'B' && !two) return;
        var s0 = st[R[0]], tr = R[1], upto = Math.min(k, tr.length), pts = [[s0[0], s0[1]]], cur = { x: s0[0], y: s0[1], d: s0[2] };
        inner += t(C(s0[0], u), 1 + s0[1] * u + u - 5, 'start', 'mp-gst', 'middle');
        for (var i = 0; i < upto; i++) { cur = tr[i]; if (pts[pts.length - 1][0] !== cur.x || pts[pts.length - 1][1] !== cur.y) pts.push([cur.x, cur.y]); }
        if (P.r.pen && pts.length > 1) inner += '<polyline class="mp-gpath ' + R[2] + '" points="' + pts.map(function (q) { return C(q[0], u) + ',' + C(q[1], u); }).join(' ') + '"/>';
        var bump = upto && tr[upto - 1].bump;
        inner += robotSvg(C(cur.x, u) + (bump ? GDX[cur.d] * u * .18 : 0), C(cur.y, u) + (bump ? GDY[cur.d] * u * .18 : 0), u * .62, cur.d, R[2] + (bump ? ' bump' : ''));
      });
      var curA = k && trA[k - 1] ? trA[k - 1].at : '', curB = k && trB[k - 1] ? trB[k - 1].at : '';
      var code = '<div class="mp-gcodes">' + codePanel('A', curA, two ? 'Robot A code' : 'Code') + (two ? codePanel('B', curB, 'Robot B code') : '') + (g7 ? codePanel('my', curA.indexOf('my') === 0 ? curA : '', 'My block') : '') + '</div>';
      return '<div class="mp-grow' + (side ? ' side' : '') + '">' + code + cellGrid(u, inner, 'Robot grid') + '</div>';
    }
    /* moves and turns: a step that changes the square is a move, one that does not is a turn, a bump is neither */
    function stepsOf(tr) { var m = 0, tn = 0, s = starts().A, px = s[0], py = s[1]; tr.forEach(function (e) { if (e.bump) return; if (e.x !== px || e.y !== py) m++; else tn++; px = e.x; py = e.y; }); return [m, tn]; }
    function robotRead() {
      var tr = trace('A'), cnt = count(P.r.A) + (g7 ? count(P.r.my) : 0), s = starts().A, G = goal(), done = k >= tr.length && tr.length, e = done ? tr[tr.length - 1] : null, big = pl(cnt, 'block', 'blocks'), eq = '';
      if (!tr.length || !k) return [big, cnt ? 'Go runs the code.' : ''];
      var bump = tr.filter(function (x) { return x.bump; })[0];
      if (done) {
        var dx = e.x - s[0], dy = s[1] - e.y, sm = stepsOf(tr);
        if (!g3) eq = (g2 && P.r.two ? 'robot A is ' : 'the robot is ') + (dx || dy ? [dx ? '<b>' + Math.abs(dx) + ' ' + (dx > 0 ? 'right' : 'left') + '</b>' : '', dy ? '<b>' + Math.abs(dy) + ' ' + (dy > 0 ? 'up' : 'down') + '</b>' : ''].filter(Boolean).join(' and ') + ' from the start' : 'back at the start');
        else eq = '<b>' + sm[0] + '</b> step' + (sm[0] === 1 ? '' : 's') + ' and <b>' + sm[1] + '</b> turn' + (sm[1] === 1 ? '' : 's');
        if (tr.some(function (x) { return x.x === G[0] && x.y === G[1]; })) eq += '. It reached the goal';
        if (g3 && e.x === s[0] && e.y === s[1] && tr.length > 1) eq += '. It is back at the start';
      } else eq = 'step <b>' + k + '</b> of <b>' + tr.length + '</b>';
      if (bump && (done || k >= tr.indexOf(bump) + 1)) eq += '. It bumped into ' + (blocked(bump.x + GDX[bump.d], bump.y + GDY[bump.d]) && bump.x + GDX[bump.d] >= 0 && bump.x + GDX[bump.d] < COLS && bump.y + GDY[bump.d] >= 0 && bump.y + GDY[bump.d] < ROWS ? 'a wall' : 'the edge') + ' at step <b>' + (tr.indexOf(bump) + 1) + '</b>';
      return [big, eq];
    }
    function addBlock(type) {
      var L = listAt(tgt) || P.r[tgt = 'A'];
      if (count(P.r.A) + count(P.r.B) + count(P.r.my) >= 40) { announce(T, 'The code holds up to 40 blocks.'); return; }
      /* a block that holds blocks can go one level deep in Grade 3 and two levels deep (a repeat inside a repeat) from Grade 4 */
      if ((type === 'REP' || type === 'IF' || type === 'UNTIL') && depth(tgt) >= (g4 ? 2 : 1)) { announce(T, 'That is as deep as blocks go here.'); bump(mat, 'mp-shake'); return; }
      if (type === 'MY' && tgt.indexOf('my') === 0) { announce(T, 'My block cannot use itself.'); return; }
      act(function () {
        var b = { t: type };
        if (type === 'REP') { b.n = g3 && !g4 ? 4 : 2; b.b = []; }
        if (type === 'UNTIL') b.b = [];
        if (type === 'IF') { b.b = []; b.e = []; }
        L.push(b);
        if (b.b) tgt = tgt + '/' + (L.length - 1) + 'b';
        k = 0; last = 'add';
      });
    }
    function delBlock(at) {
      var p = at.split('#'), L = listAt(p[0]);
      if (!L) return;
      act(function () { L.splice(+p[1], 1); if (!listAt(tgt)) tgt = tgt.split('/')[0]; if (tgt.indexOf(at.replace('#', '/')) === 0) tgt = p[0]; k = 0; last = 'remove'; });
    }
    function stop() { if (play) { clearInterval(play); play = null; } }
    function go() {
      stop();
      var tr = trace('A'), trB = g2 && P.r.two ? trace('B') : [], end = Math.max(tr.length, trB.length);
      if (k >= end) k = 0;
      if (T.fast) { k = end; draw(); change(); return; }
      play = setInterval(function () { k++; if (k >= end) stop(); draw(); if (!play) change(); }, 260);
    }

    /* ======== Map ======== */
    function placeAt(x, y) { var at = P.m.at; for (var key in at) if (at[key][0] === x && at[key][1] === y) return key; return ''; }
    function pinfo(key) { return GPLACES.filter(function (q) { return q[0] === key; })[0]; }
    function rel(a, b) {
      var dx = b[0] - a[0], dy = a[1] - b[1], w = [];
      if (dx) w.push(dx > 0 ? 'right of' : 'left of');
      if (dy) w.push(dy > 0 ? 'above' : 'below');
      return w.join(' and ');
    }
    function dirs(a, b) {
      var dx = b[0] - a[0], dy = a[1] - b[1], w = [];
      if (dx) w.push(Math.abs(dx) + ' ' + (dx > 0 ? 'right' : 'left'));
      if (dy) w.push(Math.abs(dy) + ' ' + (dy > 0 ? 'up' : 'down'));
      return w.join(', ') || 'the same place';
    }
    function turns(a, b) {
      var dx = b[0] - a[0], dy = a[1] - b[1];
      if (!dx && !dy) return '';
      if (!dx) return 'face ' + (dy > 0 ? 'up' : 'down') + ', go ' + Math.abs(dy);
      var s = 'face ' + (dx > 0 ? 'right' : 'left') + ', go ' + Math.abs(dx);
      if (dy) s += ', turn ' + ((dx > 0) === (dy > 0) ? 'left' : 'right') + ', go ' + Math.abs(dy);
      return s;
    }
    function drawMap(W, H) {
      var u = Math.max(32, Math.min(70, Math.floor((W - 4) / COLS), Math.floor((H - 110) / ROWS))), inner = '', Mp = P.m;
      if (Mp.from && Mp.to && Mp.at[Mp.from] && Mp.at[Mp.to]) {
        var a = Mp.at[Mp.from], b = Mp.at[Mp.to];
        inner += '<polyline class="mp-gpath d" points="' + [a, [b[0], a[1]], b].map(function (q) { return C(q[0], u) + ',' + C(q[1], u); }).join(' ') + '"/>';
      }
      Object.keys(Mp.at).forEach(function (key) {
        var q = Mp.at[key], p = pinfo(key), on = key === Mp.from || key === Mp.to;
        inner += '<g class="mp-gpl' + (on ? ' on' : '') + '" data-pl="' + key + '"><rect class="mp-gplb" x="' + (1 + q[0] * u + 4) + '" y="' + (1 + q[1] * u + 4) + '" width="' + (u - 8) + '" height="' + (u - 8) + '" rx="10"/>' +
          t(C(q[0], u), C(q[1], u) + u * .16, p[1], 'mp-gplt mp-dc' + p[2], 'middle') + '</g>';
      });
      var key = '<div class="mp-gkey">' + GPLACES.filter(function (q) { return Mp.at[q[0]]; }).map(function (q) { return '<span><b class="mp-dc' + q[2] + '">' + q[1] + '</b>' + q[0] + '</span>'; }).join('') + '</div>';
      var note = !Mp.from ? 'Tap a place to start from.' : !Mp.to ? 'Now tap where to go.' : '';
      return '<div class="mp-gmap">' + cellGrid(u, inner, 'Map') + '</div>' + key + (note ? '<p class="mp-fknote">' + note + '</p>' : '');
    }

    /* ======== coordinate grid (Plot and Move) ======== */
    function range() { return g6 ? [-8, 8] : [0, 10]; }
    function shapes() { return g6 ? GSHAPES4 : GSHAPES; }
    function cgrid(W, H, sc, inner) {
      var r = range(), lo = r[0], hi = r[1], S = Math.max(170, Math.min(W - 10, H - 10, 520)), m = 26, u = (S - m - 8) / (hi - lo);
      var X = function (v) { return m + (v / sc - lo) * u; }, Y = function (v) { return S - m - (v / sc - lo) * u; }, s = svgOpen(S, S, 'mp-gcg', 'Coordinate grid');
      for (var i = lo; i <= hi; i++) {
        var ax = i === 0;
        s += '<line class="' + (ax ? 'mp-gax' : 'mp-gln') + '" x1="' + X(i * sc).toFixed(1) + '" x2="' + X(i * sc).toFixed(1) + '" y1="' + Y(lo * sc).toFixed(1) + '" y2="' + Y(hi * sc).toFixed(1) + '"/>' +
          '<line class="' + (ax ? 'mp-gax' : 'mp-gln') + '" y1="' + Y(i * sc).toFixed(1) + '" y2="' + Y(i * sc).toFixed(1) + '" x1="' + X(lo * sc).toFixed(1) + '" x2="' + X(hi * sc).toFixed(1) + '"/>';
        if (i % 2 === 0 || hi - lo <= 10) {
          if (i !== 0 || !g6) s += t(X(i * sc), (g6 ? Y(0) : Y(lo * sc)) + 16, n(i * sc), 'mp-pgx', 'middle');
          if (i !== 0) s += t((g6 ? X(0) : X(lo * sc)) - 6, Y(i * sc) + 4, n(i * sc), 'mp-pgy');
        }
      }
      return { svg: s + inner(X, Y, u) + '</svg>', X: X, Y: Y, S: S };
    }
    function inRange(q, sc) { var r = range(); return q[0] / sc >= r[0] - 1e-9 && q[0] / sc <= r[1] + 1e-9 && q[1] / sc >= r[0] - 1e-9 && q[1] / sc <= r[1] + 1e-9; }
    function quad(q) { return !q[0] || !q[1] ? 'on an axis' : q[0] > 0 ? (q[1] > 0 ? 'I' : 'IV') : (q[1] > 0 ? 'II' : 'III'); }
    function lab(i) { return String.fromCharCode(65 + i % 26); }
    function drawPlot(W, H) {
      var Pp = P.p, sc = Pp.scale, side = W >= 760, g = cgrid(side ? W - 280 : W, H - (side ? 20 : shown && Pp.pts.length ? 150 : 40), sc, function (X, Y) {
        var s = '';
        if (Pp.join && Pp.pts.length > 1) s += '<polygon class="mp-gpoly" points="' + Pp.pts.map(function (q) { return X(q[0]).toFixed(1) + ',' + Y(q[1]).toFixed(1); }).join(' ') + '"/>';
        Pp.pts.forEach(function (q, i) { s += '<circle class="mp-gpt" cx="' + X(q[0]).toFixed(1) + '" cy="' + Y(q[1]).toFixed(1) + '" r="7"/>' + t(X(q[0]) + 10, Y(q[1]) - 9, lab(i), 'mp-gptl'); });
        s += '<circle class="mp-gcur" cx="' + X(Pp.x).toFixed(1) + '" cy="' + Y(Pp.y).toFixed(1) + '" r="9"/>';
        return s;
      });
      var h = '<div class="mp-grow' + (side ? ' side' : '') + '"><div class="mp-gplot">' + g.svg + '</div>';
      if (shown && Pp.pts.length) h += '<div>' + tbl(['point', '(x, y)'].concat(g6 ? ['quadrant'] : []), Pp.pts.map(function (q, i) { return [lab(i), pt(q)].concat(g6 ? [quad(q)] : []); })) + '</div>';
      return h + '</div>';
    }
    /* ======== Move ======== */
    function lines() { return g6 ? [['x', 0, 'the y-axis'], ['y', 0, 'the x-axis']] : [['x', 5, 'the line x = 5'], ['y', 5, 'the line y = 5']]; }
    function turnsOK() { return g6 ? [90, 180, 270] : [90, 180]; }
    function abouts() { return g7 ? ['corner', 'origin'] : ['corner']; }
    function moves() { return [['slide', 'Slide'], ['flip', 'Flip']].concat(g5 ? [['turn', 'Turn']] : [], g7 ? [['grow', 'Grow']] : []); }
    function transform(Q) {
      var V = P.v, c = V.base[0];
      return Q.map(function (q) {
        var x = q[0], y = q[1];
        if (V.move === 'slide') return [x + V.dx, y + V.dy];
        if (V.move === 'flip') { var L = lines()[V.line]; return L[0] === 'x' ? [2 * L[1] - x, y] : [x, 2 * L[1] - y]; }
        if (V.move === 'turn') {
          var a = abouts()[V.about] === 'origin' ? [0, 0] : c, rx = x - a[0], ry = y - a[1];
          if (V.turn === 90) return [a[0] + ry, a[1] - rx];
          if (V.turn === 180) return [a[0] - rx, a[1] - ry];
          return [a[0] - ry, a[1] + rx];
        }
        return [x * V.k, y * V.k];
      });
    }
    function moveName() {
      var V = P.v;
      if (V.move === 'slide') return [V.dx ? Math.abs(V.dx) + ' ' + (V.dx > 0 ? 'right' : 'left') : '', V.dy ? Math.abs(V.dy) + ' ' + (V.dy > 0 ? 'up' : 'down') : ''].filter(Boolean).join(', ') || 'no slide';
      if (V.move === 'flip') return 'flip over ' + lines()[V.line][2];
      if (V.move === 'turn') return (V.turn === 90 ? '¼ turn clockwise' : V.turn === 180 ? '½ turn' : '¾ turn clockwise') + ' about ' + (abouts()[V.about] === 'origin' ? '(0, 0)' : 'A');
      return 'grow by ' + n(V.k) + ' from (0, 0)';
    }
    function ruleOf() {
      var V = P.v;
      if (V.move === 'slide') return '(x, y) → (x ' + (V.dx < 0 ? '− ' + -V.dx : '+ ' + V.dx) + ', y ' + (V.dy < 0 ? '− ' + -V.dy : '+ ' + V.dy) + ')';
      if (V.move === 'flip' && g6) return lines()[V.line][0] === 'x' ? '(x, y) → (−x, y)' : '(x, y) → (x, −y)';
      if (V.move === 'turn' && abouts()[V.about] === 'origin') return V.turn === 90 ? '(x, y) → (y, −x)' : V.turn === 180 ? '(x, y) → (−x, −y)' : '(x, y) → (−y, x)';
      if (V.move === 'grow') return '(x, y) → (' + n(V.k) + 'x, ' + n(V.k) + 'y)';
      return '';
    }
    function drawMove(W, H) {
      var V = P.v, img = transform(V.base), side = W >= 760, L = V.move === 'flip' ? lines()[V.line] : null, ab = V.move === 'turn' ? (abouts()[V.about] === 'origin' ? [0, 0] : V.base[0]) : null;
      var g = cgrid(side ? W - 300 : W, H - (side ? 20 : shown ? 190 : 100), 1, function (X, Y) {
        var s = '', r = range(), poly = function (Q, cls) { return '<polygon class="' + cls + '" points="' + Q.map(function (q) { return X(q[0]).toFixed(1) + ',' + Y(q[1]).toFixed(1); }).join(' ') + '"/>'; };
        if (L) s += L[0] === 'x' ? '<line class="mp-gmir" x1="' + X(L[1]) + '" x2="' + X(L[1]) + '" y1="' + Y(r[0]) + '" y2="' + Y(r[1]) + '"/>' : '<line class="mp-gmir" y1="' + Y(L[1]) + '" y2="' + Y(L[1]) + '" x1="' + X(r[0]) + '" x2="' + X(r[1]) + '"/>';
        if (V.move === 'slide' || V.move === 'grow') V.base.forEach(function (q, i) { s += '<line class="mp-gtrk" x1="' + X(V.move === 'grow' ? 0 : q[0]).toFixed(1) + '" y1="' + Y(V.move === 'grow' ? 0 : q[1]).toFixed(1) + '" x2="' + X(img[i][0]).toFixed(1) + '" y2="' + Y(img[i][1]).toFixed(1) + '"/>'; });
        s += poly(V.base, 'mp-gorig') + poly(img, 'mp-gimg');
        if (ab) s += '<circle class="mp-gab" cx="' + X(ab[0]) + '" cy="' + Y(ab[1]) + '" r="6"/>';
        V.base.forEach(function (q, i) { s += t(X(q[0]) - 7, Y(q[1]) - 7, lab(i), 'mp-gol', 'end') + t(X(img[i][0]) + 7, Y(img[i][1]) - 7, lab(i) + '′', 'mp-gil'); });
        return s;
      });
      var h = '<div class="mp-grow' + (side ? ' side' : '') + '"><div class="mp-gplot">' + g.svg + '</div>';
      h += '<div class="mp-gside">';
      if (shown) {
        h += tbl(['corner', 'before', 'after'], V.base.map(function (q, i) { return [lab(i), pt(q), pt(img[i])]; }));
        var ch = '';
        if (V.move !== 'grow') ch += chip('same', 'size and shape');
        else ch += chip('same', 'angles') + chip('area', n(V.k * V.k) + ' times', true);
        if (g8 && ruleOf()) ch += chip('rule', ruleOf(), true);
        h += '<div class="mp-prow">' + ch + '</div>';
        if (V.done.length) h += '<p class="mp-fknote">Moves so far: ' + V.done.concat([moveName()]).join(', then ') + '</p>';
      }
      return h + (img.every(function (q) { return inRange(q, 1); }) ? '' : '<p class="mp-fknote mp-gwarn">Part of the new shape is off the grid.</p>') + '</div>';
    }

    /* ======== tray, readout, snaps ======== */
    function trayHtml() {
      if (P.mode === 'robot') {
        var list = g3 ? ['F', 'TL', 'TR', 'TA', 'REP'].concat(g5 ? ['IF', 'UNTIL'] : [], g7 ? ['MY'] : []) : ['U', 'D', 'L', 'R'];
        return '<small>Blocks</small>' + (g2 && P.r.two ? '<div class="mp-fktabs" role="group" aria-label="Code for"><button type="button" data-who="A" aria-pressed="' + (tgt.indexOf('B') !== 0) + '">Robot A</button><button type="button" data-who="B" aria-pressed="' + (tgt.indexOf('B') === 0) + '">Robot B</button></div>' : '') +
          list.map(function (b) { return '<button type="button" class="mp-gb k' + GBLK[b][1] + ' mp-gtb" data-b="' + b + '">' + GBLK[b][0] + '</button>'; }).join('');
      }
      if (P.mode === 'map') return '<small>Put on map</small>' + GPLACES.map(function (q) { return '<button type="button" class="mp-gtp" data-place="' + q[0] + '" aria-pressed="' + (pickPlace === q[0]) + '"><b class="mp-dc' + q[2] + '">' + q[1] + '</b>' + q[0] + '</button>'; }).join('');
      if (P.mode === 'plot') {
        return '<small>Point</small>' + stp('x', 'x', n(P.p.x)) + stp('y', 'y', n(P.p.y)) + '<div class="mp-fkthings"><button type="button" data-do="plot">Plot it</button></div>';
      }
      var V = P.v, h = '<small>Move</small><div class="mp-fkthings">' + moves().map(function (m) { return '<button type="button" data-mv="' + m[0] + '" aria-pressed="' + (V.move === m[0]) + '">' + m[1] + '</button>'; }).join('') + '</div>';
      if (V.move === 'slide') h += stp('dx', 'right', V.dx) + stp('dy', 'up', V.dy);
      if (V.move === 'flip') h += '<small>Over</small><div class="mp-fkthings">' + lines().map(function (L, i) { return '<button type="button" data-line="' + i + '" aria-pressed="' + (V.line === i) + '">' + (L[0] === 'x' ? (g6 ? 'y-axis' : 'x = 5') : (g6 ? 'x-axis' : 'y = 5')) + '</button>'; }).join('') + '</div>';
      if (V.move === 'turn') h += '<small>Turn</small><div class="mp-fkthings">' + turnsOK().map(function (a) { return '<button type="button" data-turn="' + a + '" aria-pressed="' + (V.turn === a) + '">' + (a === 90 ? '¼ turn' : a === 180 ? '½ turn' : '¾ turn') + '</button>'; }).join('') + '</div>' +
        (abouts().length > 1 ? '<small>About</small><div class="mp-fkthings">' + abouts().map(function (a, i) { return '<button type="button" data-about="' + i + '" aria-pressed="' + (V.about === i) + '">' + (a === 'origin' ? '(0, 0)' : 'corner A') + '</button>'; }).join('') + '</div>' : '');
      if (V.move === 'grow') h += '<small>Scale by</small><div class="mp-fkthings">' + [0.5, 2, 3].map(function (q) { return '<button type="button" data-k="' + q + '" aria-pressed="' + (V.k === q) + '">' + (q === 0.5 ? '½' : q) + '</button>'; }).join('') + '</div>';
      return h;
    }
    function readout() {
      if (!shown) { read.innerHTML = ''; return; }
      var big = '', eq = '';
      if (P.mode === 'robot') { var r = robotRead(); big = r[0]; eq = r[1]; }
      else if (P.mode === 'map') {
        var Mp = P.m;
        if (Mp.from && Mp.to && Mp.at[Mp.from] && Mp.at[Mp.to]) {
          var a = Mp.at[Mp.from], b = Mp.at[Mp.to];
          big = dirs(a, b);
          eq = 'from the <b>' + Mp.from + '</b> to the <b>' + Mp.to + '</b>: ' + pl(Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]), 'step', 'steps');
          if (!g2) eq += '. The ' + Mp.to + (Mp.to === 'swings' ? ' are' : ' is') + ' <b>' + rel(a, b) + '</b> the ' + Mp.from;
          if (g3) eq += '. <b>' + turns(a, b) + '</b>';
        }
      } else if (P.mode === 'plot') {
        var Q = P.p.pts, j = Q.length - 1;
        if (j >= 0) {
          big = lab(j) + ' ' + pt(Q[j]);
          if (j > 0) eq = 'from ' + lab(j - 1) + ' to ' + lab(j) + ': <b>' + dirs([Q[j - 1][0], -Q[j - 1][1]], [Q[j][0], -Q[j][1]]) + '</b>';
          if (g6 && quad(Q[j]) !== 'on an axis') eq += (eq ? '. ' : '') + lab(j) + ' is in quadrant <b>' + quad(Q[j]) + '</b>';
          else if (g6) eq += (eq ? '. ' : '') + lab(j) + ' is on an axis';
        }
      } else {
        var V = P.v, img = transform(V.base);
        big = moveName();
        eq = 'A ' + pt(V.base[0]) + ' goes to A′ ' + pt(img[0]);
        if (V.move === 'grow') eq += '. Every side is <b>' + n(V.k) + ' times</b> as long';
      }
      read.innerHTML = (big ? '<p class="mp-total"><span class="mp-num">' + big + '</span></p>' : '') + (eq ? '<p class="mp-ceq">' + eq + '</p>' : '');
    }
    function snaps() {
      var h = '';
      if (P.mode === 'robot') {
        var trA = trace('A'), end = Math.max(trA.length, g2 && P.r.two ? trace('B').length : 0);
        h += btn('go', play ? 'Pause' : 'Go', null, !end) + btn('step', 'Step', null, !end || k >= end) + btn('restart', 'Start again', null, !k);
        if (g2) h += btn('two', 'Two robots', P.r.two);
        h += btn('pen', 'Pen', P.r.pen) + (g5 ? btn('maze', P.r.maze < 0 ? 'Maze' : P.r.maze < GMAZES.length - 1 ? 'Next maze' : 'No maze') : btn('goal', 'New goal'));
        h += btn('cclear', 'Clear code', null, !count(P.r.A) && !count(P.r.B) && !count(P.r.my));
      } else if (P.mode === 'map') {
        h += btn('mclear', 'Clear map', null, !Object.keys(P.m.at).length) + btn('sample', 'Sample map');
      } else if (P.mode === 'plot') {
        h += btn('join', 'Join them', P.p.join, P.p.pts.length < 2) + (g5 && !g6 ? btn('scale', '1 square = ' + P.p.scale) : '') + btn('pback', 'Take one off', null, !P.p.pts.length) + btn('pclear', 'Clear', null, !P.p.pts.length);
      } else {
        h += btn('shape', 'New shape') + (g6 ? btn('keep', 'Then another move') : '') + btn('vreset', 'Start again', null, !P.v.done.length);
      }
      snapsEl.innerHTML = h;
    }
    function draw() {
      tray.innerHTML = trayHtml();
      readout();
      snaps();
      qsa('.mp-gdo [data-m]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === P.mode)); });
      var sz = size(), W = Math.max(260, sz[0]), H = Math.max(300, sz[1] - 70);
      var paint = function (h) { win.innerHTML = P.mode === 'robot' ? drawRobot(W, h) : P.mode === 'map' ? drawMap(W, h) : P.mode === 'plot' ? drawPlot(W, h) : drawMove(W, h); };
      paint(H);
      /* when the tables and buttons need more room than planned (a phone), draw the grid smaller so nothing scrolls */
      var over = mat.scrollHeight - mat.clientHeight;
      if (over > 0) paint(H - over - 4);
    }

    /* ---- moves ---- */
    function snapshot() { return JSON.stringify(P); }
    function act(fn) { stop(); var b = snapshot(); fn(); if (snapshot() !== b) { hist.push(b); if (hist.length > 60) hist.shift(); } draw(); change(); }
    function change() { if (o.onChange) o.onChange(state(), T); }
    function state() {
      var tr = trace('A'), e = tr.length ? tr[Math.min(k, tr.length) - 1] : null;
      return { mode: P.mode, blocks: count(P.r.A), steps: tr.length, at: e ? [e.x, e.y] : null, points: P.p.pts.map(function (q) { return q.slice(); }), image: transform(P.v.base), last: last };
    }
    function cgridPoint(e) {
      var svg = qs('.mp-gcg', win); if (!svg) return null;
      var b = svg.getBoundingClientRect(), S = svg.viewBox.baseVal.width, px = (e.clientX - b.left) * S / b.width, py = (e.clientY - b.top) * S / b.height, r = range(), m = 26, u = (S - m - 8) / (r[1] - r[0]);
      var gx = Math.round((px - m) / u + r[0]), gy = Math.round((S - m - py) / u + r[0]);
      if (gx < r[0] || gx > r[1] || gy < r[0] || gy > r[1]) return null;
      return [gx * P.p.scale, gy * P.p.scale];
    }
    function cellAt(e) {
      var svg = qs('.mp-gsv', win); if (!svg) return null;
      var b = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, x = (e.clientX - b.left) * vb.width / b.width, y = (e.clientY - b.top) * vb.height / b.height, u = (vb.width - 2) / COLS;
      var cx = Math.floor((x - 1) / u), cy = Math.floor((y - 1) / u);
      return cx >= 0 && cy >= 0 && cx < COLS && cy < ROWS ? [cx, cy] : null;
    }
    tray.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-b')) return addBlock(b.getAttribute('data-b'));
      if (b.hasAttribute('data-who')) { tgt = b.getAttribute('data-who'); draw(); return; }
      if (b.hasAttribute('data-place')) { var pk = b.getAttribute('data-place'); pickPlace = pickPlace === pk ? '' : pk; draw(); return; }
      if (b.classList.contains('mp-pstb')) {
        var id = b.getAttribute('data-st'), d = +b.getAttribute('data-d'), r = range();
        return act(function () {
          if (id === 'x' || id === 'y') P.p[id] = clamp(P.p[id] + d * P.p.scale, r[0] * P.p.scale, r[1] * P.p.scale);
          if (id === 'dx' || id === 'dy') P.v[id] = clamp(P.v[id] + d, -10, 10);
          last = 'nudge';
        });
      }
      var V = P.v;
      if (b.hasAttribute('data-mv')) return act(function () { V.move = b.getAttribute('data-mv'); last = 'move'; });
      if (b.hasAttribute('data-line')) return act(function () { V.line = +b.getAttribute('data-line'); last = 'line'; });
      if (b.hasAttribute('data-turn')) return act(function () { V.turn = +b.getAttribute('data-turn'); last = 'turn'; });
      if (b.hasAttribute('data-about')) return act(function () { V.about = +b.getAttribute('data-about'); last = 'about'; });
      if (b.hasAttribute('data-k')) return act(function () { V.k = +b.getAttribute('data-k'); last = 'scale'; });
      if (b.getAttribute('data-do') === 'plot') act(function () { if (P.p.pts.length < 26) P.p.pts.push([P.p.x, P.p.y]); last = 'plot'; });
    });
    qs('.mp-gdo', root).addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b) act(function () { P.mode = b.getAttribute('data-m'); last = 'mode'; }); });
    mat.addEventListener('click', function (e) {
      var s = e.target.closest('.mp-snap'), del = e.target.closest('[data-del]'), rn = e.target.closest('[data-rn]'), tg = e.target.closest('[data-tgt]'), pl0 = e.target.closest('[data-pl]');
      if (del) return delBlock(del.getAttribute('data-del'));
      if (rn) { var p = rn.getAttribute('data-rn').split('#'), blk = listAt(p[0])[+p[1]], d = +rn.getAttribute('data-d'); return act(function () { blk.n = clamp(blk.n + d, 2, 12); k = 0; last = 'repeat'; }); }
      if (s) {
        var a = s.getAttribute('data-a');
        if (a === 'go') { if (play) { stop(); draw(); } else go(); return; }
        if (a === 'step') { stop(); k++; draw(); change(); return; }
        if (a === 'restart') { stop(); k = 0; draw(); change(); return; }
        act(function () {
          var R = P.r;
          if (a === 'two') { R.two = !R.two; tgt = 'A'; k = 0; }
          if (a === 'pen') R.pen = !R.pen;
          if (a === 'maze') { R.maze = R.maze >= GMAZES.length - 1 ? -1 : R.maze + 1; k = 0; }
          if (a === 'goal') { var gx, gy; do { gx = Math.floor(Math.random() * COLS); gy = Math.floor(Math.random() * ROWS); } while ((gx === 1 && gy === 4) || (gx === R.goal[0] && gy === R.goal[1])); R.goal = [gx, gy]; k = 0; }
          if (a === 'cclear') { R.A = []; R.B = []; R.my = []; tgt = 'A'; k = 0; }
          if (a === 'mclear') { P.m.at = {}; P.m.from = P.m.to = ''; }
          if (a === 'sample') { P.m.at = { school: [1, 4], pond: [3, 1], swings: [6, 2], tree: [5, 5], bench: [2, 2] }; P.m.from = P.m.to = ''; }
          if (a === 'join') P.p.join = !P.p.join;
          if (a === 'scale') { var ss = [1, 2, 5, 10], ns = ss[(ss.indexOf(P.p.scale) + 1) % ss.length]; P.p.pts = P.p.pts.map(function (q) { return [q[0] / P.p.scale * ns, q[1] / P.p.scale * ns]; }); P.p.x = P.p.x / P.p.scale * ns; P.p.y = P.p.y / P.p.scale * ns; P.p.scale = ns; }
          if (a === 'pback') P.p.pts.pop();
          if (a === 'pclear') P.p.pts = [];
          if (a === 'shape') { P.v.shape = (P.v.shape + 1) % GSHAPES.length; P.v.base = shapes()[P.v.shape].map(function (q) { return q.slice(); }); P.v.done = []; }
          if (a === 'keep') { P.v.done.push(moveName()); P.v.base = transform(P.v.base); }
          if (a === 'vreset') { P.v.base = shapes()[P.v.shape].map(function (q) { return q.slice(); }); P.v.done = []; }
          last = a;
        });
        return;
      }
      if (tg && P.mode === 'robot') { tgt = tg.getAttribute('data-tgt'); draw(); return; }
      if (P.mode === 'map') {
        var Mp = P.m;
        if (pickPlace) { var c = cellAt(e); if (c && !placeAt(c[0], c[1])) { var pk = pickPlace; pickPlace = ''; act(function () { Mp.at[pk] = c; if (Mp.from === pk || Mp.to === pk) Mp.from = Mp.to = ''; last = 'place'; }); } return; }
        if (pl0) { var key = pl0.getAttribute('data-pl'); act(function () { if (!Mp.from || Mp.to) { Mp.from = key; Mp.to = ''; } else if (key !== Mp.from) Mp.to = key; last = 'pick'; }); }
        return;
      }
      if (P.mode === 'plot') { var q = cgridPoint(e); if (q) act(function () { P.p.x = q[0]; P.p.y = q[1]; if (P.p.pts.length < 26) P.p.pts.push(q); last = 'plot'; }); }
    });
    T.undo = function () { if (!hist.length) return; stop(); P = JSON.parse(hist.pop()); if (!listAt(tgt)) tgt = 'A'; k = 0; last = 'undo'; draw(); change(); };
    T.canUndo = function () { return hist.length > 0; };
    T.showNumbers = function (on) { shown = !!on; draw(); change(); };
    T.state = state;
    T.reset = function () { stop(); fresh(); hist = []; draw(); };
    var lw = 0;
    if (window.ResizeObserver) new ResizeObserver(function () { var w = mat.clientWidth; if (w && w !== lw) { lw = w; draw(); } }).observe(mat); else window.addEventListener('resize', draw);
    T.reset();
    return T;
  }
  M.grid = function (root, o) { return toolGrid(root, o || {}); };

  /* ================= 3D solids and nets (Toolbox) =================
     Make: Solids (every grade: turn a solid by dragging; Show number gives its faces, edges and vertices, or in Grades 1 and 2 whether
     it rolls, slides and stacks), Build (every grade: tap to stack cubes; top, front and side views from Grade 5, and a views puzzle from
     Grade 6), Nets (Grade 6 and up: fold and unfold a net, with the area of each face and the surface area; a cylinder from Grade 7) and
     Volume (Grade 7 and up: fill a prism or cylinder layer by layer, volume = base area × height). Solids with flat faces are drawn by
     folding their nets, so a net and its solid are the same faces. */
  var S3_ALL = {
    cube: ['cube', 6, 12, 8, '6 squares'], box: ['rectangular prism', 6, 12, 8, '6 rectangles'], tprism: ['triangular prism', 5, 9, 6, '2 triangles and 3 rectangles'],
    pprism: ['pentagonal prism', 7, 15, 10, '2 pentagons and 5 rectangles'], hprism: ['hexagonal prism', 8, 18, 12, '2 hexagons and 6 rectangles'],
    spyr: ['square pyramid', 5, 8, 5, '1 square and 4 triangles'], tpyr: ['triangular pyramid', 4, 6, 4, '4 triangles'], hpyr: ['hexagonal pyramid', 7, 12, 7, '1 hexagon and 6 triangles'],
    cyl: ['cylinder', 2, 2, 0, '2 circles and a curved surface'], cone: ['cone', 1, 1, 1, '1 circle and a curved surface'], sph: ['sphere', 0, 0, 0, 'one curved surface']
  };
  /* Grades 1 and 2: rolls, slides, stacks */
  var S3_DO = { cube: 'slide and stack', box: 'slide and stack', tprism: 'slide and stack', pprism: 'slide and stack', hprism: 'slide and stack', spyr: 'slide', tpyr: 'slide', hpyr: 'slide',
    cyl: 'roll, slide and stack', cone: 'roll and slide', sph: 'roll' };
  /* views puzzles (Grade 6 and up): column heights on the 5 by 5 base, row by row from the back */
  var S3_PUZ = [
    [[0, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 2, 1, 0, 0], [0, 3, 2, 1, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0], [0, 2, 2, 0, 0], [0, 1, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 1, 3, 1, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0]]
  ];
  function toolSolid(root, o) {
    var T = base(root, 'sol');
    root.classList.add('mp-tool', 'mp-fkt', 'mp-patt', 'mp-datt', 'mp-s3t');
    var gr = window.Atlas && +Atlas.grade || 0, g3 = !gr || gr >= 3, g5 = !gr || gr >= 5, g6 = !gr || gr >= 6, g7 = !gr || gr >= 7;
    var MODES = [['solids', 'Solids'], ['build', 'Build']].concat(g6 ? [['nets', 'Nets']] : [], g7 ? [['vol', 'Volume']] : []);
    var SOLIDS = g3 ? ['cube', 'box', 'tprism', 'pprism', 'hprism', 'spyr', 'tpyr', 'hpyr', 'cyl', 'cone', 'sph'] : ['cube', 'box', 'tprism', 'spyr', 'cyl', 'cone', 'sph'];
    var NETS = ['cube', 'box', 'tprism', 'spyr', 'tpyr'].concat(g7 ? ['cyl'] : []), VOLS = ['box', 'tprism', 'cyl'];
    var N = 5;
    root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray mp-fktray mp-ptray mp-gtr mp-s3tr"></div><div class="mp-dmain"><div class="mp-cmode mp-s3do" role="group" aria-label="Make"><span>Make</span>' +
      MODES.map(function (m) { return '<button type="button" data-m="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>' +
      '<div class="mp-read" aria-live="polite"></div><div class="mp-mat mp-fkmat mp-pmat"><div class="mp-pwin"></div><div class="mp-snaps"></div></div><p class="mp-live sr" aria-live="polite"></p></div></div>';
    var tray = qs('.mp-s3tr', root), mat = qs('.mp-pmat', root), win = qs('.mp-pwin', mat), read = qs('.mp-read', root), snapsEl = qs('.mp-snaps', mat);
    /* state: the move; Solids: the solid; Build: the height of each column, take-off mode, the puzzle; Nets: the solid and its sizes;
       Volume: the solid, its sizes and how many layers are filled. How it is turned and folded is not part of Undo. */
    var P, shown = false, hist = [], last = '', yaw = -32, pitch = 24, fold = 0, anim = null;
    function fresh() {
      P = { mode: 'solids', pick: 'cube',
        b: { h: blank(), take: false, puz: -1 },
        n: { shape: 'box', l: 4, w: 3, h: 2, s: 4, sl: 5, L: 5, r: 2 },
        v: { shape: 'box', l: 4, w: 3, h: 3, L: 4, r: 2, fill: 0 } };
      fold = 0;
    }
    function blank() { var a = []; for (var i = 0; i < N; i++) { a.push([]); for (var j = 0; j < N; j++) a[i].push(0); } return a; }
    function size() { var cs = getComputedStyle(mat); return [(mat.clientWidth || 700) - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), (mat.clientHeight || 500) - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)]; }
    function btn(a, t, on, dis, extra) { return '<button type="button" class="mp-snap" data-a="' + a + '"' + (extra || '') + (on != null ? ' aria-pressed="' + on + '"' : '') + (dis ? ' disabled' : '') + '>' + t + '</button>'; }
    function n1(v) { v = Math.round(v * 10) / 10; return fmt(v); }
    function stp(id, lab, val) {
      return '<div class="mp-dans mp-dbig"><small>' + lab + '</small><div class="mp-pstr"><button type="button" class="mp-pstb" data-st="' + id + '" data-d="-1" aria-label="' + lab + ': less">&minus;</button>' +
        '<b>' + val + '</b><button type="button" class="mp-pstb" data-st="' + id + '" data-d="1" aria-label="' + lab + ': more">+</button></div></div>';
    }

    /* ======== nets that fold: each face is a flat polygon, the face it hangs from, the shared edge and how far it turns ======== */
    function shoelace(q) { var a = 0; for (var i = 0; i < q.length; i++) { var p = q[i], r = q[(i + 1) % q.length]; a += p[0] * r[1] - r[0] * p[1]; } return Math.abs(a) / 2; }
    function ngon(a, b, n, ext) {
      /* a regular polygon with its first side from a to b, on the left of a to b */
      var pts = [a, b], dx = b[0] - a[0], dy = b[1] - a[1], ang = Math.atan2(dy, dx), s = Math.hypot(dx, dy), p = b;
      for (var i = 2; i < n; i++) { ang += ext || 2 * Math.PI / n; p = [p[0] + s * Math.cos(ang), p[1] + s * Math.sin(ang)]; pts.push(p); }
      return pts;
    }
    function face(poly, par, h1, h2, deg, kind) { return { p: poly, par: par, a: h1, b: h2, deg: deg, k: kind || 'f' }; }
    /* a prism from a row of side rectangles (widths and the turn between them) and two caps on the first rectangle's ends */
    function prismNet(sides, L, cap, curved) {
      var F = [];
      F.push(face([[0, 0], [sides[0][0], 0], [sides[0][0], L], [0, L]], -1, null, null, 0, curved ? 'c' : 'f'));
      var par = 0, x = sides[0][0];
      for (var i = 1; i < sides.length; i++) {
        var w = sides[i][0];
        F.push(face([[x, 0], [x + w, 0], [x + w, L], [x, L]], par, [x, 0], [x, L], sides[i][1], curved ? 'c' : 'f'));
        par = F.length - 1; x += w;
      }
      var w0 = sides[0][0];
      F.push(face(cap([0, L], [w0, L]), 0, [0, L], [w0, L], 90, 'b'));
      F.push(face(cap([w0, 0], [0, 0]), 0, [w0, 0], [0, 0], 90, 'b'));
      return F;
    }
    function regPrism(n, s, L, curved) {
      /* the caps hang from the middle strip; strips run out to both sides of it and roll up to close */
      var F = prismNet([[s, 0]], L, function (a, b) { return ngon(a, b, n); }, curved), ext = 360 / n, right = Math.floor((n - 1) / 2);
      var par = 0;
      for (var i = 1; i <= right; i++) { F.push(face([[i * s, 0], [(i + 1) * s, 0], [(i + 1) * s, L], [i * s, L]], par, [i * s, 0], [i * s, L], ext, curved ? 'c' : 'f')); par = F.length - 1; }
      par = 0;
      for (var j = 1; j < n - right; j++) { F.push(face([[-j * s, 0], [(1 - j) * s, 0], [(1 - j) * s, L], [-j * s, L]], par, [(1 - j) * s, 0], [(1 - j) * s, L], ext, curved ? 'c' : 'f')); par = F.length - 1; }
      return F;
    }
    /* stand a prism or cylinder on its end: its length becomes its height */
    function upright(F) { F.forEach(function (f) { f.v = f.v.map(function (p) { return [p[0], p[2], p[1]]; }); }); return F; }
    function pyrNet(n, s, slant, curved) {
      /* base polygon, and a triangle on each side whose tip is slant away from the middle of that side */
      var basep = ngon([0, 0], [s, 0], n), F = [face(basep.slice().reverse(), -1, null, null, 0, 'b')];
      var r = s / (2 * Math.tan(Math.PI / n)), dih = Math.atan2(Math.sqrt(Math.max(0.01, slant * slant - r * r)), r) * 180 / Math.PI;
      for (var i = 0; i < n; i++) {
        var a = basep[i], b = basep[(i + 1) % n], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
        /* outward is to the right of a to b (the base goes anticlockwise) */
        var tip = [mx + dy / l * slant, my - dx / l * slant];
        F.push(face([a, tip, b], 0, a, b, 180 - dih, curved ? 'c' : 'f'));
      }
      return F;
    }
    function boxNet(l, w, h) {
      return [
        face([[0, 0], [l, 0], [l, w], [0, w]], -1, null, null, 0),
        face([[0, 0], [0, -h], [l, -h], [l, 0]], 0, [0, 0], [l, 0], 90),
        face([[0, w], [l, w], [l, w + h], [0, w + h]], 0, [0, w], [l, w], 90),
        face([[0, w + h], [l, w + h], [l, 2 * w + h], [0, 2 * w + h]], 2, [0, w + h], [l, w + h], 90),
        face([[0, 0], [0, w], [-h, w], [-h, 0]], 0, [0, 0], [0, w], 90),
        face([[l, 0], [l + h, 0], [l + h, w], [l, w]], 0, [l, 0], [l, w], 90)
      ];
    }
    /* the triangular prism has a 3-4-5 right triangle at each end, so every area is a whole number */
    function triNet(L) {
      return prismNet([[4, 0], [3, 90], [5, 180 - Math.atan2(4, 3) * 180 / Math.PI]], L, function (a, b) {
        return a[1] > 0 ? [a, b, [b[0], b[1] + 3]] : [a, b, [a[0], a[1] - 3]];
      });
    }
    function netFor(shape, D) {
      if (shape === 'cube') return boxNet(D.s || 3, D.s || 3, D.s || 3);
      if (shape === 'box') return boxNet(D.l, D.w, D.h);
      if (shape === 'tprism') return triNet(D.L);
      if (shape === 'pprism') return regPrism(5, 2, 3.4);
      if (shape === 'hprism') return regPrism(6, 1.8, 3.6);
      if (shape === 'spyr') return pyrNet(4, D.s, D.sl);
      if (shape === 'tpyr') return pyrNet(3, D.s, D.s * Math.sqrt(3) / 2);
      if (shape === 'hpyr') return pyrNet(6, 1.8, 4);
      if (shape === 'cyl') return regPrism(36, 2 * Math.PI * D.r / 36, D.h || D.L, true);
      return null;
    }
    /* place every face in 3D for a fold from 0 (flat) to 1 (closed) */
    function folded(F, t) {
      var M3 = [];
      function rot(a, b, deg, centroid) {
        var ux = b[0] - a[0], uy = b[1] - a[1], l = Math.hypot(ux, uy); ux /= l; uy /= l;
        /* turn so the face lifts up (+z): the axis is (from the edge to the face) × up */
        var dx = centroid[0] - a[0], dy = centroid[1] - a[1], cr = ux * dy - uy * dx;
        if (cr < 0) { ux = -ux; uy = -uy; }
        var th = deg * Math.PI / 180, c = Math.cos(th), s = Math.sin(th), k = [ux, uy, 0];
        return function (p) {
          var v = [p[0] - a[0], p[1] - a[1], p[2]], d = k[0] * v[0] + k[1] * v[1], cx = k[1] * v[2] - 0, cy = -k[0] * v[2], cz = k[0] * v[1] - k[1] * v[0];
          return [a[0] + v[0] * c + cx * s + k[0] * d * (1 - c), a[1] + v[1] * c + cy * s + k[1] * d * (1 - c), v[2] * c + cz * s];
        };
      }
      F.forEach(function (f, i) {
        if (f.par < 0) { M3[i] = function (p) { return p; }; return; }
        var cen = f.p.reduce(function (s, q) { return [s[0] + q[0] / f.p.length, s[1] + q[1] / f.p.length]; }, [0, 0]);
        var r = rot(f.a, f.b, f.deg * t, cen), up = M3[f.par];
        M3[i] = function (p) { return up(r(p)); };
      });
      return F.map(function (f, i) { return { v: f.p.map(function (q) { return M3[i]([q[0], q[1], 0]); }), k: f.k, area: shoelace(f.p), i: i }; });
    }
    function coneMesh(r, h) {
      var out = [], n = 36, base = [];
      for (var i = 0; i < n; i++) { var a = 2 * Math.PI * i / n; base.push([r * Math.cos(a), r * Math.sin(a), 0]); }
      out.push({ v: base.slice().reverse(), k: 'b' });
      for (var j = 0; j < n; j++) out.push({ v: [base[j], base[(j + 1) % n], [0, 0, h]], k: 'c' });
      return out;
    }
    function sphereMesh(r) {
      var out = [], la = 12, lo = 24;
      function p(i, j) { var th = Math.PI * i / la, ph = 2 * Math.PI * j / lo; return [r * Math.sin(th) * Math.cos(ph), r * Math.sin(th) * Math.sin(ph), r + r * Math.cos(th)]; }
      for (var i = 0; i < la; i++) for (var j = 0; j < lo; j++) out.push({ v: [p(i, j), p(i + 1, j), p(i + 1, j + 1), p(i, j + 1)], k: 'c' });
      return out;
    }
    function cubesMesh(H) {
      /* only the faces of a cube that are not against another cube; the base squares carry their column too */
      var out = [];
      function at(i, j, z) { return i >= 0 && j >= 0 && i < N && j < N && z >= 0 && z < H[j][i]; }
      for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
        var x = i, y = N - 1 - j, c = i + ',' + j;
        out.push({ v: [[x, y, 0], [x + 1, y, 0], [x + 1, y + 1, 0], [x, y + 1, 0]], k: 'g', c: c, flat: true });
        for (var z = 0; z < H[j][i]; z++) {
          var top = z === H[j][i] - 1, f = function (q) { out.push({ v: q, k: 'u', c: c }); };
          if (top) f([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]]);
          if (!at(i, j + 1, z)) f([[x, y, z], [x + 1, y, z], [x + 1, y, z + 1], [x, y, z + 1]]);
          if (!at(i, j - 1, z)) f([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]]);
          if (!at(i - 1, j, z)) f([[x, y, z], [x, y + 1, z], [x, y + 1, z + 1], [x, y, z + 1]]);
          if (!at(i + 1, j, z)) f([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]]);
        }
      }
      return out;
    }
    /* draw faces turned by yaw and pitch, far faces first, lit from the upper left */
    function render(faces, W, H, opt) {
      opt = opt || {};
      var cy = Math.cos(yaw * Math.PI / 180), sy = Math.sin(yaw * Math.PI / 180), cp = Math.cos(pitch * Math.PI / 180), sp = Math.sin(pitch * Math.PI / 180);
      var lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
      faces.forEach(function (f) { f.v.forEach(function (p) { for (var d = 0; d < 3; d++) { lo[d] = Math.min(lo[d], p[d]); hi[d] = Math.max(hi[d], p[d]); } }); });
      var c = opt.center || [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
      function view(p) {
        var x = p[0] - c[0], y = p[1] - c[1], z = p[2] - c[2], x1 = x * cy - y * sy, y1 = x * sy + y * cy;
        return [x1, -(y1 * sp + z * cp), -y1 * cp + z * sp];
      }
      var pf = faces.map(function (f) {
        var q = f.v.map(view), d = q.reduce(function (s, p) { return s + p[2]; }, 0) / q.length;
        var a = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], b = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]];
        var nx = a[1] * b[2] - a[2] * b[1], ny = a[2] * b[0] - a[0] * b[2], nz = a[0] * b[1] - a[1] * b[0], nl = Math.hypot(nx, ny, nz) || 1;
        nx /= nl; ny /= nl; nz /= nl;
        if (nz < 0) { nx = -nx; ny = -ny; nz = -nz; }
        var lit = 0.6 + 0.4 * Math.max(0, -0.45 * nx - 0.55 * ny + 0.7 * nz);
        return { q: q, d: d + (f.flat ? -1e3 : 0), lit: lit, f: f };
      });
      pf.sort(function (a, b) { return a.d - b.d; });
      var R = 0;
      pf.forEach(function (p) { p.q.forEach(function (v) { R = Math.max(R, Math.abs(v[0]), Math.abs(v[1])); }); });
      var k = opt.k || Math.min((W - 30) / (2 * R || 1), (H - 30) / (2 * R || 1), opt.kMax || 60);
      var s = '<svg class="mp-dsvg mp-s3sv" width="' + W + '" height="' + H + '" viewBox="' + (-W / 2) + ' ' + (-H / 2) + ' ' + W + ' ' + H + '" role="img" aria-label="' + (opt.lab || 'Solid') + '">';
      pf.forEach(function (p) {
        var pts = p.q.map(function (v) { return (v[0] * k).toFixed(1) + ',' + (v[1] * k).toFixed(1); }).join(' '), cls = 'mp-s3f k' + p.f.k + (p.f.cls ? ' ' + p.f.cls : '');
        var mix = Math.round(p.lit * 100);
        s += '<polygon class="' + cls + '" points="' + pts + '"' + (p.f.c ? ' data-c="' + p.f.c + '"' : '') + ' style="--lit:' + mix + '%"/>';
      });
      if (opt.labels) pf.forEach(function (p) {
        if (p.f.lab == null || p.f.flat) return;
        var m = p.q.reduce(function (s2, v) { return [s2[0] + v[0] / p.q.length, s2[1] + v[1] / p.q.length]; }, [0, 0]);
        s += '<text class="mp-s3lab" x="' + (m[0] * k).toFixed(1) + '" y="' + (m[1] * k + 4).toFixed(1) + '" text-anchor="middle">' + p.f.lab + '</text>';
      });
      return s + '</svg>';
    }

    /* ======== the four parts ======== */
    function solidFaces(id) {
      if (id === 'cone') return coneMesh(1.6, 3.4);
      if (id === 'sph') return sphereMesh(1.8);
      if (id === 'tprism') return upright(folded(regPrism(3, 2.6, 3.2), 1));
      var F = folded(netFor(id, id === 'cube' ? { s: 3 } : id === 'box' ? { l: 4, w: 2.4, h: 2 } : id === 'spyr' ? { s: 3, sl: 3.3 } : id === 'tpyr' ? { s: 3.4 } : id === 'cyl' ? { r: 1.4, h: 3.2 } : {}), 1);
      return id === 'cyl' || id === 'pprism' || id === 'hprism' ? upright(F) : F;
    }
    function drawSolids(W, H) {
      return '<div class="mp-s3w">' + render(solidFaces(P.pick), W, H, { lab: S3_ALL[P.pick][0], kMax: 70 }) + '</div>';
    }
    function views(Hh) {
      /* top: which squares are covered; front: tallest cube in each column across; side (from the right): tallest in each row */
      var top = [], front = [], side = [];
      for (var i = 0; i < N; i++) { front.push(0); side.push(0); }
      for (var j = 0; j < N; j++) for (var i2 = 0; i2 < N; i2++) { front[i2] = Math.max(front[i2], Hh[j][i2]); side[N - 1 - j] = Math.max(side[N - 1 - j], Hh[j][i2]); }
      for (var j2 = 0; j2 < N; j2++) top.push(Hh[j2].map(function (v) { return v > 0 ? 1 : 0; }));
      return { top: top, front: front, side: side };
    }
    function viewSvg(kind, V, u, lab) {
      var rows = kind === 'top' ? V.top : (function () { var m = 0, a = V[kind], g = []; a.forEach(function (v) { m = Math.max(m, v); }); m = Math.max(m, 3); for (var z = m - 1; z >= 0; z--) g.push(a.map(function (v) { return v > z ? 1 : 0; })); return g; })();
      var W = N * u + 2, H = rows.length * u + 2, s = '<svg class="mp-dsvg mp-s3vw" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + lab + '">';
      rows.forEach(function (r, y) { r.forEach(function (v, x) { s += '<rect class="mp-s3vc' + (v ? ' on' : '') + '" x="' + (1 + x * u) + '" y="' + (1 + y * u) + '" width="' + u + '" height="' + u + '"/>'; }); });
      return s + '</svg>';
    }
    function sameView(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
    function drawBuild(W, H) {
      var B = P.b, V = views(B.h), side = W >= 700, showV = g5, u = side ? (B.puz >= 0 ? 15 : 20) : B.puz >= 0 ? 9 : 12;
      var pv = showV ? '<div class="mp-s3vs">' + [['top', 'Top'], ['front', 'Front'], ['side', 'Side']].map(function (k) {
        var tgt = B.puz >= 0 ? views(S3_PUZ[B.puz]) : null;
        return '<figure class="mp-s3v' + (tgt && sameView(tgt[k[0]], V[k[0]]) ? ' ok' : '') + '"><figcaption>' + k[1] + '</figcaption>' +
          (tgt ? '<div class="mp-s3vp">' + viewSvg(k[0], tgt, u, k[1] + ' view to build') + '<span>yours</span>' + viewSvg(k[0], V, u, 'Your ' + k[1].toLowerCase() + ' view') + '</div>' : viewSvg(k[0], V, u, k[1] + ' view')) + '</figure>';
      }).join('') + '</div>' : '';
      var gw = side && showV ? W - (B.puz >= 0 ? 330 : 200) : W, gh = side || !showV ? H : H - (B.puz >= 0 ? 150 : 110);
      return '<div class="mp-grow' + (side ? ' side' : '') + '"><div class="mp-s3w mp-s3build">' + render(cubesMesh(B.h), gw, Math.max(180, gh), { lab: 'Cubes', center: [N / 2, N / 2, 1.2], kMax: 60 }) + '</div>' + pv + '</div>';
    }
    function dims(shape, D) {
      if (shape === 'cube') return { s: D.l };
      return D;
    }
    function netFaces(Dn) {
      var F = netFor(Dn.shape, dims(Dn.shape, Dn)), out = folded(F, fold);
      if (shown) out.forEach(function (f, i) {
        if (Dn.shape === 'cyl') f.lab = F[i].k === 'b' ? 'π × ' + Dn.r + '²' : (i === 0 ? '2π × ' + Dn.r + ' × ' + Dn.h : null);
        else f.lab = n1(f.area);
      });
      return out;
    }
    function saOf(Dn) {
      if (Dn.shape === 'cyl') { var b = Math.PI * Dn.r * Dn.r, sidep = 2 * Math.PI * Dn.r * Dn.h; return { total: 2 * b + sidep, eq: '2 × π × ' + Dn.r + '² + 2 × π × ' + Dn.r + ' × ' + Dn.h + ' ≈ ' + n1(2 * b) + ' + ' + n1(sidep) }; }
      var F = netFor(Dn.shape, dims(Dn.shape, Dn)), ar = F.map(function (f) { return shoelace(f.p); }), tot = ar.reduce(function (s, a) { return s + a; }, 0);
      /* group equal faces: 2 × 12 + 2 × 8 + 2 × 6 */
      var g = [];
      ar.forEach(function (a) { var r = Math.round(a * 10) / 10, e = g.filter(function (x) { return x[0] === r; })[0]; if (e) e[1]++; else g.push([r, 1]); });
      return { total: tot, eq: g.map(function (x) { return (x[1] > 1 ? x[1] + ' × ' : '') + fmt(x[0]); }).join(' + ') };
    }
    function netSvg(W, H) {
      /* one scale for every fold, from the flat net, so the net does not grow or shrink as it folds */
      var F = netFor(P.n.shape, dims(P.n.shape, P.n)), lo = [1e9, 1e9], hi = [-1e9, -1e9];
      F.forEach(function (f) { f.p.forEach(function (q) { lo = [Math.min(lo[0], q[0]), Math.min(lo[1], q[1])]; hi = [Math.max(hi[0], q[0]), Math.max(hi[1], q[1])]; }); });
      var diag = Math.hypot(hi[0] - lo[0], hi[1] - lo[1]) || 1;
      return render(netFaces(P.n), W, H, { labels: shown, lab: 'Net of a ' + S3_ALL[P.n.shape][0], k: Math.min((W - 20) / diag * 1.2, (H - 20) / diag * 1.2, 60) });
    }
    function drawNets(W, H) {
      return '<div class="mp-s3w">' + netSvg(W, H) + '</div>' +
        '<div class="mp-s3fold"><label for="mp-s3f">Fold</label><input id="mp-s3f" type="range" min="0" max="100" value="' + Math.round(fold * 100) + '"></div>';
    }
    function volParts(Dv) {
      /* base area, height and the solid with the filled part */
      if (Dv.shape === 'box') return { base: Dv.l * Dv.w, h: Dv.h, eqb: Dv.l + ' × ' + Dv.w };
      if (Dv.shape === 'tprism') return { base: 6, h: Dv.L, eqb: '3 × 4 ÷ 2' };
      return { base: Math.PI * Dv.r * Dv.r, h: Dv.h, eqb: 'π × ' + Dv.r + '²' };
    }
    function drawVol(W, H) {
      var Dv = P.v, F, fill = Math.min(Dv.fill, volParts(Dv).h);
      if (Dv.shape === 'box') F = folded(boxNet(Dv.l, Dv.w, Dv.h), 1);
      else if (Dv.shape === 'tprism') F = upright(folded(triNet(Dv.L), 1));
      else F = upright(folded(regPrism(36, 2 * Math.PI * Dv.r / 36, Dv.h, true), 1));
      F.forEach(function (f) { f.cls = 'shell'; });
      var all = F.slice();
      if (fill > 0) {
        if (Dv.shape === 'box') {
          /* filled layers as unit cubes, so each layer can be counted */
          for (var z = 0; z < fill; z++) for (var y = 0; y < Dv.w; y++) for (var x = 0; x < Dv.l; x++) {
            var tp = z === fill - 1, cub = [];
            if (tp) cub.push([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]]);
            if (y === 0) cub.push([[x, y, z], [x + 1, y, z], [x + 1, y, z + 1], [x, y, z + 1]]);
            if (y === Dv.w - 1) cub.push([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]]);
            if (x === 0) cub.push([[x, y, z], [x, y + 1, z], [x, y + 1, z + 1], [x, y, z + 1]]);
            if (x === Dv.l - 1) cub.push([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]]);
            cub.forEach(function (q) { all.push({ v: q, k: 'u' }); });
          }
        } else {
          upright(Dv.shape === 'tprism' ? folded(triNet(fill), 1) : folded(regPrism(36, 2 * Math.PI * Dv.r / 36, fill, true), 1)).forEach(function (f) { f.k = 'w'; all.push(f); });
        }
      }
      var lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
      F.forEach(function (f) { f.v.forEach(function (p) { for (var d = 0; d < 3; d++) { lo[d] = Math.min(lo[d], p[d]); hi[d] = Math.max(hi[d], p[d]); } }); });
      return '<div class="mp-s3w">' + render(all, W, H, { lab: 'A ' + S3_ALL[Dv.shape][0] + ' being filled', center: [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2], kMax: 44 }) + '</div>';
    }

    /* ======== tray, readout, snaps ======== */
    function trayHtml() {
      if (P.mode === 'solids') return '<small>Solids</small><div class="mp-fkthings mp-s3list">' + SOLIDS.map(function (id) { return '<button type="button" data-pick="' + id + '" aria-pressed="' + (P.pick === id) + '">' + S3_ALL[id][0] + '</button>'; }).join('') + '</div>';
      if (P.mode === 'build') return '<small>Tap the grid</small><div class="mp-fkthings"><button type="button" data-take="0" aria-pressed="' + !P.b.take + '">Add a cube</button><button type="button" data-take="1" aria-pressed="' + P.b.take + '">Take one off</button></div>';
      var D = P.mode === 'nets' ? P.n : P.v, list = P.mode === 'nets' ? NETS : VOLS;
      var h = '<small>Solid</small><div class="mp-fkthings mp-s3list">' + list.map(function (id) { return '<button type="button" data-shape="' + id + '" aria-pressed="' + (D.shape === id) + '">' + S3_ALL[id][0] + '</button>'; }).join('') + '</div><small>Size (cm)</small>';
      if (D.shape === 'cube') h += stp('l', 'side', D.l);
      if (D.shape === 'box') h += stp('l', 'length', D.l) + stp('w', 'width', D.w) + stp('h', 'height', D.h);
      if (D.shape === 'tprism') h += stp('L', P.mode === 'vol' ? 'height' : 'length', D.L);
      if (D.shape === 'spyr') h += stp('s', 'base side', D.s) + stp('sl', 'slant height', D.sl);
      if (D.shape === 'tpyr') h += stp('s', 'side', D.s);
      if (D.shape === 'cyl') h += stp('r', 'radius', D.r) + stp('h', 'height', D.h);
      return h;
    }
    function count(Hh) { var c = 0; Hh.forEach(function (r) { r.forEach(function (v) { c += v; }); }); return c; }
    function readout() {
      if (!shown) { read.innerHTML = ''; return; }
      var big = '', eq = '';
      if (P.mode === 'solids') {
        var s = S3_ALL[P.pick];
        big = s[0];
        if (!g3) eq = (s[1] ? '<b>' + s[1] + '</b> flat face' + (s[1] === 1 ? '' : 's') : 'no flat faces') + (/curved/.test(s[4]) || P.pick === 'sph' ? ' and a curved surface' : '') + '. It can <b>' + S3_DO[P.pick] + '</b>';
        else if (P.pick === 'cyl' || P.pick === 'cone' || P.pick === 'sph') eq = s[4] + (P.pick === 'cyl' ? '; <b>2</b> curved edges, <b>0</b> vertices' : P.pick === 'cone' ? '; <b>1</b> curved edge, <b>1</b> vertex' : '; no edges or vertices');
        else eq = '<b>' + s[1] + '</b> faces, <b>' + s[2] + '</b> edges, <b>' + s[3] + '</b> vertices. Faces: ' + s[4];
      } else if (P.mode === 'build') {
        var c = count(P.b.h);
        big = g7 ? c + ' cm³' : pl(c, 'cube', 'cubes');
        if (P.b.puz >= 0) {
          var V = views(P.b.h), Tg = views(S3_PUZ[P.b.puz]), ok = ['top', 'front', 'side'].filter(function (k2) { return sameView(Tg[k2], V[k2]); });
          eq = ok.length === 3 ? 'All three views match' : ok.length ? ok.map(function (k2) { return k2[0].toUpperCase() + k2.slice(1); }).join(' and ') + ' view' + (ok.length > 1 ? 's match' : ' matches') : 'No view matches yet';
        } else if (g7) eq = 'each cube is 1 cm³';
      } else if (P.mode === 'nets') {
        var sa = saOf(P.n);
        big = 'SA ' + (P.n.shape === 'cyl' || P.n.shape === 'tpyr' ? '≈ ' : '= ') + n1(sa.total) + ' cm²';
        eq = sa.eq + ' = <b>' + n1(sa.total) + ' cm²</b>';
      } else {
        var vp = volParts(P.v), V2 = vp.base * vp.h, f2 = Math.min(P.v.fill, vp.h), approx = P.v.shape === 'cyl' ? '≈ ' : '= ';
        big = 'V ' + approx + n1(V2) + ' cm³';
        eq = 'base area ' + vp.eqb + ' ' + approx + n1(vp.base) + ' cm² × height ' + vp.h + ' cm ' + approx + '<b>' + n1(V2) + ' cm³</b> ' + approx + n1(V2) + ' mL';
        if (f2) eq += '. <b>' + f2 + '</b> of ' + vp.h + ' layers filled: ' + n1(vp.base * f2) + ' cm³';
      }
      read.innerHTML = (big ? '<p class="mp-total"><span class="mp-num">' + big + '</span></p>' : '') + (eq ? '<p class="mp-ceq">' + eq + '</p>' : '');
    }
    function snaps() {
      var h = btn('tl', '↺', null, false, ' aria-label="Turn left"') + btn('tr', '↻', null, false, ' aria-label="Turn right"') + btn('tu', 'Tip', null, false, ' aria-label="Tip it toward you"') + btn('td', 'Tip back', null, false, ' aria-label="Tip it away"');
      if (P.mode === 'build') h += (g6 ? btn('puz', P.b.puz < 0 ? 'Views puzzle' : P.b.puz < S3_PUZ.length - 1 ? 'Next puzzle' : 'No puzzle') : '') + btn('bclear', 'Clear', null, !count(P.b.h));
      if (P.mode === 'nets') h += btn('fold', 'Fold', null, fold >= 1) + btn('flat', 'Unfold', null, fold <= 0);
      if (P.mode === 'vol') { var vp = volParts(P.v); h += btn('vfill', 'Fill a layer', null, P.v.fill >= vp.h) + btn('vempty', 'Empty', null, !P.v.fill); }
      snapsEl.innerHTML = h;
    }
    function draw() {
      tray.innerHTML = trayHtml();
      readout();
      snaps();
      qsa('.mp-s3do [data-m]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === P.mode)); });
      var sz = size(), W = Math.max(260, sz[0]), H = Math.max(260, sz[1] - 70);
      var paint = function (h) { win.innerHTML = P.mode === 'solids' ? drawSolids(W, h) : P.mode === 'build' ? drawBuild(W, h) : P.mode === 'nets' ? drawNets(W, h - 44) : drawVol(W, h); };
      paint(H);
      var over = mat.scrollHeight - mat.clientHeight;
      if (over > 0) paint(Math.max(200, H - over - 4));
    }
    function redrawWin() {
      var r = qs('.mp-s3fold input', win), sv = qs('.mp-s3w', win);
      if (!sv) return draw();
      var sz = size(), W = Math.max(260, sz[0]), old = qs('svg', sv), Hh = old ? +old.getAttribute('height') : 300, Ww = old ? +old.getAttribute('width') : W;
      sv.innerHTML = P.mode === 'solids' ? render(solidFaces(P.pick), Ww, Hh, { lab: S3_ALL[P.pick][0], kMax: 70 }) : P.mode === 'nets' ? netSvg(Ww, Hh) : '';
      if (P.mode === 'build' || P.mode === 'vol') draw();
      if (r) r.value = Math.round(fold * 100);
    }

    /* ---- moves ---- */
    function snapshot() { return JSON.stringify(P); }
    function act(fn) { var b = snapshot(); fn(); if (snapshot() !== b) { hist.push(b); if (hist.length > 60) hist.shift(); } draw(); change(); }
    function change() { if (o.onChange) o.onChange(state(), T); }
    function state() { return { mode: P.mode, pick: P.pick, cubes: count(P.b.h), fold: fold, sa: P.mode === 'nets' ? saOf(P.n).total : null, fill: P.v.fill, last: last }; }
    function animateFold(to) {
      if (anim) clearInterval(anim);
      if (T.fast) { fold = to; draw(); change(); return; }
      anim = setInterval(function () {
        fold += (to > fold ? 1 : -1) * 0.06;
        if ((to - fold) * (to > 0.5 ? 1 : -1) <= 0) { fold = to; clearInterval(anim); anim = null; draw(); change(); return; }
        redrawWin();
      }, 30);
    }
    var LIM = { l: [1, 8], w: [1, 8], h: [1, 8], L: [1, 8], s: [1, 8], sl: [1, 9], r: [1, 5] };
    tray.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-pick')) return act(function () { P.pick = b.getAttribute('data-pick'); last = 'pick'; });
      if (b.hasAttribute('data-take')) return act(function () { P.b.take = b.getAttribute('data-take') === '1'; last = 'take'; });
      var D = P.mode === 'nets' ? P.n : P.v;
      if (b.hasAttribute('data-shape')) return act(function () { D.shape = b.getAttribute('data-shape'); if (P.mode === 'nets') fold = 0; else D.fill = 0; last = 'shape'; });
      if (b.classList.contains('mp-pstb')) {
        var id = b.getAttribute('data-st'), d = +b.getAttribute('data-d');
        return act(function () {
          D[id] = clamp(D[id] + d, LIM[id][0], LIM[id][1]);
          if (D.shape === 'spyr' && D.sl * 2 <= D.s) D.sl = Math.floor(D.s / 2) + 1;
          if (P.mode === 'vol') D.fill = Math.min(D.fill, volParts(D).h);
          last = 'size';
        });
      }
    });
    qs('.mp-s3do', root).addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b) act(function () { P.mode = b.getAttribute('data-m'); last = 'mode'; }); });
    snapsEl.addEventListener('click', function (e) {
      var s = e.target.closest('.mp-snap'); if (!s) return;
      var a = s.getAttribute('data-a');
      if (a === 'tl' || a === 'tr') { yaw += a === 'tl' ? -30 : 30; draw(); return; }
      if (a === 'tu' || a === 'td') { pitch = clamp(pitch + (a === 'tu' ? 15 : -15), -10, 85); draw(); return; }
      if (a === 'fold') return animateFold(1);
      if (a === 'flat') return animateFold(0);
      act(function () {
        if (a === 'bclear') P.b.h = blank();
        if (a === 'puz') { P.b.puz = P.b.puz >= S3_PUZ.length - 1 ? -1 : P.b.puz + 1; P.b.h = blank(); }
        if (a === 'vfill') P.v.fill++;
        if (a === 'vempty') P.v.fill = 0;
        last = a;
      });
    });
    win.addEventListener('input', function (e) { if (e.target.matches('.mp-s3fold input')) { if (anim) { clearInterval(anim); anim = null; } fold = +e.target.value / 100; redrawWin(); } });
    win.addEventListener('change', function (e) { if (e.target.matches('.mp-s3fold input')) { draw(); change(); } });
    /* drag to turn; in Build a tap (no drag) adds or takes off a cube */
    var drag = null;
    win.addEventListener('pointerdown', function (e) {
      if (!e.target.closest('.mp-s3sv')) return;
      drag = { x: e.clientX, y: e.clientY, yaw: yaw, pitch: pitch, moved: false, c: e.target.getAttribute('data-c') };
      if (win.setPointerCapture) try { win.setPointerCapture(e.pointerId); } catch (er) { /* a pointer that is already gone */ }
    });
    win.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 8) return;
      drag.moved = true;
      yaw = drag.yaw - dx * 0.5; pitch = clamp(drag.pitch + dy * 0.4, -10, 85);
      redrawWin();
    });
    win.addEventListener('pointercancel', function () { drag = null; });
    win.addEventListener('pointerup', function () {
      if (!drag) return;
      var d = drag; drag = null;
      if (d.moved || P.mode !== 'build' || !d.c) return;
      var ij = d.c.split(',').map(Number), col = P.b.h[ij[1]];
      if (P.b.take) { if (col[ij[0]] > 0) act(function () { col[ij[0]]--; last = 'take'; }); }
      else if (col[ij[0]] < 5) act(function () { col[ij[0]]++; last = 'add'; });
      else announce(T, 'That tower is as tall as it goes.');
    });
    T.undo = function () { if (!hist.length) return; P = JSON.parse(hist.pop()); last = 'undo'; draw(); change(); };
    T.canUndo = function () { return hist.length > 0; };
    T.showNumbers = function (on) { shown = !!on; draw(); change(); };
    T.state = state;
    T.reset = function () { fresh(); hist = []; draw(); };
    var lw = 0;
    if (window.ResizeObserver) new ResizeObserver(function () { var w = mat.clientWidth; if (w && w !== lw) { lw = w; draw(); } }).observe(mat); else window.addEventListener('resize', draw);
    T.reset();
    return T;
  }
  M.solids = function (root, o) { return toolSolid(root, o || {}); };

  /* ================= Arrays and area model (Toolbox) =================
     Make: Arrays (every grade: rows and columns of dots, seen as equal groups; from Grade 3 the times and division facts, Turn it, and
     Split it into two parts by tapping between columns), Cover (every grade: paint squares to cover a shape; square centimetres and the
     perimeter from Grade 3, length × width for a rectangle from Grade 4) and Area model (Grade 4 and up: multiply or divide with a
     rectangle cut by place value; two-digit by two-digit from Grade 5, a decimal tenth from Grade 6, decimals by decimals from Grade 7). */
  function toolArea(root, o) {
    var T = base(root, 'arr');
    root.classList.add('mp-tool', 'mp-fkt', 'mp-patt', 'mp-datt', 'mp-art');
    var gr = window.Atlas && +Atlas.grade || 0, g2 = !gr || gr >= 2, g3 = !gr || gr >= 3, g4 = !gr || gr >= 4, g5 = !gr || gr >= 5, g6 = !gr || gr >= 6, g7 = !gr || gr >= 7;
    var MODES = [['arr', 'Arrays'], ['cover', 'Cover']].concat(g4 ? [['model', 'Area model']] : []);
    var GC = 12, GR = 8;
    root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray mp-fktray mp-ptray mp-gtr mp-artr"></div><div class="mp-dmain"><div class="mp-cmode mp-ardo" role="group" aria-label="Make"><span>Make</span>' +
      MODES.map(function (m) { return '<button type="button" data-m="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>' +
      '<div class="mp-read" aria-live="polite"></div><div class="mp-mat mp-fkmat mp-pmat"><div class="mp-pwin"></div><div class="mp-snaps"></div></div><p class="mp-live sr" aria-live="polite"></p></div></div>';
    var tray = qs('.mp-artr', root), mat = qs('.mp-pmat', root), win = qs('.mp-pwin', mat), read = qs('.mp-read', root), snapsEl = qs('.mp-snaps', mat);
    /* state: the move; Arrays: rows, columns, groups or array, where it is split; Cover: the squares covered; Area model: multiply or
       divide, the two numbers (or the total and the divisor) and whether they step in tenths */
    var P, shown = false, hist = [], last = '';
    function fresh() {
      P = { mode: 'arr', a: { r: 3, c: 4, groups: !g3, split: 0 }, cv: { on: {} },
        m: { op: 'x', a: g5 ? 23 : 34, b: g5 ? 14 : 6, n: g5 ? 384 : 96, d: g5 ? 12 : 4, dec: false } };
    }
    function size() { var cs = getComputedStyle(mat); return [(mat.clientWidth || 700) - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), (mat.clientHeight || 500) - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)]; }
    function btn(a, t, on, dis) { return '<button type="button" class="mp-snap" data-a="' + a + '"' + (on != null ? ' aria-pressed="' + on + '"' : '') + (dis ? ' disabled' : '') + '>' + t + '</button>'; }
    function stp(id, lab, val) {
      return '<div class="mp-dans mp-dbig"><small>' + lab + '</small><div class="mp-pstr"><button type="button" class="mp-pstb" data-st="' + id + '" data-d="-1" aria-label="' + lab + ': less">&minus;</button>' +
        '<b>' + val + '</b><button type="button" class="mp-pstb" data-st="' + id + '" data-d="1" aria-label="' + lab + ': more">+</button></div></div>';
    }
    function r2(v) { return Math.round(v * 1000) / 1000; }
    function f(v) { return fmt(r2(v)); }
    function svgOpen(W, H, lab) { return '<svg class="mp-dsvg mp-arsv" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + lab + '">'; }

    /* ======== Arrays ======== */
    function drawArr(W, H) {
      var A = P.a, side = A.groups ? 1.5 : 1, u = Math.max(16, Math.min(64, Math.floor((W - 40) / (A.c + (A.split ? 0.8 : 0))), Math.floor((H - 40) / (A.r * side))));
      var gap = A.split ? u * 0.8 : 0, Wd = A.c * u + gap + 24, Hd = A.r * u * side + 24, s = svgOpen(Wd, Hd, A.r + ' rows of ' + A.c);
      for (var i = 0; i < A.r; i++) {
        var y = 12 + i * u * side + u / 2 + (A.groups ? u * 0.25 : 0);
        if (A.groups) s += '<rect class="mp-argrp" x="6" y="' + (y - u * 0.62).toFixed(1) + '" width="' + (A.c * u + gap + 12) + '" height="' + (u * 1.24).toFixed(1) + '" rx="' + (u * 0.62).toFixed(1) + '"/>';
        for (var j = 0; j < A.c; j++) {
          var x = 12 + j * u + u / 2 + (A.split && j >= A.split ? gap : 0);
          s += '<circle class="mp-ardot' + (A.split && j >= A.split ? ' b' : '') + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (u * 0.36).toFixed(1) + '"/>';
        }
      }
      /* tap targets between columns, to split the array there */
      if (g3 && !A.groups) for (var k = 1; k < A.c; k++) {
        var gx = 12 + k * u + (A.split && k > A.split ? gap : 0) + (A.split === k ? gap / 2 : 0);
        s += '<rect class="mp-arcut' + (A.split === k ? ' on' : '') + '" data-cut="' + k + '" x="' + (gx - 8).toFixed(1) + '" y="4" width="16" height="' + (Hd - 8) + '" rx="8"><title>Split after column ' + k + '</title></rect>';
      }
      return '<div class="mp-s3w">' + s + '</svg></div>' + (g3 && !A.groups && !A.split ? '<p class="mp-fknote">Tap between two columns to split the array.</p>' : '');
    }
    function arrRead() {
      var A = P.a, n = A.r * A.c;
      if (!g2) return [n + '', '<b>' + A.r + '</b> rows of <b>' + A.c + '</b> is <b>' + n + '</b>'];
      if (!g3) return [A.r + ' groups of ' + A.c + ' is ' + n, n + ' shared into ' + A.r + ' equal groups is <b>' + A.c + '</b> in each'];
      var big = A.r + ' × ' + A.c + ' = ' + n, eq = A.c + ' × ' + A.r + ' = ' + n + ', ' + n + ' ÷ ' + A.r + ' = ' + A.c + ', ' + n + ' ÷ ' + A.c + ' = ' + A.r;
      if (A.split) { var c2 = A.c - A.split; eq = A.r + ' × ' + A.c + ' = <b>' + A.r + ' × ' + A.split + '</b> + <b>' + A.r + ' × ' + c2 + '</b> = ' + A.r * A.split + ' + ' + A.r * c2 + ' = <b>' + n + '</b>'; }
      return [big, eq];
    }

    /* ======== Cover ======== */
    function cells() { return Object.keys(P.cv.on).map(function (k) { return k.split(',').map(Number); }); }
    function perim(L) {
      var p = 0, on = P.cv.on;
      L.forEach(function (q) { [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { if (!on[(q[0] + d[0]) + ',' + (q[1] + d[1])]) p++; }); });
      return p;
    }
    function rectOf(L) {
      if (!L.length) return null;
      var xs = L.map(function (q) { return q[0]; }), ys = L.map(function (q) { return q[1]; }), l = Math.max.apply(null, xs) - Math.min.apply(null, xs) + 1, w = Math.max.apply(null, ys) - Math.min.apply(null, ys) + 1;
      return l * w === L.length ? [l, w] : null;
    }
    function drawCover(W, H) {
      var u = Math.max(22, Math.min(56, Math.floor((W - 8) / GC), Math.floor((H - 8) / GR))), s = svgOpen(GC * u + 2, GR * u + 2, 'Squares to cover');
      for (var y = 0; y < GR; y++) for (var x = 0; x < GC; x++) s += '<rect class="mp-arsq' + (P.cv.on[x + ',' + y] ? ' on' : '') + '" data-sq="' + x + ',' + y + '" x="' + (1 + x * u) + '" y="' + (1 + y * u) + '" width="' + u + '" height="' + u + '"/>';
      return '<div class="mp-s3w">' + s + '</svg></div>';
    }
    function coverRead() {
      var L = cells(), n = L.length, rc = rectOf(L), unit = g3 ? ' cm²' : '';
      if (!n) return ['', ''];
      var big = g3 ? n + unit : pl(n, 'square', 'squares'), eq = '';
      if (g3) eq = 'perimeter <b>' + perim(L) + ' cm</b>';
      if (g4 && rc) eq += (eq ? '. ' : '') + 'a rectangle: <b>' + rc[0] + ' × ' + rc[1] + ' = ' + n + '</b>';
      return [big, eq];
    }

    /* ======== Area model ======== */
    /* place-value parts: 345 is 300, 40, 5; 2.3 is 2 and 0.3 */
    function parts(v) {
      var out = [], s = String(r2(v)), dot = s.indexOf('.'), ip = dot < 0 ? s : s.slice(0, dot), fp = dot < 0 ? '' : s.slice(dot + 1);
      for (var i = 0; i < ip.length; i++) { var d = +ip[i]; if (d) out.push(d * Math.pow(10, ip.length - 1 - i)); }
      for (var j = 0; j < fp.length; j++) { var e = +fp[j]; if (e) out.push(r2(e / Math.pow(10, j + 1))); }
      return out.length ? out : [0];
    }
    function widths(L, total) {
      /* each part gets room by its size, but never too thin to read */
      var sum = L.reduce(function (s, v) { return s + v; }, 0) || 1, min = 70, free = Math.max(0, total - min * L.length);
      return L.map(function (v) { return min + free * v / sum; });
    }
    function quotientChunks(n, d) {
      /* take away the biggest place-value chunk of the divisor each time: 384 ÷ 12 is 30 × 12, then 2 × 12 */
      var out = [], left = n;
      for (var pv = Math.pow(10, String(Math.floor(n / d)).length - 1); pv >= 1; pv /= 10) {
        var k = Math.floor(left / (d * pv));
        if (k) { out.push(k * pv); left -= k * pv * d; }
      }
      return { q: out, rem: left };
    }
    function drawModel(W, H) {
      var Mm = P.m, s, Wd = Math.min(W - 10, 760), Hd = Math.min(H - 10, 420);
      if (Mm.op === 'x') {
        var A = parts(Mm.a), B = parts(Mm.b), cw = widths(A, Wd - 70), rh = widths(B, Hd - 50), x0 = 60, y0 = 34;
        s = svgOpen(Wd, Hd, Mm.a + ' times ' + Mm.b);
        var x = x0;
        A.forEach(function (a, i) {
          s += '<text class="mp-artop" x="' + (x + cw[i] / 2).toFixed(1) + '" y="22" text-anchor="middle">' + f(a) + '</text>';
          var y = y0;
          B.forEach(function (b, j) {
            if (i === 0) s += '<text class="mp-artop" x="' + (x0 - 10) + '" y="' + (y + rh[j] / 2 + 6).toFixed(1) + '" text-anchor="end">' + f(b) + '</text>';
            s += '<rect class="mp-arpart p' + ((i * B.length + j) % 4) + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + cw[i].toFixed(1) + '" height="' + rh[j].toFixed(1) + '"/>';
            if (shown) s += '<text class="mp-arpt" x="' + (x + cw[i] / 2).toFixed(1) + '" y="' + (y + rh[j] / 2 + 6).toFixed(1) + '" text-anchor="middle">' + f(a * b) + '</text>';
            y += rh[j];
          });
          x += cw[i];
        });
        return '<div class="mp-s3w">' + s + '</svg></div>';
      }
      var Q = quotientChunks(Mm.n, Mm.d), cols = Q.q.concat(Q.rem ? ['r'] : []), tw = widths(cols.map(function (q) { return q === 'r' ? Q.rem / Mm.d : q; }), Wd - 70), hh = Math.min(Hd - 60, 160), xx = 60;
      s = svgOpen(Wd, hh + 60, Mm.n + ' divided by ' + Mm.d);
      s += '<text class="mp-artop" x="50" y="' + (34 + hh / 2 + 6) + '" text-anchor="end">' + Mm.d + '</text>';
      cols.forEach(function (q, i) {
        var rem = q === 'r';
        s += '<rect class="mp-arpart ' + (rem ? 'rem' : 'p' + (i % 4)) + '" x="' + xx.toFixed(1) + '" y="34" width="' + tw[i].toFixed(1) + '" height="' + hh + '"/>';
        s += '<text class="mp-artop" x="' + (xx + tw[i] / 2).toFixed(1) + '" y="22" text-anchor="middle">' + (rem ? 'left' : shown ? f(q) : '?') + '</text>';
        if (shown) s += '<text class="mp-arpt' + (rem ? ' rem' : '') + '" x="' + (xx + tw[i] / 2).toFixed(1) + '" y="' + (34 + hh / 2 + 6) + '" text-anchor="middle">' + (rem ? Q.rem : f(q * Mm.d)) + '</text>';
        xx += tw[i];
      });
      return '<div class="mp-s3w">' + s + '</svg></div>';
    }
    function modelRead() {
      var Mm = P.m;
      if (Mm.op === 'x') {
        var A = parts(Mm.a), B = parts(Mm.b), pp = [];
        A.forEach(function (a) { B.forEach(function (b) { pp.push(r2(a * b)); }); });
        return [f(Mm.a) + ' × ' + f(Mm.b) + ' = ' + f(Mm.a * Mm.b), pp.map(f).join(' + ') + ' = <b>' + f(Mm.a * Mm.b) + '</b>'];
      }
      var Q = quotientChunks(Mm.n, Mm.d), q = Q.q.reduce(function (s, v) { return s + v; }, 0);
      var big = Mm.n + ' ÷ ' + Mm.d + ' = ' + q + (Q.rem ? ' R ' + Q.rem : '');
      var eq = Q.q.map(function (k) { return Mm.d + ' × ' + k + ' = ' + Mm.d * k; }).join(', ') + (Q.rem ? ', and <b>' + Q.rem + '</b> left over' : '') + '. ' + Q.q.join(' + ') + ' = <b>' + q + '</b>';
      if (Q.rem) eq += '. As a fraction: <b>' + q + ' ' + Q.rem + '/' + Mm.d + '</b>';
      return [big, eq];
    }

    /* ======== tray, readout, snaps ======== */
    function trayHtml() {
      if (P.mode === 'arr') return '<small>Array</small>' + stp('r', g3 ? 'rows' : 'groups', P.a.r) + stp('c', g3 ? 'columns' : 'in each', P.a.c);
      if (P.mode === 'cover') return '<small>Cover</small><p class="mp-fknote">Tap or drag over the squares. Tap a covered square to clear it.</p>';
      var Mm = P.m, h = '<small>Do</small><div class="mp-fkthings"><button type="button" data-op="x" aria-pressed="' + (Mm.op === 'x') + '">Multiply</button><button type="button" data-op="d" aria-pressed="' + (Mm.op === 'd') + '">Divide</button></div>';
      if (Mm.op === 'x') h += stp('a', 'first number', f(Mm.a)) + stp('b', 'second number', f(Mm.b)) + (g6 ? '<div class="mp-fkthings"><button type="button" data-dec="1" aria-pressed="' + Mm.dec + '">Tenths</button></div>' : '');
      else h += stp('n', 'number to share', Mm.n) + stp('d', 'divide by', Mm.d);
      return h;
    }
    function readout() {
      if (!shown) { read.innerHTML = ''; return; }
      var r = P.mode === 'arr' ? arrRead() : P.mode === 'cover' ? coverRead() : modelRead();
      read.innerHTML = (r[0] ? '<p class="mp-total"><span class="mp-num">' + r[0] + '</span></p>' : '') + (r[1] ? '<p class="mp-ceq">' + r[1] + '</p>' : '');
    }
    function snaps() {
      var h = '';
      if (P.mode === 'arr') h += (g3 ? btn('groups', 'Groups', P.a.groups) + btn('turn', 'Turn it') + btn('unsplit', 'Join', null, !P.a.split) : '');
      if (P.mode === 'cover') h += btn('rect', 'A rectangle') + btn('cclear', 'Clear', null, !cells().length);
      if (P.mode === 'model' && P.m.op === 'x') h += btn('swap', 'Swap');
      snapsEl.innerHTML = h;
      snapsEl.hidden = !h;
    }
    function draw() {
      tray.innerHTML = trayHtml();
      readout();
      snaps();
      qsa('.mp-ardo [data-m]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === P.mode)); });
      var sz = size(), W = Math.max(260, sz[0]), H = Math.max(240, sz[1] - 70);
      var paint = function (h) { win.innerHTML = P.mode === 'arr' ? drawArr(W, h) : P.mode === 'cover' ? drawCover(W, h) : drawModel(W, h); };
      paint(H);
      var over = mat.scrollHeight - mat.clientHeight;
      if (over > 0) paint(Math.max(180, H - over - 4));
    }

    /* ---- moves ---- */
    function snapshot() { return JSON.stringify(P); }
    function act(fn) { var b = snapshot(); fn(); if (snapshot() !== b) { hist.push(b); if (hist.length > 60) hist.shift(); } draw(); change(); }
    function change() { if (o.onChange) o.onChange(state(), T); }
    function state() { var rc = rectOf(cells()); return { mode: P.mode, rows: P.a.r, cols: P.a.c, split: P.a.split, covered: cells().length, rect: rc, last: last }; }
    var LIM = { r: [1, 12], c: [1, 12] };
    tray.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-op')) return act(function () { P.m.op = b.getAttribute('data-op'); last = 'op'; });
      if (b.hasAttribute('data-dec')) return act(function () { P.m.dec = !P.m.dec; if (!P.m.dec) { P.m.a = Math.max(1, Math.round(P.m.a)); P.m.b = Math.max(1, Math.round(P.m.b)); } else if (g7) { P.m.a = 1.2; P.m.b = 2.3; } else P.m.b = 0.6; last = 'tenths'; });
      if (!b.classList.contains('mp-pstb')) return;
      var id = b.getAttribute('data-st'), d = +b.getAttribute('data-d');
      act(function () {
        var Mm = P.m;
        if (id === 'r' || id === 'c') { P.a[id] = clamp(P.a[id] + d, LIM[id][0], LIM[id][1]); P.a.split = Math.min(P.a.split, P.a.c - 1); if (P.a.split < 1) P.a.split = 0; }
        /* sizes the grade works with: one digit times up to three digits in Grade 4, then two by two digits, then tenths */
        var maxA = g5 && !g6 ? 99 : 999, maxB = g5 ? 99 : 9;
        if (id === 'a' || id === 'b') {
          var tenth = Mm.dec && (id === 'b' || g7), stepv = tenth ? 0.1 : 1, big = id === 'a' ? (Mm.dec && g7 ? 9.9 : maxA) : (tenth ? 9.9 : maxB);
          Mm[id] = r2(clamp(Mm[id] + d * stepv, tenth ? 0.1 : 1, big));
        }
        if (id === 'n') Mm.n = clamp(Mm.n + d, 10, 999);
        if (id === 'd') Mm.d = clamp(Mm.d + d, 2, g5 ? 99 : 9);
        last = 'size';
      });
    });
    qs('.mp-ardo', root).addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b) act(function () { P.mode = b.getAttribute('data-m'); last = 'mode'; }); });
    snapsEl.addEventListener('click', function (e) {
      var s = e.target.closest('.mp-snap'); if (!s) return;
      var a = s.getAttribute('data-a');
      act(function () {
        var A = P.a;
        if (a === 'groups') A.groups = !A.groups;
        if (a === 'turn') { var t = A.r; A.r = A.c; A.c = t; A.split = 0; }
        if (a === 'unsplit') A.split = 0;
        if (a === 'cclear') P.cv.on = {};
        if (a === 'rect') { P.cv.on = {}; for (var y = 1; y <= 3; y++) for (var x = 1; x <= 4; x++) P.cv.on[x + ',' + y] = 1; }
        if (a === 'swap') { var t2 = P.m.a; P.m.a = P.m.b; P.m.b = t2; }
        last = a;
      });
    });
    win.addEventListener('click', function (e) {
      var c = e.target.closest('[data-cut]');
      if (c && P.mode === 'arr') act(function () { var k = +c.getAttribute('data-cut'); P.a.split = P.a.split === k ? 0 : k; last = 'split'; });
    });
    /* Cover: tap a square, or drag across squares to paint them all the same way */
    var paintTo = null, before = null;
    function sqAt(e) { var el = document.elementFromPoint(e.clientX, e.clientY); return el && el.closest && el.closest('[data-sq]'); }
    win.addEventListener('pointerdown', function (e) {
      var q = e.target.closest('[data-sq]'); if (!q || P.mode !== 'cover') return;
      e.preventDefault();
      before = snapshot();
      var k = q.getAttribute('data-sq');
      paintTo = !P.cv.on[k];
      if (paintTo) P.cv.on[k] = 1; else delete P.cv.on[k];
      q.classList.toggle('on', paintTo);
      if (win.setPointerCapture) try { win.setPointerCapture(e.pointerId); } catch (er) { /* a pointer that is already gone */ }
    });
    win.addEventListener('pointermove', function (e) {
      if (paintTo == null) return;
      var q = sqAt(e); if (!q) return;
      var k = q.getAttribute('data-sq');
      if (!!P.cv.on[k] === paintTo) return;
      if (paintTo) P.cv.on[k] = 1; else delete P.cv.on[k];
      q.classList.toggle('on', paintTo);
    });
    function endPaint() {
      if (paintTo == null) return;
      paintTo = null;
      if (snapshot() !== before) { hist.push(before); if (hist.length > 60) hist.shift(); }
      last = 'cover'; readout(); snaps(); change();
    }
    win.addEventListener('pointerup', endPaint);
    win.addEventListener('pointercancel', endPaint);
    T.undo = function () { if (!hist.length) return; P = JSON.parse(hist.pop()); last = 'undo'; draw(); change(); };
    T.canUndo = function () { return hist.length > 0; };
    T.showNumbers = function (on) { shown = !!on; draw(); change(); };
    T.state = state;
    T.reset = function () { fresh(); hist = []; draw(); };
    var lw = 0;
    if (window.ResizeObserver) new ResizeObserver(function () { var w = mat.clientWidth; if (w && w !== lw) { lw = w; draw(); } }).observe(mat); else window.addEventListener('resize', draw);
    T.reset();
    return T;
  }

  /* ================= Shape kit (Toolbox) =================
     Make: Blocks (every grade: pattern blocks to put together, turn and flip, with a mirror line for matching halves; Show number counts
     them and, from Grade 2, gives the area in green triangles) and Geoboard (every grade: tap pegs to stretch a band into a shape, drag a
     corner to change it; the readout names the shape and gives its sides, and from Grade 3 its perimeter and area, from Grade 4 its angles
     and parallel sides, from Grade 5 the triangle type and angles in degrees, from Grade 6 the quadrilateral and its diagonals, and in
     Grade 8 the squares on the sides of a right triangle). */
  var SH = Math.sqrt(3) / 2;
  var PB = {
    hex: ['hexagon', 6, [[0, 0], [1, 0], [1.5, SH], [1, 2 * SH], [0, 2 * SH], [-0.5, SH]]],
    trap: ['trapezoid', 3, [[0, 0], [2, 0], [1.5, SH], [0.5, SH]]],
    rhom: ['blue rhombus', 2, [[0, 0], [1, 0], [1.5, SH], [0.5, SH]]],
    tri: ['triangle', 1, [[0, 0], [1, 0], [0.5, SH]]],
    sq: ['square', 0, [[0, 0], [1, 0], [1, 1], [0, 1]]],
    tan: ['tan rhombus', 0, [[0, 0], [1, 0], [1 + SH, 0.5], [SH, 0.5]]]
  };
  var PB_ORDER = ['hex', 'trap', 'rhom', 'tri', 'sq', 'tan'];
  function toolShape(root, o) {
    var T = base(root, 'shp');
    root.classList.add('mp-tool', 'mp-fkt', 'mp-patt', 'mp-datt', 'mp-sht');
    var gr = window.Atlas && +Atlas.grade || 0, g2 = !gr || gr >= 2, g3 = !gr || gr >= 3, g4 = !gr || gr >= 4, g5 = !gr || gr >= 5, g6 = !gr || gr >= 6, g8 = !gr || gr >= 8;
    var MODES = [['blocks', 'Blocks'], ['geo', 'Geoboard']], NP = g3 ? 9 : 7;
    root.innerHTML = '<div class="mp-dwrap"><div class="mp-dtray mp-fktray mp-ptray mp-gtr mp-shtr"></div><div class="mp-dmain"><div class="mp-cmode mp-shdo" role="group" aria-label="Make"><span>Make</span>' +
      MODES.map(function (m) { return '<button type="button" data-m="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>' +
      '<div class="mp-read" aria-live="polite"></div><div class="mp-mat mp-fkmat mp-pmat"><div class="mp-pwin"></div><div class="mp-snaps"></div></div><p class="mp-live sr" aria-live="polite"></p></div></div>';
    var tray = qs('.mp-shtr', root), mat = qs('.mp-pmat', root), win = qs('.mp-pwin', mat), read = qs('.mp-read', root), snapsEl = qs('.mp-snaps', mat);
    /* state: the move; Blocks: each block (kind, middle x and y in block sides, turn in degrees, flipped), the one picked, the mirror;
       Geoboard: the corners (pegs), closed or not, diagonals and squares on the sides */
    var P, shown = false, hist = [], last = '', u = 50, view = [10, 7];
    function fresh() { P = { mode: 'blocks', b: [], sel: -1, mirror: false, g: { pts: [], closed: false, diag: false, sq: false } }; }
    function size() { var cs = getComputedStyle(mat); return [(mat.clientWidth || 700) - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), (mat.clientHeight || 500) - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)]; }
    function btn(a, t, on, dis) { return '<button type="button" class="mp-snap" data-a="' + a + '"' + (on != null ? ' aria-pressed="' + on + '"' : '') + (dis ? ' disabled' : '') + '>' + t + '</button>'; }
    function r1(v) { return fmt(Math.round(v * 10) / 10); }

    /* ======== Blocks ======== */
    function shapeOf(b) {
      /* the block's corners on the mat (in block sides), turned about its middle and flipped */
      var base0 = PB[b.k][2], cx = 0, cy = 0;
      base0.forEach(function (p) { cx += p[0] / base0.length; cy += p[1] / base0.length; });
      var a = b.a * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      return base0.map(function (p) { var x = p[0] - cx, y = cy - p[1]; if (b.f) x = -x; return [b.x + x * c - y * s, b.y + x * s + y * c]; });
    }
    function poly(q, cls, extra) { return '<polygon class="' + cls + '" points="' + q.map(function (p) { return (p[0] * u).toFixed(1) + ',' + (p[1] * u).toFixed(1); }).join(' ') + '"' + (extra || '') + '/>'; }
    function drawBlocks(W, H) {
      u = Math.max(34, Math.min(64, Math.floor(Math.min(W / 9, H / 6.5))));
      view = [W / u, H / u];
      var s = '<svg class="mp-dsvg mp-shsv" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Pattern blocks">';
      var mx = view[0] / 2;
      if (P.mirror) s += '<line class="mp-shmir" x1="' + (mx * u) + '" x2="' + (mx * u) + '" y1="4" y2="' + (H - 4) + '"/>';
      P.b.forEach(function (b, i) {
        var q = shapeOf(b);
        s += poly(q, 'mp-shb k' + b.k + (P.sel === i ? ' sel' : ''), ' data-i="' + i + '"');
        if (P.mirror) s += poly(q.map(function (p) { return [2 * mx - p[0], p[1]]; }), 'mp-shb k' + b.k + ' ghost');
      });
      return s + '</svg>';
    }
    function snapBlock(i) {
      /* if a corner lands close to a corner of another block, slide it the rest of the way */
      var q = shapeOf(P.b[i]), best = null;
      P.b.forEach(function (b, j) {
        if (j === i) return;
        shapeOf(b).forEach(function (p) { q.forEach(function (r) { var d = Math.hypot(p[0] - r[0], p[1] - r[1]); if (d < 0.28 && (!best || d < best[0])) best = [d, p[0] - r[0], p[1] - r[1]]; }); });
      });
      if (best) { P.b[i].x += best[1]; P.b[i].y += best[2]; }
    }
    function blocksRead() {
      var L = P.b, n = L.length;
      if (!n) return ['', ''];
      var by = {};
      L.forEach(function (b) { by[b.k] = (by[b.k] || 0) + 1; });
      var list = PB_ORDER.filter(function (k) { return by[k]; }).map(function (k) { return '<b>' + by[k] + '</b> ' + PB[k][0] + (by[k] > 1 ? (k === 'rhom' || k === 'tan' ? 'es' : 's') : ''); }).join(', ');
      var big = pl(n, 'block', 'blocks'), eq = list;
      if (g2) {
        var tri = 0, other = 0;
        L.forEach(function (b) { if (PB[b.k][1]) tri += PB[b.k][1]; else other++; });
        if (tri) eq += '. They cover the same as <b>' + tri + '</b> green triangle' + (tri === 1 ? '' : 's') + (other ? ' (not counting squares and tan rhombuses)' : '');
      }
      return [big, eq];
    }

    /* ======== Geoboard ======== */
    function sides(Q) { return Q.map(function (p, i) { var q = Q[(i + 1) % Q.length]; return [q[0] - p[0], q[1] - p[1]]; }); }
    function len(v) { return Math.hypot(v[0], v[1]); }
    function areaOf(Q) { var s = 0; Q.forEach(function (p, i) { var q = Q[(i + 1) % Q.length]; s += p[0] * q[1] - q[0] * p[1]; }); return s / 2; }
    function interior(Q) {
      /* the inside angle at each corner, in degrees (more than 180 at a corner that points in) */
      var sg = areaOf(Q) > 0 ? 1 : -1;
      return Q.map(function (p, i) {
        var a = Q[(i + Q.length - 1) % Q.length], b = Q[(i + 1) % Q.length], v1 = [a[0] - p[0], a[1] - p[1]], v2 = [b[0] - p[0], b[1] - p[1]];
        var t = Math.atan2(v1[0] * v2[1] - v1[1] * v2[0], v1[0] * v2[0] + v1[1] * v2[1]) * 180 / Math.PI * sg;
        if (t < 0) t += 360;
        return 360 - t;
      });
    }
    function par(v, w) { return Math.abs(v[0] * w[1] - v[1] * w[0]) < 1e-9; }
    function simple(Q) {
      /* no two sides cross */
      function cross(a, b, c, d) {
        function o(p, q, r) { var v = (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); return v > 0 ? 1 : v < 0 ? -1 : 0; }
        return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
      }
      for (var i = 0; i < Q.length; i++) for (var j = i + 2; j < Q.length; j++) {
        if (i === 0 && j === Q.length - 1) continue;
        if (cross(Q[i], Q[(i + 1) % Q.length], Q[j], Q[(j + 1) % Q.length])) return false;
      }
      return true;
    }
    function nameOf(Q) {
      var n = Q.length, S = sides(Q), L = S.map(len), A = interior(Q), right = A.filter(function (a) { return Math.abs(a - 90) < 0.01; }).length;
      var names = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon' }, nm = names[n] || n + '-sided shape';
      function eq(a, b) { return Math.abs(a - b) < 1e-9; }
      if (n === 3 && g5) {
        var e = (eq(L[0], L[1]) ? 1 : 0) + (eq(L[1], L[2]) ? 1 : 0) + (eq(L[0], L[2]) ? 1 : 0), big = Math.max.apply(null, A);
        nm = (e === 3 ? 'equilateral' : e ? 'isosceles' : 'scalene') + ' ' + (Math.abs(big - 90) < 0.01 ? 'right' : big > 90 ? 'obtuse' : 'acute') + ' triangle';
      }
      if (n === 4 && (right === 4 || g4)) {
        var p1 = par(S[0], S[2]), p2 = par(S[1], S[3]), all = eq(L[0], L[1]) && eq(L[1], L[2]) && eq(L[2], L[3]);
        if (right === 4) nm = all ? 'square' : 'rectangle';
        else if (g6) nm = all ? 'rhombus' : p1 && p2 ? 'parallelogram' : p1 || p2 ? 'trapezoid' : (eq(L[0], L[1]) && eq(L[2], L[3])) || (eq(L[1], L[2]) && eq(L[3], L[0])) ? 'kite' : 'quadrilateral';
      }
      return nm;
    }
    function geoRead() {
      var G = P.g, Q = G.pts;
      if (!G.closed) return [Q.length ? pl(Q.length, 'corner', 'corners') : '', Q.length ? 'Tap the first peg again to close the shape.' : ''];
      if (!simple(Q)) return ['the band crosses itself', 'Drag a corner so no sides cross.'];
      var S = sides(Q), L = S.map(len), A = interior(Q), ar = Math.abs(areaOf(Q)), straight = S.every(function (v) { return !v[0] || !v[1]; });
      var big = nameOf(Q), eq = '<b>' + Q.length + '</b> sides, <b>' + Q.length + '</b> corners';
      if (g3) {
        var per = L.reduce(function (s, v) { return s + v; }, 0);
        eq += '. Perimeter ' + (straight ? '<b>' + r1(per) + '</b>' : 'about <b>' + r1(per) + '</b>') + ' units, area <b>' + r1(ar) + '</b> square' + (ar === 1 ? '' : 's');
      }
      if (g4) {
        var rt = A.filter(function (a) { return Math.abs(a - 90) < 0.01; }).length, ac = A.filter(function (a) { return a < 89.99; }).length, ob = A.filter(function (a) { return a > 90.01 && a < 179.99; }).length, rf = A.filter(function (a) { return a > 180.01; }).length;
        var pp = 0; S.forEach(function (v, i) { for (var j = i + 1; j < S.length; j++) if (par(v, S[j])) pp++; });
        eq += '. Angles: ' + [rt ? rt + ' right' : '', ac ? ac + ' acute' : '', ob ? ob + ' obtuse' : '', rf ? rf + ' reflex' : ''].filter(Boolean).join(', ') + (pp ? '. ' + pl(pp, 'pair', 'pairs') + ' of parallel sides' : '');
      }
      if (g5) eq += '. ' + A.map(function (a) { return Math.round(a) + '°'; }).join(' + ') + ' = ' + Math.round(A.reduce(function (s, v) { return s + v; }, 0)) + '°';
      if (g6 && G.diag && Q.length === 4) {
        var d1 = [Q[2][0] - Q[0][0], Q[2][1] - Q[0][1]], d2 = [Q[3][0] - Q[1][0], Q[3][1] - Q[1][1]], m1 = [(Q[0][0] + Q[2][0]) / 2, (Q[0][1] + Q[2][1]) / 2], m2 = [(Q[1][0] + Q[3][0]) / 2, (Q[1][1] + Q[3][1]) / 2];
        var f = [];
        if (Math.abs(len(d1) - len(d2)) < 1e-9) f.push('the same length');
        if (Math.abs(d1[0] * d2[0] + d1[1] * d2[1]) < 1e-9) f.push('cross at right angles');
        if (Math.abs(m1[0] - m2[0]) < 1e-9 && Math.abs(m1[1] - m2[1]) < 1e-9) f.push('cut each other in half');
        eq += '. Diagonals: ' + (f.length ? f.join(', ') : 'none of these: same length, right angles, cut in half');
      }
      if (g8 && G.sq) { var pt = pyth(Q); if (pt) eq += '. ' + pt; }
      return [big, eq];
    }
    function pyth(Q) {
      if (Q.length !== 3) return '';
      var S = sides(Q), A = interior(Q), k = -1;
      A.forEach(function (a, i) { if (Math.abs(a - 90) < 0.01) k = i; });
      if (k < 0) return 'Not a right triangle, so a² + b² is not c²';
      /* the two sides that meet at the right angle, and the one across from it */
      var a2 = Math.round(Math.pow(len(S[(k + 2) % 3]), 2)), b2 = Math.round(Math.pow(len(S[k]), 2)), c2 = Math.round(Math.pow(len(S[(k + 1) % 3]), 2));
      return 'a² + b² = c²: <b>' + a2 + ' + ' + b2 + ' = ' + c2 + '</b>';
    }
    function drawGeo(W, H) {
      var G = P.g, Q = G.pts, sqs = [];
      if (G.closed && G.sq && g8 && Q.length === 3) {
        /* the square on each side, drawn outward; the board shrinks so they fit */
        var sg = areaOf(Q) > 0 ? 1 : -1;
        Q.forEach(function (p, i) {
          var q = Q[(i + 1) % 3], v = [q[0] - p[0], q[1] - p[1]], nrm = [v[1] * sg, -v[0] * sg];
          sqs.push([p, q, [q[0] + nrm[0], q[1] + nrm[1]], [p[0] + nrm[0], p[1] + nrm[1]]]);
        });
      }
      var lo = [0, 0], hi = [NP - 1, NP - 1];
      sqs.forEach(function (c) { c.forEach(function (r) { lo = [Math.min(lo[0], r[0]), Math.min(lo[1], r[1])]; hi = [Math.max(hi[0], r[0]), Math.max(hi[1], r[1])]; }); });
      var span = Math.max(hi[0] - lo[0], hi[1] - lo[1]), g = Math.max(sqs.length ? 18 : 32, Math.min(64, Math.min((W - 30) / span, (H - 30) / span))), S = span * g + 40;
      var X = function (v) { return 20 + (v - lo[0]) * g + ((span - (hi[0] - lo[0])) * g) / 2; }, Y = function (v) { return 20 + (v - lo[1]) * g + ((span - (hi[1] - lo[1])) * g) / 2; };
      var s = '<svg class="mp-dsvg mp-shsv mp-shgeo" width="' + S.toFixed(0) + '" height="' + S.toFixed(0) + '" viewBox="0 0 ' + S.toFixed(1) + ' ' + S.toFixed(1) + '" role="img" aria-label="Geoboard">';
      s += '<rect class="mp-shbd" x="' + (X(0) - 16).toFixed(1) + '" y="' + (Y(0) - 16).toFixed(1) + '" width="' + ((NP - 1) * g + 32).toFixed(1) + '" height="' + ((NP - 1) * g + 32).toFixed(1) + '" rx="14"/>';
      function pt(r) { return X(r[0]).toFixed(1) + ',' + Y(r[1]).toFixed(1); }
      if (Q.length) {
        var pts = Q.map(pt).join(' ');
        sqs.forEach(function (c) { s += '<polygon class="mp-shsq" points="' + c.map(pt).join(' ') + '"/>'; });
        s += G.closed ? '<polygon class="mp-shband" points="' + pts + '"/>' : '<polyline class="mp-shband open" points="' + pts + '"/>';
        if (G.closed && G.diag && g6 && Q.length === 4) s += '<polyline class="mp-shdiag" points="' + pt(Q[0]) + ' ' + pt(Q[2]) + '"/><polyline class="mp-shdiag" points="' + pt(Q[1]) + ' ' + pt(Q[3]) + '"/>';
        if (G.closed && g4 && shown && simple(Q)) {
          /* a small square marks each right angle */
          var A = interior(Q);
          Q.forEach(function (p, i) {
            if (Math.abs(A[i] - 90) > 0.01) return;
            var a = Q[(i + Q.length - 1) % Q.length], b = Q[(i + 1) % Q.length], v1 = [a[0] - p[0], a[1] - p[1]], v2 = [b[0] - p[0], b[1] - p[1]], k1 = 0.3 / len(v1), k2 = 0.3 / len(v2);
            var c1 = [p[0] + v1[0] * k1, p[1] + v1[1] * k1], c3 = [p[0] + v2[0] * k2, p[1] + v2[1] * k2], c2 = [c1[0] + v2[0] * k2, c1[1] + v2[1] * k2];
            s += '<polyline class="mp-shra" points="' + [c1, c2, c3].map(pt).join(' ') + '"/>';
          });
        }
      }
      for (var y = 0; y < NP; y++) for (var x = 0; x < NP; x++) {
        var on = Q.some(function (p) { return p[0] === x && p[1] === y; }), first = Q.length && Q[0][0] === x && Q[0][1] === y && !G.closed;
        s += '<circle class="mp-shpeg' + (on ? ' on' : '') + (first ? ' first' : '') + '" cx="' + X(x).toFixed(1) + '" cy="' + Y(y).toFixed(1) + '" r="' + (on ? 7 : 4.5) + '"/><circle class="mp-shhit" data-peg="' + x + ',' + y + '" cx="' + X(x).toFixed(1) + '" cy="' + Y(y).toFixed(1) + '" r="' + Math.min(18, g / 2).toFixed(1) + '"/>';
      }
      return '<div class="mp-s3w">' + s + '</svg></div>';
    }

    /* ======== tray, readout, snaps ======== */
    function blockIcon(k) {
      var q = PB[k][2], xs = q.map(function (p) { return p[0]; }), ys = q.map(function (p) { return p[1]; }), mnx = Math.min.apply(null, xs), mny = Math.min.apply(null, ys), w = Math.max.apply(null, xs) - mnx, h = Math.max.apply(null, ys) - mny, sc = 30 / Math.max(w, h, 1);
      return '<svg width="48" height="40" viewBox="-5 -3 40 34" aria-hidden="true"><polygon class="mp-shb k' + k + '" points="' + q.map(function (p) { return ((p[0] - mnx) * sc).toFixed(1) + ',' + ((h - (p[1] - mny)) * sc).toFixed(1); }).join(' ') + '"/></svg>';
    }
    function trayHtml() {
      if (P.mode === 'blocks') return '<small>Blocks</small>' + PB_ORDER.map(function (k) { return '<button type="button" class="mp-shtb" data-k="' + k + '" aria-label="Add a ' + PB[k][0] + '">' + blockIcon(k) + '<span>' + PB[k][0] + '</span></button>'; }).join('');
      return '<small>Geoboard</small><p class="mp-fknote">Tap pegs to stretch the band. Tap the first peg to close it. Drag a corner to move it.</p>';
    }
    function readout() {
      if (!shown) { read.innerHTML = ''; return; }
      var r = P.mode === 'blocks' ? blocksRead() : geoRead();
      read.innerHTML = (r[0] ? '<p class="mp-total"><span class="mp-num">' + r[0] + '</span></p>' : '') + (r[1] ? '<p class="mp-ceq">' + r[1] + '</p>' : '');
    }
    function snaps() {
      var h = '';
      if (P.mode === 'blocks') h += btn('turn', 'Turn', null, P.sel < 0) + btn('flip', 'Flip', null, P.sel < 0) + btn('del', 'Take off', null, P.sel < 0) + btn('mirror', 'Mirror', P.mirror) + btn('bclear', 'Clear', null, !P.b.length);
      else h += (g6 ? btn('diag', 'Diagonals', P.g.diag, !P.g.closed || P.g.pts.length !== 4) : '') + (g8 ? btn('sq', 'Squares on sides', P.g.sq, !P.g.closed || P.g.pts.length !== 3) : '') + btn('gclear', 'Clear', null, !P.g.pts.length);
      snapsEl.innerHTML = h;
    }
    function draw() {
      tray.innerHTML = trayHtml();
      readout();
      snaps();
      qsa('.mp-shdo [data-m]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === P.mode)); });
      var sz = size(), W = Math.max(260, sz[0]), H = Math.max(240, sz[1] - 70);
      var paint = function (h) { win.innerHTML = P.mode === 'blocks' ? drawBlocks(W, h) : drawGeo(W, h); };
      paint(H);
      var over = mat.scrollHeight - mat.clientHeight;
      if (over > 0) paint(Math.max(200, H - over - 4));
    }

    /* ---- moves ---- */
    function snapshot() { return JSON.stringify(P); }
    function act(fn) { var b = snapshot(); fn(); if (snapshot() !== b) { hist.push(b); if (hist.length > 60) hist.shift(); } draw(); change(); }
    function change() { if (o.onChange) o.onChange(state(), T); }
    function state() { return { mode: P.mode, blocks: P.b.length, corners: P.g.pts.length, closed: P.g.closed, last: last }; }
    tray.addEventListener('click', function (e) {
      var b = e.target.closest('[data-k]'); if (!b) return;
      act(function () {
        var n = P.b.length, k = b.getAttribute('data-k');
        if (n >= 60) { announce(T, 'The mat holds up to 60 blocks.'); return; }
        /* new blocks go in a loose row near the top left, so they do not land on top of each other */
        P.b.push({ k: k, x: 1.4 + (n % 6) * 1.3, y: 1.2 + Math.floor(n / 6) % 4 * 1.3, a: 0, f: false });
        P.sel = P.b.length - 1; last = 'add';
      });
    });
    qs('.mp-shdo', root).addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b) act(function () { P.mode = b.getAttribute('data-m'); last = 'mode'; }); });
    snapsEl.addEventListener('click', function (e) {
      var s = e.target.closest('.mp-snap'); if (!s) return;
      var a = s.getAttribute('data-a');
      act(function () {
        var B = P.b[P.sel];
        if (a === 'turn' && B) { B.a = (B.a + 30) % 360; snapBlock(P.sel); }
        if (a === 'flip' && B) B.f = !B.f;
        if (a === 'del' && B) { P.b.splice(P.sel, 1); P.sel = -1; }
        if (a === 'mirror') P.mirror = !P.mirror;
        if (a === 'bclear') { P.b = []; P.sel = -1; }
        if (a === 'diag') P.g.diag = !P.g.diag;
        if (a === 'sq') P.g.sq = !P.g.sq;
        if (a === 'gclear') P.g = { pts: [], closed: false, diag: P.g.diag, sq: P.g.sq };
        last = a;
      });
    });
    /* drag a block, or a corner of the band; a tap without a drag picks a block or adds a corner */
    var drag = null;
    function svgPt(e) { var sv = qs('.mp-shsv', win), b = sv.getBoundingClientRect(), vb = sv.viewBox.baseVal; return [(e.clientX - b.left) * vb.width / b.width, (e.clientY - b.top) * vb.height / b.height]; }
    win.addEventListener('pointerdown', function (e) {
      var sv = e.target.closest('.mp-shsv'); if (!sv) return;
      e.preventDefault();
      var p = svgPt(e);
      if (P.mode === 'blocks') {
        var bi = e.target.getAttribute('data-i');
        drag = { kind: 'b', i: bi == null ? -1 : +bi, p: p, moved: false, before: snapshot() };
        if (bi != null) drag.o = [P.b[+bi].x, P.b[+bi].y];
      } else {
        var peg = e.target.getAttribute('data-peg');
        if (!peg) return;
        var xy = peg.split(',').map(Number), ci = -1;
        P.g.pts.forEach(function (q, i) { if (q[0] === xy[0] && q[1] === xy[1]) ci = i; });
        drag = { kind: 'g', peg: xy, ci: ci, p: p, moved: false, before: snapshot() };
      }
      if (win.setPointerCapture) try { win.setPointerCapture(e.pointerId); } catch (er) { /* a pointer that is already gone */ }
    });
    win.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var p = svgPt(e), dx = p[0] - drag.p[0], dy = p[1] - drag.p[1];
      if (!drag.moved && Math.hypot(dx, dy) < 6) return;
      drag.moved = true;
      if (drag.kind === 'b' && drag.i >= 0) {
        var B = P.b[drag.i];
        B.x = clamp(drag.o[0] + dx / u, 0.4, view[0] - 0.4); B.y = clamp(drag.o[1] + dy / u, 0.4, view[1] - 0.4); P.sel = drag.i;
        var el = qs('[data-i="' + drag.i + '"]', win);
        if (el) el.setAttribute('points', shapeOf(B).map(function (q) { return (q[0] * u).toFixed(1) + ',' + (q[1] * u).toFixed(1); }).join(' '));
      }
      if (drag.kind === 'g' && drag.ci >= 0 && P.g.closed) {
        var hit = document.elementFromPoint(e.clientX, e.clientY), pg = hit && hit.getAttribute && hit.getAttribute('data-peg');
        if (pg) { var xy = pg.split(',').map(Number); if (!P.g.pts.some(function (q, i) { return i !== drag.ci && q[0] === xy[0] && q[1] === xy[1]; })) { P.g.pts[drag.ci] = xy; draw(); } }
      }
    });
    function endDrag() {
      if (!drag) return;
      var d = drag; drag = null;
      if (d.kind === 'b') {
        if (d.moved && d.i >= 0) snapBlock(d.i);
        else P.sel = d.i;
      } else if (!d.moved) {
        var G = P.g, xy = d.peg;
        if (!G.closed) {
          if (G.pts.length >= 3 && G.pts[0][0] === xy[0] && G.pts[0][1] === xy[1]) G.closed = true;
          else if (d.ci < 0 && G.pts.length < 12) G.pts.push(xy);
        }
      }
      if (snapshot() !== d.before) { hist.push(d.before); if (hist.length > 60) hist.shift(); }
      last = d.kind === 'b' ? (d.moved ? 'move' : 'pick') : d.moved ? 'corner' : 'peg';
      draw(); change();
    }
    win.addEventListener('pointerup', endDrag);
    win.addEventListener('pointercancel', endDrag);
    T.undo = function () { if (!hist.length) return; P = JSON.parse(hist.pop()); last = 'undo'; draw(); change(); };
    T.canUndo = function () { return hist.length > 0; };
    T.showNumbers = function (on) { shown = !!on; draw(); change(); };
    T.state = state;
    T.reset = function () { fresh(); hist = []; draw(); };
    var lw = 0;
    if (window.ResizeObserver) new ResizeObserver(function () { var w = mat.clientWidth; if (w && w !== lw) { lw = w; draw(); } }).observe(mat); else window.addEventListener('resize', draw);
    T.reset();
    return T;
  }


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
    ['areagrid', 'parts', 'Arrays and area model', '', { tool: true },
      '<g style="fill:#c25a12"><rect x="7" y="9" width="9" height="9" rx="1"/><rect x="18" y="9" width="9" height="9" rx="1"/><rect x="29" y="9" width="9" height="9" rx="1"/><rect x="7" y="20" width="9" height="9" rx="1"/><rect x="18" y="20" width="9" height="9" rx="1"/><rect x="29" y="20" width="9" height="9" rx="1"/></g><g style="fill:var(--line,#dfe5ee)"><rect x="7" y="31" width="9" height="9" rx="1"/><rect x="18" y="31" width="9" height="9" rx="1"/><rect x="29" y="31" width="9" height="9" rx="1"/></g>'],
    ['balance', 'alg', 'Balance', '', { tool: true },
      '<path d="M24 12L18 40h12Z" style="fill:var(--line,#dfe5ee)"/><path d="M8 14h32" style="stroke:var(--ink,#132039);stroke-width:3;stroke-linecap:round"/><path d="M8 14l-5 12h10ZM40 14l-5 12h10Z" style="fill:none;stroke:var(--ink2,#55627a);stroke-width:1.5;stroke-linejoin:round"/><rect x="4" y="20" width="5" height="5" rx="1" style="fill:var(--mp-ones,#e0a100)"/><path d="M36 26q4-7 8 0Z" style="fill:#8a6a3b"/>'],
    ['patterns', 'alg', 'Pattern builder', '', { tool: true },
      '<circle cx="9" cy="16" r="5" style="fill:#c0392b"/><rect x="17" y="11" width="10" height="10" rx="2" style="fill:var(--mp-hund,#2f62c4)"/><rect x="31" y="11" width="10" height="10" rx="2" style="fill:var(--mp-hund,#2f62c4)"/><rect x="6" y="34" width="6" height="6" rx="1" style="fill:var(--mp-ones,#e0a100)"/><rect x="18" y="28" width="6" height="12" rx="1" style="fill:var(--mp-ones,#e0a100)"/><rect x="30" y="22" width="6" height="18" rx="1" style="fill:var(--mp-ones,#e0a100)"/>'],
    ['tiles', 'alg', 'Algebra tiles', 'Add positive and negative tiles. Remove zero pairs.', { x2: true },
      '<rect x="5" y="9" width="20" height="20" rx="2" style="fill:var(--mp-hund,#2f62c4)"/><rect x="28" y="9" width="7" height="20" rx="1.5" style="fill:var(--mp-tens,#2f9e44)"/><rect x="38" y="9" width="7" height="7" rx="1.5" style="fill:var(--mp-ones,#e0a100)"/><rect x="38" y="20" width="7" height="7" rx="1.5" style="fill:var(--bad,#b4283f)"/>'],
    ['grid', 'space', 'Grid and robot', '', { tool: true },
      '<rect x="5" y="5" width="38" height="38" rx="4" style="fill:var(--card,#fff);stroke:var(--line,#dfe5ee);stroke-width:1.5"/><path d="M17.7 5v38M30.3 5v38M5 17.7h38M5 30.3h38" style="stroke:var(--line,#dfe5ee);stroke-width:1.5"/><path d="M11 37V24h13V11" style="fill:none;stroke:var(--accent,#0b6e78);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round"/><rect x="30" y="5.5" width="12" height="12" rx="3" style="fill:#2f62c4"/><path d="M33 13l3-4.5 3 4.5Z" style="fill:#fff"/>'],
    ['solids', 'space', '3D solids and nets', '', { tool: true },
      '<path d="M24 6L40 15V33L24 42L8 33V15Z" style="fill:var(--mp-hund,#2f62c4)"/><path d="M24 6L40 15L24 24L8 15Z" style="fill:color-mix(in srgb,var(--mp-hund,#2f62c4) 60%,#fff)"/><path d="M24 24V42L8 33V15Z" style="fill:color-mix(in srgb,var(--mp-hund,#2f62c4) 75%,#000)"/>'],
    ['geoboard', 'space', 'Shape kit', '', { tool: true },
      '<g style="fill:var(--ink,#132039)"><circle cx="10" cy="10" r="2.2"/><circle cx="24" cy="10" r="2.2"/><circle cx="38" cy="10" r="2.2"/><circle cx="10" cy="24" r="2.2"/><circle cx="24" cy="24" r="2.2"/><circle cx="38" cy="24" r="2.2"/><circle cx="10" cy="38" r="2.2"/><circle cx="24" cy="38" r="2.2"/><circle cx="38" cy="38" r="2.2"/></g><path d="M24 10L38 38H10Z" style="fill:none;stroke:#c25a12;stroke-width:2.5;stroke-linejoin:round"/>'],
    ['clock', 'meas', 'Clock', 'Move the time forward or back and see how much time has passed.', { t: 540 },
      '<circle cx="24" cy="24" r="17" style="fill:var(--card,#fff);stroke:var(--ink,#132039);stroke-width:2.5"/><path d="M24 24V12" style="stroke:var(--mp-hund,#2f62c4);stroke-width:2.5"/><path d="M24 24h8" style="stroke:var(--ink,#132039);stroke-width:3"/>'],
    ['scale', 'meas', 'Kitchen scale', 'Put 1 kg, 100 g and 10 g blocks on the scale.', {},
      '<rect x="8" y="12" width="32" height="4" rx="2" style="fill:var(--ink2,#55627a)"/><path d="M14 16h20l3 22H11Z" style="fill:var(--line,#dfe5ee);stroke:var(--ink2,#55627a);stroke-width:1.5"/><circle cx="24" cy="28" r="6" style="fill:var(--card,#fff);stroke:var(--ink,#132039);stroke-width:1.5"/><path d="M24 28l3-3" style="stroke:var(--bad,#b4283f);stroke-width:1.5"/>'],
    ['data', 'meas', 'Data and chance', '', { tool: true },
      '<path d="M6 40h36" style="stroke:var(--ink,#132039);stroke-width:2;stroke-linecap:round"/><rect x="9" y="24" width="7" height="16" rx="1.5" style="fill:#c0392b"/><rect x="20" y="12" width="7" height="28" rx="1.5" style="fill:var(--mp-hund,#2f62c4)"/><rect x="31" y="19" width="7" height="21" rx="1.5" style="fill:var(--mp-ones,#e0a100)"/>'],
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
  M.list = ['balance', 'patterns', 'data', 'grid', 'solids', 'base10', 'disks', 'clock', 'areagrid', 'scale', 'counters', 'tenframe', 'hundred', 'numberline', 'fractions', 'coins', 'geoboard', 'tiles'];
})();
