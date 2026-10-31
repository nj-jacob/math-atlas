/* Grade 1 Math Atlas: tiny hash router, chapter registry, practice questions, adaptive practice and check-up. No dependencies. */
(function () {
  'use strict';
  var Atlas = (window.Atlas = {
    grade: 1,
    tools: ['counters', 'tenframe', 'base10', 'hundred', 'numberline', 'fractions', 'coins', 'geoboard'],
    chapters: {},
    strands: { B: 'Number', C: 'Algebra', D: 'Data', E: 'Spatial Sense', F: 'Financial Literacy' },
    meta: [
      { id: 'counting', title: 'Counting to 50', sub: 'read, count, skip count, estimate', strand: 'B', codes: 'B1.1, B1.4, B1.5',
        desc: 'Ten frames, the number chart, counting by 2s, 5s and 10s, and good guesses.' },
      { id: 'tens-ones', title: 'Tens and Ones', sub: 'make, break apart, compare', strand: 'B', codes: 'B1.2, B1.3',
        desc: 'Build numbers with tens and ones, split them in different ways, and find the bigger one.' },
      { id: 'add-sub-10', title: 'Adding and Subtracting to 10', sub: 'the facts to 10', strand: 'B', codes: 'B2.1, B2.2',
        desc: 'Number pairs that make 10, adding, taking away, and how adding and subtracting are linked.' },
      { id: 'add-sub-50', title: 'Adding and Subtracting to 50', sub: 'mental math and stories', strand: 'B', codes: 'B2.3, B2.4, C2.2, C2.3',
        desc: 'Count on, make a ten, story problems, and checking if two sides are equal.' },
      { id: 'groups-shares', title: 'Equal Groups and Fair Shares', sub: 'sharing, halves and fourths', strand: 'B', codes: 'B2.5, B1.6, B1.7, B1.8',
        desc: 'Make equal groups, share fairly, and cut things into halves and fourths.' },
      { id: 'patterns', title: 'Patterns', sub: 'find, make, continue', strand: 'C', codes: 'C1.1 to C1.4, C2.1',
        desc: 'Repeating patterns, what comes next, missing parts, and number patterns.' },
      { id: 'shapes-position', title: 'Shapes, Position and Coding', sub: 'shapes, where things are, directions', strand: 'E', codes: 'E1.1 to E1.5, C3.1, C3.2',
        desc: 'Flat shapes and solids, matching halves, position words, and step-by-step directions.' },
      { id: 'measuring', title: 'Measuring and the Calendar', sub: 'longer, heavier, holds more', strand: 'E', codes: 'E2.1 to E2.3',
        desc: 'Compare length, area, mass and capacity, and read a calendar.' },
      { id: 'data', title: 'Sorting and Picture Graphs', sub: 'sort, tally, graph, chance', strand: 'D', codes: 'D1.1 to D2.2',
        desc: 'Sort things, make tally tables and picture graphs, and decide if something is possible.' },
      { id: 'money', title: 'Canadian Money', sub: 'coins and bills', strand: 'F', codes: 'F1.1',
        desc: 'Know each coin and bill, and tell which is worth more.' },
      { id: 'fact-sheet', title: 'Fact Sheet', sub: 'the key facts on one page', strand: 'B', ref: true,
        desc: 'Numbers to 50, facts to 10, shapes, coins and bills.' }
    ]
  });

  var $ = (Atlas.$ = function (s, r) { return (r || document).querySelector(s); });
  Atlas.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  Atlas.register = function (id, ch) { Atlas.chapters[id] = ch; };

  /* Canadian number style: a space groups numbers of 5 or more digits. */
  Atlas.fmt = function (n) {
    var s = String(n), neg = '';
    if (s.charAt(0) === '-') { neg = '-'; s = s.slice(1); }
    var p = s.split('.'), i = p[0];
    if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return neg + i + (p.length > 1 ? '.' + p[1] : '');
  };
  Atlas.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; };
  Atlas.money = function (c) { return '$' + (c / 100).toFixed(2); };
  /* round away floating point noise: 0.1 + 0.2 -> 0.3 */
  Atlas.clean = function (x) { return Math.round(x * 1e6) / 1e6; };

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem('g1atlas:' + k); localStorage.setItem('g1atlas:' + k, v); } catch (e) { return null; }
  }
  function load(k, d) { try { var v = store(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { store(k, JSON.stringify(v)); }
  Atlas.store = store;

  /* random helpers for practice generators */
  var R = (Atlas.R = {
    int: function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
    pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    },
    /* multiple choice: correct answer plus distractors, duplicates removed, shuffled */
    mc: function (right, wrong) {
      var seen = {}, opts = [String(right)];
      seen[String(right)] = 1;
      wrong.forEach(function (w) { w = String(w); if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } });
      opts = R.shuffle(opts);
      return { options: opts, answer: opts.indexOf(String(right)) };
    }
  });

  /* drawings shared by chapters and practice questions */
  Atlas.svg = function (w, h, inner, label) {
    /* drawn 1.3 times bigger than the drawing units on wide screens; .fig svg shrinks it to fit a phone */
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + Math.round(w * 1.3) + '" role="img" aria-label="' + (label || '') + '">' + inner + '</svg>';
  };
  Atlas.draw = {
    /* a bar split into d parts with n shaded */
    bar: function (n, d, w, label) {
      w = w || 360;
      var s = '', cw = (w - 4) / d;
      for (var i = 0; i < d; i++) s += '<rect x="' + (2 + i * cw) + '" y="2" width="' + cw + '" height="34" style="fill:' + (i < n ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/>';
      return Atlas.svg(w, 38, s, label || n + ' of ' + d + ' equal parts shaded');
    },
    /* n pieces of size 1/d, drawn across as many whole bars as needed */
    wholes: function (n, d, label) {
      var count = Math.max(1, Math.ceil(n / d)), bw = Math.min(150, 520 / count - 8), s = '';
      for (var w = 0; w < count; w++) for (var i = 0; i < d; i++) {
        var k = w * d + i;
        s += '<rect x="' + (2 + w * (bw + 8) + i * bw / d) + '" y="2" width="' + bw / d + '" height="34" style="fill:' + (k < n ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
      }
      return Atlas.svg(Math.ceil(count * (bw + 8)), 38, s, label || n + ' pieces of size 1/' + d);
    },
    /* hundred grid with n squares shaded */
    grid: function (n, size) {
      size = size || 18;
      var s = '';
      for (var i = 0; i < 100; i++) s += '<rect x="' + (2 + (i % 10) * size) + '" y="' + (2 + Math.floor(i / 10) * size) + '" width="' + size + '" height="' + size + '" style="fill:' + (i < n ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1"/>';
      return Atlas.svg(size * 10 + 4, size * 10 + 4, s, n + ' of 100 squares shaded');
    },
    /* number line from a to b with tick labels and an optional marked point */
    line: function (a, b, step, mark, label) {
      var W = 440, x0 = 24, x1 = W - 24, s = '<line x1="' + x0 + '" y1="30" x2="' + x1 + '" y2="30" style="stroke:var(--ink)" stroke-width="2"/>';
      var n = Math.round((b - a) / step);
      for (var i = 0; i <= n; i++) {
        var v = Atlas.clean(a + i * step), x = x0 + (x1 - x0) * i / n;
        s += '<line x1="' + x + '" y1="22" x2="' + x + '" y2="38" style="stroke:var(--ink)" stroke-width="2"/>' +
          (n <= 10 || i % Math.ceil(n / 10) === 0 ? '<text x="' + x + '" y="56" text-anchor="middle" font-size="13">' + Atlas.fmt(v) + '</text>' : '');
      }
      if (mark !== undefined && mark !== null) {
        var mx = x0 + (x1 - x0) * (mark - a) / (b - a);
        s += '<circle cx="' + mx + '" cy="30" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
      }
      return Atlas.svg(W, 62, s, label || 'Number line from ' + a + ' to ' + b);
    }
  };

  /* ---- place value pictures. One colour per place, used for disks and base-ten blocks.
     Place index p: 0 ones, 1 tens, 2 hundreds, 3 thousands, 4 ten thousands, 5 hundred thousands. ---- */
  Atlas.PLACES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands'];
  Atlas.PLACE1 = ['one', 'ten', 'hundred', 'thousand', 'ten thousand', 'hundred thousand'];
  Atlas.pc = function (p) { return 'var(--p' + p + ')'; };
  /* a single place value disk; small disks (r < 12) have no label */
  Atlas.draw.disk = function (x, y, r, p) {
    var lab = Atlas.fmt(Math.pow(10, p)), fs = lab.length <= 3 ? r * 0.8 : lab.length === 4 ? r * 0.62 : r * 0.48;
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:' + Atlas.pc(p) + '" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>' +
      (r >= 12 ? '<text x="' + x + '" y="' + (y + fs * 0.36) + '" text-anchor="middle" font-size="' + fs.toFixed(1) + '" font-weight="700" style="fill:' + (p ? '#fff' : '#13203a') + '">' + lab + '</text>' : '');
  };
  /* labelled disks for a list of groups [{p, n}], one row per group, in the order given */
  Atlas.draw.disks = function (groups, label) {
    var r = 17, gap = 38, s = '', y = 22, maxN = 1;
    groups.forEach(function (g) { maxN = Math.max(maxN, Math.min(g.n, 10)); });
    var W = Math.max(150, 120 + maxN * gap);
    groups.forEach(function (g) {
      var rows = Math.ceil(g.n / 10) || 1;
      s += '<text x="4" y="' + (y + 5) + '" font-size="13" class="t2">' + Atlas.PLACES[g.p] + '</text>';
      for (var i = 0; i < g.n; i++) s += Atlas.draw.disk(120 + (i % 10) * gap, y + Math.floor(i / 10) * gap, r, g.p);
      y += rows * gap + 4;
    });
    return Atlas.svg(W, y - 2, s, label || 'Place value disks');
  };
  /* a box drawn in oblique view. a wide, b deep, c tall; na, nb, nc grid lines per edge */
  Atlas.draw.prism = function (x, y, a, b, c, na, nb, nc, p) {
    var k = 0.42, dx = b * k, dy = -b * k, col = Atlas.pc(p), s = '', i, t;
    var ln = function (x1, y1, x2, y2) { return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>'; };
    s += '<polygon points="' + [x, y - c, x + a, y - c, x + a + dx, y - c + dy, x + dx, y - c + dy].join(',') + '" style="fill:color-mix(in srgb,' + col + ' 62%,#fff)"/>';
    s += '<polygon points="' + [x + a, y, x + a, y - c, x + a + dx, y - c + dy, x + a + dx, y + dy].join(',') + '" style="fill:color-mix(in srgb,' + col + ' 72%,#000)"/>';
    s += '<rect x="' + x + '" y="' + (y - c) + '" width="' + a + '" height="' + c + '" style="fill:' + col + '"/>';
    var g = '';
    for (i = 1; i < na; i++) { t = x + a * i / na; g += ln(t, y, t, y - c) + ln(t, y - c, t + dx, y - c + dy); }
    for (i = 1; i < nc; i++) { t = y - c * i / nc; g += ln(x, t, x + a, t) + ln(x + a, t, x + a + dx, t + dy); }
    for (i = 1; i < nb; i++) { t = i / nb; g += ln(x + dx * t, y - c + dy * t, x + a + dx * t, y - c + dy * t) + ln(x + a + dx * t, y + dy * t, x + a + dx * t, y - c + dy * t); }
    s += '<g stroke="rgba(0,0,0,.35)" stroke-width="1">' + g + '</g>';
    s += '<polygon points="' + [x, y, x, y - c, x + dx, y - c + dy, x + a + dx, y - c + dy, x + a + dx, y + dy, x + a, y].join(',') + '" fill="none" stroke="rgba(0,0,0,.6)" stroke-width="1.5" stroke-linejoin="round"/>';
    return s;
  };
  /* base-ten blocks for one place. u is the size of a small cube. Returns {svg, w, h}. */
  Atlas.draw.block = function (x, y, p, u) {
    var P = Atlas.draw.prism, k = 0.42;
    var dims = [[1, 1, 1, 1, 1, 1], [1, 1, 10, 1, 1, 10], [10, 1, 10, 10, 1, 10], [10, 10, 10, 10, 10, 10]][p];
    var a = dims[0] * u, b = dims[1] * u, c = dims[2] * u;
    return { svg: P(x, y, a, b, c, dims[3], dims[4], dims[5], p), w: a + b * k, h: c + b * k };
  };
  /* a picture of a whole number up to 9999 in base-ten blocks, wrapping onto new rows */
  Atlas.draw.blocks = function (n, label, W) {
    W = W || 540;
    var u = 5, s = '', x = 4, rowH = 0, top = 4, items = [], digits = String(n).split('').reverse();
    for (var p = 3; p >= 0; p--) for (var i = 0; i < (+digits[p] || 0); i++) items.push(p);
    var rows = [[]], rx = 4;
    items.forEach(function (p, j) {
      var b = Atlas.draw.block(0, 0, p, u), row = rows[rows.length - 1];
      var gap = row.length ? (items[j - 1] !== p ? 18 : 6) : 0;
      if (row.length && rx + gap + b.w > W) { rows.push(row = []); rx = 4; gap = 0; }
      row.push({ p: p, x: rx + gap, b: b });
      rx += gap + b.w;
    });
    var y = top, maxX = 0;
    rows.forEach(function (row) {
      var h = 0;
      row.forEach(function (it) { h = Math.max(h, it.b.h); });
      row.forEach(function (it) { s += Atlas.draw.block(it.x, y + h, it.p, u).svg; maxX = Math.max(maxX, it.x + it.b.w); });
      y += h + 12;
    });
    return Atlas.svg(Math.ceil(maxX + 4), Math.ceil(y), s, label || 'Base-ten blocks showing ' + n);
  };

  /* ---------- Grade 1 pictures ---------- */
  var SEED = 1;
  function rnd() { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; }
  /* a counter: red (k 0), yellow (k 1), or an empty dashed ring (k 2) */
  function counter(x, y, r, k) {
    if (k === 2) return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:none;stroke:var(--ink2)" stroke-width="1.5" stroke-dasharray="3 3"/>';
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:var(--c' + (k ? 'B' : 'A') + ')" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>';
  }
  Atlas.draw.counter = counter;
  /* ten frames for n (up to 50). o.b extra yellow counters after the red ones, o.x: the last x counters are crossed out,
     o.r frames per row, o.c cell size, o.ghost empty rings for the rest of a target */
  Atlas.draw.frames = function (n, o) {
    o = o || {};
    var b = o.b || 0, tot = n + b, nf = Math.max(1, Math.ceil(Math.max(tot, o.min || 0) / 10)), c = o.c || 26, fw = c * 5, fh = c * 2;
    var per = o.r || Math.max(1, Math.min(nf, Math.floor(((o.w || 560) + 14) / (fw + 14)))), rows = Math.ceil(nf / per), s = '';
    for (var f = 0; f < nf; f++) {
      var fx = 4 + (f % per) * (fw + 14), fy = 4 + Math.floor(f / per) * (fh + 14);
      s += '<rect x="' + fx + '" y="' + fy + '" width="' + fw + '" height="' + fh + '" rx="4" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>';
      for (var i = 1; i < 5; i++) s += '<line x1="' + (fx + i * c) + '" y1="' + fy + '" x2="' + (fx + i * c) + '" y2="' + (fy + fh) + '" style="stroke:var(--ink)" stroke-width="1.2"/>';
      s += '<line x1="' + fx + '" y1="' + (fy + c) + '" x2="' + (fx + fw) + '" y2="' + (fy + c) + '" style="stroke:var(--ink)" stroke-width="1.2"/>';
      for (var j = 0; j < 10; j++) {
        var k = f * 10 + j, cx = fx + (j % 5) * c + c / 2, cy = fy + Math.floor(j / 5) * c + c / 2;
        if (k < tot) {
          s += counter(cx, cy, c * 0.36, k < n ? 0 : 1);
          if (o.x && k >= tot - o.x) s += '<path d="M' + (cx - c * .3) + ' ' + (cy - c * .3) + 'L' + (cx + c * .3) + ' ' + (cy + c * .3) + 'M' + (cx + c * .3) + ' ' + (cy - c * .3) + 'L' + (cx - c * .3) + ' ' + (cy + c * .3) + '" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round"/>';
        } else if (o.ghost && k < o.ghost) s += counter(cx, cy, c * 0.36, 2);
      }
    }
    var W = 8 + Math.min(nf, per) * (fw + 14) - 14, H = 8 + rows * (fh + 14) - 14;
    return Atlas.svg(W, H, s, o.label || (tot + ' counter' + (tot === 1 ? '' : 's') + ' in ten frames' + (b ? ': ' + n + ' red and ' + b + ' yellow' : '') + (o.x ? ', ' + o.x + ' crossed out' : '')));
  };
  /* simple object pictures, centred on x, y, about s across */
  Atlas.icon = function (kind, x, y, s) {
    var r = s / 2, t = function (a) { return 'translate(' + x + ' ' + y + ') scale(' + (s / 40) + ')' + (a || ''); };
    switch (kind) {
      case 'apple': return '<g transform="' + t() + '"><path d="M0-10C-6-16-19-14-19 0C-19 13-9 20 0 16C9 20 19 13 19 0C19-14 6-16 0-10Z" style="fill:#d9412b" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><path d="M0-10Q1-16 5-19" style="stroke:#6b3e1f;fill:none" stroke-width="2.5" stroke-linecap="round"/><path d="M3-14Q11-20 14-12Q7-9 3-14Z" style="fill:#3d9a46"/></g>';
      case 'star': return '<g transform="' + t() + '"><path d="M0-19L5.6-6.2L19.5-5.6L8.6 3L12.4 16.4L0 8.6L-12.4 16.4L-8.6 3L-19.5-5.6L-5.6-6.2Z" style="fill:#f2b81f" stroke="rgba(0,0,0,.35)" stroke-width="1.5" stroke-linejoin="round"/></g>';
      case 'fish': return '<g transform="' + t() + '"><path d="M-14 0C-8-12 10-12 16 0C10 12-8 12-14 0Z" style="fill:#2f86d6" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><path d="M-13 0L-20-9L-20 9Z" style="fill:#2f86d6" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><circle cx="8" cy="-3" r="2.2" style="fill:#13203a"/></g>';
      case 'flower': return '<g transform="' + t() + '">' + [0, 72, 144, 216, 288].map(function (a) { return '<ellipse cx="0" cy="-10" rx="6.5" ry="9" transform="rotate(' + a + ')" style="fill:#e05aa0" stroke="rgba(0,0,0,.3)" stroke-width="1.2"/>'; }).join('') + '<circle r="6" style="fill:#f6c431" stroke="rgba(0,0,0,.3)" stroke-width="1.2"/></g>';
      case 'ball': return '<g transform="' + t() + '"><circle r="17" style="fill:#f08a24" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/><path d="M-17 0H17M0-17V17M-12-12Q0 0-12 12M12-12Q0 0 12 12" style="stroke:rgba(0,0,0,.45);fill:none" stroke-width="1.5"/></g>';
      case 'leaf': return '<g transform="' + t() + '"><path d="M-16 14C-18-6-4-18 16-16C18 4 4 18-16 14Z" style="fill:#3d9a46" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><path d="M-16 14L10-10" style="stroke:#1f5e27" stroke-width="1.5"/></g>';
      case 'sock': return '<g transform="' + t() + '"><path d="M-6-18H6V4L12 8C17 11 14 19 7 18L-4 14C-8 12-6 8-6 4Z" style="fill:#7b5cd6" stroke="rgba(0,0,0,.35)" stroke-width="1.5" stroke-linejoin="round"/><path d="M-6-12H6" style="stroke:#fff" stroke-width="3"/></g>';
      case 'hand': return '<g transform="' + t() + '" style="fill:#e8b48a" stroke="rgba(0,0,0,.4)" stroke-width="1.3"><rect x="-11" y="-2" width="22" height="20" rx="8"/>' +
        [[-11, -18, 5], [-5, -21, 5], [1, -20, 5], [7, -16, 4.5]].map(function (f) { return '<rect x="' + f[0] + '" y="' + f[1] + '" width="' + f[2] + '" height="22" rx="2.5"/>'; }).join('') + '<rect x="9" y="0" width="14" height="5" rx="2.5" transform="rotate(-35 9 2)"/></g>';
      case 'car': return '<g transform="' + t() + '"><path d="M-18 6V-2L-12-4L-7-12H7L12-4L18-2V6Z" style="fill:#c8323b" stroke="rgba(0,0,0,.4)" stroke-width="1.5" stroke-linejoin="round"/><path d="M-5-10H5L8-4H-8Z" style="fill:#cfe6f7"/><circle cx="-10" cy="7" r="4.5" style="fill:#222"/><circle cx="10" cy="7" r="4.5" style="fill:#222"/></g>';
      case 'cube': return '<g transform="' + t() + '"><rect x="-12" y="-12" width="24" height="24" rx="2" style="fill:var(--p0)" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/></g>';
    }
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
  };
  Atlas.NAMES = { apple: ['apple', 'apples'], star: ['star', 'stars'], fish: ['fish', 'fish'], flower: ['flower', 'flowers'], ball: ['ball', 'balls'], leaf: ['leaf', 'leaves'], sock: ['sock', 'socks'], hand: ['hand', 'hands'], car: ['car', 'cars'], cube: ['cube', 'cubes'] };
  Atlas.nm = function (kind, n) { return n + ' ' + Atlas.NAMES[kind][n === 1 ? 0 : 1]; };
  /* n objects in rows. o.per per row, o.group puts a gap after each group, o.s size */
  Atlas.draw.row = function (kind, n, o) {
    o = o || {};
    var sz = o.s || 34, per = o.per || 10, g = o.group || 0, gap = 6, gg = g ? 14 : 0, s = '', maxX = 0;
    for (var i = 0; i < n; i++) {
      var col = i % per, row = Math.floor(i / per), x = 4 + col * (sz + gap) + (g ? Math.floor(col / g) * gg : 0) + sz / 2, y = 4 + row * (sz + gap) + sz / 2;
      s += Atlas.icon(kind, x, y, sz);
      maxX = Math.max(maxX, x + sz / 2);
    }
    var rows = Math.ceil(n / per) || 1;
    return Atlas.svg(Math.ceil(maxX + 4) || 40, rows * (sz + gap) + 4, s, o.label || Atlas.nm(kind, n));
  };
  /* a messy collection of n objects, the same picture for the same seed */
  Atlas.draw.scatter = function (n, seed, o) {
    o = o || {};
    SEED = seed || 7;
    var W = o.w || 360, H = o.h || 220, r = o.r || 11, pts = [], s = '', tries = 0;
    while (pts.length < n && tries < 20000) {
      tries++;
      var x = r + 4 + rnd() * (W - 2 * r - 8), y = r + 4 + rnd() * (H - 2 * r - 8), ok = true;
      for (var i = 0; i < pts.length; i++) { var dx = pts[i][0] - x, dy = pts[i][1] - y; if (dx * dx + dy * dy < (2.3 * r) * (2.3 * r)) { ok = false; break; } }
      if (ok) pts.push([x, y]);
    }
    s += '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="14" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>';
    pts.forEach(function (p) { s += o.kind ? Atlas.icon(o.kind, p[0], p[1], r * 2.1) : counter(p[0], p[1], r, 0); });
    return Atlas.svg(W, H, s, o.label || 'A group of ' + (o.kind ? Atlas.NAMES[o.kind][1] : 'counters') + ' spread out');
  };
  /* number line a..b. o.mark a dot, o.hops [[from, to], ...] drawn as arcs, o.lab label every k, o.ring circled numbers */
  Atlas.draw.nl = function (a, b, o) {
    o = o || {};
    var W = o.w || 400, x0 = 20, x1 = W - 20, n = b - a, top = o.hops && o.hops.length ? 46 : 8, y = top + 18, s = '';
    var X = function (v) { return x0 + (x1 - x0) * (v - a) / n; };
    var lab = o.lab || (n <= 12 ? 1 : n <= 50 ? 5 : 10), ring = o.ring || [], fs = o.fs || (n > 12 ? 20 : 22);
    /* which numbers get a label: ringed, the dot, every lab-th number, then the ends; skip any that would touch a kept label */
    var want = [], kept = ring.slice();
    if (o.mark !== undefined && o.mark !== null) want.push(o.mark);
    for (var v = a; v <= b; v++) if (v % lab === 0) want.push(v);
    want.push(a, b);
    want.forEach(function (v) {
      if (kept.indexOf(v) >= 0) return;
      var gap = fs * (String(v).length * 0.3 + 0.35);
      if (kept.every(function (k) { return Math.abs(X(k) - X(v)) >= gap + fs * String(k).length * 0.3; })) kept.push(v);
    });
    s += '<line x1="' + (x0 - 10) + '" y1="' + y + '" x2="' + (x1 + 10) + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (v = a; v <= b; v++) {
      var big = kept.indexOf(v) >= 0;
      s += '<line x1="' + X(v) + '" y1="' + (y - (big ? 9 : 5)) + '" x2="' + X(v) + '" y2="' + (y + (big ? 9 : 5)) + '" style="stroke:var(--ink)" stroke-width="' + (big ? 2 : 1.3) + '"/>';
      if (big) s += '<text x="' + X(v) + '" y="' + (y + 28) + '" text-anchor="middle" font-size="' + fs + '" class="tb">' + v + '</text>';
    }
    (o.ring || []).forEach(function (v) { s += '<circle cx="' + X(v) + '" cy="' + (y + 22) + '" r="14" style="fill:none;stroke:var(--accent)" stroke-width="2.5"/>'; });
    (o.hops || []).forEach(function (h) {
      var xa = X(h[0]), xb = X(h[1]), mid = (xa + xb) / 2, ht = Math.min(36, 10 + Math.abs(xb - xa) * 0.45);
      s += '<path d="M' + xa + ' ' + (y - 4) + ' Q' + mid + ' ' + (y - 4 - ht * 2) + ' ' + xb + ' ' + (y - 4) + '" fill="none" style="stroke:var(--accent)" stroke-width="2.5"/>' +
        '<path d="M' + xb + ' ' + (y - 4) + 'l' + (xb > xa ? -7 : 7) + ' -6 M' + xb + ' ' + (y - 4) + 'l' + (xb > xa ? -1 : 1) + ' -9" style="stroke:var(--accent)" stroke-width="2.5" stroke-linecap="round" fill="none"/>';
      if (h[2]) s += '<text x="' + mid + '" y="' + (y - 8 - ht) + '" text-anchor="middle" font-size="20" class="tb" style="fill:var(--accent)">' + h[2] + '</text>';
    });
    if (o.mark !== undefined && o.mark !== null) s += '<circle cx="' + X(o.mark) + '" cy="' + y + '" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return Atlas.svg(W, y + 40, s, o.label || 'Number line from ' + a + ' to ' + b);
  };
  /* the number chart, 1 to 50 (or o.to), ten in a row. o.cls {n: class}, o.hide [n...] shows a blank */
  Atlas.chart = function (o) {
    o = o || {};
    var to = o.to || 50, from = o.from || 1, h = '<div class="nchart" role="img" aria-label="' + (o.label || 'Number chart from ' + from + ' to ' + to) + '">';
    for (var v = from; v <= to; v++) {
      var hide = o.hide && o.hide.indexOf(v) >= 0;
      h += '<span class="' + ((o.cls && o.cls[v]) || '') + (hide ? ' hid' : '') + '" data-v="' + v + '">' + (hide ? '?' : v) + '</span>';
    }
    return h + '</div>';
  };
  /* tens and ones as base-ten rods and small cubes, side by side. Small enough for a phone. */
  Atlas.draw.tens = function (t, o1, o) {
    o = o || {};
    var u = o.u || 11, s = '', x = 4, h = u * 10;
    for (var i = 0; i < t; i++) {
      s += '<rect x="' + x + '" y="4" width="' + u + '" height="' + h + '" rx="2" style="fill:var(--p1)" stroke="rgba(0,0,0,.45)" stroke-width="1.3"/>';
      for (var j = 1; j < 10; j++) s += '<line x1="' + x + '" y1="' + (4 + j * u) + '" x2="' + (x + u) + '" y2="' + (4 + j * u) + '" stroke="rgba(0,0,0,.3)"/>';
      x += u + 6;
    }
    if (t && o1) x += 10;
    for (var k = 0; k < o1; k++) {
      var cx = x + (k % 2) * (u + 4), cy = 4 + h - u - Math.floor(k / 2) * (u + 4);
      s += '<rect x="' + cx + '" y="' + cy + '" width="' + u + '" height="' + u + '" rx="2" style="fill:var(--p0)" stroke="rgba(0,0,0,.45)" stroke-width="1.3"/>';
    }
    if (o1) x += o1 > 1 ? 2 * u + 4 : u;
    return Atlas.svg(Math.max(x + 4, 30), h + 8, s, o.label || t + ' ten' + (t === 1 ? '' : 's') + ' and ' + o1 + ' one' + (o1 === 1 ? '' : 's'));
  };
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  /* number words up to 99 */
  Atlas.word = function (n) {
    if (n < 20) return ONES[n];
    return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  };

  /* a big minus / number / plus control. Markup: Atlas.stepHtml(id, label, value). Returns a getter/setter. */
  Atlas.stepHtml = function (id, label, v) {
    return '<div class="ctrl"><span class="stepl" id="' + id + '-l">' + label + '</span><div class="step" role="group" aria-labelledby="' + id + '-l"><button type="button" data-d="-1" aria-label="One less">&minus;</button>' +
      '<output id="' + id + '" aria-live="polite">' + v + '</output><button type="button" data-d="1" aria-label="One more">+</button></div></div>';
  };
  Atlas.stepper = function (root, id, min, max, fn) {
    var out = $('#' + id, root), wrap = out.parentNode, v = +out.textContent;
    function set(n) { v = Math.max(min, Math.min(max, n)); out.textContent = v; Atlas.$$('button', wrap)[0].disabled = v <= min; Atlas.$$('button', wrap)[1].disabled = v >= max; fn(v); }
    Atlas.$$('button', wrap).forEach(function (b) { b.addEventListener('click', function () { set(v + +b.getAttribute('data-d')); }); });
    set(v);
    return { get: function () { return v; }, set: set };
  };
  Atlas.bind = function (root, ids, fn) {
    ids.forEach(function (i) {
      var e = $('#' + i, root);
      if (e) { e.addEventListener('input', fn); e.addEventListener('change', fn); }
    });
    fn();
  };

  function shown(q, v) {
    if (q.type === 'mc') return q.options[v];
    var a = Atlas.fmt(v);
    if (q.unit === '$') return '$' + Number(v).toFixed(2);
    return a + (q.unit ? ' ' + q.unit : '');
  }
  function unitHtml(q) { return q.unit && q.unit !== '$' ? '<span class="unit">' + q.unit + '</span>' : ''; }
  function parseNum(t) { return parseFloat(String(t).replace(/[^0-9.\-]/g, '')); }
  function numOk(q, v) { return Math.abs(v - q.answer) <= (q.tol || 1e-9); }
  /* the words of an element, with pictures read by their labels */
  function words(el) {
    var out = [];
    (function walk(n) {
      if (n.nodeType === 3) { out.push(n.nodeValue); return; }
      if (n.nodeType !== 1) return;
      var tag = n.tagName.toLowerCase();
      if (tag === 'svg') { if (n.getAttribute('aria-label')) out.push(' ' + n.getAttribute('aria-label') + '. '); return; }
      if (tag === 'button' && n.classList.contains('say')) return;
      if (n.classList.contains('noread') || tag === 'script' || tag === 'input' || tag === 'select') return;
      if (n.getAttribute('aria-hidden') === 'true') return;
      for (var c = n.firstChild; c; c = c.nextSibling) walk(c);
      if (/^(p|li|div|h1|h2|h3|tr|figcaption)$/.test(tag)) out.push('. ');
    })(el);
    return out.join(' ').replace(/(\s*\.\s*){2,}/g, '. ').replace(/\s+/g, ' ').replace(/^[\s.]+/, '');
  }
  Atlas.words = words;
  Atlas.sayText = words;
  /* big number pad under every typed answer, for children who find the keyboard hard */
  function padHtml() {
    var h = '<div class="pad" role="group" aria-label="Number pad">';
    for (var i = 1; i <= 9; i++) h += '<button type="button" data-k="' + i + '">' + i + '</button>';
    return h + '<button type="button" data-k="back" aria-label="Rub out">&#9003;</button><button type="button" data-k="0">0</button><button type="button" data-k="clear" aria-label="Clear">Clear</button></div>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.pad button');
    if (!b || b.disabled) return;
    var f = b.closest('form'), inp = f && $('input', f), k = b.getAttribute('data-k');
    if (!inp || inp.disabled) return;
    if (k === 'back') inp.value = inp.value.slice(0, -1);
    else if (k === 'clear') inp.value = '';
    else if (inp.value.length < 4) inp.value += k;
  });
  function numForm(q, iid, label) {
    return '<form class="numrow"><label class="sr" for="' + iid + '">Your answer</label>' + (q.unit === '$' ? '<span class="unit">$</span>' : '') +
      '<input type="text" inputmode="numeric" autocomplete="off" id="' + iid + '" placeholder="?">' + unitHtml(q) + '<button class="btn" type="submit">' + label + '</button>' + padHtml() + '</form>';
  }

  /* Practice questions.
     {q, type:'mc', options:[...], answer:index, explain, hint}
     {q, type:'num', answer:number, tol, unit, explain, hint} */
  Atlas.quiz = function (box, id, qs) {
    var st = qs.map(function () { return { tries: 0, done: false, first: false }; });
    function score() {
      var d = st.filter(function (s) { return s.done; }).length;
      var r = st.filter(function (s) { return s.first; }).length;
      var el = $('.qscore', box);
      if (d === qs.length) {
        el.textContent = r + ' of ' + qs.length + ' right on the first try';
        var best = parseInt(store('best:' + id) || '-1', 10);
        if (r > best) store('best:' + id, String(r));
      } else el.textContent = d + ' of ' + qs.length + ' answered';
    }
    box.innerHTML = '<div class="qhead"><h2>Chapter quiz</h2><p class="qscore" aria-live="polite"></p></div>' +
      '<p class="qintro">Seven questions about the whole chapter. You get a hint after a wrong answer, then a second try.</p>';
    qs.forEach(function (q, i) {
      var d = document.createElement('div');
      d.className = 'q';
      var h = '<p class="qtext"><span class="qn">' + (i + 1) + '</span>' + q.q + '</p>';
      if (q.fig) h += '<div class="fig">' + q.fig + '</div>';
      if (q.type === 'mc') {
        h += '<div class="opts">' + q.options.map(function (o, j) {
          return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>';
        }).join('') + '</div>';
      } else {
        h += numForm(q, 'q-' + id + '-' + i, 'Check');
      }
      h += '<div class="fb" aria-live="polite"></div>';
      d.innerHTML = h;
      box.appendChild(d);
      var fb = $('.fb', d), s = st[i];
      function finish(ok) {
        s.done = true;
        if (ok && s.tries === 1) s.first = true;
        fb.className = 'fb ' + (ok ? 'ok' : 'bad');
        fb.innerHTML = '<b>' + (ok ? 'Yes, that is right.' : 'The answer is ' + shown(q, q.answer) + '.') + '</b> <span>' + (q.explain || '') + '</span>';
        Atlas.$$('button,input', d).forEach(function (b) { b.disabled = true; });
        score();
      }
      function wrong() {
        fb.className = 'fb bad';
        fb.innerHTML = '<b>Not quite.</b> <span>' + (q.hint || 'Have another go.') + '</span>';
      }
      if (q.type === 'mc') {
        Atlas.$$('.opt', d).forEach(function (b) {
          b.addEventListener('click', function () {
            if (s.done) return;
            s.tries++;
            var j = +b.getAttribute('data-j');
            if (j === q.answer) { b.classList.add('yes'); finish(true); }
            else {
              b.classList.add('no'); b.disabled = true;
              if (s.tries >= 2) { Atlas.$$('.opt', d)[q.answer].classList.add('yes'); finish(false); } else wrong();
            }
          });
        });
      } else {
        $('form', d).addEventListener('submit', function (e) {
          e.preventDefault();
          if (s.done) return;
          var v = parseNum($('input', d).value);
          if (isNaN(v)) { fb.className = 'fb bad'; fb.textContent = 'Type a number first.'; return; }
          s.tries++;
          if (numOk(q, v)) finish(true);
          else if (s.tries >= 2) finish(false); else wrong();
        });
      }
    });
    score();
  };

  /* ---------- Adaptive practice ----------
     Each chapter lists skills: {id, name, code, gen: function (level) -> question}.
     A question is {q, type, options/answer, unit, tol, fig, hint, steps:[...], explain}.
     Level 1 is the gentlest. Three right in a row on the first try moves up a level.
     Two misses in a row moves down a level and shows the steps. */
  var LV = ['', 'Getting started', 'Building', 'Stretch'];
  function skillState(sid) { return load('sk:' + sid, { lv: 1, streak: 0, miss: 0, n: 0, ok: 0, secure: false }); }
  function skillSave(sid, s) { s.t = Date.now(); save('sk:' + sid, s); }
  function status(s) {
    if (s.secure) return { k: 4, t: 'Secure' };
    if (!s.n && !s.cu) return { k: 0, t: 'Not started' };
    return { k: s.lv, t: 'Level ' + s.lv + ': ' + LV[s.lv] };
  }
  Atlas.skillStatus = function (sid) { return status(skillState(sid)); };
  function meter(k) {
    var h = '<span class="meter" aria-hidden="true">';
    for (var i = 1; i <= 4; i++) h += '<i class="' + (i <= k ? 'on' : '') + '"></i>';
    return h + '</span>';
  }
  Atlas.allSkills = function () {
    var out = [];
    Atlas.meta.forEach(function (m) {
      var ch = Atlas.chapters[m.id];
      if (ch && ch.practice) ch.practice.forEach(function (sk) { out.push({ ch: m, sk: sk }); });
    });
    return out;
  };
  function make(sk, lv) {
    var q = sk.gen(lv);
    q.skill = sk.id;
    return q;
  }

  Atlas.practice = function (box, id, skills, startSkill) {
    var mix = false, cur = null, qsk = null, q = null, tries = 0, done = false, session = { n: 0, first: 0 };
    function pickWeakest() {
      var list = skills.map(function (sk) { return { sk: sk, s: skillState(sk.id) }; });
      list.sort(function (a, b) {
        var ka = a.s.secure ? 9 : a.s.lv, kb = b.s.secure ? 9 : b.s.lv;
        return ka - kb || (a.s.t || 0) - (b.s.t || 0);
      });
      return list[0].sk;
    }
    function skillRow() {
      return skills.map(function (sk) {
        var st = status(skillState(sk.id));
        return '<button type="button" class="skill' + (cur && cur.id === sk.id && !mix ? ' cur' : '') + '" data-sk="' + sk.id + '" aria-pressed="' + (cur && cur.id === sk.id && !mix) + '">' +
          '<span class="sn">' + sk.name + '</span><span class="ss">' + meter(st.k) + ' ' + st.t + '</span><span class="sc">' + sk.code + '</span></button>';
      }).join('') +
        '<button type="button" class="skill mixb' + (mix ? ' cur' : '') + '" data-sk="mix" aria-pressed="' + mix + '"><span class="sn">Mixed review</span><span class="ss">All skills, weakest first</span><span class="sc">Repeat</span></button>';
    }
    box.innerHTML = '<div class="qhead"><h2>Practise</h2><p class="qscore pscore" aria-live="polite"></p></div>' +
      '<p class="qintro">New questions every time. Pick a skill. Three right in a row moves you up a level. If a question is tricky, you get a hint, then the steps, then a similar one to try.</p>' +
      '<div class="skills"></div><div class="pq" aria-live="polite"></div>';
    var row = $('.skills', box), pq = $('.pq', box);
    function refreshRow() {
      row.innerHTML = skillRow();
      Atlas.$$('.skill', row).forEach(function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-sk');
          mix = k === 'mix';
          cur = mix ? pickWeakest() : skills.filter(function (s) { return s.id === k; })[0];
          next(true);
        });
      });
    }
    function scoreLine() {
      $('.pscore', box).textContent = session.n ? 'This session: ' + session.n + ' done, ' + session.first + ' right first time' : '';
    }
    function next(focus, easier) {
      if (mix) cur = pickWeakest();
      qsk = cur;
      /* every 4th question in one skill reviews another skill already started, so old skills stay fresh */
      if (!mix && !easier && session.n % 4 === 3) {
        var old = Atlas.allSkills().filter(function (p) { return p.sk.id !== cur.id && skillState(p.sk.id).n > 0; });
        if (old.length) qsk = R.pick(old).sk;
      }
      var st = skillState(qsk.id);
      var lv = easier ? Math.max(1, st.lv - 1) : st.lv;
      q = make(qsk, lv); q.lv = lv; tries = 0; done = false;
      Atlas._q = q; /* exposed for automated checks */
      refreshRow();
      var h = '<div class="pcard"><p class="plv">' + (qsk !== cur ? '<span class="pill" style="--strand:var(--accent)">Review</span> ' : '') + '<span class="pill">' + qsk.code + '</span> <b>' + qsk.name + '</b> &middot; Level ' + lv + ': ' + LV[lv] + '</p>' +
        '<p class="qtext">' + q.q + '</p>' + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '');
      if (q.type === 'mc') h += '<div class="opts">' + q.options.map(function (o, j) { return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>';
      else h += numForm(q, 'pin-' + id, 'Check');
      h += '<div class="fb"></div><div class="steps"></div><div class="pnext"></div></div>';
      pq.innerHTML = h;
      if (q.type === 'mc') Atlas.$$('.opt', pq).forEach(function (b) {
        b.addEventListener('click', function () {
          if (done) return;
          var j = +b.getAttribute('data-j');
          if (j === q.answer) { b.classList.add('yes'); answer(true); }
          else { b.classList.add('no'); b.disabled = true; answer(false); }
        });
      });
      else $('form', pq).addEventListener('submit', function (e) {
        e.preventDefault();
        if (done) return;
        var v = parseNum($('input', pq).value);
        if (isNaN(v)) { $('.fb', pq).className = 'fb bad'; $('.fb', pq).textContent = 'Type a number first.'; return; }
        answer(numOk(q, v));
      });
      if (focus) { var f = $('.opt, input', pq); if (f) f.focus(); }
      scoreLine();
    }
    function answer(ok) {
      tries++;
      var fb = $('.fb', pq), st = skillState(qsk.id), msg = '';
      if (!ok && tries === 1) {
        fb.className = 'fb bad';
        fb.innerHTML = '<b>Not quite.</b> <span>' + (q.hint || 'Have another go.') + '</span>';
        return;
      }
      done = true; session.n++;
      Atlas.$$('button.opt, input, form .btn, .pad button', pq).forEach(function (b) { b.disabled = true; });
      if (q.type === 'mc') Atlas.$$('.opt', pq)[q.answer].classList.add('yes');
      st.n++;
      if (ok && tries === 1) {
        session.first++; st.ok++; st.streak++; st.miss = 0;
        if (st.streak >= 3 && st.lv < 3) { st.lv++; st.streak = 0; msg = 'Three in a row. Moving up to level ' + st.lv + '.'; }
        else if (st.streak >= 3 && st.lv === 3 && !st.secure) { st.secure = true; msg = 'This skill is now marked secure. Come back to it now and then to keep it fresh.'; }
      } else {
        st.streak = 0;
        if (!ok) {
          st.miss++;
          if (st.miss >= 2 && st.lv > 1) { st.lv--; st.miss = 0; msg = 'Let\'s step back to level ' + st.lv + ' and build up again.'; }
        }
      }
      skillSave(qsk.id, st);
      fb.className = 'fb ' + (ok ? 'ok' : 'bad');
      fb.innerHTML = '<b>' + (ok ? (tries === 1 ? 'Yes, that is right.' : 'Right on the second try.') : 'The answer is ' + shown(q, q.answer) + '.') + '</b> <span>' + (q.explain || '') + '</span>' +
        (msg ? '<p class="lvmsg">' + msg + '</p>' : '');
      var nb = '<button type="button" class="btn" id="pn-' + id + '">Next question</button>';
      if (!ok && q.steps && q.steps.length) {
        showSteps();
        nb = '<button type="button" class="btn" id="pn-' + id + '">Try a similar one</button>';
      }
      $('.pnext', pq).innerHTML = nb;
      $('#pn-' + id, pq).addEventListener('click', function () { next(true, !ok); });
      $('#pn-' + id, pq).focus();
      refreshRow();
      scoreLine();
    }
    function showSteps() {
      var box2 = $('.steps', pq), k = 0;
      function draw() {
        box2.innerHTML = '<p class="sth"><b>Step by step</b></p><ol>' + q.steps.slice(0, k + 1).map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
          (k + 1 < q.steps.length ? '<button type="button" class="btn alt" id="ps-' + id + '">Show the next step</button>' : '');
        var b = $('#ps-' + id, box2);
        if (b) b.addEventListener('click', function () { k++; draw(); var nb = $('#ps-' + id, box2); (nb || $('.pnext .btn', pq)).focus(); });
      }
      draw();
    }
    cur = (startSkill && skills.filter(function (s) { return s.id === startSkill; })[0]) || pickWeakest();
    refreshRow();
    pq.innerHTML = '<p class="pstart">Start with <b>' + cur.name + '</b>, or pick any skill above.</p><button type="button" class="btn" id="pgo-' + id + '">Start practising</button>';
    $('#pgo-' + id, pq).addEventListener('click', function () { next(true); });
    if (startSkill) next(false);
  };

  /* ---------- Your turn: quick checks at the end of a lesson part ----------
     Many short answers. A wrong answer points back to the step to use, then the child tries again
     until it is right, so every check ends with a correct answer. */
  function qHtml(q, iid) {
    var h = '<p class="qtext">' + q.q + '</p>' + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '');
    if (q.type === 'mc') h += '<div class="opts' + (q.wide ? ' wide' : '') + '">' + q.options.map(function (o, j) { return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>';
    else h += numForm(q, iid, 'Check');
    return h + '<div class="fb" aria-live="polite"></div>';
  }
  function quick(box, qs, id) {
    var k = 0, wrongs = 0;
    function show() {
      if (k >= qs.length) {
        box.innerHTML = '<p class="ytdone"><b>Done.</b> ' + (wrongs ? 'You fixed ' + wrongs + ' along the way. That is how we learn.' : 'All right the first time.') + ' <button type="button" class="btn alt">Do them again</button></p>';
        $('button', box).addEventListener('click', function () { k = 0; wrongs = 0; show(); });
        return;
      }
      var q = typeof qs[k] === 'function' ? qs[k]() : qs[k], tries = 0;
      box._q = q; /* exposed for automated checks */
      box.innerHTML = '<p class="ytn">' + (k + 1) + ' of ' + qs.length + '</p>' + qHtml(q, id + '-' + k);
      var fb = $('.fb', box);
      function res(ok, btn) {
        tries++;
        if (ok) {
          if (btn) btn.classList.add('yes');
          Atlas.$$('.opt, input, .numrow .btn, .pad button', box).forEach(function (b) { b.disabled = true; });
          fb.className = 'fb ok';
          fb.innerHTML = '<b>Yes.</b> <span>' + (q.explain || '') + '</span> <button type="button" class="btn">Next</button>';
          var nb = $('.fb .btn', box);
          nb.addEventListener('click', function () { k++; show(); var f = $('.opt, input, .btn', box); if (f) f.focus(); });
          nb.focus();
        } else {
          if (tries === 1) wrongs++;
          if (btn) { btn.classList.add('no'); btn.disabled = true; }
          fb.className = 'fb bad';
          fb.innerHTML = '<b>Let\'s fix it.</b> <span>' + (q.hint || 'Look again.') + '</span>';
        }
      }
      if (q.type === 'mc') Atlas.$$('.opt', box).forEach(function (b) {
        b.addEventListener('click', function () { res(+b.getAttribute('data-j') === q.answer, b); });
      });
      else $('form', box).addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = $('input', box), v = parseNum(inp.value);
        if (isNaN(v)) { fb.className = 'fb bad'; fb.textContent = 'Put in a number first.'; return; }
        res(numOk(q, v));
        if (!numOk(q, v)) { inp.value = ''; }
      });
    }
    show();
  }
  Atlas.quick = quick;

  /* warm-up: three review questions from skills met before this chapter, at the child's level */
  function warmup(box, id) {
    var before = [], mine = [];
    for (var i = 0; i < Atlas.meta.length && Atlas.meta[i].id !== id; i++) {
      var c = Atlas.chapters[Atlas.meta[i].id];
      if (c && c.practice) c.practice.forEach(function (sk) { before.push(sk); });
    }
    if (Atlas.chapters[id] && Atlas.chapters[id].practice) mine = Atlas.chapters[id].practice;
    var pool = before.length ? before : mine, picks = R.shuffle(pool).slice(0, 3);
    while (picks.length < 3 && pool.length) picks.push(R.pick(pool));
    box.innerHTML = '<h2>Warm-up</h2><p class="qintro">' + (before.length ? 'Three quick questions from earlier chapters.' : 'Three quick questions to get started.') + ' Most of every lesson is practice of things you already know.</p><div class="ytq"></div>';
    quick($('.ytq', box), picks.map(function (sk) {
      return function () { var st = skillState(sk.id); return make(sk, before.length ? st.lv : 1); };
    }), 'wu-' + id);
  }

  /* ---------- Check-up (assessment) ---------- */
  /* which expectations have been checked: one chip per code, from every chapter's skills */
  function coverage() {
    var cov = load('cov', {}), codes = [], seen = {};
    Atlas.allSkills().forEach(function (p) { p.sk.code.split(/,\s*/).forEach(function (c) { if (!seen[c]) { seen[c] = 1; codes.push(c); } }); });
    codes.sort(function (a, b) { return a.localeCompare(b, 'en', { numeric: true }); });
    var done = codes.filter(function (c) { return cov[c]; }).length;
    return '<h3>Expectations checked: ' + done + ' of ' + codes.length + '</h3><p class="pg-cov">' + codes.map(function (c) {
      var v = cov[c];
      return '<span class="' + (v ? (v.ok ? 'ok' : 'part') : '') + '" title="' + (v ? 'Checked ' + v.d + (v.ok ? ', all right' : ', some to practise') : 'Not checked yet') + '">' + c + '</span>';
    }).join('') + '</p><p class="t2">Green: checked and right. Yellow: checked, some to practise. White: not checked yet.</p>';
  }
  function checkup(app, scope) {
    var hist = load('checkups', []);
    if (!scope) {
      var h = '<div class="wrap chapter"><p class="crumb"><a href="#home">All chapters</a></p><header class="chead"><span class="num">Assessment</span><h1>Check-up</h1>' +
        '<p class="lede">Find out what you know and what to practise next.</p></header>' +
        '<section class="sec cu"><h2>How it works</h2><ul>' +
        '<li>Each question is new. There are no hints and no time limit.</li>' +
        '<li>If you do not know, choose <b>"I\'m not sure yet"</b>. That is more useful than a guess.</li>' +
        '<li>At the end you see every answer, what each question checked, and a plan for what to practise.</li>' +
        '<li>Questions start easy, with pictures. A chapter check-up asks one easy question for every skill, then a few a step harder.</li>' +
        '<li>Your practice levels change to match your results.</li></ul>' +
        '<div class="cuopts"><a class="btn" href="#check-up/short">Short check-up: 10 easy questions</a> <a class="btn alt" href="#check-up/all">Longer check-up: 20 easy questions</a></div>' +
        '<p class="t2">For a young child, the short check-up in one sitting is plenty. A grown-up can read each question aloud.</p>' +
        '<h3>Check one chapter</h3><p>Doing every chapter\'s check-up checks every Grade 1 expectation. The map below fills in as you go.</p><div class="cuch">' +
        Atlas.meta.filter(function (m) { return Atlas.chapters[m.id] && Atlas.chapters[m.id].practice; }).map(function (m) {
          return '<a class="pill" data-strand="' + m.strand + '" href="#check-up/' + m.id + '">' + m.title + '</a>';
        }).join('') + '</div>' + coverage() + '</section>';
      if (hist.length) {
        h += '<section class="sec cu"><h2>Past check-ups</h2><div class="tbl"><table><thead><tr><th class="l">Date</th><th class="l">What</th><th>Result</th></tr></thead><tbody>' +
          hist.slice(-10).reverse().map(function (r) { return '<tr><td class="l">' + r.d + '</td><td class="l">' + r.w + '</td><td>' + r.s + ' of ' + r.n + '</td></tr>'; }).join('') +
          '</tbody></table></div></section>';
      }
      h += '<div class="note"><p><b>For parents and teachers.</b> Each question is tagged with the Ontario expectation it checks. A single check-up is a snapshot, not a mark. Use it to choose what to practise, and repeat it after a few weeks to see growth.</p></div></div>';
      app.innerHTML = h;
      return;
    }
    /* Grade-appropriate by design: every question starts at level 1 (the gentlest, with pictures).
       Whole grade: level 1 only (short = one per chapter, full = two per chapter). One chapter: one level-1 question for every skill
       (so all chapter check-ups together cover every expectation), then up to 3 level-2 questions on skills answered right. */
    var pool = Atlas.allSkills(), qs = [], label, chapterScope = scope !== 'all' && scope !== 'short';
    function add(p, lv) { var q = make(p.sk, lv); q.ch = p.ch; q.sk = p.sk; q.lv = lv; qs.push(q); }
    if (!chapterScope) {
      label = scope === 'all' ? 'Full check-up' : 'Short check-up';
      Atlas.meta.forEach(function (m) {
        R.shuffle(pool.filter(function (p) { return p.ch.id === m.id; })).slice(0, scope === 'all' ? 2 : 1).forEach(function (p) { add(p, 1); });
      });
    } else {
      var m0 = Atlas.meta.filter(function (m) { return m.id === scope; })[0];
      if (!m0 || !Atlas.chapters[scope] || !Atlas.chapters[scope].practice) { location.hash = '#check-up'; return; }
      label = m0.title + ' check-up';
      var mine = pool.filter(function (p) { return p.ch.id === scope; });
      mine.forEach(function (p) { add(p, 1); });
      while (qs.length < 3) add(mine[qs.length % mine.length], 1);
    }
    var stepUps = 0;
    /* after the level-1 round, add level-2 questions for skills answered right */
    function stepUp() {
      if (!chapterScope || stepUps) return;
      stepUps = 1;
      var right = [];
      qs.forEach(function (q, i) { if (res[i].ok && right.indexOf(q.sk) < 0) right.push(q.sk); });
      R.shuffle(right).slice(0, 3).forEach(function (sk) { add(pool.filter(function (p) { return p.sk === sk; })[0], 2); });
    }
    var res = [], k = 0;
    function show() {
      var q = qs[k];
      Atlas._q = q;
      var h = '<div class="wrap chapter" data-strand="' + q.ch.strand + '"><p class="crumb"><a href="#check-up">Check-up</a></p>' +
        '<div class="sec cu"><div class="cuprog"><span>' + label + (q.lv > 1 ? ' &middot; a step harder' : '') + '</span><span>Question ' + (k + 1) + ' of ' + qs.length + (chapterScope && !stepUps ? ' (up to ' + (qs.length + Math.min(3, qs.length)) + ')' : '') + '</span></div>' +
        '<div class="bar-h"><i style="width:' + (k / qs.length * 100) + '%;background:var(--accent)"></i></div>' +
        '<p class="plv"><span class="pill">' + q.ch.title + '</span></p><p class="qtext">' + q.q + '</p>' + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '');
      if (q.type === 'mc') h += '<div class="opts">' + q.options.map(function (o, j) { return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>';
      else h += numForm(q, 'cuin', 'Save answer');
      h += '<p><button type="button" class="btn alt" id="cuskip">I\'m not sure yet</button></p></div></div>';
      app.innerHTML = h;
      function rec(given, ok) { res.push({ given: given, ok: ok }); k++; if (k === qs.length) stepUp(); if (k < qs.length) { show(); var f = $('.opt, input', app); if (f) f.focus(); } else report(); }
      if (q.type === 'mc') Atlas.$$('.opt', app).forEach(function (b) {
        b.addEventListener('click', function () { var j = +b.getAttribute('data-j'); rec(q.options[j], j === q.answer); });
      });
      else $('form', app).addEventListener('submit', function (e) {
        e.preventDefault();
        var v = parseNum($('#cuin', app).value);
        if (isNaN(v)) { $('#cuin', app).focus(); return; }
        rec(shown(q, v), numOk(q, v));
      });
      $('#cuskip', app).addEventListener('click', function () { rec(null, false); });
    }
    function report() {
      var right = res.filter(function (r) { return r.ok; }).length, bySk = {}, order = [];
      qs.forEach(function (q, i) {
        var key = q.sk.id;
        if (!bySk[key]) { bySk[key] = { q: q, ok: 0, n: 0, top: 0 }; order.push(key); }
        bySk[key].n++; if (res[i].ok) { bySk[key].ok++; bySk[key].top = Math.max(bySk[key].top, q.lv); }
      });
      /* practice starts where the check-up shows: a miss -> level 1, right at level 1 -> level 2, right at level 2 -> level 3 */
      var cov = load('cov', {}), today0 = new Date().toISOString().slice(0, 10);
      order.forEach(function (key) {
        var b = bySk[key], st = skillState(key), allOk = b.ok === b.n;
        if (!allOk) { st.lv = 1; st.secure = false; } else if (!st.secure) st.lv = Math.max(st.lv || 1, Math.min(3, b.top + 1));
        st.streak = 0; st.miss = 0; st.cu = 1; skillSave(key, st);
        b.q.sk.code.split(/,\s*/).forEach(function (c) { var was = cov[c] || {}; cov[c] = { d: today0, ok: allOk ? 1 : 0, n: (was.n || 0) + 1 }; });
      });
      save('cov', cov);
      var d = new Date(), ds = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
      hist.push({ d: ds, w: label, s: right, n: qs.length });
      save('checkups', hist.slice(-30));
      var todo = order.filter(function (key) { return bySk[key].ok < bySk[key].n; });
      save('plan', todo.slice(0, 4).map(function (key) { var q = bySk[key].q; return { ch: q.ch.id, sk: key, name: q.sk.name, t: q.ch.title }; }));
      var pct = right / qs.length;
      var h = '<div class="wrap chapter"><p class="crumb"><a href="#check-up">Check-up</a></p><header class="chead"><span class="num">Results &middot; ' + ds + '</span><h1>' + right + ' of ' + qs.length + '</h1>' +
        '<p class="lede">' + (pct >= 0.85 ? 'Strong work. Keep these skills fresh with mixed review.' : pct >= 0.6 ? 'A solid base. The plan below shows what to work on next.' : 'This shows where to start. Work through the plan one skill at a time.') + '</p></header>' +
        '<section class="sec cu"><h2>Your plan</h2>' +
        (todo.length ? '<ol class="plan">' + todo.slice(0, 4).map(function (key) {
          var q = bySk[key].q;
          return '<li><a href="#' + q.ch.id + '/practice/' + key + '">Practise <b>' + q.sk.name + '</b></a> <span class="t2">(' + q.ch.title + ', ' + q.sk.code + ')</span></li>';
        }).join('') + '</ol>' : '<p>Nothing to fix. Try the Stretch level in any chapter.</p>') +
        '<p><button type="button" class="btn alt" onclick="window.print()">Print or save this report</button></p></section>' +
        '<section class="sec cu"><h2>Every question</h2><div class="tbl"><table><thead><tr><th class="l">Skill</th><th>Expectation</th><th>Result</th></tr></thead><tbody>' +
        order.map(function (key) {
          var b = bySk[key];
          return '<tr><td class="l">' + b.q.sk.name + '</td><td>' + b.q.sk.code + '</td><td>' + (b.ok === b.n ? '<b class="okc">Got it</b>' + (b.top > 1 ? ', level 2 too' : '') : b.ok ? 'Partly' : '<b class="noc">Start here</b>') + (b.n > 1 ? ' (' + b.ok + '/' + b.n + ')' : '') + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<div class="review">' + qs.map(function (q, i) {
          var r = res[i];
          return '<div class="q"><p class="qtext"><span class="qn">' + (i + 1) + '</span>' + q.q + '</p>' + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '') +
            '<p class="fb ' + (r.ok ? 'ok' : 'bad') + '"><b>' + (r.ok ? 'Correct: ' + shown(q, q.answer) : (r.given === null ? 'Not sure yet.' : 'You said ' + r.given + '.') + ' The answer is ' + shown(q, q.answer) + '.') + '</b> <span>' + (q.explain || '') + '</span></p></div>';
        }).join('') + '</div></section>' +
        '<p><a class="btn" href="#check-up">Back to check-ups</a></p></div>';
      app.innerHTML = h;
      window.scrollTo(0, 0);
    }
    show();
  }

  function counts(ch) {
    return { s: (ch.html.match(/<section/g) || []).length, q: ch.quiz ? ch.quiz.length : 0 };
  }

  /* a small ten frame showing n (1 to 10), used as the chapter number on cards */
  function miniFrame(n) {
    var s = '';
    for (var i = 0; i < 10; i++) {
      var x = 3 + (i % 5) * 14, y = 3 + Math.floor(i / 5) * 14;
      s += '<rect x="' + x + '" y="' + y + '" width="14" height="14" style="fill:var(--card);stroke:var(--strand)" stroke-width="1.5"/>';
      if (i < n) s += '<circle cx="' + (x + 7) + '" cy="' + (y + 7) + '" r="4.6" style="fill:var(--strand)"/>';
    }
    return '<svg viewBox="0 0 76 34" width="76" height="34" aria-hidden="true">' + s + '</svg>';
  }
  function home(app) {
    var h = '<div class="wrap"><div class="hero"><div class="herot"><h1>Grade 1 Math</h1>' +
      '<p class="lede">Free lessons for Ontario Grade 1 math. One idea at a time, hands-on blocks and counters, and lots of practice.</p></div>' +
      '<div class="herof" aria-hidden="true">' + Atlas.draw.frames(7, { r: 1, w: 210 }) + '</div></div>';
    h += '<ol class="howto" aria-label="How each chapter works">' +
      '<li><b>Learn</b><span>one idea on screen at a time</span></li>' +
      '<li><b>Watch</b><span>a short clip shows it</span></li>' +
      '<li><b>Try it</b><span>blocks and counters that light up and count</span></li>' +
      '<li><b>Your turn</b><span>quick taps, fix any mistakes</span></li>' +
      '<li><b>Practise</b><span>new questions that get harder or easier</span></li>' +
      '<li><b>Quiz</b><span>7 questions on the chapter</span></li></ol>';
    var plan = load('plan', []), hist = load('checkups', []);
    h += '<div class="start">';
    if (hist.length) {
      var last = hist[hist.length - 1];
      h += '<p><b>Last check-up</b> (' + last.d + '): ' + last.s + ' of ' + last.n + '.</p>' +
        (plan.length ? '<p>Next up:</p><ul>' + plan.map(function (p) { return '<li><a href="#' + p.ch + '/practice/' + p.sk + '">' + p.name + '</a> <span class="t2">(' + p.t + ')</span></li>'; }).join('') + '</ul>' : '') +
        '<p><a href="#check-up">Take another check-up</a></p>';
    } else {
      h += '<p><b>Not sure where to start?</b> Try the <a href="#check-up">check-up</a>. The short one has 10 questions and makes a practice plan. Or just start at Chapter 1.</p>';
    }
    h += '</div><div class="legend">';
    Object.keys(Atlas.strands).forEach(function (k) {
      h += '<span class="pill" data-strand="' + k + '">' + Atlas.strands[k] + '</span>';
    });
    h += '</div><div class="cards">';
    var num = 0;
    Atlas.meta.forEach(function (m) {
      var ch = Atlas.chapters[m.id];
      if (!m.ref) num++;
      if (!ch) return;
      var c = counts(ch), best = parseInt(store('best:' + m.id) || '-1', 10), sec = 0, nsk = ch.practice ? ch.practice.length : 0;
      if (ch.practice) ch.practice.forEach(function (sk) { if (skillState(sk.id).secure) sec++; });
      h += '<a class="card" data-strand="' + m.strand + '" href="#' + m.id + '">' +
        '<span class="no">' + (m.ref ? '<b>Ref</b>' : miniFrame(num) + '<b>' + num + '</b>') + '</span><h2>' + m.title + '</h2><p class="desc">' + m.desc + '</p>' +
        '<div class="meta"><span class="pill" data-strand="' + m.strand + '">' + Atlas.strands[m.strand] + '</span>' +
        (m.ref ? '<span>one page</span>' : '<span>' + (ch.lessons ? ch.lessons.length + ' lessons, ' + ch.lessons.reduce(function (t, l) { return t + l.concepts.length; }, 0) + ' ideas' : c.s + ' parts') + (best >= 0 ? ' &middot; <span class="done">quiz ' + best + '/' + c.q + '</span>' : '') + (sec ? ' &middot; <span class="done">' + sec + '/' + nsk + ' secure</span>' : '') + '</span>') + '</div></a>';
    });
    h += '</div><div class="note"><p><b>For grown-ups.</b> This site follows the five content strands (B to F) of the 2020 Ontario elementary math curriculum for Grade 1. ' +
      'It is a study aid, not a copy of the curriculum. Please check details against the Ontario Ministry of Education document.</p>' +
      '<p><b>How to help.</b> Sit with your child, read the words together, and let them tap the answers. Real objects help a lot: buttons, coins, pasta or blocks to count. Ten minutes a day is better than an hour once a week.</p>' +
      '<p><b>Not covered:</b> strand A (social-emotional learning and math processes) is woven through, not taught on its own. Mathematical modelling (C4) has no chapter of its own. Real-world tasks like collecting data from classmates or measuring with real objects are suggested, but can only be done away from the screen.</p>' +
      '<p><b>Progress</b> is saved only in this browser. Nothing is sent anywhere.</p></div></div>';
    app.innerHTML = h;
  }

  function chapter(app, id, sub) {
    var ch = Atlas.chapters[id], idx = 0;
    Atlas.meta.forEach(function (m, i) { if (m.id === id) idx = i; });
    var m = Atlas.meta[idx], prev = Atlas.meta[idx - 1], next = Atlas.meta[idx + 1];
    var h = '<div class="wrap chapter" data-strand="' + m.strand + '"><p class="crumb"><a href="#home">All chapters</a></p>' +
      '<header class="chead"><span class="num">' + (m.ref ? 'Reference' : 'Chapter ' + (idx + 1)) + '</span><h1>' + m.title + '</h1>' +
      '<p class="lede">' + m.sub.charAt(0).toUpperCase() + m.sub.slice(1) + '.</p>' +
      '<span class="pill">' + m.strand + ' &middot; ' + Atlas.strands[m.strand] + '</span>' + (m.codes ? ' <span class="codes">Ontario expectations ' + m.codes + '</span>' : '') + '</header>';
    /* chapters built as lessons show one idea per screen (assets/lesson.js) */
    if (ch.lessons && Atlas.lessons) return Atlas.lessons.chapter(app, id, sub, { head: h.replace(/^<div class="wrap chapter"[^>]*><p class="crumb">.*?<\/p>/, ''), m: m, prev: prev, next: next });
    if (ch.practice || ch.quiz) h += '<nav class="jump" aria-label="In this chapter"><a href="#' + id + '/lesson">Lesson</a>' + (ch.practice ? '<a href="#' + id + '/practice">Practise</a>' : '') + (ch.quiz ? '<a href="#' + id + '/quiz">Chapter quiz</a>' : '') + '<a href="#check-up/' + id + '">Check-up</a></nav>';
    if (ch.practice && !m.ref) h += '<div class="quiz warm" id="warm"></div>';
    h += '<div id="lesson">' + ch.html + '</div>';
    if (ch.practice) h += '<div class="quiz prac" id="practice"></div>';
    if (ch.quiz) h += '<div class="quiz" id="quiz"></div>';
    h += '<div class="pn">' +
      (prev ? '<a href="#' + prev.id + '"><small>Previous</small>' + prev.title + '</a>' : '<span></span>') +
      (next ? '<a class="nx" href="#' + next.id + '"><small>Next</small>' + next.title + '</a>' : '') + '</div></div>';
    app.innerHTML = h;
    if (ch.init) ch.init(app);
    /* Do it with me: <div class="wm"><ol><li>...</li></ol></div> shows one step at a time */
    Atlas.$$('#lesson .wm', app).forEach(function (wm, wi) {
      var li = Atlas.$$('ol > li', wm), k = 0, b = document.createElement('button');
      if (li.length < 2) return;
      b.type = 'button'; b.className = 'btn alt wmb noread';
      function draw() {
        li.forEach(function (l, i) { l.hidden = i > k; l.classList.toggle('now', i === k); });
        b.textContent = k + 1 < li.length ? 'Next step (' + (k + 2) + ' of ' + li.length + ')' : 'Start again';
      }
      b.addEventListener('click', function () { k = k + 1 < li.length ? k + 1 : 0; draw(); });
      wm.appendChild(b);
      draw();
    });
    /* Your turn boxes: <div class="yt"></div> placeholders, filled in order from ch.checks */
    if (ch.checks) Atlas.$$('#lesson .yt', app).forEach(function (el, i) {
      if (!ch.checks[i]) return;
      el.innerHTML = '<span class="lt">Your turn</span><div class="ytq"></div>';
      quick($('.ytq', el), ch.checks[i], 'yt-' + id + '-' + i);
    });
    if ($('#warm', app)) warmup($('#warm', app), id);
    var parts = (sub || '').split('/');
    if (ch.practice) Atlas.practice($('#practice', app), id, ch.practice, parts[0] === 'practice' ? parts[1] : null);
    if (ch.quiz) Atlas.quiz($('#quiz', app), id, ch.quiz);
    return parts[0];
  }

  var lastPage = '';
  function route() {
    var raw = (location.hash || '').replace('#', '') || 'home';
    var cut = raw.indexOf('/'), id = cut < 0 ? raw : raw.slice(0, cut), sub = cut < 0 ? '' : raw.slice(cut + 1);
    var app = $('#app'), target = null;
    /* in-chapter jumps do not re-render the page */
    if (id === lastPage && Atlas.chapters[id] && !Atlas.chapters[id].lessons && (sub === 'lesson' || sub === 'practice' || sub === 'quiz')) {
      target = $('#' + sub, app);
      if (target) { target.scrollIntoView(); return; }
    }
    lastPage = id;
    if (id === 'check-up') checkup(app, sub);
    else if (id === 'progress' && Atlas.lessons) Atlas.lessons.progress(app);
    else if (id === 'tools' && Atlas.lessons) Atlas.lessons.toolbox(app, sub);
    else if (id === 'home' || !Atlas.chapters[id]) home(app);
    else {
      var where = chapter(app, id, sub);
      if (where) target = $('#' + where, app);
    }
    if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }

  /* reading supports: theme and larger text, remembered in this browser */
  function prefs() {
    var root = document.documentElement, th = store('theme') === 'dark' ? 'dark' : 'light', big = store('big') === '1';
    function apply() {
      root.setAttribute('data-theme', th);
      root.classList.toggle('bigtext', big);
      var tb = $('#themeb'), bb = $('#bigb');
      if (tb) tb.textContent = 'Theme: ' + th;
      if (bb) { bb.setAttribute('aria-pressed', String(big)); bb.textContent = big ? 'Text: larger' : 'Text: normal'; }
    }
    var tb = $('#themeb'), bb = $('#bigb');
    /* grown-up view: coaching notes (common mistakes) for a parent or tutor. Kept outside the g1atlas: keys so it is never copied to the student's account. */
    var adb = $('#adultb');
    function adult(on) {
      try { if (on === undefined) on = localStorage.getItem('atlas:adult') === '1'; else localStorage.setItem('atlas:adult', on ? '1' : '0'); } catch (e) { on = !!on; }
      root.classList.toggle('adult', on);
      if (adb) { adb.setAttribute('aria-pressed', String(on)); adb.textContent = 'Grown-up view: ' + (on ? 'on' : 'off'); }
      return on;
    }
    Atlas.adult = adult;
    if (adb) adb.addEventListener('click', function () { adult(!root.classList.contains('adult')); });
    adult();
    if (tb) tb.addEventListener('click', function () { th = th === 'light' ? 'dark' : 'light'; store('theme', th); apply(); });
    if (bb) bb.addEventListener('click', function () { big = !big; store('big', big ? '1' : '0'); apply(); });
    apply();
  }

  /* keep the groups of a big number together on one line: 48 000 never breaks after 48 */
  function glue(node) {
    var w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), t, re = /(\d) (?=\d{3}(?!\d))/g;
    while ((t = w.nextNode())) if (re.test(t.nodeValue)) { re.lastIndex = 0; t.nodeValue = t.nodeValue.replace(re, '$1\u00a0'); }
  }
  Atlas.start = function () {
    prefs();
    glue(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === 'characterData') glue(m.target.parentNode || m.target);
        else m.addedNodes.forEach(function (n) { if (n.nodeType === 1 || n.nodeType === 3) glue(n.nodeType === 3 ? n.parentNode || n : n); });
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
    window.addEventListener('hashchange', route);
    route();
  };
})();
