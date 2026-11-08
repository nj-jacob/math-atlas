/* Math Atlas worksheets: pictures for Grades 4 to 8, added to the shared picture table of sheets.js (Atlas.sheets.pics).
   The Grade 1 to 3 pictures are in sheet-pics.js. Each picture is used in a sheet as pic: ['<name>', options] and is drawn
   from (x, y) within width w; it returns { svg, h, w } and, when its blanks take answers, used: how many it took.
     amodel { a, b, fill }     an area model: a split by place value across the top, b down the side; each part
                                product is a blank (answers in order, one column at a time) or, with fill: true, written in
     mult  { a, b }             the standard algorithm: a over × b, one line per digit of b, then the total
                                (answers in order: the lines, then the total; one line only when b has one digit)
     shareR { t, g }            t things to share into g plates; the key draws each share and the leftovers in a
                                dashed "left over" ring (t ÷ g = [] R [])
     chunks { t, d, steps }     a bar for t cut into chunks of groups of d (steps: [20, 2] is 20 groups, then 2 groups);
                                each chunk shows how many groups above it and how much it takes below it
     disks { n } or { list: [[1000, 3], [100, 12]] }   place value disks: the digits of n, or a count of each disk
     hill  { lo, hi, n, ask }   rounding: a hill from lo to hi with its top at halfway and n marked on it
                                (ask: true leaves n unmarked for the child to mark; the key marks it)
     grid  { n, cells, unit, ask, u, quiet }  a 10 by 10 grid with n squares shaded (cells: 10 for tenths strips; unit:
                                what one square is worth, written beside it unless quiet; ask: how many the child shades,
                                drawn in on the key; u: the size of a square, 11 at most)
     fbars { rows: [[n, k], ...], labels }   fraction bars of the same length stacked: each row cut into n parts with k
                                shaded; a k bigger than n draws more bars side by side (11/4 is 2 whole bars and 3/4)
     mix   { a, b, g }          a ratio: a shaded circles and b open squares, in g groups of that mix (g 1 when left out)
     grow  { m, b, k }          a growing pattern: figures 1 to k, figure n has b shaded tiles that never change and
                                m rows of n open tiles (m × n + b tiles in all)
     code  { lines }            a short program in a box, one instruction per line (two spaces in front indent a line)
     dbar  { cats, sets, keys, min, max, step, stack, title, h }   a bar graph (h: plot height, 64 when left out): one bar per set in each category (two sets
                                make a double bar graph, with keys as its legend), or the sets stacked in one bar; min
                                starts the scale above 0 (a graph that misleads), with a zigzag on the axis
     lineg { cats, vals, min, max, step, title, h }   a line graph: a point for each category, joined in order
     spin  { parts }            a spinner cut into equal parts, each labelled (['R', 'R', 'B'] is 2 parts R and 1 part B)
     dline { min, max, d, show, pt, ask }   a number line cut into d parts per whole; show 'dec' or 'frac' labels every
                                part ('ends' labels the two ends and any whole number); pt marks a point; ask: [values] puts a line to
                                write on under each (answers in order)
     pvmove { n, shift, dir }   a place value chart with n in it; with shift, a second row shows n × 10^shift
                                (dir 'x') or n ÷ 10^shift (dir 'd'), drawn only on the answer key
   Numbers of 5 or more digits are written with a space (12 500), using S.fmt from sheets.js. The answer checks are in tests/verify/sheets.js. */
(function () {
  'use strict';
  var S = window.Atlas && Atlas.sheets;
  if (!S || !S.pics) return;
  var P = S.pics, D = S.draw, fmt = S.fmt, T = D.T, tw = D.tw, INK = D.INK, INK2 = D.INK2, LINE = D.LINE, KEY = D.KEY;

  /* the place value parts of a whole number, biggest first: 234 gives [200, 30, 4] (zero parts are left out) */
  function parts(n) {
    var s = String(n), out = [];
    s.split('').forEach(function (d, i) { if (d !== '0') out.push(+d * Math.pow(10, s.length - 1 - i)); });
    return out;
  }
  S.parts = parts;
  function line(x1, y1, x2, y2, o) { o = o || {}; return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (o.s || INK) + '" stroke-width="' + (o.sw || 1.2) + '"/>'; }
  function blank(cx, y, wd) { return '<line class="blank" x1="' + (cx - wd / 2) + '" y1="' + y + '" x2="' + (cx + wd / 2) + '" y2="' + y + '" stroke="' + INK + '" stroke-width="1.3"/>'; }

  /* an area model: one column per part of a, one row per part of b; wider parts get wider cells */
  P.amodel = function (p, x, y, w, key) {
    var top = parts(p.a), side = parts(p.b), lab = 34, head = 18, rh = 30, out = '', used = 0;
    var avail = Math.min(w, 300) - lab, minW = 54, weights = top.map(function (v) { return Math.max(1, Math.log(v) / Math.LN10 + 1); });
    var sum = weights.reduce(function (s, v) { return s + v; }, 0);
    var widths = weights.map(function (v) { return Math.max(minW, avail * v / sum); });
    var total = widths.reduce(function (s, v) { return s + v; }, 0);
    if (total > avail) widths = widths.map(function (v) { return v * avail / total; });
    var x0 = x + lab, y0 = y + head, cx = x0;
    top.forEach(function (v, i) { out += T(cx + widths[i] / 2, y + 13, fmt(v), { s: 12, w: 700, f: INK2, a: 'middle' }); cx += widths[i]; });
    side.forEach(function (v, j) { out += T(x0 - 6, y0 + j * rh + rh / 2 + 4, fmt(v), { s: 12, w: 700, f: INK2, a: 'end' }); });
    cx = x0;
    top.forEach(function (tv, i) {
      side.forEach(function (sv, j) {
        var cy = y0 + j * rh, mid = cx + widths[i] / 2, prod = fmt(tv * sv);
        out += '<rect x="' + cx + '" y="' + cy + '" width="' + widths[i] + '" height="' + rh + '" fill="#fff" stroke="' + INK2 + '" stroke-width="1.1"/>';
        if (p.fill) out += T(mid, cy + rh / 2 + 5, prod, { s: 13, w: 700, a: 'middle' });
        else {
          out += blank(mid, cy + rh - 8, Math.min(widths[i] - 12, 44));
          if (key) out += T(mid, cy + rh - 12, prod, { s: 13, w: 700, f: KEY, a: 'middle' });
          used++;
        }
      });
      cx += widths[i];
    });
    return { svg: out, h: head + side.length * rh, w: cx - x, used: used };
  };

  /* the standard algorithm for a × b, lined up by place value */
  P.mult = function (p, x, y, w, key) {
    var bd = String(p.b).split('').reverse(), lines = bd.length > 1 ? bd.map(function (d, i) { return p.a * +d * Math.pow(10, i); }) : [];
    var all = lines.concat([p.a * p.b]), digits = String(p.a * p.b).length + 1, d = 15, right = x + 28 + digits * d, out = '', ry = y + 18;
    function num(v, yy, colour) { String(v).split('').reverse().forEach(function (ch, i) { out += T(right - i * d - d / 2, yy, ch, { s: 18, w: 700, f: colour || INK, a: 'middle' }); }); }
    num(p.a, ry); ry += 22;
    num(p.b, ry); out += T(right - digits * d - 4, ry, '×', { s: 18, w: 700, a: 'middle' });
    out += line(x + 14, ry + 7, right + 2, ry + 7, { sw: 1.5 }); ry += 28;
    all.forEach(function (v, i) {
      if (i === all.length - 1 && lines.length) { out += line(x + 14, ry - 15, right + 2, ry - 15, { sw: 1.5 }); ry += 6; }
      out += blank(right - String(v).length * d / 2 - 2, ry + 6, String(v).length * d + 8);
      if (key) num(v, ry, KEY);
      ry += 26;
    });
    return { svg: out, h: ry - y - 10, w: right - x + 4, used: all.length };
  };

  /* sharing with leftovers: t things in rows, g plates and a dashed ring for what is left over */
  P.shareR = function (p, x, y, w, key) {
    var out = '', per = Math.min(p.t, Math.floor((w - 6) / 14)), each = Math.floor(p.t / p.g), left = p.t % p.g;
    for (var i = 0; i < p.t; i++) out += '<circle cx="' + (x + 6 + (i % per) * 14) + '" cy="' + (y + 6 + Math.floor(i / per) * 14) + '" r="4.4" fill="' + INK + '"/>';
    var top = y + Math.ceil(p.t / per) * 14 + 10, n = p.g + 1, pr = Math.min(18, (w - 8 * (n - 1)) / n / 2);
    function dots(cx, cy, k) {
      var s = '';
      for (var d = 0; d < k; d++) { var ang = d / k * Math.PI * 2, rr = k > 1 ? pr * 0.55 : 0; s += '<circle cx="' + (cx + Math.cos(ang) * rr) + '" cy="' + (cy + Math.sin(ang) * rr) + '" r="3.2" fill="' + KEY + '"/>'; }
      return s;
    }
    for (var j = 0; j < n; j++) {
      var cx = x + pr + j * (pr * 2 + 8), cy = top + pr, last = j === p.g;
      out += '<circle class="plate" cx="' + cx + '" cy="' + cy + '" r="' + pr + '" fill="#fff" stroke="' + INK2 + '" stroke-width="1.2"' + (last ? ' stroke-dasharray="3 3"' : '') + '/>';
      if (key) out += dots(cx, cy, last ? left : each);
    }
    out += T(x + p.g * (pr * 2 + 8) + pr, top + pr * 2 + 13, 'left over', { s: 9, f: INK2, a: 'middle' });
    return { svg: out, h: top - y + pr * 2 + 16, w: n * (pr * 2 + 8) - 8 };
  };

  /* dividing in chunks: one bar for the total, cut where each chunk of groups ends */
  P.chunks = function (p, x, y, w) {
    var bw = Math.min(w, 300) - 4, h = 26, out = '', cx = x, ty = y + 12, MIN = 56;
    /* each chunk is as wide as its share of the bar, but never too narrow to read */
    var widths = p.steps.map(function (g) { return bw * g * p.d / p.t; }), small = widths.filter(function (v) { return v < MIN; }).length;
    var big = widths.reduce(function (s, v) { return s + (v < MIN ? 0 : v); }, 0), scale = (bw - small * MIN) / big;
    p.steps.forEach(function (g, i) {
      var cw = widths[i] < MIN ? MIN : widths[i] * scale;
      out += '<rect x="' + cx + '" y="' + ty + '" width="' + cw + '" height="' + h + '" fill="#fff" stroke="' + INK2 + '" stroke-width="1.2"/>';
      out += T(cx + cw / 2, y + 8, g + (g === 1 ? ' group' : ' groups'), { s: 10, f: INK2, a: 'middle' });
      out += T(cx + cw / 2, ty + 18, fmt(g * p.d), { s: 12, w: 700, a: 'middle' });
      cx += cw;
    });
    out += T(x, ty + h + 15, '0', { s: 10, f: INK2 }) + T(x + bw, ty + h + 15, fmt(p.t), { s: 10, f: INK2, a: 'end' });
    return { svg: out, h: h + 32, w: bw };
  };

  /* place value disks: one row of disks per place, biggest place first, with its value on each disk */
  P.disks = function (p, x, y, w) {
    var list = p.list || parts(p.n).map(function (v) { var pl = Math.pow(10, String(v).length - 1); return [pl, v / pl]; });
    var r = 13, gap = 3, out = '', cy = y + r, most = 0;
    list.forEach(function (row) {
      var per = Math.max(1, Math.floor((w - 4) / (2 * r + gap))), lines = Math.ceil(row[1] / per);
      for (var i = 0; i < row[1]; i++) {
        var cx = x + r + (i % per) * (2 * r + gap), yy = cy + Math.floor(i / per) * (2 * r + gap), lab = fmt(row[0]);
        out += '<circle cx="' + cx + '" cy="' + yy + '" r="' + r + '" fill="#fff" stroke="' + INK2 + '" stroke-width="1.1"/>' + T(cx, yy + 3.5, lab, { s: lab.length > 4 ? 6.5 : lab.length > 3 ? 8 : lab.length > 2 ? 9 : 10.5, w: 700, a: 'middle' });
      }
      most = Math.max(most, Math.min(row[1], per));
      cy += lines * (2 * r + gap) + 5;
    });
    return { svg: out, h: cy - y - r - 5, w: most * (2 * r + gap) };
  };

  /* rounding on a hill: lo at the left foot, hi at the right foot, halfway at the top */
  P.hill = function (p, x, y, w, key) {
    var bw = Math.min(w, 260) - 30, x0 = x + 15, base = y + 54, top = y + 14, out = '';
    function at(v) { var t = (v - p.lo) / (p.hi - p.lo); return { x: x0 + t * bw, y: base - (base - top) * Math.sin(Math.PI * t) }; }
    var d = 'M' + x0 + ' ' + base;
    for (var i = 1; i <= 40; i++) { var q = at(p.lo + (p.hi - p.lo) * i / 40); d += ' L' + q.x.toFixed(1) + ' ' + q.y.toFixed(1); }
    out += '<path d="' + d + '" fill="none" stroke="' + INK2 + '" stroke-width="1.4"/>';
    out += '<line x1="' + x0 + '" y1="' + base + '" x2="' + (x0 + bw) + '" y2="' + base + '" stroke="' + LINE + '" stroke-width="1"/>';
    [[p.lo, 'start'], [(p.lo + p.hi) / 2, 'middle'], [p.hi, 'end']].forEach(function (m) {
      var q = at(m[0]);
      out += T(m[1] === 'middle' ? q.x : m[1] === 'start' ? x0 - 6 : x0 + bw + 6, m[1] === 'middle' ? q.y - 5 : base + 15, fmt(m[0]), { s: 10, f: INK2, a: m[1] });
    });
    /* n's label goes under the line, or above its dot when it is near a foot (where the end labels are) */
    if (!p.ask || key) {
      var n = at(p.n), c = p.ask ? KEY : INK, t = (p.n - p.lo) / (p.hi - p.lo), near = t < 0.22 || t > 0.78;
      out += '<circle cx="' + n.x + '" cy="' + n.y + '" r="4.5" fill="' + c + '"/>' + T(n.x, near ? n.y - 9 : base + 15, fmt(p.n), { s: 11, w: 700, f: c, a: 'middle' });
    }
    return { svg: out, h: 72, w: bw + 30 };
  };

  /* a hundred grid, or ten tenths strips (cells: 10), with n parts shaded */
  P.grid = function (p, x, y, w, key) {
    var cells = p.cells || 100, u = Math.min(p.u || 11, (Math.min(w, 140) - 2) / 10), out = '', SH = '#dfe5ee', KS = '#f2d4da';
    var fill = function (i) { return i < p.n ? SH : key && p.ask && i < p.n + p.ask ? KS : '#fff'; };
    if (cells === 10) for (var c = 0; c < 10; c++) out += '<rect x="' + (x + c * u) + '" y="' + y + '" width="' + u + '" height="' + 10 * u + '" fill="' + fill(c) + '" stroke="' + INK2 + '" stroke-width=".8"/>';
    else for (var i = 0; i < 100; i++) out += '<rect x="' + (x + (i % 10) * u) + '" y="' + (y + Math.floor(i / 10) * u) + '" width="' + u + '" height="' + u + '" fill="' + fill(i) + '" stroke="' + (fill(i) !== '#fff' ? INK2 : LINE) + '" stroke-width=".7"/>';
    out += '<rect x="' + x + '" y="' + y + '" width="' + 10 * u + '" height="' + 10 * u + '" fill="none" stroke="' + INK + '" stroke-width="1.2"/>';
    var lab = p.unit && !p.quiet;
    if (lab) out += T(x + 10 * u + 8, y + u, 'each square = ' + p.unit, { s: 10, f: INK2 });
    return { svg: out, h: 10 * u, w: 10 * u + (lab ? 8 + tw('each square = ' + p.unit, 10) : 0) };
  };

  /* fraction bars, all the same length per whole, one row per fraction */
  P.fbars = function (p, x, y, w) {
    var most = Math.max.apply(null, p.rows.map(function (r) { return Math.max(1, Math.ceil(r[1] / r[0])); }));
    var lab = p.labels ? 40 : 0, gap = 6, bw = Math.min(200, (Math.min(w, 300) - lab - gap * (most - 1)) / most), bh = 22, out = '';
    p.rows.forEach(function (r, i) {
      var ry = y + i * (bh + 6), bars = Math.max(1, Math.ceil(r[1] / r[0]));
      if (p.labels) out += T(x, ry + 16, p.labels[i], { s: 12, w: 700, f: INK2 });
      for (var b = 0; b < bars; b++) for (var c = 0; c < r[0]; c++) {
        var on = b * r[0] + c < r[1];
        out += '<rect x="' + (x + lab + b * (bw + gap) + c * bw / r[0]) + '" y="' + ry + '" width="' + bw / r[0] + '" height="' + bh + '" fill="' + (on ? '#dfe5ee' : '#fff') + '" stroke="' + INK2 + '" stroke-width="1"/>';
      }
    });
    return { svg: out, h: p.rows.length * (bh + 6) - 6, w: lab + most * (bw + gap) - gap };
  };

  /* a number line in parts of a whole; values are worked in whole parts so tenths never drift (0.30000000000000004) */
  P.dline = function (p, x, y, w, key, th, ans) {
    var d = p.d, lo = Math.round(p.min * d), hi = Math.round(p.max * d), u = (Math.min(w, 300) - 24) / (hi - lo), x0 = x + 12, ly = y + 26, out = '', used = 0;
    var dec = function (k) { return fmt(+(k / d).toFixed(3)); };
    var frac = function (k) { if (k % d === 0) return String(k / d); var wh = Math.floor(k / d); return (wh ? wh + ' ' : '') + (k % d) + '/' + d; };
    var asks = (p.ask || []).map(function (v) { return Math.round(v * d); });
    out += '<line x1="' + (x0 - 6) + '" y1="' + ly + '" x2="' + (x0 + (hi - lo) * u + 6) + '" y2="' + ly + '" stroke="' + INK + '" stroke-width="1.3"/>';
    for (var k = lo; k <= hi; k++) {
      var tx = x0 + (k - lo) * u, whole = k % d === 0, end = k === lo || k === hi, half = (k - lo) * 2 === hi - lo, lab = p.show === 'ends' ? whole || end : true;
      var tick = whole || end ? 7 : half ? 5.5 : 4;
      out += '<line x1="' + tx + '" y1="' + (ly - tick) + '" x2="' + tx + '" y2="' + (ly + tick) + '" stroke="' + INK + '" stroke-width="1"/>';
      if (lab && asks.indexOf(k) < 0) out += T(tx, ly + 20, p.show === 'frac' ? frac(k) : whole ? String(k / d) : dec(k), { s: (hi - lo) > 10 && !whole ? 8 : 10, f: INK2, a: 'middle' });
    }
    asks.forEach(function (k) {
      var tx = x0 + (k - lo) * u;
      out += '<line class="blank" x1="' + (tx - 17) + '" y1="' + (ly + 26) + '" x2="' + (tx + 17) + '" y2="' + (ly + 26) + '" stroke="' + INK + '" stroke-width="1.3"/>';
      if (key && ans) out += T(tx, ly + 22, ans[used], { s: 12, w: 700, f: KEY, a: 'middle' });
      used++;
    });
    if (p.pt != null) { var px = x0 + (Math.round(p.pt * d) - lo) * u; out += '<circle cx="' + px + '" cy="' + ly + '" r="4" fill="' + INK + '"/>'; }
    return { svg: out, h: asks.length ? 56 : 48, w: (hi - lo) * u + 24, used: used };
  };

  /* a place value chart: columns from the biggest place needed down to the smallest */
  var NAMES = { 5: 'HTh', 4: 'TTh', 3: 'Th', 2: 'H', 1: 'T', 0: 'O', '-1': 't', '-2': 'h', '-3': 'th' };
  function places(v) {
    var s = String(v).split('.'), hi = s[0].replace(/^0+(?=\d)/, '').length - 1, lo = s[1] ? -s[1].length : 0, out = {};
    s[0].split('').forEach(function (ch, i) { out[hi - i] = ch; });
    (s[1] || '').split('').forEach(function (ch, i) { out[-1 - i] = ch; });
    return { hi: hi, lo: lo, d: out };
  }
  P.pvmove = function (p, x, y, w, key) {
    var shift = p.shift || 0, res = shift ? (p.dir === 'd' ? p.n / Math.pow(10, shift) : p.n * Math.pow(10, shift)) : null;
    res = res === null ? null : +res.toFixed(6);
    var a = places(p.n), b = res === null ? null : places(res), hi = Math.max(a.hi, b ? b.hi : 0), lo = Math.min(a.lo, b ? b.lo : 0);
    var cw = Math.min(30, (w - 4) / (hi - lo + 1)), rh = 28, out = '', rows = b ? 2 : 1;
    for (var k = hi; k >= lo; k--) {
      var cx = x + (hi - k) * cw;
      out += T(cx + cw / 2, y + 12, NAMES[k], { s: 10, w: 700, f: INK2, a: 'middle' });
      for (var r = 0; r < rows; r++) {
        var cy = y + 18 + r * rh, src = r ? b : a, ch = src.d[k];
        out += '<rect x="' + cx + '" y="' + cy + '" width="' + cw + '" height="' + rh + '" fill="#fff" stroke="' + (k === 0 ? INK2 : LINE) + '" stroke-width="1"/>';
        if (ch == null && k >= 0 && k < src.hi && !(r && !key)) ch = '0';
        if (ch != null && (!r || key)) out += T(cx + cw / 2, cy + 20, ch, { s: 16, w: 700, f: r ? KEY : INK, a: 'middle' });
      }
      if (k === 0 && lo < 0) for (var q = 0; q < rows; q++) out += '<circle cx="' + (cx + cw) + '" cy="' + (y + 18 + q * rh + rh - 5) + '" r="2" fill="' + INK + '"/>';
    }
    return { svg: out, h: 18 + rows * rh, w: (hi - lo + 1) * cw };
  };

  /* a ratio: groups of a shaded circles and b open squares, side by side in light rounded boxes */
  P.mix = function (p, x, y, w) {
    var g = p.g || 1, n = p.a + p.b, s = 13, per = Math.max(1, Math.min(n, g > 1 ? 6 : 10)), gw = per * s + 8, gh = Math.ceil(n / per) * s + 8;
    var across = Math.max(1, Math.floor((Math.min(w, 300) + 6) / (gw + 6))), out = '';
    for (var k = 0; k < g; k++) {
      var gx = x + (k % across) * (gw + 6), gy = y + Math.floor(k / across) * (gh + 6);
      if (g > 1) out += '<rect x="' + gx + '" y="' + gy + '" width="' + gw + '" height="' + gh + '" rx="6" fill="none" stroke="' + LINE + '" stroke-width="1"/>';
      for (var i = 0; i < n; i++) {
        var cx = gx + 4 + (i % per) * s + s / 2, cy = gy + 4 + Math.floor(i / per) * s + s / 2;
        out += i < p.a ? '<circle cx="' + cx + '" cy="' + cy + '" r="4.6" fill="' + INK2 + '"/>' : '<rect x="' + (cx - 4.4) + '" y="' + (cy - 4.4) + '" width="8.8" height="8.8" fill="#fff" stroke="' + INK + '" stroke-width="1.1"/>';
      }
    }
    var rows = Math.ceil(g / across);
    return { svg: out, h: rows * gh + (rows - 1) * 6, w: Math.min(g, across) * (gw + 6) - 6 };
  };

  /* a growing pattern of tiles: figure n is b shaded tiles in a column, then m rows of n open tiles */
  P.grow = function (p, x, y, w) {
    var sz = 10, gap = 16, out = '', cx = x, hi = Math.max(p.b, p.m) * sz;
    for (var n = 1; n <= p.k; n++) {
      for (var i = 0; i < p.b; i++) out += '<rect x="' + cx + '" y="' + (y + hi - (i + 1) * sz) + '" width="' + sz + '" height="' + sz + '" fill="#dfe5ee" stroke="' + INK2 + '" stroke-width="1"/>';
      var ox = cx + (p.b ? sz : 0);
      for (var r = 0; r < p.m; r++) for (var c = 0; c < n; c++) out += '<rect x="' + (ox + c * sz) + '" y="' + (y + hi - (r + 1) * sz) + '" width="' + sz + '" height="' + sz + '" fill="#fff" stroke="' + INK + '" stroke-width="1"/>';
      var fw = (p.b ? sz : 0) + n * sz;
      out += T(cx + fw / 2, y + hi + 14, 'Figure ' + n, { s: 9, f: INK2, a: 'middle' });
      cx += fw + gap;
    }
    return { svg: out, h: hi + 18, w: cx - gap - x };
  };

  /* a short program: one instruction per line in a light box, written in a plain monospace face */
  P.code = function (p, x, y, w) {
    var lh = 17, bw = Math.min(w, 220), out = '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + (p.lines.length * lh + 12) + '" rx="5" fill="#f6f7f9" stroke="' + LINE + '" stroke-width="1"/>';
    p.lines.forEach(function (l, i) {
      var ind = l.match(/^ */)[0].length / 2;
      out += '<text x="' + (x + 10 + ind * 14) + '" y="' + (y + 19 + i * lh) + '" style="font-family:\'Courier New\', monospace;font-size:11.5px;fill:' + INK + '">' + l.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</text>';
    });
    return { svg: out, h: p.lines.length * lh + 12, w: bw };
  };

  /* graph axes with a scale from min to max; returns the drawing, the plot box and a y for any value */
  function axes(p, x, y, w, h) {
    var gx = x + 28, gw = Math.min(w, 240) - 32, top = y + (p.title ? 18 : 6), min = p.min || 0, out = '';
    var at = function (v) { return top + h - (v - min) / (p.max - min) * h; };
    if (p.title) out += T(gx + gw / 2, y + 10, p.title, { s: 10.5, w: 700, f: INK2, a: 'middle' });
    for (var v = min; v <= p.max + 1e-9; v += p.step) out += line(gx, at(v), gx + gw, at(v), { s: LINE, sw: 0.7 }) + T(gx - 5, at(v) + 3.5, fmt(+v.toFixed(2)), { s: 9, f: INK2, a: 'end' });
    out += line(gx, top, gx, top + h, { sw: 1.3 }) + line(gx, top + h, gx + gw, top + h, { sw: 1.3 });
    if (min) out += '<path d="M' + (gx - 4) + ' ' + (top + h - 5) + ' l4 -3 l-4 -3 l4 -3" fill="none" stroke="' + INK + '" stroke-width="1.1"/>';
    return { svg: out, gx: gx, gw: gw, top: top, at: at };
  }
  var FILLS = ['#dfe5ee', '#fff', '#9aa6b8'];
  P.dbar = function (p, x, y, w) {
    var h = p.h || 64, a = axes(p, x, y, w, h), out = a.svg, n = p.cats.length, cw = a.gw / n, k = p.sets.length, base = a.at(p.min || 0);
    p.cats.forEach(function (c, i) {
      if (p.stack) {
        var acc = 0;
        p.sets.forEach(function (set, j) {
          var y1 = a.at(acc + set[i]), y0 = a.at(acc); acc += set[i];
          out += '<rect x="' + (a.gx + i * cw + cw * 0.22) + '" y="' + y1 + '" width="' + cw * 0.56 + '" height="' + (y0 - y1) + '" fill="' + FILLS[j % 3] + '" stroke="' + INK2 + '" stroke-width="1"/>';
        });
      } else {
        var bw = cw * 0.7 / k;
        p.sets.forEach(function (set, j) {
          if (set[i] == null) return;
          var top = a.at(set[i]);
          out += '<rect x="' + (a.gx + i * cw + cw * 0.15 + j * bw) + '" y="' + top + '" width="' + bw + '" height="' + (base - top) + '" fill="' + FILLS[j % 3] + '" stroke="' + INK2 + '" stroke-width="1"/>';
        });
      }
      out += T(a.gx + i * cw + cw / 2, base + 13, c, { s: 9.5, f: INK2, a: 'middle' });
    });
    var hh = base - y + 18;
    if (p.keys) {
      var kx = a.gx;
      p.keys.forEach(function (kk, j) { out += '<rect x="' + kx + '" y="' + (y + hh - 2) + '" width="9" height="9" fill="' + FILLS[j % 3] + '" stroke="' + INK2 + '" stroke-width="1"/>' + T(kx + 13, y + hh + 6, kk, { s: 9.5, f: INK2 }); kx += 22 + tw(kk, 9.5); });
      hh += 14;
    }
    return { svg: out, h: hh, w: a.gw + 28 };
  };
  P.lineg = function (p, x, y, w) {
    var h = p.h || 64, a = axes(p, x, y, w, h), out = a.svg, n = p.cats.length, cw = a.gw / n, pts = [];
    p.cats.forEach(function (c, i) {
      var px = a.gx + i * cw + cw / 2;
      pts.push(px + ' ' + a.at(p.vals[i]));
      out += T(px, a.at(p.min || 0) + 13, c, { s: 9.5, f: INK2, a: 'middle' });
    });
    out += '<path d="M' + pts.join(' L') + '" fill="none" stroke="' + INK + '" stroke-width="1.5"/>';
    pts.forEach(function (pt) { var q = pt.split(' '); out += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="3" fill="' + INK + '"/>'; });
    return { svg: out, h: a.at(p.min || 0) - y + 18, w: a.gw + 28 };
  };
  /* a spinner in equal parts with a label in each and an arrow from the centre */
  P.spin = function (p, x, y) {
    var R = 30, cx = x + R + 2, cy = y + R + 2, n = p.parts.length, out = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/>';
    p.parts.forEach(function (lab, i) {
      var a0 = -Math.PI / 2 + i * 2 * Math.PI / n, am = a0 + Math.PI / n;
      if (n > 1) out += line(cx, cy, cx + R * Math.cos(a0), cy + R * Math.sin(a0), { s: INK2, sw: 1 });
      out += T(cx + R * 0.62 * Math.cos(am), cy + R * 0.62 * Math.sin(am) + 4, lab, { s: 11, w: 700, a: 'middle' });
    });
    out += line(cx, cy, cx + R * 0.32 * Math.cos(-0.6), cy + R * 0.32 * Math.sin(-0.6), { sw: 2 }) + '<circle cx="' + cx + '" cy="' + cy + '" r="2.6" fill="' + INK + '"/>';
    return { svg: out, h: 2 * R + 4, w: 2 * R + 4 };
  };
})();
