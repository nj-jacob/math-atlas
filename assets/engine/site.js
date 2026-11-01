/* Math Atlas grade app, shared by every grade: chapter registry, router, home page, practice, chapter quiz, check-up,
   progress and reading settings. It creates the Atlas object. No dependencies.
   Each grade's assets/grade.js calls Atlas.setup({ grade, tools, meta, home, ... }) with that grade's own settings
   (the defaults are in S below; see "One grade site" in docs/ARCHITECTURE.md). Saved progress uses gNatlas: keys. */
(function () {
  'use strict';
  /* grade settings: Atlas.setup replaces any of these */
  var S = {
    grade: 0,
    tools: [],
    meta: [],
    home: { hero: '', start: '', notes: '' },
    right: 'Correct.',                       /* first-try feedback in quiz and practice */
    right2: 'Correct on the second try.',
    input: { mode: 'decimal', placeholder: 'Type a number', pad: false }, /* typed answers; pad: a big number pad under each box */
    parseNum: null,                          /* function (text) -> number, for a grade that reads typed answers its own way */
    judge: null,                             /* function (q, value, text) -> true when a typed answer is right */
    wholeDollars: false,                     /* show $5 rather than $5.00 for a whole-dollar answer */
    groupDecimals: false,                    /* also space long decimals in groups of three: 0.333 333 */
    svgScale: 1,                             /* draw pictures this many times bigger on wide screens */
    svgLabelText: false,                     /* turn html in picture labels into plain text (3/4) for screen readers */
    diskLabel: { x: 120, y: 5, size: 13 },   /* place names beside Atlas.draw.disks */
    checkup: {
      steps: [
        'Each question is new. There are no hints and no time limit.',
        'Questions start easy, with pictures. A chapter check-up asks one easy question for every skill, then a few a step harder.',
        'If you do not know, choose <b>"I\'m not sure yet"</b>. That is more useful than a guess.',
        'At the end you see every answer, what each question checked, and a plan for what to practise.',
        'Your practice levels change to match your results.'
      ],
      /* whole-grade check-ups: #check-up/<scope>, per easy questions from every chapter. label is saved with the result. */
      whole: [{ scope: 'all', per: 1, label: 'Quick whole-grade check-up', button: 'Quick whole-grade check-up: one easy question from every chapter' }],
      note: ''
    },
    afterRoute: null                         /* function (app), run after each page is drawn */
  };
  var Atlas = (window.Atlas = {
    chapters: {},
    strands: { B: 'Number', C: 'Algebra', D: 'Data', E: 'Spatial Sense', F: 'Financial Literacy' }
  });
  Atlas.setup = function (cfg) {
    Object.keys(cfg).forEach(function (k) { S[k] = cfg[k]; });
    Atlas.grade = S.grade;
    Atlas.tools = S.tools;
    Atlas.meta = S.meta;
  };

  var $ = (Atlas.$ = function (s, r) { return (r || document).querySelector(s); });
  Atlas.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  Atlas.register = function (id, ch) { Atlas.chapters[id] = ch; if (ch.full) (ch.practice || []).forEach(function (sk) { sk.full = true; }); };
  /* The chapters' older one-page lessons call Atlas.yt for a "Your turn" box. Those pages are no longer shown
     (every chapter now teaches through Atlas.lessons), so the box is left out. */
  Atlas.yt = function () { return ''; };

  /* Canadian number style: a space groups numbers of 5 or more digits. */
  Atlas.fmt = function (n) {
    var s = String(n), neg = '';
    if (s.charAt(0) === '-') { neg = '-'; s = s.slice(1); }
    var p = s.split('.'), i = p[0], f = p.length > 1 ? p[1] : '';
    if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (S.groupDecimals && f.length > 4) f = f.replace(/(\d{3})(?=\d)/g, '$1 ');
    return neg + i + (p.length > 1 ? '.' + f : '');
  };
  Atlas.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; };
  Atlas.money = function (c) { return '$' + (c / 100).toFixed(2); };
  /* round away floating point noise: 0.1 + 0.2 -> 0.3 */
  Atlas.clean = function (x) { return Math.round(x * 1e6) / 1e6; };

  /* saved progress for this grade: localStorage keys gNatlas:<key> */
  function store(k, v) {
    var key = 'g' + S.grade + 'atlas:' + k;
    try { if (v === undefined) return localStorage.getItem(key); localStorage.setItem(key, v); } catch (e) { return null; }
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
    label = String(label || '');
    if (S.svgLabelText) label = label.replace(/<sup>(\d+)<\/sup><sub>(\d+)<\/sub>/g, '$1/$2').replace(/<[^>]*>/g, '').replace(/"/g, '');
    /* svgScale > 1 draws it bigger on wide screens; .fig svg shrinks it to fit a phone */
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + Math.round(w * S.svgScale) + '" role="img" aria-label="' + label + '">' + inner + '</svg>';
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
     Place index p: 0 ones, 1 tens, 2 hundreds, 3 thousands, 4 ten thousands, 5 hundred thousands, 6 millions. ---- */
  Atlas.PLACES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
  Atlas.PLACE1 = ['one', 'ten', 'hundred', 'thousand', 'ten thousand', 'hundred thousand', 'million'];
  Atlas.pc = function (p) { return 'var(--p' + p + ')'; };
  /* a single place value disk; small disks (r < 12) have no label */
  Atlas.draw.disk = function (x, y, r, p) {
    var lab = Atlas.fmt(Math.pow(10, p)), fs = lab.length <= 3 ? r * 0.8 : lab.length === 4 ? r * 0.62 : lab.length <= 7 ? r * 0.48 : r * 0.36;
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:' + Atlas.pc(p) + '" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>' +
      (r >= 12 ? '<text x="' + x + '" y="' + (y + fs * 0.36) + '" text-anchor="middle" font-size="' + fs.toFixed(1) + '" font-weight="700" style="fill:' + (p ? '#fff' : '#13203a') + '">' + lab + '</text>' : '');
  };
  /* labelled disks for a list of groups [{p, n}], one row per group, in the order given */
  Atlas.draw.disks = function (groups, label) {
    var r = 17, gap = 38, s = '', y = 22, maxN = 1, L = S.diskLabel;
    groups.forEach(function (g) { maxN = Math.max(maxN, Math.min(g.n, 10)); });
    var W = Math.max(150, L.x + maxN * gap);
    groups.forEach(function (g) {
      var rows = Math.ceil(g.n / 10) || 1;
      s += '<text x="4" y="' + (y + L.y) + '" font-size="' + L.size + '" class="t2">' + Atlas.PLACES[g.p] + '</text>';
      for (var i = 0; i < g.n; i++) s += Atlas.draw.disk(L.x + (i % 10) * gap, y + Math.floor(i / 10) * gap, r, g.p);
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
  /* a picture of a whole number in base-ten blocks, wrapping onto new rows. 10 000 is shown as 10 thousand cubes. */
  Atlas.draw.blocks = function (n, label, W, u) {
    W = W || 540;
    u = u || 5;
    var items = [], digits = String(n).split('').reverse();
    for (var p = 3; p >= 0; p--) for (var i = 0; i < (p === 3 ? Math.floor(n / 1000) : +digits[p] || 0); i++) items.push(p);
    return Atlas.draw.pile(items, label || 'Base-ten blocks showing ' + n, W, u);
  };
  /* base-ten blocks from a list of places, in the order given, e.g. [2, 2, 1, 0] is 2 flats, a rod and a cube */
  Atlas.draw.pile = function (items, label, W, u) {
    W = W || 540;
    u = u || 5;
    var s = '', top = 4;
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
    if (!items.length) return Atlas.svg(120, 30, '<text x="4" y="20" font-size="14" class="t2">(no blocks)</text>', label || 'No blocks');
    return Atlas.svg(Math.ceil(maxX + 4), Math.ceil(y), s, label);
  };
  /* ---- fraction pictures ---- */
  /* a circle cut into d equal slices with n shaded (n can be up to d) */
  Atlas.draw.pie = function (n, d, r, label, col) {
    r = r || 46; col = col || 'var(--strand)';
    var c = r + 3, s = '';
    if (d === 1) s = '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" style="fill:' + (n ? col : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/>';
    else for (var i = 0; i < d; i++) {
      var a0 = -Math.PI / 2 + 2 * Math.PI * i / d, a1 = a0 + 2 * Math.PI / d;
      s += '<path d="M' + c + ' ' + c + 'L' + (c + r * Math.cos(a0)).toFixed(2) + ' ' + (c + r * Math.sin(a0)).toFixed(2) + 'A' + r + ' ' + r + ' 0 0 1 ' + (c + r * Math.cos(a1)).toFixed(2) + ' ' + (c + r * Math.sin(a1)).toFixed(2) + 'Z" style="fill:' + (i < n ? col : 'var(--card)') + ';stroke:var(--ink)" stroke-width="' + (d > 24 ? 1 : 2) + '" stroke-linejoin="round"/>';
    }
    return Atlas.svg(2 * c, 2 * c, s, label || n + ' of ' + d + ' equal slices shaded');
  };
  /* bars stacked one above the other, all the same length so sizes can be compared.
     rows: [{n, d, label, col}]; a row with n > d draws extra wholes to the right */
  Atlas.draw.fbars = function (rows, opts) {
    opts = opts || {};
    var W = opts.w || 540, lw = opts.lw || 70, unit = opts.unit || (W - lw - 10), h = 34, gap = 12, s = '', y = 4, maxX = 0;
    rows.forEach(function (r) {
      var wholes = Math.max(1, Math.ceil(r.n / r.d)), cw = unit / r.d;
      s += '<text x="' + (lw - 10) + '" y="' + (y + h / 2 + 6) + '" text-anchor="end" font-size="17" font-weight="700">' + (r.label || r.n + '/' + r.d) + '</text>';
      for (var w = 0; w < wholes; w++) for (var i = 0; i < r.d; i++) {
        var k = w * r.d + i, x = lw + w * (unit + 8) + i * cw;
        s += '<rect x="' + x.toFixed(2) + '" y="' + y + '" width="' + cw.toFixed(2) + '" height="' + h + '" style="fill:' + (k < r.n ? (r.cols ? r.cols[k] || r.col || 'var(--strand)' : r.col || 'var(--strand)') : 'var(--card)') + ';stroke:var(--ink)" stroke-width="' + (r.d > 30 ? 0.75 : 1.5) + '"/>';
        maxX = Math.max(maxX, x + cw);
      }
      y += h + gap;
    });
    if (opts.mark !== undefined) {
      var mx = lw + unit * opts.mark;
      s += '<line x1="' + mx + '" y1="0" x2="' + mx + '" y2="' + (y - gap + 4) + '" style="stroke:var(--accent)" stroke-width="2.5" stroke-dasharray="6 4"/>';
    }
    return Atlas.svg(Math.ceil(Math.max(maxX, lw + unit) + 4), y - gap + 6, s, opts.label || rows.map(function (r) { return r.n + '/' + r.d; }).join(', ') + ' drawn as bars');
  };
  /* number line from 0 to max wholes, ticks every 1/d, points [{v, label, col, up}] */
  Atlas.draw.fline = function (max, d, points, label, W) {
    W = W || 540;
    var x0 = 24, x1 = W - 24, y = 62, s = '<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    var X = function (v) { return x0 + (x1 - x0) * v / max; };
    for (var i = 0; i <= max * d; i++) {
      var whole = i % d === 0, x = X(i / d);
      s += '<line x1="' + x + '" y1="' + (y - (whole ? 12 : 7)) + '" x2="' + x + '" y2="' + (y + (whole ? 12 : 7)) + '" style="stroke:var(--ink)" stroke-width="' + (whole ? 2.5 : 1.5) + '"/>';
      if (whole) s += '<text x="' + x + '" y="' + (y + 32) + '" text-anchor="middle" font-size="17" font-weight="700">' + (i / d) + '</text>';
    }
    (points || []).forEach(function (p, k) {
      var x = X(p.v), up = p.up !== false;
      s += '<circle cx="' + x + '" cy="' + y + '" r="8" style="fill:' + (p.col || 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>';
      if (p.label) s += '<text x="' + Math.min(Math.max(x, 30), W - 30) + '" y="' + (up ? y - 20 : y + 52) + '" text-anchor="middle" font-size="16" font-weight="700">' + p.label + '</text>';
    });
    return Atlas.svg(W, y + 60, s, label || 'Number line from 0 to ' + max);
  };

  Atlas.bind = function (root, ids, fn) {
    var found = 0;
    ids.forEach(function (i) {
      var e = $('#' + i, root);
      if (e) { found++; e.addEventListener('input', fn); e.addEventListener('change', fn); }
    });
    /* a lesson screen may hold only one of a chapter's widgets: skip the others */
    if (found) fn();
  };

  function shown(q, v) {
    if (Q(q)) return v === q.answer ? Atlas.Q.text(q) : String(v);
    if (q.type === 'mc') return q.options[v];
    if (q.show !== undefined && v === q.answer) return q.show;
    var a = Atlas.fmt(v);
    if (q.unit === '$') return '$' + (S.wholeDollars && Number(v) % 1 === 0 ? Number(v) : Number(v).toFixed(2));
    return a + (q.unit ? ' ' + q.unit : '');
  }
  function unitHtml(q) { return q.unit && q.unit !== '$' ? '<span class="unit">' + q.unit + '</span>' : ''; }
  function parseNum(t) { return S.parseNum ? S.parseNum(t) : parseFloat(String(t).replace(/[^0-9.\-]/g, '')); }
  function numOk(q, v, raw) { return S.judge ? S.judge(q, v, raw) : Math.abs(v - q.answer) <= (q.tol || 1e-9); }
  /* new answer types (tap, pick, order, line, match, tf, fill, build) live in qkit.js */
  function Q(q) { return !!(Atlas.Q && Atlas.Q.has(q)); }
  /* a typed answer box. S.input.pad adds a big number pad for children who find the keyboard hard. */
  function numForm(q, iid, label) {
    return '<form class="numrow"><label class="sr" for="' + iid + '">Your answer</label>' + (q.unit === '$' ? '<span class="unit">$</span>' : '') +
      '<input type="text" inputmode="' + (q.kb || S.input.mode) + '" autocomplete="off" id="' + iid + '" placeholder="' + S.input.placeholder + '">' + unitHtml(q) +
      '<button class="btn" type="submit">' + label + '</button>' + (S.input.pad ? padHtml() : '') + '</form>';
  }
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

  /* Practice questions.
     {q, type:'mc', options:[...], answer:index, explain, hint}
     {q, type:'num', answer:number, tol, unit, explain, hint} */
  Atlas.quiz = function (box, id, qs0) {
    var qs = typeof qs0 === 'function' ? qs0() : qs0;
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
      '<p class="qintro">' + (typeof qs0 === 'function' ? 'Seven questions about the whole chapter, new every time. ' : 'Seven questions about the whole chapter. ') + 'You get a hint after a wrong answer, then a second try.</p>';
    qs.forEach(function (q, i) {
      var d = document.createElement('div');
      d.className = 'q';
      var h = '<p class="qtext"><span class="qn">' + (i + 1) + '</span>' + q.q + '</p>';
      if (q.fig) h += '<div class="fig">' + q.fig + '</div>';
      if (Q(q)) h += '<div class="qkbox"></div>';
      else if (q.type === 'mc') {
        h += '<div class="opts">' + q.options.map(function (o, j) {
          return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>';
        }).join('') + '</div>';
      } else {
        h += numForm(q, 'q-' + id + '-' + i, 'Check');
      }
      h += '<div class="fb" aria-live="polite"></div>';
      d.innerHTML = h;
      box.appendChild(d);
      d._q = q; /* exposed for automated checks */
      var fb = $('.fb', d), s = st[i];
      function finish(ok) {
        s.done = true;
        if (ok && s.tries === 1) s.first = true;
        fb.className = 'fb ' + (ok ? 'ok' : 'bad');
        fb.innerHTML = '<b>' + (ok ? S.right : 'The answer is ' + shown(q, q.answer) + '.') + '</b> <span>' + (q.explain || '') + '</span>';
        Atlas.$$('button,input', d).forEach(function (b) { b.disabled = true; });
        score();
      }
      function wrong() {
        fb.className = 'fb bad';
        fb.innerHTML = '<b>Not quite.</b> <span>' + (q.hint || 'Have another go.') + '</span>';
      }
      if (Q(q)) {
        var api = Atlas.Q.mount($('.qkbox', d), q, function (ok) {
          if (s.done) return;
          s.tries++;
          if (ok) finish(true);
          else if (s.tries >= 2) { api.reveal(); api.lock(); finish(false); } else wrong();
        });
        d._qk = api;
      } else if (q.type === 'mc') {
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
          var raw = $('input', d).value, v = parseNum(raw);
          if (isNaN(v)) { fb.className = 'fb bad'; fb.textContent = 'Type a number first.'; return; }
          s.tries++;
          if (numOk(q, v, raw)) finish(true);
          else if (s.tries >= 2) finish(false); else wrong();
        });
      }
    });
    if (typeof qs0 === 'function') {
      var again = document.createElement('p');
      again.className = 'qagain';
      again.innerHTML = '<button type="button" class="btn alt">New quiz</button> <span class="t2">Seven different questions on the same chapter.</span>';
      box.appendChild(again);
      $('button', again).addEventListener('click', function () { Atlas.quiz(box, id, qs0); box.scrollIntoView({ block: 'start' }); });
    }
    score();
  };
  /* A fresh chapter quiz: one question from each of 5 different skills (level 2, any question shape)
     plus 2 from the chapter's written quiz, mixed together. */
  Atlas.freshQuiz = function (ch) {
    var out = [], skills = R.shuffle(ch.practice || []).slice(0, 5);
    skills.forEach(function (sk) { var q = make(sk, sk.quizLevel || 2); out.push(q); });
    R.shuffle(ch.quiz || []).slice(0, 7 - out.length).forEach(function (q) { out.push(q); });
    return R.shuffle(out);
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
    var mix = false, cur = null, q = null, qk = null, tries = 0, done = false, session = { n: 0, first: 0 };
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
      '<p class="qintro">New questions every time. Pick a skill. Three right in a row moves you up a level. Every fourth question reviews a skill from earlier. If a question is tricky, you get a hint, then the steps, then a similar one to try.</p>' +
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
    var home = null;
    function next(focus, easier) {
      var away = false;
      if (mix) {
        cur = pickWeakest();
        /* mixed review: every third question comes from another chapter the student has already practised */
        var other = Atlas.allSkills().filter(function (p) { return p.ch.id !== id && skillState(p.sk.id).n > 0; });
        if (!easier && session.n % 3 === 2 && other.length) { var pk = R.pick(other); cur = pk.sk; away = pk.ch.title; }
      } else {
        if (home && !easier) { cur = home; home = null; }
        var seen = skills.filter(function (sk) { return sk.id !== cur.id && skillState(sk.id).n > 0; });
        if (!easier && session.n % 4 === 3 && seen.length) { home = cur; cur = R.pick(seen); }
      }
      var st = skillState(cur.id);
      var lv = easier ? Math.max(1, st.lv - 1) : st.lv;
      q = make(cur, lv); q.lv = lv; tries = 0; done = false;
      Atlas._q = q; /* exposed for automated checks */
      refreshRow();
      var h = '<div class="pcard"><p class="plv"><span class="pill">' + cur.code + '</span> <b>' + cur.name + '</b> &middot; Level ' + lv + ': ' + LV[lv] + (home ? ' &middot; <i>Review from earlier</i>' : '') + (away ? ' &middot; <i>Review from ' + away + '</i>' : '') + '</p>' +
        '<p class="qtext">' + q.q + '</p>' + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '');
      if (Q(q)) h += '<div class="qkbox"></div>';
      else if (q.type === 'mc') h += '<div class="opts">' + q.options.map(function (o, j) { return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>';
      else h += numForm(q, 'pin-' + id, 'Check');
      h += '<div class="fb"></div><div class="steps"></div><div class="pnext"></div></div>';
      pq.innerHTML = h;
      qk = null;
      if (Q(q)) { qk = Atlas.Q.mount($('.qkbox', pq), q, function (ok, given) { if (!done) answer(ok, given); }); Atlas._qk = qk; }
      else if (q.type === 'mc') Atlas.$$('.opt', pq).forEach(function (b) {
        b.addEventListener('click', function () {
          if (done) return;
          var j = +b.getAttribute('data-j');
          if (j === q.answer) { b.classList.add('yes'); answer(true); }
          else { b.classList.add('no'); b.disabled = true; answer(false, q.options[j]); }
        });
      });
      else $('form', pq).addEventListener('submit', function (e) {
        e.preventDefault();
        if (done) return;
        var raw = $('input', pq).value, v = parseNum(raw);
        if (isNaN(v)) { $('.fb', pq).className = 'fb bad'; $('.fb', pq).textContent = 'Type a number first.'; return; }
        answer(numOk(q, v, raw), raw);
      });
      if (focus) { var f = $('.opt, input', pq); if (f) f.focus(); }
      scoreLine();
    }
    function answer(ok, given) {
      tries++;
      var fb = $('.fb', pq), st = skillState(cur.id), msg = '';
      if (!ok && tries === 1) {
        fb.className = 'fb bad';
        fb.innerHTML = '<b>Not quite.</b> <span>' + (Atlas.Q.diag(q, given) || q.hint || 'Have another go.') + '</span>' + (q.steps && q.steps[0] ? '<p class="t2">Step 1: ' + q.steps[0] + '</p>' : '');
        return;
      }
      done = true; session.n++;
      Atlas.$$('button.opt, input, form .btn, .pad button', pq).forEach(function (b) { b.disabled = true; });
      if (qk) { if (!ok) qk.reveal(); qk.lock(); }
      else if (q.type === 'mc') Atlas.$$('.opt', pq)[q.answer].classList.add('yes');
      st.n++;
      if (ok && tries === 1) {
        session.first++; st.ok++; st.streak++; st.miss = 0;
        if (st.streak >= 3 && st.lv < 3) { st.lv++; st.streak = 0; msg = 'Three in a row. Moving up to level ' + st.lv + '.'; }
        else if (st.streak >= 3 && st.lv === 3 && !st.secure) {
          /* in a full chapter, a skill is secure only after a strong run at the top level on two different days */
          var day = new Date().toDateString();
          st.days = (st.days || []).filter(function (d) { return d !== day; }).concat([day]);
          if (!cur.full || st.days.length >= 2) { st.secure = true; msg = 'This skill is now marked secure. Come back to it now and then to keep it fresh.'; }
          else { st.streak = 0; msg = 'Strong work. Do this again on another day to make it secure.'; }
        }
      } else {
        st.streak = 0;
        if (cur.full && st.secure && !ok) { st.secure = false; st.days = []; msg = 'This one needs more practice, so it is no longer marked secure.'; }
        if (!ok) {
          st.miss++;
          if (st.miss >= 2 && st.lv > 1) { st.lv--; st.miss = 0; msg = 'Let\'s step back to level ' + st.lv + ' and build up again.'; }
        }
      }
      skillSave(cur.id, st);
      fb.className = 'fb ' + (ok ? 'ok' : 'bad');
      fb.innerHTML = '<b>' + (ok ? (tries === 1 ? S.right : S.right2) : 'The answer is ' + shown(q, q.answer) + '.') + '</b> <span>' + (q.explain || '') + '</span>' +
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
        '<section class="sec cu"><h2>How it works</h2><ul>' + S.checkup.steps.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
        '<div class="cuopts">' + S.checkup.whole.map(function (w) { return '<a class="btn' + (w.alt ? ' alt' : '') + '" href="#check-up/' + w.scope + '">' + w.button + '</a>'; }).join(' ') + '</div>' + S.checkup.note +
        '<h3>Check one chapter</h3><p>Doing every chapter\'s check-up checks every Grade ' + S.grade + ' expectation. The map below fills in as you go.</p><div class="cuch">' +
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
       Whole grade: level-1 questions from every chapter (S.checkup.whole). One chapter: one level-1 question for every skill
       (so all chapter check-ups together cover every expectation), then up to 3 level-2 questions on skills answered right. */
    var whole = S.checkup.whole.filter(function (w) { return w.scope === scope; })[0];
    var pool = Atlas.allSkills(), qs = [], label, chapterScope = !whole;
    function add(p, lv) { var q = make(p.sk, lv); q.ch = p.ch; q.sk = p.sk; q.lv = lv; qs.push(q); }
    if (whole) {
      label = whole.label;
      Atlas.meta.forEach(function (m) {
        R.shuffle(pool.filter(function (p) { return p.ch.id === m.id; })).slice(0, whole.per).forEach(function (p) { add(p, 1); });
      });
    } else {
      var m0 = Atlas.meta.filter(function (m) { return m.id === scope; })[0];
      if (!m0 || !Atlas.chapters[scope] || !Atlas.chapters[scope].practice) { location.hash = '#check-up'; return; }
      label = m0.title + ' check-up';
      var mine = pool.filter(function (p) { return p.ch.id === scope; });
      mine.forEach(function (p) { add(p, 1); });
      while (qs.length < 3) add(mine[qs.length % mine.length], 1);
    }
    var res = [], k = 0, stepUps = 0;
    /* after the level-1 round, add level-2 questions for skills answered right */
    function stepUp() {
      if (!chapterScope || stepUps) return;
      stepUps = 1;
      var right = [];
      qs.forEach(function (q, i) { if (res[i].ok && right.indexOf(q.sk) < 0) right.push(q.sk); });
      R.shuffle(right).slice(0, 3).forEach(function (sk) { add(pool.filter(function (p) { return p.sk === sk; })[0], 2); });
    }
    function show() {
      var q = qs[k];
      Atlas._q = q;
      var h = '<div class="wrap chapter" data-strand="' + q.ch.strand + '"><p class="crumb"><a href="#check-up">Check-up</a></p>' +
        '<div class="sec cu"><div class="cuprog"><span>' + label + (q.lv > 1 ? ' &middot; a step harder' : '') + '</span><span>Question ' + (k + 1) + ' of ' + qs.length + (chapterScope && !stepUps ? ' (up to ' + (qs.length + Math.min(3, qs.length)) + ')' : '') + '</span></div>' +
        '<div class="bar-h"><i style="width:' + (k / qs.length * 100) + '%;background:var(--accent)"></i></div>' +
        '<p class="plv"><span class="pill">' + q.ch.title + '</span></p><p class="qtext">' + q.q + '</p>' + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '');
      if (Q(q)) h += '<div class="qkbox"></div>';
      else if (q.type === 'mc') h += '<div class="opts">' + q.options.map(function (o, j) { return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>';
      else h += numForm(q, 'cuin', 'Save answer');
      h += '<p><button type="button" class="btn alt" id="cuskip">I\'m not sure yet</button></p></div></div>';
      app.innerHTML = h;
      function rec(given, ok) { res.push({ given: given, ok: ok }); k++; if (k === qs.length) stepUp(); if (k < qs.length) { show(); var f = $('.opt, input', app); if (f) f.focus(); } else report(); }
      if (Q(q)) Atlas._qk = Atlas.Q.mount($('.qkbox', app), q, function (ok, given) { rec(given, ok); });
      else if (q.type === 'mc') Atlas.$$('.opt', app).forEach(function (b) {
        b.addEventListener('click', function () { var j = +b.getAttribute('data-j'); rec(q.options[j], j === q.answer); });
      });
      else $('form', app).addEventListener('submit', function (e) {
        e.preventDefault();
        var raw = $('#cuin', app).value, v = parseNum(raw);
        if (isNaN(v)) { $('#cuin', app).focus(); return; }
        rec(shown(q, v), numOk(q, v, raw));
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
      /* practice starts where the check-up shows: a miss at level 1 -> level 1, right at level 1 -> level 2, right at level 2 -> level 3 */
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
    return { s: ((ch.html || '').match(/<section/g) || []).length, q: ch.quiz ? ch.quiz.length : 0 };
  }

  /* the grade's home page. S.home: hero (html, or a function that returns it), intro, start, contents, notes,
     legend ('hero' or 'below') and card (function (m, i, stats) -> html) for a grade with its own chapter cards */
  function home(app) {
    var H = S.home, hero = typeof H.hero === 'function' ? H.hero() : H.hero, below = H.legend === 'below';
    var legend = Object.keys(Atlas.strands).map(function (k) {
      return '<span class="pill" data-strand="' + k + '">' + (below ? '' : k + ' &middot; ') + Atlas.strands[k] + '</span>';
    }).join('');
    var h = '<div class="wrap"><div class="hero">' + hero + (below ? '' : '<div class="legend">' + legend + '</div>') + '</div>' + (H.intro || '');
    var plan = load('plan', []), hist = load('checkups', []);
    h += '<div class="start">';
    if (hist.length) {
      var last = hist[hist.length - 1];
      h += '<p><b>Last check-up</b> (' + last.d + '): ' + last.s + ' of ' + last.n + '.</p>' +
        (plan.length ? '<p>Next up:</p><ul>' + plan.map(function (p) { return '<li><a href="#' + p.ch + '/practice/' + p.sk + '">' + p.name + '</a> <span class="t2">(' + p.t + ')</span></li>'; }).join('') + '</ul>' : '') +
        '<p><a href="#check-up">Take another check-up</a></p>';
    } else {
      h += H.start;
    }
    h += '</div>' + (below ? '<div class="legend">' + legend + '</div>' : '') + (H.contents || '') + '<div class="cards">';
    Atlas.meta.forEach(function (m, i) {
      var ch = Atlas.chapters[m.id];
      if (!ch) return;
      var c = counts(ch), best = parseInt(store('best:' + m.id) || '-1', 10), sec = 0, nsk = ch.practice ? ch.practice.length : 0;
      if (ch.practice) ch.practice.forEach(function (sk) { if (skillState(sk.id).secure) sec++; });
      var stats = m.ref ? '<span>one page</span>' : '<span>' + (ch.lessons ? ch.lessons.length + ' lessons, ' + ch.lessons.reduce(function (t, l) { return t + l.concepts.length; }, 0) + ' ideas' : c.s + ' parts') + (best >= 0 ? ' &middot; <span class="done">quiz ' + best + '/' + c.q + '</span>' : '') + (sec ? ' &middot; <span class="done">' + sec + '/' + nsk + ' secure</span>' : '') + '</span>';
      h += H.card ? H.card(m, i, stats) : '<a class="card" data-strand="' + m.strand + '" href="#' + m.id + '">' +
        '<span class="no">' + (m.ref ? 'Ref' : i + 1) + '</span><h2>' + m.title + '</h2><p class="sub">' + m.sub + '</p><p class="desc">' + m.desc + '</p>' +
        '<div class="meta"><span class="pill" data-strand="' + m.strand + '">' + m.strand + ' &middot; ' + Atlas.strands[m.strand] + '</span>' + stats + '</div></a>';
    });
    h += '</div><div class="note">' + H.notes +
      '<p><b>Progress</b> is saved in this browser. With a <a href="../family.html">family account</a>, it is also kept for any device, and parents and tutors can follow along.</p></div></div>';
    app.innerHTML = h;
  }

  function chapter(app, id, sub) {
    var ch = Atlas.chapters[id], idx = 0;
    Atlas.meta.forEach(function (m, i) { if (m.id === id) idx = i; });
    var m = Atlas.meta[idx], prev = null, next = null;
    for (var pi = idx - 1; pi >= 0 && !prev; pi--) if (Atlas.chapters[Atlas.meta[pi].id]) prev = Atlas.meta[pi];
    for (var ni = idx + 1; ni < Atlas.meta.length && !next; ni++) if (Atlas.chapters[Atlas.meta[ni].id]) next = Atlas.meta[ni];
    var h = '<div class="wrap chapter" data-strand="' + m.strand + '"><p class="crumb"><a href="#home">All chapters</a></p>' +
      '<header class="chead"><span class="num">' + (m.ref ? 'Reference' : 'Chapter ' + (idx + 1)) + '</span><h1>' + m.title + '</h1>' +
      '<p class="lede">' + m.sub.charAt(0).toUpperCase() + m.sub.slice(1) + '.</p>' +
      '<span class="pill">' + m.strand + ' &middot; ' + Atlas.strands[m.strand] + '</span>' + (m.codes ? ' <span class="codes">Ontario expectations ' + m.codes + '</span>' : '') + '</header>';
    /* chapters built as lessons show one concept per screen (assets/lesson.js) */
    if (ch.lessons && Atlas.lessons) return Atlas.lessons.chapter(app, id, sub, { head: h.replace(/^<div class="wrap chapter"[^>]*><p class="crumb">.*?<\/p>/, ''), m: m, prev: prev, next: next });
    if (ch.practice || ch.quiz) h += '<nav class="jump" aria-label="In this chapter"><a href="#' + id + '/lesson">Lesson</a>' + (ch.practice ? '<a href="#' + id + '/practice">Practise</a>' : '') + (ch.quiz ? '<a href="#' + id + '/quiz">Chapter quiz</a>' : '') + '<a href="#check-up/' + id + '">Check-up</a></nav>';
    h += '<div id="lesson">' + ch.html + '</div>';
    if (ch.practice) h += '<div class="quiz prac" id="practice"></div>';
    if (ch.quiz) h += '<div class="quiz" id="quiz"></div>';
    h += '<div class="pn">' +
      (prev ? '<a href="#' + prev.id + '"><small>Previous</small>' + prev.title + '</a>' : '<span></span>') +
      (next ? '<a class="nx" href="#' + next.id + '"><small>Next</small>' + next.title + '</a>' : '') + '</div></div>';
    app.innerHTML = h;
    if (ch.init) ch.init(app);
    var parts = (sub || '').split('/');
    if (ch.practice) Atlas.practice($('#practice', app), id, ch.practice, parts[0] === 'practice' ? parts[1] : null);
    if (ch.quiz) Atlas.quiz($('#quiz', app), id, ch.quizFresh ? function () { return Atlas.freshQuiz(ch); } : ch.quiz);
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
    if (S.afterRoute) S.afterRoute(app);
  }

  /* reading supports: theme and larger text, remembered in this browser */
  function prefs() {
    /* light only: all grades share one calm look (Noel, 2026-10-31) */
    var root = document.documentElement, th = 'light', big = store('big') === '1';
    function apply() {
      root.setAttribute('data-theme', th);
      root.classList.toggle('bigtext', big);
      var tb = $('#themeb'), bb = $('#bigb');
      if (tb) tb.textContent = 'Theme: ' + th;
      if (bb) { bb.setAttribute('aria-pressed', String(big)); bb.textContent = big ? 'Text: larger' : 'Text: normal'; }
    }
    var tb = $('#themeb'), bb = $('#bigb'), ab = $('#adultb');
    /* grown-up view: coaching notes (common mistakes) for a parent or tutor. Kept outside the gNatlas: keys so it is never copied to the student's account. */
    function adult(on) {
      try { if (on === undefined) on = localStorage.getItem('atlas:adult') === '1'; else localStorage.setItem('atlas:adult', on ? '1' : '0'); } catch (e) { on = !!on; }
      root.classList.toggle('adult', on);
      if (ab) { ab.setAttribute('aria-pressed', String(on)); ab.textContent = 'Grown-up view: ' + (on ? 'on' : 'off'); }
      return on;
    }
    Atlas.adult = adult;
    if (ab) ab.addEventListener('click', function () { adult(!root.classList.contains('adult')); });
    adult();
    if (tb) tb.addEventListener('click', function () { th = th === 'light' ? 'dark' : 'light'; store('theme', th); apply(); });
    if (bb) bb.addEventListener('click', function () { big = !big; store('big', big ? '1' : '0'); apply(); });
    apply();
  }

  /* keep the groups of a big number together on one line: 48 000 never breaks after 48 (nor 0.333 333, with S.groupDecimals) */
  function glue(node) {
    var w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), t, re = S.groupDecimals ? /(\d) (?=\d)/g : /(\d) (?=\d{3}(?!\d))/g;
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
