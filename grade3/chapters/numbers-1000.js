/* Grade 3 Numbers to 1000: a full chapter (docs/QUESTIONS.md, "Full chapters"). 5 lessons, 17 ideas, one practice skill per idea.
   Ontario 2020: B1.1 read, represent, compose and decompose numbers to 1000, B1.2 compare and order, B1.3 round to the nearest ten or hundred,
   B1.4 count to 1000 by 50s, 100s and 200s, B1.5 place value with base ten materials.
   Every question sets meta.k; the answer checks are in tests/verify/grade3.js (keys start with g3n-). */
(function () {
  var A = Atlas, R = A.R, Q = A.Q, CH = 'numbers-1000';
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function words(n) {
    if (n === 1000) return 'one thousand';
    if (n === 0) return 'zero';
    var s = '';
    if (n >= 100) { s += ONES[Math.floor(n / 100)] + ' hundred'; n %= 100; if (n) s += ' '; }
    if (n >= 20) { s += TENS[Math.floor(n / 10)]; if (n % 10) s += '-' + ONES[n % 10]; } else if (n > 0) s += ONES[n];
    return s;
  }

  /* ---------- words and numbers ---------- */
  function put(o, x) { for (var k in x) o[k] = x[k]; return o; }
  function plain(h) { var e = document.createElement('div'); e.innerHTML = String(h); return e.textContent.replace(/\s+/g, ' ').trim(); }
  function coin() { return Math.random() < 0.5; }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function placeN(k, p) { return k + ' ' + (k === 1 ? A.PLACE1[p] : A.PLACES[p]); }
  function hto(h, t, o) { return placeN(h, 2) + ', ' + placeN(t, 1) + ' and ' + placeN(o, 0); }
  function dig(n) { return [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10]; }
  function math(t) { return '<span class="math">' + t + '</span>'; }
  function u(n, i) { var s = String(n); return s.slice(0, i) + '<u>' + s.charAt(i) + '</u>' + s.slice(i + 1); }
  function others(list, not) { return R.shuffle(list.filter(function (x) { return x !== not; })); }
  function roundTo(n, p) { return Math.floor(n / p) * p + (n % p >= p / 2 ? p : 0); }
  var PNAME = ['ones', 'tens', 'hundreds'];

  /* ---------- question builders ---------- */
  /* pick one: the right answer and up to 3 wrong ones; wrongs = [[html, fix], ...]. q.wrong holds the fixes (Atlas.Q.diag). */
  function mc(q, right, wrongs, x) {
    right = String(right);
    var seen = {}, opts = [right], fix = {};
    seen[plain(right)] = 1;
    wrongs.forEach(function (w) {
      if (!Array.isArray(w)) w = [w];
      var h = String(w[0]), t = plain(h);
      if (opts.length >= 4 || seen[t]) return;
      seen[t] = 1; opts.push(h); if (w[1]) fix[t] = w[1];
    });
    var o = R.shuffle(opts);
    return put({ q: q, type: 'mc', options: o, answer: o.indexOf(right), wrong: fix }, x || {});
  }
  /* pick one, in a fixed order (for "A, B or the same") */
  function fixed(q, opts, ans, fixes, x) { var w = {}; opts.forEach(function (o, j) { if (j !== ans && fixes[j]) w[plain(o)] = fixes[j]; }); return put({ q: q, type: 'mc', options: opts, answer: ans, wrong: w }, x || {}); }
  function num(q, ans, fixes, x) { var w = {}; Object.keys(fixes || {}).forEach(function (k) { if (+k !== ans && fixes[k]) w[k] = fixes[k]; }); return put({ q: q, type: 'num', answer: ans, wrong: w }, x || {}); }
  function fill(q, text, answers, x) { return put({ q: q, type: 'fill', fill: text, answers: answers }, x || {}); }
  function tf(q, truth, right, bad, fix, x) {
    var o = R.mc(right, bad), w = {};
    w[truth ? 'False' : 'True'] = fix;
    return put({ q: q, type: 'tf', answer: truth, why: { options: o.options, answer: o.answer }, wrong: w, steps: [right], explain: right }, x || {});
  }

  /* ---------- pictures ---------- */
  function blk(n, u0) { return A.draw.blocks(n, 'Base-ten blocks: ' + hto(Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10), 520, u0 || 5); }
  /* blocks from counts that may be 10 or more; mixed shuffles them */
  function pileOf(h, t, o, mixed) {
    var items = [], k;
    for (k = 0; k < h; k++) items.push(2);
    for (k = 0; k < t; k++) items.push(1);
    for (k = 0; k < o; k++) items.push(0);
    return A.draw.pile(mixed ? R.shuffle(items) : items, 'Base-ten blocks: ' + hto(h, t, o) + (mixed ? ', mixed up' : ''), 520, 5);
  }
  /* a tiny picture of d blocks of one place, for inside a chart column */
  function mini(d, p) {
    if (!d) return '';
    var s = '', col = A.pc(p), i;
    if (p === 2) for (i = 0; i < d; i++) s += '<rect x="' + (2 + (i % 3) * 13) + '" y="' + (2 + Math.floor(i / 3) * 13) + '" width="11" height="11" rx="1" style="fill:' + col + '" stroke="rgba(0,0,0,.45)"/>';
    else if (p === 1) for (i = 0; i < d; i++) s += '<rect x="' + (1 + i * 4.3) + '" y="2" width="3.4" height="36" style="fill:' + col + '" stroke="rgba(0,0,0,.45)" stroke-width=".8"/>';
    else for (i = 0; i < d; i++) s += '<rect x="' + (5 + (i % 3) * 11) + '" y="' + (5 + Math.floor(i / 3) * 11) + '" width="8" height="8" style="fill:' + col + '" stroke="rgba(0,0,0,.45)"/>';
    return A.svg(40, 40, s, placeN(d, p));
  }
  /* place value chart: headings, the digit, small blocks and (o.vals) its value. o.hl lights one column (0 = hundreds) */
  function chart(n, o) {
    o = o || {};
    var s = String(n), cols = s.length, h = '<div class="pv" style="max-width:' + (cols * 104) + 'px;margin:8px auto">', heads = ['Ones', 'Tens', 'Hundreds', 'Thousands'];
    for (var i = 0; i < cols; i++) {
      var p = cols - 1 - i, d = +s.charAt(i);
      h += '<div' + (i === o.hl ? ' class="on"' : '') + '><span class="h c' + p + '"><span class="lg">' + heads[p] + '</span><span class="sm">' + heads[p] + '</span></span><span class="d">' + d + '</span>' +
        (o.dots === false ? '' : '<span class="dk">' + mini(d, p) + '</span>') + (o.vals ? '<span class="v">' + (d ? A.fmt(d * Math.pow(10, p)) : '0') + '</span>' : '') + '</div>';
    }
    return h + '</div>';
  }
  /* each coloured digit drops down to the value it stands for */
  var uid = 0;
  function expanded(n) {
    var s = String(n), len = s.length, cw = Math.min(130, 520 / len), x0 = 280 - cw * len / 2, id = 'exa' + (++uid), out = '';
    out += '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    for (var i = 0; i < len; i++) {
      var p = len - 1 - i, d = +s.charAt(i), cx = x0 + cw * (i + 0.5), val = d * Math.pow(10, p);
      out += '<text x="' + cx + '" y="46" text-anchor="middle" font-size="46" font-weight="800" style="font-family:var(--display);fill:var(--p' + p + ')">' + d + '</text>' +
        '<line x1="' + cx + '" y1="56" x2="' + cx + '" y2="84" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#' + id + ')"/>' +
        '<rect x="' + (cx - cw / 2 + 10) + '" y="90" width="' + (cw - 20) + '" height="38" rx="8" style="fill:' + (d ? 'color-mix(in srgb,var(--p' + p + ') 16%,var(--card))' : 'var(--card)') + ';stroke:var(--p' + p + ')" stroke-width="2.5"' + (d ? '' : ' stroke-dasharray="5 4"') + '/>' +
        '<text x="' + cx + '" y="118" text-anchor="middle" font-size="24" font-weight="700"' + (d ? '' : ' class="t2"') + '>' + A.fmt(val) + '</text>' +
        '<text x="' + cx + '" y="154" text-anchor="middle" font-size="18" class="t2">' + placeN(d, p) + '</text>';
      if (i < len - 1) out += '<text x="' + (cx + cw / 2) + '" y="118" text-anchor="middle" font-size="24" font-weight="700">+</text>';
    }
    return A.svg(560, 164, out, A.fmt(n) + ' in expanded form');
  }
  /* a hill over a number line: halfway is the top, and the number rolls to the side it is on */
  function hill(n, p) {
    var lo = Math.floor(n / p) * p, hi = lo + p, t = (n - lo) / p, up = n - lo >= p / 2, id = 'rha' + (++uid);
    var x = 40 + 480 * t, y = 100 - 150 * t * (1 - t), s = '';
    s += '<path d="M40 100 Q280 -50 520 100" fill="none" style="stroke:var(--line)" stroke-width="10" stroke-linecap="round"/>';
    s += '<line x1="280" y1="25" x2="280" y2="132" style="stroke:var(--ink2)" stroke-dasharray="4 4" stroke-width="1.5"/>';
    s += '<line x1="40" y1="132" x2="520" y2="132" style="stroke:var(--ink)" stroke-width="3"/>';
    for (var i = 0; i <= 10; i++) { var tx = 40 + 48 * i; s += '<line x1="' + tx + '" y1="' + (i % 5 ? 126 : 122) + '" x2="' + tx + '" y2="' + (i % 5 ? 138 : 142) + '" style="stroke:var(--ink)" stroke-width="2"/>'; }
    [[40, lo, 'lower'], [280, lo + p / 2, 'halfway'], [520, hi, 'upper']].forEach(function (k) {
      s += '<text x="' + k[0] + '" y="166" text-anchor="middle" font-size="21" class="tb">' + A.fmt(k[1]) + '</text><text x="' + k[0] + '" y="186" text-anchor="middle" class="t2" font-size="16">' + k[2] + '</text>';
    });
    if (n !== lo) { var ex = up ? 500 : 60; s += '<path d="M' + x + ' ' + (y - 16) + ' Q' + ((x + ex) / 2) + ' ' + (Math.min(y, 80) - 30) + ' ' + ex + ' 86" fill="none" style="stroke:var(--accent)" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#' + id + ')"/>'; }
    s = '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>' + s;
    s += '<circle cx="' + (n === lo || !up ? 40 : 520) + '" cy="132" r="11" style="fill:none;stroke:var(--accent)" stroke-width="4"/>';
    s += '<circle cx="' + x + '" cy="' + (y - 9) + '" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + Math.min(Math.max(x, 60), 500) + '" y="' + (y - 26) + '" text-anchor="middle" font-size="21" class="tb">' + A.fmt(n) + '</text>';
    return A.svg(560, 194, s, A.fmt(n) + ' on a hill between ' + lo + ' and ' + hi + '. It rounds to ' + (up ? hi : lo) + '.');
  }
  /* a plain hill with no number on it yet (for questions, so the picture does not give the answer) */
  function hillBare(lo, p) {
    var s = '<path d="M40 100 Q280 -50 520 100" fill="none" style="stroke:var(--line)" stroke-width="10" stroke-linecap="round"/><line x1="40" y1="132" x2="520" y2="132" style="stroke:var(--ink)" stroke-width="3"/>';
    for (var i = 0; i <= 10; i++) { var tx = 40 + 48 * i; s += '<line x1="' + tx + '" y1="' + (i % 5 ? 126 : 122) + '" x2="' + tx + '" y2="' + (i % 5 ? 138 : 142) + '" style="stroke:var(--ink)" stroke-width="2"/>'; }
    [[40, lo], [280, lo + p / 2], [520, lo + p]].forEach(function (k) { s += '<text x="' + k[0] + '" y="166" text-anchor="middle" font-size="21" class="tb">' + A.fmt(k[1]) + '</text>'; });
    return A.svg(560, 176, s, 'A hill from ' + lo + ' to ' + (lo + p) + ', with halfway at the top');
  }
  /* 1 cube, 10 make a rod, 10 rods make a flat, 10 flats make a big cube */
  function stairs() {
    var P = A.draw.prism, s = '', u0 = 8, base = 150, id = 'sta' + (++uid);
    s += '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    function arrow(x1, x2, y) { return '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#' + id + ')"/><text x="' + ((x1 + x2) / 2) + '" y="' + (y - 8) + '" text-anchor="middle" font-size="18" class="tb">10</text>'; }
    function lab(x, y, a, p) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="26" font-weight="800" style="fill:var(--p' + p + ')">' + a + '</text>'; }
    s += P(34, base, u0, u0, u0, 1, 1, 1, 0) + lab(40, base + 30, '1', 0) + arrow(56, 104, base - 40);
    s += P(120, base, u0, u0, 10 * u0, 1, 1, 10, 1) + lab(126, base + 30, '10', 1) + arrow(140, 196, base - 40);
    s += P(206, base, 10 * u0, u0, 10 * u0, 10, 1, 10, 2) + lab(248, base + 30, '100', 2) + arrow(298, 352, base - 40);
    s += P(366, base, 10 * u0, 10 * u0, 10 * u0, 10, 10, 10, 3) + lab(422, base + 30, '1000', 3);
    return A.svg(560, 190, s, 'Base-ten blocks: a cube is 1, 10 cubes make a rod (10), 10 rods make a flat (100), 10 flats make a big cube (1000)');
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
        s += '<path d="M' + xa + ' 76 Q' + ((xa + x) / 2) + ' ' + top + ' ' + x + ' 76" fill="none" style="stroke:var(--strand)" stroke-width="2.5"/><circle cx="' + x + '" cy="80" r="5" style="fill:var(--strand)"/>';
        if (vals.length <= 11) s += '<text x="' + ((xa + x) / 2) + '" y="' + ((top + 76) / 2 - 6) + '" text-anchor="middle" font-size="17" class="t2">' + (d > 0 ? '+' : '&minus;') + Math.abs(d) + '</text>';
      }
    }
    s += '<circle cx="' + X(vals[0]) + '" cy="80" r="6" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(560, 128, s, 'Number line: ' + vals.map(function (v, i) { return i === miss ? 'a missing number' : v; }).join(', '));
  }
  /* 100 squares, each worth 10, filled up to n */
  function thousand(n) {
    var sz = 26, s = '', full = Math.floor(n / 10);
    for (var i = 0; i < 100; i++) {
      var x = 50 + (i % 10) * sz, y = 6 + Math.floor(i / 10) * sz;
      s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:var(--card);stroke:var(--line)" stroke-width="1"/>';
      if (i < full) s += '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + (sz - 3) + '" height="' + (sz - 3) + '" rx="2" style="fill:var(--p1)"/>';
    }
    for (var r = 1; r <= 10; r++) s += '<text x="46" y="' + (6 + r * sz - 7) + '" text-anchor="end" font-size="16" class="t2">' + r * 100 + '</text>';
    s += '<rect x="330" y="10" width="20" height="20" rx="2" style="fill:var(--p1)"/><text x="358" y="25" font-size="16">= 10</text><text x="330" y="58" font-size="16">1 row = 100</text>';
    return A.svg(450, 270, s, A.fmt(n) + ' filled in a grid of 100 squares, each worth 10');
  }
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
      s += '<g data-hit="' + e[0] + '" aria-label="' + e[0] + '"><rect x="' + (e[1] - 50) + '" y="94" width="100" height="50" rx="10" style="fill:var(--card);stroke:var(--line)" stroke-width="2.5"/><text x="' + e[1] + '" y="124" text-anchor="middle" font-size="26" font-weight="700" style="fill:var(--ink)">' + e[0] + '</text></g>';
    });
    return A.svg(420, 150, s, n + ' on a number line from ' + lo + ' to ' + hi);
  }
  /* numbers marked on one number line, to see their order */
  function marks(vals, show) {
    var lo = Math.floor(Math.min.apply(null, vals) / 10) * 10 - 10, hi = Math.ceil(Math.max.apply(null, vals) / 10) * 10 + 10, x0 = 30, x1 = 530, s = '';
    var X = function (v) { return x0 + (x1 - x0) * (v - lo) / (hi - lo); };
    s += '<line x1="' + x0 + '" y1="70" x2="' + x1 + '" y2="70" style="stroke:var(--ink)" stroke-width="2.5"/>';
    [lo, hi].forEach(function (v) { s += '<line x1="' + X(v) + '" y1="60" x2="' + X(v) + '" y2="80" style="stroke:var(--ink)" stroke-width="2"/><text x="' + X(v) + '" y="104" text-anchor="middle" font-size="18" class="t2">' + v + '</text>'; });
    vals.forEach(function (v, i) {
      if (show && show.indexOf(v) < 0) return;
      s += '<circle cx="' + X(v) + '" cy="70" r="8" style="fill:var(--strand)"/><text x="' + X(v) + '" y="' + (i % 2 ? 104 : 46) + '" text-anchor="middle" font-size="20" class="tb">' + v + '</text>';
    });
    return A.svg(560, 116, s, 'A number line from ' + lo + ' to ' + hi + ' with ' + (show || vals).join(', ') + ' marked');
  }
  /* two place value charts, one above the other; the column that decides is lit */
  function twoCharts(s) { return '<div>' + chart(s.a, { hl: s.hl, dots: false }) + '<p class="g3-sym">' + (s.sym ? '<b>' + s.a + ' ' + s.sym + ' ' + s.b + '</b>' : '&nbsp;') + '</p>' + chart(s.b, { hl: s.hl, dots: false }) + '</div>'; }

  /* a Watch or My turn clip on a drawing: list = [[line, change to the picture (or a list of changes), ms], ...] */
  function view(draw) { return function (s) { return '<div>' + draw(s) + (s.sym ? '<p class="g3-sym">' + s.sym + '</p>' : '') + '</div>'; }; }
  function clip(draw, start, list) {
    return { mount: G3.view(view(draw), start), steps: list.map(function (s) {
      var st = { say: s[0], ms: s[2] || 1900 }, p = s[1];
      if (p) st.act = function (t) { return Array.isArray(p) ? t.seq(p, 650) : t.set(p, 700); };
      return st;
    }) };
  }
  /* a Watch or My turn clip on a toolbox tool: list = [[line, function (tool) -> promise, ms], ...] */
  function tool(name, opts, list) { return { tool: name, opts: opts, steps: list.map(function (s) { var st = { say: s[0], ms: s[2] || 1600 }; if (s[1]) st.act = s[1]; return st; }) }; }
  function b10(extra) { var o = { words: words, max: { h: 9, t: 19, o: 19 } }; for (var k in extra) o[k] = extra[k]; return o; }

  /* ---------- skills: one per idea. DEF[id] = [[minLevel, shape, fn(lv), maxLevel], ...], the first is "plain" ---------- */
  var DEF = {}, SKILLS = [];
  function skill(id, name, code, list) { DEF[id] = list; SKILLS.push({ id: id, name: name, code: code }); }
  /* a "Your turn" question: one shape of the idea's own skill, at one level */
  function ck(id, shape, lv) { return function () { var s = DEF[id].filter(function (x) { return x[1] === shape; })[0], q = s[2](lv); q.shape = shape; return q; }; }
  /* small step questions for Together */
  function sumQ(q, a, b, hint) { return num(q, a + b, {}, { hint: hint || a + ' + ' + b + '.', meta: { k: 'g3n-sum', a: a, b: b } }); }
  function subQ(q, a, b, hint) { return num(q, a - b, {}, { hint: hint || a + ' &minus; ' + b + '.', meta: { k: 'g3n-sub', a: a, b: b } }); }
  function digQ(q, n, p, hint) { return num(q, dig(n)[p], {}, { hint: hint, meta: { k: 'g3n-digit', n: n, p: p } }); }

  /* ======================= Lesson 1: Place value ======================= */
  /* ---------- Ten tens make one hundred ---------- */
  function hCase(lv) { return lv === 1 ? R.int(1, 4) * 100 : lv === 2 ? R.int(1, 9) * 100 : R.int(1, 9) * 100 + R.int(1, 9) * 10; }
  skill('n3-hundred', 'Tens in hundreds', 'B1.5', [
    [1, 'plain', function (lv) {
      var n = hCase(lv), h = Math.floor(n / 100), t = n / 10, r = t % 10, fx = {};
      fx[h] = 'That counts the flats. Each flat is 10 tens.'; fx[n] = 'That is the number. Count it in tens instead.'; fx[r] = 'Each flat holds 10 tens too.';
      return num('How many tens make <b>' + n + '</b>?', t, fx, { fig: blk(n),
        hint: 'Each flat is 10 tens. Count the tens in the flats, then add the rods.', steps: [placeN(h, 2) + ' = ' + h * 10 + ' tens.', r ? h * 10 + ' tens + ' + r + ' tens = ' + t + ' tens.' : 'There are no rods.'], explain: n + ' is ' + t + ' tens.', meta: { k: 'g3n-tens', n: n } });
    }],
    [1, 'rods', function (lv) {
      var t = lv === 1 ? R.int(10, 14) : lv === 2 ? R.int(10, 25) : R.int(26, 40), fx = {};
      fx[t] = 'Each rod is 10, not 1. Count by tens.'; fx[t * 100] = 'A rod is 10. Ten rods make 100.';
      return num('All these blocks are tens. What number do they make?', t * 10, fx, { fig: pileOf(0, t, 0),
        hint: 'Count by tens. 10 rods make 100.', steps: ['There are ' + t + ' rods.', '10 rods make 100.', t + ' tens = ' + t * 10 + '.'], explain: t + ' tens make ' + t * 10 + '.', meta: { k: 'g3n-rods', t: t } });
    }],
    [2, 'fill', function (lv) {
      var n = hCase(lv), t = n / 10, back = lv === 3 || coin();
      return fill('Fill in the blank.', back ? t + ' tens = [[]]' : '[[]] tens = ' + n, [back ? n : t], { fig: lv < 3 ? blk(n) : '',
        hint: '10 tens make 100.', steps: ['Count in tens: 10 tens for each hundred.', t + ' tens = ' + n + '.'], explain: t + ' tens = ' + n + '.', meta: { k: 'g3n-tensfill' } });
    }],
    [2, 'mc', function (lv) {
      var h = lv === 3 ? R.int(4, 9) : R.int(1, 5);
      return mc('Which is the same as <b>' + placeN(h, 2) + '</b>?', h * 10 + ' tens', [[h + ' ' + (h === 1 ? 'ten' : 'tens'), 'One hundred is 10 tens, not 1 ten.'], [h * 100 + ' tens', 'Too many. 10 tens make one hundred.'], [h * 10 + ' ones', 'Ones are smaller than tens. Look at the rods.']], {
        fig: blk(h * 100), hint: 'How many rods fit in one flat?', steps: ['1 hundred = 10 tens.', placeN(h, 2) + ' = ' + h * 10 + ' tens.'], explain: placeN(h, 2) + ' = ' + h * 10 + ' tens.', meta: { k: 'g3n-hmc', h: h } });
    }],
    [2, 'tf', function (lv) {
      var t = lv === 3 ? R.int(11, 59) : R.int(1, 9) * 10, who = Q.name(), truth = coin(), said = truth ? t * 10 : R.pick([t, t * 100]);
      return tf(who + ' says <b>' + t + ' tens</b> make <b>' + said + '</b>. True or false: ' + who + ' is right.', truth, t + ' tens = ' + t * 10 + '. Each ten is 10.',
        ['A ten is worth 1.', 'A ten is worth 100.', 'Tens and hundreds are the same.'], 'Each ten is worth 10. Count by tens.', { hint: 'Count by tens: 10, 20, 30...', meta: { k: 'g3n-tenstf', t: t, said: said } });
    }]
  ]);
  function tgHundred(lv) {
    return function () {
      var n = hCase(lv), h = Math.floor(n / 100), r = (n / 10) % 10, fx = {};
      fx[h] = 'That is the hundreds. Now count them as tens.';
      var steps = [
        { prompt: 'Count the flats first.', q: num('How many hundreds?', h, {}, { hint: 'Count the big squares.', meta: { k: 'g3n-hund', n: n } }) },
        { prompt: 'Each flat is 10 tens.', q: num(placeN(h, 2) + ' is how many tens?', h * 10, fx, { hint: 'Count by tens for each flat: 10, 20...', meta: { k: 'g3n-tens', n: h * 100 } }) }
      ];
      if (r) steps.push({ prompt: 'Add the rods.', q: sumQ(h * 10 + ' tens + ' + r + ' tens = how many tens?', h * 10, r) });
      return { q: 'How many tens make <b>' + n + '</b>?', fig: blk(n), done: n + ' = ' + n / 10 + ' tens.', steps: steps };
    };
  }

  /* ---------- Read and build with blocks ---------- */
  function bCase(lv) { var h = lv === 1 ? R.int(1, 4) : lv === 2 ? R.int(1, 9) : R.int(5, 9), t = R.int(1, lv === 1 ? 5 : 9), o = R.int(1, 9); return { h: h, t: t, o: o, n: h * 100 + t * 10 + o }; }
  function blkFig(c, lv) { return lv === 3 ? pileOf(c.h, c.t, c.o, true) : blk(c.n); }
  skill('n3-blocks', 'Read and build with blocks', 'B1.1', [
    [1, 'plain', function (lv) {
      var c = bCase(lv), fx = {};
      fx[c.h + c.t + c.o] = 'That counts every block as 1. A flat is 100 and a rod is 10.'; fx[c.h * 100 + c.o * 10 + c.t] = 'Rods are tens and small cubes are ones. Check which is which.';
      return num('What number do the blocks show?' + (lv === 3 ? ' They are mixed up.' : ''), c.n, fx, { fig: blkFig(c, lv),
        hint: 'Flats are hundreds, rods are tens, small cubes are ones.', steps: ['Flats: ' + c.h + '. Rods: ' + c.t + '. Cubes: ' + c.o + '.', 'One digit for each place: ' + c.n + '.'], explain: hto(c.h, c.t, c.o) + ' make ' + c.n + '.', meta: { k: 'g3n-read', h: c.h, t: c.t, o: c.o } });
    }],
    [1, 'fill', function (lv) {
      var c = bCase(lv);
      return fill('Count each kind of block.', '[[]] hundreds &nbsp; [[]] tens &nbsp; [[]] ones', [c.h, c.t, c.o], { fig: blkFig(c, lv),
        hint: 'Flats, then rods, then small cubes.', steps: ['Flats: ' + c.h + '.', 'Rods: ' + c.t + '.', 'Small cubes: ' + c.o + '.'], explain: c.n + ' is ' + hto(c.h, c.t, c.o) + '.', meta: { k: 'g3n-count3', n: c.n } });
    }],
    [1, 'build', function (lv) {
      var c = bCase(lv);
      return { q: 'Build <b>' + c.n + '</b> with blocks.', type: 'build', tool: 'base10', answer: c.n, opts: { max: { h: 9, t: 19, o: 19 } },
        hint: 'The first digit tells the flats, the next the rods, the last the small cubes.', steps: [hto(c.h, c.t, c.o) + '.'], explain: hto(c.h, c.t, c.o) + ' make ' + c.n + '.', meta: { k: 'g3n-build', n: c.n } };
    }],
    [2, 'tap', function (lv) {
      var c = bCase(lv), set = [c.n, c.t * 100 + c.h * 10 + c.o, c.h * 100 + c.o * 10 + c.t, c.n + (c.t < 9 ? 10 : -10)].filter(function (v, i, a) { return a.indexOf(v) === i && v < 1000; }).slice(0, 3);
      set = R.shuffle(set);
      var w = {};
      set.forEach(function (v, i) { if (v !== c.n) w[String(i)] = 'Those blocks show ' + v + '. Count the flats, rods and cubes.'; });
      return { q: 'Tap the blocks that show <b>' + c.n + '</b>.', type: 'tap', tiles: set.map(function (v) { return blk(v, 4); }), answer: set.indexOf(c.n), answerText: 'the one with ' + hto(c.h, c.t, c.o), wrong: w,
        hint: c.n + ' needs ' + hto(c.h, c.t, c.o) + '.', steps: ['Look for ' + c.h + ' flats.', 'Then ' + c.t + ' rods and ' + c.o + ' cubes.'], explain: hto(c.h, c.t, c.o) + ' make ' + c.n + '.', meta: { k: 'g3n-btap', set: set, n: c.n } };
    }],
    [2, 'story', function (lv) {
      var c = bCase(lv), who = Q.name(), th = R.pick([['pencils', 'boxes of 100', 'packs of 10', 'single pencils'], ['beads', 'jars of 100', 'strings of 10', 'loose beads'], ['maple candies', 'tins of 100', 'bags of 10', 'single candies']]);
      return num(who + ' has ' + c.h + ' ' + th[1] + ' ' + th[0] + ', ' + c.t + ' ' + th[2] + ' and ' + c.o + ' ' + th[3] + '. How many ' + th[0] + ' is that?', c.n, {}, { fig: blkFig(c, lv),
        hint: 'Hundreds, then tens, then ones.', steps: [c.h + ' hundreds = ' + c.h * 100 + '. ' + c.t + ' tens = ' + c.t * 10 + '.', c.h * 100 + ' + ' + c.t * 10 + ' + ' + c.o + ' = ' + c.n + '.'], explain: c.n + ' ' + th[0] + '.', meta: { k: 'g3n-read', h: c.h, t: c.t, o: c.o } });
    }],
    [2, 'tf', function (lv) {
      var c = bCase(lv), who = Q.name(), truth = coin(), said = truth ? c.n : R.pick([c.t * 100 + c.h * 10 + c.o, c.h * 100 + c.o * 10 + c.t].filter(function (v) { return v !== c.n; }).concat([c.n + 100 <= 999 ? c.n + 100 : c.n - 100]));
      return tf(who + ' says these blocks show <b>' + said + '</b>. True or false: ' + who + ' is right.', truth, hto(c.h, c.t, c.o) + ' make ' + c.n + '.',
        ['Every block counts as 1.', 'Rods are ones and cubes are tens.', 'Count the cubes first, then put them on the left.'], 'Count flats, rods and cubes, in that order.', { fig: blkFig(c, lv), hint: 'Flats are hundreds, rods are tens.', meta: { k: 'g3n-btf', n: c.n, said: said } });
    }]
  ]);
  function tgBuild(lv) {
    return function () {
      var c = bCase(lv);
      return { q: 'What number do the blocks show?', fig: blkFig(c, lv), done: hto(c.h, c.t, c.o) + ' make ' + c.n + '.', steps: [
        { prompt: 'Count the flats. Each is a hundred.', q: digQ('How many hundreds?', c.n, 2, 'Count the big squares.') },
        { prompt: 'Now the rods. Each is a ten.', q: digQ('How many tens?', c.n, 1, 'Count the long sticks.') },
        { prompt: 'Then the small cubes.', q: digQ('How many ones?', c.n, 0, 'Count the little cubes.') },
        { prompt: 'Write the digits: hundreds, tens, ones.', q: num('What number is it?', c.n, {}, { hint: c.h + ', then ' + c.t + ', then ' + c.o + '.', meta: { k: 'g3n-read', h: c.h, t: c.t, o: c.o } }) }
      ] };
    };
  }

  /* ---------- A digit's place gives its value ---------- */
  function distinct3() { var d; do { d = [R.int(1, 9), R.int(1, 9), R.int(1, 9)]; } while (d[0] === d[1] || d[1] === d[2] || d[0] === d[2]); return d; }
  function vCase(lv) {
    var d = distinct3(), i = R.int(0, 2);
    if (lv === 3) { var j = (i + R.int(1, 2)) % 3; d[j] = d[i]; }
    return { n: d[0] * 100 + d[1] * 10 + d[2], i: i, d: d[i], p: 2 - i, val: d[i] * Math.pow(10, 2 - i) };
  }
  function valFix(c) {
    var f = {};
    if (c.p) f[c.d] = 'That is the digit alone. Its place makes it worth more.';
    [c.d * 10, c.d * 100].forEach(function (v) { if (v !== c.val) f[v] = 'Count the places from the right: ones, tens, hundreds.'; });
    return f;
  }
  skill('n3-value', 'Value of a digit', 'B1.5', [
    [1, 'plain', function (lv) {
      var c = vCase(lv);
      return num('What is the underlined digit worth? ' + math(u(c.n, c.i)), c.val, valFix(c), { fig: lv === 1 ? chart(c.n, { hl: c.i }) : lv === 2 ? blk(c.n) : '',
        hint: 'Name the place first: ones, tens or hundreds?', steps: ['The ' + c.d + ' is in the ' + PNAME[c.p] + ' place.', c.d + ' ' + PNAME[c.p] + ' = ' + c.val + '.'], explain: 'It is worth ' + c.val + '.', meta: { k: 'g3n-val', n: c.n, i: c.i } });
    }],
    [1, 'tap', function (lv) {
      var c = vCase(lv === 3 ? 2 : lv);
      return { q: 'Tap the digit that is worth <b>' + c.val + '</b>.', type: 'tap', pic: digitPic(c.n), answer: String(c.i), answerText: 'the ' + c.d + ' in the ' + PNAME[c.p] + ' place',
        hint: c.val + ' is ' + placeN(c.d, c.p) + '. Which place is that?', steps: [c.val + ' = ' + placeN(c.d, c.p) + '.', 'Tap the ' + c.d + ' in the ' + PNAME[c.p] + ' place.'], explain: 'The ' + c.d + ' in the ' + PNAME[c.p] + ' place is worth ' + c.val + '.', meta: { k: 'g3n-valtap', n: c.n, val: c.val } };
    }],
    [1, 'story', function (lv) {
      var c = vCase(lv), t = R.pick([['The arena has', 'seats'], ['The library has', 'books'], ['The school collected', 'cans of food'], ['The trail is', 'metres long'], ['The farm has', 'apple trees']]);
      return num(t[0] + ' ' + c.n + ' ' + t[1] + '. What is the <b>' + c.d + '</b> in ' + math(u(c.n, c.i)) + ' worth?', c.val, valFix(c), {
        hint: 'Which place is the ' + c.d + ' in?', steps: ['The ' + c.d + ' is in the ' + PNAME[c.p] + ' place.', c.d + ' ' + PNAME[c.p] + ' = ' + c.val + '.'], explain: 'It stands for ' + c.val + '.', meta: { k: 'g3n-val', n: c.n, i: c.i } });
    }],
    [2, 'mc', function (lv) {
      var dg = R.int(1, 9), p = R.int(lv === 3 ? 0 : 1, 2), seen = {};
      function make(pl) {
        var d, n;
        do { d = [R.int(1, 9), R.int(0, 9), R.int(0, 9)].map(function (x) { return x === dg ? (dg % 9) + 1 : x; }); d[2 - pl] = dg; n = d[0] * 100 + d[1] * 10 + d[2]; } while (seen[n]);
        seen[n] = 1; return n;
      }
      var right = make(p), rest = [0, 1, 2].filter(function (x) { return x !== p; }), wrongs = [make(rest[0]), make(rest[1]), make(R.pick(rest))];
      return mc('Which number has a <b>' + dg + '</b> worth <b>' + dg * Math.pow(10, p) + '</b>?', right, wrongs.map(function (n) { return [n, 'In ' + n + ', the ' + dg + ' is in a different place.']; }), {
        hint: dg * Math.pow(10, p) + ' means the ' + dg + ' is in the ' + PNAME[p] + ' place.', steps: ['Look for a ' + dg + ' in the ' + PNAME[p] + ' place.'], explain: 'In ' + right + ', the ' + dg + ' is in the ' + PNAME[p] + ' place.', meta: { k: 'g3n-valmc', dg: dg, p: p } });
    }],
    [2, 'tf', function (lv) {
      var c = vCase(lv), who = Q.name(), truth = coin(), said = truth ? c.val : R.pick([c.d, c.d * 10, c.d * 100].filter(function (v) { return v !== c.val; }));
      return tf(who + ' says the underlined <b>' + c.d + '</b> in ' + math(u(c.n, c.i)) + ' is worth <b>' + said + '</b>. True or false: ' + who + ' is right.', truth, 'The ' + c.d + ' is in the ' + PNAME[c.p] + ' place, so it is worth ' + c.val + '.',
        ['A digit is always worth just itself.', 'The biggest digit is always worth the most.', 'Places are counted from the left: ones, tens, hundreds.'], 'Find the place of the underlined digit first.', { hint: 'Ones, tens, hundreds: count from the right.', meta: { k: 'g3n-valtf', n: c.n, i: c.i, said: said } });
    }],
    [3, 'total', function () {
      var c = vCase(3), s = String(c.n), both = [0, 1, 2].filter(function (j) { return +s.charAt(j) === c.d; }), tot = both.reduce(function (a, j) { return a + c.d * Math.pow(10, 2 - j); }, 0);
      var fx = {}; fx[c.d * 2] = 'Each ' + c.d + ' has its own place. Find what each one is worth.';
      return num('What are the two <b>' + c.d + 's</b> in ' + math(c.n) + ' worth together?', tot, fx, { fig: chart(c.n, { vals: false }),
        hint: 'Find the value of each ' + c.d + ', then add.', steps: both.map(function (j) { return 'The ' + c.d + ' in the ' + PNAME[2 - j] + ' place is ' + c.d * Math.pow(10, 2 - j) + '.'; }).concat(['Add them: ' + tot + '.']), explain: 'Together they are worth ' + tot + '.', meta: { k: 'g3n-valsum', n: c.n, d: c.d } });
    }]
  ]);
  function tgValue(lv) {
    return function () {
      var c = vCase(lv), f1 = {}, f3 = valFix(c);
      return { q: 'What is the <b>' + c.d + '</b> in ' + math(u(c.n, c.i)) + ' worth?', fig: chart(c.n, { hl: c.i }), done: 'The ' + c.d + ' is worth ' + c.val + '.', steps: [
        { prompt: 'Name the place first.', q: fixed('Which place is the ' + c.d + ' in?', ['ones', 'tens', 'hundreds'], c.p, ['Count from the right. The ones are last.', 'Count from the right: ones, then tens.', 'Count from the right: ones, tens, then hundreds.'], { hint: 'Count places from the right.', meta: { k: 'g3n-place', n: c.n, i: c.i } }) },
        { prompt: 'One of that place is worth how much?', q: num('One ' + A.PLACE1[c.p] + ' is worth how much?', Math.pow(10, c.p), f1, { hint: 'A cube is 1, a rod is 10, a flat is 100.', meta: { k: 'g3n-pow', p: c.p } }) },
        { prompt: c.d + ' of them.', q: num('So ' + placeN(c.d, c.p) + ' = ?', c.val, f3, { hint: 'Count ' + c.d + ' ' + PNAME[c.p] + '.', meta: { k: 'g3n-val', n: c.n, i: c.i } }) }
      ] };
    };
  }

  /* ---------- Zero holds a place ---------- */
  function zCase(lv) {
    var h = lv === 1 ? R.int(1, 5) : lv === 2 ? R.int(1, 9) : R.int(5, 9), t = R.int(1, 9), o = R.int(1, 9), k = lv === 1 ? 't' : lv === 2 ? R.pick(['t', 'o']) : R.pick(['t', 'o', 'both']);
    if (k !== 'o') t = 0;
    if (k !== 't') o = 0;
    return { h: h, t: t, o: o, n: h * 100 + t * 10 + o };
  }
  function drop0(n) { return +String(n).replace(/0/g, ''); }
  function zFix(c) { var f = {}; f[drop0(c.n)] = 'A place with nothing still needs a digit: write 0 there.'; return f; }
  skill('n3-zero', 'Zero holds a place', 'B1.1', [
    [1, 'plain', function (lv) {
      var c = zCase(lv);
      return num('What number do the blocks show?', c.n, zFix(c), { fig: blk(c.n),
        hint: 'A kind of block that is missing gets a 0.', steps: [hto(c.h, c.t, c.o) + '.', 'Write a 0 for the empty place: ' + c.n + '.'], explain: hto(c.h, c.t, c.o) + ' make ' + c.n + '.', meta: { k: 'g3n-read', h: c.h, t: c.t, o: c.o } });
    }],
    [1, 'words', function (lv) {
      var c = zCase(lv);
      return num('Write <b>' + words(c.n) + '</b> as a number.', c.n, zFix(c), { fig: lv === 1 ? chart(c.n, { dots: false }) : '',
        hint: 'How many hundreds, tens and ones? Write 0 for a place with none.', steps: [hto(c.h, c.t, c.o) + '.', 'The number is ' + c.n + '.'], explain: words(c.n) + ' is ' + c.n + '.', meta: { k: 'g3n-words', w: words(c.n) } });
    }],
    [2, 'chart', function (lv) {
      var c = zCase(lv);
      return fill('Fill the place value chart for these blocks.', 'Hundreds [[]] &nbsp; Tens [[]] &nbsp; Ones [[]]', [c.h, c.t, c.o], { fig: blk(c.n),
        hint: 'No rods means 0 tens. No cubes means 0 ones.', steps: [hto(c.h, c.t, c.o) + '.'], explain: c.n + ': ' + hto(c.h, c.t, c.o) + '.', meta: { k: 'g3n-count3', n: c.n } });
    }],
    [2, 'mc', function (lv) {
      var c = zCase(lv), s = String(c.n), sw = +(s.charAt(0) + s.charAt(2) + s.charAt(1));
      return mc('Which number is <b>' + words(c.n) + '</b>?', c.n, [[drop0(c.n), 'The 0 is missing. Each place needs a digit.'], [sw, 'The tens and ones are swapped.'], [c.n * 10, 'That has 4 digits: too many places.']], {
        hint: 'Hundreds first, then tens, then ones. Use 0 for an empty place.', steps: [hto(c.h, c.t, c.o) + '.'], explain: words(c.n) + ' is ' + c.n + '.', meta: { k: 'g3n-zmc' } });
    }],
    [2, 'tf', function (lv) {
      var c = zCase(lv), who = Q.name(), truth = coin(), said = truth ? c.n : drop0(c.n);
      return tf(who + ' writes <b>' + words(c.n) + '</b> as ' + math(said) + '. True or false: ' + who + ' is right.', truth, words(c.n) + ' is ' + hto(c.h, c.t, c.o) + ': ' + c.n + '.',
        ['Zeros are never written.', 'You only write the digits you say.', 'The number gets bigger without the 0.'], 'Check each place. An empty place needs a 0.', { hint: 'How many tens? How many ones?', meta: { k: 'g3n-ztf', said: said } });
    }]
  ]);
  function tgZero(lv) {
    return function () {
      var c = zCase(lv);
      return { q: 'Write <b>' + words(c.n) + '</b> as a number.', fig: blk(c.n), done: words(c.n) + ' is ' + c.n + '.', steps: [
        { prompt: 'How many flats?', q: digQ('How many hundreds?', c.n, 2, 'Count the flats.') },
        { prompt: 'Any rods? None means 0.', q: digQ('How many tens?', c.n, 1, 'Count the rods. None is 0.') },
        { prompt: 'Any small cubes?', q: digQ('How many ones?', c.n, 0, 'Count the cubes. None is 0.') },
        { prompt: 'Write all three digits.', q: num('What number is it?', c.n, zFix(c), { hint: 'Keep the 0.', meta: { k: 'g3n-read', h: c.h, t: c.t, o: c.o } }) }
      ] };
    };
  }

  /* ======================= Lesson 2: Writing numbers ======================= */
  /* ---------- Standard and expanded form ---------- */
  function fCase(lv) {
    var h = R.int(1, 9), t = R.int(1, 9), o = R.int(1, 9);
    if (lv === 2 && coin()) { if (coin()) t = 0; else o = 0; }
    if (lv === 3) { var z = R.int(0, 2); if (z === 1) t = 0; if (z === 2) o = 0; }
    var parts = [h * 100, t * 10, o].filter(function (v) { return v; });
    return { h: h, t: t, o: o, n: h * 100 + t * 10 + o, parts: lv === 3 ? R.shuffle(parts) : parts };
  }
  skill('n3-forms', 'Expanded and standard form', 'B1.1', [
    [1, 'plain', function (lv) {
      var c = fCase(lv), fx = {}; fx[c.parts.join('')] = 'Each part is a value to add, not digits to join.';
      return num('Write as one number: ' + math(c.parts.join(' + ')), c.n, fx, { fig: lv === 1 ? blk(c.n) : '',
        hint: lv === 3 ? 'The parts are mixed up. Put each in its place.' : 'Put each part in its place. A place with nothing gets 0.', steps: ['Hundreds: ' + c.h + '. Tens: ' + c.t + '. Ones: ' + c.o + '.', 'The number is ' + c.n + '.'], explain: c.parts.join(' + ') + ' = ' + c.n + '.', meta: { k: 'g3n-std', parts: c.parts } });
    }],
    [1, 'fill', function (lv) {
      var c = fCase(lv === 3 ? 2 : lv), ps = [c.h * 100, c.t * 10, c.o].filter(function (v) { return v; });
      return fill('Write ' + c.n + ' in expanded form.', c.n + ' = ' + ps.map(function () { return '[[]]'; }).join(' + '), ps, { fig: chart(c.n, { dots: lv === 1 }),
        hint: 'What is each digit worth?', steps: ps.map(function (v) { return v + '.'; }), explain: c.n + ' = ' + ps.join(' + ') + '.', meta: { k: 'g3n-expfill', n: c.n } });
    }],
    [1, 'story', function (lv) {
      var c = fCase(lv), who = Q.name();
      return num(who + ' has ' + G3.pl(c.h, '$100 bill') + ', ' + G3.pl(c.t, '$10 bill') + ' and ' + G3.pl(c.o, 'loonie') + '. How many dollars is that?', c.n, {}, {
        hint: 'Hundreds, tens, ones.', steps: [c.h * 100 + ' + ' + c.t * 10 + ' + ' + c.o + '.', '$' + c.n + '.'], explain: '$' + c.n + '.', meta: { k: 'g3n-read', h: c.h, t: c.t, o: c.o } });
    }],
    [2, 'match', function (lv) {
      var pairs = [], seen = {};
      while (pairs.length < 3) { var c = fCase(lv); if (seen[c.n]) continue; seen[c.n] = 1; pairs.push([math(c.parts.join(' + ')), String(c.n)]); }
      return { q: 'Match each expanded form to its number.', type: 'match', pairs: pairs, hint: 'Add the parts.', steps: ['300 + 4 is 304: no tens.'], explain: pairs.map(function (p) { return plain(p[0]) + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'g3n-expmatch' } };
    }],
    [2, 'tf', function (lv) {
      var c = fCase(lv), who = Q.name(), truth = coin(), s = String(c.n), said = truth ? c.n : R.pick([drop0(c.n) !== c.n ? drop0(c.n) : +(s.charAt(0) + s.charAt(2) + s.charAt(1)), +(s.charAt(1) + s.charAt(0) + s.charAt(2))]);
      if (!truth && (said === c.n || said < 100)) said = c.n + 10 * (c.t < 9 ? 1 : -1);
      return tf(who + ' says ' + math(c.parts.join(' + ') + ' = ' + said) + '. True or false: ' + who + ' is right.', truth, c.parts.join(' + ') + ' = ' + c.n + '.',
        ['Write the parts in the order they are given.', 'Leave out any zeros.', 'Join the digits of each part.'], 'Put each part in its own place.', { hint: 'Hundreds, tens, ones.', meta: { k: 'g3n-partstf', parts: c.parts, said: said } });
    }]
  ]);
  function tgForms(lv) {
    return function () {
      var c = fCase(lv), steps = [];
      if (lv < 3) {
        [0, 1, 2].forEach(function (i) { steps.push({ prompt: ['Hundreds first.', 'Then the tens.', 'Then the ones.'][i], q: num('What is the ' + PNAME[2 - i] + ' digit worth?', String(c.n).charAt(i) * Math.pow(10, 2 - i), {}, { hint: 'Digit times its place.', meta: { k: 'g3n-val', n: c.n, i: i } }) }); });
        return { q: 'Write <b>' + c.n + '</b> in expanded form.', fig: chart(c.n, {}), done: c.n + ' = ' + [c.h * 100, c.t * 10, c.o].filter(function (v) { return v; }).join(' + ') + '.', steps: steps };
      }
      return { q: 'Write ' + math(c.parts.join(' + ')) + ' as one number.', fig: '', done: c.parts.join(' + ') + ' = ' + c.n + '.', steps: [
        { prompt: 'Find the hundreds.', q: digQ('What is the hundreds digit?', c.n, 2, 'Which part is hundreds?') },
        { prompt: 'Now the tens. None means 0.', q: digQ('What is the tens digit?', c.n, 1, 'Which part is tens?') },
        { prompt: 'Then the ones.', q: digQ('What is the ones digit?', c.n, 0, 'Which part is ones?') },
        { prompt: 'Write the number.', q: num('What is the number?', c.n, {}, { hint: 'Hundreds, tens, ones.', meta: { k: 'g3n-std', parts: c.parts } }) }
      ] };
    };
  }

  /* ---------- Numbers in words ---------- */
  function wCase(lv) {
    var h = lv === 3 ? R.int(5, 9) : R.int(1, 9), t = R.int(2, 9), o = R.int(1, 9);
    if (lv >= 2) { var k = R.int(0, 2); if (k === 1) t = 1; if (k === 2) t = 0; }
    return h * 100 + t * 10 + o;
  }
  skill('n3-words', 'Numbers in words', 'B1.1', [
    [1, 'plain', function (lv) {
      var n = wCase(lv), fx = zFix({ n: n });
      return num('Write <b>' + words(n) + '</b> as a number.', n, fx, { fig: lv === 1 ? chart(n, { dots: false }) : '',
        hint: 'Say the hundreds first. Then the last two digits.', steps: ['"' + ONES[Math.floor(n / 100)] + ' hundred" is ' + Math.floor(n / 100) * 100 + '.', '"' + words(n % 100) + '" is ' + n % 100 + '.', 'Together: ' + n + '.'], explain: words(n) + ' is ' + n + '.', meta: { k: 'g3n-words', w: words(n) } });
    }],
    [1, 'sign', function (lv) {
      var n = wCase(lv), t = R.pick([['A trail sign says the lake is', 'metres away'], ['A cheque says', 'dollars'], ['The poster says the arena holds', 'people'], ['The map says the portage is', 'metres long']]);
      return num(t[0] + ' <b>' + words(n) + '</b> ' + t[1] + '. Write the number.', n, zFix({ n: n }), {
        hint: 'Hundreds first, then the last two digits.', steps: ['Hundreds: ' + Math.floor(n / 100) + '.', 'Then ' + words(n % 100) + ': ' + n % 100 + '.'], explain: words(n) + ' is ' + n + '.', meta: { k: 'g3n-words', w: words(n) } });
    }],
    [1, 'mc', function (lv) {
      var n = wCase(lv), s = String(n), alt = [+(s.charAt(0) + s.charAt(2) + s.charAt(1)), n + (n % 100 >= 90 ? -10 : 10), (Math.floor(n / 100) % 9 + 1) * 100 + n % 100].filter(function (v) { return v !== n && v >= 100; });
      return mc('Which words say <b>' + n + '</b>?', words(n), alt.map(function (v) { return [words(v), 'That is ' + v + '. Check each place.']; }), { fig: chart(n, { dots: false }),
        hint: 'Say the hundreds, then the last two digits.', steps: [Math.floor(n / 100) + ' hundreds: "' + ONES[Math.floor(n / 100)] + ' hundred".', n % 100 + ': "' + words(n % 100) + '".'], explain: n + ' is ' + words(n) + '.', meta: { k: 'g3n-wmc', n: n } });
    }],
    [2, 'match', function (lv) {
      var pairs = [], seen = {};
      while (pairs.length < 3) { var n = wCase(lv); if (seen[n]) continue; seen[n] = 1; pairs.push([words(n), String(n)]); }
      return { q: 'Match the words to the number.', type: 'match', pairs: pairs, hint: 'Hundreds first, then the last two digits.', steps: ['"Four hundred twelve" is 412.'], explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'g3n-wmatch' } };
    }],
    [2, 'order', function (lv) {
      var a = []; while (a.length < 3) { var n = lv === 3 ? Math.floor(wCase(3) / 100) * 100 + R.int(0, 99) : wCase(lv); if (a.indexOf(n) < 0 && a.every(function (x) { return Math.abs(x - n) > 4; })) a.push(n); }
      a.sort(function (x, y) { return x - y; });
      return { q: 'Put these in order, least to greatest.', type: 'order', items: a.map(words), first: 'least', last: 'greatest',
        hint: 'Write each as a number first.', steps: ['As numbers: ' + R.shuffle(a).join(', ') + '.', 'Least to greatest: ' + a.join(', ') + '.'], explain: a.join(', ') + '.', meta: { k: 'g3n-worder' } };
    }],
    [2, 'tf', function (lv) {
      var n = wCase(lv), who = Q.name(), truth = coin(), s = String(n), said = truth ? n : drop0(n) !== n ? drop0(n) : +(s.charAt(0) + s.charAt(2) + s.charAt(1));
      if (said === n && !truth) said = n + 1;
      return tf(who + ' writes <b>' + words(n) + '</b> as ' + math(said) + '. True or false: ' + who + ' is right.', truth, words(n) + ' is ' + n + '.',
        ['Write the digits in the order you hear the words.', 'Zeros are never written.', 'Teen numbers start with the ones.'], 'Hundreds, then tens, then ones. Use 0 for an empty place.', { hint: 'Write it yourself, then compare.', meta: { k: 'g3n-wtf', said: said } });
    }]
  ]);
  function tgWords(lv) {
    return function () {
      var n = wCase(lv), h = Math.floor(n / 100), r = n % 100;
      return { q: 'Write <b>' + words(n) + '</b> as a number.', fig: blk(n), done: words(n) + ' is ' + n + '.', steps: [
        { prompt: 'Read the hundreds part.', q: num('"' + ONES[h] + ' hundred" is what number?', h * 100, {}, { hint: h + ' flats.', meta: { k: 'g3n-words', w: ONES[h] + ' hundred' } }) },
        { prompt: 'Now the rest of the words.', q: num('"' + words(r) + '" is what number?', r, {}, { hint: 'Tens and ones.', meta: { k: 'g3n-words', w: words(r) } }) },
        { prompt: 'Put them together.', q: sumQ(h * 100 + ' + ' + r + ' = ?', h * 100, r) }
      ] };
    };
  }

  /* ---------- One number, many ways (trading) ---------- */
  function trCase(lv) {
    var k = lv === 1 ? 'h' : lv === 2 ? R.pick(['h', 't']) : R.pick(['ht', 'all']), h = k === 'all' ? R.int(1, 4) : R.int(2, 9), t = R.int(1, 8), o = R.int(1, 8), n = h * 100 + t * 10 + o;
    var s = k === 'h' ? [h - 1, t + 10, o] : k === 't' ? [h, t - 1, o + 10] : k === 'ht' ? [h - 1, t + 9, o + 10] : [0, h * 10 + t, o];
    return { n: n, h: h, t: t, o: o, k: k, s: s };
  }
  function trText(s) { return hto(s[0], s[1], s[2]); }
  skill('n3-trade', 'One number, many ways', 'B1.5', [
    [1, 'plain', function (lv) {
      var c = trCase(lv), fx = {}; fx[c.s[0] * 100 + (c.s[1] % 10) * 10 + c.s[2] % 10] = 'Ten of one place make one of the next place. Trade them first.';
      return num('What number is <b>' + trText(c.s) + '</b>?', c.n, fx, { fig: pileOf(c.s[0], c.s[1], c.s[2]),
        hint: 'Find the value of each part, then add.', steps: [c.s[0] * 100 + ' + ' + c.s[1] * 10 + ' + ' + c.s[2] + '.', '= ' + c.n + '.'], explain: trText(c.s) + ' = ' + c.n + '.', meta: { k: 'g3n-read', h: c.s[0], t: c.s[1], o: c.s[2] } });
    }],
    [1, 'fill', function (lv) {
      var c = trCase(lv), f, a;
      if (c.k === 'h') { f = c.n + ' = ' + placeN(c.s[0], 2) + ', [[]] tens and ' + placeN(c.s[2], 0); a = [c.s[1]]; }
      else if (c.k === 't') { f = c.n + ' = ' + placeN(c.s[0], 2) + ', ' + placeN(c.s[1], 1) + ' and [[]] ones'; a = [c.s[2]]; }
      else if (c.k === 'ht') { f = c.n + ' = ' + placeN(c.s[0], 2) + ', [[]] tens and ' + placeN(c.s[2], 0); a = [c.s[1]]; }
      else { f = c.n + ' = [[]] tens and ' + placeN(c.s[2], 0); a = [c.s[1]]; }
      return fill('Fill in the blank.', f, a, { fig: blk(c.n),
        hint: 'Break a bigger block into 10 smaller ones.', steps: ['1 hundred = 10 tens. 1 ten = 10 ones.', c.n + ' = ' + trText(c.s) + '.'], explain: c.n + ' = ' + trText(c.s) + '.', meta: { k: 'g3n-tradefill' } });
    }],
    [2, 'tens', function (lv) {
      var c = trCase(lv), all = Math.floor(c.n / 10), fx = {}; fx[c.t] = 'That is only the tens digit. The hundreds hold tens too.'; fx[c.h] = 'Each hundred is 10 tens.';
      return num('How many tens are in ' + math(c.n) + ' in all?', all, fx, { fig: lv < 3 ? blk(c.n) : '',
        hint: 'Each flat is 10 tens. Add the rods.', steps: [placeN(c.h, 2) + ' = ' + c.h * 10 + ' tens.', c.h * 10 + ' + ' + c.t + ' = ' + all + ' tens.'], explain: c.n + ' has ' + all + ' tens in all.', meta: { k: 'g3n-tens', n: c.n } });
    }],
    [2, 'mc', function (lv) {
      var c = trCase(lv);
      var W = [[[c.h - 1, c.t, c.o], 'One hundred was taken away and not traded.'], [[c.h, c.t + 10, c.o], 'That adds 10 tens without taking a hundred away.'], [[c.h - 1, c.t + 1, c.o], '1 hundred is 10 tens, not 1 ten.'], [[c.h, c.t - 1, c.o + 1], '1 ten is 10 ones, not 1 one.']];
      return mc('Which is another way to make <b>' + c.n + '</b>?', trText(c.s), R.shuffle(W).map(function (w) { return [trText(w[0]), w[1]]; }), { fig: blk(c.n),
        hint: 'Add up the value of each choice.', steps: ['A trade keeps the total the same.', trText(c.s) + ' = ' + c.n + '.'], explain: trText(c.s) + ' is ' + c.n + '.', meta: { k: 'g3n-trademc', n: c.n } });
    }],
    [2, 'tf', function (lv) {
      var c = trCase(lv), who = Q.name(), truth = coin(), said = truth ? c.h * 10 + c.t : c.h + c.t;
      return tf(who + ' says <b>' + placeN(c.h, 2) + ' and ' + placeN(c.t, 1) + '</b> is the same as <b>' + said + ' tens</b>. True or false: ' + who + ' is right.', truth, 'Each hundred is 10 tens: ' + c.h * 10 + ' + ' + c.t + ' = ' + (c.h * 10 + c.t) + ' tens.',
        ['A hundred is 1 ten.', 'Hundreds and tens can be added like ones.', 'You cannot trade hundreds.'], 'Each hundred is 10 tens.', { hint: 'How many tens is one hundred?', meta: { k: 'g3n-tradetf', h: c.h, t: c.t, said: said } });
    }]
  ]);
  function tgTrade(lv) {
    return function () {
      var c = trCase(lv === 3 ? 1 : lv), ten = c.k === 't';
      var steps = ten ? [
        { prompt: 'Break one ten into ones.', q: subQ('How many tens are left?', c.t, 1) },
        { prompt: '1 ten is 10 ones.', q: sumQ(placeN(c.o, 0) + ' + 10 ones = how many ones?', c.o, 10) },
        { prompt: 'The hundreds stay.', q: digQ('How many hundreds?', c.n, 2, 'Nothing changed there.') }
      ] : [
        { prompt: 'Break one hundred into tens.', q: subQ('How many hundreds are left?', c.h, 1) },
        { prompt: '1 hundred is 10 tens.', q: sumQ(placeN(c.t, 1) + ' + 10 tens = how many tens?', c.t, 10) },
        { prompt: 'The ones stay.', q: digQ('How many ones?', c.n, 0, 'Nothing changed there.') }
      ];
      if (lv === 3) steps = steps.slice(0, 2).concat([{ prompt: 'Check the total.', q: num('What number is ' + trText(c.s) + '?', c.n, {}, { hint: 'Add the values.', meta: { k: 'g3n-read', h: c.s[0], t: c.s[1], o: c.s[2] } }) }]);
      return { q: 'Show <b>' + c.n + '</b> another way: ' + (ten ? 'break a ten.' : 'break a hundred.'), fig: blk(c.n), done: c.n + ' = ' + trText(c.s) + '.', steps: steps };
    };
  }

  /* ======================= Lesson 3: Counting to 1000 ======================= */
  /* ---------- Ten hundreds make 1000 ---------- */
  function kCase(lv) { var n; do { n = lv === 1 ? R.int(1, 9) * 100 : lv === 2 ? R.int(1, 19) * 50 : R.int(1, 99) * 10; } while ((lv === 2 && n % 100 === 0) || (lv === 3 && n % 50 === 0)); return n; }
  skill('n3-1000', 'Make 1000', 'B1.4', [
    [1, 'plain', function (lv) {
      var n = kCase(lv), fx = {}; if (n % 100 === 0) fx[10 - n / 100] = 'Count in hundreds: that many hundreds is ' + (10 - n / 100) * 100 + '.'; fx[100 - n / 10] = 'Each square is worth 10. Count the empty squares by tens.';
      return num(math(n) + ' + ? = 1000. How many more make 1000?', 1000 - n, fx, { fig: thousand(n),
        hint: 'Count on to the next hundred, then by hundreds to 1000.', steps: n % 100 ? [n + ' + ' + (100 - n % 100) + ' = ' + (n + 100 - n % 100) + '.', 'Then ' + (1000 - n - 100 + n % 100) + ' more to 1000.', 'In all: ' + (1000 - n) + '.'] : [n + ' is ' + n / 100 + ' hundreds.', '10 hundreds make 1000, so ' + (10 - n / 100) + ' more hundreds.'], explain: n + ' + ' + (1000 - n) + ' = 1000.', meta: { k: 'g3n-to1000', n: n } });
    }],
    [1, 'fill', function (lv) {
      var n = kCase(lv), back = coin();
      return fill('Fill in the blank.', back ? '[[]] + ' + n + ' = 1000' : n + ' + [[]] = 1000', [1000 - n], {
        hint: '10 hundreds make 1000.', steps: ['Count up from ' + n + ' to 1000.'], explain: n + ' + ' + (1000 - n) + ' = 1000.', meta: { k: 'g3n-eq' } });
    }],
    [1, 'jumps', function (lv) {
      var by = lv === 1 ? 100 : lv === 2 ? 50 : R.pick([50, 200]), n = by === 200 ? R.int(0, 3) * 200 : lv === 1 ? R.int(1, 8) * 100 : R.int(lv === 2 ? 10 : 2, 18) * 50, vals = [];
      for (var v = n; v <= 1000; v += by) vals.push(v);
      return num('Count by ' + by + 's from ' + n + ' to 1000. How many jumps is that?', vals.length - 1, {}, { fig: lv < 3 ? hops(vals) : '',
        hint: 'Count each jump, not each number.', steps: [vals.join(', ') + '.', 'That is ' + (vals.length - 1) + ' jumps.'], explain: (vals.length - 1) + ' jumps of ' + by + '.', meta: { k: 'g3n-jumps', from: n, to: 1000, by: by } });
    }],
    [2, 'mc', function (lv) {
      var right = R.pick(['10 hundreds', '100 tens', '1000 ones']), bad = [['100 hundreds', '1 hundred is 100. 100 hundreds is far more.'], ['10 tens', '10 tens make 100, not 1000.'], ['100 ones', '100 ones make 100.'], ['1000 tens', '100 tens make 1000.'], ['10 ones', '10 ones make 10.']];
      return mc('Which is the same as <b>1000</b>?', right, R.shuffle(bad), { fig: lv === 2 ? stairs() : '',
        hint: '10 ones = 1 ten. 10 tens = 1 hundred. 10 hundreds = 1000.', steps: ['1000 = 10 hundreds = 100 tens = 1000 ones.'], explain: '1000 = ' + right + '.', meta: { k: 'g3n-1000mc' } });
    }],
    [2, 'tf', function (lv) {
      var n = kCase(lv), who = Q.name(), truth = coin(), m = truth ? 1000 - n : 1000 - n + R.pick([100, -100, 10, -10].filter(function (x) { return 1000 - n + x > 0; }));
      return tf(who + ' says ' + math(n + ' + ' + m + ' = 1000') + '. True or false: ' + who + ' is right.', truth, n + ' + ' + (1000 - n) + ' = 1000.',
        ['1000 is 10 tens.', 'Any two hundreds make 1000.', 'Add the first digits only.'], 'Count up from ' + n + ' to 1000.', { fig: lv === 1 ? thousand(n) : '', hint: 'Count on to the next hundred first.', meta: { k: 'g3n-sumtf', a: n, b: m, said: 1000 } });
    }]
  ]);
  function tgThousand(lv) {
    return function () {
      var n = kCase(lv), up = Math.ceil(n / 100) * 100;
      var steps = n % 100 ? [
        { prompt: 'Count on to the next hundred.', q: subQ(n + ' + ? = ' + up, up, n, 'How many tens to fill the row?') },
        { prompt: 'Then count hundreds to 1000.', q: subQ(up + ' + ? = 1000', 1000, up, 'Count the empty rows.') },
        { prompt: 'Add the two jumps.', q: sumQ((up - n) + ' + ' + (1000 - up) + ' = ?', up - n, 1000 - up) }
      ] : [
        { prompt: 'Count the full rows.', q: num('How many hundreds are filled?', n / 100, {}, { hint: 'One row is 100.', meta: { k: 'g3n-hund', n: n } }) },
        { prompt: 'Ten rows make 1000.', q: subQ('10 &minus; ' + n / 100 + ' = ?', 10, n / 100) },
        { prompt: 'So how many more make 1000?', q: num('How many more make 1000?', 1000 - n, {}, { hint: (10 - n / 100) + ' hundreds.', meta: { k: 'g3n-to1000', n: n } }) }
      ];
      return { q: 'How many more make 1000? ' + math(n + ' + ? = 1000'), fig: thousand(n), done: n + ' + ' + (1000 - n) + ' = 1000.', steps: steps };
    };
  }

  /* ---------- Count by 100s, 50s and 200s ---------- */
  var SKIPS = {
    100: { 1: function () { return [R.int(0, 5) * 100, 1]; }, 2: function () { var s; do { s = R.int(1, 59) * 10; } while (s % 100 === 0); return [s, 1]; }, 3: function () { return [R.int(50, 100) * 10, -1]; } },
    50: { 1: function () { return [R.int(0, 12) * 50, 1]; }, 2: function () { var s; do { s = R.int(1, 79) * 10; } while (s % 50 === 0); return [s, 1]; }, 3: function () { return [R.int(25, 100) * 10, -1]; } },
    200: { 1: function () { return [R.pick([0, 200, 400]), 1]; }, 2: function () { return [R.pick([100, 150, 250, 300, 350, 50]), 1]; }, 3: function () { return [R.int(60, 100) * 10, -1]; } }
  };
  var STUFF = { 100: [['boxes', 'pencils'], ['packs', 'sheets of paper'], ['bags', 'marbles']], 50: [['rolls', 'stickers'], ['jars', 'buttons'], ['bags', 'beads']], 200: [['cartons', 'crayons'], ['crates', 'apples'], ['bundles', 'craft sticks']] };
  function seq(by, lv, len) { var p = SKIPS[by][lv](), out = []; for (var i = 0; i < len; i++) out.push(p[0] + p[1] * by * i); return { vals: out, dir: p[1], start: p[0] }; }
  function skipSkill(by, id, name) {
    var len = by === 200 ? 4 : 5;
    skill(id, name, 'B1.4', [
      [1, 'plain', function (lv) {
        var s = seq(by, lv, len), ans = s.vals[len - 1], fx = {}; fx[s.vals[len - 2] + s.dir * 10] = 'That jump is only 10. Each jump is ' + by + '.';
        return num('Count by ' + by + 's' + (s.dir < 0 ? ' backward' : '') + '. What comes next? ' + math(s.vals.slice(0, len - 1).join(', ') + ', ___'), ans, fx, { fig: lv < 3 ? hops(s.vals, len - 1) : '',
          hint: (s.dir < 0 ? 'Take away ' : 'Add ') + by + '.', steps: [s.vals[len - 2] + (s.dir < 0 ? ' &minus; ' : ' + ') + by + ' = ' + ans + '.'], explain: s.vals.join(', ') + '.', meta: { k: 'g3n-skipnext', start: s.start, by: by, dir: s.dir, j: len - 1 } });
      }],
      [1, 'missing', function (lv) {
        var s = seq(by, lv, len), miss = len === 5 ? [1, 3] : [1, 2], t = s.vals.map(function (v, i) { return miss.indexOf(i) >= 0 ? '[[]]' : v; }).join(', ');
        return fill('Count by ' + by + 's' + (s.dir < 0 ? ' backward' : '') + '. Fill in the missing numbers.', t, miss.map(function (i) { return s.vals[i]; }), { fig: lv === 1 ? hops(s.vals, miss[0]) : '',
          hint: 'Each jump is ' + (s.dir < 0 ? 'back ' : '') + by + '.', steps: [s.vals.join(', ') + '.'], explain: s.vals.join(', ') + '.', meta: { k: 'g3n-skipfill', by: by } });
      }],
      [1, 'story', function (lv) {
        var t = R.pick(STUFF[by]), k = lv === 1 ? R.int(2, 4) : lv === 2 ? R.int(3, 1000 / by > 6 ? 6 : 5) : R.int(Math.min(6, 1000 / by - 1), 1000 / by), who = Q.name();
        return num(who + ' has ' + k + ' ' + t[0] + ' of ' + t[1] + '. Each holds ' + by + '. How many ' + t[1] + ' in all?', by * k, {}, { fig: k <= 10 ? hops(Array.apply(null, Array(k + 1)).map(function (_, i) { return i * by; })) : '',
          hint: 'Count by ' + by + 's, ' + k + ' times.', steps: [Array.apply(null, Array(k)).map(function (_, i) { return (i + 1) * by; }).join(', ') + '.'], explain: k + ' ' + t[0] + ' of ' + by + ' make ' + by * k + '.', meta: { k: 'g3n-groups', by: by, n: k } });
      }],
      [2, 'line', function (lv) {
        var s = seq(by, lv, len), k = R.int(2, len - 1), land = s.start + s.dir * by * k, lo = Math.min(s.start, land), hi = Math.max(s.start, land), mn = Math.max(0, Math.floor(lo / 100) * 100 - 100), mx = Math.min(1000, Math.ceil(hi / 100) * 100 + 100);
        return { q: 'Start at ' + s.start + '. Jump ' + (s.dir < 0 ? 'back ' : '') + by + ', ' + k + ' times. Where do you land?', type: 'line', min: mn, max: mx, tick: 10, every: mx - mn > 500 ? 100 : 50, snap: 10, answer: land,
          hint: 'Count ' + k + ' jumps of ' + by + '.', steps: [s.vals.slice(0, k + 1).join(', ') + '.'], explain: 'You land on ' + land + '.', meta: { k: 'g3n-skipline', start: s.start, by: by, dir: s.dir, j: k } };
      }],
      [2, 'jumps', function (lv) {
        var s = seq(by, lv, len), a = s.vals[0], b = s.vals[len - 1], fx = {}; fx[Math.abs(b - a)] = 'That is the distance. Count the jumps of ' + by + '.';
        return num('How many jumps of ' + by + ' go from ' + a + ' to ' + b + '?', len - 1, fx, { fig: lv === 2 ? hops(s.vals) : '',
          hint: 'Count by ' + by + 's from ' + a + '.', steps: [s.vals.join(', ') + '.', (len - 1) + ' jumps.'], explain: (len - 1) + ' jumps of ' + by + '.', meta: { k: 'g3n-jumps', from: a, to: b, by: by } });
      }],
      [2, 'tf', function (lv) {
        var s = seq(by, lv, len), who = Q.name(), truth = coin(), shown = s.vals.slice();
        if (!truth) { var j = R.int(1, len - 2); shown[j] += s.dir * R.pick([10, by === 50 ? 100 : 50]); }
        return tf(who + ' counts by ' + by + 's' + (s.dir < 0 ? ' backward' : '') + ': ' + math(shown.join(', ')) + '. True or false: every jump is ' + by + '.', truth, s.vals.join(', ') + '.',
          ['Skip counts can change size.', 'Only the last digit changes.', 'Every number ends in 0, so it is right.'], 'Check each jump.', { hint: 'Check the jump between each pair.', meta: { k: 'g3n-skiptf', vals: shown, by: by } });
      }]
    ]);
  }
  skipSkill(100, 'n3-by100', 'Count by 100s');
  skipSkill(50, 'n3-by50', 'Count by 50s');
  skipSkill(200, 'n3-by200', 'Count by 200s');
  function tgSkip(by, lv) {
    return function () {
      var s = seq(by, lv, 4), back = s.dir < 0, steps = [];
      for (var i = 1; i < 4; i++) {
        var a = s.vals[i - 1];
        steps.push({ prompt: [back ? 'Take away ' + by + '.' : 'Add ' + by + '.', 'Again.', 'One more jump.'][i - 1], q: back ? subQ(a + ' &minus; ' + by + ' = ?', a, by) : sumQ(a + ' + ' + by + ' = ?', a, by) });
      }
      return { q: 'Count by ' + by + 's' + (back ? ' backward' : '') + ' from <b>' + s.start + '</b>.', fig: hops(s.vals, 3), done: s.vals.join(', ') + '.', steps: steps };
    };
  }

  /* ======================= Lesson 4: Compare and order ======================= */
  /* ---------- Compare from the left ---------- */
  function gCase(lv) {
    var a, b;
    if (lv === 1) { do { a = R.int(100, 999); b = R.int(100, 999); } while (Math.floor(a / 100) === Math.floor(b / 100)); }
    else if (lv === 2) { var h = R.int(1, 9); do { a = h * 100 + R.int(0, 99); b = h * 100 + R.int(0, 99); } while (Math.floor(a / 10) % 10 === Math.floor(b / 10) % 10); }
    else if (coin()) { var hh = R.int(1, 8); a = hh * 100 + R.int(5, 9) * 10 + R.int(5, 9); b = (hh + 1) * 100 + R.int(0, 3) * 10 + R.int(0, 4); }
    else { var x = R.int(10, 99); do { a = x * 10 + R.int(0, 9); b = x * 10 + R.int(0, 9); } while (a === b); }
    return coin() ? [a, b] : [b, a];
  }
  skill('n3-greater', 'Which is greater?', 'B1.2', [
    [1, 'plain', function (lv) {
      var p = gCase(lv), big = Math.max(p[0], p[1]), fx = {}; fx[Math.min(p[0], p[1])] = 'Start at the left. The first place that differs decides.';
      return num('Which is greater, ' + math(p[0]) + ' or ' + math(p[1]) + '? Type it.', big, fx, { fig: lv < 3 ? chart(p[0], { dots: false }) + chart(p[1], { dots: false }) : '',
        hint: 'Compare the hundreds first. If they match, the tens.', steps: ['Line them up by place.', 'The first different digits decide: ' + big + ' is greater.'], explain: big + ' is greater.', meta: { k: 'g3n-max', a: p[0], b: p[1] } });
    }],
    [1, 'mc', function (lv) {
      var opts = []; while (opts.length < 4) { var p = gCase(lv), v = opts.length ? (lv === 1 ? R.int(100, 999) : Math.floor(opts[0] / (lv === 2 ? 100 : 10)) * (lv === 2 ? 100 : 10) + R.int(0, lv === 2 ? 99 : 9)) : p[0]; if (opts.indexOf(v) < 0 && v < 1000) opts.push(v); }
      var big = Math.max.apply(null, opts);
      return mc('Which number is the greatest?', big, opts.filter(function (v) { return v !== big; }).map(function (v) { return [v, 'Compare ' + v + ' with ' + big + ' from the left.']; }), {
        hint: 'Find the most hundreds. Then the most tens.', steps: ['Look at the hundreds first.', 'The greatest is ' + big + '.'], explain: big + ' is the greatest.', meta: { k: 'g3n-maxmc' } });
    }],
    [1, 'story', function (lv) {
      var p = gCase(lv), t = R.pick([['Two trails in the park are', 'm and', 'm long. How long is the longer trail, in metres?'], ['Two schools collected', 'and', 'cans. What is the greater number of cans?'], ['Two canoe trips are', 'km and', 'km. How long is the longer trip, in kilometres?']]);
      return num(t[0] + ' ' + p[0] + ' ' + t[1] + ' ' + p[1] + ' ' + t[2], Math.max(p[0], p[1]), {}, {
        hint: 'Compare from the left.', steps: ['The first different digits decide.'], explain: Math.max(p[0], p[1]) + ' is greater.', meta: { k: 'g3n-max', a: p[0], b: p[1] } });
    }],
    [2, 'digits', function (lv) {
      var d = distinct3(), big = lv < 3 || coin();
      if (lv === 3 && !big) d[R.int(1, 2)] = 0;
      var s = d.slice().sort(function (x, y) { return big ? y - x : x - y; });
      if (!big && s[0] === 0) { var k = s[1]; s[1] = 0; s[0] = k; }
      var ans = +s.join(''), fx = {}; fx[+s.slice().reverse().join('')] = big ? 'That is the least. Put the biggest digit in the hundreds.' : '';
      return num('Use the digits ' + d.join(', ') + ' once each. Make the <b>' + (big ? 'greatest' : 'least') + '</b> number.', ans, fx, {
        hint: big ? 'The biggest digit goes in the hundreds place.' : 'The smallest digit that is not 0 goes in the hundreds place.', steps: ['Hundreds: ' + s[0] + '. Tens: ' + s[1] + '. Ones: ' + s[2] + '.'], explain: 'The ' + (big ? 'greatest' : 'least') + ' is ' + ans + '.', meta: { k: 'g3n-dig', d: d, big: big } });
    }],
    [2, 'tf', function (lv) {
      var p = gCase(lv), who = Q.name(), truth = p[0] > p[1];
      return tf(who + ' says ' + math(p[0]) + ' is greater than ' + math(p[1]) + '. True or false: ' + who + ' is right.', truth, 'Compare from the left: ' + Math.max(p[0], p[1]) + ' is greater.',
        ['The number with the biggest ones digit is greater.', 'Count all the digits and add them.', 'Look at the right side first.'], 'Start with the hundreds, on the left.', { hint: 'Which place differs first, from the left?', meta: { k: 'g3n-gtf', a: p[0], b: p[1] } });
    }]
  ]);
  function tgGreater(lv) {
    return function () {
      var p = gCase(lv), a = p[0], b = p[1], dh = Math.floor(a / 100) !== Math.floor(b / 100);
      var cmp = function (place) { return fixed('Which has more ' + PNAME[place] + '?', [String(a), String(b), 'The same'], dig(a)[place] > dig(b)[place] ? 0 : dig(a)[place] < dig(b)[place] ? 1 : 2, ['Look at the ' + PNAME[place] + ' digit of each.', 'Look at the ' + PNAME[place] + ' digit of each.', 'Look again: the digits are different.'], { hint: 'Compare the ' + PNAME[place] + ' digits.', meta: { k: 'g3n-cmpplace', a: a, b: b, p: place } }); };
      var steps = [{ prompt: 'Start with the hundreds.', q: cmp(2) }];
      if (!dh) steps.push({ prompt: 'Same hundreds. Look at the tens.', q: cmp(1) });
      if (!dh && Math.floor(a / 10) === Math.floor(b / 10)) steps.push({ prompt: 'Same tens too. The ones decide.', q: cmp(0) });
      steps.push({ prompt: 'That place decides.', q: num('Type the greater number.', Math.max(a, b), {}, { hint: 'The one with more in that place.', meta: { k: 'g3n-max', a: a, b: b } }) });
      return { q: 'Which is greater, ' + math(a) + ' or ' + math(b) + '?', fig: chart(a, { dots: false }) + chart(b, { dots: false }), done: Math.max(a, b) + ' is greater.', steps: steps };
    };
  }

  /* ---------- The symbols < and > ---------- */
  var SYM = ['&lt;', '&gt;', '='];
  function symOf(a, b) { return a < b ? 0 : a > b ? 1 : 2; }
  function sCase(lv) {
    var p = gCase(lv === 3 ? 2 : lv), l = [p[0]], r = [p[1]];
    if (lv === 3) { var d = dig(p[0]), parts = [d[2] * 100, d[1] * 10, d[0]].filter(function (v) { return v; }); l = R.shuffle(parts); if (Math.random() < 0.3) r = [p[0]]; }
    return { l: l, r: r, a: l.reduce(function (x, y) { return x + y; }, 0), b: r[0] };
  }
  skill('n3-symbols', 'The symbols < and >', 'B1.2', [
    [1, 'plain', function (lv) {
      var c = sCase(lv), k = symOf(c.a, c.b);
      return fixed('Which symbol goes in the box? ' + math(c.l.join(' + ') + ' &#9633; ' + c.b), SYM, k, ['The small point faces the smaller number.', 'The open side faces the greater number.', 'The two sides are not the same.'], { fig: lv < 3 ? chart(c.a, { dots: false }) + chart(c.b, { dots: false }) : '',
        hint: 'Find the greater number first. The open side faces it.', steps: [c.a === c.b ? 'Both are ' + c.b + '.' : Math.max(c.a, c.b) + ' is greater.', 'So: ' + c.l.join(' + ') + ' ' + SYM[k] + ' ' + c.b + '.'], explain: c.l.join(' + ') + ' ' + SYM[k] + ' ' + c.b + '.', meta: { k: 'g3n-sym', l: c.l, r: c.r } });
    }],
    [1, 'tf', function (lv) {
      var c = sCase(lv), k = symOf(c.a, c.b), sym = coin() ? k : R.pick([0, 1, 2].filter(function (x) { return x !== k; }));
      var said = c.l.join(' + ') + ' ' + SYM[sym] + ' ' + c.b;
      return tf('True or false: ' + math(said), sym === k, c.l.join(' + ') + ' ' + SYM[k] + ' ' + c.b + '.', ['The open side faces the smaller number.', 'The symbol points to the greater number.', 'Read it from right to left.'], 'Say it in words, left to right.', {
        hint: '&lt; means "is less than". &gt; means "is greater than".', meta: { k: 'g3n-symtf', l: c.l, r: c.r, sym: sym } });
    }],
    [2, 'read', function (lv) {
      var p = gCase(lv), a = p[0], b = p[1], rel = a < b ? '&lt;' : '&gt;', other = a < b ? '&gt;' : '&lt;', w = a < b ? 'less than' : 'greater than';
      return mc('Which says "' + a + ' is ' + w + ' ' + b + '"?', math(a + ' ' + rel + ' ' + b), [[math(a + ' ' + other + ' ' + b), 'That says ' + a + ' is ' + (a < b ? 'greater' : 'less') + ' than ' + b + '.'], [math(b + ' ' + rel + ' ' + a), 'The numbers swapped places.']], {
        hint: 'Read left to right: ' + a + ', then the symbol, then ' + b + '.', steps: ['&lt; is "less than". &gt; is "greater than".'], explain: a + ' ' + rel + ' ' + b + '.', meta: { k: 'g3n-symread', a: a, b: b } });
    }],
    [2, 'pick', function (lv) {
      var x = R.int(2, 8) * 100 + R.int(1, 8) * 10 + R.int(1, 8), less = coin(), opts = [];
      while (opts.length < 5) { var v = x + R.pick([-1, 1]) * R.pick(lv === 3 ? [1, 2, 9, 10, 11] : [10, 20, 100, 90, 110]); if (opts.indexOf(v) < 0 && v !== x) opts.push(v); }
      var ans = opts.map(function (v, j) { return (less ? v < x : v > x) ? j : -1; }).filter(function (j) { return j >= 0; });
      if (!ans.length || ans.length === 5) return DEF['n3-symbols'][3][2](lv);
      return { q: 'Pick every number that makes this true: ' + math('___ ' + (less ? '&lt;' : '&gt;') + ' ' + x), type: 'pick', options: opts.map(String), answer: ans,
        hint: 'The blank must be ' + (less ? 'less' : 'greater') + ' than ' + x + '.', steps: ['Compare each with ' + x + ' from the left.'], explain: 'The ' + (less ? 'smaller' : 'greater') + ' numbers fit.', meta: { k: 'g3n-sympick', x: x, less: less, opts: opts } };
    }]
  ]);
  function tgSym(lv) {
    return function () {
      var c = sCase(lv === 3 ? 2 : lv), k = symOf(c.a, c.b);
      return { q: 'Which symbol goes in the box? ' + math(c.a + ' &#9633; ' + c.b), fig: twoCharts({ a: c.a, b: c.b, hl: -1 }), done: c.a + ' ' + SYM[k] + ' ' + c.b + '.', steps: [
        { prompt: 'Find the greater number.', q: num('Type the greater number.', Math.max(c.a, c.b), {}, { hint: 'Compare from the left.', meta: { k: 'g3n-max', a: c.a, b: c.b } }) },
        { prompt: 'The open side faces it.', q: fixed(math(c.a + ' &#9633; ' + c.b), SYM, k, ['The open side faces the greater number.', 'The open side faces the greater number.', 'They are not the same.'], { hint: 'Open towards ' + Math.max(c.a, c.b) + '.', meta: { k: 'g3n-sym', l: [c.a], r: [c.b] } }) }
      ] };
    };
  }

  /* ---------- Put numbers in order ---------- */
  function oCase(lv) {
    var n = lv === 1 ? 3 : lv === 2 ? 4 : 5, out = [], h = R.int(1, 8);
    while (out.length < n) {
      var v = lv === 1 ? R.int(1, 9) * 100 + R.int(0, 99) : lv === 2 ? h * 100 + R.int(0, 99) : R.pick([h * 100 + R.int(0, 9) * 10 + R.int(0, 9), (h + 1) * 100 + R.int(0, 9), h * 100 + 90 + R.int(0, 9), +(String(h) + String(R.int(0, 9)) + String(h))]);
      if (out.indexOf(v) < 0 && (lv > 1 || out.every(function (x) { return Math.floor(x / 100) !== Math.floor(v / 100); }))) out.push(v);
    }
    return out;
  }
  skill('n3-order', 'Put numbers in order', 'B1.2', [
    [1, 'plain', function (lv) {
      var v = oCase(lv), big = lv > 1 && coin(), s = v.slice().sort(function (x, y) { return big ? y - x : x - y; });
      return { q: 'Put these in order, ' + (big ? 'greatest to least' : 'least to greatest') + '.', type: 'order', items: s.map(String), first: big ? 'greatest' : 'least', last: big ? 'least' : 'greatest',
        hint: 'Compare the hundreds, then the tens, then the ones.', steps: ['Look at the hundreds first.', s.join(', ') + '.'], explain: s.join(', ') + '.', meta: { k: 'g3n-order', big: big } };
    }],
    [1, 'least', function (lv) {
      var v = oCase(lv), big = lv === 3 && coin(), ans = big ? Math.max.apply(null, v) : Math.min.apply(null, v), fx = {}; fx[big ? Math.min.apply(null, v) : Math.max.apply(null, v)] = big ? 'That is the least.' : 'That is the greatest.';
      return num('Type the <b>' + (big ? 'greatest' : 'least') + '</b> number: ' + math(v.join(', ')), ans, fx, { fig: lv === 1 ? marks(v) : '',
        hint: 'Compare from the left.', steps: ['Compare the hundreds first.', 'The ' + (big ? 'greatest' : 'least') + ' is ' + ans + '.'], explain: ans + '.', meta: { k: 'g3n-pickone', opts: v, big: big } });
    }],
    [2, 'line', function (lv) {
      var lo = R.int(1, 8) * 100, n = lo + R.int(1, 19) * 5;
      return { q: 'Put ' + math(n) + ' on the number line.', type: 'line', min: lo, max: lo + 100, tick: 10, every: 50, snap: 5, answer: n,
        hint: n + ' is ' + (n - lo) + ' more than ' + lo + '.', steps: ['Count by tens from ' + lo + '.'], explain: n + ' is between ' + Math.floor(n / 10) * 10 + ' and ' + (Math.floor(n / 10) * 10 + 10) + '.', meta: { k: 'g3n-line', n: n } };
    }],
    [2, 'between', function (lv) {
      var lo = R.int(1, 8) * 100 + R.int(0, 5) * 10 + R.int(0, 9), hi = lo + (lv === 3 ? R.int(8, 20) : R.int(30, 60)), inside = R.int(lo + 1, hi - 1);
      var w = [lo - R.int(1, 9), hi + R.int(1, 9), lo + 100 > 999 ? lo - 100 : lo + 100, +String(inside).split('').reverse().join('')].filter(function (v) { return (v <= lo || v >= hi) && v >= 100 && v < 1000; });
      return mc('Which number is between ' + math(lo) + ' and ' + math(hi) + '?', inside, w.map(function (v) { return [v, v + ' is ' + (v < lo ? 'less than ' + lo : 'greater than ' + hi) + '.']; }), { fig: lv === 2 ? marks([lo, hi]) : '',
        hint: 'It must be greater than ' + lo + ' and less than ' + hi + '.', steps: [inside + ' is greater than ' + lo + ' and less than ' + hi + '.'], explain: inside + ' is between them.', meta: { k: 'g3n-between', lo: lo, hi: hi } });
    }],
    [2, 'tf', function (lv) {
      var v = oCase(lv), who = Q.name(), s = v.slice().sort(function (x, y) { return x - y; }), truth = coin(), shown = s.slice();
      if (!truth) { var j = R.int(0, s.length - 2); shown[j] = s[j + 1]; shown[j + 1] = s[j]; }
      return tf(who + ' put these in order, least to greatest: ' + math(shown.join(', ')) + '. True or false: ' + who + ' is right.', truth, 'Least to greatest: ' + s.join(', ') + '.',
        ['Order by the ones digits.', 'Bigger digits on the right mean bigger numbers.', 'Order by how many digits are the same.'], 'Compare each pair from the left.', { hint: 'Check each pair from the left.', meta: { k: 'g3n-ordtf', vals: shown } });
    }]
  ]);
  function tgOrder(lv) {
    return function () {
      var v = oCase(1).slice(0, 3);
      if (lv > 1) { var h = R.int(1, 8); v = []; while (v.length < 3) { var x = h * 100 + (lv === 3 ? R.pick([R.int(0, 9), 90 + R.int(0, 9), R.int(1, 9) * 10]) : R.int(0, 99)); if (v.indexOf(x) < 0) v.push(x); } }
      var s = v.slice().sort(function (a, b) { return a - b; });
      return { q: 'Put ' + math(v.join(', ')) + ' in order, least to greatest.', fig: marks(v), done: s.join(', ') + '.', steps: [
        { prompt: 'Find the least.', q: num('Which is the least?', s[0], {}, { hint: 'It is furthest left.', meta: { k: 'g3n-pickone', opts: v, big: false } }) },
        { prompt: 'Then the greatest.', q: num('Which is the greatest?', s[2], {}, { hint: 'It is furthest right.', meta: { k: 'g3n-pickone', opts: v, big: true } }) },
        { prompt: 'The other one goes in the middle.', q: num('Which goes in the middle?', s[1], {}, { hint: 'The one left over.', meta: { k: 'g3n-mid', opts: v } }) }
      ] };
    };
  }

  /* ======================= Lesson 5: Rounding ======================= */
  function rCase(p, lv) {
    var n;
    if (p === 10) {
      if (lv === 1) do { n = R.int(11, 99); } while (n % 10 === 0 || n % 10 === 5);
      else if (lv === 2) do { n = R.int(101, 989); } while (n % 10 === 0 || n % 10 === 5);
      else n = coin() ? R.int(10, 99) * 10 + 5 : R.int(1, 9) * 100 + R.int(95, 99);
    } else {
      if (lv === 1) do { n = R.int(101, 899); } while (n % 100 === 0 || Math.floor(n / 10) % 10 === 5);
      else if (lv === 2) do { n = R.int(101, 999); } while (n % 100 === 0 || n % 100 === 50);
      else n = R.pick([R.int(1, 9) * 100 + 50, R.int(1, 9) * 100 + R.pick([49, 51, 48, 52]), R.int(951, 999)]);
    }
    return n;
  }
  function rWrongFix(n, p) {
    var lo = Math.floor(n / p) * p, r = roundTo(n, p), f = {}, nm = p === 10 ? 'ones' : 'tens';
    f[r === lo ? lo + p : lo] = 'Look at the ' + nm + ' digit. ' + (n % p === p / 2 ? 'Halfway rounds up.' : '5 or more rounds up.');
    f[roundTo(n, p === 10 ? 100 : 10)] = 'That is rounded to the nearest ' + (p === 10 ? 'hundred' : 'ten') + '.';
    return f;
  }
  function roundSkill(p, id, name) {
    var nm = p === 10 ? 'ten' : 'hundred', look = p === 10 ? 'ones' : 'tens';
    skill(id, name, 'B1.3', [
      [1, 'plain', function (lv) {
        var n = rCase(p, lv), r = roundTo(n, p), lo = Math.floor(n / p) * p;
        return num('Round ' + math(n) + ' to the nearest ' + nm + '.', r, rWrongFix(n, p), { fig: lv < 3 ? hill(n, p) : '',
          hint: 'Find the ' + nm + 's on each side. Is it before or past halfway?', steps: [n + ' is between ' + lo + ' and ' + (lo + p) + '.', 'Halfway is ' + (lo + p / 2) + '. ' + n + (n >= lo + p / 2 ? ' is at or past it: round up.' : ' is before it: round down.'), n + ' rounds to ' + r + '.'], explain: n + ' rounds to ' + r + '.', meta: { k: 'g3n-round', n: n, p: p } });
      }],
      [1, 'tap', function (lv) {
        var n; do { n = rCase(p, lv); } while (n % p === p / 2);
        var lo = Math.floor(n / p) * p, r = roundTo(n, p);
        return { q: 'Tap the ' + nm + ' that ' + math(n) + ' is closer to.', type: 'tap', pic: twoEnds(n, lo, lo + p), answer: String(r), answerText: String(r),
          hint: 'Is it before or past the middle mark?', steps: [n + ' is ' + (n - lo) + ' from ' + lo + ' and ' + (lo + p - n) + ' from ' + (lo + p) + '.'], explain: n + ' is closer to ' + r + '.', meta: { k: 'g3n-roundtap', n: n, lo: lo, hi: lo + p } };
      }],
      [1, 'fill', function (lv) {
        var n = rCase(p, lv), lo = Math.floor(n / p) * p, r = roundTo(n, p);
        return fill('Round ' + n + ' to the nearest ' + nm + '.', n + ' is between [[]] and [[]]. It rounds to [[]].', [lo, lo + p, r], { fig: lv === 1 ? hillBare(lo, p) : '',
          hint: 'The ' + nm + 's on each side, then the ' + look + ' digit.', steps: ['Between ' + lo + ' and ' + (lo + p) + '.', 'It rounds to ' + r + '.'], explain: n + ' rounds to ' + r + '.', meta: { k: 'g3n-roundfill', n: n, p: p } });
      }],
      [2, 'story', function (lv) {
        var n = rCase(p, lv === 1 ? 2 : lv), r = roundTo(n, p), t = R.pick([['A hiking trail is', 'm long. About how long is it'], ['A school has', 'students. About how many students'], ['The arena sold', 'tickets. About how many tickets'], ['A pumpkin farm grew', 'pumpkins. About how many pumpkins']]);
        return num(t[0] + ' ' + n + ' ' + t[1] + ', to the nearest ' + nm + '?', r, rWrongFix(n, p), {
          hint: 'Look at the ' + look + ' digit.', steps: [n + ' is between ' + Math.floor(n / p) * p + ' and ' + (Math.floor(n / p) * p + p) + '.', 'It rounds to ' + r + '.'], explain: 'About ' + r + '.', meta: { k: 'g3n-round', n: n, p: p } });
      }],
      [2, 'tf', function (lv) {
        var n = rCase(p, lv), r = roundTo(n, p), lo = Math.floor(n / p) * p, who = Q.name(), truth = coin(), said = truth ? r : (r === lo ? lo + p : lo);
        return tf(who + ' says ' + math(n) + ' rounds to <b>' + said + '</b> (nearest ' + nm + '). True or false: ' + who + ' is right.', truth, 'The ' + look + ' digit is ' + Math.floor((n % p) / (p / 10)) + ', so ' + n + ' rounds to ' + r + '.',
          ['Always round down.', 'Halfway rounds down.', 'Look at the first digit only.'], 'Check the ' + look + ' digit.', { hint: '5 or more rounds up.', meta: { k: 'g3n-roundtf', n: n, p: p, said: said } });
      }],
      [2, 'pick', function (lv) {
        var t = (p === 10 ? R.int(11, 98) : R.int(2, 9)) * p, opts = [];
        while (opts.length < 5) { var v = t + R.int(-p, p - 1); if (v > 0 && v !== t && opts.indexOf(v) < 0) opts.push(v); }
        var ans = opts.map(function (v, j) { return roundTo(v, p) === t ? j : -1; }).filter(function (j) { return j >= 0; });
        if (!ans.length || ans.length === 5) return DEF[id][5][2](lv);
        return { q: 'Pick every number that rounds to <b>' + t + '</b> (nearest ' + nm + ').', type: 'pick', options: opts.map(String), answer: ans,
          hint: 'From halfway below ' + t + ' up to just before halfway above it.', steps: ['From ' + (t - p / 2) + ' to ' + (t + p / 2 - 1) + ' rounds to ' + t + '.'], explain: 'They are from ' + (t - p / 2) + ' to ' + (t + p / 2 - 1) + '.', meta: { k: 'g3n-roundpick', p: p, t: t, opts: opts } };
      }]
    ]);
  }
  roundSkill(10, 'n3-round10', 'Round to the nearest ten');
  roundSkill(100, 'n3-round100', 'Round to the nearest hundred');
  function tgRound(p, lv) {
    return function () {
      var n = rCase(p, lv), lo = Math.floor(n / p) * p, nm = p === 10 ? 'ten' : 'hundred';
      return { q: 'Round ' + math(n) + ' to the nearest ' + nm + '.', fig: hillBare(lo, p), done: n + ' rounds to ' + roundTo(n, p) + '.', steps: [
        { prompt: 'Find the ' + nm + 's on each side.', q: fill('Which ' + nm + 's is ' + n + ' between?', '[[]] and [[]]', [lo, lo + p], { hint: 'The ' + nm + ' just below and just above.', meta: { k: 'g3n-sides', n: n, p: p } }) },
        { prompt: 'Find halfway: the top of the hill.', q: num('What is halfway between ' + lo + ' and ' + (lo + p) + '?', lo + p / 2, {}, { hint: 'Half of ' + p + ' is ' + p / 2 + '.', meta: { k: 'g3n-half', lo: lo, p: p } }) },
        { prompt: 'Before halfway rounds down. At or past rounds up.', q: num('So ' + n + ' rounds to?', roundTo(n, p), rWrongFix(n, p), { hint: n + ' is ' + (n >= lo + p / 2 ? 'at or past' : 'before') + ' halfway.', meta: { k: 'g3n-round', n: n, p: p } }) }
      ] };
    };
  }

  /* ---------- Ten or hundred? (the two kinds of rounding, mixed) ---------- */
  function mxCase(lv) { var n; do { n = lv === 1 ? R.int(101, 899) : lv === 2 ? R.int(101, 999) : R.pick([R.int(1, 9) * 100 + R.int(45, 54), R.int(950, 999), R.int(1, 9) * 100 + R.pick([5, 95, 46, 54])]); } while (roundTo(n, 10) === roundTo(n, 100) || n % 10 === 0); return n; }
  skill('n3-roundmix', 'Ten or hundred?', 'B1.3', [
    [1, 'plain', function (lv) {
      var n = mxCase(lv), r1 = roundTo(n, 10), r2 = roundTo(n, 100);
      return fill('Round ' + math(n) + ' two ways.', 'Nearest ten: [[]] &nbsp; Nearest hundred: [[]]', [r1, r2], { fig: lv === 1 ? hill(n, 10) : '',
        hint: 'Nearest ten: look at the ones. Nearest hundred: look at the tens.', steps: ['Ones digit ' + n % 10 + ': nearest ten is ' + r1 + '.', 'Tens digit ' + Math.floor(n / 10) % 10 + ': nearest hundred is ' + r2 + '.'], explain: r1 + ' and ' + r2 + '.', meta: { k: 'g3n-roundboth', n: n } });
    }],
    [1, 'num', function (lv) {
      var n = mxCase(lv), p = coin() ? 10 : 100;
      return num('Round ' + math(n) + ' to the nearest <b>' + (p === 10 ? 'ten' : 'hundred') + '</b>.', roundTo(n, p), rWrongFix(n, p), {
        hint: 'Nearest ' + (p === 10 ? 'ten: look at the ones' : 'hundred: look at the tens') + '.', steps: [n + ' rounds to ' + roundTo(n, p) + '.'], explain: n + ' rounds to ' + roundTo(n, p) + '.', meta: { k: 'g3n-round', n: n, p: p } });
    }],
    [2, 'which', function (lv) {
      var n = mxCase(lv), k = R.int(0, 2), r = k === 0 ? roundTo(n, 10) : k === 1 ? roundTo(n, 100) : (roundTo(n, 10) === Math.floor(n / 10) * 10 ? Math.floor(n / 10) * 10 + 10 : Math.floor(n / 10) * 10);
      if (k === 2 && (r === roundTo(n, 100))) r = roundTo(n, 100) + 100;
      return fixed(math(n) + ' was rounded to <b>' + r + '</b>. Which way was it rounded?', ['nearest ten', 'nearest hundred', 'neither'], k, ['Check: ' + n + ' to the nearest ten is ' + roundTo(n, 10) + '.', 'Check: ' + n + ' to the nearest hundred is ' + roundTo(n, 100) + '.', 'Round it both ways and compare.'], {
        hint: 'Round it both ways. Which one gives ' + r + '?', steps: ['Nearest ten: ' + roundTo(n, 10) + '.', 'Nearest hundred: ' + roundTo(n, 100) + '.'], explain: k === 2 ? r + ' is neither.' : 'It was rounded to the ' + ['nearest ten', 'nearest hundred'][k] + '.', meta: { k: 'g3n-roundwhich', n: n, r: r } });
    }],
    [2, 'tf', function (lv) {
      var n = mxCase(lv), who = Q.name(), truth = coin(), said = truth ? roundTo(n, 100) : roundTo(n, 10);
      return tf(who + ' rounds ' + math(n) + ' to the nearest <b>hundred</b> and gets ' + said + '. True or false: ' + who + ' is right.', truth, 'Nearest hundred: the tens digit is ' + Math.floor(n / 10) % 10 + ', so ' + roundTo(n, 100) + '.',
        ['Look at the ones digit for hundreds.', 'Rounding to a hundred and a ten give the same answer.', 'Round to the ten first, then to the hundred.'], 'For the nearest hundred, look at the tens digit.', { hint: 'Hundreds: look at the tens.', meta: { k: 'g3n-roundtf', n: n, p: 100, said: said } });
    }],
    [2, 'story', function (lv) {
      var n = mxCase(lv), p = coin() ? 10 : 100, t = R.pick([['At the powwow,', 'people danced. About how many is that, to the nearest '], ['A bike trail is', 'm long. About how long is it, to the nearest '], ['The class read', 'pages. About how many pages is that, to the nearest ']]);
      var q = t[0] + ' ' + n + ' ' + t[1] + (p === 10 ? 'ten' : 'hundred') + '?';
      return num(q, roundTo(n, p), rWrongFix(n, p), { hint: 'Which place are you rounding to?', steps: ['Nearest ' + (p === 10 ? 'ten' : 'hundred') + ': ' + roundTo(n, p) + '.'], explain: 'About ' + roundTo(n, p) + '.', meta: { k: 'g3n-round', n: n, p: p } });
    }]
  ]);
  function tgMix(lv) {
    return function () {
      var n = mxCase(lv);
      return { q: 'Round ' + math(n) + ' to the nearest ten, then to the nearest hundred.', fig: hill(n, 10), done: n + ': ' + roundTo(n, 10) + ' (ten), ' + roundTo(n, 100) + ' (hundred).', steps: [
        { prompt: 'Nearest ten: look at the ones digit.', q: num('Nearest ten?', roundTo(n, 10), rWrongFix(n, 10), { hint: 'Ones digit ' + n % 10 + '.', meta: { k: 'g3n-round', n: n, p: 10 } }) },
        { prompt: 'Nearest hundred: look at the tens digit.', q: num('Nearest hundred?', roundTo(n, 100), rWrongFix(n, 100), { hint: 'Tens digit ' + Math.floor(n / 10) % 10 + '.', meta: { k: 'g3n-round', n: n, p: 100 } }) }
      ] };
    };
  }

  /* ======================= Watch and My turn pictures ======================= */
  function chartV(s) { return chart(s.n, { hl: s.hl, vals: s.vals }); }
  function formV(s) { return s.show ? expanded(s.n) : chart(s.n, {}); }
  function gridV(s) { return thousand(s.n); }
  function hillV(s) { return hill(s.n, s.p); }
  function marksV(s) { return marks(s.vals, s.show); }
  function hopsV(s) { return hops(s.vals.slice(0, s.k)); }
  function hopsTo(start, by, n) { var v = []; for (var i = 0; i < n; i++) v.push(start + by * i); return v; }
  function wordsV(s) { return '<div>' + chart(s.n, { dots: false }) + '<p class="g3-sym">' + (s.w || '&nbsp;') + '</p></div>'; }

  /* ======================= The lessons ======================= */
  var LESSONS = [
    { id: 'place', title: 'Place value', sub: 'Hundreds, tens and ones.', concepts: [
      { id: 'hundred', title: 'Ten tens make one hundred', exp: ['B1.5'], skill: 'n3-hundred',
        watch: tool('base10', b10({ t: 7 }), [
          ['7 tens: 10, 20 ... 70.', function (t) { return t.countAll(240); }],
          ['3 more tens: 80, 90, 100.', function (t) { t.clearLit(); return t.add('t', 3, 420); }],
          ['They slide into one flat.', function (t) { return t.group('t'); }],
          ['1 flat = 10 rods = 100 cubes.', function (t) { return t.pulseCol('h'); }]
        ]),
        example: tool('base10', b10({ h: 3 }), [
          ['My turn. 3 flats: 300.'],
          ['I break one into rods: 10 tens.', function (t) { return t.split('h'); }],
          ['I break the others too.', function (t) { return t.split('h').then(function () { return t.split('h'); }); }],
          ['30 tens. Not 3 tens: still 300.', function (t) { return t.pulseCol('t'); }]
        ]),
        try: { tool: 'base10', opts: b10({ controls: true, t: 8 }), tasks: [
          { do: 'Add tens until you have 10. Then press <b>Group 10 tens</b>.', goal: function (s) { return s.h >= 1; }, yes: '10 tens became 1 hundred.' },
          { do: 'Now press <b>Break a hundred</b>. How many tens come back?', reset: false, goal: function (s) { return s.last === 'split-h'; }, yes: '10 tens. Still 100.' }
        ] },
        together: [tgHundred(1), tgHundred(2), tgHundred(3)],
        mistake: '<p>Saying 300 is "3 tens" (counting flats as tens), or counting rods by ones. Break a flat into 10 rods together and count by tens.</p>',
        check: [ck('n3-hundred', 'plain', 1), ck('n3-hundred', 'rods', 1), ck('n3-hundred', 'fill', 2), ck('n3-hundred', 'mc', 2), ck('n3-hundred', 'plain', 3)] },

      { id: 'build', title: 'Read and build with blocks', exp: ['B1.1', 'B1.5'], skill: 'n3-blocks',
        watch: tool('base10', b10({}), [
          ['2 flats: 100, 200.', function (t) { return t.add('h', 2, 500); }],
          ['4 rods: 210, 220, 230, 240.', function (t) { return t.add('t', 4, 380); }],
          ['3 cubes: 241, 242, 243.', function (t) { return t.add('o', 3, 320); }],
          ['<b>243</b>.', function (t) { return t.countAll(200); }]
        ]),
        example: tool('base10', b10({}), [
          ['My turn. I build 527.'],
          ['5 flats first: 500.', function (t) { return t.add('h', 5, 400); }],
          ['2 rods: 510, 520.', function (t) { return t.add('t', 2, 380); }],
          ['7 cubes: 521 ... 527. Not 5 + 2 + 7.', function (t) { return t.add('o', 7, 260); }]
        ]),
        try: { tool: 'base10', opts: b10({ controls: true }), tasks: [
          { do: 'Build <b>352</b>.', goal: function (s) { return s.value === 352 && s.t < 10 && s.o < 10; }, yes: '3 hundreds, 5 tens and 2 ones.' },
          { do: 'Build <b>871</b>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 871 && s.t < 10 && s.o < 10; }, yes: '8 hundreds, 7 tens and 1 one.' }
        ] },
        together: [tgBuild(1), tgBuild(2), tgBuild(3)],
        mistake: '<p>Counting every block as 1 (5 flats, 2 rods and 7 cubes = 14), or writing the cubes before the rods. Count flats by hundreds, rods by tens, then cubes.</p>',
        check: [ck('n3-blocks', 'plain', 1), ck('n3-blocks', 'fill', 1), ck('n3-blocks', 'tap', 2), ck('n3-blocks', 'story', 2), ck('n3-blocks', 'plain', 3)] },

      { id: 'value', title: 'A digit\'s place gives its value', exp: ['B1.5'], skill: 'n3-value',
        watch: clip(chartV, { n: 555, hl: -1, vals: false }, [
          ['Three 5s.'],
          ['Ones: worth <b>5</b>.', { hl: 2, vals: true }],
          ['Tens: worth <b>50</b>.', { hl: 1 }],
          ['Hundreds: worth <b>500</b>.', { hl: 0 }]
        ]),
        example: clip(chartV, { n: 382, hl: -1, vals: false }, [
          ['My turn. What is the 8 worth?'],
          ['I name its place: tens.', { hl: 1 }],
          ['8 tens is <b>80</b>. Not 8.', { vals: true }]
        ]),
        together: [tgValue(1), tgValue(2), tgValue(3)],
        mistake: '<p>Saying the 8 in 382 is worth 8. Ask for the place first ("tens"), then the value ("8 tens, 80").</p>',
        check: [ck('n3-value', 'plain', 1), ck('n3-value', 'tap', 1), ck('n3-value', 'story', 2), ck('n3-value', 'mc', 2), ck('n3-value', 'plain', 3)] },

      { id: 'zero', title: 'Zero holds a place', exp: ['B1.1'], skill: 'n3-zero',
        watch: tool('base10', b10({}), [
          ['3 flats.', function (t) { return t.add('h', 3, 400); }],
          ['No rods. 5 cubes.', function (t) { return t.add('o', 5, 300); }],
          ['0 tens: <b>305</b>, not 35.', function (t) { return t.pulseCol('t'); }]
        ]),
        example: clip(chartV, { n: 350, hl: -1, vals: true }, [
          ['My turn. Three hundred fifty.'],
          ['5 tens, no ones: <b>350</b>.', { hl: 2 }],
          ['Three hundred five has no tens: <b>305</b>.', { n: 305, hl: 1 }]
        ]),
        together: [tgZero(1), tgZero(2), tgZero(3)],
        mistake: '<p>Writing three hundred five as 35 or 3005. Use a place value chart and write a digit in every place, 0 for an empty one.</p>',
        check: [ck('n3-zero', 'plain', 1), ck('n3-zero', 'words', 1), ck('n3-zero', 'chart', 2), ck('n3-zero', 'mc', 2), ck('n3-zero', 'words', 3)] }
    ] },

    { id: 'write', title: 'Writing numbers', sub: 'Expanded form, words, and trading.', concepts: [
      { id: 'expanded', title: 'Standard and expanded form', exp: ['B1.1'], skill: 'n3-forms',
        watch: clip(formV, { n: 352, show: false }, [
          ['352: 3 hundreds, 5 tens, 2 ones.'],
          ['Each digit drops to its value.', { show: true }],
          ['352 = <b>300 + 50 + 2</b>.']
        ]),
        example: clip(formV, { n: 607, show: false }, [
          ['My turn. 607.'],
          ['I write each value.', { show: true }],
          ['No tens, so I leave that part out: <b>600 + 7</b>.']
        ]),
        try: { tool: 'base10', opts: b10({ controls: true, expanded: true }), tasks: [
          { do: 'Build <b>500 + 30 + 6</b>.', goal: function (s) { return s.value === 536 && s.t < 10 && s.o < 10; }, yes: '536.' },
          { do: 'Build <b>900 + 4</b>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 904 && s.o < 10; }, yes: '904. The 0 holds the tens place.' }
        ] },
        together: [tgForms(1), tgForms(2), tgForms(3)],
        mistake: '<p>Writing 300 + 50 + 2 as "300502". Each part is a value to add. Build it with blocks and read the number.</p>',
        check: [ck('n3-forms', 'plain', 1), ck('n3-forms', 'fill', 1), ck('n3-forms', 'story', 2), ck('n3-forms', 'match', 2), ck('n3-forms', 'plain', 3)] },

      { id: 'words', title: 'Numbers in words', exp: ['B1.1'], skill: 'n3-words',
        watch: clip(wordsV, { n: 645, w: '' }, [
          ['645.'],
          ['Hundreds: "six hundred".', { w: 'six hundred' }],
          ['Then 45: "six hundred forty-five".', { w: 'six hundred forty-five' }]
        ]),
        example: clip(wordsV, { n: 413, w: '' }, [
          ['My turn. 413.'],
          ['"Four hundred", then 13.', { w: 'four hundred' }],
          ['"Four hundred thirteen". No "and".', { w: 'four hundred thirteen' }]
        ]),
        together: [tgWords(1), tgWords(2), tgWords(3)],
        mistake: '<p>Writing the digits in the order they are heard ("four hundred thirteen" as 4013), or saying "and". Split the words into the hundreds part and the rest.</p>',
        check: [ck('n3-words', 'plain', 1), ck('n3-words', 'mc', 1), ck('n3-words', 'sign', 2), ck('n3-words', 'match', 2), ck('n3-words', 'plain', 3)] },

      { id: 'trade', title: 'One number, many ways', exp: ['B1.5', 'B1.1'], skill: 'n3-trade',
        watch: tool('base10', b10({ h: 2, t: 4, o: 3 }), [
          ['243.'],
          ['Break a flat into 10 rods.', function (t) { return t.split('h'); }],
          ['1 hundred, 14 tens, 3 ones.'],
          ['Still <b>243</b>.', function (t) { return t.countAll(160); }]
        ]),
        example: tool('base10', b10({ h: 1, t: 6, o: 8 }), [
          ['My turn. 168.'],
          ['I break a rod into 10 cubes.', function (t) { return t.split('t'); }],
          ['1 hundred, 5 tens, 18 ones.'],
          ['More blocks, same number: 168.', function (t) { return t.countAll(140); }]
        ]),
        try: { tool: 'base10', opts: b10({ controls: true, h: 3, t: 1, o: 5 }), tasks: [
          { do: 'Show <b>315</b> with <b>no flats</b>.', goal: function (s) { return s.value === 315 && s.h === 0; }, yes: '31 tens and 5 ones.' },
          { do: 'Show <b>315</b> with <b>more than 9 ones</b>.', setup: function (t) { t.set(3, 1, 5); }, reset: false, goal: function (s) { return s.value === 315 && s.o > 9; }, yes: function (s) { return hto(s.h, s.t, s.o) + ': still 315.'; } }
        ] },
        together: [tgTrade(1), tgTrade(2), tgTrade(3)],
        mistake: '<p>Answering "4" to "How many tens are in 243?" (the tens digit, not all the tens), or thinking a trade changes the number. Break a flat and count the rods: 24 tens.</p>',
        check: [ck('n3-trade', 'plain', 1), ck('n3-trade', 'fill', 1), ck('n3-trade', 'tens', 2), ck('n3-trade', 'mc', 2), ck('n3-trade', 'plain', 3)] }
    ] },

    { id: 'skip', title: 'Counting to 1000', sub: 'By 100s, 50s and 200s.', concepts: [
      { id: 'thousand', title: 'Ten hundreds make 1000', exp: ['B1.1', 'B1.4'], skill: 'n3-1000',
        watch: clip(gridV, { n: 0 }, [
          ['Each square is 10. One row: 100.', { n: 100 }],
          ['200, 300, 400, 500.', [{ n: 200 }, { n: 300 }, { n: 400 }, { n: 500 }]],
          ['600, 700, 800, 900.', [{ n: 600 }, { n: 700 }, { n: 800 }, { n: 900 }]],
          ['One more row: <b>1000</b>.', { n: 1000 }]
        ]),
        example: clip(gridV, { n: 650 }, [
          ['My turn. 650. How many more to 1000?'],
          ['50 fills the row: 700.', { n: 700 }],
          ['3 more rows: 1000.', [{ n: 800 }, { n: 900 }, { n: 1000 }]],
          ['50 + 300 = <b>350</b> more.']
        ]),
        try: { mount: G3.play({ state: { n: 350 }, sliders: [{ key: 'n', label: 'Fill to', min: 0, max: 1000, step: 10 }], draw: gridV,
          info: function (s) { return A.fmt(s.n) + ' needs <b>' + A.fmt(1000 - s.n) + '</b> more to make 1000.'; },
          tasks: [{ do: 'Fill the grid to <b>700</b>.', goal: function (s) { return s.n === 700; }, yes: '7 rows of 100.' },
            { do: 'Fill it to <b>1000</b>.', goal: function (s) { return s.n === 1000; }, yes: '10 rows of 100.' }] }), do: '' },
        together: [tgThousand(1), tgThousand(2), tgThousand(3)],
        mistake: '<p>Saying 1000 is 10 tens, or that 650 needs 450 more (counting 6 hundreds to 10 and ignoring the 50). Fill the row first, then count rows.</p>',
        check: [ck('n3-1000', 'plain', 1), ck('n3-1000', 'jumps', 1), ck('n3-1000', 'fill', 2), ck('n3-1000', 'mc', 2), ck('n3-1000', 'plain', 3)] },

      { id: 'by100', title: 'Count by 100s', exp: ['B1.4'], skill: 'n3-by100',
        watch: clip(hopsV, { vals: hopsTo(130, 100, 6), k: 1 }, [
          ['Start at 130.'],
          ['Jump 100: 230, 330.', [{ k: 2 }, { k: 3 }]],
          ['430, 530, 630.', [{ k: 4 }, { k: 5 }, { k: 6 }]],
          ['Only the hundreds digit changes.']
        ]),
        example: clip(hopsV, { vals: hopsTo(940, -100, 5), k: 1 }, [
          ['My turn. Back from 940.'],
          ['840, 740.', [{ k: 2 }, { k: 3 }]],
          ['640, 540. The 40 stays.', [{ k: 4 }, { k: 5 }]]
        ]),
        try: { tool: 'numberline', opts: { min: 0, max: 1000, tick: 50, every: 100, start: 200, step: 100 }, tasks: [
          { do: 'Start at 200. Jump by 100 to land on <b>700</b>.', goal: function (s) { return s.at === 700; }, yes: 'Five jumps.' }
        ] },
        together: [tgSkip(100, 1), tgSkip(100, 2), tgSkip(100, 3)],
        mistake: '<p>Changing the tens digit too (130, 240, 350), or only counting by 100s from a hundred. Point at the hundreds digit as it goes up by one each jump.</p>',
        check: [ck('n3-by100', 'plain', 1), ck('n3-by100', 'missing', 1), ck('n3-by100', 'story', 2), ck('n3-by100', 'jumps', 2), ck('n3-by100', 'plain', 3)] },

      { id: 'by50', title: 'Count by 50s', exp: ['B1.4'], skill: 'n3-by50',
        watch: clip(hopsV, { vals: hopsTo(200, 50, 7), k: 1 }, [
          ['Start at 200.'],
          ['250, 300: two jumps make 100.', [{ k: 2 }, { k: 3 }]],
          ['350, 400, 450, 500.', [{ k: 4 }, { k: 5 }, { k: 6 }, { k: 7 }]]
        ]),
        example: clip(hopsV, { vals: hopsTo(620, 50, 6), k: 1 }, [
          ['My turn. From 620.'],
          ['670, 720.', [{ k: 2 }, { k: 3 }]],
          ['770, 820, 870. Not 680: each jump is 50.', [{ k: 4 }, { k: 5 }, { k: 6 }]]
        ]),
        try: { tool: 'numberline', opts: { min: 0, max: 500, tick: 10, every: 50, start: 0, step: 50 }, tasks: [
          { do: 'Jump by 50 to reach <b>350</b>.', goal: function (s) { return s.at === 350; }, yes: '7 jumps of 50.' }
        ] },
        together: [tgSkip(50, 1), tgSkip(50, 2), tgSkip(50, 3)],
        mistake: '<p>Adding 5 or 10 instead of 50 (620, 625, 630), or getting lost after a hundred. Two jumps of 50 make 100: say "fifty, hundred" as you go.</p>',
        check: [ck('n3-by50', 'plain', 1), ck('n3-by50', 'missing', 1), ck('n3-by50', 'story', 2), ck('n3-by50', 'tf', 2), ck('n3-by50', 'plain', 3)] },

      { id: 'by200', title: 'Count by 200s', exp: ['B1.4'], skill: 'n3-by200',
        watch: clip(hopsV, { vals: hopsTo(0, 200, 6), k: 1 }, [
          ['Start at 0.'],
          ['200, 400.', [{ k: 2 }, { k: 3 }]],
          ['600, 800, 1000.', [{ k: 4 }, { k: 5 }, { k: 6 }]],
          ['Each jump is 2 hundreds.']
        ]),
        example: clip(hopsV, { vals: hopsTo(950, -200, 5), k: 1 }, [
          ['My turn. Back from 950.'],
          ['750, 550.', [{ k: 2 }, { k: 3 }]],
          ['350, 150. Not 930: the hundreds drop by 2.', [{ k: 4 }, { k: 5 }]]
        ]),
        try: { tool: 'numberline', opts: { min: 0, max: 1000, tick: 50, every: 100, start: 0, step: 200 }, tasks: [
          { do: 'Jump by 200 from 0 to <b>1000</b>. Count your jumps.', goal: function (s) { return s.at === 1000; }, yes: '5 jumps of 200.' }
        ] },
        together: [tgSkip(200, 1), tgSkip(200, 2), tgSkip(200, 3)],
        mistake: '<p>Changing the hundreds digit by 1 instead of 2 (100, 200, 300), or losing the 50 in 150, 350, 550. Count the hundreds on the blocks: two flats each jump.</p>',
        check: [ck('n3-by200', 'plain', 1), ck('n3-by200', 'missing', 1), ck('n3-by200', 'story', 2), ck('n3-by200', 'jumps', 2), ck('n3-by200', 'plain', 3)] }
    ] },

    { id: 'compare', title: 'Compare and order', sub: 'Which is greater, and how to show it.', concepts: [
      { id: 'greater', title: 'Compare from the left', exp: ['B1.2'], skill: 'n3-greater',
        watch: clip(twoCharts, { a: 601, b: 598, hl: -1, sym: '' }, [
          ['601 or 598?'],
          ['Hundreds: 6 and 5.', { hl: 0 }],
          ['6 is more: <b>601</b> is greater. Stop there.', { sym: '&gt;' }]
        ]),
        example: clip(twoCharts, { a: 739, b: 793, hl: -1, sym: '' }, [
          ['My turn. 739 or 793?'],
          ['Hundreds: 7 and 7. The same.', { hl: 0 }],
          ['Tens: 3 and 9. <b>793</b> is greater.', { hl: 1, sym: '&lt;' }]
        ]),
        together: [tgGreater(1), tgGreater(2), tgGreater(3)],
        mistake: '<p>Comparing the ones first (saying 598 is greater than 601 because 8 is more than 1). Line the numbers up in a chart and start at the hundreds.</p>',
        check: [ck('n3-greater', 'plain', 1), ck('n3-greater', 'mc', 1), ck('n3-greater', 'story', 2), ck('n3-greater', 'digits', 2), ck('n3-greater', 'plain', 3)] },

      { id: 'symbols', title: 'The symbols < and >', exp: ['B1.2'], skill: 'n3-symbols',
        watch: clip(twoCharts, { a: 406, b: 460, hl: -1, sym: '' }, [
          ['406 and 460.'],
          ['Tens decide: 0 and 6.', { hl: 1 }],
          ['The open side faces 460: <b>406 &lt; 460</b>.', { sym: '&lt;' }]
        ]),
        example: clip(twoCharts, { a: 582, b: 528, hl: -1, sym: '' }, [
          ['My turn. 582 and 528.'],
          ['Tens: 8 and 2. 582 is greater.', { hl: 1 }],
          ['Open towards 582: <b>582 &gt; 528</b>. Read it: "is greater than".', { sym: '&gt;' }]
        ]),
        together: [tgSym(1), tgSym(2), tgSym(3)],
        mistake: '<p>Reading &lt; and &gt; backwards. Have the child read the sentence aloud, left to right ("406 is less than 460"), and check that it is true.</p>',
        check: [ck('n3-symbols', 'plain', 1), ck('n3-symbols', 'tf', 1), ck('n3-symbols', 'read', 2), ck('n3-symbols', 'pick', 2), ck('n3-symbols', 'plain', 3)] },

      { id: 'order', title: 'Put numbers in order', exp: ['B1.2'], skill: 'n3-order',
        watch: clip(marksV, { vals: [299, 302, 290], show: [] }, [
          ['299, 302, 290.'],
          ['290 is furthest left: least.', { show: [290] }],
          ['Then 299.', { show: [290, 299] }],
          ['302 is greatest: <b>290, 299, 302</b>.', { show: [290, 299, 302] }]
        ]),
        example: clip(marksV, { vals: [515, 490, 509], show: [] }, [
          ['My turn. 515, 490, 509.'],
          ['490 has 4 hundreds: least.', { show: [490] }],
          ['509 then 515: <b>490, 509, 515</b>.', { show: [490, 509, 515] }]
        ]),
        together: [tgOrder(1), tgOrder(2), tgOrder(3)],
        mistake: '<p>Ordering by the last digit, or thinking 490 is more than 509 because 9 is big. Mark the numbers on a number line and read them left to right.</p>',
        check: [ck('n3-order', 'plain', 1), ck('n3-order', 'least', 1), ck('n3-order', 'line', 2), ck('n3-order', 'between', 2), ck('n3-order', 'plain', 3)] }
    ] },

    { id: 'round', title: 'Rounding', sub: 'The closest ten or hundred.', concepts: [
      { id: 'nearest10', title: 'Round to the nearest ten', exp: ['B1.3'], skill: 'n3-round10',
        watch: clip(hillV, { n: 70, p: 10 }, [
          ['A hill from 70 to 80. The top is 75.'],
          ['74 is before the top: it rolls to <b>70</b>.', { n: 74 }],
          ['77 is past the top: <b>80</b>.', { n: 77 }],
          ['75, the top, rounds up: <b>80</b>.', { n: 75 }]
        ]),
        example: clip(hillV, { n: 340, p: 10 }, [
          ['My turn. 346: between 340 and 350.'],
          ['Past 345: <b>350</b>.', { n: 346 }],
          ['342 is before it: <b>340</b>. Not 300.', { n: 342 }]
        ]),
        together: [tgRound(10, 1), tgRound(10, 2), tgRound(10, 3)],
        mistake: '<p>Rounding 75 down, or rounding 346 to 300 (the nearest hundred). Find the two tens first, then ask: before or past halfway?</p>',
        check: [ck('n3-round10', 'plain', 1), ck('n3-round10', 'tap', 1), ck('n3-round10', 'fill', 2), ck('n3-round10', 'story', 2), ck('n3-round10', 'plain', 3)] },

      { id: 'nearest100', title: 'Round to the nearest hundred', exp: ['B1.3'], skill: 'n3-round100',
        watch: clip(hillV, { n: 400, p: 100 }, [
          ['A hill from 400 to 500. The top is 450.'],
          ['432: before the top. <b>400</b>.', { n: 432 }],
          ['451: past the top. <b>500</b>.', { n: 451 }],
          ['450 rounds up too: <b>500</b>.', { n: 450 }]
        ]),
        example: clip(hillV, { n: 900, p: 100 }, [
          ['My turn. 962: between 900 and 1000.'],
          ['Past 950: <b>1000</b>.', { n: 962 }],
          ['949 is just before: <b>900</b>.', { n: 949 }]
        ]),
        try: { mount: G3.play({ state: { n: 632, p: 100 }, sliders: [{ key: 'n', label: 'Number', min: 100, max: 999 }],
          draw: hillV, info: function (s) { return A.fmt(s.n) + ' rounds to <b>' + A.fmt(roundTo(s.n, 100)) + '</b>'; },
          tasks: [{ do: 'Find a number <b>less than 700</b> that rounds to 700.', goal: function (s) { return s.n < 700 && s.n >= 650; }, yes: function (s) { return s.n + ' is past the top of the hill.'; } },
            { do: 'Find a number that rounds <b>down</b> to 300.', goal: function (s) { return s.n > 300 && s.n < 350; }, yes: function (s) { return s.n + ' rolls back to 300.'; } }] }), do: '' },
        together: [tgRound(100, 1), tgRound(100, 2), tgRound(100, 3)],
        mistake: '<p>Looking at the ones digit (rounding 449 up because of the 9), or rounding 950 to 900. For hundreds, look only at the tens digit. Halfway rounds up.</p>',
        check: [ck('n3-round100', 'plain', 1), ck('n3-round100', 'tap', 1), ck('n3-round100', 'fill', 2), ck('n3-round100', 'tf', 2), ck('n3-round100', 'plain', 3)] },

      { id: 'mix', title: 'Ten or hundred?', exp: ['B1.3'], skill: 'n3-roundmix',
        watch: clip(hillV, { n: 347, p: 10 }, [
          ['347 to the nearest ten: <b>350</b>.'],
          ['To the nearest hundred: <b>300</b>.', { p: 100 }],
          ['Same number, two answers. Check which one is asked.']
        ]),
        example: clip(hillV, { n: 862, p: 100 }, [
          ['My turn. 862 to the nearest hundred: <b>900</b>.'],
          ['To the nearest ten: <b>860</b>. Not 900.', { p: 10 }]
        ]),
        together: [tgMix(1), tgMix(2), tgMix(3)],
        mistake: '<p>Using the same digit for both kinds of rounding. Nearest ten: look at the ones. Nearest hundred: look at the tens. Underline the place you round to first.</p>',
        check: [ck('n3-roundmix', 'plain', 1), ck('n3-roundmix', 'num', 1), ck('n3-roundmix', 'which', 2), ck('n3-roundmix', 'tf', 2), ck('n3-roundmix', 'plain', 3)] }
    ] }
  ];

  A.register(CH, {
    full: true,
    lessons: LESSONS,
    quiz: [
      { q: 'What is the underlined digit worth? ' + math(u(482, 0)), type: 'num', answer: 400, fig: chart(482, { hl: 0 }),
        hint: 'Which place is the 4 in?', explain: '4 hundreds: 400.', meta: { k: 'g3n-val', n: 482, i: 0 } },
      { q: 'What number do the blocks show?', type: 'num', answer: 365, fig: blk(365),
        hint: 'Flats are hundreds, rods are tens, cubes are ones.', explain: '3 hundreds, 6 tens and 5 ones: 365.', meta: { k: 'g3n-read', h: 3, t: 6, o: 5 } },
      { q: 'Write <b>six hundred seven</b> as a number.', type: 'num', answer: 607,
        hint: 'There are no tens. What digit goes there?', explain: '6 hundreds, 0 tens, 7 ones: 607.', meta: { k: 'g3n-words', w: 'six hundred seven' } },
      { q: 'Count by 50s. What comes next? ' + math('350, 400, 450, ___'), type: 'num', answer: 500, fig: hops([350, 400, 450, 500], 3),
        hint: 'Add 50 to 450.', explain: '450 + 50 = 500.', meta: { k: 'g3n-skipnext', start: 350, by: 50, dir: 1, j: 3 } },
      { q: 'Which is greater, ' + math(509) + ' or ' + math(590) + '? Type it.', type: 'num', answer: 590, fig: chart(509, { dots: false }) + chart(590, { dots: false }),
        hint: 'The hundreds are the same. Compare the tens.', explain: '9 tens is more than 0 tens: 590.', meta: { k: 'g3n-max', a: 509, b: 590 } },
      { q: 'Round ' + math(247) + ' to the nearest hundred.', type: 'num', answer: 200, fig: hill(247, 100),
        hint: 'Before or past the top of the hill?', explain: 'The tens digit is 4: round down to 200.', meta: { k: 'g3n-round', n: 247, p: 100 } },
      { q: 'What number is <b>3 hundreds, 14 tens and 2 ones</b>?', type: 'num', answer: 442, fig: pileOf(3, 14, 2),
        hint: '14 tens is 140.', explain: '300 + 140 + 2 = 442.', meta: { k: 'g3n-read', h: 3, t: 14, o: 2 } }
    ],
    practice: SKILLS.map(function (s) { return { id: s.id, name: s.name, code: s.code, gen: DEF[s.id][0][2] }; })
  });

  /* every skill's other shapes (docs/QUESTIONS.md); each skill keeps its first way of asking as "plain" */
  var SHAPES = {};
  SKILLS.forEach(function (s) { SHAPES[s.id] = DEF[s.id].slice(1); });
  Q.shapes(CH, SHAPES);
})();
