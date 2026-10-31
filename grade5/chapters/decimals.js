(function () {
  var A = Atlas, R = A.R;
  function grid(a, b) {
    var s = '';
    for (var i = 0; i < 100; i++) {
      var x = 10 + (i % 10) * 24, y = 10 + Math.floor(i / 10) * 24, f = 'var(--card)';
      if (i < a) f = 'var(--strand)'; else if (i < a + b) f = 'var(--hi)';
      s += '<rect x="' + x + '" y="' + y + '" width="22" height="22" style="fill:' + f + ';stroke:var(--ink)" stroke-width="1"/>';
    }
    return s;
  }
  var ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function w99(n) { return n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : ''); }
  function f2(c) { return (c / 100).toFixed(2); }
  var D = A.draw;
  /* hundred grid: full rows are tenths (orange), extra squares are hundredths (purple) */
  function tgrid(n, sz) {
    sz = sz || 22;
    var s = '', full = Math.floor(n / 10) * 10;
    for (var i = 0; i < 100; i++) s += '<rect x="' + (2 + (i % 10) * sz) + '" y="' + (2 + Math.floor(i / 10) * sz) + '" width="' + sz + '" height="' + sz + '" style="fill:' + (i < full ? 'var(--pm1)' : i < n ? 'var(--pm2)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1"/>';
    return A.svg(sz * 10 + 4, sz * 10 + 4, s, n + ' of 100 squares shaded: ' + Math.floor(n / 10) + ' full rows and ' + n % 10 + ' more squares');
  }
  /* place value chart for a decimal given in hundredths */
  function dchart(c, hl) {
    var str = f2(c).replace('.', ''), cls = ['1', '0', 'm1', 'm2'], hd = ['Tens', 'Ones', 'Tenths', 'Hundredths'];
    while (str.length < 4) str = '0' + str;
    var h = '<div class="pv" style="max-width:440px;margin:8px auto;grid-template-columns:1fr 1fr 26px 1fr 1fr">';
    for (var i = 0; i < 4; i++) {
      if (i === 2) h += '<div class="dot">.</div>';
      h += '<div' + (i === hl ? ' class="on"' : '') + '><span class="h c' + cls[i] + '"><span class="lg">' + hd[i] + '</span><span class="sm">' + ['Tens', 'Ones', 'Tenths', 'Hundr.'][i] + '</span></span><span class="d' + (i === 0 && c < 1000 ? ' dim' : '') + '">' + str.charAt(i) + '</span></div>';
    }
    return h + '</div>';
  }
  /* decimal blocks: a flat is 1 whole, a rod is 1 tenth, a small cube is 1 hundredth */
  function dblocks(c) {
    var u = 4.5, items = [], o = Math.floor(c / 100), tn = Math.floor(c / 10) % 10, hu = c % 10, i, s = '', x = 4;
    for (i = 0; i < o; i++) items.push([10 * u, 10 * u, 10, 10, '0']);
    for (i = 0; i < tn; i++) items.push([u, 10 * u, 1, 10, 'm1']);
    for (i = 0; i < hu; i++) items.push([u, u, 1, 1, 'm2']);
    var base = 10 * u + 8, prev = null;
    items.forEach(function (it) {
      if (prev && prev !== it[4]) x += 14;
      s += D.prism(x, base, it[0], u, it[1], it[2], 1, it[3], it[4]);
      x += it[0] + u * 0.42 + 4; prev = it[4];
    });
    return A.svg(Math.ceil(x + 4), base + 4, s, o + ' wholes, ' + tn + ' tenths and ' + hu + ' hundredths in blocks');
  }
  /* zoom: the whole number line in tenths, and the tenth around c blown up into hundredths */
  function zoom(c, round) {
    var w = Math.floor(c / 100), lo = Math.floor(c / 10) * 10, s = '', X0 = 30, X1 = 530;
    var tx = function (h) { return X0 + (X1 - X0) * (h - w * 100) / 100; }, bx = function (h) { return X0 + (X1 - X0) * (h - lo) / 10; };
    s += '<rect x="' + tx(lo) + '" y="22" width="' + (tx(lo + 10) - tx(lo)) + '" height="20" rx="3" style="fill:color-mix(in srgb,var(--pm1) 30%,transparent)"/>';
    s += '<line x1="' + X0 + '" y1="32" x2="' + X1 + '" y2="32" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var i = 0; i <= 10; i++) { var x = tx(w * 100 + i * 10); s += '<line x1="' + x + '" y1="' + (i % 10 ? 26 : 22) + '" x2="' + x + '" y2="' + (i % 10 ? 38 : 42) + '" style="stroke:var(--ink)" stroke-width="2"/>'; if (i % 10 === 0 || i === 5) s += '<text x="' + x + '" y="16" text-anchor="middle" font-size="16" class="tb">' + ((w * 100 + i * 10) / 100).toFixed(1) + '</text>'; }
    s += '<line x1="' + tx(lo) + '" y1="42" x2="' + X0 + '" y2="98" style="stroke:var(--pm1)" stroke-dasharray="5 4" stroke-width="1.5"/><line x1="' + tx(lo + 10) + '" y1="42" x2="' + X1 + '" y2="98" style="stroke:var(--pm1)" stroke-dasharray="5 4" stroke-width="1.5"/>';
    s += '<line x1="' + X0 + '" y1="110" x2="' + X1 + '" y2="110" style="stroke:var(--ink)" stroke-width="3"/>';
    for (i = 0; i <= 10; i++) { x = bx(lo + i); s += '<line x1="' + x + '" y1="' + (i % 5 ? 103 : 98) + '" x2="' + x + '" y2="' + (i % 5 ? 117 : 122) + '" style="stroke:var(--ink)" stroke-width="2"/>'; if (i % 5 === 0) s += '<text x="' + x + '" y="142" text-anchor="middle" font-size="15" class="tb">' + f2(lo + i) + '</text>' + (i === 5 ? '<text x="' + x + '" y="160" text-anchor="middle" font-size="15" class="t2">halfway</text>' : ''); }
    var cx = bx(c), up = c - lo >= 5;
    if (round) s += '<circle cx="' + (up ? X1 : X0) + '" cy="110" r="12" style="fill:none;stroke:var(--accent)" stroke-width="4"/>';
    s += '<circle cx="' + cx + '" cy="110" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/><text x="' + Math.min(Math.max(cx, 40), 520) + '" y="88" text-anchor="middle" font-size="16" class="tb">' + f2(c) + '</text>';
    return A.svg(560, 164, s, 'Number line from ' + w + ' to ' + (w + 1) + ' in tenths, with the part from ' + f2(lo) + ' to ' + f2(lo + 10) + ' zoomed in to show hundredths. ' + f2(c) + ' is marked.');
  }
  /* double number line: fractions above, decimals and percents below */
  function dnl(marks) {
    var s = '', X0 = 92, X1 = 530, X = function (v) { return X0 + (X1 - X0) * v; };
    s += '<line x1="' + X0 + '" y1="50" x2="' + X1 + '" y2="50" style="stroke:var(--ink)" stroke-width="3"/>';
    s += '<text x="4" y="26" font-size="15" class="t2">fraction</text><text x="4" y="84" font-size="15" class="t2">decimal</text><text x="4" y="106" font-size="15" class="t2">percent</text>';
    marks.forEach(function (m) {
      var x = X(m[0] / m[1]);
      s += '<line x1="' + x + '" y1="40" x2="' + x + '" y2="60" style="stroke:var(--ink)" stroke-width="2.5"/>' +
        '<text x="' + x + '" y="30" text-anchor="middle" font-size="16" font-weight="800" style="fill:var(--strand)">' + (m[0] === 0 ? '0' : m[0] === m[1] ? '1' : m[0] + '/' + m[1]) + '</text>' +
        '<text x="' + x + '" y="82" text-anchor="middle" font-size="15" font-weight="700" style="fill:var(--pm1)">' + A.clean(m[0] / m[1]) + '</text>' +
        '<text x="' + x + '" y="104" text-anchor="middle" font-size="15" font-weight="700" style="fill:var(--pm2)">' + A.clean(100 * m[0] / m[1]) + '%</text>';
    });
    return A.svg(560, 112, s, 'Double number line from 0 to 1: ' + marks.map(function (m) { return m[0] + '/' + m[1] + ' = ' + A.clean(m[0] / m[1]) + ' = ' + A.clean(100 * m[0] / m[1]) + '%'; }).join(', '));
  }
  /* vertical addition or subtraction with coloured place columns. a, b, r in hundredths */
  function cols(a, b, r, op) {
    var len = Math.max(f2(a).length, f2(b).length, f2(r).length) - 1, hd = ['Hundreds', 'Tens', 'Ones', 'Tenths', 'Hundredths'], cl = ['2', '1', '0', 'm1', 'm2'];
    function dg(c) { var x = f2(c).replace('.', ''); while (x.length < len) x = ' ' + x; return x; }
    var A1 = dg(a), B1 = dg(b), R1 = dg(r), h = '<div class="cols" role="img" aria-label="' + f2(a) + (op === '+' ? ' plus ' : ' minus ') + f2(b) + ' equals ' + f2(r) + '"><div><span class="h" style="background:var(--ink2)">&nbsp;</span><span></span><span class="op">' + (op === '+' ? '+' : '&minus;') + '</span><span class="ln"></span></div>';
    for (var i = 0; i < len; i++) {
      var k = 5 - len + i;
      if (i === len - 2) h += '<div class="pt"><span class="h" style="background:var(--ink2)">&nbsp;</span><span>.</span><span>.</span><span class="ln">.</span></div>';
      h += '<div><span class="h" style="background:var(--p' + cl[k] + ')' + (cl[k] === '0' ? ';color:#13203a' : '') + '">' + hd[k] + '</span><span>' + A1.charAt(i) + '</span><span>' + B1.charAt(i) + '</span><span class="ln">' + R1.charAt(i) + '</span></div>';
    }
    return h + '</div>';
  }
  /* strip trailing zeros: 0.50 -> 0.5 */
  function t(c) { return String(A.clean(c / 100)); }


  /* ---------- Lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = A.kit;
  function P(id, lv) { return K.P('decimals', id, lv); }
  function disksTool(places, start) { return function (el) { return K.disks(el, { places: places || [0, -1, -2], start: start }); }; }
  function two(a, b, la, lb, sz) { return '<div class="pies g5-anim"><figure>' + tgrid(a, sz || 15) + '<figcaption>' + la + '</figcaption></figure><figure>' + tgrid(b, sz || 15) + '<figcaption>' + lb + '</figcaption></figure></div>'; }
  function gfig(n, hl) { return '<div class="row2 g5-anim"><div class="fig">' + tgrid(n, 20) + '</div><div>' + dchart(n, hl) + '</div></div>'; }
  var LESSONS = [
    { id: 'tenths', title: 'Tenths and hundredths', sub: 'Places to the right of the decimal point.', concepts: [
      { id: 'grid', title: 'A whole cut into 100', exp: ['B1.5'], skill: 'de-read',
        body: '<p>This grid of 100 squares is one whole. One square is a <b>hundredth</b> (0.01). A full row of 10 squares is a <b>tenth</b> (0.1).</p>',
        watch: K.watch([
          { say: 'One whole, cut into 100 equal squares.', fig: gfig(0) },
          { say: 'Shade one full row: 1 tenth, or <b>0.1</b>.', fig: gfig(10, 2) },
          { say: 'Shade 4 rows: 4 tenths, or <b>0.4</b>.', fig: gfig(40, 2) },
          { say: '7 more squares: 7 hundredths. Together <b>0.47</b>.', fig: gfig(47, 3) },
          { say: '0.47 is 4 tenths and 7 hundredths. It is also 47 hundredths.', fig: gfig(47), ms: 2400 }
        ]),
        try: K.widget('decimals', 0, 'Nice. Try exactly 10, 50 and 100 squares and read the decimal each time.'),
        key: '<p>First place after the point: <b>tenths</b>. Second place: <b>hundredths</b>. 0.47 = 4 tenths + 7 hundredths = 47 hundredths.</p>',
        check: [P('de-read', 1), P('de-read', 2)] },

      { id: 'disks', title: 'Decimals with place value disks', exp: ['B1.5'], skill: 'de-read', hard: true,
        body: '<p>Places keep working the same way after the decimal point. 10 hundredths make 1 tenth, and 10 tenths make 1 one.</p>',
        watch: { mount: disksTool([0, -1, -2]), steps: [
          { say: 'Build 2.35: 2 ones,', act: function (t) { return t.add(0, 2, 300); } },
          { say: '3 tenths,', act: function (t) { return t.add(-1, 3, 300); } },
          { say: 'and 5 hundredths.', act: function (t) { return t.add(-2, 5, 260); } },
          { say: 'Add 5 more hundredths. Now there are 10.', act: function (t) { return t.add(-2, 5, 220); } },
          { say: '10 hundredths group into <b>1 tenth</b>. The total is 2.4.', act: function (t) { return t.group(-2); }, ms: 2200 }
        ] },
        try: { mount: function (host, done) {
          var msg = document.createElement('p'); msg.className = 'ls-task'; msg.innerHTML = 'Build <b>1.47</b> with the fewest disks.'; host.appendChild(msg);
          var b = document.createElement('div'); host.appendChild(b);
          K.disks(b, { places: [0, -1, -2], controls: true, onChange: function (s) { if (s.value === 1.47 && s.counts[-1] < 10 && s.counts[-2] < 10) done('Yes. 1 one, 4 tenths and 7 hundredths.'); } });
        }, do: 'Use the buttons to add disks.' },
        ways: [
          { label: 'With blocks', html: '<p>A flat is one whole, a rod is one tenth, and a small cube is one hundredth.</p><div class="fig">' + dblocks(235) + '</div>' },
          { label: 'In a chart', html: dchart(235) + '<p>2 ones, 3 tenths, 5 hundredths. Say it: "two and thirty-five hundredths".</p>' },
          { label: 'With money', html: '<p>$2.35 is 2 dollars and 35 cents. A dime is a tenth of a dollar and a cent is a hundredth, so $2.35 is 2 dollars, 3 dimes and 5 cents.</p>' }
        ],
        key: '<p><b>10 hundredths = 1 tenth. 10 tenths = 1 one.</b> Just like whole numbers.</p>',
        mistake: '<p>Writing 5 hundredths as 0.5, or reading 2.35 as "two point thirty-five". Say the place name: "two and thirty-five <b>hundredths</b>", and check that the last digit sits in the hundredths place.</p>',
        check: [P('de-read', 2), P('de-read', 3)] },

      { id: 'line', title: 'Decimals on a number line', exp: ['B1.5'], skill: 'de-line',
        body: '<p>Between 0 and 1 there are 10 equal jumps of one tenth. Count the jumps to find a decimal.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 2, tick: 0.1, every: 0.5, start: 0 }, steps: [
          { say: 'This line goes from 0 to 2. Each small jump is one tenth.', ms: 1400 },
          { say: 'Jump 7 tenths: <b>0.7</b>.', act: function (t) { return t.hop(0.7, '7 tenths'); } },
          { say: '3 more tenths reach 1 whole.', act: function (t) { return t.hop(1, '+0.3'); } },
          { say: '4 more tenths: <b>1.4</b>.', act: function (t) { return t.hop(1.4, '+0.4'); }, ms: 2000 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 2, tick: 0.1, every: 0.5, start: 0 }, tasks: [
          { do: 'Drag or tap to put the marker on <b>0.6</b>.', goal: function (s) { return s.at === 0.6; }, yes: 'Yes. 6 tenths.' },
          { do: 'Now put it on <b>1.3</b>.', reset: false, goal: function (s) { return s.at === 1.3; }, yes: 'Yes. 1 whole and 3 tenths.' },
          { do: 'Put it halfway between 1 and 2.', reset: false, goal: function (s) { return s.at === 1.5; }, yes: 'Yes. 1.5 is halfway.' }
        ] },
        key: '<p>Count tenths from 0. <b>10 tenths make 1</b>, then keep counting.</p>',
        check: [P('de-line', 1), P('de-line', 2)] }
    ] },

    { id: 'compare', title: 'Comparing decimals', sub: 'Line up the decimal points.', concepts: [
      { id: 'compare', title: 'Compare from the left', exp: ['B1.5'], skill: 'de-compare', hard: true,
        body: '<p>Line up the decimal points and give both numbers the same number of places by adding zeros at the end. Then compare from the left.</p>',
        watch: K.watch([
          { say: 'Which is greater, 0.6 or 0.58?', fig: two(0, 0, '0.6', '0.58') },
          { say: '0.6 is 6 tenths: 6 full rows.', fig: two(60, 0, '0.6', '0.58') },
          { say: '0.58 is 5 rows and 8 squares.', fig: two(60, 58, '0.6', '0.58') },
          { say: 'Write 0.6 as 0.60. 60 hundredths is more than 58, so <b>0.6 &gt; 0.58</b>.', fig: two(60, 58, '0.60', '0.58'), ms: 2400 }
        ]),
        try: K.widget('decimals', 1, 'Good. Try 0.5 and 0.45. Which really is greater?'),
        ways: [
          { label: 'Add a zero', html: '<p class="math">0.6 &rarr; 0.60</p><p>Now both have 2 places. Compare 60 and 58 like whole numbers.</p>' },
          { label: 'With money', html: '<p>$0.60 or $0.58? Sixty cents is more than fifty-eight cents.</p>' },
          { label: 'Number line', html: '<div class="fig">' + zoom(58, false) + '</div><p>0.58 sits before 0.6 on the line.</p>' }
        ],
        key: '<p><b>Line up the points, add zeros, compare from the left.</b> More digits does not mean bigger.</p>',
        mistake: '<p>Thinking the decimal with more digits is bigger (0.45 &gt; 0.5 "because 45 &gt; 5"). Write both with two places: 0.50 and 0.45, or think in money.</p><div class="pies"><figure>' + tgrid(50, 12) + '<figcaption>0.5</figcaption></figure><figure>' + tgrid(45, 12) + '<figcaption>0.45</figcaption></figure></div>',
        check: [P('de-compare', 1), P('de-compare', 2)] }
    ] },

    { id: 'round', title: 'Rounding decimals', sub: 'To the nearest tenth.', concepts: [
      { id: 'tenth', title: 'Round to the nearest tenth', exp: ['B1.6'], skill: 'de-round', hard: true,
        body: '<p>Find the two tenths on either side. Then look at the <b>hundredths</b> digit: 5 or more rounds up, less than 5 rounds down.</p>',
        watch: K.watch([
          { say: 'Round 3.47 to the nearest tenth.', fig: '<div class="g5-anim">' + zoom(347, false) + '</div>' },
          { say: 'It sits between 3.4 and 3.5. The zoomed line shows the hundredths.', fig: '<div class="g5-anim">' + zoom(347, false) + '</div>' },
          { say: 'The hundredths digit is 7, past halfway.', fig: '<div class="g5-anim">' + zoom(347, false) + '</div>' },
          { say: 'So 3.47 rounds up to <b>3.5</b>.', fig: '<div class="g5-anim">' + zoom(347, true) + '</div>', ms: 2200 }
        ]),
        try: K.widget('decimals', 2, 'Nice. Try a number like 3.45, exactly halfway. It rounds up.'),
        ways: [
          { label: 'With money', html: '<p>Round $3.47 to the nearest 10 cents. 47 cents is closer to 50 cents than to 40 cents, so $3.50.</p>' },
          { label: 'Cover up', html: '<p>Cover every digit after the tenths except the next one. 3.4<b>7</b>: the 7 says round up. 3.4 becomes 3.5.</p>' }
        ],
        key: '<p>Look at the <b>hundredths</b> digit. 5 or more: round up. Less than 5: round down.</p>',
        mistake: '<p>Looking at the wrong digit, or rounding 3.97 up to 3.10. Rounding 9 tenths up gives 10 tenths, which is 1 more whole: 3.97 &rarr; 4.0.</p>',
        check: [P('de-round', 1), P('de-round', 2)] }
    ] },

    { id: 'fdp', title: 'Fractions, decimals and percents', sub: 'One amount, three names.', concepts: [
      { id: 'fdp', title: 'One amount, three names', exp: ['B1.7'], skill: 'de-fdp',
        body: '<p>To change a fraction into a decimal, find an equal fraction with <b>10 or 100</b> on the bottom. Out of 100 is also a percent.</p>',
        watch: K.watch([
          { say: 'Start with 3/4.', fig: '<div class="pies g5-anim"><figure>' + A.draw.pie(3, 4, 54) + '<figcaption>3/4</figcaption></figure></div>' },
          { say: '3/4 = 75/100. That fills 75 squares.', fig: '<div class="pies g5-anim"><figure>' + A.draw.pie(3, 4, 54) + '<figcaption>3/4</figcaption></figure><figure>' + tgrid(75, 11) + '<figcaption>75/100</figcaption></figure></div>' },
          { say: '75 hundredths is <b>0.75</b>, and 75 out of 100 is <b>75%</b>.', fig: '<div class="pies g5-anim"><figure>' + A.draw.pie(3, 4, 54) + '<figcaption>3/4</figcaption></figure><figure>' + tgrid(75, 11) + '<figcaption>0.75 = 75%</figcaption></figure></div>' },
          { say: 'Learn these by heart: 1/10, 1/4, 1/2 and 3/4.', fig: '<div class="g5-anim">' + dnl([[0, 1], [1, 10], [1, 4], [1, 2], [3, 4], [1, 1]]) + '</div>', ms: 2600 }
        ]),
        try: K.widget('decimals', 3, 'Good. Try 1/5 and 2/5. Fifths become tenths.'),
        key: '<p>1/2 = 0.5 = 50%. 1/4 = 0.25 = 25%. 3/4 = 0.75 = 75%. 1/10 = 0.1 = 10%.</p>',
        mistake: '<p>Writing the digits of the fraction as a decimal: 1/4 = 0.14, or 3/5 = 0.35. Always make the bottom 10 or 100 first.</p>',
        check: [P('de-fdp', 1), P('de-fdp', 2)] }
    ] },

    { id: 'addsub', title: 'Adding and subtracting decimals', sub: 'Line up the points.', concepts: [
      { id: 'line-up', title: 'Line up the decimal points', exp: ['B2.4'], skill: 'de-addsub', hard: true,
        body: '<p>Tenths go with tenths, hundredths with hundredths. Line up the <b>decimal points</b>, fill gaps with zeros, then add or subtract. Estimate first.</p>',
        watch: { mount: disksTool([0, -1, -2], { 0: 3, '-1': 4, '-2': 5 }), steps: [
          { say: '3.45 + 2.8. Estimate first: about 3 + 3 = 6. Here is 3.45.', ms: 1800 },
          { say: '2.8 is 2 ones and 8 tenths. Add the 2 ones to the ones.', act: function (t) { return t.add(0, 2, 260); } },
          { say: 'Add the 8 tenths to the tenths. There are no hundredths in 2.8.', act: function (t) { return t.add(-1, 8, 200); } },
          { say: '12 tenths: group 10 of them into 1 one.', act: function (t) { return t.group(-1); } },
          { say: '6 ones, 2 tenths, 5 hundredths: <b>6.25</b>. Close to the estimate of 6.', ms: 2400 }
        ] },
        try: K.widget('decimals', 4, 'Nice. Try 5 − 1.25 and watch the zeros fill the empty places.'),
        ways: [
          { label: 'In columns', html: cols(345, 280, 625, '+') + '<p>2.8 is written as 2.80 so tenths sit over tenths.</p>' },
          { label: 'With money', html: '<p>$3.45 + $2.80: 3 dollars + 2 dollars is 5 dollars. 45 cents + 80 cents is 125 cents, which is $1.25. Total $6.25.</p>' },
          { label: 'Subtract', html: '<p>$7.50 &minus; $2.85. Estimate 8 &minus; 3 = 5.</p>' + cols(750, 285, 465, '-') }
        ],
        key: '<p><b>Line up the decimal points.</b> Fill empty places with 0. Estimate to check.</p>',
        mistake: '<p>Lining up the last digits instead of the points: 3.45 + 2.8 = 3.73. Have the child write 2.8 as 2.80 and estimate first (about 6).</p>' + cols(345, 280, 625, '+'),
        check: [P('de-addsub', 1), P('de-addsub', 2)] }
    ] },

    { id: 'shift', title: 'Multiplying by 0.1 and 0.01', sub: 'Every digit moves right.', concepts: [
      { id: 'tenth-of', title: 'A tenth of a number', exp: ['B2.3'], skill: 'de-mental',
        body: '<p>Multiplying by <b>0.1</b> finds one tenth. It is the same as dividing by 10. Multiplying by <b>0.01</b> is the same as dividing by 100.</p>',
        watch: { mount: disksTool([1, 0, -1, -2], { 1: 4, 0: 5 }), steps: [
          { say: 'Here is 45: 4 tens and 5 ones.', ms: 1400 },
          { say: '45 &times; 0.1: every disk becomes 10 times smaller. Tens become ones, ones become tenths.', act: function (t) { return t.set({ 0: 4, '-1': 5 }); }, ms: 2200 },
          { say: '45 &times; 0.1 = <b>4.5</b>.', ms: 1400 },
          { say: '45 &times; 0.01: 100 times smaller. Every digit moves two places.', act: function (t) { return t.set({ '-1': 4, '-2': 5 }); }, ms: 2200 },
          { say: '45 &times; 0.01 = <b>0.45</b>.', ms: 1600 }
        ] },
        try: K.widget('decimals', 5, 'Good. Try a number ending in 0, like 230.'),
        key: '<p>&times; 0.1: digits move <b>1 place right</b>. &times; 0.01: <b>2 places right</b>. The number gets smaller.</p>',
        mistake: '<p>Expecting multiplying to make a number bigger (45 &times; 0.1 = 450). Multiplying by a number less than 1 takes a part of it, so the answer is smaller.</p>',
        check: [P('de-mental', 1), P('de-mental', 2)] }
    ] }
  ];
  A.register('decimals', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Tenths and hundredths</h2>' +
'<p>A grid of 100 squares is one whole. Each square is 1 <b>hundredth</b>, or 0.01. Each full row of 10 squares is 1 <b>tenth</b>, or 0.1. The first place after the decimal point is tenths. The second place is hundredths.</p>' +
'<div class="lab"><span class="lt">Try it: shade the grid</span>' +
'<div class="ctrl"><label for="ga">Squares shaded: <output id="gao"></output><input type="range" id="ga" min="0" max="100" value="47"></label></div>' +
'<div class="row2"><div class="fig" id="gfig"></div><div><div id="gchart"></div><div class="out" id="gout"></div></div></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>0.47 is <b class="cm1t">4 tenths</b> and <b class="cm2t">7 hundredths</b>. It is also 47 hundredths. Both are true, the same way 47 is 4 tens and 7 ones, or 47 ones.</p></div>' +
'<div class="eg"><p><b>Example.</b> 2.35 is 2 ones, 3 tenths and 5 hundredths. In words: two and thirty-five hundredths. With blocks, a flat is one whole, a rod is one tenth, and a small cube is one hundredth.</p>' +
'<div class="fig">' + dblocks(235) + '</div>' + dchart(235) + '</div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Comparing and ordering decimals</h2>' +
'<p>Line up the decimal points. Give both numbers the same number of decimal places by adding zeros at the end. Then compare from the left, just like whole numbers.</p>' +
'<div class="eg"><p><b>Example.</b> 0.6 or 0.58? Write 0.6 as 0.60. 60 hundredths is more than 58 hundredths, so <b>0.6 &gt; 0.58</b>.</p>' +
'<div class="pies"><figure>' + tgrid(60, 15) + '<figcaption>0.6 = 0.60</figcaption></figure><figure>' + tgrid(58, 15) + '<figcaption>0.58</figcaption></figure></div></div>' +
'<div class="lab"><span class="lt">Try it: which is greater?</span>' +
'<div class="ctrl"><label for="ca">First<input type="text" id="ca" value="0.6" inputmode="decimal" autocomplete="off"></label>' +
'<label for="cb">Second<input type="text" id="cb" value="0.58" inputmode="decimal" autocomplete="off"></label></div>' +
'<div class="fig" id="cfig"></div><div class="out" id="cout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>More digits does not mean bigger. 0.5 is greater than 0.45, because 0.5 = 0.50.</p>' +
'<div class="pies"><figure>' + tgrid(50, 12) + '<figcaption>0.5</figcaption></figure><figure>' + tgrid(45, 12) + '<figcaption>0.45</figcaption></figure></div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Rounding to the nearest tenth</h2>' +
'<p>Find the two tenths on either side. Then look at the <b>hundredths</b> digit. If it is 5 or more, round up. If it is less than 5, round down. The picture zooms in on one tenth so you can see the hundredths inside it.</p>' +
'<div class="lab"><span class="lt">Try it: round on a number line</span>' +
'<div class="ctrl"><label for="rd">Decimal (up to 2 places)<input type="text" id="rd" value="3.47" inputmode="decimal" autocomplete="off"></label></div>' +
'<div class="fig" id="rfig"></div><div class="out" id="rout"></div></div>' +
'<div class="eg"><p><b>Example.</b> 7.95 to the nearest tenth: the tenths on either side are 7.9 and 8.0. The hundredths digit is 5, so round up to <b>8.0</b>.</p><div class="fig">' + zoom(795, true) + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Looking at the wrong digit. To round to the nearest tenth, look only at the hundredths digit. 4.48 rounds to 4.5.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Fractions, decimals and percents</h2>' +
'<p><b>Percent</b> means "out of 100". 35% is 35 out of 100, which is 35/100 or 0.35. To change a fraction into a decimal, find an equivalent fraction with 10 or 100 on the bottom.</p>' +
'<div class="eg"><p><b>Example.</b> <span class="math">3/4 = 75/100 = 0.75 = 75%</span></p>' +
'<div class="pies"><figure>' + A.draw.pie(3, 4, 44) + '<figcaption>3/4</figcaption></figure><figure>' + tgrid(75, 9) + '<figcaption>75 of 100</figcaption></figure></div>' +
'<p class="math">2/5 = 4/10 = 0.4 = 40%</p></div>' +
'<div class="lab"><span class="lt">Try it: one amount, three names</span>' +
'<div class="ctrl"><label for="fd">Fraction<select id="fd"><option value="1,2">1/2</option><option value="1,4">1/4</option><option value="3,4" selected>3/4</option><option value="1,5">1/5</option><option value="2,5">2/5</option><option value="3,5">3/5</option><option value="4,5">4/5</option><option value="1,10">1/10</option><option value="7,10">7/10</option><option value="9,20">9/20</option><option value="3,25">3/25</option><option value="1,100">1/100</option></select></label></div>' +
'<div class="fig" id="ffig"></div><div class="out" id="fout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Benchmarks to know by heart: 1/2 = 0.5 = 50%, 1/4 = 0.25 = 25%, 1/10 = 0.1 = 10%. They sit at the same spots on one line.</p><div class="fig">' + dnl([[0, 1], [1, 10], [1, 4], [1, 2], [3, 4], [1, 1]]) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Adding and subtracting decimals</h2>' +
'<p>Line up the <b>decimal points</b> so that tenths sit over tenths and hundredths over hundredths. Fill empty spots with zeros, then add or subtract like whole numbers. <b>Estimate first</b> by rounding to whole numbers, so you know if your answer makes sense.</p>' +
'<div class="lab"><span class="lt">Try it: vertical form</span>' +
'<div class="ctrl"><label for="xa">First<input type="text" id="xa" value="3.45" inputmode="decimal" autocomplete="off"></label>' +
'<label for="xo">Operation<select id="xo"><option value="+">add</option><option value="-">subtract</option></select></label>' +
'<label for="xb">Second<input type="text" id="xb" value="2.8" inputmode="decimal" autocomplete="off"></label></div>' +
'<div class="out" id="xout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Lining up the right-hand digits instead of the decimal points. 3.45 + 2.8 is not 3.73. Write 2.8 as 2.80 first, so tenths sit over tenths.</p>' + cols(345, 280, 625, '+') + '</div>' +
'<div class="eg"><p><b>Example.</b> $7.50 &minus; $2.85. Estimate: 8 &minus; 3 = 5. Line up the points: 7.50 &minus; 2.85 = <b>4.65</b>. That is close to 5, so it makes sense.</p>' + cols(750, 285, 465, '-') + '</div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Multiplying by 0.1 and 0.01</h2>' +
'<p>Multiplying by 0.1 means finding one tenth of a number. It is the same as dividing by 10. Multiplying by 0.01 means finding one hundredth, which is the same as dividing by 100. Each digit moves to a place that is 10 or 100 times smaller.</p>' +
'<div class="lab"><span class="lt">Try it: shift the digits</span>' +
'<div class="ctrl"><label for="sn">Whole number (up to 99 999)<input type="number" id="sn" min="0" max="99999" value="45"></label>' +
'<label for="so">Multiply by<select id="so"><option value="1">0.1</option><option value="2">0.01</option></select></label></div>' +
'<div id="schart"></div><div class="out" id="sout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>45 &times; 0.1 = 4.5 and 45 &times; 0.01 = 0.45. The number gets smaller, because you are taking a part of it.</p></div>' +
'<div class="eg"><p><b>Example.</b> 230 &times; 0.1 = 23, and 230 &times; 0.01 = 2.3.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function g() {
        var a = +$('#ga', root).value;
        $('#gao', root).textContent = a;
        $('#gfig', root).innerHTML = tgrid(a, 24);
        $('#gchart', root).innerHTML = dchart(a);
        var tn = Math.floor(a / 10), hn = a % 10;
        $('#gout', root).innerHTML = '<p><span class="big">' + f2(a) + ' = ' + a + '/100 = ' + a + '%</span></p>' +
          '<p>' + (a === 100 ? 'The whole grid is shaded: that is 1 whole.' : tn + ' tenth' + (tn === 1 ? '' : 's') + ' and ' + hn + ' hundredth' + (hn === 1 ? '' : 's') + '. In words: ' + (a ? w99(a) + ' hundredth' + (a === 1 ? '' : 's') : 'zero') + '.') + '</p>';
      }
      A.bind(root, ['ga'], g);

      function cmp() {
        var a = $('#ca', root).value.trim(), b = $('#cb', root).value.trim(), out = $('#cout', root), fig = $('#cfig', root);
        var ok = /^\d{1,2}(\.\d{0,2})?$/;
        if (!ok.test(a) || !ok.test(b)) { fig.innerHTML = ''; out.innerHTML = '<p>Type two decimals with up to 2 places, like 0.6 and 0.58.</p>'; return; }
        function pad(s) { var p = s.split('.'); return p[0] + '.' + ((p[1] || '') + '00').slice(0, 2); }
        var x = parseFloat(a), y = parseFloat(b), sym = x > y ? '&gt;' : x < y ? '&lt;' : '=';
        if (x <= 1 && y <= 1) {
          var ga = Math.round(x * 100), gb = Math.round(y * 100);
          fig.innerHTML = '<div class="row2"><div>' + A.svg(260, 260, grid(ga, 0), a + ' shaded on a hundred grid') + '</div><div>' + A.svg(260, 260, grid(0, gb), b + ' shaded on a hundred grid') + '</div></div>';
        } else fig.innerHTML = '';
        out.innerHTML = '<p>Same number of decimal places: <span class="math"><b>' + pad(a) + '</b> and <b>' + pad(b) + '</b></span></p>' +
          '<p><span class="big">' + x + ' ' + sym + ' ' + y + '</span></p>';
      }
      A.bind(root, ['ca', 'cb'], cmp);

      function rd() {
        var v = $('#rd', root).value.trim(), o = $('#rout', root), f = $('#rfig', root);
        if (!/^\d{1,2}(\.\d{0,2})?$/.test(v)) { f.innerHTML = ''; o.innerHTML = '<p>Type a decimal with up to 2 places, like 3.47.</p>'; return; }
        var c = Math.round(parseFloat(v) * 100), lo = Math.floor(c / 10) * 10, hi = lo + 10, ans = c % 10 >= 5 ? hi : lo, hd = c % 10;
        f.innerHTML = zoom(c, true);
        o.innerHTML = '<p><span class="big">' + f2(c) + ' &#8776; ' + (ans / 100).toFixed(1) + '</span></p><p>' +
          (hd === 0 ? 'The hundredths digit is 0, so it is already a tenth.' : 'The hundredths digit is <b>' + hd + '</b>, which is ' + (hd >= 5 ? '5 or more, so round <b>up</b>.' : 'less than 5, so round <b>down</b>.')) + '</p>';
      }
      A.bind(root, ['rd'], rd);

      function fdp() {
        var p = $('#fd', root).value.split(','), n = +p[0], d = +p[1], k = 100 / d, h = n * k;
        $('#ffig', root).innerHTML = '<div class="row2"><div>' + A.draw.bar(n, d, 260) + '</div><div>' + A.svg(184, 184, (function () { var s0 = ''; for (var i = 0; i < 100; i++) s0 += '<rect x="' + (2 + (i % 10) * 18) + '" y="' + (2 + Math.floor(i / 10) * 18) + '" width="18" height="18" style="fill:' + (i < h ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1"/>'; return s0; })(), h + ' of 100 squares shaded') + '</div></div>';
        $('#fout', root).innerHTML = '<p><span class="big">' + n + '/' + d + ' = ' + h + '/100 = ' + t(h) + ' = ' + h + '%</span></p><p>Multiply the top and bottom by ' + k + ' to get hundredths: ' + n + ' &times; ' + k + ' = ' + h + ' and ' + d + ' &times; ' + k + ' = 100.</p>';
      }
      A.bind(root, ['fd'], fdp);

      function v() {
        var as = $('#xa', root).value.trim(), bs = $('#xb', root).value.trim(), op = $('#xo', root).value, o = $('#xout', root);
        var ok = /^\d{1,4}(\.\d{0,2})?$/;
        if (!ok.test(as) || !ok.test(bs)) { o.innerHTML = '<p>Type two numbers with up to 2 decimal places, like 3.45 and 2.8.</p>'; return; }
        var a = Math.round(parseFloat(as) * 100), b = Math.round(parseFloat(bs) * 100);
        if (op === '-' && b > a) { o.innerHTML = '<p>The second number is bigger. Swap them, or try adding.</p>'; return; }
        var r = op === '+' ? a + b : a - b;
        var w = Math.max(f2(a).length, f2(b).length, f2(r).length) + 2;
        function pad(s) { return new Array(Math.max(0, w - s.length) + 1).join(' ') + s; }
        var ea = Math.round(a / 100), eb = Math.round(b / 100);
        o.innerHTML = '<p>Estimate: ' + ea + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + eb + ' = ' + (op === '+' ? ea + eb : ea - eb) + '</p>' +
          cols(a, b, r, op) +
          '<p>Both numbers are written with 2 decimal places so the points line up. The answer ' + f2(r) + ' is close to the estimate.</p>';
      }
      A.bind(root, ['xa', 'xo', 'xb'], v);

      var hd = ['Ten thousands', 'Thousands', 'Hundreds', 'Tens', 'Ones', '', 'Tenths', 'Hundredths'];
      function s() {
        var n = Math.max(0, Math.min(99999, parseInt($('#sn', root).value, 10) || 0)), k = +$('#so', root).value, o = $('#sout', root);
        var cents = k === 1 ? n * 10 : n, str = String(cents);
        while (str.length < 7) str = '0' + str;
        function row(digs, label) {
          var h = '<p class="t2" style="margin:.2em 0;font-size:.85rem">' + label + '</p><div class="pv" style="grid-template-columns:repeat(5,1fr) 22px 1fr 1fr">';
          digs.forEach(function (c, i) {
            if (i === 5) { h += '<div class="dot">.</div>'; return; }
            h += '<div><span class="h c' + ['4', '3', '2', '1', '0', '', 'm1', 'm2'][i] + '">' + hd[i] + '</span><span class="d' + (c === ' ' ? ' dim' : '') + '">' + (c === ' ' ? '0' : c) + '</span></div>';
          });
          return h + '</div>';
        }
        var before = String(n); while (before.length < 5) before = ' ' + before;
        var bd = before.split('').concat(['.', ' ', ' ']);
        var res = A.clean(n * (k === 1 ? 0.1 : 0.01)), rs = (k === 1 ? res.toFixed(1) : res.toFixed(2)).split('.');
        var ip = rs[0]; while (ip.length < 5) ip = ' ' + ip;
        var fp = (rs[1] + '00').slice(0, 2);
        if (ip.trim() === '0') ip = '    0';
        var ad = ip.split('').concat(['.', fp.charAt(0), fp.charAt(1)]);
        $('#schart', root).innerHTML = row(bd, 'Before') + row(ad, 'After &times; ' + (k === 1 ? '0.1' : '0.01'));
        o.innerHTML = '<p><span class="big">' + A.fmt(n) + ' &times; ' + (k === 1 ? '0.1' : '0.01') + ' = ' + A.fmt(String(res)) + '</span></p>' +
          '<p>Each digit moved ' + k + ' place' + (k > 1 ? 's' : '') + ' to the right. This is the same as ' + A.fmt(n) + ' &divide; ' + (k === 1 ? '10' : '100') + '.</p>';
      }
      A.bind(root, ['sn', 'so'], s);
    },

    quiz: [
      { q: 'What decimal is shaded?', fig: tgrid(36, 22), type: 'num', answer: 0.36, hint: 'Count the full rows (tenths), then the extra squares (hundredths).', explain: '3 full rows and 6 squares: 36 hundredths, or 0.36.' },
      { q: 'Which is greater, 0.7 or 0.65?', type: 'mc', options: ['0.7', '0.65', 'They are equal'], answer: 0, fig: '<div class="pies"><figure>' + tgrid(70, 14) + '<figcaption>0.7</figcaption></figure><figure>' + tgrid(65, 14) + '<figcaption>0.65</figcaption></figure></div>', hint: 'Write 0.7 with two decimal places.', explain: '0.7 = 0.70, and 70 hundredths is more than 65 hundredths.' },
      { q: 'Round <span class="math">6.84</span> to the nearest tenth.', type: 'num', answer: 6.8, fig: zoom(684, false), hint: 'Look at the hundredths digit. Is the point before or after halfway?', explain: 'The hundredths digit is 4, so round down: 6.8.' },
      { q: 'Write 3/5 as a percent.', type: 'num', answer: 60, unit: '%', fig: A.draw.fbars([{ n: 3, d: 5 }], { w: 440 }), hint: 'Make an equivalent fraction out of 100.', explain: '3/5 = 60/100 = 60%.' },
      { q: '<span class="math">3.45 + 2.8</span> = ?', type: 'num', answer: 6.25, hint: 'Write 2.8 as 2.80 and line up the points.', explain: '3.45 + 2.80 = 6.25.' },
      { q: '<span class="math">10.00 &minus; 4.37</span> = ?', type: 'num', answer: 5.63, hint: 'Think of $10.00 and spend $4.37.', explain: '10.00 &minus; 4.37 = 5.63.' },
      { q: '<span class="math">320 &times; 0.01</span> = ?', type: 'num', answer: 3.2, hint: 'Multiplying by 0.01 is the same as dividing by 100.', explain: '320 &divide; 100 = 3.2.' }
    ],

    quick: ['de-read', 'de-compare', 'de-round', 'de-fdp', 'de-addsub', 'de-mental'],

    practice: [
      { id: 'de-read', name: 'Read and write decimals', code: 'B1.5', gen: function (lv) {
        if (lv === 1) {
          var n = R.int(5, 95);
          return { q: 'What decimal is shaded? One whole is 100 squares.', fig: tgrid(n, 20), type: 'num', answer: A.clean(n / 100),
            hint: 'Each full row is 0.1. Each single square is 0.01.',
            steps: ['Count the full rows: ' + Math.floor(n / 10) + '. That is ' + Math.floor(n / 10) + ' tenths.', 'Count the extra squares: ' + n % 10 + '. That is ' + n % 10 + ' hundredths.', 'Together: ' + f2(n) + '.'],
            explain: n + ' squares out of 100 is ' + f2(n) + '.' };
        }
        if (lv === 2) {
          var h = R.int(1, 99);
          return { q: 'Write <span class="math">' + h + '/100</span> as a decimal.', type: 'num', answer: A.clean(h / 100), fig: tgrid(h, 16), hint: 'Hundredths go in the second place after the decimal point.',
            steps: [h + '/100 means ' + h + ' hundredths.', 'The last digit must land in the hundredths place, two places after the point.', 'So ' + h + '/100 = ' + f2(h) + '.'],
            explain: h + '/100 = ' + f2(h) + '.' };
        }
        var w = R.int(1, 9), tn = R.pick([0, R.int(1, 9)]), hu = R.int(1, 9), val = w * 100 + tn * 10 + hu;
        return { q: 'Write as a decimal: <b>' + w + ' ones, ' + tn + ' tenths and ' + hu + ' hundredths</b>.', type: 'num', answer: A.clean(val / 100),
          fig: dblocks(val), hint: tn === 0 ? 'There are 0 tenths, so the tenths place needs a 0.' : 'Ones before the point, then tenths, then hundredths.',
          steps: ['Ones: ' + w + '.', 'Tenths go first after the point: ' + tn + '.', 'Hundredths go second: ' + hu + '. The number is ' + f2(val) + '.' + dchart(val)],
          explain: w + ' + ' + (tn / 10) + ' + ' + (hu / 100) + ' = ' + f2(val) + '.' };
      } },
      { id: 'de-line', name: 'Decimals on a number line', code: 'B1.5', gen: function (lv) {
        var w = lv === 1 ? 0 : R.int(1, 8), c, fig, steps;
        if (lv < 3) {
          c = w * 100 + R.int(1, 9) * 10;
          fig = D.fline(1, 10, [{ v: (c - w * 100) / 100 }], 'Number line from ' + w + ' to ' + (w + 1) + ' in tenths').replace(/>(\d)<\/text>/g, function (m, d) { return '>' + (w + +d) + '</text>'; });
          steps = ['From ' + w + ' to ' + (w + 1) + ' is cut into 10 equal jumps. Each jump is 0.1.', 'Count jumps from ' + w + ': ' + (c / 10 - w * 10) + '.', 'The point is at ' + t(c) + '.'];
        } else {
          var lo = R.int(1, 9) * 10 + w * 100; c = lo + R.pick([1, 2, 3, 4, 6, 7, 8, 9]);
          fig = zoom(c, false).replace(/<text x="[\d.]+" y="88"[^>]*>[^<]*<\/text>/, '');
          steps = ['The top line is in tenths. The bottom line zooms in on ' + f2(lo) + ' to ' + f2(lo + 10) + '.', 'The bottom line is cut into 10 jumps of 0.01. Count jumps from ' + f2(lo) + ': ' + (c - lo) + '.', 'The point is at ' + f2(c) + '.'];
        }
        return { q: 'What decimal does the yellow point show?', type: 'num', answer: A.clean(c / 100), fig: fig,
          hint: 'How big is each jump? Count jumps from the left end.', steps: steps, explain: 'The point is at ' + (lv < 3 ? t(c) : f2(c)) + '.' };
      } },
      { id: 'de-compare', name: 'Compare decimals', code: 'B1.5', gen: function (lv) {
        var a, b;
        if (lv === 1) { a = R.int(1, 9) * 10 + R.int(0, 9); b = R.int(1, 9) * 10 + R.int(0, 9); while (b === a) b = R.int(10, 99); }
        else if (lv === 2) { var tt = R.int(1, 8); a = tt * 10 + 10; b = R.int(0, 1) ? tt * 10 + R.int(1, 9) : a + R.int(1, 9); }
        else { var base = R.int(1, 5) * 100; a = base + R.int(1, 9) * 10; b = base + R.int(0, 9) * 10 + R.int(1, 9); while (Math.floor(b / 10) === Math.floor(a / 10)) b += 10; }
        var sa = lv === 2 ? t(a) : f2(a), sb = f2(b), big = a > b ? sa : sb;
        var o = R.mc(big, [a > b ? sb : sa, 'They are equal']);
        return { q: 'Which is greater: <span class="math">' + sa + '</span> or <span class="math">' + sb + '</span>?', type: 'mc', options: o.options, answer: o.answer,
          fig: a <= 100 && b <= 100 ? '<div class="pies"><figure>' + tgrid(a, 13) + '<figcaption>' + sa + '</figcaption></figure><figure>' + tgrid(b, 13) + '<figcaption>' + sb + '</figcaption></figure></div>' : dchart(a) + dchart(b),
          hint: 'Write both with two decimal places, then compare from the left.',
          steps: ['Write both with 2 decimal places: ' + f2(a) + ' and ' + f2(b) + '.', 'Compare from the left: ones, then tenths, then hundredths.', big + ' is greater.'],
          explain: f2(a) + ' vs ' + f2(b) + ': ' + big + ' is greater.' };
      } },
      { id: 'de-round', name: 'Round to the nearest tenth', code: 'B1.6', gen: function (lv) {
        var c = lv === 1 ? R.int(1, 9) * 10 + R.pick([1, 2, 3, 7, 8, 9]) : lv === 2 ? R.int(100, 999) : R.int(1, 9) * 100 + 90 + R.int(5, 9);
        if (c % 10 === 0) c += 3;
        var lo = Math.floor(c / 10) * 10, ans = c % 10 >= 5 ? lo + 10 : lo;
        return { q: 'Round <span class="math">' + f2(c) + '</span> to the nearest tenth.', type: 'num', answer: A.clean(ans / 100),
          fig: lv < 3 ? zoom(c, false) : '', hint: lv < 3 ? 'Is the yellow point before or after halfway?' : 'Look at the hundredths digit. 5 or more rounds up.',
          steps: ['The tenths on either side are ' + (lo / 100).toFixed(1) + ' and ' + ((lo + 10) / 100).toFixed(1) + '.', 'The hundredths digit is ' + c % 10 + '.', (c % 10 >= 5 ? 'That is 5 or more, so round up to ' : 'That is less than 5, so round down to ') + (ans / 100).toFixed(1) + '.' + (lv === 3 ? '<div class="fig">' + zoom(c, true) + '</div>' : '')],
          explain: f2(c) + ' rounds to ' + (ans / 100).toFixed(1) + '.' };
      } },
      { id: 'de-fdp', name: 'Fractions, decimals and percents', code: 'B1.7', gen: function (lv) {
        var list = lv === 1 ? [[1, 2], [1, 4], [3, 4], [1, 10], [3, 10], [7, 10], [9, 10]] : lv === 2 ? [[1, 5], [2, 5], [3, 5], [4, 5], [1, 4], [3, 4], [1, 20], [3, 20]] : [[7, 20], [9, 25], [3, 25], [11, 20], [6, 25], [1, 50], [17, 50]];
        var p = R.pick(list), n = p[0], d = p[1], k = 100 / d, h = n * k, ask = R.pick(lv === 1 ? ['dec', 'pct'] : ['dec', 'pct', 'frac']);
        if (ask === 'frac') {
          var o = R.mc(n + '/' + d, [(n + 1) + '/' + d, h + '/' + d, n + '/' + (d * 10)]);
          return { q: 'Which fraction is equal to <span class="math">' + h + '%</span>?', type: 'mc', options: o.options, answer: o.answer, hint: 'Write ' + h + '% as a fraction out of 100, then simplify.',
            steps: [h + '% = ' + h + '/100.', 'Divide the top and bottom by ' + k + '.', h + '/100 = ' + n + '/' + d + '.'], explain: h + '% = ' + h + '/100 = ' + n + '/' + d + '.' };
        }
        return { q: 'Write <span class="math">' + n + '/' + d + '</span> as a ' + (ask === 'dec' ? 'decimal' : 'percent') + '.', type: 'num', answer: ask === 'dec' ? A.clean(h / 100) : h, unit: ask === 'pct' ? '%' : '',
          fig: lv < 3 ? A.draw.fbars([{ n: n, d: d }], { w: 400 }) : '', hint: 'What do you multiply ' + d + ' by to get 100?',
          steps: [d + ' &times; ' + k + ' = 100, so multiply the top by ' + k + ' too: ' + n + ' &times; ' + k + ' = ' + h + '.', n + '/' + d + ' = ' + h + '/100.<div class="fig">' + tgrid(h, 12) + '</div>', h + '/100 = ' + (ask === 'dec' ? t(h) : h + '%') + '.'],
          explain: n + '/' + d + ' = ' + h + '/100 = ' + t(h) + ' = ' + h + '%.' };
      } },
      { id: 'de-addsub', name: 'Add and subtract decimals', code: 'B2.4', gen: function (lv) {
        var a, b, op = lv === 1 ? '+' : R.pick(['+', '-']);
        if (lv === 1) { a = R.int(11, 89) * 10; b = R.int(11, 89) * 10; }
        else if (lv === 2) { a = R.int(101, 999); b = R.int(101, 999); }
        else { a = R.int(1001, 4999); b = R.int(10, 99) * 10; }
        if (op === '-' && b > a) { var tt = a; a = b; b = tt; }
        var r = op === '+' ? a + b : a - b, sa = lv === 1 ? t(a) : f2(a), sb = lv === 2 ? f2(b) : t(b);
        return { q: '<span class="math">' + sa + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + sb + '</span> = ?', type: 'num', answer: A.clean(r / 100),
          hint: 'Line up the decimal points. Fill empty places with zeros.',
          steps: ['Estimate: about ' + Math.round(a / 100) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + Math.round(b / 100) + ' = ' + (op === '+' ? Math.round(a / 100) + Math.round(b / 100) : Math.round(a / 100) - Math.round(b / 100)) + '.', 'Write both with 2 decimal places: ' + f2(a) + ' and ' + f2(b) + '.', (op === '+' ? 'Add' : 'Subtract') + ' like whole numbers, keeping the point in line: ' + f2(r) + '.<br>' + cols(a, b, r, op)],
          explain: f2(a) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + f2(b) + ' = ' + f2(r) + '.' };
      } },
      { id: 'de-mental', name: 'Multiply by 0.1 and 0.01, estimate', code: 'B2.3', gen: function (lv) {
        if (lv < 3) {
          var n = lv === 1 ? R.int(2, 99) * 10 : R.int(11, 999), k = lv === 1 ? 0.1 : R.pick([0.1, 0.01]), res = A.clean(n * k);
          return { q: '<span class="math">' + n + ' &times; ' + k + '</span> = ?', type: 'num', answer: res, hint: 'Multiplying by ' + k + ' is the same as dividing by ' + (k === 0.1 ? 10 : 100) + '.',
            steps: ['&times; ' + k + ' means one ' + (k === 0.1 ? 'tenth' : 'hundredth') + ' of the number.', 'That is the same as ' + n + ' &divide; ' + (k === 0.1 ? 10 : 100) + '.', 'Each digit moves ' + (k === 0.1 ? 1 : 2) + ' place' + (k === 0.1 ? '' : 's') + ' right: ' + res + '.'],
            explain: n + ' &times; ' + k + ' = ' + res + '.' };
        }
        var a = R.int(101, 999), b = R.int(101, 999), est = Math.round(a / 100) + Math.round(b / 100);
        var o = R.mc(String(est), [String(est + 1), String(est - 1), String(est + 10)]);
        return { q: 'Estimate by rounding each number to the nearest whole number: <span class="math">' + f2(a) + ' + ' + f2(b) + '</span>', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Round each number first, then add.', steps: [f2(a) + ' rounds to ' + Math.round(a / 100) + '.', f2(b) + ' rounds to ' + Math.round(b / 100) + '.', Math.round(a / 100) + ' + ' + Math.round(b / 100) + ' = ' + est + '.'],
          explain: 'About ' + est + '. The exact sum is ' + f2(a + b) + '.' };
      } }
    ]
  });
})();
