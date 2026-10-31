(function () {
  var A = Atlas, R = A.R;
  var ones = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  var tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  function words(n) {
    if (n === 1000) return 'one thousand';
    if (n === 0) return 'zero';
    var s = '';
    if (n >= 100) { s += ones[Math.floor(n / 100)] + ' hundred'; n %= 100; if (n) s += ' '; }
    if (n >= 20) { s += tens[Math.floor(n / 10)]; if (n % 10) s += '-' + ones[n % 10]; }
    else if (n > 0) s += ones[n];
    return s;
  }
  var heads = ['Ones', 'Tens', 'Hundreds', 'Thousands'];
  var uid = 0;
  function mid(base) { uid++; return base + uid; }
  function plural(k, p) { return k + ' ' + (k === 1 ? A.PLACE1[p] : A.PLACES[p]); }
  function digitsOf(n) { return [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10, Math.floor(n / 1000)]; }

  /* a tiny picture of d blocks of one place, for inside a chart column */
  function mini(d, p) {
    if (!d) return '';
    var s = '', col = A.pc(p), i;
    if (p === 3) s = A.draw.prism(6, 36, 26, 22, 26, 3, 3, 3, 3);
    else if (p === 2) for (i = 0; i < d; i++) s += '<rect x="' + (2 + (i % 3) * 13) + '" y="' + (2 + Math.floor(i / 3) * 13) + '" width="11" height="11" rx="1" style="fill:' + col + '" stroke="rgba(0,0,0,.45)"/>';
    else if (p === 1) for (i = 0; i < d; i++) s += '<rect x="' + (1 + i * 4.3) + '" y="2" width="3.4" height="36" style="fill:' + col + '" stroke="rgba(0,0,0,.45)" stroke-width=".8"/>';
    else for (i = 0; i < d; i++) s += '<rect x="' + (5 + (i % 3) * 11) + '" y="' + (5 + Math.floor(i / 3) * 11) + '" width="8" height="8" style="fill:' + col + '" stroke="rgba(0,0,0,.45)"/>';
    return A.svg(40, 40, s, plural(d, p));
  }
  /* place value chart: coloured headings, the digit, small blocks, and its value. o.cols, o.hl (column index), o.vals */
  function chart(n, o) {
    o = o || {};
    var s = String(n), cols = o.cols || Math.max(3, s.length);
    while (s.length < cols) s = '0' + s;
    var lead = cols - String(n).length, h = '<div class="pv" style="max-width:' + (cols * 104) + 'px;margin:8px auto">';
    for (var i = 0; i < cols; i++) {
      var p = cols - 1 - i, d = +s.charAt(i), dim = i < lead && !(i === cols - 1);
      h += '<div' + (i === o.hl ? ' class="on"' : '') + '><span class="h c' + p + '"><span class="lg">' + heads[p] + '</span><span class="sm">' + heads[p] + '</span></span><span class="d' + (dim ? ' dim' : '') + '">' + d + '</span>' +
        (o.dots === false ? '' : '<span class="dk">' + (dim ? '' : mini(d, p)) + '</span>') +
        (o.vals ? '<span class="v">' + (dim || !d ? '' : A.fmt(d * Math.pow(10, p))) + '</span>' : '') + '</div>';
    }
    return h + '</div>';
  }
  /* each coloured digit drops down to the value it stands for */
  function expanded(n) {
    var s = String(n), len = s.length, cw = Math.min(130, 520 / len), x0 = 280 - cw * len / 2, id = mid('exa'), out = '';
    out += '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    for (var i = 0; i < len; i++) {
      var p = len - 1 - i, d = +s.charAt(i), cx = x0 + cw * (i + 0.5), val = d * Math.pow(10, p);
      out += '<text x="' + cx + '" y="46" text-anchor="middle" font-size="46" font-weight="800" style="font-family:var(--display);fill:var(--p' + p + ')">' + d + '</text>' +
        '<line x1="' + cx + '" y1="56" x2="' + cx + '" y2="84" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#' + id + ')"/>' +
        '<rect x="' + (cx - cw / 2 + 10) + '" y="90" width="' + (cw - 20) + '" height="38" rx="8" style="fill:' + (d ? 'color-mix(in srgb,var(--p' + p + ') 16%,var(--card))' : 'var(--card)') + ';stroke:var(--p' + p + ')" stroke-width="2.5"' + (d ? '' : ' stroke-dasharray="5 4"') + '/>' +
        '<text x="' + cx + '" y="118" text-anchor="middle" font-size="24" font-weight="700"' + (d ? '' : ' class="t2"') + '>' + A.fmt(val) + '</text>' +
        '<text x="' + cx + '" y="154" text-anchor="middle" font-size="18" class="t2">' + plural(d, p) + '</text>';
      if (i < len - 1) out += '<text x="' + (cx + cw / 2) + '" y="118" text-anchor="middle" font-size="24" font-weight="700">+</text>';
    }
    return A.svg(560, 164, out, A.fmt(n) + ' in expanded form');
  }
  /* a hill over a number line: halfway is the top, and the number rolls to the side it is on */
  function hill(n, p) {
    var lo = Math.floor(n / p) * p, hi = lo + p, t = (n - lo) / p, up = n - lo >= p / 2, id = mid('rha');
    var x = 40 + 480 * t, y = 100 - 150 * t * (1 - t), s = '';
    s += '<path d="M40 100 Q280 -50 520 100" fill="none" style="stroke:var(--line)" stroke-width="10" stroke-linecap="round"/>';
    s += '<line x1="280" y1="25" x2="280" y2="132" style="stroke:var(--ink2)" stroke-dasharray="4 4" stroke-width="1.5"/>';
    s += '<line x1="40" y1="132" x2="520" y2="132" style="stroke:var(--ink)" stroke-width="3"/>';
    for (var i = 0; i <= 10; i++) {
      var tx = 40 + 48 * i;
      s += '<line x1="' + tx + '" y1="' + (i % 5 ? 126 : 122) + '" x2="' + tx + '" y2="' + (i % 5 ? 138 : 142) + '" style="stroke:var(--ink)" stroke-width="2"/>';
    }
    [[40, lo, 'lower'], [280, lo + p / 2, 'halfway'], [520, hi, 'upper']].forEach(function (k) {
      s += '<text x="' + k[0] + '" y="166" text-anchor="middle" font-size="21" class="tb">' + A.fmt(k[1]) + '</text><text x="' + k[0] + '" y="186" text-anchor="middle" class="t2" font-size="16">' + k[2] + '</text>';
    });
    if (n !== lo) {
      var ex = up ? 500 : 60;
      s += '<path d="M' + x + ' ' + (y - 16) + ' Q' + ((x + ex) / 2) + ' ' + (Math.min(y, 80) - 30) + ' ' + ex + ' 86" fill="none" style="stroke:var(--accent)" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#' + id + ')"/>';
    }
    s = '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>' + s;
    s += '<circle cx="' + (n === lo ? 40 : up ? 520 : 40) + '" cy="132" r="11" style="fill:none;stroke:var(--accent)" stroke-width="4"/>';
    s += '<circle cx="' + x + '" cy="' + (y - 9) + '" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + Math.min(Math.max(x, 60), 500) + '" y="' + (y - 26) + '" text-anchor="middle" font-size="21" class="tb">' + A.fmt(n) + '</text>';
    return A.svg(560, 194, s, A.fmt(n) + ' on a hill between ' + lo + ' and ' + hi + '. It rounds to ' + (n === lo ? lo : up ? hi : lo) + '.');
  }
  /* 1 cube, 10 make a rod, 10 rods make a flat, 10 flats make a big cube */
  function stairs() {
    var P = A.draw.prism, s = '', u = 8, base = 150, id = mid('sta');
    s += '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    function arrow(x1, x2, y) {
      return '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#' + id + ')"/>' +
        '<text x="' + ((x1 + x2) / 2) + '" y="' + (y - 8) + '" text-anchor="middle" font-size="18" class="tb">10 make</text>';
    }
    function lab(x, y, a, b, p) {
      return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="26" font-weight="800" style="fill:var(--p' + p + ')">' + a + '</text>' +
        '<text x="' + x + '" y="' + (y + 24) + '" text-anchor="middle" font-size="19" class="t2">' + b + '</text>';
    }
    s += P(34, base, u, u, u, 1, 1, 1, 0) + lab(40, base + 30, '1', 'one', 0) + arrow(56, 104, base - 40);
    s += P(120, base, u, u, 10 * u, 1, 1, 10, 1) + lab(126, base + 30, '10', 'ten', 1) + arrow(140, 196, base - 40);
    s += P(206, base, 10 * u, u, 10 * u, 10, 1, 10, 2) + lab(248, base + 30, '100', 'hundred', 2) + arrow(298, 352, base - 40);
    s += P(366, base, 10 * u, 10 * u, 10 * u, 10, 10, 10, 3) + lab(422, base + 30, '1000', 'thousand', 3);
    return A.svg(560, 214, s, 'Base-ten blocks. A small cube is one. 10 cubes make a rod, which is ten. 10 rods make a flat, which is one hundred. 10 flats make a big cube, which is one thousand.');
  }
  /* the blocks for a number, one coloured column per place. c = [ones, tens, hundreds] */
  function columns(c) {
    var B = A.draw.block, s = '', u = 5, colW = [180, 160, 90], x0 = [0, 180, 340], top = 34, maxY = 0;
    for (var q = 2; q >= 0; q--) {
      var x = x0[2 - q], w = colW[2 - q];
      s += '<rect x="' + (x + 2) + '" y="2" width="' + (w - 8) + '" height="26" rx="6" style="fill:var(--p' + q + ')"/>' +
        '<text x="' + (x + 2 + (w - 8) / 2) + '" y="20" text-anchor="middle" font-size="16" font-weight="700" style="fill:' + (q ? '#fff' : '#13203a') + '">' + plural(c[q], q) + '</text>';
      for (var i = 0; i < c[q]; i++) {
        var bx, by;
        if (q === 2) { bx = x + 4 + (i % 3) * 58; by = top + 54 + Math.floor(i / 3) * 59; }
        else if (q === 1) { bx = x + 4 + (i % 10) * 15; by = top + 54 + Math.floor(i / 10) * 60; }
        else { bx = x + 6 + (i % 5) * 15; by = top + 10 + Math.floor(i / 5) * 15; }
        s += B(bx, by, q, u).svg;
        maxY = Math.max(maxY, by);
      }
    }
    return A.svg(430, Math.max(80, maxY + 8), s, plural(c[2], 2) + ', ' + plural(c[1], 1) + ' and ' + plural(c[0], 0));
  }
  /* hops on a number line. vals: the numbers landed on, in order. miss: index shown as a question mark */
  function hops(vals, miss) {
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), x0 = 40, x1 = 520, s = '';
    var X = function (v) { return hi === lo ? 280 : x0 + (x1 - x0) * (v - lo) / (hi - lo); };
    s += '<line x1="' + (x0 - 18) + '" y1="80" x2="' + (x1 + 18) + '" y2="80" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i < vals.length; i++) {
      var x = X(vals[i]);
      s += '<line x1="' + x + '" y1="72" x2="' + x + '" y2="88" style="stroke:var(--ink)" stroke-width="2"/>';
      if (i === miss) s += '<rect x="' + (x - 24) + '" y="94" width="48" height="28" rx="5" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/><text x="' + x + '" y="115" text-anchor="middle" font-size="20" font-weight="800" style="fill:#13203a">?</text>';
      else s += '<text x="' + x + '" y="114" text-anchor="middle" font-size="' + (vals.length > 8 ? 17 : 21) + '" class="tb">' + vals[i] + '</text>';
      if (i) {
        var xa = X(vals[i - 1]), d = vals[i] - vals[i - 1], top = 80 - Math.min(46, Math.abs(x - xa) * 0.55 + 10);
        s += '<path d="M' + xa + ' 76 Q' + ((xa + x) / 2) + ' ' + top + ' ' + x + ' 76" fill="none" style="stroke:var(--strand)" stroke-width="2.5"/>' +
          '<circle cx="' + x + '" cy="80" r="5" style="fill:var(--strand)"/>';
        if (vals.length <= 11) s += '<text x="' + ((xa + x) / 2) + '" y="' + ((top + 76) / 2 - 6) + '" text-anchor="middle" font-size="' + (vals.length > 8 ? 14 : 17) + '" class="t2">' + (d > 0 ? '+' : '&minus;') + Math.abs(d) + '</text>';
      }
    }
    s += '<circle cx="' + X(vals[0]) + '" cy="80" r="6" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(560, 128, s, 'Number line counting ' + vals.map(function (v, i) { return i === miss ? 'a missing number' : v; }).join(', '));
  }
  /* 100 squares, each worth 10, filled up to n */
  function thousand(n) {
    var sz = 26, s = '', full = Math.floor(n / 10), part = (n % 10) / 10;
    for (var i = 0; i < 100; i++) {
      var x = 50 + (i % 10) * sz, y = 6 + Math.floor(i / 10) * sz;
      s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:var(--card);stroke:var(--line)" stroke-width="1"/>';
      if (i < full) s += '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + (sz - 3) + '" height="' + (sz - 3) + '" rx="2" style="fill:var(--p1)"/>';
      else if (i === full && part > 0) s += '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + ((sz - 3) * part).toFixed(1) + '" height="' + (sz - 3) + '" rx="2" style="fill:var(--p1);opacity:.55"/>';
    }
    for (var r = 1; r <= 10; r++) s += '<text x="46" y="' + (6 + r * sz - 7) + '" text-anchor="end" font-size="16" class="t2">' + r * 100 + '</text>';
    s += '<rect x="330" y="10" width="20" height="20" rx="2" style="fill:var(--p1)"/><text x="358" y="25" font-size="15">= 10</text>' +
      '<text x="330" y="58" font-size="15">1 row = 100</text><text x="330" y="80" font-size="15">100 squares = 1000</text>';
    return A.svg(480, 270, s, n + ' shown as ' + full + (part ? ' and a part' : '') + ' of 100 squares, each worth 10');
  }
  var icons = {
    cal: '<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="5" y="8" width="34" height="30" rx="4" style="fill:var(--card);stroke:var(--strand)" stroke-width="2.5"/><rect x="5" y="8" width="34" height="9" rx="3" style="fill:var(--strand)"/><g style="fill:var(--strand)"><rect x="11" y="22" width="5" height="5"/><rect x="20" y="22" width="5" height="5"/><rect x="29" y="22" width="5" height="5"/><rect x="11" y="30" width="5" height="5"/><rect x="20" y="30" width="5" height="5"/></g></svg>',
    paper: '<svg viewBox="0 0 44 44" aria-hidden="true"><g style="fill:var(--card);stroke:var(--strand)" stroke-width="2"><rect x="10" y="16" width="26" height="22" rx="2"/><rect x="8" y="12" width="26" height="22" rx="2"/><rect x="6" y="8" width="26" height="22" rx="2"/></g></svg>',
    path: '<svg viewBox="0 0 44 44" aria-hidden="true"><path d="M6 38 C14 30 30 32 24 22 S28 8 38 6" fill="none" style="stroke:var(--strand)" stroke-width="3" stroke-dasharray="4 3"/><circle cx="6" cy="38" r="4" style="fill:var(--hi);stroke:var(--ink)"/><circle cx="38" cy="6" r="4" style="fill:var(--strand)"/></svg>'
  };
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }

  /* ---------- Lessons: one idea per screen (assets/lesson.js, assets/g3kit.js) ---------- */
  var CH = 'numbers-1000';
  function TU(s, i) { return function () { return G3.turn(A.chapters[CH].turns[s][i])(); }; }
  function SK(id, lv) { return G3.skill(CH, id, lv); }
  function b10(extra) { var o = { words: words, max: { h: 9, t: 19, o: 19 } }; for (var k in extra) o[k] = extra[k]; return o; }
  function nb(n) { return '<span class="math big">' + A.fmt(n) + '</span>'; }
  /* two numbers in place value charts, one above the other, with the column that decides lit */
  function twoCharts(s) {
    return '<div>' + chart(s.a, { hl: s.hl, dots: false }) + '<p class="g3-sym">' + (s.sym ? '<b>' + A.fmt(s.a) + ' ' + s.sym + ' ' + A.fmt(s.b) + '</b>' : '&nbsp;') + '</p>' + chart(s.b, { hl: s.hl, dots: false }) + '</div>';
  }
  function hillView(s) { return hill(s.n, s.p); }
  function grid1000(s) { return thousand(s.n); }

  var LESSONS = [
    { id: 'place', title: 'Hundreds, tens and ones', sub: 'Every digit has a place, and the place gives its value.', concepts: [
      { id: 'hundred', title: 'Ten tens make one hundred', exp: ['B1.5'], skill: 'n3-blocks',
        body: '<p>Ten ones make <b>1 ten</b>. In the same way, ten tens make <b>1 hundred</b>. A hundred flat is 10 rods side by side.</p><div class="fig">' + stairs() + '</div>',
        watch: { tool: 'base10', opts: b10({ t: 7 }), steps: [
          { say: 'Here are 7 tens. Count by tens: 10, 20 ... 70.', act: function (t) { return t.countAll(240); }, ms: 500 },
          { say: 'Add 3 more tens: 80, 90, 100.', act: function (t) { t.clearLit(); return t.add('t', 3, 420); } },
          { say: 'Now there are 10 tens. They slide together into <b>1 hundred</b>.', act: function (t) { return t.group('t'); } },
          { say: '1 hundred is the same amount as 10 tens, or 100 ones.', act: function (t) { return t.pulseCol('h'); }, ms: 1600 }
        ] },
        try: { tool: 'base10', opts: b10({ controls: true, t: 8 }), tasks: [
          { do: 'Add tens until you have 10. Then press <b>Group 10 tens</b>.', goal: function (s) { return s.h >= 1; }, yes: '10 tens became 1 hundred.' },
          { do: 'Now press <b>Break a hundred</b>. How many tens come back?', reset: false, goal: function (s) { return s.last === 'split-h'; }, yes: '10 tens. It is still worth 100.' }
        ] },
        key: '<p><b>10 ones = 1 ten. 10 tens = 1 hundred.</b></p>',
        check: [TU('s2', 2), SK('n3-value', 1)] },

      { id: 'build', title: 'Build numbers to 999', exp: ['B1.1', 'B1.5'], skill: 'n3-blocks',
        body: '<p>Any number up to 999 can be built from <b>hundred flats</b>, <b>ten rods</b> and <b>one cubes</b>. Count the hundreds first, then the tens, then the ones.</p>',
        watch: { tool: 'base10', opts: b10({}), steps: [
          { say: 'Let\'s build 243. First, 2 hundreds: 100, 200.', act: function (t) { return t.add('h', 2, 500); } },
          { say: 'Then 4 tens: 210, 220, 230, 240.', act: function (t) { return t.add('t', 4, 380); } },
          { say: 'Then 3 ones: 241, 242, 243.', act: function (t) { return t.add('o', 3, 320); } },
          { say: 'Count it all to check.', act: function (t) { return t.countAll(200); } },
          { say: '2 hundreds, 4 tens and 3 ones make <b>243</b>.', ms: 1800 }
        ] },
        try: { tool: 'base10', opts: b10({ controls: true }), tasks: [
          { do: 'Build <b>352</b>.', goal: function (s) { return s.value === 352 && s.t < 10 && s.o < 10; }, yes: '3 hundreds, 5 tens and 2 ones make 352.' },
          { do: 'Build <b>608</b>. There are no tens.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 608 && s.o < 10; }, yes: '6 hundreds, 0 tens and 8 ones make 608.' },
          { do: '<b>Tap each block</b> to count what you built. Start with the hundreds.', reset: false, goal: function (s) { return s.allLit; }, yes: 'You counted every block.' }
        ] },
        mistake: '<p>Counting each rod or flat as 1. A rod is worth <b>10</b> and a flat is worth <b>100</b>, so count flats by hundreds and rods by tens.</p>',
        check: [SK('n3-blocks', 1), SK('n3-blocks', 2)] },

      { id: 'value', title: 'A digit\'s place gives its value', exp: ['B1.5'], skill: 'n3-value', hard: true,
        body: '<p>The same digit can be worth very different amounts. In <b>555</b>, the first 5 is worth 500, the next is worth 50, and the last is worth 5. Its <b>place</b> decides.</p>',
        watch: { mount: G3.view(function (s) { return chart(s.n, { hl: s.hl, vals: s.vals }); }, { n: 555, hl: -1, vals: false }), steps: [
          { say: 'Here is 555 in a place value chart.', ms: 1200 },
          { say: 'The 5 in the ones place is worth <b>5</b>.', act: function (t) { return t.set({ hl: 2, vals: true }, 1300); } },
          { say: 'The 5 in the tens place is worth <b>50</b>: 5 tens.', act: function (t) { return t.set({ hl: 1 }, 1300); } },
          { say: 'The 5 in the hundreds place is worth <b>500</b>: 5 hundreds.', act: function (t) { return t.set({ hl: 0 }, 1300); } },
          { say: 'Same digit, three different values.', act: function (t) { return t.set({ hl: -1 }, 1500); } }
        ] },
        try: { mount: G3.play({ state: { n: 352, hl: 1 }, sliders: [{ key: 'n', label: 'Number', min: 100, max: 999 }],
          selects: [{ key: 'hl', label: 'Light up the', options: [[0, 'hundreds digit'], [1, 'tens digit'], [2, 'ones digit']] }],
          draw: function (s) { return chart(s.n, { hl: s.hl, vals: true }); },
          info: function (s) { var d = String(s.n).charAt(s.hl), p = 2 - s.hl; return 'The ' + d + ' is worth <b>' + A.fmt(+d * Math.pow(10, p)) + '</b>'; },
          tasks: [
            { do: 'Make a number where the <b>tens digit</b> is worth <b>70</b>.', goal: function (s) { return Math.floor(s.n / 10) % 10 === 7; }, yes: '7 tens is 70.' },
            { do: 'Make a number where the <b>hundreds digit</b> is worth <b>400</b>.', goal: function (s) { return Math.floor(s.n / 100) === 4; }, yes: '4 hundreds is 400.' }
          ] }), do: '' },
        ways: [
          { label: 'With money', html: '<p>Think of <b>$555</b> as bills: five $100 bills, five $10 bills and five loonies. The $100 bills are worth far more, even though each pile has 5.</p>' },
          { label: 'Cover the digits', html: '<p>Cover all the digits to the right with your finger and count what is left. In 352, cover the 2: you see <b>35</b> tens. Cover 52: you see <b>3</b> hundreds.</p>' }
        ],
        key: '<p>A digit\'s <b>place</b> tells you what it is worth. Ones, tens, hundreds, from right to left.</p>',
        mistake: '<p>Saying the 5 in 352 is worth 5. Ask the child to name the place first ("tens"), then say the value ("5 tens, which is 50").</p>',
        check: [SK('n3-value', 1), TU('s1', 0)] },

      { id: 'thousand', title: 'How big is 1000?', exp: ['B1.1', 'B1.4'], skill: 'n3-value',
        body: '<p>Ten hundreds make <b>1000</b>, one thousand. Each square below is worth 10. One row is 100. All ten rows make 1000.</p>',
        watch: { mount: G3.view(grid1000, { n: 0 }), steps: [
          { say: 'Each square is a ten. Fill one row: 100.', act: function (t) { return t.set({ n: 100 }, 900); } },
          { say: 'Count by hundreds: 200, 300, 400, 500.', act: function (t) { return t.seq([{ n: 200 }, { n: 300 }, { n: 400 }, { n: 500 }], 500); } },
          { say: '600, 700, 800, 900.', act: function (t) { return t.seq([{ n: 600 }, { n: 700 }, { n: 800 }, { n: 900 }], 500); } },
          { say: 'One more hundred makes <b>1000</b>: 10 hundreds, or 100 tens.', act: function (t) { return t.set({ n: 1000 }, 1800); } }
        ] },
        try: { mount: G3.play({ state: { n: 350 }, sliders: [{ key: 'n', label: 'Fill to', min: 0, max: 1000, step: 10 }], draw: grid1000,
          info: function (s) { return A.fmt(s.n) + ' is ' + (s.n / 10) + ' tens. It needs ' + A.fmt(1000 - s.n) + ' more to make 1000.'; },
          tasks: [
            { do: 'Fill the grid to <b>700</b>.', goal: function (s) { return s.n === 700; }, yes: '7 rows of 100 make 700.' },
            { do: 'Fill it to <b>1000</b>. How many rows is that?', goal: function (s) { return s.n === 1000; }, yes: '10 rows of 100 make 1000.' }
          ] }), do: '' },
        key: '<p><b>1000 = 10 hundreds = 100 tens.</b></p>',
        check: [TU('s6', 0), TU('s6', 1), TU('s6', 2)] }
    ] },

    { id: 'write', title: 'Writing numbers', sub: 'Standard form, expanded form and words.', concepts: [
      { id: 'expanded', title: 'Standard and expanded form', exp: ['B1.1'], skill: 'n3-forms',
        body: '<p><b>Standard form</b> is how we usually write a number: 352. <b>Expanded form</b> shows what each digit is worth: 300 + 50 + 2.</p>',
        watch: { mount: G3.view(function (s) { return s.show ? expanded(s.n) : chart(s.n, {}); }, { n: 352, show: false }), steps: [
          { say: '352 has 3 hundreds, 5 tens and 2 ones.', ms: 1400 },
          { say: 'Each digit drops down to show its value.', act: function (t) { return t.set({ show: true }, 1600); } },
          { say: 'So 352 = <b>300 + 50 + 2</b>.', ms: 1800 },
          { say: 'For 407, there are no tens: 407 = <b>400 + 7</b>.', act: function (t) { return t.set({ n: 407 }, 2000); } }
        ] },
        try: { tool: 'base10', opts: b10({ controls: true, expanded: true }), tasks: [
          { do: 'Build the number that is <b>500 + 30 + 6</b>.', goal: function (s) { return s.value === 536 && s.t < 10 && s.o < 10; }, yes: '500 + 30 + 6 = 536.' },
          { do: 'Build <b>900 + 4</b>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 904 && s.o < 10; }, yes: '900 + 4 = 904. The 0 holds the tens place.' }
        ] },
        key: '<p>Expanded form adds up the value of each digit.</p>',
        mistake: '<p>Writing 300 + 50 + 2 as "30052". Show that each part is a value to add, not digits to stick together.</p>',
        check: [SK('n3-forms', 1), TU('s2', 0)] },

      { id: 'words', title: 'Numbers in words', exp: ['B1.1'], skill: 'n3-words',
        body: '<p>To read a number like 640, say the <b>hundreds</b> first, then the last two digits: "six hundred forty". We do not say "and".</p>',
        watch: { tool: 'base10', opts: b10({}), steps: [
          { say: 'Build 6 hundreds: "six hundred".', act: function (t) { return t.add('h', 6, 260); } },
          { say: 'Add 4 tens: "six hundred forty".', act: function (t) { return t.add('t', 4, 300); } },
          { say: 'Add 5 ones: "six hundred forty-five".', act: function (t) { return t.add('o', 5, 260); }, ms: 2000 }
        ] },
        try: { tool: 'base10', opts: b10({ controls: true }), tasks: [
          { do: 'Build <b>seven hundred twelve</b>.', goal: function (s) { return s.value === 712 && s.t < 10 && s.o < 10; }, yes: 'Seven hundred twelve is 712.' },
          { do: 'Build <b>three hundred five</b>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 305 && s.o < 10; }, yes: 'Three hundred five is 305.' }
        ] },
        key: '<p>Say the hundreds, then the last two digits.</p>',
        mistake: '<p>Leaving out the zero. Three hundred five is <b>305</b>, not 35. The 0 keeps the tens place open.</p>',
        check: [SK('n3-words', 1), TU('s2', 1)] },

      { id: 'trade', title: 'One number, many ways', exp: ['B1.5'], skill: 'n3-forms', hard: true,
        body: '<p>We can trade blocks and the number stays the same. 243 is 2 hundreds, 4 tens, 3 ones. It is also <b>24 tens and 3 ones</b>.</p>',
        watch: { tool: 'base10', opts: b10({ h: 2, t: 4, o: 3 }), steps: [
          { say: 'This is 243.', ms: 1200 },
          { say: 'Break a hundred into 10 tens.', act: function (t) { return t.split('h'); } },
          { say: 'Now it is 1 hundred, 14 tens and 3 ones. Still 243.', ms: 1500 },
          { say: 'Break the other hundred too.', act: function (t) { return t.split('h'); } },
          { say: '24 tens and 3 ones. The blocks moved, but the number is still <b>243</b>.', ms: 2000 }
        ] },
        ways: [
          { label: 'With numbers', html: '<p class="math">200 + 40 + 3 = 243</p><p class="math">100 + 140 + 3 = 243</p><p class="math">240 + 3 = 243</p><p>Every way adds to the same total.</p>' },
          { label: 'With money', html: '<p>A $100 bill buys the same as ten $10 bills. Trading does not change how much you have.</p>' }
        ],
        try: { tool: 'base10', opts: b10({ controls: true, h: 3, t: 1, o: 5 }), tasks: [
          { do: 'Show <b>315</b> with <b>no hundred flats</b>.', goal: function (s) { return s.value === 315 && s.h === 0; }, yes: '31 tens and 5 ones is still 315.' },
          { do: 'Show <b>315</b> with <b>more than 9 ones</b>.', setup: function (t) { t.set(3, 1, 5); }, reset: false, goal: function (s) { return s.value === 315 && s.o > 9; }, yes: function (s) { return s.h + ' hundreds, ' + s.t + ' tens and ' + s.o + ' ones is still 315.'; } }
        ] },
        key: '<p>Trading 1 hundred for 10 tens, or 1 ten for 10 ones, <b>does not change the number</b>.</p>',
        check: [SK('n3-forms', 2), TU('s2', 2)] }
    ] },

    { id: 'skip', title: 'Skip counting to 1000', sub: 'By 50s, 100s and 200s.', concepts: [
      { id: 'by100', title: 'Count by 100s', exp: ['B1.4'], skill: 'n3-skip',
        body: '<p>Counting by 100s, only the <b>hundreds digit</b> changes: 300, 400, 500.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 1000, tick: 50, every: 100, start: 0 }, steps: [
          { say: 'Start at 0. Jump by 100.', act: function (t) { return t.jumps(100, 3, 300); } },
          { say: '100, 200, 300. Keep going.', act: function (t) { return t.jumps(100, 4, 300); } },
          { say: '400, 500, 600, 700 ... all the way to <b>1000</b>.', act: function (t) { return t.jumps(100, 3, 300); }, ms: 1600 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 1000, tick: 50, every: 100, start: 200, step: 100 }, tasks: [
          { do: 'Start at 200. Jump by 100 to land on <b>700</b>.', goal: function (s) { return s.at === 700; }, yes: '200, 300, 400, 500, 600, 700. Five jumps.' }
        ] },
        key: '<p>By 100s, only the hundreds digit changes.</p>',
        check: [TU('s3', 0), SK('n3-skip', 1)] },

      { id: 'by50', title: 'Count by 50s', exp: ['B1.4'], skill: 'n3-skip',
        body: '<p>Two 50s make 100. So counting by 50s, you land on a hundred <b>every second jump</b>: 300, 350, 400, 450.</p>',
        watch: { tool: 'numberline', opts: { min: 200, max: 700, tick: 10, every: 50, start: 200 }, steps: [
          { say: 'Start at 200. Jump by 50.', act: function (t) { return t.jumps(50, 2, 350); } },
          { say: '250, 300. Two jumps make 100.', ms: 900 },
          { say: '350, 400, 450, 500.', act: function (t) { return t.jumps(50, 4, 350); } },
          { say: 'The numbers end in 50, then 00, then 50, then 00.', ms: 1800 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 500, tick: 10, every: 50, start: 0, step: 50 }, tasks: [
          { do: 'Jump by 50 to reach <b>350</b>.', goal: function (s) { return s.at === 350; }, yes: '7 jumps of 50 make 350.' }
        ] },
        key: '<p>Two jumps of 50 make 100.</p>',
        check: [TU('s3', 1), SK('n3-skip', 2)] },

      { id: 'by200', title: 'Count by 200s, forward and back', exp: ['B1.4'], skill: 'n3-skip',
        body: '<p>A jump of 200 is two hundreds. Forward, add 200. Backward, take away 200: 1000, 800, 600.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 1000, tick: 50, every: 100, start: 1000 }, steps: [
          { say: 'Start at 1000. Jump back by 200.', act: function (t) { return t.jumps(-200, 1, 300); } },
          { say: '800. Keep jumping back.', act: function (t) { return t.jumps(-200, 2, 400); } },
          { say: '600, 400. Two more: 200, 0.', act: function (t) { return t.jumps(-200, 2, 400); }, ms: 1600 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 1000, tick: 50, every: 100, start: 0, step: 200 }, tasks: [
          { do: 'Jump by 200 from 0 to <b>1000</b>. Count your jumps.', goal: function (s) { return s.at === 1000; }, yes: '5 jumps of 200 make 1000.' }
        ] },
        key: '<p>By 200s: 200, 400, 600, 800, 1000.</p>',
        check: [TU('s3', 2), SK('n3-skip', 3)] }
    ] },

    { id: 'compare', title: 'Compare and order', sub: 'Which is greater, and how to show it.', concepts: [
      { id: 'biggest', title: 'Compare from the left', exp: ['B1.2'], skill: 'n3-compare',
        body: '<p>To compare two numbers, start with the <b>biggest place</b>: the hundreds. Only if they are the same do you look at the tens, then the ones.</p>',
        watch: { mount: G3.view(twoCharts, { a: 601, b: 598, hl: -1, sym: '' }), steps: [
          { say: 'Which is greater, 601 or 598?', ms: 1300 },
          { say: 'Look at the hundreds first: 6 hundreds and 5 hundreds.', act: function (t) { return t.set({ hl: 0 }, 1500); } },
          { say: '6 hundreds is more, so <b>601 is greater</b>. We do not need to look any further.', act: function (t) { return t.set({ sym: '&gt;' }, 2000); } },
          { say: 'Now 472 and 438. The hundreds are the same.', act: function (t) { return t.set({ a: 472, b: 438, hl: 0, sym: '' }, 1600); } },
          { say: 'So compare the tens: 7 tens and 3 tens. <b>472 is greater</b>.', act: function (t) { return t.set({ hl: 1, sym: '&gt;' }, 2000); } }
        ] },
        try: { tool: 'base10', opts: b10({ controls: true }), tasks: [
          { do: 'Build a number that is <b>greater than 452</b> but <b>less than 460</b>.', goal: function (s) { return s.value > 452 && s.value < 460; }, yes: function (s) { return s.value + ' is between 452 and 460.'; } },
          { do: 'Build a number <b>greater than 899</b>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value > 899; }, yes: function (s) { return s.value + ' has 9 hundreds or more, so it is greater than 899.'; } }
        ] },
        mistake: '<p>Looking at the ones first. 601 is greater than 598 even though 1 is less than 8. The hundreds decide first.</p>',
        check: [TU('s4', 0), SK('n3-compare', 1)] },

      { id: 'symbols', title: 'The symbols &lt; and &gt;', exp: ['B1.2'], skill: 'n3-compare', hard: true,
        body: '<p><b>&gt;</b> means "is greater than". <b>&lt;</b> means "is less than". The open side always faces the <b>greater</b> number.</p><div class="vs"><div><b class="t">&gt; greater than</b><p class="math big">8 &gt; 3</p></div><div><b class="t">&lt; less than</b><p class="math big">3 &lt; 8</p></div></div>',
        watch: { mount: G3.view(twoCharts, { a: 406, b: 460, hl: -1, sym: '' }), steps: [
          { say: 'Compare 406 and 460.', ms: 1200 },
          { say: 'Same hundreds. The tens decide: 0 tens and 6 tens.', act: function (t) { return t.set({ hl: 1 }, 1500); } },
          { say: '406 is less than 460. The open side faces 460: <b>406 &lt; 460</b>.', act: function (t) { return t.set({ sym: '&lt;' }, 2200); } }
        ] },
        ways: [
          { label: 'Read it left to right', html: '<p>Read the first number, then the symbol, then the second number. <b>406 &lt; 460</b> says "406 is less than 460". <b>460 &gt; 406</b> says the same thing turned around.</p>' },
          { label: 'The small end points to the small number', html: '<p>The symbol has a big open end and a small pointed end. The <b>pointed end</b> points to the <b>smaller</b> number: 3 &lt; 8.</p>' },
          { label: 'On a number line', html: '<p>On a number line, numbers get greater as you go right. 460 is to the right of 406, so 460 is greater.</p>', tool: 'numberline', opts: { min: 400, max: 470, tick: 2, every: 10, start: 406, marks: [{ v: 460, t: '460' }] } }
        ],
        try: { mount: G3.play({ state: { a: 529, b: 592, pick: '' }, buttons: [{ label: '&lt;', act: function (s) { s.pick = '<'; } }, { label: '&gt;', act: function (s) { s.pick = '>'; } }, { label: '=', act: function (s) { s.pick = '='; } }],
          draw: function (s) { return '<p class="math big" style="text-align:center;font-size:2.2rem">' + s.a + ' <b style="color:var(--strand)">' + (s.pick ? s.pick.replace('<', '&lt;').replace('>', '&gt;') : '?') + '</b> ' + s.b + '</p>'; },
          tasks: [
            { do: 'Pick the symbol that makes this true.', goal: function (s) { return s.pick === '<'; }, yes: '529 &lt; 592. The tens decide: 2 tens is less than 9 tens.' },
            { do: 'And this one?', setup: function (s) { s.a = 810; s.b = 801; }, goal: function (s) { return s.pick === '>'; }, yes: '810 &gt; 801. 1 ten is more than 0 tens.' }
          ] }), do: '' },
        key: '<p>The open side faces the greater number.</p>',
        mistake: '<p>Reading &lt; and &gt; backward. Have the child say the sentence out loud, left to right, and check it on a number line.</p>',
        check: [TU('s4', 1), SK('n3-compare', 2)] },

      { id: 'order', title: 'Put numbers in order', exp: ['B1.2'], skill: 'n3-compare',
        body: '<p>To order numbers from least to greatest, compare them the same way: hundreds first, then tens, then ones.</p>',
        watch: { tool: 'numberline', opts: { min: 280, max: 320, tick: 2, every: 10, start: 280 }, steps: [
          { say: 'Order 299, 302 and 290.', ms: 1200 },
          { say: '290 is furthest left.', act: function (t) { return t.mark(290, '290'); } },
          { say: 'Then 299.', act: function (t) { return t.mark(299, '299'); } },
          { say: '302 is furthest right, so it is the greatest. <b>290, 299, 302</b>.', act: function (t) { return t.mark(302, '302'); }, ms: 2000 }
        ] },
        key: '<p>Least to greatest: left to right on a number line.</p>',
        check: [TU('s4', 2), SK('n3-compare', 3)] }
    ] },

    { id: 'round', title: 'Rounding', sub: 'Find the closest ten or hundred.', concepts: [
      { id: 'ten', title: 'Round to the nearest ten', exp: ['B1.3'], skill: 'n3-round',
        body: '<p>Rounding finds the closest friendly number. To round <b>74</b> to the nearest ten, find the tens on each side: 70 and 80. 74 is closer to <b>70</b>.</p>',
        watch: { mount: G3.view(hillView, { n: 70, p: 10 }), steps: [
          { say: 'Picture a hill from 70 to 80. The top is 75, halfway.', ms: 1400 },
          { say: 'Put 74 on the hill. It is before the top.', act: function (t) { return t.set({ n: 74 }, 1500); } },
          { say: 'It rolls back down to <b>70</b>.', ms: 1400 },
          { say: 'Now 77. It is past the top, so it rolls to <b>80</b>.', act: function (t) { return t.set({ n: 77 }, 1800); } },
          { say: 'Exactly halfway, 75, always rounds <b>up</b> to 80.', act: function (t) { return t.set({ n: 75 }, 1800); } }
        ] },
        try: { tool: 'numberline', opts: { min: 60, max: 80, tick: 1, every: 5, start: 74 }, tasks: [
          { do: 'The marker is on <b>74</b>. Tap the ten it is closest to.', goal: function (s) { return s.at === 70; }, yes: '74 is 4 away from 70 and 6 away from 80. It rounds to 70.' },
          { do: 'Now tap <b>67</b>, then the ten it rounds to.', setup: function (t) { t.moveTo(67); }, reset: false, goal: function (s) { return s.at === 70; }, yes: '67 is 3 away from 70. It rounds to 70.' }
        ] },
        key: '<p>Look at the ones digit. 0 to 4 rounds down. 5 to 9 rounds up.</p>',
        check: [TU('s5', 0), SK('n3-round', 1)] },

      { id: 'hundred', title: 'Round to the nearest hundred', exp: ['B1.3'], skill: 'n3-round', hard: true,
        body: '<p>To round to the nearest hundred, find the hundreds on each side, then look at the <b>tens digit</b>. 451 is between 400 and 500. The tens digit is 5, so it rounds <b>up to 500</b>.</p>',
        watch: { mount: G3.view(hillView, { n: 400, p: 100 }), steps: [
          { say: 'A hill from 400 to 500. The top is 450.', ms: 1400 },
          { say: '432 is before the top. It rounds to <b>400</b>.', act: function (t) { return t.set({ n: 432 }, 1700); } },
          { say: '451 is past the top. It rounds to <b>500</b>.', act: function (t) { return t.set({ n: 451 }, 1700); } },
          { say: '450, exactly halfway, also rounds up to 500.', act: function (t) { return t.set({ n: 450 }, 1800); } }
        ] },
        ways: [
          { label: 'Look at one digit', html: '<p>Underline the place you round to, then look at the digit just to its <b>right</b>. For the nearest hundred, look at the tens: 4<u>5</u>1. 5 or more, round up.</p>' },
          { label: 'Count the distance', html: '<p>451 is 51 away from 400 and 49 away from 500. 49 is less, so 500 is closer.</p>', tool: 'numberline', opts: { min: 400, max: 500, tick: 10, every: 50, start: 451 } },
          { label: 'With money', html: '<p>Is $451 closer to four $100 bills or five? You only need $49 more to make $500, so it is closer to $500.</p>' }
        ],
        try: { mount: G3.play({ state: { n: 632, p: 100 }, sliders: [{ key: 'n', label: 'Number', min: 100, max: 999 }],
          selects: [{ key: 'p', label: 'Round to the nearest', options: [[100, 'hundred'], [10, 'ten']] }],
          draw: hillView, info: function (s) { var r = Math.round(s.n / s.p) * s.p; return A.fmt(s.n) + ' rounds to <b>' + A.fmt(r) + '</b>'; },
          tasks: [
            { do: 'Find a number that rounds to <b>700</b> but is <b>less than</b> 700.', goal: function (s) { return s.p === 100 && s.n < 700 && s.n >= 650; }, yes: function (s) { return s.n + ' is past the top of the 600 to 700 hill.'; } },
            { do: 'Find a number that rounds <b>down</b> to 300.', goal: function (s) { return s.p === 100 && s.n > 300 && s.n < 350; }, yes: function (s) { return s.n + ' is before the top, so it rolls back to 300.'; } }
          ] }), do: '' },
        key: '<p>Look at the digit to the right of the place you round to. 5 or more rounds up.</p>',
        mistake: '<p>Rounding 950 to 900. 950 is exactly halfway between 900 and 1000, and halfway rounds up, so the answer is <b>1000</b>.</p>',
        check: [TU('s5', 1), TU('s5', 2), SK('n3-round', 2)] }
    ] }
  ];

  A.register('numbers-1000', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Ones, tens and hundreds</h2>' +
'<p>We count things in groups of ten. Ten small cubes make one <b>rod</b>. Ten rods make one <b>flat</b>. Ten flats make one <b>big cube</b>.</p>' +
'<div class="fig">' + stairs() + '</div>' +
'<p>Each place has its own colour. Follow the colour from the blocks to the chart to the digit.</p>' +
'<div class="legend"><span><i style="background:var(--p3)"></i>thousands</span><span><i style="background:var(--p2)"></i>hundreds</span><span><i style="background:var(--p1)"></i>tens</span><span><i style="background:var(--p0)"></i>ones</span></div>' +
'<div class="lab"><span class="lt">Try it: build a number</span>' +
'<div class="steprow">' +
'<div class="stepper"><span class="sl c2t">Hundreds</span><button type="button" class="btn alt" data-sub="2" aria-label="Take away one hundred">&minus;</button><output id="bh">0</output><button type="button" class="btn alt" data-add="2" aria-label="Add one hundred">+</button></div>' +
'<div class="stepper"><span class="sl c1t">Tens</span><button type="button" class="btn alt" data-sub="1" aria-label="Take away one ten">&minus;</button><output id="bt">0</output><button type="button" class="btn alt" data-add="1" aria-label="Add one ten">+</button></div>' +
'<div class="stepper"><span class="sl c0t">Ones</span><button type="button" class="btn alt" data-sub="0" aria-label="Take away one">&minus;</button><output id="bo">0</output><button type="button" class="btn alt" data-add="0" aria-label="Add one">+</button></div>' +
'</div>' +
'<div class="ctrl"><label for="bn">Or type a number (0 to 1000)<input type="number" id="bn" min="0" max="1000" value="243"></label></div>' +
'<div class="fig" id="bfig"></div><div id="bchart"></div><div class="out" id="bout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>A digit\'s <b>place</b> tells you what it is worth. In 243, the 2 means 2 hundreds, the 4 means 4 tens, and the 3 means 3 ones.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>What number is 5 flats, 0 rods and 7 cubes?</p><div class="fig">' + A.draw.blocks(507, '5 flats and 7 small cubes', 540, 6) + '</div>' +
'<p>5 hundreds, 0 tens, 7 ones. There are no tens, so write 0 in the tens place: <b>507</b>.</p></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Three ways to write a number</h2>' +
'<p>You can write the same number in three ways. Follow each coloured digit down to what it is worth.</p>' +
'<div class="fig">' + expanded(386) + '</div>' +
'<div class="tbl"><table><thead><tr><th class="l">Way</th><th class="l">Example</th></tr></thead><tbody>' +
'<tr><td class="l">Standard form</td><td class="l math">386</td></tr>' +
'<tr><td class="l">Expanded form</td><td class="l math">300 + 80 + 6</td></tr>' +
'<tr><td class="l">Word form</td><td class="l">three hundred eighty-six</td></tr></tbody></table></div>' +
'<p>To <b>decompose</b> a number means to break it into parts. You can trade 1 flat for 10 rods, or 1 rod for 10 cubes. The number stays the same.</p>' +
'<div class="lab"><span class="lt">Try it: trade blocks</span>' +
'<div class="ctrl"><label for="trn">Start number (100 to 999)<input type="number" id="trn" min="100" max="999" value="234"></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-tr="2">Trade 1 hundred for 10 tens</button><button type="button" class="btn alt" data-tr="1">Trade 1 ten for 10 ones</button></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-gr="1">Trade 10 tens for 1 hundred</button><button type="button" class="btn alt" data-gr="0">Trade 10 ones for 1 ten</button></div>' +
'<div class="fig" id="trfig"></div><div class="out" id="trout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Leaving out the zero. Three hundred five is <b>305</b>, not 35. The 0 keeps the tens place open, so the 3 stays in the hundreds place.</p>' +
'<div class="fig">' + chart(305, { vals: true, hl: 1 }) + '</div></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Write 400 + 20 + 9 in standard form. 4 hundreds, 2 tens, 9 ones: <b>429</b>.</p></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Skip counting to 1000</h2>' +
'<p>Skip counting means jumping by the same amount each time. Counting by 50s, 100s and 200s gets you to 1000 fast.</p>' +
'<div class="lab"><span class="lt">Try it: jump along the number line</span>' +
'<div class="ctrl"><label for="skb">Count by<select id="skb"><option value="10">10s</option><option value="50" selected>50s</option><option value="100">100s</option><option value="200">200s</option></select></label>' +
'<label for="sks">Start at<input type="number" id="sks" min="0" max="1000" step="10" value="0"></label>' +
'<label for="skd">Direction<select id="skd"><option value="1">Forward</option><option value="-1">Backward</option></select></label></div>' +
'<div class="fig" id="skfig"></div><div class="out" id="skout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>By 100s, only the hundreds digit changes: 300, 400, 500. By 50s, you land on a hundred every second jump: 300, 350, 400, 450.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Count by 200s from 0. Five jumps reach 1000.</p><div class="fig">' + hops([0, 200, 400, 600, 800, 1000]) + '</div></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Comparing and ordering</h2>' +
'<p>To compare two numbers, line them up by place. Start at the <b>left</b>, with the hundreds. The first place where the digits are different tells you which number is greater.</p>' +
'<p>The symbol opens toward the greater number. <span class="math">452 &gt; 425</span> means "452 is greater than 425". <span class="math">425 &lt; 452</span> means "425 is less than 452".</p>' +
'<div class="lab"><span class="lt">Try it: compare place by place</span>' +
'<div class="ctrl"><label for="cpa">First number<input type="number" id="cpa" min="0" max="1000" value="452"></label>' +
'<label for="cpb">Second number<input type="number" id="cpb" min="0" max="1000" value="425"></label></div>' +
'<div class="vrow" id="cpblocks"></div><div id="cpchart"></div><div class="fig" id="cpline"></div><div class="out" id="cpout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Looking at the ones first. 601 is greater than 598, even though 1 is less than 8. The hundreds decide first: 6 hundreds is more than 5 hundreds.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Put 318, 381, 138 in order from least to greatest. Compare the hundreds: 1, 3, 3. Then compare the tens of 318 and 381: 1 ten is less than 8 tens.</p><div class="fig" id="ordfig"></div>' +
'<p>Least to greatest: <b>138, 318, 381</b>.</p></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Rounding to the nearest ten or hundred</h2>' +
'<p>Rounding finds a nearby "friendly" number that is easy to use. Picture a hill between two friendly numbers. The top of the hill is halfway. Past the top, the number rolls <b>up</b>. Before the top, it rolls back <b>down</b>. Right on the top, it rolls up.</p>' +
'<div class="lab"><span class="lt">Try it: roll over the hill</span>' +
'<div class="ctrl"><label for="rn">Number (0 to 1000)<input type="number" id="rn" min="0" max="1000" value="267"></label>' +
'<label for="rp">Round to the nearest<select id="rp"><option value="10">ten</option><option value="100" selected>hundred</option></select></label></div>' +
'<div class="fig" id="rline"></div><div class="out" id="rout" aria-live="polite"></div></div>' +
'<p>Without the hill, look at the digit just to the <b>right</b> of the place you round to. 5 or more: round up. Less than 5: round down.</p>' +
'<div class="eg"><b class="t">Watch first</b><p>Round 267 to the nearest hundred. It is between 200 and 300. The tens digit is 6, so round up: <b>300</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Rounding 950 to the nearest hundred and getting 900. 950 is exactly halfway between 900 and 1000, and halfway rounds up, so the answer is <b>1000</b>.</p>' +
'<div class="fig">' + hill(950, 100) + '</div></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>How big is 1000?</h2>' +
'<p>Numbers to 1000 are all around us. They count days, pages, people and steps.</p>' +
'<div class="facts"><div>' + icons.cal + '<span><b>365</b><small>days in a year</small></span></div>' +
'<div>' + icons.paper + '<span><b>500</b><small>sheets in a pack of printer paper</small></span></div>' +
'<div>' + icons.path + '<span><b>1000</b><small>metres in 1 kilometre</small></span></div></div>' +
'<div class="lab"><span class="lt">Try it: fill the thousand grid</span>' +
'<div class="ctrl"><label for="hkp">Pick one<select id="hkp"><option value="365">Days in a year: 365</option><option value="500">Sheets in a pack: 500</option><option value="250">A school with 250 students</option><option value="1000">Metres in a kilometre: 1000</option></select></label>' +
'<label for="hkn">Or type a number (0 to 1000)<input type="number" id="hkn" min="0" max="1000" value="365"></label></div>' +
'<div class="fig" id="hkfig"></div><div class="out" id="hkout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>1000 is 10 hundreds. It is also 100 tens, and 1000 ones.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A year has 365 days. That fills 3 rows of the grid (300) and 6 and a half more squares (65). It is a bit more than one third of 1000.</p></div>' +
'<div class="yt" data-yt="s6"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'What does the 5 in <span class="math">352</span> mean?', options: ['5 ones', '5 tens', '5 hundreds'], answer: 1, why: 'The 5 is the middle digit. The middle place is the tens.' },
        { q: 'What number do these blocks show?', fig: A.draw.blocks(240, '2 flats and 4 rods', 540, 5), options: ['24', '204', '240'], answer: 2, why: '2 flats are 2 hundreds and 4 rods are 4 tens. There are no small cubes, so the ones digit is 0.' },
        { q: 'Do these blocks show 325?', fig: A.draw.blocks(352, '3 flats, 5 rods and 2 small cubes', 540, 5), options: ['Yes', 'No'], answer: 1, why: 'Count the rods. There are 5 rods, which is 5 tens. 325 would have only 2 rods. These blocks show 352.' }
      ],
      s2: [
        { q: 'Write <span class="math">500 + 7</span> in standard form.', options: ['57', '507', '570'], answer: 1, why: '5 hundreds, 0 tens, 7 ones. The 0 holds the tens place.' },
        { q: 'Which is the word form of <span class="math">640</span>?', options: ['six hundred four', 'six hundred forty', 'sixty-four'], answer: 1, why: 'Say the hundreds: six hundred. Then the last two digits, 40: forty.' },
        { q: '1 hundred can be traded for how many tens?', options: ['1', '10', '100'], answer: 1, why: 'A flat is made of 10 rods. Each rod is a ten.' }
      ],
      s3: [
        { q: 'Count by 100s. <span class="math">300, 400, 500, ___</span>', options: ['501', '510', '600'], answer: 2, why: 'Each jump adds 1 hundred. Only the hundreds digit changes.' },
        { q: 'Count by 50s. <span class="math">650, 700, ___</span>', options: ['705', '750', '800'], answer: 1, why: 'Each jump adds 50. 700 + 50 = 750.' },
        { q: 'Count by 200s backward. <span class="math">1000, 800, ___</span>', options: ['600', '700', '780'], answer: 0, why: 'Each jump takes away 200. 800 &minus; 200 = 600.' }
      ],
      s4: [
        { q: 'Which is greater: <span class="math">719</span> or <span class="math">791</span>?', options: ['719', '791'], answer: 1, why: 'The hundreds are the same. Compare the tens: 1 ten and 9 tens.' },
        { q: 'Which symbol goes in the box? <span class="math">406 &#9633; 460</span>', options: ['&lt;', '&gt;', '='], answer: 0, why: 'Same hundreds. Compare the tens: 0 tens is less than 6 tens. The symbol opens toward the greater number.' },
        { q: 'Which number is the least?', options: ['299', '302', '290'], answer: 2, why: 'Compare the hundreds first. 302 has 3 hundreds, so it is not least. Then compare 299 and 290 by the ones.' }
      ],
      s5: [
        { q: 'Round <span class="math">74</span> to the nearest ten.', options: ['70', '75', '80'], answer: 0, why: '74 is between 70 and 80. The ones digit is 4, which is less than 5.' },
        { q: 'Round <span class="math">451</span> to the nearest hundred.', options: ['400', '450', '500'], answer: 2, why: '451 is between 400 and 500. Look at the tens digit. It is 5, and 5 or more rounds up.' },
        { q: 'Round <span class="math">995</span> to the nearest ten.', options: ['990', '1000', '900'], answer: 1, why: '995 is between 990 and 1000. The ones digit is 5, so round up.' }
      ],
      s6: [
        { q: 'How many hundreds make 1000?', options: ['10', '100', '1000'], answer: 0, why: '10 flats make the big cube. Each flat is a hundred.' },
        { q: 'How many tens make 1000?', options: ['10', '100', '1000'], answer: 1, why: 'Each square on the grid is a ten, and there are 100 squares.' },
        { q: 'Which is closer to 1000?', options: ['365', '900'], answer: 1, why: '900 needs only 100 more to reach 1000. 365 needs 635 more.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      /* section 1: build a number. c = [ones, tens, hundreds, thousands] */
      var c = digitsOf(243), msg = '';
      function total() { return c[0] + c[1] * 10 + c[2] * 100 + c[3] * 1000; }
      function build() {
        var n = total();
        $('#bh', root).textContent = c[2]; $('#bt', root).textContent = c[1]; $('#bo', root).textContent = c[0];
        $('#bn', root).value = n;
        $('#bfig', root).innerHTML = A.draw.blocks(n, 'Base-ten blocks showing ' + n, 540, 6);
        $('#bchart', root).innerHTML = chart(n, { cols: n === 1000 ? 4 : 3, vals: true });
        var parts = [];
        for (var p = 3; p >= 0; p--) if (c[p]) parts.push('<b class="c' + p + 't">' + c[p] * Math.pow(10, p) + '</b>');
        $('#bout', root).innerHTML = '<p><span class="big">' + n + '</span> &nbsp;' + words(n) + '</p><p><b>Expanded form:</b> <span class="math">' + (parts.join(' + ') || '0') + '</span></p>' + (msg ? '<p class="lvmsg">' + msg + '</p>' : '');
        root.querySelectorAll('[data-add]').forEach(function (b) { b.disabled = n + Math.pow(10, +b.getAttribute('data-add')) > 1000; });
        root.querySelectorAll('[data-sub]').forEach(function (b) { b.disabled = n - Math.pow(10, +b.getAttribute('data-sub')) < 0; });
        msg = '';
      }
      root.querySelectorAll('[data-add]').forEach(function (b) {
        b.addEventListener('click', function () {
          var p = +b.getAttribute('data-add');
          if (total() + Math.pow(10, p) > 1000) return;
          c[p]++;
          var said = [];
          for (var q = 0; q < 3; q++) if (c[q] >= 10) { c[q] -= 10; c[q + 1]++; said.push('10 ' + A.PLACES[q] + ' were grouped into 1 ' + A.PLACE1[q + 1]); }
          if (said.length) msg = said.join(', then ') + '.';
          build();
        });
      });
      root.querySelectorAll('[data-sub]').forEach(function (b) {
        b.addEventListener('click', function () {
          var p = +b.getAttribute('data-sub');
          if (total() - Math.pow(10, p) < 0) return;
          if (!c[p]) {
            var q = p;
            while (!c[q]) q++;
            var said2 = [];
            while (q > p) { c[q]--; c[q - 1] += 10; said2.push('1 ' + A.PLACE1[q] + ' was broken into 10 ' + A.PLACES[q - 1]); q--; }
            msg = 'There were no ' + A.PLACES[p] + ' to take away, so ' + said2.join(', then ') + '.';
          }
          c[p]--;
          build();
        });
      });
      $('#bn', root).addEventListener('input', function () { c = digitsOf(clamp(this.value, 0, 1000)); build(); });
      build();

      /* section 2: trade blocks. t = [ones, tens, hundreds] */
      var t = [0, 0, 0], MAX = 30;
      function trStart() { t = digitsOf(clamp($('#trn', root).value, 100, 999)).slice(0, 3); tr(); }
      function tr() {
        var n = t[0] + t[1] * 10 + t[2] * 100;
        $('#trfig', root).innerHTML = columns(t);
        var parts = [];
        for (var k = 2; k >= 0; k--) if (t[k]) parts.push('<b class="c' + k + 't">' + plural(t[k], k) + '</b>');
        $('#trout', root).innerHTML = '<p>' + parts.join(' + ') + ' = <span class="big">' + n + '</span></p><p class="t2">Same number, different blocks.</p>';
        root.querySelectorAll('[data-tr]').forEach(function (b) { var p = +b.getAttribute('data-tr'); b.disabled = t[p] < 1 || t[p - 1] + 10 > MAX; });
        root.querySelectorAll('[data-gr]').forEach(function (b) { b.disabled = t[+b.getAttribute('data-gr')] < 10; });
      }
      root.querySelectorAll('[data-tr]').forEach(function (b) { b.addEventListener('click', function () { var p = +b.getAttribute('data-tr'); if (t[p] > 0 && t[p - 1] + 10 <= MAX) { t[p]--; t[p - 1] += 10; tr(); } }); });
      root.querySelectorAll('[data-gr]').forEach(function (b) { b.addEventListener('click', function () { var p = +b.getAttribute('data-gr'); if (t[p] >= 10) { t[p] -= 10; t[p + 1]++; tr(); } }); });
      A.bind(root, ['trn'], trStart);

      /* section 3: skip counting */
      function sk() {
        var by = +$('#skb', root).value, dir = +$('#skd', root).value, st = clamp($('#sks', root).value, 0, 1000);
        var vals = [st];
        while (vals.length < 11) { var nx = vals[vals.length - 1] + dir * by; if (nx < 0 || nx > 1000) break; vals.push(nx); }
        if (vals.length < 2) {
          $('#skfig', root).innerHTML = '';
          $('#skout', root).innerHTML = '<p>From ' + st + ' there is no room to jump ' + (dir > 0 ? 'forward' : 'backward') + ' by ' + by + ' and stay between 0 and 1000. Try another start.</p>';
          return;
        }
        $('#skfig', root).innerHTML = hops(vals);
        $('#skout', root).innerHTML = '<p><span class="big">' + vals.join(', ') + '</span></p><p>' + (vals.length - 1) + ' jumps of ' + by + ' ' + (dir > 0 ? 'forward' : 'backward') + ' from ' + st + ' land on ' + vals[vals.length - 1] + '.</p>';
      }
      A.bind(root, ['skb', 'sks', 'skd'], sk);

      /* section 4: compare */
      function cp() {
        var a = clamp($('#cpa', root).value, 0, 1000), b = clamp($('#cpb', root).value, 0, 1000);
        var cols = a === 1000 || b === 1000 ? 4 : 3, sa = String(a), sb = String(b);
        while (sa.length < cols) sa = '0' + sa;
        while (sb.length < cols) sb = '0' + sb;
        var diff = -1;
        for (var i = 0; i < cols; i++) if (sa.charAt(i) !== sb.charAt(i)) { diff = i; break; }
        $('#cpblocks', root).innerHTML = '<figure><figcaption>First: ' + a + '</figcaption>' + A.draw.blocks(a, 'Blocks for ' + a, 330, 4) + '</figure>' +
          '<figure><figcaption>Second: ' + b + '</figcaption>' + A.draw.blocks(b, 'Blocks for ' + b, 330, 4) + '</figure>';
        $('#cpchart', root).innerHTML = '<p class="t2" style="margin:.3em 0 0;font-size:.9rem">First number</p>' + chart(a, { cols: cols, hl: diff, dots: false }) +
          '<p class="t2" style="margin:.3em 0 0;font-size:.9rem">Second number</p>' + chart(b, { cols: cols, hl: diff, dots: false });
        var lo = Math.min(a, b), hi = Math.max(a, b), step = hi - lo > 200 ? 100 : hi - lo > 20 ? 10 : 1;
        var L = Math.floor(lo / step) * step, H = Math.ceil(hi / step) * step;
        if (H === L) H = L + step;
        while ((H - L) / step > 10) { step *= 2; L = Math.floor(lo / step) * step; H = Math.ceil(hi / step) * step; if (H === L) H = L + step; }
        var x0 = 30, x1 = 530, s = '<line x1="' + x0 + '" y1="44" x2="' + x1 + '" y2="44" style="stroke:var(--ink)" stroke-width="2"/>';
        for (var v = L; v <= H; v += step) {
          var x = x0 + (x1 - x0) * (v - L) / (H - L);
          s += '<line x1="' + x + '" y1="37" x2="' + x + '" y2="51" style="stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="70" text-anchor="middle" font-size="13">' + v + '</text>';
        }
        [[a, 'var(--strand)', 'first'], [b, 'var(--hi)', 'second']].forEach(function (pt, k) {
          var x = x0 + (x1 - x0) * (pt[0] - L) / (H - L);
          s += '<circle cx="' + x + '" cy="44" r="8" style="fill:' + pt[1] + ';stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="' + (k ? 14 : 28) + '" text-anchor="middle" class="tb" font-size="13">' + pt[2] + '</text>';
        });
        $('#cpline', root).innerHTML = A.svg(560, 78, s, 'Number line showing ' + a + ' and ' + b);
        var sym = a > b ? '&gt;' : a < b ? '&lt;' : '=', said = a > b ? 'is greater than' : a < b ? 'is less than' : 'is equal to';
        var pn = ['thousands', 'hundreds', 'tens', 'ones'].slice(4 - cols);
        $('#cpout', root).innerHTML = '<p><span class="big">' + a + ' ' + sym + ' ' + b + '</span> &nbsp;' + a + ' ' + said + ' ' + b + '.</p><p>' +
          (diff < 0 ? 'Every digit matches, so the numbers are equal.' : 'The first different place is the <b>' + pn[diff] + '</b>: ' + sa.charAt(diff) + ' and ' + sb.charAt(diff) + '. On the number line, the greater number is further right.') + '</p>';
      }
      A.bind(root, ['cpa', 'cpb'], cp);
      (function () {
        var pts = [318, 381, 138], s = '<line x1="30" y1="46" x2="530" y2="46" style="stroke:var(--ink)" stroke-width="2"/>';
        for (var v = 100; v <= 400; v += 50) {
          var x = 30 + 500 * (v - 100) / 300;
          s += '<line x1="' + x + '" y1="38" x2="' + x + '" y2="54" style="stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="74" text-anchor="middle" font-size="13">' + v + '</text>';
        }
        pts.forEach(function (p) {
          var x = 30 + 500 * (p - 100) / 300;
          s += '<circle cx="' + x + '" cy="46" r="7" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="26" text-anchor="middle" font-size="14" class="tb">' + p + '</text>';
        });
        $('#ordfig', root).innerHTML = A.svg(560, 82, s, 'Number line from 100 to 400 with 138, 318 and 381 marked from left to right');
      })();

      /* section 5: rounding */
      function rd() {
        var n = clamp($('#rn', root).value, 0, 1000), p = +$('#rp', root).value;
        var lo = Math.floor(n / p) * p, hi = lo + p, res = n - lo >= p / 2 ? hi : lo, dg = Math.floor((n % p) / (p / 10));
        $('#rline', root).innerHTML = hill(n, p);
        var s = String(n), pi = s.length - 1 - (p === 100 ? 2 : 1), shown = '';
        for (var i = 0; i < s.length; i++) {
          var ch = s.charAt(i);
          shown += i === pi ? '<span style="outline:2px solid var(--accent);border-radius:3px;padding:0 2px">' + ch + '</span>' :
            i === pi + 1 ? '<span style="text-decoration:underline 3px var(--hi);text-underline-offset:4px">' + ch + '</span>' : ch;
        }
        var nm = p === 10 ? 'ten' : 'hundred';
        var why = n === lo ? n + ' is already a ' + nm + ' number, so it stays ' + n + '.' :
          n + ' is between ' + lo + ' and ' + hi + '. The digit to the right of the ' + nm + 's place is <b>' + dg + '</b>, which is ' + (dg >= 5 ? '5 or more, so round <b>up</b> to ' + hi + '.' : 'less than 5, so round <b>down</b> to ' + lo + '.');
        $('#rout', root).innerHTML = '<p><span class="big">' + (pi >= 0 ? shown : n) + ' &#8776; ' + res + '</span></p><p>' + why + '</p>' +
          (pi >= 0 ? '<p class="t2" style="font-size:.9rem">Boxed: the place you round to. Underlined: the digit that decides.</p>' : '');
      }
      A.bind(root, ['rn', 'rp'], rd);

      /* section 6: thousand grid */
      function hk(fromSelect) {
        if (fromSelect) $('#hkn', root).value = $('#hkp', root).value;
        var n = clamp($('#hkn', root).value, 0, 1000), full = Math.floor(n / 10), part = n % 10;
        $('#hkfig', root).innerHTML = thousand(n);
        var size = n === 1000 ? 'all of 1000' : n >= 900 ? 'almost all of 1000' : n >= 450 && n <= 550 ? 'about half of 1000' : n >= 230 && n <= 270 ? 'about a quarter of 1000' : n >= 90 && n <= 110 ? 'about a tenth of 1000' : '';
        $('#hkout', root).innerHTML = '<p><span class="big">' + n + '</span> fills ' + full + ' square' + (full === 1 ? '' : 's') + (part ? ' and part of one more' : '') + (size ? ': ' + size : '') + '.</p>';
      }
      $('#hkp', root).addEventListener('change', function () { hk(true); });
      $('#hkn', root).addEventListener('input', function () { hk(false); });
      hk(false);
    },

    quiz: [
      { q: 'What is the value of the digit 4 in <span class="math">482</span>?', type: 'mc', options: ['4', '40', '400', '482'], answer: 2, fig: chart(482, { hl: 0 }),
        hint: 'Look at the chart. Which place is the 4 in?', explain: 'The 4 is in the hundreds place, so it is worth 400.' },
      { q: 'What number do these blocks show?', type: 'num', answer: 365, fig: A.draw.blocks(365, '3 flats, 6 rods and 5 small cubes', 540, 6),
        hint: 'Flats are hundreds, rods are tens, small cubes are ones. Count each kind.', explain: '3 hundreds, 6 tens and 5 ones make 365.' },
      { q: 'Which number is <b>six hundred seven</b>?', type: 'mc', options: ['67', '607', '670', '6007'], answer: 1,
        hint: 'There are no tens. What digit goes in the tens place?', explain: '6 hundreds, 0 tens, 7 ones: 607.' },
      { q: 'Count by 50s. What comes next? <span class="math">350, 400, 450, ___</span>', type: 'num', answer: 500, fig: hops([350, 400, 450, 500], 3),
        hint: 'Add 50 to 450.', explain: '450 + 50 = 500.' },
      { q: 'Which number is greater: <span class="math">509</span> or <span class="math">590</span>?', type: 'mc', options: ['509', '590', 'They are equal'], answer: 1, fig: chart(509, { hl: 1, dots: false }) + chart(590, { hl: 1, dots: false }),
        hint: 'The hundreds are the same. Compare the tens next.', explain: 'Both have 5 hundreds. 590 has 9 tens and 509 has 0 tens, so 590 is greater.' },
      { q: 'Round <span class="math">247</span> to the nearest hundred.', type: 'mc', options: ['200', '240', '250', '300'], answer: 0, fig: hill(247, 100),
        hint: 'Is the yellow ball before or past the top of the hill?', explain: '247 is between 200 and 300. The tens digit is 4, which is less than 5, so round down to 200.' },
      { q: 'What number is 3 hundreds, 14 tens and 2 ones?', type: 'num', answer: 442, fig: A.draw.pile([2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], '3 flats, 14 rods and 2 small cubes', 540, 5),
        hint: '10 of the 14 tens make 1 more hundred.', explain: '14 tens is 140. 300 + 140 + 2 = 442.' }
    ],

    practice: [
      { id: 'n3-value', name: 'Value of a digit', code: 'B1.5', gen: function (lv) {
        var n = R.int(101, 999), s = String(n), i = R.int(0, 2);
        while (s.charAt(i) === '0') i = R.int(0, 2);
        var dgt = +s.charAt(i), place = 2 - i, val = dgt * Math.pow(10, place);
        if (lv === 3) {
          var k = R.pick([1, 2]), tot = Math.floor(n / Math.pow(10, k));
          return { q: 'How many <b>' + A.PLACES[k] + '</b> are in <span class="math">' + n + '</span> in all?', type: 'num', answer: tot,
            fig: A.draw.blocks(n, 'Base-ten blocks showing ' + n, 540, 5),
            hint: k === 1 ? 'Each flat is 10 tens. Count the tens in the flats, then add the rods.' : 'Each flat is 1 hundred. Count the flats.',
            steps: k === 1 ? ['There are ' + plural(Math.floor(n / 100), 2) + '. Each hundred is 10 tens, so that is ' + Math.floor(n / 100) * 10 + ' tens.', 'Add the ' + plural(Math.floor(n / 10) % 10, 1) + ' from the rods.', Math.floor(n / 100) * 10 + ' + ' + (Math.floor(n / 10) % 10) + ' = ' + tot + ' tens. A quick way: cover the ones digit and read ' + tot + '.'] :
              ['Count the flats. Each flat is 1 hundred.', 'There are ' + tot + ' flats.', 'So there are ' + tot + ' hundreds in ' + n + '.'],
            explain: n + ' = ' + tot + ' ' + A.PLACES[k] + ' + ' + (n % Math.pow(10, k)) + '.' };
        }
        var wrong = [dgt, dgt * Math.pow(10, place + 1), dgt * Math.pow(10, Math.max(0, place - 1)), n].filter(function (v) { return v !== val; });
        var o = R.mc(val, wrong);
        return { q: 'What is the value of the <b>' + dgt + '</b> in <span class="math">' + s.slice(0, i) + '<u>' + dgt + '</u>' + s.slice(i + 1) + '</span>?',
          type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? chart(n, { hl: i }) : A.draw.blocks(n, 'Base-ten blocks showing ' + n, 540, 5),
          hint: lv === 1 ? 'Find the underlined digit in the chart. Read the name of its place.' : 'Is the underlined digit counting flats, rods or small cubes?',
          steps: ['The underlined ' + dgt + ' is in the <b>' + A.PLACES[place] + '</b> place.', (place ? 'One ' + A.PLACE1[place] + ' is ' + Math.pow(10, place) + '.' : 'Each one is worth 1.'), dgt + ' ' + A.PLACES[place] + ' = ' + val + '.<div class="fig">' + chart(n, { hl: i, vals: true }) + '</div>'],
          explain: 'The ' + dgt + ' is in the ' + A.PLACES[place] + ' place, so it is worth ' + val + '.' };
      } },
      { id: 'n3-blocks', name: 'Read base-ten blocks', code: 'B1.1', gen: function (lv) {
        var c = [R.int(0, 9), R.int(0, 9), R.int(1, lv === 1 ? 5 : 9)];
        if (lv === 2) c[R.int(0, 1)] = 0;
        var n = c[0] + c[1] * 10 + c[2] * 100;
        if (lv < 3) {
          var miss = [];
          if (!c[1]) miss.push('rods');
          if (!c[0]) miss.push('small cubes');
          return { q: 'What number do these blocks show?', type: 'num', answer: n, fig: A.draw.blocks(n, plural(c[2], 2) + ', ' + plural(c[1], 1) + ', ' + plural(c[0], 0), 540, 6),
            hint: 'Flats are hundreds, rods are tens, small cubes are ones.' + (miss.length ? ' A kind of block that is missing gets a 0.' : ''),
            steps: ['Count the flats: ' + c[2] + '. That is ' + plural(c[2], 2) + '.', 'Count the rods: ' + c[1] + '. Count the small cubes: ' + c[0] + '.' + (miss.length ? ' There are no ' + miss.join(' and no ') + ', so write 0 there.' : ''), 'Write one digit for each place: ' + n + '.<div class="fig">' + chart(n, { vals: true }) + '</div>'],
            explain: plural(c[2], 2) + ', ' + plural(c[1], 1) + ' and ' + plural(c[0], 0) + ' make ' + n + '.' };
        }
        /* level 3: one place has 10 or more, and the blocks are mixed up */
        var k = R.pick([0, 1]), cc = c.slice();
        if (cc[k + 1] < 1) cc[k + 1] = 1;
        n = cc[0] + cc[1] * 10 + cc[2] * 100;
        cc[k + 1]--; cc[k] += 10;
        var items = [];
        for (var p = 0; p < 3; p++) for (var j = 0; j < cc[p]; j++) items.push(p);
        items = R.shuffle(items);
        return { q: 'What number do these blocks show? They are mixed up, and one kind has 10 or more.', type: 'num', answer: n,
          fig: A.draw.pile(items, plural(cc[2], 2) + ', ' + plural(cc[1], 1) + ' and ' + plural(cc[0], 0) + ', mixed up', 540, 5),
          hint: 'Count each kind of block. Ten ' + A.PLACES[k] + ' make 1 ' + A.PLACE1[k + 1] + '.',
          steps: ['Count each kind: ' + plural(cc[2], 2) + ', ' + plural(cc[1], 1) + ', ' + plural(cc[0], 0) + '.', 'Trade 10 ' + A.PLACES[k] + ' for 1 ' + A.PLACE1[k + 1] + '. Now there are ' + plural(Math.floor(n / 100), 2) + ', ' + plural(Math.floor(n / 10) % 10, 1) + ', ' + plural(n % 10, 0) + '.', 'Write the digits: ' + n + '.'],
          explain: cc[2] * 100 + ' + ' + cc[1] * 10 + ' + ' + cc[0] + ' = ' + n + '.' };
      } },
      { id: 'n3-forms', name: 'Expanded and standard form', code: 'B1.1', gen: function (lv) {
        var h = R.int(1, 9), t = R.int(lv === 1 ? 1 : 0, 9), o = R.int(lv === 1 ? 1 : 0, 9);
        if (lv === 2 && t && o) R.pick([function () { t = 0; }, function () { o = 0; }])();
        var n = h * 100 + t * 10 + o;
        if (lv === 3 && R.int(0, 1)) {
          /* more than 9 tens or ones, written as place names */
          var t2 = t + 10, extra = h > 1 ? 1 : 0, h2 = h - extra;
          if (!extra) { t2 = t; }
          var o2 = o, nn = h2 * 100 + t2 * 10 + o2;
          if (!extra) { o2 = o + 10 > 19 ? o : o + 10; nn = h2 * 100 + t2 * 10 + o2; }
          return { q: 'What number is <b>' + plural(h2, 2) + ', ' + plural(t2, 1) + ' and ' + plural(o2, 0) + '</b>?', type: 'num', answer: nn,
            hint: 'Find the value of each part, then add. Ten of a place make 1 of the next place.',
            steps: [plural(h2, 2) + ' = ' + h2 * 100 + '. ' + plural(t2, 1) + ' = ' + t2 * 10 + '. ' + plural(o2, 0) + ' = ' + o2 + '.', 'Add: ' + h2 * 100 + ' + ' + t2 * 10 + ' + ' + o2 + '.', 'The number is ' + nn + '.'],
            explain: h2 * 100 + ' + ' + t2 * 10 + ' + ' + o2 + ' = ' + nn + '.' };
        }
        var parts = [h * 100, t * 10, o].filter(function (v) { return v; });
        if (lv === 3) parts = R.shuffle(parts);
        return { q: 'Write in standard form: <span class="math">' + parts.join(' + ') + '</span>', type: 'num', answer: n,
          fig: lv < 3 ? A.draw.blocks(n, 'Base-ten blocks showing ' + n, 540, 5) : '',
          hint: lv === 3 ? 'The parts are mixed up. Put the hundreds first, then tens, then ones.' : 'Put each part in its place. A place with nothing gets a 0.',
          steps: ['Sort the parts from biggest to smallest: ' + [h * 100, t * 10, o].filter(function (v) { return v; }).join(' + ') + '.', 'Write a digit for hundreds, tens and ones. Write 0 for a missing place.', 'The number is ' + n + '.<div class="fig">' + expanded(n) + '</div>'],
          explain: parts.join(' + ') + ' = ' + n + '.' };
      } },
      { id: 'n3-words', name: 'Numbers in words', code: 'B1.1', gen: function (lv) {
        var h = R.int(1, 9), t = R.int(0, 9), o = R.int(0, 9);
        if (lv >= 2 && R.int(0, 1)) t = 0;
        if (lv === 1 && !t) t = R.int(2, 9);
        var n = h * 100 + t * 10 + o;
        var wrong = [h * 10 + o, h * 100 + o * 10 + t, h * 1000 + t * 10 + o, h * 100 + (t + 1) % 10 * 10 + o].filter(function (w) { return w !== n && w > 0 && w <= 9999; });
        var steps = ['The hundreds part: "' + ones[h] + ' hundred" is ' + h * 100 + '.', 'The rest: ' + (n % 100 ? '"' + words(n % 100) + '" is ' + (n % 100) + (t === 0 ? '. There are no tens, so the tens digit is 0.' : '.') : 'nothing, so the tens and ones are 0.'), 'Together: ' + words(n) + ' is ' + n + '.<div class="fig">' + chart(n, { vals: true }) + '</div>'];
        if (lv === 3) {
          var o2 = R.mc(words(n), wrong.filter(function (w) { return w <= 1000; }).concat([h * 100 + t]).filter(function (w) { return w !== n; }).map(words));
          return { q: 'Which is the word form of <span class="math">' + n + '</span>?', type: 'mc', options: o2.options, answer: o2.answer,
            fig: chart(n, { dots: false }), hint: 'Say the hundreds first. Then say the last two digits.', steps: steps, explain: n + ' is ' + words(n) + '.' };
        }
        var oo = R.mc(A.fmt(n), wrong.map(A.fmt));
        return { q: 'Which number is <b>' + words(n) + '</b>?', type: 'mc', options: oo.options, answer: oo.answer,
          hint: 'Write the hundreds digit first. Then the tens, then the ones. Use 0 for an empty place.', steps: steps, explain: words(n) + ' is ' + n + '.' };
      } },
      { id: 'n3-skip', name: 'Skip counting', code: 'B1.4', gen: function (lv) {
        var by = lv === 1 ? R.pick([10, 100]) : R.pick([50, 100, 200]), dir = lv === 3 && R.int(0, 1) ? -1 : 1;
        var start = lv === 1 ? R.int(0, 5) * by : lv === 2 ? R.int(0, 6) * 50 : R.int(1, 40) * 10;
        if (dir < 0) start = R.int(5, 10) * 100 - (by === 200 ? 0 : R.pick([0, 50]));
        var vals = [start];
        for (var i = 0; i < 4; i++) vals.push(vals[vals.length - 1] + dir * by);
        if (vals[4] > 1000 || vals[4] < 0) { dir = 1; start = 0; vals = [0, by, 2 * by, 3 * by, 4 * by]; }
        var miss = lv === 3 ? R.int(1, 3) : 4, ans = vals[miss];
        var shownList = vals.map(function (v, k) { return k === miss ? '___' : v; }).join(', ');
        return { q: (lv === 3 ? 'Find the missing number. ' : 'What comes next? ') + 'Count by ' + by + 's' + (dir < 0 ? ' backward' : '') + ': <span class="math">' + shownList + '</span>', type: 'num', answer: ans,
          fig: lv < 3 ? hops(vals, miss) : '',
          hint: (dir < 0 ? 'Take away ' : 'Add ') + by + ' to the number ' + (miss === 4 ? 'before the blank.' : 'before the blank. Check it with the number after.'),
          steps: ['Each jump is ' + (dir < 0 ? 'back ' : '') + by + '.', 'The number before the blank is ' + vals[miss - 1] + '. ' + vals[miss - 1] + (dir < 0 ? ' &minus; ' : ' + ') + by + ' = ' + ans + '.', 'The answer is ' + ans + '.<div class="fig">' + hops(vals) + '</div>'],
          explain: vals.join(', ') + '.' };
      } },
      { id: 'n3-compare', name: 'Compare and order', code: 'B1.2', gen: function (lv) {
        if (lv < 3) {
          var a = R.int(100, 999), b;
          if (lv === 1) { do { b = R.int(100, 999); } while (Math.floor(b / 100) === Math.floor(a / 100)); }
          else { do { b = Math.floor(a / 100) * 100 + R.int(0, 99); } while (b === a); }
          var sym = a > b ? '&gt;' : '&lt;', o = R.mc(sym, ['&gt;', '&lt;', '=']);
          var sa = String(a), sb = String(b), d0 = 0;
          while (sa.charAt(d0) === sb.charAt(d0)) d0++;
          var pn = ['hundreds', 'tens', 'ones'][d0];
          return { q: 'Which symbol goes in the box? <span class="math">' + a + ' &#9633; ' + b + '</span>', type: 'mc', options: o.options, answer: o.answer,
            fig: '<div class="vrow"><figure><figcaption>' + a + '</figcaption>' + A.draw.blocks(a, 'Blocks for ' + a, 330, 4) + '</figure><figure><figcaption>' + b + '</figcaption>' + A.draw.blocks(b, 'Blocks for ' + b, 330, 4) + '</figure></div>',
            hint: 'Compare the hundreds first. If they match, compare the tens.',
            steps: ['Line the numbers up by place.', 'Start at the left. The first different digits are in the ' + pn + ' place: ' + sa.charAt(d0) + ' and ' + sb.charAt(d0) + '.<div class="fig">' + chart(a, { hl: d0, dots: false }) + chart(b, { hl: d0, dots: false }) + '</div>', 'The bigger digit wins, so ' + a + ' ' + sym + ' ' + b + '.'],
            explain: a + ' ' + sym + ' ' + b + '. The symbol opens toward the greater number.' };
        }
        var hd = R.int(1, 8), nums = [];
        while (nums.length < 3) { var v = (hd + R.int(0, 1)) * 100 + R.int(0, 9) * 10 + R.int(0, 9); if (nums.indexOf(v) < 0) nums.push(v); }
        var big = R.int(0, 1);
        var sorted = nums.slice().sort(function (x, y) { return big ? y - x : x - y; });
        var right = sorted.join(', ');
        var w = [[sorted[1], sorted[0], sorted[2]], [sorted[0], sorted[2], sorted[1]], sorted.slice().reverse()].map(function (l) { return l.join(', '); });
        var o2 = R.mc(right, w);
        return { q: 'Put <span class="math">' + R.shuffle(nums).join(', ') + '</span> in order from <b>' + (big ? 'greatest to least' : 'least to greatest') + '</b>.', type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'Compare the hundreds first, then the tens, then the ones.',
          steps: ['Look at the hundreds digits first.', 'If two numbers have the same hundreds, compare their tens.', (big ? 'Greatest to least: ' : 'Least to greatest: ') + right + '.'],
          explain: 'In order: ' + right + '.' };
      } },
      { id: 'n3-round', name: 'Round to the nearest ten or hundred', code: 'B1.3', gen: function (lv) {
        var p = lv === 1 ? 10 : lv === 2 ? 100 : R.pick([10, 100]), n;
        if (lv === 1) n = R.int(11, 99);
        else n = R.int(101, 999);
        if (lv === 3) n = p === 100 ? R.pick([R.int(90, 99) * 10 + R.int(0, 9), R.int(1, 9) * 100 + 50, R.int(951, 999)]) : R.int(10, 99) * 10 + R.pick([5, R.int(1, 9)]);
        if (n % p === 0) n += p === 10 ? 3 : 30;
        n = Math.min(n, 999);
        var lo = Math.floor(n / p) * p, hi = lo + p, ans = n - lo >= p / 2 ? hi : lo, dg = Math.floor((n % p) / (p / 10)), nm = p === 10 ? 'ten' : 'hundred';
        var o = R.mc(ans, [ans === hi ? lo : hi, Math.round(n / (p / 10)) * (p / 10), ans + p].filter(function (v) { return v !== ans && v >= 0; }));
        return { q: 'Round <span class="math">' + n + '</span> to the nearest <b>' + nm + '</b>.', type: 'mc', options: o.options, answer: o.answer,
          fig: lv < 3 ? hill(n, p) : '', hint: lv < 3 ? 'Is the yellow ball before or past the top of the hill?' : 'Find the ' + nm + 's on either side. Then look at the digit to the right of the ' + nm + 's place.',
          steps: [n + ' is between ' + lo + ' and ' + hi + '.', 'The digit to the right of the ' + nm + 's place is ' + dg + '.', (dg >= 5 ? '5 or more rounds up, to ' + hi + '.' : 'Less than 5 rounds down, to ' + lo + '.') + '<div class="fig">' + hill(n, p) + '</div>'],
          explain: n + ' rounds to ' + ans + '.' };
      } }
    ]
  });

  /* ---------- More ways to ask (question shapes, see ../assets/qkit.js) ----------
     Every practice skill keeps its first way of asking ("plain") and adds new shapes:
     a picture to tap, a story, a reverse question, a mistake to find, cards to order or match.
     Shapes unlock with the level, so level 1 stays gentle. q.meta is read by the automated answer checks. */
  var Q = A.Q;
  if (Q) (function () {
    var nm = Q.name;
    function why(right, wrong) { var o = R.mc(right, wrong); return { options: o.options, answer: o.answer }; }
    function distinct3(nonzero) {
      var d;
      do { d = [R.int(1, 9), R.int(nonzero ? 1 : 0, 9), R.int(nonzero ? 1 : 0, 9)]; } while (d[0] === d[1] || d[1] === d[2] || d[0] === d[2]);
      return d;
    }
    function num3(d) { return d[0] * 100 + d[1] * 10 + d[2]; }
    function u(n, i) { var s = String(n); return s.slice(0, i) + '<u>' + s.charAt(i) + '</u>' + s.slice(i + 1); }
    /* big digits in boxes; each box can be tapped */
    function digitPic(n) {
      var s = String(n), w = 84, h = '';
      for (var i = 0; i < s.length; i++) {
        var x = 4 + i * w;
        h += '<g data-hit="' + i + '" aria-label="the ' + s.charAt(i) + ' in the ' + A.PLACES[s.length - 1 - i] + ' place"><rect x="' + x + '" y="4" width="' + (w - 10) + '" height="92" rx="14" style="fill:var(--card);stroke:var(--line)" stroke-width="2.5"/>' +
          '<text x="' + (x + (w - 10) / 2) + '" y="70" text-anchor="middle" font-size="58" font-weight="700" style="fill:var(--ink);font-family:var(--display)">' + s.charAt(i) + '</text></g>';
      }
      return A.svg(s.length * w, 100, h, 'The number ' + n + ' in big digits');
    }
    /* a short number line from lo to hi with a marker at n; the two ends can be tapped */
    function twoEnds(n, lo, hi) {
      var x0 = 56, x1 = 364, X = function (v) { return x0 + (x1 - x0) * (v - lo) / (hi - lo); }, s = '';
      s += '<line x1="' + x0 + '" y1="70" x2="' + x1 + '" y2="70" style="stroke:var(--ink)" stroke-width="3"/>';
      for (var i = 0; i <= 10; i++) { var x = x0 + (x1 - x0) * i / 10; s += '<line x1="' + x + '" y1="' + (i === 5 ? 58 : 63) + '" x2="' + x + '" y2="' + (i === 5 ? 82 : 77) + '" style="stroke:var(--ink)" stroke-width="2"/>'; }
      s += '<circle cx="' + X(n) + '" cy="70" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/><text x="' + X(n) + '" y="46" text-anchor="middle" font-size="24" font-weight="700" style="fill:var(--ink)">' + n + '</text>';
      [[lo, x0], [hi, x1]].forEach(function (e) {
        s += '<g data-hit="' + e[0] + '" aria-label="' + e[0] + '"><rect x="' + (e[1] - 50) + '" y="94" width="100" height="50" rx="10" style="fill:var(--card);stroke:var(--line)" stroke-width="2.5"/>' +
          '<text x="' + e[1] + '" y="124" text-anchor="middle" font-size="26" font-weight="700" style="fill:var(--ink)">' + e[0] + '</text></g>';
      });
      return A.svg(420, 150, s, n + ' on a number line from ' + lo + ' to ' + hi);
    }
    function placeOf(p) { return A.PLACES[p]; }

    var SHAPES = {
      'n3-value': [
        [1, 'tap', function (lv) {
          var d = distinct3(true), n = num3(d), i = R.int(0, 2), p = 2 - i, val = d[i] * Math.pow(10, p);
          return { q: 'Tap the digit that is worth <b>' + val + '</b>.', type: 'tap', pic: digitPic(n), answer: String(i), answerText: 'the ' + d[i] + ' in the ' + placeOf(p) + ' place',
            hint: 'Which place is worth ' + (p === 2 ? 'hundreds' : p === 1 ? 'tens' : 'ones') + '? Count places from the right: ones, tens, hundreds.',
            steps: [val + ' is ' + d[i] + ' ' + placeOf(p) + '.', 'The ' + placeOf(p) + ' place is ' + ['the last digit', 'the middle digit', 'the first digit'][p] + '.', 'So tap the ' + d[i] + '.'],
            explain: 'In ' + n + ', the ' + d[i] + ' is in the ' + placeOf(p) + ' place, so it is worth ' + val + '.', meta: { k: 'value-tap', n: n, val: val } };
        }],
        [1, 'story', function (lv) {
          var c = R.pick([['students', 'A school has', 'students'], ['books', 'The library has', 'books'], ['seats', 'The hockey arena has', 'seats in one section'], ['cans', 'The class collected', 'cans of food']]);
          var d = distinct3(true), n = num3(d), i = lv === 1 ? R.int(0, 1) : R.int(0, 2), p = 2 - i, val = d[i] * Math.pow(10, p);
          return { q: c[1] + ' ' + n + ' ' + c[2] + '. The <b>' + d[i] + '</b> in ' + n + ' stands for how many ' + c[0] + '?', type: 'num', answer: val,
            hint: 'Which place is the ' + d[i] + ' in?', steps: ['The ' + d[i] + ' is in the ' + placeOf(p) + ' place.', d[i] + ' ' + placeOf(p) + ' = ' + val + '.'],
            explain: 'The ' + d[i] + ' stands for ' + val + ' ' + c[0] + '.', meta: { k: 'value-num', n: n, i: i } };
        }],
        [1, 'mistake', function (lv) {
          var d = distinct3(true), n = num3(d), i = R.int(0, 1), p = 2 - i, val = d[i] * Math.pow(10, p), who = nm();
          var truth = !R.int(0, 2), said = truth ? val : R.pick([d[i], d[i] * Math.pow(10, p === 2 ? 1 : 2)]);
          var right = 'The ' + d[i] + ' is in the ' + placeOf(p) + ' place, so it is worth ' + val + '.';
          return { q: who + ' says the <b>' + d[i] + '</b> in <span class="math">' + u(n, i) + '</span> is worth <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['A digit is always worth just itself.', 'The ' + d[i] + ' is in the ' + placeOf(p === 2 ? 1 : 2) + ' place, so it is worth ' + d[i] * Math.pow(10, p === 2 ? 1 : 2) + '.', 'The biggest digit is always worth the most.']),
            hint: 'Find the place of the underlined digit first.', steps: [right], explain: right, meta: { k: 'value-tf', n: n, i: i, said: said } };
        }],
        [2, 'pick', function (lv) {
          var dg = R.int(1, 9), p = R.int(1, 2), opts = [], vals = {};
          while (opts.length < 5) {
            var pp = opts.length < 2 ? p : R.int(0, 2), dd = [R.int(1, 9), R.int(0, 9), R.int(0, 9)];
            dd[2 - pp] = dg; for (var k = 0; k < 3; k++) if (k !== 2 - pp && dd[k] === dg) dd[k] = (dg % 9) + 1;
            var n = num3(dd); if (!vals[n]) { vals[n] = 1; opts.push(n); }
          }
          opts = R.shuffle(opts);
          var ans = [], target = dg * Math.pow(10, p);
          opts.forEach(function (n, j) { if (Math.floor(n / Math.pow(10, p)) % 10 === dg) ans.push(j); });
          if (ans.length === 5) return SHAPES['n3-value'][3][2](lv);
          return { q: 'Pick every number where the <b>' + dg + '</b> is worth <b>' + target + '</b>.', type: 'pick', options: opts.map(String), answer: ans,
            hint: target + ' means the ' + dg + ' must be in the ' + placeOf(p) + ' place.', steps: ['The ' + placeOf(p) + ' place is ' + (p === 2 ? 'the first digit' : 'the middle digit') + '.', 'Pick each number with a ' + dg + ' there.'],
            explain: 'The ' + dg + ' is worth ' + target + ' only when it is in the ' + placeOf(p) + ' place.', meta: { k: 'value-pick', dg: dg, p: p, opts: opts } };
        }],
        [3, 'match', function (lv) {
          var pairs = [], seen = {};
          while (pairs.length < 3) {
            var d = distinct3(true), n = num3(d), i = R.int(0, 2), val = d[i] * Math.pow(10, 2 - i);
            if (seen[val]) continue; seen[val] = 1;
            pairs.push(['<span class="math">' + u(n, i) + '</span>', String(val)]);
          }
          return { q: 'Match each underlined digit to the value it stands for.', type: 'match', pairs: pairs,
            hint: 'For each number, find the place of the underlined digit.', steps: ['Ones are worth 1 each, tens 10 each, hundreds 100 each.'],
            explain: pairs.map(function (p) { return p[0].replace(/<[^>]+>/g, '') + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'value-match', pairs: pairs } };
        }]
      ],
      'n3-blocks': [
        [1, 'build', function (lv) {
          var h = R.int(1, lv === 1 ? 4 : 9), t = R.int(lv === 1 ? 1 : 0, lv === 1 ? 6 : 9), o = R.int(lv === 1 ? 1 : 0, 9), n = h * 100 + t * 10 + o;
          return { q: 'Show <b>' + n + '</b> with base-ten blocks. Then press Check.', type: 'build', tool: 'base10', answer: n,
            hint: 'A flat is 100, a rod is 10, a small cube is 1. ' + n + ' needs ' + h + ' flats.',
            steps: [n + ' is ' + plural(h, 2) + ', ' + plural(t, 1) + ' and ' + plural(o, 0) + '.', 'Add ' + h + ' flats, ' + t + ' rods and ' + o + ' small cubes.'],
            explain: plural(h, 2) + ', ' + plural(t, 1) + ' and ' + plural(o, 0) + ' make ' + n + '.', meta: { k: 'blocks-build', n: n } };
        }],
        [1, 'story', function (lv) {
          var c = R.pick([['crayons', 'boxes of 100', 'packs of 10', 'loose crayons', 'A shop has'], ['stickers', 'sheets of 100', 'strips of 10', 'single stickers', 'Mei has'], ['beads', 'bags of 100', 'strings of 10', 'loose beads', 'The art room has']]);
          var h = R.int(1, 9), t = R.int(lv === 1 ? 1 : 0, 9), o = R.int(lv === 1 ? 1 : 0, 9), n = h * 100 + t * 10 + o;
          return { q: c[4] + ' ' + h + ' ' + c[1] + ', ' + t + ' ' + c[2] + ' and ' + o + ' ' + c[3] + '. How many ' + c[0] + ' is that in all?', type: 'num', answer: n,
            hint: 'Each ' + c[1].split(' ')[0].replace(/s$/, '') + ' is a hundred. Each ' + c[2].split(' ')[0].replace(/s$/, '') + ' is a ten.',
            steps: [h + ' hundreds = ' + h * 100 + '. ' + t + ' tens = ' + t * 10 + '.', h * 100 + ' + ' + t * 10 + ' + ' + o + ' = ' + n + '.'],
            explain: h * 100 + ' + ' + t * 10 + ' + ' + o + ' = ' + n + ' ' + c[0] + '.', meta: { k: 'blocks-story', h: h, t: t, o: o } };
        }],
        [1, 'tap', function (lv) {
          var d = distinct3(lv === 1), n = num3(d), alts = [d[2] * 100 + d[1] * 10 + d[0], d[0] * 100 + d[2] * 10 + d[1], d[1] * 100 + d[0] * 10 + d[2]].filter(function (v) { return v !== n && v >= 100; });
          var set = R.shuffle([n].concat(alts.slice(0, 2)));
          return { q: 'Which blocks show <b>' + n + '</b>? Tap them.', type: 'tap', tiles: set.map(function (v) { return A.draw.blocks(v, 'Base-ten blocks', 260, 3); }), answer: set.indexOf(n), answerText: 'the blocks with ' + plural(d[0], 2) + ', ' + plural(d[1], 1) + ' and ' + plural(d[2], 0),
            hint: n + ' has ' + d[0] + ' hundreds. Look for ' + d[0] + ' flats first.', steps: ['Count the flats in each picture. You need ' + d[0] + '.', 'Then check the rods (' + d[1] + ') and the small cubes (' + d[2] + ').'],
            explain: n + ' is ' + plural(d[0], 2) + ', ' + plural(d[1], 1) + ' and ' + plural(d[2], 0) + '.', meta: { k: 'blocks-tap', n: n, set: set } };
        }],
        [2, 'mistake', function (lv) {
          var h = R.int(1, 9), t = R.int(0, 9), o = R.int(1, 9), n = h * 100 + t * 10 + o, who = nm();
          if (t === o) t = (t + 3) % 10;
          n = h * 100 + t * 10 + o;
          var truth = !R.int(0, 2), said = truth ? n : (t === 0 ? h * 10 + o : h * 100 + o * 10 + t);
          var right = 'There are ' + plural(h, 2) + ', ' + plural(t, 1) + ' and ' + plural(o, 0) + ', so the blocks show ' + n + '.';
          return { q: who + ' says these blocks show <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: A.draw.blocks(n, 'Base-ten blocks', 540, 5),
            why: why(right, [t === 0 ? 'There are no rods, so you can skip the tens place.' : 'Count the small cubes before the rods.', 'Every block is worth 1, so just count them.', 'Rods are worth 100 each.']),
            hint: 'Count flats, then rods, then small cubes.', steps: [right], explain: right, meta: { k: 'blocks-tf', n: n, said: said } };
        }],
        [2, 'fill', function (lv) {
          var h = R.int(1, 9), t = R.int(0, 9), o = R.int(0, 9), n = h * 100 + t * 10 + o;
          if (lv === 3) {
            /* trade: show it with one less hundred */
            var t2 = t + 10;
            return { q: 'There are no flats left, so use rods instead. Fill in the blanks.', type: 'fill', fill: '<span class="math">' + n + '</span> = [[]] hundreds, [[]] tens and [[]] ones', answers: [h - 1, t2, o],
              hint: 'Trade 1 flat for 10 rods. One less hundred, ten more tens.', steps: [n + ' is ' + plural(h, 2) + ', ' + plural(t, 1) + ', ' + plural(o, 0) + '.', 'Trade 1 hundred for 10 tens: ' + (h - 1) + ' hundreds and ' + t2 + ' tens.'],
              explain: (h - 1) * 100 + ' + ' + t2 * 10 + ' + ' + o + ' = ' + n + '.', meta: { k: 'blocks-trade', n: n } };
          }
          return { q: 'Fill in the blanks.', type: 'fill', fill: '<span class="math">' + n + '</span> = [[]] hundreds, [[]] tens and [[]] ones', answers: [h, t, o],
            hint: 'The first digit is the hundreds. A place with 0 gets 0.', steps: ['Read the digits from left to right: ' + h + ', ' + t + ', ' + o + '.'],
            explain: n + ' = ' + plural(h, 2) + ', ' + plural(t, 1) + ' and ' + plural(o, 0) + '.', meta: { k: 'blocks-fill', n: n } };
        }]
      ],
      'n3-forms': [
        [1, 'fill', function (lv) {
          var h = R.int(1, 9), t = R.int(1, 9), o = R.int(1, 9), n = h * 100 + t * 10 + o;
          if (lv >= 2 && R.int(0, 1)) {
            var z = R.int(0, 1); if (z) t = 0; else o = 0; n = h * 100 + t * 10 + o;
            return { q: 'Write <b>' + n + '</b> in expanded form. A place with 0 is left out.', type: 'fill', fill: '<span class="math">' + n + '</span> = [[]] + [[]]', answers: [h * 100, t ? t * 10 : o],
              hint: 'Write the value of each digit that is not 0.', steps: ['The ' + h + ' is worth ' + h * 100 + '.', (t ? 'The ' + t + ' is worth ' + t * 10 : 'The ' + o + ' is worth ' + o) + '. The 0 adds nothing.'],
              explain: n + ' = ' + h * 100 + ' + ' + (t ? t * 10 : o) + '.', meta: { k: 'forms-fill', n: n, parts: 2 } };
          }
          return { q: 'Write <b>' + n + '</b> in expanded form.', type: 'fill', fill: '<span class="math">' + n + '</span> = [[]] + [[]] + [[]]', answers: [h * 100, t * 10, o],
            hint: 'Write the value of each digit: hundreds, then tens, then ones.', steps: ['The ' + h + ' is worth ' + h * 100 + '.', 'The ' + t + ' is worth ' + t * 10 + '. The ' + o + ' is worth ' + o + '.'],
            explain: n + ' = ' + h * 100 + ' + ' + t * 10 + ' + ' + o + '.', meta: { k: 'forms-fill', n: n, parts: 3 } };
        }],
        [1, 'match', function (lv) {
          var d = distinct3(lv === 1), base = [num3(d), d[0] * 100 + d[2] * 10 + d[1], d[1] * 100 + d[0] * 10 + d[2]].filter(function (v) { return v >= 100; });
          while (base.length < 3) { var x = R.int(101, 999); if (base.indexOf(x) < 0) base.push(x); }
          var pairs = base.slice(0, 3).map(function (n) { var parts = [Math.floor(n / 100) * 100, Math.floor(n / 10) % 10 * 10, n % 10].filter(function (v) { return v; }); return [parts.join(' + '), String(n)]; });
          return { q: 'Match each expanded form to its number.', type: 'match', pairs: pairs,
            hint: 'Look at the tens part and the ones part. They can look alike.', steps: ['Add the parts of each one: hundreds + tens + ones.'],
            explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'forms-match', pairs: pairs } };
        }],
        [1, 'story', function (lv) {
          var c = R.pick([['birds', 'A farm has', 'hens', 'ducks', 'geese'], ['pieces of fruit', 'A fruit stand has', 'apples', 'pears', 'plums'], ['books', 'A school library has', 'novels', 'comics', 'atlases']]);
          var h = R.int(1, 9), t = R.int(1, 9), o = R.int(1, 9), n = h * 100 + t * 10 + o;
          var parts = [[h * 100, c[2]], [t * 10, c[3]], [o, c[4]]];
          if (lv >= 2) parts = R.shuffle(parts);
          return { q: c[1] + ' ' + parts[0][0] + ' ' + parts[0][1] + ', ' + parts[1][0] + ' ' + parts[1][1] + ' and ' + parts[2][0] + ' ' + parts[2][1] + '. How many ' + c[0] + ' in all?', type: 'num', answer: n,
            hint: 'Put the hundreds, tens and ones together.', steps: ['Sort the parts: ' + h * 100 + ' + ' + t * 10 + ' + ' + o + '.', 'Write one digit for each place: ' + n + '.'],
            explain: h * 100 + ' + ' + t * 10 + ' + ' + o + ' = ' + n + '.', meta: { k: 'forms-story', parts: [h * 100, t * 10, o] } };
        }],
        [2, 'mistake', function (lv) {
          var h = R.int(1, 9), t = R.int(1, 9), o = R.int(1, 9), who = nm(), kind = R.int(0, 2), parts, n, said;
          if (kind === 0) { parts = [h * 100, t * 10, o]; n = h * 100 + t * 10 + o; said = n; }
          else if (kind === 1) { parts = [h * 100, t * 10, o]; n = h * 100 + t * 10 + o; said = +(h + '' + t + '0' + o); }
          else { parts = [h * 100, o]; n = h * 100 + o; said = +(h + '' + o); }
          var truth = said === n, right = parts.join(' + ') + ' is ' + n + '.' + (parts.length === 2 ? ' There are no tens, so the tens digit is 0.' : '');
          return { q: who + ' wrote <span class="math">' + parts.join(' + ') + '</span> as <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Write down each part just as it looks.', 'You can leave out a place that has nothing in it.', 'The ones always go first.']),
            hint: 'Each part goes in its own place: hundreds, tens, ones.', steps: [right], explain: right, meta: { k: 'forms-tf', parts: parts, said: said } };
        }],
        [3, 'pick', function (lv) {
          var h = R.int(2, 9), t = R.int(0, 8), o = R.int(1, 9), n = h * 100 + t * 10 + o;
          var good = [plural(h, 2) + ', ' + plural(t, 1) + ', ' + plural(o, 0), (h * 100) + (t ? ' + ' + t * 10 : '') + ' + ' + o, plural(h - 1, 2) + ', ' + plural(t + 10, 1) + ', ' + plural(o, 0)];
          var bad = [plural(h, 2) + ', ' + plural(o, 1) + ', ' + plural(t, 0), (h * 10) + ' + ' + (t * 10) + ' + ' + o, plural(h + 1, 2) + ', ' + plural(t, 1) + ', ' + plural(o, 0)];
          if (t === o) bad[0] = plural(h, 2) + ', ' + plural(t + 1, 1) + ', ' + plural(o, 0);
          var all = R.shuffle(good.slice(0, 2 + R.int(0, 1)).map(function (g) { return [g, 1]; }).concat(bad.slice(0, 2).map(function (b) { return [b, 0]; })));
          var ans = []; all.forEach(function (x, j) { if (x[1]) ans.push(j); });
          return { q: 'Pick every way to show <b>' + n + '</b>.', type: 'pick', options: all.map(function (x) { return x[0]; }), answer: ans,
            hint: 'Work out the value of each one. More than one can be right.', steps: ['Turn each one into a number by adding its parts.', 'Ten tens make one hundred, so ' + plural(h - 1, 2) + ' and ' + plural(t + 10, 1) + ' is also ' + n + '.'],
            explain: 'The right ones all add up to ' + n + '.', meta: { k: 'forms-pick', n: n, opts: all.map(function (x) { return x[0]; }) } };
        }]
      ],
      'n3-words': [
        [1, 'tap', function (lv) {
          var h = R.int(1, 9), t = lv === 1 ? R.int(2, 9) : R.pick([0, R.int(1, 9)]), o = R.int(1, 9), n = h * 100 + t * 10 + o;
          var set = [n, h * 100 + o * 10 + t, h * 10 + o, h * 100 + ((t + 2) % 10) * 10 + o].filter(function (v, i, a) { return a.indexOf(v) === i && (i === 0 || v !== n); }).slice(0, 3);
          set = R.shuffle(set);
          return { q: 'Tap the number <b>' + words(n) + '</b>.', type: 'tap', tiles: set.map(function (v) { return '<span class="math big">' + v + '</span>'; }), answer: set.indexOf(n), answerText: String(n),
            hint: 'Hundreds first, then tens, then ones. Use 0 for an empty place.', steps: ['"' + ones[h] + ' hundred" is ' + h * 100 + '.', 'The rest is ' + (n % 100) + ', so the number is ' + n + '.'],
            explain: words(n) + ' is ' + n + '.', meta: { k: 'words-tap', n: n, set: set } };
        }],
        [1, 'match', function (lv) {
          var h = R.int(1, 9), t = R.int(2, 9), o = R.int(1, 9);
          if (t === o) o = (o % 9) + 1;
          var set = [h * 100 + t * 10 + o, h * 100 + o * 10 + t, h * 100 + o];
          if (o * 10 + t < 20) set[1] = h * 100 + t * 10;
          if (lv >= 2) set[2] = t * 100 + h * 10 + o;
          var uniq = []; set.forEach(function (v) { if (uniq.indexOf(v) < 0 && v >= 100 && v <= 999) uniq.push(v); });
          while (uniq.length < 3) { var x = R.int(101, 999); if (uniq.indexOf(x) < 0) uniq.push(x); }
          var pairs = uniq.map(function (n) { return [words(n), String(n)]; });
          return { q: 'Match each number name to its number.', type: 'match', pairs: pairs,
            hint: 'Read the hundreds part first. Is there a tens part?', steps: ['"' + ones[h] + ' hundred" means a ' + h + ' in the hundreds place.'],
            explain: pairs.map(function (p) { return p[0] + ' is ' + p[1]; }).join('. ') + '.', meta: { k: 'words-match', pairs: pairs } };
        }],
        [1, 'story', function (lv) {
          var c = R.pick(['The class collected <b>W</b> cans of food.', 'The hockey arena has <b>W</b> seats in one section.', 'The walking trail is <b>W</b> metres long.', 'The school has <b>W</b> students.']);
          var h = R.int(1, 9), t = lv === 1 ? R.int(2, 9) : R.pick([0, R.int(1, 9)]), o = R.int(1, 9), n = h * 100 + t * 10 + o;
          var wrong = [h * 10 + o, h * 100 + o * 10 + t, h * 1000 + t * 10 + o, h * 100 + ((t + 1) % 10) * 10 + o].filter(function (w) { return w !== n; });
          var oo = R.mc(n, wrong);
          return { q: c.replace('W', words(n)) + ' Which number is that?', type: 'mc', options: oo.options, answer: oo.answer,
            hint: 'Write the hundreds digit first, then the tens, then the ones. Use 0 for an empty place.', steps: ['"' + ones[h] + ' hundred" is ' + h * 100 + '.', 'The rest is ' + (n % 100) + '.', 'Together: ' + n + '.'],
            explain: words(n) + ' is ' + n + '.', meta: { k: 'words-mc', n: n } };
        }],
        [2, 'mistake', function (lv) {
          var h = R.int(1, 9), t = R.pick([0, 1, R.int(2, 9)]), o = R.int(1, 9), n = h * 100 + t * 10 + o, who = nm();
          var truth = !R.int(0, 2), said = truth ? n : +(h + '00' + String(n % 100));
          var right = words(n) + ' is ' + n + ': ' + plural(h, 2) + ', ' + plural(t, 1) + ' and ' + plural(o, 0) + '.';
          return { q: who + ' wrote <b>' + words(n) + '</b> as <span class="math">' + said + '</span>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Write "hundred" as 00, then write the rest.', 'Write each word as its own number, side by side.', 'Numbers with "hundred" always have four digits.']),
            hint: 'A number in the hundreds has 3 digits.', steps: [right], explain: right, meta: { k: 'words-tf', n: n, said: said } };
        }],
        [2, 'order', function (lv) {
          var k = lv === 3 ? 4 : 3, nums = [], hd = R.int(1, 8);
          while (nums.length < k) { var v = (hd + R.int(0, 1)) * 100 + R.int(0, 9) * 10 + R.int(1, 9); if (nums.indexOf(v) < 0) nums.push(v); }
          nums.sort(function (a, b) { return a - b; });
          return { q: 'Put these numbers in order from <b>least to greatest</b>.', type: 'order', items: nums.map(words), first: 'least', last: 'greatest',
            hint: 'Find the hundreds in each name first. Then the tens.', steps: ['As numbers: ' + R.shuffle(nums).join(', ') + '.', 'In order: ' + nums.join(', ') + '.'],
            explain: 'Least to greatest: ' + nums.join(', ') + '.', meta: { k: 'words-order', nums: nums } };
        }]
      ],
      'n3-skip': [
        [1, 'line', function (lv) {
          var by = lv === 1 ? R.pick([10, 100]) : lv === 2 ? 50 : R.pick([50, 100]), max = by === 10 ? 100 : 1000, j = R.int(2, 4);
          var start = R.int(0, (max - by * j) / by) * by, ans = start + by * j;
          return { q: 'Start at <b>' + start + '</b>. Count on by ' + by + 's, ' + j + ' times. Where do you land? Put the marker there.', type: 'line', min: 0, max: max, tick: by, every: by === 50 ? 100 : by, snap: by, answer: ans,
            hint: 'Each jump adds ' + by + '. Jump ' + j + ' times from ' + start + '.', steps: ['Start at ' + start + '.', 'Jumps: ' + [1, 2, 3, 4].slice(0, j).map(function (x) { return start + by * x; }).join(', ') + '.', 'You land on ' + ans + '.'],
            explain: start + ' and ' + j + ' jumps of ' + by + ' lands on ' + ans + '.', meta: { k: 'skip-line', start: start, by: by, j: j } };
        }],
        [1, 'order', function (lv) {
          var by = lv === 1 ? 10 : R.pick([50, 100, 25 * 2]), k = lv === 1 ? 4 : 5, start = R.int(1, 40) * 10, back = lv === 3 && R.int(0, 1);
          if (start + by * (k - 1) > 1000) start = 1000 - by * (k - 1);
          var seq = []; for (var i = 0; i < k; i++) seq.push(start + by * i);
          if (back) seq.reverse();
          return { q: 'Put these in counting order. Count ' + (back ? 'backward ' : '') + 'by ' + by + 's.', type: 'order', items: seq.map(String), first: 'start',
            hint: back ? 'Start with the biggest. Each next number is ' + by + ' less.' : 'Start with the smallest. Each next number is ' + by + ' more.', steps: ['Find the ' + (back ? 'biggest' : 'smallest') + ' number: ' + seq[0] + '.', 'Then ' + (back ? 'take away ' : 'add ') + by + ' each time.'],
            explain: seq.join(', ') + '.', meta: { k: 'skip-order', seq: seq } };
        }],
        [1, 'story', function (lv) {
          var c = lv === 1 ? R.pick([[10, 'Pencils come in packs of 10.', 'packs', 'pencils'], [100, 'A roll has 100 tickets.', 'rolls', 'tickets']]) : R.pick([[50, 'A box holds 50 crayons.', 'boxes', 'crayons'], [100, 'A sheet has 100 stickers.', 'sheets', 'stickers'], [50, 'A bag holds 50 marbles.', 'bags', 'marbles']]);
          var k = R.int(3, Math.min(9, Math.floor(1000 / c[0]))), ans = c[0] * k;
          return { q: c[1] + ' Count by ' + c[0] + 's. How many ' + c[3] + ' are in <b>' + k + ' ' + c[2] + '</b>?', type: 'num', answer: ans,
            hint: 'Count by ' + c[0] + 's, ' + k + ' times.', steps: ['Count: ' + [1, 2, 3, 4, 5, 6, 7, 8, 9].slice(0, k).map(function (x) { return x * c[0]; }).join(', ') + '.', 'That is ' + ans + ' ' + c[3] + '.'],
            explain: k + ' ' + c[2] + ' of ' + c[0] + ' is ' + ans + ' ' + c[3] + '.', meta: { k: 'skip-story', by: c[0], n: k } };
        }],
        [2, 'tap', function (lv) {
          var by = R.pick([10, 50, 100]), start = by === 10 ? R.int(10, 80) * 10 : R.int(0, 4) * by, seq = [], who = nm();
          for (var i = 0; i < 5; i++) seq.push(start + by * i);
          var bad = R.int(1, 4), wrongV = seq[bad] + R.pick([by === 10 ? 1 : 10, by === 10 ? -100 : -by / 2 > 0 ? -5 : 5, by === 10 ? 100 : 10]);
          if (by === 10 && seq[bad] % 100 === 0) wrongV = seq[bad] - 100 + 10;
          if (wrongV === seq[bad] || wrongV < 0) wrongV = seq[bad] + (by === 10 ? 1 : 10);
          var shown = seq.slice(); shown[bad] = wrongV;
          return { q: who + ' counted by ' + by + 's. One number is wrong. Tap it.', type: 'tap', tiles: shown.map(function (v) { return '<span class="math big">' + v + '</span>'; }), answer: bad, answerText: wrongV + ' (it should be ' + seq[bad] + ')',
            hint: 'Check each jump. Is it ' + by + ' more every time?', steps: ['Start at ' + seq[0] + ' and add ' + by + ' each time: ' + seq.join(', ') + '.', wrongV + ' should be ' + seq[bad] + '.'],
            explain: 'Counting by ' + by + 's: ' + seq.join(', ') + '. ' + wrongV + ' is wrong.', meta: { k: 'skip-tap', shown: shown, by: by } };
        }],
        [2, 'fill', function (lv) {
          var by = R.pick([50, 100, 10]), start = R.int(1, 30) * 10;
          if (start + by * 4 > 1000) start = 1000 - by * 4;
          var seq = [0, 1, 2, 3, 4].map(function (i) { return start + by * i; });
          var back = lv === 3 && R.int(0, 1); if (back) seq.reverse();
          return { q: 'Fill in the missing numbers. Count ' + (back ? 'backward ' : '') + 'by ' + by + 's.', type: 'fill', fill: seq[0] + ', [[]], ' + seq[2] + ', [[]], ' + seq[4], answers: [seq[1], seq[3]],
            hint: (back ? 'Take away ' : 'Add ') + by + ' to the number before each blank.', steps: [seq[0] + (back ? ' &minus; ' : ' + ') + by + ' = ' + seq[1] + '.', seq[2] + (back ? ' &minus; ' : ' + ') + by + ' = ' + seq[3] + '.'],
            explain: seq.join(', ') + '.', meta: { k: 'skip-fill', seq: seq } };
        }]
      ],
      'n3-compare': [
        [1, 'order', function (lv) {
          var k = lv === 1 ? 3 : 4, nums = [], hd = R.int(1, 8), big = lv === 3 && R.int(0, 1);
          while (nums.length < k) { var v = lv === 1 ? R.int(1, 9) * 100 + R.int(0, 99) : (hd + R.int(0, 1)) * 100 + R.int(0, 9) * 10 + R.int(0, 9); if (nums.every(function (x) { return Math.floor(x / 100) !== Math.floor(v / 100) || lv > 1; }) && nums.indexOf(v) < 0) nums.push(v); }
          nums.sort(function (a, b) { return big ? b - a : a - b; });
          return { q: 'Put these numbers in order from <b>' + (big ? 'greatest to least' : 'least to greatest') + '</b>.', type: 'order', items: nums.map(String), first: big ? 'greatest' : 'least', last: big ? 'least' : 'greatest',
            hint: 'Compare the hundreds first. If they match, compare the tens.', steps: ['Look at the hundreds digits.', 'For numbers with the same hundreds, look at the tens.'],
            explain: nums.join(', ') + '.', meta: { k: 'cmp-order', nums: nums, big: big } };
        }],
        [1, 'story', function (lv) {
          var two = Q.two(), a = R.int(100, 999), b, thing = R.pick(['bottle caps', 'hockey cards', 'stickers', 'stamps']);
          if (lv === 1) { do { b = R.int(100, 999); } while (Math.floor(b / 100) === Math.floor(a / 100)); }
          else { do { b = Math.floor(a / 100) * 100 + R.int(0, 99); } while (b === a); }
          var less = lv === 3 && R.int(0, 1), win = less ? (a < b ? 0 : 1) : (a > b ? 0 : 1);
          return { q: two[0] + ' has ' + a + ' ' + thing + '. ' + two[1] + ' has ' + b + '. Who has <b>' + (less ? 'fewer' : 'more') + '</b>?', type: 'mc', options: [two[0], two[1]], answer: win,
            hint: 'Compare the hundreds first. If they are the same, compare the tens.', steps: ['Line up ' + a + ' and ' + b + ' by place.', 'Find the first place where the digits are different.'],
            explain: (a > b ? a + ' is more than ' + b : a + ' is less than ' + b) + ', so ' + two[win] + ' has ' + (less ? 'fewer' : 'more') + '.', meta: { k: 'cmp-story', a: a, b: b, less: less } };
        }],
        [1, 'tf', function (lv) {
          var a = R.int(100, 999), b; do { b = lv === 1 ? R.int(100, 999) : Math.floor(a / 100) * 100 + R.int(0, 99); } while (b === a);
          var sym = R.int(0, 1) ? '&gt;' : '&lt;', truth = sym === '&gt;' ? a > b : a < b;
          var sa = String(a), sb = String(b), d0 = 0; while (sa.charAt(d0) === sb.charAt(d0)) d0++;
          var pn = ['hundreds', 'tens', 'ones'][d0], right = 'Compare the ' + pn + ': ' + sa.charAt(d0) + ' is ' + (+sa.charAt(d0) > +sb.charAt(d0) ? 'more' : 'less') + ' than ' + sb.charAt(d0) + ', so ' + a + ' is ' + (a > b ? 'greater' : 'less') + '.';
          return { q: 'True or false? <span class="math">' + a + ' ' + sym + ' ' + b + '</span>', type: 'tf', answer: truth,
            why: lv === 1 ? null : why(right, ['The number with the bigger ones digit is greater.', 'Add up the digits. The bigger total is greater.', 'They have the same hundreds, so they are equal.']),
            hint: 'The symbol opens toward the greater number. Compare the hundreds first.', steps: [right], explain: right, meta: { k: 'cmp-tf', a: a, b: b, sym: sym } };
        }],
        [2, 'pick', function (lv) {
          var x = R.int(3, 8) * 100 + R.int(1, 9) * 10, opts = [], less = R.int(0, 1);
          while (opts.length < 5) { var v = x + R.pick([-1, 1]) * R.pick([1, 5, 9, 10, 40, 60, 90, 100]); if (v !== x && opts.indexOf(v) < 0 && v > 99 && v < 1000) opts.push(v); }
          var ans = []; opts.forEach(function (v, j) { if (less ? v < x : v > x) ans.push(j); });
          if (!ans.length || ans.length === 5) return SHAPES['n3-compare'][3][2](lv);
          return { q: 'Pick every number ' + (less ? 'less' : 'greater') + ' than <b>' + x + '</b>.', type: 'pick', options: opts.map(String), answer: ans,
            hint: 'Compare each number with ' + x + ', hundreds first.', steps: ['Look at the hundreds of each number. Then the tens.'],
            explain: 'The numbers ' + (less ? 'less' : 'greater') + ' than ' + x + ' are ' + ans.map(function (j) { return opts[j]; }).join(', ') + '.', meta: { k: 'cmp-pick', x: x, less: less, opts: opts } };
        }],
        [2, 'line', function (lv) {
          var h = R.int(1, 8) * 100, n = h + R.int(1, 9) * 10 + R.pick([0, 5]);
          return { q: 'Put <b>' + n + '</b> on the number line.', type: 'line', min: h, max: h + 100, tick: 10, every: 50, snap: 5, answer: n, tol: lv === 3 ? 0 : 5, place: n, hideValue: true,
            hint: 'Halfway is ' + (h + 50) + '. Is ' + n + ' before or after halfway?', steps: [n + ' is between ' + (h + Math.floor((n - h) / 10) * 10) + ' and ' + (h + Math.floor((n - h) / 10) * 10 + 10) + '.', 'Each small mark is 10 more.'],
            explain: n + ' is ' + (n - h) + ' past ' + h + '.', meta: { k: 'cmp-line', n: n } };
        }],
        [3, 'mistake', function (lv) {
          var who = nm(), h = R.int(2, 8), a = (h - 1) * 100 + R.int(8, 9) * 10 + R.int(5, 9), b = h * 100 + R.int(0, 1) * 10 + R.int(0, 4);
          var right = 'Compare the hundreds first: ' + (h - 1) + ' hundreds is less than ' + h + ' hundreds, so ' + a + ' is less than ' + b + '.';
          return { q: who + ' says <span class="math">' + a + '</span> is greater than <span class="math">' + b + '</span> because ' + a + ' has bigger digits. True or false: ' + who + ' is right.', type: 'tf', answer: false,
            why: why(right, ['Big digits always make a bigger number.', 'Compare the ones first.', 'Add the digits: the bigger total wins.']),
            hint: 'Which place do you compare first?', steps: [right], explain: right, meta: { k: 'cmp-mistake', a: a, b: b } };
        }]
      ],
      'n3-round': [
        [1, 'tap', function (lv) {
          var p = lv === 1 ? 10 : 100, n, lo;
          do { n = p === 10 ? R.int(11, 99) : R.int(101, 999); lo = Math.floor(n / p) * p; } while (n === lo || n - lo === p / 2);
          var hi = lo + p, ans = n - lo > p / 2 ? hi : lo;
          return { q: 'Is <b>' + n + '</b> closer to ' + lo + ' or ' + hi + '? Tap the closer one.', type: 'tap', pic: twoEnds(n, lo, hi), answer: String(ans), answerText: String(ans),
            hint: 'Halfway between them is ' + (lo + p / 2) + '. Which side is ' + n + ' on?', steps: ['Halfway is ' + (lo + p / 2) + '.', n + ' is ' + (ans === hi ? 'past' : 'before') + ' halfway, so it is closer to ' + ans + '.'],
            explain: n + ' is closer to ' + ans + '. So ' + n + ' rounds to ' + ans + '.', meta: { k: 'round-tap', n: n, lo: lo, hi: hi } };
        }],
        [1, 'story', function (lv) {
          var p = lv === 1 ? 10 : R.pick([10, 100]), c = R.pick(['A jar has N marbles.', 'The school has N students.', 'N people came to the fair.', 'The trail is N metres long.']);
          var n = p === 10 ? R.int(12, 98) * (lv === 1 ? 1 : 1) + (lv > 1 ? R.int(1, 9) * 100 : 0) : R.int(101, 999);
          if (n % p === 0) n += 3;
          var lo = Math.floor(n / p) * p, hi = lo + p, ans = n - lo >= p / 2 ? hi : lo;
          var o = R.mc(ans, [ans === hi ? lo : hi, Math.round(n / (p / 10)) * (p / 10), ans + p].filter(function (v) { return v !== ans && v >= 0; }));
          return { q: c.replace('N', n) + ' About how many is that, to the nearest <b>' + (p === 10 ? 'ten' : 'hundred') + '</b>?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'Find the ' + (p === 10 ? 'tens' : 'hundreds') + ' on each side of ' + n + '. Which is closer?', steps: [n + ' is between ' + lo + ' and ' + hi + '.', 'The digit to the right is ' + Math.floor((n % p) / (p / 10)) + '. ' + (ans === hi ? '5 or more rounds up.' : 'Less than 5 rounds down.')],
            explain: n + ' rounds to ' + ans + '.', meta: { k: 'round-mc', n: n, p: p } };
        }],
        [1, 'pick', function (lv) {
          var p = lv === 1 ? 10 : R.pick([10, 100]), target = p === 100 ? R.int(2, 8) * 100 : R.int(12, 88) * 10, opts = [];
          while (opts.length < 5) {
            var v = target + R.int(p === 100 ? -70 : -8, p === 100 ? 70 : 8);
            if (opts.indexOf(v) < 0 && v !== target && v > 0) opts.push(v);
          }
          var ans = []; opts.forEach(function (v, j) { var lo = Math.floor(v / p) * p, r = v - lo >= p / 2 ? lo + p : lo; if (r === target) ans.push(j); });
          if (!ans.length || ans.length === 5) return SHAPES['n3-round'][2][2](lv);
          return { q: 'Pick every number that rounds to <b>' + target + '</b> (nearest ' + (p === 10 ? 'ten' : 'hundred') + ').', type: 'pick', options: opts.map(String), answer: ans,
            hint: 'Numbers from ' + (target - p / 2) + ' up to ' + (target + p / 2 - 1) + ' round to ' + target + '.', steps: ['Round each number. Keep the ones that land on ' + target + '.', 'Halfway numbers, like ' + (target - p / 2) + ', round up.'],
            explain: ans.map(function (j) { return opts[j]; }).join(', ') + ' round to ' + target + '.', meta: { k: 'round-pick', target: target, p: p, opts: opts } };
        }],
        [2, 'mistake', function (lv) {
          var who = nm(), h = R.int(1, 8), t, o, truth = R.int(0, 1), n, said, right;
          if (truth) { t = R.int(5, 9); o = R.int(0, 9); n = h * 100 + t * 10 + o; said = (h + 1) * 100; right = 'The tens digit is ' + t + ', which is 5 or more, so ' + n + ' rounds up to ' + said + '.'; }
          else { t = R.int(1, 4); o = R.int(6, 9); n = h * 100 + t * 10 + o; said = (h + 1) * 100; right = 'To round to the nearest hundred, look at the tens digit. It is ' + t + ', less than 5, so ' + n + ' rounds down to ' + h * 100 + '.'; }
          return { q: who + ' rounded <span class="math">' + n + '</span> to the nearest hundred and got <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: !!truth,
            why: why(right, ['Look at the ones digit: ' + o + ' tells you which way to round.', 'Always round up.', 'Round to the hundred that comes first.']),
            hint: 'To round to the nearest hundred, look at the tens digit.', steps: [right], explain: right, meta: { k: 'round-tf', n: n, said: said } };
        }],
        [3, 'match', function (lv) {
          var base = R.int(1, 6) * 100, pairs = [];
          [[base + R.int(1, 4) * 10 + R.int(0, 9), base], [base + R.int(5, 9) * 10 + R.int(0, 9), base + 100], [base + 100 + R.int(5, 9) * 10 + R.int(0, 9), base + 200]].forEach(function (x) { pairs.push([String(x[0]), String(x[1])]); });
          return { q: 'Match each number to the nearest hundred.', type: 'match', pairs: R.shuffle(pairs),
            hint: 'Look at the tens digit of each number.', steps: ['Tens digit 5 or more: round up. Less than 5: round down.'],
            explain: pairs.map(function (p) { return p[0] + ' rounds to ' + p[1]; }).join('. ') + '.', meta: { k: 'round-match', pairs: pairs } };
        }]
      ]
    };
    var ch = A.chapters[CH];
    ch.quizFresh = true;
    ch.practice.forEach(function (sk) {
      var plain = sk.gen, extra = SHAPES[sk.id] || [];
      sk.shapes = ['plain'].concat(extra.map(function (s) { return s[1]; }));
      sk.gen = function (lv) { return Q.vary(sk.id, lv, [[1, 'plain', plain]].concat(extra)); };
    });
    ch._shapes = SHAPES;
  })();
})();
