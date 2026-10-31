(function () {
  var A = Atlas, R = A.R;
  var ones = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  var tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  function b1000(n) {
    var s = '';
    if (n >= 100) { s += ones[Math.floor(n / 100)] + ' hundred'; n %= 100; if (n) s += ' '; }
    if (n >= 20) { s += tens[Math.floor(n / 10)]; if (n % 10) s += '-' + ones[n % 10]; }
    else if (n > 0) s += ones[n];
    return s;
  }
  /* word form up to one million */
  function words(n) {
    if (n === 0) return 'zero';
    var m = Math.floor(n / 1e6), th = Math.floor(n / 1000) % 1000, on = n % 1000, out = [];
    if (m) out.push(b1000(m) + ' million');
    if (th) out.push(b1000(th) + ' thousand');
    if (on) out.push(b1000(on));
    return out.join(' ');
  }
  var heads = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten thousands', 'Hundred thousands', 'Millions'];
  var shortH = ['Ones', 'Tens', 'Hund.', 'Thous.', 'Ten th.', 'Hund. th.', 'Mill.'];

  /* small unlabelled disks in a 3 by 3 grid, for the inside of a chart column */
  function dots(d, p) {
    if (!d) return '';
    var s = '';
    for (var i = 0; i < d; i++) s += A.draw.disk(7 + (i % 3) * 13, 7 + Math.floor(i / 3) * 13, 5.5, p);
    return A.svg(40, 40, s, d + ' disk' + (d > 1 ? 's' : ''));
  }
  /* place value chart with coloured headings. o.cols columns, o.hl highlights a column, o.vals shows values */
  function chart(n, o) {
    o = o || {};
    var s = String(n), cols = o.cols || s.length;
    while (s.length < cols) s = '0' + s;
    var lead = cols - String(n).length, h = '<div class="pv"' + (cols < 6 ? ' style="max-width:' + (cols * 92) + 'px;margin:8px auto"' : '') + '>';
    for (var i = 0; i < cols; i++) {
      var p = cols - 1 - i, d = +s.charAt(i), dim = i < lead;
      h += '<div' + (i === o.hl ? ' class="on"' : '') + '><span class="h c' + p + '"><span class="lg">' + heads[p] + '</span><span class="sm">' + shortH[p] + '</span></span><span class="d' + (dim ? ' dim' : '') + '">' + d + '</span>' +
        (o.dots === false ? '' : '<span class="dk">' + (dim ? '' : dots(d, p)) + '</span>') +
        (o.vals ? '<span class="v">' + (dim || !d ? '' : A.fmt(d * Math.pow(10, p))) + '</span>' : '') + '</div>';
    }
    return h + '</div>';
  }
  /* the number in big coloured digits, split into periods of three, with the words for each period */
  function periods(n) {
    var s = String(n), groups = [], names = ['ones', 'thousands', 'millions'], out = '', cw = 28, gap = 36;
    for (var e = s.length; e > 0; e -= 3) groups.unshift(s.slice(Math.max(0, e - 3), e));
    var gw = groups.map(function (g) { return Math.max(g.length * cw, 84); }), total = gw.reduce(function (a, b) { return a + b; }, 0) + gap * (groups.length - 1);
    var said = [];
    groups.forEach(function (g, gi) { var per = groups.length - 1 - gi; if (+g) said.push(b1000(+g) + (per ? ' ' + names[per].slice(0, -1) : '')); });
    var line = said.join(' + ') || 'zero', W = Math.max(total + 20, line.length * 8.6 + 20), x = (W - total) / 2, len = s.length, k = 0;
    groups.forEach(function (g, gi) {
      var cx = x + gw[gi] / 2, per = groups.length - 1 - gi, x1 = cx - g.length * cw / 2;
      for (var i = 0; i < g.length; i++, k++) out += '<text x="' + (x1 + cw * (i + 0.5)) + '" y="44" text-anchor="middle" font-size="42" font-weight="700" style="font-family:var(--display);fill:var(--p' + (len - 1 - k) + ')">' + g.charAt(i) + '</text>';
      var bx1 = cx - gw[gi] / 2 + 6, bx2 = cx + gw[gi] / 2 - 6;
      out += '<path d="M' + bx1 + ' 56 q0 8 8 8 H' + (cx - 7) + ' q7 0 7 8 q0 -8 7 -8 H' + (bx2 - 8) + ' q8 0 8 -8" fill="none" style="stroke:var(--ink2)" stroke-width="2"/>' +
        '<text x="' + cx + '" y="92" text-anchor="middle" font-size="17" class="t2">' + names[per] + '</text>';
      x += gw[gi] + gap;
    });
    out += '<text x="' + W / 2 + '" y="120" text-anchor="middle" font-size="16" font-weight="700">' + line.replace(/ \+ /g, ',  ') + '</text>';
    return A.svg(Math.ceil(W), 130, out, A.fmt(n) + ' is read ' + words(n));
  }
  /* a million as 100 squares of 10 000, filled up to n */
  function million(n) {
    var sz = 22, s = '', full = Math.floor(n / 10000), part = (n % 10000) / 10000;
    for (var i = 0; i < 100; i++) {
      var x = 84 + (i % 10) * sz, y = 6 + Math.floor(i / 10) * sz;
      s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:var(--card);stroke:var(--line)" stroke-width="1"/>';
      if (i < full) s += '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + (sz - 3) + '" height="' + (sz - 3) + '" rx="2" style="fill:var(--strand)"/>';
      else if (i === full && part > 0) s += '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + ((sz - 3) * part).toFixed(1) + '" height="' + (sz - 3) + '" rx="2" style="fill:var(--strand);opacity:.55"/>';
    }
    for (var r = 1; r <= 10; r++) s += '<text x="78" y="' + (6 + r * sz - 5) + '" text-anchor="end" font-size="14" class="t2">' + A.fmt(r * 100000) + '</text>';
    s += '<rect x="318" y="10" width="18" height="18" rx="2" style="fill:var(--strand)"/><text x="342" y="25" font-size="16">= 10 000</text>' +
      '<text x="318" y="58" font-size="16">a row of 10</text><text x="318" y="78" font-size="16">= 100 000</text>' +
      '<text x="318" y="110" font-size="16">all 100</text><text x="318" y="130" font-size="16" class="tb">= 1 000 000</text>';
    return A.svg(416, 232, s, A.fmt(n) + ' shown as ' + full + ' of 100 squares, each worth 10 000');
  }

  /* ---- integers ---- */
  function col(v) { return v < 0 ? 'var(--neg)' : v > 0 ? 'var(--pos)' : 'var(--ink)'; }
  function sgn(v) { return v < 0 ? '&minus;' + Math.abs(v) : String(v); }
  /* horizontal number line from a to b. marks: [{v, lab}] */
  function iline(a, b, marks, label, step) {
    var W = 560, x0 = 24, x1 = 536, n = b - a, s = '<g transform="translate(0 8)">';
    step = step || 1;
    function X(v) { return x0 + (x1 - x0) * (v - a) / n; }
    if (a < 0) s += '<rect x="' + x0 + '" y="26" width="' + (X(Math.min(0, b)) - x0) + '" height="8" style="fill:color-mix(in srgb,var(--neg) 30%,transparent)"/>';
    if (b > 0) s += '<rect x="' + X(Math.max(0, a)) + '" y="26" width="' + (x1 - X(Math.max(0, a))) + '" height="8" style="fill:color-mix(in srgb,var(--pos) 30%,transparent)"/>';
    s += '<line x1="' + (x0 - 12) + '" y1="30" x2="' + (x1 + 12) + '" y2="30" style="stroke:var(--ink)" stroke-width="2"/>' +
      '<path d="M' + (x0 - 16) + ' 30 l8 -5 v10z M' + (x1 + 16) + ' 30 l-8 -5 v10z" style="fill:var(--ink)"/>';
    var every = n > 24 ? 5 : n > 12 ? 2 : 1;
    for (var v = a; v <= b; v += step) {
      var x = X(v), big = v % (every * step) === 0 || v === 0;
      s += '<line x1="' + x + '" y1="' + (big ? 20 : 24) + '" x2="' + x + '" y2="' + (big ? 40 : 36) + '" style="stroke:var(--ink)" stroke-width="' + (v === 0 ? 3 : 1.5) + '"/>';
      if (big) s += '<text x="' + x + '" y="62" text-anchor="middle" font-size="18" style="fill:' + col(v) + '" font-weight="' + (v === 0 ? 700 : 400) + '">' + (v < 0 ? '−' + -v : v) + '</text>';
    }
    (marks || []).forEach(function (m, i) {
      var x = X(m.v);
      s += '<circle cx="' + x + '" cy="30" r="8" style="fill:' + (m.c || 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>';
      if (m.lab) s += '<text x="' + x + '" y="' + (i % 2 ? 90 : 12) + '" text-anchor="middle" font-size="17" class="tb">' + m.lab + '</text>';
    });
    s += '</g>';
    return A.svg(W, (marks || []).length > 1 ? 104 : 78, s, label || 'Number line from ' + a + ' to ' + b);
  }
  /* thermometer from -30 to 30 degrees with the liquid at t */
  function thermo(t) {
    var top = 14, bot = 254, lo = -30, hi = 30, s = '';
    function Y(v) { return bot - (bot - top) * (v - lo) / (hi - lo); }
    s += '<rect x="60" y="' + (top - 8) + '" width="26" height="' + (bot - top + 16) + '" rx="13" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/>';
    s += '<circle cx="73" cy="' + (bot + 22) + '" r="20" style="fill:' + col(t) + ';stroke:var(--ink)" stroke-width="2"/>';
    s += '<rect x="66" y="' + Y(t) + '" width="14" height="' + (bot + 10 - Y(t)) + '" style="fill:' + col(t) + '"/>';
    for (var v = lo; v <= hi; v += 5) {
      var y = Y(v);
      s += '<line x1="88" y1="' + y + '" x2="' + (v % 10 ? 98 : 104) + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="' + (v === 0 ? 3 : 1.5) + '"/>';
      if (v % 10 === 0) s += '<text x="110" y="' + (y + 5) + '" font-size="13" style="fill:' + col(v) + '"' + (v === 0 ? ' font-weight="700"' : '') + '>' + (v < 0 ? '−' + -v : v) + '&deg;C</text>';
    }
    s += '<line x1="40" y1="' + Y(0) + '" x2="160" y2="' + Y(0) + '" style="stroke:var(--ink2)" stroke-dasharray="4 4"/><text x="164" y="' + (Y(0) + 4) + '" font-size="12" class="t2">freezing</text>';
    s += '<path d="M48 ' + Y(t) + ' l-10 -6 v12z" style="fill:var(--hi);stroke:var(--ink)"/>';
    return A.svg(230, 300, s, 'Thermometer showing ' + (t < 0 ? 'minus ' + -t : t) + ' degrees Celsius');
  }

  /* ---- divisibility ---- */
  function dsum(n) { return String(n).split('').reduce(function (a, c) { return a + +c; }, 0); }
  function rule(n, d) {
    var s = String(n), last = +s.slice(-1), l2 = n % 100, l3 = n % 1000, ds = dsum(n), ok = n % d === 0, why;
    if (d === 2) why = 'The last digit is ' + last + (last % 2 ? ', which is odd.' : ', which is even.');
    else if (d === 5) why = 'The last digit is ' + last + (last === 0 || last === 5 ? '.' : ', not 0 or 5.');
    else if (d === 10) why = 'The last digit is ' + last + (last ? ', not 0.' : '.');
    else if (d === 3) why = 'The digits add to ' + ds + (ds % 3 ? ', which is not a multiple of 3.' : ', which is a multiple of 3.');
    else if (d === 9) why = 'The digits add to ' + ds + (ds % 9 ? ', which is not a multiple of 9.' : ', which is a multiple of 9.');
    else if (d === 4) why = 'The last two digits make ' + l2 + (l2 % 4 ? ', which is not a multiple of 4.' : ', which is a multiple of 4.');
    else if (d === 8) why = 'The last three digits make ' + l3 + (l3 % 8 ? ', which is not a multiple of 8.' : ', which is a multiple of 8.');
    else why = (n % 2 ? 'It is odd, so it fails the rule for 2.' : 'It is even.') + ' ' + (ds % 3 ? 'The digits add to ' + ds + ', so it fails the rule for 3.' : 'The digits add to ' + ds + ', a multiple of 3.');
    return { ok: ok, why: why };
  }
  var RULES = {
    2: 'the last digit is even (0, 2, 4, 6 or 8)', 3: 'the digits add up to a multiple of 3', 4: 'the last two digits make a multiple of 4',
    5: 'the last digit is 0 or 5', 6: 'it passes the rules for both 2 and 3', 8: 'the last three digits make a multiple of 8',
    9: 'the digits add up to a multiple of 9', 10: 'the last digit is 0'
  };
  /* a 1 to 100 chart with the multiples of d shaded */
  function hchart(d, mark) {
    var sz = 40, s = '';
    for (var i = 1; i <= 100; i++) {
      var x = 2 + ((i - 1) % 10) * sz, y = 2 + Math.floor((i - 1) / 10) * sz, on = i % d === 0;
      s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:' + (on ? 'color-mix(in srgb,var(--strand) 70%,var(--card))' : 'var(--card)') + ';stroke:var(--line)"/>' +
        '<text x="' + (x + sz / 2) + '" y="' + (y + 26) + '" text-anchor="middle" font-size="15"' + (on ? ' style="fill:#fff" font-weight="700"' : '') + '>' + i + '</text>';
      if (i === mark) s += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (sz - 4) + '" height="' + (sz - 4) + '" fill="none" style="stroke:var(--hi)" stroke-width="4"/>';
    }
    return A.svg(404, 404, s, 'Hundred chart with the multiples of ' + d + ' shaded');
  }

  /* ---- factors and primes ---- */
  function isPrime(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
  function factors(n) { var f = []; for (var i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; }
  function pf(n) { var f = [], p = 2; while (n > 1) { while (n % p === 0) { f.push(p); n /= p; } p++; } return f; }
  function pairs(n) { var o = []; for (var i = 2; i * i <= n; i++) if (n % i === 0) o.push([i, n / i]); return o; }
  /* split a composite number into the factor pair closest together */
  function tree(n, first) {
    if (isPrime(n) || n < 4) return { v: n };
    var pr = first || pairs(n).slice(-1)[0];
    return { v: n, k: [tree(pr[0]), tree(pr[1])] };
  }
  function treeSvg(n, first, hide) {
    var t = tree(n, first), leaves = 0, depth = 0, nodes = [], s = '', lw = 54, dy = 62;
    (function lay(nd, d) {
      depth = Math.max(depth, d);
      if (!nd.k) { nd.x = leaves++ * lw + lw / 2; }
      else { lay(nd.k[0], d + 1); lay(nd.k[1], d + 1); nd.x = (nd.k[0].x + nd.k[1].x) / 2; }
      nd.d = d; nodes.push(nd);
    })(t, 0);
    var W = Math.max(leaves * lw, 120), off = 0;
    nodes.forEach(function (nd) { nd.y = 26 + nd.d * dy; });
    nodes.forEach(function (nd) {
      if (nd.k) nd.k.forEach(function (c) { s += '<line x1="' + nd.x + '" y1="' + (nd.y + 14) + '" x2="' + c.x + '" y2="' + (c.y - 16) + '" style="stroke:var(--ink2)" stroke-width="2"/>'; });
    });
    var li = 0;
    nodes.forEach(function (nd) {
      var prime = !nd.k, txt = String(nd.v);
      if (prime) { var hid = hide === li++; s += '<circle cx="' + nd.x + '" cy="' + nd.y + '" r="18" style="fill:' + (hid ? 'var(--card)' : 'color-mix(in srgb,var(--hi) 55%,var(--card))') + ';stroke:var(--ink)" stroke-width="2"' + (hid ? ' stroke-dasharray="4 3"' : '') + '/>'; if (hid) txt = '?'; }
      s += '<text x="' + nd.x + '" y="' + (nd.y + 6) + '" text-anchor="middle" font-size="' + (txt.length > 3 ? 15 : 17) + '" font-weight="700">' + txt + '</text>';
    });
    return { svg: A.svg(W + off, 26 + depth * dy + 26, s, 'Factor tree for ' + n + '. The primes at the ends of the branches are ' + pf(n).join(', ') + '.'), leaves: leaves };
  }
  function times(arr) { return arr.join(' &times; '); }
  /* an array of dots, r rows by c columns, for factor pairs */
  function arr(r, c, u) {
    u = u || 14; var s = '';
    for (var i = 0; i < r; i++) for (var j = 0; j < c; j++) s += '<rect x="' + (2 + j * u) + '" y="' + (2 + i * u) + '" width="' + (u - 2) + '" height="' + (u - 2) + '" rx="2" style="fill:var(--strand)"/>';
    return A.svg(c * u + 4, r * u + 4, s, r + ' rows of ' + c);
  }

  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var CH = 'numbers-integers', g = G6.g, lab = G6.lab, play = G6.play;
  var LESSONS = [
    { id: 'big', title: 'Numbers up to one million', sub: 'places, periods and reading big numbers', concepts: [
      { id: 'places', title: 'Each place is 10 times bigger', exp: ['B1.1'], skill: 'ni-value',
        body: '<p>Move one place to the left and the value is <b>10 times</b> bigger. After hundred thousands comes a new place: <b>millions</b>.</p>',
        watch: play([
          ['One thousand: a 1 in the thousands place.', chart(1000, { vals: true, cols: 7 })],
          ['Times 10: ten thousand. The 1 moves one place left.', chart(10000, { vals: true, cols: 7 })],
          ['Times 10 again: one hundred thousand.', chart(100000, { vals: true, cols: 7 })],
          ['Ten hundred thousands make one million.', chart(1000000, { vals: true, cols: 7 })],
          ['A million is 100 squares of 10 000.', million(1000000)]
        ]),
        try: lab(CH, 0, 'Slide or type to build a number. Can you make exactly <b>500 000</b>?', function (h) { return +h.querySelector('#nmn').value === 500000 || +h.querySelector('#nmr').value === 500000; }, 'Yes: 5 hundred thousands, half of a million.'),
        key: '<p>Find the place, then the value. A 7 in the ten thousands place is worth 70 000.</p>',
        mistake: '<p>Writing four-digit numbers with a space (5 832). In Canada only numbers of 5 or more digits get a space: 5832, but 58 320.</p>',
        check: [g(CH, 'ni-value', 1), g(CH, 'ni-value', 2)] },
      { id: 'periods', title: 'Read big numbers in periods', exp: ['B1.1'], skill: 'ni-words',
        body: '<p>Big numbers are read in groups of three digits called <b>periods</b>: millions, thousands and ones. Read each group like a small number, then say its period name.</p>',
        watch: play([
          ['Split 607 050 into periods of three, from the right.', periods(607050)],
          ['Read the thousands period: six hundred seven thousand.', periods(607000)],
          ['Then the ones period: fifty.', periods(607050), '<span class="math">six hundred seven thousand fifty</span>'],
          ['Another one: 1 250 300.', periods(1250300), '<span class="math">one million two hundred fifty thousand three hundred</span>']
        ]),
        hard: true,
        ways: [
          { label: 'Cover and read', html: '<p>Cover the ones period with your finger. Read what is left: <b>450</b> thousand. Uncover and read the rest: <b>302</b>. So 450 302 is four hundred fifty thousand three hundred two.</p><div class="fig">' + periods(450302) + '</div>' },
          { label: 'Zeros are silent', html: '<p>A period of zeros is not read at all. 3 000 040 is "three million forty". Nothing is said for the thousands period.</p><div class="fig">' + periods(3000040) + '</div>' }
        ],
        key: '<p>Read one period at a time from the left. Say the period name after each group, except the ones period.</p>',
        mistake: '<p>Saying "and" or the word "ones" (four hundred fifty thousand <i>and</i> three hundred two <i>ones</i>). Neither is said. "And" is kept for decimals.</p>',
        check: [g(CH, 'ni-words', 1), g(CH, 'ni-words', 2)] }
    ] },
    { id: 'integers', title: 'Integers', sub: 'numbers below zero, opposites, comparing', concepts: [
      { id: 'below', title: 'Numbers below zero', exp: ['B1.2'], skill: 'ni-integers',
        body: '<p><b>Integers</b> are the whole numbers, their opposites, and zero. Numbers below zero are <b>negative</b>: <span class="negt">&minus;5</span> is read "negative five".</p>',
        watch: play([
          ['It is 6 degrees outside.', thermo(6)],
          ['The temperature drops to 0: freezing.', thermo(0)],
          ['It keeps dropping. 8 degrees below zero is negative 8.', thermo(-8), '<span class="negt">&minus;8&deg;C</span>'],
          ['On a number line, negatives are to the left of zero.', iline(-10, 10, [{ v: -8, lab: '−8', c: 'var(--neg)' }])]
        ]),
        try: lab(CH, 1, 'Slide the temperature to <b>12 degrees below zero</b>.', function (h) { return +h.querySelector('#tmr').value === -12; }, 'Yes: 12 below zero is −12°C.'),
        key: '<p>Below zero means negative. Above zero means positive. Zero is neither.</p>',
        check: [{ q: 'A diver is 12 m below the surface of the water. Which integer shows this?', type: 'mc', options: ['12', '−12', '0', '−1'], answer: 1, hint: 'Below zero means negative.', explain: 'Below the surface is below zero, so the diver is at &minus;12 m.' }, g(CH, 'ni-integers', 1)] },
      { id: 'opposites', title: 'Opposites', exp: ['B1.2'], skill: 'ni-integers',
        body: '<p><b>Opposites</b> are the same distance from zero, on opposite sides. The opposite of 4 is &minus;4.</p>',
        watch: { tool: 'numberline', opts: { min: -10, max: 10, tick: 1, every: 2, start: 0 }, steps: [
          { say: 'Start at zero.', act: function (t) { return t.moveTo(0); } },
          { say: 'Jump 4 to the right: 4.', act: function (t) { return t.hop(4, '+4'); } },
          { say: 'Back to zero, then 4 to the left: negative 4.', act: function (t) { return t.moveTo(0).then(function () { return t.hop(-4, '−4'); }); } },
          { say: '4 and −4 are opposites: both 4 steps from zero.', act: function (t) { t.mark(4, '4'); return t.mark(-4, '−4'); }, ms: 1800 }
        ] },
        try: { tool: 'numberline', opts: { min: -10, max: 10, tick: 1, every: 2, start: 0 }, tasks: [
          { do: 'Tap the opposite of <b>7</b>.', goal: function (s) { return s.at === -7; }, yes: 'Yes: −7 is 7 steps left of zero.' },
          { do: 'Tap the opposite of <b>−3</b>.', goal: function (s) { return s.at === 3; }, yes: 'Yes: the opposite of −3 is 3.' },
          { do: 'Tap the number that is its own opposite.', goal: function (s) { return s.at === 0; }, yes: 'Yes: zero is its own opposite.' }
        ] },
        key: '<p>Same distance from zero, opposite sides. Zero is its own opposite.</p>',
        check: [g(CH, 'ni-integers', 1), g(CH, 'ni-integers', 2)] },
      { id: 'compare', title: 'Comparing integers', exp: ['B1.3'], skill: 'ni-compare', hard: true,
        body: '<p>On a number line, numbers get <b>greater</b> to the right and <b>less</b> to the left. Every positive number is greater than every negative number.</p>',
        watch: play([
          ['Which is greater, −7 or −2?', iline(-10, 5, [{ v: -7, lab: '−7', c: 'var(--neg)' }, { v: -2, lab: '−2', c: 'var(--neg)' }])],
          ['−2 is further right, so it is greater.', iline(-10, 5, [{ v: -7, lab: '−7', c: 'var(--neg)' }, { v: -2, lab: '−2 is greater', c: 'var(--hi)' }]), '<span class="math">&minus;2 &gt; &minus;7</span>'],
          ['To order numbers, read them from left to right.', iline(-10, 5, [{ v: -9, lab: '−9', c: 'var(--neg)' }, { v: -5, lab: '−5', c: 'var(--neg)' }, { v: 0, lab: '0', c: 'var(--card)' }, { v: 1, lab: '1', c: 'var(--pos)' }, { v: 3, lab: '3', c: 'var(--pos)' }]), '&minus;9, &minus;5, 0, 1, 3']
        ]),
        try: lab(CH, 2, 'Pick two negative numbers. Make the <b>first</b> one the greater one.', function (h) { var a = +h.querySelector('#ica').value, b = +h.querySelector('#icb').value; return a < 0 && b < 0 && a > b; }, 'Yes: the one closer to zero is greater.'),
        ways: [
          { label: 'Think temperature', html: '<p>Which is warmer, &minus;2&deg;C or &minus;7&deg;C? &minus;2&deg;C is warmer, so &minus;2 is greater.</p><div class="row2"><div class="fig">' + thermo(-7) + '</div><div class="fig">' + thermo(-2) + '</div></div>' },
          { label: 'Think money', html: '<p>Owing $2 is better than owing $7. So &minus;2 &gt; &minus;7. The less you owe, the more you have.</p>' }
        ],
        key: '<p>Further right is greater. For two negatives, the one closer to zero is greater.</p>',
        mistake: '<p>Thinking &minus;8 is bigger than &minus;3 because 8 is bigger than 3. On the number line &minus;8 is further <b>left</b>, so it is less. Ask "which is colder?"</p>',
        check: [{ q: 'Which is colder: <span class="math">&minus;15&deg;C</span> or <span class="math">&minus;11&deg;C</span>?', type: 'mc', options: ['−15°C', '−11°C', 'They are the same'], answer: 0, hint: 'Further left is less. Which is further from zero on the cold side?', explain: '&minus;15 is further left than &minus;11, so &minus;15&deg;C is colder.' }, g(CH, 'ni-compare', 1), g(CH, 'ni-compare', 2)] }
    ] },
    { id: 'divis', title: 'Divisibility rules', sub: 'check without dividing', concepts: [
      { id: 'd2510', title: 'Rules for 2, 5 and 10', exp: ['B2.2'], skill: 'ni-divis',
        body: '<p>A number is <b>divisible</b> by another if it divides with no remainder. For 2, 5 and 10, just look at the <b>last digit</b>.</p>',
        watch: play([
          ['Multiples of 2 end in 0, 2, 4, 6 or 8.', hchart(2)],
          ['Multiples of 5 end in 0 or 5.', hchart(5)],
          ['Multiples of 10 end in 0.', hchart(10)]
        ]),
        try: lab(CH, 3, 'Type a number with <b>4 or more digits</b> that is divisible by 2, 5 and 10.', function (h) { var n = +h.querySelector('#dvn').value; return n >= 1000 && n % 10 === 0; }, 'Yes: it ends in 0, so it passes all three.'),
        key: '<p>2: last digit even. 5: last digit 0 or 5. 10: last digit 0.</p>',
        check: [g(CH, 'ni-divis', 1)] },
      { id: 'd39', title: 'Rules for 3 and 9', exp: ['B2.2'], skill: 'ni-divis', hard: true,
        body: '<p>For 3 and 9, <b>add the digits</b>. If the total is a multiple of 3, the number is divisible by 3. If it is a multiple of 9, it is divisible by 9.</p>',
        watch: play([
          ['Is 471 divisible by 3?', '<p class="g6-big">471</p>'],
          ['Add the digits: 4 + 7 + 1 = 12.', '<p class="g6-big">4 + 7 + 1 = 12</p>'],
          ['12 is a multiple of 3, so 471 is divisible by 3.', '<p class="g6-big">471 &divide; 3 = 157</p>'],
          ['The multiples of 9 on a hundred chart: their digits always add to 9.', hchart(9)]
        ]),
        try: lab(CH, 3, 'Show multiples of <b>9</b>, then type a 4-digit number that is divisible by 9.', function (h) { var n = +h.querySelector('#dvn').value; return h.querySelector('#dvd').value === '9' && n >= 1000 && n <= 9999 && n % 9 === 0; }, 'Yes: its digits add to a multiple of 9.'),
        ways: [
          { label: 'Why it works', html: '<p>Each 10 is 9 + 1, each 100 is 99 + 1. So 471 = 4 &times; 99 + 7 &times; 9 + (4 + 7 + 1). The 99s and 9s already divide by 3 and 9. Only the digit sum is left to check.</p>' },
          { label: 'Keep adding', html: '<p>For a big total, add again. 98 784: 9 + 8 + 7 + 8 + 4 = 36, and 3 + 6 = 9. So 98 784 is divisible by 9 (and by 3).</p>' }
        ],
        key: '<p>3 and 9: add the digits. The total tells you.</p>',
        mistake: '<p>Using the "add the digits" rule for 4 or 8. Adding digits only works for 3 and 9.</p>',
        check: [{ q: 'Is <span class="math">7452</span> divisible by 9?', type: 'mc', options: ['Yes', 'No'], answer: 0, hint: 'Add the digits. Is the total a multiple of 9?', explain: '7 + 4 + 5 + 2 = 18, a multiple of 9. 7452 &divide; 9 = 828.' }, g(CH, 'ni-divis', 2)] },
      { id: 'd468', title: 'Rules for 4, 6 and 8', exp: ['B2.2'], skill: 'ni-divis',
        body: '<p>For 4, look at the <b>last two digits</b>. For 8, the <b>last three</b>. For 6, the number must pass the rules for <b>both 2 and 3</b>.</p>',
        watch: play([
          ['Is 3716 divisible by 4? Look at the last two digits: 16.', '<p class="g6-big">37<b style="color:var(--strand)">16</b></p>'],
          ['16 = 4 × 4, so yes.', '<p class="g6-big">3716 &divide; 4 = 929</p>'],
          ['Is 354 divisible by 6? It is even, and 3 + 5 + 4 = 12.', '<p class="g6-big">354: even &#10003; &nbsp; 12 &#10003;</p>'],
          ['Both rules pass, so 354 is divisible by 6.', '<p class="g6-big">354 &divide; 6 = 59</p>']
        ]),
        try: lab(CH, 3, 'Show multiples of <b>6</b> and test a number of your own.', function (h) { return h.querySelector('#dvd').value === '6'; }, 'The shaded squares are the numbers that pass for both 2 and 3.'),
        key: '<p>4: last two digits. 8: last three digits. 6: both 2 and 3.</p>',
        check: [g(CH, 'ni-divis', 2), g(CH, 'ni-divis', 3)] }
    ] },
    { id: 'factors', title: 'Factors and primes', sub: 'pairs, primes and factor trees', concepts: [
      { id: 'pairs', title: 'Factors and multiples', exp: ['B2.6'], skill: 'ni-primes',
        body: '<p><b>Factors</b> multiply to make a number. <b>Multiples</b> are what you get when you multiply a number. Factor pairs make rectangles.</p>',
        watch: play([
          ['12 squares in one row: 1 × 12.', arr(1, 12, 22)],
          ['Two rows of 6: 2 × 6.', arr(2, 6, 22)],
          ['Three rows of 4: 3 × 4.', arr(3, 4, 22), 'Factors of 12: 1, 2, 3, 4, 6, 12'],
          ['Multiples of 12 go on forever.', '<p class="g6-big">12, 24, 36, 48, &hellip;</p>']
        ]),
        ways: [{ label: 'Factors vs multiples', html: '<div class="tbl"><table><thead><tr><th class="l"></th><th class="l">Factors of 12</th><th class="l">Multiples of 12</th></tr></thead><tbody><tr><td class="l">What</td><td class="l">divide 12 evenly</td><td class="l">12 times 1, 2, 3, &hellip;</td></tr><tr><td class="l">List</td><td class="l">1, 2, 3, 4, 6, 12</td><td class="l">12, 24, 36, &hellip;</td></tr><tr><td class="l">How many</td><td class="l">a short list</td><td class="l">forever</td></tr></tbody></table></div>' }],
        key: '<p>Factors are small and few. Multiples are big and never end.</p>',
        mistake: '<p>Mixing up factors and multiples. Ask: "does it go <b>into</b> 12 (factor) or does 12 go into it (multiple)?"</p>',
        check: [g(CH, 'ni-primes', 1)] },
      { id: 'primes', title: 'Prime or composite', exp: ['B2.6'], skill: 'ni-primes',
        body: '<p>A <b>prime number</b> has exactly two factors: 1 and itself. A <b>composite number</b> has more. 1 is neither.</p>',
        watch: play([
          ['7 squares make only one rectangle: 1 by 7. 7 is prime.', arr(1, 7, 24)],
          ['9 squares make 1 by 9 and 3 by 3. 9 is composite.', arr(3, 3, 24)],
          ['The primes under 30.', '<p class="g6-big">2, 3, 5, 7, 11, 13, 17, 19, 23, 29</p>']
        ]),
        key: '<p>Only one rectangle means prime. More than one means composite.</p>',
        mistake: '<p>Calling every odd number prime (9, 15, 21, 51 are not) or calling 1 prime. 2 is the only even prime.</p>',
        check: [g(CH, 'ni-primes', 2), g(CH, 'ni-primes', 3)] },
      { id: 'trees', title: 'Factor trees', exp: ['B2.6'], skill: 'ni-ftree', hard: true,
        body: '<p>A <b>factor tree</b> breaks a number into primes. Split into any factor pair. Keep splitting until every branch ends in a prime.</p>',
        watch: play([
          ['Start with 60. Split it: 6 × 10.', treeSvg(60, [6, 10]).svg],
          ['Every branch ends in a prime: 2, 3, 2, 5.', treeSvg(60, [6, 10]).svg, '60 = 2 &times; 2 &times; 3 &times; 5'],
          ['Start a different way: 4 × 15.', treeSvg(60, [4, 15]).svg, 'Same primes: 2 &times; 2 &times; 3 &times; 5']
        ]),
        try: lab(CH, 4, 'Type <b>84</b> and try two different first splits. Do you get the same primes?', function (h) { return +h.querySelector('#ftn').value === 84; }, 'The primes are always 2, 2, 3 and 7.'),
        ways: [{ label: 'Divide by small primes', html: '<p>Keep dividing by the smallest prime that works. 84 &divide; 2 = 42, 42 &divide; 2 = 21, 21 &divide; 3 = 7, and 7 is prime. So 84 = 2 &times; 2 &times; 3 &times; 7.</p>' }],
        key: '<p>However you split it, a number always ends with the same primes: its <b>prime factorization</b>.</p>',
        mistake: '<p>Stopping at a composite number on a branch, like leaving a 4 or a 9. Every branch must end in a prime.</p>',
        check: [{ q: 'Finish the prime factorization: <span class="math">90 = 2 &times; 3 &times; 3 &times; ?</span>', type: 'num', answer: 5, hint: '2 &times; 3 &times; 3 = 18. What times 18 makes 90?', explain: '90 &divide; 18 = 5, and 5 is prime.' }, g(CH, 'ni-ftree', 1), g(CH, 'ni-ftree', 2)] }
    ] }
  ];

  A.register('numbers-integers', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Numbers up to one million</h2>' +
'<p>Each place is worth <b>10 times</b> the place to its right. After hundred thousands comes a new place: <b>millions</b>. Ten hundred thousands make one million.</p>' +
'<div class="fig">' + chart(1000000, { vals: true }) + '</div>' +
'<p>Big numbers are read in groups of three digits called <b>periods</b>: the ones period, the thousands period and the millions period. Read each group like a small number, then say its period name.</p>' +
'<div class="fig">' + periods(607050) + '</div>' +
'<div class="key"><b class="t">Key idea</b><p>Read a big number one period at a time, from the left. Say the period name after each group, except the ones period.</p></div>' +
'<div class="lab"><span class="lt">Try it: build a number up to one million</span>' +
'<div class="ctrl"><label for="nmr">Slide: <output id="nmo"></output></label><input type="range" id="nmr" min="0" max="1000000" step="1000" value="384000"></div>' +
'<div class="ctrl"><label for="nmn">Or type any number (0 to 1000000)<input type="number" id="nmn" min="0" max="1000000" value="384216"></label></div>' +
'<div id="nmchart"></div><div class="fig" id="nmper"></div><div class="out" id="nmout"></div>' +
'<div class="fig" id="nmmil"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Read 450 302. Thousands period: 450, "four hundred fifty thousand". Ones period: 302, "three hundred two". Together: <b>four hundred fifty thousand three hundred two</b>.</p></div>' +
A.yt({ q: 'What is the value of the 7 in <span class="math">2<u>7</u>4 105</span>?', type: 'mc', options: ['7000', '70 000', '700 000', '7'], answer: 1,
  hint: 'Say the rule: find the place, then the value. The 7 is the second digit of a six-digit number.', explain: 'The 7 is in the ten thousands place, so it is worth 70 000.' }) +
'<div class="facts"><div><svg viewBox="0 0 44 44" aria-hidden="true"><g style="fill:var(--strand)"><circle cx="12" cy="14" r="5"/><circle cx="32" cy="14" r="5"/><rect x="6" y="22" width="12" height="16" rx="4"/><rect x="26" y="22" width="12" height="16" rx="4"/></g></svg><span><b>about 718 000</b><small>people in Mississauga (2021 census)</small></span></div>' +
'<div><svg viewBox="0 0 44 44" aria-hidden="true"><rect x="4" y="18" width="36" height="20" rx="3" style="fill:color-mix(in srgb,var(--strand) 20%,var(--card));stroke:var(--strand)" stroke-width="2"/><path d="M8 18 22 6 36 18" fill="none" style="stroke:var(--strand)" stroke-width="2"/></svg><span><b>about 1 000 000</b><small>people in Ottawa (2021 census)</small></span></div>' +
'<div><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18" style="fill:color-mix(in srgb,var(--hi) 30%,var(--card));stroke:var(--strand)" stroke-width="2"/><text x="22" y="28" text-anchor="middle" font-size="16" font-weight="700" style="fill:var(--strand)">$</text></svg><span><b>$500 000</b><small>a price you might see for a house</small></span></div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Integers: numbers below zero</h2>' +
'<p><b>Integers</b> are the whole numbers, their opposites, and zero: &hellip;, &minus;3, &minus;2, &minus;1, 0, 1, 2, 3, &hellip;. Numbers below zero are <b>negative</b>. We write them with a minus sign: <span class="negt">&minus;5</span> is read "negative five".</p>' +
'<p>On this site, negative numbers are <span class="negt">blue</span> (cold, below zero) and positive numbers are <span class="post">orange</span> (warm, above zero).</p>' +
'<div class="fig">' + iline(-10, 10, [{ v: -4, lab: '−4', c: 'var(--neg)' }, { v: 4, lab: '4', c: 'var(--pos)' }], 'Number line from minus 10 to 10. Minus 4 and 4 are both 4 steps from zero, on opposite sides.') + '</div>' +
'<p><b>Opposites</b> are the same distance from zero on opposite sides. The opposite of 4 is &minus;4. Zero is its own opposite, and it is neither positive nor negative.</p>' +
'<div class="lab"><span class="lt">Try it: thermometer and number line</span>' +
'<div class="ctrl"><label for="tmr">Temperature: <output id="tmo"></output></label><input type="range" id="tmr" min="-30" max="30" step="1" value="-8"></div>' +
'<div class="row2"><div class="fig" id="tmfig"></div><div><div class="out" id="tmout"></div></div></div><div class="fig" id="tmline"></div></div>' +
'<div class="tbl"><table><thead><tr><th class="l">Situation</th><th>Integer</th></tr></thead><tbody>' +
'<tr><td class="l">8 degrees below zero</td><td class="negt">&minus;8</td></tr><tr><td class="l">Parking level P2, two floors below the street</td><td class="negt">&minus;2</td></tr>' +
'<tr><td class="l">You owe your sister $15</td><td class="negt">&minus;15</td></tr><tr><td class="l">A plane 3000 m above sea level</td><td class="post">3000</td></tr></tbody></table></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking &minus;8 is bigger than &minus;3 because 8 is bigger than 3. On the number line &minus;8 is further <b>left</b>, so it is less. &minus;8&deg;C is colder than &minus;3&deg;C.</p></div>' +
A.yt({ q: 'A diver is 12 m below the surface of the water. Which integer shows this?', type: 'mc', options: ['12', '−12', '0', '−1'], answer: 1,
  hint: 'Say the rule: below zero means negative.', explain: 'Below the surface is below zero, so the diver is at &minus;12 m.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Comparing and ordering integers</h2>' +
'<p>On a number line, numbers get <b>greater</b> as you move right and <b>less</b> as you move left. Every positive number is greater than every negative number.</p>' +
'<div class="lab"><span class="lt">Try it: compare two integers</span>' +
'<div class="ctrl"><label for="ica">First<input type="number" id="ica" min="-50" max="50" value="-7"></label><label for="icb">Second<input type="number" id="icb" min="-50" max="50" value="-2"></label></div>' +
'<div class="fig" id="icfig"></div><div class="out" id="icout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The number further to the <b>right</b> on the number line is greater. For two negative numbers, the one closer to zero is greater: &minus;2 &gt; &minus;7.</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Order &minus;5, 3, 0, &minus;9 and 1 from least to greatest. Put them on a number line and read from left to right.</p>' +
'<div class="fig">' + iline(-10, 5, [{ v: -9, lab: '−9', c: 'var(--neg)' }, { v: -5, lab: '−5', c: 'var(--neg)' }, { v: 0, lab: '0', c: 'var(--card)' }, { v: 1, lab: '1', c: 'var(--pos)' }, { v: 3, lab: '3', c: 'var(--pos)' }], 'Number line with minus 9, minus 5, 0, 1 and 3 marked from left to right') + '</div>' +
'<p>Least to greatest: <b>&minus;9, &minus;5, 0, 1, 3</b>.</p></div>' +
A.yt({ q: 'Which is colder: <span class="math">&minus;15&deg;C</span> or <span class="math">&minus;11&deg;C</span>?', type: 'mc', options: ['−15°C', '−11°C', 'They are the same'], answer: 0,
  hint: 'Say the rule: further left is less. Which is further from zero on the cold side?', explain: '&minus;15 is further left than &minus;11, so &minus;15&deg;C is colder.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Divisibility rules</h2>' +
'<p>A number is <b>divisible</b> by another if it divides with no remainder. 24 is divisible by 4 because 24 &divide; 4 = 6. Divisibility rules let you check quickly, without dividing.</p>' +
'<div class="tbl"><table><thead><tr><th>Divisible by</th><th class="l">if&hellip;</th><th class="l">Example</th></tr></thead><tbody>' +
'<tr><td><b>2</b></td><td class="l">' + RULES[2] + '</td><td class="l">513<b>6</b></td></tr>' +
'<tr><td><b>5</b></td><td class="l">' + RULES[5] + '</td><td class="l">274<b>5</b></td></tr>' +
'<tr><td><b>10</b></td><td class="l">' + RULES[10] + '</td><td class="l">839<b>0</b></td></tr>' +
'<tr><td><b>3</b></td><td class="l">' + RULES[3] + '</td><td class="l">471: 4 + 7 + 1 = 12</td></tr>' +
'<tr><td><b>9</b></td><td class="l">' + RULES[9] + '</td><td class="l">5832: 5 + 8 + 3 + 2 = 18</td></tr>' +
'<tr><td><b>4</b></td><td class="l">' + RULES[4] + '</td><td class="l">37<b>16</b>: 16 = 4 &times; 4</td></tr>' +
'<tr><td><b>8</b></td><td class="l">' + RULES[8] + '</td><td class="l">5<b>120</b>: 120 = 8 &times; 15</td></tr>' +
'<tr><td><b>6</b></td><td class="l">' + RULES[6] + '</td><td class="l">354: even, and 3 + 5 + 4 = 12</td></tr></tbody></table></div>' +
'<p>The shaded squares show the <b>multiples</b>. Look for the pattern each rule describes.</p>' +
'<div class="lab"><span class="lt">Try it: test a number</span>' +
'<div class="ctrl"><label for="dvn">Number (1 to 1000000)<input type="number" id="dvn" min="1" max="1000000" value="2340"></label>' +
'<label for="dvd">Show multiples of<select id="dvd"><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option><option>8</option><option>9</option><option>10</option></select></label></div>' +
'<div class="row2"><div class="fig" id="dvchart"></div><div class="tbl" id="dvtbl"></div></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Using the "add the digits" rule for 4 or 8. Adding digits only works for 3 and 9. For 4 and 8, look at the last two or three digits.</p></div>' +
A.yt({ q: 'Is <span class="math">7452</span> divisible by 9?', type: 'mc', options: ['Yes', 'No'], answer: 0,
  hint: 'Say the rule for 9: add the digits. Is the total a multiple of 9?', explain: '7 + 4 + 5 + 2 = 18, and 18 is a multiple of 9. So yes: 7452 &divide; 9 = 828.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Factors, primes and factor trees</h2>' +
'<p><b>Factors</b> are numbers that multiply to make a number. <b>Multiples</b> are what you get when you multiply a number. These two words are easy to mix up, so keep them apart:</p>' +
'<div class="tbl"><table><thead><tr><th class="l"></th><th class="l">Factors of 12</th><th class="l">Multiples of 12</th></tr></thead><tbody>' +
'<tr><td class="l">What they are</td><td class="l">numbers that divide 12 evenly</td><td class="l">12 times 1, 2, 3, &hellip;</td></tr>' +
'<tr><td class="l">The list</td><td class="l">1, 2, 3, 4, 6, 12</td><td class="l">12, 24, 36, 48, &hellip;</td></tr>' +
'<tr><td class="l">How many</td><td class="l">a short list that stops</td><td class="l">they go on forever</td></tr></tbody></table></div>' +
'<p>The factor pairs of 12 make rectangles: 1 by 12, 2 by 6 and 3 by 4.</p>' +
'<div class="vrow"><figure><figcaption>1 &times; 12</figcaption>' + arr(1, 12) + '</figure><figure><figcaption>2 &times; 6</figcaption>' + arr(2, 6) + '</figure><figure><figcaption>3 &times; 4</figcaption>' + arr(3, 4) + '</figure></div>' +
'<p>A <b>prime number</b> has exactly two factors: 1 and itself. A <b>composite number</b> has more than two. 1 is neither.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Prime (only one rectangle)</th><th class="l">Not prime</th></tr></thead><tbody>' +
'<tr><td class="l">2, 3, 5, 7, 11, 13, 17, 19, 23, 29</td><td class="l">1 (one factor), 9 (3 &times; 3), 15 (3 &times; 5), 21 (3 &times; 7), 27, 51 (3 &times; 17)</td></tr></tbody></table></div>' +
'<p>A <b>factor tree</b> breaks a composite number into primes. Split the number into any factor pair. Keep splitting until every branch ends in a prime. Circle the primes.</p>' +
'<div class="lab"><span class="lt">Try it: grow a factor tree</span>' +
'<div class="ctrl"><label for="ftn">Number (4 to 1000)<input type="number" id="ftn" min="4" max="1000" value="60"></label><label for="ftp">First split<select id="ftp"></select></label></div>' +
'<div class="fig" id="ftfig"></div><div class="out" id="ftout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>However you split it, a number always ends with the <b>same primes</b>. 60 = 2 &times; 2 &times; 3 &times; 5 whether you start with 6 &times; 10 or 4 &times; 15. This is its <b>prime factorization</b>.</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Find the prime factorization of 84. Split 84 = 7 &times; 12. 7 is prime. Split 12 = 3 &times; 4, then 4 = 2 &times; 2. So 84 = <b>2 &times; 2 &times; 3 &times; 7</b>.</p><div class="fig">' + treeSvg(84, [7, 12]).svg + '</div></div>' +
A.yt({ q: 'Finish the prime factorization: <span class="math">90 = 2 &times; 3 &times; 3 &times; ?</span>', type: 'num', answer: 5,
  hint: 'Multiply the primes you have: 2 &times; 3 &times; 3 = 18. What times 18 makes 90?', explain: '90 &divide; 18 = 5, and 5 is prime. 90 = 2 &times; 3 &times; 3 &times; 5.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      /* section 1 */
      function nm() {
        var n = parseInt($('#nmn', root).value, 10);
        if (isNaN(n)) n = 0;
        n = Math.max(0, Math.min(1000000, n));
        $('#nmo', root).textContent = A.fmt(n);
        $('#nmchart', root).innerHTML = chart(n, { cols: 7, vals: true });
        $('#nmper', root).innerHTML = periods(n);
        var s = String(n), parts = [];
        for (var k = 0; k < s.length; k++) {
          var p = s.length - 1 - k;
          if (s.charAt(k) !== '0') parts.push('<b class="c' + p + 't">' + A.fmt(+s.charAt(k) * Math.pow(10, p)) + '</b>');
        }
        $('#nmout', root).innerHTML = '<p><b>Expanded form:</b> <span class="math" style="white-space:normal">' + (parts.join(' + ') || '0') + '</span></p><p><b>In words:</b> ' + words(n) + '</p>' +
          '<p class="t2">On the grid below, each square is 10 000. ' + A.fmt(n) + ' fills ' + (n % 10000 ? 'about ' + Math.round(n / 10000) : n / 10000) + ' of the 100 squares.</p>';
        $('#nmmil', root).innerHTML = million(n);
      }
      $('#nmr', root).addEventListener('input', function () { $('#nmn', root).value = this.value; nm(); });
      $('#nmn', root).addEventListener('input', function () { var v = Math.max(0, Math.min(1000000, parseInt(this.value, 10) || 0)); $('#nmr', root).value = v; nm(); });
      nm();

      /* section 2 */
      function tm() {
        var t = parseInt($('#tmr', root).value, 10);
        $('#tmo', root).innerHTML = '<span class="' + (t < 0 ? 'negt' : t > 0 ? 'post' : '') + '">' + sgn(t) + '&deg;C</span>';
        $('#tmfig', root).innerHTML = thermo(t);
        $('#tmline', root).innerHTML = iline(-30, 30, [{ v: t, lab: (t < 0 ? '−' + -t : t) + '°', c: col(t) }, { v: -t, lab: 'opposite', c: 'var(--card)' }], 'Number line from minus 30 to 30 with ' + t + ' and its opposite marked');
        $('#tmout', root).innerHTML = '<p><span class="big" style="color:' + col(t) + '">' + sgn(t) + '&deg;C</span></p>' +
          '<p>' + (t < 0 ? 'Read "negative ' + -t + '". It is ' + -t + ' degrees <b>below</b> zero.' : t > 0 ? 'Read "' + t + '" or "positive ' + t + '". It is ' + t + ' degrees <b>above</b> zero.' : 'Zero: the freezing point of water. Neither positive nor negative.') + '</p>' +
          '<p>Distance from zero: <b>' + Math.abs(t) + '</b>. Its opposite: <b>' + sgn(-t) + '</b>.</p>';
      }
      A.bind(root, ['tmr'], tm);

      /* section 3 */
      function ic() {
        var a = Math.max(-50, Math.min(50, parseInt($('#ica', root).value, 10) || 0));
        var b = Math.max(-50, Math.min(50, parseInt($('#icb', root).value, 10) || 0));
        var lo = Math.min(a, b, 0), hi = Math.max(a, b, 0), span = hi - lo, st = span > 40 ? 10 : span > 20 ? 5 : span > 10 ? 2 : 1;
        lo = Math.floor((lo - 1) / st) * st; hi = Math.ceil((hi + 1) / st) * st;
        $('#icfig', root).innerHTML = iline(lo, hi, [{ v: a, lab: 'first: ' + (a < 0 ? '−' + -a : a), c: col(a) }, { v: b, lab: 'second: ' + (b < 0 ? '−' + -b : b), c: col(b) }], 'Number line with ' + a + ' and ' + b, st);
        var sym = a > b ? '&gt;' : a < b ? '&lt;' : '=';
        $('#icout', root).innerHTML = '<p><span class="big">' + sgn(a) + ' ' + sym + ' ' + sgn(b) + '</span></p><p>' +
          (a === b ? 'They are the same point.' : sgn(Math.max(a, b)) + ' is further right, so it is greater.' + (a < 0 && b < 0 ? ' Both are negative, so the one closer to zero is greater.' : '')) + '</p>';
      }
      A.bind(root, ['ica', 'icb'], ic);

      /* section 4 */
      function dv() {
        var n = Math.max(1, Math.min(1000000, parseInt($('#dvn', root).value, 10) || 1)), d = +$('#dvd', root).value;
        $('#dvchart', root).innerHTML = hchart(d, n <= 100 ? n : null);
        var h = '<table><thead><tr><th>&divide;</th><th class="l">Check for ' + A.fmt(n) + '</th><th></th></tr></thead><tbody>';
        [2, 3, 4, 5, 6, 8, 9, 10].forEach(function (k) {
          var r = rule(n, k);
          h += '<tr' + (k === d ? ' style="outline:3px solid var(--hi)"' : '') + '><td><b>' + k + '</b></td><td class="l" style="font-size:.85rem">' + r.why + '</td><td><span class="chk ' + (r.ok ? 'y' : 'n') + '" aria-label="' + (r.ok ? 'yes' : 'no') + '">' + (r.ok ? '&#10003;' : '&#10007;') + '</span></td></tr>';
        });
        $('#dvtbl', root).innerHTML = h + '</tbody></table>';
      }
      A.bind(root, ['dvn', 'dvd'], dv);

      /* section 5 */
      var lastN = 0;
      function ft() {
        var n = Math.max(4, Math.min(1000, parseInt($('#ftn', root).value, 10) || 4)), sel = $('#ftp', root);
        if (n !== lastN) {
          lastN = n;
          var ps = pairs(n);
          sel.innerHTML = ps.length ? ps.map(function (p, i) { return '<option value="' + i + '"' + (i === ps.length - 1 ? ' selected' : '') + '>' + p[0] + ' &times; ' + p[1] + '</option>'; }).join('') : '<option>none: it is prime</option>';
          sel.disabled = !ps.length;
        }
        var ps2 = pairs(n), out = $('#ftout', root);
        if (!ps2.length) {
          $('#ftfig', root).innerHTML = A.svg(120, 50, '<circle cx="60" cy="25" r="20" style="fill:color-mix(in srgb,var(--hi) 55%,var(--card));stroke:var(--ink)" stroke-width="2"/><text x="60" y="31" text-anchor="middle" font-size="17" font-weight="700">' + n + '</text>', n + ' is prime');
          out.innerHTML = '<p><span class="big">' + n + ' is prime.</span></p><p>Its only factors are 1 and ' + n + ', so the tree cannot grow.</p>';
          return;
        }
        var t = treeSvg(n, ps2[+sel.value] || ps2[ps2.length - 1]), f = pf(n), cnt = {};
        f.forEach(function (p) { cnt[p] = (cnt[p] || 0) + 1; });
        $('#ftfig', root).innerHTML = t.svg;
        out.innerHTML = '<p><span class="big">' + n + ' = ' + times(f) + '</span></p><p>' + Object.keys(cnt).map(function (p) { return cnt[p] + ' &times; the prime ' + p; }).join(', ') + '. Try a different first split: the circled primes stay the same.</p>';
      }
      A.bind(root, ['ftn', 'ftp'], ft);
    },

    quiz: [
      { q: 'What is the value of the digit 3 in <span class="math">5<u>3</u>8 240</span>?', type: 'mc', options: ['3000', '30 000', '300 000', '300'], answer: 1, fig: chart(538240, { hl: 1, dots: false }),
        hint: 'Count the places from the right: ones, tens, hundreds, thousands, ten thousands.', explain: 'The 3 is in the ten thousands place, so it is worth 30 000.' },
      { q: 'Which number is <b>six hundred four thousand ninety</b>?', type: 'mc', options: ['604 090', '640 090', '604 900', '64 090'], answer: 0,
        hint: 'Write the thousands period (604), then three digits for the ones period.', explain: 'Six hundred four thousand is 604 000. Ninety is 090 in the ones period. Together: 604 090.' },
      { q: 'What integer is marked on this number line?', type: 'num', answer: -6, fig: iline(-10, 10, [{ v: -6, c: 'var(--hi)' }], 'Number line from minus 10 to 10 with a point marked'),
        hint: 'The point is left of zero, so the integer is negative. Count the steps from zero.', explain: 'The point is 6 steps left of zero: &minus;6.' },
      { q: 'Which list is in order from <b>least to greatest</b>?', type: 'mc', options: ['−1, −4, 2, 5', '−4, −1, 2, 5', '5, 2, −1, −4', '−1, 2, −4, 5'], answer: 1,
        hint: 'Picture a number line. The number furthest left is least.', explain: '&minus;4 is furthest left, then &minus;1, then 2, then 5.' },
      { q: 'Which number is divisible by <b>both 3 and 4</b>?', type: 'mc', options: ['134', '222', '316', '312'], answer: 3,
        hint: 'For 3, add the digits. For 4, look at the last two digits.', explain: '312: 3 + 1 + 2 = 6, a multiple of 3, and 12 is a multiple of 4. (312 = 12 &times; 26.)' },
      { q: 'Which number is <b>prime</b>?', type: 'mc', options: ['21', '27', '29', '33'], answer: 2,
        hint: 'Try dividing each by 3. A prime has only 1 and itself as factors.', explain: '21 = 3 &times; 7, 27 = 3 &times; 9, 33 = 3 &times; 11. Only 29 has no factors except 1 and 29.' },
      { q: 'What is the prime factorization of 72?', type: 'mc', options: ['8 &times; 9', '2 &times; 2 &times; 2 &times; 3 &times; 3', '2 &times; 3 &times; 12', '2 &times; 2 &times; 3 &times; 3'], answer: 1, fig: treeSvg(72, [8, 9]).svg,
        hint: 'Every number in a prime factorization must be prime. Follow the tree to the circles.', explain: '72 = 8 &times; 9 = (2 &times; 2 &times; 2) &times; (3 &times; 3). Check: 8 &times; 9 = 72.' }
    ],

    practice: [
      { id: 'ni-value', name: 'Value of a digit', code: 'B1.1', gen: function (lv) {
        var n = lv === 1 ? R.int(100000, 999999) : R.int(1000000, 1000000) && R.pick([R.int(100000, 999999), 1000000]);
        if (lv === 2 && n === 1000000) n = R.int(100000, 999999);
        if (lv === 3) {
          n = R.int(100000, 999999);
          var k = R.pick([2, 3, 4]), total = Math.floor(n / Math.pow(10, k));
          return { q: 'How many <b>' + A.PLACES[k] + '</b> are in <span class="math">' + A.fmt(n) + '</span>, counting all of them?', type: 'num', answer: total,
            fig: chart(n, { dots: false }), v: { kind: 'count', n: n, k: k },
            hint: 'Cover the digits to the right of the ' + A.PLACES[k] + ' place. Read what is left.',
            steps: ['Find the ' + A.PLACES[k] + ' place in ' + A.fmt(n) + '.', 'Cover the ' + k + ' digits to its right.', 'What is left is ' + A.fmt(total) + ', so there are ' + A.fmt(total) + ' ' + A.PLACES[k] + '.'],
            explain: A.fmt(n) + ' = ' + A.fmt(total) + ' ' + A.PLACES[k] + ' + ' + A.fmt(n % Math.pow(10, k)) + '.' };
        }
        var s = String(n), len = s.length, i = R.int(0, lv === 1 ? 2 : len - 1);
        while (s.charAt(i) === '0') i = R.int(0, len - 1);
        var dgt = +s.charAt(i), place = len - 1 - i, val = dgt * Math.pow(10, place);
        var wrong = [dgt * Math.pow(10, place + 1), dgt * Math.pow(10, Math.max(0, place - 1)), dgt * Math.pow(10, Math.max(0, place - 2)), dgt].filter(function (v) { return v !== val && v <= 9000000; });
        var o = R.mc(A.fmt(val), wrong.map(A.fmt));
        return { q: 'What is the value of the digit <b>' + dgt + '</b> in <span class="math">' + s.slice(0, i) + '<u>' + dgt + '</u>' + s.slice(i + 1) + '</span>? <span class="t2">(' + A.fmt(n) + ')</span>',
          type: 'mc', options: o.options, answer: o.answer, fig: chart(n, { hl: i, dots: lv === 1 }), v: { kind: 'value', n: n, i: i, val: val },
          hint: 'Find the underlined digit in the chart. Read the name of its place.',
          steps: ['The underlined ' + dgt + ' is in the <b>' + A.PLACES[place] + '</b> place.', 'One ' + A.PLACE1[place] + ' is ' + A.fmt(Math.pow(10, place)) + '.', dgt + ' &times; ' + A.fmt(Math.pow(10, place)) + ' = ' + A.fmt(val) + '.'],
          explain: 'The ' + dgt + ' is in the ' + A.PLACES[place] + ' place, so it is worth ' + A.fmt(val) + '.' };
      } },
      { id: 'ni-words', name: 'Read and write big numbers', code: 'B1.1', gen: function (lv) {
        var th = R.int(100, 999), on = lv === 1 ? R.int(100, 999) : R.pick([R.int(1, 99), R.int(100, 999), 0]);
        if (lv > 1 && R.int(0, 1)) th = R.int(1, 9) * 100 + R.int(0, 9);
        var n = th * 1000 + on;
        var wrong = [th * 100 + on, th * 1000 + on * 10 % 1000 + (on >= 100 ? 0 : 0), Math.floor(th / 10) * 1000 + on, th * 10000 + on, th * 1000 + (on + 100) % 1000];
        wrong = wrong.filter(function (w) { return w !== n && w > 0; });
        var steps = ['Split the number into the thousands period and the ones period.', 'Thousands period: ' + th + ', "' + b1000(th) + ' thousand".',
          'Ones period: ' + (on ? ('00' + on).slice(-3) + ', "' + b1000(on) + '". It always needs three digits.' : '000, so say nothing.'),
          'Together: ' + A.fmt(n) + ' is ' + words(n) + '.<div class="fig">' + periods(n) + '</div>'];
        if (lv === 3) {
          var o = R.mc(words(n), wrong.slice(0, 3).map(words));
          return { q: 'Which is the word form of <span class="math">' + A.fmt(n) + '</span>?', type: 'mc', options: o.options, answer: o.answer, v: { kind: 'w2n', n: n, words: words(n) },
            fig: chart(n, { dots: false }), hint: 'Read the thousands period first, then the last three digits.', steps: steps, explain: A.fmt(n) + ' is ' + words(n) + '.' };
        }
        var o2 = R.mc(A.fmt(n), wrong.slice(0, 3).map(A.fmt));
        return { q: 'Which number is <b>' + words(n) + '</b>?', type: 'mc', options: o2.options, answer: o2.answer, v: { kind: 'w2n', n: n, words: words(n) },
          hint: 'Write the thousands period, then three digits for the ones period. Use 0 for any empty place.', steps: steps, explain: words(n) + ' is ' + A.fmt(n) + '.' };
      } },
      { id: 'ni-integers', name: 'Integers on a number line', code: 'B1.2', gen: function (lv) {
        if (lv === 2) {
          var ctx = R.pick([['°C below zero', -1, ''], ['floors below the street', -1, ''], ['metres below sea level', -1, ''], ['dollars owed', -1, ''], ['degrees above zero', 1, ''], ['metres above sea level', 1, '']]);
          var k = R.int(2, 40), ans = ctx[1] * k;
          var o = R.mc(sgn(ans), [sgn(-ans), sgn(ans + ctx[1]), '0']);
          return { q: 'Which integer shows <b>' + k + ' ' + ctx[0] + '</b>?', type: 'mc', options: o.options, answer: o.answer, v: { kind: 'ctx', ans: ans, opts: o.options },
            fig: iline(-10, 10, [], 'Number line from minus 10 to 10'),
            hint: 'Below zero, under the street, under the sea or owing money: all negative.', steps: ['Decide: is it below zero or above zero?', ctx[1] < 0 ? 'It is below zero, so the integer is negative.' : 'It is above zero, so the integer is positive.', 'The integer is ' + sgn(ans) + '.'],
            explain: k + ' ' + ctx[0] + ' is ' + sgn(ans) + '.' };
        }
        var st = lv === 1 ? 1 : R.pick([2, 5]), lo = lv === 1 ? -10 : -10 * st, hi = lv === 1 ? 10 : 10 * st, v;
        do { v = R.int(lo / st, hi / st) * st; } while (v >= 0 && R.int(0, 2));
        if (v === 0) v = -st * R.int(1, 5);
        return { q: 'What integer is marked on the number line?' + (st > 1 ? ' <span class="t2">Each tick is ' + st + '.</span>' : ''), type: 'num', answer: v, v: { kind: 'read', ans: v },
          fig: iline(lo, hi, [{ v: v, c: 'var(--hi)' }], 'Number line from ' + lo + ' to ' + hi + ' with a point marked', st),
          hint: 'Find zero. Is the point left (negative) or right (positive)? Count the ticks.',
          steps: ['Find 0, the thick tick in the middle.', 'The point is ' + (v < 0 ? 'left' : 'right') + ' of zero, so the number is ' + (v < 0 ? 'negative' : 'positive') + '.', 'It is ' + Math.abs(v / st) + ' tick' + (Math.abs(v / st) > 1 ? 's' : '') + ' from zero' + (st > 1 ? ', and each tick is ' + st : '') + '. The integer is ' + sgn(v) + '.'],
          explain: 'The point is at ' + sgn(v) + '. Type a minus sign for a negative number.' };
      } },
      { id: 'ni-compare', name: 'Compare and order integers', code: 'B1.3', gen: function (lv) {
        if (lv < 3) {
          var a = R.int(-20, lv === 1 ? 20 : -1), b = R.int(-20, lv === 1 ? 20 : -1);
          while (b === a) b = R.int(-20, lv === 1 ? 20 : -1);
          var sym = a > b ? '&gt;' : '&lt;', o = R.mc(sym, ['&gt;', '&lt;', '=']);
          var lo = Math.floor((Math.min(a, b, 0) - 1) / 5) * 5, hi = Math.ceil((Math.max(a, b, 0) + 1) / 5) * 5;
          return { q: 'Which symbol goes in the box? <span class="math">' + sgn(a) + ' &#9633; ' + sgn(b) + '</span>', type: 'mc', options: o.options, answer: o.answer, v: { kind: 'sym', a: a, b: b, sym: sym },
            fig: lv === 1 ? iline(lo, hi, [{ v: a, lab: sgn(a).replace('&minus;', '−'), c: col(a) }, { v: b, lab: sgn(b).replace('&minus;', '−'), c: col(b) }], 'Number line with ' + a + ' and ' + b) : '',
            hint: 'Picture the number line. The number further right is greater.',
            steps: ['Place both numbers on a number line.<div class="fig">' + iline(lo, hi, [{ v: a, c: col(a) }, { v: b, c: col(b) }], 'Number line with ' + a + ' and ' + b) + '</div>', sgn(Math.max(a, b)) + ' is further right.', 'So ' + sgn(a) + ' ' + sym + ' ' + sgn(b) + '.'],
            explain: sgn(a) + ' ' + sym + ' ' + sgn(b) + '. Further right is greater.' };
        }
        var nums = [];
        while (nums.length < 4) { var x = R.int(-15, 12); if (nums.indexOf(x) < 0) nums.push(x); }
        if (nums.filter(function (x) { return x < 0; }).length < 2) nums[0] = -Math.abs(nums[0]) || -3;
        nums = nums.filter(function (x, i) { return nums.indexOf(x) === i; });
        while (nums.length < 4) { var y = R.int(-15, -1); if (nums.indexOf(y) < 0) nums.push(y); }
        var sorted = nums.slice().sort(function (p, q) { return p - q; }), f = function (l) { return l.map(function (z) { return z < 0 ? '−' + -z : String(z); }).join(', '); };
        var byAbs = nums.slice().sort(function (p, q) { return Math.abs(p) - Math.abs(q) || p - q; });
        var o2 = R.mc(f(sorted), [f(sorted.slice().reverse()), f(byAbs), f([sorted[1], sorted[0], sorted[2], sorted[3]])]);
        return { q: 'Which list is in order from <b>least to greatest</b>?', type: 'mc', options: o2.options, answer: o2.answer, v: { kind: 'order', nums: nums, ans: o2.options[o2.answer] },
          hint: 'The most negative number is least. Ignore how big the digits look.',
          steps: ['Put all four on a number line.<div class="fig">' + iline(-15, 15, sorted.map(function (z) { return { v: z, c: col(z) }; }), 'Number line with four points') + '</div>', 'Read them from left to right.', 'Least to greatest: ' + f(sorted) + '.'],
          explain: 'Left to right on the number line: ' + f(sorted) + '.' };
      } },
      { id: 'ni-divis', name: 'Divisibility rules', code: 'B2.2', gen: function (lv) {
        var d = R.pick(lv === 1 ? [2, 5, 10] : lv === 2 ? [3, 9, 4] : [6, 8, 9, 4]);
        var n = lv === 1 ? R.int(100, 9999) : R.int(1000, 99999);
        if (R.int(0, 1)) n = Math.floor(n / d) * d || d * 13;
        var r = rule(n, d), o = R.mc('Yes', ['No']);
        o = { options: ['Yes', 'No'], answer: r.ok ? 0 : 1 };
        return { q: 'Is <span class="math">' + A.fmt(n) + '</span> divisible by <b>' + d + '</b>?', type: 'mc', options: o.options, answer: o.answer, v: { kind: 'div', n: n, d: d },
          hint: 'The rule for ' + d + ': a number is divisible by ' + d + ' if ' + RULES[d] + '.',
          steps: ['Say the rule: divisible by ' + d + ' if ' + RULES[d] + '.', r.why, r.ok ? 'It passes, so yes. Check: ' + A.fmt(n) + ' &divide; ' + d + ' = ' + A.fmt(n / d) + '.' : 'It fails, so no. ' + A.fmt(n) + ' &divide; ' + d + ' leaves a remainder of ' + (n % d) + '.'],
          explain: r.why + ' So ' + (r.ok ? 'yes' : 'no') + '.' };
      } },
      { id: 'ni-primes', name: 'Factors and primes', code: 'B2.6', gen: function (lv) {
        if (lv === 1) {
          var n = R.pick([12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48]), f = factors(n), right = R.pick(f.slice(1, -1));
          var non = []; for (var i = 2; i < n && non.length < 6; i++) if (n % i) non.push(i);
          var o = R.mc(right, R.shuffle(non).slice(0, 3));
          return { q: 'Which number is a <b>factor</b> of ' + n + '?', type: 'mc', options: o.options, answer: o.answer, v: { kind: 'factor', n: n, ans: right },
            fig: arr(right, n / right, n > 36 ? 10 : 12), hint: 'A factor divides ' + n + ' with no remainder. Try dividing ' + n + ' by each choice.',
            steps: ['A factor of ' + n + ' divides it evenly.', 'Try each choice. ' + n + ' &divide; ' + right + ' = ' + n / right + ', with nothing left over.', 'So ' + right + ' is a factor. The picture shows ' + right + ' rows of ' + n / right + '.'],
            explain: right + ' &times; ' + n / right + ' = ' + n + ', so ' + right + ' is a factor of ' + n + '.' };
        }
        if (lv === 2) {
          var m = R.int(0, 1) ? R.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]) : R.pick([21, 27, 33, 39, 49, 51, 57, 15, 25, 35, 45, 55, 91]);
          var pr = isPrime(m), fs = factors(m);
          return { q: 'Is ' + m + ' <b>prime</b> or <b>composite</b>?', type: 'mc', options: ['Prime', 'Composite'], answer: pr ? 0 : 1, v: { kind: 'prime', n: m },
            hint: 'Try dividing by 3, 5 and 7. If one works, it is composite.',
            steps: ['A prime has exactly two factors: 1 and itself.', pr ? 'Try 2, 3, 5 and 7. None divides ' + m + ' evenly.' : m + ' = ' + fs[1] + ' &times; ' + m / fs[1] + '.', pr ? 'So ' + m + ' is prime.' : 'It has more than two factors, so it is composite.'],
            explain: pr ? m + ' has only the factors 1 and ' + m + ', so it is prime.' : m + ' = ' + fs[1] + ' &times; ' + m / fs[1] + ', so it is composite. Its factors are ' + fs.join(', ') + '.' };
        }
        var k = R.pick([12, 16, 18, 20, 24, 28, 30, 36, 40, 45, 48, 50, 60]), fk = factors(k), pk = [];
        for (var j = 0; j < fk.length && fk[j] <= k / fk[j]; j++) pk.push(fk[j] + ' &times; ' + k / fk[j]);
        return { q: 'How many factors does <b>' + k + '</b> have? Count 1 and ' + k + ' too.', type: 'num', answer: fk.length, v: { kind: 'count', n: k },
          hint: 'List factor pairs: 1 &times; ' + k + ', 2 &times; &hellip;, and stop when the pairs meet in the middle.',
          steps: ['List the factor pairs: ' + pk.join(', ') + '.', 'Write every number from the pairs once: ' + fk.join(', ') + '.', 'Count them: ' + fk.length + '.'],
          explain: k + ' has ' + fk.length + ' factors: ' + fk.join(', ') + '.' };
      } },
      { id: 'ni-ftree', name: 'Prime factorization', code: 'B2.6', gen: function (lv) {
        var n = R.pick(lv === 1 ? [12, 18, 20, 28, 30, 42, 45, 50, 63, 70] : [36, 48, 60, 72, 84, 90, 96, 100, 108, 120, 126, 150, 180, 210]);
        var f = pf(n);
        if (lv === 1) {
          var hide = R.int(0, f.length - 1), t = treeSvg(n, null, null), known = f.slice(); known.splice(hide, 1);
          var tr = tree(n), leaves = []; (function walk(nd) { if (nd.k) { walk(nd.k[0]); walk(nd.k[1]); } else leaves.push(nd.v); })(tr);
          var hi = R.int(0, leaves.length - 1), miss = leaves[hi];
          t = treeSvg(n, null, hi);
          return { q: 'Find the missing prime in the factor tree for ' + n + '.', type: 'num', answer: miss, fig: t.svg, v: { kind: 'miss', n: n, leaves: leaves, hi: hi },
            hint: 'Look at the number just above the missing circle. Divide it by the other branch.',
            steps: ['Find the number just above the missing circle.', 'It splits into two branches. Divide it by the branch you can see.', 'The missing prime is ' + miss + '.'],
            explain: 'The missing prime is ' + miss + '. ' + n + ' = ' + times(f) + '.' };
        }
        if (lv === 2) {
          var w1 = f.slice(0, -1), w2 = f.slice(); w2[w2.length - 1] = w2[w2.length - 1] * 2;
          var pr2 = pairs(n).slice(-1)[0];
          var opts = [times(f), times(w1.concat([f[f.length - 1] + (f[f.length - 1] === 2 ? 1 : 2)])), pr2[0] + ' &times; ' + pr2[1], times(f.slice(1))];
          var o = R.mc(opts[0], opts.slice(1));
          return { q: 'Which is the <b>prime factorization</b> of ' + n + '?', type: 'mc', options: o.options, answer: o.answer, v: { kind: 'pf', n: n, ans: o.options[o.answer] },
            hint: 'Every number must be prime, and they must multiply to ' + n + '.', fig: '',
            steps: ['Start a factor tree: ' + n + ' = ' + pr2[0] + ' &times; ' + pr2[1] + '.', 'Keep splitting until every branch is prime.<div class="fig">' + treeSvg(n).svg + '</div>', n + ' = ' + times(f) + '.'],
            explain: n + ' = ' + times(f) + '. Each factor is prime and the product is ' + n + '.' };
        }
        return { q: 'Which number has the prime factorization <span class="math">' + times(f) + '</span>?', type: 'num', answer: n, v: { kind: 'prod', f: f },
          hint: 'Multiply the primes, two at a time.',
          steps: ['Multiply from the left, two at a time.', f.reduce(function (acc, p, i) { if (!i) return [String(p), p]; var nv = acc[1] * p; return [acc[0] + ' &times; ' + p + ' = ' + nv + (i < f.length - 1 ? ', then ' + nv : ''), nv]; }, ['', 1])[0] + '.', 'The number is ' + n + '.'],
          explain: times(f) + ' = ' + n + '.' };
      } }
    ]
  });
})();
