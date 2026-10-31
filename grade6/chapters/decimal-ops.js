(function () {
  var A = Atlas, R = A.R;
  /* k is in thousandths */
  function dec(k, dp) {
    var neg = k < 0; k = Math.abs(Math.round(k));
    var w = Math.floor(k / 1000), f = ('00' + (k % 1000)).slice(-3).replace(/0+$/, '');
    while (f.length < (dp || 0)) f += '0';
    return (neg ? '−' : '') + A.fmt(w) + (f ? '.' + f : '');
  }
  function dp(k) { return ('00' + (Math.abs(k) % 1000)).slice(-3).replace(/0+$/, '').length; }
  var PC = ['var(--p2)', 'var(--p1)', 'var(--p0)', 'var(--d1)', 'var(--d2)', 'var(--d3)'];
  /* column layout: numbers lined up on the decimal point, with coloured place columns */
  function columns(a, b, op, showAns) {
    var places = Math.max(dp(a), dp(b), 1), res = op > 0 ? a + b : a - b;
    var rows = [a, b, res].map(function (k) { return dec(k, places).replace(/ /g, ''); });
    var wl = Math.max.apply(null, rows.map(function (r) { return r.split('.')[0].length; }));
    var heads = ['H', 'T', 'O'].slice(3 - wl).concat(['', 't', 'h', 'th'].slice(0, places + 1));
    var cols = wl + 1 + places;
    var h = '<div class="tbl"><table class="colsum" style="min-width:0;margin:0 auto"><thead><tr><th style="background:none;border:0"></th>' + heads.map(function (x, i) {
      if (i === wl) return '<th style="background:none;border:0"></th>';
      var c = i < wl ? ['var(--p0)', 'var(--p1)', 'var(--p2)'][wl - 1 - i] : ['var(--d1)', 'var(--d2)', 'var(--d3)'][i - wl - 1];
      return '<th style="background:' + c + ';color:' + (c === 'var(--p0)' ? '#1d2430' : '#fff') + '">' + x + '</th>';
    }).join('') + '</tr></thead><tbody>';
    rows.forEach(function (r, ri) {
      if (ri === 2 && !showAns) return;
      var p = r.split('.'), w = p[0], f = p[1] || '';
      while (w.length < wl) w = ' ' + w;
      var cells = (w + '.' + f).split('');
      h += '<tr' + (ri === 2 ? ' style="border-top:3px solid var(--ink)"' : '') + '><td style="border:0;font-weight:700">' + (ri === 1 ? (op > 0 ? '+' : '&minus;') : ri === 2 ? '=' : '') + '</td>' + cells.map(function (c, ci) {
        return '<td style="' + (c === '.' ? 'border:0;font-weight:700;padding:6px 2px' : '') + (ri === 2 ? ';font-weight:700' : '') + (ri < 2 && f.length < places && false ? '' : '') + '">' + (c === ' ' ? '' : c) + '</td>';
      }).join('') + '</tr>';
    });
    return h + '</tbody></table></div>';
  }
  /* area model: whole number w split by place value, times a decimal t (in tenths) */
  function area(w, t) {
    var parts = String(w).split('').map(function (d, i, a) { return +d * Math.pow(10, a.length - 1 - i); }).filter(Boolean);
    var W = 520, H = 120, x = 10, s = '', total = w;
    parts.forEach(function (p, i) {
      var pw = Math.max(70, (W - 20) * p / total);
      if (i === parts.length - 1) pw = Math.max(70, W - x - 10);
      s += '<rect x="' + x + '" y="34" width="' + pw + '" height="' + H + '" style="fill:color-mix(in srgb,' + ['var(--p2)', 'var(--p1)', 'var(--p0)'][3 - String(p).length < 0 ? 0 : String(w).length - String(p).length] + ' 22%,var(--card));stroke:var(--ink)" stroke-width="2"/>' +
        '<text x="' + (x + pw / 2) + '" y="24" text-anchor="middle" font-size="21" class="tb">' + A.fmt(p) + '</text>' +
        '<text x="' + (x + pw / 2) + '" y="' + (34 + H / 2 + 7) + '" text-anchor="middle" font-size="21" font-weight="700">' + dec(p * t * 100) + '</text>';
      x += pw;
    });
    s += '<text x="' + (x + 6) + '" y="' + (34 + H / 2 + 6) + '" font-size="21" class="tb">' + dec(t * 100) + '</text>';
    return A.svg(x + 60, H + 44, s, 'Area model: ' + w + ' times ' + dec(t * 100) + ' split into ' + parts.join(' + '));
  }
  /* decimal disks for sharing: k thousandths shared into n groups */
  function share(k, n) {
    var q = Math.round(k / n), digs = [Math.floor(q / 1000), Math.floor(q / 100) % 10, Math.floor(q / 10) % 10, q % 10], s = '', gw = 120, W = Math.min(n, 5) * gw, rows = Math.ceil(n / 5);
    var cols = ['var(--p0)', 'var(--d1)', 'var(--d2)', 'var(--d3)'], labs = ['1', '0.1', '0.01', '.001'];
    for (var g = 0; g < n; g++) {
      var gx = (g % 5) * gw + 4, gy = Math.floor(g / 5) * 120 + 4, y = gy + 18, i = 0;
      s += '<rect x="' + gx + '" y="' + gy + '" width="' + (gw - 8) + '" height="112" rx="8" style="fill:var(--card);stroke:var(--line)" stroke-width="1.5"/>';
      digs.forEach(function (d, p) {
        for (var j = 0; j < d; j++, i++) {
          var cx = gx + 14 + (i % 5) * 20, cy = gy + 16 + Math.floor(i / 5) * 20;
          s += '<circle cx="' + cx + '" cy="' + cy + '" r="8.5" style="fill:' + cols[p] + '" stroke="rgba(0,0,0,.4)"/>';
        }
      });
    }
    return A.svg(W, rows * 120, s, k / 1000 + ' shared into ' + n + ' equal groups: ' + dec(q) + ' in each');
  }
  function legend() {
    return '<div class="legend"><span><i style="background:var(--p0)"></i>1</span><span><i style="background:var(--d1)"></i>0.1</span><span><i style="background:var(--d2)"></i>0.01</span><span><i style="background:var(--d3)"></i>0.001</span></div>';
  }
  /* long division steps for k thousandths divided by n, as a list */
  function longDiv(k, n) {
    var s = dec(k, 3).replace(/ /g, ''), out = [], rem = 0, q = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === '.') { q += '.'; continue; }
      var cur = rem * 10 + +c, d = Math.floor(cur / n);
      rem = cur - d * n; q += d;
      out.push('<span class="math">' + cur + ' &divide; ' + n + ' = ' + d + (rem ? ' R ' + rem : '') + '</span>' + (rem ? ', carry ' + rem + ' to the next place' : ''));
    }
    return { steps: out, q: q.replace(/^0+(?=\d)/, '') };
  }

  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var CH = 'decimal-ops', g = G6.g, lab = G6.lab, play = G6.play;
  var LESSONS = [
    { id: 'estimate', title: 'Estimate first', sub: 'friendly numbers and order of operations', concepts: [
      { id: 'friendly', title: 'Estimate with friendly numbers', exp: ['B2.4'], skill: 'do-est',
        body: '<p>Before you calculate, round each number to a friendly number and do the easy version. The estimate shows where the decimal point belongs.</p>',
        watch: play([
          ['39.7 − 18.25. Round each number.', '<p class="g6-big">39.7 &minus; 18.25</p>'],
          ['39.7 is about 40. 18.25 is about 20.', '<p class="g6-big">40 &minus; 20 = 20</p>'],
          ['The exact answer, 21.45, is close to 20. It makes sense.', '<p class="g6-big">21.45 &#8776; 20 &#10003;</p>']
        ]),
        key: '<p>Estimate, calculate, then check: is the answer close?</p>',
        mistake: '<p>Skipping the estimate and trusting a misplaced decimal point (2.145 instead of 21.45). Ask for an estimate out loud before any calculation.</p>',
        check: [{ q: 'Which is the best estimate for <span class="math">39.7 &minus; 18.25</span>?', type: 'mc', options: ['about 2', 'about 20', 'about 58', 'about 200'], answer: 1, hint: '39.7 is about 40. 18.25 is about 20.', explain: '40 &minus; 20 = 20.' }, g(CH, 'do-est', 1), g(CH, 'do-est', 2)] },
      { id: 'steps', title: 'Problems with several steps', exp: ['B2.1'], skill: 'do-multi',
        body: '<p>The <b>order of operations</b> still applies: brackets first, then &times; and &divide; left to right, then + and &minus; left to right.</p>',
        watch: play([
          ['3 notebooks at $2.45 and a pen at $1.60.', '<p class="g6-big">3 &times; 2.45 + 1.60</p>'],
          ['Multiply first.', '<p class="g6-big">7.35 + 1.60</p>'],
          ['Then add.', '<p class="g6-big">$8.95</p>', 'estimate: 3 &times; 2.5 + 1.5 = 9 &#10003;']
        ]),
        key: '<p>Brackets, then &times; and &divide;, then + and &minus;.</p>',
        check: [g(CH, 'do-multi', 1), g(CH, 'do-multi', 2)] }
    ] },
    { id: 'addsub', title: 'Adding and subtracting', sub: 'line up the points', concepts: [
      { id: 'lineup', title: 'Line up the decimal points', exp: ['B2.4'], skill: 'do-addsub', hard: true,
        body: '<p>Line up the <b>decimal points</b> so tenths sit under tenths. Fill empty places with zeros. Then add or subtract like whole numbers.</p>',
        watch: play([
          ['14.6 + 3.275. Write 14.6 as 14.600.', columns(14600, 3275, 1, false)],
          ['Add each column from the right. Bring the point straight down.', columns(14600, 3275, 1, true), '17.875'],
          ['20 − 6.45: write 20 as 20.00.', columns(20000, 6450, -1, true), '13.55']
        ]),
        try: lab(CH, 0, 'Subtract a number with <b>3 decimal places</b> from a whole number.', function (h) { var a = h.querySelector('#asa').value, b = h.querySelector('#asb').value; return h.querySelector('#aso').value === '-1' && Number.isInteger(+a) && (b.split('.')[1] || '').length === 3; }, 'Fill the whole number with zeros: 20 = 20.000.'),
        ways: [{ label: 'Think money', html: '<p>$20 &minus; $6.45: a twenty-dollar bill minus six dollars forty-five cents. Count up: $6.45 + $0.55 = $7, then $7 + $13 = $20. Change: $13.55.</p>' }],
        key: '<p>Points in a line. Zeros fill the gaps.</p>',
        mistake: '<p>Lining up the last digits instead of the decimal points. In 14.6 + 3.275, the 6 is 6 tenths and the 5 is 5 thousandths: not the same column.</p>',
        check: [{ q: '<span class="math">20 &minus; 6.45 = ?</span>', type: 'num', answer: 13.55, hint: '20 = 20.00. Line up the points.', explain: '20.00 &minus; 6.45 = 13.55.' }, g(CH, 'do-addsub', 1), g(CH, 'do-addsub', 2)] }
    ] },
    { id: 'mult', title: 'Multiplying by tenths', sub: 'a whole number times 0.1 to 0.9', concepts: [
      { id: 'tenths', title: 'Times tenths', exp: ['B2.7'], skill: 'do-mult', hard: true,
        body: '<p>0.3 is 3 tenths. So 245 &times; 0.3 = (245 &times; 3) &divide; 10. Multiply, then divide by 10.</p>',
        watch: play([
          ['245 × 0.3: split 245 into 200 + 40 + 5.', area(245, 3)],
          ['Each part times 0.3: 60 + 12 + 1.5.', area(245, 3), '60 + 12 + 1.5 = 73.5'],
          ['Check: 245 × 3 = 735, and 735 ÷ 10 = 73.5.', '<p class="g6-big">245 &times; 0.3 = 73.5</p>']
        ]),
        try: lab(CH, 1, 'Make a product between <b>100 and 200</b>.', function (h) { var w = +h.querySelector('#mtw').value, s = h.querySelector('#mtt'), t = parseFloat(s.options[s.selectedIndex].text); return w * t >= 100 && w * t <= 200; }, 'Yes. Notice the answer is less than the whole number.'),
        ways: [{ label: 'Smaller, not bigger', html: '<p>Times a number less than 1 gives <b>less</b> than you started with. 245 &times; 0.3 is about a third of 245, around 80.</p>' }, { label: 'Money', html: '<p>245 dimes is 245 &times; $0.10 = $24.50. 3 times that is 245 &times; 0.3 = $73.50.</p>' }],
        key: '<p>Multiply by the digit, then divide by 10.</p>',
        mistake: '<p>Forgetting the decimal point: 245 &times; 0.3 is not 735. Estimate: about a third of 240 is 80.</p>',
        check: [{ q: '<span class="math">160 &times; 0.4 = ?</span>', type: 'num', answer: 64, hint: 'Multiply by 4, then divide by 10.', explain: '640 &divide; 10 = 64.' }, g(CH, 'do-mult', 1), g(CH, 'do-mult', 2)] }
    ] },
    { id: 'divt', title: 'Dividing by tenths', sub: 'how many fit?', concepts: [
      { id: 'scale', title: 'Multiply both by 10', exp: ['B2.8'], skill: 'do-divt', hard: true,
        body: '<p>120 &divide; 0.4 asks: how many 0.4s fit in 120? Multiply <b>both</b> numbers by 10. The answer does not change, and now you divide by a whole number.</p>',
        watch: play([
          ['120 ÷ 0.4', '<p class="g6-big">120 &divide; 0.4</p>'],
          ['Multiply both by 10.', '<p class="g6-big">1200 &divide; 4</p>'],
          ['1200 ÷ 4 = 300. Bigger than 120, because 0.4 is small.', '<p class="g6-big">= 300</p>']
        ]),
        try: lab(CH, 2, 'Find a division with an answer over <b>1000</b>.', function (h) { var w = +h.querySelector('#dtw').value, s = h.querySelector('#dtt'), t = parseFloat(s.options[s.selectedIndex].text); return w / t > 1000; }, 'Yes: small divisors give big answers.'),
        ways: [{ label: 'Halves', html: '<p>150 &divide; 0.5: there are 2 halves in every 1, so 150 has 300 halves.</p>' }],
        key: '<p>Times 10 on both sides, then divide by a whole number.</p>',
        mistake: '<p>Expecting a smaller answer. Dividing by a number less than 1 always gives a bigger answer.</p>',
        check: [{ q: '<span class="math">150 &divide; 0.5 = ?</span>', type: 'num', answer: 300, hint: 'Multiply both by 10: 1500 &divide; 5.', explain: '1500 &divide; 5 = 300.' }, g(CH, 'do-divt', 1), g(CH, 'do-divt', 2)] },
      { id: 'remainder', title: 'What to do with a remainder', exp: ['B2.8'], skill: 'do-divt',
        body: '<p>Read the question to decide: ignore the remainder (how many full pieces), round up (how many boxes are needed), or write it as a decimal.</p>',
        watch: play([
          ['125 m of rope cut into 0.3 m pieces.', '<p class="g6-big">125 &divide; 0.3 = 1250 &divide; 3</p>'],
          ['1250 ÷ 3 = 416 remainder 2.', '<p class="g6-big">416 R 2</p>'],
          ['416 whole pieces. The 2 tenths of a metre left over is 0.2 m.', '<p class="g6-big">416 pieces, 0.2 m left</p>']
        ]),
        key: '<p>The question decides what the remainder means.</p>',
        check: [g(CH, 'do-divt', 3)] }
    ] },
    { id: 'share', title: 'Sharing a decimal', sub: 'a decimal divided by a whole number', concepts: [
      { id: 'trade', title: 'Share, then trade the leftovers', exp: ['B2.11'], skill: 'do-divw', hard: true,
        body: '<p>Share the biggest place first. Trade any leftover for 10 of the next smaller place. The point in the answer goes above the point in the number.</p>',
        watch: play([
          ['Share 4.536 into 6 equal groups.', legend() + share(4536, 6)],
          ['Long division keeps track of each trade.', longDiv(4536, 6), '4.536 &divide; 6 = 0.756']
        ]),
        try: lab(CH, 3, 'Choose a decimal and a group size that shares with <b>no leftover</b>.', function (h) { var k = Math.round(+h.querySelector('#sdk').value * 1000), n = +h.querySelector('#sdn').value; return k > 0 && k % n === 0; }, 'Every group gets the same, down to the thousandths.'),
        ways: [{ label: 'Rice', html: '<p>Four friends share 2.6 kg of rice. 2 ones cannot be shared by 4, so trade for 20 tenths: 26 tenths &divide; 4 = 6 tenths, 2 left. Trade for 20 hundredths: &divide; 4 = 5. Each gets <b>0.65 kg</b>.</p>' }],
        key: '<p>Leftovers become 10 of the next place.</p>',
        mistake: '<p>Stopping at a remainder. With decimals you can write zeros at the end (2.6 = 2.60) and keep going.</p>',
        check: [{ q: '<span class="math">7.38 &divide; 3 = ?</span>', type: 'num', answer: 2.46, hint: '7 &divide; 3 = 2 R 1. Trade the 1 for tenths.', explain: '2.46.' }, g(CH, 'do-divw', 1), g(CH, 'do-divw', 2)] }
    ] }
  ];

  A.register('decimal-ops', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Estimate first</h2>' +
'<p>Before you calculate, <b>estimate</b>. Round each number to a friendly number and do the easy version. Your estimate tells you where the decimal point belongs and catches big mistakes.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Problem</th><th class="l">Friendly numbers</th><th>Estimate</th></tr></thead><tbody>' +
'<tr><td class="l">12.8 + 6.35</td><td class="l">13 + 6</td><td>about 19</td></tr>' +
'<tr><td class="l">48.95 &minus; 19.6</td><td class="l">49 &minus; 20</td><td>about 29</td></tr>' +
'<tr><td class="l">412 &times; 0.3</td><td class="l">400 &times; 0.3 = 400 &times; 3 &divide; 10</td><td>about 120</td></tr>' +
'<tr><td class="l">7.38 &divide; 4</td><td class="l">8 &divide; 4</td><td>about 2</td></tr></tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>Estimate, calculate, then check: is the answer close to the estimate? If not, look again at where you put the decimal point.</p></div>' +
'<p>When a problem has several steps, the <b>order of operations</b> still applies: brackets first, then &times; and &divide; from left to right, then + and &minus; from left to right.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>3 notebooks at $2.45 each and a pen at $1.60. Total = 3 &times; 2.45 + 1.60. Multiply first: 7.35. Then add: 7.35 + 1.60 = <b>$8.95</b>. Estimate: 3 &times; 2.5 + 1.5 = 9. Close, so the answer makes sense.</p></div>' +
A.yt({ q: 'Which is the best estimate for <span class="math">39.7 &minus; 18.25</span>?', type: 'mc', options: ['about 2', 'about 20', 'about 58', 'about 200'], answer: 1,
  hint: 'Say the rule: round each number to a friendly number first. 39.7 is about 40.', explain: '40 &minus; 20 = 20. The exact answer is 21.45.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Adding and subtracting decimals</h2>' +
'<p>Line up the <b>decimal points</b>, so tenths are under tenths and hundredths under hundredths. Fill empty places with zeros. Then add or subtract like whole numbers, and bring the decimal point straight down.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>14.6 + 3.275. Write 14.6 as 14.600 so both have three places.</p>' + columns(14600, 3275, 1, true) + '<p>Estimate: 15 + 3 = 18. Answer: <b>17.875</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Lining up the last digits instead of the decimal points. In 14.6 + 3.275, the 6 is 6 tenths and the 5 is 5 thousandths. They do not go in the same column.</p></div>' +
'<div class="lab"><span class="lt">Try it: line up and calculate</span>' +
'<div class="ctrl"><label for="asa">First number<input type="number" id="asa" min="0" max="999" step="0.001" value="25.4"></label><label for="aso">Operation<select id="aso"><option value="1">+</option><option value="-1">&minus;</option></select></label><label for="asb">Second number<input type="number" id="asb" min="0" max="999" step="0.001" value="8.76"></label></div>' +
'<div id="asfig"></div><div class="out" id="asout"></div></div>' +
A.yt({ q: '<span class="math">20 &minus; 6.45 = ?</span>', type: 'num', answer: 13.55,
  hint: 'Say the rule: line up the points and fill with zeros. 20 = 20.00.', explain: '20.00 &minus; 6.45 = 13.55. Check: 13.55 + 6.45 = 20.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Multiplying a whole number by tenths</h2>' +
'<p>0.3 is 3 tenths. So 245 &times; 0.3 is the same as 245 &times; 3 tenths. Multiply by 3, then divide by 10 to make tenths:</p>' +
'<p class="math" style="font-size:1.15rem;white-space:normal">245 &times; 0.3 = (245 &times; 3) &divide; 10 = 735 &divide; 10 = <b>73.5</b></p>' +
'<div class="fig">' + area(245, 3) + '</div>' +
'<p>The area model splits 245 into 200 + 40 + 5. Each part times 0.3: 60 + 12 + 1.5 = 73.5.</p>' +
'<div class="key"><b class="t">Key idea</b><p>Multiplying by a number <b>less than 1</b> makes the answer <b>smaller</b>. 245 &times; 0.3 is less than 245. Multiplying by a number more than 1 makes it bigger: 245 &times; 1.2 = 294.</p></div>' +
'<div class="lab"><span class="lt">Try it: whole number times tenths</span>' +
'<div class="ctrl"><label for="mtw">Whole number (100 to 999)<input type="number" id="mtw" min="100" max="999" value="324"></label><label for="mtt">Times<select id="mtt"></select></label></div>' +
'<div class="fig" id="mtfig"></div><div class="out" id="mtout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Forgetting the decimal point. 245 &times; 0.3 is not 735. Estimate: a third of 240 is about 80, so 73.5 makes sense.</p></div>' +
A.yt({ q: '<span class="math">160 &times; 0.4 = ?</span>', type: 'num', answer: 64,
  hint: 'Say the steps: multiply by 4, then divide by 10.', explain: '160 &times; 4 = 640. 640 &divide; 10 = 64.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Dividing a whole number by tenths</h2>' +
'<p>120 &divide; 0.4 asks: <b>how many 0.4s fit in 120?</b> Dividing by a number less than 1 gives a <b>bigger</b> answer.</p>' +
'<p>Trick: multiply <b>both</b> numbers by 10. The answer does not change, and now you divide by a whole number.</p>' +
'<div class="fig" id="scalefig"></div>' +
'<div class="lab"><span class="lt">Try it: divide by tenths</span>' +
'<div class="ctrl"><label for="dtw">Whole number (100 to 999)<input type="number" id="dtw" min="100" max="999" value="120"></label><label for="dtt">Divide by<select id="dtt"></select></label></div>' +
'<div class="fig" id="dtfig"></div><div class="out" id="dtout"></div></div>' +
'<p>Sometimes there is a <b>remainder</b>. What you do with it depends on the question.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>You have 125 m of rope and cut it into 0.3 m pieces. 125 &divide; 0.3 = 1250 &divide; 3 = 416 R 2. You get <b>416 whole pieces</b>, and 0.2 m of rope is left over (the remainder 2 is 2 tenths of a metre).</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Read the question to decide about a remainder: ignore it (how many full pieces), round up (how many boxes are needed), or write it as a decimal.</p></div>' +
A.yt({ q: '<span class="math">150 &divide; 0.5 = ?</span>', type: 'num', answer: 300,
  hint: 'Say the trick: multiply both by 10. 1500 &divide; 5.', explain: '150 &divide; 0.5 = 1500 &divide; 5 = 300. There are 2 halves in every 1, so 150 has 300 halves.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Dividing a decimal by a whole number</h2>' +
'<p>Share the decimal into equal groups. Start at the biggest place. Any leftover is traded for 10 of the next smaller place, just like with whole numbers. The decimal point in the answer goes right above the decimal point in the number.</p>' +
'<div class="lab"><span class="lt">Try it: share a decimal</span>' +
'<div class="ctrl"><label for="sdk">Decimal (up to thousandths)<input type="number" id="sdk" min="0.001" max="9.999" step="0.001" value="4.536"></label><label for="sdn">Share into<select id="sdn"><option>2</option><option>3</option><option>4</option><option>5</option><option selected>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select></label></div>' +
legend() + '<div class="fig" id="sdfig"></div><div class="out" id="sdout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Four friends share a 2.6 kg bag of rice equally. 2.6 &divide; 4: 2 &divide; 4 = 0 R 2. Trade 2 ones for 20 tenths: 26 tenths &divide; 4 = 6 R 2. Write a 0 in the hundredths: 20 hundredths &divide; 4 = 5. Each friend gets <b>0.65 kg</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Stopping when there is a remainder. With decimals you can write zeros at the end (2.6 = 2.60) and keep going.</p></div>' +
A.yt({ q: '<span class="math">7.38 &divide; 3 = ?</span>', type: 'num', answer: 2.46,
  hint: 'Say the steps: share the ones, then trade the leftover for tenths. 7 &divide; 3 = 2 R 1.', explain: '7 &divide; 3 = 2 R 1. 13 tenths &divide; 3 = 4 R 1. 18 hundredths &divide; 3 = 6. Answer 2.46.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function k(id, mx) { var v = parseFloat($(id, root).value); if (isNaN(v) || v < 0) v = 0; return Math.min(mx * 1000, Math.round(v * 1000)); }
      function as() {
        var a = k('#asa', 999), b = k('#asb', 999), op = +$('#aso', root).value;
        if (op < 0 && b > a) { $('#asfig', root).innerHTML = ''; $('#asout', root).innerHTML = '<p>The second number is bigger, so the answer would be negative. Swap them to subtract.</p>'; return; }
        var r = op > 0 ? a + b : a - b;
        $('#asfig', root).innerHTML = columns(a, b, op, true);
        $('#asout', root).innerHTML = '<p><span class="big">' + dec(a) + ' ' + (op > 0 ? '+' : '&minus;') + ' ' + dec(b) + ' = ' + dec(r) + '</span></p><p>Estimate: ' + Math.round(a / 1000) + ' ' + (op > 0 ? '+' : '&minus;') + ' ' + Math.round(b / 1000) + ' = ' + (op > 0 ? Math.round(a / 1000) + Math.round(b / 1000) : Math.round(a / 1000) - Math.round(b / 1000)) + '.</p>';
      }
      A.bind(root, ['asa', 'asb', 'aso'], as);
      var T = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 25];
      $('#mtt', root).innerHTML = T.map(function (t) { return '<option value="' + t + '"' + (t === 6 ? ' selected' : '') + '>' + dec(t * 100) + '</option>'; }).join('');
      $('#dtt', root).innerHTML = T.map(function (t) { return '<option value="' + t + '"' + (t === 4 ? ' selected' : '') + '>' + dec(t * 100) + '</option>'; }).join('');
      function mt() {
        var w = Math.max(100, Math.min(999, parseInt($('#mtw', root).value, 10) || 100)), t = +$('#mtt', root).value, r = w * t;
        $('#mtfig', root).innerHTML = area(w, t);
        $('#mtout', root).innerHTML = '<p><span class="big">' + w + ' &times; ' + dec(t * 100) + ' = ' + dec(r * 100) + '</span></p><p>' + w + ' &times; ' + t + ' = ' + A.fmt(r) + ', then &divide; 10 = ' + dec(r * 100) + '. ' + (t < 10 ? 'Times less than 1: the answer is smaller than ' + w + '.' : 'Times more than 1: the answer is bigger than ' + w + '.') + '</p>';
      }
      A.bind(root, ['mtw', 'mtt'], mt);
      function scale(w, t) {
        var s = '<rect x="10" y="10" width="230" height="64" rx="10" style="fill:var(--card);stroke:var(--strand)" stroke-width="2.5"/><text x="125" y="52" text-anchor="middle" font-size="24" font-weight="700">' + A.fmt(w) + ' &#247; ' + dec(t * 100) + '</text>' +
          '<rect x="320" y="10" width="230" height="64" rx="10" style="fill:color-mix(in srgb,var(--strand) 12%,var(--card));stroke:var(--strand)" stroke-width="2.5"/><text x="435" y="52" text-anchor="middle" font-size="24" font-weight="700">' + A.fmt(w * 10) + ' &#247; ' + t + '</text>' +
          '<line x1="244" y1="42" x2="312" y2="42" style="stroke:var(--ink)" stroke-width="2.5" marker-end="url(#scl)"/><text x="278" y="30" text-anchor="middle" font-size="19" class="tb">&#215; 10</text>' +
          '<defs><marker id="scl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink)"/></marker></defs>';
        return A.svg(560, 84, s, w + ' divided by ' + dec(t * 100) + ' is the same as ' + w * 10 + ' divided by ' + t);
      }
      $('#scalefig', root).innerHTML = scale(120, 4);
      function dt() {
        var w = Math.max(100, Math.min(999, parseInt($('#dtw', root).value, 10) || 100)), t = +$('#dtt', root).value, big = w * 10, q = Math.floor(big / t), r = big % t;
        $('#dtfig', root).innerHTML = scale(w, t);
        var dq = r ? (big / t) : q;
        $('#dtout', root).innerHTML = '<p><span class="big">' + A.fmt(w) + ' &divide; ' + dec(t * 100) + ' = ' + A.fmt(big) + ' &divide; ' + t + ' = ' + A.fmt(q) + (r ? ' R ' + r : '') + '</span></p>' +
          (r ? '<p>' + A.fmt(q) + ' whole groups of ' + dec(t * 100) + ', with ' + dec(r * 100) + ' left over. As a decimal: about ' + (Math.round(dq * 100) / 100) + '.</p>' : '<p>Exactly ' + A.fmt(q) + ' groups of ' + dec(t * 100) + ' fit in ' + w + '.</p>') +
          '<p class="t2">' + (t < 10 ? 'Dividing by less than 1 gives an answer bigger than ' + w + '.' : 'Dividing by more than 1 gives an answer smaller than ' + w + '.') + '</p>';
      }
      A.bind(root, ['dtw', 'dtt'], dt);
      function sd() {
        var kk = Math.max(1, k('#sdk', 9.999)), n = +$('#sdn', root).value, ld = longDiv(kk, n), exact = kk % n === 0;
        $('#sdfig', root).innerHTML = share(exact ? kk : kk - kk % n, n);
        $('#sdout', root).innerHTML = '<p><span class="big">' + dec(kk) + ' &divide; ' + n + ' = ' + (exact ? dec(kk / n) : 'about ' + (Math.round(kk / n) / 1000)) + '</span></p>' +
          '<p>Each group shown has ' + dec(Math.floor(kk / n)) + '.' + (exact ? '' : ' There is a little left over in the thousandths, so the answer goes on past three places.') + '</p><ol>' + ld.steps.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
      }
      A.bind(root, ['sdk', 'sdn'], sd);
    },

    quiz: [
      { q: '<span class="math">23.7 + 5.48 = ?</span>', type: 'num', answer: 29.18, fig: columns(23700, 5480, 1, false),
        hint: 'Line up the decimal points. 23.7 = 23.70.', explain: '23.70 + 5.48 = 29.18. Estimate: 24 + 5 = 29.' },
      { q: '<span class="math">15 &minus; 7.36 = ?</span>', type: 'num', answer: 7.64,
        hint: 'Write 15 as 15.00.', explain: '15.00 &minus; 7.36 = 7.64. Check: 7.64 + 7.36 = 15.' },
      { q: '<span class="math">312 &times; 0.6 = ?</span>', type: 'num', answer: 187.2, fig: area(312, 6),
        hint: 'Multiply 312 by 6, then divide by 10.', explain: '312 &times; 6 = 1872. 1872 &divide; 10 = 187.2.' },
      { q: '<span class="math">240 &divide; 0.8 = ?</span>', type: 'num', answer: 300,
        hint: 'Multiply both numbers by 10: 2400 &divide; 8.', explain: '2400 &divide; 8 = 300. Check: 300 &times; 0.8 = 240.' },
      { q: '<span class="math">5.634 &divide; 6 = ?</span>', type: 'num', answer: 0.939,
        hint: '5 &divide; 6 is 0, so trade 5 ones for 50 tenths: 56 tenths &divide; 6.', explain: '56 tenths &divide; 6 = 9 R 2. 23 hundredths &divide; 6 = 3 R 5. 54 thousandths &divide; 6 = 9. Answer 0.939.' },
      { q: 'Juice boxes hold 0.2 L. How many can you fill from a 125 L tank? Then how many litres are left?', type: 'mc', options: ['625 boxes, 0 L left', '62 boxes, 0.5 L left', '625 boxes, 0.2 L left', '25 boxes, 0 L left'], answer: 0,
        hint: '125 &divide; 0.2 = 1250 &divide; 2.', explain: '1250 &divide; 2 = 625 with no remainder. Every 1 L fills 5 boxes, and 125 &times; 5 = 625.' },
      { q: 'Sam buys 4 bus tickets at $3.25 each and pays with a $20 bill. How much change does he get?', type: 'num', answer: 7, unit: '$',
        hint: 'Multiply first, then subtract from 20.', explain: '4 &times; 3.25 = 13.00. 20.00 &minus; 13.00 = $7.00.' }
    ],

    practice: [
      { id: 'do-est', name: 'Estimate first', code: 'B2.4', gen: function (lv) {
        var a = R.int(lv === 1 ? 10 : 20, 99) * 1000 + R.int(1, 99) * 10, b = R.int(2, 40) * 1000 + R.int(1, 99) * 10, op = R.pick(['+', '−']);
        if (lv === 3) { var w = R.int(2, 9) * 100 + R.int(1, 49); var t = R.int(2, 9); var e = Math.round(w / 100) * 100 * t / 10;
          var o0 = R.mc('about ' + A.fmt(e), ['about ' + A.fmt(e * 10), 'about ' + A.fmt(e / 10), 'about ' + A.fmt(e * 100)]);
          return { q: 'Which is the best estimate for <span class="math">' + w + ' &times; 0.' + t + '</span>?', type: 'mc', options: o0.options, answer: o0.answer, v: { w: w, t: t, e: e },
            hint: 'Round ' + w + ' to the nearest hundred, then multiply by ' + t + ' tenths.', steps: [w + ' is about ' + Math.round(w / 100) * 100 + '.', Math.round(w / 100) * 100 + ' &times; ' + t + ' = ' + A.fmt(Math.round(w / 100) * 100 * t) + '. Divide by 10: ' + A.fmt(e) + '.', 'The best estimate is about ' + A.fmt(e) + '. Times a number less than 1 gives less than ' + w + '.'],
            explain: 'About ' + A.fmt(e) + '. The exact answer is ' + dec(w * t * 100) + '.' }; }
        if (op === '−' && b > a) { var tmp = a; a = b; b = tmp; }
        var ra = Math.round(a / 1000), rb = Math.round(b / 1000), e2 = op === '+' ? ra + rb : ra - rb;
        var o = R.mc('about ' + e2, ['about ' + (e2 * 10), 'about ' + Math.max(1, Math.round(e2 / 10)), 'about ' + (op === '+' ? Math.abs(ra - rb) : ra + rb)]);
        return { q: 'Which is the best estimate for <span class="math">' + dec(a) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + dec(b) + '</span>?', type: 'mc', options: o.options, answer: o.answer, v: { a: a, b: b, op: op },
          hint: 'Round each number to the nearest whole number first.', steps: [dec(a) + ' is about ' + ra + ', and ' + dec(b) + ' is about ' + rb + '.', ra + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + rb + ' = ' + e2 + '.', 'The best estimate is about ' + e2 + '.'],
          explain: 'About ' + e2 + '. The exact answer is ' + dec(op === '+' ? a + b : a - b) + '.' };
      } },
      { id: 'do-addsub', name: 'Add and subtract decimals', code: 'B2.4', gen: function (lv) {
        var a, b, op = R.int(0, 1) ? 1 : -1;
        if (lv === 1) { a = R.int(10, 99) * 100; b = R.int(10, 99) * 100; }
        else if (lv === 2) { a = R.int(100, 999) * 100; b = R.int(100, 999) * 10; }
        else { a = R.pick([R.int(5, 40) * 1000, R.int(100, 999) * 10]); b = R.int(1000, 9999); }
        if (op < 0 && b > a) { var t = a; a = b; b = t; }
        if (op < 0 && a === b) a += 1000;
        var r = op > 0 ? a + b : a - b;
        return { q: '<span class="math">' + dec(a) + ' ' + (op > 0 ? '+' : '&minus;') + ' ' + dec(b) + ' = ?</span>', type: 'num', answer: r / 1000, v: { a: a, b: b, op: op },
          fig: lv < 3 ? columns(a, b, op, false) : '',
          hint: 'Line up the decimal points. Fill empty places with zeros.',
          steps: ['Line up the points and fill with zeros.' + columns(a, b, op, false), (op > 0 ? 'Add' : 'Subtract') + ' from the right, regrouping when you need to.', 'Bring the point straight down: ' + dec(r) + '.' + columns(a, b, op, true)],
          explain: dec(a) + ' ' + (op > 0 ? '+' : '&minus;') + ' ' + dec(b) + ' = ' + dec(r) + '.' };
      } },
      { id: 'do-mult', name: 'Whole number times tenths', code: 'B2.7', gen: function (lv) {
        var w = lv === 1 ? R.int(1, 9) * 100 + R.pick([0, 10, 20, 50]) : R.int(100, 999), t = lv === 3 ? R.pick([12, 15, 25, 13, 21]) : R.int(1, 9);
        var r = w * t;
        return { q: '<span class="math">' + w + ' &times; ' + dec(t * 100) + ' = ?</span>', type: 'num', answer: r / 10, v: { w: w, t: t / 10 },
          fig: lv === 1 ? area(w, t) : '',
          hint: 'Multiply ' + w + ' by ' + t + ', then divide by 10.',
          steps: [dec(t * 100) + ' is ' + t + ' tenths.', w + ' &times; ' + t + ' = ' + A.fmt(r) + '.', 'Divide by 10 to make tenths: ' + dec(r * 100) + '.'],
          explain: w + ' &times; ' + t + ' = ' + A.fmt(r) + ', and ' + A.fmt(r) + ' &divide; 10 = ' + dec(r * 100) + '.' };
      } },
      { id: 'do-divt', name: 'Divide by tenths', code: 'B2.8', gen: function (lv) {
        var t = R.int(1, 9), q, w;
        if (lv < 3) { q = R.int(lv === 1 ? 2 : 11, lv === 1 ? 9 : 99) * (lv === 1 ? 100 : 10); w = q * t / 10; while (w !== Math.round(w) || w < 100 || w > 999) { q = R.int(lv === 1 ? 2 : 11, lv === 1 ? 9 : 99) * (lv === 1 ? 100 : 10); t = R.int(1, 9); w = q * t / 10; }
          return { q: '<span class="math">' + w + ' &divide; ' + dec(t * 100) + ' = ?</span>', type: 'num', answer: q, v: { w: w, t: t / 10 },
            hint: 'Multiply both numbers by 10 so you divide by a whole number.', steps: ['Multiply both by 10: ' + A.fmt(w * 10) + ' &divide; ' + t + '.', A.fmt(w * 10) + ' &divide; ' + t + ' = ' + A.fmt(q) + '.', 'Check: ' + A.fmt(q) + ' &times; ' + dec(t * 100) + ' = ' + w + '.'],
            explain: w + ' &divide; ' + dec(t * 100) + ' = ' + A.fmt(w * 10) + ' &divide; ' + t + ' = ' + A.fmt(q) + '.' }; }
        t = R.pick([3, 4, 6, 7, 8, 9]); w = R.int(100, 999); while ((w * 10) % t === 0) w++;
        var big = w * 10, qq = Math.floor(big / t), rr = big % t, ctx = R.pick([['m of ribbon', 'm', 'pieces'], ['L of water', 'L', 'bottles']]);
        return { q: 'You have ' + w + ' ' + ctx[0] + '. Each ' + ctx[2].slice(0, -1) + ' uses ' + dec(t * 100) + ' ' + ctx[1] + '. How many full ' + ctx[2] + ' can you make?', type: 'num', answer: qq, v: { w: w, t: t / 10, full: true },
          hint: 'Divide ' + w + ' by ' + dec(t * 100) + '. Ignore the remainder: only full ' + ctx[2] + ' count.',
          steps: ['Multiply both by 10: ' + A.fmt(big) + ' &divide; ' + t + '.', A.fmt(big) + ' &divide; ' + t + ' = ' + A.fmt(qq) + ' R ' + rr + '.', 'Only full ' + ctx[2] + ' count, so ' + A.fmt(qq) + '. (' + dec(rr * 100) + ' ' + ctx[1] + ' is left over.)'],
          explain: A.fmt(qq) + ' full ' + ctx[2] + ', with ' + dec(rr * 100) + ' ' + ctx[1] + ' left over.' };
      } },
      { id: 'do-divw', name: 'Divide a decimal by a whole number', code: 'B2.11', gen: function (lv) {
        var n = lv === 1 ? R.int(2, 5) : R.int(3, 9), q = lv === 1 ? R.int(11, 99) * 10 : R.int(101, 999), k = q * n;
        if (lv === 3) { q = R.int(101, 999); k = q * n; if (k >= 10000) { q = R.int(101, Math.floor(9999 / n)); k = q * n; } }
        var ld = longDiv(k, n);
        return { q: '<span class="math">' + dec(k) + ' &divide; ' + n + ' = ?</span>', type: 'num', answer: q / 1000, v: { k: k / 1000, n: n },
          fig: lv === 1 && k < 6000 ? legend() + share(k, n) : '',
          hint: 'Share the biggest place first. Trade any leftover for 10 of the next place.',
          steps: ld.steps.concat(['Put the decimal point above the point: ' + dec(q) + '.']),
          explain: dec(k) + ' &divide; ' + n + ' = ' + dec(q) + '. Check: ' + dec(q) + ' &times; ' + n + ' = ' + dec(k) + '.' };
      } },
      { id: 'do-multi', name: 'Multi-step problems', code: 'B2.1', gen: function (lv) {
        var p = R.int(1, 9) * 100 + R.pick([25, 50, 75, 95, 49]), n = R.int(2, lv === 1 ? 4 : 6), extra = R.int(1, 5) * 100 + R.pick([0, 25, 50]), pay = lv === 1 ? 2000 : R.pick([2000, 5000]);
        var item = R.pick(['notebooks', 'hot chocolates', 'bus tickets', 'muffins', 'packs of markers']), other = R.pick(['a pencil case', 'a water bottle', 'an eraser']);
        var cost = n * p + extra;
        while (cost >= pay) { n--; cost = n * p + extra; if (n < 2) { p = 125; n = 2; cost = n * p + extra; } }
        if (lv === 1) return { q: n + ' ' + item + ' cost ' + A.money(p) + ' each. What is the total cost?', type: 'num', unit: '$', answer: n * p / 100, v: { total: n * p / 100 },
          hint: 'Multiply the price by ' + n + '.', steps: [n + ' &times; ' + A.money(p) + '.', 'Multiply: ' + n + ' &times; ' + p + ' cents = ' + n * p + ' cents.', 'Total: ' + A.money(n * p) + '.'], explain: n + ' &times; ' + A.money(p) + ' = ' + A.money(n * p) + '.' };
        return { q: 'You buy ' + n + ' ' + item + ' at ' + A.money(p) + ' each and ' + other + ' for ' + A.money(extra) + '. You pay with ' + A.money(pay) + '. How much change do you get?', type: 'num', unit: '$', answer: (pay - cost) / 100, v: { total: (pay - cost) / 100 },
          hint: 'Three steps: multiply, add, then subtract from ' + A.money(pay) + '.',
          steps: [n + ' &times; ' + A.money(p) + ' = ' + A.money(n * p) + '.', A.money(n * p) + ' + ' + A.money(extra) + ' = ' + A.money(cost) + '.', A.money(pay) + ' &minus; ' + A.money(cost) + ' = ' + A.money(pay - cost) + '.'],
          explain: 'Total cost ' + A.money(cost) + ', so the change is ' + A.money(pay - cost) + '.' };
      } }
    ]
  });
})();
