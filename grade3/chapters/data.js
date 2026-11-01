/* Grade 3 Data and probability: a full chapter (docs/QUESTIONS.md, "Full chapters"). 5 lessons, 15 ideas, one practice skill per idea.
   Ontario 2020: D1.1 sorting, D1.2 collecting, D1.3 graphs, D1.4 mean and mode, D1.5 analysing, D2.1 likelihood, D2.2 populations.
   Every question sets meta.k; the answer checks are in tests/verify/grade3.js (keys start with g3dt-). */
(function () {
  var A = Atlas, R = A.R, Q = A.Q, CH = 'data';
  var mc = G3.mc, num = G3.num, tf = G3.tf, clip = G3.clip;

  /* ---------- small helpers ---------- */
  function coin() { return Math.random() < 0.5; }
  function put(o, x) { for (var k in x) o[k] = x[k]; return o; }
  function plain(h) { var e = document.createElement('div'); e.innerHTML = h; return e.textContent.replace(/\s+/g, ' ').trim(); }
  function sum(v) { return v.reduce(function (a, b) { return a + b; }, 0); }
  function sym(t) { return t ? '<p class="g3-sym">' + t + '</p>' : ''; }
  function low(t) { return t.charAt(0).toLowerCase() + t.slice(1); }
  function fixed(q, opts, ans, fixes, x) { var w = {}; opts.forEach(function (o, j) { if (j !== ans && fixes[j]) w[plain(o)] = fixes[j]; }); return put({ q: q, type: 'mc', options: opts, answer: ans, wrong: w }, x || {}); }
  function uid() { return 'd' + Math.random().toString(36).slice(2, 8); }
  function counts(v) { var c = {}; v.forEach(function (x) { c[x] = (c[x] || 0) + 1; }); return c; }
  /* the modes of a list: every value that appears most, if it appears more than once */
  function modes(v) { var c = counts(v), best = Math.max.apply(null, Object.keys(c).map(function (k) { return c[k]; })); return best < 2 ? [] : Object.keys(c).filter(function (k) { return c[k] === best; }).map(Number).sort(function (a, b) { return a - b; }); }
  function mean(v) { return sum(v) / v.length; }
  function sorted(v) { return v.slice().sort(function (a, b) { return a - b; }); }

  /* ---------- pictures ---------- */
  var ATTR = { even: 'Even', odd: 'Odd', gt10: 'More than 10', gt15: 'More than 15', gt20: 'More than 20', gt50: 'More than 50', lt10: 'Less than 10', m3: 'Multiple of 3', m4: 'Multiple of 4', m5: 'Multiple of 5', m10: 'Multiple of 10' };
  var TEST = { even: function (n) { return n % 2 === 0; }, odd: function (n) { return n % 2 === 1; }, gt10: function (n) { return n > 10; }, gt15: function (n) { return n > 15; }, gt20: function (n) { return n > 20; }, gt50: function (n) { return n > 50; }, lt10: function (n) { return n < 10; },
    m3: function (n) { return n % 3 === 0; }, m4: function (n) { return n % 4 === 0; }, m5: function (n) { return n % 5 === 0; }, m10: function (n) { return n % 10 === 0; } };
  function reg(n, a, b) { var x = TEST[a](n), y = TEST[b](n); return x && y ? 'ab' : x ? 'a' : y ? 'b' : 'none'; }
  function regName(r, a, b) { return r === 'a' ? ATTR[a] + ' only' : r === 'b' ? ATTR[b] + ' only' : r === 'ab' ? 'Both' : 'Neither'; }
  /* a Venn diagram: parts = { a: [...], ab: [...], b: [...], none: [...] } holds the text for each part */
  function vennPic(parts, la, lb, big) {
    var s = '<rect x="4" y="4" width="392" height="256" rx="14" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>' +
      '<circle cx="148" cy="130" r="96" style="fill:color-mix(in srgb,var(--sb) 14%,transparent);stroke:var(--sb)" stroke-width="3"/>' +
      '<circle cx="252" cy="130" r="96" style="fill:color-mix(in srgb,var(--se) 14%,transparent);stroke:var(--se)" stroke-width="3"/>' +
      '<text x="100" y="24" text-anchor="middle" font-size="16" class="tb" style="fill:var(--sb)">' + la + '</text><text x="300" y="24" text-anchor="middle" font-size="16" class="tb" style="fill:var(--se)">' + lb + '</text>';
    function place(list, xs, ys) { (list || []).forEach(function (t, i) { s += '<text x="' + xs[i % xs.length] + '" y="' + ys[Math.floor(i / xs.length)] + '" text-anchor="middle" font-size="' + (big ? 30 : 21) + '" class="tb">' + t + '</text>'; }); }
    if (big) { place(parts.a, [100], [142]); place(parts.ab, [200], [142]); place(parts.b, [300], [142]); place(parts.none, [360], [250]); }
    else { place(parts.a, [82, 122], [100, 134, 168]); place(parts.ab, [200], [104, 138, 172]); place(parts.b, [278, 318], [100, 134, 168]); place(parts.none, [26, 62, 98, 134, 170, 206, 242, 278, 314, 350], [250]); }
    var say = function (l) { return (l || []).join(', ') || 'none'; };
    return A.svg(400, 264, s, 'Venn diagram. ' + la + ' only: ' + say(parts.a) + '. Both: ' + say(parts.ab) + '. ' + lb + ' only: ' + say(parts.b) + '. Neither: ' + say(parts.none) + '.');
  }
  function partsOf(nums, a, b, hide) { var p = { a: [], ab: [], b: [], none: [] }; sorted(nums).forEach(function (n) { if (n !== hide) p[reg(n, a, b)].push(n); }); return p; }
  function sortedVenn(c, hide) { return vennPic(partsOf(c.nums, c.a, c.b, hide), ATTR[c.a], ATTR[c.b]); }
  /* a Carroll diagram: rows are a / not a, columns b / not b. o.hits: tap a box; o.hide: leave a number out; o.move: [n, box] draws n in the wrong box; o.empty: no numbers */
  var BOX = ['yy', 'yn', 'ny', 'nn'];
  function boxOf(n, a, b) { return (TEST[a](n) ? 'y' : 'n') + (TEST[b](n) ? 'y' : 'n'); }
  function notL(t) { return 'Not ' + low(t); }
  function boxName(k, a, b) { return (k[0] === 'y' ? ATTR[a] : notL(ATTR[a])) + ', ' + low(k[1] === 'y' ? ATTR[b] : notL(ATTR[b])); }
  function carrollPic(nums, a, b, o) {
    o = o || {};
    var s = '', X = [4, 118, 258], W = [114, 140, 138], Y = [4, 52, 132], Hh = [48, 80, 80], cells = { yy: [], yn: [], ny: [], nn: [] };
    sorted(nums).forEach(function (n) { if (n === o.hide) return; cells[o.move && o.move[0] === n ? o.move[1] : boxOf(n, a, b)].push(n); });
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
      if (!r && !c) continue;
      s += '<rect x="' + X[c] + '" y="' + Y[r] + '" width="' + W[c] + '" height="' + Hh[r] + '" style="fill:' + (!r || !c ? 'color-mix(in srgb,var(--strand) 12%,var(--card))' : 'var(--card)') + ';stroke:var(--line)" stroke-width="2"/>';
    }
    function head(t, x, y, col) { var two = /^Not /.test(t) && t.length > 13; s += '<text x="' + x + '" y="' + (two ? y - 9 : y) + '" text-anchor="middle" font-size="15" class="tb" style="fill:' + col + '">' + (two ? 'Not' : t) + '</text>' + (two ? '<text x="' + x + '" y="' + (y + 10) + '" text-anchor="middle" font-size="15" class="tb" style="fill:' + col + '">' + t.slice(4) + '</text>' : ''); }
    head(ATTR[b], 188, 33, 'var(--se)'); head(notL(ATTR[b]), 327, 33, 'var(--se)'); head(ATTR[a], 61, 97, 'var(--sb)'); head(notL(ATTR[a]), 61, 177, 'var(--sb)');
    BOX.forEach(function (k) {
      var r = k[0] === 'y' ? 1 : 2, c = k[1] === 'y' ? 1 : 2, cx = X[c] + W[c] / 2;
      if (!o.empty) cells[k].forEach(function (n, i) { s += '<text x="' + (cx + (i % 3 - 1) * 40) + '" y="' + (Y[r] + 34 + Math.floor(i / 3) * 30) + '" text-anchor="middle" font-size="20" class="tb">' + n + '</text>'; });
      if (o.hits) s += '<rect data-hit="' + k + '" aria-label="the box ' + boxName(k, a, b) + '" x="' + X[c] + '" y="' + Y[r] + '" width="' + W[c] + '" height="' + Hh[r] + '" fill="transparent" style="cursor:pointer"/>';
    });
    return A.svg(400, 216, s, 'Carroll diagram: ' + BOX.map(function (k) { return boxName(k, a, b) + ': ' + (o.empty ? 'empty' : cells[k].join(', ') || 'none'); }).join('. '));
  }
  function cardsPic(v, hi) {
    var per = Math.min(v.length, 7), s = '';
    v.forEach(function (x, i) { var on = hi != null && x === hi, cx = 6 + (i % per) * 56, cy = 6 + Math.floor(i / per) * 58; s += '<rect x="' + cx + '" y="' + cy + '" width="50" height="50" rx="10" style="fill:' + (on ? 'var(--hi)' : 'var(--card)') + ';stroke:' + (on ? 'var(--ink)' : 'var(--line)') + '" stroke-width="2.5"/><text x="' + (cx + 25) + '" y="' + (cy + 33) + '" text-anchor="middle" font-size="22" class="tb"' + (on ? ' style="fill:#13203a"' : '') + '>' + x + '</text>'; });
    return A.svg(per * 56 + 8, Math.ceil(v.length / per) * 58 + 6, s, 'Cards: ' + v.join(', '));
  }

  /* blocks for tree diagrams: a code like "cbB" = circle (c) or square (q), blue (b) or orange (o), big (B) or small (s) */
  var KINDS8 = ['cbB', 'cbs', 'coB', 'cos', 'qbB', 'qbs', 'qoB', 'qos'];
  function bName(k, many) { return (k[2] === 'B' ? 'big' : 'small') + ' ' + (k[1] === 'b' ? 'blue' : 'orange') + ' ' + (k[0] === 'c' ? 'circle' : 'square') + (many ? 's' : ''); }
  function blk(k, x, y, r) {
    var col = k[1] === 'b' ? 'var(--sb)' : k[1] === 'o' ? 'var(--se)' : 'var(--line)', st = ' style="fill:' + col + ';stroke:var(--ink)" stroke-width="2"';
    r = r || (k[2] === 'B' ? 15 : 9);
    return k[0] === 'c' ? '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"' + st + '/>' : '<rect x="' + (x - r) + '" y="' + (y - r) + '" width="' + 2 * r + '" height="' + 2 * r + '" rx="3"' + st + '/>';
  }
  function trayPic(bs) {
    if (!bs.length) return '';
    var per = Math.min(bs.length, 8), s = '<rect x="2" y="2" width="' + (per * 46 + 8) + '" height="' + (Math.ceil(bs.length / per) * 46 + 8) + '" rx="12" style="fill:color-mix(in srgb,var(--ink) 5%,var(--card));stroke:var(--line)" stroke-width="2"/>';
    bs.forEach(function (k, i) { s += blk(k, 29 + (i % per) * 46, 29 + Math.floor(i / per) * 46); });
    return A.svg(per * 46 + 12, Math.ceil(bs.length / per) * 46 + 12, s, 'Blocks: ' + bs.map(function (k) { return bName(k); }).join(', '));
  }
  /* a tree diagram: shape, then colour, then size. o.counts: { leaf: n }; o.hide: leaves shown as "?"; o.hits: tap a leaf; o.mark: ring one leaf */
  function treePic(o) {
    o = o || {};
    var s = '', LX = function (i) { return 25 + 50 * i; };
    function edge(x1, y1, x2, y2) { s += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="stroke:var(--line)" stroke-width="2.5"/>'; }
    [0, 1].forEach(function (a) { edge(200, 30, 100 + 200 * a, 62); [0, 1].forEach(function (b) { var j = a * 2 + b; edge(100 + 200 * a, 82, 50 + 100 * j, 118); [0, 1].forEach(function (c) { edge(50 + 100 * j, 138, LX(j * 2 + c), 170); }); }); });
    s += '<rect x="176" y="8" width="48" height="24" rx="8" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/><text x="200" y="26" text-anchor="middle" font-size="15" class="tb">All</text>';
    [0, 1].forEach(function (a) { s += blk((a ? 'q' : 'c') + 'gB', 100 + 200 * a, 72, 12); });
    [0, 1, 2, 3].forEach(function (j) { s += blk((j < 2 ? 'c' : 'q') + (j % 2 ? 'o' : 'b') + 'B', 50 + 100 * j, 128, 11); });
    KINDS8.forEach(function (k, i) {
      s += blk(k, LX(i), 188);
      if (o.mark === k) s += '<circle cx="' + LX(i) + '" cy="188" r="22" fill="none" style="stroke:var(--bad)" stroke-width="3"/>';
      if (o.counts) s += '<text x="' + LX(i) + '" y="236" text-anchor="middle" font-size="20" class="tb">' + ((o.hide || []).indexOf(k) >= 0 ? '?' : o.counts[k] || 0) + '</text>';
      if (o.hits) s += '<rect data-hit="' + k + '" aria-label="the ' + bName(k, true) + '" x="' + (LX(i) - 25) + '" y="160" width="50" height="86" fill="transparent" style="cursor:pointer"/>';
    });
    return A.svg(400, 248, s, 'Tree diagram: shape, then colour, then size' + (o.counts ? '. ' + KINDS8.map(function (k) { return bName(k, true) + ' ' + ((o.hide || []).indexOf(k) >= 0 ? 'missing' : o.counts[k] || 0); }).join(', ') : ''));
  }
  function countBlocks(bs) { var c = {}; KINDS8.forEach(function (k) { c[k] = 0; }); bs.forEach(function (k) { c[k]++; }); return c; }

  /* tally marks: groups of 5, up to 5 groups in a row */
  function tallyMarks(n, x0, y0) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var g = Math.floor(i / 5), k = i % 5, x = x0 + (g % 5) * 40 + k * 7, y = y0 + Math.floor(g / 5) * 36;
      s += k === 4 ? '<line x1="' + (x - 31) + '" y1="' + (y + 22) + '" x2="' + (x + 3) + '" y2="' + (y + 4) + '" style="stroke:var(--ink)" stroke-width="2.5"/>' : '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + 26) + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    }
    return s;
  }
  function tallyPic(n) { var g = Math.max(1, Math.ceil(n / 5)); return A.svg(Math.min(g, 5) * 40 + 8, Math.ceil(g / 5) * 36 + 6, tallyMarks(n, 6, 4), 'Tally marks'); }
  /* a frequency table: rows [[name, n]]; show: tally, count or both; hide: rows whose count is "?" */
  function freqTable(rows, show, hide) {
    hide = hide || [];
    return '<div class="tbl"><table><thead><tr><th class="l">Choice</th>' + (show !== 'count' ? '<th class="l">Tally</th>' : '') + (show !== 'tally' ? '<th>Count</th>' : '') + '</tr></thead><tbody>' + rows.map(function (r, i) {
      return '<tr><td class="l">' + r[0] + '</td>' + (show !== 'count' ? '<td class="l">' + (r[1] ? tallyPic(r[1]) : '') + '</td>' : '') + (show !== 'tally' ? '<td>' + (hide.indexOf(i) >= 0 ? '?' : r[1]) + '</td>' : '') + '</tr>';
    }).join('') + '</tbody></table></div>';
  }
  /* a pictograph: rows [[name, n]], each picture stands for key; half a picture for half a key */
  function pictoPic(title, rows, key, o) {
    o = o || {};
    var id = uid(), y = o.noTitle ? 30 : 58, s = o.noTitle ? '' : '<text x="200" y="24" text-anchor="middle" font-size="18" class="tb">' + title + '</text>';
    function dot(x, yy, half) { return half ? '<g clip-path="url(#' + id + ')" transform="translate(' + x + ' ' + yy + ')"><circle r="12" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/></g><circle cx="' + x + '" cy="' + yy + '" r="12" fill="none" style="stroke:var(--ink)" stroke-width="1" stroke-dasharray="3 3"/>' : '<circle cx="' + x + '" cy="' + yy + '" r="12" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/>'; }
    s += '<defs><clipPath id="' + id + '"><rect x="-13" y="-13" width="13" height="26"/></clipPath></defs>';
    rows.forEach(function (r) {
      s += '<text x="94" y="' + (y + 6) + '" text-anchor="end" font-size="16" class="tb">' + r[0] + '</text>';
      var full = Math.floor(r[1] / key), half = r[1] % key ? 1 : 0;
      for (var i = 0; i < full + half; i++) s += dot(118 + i * 30, y, i === full);
      y += 40;
    });
    s += '<line x1="10" y1="' + (y - 14) + '" x2="390" y2="' + (y - 14) + '" style="stroke:var(--line)" stroke-width="1.5"/>' + dot(118, y + 10) + '<text x="138" y="' + (y + 16) + '" font-size="16">= ' + G3.pl(key, 'vote') + '</text>';
    if (o.src && !o.noSource) s += '<text x="392" y="' + (y + 16) + '" text-anchor="end" font-size="15" class="t2">Source: ' + o.src + '</text>';
    return A.svg(400, y + 30, s, 'Pictograph: ' + title + '. ' + rows.map(function (r) { return r[0] + ' ' + r[1]; }).join(', ') + '. Each picture means ' + key + '.');
  }
  /* a bar graph. o: src, ylab, step, noTitle, noSource, noLabel, hits (tap a bar), wrong: [index, value drawn instead] */
  function barPic(title, rows, step, o) {
    o = o || {};
    var shown = rows.map(function (r, i) { return o.wrong && o.wrong[0] === i ? o.wrong[1] : r[1]; }), max = Math.max.apply(null, shown), top = Math.max(step * 2, Math.ceil(max / step) * step);
    var x0 = 62, x1 = 392, yb = 236, yt = o.noTitle ? 24 : 46, Hh = yb - yt, bw = (x1 - x0) / rows.length, lines = top / step, s = '';
    if (!o.noTitle) s += '<text x="226" y="22" text-anchor="middle" font-size="18" class="tb">' + title + '</text>';
    for (var k = 0; k <= lines; k++) {
      var y = yb - Hh * k / lines;
      s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" style="stroke:var(--line)" stroke-width="1.5"/>';
      if (lines <= 10 || k % 2 === 0) s += '<text x="' + (x0 - 6) + '" y="' + (y + 5) + '" text-anchor="end" font-size="15">' + k * step + '</text>';
    }
    rows.forEach(function (r, i) {
      var h = Hh * shown[i] / top, x = x0 + i * bw + bw * 0.2;
      s += '<rect x="' + x.toFixed(1) + '" y="' + (yb - h).toFixed(1) + '" width="' + (bw * 0.6).toFixed(1) + '" height="' + h.toFixed(1) + '" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/>' +
        '<text x="' + (x + bw * 0.3).toFixed(1) + '" y="256" text-anchor="middle" font-size="15" class="tb">' + r[0] + '</text>';
      if (o.hits) s += '<rect data-hit="' + i + '" aria-label="the bar for ' + r[0] + '" x="' + (x0 + i * bw).toFixed(1) + '" y="' + yt + '" width="' + bw.toFixed(1) + '" height="' + (Hh + 28) + '" fill="transparent" style="cursor:pointer"/>';
    });
    s += '<line x1="' + x0 + '" y1="' + yb + '" x2="' + x1 + '" y2="' + yb + '" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="' + x0 + '" y1="' + yb + '" x2="' + x0 + '" y2="' + (yt - 6) + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    if (!o.noLabel) s += '<text x="16" y="' + ((yb + yt) / 2) + '" text-anchor="middle" font-size="15" class="t2" transform="rotate(-90 16 ' + ((yb + yt) / 2) + ')">' + (o.ylab || 'Number of votes') + '</text>';
    if (o.src && !o.noSource) s += '<text x="392" y="282" text-anchor="end" font-size="15" class="t2">Source: ' + o.src + '</text>';
    return A.svg(400, o.src && !o.noSource ? 290 : 266, s, 'Bar graph: ' + (o.noTitle ? 'no title' : title) + '. ' + rows.map(function (r) { return r[0] + ' ' + r[1]; }).join(', ') + '. The scale counts by ' + step + '.');
  }
  /* a line plot: an X for each value above a number line */
  function dotPlot(v, lo, hi) {
    var u = 360 / Math.max(1, hi - lo), c = counts(v), s = '<line x1="12" y1="150" x2="388" y2="150" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var t = lo; t <= hi; t++) {
      var x = (20 + (t - lo) * u).toFixed(1);
      s += '<line x1="' + x + '" y1="145" x2="' + x + '" y2="155" style="stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="176" text-anchor="middle" font-size="16" class="tb">' + t + '</text>';
      for (var k = 0; k < (c[t] || 0); k++) s += '<text x="' + x + '" y="' + (136 - k * 22) + '" text-anchor="middle" font-size="22" class="tb" style="fill:var(--strand)">&times;</text>';
    }
    return A.svg(400, 184, s, 'Line plot of ' + sorted(v).join(', '));
  }
  /* towers of cubes, with a dashed line at the fair share */
  function towersPic(v, line) {
    var max = Math.max.apply(null, v.concat([line || 0])), u = Math.min(18, 170 / max), w = Math.min(64, 380 / v.length), s = '';
    v.forEach(function (t, i) {
      var x = 10 + i * w;
      for (var k = 0; k < t; k++) s += '<rect x="' + (x + 6).toFixed(1) + '" y="' + (184 - (k + 1) * u).toFixed(1) + '" width="' + (w - 12).toFixed(1) + '" height="' + (u - 2).toFixed(1) + '" rx="2" style="fill:' + (line != null && k >= line ? 'var(--hi)' : 'var(--strand)') + ';stroke:var(--ink)" stroke-width="1"/>';
      s += '<text x="' + (x + w / 2).toFixed(1) + '" y="206" text-anchor="middle" font-size="18" class="tb">' + t + '</text>';
    });
    if (line != null) s += '<line x1="4" y1="' + (184 - line * u).toFixed(1) + '" x2="' + (16 + v.length * w).toFixed(1) + '" y2="' + (184 - line * u).toFixed(1) + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="7 5"/>';
    return A.svg(Math.max(120, 20 + v.length * w), 214, s, 'Towers of ' + v.join(', ') + ' cubes');
  }
  /* a bag of marbles and a spinner */
  var CC = { red: 'var(--bad)', blue: 'var(--sb)', green: 'var(--sd)', yellow: 'var(--hi)' };
  function bagPic(bag, label) {
    var list = []; Object.keys(bag).forEach(function (c) { for (var i = 0; i < bag[c]; i++) list.push(c); });
    var per = 5, rows = Math.max(1, Math.ceil(list.length / per)), Hh = 54 + rows * 32, s = '<path d="M30 20 Q30 10 40 10 H170 Q180 10 180 20 L192 ' + (Hh - 14) + ' Q192 ' + (Hh - 4) + ' 182 ' + (Hh - 4) + ' H28 Q18 ' + (Hh - 4) + ' 18 ' + (Hh - 14) + ' Z" style="fill:color-mix(in srgb,var(--ink) 5%,var(--card));stroke:var(--ink)" stroke-width="2.5"/>';
    list.forEach(function (c, i) { s += '<circle cx="' + (45 + (i % per) * 30) + '" cy="' + (42 + Math.floor(i / per) * 32) + '" r="12" style="fill:' + CC[c] + ';stroke:var(--ink)" stroke-width="1.5"/>'; });
    return A.svg(210, Hh, s, label || 'A bag with ' + Object.keys(bag).map(function (c) { return bag[c] + ' ' + c; }).join(', '));
  }
  function spinPic(parts) {
    var n = parts.length, s = '';
    parts.forEach(function (c, i) {
      var a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n;
      s += n === 1 ? '<circle cx="90" cy="90" r="80" style="fill:' + CC[c] + ';stroke:var(--ink)" stroke-width="2.5"/>' : '<path d="M90 90 L' + (90 + 80 * Math.cos(a0)).toFixed(1) + ' ' + (90 + 80 * Math.sin(a0)).toFixed(1) + ' A80 80 0 0 1 ' + (90 + 80 * Math.cos(a1)).toFixed(1) + ' ' + (90 + 80 * Math.sin(a1)).toFixed(1) + ' Z" style="fill:' + CC[c] + ';stroke:var(--ink)" stroke-width="2.5"/>';
    });
    s += '<line x1="90" y1="90" x2="128" y2="44" style="stroke:var(--ink)" stroke-width="5" stroke-linecap="round"/><circle cx="90" cy="90" r="7" style="fill:var(--ink)"/>';
    var c = counts(parts);
    return A.svg(180, 180, s, 'A spinner with ' + n + ' equal parts: ' + Object.keys(c).map(function (k) { return c[k] + ' ' + k; }).join(', '));
  }

  /* ---------- skills: one per idea. DEF[id] = [[minLevel, shape, fn(lv), maxLevel], ...], the first is "plain" ---------- */
  var DEF = {}, SKILLS = [];
  function skill(id, name, code, list) { DEF[id] = list; SKILLS.push({ id: id, name: name, code: code }); }
  function ck(id, shape, lv) { return function () { var s = DEF[id].filter(function (x) { return x[1] === shape; })[0], q = s[2](lv); q.shape = shape; return q; }; }

  /* ======================= Lesson 1: Sorting ======================= */
  var PAIRS = { 1: [['even', 'gt15'], ['even', 'lt10'], ['odd', 'gt15'], ['m5', 'gt15'], ['m5', 'even']], 2: [['m3', 'even'], ['m3', 'gt15'], ['m5', 'odd'], ['even', 'gt20'], ['m10', 'gt20']], 3: [['m5', 'gt50'], ['m3', 'gt50'], ['even', 'm3'], ['m4', 'm3'], ['m10', 'gt50'], ['odd', 'gt50']] };
  var TOP = { 1: 30, 2: 50, 3: 100 };
  function sortCase(lv) {
    var p = R.pick(PAIRS[lv]), a = p[0], b = p[1], cap = { a: 3, ab: lv === 1 ? 2 : 3, b: 3, none: lv === 1 ? 3 : 4 }, bins = { a: [], ab: [], b: [], none: [] }, nums = [];
    for (var n = 1; n <= TOP[lv]; n++) bins[reg(n, a, b)].push(n);
    Object.keys(bins).forEach(function (r) { R.shuffle(bins[r]).slice(0, R.int(1, cap[r])).forEach(function (n) { nums.push(n); }); });
    return { a: a, b: b, nums: R.shuffle(nums), lv: lv };
  }
  function newNum(c) { var n; do { n = R.int(1, TOP[c.lv]); } while (c.nums.indexOf(n) >= 0); return n; }
  function whereAsk(q, c, n, x) {
    var parts = ['a', 'ab', 'b', 'none'], at = parts.indexOf(reg(n, c.a, c.b));
    return fixed(q, parts.map(function (r) { return regName(r, c.a, c.b); }), at, parts.map(function (r) { return r === 'ab' ? 'Check: does ' + n + ' fit both labels?' : r === 'none' ? 'Check each label: ' + n + ' fits at least one.' : 'Check the other label too.'; }), put({ meta: { k: 'g3dt-venn-where', n: n, a: c.a, b: c.b } }, x));
  }
  function fitTxt(c, which) { return which === 'a' ? '<b>' + ATTR[c.a] + '</b>' : which === 'b' ? '<b>' + ATTR[c.b] + '</b>' : which === 'ab' ? '<b>both</b> labels' : '<b>neither</b> label'; }
  function fitCount(c, which) { return c.nums.filter(function (n) { var r = reg(n, c.a, c.b); return which === 'a' ? r === 'a' || r === 'ab' : which === 'b' ? r === 'b' || r === 'ab' : r === which; }).length; }
  var VSTORY = [['Hockey', 'Soccer', 'play hockey', 'play soccer', 'play both'], ['Dog', 'Cat', 'have a dog', 'have a cat', 'have both'], ['French', 'Cree', 'speak French', 'speak Cree', 'speak both'], ['Skate', 'Ski', 'can skate', 'can ski', 'can do both']];
  skill('dt-venn', 'Venn diagrams', 'D1.1', [
    [1, 'plain', function (lv) {
      var c = sortCase(lv), n = newNum(c);
      return whereAsk('Where does <b>' + n + '</b> go?', c, n, { fig: sortedVenn(c), hint: 'Ask two questions: is it ' + low(ATTR[c.a]) + '? Is it ' + low(ATTR[c.b]) + '?',
        steps: [n + ': ' + (TEST[c.a](n) ? 'yes' : 'no') + ' for ' + low(ATTR[c.a]) + ', ' + (TEST[c.b](n) ? 'yes' : 'no') + ' for ' + low(ATTR[c.b]) + '.'], explain: n + ' goes in ' + low(regName(reg(n, c.a, c.b), c.a, c.b)) + '.' });
    }],
    [1, 'count', function (lv) {
      var c = sortCase(lv), w = R.pick(lv === 1 ? ['a', 'b', 'ab', 'none'] : ['a', 'b', 'a', 'b', 'none']), t = fitCount(c, w), f = {};
      if (w === 'a' || w === 'b') f[c.nums.filter(function (n) { return reg(n, c.a, c.b) === w; }).length] = 'Count the overlap too: those numbers fit this label as well.';
      return num('How many numbers fit ' + fitTxt(c, w) + '?', t, f, { fig: sortedVenn(c), hint: w === 'a' || w === 'b' ? 'Count the whole circle, overlap included.' : 'Count only that part.',
        steps: [w === 'a' || w === 'b' ? 'The whole circle: the only part plus the overlap.' : 'Count the numbers in that part.'], explain: t + ' numbers.', meta: { k: 'g3dt-venn-count', nums: c.nums, a: c.a, b: c.b, w: w } });
    }],
    [2, 'total', function (lv) {
      var c = sortCase(lv), p = partsOf(c.nums, c.a, c.b), f = {};
      f[c.nums.length - p.none.length] = 'Count the numbers outside the circles too.';
      return num('How many numbers are sorted in this diagram?', c.nums.length, f, { fig: sortedVenn(c), hint: 'Add the four parts.', steps: [p.a.length + ' + ' + p.ab.length + ' + ' + p.b.length + ' + ' + p.none.length + ' = ' + c.nums.length + '.'], explain: c.nums.length + ' numbers.', meta: { k: 'g3dt-venn-total', nums: c.nums } });
    }],
    [1, 'story', function (lv) {
      var st = R.pick(VSTORY), h = lv === 1 ? R.int(5, 12) : lv === 2 ? R.int(10, 25) : R.int(30, 90), s = lv === 1 ? R.int(5, 12) : lv === 2 ? R.int(10, 25) : R.int(30, 90), b = R.int(lv === 3 ? 10 : 2, Math.min(h, s) - 1), ask = lv === 3 ? R.pick(['any', 'a']) : R.pick(['a', 'b']), ans = ask === 'a' ? h - b : ask === 'b' ? s - b : h + s - b, f = {};
      f[ask === 'any' ? h + s : ask === 'a' ? h : s] = ask === 'any' ? 'The ' + b + ' in both were counted twice. Take them away once.' : 'Some of them ' + st[4] + '. Take those away.';
      return num(h + ' children ' + st[2] + '. ' + s + ' children ' + st[3] + '. ' + b + ' of them ' + st[4] + '. ' + (ask === 'any' ? 'How many children ' + st[2].split(' ')[0] + ' ' + st[2].split(' ').slice(1).join(' ') + ', ' + st[3].split(' ').slice(1).join(' ') + ' or both?' : 'How many ' + (ask === 'a' ? st[2] : st[3]) + ' <b>only</b>?'), ans, f,
        { fig: vennPic({ a: [ask === 'b' ? h - b : '?'], ab: [b], b: [ask === 'a' ? s - b : '?'], none: [] }, st[0] + ' (' + h + ')', st[1] + ' (' + s + ')', true), hint: 'The ' + b + ' in the middle are in both circles.',
          steps: ask === 'any' ? [h + ' &minus; ' + b + ' = ' + (h - b) + ' only ' + st[0].toLowerCase() + '.', (h - b) + ' + ' + b + ' + ' + (s - b) + ' = ' + ans + '.'] : [(ask === 'a' ? h : s) + ' &minus; ' + b + ' = ' + ans + '.'], explain: ans + ' children.', meta: { k: 'g3dt-venn-story', h: h, s: s, b: b, ask: ask } });
    }],
    [2, 'pick', function (lv) {
      var c = sortCase(lv), opts = R.shuffle(c.nums).slice(0, 6), regs = opts.map(function (n) { return reg(n, c.a, c.b); }), ans = [];
      var want = R.pick(['ab', 'a', 'b', 'none'].filter(function (r) { return regs.indexOf(r) >= 0 && regs.some(function (x) { return x !== r; }); }));
      regs.forEach(function (r, j) { if (r === want) ans.push(j); });
      return { q: 'Pick every number that goes in <b>' + low(regName(want, c.a, c.b)) + '</b>.', type: 'pick', options: opts.map(String), answer: ans, fig: vennPic({ a: [], ab: [], b: [], none: [] }, ATTR[c.a], ATTR[c.b]), hint: 'Check both labels for each number.',
        steps: ['Ask about each number: ' + low(ATTR[c.a]) + '? ' + low(ATTR[c.b]) + '?'], explain: ans.map(function (j) { return opts[j]; }).join(', ') + '.', meta: { k: 'g3dt-venn-pick', a: c.a, b: c.b, want: want } };
    }],
    [2, 'tf', function (lv) {
      var c = sortCase(lv), n = newNum(c), real = reg(n, c.a, c.b), truth = coin(), said = truth ? real : R.pick(['a', 'ab', 'b', 'none'].filter(function (r) { return r !== real; })), who = Q.name();
      return tf(who + ' puts <b>' + n + '</b> in <b>' + low(regName(said, c.a, c.b)) + '</b>. True or false: that is the right place.', truth, n + ' is ' + (TEST[c.a](n) ? '' : 'not ') + low(ATTR[c.a]) + ' and ' + (TEST[c.b](n) ? '' : 'not ') + low(ATTR[c.b]) + '.',
        ['Big numbers always go in the overlap.', 'A number can go in any part.', 'Numbers outside the circles are wrong.'], 'Ask both questions for ' + n + '.', { fig: sortedVenn(c), hint: 'Check both labels.', meta: { k: 'g3dt-venn-tf', n: n, a: c.a, b: c.b, said: said } });
    }]
  ]);
  function tgVenn(lv) {
    return function () {
      var c = sortCase(lv), n = newNum(c), ya = TEST[c.a](n), yb = TEST[c.b](n);
      function yes(q, t, attr) { return fixed(q, ['Yes', 'No'], t ? 0 : 1, ['Check again: ' + n + ' is not ' + low(ATTR[attr]) + '.', 'Check again: ' + n + ' is ' + low(ATTR[attr]) + '.'], { hint: 'Test ' + n + ' against the label.', meta: { k: 'g3dt-venn-yes', n: n, t: attr } }); }
      return { q: 'Where does <b>' + n + '</b> go?', fig: sortedVenn(c), done: n + ' goes in ' + low(regName(reg(n, c.a, c.b), c.a, c.b)) + '.', steps: [
        { prompt: 'Test the blue label first.', q: yes('Is ' + n + ' ' + low(ATTR[c.a]) + '?', ya, c.a) },
        { prompt: 'Now test the orange label.', q: yes('Is ' + n + ' ' + low(ATTR[c.b]) + '?', yb, c.b) },
        { prompt: 'Yes and yes: the overlap. No and no: outside.', q: whereAsk('So where does ' + n + ' go?', c, n, { hint: (ya ? 'Yes' : 'No') + ', then ' + (yb ? 'yes' : 'no') + '.' }) }
      ] };
    };
  }

  /* ---------- Carroll diagrams ---------- */
  /* a case where the row (w = 'a') or column (w = 'b') does not split the numbers evenly */
  function carrollCase(lv, w) { var c; do { c = sortCase(lv); } while (fitCount(c, w) * 2 === c.nums.length); return c; }
  skill('dt-carroll', 'Carroll diagrams', 'D1.1', [
    [1, 'plain', function (lv) {
      var c = sortCase(lv), n = newNum(c), k = boxOf(n, c.a, c.b), w = {};
      BOX.forEach(function (b) { if (b !== k) w['the box ' + boxName(b, c.a, c.b)] = (b[0] !== k[0] ? 'Check the row: is ' + n + ' ' + low(ATTR[c.a]) + '?' : 'Check the column: is ' + n + ' ' + low(ATTR[c.b]) + '?'); });
      return { q: 'Tap the box where <b>' + n + '</b> goes.', type: 'tap', pic: carrollPic(c.nums, c.a, c.b, { hits: true }), answer: k, answerText: 'the box ' + boxName(k, c.a, c.b), wrong: w, hint: 'Pick the row first, then the column.',
        steps: ['Row: ' + low(k[0] === 'y' ? ATTR[c.a] : notL(ATTR[c.a])) + '.', 'Column: ' + low(k[1] === 'y' ? ATTR[c.b] : notL(ATTR[c.b])) + '.'], explain: n + ' goes in ' + low(boxName(k, c.a, c.b)) + '.', meta: { k: 'g3dt-car-tap', n: n, a: c.a, b: c.b } };
    }],
    [1, 'count', function (lv) {
      var c = sortCase(lv), w = R.pick(['a', 'b']), t = fitCount(c, w), f = {};
      f[c.nums.filter(function (n) { return boxOf(n, c.a, c.b) === 'yy'; }).length] = 'That is one box. Count the whole ' + (w === 'a' ? 'row' : 'column') + '.';
      return num('How many numbers fit <b>' + ATTR[c[w]] + '</b>?', t, f, { fig: carrollPic(c.nums, c.a, c.b), hint: 'Add the two boxes in that ' + (w === 'a' ? 'row' : 'column') + '.',
        steps: ['Two boxes: add them.'], explain: t + ' numbers.', meta: { k: 'g3dt-car-count', nums: c.nums, t: c[w] } });
    }],
    [1, 'fill', function (lv) {
      var c = sortCase(lv), cnt = BOX.map(function (k) { return c.nums.filter(function (n) { return boxOf(n, c.a, c.b) === k; }).length; });
      return { q: 'Sort these numbers. How many go in each box?', type: 'fill', fig: cardsPic(sorted(c.nums)) + carrollPic(c.nums, c.a, c.b, { empty: true }), fill: BOX.map(function (k) { return boxName(k, c.a, c.b) + ': [[]]'; }).join('<br>'), answers: cnt,
        hint: 'Sort one number at a time. The four counts add to ' + c.nums.length + '.', steps: BOX.map(function (k, i) { return boxName(k, c.a, c.b) + ': ' + cnt[i] + '.'; }), explain: cnt.join(' + ') + ' = ' + c.nums.length + '.', meta: { k: 'g3dt-car-fill', nums: c.nums, a: c.a, b: c.b } };
    }],
    [2, 'which', function (lv) {
      var c = sortCase(lv), n = R.pick(c.nums), right = boxOf(n, c.a, c.b), bad = R.pick(BOX.filter(function (k) { return k !== right; })), others = R.shuffle(c.nums.filter(function (x) { return x !== n; })).slice(0, 3);
      return mc('One number is in the wrong box. Which one?', String(n), others.map(function (x) { return [String(x), 'Check it: ' + x + ' is in the right box.']; }), { fig: carrollPic(c.nums, c.a, c.b, { move: [n, bad] }), hint: 'Check every number against its row and its column.',
        steps: [n + ' belongs in ' + low(boxName(right, c.a, c.b)) + '.'], explain: n + ' is in the wrong box.', meta: { k: 'g3dt-car-which', a: c.a, b: c.b, n: n, put: bad } });
    }],
    [2, 'more', function (lv) {
      var w = R.pick(['a', 'b']), c = carrollCase(lv, w), y = fitCount(c, w), nn = c.nums.length - y, big = y > nn, f = {};
      f[Math.max(y, nn)] = 'That is one row. How many more is it than the other row?';
      return num('Do more numbers fit <b>' + ATTR[c[w]] + '</b>, or not? How many more?', Math.abs(y - nn), f, { fig: carrollPic(c.nums, c.a, c.b), hint: 'Count each ' + (w === 'a' ? 'row' : 'column') + '. Then subtract.',
        steps: [ATTR[c[w]] + ': ' + y + '. ' + notL(ATTR[c[w]]) + ': ' + nn + '.', Math.max(y, nn) + ' &minus; ' + Math.min(y, nn) + ' = ' + Math.abs(y - nn) + '.'], explain: Math.abs(y - nn) + ' more ' + (big ? 'fit' : 'do not fit') + '.', meta: { k: 'g3dt-car-more', nums: c.nums, t: c[w] } });
    }],
    [2, 'tf', function (lv) {
      var c = sortCase(lv), n = newNum(c), real = boxOf(n, c.a, c.b), truth = coin(), said = truth ? real : R.pick(BOX.filter(function (k) { return k !== real; })), who = Q.name();
      return tf(who + ' says <b>' + n + '</b> goes in the box <b>' + low(boxName(said, c.a, c.b)) + '</b>. True or false?', truth, n + ' is ' + (TEST[c.a](n) ? '' : 'not ') + low(ATTR[c.a]) + ' and ' + (TEST[c.b](n) ? '' : 'not ') + low(ATTR[c.b]) + '.',
        ['Every number can go in two boxes.', 'Only the row matters.', 'Numbers go in order across the boxes.'], 'Check the row and the column.', { fig: carrollPic(c.nums, c.a, c.b), hint: 'Row, then column.', meta: { k: 'g3dt-car-tf', n: n, a: c.a, b: c.b, said: said } });
    }]
  ]);
  function tgCarroll(lv) {
    return function () {
      var c = sortCase(lv), n = newNum(c), k = boxOf(n, c.a, c.b), w = {};
      BOX.forEach(function (b) { if (b !== k) w['the box ' + boxName(b, c.a, c.b)] = 'Use the row and the column you found.'; });
      return { q: 'Where does <b>' + n + '</b> go?', fig: carrollPic(c.nums, c.a, c.b), done: n + ' goes in ' + low(boxName(k, c.a, c.b)) + '.', steps: [
        { prompt: 'The rows ask about ' + low(ATTR[c.a]) + '.', q: fixed('Which row?', [ATTR[c.a], notL(ATTR[c.a])], k[0] === 'y' ? 0 : 1, ['Check again: is ' + n + ' ' + low(ATTR[c.a]) + '?', 'Check again: is ' + n + ' ' + low(ATTR[c.a]) + '?'], { hint: 'Is ' + n + ' ' + low(ATTR[c.a]) + '?', meta: { k: 'g3dt-car-row', n: n, t: c.a } }) },
        { prompt: 'The columns ask about ' + low(ATTR[c.b]) + '.', q: fixed('Which column?', [ATTR[c.b], notL(ATTR[c.b])], k[1] === 'y' ? 0 : 1, ['Check again: is ' + n + ' ' + low(ATTR[c.b]) + '?', 'Check again: is ' + n + ' ' + low(ATTR[c.b]) + '?'], { hint: 'Is ' + n + ' ' + low(ATTR[c.b]) + '?', meta: { k: 'g3dt-car-row', n: n, t: c.b } }) },
        { prompt: 'Where that row meets that column.', q: { q: 'Tap the box.', type: 'tap', pic: carrollPic(c.nums, c.a, c.b, { hits: true }), answer: k, answerText: 'the box ' + boxName(k, c.a, c.b), wrong: w, hint: 'Row first, then column.', meta: { k: 'g3dt-car-tap', n: n, a: c.a, b: c.b } } }
      ] };
    };
  }

  /* ---------- Tree diagrams ---------- */
  function trayOf(lv) { var bs = []; for (var i = 0; i < (lv === 1 ? 8 : lv === 2 ? 10 : 14); i++) bs.push(R.pick(KINDS8)); return bs; }
  var TQ = { c: ['c', 'circles'], q: ['q', 'squares'], b: ['b', 'blue'], o: ['o', 'orange'], B: ['B', 'big'], s: ['s', 'small'] };
  function matches(k, want) { return want.split('').every(function (w) { return k.indexOf(w) >= 0; }); }
  function wantTxt(want) { var w = want.split(''), shape = w.filter(function (x) { return x === 'c' || x === 'q'; })[0], rest = w.filter(function (x) { return x !== shape; }).map(function (x) { return TQ[x][1]; }); return rest.concat([shape ? TQ[shape][1] : 'blocks']).join(' '); }
  function leafPath(k) { return (k[0] === 'c' ? 'circle' : 'square') + ', ' + (k[1] === 'b' ? 'blue' : 'orange') + ', ' + (k[2] === 'B' ? 'big' : 'small'); }
  skill('dt-tree', 'Tree diagrams', 'D1.1', [
    [1, 'plain', function () {
      var k = R.pick(KINDS8), w = {};
      KINDS8.forEach(function (x) { if (x !== k) w['the ' + bName(x, true)] = x[0] !== k[0] ? 'Start at the top: which shape is it?' : x[1] !== k[1] ? 'Then the colour: follow that branch.' : 'Last, the size: big or small?'; });
      return { q: 'Tap the leaf where this block goes. ' + A.svg(44, 44, blk(k, 22, 22), bName(k)), type: 'tap', pic: treePic({ hits: true }), answer: k, answerText: 'the ' + bName(k, true), wrong: w, hint: 'Shape first, then colour, then size.',
        steps: ['It is a ' + bName(k) + '.', 'Follow ' + leafPath(k) + '.'], explain: 'It goes with the ' + bName(k, true) + '.', meta: { k: 'g3dt-tree-tap', blk: k } };
    }],
    [1, 'count', function (lv) {
      var bs = trayOf(lv), k = R.pick(bs), t = bs.filter(function (x) { return x === k; }).length, f = {};
      f[bs.filter(function (x) { return x[0] === k[0] && x[1] === k[1]; }).length] = 'Check the size too: only the ' + (k[2] === 'B' ? 'big' : 'small') + ' ones.';
      return num('How many <b>' + bName(k, true) + '</b> are there?', t, f, { fig: trayPic(bs), hint: 'Check shape, colour and size for each block.', steps: ['Look for blocks that match all three.'], explain: G3.pl(t, bName(k), bName(k, true)) + '.', meta: { k: 'g3dt-tree-count', blocks: bs, leaf: k } });
    }],
    [1, 'sum', function (lv) {
      var bs = trayOf(lv), c = countBlocks(bs), want = lv === 1 ? R.pick(['cb', 'co', 'qb', 'qo', 'cB', 'qs']) : R.pick(['c', 'q', 'b', 'o', 'B', 's']), hit = KINDS8.filter(function (k) { return matches(k, want); });
      if (lv === 3) {
        var pr = R.pick([['c', 'q'], ['b', 'o'], ['B', 's']]), na = sum(KINDS8.filter(function (k) { return matches(k, pr[0]); }).map(function (k) { return c[k]; })), nb = sum(KINDS8.filter(function (k) { return matches(k, pr[1]); }).map(function (k) { return c[k]; }));
        if (na === nb) { bs.push(KINDS8.filter(function (k) { return matches(k, pr[0]); })[0]); c = countBlocks(bs); na++; }
        var hi = na > nb ? pr[0] : pr[1], lo = na > nb ? pr[1] : pr[0], f3 = {};
        f3[Math.max(na, nb)] = 'That is how many ' + wantTxt(hi) + '. How many more than ' + wantTxt(lo) + '?';
        return num('How many more <b>' + wantTxt(hi) + '</b> than <b>' + wantTxt(lo) + '</b>?', Math.abs(na - nb), f3, { fig: treePic({ counts: c }), hint: 'Add the leaves for each. Then subtract.',
          steps: [wantTxt(hi) + ': ' + Math.max(na, nb) + '. ' + wantTxt(lo) + ': ' + Math.min(na, nb) + '.', Math.max(na, nb) + ' &minus; ' + Math.min(na, nb) + ' = ' + Math.abs(na - nb) + '.'], explain: Math.abs(na - nb) + ' more.', meta: { k: 'g3dt-tree-more', counts: c, hi: hi, lo: lo } });
      }
      var t = sum(hit.map(function (k) { return c[k]; })), f = {};
      f[c[hit[0]]] = 'That is one leaf. Add every leaf that is ' + wantTxt(want) + '.';
      return num('How many blocks are <b>' + wantTxt(want) + '</b>?', t, f, { fig: treePic({ counts: c }), hint: 'Find every leaf that matches. Add them.', steps: [hit.map(function (k) { return c[k]; }).join(' + ') + ' = ' + t + '.'], explain: t + ' blocks.', meta: { k: 'g3dt-tree-sum', counts: c, want: want } });
    }],
    [2, 'fill', function (lv) {
      var bs = trayOf(lv), c = countBlocks(bs), hide = R.shuffle(KINDS8).slice(0, 2).sort(function (a, b) { return KINDS8.indexOf(a) - KINDS8.indexOf(b); });
      return { q: 'Sort the blocks. Fill in the missing counts in the tree.', type: 'fill', fig: trayPic(bs) + treePic({ counts: c, hide: hide }), fill: hide.map(function (k) { return cap1(bName(k, true)) + ': [[]]'; }).join('<br>'), answers: hide.map(function (k) { return c[k]; }),
        hint: 'Count the blocks that match all three.', steps: hide.map(function (k) { return cap1(bName(k, true)) + ': ' + c[k] + '.'; }), explain: 'All the counts add to ' + bs.length + '.', meta: { k: 'g3dt-tree-fill', blocks: bs, hide: hide } };
    }],
    [2, 'path', function () {
      var k = R.pick(KINDS8), W = KINDS8.filter(function (x) { return x !== k; }).map(function (x) { return [leafPath(x), 'Follow the branches from the top down to the ringed leaf.']; });
      return mc('Which path leads to the ringed leaf?', leafPath(k), R.shuffle(W), { fig: treePic({ mark: k }), hint: 'Start at All. Go down one branch at a time.', steps: ['Shape, then colour, then size.'], explain: leafPath(k) + '.', meta: { k: 'g3dt-tree-path', leaf: k } });
    }],
    [2, 'tf', function (lv) {
      var bs = trayOf(lv), k = R.pick(KINDS8), real = bs.filter(function (x) { return x === k; }).length, truth = coin(), said = truth ? real : real + R.pick([1, 2, -1].filter(function (d) { return real + d >= 0; })), who = Q.name();
      return tf(who + ' says there are <b>' + G3.pl(said, bName(k), bName(k, true)) + '</b>. True or false?', truth, 'There ' + (real === 1 ? 'is ' : 'are ') + G3.pl(real, bName(k), bName(k, true)) + '.',
        ['Count every ' + (k[0] === 'c' ? 'circle' : 'square') + ', any colour or size.', 'Count only the big blocks.', 'Every kind has the same number.'], 'Check shape, colour and size for each block.', { fig: trayPic(bs), hint: 'Match all three.', meta: { k: 'g3dt-tree-tf', blocks: bs, leaf: k, said: said } });
    }]
  ]);
  function cap1(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function tgTree(lv) {
    return function () {
      var k = R.pick(KINDS8), w = {};
      KINDS8.forEach(function (x) { if (x !== k) w['the ' + bName(x, true)] = 'Follow the three branches you chose.'; });
      function pick2(q, opts, at, attr) { return fixed(q, opts, at, opts.map(function () { return 'Look at the block again.'; }), { hint: 'Look at the block.', meta: { k: 'g3dt-tree-attr', blk: k, attr: attr } }); }
      return { q: 'Where does this block go? ' + A.svg(44, 44, blk(k, 22, 22), bName(k)), fig: treePic({}), done: 'It goes with the ' + bName(k, true) + '.', steps: [
        { prompt: 'The first branches split by shape.', q: pick2('Which shape?', ['Circle', 'Square'], k[0] === 'c' ? 0 : 1, 0) },
        { prompt: 'Then by colour.', q: pick2('Which colour?', ['Blue', 'Orange'], k[1] === 'b' ? 0 : 1, 1) },
        { prompt: 'Then by size: the last branch.', q: { q: 'Tap the leaf.', type: 'tap', pic: treePic({ hits: true }), answer: k, answerText: 'the ' + bName(k, true), wrong: w, hint: leafPath(k) + '.', meta: { k: 'g3dt-tree-tap', blk: k } } }
      ] };
    };
  }

  /* ======================= Lesson 2: Collecting data ======================= */
  /* [question, numbers or words, how you collect it] */
  var KQ = {
    1: [['What is your favourite season?', 'w', 'i'], ['How many pets do you have?', 'n', 'i'], ['What colour is each car that passes the school?', 'w', 'o'], ['How many birds visit the feeder in 10 minutes?', 'n', 'o'], ['How far does a paper airplane fly?', 'n', 'e'],
      ['What snack do you like best: bannock, apples or crackers?', 'w', 'i'], ['How many letters are in your name?', 'n', 'i'], ['What is the weather each morning this week?', 'w', 'o'], ['How long can you stand on one foot?', 'n', 'e'], ['How many cubes can you hold in one hand?', 'n', 'e']],
    3: [['What language do you speak at home?', 'w', 'i'], ['What kind of tree is in each yard on our street?', 'w', 'o'], ['How many seconds does an ice cube take to melt in the sun?', 'n', 'e'], ['How many times does a coin land on heads in 20 flips?', 'n', 'e'], ['How tall is each bean plant after 2 weeks?', 'n', 'o'],
      ['Which sport do you play in winter?', 'w', 'i'], ['What shape of leaf do the plants in the school garden have?', 'w', 'o'], ['How many jumps can you do in 30 seconds?', 'n', 'e'], ['How many people live in your home?', 'n', 'i'], ['Which ball rolls farthest down the ramp: tennis, golf or rubber?', 'w', 'e']]
  };
  KQ[2] = KQ[1].concat(KQ[3]);
  var KIND = { w: 'Words (qualitative)', n: 'Numbers (quantitative)' }, HOW = { i: 'Ask people (interview)', o: 'Watch (observation)', e: 'Test it (experiment)' };
  skill('dt-kinds', 'Kinds of data', 'D1.2', [
    [1, 'plain', function (lv) {
      var k = R.pick(KQ[lv]);
      return fixed('<b>' + k[0] + '</b> Will the answers be words or numbers?', [KIND.w, KIND.n], k[1] === 'w' ? 0 : 1, ['Think of one answer. Is it a number?', 'Think of one answer. Is it a word?'], { hint: 'Imagine one answer.', steps: ['One answer could be: ' + (k[1] === 'n' ? 'a number.' : 'a word.')], explain: KIND[k[1]] + '.', meta: { k: 'g3dt-kind-wn', q: k[0] } });
    }],
    [1, 'how', function (lv) {
      var k = R.pick(KQ[lv]), keys = ['i', 'o', 'e'];
      return fixed('<b>' + k[0] + '</b> How would you collect this data?', keys.map(function (x) { return HOW[x]; }), keys.indexOf(k[2]), ['Asking works when people know the answer.', 'Watching works when you can see it happen.', 'Testing works when you try something and measure.'], { hint: 'Do you ask, watch, or try something?', steps: [HOW[k[2]] + '.'], explain: HOW[k[2]] + '.', meta: { k: 'g3dt-kind-how', q: k[0] } });
    }],
    [2, 'match', function (lv) {
      var three = ['i', 'o', 'e'].map(function (m) { return R.pick(KQ[lv].filter(function (k) { return k[2] === m; })); });
      return { q: 'Match each question to the best way to collect the data.', type: 'match', pairs: three.map(function (k) { return [k[0], HOW[k[2]]]; }), hint: 'Ask people, watch, or test it.', steps: ['People know their favourites: ask them.'], explain: three.map(function (k) { return HOW[k[2]]; }).join('; ') + '.', meta: { k: 'g3dt-kind-match' } };
    }],
    [2, 'pick', function (lv) {
      var want = R.pick(['n', 'w']), ks, ans = [];
      do { ks = R.shuffle(KQ[lv]).slice(0, 5); } while (ks.every(function (k) { return k[1] === ks[0][1]; }));
      ks.forEach(function (k, j) { if (k[1] === want) ans.push(j); });
      return { q: 'Pick every question whose answers are <b>' + (want === 'n' ? 'numbers' : 'words') + '</b>.', type: 'pick', options: ks.map(function (k) { return k[0]; }), answer: ans, hint: 'Imagine one answer to each.', steps: ['Counting or measuring gives numbers.'], explain: ans.length + ' of them.', meta: { k: 'g3dt-kind-pick', want: want } };
    }],
    [1, 'tf', function (lv) {
      var k = R.pick(KQ[lv]), truth = coin(), said = truth ? k[1] : (k[1] === 'n' ? 'w' : 'n'), who = Q.name();
      return tf(who + ' says the answers to <b>' + k[0] + '</b> will be <b>' + (said === 'n' ? 'numbers' : 'words') + '</b>. True or false?', truth, 'One answer could be ' + (k[1] === 'n' ? 'a number.' : 'a word.'),
        ['Every question has number answers.', 'Long questions have word answers.', 'Answers are always words.'], 'Imagine one answer.', { hint: 'Imagine one answer.', meta: { k: 'g3dt-kind-tf', q: k[0], said: said } });
    }]
  ]);
  function tgKinds(lv) {
    return function () {
      var k = R.pick(KQ[lv]), keys = ['i', 'o', 'e'];
      return { q: '<b>' + k[0] + '</b>', done: KIND[k[1]] + '. ' + HOW[k[2]] + '.', steps: [
        { prompt: 'Imagine one answer.', q: fixed('Words or numbers?', [KIND.w, KIND.n], k[1] === 'w' ? 0 : 1, ['Is one answer a number?', 'Is one answer a word?'], { hint: 'Counting or measuring gives numbers.', meta: { k: 'g3dt-kind-wn', q: k[0] } }) },
        { prompt: 'Do you ask, watch, or try something?', q: fixed('How would you collect it?', keys.map(function (x) { return HOW[x]; }), keys.indexOf(k[2]), ['People know the answer to this?', 'Can you see it happen?', 'Do you try something and measure?'], { hint: 'Think about where the answer comes from.', meta: { k: 'g3dt-kind-how', q: k[0] } }) }
      ] };
    };
  }

  /* ---------- Tally marks and frequency tables ---------- */
  var SETS = [
    { t: 'Favourite season', src: 'Room 4 survey', d: ['Winter', 'Spring', 'Summer', 'Fall'] },
    { t: 'Favourite sport', src: 'Room 12 survey', d: ['Hockey', 'Soccer', 'Lacrosse', 'Swim'] },
    { t: 'Favourite fruit', src: 'Grade 3 survey', d: ['Apple', 'Banana', 'Grapes', 'Pear'] },
    { t: 'Pets at home', src: 'Class interviews', d: ['Dog', 'Cat', 'Fish', 'None'] },
    { t: 'Way to school', src: 'Hallway survey', d: ['Walk', 'Bus', 'Car', 'Bike'] },
    { t: 'Favourite snack', src: 'Room 9 survey', d: ['Bannock', 'Apples', 'Yogurt', 'Crackers'] }
  ];
  /* rows of [name, count] with different counts from lo to hi, each a multiple of m */
  function dataRows(n, lo, hi, m) {
    var set = R.pick(SETS), names = R.shuffle(set.d).slice(0, n), used = {}, rows = [];
    names.forEach(function (nm) { var v, g = 0; do { v = R.int(Math.ceil(lo / m), Math.floor(hi / m)) * m; } while (used[v] && g++ < 30); used[v] = 1; rows.push([nm, v]); });
    return { t: set.t, src: set.src, rows: rows };
  }
  function twoOf(rows) { var p = R.shuffle(rows.slice()).slice(0, 2); return p[0][1] > p[1][1] ? p : [p[1], p[0]]; }
  var TL = { 1: [3, 15], 2: [10, 30], 3: [20, 48] };
  skill('dt-tally', 'Tally marks and tables', 'D1.2, D1.5', [
    [1, 'plain', function (lv) {
      var n = R.int(TL[lv][0], TL[lv][1]), f = {};
      f[n - Math.floor(n / 5)] = 'The slanted mark counts too: each group is 5.';
      return num('How many does this tally show?', n, f, { fig: tallyPic(n), hint: 'Count by 5s for the groups. Then count on by 1s.', steps: [Math.floor(n / 5) + ' groups of 5 = ' + 5 * Math.floor(n / 5) + '.', (n % 5 ? 'Then ' + n % 5 + ' more: ' : '') + n + '.'], explain: n + '.', meta: { k: 'g3dt-tal-read', n: n } });
    }],
    [1, 'fill', function (lv) {
      var d = dataRows(lv === 1 ? 3 : 4, TL[lv][0], TL[lv][1], 1);
      return { q: d.t + ': fill in the count for each tally.', type: 'fill', fig: freqTable(d.rows, 'tally'), fill: d.rows.map(function (r) { return r[0] + ': [[]]'; }).join('<br>'), answers: d.rows.map(function (r) { return r[1]; }),
        hint: 'Count each tally by 5s, then 1s.', steps: d.rows.map(function (r) { return r[0] + ': ' + r[1] + '.'; }), explain: d.rows.map(function (r) { return r[1]; }).join(', ') + '.', meta: { k: 'g3dt-tal-fill', rows: d.rows } };
    }],
    [1, 'total', function (lv) {
      var d = dataRows(lv === 1 ? 3 : 4, TL[lv][0], TL[lv][1], 1), t = sum(d.rows.map(function (r) { return r[1]; })), f = {};
      f[d.rows.length] = 'That is the number of rows. Add the counts.';
      return num(d.t + ': how many votes in all?', t, f, { fig: freqTable(d.rows, lv === 1 ? 'both' : 'tally'), hint: 'Find each count, then add them.', steps: [d.rows.map(function (r) { return r[1]; }).join(' + ') + ' = ' + t + '.'], explain: t + ' votes.', meta: { k: 'g3dt-tal-total', rows: d.rows } });
    }],
    [1, 'diff', function (lv) {
      var d = dataRows(lv === 1 ? 3 : 4, TL[lv][0], TL[lv][1], 1), p = twoOf(d.rows), f = {};
      f[p[0][1]] = 'That is how many chose ' + p[0][0] + '. Compare it with ' + p[1][0] + '.'; f[p[0][1] + p[1][1]] = 'Not together: how many more?';
      return num(d.t + ': how many more chose <b>' + p[0][0] + '</b> than <b>' + p[1][0] + '</b>?', p[0][1] - p[1][1], f, { fig: freqTable(d.rows, lv === 3 ? 'tally' : 'both'), hint: 'Subtract the smaller count from the bigger one.', steps: [p[0][1] + ' &minus; ' + p[1][1] + ' = ' + (p[0][1] - p[1][1]) + '.'], explain: (p[0][1] - p[1][1]) + ' more.', meta: { k: 'g3dt-tal-diff', rows: d.rows, a: p[0][0], b: p[1][0] } });
    }],
    [2, 'tap', function (lv) {
      var n = R.int(TL[lv][0] + 1, TL[lv][1]), set = R.shuffle([n, n + 1, n - 1, n + 5 <= 50 ? n + 5 : n - 5].filter(function (x, i, a) { return a.indexOf(x) === i; })), w = {};
      set.forEach(function (x, i) { if (x !== n) w[String(i)] = 'Count again: that tally shows ' + x + '.'; });
      return { q: 'Tap the tally that shows <b>' + n + '</b>.', type: 'tap', tiles: set.map(tallyPic), answer: set.indexOf(n), answerText: 'the tally of ' + n, wrong: w, hint: n + ' is ' + Math.floor(n / 5) + ' groups of 5' + (n % 5 ? ' and ' + n % 5 + ' more' : '') + '.',
        steps: [Math.floor(n / 5) + ' groups, then ' + n % 5 + ' more.'], explain: 'The tally of ' + n + '.', meta: { k: 'g3dt-tal-tap', set: set, n: n } };
    }],
    [2, 'tf', function (lv) {
      var n = R.int(TL[lv][0], TL[lv][1]), truth = coin(), said = truth ? n : n + R.pick([1, -1, 5, -Math.floor(n / 5)]), who = Q.name();
      if (!truth && said === n) said = n + 1;
      return tf(who + ' says this tally shows <b>' + said + '</b>. True or false?', truth, Math.floor(n / 5) + ' groups of 5 and ' + n % 5 + ' more: ' + n + '.', ['A group of tally marks is 4.', 'Count only the straight marks.', 'Each group is 10.'], 'Count by 5s, then 1s.', { fig: tallyPic(n), hint: 'Count by 5s, then 1s.', meta: { k: 'g3dt-tal-tf', said: said } });
    }]
  ]);
  function tgTally(lv) {
    return function () {
      var n = R.int(TL[lv][0] + 5, TL[lv][1]), g = Math.floor(n / 5), f1 = {};
      f1[5 * g] = 'That is the number of marks in the groups. How many groups?';
      return { q: 'How many does this tally show?', fig: tallyPic(n), done: g + ' groups of 5 and ' + n % 5 + ' more: ' + n + '.', steps: [
        { prompt: 'Find the groups: 4 marks with a slant across.', q: num('How many groups of 5?', g, f1, { hint: 'Count the slanted marks.', meta: { k: 'g3dt-tal-groups', n: n } }) },
        { prompt: 'Count the groups by 5s.', q: num('How many in the groups?', 5 * g, {}, { hint: 'Count by 5s: ' + g + ' times.', meta: { k: 'g3dt-tal-fives', g: g } }) },
        { prompt: 'Count on the marks left over.', q: num('How many in all?', n, {}, { hint: 5 * g + ', then count on.', meta: { k: 'g3dt-tal-read', n: n } }) }
      ] };
    };
  }

  /* ======================= Lesson 3: Graphs ======================= */
  var PK = { 1: [[2, false]], 2: [[2, true], [5, false]], 3: [[10, true], [5, false]] };
  function pictoCase(lv) {
    var pk = R.pick(PK[lv]), key = pk[0], m = pk[1] ? key / 2 : key, d = dataRows(lv === 1 ? 3 : 4, m, key * 8, m);
    return { key: key, t: d.t, src: d.src, rows: d.rows };
  }
  function pictoFix(c, r) { var f = {}, pics = Math.ceil(r[1] / c.key); if (pics * c.key !== pics) f[pics] = 'That is the number of pictures. Each one means ' + c.key + '.'; return f; }
  skill('dt-picto', 'Pictographs', 'D1.3, D1.5', [
    [1, 'plain', function (lv) {
      var c = pictoCase(lv), r = R.pick(c.rows);
      return num(c.t + ': how many chose <b>' + r[0] + '</b>?', r[1], pictoFix(c, r), { fig: pictoPic(c.t, c.rows, c.key, { src: c.src }), hint: 'Each picture means ' + c.key + '. Count by ' + c.key + 's.' + (c.key % 2 === 0 ? ' Half a picture is ' + c.key / 2 + '.' : ''),
        steps: [Math.floor(r[1] / c.key) + ' pictures &times; ' + c.key + ' = ' + Math.floor(r[1] / c.key) * c.key + '.', r[1] % c.key ? 'Half a picture: + ' + c.key / 2 + ' = ' + r[1] + '.' : r[1] + ' votes.'], explain: r[1] + ' votes.', meta: { k: 'g3dt-pic-read', rows: c.rows, key: c.key, name: r[0] } });
    }],
    [1, 'fill', function (lv) {
      var c = pictoCase(lv);
      return { q: 'Read the pictograph. Fill in the counts.', type: 'fill', fig: pictoPic(c.t, c.rows, c.key, { src: c.src }), fill: c.rows.map(function (r) { return r[0] + ': [[]]'; }).join('<br>'), answers: c.rows.map(function (r) { return r[1]; }),
        hint: 'Count by ' + c.key + 's along each row.', steps: c.rows.map(function (r) { return r[0] + ': ' + r[1] + '.'; }), explain: c.rows.map(function (r) { return r[1]; }).join(', ') + '.', meta: { k: 'g3dt-pic-fill', rows: c.rows, key: c.key } };
    }],
    [1, 'total', function (lv) {
      var c = pictoCase(lv), t = sum(c.rows.map(function (r) { return r[1]; })), f = {};
      f[sum(c.rows.map(function (r) { return Math.ceil(r[1] / c.key); }))] = 'That is the number of pictures. Each one means ' + c.key + '.';
      return num(c.t + ': how many votes in all?', t, f, { fig: pictoPic(c.t, c.rows, c.key, { src: c.src }), hint: 'Find each row first. Then add.', steps: [c.rows.map(function (r) { return r[1]; }).join(' + ') + ' = ' + t + '.'], explain: t + ' votes.', meta: { k: 'g3dt-pic-total', rows: c.rows, key: c.key } });
    }],
    [1, 'diff', function (lv) {
      var c = pictoCase(lv), p = twoOf(c.rows), f = {};
      f[Math.ceil(p[0][1] / c.key) - Math.ceil(p[1][1] / c.key)] = 'That is how many more pictures. Each one means ' + c.key + '.';
      return num(c.t + ': how many more chose <b>' + p[0][0] + '</b> than <b>' + p[1][0] + '</b>?', p[0][1] - p[1][1], f, { fig: pictoPic(c.t, c.rows, c.key, { src: c.src }), hint: 'Find both counts. Subtract.', steps: [p[0][0] + ': ' + p[0][1] + '. ' + p[1][0] + ': ' + p[1][1] + '.', p[0][1] + ' &minus; ' + p[1][1] + ' = ' + (p[0][1] - p[1][1]) + '.'], explain: (p[0][1] - p[1][1]) + ' more.', meta: { k: 'g3dt-pic-diff', rows: c.rows, key: c.key, a: p[0][0], b: p[1][0] } });
    }],
    [2, 'tf', function (lv) {
      var c = pictoCase(lv), r = R.pick(c.rows), truth = coin(), said = truth ? r[1] : R.pick([Math.ceil(r[1] / c.key), r[1] + c.key, r[1] - c.key].filter(function (x) { return x > 0 && x !== r[1]; })), who = Q.name();
      return tf(who + ' says <b>' + said + '</b> chose ' + r[0] + '. True or false?', truth, 'Each picture means ' + c.key + ': ' + r[0] + ' has ' + r[1] + '.', ['Each picture means 1.', 'Count the rows, not the pictures.', 'Half a picture means 1.'], 'Read the key first.', { fig: pictoPic(c.t, c.rows, c.key, { src: c.src }), hint: 'Each picture means ' + c.key + '.', meta: { k: 'g3dt-pic-tf', rows: c.rows, key: c.key, name: r[0], said: said } });
    }],
    [2, 'order', function (lv) {
      var c = pictoCase(lv), items = c.rows.slice().sort(function (a, b) { return b[1] - a[1]; }).map(function (r) { return r[0]; });
      return { q: 'Put the choices in order from <b>most</b> votes to <b>fewest</b>.', type: 'order', items: items, first: 'most', last: 'fewest', fig: pictoPic(c.t, c.rows, c.key, { src: c.src }), hint: 'Longer rows have more votes.', steps: ['Compare the rows.'], explain: items.join(', ') + '.', meta: { k: 'g3dt-pic-order', rows: c.rows, key: c.key } };
    }]
  ]);
  function tgPicto(lv) {
    return function () {
      var c = pictoCase(lv), r = c.rows.filter(function (x) { return x[1] % c.key; })[0] || R.pick(c.rows), full = Math.floor(r[1] / c.key), f = {};
      f[full] = 'That is the number of pictures. Read the key.';
      var steps = [
        { prompt: 'Read the key at the bottom.', q: num('Each picture means how many votes?', c.key, {}, { hint: 'Look under the graph.', meta: { k: 'g3dt-pic-key', rows: c.rows, key: c.key } }) },
        { prompt: 'Count the whole pictures for ' + r[0] + ' by ' + c.key + 's.', q: num('How many votes do the whole pictures show?', full * c.key, f, { hint: full + ' pictures, ' + c.key + ' each.', meta: { k: 'g3dt-pic-whole', rows: c.rows, key: c.key, name: r[0] } }) }
      ];
      if (r[1] % c.key) steps.push({ prompt: 'Half a picture is half of ' + c.key + '.', q: num('So how many chose ' + r[0] + '?', r[1], {}, { hint: full * c.key + ' + ' + c.key / 2 + '.', meta: { k: 'g3dt-pic-read', rows: c.rows, key: c.key, name: r[0] } }) });
      return { q: c.t + ': how many chose <b>' + r[0] + '</b>?', fig: pictoPic(c.t, c.rows, c.key, { src: c.src }), done: r[0] + ': ' + r[1] + ' votes.', steps: steps };
    };
  }

  /* ---------- Bar graphs ---------- */
  var BS = { 1: [[1, 1, 10], [2, 2, 20]], 2: [[2, 1, 20], [5, 5, 50]], 3: [[5, 5, 50], [10, 5, 100]] };
  function barCase(lv, n) { var b = R.pick(BS[lv]), d = dataRows(n || (lv === 1 ? 3 : 4), b[1], b[2], b[1]); return { step: b[0], t: d.t, src: d.src, rows: d.rows }; }
  function barFig(c, o) { return barPic(c.t, c.rows, c.step, put({ src: c.src }, o || {})); }
  skill('dt-bar', 'Bar graphs', 'D1.3, D1.5', [
    [1, 'plain', function (lv) {
      var c = barCase(lv), r = R.pick(c.rows), f = {};
      if (c.step > 1) f[r[1] / c.step] = 'That is the number of lines. The scale counts by ' + c.step + '.';
      return num(c.t + ': how many chose <b>' + r[0] + '</b>?', r[1], f, { fig: barFig(c), hint: 'Read across from the top of the bar. The scale counts by ' + c.step + '.', steps: ['The scale counts by ' + c.step + '.', 'The bar for ' + r[0] + ' reaches ' + r[1] + '.'], explain: r[1] + ' votes.', meta: { k: 'g3dt-bar-read', rows: c.rows, step: c.step, name: r[0] } });
    }],
    [1, 'diff', function (lv) {
      var c = barCase(lv), p = twoOf(c.rows), f = {};
      f[p[0][1]] = 'That is ' + p[0][0] + ' alone. How many more than ' + p[1][0] + '?';
      return num(c.t + ': how many more chose <b>' + p[0][0] + '</b> than <b>' + p[1][0] + '</b>?', p[0][1] - p[1][1], f, { fig: barFig(c), hint: 'Read both bars. Subtract.', steps: [p[0][0] + ': ' + p[0][1] + '. ' + p[1][0] + ': ' + p[1][1] + '.', p[0][1] + ' &minus; ' + p[1][1] + ' = ' + (p[0][1] - p[1][1]) + '.'], explain: (p[0][1] - p[1][1]) + ' more.', meta: { k: 'g3dt-bar-diff', rows: c.rows, step: c.step, a: p[0][0], b: p[1][0] } });
    }],
    [1, 'total', function (lv) {
      var c = barCase(lv), t = sum(c.rows.map(function (r) { return r[1]; }));
      return num(c.t + ': how many votes in all?', t, {}, { fig: barFig(c), hint: 'Read each bar. Then add.', steps: [c.rows.map(function (r) { return r[1]; }).join(' + ') + ' = ' + t + '.'], explain: t + ' votes.', meta: { k: 'g3dt-bar-total', rows: c.rows, step: c.step } });
    }],
    [2, 'match', function (lv) {
      var c = barCase(lv, 3);
      return { q: 'Match each choice to its number of votes.', type: 'match', pairs: c.rows.map(function (r) { return [r[0], String(r[1])]; }), fig: barFig(c), hint: 'Read across from the top of each bar.', steps: ['The scale counts by ' + c.step + '.'], explain: c.rows.map(function (r) { return r[0] + ' ' + r[1]; }).join(', ') + '.', meta: { k: 'g3dt-bar-match', rows: c.rows, step: c.step } };
    }],
    [2, 'tf', function (lv) {
      var c = barCase(lv), p = twoOf(c.rows), real = p[0][1] - p[1][1], truth = coin(), said = truth ? real : R.pick([real + c.step, p[0][1], real > c.step ? real - c.step : real + 2 * c.step]), who = Q.name();
      if (!truth && said === real) said = real + c.step;
      return tf(who + ' says <b>' + said + '</b> more chose ' + p[0][0] + ' than ' + p[1][0] + '. True or false?', truth, p[0][1] + ' &minus; ' + p[1][1] + ' = ' + real + '.', ['Count the lines between the bars, not the votes.', 'The taller bar has 1 more.', 'Read only the taller bar.'], 'Read both bars, then subtract.', { fig: barFig(c), hint: 'Read both bars.', meta: { k: 'g3dt-bar-tf', rows: c.rows, step: c.step, a: p[0][0], b: p[1][0], said: said } });
    }],
    [1, 'scale', function (lv) {
      var c = barCase(lv), S = [1, 2, 5, 10];
      return fixed('What does the scale on this graph count by?', S.map(function (x) { return 'By ' + x + 's'; }), S.indexOf(c.step), S.map(function () { return 'Read the numbers up the side: how far apart are they?'; }), { fig: barFig(c), hint: 'Look at the numbers up the side.', steps: ['0, ' + c.step + ', ' + 2 * c.step + ', &hellip;'], explain: 'By ' + c.step + 's.', meta: { k: 'g3dt-bar-scale', rows: c.rows, step: c.step } });
    }]
  ]);
  function tgBar(lv) {
    return function () {
      var c = barCase(lv), r = R.pick(c.rows), f = {};
      if (c.step > 1) f[r[1] / c.step] = 'That is the number of lines. Each line is ' + c.step + '.';
      return { q: c.t + ': how many chose <b>' + r[0] + '</b>?', fig: barFig(c), done: r[0] + ': ' + r[1] + ' votes.', steps: [
        { prompt: 'Read the numbers up the side.', q: num('The scale counts by what number?', c.step, {}, { hint: '0, then the next number up.', meta: { k: 'g3dt-bar-step', rows: c.rows, step: c.step } }) },
        { prompt: 'Run your finger from the top of the bar to the side.', q: num('How many chose ' + r[0] + '?', r[1], f, { hint: 'Count by ' + c.step + 's up to the top of the bar.', meta: { k: 'g3dt-bar-read', rows: c.rows, step: c.step, name: r[0] } }) }
      ] };
    };
  }

  /* ---------- Make a graph ---------- */
  var SCALES = [1, 2, 5, 10];
  function keyPic(key) { return A.svg(200, 36, '<circle cx="18" cy="18" r="12" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/><text x="38" y="24" font-size="17">= ' + G3.pl(key, 'vote') + '</text>', 'Key: each picture means ' + key); }
  /* the smallest scale that needs no more than 10 lines */
  function bestStep(max) { return max <= 10 ? 1 : max <= 20 ? 2 : max <= 50 ? 5 : 10; }
  var PARTS = { title: 'A title', src: 'A source', label: 'A label up the side' };
  skill('dt-make', 'Make a graph', 'D1.3', [
    [1, 'plain', function (lv) {
      var key = lv === 1 ? 2 : lv === 2 ? R.pick([5, 10]) : R.pick([10, 25]), v = key * R.int(lv === 3 ? 4 : 2, 9), f = {};
      f[v] = 'That would be 1 vote for each picture. Each picture means ' + key + '.';
      return num('Each picture means <b>' + key + '</b> votes. How many pictures show <b>' + v + '</b> votes?', v / key, f, { fig: keyPic(key), hint: 'How many ' + key + 's make ' + v + '?', steps: [v + ' &divide; ' + key + ' = ' + v / key + '.'], explain: v / key + ' pictures.', meta: { k: 'g3dt-mk-key', key: key, v: v } });
    }],
    [1, 'scale', function (lv) {
      var max = lv === 1 ? R.int(6, 18) : lv === 2 ? R.int(12, 45) : R.int(30, 95), b = bestStep(max);
      return fixed('The biggest count is <b>' + max + '</b>. Which scale fits best on the graph?', SCALES.map(function (s) { return 'Count by ' + s + 's'; }), SCALES.indexOf(b), SCALES.map(function (s) { return s < b ? 'Too many lines: ' + max + ' would need ' + Math.ceil(max / s) + ' lines.' : 'Too few lines: the bars would be hard to read.'; }),
        { hint: 'Pick the smallest scale that needs 10 lines or fewer.', steps: ['By ' + b + 's: ' + Math.ceil(max / b) + ' lines.'], explain: 'Count by ' + b + 's.', meta: { k: 'g3dt-mk-scale', max: max } });
    }],
    [1, 'missing', function (lv) {
      var c = barCase(lv), miss = R.pick(['title', 'src', 'label']), keys = ['title', 'src', 'label'];
      return fixed('What is this graph missing?', keys.map(function (k) { return PARTS[k]; }), keys.indexOf(miss), keys.map(function (k) { return 'Look again: the graph has ' + low(PARTS[k]) + '.'; }), { fig: barFig(c, { noTitle: miss === 'title', noSource: miss === 'src', noLabel: miss === 'label' }), hint: 'A graph needs a title, labels and a source.', steps: ['Check: title, label up the side, source.'], explain: PARTS[miss] + '.', meta: { k: 'g3dt-mk-miss', miss: miss } });
    }],
    [1, 'count', function (lv) {
      var key = lv === 1 ? 2 : lv === 2 ? R.pick([2, 5]) : R.pick([5, 10]), d = dataRows(lv === 1 ? 2 : 3, key, key * 9, key), t = sum(d.rows.map(function (r) { return r[1] / key; })), f = {};
      f[sum(d.rows.map(function (r) { return r[1]; }))] = 'That is the number of votes. Each picture means ' + key + '.';
      return num('Each picture will mean <b>' + key + '</b> votes. How many pictures do you draw in all?', t, f, { fig: freqTable(d.rows, 'count') + keyPic(key), hint: 'Find the pictures for each row. Then add.', steps: [d.rows.map(function (r) { return r[1] + ' &divide; ' + key + ' = ' + r[1] / key; }).join('. ') + '.', d.rows.map(function (r) { return r[1] / key; }).join(' + ') + ' = ' + t + '.'], explain: t + ' pictures.', meta: { k: 'g3dt-mk-count', key: key, rows: d.rows } });
    }],
    [2, 'tap', function (lv) {
      var c = barCase(lv), i = R.int(0, c.rows.length - 1), bad = c.rows[i][1] + R.pick([1, -1]) * c.step * R.int(1, 2), w = {};
      if (bad <= 0) bad = c.rows[i][1] + c.step;
      c.rows.forEach(function (r, j) { if (j !== i) w['the bar for ' + r[0]] = 'That bar matches the table: ' + r[1] + '.'; });
      return { q: 'One bar does not match the table. Tap it.' + freqTable(c.rows, 'count'), type: 'tap', pic: barFig(c, { hits: true, wrong: [i, bad] }), answer: String(i), answerText: 'the bar for ' + c.rows[i][0], wrong: w, hint: 'Read each bar. Compare it with the table.',
        steps: [c.rows[i][0] + ' should be ' + c.rows[i][1] + ', but the bar shows ' + bad + '.'], explain: 'The bar for ' + c.rows[i][0] + '.', meta: { k: 'g3dt-mk-tap', rows: c.rows, i: i, bad: bad } };
    }],
    [1, 'lines', function (lv) {
      var s = lv === 1 ? 2 : lv === 2 ? R.pick([2, 5]) : R.pick([5, 10]), v = s * R.int(3, 10), f = {};
      f[v] = 'That is the number of votes. Each line is ' + s + '.';
      return num('The scale counts by <b>' + s + '</b>s. ' + R.pick(SETS).d[0] + ' has <b>' + v + '</b> votes. How many lines up should the bar reach?', v / s, f, { hint: 'Count by ' + s + 's to ' + v + '.', steps: [v + ' &divide; ' + s + ' = ' + v / s + '.'], explain: v / s + ' lines up.', meta: { k: 'g3dt-mk-lines', s: s, v: v } });
    }],
    [2, 'fill', function (lv) {
      var key = lv === 2 ? R.pick([2, 5]) : R.pick([5, 10]), d = dataRows(3, key, key * 9, key);
      return { q: 'Make a pictograph where each picture means <b>' + key + '</b>. How many pictures in each row?', type: 'fill', fig: freqTable(d.rows, 'count'), fill: d.rows.map(function (r) { return r[0] + ': [[]] pictures'; }).join('<br>'), answers: d.rows.map(function (r) { return r[1] / key; }),
        hint: 'How many ' + key + 's make each count?', steps: d.rows.map(function (r) { return r[1] + ' &divide; ' + key + ' = ' + r[1] / key + '.'; }), explain: d.rows.map(function (r) { return r[1] / key; }).join(', ') + ' pictures.', meta: { k: 'g3dt-mk-fill', key: key, rows: d.rows } };
    }]
  ]);
  function tgMake(lv) {
    return function () {
      var max = lv === 1 ? R.int(12, 18) : lv === 2 ? R.int(25, 45) : R.int(55, 95), b = bestStep(max), d = dataRows(3, Math.max(1, Math.floor(max / 3)), max, 1);
      d.rows[R.int(0, 2)][1] = max;
      d.rows.forEach(function (r, i) { if (r[1] === max && d.rows.indexOf(r) !== i) r[1]--; });
      return { q: 'Plan a bar graph for this table.' + freqTable(d.rows, 'count'), done: 'Count by ' + b + 's: ' + Math.ceil(max / b) + ' lines. Add a title, labels and the source.', steps: [
        { prompt: 'Find the biggest count.', q: num('What is the biggest count in the table?', Math.max.apply(null, d.rows.map(function (r) { return r[1]; })), {}, { hint: 'Compare all three.', meta: { k: 'g3dt-mk-max', rows: d.rows } }) },
        { prompt: 'Pick the smallest scale that needs 10 lines or fewer.', q: fixed('Which scale fits best?', SCALES.map(function (s) { return 'Count by ' + s + 's'; }), SCALES.indexOf(b), SCALES.map(function (s) { return s < b ? 'Too many lines.' : 'Too few lines.'; }), { hint: max + ' &divide; each scale.', meta: { k: 'g3dt-mk-scale', max: max } }) },
        { prompt: 'Every graph also needs these.', q: mc('What else must the graph have?', 'A title, labels and a source', [['Bright colours', 'Colours are nice, but not needed.'], ['A picture of each person', 'Each bar shows a count, not people.']], { hint: 'Someone else must be able to read it.', meta: { k: 'g3dt-mk-parts' } }) }
      ] };
    };
  }

  /* ---------- Use the data ---------- */
  function decCase(lv) { return barCase(lv, lv === 1 ? 3 : 4); }
  skill('dt-decide', 'Answer questions with data', 'D1.5', [
    [1, 'plain', function (lv) {
      var c = decCase(lv), p = R.shuffle(c.rows.slice()), a = p[0], b = p[1], z = p[2], t = a[1] + b[1] - z[1], f = {};
      if (t <= 0) { var tmp = z; z = a; a = tmp; t = a[1] + b[1] - z[1]; }
      f[a[1] + b[1]] = 'That is ' + a[0] + ' and ' + b[0] + ' together. Now compare with ' + z[0] + '.';
      return num(c.t + ': how many more chose <b>' + a[0] + ' or ' + b[0] + '</b> than <b>' + z[0] + '</b>?', t, f, { fig: barFig(c), hint: 'Add the first two bars. Then subtract the third.', steps: [a[1] + ' + ' + b[1] + ' = ' + (a[1] + b[1]) + '.', (a[1] + b[1]) + ' &minus; ' + z[1] + ' = ' + t + '.'], explain: t + ' more.', meta: { k: 'g3dt-dec-two', rows: c.rows, a: a[0], b: b[0], z: z[0] } });
    }],
    [1, 'compare', function (lv) {
      var s1 = R.pick(BS[lv]), s2 = R.pick(BS[lv].filter(function (x) { return x !== s1; }).concat([s1])), d1 = dataRows(3, s1[1], s1[2], s1[1]), set = d1.rows.map(function (r) { return r[0]; }), nm = R.pick(set), v2, rows2;
      do { rows2 = set.map(function (n) { return [n, R.int(Math.ceil(s2[1] / s2[1]), Math.floor(s2[2] / s2[1])) * s2[1]]; }); v2 = rows2.filter(function (r) { return r[0] === nm; })[0][1]; } while (v2 === d1.rows.filter(function (r) { return r[0] === nm; })[0][1] && coin());
      var v1 = d1.rows.filter(function (r) { return r[0] === nm; })[0][1], ans = v1 > v2 ? 0 : v1 < v2 ? 1 : 2;
      return fixed('Which room had more votes for <b>' + nm + '</b>?', ['Room 5', 'Room 6', 'The same'], ans, ['Read the numbers: the scales are not the same.', 'Read the numbers: the scales are not the same.', 'Read both bars: are they really equal?'],
        { fig: barPic('Room 5', d1.rows, s1[0]) + barPic('Room 6', rows2, s2[0]), hint: 'Do not just compare heights. Read each scale.', steps: ['Room 5: ' + v1 + '. Room 6: ' + v2 + '.'], explain: ans === 2 ? 'Both had ' + v1 + '.' : (ans ? 'Room 6' : 'Room 5') + ' had more.', meta: { k: 'g3dt-dec-cmp', v1: v1, v2: v2 } });
    }],
    [2, 'both', function (lv) {
      var c = decCase(lv), d2 = c.rows.map(function (r) { return [r[0], Math.max(c.step, r[1] + R.pick([-2, -1, 1, 2]) * c.step)]; }), r = R.int(0, c.rows.length - 1), t = c.rows[r][1] + d2[r][1], f = {};
      f[c.rows[r][1]] = 'That is only Room 5. Add Room 6 too.';
      return num('How many votes for <b>' + c.rows[r][0] + '</b> in both rooms together?', t, f, { fig: barPic('Room 5', c.rows, c.step) + barPic('Room 6', d2, c.step), hint: 'Read the ' + c.rows[r][0] + ' bar on each graph. Add.', steps: ['Room 5: ' + c.rows[r][1] + '. Room 6: ' + d2[r][1] + '.', c.rows[r][1] + ' + ' + d2[r][1] + ' = ' + t + '.'], explain: t + ' votes.', meta: { k: 'g3dt-dec-both', v1: c.rows[r][1], v2: d2[r][1] } });
    }],
    [2, 'half', function (lv) {
      var c = decCase(lv), r = R.pick(c.rows), tot = sum(c.rows.map(function (x) { return x[1]; })), truth = 2 * r[1] > tot, who = Q.name();
      if (coin() !== truth) { var big = c.rows.indexOf(r); c.rows[big] = [r[0], truth ? Math.max(c.step, r[1] - 3 * c.step) : r[1] + (tot - 2 * r[1] + 2 * c.step)]; r = c.rows[big]; tot = sum(c.rows.map(function (x) { return x[1]; })); truth = 2 * r[1] > tot; }
      return tf(who + ' says more than half of the votes were for <b>' + r[0] + '</b>. True or false?', truth, r[0] + ' has ' + r[1] + ' of ' + tot + ' votes. Half of ' + tot + ' is ' + tot / 2 + '.', ['The tallest bar always has more than half.', 'Half means 10 votes.', 'You cannot tell from a graph.'], 'Find the total. Is ' + r[0] + ' more than half of it?', { fig: barPic(c.t, c.rows, c.step, { src: c.src }), hint: 'Add all the bars first.', meta: { k: 'g3dt-dec-half', rows: c.rows, name: r[0] } });
    }],
    [1, 'need', function (lv) {
      var c = decCase(lv), p = twoOf(c.rows), f = {};
      f[p[0][1]] = 'That is how many ' + p[0][0] + ' has. How many more does ' + p[1][0] + ' need?';
      return num('The class will pick the snack or sport with the most votes. How many more votes does <b>' + p[1][0] + '</b> need to tie with <b>' + p[0][0] + '</b>?', p[0][1] - p[1][1], f, { fig: barFig(c), hint: 'Find the difference.', steps: [p[0][1] + ' &minus; ' + p[1][1] + ' = ' + (p[0][1] - p[1][1]) + '.'], explain: (p[0][1] - p[1][1]) + ' more votes.', meta: { k: 'g3dt-dec-need', rows: c.rows, a: p[0][0], b: p[1][0] } });
    }],
    [2, 'pick', function (lv) {
      var c = decCase(lv), vals = c.rows.map(function (r) { return r[1]; }).sort(function (a, b) { return a - b; }), lim = vals[1] + (vals[2] - vals[1] > 1 ? 1 : 0), ans = [];
      c.rows.forEach(function (r, j) { if (r[1] > lim) ans.push(j); });
      if (ans.length === c.rows.length || !ans.length) { lim = vals[0]; ans = []; c.rows.forEach(function (r, j) { if (r[1] > lim) ans.push(j); }); }
      return { q: 'The school will offer every choice with <b>more than ' + lim + '</b> votes. Pick them.', type: 'pick', options: c.rows.map(function (r) { return r[0]; }), answer: ans, fig: barFig(c), hint: 'Read each bar. Is it more than ' + lim + '?', steps: ['Exactly ' + lim + ' is not more than ' + lim + '.'], explain: ans.map(function (j) { return c.rows[j][0]; }).join(', ') + '.', meta: { k: 'g3dt-dec-pick', rows: c.rows, lim: lim } };
    }]
  ]);
  function tgDecide(lv) {
    return function () {
      var c = decCase(lv), p = R.shuffle(c.rows.slice()), a = p[0], b = p[1], z = p[2];
      if (a[1] + b[1] <= z[1]) { var t = a; a = z; z = t; }
      return { q: c.t + ': how many more chose <b>' + a[0] + ' or ' + b[0] + '</b> than <b>' + z[0] + '</b>?', fig: barFig(c), done: (a[1] + b[1]) + ' &minus; ' + z[1] + ' = ' + (a[1] + b[1] - z[1]) + ' more.', steps: [
        { prompt: 'Read the two bars you need to join.', q: num(a[0] + ' and ' + b[0] + ' together?', a[1] + b[1], {}, { hint: a[1] + ' + ' + b[1] + '.', meta: { k: 'g3dt-dec-add', rows: c.rows, a: a[0], b: b[0] } }) },
        { prompt: 'Read the other bar.', q: num('How many chose ' + z[0] + '?', z[1], {}, { hint: 'Read across from the top.', meta: { k: 'g3dt-bar-read', rows: c.rows, step: c.step, name: z[0] } }) },
        { prompt: 'How many more: subtract.', q: num('How many more?', a[1] + b[1] - z[1], {}, { hint: (a[1] + b[1]) + ' &minus; ' + z[1] + '.', meta: { k: 'g3dt-dec-two', rows: c.rows, a: a[0], b: b[0], z: z[0] } }) }
      ] };
    };
  }

  /* ======================= Lesson 4: Mean and mode ======================= */
  /* n values from lo to hi with a single mode that appears 2 or 3 times */
  function modeList(n, lo, hi) {
    var m = R.int(lo, hi), c = n >= 6 && coin() ? 3 : 2, v = R.shuffle(seqTo(lo, hi).filter(function (x) { return x !== m; })).slice(0, n - c);
    for (var i = 0; i < c; i++) v.push(m);
    return R.shuffle(v);
  }
  /* two values twice each, the rest once: two modes */
  function twoModeList(n, lo, hi) {
    var all = R.shuffle(seqTo(lo, hi)), v = all.slice(0, n - 2);
    v.push(all[0], all[1]);
    return R.shuffle(v);
  }
  /* 5 values with this total and this mode (twice); the other 3 values are different */
  function listWith(T, m, lo, hi) {
    for (var g = 0; g < 300; g++) {
      var x = R.int(lo, hi), y = R.int(lo, hi), z = T - 2 * m - x - y;
      if (z >= lo && z <= hi && new Set([m, x, y, z]).size === 4) return R.shuffle([m, m, x, y, z]);
    }
    return null;
  }
  function noModeList(n, lo, hi) { return R.shuffle(seqTo(lo, hi)).slice(0, n); }
  function seqTo(lo, hi) { var v = []; for (var i = lo; i <= hi; i++) v.push(i); return v; }
  var MR = { 1: [5, 1, 9], 2: [7, 2, 15], 3: [9, 20, 45] };
  function modeFig(v, lv) { var lo = Math.min.apply(null, v), hi = Math.max.apply(null, v); return lv === 2 && hi - lo <= 14 ? dotPlot(v, lo, hi) : cardsPic(v); }
  skill('dt-mode', 'The mode', 'D1.4', [
    [1, 'plain', function (lv) {
      var v = modeList(MR[lv][0], MR[lv][1], MR[lv][2]), m = modes(v)[0], f = {};
      f[Math.max.apply(null, v)] = 'That is the biggest value. The mode is the one that appears most.';
      return num('What is the mode?', m, f, { fig: modeFig(v, lv), hint: 'Which value appears most often?', steps: ['In order: ' + sorted(v).join(', ') + '.', m + ' appears ' + counts(v)[m] + ' times.'], explain: 'The mode is ' + m + '.', meta: { k: 'g3dt-mode-num', v: v } });
    }],
    [1, 'how', function (lv) {
      var kind = R.pick(['one', 'two', 'none']), n = MR[lv][0], v = kind === 'one' ? modeList(n, MR[lv][1], MR[lv][2]) : kind === 'two' ? twoModeList(n, MR[lv][1], MR[lv][2]) : noModeList(n, MR[lv][1], MR[lv][2]), opts = ['One mode', 'Two modes', 'No mode'];
      return fixed('How many modes does this data have?', opts, ['one', 'two', 'none'].indexOf(kind), ['Count how often each value appears.', 'Is there a tie for most often?', 'Does any value appear more than once?'], { fig: modeFig(v, lv), hint: 'Put the values in order. Look for repeats.', steps: ['In order: ' + sorted(v).join(', ') + '.'], explain: opts[['one', 'two', 'none'].indexOf(kind)] + '.', meta: { k: 'g3dt-mode-how', v: v } });
    }],
    [2, 'pick', function (lv) {
      var v = coin() ? twoModeList(MR[lv][0] + 1, MR[lv][1], MR[lv][2]) : modeList(MR[lv][0], MR[lv][1], MR[lv][2]), ms = modes(v), vals = ms.concat(R.shuffle(Object.keys(counts(v)).map(Number).filter(function (x) { return ms.indexOf(x) < 0; })).slice(0, 6 - ms.length)).sort(function (a, b) { return a - b; });
      return { q: 'Pick every mode of this data.', type: 'pick', options: vals.map(String), answer: ms.map(function (m) { return vals.indexOf(m); }), fig: modeFig(v, lv), hint: 'A tie for most often means two modes.', steps: ['In order: ' + sorted(v).join(', ') + '.'], explain: 'Mode' + (ms.length > 1 ? 's: ' : ': ') + ms.join(' and ') + '.', meta: { k: 'g3dt-mode-pick', v: v } };
    }],
    [1, 'times', function (lv) {
      var v = modeList(MR[lv][0] + 1, MR[lv][1], MR[lv][2]), m = modes(v)[0], f = {};
      f[m] = 'That is the mode itself. How many times does it appear?';
      return num('The mode is <b>' + m + '</b>. How many times does it appear?', counts(v)[m], f, { fig: cardsPic(v, m), hint: 'Count the ' + m + 's.', steps: [sorted(v).join(', ') + '.'], explain: counts(v)[m] + ' times.', meta: { k: 'g3dt-mode-times', v: v, m: m } });
    }],
    [2, 'fill', function (lv) {
      var vals = R.shuffle(seqTo(MR[lv][1], MR[lv][2])).slice(0, 3).sort(function (a, b) { return a - b; }), cs = R.shuffle([1, 2, 3, lv === 3 ? 5 : 4]).slice(0, 3), v = [];
      vals.forEach(function (x, i) { for (var k = 0; k < cs[i]; k++) v.push(x); });
      v = R.shuffle(v);
      var m = vals[cs.indexOf(Math.max.apply(null, cs))];
      return { q: 'Count each value. Then find the mode.', type: 'fill', fig: cardsPic(v), fill: vals.map(function (x) { return x + ' appears [[]] times'; }).join('<br>') + '<br>The mode is [[]].', answers: cs.concat([m]), hint: 'The mode appears most often.', steps: vals.map(function (x, i) { return x + ': ' + cs[i] + '.'; }), explain: 'The mode is ' + m + '.', meta: { k: 'g3dt-mode-fill', v: v } };
    }],
    [2, 'tf', function (lv) {
      var v = modeList(MR[lv][0], MR[lv][1], MR[lv][2]), m = modes(v)[0], truth = coin(), said = truth ? m : R.pick([Math.max.apply(null, v), Math.round(mean(v)), sorted(v)[0]].filter(function (x) { return x !== m; }).concat([m + 1])), who = Q.name();
      return tf(who + ' says the mode is <b>' + said + '</b>. True or false?', truth, m + ' appears most: ' + counts(v)[m] + ' times.', ['The mode is the biggest value.', 'The mode is the middle card.', 'The mode is the first value.'], 'The mode appears most often.', { fig: modeFig(v, lv), hint: 'Which value appears most?', meta: { k: 'g3dt-mode-tf', v: v, said: said } });
    }]
  ]);
  function tgMode(lv) {
    return function () {
      var v = modeList(MR[lv][0], MR[lv][1], MR[lv][2]), m = modes(v)[0], f = {};
      f[m] = 'That is the value. How many times does it appear?';
      return { q: 'Find the mode.', fig: cardsPic(v), done: 'The mode is ' + m + '.', steps: [
        { prompt: 'Put the values in order so repeats sit together.', q: { q: 'Put the values in order, smallest first.', type: 'order', items: Object.keys(counts(v)).map(Number).sort(function (a, b) { return a - b; }).map(String), first: 'smallest', last: 'biggest', hint: 'Each value once.', meta: { k: 'g3dt-mode-order' } } },
        { prompt: 'Look for the value that appears most.', q: num('Which value appears most often?', m, {}, { hint: 'Count each value.', meta: { k: 'g3dt-mode-num', v: v } }) },
        { prompt: 'Count it to be sure.', q: num('How many times does ' + m + ' appear?', counts(v)[m], f, { hint: 'Count the ' + m + 's.', meta: { k: 'g3dt-mode-times', v: v, m: m } }) }
      ] };
    };
  }

  /* ---------- The mean ---------- */
  var MN = { 1: [3, 1, 8], 2: [4, 2, 12], 3: [5, 10, 40] };
  /* n values from lo to hi, not all the same, whose mean is a whole number */
  function meanList(n, lo, hi) {
    for (var g = 0; g < 300; g++) { var v = []; for (var i = 0; i < n; i++) v.push(R.int(lo, hi)); if (sum(v) % n === 0 && new Set(v).size > 1) return v; }
    return [lo, lo + 2, lo + 4].slice(0, n);
  }
  var MSTORY = [['picked', 'apples'], ['read', 'books'], ['caught', 'fish'], ['found', 'shells'], ['made', 'paper cranes']];
  skill('dt-mean', 'The mean', 'D1.4', [
    [1, 'plain', function (lv) {
      var v = meanList(MN[lv][0], MN[lv][1], MN[lv][2]), m = mean(v), f = {};
      f[sum(v)] = 'That is the total. Share it between ' + v.length + '.';
      return num('What is the mean of ' + v.join(', ') + '?', m, f, { fig: lv < 3 ? towersPic(v) : cardsPic(v), hint: 'Add them all. Then share the total equally between ' + v.length + '.', steps: [v.join(' + ') + ' = ' + sum(v) + '.', sum(v) + ' &divide; ' + v.length + ' = ' + m + '.'], explain: 'The mean is ' + m + '.', meta: { k: 'g3dt-mean-num', v: v } });
    }],
    [1, 'fill', function (lv) {
      var v = meanList(MN[lv][0], MN[lv][1], MN[lv][2]);
      return { q: 'Find the mean of ' + v.join(', ') + '.', type: 'fill', fill: 'Total: [[]]<br>Shared by ' + v.length + ': [[]] each', answers: [sum(v), mean(v)], fig: lv < 3 ? towersPic(v) : cardsPic(v), hint: 'Add first. Then divide by how many values.', steps: [v.join(' + ') + ' = ' + sum(v) + '.', sum(v) + ' &divide; ' + v.length + ' = ' + mean(v) + '.'], explain: 'The mean is ' + mean(v) + '.', meta: { k: 'g3dt-mean-fill', v: v } };
    }],
    [1, 'story', function (lv) {
      var v = meanList(MN[lv][0], MN[lv][1], MN[lv][2]), st = R.pick(MSTORY), who = Q.names.slice().sort(function () { return Math.random() - 0.5; }).slice(0, v.length), f = {};
      f[sum(v)] = 'That is the total. Share it fairly.';
      return num(who.map(function (w, i) { return w + ' ' + st[0] + ' ' + v[i]; }).join(', ') + ' ' + st[1] + '. If they share them equally, how many does each get?', mean(v), f, { fig: towersPic(v), hint: 'Put them all together. Then share.', steps: [v.join(' + ') + ' = ' + sum(v) + '.', sum(v) + ' &divide; ' + v.length + ' = ' + mean(v) + '.'], explain: mean(v) + ' each. That is the mean.', meta: { k: 'g3dt-mean-num', v: v } });
    }],
    [2, 'level', function (lv) {
      var v = meanList(MN[lv][0], MN[lv][1], Math.min(MN[lv][2], 12)), m = mean(v), f = {};
      f[Math.max.apply(null, v)] = 'That is the tallest tower. Move cubes so all are the same.';
      return num('Move cubes from tall towers to short ones until all the towers are the same height. How tall is each?', m, f, { fig: towersPic(v), hint: 'Total cubes, shared between ' + v.length + ' towers.', steps: [sum(v) + ' cubes in all.', sum(v) + ' &divide; ' + v.length + ' = ' + m + '.'], explain: 'Each tower is ' + m + ' tall: the mean.', meta: { k: 'g3dt-mean-num', v: v } });
    }],
    [2, 'tf', function (lv) {
      var v = meanList(MN[lv][0], MN[lv][1], MN[lv][2]), m = mean(v), truth = coin(), said = truth ? m : R.pick([sum(v), m + 1, m - 1, Math.max.apply(null, v)].filter(function (x) { return x !== m && x > 0; })), who = Q.name();
      return tf(who + ' says the mean of ' + v.join(', ') + ' is <b>' + said + '</b>. True or false?', truth, v.join(' + ') + ' = ' + sum(v) + ', and ' + sum(v) + ' &divide; ' + v.length + ' = ' + m + '.', ['The mean is the total.', 'The mean is the biggest value.', 'The mean is the value that appears most.'], 'Add, then share equally.', { hint: 'Add, then divide by ' + v.length + '.', meta: { k: 'g3dt-mean-tf', v: v, said: said } });
    }],
    [2, 'missing', function (lv) {
      var v = meanList(MN[lv][0], MN[lv][1], MN[lv][2]), m = mean(v), gone = v[v.length - 1], rest = v.slice(0, -1), f = {};
      f[m * v.length] = 'That is the total. Take away the values you know.';
      return num('The mean of ' + v.length + ' numbers is <b>' + m + '</b>. ' + (rest.length > 1 ? 'Some of them are ' : 'One is ') + rest.join(', ') + '. What is the last number?', gone, f, { hint: 'The total must be ' + v.length + ' &times; ' + m + '.', steps: [v.length + ' &times; ' + m + ' = ' + m * v.length + '.', m * v.length + ' &minus; ' + sum(rest) + ' = ' + gone + '.'], explain: 'The last number is ' + gone + '.', meta: { k: 'g3dt-mean-miss', m: m, rest: rest } });
    }]
  ]);
  function tgMean(lv) {
    return function () {
      var v = meanList(MN[lv][0], MN[lv][1], Math.min(MN[lv][2], lv === 3 ? 15 : 12)), f = {};
      f[sum(v)] = 'That is the total. Now share it between ' + v.length + '.';
      return { q: 'Find the mean of ' + v.join(', ') + '.', fig: towersPic(v), done: 'The mean is ' + mean(v) + ': the towers level out at ' + mean(v) + '.', steps: [
        { prompt: 'Put all the cubes together.', q: num('How many cubes in all?', sum(v), {}, { hint: v.join(' + ') + '.', meta: { k: 'g3dt-mean-sum', v: v } }) },
        { prompt: 'Share them equally between ' + v.length + ' towers.', q: num(sum(v) + ' &divide; ' + v.length + ' = ?', mean(v), f, { hint: 'How many in each of ' + v.length + ' equal towers?', meta: { k: 'g3dt-mean-num', v: v } }) }
      ] };
    };
  }

  /* ---------- Mean or mode? ---------- */
  /* a list with a whole mean and one mode that is not the mean (or is, when same is true) */
  function mmList(lv, same) {
    var n = MN[lv][0] + 1;
    for (var g = 0; g < 600; g++) { var v = modeList(n, MN[lv][1], MN[lv][2]); if (sum(v) % n === 0 && (mean(v) === modes(v)[0]) === !!same) return v; }
    return same ? [2, 3, 3, 4] : [1, 2, 2, 7];
  }
  var USE = [['the most common value', 0], ['the fair share if everything is shared equally', 1], ['the shoe size the store should order most of', 0], ['how many each would get if we evened them out', 1], ['the favourite number of goals', 0], ['the level the towers make when you even them out', 1]];
  skill('dt-mm', 'Mean or mode?', 'D1.4', [
    [1, 'plain', function (lv) {
      var v = mmList(lv, coin() && coin());
      return { q: 'Find the mean and the mode of ' + v.join(', ') + '.', type: 'fill', fill: 'Mean: [[]]<br>Mode: [[]]', answers: [mean(v), modes(v)[0]], fig: cardsPic(v), hint: 'Mean: add, then share. Mode: appears most.', steps: [sum(v) + ' &divide; ' + v.length + ' = ' + mean(v) + '.', modes(v)[0] + ' appears most.'], explain: 'Mean ' + mean(v) + ', mode ' + modes(v)[0] + '.', meta: { k: 'g3dt-mm-fill', v: v } };
    }],
    [1, 'which', function () {
      var u = R.pick(USE), opts = ['The mode', 'The mean'];
      return fixed('Which one tells you <b>' + u[0] + '</b>?', opts, u[1], ['The mode is the value that appears most, not a fair share.', 'The mean is the fair share, not the most common value.'], { hint: 'Mode: most common. Mean: fair share.', steps: [u[1] ? 'Sharing equally gives the mean.' : 'Most common is the mode.'], explain: opts[u[1]] + '.', meta: { k: 'g3dt-mm-which', use: u[0] } });
    }],
    [2, 'tf', function (lv) {
      var same = coin(), v = mmList(lv, same), who = Q.name();
      return tf(who + ' says the mean and the mode of ' + v.join(', ') + ' are the same. True or false?', same, 'Mean ' + mean(v) + ', mode ' + modes(v)[0] + '.', ['The mean and the mode are always the same.', 'They are never the same.', 'The mode is always bigger.'], 'Work out both, then compare.', { fig: cardsPic(v), hint: 'Find both.', meta: { k: 'g3dt-mm-tf', v: v } });
    }],
    [2, 'diff', function (lv) {
      var v = mmList(lv, false), a = mean(v), b = modes(v)[0], f = {};
      f[Math.max(a, b)] = 'That is one of them. How far apart are they?';
      return num('How far apart are the mean and the mode of ' + v.join(', ') + '?', Math.abs(a - b), f, { fig: cardsPic(v), hint: 'Find both. Subtract the smaller from the bigger.', steps: ['Mean: ' + a + '. Mode: ' + b + '.', Math.max(a, b) + ' &minus; ' + Math.min(a, b) + ' = ' + Math.abs(a - b) + '.'], explain: Math.abs(a - b) + '.', meta: { k: 'g3dt-mm-diff', v: v } });
    }],
    [1, 'mean', function (lv) {
      var v = mmList(lv, false), b = modes(v)[0], who = Q.name(), f = {};
      f[b] = 'That is the mode. The mean is the fair share.';
      return num(who + ' found the mode of ' + v.join(', ') + ': it is ' + b + '. Now find the <b>mean</b>.', mean(v), f, { fig: towersPic(v), hint: 'Add, then share equally.', steps: [sum(v) + ' &divide; ' + v.length + ' = ' + mean(v) + '.'], explain: 'The mean is ' + mean(v) + '.', meta: { k: 'g3dt-mean-num', v: v } });
    }]
  ]);
  function tgMM(lv) {
    return function () {
      var v = mmList(lv, false), a = mean(v), b = modes(v)[0];
      return { q: 'Find the mean and the mode of ' + v.join(', ') + '.', fig: cardsPic(v), done: 'Mean ' + a + ', mode ' + b + '. Not the same.', steps: [
        { prompt: 'Mode: which value appears most?', q: num('What is the mode?', b, {}, { hint: 'Look for repeats.', meta: { k: 'g3dt-mode-num', v: v } }) },
        { prompt: 'Mean: add, then share equally.', q: num('What is the mean?', a, (function () { var f = {}; f[sum(v)] = 'That is the total. Share it.'; f[b] = 'That is the mode.'; return f; })(), { hint: sum(v) + ' &divide; ' + v.length + '.', meta: { k: 'g3dt-mean-num', v: v } }) },
        { prompt: 'Compare the two.', q: fixed('Are the mean and the mode the same?', ['Yes', 'No'], a === b ? 0 : 1, ['Compare ' + a + ' and ' + b + '.', 'Compare ' + a + ' and ' + b + '.'], { hint: a + ' and ' + b + '.', meta: { k: 'g3dt-mm-same', v: v } }) }
      ] };
    };
  }

  /* ---------- Different groups ---------- */
  var GRP = [['Room 7', 'Room 8', 'books read this month'], ['Grade 3', 'Grade 6', 'hours of sleep'], ['Our class', 'A class in Iqaluit', 'letters in their first name'], ['Our class', 'A class in Halifax', 'people at home'], ['Soccer team', 'Hockey team', 'goals this season']];
  var GR = { 1: [1, 9], 2: [2, 14], 3: [5, 30] };
  /* two lists of 5, each with a whole mean and one mode; sm / so say whether the means / modes match */
  function grpCase(lv, sm, so) {
    var lo = GR[lv][0], hi = GR[lv][1];
    for (var g = 0; g < 300; g++) {
      var M = R.int(lo + 1, hi - 1), m = R.int(lo, hi), M2 = sm ? M : R.pick([M - 2, M - 1, M + 1, M + 2].filter(function (x) { return x > lo && x < hi; })), m2 = so ? m : R.pick(seqTo(lo, hi).filter(function (x) { return x !== m; }));
      var a = listWith(5 * M, m, lo, hi), b = listWith(5 * M2, m2, lo, hi);
      if (a && b && sorted(a).join() !== sorted(b).join()) return { g: R.pick(GRP), a: a, b: b };
    }
    return { g: GRP[0], a: [2, 3, 3, 4, 8], b: [1, 3, 3, 5, 8] };
  }
  function grpFig(c) { return '<p class="g3-sym">' + c.g[0] + '</p>' + cardsPic(c.a) + '<p class="g3-sym">' + c.g[1] + '</p>' + cardsPic(c.b); }
  var SAME4 = ['Same mean, same mode', 'Same mean, different modes', 'Different means, same mode', 'Different means, different modes'];
  skill('dt-pop', 'Different groups', 'D2.2, D1.4', [
    [1, 'plain', function (lv) {
      var c = grpCase(lv, coin(), coin());
      return { q: 'Two groups counted ' + c.g[2] + '. Find the mean for each group.', type: 'fill', fig: grpFig(c), fill: c.g[0] + ': mean [[]]<br>' + c.g[1] + ': mean [[]]', answers: [mean(c.a), mean(c.b)], hint: 'Add each group. Share by 5.', steps: [sum(c.a) + ' &divide; 5 = ' + mean(c.a) + '.', sum(c.b) + ' &divide; 5 = ' + mean(c.b) + '.'], explain: mean(c.a) + ' and ' + mean(c.b) + '.', meta: { k: 'g3dt-pop-means', a: c.a, b: c.b } };
    }],
    [1, 'modes', function (lv) {
      var c = grpCase(lv, coin(), coin());
      return { q: 'Two groups counted ' + c.g[2] + '. Find the mode for each group.', type: 'fill', fig: grpFig(c), fill: c.g[0] + ': mode [[]]<br>' + c.g[1] + ': mode [[]]', answers: [modes(c.a)[0], modes(c.b)[0]], hint: 'Which value appears most in each?', steps: [c.g[0] + ': ' + modes(c.a)[0] + '.', c.g[1] + ': ' + modes(c.b)[0] + '.'], explain: modes(c.a)[0] + ' and ' + modes(c.b)[0] + '.', meta: { k: 'g3dt-pop-modes', a: c.a, b: c.b } };
    }],
    [2, 'same', function (lv) {
      var k = R.int(0, 3), c = grpCase(lv, k < 2, k % 2 === 0);
      return fixed('Two groups counted ' + c.g[2] + '. What did the test show?', SAME4, k, SAME4.map(function () { return 'Work out the mean and the mode of each group, then compare.'; }), { fig: grpFig(c), hint: 'Find all four numbers first.', steps: ['Means: ' + mean(c.a) + ' and ' + mean(c.b) + '.', 'Modes: ' + modes(c.a)[0] + ' and ' + modes(c.b)[0] + '.'], explain: SAME4[k] + '.', meta: { k: 'g3dt-pop-same', a: c.a, b: c.b } });
    }],
    [2, 'tf', function (lv) {
      var so = coin(), c = grpCase(lv, coin(), so), who = Q.name();
      return tf(who + ' predicted both groups would have the same mode. True or false: the data shows that.', so, 'Modes: ' + modes(c.a)[0] + ' and ' + modes(c.b)[0] + '.', ['Two groups always have the same mode.', 'Bigger groups have bigger modes.', 'You cannot find a mode for a group.'], 'Find the mode of each group.', { fig: grpFig(c), hint: 'Find each mode.', meta: { k: 'g3dt-pop-tf', a: c.a, b: c.b } });
    }],
    [1, 'diff', function (lv) {
      var c = grpCase(lv, false, coin()), hi = mean(c.a) > mean(c.b) ? 0 : 1, f = {};
      f[Math.abs(sum(c.a) - sum(c.b))] = 'That is the difference in totals. Compare the means.';
      return num('Two groups counted ' + c.g[2] + '. How much bigger is the mean for <b>' + c.g[hi] + '</b>?', Math.abs(mean(c.a) - mean(c.b)), f, { fig: grpFig(c), hint: 'Find both means. Subtract.', steps: ['Means: ' + mean(c.a) + ' and ' + mean(c.b) + '.'], explain: Math.abs(mean(c.a) - mean(c.b)) + '.', meta: { k: 'g3dt-pop-diff', a: c.a, b: c.b } });
    }]
  ]);
  function tgPop(lv) {
    return function () {
      var c = grpCase(lv, coin(), coin()), sm = mean(c.a) === mean(c.b);
      return { q: 'Predict: will ' + c.g[0] + ' and ' + c.g[1] + ' have the same mean? Then test it.', fig: grpFig(c), done: 'Means ' + mean(c.a) + ' and ' + mean(c.b) + ': ' + (sm ? 'the same.' : 'not the same.'), steps: [
        { prompt: 'Test it: work out the first group.', q: num('Mean for ' + c.g[0] + '?', mean(c.a), {}, { hint: sum(c.a) + ' &divide; 5.', meta: { k: 'g3dt-mean-num', v: c.a } }) },
        { prompt: 'Now the second group.', q: num('Mean for ' + c.g[1] + '?', mean(c.b), {}, { hint: sum(c.b) + ' &divide; 5.', meta: { k: 'g3dt-mean-num', v: c.b } }) },
        { prompt: 'Compare with your prediction.', q: fixed('Are the means the same?', ['Yes', 'No'], sm ? 0 : 1, ['Compare ' + mean(c.a) + ' and ' + mean(c.b) + '.', 'Compare ' + mean(c.a) + ' and ' + mean(c.b) + '.'], { hint: 'Compare the two means.', meta: { k: 'g3dt-pop-mean2', a: c.a, b: c.b } }) }
      ] };
    };
  }

  /* ======================= Lesson 5: Chance ======================= */
  var WORDS = ['impossible', 'unlikely', 'equally likely', 'likely', 'certain'];
  function word(fav, tot) { return fav === 0 ? 'impossible' : fav === tot ? 'certain' : 2 * fav === tot ? 'equally likely' : 2 * fav < tot ? 'unlikely' : 'likely'; }
  var BAGMAX = { 1: 6, 2: 8, 3: 10 };
  function bagCase(lv, w) {
    var tot = R.int(lv === 1 ? 4 : 5, BAGMAX[lv]), r;
    w = w || R.pick(WORDS);
    if (w === 'impossible') r = 0; else if (w === 'certain') r = tot; else if (w === 'equally likely') { if (tot % 2) tot++; r = tot / 2; } else if (w === 'unlikely') r = R.int(1, Math.ceil(tot / 2) - 1); else r = R.int(Math.floor(tot / 2) + 1, tot - 1);
    return { red: r, blue: tot - r };
  }
  function wordFix(w) { return { impossible: 'Is there any red at all?', unlikely: 'Compare red with the other colour.', 'equally likely': 'Are there just as many red as not red?', likely: 'Compare red with the other colour.', certain: 'Is every marble red?' }[w]; }
  skill('dt-chance', 'Words for chance', 'D2.1', [
    [1, 'plain', function (lv) {
      var b = bagCase(lv), w = word(b.red, b.red + b.blue);
      return fixed('You pick one marble without looking. Picking <b>red</b> is&hellip;', WORDS.map(cap1), WORDS.indexOf(w), WORDS.map(wordFix), { fig: bagPic(b), hint: 'How many red? How many not red?', steps: [b.red + ' red, ' + b.blue + ' blue.'], explain: cap1(w) + '.', meta: { k: 'g3dt-ch-word', red: b.red, blue: b.blue } });
    }],
    [2, 'match', function (lv) {
      var ws = R.shuffle(WORDS).slice(0, 3), bags = ws.map(function (w) { return bagCase(lv, w); });
      return { q: 'Match each bag to how likely you are to pick red.', type: 'match', pairs: bags.map(function (b) { return [b.red + ' red, ' + b.blue + ' blue', cap1(word(b.red, b.red + b.blue))]; }), hint: 'Compare red with blue in each bag.', steps: ['No red: impossible. All red: certain.'], explain: ws.map(cap1).join(', ') + '.', meta: { k: 'g3dt-ch-match' } };
    }],
    [2, 'order', function (lv) {
      var tot = BAGMAX[lv], rs = R.shuffle(seqTo(0, tot)).slice(0, 4).sort(function (a, b) { return a - b; });
      return { q: 'Each bag has ' + tot + ' marbles. Put the bags in order from <b>least</b> likely to <b>most</b> likely to give red.', type: 'order', items: rs.map(function (r) { return r + ' red, ' + (tot - r) + ' blue'; }), first: 'least likely', last: 'most likely', hint: 'More red means more likely.', steps: ['Same total: compare the red.'], explain: rs.map(function (r) { return r + ' red'; }).join(', ') + '.', meta: { k: 'g3dt-ch-order' } };
    }],
    [1, 'tf', function (lv) {
      var b = bagCase(lv), real = word(b.red, b.red + b.blue), truth = coin(), said = truth ? real : R.pick(WORDS.filter(function (w) { return w !== real; })), who = Q.name();
      return tf(who + ' says picking red is <b>' + said + '</b>. True or false?', truth, b.red + ' red and ' + b.blue + ' blue: ' + real + '.', ['Red is always likely.', 'Any colour is equally likely.', 'You cannot tell before you pick.'], 'Compare red with blue.', { fig: bagPic(b), hint: 'Count red and blue.', meta: { k: 'g3dt-ch-tf', red: b.red, blue: b.blue, said: said } });
    }],
    [1, 'spin', function (lv) {
      var n = R.pick(lv === 1 ? [2, 4] : [4, 6, 8]), w = R.pick(WORDS), r = w === 'impossible' ? 0 : w === 'certain' ? n : w === 'equally likely' ? n / 2 : w === 'unlikely' ? R.int(1, n / 2 - 1 || 1) : R.int(n / 2 + 1, n - 1), parts = [];
      if (n === 2 && (w === 'unlikely' || w === 'likely')) { n = 4; r = w === 'unlikely' ? 1 : 3; }
      for (var i = 0; i < n; i++) parts.push(i < r ? 'red' : 'blue');
      w = word(r, n);
      return fixed('You spin once. Landing on <b>red</b> is&hellip;', WORDS.map(cap1), WORDS.indexOf(w), WORDS.map(wordFix), { fig: spinPic(R.shuffle(parts)), hint: 'Count the red parts and the blue parts.', steps: [r + ' red, ' + (n - r) + ' blue.'], explain: cap1(w) + '.', meta: { k: 'g3dt-ch-word', red: r, blue: n - r } });
    }],
    [2, 'certain', function (lv) {
      var b = bagCase(lv, R.pick(['unlikely', 'likely', 'equally likely'])), f = {};
      f[b.red] = 'That is the red. Take out the marbles that are not red.';
      return num('How many marbles must you take out to make picking red <b>certain</b>?', b.blue, f, { fig: bagPic(b), hint: 'Certain: every marble is red.', steps: ['Take out every blue: ' + b.blue + '.'], explain: b.blue + ' marbles.', meta: { k: 'g3dt-ch-certain', red: b.red, blue: b.blue } });
    }]
  ]);
  function tgChance(w) {
    return function () {
      var b = bagCase(2, w), real = word(b.red, b.red + b.blue);
      return { q: 'Picking <b>red</b> from this bag is&hellip;', fig: bagPic(b), done: cap1(real) + '.', steps: [
        { prompt: 'Count the red.', q: num('How many red marbles?', b.red, {}, { hint: 'Count the red ones.', meta: { k: 'g3dt-ch-red', red: b.red } }) },
        { prompt: 'Compare red with the rest.', q: fixed('Compared with blue, red is&hellip;', ['More', 'The same', 'Fewer'], b.red > b.blue ? 0 : b.red === b.blue ? 1 : 2, ['Compare ' + b.red + ' and ' + b.blue + '.', 'Compare ' + b.red + ' and ' + b.blue + '.', 'Compare ' + b.red + ' and ' + b.blue + '.'], { hint: b.red + ' red, ' + b.blue + ' blue.', meta: { k: 'g3dt-ch-cmp', red: b.red, blue: b.blue } }) },
        { prompt: 'None or all? Then pick the word.', q: fixed('So picking red is&hellip;', WORDS.map(cap1), WORDS.indexOf(real), WORDS.map(wordFix), { hint: 'Use what you found.', meta: { k: 'g3dt-ch-word', red: b.red, blue: b.blue } }) }
      ] };
    };
  }

  /* ---------- Predict and decide ---------- */
  var PS = { 1: [[2, [10, 20, 30]], [4, [20, 40]]], 2: [[4, [20, 40, 60]], [5, [20, 30, 50]]], 3: [[5, [50, 100]], [10, [50, 100, 200]], [4, [100, 200]]] };
  function predCase(lv) { var p = R.pick(PS[lv]), n = p[0], S = R.pick(p[1]), r = R.int(1, n - 1), parts = []; for (var i = 0; i < n; i++) parts.push(i < r ? 'red' : 'blue'); return { n: n, S: S, r: r, parts: R.shuffle(parts) }; }
  skill('dt-predict', 'Predict and decide', 'D2.1', [
    [1, 'plain', function (lv) {
      var c = predCase(lv), ans = c.S * c.r / c.n, f = {};
      f[c.r] = 'That is the number of red parts. Think about all ' + c.S + ' spins.'; f[c.S / 2] = 'That would be half. Is red half of the spinner?';
      return num('You spin <b>' + c.S + '</b> times. About how many times will it land on red? Give the best prediction.', ans, f, { fig: spinPic(c.parts), hint: c.r + ' of ' + c.n + ' equal parts are red.', steps: ['Each group of ' + c.n + ' spins: about ' + c.r + ' red.', c.S + ' &divide; ' + c.n + ' = ' + c.S / c.n + ' groups. ' + c.S / c.n + ' &times; ' + c.r + ' = ' + ans + '.'], explain: 'About ' + ans + ' times.', meta: { k: 'g3dt-pr-about', n: c.n, r: c.r, S: c.S } });
    }],
    [1, 'best', function (lv) {
      var tot = lv === 3 ? 0 : R.int(6, 10), bags = [], seen = {};
      while (bags.length < 3) { var t = tot || R.int(4, 12), r = R.int(1, t - 1), key = r / t; if (seen[key] || bags.some(function (b) { return b.red / (b.red + b.blue) === key; })) continue; seen[key] = 1; bags.push({ red: r, blue: t - r }); }
      var best = 0; bags.forEach(function (b, i) { if (b.red / (b.red + b.blue) > bags[best].red / (bags[best].red + bags[best].blue)) best = i; });
      var names = ['Bag A', 'Bag B', 'Bag C'];
      return fixed('You win if you pick red. Which bag should you pick from?', names.map(function (n, i) { return n + ': ' + bags[i].red + ' red, ' + bags[i].blue + ' blue'; }), best, names.map(function () { return 'Compare red with blue in each bag, not just the red.'; }), { hint: 'Which bag has the most red compared with blue?', steps: ['Look at red compared with blue.'], explain: names[best] + '.', meta: { k: 'g3dt-pr-best', bags: bags } });
    }],
    [2, 'fair', function (lv) {
      var n = R.pick(lv === 3 ? [6, 8, 10] : [4, 6]), fair = coin(), r = fair ? n / 2 : R.pick([n / 2 - 1, n / 2 + 1]), parts = [], who = Q.two();
      for (var i = 0; i < n; i++) parts.push(i < r ? 'red' : 'blue');
      return tf(who[0] + ' wins on red. ' + who[1] + ' wins on blue. True or false: this game is fair.', fair, r + ' red and ' + (n - r) + ' blue parts.', ['Every spinner game is fair.', 'A game is fair if it has two colours.', 'The person who spins first wins.'], 'Fair means both are equally likely.', { fig: spinPic(R.shuffle(parts)), hint: 'Count the red and blue parts.', meta: { k: 'g3dt-pr-fair', r: r, n: n } });
    }],
    [1, 'add', function (lv) {
      var b = bagCase(lv, 'likely'), f = {};
      f[b.red] = 'That would make too many blue. Make blue the same as red.';
      return num('How many <b>blue</b> marbles should you add so red and blue are equally likely?', b.red - b.blue, f, { fig: bagPic(b), hint: 'Make the blue the same as the red.', steps: [b.red + ' &minus; ' + b.blue + ' = ' + (b.red - b.blue) + '.'], explain: 'Add ' + (b.red - b.blue) + ' blue.', meta: { k: 'g3dt-pr-add', red: b.red, blue: b.blue } });
    }],
    [2, 'rest', function (lv) {
      var S = R.pick(lv === 3 ? [100, 200] : [20, 30, 40, 50]), r = R.int(Math.floor(S / 5), Math.floor(S / 2)), b = R.int(Math.floor(S / 6), S - r - 2), f = {};
      f[r + b] = 'That is red and blue together. Take it away from ' + S + '.';
      return num('In <b>' + S + '</b> spins, red came up ' + r + ' times and blue ' + b + ' times. The rest were green. How many green?', S - r - b, f, { hint: S + ' &minus; ' + r + ' &minus; ' + b + '.', steps: [r + ' + ' + b + ' = ' + (r + b) + '.', S + ' &minus; ' + (r + b) + ' = ' + (S - r - b) + '.'], explain: (S - r - b) + ' green.', meta: { k: 'g3dt-pr-rest', S: S, r: r, b: b } });
    }],
    [2, 'most', function (lv) {
      var cs = R.shuffle(['red', 'blue', 'green', 'yellow']).slice(0, 3), bag = {}, vals = R.shuffle(seqTo(1, lv === 3 ? 6 : 5)).slice(0, 3);
      cs.forEach(function (c, i) { bag[c] = vals[i]; });
      var top = cs[vals.indexOf(Math.max.apply(null, vals))];
      return mc('You pick one marble without looking. Which colour are you most likely to get?', cap1(top), cs.filter(function (c) { return c !== top; }).map(function (c) { return [cap1(c), 'Count each colour: ' + c + ' has fewer.']; }), { fig: bagPic(bag), hint: 'The colour with the most marbles.', steps: [cs.map(function (c) { return bag[c] + ' ' + c; }).join(', ') + '.'], explain: cap1(top) + '.', meta: { k: 'g3dt-pr-most', bag: bag } });
    }]
  ]);
  function tgPredict(lv) {
    return function () {
      var c = predCase(lv), g = c.S / c.n, ans = g * c.r, f = {};
      f[c.r] = 'That is one group. There are ' + g + ' groups.';
      return { q: 'You spin ' + c.S + ' times. About how many reds?', fig: spinPic(c.parts), done: 'About ' + ans + ' reds. Test it: the real count will be close, not always exact.', steps: [
        { prompt: 'Count the red parts.', q: num('How many of the ' + c.n + ' parts are red?', c.r, {}, { hint: 'Count the red parts.', meta: { k: 'g3dt-pr-parts', r: c.r } }) },
        { prompt: 'Split the spins into groups of ' + c.n + '.', q: num(c.S + ' &divide; ' + c.n + ' = ?', g, {}, { hint: 'How many ' + c.n + 's make ' + c.S + '?', meta: { k: 'g3dt-pr-groups', n: c.n, S: c.S } }) },
        { prompt: 'About ' + c.r + ' red in each group.', q: num(g + ' &times; ' + c.r + ' = ?', ans, f, { hint: g + ' groups of ' + c.r + '.', meta: { k: 'g3dt-pr-about', n: c.n, r: c.r, S: c.S } }) }
      ] };
    };
  }

  /* ======================= Watch and My turn clips ======================= */
  var vennV = function (s) { return '<div>' + vennPic(partsOf(s.nums.slice(0, s.k), s.a, s.b), ATTR[s.a], ATTR[s.b]) + sym(s.say) + '</div>'; };
  var carV = function (s) { return '<div>' + carrollPic(s.nums.slice(0, s.k), s.a, s.b) + sym(s.say) + '</div>'; };
  var treeV = function (s) { return '<div>' + trayPic(s.bs.slice(s.k)) + treePic({ counts: countBlocks(s.bs.slice(0, s.k)), mark: s.mark }) + sym(s.say) + '</div>'; };
  var kindV = function (s) { return '<div class="tbl"><table><thead><tr><th class="l">Question</th><th class="l">Answers</th></tr></thead><tbody>' + s.rows.slice(0, s.k).map(function (r) { return '<tr><td class="l">' + r[0] + '</td><td class="l">' + r[1] + '</td></tr>'; }).join('') + '</tbody></table></div>' + sym(s.say); };
  var tallyV = function (s) { return '<div>' + tallyPic(s.n) + sym(s.say) + '</div>'; };
  var tabV = function (s) { return '<div>' + freqTable(s.rows, s.show) + sym(s.say) + '</div>'; };
  var pictoV = function (s) { return '<div>' + pictoPic(s.t, s.rows, s.key, { src: s.src }) + sym(s.say) + '</div>'; };
  var barV = function (s) { return '<div>' + barPic(s.t, s.rows, s.step, { src: s.src, noTitle: s.noTitle, noSource: s.noSource, noLabel: s.noLabel }) + sym(s.say) + '</div>'; };
  var twoV = function (s) { return '<div>' + barPic('Room 5', s.a, s.sa) + barPic('Room 6', s.b, s.sb) + sym(s.say) + '</div>'; };
  var cardV = function (s) { return '<div>' + (s.plot ? dotPlot(s.v, s.lo, s.hi) : cardsPic(s.sort ? sorted(s.v) : s.v, s.hi)) + sym(s.say) + '</div>'; };
  var towV = function (s) { return '<div>' + towersPic(s.v, s.line) + sym(s.say) + '</div>'; };
  var grpV = function (s) { return '<div>' + grpFig({ g: s.g, a: s.a, b: s.b }) + sym(s.say) + '</div>'; };
  var bagV = function (s) { return '<div>' + bagPic(s.bag) + sym(s.say) + '</div>'; };
  var spinV = function (s) { return '<div>' + spinPic(s.parts) + (s.c ? barPic(s.c[0] + s.c[1] + ' spins', [['Red', s.c[0]], ['Blue', s.c[1]]], s.step || 2, { ylab: 'Number of spins' }) : '') + sym(s.say) + '</div>'; };
  var SN = [6, 18, 9, 24, 12, 3, 20, 15];
  var TRAY = ['cbB', 'qoB', 'cos', 'cbB', 'qbs', 'coB', 'qoB', 'cbs'];
  var DSPORT = [['Hockey', 12], ['Soccer', 8], ['Lacrosse', 5], ['Swim', 9]];

  /* ======================= The lessons ======================= */
  var LESSONS = [
    { id: 'sort', title: 'Sorting', sub: 'Sort by two or three attributes.', concepts: [
      { id: 'venn', title: 'Venn diagrams', exp: ['D1.1'], skill: 'dt-venn',
        watch: clip(vennV, { nums: SN, a: 'even', b: 'gt15', k: 0 }, [
          ['Blue circle: even. Orange circle: more than 15.'],
          ['6 is even, not more than 15.', { k: 1 }],
          ['18 is both: the overlap.', { k: 2 }],
          ['9 is neither: outside.', { k: 3 }],
          ['The rest.', [{ k: 4 }, { k: 5 }, { k: 6 }, { k: 7 }, { k: 8 }]]
        ]),
        example: clip(vennV, { nums: [15, 4, 30, 7, 25, 12], a: 'm5', b: 'even', k: 0 }, [
          ['My turn. Multiple of 5, and even.'],
          ['15: a multiple of 5, odd.', { k: 1 }],
          ['30: both. Not just one circle.', [{ k: 2 }, { k: 3 }]],
          ['7 fits neither label.', [{ k: 4 }, { k: 5 }, { k: 6 }]]
        ]),
        together: [tgVenn(1), tgVenn(2), tgVenn(3)],
        mistake: '<p>Putting a number that fits both labels in just one circle, or leaving out the numbers that fit neither. Ask two yes-or-no questions for each number, then place it. When counting a circle, count the overlap too.</p>',
        check: [ck('dt-venn', 'plain', 1), ck('dt-venn', 'count', 1), ck('dt-venn', 'story', 2), ck('dt-venn', 'total', 2), ck('dt-venn', 'story', 3)] },

      { id: 'carroll', title: 'Carroll diagrams', exp: ['D1.1'], skill: 'dt-carroll',
        watch: clip(carV, { nums: SN, a: 'even', b: 'gt15', k: 0 }, [
          ['Rows: even or not. Columns: more than 15 or not.'],
          ['6: even row, not more than 15.', { k: 1 }],
          ['18: even row, more than 15.', { k: 2 }],
          ['Every number fits exactly one box.', [{ k: 3 }, { k: 4 }, { k: 5 }, { k: 6 }, { k: 7 }, { k: 8 }]]
        ]),
        example: clip(carV, { nums: [12, 5, 9, 20, 3, 16], a: 'm3', b: 'gt10', k: 0 }, [
          ['My turn. Multiple of 3, and more than 10.'],
          ['12: yes and yes, top left.', { k: 1 }],
          ['5: no and no, bottom right.', { k: 2 }],
          ['Row first, then column.', [{ k: 3 }, { k: 4 }, { k: 5 }, { k: 6 }]]
        ]),
        together: [tgCarroll(1), tgCarroll(2), tgCarroll(3)],
        mistake: '<p>Reading only the row or only the column. Each box is where one row meets one column, so every number needs two checks. Point to the row, then slide along to the column.</p>',
        check: [ck('dt-carroll', 'plain', 1), ck('dt-carroll', 'count', 1), ck('dt-carroll', 'fill', 2), ck('dt-carroll', 'more', 2), ck('dt-carroll', 'which', 3)] },

      { id: 'tree', title: 'Tree diagrams', exp: ['D1.1'], skill: 'dt-tree',
        watch: clip(treeV, { bs: TRAY, k: 0 }, [
          ['Sort by shape, then colour, then size.'],
          ['A big blue circle: circle, blue, big.', { k: 1, mark: 'cbB' }],
          ['A big orange square.', { k: 2, mark: 'qoB' }],
          ['Each block ends at one leaf.', [{ k: 3, mark: null }, { k: 4 }, { k: 5 }, { k: 6 }, { k: 7 }, { k: 8 }]]
        ]),
        example: clip(treeV, { bs: TRAY, k: 8 }, [
          ['My turn. How many blue circles?'],
          ['Two leaves: big and small.', { mark: 'cbB' }],
          ['2 + 1 = 3 blue circles.', { mark: 'cbs' }]
        ]),
        together: [tgTree(1), tgTree(2), tgTree(3)],
        mistake: '<p>Skipping a level (sorting by colour, then jumping to size) or adding only one leaf when a question names two attributes. Trace the path with a finger from the top: shape, colour, size.</p>',
        check: [ck('dt-tree', 'plain', 1), ck('dt-tree', 'count', 1), ck('dt-tree', 'sum', 2), ck('dt-tree', 'fill', 2), ck('dt-tree', 'sum', 3)] }
    ] },

    { id: 'collect', title: 'Collecting data', sub: 'Ask, watch or test, then keep count.', concepts: [
      { id: 'kinds', title: 'Kinds of data', exp: ['D1.2'], skill: 'dt-kinds',
        watch: clip(kindV, { rows: [['Favourite season?', 'winter, fall'], ['How many pets?', '0, 2, 1'], ['How far does it fly?', '3 m, 5 m']], k: 0 }, [
          ['Words or numbers?'],
          ['Answers in words: qualitative.', { k: 1 }],
          ['Answers in numbers: quantitative.', { k: 2 }],
          ['Ask people, watch, or test it.', { k: 3, say: 'interview, observation, experiment' }]
        ]),
        example: clip(kindV, { rows: [['Birds at the feeder?', '4, 7, 2'], ['Colour of each bike?', 'red, blue'], ['Cubes in one hand?', '12, 15']], k: 0 }, [
          ['My turn.'],
          ['I watch and count birds: numbers.', { k: 1, say: 'observation' }],
          ['I look at bikes: words.', { k: 2, say: 'observation' }],
          ['I try it with cubes: numbers.', { k: 3, say: 'experiment' }]
        ]),
        together: [tgKinds(1), tgKinds(2), tgKinds(3)],
        mistake: '<p>Thinking a question with a number in it has number answers ("Which of 3 snacks?" has word answers). Imagine one answer out loud. Hands-on: choose a question together, collect real answers from family or classmates (interview), by watching (observation) or by trying (experiment), and record them in a tally table.</p>',
        check: [ck('dt-kinds', 'plain', 1), ck('dt-kinds', 'how', 1), ck('dt-kinds', 'tf', 2), ck('dt-kinds', 'pick', 2), ck('dt-kinds', 'match', 3)] },

      { id: 'tally', title: 'Tally marks and tables', exp: ['D1.2', 'D1.5'], skill: 'dt-tally',
        watch: clip(tallyV, { n: 0 }, [
          ['One mark for each vote.', [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }]],
          ['The fifth mark crosses the four.', { n: 5, say: '5' }],
          ['Count by 5s, then 1s.', [{ n: 8 }, { n: 10, say: '10' }, { n: 13, say: '5, 10, 11, 12, 13' }]]
        ]),
        example: clip(tabV, { rows: [['Winter', 7], ['Spring', 4], ['Summer', 12]], show: 'tally' }, [
          ['My turn. A frequency table.'],
          ['I count each tally.', { show: 'both' }],
          ['7 + 4 + 12 = 23 votes in all.', { say: '23 votes' }],
          ['12 &minus; 4 = 8 more chose summer than spring.', { say: '12 − 4 = 8' }]
        ]),
        try: { mount: G3.play({ state: { v: [0, 0, 0, 0] }, draw: function (s) { return freqTable(['Winter', 'Spring', 'Summer', 'Fall'].map(function (n, i) { return [n, s.v[i]]; }), 'both'); },
          buttons: ['Winter', 'Spring', 'Summer', 'Fall'].map(function (n, i) { return { label: n, act: function (s) { if (s.v[i] < 30) s.v[i]++; } }; }).concat([{ label: 'Start over', act: function (s) { s.v = [0, 0, 0, 0]; } }]),
          info: function (s) { return G3.pl(sum(s.v), 'vote') + ' in all.'; },
          tasks: [{ do: 'Ask your family: "What is your favourite season?" Press a button for each answer.', goal: function (s) { return sum(s.v) >= 3; }, yes: 'Your own data. Which season has the most?' },
            { do: 'Record this survey: <b>Winter 3, Spring 2, Summer 7, Fall 5</b>.', goal: function (s) { return s.v.join() === '3,2,7,5'; }, yes: '3 + 2 + 7 + 5 = 17 votes.' }] }), do: '' },
        together: [tgTally(1), tgTally(2), tgTally(3)],
        mistake: '<p>Counting a group of 5 as 4 (missing the slanted mark), or adding the rows when the question asks "how many more". Count tallies by 5s, then 1s. "How many more" means subtract.</p>',
        check: [ck('dt-tally', 'plain', 1), ck('dt-tally', 'fill', 1), ck('dt-tally', 'total', 2), ck('dt-tally', 'diff', 2), ck('dt-tally', 'total', 3)] }
    ] },

    { id: 'graphs', title: 'Graphs', sub: 'Read the key and the scale.', concepts: [
      { id: 'picto', title: 'Pictographs', exp: ['D1.3', 'D1.5'], skill: 'dt-picto',
        watch: clip(pictoV, { t: 'Favourite fruit', rows: [['Apple', 6]], key: 2, src: 'Room 4 survey' }, [
          ['Each picture means 2 votes.'],
          ['Apple: 2, 4, 6.', { say: '3 × 2 = 6' }],
          ['Half a picture is 1.', { rows: [['Apple', 6], ['Pear', 5]], say: 'Pear: 4 + 1 = 5' }],
          ['6 + 5 = 11 votes in all.', { say: '11 votes' }]
        ]),
        example: clip(pictoV, { t: 'Favourite sport', rows: [['Hockey', 35], ['Soccer', 20]], key: 10, src: 'Grade 3 survey' }, [
          ['My turn. Each picture means 10.'],
          ['Hockey: 10, 20, 30, and half is 5.', { say: '35' }],
          ['Soccer: 20. Not 2: I read the key.', { say: '20' }],
          ['35 &minus; 20 = 15 more chose hockey.', { say: '35 − 20 = 15' }]
        ]),
        together: [tgPicto(1), tgPicto(2), tgPicto(3)],
        mistake: '<p>Counting pictures as single votes, or reading half a picture as 1 when the key is 10. Read the key first, then skip count along each row.</p>',
        check: [ck('dt-picto', 'plain', 1), ck('dt-picto', 'total', 1), ck('dt-picto', 'diff', 2), ck('dt-picto', 'fill', 2), ck('dt-picto', 'diff', 3)] },

      { id: 'bar', title: 'Bar graphs', exp: ['D1.3', 'D1.5'], skill: 'dt-bar',
        watch: clip(barV, { t: 'Favourite sport', rows: DSPORT, step: 2, src: 'Room 12 survey' }, [
          ['The scale counts by 2s.'],
          ['Hockey reaches 12.', { say: 'Hockey: 12' }],
          ['Lacrosse ends between 4 and 6: 5.', { say: 'Lacrosse: 5' }],
          ['12 &minus; 8 = 4 more chose hockey than soccer.', { say: '12 − 8 = 4' }]
        ]),
        example: clip(barV, { t: 'Way to school', rows: [['Walk', 35], ['Bus', 50], ['Car', 20], ['Bike', 15]], step: 10, src: 'Hallway survey' }, [
          ['My turn. This scale counts by 10s.'],
          ['Walk ends halfway between 30 and 40: 35.', { say: 'Walk: 35' }],
          ['Bus: 50. Car: 20. Bike: 15.', { say: '35 + 50 + 20 + 15' }],
          ['120 votes in all.', { say: '120 votes' }]
        ]),
        together: [tgBar(1), tgBar(2), tgBar(3)],
        mistake: '<p>Counting grid lines instead of reading the scale (the bar reaches the 6th line, so "6", when the scale counts by 2s and it means 12). Read the numbers up the side first. For a bar between two lines, find the number halfway.</p>',
        check: [ck('dt-bar', 'plain', 1), ck('dt-bar', 'scale', 1), ck('dt-bar', 'diff', 2), ck('dt-bar', 'total', 2), ck('dt-bar', 'diff', 3)] },

      { id: 'make', title: 'Make a graph', exp: ['D1.3'], skill: 'dt-make',
        watch: clip(barV, { t: '', rows: DSPORT, step: 2, noTitle: true, noSource: true, noLabel: true }, [
          ['Biggest count: 12. Count by 2s: 6 lines.'],
          ['Add a title.', { t: 'Favourite sport', noTitle: false }],
          ['Label the side.', { noLabel: false }],
          ['Say where the data came from.', { src: 'Room 12 survey', noSource: false }]
        ]),
        example: clip(pictoV, { t: 'Pets at home', rows: [['Dog', 15]], key: 5, src: 'Class interviews' }, [
          ['My turn. Each picture will mean 5.'],
          ['Dog: 15 &divide; 5 = 3 pictures.'],
          ['Cat: 10 &divide; 5 = 2 pictures.', { rows: [['Dog', 15], ['Cat', 10]] }],
          ['Fish: 25 &divide; 5 = 5. Not 25 pictures.', { rows: [['Dog', 15], ['Cat', 10], ['Fish', 25]] }]
        ]),
        together: [tgMake(1), tgMake(2), tgMake(3)],
        mistake: '<p>Choosing a scale that makes 40 tiny lines or 2 huge ones, or leaving off the title, labels and source. Find the biggest count first, then choose the smallest scale that needs 10 lines or fewer. Hands-on: make a real graph on paper from the family survey in "Tally marks and tables".</p>',
        check: [ck('dt-make', 'plain', 1), ck('dt-make', 'scale', 1), ck('dt-make', 'missing', 2), ck('dt-make', 'fill', 2), ck('dt-make', 'lines', 3)] },

      { id: 'decide', title: 'Answer questions with data', exp: ['D1.5'], skill: 'dt-decide',
        watch: clip(barV, { t: 'Favourite sport', rows: DSPORT, step: 2, src: 'Room 12 survey' }, [
          ['More chose hockey or soccer than swim?'],
          ['Hockey and soccer: 12 + 8 = 20.', { say: '12 + 8 = 20' }],
          ['Swim: 9. 20 &minus; 9 = 11 more.', { say: '20 − 9 = 11' }]
        ]),
        example: clip(twoV, { a: [['Hockey', 8], ['Soccer', 6], ['Swim', 4]], sa: 2, b: [['Hockey', 15], ['Soccer', 10], ['Swim', 5]], sb: 5 }, [
          ['My turn. Two rooms, two scales.'],
          ['Room 6 hockey looks the same height. It is 15.', { say: 'Room 5: 8. Room 6: 15.' }],
          ['I read the numbers, not the heights.', { say: '15 > 8' }],
          ['Together: 8 + 15 = 23 votes for hockey.', { say: '8 + 15 = 23' }]
        ]),
        together: [tgDecide(1), tgDecide(2), tgDecide(3)],
        mistake: '<p>Comparing bar heights on two graphs that use different scales, or answering from the tallest bar alone. Read the actual numbers, write them down, then add or subtract. Ask: "What would you decide, and why?"</p>',
        check: [ck('dt-decide', 'plain', 1), ck('dt-decide', 'need', 1), ck('dt-decide', 'compare', 2), ck('dt-decide', 'both', 2), ck('dt-decide', 'plain', 3)] }
    ] },

    { id: 'average', title: 'Mean and mode', sub: 'Most common, and fair share.', concepts: [
      { id: 'mode', title: 'The mode', exp: ['D1.4'], skill: 'dt-mode',
        watch: clip(cardV, { v: [4, 7, 4, 2, 9, 4, 7] }, [
          ['Which value appears most?'],
          ['In order, repeats sit together.', { sort: true }],
          ['4 appears 3 times: the mode is 4.', { sort: true, hi: 4, say: 'mode = 4' }]
        ]),
        example: clip(cardV, { v: [3, 5, 8, 5, 3, 6], plot: true, lo: 2, hi: 9 }, [
          ['My turn. One X for each value.'],
          ['3 and 5 are tied, two each.', { say: 'two modes: 3 and 5' }],
          ['Not 8: the biggest is not the mode.', { say: 'modes: 3, 5' }]
        ]),
        together: [tgMode(1), tgMode(2), tgMode(3)],
        mistake: '<p>Giving the biggest value, or how many times it appears, instead of the value itself; or missing a tie (two modes) or a list with no repeats (no mode). Put the values in order first.</p>',
        check: [ck('dt-mode', 'plain', 1), ck('dt-mode', 'how', 1), ck('dt-mode', 'times', 2), ck('dt-mode', 'fill', 2), ck('dt-mode', 'plain', 3)] },

      { id: 'mean', title: 'The mean', exp: ['D1.4'], skill: 'dt-mean',
        watch: clip(towV, { v: [2, 8, 5] }, [
          ['Three towers: 2, 8 and 5 cubes.'],
          ['15 cubes in all.', { say: '2 + 8 + 5 = 15' }],
          ['Shared fairly: 5 each.', { v: [5, 5, 5], line: 5, say: '15 ÷ 3 = 5' }]
        ]),
        example: clip(towV, { v: [6, 1, 9, 4] }, [
          ['My turn. 6, 1, 9, 4.'],
          ['Total: 20 cubes.', { say: '6 + 1 + 9 + 4 = 20' }],
          ['20 &divide; 4 = 5. Not 20: I share it.', { v: [5, 5, 5, 5], line: 5, say: 'mean = 5' }]
        ]),
        try: { mount: G3.play({ state: { v: [2, 8, 5] }, draw: function (s) { return towersPic(s.v, 5); },
          buttons: [{ label: 'Move a cube from the tallest to the shortest', act: function (s) { var hi = s.v.indexOf(Math.max.apply(null, s.v)), lo = s.v.indexOf(Math.min.apply(null, s.v)); if (s.v[hi] - s.v[lo] > 1) { s.v[hi]--; s.v[lo]++; } } }, { label: 'Start over', act: function (s) { s.v = [2, 8, 5]; } }],
          info: function (s) { return s.v.join(' + ') + ' = ' + sum(s.v) + ' cubes.'; },
          tasks: [{ do: 'Make the three towers the same height.', goal: function (s) { return s.v.every(function (x) { return x === 5; }); }, yes: 'Each tower is 5: the mean of 2, 8 and 5.' }] }), do: '' },
        together: [tgMean(1), tgMean(2), tgMean(3)],
        mistake: '<p>Stopping at the total (the mean of 2, 8, 5 is not 15), or dividing by the wrong number. Build the towers with real cubes and even them out. Then link it to the sum: total &divide; how many values.</p>',
        check: [ck('dt-mean', 'plain', 1), ck('dt-mean', 'fill', 1), ck('dt-mean', 'story', 2), ck('dt-mean', 'level', 2), ck('dt-mean', 'missing', 3)] },

      { id: 'meanmode', title: 'Mean or mode?', exp: ['D1.4'], skill: 'dt-mm',
        watch: clip(cardV, { v: [2, 3, 3, 8] }, [
          ['2, 3, 3, 8.'],
          ['Mode: 3 appears most.', { hi: 3, say: 'mode = 3' }],
          ['Mean: 16 &divide; 4 = 4.', { hi: null, say: 'mean = 4' }],
          ['Most common, or fair share.', { say: 'mode 3, mean 4' }]
        ]),
        example: clip(cardV, { v: [5, 6, 6, 7] }, [
          ['My turn. 5, 6, 6, 7.'],
          ['Mode: 6.', { hi: 6, say: 'mode = 6' }],
          ['Mean: 24 &divide; 4 = 6.', { hi: null, say: 'mean = 6' }],
          ['Here they are the same. Not always.', { say: 'mode 6, mean 6' }]
        ]),
        together: [tgMM(1), tgMM(2), tgMM(3)],
        mistake: '<p>Mixing the two up: giving the most common value when asked for the mean. Mode: most common. Mean: fair share. Ask: "Are we looking for a repeat, or sharing out?"</p>',
        check: [ck('dt-mm', 'plain', 1), ck('dt-mm', 'which', 1), ck('dt-mm', 'mean', 2), ck('dt-mm', 'diff', 2), ck('dt-mm', 'tf', 3)] },

      { id: 'groups', title: 'Different groups', exp: ['D2.2', 'D1.4'], skill: 'dt-pop',
        watch: clip(grpV, { g: GRP[0], a: [2, 4, 4, 5, 10], b: [1, 3, 4, 4, 3] }, [
          ['Predict: the same mean?'],
          ['Room 7: 25 &divide; 5 = 5.', { say: 'Room 7: mean 5' }],
          ['Room 8: 15 &divide; 5 = 3.', { say: 'Room 8: mean 3' }],
          ['Same mode, 4. Different means.', { say: 'mode 4 and 4' }]
        ]),
        example: clip(grpV, { g: GRP[2], a: [4, 5, 5, 6, 5], b: [3, 5, 7, 5, 5] }, [
          ['My turn. I predict different.'],
          ['Our class: 25 &divide; 5 = 5.', { say: 'mean 5' }],
          ['Iqaluit: 25 &divide; 5 = 5.', { say: 'mean 5' }],
          ['The same. My prediction was wrong, and that is fine.', { say: 'test, then compare' }]
        ]),
        together: [tgPop(1), tgPop(2), tgPop(3)],
        mistake: '<p>Expecting a different group to give the same results, or treating a wrong prediction as a mistake. Predict first, work out both, then compare. Hands-on: ask two groups (family and friends) the same question and compare.</p>',
        check: [ck('dt-pop', 'plain', 1), ck('dt-pop', 'modes', 1), ck('dt-pop', 'diff', 2), ck('dt-pop', 'same', 2), ck('dt-pop', 'diff', 3)] }
    ] },

    { id: 'chance', title: 'Chance', sub: 'From impossible to certain.', concepts: [
      { id: 'words', title: 'Words for chance', exp: ['D2.1'], skill: 'dt-chance',
        watch: clip(bagV, { bag: { blue: 6 } }, [
          ['No red at all: impossible.'],
          ['1 red of 6: unlikely.', { bag: { red: 1, blue: 5 } }],
          ['3 red, 3 blue: equally likely.', { bag: { red: 3, blue: 3 } }],
          ['5 red of 6: likely.', { bag: { red: 5, blue: 1 } }],
          ['All red: certain.', { bag: { red: 6 } }]
        ]),
        example: clip(bagV, { bag: { red: 2, blue: 6 } }, [
          ['My turn. 2 red, 6 blue.'],
          ['Red is fewer than blue: unlikely.', { say: 'unlikely' }],
          ['Not impossible: there is some red.'],
          ['Add 4 red: 6 and 6, equally likely.', { bag: { red: 6, blue: 6 }, say: 'equally likely' }]
        ]),
        together: [tgChance('unlikely'), tgChance('likely'), tgChance()],
        mistake: '<p>Calling something impossible when it is just unlikely, or thinking likely means "always". Compare the counts out loud: "fewer red than blue", then choose the word.</p>',
        check: [ck('dt-chance', 'plain', 1), ck('dt-chance', 'spin', 1), ck('dt-chance', 'tf', 2), ck('dt-chance', 'certain', 2), ck('dt-chance', 'order', 3)] },

      { id: 'predict', title: 'Predict and decide', exp: ['D2.1'], skill: 'dt-predict',
        watch: clip(spinV, { parts: ['red', 'blue', 'blue', 'blue'] }, [
          ['1 of 4 parts is red.'],
          ['20 spins: 5 groups of 4. About 5 reds.', { say: '20 ÷ 4 × 1 = 5' }],
          ['Test: 6 red, 14 blue. Close.', { c: [6, 14], say: '6 red, 14 blue' }]
        ]),
        example: clip(spinV, { parts: ['red', 'blue', 'red', 'blue'] }, [
          ['My turn. 2 of 4 parts are red.'],
          ['20 spins: about 10 reds.', { say: '20 ÷ 4 × 2 = 10' }],
          ['Test: 11 red, 9 blue. Not exactly 10, but close.', { c: [11, 9], say: '11 red, 9 blue' }],
          ['Red and blue are equally likely: a fair game.', { say: 'fair' }]
        ]),
        try: { mount: G3.play({ state: { r: 1, n: 4, c: null }, draw: function (s) { var p = []; for (var i = 0; i < s.n; i++) p.push(i < s.r ? 'red' : 'blue'); return spinPic(p) + (s.c ? barPic('20 spins', [['Red', s.c[0]], ['Blue', s.c[1]]], 2, { ylab: 'Number of spins' }) : ''); },
          sliders: [{ key: 'r', label: 'Red parts', min: 0, max: 4 }],
          buttons: [{ label: 'Spin 20 times', act: function (s) { var c = [0, 0]; for (var i = 0; i < 20; i++) c[Math.random() * s.n < s.r ? 0 : 1]++; s.c = c; } }],
          info: function (s) { return 'Predict: about <b>' + 20 * s.r / s.n + '</b> reds.' + (s.c ? ' Result: ' + s.c[0] + ' red, ' + s.c[1] + ' blue.' : ''); },
          tasks: [{ do: 'Make red <b>likely</b>. Predict, then spin 20 times.', goal: function (s) { return s.r === 3 && s.c; }, yes: function (s) { return 'Predicted about 15 reds. You got ' + s.c[0] + '.'; } }] }), do: '' },
        together: [tgPredict(1), tgPredict(2), tgPredict(3)],
        mistake: '<p>Expecting the result to match the prediction exactly, or predicting just the number of red parts. A prediction says "about". Hands-on: spin a paper spinner 20 times, keep a tally, and compare with the prediction.</p>',
        check: [ck('dt-predict', 'plain', 1), ck('dt-predict', 'add', 1), ck('dt-predict', 'fair', 2), ck('dt-predict', 'rest', 2), ck('dt-predict', 'plain', 3)] }
    ] }
  ];

  A.register(CH, {
    full: true,
    lessons: LESSONS,
    quiz: [
      { q: 'Where does <b>20</b> go?', type: 'mc', options: ['Even only', 'Both', 'More than 15 only', 'Neither'], answer: 1, fig: vennPic(partsOf([6, 18, 9, 24, 3, 12, 17], 'even', 'gt15'), 'Even', 'More than 15'), hint: 'Is 20 even? Is it more than 15?', explain: '20 is even and more than 15: the overlap.', meta: { k: 'g3dt-venn-where', n: 20, a: 'even', b: 'gt15' } },
      { q: 'How many does this tally show?', type: 'num', answer: 17, fig: tallyPic(17), hint: 'Count by 5s, then 1s.', explain: '5, 10, 15, then 16, 17.', meta: { k: 'g3dt-tal-read', n: 17 } },
      { q: 'Favourite fruit: how many chose <b>Apple</b>?', type: 'num', answer: 7, fig: pictoPic('Favourite fruit', [['Apple', 7], ['Pear', 4], ['Grapes', 10]], 2, { src: 'Room 4 survey' }), hint: 'Each picture means 2. Half a picture is 1.', explain: '3 pictures = 6, and half = 1. 7 votes.', meta: { k: 'g3dt-pic-read', rows: [['Apple', 7], ['Pear', 4], ['Grapes', 10]], key: 2, name: 'Apple' } },
      { q: 'Favourite sport: how many more chose <b>Hockey</b> than <b>Swim</b>?', type: 'num', answer: 3, fig: barPic('Favourite sport', DSPORT, 2, { src: 'Room 12 survey' }), hint: 'Read both bars. Subtract.', explain: '12 &minus; 9 = 3.', meta: { k: 'g3dt-bar-diff', rows: DSPORT, step: 2, a: 'Hockey', b: 'Swim' } },
      { q: 'What is the mean of 3, 9, 6?', type: 'num', answer: 6, fig: towersPic([3, 9, 6]), hint: 'Add. Then share by 3.', explain: '3 + 9 + 6 = 18, and 18 &divide; 3 = 6.', meta: { k: 'g3dt-mean-num', v: [3, 9, 6] } },
      { q: 'What is the mode?', type: 'num', answer: 8, fig: cardsPic([5, 8, 2, 8, 6, 8, 5]), hint: 'Which value appears most?', explain: '8 appears 3 times.', meta: { k: 'g3dt-mode-num', v: [5, 8, 2, 8, 6, 8, 5] } },
      { q: 'You pick one marble without looking. Picking <b>red</b> is&hellip;', type: 'mc', options: WORDS.map(cap1), answer: 1, fig: bagPic({ red: 2, blue: 6 }), hint: 'Compare red with blue.', explain: '2 red and 6 blue: unlikely.', meta: { k: 'g3dt-ch-word', red: 2, blue: 6 } }
    ],
    practice: SKILLS.map(function (s) { return { id: s.id, name: s.name, code: s.code, gen: DEF[s.id][0][2] }; })
  });

  /* every skill's other shapes (docs/QUESTIONS.md); each skill keeps its first way of asking as "plain" */
  var SHAPES = {};
  SKILLS.forEach(function (s) { SHAPES[s.id] = DEF[s.id].slice(1); });
  Q.shapes(CH, SHAPES);
})();
