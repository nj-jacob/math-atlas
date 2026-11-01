/* Grade 3 Length and area: a full chapter (docs/QUESTIONS.md, "Full chapters"). 5 lessons, 17 ideas, one practice skill per idea.
   Ontario 2020: E2.1 perimeter (polygons, curved shapes, building a perimeter), E2.2 mm, cm, m and km and benchmarks, E2.5 units of
   different sizes, E2.7 comparing areas and same area, E2.8 gaps and overlaps, E2.9 square centimetres and square metres.
   Units of length always run one way, smallest first: 10 mm = 1 cm, 100 cm = 1 m, 1000 m = 1 km.
   Every question sets meta.k; the answer checks are in tests/verify/grade3.js (keys start with g3la-). */
(function () {
  var A = Atlas, R = A.R, Q = A.Q, CH = 'length-area';

  /* ---------- words and question builders ---------- */
  function put(o, x) { for (var k in x) o[k] = x[k]; return o; }
  function plain(h) { var e = document.createElement('div'); e.innerHTML = h; return e.textContent.replace(/\s+/g, ' ').trim(); }
  function coin() { return Math.random() < 0.5; }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function add(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
  /* pick one: the right answer and up to 3 wrong ones, each with the fix for that mistake: wrongs = [[html, fix], ...] */
  function mc(q, right, wrongs, x) {
    var seen = {}, opts = [right], fix = {};
    seen[plain(right)] = 1;
    wrongs.forEach(function (w) { var t = plain(w[0]); if (opts.length >= 4 || seen[t]) return; seen[t] = 1; opts.push(w[0]); if (w[1]) fix[t] = w[1]; });
    var o = R.shuffle(opts);
    return put({ q: q, type: 'mc', options: o, answer: o.indexOf(right), wrong: fix }, x || {});
  }
  /* pick one, in a fixed order; fixes[j] is the fix for choice j */
  function fixed(q, opts, ans, fixes, x) { var w = {}; opts.forEach(function (o, j) { if (j !== ans && fixes && fixes[j]) w[plain(o)] = fixes[j]; }); return put({ q: q, type: 'mc', options: opts, answer: ans, wrong: w }, x || {}); }
  function num(q, ans, fixes, x) { var w = {}; Object.keys(fixes || {}).forEach(function (k) { if (+k !== ans && k !== 'NaN') w[k] = fixes[k]; }); return put({ q: q, type: 'num', answer: ans, wrong: w }, x || {}); }
  function fill(q, text, answers, x) { return put({ q: q, type: 'fill', fill: text, answers: answers }, x || {}); }
  function tf(q, truth, right, bad, fix, x) {
    var o = R.mc(right, bad), w = {};
    w[truth ? 'False' : 'True'] = fix;
    return put({ q: q, type: 'tf', answer: truth, why: { options: o.options, answer: o.answer }, wrong: w, steps: [right], explain: right }, x || {});
  }

  /* ---------- pictures ---------- */
  function r1(v) { return Math.round(v * 10) / 10; }
  function T(x, y, t, sz, cls, anchor) { return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (anchor || 'middle') + '" font-size="' + (sz || 18) + '" class="' + (cls || 'tb') + '">' + t + '</text>'; }
  var LINE = 'style="stroke:var(--ink)" stroke-width="2.5"';
  function tint(c, p) { return 'color-mix(in srgb,' + c + ' ' + (p || 35) + '%,var(--card))'; }
  /* small drawings of things to measure */
  var ICON = {
    ant: '<g style="stroke:var(--ink)" stroke-width="2.5" fill="none"><path d="M56 56 l-12 16 M66 58 v16 M76 56 l12 16 M56 46 l-12 -14 M66 44 v-14 M76 46 l12 -14 M34 44 q-6 -14 -16 -16 M36 42 q0 -16 -8 -22"/></g><g style="fill:var(--ink)"><ellipse cx="40" cy="50" rx="11" ry="9"/><ellipse cx="64" cy="51" rx="10" ry="8"/><ellipse cx="94" cy="50" rx="18" ry="12"/></g>',
    bug: '<circle cx="70" cy="22" r="11" style="fill:var(--ink)"/><circle cx="70" cy="52" r="30" style="fill:var(--bad);stroke:var(--ink)" stroke-width="2.5"/><line x1="70" y1="24" x2="70" y2="82" ' + LINE + '/><g style="fill:var(--ink)"><circle cx="56" cy="44" r="5"/><circle cx="84" cy="44" r="5"/><circle cx="58" cy="64" r="5"/><circle cx="82" cy="64" r="5"/></g>',
    rice: '<ellipse cx="70" cy="46" rx="36" ry="14" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><path d="M44 44 q26 -8 52 0" fill="none" style="stroke:var(--line)" stroke-width="2"/>',
    crayon: '<rect x="20" y="36" width="82" height="22" rx="3" style="fill:var(--sb);stroke:var(--ink)" stroke-width="2.5"/><polygon points="102,36 122,47 102,58" style="fill:var(--sb);stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/><line x1="34" y1="36" x2="34" y2="58" style="stroke:var(--card)" stroke-width="3"/><line x1="88" y1="36" x2="88" y2="58" style="stroke:var(--card)" stroke-width="3"/>',
    pencil: '<rect x="6" y="36" width="104" height="22" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2.5"/><rect x="6" y="36" width="14" height="22" style="fill:var(--sf);stroke:var(--ink)" stroke-width="2.5"/><polygon points="110,36 132,47 110,58" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/><polygon points="126,44 132,47 126,50" style="fill:var(--ink)"/>',
    book: '<rect x="34" y="10" width="72" height="72" rx="4" style="fill:var(--sc);stroke:var(--ink)" stroke-width="2.5"/><rect x="34" y="10" width="12" height="72" style="fill:var(--ink)" opacity=".3"/><line x1="56" y1="30" x2="94" y2="30" style="stroke:var(--card)" stroke-width="3"/>',
    door: '<rect x="40" y="4" width="60" height="84" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><rect x="46" y="10" width="48" height="78" style="fill:var(--se);stroke:var(--ink)" stroke-width="2.5"/><circle cx="85" cy="50" r="4" style="fill:var(--ink)"/>',
    bus: '<rect x="6" y="20" width="128" height="50" rx="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2.5"/><g style="fill:var(--card);stroke:var(--ink)" stroke-width="2"><rect x="16" y="28" width="20" height="16"/><rect x="42" y="28" width="20" height="16"/><rect x="68" y="28" width="20" height="16"/><rect x="104" y="28" width="22" height="22"/></g><g style="fill:var(--ink)"><circle cx="34" cy="72" r="10"/><circle cx="106" cy="72" r="10"/></g>',
    canoe: '<path d="M6 40 Q70 84 134 40 Q70 54 6 40 Z" style="fill:var(--se);stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/><line x1="92" y1="10" x2="62" y2="64" ' + LINE + '/><ellipse cx="60" cy="68" rx="6" ry="11" transform="rotate(30 60 68)" style="fill:var(--se);stroke:var(--ink)" stroke-width="2"/>',
    trail: '<path d="M8 84 C 40 70, 26 46, 64 44 S 112 26, 132 8" fill="none" style="stroke:var(--sd)" stroke-width="6" stroke-dasharray="10 6" stroke-linecap="round"/><g style="fill:var(--sd)"><polygon points="20,40 30,14 40,40"/><polygon points="98,70 108,44 118,70"/><polygon points="112,34 120,14 128,34"/></g>',
    road: '<polygon points="54,6 86,6 136,88 4,88" style="fill:var(--ink2)" opacity=".75"/><path d="M70 10 V86" style="stroke:var(--hi)" stroke-width="4" stroke-dasharray="10 9"/>'
  };
  function pic(k, label) { return A.svg(140, 92, ICON[k], label); }
  /* the four units, smallest first, with one benchmark each; hi = the box (or boxes) to light up */
  var BENCH = [['mm', 'thickness', 'of a dime'], ['cm', 'width of a', 'fingernail'], ['m', 'one big', 'step'], ['km', 'a 15-minute', 'walk']];
  function benchFig(hi) {
    var s = '';
    BENCH.forEach(function (b, i) {
      var x = 4 + i * 103, on = hi === i || (Array.isArray(hi) && hi.indexOf(i) >= 0);
      s += '<rect x="' + x + '" y="4" width="97" height="104" rx="12" style="fill:' + (on ? tint('var(--hi)', 60) : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/>' + T(x + 48.5, 44, b[0], 30) + T(x + 48.5, 74, b[1], 15, 't2') + T(x + 48.5, 93, b[2], 15, 't2');
    });
    s += '<path d="M60 126 H350" ' + LINE + '/><polygon points="350,119 364,126 350,133" style="fill:var(--ink)"/>' + T(4, 131, 'small', 15, 't2', 'start') + T(412, 131, 'big', 15, 't2', 'end');
    return A.svg(416, 140, s, 'Units of length, smallest first: millimetre, centimetre, metre, kilometre');
  }
  /* footprints: n big steps along a hallway */
  function stepsFig(n, each) {
    var s = '<line x1="10" y1="44" x2="' + (30 + n * 42) + '" y2="44" style="stroke:var(--line)" stroke-width="2"/>';
    for (var i = 0; i < n; i++) s += '<ellipse cx="' + (30 + i * 42) + '" cy="' + (i % 2 ? 58 : 30) + '" rx="9" ry="14" style="fill:var(--sb)" opacity=".8"/>';
    s += '<path d="M30 80 V86 H72 V80" fill="none" ' + LINE + '/>' + T(51, 104, each, 16);
    return A.svg(Math.max(160, 50 + n * 42), 112, s, n + ' footprints, each step about ' + each);
  }
  /* a ruler in cm with something lying on it from a to b (in mm). Bigger rulers drop the mm marks. */
  var OBJC = { pencil: 'var(--hi)', crayon: 'var(--sb)', ribbon: 'var(--sf)' };
  function ruler(o) {
    var max = o.max || 10, x0 = 20, U = 380 / (max * 10), every = max <= 15 ? 1 : max <= 30 ? 5 : 10, mm = max <= 15, y = o.obj ? 62 : 6, s = '', i;
    if (o.obj) {
      var xa = r1(x0 + o.a * U), xb = r1(x0 + o.b * U);
      if (o.obj === 'string') s += '<path d="M' + xa + ' 34 H' + xb + '" fill="none" style="stroke:var(--bad)" stroke-width="5" stroke-linecap="round"/>';
      else if (o.obj === 'ribbon') s += '<rect x="' + xa + '" y="22" width="' + r1(xb - xa) + '" height="24" rx="3" style="fill:' + OBJC.ribbon + ';stroke:var(--ink)" stroke-width="2"/>';
      else { var tip = Math.min(20, (xb - xa) * 0.3); s += '<rect x="' + xa + '" y="20" width="' + r1(xb - xa - tip) + '" height="28" rx="3" style="fill:' + OBJC[o.obj] + ';stroke:var(--ink)" stroke-width="2.5"/><polygon points="' + r1(xb - tip) + ',20 ' + xb + ',34 ' + r1(xb - tip) + ',48" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>'; }
      s += '<line class="oa" x1="' + xa + '" y1="12" x2="' + xa + '" y2="' + (y + 4) + '" style="stroke:var(--ink2)" stroke-width="2" stroke-dasharray="4 3"/><line class="ob" x1="' + xb + '" y1="12" x2="' + xb + '" y2="' + (y + 4) + '" style="stroke:var(--ink2)" stroke-width="2" stroke-dasharray="4 3"/>';
    }
    s += '<rect x="8" y="' + y + '" width="424" height="62" rx="6" style="fill:' + tint('var(--strand)', 14) + ';stroke:var(--ink)" stroke-width="2"/>';
    for (i = 0; i <= max * 10; i++) {
      if (!mm && i % 10) continue;
      var c = i / 10, x = r1(x0 + i * U), h = i % 10 ? (i % 5 ? 8 : 14) : (c % every ? 15 : 24);
      s += '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + h) + '" style="stroke:var(--ink)" stroke-width="' + (i % 10 ? 1 : 2) + '"/>';
      if (!(i % 10) && c % every === 0) s += '<text class="tb rl" x="' + x + '" y="' + (y + 50) + '" text-anchor="middle" font-size="20">' + c + '</text>';
    }
    s += T(426, y + 22, 'cm', 15, 't2', 'end');
    return A.svg(440, y + 68, s, o.label || 'A centimetre ruler' + (o.obj ? ' with a ' + o.obj + ' on it' : ''));
  }
  /* metre sticks (100 cm each) or kilometres of road (1000 m each), and a part of one more */
  function bars(n, extra, u) {
    var big = u === 'km' ? ['1 km', '1000 m', 1000, 'm'] : ['1 m', '100 cm', 100, 'cm'], k = n + (extra ? 1 : 0), s = '';
    for (var i = 0; i < k; i++) {
      var x = 4 + (i % 5) * 82, y = 4 + Math.floor(i / 5) * 66, w = i < n ? 76 : r1(76 * extra / big[2]);
      s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="40" rx="6" style="fill:' + tint(i % 2 ? 'var(--sb)' : 'var(--sd)', 32) + ';stroke:var(--ink)" stroke-width="2"/>';
      s += i < n ? T(x + 38, y + 26, big[1], 15) + T(x + 38, y + 58, big[0], 15, 't2') : T(x, y + 58, extra + ' ' + big[3], 15, 't2', 'start');
    }
    return A.svg(416, 8 + Math.ceil(k / 5) * 66, s, n + ' bars of ' + big[0] + (extra ? ' and ' + extra + ' ' + big[3] + ' more' : ''));
  }
  /* lengths drawn to scale, one under another: rows = [[label, mm], ...] */
  function cmpFig(rows) {
    var mx = Math.max.apply(null, rows.map(function (r) { return r[1]; })), s = '';
    rows.forEach(function (r, i) { var y = 6 + i * 50, w = r1(300 * r[1] / mx); s += '<rect x="96" y="' + y + '" width="' + w + '" height="30" rx="5" style="fill:' + tint(i ? 'var(--sc)' : 'var(--sb)', 40) + ';stroke:var(--ink)" stroke-width="2"/>' + T(88, y + 22, r[0], 17, 'tb', 'end'); });
    return A.svg(404, 12 + rows.length * 50, s, 'Lengths drawn to scale: ' + rows.map(function (r) { return r[0]; }).join(', '));
  }
  /* a ribbon len cm long with units u cm long laid under it (only the first k of them when k is given) */
  var UNAME = { 2: 'erasers', 3: 'paper clips', 4: 'sticks', 5: 'blocks', 6: 'crayons', 8: 'straws', 10: 'craft sticks', 12: 'pencils', 15: 'hand spans', 20: 'shoe lengths', 25: 'forearm lengths' };
  function ribbon(len, u, k, hide) {
    var c = Math.min(34, 400 / len), x0 = 10, n = len / u, s = '';
    k = k == null ? n : k;
    s += '<rect x="' + x0 + '" y="8" width="' + r1(len * c) + '" height="30" rx="4" style="fill:var(--sf)" opacity=".8"/>' + T(x0 + len * c / 2, 29, 'ribbon: ' + (hide ? '?' : len) + ' cm', 16, 'tb" style="fill:#fff');
    for (var i = 0; i < k; i++) {
      s += '<rect class="un" x="' + r1(x0 + i * u * c) + '" y="48" width="' + r1(u * c) + '" height="30" rx="5" style="fill:' + tint(i % 2 ? 'var(--sb)' : 'var(--se)', 35) + ';stroke:var(--ink)" stroke-width="2"/>';
      if (u * c >= 18) s += T(x0 + (i + 0.5) * u * c, 69, i + 1, u * c >= 26 ? 17 : 13);
    }
    return A.svg(x0 * 2 + r1(len * c), 86, s, 'A ribbon with ' + UNAME[u] + ' of ' + u + ' cm under it');
  }
  /* the same ribbon measured two ways */
  function ribbon2(len, u1, u2) {
    var c = Math.min(34, 400 / len), x0 = 10, s = '<rect x="' + x0 + '" y="6" width="' + r1(len * c) + '" height="26" rx="4" style="fill:var(--sf)" opacity=".8"/>';
    [[u1, 40, 'var(--se)'], [u2, 80, 'var(--sb)']].forEach(function (r) { for (var i = 0; i < len / r[0]; i++) s += '<rect x="' + r1(x0 + i * r[0] * c) + '" y="' + r[1] + '" width="' + r1(r[0] * c) + '" height="30" rx="5" style="fill:' + tint(r[2], i % 2 ? 22 : 45) + ';stroke:var(--ink)" stroke-width="2"/>'; });
    return A.svg(x0 * 2 + r1(len * c), 116, s, 'One ribbon, measured with ' + len / u1 + ' short units and with ' + len / u2 + ' long units');
  }
  /* a shape with labelled sides (a side can be "?") */
  function poly(sides, unit) {
    unit = unit || 'cm';
    var n = sides.length, r = 100, s = '', P = [], i, off = n === 4 ? 0.5 : 0;
    for (i = 0; i < n; i++) { var a = -Math.PI / 2 + (i + off) * 2 * Math.PI / n; P.push([r * Math.cos(a) * 1.3, r * Math.sin(a)]); }
    var minX = Math.min.apply(null, P.map(function (p) { return p[0]; })), minY = Math.min.apply(null, P.map(function (p) { return p[1]; })), maxX = Math.max.apply(null, P.map(function (p) { return p[0]; })), maxY = Math.max.apply(null, P.map(function (p) { return p[1]; }));
    var dx0 = 74 - minX, dy0 = 40 - minY, cx = dx0 + (minX + maxX) / 2, cy = dy0 + (minY + maxY) / 2;
    P = P.map(function (p) { return [Math.round(p[0] + dx0), Math.round(p[1] + dy0)]; });
    s += '<polygon points="' + P.map(function (p) { return p.join(','); }).join(' ') + '" style="fill:' + tint('var(--strand)', 14) + ';stroke:var(--bad)" stroke-width="5" stroke-linejoin="round"/>';
    for (i = 0; i < n; i++) {
      var p = P[i], q = P[(i + 1) % n], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = mx - cx, dy = my - cy, d = Math.sqrt(dx * dx + dy * dy) || 1;
      s += '<text class="tb sd" x="' + Math.round(mx + dx / d * 36) + '" y="' + Math.round(my + dy / d * 24 + 7) + '" text-anchor="middle" font-size="21">' + sides[i] + ' ' + unit + '</text>';
    }
    return A.svg(Math.round(maxX - minX + 148), Math.round(maxY - minY + 80), s, 'A shape with ' + n + ' sides');
  }
  /* a rectangle l by w. o.unit, o.labels ('one', 'two', 'all'), o.grid (unit squares, class "sq"), o.area (shade inside, else a bold edge) */
  function rect(l, w, o) {
    o = o || {};
    var u = o.unit || 'cm', c = Math.min(34, 280 / Math.max(l, w), 150 / w), x0 = 64, y0 = 34, W = l * c, H = w * c, s = '', i, j, lab = o.labels || 'two';
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + r1(W) + '" height="' + r1(H) + '" style="fill:' + tint('var(--strand)', o.area ? 30 : 12) + '"/>';
    if (o.grid) for (i = 0; i < w; i++) for (j = 0; j < l; j++) s += '<rect class="sq" x="' + r1(x0 + j * c) + '" y="' + r1(y0 + i * c) + '" width="' + r1(c) + '" height="' + r1(c) + '" style="fill:' + tint('var(--strand)', o.area ? 38 : 16) + ';stroke:var(--line)" stroke-width="1.5"/>';
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + r1(W) + '" height="' + r1(H) + '" fill="none" style="stroke:' + (o.area ? 'var(--ink)' : 'var(--bad)') + '" stroke-width="' + (o.area ? 3 : 5) + '"/>';
    s += T(x0 + W / 2, y0 - 10, l + ' ' + u, 19);
    if (lab !== 'one') s += T(x0 - 8, y0 + H / 2 + 6, w + ' ' + u, 19, 'tb', 'end');
    if (lab === 'all') s += T(x0 + W / 2, y0 + H + 26, l + ' ' + u, 19) + T(x0 + W + 8, y0 + H / 2 + 6, w + ' ' + u, 19, 'tb', 'start');
    return A.svg(x0 * 2 + r1(W) + 10, y0 + r1(H) + 40, s, 'A rectangle ' + l + ' ' + u + ' by ' + w + ' ' + u);
  }
  /* squares on a grid. cells = [[x, y], ...]; o.hl = keys "x,y" drawn in a second colour; o.n = only the first n are covered (the rest dashed) */
  function cellsFig(cells, o) {
    o = o || {};
    var c = o.c || 40, cols = 0, rows = 0, s = '', x0 = 8, y0 = o.title ? 30 : 8;
    cells.forEach(function (p) { cols = Math.max(cols, p[0] + 1); rows = Math.max(rows, p[1] + 1); });
    cells.forEach(function (p, i) {
      var x = x0 + p[0] * c, y = y0 + p[1] * c, hl = o.hl && o.hl[p[0] + ',' + p[1]];
      if (o.n != null && i >= o.n) s += '<rect x="' + x + '" y="' + y + '" width="' + c + '" height="' + c + '" style="fill:var(--card);stroke:var(--ink2)" stroke-width="1.5" stroke-dasharray="5 4"/>';
      else s += '<rect class="sq" x="' + x + '" y="' + y + '" width="' + c + '" height="' + c + '" style="fill:' + tint(hl ? 'var(--sf)' : 'var(--strand)', hl ? 55 : 38) + ';stroke:var(--ink)" stroke-width="2"/>' + (o.n != null ? T(x + c / 2, y + c / 2 + 6, i + 1, 16) : '');
    });
    if (o.title) s += T(x0, 22, o.title, 19, 'tb', 'start');
    return A.svg(Math.max(x0 * 2 + cols * c, o.title ? 60 : 0), y0 + 8 + rows * c, s, o.label || 'A shape made of squares');
  }
  function rowsCells(rows) { var out = []; rows.forEach(function (r, y) { for (var x = r[0]; x < r[0] + r[1]; x++) out.push([x, y]); }); return out; }
  function rectCells(r, c) { var a = []; for (var y = 0; y < r; y++) a.push([0, c]); return rowsCells(a); }
  /* tiles on a w by h rectangle: edge to edge, with gaps, or overlapping */
  function gapFig(mode, w, h) {
    var c = Math.min(60, 360 / w), x0 = 12, y0 = 12, s = '', n = 0, t = mode === 'gap' ? 0.78 : 1;
    function starts(len) {
      var p = [], i;
      if (mode === 'fit') for (i = 0; i < len; i++) p.push(i);
      else if (mode === 'gap') for (i = 0.1; i + 0.78 <= len; i += 1.3) p.push(i);
      else { for (i = 0; i + 1 <= len; i += 0.7) p.push(i); if (p[p.length - 1] < len - 1) p.push(len - 1); }
      return p;
    }
    var xs = starts(w), ys = starts(h);
    s += '<rect class="bg" x="' + x0 + '" y="' + y0 + '" width="' + w * c + '" height="' + h * c + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="3"/>';
    ys.forEach(function (y) { xs.forEach(function (x) { n++; s += '<rect class="tl" x="' + r1(x0 + x * c + 2) + '" y="' + r1(y0 + y * c + 2) + '" width="' + r1(t * c - 4) + '" height="' + r1(t * c - 4) + '" rx="4" style="fill:color-mix(in srgb,var(--sb) ' + (mode === 'over' ? 30 : 45) + '%,transparent);stroke:var(--sb)" stroke-width="2"/>'; }); });
    return { n: n, svg: A.svg(w * c + 24, h * c + 24, s, 'A rectangle covered with ' + n + ' square tiles') };
  }
  /* a curved shape with a string around it, and the string laid straight on a ruler. st = a straight side (cm) for an arch shape */
  function curveShape(kind, st) {
    var out, s = '';
    if (kind === 'circle') out = '<circle cx="130" cy="78" r="64"';
    else if (kind === 'oval') out = '<ellipse cx="130" cy="78" rx="104" ry="58"';
    else if (kind === 'leaf') out = '<path d="M30 78 Q130 -20 230 78 Q130 176 30 78 Z"';
    else if (kind === 'blob') out = '<path d="M40 70 C40 20 120 14 160 30 C220 50 236 110 190 134 C140 158 60 150 44 118 C36 102 40 86 40 70 Z"';
    else out = '<path d="M40 140 V90 A90 76 0 0 1 220 90 V140 Z"';
    s += out + ' style="fill:' + tint('var(--strand)', 18) + ';stroke:var(--ink)" stroke-width="3"/>';
    if (kind === 'arch') s += '<path d="M40 140 V90 A90 76 0 0 1 220 90 V140" fill="none" style="stroke:var(--bad)" stroke-width="5" stroke-dasharray="9 5"/>' + T(130, 166, st + ' cm', 20);
    else s += out.replace(/^<(\w+)/, '<$1 fill="none"') + ' style="stroke:var(--bad)" stroke-width="5" stroke-dasharray="9 5" transform="translate(130 78) scale(1.07) translate(-130 -78)"/>';
    return A.svg(260, kind === 'arch' ? 176 : 160, s, 'A curved shape with a string around ' + (kind === 'arch' ? 'its curved part' : 'it'));
  }
  function curveFig(kind, n, st) { return '<div>' + curveShape(kind, st) + ruler({ max: n <= 30 ? 30 : 60, a: 0, b: n * 10, obj: 'string', label: 'The string laid straight on a ruler' }) + '</div>'; }
  /* a curved shape on a 1 cm grid: an ellipse, rx and ry in cells, centre moved by (ox, oy). mode: 'both' colours full and more-than-half squares, 'full' only full ones, 'none' */
  function blobCase(lv) {
    for (var t = 0; t < 60; t++) {
      var rx = R.pick(lv === 1 ? [1.5, 2] : lv === 2 ? [2, 2.5, 3] : [2.5, 3, 3.5]), ry = R.pick(lv === 1 ? [1.5, 2] : [1.5, 2, 2.5, 3]), ox = R.pick([0, 0.5]), oy = R.pick([0, 0.5]);
      var W = Math.ceil(2 * rx) + 2, H = Math.ceil(2 * ry) + 2, cx = W / 2 + ox, cy = H / 2 + oy, full = 0, half = 0, bad = false, kind = [], N = 20;
      if (cx + rx > W || cy + ry > H) continue;
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
        var k = 0;
        for (var a = 0; a < N; a++) for (var b = 0; b < N; b++) { var px = (x + (a + 0.5) / N - cx) / rx, py = (y + (b + 0.5) / N - cy) / ry; if (px * px + py * py <= 1) k++; }
        var f = k / (N * N);
        if ((f > 0.4 && f < 0.6) || (f > 0.93 && f < 1)) bad = true;
        kind.push(f === 1 ? 'full' : f > 0.5 ? 'half' : '');
        if (f === 1) full++; else if (f > 0.5) half++;
      }
      if (!bad && full > 0) return { rx: rx, ry: ry, cx: cx, cy: cy, W: W, H: H, full: full, half: half, kind: kind };
    }
    return { rx: 2, ry: 2, cx: 3, cy: 3, W: 6, H: 6, full: 4, half: 8, kind: (',,,,,,' + ',half,half,half,half,' + ',half,full,full,half,' + ',half,full,full,half,' + ',half,half,half,half,' + ',,,,,').split(',') };
  }
  function blobFig(b, mode) {
    var c = Math.min(44, 300 / Math.max(b.W, b.H)), x0 = 12, s = '', i;
    b.kind.forEach(function (k, j) { var x = j % b.W, y = Math.floor(j / b.W), col = k === 'full' && mode !== 'none' ? 'var(--sd) 45%' : k === 'half' && mode === 'both' ? 'var(--hi) 60%' : ''; if (col) s += '<rect class="' + k + '" x="' + r1(x0 + x * c) + '" y="' + r1(x0 + y * c) + '" width="' + r1(c) + '" height="' + r1(c) + '" style="fill:color-mix(in srgb,' + col + ',var(--card))"/>'; });
    for (i = 0; i <= b.W; i++) s += '<line class="gv" x1="' + r1(x0 + i * c) + '" y1="' + x0 + '" x2="' + r1(x0 + i * c) + '" y2="' + r1(x0 + b.H * c) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    for (i = 0; i <= b.H; i++) s += '<line x1="' + x0 + '" y1="' + r1(x0 + i * c) + '" x2="' + r1(x0 + b.W * c) + '" y2="' + r1(x0 + i * c) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    s += '<ellipse cx="' + r1(x0 + b.cx * c) + '" cy="' + r1(x0 + b.cy * c) + '" rx="' + r1(b.rx * c) + '" ry="' + r1(b.ry * c) + '" fill="none" style="stroke:var(--ink)" stroke-width="4"/>';
    return A.svg(r1(b.W * c + 24), r1(b.H * c + 24), s, 'A curved shape on a centimetre grid');
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
  function ck(id, shape, lv) { return function () { var s = DEF[id].filter(function (x) { return x[1] === shape; })[0], q = s[2](lv); q.shape = shape; return q; }; }

  /* ======================= Lesson 1: Units of length ======================= */
  var TH = [['an ant', 'mm', 5, 'ant'], ['a ladybug', 'mm', 8, 'bug'], ['a grain of rice', 'mm', 6, 'rice'], ['a crayon', 'cm', 9, 'crayon'], ['a pencil', 'cm', 19, 'pencil'], ['a book', 'cm', 28, 'book'],
    ['a door', 'm', 2, 'door'], ['a canoe', 'm', 5, 'canoe'], ['a school bus', 'm', 12, 'bus'], ['a hiking trail', 'km', 4, 'trail'], ['the road to the next town', 'km', 15, 'road']];
  var UN = ['mm', 'cm', 'm', 'km'], UNW = { mm: 'millimetres', cm: 'centimetres', m: 'metres', km: 'kilometres' };
  function bnPool(lv) { return lv === 1 ? TH.filter(function (t) { return t[1] !== 'mm'; }) : TH; }
  function unitFix(u) { var f = {}; UN.forEach(function (x, j) { if (x !== u) f[j] = j < UN.indexOf(u) ? 'That unit is too small: you would count a huge number of them.' : 'That unit is too big: it is only a tiny part of one.'; }); return f; }
  var BNWHY = { mm: 'Tiny, like a dime\'s thickness: millimetres.', cm: 'A few fingernails long: centimetres.', m: 'A few big steps long: metres.', km: 'A long walk: kilometres.' };
  var BNSIZE = ['smaller than a fingernail', 'between a fingernail and a big step', 'between a big step and a long walk', 'a long walk or more'];
  skill('la-bench', 'Pick a unit of length', 'E2.2', [
    [1, 'plain', function (lv) {
      var t = R.pick(bnPool(lv));
      return fixed('Which unit would you use to measure <b>' + t[0] + '</b>?', UN, UN.indexOf(t[1]), unitFix(t[1]), { fig: pic(t[3], cap(t[0])),
        hint: 'Picture it next to a dime, a fingernail, a big step and a long walk.', steps: [BNWHY[t[1]]], explain: BNWHY[t[1]], meta: { k: 'g3la-bn-unit', t: t[0] } });
    }],
    [1, 'steps', function (lv) {
      var n = R.int(lv === 1 ? 3 : 4, lv === 3 ? 9 : 8), who = Q.name(), place = R.pick(['the hallway', 'the classroom', 'the gym stage', 'the porch', 'the dock']), each = lv === 2 ? 50 : lv === 3 ? 100 : 1, u = lv === 1 ? 'm' : 'cm', f = {};
      f[n] = lv === 2 ? 'Each step is 50 cm. Count by 50s.' : 'That is metres. Each metre is 100 cm.';
      var q = lv === 2 ? who + ' takes ' + n + ' small steps along ' + place + '. Each step is about 50 cm. About how many centimetres long is it?' : who + ' takes ' + n + ' big steps along ' + place + '. A big step is about 1 m. About how long is it in ' + UNW[u] + '?';
      return num(q, n * each, f, { unit: u, fig: stepsFig(n, lv === 2 ? '50 cm' : '1 m'), hint: lv === 2 ? 'Count by 50s, once for each step.' : 'One big step is about 1 m.',
        steps: [n + ' steps of about ' + (lv === 2 ? '50 cm' : '1 m') + '.', lv === 1 ? 'About ' + n + ' m.' : lv === 2 ? n + ' &times; 50 = ' + n * 50 + ' cm.' : n + ' m = ' + n * 100 + ' cm.'], explain: 'About ' + n * each + ' ' + u + '.', meta: { k: 'g3la-bn-est', n: n, each: each } });
    }],
    [1, 'match', function (lv) {
      var us = lv === 1 ? ['cm', 'm', 'km'] : R.shuffle(UN).slice(0, 3), pairs = us.map(function (u) { return [cap(R.pick(TH.filter(function (t) { return t[1] === u; }))[0]), u]; });
      return { q: 'Match each thing to the best unit for its length.', type: 'match', pairs: pairs, hint: 'Small things, small units. Long things, big units.', steps: pairs.map(function (p) { return p[0] + ': ' + p[1] + '.'; }),
        explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'g3la-bn-match' } };
    }],
    [2, 'tf', function (lv) {
      var t = R.pick(TH), who = Q.name(), truth = coin(), j = UN.indexOf(t[1]), u = truth ? t[1] : UN[j === 3 ? 2 : j === 0 ? 1 : j + R.pick([-1, 1])];
      var right = cap(t[0]) + ' is about ' + t[2] + ' ' + t[1] + ' long.';
      return tf(who + ' says ' + t[0] + ' is about <b>' + t[2] + ' ' + u + '</b> long. True or false?', truth, right, ['Any unit works if the number is ' + t[2] + '.', 'Long things are measured in mm.', 'The bigger the unit, the shorter the thing.'],
        'Picture ' + t[2] + ' ' + u + '. Does it fit ' + t[0] + '?', { fig: pic(t[3], cap(t[0])), hint: 'Picture ' + t[2] + ' of that unit.', meta: { k: 'g3la-bn-tf', t: t[0], n: t[2], u: u } });
    }],
    [2, 'order', function (lv) {
      var us = lv === 3 ? UN.slice() : R.shuffle(UN).slice(0, 3).sort(function (a, b) { return UN.indexOf(a) - UN.indexOf(b); }), items = us.map(function (u) { return cap(R.pick(TH.filter(function (t) { return t[1] === u; }))[0]); });
      return { q: 'Put these in order from <b>shortest</b> to <b>longest</b>.', type: 'order', items: items, first: 'shortest', last: 'longest', hint: 'Think of the unit you would use for each one.',
        steps: ['mm things are shortest, then cm, then m, then km.'], explain: items.join(', ') + '.', meta: { k: 'g3la-bn-order' } };
    }],
    [3, 'pick', function () {
      var u = R.pick(UN), good = R.shuffle(TH.filter(function (t) { return t[1] === u; })).slice(0, 2), bad = R.shuffle(TH.filter(function (t) { return t[1] !== u; })).slice(0, 3), opts = R.shuffle(good.concat(bad)), ans = [];
      opts.forEach(function (t, j) { if (t[1] === u) ans.push(j); });
      return { q: 'Pick <b>every</b> thing you would measure in <b>' + UNW[u] + '</b>.', type: 'pick', options: opts.map(function (t) { return cap(t[0]); }), answer: ans, hint: 'Compare each one with the benchmark for ' + UNW[u] + '.',
        steps: opts.map(function (t) { return cap(t[0]) + ': ' + t[1] + '.'; }), explain: ans.map(function (j) { return cap(opts[j][0]); }).join(' and ') + '.', meta: { k: 'g3la-bn-pick', u: u } };
    }]
  ]);
  function tgBench(lv) {
    return function () {
      var t = R.pick(bnPool(lv)), j = UN.indexOf(t[1]), f = {};
      BNSIZE.forEach(function (_, i) { if (i !== j) f[i] = i < j ? 'Picture it again: it is longer than that.' : 'Picture it again: it is shorter than that.'; });
      return { q: 'Which unit fits <b>' + t[0] + '</b>?', fig: pic(t[3], cap(t[0])), done: cap(t[0]) + ': ' + UNW[t[1]] + '.', steps: [
        { prompt: 'Compare it with the benchmarks.', q: fixed('How long is ' + t[0] + '?', BNSIZE.map(cap), j, f, { hint: 'Fingernail, big step, long walk.', meta: { k: 'g3la-bn-size', t: t[0] } }) },
        { prompt: 'Now name the unit.', q: fixed('So which unit?', UN, j, unitFix(t[1]), { hint: 'Fingernail: cm. Big step: m. Long walk: km. Smaller than a fingernail: mm.', meta: { k: 'g3la-bn-unit', t: t[0] } }) }
      ] };
    };
  }

  /* ---------- Read a ruler ---------- */
  var RO = ['pencil', 'crayon', 'ribbon'];
  function rlCase(lv) { var max = lv === 3 ? 15 : 10, a = lv === 1 ? 0 : R.int(1, lv === 3 ? 6 : 4), len = R.int(lv === 3 ? 4 : 2, Math.min(max - a, lv === 3 ? 9 : 8)); return { max: max, a: a, b: a + len, len: len, obj: R.pick(RO) }; }
  function rlFig(c) { return ruler({ max: c.max, a: c.a * 10, b: c.b * 10, obj: c.obj }); }
  function rlFix(c) { var f = {}; f[c.b] = 'That is where it ends. It starts at ' + c.a + ', so subtract.'; f[c.len + 1] = 'Count the spaces between the marks, not the marks.'; return f; }
  function rlSteps(c) { return c.a ? ['It starts at ' + c.a + ' and ends at ' + c.b + '.', c.b + ' &minus; ' + c.a + ' = ' + c.len + ' cm.'] : ['It starts at 0.', 'It ends at ' + c.b + ': ' + c.len + ' cm.']; }
  skill('la-ruler', 'Read a ruler', 'E2.2', [
    [1, 'plain', function (lv) { var c = rlCase(lv); return num('How long is the ' + c.obj + '?', c.len, rlFix(c), { unit: 'cm', fig: rlFig(c), hint: c.a ? 'Where does it start? Where does it end?' : 'It starts at 0. Where does it end?', steps: rlSteps(c), explain: c.len + ' cm.', meta: { k: 'g3la-rl-num' } }); }],
    [1, 'mc', function (lv) {
      var c = rlCase(lv), f = rlFix(c), W = [[c.b + ' cm', f[c.b]], [(c.len + 1) + ' cm', f[c.len + 1]], [(c.len - 1) + ' cm', 'Look again at where it ends.']];
      if (c.a > 1) W.push([c.a + ' cm', 'That is where it starts.']);
      return mc('How long is the ' + c.obj + '?', c.len + ' cm', W, { fig: rlFig(c), hint: 'Start mark, end mark, then subtract.', steps: rlSteps(c), explain: c.len + ' cm.', meta: { k: 'g3la-rl-mc' } });
    }],
    [1, 'fill', function (lv) { var c = rlCase(lv); return fill('Read the ruler. Fill in the blanks.', 'It starts at [[]] cm and ends at [[]] cm. It is [[]] cm long.', [c.a, c.b, c.len], { fig: rlFig(c), hint: 'Look at both ends. Then subtract.', steps: rlSteps(c), explain: c.b + ' &minus; ' + c.a + ' = ' + c.len + ' cm.', meta: { k: 'g3la-rl-fill' } }); }],
    [2, 'story', function (lv) {
      var c = rlCase(lv), who = R.pick(['A snail', 'A ladybug', 'An ant', 'A caterpillar']), f = {};
      f[c.b] = 'That is the mark where it stopped. Subtract the start.';
      return num(who + ' crawls along a ruler from the <b>' + c.a + ' cm</b> mark to the <b>' + c.b + ' cm</b> mark. How far does it crawl?', c.len, f, { unit: 'cm', fig: ruler({ max: c.max, a: c.a * 10, b: c.b * 10, obj: 'string', label: 'A path along a ruler' }),
        hint: 'End mark minus start mark.', steps: [c.b + ' &minus; ' + c.a + ' = ' + c.len + '.'], explain: c.len + ' cm.', meta: { k: 'g3la-rl-story', a: c.a, b: c.b } });
    }],
    [2, 'tf', function (lv) {
      var c = rlCase(lv), who = Q.name(), truth = coin(), said = truth ? c.len : c.a ? c.b : c.len + 1;
      return tf(who + ' says the ' + c.obj + ' is <b>' + said + ' cm</b> long. True or false?', truth, 'It goes from ' + c.a + ' to ' + c.b + ', so it is ' + c.len + ' cm long.', ['Read the number at the end. That is always the length.', 'Count the marks, not the spaces.', 'Start counting at 1.'],
        c.a ? 'It does not start at 0. Subtract the start.' : 'Look again at where it ends.', { fig: rlFig(c), hint: 'Check where it starts.', meta: { k: 'g3la-rl-tf', said: said } });
    }],
    [2, 'line', function (lv) {
      var c = rlCase(lv);
      return { q: 'A ' + c.obj + ' is <b>' + c.len + ' cm</b> long. One end is at <b>' + c.a + ' cm</b>. Put the marker where the other end is.', type: 'line', min: 0, max: c.max, tick: 1, every: 1, snap: 1, answer: c.b, hideValue: true,
        hint: 'Start at ' + c.a + ' and count on ' + c.len + '.', steps: [c.a + ' + ' + c.len + ' = ' + c.b + '.'], explain: 'The other end is at ' + c.b + ' cm.', meta: { k: 'g3la-rl-line', a: c.a, n: c.len } };
    }]
  ]);
  function tgRuler(lv) {
    return function () {
      var c = rlCase(lv), f1 = {}, f2 = {}, f3 = {};
      f1[c.b] = 'That is the far end. Look at the left end.'; f2[c.a] = 'That is the start. Look at the right end.'; f3[c.b] = 'That is the end mark. Take away the start.';
      return { q: 'How long is the ' + c.obj + '?', fig: rlFig(c), done: c.b + ' &minus; ' + c.a + ' = ' + c.len + ' cm.', steps: [
        { prompt: 'Find the start mark.', q: num('Where does it start?', c.a, f1, { unit: 'cm', hint: 'Follow the dashed line on the left.', meta: { k: 'g3la-rl-start', a: c.a } }) },
        { prompt: 'Find the end mark.', q: num('Where does it end?', c.b, f2, { unit: 'cm', hint: 'Follow the dashed line on the right.', meta: { k: 'g3la-rl-end', b: c.b } }) },
        { prompt: 'End minus start.', q: num('How long is it?', c.len, f3, { unit: 'cm', hint: c.b + ' &minus; ' + c.a + '.', meta: { k: 'g3la-rl-len', a: c.a, b: c.b } }) }
      ] };
    };
  }

  /* ---------- 10 mm make 1 cm ---------- */
  function mmLen(lv) { return lv === 1 ? R.int(2, 9) * 10 : R.int(1, 9) * 10 + R.int(1, 9); }
  function mmFig(b) { return ruler({ max: 10, a: 0, b: b, obj: R.pick(['pencil', 'crayon']) }); }
  function mmName(v) { var c = Math.floor(v / 10), r = v % 10; return c && r ? c + ' cm ' + r + ' mm' : c ? c + ' cm' : r + ' mm'; }
  skill('la-mm', 'Centimetres and millimetres', 'E2.2', [
    [1, 'plain', function (lv) {
      if (lv === 3) { var c = R.int(10, 25), d = R.int(1, 9), f = {}; f[c + d] = 'Each centimetre is 10 mm. Change the cm first.'; f[c * 100 + d] = 'A centimetre is 10 mm, not 100.';
        return num(c + ' cm ' + d + ' mm = ___ mm', c * 10 + d, f, { unit: 'mm', hint: 'Each cm is 10 mm.', steps: [c + ' cm = ' + c * 10 + ' mm.', c * 10 + ' + ' + d + ' = ' + (c * 10 + d) + ' mm.'], explain: c + ' cm ' + d + ' mm = ' + (c * 10 + d) + ' mm.', meta: { k: 'g3la-mm-bare' } }); }
      var b = mmLen(lv), g = {}; g[Math.floor(b / 10)] = 'That counts centimetres. Each cm is 10 mm.'; g[Math.floor(b / 10) + b % 10] = 'Each cm is 10 mm, not 1 mm.';
      return num('How long is it in <b>millimetres</b>?', b, g, { unit: 'mm', fig: mmFig(b), hint: 'Count by 10s for each centimetre, then add the small marks.',
        steps: [Math.floor(b / 10) + ' whole cm: ' + Math.floor(b / 10) * 10 + ' mm.', b % 10 ? Math.floor(b / 10) * 10 + ' + ' + b % 10 + ' = ' + b + ' mm.' : 'No small marks left: ' + b + ' mm.'], explain: b + ' mm.', meta: { k: 'g3la-mm-pic' } });
    }],
    [1, 'bare', function (lv) {
      var n, q, ans, f = {};
      if (lv === 1) { n = R.int(2, 9); q = n + ' cm = ___ mm'; ans = n * 10; f[n * 100] = 'A centimetre is 10 mm, not 100.'; f[n] = 'Millimetres are smaller, so there are more of them.'; }
      else { n = R.int(lv === 2 ? 2 : 10, lv === 2 ? 15 : 25) * 10; q = n + ' mm = ___ cm'; ans = n / 10; f[n * 10] = 'Centimetres are bigger, so there are fewer of them.'; f[n / 100] = '10 mm make 1 cm, not 100.'; }
      return num(q, ans, f, { unit: lv === 1 ? 'mm' : 'cm', hint: '10 mm make 1 cm.', steps: [lv === 1 ? n + ' &times; 10 = ' + ans + '.' : 'Groups of 10: ' + n + ' &divide; 10 = ' + ans + '.'], explain: q.replace('___', ans) + '.', meta: { k: 'g3la-mm-bare' } });
    }],
    [2, 'fill', function (lv) {
      var b = lv === 3 ? R.int(10, 19) * 10 + R.int(1, 9) : mmLen(2), c = Math.floor(b / 10), r = b % 10;
      if (lv === 3) return fill('Fill in the blanks.', b + ' mm = [[]] cm [[]] mm', [c, r], { hint: 'How many groups of 10 mm?', steps: [b + ' = ' + c * 10 + ' + ' + r + '.', c * 10 + ' mm = ' + c + ' cm.'], explain: b + ' mm = ' + c + ' cm ' + r + ' mm.', meta: { k: 'g3la-mm-fill3', b: b } });
      return fill('Read the ruler. Fill in the blanks.', 'It is [[]] cm and [[]] mm. That is [[]] mm in all.', [c, r, b], { fig: mmFig(b), hint: 'Whole centimetres first, then the small marks.', steps: [c + ' cm = ' + c * 10 + ' mm.', c * 10 + ' + ' + r + ' = ' + b + '.'], explain: b + ' mm.', meta: { k: 'g3la-mm-fill' } });
    }],
    [1, 'tf', function (lv) {
      var n = R.int(2, 9), truth = coin(), said = truth ? n * 10 : R.pick([n * 100, n + 10]);
      return tf('True or false: <b>' + n + ' cm = ' + said + ' mm</b>', truth, '10 mm make 1 cm, so ' + n + ' cm = ' + n * 10 + ' mm.', ['100 mm make 1 cm.', 'Add 10 to change cm to mm.', 'Changing the unit never changes the number.'], 'Use 10 mm for every centimetre.',
        { hint: 'How many mm in 1 cm?', meta: { k: 'g3la-mm-tf', n: n, said: said } });
    }],
    [2, 'match', function (lv) {
      var seen = {}, pairs = [];
      while (pairs.length < 3) { var v = lv === 3 ? R.int(1, 9) * 10 + R.int(1, 9) : R.int(1, 12) * 10; if (seen[v]) continue; seen[v] = 1; pairs.push([mmName(v), v + ' mm']); }
      return { q: 'Match the lengths that are the same.', type: 'match', pairs: pairs, hint: '10 mm make 1 cm.', steps: ['Change each one to mm: 10 for every cm.'], explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'g3la-mm-match' } };
    }],
    [3, 'order', function () {
      var seen = {}, list = [];
      while (list.length < 4) { var v = R.int(3, 9) * 10 + R.pick([0, 0, R.int(1, 9)]); if (seen[v]) continue; seen[v] = 1; list.push([coin() ? v + ' mm' : mmName(v), v]); }
      list.sort(function (a, b) { return a[1] - b[1]; });
      return { q: 'Put these from <b>shortest</b> to <b>longest</b>.', type: 'order', items: list.map(function (x) { return x[0]; }), first: 'shortest', last: 'longest', hint: 'Change them all to mm first.',
        steps: list.map(function (x) { return x[0] + ' = ' + x[1] + ' mm.'; }), explain: list.map(function (x) { return x[0]; }).join(', ') + '.', meta: { k: 'g3la-mm-order' } };
    }]
  ]);
  function tgMM(lv) {
    return function () {
      var b = lv === 1 ? R.int(2, 9) * 10 + R.int(1, 9) : mmLen(2), c = Math.floor(b / 10), r = b % 10, f1 = {}, f2 = {}, f4 = {};
      f1[b] = 'Only the whole centimetres for now.'; f2[c] = 'Each cm is 10 mm, so count by 10s.'; f4[c + r] = 'Add ' + c * 10 + ' and ' + r + '.';
      return { q: 'How long is it in millimetres?', fig: mmFig(b), done: c * 10 + ' + ' + r + ' = ' + b + ' mm.', steps: [
        { prompt: 'Count the whole centimetres.', q: num('How many whole cm?', c, f1, { unit: 'cm', hint: 'Look at the last number it passes.', meta: { k: 'g3la-mm-cm', v: c } }) },
        { prompt: 'Each cm is 10 mm.', q: num(c + ' cm = ? mm', c * 10, f2, { unit: 'mm', hint: c + ' tens.', meta: { k: 'g3la-mm-tens', c: c } }) },
        { prompt: 'Count the small marks past ' + c + '.', q: num('How many more mm?', r, {}, { unit: 'mm', hint: 'Count the tiny marks after the ' + c + '.', meta: { k: 'g3la-mm-cm', v: r } }) },
        { prompt: 'Add them.', q: num(c * 10 + ' + ' + r + ' = ?', b, f4, { unit: 'mm', hint: 'Tens and ones.', meta: { k: 'g3la-mm-add', a: c * 10, b: r } }) }
      ] };
    };
  }

  /* ---------- Metres and kilometres ---------- */
  function mBig(u) { return u === 'km' ? { per: 1000, small: 'm', big: 'km' } : { per: 100, small: 'cm', big: 'm' }; }
  function mCase(lv) {
    var u = coin() ? 'm' : 'km', B = mBig(u), n = R.int(lv === 1 ? 1 : 2, lv === 1 ? 5 : 9), x = 0;
    if (lv === 3) { n = R.int(1, u === 'm' ? 4 : 3); x = u === 'm' ? R.int(1, 19) * 5 : R.int(1, 19) * 50; }
    return { u: u, B: B, n: n, x: x, tot: n * B.per + x };
  }
  function mText(c) { return c.n + ' ' + c.B.big + (c.x ? ' ' + c.x + ' ' + c.B.small : ''); }
  skill('la-m', 'Metres and kilometres', 'E2.2', [
    [1, 'plain', function (lv) {
      var c = mCase(lv), f = {}, q, ans, unit;
      if (lv === 2) { q = c.tot + ' ' + c.B.small + ' = ___ ' + c.B.big; ans = c.n; unit = c.B.big; f[c.tot * c.B.per] = 'The bigger unit needs fewer of them.'; f[c.tot / 10] = c.B.per + ' ' + c.B.small + ' make 1 ' + c.B.big + '.'; }
      else { q = mText(c) + ' = ___ ' + c.B.small; ans = c.tot; unit = c.B.small; f[c.n * 10 + c.x] = c.B.per + ' ' + c.B.small + ' make 1 ' + c.B.big + ', not 10.'; f[c.n + c.x] = 'Change the ' + UNW[c.B.big] + ' to ' + UNW[c.B.small] + ' first.'; f[c.n * (c.B.per === 100 ? 1000 : 100) + c.x] = c.B.per + ' ' + c.B.small + ' make 1 ' + c.B.big + '.'; }
      return num(q, ans, f, { unit: unit, fig: bars(c.n, c.x, c.u), hint: c.B.per + ' ' + c.B.small + ' make 1 ' + c.B.big + '.',
        steps: [c.B.per + ' ' + c.B.small + ' make 1 ' + c.B.big + '.', lv === 2 ? c.tot + ' &divide; ' + c.B.per + ' = ' + c.n + '.' : c.n + ' &times; ' + c.B.per + ' = ' + c.n * c.B.per + (c.x ? ', and ' + c.n * c.B.per + ' + ' + c.x + ' = ' + c.tot : '') + '.'], explain: q.replace('___', ans) + '.', meta: { k: 'g3la-m-conv' } });
    }],
    [1, 'story', function (lv) {
      var who = Q.name(), q, ans, unit, st, f = {};
      if (lv === 1) { var n = R.int(2, 6); q = who + '\'s skipping rope is ' + n + ' m long. How many centimetres is that?'; ans = n * 100; unit = 'cm'; st = [n + ' &times; 100 = ' + ans + '.']; f[n * 10] = 'A metre is 100 cm, not 10.'; }
      else if (lv === 2) { var l = R.int(2, 5); q = who + ' runs ' + l + ' laps of a 400 m track. How many metres is that?'; ans = 400 * l; unit = 'm'; st = ['Count by 400s: ' + [1, 2, 3, 4, 5].slice(0, l).map(function (i) { return 400 * i; }).join(', ') + '.']; f[400 + l] = 'Each lap is 400 m. Count by 400s.'; }
      else { var a = R.int(1, 3), b = R.int(1, 19) * 50, one = a * 1000 + b; q = 'A trail is ' + a + ' km ' + b + ' m long. ' + who + ' hikes there and back. How many metres is that in all?'; ans = 2 * one; unit = 'm'; st = [a + ' km ' + b + ' m = ' + one + ' m.', 'There and back: ' + one + ' + ' + one + ' = ' + ans + ' m.']; f[one] = 'That is one way. There and back is twice.'; }
      return num(q, ans, f, { unit: unit, hint: '100 cm make 1 m. 1000 m make 1 km.', steps: st, explain: ans + ' ' + unit + '.', meta: { k: 'g3la-m-story' } });
    }],
    [1, 'fill', function (lv) {
      var c = mCase(lv === 3 ? 2 : 1);
      return fill('Fill in the blanks.', '[[]] ' + c.B.small + ' make 1 ' + c.B.big + '. So ' + c.n + ' ' + c.B.big + ' = [[]] ' + c.B.small + '.', [c.B.per, c.n * c.B.per], { fig: bars(c.n, 0, c.u), hint: 'Read one bar.', steps: ['Each bar is ' + c.B.per + ' ' + c.B.small + '.', c.n + ' &times; ' + c.B.per + ' = ' + c.n * c.B.per + '.'], explain: c.n + ' ' + c.B.big + ' = ' + c.n * c.B.per + ' ' + c.B.small + '.', meta: { k: 'g3la-m-fill', u: c.u, n: c.n } });
    }],
    [1, 'tf', function (lv) {
      var c = mCase(lv === 3 ? 2 : 1), truth = coin(), said = truth ? c.n * c.B.per : c.n * (c.B.per === 100 ? R.pick([10, 1000]) : R.pick([10, 100]));
      return tf('True or false: <b>' + c.n + ' ' + c.B.big + ' = ' + said + ' ' + c.B.small + '</b>', truth, c.B.per + ' ' + c.B.small + ' make 1 ' + c.B.big + ', so ' + c.n + ' ' + c.B.big + ' = ' + c.n * c.B.per + ' ' + c.B.small + '.',
        ['10 of the smaller unit always make 1 of the bigger.', 'The number stays the same.', 'Bigger units need more of them.'], 'Check: ' + c.B.per + ' ' + c.B.small + ' make 1 ' + c.B.big + '.', { hint: 'How many ' + c.B.small + ' make 1 ' + c.B.big + '?', meta: { k: 'g3la-m-tf', n: c.n, u: c.u, said: said } });
    }],
    [2, 'match', function (lv) {
      var u = coin() ? 'm' : 'km', B = mBig(u), seen = {}, pairs = [];
      while (pairs.length < 3) { var n = R.int(1, 9), x = lv === 3 ? R.int(1, 9) * (B.per / 10) : 0; if (seen[n]) continue; seen[n] = 1; pairs.push([n + ' ' + B.big + (x ? ' ' + x + ' ' + B.small : ''), (n * B.per + x) + ' ' + B.small]); }
      return { q: 'Match the lengths that are the same.', type: 'match', pairs: pairs, hint: B.per + ' ' + B.small + ' make 1 ' + B.big + '.', steps: ['Change each one to ' + UNW[B.small] + '.'], explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'g3la-m-match' } };
    }]
  ]);
  function tgM(lv) {
    return function () {
      var c = mCase(lv), f1 = {}, f2 = {}, f3 = {};
      f1[10] = 'More than 10: think of a metre stick.'; f1[c.B.per === 100 ? 1000 : 100] = c.B.per === 100 ? 'That is metres in a km.' : 'That is cm in a metre.';
      f2[c.n * 10] = 'Use ' + c.B.per + ' for each ' + c.B.big + '.'; f3[c.n * c.B.per] = 'Now add the ' + c.x + ' ' + c.B.small + '.';
      var steps = [
        { prompt: 'Start with one ' + c.B.big + '.', q: num('How many ' + c.B.small + ' make 1 ' + c.B.big + '?', c.B.per, f1, { unit: c.B.small, hint: c.u === 'm' ? 'A metre stick has 100 cm.' : '1000 m make 1 km.', meta: { k: 'g3la-m-one', u: c.u } }) },
        { prompt: 'One ' + c.B.per + ' for each ' + c.B.big + '.', q: num(c.n + ' ' + c.B.big + ' = ? ' + c.B.small, c.n * c.B.per, f2, { unit: c.B.small, hint: 'Count by ' + c.B.per + 's.', meta: { k: 'g3la-m-many', n: c.n, u: c.u } }) }];
      if (c.x) steps.push({ prompt: 'Add the extra ' + c.B.small + '.', q: num(c.n * c.B.per + ' + ' + c.x + ' = ?', c.tot, f3, { unit: c.B.small, hint: 'Add the two parts.', meta: { k: 'g3la-mm-add', a: c.n * c.B.per, b: c.x } }) });
      return { q: mText(c) + ' = ___ ' + c.B.small, fig: bars(c.n, c.x, c.u), done: mText(c) + ' = ' + c.tot + ' ' + c.B.small + '.', steps: steps };
    };
  }

  /* ---------- Compare lengths in different units ---------- */
  function cpLen(t, small) { return [t, small]; }
  function cpCase(lv) {
    var x, y, kind = lv === 1 ? 'mcm' : lv === 2 ? R.pick(['cmmm', 'kmm', 'mcm']) : 'mcm2';
    for (var k = 0; k < 40; k++) {
      if (kind === 'mcm') { var a = R.int(1, 4), b = R.int(5, 45) * 10; x = cpLen(a + ' m', a * 100); y = cpLen(b + ' cm', b); }
      else if (kind === 'cmmm') { var c = R.int(2, 9), d = R.int(15, 95); x = cpLen(c + ' cm', c * 10); y = cpLen(d + ' mm', d); }
      else if (kind === 'kmm') { var e = R.int(1, 3), g = R.int(5, 35) * 100; x = cpLen(e + ' km', e * 1000); y = cpLen(g + ' m', g); }
      else { var h = R.int(1, 3), i = R.int(1, 9) * 10, j = R.int(60, 390); x = cpLen(h + ' m ' + i + ' cm', h * 100 + i); y = cpLen(j + ' cm', j); }
      if (Math.abs(x[1] - y[1]) >= (kind === 'cmmm' ? 3 : 20)) break;
    }
    var unit = kind === 'cmmm' ? 'mm' : kind === 'kmm' ? 'm' : 'cm';
    return coin() ? { a: x, b: y, unit: unit } : { a: y, b: x, unit: unit };
  }
  function cpSteps(p) { return [p.a[0] + ' = ' + p.a[1] + ' ' + p.unit + '. ' + p.b[0] + ' = ' + p.b[1] + ' ' + p.unit + '.', (p.a[1] > p.b[1] ? p.a : p.b)[0] + ' is longer.']; }
  skill('la-cmp', 'Compare lengths', 'E2.2', [
    [1, 'plain', function (lv) {
      var p = cpCase(lv), ans = p.a[1] > p.b[1] ? 0 : 1, f = {};
      f[1 - ans] = 'Bigger number, but a smaller unit. Change both to ' + p.unit + ' first.'; f[2] = p.a[1] + ' ' + p.unit + ' and ' + p.b[1] + ' ' + p.unit + ' are not the same.';
      return fixed('Which is longer: <b>' + p.a[0] + '</b> or <b>' + p.b[0] + '</b>?', [p.a[0], p.b[0], 'They are the same'], ans, f, { hint: 'Change both to ' + p.unit + '.', steps: cpSteps(p), explain: cpSteps(p)[1], meta: { k: 'g3la-cp-mc' } });
    }],
    [1, 'diff', function (lv) {
      var p = cpCase(lv), L = p.a[1] > p.b[1] ? p.a : p.b, S = L === p.a ? p.b : p.a, d = L[1] - S[1], f = {};
      f[L[1]] = 'That is the longer one. Now take away the shorter one.';
      return num('How much longer is <b>' + L[0] + '</b> than <b>' + S[0] + '</b>? Answer in ' + UNW[p.unit] + '.', d, f, { unit: p.unit, fig: cmpFig([[L[0], L[1]], [S[0], S[1]]]), hint: 'Change both to ' + p.unit + ', then subtract.',
        steps: [L[0] + ' = ' + L[1] + ' ' + p.unit + '.', L[1] + ' &minus; ' + S[1] + ' = ' + d + '.'], explain: d + ' ' + p.unit + ' longer.', meta: { k: 'g3la-cp-diff', L: L[0], S: S[0], u: p.unit } });
    }],
    [1, 'fill', function (lv) {
      var a = R.int(2, lv === 3 ? 6 : 4), b = R.int(3, a * 10 - 2) * 10;
      return fill('Which is longer: ' + a + ' m or ' + b + ' cm? Fill in the blanks.', a + ' m = [[]] cm. [[]] &minus; ' + b + ' = [[]] cm more.', [a * 100, a * 100, a * 100 - b], { fig: cmpFig([[a + ' m', a * 100], [b + ' cm', b]]), hint: '1 m = 100 cm.', steps: [a + ' m = ' + a * 100 + ' cm.', a * 100 + ' &minus; ' + b + ' = ' + (a * 100 - b) + '.'], explain: a + ' m is ' + (a * 100 - b) + ' cm longer.', meta: { k: 'g3la-cp-fill', a: a, b: b } });
    }],
    [1, 'tf', function (lv) {
      var p = cpCase(lv), who = Q.name(), big = /^\d+ (cm|mm|m)$/.test(p.a[0]) && +p.a[0].split(' ')[0] > +p.b[0].split(' ')[0] ? p.a : p.b, other = big === p.a ? p.b : p.a, truth = big[1] > other[1];
      var right = big[0] + ' = ' + big[1] + ' ' + p.unit + ' and ' + other[0] + ' = ' + other[1] + ' ' + p.unit + '.';
      return tf(who + ' says <b>' + big[0] + '</b> is longer than <b>' + other[0] + '</b>. True or false?', truth, right, ['The bigger number is always longer.', 'You cannot compare different units.', 'm and cm are the same size.'], 'Change both to ' + p.unit + ' first.',
        { hint: 'Change both to the same unit.', meta: { k: 'g3la-cp-tf', x: big[0], y: other[0] } });
    }],
    [2, 'order', function (lv) {
      var a = R.int(1, 3), list = [[a + ' m', a * 100]], seen = {}; seen[a * 100] = 1;
      while (list.length < (lv === 3 ? 4 : 3)) { var v = R.int(4, 39) * 10; if (seen[v] || Math.abs(v - a * 100) < 20) continue; seen[v] = 1; list.push(coin() && v % 100 && v > 100 ? [Math.floor(v / 100) + ' m ' + v % 100 + ' cm', v] : [v + ' cm', v]); }
      list.sort(function (x, y) { return x[1] - y[1]; });
      return { q: 'Put these from <b>shortest</b> to <b>longest</b>.', type: 'order', items: list.map(function (x) { return x[0]; }), first: 'shortest', last: 'longest', hint: 'Change them all to cm.',
        steps: list.map(function (x) { return x[0] + ' = ' + x[1] + ' cm.'; }), explain: list.map(function (x) { return x[0]; }).join(', ') + '.', meta: { k: 'g3la-cp-order' } };
    }],
    [2, 'join', function (lv) {
      var k = lv === 3 ? R.pick(['km', 'm']) : R.pick(['m', 'cm']), B = k === 'km' ? [1000, 'm', 'km'] : k === 'm' ? [100, 'cm', 'm'] : [10, 'mm', 'cm'], a = R.int(1, lv === 3 ? 4 : 3), b = k === 'km' ? R.int(2, 9) * 100 + R.int(0, 9) * 10 : k === 'm' ? R.int(15, 95) : R.int(3, 9), f = {};
      f[a + b] = 'Change ' + a + ' ' + B[2] + ' to ' + B[1] + ' first.'; f[a * 10 + b] = B[0] + ' ' + B[1] + ' make 1 ' + B[2] + '.';
      return num('Two pieces of string are joined: <b>' + a + ' ' + B[2] + '</b> and <b>' + b + ' ' + B[1] + '</b>. How long is it in ' + UNW[B[1]] + '?', a * B[0] + b, f, { unit: B[1], fig: cmpFig([[a + ' ' + B[2], a * B[0]], [b + ' ' + B[1], b]]), hint: 'Same unit first, then add.',
        steps: [a + ' ' + B[2] + ' = ' + a * B[0] + ' ' + B[1] + '.', a * B[0] + ' + ' + b + ' = ' + (a * B[0] + b) + '.'], explain: (a * B[0] + b) + ' ' + B[1] + '.', meta: { k: 'g3la-cp-join' } });
    }],
    [3, 'story', function () {
      var w = Q.two(), a = R.int(1, 2), b = R.int(1, 9) * 10, c = R.int(40, 95), L = a * 100 + b, f = {};
      f[L] = 'That is ' + w[0] + '\'s ribbon in cm. Now subtract.'; f[a + b - c] = 'Change ' + a + ' m to cm first.';
      return num(w[0] + '\'s ribbon is <b>' + a + ' m ' + b + ' cm</b> long. ' + w[1] + '\'s ribbon is <b>' + c + ' cm</b>. How much longer is ' + w[0] + '\'s ribbon?', L - c, f, { unit: 'cm', fig: cmpFig([[a + ' m ' + b + ' cm', L], [c + ' cm', c]]),
        hint: 'Change ' + a + ' m ' + b + ' cm to cm.', steps: [a + ' m ' + b + ' cm = ' + L + ' cm.', L + ' &minus; ' + c + ' = ' + (L - c) + '.'], explain: (L - c) + ' cm longer.', meta: { k: 'g3la-cp-diff', L: a + ' m ' + b + ' cm', S: c + ' cm', u: 'cm' } });
    }]
  ]);
  function tgCmp(lv) {
    return function () {
      var p = cpCase(lv === 3 ? 2 : lv), big = p.a[0].indexOf(' ' + (p.unit === 'mm' ? 'cm' : p.unit === 'm' ? 'km' : 'm')) > 0 ? p.a : p.b, other = big === p.a ? p.b : p.a, f = {}, ans = p.a[1] > p.b[1] ? 0 : 1, g = {};
      f[+big[0].split(' ')[0]] = 'Change it to ' + p.unit + '.';
      g[1 - ans] = 'Compare ' + p.a[1] + ' and ' + p.b[1] + '.'; g[2] = 'They are not the same.';
      return { q: 'Which is longer: <b>' + p.a[0] + '</b> or <b>' + p.b[0] + '</b>?', done: cpSteps(p)[1], steps: [
        { prompt: 'Change ' + big[0] + ' to ' + UNW[p.unit] + '.', q: num(big[0] + ' = ? ' + p.unit, big[1], f, { unit: p.unit, hint: p.unit === 'mm' ? '10 mm make 1 cm.' : p.unit === 'cm' ? '100 cm make 1 m.' : '1000 m make 1 km.', meta: { k: 'g3la-cp-to', t: big[0], u: p.unit } }) },
        { prompt: 'Same unit now. Compare.', q: fixed('So which is longer?', [p.a[0], p.b[0], 'They are the same'], ans, g, { hint: big[1] + ' ' + p.unit + ' or ' + other[0] + '?', meta: { k: 'g3la-cp-mc' } }) }
      ] };
    };
  }

  /* ======================= Lesson 2: Different units, same length ======================= */
  var CT_U = { 1: [2, 3, 4, 5], 2: [3, 4, 5, 6, 8], 3: [6, 8, 10, 12, 15, 20, 25] };
  function ctCase(lv) { var u = R.pick(CT_U[lv]), n = lv === 1 ? R.int(3, 8) : R.int(4, lv === 3 ? 9 : 10); return { u: u, n: n, L: u * n, nm: UNAME[u] }; }
  function ctFig(c, lv) { return lv === 3 ? '' : ribbon(c.L, c.u, lv === 1 ? null : 1); }
  skill('la-count', 'Count the units', 'E2.5', [
    [1, 'plain', function (lv) {
      var c = ctCase(lv), f = {}; f[c.L] = 'That is the length in cm. Count the ' + c.nm + '.'; f[c.u] = 'That is the length of one. How many fit?';
      return num((lv === 3 ? 'A bench is <b>' + c.L + ' cm</b> long. ' : 'The ribbon is ' + c.L + ' cm long. ') + 'How many <b>' + c.u + ' cm ' + c.nm + '</b> fit along it, end to end?', c.n, f, { unit: c.nm, fig: ctFig(c, lv),
        hint: 'Count by ' + c.u + 's to ' + c.L + '.', steps: ['Count by ' + c.u + 's: ' + [1, 2, 3].map(function (i) { return c.u * i; }).join(', ') + ' ... ' + c.L + '.', c.L + ' &divide; ' + c.u + ' = ' + c.n + '.'], explain: c.n + ' ' + c.nm + '.', meta: { k: 'g3la-ct-num', L: c.L, u: c.u } });
    }],
    [1, 'reverse', function (lv) {
      var c = ctCase(lv), f = {}; f[c.n + c.u] = 'Each one is ' + c.u + ' cm. Count by ' + c.u + 's.'; f[c.n] = 'That counts the ' + c.nm + '. How many cm?';
      return num('The ribbon is ' + c.n + ' ' + c.nm + ' long. Each one is ' + c.u + ' cm. How long is the ribbon?', c.L, f, { unit: 'cm', fig: lv === 3 ? '' : ribbon(c.L, c.u, null, true),
        hint: c.n + ' groups of ' + c.u + '.', steps: [c.n + ' &times; ' + c.u + ' = ' + c.L + '.'], explain: c.L + ' cm.', meta: { k: 'g3la-ct-rev', n: c.n, u: c.u } });
    }],
    [2, 'story', function (lv) {
      var c = ctCase(lv), who = Q.name(), th = R.pick(['shelf', 'window ledge', 'bookcase', 'hockey stick', 'birchbark basket']), f = {}; f[c.L - c.u] = 'Count again by ' + c.u + 's.';
      return num(who + ' measures a ' + th + ' that is ' + c.L + ' cm long with ' + c.u + ' cm ' + c.nm + '. How many ' + c.nm + ' long is it?', c.n, f, { unit: c.nm, hint: 'How many ' + c.u + 's make ' + c.L + '?', steps: [c.L + ' &divide; ' + c.u + ' = ' + c.n + '.'], explain: c.n + ' ' + c.nm + '.', meta: { k: 'g3la-ct-num', L: c.L, u: c.u } });
    }],
    [1, 'mc', function (lv) {
      var c = ctCase(lv === 3 ? 2 : lv);
      return mc('How many ' + c.nm + ' long is the ribbon?', String(c.n), [[String(c.L), 'That is the length in cm.'], [String(c.n + 1), 'Count the ' + c.nm + ' again.'], [String(c.n - 1), 'Count the ' + c.nm + ' again.'], [String(c.u), 'That is the size of one.']], { fig: ribbon(c.L, c.u, lv === 1 ? null : 1),
        hint: 'Count by ' + c.u + 's to ' + c.L + '.', steps: [c.L + ' &divide; ' + c.u + ' = ' + c.n + '.'], explain: c.n + ' ' + c.nm + '.', meta: { k: 'g3la-ct-mc', L: c.L, u: c.u } });
    }],
    [2, 'tf', function (lv) {
      var c = ctCase(lv), who = Q.name(), truth = coin(), said = truth ? c.n : R.pick([c.n + 1, c.L]);
      return tf('A ' + c.L + ' cm ribbon is measured with ' + c.u + ' cm ' + c.nm + '. ' + who + ' says it is <b>' + said + ' ' + c.nm + '</b> long. True or false?', truth, c.n + ' &times; ' + c.u + ' = ' + c.L + ', so it is ' + c.n + ' ' + c.nm + ' long.',
        ['The count is the length in cm.', 'Every unit gives the same count.', 'Add 1 for the end.'], 'Check: ' + said + ' &times; ' + c.u + ' = ' + said * c.u + ', not ' + c.L + '.', { fig: ctFig(c, lv), hint: 'Multiply the count by ' + c.u + '.', meta: { k: 'g3la-ct-tf', L: c.L, u: c.u, said: said } });
    }]
  ]);
  function tgCount(lv) {
    return function () {
      var c = ctCase(lv), f2 = {}, f3 = {}; f2[c.L] = 'That is cm. Count the units.'; f3[c.L - c.u] = 'One short: count again.';
      return { q: 'How many ' + c.u + ' cm ' + c.nm + ' fit along a ' + c.L + ' cm ribbon?', fig: ribbon(c.L, c.u, lv === 1 ? null : 1), done: c.n + ' ' + c.nm + '.', steps: [
        { prompt: 'How long is one unit?', q: num('One ' + c.nm.replace(/s$/, '') + ' is how many cm?', c.u, {}, { unit: 'cm', hint: 'Read the question.', meta: { k: 'g3la-ct-one', u: c.u } }) },
        { prompt: 'Count by ' + c.u + 's until you reach ' + c.L + '.', q: num('How many units?', c.n, f2, { unit: c.nm, hint: 'Count by ' + c.u + 's.', meta: { k: 'g3la-ct-num', L: c.L, u: c.u } }) },
        { prompt: 'Check by multiplying.', q: num(c.n + ' &times; ' + c.u + ' = ?', c.L, f3, { unit: 'cm', hint: c.n + ' groups of ' + c.u + '.', meta: { k: 'g3la-ct-rev', n: c.n, u: c.u } }) }
      ] };
    };
  }

  /* ---------- Bigger unit, smaller count ---------- */
  var SZ = [[2, 4], [2, 6], [3, 6], [4, 8], [2, 8], [3, 12], [4, 12], [6, 12]];
  function szCase(lv) { var p = R.pick(lv === 1 ? SZ.slice(0, 4) : SZ), big = p[1], L = big * R.int(2, Math.floor(48 / big)); return { u1: p[0], u2: p[1], L: L, n1: L / p[0], n2: L / p[1], m1: UNAME[p[0]], m2: UNAME[p[1]] }; }
  skill('la-size', 'Bigger unit, smaller count', 'E2.5', [
    [1, 'plain', function (lv) {
      var c = szCase(lv), first = coin(), ask = coin() ? 'bigger' : 'smaller', A1 = first ? [c.u1, c.m1] : [c.u2, c.m2], B1 = first ? [c.u2, c.m2] : [c.u1, c.m1];
      var ans = ask === 'bigger' ? (A1[0] < B1[0] ? 0 : 1) : (A1[0] > B1[0] ? 0 : 1), f = {}; f[1 - ans] = ask === 'bigger' ? 'Longer units fit fewer times.' : 'Shorter units fit more times.'; f[2] = 'The ribbon is the same, but the units are not.';
      return fixed('One ribbon is measured with ' + A1[0] + ' cm ' + A1[1] + ' and with ' + B1[0] + ' cm ' + B1[1] + '. Which gives the <b>' + ask + '</b> count?', ['the ' + A1[1], 'the ' + B1[1], 'the counts are the same'], ans, f,
        { fig: lv === 3 ? '' : ribbon2(c.L, first ? c.u1 : c.u2, first ? c.u2 : c.u1), hint: 'Short units fit more times.', steps: [c.m1 + ': ' + c.n1 + '. ' + cap(c.m2) + ': ' + c.n2 + '.'], explain: 'The shorter unit gives the bigger count.', meta: { k: 'g3la-sz-mc', a: A1[0], b: B1[0], ask: ask } });
    }],
    [1, 'convert', function (lv) {
      var c = szCase(lv), f = {}; f[c.n1] = 'That is the count in ' + c.m1 + '. Find the length in cm first.'; f[c.L] = 'That is the length in cm. Now count the ' + c.m2 + '.';
      return num('A shelf is ' + c.n1 + ' ' + c.m1 + ' long. Each is ' + c.u1 + ' cm. How many ' + c.u2 + ' cm ' + c.m2 + ' long is it?', c.n2, f, { unit: c.m2, hint: 'Find the length in cm first.',
        steps: [c.n1 + ' &times; ' + c.u1 + ' = ' + c.L + ' cm.', c.L + ' &divide; ' + c.u2 + ' = ' + c.n2 + '.'], explain: c.n2 + ' ' + c.m2 + '.', meta: { k: 'g3la-sz-conv', n1: c.n1, u1: c.u1, u2: c.u2 } });
    }],
    [1, 'fill', function (lv) {
      var c = szCase(lv);
      return fill(c.n1 + ' ' + c.m1 + ' of ' + c.u1 + ' cm. How many ' + c.u2 + ' cm ' + c.m2 + '? Fill in the blanks.', c.n1 + ' &times; ' + c.u1 + ' = [[]] cm. [[]] &divide; ' + c.u2 + ' = [[]] ' + c.m2 + '.', [c.L, c.L, c.n2], { hint: 'Length in cm first.', steps: [c.n1 + ' &times; ' + c.u1 + ' = ' + c.L + '.', c.L + ' &divide; ' + c.u2 + ' = ' + c.n2 + '.'], explain: c.n2 + ' ' + c.m2 + '.', meta: { k: 'g3la-sz-fill', n1: c.n1, u1: c.u1, u2: c.u2 } });
    }],
    [1, 'tf', function (lv) {
      var c = szCase(lv), who = Q.name(), truth = coin(), say = truth ? [c.m1, c.u1] : [c.m2, c.u2];
      return tf(who + ' measures one ribbon with ' + c.u1 + ' cm ' + c.m1 + ' and ' + c.u2 + ' cm ' + c.m2 + '. ' + who + ' says the <b>' + say[0] + '</b> give the bigger count. True or false?', truth, 'Shorter units fit more times: ' + c.n1 + ' ' + c.m1 + ', but only ' + c.n2 + ' ' + c.m2 + '.',
        ['Longer units fit more times.', 'The counts are always the same.', 'A bigger count means a longer ribbon.'], 'Which unit is shorter? It fits more times.', { fig: lv === 3 ? '' : ribbon2(c.L, c.u1, c.u2), hint: 'Which unit is shorter?', meta: { k: 'g3la-sz-tf', said: say[1], u1: c.u1, u2: c.u2 } });
    }],
    [2, 'fewer', function (lv) {
      var c = szCase(lv), f = {}; f[c.n2] = 'That is the count of ' + c.m2 + '. How many fewer than ' + c.n1 + '?'; f[c.L] = 'That is the length in cm.';
      return num('A ' + c.L + ' cm ribbon is measured with ' + c.u1 + ' cm ' + c.m1 + ', then with ' + c.u2 + ' cm ' + c.m2 + '. How many <b>fewer</b> ' + c.m2 + ' than ' + c.m1 + '?', c.n1 - c.n2, f, { fig: lv === 3 ? '' : ribbon2(c.L, c.u1, c.u2), hint: 'Count each kind, then subtract.',
        steps: [c.L + ' &divide; ' + c.u1 + ' = ' + c.n1 + '. ' + c.L + ' &divide; ' + c.u2 + ' = ' + c.n2 + '.', c.n1 + ' &minus; ' + c.n2 + ' = ' + (c.n1 - c.n2) + '.'], explain: (c.n1 - c.n2) + ' fewer.', meta: { k: 'g3la-sz-fewer' } });
    }],
    [2, 'match', function (lv) {
      var L = R.pick([12, 24, 36]), us = R.shuffle([2, 3, 4, 6, 12].filter(function (u) { return L % u === 0 && u < L; })).slice(0, 3);
      var pairs = us.map(function (u) { return [u + ' cm ' + UNAME[u], L / u + ' of them']; });
      return { q: 'A ribbon is <b>' + L + ' cm</b> long. Match each unit to how many fit.', type: 'match', pairs: pairs, hint: 'Longer units fit fewer times.', steps: pairs.map(function (p) { return L + ' &divide; ' + p[0].split(' ')[0] + ' = ' + p[1].split(' ')[0] + '.'; }),
        explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'g3la-sz-match', L: L } };
    }],
    [3, 'story', function () {
      var w = Q.two(), p = R.pick([[12, 10], [15, 10], [10, 12], [20, 15], [15, 20], [12, 15]]), L = 60 * R.int(1, 3), f = {};
      f[L / p[0]] = 'That is ' + w[0] + '\'s count. Find the length in cm first.';
      return num(w[0] + ' measures a rug: ' + L / p[0] + ' hand spans of ' + p[0] + ' cm. ' + w[1] + '\'s hand span is ' + p[1] + ' cm. How many of ' + w[1] + '\'s spans long is the rug?', L / p[1], f, { unit: 'spans',
        hint: 'Length in cm first.', steps: [L / p[0] + ' &times; ' + p[0] + ' = ' + L + ' cm.', L + ' &divide; ' + p[1] + ' = ' + L / p[1] + '.'], explain: L / p[1] + ' spans.', meta: { k: 'g3la-sz-conv', n1: L / p[0], u1: p[0], u2: p[1] } });
    }]
  ]);
  function tgSize(lv) {
    return function () {
      var c = szCase(lv), f1 = {}, f2 = {}, g = {};
      f1[c.n1 + c.u1] = 'Multiply: ' + c.n1 + ' groups of ' + c.u1 + '.'; f2[c.L] = 'That is cm. Now count the ' + c.m2 + '.'; g[0] = 'Longer units fit fewer times.'; g[2] = 'Compare ' + c.n1 + ' and ' + c.n2 + '.';
      return { q: 'A ribbon is ' + c.n1 + ' ' + c.m1 + ' long (' + c.u1 + ' cm each). How many ' + c.u2 + ' cm ' + c.m2 + '?', fig: ribbon2(c.L, c.u1, c.u2), done: c.n2 + ' ' + c.m2 + '. Longer unit, smaller count.', steps: [
        { prompt: 'Find the length in cm.', q: num(c.n1 + ' &times; ' + c.u1 + ' = ? cm', c.L, f1, { unit: 'cm', hint: 'Count by ' + c.u1 + 's.', meta: { k: 'g3la-ct-rev', n: c.n1, u: c.u1 } }) },
        { prompt: 'Now count the longer units.', q: num(c.L + ' cm &divide; ' + c.u2 + ' cm = ?', c.n2, f2, { unit: c.m2, hint: 'Count by ' + c.u2 + 's.', meta: { k: 'g3la-ct-num', L: c.L, u: c.u2 } }) },
        { prompt: 'Compare the counts.', q: fixed('Which count is smaller?', ['the ' + c.m1, 'the ' + c.m2, 'the same'], 1, g, { hint: c.n1 + ' or ' + c.n2 + '?', meta: { k: 'g3la-sz-mc', a: c.u1, b: c.u2, ask: 'smaller' } }) }
      ] };
    };
  }

  /* ======================= Lesson 3: Perimeter ======================= */
  function okSides(s) { var t = add(s); return s.every(function (x) { return 2 * x < t; }); }
  function pmCase(lv) {
    var n = lv === 1 ? R.pick([3, 4]) : lv === 2 ? R.pick([5, 6]) : R.pick([3, 4, 5]), lo = lv === 3 ? 12 : lv === 2 ? 3 : 2, hi = lv === 3 ? 48 : lv === 2 ? 12 : 9, s;
    do { s = []; for (var i = 0; i < n; i++) s.push(R.int(lo, hi)); } while (!okSides(s));
    return { s: s, P: add(s), u: lv === 3 && coin() ? 'm' : 'cm' };
  }
  function pmFix(c) { var f = {}, mn = Math.min.apply(null, c.s), mx = Math.max.apply(null, c.s); f[c.P - mn] = 'You missed a side. Touch each side as you add.'; f[c.P - mx] = 'You missed a side. Touch each side as you add.'; f[c.P + mn] = 'A side was added twice. Start at one corner.'; return f; }
  skill('la-perim', 'Perimeter: add the sides', 'E2.1', [
    [1, 'plain', function (lv) { var c = pmCase(lv); return num('What is the perimeter of this shape?', c.P, pmFix(c), { unit: c.u, fig: poly(c.s, c.u), hint: 'Add every side: there are ' + c.s.length + '.', steps: [c.s.join(' + ') + ' = ' + c.P + '.'], explain: c.P + ' ' + c.u + '.', meta: { k: 'g3la-pm-num' } }); }],
    [1, 'fill', function (lv) {
      var c = pmCase(lv === 3 ? 2 : 1), run = [], t = c.s[0], txt = String(c.s[0]);
      for (var i = 1; i < c.s.length; i++) { t += c.s[i]; run.push(t); txt += (i === 1 ? ' + ' : ', then + ') + c.s[i] + ' = [[]]'; }
      return fill('Add the sides one at a time.', txt + ' ' + c.u, run, { fig: poly(c.s, c.u), hint: 'Keep a running total.', steps: run.map(function (v, i) { return 'Add ' + c.s[i + 1] + ': ' + v + '.'; }), explain: 'Perimeter: ' + c.P + ' ' + c.u + '.', meta: { k: 'g3la-pm-fill', s: c.s } });
    }],
    [2, 'story', function (lv) {
      var c = pmCase(lv), who = Q.name(), th = R.pick([['garden bed', 'fence'], ['playground', 'rope'], ['pond', 'path edging'], ['sandbox', 'board edging']]);
      c.u = 'm';
      return num(who + '\'s ' + th[0] + ' has ' + c.s.length + ' sides: ' + c.s.slice(0, -1).join(' m, ') + ' m and ' + c.s[c.s.length - 1] + ' m. How much ' + th[1] + ' goes all the way around?', c.P, pmFix(c), { unit: 'm', fig: poly(c.s, 'm'),
        hint: 'All the way around: add all ' + c.s.length + ' sides.', steps: [c.s.join(' + ') + ' = ' + c.P + '.'], explain: c.P + ' m.', meta: { k: 'g3la-pm-num' } });
    }],
    [1, 'mc', function (lv) {
      var c = pmCase(lv), mn = Math.min.apply(null, c.s), mx = Math.max.apply(null, c.s);
      return mc('What is the perimeter?', c.P + ' ' + c.u, [[(c.P - mn) + ' ' + c.u, 'A side is missing.'], [(c.P + mx) + ' ' + c.u, 'A side was added twice.'], [(c.P - mx) + ' ' + c.u, 'A side is missing.'], [(c.P + 10) + ' ' + c.u, 'Add again, carefully.']], { fig: poly(c.s, c.u), hint: 'Add all ' + c.s.length + ' sides.', steps: [c.s.join(' + ') + ' = ' + c.P + '.'], explain: c.P + ' ' + c.u + '.', meta: { k: 'g3la-pm-mc' } });
    }],
    [2, 'tf', function (lv) {
      var c = pmCase(lv), who = Q.name(), truth = coin(), said = truth ? c.P : c.P - R.pick(c.s);
      return tf(who + ' says the perimeter is <b>' + said + ' ' + c.u + '</b>. True or false?', truth, c.s.join(' + ') + ' = ' + c.P + ' ' + c.u + '.', ['Add only the longest sides.', 'Perimeter is the number of sides.', 'Add two sides and stop.'], 'Add every side again. One may be missing.',
        { fig: poly(c.s, c.u), hint: 'Count the sides first.', meta: { k: 'g3la-pm-tf', said: said } });
    }]
  ]);
  function tgPerim(lv) {
    return function () {
      var c = pmCase(lv), two = c.s[0] + c.s[1], f1 = {}, f3 = pmFix(c); f1[c.s.length + 1] = 'Touch each side once as you count.';
      return { q: 'What is the perimeter?', fig: poly(c.s, c.u), done: c.s.join(' + ') + ' = ' + c.P + ' ' + c.u + '.', steps: [
        { prompt: 'Count the sides.', q: num('How many sides?', c.s.length, f1, { hint: 'Count the labels.', meta: { k: 'g3la-pm-n', n: c.s.length } }) },
        { prompt: 'Start at a corner. Add the first two sides.', q: num(c.s[0] + ' + ' + c.s[1] + ' = ?', two, {}, { unit: c.u, hint: 'Add the two numbers.', meta: { k: 'g3la-mm-add', a: c.s[0], b: c.s[1] } }) },
        { prompt: 'Add the rest, one side at a time.', q: num('The perimeter is?', c.P, f3, { unit: c.u, hint: two + ' + ' + c.s.slice(2).join(' + ') + '.', meta: { k: 'g3la-pm-sum', s: c.s } }) }
      ] };
    };
  }

  /* ---------- Perimeter of a rectangle ---------- */
  function rcCase(lv) { if (lv === 1) { var l = R.int(3, 9); return { l: l, w: R.int(2, l - 1), u: 'cm' }; } var L = R.int(10, 40); return { l: L, w: R.int(5, L - 3), u: coin() ? 'm' : 'cm' }; }
  function rcFix(l, w) { var f = {}; f[l + w] = 'That is only two sides. A rectangle has four.'; f[l * w] = 'That is the area inside. Perimeter goes around.'; f[2 * l + w] = 'One side is missing.'; f[l + 2 * w] = 'One side is missing.'; return f; }
  function rcSteps(l, w, u) { return ['The sides across match: ' + l + ' and ' + l + ', ' + w + ' and ' + w + '.', l + ' + ' + w + ' + ' + l + ' + ' + w + ' = ' + 2 * (l + w) + ' ' + u + '.']; }
  skill('la-rect', 'Perimeter of a rectangle', 'E2.1', [
    [1, 'plain', function (lv) {
      if (lv === 3) { var P0 = R.int(8, 30) * 2, a = R.int(3, P0 / 2 - 2), b = P0 / 2 - a, f0 = {}; f0[P0 - a] = 'Only two sides are known: take away both ' + a + 's.'; f0[P0 / 2] = 'That is one length and one width together.';
        return num('A rectangle has a perimeter of <b>' + P0 + ' cm</b>. One side is <b>' + a + ' cm</b>. How long is the side next to it?', b, f0, { unit: 'cm', fig: rect(a, Math.min(b, 12), { labels: 'one' }), hint: 'Half the perimeter is one length and one width.', steps: ['Half of ' + P0 + ' is ' + P0 / 2 + '.', P0 / 2 + ' &minus; ' + a + ' = ' + b + '.'], explain: b + ' cm.', meta: { k: 'g3la-rc-rev', P: P0, a: a } }); }
      var c = rcCase(lv);
      return num('What is the perimeter of this rectangle?', 2 * (c.l + c.w), rcFix(c.l, c.w), { unit: c.u, fig: rect(c.l, c.w, { unit: c.u }), hint: 'Only two sides are labelled. The other two match them.', steps: rcSteps(c.l, c.w, c.u), explain: 2 * (c.l + c.w) + ' ' + c.u + '.', meta: { k: 'g3la-rc-num', l: c.l, w: c.w } });
    }],
    [1, 'fill', function (lv) {
      var c = rcCase(lv);
      return fill('Fill in the blanks.', 'Two long sides: [[]] ' + c.u + '. Two short sides: [[]] ' + c.u + '. Perimeter: [[]] ' + c.u + '.', [2 * c.l, 2 * c.w, 2 * (c.l + c.w)], { fig: rect(c.l, c.w, { unit: c.u }), hint: 'Double each labelled side.', steps: [c.l + ' + ' + c.l + ' = ' + 2 * c.l + '.', c.w + ' + ' + c.w + ' = ' + 2 * c.w + '.', 2 * c.l + ' + ' + 2 * c.w + ' = ' + 2 * (c.l + c.w) + '.'], explain: 2 * (c.l + c.w) + ' ' + c.u + '.', meta: { k: 'g3la-rc-fill', l: c.l, w: c.w } });
    }],
    [1, 'square', function (lv) {
      var s = lv === 1 ? R.int(2, 9) : R.int(11, 25), f = {}; f[s * 2] = 'A square has 4 sides, not 2.'; f[s * s] = 'That is the area. Perimeter goes around.'; f[s * 3] = 'One side is missing.';
      return num('A square has sides of <b>' + s + ' cm</b>. What is its perimeter?', 4 * s, f, { unit: 'cm', fig: rect(Math.min(s, 12), Math.min(s, 12), { labels: 'one' }).replace('>' + Math.min(s, 12) + ' cm<', '>' + s + ' cm<'), hint: 'All 4 sides of a square match.', steps: [s + ' + ' + s + ' + ' + s + ' + ' + s + ' = ' + 4 * s + '.'], explain: 4 * s + ' cm.', meta: { k: 'g3la-rc-sq', s: s } });
    }],
    [2, 'story', function (lv) {
      var who = Q.name(), t = R.pick([['hockey rink', 'boards', 60, 26], ['vegetable garden', 'fence', 12, 8], ['school yard', 'rope', 40, 25], ['ice rink in the park', 'snow fence', 30, 15], ['canoe dock', 'railing', 14, 3]]), k = lv === 3 ? 1 : 0, l = t[2] + R.int(-2, 2) * (k + 1), w = t[3] + R.int(-2, 2);
      return num('The ' + t[0] + ' is a rectangle, ' + l + ' m long and ' + w + ' m wide. How many metres of ' + t[1] + ' go all the way around?', 2 * (l + w), rcFix(l, w), { unit: 'm', fig: rect(l, w, { unit: 'm' }), hint: 'All the way around: four sides.', steps: rcSteps(l, w, 'm'), explain: 2 * (l + w) + ' m.', meta: { k: 'g3la-rc-num', l: l, w: w } });
    }],
    [2, 'tf', function (lv) {
      var c = rcCase(lv), who = Q.name(), truth = coin(), said = truth ? 2 * (c.l + c.w) : R.pick([c.l + c.w, c.l * c.w === 2 * (c.l + c.w) ? c.l + c.w : c.l * c.w]);
      return tf(who + ' says the perimeter is <b>' + said + ' ' + c.u + '</b>. True or false?', truth, rcSteps(c.l, c.w, c.u)[1], ['Add the two numbers you can see.', 'Multiply the length by the width.', 'Count the corners.'], 'A rectangle has four sides. Add all of them.',
        { fig: rect(c.l, c.w, { unit: c.u }), hint: 'How many sides does a rectangle have?', meta: { k: 'g3la-rc-tf', l: c.l, w: c.w, said: said } });
    }]
  ]);
  function tgRect(lv) {
    return function () {
      var c = rcCase(lv === 3 ? 2 : lv), f1 = {}, f2 = {}; f1[c.w] = 'That is the short side. Look at the long side.'; f2[c.l] = 'That is the long side. Look at the short side.';
      return { q: 'What is the perimeter of this rectangle?', fig: rect(c.l, c.w, { unit: c.u }), done: rcSteps(c.l, c.w, c.u)[1], steps: [
        { prompt: 'The side across from ' + c.l + ' ' + c.u + ' matches it.', q: num('How long is the bottom side?', c.l, f1, { unit: c.u, hint: 'It matches the top.', meta: { k: 'g3la-rc-across', v: c.l } }) },
        { prompt: 'The side across from ' + c.w + ' ' + c.u + ' matches it too.', q: num('How long is the right side?', c.w, f2, { unit: c.u, hint: 'It matches the left.', meta: { k: 'g3la-rc-across', v: c.w } }) },
        { prompt: 'Add all four sides.', q: num(c.l + ' + ' + c.w + ' + ' + c.l + ' + ' + c.w + ' = ?', 2 * (c.l + c.w), rcFix(c.l, c.w), { unit: c.u, hint: 'Add them one at a time.', meta: { k: 'g3la-rc-num', l: c.l, w: c.w } }) }
      ] };
    };
  }

  /* ---------- Curved sides: use a string ---------- */
  var CV = [['a plate', 'circle'], ['a hand drum', 'circle'], ['a mirror', 'oval'], ['a pond on a map', 'blob'], ['a maple leaf drawing', 'leaf'], ['a placemat', 'oval']], ARCH = ['an arch window', 'a half-moon cookie', 'a tunnel opening'];
  function cvCase(lv) { var t = R.pick(CV); return { t: t[0], kind: t[1], n: lv === 1 ? R.int(12, 29) : R.int(31, 59) }; }
  skill('la-curve', 'Perimeter of curved shapes', 'E2.1', [
    [1, 'plain', function (lv) {
      var c = cvCase(lv), f = {}; f[c.n + 1] = 'Read the mark where the string ends.'; f[c.n - 1] = 'Read the mark where the string ends.';
      return num('A string goes once around ' + c.t + '. Then it is laid straight on a ruler. What is the perimeter?', c.n, f, { unit: 'cm', fig: curveFig(c.kind, c.n), hint: 'The string starts at 0. Where does it end?', steps: ['The string is as long as the way around.', 'It ends at ' + c.n + ' cm.'], explain: c.n + ' cm.', meta: { k: 'g3la-cv-num' } });
    }],
    [1, 'mc', function () {
      var c = R.pick(CV);
      return mc('How can you find the perimeter of ' + c[0] + '?', 'Wrap a string, then measure it', [['Measure straight across it', 'That goes through the middle, not around.'], ['Count how many corners it has', 'It has no corners. The edge is curved.'], ['Hold a ruler on one part of the edge', 'A straight ruler cannot bend around the curve.']],
        { fig: curveShape(c[1]), hint: 'What can bend around a curve?', steps: ['A string bends around the curve.', 'Then lay it straight on a ruler.'], explain: 'Wrap a string around it, then measure the string.', meta: { k: 'g3la-cv-tool' } });
    }],
    [2, 'compare', function (lv) {
      var a = R.pick(CV), b = R.pick(CV.filter(function (x) { return x !== a; })), x = R.int(lv === 3 ? 60 : 30, lv === 3 ? 99 : 59), y = R.int(15, x - 5), f = {}; f[x + y] = 'How much longer: subtract.';
      return num('The string around ' + a[0] + ' is ' + x + ' cm. The string around ' + b[0] + ' is ' + y + ' cm. How much longer is the way around ' + a[0] + '?', x - y, f, { unit: 'cm', hint: 'Subtract the shorter string.', steps: [x + ' &minus; ' + y + ' = ' + (x - y) + '.'], explain: (x - y) + ' cm longer.', meta: { k: 'g3la-cv-cmp', x: x, y: y } });
    }],
    [2, 'fill', function (lv) {
      var t = R.pick(ARCH), n = R.int(lv === 3 ? 31 : 14, lv === 3 ? 59 : 29), st = R.int(8, 20);
      return fill('The string goes around the curved part of ' + t + '. The straight side is ' + st + ' cm. Fill in the blanks.', 'Curved part: [[]] cm. Straight side: [[]] cm. Perimeter: [[]] cm.', [n, st, n + st], { fig: curveFig('arch', n, st), hint: 'Read the string, then add the straight side.', steps: ['The string reads ' + n + ' cm.', n + ' + ' + st + ' = ' + (n + st) + '.'], explain: (n + st) + ' cm.', meta: { k: 'g3la-cv-fill', st: st } });
    }],
    [3, 'arch', function () {
      var t = R.pick(ARCH), n = R.int(31, 59), st = R.int(12, 25), f = {}; f[n] = 'That is only the curved part. Add the straight side.'; f[st] = 'Add the curved part too.';
      return num('What is the perimeter of ' + t + '? The string shows the curved part.', n + st, f, { unit: 'cm', fig: curveFig('arch', n, st), hint: 'Curved part plus straight side.', steps: ['Curved part: ' + n + ' cm.', n + ' + ' + st + ' = ' + (n + st) + '.'], explain: (n + st) + ' cm.', meta: { k: 'g3la-cv-arch', st: st } });
    }],
    [2, 'tf', function (lv) {
      var c = cvCase(lv), who = Q.name(), truth = coin(), said = truth ? c.n : c.n + R.pick([-2, 2, 10]);
      return tf('A string went once around ' + c.t + '. ' + who + ' says the perimeter is <b>' + said + ' cm</b>. True or false?', truth, 'The string ends at ' + c.n + ' cm, so the perimeter is ' + c.n + ' cm.', ['Measure straight across instead.', 'A curved shape has no perimeter.', 'Add 10 for the curve.'], 'Read where the string ends.',
        { fig: curveFig(c.kind, c.n), hint: 'Where does the string end?', meta: { k: 'g3la-cv-tf', said: said } });
    }]
  ]);
  function tgCurve(lv) {
    return function () {
      var t = R.pick(ARCH), n = R.int(lv === 1 ? 14 : 31, lv === 1 ? 29 : 59), st = R.int(8, 20), f2 = {}; f2[n] = 'That is the curved part only.';
      return { q: 'What is the perimeter of ' + t + '?', fig: curveFig('arch', n, st), done: n + ' + ' + st + ' = ' + (n + st) + ' cm.', steps: [
        { prompt: 'The string measures the curved part. Read where it ends.', q: num('How long is the curved part?', n, {}, { unit: 'cm', hint: 'The string starts at 0.', meta: { k: 'g3la-cv-part', n: n } }) },
        { prompt: 'Now add the straight side.', q: num(n + ' + ' + st + ' = ?', n + st, f2, { unit: 'cm', hint: 'Add the two parts.', meta: { k: 'g3la-mm-add', a: n, b: st } }) }
      ] };
    };
  }

  /* ---------- Make a given perimeter ---------- */
  function bdTri(lv) { var a, b, c; do { a = R.int(lv === 3 ? 10 : 3, lv === 3 ? 30 : 9); b = R.int(lv === 3 ? 10 : 3, lv === 3 ? 30 : 9); c = R.int(lv === 3 ? 10 : 3, lv === 3 ? 30 : 9); } while (!okSides([a, b, c])); return { a: a, b: b, c: c, P: a + b + c }; }
  skill('la-build', 'Make a given perimeter', 'E2.1', [
    [1, 'plain', function (lv) {
      var t = bdTri(lv), f = {}; f[t.a + t.b] = 'That is the two sides you know. Take them away from ' + t.P + '.'; f[t.P] = 'That is the whole way around. Take away the sides you know.';
      return num('A triangle must have a perimeter of <b>' + t.P + ' cm</b>. Two sides are ' + t.a + ' cm and ' + t.b + ' cm. How long is the third side?', t.c, f, { unit: 'cm', fig: poly([t.a, t.b, '?']), hint: 'Add the two sides. Subtract from ' + t.P + '.',
        steps: [t.a + ' + ' + t.b + ' = ' + (t.a + t.b) + '.', t.P + ' &minus; ' + (t.a + t.b) + ' = ' + t.c + '.'], explain: t.c + ' cm.', meta: { k: 'g3la-bd-tri', P: t.P, a: t.a, b: t.b } });
    }],
    [1, 'fill', function (lv) {
      var t = bdTri(lv);
      return fill('Perimeter ' + t.P + ' cm. Sides ' + t.a + ' cm and ' + t.b + ' cm. Fill in the blanks.', t.a + ' + ' + t.b + ' = [[]]. ' + t.P + ' &minus; [[]] = [[]] cm.', [t.a + t.b, t.a + t.b, t.c], { fig: poly([t.a, t.b, '?']), hint: 'Sides you know first.', steps: [t.a + ' + ' + t.b + ' = ' + (t.a + t.b) + '.', t.P + ' &minus; ' + (t.a + t.b) + ' = ' + t.c + '.'], explain: 'The third side is ' + t.c + ' cm.', meta: { k: 'g3la-bd-fill', P: t.P, a: t.a, b: t.b } });
    }],
    [2, 'pick', function (lv) {
      var P = R.pick(lv === 3 ? [20, 24, 28, 30] : [12, 14, 16, 18]), opts = [], seen = {};
      while (opts.length < 4) {
        var good = opts.length < 2, l = R.int(2, P / 2 - 1), w = good ? P / 2 - l : P / 2 - l + R.pick([1, -1, 2]), key = Math.min(l, w) + ',' + Math.max(l, w);
        if (w < 1 || seen[key]) continue; seen[key] = 1; opts.push(l + ' cm by ' + w + ' cm');
      }
      opts = R.shuffle(opts);
      var ans = []; opts.forEach(function (o, j) { var n = o.match(/\d+/g); if (2 * (+n[0] + +n[1]) === P) ans.push(j); });
      return { q: 'Pick <b>every</b> rectangle with a perimeter of <b>' + P + ' cm</b>.', type: 'pick', options: opts, answer: ans, hint: 'Length + width must be half of ' + P + '.', steps: ['Half of ' + P + ' is ' + P / 2 + '.', 'Look for a length and width that add to ' + P / 2 + '.'],
        explain: ans.map(function (j) { return opts[j]; }).join(' and ') + '.', meta: { k: 'g3la-bd-pick', P: P } };
    }],
    [2, 'square', function (lv) {
      var s = lv === 3 ? R.int(11, 25) : R.int(3, 10), f = {}; f[s * 2] = '4 equal sides share the perimeter, not 2.'; f[4 * s * 4] = 'Share the perimeter into 4 equal sides.';
      return num('Jayden builds a square with a perimeter of <b>' + 4 * s + ' cm</b>. How long is each side?', s, f, { unit: 'cm', hint: '4 equal sides.', steps: ['4 equal sides make ' + 4 * s + '.', 4 * s + ' &divide; 4 = ' + s + '.'], explain: s + ' cm.', meta: { k: 'g3la-bd-sq', P: 4 * s } });
    }],
    [2, 'tap', function (lv) {
      var P = R.pick([12, 14, 16, 18, 20]), set = [], seen = {};
      while (set.length < 3) { var l = R.int(2, 8), w = set.length ? R.int(1, 6) : P / 2 - l; if (w < 1 || w > 8 || (set.length && 2 * (l + w) === P) || seen[l + ',' + w]) continue; seen[l + ',' + w] = 1; set.push([l, w]); }
      set = R.shuffle(set);
      var k = 0; set.forEach(function (p, j) { if (2 * (p[0] + p[1]) === P) k = j; });
      return { q: 'Tap the rectangle with a perimeter of <b>' + P + ' cm</b>.', type: 'tap', tiles: set.map(function (p) { return rect(p[0], p[1]); }), answer: k, answerText: 'the ' + set[k][0] + ' cm by ' + set[k][1] + ' cm rectangle',
        hint: 'Add all four sides of each one.', steps: [set[k][0] + ' + ' + set[k][1] + ' + ' + set[k][0] + ' + ' + set[k][1] + ' = ' + P + '.'], explain: 'The ' + set[k][0] + ' by ' + set[k][1] + ' rectangle.', meta: { k: 'g3la-bd-tap', P: P } };
    }],
    [3, 'tf', function () {
      var l = R.int(3, 9), w = R.int(2, 8), who = Q.name(), P = 2 * (l + w), truth = coin(), target = truth ? P : P + R.pick([-2, 2, -4]);
      return tf(who + ' needs a perimeter of <b>' + target + ' cm</b> and builds a ' + l + ' cm by ' + w + ' cm rectangle. True or false: it works.', truth, l + ' + ' + w + ' + ' + l + ' + ' + w + ' = ' + P + ' cm.', ['Length plus width is the perimeter.', 'Length times width is the perimeter.', 'Any rectangle works.'], 'Add all four sides: ' + P + ' cm.',
        { fig: rect(l, w), hint: 'Add all four sides.', meta: { k: 'g3la-bd-tf', l: l, w: w, P: target } });
    }]
  ]);
  function tgBuild(lv) {
    return function () {
      var t = bdTri(lv), f2 = {}; f2[t.a + t.b] = 'Now take that away from ' + t.P + '.';
      return { q: 'Make a triangle with a perimeter of ' + t.P + ' cm. Two sides are ' + t.a + ' cm and ' + t.b + ' cm.', fig: poly([t.a, t.b, '?']), done: 'The third side is ' + t.c + ' cm.', steps: [
        { prompt: 'Add the sides you know.', q: num(t.a + ' + ' + t.b + ' = ?', t.a + t.b, {}, { unit: 'cm', hint: 'Add the two numbers.', meta: { k: 'g3la-mm-add', a: t.a, b: t.b } }) },
        { prompt: 'Take that away from the perimeter.', q: num(t.P + ' &minus; ' + (t.a + t.b) + ' = ?', t.c, f2, { unit: 'cm', hint: 'Count up from ' + (t.a + t.b) + ' to ' + t.P + '.', meta: { k: 'g3la-bd-tri', P: t.P, a: t.a, b: t.b } }) }
      ] };
    };
  }

  /* ======================= Lesson 4: Area ======================= */
  function cvShape(lv) {
    if (lv === 1) { var r = R.int(2, 4), c = R.int(2, 5); return { cells: rectCells(r, c), r: r, c: c }; }
    if (lv === 2) { var rows = [], n = R.int(3, 4), base = R.int(3, 5); for (var i = 0; i < n; i++) rows.push([0, i === 0 || coin() ? base : R.int(2, base - 1)]); if (rows.every(function (x) { return x[1] === base; })) rows[n - 1] = [0, base - 1]; return { cells: rowsCells(rows) }; }
    var rr = R.int(4, 6), cc = R.int(5, 8), cut = R.int(1, 2), cw = R.int(1, 3), cells = rectCells(rr, cc).filter(function (p) { return !(p[1] < cut && p[0] >= cc - cw); });
    return { cells: cells };
  }
  function rowCounts(cells) { var by = {}; cells.forEach(function (p) { by[p[1]] = (by[p[1]] || 0) + 1; }); return Object.keys(by).sort(function (a, b) { return a - b; }).map(function (k) { return by[k]; }); }
  skill('la-area', 'Area: count the squares', 'E2.8', [
    [1, 'plain', function (lv) {
      var s = cvShape(lv), rc = rowCounts(s.cells), n = s.cells.length, f = {}; f[rc.length + Math.max.apply(null, rc)] = 'That adds rows and columns. Count every square.';
      return num('Each square is 1 square unit. What is the area of the shape?', n, f, { unit: 'square units', fig: cellsFig(s.cells, { c: lv === 3 ? 30 : 38 }), hint: 'Count row by row, then add.', steps: ['Rows: ' + rc.join(', ') + '.', rc.join(' + ') + ' = ' + n + '.'], explain: n + ' square units.', meta: { k: 'g3la-ar-num' } });
    }],
    [1, 'fill', function (lv) {
      var r = R.int(2, lv === 1 ? 4 : 6), c = R.int(2, lv === 1 ? 5 : 8);
      return fill('Look at the rectangle. Fill in the blanks.', '[[]] rows of [[]] squares = [[]] square units', [r, c, r * c], { fig: cellsFig(rectCells(r, c), { c: 32 }), hint: 'Count the rows down. Count the squares in one row.', steps: ['There are ' + r + ' rows.', 'Each row has ' + c + ' squares.', r + ' &times; ' + c + ' = ' + r * c + '.'], explain: r * c + ' square units.', meta: { k: 'g3la-ar-fill' } });
    }],
    [1, 'tap', function (lv) {
      var set = [], seen = {};
      while (set.length < 3) { var r = R.int(2, lv === 1 ? 3 : 5), c = R.int(2, 6); if (seen[r * c]) continue; seen[r * c] = 1; set.push([r, c]); }
      var k = R.int(0, 2), N = set[k][0] * set[k][1];
      return { q: 'Tap the shape with an area of <b>' + N + ' square units</b>.', type: 'tap', tiles: set.map(function (p) { return cellsFig(rectCells(p[0], p[1]), { c: 24 }); }), answer: k, answerText: 'the ' + set[k][0] + ' by ' + set[k][1] + ' rectangle',
        hint: 'Count the squares in each shape.', steps: [set[k][0] + ' rows of ' + set[k][1] + ' = ' + N + '.'], explain: set[k][0] + ' &times; ' + set[k][1] + ' = ' + N + '.', meta: { k: 'g3la-ar-tap', N: N } };
    }],
    [2, 'story', function (lv) {
      var who = Q.name(), r = R.int(lv === 3 ? 5 : 2, lv === 3 ? 9 : 5), c = R.int(lv === 3 ? 5 : 3, lv === 3 ? 9 : 6), th = R.pick([['a baking tray', 'square crackers'], ['a quilt', 'square patches'], ['a tray', 'square tiles'], ['a bulletin board', 'square sticky notes']]), f = {}; f[r + c] = 'That adds the rows and columns. Each row has ' + c + '.'; f[2 * (r + c)] = 'That is the way around, not the space inside.';
      return num(who + ' covers ' + th[0] + ' with ' + th[1] + ': ' + r + ' rows of ' + c + ', with no gaps. How many ' + th[1].split(' ').pop() + ' does it take?', r * c, f, { fig: lv === 3 ? '' : cellsFig(rectCells(r, c), { c: 30 }), hint: r + ' rows, each with ' + c + '.', steps: ['Count by ' + c + 's, ' + r + ' times.', r + ' &times; ' + c + ' = ' + r * c + '.'], explain: r * c + '.', meta: { k: 'g3la-ar-story', r: r, c: c } });
    }],
    [2, 'tf', function (lv) {
      var s = cvShape(lv), n = s.cells.length, who = Q.name(), truth = coin(), said = truth ? n : n + R.pick([-2, -1, 1, 2]);
      return tf(who + ' says the area is <b>' + said + ' square units</b>. True or false?', truth, 'Row by row: ' + rowCounts(s.cells).join(' + ') + ' = ' + n + '.', ['Count only the squares on the edge.', 'Count the sides of the shape.', 'Add the rows and the columns.'], 'Count again, row by row.',
        { fig: cellsFig(s.cells, { c: lv === 3 ? 30 : 36 }), hint: 'Count row by row.', meta: { k: 'g3la-ar-tf', said: said } });
    }]
  ]);
  function tgArea(lv) {
    return function () {
      var s = cvShape(lv), rc = rowCounts(s.cells), n = s.cells.length, rest = n - rc[0], f3 = {}; f3[rest] = 'Add the top row too.';
      return { q: 'What is the area? Each square is 1 square unit.', fig: cellsFig(s.cells, { c: 34 }), done: rc[0] + ' + ' + rest + ' = ' + n + ' square units.', steps: [
        { prompt: 'Count the top row.', q: num('How many squares in the top row?', rc[0], {}, { hint: 'Touch each one.', meta: { k: 'g3la-ar-row', v: rc[0] } }) },
        { prompt: 'Now count all the other rows.', q: num('How many squares in the other rows?', rest, {}, { hint: 'Rows: ' + rc.slice(1).join(', ') + '.', meta: { k: 'g3la-ar-row', v: rest } }) },
        { prompt: 'Add them.', q: num(rc[0] + ' + ' + rest + ' = ?', n, f3, { unit: 'square units', hint: 'Add the two parts.', meta: { k: 'g3la-mm-add', a: rc[0], b: rest } }) }
      ] };
    };
  }

  /* ---------- No gaps, no overlaps ---------- */
  var GP_FIX = { gap: 'There are gaps: parts are not counted, so the count is too low.', over: 'The tiles overlap: parts are counted twice, so the count is too high.', fit: 'The tiles fit edge to edge: every part counted once.' };
  var GP_ANS = { gap: 0, over: 1, fit: 2 }, GP_OPT = ['too low', 'too high', 'just right'];
  function gpSize(lv) { return lv === 1 ? [4, 3] : lv === 2 ? [R.int(3, 5), R.int(2, 3)] : [R.int(4, 6), R.int(3, 4)]; }
  skill('la-gaps', 'Gaps and overlaps', 'E2.8', [
    [1, 'plain', function (lv) {
      var mode = R.pick(['gap', 'over', 'fit']), sz = gpSize(lv), g = gapFig(mode, sz[0], sz[1]), f = {};
      GP_OPT.forEach(function (o, j) { if (j !== GP_ANS[mode]) f[j] = GP_FIX[mode]; });
      return fixed(Q.name() + ' counted these tiles to find the area. The count is:', GP_OPT, GP_ANS[mode], f, { fig: g.svg, hint: 'Is any part missed? Is any part covered twice?', steps: [GP_FIX[mode]], explain: GP_FIX[mode], meta: { k: 'g3la-gp-mc', w: sz[0], h: sz[1] } });
    }],
    [1, 'tap', function (lv) {
      var sz = gpSize(lv), modes = R.shuffle(['fit', 'gap', 'over']), w = {};
      modes.forEach(function (m, j) { if (m !== 'fit') w[String(j)] = GP_FIX[m]; });
      return { q: 'Which tiles measure the area correctly? Tap it.', type: 'tap', tiles: modes.map(function (m) { return gapFig(m, sz[0], sz[1]).svg; }), answer: modes.indexOf('fit'), answerText: 'the tiles that fit edge to edge', wrong: w,
        hint: 'No gaps and no overlaps.', steps: ['Gaps leave parts out. Overlaps count parts twice.'], explain: 'The tiles that fit edge to edge.', meta: { k: 'g3la-gp-tap', w: sz[0], h: sz[1] } };
    }],
    [1, 'short', function (lv) {
      var sz = gpSize(lv), g = gapFig('gap', sz[0], sz[1]), N = sz[0] * sz[1], f = {}; f[g.n] = 'That is how many fit with gaps. How many fewer than ' + N + '?';
      return num('Edge to edge, ' + N + ' tiles cover this rectangle. With gaps, how many <b>fewer</b> tiles were counted?', N - g.n, f, { fig: g.svg, hint: 'Count the tiles, then subtract from ' + N + '.', steps: ['Count the tiles: ' + g.n + '.', N + ' &minus; ' + g.n + ' = ' + (N - g.n) + '.'], explain: (N - g.n) + ' fewer: the count is too low.', meta: { k: 'g3la-gp-short', w: sz[0], h: sz[1] } });
    }],
    [2, 'extra', function (lv) {
      var sz = gpSize(lv), g = gapFig('over', sz[0], sz[1]), N = sz[0] * sz[1], f = {}; f[g.n] = 'That is the overlapping count. How many more than ' + N + '?';
      return num('Edge to edge, ' + N + ' tiles cover this rectangle. Overlapping, how many <b>extra</b> tiles were counted?', g.n - N, f, { fig: g.svg, hint: 'Count the tiles, then subtract ' + N + '.', steps: ['Count the tiles: ' + g.n + '.', g.n + ' &minus; ' + N + ' = ' + (g.n - N) + '.'], explain: (g.n - N) + ' extra: the count is too high.', meta: { k: 'g3la-gp-extra', w: sz[0], h: sz[1] } });
    }],
    [2, 'left', function (lv) {
      var who = Q.name(), r = R.int(lv === 3 ? 5 : 3, lv === 3 ? 8 : 5), c = R.int(lv === 3 ? 6 : 3, lv === 3 ? 9 : 6), N = r * c, g = R.int(Math.ceil(N / 3), N - 3), f = {}; f[g] = 'That is the count with gaps. How many were left out?'; f[N] = 'That is the true area.';
      return num(who + ' covers a tray, ' + r + ' rows of ' + c + ' tiles edge to edge. With gaps, ' + who + ' fits only ' + g + ' tiles. How many tiles did the gaps leave out?', N - g, f, { hint: 'Find the true count, then subtract.', steps: [r + ' &times; ' + c + ' = ' + N + '.', N + ' &minus; ' + g + ' = ' + (N - g) + '.'], explain: (N - g) + ' tiles left out.', meta: { k: 'g3la-gp-left' } });
    }],
    [1, 'fit', function (lv) {
      var sz = gpSize(lv), g = gapFig('fit', sz[0], sz[1]), f = {}; f[2 * (sz[0] + sz[1])] = 'That counts around the edge. Count every tile.';
      return num('These tiles fit edge to edge. What is the area in tiles?', g.n, f, { unit: 'tiles', fig: g.svg, hint: sz[1] + ' rows of ' + sz[0] + '.', steps: [sz[1] + ' &times; ' + sz[0] + ' = ' + g.n + '.'], explain: g.n + ' tiles.', meta: { k: 'g3la-gp-fit', w: sz[0], h: sz[1] } });
    }],
    [2, 'tf', function (lv) {
      var sz = gpSize(lv), mode = R.pick(['gap', 'over']), who = Q.name(), truth = coin(), said = truth === (mode === 'gap') ? 'too low' : 'too high';
      return tf(who + ' covered a rectangle like this and says the count is <b>' + said + '</b>. True or false?', truth, GP_FIX[mode], ['Any way of covering gives the right count.', 'Gaps make the count too high.', 'Overlaps make the count too low.'], 'Gaps: too low. Overlaps: too high.',
        { fig: gapFig(mode, sz[0], sz[1]).svg, hint: 'Is any part missed or covered twice?', meta: { k: 'g3la-gp-tf', w: sz[0], h: sz[1], said: said } });
    }],
    [3, 'story', function () {
      var who = Q.name(), m = R.pick([['leaves gaps between the', 0], ['lets the', 1], ['lays edge to edge the', 2]]), th = R.pick(['sticky notes', 'index cards', 'square tiles', 'playing cards']), f = {};
      var how = m[1] === 1 ? who + ' covers a desk and ' + m[0] + ' ' + th + ' overlap.' : who + ' covers a desk and ' + m[0] + ' ' + th + '.';
      GP_OPT.forEach(function (o, j) { if (j !== m[1]) f[j] = GP_FIX[['gap', 'over', 'fit'][m[1]]]; });
      return fixed(how + ' The count for the area is:', GP_OPT, m[1], f, { hint: 'Missed parts or parts counted twice?', steps: [GP_FIX[['gap', 'over', 'fit'][m[1]]]], explain: GP_FIX[['gap', 'over', 'fit'][m[1]]], meta: { k: 'g3la-gp-story', m: m[1] } });
    }]
  ]);
  function tgGaps(mode) {
    return function () {
      var sz = gpSize(2), g = gapFig(mode, sz[0], sz[1]), N = sz[0] * sz[1], yn = mode === 'fit' ? 2 : mode === 'gap' ? 0 : 1, f = {};
      GP_OPT.forEach(function (o, j) { if (j !== yn) f[j] = GP_FIX[mode]; });
      return { q: 'Edge to edge, ' + N + ' tiles cover this rectangle. Is this count right?', fig: g.svg, done: g.n + ' tiles: ' + GP_OPT[yn] + '.', steps: [
        { prompt: 'Count the tiles.', q: num('How many tiles?', g.n, {}, { unit: 'tiles', hint: 'Row by row.', meta: { k: 'g3la-gp-n', n: g.n } }) },
        { prompt: 'Compare with ' + N + '.', q: fixed('So the count is:', GP_OPT, yn, f, { hint: 'Fewer than ' + N + ': too low. More: too high.', meta: { k: 'g3la-gp-vs', n: g.n, N: N } }) }
      ] };
    };
  }

  /* ---------- Same area, different shape ---------- */
  function smCase(lv, same) {
    var r = R.int(2, lv === 1 ? 3 : 4), c = R.int(3, lv === 1 ? 4 : 5), k = R.int(1, Math.min(2, c - 1)), A0 = rectCells(r, c), B = [], hl = {};
    A0.forEach(function (p) { if (p[1] === 0 && p[0] >= c - k) return; B.push([p[0], p[1]]); });
    for (var i = 0; i < k; i++) { B.push([i, r]); hl[i + ',' + r] = 1; }
    if (lv === 3) { B = B.filter(function (p) { return !(p[1] === r && p[0] === 0); }).concat([[c, r - 1]]); hl = {}; hl[c + ',' + (r - 1)] = 1; for (var j = 1; j < k; j++) hl[j + ',' + r] = 1; }
    if (same === false) { var extra = R.pick([1, 2]); if (coin()) { for (var e = 0; e < extra; e++) B.push([k + e, r]); } else B = B.slice(0, B.length - extra); }
    return { A: A0, B: B, hl: hl, a: A0.length, b: B.length };
  }
  function smFig(s) { return '<div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:flex-end">' + cellsFig(s.A, { c: 30, title: 'A' }) + cellsFig(s.B, { c: 30, title: 'B', hl: s.hl }) + '</div>'; }
  var SM_OPT = ['Shape A', 'Shape B', 'They have the same area'];
  function smAns(s) { return s.a === s.b ? 2 : s.a > s.b ? 0 : 1; }
  skill('la-same', 'Same area, different shape', 'E2.7', [
    [1, 'plain', function (lv) {
      var s = smCase(lv, R.int(0, 2) === 0), ans = smAns(s), f = {};
      SM_OPT.forEach(function (o, j) { if (j !== ans) f[j] = 'Count the squares in each: A has ' + s.a + ', B has ' + s.b + '.'; });
      return fixed('Which shape has more area?', SM_OPT, ans, f, { fig: smFig(s), hint: 'Count the squares in each shape.', steps: ['A: ' + s.a + ' squares. B: ' + s.b + ' squares.'], explain: s.a === s.b ? 'Same area: the squares only moved.' : (ans ? 'B' : 'A') + ' has more squares.', meta: { k: 'g3la-sm-mc' } });
    }],
    [1, 'fill', function (lv) {
      var s = smCase(lv, coin());
      return fill('Count the squares. Fill in the blanks.', 'A has [[]] squares. B has [[]] squares.', [s.a, s.b], { fig: smFig(s), hint: 'Count row by row.', steps: ['A: ' + rowCounts(s.A).join(' + ') + ' = ' + s.a + '.', 'B: ' + rowCounts(s.B).join(' + ') + ' = ' + s.b + '.'], explain: s.a === s.b ? 'Same area.' : 'Different areas.', meta: { k: 'g3la-sm-fill' } });
    }],
    [2, 'moved', function (lv) {
      var s = smCase(lv, true), f = {}; f[s.a + rowCounts(s.B).length] = 'No squares were added. They only moved.';
      return num('Shape A has ' + s.a + ' squares. B is A with the pink squares moved. What is the area of B?', s.b, f, { unit: 'squares', fig: smFig(s), hint: 'Moving squares does not add or take away any.', steps: ['The pink squares moved from the top right.', 'Still ' + s.b + ' squares.'], explain: s.b + ' squares: the same area.', meta: { k: 'g3la-sm-num' } });
    }],
    [2, 'tf', function (lv) {
      var s = smCase(lv, coin()), who = Q.name(), truth = coin(), more = s.b > s.a ? 'B' : 'A', less = more === 'A' ? 'B' : 'A';
      var claim = s.a === s.b ? (truth ? 'A and B have the same area' : 'B has more area because it is taller') : truth ? more + ' has more area' : R.pick(['A and B have the same area', less + ' has more area']);
      return tf(who + ' says <b>' + claim + '</b>. True or false?', truth, 'A has ' + s.a + ' squares and B has ' + s.b + '.', ['A taller shape always has more area.', 'Moving a piece changes the area.', 'The shape with more corners has more area.'], 'Count the squares in each shape.',
        { fig: smFig(s), hint: 'Count, do not guess from the shape.', meta: { k: 'g3la-sm-tf', claim: claim } });
    }],
    [2, 'diff', function (lv) {
      var s = smCase(lv, false), d = Math.abs(s.a - s.b), more = s.a > s.b ? 'A' : 'B', f = {}; f[Math.max(s.a, s.b)] = 'That is the bigger area. Subtract the smaller one.';
      return num('B is A with a piece moved, then changed. How many more squares does shape <b>' + more + '</b> have?', d, f, { unit: 'squares', fig: smFig(s), hint: 'Count each shape, then subtract.', steps: ['A: ' + s.a + '. B: ' + s.b + '.', Math.max(s.a, s.b) + ' &minus; ' + Math.min(s.a, s.b) + ' = ' + d + '.'], explain: d + ' more squares.', meta: { k: 'g3la-sm-diff', more: more } });
    }],
    [3, 'tap', function () {
      var base = smCase(3, true), opts = [base.B], seen = {}; seen[base.b] = 1;
      while (opts.length < 3) { var t = smCase(3, false); if (seen[t.b] || t.a !== base.a) continue; seen[t.b] = 1; opts.push(t.B); }
      var order = R.shuffle([0, 1, 2]);
      return { q: 'Tap the shape with the <b>same area</b> as this one.', type: 'tap', fig: cellsFig(base.A, { c: 26, title: 'A' }), tiles: order.map(function (i) { return cellsFig(opts[i], { c: 22 }); }), answer: order.indexOf(0), answerText: 'the shape with ' + base.a + ' squares',
        hint: 'Count A first: ' + rowCounts(base.A).join(' + ') + '.', steps: ['A has ' + base.a + ' squares.', 'Find the one with ' + base.a + '.'], explain: 'Same area: ' + base.a + ' squares.', meta: { k: 'g3la-sm-tap' } };
    }]
  ]);
  function tgSame(lv) {
    return function () {
      var s = smCase(lv, lv !== 2), ans = smAns(s), f = {};
      SM_OPT.forEach(function (o, j) { if (j !== ans) f[j] = 'Compare ' + s.a + ' and ' + s.b + '.'; });
      return { q: 'Which shape has more area?', fig: smFig(s), done: s.a === s.b ? 'Same area: ' + s.a + ' squares each.' : SM_OPT[ans] + ' has more.', steps: [
        { prompt: 'Count shape A.', q: num('How many squares in A?', s.a, {}, { hint: 'Row by row.', meta: { k: 'g3la-sm-count', v: s.a } }) },
        { prompt: 'Count shape B.', q: num('How many squares in B?', s.b, {}, { hint: 'Count the pink ones too.', meta: { k: 'g3la-sm-count', v: s.b } }) },
        { prompt: 'Compare the counts.', q: fixed('So which has more area?', SM_OPT, ans, f, { hint: s.a + ' or ' + s.b + '?', meta: { k: 'g3la-sm-cmp', a: s.a, b: s.b } }) }
      ] };
    };
  }

  /* ---------- Square centimetres and square metres ---------- */
  var BIGA = ['a classroom floor', 'a playground', 'a hockey rink', 'a garden', 'a wall'], SMALLA = ['a stamp', 'a sticky note', 'a cracker', 'a phone screen', 'a postcard'];
  function sqCase(lv) { return lv === 1 ? { r: R.int(2, 4), c: R.int(2, 5) } : lv === 2 ? { r: R.int(3, 6), c: R.int(4, 7) } : { r: R.int(5, 8), c: R.int(6, 9) }; }
  skill('la-cm2', 'Square centimetres and metres', 'E2.9', [
    [1, 'plain', function (lv) {
      var s = sqCase(lv), f = {}; f[2 * (s.r + s.c)] = 'That is the perimeter. Area counts the squares inside.'; f[s.r + s.c] = 'That adds the sides. Count the squares.';
      return num('Each square is 1 cm&sup2;. What is the area of the rectangle?', s.r * s.c, f, { unit: 'cm²', fig: rect(s.c, s.r, { grid: true, area: true }), hint: s.r + ' rows of ' + s.c + '.', steps: [s.r + ' rows of ' + s.c + ' squares.', s.r + ' &times; ' + s.c + ' = ' + s.r * s.c + ' cm&sup2;.'], explain: s.r * s.c + ' cm&sup2;.', meta: { k: 'g3la-sq-num' } });
    }],
    [1, 'pick', function () {
      var big = coin(), good = R.shuffle(big ? BIGA : SMALLA).slice(0, 2), bad = R.shuffle(big ? SMALLA : BIGA).slice(0, 3), opts = R.shuffle(good.concat(bad)), ans = [];
      opts.forEach(function (o, j) { if (good.indexOf(o) >= 0) ans.push(j); });
      return { q: 'Pick <b>every</b> area you would measure in <b>' + (big ? 'square metres (m&sup2;)' : 'square centimetres (cm&sup2;)') + '</b>.', type: 'pick', options: opts.map(cap), answer: ans, hint: big ? 'm&sup2; is a square 1 m on each side: big things.' : 'cm&sup2; is about a fingernail: small things.',
        steps: [big ? 'Floors and yards are big: m&sup2;.' : 'Stamps and cards are small: cm&sup2;.'], explain: ans.map(function (j) { return cap(opts[j]); }).join(' and ') + '.', meta: { k: 'g3la-sq-pick', big: big } };
    }],
    [2, 'story', function (lv) {
      var who = Q.name(), s = sqCase(lv), th = R.pick(['gym floor', 'classroom floor', 'skating pad', 'stage']), f = {}; f[2 * (s.r + s.c)] = 'That is the way around. Count the mats.';
      return num('The ' + th + ' is covered with 1 m&sup2; mats: ' + s.r + ' rows of ' + s.c + '. What is its area?', s.r * s.c, f, { unit: 'm²', fig: lv === 3 ? '' : rect(s.c, s.r, { grid: true, area: true, unit: 'm' }), hint: s.r + ' rows of ' + s.c + ' mats.', steps: [s.r + ' &times; ' + s.c + ' = ' + s.r * s.c + '.'], explain: s.r * s.c + ' m&sup2;.', meta: { k: 'g3la-sq-story', r: s.r, c: s.c } });
    }],
    [2, 'fill', function (lv) {
      var s = sqCase(lv);
      return fill('Fill in the blanks.', '[[]] rows of [[]] squares = [[]] cm&sup2;', [s.r, s.c, s.r * s.c], { fig: rect(s.c, s.r, { grid: true, area: true }), hint: 'Count the rows, then one row.', steps: [s.r + ' rows, ' + s.c + ' in each.', s.r + ' &times; ' + s.c + ' = ' + s.r * s.c + '.'], explain: s.r * s.c + ' cm&sup2;.', meta: { k: 'g3la-sq-fill' } });
    }],
    [3, 'compare', function () {
      var a = sqCase(2), b; do { b = sqCase(2); } while (a.r * a.c === b.r * b.c);
      var big = a.r * a.c > b.r * b.c ? a : b, small = big === a ? b : a, d = big.r * big.c - small.r * small.c, f = {}; f[big.r * big.c] = 'That is the bigger area. Subtract the smaller one.';
      return num('Card A is ' + big.c + ' cm by ' + big.r + ' cm. Card B is ' + small.c + ' cm by ' + small.r + ' cm. How many more cm&sup2; does card A cover?', d, f, { unit: 'cm²', hint: 'Find each area, then subtract.', steps: ['A: ' + big.r + ' &times; ' + big.c + ' = ' + big.r * big.c + '.', 'B: ' + small.r + ' &times; ' + small.c + ' = ' + small.r * small.c + '.', big.r * big.c + ' &minus; ' + small.r * small.c + ' = ' + d + '.'], explain: d + ' cm&sup2; more.', meta: { k: 'g3la-sq-cmp', a: [big.c, big.r], b: [small.c, small.r] } });
    }],
    [2, 'tf', function (lv) {
      var s = sqCase(lv), who = Q.name(), truth = coin(), said = truth ? s.r * s.c : 2 * (s.r + s.c) === s.r * s.c ? s.r * s.c + s.c : 2 * (s.r + s.c);
      return tf(who + ' says the area is <b>' + said + ' cm&sup2;</b>. True or false?', truth, s.r + ' rows of ' + s.c + ' = ' + s.r * s.c + ' cm&sup2;.', ['Area is the distance around.', 'Add the length and the width.', 'Count only the edge squares.'], 'Count the squares inside: rows times squares in a row.',
        { fig: rect(s.c, s.r, { grid: true, area: true }), hint: 'Area counts the squares inside.', meta: { k: 'g3la-sq-tf', said: said } });
    }]
  ]);
  function tgSq(lv) {
    return function () {
      var s = sqCase(lv), f1 = {}, f2 = {}; f1[s.c] = 'That is the squares in a row. Count the rows going down.'; f2[s.r] = 'That is the rows. Count the squares across.';
      return { q: 'What is the area? Each square is 1 cm&sup2;.', fig: rect(s.c, s.r, { grid: true, area: true }), done: s.r + ' &times; ' + s.c + ' = ' + s.r * s.c + ' cm&sup2;.', steps: [
        { prompt: 'Count the rows going down.', q: num('How many rows?', s.r, f1, { hint: 'Count down the side.', meta: { k: 'g3la-sq-side', v: s.r } }) },
        { prompt: 'Count the squares in one row.', q: num('How many in each row?', s.c, f2, { hint: 'Count across the top.', meta: { k: 'g3la-sq-side', v: s.c } }) },
        { prompt: 'Rows times squares in a row.', q: num(s.r + ' rows of ' + s.c + ' = ?', s.r * s.c, {}, { unit: 'cm²', hint: 'Count by ' + s.c + 's.', meta: { k: 'g3la-sq-story', r: s.r, c: s.c } }) }
      ] };
    };
  }

  /* ---------- Estimate a curved area ---------- */
  skill('la-est', 'Estimate a curved area', 'E2.9', [
    [1, 'plain', function (lv) {
      var b = blobCase(lv), all = b.kind.filter(function (k) { return k; }).length, f = {}; f[b.full] = 'Count the more-than-half squares too.'; f[b.half] = 'Add the full squares too.';
      return num('Count full squares, and squares more than half covered. About what is the area?', b.full + b.half, f, { unit: 'cm²', fig: blobFig(b, lv === 1 ? 'both' : lv === 2 ? 'full' : 'none'), hint: 'Full squares, plus more-than-half squares. Leave out the small bits.',
        steps: ['Full: ' + b.full + '.', 'More than half: ' + b.half + '.', b.full + ' + ' + b.half + ' = ' + (b.full + b.half) + '.'], explain: 'About ' + (b.full + b.half) + ' cm&sup2;.', meta: { k: 'g3la-es-num', all: all } });
    }],
    [1, 'fill', function (lv) {
      var b = blobCase(lv);
      return fill('Estimate the area. Fill in the blanks.', 'Full: [[]]. More than half: [[]]. About [[]] cm&sup2;.', [b.full, b.half, b.full + b.half], { fig: blobFig(b, lv === 3 ? 'full' : 'both'), hint: 'Green: full. Yellow: more than half.', steps: ['Full: ' + b.full + '. More than half: ' + b.half + '.', b.full + ' + ' + b.half + ' = ' + (b.full + b.half) + '.'], explain: 'About ' + (b.full + b.half) + ' cm&sup2;.', meta: { k: 'g3la-es-fill' } });
    }],
    [2, 'mc', function (lv) {
      var b = blobCase(lv), touch = b.full + b.half + b.kind.length - b.kind.filter(function (k) { return k; }).length;
      var part = 0; for (var y = 0; y < b.H; y++) for (var x = 0; x < b.W; x++) { var dx = Math.max(Math.abs(x + 0.5 - b.cx) - 0.5, 0) / b.rx, dy = Math.max(Math.abs(y + 0.5 - b.cy) - 0.5, 0) / b.ry; if (!b.kind[y * b.W + x] && dx * dx + dy * dy < 1) part++; }
      return mc('About what is the area of the curved shape?', 'about ' + (b.full + b.half) + ' cm&sup2;', [['about ' + b.full + ' cm&sup2;', 'Add the more-than-half squares too.'], ['about ' + (b.full + b.half + part) + ' cm&sup2;', 'Leave out squares less than half covered.'], ['about ' + (b.full + b.half + 2) + ' cm&sup2;', 'Count again.']],
        { fig: blobFig(b, 'both'), hint: 'Full squares plus more-than-half squares.', steps: [b.full + ' + ' + b.half + ' = ' + (b.full + b.half) + '.'], explain: 'About ' + (b.full + b.half) + ' cm&sup2;.', meta: { k: 'g3la-es-mc', touch: touch } });
    }],
    [2, 'sum', function (lv) {
      var who = Q.name(), th = R.pick(['a hand', 'a maple leaf', 'a shoe', 'a lake on a map', 'a mitten']), a = lv === 3 ? R.int(30, 75) : R.int(8, 25), b = lv === 3 ? R.int(12, 28) : R.int(4, 12), t = R.int(3, 9), f = {};
      f[a] = 'Add the more-than-half squares too.'; f[a + b + t] = 'Leave out the squares less than half covered.';
      return num(who + ' traces ' + th + ' on centimetre grid paper: <b>' + a + '</b> full squares, <b>' + b + '</b> more than half covered and ' + t + ' less than half covered. About what is the area?', a + b, f, { unit: 'cm²', hint: 'Full plus more than half. Leave out the small bits.', steps: [a + ' + ' + b + ' = ' + (a + b) + '.', 'Leave out the ' + t + ' small bits.'], explain: 'About ' + (a + b) + ' cm&sup2;.', meta: { k: 'g3la-es-sum' } });
    }],
    [2, 'tf', function (lv) {
      var b = blobCase(lv), who = Q.name(), est = b.full + b.half, truth = coin(), said = truth ? est : b.full;
      return tf(who + ' says the area is about <b>' + said + ' cm&sup2;</b>. True or false?', truth, b.full + ' full and ' + b.half + ' more-than-half squares: about ' + est + ' cm&sup2;.', ['Count only the full squares.', 'Count every square the shape touches.', 'Curved shapes have no area.'], 'Full squares, plus more-than-half squares.',
        { fig: blobFig(b, 'both'), hint: 'Did ' + who + ' count the yellow squares?', meta: { k: 'g3la-es-tf', said: said } });
    }]
  ]);
  function tgEst(lv) {
    return function () {
      var b = blobCase(lv), f3 = {}; f3[b.full] = 'Add the more-than-half squares.';
      return { q: 'About what is the area of the curved shape?', fig: blobFig(b, lv === 3 ? 'full' : 'both'), done: 'About ' + (b.full + b.half) + ' cm&sup2;.', steps: [
        { prompt: 'Count the full squares (green).', q: num('How many full squares?', b.full, {}, { hint: 'Squares all inside the line.', meta: { k: 'g3la-es-part', v: b.full } }) },
        { prompt: 'Count squares more than half inside.', q: num('How many are more than half covered?', b.half, {}, { hint: lv === 3 ? 'Look along the edge.' : 'The yellow ones.', meta: { k: 'g3la-es-part', v: b.half } }) },
        { prompt: 'Add them. Leave out the small bits.', q: num(b.full + ' + ' + b.half + ' = ?', b.full + b.half, f3, { unit: 'cm²', hint: 'Add the two counts.', meta: { k: 'g3la-mm-add', a: b.full, b: b.half } }) }
      ] };
    };
  }

  /* ======================= Lesson 5: Perimeter or area? ======================= */
  var MX_P = [['a fence around a garden', 'perimeter'], ['a ribbon around a gift card', 'perimeter'], ['the trim around a door', 'perimeter'], ['beads along the edge of a sash', 'perimeter'], ['carpet for a floor', 'area'], ['paint for a wall', 'area'], ['grass seed for a yard', 'area'], ['tiles for a kitchen floor', 'area']];
  function mxCase(lv) { return lv === 1 ? { l: R.int(3, 6), w: R.int(2, 4) } : { l: R.int(4, 8), w: R.int(3, 6) }; }
  function mxFix(c, ask) { var f = {}; f[c.l + c.w] = ask === 'area' ? 'That adds two sides. Count the squares inside.' : 'Only two sides. Go all the way around.'; if (ask === 'area') f[2 * (c.l + c.w)] = 'That is the perimeter: the way around. Area counts the squares inside.'; else f[c.l * c.w] = 'That is the area: the squares inside. Perimeter goes around.'; return f; }
  skill('la-mix', 'Perimeter or area?', 'E2.1, E2.9', [
    [1, 'plain', function (lv) {
      var c = mxCase(lv), ask = coin() ? 'perimeter' : 'area', ans = ask === 'area' ? c.l * c.w : 2 * (c.l + c.w);
      return num('Find the <b>' + ask + '</b> of this rectangle.', ans, mxFix(c, ask), { unit: ask === 'area' ? 'cm²' : 'cm', fig: rect(c.l, c.w, { grid: true, area: ask === 'area' }), hint: ask === 'area' ? 'Area: count the squares inside.' : 'Perimeter: add all four sides.',
        steps: [ask === 'area' ? c.w + ' rows of ' + c.l + ' = ' + ans + ' cm&sup2;.' : c.l + ' + ' + c.w + ' + ' + c.l + ' + ' + c.w + ' = ' + ans + ' cm.'], explain: cap(ask) + ': ' + ans + (ask === 'area' ? ' cm&sup2;.' : ' cm.'), meta: { k: 'g3la-mx-num', l: c.l, w: c.w, ask: ask } });
    }],
    [1, 'which', function () {
      var t = R.pick(MX_P), ans = t[1] === 'perimeter' ? 0 : 1;
      return fixed('To buy <b>' + t[0] + '</b>, do you need the perimeter or the area?', ['the perimeter', 'the area'], ans, ans ? ['It covers the space inside, so it is area.'] : [null, 'It goes around the edge, so it is perimeter.'], { hint: 'Around the edge, or covering the inside?', steps: [t[1] === 'perimeter' ? 'It goes around the edge: perimeter.' : 'It covers the inside: area.'], explain: cap(t[1]) + '.', meta: { k: 'g3la-mx-which', t: t[0] } });
    }],
    [2, 'story', function (lv) {
      var c = mxCase(lv), who = Q.name(), t = R.pick(MX_P.filter(function (x) { return /fence|carpet|tiles|grass/.test(x[0]); })), ask = t[1], ans = ask === 'area' ? c.l * c.w : 2 * (c.l + c.w);
      var q = ask === 'area' ? who + ' needs ' + t[0].replace('for a ', 'for a ') + '. It is ' + c.l + ' m by ' + c.w + ' m. How many square metres?' : who + ' needs ' + t[0] + '. The garden is ' + c.l + ' m by ' + c.w + ' m. How many metres of fence?';
      return num(q, ans, mxFix(c, ask), { unit: ask === 'area' ? 'm²' : 'm', fig: rect(c.l, c.w, { unit: 'm', grid: lv < 3, area: ask === 'area' }), hint: ask === 'area' ? 'It covers the inside: area.' : 'It goes around: perimeter.',
        steps: [ask === 'area' ? c.w + ' rows of ' + c.l + ' = ' + ans + '.' : c.l + ' + ' + c.w + ' + ' + c.l + ' + ' + c.w + ' = ' + ans + '.'], explain: ans + (ask === 'area' ? ' m&sup2;.' : ' m.'), meta: { k: 'g3la-mx-num', l: c.l, w: c.w, ask: ask } });
    }],
    [2, 'fill', function (lv) {
      var c = mxCase(lv);
      return fill('Find both. Fill in the blanks.', 'Perimeter: [[]] cm. Area: [[]] cm&sup2;.', [2 * (c.l + c.w), c.l * c.w], { fig: rect(c.l, c.w, { grid: true }), hint: 'Perimeter: around. Area: inside.', steps: ['Around: ' + c.l + ' + ' + c.w + ' + ' + c.l + ' + ' + c.w + ' = ' + 2 * (c.l + c.w) + '.', 'Inside: ' + c.w + ' rows of ' + c.l + ' = ' + c.l * c.w + '.'], explain: 'Perimeter ' + 2 * (c.l + c.w) + ' cm, area ' + c.l * c.w + ' cm&sup2;.', meta: { k: 'g3la-mx-fill', l: c.l, w: c.w } });
    }],
    [3, 'tf', function () {
      var pairs = [[[3, 4], [2, 6]], [[2, 8], [4, 4]], [[1, 12], [3, 4]], [[3, 6], [2, 9]], [[4, 5], [2, 10]], [[2, 6], [3, 5]], [[1, 7], [3, 5]], [[2, 7], [4, 5]]], p = R.pick(pairs), who = Q.name(), a = p[0], b = p[1];
      var sameA = a[0] * a[1] === b[0] * b[1], sameP = a[0] + a[1] === b[0] + b[1], about = coin() ? 'area' : 'perimeter', truth = about === 'area' ? sameA : sameP;
      return tf('Rectangle A is ' + a[0] + ' cm by ' + a[1] + ' cm. Rectangle B is ' + b[0] + ' cm by ' + b[1] + ' cm. ' + who + ' says they have the <b>same ' + about + '</b>. True or false?', truth, 'Areas: ' + a[0] * a[1] + ' and ' + b[0] * b[1] + ' cm&sup2;. Perimeters: ' + 2 * (a[0] + a[1]) + ' and ' + 2 * (b[0] + b[1]) + ' cm.',
        ['Same area always means same perimeter.', 'Same perimeter always means same area.', 'Longer rectangles have more area.'], 'Work out the ' + about + ' of each one.', { hint: 'Work out both, then compare.', meta: { k: 'g3la-mx-tf', a: a, b: b, about: about } });
    }]
  ]);
  function tgMix(ask) {
    return function () {
      var c = mxCase(2), a = ask === 'any' ? (coin() ? 'perimeter' : 'area') : ask, ans = a === 'area' ? c.l * c.w : 2 * (c.l + c.w), g = {};
      g[a === 'area' ? 0 : 1] = a === 'area' ? 'Area is the inside.' : 'Perimeter is the way around.';
      return { q: 'Find the ' + a + ' of the rectangle.', fig: rect(c.l, c.w, { grid: true, area: a === 'area' }), done: cap(a) + ': ' + ans + (a === 'area' ? ' cm&sup2;.' : ' cm.'), steps: [
        { prompt: 'Around the edge, or the squares inside?', q: fixed('What do you measure?', ['the way around the edge', 'the squares inside'], a === 'area' ? 1 : 0, g, { hint: 'Perimeter: around. Area: inside.', meta: { k: 'g3la-mx-what', ask: a } }) },
        { prompt: a === 'area' ? 'Rows times squares in a row.' : 'Add all four sides.', q: num(a === 'area' ? c.w + ' rows of ' + c.l + ' = ?' : c.l + ' + ' + c.w + ' + ' + c.l + ' + ' + c.w + ' = ?', ans, mxFix(c, a), { unit: a === 'area' ? 'cm²' : 'cm', hint: a === 'area' ? 'Count by ' + c.l + 's.' : 'Add them one at a time.', meta: { k: 'g3la-mx-num', l: c.l, w: c.w, ask: a } }) }
      ] };
    };
  }

  /* ======================= Watch and My turn pictures ======================= */
  var benchV = function (s) { return benchFig(s.hi) + (s.k ? '<div class="fig">' + pic(s.k, s.k) + '</div>' : ''); };
  var rulerV = function (s) { return ruler({ max: s.max || 10, a: s.a, b: s.b, obj: s.obj || 'pencil' }); };
  var barsV = function (s) { return bars(s.n, s.x || 0, s.u || 'm'); };
  var cmpV = function (s) { return cmpFig(s.rows); };
  var ribbonV = function (s) { return ribbon(s.len, s.u, s.k); };
  var ribbon2V = function (s) { return ribbon2(s.len, s.u1, s.u2); };
  var polyV = function (s) { return poly(s.sides, s.u); };
  var rectV = function (s) { return rect(s.l, s.w, s.o || {}); };
  var curveV = function (s) { return curveFig(s.kind, s.n, s.st); };
  var cellsV = function (s) { return cellsFig(s.cells, { c: 40, n: s.n }); };
  var gapV = function (s) { return gapFig(s.m, s.w || 4, s.h || 3).svg; };
  var sameV = function (s) { return smFig(s); };
  var blobV = function (s) { return blobFig(s.b, s.mode); };
  function counting(from, to, mk) { var p = []; for (var i = from; i <= to; i++) p.push(mk(i)); return p; }
  var BLOB1 = { rx: 2, ry: 2, cx: 3, cy: 3, W: 6, H: 6 }, BLOB2 = { rx: 2.5, ry: 2, cx: 3.5, cy: 3, W: 7, H: 6 };
  function blobKinds(b) { var k = [], full = 0, half = 0; for (var y = 0; y < b.H; y++) for (var x = 0; x < b.W; x++) { var n = 0; for (var i = 0; i < 20; i++) for (var j = 0; j < 20; j++) { var px = (x + (i + 0.5) / 20 - b.cx) / b.rx, py = (y + (j + 0.5) / 20 - b.cy) / b.ry; if (px * px + py * py <= 1) n++; } k.push(n === 400 ? 'full' : n > 200 ? 'half' : ''); if (n === 400) full++; else if (n > 200) half++; } b.kind = k; b.full = full; b.half = half; return b; }
  blobKinds(BLOB1); blobKinds(BLOB2);
  var SAME1 = { A: rectCells(3, 4), B: rectCells(3, 4).filter(function (p) { return !(p[1] === 0 && p[0] >= 2); }).concat([[0, 3], [1, 3]]), hl: { '0,3': 1, '1,3': 1 } };
  var SAME2 = { A: rectCells(2, 5), B: rectCells(2, 5).filter(function (p) { return !(p[1] === 0 && p[0] >= 3); }).concat([[0, 2], [1, 2], [2, 2]]), hl: { '0,2': 1, '1,2': 1, '2,2': 1 } };
  var LSHAPE = rowsCells([[0, 4], [0, 4], [0, 2]]), TSHAPE = rowsCells([[0, 2], [0, 2], [0, 5]]);

  /* ======================= The lessons ======================= */
  var LESSONS = [
    { id: 'units', title: 'Units of length', sub: 'Millimetres, centimetres, metres and kilometres.', concepts: [
      { id: 'bench', title: 'Benchmarks for length', exp: ['E2.2'], skill: 'la-bench',
        watch: clip(benchV, { hi: -1 }, [
          ['Four units, from small to big.'],
          ['1 mm: as thin as a dime.', { hi: 0 }],
          ['1 cm: about a fingernail wide.', { hi: 1 }],
          ['1 m: one big step. 1 km: a 15-minute walk.', { hi: [2, 3] }]
        ]),
        example: clip(benchV, { hi: -1, k: 'canoe' }, [
          ['My turn. A canoe.'],
          ['In fingernails? Far too many. A few big steps: metres.', { hi: 2 }],
          ['A trail takes a long walk: kilometres.', { k: 'trail', hi: 3 }],
          ['An ant is smaller than a fingernail: millimetres.', { k: 'ant', hi: 0 }]
        ]),
        together: [tgBench(1), tgBench(2), tgBench(3)],
        mistake: '<p>Choosing a unit by habit (everything in cm), or picking a big unit for a small thing. Ask: "Is it smaller than your fingernail, about a step, or a long walk?" Keep the four benchmarks on the fridge.</p>',
        check: [ck('la-bench', 'plain', 1), ck('la-bench', 'steps', 1), ck('la-bench', 'match', 2), ck('la-bench', 'tf', 2), ck('la-bench', 'plain', 3)] },

      { id: 'ruler', title: 'Read a ruler', exp: ['E2.2'], skill: 'la-ruler',
        watch: clip(rulerV, { a: 0, b: 0 }, [
          ['Put one end at 0.'],
          ['It ends at 7: 7 cm long.', counting(1, 7, function (i) { return { b: i * 10 }; })],
          ['Slide it. Now it starts at 2 and ends at 9.', { a: 20, b: 90 }],
          ['9 &minus; 2 = 7. The same 7 cm.', null, 2200]
        ]),
        example: clip(rulerV, { a: 0, b: 50, obj: 'crayon' }, [
          ['My turn. 0 to 5: the crayon is 5 cm.'],
          ['I slide it to start at 3.', { a: 30, b: 80 }],
          ['It ends at 8. Is it 8 cm? No: 8 &minus; 3 = 5 cm.', null, 2400]
        ]),
        try: { mount: G3.play({ state: { b: 40 }, draw: function (s) { return ruler({ max: 10, a: 0, b: s.b, obj: 'pencil' }); },
          sliders: [{ key: 'b', label: 'Pencil', min: 10, max: 100, step: 10, fmt: function (v) { return v / 10 + ' cm'; } }],
          tasks: [{ do: 'Make the pencil <b>6 cm</b> long.', goal: function (s) { return s.b === 60; }, yes: 'From 0 to 6: 6 cm.' }, { do: 'Make it <b>9 cm</b> long.', goal: function (s) { return s.b === 90; }, yes: 'From 0 to 9: 9 cm.' }] }), do: '' },
        together: [tgRuler(1), tgRuler(2), tgRuler(3)],
        mistake: '<p>Reading the number at the far end when the object does not start at 0, or starting at 1 or at the edge of the ruler. Ask: "Where does it start? Where does it end?" Then subtract.</p>',
        check: [ck('la-ruler', 'plain', 1), ck('la-ruler', 'fill', 1), ck('la-ruler', 'mc', 2), ck('la-ruler', 'story', 2), ck('la-ruler', 'plain', 3)] },

      { id: 'mm', title: '10 mm make 1 cm', exp: ['E2.2'], skill: 'la-mm',
        watch: clip(rulerV, { a: 0, b: 0 }, [
          ['Between 0 and 1 there are 10 tiny spaces.', counting(1, 10, function (i) { return { b: i }; })],
          ['4 cm: 4 tens, 40 mm.', { b: 40 }],
          ['3 more tiny marks: 43 mm.', { b: 43, sym: '4 cm 3 mm = 43 mm' }]
        ]),
        example: clip(rulerV, { a: 0, b: 68, obj: 'crayon' }, [
          ['My turn. It ends past 6.'],
          ['6 cm is 60 mm.', { sym: '6 cm = 60 mm' }],
          ['8 more mm. Is it 14? No: 60 + 8 = 68 mm.', { sym: '60 + 8 = 68 mm' }, 2400]
        ]),
        together: [tgMM(1), tgMM(2), tgMM(3)],
        mistake: '<p>Adding the cm and mm numbers (6 cm 8 mm = 14 mm), or using 100 mm in a centimetre. Point to one centimetre on the ruler and count its 10 tiny spaces together.</p>',
        check: [ck('la-mm', 'plain', 1), ck('la-mm', 'bare', 1), ck('la-mm', 'fill', 2), ck('la-mm', 'tf', 2), ck('la-mm', 'plain', 3)] },

      { id: 'metre', title: 'Metres and kilometres', exp: ['E2.2'], skill: 'la-m',
        watch: clip(barsV, { n: 1 }, [
          ['One metre stick is 100 cm.', null, 1700],
          ['3 sticks: 100, 200, 300 cm.', [{ n: 2 }, { n: 3, sym: '3 m = 300 cm' }]],
          ['1000 m make 1 km: about a 15-minute walk.', { n: 2, u: 'km', sym: '2 km = 2000 m' }, 2400]
        ]),
        example: clip(barsV, { n: 2, x: 40 }, [
          ['My turn. 2 m 40 cm in cm.'],
          ['2 sticks: 200 cm.', { sym: '2 m = 200 cm' }],
          ['Add the 40. Is it 42? No: 200 + 40 = 240 cm.', { sym: '2 m 40 cm = 240 cm' }, 2400]
        ]),
        together: [tgM(1), tgM(2), tgM(3)],
        mistake: '<p>Using 10 for every change (1 m = 10 cm, 1 km = 100 m). Say the three facts in one order, smallest first: 10 mm make 1 cm, 100 cm make 1 m, 1000 m make 1 km.</p>',
        check: [ck('la-m', 'plain', 1), ck('la-m', 'fill', 1), ck('la-m', 'story', 2), ck('la-m', 'tf', 2), ck('la-m', 'plain', 3)] },

      { id: 'compare', title: 'Same unit, then compare', exp: ['E2.2'], skill: 'la-cmp',
        watch: clip(cmpV, { rows: [['2 m', 200], ['150 cm', 150]] }, [
          ['2 m or 150 cm? 150 looks bigger.'],
          ['Change 2 m to cm: 200 cm.', { sym: '2 m = 200 cm' }],
          ['200 cm is longer, by 50 cm.', { sym: '200 &minus; 150 = 50 cm' }]
        ]),
        example: clip(cmpV, { rows: [['5 cm', 50], ['45 mm', 45]] }, [
          ['My turn. 5 cm or 45 mm?'],
          ['5 cm is 50 mm.', { sym: '5 cm = 50 mm' }],
          ['45 is more than 5, but 50 mm is longer. 5 cm wins.', { sym: '50 mm &gt; 45 mm' }, 2400]
        ]),
        together: [tgCmp(1), tgCmp(2), tgCmp(3)],
        mistake: '<p>Comparing the numbers and ignoring the units (150 cm "beats" 2 m). Ask: "Are the units the same?" Change the bigger unit to the smaller one first.</p>',
        check: [ck('la-cmp', 'plain', 1), ck('la-cmp', 'fill', 1), ck('la-cmp', 'diff', 2), ck('la-cmp', 'tf', 2), ck('la-cmp', 'story', 3)] }
    ] },

    { id: 'same', title: 'Different units, same length', sub: 'The count changes. The length does not.', concepts: [
      { id: 'count', title: 'Lay units end to end, then count', exp: ['E2.5'], skill: 'la-count',
        watch: clip(ribbonV, { len: 24, u: 4, k: 0 }, [
          ['A 24 cm ribbon. Sticks of 4 cm.'],
          ['Lay them end to end, no gaps.', counting(1, 6, function (i) { return { k: i }; })],
          ['6 sticks. Check: 6 &times; 4 = 24 cm.', { sym: '6 &times; 4 = 24' }]
        ]),
        example: clip(ribbonV, { len: 30, u: 5, k: 1 }, [
          ['My turn. 30 cm, blocks of 5 cm.'],
          ['I count by 5s: 5, 10, 15, 20, 25, 30.', counting(2, 6, function (i) { return { k: i }; })],
          ['Is it 30 blocks? No: 30 is the cm. 6 blocks.', { sym: '30 &divide; 5 = 6' }, 2400]
        ]),
        together: [tgCount(1), tgCount(2), tgCount(3)],
        mistake: '<p>Giving the length in cm as the count (saying 24 sticks), or leaving gaps between units. Ask: "How long is one stick? Count by that number."</p>',
        check: [ck('la-count', 'plain', 1), ck('la-count', 'mc', 1), ck('la-count', 'reverse', 2), ck('la-count', 'story', 2), ck('la-count', 'plain', 3)] },

      { id: 'size', title: 'Bigger unit, smaller count', exp: ['E2.5'], skill: 'la-size',
        watch: clip(ribbon2V, { len: 24, u1: 2, u2: 6 }, [
          ['One ribbon, two kinds of unit.'],
          ['2 cm erasers: 12 of them.', { sym: 'erasers: 12' }],
          ['6 cm crayons: only 4. The ribbon did not change.', { sym: 'crayons: 4' }]
        ]),
        example: clip(ribbon2V, { len: 24, u1: 3, u2: 12 }, [
          ['My turn. 8 paper clips of 3 cm.'],
          ['That is 8 &times; 3 = 24 cm.', { sym: '24 cm' }],
          ['Pencils of 12 cm: 24 &divide; 12 = 2. More clips, but the same ribbon.', { sym: 'pencils: 2' }, 2600]
        ]),
        together: [tgSize(1), tgSize(2), tgSize(3)],
        mistake: '<p>Thinking a bigger count means a longer object ("12 erasers is longer than 4 crayons"). Lay both sets of units under the same ribbon and compare.</p>',
        check: [ck('la-size', 'plain', 1), ck('la-size', 'tf', 1), ck('la-size', 'convert', 2), ck('la-size', 'fill', 2), ck('la-size', 'story', 3)] }
    ] },

    { id: 'perim', title: 'Perimeter', sub: 'The distance all the way around.', concepts: [
      { id: 'around', title: 'Perimeter: add every side', exp: ['E2.1'], skill: 'la-perim',
        watch: clip(polyV, { sides: [4, 5, 6] }, [
          ['Start at a corner: 4 cm.', { sym: '4' }],
          ['Walk on: + 5.', { sym: '4 + 5 = 9' }],
          ['+ 6, back to the start: 15 cm.', { sym: '9 + 6 = 15 cm' }]
        ]),
        example: clip(polyV, { sides: [3, 5, 4, 6, 2] }, [
          ['My turn. Five sides.'],
          ['3 + 5 = 8, + 4 = 12.', { sym: '3 + 5 + 4 = 12' }],
          ['+ 6 = 18, + 2 = 20. Did I miss one? No: 5 sides, 5 numbers.', { sym: '20 cm' }, 2600]
        ]),
        together: [tgPerim(1), tgPerim(2), tgPerim(3)],
        mistake: '<p>Missing a side or adding one twice. Put a finger on one corner, tick each side as you add it, and stop when you are back at the start.</p>',
        check: [ck('la-perim', 'plain', 1), ck('la-perim', 'fill', 1), ck('la-perim', 'mc', 2), ck('la-perim', 'story', 2), ck('la-perim', 'plain', 3)] },

      { id: 'rect', title: 'Perimeter of a rectangle', exp: ['E2.1'], skill: 'la-rect',
        watch: clip(rectV, { l: 5, w: 3 }, [
          ['Only two sides are labelled.'],
          ['The sides across match: 5 and 5, 3 and 3.', { o: { labels: 'all' } }],
          ['5 + 3 + 5 + 3 = 16 cm.', { sym: '16 cm' }]
        ]),
        example: clip(rectV, { l: 7, w: 2 }, [
          ['My turn. 7 cm by 2 cm.'],
          ['Is it 7 + 2 = 9? No: that is two sides.', { o: { labels: 'all' } }],
          ['7 + 2 + 7 + 2 = 18 cm.', { sym: '18 cm' }]
        ]),
        together: [tgRect(1), tgRect(2), tgRect(3)],
        mistake: '<p>Adding only the two labelled sides (5 + 3 = 8), or multiplying them. Ask: "How many sides does a rectangle have?" Write all four numbers before adding.</p>',
        check: [ck('la-rect', 'plain', 1), ck('la-rect', 'square', 1), ck('la-rect', 'fill', 2), ck('la-rect', 'tf', 2), ck('la-rect', 'plain', 3)] },

      { id: 'curve', title: 'Curved sides: use a string', exp: ['E2.1'], skill: 'la-curve',
        watch: clip(curveV, { kind: 'circle', n: 26 }, [
          ['A plate has no straight sides.'],
          ['A string bends once around it.'],
          ['Lay the string straight on a ruler: 26 cm.', { sym: '26 cm' }]
        ]),
        example: clip(curveV, { kind: 'arch', n: 34, st: 15 }, [
          ['My turn. An arch window.'],
          ['The string covers the curve: 34 cm.', { sym: '34 cm' }],
          ['Is that all? No: add the straight side. 34 + 15 = 49 cm.', { sym: '49 cm' }, 2600]
        ]),
        together: [tgCurve(1), tgCurve(2), tgCurve(3)],
        mistake: '<p>Measuring straight across a curved shape, or forgetting the straight side of a shape that is part curved. Wrap a real string around a plate, then lay it on a ruler.</p>',
        check: [ck('la-curve', 'plain', 1), ck('la-curve', 'mc', 1), ck('la-curve', 'fill', 2), ck('la-curve', 'compare', 2), ck('la-curve', 'arch', 3)] },

      { id: 'build', title: 'Make a given perimeter', exp: ['E2.1'], skill: 'la-build',
        watch: clip(rectV, { l: 4, w: 2 }, [
          ['Target: 12 cm all the way around.'],
          ['4 by 2: 4 + 2 + 4 + 2 = 12.', { o: { labels: 'all' }, sym: '12 cm' }],
          ['5 by 1 makes 12 too.', { l: 5, w: 1, o: { labels: 'all' }, sym: '5 + 1 + 5 + 1 = 12' }],
          ['So does a 3 by 3 square.', { l: 3, w: 3, sym: '3 + 3 + 3 + 3 = 12' }]
        ]),
        example: clip(polyV, { sides: [4, 6, '?'] }, [
          ['My turn. A triangle with a perimeter of 15 cm.'],
          ['The two sides I have: 4 + 6 = 10.', { sym: '4 + 6 = 10' }],
          ['15 &minus; 10 = 5. The last side is 5 cm.', { sides: [4, 6, 5], sym: '4 + 6 + 5 = 15' }]
        ]),
        try: { mount: G3.play({ state: { l: 5, w: 3, found: {} }, draw: function (s) { return rect(s.l, s.w, { labels: 'all' }); },
          sliders: [{ key: 'l', label: 'Length', min: 1, max: 9, fmt: function (v) { return v + ' cm'; } }, { key: 'w', label: 'Width', min: 1, max: 9, fmt: function (v) { return v + ' cm'; } }],
          info: function (s) { var p = 2 * (s.l + s.w); if (p === 16) s.found[Math.min(s.l, s.w) + ' by ' + Math.max(s.l, s.w)] = 1; return 'Perimeter: <b>' + p + ' cm</b>. With 16 cm: ' + (Object.keys(s.found).join(', ') || 'none yet'); },
          tasks: [{ do: 'Find <b>3 different rectangles</b> with a perimeter of 16 cm.', goal: function (s) { return Object.keys(s.found).length >= 3; }, yes: 'Length + width is always 8.' }] }), do: '' },
        together: [tgBuild(1), tgBuild(2), tgBuild(3)],
        mistake: '<p>Stopping at the sum of the sides that are known, or using the perimeter as a side. Ask: "What must all the sides add up to? What do we have so far?"</p>',
        check: [ck('la-build', 'plain', 1), ck('la-build', 'fill', 1), ck('la-build', 'square', 2), ck('la-build', 'pick', 2), ck('la-build', 'plain', 3)] }
    ] },

    { id: 'area', title: 'Area', sub: 'The space a flat shape covers.', concepts: [
      { id: 'cover', title: 'Area: count the squares', exp: ['E2.8'], skill: 'la-area',
        watch: clip(cellsV, { cells: LSHAPE, n: 0 }, [
          ['Cover it with square tiles.', counting(1, 10, function (i) { return { n: i }; })],
          ['Row by row: 4 + 4 + 2 = 10 square units.', { sym: '10 square units' }]
        ]),
        example: clip(cellsV, { cells: TSHAPE, n: 0 }, [
          ['My turn. No gaps, no overlaps.', counting(1, 9, function (i) { return { n: i }; })],
          ['2 + 2 + 5 = 9. Is it 3 rows, so 3? No: 9 squares.', { sym: '9 square units' }, 2400]
        ]),
        try: { mount: G3.play({ state: { n: 0 }, draw: function (s) { return cellsFig(LSHAPE, { c: 44, n: s.n }); },
          buttons: [{ label: 'Add a tile', act: function (s) { if (s.n < 10) s.n++; } }, { label: 'Clear', act: function (s) { s.n = 0; } }],
          info: function (s) { return s.n < 10 ? s.n + ' tiles so far.' : '<b>Covered: 10 square units</b>'; },
          tasks: [{ do: 'Cover the shape. How many tiles?', goal: function (s) { return s.n === 10; }, yes: '10 tiles: the area is 10 square units.' }] }), do: '' },
        together: [tgArea(1), tgArea(2), tgArea(3)],
        mistake: '<p>Counting the squares along the edge only, or counting rows instead of squares. Colour each square as it is counted, row by row.</p>',
        check: [ck('la-area', 'plain', 1), ck('la-area', 'fill', 1), ck('la-area', 'tap', 2), ck('la-area', 'story', 2), ck('la-area', 'plain', 3)] },

      { id: 'gaps', title: 'No gaps, no overlaps', exp: ['E2.8'], skill: 'la-gaps',
        watch: clip(gapV, { m: 'fit' }, [
          ['12 tiles fit edge to edge.', { sym: '12: the true area' }],
          ['With gaps, only 6 fit: too low.', { m: 'gap', sym: '6: too low' }],
          ['Overlapping, 20 tiles: too high.', { m: 'over', sym: '20: too high' }]
        ]),
        example: clip(gapV, { m: 'fit', w: 3, h: 2 }, [
          ['My turn. 6 tiles fit.', { sym: '6' }],
          ['With gaps I count 2. More area? No: parts are missed.', { m: 'gap', sym: '2: too low' }, 2400],
          ['Overlapping I count 12: some parts twice.', { m: 'over', sym: '12: too high' }]
        ]),
        together: [tgGaps('gap'), tgGaps('over'), tgGaps('fit')],
        mistake: '<p>Thinking any tiling gives the area. Gaps make the count too low, overlaps too high. Cover a book with sticky notes both ways and compare the counts.</p>',
        check: [ck('la-gaps', 'plain', 1), ck('la-gaps', 'tap', 1), ck('la-gaps', 'fit', 2), ck('la-gaps', 'short', 2), ck('la-gaps', 'story', 3)] },

      { id: 'same', title: 'Same area, different shape', exp: ['E2.7'], skill: 'la-same',
        watch: clip(sameV, SAME1, [
          ['A: 12 squares.'],
          ['Cut off 2 squares and move them to the bottom.'],
          ['B looks different, but it is still 12: the same area.', { sym: 'A = B = 12 squares' }, 2400]
        ]),
        example: clip(sameV, SAME2, [
          ['My turn. A has 10 squares.'],
          ['B is taller. More area? I count: 7 + 3 = 10.', { sym: '10 squares' }, 2400],
          ['Nothing was added or taken. Same area.']
        ]),
        together: [tgSame(1), tgSame(2), tgSame(3)],
        mistake: '<p>Judging area by how long or tall a shape looks. Cut a paper rectangle into two pieces, move one, and count the squares before and after.</p>',
        check: [ck('la-same', 'plain', 1), ck('la-same', 'fill', 1), ck('la-same', 'moved', 2), ck('la-same', 'tf', 2), ck('la-same', 'tap', 3)] },

      { id: 'cm2', title: 'Square centimetres and square metres', exp: ['E2.9'], skill: 'la-cm2',
        watch: clip(rectV, { l: 1, w: 1, o: { grid: true, area: true } }, [
          ['A square, 1 cm on each side: 1 cm&sup2;. About a fingernail.'],
          ['4 cm by 3 cm: 3 rows of 4 = 12 cm&sup2;.', { l: 4, w: 3, sym: '12 cm&sup2;' }],
          ['A floor 4 m by 3 m: 12 m&sup2;. Square metres are for big areas.', { o: { grid: true, area: true, unit: 'm' }, sym: '12 m&sup2;' }, 2400]
        ]),
        example: clip(rectV, { l: 6, w: 2, o: { grid: true, area: true } }, [
          ['My turn. 6 cm by 2 cm.'],
          ['Is it 6 + 2 = 8? No: count the squares.', { sym: '2 rows of 6' }],
          ['6 + 6 = 12 cm&sup2;.', { sym: '12 cm&sup2;' }]
        ]),
        together: [tgSq(1), tgSq(2), tgSq(3)],
        mistake: '<p>Writing cm instead of cm&sup2;, or using square centimetres for a floor. Mark out 1 m&sup2; with tape on the floor and see how many children fit on it.</p>',
        check: [ck('la-cm2', 'plain', 1), ck('la-cm2', 'pick', 1), ck('la-cm2', 'fill', 2), ck('la-cm2', 'story', 2), ck('la-cm2', 'compare', 3)] },

      { id: 'curved', title: 'Estimate a curved area', exp: ['E2.9'], skill: 'la-est',
        watch: clip(blobV, { b: BLOB1, mode: 'none' }, [
          ['A curved shape on a centimetre grid.'],
          ['Full squares: 4.', { mode: 'full', sym: 'full: 4' }],
          ['More than half: 8. Leave out the small bits.', { mode: 'both', sym: 'more than half: 8' }],
          ['4 + 8 = about 12 cm&sup2;.', { sym: 'about 12 cm&sup2;' }]
        ]),
        example: clip(blobV, { b: BLOB2, mode: 'none' }, [
          ['My turn. A wider shape.'],
          ['Full squares: ' + BLOB2.full + '.', { mode: 'full', sym: 'full: ' + BLOB2.full }],
          ['More than half: ' + BLOB2.half + '. Count every square it touches? No: too big.', { mode: 'both', sym: 'more than half: ' + BLOB2.half }, 2600],
          [BLOB2.full + ' + ' + BLOB2.half + ' = about ' + (BLOB2.full + BLOB2.half) + ' cm&sup2;.', { sym: 'about ' + (BLOB2.full + BLOB2.half) + ' cm&sup2;' }]
        ]),
        together: [tgEst(1), tgEst(2), tgEst(3)],
        mistake: '<p>Counting every square the shape touches, which makes the estimate far too big, or only the full squares. Trace a hand on centimetre grid paper and colour full squares and more-than-half squares in two colours.</p>',
        check: [ck('la-est', 'plain', 1), ck('la-est', 'fill', 1), ck('la-est', 'mc', 2), ck('la-est', 'tf', 2), ck('la-est', 'plain', 3)] }
    ] },

    { id: 'mix', title: 'Perimeter or area?', sub: 'Around the edge, or the space inside.', concepts: [
      { id: 'which', title: 'Around or inside?', exp: ['E2.1', 'E2.9'], skill: 'la-mix',
        watch: clip(rectV, { l: 5, w: 3, o: { grid: true } }, [
          ['One rectangle, two questions.'],
          ['Around the edge: 5 + 3 + 5 + 3 = 16 cm. Perimeter.', { o: { grid: true, labels: 'all' }, sym: 'perimeter 16 cm' }, 2400],
          ['Inside: 3 rows of 5 = 15 cm&sup2;. Area.', { o: { grid: true, area: true }, sym: 'area 15 cm&sup2;' }, 2400]
        ]),
        example: clip(rectV, { l: 4, w: 4, o: { grid: true, unit: 'm' } }, [
          ['My turn. A garden 4 m by 4 m.'],
          ['A fence goes around: 4 + 4 + 4 + 4 = 16 m.', { o: { grid: true, unit: 'm', labels: 'all' }, sym: 'fence: 16 m' }],
          ['Grass seed covers the inside: 16 m&sup2;. Same number, different units.', { o: { grid: true, area: true, unit: 'm' }, sym: 'grass: 16 m&sup2;' }, 2600]
        ]),
        together: [tgMix('perimeter'), tgMix('area'), tgMix('any')],
        mistake: '<p>Mixing up perimeter and area: adding the sides when the question is about covering, or counting squares for a fence. Ask: "Does it go around the edge, or cover the inside?"</p>',
        check: [ck('la-mix', 'which', 1), ck('la-mix', 'plain', 1), ck('la-mix', 'fill', 2), ck('la-mix', 'story', 2), ck('la-mix', 'tf', 3)] }
    ] }
  ];

  A.register(CH, {
    full: true,
    lessons: LESSONS,
    quiz: [
      num('4 cm = ___ mm', 40, { 400: 'A centimetre is 10 mm, not 100.' }, { unit: 'mm', hint: '10 mm make 1 cm.', explain: '4 &times; 10 = 40 mm.', meta: { k: 'g3la-mm-bare' } }),
      fixed('Which unit would you use to measure <b>the road to the next town</b>?', UN, 3, unitFix('km'), { fig: pic('road', 'A road'), hint: 'It takes a long walk or a drive.', explain: 'Kilometres.', meta: { k: 'g3la-bn-unit', t: 'the road to the next town' } }),
      num('What is the perimeter of this rectangle?', 16, rcFix(6, 2), { unit: 'cm', fig: rect(6, 2), hint: 'Add all four sides.', explain: '6 + 2 + 6 + 2 = 16 cm.', meta: { k: 'g3la-rc-num', l: 6, w: 2 } }),
      num('Each square is 1 square unit. What is the area of the shape?', 11, {}, { unit: 'square units', fig: cellsFig(rowsCells([[0, 3], [0, 3], [0, 3], [0, 2]]), { c: 38 }), hint: 'Count row by row.', explain: '3 + 3 + 3 + 2 = 11 square units.', meta: { k: 'g3la-ar-num' } }),
      num('A string goes once around a hand drum. Then it is laid straight on a ruler. What is the perimeter?', 42, {}, { unit: 'cm', fig: curveFig('circle', 42), hint: 'Where does the string end?', explain: '42 cm.', meta: { k: 'g3la-cv-num' } }),
      num('Each square is 1 cm&sup2;. What is the area of the rectangle?', 24, { 20: 'That is the perimeter.' }, { unit: 'cm²', fig: rect(6, 4, { grid: true, area: true }), hint: '4 rows of 6.', explain: '4 &times; 6 = 24 cm&sup2;.', meta: { k: 'g3la-sq-num' } })
    ],
    practice: SKILLS.map(function (s) { return { id: s.id, name: s.name, code: s.code, gen: DEF[s.id][0][2] }; })
  });

  /* every skill's other shapes (docs/QUESTIONS.md); each skill keeps its first way of asking as "plain" */
  var SHAPES = {};
  SKILLS.forEach(function (s) { SHAPES[s.id] = DEF[s.id].slice(1); });
  Q.shapes(CH, SHAPES);
})();
