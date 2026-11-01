/* Grade 3 Multiplying and Dividing: a full chapter (docs/QUESTIONS.md, "Full chapters"). 7 lessons, 19 ideas, one practice skill per idea.
   Ontario 2020: B2.1 properties and the link between multiplying and dividing, B2.2 facts of 2, 5 and 10 and their division facts,
   B2.6 multiplying to 10 × 10 and dividing to 100 ÷ 10 with tools and arrays, B2.9 ratios of 1 to 2, 1 to 5 and 1 to 10.
   One meaning of × everywhere: 3 × 4 is 3 groups of 4 (3 plates of 4, 3 rows of 4, 3 jumps of 4). The turn-around (3 × 4 = 4 × 3) is taught as its own idea.
   Every question sets meta.k; the answer checks are in tests/verify/grade3.js (keys start with g3md-). */
(function () {
  var A = Atlas, R = A.R, Q = A.Q, CH = 'multiply-divide';
  var X = ' &times; ', DV = ' &divide; ', MI = ' &minus; ';

  /* ---------- words and numbers ---------- */
  function put(o, x) { for (var k in x) o[k] = x[k]; return o; }
  function plain(h) { var e = document.createElement('div'); e.innerHTML = h; return e.textContent.replace(/\s+/g, ' ').trim(); }
  function coin() { return Math.random() < 0.5; }
  function m(t) { return '<span class="math">' + t + '</span>'; }
  function pl(n, one, many) { return G3.pl(n, one, many); }
  function rng(lv, t) { return R.int(t[lv][0], t[lv][1]); }
  function skips(k, n, from) { var l = []; for (var i = 1; i <= n; i++) l.push((from || 0) + k * i); return l.join(', '); }
  function adds(g, n) { var a = []; for (var i = 0; i < g; i++) a.push(n); return a.join(' + '); }
  function same(g, n) { var a = []; for (var i = 0; i < g; i++) a.push(n); return a; }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  /* number of groups (GR) and how many in each (EA): level 1 small, level 3 the big facts to 10 × 10 */
  var GR = { 1: [2, 5], 2: [2, 7], 3: [6, 10] }, EA = { 1: [2, 5], 2: [3, 7], 3: [6, 10] }, K1 = { 1: [2, 10], 2: [2, 5, 10], 3: [5, 2, 10, 5] };
  /* a pair of different numbers from a table of levels */
  function two(lv, ta, tb) { var a = rng(lv, ta), b = rng(lv, tb), guard = 0; while (b === a && guard++ < 20) b = rng(lv, tb); if (b === a) b = a === 2 ? 3 : a - 1; return [a, b]; }

  /* ---------- question builders ---------- */
  /* fixes for known wrong answers: [[wrong value, fix], ...] -> { 'value': fix } (Atlas.Q.diag) */
  function fx(list) { var o = {}; list.forEach(function (p) { var k = String(p[0]); if (!(k in o) && p[0] >= 0) o[k] = p[1]; }); return o; }
  function num(q, ans, fixes, x) { var w = {}; Object.keys(fixes || {}).forEach(function (k) { if (+k !== ans) w[k] = fixes[k]; }); return put({ q: q, type: 'num', answer: ans, wrong: w }, x || {}); }
  function fill(q, f, answers, x) { return put({ q: q, type: 'fill', fill: f, answers: answers }, x || {}); }
  /* pick one: the right answer and up to 3 wrong ones, each with the fix for that mistake: wrongs = [[html, fix], ...] */
  function mc(q, right, wrongs, x) {
    var seen = {}, opts = [right], fix = {};
    seen[plain(right)] = 1;
    wrongs.forEach(function (w) { var t = plain(w[0]); if (opts.length >= 4 || seen[t]) return; seen[t] = 1; opts.push(w[0]); if (w[1]) fix[t] = w[1]; });
    var o = R.shuffle(opts);
    return put({ q: q, type: 'mc', options: o, answer: o.indexOf(right), wrong: fix }, x || {});
  }
  /* pick one, in a fixed order */
  function fixed(q, opts, ans, fixes, x) { var w = {}; opts.forEach(function (o, j) { if (j !== ans && fixes[j]) w[plain(o)] = fixes[j]; }); return put({ q: q, type: 'mc', options: opts, answer: ans, wrong: w }, x || {}); }
  function tf(q, truth, right, bad, fix, x) {
    var o = R.mc(right, bad), w = {};
    w[truth ? 'False' : 'True'] = fix;
    return put({ q: q, type: 'tf', answer: truth, why: { options: o.options, answer: o.answer }, wrong: w, steps: [right], explain: right }, x || {});
  }
  function prodFix(a, b) {
    return fx([[a + b, 'You added. ' + a + X + b + ' is ' + a + ' groups of ' + b + '.'], [a * b - b, 'One group short. Count ' + a + ' groups of ' + b + '.'], [a * b + b, 'One group too many. Count ' + a + ' groups of ' + b + '.'], [b, 'That is just one group.']]);
  }
  function divFix(n, d) {
    return fx([[n - d, 'You took ' + d + ' away once. Count how many ' + d + 's make ' + n + '.'], [d, 'That is the number you divide by.'], [n * d, 'You multiplied. Dividing splits ' + n + ' into equal groups.'], [n, 'That is the total. Split it into equal groups.']]);
  }
  /* a match: three different pairs made by fn(), no card twice */
  function pairs3(fn) {
    var out = [], L = {}, Rt = {}, guard = 0;
    while (out.length < 3 && guard++ < 200) { var p = fn(), l = plain(p[0]), r = plain(p[1]); if (L[l] || Rt[r]) continue; L[l] = Rt[r] = 1; out.push(p); }
    return out;
  }

  /* ---------- pictures ---------- */
  var DOT = 'var(--strand)', HI = 'var(--hi)', PLATE = 'color-mix(in srgb,var(--strand) 8%,var(--card))';
  function r1(v) { return Math.round(v * 10) / 10; }
  function txt(x, y, t, size, anchor, cls) { return '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="' + size + '" text-anchor="' + (anchor || 'middle') + '" class="' + (cls || 'tb') + '">' + t + '</text>'; }
  function dot(x, y, r, fill, tag) { return '<circle' + (tag || '') + ' cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r + '" style="fill:' + fill + ';stroke:var(--ink)" stroke-width="1.5"/>'; }
  /* counters in one group, centred on (cx, cy) */
  function cluster(cx, cy, n, i) {
    var cols = n <= 4 ? 2 : n <= 6 ? 3 : n <= 9 ? 3 : 4, r = n <= 4 ? 11 : n <= 6 ? 10 : 8, gap = r * 2.5, rows = Math.ceil(n / cols), s = '';
    for (var k = 0; k < n; k++) {
      var row = Math.floor(k / cols), inRow = Math.min(cols, n - row * cols);
      s += dot(cx + (k % cols - (inRow - 1) / 2) * gap, cy + (row - (rows - 1) / 2) * gap, r, HI, ' data-on="' + i + '"');
    }
    return s;
  }
  /* plates (or bags) with counters on each; o.pile: counters still to share, drawn in rows of 10 below */
  function platesFig(counts, o) {
    o = o || {};
    var k = counts.length, per = Math.min(Math.max(k, 1), 5), CW = 100, s = '', W = Math.max(k ? per * CW + 12 : 0, o.pile ? 244 : 0), y = k ? 6 + Math.ceil(k / per) * CW : 0;
    for (var i = 0; i < k; i++) {
      var cx = 6 + (i % per) * CW + CW / 2, cy = 6 + Math.floor(i / per) * CW + CW / 2;
      s += o.bags ? '<rect data-p="g" x="' + (cx - 44) + '" y="' + (cy - 42) + '" width="88" height="84" rx="18" style="fill:' + PLATE + ';stroke:var(--strand)" stroke-width="2.5"/>'
        : '<circle data-p="g" cx="' + cx + '" cy="' + cy + '" r="46" style="fill:' + PLATE + ';stroke:var(--strand)" stroke-width="2.5"/>';
      s += cluster(cx, cy, counts[i], i);
    }
    if (o.pile) {
      if (k) { s += '<line x1="8" y1="' + (y + 6) + '" x2="' + (W - 8) + '" y2="' + (y + 6) + '" style="stroke:var(--line)" stroke-width="2" stroke-dasharray="6 5"/>'; y += 12; }
      for (var p = 0; p < o.pile; p++) s += dot(18 + (p % 10) * 22, y + 14 + Math.floor(p / 10) * 22, 8, HI, ' data-p="pile"');
      y += 8 + Math.ceil(o.pile / 10) * 22;
    }
    return A.svg(W, y + 6, s, o.label || (k ? k + (o.bags ? ' bags' : ' plates') + ' with ' + counts.join(', ') : '') + (o.pile ? (k ? ', and ' : '') + o.pile + ' counters to share' : ''));
  }
  /* r rows of c dots. o.labels: row numbers and "c in a row"; o.split: colour the rows from there on; o.parts: the fact for each part; o.off: rows from there on are taken away */
  function arrayFig(r, c, o) {
    o = o || {};
    var gap = Math.min(34, Math.floor(300 / Math.max(r, c))), rad = r1(gap * 0.34), L = o.labels ? 34 : 8, T = o.labels ? 30 : 8, PW = o.parts ? 128 : 0, s = '';
    for (var i = 0; i < r; i++) {
      for (var j = 0; j < c; j++) {
        var x = L + j * gap + gap / 2, y = T + i * gap + gap / 2;
        s += o.off != null && i >= o.off ? '<circle data-a="x" cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + rad + '" style="fill:none;stroke:var(--ink2)" stroke-width="1.5" stroke-dasharray="3 3"/>'
          : '<circle data-a="d" cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + rad + '" style="fill:' + (o.split && i >= o.split ? HI : DOT) + ';stroke:var(--ink)" stroke-width="1"/>';
      }
      if (o.labels) s += txt(L - 8, T + i * gap + gap / 2 + 5, i + 1, 14, 'end', 't2');
    }
    if (o.labels) s += txt(L + c * gap / 2, 20, c + ' in a row', 17);
    var cut = o.split || o.off;
    if (cut && cut < r) s += '<line x1="' + (L - 4) + '" y1="' + (T + cut * gap) + '" x2="' + (L + c * gap + 4) + '" y2="' + (T + cut * gap) + '" style="stroke:var(--ink)" stroke-width="2.5" stroke-dasharray="7 5"/>';
    if (o.parts && o.split) {
      s += txt(L + c * gap + 12, T + o.split * gap / 2 + 6, o.split + ' &times; ' + c + ' = ' + o.split * c, 17, 'start');
      s += txt(L + c * gap + 12, T + o.split * gap + (r - o.split) * gap / 2 + 6, (r - o.split) + ' &times; ' + c + ' = ' + (r - o.split) * c, 17, 'start');
    }
    return A.svg(Math.max(160, L + c * gap + 8 + PW), T + r * gap + 8, s, o.label || r + ' rows of ' + c + ' dots');
  }
  /* jumps of k on a number line from 0. o.max: the end; o.show(v): which tick numbers to write (default all);
     o.count: number each jump; o.cap: a caption above the line; o.dot: mark where the jumps land */
  function lineFig(k, n, o) {
    o = o || {};
    var max = o.max || k * 10, x0 = 22, x1 = 538, top = o.cap ? 22 : 0, base = 86 + top, s = '';
    function X(v) { return r1(x0 + (x1 - x0) * v / max); }
    var steps = Math.round(max / k), every = steps > 10 ? 2 : 1, show = o.show || function () { return true; };
    if (o.cap) s += txt(4, 16, o.cap, 16, 'start');
    s += '<line x1="' + x0 + '" y1="' + base + '" x2="' + x1 + '" y2="' + base + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= steps; i++) {
      var v = i * k;
      s += '<line x1="' + X(v) + '" y1="' + (base - 8) + '" x2="' + X(v) + '" y2="' + (base + 8) + '" style="stroke:var(--ink)" stroke-width="2"/>';
      if (show(v) && (i % every === 0 || v === max)) s += txt(X(v), base + 30, v, 18);
    }
    var h = Math.min(44, (X(k) - X(0)) * 0.7);
    for (var j = 0; j < n; j++) {
      var a = X(j * k), b = X((j + 1) * k);
      s += '<path d="M' + a + ' ' + (base - 4) + ' Q' + r1((a + b) / 2) + ' ' + r1(base - 4 - 2 * h) + ' ' + b + ' ' + (base - 4) + '" fill="none" style="stroke:var(--strand)" stroke-width="3"/>';
      if (o.count) s += txt((a + b) / 2, base - h - 10, j + 1, 14, 'middle', 't2');
    }
    if (n && o.dot !== false) s += '<circle cx="' + X(n * k) + '" cy="' + base + '" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(560, base + 40, s, n + ' jumps of ' + k + ' on a number line');
  }
  /* a × b and b × a on two lines of the same length: they land in the same place */
  function twoLine(a, b, top, bot, hide) {
    var p = a * b;
    return '<div>' + lineFig(b, top, { max: p, cap: a + ' jumps of ' + b, show: function (v) { return v === 0 || (!hide && v === p && top === a); } }) +
      lineFig(a, bot, { max: p, cap: b + ' jumps of ' + a, show: function (v) { return !hide || v < p; } }) + '</div>';
  }
  /* 1 to 100 with the facts of k shaded; o.mark: one number outlined */
  function chart100(k, o) {
    o = o || {};
    var sz = 34, s = '';
    for (var i = 1; i <= 100; i++) {
      var x = 4 + ((i - 1) % 10) * sz, y = 4 + Math.floor((i - 1) / 10) * sz, on = k && i % k === 0, mk = i === o.mark;
      s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:' + (on ? 'color-mix(in srgb,var(--strand) 70%,var(--card))' : 'var(--card)') + ';stroke:' + (mk ? 'var(--ink)' : 'var(--line)') + '" stroke-width="' + (mk ? 4 : 1.5) + '"/>' +
        '<text x="' + (x + sz / 2) + '" y="' + (y + sz / 2 + 6) + '" text-anchor="middle" font-size="15"' + (on ? ' font-weight="700" style="fill:#fff"' : ' class="t2"') + '>' + i + '</text>';
    }
    return A.svg(sz * 10 + 8, sz * 10 + 8, s, 'Hundred chart' + (k ? ' with the facts of ' + k + ' shaded' : ''));
  }
  /* the facts of k, 1 to 10, shown up to n */
  function strip(k, n) {
    var s = '', W = 66;
    for (var i = 1; i <= 10; i++) {
      var x = 4 + ((i - 1) % 5) * W, y = 4 + Math.floor((i - 1) / 5) * 62, on = i <= n;
      s += '<rect x="' + x + '" y="' + y + '" width="' + (W - 6) + '" height="56" rx="8" style="fill:' + (on ? PLATE : 'var(--card)') + ';stroke:' + (on ? 'var(--strand)' : 'var(--line)') + '" stroke-width="2"/>';
      s += txt(x + (W - 6) / 2, y + 18, i + ' &times; ' + k, 13, 'middle', 't2');
      if (on) s += txt(x + (W - 6) / 2, y + 45, i * k, 22);
    }
    return A.svg(5 * W + 4, 130, s, 'The facts of ' + k + (n ? ', up to ' + n + ' times ' + k : ''));
  }
  /* a times chart: row r (the number of groups) meets column c (how many in each) */
  function chart(r, c, show) {
    var sz = 30, s = '';
    for (var i = 0; i <= 10; i++) for (var j = 0; j <= 10; j++) {
      if (!i && !j) continue;
      var x = 4 + j * sz, y = 4 + i * sz, head = !i || !j, hit = i === r && j === c, lane = (i === r && j <= c) || (j === c && i <= r);
      s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:' + (hit ? 'var(--hi)' : head ? 'color-mix(in srgb,var(--strand) 18%,var(--card))' : lane && r ? 'color-mix(in srgb,var(--strand) 9%,var(--card))' : 'var(--card)') + ';stroke:var(--line)" stroke-width="1.2"/>';
      if (head) s += txt(x + sz / 2, y + 20, i || j, 14);
      else if (hit && show) s += txt(x + sz / 2, y + 20, i * j, 14);
    }
    return A.svg(11 * sz + 8, 11 * sz + 8, s, r ? 'Times chart: row ' + r + ' meets column ' + c : 'Times chart');
  }

  /* things that always come in 2s, 5s or 10s */
  var THINGS = {
    2: [{ one: 'bike', many: 'bikes', part: 'wheel', parts: 'wheels', ic: 'bike' }, { one: 'pair of mittens', many: 'pairs of mittens', part: 'mitten', parts: 'mittens', ic: 'mitt' }, { one: 'canoe', many: 'canoes', part: 'paddle', parts: 'paddles', ic: 'canoe' }],
    5: [{ one: 'star', many: 'stars', part: 'point', parts: 'points', ic: 'star' }, { one: 'nickel', many: 'nickels', part: 'cent', parts: 'cents', ic: 'nickel', coin: 1 }],
    10: [{ one: 'dime', many: 'dimes', part: 'cent', parts: 'cents', ic: 'dime', coin: 1 }, { one: 'box of crayons', many: 'boxes of crayons', part: 'crayon', parts: 'crayons', ic: 'box' }]
  };
  function kOf(th) { for (var k in THINGS) if (THINGS[k].indexOf(th) >= 0) return +k; return 0; }
  function icon(ic, x, y) {
    var ink = ';stroke:var(--ink)" stroke-width="2"';
    if (ic === 'bike') return '<circle cx="' + (x + 15) + '" cy="' + (y + 40) + '" r="13" style="fill:var(--card);stroke:var(--strand)" stroke-width="3.5"/><circle cx="' + (x + 45) + '" cy="' + (y + 40) + '" r="13" style="fill:var(--card);stroke:var(--strand)" stroke-width="3.5"/>' +
      '<path d="M' + (x + 15) + ' ' + (y + 40) + ' L' + (x + 26) + ' ' + (y + 22) + ' L' + (x + 40) + ' ' + (y + 22) + ' L' + (x + 45) + ' ' + (y + 40) + ' M' + (x + 26) + ' ' + (y + 22) + ' L' + (x + 31) + ' ' + (y + 40) + ' L' + (x + 40) + ' ' + (y + 22) + ' M' + (x + 22) + ' ' + (y + 16) + ' L' + (x + 30) + ' ' + (y + 16) + '" fill="none" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round"/>';
    if (ic === 'mitt') return [0, 1].map(function (i) { var mx = x + 8 + i * 26; return '<rect x="' + mx + '" y="' + (y + 16) + '" width="18" height="32" rx="9" style="fill:var(--hi)' + ink + '/><ellipse cx="' + (i ? mx + 1 : mx + 17) + '" cy="' + (y + 30) + '" rx="5" ry="8" style="fill:var(--hi)' + ink + '/><rect x="' + mx + '" y="' + (y + 44) + '" width="18" height="7" rx="2" style="fill:var(--strand)' + ink + '/>'; }).join('');
    if (ic === 'canoe') return '<path d="M' + (x + 2) + ' ' + (y + 38) + ' Q' + (x + 30) + ' ' + (y + 58) + ' ' + (x + 58) + ' ' + (y + 38) + ' Z" style="fill:var(--strand)' + ink + '/>' +
      [16, 42].map(function (px) { return '<line x1="' + (x + px - 6) + '" y1="' + (y + 10) + '" x2="' + (x + px + 4) + '" y2="' + (y + 44) + '" style="stroke:var(--ink)" stroke-width="2.5"/><ellipse cx="' + (x + px + 4) + '" cy="' + (y + 46) + '" rx="4" ry="8" style="fill:var(--hi)' + ink + '/>'; }).join('');
    if (ic === 'star') { var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 11 : 26; p.push(r1(x + 30 + rr * Math.cos(a)) + ',' + r1(y + 32 + rr * Math.sin(a))); } return '<polygon points="' + p.join(' ') + '" style="fill:var(--hi)' + ink + ' stroke-linejoin="round"/>'; }
    if (ic === 'nickel' || ic === 'dime') { var big = ic === 'nickel'; return '<circle cx="' + (x + 30) + '" cy="' + (y + 32) + '" r="' + (big ? 23 : 19) + '" style="fill:color-mix(in srgb,var(--ink2) 22%,var(--card))' + ink + '/>' + txt(x + 30, y + 38, big ? '5&cent;' : '10&cent;', big ? 17 : 15); }
    var cr = ['var(--sb)', 'var(--sd)', 'var(--se)', 'var(--sc)', 'var(--hi)'], s = '';
    for (var c = 0; c < 10; c++) s += '<rect x="' + r1(x + 10 + c * 4.1) + '" y="' + (y + 12) + '" width="3.4" height="22" rx="1.5" style="fill:' + cr[c % 5] + '"/>';
    return s + '<rect x="' + (x + 7) + '" y="' + (y + 28) + '" width="46" height="24" rx="3" style="fill:var(--strand)' + ink + '/>';
  }
  function ratioFig(th, n) {
    var s = '', per = Math.min(n, 5);
    for (var i = 0; i < n; i++) s += icon(th.ic, 4 + (i % 5) * 68, 4 + Math.floor(i / 5) * 64);
    return A.svg(Math.max(per * 68 + 8, 140), Math.ceil(n / 5) * 64 + 8, s, pl(n, th.one, th.many));
  }
  function ratioTable(th, n, k) {
    var h = '<div class="tbl"><table><tbody><tr><th class="l">' + cap(th.many) + '</th>', h2 = '<tr><th class="l">' + cap(th.parts) + '</th>';
    for (var i = 1; i <= n; i++) { var on = i === n ? ' style="background:color-mix(in srgb,var(--hi) 45%,var(--card))"' : ''; h += '<td' + on + '>' + i + '</td>'; h2 += '<td' + on + '>' + i * k + '</td>'; }
    return h + '</tr>' + h2 + '</tr></tbody></table></div>';
  }
  function hasOne(th, k) { return '1 ' + th.one + (th.coin ? ' is worth ' : ' has ') + k + ' ' + th.parts; }
  function askMany(th, n) { return th.coin ? 'How many cents are ' + n + ' ' + th.many + ' worth?' : 'How many ' + th.parts + ' do ' + n + ' ' + th.many + ' have?'; }

  /* ---------- Watch and My turn clips ---------- */
  function sym(s) { return s.sym ? '<p class="g3-sym">' + s.sym + '</p>' : ''; }
  function view(fig) { return function (s) { return '<div>' + fig(s) + sym(s) + '</div>'; }; }
  /* list = [[line, change to the picture (or a list of changes), ms], ...] */
  function clip(draw, start, list) {
    return { mount: G3.view(view(draw), start), steps: list.map(function (s) {
      var st = { say: s[0], ms: s[2] || 1900 }, p = s[1];
      if (p) st.act = function (t) { return Array.isArray(p) ? t.seq(p, 420) : t.set(p, 700); };
      return st;
    }) };
  }
  function count(key, from, to, extra) { var p = []; for (var i = from; i <= to; i++) { var o = {}; o[key] = i; p.push(put(o, extra ? extra(i) : {})); } return p; }
  function dealCounts(total, k, dealt) { var c = []; for (var i = 0; i < k; i++) c.push(Math.floor(dealt / k) + (i < dealt % k ? 1 : 0)); return c; }
  var platesV = function (s) { return platesFig(s.counts, { pile: s.pile, bags: s.bags }); };
  var dealV = function (s) { return platesFig(dealCounts(s.total, s.k, s.dealt), { pile: s.total - s.dealt }); };
  var bagV = function (s) { return platesFig(same(s.bags, s.size), { bags: true, pile: s.total - s.bags * s.size }); };
  var arrayV = function (s) { return arrayFig(s.r, s.c, { labels: true, split: s.split, parts: s.parts, off: s.off }); };
  var lineV = function (s) { return lineFig(s.k, s.n, { max: s.max, count: s.count }); };
  var twoV = function (s) { return twoLine(s.a, s.b, s.top, s.bot); };
  var chartV = function (s) { return chart100(s.k, { mark: s.mark }); };
  var ratioV = function (s) { var th = THINGS[s.k][s.t || 0]; return ratioFig(th, s.n) + ratioTable(th, s.n, s.k); };
  var stripV = function (s) { return strip(s.k, s.n); };
  var chartXV = function (s) { return chart(s.r, s.c, s.show); };
  function famLines(a, b, k) { var p = a * b, f = [a + X + b + ' = ' + p, b + X + a + ' = ' + p, p + DV + a + ' = ' + b, p + DV + b + ' = ' + a]; return f.slice(0, k).join('<br>'); }
  var famV = function (s) { return arrayFig(s.a, s.b, { labels: true }); };

  /* ---------- skills: one per idea. DEF[id] = [[minLevel, shape, fn(lv), maxLevel], ...], the first is "plain" ---------- */
  var DEF = {}, SKILLS = [];
  function skill(id, name, code, list) { DEF[id] = list; SKILLS.push({ id: id, name: name, code: code }); }
  /* a "Your turn" question: one shape of the idea's own skill, at one level */
  function ck(id, shape, lv) { return function () { var s = DEF[id].filter(function (x) { return x[1] === shape; })[0], q = s[2](lv); q.shape = shape; return q; }; }
  /* meta for an answer worked out from two numbers: op x (times), d (divide), a or b (one of the numbers) */
  function mt(a, b, op, more) { return put({ k: 'g3md-num', a: a, b: b, op: op }, more || {}); }

  /* ======================= Lesson 1: Equal groups ======================= */
  var GOODS = [['bags', 'apples'], ['boxes', 'crayons'], ['vases', 'flowers'], ['plates', 'pieces of bannock'], ['jars', 'paintbrushes'], ['nests', 'eggs'], ['packs', 'hockey cards'], ['bowls', 'blueberries'], ['strings', 'beads']];
  function oddCounts(g, n, d) { var a = same(g, n); a[R.int(0, g - 1)] += d; return a; }
  skill('md-groups', 'Count equal groups', 'B2.6', [
    [1, 'plain', function (lv) {
      var g = rng(lv, GR), n = rng(lv, EA);
      return num('How many counters in all?', g * n, prodFix(g, n), { fig: platesFig(same(g, n)), hint: pl(g, 'plate') + ', ' + n + ' on each. Skip count by ' + n + '.',
        steps: [g + ' equal groups of ' + n + '.', 'Count by ' + n + 's: ' + skips(n, g) + '.'], explain: g + ' groups of ' + n + ' make ' + g * n + '.', meta: { k: 'g3md-fig-total' } });
    }],
    [1, 'story', function (lv) {
      var g = rng(lv, GR), n = rng(lv, EA), c = R.pick(GOODS), who = Q.name();
      return num(who + ' has ' + g + ' ' + c[0] + ' with ' + n + ' ' + c[1] + ' in each. How many ' + c[1] + ' in all?', g * n, prodFix(g, n), {
        hint: g + ' groups of ' + n + '. Skip count by ' + n + '.', steps: [g + ' equal groups of ' + n + '.', 'Count by ' + n + 's: ' + skips(n, g) + '.'], explain: g + ' groups of ' + n + ' make ' + g * n + '.', meta: mt(g, n, 'x') });
    }],
    [1, 'fill', function (lv) {
      var g = rng(lv, GR), n = rng(lv, EA);
      return fill('Fill in the blanks.', '[[]] groups of [[]] make [[]]', [g, n, g * n], { fig: platesFig(same(g, n)), hint: 'Count the plates, then one plate, then all of them.',
        steps: [pl(g, 'plate') + '.', n + ' on each plate.', 'Count by ' + n + 's: ' + skips(n, g) + '.'], explain: g + ' groups of ' + n + ' make ' + g * n + '.', meta: { k: 'g3md-fig-fill' } });
    }],
    [1, 'tap', function (lv) {
      var g = rng(lv, { 1: [2, 3], 2: [3, 4], 3: [4, 4] }), n = rng(lv, EA), sets = R.shuffle([same(g, n), oddCounts(g, n, 1), oddCounts(g, n, -1)]), ans = 0, w = {};
      sets.forEach(function (s, i) { if (s.every(function (x) { return x === s[0]; })) ans = i; else w[String(i)] = 'Count each plate in that one. They are not all the same.'; });
      return { q: 'Tap the picture with <b>equal groups</b>.', type: 'tap', tiles: sets.map(function (s) { return platesFig(s); }), answer: ans, answerText: pl(g, 'plate') + ' with ' + n + ' on each', wrong: w,
        hint: 'Count the counters on every plate.', steps: ['Count each plate.', 'Equal groups: every plate has ' + n + '.'], explain: 'Every plate has ' + n + '.', meta: { k: 'g3md-tap-equal' } };
    }],
    [2, 'tf', function (lv) {
      var g = rng(lv, { 2: [3, 4], 3: [4, 5] }), n = rng(lv, EA), truth = coin(), cs = truth ? same(g, n) : oddCounts(g, n, R.pick([1, -1])), who = Q.name();
      return tf(who + ' says these are ' + g + ' equal groups of ' + n + '. True or false: ' + who + ' is right.', truth, truth ? 'Every plate has ' + n + '.' : 'One plate does not have ' + n + '.',
        ['Groups only need the same number of plates.', 'Any ' + g + ' plates make equal groups.', 'Only the first plate counts.'], truth ? 'Count every plate: each has ' + n + '.' : 'Count every plate. One is different.',
        { fig: platesFig(cs), hint: 'Count each plate.', meta: { k: 'g3md-tf-equal', n: n } });
    }]
  ]);
  function tgGroups(lv) {
    return function () {
      var g = rng(lv, GR), n = rng(lv, EA);
      return { q: 'How many counters in all?', fig: platesFig(same(g, n)), done: g + ' groups of ' + n + ' make ' + g * n + '.', steps: [
        { prompt: 'Count the plates first.', q: num('How many plates?', g, fx([[n, 'That is one plate. Count the plates.']]), { hint: 'Touch each plate as you count.', meta: mt(g, n, 'a') }) },
        { prompt: 'Now count one plate.', q: num('How many on each plate?', n, fx([[g, 'That is the number of plates. Count one plate.']]), { hint: 'Every plate has the same number.', meta: mt(g, n, 'b') }) },
        { prompt: 'Skip count by ' + n + ', once for each plate.', q: num('How many in all?', g * n, prodFix(g, n), { hint: 'Count by ' + n + 's: ' + skips(n, 2) + ', and on.', meta: mt(g, n, 'x') }) }
      ] };
    };
  }

  /* ---------- 3 × 4 means 3 groups of 4 ---------- */
  skill('md-times', 'Write it with ×', 'B2.6', [
    [1, 'plain', function (lv) {
      var g = rng(lv, GR), n = rng(lv, EA);
      return fill('Write the times fact for the picture.', m('[[]]' + X + '[[]] = [[]]'), [g, n, g * n], { fig: platesFig(same(g, n)), hint: 'The first number is how many groups.',
        steps: [pl(g, 'group') + ' of ' + n + '.', g + X + n + ' = ' + g * n + '.'], explain: g + X + n + ' = ' + g * n + '.', meta: { k: 'g3md-fig-fact' } });
    }],
    [1, 'calc', function (lv) {
      var g = rng(lv, GR), n = rng(lv, EA);
      return num('What is ' + m(g + X + n) + '?', g * n, prodFix(g, n), { fig: lv < 3 ? platesFig(same(g, n)) : '', hint: g + X + n + ' is ' + g + ' groups of ' + n + '.',
        steps: [g + ' groups of ' + n + '.', 'Count by ' + n + 's: ' + skips(n, g) + '.'], explain: g + X + n + ' = ' + g * n + '.', meta: { k: 'g3md-bare' } });
    }],
    [1, 'add', function (lv) {
      var g = rng(lv, GR), n = rng(lv, EA);
      var W = [[g + ' + ' + n, 'That adds the two numbers. ' + g + X + n + ' is ' + g + ' groups of ' + n + '.'], [adds(g + 1, n), 'Count the ' + n + 's: there must be ' + g + '.']];
      if (g > 2) W.push([adds(g - 1, n), 'Count the ' + n + 's: there must be ' + g + '.']);
      return mc('Which addition matches ' + m(g + X + n) + '?', adds(g, n), W, { hint: g + ' groups of ' + n + ': add ' + n + ', ' + g + ' times.', steps: [g + X + n + ' is ' + g + ' groups of ' + n + '.', 'Add ' + n + ' ' + g + ' times.'], explain: adds(g, n) + ' = ' + g * n + '.', meta: { k: 'g3md-add-mc', g: g, n: n } });
    }],
    [1, 'tap', function (lv) {
      var p = two(lv, { 1: [2, 4], 2: [2, 5], 3: [3, 5] }, EA), g = p[0], n = p[1], sets = R.shuffle([[g, n], [n, g], [g, n + 1]]), ans = 0, w = {};
      sets.forEach(function (s, i) { if (s[0] === g && s[1] === n) ans = i; else w[String(i)] = 'That one is ' + pl(s[0], 'group') + ' of ' + s[1] + ': ' + s[0] + X + s[1] + '.'; });
      return { q: 'Tap the picture of ' + m(g + X + n) + '.', type: 'tap', tiles: sets.map(function (s) { return platesFig(same(s[0], s[1])); }), answer: ans, answerText: g + ' plates with ' + n + ' on each', wrong: w,
        hint: 'The first number counts the plates.', steps: [g + ' plates.', n + ' on each plate.'], explain: g + X + n + ': ' + g + ' groups of ' + n + '.', meta: { k: 'g3md-tap-plates', g: g, n: n } };
    }],
    [1, 'groups', function (lv) {
      var g = rng(lv, GR), n = rng(lv, EA);
      return fill('How many groups?', m(adds(g, n) + ' = [[]]' + X + n), [g], { hint: 'Count the ' + n + 's.', steps: ['There are ' + g + ' of them.', adds(g, n) + ' = ' + g + X + n + '.'], explain: g + ' groups of ' + n + ': ' + g + X + n + '.', meta: { k: 'g3md-eqs' } });
    }]
  ]);
  function tgTimes(lv) {
    return function () {
      var g = rng(lv, GR), n = rng(lv, EA), W = [[n + X + g + ' = ' + g * n, 'That is ' + n + ' groups of ' + g + '. Count the plates first.'], [g + ' + ' + n + ' = ' + (g + n), 'That adds. The picture shows groups.'], [g + X + (n + 1) + ' = ' + g * (n + 1), 'Count one plate again: ' + n + '.']];
      if (g === n) W[0] = [(g + 1) + X + n + ' = ' + (g + 1) * n, 'Count the plates again: ' + g + '.'];
      return { q: 'Which times fact matches the picture?', fig: platesFig(same(g, n)), done: g + X + n + ' = ' + g * n + ': ' + g + ' groups of ' + n + '.', steps: [
        { prompt: 'The first number counts the groups.', q: num('How many groups?', g, fx([[n, 'That is how many in one group.']]), { hint: 'Count the plates.', meta: mt(g, n, 'a') }) },
        { prompt: 'The second number is how many in each.', q: num('How many in each group?', n, fx([[g, 'That is the number of plates.']]), { hint: 'Count one plate.', meta: mt(g, n, 'b') }) },
        { prompt: 'Groups first, then how many in each.', q: mc('So which fact is it?', g + X + n + ' = ' + g * n, W, { hint: g + ' groups of ' + n + '.', meta: { k: 'g3md-fact-mc', g: g, n: n } }) }
      ] };
    };
  }

  /* ======================= Lesson 2: Arrays ======================= */
  var ROWS = [['A muffin tin has', 'cups'], ['The gym has', 'chairs'], ['A garden in Saskatoon has', 'carrot plants'], ['A window has', 'panes'], ['A box of chocolates has', 'chocolates'], ['The bus has', 'seats']];
  function arrSets(r, c) { var s = [[r, c]]; if (r !== c) s.push([c, r]); s.push([r, c + 1]); if (s.length < 3) s.push([r + 1, c]); return R.shuffle(s); }
  skill('md-array', 'Arrays', 'B2.6', [
    [1, 'plain', function (lv) {
      var r = rng(lv, GR), c = rng(lv, EA);
      return num('How many dots?', r * c, prodFix(r, c), { fig: arrayFig(r, c, { labels: lv === 1 }), hint: 'Count the rows. Count one row. Then skip count.',
        steps: [r + ' rows of ' + c + ': ' + r + X + c + '.', 'Count by ' + c + 's: ' + skips(c, r) + '.'], explain: r + X + c + ' = ' + r * c + '.', meta: { k: 'g3md-arr-total' } });
    }],
    [1, 'fill', function (lv) {
      var r = rng(lv, GR), c = rng(lv, EA);
      return fill('Fill in the blanks.', '[[]] rows of [[]] make [[]]', [r, c, r * c], { fig: arrayFig(r, c), hint: 'Rows go across. Count them going down.',
        steps: [r + ' rows.', c + ' in each row.', r + X + c + ' = ' + r * c + '.'], explain: r + ' rows of ' + c + ' make ' + r * c + '.', meta: { k: 'g3md-arr-fill' } });
    }],
    [1, 'story', function (lv) {
      var r = rng(lv, GR), c = rng(lv, EA), t = R.pick(ROWS);
      return num(t[0] + ' ' + r + ' rows of ' + c + ' ' + t[1] + '. How many ' + t[1] + ' in all?', r * c, prodFix(r, c), { hint: r + ' rows of ' + c + ': ' + r + X + c + '.',
        steps: [r + ' rows of ' + c + '.', 'Count by ' + c + 's: ' + skips(c, r) + '.'], explain: r + X + c + ' = ' + r * c + '.', meta: mt(r, c, 'x') });
    }],
    [1, 'tap', function (lv) {
      var p = two(lv, { 1: [2, 4], 2: [3, 6], 3: [5, 8] }, { 1: [2, 5], 2: [3, 7], 3: [5, 9] }), r = p[0], c = p[1], sets = arrSets(r, c), ans = 0, w = {};
      sets.forEach(function (s, i) { if (s[0] === r && s[1] === c) ans = i; else w[String(i)] = 'That one has ' + s[0] + ' rows of ' + s[1] + '.'; });
      return { q: 'Tap the array for ' + m(r + X + c) + '.', type: 'tap', tiles: sets.map(function (s) { return arrayFig(s[0], s[1]); }), answer: ans, answerText: r + ' rows of ' + c, wrong: w,
        hint: 'The first number is the number of rows.', steps: ['Count the rows going down: ' + r + '.', 'Count one row: ' + c + '.'], explain: r + X + c + ': ' + r + ' rows of ' + c + '.', meta: { k: 'g3md-tap-arr', a: r, b: c } };
    }],
    [2, 'tf', function (lv) {
      var r = rng(lv, GR), c = rng(lv, EA), who = Q.name(), truth = coin(), s = truth ? [r, c] : R.pick([[r, c + 1], [r + 1, c], [r - 1, c]]);
      return tf(who + ' says this array shows ' + m(s[0] + X + s[1]) + '. True or false: ' + who + ' is right.', truth, 'It has ' + r + ' rows of ' + c + ': ' + r + X + c + '.',
        ['Any array with about that many dots matches.', 'Count the dots in one row only.', 'The rows do not matter.'], 'Count the rows, then one row.', { fig: arrayFig(r, c), hint: 'Count the rows going down.', meta: { k: 'g3md-tf-arr', a: s[0], b: s[1] } });
    }]
  ]);
  function tgArray(lv) {
    return function () {
      var r = rng(lv, GR), c = rng(lv, EA);
      return { q: 'How many dots in the array?', fig: arrayFig(r, c, { labels: lv === 1 }), done: r + ' rows of ' + c + ': ' + r + X + c + ' = ' + r * c + '.', steps: [
        { prompt: 'Rows go across. Count them going down.', q: num('How many rows?', r, fx([[c, 'That is how many in one row. Count the rows.']]), { hint: 'Point to each row.', meta: mt(r, c, 'a') }) },
        { prompt: 'Count the dots in one row.', q: num('How many in each row?', c, fx([[r, 'That is the number of rows.']]), { hint: 'Count across the top row.', meta: mt(r, c, 'b') }) },
        { prompt: 'Skip count by ' + c + ', once for each row.', q: num(m(r + X + c) + ' = ?', r * c, prodFix(r, c), { hint: 'Count by ' + c + 's.', meta: mt(r, c, 'x') }) }
      ] };
    };
  }

  /* ---------- turn-around facts ---------- */
  skill('md-turn', 'Turn-around facts', 'B2.1', [
    [1, 'plain', function (lv) {
      var p = two(lv, GR, EA), a = p[0], b = p[1];
      return num(m(a + X + b + ' = ' + a * b) + '. What is ' + m(b + X + a) + '?', a * b, fx([[a * b + a, 'Turn it around: the dots stay the same.'], [a * b - a, 'Turn it around: the dots stay the same.'], [a + b, 'You added. Turn the array: same dots.']]), {
        hint: 'Turn the array on its side.', steps: [b + X + a + ' is the same array, turned.', 'Same dots: ' + a * b + '.'], explain: b + X + a + ' = ' + a * b + '.', meta: mt(b, a, 'x') });
    }],
    [1, 'fill', function (lv) {
      var p = two(lv, GR, EA), a = p[0], b = p[1];
      return fill('Fill in the blanks.', m(a + X + b + ' = [[]]' + X + a + ' = [[]]'), [b, a * b], { hint: 'Turn it around: swap the numbers.', steps: [a + X + b + ' = ' + b + X + a + '.', 'Both are ' + a * b + '.'], explain: a + X + b + ' = ' + b + X + a + ' = ' + a * b + '.', meta: { k: 'g3md-eqs' } });
    }],
    [1, 'picture', function (lv) {
      var p = two(lv, GR, EA), a = p[0], b = p[1];
      return num('This is ' + m(a + X + b) + '. Turn it on its side: ' + b + ' rows of ' + a + '. How many dots?', a * b, fx([[a + b, 'Turning does not change the dots. Count them.']]), { fig: arrayFig(a, b), hint: 'Turning it does not add or take away dots.',
        steps: ['The dots stay the same.', a + X + b + ' = ' + a * b + ', so ' + b + X + a + ' = ' + a * b + '.'], explain: b + X + a + ' = ' + a * b + '.', meta: { k: 'g3md-arr-total' } });
    }],
    [2, 'tf', function (lv) {
      var p = two(lv, GR, EA), a = p[0], b = p[1], who = Q.name(), truth = coin(), said = truth ? a * b : a * b + R.pick([a, -a, b]);
      return tf(who + ' knows ' + m(a + X + b + ' = ' + a * b) + '. ' + who + ' says ' + m(b + X + a + ' = ' + said) + '. True or false: ' + who + ' is right.', truth, 'Turn-around facts have the same answer: ' + a * b + '.',
        ['Turn-around facts are always one group more.', 'The bigger number first makes more.', 'You cannot turn a fact around.'], 'Turn the array: the dots stay the same.', { hint: 'Picture the array turned.', meta: { k: 'g3md-tf', a: b, b: a, op: 'x', said: said } });
    }],
    [2, 'match', function (lv) {
      var P = pairs3(function () { var q = two(lv, GR, EA); return [q[0] + X + q[1], q[1] + X + q[0]]; });
      return { q: 'Match each fact to its turn-around fact.', type: 'match', pairs: P, hint: 'Swap the two numbers.', steps: ['3 &times; 7 turns around to 7 &times; 3.'], explain: P.map(function (x) { return x[0] + ' = ' + x[1]; }).join('. ') + '.', meta: { k: 'g3md-match-turn' } };
    }]
  ]);
  function tgTurn(lv) {
    return function () {
      var p = two(lv, GR, EA), a = p[0], b = p[1];
      return { q: m(a + X + b + ' = ' + a * b) + '. Find ' + m(b + X + a) + '.', fig: arrayFig(a, b, { labels: true }), done: b + X + a + ' = ' + a * b + ': the same dots, turned.', steps: [
        { prompt: 'Turn the array on its side. The columns become rows.', q: num('How many rows now?', b, fx([[a, 'That was before the turn. Now there are ' + b + ' rows.']]), { hint: 'Each column becomes a row.', meta: mt(a, b, 'b') }) },
        { prompt: 'Each new row has one dot from each old row.', q: num('How many in each row now?', a, fx([[b, 'That is the number of rows now.']]), { hint: 'Count the old rows.', meta: mt(a, b, 'a') }) },
        { prompt: 'The dots did not change.', q: num(m(b + X + a) + ' = ?', a * b, fx([[a + b, 'You added. The dots stay the same.']]), { hint: a + X + b + ' = ' + a * b + '.', meta: mt(b, a, 'x') }) }
      ] };
    };
  }

  /* ---------- split a hard fact ---------- */
  var SP = { 1: [6, 7], 2: [6, 8], 3: [7, 9] }, SPC = { 1: [2, 5], 2: [3, 7], 3: [6, 10] };
  skill('md-split', 'Split a hard fact', 'B2.1, B2.6', [
    [1, 'plain', function (lv) {
      var r = rng(lv, SP), c = rng(lv, SPC), s = 5;
      return fill('Find each part, then add.', m('[[]] + [[]] = [[]]'), [s * c, (r - s) * c, r * c], { fig: arrayFig(r, c, { labels: true, split: s }), hint: 'Top part first, then the bottom part.',
        steps: ['Top: ' + s + X + c + ' = ' + s * c + '.', 'Bottom: ' + (r - s) + X + c + ' = ' + (r - s) * c + '.', s * c + ' + ' + (r - s) * c + ' = ' + r * c + '.'], explain: r + X + c + ' = ' + r * c + '.', meta: { k: 'g3md-split-fill' } });
    }],
    [1, 'num', function (lv) {
      var r = rng(lv, SP), c = rng(lv, SPC), s = 5;
      return num('Use ' + m(s + X + c + ' = ' + s * c) + ' and ' + m((r - s) + X + c + ' = ' + (r - s) * c) + ' to find ' + m(r + X + c) + '.', r * c, fx([[s * c, 'That is only the top part. Add the bottom part.'], [(r - s) * c, 'That is only the bottom part. Add the top part.'], [s * c + r - s, 'Add the whole bottom part: ' + (r - s) * c + '.']]), {
        hint: 'Add the two parts.', steps: [s * c + ' + ' + (r - s) * c + '.', '= ' + r * c + '.'], explain: r + X + c + ' = ' + r * c + '.', meta: mt(r, c, 'x') });
    }],
    [1, 'parts', function (lv) {
      var r = rng(lv, SP), c = rng(lv, SPC), s = 5;
      return fill('Fill in the blanks.', m(r + X + c + ' = ' + s + X + c + ' + [[]]' + X + c + ' = [[]]'), [r - s, r * c], { fig: lv < 3 ? arrayFig(r, c, { split: s }) : '', hint: r + ' rows is ' + s + ' rows and ' + (r - s) + ' more.',
        steps: [r + ' = ' + s + ' + ' + (r - s) + '.', s * c + ' + ' + (r - s) * c + ' = ' + r * c + '.'], explain: r + X + c + ' = ' + r * c + '.', meta: { k: 'g3md-eqs' } });
    }],
    [2, 'mc', function (lv) {
      var r = rng(lv, SP), c = rng(lv, SPC), s = 5;
      return mc('Split ' + m(r + X + c) + ' after ' + s + ' rows. What is the other part?', (r - s) + X + c, [[(r - s + 1) + X + c, 'Count the rows below the line: ' + (r - s) + '.'], [r + X + c, 'That is the whole array, not the part.'], [(r - s) + ' + ' + c, 'The part is ' + (r - s) + ' rows of ' + c + '.']], {
        fig: arrayFig(r, c, { split: s }), hint: 'How many rows are below the line?', steps: [r + ' rows = ' + s + ' rows + ' + (r - s) + ' rows.'], explain: 'The other part is ' + (r - s) + X + c + '.', meta: { k: 'g3md-split-mc', r: r, c: c, s: s } });
    }],
    [2, 'tf', function (lv) {
      var r = rng(lv, SP), c = rng(lv, SPC), s = 5, who = Q.name(), kind = R.pick([0, 0, 1, 2]), bottom = kind === 1 ? r - s : (r - s) * c, said = s * c + bottom + (kind === 2 ? c : 0);
      return tf(who + ' splits ' + m(r + X + c) + ' into ' + m(s + X + c) + ' and ' + m((r - s) + X + c) + '. ' + who + ' says ' + m(r + X + c + ' = ' + said) + '. True or false: ' + who + ' is right.', said === r * c,
        s * c + ' + ' + (r - s) * c + ' = ' + r * c + '.', ['Splitting changes the answer.', 'You only need the top part.', 'Add the row numbers.'], 'Work out each part again: ' + s + X + c + ' and ' + (r - s) + X + c + '.', { hint: 'Check both parts.', meta: { k: 'g3md-tf', a: r, b: c, op: 'x', said: said } });
    }]
  ]);
  function tgSplit(lv) {
    return function () {
      var r = rng(lv, SP), c = rng(lv, SPC), s = 5;
      return { q: 'Find ' + m(r + X + c) + ' by splitting it.', fig: arrayFig(r, c, { labels: true, split: s }), done: s * c + ' + ' + (r - s) * c + ' = ' + r * c + '. So ' + r + X + c + ' = ' + r * c + '.', steps: [
        { prompt: 'Start with the top part: a fact of 5.', q: num(m(s + X + c) + ' = ?', s * c, prodFix(s, c), { hint: 'Count by ' + c + 's five times.', meta: mt(s, c, 'x') }) },
        { prompt: 'Now the rows below the line.', q: num(m((r - s) + X + c) + ' = ?', (r - s) * c, prodFix(r - s, c), { hint: (r - s) + ' rows of ' + c + '.', meta: mt(r - s, c, 'x') }) },
        { prompt: 'Add the two parts.', q: num(m(r + X + c) + ' = ?', r * c, fx([[s * c, 'Add the bottom part too.'], [(r - s) * c, 'Add the top part too.']]), { hint: s * c + ' + ' + (r - s) * c + '.', meta: mt(r, c, 'x') }) }
      ] };
    };
  }

  /* ======================= Lesson 3: Facts of 2, 5 and 10 ======================= */
  var NJ = { 1: [2, 5], 2: [2, 7], 3: [6, 10] };
  function edge(k) { return function (v) { return v === 0 || v === k; }; }
  var HOPS = [
    function (w, n, k) { return w + ' saves ' + k + '&cent; each day for ' + n + ' days. How many cents is that?'; },
    function (w, n, k) { return w + ' reads ' + k + ' pages each night for ' + n + ' nights. How many pages?'; },
    function (w, n, k) { return w + ' walks ' + k + ' blocks each day for ' + n + ' days. How many blocks?'; },
    function (w, n, k) { return w + ' plants ' + n + ' rows of beans with ' + k + ' in each row. How many beans?'; },
    function (w, n, k) { return w + ' stacks ' + n + ' towers of ' + k + ' cubes. How many cubes?'; }
  ];
  skill('md-skip', 'Jump to multiply', 'B2.2', [
    [1, 'plain', function (lv) {
      var k = R.pick(K1[lv]), n = rng(lv, NJ);
      return num(m(n + X + k) + ' is ' + n + ' jumps of ' + k + '. Where do you land?', n * k, prodFix(n, k), { fig: lineFig(k, n, { show: edge(k), dot: false }), hint: 'Count by ' + k + 's, one for each jump.',
        steps: ['Count by ' + k + 's: ' + skips(k, n) + '.', 'You land on ' + n * k + '.'], explain: n + X + k + ' = ' + n * k + '.', meta: mt(n, k, 'x') });
    }],
    [1, 'line', function (lv) {
      var k = R.pick(K1[lv]), n = rng(lv, NJ);
      return { q: 'Show ' + m(n + X + k) + ': ' + n + ' jumps of ' + k + ' from 0. Put the marker where you land.', type: 'line', min: 0, max: k * 10, tick: k, every: k * 2, snap: k, answer: n * k,
        hint: 'Each jump is ' + k + '. Make ' + n + ' jumps.', steps: ['Count by ' + k + 's: ' + skips(k, n) + '.'], explain: n + X + k + ' = ' + n * k + '.', meta: { k: 'g3md-line', a: n, b: k, op: 'x' } };
    }],
    [1, 'count', function (lv) {
      var k = R.pick(K1[lv]), s0 = lv === 1 ? 1 : R.int(lv === 2 ? 1 : 3, 6), gaps = lv === 1 ? [2, 4] : lv === 2 ? [1, 3] : [0, 3], seq = [];
      for (var i = 0; i < 5; i++) seq.push(k * (s0 + i));
      return fill('Count by ' + k + 's. Fill in the missing numbers.', m(seq.map(function (v, i) { return gaps.indexOf(i) >= 0 ? '[[]]' : String(v); }).join(', ')), gaps.map(function (i) { return seq[i]; }), {
        hint: 'Each number is ' + k + ' more than the one before.', steps: ['Add ' + k + ' each time.', seq.join(', ') + '.'], explain: seq.join(', ') + '.', meta: { k: 'g3md-skipfill', f: k } });
    }],
    [1, 'story', function (lv) {
      var k = R.pick(K1[lv]), n = rng(lv, NJ);
      return num(R.pick(HOPS)(Q.name(), n, k), n * k, prodFix(n, k), { hint: n + ' groups of ' + k + ': count by ' + k + 's.', steps: [n + X + k + '.', 'Count by ' + k + 's: ' + skips(k, n) + '.'], explain: n + X + k + ' = ' + n * k + '.', meta: mt(n, k, 'x') });
    }],
    [2, 'tf', function (lv) {
      var k = R.pick(K1[lv]), n = rng(lv, NJ), who = Q.name(), truth = coin(), said = truth ? n * k : R.pick([n * k + k, n * k - k, n + k]);
      return tf(who + ' says ' + m(n + X + k + ' = ' + said) + '. True or false: ' + who + ' is right.', truth, n + ' jumps of ' + k + ': ' + skips(k, n) + '.', ['Add ' + n + ' and ' + k + '.', 'Stop one jump early.', 'Any number that ends in 0 is right.'],
        'Count the jumps: ' + n + ' jumps of ' + k + '.', { fig: lv === 2 ? lineFig(k, n, { show: edge(k), dot: false }) : '', hint: 'Count by ' + k + 's and keep track of the jumps.', meta: { k: 'g3md-tf', a: n, b: k, op: 'x', said: said } });
    }]
  ]);
  function tgSkip(lv) {
    return function () {
      var k = R.pick(K1[lv]), n = rng(lv, NJ);
      return { q: 'Find ' + m(n + X + k) + ' on the number line.', fig: lineFig(k, 0, { show: edge(k) }), done: n + ' jumps of ' + k + ' land on ' + n * k + '.', steps: [
        { prompt: 'The second number is the size of each jump.', q: num('How big is each jump?', k, fx([[n, 'That is how many jumps.']]), { hint: n + X + k + ': jumps of ' + k + '.', meta: mt(n, k, 'b') }) },
        { prompt: 'The first number is how many jumps.', q: num('How many jumps?', n, fx([[k, 'That is the size of each jump.']]), { hint: n + ' groups of ' + k + '.', meta: mt(n, k, 'a') }) },
        { prompt: 'Count by ' + k + 's, ' + n + ' times.', q: num('Where do you land?', n * k, prodFix(n, k), { hint: skips(k, 2) + ', and on.', meta: mt(n, k, 'x') }) }
      ] };
    };
  }

  /* ---------- turn it to use 2s, 5s or 10s ---------- */
  var TN = { 1: [3, 5], 2: [3, 7], 3: [6, 9] };
  function tcase(lv) { var k = R.pick(K1[lv]), n = rng(lv, TN); if (n === k) n++; return [k, n]; }
  skill('md-useturn', 'Turn it to use 2s, 5s or 10s', 'B2.2, B2.1', [
    [1, 'plain', function (lv) {
      var t = tcase(lv), k = t[0], n = t[1];
      return num('What is ' + m(k + X + n) + '?', k * n, prodFix(k, n), { hint: 'Turn it around: ' + n + X + k + '. Count by ' + k + 's.', steps: [k + X + n + ' = ' + n + X + k + '.', 'Count by ' + k + 's, ' + n + ' times: ' + skips(k, n) + '.'], explain: k + X + n + ' = ' + k * n + '.', meta: { k: 'g3md-bare' } });
    }],
    [1, 'fill', function (lv) {
      var t = tcase(lv), k = t[0], n = t[1];
      return fill('Turn it around, then find it.', m(k + X + n + ' = ' + n + X + '[[]] = [[]]'), [k, k * n], { hint: 'Swap the numbers. Then count by ' + k + 's.', steps: [k + X + n + ' = ' + n + X + k + '.', skips(k, n) + '.'], explain: k + X + n + ' = ' + k * n + '.', meta: { k: 'g3md-eqs' } });
    }],
    [1, 'picture', function (lv) {
      var t = tcase(lv), k = t[0], n = t[1];
      return num(m(k + X + n) + ' and ' + m(n + X + k) + ' land in the same place. Where?', k * n, prodFix(n, k), { fig: twoLine(k, n, k, n, true), hint: 'Count the jumps of ' + k + ' on the bottom line.', steps: ['Bottom line: ' + skips(k, n) + '.', 'Both land on ' + k * n + '.'], explain: k + X + n + ' = ' + n + X + k + ' = ' + k * n + '.', meta: mt(k, n, 'x') });
    }],
    [1, 'which', function (lv) {
      var t = tcase(lv), k = t[0], n = t[1];
      return mc(m(k + X + n + ' = ' + n + X + k) + '. Which is the easy way to find it?', 'Count by ' + k + 's, ' + n + ' times', [['Count by ' + k + 's, ' + k + ' times', 'Count by ' + k + 's once for each group: ' + n + ' groups.'], ['Count by ' + n + 's, ' + n + ' times', 'That makes ' + n + X + n + '.'], ['Count by 1s, ' + n + ' times', 'That only reaches ' + n + '.']], {
        hint: n + X + k + ' is ' + n + ' jumps of ' + k + '.', steps: ['Turn it: ' + n + X + k + '.', 'Count by ' + k + 's, ' + n + ' times.'], explain: 'Count by ' + k + 's, ' + n + ' times: ' + k * n + '.', meta: { k: 'g3md-useturn-mc', f: k, n: n } });
    }],
    [2, 'tf', function (lv) {
      var t = tcase(lv), k = t[0], n = t[1], who = Q.name(), truth = coin(), said = truth ? k * n : R.pick([k * n + k, k * n - k, k * n + n]);
      return tf(who + ' turns ' + m(k + X + n) + ' into ' + m(n + X + k) + ' and gets ' + said + '. True or false: ' + who + ' is right.', truth, n + ' jumps of ' + k + ': ' + skips(k, n) + '.', ['Turning a fact changes the answer.', 'Count by ' + n + 's, ' + k + ' times, then add 1.', 'Add the two numbers.'],
        'Count by ' + k + 's, ' + n + ' times.', { hint: 'Count by ' + k + 's and keep track.', meta: { k: 'g3md-tf', a: k, b: n, op: 'x', said: said } });
    }]
  ]);
  function tgUseturn(lv) {
    return function () {
      var t = tcase(lv), k = t[0], n = t[1];
      return { q: 'Find ' + m(k + X + n) + '.', fig: twoLine(k, n, 0, 0, true), done: k + X + n + ' = ' + n + X + k + ' = ' + k * n + '.', steps: [
        { prompt: k + ' jumps of ' + n + ' is hard. Turn it around.', q: mc('Which fact has the same answer?', n + X + k, [[k + ' + ' + n, 'That adds. Turn the numbers around.'], [k + X + k, 'Swap the two numbers.'], [n + X + n, 'Swap the two numbers.']], { hint: 'Swap the two numbers.', meta: { k: 'g3md-turn-mc', a: k, b: n } }) },
        { prompt: 'Now it is ' + n + ' jumps of ' + k + '.', q: num('How many jumps of ' + k + '?', n, fx([[k, 'That is the size of each jump.']]), { hint: n + X + k + '.', meta: mt(k, n, 'b') }) },
        { prompt: 'Count by ' + k + 's, ' + n + ' times.', q: num(m(k + X + n) + ' = ?', k * n, prodFix(n, k), { hint: skips(k, 2) + ', and on.', meta: mt(k, n, 'x') }) }
      ] };
    };
  }

  /* ---------- patterns in the facts ---------- */
  var ENDS = ['0 or 5', '0, 2, 4, 6 or 8', '0 only'], ENDK = { 5: 0, 2: 1, 10: 2 };
  function notFact(k) { var v; do { v = R.int(3, k * 10); } while (v % k === 0); return v; }
  skill('md-pattern', 'Patterns in the facts', 'B2.2', [
    [1, 'plain', function (lv) {
      var k = R.pick([2, 5, 10]), down = lv === 3, i0 = down ? R.int(5, 10) : R.int(1, lv === 1 ? 5 : 7), d = down ? -1 : 1, a = [i0, i0 + d, i0 + 2 * d].map(function (i) { return i * k; }), nx = (i0 + 3 * d) * k;
      return num('The facts of ' + k + ' go ' + m(a.join(', ')) + '. What comes next?', nx, fx([[nx - d * k + d, 'Facts of ' + k + ' go ' + (down ? 'down' : 'up') + ' by ' + k + ', not by 1.']]), { hint: (down ? 'Take away ' : 'Add ') + k + '.', steps: [a.join(', ') + ' go ' + (down ? 'down' : 'up') + ' by ' + k + '.', 'Next: ' + nx + '.'], explain: a.join(', ') + ', ' + nx + '.', meta: { k: 'g3md-next' } });
    }],
    [1, 'tens', function (lv) {
      var n = rng(lv, { 1: [2, 9], 2: [2, 9], 3: [3, 9] }), k = lv === 3 ? R.pick([5, 2]) : 10;
      var f = lv === 1 ? [n + X + '10 = [[]]', [10 * n]] : [ '[[]]' + X + k + ' = ' + n * k, [n]];
      return fill('Fill in the blank.', m(f[0]), f[1], { hint: k === 10 ? 'Facts of 10 end in 0: ' + n + ' tens.' : 'Count by ' + k + 's to ' + n * k + '.', steps: [skips(k, n) + '.', n + X + k + ' = ' + n * k + '.'], explain: n + X + k + ' = ' + n * k + '.', meta: { k: 'g3md-eqs' } });
    }],
    [1, 'double', function (lv) {
      var n = rng(lv, { 1: [2, 5], 2: [3, 7], 3: [6, 10] });
      return fill('Facts of 2 are doubles.', m('2' + X + n + ' = ' + n + ' + ' + n + ' = [[]]'), [2 * n], { hint: 'Double ' + n + '.', steps: ['2 groups of ' + n + ': ' + n + ' + ' + n + '.', '= ' + 2 * n + '.'], explain: '2' + X + n + ' = ' + 2 * n + '.', meta: { k: 'g3md-eqs' } });
    }],
    [1, 'pick', function (lv) {
      var k = lv === 1 ? R.pick([2, 10]) : R.pick([5, 2, 10]), seen = {}, opts = [];
      while (opts.length < 5) { var v = opts.length < 2 ? k * R.int(lv === 3 ? 4 : 1, 10) : notFact(k); if (!seen[v]) { seen[v] = 1; opts.push(v); } }
      opts = R.shuffle(opts);
      var ans = []; opts.forEach(function (v, j) { if (v % k === 0) ans.push(j); });
      return { q: 'Pick <b>every</b> fact of ' + k + '.', type: 'pick', options: opts.map(String), answer: ans, hint: 'Facts of ' + k + ' end in ' + ENDS[ENDK[k]] + '.', steps: ['Facts of ' + k + ': ' + skips(k, 10) + '.'],
        explain: ans.map(function (j) { return opts[j]; }).join(' and ') + ' are facts of ' + k + '.', meta: { k: 'g3md-pick-mult', f: k } };
    }],
    [2, 'tf', function (lv) {
      var k = R.pick([2, 5, 10]), truth = coin(), v = truth ? k * R.int(lv === 3 ? 6 : 2, 10) : notFact(k), who = Q.name();
      return tf(who + ' says ' + v + ' is a fact of ' + k + '. True or false: ' + who + ' is right.', truth, 'Facts of ' + k + ' end in ' + ENDS[ENDK[k]] + '. ' + v + (truth ? ' does.' : ' does not.'),
        ['Every number under ' + (10 * k + 1) + ' is a fact of ' + k + '.', 'Only odd numbers are facts.', 'Look at the first digit only.'], 'Look at the last digit of ' + v + '.', { hint: 'Look at the last digit.', meta: { k: 'g3md-tf-mult', f: k, v: v } });
    }]
  ]);
  function tgPattern(k) {
    return function () {
      var truth = coin(), v = truth ? k * R.int(2, 10) : notFact(k);
      return { q: 'Is ' + v + ' a fact of ' + k + '?', fig: chart100(0, { mark: v }), done: v + (truth ? ' is' : ' is not') + ' a fact of ' + k + '.', steps: [
        { prompt: 'Look at the last digit.', q: num('What is the last digit of ' + v + '?', v % 10, {}, { hint: 'The ones digit.', meta: mt(v, 10, '%') }) },
        { prompt: 'Each set of facts ends the same way.', q: fixed('Facts of ' + k + ' end in…', ENDS, ENDK[k], ['Facts of 5 go 5, 10, 15, 20.', 'Facts of 2 go 2, 4, 6, 8, 10.', 'Facts of 10 go 10, 20, 30.'], { hint: 'Say the first few: ' + skips(k, 4) + '.', meta: { k: 'g3md-ends', f: k } }) },
        { prompt: 'Does ' + v + ' end that way?', q: fixed('So is ' + v + ' a fact of ' + k + '?', ['Yes', 'No'], truth ? 0 : 1, ['Check the last digit again.', 'Check the last digit again.'], { hint: 'Compare the last digit.', meta: { k: 'g3md-yn-mult', f: k, v: v } }) }
      ] };
    };
  }

  /* ---------- one group more or less ---------- */
  function ncase(lv) { var o = R.pick({ 1: [[2, 3], [5, 6]], 2: [[5, 4], [5, 6], [2, 3]], 3: [[10, 9], [5, 6], [5, 4], [10, 9]] }[lv]); return { base: o[0], r: o[1], c: rng(lv, EA), up: o[1] > o[0] }; }
  function nearFig(n) { return n.up ? arrayFig(n.r, n.c, { labels: true, split: n.base }) : arrayFig(n.base, n.c, { labels: true, off: n.r }); }
  skill('md-near', 'One group more or less', 'B2.2, B2.1', [
    [1, 'plain', function (lv) {
      var n = ncase(lv), bc = n.base * n.c, d = n.up ? 1 : -1;
      return num('You know ' + m(n.base + X + n.c + ' = ' + bc) + '. What is ' + m(n.r + X + n.c) + '?', n.r * n.c, fx([[bc + d, (n.up ? 'Add' : 'Take away') + ' a whole group of ' + n.c + ', not 1.'], [bc, 'That is ' + n.base + X + n.c + '. ' + n.r + ' groups is one ' + (n.up ? 'more' : 'less') + '.']]), {
        hint: n.r + ' groups is one group ' + (n.up ? 'more' : 'less') + ' than ' + n.base + '.', steps: [bc + (n.up ? ' + ' : MI) + n.c + '.', '= ' + n.r * n.c + '.'], explain: n.r + X + n.c + ' = ' + n.r * n.c + '.', meta: mt(n.r, n.c, 'x') });
    }],
    [1, 'fill', function (lv) {
      var n = ncase(lv);
      return fill('Fill in the blanks.', m(n.r + X + n.c + ' = ' + n.base + X + n.c + (n.up ? ' + ' : MI) + '[[]] = [[]]'), [n.c, n.r * n.c], { hint: 'One group of ' + n.c + (n.up ? ' more.' : ' less.'),
        steps: [n.base + X + n.c + ' = ' + n.base * n.c + '.', n.base * n.c + (n.up ? ' + ' : MI) + n.c + ' = ' + n.r * n.c + '.'], explain: n.r + X + n.c + ' = ' + n.r * n.c + '.', meta: { k: 'g3md-eqs' } });
    }],
    [1, 'picture', function (lv) {
      var n = ncase(lv);
      return num(m(n.base + X + n.c + ' = ' + n.base * n.c) + '. ' + (n.up ? 'Add one more row of ' + n.c + '. How many dots?' : 'Take away the dashed row. How many dots are left?'), n.r * n.c, fx([[n.base * n.c + (n.up ? 1 : -1), 'A row is ' + n.c + ' dots, not 1.']]), {
        fig: nearFig(n), hint: 'One row is ' + n.c + ' dots.', steps: [n.base * n.c + (n.up ? ' + ' : MI) + n.c + '.', '= ' + n.r * n.c + '.'], explain: n.r + X + n.c + ' = ' + n.r * n.c + '.', meta: { k: 'g3md-arr-total' } });
    }],
    [2, 'mc', function (lv) {
      var n = ncase(lv), dir = n.up ? 'add ' : 'take away ', other = n.up ? 'take away ' : 'add ', F = m(n.base + X + n.c) + ', then ';
      return mc('Which helps you find ' + m(n.r + X + n.c) + '?', F + dir + n.c, [[F + dir + '1', 'Each group is ' + n.c + ', not 1.'], [F + other + n.c, n.r + ' is one ' + (n.up ? 'more' : 'less') + ' than ' + n.base + '.'], [F + dir + n.base, 'One group is ' + n.c + '.']], {
        fig: nearFig(n), hint: n.r + ' groups is one group ' + (n.up ? 'more' : 'less') + ' than ' + n.base + '.', steps: [n.base + X + n.c + ' = ' + n.base * n.c + '.', (n.up ? 'Add ' : 'Take away ') + n.c + ': ' + n.r * n.c + '.'], explain: n.r + X + n.c + ' = ' + n.r * n.c + '.', meta: { k: 'g3md-near-mc', r: n.r, c: n.c } });
    }],
    [2, 'tf', function (lv) {
      var n = ncase(lv), who = Q.name(), truth = coin(), bc = n.base * n.c, said = truth ? n.r * n.c : R.pick([bc + (n.up ? 1 : -1), bc + (n.up ? -n.c : n.c)]);
      return tf(who + ' knows ' + m(n.base + X + n.c + ' = ' + bc) + '. ' + who + ' says ' + m(n.r + X + n.c + ' = ' + said) + '. True or false: ' + who + ' is right.', truth, bc + (n.up ? ' + ' : MI) + n.c + ' = ' + n.r * n.c + '.',
        ['Add or take away 1.', 'The answer stays ' + bc + '.', 'Add the two numbers.'], (n.up ? 'Add' : 'Take away') + ' one whole group of ' + n.c + '.', { hint: 'One group is ' + n.c + '.', meta: { k: 'g3md-tf', a: n.r, b: n.c, op: 'x', said: said } });
    }]
  ]);
  function tgNear(lv) {
    return function () {
      var n = ncase(lv), bc = n.base * n.c;
      return { q: 'Find ' + m(n.r + X + n.c) + ' from a fact you know.', fig: nearFig(n), done: bc + (n.up ? ' + ' : MI) + n.c + ' = ' + n.r * n.c + '.', steps: [
        { prompt: 'Start with a fact of ' + n.base + '.', q: num(m(n.base + X + n.c) + ' = ?', bc, prodFix(n.base, n.c), { hint: 'Count by ' + n.c + 's, ' + n.base + ' times.', meta: mt(n.base, n.c, 'x') }) },
        { prompt: 'Compare ' + n.r + ' groups with ' + n.base + ' groups.', q: fixed('Is ' + m(n.r + X + n.c) + ' one group more or one group less?', ['One group of ' + n.c + ' more', 'One group of ' + n.c + ' less'], n.up ? 0 : 1, ['Is ' + n.r + ' more or less than ' + n.base + '?', 'Is ' + n.r + ' more or less than ' + n.base + '?'], { hint: n.r + ' or ' + n.base + ': which is more?', meta: { k: 'g3md-near-dir', r: n.r, base: n.base } }) },
        { prompt: (n.up ? 'Add' : 'Take away') + ' one group of ' + n.c + '.', q: num(m(n.r + X + n.c) + ' = ?', n.r * n.c, fx([[bc + (n.up ? 1 : -1), 'One group is ' + n.c + ', not 1.']]), { hint: bc + (n.up ? ' + ' : MI) + n.c + '.', meta: mt(n.r, n.c, 'x') }) }
      ] };
    };
  }

  /* ======================= Lesson 4: Dividing ======================= */
  var SK = { 1: [2, 5], 2: [2, 6], 3: [6, 10] }, SE = { 1: [2, 5], 2: [3, 7], 3: [4, 10] };
  var SHARES = [
    function (w, n, k) { return w + ' shares ' + n + ' hockey cards equally among ' + k + ' friends. How many cards does each friend get?'; },
    function (w, n, k) { return w + ' puts ' + n + ' strawberries into ' + k + ' bowls, the same number in each. How many in each bowl?'; },
    function (w, n, k) { return w + ' has ' + n + ' beads for ' + k + ' bracelets. Each bracelet gets the same number. How many beads on each?'; },
    function (w, n, k) { return w + ' shares ' + n + ' pieces of maple taffy equally among ' + k + ' cousins. How many pieces each?'; }
  ];
  function unfair(k, e) { var a = same(k, e); a[0] += 1; a[1] -= 1; return R.shuffle(a); }
  skill('md-share', 'Share fairly', 'B2.6', [
    [1, 'plain', function (lv) {
      var k = rng(lv, SK), e = rng(lv, SE), n = k * e;
      return num('Share ' + n + ' counters on ' + k + ' plates. How many on each plate?', e, divFix(n, k), { fig: platesFig(same(k, 0), { pile: n }), hint: 'Deal one to each plate, again and again.',
        steps: ['Deal them out: one to each plate each round.', 'Each plate gets ' + e + '.', 'Check: ' + k + X + e + ' = ' + n + '.'], explain: n + DV + k + ' = ' + e + '.', meta: { k: 'g3md-share-fig' } });
    }],
    [1, 'story', function (lv) {
      var k = rng(lv, SK), e = rng(lv, SE), n = k * e;
      return num(R.pick(SHARES)(Q.name(), n, k), e, divFix(n, k), { hint: k + ' groups of how many make ' + n + '?', steps: ['Think: ' + k + X + '? = ' + n + '.', k + X + e + ' = ' + n + '.'], explain: n + DV + k + ' = ' + e + '.', meta: mt(n, k, 'd') });
    }],
    [1, 'bare', function (lv) {
      var k = rng(lv, SK), e = rng(lv, SE), n = k * e;
      return num('What is ' + m(n + DV + k) + '?', e, divFix(n, k), { fig: lv === 1 ? platesFig(same(k, 0)) : '', hint: 'Share ' + n + ' into ' + k + ' equal groups.', steps: ['Think: ' + k + ' groups of what make ' + n + '?', k + X + e + ' = ' + n + '.'], explain: n + DV + k + ' = ' + e + '.', meta: { k: 'g3md-bare' } });
    }],
    [1, 'tap', function (lv) {
      var k = rng(lv, { 1: [2, 3], 2: [3, 4], 3: [4, 5] }), e = rng(lv, SE), n = k * e, sets = R.shuffle([same(k, e), unfair(k, e), same(k, e + 1)]), ans = 0, w = {};
      sets.forEach(function (s, i) { var t = s.reduce(function (a, b) { return a + b; }, 0); if (t === n && s.every(function (x) { return x === e; })) ans = i; else w[String(i)] = t !== n ? 'That one has ' + t + ' in all, not ' + n + '.' : 'Not fair: the plates are not the same.'; });
      return { q: 'Tap the fair share of <b>' + n + '</b> on <b>' + k + '</b> plates.', type: 'tap', tiles: sets.map(function (s) { return platesFig(s); }), answer: ans, answerText: k + ' plates with ' + e + ' on each', wrong: w,
        hint: 'Fair: every plate the same, and ' + n + ' in all.', steps: [n + DV + k + ' = ' + e + '.', 'Each plate has ' + e + '.'], explain: n + ' shared on ' + k + ' plates is ' + e + ' on each.', meta: { k: 'g3md-tap-share', n: n, g: k } };
    }],
    [2, 'tf', function (lv) {
      var k = rng(lv, { 2: [3, 4], 3: [4, 5] }), e = rng(lv, SE), n = k * e, truth = coin(), cs = truth ? same(k, e) : unfair(k, e), who = Q.name();
      return tf(who + ' shared ' + n + ' on ' + k + ' plates like this. True or false: it is a fair share.', truth, truth ? 'Every plate has ' + e + '.' : 'The plates are not all the same.',
        ['Fair means every counter is used.', 'Fair means the first plate gets the most.', 'Any sharing is fair.'], 'Count each plate.', { fig: platesFig(cs), hint: 'Count each plate.', meta: { k: 'g3md-tf-fair' } });
    }]
  ]);
  function tgShare(lv) {
    return function () {
      var k = rng(lv, SK), e = rng(lv, SE), n = k * e;
      return { q: 'Share ' + n + ' counters on ' + k + ' plates.', fig: platesFig(same(k, 0), { pile: n }), done: n + DV + k + ' = ' + e + '. Each plate has ' + e + '.', steps: [
        { prompt: 'How many groups do you need?', q: num('How many plates?', k, fx([[n, 'That is how many counters.']]), { hint: 'Count the plates.', meta: mt(n, k, 'b') }) },
        { prompt: 'Deal one to each plate, round and round, until none are left.', q: num('How many on each plate?', e, divFix(n, k), { hint: 'Think: ' + k + ' groups of what make ' + n + '?', meta: mt(n, k, 'd') }) },
        { prompt: 'Check with a times fact.', q: num(m(k + X + e) + ' = ?', n, prodFix(k, e), { hint: k + ' groups of ' + e + '.', meta: mt(k, e, 'x') }) }
      ] };
    };
  }

  /* ---------- how many groups? ---------- */
  var GK = { 1: [2, 5], 2: [2, 6], 3: [3, 10] }, GE = { 1: [2, 5], 2: [3, 7], 3: [5, 10] };
  var GROUPS = [
    function (n, k) { return n + ' players make teams of ' + k + '. How many teams?'; },
    function (n, k) { return n + ' chairs go in rows of ' + k + '. How many rows?'; },
    function (n, k) { return n + ' cookies go on trays, ' + k + ' on each tray. How many trays?'; },
    function (n, k) { return n + ' pencils come in packs of ' + k + '. How many packs?'; },
    function (n, k) { return n + ' bannock pieces go in bags of ' + k + '. How many bags?'; }
  ];
  skill('md-groupdiv', 'Make groups to divide', 'B2.6', [
    [1, 'plain', function (lv) {
      var k = rng(lv, GK), e = rng(lv, GE), n = k * e;
      return num('Put ' + n + ' counters in bags of ' + k + '. How many bags?', e, divFix(n, k), { fig: platesFig([], { pile: n }), hint: 'Take out ' + k + ' at a time.',
        steps: ['Count by ' + k + 's to ' + n + ': ' + skips(k, e) + '.', 'That is ' + pl(e, 'bag') + '.'], explain: n + DV + k + ' = ' + e + '.', meta: { k: 'g3md-group-fig', s: k } });
    }],
    [1, 'story', function (lv) {
      var k = rng(lv, GK), e = rng(lv, GE), n = k * e;
      return num(R.pick(GROUPS)(n, k), e, divFix(n, k), { hint: 'How many groups of ' + k + ' make ' + n + '?', steps: ['Count by ' + k + 's to ' + n + '.', skips(k, e) + ': ' + e + ' groups.'], explain: n + DV + k + ' = ' + e + '.', meta: mt(n, k, 'd') });
    }],
    [1, 'line', function (lv) {
      var k = rng(lv, GK), e = rng(lv, GE), n = k * e;
      return num('How many jumps of ' + k + ' go from 0 to ' + n + '?', e, divFix(n, k), { fig: lineFig(k, e, { max: n, show: function (v) { return v === 0 || v === n; }, dot: false }), hint: 'Count the jumps.',
        steps: ['Count by ' + k + 's: ' + skips(k, e) + '.', pl(e, 'jump') + '.'], explain: n + DV + k + ' = ' + e + '.', meta: mt(n, k, 'd') });
    }],
    [1, 'tap', function (lv) {
      var k = rng(lv, { 1: [2, 4], 2: [3, 5], 3: [4, 6] }), e = rng(lv, { 1: [2, 3], 2: [2, 4], 3: [3, 5] }), n = k * e, sets = R.shuffle([[e, k], e !== k ? [k, e] : [e + 1, k], [e, k + 1]]), ans = 0, w = {};
      sets.forEach(function (s, i) { if (s[0] === e && s[1] === k) ans = i; else w[String(i)] = 'That one has ' + s[1] + ' in each bag. You need bags of ' + k + '.'; });
      return { q: 'Tap the picture of <b>' + n + '</b> in bags of <b>' + k + '</b>.', type: 'tap', tiles: sets.map(function (s) { return platesFig(same(s[0], s[1]), { bags: true }); }), answer: ans, answerText: pl(e, 'bag') + ' of ' + k, wrong: w,
        hint: 'Every bag must hold ' + k + '.', steps: ['Bags of ' + k + ': ' + skips(k, e) + '.', pl(e, 'bag') + '.'], explain: n + DV + k + ' = ' + e + ' bags.', meta: { k: 'g3md-tap-plates', g: e, n: k } };
    }],
    [2, 'tf', function (lv) {
      var k = rng(lv, GK), e = rng(lv, GE), n = k * e, who = Q.name(), truth = coin(), said = truth ? e : e + R.pick([1, -1]);
      return tf(who + ' puts ' + n + ' stickers in bags of ' + k + ' and fills ' + pl(said, 'bag') + '. True or false: that is right.', truth, said + X + k + ' = ' + said * k + (truth ? '.' : ', not ' + n + '.'),
        ['Bags of ' + k + ' always make ' + k + ' bags.', 'Take away ' + k + ' once.', 'The number of bags is the total.'], 'Check: ' + said + ' bags of ' + k + ' hold ' + said * k + '.', { hint: 'Multiply to check.', meta: { k: 'g3md-tf', a: n, b: k, op: 'd', said: said } });
    }]
  ]);
  function tgGroupdiv(lv) {
    return function () {
      var k = rng(lv, GK), e = rng(lv, GE), n = k * e;
      return { q: 'How many bags of ' + k + ' can you fill from ' + n + '?', fig: platesFig([], { pile: n }), done: n + DV + k + ' = ' + e + ': ' + pl(e, 'bag') + ' of ' + k + '.', steps: [
        { prompt: 'This time you know the size of each group.', q: num('How many go in each bag?', k, fx([[n, 'That is the total.']]), { hint: 'Bags of ' + k + '.', meta: mt(n, k, 'b') }) },
        { prompt: 'Count by ' + k + 's to ' + n + '. Each count is a bag.', q: num('How many bags?', e, divFix(n, k), { hint: skips(k, 2) + ', and on.', meta: mt(n, k, 'd') }) },
        { prompt: 'Check with a times fact.', q: num(m(e + X + k) + ' = ?', n, prodFix(e, k), { hint: e + ' groups of ' + k + '.', meta: mt(e, k, 'x') }) }
      ] };
    };
  }

  /* ---------- multiply or divide? ---------- */
  var MIXC = [{ g: 'teams', g1: 'team', it: 'players' }, { g: 'bags', g1: 'bag', it: 'apples' }, { g: 'boxes', g1: 'box', it: 'muffins' }, { g: 'rows', g1: 'row', it: 'chairs' }, { g: 'packs', g1: 'pack', it: 'juice boxes' }, { g: 'canoes', g1: 'canoe', it: 'campers' }];
  function story3(kind, lv) {
    var p = two(lv, GR, EA), a = p[0], b = p[1], c = R.pick(MIXC), who = Q.name();
    if (kind === 'times') return { kind: kind, t: 'There are ' + a + ' ' + c.g + ' with ' + b + ' ' + c.it + ' in each. How many ' + c.it + ' in all?', ans: a * b, x: a, y: b, op: 'x' };
    if (kind === 'share') return { kind: kind, t: who + ' puts ' + a * b + ' ' + c.it + ' into ' + a + ' ' + c.g + ', the same number in each. How many ' + c.it + ' in each ' + c.g1 + '?', ans: b, x: a * b, y: a, op: 'd' };
    return { kind: kind, t: who + ' has ' + a * b + ' ' + c.it + '. Each ' + c.g1 + ' holds ' + b + '. How many ' + c.g + '?', ans: a, x: a * b, y: b, op: 'd' };
  }
  var KINDS = ['times', 'share', 'group'], MEAN = ['How many in each group', 'How many groups', 'How many in all'], MEANK = { share: 0, group: 1, times: 2 };
  var KNOW = ['How many groups, and how many in each', 'The total, and how many groups', 'The total, and how many in each group'], KNOWK = { times: 0, share: 1, group: 2 };
  function opSym(op) { return op === 'x' ? X : op === 'd' ? DV : op === '+' ? ' + ' : MI; }
  function mixFix(s) { return s.op === 'x' ? fx([[s.x + s.y, 'You added. Equal groups put together: multiply.']]) : fx([[s.x * s.y, 'You multiplied. A total split into equal groups: divide.'], [s.x - s.y, 'You took away once. Split the total into equal groups.']]); }
  skill('md-mixop', 'Multiply or divide?', 'B2.6', [
    [1, 'plain', function (lv) {
      var s = story3(R.pick(KINDS), lv);
      return num(s.t, s.ans, mixFix(s), { hint: s.op === 'x' ? 'Equal groups put together: multiply.' : 'A total split into equal groups: divide.', steps: [s.op === 'x' ? 'Multiply.' : 'Divide.', s.x + opSym(s.op) + s.y + ' = ' + s.ans + '.'], explain: s.x + opSym(s.op) + s.y + ' = ' + s.ans + '.', meta: mt(s.x, s.y, s.op) });
    }],
    [1, 'calc', function (lv) {
      var p = two(lv, GR, EA), a = p[0], b = p[1], op = R.pick(['x', 'd', 'x', 'd', '+']), x = op === 'd' ? a * b : a, y = op === 'd' ? a : b, ans = op === 'x' ? a * b : op === 'd' ? b : a + b;
      return num('Watch the sign. ' + m(x + opSym(op) + y) + ' = ?', ans, op === '+' ? fx([[a * b, 'That sign is +. Add.']]) : op === 'x' ? fx([[a + b, 'That sign is &times;. Multiply.']]) : divFix(x, y), {
        hint: op === 'x' ? x + ' groups of ' + y + '.' : op === 'd' ? x + ' split into ' + y + ' equal groups.' : 'Add.', steps: [op === 'x' ? '&times; means groups of.' : op === 'd' ? '&divide; means split into equal groups.' : '+ means add.', x + opSym(op) + y + ' = ' + ans + '.'], explain: x + opSym(op) + y + ' = ' + ans + '.', meta: { k: 'g3md-bare' } });
    }],
    [1, 'which', function (lv) {
      var s = story3(R.pick(KINDS), lv), right = s.x + opSym(s.op) + s.y, W = s.op === 'x' ? [[s.x + ' + ' + s.y, 'Adding the two numbers does not count the groups.'], [(s.x + 1) + X + s.y, 'There are ' + s.x + ' groups.']] : [[s.x + X + s.y, 'You know the total. Split it: divide.'], [s.x + MI + s.y, 'Taking away once does not split it.'], [s.x + ' + ' + s.y, 'You know the total. Split it: divide.']];
      return mc(s.t + ' <b>Which number sentence solves it?</b>', right, W, { hint: s.op === 'x' ? 'You know the groups. You want the total.' : 'You know the total. You split it.', steps: [right + ' = ' + s.ans + '.'], explain: right + ' = ' + s.ans + '.', meta: { k: 'g3md-mc-expr', a: s.x, b: s.y, op: s.op } });
    }],
    [1, 'mean', function (lv) {
      var s = story3(R.pick(KINDS), lv);
      return fixed(s.t + ' <b>What will the answer tell you?</b>', MEAN, MEANK[s.kind], ['Read the question again: what does it ask for?', 'Read the question again: what does it ask for?', 'Read the question again: what does it ask for?'], { hint: 'Read the last sentence.', steps: ['It asks: ' + MEAN[MEANK[s.kind]].toLowerCase() + '.'], explain: MEAN[MEANK[s.kind]] + ': ' + s.ans + '.', meta: { k: 'g3md-mean', kind: s.kind } });
    }],
    [1, 'two', function (lv) {
      var T = { 1: [[2, 3], [2, 5], [2, 3]], 2: [[2, 5], [2, 6], [2, 5]], 3: [[3, 6], [4, 10], [2, 6]] }[lv], g, n, d, guard = 0;
      do { g = R.int(T[0][0], T[0][1]); n = R.int(T[1][0], T[1][1]); d = R.int(T[2][0], T[2][1]); } while (((g * n) % d || g * n / d > 10 || g * n / d < 2) && guard++ < 200);
      if ((g * n) % d) { g = 2; n = 4; d = 2; }
      var who = Q.name(), e = g * n / d;
      return num(who + ' has ' + g + ' packs of ' + n + ' juice boxes. ' + who + ' shares them equally among ' + d + ' tables. How many juice boxes on each table?', e, fx([[g * n, 'That is the total. Now share it among ' + d + ' tables.'], [g * n * d, 'Share the total: divide.']]), {
        hint: 'First find the total. Then share it.', steps: [g + X + n + ' = ' + g * n + ' juice boxes.', g * n + DV + d + ' = ' + e + '.'], explain: e + ' on each table.', meta: { k: 'g3md-two', g: g, n: n, d: d } });
    }]
  ]);
  function tgMix(kind) {
    return function () {
      var s = story3(kind, 2);
      return { q: s.t, done: s.x + opSym(s.op) + s.y + ' = ' + s.ans + '.', steps: [
        { prompt: 'Find the numbers in the story. What are they?', q: fixed('What do you know?', KNOW, KNOWK[kind], ['Is ' + s.x + ' a total, or a number of groups?', 'Is there a total in the story?', 'Is there a total in the story?'], { hint: 'Look at each number in the story.', meta: { k: 'g3md-know', kind: kind } }) },
        { prompt: 'Equal groups put together: multiply. A total split up: divide.', q: fixed('So do you multiply or divide?', ['Multiply', 'Divide'], s.op === 'x' ? 0 : 1, ['You know the total. Split it: divide.', 'You know the groups. Put them together: multiply.'], { hint: 'Do you know the total?', meta: { k: 'g3md-op', kind: kind } }) },
        { prompt: 'Now work it out.', q: num(m(s.x + opSym(s.op) + s.y) + ' = ?', s.ans, mixFix(s), { hint: s.op === 'x' ? s.x + ' groups of ' + s.y + '.' : s.op === 'd' ? 'Think of a times fact.' : '', meta: mt(s.x, s.y, s.op) }) }
      ] };
    };
  }

  /* ======================= Lesson 5: Fact families ======================= */
  var FB = { 1: [2, 5, 10], 2: [2, 3, 4, 5, 6, 7], 3: [3, 4, 6, 7, 8, 9, 10] };
  function fcase(lv) { var a = rng(lv, GR), b = R.pick(FB[lv]), guard = 0; while (b === a && guard++ < 20) b = R.pick(FB[lv]); if (b === a) a = a === 10 ? 9 : a + 1; return [a, b, a * b]; }
  skill('md-family', 'Fact families', 'B2.1', [
    [1, 'plain', function (lv) {
      var f = fcase(lv), a = f[0], b = f[1], p = f[2];
      return fill('Complete the fact family of ' + a + ', ' + b + ' and ' + p + '.', m(a + X + b + ' = ' + p) + '<br>' + m(b + X + a + ' = [[]]') + '<br>' + m(p + DV + a + ' = [[]]') + '<br>' + m(p + DV + b + ' = [[]]'), [p, b, a], {
        hint: 'Every fact uses ' + a + ', ' + b + ' and ' + p + '.', steps: ['Turn it: ' + b + X + a + ' = ' + p + '.', p + DV + a + ' = ' + b + ' and ' + p + DV + b + ' = ' + a + '.'], explain: famLines(a, b, 4).replace(/<br>/g, ', ') + '.', meta: { k: 'g3md-eqs' } });
    }],
    [1, 'array', function (lv) {
      var f = fcase(lv), a = f[0], b = f[1], p = f[2];
      return fill('The array shows ' + m(a + X + b + ' = ' + p) + '. Fill in the division facts.', m(p + DV + a + ' = [[]]') + '<br>' + m(p + DV + b + ' = [[]]'), [b, a], { fig: arrayFig(a, b, { labels: lv === 1 }),
        hint: p + ' in ' + a + ' rows: how many in each row?', steps: [p + ' in ' + a + ' rows: ' + b + ' in each.', p + ' in rows of ' + b + ': ' + a + ' rows.'], explain: p + DV + a + ' = ' + b + ', ' + p + DV + b + ' = ' + a + '.', meta: { k: 'g3md-eqs' } });
    }],
    [1, 'missing', function (lv) {
      var f = fcase(lv), a = f[0], b = f[1], p = f[2], t = lv === 3 ? m(p + DV + '[[]] = ' + a) : m('[[]]' + X + b + ' = ' + p);
      return fill('Use the fact family. Fill in the blank.', t, [lv === 3 ? b : a], { hint: 'The family of ' + a + ', ' + b + ' and ' + p + '.', steps: [a + X + b + ' = ' + p + '.', p + DV + b + ' = ' + a + '.'], explain: famLines(a, b, 4).replace(/<br>/g, ', ') + '.', meta: { k: 'g3md-eqs' } });
    }],
    [2, 'pick', function (lv) {
      var f = fcase(lv), a = f[0], b = f[1], p = f[2];
      var good = R.shuffle([a + X + b + ' = ' + p, b + X + a + ' = ' + p, p + DV + a + ' = ' + b, p + DV + b + ' = ' + a]).slice(0, 3);
      var bad = R.shuffle([a + ' + ' + b + ' = ' + (a + b), p + DV + a + ' = ' + (b + 1), a + X + (b + 1) + ' = ' + a * (b + 1)]).slice(0, 2);
      var opts = R.shuffle(good.concat(bad)), ans = []; opts.forEach(function (o, j) { if (good.indexOf(o) >= 0) ans.push(j); });
      return { q: 'Pick <b>every</b> fact in the family of ' + m(a + X + b + ' = ' + p) + '.', type: 'pick', options: opts, answer: ans, hint: 'Family facts use ' + a + ', ' + b + ' and ' + p + ', with &times; or &divide;. They are all true.',
        steps: ['Each one must use ' + a + ', ' + b + ' and ' + p + '.'], explain: famLines(a, b, 4).replace(/<br>/g, ', ') + '.', meta: { k: 'g3md-pick-fam', a: a, b: b } };
    }],
    [2, 'odd', function (lv) {
      var f = fcase(lv), a = f[0], b = f[1], p = f[2], right = R.pick([p + MI + a + ' = ' + (p - a), a + ' + ' + b + ' = ' + (a + b)]);
      var fam = R.shuffle([a + X + b + ' = ' + p, b + X + a + ' = ' + p, p + DV + a + ' = ' + b, p + DV + b + ' = ' + a]).slice(0, 3).map(function (t) { return [t, 'That one uses ' + a + ', ' + b + ' and ' + p + ' with &times; or &divide;. It is in the family.']; });
      return mc('Which fact is <b>not</b> in the family of ' + a + ', ' + b + ' and ' + p + '?', right, fam, { hint: 'The family uses only &times; and &divide;.', steps: ['Family facts use ' + a + ', ' + b + ' and ' + p + ' with &times; or &divide;.'], explain: right + ' is not in the family.', meta: { k: 'g3md-fam-odd', a: a, b: b } });
    }]
  ]);
  function tgFamily(lv) {
    return function () {
      var f = fcase(lv), a = f[0], b = f[1], p = f[2];
      return { q: 'Write the fact family for this array.', fig: arrayFig(a, b, { labels: true }), done: famLines(a, b, 4).replace(/<br>/g, ', ') + '.', steps: [
        { prompt: 'Rows times how many in each row.', q: num(m(a + X + b) + ' = ?', p, prodFix(a, b), { hint: a + ' rows of ' + b + '.', meta: mt(a, b, 'x') }) },
        { prompt: 'Turn it around.', q: num(m(b + X + a) + ' = ?', p, fx([[a + b, 'Turn it around: same dots.']]), { hint: 'Same dots.', meta: mt(b, a, 'x') }) },
        { prompt: 'Now split the ' + p + ' dots into ' + a + ' rows.', q: num(m(p + DV + a) + ' = ?', b, divFix(p, a), { hint: 'How many in each row?', meta: mt(p, a, 'd') }) }
      ] };
    };
  }

  /* ---------- check a division ---------- */
  var CD = { 1: [2, 5], 2: [2, 7], 3: [6, 10] }, CQ = { 1: [2, 5], 2: [3, 7], 3: [6, 10] };
  function cOff(q) { return q + R.pick(q > 2 ? [1, -1] : [1]); }
  skill('md-check', 'Check a division', 'B2.1', [
    [1, 'plain', function (lv) {
      var d = rng(lv, CD), q = rng(lv, CQ), n = d * q, who = Q.name(), truth = coin(), said = truth ? q : cOff(q);
      return tf(who + ' says ' + m(n + DV + d + ' = ' + said) + '. Check with a times fact. True or false: ' + who + ' is right.', truth, said + X + d + ' = ' + said * d + (truth ? '.' : ', not ' + n + '.'),
        ['Check by adding ' + said + ' and ' + d + '.', 'Division answers are always small.', 'Check by taking ' + d + ' from ' + n + '.'], 'Multiply: ' + said + X + d + '. Is it ' + n + '?', { hint: said + ' groups of ' + d + ' should make ' + n + '.', meta: { k: 'g3md-tf', a: n, b: d, op: 'd', said: said } });
    }],
    [1, 'fix', function (lv) {
      var d = rng(lv, CD), q = rng(lv, CQ), n = d * q, who = Q.name(), said = cOff(q);
      return num(who + ' says ' + m(n + DV + d + ' = ' + said) + '. But ' + m(said + X + d + ' = ' + said * d) + '. What is ' + m(n + DV + d) + '?', q, fx([[said, 'That is the answer that did not check.'], [n - d, 'Find how many groups of ' + d + ' make ' + n + '.']]), {
        hint: said * d < n ? 'Too small: try one more group.' : 'Too big: try one less group.', steps: ['? ' + X + d + ' = ' + n + '.', q + X + d + ' = ' + n + '.'], explain: n + DV + d + ' = ' + q + '.', meta: mt(n, d, 'd') });
    }],
    [1, 'fill', function (lv) {
      var d = rng(lv, CD), q = rng(lv, CQ), n = d * q;
      return fill('Divide, then check.', m(n + DV + d + ' = [[]]') + ' because ' + m('[[]]' + X + d + ' = ' + n), [q, q], { hint: 'How many groups of ' + d + ' make ' + n + '?', steps: [q + X + d + ' = ' + n + '.', 'So ' + n + DV + d + ' = ' + q + '.'], explain: n + DV + d + ' = ' + q + '.', meta: { k: 'g3md-eqs' } });
    }],
    [2, 'which', function (lv) {
      var d = rng(lv, CD), q = rng(lv, CQ), n = d * q, W = [[q + ' + ' + d + ' = ' + (q + d), 'Check a division with a times fact.'], [n + MI + d + ' = ' + (n - d), 'Check a division with a times fact.']];
      W.push(d !== q ? [d + X + d + ' = ' + d * d, 'Use the answer, ' + q + ', and ' + d + '.'] : [(q + 1) + X + d + ' = ' + (q + 1) * d, 'Use the answer, ' + q + '.']);
      return mc('Which times fact checks ' + m(n + DV + d + ' = ' + q) + '?', q + X + d + ' = ' + n, W, { hint: 'Answer times the number you divided by.', steps: [q + X + d + ' = ' + n + '.'], explain: q + X + d + ' = ' + n + ', so it checks.', meta: { k: 'g3md-check-mc', n: n, d: d } });
    }],
    [2, 'story', function (lv) {
      var d = rng(lv, CD), q = rng(lv, CQ), n = d * q, who = Q.name(), said = coin() ? q : cOff(q);
      return num(who + ' puts ' + n + ' stickers in bags of ' + d + ' and counts ' + pl(said, 'bag') + '. Check: how many stickers do ' + pl(said, 'bag') + ' of ' + d + ' hold?', said * d, prodFix(said, d), { hint: said + ' groups of ' + d + '.',
        steps: [said + X + d + ' = ' + said * d + '.', said * d === n ? 'That is ' + n + ': it checks.' : 'That is not ' + n + ': it does not check.'], explain: said + X + d + ' = ' + said * d + '.', meta: mt(said, d, 'x') });
    }]
  ]);
  function tgCheck(lv) {
    return function () {
      var d = rng(lv, CD), q = rng(lv, CQ), n = d * q, who = Q.name(), ok = coin(), said = ok ? q : cOff(q);
      return { q: who + ' says ' + m(n + DV + d + ' = ' + said) + '. Check it.', fig: platesFig(same(said, d), { bags: true }), done: n + DV + d + ' = ' + q + ', because ' + q + X + d + ' = ' + n + '.', steps: [
        { prompt: 'Multiply the answer by the number you divided by.', q: num(m(said + X + d) + ' = ?', said * d, prodFix(said, d), { hint: said + ' bags of ' + d + '.', meta: mt(said, d, 'x') }) },
        { prompt: 'Is it the total, ' + n + '?', q: fixed('So is ' + who + ' right?', ['Yes, it checks', 'No, it does not check'], ok ? 0 : 1, ['Compare ' + said * d + ' with ' + n + '.', 'Compare ' + said * d + ' with ' + n + '.'], { hint: said * d + ' and ' + n + ': the same?', meta: { k: 'g3md-yn-check', n: n, d: d, said: said } }) },
        { prompt: 'Now find the real answer.', q: num(m(n + DV + d) + ' = ?', q, divFix(n, d), { hint: '? ' + X + d + ' = ' + n + '.', meta: mt(n, d, 'd') }) }
      ] };
    };
  }

  /* ======================= Lesson 6: Scaling up ======================= */
  var RK = { 1: [2], 2: [2, 5, 10], 3: [5, 10, 2] }, RN = { 1: [2, 5], 2: [3, 8], 3: [6, 10] };
  function rcase(lv) { var k = R.pick(RK[lv]); return { k: k, th: R.pick(THINGS[k]), n: rng(lv, RN) }; }
  skill('md-scale', 'Scale up by 2, 5 or 10', 'B2.9', [
    [1, 'plain', function (lv) {
      var c = rcase(lv);
      return num(hasOne(c.th, c.k) + '. ' + askMany(c.th, c.n), c.n * c.k, prodFix(c.n, c.k), { fig: lv < 3 ? ratioFig(c.th, c.n) : '', hint: 'Each ' + c.th.one + ' adds ' + c.k + ' more. Count by ' + c.k + 's.',
        steps: ['1 &rarr; ' + c.k + '.', c.n + ' &rarr; ' + c.n + X + c.k + ' = ' + c.n * c.k + '.'], explain: c.n + X + c.k + ' = ' + c.n * c.k + ' ' + c.th.parts + '.', meta: mt(c.n, c.k, 'x') });
    }],
    [1, 'table', function (lv) {
      var c = rcase(lv), ns = lv === 1 ? [2, 3, 4] : lv === 2 ? [2, R.int(3, 5), R.int(6, 8)] : [R.int(4, 5), R.int(6, 8), R.int(9, 10)];
      return fill('Fill in the table.', '1 ' + c.th.one + ' &rarr; ' + c.k + ' ' + c.th.parts + ns.map(function (n) { return '<br>' + n + ' ' + c.th.many + ' &rarr; [[]] ' + c.th.parts; }).join(''), ns.map(function (n) { return n * c.k; }), {
        hint: 'For every 1 ' + c.th.one + ', there are ' + c.k + '. Count by ' + c.k + 's.', steps: ns.map(function (n) { return n + X + c.k + ' = ' + n * c.k + '.'; }), explain: 'Each ' + c.th.one + ' adds ' + c.k + '.', meta: { k: 'g3md-fill', ops: ns.map(function (n) { return [n, c.k, 'x']; }) } });
    }],
    [1, 'story', function (lv) {
      var c = rcase(lv), n1 = lv === 1 ? 2 : R.int(2, 4), n2 = c.n === n1 ? n1 + 2 : c.n;
      return num(n1 + ' ' + c.th.many + (c.th.coin ? ' are worth ' + n1 * c.k + '&cent;. ' : ' have ' + n1 * c.k + ' ' + c.th.parts + '. ') + askMany(c.th, n2), n2 * c.k, fx([[n2 * n1 * c.k, 'First find 1 ' + c.th.one + ': ' + n1 * c.k + DV + n1 + ' = ' + c.k + '.'], [n1 * c.k + n2 - n1, 'Each ' + c.th.one + ' adds ' + c.k + ', not 1.']]), {
        hint: 'How many for 1 ' + c.th.one + '?', steps: ['1 ' + c.th.one + ': ' + n1 * c.k + DV + n1 + ' = ' + c.k + '.', n2 + X + c.k + ' = ' + n2 * c.k + '.'], explain: n2 * c.k + ' ' + c.th.parts + '.', meta: { k: 'g3md-scale-from', a: n1, t: n1 * c.k, b: n2 } });
    }],
    [2, 'match', function (lv) {
      var c = rcase(lv), P = pairs3(function () { var n = rng(lv, RN); return [n + ' ' + c.th.many, n * c.k + ' ' + c.th.parts]; });
      return { q: hasOne(c.th, c.k) + '. Match each one.', type: 'match', pairs: P, hint: 'Count by ' + c.k + 's for each one.', steps: ['Multiply by ' + c.k + '.'], explain: P.map(function (x) { return x[0] + ': ' + x[1]; }).join('. ') + '.', meta: { k: 'g3md-match-ratio', f: c.k } };
    }],
    [2, 'tf', function (lv) {
      var c = rcase(lv), who = Q.name(), truth = coin(), said = truth ? c.n * c.k : R.pick([c.n + c.k, c.n * c.k + c.k, c.n * c.k - c.k]);
      return tf(hasOne(c.th, c.k) + '. ' + who + ' says ' + c.n + ' ' + c.th.many + (c.th.coin ? ' are worth ' : ' have ') + said + ' ' + c.th.parts + '. True or false: ' + who + ' is right.', truth, c.n + X + c.k + ' = ' + c.n * c.k + '.',
        ['Add ' + c.n + ' and ' + c.k + '.', 'Each new ' + c.th.one + ' adds 1 more.', 'The number stays the same.'], 'Count by ' + c.k + 's, ' + c.n + ' times.', { hint: 'Count by ' + c.k + 's.', meta: { k: 'g3md-tf', a: c.n, b: c.k, op: 'x', said: said } });
    }]
  ]);
  function tgRatio(lv) {
    return function () {
      var c = rcase(lv); if (c.n < 3) c.n = 3;
      return { q: hasOne(c.th, c.k) + '. ' + askMany(c.th, c.n), fig: ratioFig(c.th, c.n), done: c.n + X + c.k + ' = ' + c.n * c.k + ' ' + c.th.parts + '.', steps: [
        { prompt: 'Start with one.', q: num('How many ' + c.th.parts + ' for 1 ' + c.th.one + '?', c.k, {}, { hint: 'Read the first sentence.', meta: mt(c.n, c.k, 'b') }) },
        { prompt: 'Each new one adds ' + c.k + ' more.', q: num('How many for 2 ' + c.th.many + '?', 2 * c.k, fx([[c.k + 1, 'Add ' + c.k + ', not 1.']]), { hint: c.k + ' + ' + c.k + '.', meta: mt(2, c.k, 'x') }) },
        { prompt: 'Count by ' + c.k + 's, ' + c.n + ' times.', q: num('How many for ' + c.n + ' ' + c.th.many + '?', c.n * c.k, prodFix(c.n, c.k), { hint: skips(c.k, 3) + ', and on.', meta: mt(c.n, c.k, 'x') }) }
      ] };
    };
  }

  /* ---------- work back from the total ---------- */
  function askHow(th, t) { return th.coin ? 'How many ' + th.many + ' make ' + t + '&cent;?' : 'How many ' + th.many + ' have ' + t + ' ' + th.parts + '?'; }
  skill('md-back', 'Work back from the total', 'B2.9', [
    [1, 'plain', function (lv) {
      var c = rcase(lv), t = c.n * c.k;
      return num(hasOne(c.th, c.k) + '. ' + askHow(c.th, t), c.n, divFix(t, c.k), { fig: lv === 1 ? lineFig(c.k, c.n, { max: t, show: function (v) { return v === 0 || v === t; }, dot: false }) : '', hint: 'Count by ' + c.k + 's to ' + t + '. Count the jumps.',
        steps: ['Count by ' + c.k + 's: ' + skips(c.k, c.n) + '.', pl(c.n, 'jump') + ': ' + pl(c.n, c.th.one, c.th.many) + '.'], explain: t + DV + c.k + ' = ' + c.n + '.', meta: mt(t, c.k, 'd') });
    }],
    [1, 'table', function (lv) {
      var c = rcase(lv), ns = lv === 1 ? [2, 3, 5] : lv === 2 ? [R.int(2, 3), R.int(4, 6), R.int(7, 8)] : [R.int(4, 6), R.int(7, 8), R.int(9, 10)];
      return fill('Fill in the table.', '1 ' + c.th.one + ' &rarr; ' + c.k + ' ' + c.th.parts + ns.map(function (n) { return '<br>[[]] ' + c.th.many + ' &rarr; ' + n * c.k + ' ' + c.th.parts; }).join(''), ns, {
        hint: 'How many ' + c.k + 's make each number?', steps: ns.map(function (n) { return n * c.k + DV + c.k + ' = ' + n + '.'; }), explain: 'Count by ' + c.k + 's to each total.', meta: { k: 'g3md-fill', ops: ns.map(function (n) { return [n * c.k, c.k, 'd']; }) } });
    }],
    [1, 'coins', function (lv) {
      var c = R.pick(lv === 1 ? [[10, 'dimes', '&cent;'], [2, 'toonies', '$']] : [[10, 'dimes', '&cent;'], [5, 'nickels', '&cent;'], [2, 'toonies', '$']]), n = rng(lv, RN), t = n * c[0];
      return num('How many ' + c[1] + ' make ' + (c[2] === '$' ? '$' + t : t + '&cent;') + '?', n, divFix(t, c[0]), { hint: (c[1] === 'toonies' ? 'A toonie is $2' : 'Each one is ' + c[0] + '&cent;') + '. Count by ' + c[0] + 's.', steps: ['Count by ' + c[0] + 's to ' + t + ': ' + skips(c[0], n) + '.', n + ' ' + c[1] + '.'], explain: t + DV + c[0] + ' = ' + n + '.', meta: mt(t, c[0], 'd') });
    }],
    [2, 'tf', function (lv) {
      var c = rcase(lv), t = c.n * c.k, who = Q.name(), truth = coin(), said = truth ? c.n : R.pick([c.n + 1, c.n - 1, t - c.k]);
      return tf(hasOne(c.th, c.k) + '. ' + who + ' says ' + (c.th.coin ? t + '&cent; is ' : t + ' ' + c.th.parts + ' means ') + said + ' ' + c.th.many + '. True or false: ' + who + ' is right.', truth, said + X + c.k + ' = ' + said * c.k + (truth ? '.' : ', not ' + t + '.'),
        ['Take ' + c.k + ' away once.', 'The total is the number of ' + c.th.many + '.', 'Add ' + c.k + '.'], 'Check: ' + said + X + c.k + '.', { hint: 'Multiply to check.', meta: { k: 'g3md-tf', a: t, b: c.k, op: 'd', said: said } });
    }],
    [2, 'mc', function (lv) {
      var c = rcase(lv), t = c.n * c.k;
      return mc(hasOne(c.th, c.k) + '. ' + askHow(c.th, t), String(c.n), [[String(t - c.k), 'You took ' + c.k + ' away once. Count how many ' + c.k + 's make ' + t + '.'], [String(t + c.k), 'You added. Count how many ' + c.k + 's make ' + t + '.'], [String(c.n + 1), 'Check: ' + (c.n + 1) + X + c.k + ' = ' + (c.n + 1) * c.k + '.']], {
        hint: 'Count by ' + c.k + 's to ' + t + '.', steps: [skips(c.k, c.n) + '.', pl(c.n, 'jump') + '.'], explain: t + DV + c.k + ' = ' + c.n + '.', meta: { k: 'g3md-mc', a: t, b: c.k, op: 'd' } });
    }]
  ]);
  function tgBack(lv) {
    return function () {
      var c = rcase(lv), t = c.n * c.k;
      return { q: hasOne(c.th, c.k) + '. ' + askHow(c.th, t), fig: lineFig(c.k, 0, { max: t, show: function (v) { return v === 0 || v === t; } }), done: t + DV + c.k + ' = ' + c.n + ': ' + pl(c.n, c.th.one, c.th.many) + '.', steps: [
        { prompt: 'Find the size of one group.', q: num('How many for 1 ' + c.th.one + '?', c.k, fx([[t, 'That is the total.']]), { hint: 'Read the first sentence.', meta: mt(t, c.k, 'b') }) },
        { prompt: 'Count by ' + c.k + 's to ' + t + '. Count the jumps.', q: num('How many ' + c.th.many + '?', c.n, divFix(t, c.k), { hint: skips(c.k, 2) + ', and on.', meta: mt(t, c.k, 'd') }) },
        { prompt: 'Check with a times fact.', q: num(m(c.n + X + c.k) + ' = ?', t, prodFix(c.n, c.k), { hint: c.n + ' groups of ' + c.k + '.', meta: mt(c.n, c.k, 'x') }) }
      ] };
    };
  }

  /* ======================= Lesson 7: Fact fluency ======================= */
  function kfact(lv) { var k = R.pick(K1[lv]), n = R.int(lv === 3 ? 6 : 1, 10), turn = lv > 1 && coin(); return { k: k, n: n, a: turn ? k : n, b: turn ? n : k }; }
  skill('md-facts', 'Facts of 2, 5 and 10', 'B2.2', [
    [1, 'plain', function (lv) {
      var f = kfact(lv);
      return num(m(f.a + X + f.b) + ' = ?', f.a * f.b, prodFix(f.a, f.b), { hint: 'Count by ' + f.k + 's' + (f.a === f.k && f.a !== f.b ? ': ' + f.a + X + f.b + ' = ' + f.b + X + f.a + '.' : '.'), steps: ['Count by ' + f.k + 's, ' + f.n + ' times: ' + skips(f.k, f.n) + '.'], explain: f.a + X + f.b + ' = ' + f.a * f.b + '.', meta: { k: 'g3md-bare' } });
    }],
    [1, 'missing', function (lv) {
      var f = kfact(lv), t = lv === 3 && coin() ? m(f.k + X + '[[]] = ' + f.k * f.n) : m('[[]]' + X + f.k + ' = ' + f.k * f.n);
      return fill('Fill in the missing number.', t, [f.n], { hint: 'Count by ' + f.k + 's to ' + f.k * f.n + '. Count the jumps.', steps: [skips(f.k, f.n) + '.', pl(f.n, 'jump') + '.'], explain: f.n + X + f.k + ' = ' + f.k * f.n + '.', meta: { k: 'g3md-eqs' } });
    }],
    [1, 'row', function (lv) {
      var k = R.pick(K1[lv]), ns = R.shuffle(lv === 3 ? [6, 7, 8, 9, 10] : lv === 2 ? [2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 5, 6]).slice(0, 3), turn = lv === 3;
      return fill('Facts of ' + k + '. Fill in the answers.', ns.map(function (n) { return m((turn && n % 2 ? k + X + n : n + X + k) + ' = [[]]'); }).join('<br>'), ns.map(function (n) { return n * k; }), {
        hint: 'Count by ' + k + 's.', steps: ['Facts of ' + k + ': ' + skips(k, 10) + '.'], explain: ns.map(function (n) { return n + X + k + ' = ' + n * k; }).join(', ') + '.', meta: { k: 'g3md-eqs' } });
    }],
    [1, 'match', function (lv) {
      var P = pairs3(function () { var f = kfact(lv); return [f.a + X + f.b, String(f.a * f.b)]; });
      return { q: 'Match each fact to its answer.', type: 'match', pairs: P, hint: 'Count by 2s, 5s or 10s.', steps: ['Turn a fact around if it helps.'], explain: P.map(function (x) { return x[0] + ' = ' + x[1]; }).join('. ') + '.', meta: { k: 'g3md-match-eval' } };
    }]
  ]);
  function tgFacts(k) {
    return function () {
      var n = R.int(6, 9);
      return { q: 'Find ' + m(n + X + k) + ' fast.', fig: strip(k, 5), done: n + X + k + ' = ' + k + X + n + ' = ' + n * k + '.', steps: [
        { prompt: 'Start from a fact you know well.', q: num(m('5' + X + k) + ' = ?', 5 * k, prodFix(5, k), { hint: '5 groups of ' + k + '.', meta: mt(5, k, 'x') }) },
        { prompt: 'Count on ' + (n - 5) + ' more ' + k + 's.', q: num(m(n + X + k) + ' = ?', n * k, fx([[5 * k + n - 5, 'Count on by ' + k + 's, not by 1s.']]), { hint: 5 * k + ', then add ' + k + ' each time.', meta: mt(n, k, 'x') }) },
        { prompt: 'Turn it around: same answer.', q: num(m(k + X + n) + ' = ?', n * k, fx([[n + k, 'You added. Turn it around: same answer.']]), { hint: k + X + n + ' = ' + n + X + k + '.', meta: mt(k, n, 'x') }) }
      ] };
    };
  }

  /* ---------- division facts ---------- */
  function dfact(lv) { var k = R.pick(K1[lv]), q = R.int(lv === 3 ? 4 : 2, 10), p = k * q, flip = lv === 3 && coin() && q !== k; return { p: p, d: flip ? q : k, q: flip ? k : q, k: k }; }
  skill('md-divfacts', 'Division facts of 2, 5 and 10', 'B2.2', [
    [1, 'plain', function (lv) {
      var f = dfact(lv);
      return num(m(f.p + DV + f.d) + ' = ?', f.q, divFix(f.p, f.d), { hint: 'Think: ? ' + X + f.d + ' = ' + f.p + '.', steps: ['Which times fact has ' + f.d + ' and ' + f.p + '?', f.q + X + f.d + ' = ' + f.p + '.'], explain: f.p + DV + f.d + ' = ' + f.q + '.', meta: { k: 'g3md-bare' } });
    }],
    [1, 'think', function (lv) {
      var f = dfact(lv);
      return fill('Divide. Use the times fact.', m(f.p + DV + f.d + ' = [[]]') + ' because ' + m('[[]]' + X + f.d + ' = ' + f.p), [f.q, f.q], { hint: 'How many ' + f.d + 's make ' + f.p + '?', steps: [f.q + X + f.d + ' = ' + f.p + '.'], explain: f.p + DV + f.d + ' = ' + f.q + '.', meta: { k: 'g3md-eqs' } });
    }],
    [1, 'row', function (lv) {
      var k = R.pick(K1[lv]), qs = R.shuffle(lv === 3 ? [5, 6, 7, 8, 9, 10] : lv === 2 ? [2, 3, 4, 5, 6, 7, 8] : [1, 2, 3, 4, 5]).slice(0, 3);
      return fill('Divide by ' + k + '.', qs.map(function (q) { return m(q * k + DV + k + ' = [[]]'); }).join('<br>'), qs, { hint: 'Count by ' + k + 's to each number.', steps: ['Facts of ' + k + ': ' + skips(k, 10) + '.'], explain: qs.map(function (q) { return q * k + DV + k + ' = ' + q; }).join(', ') + '.', meta: { k: 'g3md-eqs' } });
    }],
    [1, 'match', function (lv) {
      var P = pairs3(function () { var f = dfact(lv); return [f.p + DV + f.d, String(f.q)]; });
      return { q: 'Match each division to its answer.', type: 'match', pairs: P, hint: 'Think of the times fact.', steps: ['20 &divide; 5: think ? &times; 5 = 20.'], explain: P.map(function (x) { return x[0] + ' = ' + x[1]; }).join('. ') + '.', meta: { k: 'g3md-match-eval' } };
    }]
  ]);
  function tgDiv(lv) {
    return function () {
      var f = dfact(lv);
      return { q: 'Find ' + m(f.p + DV + f.d) + '.', fig: lineFig(f.d, 0, { max: f.p, show: function (v) { return v === 0 || v === f.p; } }), done: f.p + DV + f.d + ' = ' + f.q + ', because ' + f.q + X + f.d + ' = ' + f.p + '.', steps: [
        { prompt: f.p + DV + f.d + ' asks: how many ' + f.d + 's make ' + f.p + '?', q: num('Count by which number?', f.d, fx([[f.p, 'That is the total. Count by the number you divide by.']]), { hint: 'The number after &divide;.', meta: mt(f.p, f.d, 'b') }) },
        { prompt: 'Count by ' + f.d + 's to ' + f.p + '. Keep track of the jumps.', q: num('How many ' + f.d + 's make ' + f.p + '?', f.q, divFix(f.p, f.d), { hint: skips(f.d, 2) + ', and on.', meta: mt(f.p, f.d, 'd') }) },
        { prompt: 'Check with the times fact.', q: num(m(f.q + X + f.d) + ' = ?', f.p, prodFix(f.q, f.d), { hint: f.q + ' groups of ' + f.d + '.', meta: mt(f.q, f.d, 'x') }) }
      ] };
    };
  }

  /* ---------- all the facts to 10 × 10 ---------- */
  var MX = { 1: [2, 5], 2: [2, 7], 3: [6, 10] };
  function mfact(lv) { var a = rng(lv, MX), b = R.int(lv === 3 ? 3 : 2, lv === 1 ? 5 : 10); return { a: a, b: b, p: a * b }; }
  skill('md-mixed', 'All the facts to 10 × 10', 'B2.6, B2.2', [
    [1, 'plain', function (lv) {
      var f = mfact(lv), div = coin();
      return div ? num(m(f.p + DV + f.b) + ' = ?', f.a, divFix(f.p, f.b), { hint: 'Think: ? ' + X + f.b + ' = ' + f.p + '.', steps: [f.a + X + f.b + ' = ' + f.p + '.', f.p + DV + f.b + ' = ' + f.a + '.'], explain: f.p + DV + f.b + ' = ' + f.a + '.', meta: { k: 'g3md-bare' } })
        : num(m(f.a + X + f.b) + ' = ?', f.p, prodFix(f.a, f.b), { hint: f.a + ' groups of ' + f.b + '. Split it if it is hard: ' + Math.min(5, f.a) + X + f.b + ' and the rest.', steps: [f.a + ' groups of ' + f.b + '.', f.a + X + f.b + ' = ' + f.p + '.'], explain: f.a + X + f.b + ' = ' + f.p + '.', meta: { k: 'g3md-bare' } });
    }],
    [1, 'pair', function (lv) {
      var f = mfact(lv);
      return fill('Multiply, then divide.', m(f.a + X + f.b + ' = [[]]') + ', so ' + m(f.p + DV + f.b + ' = [[]]'), [f.p, f.a], { hint: 'The division uses the same three numbers.', steps: [f.a + X + f.b + ' = ' + f.p + '.', f.p + DV + f.b + ' = ' + f.a + '.'], explain: f.a + X + f.b + ' = ' + f.p + ', ' + f.p + DV + f.b + ' = ' + f.a + '.', meta: { k: 'g3md-eqs' } });
    }],
    [1, 'story', function (lv) {
      var s = story3(R.pick(KINDS), lv);
      return num(s.t, s.ans, mixFix(s), { hint: s.op === 'x' ? 'Equal groups put together: multiply.' : 'A total split into equal groups: divide.', steps: [s.x + opSym(s.op) + s.y + ' = ' + s.ans + '.'], explain: s.x + opSym(s.op) + s.y + ' = ' + s.ans + '.', meta: mt(s.x, s.y, s.op) });
    }],
    [1, 'match', function (lv) {
      var P = pairs3(function () { var f = mfact(lv); return coin() ? [f.a + X + f.b, String(f.p)] : [f.p + DV + f.b, String(f.a)]; });
      return { q: 'Match each fact to its answer.', type: 'match', pairs: P, hint: 'Look at the sign first.', steps: ['&times;: groups of. &divide;: split into equal groups.'], explain: P.map(function (x) { return x[0] + ' = ' + x[1]; }).join('. ') + '.', meta: { k: 'g3md-match-eval' } };
    }]
  ]);
  function tgMixed(lv) {
    return function () {
      var a = R.int(6, 9), b = R.int(lv === 1 ? 3 : 4, lv === 3 ? 10 : 8), p = a * b;
      return { q: 'Find ' + m(a + X + b) + ', then ' + m(p + DV + b) + '.', fig: arrayFig(a, b, { labels: true, split: 5 }), done: a + X + b + ' = ' + p + ', so ' + p + DV + b + ' = ' + a + '.', steps: [
        { prompt: 'Split it: 5 rows first.', q: num(m('5' + X + b) + ' = ?', 5 * b, prodFix(5, b), { hint: '5 groups of ' + b + '.', meta: mt(5, b, 'x') }) },
        { prompt: 'Add the other ' + (a - 5) + ' rows of ' + b + '.', q: num(m(a + X + b) + ' = ?', p, fx([[5 * b, 'Add the rows below the line too.']]), { hint: 5 * b + ' + ' + (a - 5) * b + '.', meta: mt(a, b, 'x') }) },
        { prompt: 'Use the same three numbers to divide.', q: num(m(p + DV + b) + ' = ?', a, divFix(p, b), { hint: '? ' + X + b + ' = ' + p + '.', meta: mt(p, b, 'd') }) }
      ] };
    };
  }

  /* ======================= The lessons ======================= */
  var LESSONS = [
    { id: 'groups', title: 'Equal groups', sub: 'Multiplying puts equal groups together.', concepts: [
      { id: 'equal', title: 'Equal groups have the same number', exp: ['B2.6'], skill: 'md-groups',
        watch: clip(platesV, { counts: [4] }, [
          ['One plate with 4.'],
          ['Another plate with 4.', { counts: [4, 4] }],
          ['A third plate with 4.', { counts: [4, 4, 4] }],
          ['3 groups of 4: 4, 8, 12.', { sym: '4 + 4 + 4 = 12' }]
        ]),
        example: clip(platesV, { counts: [5, 6, 5] }, [
          ['My turn. Are these equal groups?'],
          ['I count each plate: 5, 6, 5. Not equal.'],
          ['I move one off. Now each plate has 5.', { counts: [5, 5, 5], pile: 1 }],
          ['3 groups of 5: 5, 10, 15.', { sym: '5 + 5 + 5 = 15' }]
        ]),
        try: { mount: G3.play({ state: { g: 3, n: 4 }, draw: function (s) { return platesFig(same(s.g, s.n)); },
          sliders: [{ key: 'g', label: 'Groups', min: 1, max: 10 }, { key: 'n', label: 'In each group', min: 1, max: 10 }],
          info: function (s) { return pl(s.g, 'group') + ' of ' + s.n + ': <b>' + s.g * s.n + '</b>'; },
          tasks: [{ do: 'Make <b>4 groups of 3</b>.', goal: function (s) { return s.g === 4 && s.n === 3; }, yes: '4 groups of 3 make 12.' },
            { do: 'Make <b>12</b> again, with a different number of groups.', goal: function (s) { return s.g * s.n === 12 && s.g !== 4; }, yes: function (s) { return s.g + ' groups of ' + s.n + ' also make 12.'; } }] }), do: '' },
        together: [tgGroups(1), tgGroups(2), tgGroups(3)],
        mistake: '<p>Counting only the plates, or only one plate, or calling groups "equal" when one has more. Ask: "Does every plate have the same number?" Then skip count together, one plate at a time.</p>',
        check: [ck('md-groups', 'plain', 1), ck('md-groups', 'tap', 1), ck('md-groups', 'story', 2), ck('md-groups', 'tf', 2), ck('md-groups', 'fill', 3)] },

      { id: 'times', title: '3 &times; 4 means 3 groups of 4', exp: ['B2.6'], skill: 'md-times',
        watch: clip(platesV, { counts: same(5, 2) }, [
          ['5 plates, 2 on each.'],
          ['Add them up.', { sym: '2 + 2 + 2 + 2 + 2 = 10' }],
          ['A short way to write it.', { sym: '5 &times; 2 = 10' }],
          ['The first number counts the plates.', { sym: '<b>5</b> plates of 2' }]
        ]),
        example: clip(platesV, { counts: same(4, 3) }, [
          ['My turn. I see 4 plates of 3.'],
          ['I add: 3 + 3 + 3 + 3.', { sym: '3 + 3 + 3 + 3 = 12' }],
          ['4 groups, 3 in each.', { sym: '4 &times; 3 = 12' }],
          ['Is it 4 + 3? No: that is only 7.']
        ]),
        try: { mount: G3.play({ state: { g: 2, n: 4 }, draw: function (s) { return platesFig(same(s.g, s.n)); },
          sliders: [{ key: 'g', label: 'Groups', min: 1, max: 10 }, { key: 'n', label: 'In each group', min: 1, max: 10 }],
          info: function (s) { return '<span class="big">' + s.g + X + s.n + ' = ' + s.g * s.n + '</span>'; },
          tasks: [{ do: 'Show <b>3 &times; 5</b>.', goal: function (s) { return s.g === 3 && s.n === 5; }, yes: '3 groups of 5.' },
            { do: 'Now show <b>5 &times; 3</b>.', goal: function (s) { return s.g === 5 && s.n === 3; }, yes: '5 groups of 3. A new picture, the same total.' }] }), do: '' },
        together: [tgTimes(1), tgTimes(2), tgTimes(3)],
        mistake: '<p>Adding the two numbers (3 &times; 4 = 7), or reading 3 &times; 4 as "4 groups of 3" before the turn-around fact is taught. Ask: "How many groups? How many in each?" and have the child draw the plates.</p>',
        check: [ck('md-times', 'calc', 1), ck('md-times', 'plain', 1), ck('md-times', 'add', 2), ck('md-times', 'tap', 2), ck('md-times', 'groups', 3)] }
    ] },

    { id: 'arrays', title: 'Arrays', sub: 'Equal rows make multiplying easy to see.', concepts: [
      { id: 'rows', title: 'Rows &times; how many in a row', exp: ['B2.6'], skill: 'md-array',
        watch: clip(arrayV, { r: 1, c: 5 }, [
          ['One row of 5.'],
          ['Two rows: 5, 10.', { r: 2, sym: '5, 10' }],
          ['Three rows: 5, 10, 15.', { r: 3, sym: '5, 10, 15' }],
          ['3 rows of 5.', { sym: '3 &times; 5 = 15' }]
        ]),
        example: clip(arrayV, { r: 1, c: 6 }, [
          ['My turn. I make a row of 6.'],
          ['I add rows and count by 6s.', [{ r: 2, sym: '6, 12' }, { r: 3, sym: '6, 12, 18' }, { r: 4, sym: '6, 12, 18, 24' }]],
          ['4 rows of 6.', { sym: '4 &times; 6 = 24' }],
          ['Not 4 + 6: I count every row.']
        ]),
        try: { mount: G3.play({ state: { r: 2, c: 3 }, draw: function (s) { return arrayFig(s.r, s.c, { labels: true }); },
          sliders: [{ key: 'r', label: 'Rows', min: 1, max: 10 }, { key: 'c', label: 'In each row', min: 1, max: 10 }],
          info: function (s) { return '<b>' + s.r + X + s.c + ' = ' + s.r * s.c + '</b>'; },
          tasks: [{ do: 'Build <b>4 &times; 6</b>.', goal: function (s) { return s.r === 4 && s.c === 6; }, yes: '4 rows of 6 make 24.' },
            { do: 'Build an array with <b>20</b> dots.', goal: function (s) { return s.r * s.c === 20; }, yes: function (s) { return s.r + X + s.c + ' = 20.'; } }] }), do: '' },
        together: [tgArray(1), tgArray(2), tgArray(3)],
        mistake: '<p>Counting a row and a column and adding them (4 + 6), or mixing up rows and columns. Rows go across. Run a finger along each row while counting by the number in a row.</p>',
        check: [ck('md-array', 'plain', 1), ck('md-array', 'tap', 1), ck('md-array', 'fill', 2), ck('md-array', 'story', 2), ck('md-array', 'plain', 3)] },

      { id: 'turn', title: 'Turn it around: same answer', exp: ['B2.1', 'B2.6'], skill: 'md-turn',
        watch: clip(arrayV, { r: 2, c: 5, sym: '2 &times; 5 = 10' }, [
          ['2 rows of 5: 10 dots.'],
          ['Turn it on its side.', { r: 5, c: 2, sym: '5 &times; 2 = 10' }],
          ['5 rows of 2. Still 10 dots.'],
          ['The order changed. The dots did not.', { sym: '2 &times; 5 = 5 &times; 2' }]
        ]),
        example: clip(arrayV, { r: 3, c: 6, sym: '3 &times; 6 = 18' }, [
          ['My turn. 3 rows of 6 is 18.'],
          ['I turn it: 6 rows of 3.', { r: 6, c: 3, sym: '6 &times; 3 = ?' }],
          ['I count by 3s: 18 again.', { sym: '6 &times; 3 = 18' }],
          ['So I can use either fact.', { sym: '3 &times; 6 = 6 &times; 3' }]
        ]),
        try: { mount: G3.play({ state: { r: 3, c: 7 }, draw: function (s) { return arrayFig(s.r, s.c, { labels: true }); },
          buttons: [{ label: 'Turn it on its side', act: function (s) { var x = s.r; s.r = s.c; s.c = x; } }],
          info: function (s) { return '<b>' + s.r + X + s.c + ' = ' + s.r * s.c + '</b>'; },
          tasks: [{ do: 'This is 3 &times; 7. <b>Turn it</b> to see 7 &times; 3.', goal: function (s) { return s.r === 7 && s.c === 3; }, yes: 'The same 21 dots. 3 &times; 7 = 7 &times; 3.' }] }), do: '' },
        together: [tgTurn(1), tgTurn(2), tgTurn(3)],
        mistake: '<p>Thinking 6 &times; 4 must be bigger than 4 &times; 6 because the bigger number comes first. Build one array, count it, turn the paper, and count again.</p>',
        check: [ck('md-turn', 'plain', 1), ck('md-turn', 'picture', 1), ck('md-turn', 'fill', 2), ck('md-turn', 'tf', 2), ck('md-turn', 'plain', 3)] },

      { id: 'split', title: 'Split a hard fact into two easy ones', exp: ['B2.1', 'B2.6'], skill: 'md-split',
        watch: clip(arrayV, { r: 7, c: 4 }, [
          ['7 rows of 4. A hard one.'],
          ['Cut it after 5 rows.', { split: 5 }],
          ['Two facts I know.', { parts: true }],
          ['20 + 8 = 28.', { sym: '7 &times; 4 = 28' }]
        ]),
        example: clip(arrayV, { r: 8, c: 3 }, [
          ['My turn. 8 &times; 3.'],
          ['I cut after 5 rows.', { split: 5 }],
          ['5 &times; 3 = 15 and 3 &times; 3 = 9.', { parts: true }],
          ['I add: 15 + 9 = 24.', { sym: '8 &times; 3 = 24' }]
        ]),
        try: { mount: G3.play({ state: { r: 8, c: 5, sp: 0 }, draw: function (s) { return arrayFig(s.r, s.c, { labels: true, split: s.sp, parts: s.sp > 0 }); },
          sliders: [{ key: 'sp', label: 'Cut after row', min: 0, max: 7 }],
          info: function (s) { return s.sp ? s.sp * 5 + ' + ' + (8 - s.sp) * 5 + ' = <b>40</b>' : 'Move the slider to cut 8 &times; 5.'; },
          tasks: [{ do: 'Cut <b>8 &times; 5</b> into two facts you know.', goal: function (s) { return s.sp > 0; }, yes: function (s) { return s.sp * 5 + ' + ' + (8 - s.sp) * 5 + ' = 40. Any cut gives 40.'; } },
            { do: 'Now cut it into <b>two equal halves</b>.', reset: false, goal: function (s) { return s.sp === 4; }, yes: '4 &times; 5 = 20, twice: 40.' }] }), do: '' },
        together: [tgSplit(1), tgSplit(2), tgSplit(3)],
        mistake: '<p>Finding only one part, or adding the row numbers (5 + 2) instead of the parts. Cover the bottom part, say its fact, then cover the top part and say that one.</p>',
        check: [ck('md-split', 'plain', 1), ck('md-split', 'num', 1), ck('md-split', 'parts', 2), ck('md-split', 'mc', 2), ck('md-split', 'plain', 3)] }
    ] },

    { id: 'facts', title: 'Facts of 2, 5 and 10', sub: 'Jump, turn and use the facts you know.', concepts: [
      { id: 'skip', title: 'Jump on a number line to multiply', exp: ['B2.2'], skill: 'md-skip',
        watch: clip(lineV, { k: 5, n: 0, max: 50, count: true }, [
          ['Start at 0. Each jump is 5.'],
          ['4 jumps: 5, 10, 15, 20.', count('n', 1, 4)],
          ['4 jumps of 5 land on 20.', { sym: '4 &times; 5 = 20' }]
        ]),
        example: clip(lineV, { k: 2, n: 0, max: 20, count: true }, [
          ['My turn. 7 &times; 2 is 7 jumps of 2.'],
          ['I count: 2, 4, 6, 8, 10, 12, 14.', count('n', 1, 7)],
          ['I land on 14.', { sym: '7 &times; 2 = 14' }],
          ['Not 7 + 2 = 9: I count all 7 jumps.']
        ]),
        try: { tool: 'numberline', opts: { min: 0, max: 100, tick: 5, every: 10, start: 0, step: [2, 5, 10] }, tasks: [
          { do: 'Show <b>8 &times; 2</b>: 8 jumps of 2.', goal: function (s) { return s.at === 16; }, yes: '8 jumps of 2 land on 16.' },
          { do: 'Start again from 0. Show <b>6 &times; 10</b>.', goal: function (s) { return s.at === 60; }, yes: '6 jumps of 10 land on 60.' }
        ] },
        together: [tgSkip(1), tgSkip(2), tgSkip(3)],
        mistake: '<p>Losing count of the jumps, or answering with the number of jumps instead of the landing spot. Hold up one finger for each jump.</p>',
        check: [ck('md-skip', 'plain', 1), ck('md-skip', 'count', 1), ck('md-skip', 'line', 2), ck('md-skip', 'story', 2), ck('md-skip', 'tf', 3)] },

      { id: 'turnfacts', title: 'Turn it to count by 2s, 5s or 10s', exp: ['B2.2', 'B2.1'], skill: 'md-useturn',
        watch: clip(twoV, { a: 5, b: 7, top: 0, bot: 0 }, [
          ['5 &times; 7 is 5 jumps of 7. Hard to count.', count('top', 1, 5)],
          ['Turn it: 7 jumps of 5.', { sym: '5 &times; 7 = 7 &times; 5' }],
          ['Count by 5s: 5, 10, 15 and on.', count('bot', 1, 7)],
          ['Both land on 35.', { sym: '5 &times; 7 = 35' }]
        ]),
        example: clip(twoV, { a: 2, b: 9, top: 0, bot: 0 }, [
          ['My turn. 2 &times; 9 is 2 jumps of 9.', count('top', 1, 2)],
          ['I turn it: 9 &times; 2. I know my 2s.', { sym: '2 &times; 9 = 9 &times; 2' }],
          ['I count by 2s, 9 times.', count('bot', 1, 9)],
          ['The same landing: 18.', { sym: '2 &times; 9 = 18' }]
        ]),
        together: [tgUseturn(1), tgUseturn(2), tgUseturn(3)],
        mistake: '<p>Counting by the wrong number the wrong number of times (for 5 &times; 7, counting by 5s five times). Say the turned fact aloud first: "5 &times; 7 is the same as 7 &times; 5: seven 5s."</p>',
        check: [ck('md-useturn', 'plain', 1), ck('md-useturn', 'picture', 1), ck('md-useturn', 'which', 2), ck('md-useturn', 'fill', 2), ck('md-useturn', 'plain', 3)] },

      { id: 'patterns', title: 'Each set of facts has a pattern', exp: ['B2.2'], skill: 'md-pattern',
        watch: clip(chartV, { k: 2 }, [
          ['Facts of 2: every second number. All even.'],
          ['Facts of 5 end in 5 or 0.', { k: 5 }],
          ['Facts of 10 end in 0.', { k: 10 }]
        ]),
        example: clip(chartV, { k: 5, mark: 45 }, [
          ['My turn. Is 45 a fact of 5? It ends in 5: yes.'],
          ['Is 45 a fact of 2? It is odd: no.', { k: 2 }],
          ['Is 60 a fact of 10? It ends in 0: yes.', { k: 10, mark: 60 }]
        ]),
        try: { tool: 'hundred', opts: {}, tasks: [
          { do: 'Tap all the facts of 10 on the chart.', goal: function (s) { return s.lit.length === 10 && s.lit.every(function (n) { return n % 10 === 0; }); }, yes: 'One straight column. Every one ends in 0.' }
        ] },
        together: [tgPattern(5), tgPattern(2), tgPattern(10)],
        mistake: '<p>Thinking any number ending in 5 is a fact of 2, or that 52 is a fact of 5 because it has a 5 in it. Point to the last digit only.</p>',
        check: [ck('md-pattern', 'plain', 1), ck('md-pattern', 'pick', 1), ck('md-pattern', 'tens', 2), ck('md-pattern', 'tf', 2), ck('md-pattern', 'double', 3)] },

      { id: 'near', title: 'Add or take away one group', exp: ['B2.2', 'B2.1'], skill: 'md-near',
        watch: clip(arrayV, { r: 5, c: 6, sym: '5 &times; 6 = 30' }, [
          ['I know 5 &times; 6 = 30.'],
          ['6 &times; 6 is one more row of 6.', { r: 6, split: 5, sym: '30 + 6' }],
          ['30 + 6 = 36.', { sym: '6 &times; 6 = 36' }]
        ]),
        example: clip(arrayV, { r: 10, c: 4, sym: '10 &times; 4 = 40' }, [
          ['My turn. 9 &times; 4. I know 10 &times; 4 = 40.'],
          ['9 rows is one row less.', { off: 9, sym: '40 &minus; 4' }],
          ['40 &minus; 4 = 36.', { sym: '9 &times; 4 = 36' }],
          ['Not 40 &minus; 1: a row is 4.']
        ]),
        together: [tgNear(1), tgNear(2), tgNear(3)],
        mistake: '<p>Adding or taking away 1 instead of a whole group (9 &times; 4 = 40 &minus; 1). Draw the extra or missing row and count its dots.</p>',
        check: [ck('md-near', 'plain', 1), ck('md-near', 'picture', 1), ck('md-near', 'fill', 2), ck('md-near', 'mc', 2), ck('md-near', 'plain', 3)] }
    ] },

    { id: 'divide', title: 'Dividing', sub: 'Share fairly, or make groups.', concepts: [
      { id: 'share', title: 'Share out one at a time', exp: ['B2.6'], skill: 'md-share',
        watch: clip(dealV, { total: 12, k: 3, dealt: 0 }, [
          ['12 counters, 3 plates.'],
          ['One to each plate, again and again.', count('dealt', 1, 12)],
          ['4 on each plate.', { sym: '12 &divide; 3 = 4' }]
        ]),
        example: clip(dealV, { total: 15, k: 5, dealt: 0 }, [
          ['My turn. 15 grapes, 5 plates.'],
          ['I deal one to each, round and round.', count('dealt', 1, 15)],
          ['3 on each plate.', { sym: '15 &divide; 5 = 3' }],
          ['I check: 5 groups of 3 is 15.', { sym: '5 &times; 3 = 15' }]
        ]),
        try: { mount: G3.play({ state: { total: 15, k: 3, dealt: 0 }, draw: function (s) { return platesFig(dealCounts(s.total, s.k, s.dealt), { pile: s.total - s.dealt }); },
          buttons: [{ label: 'Deal one to each', act: function (s) { s.dealt = Math.min(s.total, s.dealt + s.k); } }, { label: 'Start over', act: function (s) { s.dealt = 0; } }],
          info: function (s) { return s.dealt < s.total ? Math.floor(s.dealt / s.k) + ' on each so far.' : '<b>' + s.total + DV + s.k + ' = ' + s.total / s.k + '</b>'; },
          tasks: [{ do: 'Share <b>15</b> on <b>3</b> plates.', goal: function (s) { return s.dealt === 15; }, yes: '5 on each. 15 &divide; 3 = 5.' },
            { do: 'Now share <b>20</b> on <b>4</b> plates.', setup: function (s) { s.total = 20; s.k = 4; }, goal: function (s) { return s.dealt === 20; }, yes: '5 on each. 20 &divide; 4 = 5.' }] }), do: '' },
        together: [tgShare(1), tgShare(2), tgShare(3)],
        mistake: '<p>Giving some plates more than others, or answering with the number of plates. Deal one at a time, then check that every plate matches.</p>',
        check: [ck('md-share', 'plain', 1), ck('md-share', 'tap', 1), ck('md-share', 'story', 2), ck('md-share', 'tf', 2), ck('md-share', 'bare', 3)] },

      { id: 'group', title: 'Make groups to divide', exp: ['B2.6'], skill: 'md-groupdiv',
        watch: clip(bagV, { total: 20, size: 5, bags: 0 }, [
          ['20 stickers. Bags of 5.'],
          ['Fill a bag of 5, then another.', count('bags', 1, 4)],
          ['4 bags.', { sym: '20 &divide; 5 = 4' }]
        ]),
        example: clip(bagV, { total: 18, size: 3, bags: 0 }, [
          ['My turn. 18 crayons, boxes of 3.'],
          ['I fill boxes of 3 until none are left.', count('bags', 1, 6)],
          ['6 boxes.', { sym: '18 &divide; 3 = 6' }],
          ['Not 3 boxes: 3 is how many in each.']
        ]),
        try: { mount: G3.play({ state: { total: 18, size: 2, bags: 0 }, draw: bagV,
          buttons: [{ label: 'Fill a bag', act: function (s) { if ((s.bags + 1) * s.size <= s.total) s.bags++; } }, { label: 'Start over', act: function (s) { s.bags = 0; } }],
          info: function (s) { return pl(s.bags, 'bag') + ' of ' + s.size + (s.bags * s.size === s.total ? ': <b>' + s.total + DV + s.size + ' = ' + s.bags + '</b>' : ''); },
          tasks: [{ do: 'How many bags of <b>2</b> from <b>18</b>?', goal: function (s) { return s.bags * s.size === s.total; }, yes: '9 bags. 18 &divide; 2 = 9.' },
            { do: 'How many bags of <b>10</b> from <b>50</b>?', setup: function (s) { s.total = 50; s.size = 10; }, goal: function (s) { return s.bags * s.size === s.total; }, yes: '5 bags. 50 &divide; 10 = 5.' }] }), do: '' },
        together: [tgGroupdiv(1), tgGroupdiv(2), tgGroupdiv(3)],
        mistake: '<p>Answering with the group size (5) instead of the number of groups (4). Ask: "How many bags did you fill?"</p>',
        check: [ck('md-groupdiv', 'plain', 1), ck('md-groupdiv', 'tap', 1), ck('md-groupdiv', 'line', 2), ck('md-groupdiv', 'story', 2), ck('md-groupdiv', 'story', 3)] },

      { id: 'which', title: 'Multiply or divide?', exp: ['B2.6'], skill: 'md-mixop',
        watch: clip(platesV, { counts: [4, 4, 4] }, [
          ['3 plates of 4. How many in all? Multiply.', { sym: '3 &times; 4 = 12' }],
          ['12 on 3 plates. How many on each? Divide.', { sym: '12 &divide; 3 = 4' }],
          ['12 in bags of 4. How many bags? Divide.', { bags: true, sym: '12 &divide; 4 = 3' }]
        ]),
        example: clip(platesV, { counts: same(5, 6) }, [
          ['My turn. 5 teams of 6. How many players? I multiply.', { sym: '5 &times; 6 = 30' }],
          ['30 players, 5 teams. How many on each? I divide.', { sym: '30 &divide; 5 = 6' }],
          ['30 players, teams of 6. How many teams? I divide.', { bags: true, sym: '30 &divide; 6 = 5' }]
        ]),
        together: [tgMix('times'), tgMix('share'), tgMix('group')],
        mistake: '<p>Grabbing the two numbers and adding or multiplying them without reading the question. Ask: "Do you know the total? Then you are splitting it: divide."</p>',
        check: [ck('md-mixop', 'mean', 1), ck('md-mixop', 'plain', 1), ck('md-mixop', 'which', 2), ck('md-mixop', 'calc', 2), ck('md-mixop', 'two', 3)] }
    ] },

    { id: 'family', title: 'Fact families', sub: 'Multiplying and dividing use the same facts.', concepts: [
      { id: 'four', title: 'Same three numbers, four facts', exp: ['B2.1'], skill: 'md-family',
        watch: clip(famV, { a: 4, b: 5 }, [
          ['4 rows of 5.', { sym: famLines(4, 5, 1) }],
          ['Turn it around.', { sym: famLines(4, 5, 2) }],
          ['20 in 4 rows: 5 in each.', { sym: famLines(4, 5, 3) }],
          ['20 in rows of 5: 4 rows.', { sym: famLines(4, 5, 4) }]
        ]),
        example: clip(famV, { a: 3, b: 6 }, [
          ['My turn. 3 rows of 6.', { sym: famLines(3, 6, 1) }],
          ['I turn it around.', { sym: famLines(3, 6, 2) }],
          ['18 in 3 rows: 6 in each.', { sym: famLines(3, 6, 3) }],
          ['18 in rows of 6: 3 rows.', { sym: famLines(3, 6, 4) }]
        ]),
        try: { mount: G3.play({ state: { a: 3, b: 10 }, draw: function (s) { return arrayFig(s.a, s.b, { labels: true }) + '<p class="g3-sym">' + famLines(s.a, s.b, 4) + '</p>'; },
          sliders: [{ key: 'a', label: 'Rows', min: 2, max: 10 }, { key: 'b', label: 'In each row', min: 2, max: 10 }],
          tasks: [{ do: 'Show the fact family of <b>2, 5 and 10</b>.', goal: function (s) { return s.a * s.b === 10 && s.a !== 1 && s.b !== 1; }, yes: '2 &times; 5, 5 &times; 2, 10 &divide; 2, 10 &divide; 5.' }] }), do: '' },
        together: [tgFamily(1), tgFamily(2), tgFamily(3)],
        mistake: '<p>Putting a fact with a new number into the family (20 &divide; 4 = 6), or adding a plus fact. Every fact uses the same three numbers, with &times; or &divide;.</p>',
        check: [ck('md-family', 'plain', 1), ck('md-family', 'array', 1), ck('md-family', 'missing', 2), ck('md-family', 'pick', 2), ck('md-family', 'odd', 3)] },

      { id: 'check', title: 'Check a division with &times;', exp: ['B2.1'], skill: 'md-check',
        watch: clip(platesV, { counts: same(6, 5), bags: true, sym: '35 &divide; 5 = 6?' }, [
          ['Jo says 35 &divide; 5 = 6. Check: 6 bags of 5.'],
          ['6 &times; 5 = 30, not 35.', { sym: '6 &times; 5 = 30' }],
          ['One more bag: 7 &times; 5 = 35.', { counts: same(7, 5), sym: '35 &divide; 5 = 7' }]
        ]),
        example: clip(platesV, { counts: same(5, 4), bags: true, sym: '24 &divide; 4 = 5?' }, [
          ['My turn. Ali says 24 &divide; 4 = 5.'],
          ['I multiply: 5 &times; 4 = 20. Too small.', { sym: '5 &times; 4 = 20' }],
          ['One more bag: 6 &times; 4 = 24.', { counts: same(6, 4), sym: '24 &divide; 4 = 6' }]
        ]),
        together: [tgCheck(1), tgCheck(2), tgCheck(3)],
        mistake: '<p>Checking with the wrong operation (6 + 5), or multiplying the total (35 &times; 5). The check is always: answer &times; the number you divided by.</p>',
        check: [ck('md-check', 'plain', 1), ck('md-check', 'fill', 1), ck('md-check', 'fix', 2), ck('md-check', 'which', 2), ck('md-check', 'story', 3)] }
    ] },

    { id: 'scale', title: 'Scaling up', sub: 'For every 1, there are 2, 5 or 10.', concepts: [
      { id: 'ratio', title: 'For every 1, there are 2, 5 or 10', exp: ['B2.9'], skill: 'md-scale',
        watch: clip(ratioV, { k: 5, n: 1 }, [
          ['1 star has 5 points.'],
          ['Each new star adds 5 more.', [{ n: 2 }, { n: 3 }, { n: 4 }]],
          ['4 stars: 20 points.', { sym: '4 &times; 5 = 20' }]
        ]),
        example: clip(ratioV, { k: 2, n: 1 }, [
          ['My turn. 1 bike has 2 wheels.'],
          ['I add bikes: 2 more wheels each time.', [{ n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }]],
          ['5 bikes: 10 wheels.', { sym: '5 &times; 2 = 10' }],
          ['Not 5 + 2: each bike brings 2.']
        ]),
        try: { mount: G3.play({ state: { k: 2, n: 1 }, draw: ratioV,
          selects: [{ key: 'k', label: 'For every 1, there are', options: [[2, '2 (bikes and wheels)'], [5, '5 (stars and points)'], [10, '10 (dimes and cents)']] }],
          sliders: [{ key: 'n', label: 'How many', min: 1, max: 10 }],
          tasks: [{ do: 'How many wheels on <b>6 bikes</b>?', goal: function (s) { return s.k === 2 && s.n === 6; }, yes: '6 &times; 2 = 12 wheels.' },
            { do: 'How many cents are <b>8 dimes</b> worth?', goal: function (s) { return s.k === 10 && s.n === 8; }, yes: '8 &times; 10 = 80 cents.' }] }), do: '' },
        together: [tgRatio(1), tgRatio(2), tgRatio(3)],
        mistake: '<p>Adding instead of multiplying (5 bikes have 7 wheels), or adding 1 each time. Fill in the table one column at a time: "One more bike, how many more wheels?"</p>',
        check: [ck('md-scale', 'plain', 1), ck('md-scale', 'table', 1), ck('md-scale', 'story', 2), ck('md-scale', 'tf', 2), ck('md-scale', 'plain', 3)] },

      { id: 'back', title: 'Work back from the total', exp: ['B2.9'], skill: 'md-back',
        watch: clip(lineV, { k: 10, n: 0, max: 70, count: true }, [
          ['70&cent; in dimes. How many dimes?'],
          ['Count by 10s to 70.', count('n', 1, 7)],
          ['7 jumps: 7 dimes.', { sym: '70 &divide; 10 = 7' }]
        ]),
        example: clip(lineV, { k: 5, n: 0, max: 35, count: true }, [
          ['My turn. 35&cent; in nickels.'],
          ['I count by 5s to 35.', count('n', 1, 7)],
          ['I count the jumps: 7 nickels.', { sym: '35 &divide; 5 = 7' }],
          ['Not 35 nickels: each one is 5&cent;.']
        ]),
        try: { tool: 'numberline', opts: { min: 0, max: 50, tick: 1, every: 5, start: 0, step: [2, 5, 10] }, tasks: [
          { do: '16 wheels. How many bikes? Jump by 2s to 16 and count the jumps.', goal: function (s) { return s.at === 16; }, yes: '8 jumps: 8 bikes.' }
        ] },
        together: [tgBack(1), tgBack(2), tgBack(3)],
        mistake: '<p>Multiplying again (70 &times; 10) when the total is already known. Ask: "Do we know one, or all of them?"</p>',
        check: [ck('md-back', 'plain', 1), ck('md-back', 'coins', 1), ck('md-back', 'table', 2), ck('md-back', 'mc', 2), ck('md-back', 'tf', 3)] }
    ] },

    { id: 'fluency', title: 'Fact fluency', sub: 'Know the facts quickly.', concepts: [
      { id: 'facts', title: 'The 2, 5 and 10 facts by heart', exp: ['B2.2'], skill: 'md-facts',
        watch: clip(stripV, { k: 2, n: 0 }, [
          ['The 2s: double each number.', count('n', 1, 10)],
          ['The 5s: 5, 10, 15 and on to 50.', [{ k: 5, n: 0 }].concat(count('n', 1, 10))],
          ['The 10s: 10, 20, 30 and on to 100.', [{ k: 10, n: 0 }].concat(count('n', 1, 10))]
        ]),
        example: clip(stripV, { k: 5, n: 5 }, [
          ['My turn. 8 &times; 5. I know 5 &times; 5 = 25.'],
          ['I count on: 30, 35, 40.', count('n', 6, 8)],
          ['8 &times; 5 = 40.', { sym: '8 &times; 5 = 40' }],
          ['5 &times; 8 is the same: 40.', { sym: '5 &times; 8 = 40' }]
        ]),
        together: [tgFacts(2), tgFacts(5), tgFacts(10)],
        mistake: '<p>Counting from 0 every time. Anchor on 5 &times; and 10 &times; facts, then count on or back. A few minutes of practice each day works better than one long session.</p>',
        check: [ck('md-facts', 'plain', 1), ck('md-facts', 'missing', 1), ck('md-facts', 'row', 2), ck('md-facts', 'plain', 2), ck('md-facts', 'plain', 3)] },

      { id: 'divfacts', title: 'Divide: think of the times fact', exp: ['B2.2'], skill: 'md-divfacts',
        watch: clip(lineV, { k: 5, n: 0, max: 50, count: true }, [
          ['40 &divide; 5: how many 5s make 40?'],
          ['Count by 5s to 40.', count('n', 1, 8)],
          ['8 jumps.', { sym: '40 &divide; 5 = 8' }],
          ['Because 8 &times; 5 = 40.', { sym: '8 &times; 5 = 40' }]
        ]),
        example: clip(lineV, { k: 2, n: 0, max: 20, count: true }, [
          ['My turn. 18 &divide; 2.'],
          ['I count by 2s to 18.', count('n', 1, 9)],
          ['9 twos.', { sym: '18 &divide; 2 = 9' }],
          ['I check: 9 &times; 2 = 18.', { sym: '9 &times; 2 = 18' }]
        ]),
        together: [tgDiv(1), tgDiv(2), tgDiv(3)],
        mistake: '<p>Subtracting instead of dividing (40 &divide; 5 = 35). Read it as "how many 5s make 40?" and find the times fact.</p>',
        check: [ck('md-divfacts', 'plain', 1), ck('md-divfacts', 'think', 1), ck('md-divfacts', 'row', 2), ck('md-divfacts', 'plain', 2), ck('md-divfacts', 'plain', 3)] },

      { id: 'mixed', title: 'All the facts to 10 &times; 10', exp: ['B2.6', 'B2.2'], skill: 'md-mixed',
        watch: clip(chartXV, { r: 0, c: 0 }, [
          ['Row 6: 6 groups. Column 7: 7 in each.', { r: 6, c: 7 }],
          ['They meet at 42.', { show: true, sym: '6 &times; 7 = 42' }],
          ['Back the other way: 42 in row 6 is under 7.', { sym: '42 &divide; 6 = 7' }]
        ]),
        example: clip(chartXV, { r: 0, c: 0 }, [
          ['My turn. 8 &times; 4: row 8, column 4.', { r: 8, c: 4 }],
          ['They meet at 32.', { show: true, sym: '8 &times; 4 = 32' }],
          ['32 &divide; 4: 32 is in column 4, row 8.', { sym: '32 &divide; 4 = 8' }]
        ]),
        together: [tgMixed(1), tgMixed(2), tgMixed(3)],
        mistake: '<p>Mixing up &times; and &divide; when they come mixed together. Have the child say the sign aloud before answering: "times" or "divided by".</p>',
        check: [ck('md-mixed', 'plain', 1), ck('md-mixed', 'pair', 1), ck('md-mixed', 'story', 2), ck('md-mixed', 'plain', 2), ck('md-mixed', 'plain', 3)] }
    ] }
  ];

  A.register(CH, {
    full: true,
    lessons: LESSONS,
    quiz: [
      num('How many counters in all?', 18, prodFix(3, 6), { fig: platesFig(same(3, 6)), hint: 'Count the plates, then one plate.', explain: '3 groups of 6: 6, 12, 18.', meta: { k: 'g3md-fig-total' } }),
      mc('Which fact matches this array?', '4' + X + '7', [['4 + 7', 'Rows times how many in a row.'], ['3' + X + '7', 'Count the rows again.'], ['7' + X + '7', 'Count the rows again.']], { fig: arrayFig(4, 7), hint: 'Count the rows. Count one row.', explain: '4 rows of 7: 4 &times; 7 = 28.', meta: { k: 'g3md-arr-mc' } }),
      num(m('7' + X + '5') + ' = ?', 35, prodFix(7, 5), { hint: 'Count by 5s, 7 times.', explain: '7 &times; 5 = 35.', meta: { k: 'g3md-bare' } }),
      num(m('24' + DV + '4') + ' = ?', 6, divFix(24, 4), { hint: 'Think: ? &times; 4 = 24.', explain: '6 &times; 4 = 24, so 24 &divide; 4 = 6.', meta: { k: 'g3md-bare' } }),
      fill('Use ' + m('3' + X + '10 = 30') + '. Fill in the blanks.', m('30' + DV + '10 = [[]]') + '<br>' + m('30' + DV + '3 = [[]]'), [3, 10], { hint: 'The same three numbers.', explain: '30 &divide; 10 = 3 and 30 &divide; 3 = 10.', meta: { k: 'g3md-eqs' } }),
      num('1 star has 5 points. How many points do 9 stars have?', 45, prodFix(9, 5), { hint: 'Count by 5s, 9 times.', explain: '9 &times; 5 = 45.', meta: mt(9, 5, 'x') }),
      num('Use ' + m('5' + X + '6 = 30') + ' and ' + m('2' + X + '6 = 12') + ' to find ' + m('7' + X + '6') + '.', 42, fx([[30, 'Add the bottom part too.']]), { fig: arrayFig(7, 6, { split: 5 }), hint: '7 rows is 5 rows and 2 rows.', explain: '30 + 12 = 42.', meta: mt(7, 6, 'x') }),
      num('How many dimes make 80&cent;?', 8, divFix(80, 10), { hint: 'Count by 10s to 80.', explain: '80 &divide; 10 = 8.', meta: mt(80, 10, 'd') })
    ],
    practice: SKILLS.map(function (s) { return { id: s.id, name: s.name, code: s.code, gen: DEF[s.id][0][2] }; })
  });

  /* every skill's other shapes (docs/QUESTIONS.md); each skill keeps its first way of asking as "plain" */
  var SHAPES = {};
  SKILLS.forEach(function (s) { SHAPES[s.id] = DEF[s.id].slice(1); });
  Q.shapes(CH, SHAPES);
})();
