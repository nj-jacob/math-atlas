/* Grade 1 settings for the shared grade app (assets/engine/site.js): chapters, home page text and options,
   then Grade 1's own pictures and controls for its chapters. */
Atlas.setup({
  grade: 1,
  tools: ['counters', 'base10', 'hundred', 'numberline', 'fractions', 'balance', 'patterns', 'data', 'grid', 'solids', 'coins', 'geoboard'],
  meta: [
    { id: 'counting', title: 'Counting to 50', sub: 'read, count, skip count, estimate', strand: 'B', codes: 'B1.1, B1.4, B1.5',
      desc: 'Ten frames, the number chart, counting by 2s, 5s and 10s, and good guesses.' },
    { id: 'tens-ones', title: 'Tens and Ones', sub: 'make, break apart, compare', strand: 'B', codes: 'B1.2, B1.3',
      desc: 'Build numbers with tens and ones, split them in different ways, and find the bigger one.' },
    { id: 'add-sub-10', title: 'Adding and Subtracting to 10', sub: 'the facts to 10', strand: 'B', codes: 'B2.1, B2.2',
      desc: 'Number pairs that make 10, adding, taking away, and how adding and subtracting are linked.' },
    { id: 'add-sub-50', title: 'Adding and Subtracting to 50', sub: 'mental math and stories', strand: 'B', codes: 'B2.3, B2.4, C2.2, C2.3',
      desc: 'Count on, make a ten, story problems, and checking if two sides are equal.' },
    { id: 'groups-shares', title: 'Equal Groups and Fair Shares', sub: 'sharing, halves and fourths', strand: 'B', codes: 'B2.5, B1.6, B1.7, B1.8',
      desc: 'Make equal groups, share fairly, and cut things into halves and fourths.' },
    { id: 'patterns', title: 'Patterns', sub: 'find, make, continue', strand: 'C', codes: 'C1.1 to C1.4, C2.1',
      desc: 'Repeating patterns, what comes next, missing parts, and number patterns.' },
    { id: 'shapes-position', title: 'Shapes, Position and Coding', sub: 'shapes, where things are, directions', strand: 'E', codes: 'E1.1 to E1.5, C3.1, C3.2',
      desc: 'Flat shapes and solids, matching halves, position words, and step-by-step directions.' },
    { id: 'measuring', title: 'Measuring and the Calendar', sub: 'longer, heavier, holds more', strand: 'E', codes: 'E2.1 to E2.3',
      desc: 'Compare length, area, mass and capacity, and read a calendar.' },
    { id: 'data', title: 'Sorting and Picture Graphs', sub: 'sort, tally, graph, chance', strand: 'D', codes: 'D1.1 to D2.2',
      desc: 'Sort things, make tally tables and picture graphs, and decide if something is possible.' },
    { id: 'money', title: 'Canadian Money', sub: 'coins and bills', strand: 'F', codes: 'F1.1',
      desc: 'Know each coin and bill, and tell which is worth more.' },
    { id: 'fact-sheet', title: 'Fact Sheet', sub: 'the key facts on one page', strand: 'B', ref: true,
      desc: 'Numbers to 50, facts to 10, shapes, coins and bills.' }
  ],
  home: {
    hero: function () {
      return '<div class="herot"><h1>Grade 1 Math</h1>' +
        '<p class="lede">Free lessons for Ontario Grade 1 math. One idea at a time, hands-on blocks and counters, and lots of practice.</p></div>' +
        '<div class="herof" aria-hidden="true">' + Atlas.draw.frames(7, { r: 1, w: 210 }) + '</div>';
    },
    intro: '<ol class="howto" aria-label="How each chapter works">' +
      '<li><b>Learn</b><span>one idea on screen at a time</span></li>' +
      '<li><b>Watch</b><span>a short clip shows it</span></li>' +
      '<li><b>Try it</b><span>blocks and counters that light up and count</span></li>' +
      '<li><b>Your turn</b><span>quick taps, fix any mistakes</span></li>' +
      '<li><b>Practise</b><span>new questions that get harder or easier</span></li>' +
      '<li><b>Quiz</b><span>7 questions on the chapter</span></li></ol>',
    start: '<p><b>Not sure where to start?</b> Try the <a href="#check-up">check-up</a>. The short one has 10 questions and makes a practice plan. Or just start at Chapter 1.</p>',
    legend: 'below',
    /* each chapter card shows its number as a small ten frame */
    card: function (m, i, stats) {
      var n = i + 1, s = '';
      for (var k = 0; k < 10; k++) {
        var x = 3 + (k % 5) * 14, y = 3 + Math.floor(k / 5) * 14;
        s += '<rect x="' + x + '" y="' + y + '" width="14" height="14" style="fill:var(--card);stroke:var(--strand)" stroke-width="1.5"/>';
        if (k < n) s += '<circle cx="' + (x + 7) + '" cy="' + (y + 7) + '" r="4.6" style="fill:var(--strand)"/>';
      }
      return '<a class="card" data-strand="' + m.strand + '" href="#' + m.id + '">' +
        '<span class="no">' + (m.ref ? '<b>Ref</b>' : '<svg viewBox="0 0 76 34" width="76" height="34" aria-hidden="true">' + s + '</svg><b>' + n + '</b>') + '</span><h2>' + m.title + '</h2><p class="desc">' + m.desc + '</p>' +
        '<div class="meta"><span class="pill" data-strand="' + m.strand + '">' + Atlas.strands[m.strand] + '</span>' + stats + '</div></a>';
    },
    notes: '<p><b>For grown-ups.</b> This site follows the five content strands (B to F) of the 2020 Ontario elementary math curriculum for Grade 1. ' +
      'It is a study aid, not a copy of the curriculum. Please check details against the Ontario Ministry of Education document.</p>' +
      '<p><b>How to help.</b> Sit with your child, read the words together, and let them tap the answers. Real objects help a lot: buttons, coins, pasta or blocks to count. Ten minutes a day is better than an hour once a week.</p>' +
      '<p><b>Not covered:</b> strand A (social-emotional learning and math processes) is woven through, not taught on its own. Mathematical modelling (C4) has no chapter of its own. Real-world tasks like collecting data from classmates or measuring with real objects are suggested, but can only be done away from the screen.</p>'
  },
  right: 'Yes, that is right.',
  right2: 'Right on the second try.',
  input: { mode: 'numeric', placeholder: '?', pad: true },
  svgScale: 1.3,
  checkup: {
    steps: [
      'Each question is new. There are no hints and no time limit.',
      'If you do not know, choose <b>"I\'m not sure yet"</b>. That is more useful than a guess.',
      'At the end you see every answer, what each question checked, and a plan for what to practise.',
      'Questions start easy, with pictures. A chapter check-up asks one easy question for every skill, then a few a step harder.',
      'Your practice levels change to match your results.'
    ],
    whole: [
      { scope: 'short', per: 1, label: 'Short check-up', button: 'Short check-up: 10 easy questions' },
      { scope: 'all', per: 2, label: 'Full check-up', button: 'Longer check-up: 20 easy questions', alt: true }
    ],
    note: '<p class="t2">For a young child, the short check-up in one sitting is plenty. A grown-up can read each question aloud.</p>'
  }
});

(function () {
  'use strict';
  var $ = Atlas.$;
  var SEED = 1;
  function rnd() { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; }
  /* a counter: red (k 0), yellow (k 1), or an empty dashed ring (k 2) */
  function counter(x, y, r, k) {
    if (k === 2) return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:none;stroke:var(--ink2)" stroke-width="1.5" stroke-dasharray="3 3"/>';
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:var(--c' + (k ? 'B' : 'A') + ')" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>';
  }
  Atlas.draw.counter = counter;
  /* ten frames for n (up to 50). o.b extra yellow counters after the red ones, o.x: the last x counters are crossed out,
     o.r frames per row, o.c cell size, o.ghost empty rings for the rest of a target */
  Atlas.draw.frames = function (n, o) {
    o = o || {};
    var b = o.b || 0, tot = n + b, nf = Math.max(1, Math.ceil(Math.max(tot, o.min || 0) / 10)), c = o.c || 26, fw = c * 5, fh = c * 2;
    var per = o.r || Math.max(1, Math.min(nf, Math.floor(((o.w || 560) + 14) / (fw + 14)))), rows = Math.ceil(nf / per), s = '';
    for (var f = 0; f < nf; f++) {
      var fx = 4 + (f % per) * (fw + 14), fy = 4 + Math.floor(f / per) * (fh + 14);
      s += '<rect x="' + fx + '" y="' + fy + '" width="' + fw + '" height="' + fh + '" rx="4" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>';
      for (var i = 1; i < 5; i++) s += '<line x1="' + (fx + i * c) + '" y1="' + fy + '" x2="' + (fx + i * c) + '" y2="' + (fy + fh) + '" style="stroke:var(--ink)" stroke-width="1.2"/>';
      s += '<line x1="' + fx + '" y1="' + (fy + c) + '" x2="' + (fx + fw) + '" y2="' + (fy + c) + '" style="stroke:var(--ink)" stroke-width="1.2"/>';
      for (var j = 0; j < 10; j++) {
        var k = f * 10 + j, cx = fx + (j % 5) * c + c / 2, cy = fy + Math.floor(j / 5) * c + c / 2;
        if (k < tot) {
          s += counter(cx, cy, c * 0.36, k < n ? 0 : 1);
          if (o.x && k >= tot - o.x) s += '<path d="M' + (cx - c * .3) + ' ' + (cy - c * .3) + 'L' + (cx + c * .3) + ' ' + (cy + c * .3) + 'M' + (cx + c * .3) + ' ' + (cy - c * .3) + 'L' + (cx - c * .3) + ' ' + (cy + c * .3) + '" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round"/>';
        } else if (o.ghost && k < o.ghost) s += counter(cx, cy, c * 0.36, 2);
      }
    }
    var W = 8 + Math.min(nf, per) * (fw + 14) - 14, H = 8 + rows * (fh + 14) - 14;
    return Atlas.svg(W, H, s, o.label || (tot + ' counter' + (tot === 1 ? '' : 's') + ' in ten frames' + (b ? ': ' + n + ' red and ' + b + ' yellow' : '') + (o.x ? ', ' + o.x + ' crossed out' : '')));
  };
  /* simple object pictures, centred on x, y, about s across */
  Atlas.icon = function (kind, x, y, s) {
    var r = s / 2, t = function (a) { return 'translate(' + x + ' ' + y + ') scale(' + (s / 40) + ')' + (a || ''); };
    switch (kind) {
      case 'apple': return '<g transform="' + t() + '"><path d="M0-10C-6-16-19-14-19 0C-19 13-9 20 0 16C9 20 19 13 19 0C19-14 6-16 0-10Z" style="fill:#d9412b" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><path d="M0-10Q1-16 5-19" style="stroke:#6b3e1f;fill:none" stroke-width="2.5" stroke-linecap="round"/><path d="M3-14Q11-20 14-12Q7-9 3-14Z" style="fill:#3d9a46"/></g>';
      case 'star': return '<g transform="' + t() + '"><path d="M0-19L5.6-6.2L19.5-5.6L8.6 3L12.4 16.4L0 8.6L-12.4 16.4L-8.6 3L-19.5-5.6L-5.6-6.2Z" style="fill:#f2b81f" stroke="rgba(0,0,0,.35)" stroke-width="1.5" stroke-linejoin="round"/></g>';
      case 'fish': return '<g transform="' + t() + '"><path d="M-14 0C-8-12 10-12 16 0C10 12-8 12-14 0Z" style="fill:#2f86d6" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><path d="M-13 0L-20-9L-20 9Z" style="fill:#2f86d6" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><circle cx="8" cy="-3" r="2.2" style="fill:#13203a"/></g>';
      case 'flower': return '<g transform="' + t() + '">' + [0, 72, 144, 216, 288].map(function (a) { return '<ellipse cx="0" cy="-10" rx="6.5" ry="9" transform="rotate(' + a + ')" style="fill:#e05aa0" stroke="rgba(0,0,0,.3)" stroke-width="1.2"/>'; }).join('') + '<circle r="6" style="fill:#f6c431" stroke="rgba(0,0,0,.3)" stroke-width="1.2"/></g>';
      case 'ball': return '<g transform="' + t() + '"><circle r="17" style="fill:#f08a24" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/><path d="M-17 0H17M0-17V17M-12-12Q0 0-12 12M12-12Q0 0 12 12" style="stroke:rgba(0,0,0,.45);fill:none" stroke-width="1.5"/></g>';
      case 'leaf': return '<g transform="' + t() + '"><path d="M-16 14C-18-6-4-18 16-16C18 4 4 18-16 14Z" style="fill:#3d9a46" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><path d="M-16 14L10-10" style="stroke:#1f5e27" stroke-width="1.5"/></g>';
      case 'sock': return '<g transform="' + t() + '"><path d="M-6-18H6V4L12 8C17 11 14 19 7 18L-4 14C-8 12-6 8-6 4Z" style="fill:#7b5cd6" stroke="rgba(0,0,0,.35)" stroke-width="1.5" stroke-linejoin="round"/><path d="M-6-12H6" style="stroke:#fff" stroke-width="3"/></g>';
      case 'hand': return '<g transform="' + t() + '" style="fill:#e8b48a" stroke="rgba(0,0,0,.4)" stroke-width="1.3"><rect x="-11" y="-2" width="22" height="20" rx="8"/>' +
        [[-11, -18, 5], [-5, -21, 5], [1, -20, 5], [7, -16, 4.5]].map(function (f) { return '<rect x="' + f[0] + '" y="' + f[1] + '" width="' + f[2] + '" height="22" rx="2.5"/>'; }).join('') + '<rect x="9" y="0" width="14" height="5" rx="2.5" transform="rotate(-35 9 2)"/></g>';
      case 'car': return '<g transform="' + t() + '"><path d="M-18 6V-2L-12-4L-7-12H7L12-4L18-2V6Z" style="fill:#c8323b" stroke="rgba(0,0,0,.4)" stroke-width="1.5" stroke-linejoin="round"/><path d="M-5-10H5L8-4H-8Z" style="fill:#cfe6f7"/><circle cx="-10" cy="7" r="4.5" style="fill:#222"/><circle cx="10" cy="7" r="4.5" style="fill:#222"/></g>';
      case 'cube': return '<g transform="' + t() + '"><rect x="-12" y="-12" width="24" height="24" rx="2" style="fill:var(--p0)" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/></g>';
    }
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
  };
  Atlas.NAMES = { apple: ['apple', 'apples'], star: ['star', 'stars'], fish: ['fish', 'fish'], flower: ['flower', 'flowers'], ball: ['ball', 'balls'], leaf: ['leaf', 'leaves'], sock: ['sock', 'socks'], hand: ['hand', 'hands'], car: ['car', 'cars'], cube: ['cube', 'cubes'] };
  Atlas.nm = function (kind, n) { return n + ' ' + Atlas.NAMES[kind][n === 1 ? 0 : 1]; };
  /* n objects in rows. o.per per row, o.group puts a gap after each group, o.s size */
  Atlas.draw.row = function (kind, n, o) {
    o = o || {};
    var sz = o.s || 34, per = o.per || 10, g = o.group || 0, gap = 6, gg = g ? 14 : 0, s = '', maxX = 0;
    for (var i = 0; i < n; i++) {
      var col = i % per, row = Math.floor(i / per), x = 4 + col * (sz + gap) + (g ? Math.floor(col / g) * gg : 0) + sz / 2, y = 4 + row * (sz + gap) + sz / 2;
      s += Atlas.icon(kind, x, y, sz);
      maxX = Math.max(maxX, x + sz / 2);
    }
    var rows = Math.ceil(n / per) || 1;
    return Atlas.svg(Math.ceil(maxX + 4) || 40, rows * (sz + gap) + 4, s, o.label || Atlas.nm(kind, n));
  };
  /* a messy collection of n objects, the same picture for the same seed */
  Atlas.draw.scatter = function (n, seed, o) {
    o = o || {};
    SEED = seed || 7;
    var W = o.w || 360, H = o.h || 220, r = o.r || 11, pts = [], s = '', tries = 0;
    while (pts.length < n && tries < 20000) {
      tries++;
      var x = r + 4 + rnd() * (W - 2 * r - 8), y = r + 4 + rnd() * (H - 2 * r - 8), ok = true;
      for (var i = 0; i < pts.length; i++) { var dx = pts[i][0] - x, dy = pts[i][1] - y; if (dx * dx + dy * dy < (2.3 * r) * (2.3 * r)) { ok = false; break; } }
      if (ok) pts.push([x, y]);
    }
    s += '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="14" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>';
    pts.forEach(function (p) { s += o.kind ? Atlas.icon(o.kind, p[0], p[1], r * 2.1) : counter(p[0], p[1], r, 0); });
    return Atlas.svg(W, H, s, o.label || 'A group of ' + (o.kind ? Atlas.NAMES[o.kind][1] : 'counters') + ' spread out');
  };
  /* number line a..b. o.mark a dot, o.hops [[from, to], ...] drawn as arcs, o.lab label every k, o.ring circled numbers */
  Atlas.draw.nl = function (a, b, o) {
    o = o || {};
    var W = o.w || 400, x0 = 20, x1 = W - 20, n = b - a, top = o.hops && o.hops.length ? 46 : 8, y = top + 18, s = '';
    var X = function (v) { return x0 + (x1 - x0) * (v - a) / n; };
    var lab = o.lab || (n <= 12 ? 1 : n <= 50 ? 5 : 10), ring = o.ring || [], fs = o.fs || (n > 12 ? 20 : 22);
    /* which numbers get a label: ringed, the dot, every lab-th number, then the ends; skip any that would touch a kept label */
    var want = [], kept = ring.slice();
    if (o.mark !== undefined && o.mark !== null) want.push(o.mark);
    for (var v = a; v <= b; v++) if (v % lab === 0) want.push(v);
    want.push(a, b);
    want.forEach(function (v) {
      if (kept.indexOf(v) >= 0) return;
      var gap = fs * (String(v).length * 0.3 + 0.35);
      if (kept.every(function (k) { return Math.abs(X(k) - X(v)) >= gap + fs * String(k).length * 0.3; })) kept.push(v);
    });
    s += '<line x1="' + (x0 - 10) + '" y1="' + y + '" x2="' + (x1 + 10) + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (v = a; v <= b; v++) {
      var big = kept.indexOf(v) >= 0;
      s += '<line x1="' + X(v) + '" y1="' + (y - (big ? 9 : 5)) + '" x2="' + X(v) + '" y2="' + (y + (big ? 9 : 5)) + '" style="stroke:var(--ink)" stroke-width="' + (big ? 2 : 1.3) + '"/>';
      if (big) s += '<text x="' + X(v) + '" y="' + (y + 28) + '" text-anchor="middle" font-size="' + fs + '" class="tb">' + v + '</text>';
    }
    (o.ring || []).forEach(function (v) { s += '<circle cx="' + X(v) + '" cy="' + (y + 22) + '" r="14" style="fill:none;stroke:var(--accent)" stroke-width="2.5"/>'; });
    (o.hops || []).forEach(function (h) {
      var xa = X(h[0]), xb = X(h[1]), mid = (xa + xb) / 2, ht = Math.min(36, 10 + Math.abs(xb - xa) * 0.45);
      s += '<path d="M' + xa + ' ' + (y - 4) + ' Q' + mid + ' ' + (y - 4 - ht * 2) + ' ' + xb + ' ' + (y - 4) + '" fill="none" style="stroke:var(--accent)" stroke-width="2.5"/>' +
        '<path d="M' + xb + ' ' + (y - 4) + 'l' + (xb > xa ? -7 : 7) + ' -6 M' + xb + ' ' + (y - 4) + 'l' + (xb > xa ? -1 : 1) + ' -9" style="stroke:var(--accent)" stroke-width="2.5" stroke-linecap="round" fill="none"/>';
      if (h[2]) s += '<text x="' + mid + '" y="' + (y - 8 - ht) + '" text-anchor="middle" font-size="20" class="tb" style="fill:var(--accent)">' + h[2] + '</text>';
    });
    if (o.mark !== undefined && o.mark !== null) s += '<circle cx="' + X(o.mark) + '" cy="' + y + '" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return Atlas.svg(W, y + 40, s, o.label || 'Number line from ' + a + ' to ' + b);
  };
  /* the number chart, 1 to 50 (or o.to), ten in a row. o.cls {n: class}, o.hide [n...] shows a blank */
  Atlas.chart = function (o) {
    o = o || {};
    var to = o.to || 50, from = o.from || 1, h = '<div class="nchart" role="img" aria-label="' + (o.label || 'Number chart from ' + from + ' to ' + to) + '">';
    for (var v = from; v <= to; v++) {
      var hide = o.hide && o.hide.indexOf(v) >= 0;
      h += '<span class="' + ((o.cls && o.cls[v]) || '') + (hide ? ' hid' : '') + '" data-v="' + v + '">' + (hide ? '?' : v) + '</span>';
    }
    return h + '</div>';
  };
  /* tens and ones as base-ten rods and small cubes, side by side. Small enough for a phone. */
  Atlas.draw.tens = function (t, o1, o) {
    o = o || {};
    var u = o.u || 11, s = '', x = 4, h = u * 10;
    for (var i = 0; i < t; i++) {
      s += '<rect x="' + x + '" y="4" width="' + u + '" height="' + h + '" rx="2" style="fill:var(--p1)" stroke="rgba(0,0,0,.45)" stroke-width="1.3"/>';
      for (var j = 1; j < 10; j++) s += '<line x1="' + x + '" y1="' + (4 + j * u) + '" x2="' + (x + u) + '" y2="' + (4 + j * u) + '" stroke="rgba(0,0,0,.3)"/>';
      x += u + 6;
    }
    if (t && o1) x += 10;
    for (var k = 0; k < o1; k++) {
      var cx = x + (k % 2) * (u + 4), cy = 4 + h - u - Math.floor(k / 2) * (u + 4);
      s += '<rect x="' + cx + '" y="' + cy + '" width="' + u + '" height="' + u + '" rx="2" style="fill:var(--p0)" stroke="rgba(0,0,0,.45)" stroke-width="1.3"/>';
    }
    if (o1) x += o1 > 1 ? 2 * u + 4 : u;
    return Atlas.svg(Math.max(x + 4, 30), h + 8, s, o.label || t + ' ten' + (t === 1 ? '' : 's') + ' and ' + o1 + ' one' + (o1 === 1 ? '' : 's'));
  };
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  /* number words up to 99 */
  Atlas.word = function (n) {
    if (n < 20) return ONES[n];
    return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  };

  /* a big minus / number / plus control. Markup: Atlas.stepHtml(id, label, value). Returns a getter/setter. */
  Atlas.stepHtml = function (id, label, v) {
    return '<div class="ctrl"><span class="stepl" id="' + id + '-l">' + label + '</span><div class="step" role="group" aria-labelledby="' + id + '-l"><button type="button" data-d="-1" aria-label="One less">&minus;</button>' +
      '<output id="' + id + '" aria-live="polite">' + v + '</output><button type="button" data-d="1" aria-label="One more">+</button></div></div>';
  };
  Atlas.stepper = function (root, id, min, max, fn) {
    var out = $('#' + id, root), wrap = out.parentNode, v = +out.textContent;
    function set(n) { v = Math.max(min, Math.min(max, n)); out.textContent = v; Atlas.$$('button', wrap)[0].disabled = v <= min; Atlas.$$('button', wrap)[1].disabled = v >= max; fn(v); }
    Atlas.$$('button', wrap).forEach(function (b) { b.addEventListener('click', function () { set(v + +b.getAttribute('data-d')); }); });
    set(v);
    return { get: function () { return v; }, set: set };
  };
})();
