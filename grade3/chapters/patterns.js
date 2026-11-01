/* Grade 3 Patterns and coding: a full chapter (docs/QUESTIONS.md, "Full chapters"). 5 lessons, 17 ideas, one practice skill per idea.
   Ontario 2020: C1.1 to C1.4 patterns, C2.1 variables, C2.2 and C2.3 equal expressions, C3.1 and C3.2 coding.
   Every question sets meta.k; the answer checks are in tests/verify/grade3.js (keys start with g3pt-). */
(function () {
  var A = Atlas, R = A.R, Q = A.Q, CH = 'patterns';
  var mc = G3.mc, num = G3.num, tf = G3.tf, clip = G3.clip;
  var SH = { A: 'circle', B: 'square', C: 'triangle', D: 'star' }, FILL = { A: 'var(--sb)', B: 'var(--hi)', C: 'var(--sf)', D: 'var(--sd)' };
  var DIR = ['up', 'right', 'down', 'left'], DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
  var OPS = { '+': '+', '-': '&minus;', x: '&times;', '/': '&divide;' }, UNI = { '+': '+', '-': '−', x: '×', '/': '÷' };

  /* ---------- small helpers ---------- */
  function coin() { return Math.random() < 0.5; }
  function put(o, x) { for (var k in x) o[k] = x[k]; return o; }
  function plain(h) { var e = document.createElement('div'); e.innerHTML = h; return e.textContent.replace(/\s+/g, ' ').trim(); }
  function r1(v) { return Math.round(v * 10) / 10; }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function seq(a, d, n) { var v = []; for (var i = 0; i < n; i++) v.push(a + d * i); return v; }
  function sum(v) { return v.reduce(function (a, b) { return a + b; }, 0); }
  function math(t) { return '<span class="math">' + t + '</span>'; }
  function sym(t) { return t ? '<p class="g3-sym">' + t + '</p>' : ''; }
  function nth(k) { return k + (k % 10 === 1 && k % 100 !== 11 ? 'st' : k % 10 === 2 && k % 100 !== 12 ? 'nd' : k % 10 === 3 && k % 100 !== 13 ? 'rd' : 'th'); }
  function calc(a, op, b) { return op === '+' ? a + b : op === '-' ? a - b : op === 'x' ? a * b : a / b; }
  function ex(e) { return e[0] + ' ' + OPS[e[1]] + ' ' + e[2]; }
  function exU(e) { return e[0] + ' ' + UNI[e[1]] + ' ' + e[2]; }
  function fixed(q, opts, ans, fixes, x) { var w = {}; opts.forEach(function (o, j) { if (j !== ans && fixes[j]) w[plain(o)] = fixes[j]; }); return put({ q: q, type: 'mc', options: opts, answer: ans, wrong: w }, x || {}); }

  /* ---------- pictures ---------- */
  function glyph(k, x, y, r) {
    var st = ' style="fill:' + FILL[k] + ';stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"';
    if (k === 'A') return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"' + st + '/>';
    if (k === 'B') return '<rect x="' + (x - r) + '" y="' + (y - r) + '" width="' + 2 * r + '" height="' + 2 * r + '" rx="3"' + st + '/>';
    if (k === 'C') return '<polygon points="' + x + ',' + (y - r) + ' ' + r1(x + r) + ',' + r1(y + r * 0.85) + ' ' + r1(x - r) + ',' + r1(y + r * 0.85) + '"' + st + '/>';
    var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p.push(r1(x + rr * Math.cos(a)) + ',' + r1(y + rr * Math.sin(a))); }
    return '<polygon points="' + p.join(' ') + '"' + st + '/>';
  }
  function qbox(x, y) { return '<rect x="' + (x - 20) + '" y="' + (y - 20) + '" width="40" height="40" rx="8" style="fill:color-mix(in srgb,var(--hi) 30%,var(--card));stroke:var(--ink)" stroke-width="2" stroke-dasharray="5 4"/><text x="' + x + '" y="' + (y + 9) + '" text-anchor="middle" font-size="26" class="tb">?</text>'; }
  /* a row of shapes: the core ("ABB") repeats for n shapes. o.mark: a "?" at that index; o.box: outline each core; o.nums: position numbers (default on) */
  function row(core, n, o) {
    o = o || {};
    var per = Math.min(n, 8), gap = 48, nums = o.nums !== false, rh = nums ? 70 : 52, s = '';
    for (var i = 0; i < n; i++) {
      var x = 26 + (i % per) * gap, y = 28 + Math.floor(i / per) * rh;
      s += i === o.mark ? qbox(x, y) : glyph(core.charAt(i % core.length), x, y, 17);
      if (nums) s += '<text x="' + x + '" y="' + (y + 40) + '" text-anchor="middle" font-size="15" class="t2">' + (i + 1) + '</text>';
    }
    if (o.box) for (var c = 0; (c + 1) * core.length <= n; c++) {
      var st = c * core.length, en = st + core.length - 1;
      if (Math.floor(st / per) !== Math.floor(en / per)) continue;
      var x0 = 26 + (st % per) * gap - 23, x1 = 26 + (en % per) * gap + 23, yy = 28 + Math.floor(st / per) * rh;
      s += '<rect x="' + x0 + '" y="' + (yy - 24) + '" width="' + (x1 - x0) + '" height="48" rx="10" fill="none" style="stroke:var(--strand)" stroke-width="2.5"/>';
    }
    var lab = []; for (var j = 0; j < n; j++) lab.push(j === o.mark ? 'missing' : SH[core.charAt(j % core.length)]);
    return A.svg(per * gap + 6, Math.ceil(n / per) * rh + 6, s, 'Pattern: ' + lab.join(', '));
  }
  function opt(k) { return A.svg(34, 34, glyph(k, 17, 17, 13), SH[k]) + ' ' + SH[k]; }
  function arrow(d, x, y) {
    return '<rect x="' + (x - 20) + '" y="' + (y - 20) + '" width="40" height="40" rx="8" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>' +
      '<g transform="translate(' + x + ' ' + y + ') rotate(' + d * 90 + ')"><path d="M0 -16 L12 -2 L4 -2 L4 15 L-4 15 L-4 -2 L-12 -2 Z" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5" stroke-linejoin="round"/></g>';
  }
  /* arrows that turn: the arrow at index i points (s + t * i) % 4 (0 up, 1 right, 2 down, 3 left) */
  function arrows(c, n, mark) {
    var per = Math.min(n, 8), s = '';
    for (var i = 0; i < n; i++) {
      var x = 26 + (i % per) * 48, y = 28 + Math.floor(i / per) * 70;
      s += i === mark ? qbox(x, y) : arrow((c.s + c.t * i) % 4, x, y);
      s += '<text x="' + x + '" y="' + (y + 40) + '" text-anchor="middle" font-size="15" class="t2">' + (i + 1) + '</text>';
    }
    return A.svg(per * 48 + 6, Math.ceil(n / per) * 70 + 6, s, 'Arrows that turn');
  }
  function arrowPic(d) { return A.svg(48, 48, arrow(d, 24, 24), 'An arrow pointing ' + DIR[d]); }
  /* numbers on a line, with a jump from each to the next. o.hide: indexes shown as "?"; o.diff: label each jump */
  function jumpLine(v, o) {
    o = o || {};
    var hide = o.hide || [], lo = Math.min.apply(null, v), hi = Math.max.apply(null, v), x0 = 34, x1 = 366, s = '';
    var X = function (t) { return hi === lo ? 200 : x0 + (x1 - x0) * (t - lo) / (hi - lo); };
    s += '<line x1="10" y1="78" x2="390" y2="78" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 1; i < v.length; i++) {
      var a = X(v[i - 1]), b = X(v[i]), m = (a + b) / 2;
      s += '<path d="M' + r1(a) + ' 72 Q' + r1(m) + ' 32 ' + r1(b) + ' 72" fill="none" style="stroke:var(--strand)" stroke-width="3"/>';
      if (o.diff) s += '<text x="' + r1(m) + '" y="44" text-anchor="middle" font-size="17" class="tb" style="fill:var(--strand)">' + (v[i] > v[i - 1] ? '+' : '−') + Math.abs(v[i] - v[i - 1]) + '</text>';
    }
    v.forEach(function (t, j) {
      var x = r1(X(t)), h = hide.indexOf(j) >= 0;
      s += '<circle cx="' + x + '" cy="78" r="6" style="fill:' + (h ? 'var(--card)' : 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="106" text-anchor="middle" font-size="18" class="tb">' + (h ? '?' : t) + '</text>';
    });
    return A.svg(400, 114, s, 'Number line: ' + v.map(function (t, j) { return hide.indexOf(j) >= 0 ? 'a missing number' : t; }).join(', '));
  }
  /* towers for a number pattern: cubes when they fit, bars when the numbers are big */
  function towers(v, hide) {
    var max = Math.max.apply(null, v), u = Math.min(14, 150 / max), w = Math.min(54, 380 / v.length), s = '';
    v.forEach(function (t, i) {
      var x = 10 + i * w;
      if (i !== hide) {
        if (u >= 8) for (var k = 0; k < t; k++) s += '<rect x="' + r1(x + 6) + '" y="' + r1(170 - (k + 1) * u) + '" width="' + r1(w - 12) + '" height="' + r1(u - 1.5) + '" rx="2" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1"/>';
        else s += '<rect x="' + r1(x + 6) + '" y="' + r1(170 - t * u) + '" width="' + r1(w - 12) + '" height="' + r1(t * u) + '" rx="3" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/>';
      }
      s += '<text x="' + r1(x + w / 2) + '" y="194" text-anchor="middle" font-size="18" class="tb">' + (i === hide ? '?' : t) + '</text>';
    });
    return A.svg(r1(20 + v.length * w), 202, s, 'Towers: ' + v.map(function (t, i) { return i === hide ? 'missing' : t; }).join(', '));
  }
  /* figures of tiles that grow: figure f has a + d(f - 1) tiles; the first a tiles are dark, the added ones light */
  function figs(a, d, k) {
    var s = '', x = 8, t = 14;
    for (var f = 1; f <= k; f++) {
      var n = a + d * (f - 1), cols = Math.ceil(n / 5), w = cols * (t + 2);
      for (var i = 0; i < n; i++) s += '<rect x="' + (x + Math.floor(i / 5) * (t + 2)) + '" y="' + (90 - (i % 5 + 1) * (t + 2)) + '" width="' + t + '" height="' + t + '" rx="2" style="fill:' + (i < a ? 'var(--strand)' : 'var(--hi)') + ';stroke:var(--ink)" stroke-width="1.2"/>';
      s += '<text x="' + r1(x + w / 2) + '" y="112" text-anchor="middle" font-size="15" class="t2">' + f + '</text>';
      x += Math.max(w, 24) + 20;
    }
    return A.svg(x, 118, s, 'Figures 1 to ' + k + ': ' + seq(a, d, k).join(', ') + ' tiles');
  }
  function tabHtml(head, fs, vals, hide) {
    return '<div class="tbl"><table><tbody><tr><th class="l">' + head[0] + '</th>' + fs.map(function (f) { return '<td>' + f + '</td>'; }).join('') + '</tr><tr><th class="l">' + head[1] + '</th>' +
      vals.map(function (v, i) { return '<td>' + (hide.indexOf(i) >= 0 ? '?' : v) + '</td>'; }).join('') + '</tr></tbody></table></div>';
  }
  function ruleTxt(op, k, u) { var o = u ? UNI : OPS; return op === 'x' ? k + ' ' + o.x + ' n' : 'n ' + o[op] + ' ' + k; }
  /* a number machine: a number goes in, the rule works on it, a number comes out ("?" for one we do not know) */
  function machine(op, k, inn, out) {
    var s = '<text x="40" y="22" text-anchor="middle" font-size="15" class="t2">in</text><rect x="4" y="30" width="72" height="56" rx="10" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><text x="40" y="67" text-anchor="middle" font-size="26" class="tb">' + inn + '</text>' +
      '<path d="M80 58 H108" style="stroke:var(--ink)" stroke-width="3"/><polygon points="108,51 120,58 108,65" style="fill:var(--ink)"/>' +
      '<rect x="124" y="18" width="152" height="80" rx="16" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--strand)" stroke-width="3"/><text x="200" y="67" text-anchor="middle" font-size="26" class="tb">' + ruleTxt(op, k, true) + '</text>' +
      '<path d="M280 58 H308" style="stroke:var(--ink)" stroke-width="3"/><polygon points="308,51 320,58 308,65" style="fill:var(--ink)"/>' +
      '<text x="360" y="22" text-anchor="middle" font-size="15" class="t2">out</text><rect x="324" y="30" width="72" height="56" rx="10" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2.5"/><text x="360" y="67" text-anchor="middle" font-size="26" class="tb" style="fill:#13203a">' + out + '</text>';
    return A.svg(400, 104, s, 'Number machine: ' + inn + ' goes in, the rule is ' + ruleTxt(op, k, true) + ', ' + out + ' comes out');
  }
  /* a pan balance. tilt: -1 left side heavier, 0 level, 1 right side heavier, null not shown yet */
  function pan(cx, t) { return '<rect x="' + (cx - 76) + '" y="70" width="152" height="54" rx="10" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--strand)" stroke-width="2.5"/><text x="' + cx + '" y="106" text-anchor="middle" font-size="25" class="tb">' + t + '</text>'; }
  function balance(lt, rt, tilt) {
    var s = '<polygon points="200,130 176,178 224,178" style="fill:var(--line);stroke:var(--ink)" stroke-width="2"/>' +
      '<g transform="rotate(' + (tilt ? tilt * 7 : 0) + ' 200 130)"><line x1="40" y1="128" x2="360" y2="128" style="stroke:var(--ink)" stroke-width="6" stroke-linecap="round"/>' + pan(88, lt) + pan(312, rt) + '</g>';
    if (tilt == null) s += '<text x="200" y="44" text-anchor="middle" font-size="30" class="tb">?</text>';
    return A.svg(400, 184, s, 'A balance: ' + lt + ' and ' + rt);
  }
  function cards(lt, rt) {
    var c = function (x, t) { return '<rect x="' + x + '" y="8" width="160" height="62" rx="12" style="fill:var(--card);stroke:var(--strand)" stroke-width="2.5"/><text x="' + (x + 80) + '" y="49" text-anchor="middle" font-size="25" class="tb">' + t + '</text>'; };
    return A.svg(400, 78, c(6, lt) + '<circle cx="200" cy="39" r="18" style="fill:color-mix(in srgb,var(--hi) 35%,var(--card));stroke:var(--ink)" stroke-width="2"/><text x="200" y="48" text-anchor="middle" font-size="24" class="tb">?</text>' + c(234, rt), lt + ' and ' + rt);
  }
  /* the robot: start = [column, row, direction]; a program is a list like [['move', 3], ['right'], ['move', 2]] */
  function run(start, prog) {
    var x = start[0], y = start[1], d = start[2], path = [[x, y]], moved = 0;
    prog.forEach(function (c) {
      if (c[0] === 'move') for (var i = 0; i < c[1]; i++) { x += DX[d]; y += DY[d]; moved++; path.push([x, y]); }
      else d = (d + (c[0] === 'right' ? 1 : 3)) % 4;
    });
    return { x: x, y: y, d: d, path: path, moved: moved };
  }
  function fits(r, n) { return r.path.every(function (p) { return p[0] >= 0 && p[1] >= 0 && p[0] < n && p[1] < n; }); }
  function starAt(cx, cy, r) { var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p.push(r1(cx + rr * Math.cos(a)) + ',' + r1(cy + rr * Math.sin(a))); } return '<polygon points="' + p.join(' ') + '" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>'; }
  /* a grid: o.n squares a side, o.start, o.done (steps already run, drawn as a path), o.star, o.hits (every square can be tapped) */
  function grid(o) {
    var n = o.n || 6, c = n > 6 ? 36 : 44, W = n * c + 8, s = '', r = run(o.start, o.done || []);
    var C = function (v) { return 4 + v * c + c / 2; };
    s += '<rect x="4" y="4" width="' + n * c + '" height="' + n * c + '" style="fill:var(--card)"/>';
    for (var i = 0; i <= n; i++) s += '<line x1="' + (4 + i * c) + '" y1="4" x2="' + (4 + i * c) + '" y2="' + (4 + n * c) + '" style="stroke:var(--line)" stroke-width="1.5"/><line x1="4" y1="' + (4 + i * c) + '" x2="' + (4 + n * c) + '" y2="' + (4 + i * c) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    if (o.star) s += starAt(C(o.star[0]), C(o.star[1]), c * 0.36);
    if (r.path.length > 1) s += '<polyline points="' + r.path.map(function (p) { return C(p[0]) + ',' + C(p[1]); }).join(' ') + '" fill="none" style="stroke:var(--strand)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>';
    s += '<circle cx="' + C(o.start[0]) + '" cy="' + C(o.start[1]) + '" r="7" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>';
    s += '<g transform="translate(' + C(r.x) + ' ' + C(r.y) + ') rotate(' + r.d * 90 + ')"><polygon points="0,-15 12,11 0,5 -12,11" style="fill:var(--sb);stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/></g>';
    if (o.hits) for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) s += '<rect data-hit="' + x + ',' + y + '" aria-label="the square ' + (x + 1) + ' across, ' + (n - y) + ' up" x="' + (4 + x * c) + '" y="' + (4 + y * c) + '" width="' + c + '" height="' + c + '" fill="transparent" style="cursor:pointer"/>';
    return A.svg(W, W, s, 'A grid with a robot' + (o.star ? ' and a star' : ''));
  }
  function line(c) { return c[0] === 'move' ? 'move ' + c[1] : 'turn ' + c[0]; }
  function codeTxt(prog) { return prog.map(line).join(', '); }
  function code(prog, cur) { return '<pre class="mono">' + prog.map(function (c, i) { return i === cur ? '<b>' + line(c) + '</b>' : line(c); }).join('\n') + '</pre>'; }
  function loopTxt(r, body) { return 'repeat ' + r + ' times [' + codeTxt(body) + ']'; }
  function loopCode(r, body) { return '<pre class="mono">repeat ' + r + ' times\n' + body.map(function (c) { return '  ' + line(c); }).join('\n') + '\nend repeat</pre>'; }
  function expand(r, body) { var p = []; for (var i = 0; i < r; i++) p = p.concat(body); return p; }
  function moves(body) { return sum(body.map(function (c) { return c[0] === 'move' ? c[1] : 0; })); }
  /* a straight track of squares: the robot is on square "at", the star on square "star" */
  function track(len, at, star) {
    var u = Math.min(24, 380 / (len + 1)), s = '';
    for (var i = 0; i <= len; i++) {
      s += '<rect x="' + r1(8 + i * u) + '" y="20" width="' + r1(u) + '" height="' + r1(u) + '" style="fill:' + (i && i <= at ? 'color-mix(in srgb,var(--strand) 30%,var(--card))' : 'var(--card)') + ';stroke:var(--line)" stroke-width="1.5"/>';
      if (i % 5 === 0) s += '<text x="' + r1(8 + i * u + u / 2) + '" y="' + r1(36 + u) + '" text-anchor="middle" font-size="14" class="t2">' + i + '</text>';
    }
    if (star != null) s += starAt(r1(8 + star * u + u / 2), r1(20 + u / 2), u * 0.42);
    s += '<g transform="translate(' + r1(8 + at * u + u / 2) + ' ' + r1(20 + u / 2) + ') rotate(90)"><polygon points="0,-9 7,7 0,3 -7,7" style="fill:var(--sb);stroke:var(--ink)" stroke-width="1.5"/></g>';
    return A.svg(r1(16 + (len + 1) * u), r1(44 + u), s, 'A track of ' + len + ' squares');
  }
  /* things that happen in time: lanes = [[label, start, end, text], ...], T seconds, a line at "now" */
  function timeline(lanes, T, now) {
    var x0 = 86, u = 300 / T, s = '', y0 = 10 + lanes.length * 50;
    lanes.forEach(function (l, i) {
      var y = 10 + i * 50;
      s += '<text x="4" y="' + (y + 24) + '" font-size="17" class="tb">' + l[0] + '</text><rect x="' + r1(x0 + l[1] * u) + '" y="' + y + '" width="' + r1((l[2] - l[1]) * u) + '" height="34" rx="8" style="fill:' + (i ? 'var(--hi)' : 'color-mix(in srgb,var(--strand) 70%,var(--card))') + ';stroke:var(--ink)" stroke-width="1.5"/>' +
        (l[3] ? '<text x="' + r1(x0 + (l[1] + l[2]) / 2 * u) + '" y="' + (y + 23) + '" text-anchor="middle" font-size="15" class="tb">' + l[3] + '</text>' : '');
    });
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + 300) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var t = 0; t <= T; t++) { s += '<line x1="' + r1(x0 + t * u) + '" y1="' + (y0 - 4) + '" x2="' + r1(x0 + t * u) + '" y2="' + (y0 + 4) + '" style="stroke:var(--ink)" stroke-width="1.5"/>'; if (T <= 10 || t % 2 === 0) s += '<text x="' + r1(x0 + t * u) + '" y="' + (y0 + 22) + '" text-anchor="middle" font-size="14" class="t2">' + t + '</text>'; }
    if (now != null) s += '<line x1="' + r1(x0 + now * u) + '" y1="4" x2="' + r1(x0 + now * u) + '" y2="' + (y0 + 6) + '" style="stroke:var(--bad)" stroke-width="3"/>';
    return A.svg(400, y0 + 30, s, 'A timeline in seconds: ' + lanes.map(function (l) { return l[0] + ' from ' + l[1] + ' to ' + l[2]; }).join(', '));
  }

  /* ---------- skills: one per idea. DEF[id] = [[minLevel, shape, fn(lv), maxLevel], ...], the first is "plain" ---------- */
  var DEF = {}, SKILLS = [];
  function skill(id, name, code, list) { DEF[id] = list; SKILLS.push({ id: id, name: name, code: code }); }
  function ck(id, shape, lv) { return function () { var s = DEF[id].filter(function (x) { return x[1] === shape; })[0], q = s[2](lv); q.shape = shape; return q; }; }

  /* ======================= Lesson 1: Repeating patterns ======================= */
  var CORES = { 1: ['AB', 'ABC', 'AAB', 'ABB'], 2: ['ABB', 'AAB', 'ABC', 'AABB', 'ABCD', 'ABBC'], 3: ['ABCD', 'AABC', 'ABBC', 'ABCC', 'AABB', 'ABAC', 'ABCB'] };
  /* the same structure drawn with shapes picked at random: "ABB" might become triangle, star, star */
  function paint(core) { var keys = R.shuffle(['A', 'B', 'C', 'D']), map = {}, k = 0; return core.split('').map(function (c) { if (!map[c]) map[c] = keys[k++]; return map[c]; }).join(''); }
  function coreOf(lv) { return paint(R.pick(CORES[lv])); }
  function names(core) { return core.split('').map(function (c) { return SH[c]; }).join(', '); }
  function count(core, k) { return core.split(k).length - 1; }
  /* "which shape?" with every shape as a choice; at = the index asked about */
  function shapeAsk(q, core, at, x) {
    var right = core.charAt(at % core.length), W = [];
    ['A', 'B', 'C', 'D'].forEach(function (k) { if (k !== right) W.push([opt(k), core.indexOf(k) >= 0 ? 'Say the core in order, up to that spot.' : 'That shape is not in this pattern.']); });
    return mc(q, opt(right), W, put({ meta: { k: 'g3pt-core-next', core: core, at: at } }, x));
  }
  skill('pt-core', 'Find the core', 'C1.1, C1.3', [
    [1, 'plain', function (lv) {
      var core = coreOf(lv), L = core.length, n = L * 2 + R.int(0, L - 1) + (lv === 3 ? L : 0);
      return shapeAsk('What comes next?', core, n, { fig: row(core, n + 1, { mark: n }), hint: 'Find the part that repeats. Say it again from the start.',
        steps: ['The core is ' + names(core) + '.', 'The ? is shape ' + (n % L + 1) + ' of a core.'], explain: 'Next comes a ' + SH[core.charAt(n % L)] + '.' });
    }],
    [1, 'missing', function (lv) {
      var core = coreOf(lv), L = core.length, n = L * 3, at = R.int(1, n - 2);
      return shapeAsk('Which shape is missing?', core, at, { fig: row(core, n, { mark: at }), hint: 'Find the core. Say it along the row.',
        steps: ['The core is ' + names(core) + '.', 'The ? is shape ' + (at % L + 1) + ' of a core.'], explain: 'The missing shape is a ' + SH[core.charAt(at % L)] + '.' });
    }],
    [1, 'tap', function (lv) {
      var core = coreOf(lv), L = core.length, sets = R.shuffle([core, core + core.charAt(0), L > 2 ? core.slice(0, L - 1) : core + core]), w = {};
      sets.forEach(function (s, i) { if (s !== core) w[String(i)] = s.length < L ? 'Too short: the pattern does not start again there.' : s.length === 2 * L ? 'That is the core twice. Find the smallest part.' : 'Too long: the pattern starts again before that.'; });
      return { q: 'Tap the core of this pattern.', type: 'tap', fig: row(core, L * 3), tiles: sets.map(function (s) { return row(s, s.length, { nums: false }); }), answer: sets.indexOf(core), answerText: names(core), wrong: w,
        hint: 'The core is the smallest part that repeats.', steps: ['Say the shapes until the first one comes back.', 'The core is ' + names(core) + '.'], explain: 'The core: ' + names(core) + '.', meta: { k: 'g3pt-core-tap', core: core, sets: sets } };
    }],
    [2, 'tf', function (lv) {
      var core = coreOf(lv), L = core.length, who = Q.name(), truth = coin(), said = truth ? core : R.pick([core + core.charAt(0), core + core].concat(L > 2 ? [core.slice(0, L - 1)] : []));
      return tf(who + ' says the core is <b>' + names(said) + '</b>. True or false: ' + who + ' is right.', truth, 'The part that repeats is ' + names(core) + '.',
        ['The core is always the first 2 shapes.', 'The core is every shape you can see.', 'Any part of the pattern is the core.'], 'Say the shapes until the first one comes back.',
        { fig: row(core, L * 3), hint: 'Find the smallest part that repeats.', meta: { k: 'g3pt-core-tf', core: core, said: said } });
    }],
    [1, 'fill', function (lv) {
      var core = coreOf(lv), L = core.length, sh = R.pick(core.split('')), per = count(core, sh), r = lv === 1 ? R.int(2, 3) : lv === 2 ? R.int(3, 5) : R.int(6, 9);
      return { q: 'Look at the pattern. Fill in the blanks.', type: 'fill', fig: row(core, L * 2, { box: true }), fill: 'One core has [[]] shapes.<br>' + r + ' cores have [[]] ' + SH[sh] + 's.', answers: [L, per * r],
        hint: 'Count the shapes in one box. Then count the ' + SH[sh] + 's in one box.', steps: ['One core: ' + names(core) + '. That is ' + L + ' shapes.', 'Each core has ' + G3.pl(per, SH[sh]) + '. ' + r + ' &times; ' + per + ' = ' + per * r + '.'],
        explain: L + ' shapes in a core, and ' + per * r + ' ' + SH[sh] + 's in ' + r + ' cores.', meta: { k: 'g3pt-core-fill', core: core, r: r, sh: sh } };
    }]
  ]);
  function tgCore(lv) {
    return function () {
      var core = coreOf(lv), L = core.length, n = L * 2 + R.int(0, L - 1), f1 = {}, f2 = {};
      f1[2 * L] = 'That is two cores. Stop when the first shape comes back.';
      f2[n % L] = 'Count the shapes after the last full core, then one more for the ?.';
      return { q: 'What comes next?', fig: row(core, n + 1, { mark: n }), done: 'Next comes a ' + SH[core.charAt(n % L)] + '.', steps: [
        { prompt: 'Say the shapes until the first one comes back.', q: num('How many shapes are in the core?', L, f1, { hint: 'Count until the first shape comes back.', meta: { k: 'g3pt-core-len', core: core } }) },
        { prompt: 'Count the shapes after the last full core.', q: num('The ? is shape number ___ of a core.', n % L + 1, f2, { hint: n + ' shapes come before the ?.', meta: { k: 'g3pt-core-pos', core: core, n: n } }) },
        { prompt: 'Say the core up to that spot.', q: shapeAsk('So what comes next?', core, n, { hint: 'Shape ' + (n % L + 1) + ' of the core.' }) }
      ] };
    };
  }

  /* ---------- Same pattern, new look ---------- */
  function struct(list) { var map = {}, k = 0; return list.map(function (c) { if (!(c in map)) map[c] = 'ABCD'.charAt(k++); return map[c]; }).join(''); }
  function letters(s) { return s.split('').join(', '); }
  var STRUCTS = { 1: ['AB', 'ABB', 'AAB', 'ABC'], 2: ['AB', 'ABB', 'AAB', 'ABC', 'AABB', 'ABBC'], 3: ['ABCD', 'AABC', 'ABBC', 'ABCB', 'ABAC', 'AABB', 'ABCC'] };
  var ALLST = ['AB', 'ABB', 'AAB', 'ABC', 'ABA', 'AABB', 'ABBC', 'ABCD', 'AABC', 'ABCB', 'ABAC', 'ABCC', 'AABA'];
  var ACTS = ['clap', 'snap', 'stomp', 'tap'];
  function acts(st) { var k = R.shuffle(ACTS); return st.split('').map(function (c) { return k['ABCD'.indexOf(c)]; }); }
  var REAL = [['A traffic light', ['green', 'yellow', 'red']], ['Day and night', ['day', 'night']], ['The seasons', ['winter', 'spring', 'summer', 'fall']], ['A beaded bracelet', ['red', 'red', 'white']],
    ['A fence', ['tall post', 'short post', 'short post']], ['The tide at the beach', ['high', 'low']], ['The moon', ['full', 'half', 'new', 'half']], ['A school bell', ['ring', 'ring', 'pause']],
    ['A drum song', ['loud', 'soft', 'soft']], ['A sidewalk', ['grey', 'grey', 'red', 'grey']], ['A quilt row', ['blue', 'white', 'green']], ['Canada Day lights', ['red', 'white']]];
  function letterWrongs(st) {
    return R.shuffle(ALLST.filter(function (x) { return x !== st; })).sort(function (a, b) { return Math.abs(a.length - st.length) - Math.abs(b.length - st.length); })
      .map(function (x) { return [letters(x), x.length !== st.length ? 'The core has ' + st.length + ' parts. Count them again.' : 'Give each new thing the next letter. A thing you have seen keeps its letter.']; });
  }
  function actWrongs(st) { return letterWrongs(st).map(function (w) { return [acts(w[0].replace(/, /g, '')).join(', '), 'Write both with letters. They do not match.']; }); }
  skill('pt-forms', 'Same pattern, new look', 'C1.1, C1.2', [
    [1, 'plain', function (lv) {
      var st = R.pick(STRUCTS[lv]), core = paint(st);
      return mc('Which letters show this core?', letters(st), letterWrongs(st), { fig: row(core, st.length * 2, { box: true }), hint: 'The first shape is A. Each new shape gets the next letter.',
        steps: ['The core is ' + names(core) + '.', 'As letters: ' + letters(st) + '.'], explain: names(core) + ' is ' + letters(st) + '.', meta: { k: 'g3pt-forms-letters', core: core } });
    }],
    [1, 'real', function (lv) {
      var r = R.pick(REAL.filter(function (x) { return lv === 3 ? x[1].length >= 3 : x[1].length <= 3; })), st = struct(r[1]);
      return mc(r[0] + ': <b>' + r[1].concat(r[1]).join(', ') + ', &hellip;</b><br>Which letters show the core?', letters(st), letterWrongs(st), { hint: 'The first word is A. Each new word gets the next letter.',
        steps: ['The core is ' + r[1].join(', ') + '.', 'As letters: ' + letters(st) + '.'], explain: r[1].join(', ') + ' is ' + letters(st) + '.', meta: { k: 'g3pt-forms-words', words: r[1] } });
    }],
    [1, 'tap', function (lv) {
      var sts = R.shuffle(STRUCTS[lv]).slice(0, 3), want = sts[0], a = acts(want), sets = R.shuffle(sts.map(paint)), ans = 0;
      sets.forEach(function (s, i) { if (struct(s.split('')) === want) ans = i; });
      return { q: 'Tap the shapes that make the same pattern as <b>' + a.join(', ') + '</b>.', type: 'tap', tiles: sets.map(function (s) { return row(s + s, s.length * 2, { nums: false }); }), answer: ans, answerText: names(sets[ans]),
        hint: 'Write the actions with letters. Then write each row with letters.', steps: [a.join(', ') + ' is ' + letters(want) + '.', 'Find the shapes that are ' + letters(want) + ' too.'], explain: 'Both are ' + letters(want) + '.', meta: { k: 'g3pt-forms-tap', words: a, sets: sets } };
    }],
    [2, 'match', function (lv) {
      var sts = R.shuffle(STRUCTS[lv]).slice(0, 3);
      return { q: 'Match each action pattern to its letters.', type: 'match', pairs: sts.map(function (st) { return [acts(st).join(', '), letters(st)]; }), hint: 'The first action is A. A new action gets the next letter.',
        steps: ['clap, snap, snap is A, B, B.'], explain: sts.map(letters).join('; ') + '.', meta: { k: 'g3pt-forms-match' } };
    }],
    [2, 'tf', function (lv) {
      var st = R.pick(STRUCTS[lv]), core = paint(st), truth = coin(), other = truth ? st : R.pick(ALLST.filter(function (x) { return x !== st && Math.abs(x.length - st.length) <= 1; })), a = acts(other);
      return tf('True or false: <b>' + a.join(', ') + '</b> is the same pattern as these shapes.', truth, 'The shapes are ' + letters(st) + '. The actions are ' + letters(other) + '.',
        ['Patterns with different things are never the same.', 'Any two patterns of actions are the same.', 'The first part is all that matters.'], 'Write both with letters, then compare.',
        { fig: row(core, st.length * 2, { box: true }), hint: 'Write both with letters.', meta: { k: 'g3pt-forms-tf', words: a, core: core } });
    }]
  ]);
  function tgForms(lv) {
    return function () {
      var st = R.pick(STRUCTS[lv]), core = paint(st);
      return { q: 'Write this pattern with letters, then with actions.', fig: row(core, st.length * 2, { box: true }), done: names(core) + ' = ' + letters(st) + '.', steps: [
        { prompt: 'Call the first shape A. Is the next shape the same, or new?', q: fixed('The first shape is A. What letter is the second shape?', ['A', 'B', 'C'], st.charAt(1) === 'A' ? 0 : 1, ['Look again: is the second shape new?', 'Look again: it is the same shape as the first.', 'C is for the third new shape.'], { hint: 'Same shape, same letter.', meta: { k: 'g3pt-forms-second', core: core } }) },
        { prompt: 'Give each new shape the next letter.', q: mc('Which letters show the core?', letters(st), letterWrongs(st), { hint: 'A shape you have seen keeps its letter.', meta: { k: 'g3pt-forms-letters', core: core } }) },
        { prompt: 'Now any actions with the same letters.', q: mc('Which actions make the same pattern?', acts(st).join(', '), actWrongs(st), { hint: 'The actions must be ' + letters(st) + ' too.', meta: { k: 'g3pt-forms-act', core: core } }) }
      ] };
    };
  }

  /* ---------- Movement patterns ---------- */
  var TURN = { 1: 'a quarter turn right', 3: 'a quarter turn left', 2: 'a half turn' }, TURNS = [1, 3, 2];
  function mvCase(lv, quarter) { return { s: R.int(0, 3), t: quarter ? R.pick([1, 3]) : R.pick(lv === 1 ? [1, 2] : [1, 3, 2]) }; }
  function dirAt(c, i) { return (c.s + c.t * i) % 4; }
  function nextArrow(q, c, n, x) {
    var dirs = R.shuffle([0, 1, 2, 3]), ans = dirs.indexOf(dirAt(c, n)), w = {};
    dirs.forEach(function (d, i) { if (i !== ans) w[String(i)] = 'That arrow points ' + DIR[d] + '. Make ' + TURN[c.t] + ' from the last arrow.'; });
    return put({ q: q, type: 'tap', tiles: dirs.map(arrowPic), answer: ans, answerText: 'the arrow pointing ' + DIR[dirAt(c, n)], wrong: w, meta: { k: 'g3pt-move-next', s: c.s, t: c.t, i: n, dirs: dirs } }, x);
  }
  skill('pt-move', 'Movement patterns', 'C1.2, C1.3', [
    [1, 'plain', function (lv) {
      var c = mvCase(lv), n = lv === 1 ? R.int(3, 5) : lv === 2 ? R.int(5, 7) : R.int(8, 11);
      return nextArrow('Which arrow comes next?', c, n, { fig: arrows(c, n + 1, n), hint: 'How does the arrow turn each time?', steps: ['Each time the arrow makes ' + TURN[c.t] + '.', 'Arrow ' + (n + 1) + ' points ' + DIR[dirAt(c, n)] + '.'], explain: 'It points ' + DIR[dirAt(c, n)] + '.' });
    }],
    [1, 'how', function (lv) {
      var c = mvCase(lv), n = lv === 3 ? 8 : 5, a = TURNS.indexOf(c.t);
      return fixed('How does the arrow move each time?', TURNS.map(function (t) { return cap(TURN[t]); }), a, ['Check the direction: right is the way a clock turns.', 'Check the direction: left is the other way.', 'A half turn flips the arrow to face the other way.'],
        { fig: arrows(c, n), hint: 'Compare arrow 1 and arrow 2.', steps: ['Arrow 1 points ' + DIR[c.s] + '. Arrow 2 points ' + DIR[dirAt(c, 1)] + '.'], explain: 'Each time: ' + TURN[c.t] + '.', meta: { k: 'g3pt-move-how', s: c.s, t: c.t } });
    }],
    [2, 'far', function (lv) {
      var c = mvCase(lv), p = lv === 2 ? R.int(9, 14) : R.int(15, 40), L = c.t === 2 ? 2 : 4, d = dirAt(c, p - 1);
      return fixed('The arrows keep turning. Which way does arrow <b>' + p + '</b> point?', DIR.map(cap), d, DIR.map(function () { return 'The core has ' + L + ' arrows. Count by ' + L + 's first.'; }),
        { fig: arrows(c, L * 2), hint: 'The core has ' + L + ' arrows.', steps: ['Count by ' + L + 's: arrow ' + (Math.floor((p - 1) / L) * L) + ' ends a core.', 'Arrow ' + p + ' is arrow ' + ((p - 1) % L + 1) + ' of a core: ' + DIR[d] + '.'], explain: 'Arrow ' + p + ' points ' + DIR[d] + '.', meta: { k: 'g3pt-move-far', s: c.s, t: c.t, p: p } });
    }],
    [1, 'order', function (lv) {
      var c = mvCase(lv, true), n = lv === 3 ? R.int(5, 7) : R.int(3, 4), items = [0, 1, 2].map(function (i) { return 'points ' + DIR[dirAt(c, n + i)]; });
      return { q: 'Put the next 3 arrows in order.', type: 'order', items: items, first: 'next', fig: arrows(c, n), hint: 'Make ' + TURN[c.t] + ' each time.', steps: ['Each time: ' + TURN[c.t] + '.', 'Next: ' + items.join(', ') + '.'],
        explain: items.join(', ') + '.', meta: { k: 'g3pt-move-order', s: c.s, t: c.t, from: n } };
    }],
    [1, 'core', function (lv) {
      var c = mvCase(lv), L = c.t === 2 ? 2 : 4, f = {};
      f[L === 4 ? 2 : 4] = 'Count the arrows until one points ' + DIR[c.s] + ' again.';
      return num('How many arrows are in the core?', L, f, { fig: arrows(c, lv === 3 ? 9 : 8), hint: 'Find the next arrow that points ' + DIR[c.s] + ', like arrow 1.', steps: ['Arrow ' + (L + 1) + ' points ' + DIR[c.s] + ' again.', 'The core is ' + L + ' arrows.'], explain: 'The core has ' + L + ' arrows.', meta: { k: 'g3pt-move-core', t: c.t } });
    }],
    [2, 'tf', function (lv) {
      var c = mvCase(lv), p = lv === 2 ? R.int(5, 9) : R.int(10, 24), d = dirAt(c, p - 1), truth = coin(), said = truth ? d : (d + R.pick([1, 2, 3])) % 4, who = Q.name();
      return tf(who + ' says arrow <b>' + p + '</b> points <b>' + DIR[said] + '</b>. True or false: ' + who + ' is right.', truth, 'Arrow ' + p + ' points ' + DIR[d] + '.',
        ['Every arrow points up.', 'Arrows far along point the same as the last one shown.', 'Arrow ' + p + ' is the same as arrow ' + (p % 10 || 1) + '.'], 'Find the core, then count by cores.',
        { fig: arrows(c, 4), hint: 'How many arrows in the core?', meta: { k: 'g3pt-move-tf', s: c.s, t: c.t, p: p, said: said } });
    }]
  ]);
  function tgMove(lv) {
    return function () {
      var c = mvCase(lv), n = 4 + lv, a = TURNS.indexOf(c.t);
      return { q: 'Which arrow comes next?', fig: arrows(c, n + 1, n), done: 'Arrow ' + (n + 1) + ' points ' + DIR[dirAt(c, n)] + '.', steps: [
        { prompt: 'Compare arrow 1 and arrow 2.', q: fixed('How does the arrow move each time?', TURNS.map(function (t) { return cap(TURN[t]); }), a, ['Right is the way a clock turns.', 'Left is the other way.', 'A half turn makes it face the other way.'], { hint: 'Arrow 1 points ' + DIR[c.s] + '. Arrow 2 points ' + DIR[dirAt(c, 1)] + '.', meta: { k: 'g3pt-move-how', s: c.s, t: c.t } }) },
        { prompt: 'Turn the last arrow that way.', q: nextArrow('So which arrow comes next?', c, n, { hint: 'The last arrow points ' + DIR[dirAt(c, n - 1)] + '.' }) }
      ] };
    };
  }

  /* ---------- Predict far ahead ---------- */
  function farP(lv, L) { return lv === 1 ? R.int(2 * L + 1, 16) : lv === 2 ? R.int(17, 30) : R.int(31, 60); }
  skill('pt-ahead', 'Predict far ahead', 'C1.3', [
    [1, 'plain', function (lv) {
      var core = coreOf(lv), L = core.length, p = farP(lv, L);
      return shapeAsk('This pattern keeps going. What is shape number <b>' + p + '</b>?', core, p - 1, { fig: row(core, L * 2, { box: true }), hint: 'The core has ' + L + ' shapes. Count by ' + L + 's.',
        steps: [Math.floor((p - 1) / L) + ' full cores: ' + Math.floor((p - 1) / L) * L + ' shapes.', 'Shape ' + p + ' is shape ' + ((p - 1) % L + 1) + ' of the next core.'], explain: 'Shape ' + p + ' is a ' + SH[core.charAt((p - 1) % L)] + '.' });
    }],
    [1, 'count', function (lv) {
      var core = coreOf(lv), L = core.length, sh = R.pick(core.split('')), N = L * (lv === 1 ? R.int(2, 4) : lv === 2 ? R.int(4, 8) : R.int(6, 10)) + (lv === 3 ? R.int(1, L - 1) : 0), got = 0, f = {};
      for (var i = 0; i < N; i++) if (core.charAt(i % L) === sh) got++;
      f[Math.floor(N / L)] = 'That is the number of cores. How many ' + SH[sh] + 's in each core?';
      return num('The pattern keeps going. How many <b>' + SH[sh] + 's</b> are in the first ' + N + ' shapes?', got, f, { fig: row(core, L * 2, { box: true }), hint: 'How many cores fit in ' + N + ' shapes? How many ' + SH[sh] + 's in each?',
        steps: [N + ' shapes is ' + Math.floor(N / L) + ' cores' + (N % L ? ' and ' + G3.pl(N % L, 'shape') + ' more' : '') + '.', 'Each core has ' + G3.pl(count(core, sh), SH[sh]) + '.'], explain: got + ' ' + SH[sh] + 's.', meta: { k: 'g3pt-ahead-count', core: core, N: N, sh: sh } });
    }],
    [1, 'fill', function (lv) {
      var core = coreOf(lv), L = core.length, p = farP(lv, L);
      return { q: 'Think about shape number <b>' + p + '</b>. Fill in the blanks.', type: 'fill', fig: row(core, L * 2, { box: true }), fill: '[[]] full cores come before it.<br>It is shape [[]] of the next core.', answers: [Math.floor((p - 1) / L), (p - 1) % L + 1],
        hint: 'Count by ' + L + 's, but stay below ' + p + '.', steps: [Math.floor((p - 1) / L) + ' &times; ' + L + ' = ' + Math.floor((p - 1) / L) * L + '.', p + ' &minus; ' + Math.floor((p - 1) / L) * L + ' = ' + ((p - 1) % L + 1) + '.'], explain: 'Shape ' + p + ' is a ' + SH[core.charAt((p - 1) % L)] + '.', meta: { k: 'g3pt-ahead-fill', L: L, p: p } };
    }],
    [2, 'where', function (lv) {
      var core = R.pick(CORES[lv].filter(function (c) { return c !== 'AABB'; })), L, ones, sh, kth, i;
      core = paint(core); L = core.length; ones = core.split('').filter(function (k) { return count(core, k) === 1; }); sh = R.pick(ones); i = core.indexOf(sh); kth = lv === 2 ? R.int(3, 8) : R.int(9, 15);
      return num('The pattern keeps going. What is the position of the <b>' + nth(kth) + ' ' + SH[sh] + '</b>?', (kth - 1) * L + i + 1, {}, { fig: row(core, L * 2, { box: true }), hint: 'Each core has one ' + SH[sh] + '. It is shape ' + (i + 1) + ' of the core.',
        steps: ['The ' + nth(kth) + ' ' + SH[sh] + ' is in core ' + kth + '.', (kth - 1) + ' full cores: ' + (kth - 1) * L + ' shapes. Then ' + (i + 1) + ' more.'], explain: 'Position ' + ((kth - 1) * L + i + 1) + '.', meta: { k: 'g3pt-ahead-pos', core: core, sh: sh, kth: kth } });
    }],
    [2, 'tf', function (lv) {
      var core = coreOf(lv), L = core.length, p = farP(lv, L), real = core.charAt((p - 1) % L), truth = coin(), said = truth ? real : R.pick(['A', 'B', 'C', 'D'].filter(function (k) { return k !== real; })), who = Q.name();
      return tf(who + ' says shape number <b>' + p + '</b> is a <b>' + SH[said] + '</b>. True or false: ' + who + ' is right.', truth, 'Shape ' + p + ' is shape ' + ((p - 1) % L + 1) + ' of a core: a ' + SH[real] + '.',
        ['Shape ' + p + ' is always the first shape.', 'Patterns change after 10 shapes.', 'Shape ' + p + ' is the last shape you can see.'], 'Count by ' + L + 's to get close to ' + p + '.',
        { fig: row(core, L * 2, { box: true }), hint: 'Count by ' + L + 's.', meta: { k: 'g3pt-ahead-tf', core: core, p: p, said: said } });
    }]
  ]);
  function tgAhead(lv) {
    return function () {
      var core = coreOf(lv), L = core.length, p = farP(lv, L), full = Math.floor((p - 1) / L), f1 = {}, f2 = {};
      f1[Math.ceil(p / L)] = 'Too many: ' + Math.ceil(p / L) + ' cores go past ' + p + '.';
      f2[(p - 1) % L] = 'Count on from ' + full * L + ' to ' + p + '.';
      return { q: 'What is shape number <b>' + p + '</b>?', fig: row(core, L * 2, { box: true }), done: 'Shape ' + p + ' is a ' + SH[core.charAt((p - 1) % L)] + '.', steps: [
        { prompt: 'Count by ' + L + 's, staying below ' + p + '.', q: num('How many full cores come before shape ' + p + '?', full, f1, { hint: L + ', ' + 2 * L + ', ' + 3 * L + ', &hellip;', meta: { k: 'g3pt-ahead-full', L: L, p: p } }) },
        { prompt: full + ' cores make ' + full * L + ' shapes. Count on to ' + p + '.', q: num('Shape ' + p + ' is shape number ___ of the next core.', (p - 1) % L + 1, f2, { hint: p + ' &minus; ' + full * L + '.', meta: { k: 'g3pt-ahead-at', L: L, p: p } }) },
        { prompt: 'Find that shape in the core.', q: shapeAsk('So what is shape ' + p + '?', core, p - 1, { hint: 'Shape ' + ((p - 1) % L + 1) + ' of the core.' }) }
      ] };
    };
  }

  /* ======================= Lesson 2: Patterns that grow ======================= */
  function extCase(lv) {
    var d = lv === 1 ? R.pick([2, 3, 4, 5, 10]) : lv === 2 ? R.int(3, 9) : R.pick([7, 8, 9, 11, 12, 15, 20, 25]), up = lv === 1 || coin();
    return { a: up ? (lv === 1 ? R.int(0, 20) : lv === 2 ? R.int(5, 60) : R.int(40, 250)) : d * R.int(7, lv === 3 ? 14 : 9) + R.int(0, 9), d: up ? d : -d };
  }
  function rule(a, d) { return 'Start at ' + a + ', ' + (d > 0 ? 'add ' + d : 'take away ' + -d); }
  function doIt(d) { return (d > 0 ? 'add ' : 'take away ') + Math.abs(d); }
  var GROW = [['$', 'has $', '. Each week {who} saves $', '. How much money will {who} have after {w} weeks?'], ['cm', '’s sunflower is ', ' cm tall. It grows ', ' cm each week. How tall will it be after {w} weeks?'], ['', ' has ', ' hockey cards and gets ', ' more each week. How many cards after {w} weeks?']];
  var SHRINK = [['L', '’s rain barrel holds ', ' L of water. The garden uses ', ' L each day. How much is left after {w} days?'], ['', ' has ', ' stickers and gives away ', ' each day. How many are left after {w} days?'], ['$', ' has $', '. Each week {who} spends $', '. How much is left after {w} weeks?']];
  skill('pt-extend', 'Use a pattern rule', 'C1.3', [
    [1, 'plain', function (lv) {
      var c = extCase(lv), j = lv === 1 ? R.int(4, 5) : lv === 2 ? R.int(5, 6) : R.int(6, 8), v = seq(c.a, c.d, j), f = {};
      f[c.a + c.d * j] = 'One jump too many. The start is the 1st number.';
      return num(rule(c.a, c.d) + '. What is the <b>' + nth(j) + '</b> number?', v[j - 1], f, { fig: jumpLine(v, { hide: seq(1, 1, j - 1), diff: true }), hint: 'The 1st number is ' + c.a + '. Make ' + (j - 1) + ' jumps.',
        steps: [v.slice(0, 3).join(', ') + ', &hellip;', 'The ' + nth(j) + ' number is ' + v[j - 1] + '.'], explain: v.join(', ') + '.', meta: { k: 'g3pt-ext-nth', a: c.a, d: c.d, j: j } });
    }],
    [1, 'fill', function (lv) {
      var c = extCase(lv), v = seq(c.a, c.d, 6), g = R.shuffle([1, 2, 3, 4, 5]).slice(0, 2).sort();
      return { q: rule(c.a, c.d) + '. Fill in the missing numbers.', type: 'fill', fill: math(v.map(function (x, i) { return g.indexOf(i) >= 0 ? '[[]]' : x; }).join(', ')), answers: g.map(function (i) { return v[i]; }),
        fig: lv < 3 ? jumpLine(v, { hide: g }) : '', hint: doIt(c.d) + ' each time.', steps: ['The full pattern is ' + v.join(', ') + '.'], explain: v.join(', ') + '.', meta: { k: 'g3pt-ext-fill', a: c.a, d: c.d, gaps: g } };
    }],
    [1, 'line', function (lv) {
      var c = extCase(lv), d = Math.abs(c.d), a = c.d > 0 ? c.a : c.a % 50, j = R.int(3, 6);
      return { q: rule(a, d) + '. Put the marker on the <b>' + nth(j) + '</b> number.', type: 'line', min: a, max: a + d * 6, tick: d, every: d * 2, snap: d, answer: a + d * (j - 1),
        hint: 'The 1st number is ' + a + '. Each jump adds ' + d + '.', steps: [seq(a, d, j).join(', ') + '.'], explain: 'The ' + nth(j) + ' number is ' + (a + d * (j - 1)) + '.', meta: { k: 'g3pt-ext-line', a: a, d: d, j: j } };
    }],
    [2, 'story', function (lv) {
      var c = extCase(lv), who = Q.name(), w = lv === 2 ? R.int(3, 5) : R.int(4, 8), s = R.pick(c.d > 0 ? GROW : SHRINK), m = Math.abs(c.d), ans = c.a + c.d * w, f = {};
      if (c.d < 0) c = { a: Math.max(c.a, m * w + R.int(1, 9)), d: c.d }, ans = c.a + c.d * w;
      f[c.a + c.d * (w - 1)] = 'Count the ' + (s[3].indexOf('days') >= 0 ? 'days' : 'weeks') + ': make ' + w + ' jumps, not ' + (w - 1) + '.';
      var t = (who + s[1] + c.a + s[2].replace('{who}', who) + m + s[3]).replace(/\{who\}/g, who).replace('{w}', w);
      return num(t, ans, f, { unit: s[0] === '$' ? '' : s[0], fig: jumpLine(seq(c.a, c.d, w + 1), { hide: seq(1, 1, w), diff: true }), hint: 'Start at ' + c.a + '. ' + cap(doIt(c.d)) + ', ' + w + ' times.',
        steps: [seq(c.a, c.d, w + 1).join(', ') + '.'], explain: (s[0] === '$' ? '$' : '') + ans + (s[0] && s[0] !== '$' ? ' ' + s[0] : '') + '.', meta: { k: 'g3pt-ext-story', a: c.a, d: c.d, w: w } });
    }],
    [2, 'tf', function (lv) {
      var c = extCase(lv), v = seq(c.a, c.d, 4), real = c.a + c.d * 4, truth = coin(), said = truth ? real : R.pick([real + R.pick([1, 2, -1]), v[3] - c.d, real + c.d]), who = Q.name();
      return tf(rule(c.a, c.d) + ': ' + math(v.join(', ')) + '. ' + who + ' says the next number is <b>' + said + '</b>. True or false?', truth, v[3] + (c.d > 0 ? ' + ' : ' &minus; ') + Math.abs(c.d) + ' = ' + real + '.',
        ['Add 1 to the last number.', 'The next number is the first number again.', 'Add the last two numbers.'], 'Do the rule once more on ' + v[3] + '.', { hint: 'Do the rule once more.', meta: { k: 'g3pt-ext-tf', a: c.a, d: c.d, said: said } });
    }]
  ]);
  function tgExt(lv) {
    return function () {
      var c = extCase(lv), v = seq(c.a, c.d, 4), u = doIt(c.d);
      function st(j, prompt) { var f = {}; f[v[j - 2]] = 'Do the rule on ' + v[j - 2] + '.'; f[v[j - 2] - c.d] = 'The rule says ' + u + '.'; return { prompt: prompt, q: num('What is the ' + nth(j) + ' number?', v[j - 1], f, { hint: v[j - 2] + (c.d > 0 ? ' + ' : ' &minus; ') + Math.abs(c.d) + '.', meta: { k: 'g3pt-ext-nth', a: c.a, d: c.d, j: j } }) }; }
      return { q: rule(c.a, c.d) + '. Find the first 4 numbers.', fig: jumpLine(v, { hide: [1, 2, 3], diff: true }), done: v.join(', ') + '.', steps: [st(2, 'Start at ' + c.a + '. ' + cap(u) + ' once.'), st(3, cap(u) + ' again.'), st(4, 'One more time.')] };
    };
  }

  /* ---------- Find the rule ---------- */
  var RSTORY = [[1, 'cm', 'Theo measures his bean plant each week', 'How many centimetres does it grow each week?'], [1, '', 'Noor counts the pages she has read each day', 'How many pages does she read each day?'], [1, '$', 'Kai counts his savings each week', 'How many dollars does he save each week?'],
    [-1, 'cm', 'A candle burns down. Each hour it is', 'How many centimetres shorter is it each hour?'], [-1, '', 'Cookies left in the jar each day', 'How many cookies are eaten each day?'], [-1, 'L', 'Water left in a rain barrel each day', 'How many litres are used each day?']];
  function ruleWrongs(a, d, v) { return [[rule(a, d > 0 ? d + 1 : d - 1), 'Check the change between every pair of numbers.'], [rule(a, -d), 'Is it getting bigger or smaller?'], [rule(v[1], d), 'The rule starts at the first number.'], [rule(a, d > 0 ? Math.max(1, d - 1) : d + 1), 'Check the change again.']]; }
  skill('pt-rule', 'Find the rule', 'C1.1, C1.3', [
    [1, 'plain', function (lv) {
      var c = extCase(lv), v = seq(c.a, c.d, 5), f = {};
      f[v[1]] = 'That is a number in the pattern. How far is it from ' + v[0] + '?';
      return num('By how much does each number change? ' + math(v.join(', ')), Math.abs(c.d), f, { fig: jumpLine(v), hint: 'Find ' + v[1] + (c.d > 0 ? ' &minus; ' + v[0] : ' &minus; ' + v[1]) + '.',
        steps: [(c.d > 0 ? v[1] + ' &minus; ' + v[0] : v[0] + ' &minus; ' + v[1]) + ' = ' + Math.abs(c.d) + '.', 'Check the other jumps: the same.'], explain: 'It ' + (c.d > 0 ? 'goes up' : 'goes down') + ' by ' + Math.abs(c.d) + ' each time.', meta: { k: 'g3pt-rule-by', v: v } });
    }],
    [1, 'which', function (lv) {
      var c = extCase(lv), v = seq(c.a, c.d, 4);
      return mc('Which rule makes this pattern? ' + math(v.join(', ') + ', &hellip;'), rule(c.a, c.d), ruleWrongs(c.a, c.d, v), { fig: lv < 3 ? jumpLine(v) : '', hint: 'Look at the first number. Then the change.',
        steps: ['The first number is ' + c.a + '.', 'Each number is ' + Math.abs(c.d) + (c.d > 0 ? ' more.' : ' less.')], explain: rule(c.a, c.d) + '.', meta: { k: 'g3pt-rule-which', v: v } });
    }],
    [1, 'next', function (lv) {
      var c = extCase(lv), v = seq(c.a, c.d, lv === 3 ? 4 : 5), real = v[v.length - 1] + c.d, f = {};
      f[v[v.length - 1] - c.d] = 'Check: does the pattern go up or down?';
      return num('What comes next? ' + math(v.join(', ') + ', ___'), real, f, { hint: 'Find the change first.', steps: ['Each time: ' + doIt(c.d) + '.', v[v.length - 1] + (c.d > 0 ? ' + ' : ' &minus; ') + Math.abs(c.d) + ' = ' + real + '.'], explain: real + ' comes next.', meta: { k: 'g3pt-rule-next', v: v } });
    }],
    [2, 'fill', function (lv) {
      var c = extCase(lv), v = seq(c.a, c.d, 5);
      return { q: 'Write the rule for ' + math(v.join(', ')) + '.', type: 'fill', fill: 'Start at [[]], ' + (c.d > 0 ? 'add' : 'take away') + ' [[]] each time.', answers: [c.a, Math.abs(c.d)],
        hint: 'The start is the first number.', steps: ['Start at ' + c.a + '.', 'Each change: ' + Math.abs(c.d) + '.'], explain: rule(c.a, c.d) + '.', meta: { k: 'g3pt-rule-fill', v: v } };
    }],
    [1, 'story', function (lv) {
      var c = extCase(lv), s = R.pick(RSTORY.filter(function (x) { return x[0] === (c.d > 0 ? 1 : -1); })), v = seq(c.a, c.d, 4), u = s[1] === '$' ? '$' : '';
      return num(s[2] + ': ' + math(v.map(function (x) { return u + x + (s[1] && !u ? ' ' + s[1] : ''); }).join(', ')) + '. ' + s[3], Math.abs(c.d), {}, { fig: jumpLine(v, { diff: false }), hint: 'Find the change from one to the next.',
        steps: ['The change is ' + Math.abs(c.d) + ' every time.'], explain: Math.abs(c.d) + (s[1] && !u ? ' ' + s[1] : '') + ' each time.', meta: { k: 'g3pt-rule-by', v: v } });
    }],
    [2, 'tf', function (lv) {
      var c = extCase(lv), v = seq(c.a, c.d, 4), truth = coin(), who = Q.name(), w = R.pick(ruleWrongs(c.a, c.d, v).slice(0, 3)), said = truth ? rule(c.a, c.d) : w[0];
      return tf(who + ' says the rule for ' + math(v.join(', ')) + ' is <b>' + said.toLowerCase() + '</b>. True or false: ' + who + ' is right.', truth, 'The pattern starts at ' + c.a + ' and ' + (c.d > 0 ? 'goes up' : 'goes down') + ' by ' + Math.abs(c.d) + ' each time.',
        ['Look only at the first two numbers.', 'Every pattern adds 1.', 'The rule starts at the last number.'], truth ? 'Check every pair: the change is the same.' : (w[1]), { hint: 'Check the start and every change.', meta: { k: 'g3pt-rule-tf', v: v, said: plain(said) } });
    }]
  ]);
  function tgRule(lv) {
    return function () {
      var c = extCase(lv), v = seq(c.a, c.d, 5), f = {};
      f[v[1]] = 'That is the next number. Find the change from ' + v[0] + '.';
      return { q: 'Find the rule: ' + math(v.join(', ')), fig: jumpLine(v), done: rule(c.a, c.d) + '.', steps: [
        { prompt: 'Look at the first jump.', q: num(v[0] + ' to ' + v[1] + ': by how much does it change?', Math.abs(c.d), f, { hint: 'Count up from the smaller number.', meta: { k: 'g3pt-rule-pair', a: v[0], b: v[1] } }) },
        { prompt: 'Bigger or smaller each time?', q: fixed('Does the pattern go up or down?', ['It goes up', 'It goes down', 'It stays the same'], c.d > 0 ? 0 : 1, ['Look again: the numbers get smaller.', 'Look again: the numbers get bigger.', 'The numbers change.'], { hint: 'Compare ' + v[0] + ' and ' + v[4] + '.', meta: { k: 'g3pt-rule-dir', v: v } }) },
        { prompt: 'Put the start and the change together.', q: mc('Which rule is it?', rule(c.a, c.d), ruleWrongs(c.a, c.d, v), { hint: 'Start at the first number.', meta: { k: 'g3pt-rule-which', v: v } }) }
      ] };
    };
  }

  /* ---------- Patterns to 1000 ---------- */
  function bigCase(lv, d, up) {
    d = d || (lv === 1 ? R.pick([10, 100]) : lv === 2 ? R.pick([10, 20, 50, 100]) : R.pick([25, 50, 75, 125, 150, 200]));
    up = up == null ? lv === 1 || coin() : up;
    var n = d >= 125 ? 4 : 6, a = up ? R.int(100, 1000 - d * (n - 1)) : R.int(100 + d * (n - 1), 999);
    return { a: a, d: up ? d : -d, n: n };
  }
  /* d of 1, 10 or 100 that never carries into the next digit */
  function digitCase(lv, d) {
    d = d || R.pick(lv === 1 ? [10, 100] : [1, 10, 100]);
    var up = lv === 1 || coin(), a;
    do { a = R.int(100, 999); } while (up ? (d === 100 ? a > 599 : Math.floor(a / d) % 10 > 5) : (d === 100 ? a < 400 : Math.floor(a / d) % 10 < 4));
    return { a: a, d: up ? d : -d };
  }
  var PLACE = ['The hundreds digit', 'The tens digit', 'The ones digit'];
  function digitAsk(q, c, x) {
    var at = Math.abs(c.d) === 100 ? 0 : Math.abs(c.d) === 10 ? 1 : 2;
    return fixed(q, PLACE, at, PLACE.map(function (p, j) { return j < at ? 'Look again: that digit stays the same.' : 'Look again: compare the digits one place at a time.'; }), put({ meta: { k: 'g3pt-big-digit', v: seq(c.a, c.d, 4) } }, x));
  }
  skill('pt-big', 'Patterns to 1000', 'C1.4', [
    [1, 'plain', function (lv) {
      var c = bigCase(lv), v = seq(c.a, c.d, 4), real = c.a + c.d * 4, f = {};
      f[real - 2 * c.d] = 'That is already in the pattern.';
      return num('What comes next? ' + math(v.join(', ') + ', ___'), real, f, { fig: jumpLine(v.concat([real]), { hide: [4] }), hint: 'Find the change. Then do it once more.', steps: ['Each time: ' + doIt(c.d) + '.', v[3] + (c.d > 0 ? ' + ' : ' &minus; ') + Math.abs(c.d) + ' = ' + real + '.'], explain: real + '.', meta: { k: 'g3pt-big-next', v: v } });
    }],
    [1, 'fill', function (lv) {
      var c = bigCase(lv), v = seq(c.a, c.d, c.n), g = R.shuffle(seq(1, 1, c.n - 1)).slice(0, 2).sort();
      return { q: rule(c.a, c.d) + '. Fill in the missing numbers.', type: 'fill', fill: math(v.map(function (x, i) { return g.indexOf(i) >= 0 ? '[[]]' : x; }).join(', ')), answers: g.map(function (i) { return v[i]; }),
        hint: cap(doIt(c.d)) + ' each time.', steps: [v.join(', ') + '.'], explain: v.join(', ') + '.', meta: { k: 'g3pt-big-fill', a: c.a, d: c.d, gaps: g } };
    }],
    [2, 'nth', function (lv) {
      var c = bigCase(lv), j = c.n, v = seq(c.a, c.d, j), f = {};
      f[c.a + c.d * j] = 'One jump too many: the start is the 1st number.';
      return num(rule(c.a, c.d) + '. What is the <b>' + nth(j) + '</b> number?', v[j - 1], f, { fig: jumpLine(v, { hide: seq(1, 1, j - 1), diff: true }), hint: 'Make ' + (j - 1) + ' jumps from ' + c.a + '.', steps: [v.join(', ') + '.'], explain: 'The ' + nth(j) + ' number is ' + v[j - 1] + '.', meta: { k: 'g3pt-big-nth', a: c.a, d: c.d, j: j } });
    }],
    [1, 'digit', function (lv) {
      var c = digitCase(lv), v = seq(c.a, c.d, 4);
      return digitAsk('Look at ' + math(v.join(', ')) + '. Which digit changes each time?', c, { hint: 'Compare ' + v[0] + ' and ' + v[1] + ', one digit at a time.', steps: ['Only one digit changes: the pattern ' + doIt(c.d) + '.'], explain: 'The pattern ' + doIt(c.d) + ' each time.' });
    }],
    [1, 'line', function (lv) {
      var d = R.pick(lv === 1 ? [10, 100] : [25, 50, 100]), a = R.int(1, Math.floor((1000 - 6 * d) / 10)) * 10, j = R.int(3, 6);
      return { q: 'Start at ' + a + ', add ' + d + '. Put the marker on the <b>' + nth(j) + '</b> number.', type: 'line', min: a, max: a + 6 * d, tick: d, every: 2 * d, snap: d, answer: a + d * (j - 1),
        hint: 'Each jump adds ' + d + '.', steps: [seq(a, d, j).join(', ') + '.'], explain: 'The ' + nth(j) + ' number is ' + (a + d * (j - 1)) + '.', meta: { k: 'g3pt-big-line', a: a, d: d, j: j } };
    }],
    [2, 'tf', function (lv) {
      var c = bigCase(lv), k = c.n - 1 + R.int(0, 2), truth = coin(), b = c.a + c.d * k, who = Q.name();
      if (b < 0 || b > 1000) { k = c.n - 1; b = c.a + c.d * k; }
      if (!truth) { b += R.pick([1, 3, 5, -3, 10, -10]); if ((b - c.a) % c.d === 0) b += 1; }
      return tf(rule(c.a, c.d) + '. ' + who + ' says <b>' + b + '</b> is in the pattern. True or false: ' + who + ' is right.', truth, truth ? b + ' is ' + k + ' jumps of ' + Math.abs(c.d) + ' from ' + c.a + '.' : b + ' is not a whole number of jumps of ' + Math.abs(c.d) + ' from ' + c.a + '.',
        ['Every number between ' + c.a + ' and 1000 is in the pattern.', 'Only the first number is in the pattern.', 'A pattern can skip its own rule.'], 'Keep jumping by ' + Math.abs(c.d) + ' from ' + c.a + ' and see if you land on ' + b + '.',
        { hint: 'List the pattern: ' + seq(c.a, c.d, 3).join(', ') + ', &hellip;', meta: { k: 'g3pt-big-in', a: c.a, d: c.d, b: b } });
    }]
  ]);
  function tgBig(d, up) {
    return function () {
      var c = digitCase(2, d), f = {};
      if (up != null) c = { a: up ? Math.abs(c.a) : c.a, d: up ? d : -d };
      if (up === false) { do { c.a = R.int(400, 999); } while (d === 10 && Math.floor(c.a / 10) % 10 < 4); }
      if (up === true && d === 10) { do { c.a = R.int(100, 999); } while (Math.floor(c.a / 10) % 10 > 5); }
      if (up === true && d === 100) c.a = R.int(100, 599);
      var v = seq(c.a, c.d, 4);
      f[c.a + c.d * 4] = 'One jump too many.';
      return { q: rule(c.a, c.d) + '. Find the 4th number.', fig: jumpLine(v, { hide: [1, 2, 3], diff: true }), done: v.join(', ') + '.', steps: [
        { prompt: cap(doIt(c.d)) + ' once.', q: num('What is the 2nd number?', v[1], {}, { hint: c.a + (c.d > 0 ? ' + ' : ' &minus; ') + d + '.', meta: { k: 'g3pt-big-nth', a: c.a, d: c.d, j: 2 } }) },
        { prompt: 'Compare ' + v[0] + ' and ' + v[1] + '.', q: digitAsk('Which digit changed?', c, { hint: 'Look at each place.' }) },
        { prompt: 'Change only that digit, two more times.', q: num('What is the 4th number?', v[3], f, { hint: v[1] + ', then ' + v[2] + '.', meta: { k: 'g3pt-big-nth', a: c.a, d: c.d, j: 4 } }) }
      ] };
    };
  }

  /* ---------- Tables of values ---------- */
  function tabCase(lv) { return lv === 1 ? { a: R.int(1, 4), d: R.int(1, 3) } : lv === 2 ? { a: R.int(2, 6), d: R.int(2, 4) } : { a: R.int(3, 8), d: R.int(3, 5) }; }
  function tiles(c, f) { return c.a + c.d * (f - 1); }
  skill('pt-table', 'Tables of values', 'C1.2, C1.3', [
    [1, 'plain', function (lv) {
      var c = tabCase(lv), fs = [1, 2, 3, 4, 5], g = lv === 1 ? [3, 4] : R.shuffle([2, 3, 4]).slice(0, 2).sort();
      return { q: 'The figures grow the same way each time. Fill in the table.', type: 'fill', fig: figs(c.a, c.d, 3) + tabHtml(['Figure', 'Tiles'], fs, fs.map(function (f) { return tiles(c, f); }), g),
        fill: g.map(function (i) { return 'Figure ' + fs[i] + ': [[]] tiles'; }).join('<br>'), answers: g.map(function (i) { return tiles(c, fs[i]); }),
        hint: 'Each figure has ' + c.d + ' more tiles.', steps: ['Start at ' + c.a + ', add ' + c.d + '.', fs.map(function (f) { return tiles(c, f); }).join(', ') + '.'], explain: fs.map(function (f) { return tiles(c, f); }).join(', ') + '.', meta: { k: 'g3pt-tab-fill', a: c.a, d: c.d, gaps: g.map(function (i) { return fs[i]; }) } };
    }],
    [1, 'far', function (lv) {
      var c = tabCase(lv), f = lv === 1 ? R.int(4, 5) : lv === 2 ? R.int(6, 8) : R.int(9, 15), w = {};
      w[c.a + c.d * f] = 'One figure too many: figure 1 already has ' + c.a + '.';
      w[c.d * f] = 'Figure 1 starts with ' + c.a + ' tiles, not ' + c.d + '.';
      return num('How many tiles will <b>figure ' + f + '</b> have?', tiles(c, f), w, { fig: figs(c.a, c.d, 3), hint: 'Start at ' + c.a + '. Add ' + c.d + ' for each new figure.',
        steps: ['Figure 1: ' + c.a + '. Each figure adds ' + c.d + '.', 'Figure ' + f + ': ' + c.a + ' + ' + (f - 1) + ' &times; ' + c.d + ' = ' + tiles(c, f) + '.'], explain: 'Figure ' + f + ' has ' + tiles(c, f) + ' tiles.', meta: { k: 'g3pt-tab-num', a: c.a, d: c.d, f: f } });
    }],
    [2, 'rule', function (lv) {
      var c = tabCase(lv), fs = [1, 2, 3, 4], W = [[rule(c.a, c.d + 1), 'Check how many tiles each figure adds.'], [rule(c.d, c.a), 'Swapped: start with figure 1.'], [rule(c.a + c.d, c.d), 'Figure 1 is the start.'], [rule(c.a, Math.max(1, c.d - 1)), 'Check the change again.']].filter(function (w) { return w[0] !== rule(c.a, c.d); });
      return mc('Which rule matches the table?', rule(c.a, c.d), W, { fig: tabHtml(['Figure', 'Tiles'], fs, fs.map(function (f) { return tiles(c, f); }), []), hint: 'Start: figure 1. Change: from one figure to the next.',
        steps: ['Figure 1 has ' + c.a + '.', 'Each figure adds ' + c.d + '.'], explain: rule(c.a, c.d) + '.', meta: { k: 'g3pt-tab-rule', a: c.a, d: c.d } });
    }],
    [2, 'back', function (lv) {
      var c = tabCase(lv), f = lv === 2 ? R.int(4, 7) : R.int(8, 14), t = tiles(c, f);
      return num('Which figure will have <b>' + t + '</b> tiles?', f, {}, { fig: figs(c.a, c.d, 3), hint: 'Keep adding ' + c.d + ' from ' + c.a + ' until you reach ' + t + '.',
        steps: [seq(c.a, c.d, Math.min(f, 8)).join(', ') + (f > 8 ? ', &hellip;' : '') + '.', t + ' is number ' + f + ' in the list.'], explain: 'Figure ' + f + '.', meta: { k: 'g3pt-tab-rev', a: c.a, d: c.d, t: t } });
    }],
    [1, 'tf', function (lv) {
      var c = tabCase(lv), f = lv === 1 ? 4 : R.int(5, lv === 3 ? 12 : 7), truth = coin(), said = truth ? tiles(c, f) : R.pick([c.d * f, c.a + c.d * f, tiles(c, f) + 1]), who = Q.name();
      if (!truth && said === tiles(c, f)) said += c.d;
      return tf(who + ' says <b>figure ' + f + '</b> will have <b>' + said + '</b> tiles. True or false: ' + who + ' is right.', truth, 'Figure ' + f + ': ' + c.a + ' + ' + (f - 1) + ' &times; ' + c.d + ' = ' + tiles(c, f) + '.',
        ['Multiply the figure number by the tiles added.', 'Every figure has the same number of tiles.', 'Add the figure number to ' + c.a + '.'], 'Start at ' + c.a + '. Add ' + c.d + ' for each new figure.',
        { fig: figs(c.a, c.d, 3), hint: 'Figure 1 has ' + c.a + ' tiles.', meta: { k: 'g3pt-tab-tf', a: c.a, d: c.d, f: f, said: said } });
    }]
  ]);
  function tgTable(lv) {
    return function () {
      var c = tabCase(lv), f = 3 + lv, f1 = {}, f3 = {};
      f1[c.a + c.d] = 'That is figure 2. Count figure 1.';
      f3[c.a + c.d * f] = 'Figure 1 is the start, so make ' + (f - 1) + ' jumps.';
      return { q: 'How many tiles will figure ' + f + ' have?', fig: figs(c.a, c.d, 3), done: 'Figure ' + f + ' has ' + tiles(c, f) + ' tiles.', steps: [
        { prompt: 'Count the tiles in figure 1.', q: num('How many tiles in figure 1?', c.a, f1, { hint: 'The first figure on the left.', meta: { k: 'g3pt-tab-num', a: c.a, d: c.d, f: 1 } }) },
        { prompt: 'Compare figure 1 and figure 2.', q: num('How many tiles are added each time?', c.d, {}, { hint: 'Count the light tiles in figure 2.', meta: { k: 'g3pt-tab-add', a: c.a, d: c.d } }) },
        { prompt: 'Start at ' + c.a + ', add ' + c.d + ' for each new figure.', q: num('How many tiles in figure ' + f + '?', tiles(c, f), f3, { hint: seq(c.a, c.d, 3).join(', ') + ', &hellip;', meta: { k: 'g3pt-tab-num', a: c.a, d: c.d, f: f } }) }
      ] };
    };
  }

  /* ---------- Repeating or growing? ---------- */
  var KINDS = ['Repeating', 'Growing', 'Shrinking'];
  function kindCase(lv, kind) {
    kind = kind || R.pick(['rep', 'grow', 'shrink']);
    if (kind === 'rep') {
      var L = R.int(2, 3), core = R.shuffle(lv === 1 ? [1, 2, 3, 4, 5, 6] : lv === 2 ? [2, 4, 5, 6, 8, 10, 12] : [12, 15, 25, 30, 40, 50, 60]).slice(0, L), v = [];
      for (var i = 0; i < 7; i++) v.push(core[i % L]);
      return { kind: kind, v: v, L: L };
    }
    var d = lv === 1 ? R.int(1, 4) : lv === 2 ? R.int(2, 6) : R.int(5, 15), a = kind === 'grow' ? R.int(1, lv === 3 ? 40 : 6) : d * 7 + R.int(1, lv === 3 ? 30 : 5);
    return { kind: kind, v: seq(a, kind === 'grow' ? d : -d, 7), d: kind === 'grow' ? d : -d };
  }
  function kindAt(c, p) { return c.kind === 'rep' ? c.v[(p - 1) % c.L] : c.v[0] + c.d * (p - 1); }
  function kindWhy(c) { return c.kind === 'rep' ? 'The part ' + c.v.slice(0, c.L).join(', ') + ' repeats.' : 'Each number is ' + Math.abs(c.d) + (c.d > 0 ? ' more' : ' less') + ' than the one before.'; }
  function kindAsk(q, c, x) { var a = ['rep', 'grow', 'shrink'].indexOf(c.kind); return fixed(q, KINDS, a, ['Look for a part that comes back again.', 'Does each number get bigger?', 'Does each number get smaller?'], put({ meta: { k: 'g3pt-kind-mc', v: c.v } }, x)); }
  skill('pt-kind', 'Repeating or growing?', 'C1.1, C1.3', [
    [1, 'plain', function (lv) {
      var c = kindCase(lv), v = c.v.slice(0, 6);
      return kindAsk('What kind of pattern is ' + math(v.join(', ') + ', &hellip;') + '?', c, { fig: lv < 3 ? towers(v) : '', hint: 'Does a part come back, or does each number change by the same amount?', steps: [kindWhy(c)], explain: kindWhy(c) });
    }],
    [1, 'next', function (lv) {
      var c = kindCase(lv), v = c.v.slice(0, 6), f = {};
      if (c.kind === 'rep') f[v[5] + (v[5] - v[4])] = 'This pattern repeats. Which number comes back?'; else f[v[0]] = 'This pattern does not repeat. Find the change.';
      return num('What comes next? ' + math(v.join(', ') + ', ___'), c.v[6], f, { fig: lv < 3 ? towers(c.v, 6) : '', hint: 'Is it repeating, growing or shrinking?', steps: [kindWhy(c), 'Next: ' + c.v[6] + '.'], explain: c.v[6] + ' comes next.', meta: { k: 'g3pt-kind-next', v: v } });
    }],
    [2, 'far', function (lv) {
      var c = kindCase(lv), v = c.v.slice(0, 6), p = lv === 2 ? R.int(9, 12) : R.int(15, 25);
      return num('The pattern keeps going: ' + math(v.join(', ') + ', &hellip;') + ' What is the <b>' + nth(p) + '</b> number?', kindAt(c, p), {}, { hint: c.kind === 'rep' ? 'Count by cores of ' + c.L + '.' : 'Make ' + (p - 1) + ' jumps from ' + c.v[0] + '.',
        steps: [kindWhy(c), c.kind === 'rep' ? 'Number ' + p + ' is number ' + ((p - 1) % c.L + 1) + ' of the core.' : c.v[0] + (c.d > 0 ? ' + ' : ' &minus; ') + (p - 1) + ' &times; ' + Math.abs(c.d) + ' = ' + kindAt(c, p) + '.'], explain: 'The ' + nth(p) + ' number is ' + kindAt(c, p) + '.', meta: { k: 'g3pt-kind-far', v: v, p: p } });
    }],
    [1, 'fill', function (lv) {
      var c = kindCase(lv), g = R.shuffle([2, 3, 4, 5, 6]).slice(0, 2).sort();
      return { q: 'Fill in the missing numbers.', type: 'fill', fill: math(c.v.map(function (x, i) { return g.indexOf(i) >= 0 ? '[[]]' : x; }).join(', ')), answers: g.map(function (i) { return c.v[i]; }),
        hint: 'Repeating, growing or shrinking?', steps: [kindWhy(c), c.v.join(', ') + '.'], explain: c.v.join(', ') + '.', meta: { k: 'g3pt-kind-fill', v: c.v, gaps: g } };
    }],
    [2, 'tf', function (lv) {
      var c = kindCase(lv), v = c.v.slice(0, 6), truth = coin(), real = ['rep', 'grow', 'shrink'].indexOf(c.kind), said = truth ? real : (real + R.int(1, 2)) % 3, who = Q.name();
      return tf(who + ' says ' + math(v.join(', ') + ', &hellip;') + ' is a <b>' + KINDS[said].toLowerCase() + '</b> pattern. True or false: ' + who + ' is right.', truth, kindWhy(c),
        ['Any pattern with big numbers is growing.', 'A pattern that goes up and down is growing.', 'Every pattern repeats.'], 'Does a part come back, or is there the same change each time?', { fig: lv < 3 ? towers(v) : '', hint: 'Look at the change from one number to the next.', meta: { k: 'g3pt-kind-tf', v: v, said: KINDS[said] } });
    }],
    [2, 'pick', function (lv) {
      var want = R.pick(['rep', 'grow']), ks = R.shuffle([want, want === 'rep' ? 'grow' : 'rep', R.pick(['rep', 'grow', 'shrink']), R.pick(['shrink', 'grow', 'rep'])]), lists = [], ans = [];
      ks.forEach(function (k) { var v, g = 0; do { v = kindCase(lv, k).v.slice(0, 6); } while (lists.some(function (u) { return u.join() === v.join(); }) && g++ < 20); lists.push(v); });
      ks.forEach(function (k, j) { if (k === want) ans.push(j); });
      return { q: 'Pick every <b>' + (want === 'rep' ? 'repeating' : 'growing') + '</b> pattern.', type: 'pick', options: lists.map(function (v) { return v.join(', ') + ', &hellip;'; }), answer: ans,
        hint: want === 'rep' ? 'Look for a part that comes back.' : 'Look for numbers that get bigger by the same amount.', steps: ['Check each list on its own.'], explain: ans.map(function (j) { return lists[j].join(', '); }).join(' and ') + '.', meta: { k: 'g3pt-kind-pick', want: want, lists: lists } };
    }]
  ]);
  function tgKind(kind) {
    return function () {
      var c = kindCase(2, kind), v = c.v.slice(0, 6), f = {};
      f[c.kind === 'rep' ? v[5] + (v[5] - v[4]) : v[0]] = 'Use the kind of pattern you found.';
      return { q: 'What comes next? ' + math(v.join(', ') + ', ___'), fig: towers(c.v, 6), done: kindWhy(c) + ' Next: ' + c.v[6] + '.', steps: [
        { prompt: 'Does a part come back, or does each number change by the same amount?', q: kindAsk('What kind of pattern is it?', c, { hint: 'Look at the towers.' }) },
        { prompt: c.kind === 'rep' ? 'Say the core again.' : 'Make the same change once more.', q: num('What comes next?', c.v[6], f, { hint: kindWhy(c), meta: { k: 'g3pt-kind-next', v: v } }) }
      ] };
    };
  }

  /* ======================= Lesson 3: Variables ======================= */
  function varCase(lv) {
    var op = lv === 1 ? '+' : lv === 2 ? R.pick(['+', '-', 'x']) : R.pick(['+', '-', 'x', '/']), k, n;
    if (op === '+') { if (lv === 3) { n = R.int(20, 600); k = R.int(15, 350); } else { n = R.int(2, lv === 1 ? 20 : 50); k = R.int(2, 15); } }
    else if (op === '-') { k = R.int(lv === 3 ? 15 : 2, lv === 3 ? 90 : 12); n = k + R.int(lv === 3 ? 20 : 3, lv === 3 ? 400 : 40); }
    else if (op === 'x') { k = lv === 2 ? R.pick([2, 5, 10]) : R.int(2, 10); n = R.int(1, 10); }
    else { k = R.pick([2, 5, 10]); n = k * R.int(2, 10); }
    return { op: op, k: k, n: n, r: calc(n, op, k) };
  }
  function eqn(c, box) { var v = box ? '&#9633;' : 'n'; return c.op === 'x' ? c.k + ' &times; ' + v + ' = ' + c.r : v + ' ' + OPS[c.op] + ' ' + c.k + ' = ' + c.r; }
  function eqU(c) { return c.op === 'x' ? c.k + ' × n' : 'n ' + UNI[c.op] + ' ' + c.k; }
  function factTxt(c) { return c.op === '+' ? c.r + ' &minus; ' + c.k : c.op === '-' ? c.r + ' + ' + c.k : c.op === 'x' ? c.r + ' &divide; ' + c.k : c.r + ' &times; ' + c.k; }
  function varFix(c) { var f = {}; f[c.op === '+' || c.op === 'x' ? c.r + c.k : c.r - c.k] = c.op === '+' ? 'Not add: what plus ' + c.k + ' makes ' + c.r + '?' : c.op === '-' ? 'Not take away: n is ' + c.k + ' more than ' + c.r + '.' : 'Use the related fact: ' + factTxt(c) + '.'; return f; }
  var VSTORY = { '+': ['{w} had some marbles. {w} got {k} more and now has {r}.', 'n + {k} = {r}'], '-': ['{w} had some stickers. {w} gave away {k} and has {r} left.', 'n &minus; {k} = {r}'],
    x: ['{w} has {k} bags with the same number of apples in each. That is {r} apples.', '{k} &times; n = {r}'], '/': ['{w} shares some berries equally into {k} bowls. Each bowl gets {r}.', 'n &divide; {k} = {r}'] };
  function vfill(t, c, w) { return t.replace(/\{w\}/g, w).replace(/\{k\}/g, c.k).replace(/\{r\}/g, c.r); }
  skill('pt-var', 'A letter for a number', 'C2.1', [
    [1, 'plain', function (lv) {
      var c = varCase(lv);
      return num('Find n: ' + math(eqn(c)), c.n, varFix(c), { fig: lv < 3 ? balance(eqU(c), String(c.r), 0) : '', hint: 'Use a related fact: ' + factTxt(c) + '.',
        steps: [factTxt(c) + ' = ' + c.n + '.', 'Check: ' + eqn(c).replace('n', c.n) + '.'], explain: 'n = ' + c.n + '.', meta: { k: 'g3pt-var-n', op: c.op, c: c.k, r: c.r } });
    }],
    [1, 'box', function (lv) {
      var c = varCase(lv);
      return num('What number goes in the box? ' + math(eqn(c, true)), c.n, varFix(c), { hint: 'The box is like a letter. Use ' + factTxt(c) + '.', steps: [factTxt(c) + ' = ' + c.n + '.'], explain: 'The box is ' + c.n + '.', meta: { k: 'g3pt-var-n', op: c.op, c: c.k, r: c.r } });
    }],
    [1, 'story', function (lv) {
      var c = varCase(lv), w = Q.name(), s = VSTORY[c.op];
      return num(vfill(s[0], c, w) + ' So ' + math(vfill(s[1], c, w)) + '. What is n?', c.n, varFix(c), { hint: 'n is the number you do not know. Use ' + factTxt(c) + '.',
        steps: [factTxt(c) + ' = ' + c.n + '.', 'Check: ' + vfill(s[1], c, w).replace('n', c.n) + '.'], explain: 'n = ' + c.n + '.', meta: { k: 'g3pt-var-n', op: c.op, c: c.k, r: c.r } });
    }],
    [2, 'write', function (lv) {
      var c = varCase(lv); if (c.op !== '+' && c.op !== '-') c = { op: '+', k: R.int(3, 30), n: R.int(5, 60) }, c.r = c.n + c.k;
      var w = Q.name();
      return { q: vfill(VSTORY[c.op][0], c, w) + ' Write an equation, with n for the number ' + w + ' had at first.', type: 'fill', fill: math('n ' + OPS[c.op] + ' [[]] = [[]]'), answers: [c.k, c.r],
        hint: 'n is the start. Then what happened? Then what is left?', steps: ['Start: n. ' + (c.op === '+' ? 'Got ' : 'Gave away ') + c.k + '. Now: ' + c.r + '.'], explain: 'n ' + OPS[c.op] + ' ' + c.k + ' = ' + c.r + '.', meta: { k: 'g3pt-var-write', op: c.op, c: c.k, r: c.r } };
    }],
    [2, 'match', function (lv) {
      var eqs = [], seen = {};
      while (eqs.length < 3) { var c = varCase(lv); if (seen[c.n]) continue; seen[c.n] = 1; eqs.push(c); }
      return { q: 'Match each equation to its value of n.', type: 'match', pairs: eqs.map(function (c) { return [math(eqn(c)), 'n = ' + c.n]; }), hint: 'Try each value in place of n.',
        steps: ['For n + 4 = 9, ask: what plus 4 makes 9? It is 5.'], explain: eqs.map(function (c) { return eqn(c) + ': n = ' + c.n; }).join('. ') + '.', meta: { k: 'g3pt-var-match', eqs: eqs.map(function (c) { return [c.op, c.k, c.r]; }) } };
    }],
    [2, 'tf', function (lv) {
      var c = varCase(lv), truth = coin(), said = truth ? c.n : c.n + R.pick([1, 2, -1, c.k]);
      if (!truth && said === c.n) said++;
      return tf('True or false: <b>n = ' + said + '</b> makes ' + math(eqn(c)) + ' true.', truth, factTxt(c) + ' = ' + c.n + ', so n = ' + c.n + '.',
        ['n is always the biggest number.', 'n is always 1.', 'You cannot check a letter.'], 'Put ' + said + ' in place of n and work it out.', { hint: 'Put ' + said + ' in place of n.', meta: { k: 'g3pt-var-tf', op: c.op, c: c.k, r: c.r, said: said } });
    }]
  ]);
  /* the other facts made from r and k, leaving out any that gives n by chance (like 4 &minus; 2 and 4 &divide; 2) or is not a whole number */
  function factOpts(c) { return ['+', '-', 'x', '/'].map(function (o) { return [c.r + ' ' + OPS[o] + ' ' + c.k, calc(c.r, o, c.k)]; }).filter(function (o) { return o[0] !== factTxt(c) && o[1] !== c.n && o[1] % 1 === 0; }); }
  function tgVar(lv) {
    return function () {
      var c = varCase(lv), right = factTxt(c), f = {};
      f[c.n] = 'That is n. Put it in and work out ' + eqU(c).replace('n', c.n) + '.';
      return { q: 'Find n: ' + math(eqn(c)), fig: balance(eqU(c), String(c.r), 0), done: 'n = ' + c.n + '.', steps: [
        { prompt: 'Think of a related fact that finds n.', q: mc('Which fact finds n?', right, factOpts(c).map(function (o) { return [o[0], 'Undo ' + OPS[c.op] + ' ' + c.k + ': do the opposite.']; }), { hint: 'Do the opposite of ' + OPS[c.op] + '.', meta: { k: 'g3pt-var-fact', op: c.op, c: c.k, r: c.r } }) },
        { prompt: 'Work out that fact.', q: num(right + ' = ?', c.n, varFix(c), { hint: right + '.', meta: { k: 'g3pt-var-n', op: c.op, c: c.k, r: c.r } }) },
        { prompt: 'Check: put ' + c.n + ' in place of n.', q: num(math(eqn(c).split(' = ')[0].replace(/n/, c.n)) + ' = ?', c.r, f, { hint: 'Work it out.', meta: { k: 'g3pt-var-check', op: c.op, c: c.k, n: c.n } }) }
      ] };
    };
  }

  /* ---------- Number machines ---------- */
  function machCase(lv) {
    var op = lv === 1 ? '+' : lv === 2 ? R.pick(['+', '-', 'x']) : R.pick(['+', '-', 'x']), k;
    if (op === 'x') k = lv === 2 ? R.pick([2, 5, 10]) : R.int(3, 9);
    else k = lv === 3 ? R.int(11, 90) : R.int(2, 10);
    return { op: op, k: k };
  }
  function inFor(c, lv) { return c.op === 'x' ? R.int(1, 10) : c.op === '-' ? c.k + R.int(lv === 3 ? 5 : 0, lv === 3 ? 60 : 12) : R.int(lv === 3 ? 10 : 1, lv === 3 ? 90 : 12); }
  function machFix(c, n) { var f = {}; f[c.op === 'x' ? n + c.k : n * c.k] = c.op === 'x' ? 'This machine multiplies.' : 'This machine ' + (c.op === '+' ? 'adds.' : 'takes away.'); return f; }
  skill('pt-machine', 'Number machines', 'C2.1, C1.2', [
    [1, 'plain', function (lv) {
      var c = machCase(lv), n = inFor(c, lv), out = calc(n, c.op, c.k);
      return num('The rule is ' + math(ruleTxt(c.op, c.k)) + '. ' + n + ' goes in. What comes out?', out, machFix(c, n), { fig: machine(c.op, c.k, n, '?'), hint: 'Put ' + n + ' in place of n.',
        steps: [ruleTxt(c.op, c.k).replace('n', n) + ' = ' + out + '.'], explain: out + ' comes out.', meta: { k: 'g3pt-mach-out', op: c.op, c: c.k, n: n } });
    }],
    [1, 'fill', function (lv) {
      var c = machCase(lv), ins = [], o;
      while (ins.length < 4) { o = inFor(c, lv); if (ins.indexOf(o) < 0) ins.push(o); }
      ins.sort(function (a, b) { return a - b; });
      var g = R.shuffle([0, 1, 2, 3]).slice(0, 2).sort();
      return { q: 'The rule is ' + math(ruleTxt(c.op, c.k)) + '. Fill in the table.', type: 'fill', fig: tabHtml(['n', ruleTxt(c.op, c.k)], ins, ins.map(function (v) { return calc(v, c.op, c.k); }), g),
        fill: g.map(function (i) { return 'n = ' + ins[i] + ': [[]]'; }).join('<br>'), answers: g.map(function (i) { return calc(ins[i], c.op, c.k); }),
        hint: 'Put each number in place of n.', steps: g.map(function (i) { return ruleTxt(c.op, c.k).replace('n', ins[i]) + ' = ' + calc(ins[i], c.op, c.k) + '.'; }), explain: 'Each output follows ' + ruleTxt(c.op, c.k) + '.', meta: { k: 'g3pt-mach-fill', op: c.op, c: c.k, ins: g.map(function (i) { return ins[i]; }) } };
    }],
    [2, 'in', function (lv) {
      var c = machCase(lv), n = inFor(c, lv), out = calc(n, c.op, c.k), f = {};
      f[calc(out, c.op, c.k)] = 'Work backwards: undo the rule.';
      return num('The rule is ' + math(ruleTxt(c.op, c.k)) + '. <b>' + out + '</b> comes out. What went in?', n, f, { fig: machine(c.op, c.k, '?', out), hint: 'What number, ' + (c.op === 'x' ? 'times ' + c.k : c.op === '+' ? 'plus ' + c.k : 'take away ' + c.k) + ', makes ' + out + '?',
        steps: [(c.op === '+' ? out + ' &minus; ' + c.k : c.op === '-' ? out + ' + ' + c.k : out + ' &divide; ' + c.k) + ' = ' + n + '.'], explain: n + ' went in.', meta: { k: 'g3pt-mach-in', op: c.op, c: c.k, out: out } });
    }],
    [2, 'rule', function (lv) {
      var c = machCase(lv), ins = [], o;
      while (ins.length < 4) { o = inFor(c, lv); if (ins.indexOf(o) < 0) ins.push(o); }
      ins.sort(function (a, b) { return a - b; });
      var outs = ins.map(function (v) { return calc(v, c.op, c.k); }), right = ruleTxt(c.op, c.k);
      var cand = [['+', c.k + 1], ['x', c.k], ['+', c.k], ['-', c.k], ['+', outs[0] - ins[0] + 1], ['x', c.k === 2 ? 3 : 2], ['+', c.k * 2]].map(function (r) { return r; }).filter(function (r) {
        return ruleTxt(r[0], r[1]) !== right && r[1] > 0 && !ins.every(function (v, i) { return calc(v, r[0], r[1]) === outs[i]; });
      });
      return mc('Which rule matches the table?', math(right), cand.map(function (r) { return [math(ruleTxt(r[0], r[1])), 'Try it on every column. It does not work for all of them.']; }), { fig: tabHtml(['n', 'out'], ins, outs, []),
        hint: 'Try each rule on the first column, then another.', steps: ['n = ' + ins[0] + ': ' + right.replace('n', ins[0]) + ' = ' + outs[0] + '.', 'n = ' + ins[2] + ': ' + right.replace('n', ins[2]) + ' = ' + outs[2] + '.'], explain: 'The rule is ' + right + '.', meta: { k: 'g3pt-mach-rule', ins: ins, outs: outs } });
    }],
    [1, 'tf', function (lv) {
      var c = machCase(lv), n = inFor(c, lv), out = calc(n, c.op, c.k), truth = coin(), said = truth ? out : c.op === 'x' ? n + c.k : c.op === '+' ? n * c.k : out + 2, who = Q.name();
      if (!truth && said === out) said = out + 1;
      return tf('The rule is ' + math(ruleTxt(c.op, c.k)) + '. ' + who + ' says <b>' + n + '</b> in gives <b>' + said + '</b> out. True or false?', truth, ruleTxt(c.op, c.k).replace('n', n) + ' = ' + out + '.',
        ['Write n and the number side by side.', 'The output is always bigger than 20.', 'The output is the same as the input.'], 'Put ' + n + ' in place of n.', { fig: machine(c.op, c.k, n, '?'), hint: 'Put ' + n + ' in place of n.', meta: { k: 'g3pt-mach-tf', op: c.op, c: c.k, n: n, said: said } });
    }]
  ]);
  function tgMach(lv) {
    return function () {
      var c = machCase(lv), ins = [], o;
      while (ins.length < 3) { o = inFor(c, lv); if (ins.indexOf(o) < 0) ins.push(o); }
      ins.sort(function (a, b) { return a - b; });
      function st(i, prompt) { return { prompt: prompt, q: num('n = ' + ins[i] + '. What comes out?', calc(ins[i], c.op, c.k), machFix(c, ins[i]), { hint: ruleTxt(c.op, c.k).replace('n', ins[i]) + '.', meta: { k: 'g3pt-mach-out', op: c.op, c: c.k, n: ins[i] } }) }; }
      return { q: 'The rule is ' + math(ruleTxt(c.op, c.k)) + '. Fill in the table.', fig: tabHtml(['n', ruleTxt(c.op, c.k)], ins, ins.map(function () { return '?'; }), []), done: ins.map(function (v) { return ruleTxt(c.op, c.k).replace('n', v) + ' = ' + calc(v, c.op, c.k); }).join(', ') + '.',
        steps: [st(0, 'Put ' + ins[0] + ' in place of n: ' + ruleTxt(c.op, c.k).replace('n', ins[0]) + '.'), st(1, 'Now put in ' + ins[1] + '.'), st(2, 'And the last one.')] };
    };
  }

  /* ======================= Lesson 4: Equal or not equal ======================= */
  var EQT = { 1: [6, 8, 10, 12, 14, 15, 16, 18, 20], 2: [9, 10, 12, 14, 16, 18, 20, 24, 30], 3: [24, 30, 36, 40, 48, 60, 72, 80, 90, 100] };
  function exprFor(t, lv) {
    var f = [];
    for (var a = 1; a <= Math.min(t - 1, lv === 3 ? 90 : 20); a++) if (lv < 3 || a % 5 === 0 || a > 10) f.push([a, '+', t - a]);
    for (var b = 2; b <= 10; b++) if (t % b === 0 && t / b <= 10) f.push([b, 'x', t / b]);
    if (lv > 1) { for (var c = 1; c <= (lv === 3 ? 40 : 10); c++) f.push([t + c, '-', c]); if (t <= 10) for (var d = 2; d <= 10; d++) if (t * d <= 100) f.push([t * d, '/', d]); }
    return R.pick(f);
  }
  function exprNear(t, lv, base) {
    if (coin() && base) { var sw = base[1] === '+' ? 'x' : base[1] === 'x' ? '+' : null; if (sw && base[0] * base[2] !== base[0] + base[2]) return [base[0], sw, base[2]]; }
    return exprFor(t + R.pick([-2, -1, 1, 2]), lv);
  }
  function val(e) { return calc(e[0], e[1], e[2]); }
  skill('pt-equal', 'Both sides the same?', 'C2.2', [
    [1, 'plain', function (lv) {
      var t = R.pick(EQT[lv]), l = exprFor(t, lv), r = coin() ? exprFor(t, lv) : exprNear(t, lv, l);
      return { q: 'Work out each side. Fill in the blanks.', type: 'fill', fig: cards(exU(l), exU(r)), fill: 'Left: ' + ex(l) + ' = [[]]<br>Right: ' + ex(r) + ' = [[]]', answers: [val(l), val(r)],
        hint: 'Work out one side at a time.', steps: [ex(l) + ' = ' + val(l) + '.', ex(r) + ' = ' + val(r) + '.'], explain: val(l) === val(r) ? 'Both are ' + val(l) + ': they are equal.' : val(l) + ' and ' + val(r) + ': not equal.', meta: { k: 'g3pt-eq-sides', l: l, r: r } };
    }],
    [1, 'value', function (lv) {
      var t = R.pick(EQT[lv]), l = exprFor(t, lv), r, g = 0;
      do { r = exprFor(t, lv); } while (ex(r) === ex(l) && g++ < 20);
      return num(math(ex(l) + ' = ' + ex(r)) + '. Both sides are worth what number?', t, {}, { fig: balance(exU(l), exU(r), 0), hint: 'Work out either side.', steps: [ex(l) + ' = ' + t + '.', ex(r) + ' = ' + t + ' too.'], explain: 'Both sides are ' + t + '.', meta: { k: 'g3pt-eq-val', l: l, r: r } });
    }],
    [1, 'story', function (lv) {
      var p = Q.two(), t = R.pick(EQT[lv].filter(function (x) { return x % 2 === 0; })), a = exprFor(t, 1), b, g = 0;
      do { b = coin() ? exprFor(t, 1) : exprNear(t, 1, a); } while ((ex(b) === ex(a) || b[1] !== 'x' && b[1] !== '+' || val(b) < 2) && g++ < 30);
      function say(w, e) { return e[1] === 'x' ? w + ' has ' + e[0] + ' boxes of ' + e[2] + ' crayons.' : w + ' has ' + e[0] + ' red crayons and ' + e[2] + ' blue crayons.'; }
      return { q: say(p[0], a) + ' ' + say(p[1], b) + ' How many crayons does each have?', type: 'fill', fig: cards(exU(a), exU(b)), fill: p[0] + ': [[]] crayons<br>' + p[1] + ': [[]] crayons', answers: [val(a), val(b)],
        hint: 'Write each one as a number sentence.', steps: [ex(a) + ' = ' + val(a) + '.', ex(b) + ' = ' + val(b) + '.'], explain: val(a) === val(b) ? 'They have the same number.' : 'They have different numbers.', meta: { k: 'g3pt-eq-sides', l: a, r: b } };
    }],
    [1, 'tf', function (lv) {
      var t = R.pick(EQT[lv]), l = exprFor(t, lv), truth = coin(), r, g = 0;
      do { r = truth ? exprFor(t, lv) : exprNear(t, lv, l); } while (ex(r) === ex(l) && g++ < 20);
      truth = val(l) === val(r);
      return tf('True or false: ' + math(ex(l) + ' = ' + ex(r)), truth, 'Left: ' + val(l) + '. Right: ' + val(r) + '.', ['They look alike, so they are equal.', 'They use the same numbers, so they are equal.', 'The equal sign means "write the answer next".'],
        'Work out both sides first.', { fig: cards(exU(l), exU(r)), hint: 'Work out each side.', meta: { k: 'g3pt-eq-tf', l: l, r: r } });
    }],
    [1, 'which', function (lv) {
      var t = R.pick(EQT[lv]), base = exprFor(t, lv), right, g = 0, W = [], seen = {};
      do { right = exprFor(t, lv); } while (ex(right) === ex(base) && g++ < 20);
      seen[ex(right)] = 1;
      for (var i = 0; W.length < 3 && i < 30; i++) { var w = exprNear(t, lv, i ? null : base); if (!seen[ex(w)] && val(w) !== t) { seen[ex(w)] = 1; W.push([ex(w), 'Work it out: ' + ex(w) + ' = ' + val(w) + '.']); } }
      return mc('Which is equal to ' + math(ex(base)) + '?', ex(right), W, { hint: 'Work out ' + ex(base) + ' first.', steps: [ex(base) + ' = ' + t + '.', ex(right) + ' = ' + t + '.'], explain: 'Both are ' + t + '.', meta: { k: 'g3pt-eq-which', t: t } });
    }],
    [2, 'pick', function (lv) {
      var t = R.pick(EQT[lv]), opts = [], seen = {}, nr = R.int(2, 3);
      for (var i = 0; opts.length < 5 && i < 60; i++) { var e = opts.length < nr ? exprFor(t, lv) : exprNear(t, lv, null); if (!seen[ex(e)] && (opts.length < nr) === (val(e) === t)) { seen[ex(e)] = 1; opts.push(e); } }
      opts = R.shuffle(opts);
      var ans = []; opts.forEach(function (e, j) { if (val(e) === t) ans.push(j); });
      return { q: 'Pick every one that is equal to <b>' + t + '</b>.', type: 'pick', options: opts.map(ex), answer: ans, hint: 'Work out each one.', steps: ['More than one can be right.'],
        explain: ans.map(function (j) { return ex(opts[j]); }).join(', ') + '.', meta: { k: 'g3pt-eq-pick', t: t } };
    }]
  ]);
  function tgEqual(kind) {
    return function () {
      var t = R.pick(EQT[2]), l = exprFor(t, 2), r, g = 0;
      do { r = kind === 'same' ? exprFor(t, 2) : kind === 'look' ? exprNear(t, 2, l) : coin() ? exprFor(t, 2) : exprNear(t, 2, null); } while (ex(r) === ex(l) && g++ < 30);
      var eq = val(l) === val(r);
      return { q: 'Is ' + math(ex(l) + ' = ' + ex(r)) + ' true?', fig: cards(exU(l), exU(r)), done: eq ? 'Both sides are ' + val(l) + '. It is true.' : val(l) + ' is not ' + val(r) + '. It is false: ' + ex(l) + ' &ne; ' + ex(r) + '.', steps: [
        { prompt: 'Work out the left side first.', q: num(math(ex(l)) + ' = ?', val(l), {}, { hint: 'Just the left card.', meta: { k: 'g3pt-eq-one', e: l } }) },
        { prompt: 'Now the right side.', q: num(math(ex(r)) + ' = ?', val(r), {}, { hint: 'Just the right card.', meta: { k: 'g3pt-eq-one', e: r } }) },
        { prompt: 'Same value? Then it is true.', q: fixed('So is ' + math(ex(l) + ' = ' + ex(r)) + ' true?', ['True: both sides are the same', 'False: the sides are different'], eq ? 0 : 1, ['Compare ' + val(l) + ' and ' + val(r) + ' again.', 'Compare ' + val(l) + ' and ' + val(r) + ' again.'], { hint: val(l) + ' and ' + val(r) + '.', meta: { k: 'g3pt-eq-tf2', l: l, r: r } }) }
      ] };
    };
  }

  /* ---------- Balance it ---------- */
  function balCase(lv) {
    var l, c, op, box;
    for (var g = 0; g < 50; g++) {
      if (lv === 3) { var a = R.int(100, 600), b = R.int(20, 380); l = [a, '+', b]; op = R.pick(['+', '-']); c = op === '+' ? R.int(50, a + b - 10) : R.int(10, 200); }
      else { var t = R.pick(EQT[lv]); l = exprFor(t, lv); op = lv === 1 ? '+' : R.pick(['+', '-', 'x']); c = op === 'x' ? R.pick([2, 5, 10]) : op === '+' ? R.int(1, t - 1) : R.int(1, 9); }
      var V = val(l);
      box = op === '+' ? V - c : op === '-' ? V + c : V / c;
      if (box > 0 && box === Math.floor(box) && (op !== 'x' || box <= 10) && box !== V) break;
    }
    return { l: l, r: op === '-' ? ['?', '-', c] : [c, op, '?'], box: box, V: val(l) };
  }
  function rTxt(c, h, b) { var x = c.r.map(function (s) { return s === '?' ? b : s; }); return x[0] + ' ' + (h ? UNI : OPS)[x[1]] + ' ' + x[2]; }
  function balFix(c) { var f = {}; f[c.V] = 'That is the value of the left side. The whole right side must be ' + c.V + '.'; if (c.r[1] === '+') f[c.V + c.r[0]] = 'Too big: ' + c.r[0] + ' + ' + (c.V + c.r[0]) + ' is more than ' + c.V + '.'; return f; }
  skill('pt-balance', 'Balance it', 'C2.2, C2.3', [
    [1, 'plain', function (lv) {
      var c = balCase(lv);
      return { q: 'Fill in the missing number so both sides are equal.', type: 'fill', fill: math(ex(c.l) + ' = ' + rTxt(c, false, '[[]]')), answers: [c.box], fig: lv < 3 ? balance(exU(c.l), rTxt(c, true, '?'), 0) : '',
        hint: 'Work out ' + ex(c.l) + ' first.', steps: [ex(c.l) + ' = ' + c.V + '.', rTxt(c, false, c.box) + ' = ' + c.V + ' too.'], explain: 'The missing number is ' + c.box + '.', meta: { k: 'g3pt-bal-box', l: c.l, r: c.r } };
    }],
    [1, 'scale', function (lv) {
      var c = balCase(lv);
      return num('What number makes the scale balance?', c.box, balFix(c), { fig: balance(exU(c.l), rTxt(c, true, '?'), 0), hint: 'The right side must also be ' + c.V + '.', steps: [ex(c.l) + ' = ' + c.V + '.', rTxt(c, false, c.box) + ' = ' + c.V + '.'], explain: c.box + ' balances it.', meta: { k: 'g3pt-bal-box', l: c.l, r: c.r } });
    }],
    [2, 'pickone', function (lv) {
      var c = balCase(lv), W = [[String(c.V), 'That is the left side. The whole right side must be ' + c.V + '.'], [String(c.box + 1), 'Check: ' + rTxt(c, false, c.box + 1) + ' is not ' + c.V + '.'], [String(Math.max(1, c.box - 1)), 'Check it: work out the right side.'], [String(c.box + 10), 'Check it: work out the right side.']];
      return mc('Which number makes ' + math(ex(c.l) + ' = ' + rTxt(c, false, '&#9633;')) + ' true?', String(c.box), W.filter(function (w) { return +w[0] !== c.box; }), { hint: 'Work out the left side. Then make the right side match.', steps: [ex(c.l) + ' = ' + c.V + '.', rTxt(c, false, c.box) + ' = ' + c.V + '.'], explain: c.box + '.', meta: { k: 'g3pt-bal-mc', l: c.l, r: c.r } });
    }],
    [1, 'tf', function (lv) {
      var c = balCase(lv), who = Q.name(), truth = coin(), e = c.r[1] === '+' ? [c.r[0], '+', truth ? c.box : c.V] : c.r[1] === '-' ? [truth ? c.box : c.V, '-', c.r[2]] : [c.r[0], 'x', truth ? c.box : c.V];
      truth = val(e) === c.V;
      return tf(who + ' writes ' + math(ex(c.l) + ' = ' + ex(e)) + '. True or false: both sides are equal.', truth, 'Left: ' + c.V + '. Right: ' + val(e) + '.',
        ['The equal sign means "the answer comes next".', 'The number right after = is always the answer.', 'Both sides only need the same numbers.'], 'Work out each side on its own.', { fig: balance(exU(c.l), exU(e), val(e) === c.V ? 0 : val(e) > c.V ? 1 : -1), hint: 'Is the scale level?', meta: { k: 'g3pt-bal-tf', l: c.l, r: e } });
    }],
    [2, 'story', function (lv) {
      var p = Q.two(), a = lv === 3 ? R.int(120, 600) : R.int(10, 40), b = lv === 3 ? R.int(20, 300) : R.int(3, 20), c = lv === 3 ? R.int(100, a + b - 10) : R.int(5, a + b - 2), f = {};
      f[a + b] = 'That is how many ' + p[0] + ' has. How many more does ' + p[1] + ' need?';
      return num(p[0] + ' has ' + a + ' hockey cards and gets ' + b + ' more. ' + p[1] + ' has ' + c + ' cards. How many more cards does ' + p[1] + ' need to have the same number?', a + b - c, f, { fig: balance(a + ' + ' + b, c + ' + ?', 0), hint: 'Work out ' + a + ' + ' + b + ' first.',
        steps: [a + ' + ' + b + ' = ' + (a + b) + '.', (a + b) + ' &minus; ' + c + ' = ' + (a + b - c) + '.'], explain: p[1] + ' needs ' + (a + b - c) + ' more.', meta: { k: 'g3pt-bal-story', a: a, b: b, c: c } });
    }]
  ]);
  function tgBal(lv) {
    return function () {
      var c = balCase(lv), f = {};
      f[c.V] = 'That is the left side. Now make the right side match it.';
      return { q: 'Find the missing number: ' + math(ex(c.l) + ' = ' + rTxt(c, false, '&#9633;')), fig: balance(exU(c.l), rTxt(c, true, '?'), 0), done: ex(c.l) + ' = ' + rTxt(c, false, c.box) + '. Both sides are ' + c.V + '.', steps: [
        { prompt: 'Work out the side with no box.', q: num(math(ex(c.l)) + ' = ?', c.V, {}, { hint: 'Just the left side.', meta: { k: 'g3pt-eq-one', e: c.l } }) },
        { prompt: 'The right side must be ' + c.V + ' too.', q: num(math(rTxt(c, false, '&#9633;') + ' = ' + c.V) + '. What is the box?', c.box, f, { hint: 'Use a related fact.', meta: { k: 'g3pt-bal-box', l: c.l, r: c.r } }) },
        { prompt: 'Check the right side.', q: num(math(rTxt(c, false, c.box)) + ' = ?', c.V, {}, { hint: 'Work it out.', meta: { k: 'g3pt-eq-one', e: c.r.map(function (s) { return s === '?' ? c.box : s; }) } }) }
      ] };
    };
  }

  /* ======================= Lesson 5: Coding ======================= */
  function progCase(lv, uniq) {
    var nm = lv + 1;
    for (var g = 0; g < 400; g++) {
      var start = coin() ? [R.int(0, 1), R.int(4, 5), 0] : [R.int(0, 1), R.int(3, 5), 1], prog = [];
      for (var i = 0; i < nm; i++) { if (i) prog.push([coin() ? 'right' : 'left']); prog.push(['move', R.int(1, 4)]); }
      var r = run(start, prog);
      if (!fits(r, 6) || (r.x === start[0] && r.y === start[1])) continue;
      if (uniq && new Set(prog.map(line)).size !== prog.length) continue;
      return { start: start, prog: prog, end: [r.x, r.y] };
    }
    return { start: [0, 5, 0], prog: [['move', 3], ['right'], ['move', 2]], end: [2, 2] };
  }
  /* code that looks right but is not: a swapped turn, a changed number, or two steps in the wrong order */
  function progWrongs(c) {
    var out = [], seen = {}; seen[codeTxt(c.prog)] = 1;
    function add(p, fix) { var t = codeTxt(p), r = run(c.start, p); if (seen[t] || (r.x === c.end[0] && r.y === c.end[1])) return; seen[t] = 1; out.push([t, fix]); }
    c.prog.forEach(function (s, i) {
      var p = c.prog.map(function (x) { return x.slice(); });
      if (s[0] === 'move') { p[i][1] = s[1] + R.pick([1, -1]) || 2; add(p, 'Trace it: one move goes the wrong number of squares.'); }
      else { p[i][0] = s[0] === 'right' ? 'left' : 'right'; add(p, 'Trace it: one turn goes the wrong way.'); }
    });
    var sw = c.prog.slice().reverse(); add(sw, 'The order matters. Trace each step in turn.');
    return R.shuffle(out);
  }
  /* true when no other order of the same lines takes the robot to the same square */
  function oneOrder(c) {
    var ok = true;
    (function perm(done, left) {
      if (!ok) return;
      if (!left.length) { var r = run(c.start, done); if (codeTxt(done) !== codeTxt(c.prog) && fits(r, 6) && r.x === c.end[0] && r.y === c.end[1]) ok = false; return; }
      left.forEach(function (s, i) { perm(done.concat([s]), left.slice(0, i).concat(left.slice(i + 1))); });
    })([], c.prog);
    return ok;
  }
  function tapEnd(q, c, x) {
    return put({ q: q, type: 'tap', pic: grid({ start: c.start, star: null, hits: true }), answer: c.end[0] + ',' + c.end[1], answerText: 'the square ' + (c.end[0] + 1) + ' across, ' + (6 - c.end[1]) + ' up', meta: { k: 'g3pt-seq-tap', start: c.start, prog: c.prog } }, x);
  }
  skill('pt-seq', 'Steps in order', 'C3.1, C3.2', [
    [1, 'plain', function (lv) {
      var c = progCase(lv);
      return tapEnd('Run the code one step at a time. Tap the square where the robot stops.' + code(c.prog), c, { hint: 'The robot starts on the circle, facing the way its point shows.', steps: ['Follow each line in order.', 'It stops ' + (c.end[0] + 1) + ' across, ' + (6 - c.end[1]) + ' up.'], explain: 'The robot follows each step in order.' });
    }],
    [1, 'steps', function (lv) {
      var c = progCase(lv), t = moves(c.prog), f = {};
      f[c.prog.length] = 'That is the number of lines. Add the moves.';
      return num('How many squares does the robot move in all?' + code(c.prog), t, f, { fig: lv === 1 ? grid({ start: c.start, done: c.prog }) : '', hint: 'Turns do not move the robot. Add the moves.', steps: [c.prog.filter(function (s) { return s[0] === 'move'; }).map(function (s) { return s[1]; }).join(' + ') + ' = ' + t + '.'], explain: t + ' squares.', meta: { k: 'g3pt-seq-steps', prog: c.prog } });
    }],
    [1, 'which', function (lv) {
      var c = progCase(lv);
      return mc('Which code takes the robot to the star?', codeTxt(c.prog), progWrongs(c), { fig: grid({ start: c.start, star: c.end }), hint: 'Trace each code with your finger.', steps: ['Trace: ' + codeTxt(c.prog) + '.'], explain: codeTxt(c.prog) + '.', meta: { k: 'g3pt-seq-which', start: c.start, star: c.end } });
    }],
    [2, 'order', function (lv) {
      var c = progCase(lv, true);
      for (var g = 0; g < 50 && !oneOrder(c); g++) c = progCase(lv, true);
      return { q: 'Put the code in order so the robot reaches the star.', type: 'order', items: c.prog.map(line), first: 'first step', fig: grid({ start: c.start, star: c.end }), hint: 'Which way does the robot face at the start?',
        steps: ['Trace the path from the circle to the star.'], explain: codeTxt(c.prog) + '.', meta: { k: 'g3pt-seq-order', start: c.start, star: c.end } };
    }],
    [2, 'fill', function (lv) {
      /* only the last two moves are blank: they go two different ways, so just one pair of numbers works */
      var c = progCase(lv), L = c.prog.length, blank = function (i) { return i >= L - 3 && c.prog[i][0] === 'move'; };
      return { q: 'Finish the code so the robot reaches the star.', type: 'fill', fig: grid({ start: c.start, star: c.end }), fill: '<span class="mono" style="display:inline;white-space:normal;padding:2px 6px">' + c.prog.map(function (s, i) { return blank(i) ? 'move [[]]' : line(s); }).join(', ') + '</span>',
        answers: [c.prog[L - 3][1], c.prog[L - 1][1]], hint: 'Count the squares for each move.', steps: [codeTxt(c.prog) + '.'], explain: codeTxt(c.prog) + '.', meta: { k: 'g3pt-seq-fill', start: c.start, star: c.end, prog: c.prog.map(function (s, i) { return blank(i) ? 'move' : line(s); }) } };
    }],
    [2, 'tf', function (lv) {
      var c = progCase(lv), truth = coin(), w = progWrongs(c)[0], who = Q.name(), p = truth || !w ? c.prog : w[0].split(', ').map(function (t) { var s = t.split(' '); return s[0] === 'move' ? ['move', +s[1]] : [s[1]]; });
      truth = codeTxt(p) === codeTxt(c.prog) || (run(c.start, p).x === c.end[0] && run(c.start, p).y === c.end[1]);
      return tf(who + ' wrote this code. True or false: it takes the robot to the star.' + code(p), truth, truth ? 'Trace it: the robot lands on the star.' : 'Trace it: the robot stops ' + (run(c.start, p).x + 1) + ' across, ' + (6 - run(c.start, p).y) + ' up.',
        ['Any code with a turn reaches the star.', 'Only the last line matters.', 'The order of the lines does not matter.'], 'Trace each line with your finger.', { fig: grid({ start: c.start, star: c.end }), hint: 'Trace it one step at a time.', meta: { k: 'g3pt-seq-tf', start: c.start, prog: p, star: c.end } });
    }]
  ]);
  function tgSeq(lv) {
    return function () {
      var c = progCase(lv), first = [c.prog[0]], mid = c.prog.slice(0, 2), r1x = run(c.start, first), r2 = run(c.start, mid);
      return { q: 'Where does the robot stop?' + code(c.prog), done: 'It stops ' + (c.end[0] + 1) + ' across, ' + (6 - c.end[1]) + ' up.', steps: [
        { prompt: 'Line 1 only: ' + line(c.prog[0]) + '.', q: put(tapEnd('Tap where the robot is after line 1.', { start: c.start, prog: first, end: [r1x.x, r1x.y] }), { hint: 'Move ' + c.prog[0][1] + ' squares the way it faces.' }) },
        { prompt: 'Line 2: ' + line(c.prog[1]) + '. Turn on the spot.', q: fixed('Which way does the robot face now?', DIR.map(cap), r2.d, DIR.map(function () { return 'Turn ' + c.prog[1][0] + ' from the way it faced.'; }), { fig: grid({ start: c.start, done: first }), hint: 'Right is the way a clock turns.', meta: { k: 'g3pt-seq-face', start: c.start, prog: mid } }) },
        { prompt: 'Now do the rest of the lines.', q: put(tapEnd('Tap where the robot stops at the end.', c), { pic: grid({ start: c.start, done: mid, hits: true }), hint: 'Keep going from where it is now.' }) }
      ] };
    };
  }

  /* ---------- Repeat loops ---------- */
  /* free: no grid is drawn, so the numbers can be bigger than the grid allows */
  function loopCase(lv, kind, free) {
    kind = kind || (lv === 3 ? R.pick(['square', 'stairs', 'line']) : R.pick(['square', 'line']));
    var r, body, big = lv === 3 ? 9 : 6;
    if (free) { r = R.int(2, big); return { r: r, body: kind === 'stairs' ? [['move', R.int(1, 4)], ['right'], ['move', R.int(1, 4)], ['left']] : [['move', R.int(2, big)]].concat(kind === 'square' ? [['right']] : []), kind: kind }; }
    if (kind === 'square') { r = R.int(2, 4); body = [['move', R.int(2, 5)], ['right']]; }
    else if (kind === 'line') { r = R.int(2, lv === 1 ? 3 : 5); body = [['move', R.int(1, Math.floor(7 / r))]]; }
    else { r = R.int(2, 3); body = [['move', R.int(1, 2)], ['right'], ['move', R.int(1, 2)], ['left']]; }
    return { r: r, body: body, kind: kind };
  }
  var LSTART = [0, 7, 0];
  skill('pt-loop', 'Repeat loops', 'C3.1, C3.2', [
    [1, 'plain', function (lv) {
      var c = loopCase(lv, null, lv > 1), t = c.r * moves(c.body), f = {};
      f[c.r + moves(c.body)] = 'A loop repeats: multiply, do not add.'; f[moves(c.body)] = 'That is one time through. The loop runs ' + c.r + ' times.';
      return num('How many squares does the robot move in all?' + loopCode(c.r, c.body), t, f, { fig: lv === 1 ? grid({ n: 8, start: LSTART, done: expand(c.r, c.body) }) : '', hint: 'Squares each time &times; times repeated.',
        steps: ['Each time: ' + moves(c.body) + ' squares.', c.r + ' &times; ' + moves(c.body) + ' = ' + t + '.'], explain: t + ' squares.', meta: { k: 'g3pt-loop-steps', r: c.r, body: c.body } });
    }],
    [1, 'fill', function (lv) {
      var c = loopCase(lv, lv === 3 ? 'square' : R.pick(['square', 'line']));
      return { q: 'Write this code as a loop.' + code(expand(c.r, c.body)), type: 'fill', fill: '<span class="mono" style="display:inline;white-space:normal;padding:2px 6px">repeat [[]] times [move [[]]' + (c.body.length > 1 ? ', turn right' : '') + ']</span>', answers: [c.r, c.body[0][1]],
        hint: 'Find the part that repeats. How many times?', steps: ['The part that repeats: ' + codeTxt(c.body) + '.', 'It happens ' + c.r + ' times.'], explain: loopTxt(c.r, c.body) + '.', meta: { k: 'g3pt-loop-fill', long: codeTxt(expand(c.r, c.body)) } };
    }],
    [1, 'which', function (lv) {
      var t = R.pick(lv === 1 ? [4, 6, 8, 9, 10] : lv === 2 ? [12, 15, 16, 18, 20] : [21, 24, 28, 30, 32, 36]), fs = [];
      for (var r = 2; r <= 9; r++) if (t % r === 0 && t / r <= 9 && t / r > 1) fs.push([r, t / r]);
      var p = R.pick(fs), W = [[loopTxt(p[0], [['move', p[1] + 1]]), 'Work it out: ' + p[0] + ' &times; ' + (p[1] + 1) + '.'], [loopTxt(p[0] + 1, [['move', p[1]]]), 'Work it out: ' + (p[0] + 1) + ' &times; ' + p[1] + '.'], [loopTxt(Math.max(2, p[0] - 1), [['move', p[1]]]), 'Work it out: times repeated &times; squares each time.'], [codeTxt([['move', p[0]], ['move', p[1]]]), 'No loop here: ' + p[0] + ' + ' + p[1] + '.']].filter(function (w, i) { return i < 3 || p[0] + p[1] !== t; });
      return mc('Which code moves the robot exactly <b>' + t + '</b> squares?', loopTxt(p[0], [['move', p[1]]]), W, { hint: 'A loop multiplies.', steps: [p[0] + ' &times; ' + p[1] + ' = ' + t + '.'], explain: loopTxt(p[0], [['move', p[1]]]) + '.', meta: { k: 'g3pt-loop-which', t: t } });
    }],
    [2, 'tap', function (lv) {
      var c = loopCase(lv), prog = expand(c.r, c.body), r = run(LSTART, prog);
      return { q: 'Run the loop. Tap the square where the robot stops.' + loopCode(c.r, c.body), type: 'tap', pic: grid({ n: 8, start: LSTART, hits: true }), answer: r.x + ',' + r.y, answerText: 'the square ' + (r.x + 1) + ' across, ' + (8 - r.y) + ' up',
        hint: 'Do the steps inside the loop, ' + c.r + ' times.', steps: ['Do ' + codeTxt(c.body) + ', then again, ' + c.r + ' times in all.'], explain: 'It stops ' + (r.x + 1) + ' across, ' + (8 - r.y) + ' up.', meta: { k: 'g3pt-loop-tap', start: LSTART, r: c.r, body: c.body } };
    }],
    [2, 'tf', function (lv) {
      var r = R.int(3, lv === 3 ? 9 : 5), m = R.int(3, lv === 3 ? 9 : 5), truth = coin(), said = truth ? r * m : r + m, who = Q.name();
      return tf(who + ' says this code moves the robot <b>' + said + '</b> squares. True or false?', truth, 'The loop runs ' + r + ' times, ' + m + ' squares each time: ' + r + ' &times; ' + m + ' = ' + r * m + '.',
        ['Add the number of repeats to the move.', 'A loop runs only once.', 'Count only the first move.'], 'Multiply: times repeated &times; squares each time.', { fig: loopCode(r, [['move', m]]), hint: 'How many times does the loop run?', meta: { k: 'g3pt-loop-tf', r: r, m: m, said: said } });
    }],
    [3, 'two', function (lv) {
      var c = loopCase(3, 'stairs', true), t = c.r * moves(c.body);
      return num('How many squares does the robot move in all?' + loopCode(c.r, c.body), t, {}, { hint: 'Add the moves inside the loop, then multiply.', steps: ['Inside: ' + c.body[0][1] + ' + ' + c.body[2][1] + ' = ' + moves(c.body) + '.', c.r + ' &times; ' + moves(c.body) + ' = ' + t + '.'], explain: t + ' squares.', meta: { k: 'g3pt-loop-steps', r: c.r, body: c.body } });
    }]
  ]);
  function tgLoop(kind) {
    return function () {
      var c = loopCase(2, kind), e = moves(c.body), f = {};
      f[c.r + e] = 'A loop repeats: multiply, do not add.';
      return { q: 'How many squares does the robot move in all?' + loopCode(c.r, c.body), fig: grid({ n: 8, start: LSTART, done: expand(c.r, c.body) }), done: c.r + ' &times; ' + e + ' = ' + c.r * e + ' squares.', steps: [
        { prompt: 'Look inside the loop only.', q: num('How many squares does it move each time through the loop?', e, {}, { hint: 'Add the moves between repeat and end repeat.', meta: { k: 'g3pt-loop-each', body: c.body } }) },
        { prompt: 'Now read the repeat line.', q: num('How many times does the loop run?', c.r, {}, { hint: 'Read the number after repeat.', meta: { k: 'g3pt-loop-times', r: c.r, text: loopTxt(c.r, c.body) } }) },
        { prompt: 'Squares each time &times; times repeated.', q: num('How many squares in all?', c.r * e, f, { hint: c.r + ' &times; ' + e + '.', meta: { k: 'g3pt-loop-steps', r: c.r, body: c.body } }) }
      ] };
    };
  }

  /* ---------- At the same time ---------- */
  var ACTORS = [['Robot', 'moves', 'move'], ['Music', 'plays', '♪'], ['Light', 'flashes', 'flash']];
  function concCase(lv, kind) {
    kind = kind || R.pick(['same', 'after']);
    var a = R.int(2, lv === 3 ? 6 : 4), b = R.int(2, lv === 3 ? 6 : 4), two = R.shuffle([0, 1, 2]).slice(0, 2);
    return { kind: kind, a: a, b: b, x: ACTORS[two[0]], y: ACTORS[two[1]], lanes: [[ACTORS[two[0]][0], 0, a, ACTORS[two[0]][2]], [ACTORS[two[1]][0], kind === 'same' ? 0 : a, kind === 'same' ? b : a + b, ACTORS[two[1]][2]]] };
  }
  var CONC = ['At the same time (concurrent)', 'One after another (sequential)', 'Only one thing happens'];
  function concAsk(q, c, x) { return fixed(q, CONC, c.kind === 'same' ? 0 : 1, ['Look at the timeline: does one start when the other ends?', 'Look at the timeline: do both start at 0?', 'Two things happen here.'], put({ meta: { k: 'g3pt-conc-kind', a: c.lanes[0].slice(1, 3), b: c.lanes[1].slice(1, 3) } }, x)); }
  skill('pt-conc', 'At the same time', 'C3.1, C3.2', [
    [1, 'plain', function (lv) {
      var c = concCase(lv);
      return concAsk('The ' + c.x[0].toLowerCase() + ' ' + c.x[1] + ' and the ' + c.y[0].toLowerCase() + ' ' + c.y[1] + '. How do they happen?', c, { fig: timeline(c.lanes, c.kind === 'same' ? Math.max(c.a, c.b) : c.a + c.b), hint: 'Do both bars start at 0?',
        steps: [c.kind === 'same' ? 'Both start at 0 and run together.' : 'The second starts when the first ends.'], explain: c.kind === 'same' ? 'They are concurrent.' : 'They are sequential.' });
    }],
    [1, 'far', function (lv) {
      var m = R.int(1, lv === 3 ? 6 : 3), t = R.int(2, lv === 3 ? 9 : 5), f = {};
      f[m + t] = 'Each second the robot moves ' + m + '. Multiply.';
      return num('The robot moves ' + G3.pl(m, 'square') + ' each second. At the same time, music plays for ' + t + ' seconds. How many squares has the robot moved when the music stops?', m * t, f, { fig: timeline([['Robot', 0, t, 'move ' + m], ['Music', 0, t, '♪']], t, t), hint: m + ' squares each second, for ' + t + ' seconds.',
        steps: ['Both run for ' + t + ' seconds.', t + ' &times; ' + m + ' = ' + m * t + '.'], explain: m * t + ' squares.', meta: { k: 'g3pt-conc-far', m: m, t: t } });
    }],
    [1, 'fill', function (lv) {
      var c = concCase(lv), sx = c.x[0].toLowerCase(), sy = c.y[0].toLowerCase();
      return { q: 'The ' + sx + ' ' + c.x[1] + ' for ' + c.a + ' seconds. The ' + sy + ' ' + c.y[1] + ' for ' + c.b + ' seconds. Fill in the blanks.', type: 'fill', fig: timeline([[c.x[0], 0, c.a, c.x[2]], [c.y[0], c.a, c.a + c.b, c.y[2]]], c.a + c.b),
        fill: 'One after another: done after [[]] seconds.<br>At the same time: done after [[]] seconds.', answers: [c.a + c.b, Math.max(c.a, c.b)], hint: 'One after another: add. At the same time: the longer one.',
        steps: [c.a + ' + ' + c.b + ' = ' + (c.a + c.b) + '.', 'Together, both finish when the longer one ends: ' + Math.max(c.a, c.b) + '.'], explain: (c.a + c.b) + ' seconds, or ' + Math.max(c.a, c.b) + ' seconds.', meta: { k: 'g3pt-conc-fill', a: c.a, b: c.b } };
    }],
    [2, 'gap', function (lv) {
      var p = R.int(3, lv === 3 ? 7 : 5), q = R.int(1, p - 1), t = R.int(2, lv === 3 ? 9 : 5), f = {};
      f[(p + q) * t] = 'Find how far apart, not how far in all.'; f[p - q] = 'That is after 1 second. Multiply by ' + t + '.';
      return num('Two robots start at the same time. Red moves ' + p + ' squares each second. Blue moves ' + q + '. After ' + t + ' seconds, how many squares ahead is Red?', (p - q) * t, f, { fig: timeline([['Red', 0, t, 'move ' + p], ['Blue', 0, t, 'move ' + q]], t, t), hint: 'How much farther does Red go each second?',
        steps: ['Each second Red gets ' + (p - q) + ' ahead.', (p - q) + ' &times; ' + t + ' = ' + (p - q) * t + '.'], explain: 'Red is ' + (p - q) * t + ' squares ahead.', meta: { k: 'g3pt-conc-gap', p: p, q: q, t: t } });
    }],
    [3, 'flash', function (lv) {
      var e = R.pick([2, 3, 5]), t = e * R.int(2, 6), f = {};
      f[t] = 'It flashes every ' + e + ' seconds, not every second.';
      return num('While the robot moves for ' + t + ' seconds, a light flashes every ' + e + ' seconds. The first flash is at ' + e + ' seconds. How many times does it flash?', t / e, f, { fig: timeline([['Robot', 0, t, 'move'], ['Light', 0, t, 'every ' + e]], t), hint: 'Count by ' + e + 's to ' + t + '.',
        steps: [seq(e, e, t / e).join(', ') + '.', t + ' &divide; ' + e + ' = ' + t / e + '.'], explain: t / e + ' flashes.', meta: { k: 'g3pt-conc-flash', e: e, t: t } });
    }],
    [2, 'tf', function (lv) {
      var c = concCase(lv), who = Q.name(), truth = c.kind === 'after';
      return tf(who + ' says the ' + c.y[0].toLowerCase() + ' waits until the ' + c.x[0].toLowerCase() + ' is done. True or false?', truth, truth ? 'The ' + c.y[0].toLowerCase() + ' starts at ' + c.a + ' seconds, when the ' + c.x[0].toLowerCase() + ' ends.' : 'Both start at 0 seconds. They run at the same time.',
        ['Things in code always wait for each other.', 'Two things can never happen at once.', 'The longer one always goes first.'], 'Look at where each bar starts.', { fig: timeline(c.lanes, c.kind === 'same' ? Math.max(c.a, c.b) : c.a + c.b), hint: 'Where does each bar start?', meta: { k: 'g3pt-conc-tf', a: c.lanes[0].slice(1, 3), b: c.lanes[1].slice(1, 3) } });
    }]
  ]);
  function tgConc(kind) {
    return function () {
      var c = concCase(2, kind), end = Math.max(c.lanes[0][2], c.lanes[1][2]), f = {};
      f[c.kind === 'same' ? c.a + c.b : Math.max(c.a, c.b)] = c.kind === 'same' ? 'They run together. Look for the longer one.' : 'One after another: add the times.';
      return { q: 'The ' + c.x[0].toLowerCase() + ' ' + c.x[1] + ' for ' + c.a + ' seconds. The ' + c.y[0].toLowerCase() + ' ' + c.y[1] + ' for ' + c.b + ' seconds.', fig: timeline(c.lanes, end), done: 'Both are done after ' + end + ' seconds.', steps: [
        { prompt: 'Look where each bar starts.', q: concAsk('How do they happen?', c, { hint: 'Do both start at 0?' }) },
        { prompt: c.kind === 'same' ? 'Together: the longer one decides.' : 'One after another: add the times.', q: num('After how many seconds are both done?', end, f, { hint: c.kind === 'same' ? 'The longer of ' + c.a + ' and ' + c.b + '.' : c.a + ' + ' + c.b + '.', meta: { k: 'g3pt-conc-end', a: c.lanes[0].slice(1, 3), b: c.lanes[1].slice(1, 3) } }) }
      ] };
    };
  }

  /* ---------- Change the code ---------- */
  function fixCase(lv) { return { r: R.int(2, lv === 3 ? 9 : 5), m: R.int(2, lv === 3 ? 9 : 5) }; }
  skill('pt-fix', 'Change the code', 'C3.2', [
    [1, 'plain', function (lv) {
      var c = fixCase(lv), m2 = c.m + R.pick([1, 2, 3, -1]), f = {};
      if (m2 < 1) m2 = c.m + 2;
      f[c.r * c.m] = 'That was before the change. Use move ' + m2 + '.';
      return num('Code: <b>' + loopTxt(c.r, [['move', c.m]]) + '</b>. You change <b>move ' + c.m + '</b> to <b>move ' + m2 + '</b>. How many squares does the robot move now?', c.r * m2, f, { fig: c.r * m2 <= 30 ? track(Math.max(c.r * m2, c.r * c.m), c.r * c.m) : '', hint: 'The loop still runs ' + c.r + ' times.',
        steps: ['Now each time: ' + m2 + ' squares.', c.r + ' &times; ' + m2 + ' = ' + c.r * m2 + '.'], explain: c.r * m2 + ' squares now, not ' + c.r * c.m + '.', meta: { k: 'g3pt-fix-new', r: c.r, m: m2 } });
    }],
    [1, 'more', function (lv) {
      var c = fixCase(lv), r2 = c.r + R.int(1, 3), f = {};
      f[r2 * c.m] = 'That is the new total. How many more than before?'; f[r2 - c.r] = 'Each extra time moves ' + c.m + ' squares.';
      return num('Code: <b>' + loopTxt(c.r, [['move', c.m]]) + '</b>. You change it to <b>repeat ' + r2 + ' times</b>. How many <b>more</b> squares does the robot move?', (r2 - c.r) * c.m, f, { fig: r2 * c.m <= 30 ? track(r2 * c.m, r2 * c.m, c.r * c.m) : '', hint: 'Each extra time adds ' + c.m + ' squares.',
        steps: [(r2 - c.r) + ' more times.', (r2 - c.r) + ' &times; ' + c.m + ' = ' + (r2 - c.r) * c.m + '.'], explain: (r2 - c.r) * c.m + ' more squares.', meta: { k: 'g3pt-fix-more', r: c.r, r2: r2, m: c.m } });
    }],
    [2, 'which', function (lv) {
      var c = fixCase(lv), byM = coin(), m2 = c.m + R.int(1, 3), r2 = c.r + R.int(1, 3), t = byM ? c.r * m2 : r2 * c.m, opts = [], right;
      right = byM ? 'Change move ' + c.m + ' to move ' + m2 : 'Change repeat ' + c.r + ' to repeat ' + r2;
      [['m', c.m + 1], ['m', c.m + 2], ['m', c.m + 3], ['r', c.r + 1], ['r', c.r + 2], ['r', c.r + 3], ['m', m2 + 1]].forEach(function (o) {
        var tot = o[0] === 'm' ? c.r * o[1] : o[1] * c.m, txt = o[0] === 'm' ? 'Change move ' + c.m + ' to move ' + o[1] : 'Change repeat ' + c.r + ' to repeat ' + o[1];
        if (tot !== t && txt !== right) opts.push([txt, 'Work it out: that moves ' + tot + ' squares.']);
      });
      return mc('Code: <b>' + loopTxt(c.r, [['move', c.m]]) + '</b>. The star is <b>' + t + '</b> squares away. Which change gets the robot exactly to the star?', right, R.shuffle(opts), { fig: t <= 30 ? track(t, c.r * c.m, t) : '', hint: 'Work out the squares for each change.',
        steps: [right + ': ' + (byM ? c.r + ' &times; ' + m2 : r2 + ' &times; ' + c.m) + ' = ' + t + '.'], explain: right + '.', meta: { k: 'g3pt-fix-which', r: c.r, m: c.m, t: t } });
    }],
    [2, 'fill', function (lv) {
      var m = R.int(2, lv === 3 ? 9 : 5), r = R.int(2, lv === 3 ? 9 : 6), t = m * r;
      return { q: 'Change the code so the robot moves exactly <b>' + t + '</b> squares.', type: 'fill', fill: '<span class="mono" style="display:inline;white-space:normal;padding:2px 6px">repeat [[]] times [move ' + m + ']</span>', answers: [r], fig: t <= 30 ? track(t, 0, t) : '',
        hint: 'How many groups of ' + m + ' make ' + t + '?', steps: [t + ' &divide; ' + m + ' = ' + r + '.'], explain: loopTxt(r, [['move', m]]) + '.', meta: { k: 'g3pt-fix-fill', m: m, t: t } };
    }],
    [1, 'tf', function (lv) {
      var c = fixCase(lv), truth = coin(), said = truth ? c.m : R.pick([1, c.m + 1, c.m * (c.r + 1)]), who = Q.name();
      return tf('Code: <b>' + loopTxt(c.r, [['move', c.m]]) + '</b>. ' + who + ' changes it to <b>repeat ' + (c.r + 1) + ' times</b> and says the robot now moves <b>' + G3.pl(said, 'more square', 'more squares') + '</b>. True or false?', truth, 'One more time through the loop adds ' + c.m + ' squares.',
        ['One more repeat always adds 1 square.', 'Changing the repeat does not change the squares.', 'One more repeat doubles the squares.'], 'Each time through the loop moves ' + c.m + ' squares.', { hint: 'What does one time through the loop do?', meta: { k: 'g3pt-fix-tf', m: c.m, said: said } });
    }]
  ]);
  function tgFix(lv) {
    return function () {
      var c = fixCase(lv), r2 = c.r + R.int(1, 2), f = {};
      f[r2 * c.m] = 'That is the new total. Find how many more.';
      return { q: 'Code: <b>' + loopTxt(c.r, [['move', c.m]]) + '</b>. Change it to <b>repeat ' + r2 + ' times</b>. How many more squares does the robot move?', fig: r2 * c.m <= 30 ? track(r2 * c.m, r2 * c.m, c.r * c.m) : '', done: (r2 * c.m) + ' &minus; ' + (c.r * c.m) + ' = ' + (r2 - c.r) * c.m + ' more squares.', steps: [
        { prompt: 'First, the old code.', q: num('How many squares did the old code move?', c.r * c.m, {}, { hint: c.r + ' &times; ' + c.m + '.', meta: { k: 'g3pt-loop-steps', r: c.r, body: [['move', c.m]] } }) },
        { prompt: 'Now the new code.', q: num('How many squares does the new code move?', r2 * c.m, {}, { hint: r2 + ' &times; ' + c.m + '.', meta: { k: 'g3pt-fix-new', r: r2, m: c.m } }) },
        { prompt: 'Compare the two.', q: num('How many more squares?', (r2 - c.r) * c.m, f, { hint: (r2 * c.m) + ' &minus; ' + (c.r * c.m) + '.', meta: { k: 'g3pt-fix-more', r: c.r, r2: r2, m: c.m } }) }
      ] };
    };
  }

  /* ======================= Watch and My turn clips ======================= */
  var rowV = function (s) { return '<div>' + row(s.core, s.n, { box: s.box, mark: s.mark }) + sym(s.say) + '</div>'; };
  var arrV = function (s) { return '<div>' + arrows({ s: s.s, t: s.t }, s.n) + sym(s.say) + '</div>'; };
  var jumpV = function (s) { return '<div>' + jumpLine(seq(s.a, s.d, s.n), { diff: s.diff }) + sym(s.say) + '</div>'; };
  var figV = function (s) { return '<div>' + figs(s.a, s.d, s.k) + (s.tbl ? tabHtml(['Figure', 'Tiles'], seq(1, 1, s.k), seq(s.a, s.d, s.k), []) : '') + sym(s.say) + '</div>'; };
  var towV = function (s) { return '<div>' + towers(s.v) + sym(s.say) + '</div>'; };
  var balV = function (s) { return '<div>' + balance(s.l, s.r, s.tilt) + sym(s.say) + '</div>'; };
  var machV = function (s) { return '<div>' + machine(s.op, s.k, s.n, s.out) + (s.ins ? tabHtml(['n', ruleTxt(s.op, s.k)], s.ins, s.ins.map(function (v) { return calc(v, s.op, s.k); }), []) : '') + sym(s.say) + '</div>'; };
  var gridV = function (s) { return '<div>' + grid({ n: s.n, start: s.start, done: s.prog.slice(0, s.k), star: s.star }) + (s.loop ? loopCode(s.loop[0], s.loop[1]) : code(s.prog, s.k - 1)) + sym(s.say) + '</div>'; };
  var timeV = function (s) { return '<div>' + timeline(s.lanes, s.T, s.now) + sym(s.say) + '</div>'; };
  var trackV = function (s) { return '<div>' + track(s.len, s.at, s.star) + '<pre class="mono">' + s.code + '</pre>' + sym(s.say) + '</div>'; };
  var S1 = [0, 5, 0], P1 = [['move', 3], ['right'], ['move', 2]], P2 = [['right'], ['move', 4], ['left'], ['move', 2]];
  var SQ = expand(4, [['move', 3], ['right']]), SQ2 = expand(3, [['move', 2], ['right'], ['move', 1], ['left']]);

  /* ======================= The lessons ======================= */
  var LESSONS = [
    { id: 'repeat', title: 'Repeating patterns', sub: 'Find the part that repeats.', concepts: [
      { id: 'core', title: 'Find the core', exp: ['C1.1', 'C1.3'], skill: 'pt-core',
        watch: clip(rowV, { core: 'ABB', n: 3 }, [
          ['Circle, square, square.'],
          ['Then the circle comes back.', [{ n: 4 }, { n: 5 }, { n: 6 }, { n: 7 }, { n: 8 }, { n: 9 }]],
          ['A box around each part that repeats.', { box: true, say: 'circle, square, square' }]
        ]),
        example: clip(rowV, { core: 'CCD', n: 3 }, [
          ['My turn. Triangle, triangle, star.'],
          ['The triangle comes back here.', [{ n: 4 }, { n: 5 }, { n: 6 }]],
          ['Is it just triangle, triangle? No: the star is part of it.', { box: true, say: 'triangle, triangle, star' }],
          ['So next comes a triangle.', { n: 7, mark: 6 }]
        ]),
        try: { mount: G3.play({ state: { core: 'AB', n: 6, box: false }, draw: function (s) { return row(s.core, s.n, { box: s.box }); },
          selects: [{ key: 'core', label: 'Core', options: [['AB', 'circle, square'], ['ABB', 'circle, square, square'], ['AAB', 'circle, circle, square'], ['ABC', 'circle, square, triangle'], ['ABCD', 'circle, square, triangle, star']] }],
          buttons: [{ label: 'Add one more', act: function (s) { if (s.n < 16) s.n++; } }, { label: 'Show the cores', act: function (s) { s.box = !s.box; } }],
          info: function (s) { return 'Next comes a <b>' + SH[s.core.charAt(s.n % s.core.length)] + '</b>.'; },
          tasks: [{ do: 'Make <b>circle, square, triangle</b> and show its cores.', goal: function (s) { return s.core === 'ABC' && s.box; }, yes: 'The core has 3 shapes.' }] }), do: '' },
        together: [tgCore(1), tgCore(2), tgCore(3)],
        mistake: '<p>Calling a part the core before the pattern really starts again (circle, circle in circle, circle, square), or choosing two cores. Ask: "Say the shapes. When does the first one come back?"</p>',
        check: [ck('pt-core', 'plain', 1), ck('pt-core', 'tap', 1), ck('pt-core', 'missing', 2), ck('pt-core', 'fill', 2), ck('pt-core', 'tf', 3)] },

      { id: 'forms', title: 'Same pattern, new look', exp: ['C1.1', 'C1.2'], skill: 'pt-forms',
        watch: clip(rowV, { core: 'ABB', n: 6, box: true }, [
          ['Circle, square, square.'],
          ['As letters.', { say: 'A, B, B' }],
          ['As actions.', { say: 'clap, snap, snap' }],
          ['In real life: a traffic light.', { core: 'DBC', n: 6, say: 'green, yellow, red: A, B, C' }]
        ]),
        example: clip(rowV, { core: 'CCD', n: 6, box: true }, [
          ['My turn. Triangle, triangle, star.'],
          ['I write it with letters.', { say: 'A, A, B' }],
          ['Stomp, stomp, tap is A, A, B too.', { say: 'stomp, stomp, tap' }],
          ['Stomp, tap, tap? No: that is A, B, B.', { say: 'A, B, B is a new pattern' }]
        ]),
        together: [tgForms(1), tgForms(2), tgForms(3)],
        mistake: '<p>Matching the things instead of the structure: thinking circle, square, square and clap, clap, snap are the same because both have 3 parts. Say both with letters (A, B, B and A, A, B) and compare.</p>',
        check: [ck('pt-forms', 'plain', 1), ck('pt-forms', 'real', 1), ck('pt-forms', 'tap', 2), ck('pt-forms', 'match', 2), ck('pt-forms', 'tf', 3)] },

      { id: 'turns', title: 'Patterns that turn', exp: ['C1.2', 'C1.3'], skill: 'pt-move',
        watch: clip(arrV, { s: 0, t: 1, n: 1 }, [
          ['The arrow points up.'],
          ['Each time: a quarter turn right.', [{ n: 2 }, { n: 3 }, { n: 4 }]],
          ['After 4 arrows, it points up again.', { n: 5 }],
          ['The core is 4 arrows.', { n: 8, say: 'up, right, down, left' }]
        ]),
        example: clip(arrV, { s: 1, t: 2, n: 1 }, [
          ['My turn. The arrow points right.'],
          ['A half turn: now it points left.', { n: 2 }],
          ['Again: right, left, right.', [{ n: 3 }, { n: 4 }, { n: 5 }]],
          ['The core is only 2 arrows, not 4.', { n: 6, say: 'right, left' }]
        ]),
        together: [tgMove(1), tgMove(2), tgMove(3)],
        mistake: '<p>Mixing up a turn to the right and a turn to the left, or thinking every turning pattern has a core of 4. Stand up and make the turns together, then count until the arrow faces the start way again.</p>',
        check: [ck('pt-move', 'plain', 1), ck('pt-move', 'how', 1), ck('pt-move', 'core', 2), ck('pt-move', 'order', 2), ck('pt-move', 'far', 3)] },

      { id: 'ahead', title: 'Predict far ahead', exp: ['C1.3'], skill: 'pt-ahead',
        watch: clip(rowV, { core: 'ABC', n: 9, box: true, say: 'Shape 10?' }, [
          ['3 shapes in each core.'],
          ['Count by 3s.', { say: '3, 6, 9' }],
          ['9 ends a core. 10 starts the next: a circle.', { n: 10, say: 'Shape 10: circle' }]
        ]),
        example: clip(rowV, { core: 'ABCD', n: 8, box: true, say: 'Shape 23?' }, [
          ['My turn. 4 shapes in each core.'],
          ['I count by 4s to stay below 23.', { say: '4, 8, 12, 16, 20' }],
          ['23 is 3 past 20: shape 3, a triangle.', { say: 'Shape 23: triangle' }],
          ['Not a star: I check, 24 would be the star.']
        ]),
        try: { mount: G3.play({ state: { core: 'ABB', p: 5 }, draw: function (s) { return row(s.core, Math.min(16, Math.max(6, Math.ceil(Math.min(s.p, 16) / 3) * 3)), { box: true }); },
          sliders: [{ key: 'p', label: 'Position', min: 1, max: 40 }],
          info: function (s) { return 'Shape ' + s.p + ': <b>' + SH[s.core.charAt((s.p - 1) % 3)] + '</b>. ' + Math.floor((s.p - 1) / 3) + ' full cores come before it.'; },
          tasks: [{ do: 'Find a position past 20 that is a <b>circle</b>.', goal: function (s) { return s.p > 20 && (s.p - 1) % 3 === 0; }, yes: function (s) { return 'Shape ' + s.p + ' is a circle: one more than a multiple of 3.'; } }] }), do: '' },
        together: [tgAhead(1), tgAhead(2), tgAhead(3)],
        mistake: '<p>Counting single shapes one at a time and losing track, or counting a full core too many. Count whole cores first ("3, 6, 9"), stay below the position, then count on.</p>',
        check: [ck('pt-ahead', 'plain', 1), ck('pt-ahead', 'count', 1), ck('pt-ahead', 'fill', 2), ck('pt-ahead', 'where', 2), ck('pt-ahead', 'plain', 3)] }
    ] },

    { id: 'grow', title: 'Patterns that grow', sub: 'The same change, every time.', concepts: [
      { id: 'rule', title: 'Use a pattern rule', exp: ['C1.3'], skill: 'pt-extend',
        watch: clip(jumpV, { a: 2, d: 3, n: 1, diff: true }, [
          ['Start at 2.'],
          ['Add 3 each time.', [{ n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }]],
          ['Every jump is the same size.', { say: '2, 5, 8, 11, 14' }]
        ]),
        example: clip(jumpV, { a: 30, d: -4, n: 1, diff: true }, [
          ['My turn. Start at 30, take away 4.'],
          ['30, 26, 22, 18.', [{ n: 2 }, { n: 3 }, { n: 4 }]],
          ['Not 34: take away goes back.', { n: 5, say: '30, 26, 22, 18, 14' }]
        ]),
        try: { mount: G3.play({ state: { st: 1, b: 2, sg: 1 }, draw: function (s) { var v = []; for (var i = 0; i < 6; i++) { var x = s.st + s.sg * s.b * i; if (x < 0) break; v.push(x); } return (v.length > 1 ? jumpLine(v, { diff: true }) : '') + sym(v.join(', ')); },
          sliders: [{ key: 'st', label: 'Start at', min: 0, max: 40 }, { key: 'b', label: 'This much', min: 1, max: 10 }],
          selects: [{ key: 'sg', label: 'Each time', options: [[1, 'add'], [-1, 'take away']] }],
          tasks: [{ do: 'Make <b>5, 10, 15, 20</b>.', goal: function (s) { return s.st === 5 && s.b === 5 && s.sg === 1; }, yes: 'Start at 5, add 5.' },
            { do: 'Make <b>30, 26, 22, 18</b>.', goal: function (s) { return s.st === 30 && s.b === 4 && s.sg === -1; }, yes: 'Start at 30, take away 4.' }] }), do: '' },
        together: [tgExt(1), tgExt(2), tgExt(3)],
        mistake: '<p>Making one jump too many (the 5th number is 4 jumps from the start, not 5), or adding when the rule says take away. Say the numbers aloud and point: "1st, 2nd, 3rd".</p>',
        check: [ck('pt-extend', 'plain', 1), ck('pt-extend', 'fill', 1), ck('pt-extend', 'line', 2), ck('pt-extend', 'story', 2), ck('pt-extend', 'plain', 3)] },

      { id: 'find', title: 'Find the rule', exp: ['C1.1', 'C1.3'], skill: 'pt-rule',
        watch: clip(jumpV, { a: 40, d: -5, n: 4 }, [
          ['40, 35, 30, 25.'],
          ['Each jump goes back 5.', { diff: true }],
          ['Start at 40, take away 5.', { n: 5, say: 'Next: 20' }]
        ]),
        example: clip(jumpV, { a: 12, d: 3, n: 4 }, [
          ['My turn. 12, 15, 18, 21.'],
          ['I check every jump, not just the first.', { diff: true }],
          ['Start at 12, add 3. Not start at 3.', { n: 5, say: 'Next: 24' }]
        ]),
        together: [tgRule(1), tgRule(2), tgRule(3)],
        mistake: '<p>Looking only at the first two numbers, or naming the change but not the start (or starting at the change). Check the change between every pair, then say the whole rule: "Start at ___, add ___."</p>',
        check: [ck('pt-rule', 'plain', 1), ck('pt-rule', 'which', 1), ck('pt-rule', 'next', 2), ck('pt-rule', 'fill', 2), ck('pt-rule', 'story', 3)] },

      { id: 'big', title: 'Patterns to 1000', exp: ['C1.4'], skill: 'pt-big',
        watch: clip(jumpV, { a: 125, d: 100, n: 1, diff: true }, [
          ['Start at 125.'],
          ['Add 100 each time.', [{ n: 2 }, { n: 3 }, { n: 4 }]],
          ['Only the hundreds digit changes.', { say: '125, 225, 325, 425' }]
        ]),
        example: clip(jumpV, { a: 960, d: -50, n: 1, diff: true }, [
          ['My turn. Start at 960, take away 50.'],
          ['960, 910.', { n: 2 }],
          ['910 take away 50 crosses a hundred: 860.', { n: 3 }],
          ['Then 810, 760.', [{ n: 4 }, { n: 5 }]]
        ]),
        together: [tgBig(100, true), tgBig(10, true), tgBig(100, false)],
        mistake: '<p>Changing the wrong digit (adding 10 to 345 and writing 445), or losing track when the tens cross a hundred (290, 300, 310). Ask: "Which place does 10 change? Which does 100 change?"</p>',
        check: [ck('pt-big', 'plain', 1), ck('pt-big', 'digit', 1), ck('pt-big', 'fill', 2), ck('pt-big', 'nth', 2), ck('pt-big', 'plain', 3)] },

      { id: 'table', title: 'Tables of values', exp: ['C1.2', 'C1.3'], skill: 'pt-table',
        watch: clip(figV, { a: 2, d: 2, k: 1 }, [
          ['Figure 1 has 2 tiles.'],
          ['Each figure adds 2 tiles.', [{ k: 2 }, { k: 3 }]],
          ['A table keeps the count.', { tbl: true }],
          ['Figure 4 will have 8.', { k: 4 }]
        ]),
        example: clip(figV, { a: 3, d: 4, k: 1 }, [
          ['My turn. Figure 1 has 3 tiles.'],
          ['Figure 2 adds 4 light tiles: 7.', { k: 2 }],
          ['I fill the table: 3, 7, 11.', { k: 3, tbl: true }],
          ['Figure 4: 15. Not 16: I start from 3, not 0.', { k: 4 }]
        ]),
        together: [tgTable(1), tgTable(2), tgTable(3)],
        mistake: '<p>Multiplying the figure number by the change and forgetting the start (figure 5 with "start at 3, add 4" is 19, not 20). Build the first figures with blocks and say the rule together.</p>',
        check: [ck('pt-table', 'plain', 1), ck('pt-table', 'far', 1), ck('pt-table', 'rule', 2), ck('pt-table', 'back', 2), ck('pt-table', 'far', 3)] },

      { id: 'which', title: 'Repeating or growing?', exp: ['C1.1', 'C1.3'], skill: 'pt-kind',
        watch: clip(towV, { v: [3, 6, 3, 6, 3, 6] }, [
          ['3, 6, 3, 6: a part comes back.', { say: 'Repeating' }],
          ['2, 4, 6, 8: up by 2 each time.', { v: [2, 4, 6, 8, 10, 12], say: 'Growing' }],
          ['12, 10, 8, 6: down by 2 each time.', { v: [12, 10, 8, 6, 4, 2], say: 'Shrinking' }]
        ]),
        example: clip(towV, { v: [5, 1, 5, 1, 5, 1] }, [
          ['My turn. 5, 1, 5, 1.'],
          ['It goes up and down, so not growing.', { say: 'Repeating: 5, 1' }],
          ['1, 4, 7, 10: the same jump up.', { v: [1, 4, 7, 10, 13, 16], say: 'Growing: add 3' }]
        ]),
        together: [tgKind('rep'), tgKind('grow'), tgKind('shrink')],
        mistake: '<p>Using a growing rule on a repeating pattern (3, 6, 3, 6, then 9), or calling any pattern with big numbers "growing". First ask: "Does a part come back?" Then: "Is the change the same each time?"</p>',
        check: [ck('pt-kind', 'plain', 1), ck('pt-kind', 'next', 1), ck('pt-kind', 'fill', 2), ck('pt-kind', 'pick', 2), ck('pt-kind', 'far', 3)] }
    ] },

    { id: 'vars', title: 'Variables', sub: 'A letter that stands for a number.', concepts: [
      { id: 'letter', title: 'A letter for a number', exp: ['C2.1'], skill: 'pt-var',
        watch: clip(balV, { l: 'n + 4', r: '10', tilt: 0 }, [
          ['n + 4 = 10. What is n?'],
          ['What plus 4 makes 10?', { say: '10 − 4 = 6' }],
          ['Put 6 in for n. Both sides are 10.', { l: '6 + 4', say: 'n = 6' }]
        ]),
        example: clip(balV, { l: '5 × n', r: '30', tilt: 0 }, [
          ['My turn. 5 &times; n = 30.'],
          ['I count by 5s to 30: 6 jumps.', { say: '30 ÷ 5 = 6' }],
          ['n = 6. Not 25: n is not 30 &minus; 5.', { l: '5 × 6', say: 'n = 6' }]
        ]),
        try: { mount: G3.play({ state: { n: 3 }, draw: function (s) { return balance(s.n + ' + 8', '15', s.n + 8 === 15 ? 0 : s.n + 8 > 15 ? -1 : 1); },
          sliders: [{ key: 'n', label: 'Try n =', min: 0, max: 15 }],
          info: function (s) { return s.n + 8 === 15 ? '<b>n = 7</b>. Both sides are 15.' : s.n + ' + 8 = ' + (s.n + 8) + (s.n + 8 > 15 ? ': too much.' : ': not enough.'); },
          tasks: [{ do: 'Find n: ' + math('n + 8 = 15') + '. Balance the scale.', goal: function (s) { return s.n === 7; }, yes: 'n = 7, because 7 + 8 = 15.' }] }), do: '' },
        together: [tgVar(1), tgVar(2), tgVar(3)],
        mistake: '<p>Doing the operation that is shown instead of undoing it (n + 4 = 10, so n = 14), or thinking n is always the same number. Ask: "What number, plus 4, makes 10?" Then check by putting it back in.</p>',
        check: [ck('pt-var', 'plain', 1), ck('pt-var', 'box', 1), ck('pt-var', 'story', 2), ck('pt-var', 'write', 2), ck('pt-var', 'plain', 3)] },

      { id: 'machine', title: 'Number machines', exp: ['C2.1', 'C1.2'], skill: 'pt-machine',
        watch: clip(machV, { op: 'x', k: 2, n: 3, out: '?' }, [
          ['The rule is 2 &times; n. 3 goes in.'],
          ['2 &times; 3 = 6 comes out.', { out: 6 }],
          ['n can be any number.', [{ n: 4, out: 8 }, { n: 5, out: 10 }, { n: 6, out: 12, ins: [3, 4, 5, 6] }]]
        ]),
        example: clip(machV, { op: '+', k: 5, n: 7, out: '?' }, [
          ['My turn. The rule is n + 5. 7 goes in.'],
          ['7 + 5 = 12. Not 75: I add.', { out: 12 }],
          ['Out comes 20. What went in? 20 &minus; 5 = 15.', { n: '?', out: 20 }],
          ['My table.', { n: 15, ins: [7, 8, 15] }]
        ]),
        try: { mount: G3.play({ state: { r: '+,10', n: 4 }, draw: function (s) { var r = s.r.split(','); return machine(r[0], +r[1], s.n, calc(s.n, r[0], +r[1])); },
          selects: [{ key: 'r', label: 'Rule', options: [['+,5', 'n + 5'], ['+,10', 'n + 10'], ['-,3', 'n &minus; 3'], ['x,2', '2 &times; n'], ['x,5', '5 &times; n'], ['x,10', '10 &times; n']] }],
          sliders: [{ key: 'n', label: 'Put in n =', min: 3, max: 10 }],
          tasks: [{ do: 'Find a rule and an n that give out <b>50</b>.', goal: function (s) { var r = s.r.split(','); return calc(s.n, r[0], +r[1]) === 50; }, yes: 'That makes 50.' }] }), do: '' },
        together: [tgMach(1), tgMach(2), tgMach(3)],
        mistake: '<p>Writing the number next to the rule (n + 5 with n = 7 read as 75), or using the rule forwards to find what went in. Say the rule in words: "add 5", "2 times". To go backwards, undo it.</p>',
        check: [ck('pt-machine', 'plain', 1), ck('pt-machine', 'fill', 1), ck('pt-machine', 'in', 2), ck('pt-machine', 'rule', 2), ck('pt-machine', 'plain', 3)] }
    ] },

    { id: 'equal', title: 'Equal or not equal', sub: 'Work out both sides, then compare.', concepts: [
      { id: 'sides', title: 'Both sides the same?', exp: ['C2.2'], skill: 'pt-equal',
        watch: clip(balV, { l: '4 × 5', r: '2 × 10', tilt: null }, [
          ['4 &times; 5 and 2 &times; 10.'],
          ['Work out each side: 20 and 20.', { say: '20 = 20' }],
          ['The scale balances: equal.', { tilt: 0, say: '4 × 5 = 2 × 10' }],
          ['5 + 3 and 5 &times; 3: 8 and 15. Not equal.', { l: '5 + 3', r: '5 × 3', tilt: 1, say: '5 + 3 ≠ 5 × 3' }]
        ]),
        example: clip(balV, { l: '20 ÷ 2', r: '20 − 2', tilt: null }, [
          ['My turn. 20 &divide; 2 and 20 &minus; 2.'],
          ['They look alike. I work them out: 10 and 18.', { say: '10 and 18' }],
          ['The scale tips. Not equal.', { tilt: 1, say: '20 ÷ 2 ≠ 20 − 2' }],
          ['3 &times; 4 and 6 + 6: 12 and 12. Equal.', { l: '3 × 4', r: '6 + 6', tilt: 0, say: '3 × 4 = 6 + 6' }]
        ]),
        together: [tgEqual('same'), tgEqual('look'), tgEqual('any')],
        mistake: '<p>Deciding by how it looks (same numbers, so equal: 5 + 3 = 5 &times; 3), or reading = as "the answer comes next". Always work out each side on its own, then compare the two values.</p>',
        check: [ck('pt-equal', 'plain', 1), ck('pt-equal', 'tf', 1), ck('pt-equal', 'which', 2), ck('pt-equal', 'value', 2), ck('pt-equal', 'tf', 3)] },

      { id: 'balance', title: 'Balance it', exp: ['C2.2', 'C2.3'], skill: 'pt-balance',
        watch: clip(balV, { l: '8 + 6', r: '5 + ?', tilt: null }, [
          ['8 + 6 = 5 + ?'],
          ['The left side is 14.', { say: '8 + 6 = 14' }],
          ['5 + 9 is 14 too.', { r: '5 + 9', tilt: 0, say: '? = 9' }]
        ]),
        example: clip(balV, { l: '345 + 20', r: '300 + ?', tilt: null }, [
          ['My turn. 345 + 20 = 300 + ?'],
          ['The left side is 365.', { say: '345 + 20 = 365' }],
          ['Not 365: the whole right side must be 365.', { r: '300 + 365', tilt: 1, say: '300 + 365 = 665' }],
          ['300 + 65 = 365. The box is 65.', { r: '300 + 65', tilt: 0, say: '? = 65' }]
        ]),
        try: { mount: G3.play({ state: { k: 2 }, draw: function (s) { return balance('3 + 5', '2 + ' + s.k, 2 + s.k === 8 ? 0 : 2 + s.k > 8 ? 1 : -1); },
          sliders: [{ key: 'k', label: 'Box', min: 0, max: 12 }],
          tasks: [{ do: 'Make ' + math('3 + 5 = 2 + &#9633;') + ' true.', goal: function (s) { return s.k === 6; }, yes: '2 + 6 = 8, the same as 3 + 5.' }] }), do: '' },
        together: [tgBal(1), tgBal(2), tgBal(3)],
        mistake: '<p>Writing the left side\'s value in the box (8 + 6 = 14 + 5), because "=" is read as "the answer comes next". Ask: "What is the left side worth? What must the whole right side be worth?"</p>',
        check: [ck('pt-balance', 'plain', 1), ck('pt-balance', 'scale', 1), ck('pt-balance', 'tf', 2), ck('pt-balance', 'story', 2), ck('pt-balance', 'plain', 3)] }
    ] },

    { id: 'code', title: 'Coding', sub: 'Steps in order, loops, and things at the same time.', concepts: [
      { id: 'steps', title: 'Steps in order', exp: ['C3.1', 'C3.2'], skill: 'pt-seq',
        watch: clip(gridV, { start: S1, prog: P1, k: 0, star: [2, 2] }, [
          ['Get the robot to the star.'],
          ['Line 1: move 3.', { k: 1 }],
          ['Line 2: turn right, on the spot.', { k: 2 }],
          ['Line 3: move 2. The star.', { k: 3 }]
        ]),
        example: clip(gridV, { start: S1, prog: P2, k: 0, star: [4, 3] }, [
          ['My turn. I run each line in order.'],
          ['Turn right. Move 4.', [{ k: 1 }, { k: 2 }]],
          ['Turn left. Move 2. The star.', [{ k: 3 }, { k: 4 }]],
          ['Move 2 first? A different square: order matters.']
        ]),
        try: { mount: G3.play({ state: { prog: [] }, draw: function (s) { return grid({ start: S1, done: s.prog, star: [3, 1] }) + code(s.prog.length ? s.prog : [['move', 0]]).replace('move 0', '(no code yet)'); },
          buttons: [{ label: 'Move 1', act: function (s) { var l = s.prog[s.prog.length - 1]; if (l && l[0] === 'move') l[1]++; else s.prog.push(['move', 1]); } }, { label: 'Turn right', act: function (s) { s.prog.push(['right']); } }, { label: 'Turn left', act: function (s) { s.prog.push(['left']); } }, { label: 'Undo', act: function (s) { var l = s.prog[s.prog.length - 1]; if (l && l[0] === 'move' && l[1] > 1) l[1]--; else s.prog.pop(); } }],
          info: function (s) { var r = run(S1, s.prog); return fits(r, 6) ? r.moved + ' squares so far.' : 'The robot went off the grid. Press Undo.'; },
          tasks: [{ do: 'Write code to get the robot <b>to the star</b>.', goal: function (s) { var r = run(S1, s.prog); return r.x === 3 && r.y === 1 && fits(r, 6); }, yes: function (s) { return 'Your code: ' + codeTxt(s.prog) + '.'; } }] }), do: '' },
        together: [tgSeq(1), tgSeq(2), tgSeq(3)],
        mistake: '<p>Moving the robot when it turns, or turning the wrong way because it faces down the page. Have the child stand and act out the code: a turn happens on the spot, and "right" is the robot\'s right.</p>',
        check: [ck('pt-seq', 'plain', 1), ck('pt-seq', 'steps', 1), ck('pt-seq', 'which', 2), ck('pt-seq', 'order', 2), ck('pt-seq', 'plain', 3)] },

      { id: 'loop', title: 'Repeat loops', exp: ['C3.1', 'C3.2'], skill: 'pt-loop',
        watch: clip(gridV, { n: 8, start: LSTART, prog: SQ, k: 0, loop: [4, [['move', 3], ['right']]] }, [
          ['The loop runs 4 times.'],
          ['Each time: move 3, turn right.', [{ k: 2 }, { k: 4 }, { k: 6 }, { k: 8 }]],
          ['A square. 4 &times; 3 = 12 squares.', { say: '4 × 3 = 12' }]
        ]),
        example: clip(gridV, { n: 8, start: LSTART, prog: SQ2, k: 0, loop: [3, [['move', 2], ['right'], ['move', 1], ['left']]] }, [
          ['My turn. Inside the loop: 2 + 1 = 3 squares.'],
          ['It runs 3 times: stairs.', [{ k: 4 }, { k: 8 }, { k: 12 }]],
          ['3 &times; 3 = 9 squares. Not 3 + 3.', { say: '3 × 3 = 9' }]
        ]),
        try: { mount: G3.play({ state: { r: 2, m: 2, t: 'right' }, draw: function (s) { return grid({ n: 8, start: LSTART, done: expand(s.r, [['move', s.m], [s.t]]) }) + loopCode(s.r, [['move', s.m], [s.t]]); },
          selects: [{ key: 'r', label: 'Repeat', options: [[1, '1'], [2, '2'], [3, '3'], [4, '4']] }, { key: 'm', label: 'Move', options: [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']] }, { key: 't', label: 'Then turn', options: [['right', 'right'], ['left', 'left']] }],
          info: function (s) { var r = run(LSTART, expand(s.r, [['move', s.m], [s.t]])); return s.r + ' &times; ' + s.m + ' = <b>' + s.r * s.m + ' squares</b>' + (fits(r, 8) ? '' : '. Part of the path is off the grid.'); },
          tasks: [{ do: 'Draw a square with sides of <b>5</b>.', goal: function (s) { return s.r === 4 && s.m === 5 && s.t === 'right'; }, yes: '4 &times; 5 = 20 squares.' }] }), do: '' },
        together: [tgLoop('square'), tgLoop('line'), tgLoop('stairs')],
        mistake: '<p>Adding the repeat number and the move (repeat 4 times [move 3] as 7), or counting the loop only once. Trace the path with a finger and count each time around.</p>',
        check: [ck('pt-loop', 'plain', 1), ck('pt-loop', 'fill', 1), ck('pt-loop', 'which', 2), ck('pt-loop', 'tap', 2), ck('pt-loop', 'two', 3)] },

      { id: 'same', title: 'At the same time', exp: ['C3.1', 'C3.2'], skill: 'pt-conc',
        watch: clip(timeV, { lanes: [['Robot', 0, 4, 'move'], ['Music', 0, 4, '♪']], T: 7, now: 0 }, [
          ['Both start when the code starts.'],
          ['The robot moves while the music plays.', [{ now: 1 }, { now: 2 }, { now: 3 }, { now: 4 }]],
          ['That is concurrent. Done after 4 seconds.', { say: 'concurrent' }],
          ['One after the other is sequential: 7 seconds.', { lanes: [['Robot', 0, 4, 'move'], ['Music', 4, 7, '♪']], now: 7, say: 'sequential' }]
        ]),
        example: clip(timeV, { lanes: [['Robot', 0, 5, 'move 2'], ['Light', 0, 5, 'flash']], T: 5, now: 0 }, [
          ['My turn. The robot moves 2 squares each second.'],
          ['The light flashes the whole time.', [{ now: 1 }, { now: 2 }, { now: 3 }, { now: 4 }, { now: 5 }]],
          ['5 seconds &times; 2 = 10 squares. Not 7: they run together.', { say: '5 × 2 = 10' }]
        ]),
        together: [tgConc('same'), tgConc('after'), tgConc()],
        mistake: '<p>Thinking every step in code waits for the one before it, so adding the times of things that run together. Point to where each bar starts on the timeline: "Do they start together?"</p>',
        check: [ck('pt-conc', 'plain', 1), ck('pt-conc', 'far', 1), ck('pt-conc', 'fill', 2), ck('pt-conc', 'gap', 2), ck('pt-conc', 'flash', 3)] },

      { id: 'fix', title: 'Change the code', exp: ['C3.2'], skill: 'pt-fix',
        watch: clip(trackV, { len: 15, at: 9, star: 15, code: 'repeat 3 times\n  move 3\nend repeat' }, [
          ['The robot stops at 9. The star is at 15.'],
          ['Change move 3 to move 5.', { code: 'repeat 3 times\n  move 5\nend repeat' }],
          ['3 &times; 5 = 15. It reaches the star.', { at: 15, say: '3 × 5 = 15' }]
        ]),
        example: clip(trackV, { len: 20, at: 8, star: 20, code: 'repeat 4 times\n  move 2\nend repeat' }, [
          ['My turn. 4 &times; 2 = 8. The star is at 20.'],
          ['I change repeat 4 to repeat 10.', { code: 'repeat 10 times\n  move 2\nend repeat' }],
          ['10 &times; 2 = 20. Not repeat 5: that adds only 2.', { at: 20, say: '10 × 2 = 20' }]
        ]),
        together: [tgFix(1), tgFix(2), tgFix(3)],
        mistake: '<p>Thinking one more repeat adds just 1 square, or changing the wrong number. Ask: "What does one time through the loop do?" Then work out the new total before running it.</p>',
        check: [ck('pt-fix', 'plain', 1), ck('pt-fix', 'more', 1), ck('pt-fix', 'which', 2), ck('pt-fix', 'fill', 2), ck('pt-fix', 'more', 3)] }
    ] }
  ];

  A.register(CH, {
    full: true,
    lessons: LESSONS,
    quiz: [
      { q: 'This pattern keeps going. What is shape number 10?', type: 'mc', options: [opt('A'), opt('B'), opt('C'), opt('D')], answer: 0, fig: row('ABB', 6, { box: true }),
        hint: 'The core has 3 shapes. Count by 3s.', explain: '9 ends a core, so 10 starts the next one: a circle.', meta: { k: 'g3pt-core-next', core: 'ABB', at: 9 } },
      { q: 'What comes next? ' + math('6, 11, 16, 21, ___'), type: 'num', answer: 26, hint: 'How much bigger is each number?', explain: 'Start at 6, add 5. 21 + 5 = 26.', meta: { k: 'g3pt-rule-next', v: [6, 11, 16, 21] } },
      { q: 'Start at 450, add 100. What is the 5th number?', type: 'num', answer: 850, hint: 'Make 4 jumps of 100.', explain: '450, 550, 650, 750, 850.', meta: { k: 'g3pt-big-nth', a: 450, d: 100, j: 5 } },
      { q: 'Find n: ' + math('n &minus; 7 = 13'), type: 'num', answer: 20, hint: 'What number, take away 7, leaves 13?', explain: '13 + 7 = 20, so n = 20.', meta: { k: 'g3pt-var-n', op: '-', c: 7, r: 13 } },
      { q: 'Fill in the missing number so both sides are equal.', type: 'fill', fill: math('6 &times; 4 = 20 + [[]]'), answers: [4], hint: 'Work out 6 &times; 4 first.', explain: '6 &times; 4 = 24, and 20 + 4 = 24.', meta: { k: 'g3pt-bal-box', l: [6, 'x', 4], r: [20, '+', '?'] } },
      { q: 'The rule is ' + math('5 &times; n') + '. What comes out when 8 goes in?', type: 'num', answer: 40, fig: machine('x', 5, 8, '?'), hint: 'Put 8 in place of n.', explain: '5 &times; 8 = 40.', meta: { k: 'g3pt-mach-out', op: 'x', c: 5, n: 8 } },
      { q: 'How many squares does the robot move in all?' + loopCode(4, [['move', 5], ['right']]), type: 'num', answer: 20, hint: 'The loop runs 4 times.', explain: '4 &times; 5 = 20 squares.', meta: { k: 'g3pt-loop-steps', r: 4, body: [['move', 5], ['right']] } }
    ],
    practice: SKILLS.map(function (s) { return { id: s.id, name: s.name, code: s.code, gen: DEF[s.id][0][2] }; })
  });

  /* every skill's other shapes (docs/QUESTIONS.md); each skill keeps its first way of asking as "plain" */
  var SHAPES = {};
  SKILLS.forEach(function (s) { SHAPES[s.id] = DEF[s.id].slice(1); });
  Q.shapes(CH, SHAPES);
})();
