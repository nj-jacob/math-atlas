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
     stem  { data, title }      a stem-and-leaf plot of whole numbers under 100 or 1000: the tens (or tens and hundreds) as
                                stems down the left, every ones digit as a leaf in order, and a key (3 | 4 means 34)
     dial  { g, max, lab, tick, unit, blank }   a kitchen scale from 0 to max grams with its needle at g: a numbered mark
                                every lab (in kg when unit is 'kg'), a small mark every tick; blank: no needle (the key draws it)
     jug   { mL, max, lab, tick, blank }   a measuring jug from 0 to max mL filled to mL, marked like the scale; blank:
                                empty for the child to colour (the key shows the level)
     tri   { sides: [a, b, c] } or { angles: [A, B, C] }, show: 'sides' | 'angles', ask: 0 | 1 | 2, marks
                                a triangle drawn from its side lengths or its angles (in degrees); show writes the
                                lengths (cm) or the angles, ask leaves one angle as "?", marks draws ticks on equal sides
                                and a square in a right angle
     heights { g: [[2, 1], [1, 0]] }   a top view of cube stacks: the number in each square is how tall it is (0 is empty);
                                the front is the bottom edge and the right side is the right edge
     angle { deg, rot, bench, prot, from }   an angle of deg degrees, turned by rot, with a dashed square corner to
                                compare (bench); prot: on a protractor (outer scale from the left, inner from the right),
                                from: 'left' puts the first arm on the left
     plane { kind: 'rect' | 'para' | 'tri', b, h, off, s, unit, ask }   a rectangle, parallelogram or triangle with its
                                base and dashed height; off: how far along the top (or top corner) sits; s: the slanted
                                side; ask: 'perim' when the question is its perimeter
     coord { n, pts: [[x, y, 'A']], shape: [[x, y], ...], after, mirror: { x } | { y }, keyShape, plot: [[x, y, 'B']] }
                                a coordinate grid from 0 to n: labelled points, a shape, the shape after a move (dashed), a
                                dashed mirror line, and points or a shape drawn only on the key
     dline { min, max, d, show, pt, ask }   a number line cut into d parts per whole; show 'dec' or 'frac' labels every
                                part ('ends' labels the two ends and any whole number); pt marks a point; ask: [values] puts a line to
                                write on under each (answers in order)
     pvmove { n, shift, dir }   a place value chart with n in it; with shift, a second row shows n × 10^shift
                                (dir 'x') or n ÷ 10^shift (dir 'd'), drawn only on the answer key
   Grade 8:
     iline { min, max, lab, pts, jumps, ray }   an integer number line: points, jumps [[from, by]] as arcs, and the ray of
                                an inequality's solutions { at, open, dir }
     chips { pos, neg, pairs }  + and − counters; pairs rings each zero pair
     ptree { a, b, pa, pb }     a tree diagram of two events with the outcomes at the leaves (pa, pb: branch labels)
     pvenn { a, b, n }          a Venn diagram with counts n = [a only, both, b only, neither]
     scat  { pts, xmax, ymax, xs, ys, xl, yl, h }   a scatter plot
     par   { ang, give, ask, letters, one }   parallel lines (or one crossing) cut by a slanted line; the angles are
                                numbered 0 to 3 at the top crossing (top right, top left, bottom left, bottom right), 4 to 7 below
     circ  { r | d, unit }      a circle with its radius or diameter
     cyl   { r, h, unit }, rbox { l, w, h, unit }, tprism { b, h, l, unit }   solids with their measures
     rtri  { a, b, c, ask, unit }   a right triangle with legs a, b and hypotenuse c; ask writes one as "?"
     cgrid { n, pts, shape, after, keyShape, plot }   a coordinate grid from −n to n (as coord)
     comp  { kind: 'L' | 'semi', w, h, cw, ch, unit }   an L shape, or a rectangle with a half circle on top
     atiles { xp, xn, up, un }  algebra tiles: x tiles and unit tiles, positive shaded and negative white
     tbl   { head, rows }       a table of values
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
      var fw = (p.b ? sz : 0) + n * sz, slot = Math.max(fw, 40), fx = cx + (slot - fw) / 2;
      for (var i = 0; i < p.b; i++) out += '<rect x="' + fx + '" y="' + (y + hi - (i + 1) * sz) + '" width="' + sz + '" height="' + sz + '" fill="#dfe5ee" stroke="' + INK2 + '" stroke-width="1"/>';
      var ox = fx + (p.b ? sz : 0);
      for (var r = 0; r < p.m; r++) for (var c = 0; c < n; c++) out += '<rect x="' + (ox + c * sz) + '" y="' + (y + hi - (r + 1) * sz) + '" width="' + sz + '" height="' + sz + '" fill="#fff" stroke="' + INK + '" stroke-width="1"/>';
      out += T(cx + slot / 2, y + hi + 14, 'Figure ' + n, { s: 9, f: INK2, a: 'middle' });
      cx += slot + gap;
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

  /* a stem-and-leaf plot: one row for every stem from the least to the greatest (an empty stem keeps its row) */
  P.stem = function (p, x, y, w) {
    var d = p.data.slice().sort(function (m, n) { return m - n; }), lo = Math.floor(d[0] / 10), hi = Math.floor(d[d.length - 1] / 10);
    var lh = 18, sw = 30, top = y + (p.title ? 16 : 0), out = p.title ? T(x, y + 10, p.title, { s: 10.5, w: 700, f: INK2 }) : '', wid = 0;
    out += T(x + sw - 6, top + 11, 'Stem', { s: 9, f: INK2, a: 'end' }) + T(x + sw + 8, top + 11, 'Leaf', { s: 9, f: INK2 });
    for (var st = lo; st <= hi; st++) {
      var ry = top + 16 + (st - lo) * lh, leaves = d.filter(function (v) { return Math.floor(v / 10) === st; }).map(function (v) { return v % 10; });
      out += T(x + sw - 6, ry + 13, String(st), { s: 13, w: 700, a: 'end' });
      leaves.forEach(function (l, i) { out += T(x + sw + 8 + i * 14, ry + 13, String(l), { s: 13, w: 700 }); });
      wid = Math.max(wid, sw + 8 + leaves.length * 14);
    }
    var bot = top + 16 + (hi - lo + 1) * lh + 4;
    out += line(x + sw, top + 14, x + sw, bot, { sw: 1.3 }) + line(x, top + 16, x + Math.min(w, Math.max(wid, 110)), top + 16, { s: LINE, sw: 1 });
    var key = 'Key: ' + lo + ' | ' + (d[0] % 10) + ' means ' + d[0];
    out += T(x, bot + 14, key, { s: 9.5, f: INK2 });
    return { svg: out, h: bot + 18 - y, w: Math.max(wid, tw(key, 9.5)) };
  };

  /* a kitchen scale: a round dial from 0 to max grams, a numbered mark every lab (written in kg when unit is 'kg'), a
     longer mark halfway between and a small mark every tick, with the needle at g; blank leaves the needle off for the child (the key draws it) */
  P.dial = function (p, x, y, w, key) {
    var R = 42, cx = x + R + 4, cy = y + R + 4, n = Math.round(p.max / p.tick), kg = p.unit === 'kg';
    var at = function (v, r) { var a = (-135 + 270 * v / p.max) * Math.PI / 180; return [(cx + Math.sin(a) * r).toFixed(1), (cy - Math.cos(a) * r).toFixed(1)]; };
    var out = '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R + 3) + '" fill="#fff" stroke="' + INK + '" stroke-width="1.6"/>';
    for (var i = 0; i <= n; i++) {
      var v = i * p.tick, big = v % p.lab === 0, mid = !big && v % (p.lab / 2) === 0, a = at(v, R - (big ? 8 : mid ? 6 : 4)), b = at(v, R);
      out += line(a[0], a[1], b[0], b[1], { s: big ? INK : INK2, sw: big ? 1.3 : mid ? 1 : 0.8 });
      if (big) { var t = at(v, R - 17); out += T(t[0], +t[1] + 3.5, String(kg ? v / 1000 : v), { s: 8.5, w: 700, a: 'middle' }); }
    }
    out += T(cx, cy + R - 8, kg ? 'kg' : 'g', { s: 9, f: INK2, a: 'middle' });
    if (!p.blank || key) { var e = at(p.g, R - 6); out += line(cx, cy, e[0], e[1], { s: p.blank ? KEY : INK, sw: 2 }); }
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="2.6" fill="' + INK + '"/>';
    return { svg: out, h: 2 * R + 8, w: 2 * R + 8 };
  };

  /* a measuring jug from 0 to max mL: a numbered mark every lab and a small mark every tick, filled to mL; blank leaves
     it empty for the child to colour (the key fills it) */
  P.jug = function (p, x, y, w, key) {
    var H = 96, W = 64, top = y + 4, bot = top + H, n = Math.round(p.max / p.tick), Y = function (v) { return bot - (H - 10) * v / p.max; };
    var out = '';
    if (!p.blank || key) out += '<rect x="' + (x + 1) + '" y="' + Y(p.mL).toFixed(1) + '" width="' + (W - 2) + '" height="' + (bot - Y(p.mL)).toFixed(1) + '" fill="' + (p.blank ? 'none' : '#dfe5ee') + '"' + (p.blank ? ' stroke="' + KEY + '" stroke-width="1.6"' : '') + '/>';
    out += '<path d="M' + x + ' ' + top + ' L' + x + ' ' + bot + ' L' + (x + W) + ' ' + bot + ' L' + (x + W) + ' ' + top + '" fill="none" stroke="' + INK + '" stroke-width="1.6"/>';
    out += '<path d="M' + (x + W) + ' ' + (top + 14) + ' q 16 0 16 18 q 0 22 -16 26" fill="none" stroke="' + INK + '" stroke-width="1.6"/>';
    for (var i = 1; i <= n; i++) {
      var v = i * p.tick, big = v % p.lab === 0, yy = Y(v).toFixed(1);
      out += line(x, yy, x + (big ? 14 : 8), yy, { s: big ? INK : INK2, sw: big ? 1.2 : 0.8 });
      if (big) out += T(x + 17, +yy + 3.5, fmt(v), { s: 8.5, w: 700 });
    }
    out += T(x + W - 4, bot - 5, 'mL', { s: 8.5, f: INK2, a: 'end' });
    return { svg: out, h: H + 6, w: W + 18 };
  };

  /* a triangle from 3 sides (law of cosines) or 3 angles (sides in proportion to the sines), scaled to fit */
  P.tri = function (p, x, y, w) {
    var rad = Math.PI / 180, sd = p.sides, an = p.angles;
    if (!sd) { sd = [Math.sin(an[0] * rad), Math.sin(an[1] * rad), Math.sin(an[2] * rad)]; }
    /* vertices: A at the origin, B along the base (side c = AB), C from the angle at A */
    var a = sd[0], b = sd[1], c = sd[2], A = Math.acos((b * b + c * c - a * a) / (2 * b * c));
    var pts = [[0, 0], [c, 0], [b * Math.cos(A), -b * Math.sin(A)]];
    var xs = pts.map(function (q) { return q[0]; }), ys = pts.map(function (q) { return q[1]; });
    var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs), miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
    var k = Math.min((Math.min(w, 200) - 40) / (maxx - minx), (p.show === 'angles' ? 70 : 44) / (maxy - miny || 1)), ox = x + 20 - minx * k, oy = y + 16 - miny * k;
    var V = pts.map(function (q) { return [ox + q[0] * k, oy + q[1] * k]; }), out = '<path d="M' + V.map(function (v) { return v[0].toFixed(1) + ' ' + v[1].toFixed(1); }).join(' L') + ' Z" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>';
    var cx = (V[0][0] + V[1][0] + V[2][0]) / 3, cy = (V[0][1] + V[1][1] + V[2][1]) / 3;
    /* the angles at A, B, C (vertex i is opposite side i: V0 = A opposite a) */
    var angs = an || [0, 1, 2].map(function (i) { var s1 = sd[i], s2 = sd[(i + 1) % 3], s3 = sd[(i + 2) % 3]; return Math.acos((s2 * s2 + s3 * s3 - s1 * s1) / (2 * s2 * s3)) / rad; });
    /* side i joins the two vertices that are not vertex i */
    var mid = function (i) { var u = V[(i + 1) % 3], v = V[(i + 2) % 3]; return [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2]; };
    if (p.show === 'sides') [0, 1, 2].forEach(function (i) { var m = mid(i), dx = m[0] - cx, dy = m[1] - cy, d = Math.sqrt(dx * dx + dy * dy) || 1; out += T(m[0] + dx / d * 17, m[1] + dy / d * 17 + 4, p.sides[i] + ' cm', { s: 10.5, f: INK2, a: 'middle' }); });
    if (p.show === 'angles') [0, 1, 2].forEach(function (i) { var v = V[i], dx = cx - v[0], dy = cy - v[1]; out += T(v[0] + dx * 0.42, v[1] + dy * 0.42 + 4, p.ask === i ? '?' : Math.round(angs[i]) + '°', { s: 10.5, w: p.ask === i ? 700 : 400, f: p.ask === i ? INK : INK2, a: 'middle' }); });
    if (p.marks) {
      var L = [0, 1, 2].map(function (i) { return Math.round(sd[i] * 1000); });
      [0, 1, 2].forEach(function (i) {
        var same = L.filter(function (v) { return v === L[i]; }).length;
        if (same < 2) return;
        var m = mid(i), u = V[(i + 1) % 3], v = V[(i + 2) % 3], dx = v[0] - u[0], dy = v[1] - u[1], d = Math.sqrt(dx * dx + dy * dy), nx = -dy / d * 4, ny = dx / d * 4;
        var ticks = same === 3 ? 1 : 2;
        for (var t = 0; t < ticks; t++) { var off = (t - (ticks - 1) / 2) * 3, px = m[0] + dx / d * off, py = m[1] + dy / d * off; out += line(px - nx, py - ny, px + nx, py + ny, { sw: 1.1 }); }
      });
      angs.forEach(function (g, i) {
        if (Math.abs(g - 90) > 0.5) return;
        var v = V[i], u1 = V[(i + 1) % 3], u2 = V[(i + 2) % 3], e = function (u) { var dx = u[0] - v[0], dy = u[1] - v[1], d = Math.sqrt(dx * dx + dy * dy); return [dx / d * 8, dy / d * 8]; }, a1 = e(u1), a2 = e(u2);
        out += '<path d="M' + (v[0] + a1[0]) + ' ' + (v[1] + a1[1]) + ' L' + (v[0] + a1[0] + a2[0]) + ' ' + (v[1] + a1[1] + a2[1]) + ' L' + (v[0] + a2[0]) + ' ' + (v[1] + a2[1]) + '" fill="none" stroke="' + INK + '" stroke-width="1"/>';
      });
    }
    var maxY = Math.max(V[0][1], V[1][1], V[2][1]);
    return { svg: out, h: maxY - y + 18, w: Math.min(w, 220) };
  };

  /* a top view of cube stacks: a grid of squares with the height of each stack written in it */
  P.heights = function (p, x, y) {
    var sz = 20, out = '';
    p.g.forEach(function (row, r) {
      row.forEach(function (v, c) {
        out += '<rect x="' + (x + c * sz) + '" y="' + (y + r * sz) + '" width="' + sz + '" height="' + sz + '" fill="' + (v ? '#dfe5ee' : '#fff') + '" stroke="' + INK2 + '" stroke-width="1"/>';
        if (v) out += T(x + c * sz + sz / 2, y + r * sz + sz / 2 + 5, v, { s: 13, w: 700, a: 'middle' });
      });
    });
    var wd = p.g[0].length * sz;
    out += T(x + wd / 2, y + p.g.length * sz + 14, 'front', { s: 9.5, f: INK2, a: 'middle' }) + T(x + wd + 5, y + p.g.length * sz / 2 + 4, 'side', { s: 9.5, f: INK2 });
    return { svg: out, h: p.g.length * sz + 18, w: wd + 30 };
  };

  /* a coordinate grid from 0 to n with labelled points and shapes */
  P.coord = function (p, x, y, w, key) {
    var n = p.n || 8, u = Math.min(11, (Math.min(w, 220) - 24) / n), ox = x + 18, oy = y + 6 + n * u, out = '';
    var X = function (v) { return ox + v * u; }, Y = function (v) { return oy - v * u; };
    for (var i = 0; i <= n; i++) {
      out += line(X(i), Y(0), X(i), Y(n), { s: LINE, sw: 0.7 }) + line(X(0), Y(i), X(n), Y(i), { s: LINE, sw: 0.7 });
      out += T(X(i), Y(0) + 12, i, { s: 8.5, f: INK2, a: 'middle' }) + (i ? T(X(0) - 5, Y(i) + 3, i, { s: 8.5, f: INK2, a: 'end' }) : '');
    }
    out += line(X(0), Y(0), X(n), Y(0), { sw: 1.2 }) + line(X(0), Y(0), X(0), Y(n), { sw: 1.2 });
    function shape(list, col, dash) { return '<path d="M' + list.map(function (q) { return X(q[0]) + ' ' + Y(q[1]); }).join(' L') + ' Z" fill="' + (dash ? 'none' : '#dfe5ee') + '" fill-opacity="0.8" stroke="' + col + '" stroke-width="1.4"' + (dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
    function dot(q, col) { return '<circle cx="' + X(q[0]) + '" cy="' + Y(q[1]) + '" r="3.2" fill="' + col + '"/>' + (q[2] ? T(X(q[0]) + 5, Y(q[1]) - 5, q[2], { s: 10.5, w: 700, f: col }) : ''); }
    if (p.mirror) out += p.mirror.x != null ? line(X(p.mirror.x), Y(0), X(p.mirror.x), Y(n), { sw: 1.6 }).replace('/>', ' stroke-dasharray="5 3"/>') : line(X(0), Y(p.mirror.y), X(n), Y(p.mirror.y), { sw: 1.6 }).replace('/>', ' stroke-dasharray="5 3"/>');
    if (p.shape) out += shape(p.shape, INK);
    if (p.after) out += shape(p.after, INK, true);
    if (key && p.keyShape) out += shape(p.keyShape, KEY, true);
    (p.pts || []).forEach(function (q) { out += dot(q, INK); });
    if (key) (p.plot || []).forEach(function (q) { out += dot(q, KEY); });
    return { svg: out, h: n * u + 22, w: n * u + 24 };
  };

  /* an angle: two arms from a vertex, deg apart. Plain, it has an arc (a square for 90°), can be turned by rot and can
     show a dashed square corner to compare with (bench). With prot it sits on a protractor: the outer scale counts from
     the left, the inner scale from the right, and from: 'left' puts the first arm on the left */
  P.angle = function (p, x, y) {
    var rad = Math.PI / 180, out = '', g = p.deg;
    var dir = function (a, r) { return [Math.cos(a * rad) * r, -Math.sin(a * rad) * r]; };
    if (p.prot) {
      var R = 76, cx = x + R + 12, cy = y + R + 14, a1 = p.from === 'left' ? 180 : 0, a2 = p.from === 'left' ? 180 - g : g;
      out += '<path d="M' + (cx - R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 0 1 ' + (cx + R) + ' ' + cy + ' Z" fill="#f6f7f9" stroke="' + INK2 + '" stroke-width="1"/>';
      for (var d = 0; d <= 180; d += 5) {
        var t1 = dir(d, R), t2 = dir(d, R - (d % 10 ? 3 : 6));
        out += line(cx + t1[0], cy + t1[1], cx + t2[0], cy + t2[1], { s: INK2, sw: d % 10 ? 0.6 : 0.9 });
        if (d % 20) continue;
        var o1 = dir(d, R - 13), o2 = dir(d, R - 25);
        var up = d === 0 || d === 180 ? -6 : 3;
        out += T(cx + o1[0], cy + o1[1] + up, 180 - d, { s: 8, f: INK, a: 'middle' }) + T(cx + o2[0], cy + o2[1] + up, d, { s: 7, f: INK2, a: 'middle' });
      }
      [a1, a2].forEach(function (a) { var e = dir(a, R + 12); out += line(cx, cy, cx + e[0], cy + e[1], { sw: 1.6 }); });
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="2.4" fill="' + INK + '"/>';
      return { svg: out, h: R + 22, w: 2 * R + 24 };
    }
    var L = 64, rot = p.rot || 0, b1 = rot, b2 = rot + g, A = dir(b1, L), B = dir(b2, L), pts = [[0, 0], A, B];
    var C = p.bench && g !== 90 ? dir(b1 + 90, L * 0.8) : null;
    if (C) pts.push(C);
    var minx = Math.min.apply(null, pts.map(function (q) { return q[0]; })), miny = Math.min.apply(null, pts.map(function (q) { return q[1]; }));
    var maxx = Math.max.apply(null, pts.map(function (q) { return q[0]; })), maxy = Math.max.apply(null, pts.map(function (q) { return q[1]; }));
    var vx = x + 6 - minx, vy = y + 6 - miny;
    if (C) {
      var s1 = dir(b1, 9), s2 = dir(b1 + 90, 9);
      out += '<line x1="' + vx + '" y1="' + vy + '" x2="' + (vx + C[0]) + '" y2="' + (vy + C[1]) + '" stroke="' + INK2 + '" stroke-width="1" stroke-dasharray="4 3"/>';
      out += '<path d="M' + (vx + s1[0]) + ' ' + (vy + s1[1]) + ' L' + (vx + s1[0] + s2[0]) + ' ' + (vy + s1[1] + s2[1]) + ' L' + (vx + s2[0]) + ' ' + (vy + s2[1]) + '" fill="none" stroke="' + INK2 + '" stroke-width="0.9"/>';
    }
    if (g === 90) {
      var q1 = dir(b1, 10), q2 = dir(b2, 10);
      out += '<path d="M' + (vx + q1[0]) + ' ' + (vy + q1[1]) + ' L' + (vx + q1[0] + q2[0]) + ' ' + (vy + q1[1] + q2[1]) + ' L' + (vx + q2[0]) + ' ' + (vy + q2[1]) + '" fill="none" stroke="' + INK + '" stroke-width="1"/>';
    } else {
      var r1 = dir(b1, 15), r2 = dir(b2, 15);
      out += '<path d="M' + (vx + r1[0]) + ' ' + (vy + r1[1]) + ' A15 15 0 ' + (g > 180 ? 1 : 0) + ' 0 ' + (vx + r2[0]) + ' ' + (vy + r2[1]) + '" fill="none" stroke="' + INK + '" stroke-width="1"/>';
    }
    out += line(vx, vy, vx + A[0], vy + A[1], { sw: 1.6 }) + line(vx, vy, vx + B[0], vy + B[1], { sw: 1.6 }) + '<circle cx="' + vx + '" cy="' + vy + '" r="2.2" fill="' + INK + '"/>';
    return { svg: out, h: maxy - miny + 12, w: maxx - minx + 12 };
  };

  /* a flat shape with its base and height (not to scale): a rectangle, a parallelogram whose top is moved off along
     the base, or a triangle whose top corner is off along the base. The height is dashed with a square corner; s labels
     the slanted side of a parallelogram or triangle */
  P.plane = function (p, x, y, w) {
    var b = p.b, h = p.h, u = ' ' + (p.unit || 'cm'), off = p.kind === 'rect' ? 0 : p.off != null ? p.off : Math.round(b / 3);
    var span = p.kind === 'para' ? b + off : b, k = Math.min((Math.min(w, 230) - 70) / span, 56 / h, 14), ox = x + 54, oy = y + 6 + h * k;
    /* a tall shape is widened a little (up to 10 points a unit) so it does not become a sliver; it is not to scale */
    var kx = Math.max(k, Math.min((Math.min(w, 230) - 70) / span, 10));
    var X = function (v) { return ox + v * kx; }, Y = function (v) { return oy - v * k; };
    var pts = p.kind === 'rect' ? [[0, 0], [b, 0], [b, h], [0, h]] : p.kind === 'para' ? [[0, 0], [b, 0], [b + off, h], [off, h]] : [[0, 0], [b, 0], [off, h]];
    var out = '<path d="M' + pts.map(function (q) { return X(q[0]).toFixed(1) + ' ' + Y(q[1]).toFixed(1); }).join(' L') + ' Z" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>';
    out += T(X(b / 2), oy + 16, b + u, { s: 11.5, w: 700, a: 'middle' });
    if (p.kind === 'rect') out += T(ox - 6, Y(h / 2) + 4, h + u, { s: 11.5, w: 700, a: 'end' });
    else {
      out += '<line x1="' + X(off) + '" y1="' + Y(h) + '" x2="' + X(off) + '" y2="' + oy + '" stroke="' + INK2 + '" stroke-width="1.1" stroke-dasharray="4 3"/>';
      out += '<path d="M' + (X(off) + 7) + ' ' + oy + ' L' + (X(off) + 7) + ' ' + (oy - 7) + ' L' + X(off) + ' ' + (oy - 7) + '" fill="none" stroke="' + INK2 + '" stroke-width="0.9"/>';
      /* the height's label goes on the roomier side of the dashed line, on a white patch so a side never runs through it */
      var tri = p.kind === 'tri', at = tri ? h / 3 : h / 2, left = tri && off > (b - off), lw = tw(h + u, 11.5, 700) + 6;
      var lx = left ? X(off) - 5 - lw : X(off) + 5;
      out += '<rect x="' + lx + '" y="' + (Y(at) - 9) + '" width="' + lw + '" height="16" fill="#fff"/>' + T(lx + 3, Y(at) + 4, h + u, { s: 11.5, w: 700 });
      if (p.s) out += T(X(off / 2) - 7, Y(h / 2) + 4, p.s + u, { s: 11.5, f: INK2, a: 'end' });
    }
    return { svg: out, h: h * k + 24, w: span * kx + 54 + 10 };
  };
  /* ---------- Grade 8 ---------- */
  var neg = function (v) { return fmt(v); };
  function dash(svg) { return svg.replace('/>', ' stroke-dasharray="4 3"/>'); }
  /* an integer number line from min to max, a number every lab; pts: [[v, 'A']]; jumps: [[from, by]] drawn as arcs
     (above when going right, below when going left); ray: { at, open, dir: 'right' | 'left' } shades the solutions of
     an inequality from at (an open dot leaves at out) */
  P.iline = function (p, x, y, w) {
    var n = p.max - p.min, u = (Math.min(w, 228) - 20) / n, x0 = x + 10, ly = y + 30, out = '', lab = p.lab || 1;
    var X = function (v) { return x0 + (v - p.min) * u; };
    out += line(x0 - 6, ly, X(p.max) + 6, ly, { sw: 1.3 });
    for (var v = p.min; v <= p.max; v++) {
      var big = v % lab === 0;
      out += line(X(v), ly - (big ? 5 : 3), X(v), ly + (big ? 5 : 3), { sw: v === 0 ? 1.6 : 1 });
      if (big) out += T(X(v), ly + 17, neg(v), { s: 9.5, f: INK2, a: 'middle' });
    }
    (p.jumps || []).forEach(function (j) {
      var a = X(j[0]), b = X(j[0] + j[1]), up = j[1] > 0, cy = up ? ly - 24 : ly + 24;
      out += '<path d="M' + a + ' ' + (ly + (up ? -2 : 2)) + ' Q' + (a + b) / 2 + ' ' + cy + ' ' + b + ' ' + (ly + (up ? -2 : 2)) + '" fill="none" stroke="' + INK2 + '" stroke-width="1.4"/>';
      out += '<circle cx="' + b + '" cy="' + ly + '" r="2.2" fill="' + INK2 + '"/>';
    });
    if (p.ray) {
      var r0 = X(p.ray.at), r1 = p.ray.dir === 'right' ? X(p.max) + 6 : x0 - 6;
      out += line(r0, ly, r1, ly, { sw: 3.2 }) + '<circle cx="' + r0 + '" cy="' + ly + '" r="4" fill="' + (p.ray.open ? '#fff' : INK) + '" stroke="' + INK + '" stroke-width="1.5"/>';
    }
    (p.pts || []).forEach(function (q) { out += '<circle cx="' + X(q[0]) + '" cy="' + ly + '" r="3.4" fill="' + INK + '"/>' + (q[1] ? T(X(q[0]), ly - 9, q[1], { s: 10.5, w: 700, a: 'middle' }) : ''); });
    return { svg: out, h: (p.jumps && p.jumps.some(function (j) { return j[1] < 0; }) ? 64 : 52), w: n * u + 20 };
  };
  /* integer counters: pos + counters and neg − counters; pairs: true rings each zero pair */
  P.chips = function (p, x, y, w) {
    var r = 8, sp = 20, per = Math.max(1, Math.floor((Math.min(w, 228) - 4) / sp)), out = '', i;
    function chip(cx, cy, plus) {
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (plus ? '#dfe5ee' : '#fff') + '" stroke="' + INK + '" stroke-width="1.1"/>' +
        line(cx - 4, cy, cx + 4, cy, { sw: 1.5 }) + (plus ? line(cx, cy - 4, cx, cy + 4, { sw: 1.5 }) : '');
    }
    var rows = [[], []];
    for (i = 0; i < p.pos; i++) rows[0].push(1);
    for (i = 0; i < p.neg; i++) rows[1].push(0);
    var lines = Math.ceil(Math.max(p.pos, p.neg, 1) / per);
    rows.forEach(function (row, ri) {
      row.forEach(function (c, j) { out += chip(x + 4 + r + (j % per) * sp, y + 4 + r + (Math.floor(j / per) * 2 + ri) * sp, c); });
    });
    if (p.pairs) for (i = 0; i < Math.min(p.pos, p.neg); i++) {
      var cx = x + 4 + r + (i % per) * sp, cy = y + 4 + r + Math.floor(i / per) * 2 * sp;
      out += '<rect x="' + (cx - r - 2) + '" y="' + (cy - r - 2) + '" width="' + (2 * r + 4) + '" height="' + (sp + 2 * r + 4) + '" rx="' + (r + 2) + '" fill="none" stroke="' + INK2 + '" stroke-width="1" stroke-dasharray="3 2"/>';
    }
    return { svg: out, h: lines * 2 * sp + 6, w: Math.min(Math.max(p.pos, p.neg), per) * sp + 8 };
  };
  /* a tree diagram: the first event's outcomes a, then the second event's b on each branch; pa, pb: probabilities to
     write on the branches; the outcomes are listed at the leaves */
  P.ptree = function (p, x, y, w) {
    var n = p.a.length * p.b.length, lh = Math.min(17, 150 / n), out = '', x1 = x + 10, x2 = x + 70, x3 = x + 140, top = y + 6;
    p.a.forEach(function (a, i) {
      var ay = top + (i + 0.5) * p.b.length * lh;
      out += line(x1, top + n * lh / 2, x2, ay, { s: INK2, sw: 1 }) + T(x2 + 3, ay + 4, a, { s: 11, w: 700 });
      if (p.pa) out += T((x1 + x2) / 2 - 4, (top + n * lh / 2 + ay) / 2 - 3, p.pa[i], { s: 9, f: INK2, a: 'middle' });
      p.b.forEach(function (b, j) {
        var by = top + (i * p.b.length + j + 0.5) * lh;
        out += line(x2 + 16, ay, x3, by, { s: INK2, sw: 1 }) + T(x3 + 3, by + 4, b, { s: 10.5, w: 700 }) + T(x3 + 34, by + 4, a + b, { s: 9.5, f: INK2 });
        if (p.pb) out += T((x2 + x3) / 2 + 10, (ay + by) / 2 - 2, p.pb[j], { s: 8.5, f: INK2, a: 'middle' });
      });
    });
    out += '<circle cx="' + x1 + '" cy="' + (top + n * lh / 2) + '" r="2.4" fill="' + INK + '"/>';
    return { svg: out, h: n * lh + 10, w: 200 };
  };
  /* a Venn diagram with how many in each part: n = [a only, both, b only, neither], inside a box for everyone */
  P.pvenn = function (p, x, y, w) {
    var R = 34, bw = Math.min(w, 200), cx = x + bw / 2, cy = y + 18 + R, out = '';
    out += '<rect x="' + x + '" y="' + (y + 12) + '" width="' + bw + '" height="' + (2 * R + 14) + '" fill="none" stroke="' + INK2 + '" stroke-width="1"/>';
    out += '<circle cx="' + (cx - R * 0.6) + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="' + INK + '" stroke-width="1.3"/><circle cx="' + (cx + R * 0.6) + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="' + INK + '" stroke-width="1.3"/>';
    out += T(cx - R * 0.9, y + 8, p.a, { s: 10.5, w: 700, a: 'middle' }) + T(cx + R * 0.9, y + 8, p.b, { s: 10.5, w: 700, a: 'middle' });
    out += T(cx - R * 1.05, cy + 5, p.n[0], { s: 14, w: 700, a: 'middle' }) + T(cx, cy + 5, p.n[1], { s: 14, w: 700, a: 'middle' }) + T(cx + R * 1.05, cy + 5, p.n[2], { s: 14, w: 700, a: 'middle' });
    out += T(x + bw - 12, y + 2 * R + 20, p.n[3], { s: 14, w: 700, a: 'end' });
    return { svg: out, h: 2 * R + 28, w: bw };
  };
  /* a scatter plot: pts [[x, y]] on axes from 0 to xmax and ymax, a number every xs and ys, labels xl and yl */
  P.scat = function (p, x, y, w) {
    var gx = x + 28, gw = Math.min(w, 228) - 40, h = p.h || 84, top = y + 14, out = '';
    var X = function (v) { return gx + v / p.xmax * gw; }, Y = function (v) { return top + h - v / p.ymax * h; };
    for (var a = 0; a <= p.xmax; a += p.xs) out += line(X(a), top, X(a), top + h, { s: LINE, sw: 0.6 }) + (a ? T(X(a), top + h + 11, a, { s: 8.5, f: INK2, a: 'middle' }) : '');
    for (var b = 0; b <= p.ymax; b += p.ys) out += line(gx, Y(b), gx + gw, Y(b), { s: LINE, sw: 0.6 }) + T(gx - 4, Y(b) + 3, b, { s: 8.5, f: INK2, a: 'end' });
    out += line(gx, top, gx, top + h, { sw: 1.2 }) + line(gx, top + h, gx + gw, top + h, { sw: 1.2 });
    p.pts.forEach(function (q) { out += '<circle cx="' + X(q[0]) + '" cy="' + Y(q[1]) + '" r="2.6" fill="' + INK + '"/>'; });
    out += T(gx + gw / 2, top + h + 23, p.xl, { s: 9.5, f: INK2, a: 'middle' });
    out += T(gx - 4, top - 6, p.yl, { s: 9.5, f: INK2 });
    return { svg: out, h: h + 38, w: gw + 40 };
  };
  /* two parallel lines (or, with one: true, a single crossing) cut by a slanted line; the 8 angles are numbered
     0 to 3 at the top crossing (top right, top left, bottom left, bottom right) and 4 to 7 at the bottom one.
     give: the angle written in degrees, ang: its size; ask: the angle marked "?" (and letters: ['a', ...] at others) */
  P.par = function (p, x, y, w) {
    var rad = Math.PI / 180, g = p.ang, give = p.give || 0, acute = give % 2 === 0 ? g : 180 - g;
    var W2 = Math.min(w, 220), cx1 = x + W2 / 2 - 16, cy1 = y + 22, gap = p.one ? 0 : 50, out = '';
    var slope = 1 / Math.tan(acute * rad), cx2 = cx1 - gap * slope, cy2 = cy1 + gap;
    [cy1].concat(p.one ? [] : [cy2]).forEach(function (ly) { out += line(x + 4, ly, x + W2 - 4, ly, { sw: 1.4 }); if (!p.one) out += '<path d="M' + (x + W2 - 22) + ' ' + (ly - 4) + ' l5 4 l-5 4" fill="none" stroke="' + INK + '" stroke-width="1.1"/>'; });
    var ext = 20, dx = Math.cos(acute * rad), dy = Math.sin(acute * rad);
    out += line(cx1 + dx * ext * 1.3, cy1 - dy * ext * 1.3, cx2 - dx * ext * 1.3, cy2 + dy * ext * 1.3, { sw: 1.4 });
    var mid = [acute / 2, (180 + acute) / 2, 180 + acute / 2, (360 + 180 + acute) / 2];
    function lab(i, s, bold) {
      var c = i < 4 ? [cx1, cy1] : [cx2, cy2], a = mid[i % 4] * rad, d = s.length > 2 ? 22 : 17;
      return T(c[0] + Math.cos(a) * d, c[1] - Math.sin(a) * d + 4, s, { s: bold ? 12 : 10, w: bold ? 700 : 400, f: bold ? INK : INK2, a: 'middle' });
    }
    out += lab(give, g + '°', false);
    if (p.ask != null) out += lab(p.ask, '?', true);
    (p.letters || []).forEach(function (l) { out += lab(l[0], l[1], true); });
    return { svg: out, h: (p.one ? 46 : 96), w: W2 };
  };
  /* a circle with its radius (show 'r') or diameter (show 'd') drawn and labelled */
  P.circ = function (p, x, y) {
    var R = 32, cx = x + R + 4, cy = y + R + 4, u = ' ' + (p.unit || 'cm'), out = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/><circle cx="' + cx + '" cy="' + cy + '" r="2" fill="' + INK + '"/>';
    if (p.d != null) out += line(cx - R, cy, cx + R, cy, { sw: 1.2 }) + T(cx, cy - 6, fmt(p.d) + u, { s: 11, w: 700, a: 'middle' });
    else out += line(cx, cy, cx + R, cy, { sw: 1.2 }) + T(cx + R / 2, cy - 6, fmt(p.r) + u, { s: 11, w: 700, a: 'middle' });
    return { svg: out, h: 2 * R + 8, w: 2 * R + 8 };
  };
  /* a cylinder with its radius and height */
  P.cyl = function (p, x, y) {
    var rx = 30, ry = 9, hh = 52, cx = x + rx + 4, t = y + ry + 2, u = ' ' + (p.unit || 'cm'), out = '';
    out += '<path d="M' + (cx - rx) + ' ' + t + ' L' + (cx - rx) + ' ' + (t + hh) + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + (t + hh) + ' L' + (cx + rx) + ' ' + t + '" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>';
    out += '<ellipse cx="' + cx + '" cy="' + t + '" rx="' + rx + '" ry="' + ry + '" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>' + dash(line(cx, t, cx + rx, t, { s: INK2, sw: 1 }));
    out += T(cx + rx / 2, t - 3, fmt(p.r) + u, { s: 10.5, w: 700, a: 'middle' }) + T(cx + rx + 6, t + hh / 2 + 4, fmt(p.h) + u, { s: 10.5, w: 700 });
    return { svg: out, h: hh + 2 * ry + 6, w: 2 * rx + 60 };
  };
  /* a rectangular prism with its length, width and height */
  P.rbox = function (p, x, y) {
    var L = 70, H = 38, dx = 22, dy = 14, x0 = x + 4, y0 = y + dy + 4, u = ' ' + (p.unit || 'cm'), out = '';
    out += '<path d="M' + x0 + ' ' + y0 + ' h' + L + ' v' + H + ' h' + -L + ' Z M' + x0 + ' ' + y0 + ' l' + dx + ' ' + -dy + ' h' + L + ' l' + -dx + ' ' + dy + ' M' + (x0 + L + dx) + ' ' + (y0 - dy) + ' v' + H + ' l' + -dx + ' ' + dy + '" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/>';
    out += T(x0 + L / 2, y0 + H + 13, fmt(p.l) + u, { s: 10.5, w: 700, a: 'middle' }) + T(x0 + L + dx / 2 + 4, y0 + H - dy / 2 + 8, fmt(p.w) + u, { s: 10.5, w: 700 }) + T(x0 + L + dx + 4, y0 - dy + H / 2 + 4, fmt(p.h) + u, { s: 10.5, w: 700 });
    return { svg: out, h: H + dy + 22, w: L + dx + 60 };
  };
  /* a triangular prism: a triangle of base b and height h, l long */
  P.tprism = function (p, x, y) {
    var B = 56, Hh = 40, dx = 64, dy = 18, x0 = x + 4, y0 = y + Hh + dy + 4, u = ' ' + (p.unit || 'cm'), out = '';
    var top = [x0 + B / 2, y0 - Hh];
    out += '<path d="M' + x0 + ' ' + y0 + ' L' + (x0 + B) + ' ' + y0 + ' L' + top[0] + ' ' + top[1] + ' Z M' + (x0 + B) + ' ' + y0 + ' l' + dx + ' ' + -dy + ' L' + (top[0] + dx) + ' ' + (top[1] - dy) + ' L' + top[0] + ' ' + top[1] + '" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/>';
    out += dash(line(top[0], top[1], top[0], y0, { s: INK2, sw: 1 }));
    out += T(x0 + B / 2, y0 + 13, fmt(p.b) + u, { s: 10.5, w: 700, a: 'middle' }) + T(top[0] + 3, y0 - Hh / 3, fmt(p.h) + u, { s: 10, f: INK2 }) + T(x0 + B + dx / 2 + 6, y0 - dy / 2 + 12, fmt(p.l) + u, { s: 10.5, w: 700 });
    return { svg: out, h: Hh + dy + 20, w: B + dx + 40 };
  };
  /* a right triangle with legs a and b and hypotenuse c (cm); ask: 'a', 'b' or 'c' is written "?" */
  P.rtri = function (p, x, y) {
    var k = Math.min(120 / p.a, 62 / p.b), A = p.a * k, B = p.b * k, x0 = x + 36, y0 = y + B + 6, u = ' ' + (p.unit || 'cm'), out = '';
    out += '<path d="M' + x0 + ' ' + y0 + ' h' + A + ' L' + x0 + ' ' + (y0 - B) + ' Z" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>';
    out += '<path d="M' + (x0 + 8) + ' ' + y0 + ' v-8 h-8" fill="none" stroke="' + INK + '" stroke-width="1"/>';
    var say = function (s, v) { return p.ask === s ? '?' : fmt(v) + u; };
    out += T(x0 + A / 2, y0 + 13, say('a', p.a), { s: 11, w: 700, a: 'middle' }) + T(x0 - 4, y0 - B / 2 + 4, say('b', p.b), { s: 11, w: 700, a: 'end' }) + T(x0 + A / 2 + 6, y0 - B / 2 - 2, say('c', p.c), { s: 11, w: 700 });
    return { svg: out, h: B + 22, w: A + 98 };
  };
  /* a coordinate grid from −n to n in both directions: pts, shape, after, keyShape and plot work as in coord */
  P.cgrid = function (p, x, y, w, key) {
    var n = p.n || 5, u = Math.min(10, (Math.min(w, 220) - 20) / (2 * n)), ox = x + 14 + n * u, oy = y + 6 + n * u, out = '';
    var X = function (v) { return ox + v * u; }, Y = function (v) { return oy - v * u; };
    for (var i = -n; i <= n; i++) {
      out += line(X(i), Y(-n), X(i), Y(n), { s: LINE, sw: 0.6 }) + line(X(-n), Y(i), X(n), Y(i), { s: LINE, sw: 0.6 });
      if (i && i % 2 === 0) out += T(X(i), Y(0) + 10, neg(i), { s: 7.5, f: INK2, a: 'middle' }) + T(X(0) - 3, Y(i) + 3, neg(i), { s: 7.5, f: INK2, a: 'end' });
    }
    out += line(X(-n), Y(0), X(n), Y(0), { sw: 1.2 }) + line(X(0), Y(-n), X(0), Y(n), { sw: 1.2 });
    function shape(list, col, d) { return '<path d="M' + list.map(function (q) { return X(q[0]) + ' ' + Y(q[1]); }).join(' L') + ' Z" fill="' + (d ? 'none' : '#dfe5ee') + '" fill-opacity="0.8" stroke="' + col + '" stroke-width="1.4"' + (d ? ' stroke-dasharray="4 3"' : '') + '/>'; }
    function dot(q, col) { return '<circle cx="' + X(q[0]) + '" cy="' + Y(q[1]) + '" r="3" fill="' + col + '"/>' + (q[2] ? T(X(q[0]) + 4, Y(q[1]) - 4, q[2], { s: 10, w: 700, f: col }) : ''); }
    if (p.shape) out += shape(p.shape, INK);
    if (p.after) out += shape(p.after, INK, true);
    if (key && p.keyShape) out += shape(p.keyShape, KEY, true);
    (p.pts || []).forEach(function (q) { out += dot(q, INK); });
    if (key) (p.plot || []).forEach(function (q) { out += dot(q, KEY); });
    return { svg: out, h: 2 * n * u + 14, w: 2 * n * u + 28 };
  };
  /* a composite shape: kind 'L' is a w by h rectangle with a cw by ch corner cut from its top right; kind 'semi' is a
     w by h rectangle with a half circle on top (its diameter is w) */
  P.comp = function (p, x, y) {
    var k = Math.min(140 / p.w, 70 / (p.h + (p.kind === 'semi' ? p.w / 2 : 0))), W2 = p.w * k, H2 = p.h * k, u = ' ' + (p.unit || 'm'), out = '';
    var x0 = x + 34, y0 = y + 6 + (p.kind === 'semi' ? W2 / 2 : 0) + H2;
    if (p.kind === 'L') {
      var cw = p.cw * k, ch = p.ch * k;
      out += '<path d="M' + x0 + ' ' + y0 + ' h' + W2 + ' v' + -(H2 - ch) + ' h' + -cw + ' v' + -ch + ' h' + -(W2 - cw) + ' Z" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>';
      out += T(x0 + W2 / 2, y0 + 13, fmt(p.w) + u, { s: 10.5, w: 700, a: 'middle' }) + T(x0 - 4, y0 - H2 / 2 + 4, fmt(p.h) + u, { s: 10.5, w: 700, a: 'end' });
      out += T(x0 + W2 - cw / 2, y0 - H2 + ch - 4, fmt(p.cw) + u, { s: 10, f: INK2, a: 'middle' }) + T(x0 + W2 + 4, y0 - (H2 - ch) / 2 + 4, fmt(p.h - p.ch) + u, { s: 10, f: INK2 });
    } else {
      out += '<path d="M' + x0 + ' ' + (y0 - H2) + ' v' + H2 + ' h' + W2 + ' v' + -H2 + ' A' + W2 / 2 + ' ' + W2 / 2 + ' 0 0 0 ' + x0 + ' ' + (y0 - H2) + '" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>' + dash(line(x0, y0 - H2, x0 + W2, y0 - H2, { s: INK2, sw: 1 }));
      out += T(x0 + W2 / 2, y0 + 13, fmt(p.w) + u, { s: 10.5, w: 700, a: 'middle' }) + T(x0 - 4, y0 - H2 / 2 + 4, fmt(p.h) + u, { s: 10.5, w: 700, a: 'end' });
    }
    return { svg: out, h: y0 - y + 18, w: W2 + 80 };
  };
  /* algebra tiles: xp and xn long x tiles (positive shaded, negative white), up and un small unit tiles */
  P.atiles = function (p, x, y, w) {
    var out = '', cx = x + 2, row = function (n, wide, pos) {
      for (var i = 0; i < n; i++) {
        out += '<rect x="' + cx + '" y="' + (y + 2) + '" width="' + (wide ? 11 : 11) + '" height="' + (wide ? 34 : 11) + '" fill="' + (pos ? '#dfe5ee' : '#fff') + '" stroke="' + INK + '" stroke-width="1.1"/>';
        out += T(cx + 5.5, y + (wide ? 22 : 11), pos ? (wide ? 'x' : '+') : (wide ? '−x' : '−'), { s: wide ? 8 : 9, w: 700, a: 'middle' });
        cx += wide ? 15 : 14;
      }
      if (n) cx += 8;
    };
    row(p.xp || 0, true, true); row(p.xn || 0, true, false); row(p.up || 0, false, true); row(p.un || 0, false, false);
    return { svg: out, h: 38, w: cx - x };
  };
  /* a table with a heading row: head ['Month', 'Income', ...], rows [[...], ...]; numbers get a space from 5 digits */
  P.tbl = function (p, x, y, w) {
    var n = p.head.length, cw = Math.min(w, 228) / n, rh = 17, out = '';
    p.head.forEach(function (h, i) { out += T(x + i * cw + 3, y + 11, h, { s: 9.5, w: 700, f: INK2 }); });
    out += line(x, y + 15, x + cw * n, y + 15, { s: INK2, sw: 0.9 });
    p.rows.forEach(function (r, j) {
      r.forEach(function (v, i) { out += T(x + i * cw + 3, y + 15 + (j + 1) * rh - 4, fmt(v), { s: 10.5, w: i ? 400 : 700 }); });
      out += line(x, y + 15 + (j + 1) * rh, x + cw * n, y + 15 + (j + 1) * rh, { s: LINE, sw: 0.7 });
    });
    return { svg: out, h: 18 + p.rows.length * rh, w: cw * n };
  };
})();
