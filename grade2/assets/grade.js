/* Grade 2 settings for the shared grade app (assets/engine/site.js): chapters, home page text and options,
   then Grade 2's own pictures, shared by every chapter. */
Atlas.setup({
  grade: 2,
  tools: ['base10', 'counters', 'hundred', 'numberline', 'fractions', 'balance', 'patterns', 'data', 'grid', 'coins', 'geoboard', 'clock'],
  meta: [
    { id: 'numbers-200', title: 'Numbers to 200', sub: 'read, build, compare, count', strand: 'B', codes: 'B1.1 to B1.5',
      desc: 'Hundreds, tens and ones. Compare numbers, skip count, estimate, and even or odd.' },
    { id: 'facts-20', title: 'Facts to 20', sub: 'adding and taking away', strand: 'B', codes: 'B2.1, B2.2',
      desc: 'Addition and subtraction facts up to 20, and how they fit together.' },
    { id: 'add-subtract-100', title: 'Adding and Subtracting to 100', sub: 'tens first, then ones', strand: 'B', codes: 'B2.1, B2.3, B2.4',
      desc: 'Mental math, number lines and story problems up to 100.' },
    { id: 'groups-sharing', title: 'Equal Groups and Sharing', sub: 'groups of, shared by', strand: 'B', codes: 'B2.5, B2.6',
      desc: 'Equal groups, halves and fourths of groups, and sharing up to 12 items.' },
    { id: 'fractions', title: 'Fair Shares', sub: 'halves, fourths, thirds, sixths', strand: 'B', codes: 'B1.6, B1.7',
      desc: 'Share things fairly and name the parts.' },
    { id: 'patterns', title: 'Patterns and Equal Sides', sub: 'rules, missing parts, balance', strand: 'C', codes: 'C1.1 to C2.3',
      desc: 'Shape and number patterns, symbols for unknowns, and making both sides equal.' },
    { id: 'shapes', title: 'Shapes', sub: 'sides, corners, symmetry', strand: 'E', codes: 'E1.1 to E1.3',
      desc: 'Sort shapes, find lines of symmetry, and put shapes together and apart.' },
    { id: 'maps-code', title: 'Maps, Moves and Code', sub: 'where things are, how to get there', strand: 'E', codes: 'E1.4, E1.5, C3.1, C3.2',
      desc: 'Read simple maps, give directions, and write and fix step-by-step code.' },
    { id: 'length-time', title: 'Length and Time', sub: 'centimetres, metres, minutes', strand: 'E', codes: 'E2.1 to E2.4',
      desc: 'Measure with units, use a ruler, and describe how long things take.' },
    { id: 'data', title: 'Data and Chance', sub: 'sort, graph, the mode, likely', strand: 'D', codes: 'D1.1 to D2.2',
      desc: 'Sort with diagrams, tally, read graphs, find the mode, and talk about chance.' },
    { id: 'money', title: 'Money', sub: 'coins and bills to $200', strand: 'F', codes: 'F1.1',
      desc: 'Show the same amount of money in different ways.' },
    { id: 'fact-sheet', title: 'Fact Sheet', sub: 'the key facts on one page', strand: 'B', ref: true,
      desc: 'Place value, facts, shapes, units and coins.' }
  ],
  home: {
    hero: function () {
      return '<h1>Grade 2 Math, one step at a time</h1>' +
        '<p class="lede">A free study site for Ontario Grade 2 math. Short lessons with lots of pictures, drawings you can change, practice that adjusts to you, and a check-up that shows what to work on next.</p>' +
        '<div class="herofig" aria-hidden="true">' + Atlas.heroArt() + '</div>';
    },
    start: '<p><b>Not sure where to start?</b> Take the <a href="#check-up">check-up</a>. It takes about 10 minutes and builds a practice plan for you.</p>',
    notes: '<p><b>About this site.</b> It follows the five content strands (B to F) of the 2020 Ontario elementary math curriculum for Grade 2. ' +
      'It is a study aid, not a copy of the curriculum. Teachers and parents should check details against the Ministry of Education document.</p>' +
      '<p><b>Not covered:</b> strand A (social-emotional learning skills and math processes) is woven through, not taught as its own chapter. Mathematical modelling (C4) has no chapter of its own. Hands-on parts, like collecting real data or measuring real objects, are described but have to be done away from the screen.</p>'
  },
  input: { mode: 'numeric', placeholder: 'Type a number', pad: false }
});

(function () {
  'use strict';
  var D = Atlas.draw;
  function rr(x, y, w, h, r, fill, extra) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" style="fill:' + fill + '" ' + (extra || 'stroke="rgba(0,0,0,.45)" stroke-width="1.5"') + '/>';
  }
  D.rr = rr;
  /* flat base-ten pieces: hundred = 10 by 10 square, ten = 1 by 10 rod, one = small cube.
     o: {u: cube size, W: max width}. Returns an svg string. */
  D.base10 = function (h, t, o1, opt) {
    opt = opt || {};
    var u = opt.u || 9, W = opt.W || 540, gap = u * 0.9, s = '', x = 4, y = 4, rowH = 0, maxX = 0, items = [];
    var i;
    for (i = 0; i < h; i++) items.push(2);
    for (i = 0; i < t; i++) items.push(1);
    if (o1) items.push(0);
    items.forEach(function (p, k) {
      var w = p === 2 ? 10 * u : p === 1 ? u : Math.min(o1, 5) * u + (o1 > 5 ? 0 : 0), hh = p === 0 ? (o1 > 5 ? 2 * u + 3 : u) : 10 * u;
      if (p === 0) w = Math.min(o1, 5) * (u + 3);
      var g = k && items[k - 1] !== p ? gap * 2.2 : gap;
      if (!k) g = 0;
      if (x + g + w > W && k) { x = 4; y += rowH + gap * 1.6; rowH = 0; g = 0; }
      x += g;
      var col = 'var(--p' + p + ')';
      if (p === 2) {
        s += rr(x, y, 10 * u, 10 * u, 2, col);
        var ln = '';
        for (var j = 1; j < 10; j++) ln += '<line x1="' + (x + j * u) + '" y1="' + y + '" x2="' + (x + j * u) + '" y2="' + (y + 10 * u) + '"/><line x1="' + x + '" y1="' + (y + j * u) + '" x2="' + (x + 10 * u) + '" y2="' + (y + j * u) + '"/>';
        s += '<g stroke="rgba(0,0,0,.28)" stroke-width="1">' + ln + '</g>';
      } else if (p === 1) {
        s += rr(x, y, u, 10 * u, 2, col);
        var l2 = '';
        for (var j2 = 1; j2 < 10; j2++) l2 += '<line x1="' + x + '" y1="' + (y + j2 * u) + '" x2="' + (x + u) + '" y2="' + (y + j2 * u) + '"/>';
        s += '<g stroke="rgba(0,0,0,.3)" stroke-width="1">' + l2 + '</g>';
      } else {
        for (var c = 0; c < o1; c++) s += rr(x + (c % 5) * (u + 3), y + 10 * u - u - Math.floor(c / 5) * (u + 3), u, u, 2, col);
      }
      x += w; maxX = Math.max(maxX, x); rowH = Math.max(rowH, hh, 10 * u);
    });
    var lab = opt.label || (h + ' hundred' + (h === 1 ? '' : 's') + ', ' + t + ' ten' + (t === 1 ? '' : 's') + ' and ' + o1 + ' one' + (o1 === 1 ? '' : 's') + ', which is ' + (100 * h + 10 * t + o1));
    if (!items.length) { s = '<text x="40" y="30" font-size="16" class="t2">nothing yet</text>'; maxX = 140; rowH = 40; }
    return Atlas.svg(Math.ceil(maxX + 4), Math.ceil(y + rowH + 4), s, lab);
  };
  D.num10 = function (n, opt) { return D.base10(Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10, opt); };
  /* ten-frames: n counters across as many frames as needed. opt.col2 colours counters past opt.split */
  D.frames = function (n, opt) {
    opt = opt || {};
    var c = opt.c || 30, frames = Math.max(opt.min || 1, Math.ceil(n / 10)), s = '', W = 5 * c + 8;
    var per = opt.perRow || (frames > 2 ? 2 : frames);
    for (var f = 0; f < frames; f++) {
      var fx = 4 + (f % per) * (W + 14), fy = 4 + Math.floor(f / per) * (2 * c + 18);
      s += rr(fx, fy, 5 * c + 4, 2 * c + 4, 8, 'var(--card)', 'style="stroke:var(--ink)" stroke-width="2.5"');
      for (var i = 0; i < 10; i++) {
        var x = fx + 2 + (i % 5) * c, y = fy + 2 + Math.floor(i / 5) * c, k = f * 10 + i;
        if (i % 5) s += '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + c) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
        if (k < n) s += '<circle cx="' + (x + c / 2) + '" cy="' + (y + c / 2) + '" r="' + (c * 0.36) + '" style="fill:' + (opt.split !== undefined && k >= opt.split ? opt.col2 || 'var(--hi)' : opt.col || 'var(--strand)') + '" stroke="rgba(0,0,0,.4)" stroke-width="1.2"/>';
      }
      s += '<line x1="' + fx + '" y1="' + (fy + c + 2) + '" x2="' + (fx + 5 * c + 4) + '" y2="' + (fy + c + 2) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    }
    var rows = Math.ceil(frames / per);
    return Atlas.svg(per * (W + 14) - 6, rows * (2 * c + 18) - 8, s, opt.label || n + ' counters in ten-frames');
  };
  /* a number line with hops. opt: {min, max, tick, label every, hops:[{a, b, t}], marks:[{v, t, col}], W} */
  D.hops = function (opt) {
    var W = opt.W || 540, x0 = 22, x1 = W - 22, y = opt.y || 70, min = opt.min, max = opt.max, s = '';
    var X = function (v) { return x0 + (x1 - x0) * (v - min) / (max - min); };
    s += '<defs><marker id="' + (opt.id || 'hp') + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--strand)"/></marker></defs>';
    s += '<line x1="' + (x0 - 10) + '" y1="' + y + '" x2="' + (x1 + 10) + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="3" stroke-linecap="round"/>';
    var tick = opt.tick || 1, every = opt.every || tick;
    for (var v = min; v <= max + 1e-9; v += tick) {
      var big = Math.abs((v - min) % every) < 1e-9 || Math.abs((v - min) % every - every) < 1e-9, x = X(v);
      s += '<line x1="' + x + '" y1="' + (y - (big ? 10 : 6)) + '" x2="' + x + '" y2="' + (y + (big ? 10 : 6)) + '" style="stroke:var(--ink)" stroke-width="' + (big ? 2.5 : 1.5) + '"/>';
      if (big && !opt.nolabels) s += '<text x="' + x + '" y="' + (y + 30) + '" text-anchor="middle" font-size="' + (opt.fs || 18) + '" font-weight="700">' + Atlas.fmt(Math.round(v * 100) / 100) + '</text>';
    }
    (opt.hops || []).forEach(function (h) {
      var xa = X(h.a), xb = X(h.b), mid = (xa + xb) / 2, ht = Math.min(46, 14 + Math.abs(xb - xa) * 0.35);
      s += '<path d="M' + xa + ' ' + (y - 6) + ' Q' + mid + ' ' + (y - 6 - ht * 2) + ' ' + xb + ' ' + (y - 8) + '" fill="none" style="stroke:var(--strand)" stroke-width="2.5" marker-end="url(#' + (opt.id || 'hp') + ')"/>';
      if (h.t) s += '<text x="' + mid + '" y="' + (y - 10 - ht) + '" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--strand)">' + h.t + '</text>';
    });
    (opt.marks || []).forEach(function (m) {
      var x = X(m.v);
      s += '<circle cx="' + x + '" cy="' + y + '" r="8" style="fill:' + (m.col || 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>';
      if (m.t) s += '<text x="' + Math.min(Math.max(x, 24), W - 24) + '" y="' + (y + (m.up ? -20 + (m.dy || 0) : 52)) + '" text-anchor="middle" font-size="18" font-weight="800">' + m.t + '</text>';
    });
    return Atlas.svg(W, y + (opt.bottom || 40), s, opt.label || 'Number line from ' + min + ' to ' + max);
  };
  /* simple countable things in rows: dots, apples, stars, blocks. n items, cols per row */
  var THING = {
    dot: function (x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:' + c + '" stroke="rgba(0,0,0,.4)" stroke-width="1.2"/>'; },
    apple: function (x, y, r, c) { return '<path d="M' + x + ' ' + (y - r * 0.55) + 'c' + (-r * 1.3) + ' ' + (-r * 0.6) + ' ' + (-r * 1.4) + ' ' + (r * 1.3) + ' 0 ' + (r * 1.45) + 'c' + (r * 1.4) + ' ' + (-r * 0.15) + ' ' + (r * 1.3) + ' ' + (-r * 2.05) + ' 0 ' + (-r * 1.45) + 'z" style="fill:' + (c || '#e03131') + '" stroke="rgba(0,0,0,.4)" stroke-width="1.2"/><path d="M' + x + ' ' + (y - r * 0.55) + 'q' + (r * 0.1) + ' ' + (-r * 0.5) + ' ' + (r * 0.45) + ' ' + (-r * 0.7) + '" fill="none" stroke="#5c3d1e" stroke-width="2"/>'; },
    star: function (x, y, r, c) {
      var p = [];
      for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.45 : r; p.push((x + rad * Math.cos(a)).toFixed(1) + ',' + (y + rad * Math.sin(a)).toFixed(1)); }
      return '<polygon points="' + p.join(' ') + '" style="fill:' + (c || '#f59f00') + '" stroke="rgba(0,0,0,.4)" stroke-width="1.2" stroke-linejoin="round"/>';
    },
    cube: function (x, y, r, c) { return rr(x - r, y - r, 2 * r, 2 * r, 3, c || 'var(--strand)'); },
    fish: function (x, y, r, c) { return '<path d="M' + (x - r) + ' ' + y + 'q' + r + ' ' + (-r * 1.1) + ' ' + (r * 1.6) + ' 0q' + (-r * 0.6) + ' ' + (r * 1.1) + ' ' + (-r * 1.6) + ' 0z" style="fill:' + (c || '#1c7ed6') + '" stroke="rgba(0,0,0,.4)" stroke-width="1.2"/><path d="M' + (x + r * 0.55) + ' ' + y + 'l' + (r * 0.6) + ' ' + (-r * 0.55) + 'v' + (r * 1.1) + 'z" style="fill:' + (c || '#1c7ed6') + '" stroke="rgba(0,0,0,.4)" stroke-width="1.2"/><circle cx="' + (x - r * 0.45) + '" cy="' + (y - r * 0.12) + '" r="' + (r * 0.12) + '" fill="#111"/>'; }
  };
  Atlas.THING = THING;
  D.things = function (n, opt) {
    opt = opt || {};
    var kind = THING[opt.kind || 'dot'], cols = opt.cols || 10, r = opt.r || 11, gap = opt.gap || r * 2.6, s = '';
    for (var i = 0; i < n; i++) {
      var col = opt.cols2 ? opt.cols2[i] : opt.col || 'var(--strand)';
      s += kind(r + 6 + (i % cols) * gap + (opt.split && i % cols >= opt.split ? r : 0), r + 6 + Math.floor(i / cols) * gap, r, col);
    }
    var w = Math.min(n, cols) * gap + 12 + (opt.split ? r : 0), h = Math.ceil(n / cols) * gap + 6;
    return Atlas.svg(Math.max(30, Math.ceil(w)), Math.max(30, Math.ceil(h)), s, opt.label || n + ' ' + (opt.kind || 'dot') + 's');
  };
  /* Canadian coins and bills. Values in cents. */
  Atlas.CASH = {
    5: { n: 'nickel', r: 17, fill: '#c9ced6', ring: '#8d949e', t: '5¢' },
    10: { n: 'dime', r: 14, fill: '#d5d9df', ring: '#8d949e', t: '10¢' },
    25: { n: 'quarter', r: 20, fill: '#c5cad2', ring: '#7f8792', t: '25¢' },
    100: { n: 'loonie', r: 22, fill: '#d8a531', ring: '#9a6d12', t: '$1', sides: 11 },
    200: { n: 'toonie', r: 24, fill: '#c5cad2', ring: '#c09020', t: '$2', inner: '#d8a531' },
    500: { n: '$5 bill', bill: '#4d8fd6', t: '$5' },
    1000: { n: '$10 bill', bill: '#8a5cc2', t: '$10' },
    2000: { n: '$20 bill', bill: '#3f9b5a', t: '$20' },
    5000: { n: '$50 bill', bill: '#d0463b', t: '$50' },
    10000: { n: '$100 bill', bill: '#b98a4e', t: '$100' }
  };
  D.cash = function (v, x, y) {
    var c = Atlas.CASH[v], s = '';
    if (c.bill) {
      s += rr(x, y, 96, 48, 5, c.bill, 'stroke="rgba(0,0,0,.5)" stroke-width="1.5"');
      s += '<rect x="' + (x + 5) + '" y="' + (y + 5) + '" width="86" height="38" rx="3" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/>';
      s += '<circle cx="' + (x + 30) + '" cy="' + (y + 24) + '" r="11" fill="rgba(255,255,255,.35)"/>';
      s += '<text x="' + (x + 70) + '" y="' + (y + 31) + '" text-anchor="middle" font-size="19" font-weight="800" style="fill:#fff">' + c.t + '</text>';
      return { s: s, w: 96, h: 48 };
    }
    var r = c.r, cx = x + r, cy = y + r;
    if (c.sides) {
      var p = [];
      for (var i = 0; i < c.sides; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / c.sides; p.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
      s += '<polygon points="' + p.join(' ') + '" style="fill:' + c.fill + ';stroke:' + c.ring + '" stroke-width="2" stroke-linejoin="round"/>';
    } else s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:' + c.fill + ';stroke:' + c.ring + '" stroke-width="' + (c.inner ? 5 : 2) + '"/>';
    if (c.inner) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 8) + '" style="fill:' + c.inner + '"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 3.5) + '" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1"/>';
    s += '<text x="' + cx + '" y="' + (cy + r * 0.3) + '" text-anchor="middle" font-size="' + (r * 0.75).toFixed(1) + '" font-weight="800" style="fill:#2a2118">' + c.t + '</text>';
    return { s: s, w: 2 * r, h: 2 * r };
  };
  /* a row (wrapping) of coins and bills, biggest first unless opt.keep */
  D.wallet = function (list, opt) {
    opt = opt || {};
    var W = opt.W || 520, x = 4, y = 4, rowH = 0, s = '', maxX = 0;
    var L = opt.keep ? list.slice() : list.slice().sort(function (a, b) { return b - a; });
    L.forEach(function (v) {
      var c = Atlas.CASH[v], w = c.bill ? 96 : 2 * c.r, h = c.bill ? 48 : 2 * c.r;
      if (x + w > W) { x = 4; y += rowH + 8; rowH = 0; }
      var it = D.cash(v, x, y + (c.bill ? 0 : Math.max(0, 24 - c.r)));
      s += it.s; x += w + 8; maxX = Math.max(maxX, x); rowH = Math.max(rowH, c.bill ? 48 : 48);
    });
    var tot = L.reduce(function (a, b) { return a + b; }, 0), k = opt.scale || 1;
    if (k !== 1) s = '<g transform="scale(' + k + ')">' + s + '</g>';
    return Atlas.svg(Math.ceil(Math.max(maxX, 40) * k), Math.ceil((y + rowH + 6) * k), s, opt.label || L.map(function (v) { return Atlas.CASH[v].n; }).join(', ') + '. Total ' + Atlas.cents(tot));
  };
  Atlas.cents = function (c) { return c < 100 ? c + '¢' : '$' + (c % 100 ? (c / 100).toFixed(2) : c / 100); };
  /* decorative row for the home page: blocks, a ten-frame, a ruler, shapes */
  Atlas.heroArt = function () {
    var s = '';
    s += D.base10(1, 2, 3, { u: 7 }).replace(/<svg[^>]*>|<\/svg>/g, '');
    s = '<g transform="translate(6,10)">' + s + '</g>';
    s += '<g transform="translate(190,22)"><circle cx="24" cy="30" r="24" style="fill:var(--sb)" opacity=".85"/><polygon points="70,54 96,6 122,54" style="fill:var(--sd)" opacity=".85"/><rect x="134" y="8" width="46" height="46" rx="6" style="fill:var(--se)" opacity=".85"/></g>';
    s += '<g transform="translate(390,30)">' + rr(0, 0, 150, 34, 6, 'var(--hi)') ;
    for (var i = 0; i <= 15; i++) s += '<line x1="' + (6 + i * 9.2) + '" y1="0" x2="' + (6 + i * 9.2) + '" y2="' + (i % 5 ? 9 : 15) + '" style="stroke:#2a2118" stroke-width="1.5"/>';
    s += '</g>';
    return '<svg viewBox="0 0 550 100" width="550" aria-hidden="true">' + s + '</svg>';
  };
})();
