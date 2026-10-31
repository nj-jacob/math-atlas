(function () {
  var A = Atlas, R = A.R;
  var SC = ['var(--sb)', 'var(--se)', 'var(--sd)', 'var(--sc)', 'var(--sf)'];
  /* a bar named for a colour (or a fruit) is drawn in that colour */
  var NAMED = { red: '#e03131', blue: '#1c7ed6', green: '#2f9e44', pink: '#e64980', yellow: '#f2b705', apple: '#e03131', banana: '#f2b705', grapes: '#7048e8', orange: '#e8590c', plum: '#862e9c', kiwi: '#74b816', pear: '#a9c934' };
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ---------- sorting shapes ---------- */
  var COL = { red: '#e03131', blue: '#1c7ed6', yellow: '#f2b705' };
  /* one small shape: k circle | triangle | square */
  function icon(it, x, y) {
    var r = it.big ? 17 : 11, f = COL[it.c], st = 'style="fill:' + f + ';stroke:var(--ink)" stroke-width="2"';
    if (it.k === 'circle') return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" ' + st + '/>';
    if (it.k === 'square') return '<rect x="' + (x - r * 0.9) + '" y="' + (y - r * 0.9) + '" width="' + (r * 1.8) + '" height="' + (r * 1.8) + '" ' + st + '/>';
    return '<polygon points="' + x + ',' + (y - r * 1.1) + ' ' + (x + r * 1.1) + ',' + (y + r * 0.85) + ' ' + (x - r * 1.1) + ',' + (y + r * 0.85) + '" ' + st + ' stroke-linejoin="round"/>';
  }
  function itName(it) { return (it.big ? 'big ' : 'small ') + it.c + ' ' + it.k; }
  var RULES = {
    red: { name: 'red', not: 'not red', t: function (i) { return i.c === 'red'; } },
    blue: { name: 'blue', not: 'not blue', t: function (i) { return i.c === 'blue'; } },
    tri: { name: 'triangle', not: 'not a triangle', t: function (i) { return i.k === 'triangle'; } },
    sq: { name: 'square', not: 'not a square', t: function (i) { return i.k === 'square'; } },
    big: { name: 'big', not: 'small', t: function (i) { return i.big; } }
  };
  var SET = [
    { k: 'circle', c: 'red', big: true }, { k: 'triangle', c: 'red', big: false }, { k: 'square', c: 'blue', big: true },
    { k: 'triangle', c: 'blue', big: true }, { k: 'circle', c: 'yellow', big: false }, { k: 'square', c: 'red', big: false },
    { k: 'triangle', c: 'yellow', big: true }, { k: 'square', c: 'yellow', big: false }, { k: 'circle', c: 'blue', big: false },
    { k: 'triangle', c: 'red', big: true }
  ];
  function randSet(n) {
    var all = [];
    ['circle', 'triangle', 'square'].forEach(function (k) { ['red', 'blue', 'yellow'].forEach(function (c) { [true, false].forEach(function (b) { all.push({ k: k, c: c, big: b }); }); }); });
    return R.shuffle(all).slice(0, n);
  }
  /* region of an item: 'a' only, 'b' only, 'ab' both, 'n' neither */
  function region(it, a, b) { var x = RULES[a].t(it), y = RULES[b].t(it); return x && y ? 'ab' : x ? 'a' : y ? 'b' : 'n'; }
  function counts(items, a, b) { var c = { a: 0, b: 0, ab: 0, n: 0 }; items.forEach(function (it) { c[region(it, a, b)]++; }); return c; }
  var SLOTS = {
    a: [[128, 130], [172, 130], [128, 172], [172, 172], [128, 214], [172, 214]],
    ab: [[280, 118], [280, 158], [280, 198], [280, 238]],
    b: [[388, 130], [432, 130], [388, 172], [432, 172], [388, 214], [432, 214]],
    n: [[36, 80], [36, 125], [36, 170], [36, 215], [36, 260], [524, 80], [524, 125], [524, 170], [524, 215], [524, 260], [280, 312], [240, 312], [320, 312]]
  };
  function venn(items, a, b, label) {
    var s = '<rect x="3" y="3" width="554" height="330" rx="16" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>';
    s += '<circle cx="210" cy="172" r="115" style="fill:var(--sb);fill-opacity:.14;stroke:var(--sb)" stroke-width="4"/>';
    s += '<circle cx="350" cy="172" r="115" style="fill:var(--se);fill-opacity:.14;stroke:var(--se)" stroke-width="4"/>';
    s += '<text x="150" y="40" text-anchor="middle" font-size="20" font-weight="800" style="fill:var(--sb)">' + RULES[a].name + '</text>';
    s += '<text x="410" y="40" text-anchor="middle" font-size="20" font-weight="800" style="fill:var(--se)">' + RULES[b].name + '</text>';
    var used = { a: 0, b: 0, ab: 0, n: 0 };
    items.forEach(function (it) { var g = region(it, a, b), p = SLOTS[g][used[g]++]; if (p) s += icon(it, p[0], p[1]); });
    var c = counts(items, a, b);
    return A.svg(560, 336, s, label || 'Venn diagram. Left circle: ' + RULES[a].name + '. Right circle: ' + RULES[b].name + '. Only ' + RULES[a].name + ': ' + c.a + '. Both: ' + c.ab + '. Only ' + RULES[b].name + ': ' + c.b + '. Outside both: ' + c.n + '.');
  }
  function carroll(items, a, b, label) {
    var x0 = 150, y0 = 44, cw = 205, ch = 118, s = '';
    s += '<rect x="' + x0 + '" y="2" width="' + (2 * cw) + '" height="' + (y0 - 2) + '" style="fill:var(--paper)"/><rect x="2" y="' + y0 + '" width="' + (x0 - 2) + '" height="' + (2 * ch) + '" style="fill:var(--paper)"/>';
    s += '<text x="' + (x0 + cw / 2) + '" y="31" text-anchor="middle" font-size="19" font-weight="800">' + RULES[a].name + '</text>';
    s += '<text x="' + (x0 + cw * 1.5) + '" y="31" text-anchor="middle" font-size="19" font-weight="800">' + RULES[a].not + '</text>';
    s += '<text x="' + (x0 / 2) + '" y="' + (y0 + ch / 2 + 6) + '" text-anchor="middle" font-size="19" font-weight="800">' + RULES[b].name + '</text>';
    s += '<text x="' + (x0 / 2) + '" y="' + (y0 + ch * 1.5 + 6) + '" text-anchor="middle" font-size="18" font-weight="800">' + RULES[b].not.replace('not a ', 'not ') + '</text>';
    var cells = [[], [], [], []];
    items.forEach(function (it) { var i = (RULES[a].t(it) ? 0 : 1) + (RULES[b].t(it) ? 0 : 2); cells[i].push(it); });
    cells.forEach(function (L, i) {
      var cx = x0 + (i % 2) * cw, cy = y0 + Math.floor(i / 2) * ch;
      L.forEach(function (it, j) { if (j < 8) s += icon(it, cx + 30 + (j % 4) * 48, cy + 32 + Math.floor(j / 4) * 52); });
    });
    s += '<rect x="2" y="2" width="' + (x0 + 2 * cw - 2) + '" height="' + (y0 + 2 * ch - 2) + '" rx="10" fill="none" style="stroke:var(--ink)" stroke-width="2.5"/>';
    s += '<line x1="' + x0 + '" y1="2" x2="' + x0 + '" y2="' + (y0 + 2 * ch) + '" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="' + (x0 + cw) + '" y1="2" x2="' + (x0 + cw) + '" y2="' + (y0 + 2 * ch) + '" style="stroke:var(--ink)" stroke-width="2"/>';
    s += '<line x1="2" y1="' + y0 + '" x2="' + (x0 + 2 * cw) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="2" y1="' + (y0 + ch) + '" x2="' + (x0 + 2 * cw) + '" y2="' + (y0 + ch) + '" style="stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(x0 + 2 * cw + 2, y0 + 2 * ch + 2, s, label || 'Carroll diagram. Columns: ' + RULES[a].name + ', ' + RULES[a].not + '. Rows: ' + RULES[b].name + ', ' + RULES[b].not + '. Counts: ' + cells.map(function (L) { return L.length; }).join(', ') + '.');
  }
  function shapesRow(items) {
    var s = '';
    items.forEach(function (it, i) { s += icon(it, 26 + (i % 10) * 50, 26 + Math.floor(i / 10) * 50); });
    return A.svg(Math.min(items.length, 10) * 50 + 4, Math.ceil(items.length / 10) * 50 + 4, s, 'Shapes: ' + items.map(itName).join(', '));
  }

  /* ---------- tallies ---------- */
  function tally(n, h, per) {
    h = h || 34; per = per || 4;
    /* groups of 5, at most 4 groups to a row */
    var s = '', groups = Math.ceil(n / 5), rows = Math.max(1, Math.ceil(groups / per)), rh = h + 8;
    for (var g = 0; g < groups; g++) {
      var k = Math.min(5, n - g * 5), x = 6 + (g % per) * 46, y = Math.floor(g / per) * rh;
      for (var i = 0; i < Math.min(k, 4); i++) s += '<line x1="' + (x + i * 8) + '" y1="' + (y + 4) + '" x2="' + (x + i * 8) + '" y2="' + (y + h - 2) + '" style="stroke:var(--ink)" stroke-width="3" stroke-linecap="round"/>';
      if (k === 5) s += '<line x1="' + (x - 5) + '" y1="' + (y + h - 6) + '" x2="' + (x + 29) + '" y2="' + (y + 8) + '" style="stroke:var(--bad)" stroke-width="3" stroke-linecap="round"/>';
    }
    return A.svg(Math.max(30, 6 + Math.min(groups, per) * 46), rows * rh - 6, s, n + ' tally marks');
  }
  /* two-way table: rows and cols are label arrays, m[r][c] counts */
  function twoWay(rows, cols, m, totals, noTot) {
    var h = '<div class="tbl"><table><thead><tr><th scope="col"></th>';
    cols.forEach(function (c) { h += '<th scope="col">' + c + '</th>'; });
    if (totals && !noTot) h += '<th scope="col">Total</th>';
    h += '</tr></thead><tbody>';
    rows.forEach(function (r, i) {
      h += '<tr><th scope="row">' + r + '</th>';
      cols.forEach(function (c, j) { h += '<td>' + tally(m[i][j], 28, 2) + (totals ? ' <b>' + m[i][j] + '</b>' : '') + '</td>'; });
      if (totals && !noTot) h += '<td><b>' + sum(m[i]) + '</b></td>';
      h += '</tr>';
    });
    return h + '</tbody></table></div>';
  }

  /* ---------- graphs ---------- */
  function face(x, y, r, c) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:' + c + '" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/><circle cx="' + (x - r * 0.35) + '" cy="' + (y - r * 0.2) + '" r="' + (r * 0.13) + '" fill="#2a2118"/><circle cx="' + (x + r * 0.35) + '" cy="' + (y - r * 0.2) + '" r="' + (r * 0.13) + '" fill="#2a2118"/><path d="M' + (x - r * 0.4) + ' ' + (y + r * 0.2) + 'q' + (r * 0.4) + ' ' + (r * 0.4) + ' ' + (r * 0.8) + ' 0" fill="none" stroke="#2a2118" stroke-width="1.6" stroke-linecap="round"/>';
  }
  /* g = {title, cats, n, src, unit} */
  function picto(g) {
    var lw = 120, sp = 34, W = Math.max(440, lw + 10 * sp + 12), rh = 44, top = 40, s = '';
    s += '<text x="' + (W / 2) + '" y="26" text-anchor="middle" font-size="20" font-weight="800">' + esc(g.title) + '</text>';
    g.cats.forEach(function (c, i) {
      var y = top + i * rh;
      s += '<rect x="2" y="' + y + '" width="' + (W - 4) + '" height="' + rh + '" style="fill:' + (i % 2 ? 'var(--card)' : 'var(--paper)') + '"/>';
      s += '<text x="10" y="' + (y + 29) + '" font-size="19" font-weight="700">' + esc(c) + '</text>';
      for (var k = 0; k < g.n[i]; k++) s += face(lw + 16 + k * sp, y + rh / 2, 14, 'var(--p0)');
    });
    var yb = top + g.cats.length * rh;
    s += '<line x1="' + lw + '" y1="' + top + '" x2="' + lw + '" y2="' + yb + '" style="stroke:var(--ink)" stroke-width="2"/>';
    s += face(18, yb + 26, 12, 'var(--p0)') + '<text x="38" y="' + (yb + 32) + '" font-size="18">= 1 ' + (g.unit || 'child') + '</text>';
    if (g.src) s += '<text x="' + (W - 4) + '" y="' + (yb + 32) + '" text-anchor="end" font-size="17" style="fill:var(--ink2)">Source: ' + esc(g.src) + '</text>';
    return A.svg(W, yb + 44, s, 'Pictograph: ' + g.title + '. ' + g.cats.map(function (c, i) { return c + ' ' + g.n[i]; }).join(', ') + '.');
  }
  function barG(g) {
    var max = Math.max(5, Math.ceil(Math.max.apply(null, g.n.concat([1])) / 2) * 2), W = 460, L = 58, T = 44, H = 220, B = T + H, s = '';
    var bw = (W - L - 10) / g.cats.length;
    s += '<text x="' + (L + (W - L) / 2) + '" y="26" text-anchor="middle" font-size="20" font-weight="800">' + esc(g.title) + '</text>';
    for (var v = 0; v <= max; v++) {
      var y = B - v * H / max;
      s += '<line x1="' + L + '" y1="' + y.toFixed(1) + '" x2="' + (W - 6) + '" y2="' + y.toFixed(1) + '" style="stroke:var(--line)" stroke-width="' + (v ? 1 : 0) + '"/>';
      if (max <= 10 || v % 2 === 0) s += '<text x="' + (L - 8) + '" y="' + (y + 6).toFixed(1) + '" text-anchor="end" font-size="19">' + v + '</text>';
    }
    g.cats.forEach(function (c, i) {
      var h = g.n[i] * H / max, x = L + i * bw + bw * 0.18;
      s += '<rect x="' + x.toFixed(1) + '" y="' + (B - h).toFixed(1) + '" width="' + (bw * 0.64).toFixed(1) + '" height="' + h.toFixed(1) + '" style="fill:' + (NAMED[c] || SC[i % 5]) + ';stroke:var(--ink)" stroke-width="2"/>';
      s += '<text x="' + (L + (i + 0.5) * bw).toFixed(1) + '" y="' + (B + 26) + '" text-anchor="middle" font-size="19" font-weight="700">' + esc(c) + '</text>';
    });
    s += '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + B + '" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="' + L + '" y1="' + B + '" x2="' + (W - 6) + '" y2="' + B + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    s += '<text transform="translate(18 ' + (T + H / 2) + ') rotate(-90)" text-anchor="middle" font-size="18">Number of ' + (g.unit || 'children') + '</text>';
    if (g.src) s += '<text x="' + L + '" y="' + (B + 52) + '" font-size="18" style="fill:var(--ink2)">Source: ' + esc(g.src) + '</text>';
    return A.svg(W, B + (g.src ? 58 : 34), s, 'Bar graph: ' + g.title + '. ' + g.cats.map(function (c, i) { return c + ' ' + g.n[i]; }).join(', ') + '.');
  }
  /* line plot: values lo..hi, n[v-lo] Xs above each */
  function linePlot(g) {
    var lo = g.lo, hi = g.hi, W = 440, L = 30, step = (W - 2 * L) / (hi - lo), top = 40, mx = Math.max.apply(null, g.n.concat([1])), B = top + mx * 30 + 14, s = '';
    s += '<text x="' + (W / 2) + '" y="26" text-anchor="middle" font-size="20" font-weight="800">' + esc(g.title) + '</text>';
    s += '<line x1="' + (L - 14) + '" y1="' + B + '" x2="' + (W - L + 14) + '" y2="' + B + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var v = lo; v <= hi; v++) {
      var x = L + (v - lo) * step;
      s += '<line x1="' + x + '" y1="' + (B - 7) + '" x2="' + x + '" y2="' + (B + 7) + '" style="stroke:var(--ink)" stroke-width="2.5"/><text x="' + x + '" y="' + (B + 28) + '" text-anchor="middle" font-size="19" font-weight="700">' + v + '</text>';
      for (var k = 0; k < g.n[v - lo]; k++) s += '<text x="' + x + '" y="' + (B - 12 - k * 30) + '" text-anchor="middle" font-size="32" font-weight="800" style="fill:var(--strand)">×</text>';
    }
    s += '<text x="' + (W / 2) + '" y="' + (B + 56) + '" text-anchor="middle" font-size="19">' + esc(g.axis) + '</text>';
    return A.svg(W, B + 62, s, 'Line plot: ' + g.title + '. ' + g.n.map(function (c, i) { return (lo + i) + ': ' + c; }).join(', ') + '.');
  }
  /* mode(s) of category counts: returns indexes, or [] if no mode */
  function modes(n) {
    var m = Math.max.apply(null, n), idx = [];
    n.forEach(function (v, i) { if (v === m) idx.push(i); });
    return idx.length === n.length ? [] : idx;
  }
  function modeWords(cats, n) {
    var m = modes(n);
    return !m.length ? 'no mode' : m.map(function (i) { return cats[i]; }).join(' and ');
  }

  /* ---------- chance ---------- */
  var MCOL = { red: '#e03131', blue: '#1c7ed6', green: '#2f9e44', yellow: '#f2b705' };
  function bag(m, label) {
    /* m = {red: 3, blue: 2} */
    var s = '<path d="M60 40 Q20 60 22 130 Q26 196 120 196 Q214 196 218 130 Q220 60 180 40 Z" style="fill:var(--paper);stroke:var(--ink)" stroke-width="3"/><path d="M60 40 Q120 22 180 40" fill="none" style="stroke:var(--ink)" stroke-width="3"/>', i = 0, list = [];
    Object.keys(m).forEach(function (c) { for (var k = 0; k < m[c]; k++) list.push(c); });
    list.forEach(function (c) { var x = 60 + (i % 5) * 30, y = 80 + Math.floor(i / 5) * 30; s += '<circle cx="' + x + '" cy="' + y + '" r="13" style="fill:' + MCOL[c] + '" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>'; i++; });
    return A.svg(240, 200, s, label || 'A bag with ' + (list.length ? Object.keys(m).filter(function (c) { return m[c]; }).map(function (c) { return m[c] + ' ' + c; }).join(' and ') + ' marbles' : 'no marbles'));
  }
  function chance(m, c) {
    var t = 0; Object.keys(m).forEach(function (k) { t += m[k]; });
    var k = m[c] || 0;
    return !t || !k ? 'impossible' : k === t ? 'certain' : 'possible';
  }

  /* fixed data used in the lesson */
  var FRUIT = { title: 'Our favourite fruit', cats: ['apple', 'banana', 'grapes', 'orange'], n: [5, 7, 4, 2], src: 'survey of Room 12' };
  var PETS = { title: 'Pets at home', lo: 0, hi: 4, n: [6, 4, 3, 1, 1], axis: 'Number of pets' };
  /* data for the worked examples */
  var EX = [{ k: 'square', c: 'blue', big: true }, { k: 'circle', c: 'blue', big: false }, { k: 'triangle', c: 'yellow', big: true }, { k: 'circle', c: 'red', big: false }];
  var PET2 = { title: 'Our favourite pet', cats: ['cat', 'dog', 'fish'], n: [5, 8, 2], src: 'survey of Room 9' };
  var SNACK = { title: 'Favourite snack', cats: ['apple', 'popcorn', 'cheese', 'crackers'], n: [3, 5, 8, 5] };
  var GAME10 = { title: 'Room 10 favourite game', cats: ['soccer', 'tag', 'hockey'], n: [9, 6, 4], src: 'survey of Room 10' };
  var GAME11 = { title: 'Room 11 favourite game', cats: ['soccer', 'tag', 'hockey'], n: [7, 5, 6], src: 'survey of Room 11' };

  /* ---------- lessons: one idea at a time ---------- */
  var K = A.kit, CH = 'data';
  function T(k) { return K.T(CH, k); }
  function P(id, lv) { return K.P(CH, id, lv); }
  /* place each shape in the right part of the Venn diagram */
  var placeLab = K.lab('<div class="fig lpfig"></div><p class="lq"></p><div class="btnrow lpbtn"></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var a = 'blue', b = 'big', items = randSet(6), i = 0, placed = [];
    var LAB = { a: 'Only ' + RULES[a].name, ab: 'Both', b: 'Only ' + RULES[b].name, n: 'Neither (outside)' };
    root.querySelector('.lpbtn').innerHTML = ['a', 'ab', 'b', 'n'].map(function (g) { return '<button type="button" class="btn alt" data-g="' + g + '">' + LAB[g] + '</button>'; }).join('');
    function draw() {
      root.querySelector('.lpfig').innerHTML = venn(placed, a, b);
      root.querySelector('.lq').innerHTML = i < items.length ? 'Where does this go? ' + A.svg(46, 46, icon(items[i], 23, 23), itName(items[i])) + ' <b>' + itName(items[i]) + '</b>' : '<b>All sorted.</b>';
    }
    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-g]'); if (!btn || i >= items.length) return;
      var it = items[i], g = region(it, a, b), out = root.querySelector('.out');
      if (btn.getAttribute('data-g') === g) { placed.push(it); i++; out.innerHTML = '<p><span class="big">Yes.</span> ' + (g === 'ab' ? 'It is blue and big, so it goes in the overlap.' : g === 'n' ? 'It is not blue and not big, so it goes outside both circles.' : 'It fits one rule only.') + '</p>'; draw(); if (i === items.length) done('All 6 sorted. Every shape has exactly one place.'); }
      else out.innerHTML = '<p>Check both rules. Is it blue? ' + (RULES[a].t(it) ? 'Yes' : 'No') + '. Is it big? ' + (RULES[b].t(it) ? 'Yes' : 'No') + '.</p>';
    });
    draw();
  }, 'Sort each shape. Rule 1: <b>blue</b>. Rule 2: <b>big</b>.');
  var sortLab = K.lab('<div class="ctrl"><label for="lvA">Rule 1<select id="lvA"><option value="red">red</option><option value="blue">blue</option><option value="big">big</option></select></label><label for="lvB">Rule 2<select id="lvB"><option value="tri">triangle</option><option value="sq" selected>square</option><option value="big">big</option></select></label><label for="lvK">Show as<select id="lvK"><option value="c" selected>Carroll diagram</option><option value="v">Venn diagram</option></select></label></div><div class="fig lvfig"></div><div class="out" aria-live="polite"></div><button type="button" class="btn alt" id="lvnew">New shapes</button>', function (root, done) {
    var $ = A.$, items = SET.slice();
    function v() {
      var a = $('#lvA', root).value, b = $('#lvB', root).value;
      if (a === b) { b = 'tri'; $('#lvB', root).value = b; }
      var c = counts(items, a, b);
      root.querySelector('.lvfig').innerHTML = $('#lvK', root).value === 'v' ? venn(items, a, b) : carroll(items, a, b);
      root.querySelector('.out').innerHTML = '<p>Only <b>' + RULES[a].name + '</b>: ' + c.a + '. Both: <b>' + c.ab + '</b>. Only <b>' + RULES[b].name + '</b>: ' + c.b + '. Neither: ' + c.n + '.</p><p class="t2">' + (c.a + c.ab + c.b + c.n) + ' shapes in all. Every shape goes in exactly one place.</p>';
      done();
    }
    A.bind(root, ['lvA', 'lvB', 'lvK'], v);
    $('#lvnew', root).addEventListener('click', function () { items = randSet(10); v(); });
  }, 'Change the rules. Switch between the two diagrams. The counts stay the same.');
  var tallyLab = K.lab('<div class="btnrow"><button type="button" class="btn" id="ltadd">Add a mark</button><button type="button" class="btn alt" id="ltclr">Clear</button></div><div class="fig ltfig"></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var n = 0, $ = A.$;
    function draw() {
      root.querySelector('.ltfig').innerHTML = n ? tally(n) : '<p class="t2">No marks yet.</p>';
      var g = Math.floor(n / 5), r = n % 5, say = []; for (var i = 1; i <= g; i++) say.push(5 * i); for (var j = 1; j <= r; j++) say.push(5 * g + j);
      root.querySelector('.out').innerHTML = n ? '<p><span class="big">' + n + '</span> &nbsp;Count: ' + say.join(', ') + '</p>' + (n === 4 ? '<p class="t2">The next mark crosses the four.</p>' : '') : '';
      $('#ltadd', root).disabled = n >= 20;
      if (n === 12) done('12: count 5, 10, then 11, 12.');
    }
    $('#ltadd', root).addEventListener('click', function () { n++; draw(); });
    $('#ltclr', root).addEventListener('click', function () { n = 0; draw(); });
    draw();
  }, 'Add marks one at a time, up to 12. Watch the fifth mark cross the others.');
  var surveyLab = K.lab('<p class="t2">Press a button for each person you ask. Each press adds one tally mark.</p><div class="btnrow"><button type="button" class="btn alt" data-tw="0,0">Walk, Grade 2</button><button type="button" class="btn alt" data-tw="0,1">Walk, Grade 3</button><button type="button" class="btn alt" data-tw="1,0">Ride, Grade 2</button><button type="button" class="btn alt" data-tw="1,1">Ride, Grade 3</button></div><div class="lsfig"></div><div class="out" aria-live="polite"></div><div class="btnrow"><button type="button" class="btn alt" id="lsr">Ask 10 people</button><button type="button" class="btn alt" id="ls0">Clear</button></div>', function (root, done) {
    var tw = [[0, 0], [0, 0]], $ = A.$;
    function t() {
      root.querySelector('.lsfig').innerHTML = twoWay(['Walk', 'Ride'], ['Grade 2', 'Grade 3'], tw, true, true);
      var all = tw[0][0] + tw[0][1] + tw[1][0] + tw[1][1];
      root.querySelector('.out').innerHTML = all ? '<p>You asked <b>' + all + '</b> people. Walk: ' + sum(tw[0]) + '. Ride: ' + sum(tw[1]) + '. Grade 2: ' + (tw[0][0] + tw[1][0]) + '. Grade 3: ' + (tw[0][1] + tw[1][1]) + '.</p>' : '<p>No answers yet.</p>';
      if (all >= 5) done('Each person goes in one box: their row and their column.');
    }
    root.addEventListener('click', function (e) { var b = e.target.closest('[data-tw]'); if (!b) return; var p = b.getAttribute('data-tw').split(','); if (tw[+p[0]][+p[1]] < 20) tw[+p[0]][+p[1]]++; t(); });
    $('#lsr', root).addEventListener('click', function () { for (var i = 0; i < 10; i++) { var r = R.int(0, 1), c = R.int(0, 1); if (tw[r][c] < 20) tw[r][c]++; } t(); });
    $('#ls0', root).addEventListener('click', function () { tw = [[0, 0], [0, 0]]; t(); });
    t();
  }, 'Run a survey: walk or ride, Grade 2 or Grade 3.');
  function graphLab(text, mode) {
    return K.lab('<div class="ctrl lgst"></div><div class="ctrl"><label>Show as<select class="lgk"><option value="b">bar graph</option><option value="p">pictograph</option></select></label></div><div class="fig lgfig"></div><div class="out" aria-live="polite"></div>', function (root, done) {
      var gv = FRUIT.n.slice(), gst = root.querySelector('.lgst');
      gst.innerHTML = FRUIT.cats.map(function (c, i) { return '<div><span class="t2" style="font-size:.9rem;font-weight:600">' + c + '</span><div class="step"><button type="button" class="btn alt" data-gi="' + i + '" data-s="-1" aria-label="One less ' + c + '">&minus;</button><b class="lgv">' + gv[i] + '</b><button type="button" class="btn alt" data-gi="' + i + '" data-s="1" aria-label="One more ' + c + '">+</button></div></div>'; }).join('');
      function g() {
        var d = { title: FRUIT.title, cats: FRUIT.cats, n: gv, src: FRUIT.src }, m = modes(gv);
        root.querySelectorAll('.lgv').forEach(function (b, i) { b.textContent = gv[i]; });
        root.querySelector('.lgfig').innerHTML = root.querySelector('.lgk').value === 'b' ? barG(d) : picto(d);
        root.querySelector('.out').innerHTML = mode ? '<p>Mode: <span class="big">' + modeWords(FRUIT.cats, gv) + '</span></p><p class="t2">' + (!m.length ? 'Every fruit has the same number of votes, so there is no mode.' : m.length > 1 ? 'A tie for the most votes: ' + m.length + ' modes.' : FRUIT.cats[m[0]] + ' has the most votes: ' + gv[m[0]] + '. The mode is the fruit, not the number.') + '</p>' : '<p>Total votes: <b>' + sum(gv) + '</b>. ' + FRUIT.cats.map(function (c, i) { return c + ' ' + gv[i]; }).join(', ') + '.</p>';
      }
      gst.addEventListener('click', function (e) {
        var b = e.target.closest('[data-gi]'); if (!b) return;
        var i = +b.getAttribute('data-gi'); gv[i] = Math.max(0, Math.min(10, gv[i] + +b.getAttribute('data-s'))); g();
        if (!mode || modes(gv).length !== 1 || modes(gv)[0] !== 1) done(mode ? 'You changed the mode. It is always the answer with the most votes.' : undefined);
      });
      root.querySelector('.lgk').addEventListener('change', g);
      g();
    }, text);
  }
  var plotLab = K.lab('<p class="t2">How many pets do 6 more children have? Tap a number for each child.</p><div class="btnrow">' + [0, 1, 2, 3, 4].map(function (v) { return '<button type="button" class="btn alt" data-pv="' + v + '">' + v + '</button>'; }).join('') + '</div><div class="fig lpl"></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var n = [0, 0, 0, 0, 0], k = 0;
    function draw() {
      root.querySelector('.lpl').innerHTML = linePlot({ title: 'Pets at home', lo: 0, hi: 4, n: n, axis: 'Number of pets' });
      root.querySelector('.out').innerHTML = '<p>' + k + ' of 6 children added.</p>';
      if (k >= 6) done('Each X is one child. The tallest stack is the most common answer.');
    }
    root.addEventListener('click', function (e) { var b = e.target.closest('[data-pv]'); if (!b || k >= 6) return; n[+b.getAttribute('data-pv')]++; k++; draw(); });
    draw();
  }, 'Build a line plot one X at a time.');
  var bagLab = K.lab('<div class="ctrl"><label for="lbr">Red marbles: <output id="lbro">3</output><input type="range" id="lbr" min="0" max="6" value="3"></label><label for="lbb">Blue marbles: <output id="lbbo">2</output><input type="range" id="lbb" min="0" max="6" value="2"></label></div><div class="vrow lbfig"></div><div class="out lbout"></div><div class="btnrow"><button type="button" class="btn alt" id="lbpick">Pick 10 times</button></div><div class="out lbres" aria-live="polite"></div>', function (root, done) {
    var $ = A.$, seen = {};
    function bg() {
      var r = +$('#lbr', root).value, b = +$('#lbb', root).value, m = { red: r, blue: b };
      $('#lbro', root).textContent = r; $('#lbbo', root).textContent = b;
      root.querySelector('.lbfig').innerHTML = '<figure>' + bag(m) + '</figure>';
      root.querySelector('.lbout').innerHTML = r + b === 0 ? '<p>The bag is empty. Picking any marble is <b>impossible</b>.</p>' : '<p>Picking red: <span class="big">' + chance(m, 'red') + '</span></p><p>Picking blue: <b>' + chance(m, 'blue') + '</b>. Picking green: <b>impossible</b>.</p>';
      root.querySelector('.lbres').innerHTML = '';
      if (r + b) seen[chance(m, 'red')] = 1;
      if (Object.keys(seen).length >= 3) done('You made red impossible, possible and certain.');
    }
    A.bind(root, ['lbr', 'lbb'], bg);
    $('#lbpick', root).addEventListener('click', function () {
      var r = +$('#lbr', root).value, b = +$('#lbb', root).value, res = root.querySelector('.lbres');
      if (!r && !b) { res.innerHTML = '<p>Add some marbles first.</p>'; return; }
      var got = [], nr = 0;
      for (var i = 0; i < 10; i++) { var red = R.int(1, r + b) <= r; if (red) nr++; got.push(red ? 'R' : 'B'); }
      res.innerHTML = '<p>You picked (and put back): ' + got.join(' ') + '</p><p>Red <b>' + nr + '</b> times, blue <b>' + (10 - nr) + '</b> times.</p>';
    });
  }, 'Change the marbles. Make picking red impossible, then possible, then certain.');

  var LESSONS = [
    { id: 'sort', title: 'Sorting by two rules', sub: 'Venn and Carroll diagrams.', concepts: [
      { id: 'venn', title: 'Venn diagrams', exp: ['D1.1'], skill: 'd2-sort', hard: true,
        body: '<p>A <b>Venn diagram</b> sorts with two rules using two circles. Things that fit <b>both</b> rules go where the circles <b>overlap</b>. Things that fit neither go <b>outside</b>.</p>',
        watch: K.clip([
          ['Rules: <b>red</b> and <b>triangle</b>.', venn([], 'red', 'tri')],
          ['A big red circle: red, not a triangle. Red circle only.', venn(SET.slice(0, 1), 'red', 'tri')],
          ['A small red triangle fits both. It goes in the <b>overlap</b>.', venn(SET.slice(0, 2), 'red', 'tri')],
          ['A big blue square fits neither. It goes <b>outside</b>.', venn(SET.slice(0, 3), 'red', 'tri')],
          ['Every shape has one place.', venn(SET, 'red', 'tri'), 2000]
        ]),
        example: K.clip([
          ['My turn. The rules are <b>blue</b> and <b>big</b>. I ask two questions about each shape.', venn([], 'blue', 'big')],
          ['A big blue square. Blue? Yes. Big? Yes. It fits both, so it goes in the <b>overlap</b>.', venn(EX.slice(0, 1), 'blue', 'big')],
          ['A small blue circle. Blue? Yes. Big? No. It goes in the blue circle only.', venn(EX.slice(0, 2), 'blue', 'big')],
          ['A big yellow triangle. Blue? No. Big? Yes. It goes in the big circle only.', venn(EX.slice(0, 3), 'blue', 'big')],
          ['A small red circle. No and no. It goes <b>outside</b> both circles.', venn(EX, 'blue', 'big'), 2200]
        ]),
        try: placeLab,
        ways: [
          { label: 'Two questions', html: '<p>Ask two yes-or-no questions about each thing. Is it red? Is it a triangle?</p><div class="tbl"><table><thead><tr><th>Red?</th><th>Triangle?</th><th>Goes in</th></tr></thead><tbody><tr><td>yes</td><td>yes</td><td>the overlap</td></tr><tr><td>yes</td><td>no</td><td>red only</td></tr><tr><td>no</td><td>yes</td><td>triangle only</td></tr><tr><td>no</td><td>no</td><td>outside</td></tr></tbody></table></div>' },
          { label: 'Hoops on the floor', html: '<p>Lay two hula hoops on the floor so they overlap. Sort real toys into them. Things that fit both rules sit in the overlap.</p>' }
        ],
        key: '<p>Both rules: the overlap. Neither rule: outside.</p>',
        mistake: '<p>Putting a thing that fits both rules in only one circle.</p>',
        check: [T('venn'), P('d2-sort', 1)] },
      { id: 'carroll', title: 'Carroll diagrams', exp: ['D1.1'], skill: 'd2-sort',
        body: '<p>A <b>Carroll diagram</b> sorts with two rules in a table of 4 boxes. Each thing goes in the box where its row and its column both fit.</p>',
        watch: K.clip([
          ['Columns: red, not red. Rows: triangle, not triangle.', carroll([], 'red', 'tri')],
          ['A red triangle: red column, triangle row.', carroll([SET[1]], 'red', 'tri')],
          ['A blue square: not red, not triangle.', carroll([SET[1], SET[2]], 'red', 'tri')],
          ['All sorted. Same shapes as the Venn diagram.', carroll(SET, 'red', 'tri'), 2000]
        ]),
        example: K.clip([
          ['My turn. The columns are blue and not blue. The rows are square and not square.', carroll([], 'blue', 'sq')],
          ['A big blue square: the blue column and the square row. It goes where they meet.', carroll(EX.slice(0, 1), 'blue', 'sq')],
          ['A big yellow triangle: not blue, not square. Bottom right.', carroll([EX[0], EX[2]], 'blue', 'sq')],
          ['I sort the rest the same way. Every shape has one box.', carroll(EX, 'blue', 'sq'), 2000]
        ]),
        try: sortLab,
        key: '<p>Find the column. Find the row. It goes where they meet.</p>',
        check: [T('carroll'), P('d2-sort', 2), P('d2-sort', 3)] }
    ] },
    { id: 'tally', title: 'Tally tables', sub: 'Count by fives.', concepts: [
      { id: 'marks', title: 'Tally marks', exp: ['D1.2'], skill: 'd2-tally',
        body: '<p>A <b>tally mark</b> is one line for each answer. The fifth mark crosses the other four, so you can count by 5s.</p>',
        watch: K.clip([
          ['1, 2, 3, 4 marks.', '<div class="fig">' + tally(4) + '</div>'],
          ['The 5th mark crosses them. That is a group of 5.', '<div class="fig">' + tally(5) + '</div>'],
          ['More marks: 5, 10, then 11, 12.', '<div class="fig">' + tally(12) + '</div>', 2000]
        ]),
        example: K.clip([
          ['My turn. I will make tally marks for 8. I draw 1, 2, 3, 4 marks.', '<div class="fig">' + tally(4) + '</div>'],
          ['The 5th mark goes across the first 4. That makes a group of 5.', '<div class="fig">' + tally(5) + '</div>'],
          ['Then I draw 3 more: 6, 7, 8.', '<div class="fig">' + tally(8) + '</div>'],
          ['I check: count the group by 5, then count on: 5, 6, 7, 8. <b>8</b>.', '<div class="fig">' + tally(8) + '</div>', 2000]
        ]),
        try: tallyLab,
        key: '<p>Count the groups by 5s. Then count on the single marks by 1s.</p>',
        mistake: '<p>Counting the crossing mark as a separate group, or drawing 5 marks and then crossing them (6).</p>',
        check: [T('tally'), P('d2-tally', 1)] },
      { id: 'twoway', title: 'Tables with two questions', exp: ['D1.2'], skill: 'd2-tally', hard: true,
        body: '<p>A <b>two-way table</b> keeps two pieces of information about each person. Find the right row and the right column. Read where they meet.</p>' + twoWay(['Walk', 'Ride'], ['Grade 2', 'Grade 3'], [[7, 4], [3, 6]], true),
        watch: K.clip([
          ['How many Grade 2 students walk?', '<p class="math big">Walk row &rarr; Grade 2 column</p>'],
          ['Where they meet: 5, then 6, 7. <b>7</b>.', '<div class="fig">' + tally(7) + '</div>'],
          ['How many walk in all? Add the Walk row: 7 + 4 = <b>11</b>.', '<p class="math big">7 + 4 = 11</p>', 2000]
        ]),
        example: K.clip([
          ['My turn. How many Grade 3 students take the bus? I find the Bus row and the Grade 3 column.', twoWay(['Walk', 'Bus'], ['Grade 2', 'Grade 3'], [[6, 3], [2, 8]])],
          ['Where they meet, I count: 5, then 6, 7, 8. <b>8</b> students.', twoWay(['Walk', 'Bus'], ['Grade 2', 'Grade 3'], [[6, 3], [2, 8]])],
          ['How many take the bus in all? I add the Bus row: 2 + 8 = <b>10</b>.', '<p class="math big">2 + 8 = 10</p>', 2000]
        ]),
        try: surveyLab,
        ways: [
          { label: 'Finger and finger', html: '<p>Put one finger on the row name and slide it across. Put another finger on the column name and slide it down. Read the box where your fingers meet.</p>' }
        ],
        key: '<p>Row, then column. Read where they meet. Add a row for its total.</p>',
        mistake: '<p>Reading the wrong row or column. Have your child say the row and column names out loud first.</p>',
        check: [P('d2-tally', 2), P('d2-tally', 3)] }
    ] },
    { id: 'graphs', title: 'Graphs', sub: 'Pictographs, bar graphs and line plots.', concepts: [
      { id: 'bars', title: 'Pictographs and bar graphs', exp: ['D1.3', 'D1.5'], skill: 'd2-graph',
        body: '<p>A graph shows data as a picture. A good graph has a <b>title</b>, <b>labels</b> and a <b>source</b>. In a <b>pictograph</b> each picture is one thing. In a <b>bar graph</b> the height of each bar shows how many.</p>',
        watch: K.clip([
          ['A pictograph. Each face is 1 child.', picto(FRUIT)],
          ['The same data as a bar graph.', barG(FRUIT)],
          ['Banana stops at 7. Grapes stops at 4.', barG(FRUIT)],
          ['7 &minus; 4 = 3. <b>3 more</b> children like bananas.', '<p class="math big">7 &minus; 4 = 3</p>', 2000]
        ]),
        example: K.clip([
          ['My turn. A class chose a favourite pet. I read the title first. Each face is 1 child.', picto(PET2)],
          ['Here is the same data as a bar graph.', barG(PET2)],
          ['How many more chose dog than cat? Dog stops at 8. Cat stops at 5.', barG(PET2)],
          ['8 &minus; 5 = 3. <b>3 more</b> children chose dog.', '<p class="math big">8 &minus; 5 = 3</p>', 2000]
        ]),
        try: graphLab('Change the votes. Watch the graph change.', false),
        key: '<p>Read the title and labels first. Then read the bars.</p>',
        mistake: '<p>Reading the top of a bar between two lines. Have your child slide a finger straight across to the numbers.</p>',
        check: [T('graph'), P('d2-graph', 1), P('d2-graph', 2)] },
      { id: 'plot', title: 'Line plots', exp: ['D1.3'], skill: 'd2-graph',
        body: '<p>A <b>line plot</b> puts an X above a number line for each answer. It works well when the answers are numbers.</p>',
        watch: K.clip([
          ['How many pets do you have? A number line from 0 to 4.', linePlot({ title: 'Pets at home', lo: 0, hi: 4, n: [0, 0, 0, 0, 0], axis: 'Number of pets' })],
          ['Each answer gets an X.', linePlot({ title: 'Pets at home', lo: 0, hi: 4, n: [2, 1, 1, 0, 0], axis: 'Number of pets' })],
          ['15 children. 6 have no pets.', linePlot(PETS), 2000]
        ]),
        example: K.clip([
          ['My turn. I asked 7 friends how many letters are in their name. I draw a line from 3 to 6.', linePlot({ title: 'Letters in our names', lo: 3, hi: 6, n: [0, 0, 0, 0], axis: 'Number of letters' })],
          ['Each answer gets one X above its number. Ali has 3 letters. Maya and Liam have 4.', linePlot({ title: 'Letters in our names', lo: 3, hi: 6, n: [1, 2, 0, 0], axis: 'Number of letters' })],
          ['I put an X for every friend. 7 answers, 7 Xs.', linePlot({ title: 'Letters in our names', lo: 3, hi: 6, n: [1, 3, 2, 1], axis: 'Number of letters' })],
          ['The tallest stack is at 4. Most of my friends have <b>4 letters</b> in their name.', linePlot({ title: 'Letters in our names', lo: 3, hi: 6, n: [1, 3, 2, 1], axis: 'Number of letters' }), 2200]
        ]),
        try: plotLab,
        key: '<p>One X for each answer, above its number.</p>',
        check: [T('plot'), P('d2-graph', 3)] }
    ] },
    { id: 'mode', title: 'The mode', sub: 'The most common answer.', concepts: [
      { id: 'mode', title: 'Find the mode', exp: ['D1.4'], skill: 'd2-mode', hard: true,
        body: '<p>The <b>mode</b> is the answer that shows up <b>most often</b>. On a bar graph it is the tallest bar. On a line plot it is the tallest stack.</p>' + K.vs('The mode is the answer: <b>banana</b>.', 'The mode is the number of votes: 7.'),
        watch: K.clip([
          ['Which bar is tallest?', barG(FRUIT)],
          ['Banana, with 7. The mode is <b>banana</b>.', barG(FRUIT)],
          ['Two tallest bars? Two modes: summer and winter.', barG({ title: 'Favourite season', cats: ['spring', 'summer', 'fall', 'winter'], n: [3, 6, 2, 6] })],
          ['All the same? <b>No mode</b>.', barG({ title: 'Favourite colour', cats: ['red', 'blue', 'green'], n: [4, 4, 4] }), 2200]
        ]),
        example: K.clip([
          ['My turn. What is the mode? I look for the tallest bar.', barG(SNACK)],
          ['Cheese is the tallest, with 8. No other bar is as tall.', barG(SNACK)],
          ['The mode is <b>cheese</b>. It is the answer chosen most often.', barG(SNACK), 2000]
        ]),
        try: graphLab('Change the votes to make a new mode, a tie, or no mode.', true),
        ways: [
          { label: 'Line plot stacks', html: '<p>On a line plot, the mode is the number under the tallest stack of Xs.</p><div class="fig">' + linePlot(PETS) + '</div><p>The tallest stack is over 0. The mode is <b>0 pets</b>.</p>' },
          { label: 'Line them up', html: '<p>With a list of answers, put the same answers together in groups. The biggest group is the mode.</p><p class="math">3, 5, 3, 4, 3 &rarr; 3 3 3 | 4 | 5 &rarr; mode 3</p>' }
        ],
        key: '<p>Most often. Say the answer, not the count.</p>',
        mistake: '<p>Saying the mode is the number of votes, like "7", instead of the answer, like "banana".</p>',
        check: [T('mode'), P('d2-mode', 1), P('d2-mode', 2)] },
      { id: 'predict', title: 'Will another group match?', exp: ['D1.4'], skill: 'd2-mode',
        body: '<p>Room 12 likes bananas most. Will Room 14? Make a prediction, collect the data, then check. Different groups can give different results.</p>',
        watch: K.clip([
          ['Room 12: the mode is banana.', barG(FRUIT)],
          ['Prediction: Room 14 will pick banana too.', '<p class="math big">Room 14: banana?</p>'],
          ['Room 14 votes. Their mode is <b>apple</b>. The prediction was wrong, and that is fine.', barG({ title: 'Room 14 favourite fruit', cats: FRUIT.cats, n: [8, 6, 3, 3], src: 'survey of Room 14' }), 2400]
        ]),
        example: K.clip([
          ['My turn. Room 10 voted for a favourite game. Their mode is soccer.', barG(GAME10)],
          ['I predict Room 11 will pick soccer too. It is only a guess until they vote.', '<p class="g2-big">Room 11: soccer?</p>'],
          ['Room 11 votes. Their mode is soccer too. This time my prediction matched. I could only know by asking.', barG(GAME11), 2400]
        ]),
        key: '<p>Predict, collect, check. Data from a new group can be different.</p>',
        check: [P('d2-mode', 3), T('mode')] }
    ] },
    { id: 'chance', title: 'Impossible, possible, certain', sub: 'How likely is it?', concepts: [
      { id: 'words', title: 'Chance words', exp: ['D2.1', 'D2.2'], skill: 'd2-chance',
        body: '<p><b>Certain</b>: it will happen for sure. <b>Impossible</b>: it cannot happen. <b>Possible</b>: it might happen or might not.</p>',
        watch: K.clip([
          ['Only red marbles. Picking red is <b>certain</b>.', bag({ red: 5 }, 'A bag with 5 red marbles')],
          ['Red and blue. Picking red is <b>possible</b>.', bag({ red: 3, blue: 2 })],
          ['Only blue. Picking red is <b>impossible</b>.', bag({ blue: 5 }, 'A bag with 5 blue marbles')],
          ['So picking <b>not red</b> is <b>certain</b>.', bag({ blue: 5 }, 'A bag with 5 blue marbles'), 2000]
        ]),
        example: K.clip([
          ['My turn. This bag has only green marbles. Picking green is <b>certain</b>. It must happen.', bag({ green: 4 }, 'A bag with 4 green marbles')],
          ['This bag has green and yellow. Picking green is <b>possible</b>. It might happen.', bag({ green: 2, yellow: 3 })],
          ['This bag has only yellow. Picking green is <b>impossible</b>. It cannot happen.', bag({ yellow: 5 }, 'A bag with 5 yellow marbles'), 2200]
        ]),
        try: bagLab,
        ways: [
          { label: 'Everyday events', html: '<p><b>Certain</b>: the sun will rise tomorrow. <b>Possible</b>: it will rain this week. <b>Impossible</b>: a dog will fly to the moon.</p>' },
          { label: 'Opposites', html: '<p>If something is impossible, its opposite is certain. No red marbles: picking red is impossible, so picking not-red is certain.</p>' }
        ],
        key: '<p>Are there any? Are there only those? Then decide.</p>',
        mistake: '<p>Calling something "impossible" because it is unlikely. If there is even one red marble, red is possible.</p>',
        check: [T('chance'), P('d2-chance', 1), P('d2-chance', 3)] }
    ] }
  ];
  A.register('data', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Sorting by two rules</h2>' +
'<p>We can <b>sort</b> things using two rules at once. A <b>Venn diagram</b> uses two circles. A <b>Carroll diagram</b> uses a table with 4 boxes.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>The rules are <b>red</b> and <b>triangle</b>. A red triangle fits both rules, so it goes where the circles <b>overlap</b>. A red circle is red but not a triangle, so it goes in the red circle only. A blue square fits neither rule, so it goes <b>outside</b> both circles.</p><div class="fig">' + venn(SET, 'red', 'tri') + '</div></div>' +
'<div class="yt" data-yt="venn"></div>' +
'<p>Here are the same shapes in a Carroll diagram. Each shape goes in the box where its row and its column both fit.</p>' +
'<div class="fig">' + carroll(SET, 'red', 'tri') + '</div>' +
'<div class="yt" data-yt="carroll"></div>' +
'<div class="lab"><span class="lt">Try it: sort the shapes</span>' +
'<div class="ctrl"><label for="vA">Rule 1<select id="vA"><option value="red">red</option><option value="blue">blue</option><option value="big">big</option></select></label><label for="vB">Rule 2<select id="vB"><option value="tri">triangle</option><option value="sq" selected>square</option><option value="big">big</option></select></label><label for="vK">Show as<select id="vK"><option value="v">Venn diagram</option><option value="c">Carroll diagram</option></select></label></div>' +
'<div class="fig" id="vfig"></div><div class="out" id="vout"></div><button type="button" class="btn alt" id="vnew">New shapes</button></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Putting a shape that fits <b>both</b> rules in only one circle. If it fits both, it goes in the middle where the circles overlap.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Tally tables with two questions</h2>' +
'<p>A <b>tally mark</b> is one line for each answer. Every fifth mark crosses the other four, so we can count by 5s.</p>' +
'<div class="vrow"><figure>' + tally(3) + '<figcaption>3</figcaption></figure><figure>' + tally(5) + '<figcaption>5</figcaption></figure><figure>' + tally(12) + '<figcaption>12: count 5, 10, then 11, 12</figcaption></figure></div>' +
'<p>A <b>two-way tally table</b> keeps track of two pieces of information about each person. Here we asked: Do you walk or ride to school? Are you in Grade 2 or Grade 3?</p>' +
twoWay(['Walk', 'Ride'], ['Grade 2', 'Grade 3'], [[7, 4], [3, 6]], true) +
'<div class="eg"><b class="t">Watch me</b><p>How many Grade 2 students walk? I find the <b>Walk</b> row and the <b>Grade 2</b> column. Where they meet I count 5, then 6, 7. So <b>7</b> Grade 2 students walk. How many walk in all? I add along the Walk row: 7 + 4 = <b>11</b>.</p></div>' +
'<div class="yt" data-yt="tally"></div>' +
'<div class="lab"><span class="lt">Try it: run a survey</span>' +
'<p class="t2">Press a button for each person you ask. Each press adds one tally mark, up to 20 in a box.</p>' +
'<div class="ctrl"><button type="button" class="btn alt" data-tw="0,0">Walk, Grade 2</button><button type="button" class="btn alt" data-tw="0,1">Walk, Grade 3</button><button type="button" class="btn alt" data-tw="1,0">Ride, Grade 2</button><button type="button" class="btn alt" data-tw="1,1">Ride, Grade 3</button></div>' +
'<div id="twfig"></div><div class="out" id="twout"></div><div class="ctrl"><button type="button" class="btn alt" id="twr">Ask 10 people</button><button type="button" class="btn alt" id="tw0">Clear</button></div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Graphs</h2>' +
'<p>A graph shows data as a picture. A good graph has a <b>title</b>, <b>labels</b> and a <b>source</b> that tells where the data came from. In a <b>pictograph</b> each picture stands for one thing. In a <b>bar graph</b> the height of each bar shows how many.</p>' +
'<div class="fig">' + picto(FRUIT) + '</div>' +
'<div class="fig">' + barG(FRUIT) + '</div>' +
'<div class="eg"><b class="t">Watch me</b><p>How many more children like bananas than grapes? I read the banana bar: it stops at 7. The grapes bar stops at 4. 7 &minus; 4 = 3. So <b>3 more</b> children like bananas.</p></div>' +
'<div class="yt" data-yt="graph"></div>' +
'<p>A <b>line plot</b> puts an X above a number line for each answer. It works well for answers that are numbers.</p>' +
'<div class="fig">' + linePlot(PETS) + '</div>' +
'<div class="yt" data-yt="plot"></div>' +
'<div class="lab"><span class="lt">Try it: make a graph</span>' +
'<p class="t2">Change the number of votes. Watch the graph change.</p>' +
'<div class="ctrl" id="gst"></div>' +
'<div class="ctrl"><label for="gk">Show as<select id="gk"><option value="b">bar graph</option><option value="p">pictograph</option></select></label></div>' +
'<div class="fig" id="gfig"></div><div class="out" id="gout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Every graph needs a title and labels. Without them, nobody knows what the numbers mean.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>The mode</h2>' +
'<p>The <b>mode</b> is the answer that shows up <b>most often</b>. On a bar graph it is the tallest bar. On a line plot it is the tallest stack of Xs.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>In the fruit graph, the tallest bar is banana with 7 votes. So the mode is <b>banana</b>. That tells us banana is the most popular fruit in Room 12. In the pets line plot, the tallest stack is above 0. The mode is <b>0 pets</b>.</p></div>' +
'<div class="vrow"><figure>' + barG({ title: 'Favourite season', cats: ['spring', 'summer', 'fall', 'winter'], n: [3, 6, 2, 6] }) + '<figcaption>Two tallest bars: two modes, summer and winter</figcaption></figure><figure>' + barG({ title: 'Favourite colour', cats: ['red', 'blue', 'green'], n: [4, 4, 4] }) + '<figcaption>All bars the same: no mode</figcaption></figure></div>' +
'<div class="yt" data-yt="mode"></div>' +
'<p><b>Will another class have the same mode?</b> Maybe, maybe not. Room 12 likes bananas most. Room 14 might like apples most. To find out, make a prediction, then collect the data and check.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>I predict Room 14 will also pick banana, because it was the mode in Room 12. Then I ask Room 14. Their votes: apple 8, banana 6, grapes 3, orange 3. Their mode is <b>apple</b>. My prediction was wrong, and that is fine. Different groups can give different results.</p></div>' +
'<div class="vs"><div><b class="t">This</b><p>The mode is the <b>answer</b> with the most votes: <b>banana</b>.</p></div><div><b class="t">Not that</b><p>The mode is not the number of votes: <b>7</b>.</p></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Saying the mode is the <b>number</b> of votes, like "7". The mode is the <b>answer</b> that got the most votes, like "banana".</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Impossible, possible, certain</h2>' +
'<p>Some things are <b>certain</b>: they will happen for sure. Some are <b>impossible</b>: they cannot happen. Many things are <b>possible</b>: they might happen or might not.</p>' +
'<div class="vrow"><figure>' + bag({ red: 5 }, 'A bag with 5 red marbles') + '<figcaption>Picking red is <b>certain</b></figcaption></figure><figure>' + bag({ red: 3, blue: 2 }) + '<figcaption>Picking red is <b>possible</b></figcaption></figure><figure>' + bag({ blue: 5 }, 'A bag with 5 blue marbles') + '<figcaption>Picking red is <b>impossible</b></figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><p>A bag has only blue marbles. Picking red is <b>impossible</b>. So picking <b>not red</b> is <b>certain</b>. When one thing is impossible, its opposite is certain.</p></div>' +
'<div class="yt" data-yt="chance"></div>' +
'<div class="lab"><span class="lt">Try it: fill the bag</span>' +
'<div class="ctrl"><label for="br">Red marbles: <output id="bro">3</output><input type="range" id="br" min="0" max="6" value="3"></label><label for="bb">Blue marbles: <output id="bbo">2</output><input type="range" id="bb" min="0" max="6" value="2"></label></div>' +
'<div class="vrow"><figure id="bfig"></figure></div><div class="out" id="bout"></div>' +
'<div class="ctrl"><button type="button" class="btn alt" id="bpick">Pick 10 times</button></div><div class="out" id="bres" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Use these words to make good choices. If rain is possible, bring a raincoat just in case.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$, items = SET.slice();
      function v() {
        var a = $('#vA', root).value, b = $('#vB', root).value, k = $('#vK', root).value;
        if (a === b) { b = 'tri'; $('#vB', root).value = b; }
        var c = counts(items, a, b);
        $('#vfig', root).innerHTML = k === 'v' ? venn(items, a, b) : carroll(items, a, b);
        $('#vout', root).innerHTML = '<p>Only <b>' + RULES[a].name + '</b>: ' + c.a + '. Both: <b>' + c.ab + '</b>. Only <b>' + RULES[b].name + '</b>: ' + c.b + '. Neither: ' + c.n + '.</p><p class="t2">' + (c.a + c.ab + c.b + c.n) + ' shapes in all. Every shape goes in exactly one place.</p>';
      }
      A.bind(root, ['vA', 'vB', 'vK'], v);
      $('#vnew', root).addEventListener('click', function () { items = randSet(10); v(); });

      var tw = [[0, 0], [0, 0]];
      function t() {
        $('#twfig', root).innerHTML = twoWay(['Walk', 'Ride'], ['Grade 2', 'Grade 3'], tw, true, true);
        var all = tw[0][0] + tw[0][1] + tw[1][0] + tw[1][1];
        $('#twout', root).innerHTML = all ? '<p>You asked <b>' + all + '</b> people. Walk: ' + sum(tw[0]) + '. Ride: ' + sum(tw[1]) + '. Grade 2: ' + (tw[0][0] + tw[1][0]) + '. Grade 3: ' + (tw[0][1] + tw[1][1]) + '.</p>' : '<p>No answers yet. Press a button above.</p>';
      }
      root.querySelectorAll('[data-tw]').forEach(function (b) {
        b.addEventListener('click', function () { var p = b.getAttribute('data-tw').split(','); if (tw[+p[0]][+p[1]] < 20) tw[+p[0]][+p[1]]++; t(); });
      });
      $('#twr', root).addEventListener('click', function () { for (var i = 0; i < 10; i++) { var r = R.int(0, 1), c = R.int(0, 1); if (tw[r][c] < 20) tw[r][c]++; } t(); });
      $('#tw0', root).addEventListener('click', function () { tw = [[0, 0], [0, 0]]; t(); });
      t();

      var gv = FRUIT.n.slice(), gst = $('#gst', root);
      gst.innerHTML = FRUIT.cats.map(function (c, i) {
        return '<div><span class="t2" style="font-size:.9rem;font-weight:600">' + c + '</span><div class="step"><button type="button" class="btn alt" data-gi="' + i + '" data-s="-1" aria-label="One less ' + c + '">&minus;</button><b id="gv' + i + '">' + gv[i] + '</b><button type="button" class="btn alt" data-gi="' + i + '" data-s="1" aria-label="One more ' + c + '">+</button></div></div>';
      }).join('');
      function g() {
        var d = { title: FRUIT.title, cats: FRUIT.cats, n: gv, src: FRUIT.src };
        gv.forEach(function (x, i) { $('#gv' + i, root).textContent = x; });
        $('#gfig', root).innerHTML = $('#gk', root).value === 'b' ? barG(d) : picto(d);
        var m = modes(gv);
        $('#gout', root).innerHTML = '<p>Total votes: <b>' + sum(gv) + '</b>. Mode: <span class="big">' + modeWords(FRUIT.cats, gv) + '</span></p><p class="t2">' +
          (!m.length ? 'Every fruit has the same number of votes, so no answer shows up most often.' : m.length > 1 ? 'There is a tie for the most votes, so there are ' + m.length + ' modes.' : FRUIT.cats[m[0]] + ' has the most votes: ' + gv[m[0]] + '.') + '</p>';
      }
      gst.addEventListener('click', function (e) {
        var b = e.target.closest('[data-gi]'); if (!b) return;
        var i = +b.getAttribute('data-gi'); gv[i] = Math.max(0, Math.min(10, gv[i] + +b.getAttribute('data-s'))); g();
      });
      A.bind(root, ['gk'], g);

      function bg() {
        var r = +$('#br', root).value, b = +$('#bb', root).value, m = { red: r, blue: b };
        $('#bro', root).textContent = r; $('#bbo', root).textContent = b;
        $('#bfig', root).innerHTML = bag(m);
        $('#bout', root).innerHTML = r + b === 0 ? '<p>The bag is empty. Picking any marble is <b>impossible</b>.</p>' :
          '<p>Picking red: <span class="big">' + chance(m, 'red') + '</span></p><p>Picking blue: <b>' + chance(m, 'blue') + '</b>. Picking green: <b>impossible</b>.</p>';
        $('#bres', root).innerHTML = '';
      }
      A.bind(root, ['br', 'bb'], bg);
      $('#bpick', root).addEventListener('click', function () {
        var r = +$('#br', root).value, b = +$('#bb', root).value;
        if (!r && !b) { $('#bres', root).innerHTML = '<p>Add some marbles first.</p>'; return; }
        var got = [], nr = 0;
        for (var i = 0; i < 10; i++) { var red = R.int(1, r + b) <= r; if (red) nr++; got.push(red ? 'R' : 'B'); }
        $('#bres', root).innerHTML = '<p>You picked (and put back): ' + got.join(' ') + '</p><p>Red <b>' + nr + '</b> times, blue <b>' + (10 - nr) + '</b> times.</p><p class="t2">' + (r && b ? 'Try again. The results change, because each pick could be either colour.' : 'Every pick is the same colour, because only one colour is in the bag.') + '</p>';
      });
    },

    turns: {
      venn: function () {
        var it = R.pick(SET), g = region(it, 'red', 'tri'), names = { a: 'in the red circle only', b: 'in the triangle circle only', ab: 'in the middle, in both circles', n: 'outside both circles' };
        var o = R.mc(names[g], Object.keys(names).filter(function (k) { return k !== g; }).map(function (k) { return names[k]; }));
        return { q: 'The rules are <b>red</b> and <b>triangle</b>. Where does a <b>' + itName(it) + '</b> go?', type: 'mc', options: o.options, answer: o.answer, fig: A.svg(60, 50, icon(it, 30, 26), 'a ' + itName(it)), hint: 'Ask two questions: Is it red? Is it a triangle?', steps: ['Is it red? ' + (it.c === 'red' ? 'Yes.' : 'No.'), 'Is it a triangle? ' + (it.k === 'triangle' ? 'Yes.' : 'No.'), 'So it goes ' + names[g] + '.'], explain: 'It goes ' + names[g] + '.' };
      },
      carroll: function () {
        var c = counts(SET, 'red', 'tri'), pick = R.pick([['red', 'triangle', c.ab], ['red', 'not a triangle', c.a], ['not red', 'triangle', c.b], ['not red', 'not a triangle', c.n]]);
        return { q: 'In the Carroll diagram above, how many shapes are <b>' + pick[0] + '</b> and <b>' + pick[1] + '</b>?', type: 'num', answer: pick[2], hint: 'Find the ' + pick[0] + ' column and the ' + pick[1] + ' row. Count the shapes where they meet.', steps: ['Column: ' + pick[0] + '.', 'Row: ' + pick[1] + '.', 'That box has ' + pick[2] + ' shapes.'], explain: pick[2] + ' shapes are ' + pick[0] + ' and ' + pick[1] + '.' };
      },
      tally: function () { var n = R.int(6, 19); return { q: 'How many tally marks?', type: 'num', answer: n, fig: tally(n), hint: 'Count each crossed group as 5. Then count on the single marks.', steps: ['There are ' + Math.floor(n / 5) + ' groups of 5: ' + Array.apply(null, Array(Math.floor(n / 5))).map(function (_, i) { return 5 * (i + 1); }).join(', ') + '.', 'Count on ' + (n % 5) + ' more.', 'That makes ' + n + '.'], explain: 'There are ' + n + ' tally marks.' }; },
      graph: function () { var i = R.int(0, 3); return { q: 'In the fruit bar graph, how many children like <b>' + FRUIT.cats[i] + '</b>?', type: 'num', answer: FRUIT.n[i], hint: 'Find the top of the ' + FRUIT.cats[i] + ' bar. Look across to the numbers on the side.', steps: ['Find the ' + FRUIT.cats[i] + ' bar.', 'Its top lines up with ' + FRUIT.n[i] + '.'], explain: FRUIT.n[i] + ' children like ' + FRUIT.cats[i] + '.' }; },
      plot: function () { var v = R.int(0, 4); return { q: 'In the pets line plot, how many children have <b>' + v + '</b> pet' + (v === 1 ? '' : 's') + '?', type: 'num', answer: PETS.n[v], hint: 'Count the Xs above ' + v + '.', steps: ['Find ' + v + ' on the number line.', 'Count the Xs above it: ' + PETS.n[v] + '.'], explain: PETS.n[v] + ' children have ' + v + ' pet' + (v === 1 ? '' : 's') + '.' }; },
      mode: function () {
        var cats = R.pick([['cat', 'dog', 'fish', 'bird'], ['red', 'blue', 'green', 'pink'], ['soccer', 'hockey', 'tag', 'swim']]), n = R.shuffle([2, 3, 5, 7]);
        var o = R.mc(modeWords(cats, n), cats.filter(function (c, i) { return n[i] !== 7; }).concat(['7']));
        return { q: 'What is the mode?', type: 'mc', options: o.options, answer: o.answer, fig: barG({ title: 'Votes', cats: cats, n: n }), hint: 'Find the tallest bar. The mode is its name, not its number.', steps: ['The tallest bar is ' + modeWords(cats, n) + '.', 'So the mode is ' + modeWords(cats, n) + '.'], explain: 'The mode is ' + modeWords(cats, n) + '. It got the most votes.' };
      },
      chance: function () {
        var r = R.pick([0, 2, 4]), b = r === 4 ? R.pick([0, 2]) : 3, m = { red: r, blue: b }, ans = chance(m, 'red');
        var opts = ['impossible', 'possible', 'certain'];
        return { q: 'Picking a <b>red</b> marble from this bag is:', type: 'mc', options: opts, answer: opts.indexOf(ans), fig: bag(m), hint: 'Are there any red marbles? Are there any other colours?', steps: ['Red marbles: ' + r + '. Blue marbles: ' + b + '.', ans === 'impossible' ? 'There are no red ones.' : ans === 'certain' ? 'All of them are red.' : 'Some are red and some are not.', 'So it is ' + ans + '.'], explain: 'Picking red is ' + ans + '.' };
      }
    },

    quiz: [
      { q: 'The rules are <b>big</b> and <b>square</b>. Where does a <b>small blue square</b> go in a Venn diagram?', type: 'mc', options: ['in the big circle only', 'in the square circle only', 'in both circles', 'outside both circles'], answer: 1, fig: A.svg(60, 50, icon({ k: 'square', c: 'blue', big: false }, 30, 26), 'a small blue square'), hint: 'Is it big? Is it a square?', explain: 'It is a square but it is not big, so it goes in the square circle only.' },
      { q: 'How many tally marks are there?', type: 'num', answer: 17, fig: tally(17), hint: 'Count the crossed groups by 5s, then count on.', explain: '5, 10, 15, then 16, 17. There are 17.' },
      { q: 'How many more children like bananas than oranges?', type: 'num', answer: 5, fig: barG(FRUIT), hint: 'Read both bars, then find the difference.', explain: 'Banana 7, orange 2. 7 − 2 = 5 more.' },
      { q: 'How many children answered this survey in all?', type: 'num', answer: 18, fig: picto(FRUIT), hint: 'Count every face, or add the rows: 5 + 7 + 4 + 2.', explain: '5 + 7 + 4 + 2 = 18 children.' },
      { q: 'What is the mode of these shoe sizes?', type: 'mc', options: ['size 10', 'size 11', 'size 12', 'size 13'], answer: 2, fig: linePlot({ title: 'Our shoe sizes', lo: 10, hi: 13, n: [2, 3, 5, 1], axis: 'Shoe size' }), hint: 'Find the tallest stack of Xs.', explain: 'Size 12 has 5 Xs, the most. The mode is size 12.' },
      { q: 'A bag has 4 green marbles and nothing else. Picking a <b>green</b> marble is:', type: 'mc', options: ['impossible', 'possible', 'certain'], answer: 2, fig: bag({ green: 4 }), hint: 'Is there any other colour in the bag?', explain: 'Every marble is green, so picking green is certain.' },
      { q: 'Room 12’s mode was banana. Will Room 14 <b>surely</b> have the same mode?', type: 'mc', options: ['Yes, it must be the same', 'Not for sure. We need to ask Room 14.', 'No, it can never be the same'], answer: 1, hint: 'Different groups of people can like different things.', explain: 'It might be the same or it might not. We can predict, then collect data to check.' }
    ],

    practice: [
      { id: 'd2-sort', name: 'Sort by two rules', code: 'D1.1', gen: function (lv) {
        var pairs = [['red', 'tri'], ['blue', 'sq'], ['big', 'tri'], ['red', 'big'], ['blue', 'big'], ['red', 'sq']], p = R.pick(pairs), a = p[0], b = p[1];
        var names = { a: 'only ' + RULES[a].name, b: 'only ' + RULES[b].name, ab: 'both', n: 'neither' };
        if (lv === 1) {
          var it = randSet(1)[0], g = region(it, a, b), o = R.mc(names[g], Object.keys(names).filter(function (k) { return k !== g; }).map(function (k) { return names[k]; }));
          return { q: 'The rules are <b>' + RULES[a].name + '</b> and <b>' + RULES[b].name + '</b>. Where does a <b>' + itName(it) + '</b> go?', type: 'mc', options: o.options, answer: o.answer, fig: A.svg(60, 50, icon(it, 30, 26), 'a ' + itName(it)), hint: 'Ask: Is it ' + RULES[a].name + '? Is it ' + (b === 'big' ? 'big' : 'a ' + RULES[b].name) + '?',
            steps: ['Is it ' + RULES[a].name + '? ' + (RULES[a].t(it) ? 'Yes.' : 'No.'), 'Is it ' + RULES[b].name + '? ' + (RULES[b].t(it) ? 'Yes.' : 'No.'), 'So it goes in: ' + names[g] + '.'], explain: 'It goes in: ' + names[g] + '.' };
        }
        var items = randSet(lv === 2 ? 7 : 10), c = counts(items, a, b), k = R.pick(['a', 'b', 'ab', 'n']), car = lv === 3 && R.int(0, 1);
        var desc = { a: RULES[a].name + ' but ' + RULES[b].not, b: RULES[b].name + ' but ' + RULES[a].not, ab: RULES[a].name + ' and ' + RULES[b].name, n: RULES[a].not + ' and ' + RULES[b].not };
        return { q: 'How many shapes are <b>' + desc[k] + '</b>?', type: 'num', answer: c[k], fig: car ? carroll(items, a, b) : venn(items, a, b), hint: car ? 'Find the box where the right row and the right column meet.' : k === 'ab' ? 'Look where the circles overlap.' : k === 'n' ? 'Look outside both circles.' : 'Look in one circle, but not in the overlap.',
          steps: [k === 'ab' ? 'Fits both rules: the middle part.' : k === 'n' ? 'Fits neither rule: outside the circles.' : 'Fits one rule only: one circle, not the middle.', 'Count them: ' + c[k] + '.'], explain: c[k] + ' shape' + (c[k] === 1 ? ' is ' : 's are ') + desc[k] + '.' };
      } },
      { id: 'd2-tally', name: 'Tally tables', code: 'D1.2', gen: function (lv) {
        if (lv === 1) { var n = R.int(3, lv === 1 ? 15 : 25); return { q: 'How many tally marks?', type: 'num', answer: n, fig: tally(n), hint: 'Each crossed group is 5. Count by 5s, then count on.', steps: ['Groups of 5: ' + Math.floor(n / 5) + '.', 'Count by 5s to ' + 5 * Math.floor(n / 5) + ', then count on ' + n % 5 + '.', 'Total: ' + n + '.'], explain: 'There are ' + n + ' tally marks.' }; }
        var T = R.pick([[['Cats', 'Dogs'], ['Girls', 'Boys'], 'like'], [['Snow', 'Rain'], ['Grade 2', 'Grade 3'], 'like'], [['Juice', 'Milk'], ['Kids', 'Adults'], 'chose']]);
        var m = [[R.int(2, 12), R.int(2, 12)], [R.int(2, 12), R.int(2, 12)]], r = R.int(0, 1), c = R.int(0, 1);
        if (lv === 2) return { q: 'How many <b>' + T[1][c] + '</b> ' + T[2] + ' <b>' + T[0][r].toLowerCase() + '</b>?', type: 'num', answer: m[r][c], fig: twoWay(T[0], T[1], m), hint: 'Find the ' + T[0][r] + ' row and the ' + T[1][c] + ' column. Count the tallies where they meet.', steps: ['Row: ' + T[0][r] + '. Column: ' + T[1][c] + '.', 'Count by 5s, then count on: ' + m[r][c] + '.'], explain: m[r][c] + ' ' + T[1][c] + ' ' + T[2] + ' ' + T[0][r].toLowerCase() + '.' };
        var byRow = R.int(0, 1), tot = byRow ? m[r][0] + m[r][1] : m[0][c] + m[1][c];
        return { q: byRow ? 'How many people ' + T[2] + ' <b>' + T[0][r].toLowerCase() + '</b> in all?' : 'How many <b>' + T[1][c] + '</b> answered in all?', type: 'num', answer: tot, fig: twoWay(T[0], T[1], m), hint: byRow ? 'Add the two boxes in the ' + T[0][r] + ' row.' : 'Add the two boxes in the ' + T[1][c] + ' column.',
          steps: byRow ? ['The ' + T[0][r] + ' row has ' + m[r][0] + ' and ' + m[r][1] + '.', m[r][0] + ' + ' + m[r][1] + ' = ' + tot + '.'] : ['The ' + T[1][c] + ' column has ' + m[0][c] + ' and ' + m[1][c] + '.', m[0][c] + ' + ' + m[1][c] + ' = ' + tot + '.'], explain: 'The total is ' + tot + '.' };
      } },
      { id: 'd2-graph', name: 'Read a graph', code: 'D1.3, D1.5', gen: function (lv) {
        var cats = R.pick([['cat', 'dog', 'fish', 'bird'], ['apple', 'pear', 'plum', 'kiwi'], ['bus', 'car', 'walk', 'bike']]), n = cats.map(function () { return R.int(1, 10); });
        var g = { title: 'Our votes', cats: cats, n: n, src: 'class survey' }, fig = R.int(0, 1) ? barG(g) : picto(g), i = R.int(0, 3), j = (i + R.int(1, 3)) % 4;
        if (lv === 1) return { q: 'How many votes for <b>' + cats[i] + '</b>?', type: 'num', answer: n[i], fig: fig, hint: 'Find ' + cats[i] + '. Count the pictures, or read the top of the bar.', steps: ['Find ' + cats[i] + '.', 'It shows ' + n[i] + '.'], explain: cats[i] + ' has ' + n[i] + ' votes.' };
        if (lv === 2) { if (n[i] === n[j]) n[j] = n[i] === 10 ? 9 : n[i] + 1; var hi = n[i] > n[j] ? i : j, lo = hi === i ? j : i; fig = barG(g); return { q: 'How many more votes for <b>' + cats[hi] + '</b> than for <b>' + cats[lo] + '</b>?', type: 'num', answer: n[hi] - n[lo], fig: fig, hint: 'Read both bars. Then subtract the smaller from the bigger.', steps: [cats[hi] + ': ' + n[hi] + '. ' + cats[lo] + ': ' + n[lo] + '.', n[hi] + ' − ' + n[lo] + ' = ' + (n[hi] - n[lo]) + '.'], explain: n[hi] - n[lo] + ' more votes for ' + cats[hi] + '.' }; }
        var tot = sum(n);
        return { q: 'How many votes are there <b>in all</b>?', type: 'num', answer: tot, fig: fig, hint: 'Read every category, then add them all.', steps: ['The votes are ' + n.join(', ') + '.', n.join(' + ') + ' = ' + tot + '.'], explain: 'There are ' + tot + ' votes in all.' };
      } },
      { id: 'd2-mode', name: 'Find the mode', code: 'D1.4', gen: function (lv) {
        if (lv === 1) {
          var cats = R.pick([['cat', 'dog', 'fish', 'bird'], ['red', 'blue', 'green', 'pink']]), n = R.shuffle([1, 3, 4, 6]), m = modeWords(cats, n);
          var o = R.mc(m, cats.filter(function (c) { return c !== m; }));
          return { q: 'What is the mode?', type: 'mc', options: o.options, answer: o.answer, fig: R.int(0, 1) ? barG({ title: 'Votes', cats: cats, n: n }) : picto({ title: 'Votes', cats: cats, n: n }), hint: 'The mode is the one with the most.', steps: ['Find the longest row or tallest bar.', 'It is ' + m + '.'], explain: 'The mode is ' + m + '.' };
        }
        if (lv === 2) {
          var lo = R.int(1, 5), cnt = R.shuffle([1, 2, 4, 3]), tv = cnt.indexOf(4) + lo, list = [];
          cnt.forEach(function (c, i) { for (var k = 0; k < c; k++) list.push(lo + i); });
          var o2 = R.mc(String(tv), [String(lo), String(lo + 1), String(lo + 2), String(lo + 3), '4'].filter(function (x, i, arr) { return x !== String(tv) && arr.indexOf(x) === i; }).slice(0, 3));
          var useList = R.int(0, 1);
          return { q: useList ? 'These are the numbers of letters in some names: <b>' + R.shuffle(list).join(', ') + '</b>. What is the mode?' : 'What is the mode of this line plot?', type: 'mc', options: o2.options, answer: o2.answer, fig: useList ? '' : linePlot({ title: 'Letters in our names', lo: lo, hi: lo + 3, n: cnt, axis: 'Number of letters' }), hint: useList ? 'Count how many times each number shows up.' : 'Find the tallest stack of Xs.', steps: [cnt.map(function (c, i) { return (lo + i) + ' shows up ' + c + ' time' + (c > 1 ? 's' : ''); }).join('. ') + '.', tv + ' shows up most often.', 'The mode is ' + tv + '.'], explain: 'The mode is ' + tv + '.' };
        }
        var c3 = ['soccer', 'hockey', 'tag', 'swim'], kind = R.pick(['two', 'none', 'one']), n3;
        if (kind === 'two') { var hiV = R.int(5, 9); n3 = R.shuffle([hiV, hiV, R.int(1, hiV - 1), R.int(1, hiV - 1)]); }
        else if (kind === 'none') { var e = R.int(2, 8); n3 = [e, e, e, e]; }
        else n3 = R.shuffle([R.int(7, 9), R.int(1, 3), R.int(4, 6), R.int(1, 3) + 2]);
        var right = modeWords(c3, n3), m3 = modes(n3), wrong = ['no mode', c3[0], c3[1], c3[2] + ' and ' + c3[3], c3[0] + ' and ' + c3[1]].filter(function (x) { return x !== right; });
        var o3 = R.mc(right, R.shuffle(wrong).slice(0, 3));
        return { q: 'What is the mode of this graph?', type: 'mc', options: o3.options, answer: o3.answer, fig: barG({ title: 'Favourite game', cats: c3, n: n3 }), hint: 'Look for the tallest bar. If two bars tie for tallest, there are two modes. If all bars are the same, there is no mode.',
          steps: ['The bars are ' + c3.map(function (c, i) { return c + ' ' + n3[i]; }).join(', ') + '.', !m3.length ? 'All bars are the same height.' : m3.length > 1 ? 'Two bars tie for the most.' : 'One bar is tallest.', 'So the answer is ' + right + '.'], explain: 'The answer is ' + right + '.' };
      } },
      { id: 'd2-chance', name: 'Impossible, possible, certain', code: 'D2.1, D2.2', gen: function (lv) {
        var opts = ['impossible', 'possible', 'certain'];
        if (lv < 3) {
          var cols = ['red', 'blue', 'green', 'yellow'], have = R.shuffle(cols).slice(0, R.int(1, 2)), m = {};
          have.forEach(function (c) { m[c] = R.int(1, 4); });
          var ask = R.int(0, 2) === 0 ? R.pick(cols.filter(function (c) { return have.indexOf(c) < 0; })) : R.pick(have), ans = chance(m, ask);
          return { q: 'Picking a <b>' + ask + '</b> marble from this bag is:', type: 'mc', options: opts, answer: opts.indexOf(ans), fig: bag(m), hint: 'Are there any ' + ask + ' marbles? Are there other colours too?', steps: ['The bag has ' + have.map(function (c) { return m[c] + ' ' + c; }).join(' and ') + '.', ans === 'impossible' ? 'There are no ' + ask + ' marbles.' : ans === 'certain' ? 'Every marble is ' + ask + '.' : 'Some marbles are ' + ask + ' and some are not.', 'So it is ' + ans + '.'], explain: 'Picking ' + ask + ' is ' + ans + '.' };
        }
        var k = R.int(0, 2);
        if (k === 0) { var w = R.pick(['impossible', 'certain']), opp = w === 'impossible' ? 'certain' : 'impossible'; return { q: 'Picking red from a bag is <b>' + w + '</b>. Then picking <b>not red</b> is:', type: 'mc', options: opts, answer: opts.indexOf(opp), hint: 'If something cannot happen, its opposite must happen.', steps: ['Picking red is ' + w + '.', 'Not red is the opposite.', 'So not red is ' + opp + '.'], explain: 'The opposite of ' + w + ' is ' + opp + '.' }; }
        if (k === 1) { var ev = R.pick([['The sun will rise tomorrow.', 'certain'], ['A dog will fly to the moon today.', 'impossible'], ['It will rain this week.', 'possible'], ['You will roll a 7 on a number cube with 1 to 6.', 'impossible'], ['Your teacher will read a story today.', 'possible'], ['Tomorrow will come after today.', 'certain']]); return { q: ev[0] + ' This is:', type: 'mc', options: opts, answer: opts.indexOf(ev[1]), hint: 'Must it happen? Can it never happen? Or might it?', steps: ['Think about whether it could happen.', 'It is ' + ev[1] + '.'], explain: 'It is ' + ev[1] + '.' }; }
        var o = R.mc('Maybe. It could be the same or different.', ['Yes, it will surely be the same.', 'No, it can never be the same.']);
        var top = R.pick(['soccer', 'tag', 'apple', 'blue']);
        return { q: 'Class A’s mode is <b>' + top + '</b>. Will Class B have the same mode?', type: 'mc', options: o.options, answer: o.answer, hint: 'Different groups of people can like different things.', steps: ['Class B is a different group.', 'We can predict, but we must ask them to know.'], explain: 'It might be the same or different. Collect the data to check.' };
      } }
    ]
  });
  /* ---------- more ways to ask each practice skill (answer checks: tests/verify/grade2.js) ---------- */
  var why = K.why, who = K.who;
  var PAIRS = [['red', 'tri'], ['blue', 'sq'], ['big', 'tri'], ['red', 'big'], ['blue', 'big'], ['red', 'sq']];
  var ALL = randSet(18);
  function one(it) { return A.svg(60, 50, icon(it, 30, 26), 'a ' + itName(it)); }
  function graph(cats, n) { return R.int(0, 1) ? barG({ title: 'Our votes', cats: cats, n: n }) : picto({ title: 'Our votes', cats: cats, n: n }); }
  var CATS = [['cat', 'dog', 'fish', 'bird'], ['apple', 'pear', 'plum', 'kiwi'], ['bus', 'car', 'walk', 'bike']];
  function regionName(g, a, b) { return { a: 'only ' + RULES[a].name, b: 'only ' + RULES[b].name, ab: 'both', n: 'neither' }[g]; }
  Atlas.Q.shapes(CH, {
    'd2-sort': [
      [1, 'tap', function (lv) {
        var p = R.pick(PAIRS), yes = ALL.filter(function (it) { return region(it, p[0], p[1]) === 'ab'; }), no = R.shuffle(ALL.filter(function (it) { return region(it, p[0], p[1]) !== 'ab'; }));
        var set = R.shuffle([R.pick(yes)].concat(no.slice(0, 2))), it = set.filter(function (x) { return region(x, p[0], p[1]) === 'ab'; })[0];
        return { q: 'Tap the shape that fits <b>both</b> rules: <b>' + RULES[p[0]].name + '</b> and <b>' + RULES[p[1]].name + '</b>.', type: 'tap', tiles: set.map(one), answer: set.indexOf(it), answerText: 'the ' + itName(it),
          hint: 'Check each shape against both rules.', steps: ['Is it ' + RULES[p[0]].name + '?', 'Is it ' + RULES[p[1]].name + '?', 'Only one shape says yes to both.'],
          explain: 'The ' + itName(it) + ' is ' + RULES[p[0]].name + ' and ' + RULES[p[1]].name + '.', meta: { k: 'd2-sort-tap' } };
      }],
      [1, 'pick', function (lv) {
        var p = R.pick(PAIRS), a = p[R.int(0, 1)], yes = R.shuffle(ALL.filter(RULES[a].t)), no = R.shuffle(ALL.filter(function (it) { return !RULES[a].t(it); })), y = R.int(1, 3);
        var set = R.shuffle(yes.slice(0, y).concat(no.slice(0, 5 - y)));
        return { q: 'Pick every shape that goes inside the <b>' + RULES[a].name + '</b> circle.', type: 'pick', options: set.map(one), answer: set.map(function (it, j) { return RULES[a].t(it) ? j : -1; }).filter(function (j) { return j >= 0; }),
          hint: 'Ask of each shape: is it ' + RULES[a].name + '?', steps: ['Look at each shape on its own.', 'Keep the ones that are ' + RULES[a].name + '.'],
          explain: 'The ' + RULES[a].name + ' shapes go inside that circle.', meta: { k: 'd2-sort-pick' } };
      }],
      [2, 'mistake', function (lv) {
        var p = R.pick(PAIRS), it = R.pick(ALL), g = region(it, p[0], p[1]), name = who(), truth = !R.int(0, 2);
        var said = truth ? g : R.pick(['a', 'b', 'ab', 'n'].filter(function (x) { return x !== g; }));
        var right = 'It is ' + (RULES[p[0]].t(it) ? '' : 'not ') + RULES[p[0]].name + ' and ' + (RULES[p[1]].t(it) ? '' : 'not ') + RULES[p[1]].name + ', so it goes in: ' + regionName(g, p[0], p[1]) + '.';
        return { q: 'The rules are <b>' + RULES[p[0]].name + '</b> and <b>' + RULES[p[1]].name + '</b>. ' + name + ' says a <b>' + itName(it) + '</b> goes in <b>' + regionName(said, p[0], p[1]) + '</b>. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: one(it),
          why: why(right, ['Check only the first rule.', 'Every shape goes in the middle.', 'Big shapes always go outside.']),
          hint: 'Ask both questions: does it fit the first rule? The second?', steps: [right], explain: right, meta: { k: 'd2-sort-tf' } };
      }]
    ],
    'd2-tally': [
      [1, 'tap', function (lv) {
        var n = R.int(3, lv === 1 ? 14 : 24), set = R.shuffle([n, n + 1, n === 5 ? 4 : n - 1].filter(function (x, i, a) { return x > 0 && a.indexOf(x) === i; }));
        return { q: 'Tap the tally that shows <b>' + n + '</b>.', type: 'tap', tiles: set.map(function (x) { return tally(x); }), answer: set.indexOf(n), answerText: 'the tally with ' + n + ' marks',
          hint: 'Each crossed group is 5. Count by 5s, then count on.', steps: [n + ' is ' + Math.floor(n / 5) + ' groups of 5 and ' + n % 5 + ' more.'],
          explain: n + ' tally marks: ' + Math.floor(n / 5) + ' crossed group' + (Math.floor(n / 5) === 1 ? '' : 's') + ' and ' + n % 5 + ' more.', meta: { k: 'd2-tally-tap' } };
      }],
      [1, 'match', function (lv) {
        var seen = {}, set = [];
        while (set.length < 3) { var n = R.int(3, lv === 1 ? 14 : 24); if (!seen[n]) { seen[n] = 1; set.push(n); } }
        return { q: 'Match each tally to its number.', type: 'match', pairs: set.map(function (n) { return [tally(n), String(n)]; }),
          hint: 'Count by 5s for each crossed group, then count on.', steps: ['Two crossed groups and 3 more: 5, 10, then 11, 12, 13.'],
          explain: 'Count by 5s, then count on the rest.', meta: { k: 'd2-tally-match' } };
      }],
      [2, 'fill', function (lv) {
        var T = R.pick([[['Cats', 'Dogs'], ['Girls', 'Boys']], [['Snow', 'Rain'], ['Grade 2', 'Grade 3']], [['Juice', 'Milk'], ['Kids', 'Adults']]]);
        var m = [[R.int(2, 12), R.int(2, 12)], [R.int(2, 12), R.int(2, 12)]];
        return { q: 'How many chose each one in all?', type: 'fill', fig: twoWay(T[0], T[1], m), fill: T[0][0] + ': [[]] in all. ' + T[0][1] + ': [[]] in all.', answers: [sum(m[0]), sum(m[1])],
          hint: 'Add the two boxes in each row.', steps: [T[0][0] + ': ' + m[0][0] + ' + ' + m[0][1] + ' = ' + sum(m[0]) + '.', T[0][1] + ': ' + m[1][0] + ' + ' + m[1][1] + ' = ' + sum(m[1]) + '.'],
          explain: T[0][0] + ' ' + sum(m[0]) + ', ' + T[0][1] + ' ' + sum(m[1]) + '.', meta: { k: 'd2-tally-fill' } };
      }],
      [2, 'mistake', function (lv) {
        var g = R.int(1, 3), r = R.int(1, 4), n = 5 * g + r, name = who(), truth = !R.int(0, 2), said = truth ? n : 4 * g + r;
        var right = 'Each crossed group is 5. ' + g + ' group' + (g > 1 ? 's make ' : ' makes ') + 5 * g + ', and ' + r + ' more make ' + n + '.';
        return { q: name + ' counts these tally marks as <b>' + said + '</b>. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: tally(n),
          why: why(right, ['The line across does not count.', 'Each crossed group is 4.', 'Count only the groups.']),
          hint: 'The line across is the 5th mark in each group.', steps: [right], explain: right, meta: { k: 'd2-tally-tf' } };
      }]
    ],
    'd2-graph': [
      [1, 'tap', function (lv) {
        var cats = R.pick(CATS), n = R.shuffle([2, 4, 6, 8, 3, 7]).slice(0, 4), most = R.int(0, 1), want = n.indexOf(most ? Math.max.apply(null, n) : Math.min.apply(null, n));
        return { q: 'Tap the choice with the <b>' + (most ? 'most' : 'fewest') + '</b> votes.', type: 'tap', fig: graph(cats, n), tiles: cats.slice(), answer: want,
          hint: most ? 'Find the longest row or tallest bar.' : 'Find the shortest row or bar.', steps: ['Compare all four.', cats[want] + ' has ' + n[want] + '.'],
          explain: cats[want] + ' has the ' + (most ? 'most' : 'fewest') + ' votes: ' + n[want] + '.', meta: { k: 'd2-graph-tap' } };
      }],
      [1, 'order', function (lv) {
        var cats = R.pick(CATS), n = R.shuffle([1, 3, 5, 7, 9, 2, 6]).slice(0, lv === 1 ? 3 : 4), c = cats.slice(0, n.length);
        var idx = n.map(function (v, i) { return i; }).sort(function (x, y) { return n[y] - n[x]; });
        return { q: 'Put the choices in order from <b>most</b> votes to fewest.', type: 'order', fig: barG({ title: 'Our votes', cats: c, n: n }), items: idx.map(function (i) { return c[i]; }), first: 'most', last: 'fewest',
          hint: 'Start with the tallest bar.', steps: ['Read each bar.', idx.map(function (i) { return c[i] + ' ' + n[i]; }).join(', ') + '.'],
          explain: idx.map(function (i) { return c[i]; }).join(', ') + '.', meta: { k: 'd2-graph-order' } };
      }],
      [2, 'mistake', function (lv) {
        var cats = R.pick(CATS), n = cats.map(function () { return R.int(1, 10); }), i = R.int(0, 3), j = (i + R.int(1, 3)) % 4;
        if (n[i] === n[j]) n[j] = n[i] === 10 ? 9 : n[i] + 1;
        var hi = n[i] > n[j] ? i : j, lo = hi === i ? j : i, d = n[hi] - n[lo], name = who(), truth = !R.int(0, 2), said = truth ? d : n[hi] + n[lo];
        var right = cats[hi] + ' has ' + n[hi] + ' and ' + cats[lo] + ' has ' + n[lo] + '. ' + n[hi] + ' − ' + n[lo] + ' = ' + d + '.';
        return { q: name + ' says there are <b>' + said + '</b> more votes for ' + cats[hi] + ' than for ' + cats[lo] + '. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: barG({ title: 'Our votes', cats: cats, n: n }),
          why: why(right, ['Add the two bars to find how many more.', 'Count all the bars.', 'Read only the taller bar.']),
          hint: '"How many more" means find the difference.', steps: [right], explain: right, meta: { k: 'd2-graph-tf' } };
      }]
    ],
    'd2-mode': [
      [1, 'tap', function (lv) {
        var cats = R.pick(CATS), n = R.shuffle([1, 3, 4, 6]);
        return { q: 'Tap the <b>mode</b>.', type: 'tap', fig: graph(cats, n), tiles: cats.slice(), answer: n.indexOf(6),
          hint: 'The mode is the one chosen most often.', steps: ['Find the longest row or tallest bar.'], explain: 'The mode is ' + cats[n.indexOf(6)] + '.', meta: { k: 'd2-mode-tap' } };
      }],
      [1, 'pick', function (lv) {
        var cats = R.pick(CATS), top = R.int(5, 9), two = lv > 1 || R.int(0, 1), n = R.shuffle([top, two ? top : R.int(1, top - 1), R.int(1, top - 1), R.int(1, top - 1)]);
        return { q: 'Pick every <b>mode</b>. There may be more than one.', type: 'pick', fig: barG({ title: 'Our votes', cats: cats, n: n }), options: cats.slice(), answer: n.map(function (v, j) { return v === top ? j : -1; }).filter(function (j) { return j >= 0; }),
          hint: 'If two bars tie for tallest, both are modes.', steps: ['Find the tallest bar.', 'Check if another bar is just as tall.'],
          explain: 'The mode' + (two ? 's are ' : ' is ') + cats.filter(function (c, j) { return n[j] === top; }).join(' and ') + '.', meta: { k: 'd2-mode-pick' } };
      }],
      [2, 'mistake', function (lv) {
        var lo = R.int(2, 5), cnt = R.shuffle([1, 2, 4, 1]), tv = lo + cnt.indexOf(4), list = [];
        cnt.forEach(function (c, i) { for (var k = 0; k < c; k++) list.push(lo + i); });
        var big = lo + 3, name = who(), truth = !R.int(0, 2), said = truth ? tv : big === tv ? lo : big;
        var right = tv + ' shows up most often, so the mode is ' + tv + '.';
        return { q: 'These are the numbers of letters in some names: <span class="math">' + R.shuffle(list).join(', ') + '</span>. ' + name + ' says the mode is <b>' + said + '</b>. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['The mode is the biggest number.', 'The mode is the first number in the list.', 'The mode is how many numbers there are.']),
          hint: 'Count how many times each number shows up.', steps: [right], explain: right, meta: { k: 'd2-mode-tf' } };
      }]
    ],
    'd2-chance': [
      [1, 'tap', function (lv) {
        var c = R.pick(['red', 'blue', 'green']), other = c === 'blue' ? 'yellow' : 'blue', word = R.pick(['impossible', 'possible', 'certain']);
        var bags = R.shuffle([0, 1, 2]);
        var make = function (k) { var m = {}; if (k !== 0) m[c] = R.int(2, 5); if (k !== 2) m[other] = R.int(2, 5); return m; };
        var want = { impossible: 0, possible: 1, certain: 2 }[word], ms = bags.map(make);
        return { q: 'Tap the bag where picking <b>' + c + '</b> is <b>' + word + '</b>.', type: 'tap', tiles: ms.map(function (m) { return bag(m); }), answer: bags.indexOf(want), answerText: 'the bag with ' + (want === 0 ? 'no ' + c + ' marbles' : want === 2 ? 'only ' + c + ' marbles' : c + ' and ' + other + ' marbles'),
          hint: 'Impossible: none of that colour. Certain: all that colour. Possible: some.', steps: ['Look at the colours in each bag.'],
          explain: word === 'impossible' ? 'No ' + c + ' marbles, so it cannot happen.' : word === 'certain' ? 'Every marble is ' + c + ', so it must happen.' : 'Some marbles are ' + c + ' and some are not.', meta: { k: 'd2-chance-tap' } };
      }],
      [1, 'match', function (lv) {
        var cols = R.shuffle(['red', 'blue', 'green', 'yellow']), m = {};
        m[cols[0]] = R.int(1, 4); m[cols[1]] = R.int(1, 4);
        var p = R.shuffle([['picking ' + cols[0], 'possible'], ['picking ' + cols[2], 'impossible'], ['picking ' + cols[0] + ' or ' + cols[1], 'certain']]);
        return { q: 'Match each pick from this bag to how likely it is.', type: 'match', fig: bag(m), pairs: p,
          hint: 'Are there any of that colour? Are there other colours too?', steps: ['The bag has ' + m[cols[0]] + ' ' + cols[0] + ' and ' + m[cols[1]] + ' ' + cols[1] + '.'],
          explain: p.map(function (x) { return x[0] + ' is ' + x[1]; }).join('. ') + '.', meta: { k: 'd2-chance-match' } };
      }],
      [2, 'mistake', function (lv) {
        var a = R.int(4, 8), b = R.int(1, 3), m = { blue: a, red: b }, name = who(), truth = !R.int(0, 2), said = truth ? 'possible' : 'certain';
        var right = 'There are blue and red marbles, so picking blue is possible, not certain.';
        return { q: name + ' says picking blue from this bag is <b>' + said + '</b>. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: bag(m),
          why: why(right, ['More of a colour makes it certain.', 'Red is impossible because there are fewer.', 'Every pick is certain.']),
          hint: 'Certain means it must happen every time. Could you pick a red?', steps: [right], explain: right, meta: { k: 'd2-chance-tf' } };
      }]
    ]
  });
})();
