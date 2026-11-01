/* Grade 3 Time, mass and capacity: a full chapter (docs/QUESTIONS.md, "Full chapters"). 5 lessons, 15 ideas, one practice skill per idea.
   Ontario 2020: E2.6 analog and digital clocks and timers, in hours, minutes and seconds; E2.4 mass with a pan balance and cubes
   (compare, estimate, measure); E2.3 capacity with cups (estimate, measure, compare; overfilling, underfilling and gaps).
   Every question sets meta.k; the answer checks are in tests/verify/grade3.js (keys start with g3tm-). */
(function () {
  var A = Atlas, R = A.R, Q = A.Q, CH = 'time-mass';

  /* ---------- words and question builders ---------- */
  function put(o, x) { for (var k in x) o[k] = x[k]; return o; }
  function plain(h) { var e = document.createElement('div'); e.innerHTML = h; return e.textContent.replace(/\s+/g, ' ').trim(); }
  function coin() { return Math.random() < 0.5; }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
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

  /* ---------- time ---------- */
  function pad(m) { return (m < 10 ? '0' : '') + m; }
  function nxt(h) { return h % 12 + 1; }
  function prv(h) { return (h + 10) % 12 + 1; }
  function hm(t) { t = ((t % 720) + 720) % 720; return [Math.floor(t / 60) || 12, t % 60]; }
  function tt(h, m) { return h + ':' + pad(m); }
  function at(t) { var x = hm(t); return tt(x[0], x[1]); }
  function words(h, m) {
    if (m === 0) return h + ' o\'clock';
    if (m === 15) return 'quarter past ' + h;
    if (m === 30) return 'half past ' + h;
    if (m === 45) return 'quarter to ' + nxt(h);
    if (m < 30) return m + ' minute' + (m === 1 ? '' : 's') + ' past ' + h;
    return (60 - m) + ' minute' + (60 - m === 1 ? '' : 's') + ' to ' + nxt(h);
  }

  /* ---------- pictures ---------- */
  function r1(v) { return Math.round(v * 10) / 10; }
  function T(x, y, t, sz, cls, anchor) { return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (anchor || 'middle') + '" font-size="' + (sz || 18) + '" class="' + (cls || 'tb') + '">' + t + '</text>'; }
  var LINE = 'style="stroke:var(--ink)" stroke-width="2.5"';
  /* a clock face: the short hour hand (class hh) and the long minute hand (class mh) point by angle from 12, going clockwise */
  function face(h, m, o) {
    o = o || {};
    var cx = 150, cy = 150, r = 120, s = '', i;
    function pt(deg, L) { var a = deg * Math.PI / 180; return [(cx + L * Math.sin(a)).toFixed(2), (cy - L * Math.cos(a)).toFixed(2)]; }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="6"/>';
    for (i = 0; i < 60; i++) { var p1 = pt(i * 6, r - 4), p2 = pt(i * 6, i % 5 ? r - 11 : r - 18); s += '<line x1="' + p1[0] + '" y1="' + p1[1] + '" x2="' + p2[0] + '" y2="' + p2[1] + '" style="stroke:var(--ink)" stroke-width="' + (i % 5 ? 1.5 : 4) + '"/>'; }
    for (i = 1; i <= 12; i++) { var p = pt(i * 30, r - 44); s += '<text x="' + p[0] + '" y="' + (+p[1] + 8) + '" text-anchor="middle" font-size="23" class="tb">' + i + '</text>'; }
    if (o.fives) for (i = 1; i <= 12; i++) { var q = pt(i * 30, r + 18); s += '<text x="' + q[0] + '" y="' + (+q[1] + 6) + '" text-anchor="middle" font-size="15" style="fill:var(--strand)" class="tb">' + pad(i * 5 % 60) + '</text>'; }
    var hp = pt((h % 12) * 30 + m / 2, 62), mp = pt(m * 6, 94);
    s += '<line class="hh" x1="' + cx + '" y1="' + cy + '" x2="' + hp[0] + '" y2="' + hp[1] + '" style="stroke:var(--ink)" stroke-width="11" stroke-linecap="round"/>';
    s += '<line class="mh" x1="' + cx + '" y1="' + cy + '" x2="' + mp[0] + '" y2="' + mp[1] + '" style="stroke:var(--sb)" stroke-width="6" stroke-linecap="round"/>';
    if (o.sec != null) { var sp = pt(o.sec * 6, 104); s += '<line class="sh" x1="' + cx + '" y1="' + cy + '" x2="' + sp[0] + '" y2="' + sp[1] + '" style="stroke:var(--bad)" stroke-width="2.5" stroke-linecap="round"/>'; }
    return s + '<circle cx="' + cx + '" cy="' + cy + '" r="8" style="fill:var(--ink)"/>';
  }
  function clock(h, m, o) { return A.svg(300, 300, '<g class="clk">' + face(h, m, o) + '</g>', 'An analog clock'); }
  /* two clocks side by side: a start and an end */
  function two(a, b) { return A.svg(620, 336, '<g class="clk">' + face(a[0], a[1]) + '</g><g class="clk" transform="translate(320 0)">' + face(b[0], b[1]) + '</g>' + T(150, 330, 'Start', 24) + T(470, 330, 'End', 24), 'Two clocks: the start and the end'); }
  function digital(h, m, sec) {
    var t = tt(h, m) + (sec != null ? ':' + pad(sec) : '');
    return A.svg(260, 92, '<rect x="4" y="4" width="252" height="84" rx="14" style="fill:var(--ink)"/><text class="dg" x="130" y="65" text-anchor="middle" font-size="50" font-family="ui-monospace,Menlo,Consolas,monospace" font-weight="700" style="fill:var(--hi)">' + t + '</text>', 'A digital clock');
  }
  /* a timer that counts minutes and seconds */
  function timer(mn, sc) {
    var s = '<rect x="104" y="2" width="32" height="16" rx="4" style="fill:var(--ink2)"/><circle cx="120" cy="96" r="74" style="fill:var(--card);stroke:var(--ink)" stroke-width="6"/>' +
      '<rect x="60" y="66" width="120" height="54" rx="10" style="fill:var(--ink)"/><text class="sw" x="120" y="106" text-anchor="middle" font-size="36" font-family="ui-monospace,Menlo,Consolas,monospace" font-weight="700" style="fill:var(--hi)">' + mn + ':' + pad(sc) + '</text>' + T(120, 146, 'min : sec', 15, 't2');
    return A.svg(240, 176, s, 'A timer');
  }
  /* a time line from t0 to t1 (minutes), hopping to the next hour first; k = how many hops are drawn */
  function hopsOf(t0, t1) { var p = [t0], n = (Math.floor(t0 / 60) + 1) * 60; while (n < t1) { p.push(n); n += 60; } p.push(t1); return p; }
  function lineFig(t0, t1, k) {
    var p = hopsOf(t0, t1), x0 = 34, W = 372, sc = W / (t1 - t0), s = '<line x1="' + x0 + '" y1="70" x2="' + (x0 + W) + '" y2="70" ' + LINE + '/>', last = -99;
    p.forEach(function (t, i) {
      var x = x0 + (t - t0) * sc, low = x - last < 52;
      s += '<line x1="' + r1(x) + '" y1="62" x2="' + r1(x) + '" y2="78" ' + LINE + '/>' + T(x, low ? 118 : 98, at(t), 16);
      if (!low) last = x;
      if (i && (k == null || i <= k)) { var xa = x0 + (p[i - 1] - t0) * sc, mid = (xa + x) / 2; s += '<path d="M' + r1(xa) + ' 62 Q' + r1(mid) + ' 14 ' + r1(x) + ' 62" fill="none" style="stroke:var(--sb)" stroke-width="3"/>' + T(mid, 34, '+' + (t - p[i - 1]), 16); }
    });
    return A.svg(440, 126, s, 'A time line from ' + at(t0) + ' to ' + at(t1));
  }

  /* things for the pan balance and how many cubes each one balances */
  var MASS = { apple: 9, orange: 11, book: 23, shoe: 15, pencil: 2, mug: 18, pillow: 6, stone: 21 };
  var COL = { apple: 'var(--bad)', orange: 'var(--se)', book: 'var(--sb)', shoe: 'var(--sc)', pencil: 'var(--hi)', mug: 'var(--sd)', pillow: 'var(--sf)', stone: 'var(--ink2)' };
  function thing(k, x, y) {
    var c = COL[k], s;
    if (k === 'apple' || k === 'orange') s = '<circle cx="' + x + '" cy="' + (y - 22) + '" r="22" style="fill:' + c + ';stroke:var(--ink)" stroke-width="2.5"/>' + (k === 'apple' ? '<path d="M' + x + ' ' + (y - 44) + ' q2 -10 9 -12" fill="none" style="stroke:var(--ink)" stroke-width="3"/>' : '');
    else if (k === 'book') s = '<rect x="' + (x - 34) + '" y="' + (y - 22) + '" width="68" height="22" rx="3" style="fill:' + c + ';stroke:var(--ink)" stroke-width="2.5"/><line x1="' + (x - 28) + '" y1="' + (y - 6) + '" x2="' + (x + 28) + '" y2="' + (y - 6) + '" style="stroke:var(--card)" stroke-width="2"/>';
    else if (k === 'shoe') s = '<path d="M' + (x - 34) + ' ' + y + ' v-30 h22 q4 14 22 16 q24 4 24 14 z" style="fill:' + c + ';stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>';
    else if (k === 'pencil') s = '<rect x="' + (x - 34) + '" y="' + (y - 12) + '" width="56" height="12" style="fill:' + c + ';stroke:var(--ink)" stroke-width="2"/><polygon points="' + (x + 22) + ',' + (y - 12) + ' ' + (x + 36) + ',' + (y - 6) + ' ' + (x + 22) + ',' + y + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/>';
    else if (k === 'pillow') s = '<rect x="' + (x - 54) + '" y="' + (y - 46) + '" width="108" height="46" rx="20" style="fill:color-mix(in srgb,' + c + ' 40%,var(--card));stroke:var(--ink)" stroke-width="2.5"/>';
    else if (k === 'stone') s = '<ellipse cx="' + x + '" cy="' + (y - 11) + '" rx="18" ry="11" style="fill:' + c + ';stroke:var(--ink)" stroke-width="2.5"/>';
    else s = '<path d="M' + (x - 22) + ' ' + (y - 40) + ' h40 v34 q0 6 -6 6 h-28 q-6 0 -6 -6 z" style="fill:' + c + ';stroke:var(--ink)" stroke-width="2.5"/><path d="M' + (x + 18) + ' ' + (y - 32) + ' q16 0 16 12 q0 12 -16 12" fill="none" style="stroke:var(--ink)" stroke-width="3"/>';
    return '<g class="ob" data-k="' + k + '">' + s + '</g>';
  }
  function heavy(x) { return typeof x === 'number' ? x : x.reduce(function (a, k) { return a + MASS[k]; }, 0); }
  /* a pan balance: each side is a list of things or a number of cubes (rows of 6). The heavier side goes down. */
  function balance(left, right, label) {
    var d = heavy(left) - heavy(right), deg = d > 0 ? Math.min(12, 3 + d) : d < 0 ? Math.max(-12, d - 3) : 0, a = deg * Math.PI / 180, px = 230, py = 92, L = 160, s = '';
    var lx = r1(px - L * Math.cos(a)), ly = r1(py + L * Math.sin(a)), rx = r1(px + L * Math.cos(a)), ry = r1(py - L * Math.sin(a));
    s += '<polygon points="' + (px - 60) + ',300 ' + (px + 60) + ',300 ' + (px + 14) + ',270 ' + (px - 14) + ',270" style="fill:var(--ink2)"/><rect x="' + (px - 8) + '" y="' + py + '" width="16" height="180" style="fill:var(--ink2)"/>';
    s += '<line class="beam" x1="' + lx + '" y1="' + ly + '" x2="' + rx + '" y2="' + ry + '" style="stroke:var(--ink)" stroke-width="10" stroke-linecap="round"/><circle cx="' + px + '" cy="' + py + '" r="10" style="fill:var(--hi);stroke:var(--ink)" stroke-width="3"/>';
    function side(x, by, v) {
      var t = '', i;
      if (typeof v === 'number') for (i = 0; i < v; i++) t += '<rect class="cube" x="' + r1(x - 54 + (i % 6) * 18) + '" y="' + r1(by - (Math.floor(i / 6) + 1) * 18) + '" width="16" height="16" rx="2" style="fill:var(--sd);stroke:var(--ink)" stroke-width="1.5"/>';
      else for (i = 0; i < v.length; i++) t += thing(v[i], r1(x - (v.length - 1) * 24 + i * 48), by);
      return t;
    }
    function pan(x, y, v) { var by = r1(y + 74); return '<line x1="' + x + '" y1="' + y + '" x2="' + r1(x - 62) + '" y2="' + by + '" style="stroke:var(--ink2)" stroke-width="2"/><line x1="' + x + '" y1="' + y + '" x2="' + r1(x + 62) + '" y2="' + by + '" style="stroke:var(--ink2)" stroke-width="2"/>' + side(x, by, v) + '<path d="M' + r1(x - 72) + ' ' + by + ' h144 q-10 20 -40 20 h-64 q-30 0 -40 -20z" style="fill:var(--ink2)"/>'; }
    s += pan(lx, ly, left) + pan(rx, ry, right);
    return A.svg(460, 310, s, label || 'A pan balance');
  }
  function bal2(a, b) { return '<div class="tm-pair" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">' + a + b + '</div>'; }
  /* a jug with marks for each cup (class mk) and water (class wt) up to f cups */
  function jug(cp, f) {
    var x = 70, top = 30, H = 240, W = 150, s = '', lvl = Math.min(f, cp) / cp * H, i;
    s += '<rect class="wt" x="' + x + '" y="' + r1(top + H - lvl) + '" width="' + W + '" height="' + r1(lvl) + '" style="fill:color-mix(in srgb,var(--sb) 55%,var(--card))"/>';
    s += '<path d="M' + x + ' ' + top + ' V' + (top + H) + ' H' + (x + W) + ' V' + top + '" fill="none" style="stroke:var(--ink)" stroke-width="5" stroke-linejoin="round"/><path d="M' + x + ' ' + (top + 30) + ' q-40 0 -40 50 q0 50 40 50" fill="none" style="stroke:var(--ink)" stroke-width="6"/>';
    for (i = 1; i <= cp; i++) { var y = r1(top + H - i * H / cp); s += '<line x1="' + (x + W - 26) + '" y1="' + y + '" x2="' + (x + W) + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="2"/><text class="mk" x="' + (x + W + 8) + '" y="' + r1(y + 6) + '" font-size="16">' + i + '</text>'; }
    return A.svg(330, 290, s, 'A jug marked in cups');
  }
  /* containers to fill, drawn in a 110 by 100 box; lvl = how full (0 to 1), spill = water running over */
  var CONT = {
    pot: function (f) { return '<path d="M14 30 H96 V84 Q96 96 84 96 H26 Q14 96 14 84 Z" ' + f + '/><path d="M14 40 H2 M96 40 H108" ' + LINE + '/>'; },
    bucket: function (f) { return '<path d="M12 20 H98 L88 96 H22 Z" ' + f + '/><path d="M12 20 Q55 -14 98 20" fill="none" ' + LINE + '/>'; },
    bowl: function (f) { return '<path d="M4 44 H106 Q100 96 55 96 Q10 96 4 44 Z" ' + f + '/>'; },
    kettle: function (f) { return '<path d="M24 30 H86 V90 Q86 96 80 96 H30 Q24 96 24 90 Z" ' + f + '/><path d="M86 46 L106 30 M40 30 Q55 6 70 30" fill="none" ' + LINE + '/>'; },
    vase: function (f) { return '<path d="M38 8 H72 V24 Q96 44 86 80 Q80 96 55 96 Q30 96 24 80 Q14 44 38 24 Z" ' + f + '/>'; },
    bottle: function (f) { return '<path d="M46 4 H64 V22 Q80 30 80 46 V92 Q80 96 76 96 H34 Q30 96 30 92 V46 Q30 30 46 22 Z" ' + f + '/>'; }
  };
  var CNAME = Object.keys(CONT);
  function contG(k, x, y, lvl, spill) {
    var id = 'tmc' + Math.floor(Math.random() * 1e9), out = 'style="fill:none;stroke:var(--ink)" stroke-width="3" stroke-linejoin="round"', wy = r1(100 - 92 * Math.min(1, lvl || 0));
    var s = '<defs><clipPath id="' + id + '">' + CONT[k]('') + '</clipPath></defs>';
    if (lvl) s += '<rect x="0" y="' + wy + '" width="110" height="' + r1(100 - wy) + '" clip-path="url(#' + id + ')" style="fill:color-mix(in srgb,var(--sb) 55%,var(--card))"/>';
    s += CONT[k](out);
    if (spill) s += '<path d="M96 22 q10 6 8 30 q-2 26 6 44" fill="none" style="stroke:var(--sb)" stroke-width="6" stroke-linecap="round" opacity=".7"/><ellipse cx="104" cy="100" rx="22" ry="5" style="fill:var(--sb)" opacity=".5"/>';
    return '<g class="ct" data-k="' + k + '" transform="translate(' + x + ' ' + y + ')">' + s + '</g>';
  }
  function cup(x, y, lvl) {
    var w = lvl >= 1 ? 26 : 26 * lvl, s = '<path d="M' + (x + 2) + ' ' + y + ' H' + (x + 30) + ' L' + (x + 27) + ' ' + (y + 30) + ' H' + (x + 5) + ' Z" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.2" stroke-linejoin="round"/>';
    s += '<rect x="' + (x + 5) + '" y="' + r1(y + 30 - w) + '" width="22" height="' + r1(w) + '" style="fill:color-mix(in srgb,var(--sb) 60%,var(--card))"/>';
    return '<g class="cup">' + s + '</g>';
  }
  /* a container and the n cups it took to fill it; o.lvl = how full each cup was, o.spill, o.c (how full the container ends up) */
  function cupsFig(n, k, o) {
    o = o || {};
    var per = 8, rows = Math.ceil(n / per), s = contG(k, 4, 6, o.c == null ? 1 : o.c, o.spill) + T(59, 128, k, 16, 't2'), i;
    for (i = 0; i < n; i++) s += cup(132 + (i % per) * 36, 10 + Math.floor(i / per) * 40, o.lvl || 1);
    return A.svg(132 + per * 36, Math.max(136, 14 + rows * 40), s, 'A ' + k + ' and the cups of water it took to fill it');
  }
  /* a jar filled with balls (gaps between them) or with water (no gaps) */
  function jarFig(kind) {
    var s = '<path d="M20 20 H120 V150 Q120 160 110 160 H30 Q20 160 20 150 Z" style="fill:var(--card);stroke:var(--ink)" stroke-width="3"/>', i, j;
    if (kind === 'water') s += '<rect x="23" y="34" width="94" height="123" style="fill:color-mix(in srgb,var(--sb) 55%,var(--card))"/>';
    else for (i = 0; i < 4; i++) for (j = 0; j < 3; j++) s += '<circle cx="' + (40 + j * 30) + '" cy="' + (143 - i * 30) + '" r="14" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(140, 168, s, kind === 'water' ? 'A jar full of water' : 'A jar full of balls, with gaps between them');
  }
  /* estimate: one jug (it holds n cups) and a big container that holds about k jugs */
  function estFig(n, k, big) {
    var s = contG('kettle', 4, 10, 1) + T(59, 132, '1 jug: ' + n + ' cups', 15), i;
    s += contG(big, 160, 10, 1) + T(215, 132, big + ': about ' + k + ' jugs', 15);
    for (i = 0; i < k; i++) s += '<g transform="translate(' + (286 + (i % 4) * 34) + ' ' + (14 + Math.floor(i / 4) * 54) + ') scale(.3)">' + CONT.kettle('style="fill:color-mix(in srgb,var(--sb) 40%,var(--card));stroke:var(--ink)" stroke-width="6"') + '</g>';
    return A.svg(430, 142, s, 'One jug, and a ' + big + ' that holds about ' + k + ' jugs');
  }

  function sym(s) { return s.sym ? '<p class="g3-sym">' + s.sym + '</p>' : ''; }
  function view(fig) { return function (s) { return '<div>' + fig(s) + sym(s) + '</div>'; }; }
  /* a Watch or My turn clip: list = [[line, change to the picture (or a list of changes), ms], ...] */
  function clip(draw, start, list) {
    return { mount: G3.view(view(draw), start), steps: list.map(function (s) {
      var st = { say: s[0], ms: s[2] || 1900 }, p = s[1];
      if (p) st.act = function (t) { return Array.isArray(p) ? t.seq(p, 450) : t.set(p, 700); };
      return st;
    }) };
  }

  /* ---------- skills: one per idea. DEF[id] = [[minLevel, shape, fn(lv), maxLevel], ...], the first is "plain" ---------- */
  var DEF = {}, SKILLS = [];
  function skill(id, name, code, list) { DEF[id] = list; SKILLS.push({ id: id, name: name, code: code }); }
  function ck(id, shape, lv) { return function () { var s = DEF[id].filter(function (x) { return x[1] === shape; })[0], q = s[2](lv); q.shape = shape; return q; }; }

  /* ======================= Lesson 1: Read a clock ======================= */
  /* ---------- the hour hand ---------- */
  function hrCase(lv) { return { h: R.int(1, 12), m: lv === 1 ? 0 : lv === 2 ? R.pick([0, 15, 30]) : R.pick([40, 45, 50, 55]) }; }
  function hrFix(c) { var f = {}; f[nxt(c.h)] = 'The short hand has not reached ' + nxt(c.h) + ' yet. Use the number it has passed.'; f[c.m ? c.m / 5 : 12] = 'That is the long hand. Read the short hand.'; return f; }
  function hrStep(c) { return c.m ? 'The short hand has passed ' + c.h + ', not ' + nxt(c.h) + ' yet.' : 'The short hand points right at ' + c.h + '.'; }
  skill('tm-hour', 'Read the hour hand', 'E2.6', [
    [1, 'plain', function (lv) { var c = hrCase(lv); return num('What hour is it? Read the short hand.', c.h, hrFix(c), { fig: clock(c.h, c.m), hint: 'Short hand: the hour. Use the number it points to or has just passed.', steps: [hrStep(c)], explain: 'The hour is ' + c.h + '.', meta: { k: 'g3tm-hr-num' } }); }],
    [1, 'mc', function (lv) {
      var c = hrCase(lv), W = [[String(nxt(c.h)), 'The short hand has not reached ' + nxt(c.h) + ' yet.'], [String(c.m ? c.m / 5 : 12), 'That is where the long hand points.'], [String(prv(c.h)), 'Look again at the short hand.']];
      return mc('The short hand shows the hour. What hour is it?', String(c.h), W, { fig: clock(c.h, c.m), hint: 'Find the short, thick hand.', steps: [hrStep(c)], explain: 'The hour is ' + c.h + '.', meta: { k: 'g3tm-hr-mc' } });
    }],
    [1, 'tap', function (lv) {
      var h = R.pick([1, 2, 3, 4, 5, 7, 8, 9, 10, 11]), m = lv === 1 ? 0 : 30, set = [[h, m], [m ? prv(h) : nxt(h), m], m ? [6, h * 5] : [12, h * 5]], order = R.shuffle([0, 1, 2]), say = m ? 'half past ' + h : h + ' o\'clock';
      return { q: 'Tap the clock that shows <b>' + say + '</b>.', type: 'tap', tiles: order.map(function (i) { return clock(set[i][0], set[i][1]); }), answer: order.indexOf(0), answerText: 'the clock with the short hand ' + (m ? 'halfway past ' : 'on ') + h,
        hint: 'Short hand: the hour. Long hand: the minutes.', steps: [m ? 'Half past ' + h + ': the long hand is on 6 and the short hand is halfway past ' + h + '.' : h + ' o\'clock: the long hand is on 12 and the short hand is on ' + h + '.'], explain: 'Short hand on ' + h + (m ? ' and a half' : '') + '.', meta: { k: 'g3tm-hr-tap', h: h, m: m } };
    }],
    [2, 'tf', function (lv) {
      var c = hrCase(lv), who = Q.name(), truth = coin(), bad = [nxt(c.h), c.m ? c.m / 5 : 12, prv(c.h)].filter(function (x) { return x !== c.h; }), said = truth ? c.h : R.pick(bad);
      return tf(who + ' says the hour is <b>' + said + '</b>. True or false?', truth, hrStep(c), ['The long hand shows the hour.', 'Use the number the short hand is closest to.', 'The hour is always the number at the top.'], 'Use the short hand, and the number it has passed.',
        { fig: clock(c.h, c.m), hint: 'Which hand shows the hour?', meta: { k: 'g3tm-hr-tf', said: said } });
    }],
    [2, 'later', function (lv) {
      var h = R.int(1, 12), k = lv === 2 ? R.int(2, 5) : R.int(5, 11), back = lv === 3 && coin(), ans = back ? ((h - 1 - k) % 12 + 12) % 12 + 1 : (h - 1 + k) % 12 + 1, f = {};
      f[back ? h - k : h + k] = 'After 12 the hours start again at 1.';
      return num('The clock shows ' + h + ' o\'clock. What hour will it be <b>' + k + ' hours ' + (back ? 'earlier' : 'later') + '</b>?', ans, f, { fig: clock(h, 0), hint: 'Count ' + (back ? 'back' : 'on') + ' ' + k + ' numbers with the short hand.',
        steps: ['Count ' + (back ? 'back' : 'on') + ' ' + k + ' from ' + h + '.', 'After 12 comes 1. It will be ' + ans + ' o\'clock.'], explain: ans + ' o\'clock.', meta: { k: 'g3tm-hr-later', h: h, n: back ? -k : k } });
    }]
  ]);
  function tgHour(lv) {
    return function () {
      var c = hrCase(lv), g = {}, f = {};
      g[0] = 'The long hand is the minute hand.'; f[nxt(c.h)] = 'It has not reached ' + nxt(c.h) + ' yet.';
      return { q: 'What hour is it?', fig: clock(c.h, c.m), done: 'The hour is ' + c.h + '.', steps: [
        { prompt: 'Two hands. Which one shows the hour?', q: fixed('Which hand shows the hour?', ['the long hand', 'the short hand'], 1, g, { hint: 'The short, thick hand.', meta: { k: 'g3tm-hr-hand' } }) },
        { prompt: 'Find the number it points to, or has just passed.', q: num('What hour is it?', c.h, f, { fig: clock(c.h, c.m), hint: hrStep(c), meta: { k: 'g3tm-hr-num' } }) }
      ] };
    };
  }

  /* ---------- minutes by 5s ---------- */
  function fvCase(lv) { return { h: R.int(1, 12), m: 5 * (lv === 1 ? R.int(1, 6) : R.int(1, 11)) }; }
  function fvFix(c) { var f = {}; f[c.m / 5] = 'The long hand points to ' + c.m / 5 + '. Count by 5s that many times.'; f[c.m + 5] = 'Count by 5s again, starting at 12.'; return f; }
  function fvSteps(c) { var p = []; for (var i = 5; i <= c.m; i += 5) p.push(i); return ['Start at 12. Count by 5s: ' + p.join(', ') + '.', c.m + ' minutes past ' + c.h + ': ' + tt(c.h, c.m) + '.']; }
  skill('tm-five', 'Count the minutes by 5s', 'E2.6', [
    [1, 'plain', function (lv) { var c = fvCase(lv); return num('Count by 5s. How many minutes past the hour is it?', c.m, fvFix(c), { unit: 'minutes', fig: clock(c.h, c.m, { fives: lv === 1 }), hint: 'Start at 12 and count by 5s to the long hand.', steps: fvSteps(c), explain: c.m + ' minutes.', meta: { k: 'g3tm-fv-num' } }); }],
    [1, 'fill', function (lv) { var c = fvCase(lv); return fill('Read the clock. Fill in the blanks.', 'It is [[]] minutes past [[]].', [c.m, c.h], { fig: clock(c.h, c.m, { fives: lv === 1 }), hint: 'Long hand: count by 5s. Short hand: the hour.', steps: fvSteps(c), explain: tt(c.h, c.m) + '.', meta: { k: 'g3tm-fv-fill' } }); }],
    [1, 'mc', function (lv) {
      var c = fvCase(lv), W = [[tt(c.h, c.m / 5), 'That uses the number, not the minutes. Count by 5s.'], [tt(c.h, c.m === 55 ? 50 : c.m + 5), 'Count by 5s again.'], [tt(nxt(c.h), c.m), 'The hour is the number the short hand has passed.']];
      if (c.m / 5 !== c.h) W.splice(1, 0, [tt(c.m / 5, c.h * 5 % 60), 'Short hand: hours. Long hand: minutes.']);
      return mc('What time is it?', tt(c.h, c.m), W, { fig: clock(c.h, c.m), hint: 'Hour first, then count the minutes by 5s.', steps: fvSteps(c), explain: tt(c.h, c.m) + '.', meta: { k: 'g3tm-fv-mc' } });
    }],
    [2, 'tf', function (lv) {
      var c = fvCase(lv), who = Q.name(), truth = coin(), said = truth ? tt(c.h, c.m) : coin() ? tt(c.h, c.m / 5) : tt(c.h, c.m === 55 ? 50 : c.m + 5);
      return tf(who + ' says it is <b>' + said + '</b>. True or false?', truth, fvSteps(c)[1], ['The number the long hand points to is the minutes.', 'Count by 10s around the clock.', 'Read the long hand as the hour.'], 'Count by 5s from 12 to the long hand.',
        { fig: clock(c.h, c.m), hint: 'Count by 5s.', meta: { k: 'g3tm-fv-tf', said: said } });
    }],
    [2, 'until', function (lv) {
      var c = fvCase(2), to = lv === 3 ? R.pick([10, 15, 20, 30]) : 0, ans = 60 - c.m + to, f = {}; f[c.m] = 'That is minutes past. Count on to the next hour.'; f[c.m / 5] = 'Count by 5s, not by 1s.';
      return num('How many minutes until <b>' + tt(nxt(c.h), to) + '</b>?', ans, f, { unit: 'minutes', fig: clock(c.h, c.m), hint: 'Count by 5s from the long hand up to 12' + (to ? ', then on to ' + to + '.' : '.'),
        steps: ['From ' + tt(c.h, c.m) + ' to ' + nxt(c.h) + ':00 is ' + (60 - c.m) + ' minutes.', to ? (60 - c.m) + ' + ' + to + ' = ' + ans + ' minutes.' : 'So ' + ans + ' minutes.'], explain: ans + ' minutes.', meta: { k: 'g3tm-fv-until' } });
    }]
  ]);
  function tgFive(lv) {
    return function () {
      var c = fvCase(lv), f1 = {}, f2 = fvFix(c); f1[nxt(c.h)] = 'It has not reached ' + nxt(c.h) + '.';
      return { q: 'What time is it?', fig: clock(c.h, c.m, { fives: lv === 1 }), done: tt(c.h, c.m) + '.', steps: [
        { prompt: 'Short hand first.', q: num('What hour?', c.h, f1, { hint: 'The number the short hand has passed.', meta: { k: 'g3tm-fv-hour', h: c.h } }) },
        { prompt: 'Now the long hand. Count by 5s from 12.', q: num('How many minutes?', c.m, f2, { unit: 'minutes', hint: 'Count by 5s.', meta: { k: 'g3tm-fv-min', m: c.m } }) }
      ] };
    };
  }

  /* ---------- to the minute ---------- */
  function mnCase(lv) { var m; do { m = lv === 1 ? R.int(6, 29) : lv === 2 ? R.int(1, 59) : R.int(36, 59); } while (m % 5 === 0); return { h: R.int(1, 12), m: m }; }
  function mnSteps(c) { var f = Math.floor(c.m / 5) * 5; return [(f ? 'By 5s to ' + f : 'Start at 12') + ', then ' + (c.m - f) + ' more by 1s.', c.m + ' minutes past ' + c.h + ': ' + tt(c.h, c.m) + '.']; }
  function mnFix(c) { var f = {}; f[Math.floor(c.m / 5) * 5] = 'Count on the small marks too.'; f[Math.ceil(c.m / 5) * 5] = 'The long hand has not reached that number yet.'; return f; }
  skill('tm-minute', 'Read to the exact minute', 'E2.6', [
    [1, 'plain', function (lv) { var c = mnCase(lv); return num('What minute is it? Count by 5s, then by 1s.', c.m, mnFix(c), { unit: 'minutes past', fig: clock(c.h, c.m, { fives: lv === 1 }), hint: 'Count by 5s to the last number the long hand passed, then the small marks.', steps: mnSteps(c), explain: c.m + ' minutes past ' + c.h + '.', meta: { k: 'g3tm-mn-num' } }); }],
    [1, 'fill', function (lv) { var c = mnCase(lv); return fill('Read the clock. Fill in the blanks.', 'The hour is [[]]. The minutes are [[]].', [c.h, c.m], { fig: clock(c.h, c.m), hint: 'Short hand, then long hand.', steps: mnSteps(c), explain: tt(c.h, c.m) + '.', meta: { k: 'g3tm-mn-fill' } }); }],
    [1, 'mc', function (lv) {
      var c = mnCase(lv), lo = Math.floor(c.m / 5) * 5;
      return mc('What time is it?', tt(c.h, c.m), [[tt(c.h, lo), 'Count the small marks after ' + (lo || 12) + ' too.'], [tt(nxt(c.h), c.m), 'The short hand has not reached ' + nxt(c.h) + ' yet.'], [tt(c.h, c.m + (c.m % 5 === 4 ? -2 : 1)), 'Count the small marks one at a time.']],
        { fig: clock(c.h, c.m), hint: 'Hour, then minutes: by 5s, then by 1s.', steps: mnSteps(c), explain: tt(c.h, c.m) + '.', meta: { k: 'g3tm-mn-mc' } });
    }],
    [2, 'tf', function (lv) {
      var c = mnCase(lv), who = Q.name(), truth = coin(), said = truth ? tt(c.h, c.m) : lv === 3 && coin() ? tt(nxt(c.h), c.m) : tt(c.h, Math.floor(c.m / 5) * 5);
      return tf(who + ' says it is <b>' + said + '</b>. True or false?', truth, mnSteps(c)[1], ['Round to the nearest 5 minutes.', 'Use the number the short hand is closest to.', 'The small marks do not count.'], 'Count by 5s, then the small marks. Check the short hand.',
        { fig: clock(c.h, c.m), hint: 'Count every small mark.', meta: { k: 'g3tm-mn-tf', said: said } });
    }],
    [2, 'marks', function (lv) {
      var c = mnCase(lv), k = Math.floor(c.m / 5), j = c.m % 5, f = {}; f[k + j] = 'Each number is 5 minutes. Count by 5s to the ' + (k || 12) + ' first.'; f[k * 5] = 'Add the ' + j + ' small marks.';
      return num('The long hand is <b>' + j + ' small mark' + (j > 1 ? 's' : '') + '</b> past the <b>' + (k || 12) + '</b>. How many minutes past the hour is it?', c.m, f, { unit: 'minutes', fig: clock(c.h, c.m), hint: (k || 12) + ' is ' + k * 5 + ' minutes. Then count on.',
        steps: [(k || 12) + ' on the clock is ' + k * 5 + ' minutes.', k * 5 + ' + ' + j + ' = ' + c.m + '.'], explain: c.m + ' minutes.', meta: { k: 'g3tm-mn-marks' } });
    }]
  ]);
  function tgMinute(lv) {
    return function () {
      var c = mnCase(lv), lo = Math.floor(c.m / 5) * 5, f1 = {}, f3 = {}; f1[lo / 5] = 'Count by 5s: that number is ' + lo + ' minutes.'; f3[lo] = 'Add the small marks.';
      return { q: 'What time is it?', fig: clock(c.h, c.m), done: tt(c.h, c.m) + '.', steps: [
        { prompt: 'By 5s to the last number the long hand passed.', q: num('How many minutes so far?', lo, f1, { unit: 'minutes', hint: 'Count by 5s from 12.', meta: { k: 'g3tm-mn-five', m: c.m } }) },
        { prompt: 'Now count the small marks after it.', q: num('How many small marks?', c.m - lo, {}, { hint: 'Count them one at a time.', meta: { k: 'g3tm-mn-left', m: c.m } }) },
        { prompt: 'Add them, and read the hour.', q: fill('Fill in the time.', '[[]]:[[]]', [c.h, c.m], { hint: lo + ' + ' + (c.m - lo) + '.', meta: { k: 'g3tm-mn-fill', h: c.h, m: c.m } }) }
      ] };
    };
  }

  /* ---------- quarter past, half past, quarter to ---------- */
  function wdCase(lv) { return { h: R.int(1, 12), m: lv === 1 ? R.pick([0, 30, 15]) : lv === 2 ? R.pick([15, 30, 45]) : R.pick([45, 35, 40, 50, 55, 10, 20, 25]) }; }
  function wdWhy(c) { return c.m === 45 ? '15 minutes before ' + nxt(c.h) + ': quarter to ' + nxt(c.h) + '.' : c.m === 30 ? 'Halfway around: half past ' + c.h + '.' : c.m === 15 ? 'A quarter of the way around: quarter past ' + c.h + '.' : c.m === 0 ? 'Long hand on 12: ' + c.h + ' o\'clock.' : c.m > 30 ? (60 - c.m) + ' minutes before ' + nxt(c.h) + ': ' + words(c.h, c.m) + '.' : c.m + ' minutes after ' + c.h + ': ' + words(c.h, c.m) + '.'; }
  function wdWrong(c) {
    var w = [];
    if (c.m === 45) w = [['quarter past ' + nxt(c.h), 'Past means after the hour. The long hand on 9 is quarter to.'], ['quarter to ' + c.h, 'Quarter to is named for the next hour: ' + nxt(c.h) + '.'], ['half past ' + c.h, 'Half past is the long hand on 6.']];
    else if (c.m === 15) w = [['quarter to ' + c.h, 'The long hand on 3 is quarter past.'], ['quarter past ' + nxt(c.h), 'The short hand has just passed ' + c.h + '.'], ['half past ' + c.h, 'Half past is the long hand on 6.']];
    else if (c.m === 30) w = [['half past ' + nxt(c.h), 'Half past is named for the hour it has passed: ' + c.h + '.'], ['quarter past ' + c.h, 'Quarter past is the long hand on 3.'], ['quarter to ' + nxt(c.h), 'Quarter to is the long hand on 9.']];
    else if (c.m === 0) w = [[nxt(c.h) + ' o\'clock', 'The short hand points at ' + c.h + '.'], ['half past ' + c.h, 'Half past is the long hand on 6.'], ['quarter past ' + c.h, 'Quarter past is the long hand on 3.']];
    else if (c.m > 30) w = [[(60 - c.m) + ' minutes to ' + c.h, 'Minutes to are named for the next hour: ' + nxt(c.h) + '.'], [(60 - c.m) + ' minutes past ' + c.h, 'The long hand is past the 6, so count the minutes to the next hour.'], ['quarter to ' + nxt(c.h), 'Quarter to is the long hand on 9.']];
    else w = [[c.m + ' minutes to ' + c.h, 'The long hand has not reached the 6: count the minutes past.'], [c.m + ' minutes past ' + nxt(c.h), 'The short hand has just passed ' + c.h + '.'], ['half past ' + c.h, 'Half past is the long hand on 6.']];
    return w;
  }
  skill('tm-words', 'Quarter past, half past, quarter to', 'E2.6', [
    [1, 'plain', function (lv) { var c = wdCase(lv); return mc('How do you say this time?', words(c.h, c.m), wdWrong(c), { fig: clock(c.h, c.m), hint: 'Long hand on 3: quarter past. On 6: half past. On 9: quarter to.', steps: [wdWhy(c)], explain: cap(words(c.h, c.m)) + '.', meta: { k: 'g3tm-wd-mc' } }); }],
    [1, 'num', function (lv) {
      var c = wdCase(lv); if (c.m === 0) c.m = 30;
      var f = {}; f[60 - c.m] = 'That counts the minutes to the hour. Write the minutes past ' + c.h + '.'; f[c.m === 45 ? 15 : 45] = c.m === 45 ? 'Quarter to is 15 minutes before the hour: 45 past.' : 'Quarter past is 15 minutes after the hour.';
      return num('<b>' + cap(words(c.h, c.m)) + '</b> is the same as <b>' + c.h + ':__</b>. What are the minutes?', c.m, f, { unit: 'minutes', fig: clock(c.h, c.m), hint: 'Quarter past: 15. Half past: 30. Quarter to: 45.', steps: [wdWhy(c), 'So it is ' + tt(c.h, c.m) + '.'], explain: tt(c.h, c.m) + '.', meta: { k: 'g3tm-wd-num' } });
    }],
    [1, 'match', function (lv) {
      var ms = lv === 1 ? [0, 15, 30] : lv === 2 ? [15, 30, 45] : R.shuffle([45, 40, 50, 15, 30]).slice(0, 3), h = R.int(1, 12), pairs = ms.map(function (m) { return [cap(words(h, m)), tt(h, m)]; });
      return { q: 'Match each time to its digital time.', type: 'match', pairs: pairs, hint: 'Quarter to is named for the next hour.', steps: pairs.map(function (p) { return p[0] + ' = ' + p[1] + '.'; }), explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'g3tm-wd-match' } };
    }],
    [2, 'tf', function (lv) {
      var c = wdCase(lv); if (c.m === 0) c.m = 45;
      var truth = coin(), said = truth ? tt(c.h, c.m) : c.m >= 30 && c.m !== 30 ? tt(nxt(c.h), c.m) : c.m === 30 ? tt(nxt(c.h), 30) : tt(c.h, 45);
      return tf('True or false: <b>' + words(c.h, c.m) + '</b> is <b>' + said + '</b>.', truth, cap(words(c.h, c.m)) + ' is ' + tt(c.h, c.m) + '.', ['Quarter to 7 is 7:45.', 'Half past is 50 minutes.', 'Quarter past is 25 minutes.'], 'Picture the long hand, and which hour the short hand has passed.',
        { fig: lv === 3 ? '' : clock(c.h, c.m), hint: 'Quarter to is 15 minutes before the next hour.', meta: { k: 'g3tm-wd-tf', w: words(c.h, c.m), said: said } });
    }],
    [2, 'fill', function (lv) {
      var c = wdCase(lv), text, ans;
      if (c.m === 45) { text = 'It is [[]]:45. Say it: quarter to [[]].'; ans = [c.h, nxt(c.h)]; }
      else if (c.m === 30) { text = 'It is [[]]:30. Say it: half past [[]].'; ans = [c.h, c.h]; }
      else if (c.m === 15) { text = 'It is [[]]:15. Say it: quarter past [[]].'; ans = [c.h, c.h]; }
      else if (c.m > 30) { text = 'It is [[]]:' + c.m + '. Say it: [[]] minutes to [[]].'; ans = [c.h, 60 - c.m, nxt(c.h)]; }
      else { text = 'It is [[]]:' + pad(c.m) + '. Say it: [[]] minutes past [[]].'; ans = [c.h, c.m, c.h]; }
      return fill('Read the clock. Fill in the blanks.', text, ans, { fig: clock(c.h, c.m), hint: 'Past: after the hour it passed. To: before the next hour.', steps: [wdWhy(c)], explain: tt(c.h, c.m) + ' is ' + words(c.h, c.m) + '.', meta: { k: 'g3tm-wd-fill' } });
    }]
  ]);
  function tgWords(m) {
    return function () {
      var h = R.int(1, 12), c = { h: h, m: m }, g = {}, past = m <= 30, f = {};
      g[past ? 1 : 0] = past ? 'The long hand has not passed the 6 yet.' : 'The long hand is past the 6: it is nearer the next hour.';
      f[past ? nxt(h) : h] = past ? 'Past is after the hour the short hand passed: ' + h + '.' : 'To is before the next hour: ' + nxt(h) + '.';
      return { q: 'How do you say this time?', fig: clock(h, m), done: cap(words(h, m)) + '.', steps: [
        { prompt: 'Is the long hand before the 6 or after it?', q: fixed('Past or to?', ['past', 'to'], past ? 0 : 1, g, { hint: 'Before the 6: past. After the 6: to.', meta: { k: 'g3tm-wd-way', m: m } }) },
        { prompt: past ? 'Past: name the hour it has passed.' : 'To: name the next hour.', q: num('Which hour do you say?', past ? h : nxt(h), f, { hint: past ? 'The short hand has passed it.' : 'The short hand is heading to it.', meta: { k: 'g3tm-wd-hour', h: h, m: m } }) },
        { prompt: 'Say the whole time.', q: mc('So it is:', words(h, m), wdWrong(c), { hint: wdWhy(c), meta: { k: 'g3tm-wd-say', h: h, m: m } }) }
      ] };
    };
  }

  /* ======================= Lesson 2: Digital time, timers and units ======================= */
  /* ---------- digital clocks ---------- */
  function dgCase(lv) { return { h: R.int(1, 12), m: lv === 1 ? 5 * R.int(1, 11) : lv === 2 ? R.int(1, 59) : R.int(1, 9) }; }
  function dgSteps(c) { return ['The short hand: ' + c.h + '. The long hand: ' + c.m + ' minutes.', 'Hours, a colon, then 2 digits for minutes: ' + tt(c.h, c.m) + '.']; }
  function dgWrong(c) {
    var w = [], swap = c.m < 10 ? c.m * 10 : (c.m % 10) * 10 + Math.floor(c.m / 10);
    if (swap !== c.m && swap < 60) w.push([tt(c.h, swap), c.m < 10 ? 'Only ' + c.m + ' minutes past: a 0 comes first.' : 'Check the order of the minute digits.']);
    if (c.m % 5 === 0 && c.m / 5 !== c.h) w.push([tt(c.m / 5, c.h * 5 % 60), 'Short hand: hours. Long hand: minutes.']);
    w.push([tt(nxt(c.h), c.m), 'The hour is the number the short hand has passed.'], [tt(c.h, (c.m + 10) % 60), 'Count the minutes again.']);
    return w;
  }
  skill('tm-digital', 'Digital clocks', 'E2.6', [
    [1, 'plain', function (lv) { var c = dgCase(lv); return fill('Write the time the clock shows.', '[[]]:[[]]', [c.h, c.m], { fig: clock(c.h, c.m), hint: 'Hours before the colon, minutes after it.', steps: dgSteps(c), explain: tt(c.h, c.m) + '.', meta: { k: 'g3tm-dg-fill' } }); }],
    [1, 'mc', function (lv) { var c = dgCase(lv); return mc('Which digital time matches the clock?', tt(c.h, c.m), dgWrong(c), { fig: clock(c.h, c.m), hint: 'Hour first. Then the minutes, with 2 digits.', steps: dgSteps(c), explain: tt(c.h, c.m) + '.', meta: { k: 'g3tm-dg-mc' } }); }],
    [1, 'tap', function (lv) {
      var c = dgCase(lv), seen = {}, set = [[c.h, c.m]]; seen[tt(c.h, c.m)] = 1;
      dgWrong(c).forEach(function (w) { var p = w[0].split(':').map(Number); if (set.length < 3 && !seen[w[0]]) { seen[w[0]] = 1; set.push(p); } });
      var order = R.shuffle([0, 1, 2]);
      return { q: 'Tap the clock that shows <b>' + tt(c.h, c.m) + '</b>.', type: 'tap', tiles: order.map(function (i) { return clock(set[i][0], set[i][1]); }), answer: order.indexOf(0), answerText: 'the clock showing ' + words(c.h, c.m),
        hint: tt(c.h, c.m) + ' is ' + c.m + ' minute' + (c.m > 1 ? 's' : '') + ' past ' + c.h + '.', steps: dgSteps(c), explain: words(c.h, c.m) + '.', meta: { k: 'g3tm-dg-tap' } };
    }],
    [2, 'tf', function (lv) {
      var c = dgCase(lv), who = Q.name(), truth = coin(), w = dgWrong(c)[0][0].split(':').map(Number), said = truth ? words(c.h, c.m) : words(w[0], w[1]);
      return tf('The clock shows ' + tt(c.h, c.m) + '. ' + who + ' says it is <b>' + said + '</b>. True or false?', truth, tt(c.h, c.m) + ' is ' + words(c.h, c.m) + '.', ['3:05 and 3:50 are the same.', 'The first number is the minutes.', 'The 0 does not matter.'], 'Read the minutes after the colon: ' + pad(c.m) + '.',
        { fig: digital(c.h, c.m), hint: 'Hours, then minutes.', meta: { k: 'g3tm-dg-tf', said: said } });
    }],
    [2, 'num', function (lv) {
      var c = dgCase(lv), until = lv === 3, ans = until ? 60 - c.m : c.m, f = {}; f[until ? c.m : c.m * 10] = until ? 'That is minutes past. Count on to the next hour.' : 'Read both minute digits: ' + pad(c.m) + '.';
      return num(until ? 'How many minutes until ' + nxt(c.h) + ':00?' : 'How many minutes past ' + c.h + ' is it?', ans, f, { unit: 'minutes', fig: digital(c.h, c.m), hint: until ? 'An hour is 60 minutes.' : 'The minutes come after the colon.',
        steps: until ? [tt(c.h, c.m) + ' is ' + c.m + ' minutes past.', '60 &minus; ' + c.m + ' = ' + ans + '.'] : [pad(c.m) + ' after the colon: ' + c.m + ' minutes past ' + c.h + '.'], explain: ans + ' minutes.', meta: { k: 'g3tm-dg-num' } });
    }]
  ]);
  function tgDigital(lv) {
    return function () {
      var c = dgCase(lv), f1 = {}, f2 = {}; f1[nxt(c.h)] = 'It has not reached ' + nxt(c.h) + '.'; f2[c.m < 10 ? c.m * 10 : c.m + 5] = 'Count the minutes again.';
      return { q: 'Write the digital time.', fig: clock(c.h, c.m), done: tt(c.h, c.m) + '.', steps: [
        { prompt: 'The hour goes before the colon.', q: num('What hour?', c.h, f1, { hint: 'The short hand.', meta: { k: 'g3tm-fv-hour', h: c.h } }) },
        { prompt: 'The minutes go after it.', q: num('How many minutes past?', c.m, f2, { unit: 'minutes', hint: 'By 5s, then by 1s.', meta: { k: 'g3tm-fv-min', m: c.m } }) },
        { prompt: 'Minutes always take 2 digits.', q: mc('So the clock shows:', tt(c.h, c.m), dgWrong(c), { hint: c.m < 10 ? 'Fewer than 10 minutes: write a 0 first.' : 'Hours, colon, minutes.', meta: { k: 'g3tm-dg-mc', h: c.h, m: c.m } }) }
      ] };
    };
  }

  /* ---------- timers ---------- */
  function twCase(lv) { return lv === 1 ? { mn: 1, sc: 5 * R.int(1, 11) } : lv === 2 ? { mn: R.int(1, 3), sc: R.int(1, 59) } : { mn: R.int(3, 9), sc: R.int(1, 59) }; }
  function twShow(c) { return c.mn + ':' + pad(c.sc); }
  skill('tm-timer', 'Timers: minutes and seconds', 'E2.6', [
    [1, 'plain', function (lv) {
      var c = twCase(lv), s = c.mn * 60 + c.sc, f = {}; f[c.mn * 100 + c.sc] = 'A minute is 60 seconds, not 100.'; f[c.mn + c.sc] = 'Each minute is 60 seconds. Change the minutes first.'; f[c.sc] = 'Add the ' + c.mn + ' minute' + (c.mn > 1 ? 's' : '') + ' too.';
      return num('The timer shows <b>' + twShow(c) + '</b>. How many seconds is that in all?', s, f, { unit: 'seconds', fig: timer(c.mn, c.sc), hint: 'Before the colon: minutes. 1 minute = 60 seconds.',
        steps: [c.mn + ' minute' + (c.mn > 1 ? 's' : '') + ' = ' + c.mn * 60 + ' seconds.', c.mn * 60 + ' + ' + c.sc + ' = ' + s + ' seconds.'], explain: s + ' seconds.', meta: { k: 'g3tm-tw-num' } });
    }],
    [1, 'fill', function (lv) {
      var c = twCase(lv), s = c.mn * 60 + c.sc;
      if (lv === 3) return fill('Fill in the blanks.', s + ' seconds = [[]] minutes [[]] seconds', [c.mn, c.sc], { hint: 'How many 60s fit in ' + s + '?', steps: [c.mn + ' &times; 60 = ' + c.mn * 60 + '.', s + ' &minus; ' + c.mn * 60 + ' = ' + c.sc + '.'], explain: c.mn + ' minutes ' + c.sc + ' seconds.', meta: { k: 'g3tm-tw-split', s: s } });
      return fill('Read the timer. Fill in the blanks.', '[[]] minute' + (c.mn > 1 ? 's' : '') + ' and [[]] seconds', [c.mn, c.sc], { fig: timer(c.mn, c.sc), hint: 'Minutes before the colon, seconds after it.', steps: ['Before the colon: ' + c.mn + '. After it: ' + pad(c.sc) + '.'], explain: c.mn + ' min ' + c.sc + ' s.', meta: { k: 'g3tm-tw-fill' } });
    }],
    [2, 'more', function (lv) {
      var c = twCase(lv), go = lv === 3 ? 2 : 1, ans = go * 60 - c.sc, f = {}; f[c.sc] = 'That is how many seconds have passed. How many are left to ' + (c.mn + go) + ':00?'; f[100 - c.sc] = 'A minute is 60 seconds, not 100.';
      return num('The timer shows <b>' + twShow(c) + '</b>. How many more seconds until it shows <b>' + (c.mn + go) + ':00</b>?', ans, f, { unit: 'seconds', fig: timer(c.mn, c.sc), hint: 'Count on to the next full minute' + (go > 1 ? ', then one more minute.' : '.'),
        steps: [(60 - c.sc) + ' seconds to ' + (c.mn + 1) + ':00.', go > 1 ? (60 - c.sc) + ' + 60 = ' + ans + '.' : 'So ' + ans + ' seconds.'], explain: ans + ' seconds.', meta: { k: 'g3tm-tw-more' } });
    }],
    [1, 'mc', function (lv) {
      var c = twCase(lv), sw = (c.sc % 10) * 10 + Math.floor(c.sc / 10), W = [[c.sc < 13 ? c.sc + ':' + pad(c.mn) : (c.mn + 1) + ':' + pad(c.sc), 'Minutes come before the colon.'], [c.mn + ':' + pad(c.sc === 30 ? 20 : 60 - c.sc), 'Read the seconds again.']];
      if (sw !== c.sc && sw < 60) W.unshift([c.mn + ':' + pad(sw), 'Check the order of the digits.']);
      W.push([(c.mn + 1) + ':' + pad(c.sc), 'Check the minutes.']);
      return mc('Which timer reading means <b>' + c.mn + ' minute' + (c.mn > 1 ? 's' : '') + ' and ' + c.sc + ' second' + (c.sc > 1 ? 's' : '') + '</b>?', twShow(c), W, { hint: 'Minutes, a colon, then 2 digits for seconds.', steps: ['Minutes: ' + c.mn + '. Seconds: ' + pad(c.sc) + '.'], explain: twShow(c) + '.', meta: { k: 'g3tm-tw-mc' } });
    }],
    [2, 'tf', function (lv) {
      var c = twCase(lv), who = Q.name(), s = c.mn * 60 + c.sc, truth = coin(), said = truth ? s : coin() ? c.mn * 100 + c.sc : c.mn + c.sc;
      return tf(who + ' says the timer shows <b>' + said + ' seconds</b> in all. True or false?', truth, c.mn + ' &times; 60 + ' + c.sc + ' = ' + s + ' seconds.', ['A minute is 100 seconds.', 'Add the two numbers on the timer.', 'Only the seconds count.'], '1 minute is 60 seconds. Change the minutes first.',
        { fig: timer(c.mn, c.sc), hint: 'How many seconds in 1 minute?', meta: { k: 'g3tm-tw-tf', said: said } });
    }],
    [2, 'race', function (lv) {
      var w = Q.two(), a, b;
      do { a = lv === 2 ? R.int(30, 59) : R.int(65, 200); b = lv === 2 ? R.int(61, 110) : R.int(a + 5, 240); } while (b <= a);
      var A1 = Math.floor(a / 60) + ':' + pad(a % 60), B1 = Math.floor(b / 60) + ':' + pad(b % 60), f = {}; f[b - a + 40] = 'A minute is 60 seconds, not 100.';
      return num(w[0] + '\'s timer stopped at <b>' + A1 + '</b>. ' + w[1] + '\'s stopped at <b>' + B1 + '</b>. How many seconds faster was ' + w[0] + '?', b - a, f, { unit: 'seconds', fig: '<div class="tm-pair" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">' + timer(Math.floor(a / 60), a % 60) + timer(Math.floor(b / 60), b % 60) + '</div>',
        hint: 'Change both to seconds, then subtract.', steps: [A1 + ' = ' + a + ' s. ' + B1 + ' = ' + b + ' s.', b + ' &minus; ' + a + ' = ' + (b - a) + '.'], explain: (b - a) + ' seconds faster.', meta: { k: 'g3tm-tw-race' } });
    }, 3]
  ]);
  function tgTimer(lv) {
    return function () {
      var c = twCase(lv), f1 = {}, f2 = {}; f1[c.mn * 100] = 'A minute is 60 seconds.'; f2[c.mn * 60] = 'Add the ' + c.sc + ' seconds.'; f2[c.mn * 100 + c.sc] = 'Use 60 seconds for each minute.';
      return { q: 'How many seconds does the timer show in all?', fig: timer(c.mn, c.sc), done: c.mn * 60 + ' + ' + c.sc + ' = ' + (c.mn * 60 + c.sc) + ' seconds.', steps: [
        { prompt: 'Minutes first: 60 seconds each.', q: num(c.mn + ' minute' + (c.mn > 1 ? 's' : '') + ' = ? seconds', c.mn * 60, f1, { unit: 'seconds', hint: c.mn + ' &times; 60.', meta: { k: 'g3tm-un-conv' } }) },
        { prompt: 'Now add the seconds after the colon.', q: num(c.mn * 60 + ' + ' + c.sc + ' = ?', c.mn * 60 + c.sc, f2, { unit: 'seconds', hint: 'Add the two parts.', meta: { k: 'g3tm-add' } }) }
      ] };
    };
  }

  /* ---------- seconds, minutes and hours ---------- */
  var TAKES = [['blink your eyes', 'seconds'], ['sneeze', 'seconds'], ['clap 5 times', 'seconds'], ['tie your shoes', 'seconds'], ['brush your teeth', 'minutes'], ['eat lunch', 'minutes'], ['have recess', 'minutes'], ['bake muffins', 'minutes'], ['sleep at night', 'hours'], ['spend a school day', 'hours'], ['drive from Toronto to Ottawa', 'hours'], ['paddle across a big lake', 'hours']];
  var TU = { second: 1, minute: 60, hour: 3600 };
  function tuName(n, u) { return n + ' ' + u + (n === 1 ? '' : 's'); }
  function unCase(lv) {
    var big = coin() ? 'minute' : 'hour', small = big === 'minute' ? 'second' : 'minute', k = lv === 1 ? R.int(1, 3) : R.int(2, 6), x = lv === 3 ? R.int(1, 11) * 5 : 0;
    return { big: big, small: small, k: k, x: x, tot: k * 60 + x };
  }
  skill('tm-units', 'Seconds, minutes and hours', 'E2.6', [
    [1, 'plain', function (lv) {
      var c = unCase(lv), back = lv === 2 && coin(), f = {}, q, ans, u;
      if (back) { q = tuName(c.tot, c.small) + ' = ___ ' + c.big + 's'; ans = c.k; u = c.big + 's'; f[c.tot / 10] = '60 ' + c.small + 's make 1 ' + c.big + ', not 10.'; }
      else { q = tuName(c.k, c.big) + (c.x ? ' ' + tuName(c.x, c.small) : '') + ' = ___ ' + c.small + 's'; ans = c.tot; u = c.small + 's'; f[c.k * 100 + c.x] = 'There are 60, not 100.'; f[c.k + c.x] = 'Change the ' + c.big + 's first: 60 each.'; }
      return num(q, ans, f, { unit: u, hint: '60 seconds = 1 minute. 60 minutes = 1 hour.', steps: [back ? c.tot + ' &divide; 60 = ' + c.k + '.' : c.k + ' &times; 60 = ' + c.k * 60 + (c.x ? ', and ' + c.k * 60 + ' + ' + c.x + ' = ' + c.tot : '') + '.'], explain: q.replace('___', ans) + '.', meta: { k: 'g3tm-un-conv' } });
    }],
    [1, 'match', function () {
      var us = ['seconds', 'minutes', 'hours'], pairs = us.map(function (u) { return [cap(R.pick(TAKES.filter(function (t) { return t[1] === u; }))[0]), u]; });
      return { q: 'Match each activity to the unit you would use to time it.', type: 'match', pairs: pairs, hint: 'Very quick: seconds. A while: minutes. Most of a day: hours.', steps: pairs.map(function (p) { return p[0] + ': ' + p[1] + '.'; }), explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'g3tm-un-match' } };
    }],
    [2, 'pick', function () {
      var u = R.pick(['seconds', 'minutes', 'hours']), good = R.shuffle(TAKES.filter(function (t) { return t[1] === u; })).slice(0, 2), bad = R.shuffle(TAKES.filter(function (t) { return t[1] !== u; })).slice(0, 3), opts = R.shuffle(good.concat(bad)), ans = [];
      opts.forEach(function (t, j) { if (t[1] === u) ans.push(j); });
      return { q: 'Pick <b>every</b> activity that takes a few <b>' + u + '</b>.', type: 'pick', options: opts.map(function (t) { return cap(t[0]); }), answer: ans, hint: 'Picture doing each one.', steps: opts.map(function (t) { return cap(t[0]) + ': ' + t[1] + '.'; }), explain: ans.map(function (j) { return cap(opts[j][0]); }).join(' and ') + '.', meta: { k: 'g3tm-un-pick', u: u } };
    }],
    [1, 'tf', function (lv) {
      var c = unCase(lv === 3 ? 2 : lv), truth = coin(), said = truth ? c.k * 60 : c.k * R.pick([10, 100]);
      return tf('True or false: <b>' + tuName(c.k, c.big) + ' = ' + tuName(said, c.small) + '</b>', truth, '60 ' + c.small + 's make 1 ' + c.big + ', so ' + tuName(c.k, c.big) + ' = ' + c.k * 60 + ' ' + c.small + 's.', ['100 seconds make 1 minute.', '10 minutes make 1 hour.', 'The number stays the same.'], 'Use 60 for each ' + c.big + '.',
        { hint: 'How many ' + c.small + 's in 1 ' + c.big + '?', meta: { k: 'g3tm-un-tf' } });
    }],
    [2, 'order', function (lv) {
      var pool = lv === 3 ? [['50 seconds', 50], ['1 minute', 60], ['90 seconds', 90], ['2 minutes', 120], ['45 minutes', 2700], ['1 hour', 3600], ['70 minutes', 4200], ['2 hours', 7200]] : [['30 seconds', 30], ['50 seconds', 50], ['1 minute', 60], ['80 seconds', 80], ['2 minutes', 120], ['3 minutes', 180], ['150 seconds', 150]];
      var list = R.shuffle(pool).slice(0, lv === 3 ? 4 : 3).sort(function (a, b) { return a[1] - b[1]; });
      return { q: 'Put these from <b>shortest</b> to <b>longest</b>.', type: 'order', items: list.map(function (x) { return x[0]; }), first: 'shortest', last: 'longest', hint: 'Change them all to seconds.', steps: list.map(function (x) { return x[0] + ' = ' + x[1] + ' seconds.'; }), explain: list.map(function (x) { return x[0]; }).join(', ') + '.', meta: { k: 'g3tm-un-order' } };
    }],
    [1, 'fill', function (lv) {
      var c = unCase(lv === 3 ? 2 : 1);
      return fill('Fill in the blanks.', '[[]] ' + c.small + 's make 1 ' + c.big + '. So ' + tuName(c.k, c.big) + ' = [[]] ' + c.small + 's.', [60, c.k * 60], { hint: 'The same number for both changes.', steps: ['60 ' + c.small + 's make 1 ' + c.big + '.', c.k + ' &times; 60 = ' + c.k * 60 + '.'], explain: tuName(c.k, c.big) + ' = ' + c.k * 60 + ' ' + c.small + 's.', meta: { k: 'g3tm-un-fill' } });
    }],
    [1, 'more', function (lv) {
      var act = R.pick(['The baking', 'The hike', 'The art class', 'The game', 'The canoe trip']), h = lv === 3 ? 2 : 1, x = lv === 3 ? R.int(1, 11) * 5 : 0, done = lv === 1 ? R.int(1, 11) * 5 : R.int(11, 59), f = {};
      var gone = (lv === 3 ? 60 + x : done), ans = h * 60 - gone; f[h * 100 - gone] = 'An hour is 60 minutes, not 100.'; f[gone] = 'That is the time so far. How many minutes are left?';
      return num(act + ' takes <b>' + tuName(h, 'hour') + '</b>. It has gone on for <b>' + (lv === 3 ? '1 hour ' + tuName(x, 'minute') : tuName(done, 'minute')) + '</b>. How many minutes are left?', ans, f, { unit: 'minutes', fig: lv === 3 ? '' : clock(12, gone), hint: '1 hour = 60 minutes. Count on to the end.',
        steps: [tuName(h, 'hour') + ' = ' + h * 60 + ' minutes.'].concat(lv === 3 ? ['1 hour ' + x + ' minutes = ' + gone + ' minutes.'] : []).concat([h * 60 + ' &minus; ' + gone + ' = ' + ans + '.']), explain: ans + ' minutes are left.', meta: { k: 'g3tm-un-more' } });
    }],
    [2, 'story', function (lv) {
      var who = Q.name(), q, ans, st, f = {};
      if (lv === 2) { var a = R.int(10, 25), b = R.int(30, 50); q = who + '\'s recess is ' + a + ' minutes and lunch is ' + b + ' minutes. How many minutes is that in all?'; ans = a + b; st = [a + ' + ' + b + ' = ' + ans + '.']; f[a + b - 10] = 'Add again.'; }
      else { var x = R.int(1, 11) * 5, y = R.int(30, 55), L = 60 + x; q = 'Hockey practice is 1 hour ' + x + ' minutes. Swimming is ' + y + ' minutes. How many minutes longer is hockey practice?'; ans = L - y; st = ['1 hour ' + x + ' minutes = ' + L + ' minutes.', L + ' &minus; ' + y + ' = ' + ans + '.']; f[100 + x - y] = 'An hour is 60 minutes, not 100.'; f[x - y < 0 ? y - x : x - y] = 'Change 1 hour to 60 minutes first.'; }
      return num(q, ans, f, { unit: 'minutes', hint: '1 hour = 60 minutes.', steps: st, explain: ans + ' minutes.', meta: { k: 'g3tm-un-story' } });
    }]
  ]);
  function tgUnits(lv) {
    return function () {
      var c = unCase(lv), f1 = {}, f2 = {}, f3 = {}; f1[100] = 'Not 100: think of the clock. Once around is 60.'; f2[c.k * 100] = 'Use 60 for each one.'; f3[c.k * 60] = 'Now add the ' + c.x + '.';
      var steps = [
        { prompt: 'Start with one ' + c.big + '.', q: num('How many ' + c.small + 's make 1 ' + c.big + '?', 60, f1, { unit: c.small + 's', hint: 'Once around the clock.', meta: { k: 'g3tm-un-one', u: c.big } }) },
        { prompt: '60 for each ' + c.big + '.', q: num(tuName(c.k, c.big) + ' = ? ' + c.small + 's', c.k * 60, f2, { unit: c.small + 's', hint: 'Count by 60s.', meta: { k: 'g3tm-un-conv' } }) }];
      if (c.x) steps.push({ prompt: 'Add the extra ' + c.small + 's.', q: num(c.k * 60 + ' + ' + c.x + ' = ?', c.tot, f3, { unit: c.small + 's', hint: 'Add the two parts.', meta: { k: 'g3tm-add' } }) });
      return { q: tuName(c.k, c.big) + (c.x ? ' ' + tuName(c.x, c.small) : '') + ' = ___ ' + c.small + 's', fig: c.big === 'minute' ? clock(12, 0, { sec: 0 }) : clock(12, 0), done: c.tot + ' ' + c.small + 's.', steps: steps };
    };
  }

  /* ---------- how long? (elapsed time) ---------- */
  function ltCase(lv) {
    var h = R.int(1, 11), m0, d;
    if (lv === 1) { m0 = 5 * R.int(0, 7); d = 5 * R.int(2, (55 - m0) / 5); }
    else if (lv === 2) { m0 = 5 * R.int(7, 11); d = 5 * R.int((65 - m0) / 5, 11); }
    else { m0 = 5 * R.int(1, 11); d = 5 * R.int(13, 28); }
    var t0 = h * 60 + m0;
    return { t0: t0, t1: t0 + d, d: d, a: hm(t0), b: hm(t0 + d) };
  }
  function ltSteps(c) { var p = hopsOf(c.t0, c.t1), parts = []; for (var i = 1; i < p.length; i++) parts.push(p[i] - p[i - 1]); return [p.map(at).join(' &rarr; ') + '.', (parts.length > 1 ? parts.join(' + ') + ' = ' : '') + c.d + ' minutes.']; }
  function ltFix(c) { var f = {}, naive = (c.b[0] * 100 + c.b[1]) - (c.a[0] * 100 + c.a[1]); if (naive !== c.d) f[naive] = 'An hour is 60 minutes, not 100. Count on to the hour first.'; f[Math.abs(c.b[1] - c.a[1])] = 'Count on from the start to the hour, then on to the end.'; return f; }
  skill('tm-later', 'How long did it take?', 'E2.6', [
    [1, 'plain', function (lv) { var c = ltCase(lv); return num('How many minutes from the start to the end?', c.d, ltFix(c), { unit: 'minutes', fig: two(c.a, c.b), hint: 'Count on from the start: to the next hour first, then on.', steps: ltSteps(c), explain: c.d + ' minutes.', meta: { k: 'g3tm-lt-num' } }); }],
    [1, 'ends', function (lv) {
      var c = ltCase(lv);
      return fill('It starts at <b>' + at(c.t0) + '</b> and lasts <b>' + c.d + ' minutes</b>. What time does it end?', '[[]]:[[]]', [c.b[0], c.b[1]], { fig: clock(c.a[0], c.a[1]), hint: 'Count on ' + c.d + ' minutes. Passing 12 on the clock starts a new hour.', steps: ltSteps(c), explain: 'It ends at ' + at(c.t1) + '.', meta: { k: 'g3tm-lt-end' } });
    }],
    [2, 'story', function (lv) {
      var c = ltCase(lv), who = Q.name(), act = R.pick(['reads', 'practises piano', 'builds a snow fort', 'helps make bannock', 'plays outside', 'paints']);
      return num(who + ' ' + act + ' from <b>' + at(c.t0) + '</b> to <b>' + at(c.t1) + '</b>. How many minutes is that?', c.d, ltFix(c), { unit: 'minutes', fig: lv === 3 ? '' : digital(c.a[0], c.a[1]), hint: 'Count on to ' + hm(Math.ceil((c.t0 + 1) / 60) * 60)[0] + ':00 first.', steps: ltSteps(c), explain: c.d + ' minutes.', meta: { k: 'g3tm-lt-story' } });
    }],
    [1, 'mc', function (lv) {
      var c = ltCase(lv), e = c.b, W = [[tt(c.a[0], (c.a[1] + c.d) % 60), 'You passed 12 on the clock, so the hour goes up.'], [tt(nxt(e[0]), e[1]), 'Count the hours again.'], [tt(e[0], (e[1] + 10) % 60), 'Count the minutes again.'], [tt(e[0], (e[1] + 50) % 60), 'Count the minutes again.']];
      return mc('What time is <b>' + c.d + ' minutes</b> after <b>' + at(c.t0) + '</b>?', at(c.t1), W, { hint: 'Count on to the next hour first.', steps: ltSteps(c), explain: at(c.t1) + '.', meta: { k: 'g3tm-lt-mc' } });
    }],
    [2, 'tf', function (lv) {
      var c = ltCase(lv), who = Q.name(), truth = coin(), bad = ltFix(c), keys = Object.keys(bad).map(Number).filter(function (x) { return x !== c.d && x > 0; }), said = truth || !keys.length ? c.d : R.pick(keys);
      truth = said === c.d;
      return tf('From the start to the end is <b>' + said + ' minutes</b>, says ' + who + '. True or false?', truth, ltSteps(c)[1], ['Subtract the times like plain numbers.', 'An hour has 100 minutes.', 'Only the minutes matter.'], 'Count on to the hour first, then on to the end.',
        { fig: two(c.a, c.b), hint: 'Count on from the start.', meta: { k: 'g3tm-lt-tf', said: said } });
    }]
  ]);
  function tgLater(lv) {
    return function () {
      var c = ltCase(lv), p = hopsOf(c.t0, c.t1), f2 = {};
      if (p.length === 2) {
        var f1 = {}; f1[c.a[1]] = 'That is when it starts. Count on.';
        return { q: 'How many minutes from start to end?', fig: two(c.a, c.b), done: c.d + ' minutes.', steps: [
          { prompt: 'Start time, then end time: the same hour.', q: num('How many minutes past ' + c.a[0] + ' does it start?', c.a[1], {}, { unit: 'minutes', hint: 'Read the long hand of the start clock.', meta: { k: 'g3tm-fv-min', m: c.a[1] } }) },
          { prompt: 'Count on by 5s to the end.', q: num(c.b[1] + ' &minus; ' + c.a[1] + ' = ?', c.d, f1, { unit: 'minutes', hint: 'From ' + at(c.t0) + ' to ' + at(c.t1) + '.', meta: { k: 'g3tm-sub' } }) }
        ] };
      }
      var first = p[1] - p[0], rest = c.t1 - p[1]; f2[first] = 'Now add the rest.';
      return { q: 'How many minutes from start to end?', fig: two(c.a, c.b), done: first + ' + ' + rest + ' = ' + c.d + ' minutes.', steps: [
        { prompt: 'Hop to the next hour first.', q: num('From ' + at(c.t0) + ' to ' + at(p[1]) + ' is how many minutes?', first, {}, { unit: 'minutes', fig: lineFig(c.t0, c.t1, 0), hint: 'Count by 5s up to 12 on the clock.', meta: { k: 'g3tm-lt-hop', a: c.t0, b: p[1] } }) },
        { prompt: 'Then hop on to the end.', q: num('From ' + at(p[1]) + ' to ' + at(c.t1) + ' is how many minutes?', rest, {}, { unit: 'minutes', fig: lineFig(c.t0, c.t1, 1), hint: 'Each hour is 60 minutes.', meta: { k: 'g3tm-lt-hop', a: p[1], b: c.t1 } }) },
        { prompt: 'Add the hops.', q: num(first + ' + ' + rest + ' = ?', c.d, f2, { unit: 'minutes', hint: 'Add the two parts.', meta: { k: 'g3tm-add' } }) }
      ] };
    };
  }

  /* ======================= Lesson 3: Mass ======================= */
  var TH = Object.keys(MASS);
  function an(k) { return G3.an(k); }
  function pair(lv) { var a, b; do { a = R.pick(TH); b = R.pick(TH); } while (a === b || Math.abs(MASS[a] - MASS[b]) < (lv === 3 ? 2 : 3)); return [a, b]; }
  /* ---------- the heavier side goes down ---------- */
  skill('tm-bal', 'The heavier side goes down', 'E2.4', [
    [1, 'plain', function (lv) {
      var p = pair(lv), hv = MASS[p[0]] > MASS[p[1]] ? p[0] : p[1], lt = hv === p[0] ? p[1] : p[0];
      return mc('Which is heavier?', 'the ' + hv, [['the ' + lt, 'That side went up. The heavier side goes down.'], ['they have the same mass', 'The balance is not level.']], { fig: balance([p[0]], [p[1]]), hint: 'Which side went down?', steps: ['The ' + hv + ' side went down.', 'Down means heavier.'], explain: 'The ' + hv + ' is heavier.', meta: { k: 'g3tm-bl-mc' } });
    }],
    [1, 'tf', function (lv) {
      var p = lv === 1 ? pair(1) : R.pick([['pillow', 'stone'], ['pillow', 'mug'], ['pillow', 'apple'], ['shoe', 'stone'], ['book', 'stone'], ['pillow', 'orange']]), who = Q.name(), say = coin() ? p[0] : p[1], hv = MASS[p[0]] > MASS[p[1]] ? p[0] : p[1], truth = say === hv;
      return tf('The ' + p[0] + ' is bigger than the ' + p[1] + '. ' + who + ' says the <b>' + say + '</b> is heavier. True or false?', truth, 'The ' + hv + ' side went down, so the ' + hv + ' is heavier.', ['Bigger things are always heavier.', 'The side that goes up is heavier.', 'You cannot tell from a balance.'], 'Look at which side went down, not at the size.',
        { fig: balance([p[0]], [p[1]]), hint: 'Bigger is not always heavier.', meta: { k: 'g3tm-bl-tf', say: say } });
    }],
    [2, 'tap', function (lv) {
      var p, hv, lt, cand;
      do { p = pair(lv); hv = MASS[p[0]] > MASS[p[1]] ? p[0] : p[1]; lt = hv === p[0] ? p[1] : p[0]; cand = TH.filter(function (k) { return MASS[k] > MASS[hv] || MASS[k] < MASS[lt]; }); } while (!cand.length);
      var x = R.pick(cand), set = [[hv, lt], [x, lt], [hv, x]];
      if (MASS[x] > MASS[hv]) set[1] = [lt, x]; else set[2] = [x, hv];
      var order = R.shuffle([0, 1, 2]);
      return { q: 'Tap the balance that shows the <b>' + hv + '</b> is heavier than the <b>' + lt + '</b>.', type: 'tap', tiles: order.map(function (i) { return balance([set[i][0]], [set[i][1]]); }), answer: order.indexOf(0), answerText: 'the balance with the ' + hv + ' side down and the ' + lt + ' side up',
        hint: 'Find the ' + hv + ' and the ' + lt + ' together. Which side is down?', steps: ['Only one balance holds both the ' + hv + ' and the ' + lt + '.', 'The ' + hv + ' side is down.'], explain: 'The ' + hv + ' goes down.', meta: { k: 'g3tm-bl-tap', a: hv, b: lt } };
    }],
    [2, 'level', function (lv) {
      var obj = lv === 3 ? R.pick([['apple', 'orange'], ['book', 'pencil'], ['shoe', 'apple'], ['mug', 'pencil'], ['orange', 'shoe'], ['pillow', 'mug']]) : [R.pick(TH.filter(function (k) { return MASS[k] > 5; }))], M = heavy(obj), k = R.int(Math.max(1, M - (lv === 3 ? 14 : 9)), M - 2), f = {}; f[M] = 'That is the mass of the ' + obj.join(' and ') + '. Some cubes are already there.';
      var said = obj.length > 1 ? 'The ' + obj[0] + ' balances ' + MASS[obj[0]] + ' cubes and the ' + obj[1] + ' balances ' + MASS[obj[1]] + ' cubes.' : 'The ' + obj[0] + ' balances ' + M + ' cubes.';
      return num(said + ' How many more cubes will make this balance level?', M - k, f, { unit: 'cubes', fig: balance(obj, k), hint: obj.length > 1 ? 'Find the total first, then take away the cubes on the pan.' : 'Take away the cubes already there.',
        steps: (obj.length > 1 ? [MASS[obj[0]] + ' + ' + MASS[obj[1]] + ' = ' + M + '.'] : []).concat(['There are ' + k + ' cubes.', M + ' &minus; ' + k + ' = ' + (M - k) + '.']), explain: (M - k) + ' more cubes.', meta: { k: 'g3tm-bl-level', o: obj } });
    }],
    [2, 'order', function (lv) {
      var pool = R.shuffle(TH), list = [], i;
      for (i = 0; i < pool.length && list.length < 3; i++) if (list.every(function (k) { return Math.abs(MASS[k] - MASS[pool[i]]) >= 2; })) list.push(pool[i]);
      list.sort(function (a, b) { return MASS[a] - MASS[b]; });
      return { q: 'Put these from <b>lightest</b> to <b>heaviest</b>.', type: 'order', items: list.map(function (k) { return 'the ' + k; }), first: 'lightest', last: 'heaviest', fig: bal2(balance([list[1]], [list[0]]), balance([list[2]], [list[1]])), hint: 'On each balance, the lower side is heavier.',
        steps: ['The ' + list[1] + ' is heavier than the ' + list[0] + '.', 'The ' + list[2] + ' is heavier than the ' + list[1] + '.'], explain: list.map(function (k) { return 'the ' + k; }).join(', ') + '.', meta: { k: 'g3tm-bl-order' } };
    }],
    [2, 'diff', function (lv) {
      var p = pair(lv), hv = MASS[p[0]] > MASS[p[1]] ? p[0] : p[1], lt = hv === p[0] ? p[1] : p[0], f = {}; f[MASS[hv] + MASS[lt]] = 'How much heavier: subtract.';
      return num('The <b>' + hv + '</b> balances ' + MASS[hv] + ' cubes. The <b>' + lt + '</b> balances ' + MASS[lt] + ' cubes. How many cubes heavier is the ' + hv + '?', MASS[hv] - MASS[lt], f, { unit: 'cubes', fig: balance([hv], [lt]), hint: 'Subtract the smaller mass.', steps: [MASS[hv] + ' &minus; ' + MASS[lt] + ' = ' + (MASS[hv] - MASS[lt]) + '.'], explain: (MASS[hv] - MASS[lt]) + ' cubes heavier.', meta: { k: 'g3tm-bl-diff' } });
    }]
  ]);
  function tgBal(lv) {
    return function () {
      var p = lv === 1 ? pair(1) : R.pick([['pillow', 'stone'], ['pillow', 'mug'], ['shoe', 'stone'], ['pillow', 'apple']]), hv = MASS[p[0]] > MASS[p[1]] ? p[0] : p[1], g = {}, h = {};
      g[MASS[p[0]] > MASS[p[1]] ? 1 : 0] = 'Look again: which pan is lower?'; h[hv === p[0] ? 1 : 0] = 'The side that goes down is heavier.';
      return { q: 'Which is heavier: the ' + p[0] + ' or the ' + p[1] + '?', fig: balance([p[0]], [p[1]]), done: 'The ' + hv + ' is heavier' + (lv > 1 ? ', even if it looks smaller.' : '.'), steps: [
        { prompt: 'Look at the two pans.', q: fixed('Which side went down?', ['the left side', 'the right side'], MASS[p[0]] > MASS[p[1]] ? 0 : 1, g, { hint: 'Find the lower pan.', meta: { k: 'g3tm-bl-down', a: p[0], b: p[1] } }) },
        { prompt: 'Down means heavier.', q: fixed('So which is heavier?', ['the ' + p[0], 'the ' + p[1]], hv === p[0] ? 0 : 1, h, { hint: 'The thing on the lower side.', meta: { k: 'g3tm-bl-mc' } }) }
      ] };
    };
  }

  /* ---------- measure mass in cubes ---------- */
  function cbObj(lv) { return lv === 1 ? [R.pick(['apple', 'orange', 'pillow', 'pencil'])] : lv === 2 ? R.pick([[R.pick(TH)], ['pencil', 'pencil', 'pencil'], ['apple', 'apple'], ['pillow', 'pencil'], ['pencil', 'pencil']]) : R.pick([['apple', 'orange'], ['book', 'pencil'], ['shoe', 'apple'], ['mug', 'pencil', 'pencil'], ['orange', 'shoe'], ['pillow', 'stone'], ['apple', 'apple', 'pencil']]); }
  function cbName(o) { var n = {}; o.forEach(function (k) { n[k] = (n[k] || 0) + 1; }); return Object.keys(n).map(function (k) { return n[k] > 1 ? n[k] + ' ' + k + 's' : an(k); }).join(' and '); }
  skill('tm-cubes', 'Measure mass in cubes', 'E2.4', [
    [1, 'plain', function (lv) {
      var o = cbObj(lv), M = heavy(o), who = Q.name(), f = {}; f[M + 6] = 'Count the rows of 6 again.'; f[M - 1] = 'Count every cube.';
      return num(who + ' puts ' + cbName(o) + ' on a pan balance and adds cubes until it is level. What is the mass in cubes?', M, f, { unit: 'cubes', fig: balance(o, M), hint: 'Level means equal. Count the cubes: rows of 6.', steps: ['The balance is level.', 'Rows of 6: ' + Math.floor(M / 6) + ' rows and ' + M % 6 + ' more = ' + M + '.'], explain: M + ' cubes.', meta: { k: 'g3tm-cb-num', o: o } });
    }],
    [1, 'total', function (lv) {
      var o = lv === 3 ? R.shuffle(TH).slice(0, 3) : R.shuffle(TH).slice(0, 2), M = heavy(o), f = {}; f[M - MASS[o[o.length - 1]]] = 'Add every thing.';
      return num(o.map(function (k) { return 'The ' + k + ' balances ' + MASS[k] + ' cubes.'; }).join(' ') + ' How many cubes balance them all together?', M, f, { unit: 'cubes', fig: balance(o, 0), hint: 'Add the masses.', steps: [o.map(function (k) { return MASS[k]; }).join(' + ') + ' = ' + M + '.'], explain: M + ' cubes.', meta: { k: 'g3tm-cb-total', o: o } });
    }],
    [2, 'many', function (lv) {
      var k = R.pick(lv === 3 ? ['pencil', 'pillow', 'apple', 'orange'] : ['pencil', 'pillow', 'apple']), n = lv === 3 ? R.int(3, 6) : R.int(2, 5), back = lv === 3, f = {};
      if (back) { f[n * MASS[k]] = 'That is all of them. Share by ' + n + '.'; return num(n + ' ' + k + 's balance <b>' + n * MASS[k] + ' cubes</b>. They all have the same mass. How many cubes does one ' + k + ' balance?', MASS[k], f, { unit: 'cubes', hint: 'Share ' + n * MASS[k] + ' into ' + n + ' equal groups.', steps: [n * MASS[k] + ' &divide; ' + n + ' = ' + MASS[k] + '.'], explain: MASS[k] + ' cubes.', meta: { k: 'g3tm-cb-one', n: n, o: k } }); }
      f[n + MASS[k]] = 'Each one is ' + MASS[k] + ' cubes: multiply.';
      return num('One ' + k + ' balances <b>' + MASS[k] + ' cubes</b>. How many cubes balance <b>' + n + ' ' + k + 's</b>?', n * MASS[k], f, { unit: 'cubes', fig: n <= 3 ? balance(Array(n).fill(k), 0) : '', hint: n + ' groups of ' + MASS[k] + '.', steps: [n + ' &times; ' + MASS[k] + ' = ' + n * MASS[k] + '.'], explain: n * MASS[k] + ' cubes.', meta: { k: 'g3tm-cb-many', n: n, o: k } });
    }],
    [1, 'fill', function (lv) {
      var o = cbObj(lv), M = heavy(o);
      return fill('The balance is level. Count the cubes.', '[[]] rows of 6 and [[]] more: [[]] cubes.', [Math.floor(M / 6), M % 6, M], { fig: balance(o, M), hint: 'Count the full rows, then the extra cubes.', steps: [Math.floor(M / 6) + ' rows of 6 = ' + Math.floor(M / 6) * 6 + '.', Math.floor(M / 6) * 6 + ' + ' + M % 6 + ' = ' + M + '.'], explain: M + ' cubes.', meta: { k: 'g3tm-cb-fill', o: o } });
    }],
    [2, 'tf', function (lv) {
      var o = cbObj(lv), M = heavy(o), who = Q.name(), truth = coin(), said = truth ? M : M + R.pick([-6, -2, 2, 6]);
      return tf('The balance is level. ' + who + ' says the mass is <b>' + said + ' cubes</b>. True or false?', truth, 'Count the cubes: ' + M + '.', ['A level balance means nothing is on it.', 'Count only the top row.', 'Count the things, not the cubes.'], 'Count the cubes in rows of 6.',
        { fig: balance(o, M), hint: 'Count the cubes.', meta: { k: 'g3tm-cb-tf', said: said, o: o } });
    }],
    [3, 'mc', function () {
      var k = R.pick(TH), M = MASS[k], w = R.shuffle(TH.filter(function (x) { return x !== k && Math.abs(MASS[x] - M) >= 2; })).slice(0, 3), b = [balance([w[0]], MASS[w[0]]), balance([k], M)];
      if (coin()) b.reverse();
      return mc('Which thing balances <b>' + M + ' cubes</b>?', 'the ' + k, w.map(function (x) { return ['the ' + x, 'The ' + x + ' balances ' + MASS[x] + ' cubes.']; }), { fig: bal2(b[0], b[1]), hint: 'Count the cubes on each level balance.', steps: ['Find the balance with ' + M + ' cubes.'], explain: 'The ' + k + '.', meta: { k: 'g3tm-cb-mc', M: M } });
    }]
  ]);
  function tgCubes(lv) {
    return function () {
      var o = cbObj(lv), M = heavy(o), r = Math.floor(M / 6), f2 = {}; f2[r] = 'That is the rows. Count the cubes in them: 6 each.';
      return { q: 'The balance is level. What is the mass in cubes?', fig: balance(o, M), done: M + ' cubes.', steps: [
        { prompt: 'Count the full rows of 6.', q: num('How many full rows?', r, {}, { hint: 'Each row has 6 cubes.', meta: { k: 'g3tm-cb-rows', M: M } }) },
        { prompt: r + ' rows of 6.', q: num(r + ' &times; 6 = ?', r * 6, f2, { unit: 'cubes', hint: 'Count by 6s.', meta: { k: 'g3tm-mul' } }) },
        { prompt: 'Add the extra cubes.', q: num(r * 6 + ' + ' + M % 6 + ' = ?', M, {}, { unit: 'cubes', hint: 'Count on.', meta: { k: 'g3tm-add' } }) }
      ] };
    };
  }

  /* ---------- estimate, then measure ---------- */
  function msCase(lv) { var o = cbObj(lv), M = heavy(o), e; do { e = M + R.int(lv === 3 ? -10 : -5, lv === 3 ? 10 : 5); } while (e === M || e < 1); return { o: o, M: M, e: e }; }
  skill('tm-mest', 'Estimate, then measure', 'E2.4', [
    [1, 'plain', function (lv) {
      var c = msCase(lv), who = Q.name(), d = Math.abs(c.M - c.e), f = {}; f[c.M] = 'That is the mass. How far is it from ' + c.e + '?'; f[c.M + c.e] = 'Find the difference: subtract.';
      return num(who + ' estimated <b>' + c.e + ' cubes</b> for ' + cbName(c.o) + '. Then the balance showed this. How far off was the estimate?', d, f, { unit: 'cubes', fig: balance(c.o, c.M), hint: 'Count the cubes. Then find the difference.', steps: ['Measured: ' + c.M + ' cubes.', Math.max(c.M, c.e) + ' &minus; ' + Math.min(c.M, c.e) + ' = ' + d + '.'], explain: 'Off by ' + d + ' cubes.', meta: { k: 'g3tm-ms-num', e: c.e, o: c.o } });
    }],
    [1, 'close', function (lv) {
      var k = R.pick(TH.filter(function (x) { return MASS[x] >= 15; })), M = MASS[k], ppl, ests, best;
      do { ppl = Q.two().concat([Q.name()]); } while (ppl[2] === ppl[0] || ppl[2] === ppl[1]);
      ests = [M + R.int(lv === 1 ? 1 : -3, 3), M + R.int(5, 9) * (coin() ? 1 : -1), M + R.int(10, 14) * (coin() ? 1 : -1)];
      best = ests[0];
      var opts = ppl.map(function (p, i) { return p + ': ' + ests[i] + ' cubes'; });
      return mc('The <b>' + k + '</b> balances ' + M + ' cubes. Whose estimate was closest?', opts[0], [[opts[1], 'Find how far each estimate is from ' + M + '.'], [opts[2], 'Find how far each estimate is from ' + M + '.']], { fig: balance([k], M), hint: 'How far is each estimate from ' + M + '?', steps: ests.map(function (e, i) { return ppl[i] + ': off by ' + Math.abs(e - M) + '.'; }), explain: ppl[0] + ', off by only ' + Math.abs(best - M) + '.', meta: { k: 'g3tm-ms-close', M: M } });
    }],
    [2, 'bench', function (lv) {
      var k = R.pick(['pencil', 'apple', 'orange', 'pillow']), n = R.int(2, lv === 3 ? 6 : 4), box = lv === 3 ? R.int(3, 8) : 0, ans = n * MASS[k] + box, f = {}; f[n + MASS[k] + box] = 'Each ' + k + ' is ' + MASS[k] + ' cubes: multiply.'; if (box) f[n * MASS[k]] = 'Add the ' + box + ' cubes for the bag.';
      return num('One ' + k + ' is about <b>' + MASS[k] + ' cubes</b>. About how many cubes is a bag of <b>' + n + ' ' + k + 's</b>' + (box ? ', if the empty bag is about ' + box + ' cubes' : '') + '?', ans, f, { unit: 'cubes', hint: n + ' groups of ' + MASS[k] + (box ? ', then add the bag.' : '.'),
        steps: [n + ' &times; ' + MASS[k] + ' = ' + n * MASS[k] + '.'].concat(box ? [n * MASS[k] + ' + ' + box + ' = ' + ans + '.'] : []), explain: 'About ' + ans + ' cubes.', meta: { k: 'g3tm-ms-bench', o: k, n: n, box: box } });
    }],
    [2, 'tf', function (lv) {
      var c = msCase(lv), who = Q.name(), say = coin() ? 'too high' : 'too low', truth = say === (c.e > c.M ? 'too high' : 'too low');
      return tf(who + ' estimated ' + c.e + ' cubes. ' + who + ' says the estimate was <b>' + say + '</b>. True or false?', truth, 'It measured ' + c.M + ' cubes, so ' + c.e + ' was ' + (c.e > c.M ? 'too high' : 'too low') + '.', ['Every estimate is too low.', 'A bigger estimate is always better.', 'You cannot check an estimate.'], 'Count the cubes, then compare with ' + c.e + '.',
        { fig: balance(c.o, c.M), hint: 'Is ' + c.e + ' more or less than the cubes?', meta: { k: 'g3tm-ms-tf', e: c.e, say: say, o: c.o } });
    }],
    [1, 'fill', function (lv) {
      var c = msCase(lv);
      return fill('Estimate: ' + c.e + ' cubes. Measure, then fill in the blanks.', 'Measured: [[]] cubes. The estimate was off by [[]] cubes.', [c.M, Math.abs(c.M - c.e)], { fig: balance(c.o, c.M), hint: 'Count the cubes, then subtract.', steps: ['Measured: ' + c.M + '.', 'Off by ' + Math.abs(c.M - c.e) + '.'], explain: 'Measured ' + c.M + ', off by ' + Math.abs(c.M - c.e) + '.', meta: { k: 'g3tm-ms-fill', e: c.e, o: c.o } });
    }]
  ]);
  function tgMest(lv) {
    return function () {
      var c = msCase(lv), f2 = {}; f2[c.M] = 'That is the mass. How far from ' + c.e + '?';
      return { q: 'Estimate: ' + c.e + ' cubes. How far off was it?', fig: balance(c.o, c.M), done: 'Off by ' + Math.abs(c.M - c.e) + ' cubes.', steps: [
        { prompt: 'Measure: count the cubes.', q: num('How many cubes?', c.M, {}, { unit: 'cubes', hint: 'Rows of 6, then the rest.', meta: { k: 'g3tm-cb-num', o: c.o } }) },
        { prompt: 'Compare: subtract the smaller from the bigger.', q: num(Math.max(c.M, c.e) + ' &minus; ' + Math.min(c.M, c.e) + ' = ?', Math.abs(c.M - c.e), f2, { unit: 'cubes', hint: 'Count up from ' + Math.min(c.M, c.e) + '.', meta: { k: 'g3tm-sub' } }) }
      ] };
    };
  }

  /* ======================= Lesson 4: Capacity ======================= */
  /* ---------- measure capacity in cups ---------- */
  function cpN(lv) { return lv === 1 ? R.int(3, 8) : lv === 2 ? R.int(6, 15) : R.int(10, 16); }
  skill('tm-cups', 'Measure capacity in cups', 'E2.3', [
    [1, 'plain', function (lv) {
      var k = R.pick(CNAME), n = cpN(lv), f = {}; f[n + 1] = 'Count each cup once.'; f[n - 1] = 'Count every cup.';
      return num('It took these cups of water to fill the <b>' + k + '</b>. What is its capacity in cups?', n, f, { unit: 'cups', fig: cupsFig(n, k), hint: 'Count the full cups.', steps: ['Count the cups' + (n > 8 ? ': 8 in the top row, ' + (n - 8) + ' more.' : '.'), n + ' cups.'], explain: 'The ' + k + ' holds ' + n + ' cups.', meta: { k: 'g3tm-cp-num' } });
    }],
    [1, 'jug', function (lv) {
      var c = lv === 1 ? R.int(5, 8) : R.int(8, 12), f0 = R.int(1, c - 2), two = lv === 3, ans = (two ? 2 * c : c) - f0, f = {}; f[f0] = 'That is the water already in it. How many more to the top?'; f[c] = 'That is the whole jug. Some is already there.';
      return num('This jug holds <b>' + c + ' cups</b>. How many more cups will ' + (two ? 'fill it, and then fill it once more' : 'fill it') + '?', ans, f, { unit: 'cups', fig: jug(c, f0), hint: 'Read the water level. Count up to the top.',
        steps: ['The water is at ' + f0 + '.', c + ' &minus; ' + f0 + ' = ' + (c - f0) + '.'].concat(two ? [(c - f0) + ' + ' + c + ' = ' + ans + '.'] : []), explain: ans + ' cups.', meta: { k: 'g3tm-cp-jug', c: c, two: two } });
    }],
    [2, 'total', function (lv) {
      var ks = R.shuffle(CNAME).slice(0, lv === 3 ? 3 : 2), ns = ks.map(function () { return cpN(lv === 3 ? 2 : lv); }), t = ns.reduce(function (a, b) { return a + b; }, 0), f = {}; f[t - ns[ns.length - 1]] = 'Add every container.';
      return num(ks.map(function (k, i) { return 'The ' + k + ' holds ' + ns[i] + ' cups.'; }).join(' ') + ' How many cups do they hold in all?', t, f, { unit: 'cups', hint: 'Add the capacities.', steps: [ns.join(' + ') + ' = ' + t + '.'], explain: t + ' cups.', meta: { k: 'g3tm-cp-total' } });
    }],
    [2, 'diff', function (lv) {
      var ks = R.shuffle(CNAME).slice(0, 2), a = cpN(lv === 3 ? 3 : 2) + (lv === 3 ? 8 : 0), b = R.int(2, Math.min(a - 2, 10)), f = {}; f[a + b] = 'How many more: subtract.';
      return num('The <b>' + ks[0] + '</b> holds ' + a + ' cups. The <b>' + ks[1] + '</b> holds ' + b + ' cups. How many more cups does the ' + ks[0] + ' hold?', a - b, f, { unit: 'cups', fig: lv === 3 ? '' : cupsFig(b, ks[1]), hint: 'Subtract the smaller capacity.', steps: [a + ' &minus; ' + b + ' = ' + (a - b) + '.'], explain: (a - b) + ' more cups.', meta: { k: 'g3tm-cp-diff' } });
    }],
    [1, 'tap', function (lv) {
      var ks = R.shuffle(CNAME).slice(0, 3), ns = [], seen = {};
      while (ns.length < 3) { var n = cpN(lv === 3 ? 2 : lv); if (!seen[n]) { seen[n] = 1; ns.push(n); } }
      var most = ns.indexOf(Math.max.apply(null, ns));
      return { q: 'Each picture shows the cups it took to fill a container. Tap the one that holds the <b>most</b>.', type: 'tap', tiles: ks.map(function (k, i) { return cupsFig(ns[i], k); }), answer: most, answerText: 'the ' + ks[most] + ', ' + ns[most] + ' cups',
        hint: 'Count the cups for each one.', steps: ks.map(function (k, i) { return 'The ' + k + ': ' + ns[i] + ' cups.'; }), explain: 'The ' + ks[most] + ': ' + ns[most] + ' cups.', meta: { k: 'g3tm-cp-tap' } };
    }],
    [2, 'tf', function (lv) {
      var ks = R.shuffle(CNAME).slice(0, 2), a = cpN(lv), b; do { b = cpN(lv); } while (b === a);
      var who = Q.name(), truth = a > b;
      return tf('It took ' + a + ' cups to fill the ' + ks[0] + ' and ' + b + ' cups to fill the ' + ks[1] + '. ' + who + ' says the <b>' + ks[0] + ' holds more</b>. True or false?', truth, 'The ' + (a > b ? ks[0] : ks[1]) + ' took more cups, so it holds more.', ['A taller container always holds more.', 'Fewer cups means it holds more.', 'You cannot compare with cups.'], 'More cups means it holds more.',
        { hint: 'Which took more cups?', meta: { k: 'g3tm-cp-tf', a: a, b: b } });
    }]
  ]);
  function tgCups(lv) {
    return function () {
      var k = R.pick(CNAME), n = lv === 1 ? R.int(4, 8) : R.int(9, 16), top = Math.min(n, 8), f2 = {}; f2[top] = 'Add the second row too.';
      var steps = [{ prompt: 'Count the cups in the top row.', q: num('How many in the top row?', top, {}, { unit: 'cups', hint: 'Touch each one.', meta: { k: 'g3tm-cp-row', n: n } }) }];
      if (n > 8) steps.push({ prompt: 'Add the cups in the second row.', q: num('8 + ' + (n - 8) + ' = ?', n, f2, { unit: 'cups', hint: 'Count on from 8.', meta: { k: 'g3tm-add' } }) });
      else steps.push({ prompt: 'Each full cup is one unit of capacity.', q: mc('So the ' + k + ' holds:', n + ' cups', [[(n + 1) + ' cups', 'Count again.'], [(n - 1) + ' cups', 'Count again.']], { hint: 'Count the cups.', meta: { k: 'g3tm-cp-says', n: n } }) });
      return { q: 'It took these cups to fill the ' + k + '. What is its capacity?', fig: cupsFig(n, k), done: 'The ' + k + ' holds ' + n + ' cups.', steps: steps };
    };
  }

  /* ---------- fill to the top, no gaps ---------- */
  var FL = { half: ['used cups that were only half full', 0, 'Half cups hold less, so it takes more of them: too high.'], spill: ['let water spill over the top', 0, 'The spilled water was counted too: too high.'], short: ['stopped before the pot was full', 1, 'Some of the pot was not filled: too low.'], full: ['filled each cup to the top and stopped when the pot was full', 2, 'Full cups and a full pot: just right.'] };
  var FL_OPT = ['too high', 'too low', 'just right'];
  function flFig(m, n) { return m === 'half' ? cupsFig(n, 'pot', { lvl: 0.5 }) : m === 'spill' ? cupsFig(n, 'pot', { spill: true }) : m === 'short' ? cupsFig(n, 'pot', { c: 0.7 }) : cupsFig(n, 'pot'); }
  var GOOD = ['cups of rice', 'cups of sand', 'cups of water'], GAPPY = ['tennis balls', 'wooden blocks', 'golf balls', 'pine cones', 'toy cars'];
  skill('tm-fill', 'Full cups, no gaps', 'E2.3', [
    [1, 'plain', function (lv) {
      var m = R.pick(['half', 'spill', 'short', 'full']), who = Q.name(), n = R.int(4, 8), f = {};
      FL_OPT.forEach(function (o, j) { if (j !== FL[m][1]) f[j] = FL[m][2]; });
      return fixed(who + ' measured the pot and ' + FL[m][0] + '. The count of cups is:', FL_OPT, FL[m][1], f, { fig: flFig(m, n), hint: 'Did every cup hold a full cup? Was the pot just full?', steps: [FL[m][2]], explain: FL[m][2], meta: { k: 'g3tm-fl-mc', m: m } });
    }],
    [1, 'half', function (lv) {
      var who = Q.name(), n = 2 * R.int(lv === 1 ? 2 : 4, lv === 1 ? 5 : 9), full = lv === 3 ? R.int(2, 6) : 0, ans = n / 2 + full, f = {}; f[n + full] = 'Two half cups make one full cup.'; f[n * 2 + full] = 'Half cups hold less: there are fewer full cups.';
      return num(who + ' filled a pot with <b>' + n + ' half cups</b>' + (full ? ' and <b>' + full + ' full cups</b>' : '') + '. How many <b>full</b> cups does the pot hold?', ans, f, { unit: 'cups', fig: lv === 3 ? '' : cupsFig(n, 'pot', { lvl: 0.5 }), hint: '2 half cups = 1 full cup.',
        steps: [n + ' half cups = ' + n / 2 + ' full cups.'].concat(full ? [n / 2 + ' + ' + full + ' = ' + ans + '.'] : []), explain: ans + ' full cups.', meta: { k: 'g3tm-fl-half' } });
    }],
    [2, 'spill', function (lv) {
      var who = Q.name(), c = R.int(lv === 3 ? 9 : 4, lv === 3 ? 16 : 9), x = R.int(1, lv === 3 ? 4 : 3), short = coin(), f = {};
      if (short) { f[c - x] = 'The pot still needed ' + x + ' more. Add them.'; return num(who + ' stopped pouring after <b>' + c + ' cups</b>. The pot still needed about <b>' + x + ' more</b>. About how many cups does the pot hold?', c + x, f, { unit: 'cups', fig: lv === 3 ? '' : cupsFig(c, 'pot', { c: 0.7 }), hint: 'Stopping early makes the count too low.', steps: [c + ' + ' + x + ' = ' + (c + x) + '.'], explain: 'About ' + (c + x) + ' cups.', meta: { k: 'g3tm-fl-short' } }); }
      f[c + x + x] = 'Some of the water spilled. Take it away.';
      return num(who + ' poured <b>' + (c + x) + ' cups</b>, but <b>' + x + '</b> of them spilled over the top. How many cups does the pot really hold?', c, f, { unit: 'cups', fig: lv === 3 ? '' : cupsFig(c + x, 'pot', { spill: true }), hint: 'Spilled water was not held by the pot.', steps: [(c + x) + ' &minus; ' + x + ' = ' + c + '.'], explain: c + ' cups.', meta: { k: 'g3tm-fl-spill' } });
    }],
    [1, 'twice', function (lv) {
      var who = Q.name(), c = R.int(lv === 1 ? 3 : 6, lv === 3 ? 15 : lv === 2 ? 10 : 6), k = R.pick(CNAME), f = {}; f[c] = 'Each half cup holds less: it takes more of them.'; f[c / 2] = 'Half cups hold less, so it takes more, not fewer.';
      return num('The ' + k + ' holds <b>' + c + ' full cups</b>. ' + who + ' fills it with cups that are only <b>half full</b>. How many half cups will ' + who + ' count?', 2 * c, f, { unit: 'half cups', fig: cupsFig(c, k, { lvl: 0.5, c: 0.5 }), hint: '2 half cups = 1 full cup.', steps: ['Each full cup takes 2 half cups.', c + ' &times; 2 = ' + 2 * c + '. The count is too high.'], explain: 2 * c + ' half cups.', meta: { k: 'g3tm-fl-twice' } });
    }],
    [2, 'gaps', function (lv) {
      var right = R.pick(GOOD), w = R.shuffle(GAPPY).slice(0, 3);
      return mc('Which unit fills a jar with <b>no gaps</b>, so it measures capacity best?', right, w.map(function (x) { return [x, 'Big, hard shapes leave gaps between them.']; }), { fig: jarFig(lv === 3 ? 'balls' : coin() ? 'balls' : 'water'), hint: 'Something that can pour fills every corner.', steps: ['Balls and blocks leave gaps.', cap(right) + ' fill every gap.'], explain: cap(right) + '.', meta: { k: 'g3tm-fl-gaps' } });
    }],
    [2, 'tf', function (lv) {
      var m = R.pick(['half', 'spill', 'short']), who = Q.name(), say = R.pick(['too high', 'too low']), truth = say === FL_OPT[FL[m][1]];
      return tf(who + ' ' + FL[m][0] + ' and says the count is <b>' + say + '</b>. True or false?', truth, FL[m][2], ['The way you fill does not matter.', 'Half cups make the count too low.', 'Spilling makes the count too low.'], FL[m][2],
        { fig: flFig(m, R.int(4, 8)), hint: 'Picture it happening.', meta: { k: 'g3tm-fl-tf', m: m, say: say } });
    }]
  ]);
  function tgFill(m) {
    return function () {
      var n = R.int(4, 8), g = { 0: m === 'half' ? 'Look at the water in each cup.' : 'Look at the top of the pot.' }, f = {}, a = m === 'short' ? 1 : 0;
      FL_OPT.forEach(function (o, j) { if (j !== FL[m][1]) f[j] = FL[m][2]; });
      return { q: 'Is this count of ' + n + ' cups right?', fig: flFig(m, n), done: FL[m][2], steps: [
        { prompt: m === 'half' ? 'Look at each cup.' : 'Look at the pot.', q: fixed(m === 'half' ? 'Is each cup full?' : 'Is the pot just full?', ['yes', 'no'], 1, g, { hint: m === 'spill' ? 'Water ran over the top.' : m === 'short' ? 'There is space at the top.' : 'Each cup is only half full.', meta: { k: 'g3tm-fl-look', m: m } }) },
        { prompt: 'So is the count too high or too low?', q: fixed('The count is:', FL_OPT, FL[m][1], f, { hint: a ? 'Space left: more would fit.' : 'More cups than the pot really holds.', meta: { k: 'g3tm-fl-mc', m: m } }) }
      ] };
    };
  }

  /* ---------- estimate capacity ---------- */
  function ceCase(lv) { return lv === 1 ? { s: R.int(2, 3), k: R.int(2, 3) } : lv === 2 ? { s: R.int(2, 5), k: R.int(3, 5) } : { s: R.int(4, 8), k: R.int(3, 6) }; }
  var BIG = ['pot', 'bucket', 'bowl', 'vase'];
  skill('tm-cest', 'Estimate capacity', 'E2.3', [
    [1, 'plain', function (lv) {
      var c = ceCase(lv), b = R.pick(BIG), poured = lv === 3 ? R.int(2, c.s * 2) : 0, ans = c.s * c.k - poured, f = {}; f[c.s + c.k - poured] = 'Each jug is ' + c.s + ' cups: multiply.'; if (poured) f[c.s * c.k] = 'Take away the ' + poured + ' cups already poured.';
      return num('A jug holds <b>' + c.s + ' cups</b>. The ' + b + ' holds about <b>' + c.k + ' jugs</b>.' + (poured ? ' You have already poured ' + poured + ' cups in. About how many more cups will fill it?' : ' About how many cups does the ' + b + ' hold?'), ans, f, { unit: 'cups', fig: estFig(c.s, c.k, b), hint: c.k + ' jugs of ' + c.s + ' cups' + (poured ? ', then take away ' + poured + '.' : '.'),
        steps: [c.k + ' &times; ' + c.s + ' = ' + c.s * c.k + '.'].concat(poured ? [c.s * c.k + ' &minus; ' + poured + ' = ' + ans + '.'] : []), explain: 'About ' + ans + ' cups.', meta: { k: 'g3tm-ce-num' } });
    }],
    [1, 'half', function (lv) {
      var s = 2 * R.int(lv === 1 ? 2 : 3, lv === 3 ? 8 : 5), b = R.pick(['mug', 'small bowl', 'glass', 'teapot']);
      return mc('A jug holds <b>' + s + ' cups</b>. A ' + b + ' holds about <b>half a jug</b>. About how many cups does the ' + b + ' hold?', 'about ' + s / 2 + ' cups', [['about ' + s + ' cups', 'That is a whole jug.'], ['about ' + 2 * s + ' cups', 'Half is smaller, not bigger.'], ['about ' + (s / 2 + 2) + ' cups', 'Half of ' + s + ': share it into 2 equal parts.']],
        { fig: estFig(s, 1, 'bowl'), hint: 'Half of ' + s + '.', steps: ['Half of ' + s + ' is ' + s / 2 + '.'], explain: 'About ' + s / 2 + ' cups.', meta: { k: 'g3tm-ce-half', s: s } });
    }],
    [1, 'fill', function (lv) {
      var c = ceCase(lv), b = R.pick(BIG);
      return fill('Use the jug to estimate. Fill in the blanks.', '1 jug = [[]] cups. ' + c.k + ' jugs = [[]] cups. The ' + b + ' holds about [[]] cups.', [c.s, c.s * c.k, c.s * c.k], { fig: estFig(c.s, c.k, b), hint: 'Read the jug, then multiply.', steps: ['1 jug: ' + c.s + ' cups.', c.k + ' &times; ' + c.s + ' = ' + c.s * c.k + '.'], explain: 'About ' + c.s * c.k + ' cups.', meta: { k: 'g3tm-ce-fill', k2: c.k } });
    }],
    [2, 'check', function (lv) {
      var c = ceCase(lv), b = R.pick(BIG), est = c.s * c.k, real = est + R.pick([-3, -2, -1, 1, 2, 3]) * (lv === 3 ? 2 : 1), who = Q.name(), f = {}; f[real] = 'That is what it really held. How far from ' + est + '?';
      return num(who + ' estimated about <b>' + est + ' cups</b> for the ' + b + '. It really took <b>' + real + ' cups</b>. How far off was the estimate?', Math.abs(real - est), f, { unit: 'cups', fig: cupsFig(real, b === 'vase' ? 'vase' : b), hint: 'Subtract the smaller number.', steps: [Math.max(real, est) + ' &minus; ' + Math.min(real, est) + ' = ' + Math.abs(real - est) + '.'], explain: 'Off by ' + Math.abs(real - est) + ' cups.', meta: { k: 'g3tm-ce-check' } });
    }],
    [2, 'tf', function (lv) {
      var c = ceCase(lv), b = R.pick(BIG), who = Q.name(), truth = coin(), said = truth ? c.s * c.k : c.s + c.k;
      if (c.s * c.k === c.s + c.k) { truth = true; said = 4; }
      return tf('A jug holds ' + c.s + ' cups. The ' + b + ' holds about ' + c.k + ' jugs. ' + who + ' says the ' + b + ' holds about <b>' + said + ' cups</b>. True or false?', truth, c.k + ' jugs of ' + c.s + ' cups: ' + c.k + ' &times; ' + c.s + ' = ' + c.s * c.k + ' cups.', ['Add the cups and the jugs.', 'The jug and the ' + b + ' hold the same.', 'You must pour it to estimate.'], c.k + ' jugs of ' + c.s + ' cups each: multiply.',
        { fig: estFig(c.s, c.k, b), hint: 'Multiply, do not add.', meta: { k: 'g3tm-ce-tf', s: c.s, k2: c.k, said: said } });
    }]
  ]);
  function tgCest(lv) {
    return function () {
      var c = ceCase(lv), b = R.pick(BIG), f2 = {}; f2[c.s + c.k] = c.k + ' groups of ' + c.s + ': multiply.';
      return { q: 'About how many cups does the ' + b + ' hold?', fig: estFig(c.s, c.k, b), done: 'About ' + c.s * c.k + ' cups.', steps: [
        { prompt: 'How much does one jug hold?', q: num('1 jug = ? cups', c.s, {}, { unit: 'cups', hint: 'Read the label under the jug.', meta: { k: 'g3tm-ce-one', s: c.s } }) },
        { prompt: 'The ' + b + ' holds about ' + c.k + ' jugs.', q: num(c.k + ' &times; ' + c.s + ' = ?', c.s * c.k, f2, { unit: 'cups', hint: 'Count by ' + c.s + 's, ' + c.k + ' times.', meta: { k: 'g3tm-mul' } }) }
      ] };
    };
  }

  /* ======================= Lesson 5: Mass or capacity? ======================= */
  var ASK = [['how heavy the pumpkin is', 'mass'], ['how heavy a bag of apples is', 'mass'], ['which rock is heavier', 'mass'], ['the mass of a backpack', 'mass'], ['how much soup the pot holds', 'capacity'], ['how much water the bathtub holds', 'capacity'], ['which bottle holds more juice', 'capacity'], ['how much milk fits in the jug', 'capacity'], ['how long recess lasts', 'time'], ['how long the movie is', 'time']];
  var TOOL = { mass: 'a pan balance', capacity: 'cups of water', time: 'a timer' }, TOOLS = ['a pan balance', 'cups of water', 'a timer', 'a ruler'];
  skill('tm-mix', 'Mass, capacity or time?', 'E2.3, E2.4, E2.6', [
    [1, 'plain', function (lv) {
      var t = R.pick(lv === 1 ? ASK.slice(0, 8) : ASK), right = TOOL[t[1]];
      return mc('To find out <b>' + t[0] + '</b>, what do you use?', right, TOOLS.filter(function (x) { return x !== right; }).map(function (x) { return [x, x === 'a ruler' ? 'A ruler measures length.' : x === 'a pan balance' ? 'A pan balance measures mass: how heavy.' : x === 'a timer' ? 'A timer measures time.' : 'Cups measure capacity: how much it holds.']; }),
        { hint: 'How heavy: mass. How much it holds: capacity. How long it lasts: time.', steps: ['This asks about ' + t[1] + '.', 'Use ' + right + '.'], explain: cap(right) + '.', meta: { k: 'g3tm-mx-tool', t: t[0] } });
    }],
    [1, 'which', function () {
      var t = R.pick(ASK.slice(0, 8)), ans = t[1] === 'mass' ? 0 : 1;
      return fixed('Is this about mass or capacity: <b>' + t[0] + '</b>?', ['mass', 'capacity'], ans, ans ? ['It asks how much it holds: capacity.'] : [null, 'It asks how heavy: mass.'], { hint: 'How heavy, or how much it holds?', steps: [t[1] === 'mass' ? 'How heavy: mass.' : 'How much it holds: capacity.'], explain: cap(t[1]) + '.', meta: { k: 'g3tm-mx-which', t: t[0] } });
    }],
    [2, 'num', function (lv) {
      if (coin()) { var o = cbObj(lv), M = heavy(o); return num('Find the <b>mass</b> in cubes. The balance is level.', M, {}, { unit: 'cubes', fig: balance(o, M), hint: 'Mass: count the cubes.', steps: ['Count the cubes: ' + M + '.'], explain: M + ' cubes.', meta: { k: 'g3tm-mx-num', o: o } }); }
      var c = R.int(6, 12), f0 = R.int(2, c - 1), ask = lv === 3 ? 'more' : 'in';
      return num(ask === 'more' ? 'This jug holds ' + c + ' cups. How many more cups of water will <b>fill it</b>?' : 'How many cups of water are <b>in</b> the jug?', ask === 'more' ? c - f0 : f0, {}, { unit: 'cups', fig: jug(c, f0), hint: 'Capacity: read the cup marks.', steps: ['The water is at ' + f0 + ' cups.'].concat(ask === 'more' ? [c + ' &minus; ' + f0 + ' = ' + (c - f0) + '.'] : []), explain: (ask === 'more' ? c - f0 : f0) + ' cups.', meta: { k: 'g3tm-mx-jug', c: c, ask: ask } });
    }],
    [2, 'tf', function () {
      var s = R.pick([['A pan balance measures how heavy an apple is.', true], ['A pan balance measures how much a bottle holds.', false], ['Cups of water measure how much a pot holds.', true], ['Cups of water measure how heavy a shoe is.', false], ['A bigger box always has more mass.', false], ['A timer measures how long a race takes.', true], ['A ruler measures how much a jug holds.', false], ['A tall glass always holds more than a wide bowl.', false]]), who = Q.name();
      return tf(who + ' says: <b>' + s[0] + '</b> True or false?', s[1], s[1] ? 'Yes: that is the right tool.' : 'No: mass uses a pan balance, capacity uses cups, time uses a timer.', ['Any tool measures anything.', 'Bigger always means heavier.', 'Taller always holds more.'], 'Match the question to the tool: how heavy, how much it holds, or how long.', { hint: 'Which tool goes with which question?', meta: { k: 'g3tm-mx-tf', s: s[0] } });
    }],
    [2, 'match', function (lv) {
      var pairs = [['How heavy is the pumpkin?', 'cubes'], ['How much does the pot hold?', 'cups'], ['How long is recess?', 'minutes']];
      if (lv === 3) pairs.push(['How long is the hallway?', 'metres']);
      return { q: 'Match each question to the unit you would use.', type: 'match', pairs: pairs, hint: 'Mass: cubes. Capacity: cups. Time: minutes. Length: metres.', steps: pairs.map(function (p) { return p[0] + ' ' + cap(p[1]) + '.'; }), explain: pairs.map(function (p) { return p[0] + ' ' + p[1]; }).join('. ') + '.', meta: { k: 'g3tm-mx-match' } };
    }]
  ]);
  function tgMix(kind) {
    return function () {
      var t = R.pick(ASK.filter(function (a) { return kind === 'any' ? a[1] !== 'time' : a[1] === kind; })), g = {}, ans = t[1] === 'mass' ? 0 : 1, f = {};
      g[1 - ans] = ans ? 'It asks how much it holds.' : 'It asks how heavy.';
      TOOLS.forEach(function (x, j) { if (x !== TOOL[t[1]]) f[j] = x === 'a ruler' ? 'A ruler measures length.' : 'Match the tool to ' + t[1] + '.'; });
      return { q: 'To find out ' + t[0] + ', what do you use?', fig: t[1] === 'mass' ? balance(['apple'], ['orange']) : cupsFig(5, 'pot'), done: cap(TOOL[t[1]]) + '.', steps: [
        { prompt: 'How heavy, or how much it holds?', q: fixed('This is about:', ['mass', 'capacity'], ans, g, { hint: 'Heavy: mass. Holds: capacity.', meta: { k: 'g3tm-mx-which', t: t[0] } }) },
        { prompt: 'Now pick the tool.', q: fixed('So you use:', TOOLS, TOOLS.indexOf(TOOL[t[1]]), f, { hint: 'Mass: a pan balance. Capacity: cups.', meta: { k: 'g3tm-mx-tool', t: t[0] } }) }
      ] };
    };
  }

  /* ======================= Watch and My turn pictures ======================= */
  var clockV = function (s) { var x = hm(s.t); return '<div class="tm-pair" style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center">' + clock(x[0], x[1], { fives: s.fives, sec: s.sec }) + (s.dig ? digital(x[0], x[1]) : '') + '</div>'; };
  var timerV = function (s) { return timer(Math.floor(s.s / 60), s.s % 60); };
  var lineV = function (s) { return '<div>' + two(hm(s.a), hm(s.b)) + (s.k != null ? lineFig(s.a, s.b, s.k) : '') + '</div>'; };
  var balV = function (s) { return balance(s.l, s.r); };
  var cupsV = function (s) { return s.jug ? jug(s.cap, s.n) : cupsFig(s.n, s.k || 'pot', { lvl: s.lvl, spill: s.spill, c: s.c }); };
  var jarV = function (s) { return '<div class="tm-pair" style="display:flex;gap:16px;justify-content:center">' + jarFig('balls') + (s.both ? jarFig('water') : '') + '</div>'; };
  var estV = function (s) { return estFig(s.s, s.k, s.b || 'pot'); };
  function steps(from, to, by, mk) { var p = []; for (var i = from; i <= to; i += by) p.push(mk(i)); return p; }

  /* ======================= The lessons ======================= */
  var LESSONS = [
    { id: 'clock', title: 'Read a clock', sub: 'The short hand, the long hand, and the words we say.', concepts: [
      { id: 'hands', title: 'The short hand shows the hour', exp: ['E2.6'], skill: 'tm-hour',
        watch: clip(clockV, { t: 180 }, [
          ['Short hand on 3, long hand on 12: 3 o\'clock.'],
          ['The long hand goes once around.', steps(185, 240, 5, function (t) { return { t: t }; })],
          ['The short hand moved on to 4: 4 o\'clock.', null, 2000]
        ]),
        example: clip(clockV, { t: 470 }, [
          ['My turn. The short hand is near 8.'],
          ['Is it 8? No: it has not reached 8 yet.', null, 2200],
          ['It passed 7. The hour is 7.', { sym: 'hour: 7' }]
        ]),
        try: { mount: G3.play({ state: { t: 180 }, draw: function (s) { var x = hm(s.t); return clock(x[0], x[1]); }, buttons: [['&minus; 1 hour', -60], ['+ 5 min', 5], ['+ 1 hour', 60]].map(function (b) { return { label: b[0], act: function (s) { s.t = ((s.t + b[1]) % 720 + 720) % 720; } }; }),
          tasks: [{ do: 'Set the clock to <b>9 o\'clock</b>.', goal: function (s) { return s.t === 540; }, yes: 'Short hand on 9, long hand on 12.' }] }), do: '' },
        together: [tgHour(1), tgHour(2), tgHour(3)],
        mistake: '<p>Reading the long hand as the hour, or naming the hour the short hand is close to but has not reached (saying 8 at 7:50). Ask: "Which number has the short hand passed?"</p>',
        check: [ck('tm-hour', 'plain', 1), ck('tm-hour', 'mc', 1), ck('tm-hour', 'tap', 2), ck('tm-hour', 'later', 2), ck('tm-hour', 'plain', 3)] },

      { id: 'fives', title: 'Count the minutes by 5s', exp: ['E2.6'], skill: 'tm-five',
        watch: clip(clockV, { t: 240, fives: true }, [
          ['Each number on the clock is 5 more minutes.'],
          ['5, 10, 15, 20, 25.', steps(245, 265, 5, function (t) { return { t: t, sym: (t - 240) + ' minutes' }; }), 2000],
          ['Long hand on 5: 25 minutes past 4.', { sym: '4:25' }]
        ]),
        example: clip(clockV, { t: 120, fives: true }, [
          ['My turn. The long hand points to 8.'],
          ['Is that 8 minutes? No: count by 5s.', steps(125, 160, 5, function (t) { return { t: t, sym: (t - 120) + '' }; }), 2400],
          ['40 minutes past 2: 2:40.', { sym: '2:40' }]
        ]),
        together: [tgFive(1), tgFive(2), tgFive(3)],
        mistake: '<p>Reading the number the long hand points to as the minutes (the 8 as "8 minutes"). Count by 5s together, pointing at each number, starting from 12.</p>',
        check: [ck('tm-five', 'plain', 1), ck('tm-five', 'fill', 1), ck('tm-five', 'mc', 2), ck('tm-five', 'until', 2), ck('tm-five', 'until', 3)] },

      { id: 'minute', title: 'Count on to the exact minute', exp: ['E2.6'], skill: 'tm-minute',
        watch: clip(clockV, { t: 380 }, [
          ['Between two numbers there are 5 small marks: 1 minute each.'],
          ['By 5s to 20, then 1, 2, 3.', steps(381, 383, 1, function (t) { return { t: t }; }), 2000],
          ['23 minutes past 6: 6:23.', { sym: '6:23' }]
        ]),
        example: clip(clockV, { t: 590 }, [
          ['My turn. The long hand is past the 10.'],
          ['By 5s to 50, then 1, 2, 3, 4.', steps(591, 594, 1, function (t) { return { t: t }; }), 2200],
          ['The short hand is near 10. Is it 10:54? No: it passed 9. 9:54.', { sym: '9:54' }, 2600]
        ]),
        together: [tgMinute(1), tgMinute(2), tgMinute(3)],
        mistake: '<p>Stopping at the last 5 and forgetting the small marks, or reading the hour as the next number when it is almost the hour. Count by 5s, then touch each small mark.</p>',
        check: [ck('tm-minute', 'plain', 1), ck('tm-minute', 'fill', 1), ck('tm-minute', 'marks', 2), ck('tm-minute', 'mc', 2), ck('tm-minute', 'plain', 3)] },

      { id: 'words', title: 'Quarter past, half past, quarter to', exp: ['E2.6'], skill: 'tm-words',
        watch: clip(clockV, { t: 480 }, [
          ['8 o\'clock.'],
          ['A quarter of the way around: quarter past 8.', { t: 495, sym: '8:15' }],
          ['Halfway: half past 8.', { t: 510, sym: '8:30' }],
          ['15 minutes before 9: quarter to 9.', { t: 525, sym: '8:45' }, 2200]
        ]),
        example: clip(clockV, { t: 405 }, [
          ['My turn. The long hand is on 9.'],
          ['Quarter to 6? No: "to" names the next hour.', null, 2400],
          ['Quarter to 7.', { sym: '6:45 = quarter to 7' }]
        ]),
        together: [tgWords(15), tgWords(45), tgWords(30)],
        mistake: '<p>Naming quarter to after the hour just passed (6:45 as "quarter to 6"), or mixing up past and to. Past: the long hand is on the right side. To: it is on the left side, heading back to 12.</p>',
        check: [ck('tm-words', 'plain', 1), ck('tm-words', 'num', 1), ck('tm-words', 'match', 2), ck('tm-words', 'fill', 2), ck('tm-words', 'plain', 3)] }
    ] },

    { id: 'digital', title: 'Digital time and timers', sub: 'Digital clocks, seconds, and how long things take.', concepts: [
      { id: 'screen', title: 'Digital clocks', exp: ['E2.6'], skill: 'tm-digital',
        watch: clip(clockV, { t: 185, dig: true }, [
          ['Hours, a colon, then 2 digits for minutes.'],
          ['5 minutes past 3: 3:05. The 0 holds the place.', { sym: '3:05' }, 2200],
          ['3:50 is very different: 50 minutes past 3.', { t: 230, sym: '3:50' }, 2200]
        ]),
        example: clip(clockV, { t: 541, dig: true }, [
          ['My turn. 1 minute past 9.'],
          ['Is it 9:1? No: minutes take 2 digits. 9:01.', { sym: '9:01' }, 2400],
          ['Quarter past 11: 11:15.', { t: 675, sym: '11:15' }]
        ]),
        together: [tgDigital(1), tgDigital(2), tgDigital(3)],
        mistake: '<p>Writing 3:5 for 3:05, or reading 3:05 and 3:50 as the same time. Say the minutes as a 2-digit number: "oh-five" is 5 minutes, "fifty" is 50.</p>',
        check: [ck('tm-digital', 'plain', 1), ck('tm-digital', 'mc', 1), ck('tm-digital', 'tap', 2), ck('tm-digital', 'num', 2), ck('tm-digital', 'plain', 3)] },

      { id: 'timer', title: 'Timers count minutes and seconds', exp: ['E2.6'], skill: 'tm-timer',
        watch: clip(timerV, { s: 0 }, [
          ['A timer: minutes, then seconds.'],
          ['After 60 seconds it shows 1:00.', steps(10, 60, 10, function (s) { return { s: s }; }), 1600],
          ['1:15 is 60 + 15 = 75 seconds.', { s: 75, sym: '1:15 = 75 seconds' }, 2200]
        ]),
        example: clip(timerV, { s: 130 }, [
          ['My turn. 2:10.'],
          ['Is it 210 seconds? No: a minute is 60, not 100.', null, 2400],
          ['60 + 60 + 10 = 130 seconds.', { sym: '2:10 = 130 seconds' }]
        ]),
        try: { mount: G3.play({ state: { s: 75 }, draw: function (s) { return timer(Math.floor(s.s / 60), s.s % 60); },
          sliders: [{ key: 's', label: 'Timer', min: 10, max: 180, step: 5, fmt: function (v) { return v + ' seconds'; } }],
          tasks: [{ do: 'Set the timer to exactly <b>2 minutes</b>.', goal: function (s) { return s.s === 120; }, yes: '2 &times; 60 = 120 seconds.' }] }), do: '' },
        together: [tgTimer(1), tgTimer(2), tgTimer(3)],
        mistake: '<p>Treating the timer reading as one number (2:10 as 210 seconds). Point at the colon: minutes on the left, seconds on the right, and each minute is 60 seconds.</p>',
        check: [ck('tm-timer', 'plain', 1), ck('tm-timer', 'fill', 1), ck('tm-timer', 'more', 2), ck('tm-timer', 'race', 2), ck('tm-timer', 'plain', 3)] },

      { id: 'units', title: 'Seconds, minutes and hours', exp: ['E2.6'], skill: 'tm-units',
        watch: clip(clockV, { t: 120, sec: 0 }, [
          ['The thin red hand counts seconds.'],
          ['Once around: 60 seconds.', steps(15, 60, 15, function (s) { return { sec: s % 60, t: s === 60 ? 121 : 120 }; }), 1800],
          ['60 seconds make 1 minute. 60 minutes make 1 hour.', { sym: '60 s = 1 min, 60 min = 1 h' }, 2400]
        ]),
        example: clip(clockV, { t: 300 }, [
          ['My turn. How many minutes in 2 hours?'],
          ['Is it 200? No: an hour is 60 minutes.', null, 2200],
          ['60 + 60 = 120 minutes.', { t: 420, sym: '2 hours = 120 minutes' }]
        ]),
        together: [tgUnits(1), tgUnits(2), tgUnits(3)],
        mistake: '<p>Using 100 instead of 60 (1 hour = 100 minutes), or choosing the wrong unit for a task. Use the clock: the long hand goes once around in 60 minutes.</p>',
        check: [ck('tm-units', 'plain', 1), ck('tm-units', 'match', 1), ck('tm-units', 'fill', 2), ck('tm-units', 'story', 2), ck('tm-units', 'plain', 3)] },

      { id: 'later', title: 'How long? Count on', exp: ['E2.6'], skill: 'tm-later',
        watch: clip(lineV, { a: 160, b: 195 }, [
          ['From 2:40 to 3:15.'],
          ['Hop to the hour: 2:40 to 3:00 is 20 minutes.', { k: 1 }],
          ['Hop on: 3:00 to 3:15 is 15 more. 20 + 15 = 35 minutes.', { k: 2, sym: '35 minutes' }, 2400]
        ]),
        example: clip(lineV, { a: 290, b: 335 }, [
          ['My turn. From 4:50 to 5:35.'],
          ['Is it 85? No: an hour is not 100 minutes.', null, 2200],
          ['10 minutes to 5:00, then 35 more: 45 minutes.', { k: 2, sym: '10 + 35 = 45 minutes' }, 2400]
        ]),
        together: [tgLater(1), tgLater(2), tgLater(3)],
        mistake: '<p>Subtracting times like plain numbers (3:15 &minus; 2:40 = 75). Count on: first to the next o\'clock, then on to the end, and add the hops.</p>',
        check: [ck('tm-later', 'plain', 1), ck('tm-later', 'ends', 1), ck('tm-later', 'story', 2), ck('tm-later', 'plain', 2), ck('tm-later', 'ends', 3)] }
    ] },

    { id: 'mass', title: 'Mass', sub: 'How heavy, with a pan balance and cubes.', concepts: [
      { id: 'balance', title: 'The heavier side goes down', exp: ['E2.4'], skill: 'tm-bal',
        watch: clip(balV, { l: [], r: [] }, [
          ['An empty balance is level.'],
          ['A shoe on one side: that side goes down.', { l: ['shoe'] }],
          ['A mug on the other: the mug side goes down. The mug is heavier.', { r: ['mug'] }, 2400]
        ]),
        example: clip(balV, { l: ['pillow'], r: [] }, [
          ['My turn. A big pillow and a small stone.'],
          ['The pillow is bigger. Is it heavier? No: the stone side went down.', { r: ['stone'] }, 2600],
          ['Bigger is not always heavier.']
        ]),
        together: [tgBal(1), tgBal(2), tgBal(3)],
        mistake: '<p>Judging mass by size (a big pillow "must be" heavier than a small stone). Hold the two things, then check with the balance: the lower side is heavier.</p>',
        check: [ck('tm-bal', 'plain', 1), ck('tm-bal', 'tf', 1), ck('tm-bal', 'diff', 2), ck('tm-bal', 'level', 2), ck('tm-bal', 'level', 3)] },

      { id: 'cubes', title: 'Level means equal: count the cubes', exp: ['E2.4'], skill: 'tm-cubes',
        watch: clip(balV, { l: ['apple'], r: 0 }, [
          ['An apple on one side.'],
          ['Add cubes one at a time.', steps(1, 9, 1, function (i) { return { r: i }; }), 1200],
          ['Level: the apple balances 9 cubes.', { sym: 'apple = 9 cubes' }]
        ]),
        example: clip(balV, { l: ['orange'], r: 0 }, [
          ['My turn. An orange.', steps(1, 11, 1, function (i) { return { r: i }; }), 1200],
          ['One row of 6, and 5 more.', null, 2000],
          ['6 + 5 = 11. The orange balances 11 cubes.', { sym: 'orange = 11 cubes' }]
        ]),
        try: { mount: G3.play({ state: { k: 'apple', c: 0 }, draw: function (s) { return balance([s.k], s.c); },
          selects: [{ key: 'k', label: 'Object', options: TH.map(function (k) { return [k, k]; }), change: function (s) { s.c = 0; } }],
          buttons: [{ label: '+ 1 cube', act: function (s) { if (s.c < 30) s.c++; } }, { label: '+ 6 cubes', act: function (s) { s.c = Math.min(30, s.c + 6); } }, { label: '&minus; 1 cube', act: function (s) { if (s.c) s.c--; } }],
          info: function (s) { var d = MASS[s.k] - s.c; return d > 0 ? 'The ' + s.k + ' is heavier. Add cubes.' : d < 0 ? 'The cubes are heavier. Take some away.' : '<b>Level.</b> The ' + s.k + ' balances ' + MASS[s.k] + ' cubes.'; },
          tasks: [{ do: 'Find the mass of the <b>shoe</b> in cubes.', goal: function (s) { return s.k === 'shoe' && s.c === MASS.shoe; }, yes: 'The shoe balances 15 cubes.' }] }), do: '' },
        together: [tgCubes(1), tgCubes(2), tgCubes(3)],
        mistake: '<p>Counting cubes before the balance is level, or losing count. Wait until it is level, then count the cubes in rows of 6.</p>',
        check: [ck('tm-cubes', 'plain', 1), ck('tm-cubes', 'fill', 1), ck('tm-cubes', 'total', 2), ck('tm-cubes', 'many', 2), ck('tm-cubes', 'many', 3)] },

      { id: 'mest', title: 'Estimate, then measure', exp: ['E2.4'], skill: 'tm-mest',
        watch: clip(balV, { l: ['shoe'], r: 0 }, [
          ['Guess first: a shoe is heavier than an apple, about 12 cubes?', null, 2400],
          ['Now measure.', steps(1, 15, 1, function (i) { return { r: i }; }), 1300],
          ['15 cubes. 15 &minus; 12 = 3: the guess was 3 off.', { sym: 'off by 3' }, 2200]
        ]),
        example: clip(balV, { l: ['mug'], r: 0 }, [
          ['My turn. I estimate 20 cubes.'],
          ['I measure.', steps(1, 18, 1, function (i) { return { r: i }; }), 1300],
          ['18. Was 20 wrong? No: it was close, only 2 off.', { sym: '20 &minus; 18 = 2' }, 2400]
        ]),
        together: [tgMest(1), tgMest(2), tgMest(3)],
        mistake: '<p>Thinking an estimate must be exact, or skipping the estimate. Estimate first, measure, then say how far off it was. Use a known thing ("an apple is about 9 cubes") to help.</p>',
        check: [ck('tm-mest', 'plain', 1), ck('tm-mest', 'close', 1), ck('tm-mest', 'fill', 2), ck('tm-mest', 'bench', 2), ck('tm-mest', 'bench', 3)] }
    ] },

    { id: 'capacity', title: 'Capacity', sub: 'How much a container holds.', concepts: [
      { id: 'cups', title: 'Count full cups to measure capacity', exp: ['E2.3'], skill: 'tm-cups',
        watch: clip(cupsV, { jug: true, cap: 8, n: 0 }, [
          ['Pour in full cups, one at a time.', steps(1, 8, 1, function (i) { return { n: i }; }), 1400],
          ['Full to the top: the jug holds 8 cups.', { sym: 'capacity: 8 cups' }]
        ]),
        example: clip(cupsV, { k: 'bucket', n: 11 }, [
          ['My turn. These cups filled the bucket.'],
          ['8 in the top row, 3 more.', null, 2000],
          ['8 + 3 = 11. The bucket holds 11 cups.', { sym: '11 cups' }]
        ]),
        together: [tgCups(1), tgCups(2), tgCups(3)],
        mistake: '<p>Losing count, or thinking a taller container always holds more. Pour, count each full cup, and compare the counts.</p>',
        check: [ck('tm-cups', 'plain', 1), ck('tm-cups', 'jug', 1), ck('tm-cups', 'total', 2), ck('tm-cups', 'diff', 2), ck('tm-cups', 'jug', 3)] },

      { id: 'careful', title: 'Full cups, no spills, no gaps', exp: ['E2.3'], skill: 'tm-fill',
        watch: clip(cupsV, { n: 6, k: 'pot' }, [
          ['6 full cups fill this pot.', { sym: '6: just right' }],
          ['Half-full cups: 12 of them. Too high.', { n: 12, lvl: 0.5, sym: '12: too high' }, 2200],
          ['Stop early: only 4. Too low.', { n: 4, lvl: 1, c: 0.7, sym: '4: too low' }, 2200]
        ]),
        example: clip(jarV, { both: false }, [
          ['My turn. A jar filled with balls.'],
          ['Is it full? No: there are gaps between the balls.', null, 2400],
          ['Water fills every gap. Pour units that flow.', { both: true }]
        ]),
        together: [tgFill('half'), tgFill('spill'), tgFill('short')],
        mistake: '<p>Not filling each cup to the top, letting the container overflow, or using units that leave gaps (blocks, balls). Practise at the sink: fill to a line, stop at the top, and pour units like rice or water.</p>',
        check: [ck('tm-fill', 'plain', 1), ck('tm-fill', 'half', 1), ck('tm-fill', 'spill', 2), ck('tm-fill', 'gaps', 2), ck('tm-fill', 'half', 3)] },

      { id: 'cest', title: 'Estimate with a known container', exp: ['E2.3'], skill: 'tm-cest',
        watch: clip(estV, { s: 4, k: 1 }, [
          ['This jug holds 4 cups.'],
          ['The pot looks like about 3 jugs.', { k: 3 }],
          ['3 &times; 4 = about 12 cups.', { sym: 'about 12 cups' }]
        ]),
        example: clip(estV, { s: 3, k: 1, b: 'bucket' }, [
          ['My turn. A 3-cup jug and a bucket.'],
          ['About 5 jugs. Is that 3 + 5 = 8? No: 5 jugs of 3.', { k: 5 }, 2400],
          ['5 &times; 3 = about 15 cups.', { sym: 'about 15 cups' }]
        ]),
        together: [tgCest(1), tgCest(2), tgCest(3)],
        mistake: '<p>Adding the cups and the jugs (3 + 5) instead of counting groups, or guessing wildly. Use a known container as a benchmark: "about how many of these?"</p>',
        check: [ck('tm-cest', 'plain', 1), ck('tm-cest', 'fill', 1), ck('tm-cest', 'half', 2), ck('tm-cest', 'check', 2), ck('tm-cest', 'plain', 3)] }
    ] },

    { id: 'mix', title: 'Which one?', sub: 'Mass, capacity or time: choose what to measure.', concepts: [
      { id: 'which', title: 'Heavy, holds, or how long?', exp: ['E2.3', 'E2.4', 'E2.6'], skill: 'tm-mix',
        watch: clip(balV, { l: ['apple'], r: 9 }, [
          ['How heavy? Mass: a pan balance.', { sym: 'mass: cubes' }],
          ['How much it holds? Capacity: cups.', null, 2000],
          ['How long it lasts? Time: a timer or a clock.', null, 2000]
        ]),
        example: clip(cupsV, { k: 'bottle', n: 4 }, [
          ['My turn. How much juice fits in the bottle?'],
          ['Heavy? No: it asks how much it holds.', null, 2200],
          ['Capacity: count the cups. 4 cups.', { sym: 'capacity: 4 cups' }]
        ]),
        together: [tgMix('mass'), tgMix('capacity'), tgMix('any')],
        mistake: '<p>Mixing up mass and capacity (weighing a bottle to see how much it holds). Ask: "Is the question how heavy, how much it holds, or how long?"</p>',
        check: [ck('tm-mix', 'plain', 1), ck('tm-mix', 'which', 1), ck('tm-mix', 'num', 2), ck('tm-mix', 'tf', 2), ck('tm-mix', 'plain', 3)] }
    ] }
  ];

  A.register(CH, {
    full: true,
    lessons: LESSONS,
    quiz: [
      num('What hour is it? Read the short hand.', 7, { 8: 'The short hand has not reached 8 yet.' }, { fig: clock(7, 50), hint: 'The number the short hand has passed.', explain: 'The hour is 7.', meta: { k: 'g3tm-hr-num' } }),
      num('Count by 5s. How many minutes past the hour is it?', 35, { 7: 'Count by 5s.' }, { unit: 'minutes', fig: clock(4, 35), hint: 'Start at 12.', explain: '35 minutes.', meta: { k: 'g3tm-fv-num' } }),
      num('The timer shows <b>2:15</b>. How many seconds is that in all?', 135, { 215: 'A minute is 60 seconds, not 100.' }, { unit: 'seconds', fig: timer(2, 15), hint: '1 minute = 60 seconds.', explain: '60 + 60 + 15 = 135 seconds.', meta: { k: 'g3tm-tw-num' } }),
      num('How many minutes from the start to the end?', 35, { 75: 'An hour is 60 minutes, not 100.' }, { unit: 'minutes', fig: two([2, 40], [3, 15]), hint: 'Count on to 3:00 first.', explain: '20 + 15 = 35 minutes.', meta: { k: 'g3tm-lt-num' } }),
      num('Sam puts an orange on a pan balance and adds cubes until it is level. What is the mass in cubes?', 11, {}, { unit: 'cubes', fig: balance(['orange'], 11), hint: 'Count the cubes.', explain: '11 cubes.', meta: { k: 'g3tm-cb-num', o: ['orange'] } }),
      num('A jug holds <b>4 cups</b>. The pot holds about <b>3 jugs</b>. About how many cups does the pot hold?', 12, { 7: 'Multiply: 3 jugs of 4.' }, { unit: 'cups', fig: estFig(4, 3, 'pot'), hint: '3 groups of 4.', explain: 'About 12 cups.', meta: { k: 'g3tm-ce-num' } })
    ],
    practice: SKILLS.map(function (s) { return { id: s.id, name: s.name, code: s.code, gen: DEF[s.id][0][2] }; })
  });

  /* every skill's other shapes (docs/QUESTIONS.md); each skill keeps its first way of asking as "plain" */
  var SHAPES = {};
  SKILLS.forEach(function (s) { SHAPES[s.id] = DEF[s.id].slice(1); });
  Q.shapes(CH, SHAPES);
})();
