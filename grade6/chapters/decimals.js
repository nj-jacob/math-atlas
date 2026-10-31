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
  var DP = ['', 'tenths', 'hundredths', 'thousandths'], DP1 = ['', 'tenth', 'hundredth', 'thousandth'];
  /* k is a number of thousandths. Show it with the fewest decimal places needed (at least dp). */
  function dec(k, dp) {
    var neg = k < 0; k = Math.abs(Math.round(k));
    var w = Math.floor(k / 1000), f = ('00' + (k % 1000)).slice(-3);
    f = f.replace(/0+$/, '');
    while (f.length < (dp || 0)) f += '0';
    return (neg ? '−' : '') + A.fmt(w) + (f ? '.' + f : '');
  }
  function places(k) { var f = ('00' + (Math.abs(k) % 1000)).slice(-3).replace(/0+$/, ''); return f.length; }
  function dwords(k) {
    var w = Math.floor(k / 1000), p = places(k), f = Math.round((k % 1000) / Math.pow(10, 3 - p));
    if (!p) return b1000(w) || 'zero';
    var fp = b1000(f) + ' ' + (f === 1 ? DP1[p] : DP[p]);
    return w ? b1000(w) + ' and ' + fp : fp;
  }
  /* place value chart: ones . tenths hundredths thousandths. o.hl = index (0 ones, 1..3 decimal places) */
  function dchart(k, o) {
    o = o || {};
    var w = Math.floor(k / 1000), s = ('00' + (k % 1000)).slice(-3), cols = [['Ones', 'Ones', String(w), 'c0']];
    if (w >= 10) cols.unshift(['Tens', 'Tens', String(Math.floor(w / 10)), 'c1']), cols[1][2] = String(w % 10);
    var h = '<div class="pv" style="max-width:' + (cols.length * 96 + 300) + 'px;margin:8px auto;grid-template-columns:repeat(' + cols.length + ',1fr) 16px repeat(3,1fr)">';
    cols.forEach(function (c, i) { h += '<div' + (o.hl === 0 && i === cols.length - 1 ? ' class="on"' : '') + '><span class="h ' + c[3] + '">' + c[0] + '</span><span class="d">' + c[2] + '</span>' + (o.vals ? '<span class="v">' + (+c[2] ? c[2] + (i < cols.length - 1 ? '0' : '') : '') + '</span>' : '') + '</div>'; });
    h += '<div class="dot" aria-label="decimal point">.</div>';
    for (var i = 0; i < 3; i++) {
      var d = s.charAt(i), dim = o.dp && i >= o.dp;
      h += '<div' + (o.hl === i + 1 ? ' class="on"' : '') + '><span class="h cd' + (i + 1) + '"><span class="lg">' + ['Tenths', 'Hundredths', 'Thousandths'][i] + '</span><span class="sm">' + ['Tenths', 'Hund-ths', 'Thous-ths'][i] + '</span></span><span class="d' + (dim ? ' dim' : '') + '">' + d + '</span>' +
        (o.vals ? '<span class="v">' + (+d ? '0.' + '00'.slice(0, i) + d : '') + '</span>' : '') + '</div>';
    }
    return h + '</div>';
  }
  /* a square worth 1 whole: 10 strips (tenths), 100 squares (hundredths), each square cut into 10 slivers (thousandths) */
  function kgrid(k, size, label) {
    size = size || 30;
    var s = '', t = Math.floor(k / 100), h = Math.floor(k % 100 / 10), th = k % 10, W = size * 10;
    for (var c = 0; c < 10; c++) for (var r = 0; r < 10; r++) {
      var x = 2 + c * size, y = 2 + r * size, idx = c * 10 + r, fill = 'var(--card)';
      if (c < t) fill = 'color-mix(in srgb,var(--d1) 70%,var(--card))';
      else if (c === t && r < h) fill = 'color-mix(in srgb,var(--d2) 70%,var(--card))';
      s += '<rect x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" style="fill:' + fill + ';stroke:var(--line)" stroke-width="1"/>';
      if (c === t && r === h && th) s += '<rect x="' + x + '" y="' + y + '" width="' + (size * th / 10) + '" height="' + size + '" style="fill:var(--d3)"/>';
    }
    for (var j = 0; j <= 10; j++) s += '<line x1="' + (2 + j * size) + '" y1="2" x2="' + (2 + j * size) + '" y2="' + (2 + W) + '" style="stroke:var(--ink2)" stroke-width="' + (j % 10 ? 1.2 : 2.5) + '"/>';
    s += '<rect x="2" y="2" width="' + W + '" height="' + W + '" fill="none" style="stroke:var(--ink)" stroke-width="2.5"/>';
    return A.svg(W + 4, W + 4, s, label || dec(k) + ' of a whole square: ' + t + ' tenths, ' + h + ' hundredths and ' + th + ' thousandths shaded');
  }
  /* number line from a to b (in thousandths), tick every st thousandths, marks [{k, lab, c}] */
  function dline(a, b, st, marks, label, dp) {
    var W = 560, x0 = 30, x1 = 530, n = Math.round((b - a) / st), s = '<g transform="translate(0 10)">';
    function X(v) { return x0 + (x1 - x0) * (v - a) / (b - a); }
    s += '<line x1="' + (x0 - 10) + '" y1="30" x2="' + (x1 + 10) + '" y2="30" style="stroke:var(--ink)" stroke-width="2"/>';
    var every = n > 10 ? (n % 5 === 0 ? 5 : 2) : Math.max(dec(a, dp).length, dec(b, dp).length) > 4 ? 2 : 1;
    for (var i = 0; i <= n; i++) {
      var v = a + i * st, x = X(v), big = i % every === 0;
      s += '<line x1="' + x + '" y1="' + (big ? 20 : 24) + '" x2="' + x + '" y2="' + (big ? 40 : 36) + '" style="stroke:var(--ink)" stroke-width="' + (big ? 2 : 1.2) + '"/>';
      if (big) s += '<text x="' + x + '" y="62" text-anchor="middle" font-size="17">' + dec(v, dp) + '</text>';
    }
    (marks || []).forEach(function (m, j) {
      var x = X(m.k);
      s += '<circle cx="' + x + '" cy="30" r="8" style="fill:' + (m.c || 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>';
      if (m.lab) s += '<text x="' + Math.max(30, Math.min(530, x)) + '" y="' + (j % 2 ? 90 : 8) + '" text-anchor="middle" font-size="17" class="tb">' + m.lab + '</text>';
    });
    return A.svg(W, (marks || []).length > 1 ? 112 : 80, s + '</g>', label || 'Number line from ' + dec(a) + ' to ' + dec(b));
  }
  /* rounding hill for k (thousandths) to a step p (thousandths) */
  function hill(k, p) {
    var lo = Math.floor(k / p) * p, hi = lo + p, t = (k - lo) / p, up = k - lo >= p / 2;
    var x = 40 + 480 * t, y = 100 - 150 * t * (1 - t), s = '';
    s += '<defs><marker id="dha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>';
    s += '<path d="M40 100 Q280 -50 520 100" fill="none" style="stroke:var(--line)" stroke-width="10" stroke-linecap="round"/>';
    s += '<line x1="280" y1="25" x2="280" y2="132" style="stroke:var(--ink2)" stroke-dasharray="4 4" stroke-width="1.5"/>';
    s += '<line x1="40" y1="132" x2="520" y2="132" style="stroke:var(--ink)" stroke-width="3"/>';
    for (var i = 0; i <= 10; i++) { var tx = 40 + 48 * i; s += '<line x1="' + tx + '" y1="' + (i % 5 ? 126 : 122) + '" x2="' + tx + '" y2="' + (i % 5 ? 138 : 142) + '" style="stroke:var(--ink)" stroke-width="2"/>'; }
    var dp = p >= 1000 ? 0 : p >= 100 ? 1 : 2;
    [[40, lo, 'lower', dp], [280, lo + p / 2, 'halfway', dp + 1], [520, hi, 'upper', dp]].forEach(function (q) {
      s += '<text x="' + q[0] + '" y="164" text-anchor="middle" font-size="18" class="tb">' + dec(q[1], q[3]) + '</text><text x="' + q[0] + '" y="186" text-anchor="middle" class="t2" font-size="17">' + q[2] + '</text>';
    });
    if (k !== lo) { var ex = up ? 500 : 60; s += '<path d="M' + x + ' ' + (y - 16) + ' Q' + ((x + ex) / 2) + ' ' + (Math.min(y, 80) - 30) + ' ' + ex + ' 86" fill="none" style="stroke:var(--accent)" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#dha)"/>'; }
    s += '<circle cx="' + (k === lo ? 40 : up ? 520 : 40) + '" cy="132" r="11" style="fill:none;stroke:var(--accent)" stroke-width="4"/>';
    s += '<circle cx="' + x + '" cy="' + (y - 9) + '" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + Math.min(Math.max(x, 60), 500) + '" y="' + (y - 26) + '" text-anchor="middle" font-size="18" class="tb">' + dec(k) + '</text>';
    return A.svg(560, 196, s, dec(k) + ' on a hill between ' + dec(lo, dp) + ' and ' + dec(hi, dp) + '. It rounds to ' + dec(up ? hi : lo, dp) + '.');
  }
  /* n / d as a decimal with a bar over the repeating digits */
  function repdec(n, d) {
    var w = Math.floor(n / d), r = n % d, seen = {}, digs = '', i = 0;
    while (r && seen[r] === undefined && i < 20) { seen[r] = i++; r *= 10; digs += Math.floor(r / d); r %= d; }
    if (!r) return A.fmt(w) + (digs ? '.' + digs : '');
    var st = seen[r];
    return A.fmt(w) + '.' + digs.slice(0, st) + '<span class="rep">' + digs.slice(st) + '</span>';
  }
  function roundK(k, p) { return k - Math.floor(k / p) * p >= p / 2 ? Math.floor(k / p) * p + p : Math.floor(k / p) * p; }
  /* a bar cut into d equal parts with n shaded, and the matching decimal */
  function fbar(n, d, W) {
    W = W || 520; var s = '', cw = W / d, whole = Math.max(1, Math.ceil(n / d));
    for (var w = 0; w < whole; w++) for (var i = 0; i < d; i++) {
      var k = w * d + i;
      s += '<rect x="' + (2 + i * cw) + '" y="' + (2 + w * 46) + '" width="' + cw + '" height="38" style="fill:' + (k < n ? 'color-mix(in srgb,var(--strand) 75%,var(--card))' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="' + (d > 40 ? 0.6 : 1.5) + '"/>';
    }
    return A.svg(W + 4, whole * 46, s, n + ' of ' + d + ' equal parts shaded');
  }
  var FRAC = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [3, 20], [7, 20], [1, 25], [4, 25], [1, 50], [3, 50], [9, 100], [37, 100], [7, 1000], [125, 1000]];
  /* signed value in thousandths to text for mixed lists */
  function fr(n, d) { return A.fr(n, d); }

  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var CH = 'decimals', g = G6.g, lab = G6.lab, play = G6.play;
  var LESSONS = [
    { id: 'places', title: 'Decimal places', sub: 'tenths, hundredths, thousandths', concepts: [
      { id: 'tenths', title: 'Cutting a whole into tenths, hundredths, thousandths', exp: ['B1.4'], skill: 'dc-value',
        body: '<p>Right of the decimal point, each place is <b>one tenth</b> of the place to its left. Cut a whole into 10 strips, a strip into 10 squares, a square into 10 slivers.</p>',
        watch: play([
          ['One whole.', kgrid(1000, 26)],
          ['Cut it into 10 strips. Each strip is one tenth: 0.1.', kgrid(100, 26), '0.1'],
          ['Cut a strip into 10 squares. Each square is one hundredth: 0.01.', kgrid(10, 26), '0.01'],
          ['Cut a square into 10 slivers. Each sliver is one thousandth: 0.001.', kgrid(1, 26), '0.001'],
          ['0.345 is 3 tenths, 4 hundredths and 5 thousandths.', kgrid(345, 26), '0.345']
        ]),
        try: lab(CH, 0, 'Slide to shade exactly <b>0.25</b>.', function (h) { return +h.querySelector('#dgr').value === 250; }, 'Yes: 0.25 is 250 thousandths, a quarter of the whole.'),
        key: '<p>Each place to the right is one tenth of the place before it.</p>',
        check: [g(CH, 'dc-value', 1), g(CH, 'dc-value', 2)] },
      { id: 'read', title: 'Reading decimals', exp: ['B1.4'], skill: 'dc-value',
        body: '<p>Read the digits after the point as one number, then say the name of the <b>last</b> place. Say "and" for the decimal point.</p>',
        watch: play([
          ['0.345 ends in the thousandths place.', dchart(345, { vals: true }), 'three hundred forty-five thousandths'],
          ['2.07 ends in the hundredths place.', dchart(2070, { vals: true }), 'two and seven hundredths'],
          ['0.052 ends in the thousandths place.', dchart(52, { vals: true }), 'fifty-two thousandths']
        ]),
        key: '<p>Read the number after the point, then name the last place.</p>',
        mistake: '<p>Reading 0.052 as "fifty-two hundredths". Count the places: three digits after the point means thousandths.</p>',
        check: [{ q: 'Which decimal is <b>fifty-two thousandths</b>?', type: 'mc', options: ['0.52', '0.052', '0.502', '52.000'], answer: 1, hint: 'Thousandths means three digits after the point.', explain: 'Thousandths needs three decimal places: 0.052.' }, g(CH, 'dc-value', 2)] }
    ] },
    { id: 'compare', title: 'Comparing decimals', sub: 'line up the places', concepts: [
      { id: 'zeros', title: 'Line up and add zeros', exp: ['B1.4'], skill: 'dc-compare', hard: true,
        body: '<p>Line up the decimal points. Write zeros at the end so every number has the same number of places. Then compare from the <b>left</b>.</p>',
        watch: play([
          ['Which is greater: 0.5 or 0.45?', '<div class="vrow"><figure><figcaption>0.5</figcaption>' + kgrid(500, 14) + '</figure><figure><figcaption>0.45</figcaption>' + kgrid(450, 14) + '</figure></div>'],
          ['Write 0.5 as 0.50. Now both have two places.', '<p class="g6-big">0.5<b style="color:var(--hi)">0</b> &nbsp; and &nbsp; 0.45</p>'],
          ['Compare the tenths: 5 is more than 4.', '<p class="g6-big">0.<b style="color:var(--strand)">5</b>0 &gt; 0.<b style="color:var(--strand)">4</b>5</p>']
        ]),
        try: lab(CH, 1, 'Type two decimals where the one with <b>fewer digits</b> is the greater one.', function (h) { var a = h.querySelector('#dca').value, b = h.querySelector('#dcb').value; var la = (a.split('.')[1] || '').length, lb = (b.split('.')[1] || '').length; return (la < lb && +a > +b) || (lb < la && +b > +a); }, 'Yes: more digits does not mean bigger.'),
        ways: [
          { label: 'Think money', html: '<p>$0.50 is fifty cents. $0.45 is forty-five cents. Fifty cents is more, so 0.5 &gt; 0.45.</p>' },
          { label: 'Zoom in on a number line', html: '<div class="fig">' + dline(400, 600, 10, [{ k: 450, lab: '0.45' }, { k: 500, lab: '0.5' }], 'Number line from 0.4 to 0.6 with 0.45 and 0.5 marked') + '</div><p>0.5 is further right, so it is greater.</p>' }
        ],
        key: '<p>Same number of places, then compare from the left.</p>',
        mistake: '<p>Thinking a decimal with more digits is bigger. 0.45 has more digits than 0.5, but it is less. Adding a zero (0.50) makes the comparison fair.</p>',
        check: [{ q: 'Which is greater: <span class="math">0.7</span> or <span class="math">0.698</span>?', type: 'mc', options: ['0.7', '0.698', 'They are equal'], answer: 0, hint: '0.7 = 0.700. Compare from the left.', explain: '0.700 and 0.698: 7 tenths beats 6 tenths.' }, g(CH, 'dc-compare', 1), g(CH, 'dc-compare', 2)] }
    ] },
    { id: 'rounding', title: 'Rounding decimals', sub: 'roll to the nearest', concepts: [
      { id: 'hill', title: 'Round to the nearest tenth or hundredth', exp: ['B1.5'], skill: 'dc-round', hard: true,
        body: '<p>Find the two friendly numbers on either side. At or past halfway rolls <b>up</b>. Before halfway rolls back <b>down</b>.</p>',
        watch: play([
          ['Round 2.47 to the nearest tenth. It sits between 2.4 and 2.5.', hill(2470, 100)],
          ['Halfway is 2.45. 2.47 is past halfway, so it rolls up to 2.5.', hill(2470, 100), '2.47 &rarr; 2.5'],
          ['Round 2.43: before halfway, it rolls back to 2.4.', hill(2430, 100), '2.43 &rarr; 2.4']
        ]),
        try: lab(CH, 2, 'Find a number that rounds to <b>4.0</b> to the nearest tenth.', function (h) { var v = +h.querySelector('#drn').value; return h.querySelector('#drp').value === '100' && v >= 3.95 && v < 4.05 && v !== 4; }, 'Yes: it is within half a tenth of 4.'),
        ways: [
          { label: 'Look one place right', html: '<p>Look at the digit just to the <b>right</b> of the place you round to. 5 or more: round up. Less than 5: round down. 5.283 to the nearest hundredth: the next digit is 3, so 5.28.</p>' },
          { label: 'Carrying', html: '<p>3.96 to the nearest tenth: 9 tenths plus one more tenth is a whole. The answer is <b>4.0</b>.</p>' }
        ],
        key: '<p>Look one place to the right: 5 or more rounds up.</p>',
        mistake: '<p>Forgetting to carry. 3.96 rounded to the nearest tenth is <b>4.0</b>, not 3.10.</p>',
        check: [{ q: 'Round <span class="math">5.283</span> to the nearest hundredth.', type: 'mc', options: ['5.28', '5.29', '5.3', '5.2'], answer: 0, hint: 'Look one place to the right of the hundredths.', explain: 'The thousandths digit is 3, so round down: 5.28.' }, g(CH, 'dc-round', 1), g(CH, 'dc-round', 2)] },
      { id: 'repeat', title: 'Repeating decimals', exp: ['B1.5'], skill: 'dc-round',
        body: '<p>Some decimals never end. 2 &divide; 3 = 0.666&hellip; with the 6 repeating forever. A bar over the digit shows it repeats: 0.<span class="rep">6</span>.</p>',
        watch: play([
          ['Divide 2 by 3. Each step leaves 2 again.', '<p class="g6-big">2 &divide; 3 = 0.6&hellip;</p>'],
          ['So the 6 repeats forever.', '<p class="g6-big">0.6666666&hellip;</p>'],
          ['We write it with a bar.', '<p class="g6-big">0.<span class="rep">6</span></p>', 'rounded to the nearest hundredth: 0.67']
        ]),
        key: '<p>Terminating decimals stop. Repeating decimals go on forever, with a bar over the part that repeats.</p>',
        check: [g(CH, 'dc-round', 3)] }
    ] },
    { id: 'fractions', title: 'Fractions as decimals', sub: 'the same amount, two ways', concepts: [
      { id: 'tens', title: 'Tenths, hundredths, thousandths as fractions', exp: ['B1.6'], skill: 'dc-frac',
        body: '<p>When the bottom is 10, 100 or 1000, read the decimal straight off: ' + fr(7, 10) + ' = 0.7, ' + fr(23, 100) + ' = 0.23, ' + fr(9, 1000) + ' = 0.009.</p>',
        watch: play([
          ['7 tenths.', kgrid(700, 22), fr(7, 10) + ' = 0.7'],
          ['23 hundredths.', kgrid(230, 22), fr(23, 100) + ' = 0.23'],
          ['9 thousandths.', kgrid(9, 22), fr(9, 1000) + ' = 0.009']
        ]),
        key: '<p>The bottom number names the last place.</p>',
        check: [g(CH, 'dc-frac', 1)] },
      { id: 'divide', title: 'Any fraction as a decimal', exp: ['B1.6'], skill: 'dc-frac', hard: true,
        body: '<p>A fraction is a division: ' + fr(3, 4) + ' means 3 &divide; 4 = 0.75. Or make an equivalent fraction with a bottom of 10, 100 or 1000.</p>',
        watch: play([
          ['3 out of 4 equal parts.', fbar(3, 4, 420)],
          ['Make the bottom 100: multiply top and bottom by 25.', '<p class="g6-big">' + fr(3, 4) + ' = ' + fr(75, 100) + '</p>'],
          ['75 hundredths is 0.75.', kgrid(750, 22), '0.75']
        ]),
        try: lab(CH, 3, 'Find a fraction that equals <b>0.375</b>.', function (h) { return +h.querySelector('#fdn').value / +h.querySelector('#fdd').value === 0.375; }, 'Yes: 3/8 = 0.375.'),
        ways: [{ label: 'Divide top by bottom', html: '<p>7 &divide; 20: 20 goes into 70 three times (60), leaving 10. 20 goes into 100 five times. So ' + fr(7, 20) + ' = 0.35.</p>' }, { label: 'Use money', html: '<p>' + fr(1, 4) + ' of a dollar is a quarter, 25 cents: 0.25. ' + fr(3, 4) + ' is three quarters: 0.75.</p>' }],
        key: '<p>A fraction and its decimal are the same amount. Divide the top by the bottom.</p>',
        mistake: '<p>Writing ' + fr(1, 4) + ' as 0.4 (using the bottom number as the digit). ' + fr(1, 4) + ' means 1 &divide; 4 = 0.25.</p>',
        check: [{ q: 'Write ' + fr(7, 20) + ' as a decimal.', type: 'num', answer: 0.35, hint: 'Make the bottom 100: multiply top and bottom by 5.', explain: fr(7, 20) + ' = ' + fr(35, 100) + ' = 0.35.' }, g(CH, 'dc-frac', 2)] }
    ] },
    { id: 'mixed', title: 'Mixed lists', sub: 'decimals, fractions and integers together', concepts: [
      { id: 'order', title: 'Order a mixed list', exp: ['B1.3', 'B1.6'], skill: 'dc-order', hard: true,
        body: '<p>Change every number to a decimal. Then place them all on one number line and read from left to right.</p>',
        watch: play([
          ['Order 0.7, 3/4, −1, 0.07 and 1/2.', '<p class="g6-big">0.7, ' + fr(3, 4) + ', &minus;1, 0.07, ' + fr(1, 2) + '</p>'],
          ['As decimals: 0.7, 0.75, −1, 0.07, 0.5.', '<p class="g6-big">0.7, 0.75, &minus;1, 0.07, 0.5</p>'],
          ['Place them on one line.', dline(-1000, 1000, 100, [{ k: -1000, lab: '−1', c: 'var(--neg)' }, { k: 70, lab: '0.07' }, { k: 500, lab: '1/2' }, { k: 700, lab: '0.7' }, { k: 750, lab: '3/4' }], 'Number line from minus 1 to 1'), '&minus;1, 0.07, ' + fr(1, 2) + ', 0.7, ' + fr(3, 4)]
        ]),
        try: lab(CH, 4, 'Make a new list, sort it in your head, then show it on the line to check.', function (h) { return h.querySelector('#mxfig').innerHTML.length > 0; }, 'Check your order against the line.'),
        ways: [{ label: 'Negatives first', html: '<p>Any negative number is less than any positive one. Put the negatives on the left first, then sort the rest.</p>' }],
        key: '<p>Same form first (decimals), then one number line.</p>',
        mistake: '<p>Thinking &minus;0.5 is greater than &minus;0.2 because 5 is more than 2. &minus;0.5 is further left, so it is less.</p>',
        check: [{ q: 'Which is greatest: ' + fr(2, 5) + ', 0.35 or 0.04?', type: 'mc', options: ['2/5', '0.35', '0.04'], answer: 0, hint: 'Change ' + fr(2, 5) + ' to a decimal first.', explain: fr(2, 5) + ' = 0.4, which beats 0.35 and 0.04.' }, g(CH, 'dc-order', 1), g(CH, 'dc-order', 2)] }
    ] }
  ];

  A.register('decimals', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Tenths, hundredths, thousandths</h2>' +
'<p>To the right of the decimal point, each place is <b>one tenth</b> of the place to its left. Cut one whole into 10 strips: each strip is a <b class="d1t">tenth</b>. Cut a strip into 10 squares: each is a <b class="d2t">hundredth</b>. Cut a square into 10 slivers: each is a <b class="d3t">thousandth</b>.</p>' +
'<div class="row2"><div class="fig">' + kgrid(345, 26) + '</div><div>' + dchart(345, { vals: true }) + '<p class="t2" style="font-size:.95rem">0.345 = 3 tenths + 4 hundredths + 5 thousandths. Read it as <b>three hundred forty-five thousandths</b>.</p></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>To read a decimal, read the digits after the point as one number, then say the name of the <b>last</b> place. 0.345 ends in the thousandths place, so it is 345 thousandths. Say "and" for the decimal point: 2.07 is "two and seven hundredths".</p></div>' +
'<div class="lab"><span class="lt">Try it: shade a decimal</span>' +
'<div class="ctrl"><label for="dgr">Thousandths: <output id="dgo"></output></label><input type="range" id="dgr" min="0" max="1000" step="1" value="468"></div>' +
'<div class="row2"><div class="fig" id="dgfig"></div><div><div id="dgchart"></div><div class="out" id="dgout"></div></div></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>What is the value of the 6 in 4.0<b>6</b>2? It is in the hundredths place, so it is worth 6 hundredths, or <b>0.06</b>.</p></div>' +
A.yt({ q: 'Which decimal is <b>fifty-two thousandths</b>?', type: 'mc', options: ['0.52', '0.052', '0.502', '52.000'], answer: 1,
  hint: 'Say the rule: the last digit sits in the place you name. Thousandths means three digits after the point.', explain: 'Thousandths needs three decimal places: 0.052. The 2 is in the thousandths place.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Comparing and ordering decimals</h2>' +
'<p>Line up the decimal points. Write zeros at the end so every number has the same number of places. Then compare from the <b>left</b>, just like whole numbers.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Compare 0.5 and 0.45</th><th>Ones</th><th>.</th><th>Tenths</th><th>Hundredths</th></tr></thead><tbody>' +
'<tr><td class="l">0.5 = 0.50</td><td>0</td><td>.</td><td style="outline:3px solid var(--hi)"><b>5</b></td><td>0</td></tr>' +
'<tr><td class="l">0.45</td><td>0</td><td>.</td><td style="outline:3px solid var(--hi)"><b>4</b></td><td>5</td></tr></tbody></table></div>' +
'<p>The tenths are different: 5 tenths &gt; 4 tenths, so <b>0.5 &gt; 0.45</b>.</p>' +
'<div class="vrow"><figure><figcaption>0.5</figcaption>' + kgrid(500, 14) + '</figure><figure><figcaption>0.45</figcaption>' + kgrid(450, 14) + '</figure></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking a decimal with more digits is bigger. 0.45 has more digits than 0.5, but it is less. Adding a zero (0.50) makes the comparison fair.</p></div>' +
'<div class="lab"><span class="lt">Try it: zoom in to compare</span>' +
'<div class="ctrl"><label for="dca">First<input type="number" id="dca" min="0" max="10" step="0.001" value="2.35"></label><label for="dcb">Second<input type="number" id="dcb" min="0" max="10" step="0.001" value="2.305"></label></div>' +
'<div class="fig" id="dcfig"></div><div class="out" id="dcout"></div></div>' +
A.yt({ q: 'Which is greater: <span class="math">0.7</span> or <span class="math">0.698</span>?', type: 'mc', options: ['0.7', '0.698', 'They are equal'], answer: 0,
  hint: 'Say the rule: add zeros so both have three places, then compare from the left. 0.7 = 0.700.', explain: '0.700 and 0.698: the tenths are 7 and 6, so 0.7 is greater.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Rounding decimals</h2>' +
'<p>Rounding works the same way as with whole numbers. Find the two "friendly" numbers on either side. A number at or past halfway rolls <b>up</b>. A number before halfway rolls back <b>down</b>.</p>' +
'<div class="fig">' + hill(2470, 100) + '</div>' +
'<p>Without a picture: look at the digit just to the <b>right</b> of the place you are rounding to. 5 or more, round up. Less than 5, round down. 2.47 to the nearest tenth: the hundredths digit is 7, so <b>2.5</b>.</p>' +
'<div class="lab"><span class="lt">Try it: round a decimal</span>' +
'<div class="ctrl"><label for="drn">Number<input type="number" id="drn" min="0" max="100" step="0.001" value="3.846"></label>' +
'<label for="drp">Round to the nearest<select id="drp"><option value="1000">whole number</option><option value="100" selected>tenth</option><option value="10">hundredth</option></select></label></div>' +
'<div class="fig" id="drfig"></div><div class="out" id="drout"></div></div>' +
'<p>Some decimals never end. 2 &divide; 3 = 0.6666&hellip; with the 6 repeating forever. We write a bar over the digit that repeats: 0.<span class="rep">6</span>. These are called <b>repeating</b> decimals. Decimals that stop, like 0.75, are <b>terminating</b>.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>Round 0.<span class="rep">6</span> = 0.666&hellip; to the nearest hundredth. The hundredths are 0.66 and 0.67. The next digit is 6, which is 5 or more, so round up: <b>0.67</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Forgetting to carry. 3.96 rounded to the nearest tenth is <b>4.0</b>, not 3.10. Nine tenths plus one more tenth is one whole.</p></div>' +
A.yt({ q: 'Round <span class="math">5.283</span> to the nearest hundredth.', type: 'mc', options: ['5.28', '5.29', '5.3', '5.2'], answer: 0,
  hint: 'Say the rule: look one place to the right of the hundredths. Is that digit 5 or more?', explain: 'The thousandths digit is 3, less than 5, so round down: 5.28.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Fractions and decimals</h2>' +
'<p>A fraction is a division: ' + fr(3, 4) + ' means 3 &divide; 4 = 0.75. When the bottom is 10, 100 or 1000, you can read the decimal straight off: ' + fr(7, 10) + ' = 0.7, ' + fr(23, 100) + ' = 0.23, ' + fr(9, 1000) + ' = 0.009.</p>' +
'<p>Other fractions can often be made into tenths, hundredths or thousandths with an <b>equivalent fraction</b>: ' + fr(3, 8) + ' = ' + fr(375, 1000) + ' = 0.375 (multiply top and bottom by 125).</p>' +
'<div class="lab"><span class="lt">Try it: fraction to decimal</span>' +
'<div class="ctrl"><label for="fdn">Top (numerator)<input type="number" id="fdn" min="0" max="20" value="3"></label><label for="fdd">Bottom (denominator)<select id="fdd"><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option selected>8</option><option>10</option><option>20</option><option>25</option></select></label></div>' +
'<div class="fig" id="fdbar"></div><div class="row2"><div class="fig" id="fdgrid"></div><div class="out" id="fdout"></div></div></div>' +
'<div class="tbl"><table><thead><tr><th>Fraction</th><th>Decimal</th><th>Fraction</th><th>Decimal</th></tr></thead><tbody>' +
'<tr><td>' + fr(1, 2) + '</td><td>0.5</td><td>' + fr(1, 8) + '</td><td>0.125</td></tr><tr><td>' + fr(1, 4) + '</td><td>0.25</td><td>' + fr(3, 8) + '</td><td>0.375</td></tr>' +
'<tr><td>' + fr(3, 4) + '</td><td>0.75</td><td>' + fr(1, 3) + '</td><td>0.<span class="rep">3</span></td></tr><tr><td>' + fr(1, 5) + '</td><td>0.2</td><td>' + fr(2, 3) + '</td><td>0.<span class="rep">6</span></td></tr></tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>A fraction and its decimal are the same amount, written two ways. To change a fraction to a decimal, divide the top by the bottom.</p></div>' +
A.yt({ q: 'Write ' + fr(7, 20) + ' as a decimal.', type: 'num', answer: 0.35,
  hint: 'Make the bottom 100: multiply top and bottom by 5.', explain: fr(7, 20) + ' = ' + fr(35, 100) + ' = 0.35.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Ordering decimals, fractions and integers together</h2>' +
'<p>To order a mix of numbers, change them all to decimals, then place them on one number line. Negative numbers are on the left of zero.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>Order 0.7, ' + fr(3, 4) + ', &minus;1, 0.07 and ' + fr(1, 2) + ' from least to greatest.</p>' +
'<p>As decimals: 0.7, 0.75, &minus;1, 0.07, 0.5.</p>' +
'<div class="fig">' + dline(-1000, 1000, 100, [{ k: -1000, lab: '−1', c: 'var(--neg)' }, { k: 70, lab: '0.07' }, { k: 500, lab: '1/2' }, { k: 700, lab: '0.7' }, { k: 750, lab: '3/4' }], 'Number line from minus 1 to 1 with minus 1, 0.07, one half, 0.7 and three quarters marked') + '</div>' +
'<p>Least to greatest: <b>&minus;1, 0.07, ' + fr(1, 2) + ', 0.7, ' + fr(3, 4) + '</b>.</p></div>' +
'<div class="lab"><span class="lt">Try it: sort a mixed list</span>' +
'<div class="btnrow"><button type="button" class="btn alt" id="mxnew">New list</button><button type="button" class="btn" id="mxshow">Show them on the line</button></div>' +
'<p id="mxlist" class="big" style="font-family:var(--display);font-size:1.3rem"></p><div class="fig" id="mxfig"></div><div class="out" id="mxout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking &minus;0.5 is greater than &minus;0.2 because 5 is more than 2. &minus;0.5 is further left, so &minus;0.5 &lt; &minus;0.2.</p></div>' +
A.yt({ q: 'Which is greatest: ' + fr(2, 5) + ', 0.35 or 0.04?', type: 'mc', options: ['2/5', '0.35', '0.04'], answer: 0,
  hint: 'Change ' + fr(2, 5) + ' to a decimal first: 2 &divide; 5.', explain: fr(2, 5) + ' = 0.4. Compare 0.40, 0.35 and 0.04: 0.4 is greatest.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function dg() {
        var k = +$('#dgr', root).value;
        $('#dgo', root).textContent = dec(k, 3);
        $('#dgfig', root).innerHTML = kgrid(k, 26);
        $('#dgchart', root).innerHTML = dchart(k, { vals: true });
        var t = Math.floor(k / 100), h = Math.floor(k % 100 / 10), th = k % 10;
        $('#dgout', root).innerHTML = '<p><span class="big">' + dec(k) + '</span></p><p><b class="d1t">' + t + ' tenths</b> + <b class="d2t">' + h + ' hundredths</b> + <b class="d3t">' + th + ' thousandths</b></p><p><b>In words:</b> ' + (k === 1000 ? 'one (a whole square)' : dwords(k)) + '</p>';
      }
      A.bind(root, ['dgr'], dg);

      function rk(id) { var v = parseFloat($(id, root).value); if (isNaN(v)) v = 0; return Math.max(0, Math.min(10000, Math.round(v * 1000))); }
      function dc() {
        var a = rk('#dca'), b = rk('#dcb');
        var lo = Math.min(a, b), hi = Math.max(a, b), st = 1000;
        while (st > 1 && Math.floor(lo / st) === Math.floor(hi / st) && hi !== lo) st /= 10;
        if (hi === lo) st = 100;
        var L = Math.floor(lo / st) * st, H = L + st * (Math.floor(hi / st) === Math.floor(lo / st) ? 1 : Math.ceil((hi - L) / st) || 1);
        if (H - L > 10 * st) { L = Math.floor(lo / (st * 10)) * st * 10; H = Math.ceil(hi / (st * 10)) * st * 10; st *= 10; }
        if (H === L) H = L + st;
        var tick = (H - L) / 10;
        $('#dcfig', root).innerHTML = dline(L, H, tick, [{ k: a, lab: 'first' }, { k: b, lab: 'second', c: 'var(--strand)' }], 'Number line zoomed in from ' + dec(L) + ' to ' + dec(H), places(tick));
        var sym = a > b ? '&gt;' : a < b ? '&lt;' : '=', sa = dec(a, 3), sb = dec(b, 3), dif = -1;
        for (var i = 0; i < sa.length; i++) if (sa.charAt(i) !== sb.charAt(i)) { dif = i; break; }
        var pl = dif < 0 ? '' : dif > sa.indexOf('.') ? DP[dif - sa.indexOf('.')] : 'ones';
        $('#dcout', root).innerHTML = '<p><span class="big">' + dec(a) + ' ' + sym + ' ' + dec(b) + '</span></p><p>With three places: ' + sa + ' and ' + sb + '. ' + (dif < 0 ? 'Every digit matches.' : 'The first different digits are in the <b>' + pl + '</b> place.') + ' The line is zoomed in so each tick is ' + dec(tick) + '.</p>';
      }
      A.bind(root, ['dca', 'dcb'], dc);

      function dr() {
        var k = Math.max(0, Math.min(100000, Math.round((parseFloat($('#drn', root).value) || 0) * 1000))), p = +$('#drp', root).value;
        var r = roundK(k, p), dp = p === 1000 ? 0 : p === 100 ? 1 : 2, dgt = Math.floor(k % p / (p / 10));
        $('#drfig', root).innerHTML = hill(k, p);
        $('#drout', root).innerHTML = '<p><span class="big">' + dec(k) + ' &#8776; ' + dec(r, dp) + '</span></p><p>' +
          (k % p === 0 ? 'It is already on a ' + ['whole number', 'tenth', 'hundredth'][2 - dp] + '.' : 'The digit to the right of the rounding place is <b>' + dgt + '</b>, so round <b>' + (dgt >= 5 ? 'up' : 'down') + '</b>.') + '</p>';
      }
      A.bind(root, ['drn', 'drp'], dr);

      function fd() {
        var n = Math.max(0, Math.min(20, parseInt($('#fdn', root).value, 10) || 0)), d = +$('#fdd', root).value, v = n / d;
        $('#fdbar', root).innerHTML = fbar(n, d);
        var exact = Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-9, txt = exact ? dec(Math.round(v * 1000)) : repdec(n, d);
        $('#fdgrid', root).innerHTML = v <= 1 ? kgrid(Math.round(v * 1000), 18) : '';
        $('#fdout', root).innerHTML = '<p><span class="big">' + fr(n, d) + ' = ' + n + ' &divide; ' + d + ' = ' + txt + '</span></p>' +
          (exact && v <= 1 ? '<p>' + (d === 10 || d === 100 || d === 1000 ? 'The bottom is already ' + d + '.' : 'Equivalent fraction: ' + fr(n * 1000 / d, 1000) + '.') + '</p>' : '') +
          (!exact ? '<p>This decimal <b>repeats</b> forever. Rounded to the nearest hundredth: ' + (Math.round(v * 100) / 100).toFixed(2) + '.</p>' : '') +
          (v > 1 ? '<p>More than one whole, so the bar continues.</p>' : '');
      }
      A.bind(root, ['fdn', 'fdd'], fd);

      var mx = [];
      function mxNew() {
        var pool = [{ k: -1000, t: '−1' }, { k: -500, t: '−0.5' }, { k: -250, t: '−' + '1/4' }, { k: 250, t: '1/4' }, { k: 300, t: '0.3' }, { k: 30, t: '0.03' }, { k: 750, t: '3/4' }, { k: 800, t: '4/5' }, { k: 125, t: '0.125' }, { k: 600, t: '3/5' }, { k: 0, t: '0' }, { k: 1500, t: '1.5' }, { k: 1250, t: '1 1/4' }, { k: -200, t: '−0.2' }, { k: 875, t: '7/8' }, { k: 90, t: '0.09' }];
        var pick = [], used = {};
        while (pick.length < 5) { var p = R.pick(pool); if (!used[p.k]) { used[p.k] = 1; pick.push(p); } }
        mx = pick;
        $('#mxlist', root).textContent = mx.map(function (p) { return p.t; }).join(',   ');
        $('#mxfig', root).innerHTML = ''; $('#mxout', root).innerHTML = '<p class="t2">Change each to a decimal in your head, then press "Show them on the line".</p>';
      }
      function mxShow() {
        var s = mx.slice().sort(function (a, b) { return a.k - b.k; });
        $('#mxfig', root).innerHTML = dline(-1000, 1500, 250, s.map(function (p) { return { k: p.k, lab: p.t, c: p.k < 0 ? 'var(--neg)' : 'var(--hi)' }; }), 'Number line from minus 1 to 1.5 with the five numbers marked', 2);
        $('#mxout', root).innerHTML = '<p><b>As decimals:</b> ' + mx.map(function (p) { return p.t + ' = ' + dec(p.k); }).join(', ') + '</p><p><b>Least to greatest:</b> ' + s.map(function (p) { return p.t; }).join(', ') + '</p>';
      }
      $('#mxnew', root).addEventListener('click', mxNew);
      $('#mxshow', root).addEventListener('click', mxShow);
      mxNew();
    },

    quiz: [
      { q: 'What is the value of the digit 8 in <span class="math">3.0<u>8</u>4</span>?', type: 'mc', options: ['8', '0.8', '0.08', '0.008'], answer: 2, fig: dchart(3084, { hl: 2 }),
        hint: 'Count the places after the point: tenths, hundredths, thousandths.', explain: 'The 8 is in the hundredths place, so it is worth 0.08.' },
      { q: 'Which decimal is <b>two and fifteen thousandths</b>?', type: 'mc', options: ['2.15', '2.015', '2.150', '2.0015'], answer: 1,
        hint: 'Thousandths means 3 digits after the point.', explain: 'Fifteen thousandths is 0.015. Two and fifteen thousandths is 2.015.' },
      { q: 'Which list is in order from least to greatest?', type: 'mc', options: ['0.6, 0.06, 0.606', '0.06, 0.6, 0.606', '0.606, 0.6, 0.06', '0.06, 0.606, 0.6'], answer: 1,
        hint: 'Give each number three places: 0.600, 0.060, 0.606.', explain: '0.060 &lt; 0.600 &lt; 0.606.' },
      { q: 'Round <span class="math">7.962</span> to the nearest tenth.', type: 'mc', options: ['7.9', '8.0', '7.96', '8.1'], answer: 1, fig: hill(7962, 100),
        hint: 'The tenths on either side are 7.9 and 8.0. Look at the hundredths digit.', explain: 'The hundredths digit is 6, so round up. 7.9 + 0.1 = 8.0.' },
      { q: 'Write ' + A.fr(5, 8) + ' as a decimal.', type: 'num', answer: 0.625, fig: fbar(5, 8),
        hint: 'One eighth is 0.125. Five eighths is 5 of them.', explain: '5 &times; 0.125 = 0.625. Or 5 &divide; 8 = 0.625.' },
      { q: 'Round ' + A.fr(1, 3) + ' = 0.333&hellip; to the nearest hundredth.', type: 'num', answer: 0.33,
        hint: 'Look at the thousandths digit.', explain: 'The thousandths digit is 3, less than 5, so round down to 0.33.' },
      { q: 'Which is <b>least</b>?', type: 'mc', options: ['−0.3', '−0.25', '1/4', '0'], answer: 0,
        hint: 'The least number is furthest left on a number line.', explain: '&minus;0.3 = &minus;0.30 is further left than &minus;0.25. So &minus;0.3 is least.' }
    ],

    practice: [
      { id: 'dc-value', name: 'Value of a decimal digit', code: 'B1.4', gen: function (lv) {
        var k = lv === 1 ? R.int(1, 9) * 1000 + R.int(1, 9) * 100 + R.int(1, 9) * 10 + R.int(1, 9) : R.int(1000, 99999), s = dec(k, 3);
        var digs = s.split('.')[1];
        if (lv === 3) {
          var w = R.int(1, 3), n = R.int(1, Math.pow(10, w) - 1); if (n % 10 === 0) n++; var kk = R.int(0, 9) * 1000 + n * Math.pow(10, 3 - w);
          var ans = dwords(kk), wrong = [dwords(kk * 10 % 100000), b1000(n) + ' ' + DP[Math.min(3, w + 1)], b1000(n) + ' ' + DP[Math.max(1, w - 1)], dwords(kk + 1)].filter(function (x) { return x !== ans; });
          var o = R.mc(ans, wrong);
          return { q: 'Which is the word form of <span class="math">' + dec(kk) + '</span>?', type: 'mc', options: o.options, answer: o.answer, fig: dchart(kk), v: { k: kk },
            hint: 'Read the digits after the point as one number. Then name the last place.',
            steps: ['The whole number part is ' + Math.floor(kk / 1000) + '.', 'The digits after the point end in the ' + DP1[places(kk)] + 's place.', 'So ' + dec(kk) + ' is ' + ans + '.'], explain: dec(kk) + ' is ' + ans + '.' };
        }
        var i = R.int(0, 2); while (digs.charAt(i) === '0') i = R.int(0, 2);
        var d = +digs.charAt(i), val = d * Math.pow(10, 2 - i);
        var opts = [dec(val), dec(val * 10), dec(val / 10) , String(d)].filter(function (x, j, a) { return a.indexOf(x) === j; });
        if (val < 10 && opts.indexOf(dec(val * 100)) < 0) opts.push(dec(val * 100));
        var o2 = R.mc(dec(val), opts.slice(1));
        var ip = s.split('.')[0];
        return { q: 'What is the value of the <b>' + d + '</b> in <span class="math">' + ip + '.' + digs.slice(0, i) + '<u>' + d + '</u>' + digs.slice(i + 1) + '</span>?', type: 'mc', options: o2.options, answer: o2.answer,
          fig: dchart(k, { hl: i + 1 }), v: { k: k, i: i },
          hint: 'Find the place: the first place after the point is tenths, then hundredths, then thousandths.',
          steps: ['The ' + d + ' is in the <b>' + DP[i + 1] + '</b> place.', 'One ' + DP1[i + 1] + ' is ' + dec(Math.pow(10, 2 - i)) + '.', d + ' ' + DP[i + 1] + ' is ' + dec(val) + '.'],
          explain: 'The ' + d + ' is in the ' + DP[i + 1] + ' place, so it is worth ' + dec(val) + '.' };
      } },
      { id: 'dc-compare', name: 'Compare decimals', code: 'B1.4', gen: function (lv) {
        var a, b;
        if (lv === 1) { a = R.int(10, 99) * 10; b = R.int(10, 99) * 10; while (b === a) b = R.int(10, 99) * 10; a += 1000 * R.int(0, 3); b = b + Math.floor(a / 1000) * 1000; }
        else if (lv === 2) { a = R.int(1, 9) * 100; b = a - R.int(1, 9) * 10 + R.int(1, 9) * (R.int(0, 1) ? 1 : 0) ; if (R.int(0, 1)) { var t = a; a = b; b = t; } }
        else { a = R.int(100, 999); b = Math.floor(a / 10) * 10 + (a % 10 === 0 ? 5 : 0); if (b === a) b = a + 1; var w = R.int(0, 9) * 1000; a += w; b += w; }
        if (a === b) b = a + 10;
        var sym = a > b ? '&gt;' : '&lt;', o = R.mc(sym, ['&gt;', '&lt;', '=']), sa = dec(a, 3), sb = dec(b, 3);
        return { q: 'Which symbol goes in the box? <span class="math">' + dec(a) + ' &#9633; ' + dec(b) + '</span>', type: 'mc', options: o.options, answer: o.answer, v: { a: a, b: b },
          fig: lv === 1 ? '<div class="vrow"><figure><figcaption>' + dec(a % 1000) + '</figcaption>' + kgrid(a % 1000, 12) + '</figure><figure><figcaption>' + dec(b % 1000) + '</figcaption>' + kgrid(b % 1000, 12) + '</figure></div>' : '',
          hint: 'Write both with three decimal places, then compare from the left.',
          steps: ['Add zeros so both have three places: ' + sa + ' and ' + sb + '.', 'Compare from the left. Find the first place where the digits differ.', 'So ' + dec(a) + ' ' + sym + ' ' + dec(b) + '.'],
          explain: sa + ' ' + sym + ' ' + sb + '.' };
      } },
      { id: 'dc-round', name: 'Round decimals', code: 'B1.5', gen: function (lv) {
        var p = lv === 1 ? R.pick([1000, 100]) : lv === 2 ? R.pick([100, 10]) : R.pick([100, 10]), k = R.int(1000, 19999);
        if (lv === 1) k = Math.floor(k / 10) * 10;
        var rep = null;
        if (lv === 3 && R.int(0, 1)) {
          rep = R.pick([[1, 3], [2, 3], [1, 6], [5, 6], [1, 9], [4, 9], [7, 9], [5, 3], [7, 3]]);
          var v = rep[0] / rep[1], ans = p === 100 ? Math.round(v * 10) / 10 : Math.round(v * 100) / 100, nm = p === 100 ? 'tenth' : 'hundredth';
          var str = v.toFixed(5) + '&hellip;';
          var wrong = [p === 100 ? Math.floor(v * 10) / 10 + (Math.round(v * 10) / 10 === Math.floor(v * 10) / 10 ? 0.1 : 0) : Math.floor(v * 100) / 100 + (Math.round(v * 100) === Math.floor(v * 100) ? 0.01 : 0), Math.round(v * 1000) / 1000, Math.round(v)].map(function (x) { return String(Math.round(x * 1000) / 1000); });
          var dpN = p === 100 ? 1 : 2, o = R.mc(ans.toFixed(dpN), wrong.map(function (x) { return (+x).toFixed(x.split('.')[1] ? Math.min(3, x.split('.')[1].length) : 0); }));
          return { q: A.fr(rep[0], rep[1]) + ' = ' + str + ' Round it to the nearest <b>' + nm + '</b>.', type: 'mc', options: o.options, answer: o.answer, v: { n: rep[0], d: rep[1], p: p },
            hint: 'Look at the digit just to the right of the ' + nm + 's place.',
            steps: ['Write the decimal: ' + str, 'The digit after the ' + nm + 's place is ' + v.toFixed(5).charAt(dpN + 3) + '.', (+v.toFixed(5).charAt(dpN + 3) >= 5 ? 'It is 5 or more, so round up' : 'It is less than 5, so round down') + ': ' + ans.toFixed(dpN) + '.'],
            explain: str + ' rounds to ' + ans.toFixed(dpN) + '.' };
        }
        var r = roundK(k, p), dp = p === 1000 ? 0 : p === 100 ? 1 : 2, nm2 = ['whole number', 'tenth', 'hundredth'][dp], lo = Math.floor(k / p) * p;
        if (k === lo) k += p / 10 * R.int(1, 9), r = roundK(k, p);
        lo = Math.floor(k / p) * p;
        var dg = Math.floor(k % p / (p / 10));
        var o3 = R.mc(dec(r, dp), [dec(r === lo ? lo + p : lo, dp), dec(roundK(k, p / 10), dp + 1), dec(Math.floor(k / (p / 10)) * (p / 10), dp + 1)]);
        return { q: 'Round <span class="math">' + dec(k) + '</span> to the nearest <b>' + nm2 + '</b>.', type: 'mc', options: o3.options, answer: o3.answer, v: { k: k, p: p },
          fig: lv < 3 ? hill(k, p) : '', hint: lv < 3 ? 'Is the ball before or past the top of the hill?' : 'Find the ' + nm2 + 's on either side, then look at the next digit.',
          steps: ['The ' + nm2 + 's on either side are ' + dec(lo, dp) + ' and ' + dec(lo + p, dp) + '.', 'The digit just to the right of the ' + nm2 + 's place is ' + dg + '.', (dg >= 5 ? '5 or more rounds up' : 'Less than 5 rounds down') + ', to ' + dec(r, dp) + '.' + (lv === 3 ? '<div class="fig">' + hill(k, p) + '</div>' : '')],
          explain: dec(k) + ' rounds to ' + dec(r, dp) + '.' };
      } },
      { id: 'dc-frac', name: 'Fractions as decimals', code: 'B1.6', gen: function (lv) {
        var f = lv === 1 ? R.pick([[1, 2], [3, 10], [7, 10], [23, 100], [9, 100], [1, 4], [3, 4], [1, 5], [4, 5], [51, 100]]) : lv === 2 ? R.pick([[2, 5], [3, 5], [7, 20], [9, 20], [3, 25], [7, 50], [1, 8], [9, 1000], [47, 1000]]) : R.pick([[3, 8], [5, 8], [7, 8], [11, 20], [13, 25], [21, 50], [123, 1000], [7, 40], [9, 40]]);
        var k = f[0] * 1000 / f[1], mult = [10, 100, 1000].map(function (b) { return b % f[1] === 0 ? b / f[1] : 0; }), m = 0, base = 0;
        for (var i = 0; i < 3; i++) if (mult[i]) { m = mult[i]; base = [10, 100, 1000][i]; break; }
        if (lv === 3 && R.int(0, 1)) {
          var o = R.mc(A.fr(f[0], f[1]), [A.fr(f[0] + 1, f[1]), A.fr(f[0], f[1] * 2), A.fr(f[1] - f[0] > 0 ? f[1] - f[0] : f[0] + 2, f[1])]);
          return { q: 'Which fraction equals <span class="math">' + dec(k) + '</span>?', type: 'mc', options: o.options, answer: o.answer, v: { n: f[0], d: f[1], k: k },
            hint: 'Write ' + dec(k) + ' as a fraction over ' + base + ', then simplify.', steps: [dec(k) + ' = ' + A.fr(f[0] * m, base) + '.', 'Divide top and bottom by ' + m + '.', 'So ' + dec(k) + ' = ' + A.fr(f[0], f[1]) + '.'], explain: dec(k) + ' = ' + A.fr(f[0] * m, base) + ' = ' + A.fr(f[0], f[1]) + '.' };
        }
        return { q: 'Write ' + A.fr(f[0], f[1]) + ' as a decimal.', type: 'num', answer: k / 1000, fig: f[1] <= 50 ? fbar(f[0], f[1]) : '', v: { n: f[0], d: f[1] },
          hint: base === f[1] ? 'The bottom is already ' + base + '. Count the decimal places.' : 'Make the bottom ' + base + ': multiply top and bottom by ' + m + '.',
          steps: [base === f[1] ? 'The bottom is ' + base + ', so the decimal has ' + (String(base).length - 1) + ' places.' : 'Multiply top and bottom by ' + m + ': ' + A.fr(f[0], f[1]) + ' = ' + A.fr(f[0] * m, base) + '.', A.fr(f[0] * m, base) + ' means ' + f[0] * m + ' ' + DP[String(base).length - 1] + '.', 'As a decimal: ' + dec(k) + '.'],
          explain: A.fr(f[0], f[1]) + ' = ' + A.fr(f[0] * m, base) + ' = ' + dec(k) + '.' };
      } },
      { id: 'dc-order', name: 'Order decimals, fractions and integers', code: 'B1.3', gen: function (lv) {
        var pool = lv === 1 ? [[100, '0.1'], [10, '0.01'], [110, '0.11'], [1000, '1'], [101, '0.101'], [500, '0.5'], [50, '0.05'], [550, '0.55']]
          : lv === 2 ? [[500, '1/2'], [450, '0.45'], [250, '1/4'], [300, '0.3'], [750, '3/4'], [700, '0.7'], [200, '1/5'], [125, '1/8'], [600, '3/5']]
          : [[-500, '−0.5'], [-1000, '−1'], [-250, '−1/4'], [0, '0'], [250, '1/4'], [-200, '−0.2'], [750, '0.75'], [-750, '−3/4'], [1500, '1.5'], [400, '2/5']];
        var pick = R.shuffle(pool).slice(0, 4), s = pick.slice().sort(function (a, b) { return a[0] - b[0]; });
        var f = function (l) { return l.map(function (p) { return p[1]; }).join(', '); };
        var w2 = pick.slice().sort(function (a, b) { return Math.abs(a[0]) - Math.abs(b[0]); });
        var w3 = pick.slice().sort(function (a, b) { return a[1].length - b[1].length || a[0] - b[0]; });
        var o = R.mc(f(s), [f(s.slice().reverse()), f(w2), f(w3), f([s[1], s[0], s[2], s[3]])]);
        return { q: 'Which list is in order from <b>least to greatest</b>?', type: 'mc', options: o.options, answer: o.answer, v: { ans: o.options[o.answer] },
          hint: lv === 1 ? 'Give every number three decimal places, then compare.' : 'Change every fraction to a decimal first.' + (lv === 3 ? ' Negatives are the least.' : ''),
          steps: ['As decimals: ' + pick.map(function (p) { return p[1] + ' = ' + dec(p[0], lv === 1 ? 3 : 0); }).join(', ') + '.', 'Place them on a number line.<div class="fig">' + dline(lv === 3 ? -1000 : 0, lv === 3 ? 1500 : 1000, lv === 3 ? 250 : 100, s.map(function (p) { return { k: p[0], c: p[0] < 0 ? 'var(--neg)' : 'var(--hi)' }; }), 'Number line with the four numbers', 2) + '</div>', 'Left to right: ' + f(s) + '.'],
          explain: 'Least to greatest: ' + f(s) + '.' };
      } }
    ]
  });
  /* ---------- practice shapes: more ways to ask each skill (docs/QUESTIONS.md). Answer checks: tests/verify/grade6.js ---------- */
  (function () {
    var Q = A.Q, why = G6.why, nm = Q.name;
    /* k is in thousandths with a 1-digit whole part; i is the decimal place (0 tenths, 1 hundredths, 2 thousandths) */
    function uk(k, i) { var s = dec(k, 3), p = s.split('.'); return '<span class="math">' + p[0] + '.' + p[1].split('').map(function (c, j) { return j === i ? '<u>' + c + '</u>' : c; }).join('') + '</span>'; }
    function k4() { return R.int(1, 9) * 1000 + R.int(1, 9) * 100 + R.int(1, 9) * 10 + R.int(1, 9); }
    function dval(k, i) { return +dec(k, 3).split('.')[1].charAt(i) * Math.pow(10, 2 - i); }
    function hits(opts, test) { return opts.map(function (x, j) { return test(x) ? j : -1; }).filter(function (j) { return j >= 0; }); }
    function txt(p) { return p[1]; }
    var SHAPES = {
      'dc-value': [
        [1, 'tap', function () {
          var k = k4(), i = R.int(0, 2), s = dec(k, 3).replace('.', '');
          return { q: 'Tap the digit in the <b>' + DP[i + 1] + '</b> place of <span class="math">' + dec(k, 3) + '</span>.', type: 'tap', tiles: s.split(''), answer: i + 1, answerText: 'the ' + s.charAt(i + 1),
            hint: 'After the point: tenths, then hundredths, then thousandths.', steps: ['The ' + DP[i + 1] + ' place is digit ' + (i + 1) + ' after the point.'],
            explain: 'The ' + DP[i + 1] + ' digit of ' + dec(k, 3) + ' is ' + s.charAt(i + 1) + '.', meta: { k: 'g6-dval-tap', n: k, i: i } };
        }],
        [1, 'story', function () {
          var c = R.pick([['A runner finished the 100 m in', 's'], ['A puppy has a mass of', 'kg'], ['A raindrop fell', 'cm'], ['A pencil is', 'dm long']]);
          var k = R.int(10, 19) * 1000 + R.int(1, 9) * 100 + R.int(1, 9) * 10 + R.int(1, 9), i = R.int(0, 2);
          return { q: c[0] + ' ' + uk(k, i) + ' ' + c[1] + '. What is the underlined digit worth?', type: 'num', answer: dval(k, i) / 1000,
            hint: 'Name the place of the underlined digit.', steps: ['It is in the ' + DP[i + 1] + ' place.'], explain: 'It is worth ' + dec(dval(k, i)) + '.', meta: { k: 'g6-dval-num', n: k, i: i } };
        }],
        [1, 'mistake', function () {
          var k = k4(), i = R.int(0, 2), d = dval(k, i) / Math.pow(10, 2 - i), who = nm(), truth = !R.int(0, 2), said = truth ? dval(k, i) : (i ? dval(k, i) * 10 : dval(k, i) / 10);
          var right = 'The ' + d + ' is in the ' + DP[i + 1] + ' place, so it is worth ' + dec(dval(k, i)) + '.';
          return { q: who + ' says the underlined digit in ' + uk(k, i) + ' is worth <b>' + dec(said) + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['The first digit after the point is hundredths.', 'A digit is always worth just itself.']), hint: 'Count places after the point: tenths, hundredths, thousandths.',
            steps: [right], explain: right, meta: { k: 'g6-dval-tf', n: k, i: i, said: said } };
        }],
        [2, 'match', function () {
          var items = [0, 1, 2].map(function (i) { return [k4(), i]; });
          return { q: 'Match each underlined digit to what it is worth.', type: 'match', pairs: items.map(function (t) { return [uk(t[0], t[1]), dec(dval(t[0], t[1]))]; }),
            hint: 'Tenths, hundredths, thousandths.', steps: ['The first place after the point is tenths.'], explain: items.map(function (t) { return dec(t[0], 3) + ': ' + dec(dval(t[0], t[1])); }).join('. ') + '.', meta: { k: 'g6-dval-match', items: items } };
        }]
      ],
      'dc-compare': [
        [1, 'order', function () {
          var w = R.int(0, 3) * 1000, ks = [];
          while (ks.length < 4) { var x = w + R.pick([R.int(1, 9) * 100, R.int(1, 99) * 10, R.int(1, 999)]); if (ks.indexOf(x) < 0) ks.push(x); }
          ks.sort(function (a, b) { return a - b; });
          return { q: 'Put these decimals in order from least to greatest.', type: 'order', items: ks.map(function (k) { return dec(k); }), first: 'least', last: 'greatest',
            hint: 'Give each one three decimal places.', steps: ['With three places: ' + ks.map(function (k) { return dec(k, 3); }).join(', ') + '.'], explain: ks.map(function (k) { return dec(k); }).join(', ') + '.', meta: { k: 'g6-dcmp-order' } };
        }],
        [1, 'mistake', function () {
          var w = R.int(0, 5) * 1000, a = w + R.int(1, 9) * 10 + R.int(1, 9), b = w + R.int(1, 9) * 100, who = nm();
          return { q: who + ' says <span class="math">' + dec(a) + ' &gt; ' + dec(b) + '</span> because it has more digits. True or false: ' + who + ' is right.', type: 'tf', answer: a > b,
            why: why('With three places it is ' + dec(a, 3) + ' and ' + dec(b, 3) + ', so ' + dec(Math.max(a, b)) + ' is greater.', ['More digits always means a bigger decimal.', 'Decimals cannot be compared.']),
            hint: 'Add zeros so both have the same number of places.', steps: [dec(a, 3) + ' and ' + dec(b, 3) + '.'], explain: dec(Math.max(a, b)) + ' is greater.', meta: { k: 'g6-dcmp-tf', a: a, b: b } };
        }],
        [1, 'line', function () {
          var h = R.int(1, 99); if (h % 10 === 0) h++;
          return { q: 'Place <b>' + dec(h * 10) + '</b> on the number line.', type: 'line', min: 0, max: 1, tick: 0.1, every: 0.5, snap: 0.01, answer: h / 100, tol: 0.01,
            hint: dec(h * 10) + ' is ' + Math.floor(h / 10) + ' tenths and ' + h % 10 + ' hundredths.', steps: ['Find ' + dec(Math.floor(h / 10) * 100, 1) + ', then go a little further.'],
            explain: dec(h * 10) + ' is between ' + dec(Math.floor(h / 10) * 100, 1) + ' and ' + dec(Math.floor(h / 10) * 100 + 100, 1) + '.', meta: { k: 'g6-dcmp-line' } };
        }],
        [2, 'pick', function () {
          var x = R.int(2, 8) * 100 + R.int(1, 9) * 10, opts, ans;
          do { opts = []; while (opts.length < 5) { var y = R.pick([R.int(1, 9) * 100, R.int(10, 99) * 10, R.int(100, 999)]); if (opts.indexOf(y) < 0 && y !== x) opts.push(y); } ans = hits(opts, function (y) { return y > x; }); } while (!ans.length || ans.length === 5);
          return { q: 'Pick every decimal greater than <b>' + dec(x) + '</b>.', type: 'pick', options: opts.map(function (k) { return dec(k); }), answer: ans,
            hint: 'Give every number three places.', steps: [dec(x) + ' = ' + dec(x, 3) + '.'], explain: ans.map(function (j) { return dec(opts[j]); }).join(', ') + '.', meta: { k: 'g6-dcmp-pick', x: x, opts: opts } };
        }]
      ],
      'dc-round': [
        [1, 'story', function () {
          var k = R.int(1000, 9999); if (k % 100 === 50) k++;
          var c = R.pick(['A bag of apples has a mass of ' + dec(k) + ' kg. The scale shows one decimal place.', nm() + ' ran ' + dec(k) + ' km. The app shows one decimal place.', 'A jug holds ' + dec(k) + ' L. The label shows one decimal place.']);
          return { q: c + ' What number does it show?', type: 'num', answer: roundK(k, 100) / 1000, hint: 'Round to the nearest tenth.', steps: ['Look at the hundredths digit.'],
            explain: dec(k) + ' rounds to ' + dec(roundK(k, 100), 1) + '.', meta: { k: 'g6-round-num', n: k } };
        }],
        [1, 'mistake', function () {
          var k = R.int(1000, 9999), who = nm(); if (k % 100 < 50) k += 50;
          var truth = !R.int(0, 2), said = truth ? roundK(k, 100) : Math.floor(k / 100) * 100;
          return { q: who + ' rounds <span class="math">' + dec(k) + '</span> to the nearest tenth and gets <b>' + dec(said, 1) + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why('The hundredths digit is 5 or more, so it rounds up to ' + dec(roundK(k, 100), 1) + '.', ['Rounding always means dropping the extra digits.', 'Rounding always goes down.']),
            hint: 'Look at the hundredths digit.', steps: ['5 or more rounds up.'], explain: dec(k) + ' rounds to ' + dec(roundK(k, 100), 1) + '.', meta: { k: 'g6-round-tf', n: k, said: said } };
        }],
        [1, 'pick', function () {
          var t = R.int(11, 89), opts, ans;
          do { opts = []; while (opts.length < 5) { var y = t * 10 + R.int(-9, 9); if (opts.indexOf(y) < 0) opts.push(y); } ans = hits(opts, function (y) { return Math.round(y / 10) === t; }); } while (!ans.length || ans.length === 5);
          return { q: 'Pick every number that rounds to <b>' + (t / 10).toFixed(1) + '</b> (nearest tenth).', type: 'pick', options: opts.map(function (y) { return (y / 100).toFixed(2); }), answer: ans,
            hint: 'From ' + ((t * 10 - 5) / 100).toFixed(2) + ' up to ' + ((t * 10 + 4) / 100).toFixed(2) + ' rounds to ' + (t / 10).toFixed(1) + '.', steps: ['Round each one. Keep those that land on ' + (t / 10).toFixed(1) + '.'],
            explain: ans.map(function (j) { return (opts[j] / 100).toFixed(2); }).join(', ') + ' round to ' + (t / 10).toFixed(1) + '.', meta: { k: 'g6-round-pick', t: t, opts: opts } };
        }]
      ],
      'dc-frac': [
        [1, 'match', function () {
          var fs = R.shuffle(FRAC.filter(function (f) { return f[1] <= 100; })).slice(0, 3);
          return { q: 'Match each fraction to its decimal.', type: 'match', pairs: fs.map(function (f) { return [fr(f[0], f[1]), dec(f[0] * 1000 / f[1])]; }),
            hint: 'Make the bottom 10, 100 or 1000.', steps: ['For example, ' + A.fr(1, 4) + ' = ' + A.fr(25, 100) + ' = 0.25.'], explain: fs.map(function (f) { return f[0] + '/' + f[1] + ' = ' + dec(f[0] * 1000 / f[1]); }).join('. ') + '.', meta: { k: 'g6-frac-match', fs: fs } };
        }],
        [1, 'fill', function () {
          var f = R.pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [7, 20], [9, 25], [3, 50], [11, 20]]), h = f[0] * 100 / f[1];
          return { q: 'Write ' + fr(f[0], f[1]) + ' in hundredths, then as a decimal.', type: 'fill', fill: '[[]] hundredths = [[]]', answers: [h, h / 100],
            hint: 'What times ' + f[1] + ' makes 100?', steps: [f[1] + ' &times; ' + 100 / f[1] + ' = 100, so ' + f[0] + ' &times; ' + 100 / f[1] + ' = ' + h + '.'], explain: fr(f[0], f[1]) + ' = ' + h + ' hundredths = ' + dec(h * 10) + '.', meta: { k: 'g6-frac-fill', n: f[0], d: f[1] } };
        }],
        [1, 'mistake', function () {
          var f = R.pick([[1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 8], [3, 20]]), who = nm(), truth = !R.int(0, 2), said = truth ? f[0] * 1000 / f[1] : f[0] * 100 + (f[1] < 10 ? f[1] * 10 : f[1]);
          return { q: who + ' says ' + fr(f[0], f[1]) + ' = <b>' + dec(said) + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(fr(f[0], f[1]) + ' means ' + f[0] + ' &divide; ' + f[1] + ', which is ' + dec(f[0] * 1000 / f[1]) + '.', ['Write the top, a point, then the bottom.', 'Every fraction is less than 0.5.']),
            hint: 'A fraction is a division: top &divide; bottom.', steps: [f[0] + ' &divide; ' + f[1] + ' = ' + dec(f[0] * 1000 / f[1]) + '.'], explain: fr(f[0], f[1]) + ' = ' + dec(f[0] * 1000 / f[1]) + '.', meta: { k: 'g6-frac-tf', n: f[0], d: f[1], said: said / 1000 } };
        }]
      ],
      'dc-order': [
        [1, 'order', function (lv) {
          var pool = [[500, '1/2'], [450, '0.45'], [250, '1/4'], [300, '0.3'], [750, '3/4'], [700, '0.7'], [200, '1/5'], [600, '3/5'], [1000, '1'], [50, '0.05']];
          if (lv > 1) pool = pool.concat([[-500, '−0.5'], [-1000, '−1'], [-250, '−1/4'], [1500, '1.5']]);
          var pick = R.shuffle(pool).slice(0, 4).sort(function (a, b) { return a[0] - b[0]; });
          return { q: 'Put these numbers in order from least to greatest.', type: 'order', items: pick.map(txt), first: 'least', last: 'greatest',
            hint: 'Change each fraction to a decimal first.', steps: ['As decimals: ' + pick.map(function (p) { return p[1] + ' = ' + dec(p[0]); }).join(', ') + '.'], explain: pick.map(txt).join(', ') + '.', meta: { k: 'g6-dord-order' } };
        }],
        [1, 'line', function () {
          var f = R.pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 10], [7, 10], [9, 10], [1, 20], [7, 20]]);
          return { q: 'Place <b>' + f[0] + '/' + f[1] + '</b> on the number line.', type: 'line', min: 0, max: 1, tick: 0.05, every: 0.25, snap: 0.05, answer: f[0] / f[1],
            hint: 'Change ' + f[0] + '/' + f[1] + ' to a decimal.', steps: [f[0] + '/' + f[1] + ' = ' + dec(f[0] * 1000 / f[1]) + '.'], explain: f[0] + '/' + f[1] + ' = ' + dec(f[0] * 1000 / f[1]) + '.', meta: { k: 'g6-dord-line', n: f[0], d: f[1] } };
        }],
        [1, 'mistake', function () {
          var pool = [[500, '1/2'], [450, '0.45'], [250, '1/4'], [300, '0.3'], [750, '3/4'], [700, '0.7'], [200, '1/5'], [600, '3/5'], [125, '1/8'], [400, '0.4']];
          var two = R.shuffle(pool).slice(0, 2), who = nm();
          return { q: who + ' says <b>' + two[0][1] + '</b> is greater than <b>' + two[1][1] + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: two[0][0] > two[1][0],
            why: why('As decimals they are ' + dec(two[0][0]) + ' and ' + dec(two[1][0]) + '.', ['A fraction is always less than a decimal.', 'The number with bigger digits is greater.']),
            hint: 'Change both to decimals.', steps: [two[0][1] + ' = ' + dec(two[0][0]) + ', ' + two[1][1] + ' = ' + dec(two[1][0]) + '.'], explain: (two[0][0] > two[1][0] ? two[0][1] : two[1][1]) + ' is greater.', meta: { k: 'g6-dord-tf' } };
        }]
      ]
    };
    G6.shapes(CH, SHAPES);
  })();
})();
