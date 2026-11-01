/* Grade 3 Fractions: a full chapter (docs/QUESTIONS.md, "Full chapters"). 6 lessons, 19 ideas, one practice skill per idea.
   Ontario 2020: B1.6 fair shares, B1.7 equivalent fractions in fair shares, B2.7 groups of 1/2, 1/3, 1/4, B2.8 unit fractions.
   Every question sets meta.k; the answer checks are in tests/verify/grade3.js (keys start with g3fr-). */
(function () {
  var A = Atlas, R = A.R, Q = A.Q, CH = 'fractions';
  var DS = [2, 3, 4, 5, 6, 8, 10];
  var ONE = { 2: 'half', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 8: 'eighth', 10: 'tenth' };
  var MANY = { 2: 'halves', 3: 'thirds', 4: 'fourths', 5: 'fifths', 6: 'sixths', 8: 'eighths', 10: 'tenths' };
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

  /* ---------- words and numbers ---------- */
  function fr(n, d) { return '<span class="fr"><span>' + n + '</span><span>' + d + '</span></span>'; }
  function mixed(w, n, d) { return n === 0 ? String(w) : w === 0 ? fr(n, d) : w + ' and ' + fr(n, d); }
  function words(n, d) { return NUMW[n] + ' ' + (n === 1 ? ONE[d] : MANY[d]); }
  function pieces(n, d) { return n + ' ' + (n === 1 ? ONE[d] : MANY[d]); }
  function many(n, one, more) { return n + ' ' + (n === 1 ? one : more); }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }
  function others(list, not) { return R.shuffle(list.filter(function (x) { return x !== not; })); }
  function plain(h) { var e = document.createElement('div'); e.innerHTML = h; return e.textContent.replace(/\s+/g, ' ').trim(); }
  /* the amount a choice shows: "2 and 1/3" -> 2.333 */
  function val(h) {
    var e = document.createElement('div'), v = 0; e.innerHTML = h;
    var f = e.querySelector('.fr');
    if (f) { var s = f.querySelectorAll('span'); v = +s[0].textContent / +s[1].textContent; f.parentNode.removeChild(f); }
    var m = e.textContent.match(/\d+/);
    return v + (m ? +m[0] : 0);
  }
  function put(o, x) { for (var k in x) o[k] = x[k]; return o; }
  function sum(n, d) { var p = []; for (var i = 0; i < n; i++) p.push(fr(1, d)); return '<span class="math">' + p.join(' + ') + '</span>'; }

  /* ---------- question builders ---------- */
  /* pick one: the right answer and up to 3 wrong ones, each made by a named mistake: wrongs = [[html, fix], ...].
     Choices that show the same amount as one already kept are left out. q.wrong holds the fixes (Atlas.Q.diag). */
  function mc(q, right, wrongs, x) {
    var seen = {}, vals = [val(right)], opts = [right], fix = {};
    seen[plain(right)] = 1;
    wrongs.forEach(function (w) {
      var t = plain(w[0]), v = val(w[0]);
      if (opts.length >= 4 || seen[t] || (x && x.byValue && vals.some(function (u) { return Math.abs(u - v) < 1e-9; }))) return;
      seen[t] = 1; vals.push(v); opts.push(w[0]); if (w[1]) fix[t] = w[1];
    });
    var o = R.shuffle(opts);
    if (x) delete x.byValue;
    return put({ q: q, type: 'mc', options: o, answer: o.indexOf(right), wrong: fix }, x || {});
  }
  /* pick one, in a fixed order (for "A, B or the same") */
  function fixed(q, opts, ans, fixes, x) { var w = {}; opts.forEach(function (o, j) { if (j !== ans && fixes[j]) w[plain(o)] = fixes[j]; }); return put({ q: q, type: 'mc', options: opts, answer: ans, wrong: w }, x); }
  function num(q, ans, fixes, x) { var w = {}; Object.keys(fixes || {}).forEach(function (k) { if (+k !== ans && k !== 'NaN') w[k] = fixes[k]; }); return put({ q: q, type: 'num', answer: ans, wrong: w }, x); }
  function tf(q, truth, right, bad, fix, x) {
    var o = R.mc(right, bad), w = {};
    w[truth ? 'False' : 'True'] = fix;
    return put({ q: q, type: 'tf', answer: truth, why: { options: o.options, answer: o.answer }, wrong: w, steps: [right], explain: right }, x);
  }
  function coin() { return Math.random() < 0.5; }

  /* ---------- pictures ---------- */
  var FILL = 'var(--strand)', EMPTY = 'var(--card)', HI = 'var(--hi)';
  function r1(v) { return Math.round(v * 10) / 10; }
  function box(x, y, w, h, fill, rx) { return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '"' + (rx ? ' rx="' + rx + '"' : '') + ' style="fill:' + fill + ';stroke:var(--ink)" stroke-width="2.5"/>'; }
  function wedge(cx, cy, r, a0, a1, fill) {
    var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    return '<path d="M' + cx + ' ' + cy + ' L' + r1(x0) + ' ' + r1(y0) + ' A' + r + ' ' + r + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + r1(x1) + ' ' + r1(y1) + ' Z" style="fill:' + fill + ';stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>';
  }
  function bar(n, d, w, label) {
    w = w || 400;
    var s = '', cw = w / d;
    for (var i = 0; i < d; i++) s += box(4 + i * cw, 4, cw, 54, i < n ? FILL : EMPTY);
    return A.svg(w + 8, 62, s, label || 'A bar in ' + d + ' equal parts, ' + n + ' shaded');
  }
  function pie(n, d, r) {
    r = r || 80;
    var s = '';
    for (var i = 0; i < d; i++) s += wedge(r + 6, r + 6, r, -Math.PI / 2 + i * 2 * Math.PI / d, -Math.PI / 2 + (i + 1) * 2 * Math.PI / d, i < n ? FILL : EMPTY);
    return A.svg(2 * r + 12, 2 * r + 12, s, 'A circle in ' + d + ' equal parts, ' + n + ' shaded');
  }
  function grid(n, d) {
    var cols = d === 6 ? 3 : d === 8 ? 4 : d === 10 ? 5 : d, rows = d / cols, cw = 260 / cols, ch = 150 / rows, s = '';
    for (var i = 0; i < d; i++) s += box(4 + (i % cols) * cw, 4 + Math.floor(i / cols) * ch, cw, ch, i < n ? FILL : EMPTY);
    return A.svg(268, 158, s, 'A rectangle in ' + d + ' equal parts, ' + n + ' shaded');
  }
  function shape(kind, n, d) { return kind === 'pie' ? pie(n, d) : kind === 'grid' ? grid(n, d) : bar(n, d); }
  /* a whole cut by weights (equal parts when every weight is the same), nothing shaded */
  function cutFig(ws, kind) {
    var tot = ws.reduce(function (a, b) { return a + b; }, 0), s = '';
    if (kind === 'pie') {
      var a = -Math.PI / 2;
      ws.forEach(function (w) { var b = a + 2 * Math.PI * w / tot; s += wedge(86, 86, 80, a, b, EMPTY); a = b; });
      return A.svg(172, 172, s, 'A circle cut into ' + ws.length + ' parts');
    }
    var sq = kind === 'square', W = sq ? 200 : 400, H = sq ? 200 : 60, x = 4;
    ws.forEach(function (w) { var cw = W * w / tot; s += box(x, 4, cw, H, EMPTY); x += cw; });
    return A.svg(W + 8, H + 8, s, 'A ' + (sq ? 'square' : 'bar') + ' cut into ' + ws.length + ' parts');
  }
  /* fair sharing in stages: each of k people has r whole bars; the rest wait below (cut: into k pieces; give: handed out) */
  function shareFig(s) {
    var k = s.k, r = s.r || 0, left = s.items - r * k, bw = 56, bh = 30, rowH = 40, lx = 40, pw = bw / k, mine = s.give ? left : 0, W = 300, out = '';
    for (var p = 0; p < k; p++) {
      var y = 4 + p * rowH, x = lx + r * (bw + 6);
      out += '<circle cx="17" cy="' + (y + 15) + '" r="13" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/><text x="17" y="' + (y + 21) + '" text-anchor="middle" font-size="15" class="tb">' + (p + 1) + '</text>';
      for (var i = 0; i < r; i++) out += box(lx + i * (bw + 6), y, bw, bh, HI, 4);
      for (var j = 0; j < mine; j++) out += box(x + j * (pw + 4), y, pw, bh, FILL, 2);
      W = Math.max(W, x + mine * (pw + 4) + 6);
    }
    var y0 = 8 + k * rowH;
    if (!s.give && left > 0) {
      for (var b = 0; b < left; b++) {
        var bx = 4 + (b % 6) * (bw + 10), by = y0 + Math.floor(b / 6) * (bh + 10);
        out += box(bx, by, bw, bh, s.cut ? FILL : HI, 4);
        if (s.cut) for (var c = 1; c < k; c++) out += '<line x1="' + r1(bx + c * pw) + '" y1="' + by + '" x2="' + r1(bx + c * pw) + '" y2="' + (by + bh) + '" style="stroke:var(--ink)" stroke-width="2"/>';
      }
      W = Math.max(W, 8 + Math.min(left, 6) * (bw + 10));
      y0 += Math.ceil(left / 6) * (bh + 10);
    }
    return A.svg(W, y0, out, s.items + ' bars and ' + k + ' people');
  }
  /* one person's share from each of two groups, drawn to the same scale */
  function compareFig(s) {
    var out = '', y = 4, W = 300;
    [['A', s.a], ['B', s.b]].forEach(function (g) {
      var items = g[1][0], k = g[1][1], w = Math.floor(items / k), l = items % k, x = 4, bw = 72;
      out += '<text x="4" y="' + (y + 18) + '" font-size="17" class="tb">' + g[0] + ': ' + many(items, 'bar', 'bars') + ', ' + k + ' people</text>';
      y += 28;
      if (s.show) {
        for (var i = 0; i < w; i++) { out += box(x, y, bw, 30, HI, 4); x += bw + 6; }
        for (var j = 0; j < l; j++) { out += box(x, y, bw / k, 30, FILL, 2); x += bw / k + 3; }
        W = Math.max(W, x + 4); y += 38;
      }
      y += 8;
    });
    return A.svg(W, y, out, 'Two groups sharing bars');
  }
  /* jumps of 1/d on a number line; only the whole numbers are labelled */
  function unitLine(n, d) {
    var x0 = 30, x1 = 530, top = Math.max(1, Math.ceil(n / d)), s = '';
    if (n > d) top = Math.max(2, top);
    var X = function (v) { return x0 + (x1 - x0) * v / (top * d); };
    s += '<line x1="' + x0 + '" y1="80" x2="' + x1 + '" y2="80" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= top * d; i++) {
      var whole = i % d === 0;
      s += '<line x1="' + r1(X(i)) + '" y1="' + (whole ? 66 : 72) + '" x2="' + r1(X(i)) + '" y2="' + (whole ? 94 : 88) + '" style="stroke:var(--ink)" stroke-width="' + (whole ? 3 : 2) + '"/>';
      if (whole) s += '<text x="' + r1(X(i)) + '" y="118" text-anchor="middle" font-size="22" class="tb">' + i / d + '</text>';
    }
    for (var k = 1; k <= n; k++) s += '<path d="M' + r1(X(k - 1)) + ' 76 Q' + r1((X(k - 1) + X(k)) / 2) + ' ' + r1(76 - Math.min(44, (X(k) - X(k - 1)) * 0.9)) + ' ' + r1(X(k)) + ' 76" fill="none" style="stroke:var(--strand)" stroke-width="3"/>';
    if (n) s += '<circle cx="' + r1(X(n)) + '" cy="80" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(560, 126, s, 'Jumps of one ' + ONE[d] + ' on a number line');
  }
  /* loose pieces, each one 1/d of a circle */
  function piecesFig(n, d) {
    var r = 30, cw = 2 * r + 14, s = '';
    for (var i = 0; i < n; i++) {
      var cx = 8 + r + (i % 6) * cw, cy = 8 + r + Math.floor(i / 6) * (2 * r + 12);
      s += wedge(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI / d, HI);
    }
    return A.svg(Math.max(200, 16 + Math.min(n, 6) * cw), 16 + Math.ceil(n / 6) * (2 * r + 12), s, n + ' pieces, each one ' + ONE[d] + ' of a circle');
  }
  /* the same pieces put together into wholes (dashed circles); a whole that is not full is lighter */
  function groupFig(n, d) {
    var s = '', r0 = 50, x = 6, g = 0;
    for (; g < Math.max(1, Math.ceil(n / d)); g++) {
      var c = Math.min(d, n - g * d), cx = x + r0, cy = r0 + 6;
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r0 + '" style="fill:none;stroke:var(--line)" stroke-width="2" stroke-dasharray="5 4"/>';
      for (var i = 0; i < c; i++) s += wedge(cx, cy, r0, -Math.PI / 2 + i * 2 * Math.PI / d, -Math.PI / 2 + (i + 1) * 2 * Math.PI / d, c === d ? FILL : HI);
      x += 2 * r0 + 14;
    }
    return A.svg(Math.max(200, x), 2 * r0 + 12, s, n + ' ' + (n === 1 ? ONE[d] : MANY[d]) + ' put together');
  }
  /* bars of the same length, one under another, for comparing */
  function bars(rows, label) {
    var s = '', w = 340, y = 4, lx = label ? 64 : 4;
    rows.forEach(function (r) {
      if (label) s += '<text x="4" y="' + (y + 31) + '" font-size="22" class="tb">' + r[0] + '/' + r[1] + '</text>';
      for (var i = 0; i < r[1]; i++) s += box(lx + i * w / r[1], y, w / r[1], 46, i < r[0] ? FILL : EMPTY);
      y += 56;
    });
    return A.svg(lx + w + 6, y, s, 'Bars of the same length');
  }
  /* sharing pizzas: each one cut into "cut" pieces; one person's share is shaded */
  function pizzas(s) {
    var r = 60, out = '', per = s.items * s.cut / s.k, k = 0;
    for (var p = 0; p < s.items; p++) for (var i = 0; i < s.cut; i++) { out += wedge(6 + r + p * (2 * r + 16), 6 + r, r, -Math.PI / 2 + i * 2 * Math.PI / s.cut, -Math.PI / 2 + (i + 1) * 2 * Math.PI / s.cut, s.show && k < per ? FILL : HI); k++; }
    return A.svg(s.items * (2 * r + 16), 2 * r + 12, out, s.items + ' pizzas, each cut into ' + s.cut);
  }
  function sym(s) { return s.sym ? '<p class="g3-sym">' + s.sym + '</p>' : ''; }
  function view(fig) { return function (s) { return '<div>' + fig(s) + sym(s) + '</div>'; }; }
  /* a Watch or My turn clip: list = [[line, change to the picture (or a list of changes), ms], ...] */
  function clip(draw, start, list) {
    return { mount: G3.view(view(draw), start), steps: list.map(function (s) {
      var st = { say: s[0], ms: s[2] || 1900 }, p = s[1];
      if (p) st.act = function (t) { return Array.isArray(p) ? t.seq(p, 650) : t.set(p, 700); };
      return st;
    }) };
  }

  /* ---------- skills: one per idea. DEF[id] = [[minLevel, shape, fn(lv), maxLevel], ...], the first is "plain" ---------- */
  var DEF = {}, SKILLS = [];
  function skill(id, name, code, list) { DEF[id] = list; SKILLS.push({ id: id, name: name, code: code }); }
  /* a "Your turn" question: one shape of the idea's own skill, at one level */
  function ck(id, shape, lv) { return function () { var s = DEF[id].filter(function (x) { return x[1] === shape; })[0], q = s[2](lv); q.shape = shape; return q; }; }
  var LV_D = { 1: [2, 3, 4], 2: [3, 4, 5, 6], 3: [5, 6, 8, 10] };

  /* ======================= Lesson 1: Equal parts ======================= */
  var EQK = { 1: ['bar'], 2: ['bar', 'square', 'pie'], 3: ['square', 'pie'] }, THING = { bar: 'bar', square: 'square', pie: 'circle', grid: 'rectangle' };
  function evenWs(n) { var a = []; for (var i = 0; i < n; i++) a.push(1); return a; }
  function unevenWs(d, lv, how) { var a = evenWs(d); a[R.int(0, d - 1)] = how === 'smaller' ? (lv === 3 ? 0.6 : 0.5) : (lv === 3 ? 1.6 : 2); return a; }
  function eqCase(lv, c, d, kind) {
    d = d || R.pick(LV_D[lv]);
    var parts = c === 'count' ? (d === 2 ? 3 : d + R.pick([-1, 1])) : d;
    return { d: d, kind: kind || R.pick(EQK[lv]), c: c, parts: parts, ws: c === 'unequal' ? unevenWs(d, lv, R.pick(['bigger', 'smaller'])) : evenWs(parts) };
  }
  /* the three answers to "is it cut into fourths?" and the fix for each wrong one */
  function eqChoices(e, yes, not, cnt) {
    var right = { yes: yes, unequal: not, count: cnt }[e.c], W = [];
    if (e.c !== 'yes') W.push([yes, e.c === 'unequal' ? 'Look at the sizes. ' + cap(MANY[e.d]) + ' must all be the same size.' : 'Count the parts again: there are ' + e.parts + '.']);
    if (e.c !== 'unequal') W.push([not, 'Look again: the parts are all the same size.']);
    if (e.c !== 'count') W.push([cnt, 'Count again: there are ' + e.d + ' parts.']);
    return [right, W];
  }
  function eqWhy(e) { return e.c === 'yes' ? e.d + ' parts, all the same size: ' + MANY[e.d] + '.' : e.c === 'unequal' ? 'The parts are not all the same size, so they are not ' + MANY[e.d] + '.' : 'The parts are equal, but there are ' + e.parts + ', not ' + e.d + '.'; }
  function eqAsk(lv) {
    var e = eqCase(lv, R.pick(['yes', 'unequal', 'count'])), c = eqChoices(e, 'Yes, ' + e.d + ' equal parts', 'No, the parts are not equal', 'No, it does not have ' + e.d + ' parts');
    return mc('Is this ' + THING[e.kind] + ' cut into <b>' + MANY[e.d] + '</b>?', c[0], c[1], { fig: cutFig(e.ws, e.kind),
      hint: 'Count the parts. Then check that they are all the same size.', steps: ['Count the parts: ' + e.ws.length + '.', 'Check the sizes.', eqWhy(e)], explain: eqWhy(e), meta: { k: 'g3fr-eq-name', ws: e.ws, d: e.d } });
  }
  var CUTS = [['a pan of bannock', 'square'], ['a granola bar', 'bar'], ['a pizza', 'pie'], ['a slab of maple fudge', 'square'], ['a quesadilla', 'pie'], ['a strip of fruit leather', 'bar']];
  skill('fr-equal', 'Equal parts or not?', 'B1.6', [
    [1, 'plain', eqAsk],
    [1, 'tap', function (lv) {
      var d = R.pick(LV_D[lv]), kind = R.pick(EQK[lv]), sets = R.shuffle([evenWs(d), unevenWs(d, lv, R.pick(['bigger', 'smaller'])), evenWs(d === 2 ? 3 : d + R.pick([-1, 1]))]), ans = 0, w = {};
      sets.forEach(function (s, i) { if (s.length === d && s.every(function (x) { return x === 1; })) ans = i; else w[String(i)] = s.length !== d ? 'Count the parts in that one: ' + s.length + '.' : 'That one has ' + d + ' parts, but they are not all the same size.'; });
      return { q: 'Tap the ' + THING[kind] + ' cut into <b>' + MANY[d] + '</b>.', type: 'tap', tiles: sets.map(function (s) { return cutFig(s, kind); }), answer: ans, answerText: 'the one with ' + d + ' equal parts', wrong: w,
        hint: 'Look for ' + d + ' parts that are all the same size.', steps: [cap(MANY[d]) + ' means ' + d + ' equal parts.', 'Count the parts, then check the sizes.'], explain: cap(MANY[d]) + ': ' + d + ' parts, all the same size.', meta: { k: 'g3fr-eq-tap', sets: sets, d: d } };
    }],
    [1, 'story', function (lv) {
      var c = lv === 1 ? CUTS[R.pick([1, 5])] : R.pick(CUTS), e = eqCase(lv, R.pick(['yes', 'unequal', 'count']), null, c[1]), who = Q.name();
      var ch = eqChoices(e, 'Yes, ' + e.d + ' equal pieces', 'No, the pieces are not equal', 'No, there are not ' + e.d + ' pieces');
      return mc(who + ' cuts ' + c[0] + ' like this. Is each piece one <b>' + ONE[e.d] + '</b>?', ch[0], ch[1], { fig: cutFig(e.ws, e.kind),
        hint: 'One ' + ONE[e.d] + ' is one of ' + e.d + ' equal pieces.', steps: ['Count the pieces: ' + e.ws.length + '.', eqWhy(e)], explain: eqWhy(e), meta: { k: 'g3fr-eq-name', ws: e.ws, d: e.d } });
    }],
    [2, 'tf', function (lv) {
      var e = eqCase(lv, coin() ? 'yes' : R.pick(['unequal', 'count'])), who = Q.name(), truth = e.c === 'yes';
      var right = truth ? 'There are ' + e.d + ' parts, and they are all the same size.' : e.c === 'unequal' ? 'The parts are not all the same size.' : 'There are ' + e.parts + ' parts, not ' + e.d + '.';
      return tf(who + ' says this ' + THING[e.kind] + ' is cut into <b>' + MANY[e.d] + '</b>. True or false: ' + who + ' is right.', truth, right,
        ['Any ' + e.d + ' pieces make ' + MANY[e.d] + '.', 'The parts only need to look a bit alike.', 'Count the lines, not the parts.'],
        truth ? 'Count the parts, then check the sizes. They are all the same.' : e.c === 'unequal' ? 'Check the sizes. ' + cap(MANY[e.d]) + ' must all be the same size.' : 'Count the parts again.',
        { fig: cutFig(e.ws, e.kind), hint: 'Count the parts. Are they all the same size?', meta: { k: 'g3fr-eq-tf', ws: e.ws, d: e.d } });
    }]
  ]);
  function tgEqual(c) {
    return function () {
      var e = eqCase(2, c === 'any' ? R.pick(['yes', 'unequal', 'count']) : c, R.pick([3, 4, 5, 6])), n = e.ws.length;
      var mx = Math.max.apply(null, e.ws), how = e.ws.every(function (x) { return x === 1; }) ? 0 : mx > 1 ? 1 : 2;
      var ch = eqChoices(e, 'Yes, ' + e.d + ' equal parts', 'No, the parts are not equal', 'No, it does not have ' + e.d + ' parts');
      var fx = {}; fx[e.d] = 'Count the parts in the picture: point to each one.';
      return { q: 'Is this ' + THING[e.kind] + ' cut into <b>' + MANY[e.d] + '</b>?', fig: cutFig(e.ws, e.kind), done: eqWhy(e), steps: [
        { prompt: 'First, count the parts.', q: num('How many parts?', n, fx, { hint: 'Touch each part as you count.', meta: { k: 'g3fr-eq-count', ws: e.ws } }) },
        { prompt: 'Now compare the sizes.', q: fixed('Are the parts the same size?', ['Yes, all the same size', 'No, one part is bigger', 'No, one part is smaller'], how,
          ['Look again: one part is not like the others.', how === 0 ? 'Look again: every part matches.' : 'Look again: is the odd one bigger or smaller?', how === 0 ? 'Look again: every part matches.' : 'Look again: is the odd one bigger or smaller?'], { hint: 'Compare each part with the others.', meta: { k: 'g3fr-eq-size', ws: e.ws } }) },
        { prompt: 'Equal parts, and the right number of them?', q: mc('So is it cut into ' + MANY[e.d] + '?', ch[0], ch[1], { hint: cap(MANY[e.d]) + ' means ' + e.d + ' equal parts.', meta: { k: 'g3fr-eq-name', ws: e.ws, d: e.d } }) }
      ] };
    };
  }

  /* ---------- Name the piece ---------- */
  function pcWrongs(d) {
    var W = others([2, 3, 4, 5, 6, 8, 10], d).slice(0, 4).map(function (x) { return x === 2 ? ['one half', 'One half means 2 equal parts. This has ' + d + '.'] : ['one ' + ONE[x], 'Count the equal parts again: there are ' + d + '.']; });
    return W;
  }
  function pcSym(d) { return [[fr(d, 1), 'The 1 part goes on top. All ' + d + ' parts go on the bottom.']].concat(others(DS, d).slice(0, 3).map(function (x) { return [fr(1, x), 'Count all the equal parts: ' + d + '.']; })); }
  var PC_KIND = { 1: ['bar', 'pie'], 2: ['bar', 'pie', 'grid'], 3: ['pie', 'grid'] };
  function pcKind(lv, d) { var k = R.pick(PC_KIND[lv]); return k === 'grid' && d < 4 ? 'bar' : k; }
  skill('fr-piece', 'Name the piece', 'B1.6', [
    [1, 'plain', function (lv) {
      var d = R.pick(LV_D[lv]), kind = pcKind(lv, d);
      return mc('This ' + THING[kind] + ' is cut into ' + d + ' equal parts. What is each part called?', 'one ' + ONE[d], pcWrongs(d), { fig: shape(kind, 1, d),
        hint: 'The number of equal parts names the piece.', steps: ['There are ' + d + ' equal parts.', 'Each part is one ' + ONE[d] + '.'], explain: d + ' equal parts: each is one ' + ONE[d] + ', ' + fr(1, d) + '.', meta: { k: 'g3fr-pc-mc', d: d } });
    }],
    [1, 'symbol', function (lv) {
      var d = R.pick(LV_D[lv]), kind = pcKind(lv, d);
      return mc('What fraction of the ' + THING[kind] + ' is shaded?', fr(1, d), pcSym(d), { fig: shape(kind, 1, d),
        hint: 'One part is shaded. How many equal parts in all?', steps: ['1 part is shaded: 1 on top.', d + ' equal parts in all: ' + d + ' on the bottom.'], explain: 'One ' + ONE[d] + ': ' + fr(1, d) + '.', meta: { k: 'g3fr-pc-mc', d: d } });
    }],
    [1, 'tap', function (lv) {
      var d = R.pick(LV_D[lv]), kind = pcKind(lv, d), ds = R.shuffle([d].concat(others(DS, d).slice(0, 2))), w = {};
      if (kind === 'grid') kind = 'bar';
      ds.forEach(function (x, i) { if (x !== d) w[String(i)] = 'That one is cut into ' + x + ' parts: one ' + ONE[x] + '.'; });
      return { q: 'Tap the picture with <b>one ' + ONE[d] + '</b> shaded.', type: 'tap', tiles: ds.map(function (x) { return shape(kind, 1, x); }), answer: ds.indexOf(d), answerText: 'the one cut into ' + d + ' equal parts', wrong: w,
        hint: 'One ' + ONE[d] + ' is one of ' + d + ' equal parts.', steps: ['Look for a whole cut into ' + d + ' equal parts.'], explain: 'One ' + ONE[d] + ': 1 of ' + d + ' equal parts.', meta: { k: 'g3fr-pc-tap', d: d } };
    }],
    [2, 'match', function (lv) {
      var ds = R.shuffle(lv === 3 ? [5, 6, 8, 10] : [2, 3, 4, 5, 6]).slice(0, 3);
      return { q: 'Match each name to its fraction.', type: 'match', pairs: ds.map(function (d) { return ['one ' + ONE[d], fr(1, d)]; }),
        hint: 'The bottom number is how many equal parts.', steps: ['One fourth: 4 equal parts, so 4 on the bottom.'], explain: ds.map(function (d) { return 'one ' + ONE[d] + ' = ' + fr(1, d); }).join(', ') + '.', meta: { k: 'g3fr-pc-match' } };
    }],
    [2, 'tf', function (lv) {
      var d = R.pick(LV_D[lv]), kind = pcKind(lv, d), who = Q.name(), truth = coin(), s = truth ? d : others(DS, d)[0];
      return tf(who + ' says each part of this ' + THING[kind] + ' is <b>one ' + ONE[s] + '</b>. True or false: ' + who + ' is right.', truth, 'There are ' + d + ' equal parts, so each is one ' + ONE[d] + '.',
        ['The name comes from the shaded part.', 'Every piece is called one half.', 'The biggest number you can see names the piece.'], 'Count the equal parts, then name the piece.',
        { fig: shape(kind, 0, d), hint: 'Count the equal parts.', meta: { k: 'g3fr-pc-tf', d: d, s: s } });
    }],
    [2, 'story', function (lv) {
      var d = R.pick(LV_D[lv]), who = Q.name(), c = R.pick(['pizza', 'bannock', 'pan of cornbread', 'pie']);
      return mc(who + ' cuts a ' + c + ' into ' + d + ' equal pieces and eats one. What fraction of the ' + c + ' is that?', fr(1, d), pcSym(d), {
        hint: 'One piece out of ' + d + ' equal pieces.', steps: [d + ' equal pieces: ' + MANY[d] + '.', 'One piece is ' + fr(1, d) + '.'], explain: 'One ' + ONE[d] + ': ' + fr(1, d) + '.', meta: { k: 'g3fr-pc-mc', d: d } });
    }]
  ]);
  function tgPiece(lv) {
    return function () {
      var d = R.pick(LV_D[lv]), c = R.pick([['pizza', 'slice', 'pie'], ['pan of bannock', 'piece', 'grid'], ['granola bar', 'piece', 'bar']]), kind = c[2] === 'grid' && d < 4 ? 'bar' : c[2];
      var fx = {}; fx[1] = 'One is shaded. Count all the equal parts.';
      return { q: 'A ' + c[0] + ' is cut into equal ' + c[1] + 's. What is one ' + c[1] + ' called?', fig: shape(kind, 1, d), done: 'Each ' + c[1] + ' is one ' + ONE[d] + ': ' + fr(1, d) + '.', steps: [
        { prompt: 'Count the equal parts.', q: num('How many equal parts?', d, fx, { hint: 'Count every part, shaded or not.', meta: { k: 'g3fr-pc-count', d: d } }) },
        { prompt: 'The number of parts names the piece.', q: mc('So one ' + c[1] + ' is one ___.', ONE[d], others(DS, d).slice(0, 3).map(function (x) { return [ONE[x], 'There are ' + d + ' parts, not ' + x + '.']; }), { hint: d + ' parts: say the name that goes with ' + d + '.', meta: { k: 'g3fr-pc-mc', d: d } }) },
        { prompt: 'Write it as a fraction.', q: mc('Which fraction is one ' + c[1] + '?', fr(1, d), pcSym(d), { hint: '1 part on top, all the parts on the bottom.', meta: { k: 'g3fr-pc-mc', d: d } }) }
      ] };
    };
  }

  /* ---------- Top and bottom numbers ---------- */
  var NM_D = { 1: [3, 4], 2: [4, 5, 6], 3: [5, 6, 8, 10] }, NM_K = { 1: ['bar', 'pie'], 2: ['bar', 'pie', 'grid'], 3: ['grid', 'pie'] };
  function nmCase(lv) { var d = R.pick(NM_D[lv]), k = R.pick(NM_K[lv]); return { d: d, n: R.int(lv === 1 ? 1 : 2, d - 1), kind: k === 'grid' && d < 4 ? 'bar' : k }; }
  function nmWrongs(n, d) {
    var W = [[fr(d, n), 'Flipped. The bottom number counts all the parts.'], [fr(d - n, d), 'That counts the white parts. The top counts the shaded ones.'], [fr(n, DS[DS.indexOf(d) + 1] || 8), 'Count all the parts again: ' + d + '.']];
    if (d - n !== n) W.splice(1, 0, [fr(n, d - n), 'The bottom counts all the parts, shaded and white.']);
    return W;
  }
  skill('fr-name', 'Top and bottom numbers', 'B1.6', [
    [1, 'plain', function (lv) {
      var c = nmCase(lv);
      return mc('What fraction of the ' + THING[c.kind] + ' is shaded?', fr(c.n, c.d), nmWrongs(c.n, c.d), { fig: shape(c.kind, c.n, c.d),
        hint: 'Bottom: all the equal parts. Top: the shaded parts.', steps: ['Count all the equal parts: ' + c.d + '. That is the bottom number.', 'Count the shaded parts: ' + c.n + '. That is the top number.'], explain: fr(c.n, c.d) + ', ' + words(c.n, c.d) + ', is shaded.', meta: { k: 'g3fr-nm-mc', n: c.n, d: c.d } });
    }],
    [1, 'fill', function (lv) {
      var c = nmCase(lv), w = {};
      w[c.d + ', ' + c.n] = 'Flipped: first the shaded parts, then all the parts.';
      return { q: 'Look at the picture. Fill in the blanks.', type: 'fill', fig: shape(c.kind, c.n, c.d), fill: 'Shaded: [[]] of [[]] equal parts', answers: [c.n, c.d], wrong: w,
        hint: 'Count the shaded parts first. Then count all the parts.', steps: [G3.pl(c.n, 'part is', 'parts are') + ' shaded.', 'There are ' + c.d + ' equal parts in all.'], explain: c.n + ' of ' + c.d + ': ' + fr(c.n, c.d) + '.', meta: { k: 'g3fr-nm-fill' } };
    }],
    [1, 'tap', function (lv) {
      var c = nmCase(lv), kind = c.kind === 'grid' ? 'bar' : c.kind, set = [[c.n, c.d]], w = {};
      R.shuffle([[c.d - c.n, c.d], [c.n, c.d === 10 ? 8 : c.d + (c.d === 4 ? 2 : 1)], [c.n + 1, c.d], [c.n - 1, c.d]]).forEach(function (p) {
        if (set.length < 3 && p[0] >= 1 && p[0] < p[1] && DS.indexOf(p[1]) >= 0 && !set.some(function (s) { return s[0] === p[0] && s[1] === p[1]; })) set.push(p);
      });
      set = R.shuffle(set);
      var ans = 0;
      set.forEach(function (p, i) { if (p[0] === c.n && p[1] === c.d) ans = i; else w[String(i)] = 'That one shows ' + p[0] + ' of ' + p[1] + ' parts shaded.'; });
      return { q: 'Tap the picture that shows ' + fr(c.n, c.d) + '.', type: 'tap', tiles: set.map(function (p) { return shape(kind, p[0], p[1]); }), answer: ans, answerText: 'the one with ' + c.n + ' of ' + c.d + ' parts shaded', wrong: w,
        hint: 'Look for ' + c.d + ' equal parts in all, with ' + c.n + ' shaded.', steps: ['Bottom number ' + c.d + ': ' + c.d + ' equal parts.', 'Top number ' + c.n + ': ' + c.n + ' shaded.'], explain: fr(c.n, c.d) + ' is ' + c.n + ' of ' + c.d + ' equal parts.', meta: { k: 'g3fr-nm-tap', n: c.n, d: c.d } };
    }],
    [2, 'not', function (lv) {
      var c = nmCase(lv), u = c.d - c.n;
      return mc('What fraction of the ' + THING[c.kind] + ' is <b>not</b> shaded?', fr(u, c.d), [[fr(c.n, c.d), 'That is the shaded part. Count the white parts.'], [fr(c.d, u), 'Flipped. The bottom number counts all the parts.'], [u === c.n ? fr(u, DS[DS.indexOf(c.d) + 1] || 8) : fr(u, c.n), u === c.n ? 'Count all the parts again: ' + c.d + '.' : 'The bottom counts all the parts, not just the shaded ones.']], { fig: shape(c.kind, c.n, c.d),
        hint: 'Count the white parts for the top number.', steps: [c.d + ' parts in all.', u + ' are not shaded.'], explain: fr(u, c.d) + ' is not shaded.', meta: { k: 'g3fr-nm-not', n: u, d: c.d } });
    }],
    [2, 'match', function (lv) {
      var used = {}, pairs = [];
      while (pairs.length < 3) { var c = nmCase(lv), key = c.n + '/' + c.d; if (used[key]) continue; used[key] = 1; pairs.push([words(c.n, c.d), fr(c.n, c.d)]); }
      return { q: 'Match the words to the fraction.', type: 'match', pairs: pairs, hint: 'The first word is the top number. The piece name tells the bottom number.', steps: ['Three fifths: 3 on top, 5 on the bottom.'],
        explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'g3fr-nm-match' } };
    }],
    [2, 'tf', function (lv) {
      var c = nmCase(lv), who = Q.name(), truth = coin(), s = truth ? [c.n, c.d] : R.pick([[c.d, c.n], [c.n, c.d - c.n], [c.d - c.n, c.d]]);
      if (!truth && s[0] === c.n && s[1] === c.d) s = [c.d, c.n];
      var right = c.d + ' equal parts in all, and ' + c.n + ' are shaded. So ' + fr(c.n, c.d) + ' is shaded.';
      return tf(who + ' says ' + fr(s[0], s[1]) + ' of this ' + THING[c.kind] + ' is shaded. True or false: ' + who + ' is right.', truth, right,
        ['The bottom number counts the white parts.', 'The bigger number always goes on top.', 'The top number counts all the parts.'], 'Check: all the parts go on the bottom, the shaded ones on top.',
        { fig: shape(c.kind, c.n, c.d), hint: 'The bottom number counts all the equal parts.', meta: { k: 'g3fr-nm-tf', n: c.n, d: c.d, s: s } });
    }]
  ]);
  function tgName(lv) {
    return function () {
      var c = nmCase(lv), f1 = {}, f2 = {};
      f1[c.n] = 'That is the shaded parts. Count all of them.'; f2[c.d] = 'That is all the parts. Count only the shaded ones.'; f2[c.d - c.n] = 'Those are the white parts.';
      return { q: 'What fraction of the ' + THING[c.kind] + ' is shaded?', fig: shape(c.kind, c.n, c.d), done: fr(c.n, c.d) + ', ' + words(c.n, c.d) + '.', steps: [
        { prompt: 'Count all the equal parts.', q: num('How many parts in all?', c.d, f1, { hint: 'Count shaded and white parts.', meta: { k: 'g3fr-nm-all', n: c.n, d: c.d } }) },
        { prompt: 'Now count the shaded parts.', q: num('How many are shaded?', c.n, f2, { hint: 'Count only the coloured parts.', meta: { k: 'g3fr-nm-shaded', n: c.n, d: c.d } }) },
        { prompt: 'Shaded on top, all the parts on the bottom.', q: mc('Which fraction is shaded?', fr(c.n, c.d), nmWrongs(c.n, c.d), { hint: c.n + ' on top, ' + c.d + ' on the bottom.', meta: { k: 'g3fr-nm-mc', n: c.n, d: c.d } }) }
      ] };
    };
  }

  /* ======================= Lesson 2: Fair shares ======================= */
  var DL_K = { 1: [2, 3, 4], 2: [2, 3, 4, 5, 6], 3: [5, 6, 8, 10] }, DL_MAX = { 1: 12, 2: 16, 3: 20 };
  function dealCase(lv) { var k = R.pick(DL_K[lv]), items = R.int(k + (lv === 3 ? 2 : 1), DL_MAX[lv]); return { k: k, items: items, w: Math.floor(items / k), l: items % k }; }
  function dealSteps(c) { return [c.k + ' &times; ' + c.w + ' = ' + c.k * c.w + '. Each person gets ' + many(c.w, 'whole bar', 'whole bars') + '.', c.items + ' &minus; ' + c.k * c.w + ' = ' + c.l + ' left over.']; }
  function dealSay(c) { return 'Each person gets ' + many(c.w, 'whole bar', 'whole bars') + ', and ' + (c.l ? c.l + ' ' + (c.l === 1 ? 'is' : 'are') + ' left over.' : 'nothing is left over.'); }
  function wholeFix(c) { var f = {}; f[c.w + 1] = c.k + ' &times; ' + (c.w + 1) + ' = ' + c.k * (c.w + 1) + '. That is more than ' + c.items + '.'; if (c.w > 1) f[c.w - 1] = 'There are enough left for one more round.'; f[c.items - c.k] = 'Do not take away the people. Hand out one round at a time.'; return f; }
  skill('fr-deal', 'Hand out wholes first', 'B1.6', [
    [1, 'plain', function (lv) {
      var c = dealCase(lv), w = {};
      if (c.w > 1) w[(c.w - 1) + ', ' + (c.l + c.k)] = 'There are still enough left for another round: ' + (c.l + c.k) + ' bars and ' + c.k + ' people.';
      return { q: 'Share ' + c.items + ' granola bars equally among ' + c.k + ' people. Hand out whole bars only.', type: 'fill', fig: lv === 1 ? shareFig(c) : '', fill: 'Whole bars each: [[]]<br>Left over: [[]]', answers: [c.w, c.l], wrong: w,
        hint: 'Give one bar to each person, again and again, while you can.', steps: dealSteps(c), explain: dealSay(c), meta: { k: 'g3fr-dl-fill', items: c.items, k2: c.k } };
    }],
    [1, 'whole', function (lv) {
      var c = dealCase(lv);
      return mc('Share ' + c.items + ' granola bars equally among ' + c.k + ' people. How many whole bars does each person get?', String(c.w),
        [[String(c.w + 1), 'Check: ' + c.k + ' &times; ' + (c.w + 1) + ' = ' + c.k * (c.w + 1) + '. That is more than ' + c.items + '.'], [String(c.w - 1), 'There are enough left for one more round.'], [String(c.items - c.k), 'Do not take away the people. Hand out one round at a time.'], [String(c.w + 2), 'Check: ' + c.k + ' &times; ' + (c.w + 2) + ' is too many.']].filter(function (x) { return +x[0] > 0; }),
        { fig: lv === 1 ? shareFig(c) : '', hint: 'Count rounds: one bar to each person each round.', steps: dealSteps(c), explain: dealSay(c), meta: { k: 'g3fr-dl-whole', items: c.items, k2: c.k } });
    }, 2],
    [2, 'story', function (lv) {
      var c = dealCase(lv), who = Q.name(), t = R.pick(['maple taffy sticks', 'apples', 'granola bars', 'oranges', 'crackers']);
      function o(w, l) { return w + ' each, ' + l + ' left'; }
      var W = [[o(c.w - 1, c.l + c.k), 'There are enough left for another round.'], [o(c.w + 1, Math.max(0, c.items - c.k * (c.w + 1))), 'There are not enough for ' + (c.w + 1) + ' each.'], [o(c.l, c.w), 'Swapped. Hand out whole ones first, then count what is left.'], [o(c.w, c.l + 1), 'Count what is left again: ' + c.items + ' &minus; ' + c.k * c.w + '.']];
      return mc(who + ' shares ' + c.items + ' ' + t + ' equally with ' + many(c.k - 1, 'friend', 'friends') + '. That is ' + c.k + ' people. How many does each person get, and how many are left?', o(c.w, c.l), W.filter(function (x) { return !/-/.test(x[0]); }),
        { hint: 'Hand out one to each person, again and again, while you can.', steps: dealSteps(c), explain: o(c.w, c.l) + ' over.', meta: { k: 'g3fr-dl-story', items: c.items, k2: c.k } });
    }],
    [2, 'tf', function (lv) {
      var c = dealCase(lv), who = Q.name(), truth = coin(), sw = c.w, sl = c.l;
      if (!truth) { if (c.w > 1 && coin()) { sw = c.w - 1; sl = c.l + c.k; } else { sl = c.l + 1 < c.k ? c.l + 1 : c.l - 1; if (sl < 0) { sw = c.w - 1; sl = c.l + c.k; } } }
      return tf(c.items + ' bars are shared among ' + c.k + ' people. ' + who + ' says each person gets <b>' + sw + '</b> and <b>' + sl + '</b> ' + (sl === 1 ? 'is' : 'are') + ' left over. True or false: ' + who + ' is right.', truth,
        c.k + ' &times; ' + c.w + ' = ' + c.k * c.w + ', and ' + c.items + ' &minus; ' + c.k * c.w + ' = ' + c.l + '. So ' + c.w + ' each, ' + c.l + ' left.', ['Stop handing out while there are still lots of bars.', 'Give all the leftovers to one person.', 'There is always 1 left over.'],
        'Check: ' + c.k + ' &times; ' + c.w + ' = ' + c.k * c.w + '. How many are left?', { hint: 'Can everyone get one more?', meta: { k: 'g3fr-dl-tf', items: c.items, k2: c.k, w: sw, l: sl } });
    }],
    [3, 'times', function (lv) {
      var c = dealCase(lv);
      return { q: 'Share ' + c.items + ' bars equally among ' + c.k + ' people. Use multiplication.', type: 'fill', fill: c.k + ' &times; [[]] = [[]], with [[]] left over', answers: [c.w, c.k * c.w, c.l],
        hint: 'Which ' + c.k + 's fact gets closest to ' + c.items + ' without going over?', steps: dealSteps(c), explain: dealSay(c), meta: { k: 'g3fr-dl-times', items: c.items, k2: c.k } };
    }]
  ]);
  function tgDeal(lv) {
    return function () {
      var c = dealCase(lv), f3 = {};
      f3[c.k * c.w] = 'That is how many were handed out. Take it from ' + c.items + '.';
      return { q: 'Share ' + c.items + ' granola bars equally among ' + c.k + ' people.', fig: shareFig(c), done: dealSay(c), steps: [
        { prompt: 'Hand out one bar to each person, again and again.', q: num('How many whole bars does each person get?', c.w, wholeFix(c), { hint: 'Count by ' + c.k + 's up to ' + c.items + '.', meta: { k: 'g3fr-dl-whole', items: c.items, k2: c.k } }) },
        { prompt: 'Check: people times bars each.', q: num(c.k + ' &times; ' + c.w + ' = ?', c.k * c.w, {}, { hint: 'Skip count by ' + c.k + '.', meta: { k: 'g3fr-mul', a: c.k, b: c.w } }) },
        { prompt: 'Take that from the bars you started with.', q: num('How many bars are left over?', c.l, f3, { hint: c.items + ' &minus; ' + c.k * c.w + '.', meta: { k: 'g3fr-dl-left', items: c.items, k2: c.k } }) }
      ] };
    };
  }

  /* ---------- Cut the leftovers ---------- */
  var SH_K = { 1: [2, 3], 2: [2, 3, 4, 5], 3: [4, 5, 6, 8, 10] }, SH_MAX = { 1: 9, 2: 14, 3: 20 };
  function shCase(lv) { var k = R.pick(SH_K[lv]), items; do { items = R.int(k + 1, SH_MAX[lv]); } while (items % k === 0 || (lv === 3 && items % k === 1 && coin())); return { k: k, items: items, w: Math.floor(items / k), l: items % k }; }
  function shWrongs(c) {
    var W = [[mixed(c.w, c.l, c.items), 'Cut each leftover into ' + c.k + ' pieces, one for each person, not ' + c.items + '.']];
    if (c.w < c.k && c.w !== c.l) W.push([mixed(c.l, c.w, c.k), 'Wholes first: ' + c.w + ' whole each. Then the pieces.']);
    if (c.l > 1) W.push([mixed(c.w, 1, c.k), 'Each leftover gives everyone a piece. ' + c.l + ' left, so ' + c.l + ' pieces each.']);
    W.push([String(c.w), 'Do not forget the leftovers. Cut them and share them too.']);
    W.push([String(c.w + 1), 'There are not enough for ' + (c.w + 1) + ' whole ones each.']);
    return W;
  }
  function shSteps(c) { return [c.k + ' &times; ' + c.w + ' = ' + c.k * c.w + '. Each person gets ' + many(c.w, 'whole bar', 'whole bars') + '.', many(c.l, 'bar is', 'bars are') + ' left. Cut ' + (c.l > 1 ? 'each one' : 'it') + ' into ' + MANY[c.k] + '.', 'Each person gets ' + pieces(c.l, c.k) + ' more: ' + mixed(c.w, c.l, c.k) + '.<div class="fig">' + shareFig({ items: c.items, k: c.k, r: c.w, give: true }) + '</div>']; }
  function cutFix(c) { var f = {}; f[c.items] = 'That is the number of bars. Cut so each person gets a piece: ' + c.k + ' pieces.'; f[c.l] = 'Cut for the people, not for the leftover bars.'; return f; }
  skill('fr-share', 'Cut the leftovers', 'B1.6', [
    [1, 'plain', function (lv) {
      var c = shCase(lv);
      return mc('Share ' + c.items + ' granola bars equally among ' + c.k + ' people. How much does each person get?', mixed(c.w, c.l, c.k), shWrongs(c), { byValue: true, fig: lv === 1 ? shareFig(c) : '',
        hint: 'Hand out whole bars first. Then cut each leftover bar into ' + MANY[c.k] + '.', steps: shSteps(c), explain: 'Each person gets ' + mixed(c.w, c.l, c.k) + ' bars.', meta: { k: 'g3fr-share', items: c.items, k2: c.k } });
    }],
    [1, 'pieces', function (lv) {
      var c = shCase(lv);
      return num('Share ' + c.items + ' bars among ' + c.k + ' people. Each person gets ' + many(c.w, 'whole bar', 'whole bars') + '. Each leftover bar is cut into how many pieces?', c.k, cutFix(c), { fig: lv === 1 ? shareFig({ items: c.items, k: c.k, r: c.w }) : '',
        hint: 'Every person needs a piece of each leftover bar.', steps: ['There are ' + c.k + ' people.', 'So each leftover bar is cut into ' + c.k + ' pieces: ' + MANY[c.k] + '.'], explain: c.k + ' people, so ' + c.k + ' pieces: ' + MANY[c.k] + '.', meta: { k: 'g3fr-sh-cut', k2: c.k } });
    }, 2],
    [2, 'fill', function (lv) {
      var c = shCase(lv), w = {};
      if (c.l > 1) w[c.w + ', 1'] = 'One piece from each leftover bar: ' + c.l + ' pieces.';
      return { q: 'Share ' + c.items + ' bars equally among ' + c.k + ' people. Fill in the blanks.', type: 'fill', fill: 'Whole bars: [[]]<br>Pieces of ' + fr(1, c.k) + ': [[]]', answers: [c.w, c.l], wrong: w,
        hint: 'Whole bars first. Then cut each leftover into ' + MANY[c.k] + '.', steps: shSteps(c), explain: 'Each person gets ' + mixed(c.w, c.l, c.k) + '.', meta: { k: 'g3fr-dl-fill', items: c.items, k2: c.k } };
    }],
    [2, 'story', function (lv) {
      var c = shCase(lv), who = Q.name(), t = R.pick(['pancakes', 'bannock loaves', 'pizzas', 'sandwiches']);
      return mc(who + ' and ' + many(c.k - 1, 'friend', 'friends') + ' share ' + c.items + ' ' + t + ' equally. How much does each of the ' + c.k + ' people get?', mixed(c.w, c.l, c.k), shWrongs(c), { byValue: true,
        hint: 'Whole ones first. Then cut what is left into ' + MANY[c.k] + '.', steps: shSteps(c), explain: 'Each person gets ' + mixed(c.w, c.l, c.k) + ' ' + t + '.', meta: { k: 'g3fr-share', items: c.items, k2: c.k } });
    }],
    [2, 'match', function (lv) {
      var pairs = [], seen = {};
      while (pairs.length < 3) { var c = shCase(lv), v = c.items / c.k; if (seen[v.toFixed(5)]) continue; seen[v.toFixed(5)] = 1; pairs.push([c.items + ' bars, ' + c.k + ' people', mixed(c.w, c.l, c.k)]); }
      return { q: 'Match each fair share to what one person gets.', type: 'match', pairs: pairs, hint: 'Whole bars first, then the leftover pieces.', steps: ['5 bars, 2 people: 2 whole each, and the last bar is cut in half.'],
        explain: 'Whole bars first, then the pieces of the leftovers.', meta: { k: 'g3fr-sh-match' } };
    }],
    [3, 'tf', function (lv) {
      var c = shCase(lv), who = Q.name(), truth = coin(), s = [c.w, c.l, c.k];
      if (!truth) s = R.pick([[c.w, c.l, c.items], c.l > 1 ? [c.w, 1, c.k] : [c.w + 1, 0, 1], [c.w, 0, 1]]);
      var said = s[2] === 1 ? String(s[0]) : mixed(s[0], s[1], s[2]);
      return tf(who + ' shares ' + c.items + ' bars among ' + c.k + ' people. ' + who + ' says each person gets <b>' + said + '</b>. True or false: ' + who + ' is right.', truth,
        c.w + ' whole each, then ' + c.l + ' leftover ' + (c.l === 1 ? 'bar' : 'bars') + ' cut into ' + MANY[c.k] + ': ' + mixed(c.w, c.l, c.k) + '.', ['Cut the leftovers into as many pieces as there are bars.', 'Each person gets just one piece in all.', 'Leftover bars are not shared.'],
        'Work it out: wholes first, then cut the leftovers into ' + MANY[c.k] + '.', { hint: 'Wholes first, then the pieces.', meta: { k: 'g3fr-sh-tf', items: c.items, k2: c.k, said: s } });
    }]
  ]);
  function tgCut(lv) {
    return function () {
      var c = shCase(lv), f2 = {};
      f2[c.items] = 'That is all the bars. Take away the ones handed out.';
      return { q: 'Share ' + c.items + ' granola bars equally among ' + c.k + ' people.', fig: shareFig(c), done: 'Each person gets ' + mixed(c.w, c.l, c.k) + ' bars.', steps: [
        { prompt: 'Hand out whole bars first.', q: num('How many whole bars each?', c.w, wholeFix(c), { hint: 'Count by ' + c.k + 's.', meta: { k: 'g3fr-dl-whole', items: c.items, k2: c.k } }) },
        { prompt: 'Count what is left.', q: num('How many are left over?', c.l, f2, { hint: c.items + ' &minus; ' + c.k * c.w + '.', meta: { k: 'g3fr-dl-left', items: c.items, k2: c.k } }) },
        { prompt: 'One piece for each person.', q: num('Cut each leftover into how many pieces?', c.k, cutFix(c), { hint: 'How many people share?', meta: { k: 'g3fr-sh-cut', k2: c.k } }) },
        { prompt: 'Wholes, then the pieces.', q: mc('How much does each person get?', mixed(c.w, c.l, c.k), shWrongs(c), { byValue: true, hint: c.w + ' whole and ' + c.l + ' piece' + (c.l > 1 ? 's' : '') + ' of ' + fr(1, c.k) + '.', meta: { k: 'g3fr-share', items: c.items, k2: c.k } }) }
      ] };
    };
  }

  /* ---------- Fewer things than people ---------- */
  var FW_K = { 1: [2, 3, 4], 2: [3, 4, 5, 6], 3: [5, 6, 8, 10] };
  function fwCase(lv) { var k = R.pick(FW_K[lv]); return { k: k, items: R.int(lv === 3 ? 2 : 1, k - 1) }; }
  function fwWrongs(c) {
    var n = c.items, k = c.k, W = [];
    if (n > 1) W.push([fr(k, n), 'Flipped. Each person gets less than a whole one.'], [fr(1, k), 'Each one gives everyone a piece. ' + n + ' to share, so ' + n + ' pieces each.'], [fr(1, n), 'Cut each one into ' + k + ' pieces, one for each person.']);
    others(DS, k).slice(0, 3).forEach(function (x) { if (n < x) W.push([fr(n, x), 'Count the people: ' + k + '. Cut into ' + MANY[k] + '.']); });
    return W;
  }
  function fwSteps(c) { return ['There are not enough bars for one each, so cut every bar into ' + c.k + ' pieces.', 'Each person takes one piece from each bar: ' + pieces(c.items, c.k) + '.', 'That is ' + fr(c.items, c.k) + ' of a bar.<div class="fig">' + shareFig({ items: c.items, k: c.k, give: true }) + '</div>']; }
  skill('fr-fewer', 'Fewer things than people', 'B1.6', [
    [1, 'plain', function (lv) {
      var c = fwCase(lv);
      return mc('Share ' + many(c.items, 'granola bar', 'granola bars') + ' equally among ' + c.k + ' people. How much does each person get?', fr(c.items, c.k), fwWrongs(c), { byValue: true, fig: lv === 1 ? shareFig(c) : '',
        hint: 'Cut every bar into ' + c.k + ' pieces. Each person takes one piece from each bar.', steps: fwSteps(c), explain: 'Each person gets ' + fr(c.items, c.k) + ' of a bar.', meta: { k: 'g3fr-share', items: c.items, k2: c.k } });
    }],
    [1, 'fill', function (lv) {
      var c = fwCase(lv), w = {};
      w[c.items + ', ' + c.k] = 'Cut by the number of people: ' + c.k + ' pieces. Each person gets one piece from each bar.';
      return { q: 'Share ' + many(c.items, 'bar', 'bars') + ' equally among ' + c.k + ' people. Fill in the blanks.', type: 'fill', fig: lv === 1 ? shareFig(c) : '', fill: 'Cut each bar into [[]] pieces.<br>Each person gets [[]] pieces.', answers: [c.k, c.items], wrong: w,
        hint: 'One piece of every bar for each person.', steps: fwSteps(c), explain: 'Each person gets ' + pieces(c.items, c.k) + ': ' + fr(c.items, c.k) + '.', meta: { k: 'g3fr-fw-fill', items: c.items, k2: c.k } };
    }],
    [2, 'tap', function (lv) {
      var c = fwCase(lv), set = [[c.items, c.k]], w = {};
      R.shuffle([[1, c.k], [c.items, R.pick(others(DS, c.k).filter(function (x) { return x > c.items; }))], [c.k - c.items, c.k], [c.items + 1, c.k]]).forEach(function (p) {
        if (set.length < 3 && p[1] && p[0] >= 1 && p[0] < p[1] && !set.some(function (s) { return s[0] * p[1] === p[0] * s[1]; })) set.push(p);
      });
      set = R.shuffle(set);
      var ans = 0;
      set.forEach(function (p, i) { if (p[0] === c.items && p[1] === c.k) ans = i; else w[String(i)] = 'That shows ' + fr(p[0], p[1]) + ' of a bar.'; });
      return { q: many(c.items, 'bar is', 'bars are') + ' shared equally among ' + c.k + ' people. Tap one person\'s share of a bar.', type: 'tap', tiles: set.map(function (p) { return bar(p[0], p[1], 300); }), answer: ans, answerText: 'the bar with ' + c.items + ' of ' + c.k + ' parts shaded', wrong: w,
        hint: 'Each person gets one ' + ONE[c.k] + ' from each bar.', steps: fwSteps(c), explain: 'One share is ' + fr(c.items, c.k) + ' of a bar.', meta: { k: 'g3fr-fw-tap', items: c.items, k2: c.k } };
    }],
    [2, 'story', function (lv) {
      var c = fwCase(lv), t = R.pick([['pizzas', 'pizza'], ['bannock loaves', 'loaf'], ['pans of brownies', 'pan']]), place = R.pick(['On a canoe trip', 'After hockey practice', 'At the class picnic']);
      return mc(place + ', ' + c.k + ' friends share ' + c.items + ' ' + (c.items === 1 ? t[1] : t[0]) + ' equally. How much does each friend get?', fr(c.items, c.k), fwWrongs(c), { byValue: true,
        hint: 'Cut each ' + t[1] + ' into ' + c.k + ' pieces.', steps: fwSteps(c), explain: 'Each friend gets ' + fr(c.items, c.k) + ' of a ' + t[1] + '.', meta: { k: 'g3fr-share', items: c.items, k2: c.k } });
    }],
    [3, 'tf', function (lv) {
      var c = fwCase(lv), who = Q.name(), truth = coin(), s = truth ? [c.items, c.k] : R.pick([[1, c.k], [1, c.items], [c.items, c.k + c.items]]);
      return tf(who + ' says that when ' + c.items + ' pizzas are shared equally among ' + c.k + ' people, each gets ' + fr(s[0], s[1]) + ' of a pizza. True or false: ' + who + ' is right.', truth,
        'Cut each pizza into ' + MANY[c.k] + '. Each person gets one piece from each pizza: ' + fr(c.items, c.k) + '.', ['Each person gets one piece in all.', 'Cut by the number of pizzas.', 'Add the pizzas and the people for the bottom number.'],
        'Cut each pizza into ' + c.k + ' pieces. How many pieces does each person get?', { hint: 'How many pieces does each person get?', meta: { k: 'g3fr-fw-tf', items: c.items, k2: c.k, s: s } });
    }]
  ]);
  function tgFewer(lv) {
    return function () {
      var c = fwCase(lv), f1 = {}, f2 = {};
      f1[c.items] = 'Cut for the people, not for the bars.'; f2[1] = 'One piece from each bar, and there are ' + c.items + ' bars.';
      return { q: 'Share ' + many(c.items, 'granola bar', 'granola bars') + ' equally among ' + c.k + ' people.', fig: shareFig(c), done: 'Each person gets ' + fr(c.items, c.k) + ' of a bar.', steps: [
        { prompt: 'Not enough for one each, so cut.', q: num('Cut each bar into how many pieces?', c.k, f1, { hint: 'One piece for each person.', meta: { k: 'g3fr-sh-cut', k2: c.k } }) },
        { prompt: 'Each person takes one piece from every bar.', q: num('How many pieces does each person get?', c.items, f2, { hint: 'How many bars are there?', meta: { k: 'g3fr-fw-count', items: c.items, k2: c.k } }) },
        { prompt: 'Name the share.', q: mc('How much does each person get?', fr(c.items, c.k), fwWrongs(c), { byValue: true, hint: c.items + ' pieces, each one ' + ONE[c.k] + '.', meta: { k: 'g3fr-share', items: c.items, k2: c.k } }) }
      ] };
    };
  }

  /* ---------- Compare two shares ---------- */
  function share(items, k) { return mixed(Math.floor(items / k), items % k, k); }
  function cmpCase(lv) {
    var a, b;
    for (;;) {
      if (lv === 1) { var n = R.int(1, 3), ks = R.shuffle([2, 3, 4, 6]); a = [n, ks[0]]; b = [n, ks[1]]; }
      else if (lv === 2) { if (coin()) { var k = R.pick([2, 3, 4, 5]), is = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]); a = [is[0], k]; b = [is[1], k]; } else { var m = R.int(2, 12), k2 = R.shuffle([2, 3, 4, 5, 6]); a = [m, k2[0]]; b = [m, k2[1]]; } }
      else {
        a = [R.int(2, 20), R.pick(DS)]; b = [R.int(2, 20), R.pick(DS)];
        var same = a[0] * b[1] === b[0] * a[1], wa = Math.floor(a[0] / a[1]), wb = Math.floor(b[0] / b[1]);
        if (a[1] === b[1] || a[0] === b[0] || !(same || wa !== wb)) continue;
      }
      if (lv < 3 && a[0] * b[1] === b[0] * a[1]) continue;
      return { a: a, b: b, c: a[0] * b[1] > b[0] * a[1] ? 0 : a[0] * b[1] < b[0] * a[1] ? 1 : 2 };
    }
  }
  function cmpFixes(c, na, nb) {
    var why = 'Work out each share: ' + (na || 'A') + ' get' + (na ? '' : 's') + ' ' + share(c.a[0], c.a[1]) + ', ' + (nb || 'B') + ' get' + (nb ? '' : 's') + ' ' + share(c.b[0], c.b[1]) + '.';
    var grp = c.a[0] === c.b[0] ? 'More people share the same bars, so each share is smaller.' : c.a[1] === c.b[1] ? 'The same number of people: more bars means more each.' : why;
    return [grp, grp, why];
  }
  function cmpSteps(c) { return ['A: ' + c.a[0] + ' among ' + c.a[1] + ' is ' + share(c.a[0], c.a[1]) + ' each.', 'B: ' + c.b[0] + ' among ' + c.b[1] + ' is ' + share(c.b[0], c.b[1]) + ' each.', '<div class="fig">' + compareFig({ a: c.a, b: c.b, show: true }) + '</div>']; }
  function cmpSay(c) { return c.c === 2 ? 'Each person gets the same.' : 'Each person in ' + (c.c ? 'B' : 'A') + ' gets more: ' + share(c.c ? c.b[0] : c.a[0], c.c ? c.b[1] : c.a[1]) + '.'; }
  var CMP_OPTS = ['Group A', 'Group B', 'Each gets the same'];
  function cmpAsk(c) { return 'Group A shares ' + many(c.a[0], 'bar', 'bars') + ' among ' + c.a[1] + ' people. Group B shares ' + many(c.b[0], 'bar', 'bars') + ' among ' + c.b[1] + ' people. In which group does each person get more?'; }
  skill('fr-cmpshare', 'Who gets more?', 'B1.6', [
    [1, 'plain', function (lv) {
      var c = cmpCase(lv), f = cmpFixes(c);
      return fixed(cmpAsk(c), CMP_OPTS, c.c, f, { hint: 'Find one share from each group, then compare.', steps: cmpSteps(c), explain: cmpSay(c), meta: { k: 'g3fr-cs-mc', a: c.a, b: c.b } });
    }],
    [1, 'which', function (lv) {
      var c = cmpCase(lv), sa = share(c.a[0], c.a[1]), sb = share(c.b[0], c.b[1]);
      var o = R.shuffle([sa, sb]).concat(['They are the same']), right = c.c === 2 ? 2 : o.indexOf(c.c ? sb : sa), fx = {};
      o.forEach(function (x, j) { if (j !== right) fx[j] = j === 2 ? 'Draw both shares: they are not the same.' : 'Draw both: that share is smaller.'; });
      return fixed(many(c.a[0], 'bar is', 'bars are') + ' shared among ' + c.a[1] + ' people, so each gets ' + sa + '. ' + many(c.b[0], 'bar is', 'bars are') + ' shared among ' + c.b[1] + ' people, so each gets ' + sb + '. Which share is bigger?', o, right, fx,
        { hint: 'Picture both shares on bars of the same size.', steps: cmpSteps(c), explain: cmpSay(c), meta: { k: 'g3fr-cs-which', a: c.a, b: c.b } });
    }, 2],
    [2, 'story', function (lv) {
      var c = cmpCase(lv), g = R.pick([['At hockey practice', 'players', 'A player'], ['At the library', 'readers', 'A reader'], ['At swim class', 'swimmers', 'A swimmer']]), h = R.pick([['on the canoe trip', 'paddlers', 'A paddler'], ['at the sugar bush', 'helpers', 'A helper'], ['at choir', 'singers', 'A singer']]);
      var o = [g[2], h[2], 'They get the same'], f = cmpFixes(c, g[1], h[1]);
      return fixed(g[0] + ', ' + many(c.a[0], 'granola bar is', 'granola bars are') + ' shared by ' + c.a[1] + ' ' + g[1] + '. Later, ' + many(c.b[0], 'bar is', 'bars are') + ' shared by ' + c.b[1] + ' ' + h[1] + ' ' + h[0] + '. Who gets more?', o, c.c, f,
        { hint: 'Find one share from each group.', steps: cmpSteps(c).map(function (s) { return s.replace(/^A:/, cap(g[1]) + ':').replace(/^B:/, cap(h[1]) + ':'); }), explain: c.c === 2 ? 'They get the same.' : o[c.c] + ' gets more.', meta: { k: 'g3fr-cs-mc', a: c.a, b: c.b } });
    }],
    [2, 'tf', function (lv) {
      var c = cmpCase(lv), who = Q.name(), p = c.c === 1 || (c.c === 2 && coin()) ? [c.b, c.a] : [c.a, c.b];
      if (c.c !== 2 && coin()) p = [p[1], p[0]];
      var truth = p[0][0] * p[1][1] > p[1][0] * p[0][1];
      return tf(who + ' says ' + many(p[0][0], 'bar', 'bars') + ' among ' + p[0][1] + ' people gives each person more than ' + many(p[1][0], 'bar', 'bars') + ' among ' + p[1][1] + ' people. True or false: ' + who + ' is right.', truth,
        p[0][0] + ' among ' + p[0][1] + ' is ' + share(p[0][0], p[0][1]) + ' each. ' + p[1][0] + ' among ' + p[1][1] + ' is ' + share(p[1][0], p[1][1]) + ' each.', ['More people always means more for each person.', 'The group with the bigger numbers gets more.', 'Fair shares are always the same size.'],
        'Work out each share first, then compare.', { hint: 'Find each share.', meta: { k: 'g3fr-cs-tf', x: p[0], y: p[1] } });
    }],
    [3, 'order', function (lv) {
      var sameK = coin(), k = R.pick([2, 3, 4, 5, 6, 8]), n = R.int(2, 12), list;
      if (sameK) list = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]).slice(0, 3).map(function (x) { return [x, k]; });
      else list = R.shuffle(DS).slice(0, 3).map(function (x) { return [n, x]; });
      list.sort(function (p, q) { return p[0] / p[1] - q[0] / q[1]; });
      return { q: 'Put these fair shares in order, from the <b>smallest</b> share to the <b>biggest</b>.', type: 'order', items: list.map(function (p) { return many(p[0], 'bar', 'bars') + ', ' + p[1] + ' people'; }), first: 'smallest', last: 'biggest',
        hint: sameK ? 'The same number of people: more bars, bigger shares.' : 'The same bars: more people, smaller shares.', steps: list.map(function (p) { return p[0] + ' among ' + p[1] + ': ' + share(p[0], p[1]) + ' each.'; }),
        explain: list.map(function (p) { return share(p[0], p[1]); }).join(', ') + '.', meta: { k: 'g3fr-cs-order' } };
    }]
  ]);
  function tgCompare(lv) {
    return function () {
      var c = cmpCase(lv);
      function shareQ(g, x) { var s = { items: x[0], k: x[1], w: Math.floor(x[0] / x[1]), l: x[0] % x[1] }; return mc('How much does each person in ' + g + ' get?', share(x[0], x[1]), s.items < s.k ? fwWrongs(s) : s.l ? shWrongs(s) : [[String(s.w + 1), 'Check: ' + s.k + ' &times; ' + (s.w + 1) + ' is too many.'], [String(s.w - 1 || s.w + 2), 'Check: ' + s.k + ' &times; ' + s.w + ' = ' + s.items + '.'], [mixed(s.w, 1, s.k), 'Nothing is left over to cut.']], { byValue: true, hint: 'Whole bars first, then cut what is left.', meta: { k: 'g3fr-share', items: x[0], k2: x[1] } }); }
      return { q: cmpAsk(c), done: cmpSay(c), steps: [
        { prompt: 'Find one share. Start with A.', q: shareQ('A', c.a) },
        { prompt: 'Now find a share in B.', q: shareQ('B', c.b) },
        { prompt: 'Compare the two shares.', q: fixed('Where does each person get more?', CMP_OPTS, c.c, cmpFixes(c), { hint: 'Which share is bigger?', meta: { k: 'g3fr-cs-mc', a: c.a, b: c.b } }) }
      ] };
    };
  }

  /* ======================= Lesson 3: Build with unit fractions ======================= */
  var CT_D = { 1: [2, 3, 4], 2: [3, 4, 5, 6], 3: [5, 6, 8, 10] };
  function ctCase(lv) { var d = R.pick(CT_D[lv]); return { d: d, n: R.int(2, lv === 1 ? Math.max(2, d - 1) : d) }; }
  function ctWrongs(n, d) { return [[fr(n, n * d), 'Do not add the bottom numbers. The pieces are still ' + MANY[d] + '.'], [fr(d, n), 'Flipped. The top number counts the pieces.'], [fr(n - 1, d), 'Count the pieces again: ' + n + '.'], [fr(n + 1, d), 'Count the pieces again: ' + n + '.'], [fr(1, d), 'That is one piece. Count them all.']].filter(function (w) { return !/<span>0<\/span>/.test(w[0]); }); }
  /* a number line in 1/d steps, for placing a marker; only the whole numbers are labelled */
  function frLine(d, max, ans) {
    return { type: 'line', min: 0, max: max, tick: 1 / d, every: 1, snap: 1 / d, answer: ans, tol: 0.4 / d, hideValue: true,
      label: function (v) { var k = Math.round(v * d); return k % d === 0 ? String(k / d) : k + '/' + d; } };
  }
  skill('fr-count', 'Count unit pieces', 'B2.8', [
    [1, 'plain', function (lv) {
      var c = ctCase(lv);
      return mc(sum(c.n, c.d) + ' = ?', fr(c.n, c.d), ctWrongs(c.n, c.d), { byValue: true, fig: lv === 1 ? bar(c.n, c.d) : '',
        hint: 'Count the pieces. They are all ' + MANY[c.d] + '.', steps: ['Every piece is one ' + ONE[c.d] + '.', 'There are ' + c.n + ' pieces.', pieces(c.n, c.d) + ' is ' + fr(c.n, c.d) + '.'], explain: pieces(c.n, c.d) + ': ' + fr(c.n, c.d) + '.', meta: { k: 'g3fr-ct-mc', n: c.n, d: c.d } });
    }],
    [1, 'line', function (lv) {
      var c = ctCase(lv);
      return put({ q: 'Start at 0. Jump ' + fr(1, c.d) + ' at a time, <b>' + c.n + ' times</b>. Put the marker where you land.', place: c.n + ' jumps',
        hint: 'Each small step is ' + fr(1, c.d) + '. ' + c.d + ' steps make 1.', steps: ['Count ' + c.n + ' small steps from 0.', 'You land on ' + fr(c.n, c.d) + '.'], explain: c.n + ' jumps of ' + fr(1, c.d) + ' land on ' + fr(c.n, c.d) + '.', meta: { k: 'g3fr-ct-line', n: c.n, d: c.d } }, frLine(c.d, 1, c.n / c.d));
    }],
    [1, 'fill', function (lv) {
      var c = ctCase(lv), w = {};
      w[c.n * c.d] = 'Count the pieces, do not multiply.';
      return { q: 'Count the pieces. Fill in the blank.', type: 'fill', fill: sum(c.n, c.d) + ' = [[]] ' + MANY[c.d], answers: [c.n], wrong: w,
        hint: 'Every piece is one ' + ONE[c.d] + '. Count them.', steps: ['There are ' + c.n + ' pieces of ' + fr(1, c.d) + '.'], explain: pieces(c.n, c.d) + ', or ' + fr(c.n, c.d) + '.', meta: { k: 'g3fr-ct-fill', d: c.d } };
    }],
    [2, 'picture', function (lv) {
      var c = ctCase(lv), alt = others(DS, c.d)[0], kind = c.d >= 6 && coin() ? 'grid' : 'bar';
      return mc('Which addition matches the shaded part?', sum(c.n, c.d), [[sum(c.n + 1, c.d), 'Count the shaded pieces: ' + c.n + '.'], [sum(c.n - 1, c.d), 'Count the shaded pieces: ' + c.n + '.'], [sum(c.n, alt), 'Each piece is one ' + ONE[c.d] + ': the whole has ' + c.d + ' parts.']],
        { fig: shape(kind, c.n, c.d), hint: 'What is each piece called? How many are shaded?', steps: ['Each piece is ' + fr(1, c.d) + '.', c.n + ' are shaded.'], explain: c.n + ' pieces of ' + fr(1, c.d) + '.', meta: { k: 'g3fr-ct-pic' } });
    }],
    [2, 'tf', function (lv) {
      var c = ctCase(lv), who = Q.name(), truth = coin(), sd = truth ? c.d : c.n * c.d;
      return tf(who + ' says ' + sum(c.n, c.d) + ' = ' + fr(c.n, sd) + '. True or false: ' + who + ' is right.', truth, 'The pieces stay the same size. ' + c.n + ' pieces of ' + fr(1, c.d) + ' make ' + fr(c.n, c.d) + '.',
        ['Add the top numbers and add the bottom numbers.', 'More pieces make each piece smaller.', 'The answer is always ' + fr(1, c.d) + '.'], 'Count the pieces. Does the size of each piece change?',
        { hint: 'Does the size of each piece change?', meta: { k: 'g3fr-ct-tf', n: c.n, d: c.d, sd: sd } });
    }],
    [3, 'story', function (lv) {
      var c = ctCase(lv), who = Q.name(), t = R.pick(['pizza', 'bannock', 'pan of lasagna', 'cake']);
      return mc('A ' + t + ' is cut into ' + c.d + ' equal pieces. ' + who + ' eats ' + c.n + ' pieces, one at a time. Each piece is ' + fr(1, c.d) + '. How much of the ' + t + ' is that?', fr(c.n, c.d), ctWrongs(c.n, c.d), { byValue: true,
        hint: 'Count the pieces of ' + fr(1, c.d) + '.', steps: [sum(c.n, c.d), '= ' + fr(c.n, c.d)], explain: pieces(c.n, c.d) + ': ' + fr(c.n, c.d) + '.', meta: { k: 'g3fr-ct-mc', n: c.n, d: c.d } });
    }]
  ]);
  function tgCount(lv) {
    return function () {
      var c = ctCase(lv), fx = {};
      fx[c.d] = 'That is the bottom number. Count the pieces being added.';
      return { q: sum(c.n, c.d) + ' = ?', fig: bar(c.n, c.d), done: sum(c.n, c.d) + ' = ' + fr(c.n, c.d), steps: [
        { prompt: 'Look at the bottom numbers.', q: mc('What size is each piece?', 'one ' + ONE[c.d], pcWrongs(c.d), { hint: 'The bottom number names the piece.', meta: { k: 'g3fr-pc-mc', d: c.d } }) },
        { prompt: 'Count the pieces.', q: num('How many pieces are added?', c.n, fx, { hint: 'Count the plus signs, then add 1.', meta: { k: 'g3fr-ct-n', n: c.n } }) },
        { prompt: 'The pieces stay ' + MANY[c.d] + '.', q: mc('So the sum is:', fr(c.n, c.d), ctWrongs(c.n, c.d), { byValue: true, hint: pieces(c.n, c.d) + '.', meta: { k: 'g3fr-ct-mc', n: c.n, d: c.d } }) }
      ] };
    };
  }

  /* ---------- The top number counts the pieces ---------- */
  var TP_D = { 1: [3, 4, 5], 2: [4, 5, 6, 8], 3: [6, 8, 10] };
  function tpCase(lv) { var d = R.pick(TP_D[lv]); return { d: d, n: R.int(2, lv === 3 ? d : d - 1) }; }
  function tpFix(c) { var f = {}; f[c.d] = 'That is the bottom number. It names the size of each piece.'; f[c.n + c.d] = 'Do not add the numbers. The top number counts the pieces.'; return f; }
  function tpSums(c) { return (ONE[c.n] && c.n !== c.d ? [[sum(c.d, c.n), 'Flipped: you need ' + c.n + ' pieces of one ' + ONE[c.d] + '.']] : []).concat([[sum(c.n - 1, c.d), 'Count the pieces: the top number is ' + c.n + '.'], [sum(c.n + 1, c.d), 'Count the pieces: the top number is ' + c.n + '.'], [sum(c.n, c.d === 10 ? 8 : DS[DS.indexOf(c.d) + 1]), 'The bottom number is ' + c.d + ': ' + MANY[c.d] + '.']]); }
  skill('fr-top', 'How many pieces?', 'B2.8', [
    [1, 'plain', function (lv) {
      var c = tpCase(lv);
      return num('How many ' + fr(1, c.d) + ' pieces make ' + fr(c.n, c.d) + '?', c.n, tpFix(c), { fig: lv === 1 ? bar(c.n, c.d) : '',
        hint: 'The top number counts the pieces.', steps: ['The bottom number, ' + c.d + ', names the piece: ' + MANY[c.d] + '.', 'The top number, ' + c.n + ', counts them.'], explain: fr(c.n, c.d) + ' is ' + c.n + ' pieces of ' + fr(1, c.d) + '.', meta: { k: 'g3fr-tp-num' } });
    }],
    [1, 'sum', function (lv) {
      var c = tpCase(lv);
      return mc('Which is the same as ' + fr(c.n, c.d) + '?', sum(c.n, c.d), tpSums(c), { hint: 'Bottom number: the piece. Top number: how many.', steps: [fr(c.n, c.d) + ' is ' + c.n + ' pieces of ' + fr(1, c.d) + '.'], explain: fr(c.n, c.d) + ' = ' + sum(c.n, c.d) + '.', meta: { k: 'g3fr-tp-mc', n: c.n, d: c.d } });
    }],
    [2, 'order', function (lv) {
      var d = R.pick(TP_D[lv]), ns = R.shuffle(Array.apply(null, Array(d)).map(function (_, i) { return i + 1; })).slice(0, lv === 3 ? 4 : 3).sort(function (a, b) { return a - b; });
      return { q: 'Put these in order from <b>least</b> to <b>greatest</b>.', type: 'order', items: ns.map(function (n) { return fr(n, d); }), first: 'least', last: 'greatest',
        hint: 'They are all ' + MANY[d] + ', the same size of piece. Fewer pieces is less.', steps: ['Same bottom number: same-size pieces.', 'Compare the top numbers: how many pieces.'], explain: ns.map(function (n) { return fr(n, d); }).join(', ') + '.', meta: { k: 'g3fr-tp-order' } };
    }],
    [2, 'tf', function (lv) {
      var c = tpCase(lv), who = Q.name(), truth = coin(), s = truth ? c.n : c.d;
      if (s === c.n && !truth) s = c.n + 1;
      return tf(who + ' says ' + fr(c.n, c.d) + ' is <b>' + s + '</b> pieces of ' + fr(1, c.d) + '. True or false: ' + who + ' is right.', truth, 'The top number counts the pieces: ' + fr(c.n, c.d) + ' is ' + c.n + ' pieces of ' + fr(1, c.d) + '.',
        ['The bottom number counts the pieces.', 'Add the top and bottom to count the pieces.', 'Every fraction has ' + c.d + ' pieces.'], 'Which number counts the pieces?', { hint: 'Which number counts the pieces?', meta: { k: 'g3fr-tp-tf', n: c.n, d: c.d, s: s } });
    }],
    [3, 'story', function (lv) {
      var c = tpCase(lv), who = Q.name(), t = R.pick(['bannock', 'pizza', 'pan of cornbread']);
      return num('A ' + t + ' is cut into equal pieces. Each piece is ' + fr(1, c.d) + ' of the ' + t + '. ' + who + ' takes ' + fr(c.n, c.d) + ' of the ' + t + '. How many pieces is that?', c.n, tpFix(c), {
        hint: 'How many pieces of ' + fr(1, c.d) + ' make ' + fr(c.n, c.d) + '?', steps: ['Each piece is ' + fr(1, c.d) + '.', 'The top number of ' + fr(c.n, c.d) + ' counts them: ' + c.n + '.'], explain: c.n + ' pieces.', meta: { k: 'g3fr-tp-num' } });
    }]
  ]);
  function tgTop(lv) {
    return function () {
      var c = tpCase(lv), fx = {};
      fx[c.d] = 'That is the bottom number. It tells the size, not how many.';
      return { q: 'How many ' + fr(1, c.d) + ' pieces make ' + fr(c.n, c.d) + '?', fig: bar(0, c.d), done: fr(c.n, c.d) + ' = ' + sum(c.n, c.d), steps: [
        { prompt: 'The bottom number names the piece.', q: mc('What size is each piece?', 'one ' + ONE[c.d], pcWrongs(c.d), { hint: 'Look at the bottom number.', meta: { k: 'g3fr-pc-mc', d: c.d } }) },
        { prompt: 'The top number counts them.', q: num('How many of those pieces?', c.n, fx, { hint: 'Look at the top number.', meta: { k: 'g3fr-tp-n', n: c.n, d: c.d } }) },
        { prompt: 'Write it as an addition.', q: mc('Which addition makes ' + fr(c.n, c.d) + '?', sum(c.n, c.d), tpSums(c), { hint: c.n + ' pieces of ' + fr(1, c.d) + '.', meta: { k: 'g3fr-tp-mc', n: c.n, d: c.d } }) }
      ] };
    };
  }

  /* ---------- Past one whole ---------- */
  var PS_D = { 1: [2, 3, 4], 2: [2, 3, 4, 5, 6], 3: [5, 6, 8, 10] };
  function psCase(lv, mustLeft) {
    var d = R.pick(PS_D[lv]), top = lv === 1 ? 2 * d - 1 : Math.min(lv === 2 ? 3 * d - 1 : 2 * d + 3, 20), n;
    do { n = R.int(d + 1, Math.max(d + 1, top)); } while (mustLeft && n % d === 0);
    return { d: d, n: n, w: Math.floor(n / d), r: n % d };
  }
  function psWrongs(c) {
    var W = [[String(c.n), 'Each piece is one ' + ONE[c.d] + ', not a whole. ' + c.d + ' of them make 1 whole.'], [mixed(c.w + 1, c.r, c.d), 'Count the wholes again: ' + pieces(c.d, c.d) + ' make 1.']];
    if (c.r && c.d - c.r !== c.r) W.push([mixed(c.w, c.d - c.r, c.d), 'That counts the pieces still missing, not the pieces left.']);
    W.push([mixed(c.w, c.r, c.n), 'The pieces are still ' + MANY[c.d] + '.']);
    if (c.w > 1) W.push([mixed(c.w - 1, c.r || 1, c.d), 'Count the wholes again.']);
    return W.filter(function (w) { return !/-/.test(plain(w[0])); });
  }
  function psSteps(c) { return [pieces(c.d, c.d) + ' make 1 whole.', c.n + ' ' + MANY[c.d] + ' make ' + many(c.w, 'whole', 'wholes') + (c.r ? ', with ' + pieces(c.r, c.d) + ' left.' : '.'), fr(c.n, c.d) + ' = ' + mixed(c.w, c.r, c.d) + '.']; }
  skill('fr-past', 'Past one whole', 'B2.8', [
    [1, 'plain', function (lv) {
      var c = psCase(lv);
      return mc(fr(c.n, c.d) + ' is the same as:', mixed(c.w, c.r, c.d), psWrongs(c), { byValue: true, fig: lv === 1 ? unitLine(c.n, c.d) : '',
        hint: c.d + ' ' + MANY[c.d] + ' make 1 whole.', steps: psSteps(c), explain: fr(c.n, c.d) + ' = ' + mixed(c.w, c.r, c.d) + '.', meta: { k: 'g3fr-ps-mc', n: c.n, d: c.d } });
    }],
    [1, 'fill', function (lv) {
      var c = psCase(lv, true), w = {};
      w[c.n + ', 0'] = 'Each piece is not a whole. ' + c.d + ' pieces make 1 whole.';
      return { q: 'Write ' + fr(c.n, c.d) + ' with wholes. Fill in the blanks.', type: 'fill', fig: lv === 1 ? bar(c.d, c.d, 300) + bar(c.n - c.d > c.d ? c.d : c.n - c.d, c.d, 300) + (c.n > 2 * c.d ? bar(c.n - 2 * c.d, c.d, 300) : '') : '',
        fill: 'Wholes: [[]]<br>' + cap(MANY[c.d]) + ' left over: [[]]', answers: [c.w, c.r], wrong: w,
        hint: 'Take out ' + c.d + ' ' + MANY[c.d] + ' for each whole.', steps: psSteps(c), explain: fr(c.n, c.d) + ' = ' + mixed(c.w, c.r, c.d) + '.', meta: { k: 'g3fr-ps-fill', n: c.n, d: c.d } };
    }],
    [2, 'line', function (lv) {
      var c = psCase(lv), max = Math.max(2, c.w + 1);
      if (c.d >= 8) max = Math.max(2, Math.ceil(c.n / c.d));
      return put({ q: 'Put ' + fr(c.n, c.d) + ' on the number line.', place: c.n + '/' + c.d,
        hint: 'Each small step is ' + fr(1, c.d) + '. ' + c.d + ' steps reach 1.', steps: ['Count ' + c.n + ' small steps from 0.', 'You pass 1 after ' + c.d + ' steps.'], explain: fr(c.n, c.d) + ' = ' + mixed(c.w, c.r, c.d) + '.', meta: { k: 'g3fr-ps-line', n: c.n, d: c.d } }, frLine(c.d, max, c.n / c.d));
    }],
    [2, 'match', function (lv) {
      var pairs = [], seen = {};
      while (pairs.length < 3) { var c = psCase(lv); if (seen[(c.n / c.d).toFixed(5)]) continue; seen[(c.n / c.d).toFixed(5)] = 1; pairs.push([fr(c.n, c.d), mixed(c.w, c.r, c.d)]); }
      return { q: 'Match each fraction to the same amount in wholes.', type: 'match', pairs: pairs, hint: 'Take out the wholes first.', steps: [fr(5, 4) + ': 4 fourths make 1, and 1 fourth is left.'],
        explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'g3fr-ps-match' } };
    }],
    [2, 'tf', function (lv) {
      var c = psCase(lv, true), who = Q.name(), truth = coin(), s = truth ? mixed(c.w, c.r, c.d) : R.pick([String(c.n), mixed(c.w + 1, c.r, c.d), mixed(c.w, c.r, c.n)]);
      return tf(who + ' says ' + fr(c.n, c.d) + ' = <b>' + s + '</b>. True or false: ' + who + ' is right.', truth, pieces(c.d, c.d) + ' make 1 whole, so ' + fr(c.n, c.d) + ' = ' + mixed(c.w, c.r, c.d) + '.',
        ['Every piece is a whole.', 'A fraction can never be more than 1.', 'Take out the bottom number from the top for each whole, then add 1.'], 'Take out the wholes, then count what is left.', { hint: 'How many ' + MANY[c.d] + ' make 1 whole?', meta: { k: 'g3fr-ps-tf', n: c.n, d: c.d, said: s } });
    }]
  ]);
  function tgPast(lv) {
    return function () {
      var c = psCase(lv, true), f1 = {}, f2 = {}, f3 = {};
      f1[c.n] = 'That is all the pieces. How many fill just one whole?'; f2[c.n] = 'Each piece is not a whole. Make groups of ' + c.d + '.'; f3[c.d - c.r] = 'That counts the missing pieces. Count the ones left.';
      return { q: 'Write ' + fr(c.n, c.d) + ' using wholes.', fig: unitLine(c.n, c.d), done: fr(c.n, c.d) + ' = ' + mixed(c.w, c.r, c.d) + '.', steps: [
        { prompt: 'How many pieces fill one whole?', q: num('How many ' + MANY[c.d] + ' make 1 whole?', c.d, f1, { hint: 'Look at the bottom number.', meta: { k: 'g3fr-ps-one', d: c.d } }) },
        { prompt: 'Take out the wholes.', q: num('How many wholes are in ' + fr(c.n, c.d) + '?', c.w, f2, { hint: 'Count by ' + c.d + 's.', meta: { k: 'g3fr-ps-w', n: c.n, d: c.d } }) },
        { prompt: 'Count what is left.', q: num('How many ' + MANY[c.d] + ' are left?', c.r, f3, { hint: c.n + ' &minus; ' + c.w * c.d + '.', meta: { k: 'g3fr-ps-r', n: c.n, d: c.d } }) },
        { prompt: 'Wholes, then the pieces left.', q: mc('So ' + fr(c.n, c.d) + ' =', mixed(c.w, c.r, c.d), psWrongs(c), { byValue: true, hint: c.w + ' and ' + fr(c.r, c.d) + '.', meta: { k: 'g3fr-ps-mc', n: c.n, d: c.d } }) }
      ] };
    };
  }

  /* ======================= Lesson 4: Same amount, different names ======================= */
  /* one family of equivalent fractions: [n, a, m, b] with n/a = m/b */
  function famPairs(fam) {
    var out = [];
    fam.forEach(function (a) { fam.forEach(function (b) { if (b > a) for (var n = 1; n < a; n++) out.push([n, a, n * b / a, b]); }); });
    return out;
  }
  function eqvCase(fam, lv) {
    var p = R.pick(famPairs(fam)), rev = lv === 3 ? coin() : lv === 2 && coin(), w = lv === 3 && !rev ? R.int(1, 3) : 0;
    return rev ? { n: p[2], a: p[3], m: p[0], b: p[1], w: w } : { n: p[0], a: p[1], m: p[2], b: p[3], w: w };
  }
  function eqvWrongs(e) {
    var W = [[mixed(e.w, e.n, e.b), e.b > e.a ? 'The pieces are smaller, so you need more of them.' : 'The pieces are bigger, so you need fewer of them.'], [mixed(e.w, e.m + 1, e.b), 'Line up the bars: that goes past.']];
    if (e.m > 1) W.push([mixed(e.w, e.m - 1, e.b), 'Line up the bars: that stops short.']);
    if (e.m < e.a) W.push([mixed(e.w, e.m, e.a), 'The top changed, but the pieces did not.']);
    return W;
  }
  function eqvFix(e) { var f = {}; f[e.n] = e.b > e.a ? 'The pieces are smaller, so you need more of them. Each ' + ONE[e.a] + ' is ' + e.b / e.a + ' ' + MANY[e.b] + '.' : 'The pieces are bigger, so you need fewer of them. ' + e.a / e.b + ' ' + MANY[e.a] + ' make one ' + ONE[e.b] + '.'; return f; }
  function eqvSteps(e) {
    var big = e.b > e.a;
    return [big ? 'Each ' + ONE[e.a] + ' is ' + e.b / e.a + ' ' + MANY[e.b] + '.' : e.a / e.b + ' ' + MANY[e.a] + ' make one ' + ONE[e.b] + '.', big ? e.n + ' &times; ' + e.b / e.a + ' = ' + e.m + '.' : e.n + ' &divide; ' + e.a / e.b + ' = ' + e.m + '.', mixed(e.w, e.n, e.a) + ' = ' + mixed(e.w, e.m, e.b) + '.<div class="fig">' + bars([[e.n, e.a], [e.m, e.b]]) + '</div>'];
  }
  function eqvSkill(id, name, fam) {
    skill(id, name, 'B1.7', [
      [1, 'plain', function (lv) {
        var e = eqvCase(fam, lv);
        return { q: 'Fill in the blank.', type: 'fill', fig: lv === 1 ? bars([[e.n, e.a], [0, e.b]]) : '', fill: mixed(e.w, e.n, e.a) + ' = ' + (e.w ? e.w + ' and ' : '') + '[[]] ' + MANY[e.b], answers: [e.m], wrong: eqvFix(e),
          hint: e.b > e.a ? 'Each ' + ONE[e.a] + ' is cut into ' + e.b / e.a + ' ' + MANY[e.b] + '.' : 'Put ' + MANY[e.a] + ' together into ' + MANY[e.b] + '.', steps: eqvSteps(e), explain: mixed(e.w, e.n, e.a) + ' = ' + mixed(e.w, e.m, e.b) + '.', meta: { k: 'g3fr-eqv-fill' } };
      }],
      [1, 'mc', function (lv) {
        var e = eqvCase(fam, lv);
        return mc('Which is the same amount as ' + mixed(e.w, e.n, e.a) + '?', mixed(e.w, e.m, e.b), eqvWrongs(e), { byValue: true, fig: lv === 1 ? bar(e.n, e.a, 340) : '',
          hint: 'Picture the bars. Where does the shading end?', steps: eqvSteps(e), explain: mixed(e.w, e.n, e.a) + ' = ' + mixed(e.w, e.m, e.b) + '.', meta: { k: 'g3fr-eqv-mc', n: e.n, a: e.a, w: e.w } });
      }],
      [1, 'tap', function (lv) {
        var e = eqvCase(fam, 1), set = [[e.m, e.b]], w = {};
        [[e.n, e.b], [e.m + 1, e.b], [e.m - 1, e.b]].forEach(function (p) { if (set.length < 3 && p[0] >= 1 && p[0] <= p[1] && p[0] !== e.m) set.push(p); });
        set = R.shuffle(set);
        var ans = 0;
        set.forEach(function (p, i) { if (p[0] === e.m) ans = i; else w[String(i)] = p[0] < e.m ? 'That shading stops short of the top bar.' : 'That shading goes past the top bar.'; });
        return { q: 'The top bar shows ' + fr(e.n, e.a) + '. Tap the bar with the same amount shaded.', type: 'tap', fig: bar(e.n, e.a, 300), tiles: set.map(function (p) { return bar(p[0], p[1], 300); }), answer: ans, answerText: 'the bar with ' + e.m + ' of ' + e.b + ' parts shaded', wrong: w,
          hint: 'Look for shading that ends in the same place.', steps: eqvSteps(e), explain: fr(e.n, e.a) + ' = ' + fr(e.m, e.b) + '.', meta: { k: 'g3fr-eqv-tap', n: e.n, a: e.a } };
      }, 2],
      [1, 'tf', function (lv) {
        var e = eqvCase(fam, lv), truth = coin(), s = truth ? e.m : R.pick([e.n, e.m + 1, e.m - 1].filter(function (x) { return x > 0 && x !== e.m; }));
        var right = truth ? 'The shading lines up, so ' + mixed(e.w, e.n, e.a) + ' = ' + mixed(e.w, e.m, e.b) + '.' : mixed(e.w, e.n, e.a) + ' = ' + mixed(e.w, e.m, e.b) + ', not ' + mixed(e.w, s, e.b) + '.';
        return tf('True or false: ' + mixed(e.w, e.n, e.a) + ' = ' + mixed(e.w, s, e.b), truth, right,
          ['Fractions with different bottom numbers are never equal.', 'The top number stays the same when the pieces change.', 'The bigger bottom number is always more.'], 'Line up the bars from the left. Do they end in the same place?',
          { fig: lv < 3 ? bars([[e.n, e.a], [s, e.b]]) : '', hint: 'Compare where the shading ends.', meta: { k: 'g3fr-eqv-tf' } });
      }],
      [2, 'match', function (lv) {
        var list = R.shuffle(famPairs(fam).concat([[fam[0], fam[0], fam[1], fam[1]]])), pairs = [], seen = {};
        list.forEach(function (p) { var v = (p[0] / p[1]).toFixed(5); if (pairs.length < 3 && !seen[v]) { seen[v] = 1; pairs.push(lv === 3 && coin() ? [fr(p[2], p[3]), fr(p[0], p[1])] : [fr(p[0], p[1]), fr(p[2], p[3])]); } });
        return { q: 'Match each fraction to the one that is the same amount.', type: 'match', pairs: pairs, hint: 'Picture each one as a bar. Equal fractions shade the same length.', steps: [fr(1, fam[0]) + ' = ' + fr(fam[1] / fam[0], fam[1]) + '.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'g3fr-eqv-match' } };
      }],
      [2, 'story', function (lv) {
        var e = eqvCase(fam, 1), two = Q.two(), t = R.pick(['pizza', 'bannock', 'pan of lasagna']);
        if (lv === 3 && coin()) e = { n: e.m, a: e.b, m: e.n, b: e.a, w: 0 };
        return num(two[0] + ' eats ' + fr(e.n, e.a) + ' of a ' + t + '. ' + two[1] + '\'s ' + t + ' is the same size, cut into ' + e.b + ' equal pieces. How many pieces must ' + two[1] + ' eat to have the same amount?', e.m, eqvFix(e), {
          hint: 'How many ' + MANY[e.b] + ' match ' + fr(e.n, e.a) + '?', steps: eqvSteps(e), explain: fr(e.n, e.a) + ' = ' + fr(e.m, e.b) + ', so ' + e.m + ' pieces.', meta: { k: 'g3fr-eqv-story' } });
      }]
    ]);
  }
  eqvSkill('fr-eq248', 'Halves, fourths, eighths', [2, 4, 8]);
  eqvSkill('fr-eq36', 'Thirds and sixths', [3, 6]);
  eqvSkill('fr-eq510', 'Fifths and tenths', [5, 10]);
  function tgEqv(fam, lv) {
    return function () {
      var p = R.pick(famPairs(fam)), e = { n: p[0], a: p[1], m: p[2], b: p[3], w: 0 }, f1 = {}, f2 = {};
      if (lv === 1) { p = famPairs(fam)[0]; e = { n: p[0], a: p[1], m: p[2], b: p[3], w: 0 }; }
      f1[e.b] = 'That is all the ' + MANY[e.b] + ' in the bar. Look at just one ' + ONE[e.a] + '.'; f2[e.a] = 'That is all the parts. Count the shaded ones.';
      return { q: fr(e.n, e.a) + ' = how many ' + MANY[e.b] + '?', fig: bars([[e.n, e.a], [0, e.b]]), done: fr(e.n, e.a) + ' = ' + fr(e.m, e.b) + '.', steps: [
        { prompt: 'How many small pieces fit in one big piece?', q: num('Each ' + ONE[e.a] + ' is how many ' + MANY[e.b] + '?', e.b / e.a, f1, { hint: 'Look under one ' + ONE[e.a] + ' of the top bar.', meta: { k: 'g3fr-eqv-each', a: e.a, b: e.b } }) },
        { prompt: 'Count the shaded big pieces.', q: num('How many ' + MANY[e.a] + ' are shaded?', e.n, f2, { hint: 'Count the shaded parts of the top bar.', meta: { k: 'g3fr-eqv-n', n: e.n } }) },
        { prompt: 'Small pieces in each, times the shaded big pieces.', q: num('So ' + fr(e.n, e.a) + ' = how many ' + MANY[e.b] + '?', e.m, eqvFix(e), { hint: e.n + ' &times; ' + e.b / e.a + '.', meta: { k: 'g3fr-eqv-step' } }) }
      ] };
    };
  }

  /* ---------- Equal shares in a sharing story ---------- */
  var ES_F = [[2, 4], [2, 8], [4, 8], [6, 8], [2, 6], [4, 6], [2, 10], [4, 10], [6, 10], [8, 10]];
  var ES_W = [[6, 4], [10, 4], [14, 4], [18, 4], [10, 8], [12, 8], [14, 8], [18, 8], [8, 6], [10, 6], [14, 6], [16, 6], [12, 10], [14, 10], [16, 10], [18, 10]];
  function esCase(lv) { var p = R.pick(lv === 3 ? ES_W : ES_F), items = p[0], k = p[1], w = Math.floor(items / k), l = items % k, g = gcd(l, k); return { items: items, k: k, w: w, l: l, s: l / g, t: k / g }; }
  function esWrongs(e) {
    var W = [[mixed(e.w, e.l, e.t), 'Only the bottom changed. Change the top too.'], [mixed(e.w, e.s, e.k), 'Only the top changed. Change the bottom too.'], [mixed(e.w, e.s + 1, e.t), 'Line them up: that is too much.']];
    if (e.s > 1) W.push([mixed(e.w, e.s - 1, e.t), 'Line them up: that is too little.']);
    W.push([mixed(e.w + 1, e.s, e.t), 'Count the wholes again.']);
    var seen = {};
    return W.filter(function (w) { var v = val(w[0]), t = plain(w[0]), ok = Math.abs(v - e.items / e.k) > 1e-9 && !seen[t] && !/<span>(\d+)<\/span><span>\1<\/span>/.test(w[0]); seen[t] = 1; return ok; });
  }
  function esSteps(e) { return ['Each person gets ' + mixed(e.w, e.l, e.k) + '.', 'Every ' + e.k / e.t + ' ' + MANY[e.k] + ' make one ' + ONE[e.t] + '.', mixed(e.w, e.l, e.k) + ' = ' + mixed(e.w, e.s, e.t) + '.']; }
  skill('fr-eqshare', 'Equal shares, two names', 'B1.7', [
    [1, 'plain', function (lv) {
      var e = esCase(lv), opts = R.shuffle([mixed(e.w, e.l, e.k), mixed(e.w, e.s, e.t)].concat(R.shuffle(esWrongs(e)).slice(0, 2).map(function (w) { return w[0]; })));
      var ans = []; opts.forEach(function (o, j) { if (Math.abs(val(o) - e.items / e.k) < 1e-9) ans.push(j); });
      return { q: e.items + ' pizzas are shared equally among ' + e.k + ' friends. Pick <b>every</b> way to name one share.', type: 'pick', options: opts, answer: ans,
        hint: 'Cut each pizza into ' + MANY[e.k] + '. Then look for a name with bigger pieces.', steps: esSteps(e), explain: mixed(e.w, e.l, e.k) + ' and ' + mixed(e.w, e.s, e.t) + ' are the same amount.', meta: { k: 'g3fr-es-pick', items: e.items, k2: e.k } };
    }],
    [1, 'mc', function (lv) {
      var e = esCase(lv);
      return mc(e.items + ' bars are shared equally among ' + e.k + ' people. Each gets ' + mixed(e.w, e.l, e.k) + '. Which is the same amount?', mixed(e.w, e.s, e.t), esWrongs(e), { byValue: true, fig: lv === 1 ? bars([[e.l, e.k]]) : '',
        hint: 'Put the ' + MANY[e.k] + ' together into bigger pieces.', steps: esSteps(e), explain: mixed(e.w, e.l, e.k) + ' = ' + mixed(e.w, e.s, e.t) + '.', meta: { k: 'g3fr-es-mc', items: e.items, k2: e.k } });
    }],
    [2, 'fill', function (lv) {
      var e = esCase(Math.min(lv, 2));
      return { q: e.items + ' bars are shared equally among ' + e.k + ' people. Fill in the blanks.', type: 'fill', fill: 'Each gets [[]] pieces of ' + fr(1, e.k) + ',<br>the same as [[]] pieces of ' + fr(1, e.t) + '.', answers: [e.l, e.s],
        hint: 'Cut each bar into ' + MANY[e.k] + ' first.', steps: esSteps(e), explain: fr(e.l, e.k) + ' = ' + fr(e.s, e.t) + '.', meta: { k: 'g3fr-es-fill', items: e.items, k2: e.k } };
    }],
    [2, 'tf', function (lv) {
      var e = esCase(lv), two = Q.two(), truth = coin(), bad = esWrongs(e), said = truth ? mixed(e.w, e.s, e.t) : R.pick(bad)[0];
      return tf(e.items + ' bars are shared equally among ' + e.k + ' people. ' + two[0] + ' says each gets ' + mixed(e.w, e.l, e.k) + '. ' + two[1] + ' says each gets ' + said + '. True or false: they are both right.', truth,
        mixed(e.w, e.l, e.k) + ' = ' + mixed(e.w, e.s, e.t) + ': the same amount, with bigger pieces.', ['Two different fractions can never be the same amount.', 'Smaller pieces always means a smaller share.', 'Only the fraction with the bigger numbers is right.'],
        'Line up the two shares. Do they end in the same place?', { hint: 'Picture both shares on a bar.', meta: { k: 'g3fr-es-tf', items: e.items, k2: e.k, said: said } });
    }],
    [3, 'story', function (lv) {
      var e = esCase(3), who = Q.name();
      return mc('On a canoe trip, ' + who + '\'s group shares ' + e.items + ' bannock loaves equally among ' + e.k + ' paddlers. Each gets ' + mixed(e.w, e.l, e.k) + ' loaves. What is that in ' + MANY[e.t] + '?', mixed(e.w, e.s, e.t), esWrongs(e), { byValue: true,
        hint: 'Keep the wholes. Put the ' + MANY[e.k] + ' together into ' + MANY[e.t] + '.', steps: esSteps(e), explain: mixed(e.w, e.l, e.k) + ' = ' + mixed(e.w, e.s, e.t) + '.', meta: { k: 'g3fr-es-mc', items: e.items, k2: e.k } });
    }]
  ]);
  function tgEqshare(lv) {
    return function () {
      var e = esCase(lv === 3 ? 2 : 1), f1 = {}, sh = { items: e.items, k: e.k };
      f1[1] = 'One piece from each pizza, and there are ' + e.items + ' pizzas.';
      return { q: e.items + ' pizzas are shared equally among ' + e.k + ' friends. Each pizza is cut into ' + MANY[e.k] + '.', fig: pizzas({ items: e.items, k: e.k, cut: e.k }), done: fr(e.l, e.k) + ' = ' + fr(e.s, e.t) + ': two names, one share.', steps: [
        { prompt: 'Each friend gets one piece from each pizza.', q: num('How many pieces does each friend get?', e.items, f1, { hint: 'How many pizzas?', meta: { k: 'g3fr-fw-count', items: e.items, k2: e.k } }) },
        { prompt: 'Name the share.', q: mc('What fraction of a pizza is that?', fr(e.l, e.k), fwWrongs(sh), { byValue: true, hint: pieces(e.items, e.k) + '.', meta: { k: 'g3fr-share', items: e.items, k2: e.k } }) },
        { prompt: 'Find a name with bigger pieces.', q: mc('Which is the same amount?', fr(e.s, e.t), esWrongs(e), { byValue: true, hint: 'Put the ' + MANY[e.k] + ' together into ' + MANY[e.t] + '.', meta: { k: 'g3fr-es-mc', items: e.items, k2: e.k } }) }
      ] };
    };
  }

  /* ======================= Lesson 5: Groups of pieces ======================= */
  function gpCase(ds, lv) { var d = R.pick(ds), w = lv === 1 ? R.int(1, d === 2 ? 6 : 4) : lv === 2 ? R.int(2, 5) : R.int(3, d === 2 ? 10 : d === 3 ? 6 : 5); return { d: d, w: w, n: w * d }; }
  function gpFix(c) { var f = {}; f[c.n] = 'Each ' + ONE[c.d] + ' is a piece, not a whole. ' + c.d + ' ' + MANY[c.d] + ' make 1 whole.'; f[c.n * c.d] = 'Make groups of ' + c.d + '. Do not multiply.'; return f; }
  function gpSteps(c) { return [c.d + ' ' + MANY[c.d] + ' make 1 whole.', 'Count by ' + c.d + 's to ' + c.n + ': ' + c.w + ' groups.', c.n + ' ' + MANY[c.d] + ' = ' + many(c.w, 'whole', 'wholes') + '.<div class="fig">' + groupFig(c.n, c.d) + '</div>']; }
  function gpSkill(id, name, ds) {
    skill(id, name, 'B2.7', [
      [1, 'plain', function (lv) {
        var c = gpCase(ds, lv);
        return num('How many wholes do ' + c.n + ' ' + MANY[c.d] + ' make?', c.w, gpFix(c), { hint: 'Put the ' + MANY[c.d] + ' in groups of ' + c.d + '. Each group is 1 whole.', steps: gpSteps(c), explain: c.n + ' ' + MANY[c.d] + ' = ' + many(c.w, 'whole', 'wholes') + '.', meta: { k: 'g3fr-gp-whole' } });
      }],
      [1, 'picture', function (lv) {
        var c = gpCase(ds, Math.min(lv, 2));
        return num('Each piece is ' + fr(1, c.d) + ' of a circle. How many whole circles can these ' + MANY[c.d] + ' make?', c.w, gpFix(c), { fig: piecesFig(c.n, c.d),
          hint: c.d + ' pieces make 1 whole circle.', steps: gpSteps(c), explain: c.n + ' ' + MANY[c.d] + ' make ' + many(c.w, 'whole circle', 'whole circles') + '.', meta: { k: 'g3fr-gp-pic', d: c.d } });
      }, 2],
      [1, 'reverse', function (lv) {
        var c = gpCase(ds, lv), f = {};
        f[c.w] = 'Each whole has ' + c.d + ' ' + MANY[c.d] + '.';
        return num('How many ' + MANY[c.d] + ' are in ' + many(c.w, 'whole', 'wholes') + '?', c.n, f, { hint: c.d + ' ' + MANY[c.d] + ' in each whole.', steps: [c.d + ' ' + MANY[c.d] + ' in each whole.', c.w + ' &times; ' + c.d + ' = ' + c.n + '.'], explain: many(c.w, 'whole', 'wholes') + ' = ' + c.n + ' ' + MANY[c.d] + '.', meta: { k: 'g3fr-gp-rev' } });
      }],
      [1, 'match', function (lv) {
        var d = R.pick(ds), ws = R.shuffle(lv === 3 ? [3, 4, 5, 6] : [1, 2, 3, 4, 5]).slice(0, 3);
        var pairs = ws.map(function (w) { return [w * d + ' ' + MANY[d], many(w, 'whole', 'wholes')]; });
        return { q: 'Match each one to the number of wholes.', type: 'match', pairs: pairs, hint: d + ' ' + MANY[d] + ' make 1 whole.', steps: ['Count by ' + d + 's. Each ' + d + ' is one more whole.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'g3fr-gp-match' } };
      }],
      [2, 'tf', function (lv) {
        var c = gpCase(ds, lv), who = Q.name(), truth = coin(), s = truth ? c.w : R.pick([c.n, c.d === 2 ? c.n / 2 + 1 : c.n / 2, c.w + 1].filter(function (x) { return x !== c.w && x % 1 === 0; }));
        return tf(who + ' says ' + c.n + ' ' + MANY[c.d] + ' make <b>' + many(s, 'whole', 'wholes') + '</b>. True or false: ' + who + ' is right.', truth, c.d + ' ' + MANY[c.d] + ' make 1 whole. ' + c.n + ' &divide; ' + c.d + ' = ' + c.w + '.',
          ['Every piece is a whole.', 'Any 2 pieces make a whole.', 'Wholes and pieces cannot be compared.'], 'Make groups of ' + c.d + '. How many groups?', { hint: 'How many ' + MANY[c.d] + ' make 1 whole?', meta: { k: 'g3fr-gp-tf', n: c.n, d: c.d, s: s } });
      }],
      [3, 'groups', function (lv) {
        var c = gpCase(ds, lv);
        return { q: 'Fill in the blanks.', type: 'fill', fill: c.n + ' groups of ' + fr(1, c.d) + ' = [[]] ' + MANY[c.d] + ' = [[]] wholes', answers: [c.n, c.w],
          hint: 'Each group is one ' + ONE[c.d] + '.', steps: [c.n + ' groups of ' + fr(1, c.d) + ' is ' + c.n + ' ' + MANY[c.d] + '.', c.n + ' &divide; ' + c.d + ' = ' + c.w + ' wholes.'], explain: c.n + ' ' + MANY[c.d] + ' = ' + c.w + ' wholes.', meta: { k: 'g3fr-gp-fill' } };
      }]
    ]);
  }
  gpSkill('fr-ghalf', 'Groups of halves', [2]);
  gpSkill('fr-g34', 'Groups of thirds and fourths', [3, 4]);
  function tgGroups(ds, lv) {
    return function () {
      var c = gpCase(ds, lv), f1 = {}, f2 = {};
      f1[c.n] = 'That is all the pieces. How many fill one whole?'; f2[c.n] = 'Count groups, not pieces.';
      return { q: 'How many wholes do these ' + c.n + ' ' + MANY[c.d] + ' make?', fig: piecesFig(c.n, c.d), done: c.n + ' ' + MANY[c.d] + ' = ' + many(c.w, 'whole', 'wholes') + '.', steps: [
        { prompt: 'How many pieces fill one whole?', q: num('How many ' + MANY[c.d] + ' make 1 whole?', c.d, f1, { hint: 'Look at the size of one piece.', meta: { k: 'g3fr-ps-one', d: c.d } }) },
        { prompt: 'Make groups of that size.', q: num('How many groups of ' + c.d + ' are in ' + c.n + '?', c.w, f2, { hint: 'Count by ' + c.d + 's to ' + c.n + '.', meta: { k: 'g3fr-gp-groups' } }) },
        { prompt: 'Check with multiplication.', q: num(c.w + ' &times; ' + c.d + ' = ?', c.n, {}, { hint: 'Skip count by ' + c.d + '.', meta: { k: 'g3fr-mul', a: c.w, b: c.d } }) }
      ] };
    };
  }

  /* ---------- Wholes and a leftover ---------- */
  function glCase(lv) { var d = R.pick([2, 3, 4]), n, top = lv === 1 ? 2 * d + 1 : lv === 2 ? 14 : 20; do { n = R.int(lv === 3 ? 2 * d + 1 : d + 1, top); } while (n % d === 0); return { d: d, n: n, w: Math.floor(n / d), r: n % d }; }
  function glWrongs(c) {
    var W = [[String(c.w), 'Do not forget the ' + pieces(c.r, c.d) + ' left over.'], [mixed(c.w + 1, c.r, c.d), 'Count the full groups again: ' + c.d + ' in each.']];
    if (c.d - c.r !== c.r) W.push([mixed(c.w, c.d - c.r, c.d), 'That counts the pieces missing from the last whole.']);
    if (c.w < c.d && c.w !== c.r) W.push([mixed(c.r, c.w, c.d), 'Wholes first: ' + many(c.w, 'full group', 'full groups') + '.']);
    W.push([String(c.w + 1), 'The last group is not full.']);
    return W;
  }
  function glSteps(c) { return [c.d + ' ' + MANY[c.d] + ' make 1 whole.', c.w + ' full groups: ' + c.w * c.d + ' ' + MANY[c.d] + '.', pieces(c.r, c.d) + ' left: ' + mixed(c.w, c.r, c.d) + '.<div class="fig">' + groupFig(c.n, c.d) + '</div>']; }
  skill('fr-gleft', 'Wholes and a leftover', 'B2.7', [
    [1, 'plain', function (lv) {
      var c = glCase(lv);
      return mc(c.n + ' ' + MANY[c.d] + ' make how much?', mixed(c.w, c.r, c.d), glWrongs(c), { byValue: true, hint: 'Make groups of ' + c.d + '. Count the pieces left over.', steps: glSteps(c), explain: c.n + ' ' + MANY[c.d] + ' = ' + mixed(c.w, c.r, c.d) + '.', meta: { k: 'g3fr-gl-mc', n: c.n, d: c.d } });
    }],
    [1, 'picture', function (lv) {
      var c = glCase(Math.min(lv, 2));
      return mc('Each piece is ' + fr(1, c.d) + ' of a circle. How much do these ' + c.n + ' pieces make?', mixed(c.w, c.r, c.d), glWrongs(c), { byValue: true, fig: piecesFig(c.n, c.d),
        hint: c.d + ' pieces make a whole circle.', steps: glSteps(c), explain: mixed(c.w, c.r, c.d) + ' circles.', meta: { k: 'g3fr-gl-mc', n: c.n, d: c.d } });
    }, 2],
    [1, 'fill', function (lv) {
      var c = glCase(lv), w = {};
      if (c.d - c.r !== c.r) w[c.w + ', ' + (c.d - c.r)] = 'That counts the pieces missing. Count the pieces left over.';
      return { q: c.n + ' ' + MANY[c.d] + '. Fill in the blanks.', type: 'fill', fill: 'Wholes: [[]]<br>' + cap(MANY[c.d]) + ' left over: [[]]', answers: [c.w, c.r], wrong: w,
        hint: 'Make groups of ' + c.d + '.', steps: glSteps(c), explain: c.n + ' ' + MANY[c.d] + ' = ' + mixed(c.w, c.r, c.d) + '.', meta: { k: 'g3fr-gl-fill', n: c.n, d: c.d } };
    }],
    [2, 'match', function (lv) {
      var pairs = [], seen = {};
      while (pairs.length < 3) { var c = glCase(lv); if (seen[c.n / c.d]) continue; seen[c.n / c.d] = 1; pairs.push([c.n + ' ' + MANY[c.d], mixed(c.w, c.r, c.d)]); }
      return { q: 'Match each one to how much it makes.', type: 'match', pairs: pairs, hint: 'Make wholes first, then count the leftover pieces.', steps: ['7 thirds: 2 groups of 3, and 1 third left.'],
        explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'g3fr-gl-match' } };
    }],
    [2, 'tf', function (lv) {
      var c = glCase(lv), who = Q.name(), truth = coin(), said = truth ? mixed(c.w, c.r, c.d) : R.pick(glWrongs(c))[0];
      return tf(who + ' says ' + c.n + ' ' + MANY[c.d] + ' make <b>' + said + '</b>. True or false: ' + who + ' is right.', truth, c.w + ' groups of ' + c.d + ' make ' + many(c.w, 'whole', 'wholes') + ', and ' + pieces(c.r, c.d) + ' ' + (c.r === 1 ? 'is' : 'are') + ' left: ' + mixed(c.w, c.r, c.d) + '.',
        ['Leftover pieces do not count.', 'Any leftover makes one more whole.', 'Each piece is a whole.'], 'Make the groups, then count what is left.', { hint: 'Make groups of ' + c.d + '.', meta: { k: 'g3fr-gl-tf', n: c.n, d: c.d, said: said } });
    }],
    [3, 'groups', function (lv) {
      var c = glCase(lv);
      return mc(c.n + ' groups of ' + fr(1, c.d) + ' make how much?', mixed(c.w, c.r, c.d), glWrongs(c).concat([[String(c.n), 'Each group is only ' + fr(1, c.d) + ', not a whole.']]), { byValue: true,
        hint: c.n + ' groups of ' + fr(1, c.d) + ' is ' + c.n + ' ' + MANY[c.d] + '.', steps: glSteps(c), explain: c.n + ' ' + MANY[c.d] + ' = ' + mixed(c.w, c.r, c.d) + '.', meta: { k: 'g3fr-gl-mc', n: c.n, d: c.d } });
    }]
  ]);
  function tgLeft(lv) {
    return function () {
      var c = glCase(lv), f2 = {}, f3 = {};
      f2[c.w + 1] = 'The last group is not full.'; f3[c.d - c.r] = 'That counts the missing pieces. Count the ones left.';
      return { q: 'How much do these ' + c.n + ' ' + MANY[c.d] + ' make?', fig: piecesFig(c.n, c.d), done: c.n + ' ' + MANY[c.d] + ' = ' + mixed(c.w, c.r, c.d) + '.', steps: [
        { prompt: 'How many pieces fill one whole?', q: num('How many ' + MANY[c.d] + ' make 1 whole?', c.d, {}, { hint: 'Look at the size of one piece.', meta: { k: 'g3fr-ps-one', d: c.d } }) },
        { prompt: 'Make full groups.', q: num('How many full groups of ' + c.d + '?', c.w, f2, { hint: 'Count by ' + c.d + 's, but do not go past ' + c.n + '.', meta: { k: 'g3fr-gl-full', n: c.n, d: c.d } }) },
        { prompt: 'Count what is left over.', q: num('How many ' + MANY[c.d] + ' are left over?', c.r, f3, { hint: c.n + ' &minus; ' + c.w * c.d + '.', meta: { k: 'g3fr-gl-left', n: c.n, d: c.d } }) },
        { prompt: 'Wholes, then the leftover.', q: mc('So ' + c.n + ' ' + MANY[c.d] + ' =', mixed(c.w, c.r, c.d), glWrongs(c), { byValue: true, hint: c.w + ' and ' + fr(c.r, c.d) + '.', meta: { k: 'g3fr-gl-mc', n: c.n, d: c.d } }) }
      ] };
    };
  }

  /* ---------- Stories: recipes and laps ---------- */
  var GS = [
    { t: function (who, n, d) { return 'Each batch of muffins uses ' + fr(1, d) + ' cup of oats. ' + who + ' makes ' + n + ' batches. How many cups of oats is that?'; }, u: 'cups', u1: 'cup' },
    { t: function (who, n, d) { return 'One lap of the skating oval is ' + fr(1, d) + ' km. ' + who + ' skates ' + n + ' laps. How far is that?'; }, u: 'km' },
    { t: function (who, n, d) { return 'Each glass holds ' + fr(1, d) + ' L of milk. ' + who + ' fills ' + n + ' glasses. How much milk is that?'; }, u: 'L' },
    { t: function (who, n, d) { return 'Each pancake uses ' + fr(1, d) + ' cup of flour. ' + who + ' makes ' + n + ' pancakes. How much flour is that?'; }, u: 'cups', u1: 'cup' }
  ];
  function gsCase(lv) { var d = lv === 1 ? R.pick([2, 4]) : R.pick([2, 3, 4]), n = R.int(lv === 1 ? d + 1 : 2 * d + 1, lv === 1 ? 12 : lv === 2 ? 15 : 20); return { d: d, n: n, w: Math.floor(n / d), r: n % d }; }
  function gsWrongs(c) { return glWrongs(c).concat([[String(c.n), 'Each one is only ' + fr(1, c.d) + ', not 1 whole.']]); }
  skill('fr-gstory', 'Recipes and laps', 'B2.7', [
    [1, 'plain', function (lv) {
      var c = gsCase(lv), s = R.pick(GS);
      return mc(s.t(Q.name(), c.n, c.d), mixed(c.w, c.r, c.d) + ' ' + s.u, gsWrongs(c).map(function (w) { return [w[0] + ' ' + (w[0] === '1' && s.u1 || s.u), w[1]]; }), { byValue: true,
        hint: c.n + ' of them is ' + c.n + ' ' + MANY[c.d] + '. Make groups of ' + c.d + '.', steps: [c.n + ' ' + MANY[c.d] + ' in all.'].concat(glSteps(c).slice(0, 2), [mixed(c.w, c.r, c.d) + ' ' + s.u + '.']), explain: mixed(c.w, c.r, c.d) + ' ' + s.u + '.', meta: { k: 'g3fr-gs-mc', n: c.n, d: c.d } });
    }],
    [1, 'laps', function (lv) {
      var d = lv === 1 ? 2 : R.pick([2, 3, 4]), w = R.int(lv === 1 ? 1 : 2, lv === 1 ? 4 : 5), n = w * d, who = Q.name(), f = {};
      f[n] = 'Each lap is only ' + fr(1, d) + ' km.';
      return num('One lap of the ski trail is ' + fr(1, d) + ' km. ' + who + ' skis ' + n + ' laps. How many kilometres is that?', w, f, { unit: 'km',
        hint: d + ' laps make 1 km.', steps: [d + ' laps of ' + fr(1, d) + ' km make 1 km.', n + ' &divide; ' + d + ' = ' + w + '.'], explain: n + ' laps = ' + w + ' km.', meta: { k: 'g3fr-gs-num' } });
    }],
    [2, 'scoops', function (lv) {
      var d = R.pick([2, 3, 4]), w = R.int(2, lv === 3 ? 5 : 3), who = Q.name(), f = {};
      f[w] = 'Each scoop is only ' + fr(1, d) + ' cup. ' + d + ' scoops fill 1 cup.'; f[d] = 'That fills just 1 cup. ' + who + ' needs ' + w + ' cups.';
      return num(who + ' needs ' + w + ' cups of flour. The scoop holds ' + fr(1, d) + ' cup. How many scoops does ' + who + ' need?', w * d, f, {
        hint: 'How many scoops fill 1 cup?', steps: [d + ' scoops fill 1 cup.', w + ' &times; ' + d + ' = ' + w * d + ' scoops.'], explain: w * d + ' scoops.', meta: { k: 'g3fr-gs-scoops' } });
    }],
    [2, 'tf', function (lv) {
      var c = gsCase(lv), who = Q.name(), truth = coin(), said = truth ? mixed(c.w, c.r, c.d) : R.pick([String(c.n), mixed(c.w + 1, c.r, c.d), String(c.w)].filter(function (x) { return x !== mixed(c.w, c.r, c.d); }));
      return tf('One lap of the track is ' + fr(1, c.d) + ' km. ' + who + ' runs ' + c.n + ' laps and says that is <b>' + said + ' km</b>. True or false: ' + who + ' is right.', truth,
        c.n + ' laps of ' + fr(1, c.d) + ' km is ' + c.n + ' ' + MANY[c.d] + ' of a km: ' + mixed(c.w, c.r, c.d) + ' km.', ['Each lap is 1 km.', 'Leftover laps do not count.', 'Laps and kilometres are the same.'], 'Make groups of ' + c.d + ' laps: each group is 1 km.',
        { hint: 'How many laps make 1 km?', meta: { k: 'g3fr-gs-tf', n: c.n, d: c.d, said: said } });
    }],
    [3, 'fill', function (lv) {
      var c = gsCase(lv), who = Q.name();
      return { q: 'Each batch of bannock uses ' + fr(1, c.d) + ' cup of milk. ' + who + ' makes ' + c.n + ' batches. Fill in the blanks.', type: 'fill', fill: 'Whole cups: [[]]<br>' + cap(MANY[c.d]) + ' of a cup more: [[]]', answers: [c.w, c.r],
        hint: c.n + ' ' + MANY[c.d] + ': make groups of ' + c.d + '.', steps: glSteps(c), explain: mixed(c.w, c.r, c.d) + ' cups.', meta: { k: 'g3fr-gs-fill', n: c.n, d: c.d } };
    }]
  ]);
  function tgStory(lv) {
    return function () {
      var c = gsCase(lv), s = GS[lv - 1], f1 = {};
      f1[c.d] = 'That is the bottom number. How many times is it used?';
      return { q: s.t(Q.name(), c.n, c.d), fig: piecesFig(c.n, c.d), done: mixed(c.w, c.r, c.d) + ' ' + s.u + '.', steps: [
        { prompt: 'Each one is a piece. Count the pieces.', q: num('How many ' + MANY[c.d] + ' in all?', c.n, f1, { hint: 'One ' + ONE[c.d] + ' each time.', meta: { k: 'g3fr-gs-n', n: c.n } }) },
        { prompt: 'Make full groups: each one is 1 whole.', q: num('How many full groups of ' + c.d + '?', c.w, {}, { hint: 'Count by ' + c.d + 's.', meta: { k: 'g3fr-gl-full', n: c.n, d: c.d } }) },
        { prompt: 'Wholes, then the leftover.', q: mc('So how much is that?', mixed(c.w, c.r, c.d) + ' ' + s.u, gsWrongs(c).map(function (w) { return [w[0] + ' ' + (w[0] === '1' && s.u1 || s.u), w[1]]; }), { byValue: true, hint: c.w + ' and ' + fr(c.r, c.d) + '.', meta: { k: 'g3fr-gs-mc', n: c.n, d: c.d } }) }
      ] };
    };
  }

  /* ======================= Lesson 6: Don't mix them up ======================= */
  function mixCase(lv, type) {
    type = type || R.pick(lv === 1 ? ['unit', 'samebot'] : lv === 2 ? ['unit', 'samebot', 'sametop'] : ['unit', 'samebot', 'sametop', 'sametop', 'equal']);
    var a, b, p, n;
    if (type === 'unit') { p = R.shuffle(lv === 1 ? [2, 3, 4, 6, 8] : DS); a = [1, p[0]]; b = [1, p[1]]; }
    else if (type === 'samebot') { var d = R.pick(lv === 1 ? [4, 5, 6, 8] : DS.slice(2)), ns = R.shuffle(Array.apply(null, Array(d - 1)).map(function (_, i) { return i + 1; })); a = [ns[0], d]; b = [ns[1], d]; }
    else if (type === 'sametop') { p = R.shuffle(DS.slice(2)); n = R.int(2, Math.min(p[0], p[1]) - 1); a = [n, p[0]]; b = [n, p[1]]; }
    else { var q = R.pick(famPairs([2, 4, 8]).concat(famPairs([3, 6]), famPairs([5, 10]))); a = [q[0], q[1]]; b = [q[2], q[3]]; if (coin()) { p = a; a = b; b = p; } }
    return { type: type, a: a, b: b, c: a[0] * b[1] > b[0] * a[1] ? 0 : a[0] * b[1] < b[0] * a[1] ? 1 : 2 };
  }
  function mixFix(m, chose) {
    var big = m.c === 0 ? m.a : m.b, small = m.c === 0 ? m.b : m.a;
    if (chose === 2) return m.type === 'samebot' ? 'Count the pieces: ' + m.a[0] + ' and ' + m.b[0] + '.' : 'The pieces are different sizes. Draw both bars.';
    if (m.type === 'unit') return small[1] + ' is bigger than ' + big[1] + ', but ' + MANY[small[1]] + ' are smaller pieces. More pieces, smaller pieces.';
    if (m.type === 'samebot') return 'Same-size pieces, so more pieces is more: ' + big[0] + ' is more than ' + small[0] + '.';
    if (m.type === 'sametop') return 'The same number of pieces, but ' + MANY[big[1]] + ' are bigger than ' + MANY[small[1]] + '.';
    return 'Draw both bars: they end in the same place.';
  }
  function mixSteps(m) {
    var big = m.c === 0 ? m.a : m.b, s = m.type === 'samebot' ? ['The bottom numbers match: same-size pieces.', 'Compare how many: ' + m.a[0] + ' and ' + m.b[0] + '.'] : m.type === 'equal' ? ['Line up the bars.', 'They end in the same place.'] : ['The top numbers match: the same number of pieces.', cap(MANY[Math.min(m.a[1], m.b[1])]) + ' are bigger pieces than ' + MANY[Math.max(m.a[1], m.b[1])] + '.'];
    return s.concat([(m.c === 2 ? 'They are the same.' : fr(big[0], big[1]) + ' is more.') + '<div class="fig">' + bars([m.a, m.b], true) + '</div>']);
  }
  function mixAsk(q, m, x) {
    var o = R.shuffle([fr(m.a[0], m.a[1]), fr(m.b[0], m.b[1])]).concat(['They are the same']), right = m.c === 2 ? 2 : o.indexOf(m.c === 0 ? fr(m.a[0], m.a[1]) : fr(m.b[0], m.b[1])), f = [];
    o.forEach(function (_, j) { f[j] = mixFix(m, j === 2 ? 2 : 0); });
    return fixed(q, o, right, f, put({ hint: 'Which number is the same in both? Then compare.', steps: mixSteps(m), explain: m.c === 2 ? 'They are the same amount.' : fr((m.c ? m.b : m.a)[0], (m.c ? m.b : m.a)[1]) + ' is more.', meta: { k: 'g3fr-mix-mc', a: m.a, b: m.b } }, x || {}));
  }
  skill('fr-mix', 'Bigger piece or more pieces?', 'B1.6, B1.7', [
    [1, 'plain', function (lv) { var m = mixCase(lv); return mixAsk('Which is more: ' + fr(m.a[0], m.a[1]) + ' or ' + fr(m.b[0], m.b[1]) + '?', m); }],
    [1, 'picture', function (lv) { var m = mixCase(1); return mixAsk('Look at the bars. Which is more?', m, { fig: bars([m.a, m.b], true) }); }, 1],
    [1, 'tf', function (lv) {
      var m = mixCase(lv), who = Q.name(), x = m.c === 1 ? m.b : m.a, y = m.c === 1 ? m.a : m.b, truth;
      if (coin()) { x = y; y = m.c === 1 ? m.b : m.a; }
      truth = x[0] * y[1] > y[0] * x[1];
      var right = m.type === 'samebot' ? 'Same-size pieces: ' + fr(Math.max(x[0], y[0]), x[1]) + ' has more of them.' : m.type === 'equal' ? fr(x[0], x[1]) + ' and ' + fr(y[0], y[1]) + ' are the same amount.' : cap(MANY[Math.min(x[1], y[1])]) + ' are bigger pieces than ' + MANY[Math.max(x[1], y[1])] + '.';
      return tf(who + ' says ' + fr(x[0], x[1]) + ' is more than ' + fr(y[0], y[1]) + '. True or false: ' + who + ' is right.', truth, right,
        ['The bigger bottom number is always more.', 'Fractions with the same top number are always equal.', 'The fraction with the biggest number in it is more.'], mixFix({ type: m.type, a: x, b: y, c: truth ? 0 : x[0] * y[1] === y[0] * x[1] ? 2 : 1 }, 0),
        { hint: 'Which number is the same? Then compare.', meta: { k: 'g3fr-mix-tf', x: x, y: y } });
    }],
    [2, 'order', function (lv) {
      var type = R.pick(['unit', 'sametop', 'samebot']), list;
      if (type === 'unit') list = R.shuffle(DS).slice(0, 3).map(function (d) { return [1, d]; });
      else if (type === 'sametop') { var n = R.int(2, 4); list = R.shuffle(DS.filter(function (d) { return d > n; })).slice(0, 3).map(function (d) { return [n, d]; }); }
      else { var d = R.pick([6, 8, 10]); list = R.shuffle(Array.apply(null, Array(d - 1)).map(function (_, i) { return i + 1; })).slice(0, 3).map(function (k) { return [k, d]; }); }
      list.sort(function (p, q) { return p[0] / p[1] - q[0] / q[1]; });
      return { q: 'Put these in order from <b>least</b> to <b>greatest</b>.', type: 'order', items: list.map(function (p) { return fr(p[0], p[1]); }), first: 'least', last: 'greatest',
        hint: type === 'samebot' ? 'Same-size pieces: fewer pieces is less.' : 'Same number of pieces: smaller pieces is less. More pieces in the whole, smaller pieces.', steps: [type === 'samebot' ? 'The bottoms match: compare the tops.' : 'The tops match: compare piece sizes.'],
        explain: list.map(function (p) { return fr(p[0], p[1]); }).join(', ') + '.', meta: { k: 'g3fr-mix-order' } };
    }],
    [3, 'pick', function (lv) {
      var unit = coin(), t, more, less;
      if (unit) { t = [1, R.pick([3, 4, 5, 6])]; more = DS.filter(function (d) { return d < t[1]; }).map(function (d) { return [1, d]; }); less = DS.filter(function (d) { return d > t[1]; }).map(function (d) { return [1, d]; }); }
      else { var d = R.pick([6, 8, 10]); t = [R.int(2, d - 3), d]; more = []; less = []; for (var k = 1; k < d; k++) if (k !== t[0]) (k > t[0] ? more : less).push([k, d]); }
      var nm = R.int(1, Math.min(2, more.length)), opts = R.shuffle(R.shuffle(more).slice(0, nm).concat(R.shuffle(less).slice(0, 4 - nm)));
      var ans = []; opts.forEach(function (p, j) { if (p[0] * t[1] > t[0] * p[1]) ans.push(j); });
      return { q: 'Pick <b>every</b> fraction that is more than ' + fr(t[0], t[1]) + '.', type: 'pick', options: opts.map(function (p) { return fr(p[0], p[1]); }), answer: ans,
        hint: unit ? 'All have 1 on top: bigger pieces are more. Fewer pieces in the whole means bigger pieces.' : 'Same-size pieces: more of them is more.', steps: [unit ? 'Same top: look for bigger pieces, so smaller bottom numbers.' : 'Same bottom: look for bigger top numbers.'],
        explain: ans.map(function (j) { return fr(opts[j][0], opts[j][1]); }).join(', ') + '.', meta: { k: 'g3fr-mix-pick', t: t } };
    }]
  ]);
  function tgMix(type) {
    return function () {
      var m = mixCase(2, type), top = m.a[0] === m.b[0], fa = fr(m.a[0], m.a[1]), fb = fr(m.b[0], m.b[1]), second;
      if (top) {
        var bigger = m.a[1] < m.b[1] ? 0 : 1, nm = [cap(MANY[m.a[1]]), cap(MANY[m.b[1]]), 'They are the same size'];
        second = { prompt: 'The same number of pieces. Which pieces are bigger?', q: fixed('Which pieces are bigger?', nm, bigger, ['More pieces in the whole means smaller pieces.', 'More pieces in the whole means smaller pieces.', 'The wholes are cut into different numbers of pieces.'], { hint: 'Fewer pieces in the whole, bigger pieces.', meta: { k: 'g3fr-mix-big', a: m.a, b: m.b } }) };
      } else {
        var more = m.a[0] > m.b[0] ? 0 : 1;
        second = { prompt: 'Same-size pieces. Which has more of them?', q: fixed('Which has more pieces?', [fa, fb, 'The same number'], more, ['Look at the top numbers.', 'Look at the top numbers.', 'Look at the top numbers: they are different.'], { hint: 'The top number counts the pieces.', meta: { k: 'g3fr-mix-more', a: m.a, b: m.b } }) };
      }
      return { q: 'Which is more: ' + fa + ' or ' + fb + '?', done: (m.c ? fb : fa) + ' is more.', steps: [
        { prompt: 'Look for the number that matches.', q: fixed('Which number is the same in both?', ['The top number', 'The bottom number', 'Neither'], top ? 0 : 1, ['Look at the bottom numbers: ' + m.a[1] + ' and ' + m.b[1] + '.', 'Look at the top numbers: ' + m.a[0] + ' and ' + m.b[0] + '.', 'Look again: one pair of numbers matches.'], { hint: 'Compare the tops, then the bottoms.', meta: { k: 'g3fr-mix-same', a: m.a, b: m.b } }) },
        second,
        { prompt: 'So which is more?', q: mixAsk('Which is more?', m) }
      ] };
    };
  }

  /* ======================= Watch and My turn clips ======================= */
  var cutV = function (s) { return cutFig(s.ws, s.kind); };
  var shapeV = function (s) { return shape(s.kind, s.n, s.d); };
  var unitV = function (s) { return unitLine(s.n, s.d) + (s.bar ? bar(Math.min(s.n, s.d), s.d, 300) + (s.n > s.d ? bar(s.n - s.d, s.d, 300) : '') : ''); };
  var groupV = function (s) { return s.grouped ? groupFig(s.n, s.d) : piecesFig(s.n, s.d); };
  var barsV = function (s) { return bars(s.rows, s.label); };
  function count(from, to, d, extra) { var p = []; for (var i = from; i <= to; i++) p.push(put({ n: i, d: d }, extra || {})); return p; }

  /* ======================= The lessons ======================= */
  var LESSONS = [
    { id: 'parts', title: 'Equal parts', sub: 'Equal parts, and the names of the pieces.', concepts: [
      { id: 'equal', title: 'Parts must be equal', exp: ['B1.6'], skill: 'fr-equal',
        watch: clip(cutV, { ws: [2, 1], kind: 'bar' }, [
          ['Two parts. Is each one a half?'],
          ['No. One part is bigger than the other.'],
          ['Now both parts are the same size. Each one is one half.', { ws: [1, 1] }]
        ]),
        example: clip(cutV, { ws: [1, 1, 1.8, 1], kind: 'pie' }, [
          ['My turn. A circle in 4 parts. Fourths?'],
          ['I check the sizes. One part is bigger, so these are not fourths.'],
          ['I cut 4 parts that match. Now each one is one fourth.', { ws: [1, 1, 1, 1] }]
        ]),
        try: { tool: 'fractions', opts: { parts: 1, choices: [1, 2, 3, 4, 6, 8] }, tasks: [
          { do: 'Cut the bar into <b>4 equal parts</b>. Shade one of them.', goal: function (s) { return s[0].d === 4 && s[0].n === 1; }, yes: 'One of 4 equal parts: one fourth.' },
          { do: 'Cut it into <b>thirds</b> and shade them all.', goal: function (s) { return s[0].d === 3 && s[0].n === 3; }, yes: 'Three thirds: the whole bar.' }
        ] },
        together: [tgEqual('unequal'), tgEqual('count'), tgEqual('any')],
        mistake: '<p>Calling any one of 2 parts "a half", even when the parts are different sizes. Ask: "Are the parts the same size?" before naming any fraction.</p>',
        check: [ck('fr-equal', 'plain', 1), ck('fr-equal', 'tap', 1), ck('fr-equal', 'story', 2), ck('fr-equal', 'tf', 2), ck('fr-equal', 'plain', 3)] },

      { id: 'piece', title: 'Name the piece', exp: ['B1.6'], skill: 'fr-piece',
        watch: clip(shapeV, { kind: 'bar', d: 2, n: 1 }, [
          ['2 equal parts. Each part is one half.'],
          ['3 equal parts: each is one third.', { d: 3 }],
          ['4 equal parts: each is one fourth.', { d: 4 }],
          ['One fourth is written like this.', { sym: fr(1, 4) }]
        ]),
        example: clip(shapeV, { kind: 'pie', d: 5, n: 1 }, [
          ['My turn. I count 5 equal parts, so each is one fifth.'],
          ['8 equal parts: one eighth.', { d: 8 }],
          ['3 parts? Not "one threeth". It is one third.', { d: 3 }],
          ['10 equal parts: one tenth.', { d: 10, sym: fr(1, 10) }]
        ]),
        together: [tgPiece(1), tgPiece(2), tgPiece(3)],
        mistake: '<p>Naming the piece by counting only the shaded part, or saying "one twoth" or "one threeth". Ask: "How many equal parts make the whole?" Then say the names together: half, third, fourth, fifth, sixth, eighth, tenth.</p>',
        check: [ck('fr-piece', 'plain', 1), ck('fr-piece', 'symbol', 1), ck('fr-piece', 'tap', 2), ck('fr-piece', 'story', 2), ck('fr-piece', 'tf', 3)] },

      { id: 'name', title: 'Top and bottom numbers', exp: ['B1.6'], skill: 'fr-name',
        watch: clip(shapeV, { kind: 'pie', d: 4, n: 0 }, [
          ['Count all the equal parts: 4. That is the bottom number.'],
          ['Count the shaded parts: 3. That is the top number.', [{ n: 1 }, { n: 2 }, { n: 3 }]],
          ['Say it: three fourths.', { sym: fr(3, 4) }]
        ]),
        example: clip(shapeV, { kind: 'bar', d: 6, n: 0 }, [
          ['My turn. I count all the parts: 6. That goes on the bottom.'],
          ['I count the shaded parts: 5. That goes on top.', [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }]],
          ['Five sixths. Not 6 over 5: all the parts go on the bottom.', { sym: fr(5, 6) }]
        ]),
        try: { mount: G3.play({ state: { kind: 'grid', d: 6, n: 2 }, draw: function (s) { return shape(s.kind, s.n, s.d); },
          selects: [{ key: 'kind', label: 'Shape', options: [['bar', 'bar'], ['pie', 'circle'], ['grid', 'rectangle']] }, { key: 'd', label: 'Equal parts', options: [[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6'], [8, '8'], [10, '10']], change: function (s) { if (s.n > s.d) s.n = s.d; } }],
          sliders: [{ key: 'n', label: 'Shaded', min: 0, max: 10 }],
          info: function (s) { return s.n > s.d ? 'There are only ' + s.d + ' parts.' : '<span class="big">' + fr(s.n, s.d) + '</span> ' + words(s.n, s.d); },
          tasks: [{ do: 'Show <b>' + fr(5, 8) + '</b>.', goal: function (s) { return s.d === 8 && s.n === 5; }, yes: '5 of 8 equal parts: five eighths.' },
            { do: 'Show <b>' + fr(2, 5) + '</b> on a circle.', goal: function (s) { return s.d === 5 && s.n === 2 && s.kind === 'pie'; }, yes: 'Two fifths.' }] }), do: '' },
        together: [tgName(1), tgName(2), tgName(3)],
        mistake: '<p>Flipping the numbers (writing 4 over 3), or putting the white parts on the bottom (3 over 1). Point and ask: "How many parts in all? That goes on the bottom."</p>',
        check: [ck('fr-name', 'plain', 1), ck('fr-name', 'fill', 1), ck('fr-name', 'tap', 2), ck('fr-name', 'not', 2), ck('fr-name', 'tf', 3)] }
    ] },

    { id: 'share', title: 'Fair shares', sub: 'Everyone gets the same amount.', concepts: [
      { id: 'wholes', title: 'Hand out wholes first', exp: ['B1.6'], skill: 'fr-deal',
        watch: clip(shareFig, { items: 7, k: 3, r: 0 }, [
          ['7 granola bars, 3 friends.'],
          ['Give one bar to each friend.', { r: 1 }],
          ['Again: one more each.', { r: 2 }],
          ['1 bar is left. Not enough for another round.']
        ]),
        example: clip(shareFig, { items: 10, k: 4, r: 0 }, [
          ['My turn. 10 bars, 4 people.'],
          ['I give one to each person, then one more.', [{ r: 1 }, { r: 2 }]],
          ['Each gets 2. Another round? No: 2 bars, but 4 people.']
        ]),
        together: [tgDeal(1), tgDeal(2), tgDeal(3)],
        mistake: '<p>Stopping too early (giving 2 each when there are enough for 3), or giving the extras to one person. Ask: "Can everyone get one more?" Check with multiplication: people &times; bars each.</p>',
        check: [ck('fr-deal', 'plain', 1), ck('fr-deal', 'whole', 1), ck('fr-deal', 'story', 2), ck('fr-deal', 'tf', 2), ck('fr-deal', 'times', 3)] },

      { id: 'cut', title: 'Cut the leftovers', exp: ['B1.6'], skill: 'fr-share',
        watch: clip(shareFig, { items: 5, k: 2, r: 0 }, [
          ['5 bars, 2 people.'],
          ['2 whole bars each. 1 bar is left.', [{ r: 1 }, { r: 2 }]],
          ['2 people, so cut it into 2 equal pieces.', { cut: true }],
          ['Each person gets 2 and ' + fr(1, 2) + ' bars.', { give: true }]
        ]),
        example: clip(shareFig, { items: 7, k: 3, r: 0 }, [
          ['My turn. 7 bars, 3 people.'],
          ['I hand out 2 each. 1 is left.', [{ r: 1 }, { r: 2 }]],
          ['Cut it into 7? No: 3 people, so 3 pieces.', { cut: true }],
          ['Each gets 2 and ' + fr(1, 3) + '.', { give: true }]
        ]),
        try: { mount: G3.play({ state: { items: 7, k: 2 }, draw: function (s) { return shareFig({ items: s.items, k: s.k, r: Math.floor(s.items / s.k), give: true }); },
          sliders: [{ key: 'items', label: 'Bars', min: 1, max: 20 }],
          selects: [{ key: 'k', label: 'People', options: [[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6'], [8, '8'], [10, '10']] }],
          info: function (s) { return 'Each person gets <b>' + share(s.items, s.k) + '</b>'; },
          tasks: [{ do: 'Share <b>4 bars</b> among <b>3 people</b>.', goal: function (s) { return s.items === 4 && s.k === 3; }, yes: '1 whole and ' + fr(1, 3) + ' each.' },
            { do: 'Find a share of <b>1 and ' + fr(1, 2) + '</b> bars each.', goal: function (s) { return s.items * 2 === s.k * 3; }, yes: function (s) { return s.items + ' bars among ' + s.k + ' people.'; } }] }), do: '' },
        together: [tgCut(1), tgCut(2), tgCut(3)],
        mistake: '<p>Cutting the leftover by the number of bars instead of the number of people (7 bars among 3: cutting into sevenths). Ask: "How many people need a piece?"</p>',
        check: [ck('fr-share', 'plain', 1), ck('fr-share', 'pieces', 1), ck('fr-share', 'fill', 2), ck('fr-share', 'story', 2), ck('fr-share', 'plain', 3)] },

      { id: 'fewer', title: 'Fewer things than people', exp: ['B1.6'], skill: 'fr-fewer',
        watch: clip(shareFig, { items: 3, k: 4 }, [
          ['3 bars, 4 friends. Not enough for one each.'],
          ['Cut every bar into 4 equal pieces.', { cut: true }],
          ['Each friend takes one piece from each bar.', { give: true }],
          ['3 pieces of one fourth: ' + fr(3, 4) + ' each.']
        ]),
        example: clip(shareFig, { items: 2, k: 5 }, [
          ['My turn. 2 bannocks, 5 people.'],
          ['I cut each one into 5 equal pieces.', { cut: true }],
          ['Each person gets 2 pieces: ' + fr(2, 5) + '.', { give: true }],
          ['Is it ' + fr(1, 2) + '? No: 5 people, so fifths.']
        ]),
        together: [tgFewer(1), tgFewer(2), tgFewer(3)],
        mistake: '<p>Writing the share upside down (4 over 3), or giving each person only one piece in all. Ask: "How many pieces does each person get, and what size is each piece?"</p>',
        check: [ck('fr-fewer', 'plain', 1), ck('fr-fewer', 'fill', 1), ck('fr-fewer', 'tap', 2), ck('fr-fewer', 'story', 2), ck('fr-fewer', 'tf', 3)] },

      { id: 'compare', title: 'Compare two shares', exp: ['B1.6'], skill: 'fr-cmpshare',
        watch: clip(compareFig, { a: [1, 2], b: [1, 4] }, [
          ['Each group shares one bar. Who gets more?'],
          ['Here is one share from each group, drawn to size.', { show: true }],
          ['Each person in A gets more. More people, smaller shares.']
        ]),
        example: clip(compareFig, { a: [6, 3], b: [6, 4] }, [
          ['My turn. The same bars, but different numbers of people.'],
          ['A gets 2 each. B gets 1 and ' + fr(2, 4) + ' each.', { show: true }],
          ['4 is more than 3, but each share in B is smaller. A gets more.']
        ]),
        together: [tgCompare(1), tgCompare(2), tgCompare(3)],
        mistake: '<p>Thinking the group with more people gets more ("4 is more than 3"). Draw one share from each group under the other and compare the lengths.</p>',
        check: [ck('fr-cmpshare', 'plain', 1), ck('fr-cmpshare', 'which', 1), ck('fr-cmpshare', 'story', 2), ck('fr-cmpshare', 'tf', 2), ck('fr-cmpshare', 'plain', 3)] }
    ] },

    { id: 'unit', title: 'Build with unit fractions', sub: 'Count pieces to make a fraction.', concepts: [
      { id: 'count', title: 'Count unit pieces', exp: ['B2.8'], skill: 'fr-count',
        watch: clip(shapeV, { kind: 'bar', d: 5, n: 0 }, [
          ['Each piece is one fifth.'],
          ['Count them: one fifth, two fifths, three fifths.', [{ n: 1 }, { n: 2 }, { n: 3 }]],
          ['The pieces stay fifths.', { sym: fr(1, 5) + ' + ' + fr(1, 5) + ' + ' + fr(1, 5) + ' = ' + fr(3, 5) }]
        ]),
        example: clip(unitV, { n: 0, d: 6, bar: true }, [
          ['My turn. Each jump is one sixth.'],
          ['I count four jumps: four sixths.', count(1, 4, 6)],
          ['Is it 4 over 24? No: the pieces are still sixths.', { sym: fr(4, 6) }]
        ]),
        try: { tool: 'fractions', opts: { parts: 6, choices: [2, 3, 4, 5, 6, 8, 10] }, tasks: [
          { do: 'Shade <b>' + fr(4, 6) + '</b>, one sixth at a time.', goal: function (s) { return s[0].d === 6 && s[0].n === 4; }, yes: 'Four sixths: ' + fr(1, 6) + ' four times.' },
          { do: 'Cut into eighths and shade <b>' + fr(3, 8) + '</b>.', goal: function (s) { return s[0].d === 8 && s[0].n === 3; }, yes: 'Three eighths.' }
        ] },
        together: [tgCount(1), tgCount(2), tgCount(3)],
        mistake: '<p>Adding the bottom numbers too (' + fr(1, 3) + ' + ' + fr(1, 3) + ' = ' + fr(2, 6) + '). Ask: "Did the pieces change size?" Count the pieces aloud: "one third, two thirds".</p>',
        check: [ck('fr-count', 'plain', 1), ck('fr-count', 'fill', 1), ck('fr-count', 'line', 2), ck('fr-count', 'picture', 2), ck('fr-count', 'tf', 3)] },

      { id: 'top', title: 'The top number counts the pieces', exp: ['B2.8'], skill: 'fr-top',
        watch: clip(shapeV, { kind: 'bar', d: 6, n: 0, sym: fr(4, 6) }, [
          ['The bottom number names the piece: sixths.'],
          ['Count 4 of them.', [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }]],
          ['Four sixths, as an addition.', { sym: fr(4, 6) + ' = ' + fr(1, 6) + ' + ' + fr(1, 6) + ' + ' + fr(1, 6) + ' + ' + fr(1, 6) }]
        ]),
        example: clip(shapeV, { kind: 'bar', d: 8, n: 0, sym: fr(5, 8) }, [
          ['My turn. ' + fr(5, 8) + ': each piece is one eighth.'],
          ['I count 5 eighths.', [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }]],
          ['Is it 8 pieces? No: 8 tells the size. 5 pieces.']
        ]),
        together: [tgTop(1), tgTop(2), tgTop(3)],
        mistake: '<p>Counting the bottom number as the number of pieces (saying ' + fr(3, 8) + ' is 8 pieces). Point: "The bottom tells the size of each piece. The top tells how many."</p>',
        check: [ck('fr-top', 'plain', 1), ck('fr-top', 'sum', 1), ck('fr-top', 'order', 2), ck('fr-top', 'tf', 2), ck('fr-top', 'story', 3)] },

      { id: 'whole', title: 'Past one whole', exp: ['B2.8'], skill: 'fr-past',
        watch: clip(unitV, { n: 0, d: 4, bar: true }, [
          ['Count fourths: one, two, three.', count(1, 3, 4)],
          ['Four fourths fill one whole.', { n: 4 }],
          ['One more fourth goes past 1.', { n: 5 }],
          ['Five fourths: 1 whole and one more fourth.', { sym: fr(5, 4) + ' = 1 and ' + fr(1, 4) }]
        ]),
        example: clip(unitV, { n: 0, d: 5, bar: true }, [
          ['My turn. I count fifths.', count(1, 4, 5)],
          ['Five fifths make one whole.', { n: 5 }],
          ['Two more fifths: seven fifths.', [{ n: 6 }, { n: 7 }]],
          ['7 wholes? No: 1 whole, and 2 fifths more.', { sym: fr(7, 5) + ' = 1 and ' + fr(2, 5) }]
        ]),
        try: { mount: G3.play({ state: { d: 3, n: 2, bar: true }, draw: unitV,
          selects: [{ key: 'd', label: 'Piece size', options: [[2, 'halves'], [3, 'thirds'], [4, 'fourths'], [5, 'fifths'], [6, 'sixths'], [8, 'eighths'], [10, 'tenths']], change: function (s) { if (s.n > 2 * s.d) s.n = 2 * s.d; } }],
          sliders: [{ key: 'n', label: 'Pieces', min: 0, max: 20 }],
          info: function (s) { return s.n > 2 * s.d ? 'Try fewer pieces.' : '<span class="big">' + fr(s.n, s.d) + '</span> ' + (s.n >= s.d ? '= ' + mixed(Math.floor(s.n / s.d), s.n % s.d, s.d) : words(s.n, s.d)); },
          tasks: [{ do: 'Show <b>one whole</b> made of thirds.', goal: function (s) { return s.d === 3 && s.n === 3; }, yes: fr(3, 3) + ' = 1.' },
            { do: 'Show <b>1 and ' + fr(3, 6) + '</b>.', goal: function (s) { return s.d === 6 && s.n === 9; }, yes: fr(9, 6) + ' = 1 and ' + fr(3, 6) + '.' }] }), do: '' },
        together: [tgPast(1), tgPast(2), tgPast(3)],
        mistake: '<p>Thinking a fraction can never be more than 1, or reading ' + fr(7, 5) + ' as 7 wholes. Count along the number line together and stop at 1: "How many fifths did that take?"</p>',
        check: [ck('fr-past', 'plain', 1), ck('fr-past', 'fill', 1), ck('fr-past', 'line', 2), ck('fr-past', 'tf', 2), ck('fr-past', 'plain', 3)] }
    ] },

    { id: 'equiv', title: 'Same amount, different names', sub: 'One amount can have more than one name.', concepts: [
      { id: 'same', title: 'Halves, fourths, eighths', exp: ['B1.7'], skill: 'fr-eq248',
        watch: clip(barsV, { rows: [[1, 2]] }, [
          ['One half is shaded.'],
          ['Cut each half into 2 pieces: fourths. 2 fourths line up.', { rows: [[1, 2], [2, 4]] }],
          ['Cut again: eighths. 4 eighths line up too.', { rows: [[1, 2], [2, 4], [4, 8]] }],
          ['One amount, three names.', { sym: fr(1, 2) + ' = ' + fr(2, 4) + ' = ' + fr(4, 8) }]
        ]),
        example: clip(barsV, { rows: [[3, 4]] }, [
          ['My turn. I shade 3 fourths.'],
          ['Is it 3 eighths? No: that stops short.', { rows: [[3, 4], [3, 8]] }],
          ['Each fourth is 2 eighths, so I shade 6.', { rows: [[3, 4], [6, 8]] }],
          ['The ends line up.', { sym: fr(3, 4) + ' = ' + fr(6, 8) }]
        ]),
        try: { tool: 'fractions', opts: { wall: [2, 4, 8] }, tasks: [
          { do: 'Shade <b>one half</b> on top. Then shade the <b>fourths</b> that match it.', goal: function (s) { return s[0].n === 1 && s[1].n === 2; }, yes: fr(1, 2) + ' = ' + fr(2, 4) + '.' },
          { do: 'Now shade the <b>eighths</b> that match too.', reset: false, goal: function (s) { return s[0].n === 1 && s[1].n === 2 && s[2].n === 4; }, yes: fr(1, 2) + ' = ' + fr(2, 4) + ' = ' + fr(4, 8) + '.' }
        ] },
        together: [tgEqv([2, 4, 8], 1), tgEqv([2, 4, 8], 2), tgEqv([2, 4, 8], 3)],
        mistake: '<p>Keeping the top number the same (' + fr(3, 4) + ' = ' + fr(3, 8) + '). Ask: "The pieces got smaller. Do you need more of them or fewer?" Line up the bars from the left edge.</p>',
        check: [ck('fr-eq248', 'plain', 1), ck('fr-eq248', 'tap', 1), ck('fr-eq248', 'mc', 2), ck('fr-eq248', 'tf', 2), ck('fr-eq248', 'plain', 3)] },

      { id: 'sixths', title: 'Thirds and sixths', exp: ['B1.7'], skill: 'fr-eq36',
        watch: clip(barsV, { rows: [[1, 3]] }, [
          ['One third is shaded.'],
          ['Cut each third into 2 pieces: sixths.', { rows: [[1, 3], [0, 6]] }],
          ['2 sixths cover the same part of the bar.', { rows: [[1, 3], [2, 6]] }],
          ['Same amount, two names.', { sym: fr(1, 3) + ' = ' + fr(2, 6) }]
        ]),
        example: clip(barsV, { rows: [[2, 3]] }, [
          ['My turn. I shade 2 thirds.'],
          ['2 sixths? No: that is too short.', { rows: [[2, 3], [2, 6]] }],
          ['Each third is 2 sixths, so 2 thirds make 4 sixths.', { rows: [[2, 3], [4, 6]] }],
          ['The shading ends in the same place.', { sym: fr(2, 3) + ' = ' + fr(4, 6) }]
        ]),
        try: { tool: 'fractions', opts: { wall: [3, 6] }, tasks: [
          { do: 'Shade <b>one third</b> on top. Then shade the <b>sixths</b> that match it.', goal: function (s) { return s[0].n === 1 && s[1].n === 2; }, yes: fr(1, 3) + ' = ' + fr(2, 6) + '.' },
          { do: 'Now make it <b>two thirds</b>, and match it with sixths.', reset: false, goal: function (s) { return s[0].n === 2 && s[1].n === 4; }, yes: fr(2, 3) + ' = ' + fr(4, 6) + '.' }
        ] },
        together: [tgEqv([3, 6], 1), tgEqv([3, 6], 2), tgEqv([3, 6], 3)],
        mistake: '<p>Keeping the top number (' + fr(2, 3) + ' = ' + fr(2, 6) + '), or thinking ' + fr(2, 6) + ' is more than ' + fr(1, 3) + ' because the numbers are bigger. Shade both bars and compare where the shading ends.</p>',
        check: [ck('fr-eq36', 'plain', 1), ck('fr-eq36', 'tap', 1), ck('fr-eq36', 'mc', 2), ck('fr-eq36', 'story', 2), ck('fr-eq36', 'plain', 3)] },

      { id: 'tenths', title: 'Fifths and tenths', exp: ['B1.7'], skill: 'fr-eq510',
        watch: clip(barsV, { rows: [[1, 5]] }, [
          ['One fifth is shaded.'],
          ['Cut each fifth into 2 pieces: tenths.', { rows: [[1, 5], [0, 10]] }],
          ['2 tenths fill the same space.', { rows: [[1, 5], [2, 10]] }],
          ['Two names for one amount.', { sym: fr(1, 5) + ' = ' + fr(2, 10) }]
        ]),
        example: clip(barsV, { rows: [[3, 5]] }, [
          ['My turn. I shade 3 fifths.'],
          ['3 tenths? No: it stops short.', { rows: [[3, 5], [3, 10]] }],
          ['Each fifth is 2 tenths, so 3 fifths make 6 tenths.', { rows: [[3, 5], [6, 10]] }],
          ['The shading ends in the same place.', { sym: fr(3, 5) + ' = ' + fr(6, 10) }]
        ]),
        try: { tool: 'fractions', opts: { wall: [5, 10] }, tasks: [
          { do: 'Shade <b>two fifths</b> on top. Then shade the <b>tenths</b> that match.', goal: function (s) { return s[0].n === 2 && s[1].n === 4; }, yes: fr(2, 5) + ' = ' + fr(4, 10) + '.' }
        ] },
        together: [tgEqv([5, 10], 1), tgEqv([5, 10], 2), tgEqv([5, 10], 3)],
        mistake: '<p>Keeping the top number (' + fr(3, 5) + ' = ' + fr(3, 10) + '). Ask: "How many tenths fit in one fifth?" Then: "So how many in 3 fifths?"</p>',
        check: [ck('fr-eq510', 'plain', 1), ck('fr-eq510', 'tap', 1), ck('fr-eq510', 'mc', 2), ck('fr-eq510', 'tf', 2), ck('fr-eq510', 'plain', 3)] },

      { id: 'story', title: 'Equal shares in a sharing story', exp: ['B1.7'], skill: 'fr-eqshare',
        watch: clip(pizzas, { items: 2, k: 4, cut: 1 }, [
          ['2 pizzas, 4 friends.'],
          ['Cut each pizza into fourths. One friend gets 2 pieces: ' + fr(2, 4) + '.', { cut: 4, show: true }],
          ['Or cut each pizza in half. One friend gets ' + fr(1, 2) + '.', { cut: 2 }],
          ['Both ways give the same amount.', { sym: fr(2, 4) + ' = ' + fr(1, 2) }]
        ]),
        example: clip(pizzas, { items: 2, k: 6, cut: 1 }, [
          ['My turn. 2 bannocks, 6 people.'],
          ['I cut each into sixths. Each person gets 2 pieces: ' + fr(2, 6) + '.', { cut: 6, show: true }],
          ['Or I cut each into thirds. Each person gets ' + fr(1, 3) + '.', { cut: 3 }],
          ['Is ' + fr(2, 6) + ' more? No: smaller pieces, but more of them.', { sym: fr(2, 6) + ' = ' + fr(1, 3) }]
        ]),
        together: [tgEqshare(1), tgEqshare(2), tgEqshare(3)],
        mistake: '<p>Thinking only one name can be right ("It is ' + fr(2, 4) + ', not ' + fr(1, 2) + '"). Cut the same pizza two ways and lay one share on top of the other.</p>',
        check: [ck('fr-eqshare', 'mc', 1), ck('fr-eqshare', 'plain', 1), ck('fr-eqshare', 'fill', 2), ck('fr-eqshare', 'tf', 2), ck('fr-eqshare', 'story', 3)] }
    ] },

    { id: 'groups', title: 'Groups of pieces', sub: 'Put pieces together to make wholes.', concepts: [
      { id: 'make', title: 'Groups of halves make wholes', exp: ['B2.7'], skill: 'fr-ghalf',
        watch: clip(groupV, { n: 0, d: 2 }, [
          ['Here come halves, one at a time.', count(1, 6, 2)],
          ['Put them together in pairs.', { grouped: true }],
          ['6 halves make 3 wholes.']
        ]),
        example: clip(groupV, { n: 10, d: 2 }, [
          ['My turn. I have 10 halves.'],
          ['I put them in pairs. Each pair is a whole.', { grouped: true }],
          ['5 wholes. Not 10 wholes: each half is only a piece.']
        ]),
        try: { mount: G3.play({ state: { d: 2, n: 3 }, draw: function (s) { return groupFig(s.n, s.d); },
          sliders: [{ key: 'n', label: 'Halves', min: 1, max: 12 }],
          info: function (s) { return s.n + ' halves = <b>' + mixed(Math.floor(s.n / 2), s.n % 2, 2) + '</b>'; },
          tasks: [{ do: 'How many halves make <b>4 wholes</b>? Show it.', goal: function (s) { return s.n === 8; }, yes: '8 halves = 4 wholes.' }] }), do: '' },
        together: [tgGroups([2], 1), tgGroups([2], 2), tgGroups([2], 3)],
        mistake: '<p>Answering with the number of pieces (10) instead of the number of wholes (5). Ask: "How many whole sandwiches can you put back together?"</p>',
        check: [ck('fr-ghalf', 'plain', 1), ck('fr-ghalf', 'picture', 1), ck('fr-ghalf', 'reverse', 2), ck('fr-ghalf', 'tf', 2), ck('fr-ghalf', 'groups', 3)] },

      { id: 'groups34', title: 'Groups of thirds and fourths', exp: ['B2.7'], skill: 'fr-g34',
        watch: clip(groupV, { n: 0, d: 4 }, [
          ['8 fourths, one at a time.', count(1, 8, 4)],
          ['4 fourths fill each whole.', { grouped: true }],
          ['Two full wholes.']
        ]),
        example: clip(groupV, { n: 9, d: 3 }, [
          ['My turn. I have 9 thirds.'],
          ['3 thirds make each whole.', { grouped: true }],
          ['3 wholes. Groups of 3, not groups of 2.']
        ]),
        together: [tgGroups([3, 4], 1), tgGroups([3, 4], 2), tgGroups([3, 4], 3)],
        mistake: '<p>Grouping by 2 for every piece ("12 fourths make 6 wholes"). Ask: "How many fourths fill one whole?" Then count by that number.</p>',
        check: [ck('fr-g34', 'plain', 1), ck('fr-g34', 'picture', 1), ck('fr-g34', 'reverse', 2), ck('fr-g34', 'match', 2), ck('fr-g34', 'groups', 3)] },

      { id: 'leftover', title: 'Wholes and a leftover', exp: ['B2.7'], skill: 'fr-gleft',
        watch: clip(groupV, { n: 7, d: 3 }, [
          ['7 thirds.'],
          ['Groups of 3 make wholes: 2 wholes.', { grouped: true }],
          ['1 third is left over: 2 and ' + fr(1, 3) + '.']
        ]),
        example: clip(groupV, { n: 9, d: 4 }, [
          ['My turn. I have 9 fourths.'],
          ['2 groups of 4: 2 wholes.', { grouped: true }],
          ['3 wholes? No: the last one is not full. 2 and ' + fr(1, 4) + '.']
        ]),
        together: [tgLeft(1), tgLeft(2), tgLeft(3)],
        mistake: '<p>Dropping the leftover pieces, or counting a part-full group as a whole. Ask: "Is the last whole full? What is left over?"</p>',
        check: [ck('fr-gleft', 'plain', 1), ck('fr-gleft', 'picture', 1), ck('fr-gleft', 'fill', 2), ck('fr-gleft', 'tf', 2), ck('fr-gleft', 'groups', 3)] },

      { id: 'recipe', title: 'Recipes and laps', exp: ['B2.7'], skill: 'fr-gstory',
        watch: clip(groupV, { n: 0, d: 4 }, [
          ['Each batch adds ' + fr(1, 4) + ' cup of oats. 6 batches.', count(1, 6, 4)],
          ['4 fourths fill 1 cup.', { grouped: true }],
          ['1 cup, and 2 fourths more: 1 and ' + fr(2, 4) + ' cups.']
        ]),
        example: clip(groupV, { n: 5, d: 2 }, [
          ['My turn. A lap is ' + fr(1, 2) + ' km. I skate 5 laps.'],
          ['2 halves make 1 km: 2 full groups.', { grouped: true }],
          ['1 half is left: 2 and ' + fr(1, 2) + ' km. Not 5 km: each lap is half.']
        ]),
        together: [tgStory(1), tgStory(2), tgStory(3)],
        mistake: '<p>Treating each batch or lap as 1 whole (6 batches of ' + fr(1, 4) + ' cup = 6 cups). Ask: "How much is one batch? How many batches make 1 cup?"</p>',
        check: [ck('fr-gstory', 'plain', 1), ck('fr-gstory', 'laps', 1), ck('fr-gstory', 'scoops', 2), ck('fr-gstory', 'tf', 2), ck('fr-gstory', 'fill', 3)] }
    ] },

    { id: 'mixup', title: 'Don\'t mix them up', sub: 'Bigger pieces, or more of them?', concepts: [
      { id: 'size', title: 'Bigger piece or more pieces?', exp: ['B1.6', 'B1.7'], skill: 'fr-mix',
        watch: clip(barsV, { rows: [[1, 3], [1, 4]], label: true }, [
          ['Same top number: compare the pieces. Thirds are bigger.'],
          ['Same bottom number: same-size pieces. 5 is more than 2.', { rows: [[2, 8], [5, 8]] }],
          ['Same top again: 2 fourths beat 2 eighths.', { rows: [[2, 8], [2, 4]] }],
          ['First find the number that matches.']
        ]),
        example: clip(barsV, { rows: [[1, 6], [1, 5]], label: true }, [
          ['My turn. ' + fr(1, 6) + ' or ' + fr(1, 5) + '? Same top, so I compare the pieces.'],
          [fr(1, 6) + ' because 6 is bigger? No: sixths are smaller.'],
          [fr(3, 10) + ' or ' + fr(7, 10) + '? Same-size pieces, so 7 is more.', { rows: [[3, 10], [7, 10]] }]
        ]),
        try: { tool: 'fractions', opts: { wall: [2, 3, 6, 10] }, tasks: [
          { do: 'Shade <b>one piece in every bar</b>. Which piece is the smallest?', goal: function (s) { return s.every(function (r) { return r.n === 1; }); }, yes: 'One tenth is the smallest: the whole is cut into the most pieces.' }
        ] },
        together: [tgMix('unit'), tgMix('sametop'), tgMix('samebot')],
        mistake: '<p>Thinking a bigger number always means a bigger fraction: choosing ' + fr(1, 8) + ' over ' + fr(1, 4) + ', or ' + fr(2, 8) + ' over ' + fr(2, 4) + '. Ask: "Which number is the same? If the tops match, which pieces are bigger?" Draw both bars the same length.</p>',
        check: [ck('fr-mix', 'picture', 1), ck('fr-mix', 'plain', 2), ck('fr-mix', 'tf', 2), ck('fr-mix', 'order', 2), ck('fr-mix', 'plain', 3)] }
    ] }
  ];

  A.register(CH, {
    full: true,
    lessons: LESSONS,
    quiz: [
      { q: 'What fraction of the circle is shaded?', type: 'mc', options: [fr(3, 8), fr(5, 8), fr(3, 5), fr(8, 3)], answer: 0, fig: pie(3, 8, 70),
        hint: 'Count all the equal parts. Then count the shaded parts.', explain: '3 of the 8 equal parts are shaded: ' + fr(3, 8) + '.', meta: { k: 'g3fr-nm-mc', n: 3, d: 8 } },
      { q: 'Share 7 sandwiches equally between 2 people. How much does each person get?', type: 'mc', options: ['3', '3 and ' + fr(1, 2), '4', '3 and ' + fr(1, 7)], answer: 1,
        hint: 'Hand out whole sandwiches first. Cut the leftover one.', explain: 'Each gets 3 whole. The last one is cut in half: 3 and ' + fr(1, 2) + '.', meta: { k: 'g3fr-share', items: 7, k2: 2 } },
      { q: sum(4, 6) + ' = ?', type: 'mc', options: [fr(4, 6), fr(4, 24), fr(6, 4), fr(1, 24)], answer: 0,
        hint: 'Count the sixths.', explain: '4 pieces of one sixth make ' + fr(4, 6) + '.', meta: { k: 'g3fr-ct-mc', n: 4, d: 6 } },
      { q: 'Fill in the blank.', type: 'fill', fill: fr(3, 4) + ' = [[]] eighths', answers: [6], fig: bars([[3, 4], [0, 8]]),
        hint: 'Each fourth is 2 eighths.', explain: '3 fourths = 6 eighths.', meta: { k: 'g3fr-eqv-fill' } },
      { q: 'Which is more: ' + fr(1, 3) + ' or ' + fr(1, 5) + '?', type: 'mc', options: [fr(1, 3), fr(1, 5), 'They are the same'], answer: 0,
        hint: 'The more pieces a whole is cut into, the smaller each one is.', explain: 'Thirds are bigger pieces than fifths.', meta: { k: 'g3fr-mix-mc', a: [1, 3], b: [1, 5] } },
      { q: 'A muffin recipe uses ' + fr(1, 3) + ' cup of milk. How much milk do 7 batches use?', type: 'mc', options: ['7 cups', '2 cups', '2 and ' + fr(1, 3) + ' cups', '3 and ' + fr(1, 3) + ' cups'], answer: 2,
        hint: 'Make groups of 3 thirds.', explain: '7 thirds: 2 groups of 3, and 1 third left. 2 and ' + fr(1, 3) + ' cups.', meta: { k: 'g3fr-gs-mc', n: 7, d: 3 } },
      { q: 'Share 3 pizzas equally among 4 friends. How much does each friend get?', type: 'mc', options: [fr(1, 4), fr(3, 4), fr(4, 3), fr(1, 3)], answer: 1,
        hint: 'Cut each pizza into 4 pieces. Each friend takes one piece of each.', explain: '3 pieces of one fourth: ' + fr(3, 4) + '.', meta: { k: 'g3fr-share', items: 3, k2: 4 } }
    ],
    practice: SKILLS.map(function (s) { return { id: s.id, name: s.name, code: s.code, gen: DEF[s.id][0][2] }; })
  });

  /* every skill's other shapes (docs/QUESTIONS.md); each skill keeps its first way of asking as "plain" */
  var SHAPES = {};
  SKILLS.forEach(function (s) { SHAPES[s.id] = DEF[s.id].slice(1); });
  Q.shapes(CH, SHAPES);
})();
