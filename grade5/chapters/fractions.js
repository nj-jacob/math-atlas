(function () {
  var A = Atlas;
  function bar(n, d, y, w, h, label) {
    var s = '', cw = w / d;
    for (var i = 0; i < d; i++) {
      s += '<rect x="' + (10 + i * cw) + '" y="' + y + '" width="' + cw + '" height="' + h + '" style="fill:' + (i < n ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="' + (d > 40 ? 0.5 : 2) + '"/>';
    }
    return s;
  }
  function dec(n, d) {
    var r = d / A.gcd(n, d) || d;
    if (n === 0) return { t: '0', exact: true };
    var g = A.gcd(n, d), rd = d / g;
    while (rd % 2 === 0) rd /= 2;
    while (rd % 5 === 0) rd /= 5;
    var exact = rd === 1, v = n / d;
    return { t: exact ? String(parseFloat(v.toFixed(4))) : v.toFixed(3), exact: exact };
  }
  function mixed(n, d) {
    var w = Math.floor(n / d), r = n % d;
    if (r === 0) return String(w);
    return (w ? w + ' ' : '') + r + '/' + d;
  }

  var R = A.R, D = A.draw;
  /* circles side by side, each with a caption */
  function pies(list, r) {
    return '<div class="pies">' + list.map(function (p) { return '<figure>' + D.pie(p[0], p[1], r || 42, null, p[3]) + '<figcaption>' + p[2] + '</figcaption></figure>'; }).join('') + '</div>';
  }
  function rep(c, k) { var a = []; for (var i = 0; i < k; i++) a.push(c); return a; }
  /* the same bar cut into 4 equal parts and into 4 unequal parts */
  function fairUnfair() {
    var s = '', eq = [0, 0.25, 0.5, 0.75, 1], un = [0, 0.12, 0.45, 0.62, 1];
    [[eq, 10, 'Equal parts: each one is 1/4', 'var(--good)', '&#10003;'], [un, 70, 'Unequal parts: not quarters', 'var(--bad)', '&#10007;']].forEach(function (r) {
      for (var i = 0; i < 4; i++) s += '<rect x="' + (10 + 300 * r[0][i]) + '" y="' + r[1] + '" width="' + (300 * (r[0][i + 1] - r[0][i])) + '" height="34" style="fill:' + (i === 0 ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/>';
      s += '<text x="322" y="' + (r[1] + 25) + '" font-size="24" font-weight="800" style="fill:' + r[3] + '">' + r[4] + '</text><text x="348" y="' + (r[1] + 23) + '" font-size="15">' + r[2] + '</text>';
    });
    return A.svg(560, 112, s, 'A bar cut into 4 equal parts is cut into quarters. A bar cut into 4 unequal parts is not.');
  }
  function lcm(a, b) { return a * b / A.gcd(a, b); }

  /* ---------- Lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = A.kit;
  function P(id, lv) { return K.P('fractions', id, lv); }
  function bars(rows, o) { return '<div class="g5-anim">' + D.fbars(rows, Object.assign({ w: 460 }, o || {})) + '</div>'; }
  function shadeT(k, r) { return function (t) { return t.shade(k, r || 0, 260); }; }
  var LESSONS = [
    { id: 'parts', title: 'What a fraction means', sub: 'Equal parts of one whole.', concepts: [
      { id: 'equal', title: 'Equal parts', exp: ['B1.3'], skill: 'fr-name',
        body: '<p>A fraction names <b>equal</b> parts of a whole. The bottom number says how many equal parts. The top number says how many you have.</p>',
        watch: { tool: 'fractions', opts: { parts: 1, choices: [] }, steps: [
          { say: 'Here is one whole strip.', ms: 1000 },
          { say: 'Cut it into <b>8 equal parts</b>. Each part is one eighth.', act: function (t) { return t.split(8); } },
          { say: 'Shade 3 parts.', act: shadeT(3) },
          { say: '3 of 8 equal parts: <b>3/8</b>. The 8 tells the size of each part. The 3 tells how many.', ms: 2400 }
        ] },
        try: { tool: 'fractions', opts: { parts: 1, choices: [2, 3, 4, 5, 6, 8, 10] }, tasks: [
          { do: 'Show <b>3/4</b>. Pick the number of parts, then tap parts to shade them.', goal: function (s) { return s[0].d === 4 && s[0].n === 3; }, yes: 'Yes. 3 of 4 equal parts.' },
          { do: 'Show <b>5/6</b>.', goal: function (s) { return s[0].d === 6 && s[0].n === 5; }, yes: 'Yes. 5 sixths.' },
          { do: 'Show <b>7/10</b>.', goal: function (s) { return s[0].d === 10 && s[0].n === 7; }, yes: 'Yes. 7 tenths.' }
        ] },
        key: '<p><b>Bottom: how many equal parts. Top: how many you have.</b> The parts must be equal.</p>',
        mistake: '<p>Counting unequal pieces as a fraction, or writing the parts left over instead of the parts shaded. Ask: "Are the parts the same size? How many are shaded out of how many in all?"</p><div class="fig">' + fairUnfair() + '</div>',
        check: [P('fr-name', 1), P('fr-name', 2)] },

      { id: 'names', title: 'One amount, three names', exp: ['B1.3'], skill: 'fr-name', hard: true,
        body: '<p>The same amount can be a <b>fraction</b>, a <b>decimal</b> or a <b>percent</b>. Percent means "out of 100".</p>',
        watch: K.watch([
          { say: 'Here is 1/4 of a strip.', fig: bars([{ n: 1, d: 4, label: '1/4' }]) },
          { say: 'Cut the same strip into 100 parts. 1/4 covers 25 of them.', fig: bars([{ n: 1, d: 4, label: '1/4' }, { n: 25, d: 100, label: '25/100' }], { mark: 0.25 }) },
          { say: '25 out of 100 is the decimal <b>0.25</b>.', fig: bars([{ n: 1, d: 4, label: '1/4' }, { n: 25, d: 100, label: '0.25' }], { mark: 0.25 }) },
          { say: '25 out of 100 is also <b>25%</b>. Three names, one amount.', fig: bars([{ n: 1, d: 4, label: '1/4' }, { n: 25, d: 100, label: '25%' }], { mark: 0.25 }), ms: 2200 }
        ]),
        try: K.widget('fractions', 0, 'Nice. Try 10 parts and 100 parts. Those turn into decimals easily.'),
        ways: [
          { label: 'Out of 100', html: '<p>Make the bottom 100. 3/4 = 75/100, which is <b>0.75</b> and <b>75%</b>.</p><div class="fig">' + D.fbars([{ n: 3, d: 4, label: '3/4' }, { n: 75, d: 100, label: '75%' }], { w: 440, mark: 0.75 }) + '</div>' },
          { label: 'With money', html: '<p>A dollar is 100 cents. A quarter is 1/4 of a dollar: 25 cents, or $0.25. That is 25% of a dollar.</p>' },
          { label: 'Halves', html: '<p>1/2 = 50/100 = 0.5 = 50%. Half of anything is 50%.</p><div class="fig">' + pies([[1, 2, '1/2 = 50%'], [1, 4, '1/4 = 25%'], [3, 4, '3/4 = 75%']], 40) + '</div>' }
        ],
        key: '<p><b>Percent means out of 100.</b> 1/4 = 25/100 = 0.25 = 25%.</p>',
        mistake: '<p>Writing 1/4 as 0.4 or 4% (copying the bottom number). Rewrite the fraction out of 100 first: 1/4 = 25/100.</p>',
        check: [function () {
          var p = R.pick([[1, 2, 50], [1, 4, 25], [3, 4, 75], [1, 10, 10], [3, 10, 30], [7, 10, 70], [1, 5, 20], [2, 5, 40], [4, 5, 80]]);
          return K.mc('Which percent is the same as <span class="math">' + p[0] + '/' + p[1] + '</span>?', p[2] + '%', [p[1] + '%', (p[0] * 10 === p[2] ? p[2] + 5 : p[0] * 10) + '%', p[0] + p[1] + '%'],
            { fig: D.fbars([{ n: p[2], d: 100, label: '' }], { w: 420, lw: 10 }), hint: 'Rewrite it out of 100.', explain: p[0] + '/' + p[1] + ' = ' + p[2] + '/100 = ' + p[2] + '%.' });
        }, P('fr-name', 3)] }
    ] },

    { id: 'equiv', title: 'Equivalent fractions', sub: 'Different names, same size.', concepts: [
      { id: 'same-size', title: 'Same size, different names', exp: ['B1.3'], skill: 'fr-equiv',
        body: '<p>Cut every piece into the same number of smaller pieces. The shaded amount does not change. 3/4 = 6/8.</p>',
        watch: { tool: 'fractions', opts: { wall: [4, 4] }, steps: [
          { say: 'Shade 3/4 of the top strip.', act: shadeT(3, 0) },
          { say: 'The bottom strip is the same size. Cut each quarter in two.', act: function (t) { return t.split(8, 1); } },
          { say: 'Shade the same length: 6 eighths.', act: shadeT(6, 1) },
          { say: 'Same length, so <b>3/4 = 6/8</b>. Top and bottom were both multiplied by 2.', ms: 2400 }
        ] },
        try: { tool: 'fractions', opts: { wall: [3, 6, 12] }, tasks: [
          { do: 'The top strip shows <b>2/3</b>. Shade the same length on the sixths strip.', setup: function (t) { t.fast = true; t.shade(2, 0).then(function () { t.fast = false; }); },
            goal: function (s) { return s[1].n === 4; }, yes: 'Yes. 2/3 = 4/6.' },
          { do: 'Now shade the same length on the twelfths strip.', reset: false, goal: function (s) { return s[2].n === 8; }, yes: 'Yes. 2/3 = 4/6 = 8/12.' }
        ] },
        key: '<p>Multiply the top and bottom by the <b>same</b> number. The fraction keeps its size.</p>',
        check: [P('fr-equiv', 1), P('fr-equiv', 2)] },

      { id: 'simplest', title: 'Simplest form', exp: ['B1.3'], skill: 'fr-equiv', hard: true,
        body: '<p>To simplify, <b>divide</b> the top and bottom by the same number. Fewer, bigger pieces cover the same length.</p>',
        watch: K.watch([
          { say: 'Here is 6/8.', fig: bars([{ n: 6, d: 8, label: '6/8' }], { mark: 0.75 }) },
          { say: '6 and 8 can both be divided by 2.', fig: bars([{ n: 6, d: 8, label: '6/8' }, { n: 3, d: 4, label: '?' }], { mark: 0.75 }) },
          { say: 'Join pairs of eighths into quarters: <b>6/8 = 3/4</b>.', fig: bars([{ n: 6, d: 8, label: '6/8' }, { n: 3, d: 4, label: '3/4' }], { mark: 0.75 }) },
          { say: '3 and 4 share no factor except 1, so 3/4 is in <b>simplest form</b>.', fig: bars([{ n: 3, d: 4, label: '3/4' }], { mark: 0.75 }), ms: 2200 }
        ]),
        try: K.widget('fractions', 1, 'Good. Try multiplying by 1: the fraction stays exactly the same.'),
        ways: [
          { label: 'Group the pieces', html: '<p>Put the eighths in pairs. Each pair is a quarter. 6 eighths make 3 pairs, so 6/8 = 3/4.</p><div class="fig">' + D.fbars([{ n: 6, d: 8, label: '6/8', cols: ['var(--strand)', 'var(--strand)', 'var(--hi)', 'var(--hi)', 'var(--strand)', 'var(--strand)'] }], { w: 440 }) + '</div>' },
          { label: 'Factors', html: '<p>Find a number that divides both. 12/16: both divide by 4. 12 &divide; 4 = 3 and 16 &divide; 4 = 4, so 12/16 = 3/4.</p>' },
          { label: 'Number line', html: '<div class="fig">' + D.fline(1, 8, [{ v: 0.75, label: '6/8 = 3/4' }], 'Number line from 0 to 1 in eighths with 6/8 marked') + '</div><p>Both names land on the same point.</p>' }
        ],
        key: '<p><b>Divide top and bottom by the same number</b> until nothing else divides both.</p>',
        mistake: '<p>Adding or subtracting the same number from top and bottom (3/4 &rarr; 4/5). That changes the size. Only multiplying or dividing both by the same number keeps it.</p>',
        check: [P('fr-equiv', 2), P('fr-equiv', 3)] }
    ] },

    { id: 'mixed', title: 'More than one whole', sub: 'Improper fractions and mixed numbers.', concepts: [
      { id: 'improper', title: 'Improper fractions and mixed numbers', exp: ['B1.3'], skill: 'fr-mixed', hard: true,
        body: '<p>When the top is bigger than the bottom, you have more than one whole. <b>11/4</b> is 2 whole strips and 3 more quarters: <b>2&nbsp;3/4</b>.</p>',
        watch: { tool: 'fractions', opts: { wall: [4, 4, 4] }, steps: [
          { say: 'Count 11 quarters. Fill the first whole: 4 quarters.', act: shadeT(4, 0) },
          { say: '4 more quarters fill a second whole. That is 8.', act: shadeT(4, 1) },
          { say: '3 more quarters. That is 11.', act: shadeT(3, 2) },
          { say: '2 wholes and 3 quarters: <b>11/4 = 2&nbsp;3/4</b>.', ms: 2400 }
        ] },
        try: K.widget('fractions', 2, 'Nice. Watch the mixed number change each time a new whole fills up.'),
        ways: [
          { label: 'Divide', html: '<p>11 &divide; 4 = 2 remainder 3. The 2 is the wholes. The 3 is the quarters left: 2&nbsp;3/4.</p>' },
          { label: 'Number line', html: '<div class="fig">' + D.fline(3, 4, [{ v: 11 / 4, label: '11/4' }], 'Number line from 0 to 3 in quarters with 11/4 marked') + '</div><p>Count 11 quarter jumps. You pass 1 and 2, then go 3 more.</p>' },
          { label: 'Back again', html: '<p>2&nbsp;3/4 to an improper fraction: 2 wholes is 2 &times; 4 = 8 quarters, plus 3 is <b>11/4</b>.</p>' }
        ],
        key: '<p><b>Improper to mixed: divide.</b> 11 &divide; 4 = 2 R 3, so 2&nbsp;3/4. <b>Mixed to improper:</b> wholes &times; bottom + top.</p>',
        mistake: '<p>Writing 7/3 as 2&nbsp;1/7. The leftover piece is still a third, so the bottom stays 3: 7/3 = 2&nbsp;1/3.</p>',
        check: [P('fr-mixed', 1), P('fr-mixed', 2)] }
    ] },

    { id: 'compare', title: 'Comparing fractions', sub: 'Which is greater?', concepts: [
      { id: 'pieces', title: 'Same bottom or same top', exp: ['B1.4'], skill: 'fr-compare',
        body: '<p><b>Same bottom:</b> the pieces are the same size, so the bigger top wins. <b>Same top:</b> the smaller bottom wins, because its pieces are bigger.</p>',
        watch: { tool: 'fractions', opts: { wall: [8, 8] }, steps: [
          { say: '5/8 and 3/8. The same size pieces.', act: function (t) { return t.shade(5, 0, 200).then(function () { return t.shade(3, 1, 200); }); } },
          { say: '5 pieces is more than 3, so <b>5/8 &gt; 3/8</b>.', ms: 1800 },
          { say: 'Now 1/3 and 1/5.', act: function (t) { var f = t.fast; t.fast = true; t.split(3, 0); t.split(5, 1); t.fast = f; return t.shade(1, 0).then(function () { return t.shade(1, 1); }); } },
          { say: 'One piece each, but thirds are bigger pieces. <b>1/3 &gt; 1/5</b>.', ms: 2200 }
        ] },
        try: { tool: 'fractions', opts: { wall: [4, 8] }, tasks: [
          { do: 'Shade <b>1/4</b> on top and <b>1/8</b> below. Which is bigger?', goal: function (s) { return s[0].n === 1 && s[1].n === 1; }, yes: 'Yes. A quarter is twice as big as an eighth, so 1/4 > 1/8.' },
          { do: 'Shade <b>3/4</b> on top and <b>5/8</b> below. Which is bigger?', goal: function (s) { return s[0].n === 3 && s[1].n === 5; }, yes: 'Yes. 3/4 is 6/8, so it is more than 5/8.' }
        ] },
        key: '<p>Same bottom: <b>bigger top is bigger</b>. Same top: <b>smaller bottom is bigger</b>.</p>',
        mistake: '<p>Thinking 1/8 &gt; 1/4 because 8 &gt; 4. More parts means <b>smaller</b> parts. Cut two equal strips of paper to show it.</p><div class="fig">' + pies([[1, 8, '1/8'], [1, 4, '1/4']], 36) + '</div>',
        check: [P('fr-compare', 1), P('fr-compare', 2)] },

      { id: 'common', title: 'Make the bottoms match', exp: ['B1.4'], skill: 'fr-compare', hard: true,
        body: '<p>When the tops and bottoms are both different, rewrite one fraction so the bottoms match. Then compare the tops.</p>',
        watch: K.watch([
          { say: 'Which is greater, 5/8 or 3/4?', fig: bars([{ n: 5, d: 8 }, { n: 3, d: 4, col: 'var(--hi)' }]) },
          { say: 'Rewrite 3/4 in eighths: multiply top and bottom by 2.', fig: bars([{ n: 5, d: 8 }, { n: 6, d: 8, label: '3/4', col: 'var(--hi)' }]) },
          { say: '3/4 = 6/8. Now the pieces match.', fig: bars([{ n: 5, d: 8 }, { n: 6, d: 8, label: '6/8', col: 'var(--hi)' }], { mark: 0.75 }) },
          { say: '6/8 &gt; 5/8, so <b>3/4 &gt; 5/8</b>.', fig: bars([{ n: 5, d: 8 }, { n: 6, d: 8, label: '3/4', col: 'var(--hi)' }], { mark: 0.75 }), ms: 2200 }
        ]),
        example: K.watch([
          { say: 'My turn. Which is greater: 2/3 or 5/6?', fig: bars([{ n: 2, d: 3 }, { n: 5, d: 6, col: 'var(--hi)' }]), ms: 1200 },
          { say: 'The bottoms are different. Thirds and sixths are different sizes, so I cannot compare the tops yet.', fig: bars([{ n: 2, d: 3 }, { n: 5, d: 6, col: 'var(--hi)' }]), ms: 1600 },
          { say: 'I rewrite 2/3 in sixths. 3 &times; 2 = 6, so I multiply the top and the bottom by 2.', fig: bars([{ n: 4, d: 6, label: '2/3' }, { n: 5, d: 6, col: 'var(--hi)' }]), ms: 1600 },
          { say: '2 &times; 2 = 4. So 2/3 = 4/6. The shaded part did not change size.', fig: bars([{ n: 4, d: 6, label: '4/6' }, { n: 5, d: 6, col: 'var(--hi)' }]), ms: 1600 },
          { say: 'Now the bottoms match. I compare the tops: 5 is more than 4.', fig: bars([{ n: 4, d: 6, label: '4/6' }, { n: 5, d: 6, col: 'var(--hi)' }], { mark: 5 / 6 }), ms: 1500 },
          { say: 'So <b>5/6 &gt; 2/3</b>. Match the bottoms, then compare the tops.', fig: bars([{ n: 4, d: 6, label: '2/3' }, { n: 5, d: 6, col: 'var(--hi)' }], { mark: 5 / 6 }), ms: 2000 }
        ]),
        try: K.widget('fractions', 3, 'Good. Try two fractions that are equal, like 2/4 and 3/6.'),
        ways: [
          { label: 'Use 1/2', html: '<p>Compare each fraction to one half. 3/8 is less than 4/8 (a half). 4/6 is more than 3/6 (a half). So 3/8 &lt; 4/6.</p>' },
          { label: 'Number line', html: '<div class="fig">' + D.fline(1, 8, [{ v: 5 / 8, label: '5/8', col: 'var(--strand)' }, { v: 0.75, label: '3/4', up: false }], 'Number line from 0 to 1 with 5/8 and 3/4') + '</div><p>The fraction further right is greater.</p>' },
          { label: 'How far from 1', html: '<p>5/8 is 3 eighths away from 1. 3/4 is 1 quarter (2 eighths) away. 3/4 is closer to 1, so it is greater.</p>' }
        ],
        key: '<p><b>Match the bottoms, then compare the tops.</b></p>',
        mistake: '<p>Comparing only the tops (5/8 &gt; 3/4 "because 5 &gt; 3"). The pieces are different sizes. Draw both on strips of the same length.</p>',
        check: [P('fr-compare', 3), P('fr-compare', 2)] }
    ] },

    { id: 'add', title: 'Adding and subtracting', sub: 'Fractions with the same bottom.', concepts: [
      { id: 'like', title: 'Add and subtract same-size pieces', exp: ['B2.5'], skill: 'fr-add',
        body: '<p>Same bottom means same-size pieces. Add or subtract the <b>tops</b>. The bottom stays, because the size of the pieces does not change.</p>',
        watch: { tool: 'fractions', opts: { parts: 8, choices: [] }, steps: [
          { say: '3/8 + 4/8. Shade 3 eighths.', act: shadeT(3) },
          { say: 'Add 4 more eighths.', act: function (t) { return t.shade(7, 0, 260); } },
          { say: '7 pieces, and each is still an eighth: <b>3/8 + 4/8 = 7/8</b>.', ms: 2400 }
        ] },
        try: { tool: 'fractions', opts: { parts: 6, choices: [] }, tasks: [
          { do: 'Shade <b>2/6</b>, then add <b>3/6</b>. What do you get?', goal: function (s) { return s[0].n === 5; }, yes: 'Yes. 2/6 + 3/6 = 5/6.' },
          { do: 'Start at <b>5/6</b> and take away <b>4/6</b>.', reset: false, goal: function (s) { return s[0].n === 1; }, yes: 'Yes. 5/6 − 4/6 = 1/6.' }
        ] },
        ways: [
          { label: 'In words', html: '<p>3 eighths + 4 eighths = 7 eighths, just like 3 apples + 4 apples = 7 apples. "Eighths" is the thing you are counting.</p>' },
          { label: 'Number line', html: '<div class="fig">' + D.fline(1, 8, [{ v: 3 / 8, label: '3/8', col: 'var(--strand)' }, { v: 7 / 8, label: '7/8', up: false }], 'Number line: jump from 3/8 to 7/8') + '</div><p>Start at 3/8 and jump 4 eighths.</p>' }
        ],
        key: '<p><b>Add the tops. Keep the bottom.</b></p>',
        mistake: '<p>Adding the bottoms too: 1/4 + 2/4 = 3/8. The bars show 3/8 is much less than 3/4. Say it in words: "1 quarter + 2 quarters = 3 quarters".</p><div class="fig">' + D.fbars([{ n: 3, d: 4, label: '3/4' }, { n: 3, d: 8, label: '3/8', col: 'var(--bad)' }], { w: 400 }) + '</div>',
        check: [P('fr-add', 1), P('fr-add', 2)] }
    ] },

    { id: 'unit', title: 'Whole numbers and unit fractions', sub: 'Groups of, and how many fit.', concepts: [
      { id: 'times', title: 'Groups of a unit fraction', exp: ['B2.8'], skill: 'fr-unit',
        body: '<p>A <b>unit fraction</b> has 1 on top, like 1/4. <b>3 &times; 1/4</b> means 3 groups of one quarter: 3/4.</p>',
        watch: K.watch([
          { say: '5 &times; 1/3 means 5 pieces that are each one third.', fig: bars([{ n: 1, d: 3, label: '1/3' }], { unit: 180, lw: 90, w: 520 }) },
          { say: 'Two thirds.', fig: bars([{ n: 2, d: 3, label: '2 &times; 1/3' }], { unit: 180, lw: 90, w: 520 }) },
          { say: 'Three thirds fill one whole.', fig: bars([{ n: 3, d: 3, label: '3 &times; 1/3' }], { unit: 180, lw: 90, w: 520 }) },
          { say: 'Five thirds: <b>5/3 = 1&nbsp;2/3</b>.', fig: bars([{ n: 5, d: 3, label: '5 &times; 1/3' }], { unit: 180, lw: 90, w: 520 }), ms: 2200 }
        ]),
        try: K.widget('fractions', 5, 'Nice. Keep the operation on "groups of" and change the whole number.'),
        key: '<p><b>5 &times; 1/3 = 5/3.</b> The whole number becomes the top.</p>',
        check: [P('fr-unit', 1), P('fr-unit', 1)] },

      { id: 'divide', title: 'How many fit?', exp: ['B2.8'], skill: 'fr-unit', hard: true,
        body: '<p><b>3 &divide; 1/4</b> asks "how many quarters fit in 3 wholes?" Each whole holds 4 quarters, so the answer is <b>12</b>.</p>',
        watch: { tool: 'fractions', opts: { wall: [1, 1, 1] }, steps: [
          { say: 'Here are 3 wholes.', ms: 1000 },
          { say: 'Cut each whole into quarters.', act: function (t) { return t.split(4, 0).then(function () { return t.split(4, 1); }).then(function () { return t.split(4, 2); }); } },
          { say: 'Count the quarters: 4, 8, 12.', act: function (t) { return t.shade(4, 0, 150).then(function () { return t.shade(4, 1, 150); }).then(function () { return t.shade(4, 2, 150); }); } },
          { say: '12 quarters fit in 3 wholes: <b>3 &divide; 1/4 = 12</b>.', ms: 2400 }
        ] },
        try: { tool: 'fractions', opts: { wall: [3, 3] }, tasks: [
          { do: 'How many thirds fit in 2 wholes? Shade every third.', goal: function (s) { return s[0].n + s[1].n === 6; }, yes: 'Yes. 2 ÷ 1/3 = 6.' }
        ] },
        ways: [
          { label: 'Pizza', html: '<p>2 pizzas, each cut into 1/5 slices. Each pizza gives 5 slices, so 2 &divide; 1/5 = 10 slices.</p>' + pies([[5, 5, 'pizza 1'], [5, 5, 'pizza 2']], 36) },
          { label: 'Multiply', html: '<p>Each whole holds as many pieces as the bottom number. So <b>whole number &times; bottom</b>: 3 &divide; 1/4 = 3 &times; 4 = 12.</p>' },
          { label: 'Number line', html: '<div class="fig">' + D.fline(3, 4, [], 'Number line from 0 to 3 in quarters') + '</div><p>Count the quarter jumps from 0 to 3: there are 12.</p>' }
        ],
        key: '<p>Dividing by a unit fraction gives a <b>bigger</b> number. 3 &divide; 1/4 = 3 &times; 4 = 12.</p>',
        mistake: '<p>Expecting division to make the answer smaller (3 &divide; 1/4 = 3/4). Ask "how many quarters fit in 3?" and count pieces on strips.</p>',
        check: [P('fr-unit', 2), P('fr-unit', 3)] }
    ] }
  ];
  A.register('fractions', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>One amount, three names</h2>' +
'<p>A fraction names equal parts of a whole. The <b>denominator</b> (bottom) says how many equal parts. The <b>numerator</b> (top) says how many you have. The same amount can also be a <b>decimal</b> or a <b>percent</b>, which means "out of 100".</p>' +
'<div class="lab"><span class="lt">Try it: fraction bar</span>' +
'<div class="ctrl"><label for="fd">Parts in the whole<select id="fd"><option>2</option><option>3</option><option>4</option><option selected>5</option><option>6</option><option>8</option><option>10</option><option>12</option><option>20</option><option>25</option><option>100</option></select></label>' +
'<label for="fn">Parts shaded: <output id="fno"></output><input type="range" id="fn" min="0" max="5" value="3"></label></div>' +
'<p class="t2" style="margin:.4em 0 0;font-size:.9rem">Three pictures of the same fraction: a bar, a circle and a point on a number line.</p>' +
'<div class="fig" id="fbar"></div><div class="models" id="fmod"></div><div class="out" id="fout"></div></div>' +
'<div class="eg"><p><b>Example.</b> A pizza is cut into 8 equal slices and you eat 3. You ate 3/8 of the pizza. The 8 tells the size of each slice. The 3 tells how many slices.</p>' + pies([[3, 8, '3/8 eaten'], [5, 8, '5/8 left']]) + '</div>' +
'<div class="key"><b class="t">Key idea</b><p>The parts must be equal in size. A pizza cut into 8 uneven pieces is not cut into eighths.</p><div class="fig">' + fairUnfair() + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Equivalent fractions</h2>' +
'<p>Equivalent fractions have different names but the same size. Multiply or divide the top and bottom by the <b>same</b> number and the fraction keeps its value.</p>' +
'<div class="lab"><span class="lt">Try it: make an equivalent fraction</span>' +
'<div class="ctrl"><label for="en">Top<input type="number" id="en" min="1" max="11" value="2"></label>' +
'<label for="ed">Bottom<select id="ed"><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option><option>8</option><option>10</option><option>12</option></select></label>' +
'<label for="ek">Multiply top and bottom by: <output id="eko"></output><input type="range" id="ek" min="1" max="6" value="2"></label></div>' +
'<div class="fig" id="ebar"></div><div class="out" id="eout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>To write a fraction in <b>simplest form</b>, divide the top and bottom by their biggest common factor. 6/8 divided by 2 is 3/4. Fewer, bigger pieces cover the same length.</p>' +
'<div class="fig">' + D.fbars([{ n: 6, d: 8 }, { n: 3, d: 4 }], { mark: 0.75, w: 440 }) + '</div></div>' +
'<div class="eg"><p><b>Example.</b> 3/4 = ?/12. 4 &times; 3 = 12, so multiply the top by 3 too: 3 &times; 3 = 9. So 3/4 = <b>9/12</b>.</p>' +
'<div class="fig">' + D.fbars([{ n: 3, d: 4 }, { n: 9, d: 12 }], { mark: 0.75, w: 440 }) + '</div><p class="t2">Each quarter splits into 3 twelfths. The shaded length does not change.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Improper fractions and mixed numbers</h2>' +
'<p>When the top is bigger than the bottom, you have more than one whole. 11/4 is an <b>improper fraction</b>. It can also be written as a <b>mixed number</b>: 2 whole bars and 3 quarters, or 2&nbsp;3/4.</p>' +
'<div class="lab"><span class="lt">Try it: wholes and parts</span>' +
'<div class="ctrl"><label for="md">Each whole is split into<select id="md"><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option><option>8</option><option>10</option></select></label>' +
'<label for="mn">Parts shaded: <output id="mno"></output><input type="range" id="mn" min="1" max="40" value="11"></label></div>' +
'<div class="fig" id="mbar"></div><div class="out" id="mout"></div></div>' +
'<div class="eg"><p><b>Example.</b> 7 thirds fill 2 whole bars and 1 more third.</p>' +
'<div class="fig">' + D.fbars([{ n: 7, d: 3, label: '7/3' }], { unit: 140, w: 560 }) + '</div>' +
'<div class="fig">' + D.fline(3, 3, [{ v: 7 / 3, label: '7/3 = 2 1/3' }], 'Number line from 0 to 3 in thirds with 7/3 marked') + '</div>' +
'<p>Mixed to improper: 2&nbsp;1/3 = (2 &times; 3 + 1)/3 = <b>7/3</b>.</p><p>Improper to mixed: 7 &divide; 3 = 2 remainder 1, so 7/3 = <b>2&nbsp;1/3</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Writing 7/3 as 2&nbsp;1/7. The leftover piece is still a third, so it stays over 3: 7/3 = 2&nbsp;1/3.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Comparing fractions</h2>' +
'<ul><li><b>Same denominator:</b> the bigger top is bigger. 5/8 &gt; 3/8.</li>' +
'<li><b>Same numerator:</b> the smaller bottom is bigger, because the pieces are bigger. 1/3 &gt; 1/5.</li>' +
'<li><b>Use a benchmark:</b> compare to 0, 1/2 and 1. 3/8 is less than 1/2 (which is 4/8).</li>' +
'<li><b>Otherwise:</b> rewrite both with a common denominator. 5/8 vs 3/4: 3/4 = 6/8, so 3/4 is greater.</li></ul>' +
'<div class="lab"><span class="lt">Try it: compare two fractions</span>' +
'<div class="ctrl"><label for="ca">First top<input type="number" id="ca" min="0" max="12" value="5"></label>' +
'<label for="cb">First bottom<select id="cb"><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option selected>8</option><option>10</option><option>12</option></select></label>' +
'<label for="cc">Second top<input type="number" id="cc" min="0" max="12" value="3"></label>' +
'<label for="cd">Second bottom<select id="cd"><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option><option>8</option><option>10</option><option>12</option></select></label></div>' +
'<div class="fig" id="cfig"></div><div class="fig" id="cline"></div><div class="out" id="cout"></div></div>' +
'<div class="eg"><p><b>Example.</b> Order 2/3, 1/2 and 5/6 from least to greatest. In sixths they are 4/6, 3/6 and 5/6. So the order is <b>1/2, 2/3, 5/6</b>.</p>' +
'<div class="fig">' + D.fbars([{ n: 3, d: 6, label: '1/2' }, { n: 4, d: 6, label: '2/3' }, { n: 5, d: 6, label: '5/6' }], { w: 440 }) + '</div><p class="t2">All three bars are cut into sixths, so you can count the shaded pieces.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking 1/8 is bigger than 1/4 because 8 is bigger than 4. Eighths are smaller pieces, so 1/8 &lt; 1/4.</p>' + pies([[1, 8, '1/8: small slice'], [1, 4, '1/4: bigger slice']], 40) + '</div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Adding and subtracting like fractions</h2>' +
'<p>When two fractions have the <b>same denominator</b>, the pieces are the same size. Add or subtract the tops. The bottom stays the same, because the size of the pieces does not change.</p>' +
'<div class="eg"><p><b>Example.</b> <span class="math">3/8 + 4/8 = 7/8</span>. 3 eighths and 4 eighths make 7 eighths.</p>' +
'<div class="fig">' + D.fbars([{ n: 7, d: 8, label: '7/8', cols: rep('var(--strand)', 3).concat(rep('var(--hi)', 4)) }], { w: 440 }) + '</div>' +
'<p class="t2">Blue: 3/8. Yellow: 4/8. Every piece is still one eighth.</p><p class="math">7/5 &minus; 3/5 = 4/5</p></div>' +
'<div class="lab"><span class="lt">Try it: same-size pieces</span>' +
'<div class="ctrl"><label for="ad">Pieces in each whole<select id="ad"><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option><option>8</option><option>10</option><option>12</option></select></label>' +
'<label for="an">First top: <output id="ano"></output><input type="range" id="an" min="0" max="12" value="3"></label>' +
'<label for="ao">Operation<select id="ao"><option value="+">add</option><option value="-">subtract</option></select></label>' +
'<label for="bn">Second top: <output id="bno"></output><input type="range" id="bn" min="0" max="12" value="2"></label></div>' +
'<div class="fig" id="afig"></div><div class="out" id="aout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Adding the bottoms. 1/4 + 2/4 is not 3/8. Three quarters is 3/4, and the pieces are still quarters. The bars show that 3/8 is much less.</p>' +
'<div class="fig">' + D.fbars([{ n: 3, d: 4, label: '3/4', cols: ['var(--strand)', 'var(--hi)', 'var(--hi)'] }, { n: 3, d: 8, label: '3/8', col: 'var(--bad)' }], { w: 440 }) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Whole numbers and unit fractions</h2>' +
'<p>A <b>unit fraction</b> has 1 on top, like 1/3 or 1/8. You can multiply a whole number by one, or divide a whole number by one.</p>' +
'<ul><li><b>3 &times; 1/4</b> means 3 groups of one quarter. That is 3/4.</li>' +
'<li><b>3 &divide; 1/4</b> means "how many quarters fit in 3 wholes?" Each whole has 4 quarters, so the answer is 12.</li></ul>' +
'<div class="lab"><span class="lt">Try it: groups of a unit fraction</span>' +
'<div class="ctrl"><label for="uw">Whole number: <output id="uwo"></output><input type="range" id="uw" min="1" max="9" value="3"></label>' +
'<label for="uo">Operation<select id="uo"><option value="x">&times; (groups of)</option><option value="d">&divide; (how many fit)</option></select></label>' +
'<label for="ud">Unit fraction<select id="ud"><option value="2">1/2</option><option value="3">1/3</option><option value="4" selected>1/4</option><option value="5">1/5</option><option value="6">1/6</option><option value="8">1/8</option><option value="10">1/10</option><option value="12">1/12</option></select></label></div>' +
'<div class="fig" id="ufig"></div><div class="out" id="uout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Dividing by a unit fraction gives a <b>bigger</b> number. 2 &divide; 1/5 = 10, because ten fifths fit in two wholes.</p></div>' +
'<div class="eg"><p><b>Example.</b> 5 &times; 1/3 = 5/3 = 1&nbsp;2/3.</p>' +
'<div class="fig">' + D.fbars([{ n: 5, d: 3, label: '5 &times; 1/3' }], { lw: 100, unit: 180, w: 500 }) + '</div>' +
'<p>And 2 &divide; 1/3 = 6, because each whole holds 3 thirds.</p>' +
'<div class="fig">' + D.fbars([{ n: 6, d: 3, label: '2 wholes', cols: ['var(--strand)', 'var(--hi)', 'var(--strand)', 'var(--hi)', 'var(--strand)', 'var(--hi)'] }], { lw: 100, unit: 180, w: 500 }) + '</div><p class="t2">Count the pieces: 6 thirds.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function f1() {
        var d = parseInt($('#fd', root).value, 10), r = $('#fn', root);
        r.max = d;
        var n = Math.min(parseInt(r.value, 10), d);
        r.value = n;
        $('#fno', root).textContent = n + ' of ' + d;
        $('#fbar', root).innerHTML = A.svg(540, 56, bar(n, d, 8, 520, 40), n + ' of ' + d + ' parts shaded');
        $('#fmod', root).innerHTML = '<figure>' + D.pie(n, d, 50) + '<figcaption>circle</figcaption></figure><figure>' + D.fline(1, d <= 25 ? d : 10, [{ v: n / d, label: n + '/' + d }], 'Number line from 0 to 1 with ' + n + '/' + d + ' marked', 380) + '<figcaption>number line</figcaption></figure>';
        var dc = dec(n, d), pc = n * 100 / d, pexact = Number.isInteger(pc);
        $('#fout', root).innerHTML = '<p><span class="big">' + n + '/' + d + '</span> &nbsp;=&nbsp; <span class="big">' + (dc.exact ? '' : '&#8776; ') + dc.t + '</span> &nbsp;=&nbsp; <span class="big">' + (pexact ? '' : '&#8776; ') + (pexact ? pc : pc.toFixed(1)) + '%</span></p>' +
          (dc.exact ? '' : '<p>This one never ends as a decimal, so the numbers are rounded.</p>');
      }
      A.bind(root, ['fd', 'fn'], f1);

      function f2() {
        var d = parseInt($('#ed', root).value, 10), nn = $('#en', root);
        var n = Math.max(1, Math.min(d - 1, parseInt(nn.value, 10) || 1));
        var k = parseInt($('#ek', root).value, 10);
        $('#eko', root).textContent = '× ' + k;
        var s = bar(n, d, 4, 520, 34) + bar(n * k, d * k, 50, 520, 34);
        $('#ebar', root).innerHTML = A.svg(540, 92, s, n + '/' + d + ' and ' + (n * k) + '/' + (d * k) + ' have equal shaded length');
        var g = A.gcd(n * k, d * k);
        $('#eout', root).innerHTML = '<p><span class="big">' + n + '/' + d + ' = ' + (n * k) + '/' + (d * k) + '</span></p>' +
          '<p>Top and bottom were both multiplied by ' + k + '. Simplest form of ' + (n * k) + '/' + (d * k) + ' is ' + ((n * k) / g) + '/' + ((d * k) / g) + '.</p>';
      }
      A.bind(root, ['en', 'ed', 'ek'], f2);

      function f3() {
        var d = parseInt($('#md', root).value, 10), r = $('#mn', root);
        r.max = d * 5;
        var n = Math.min(parseInt(r.value, 10), d * 5);
        $('#mno', root).textContent = n + '/' + d;
        var whole = Math.ceil(n / d), cw = 520 / 5 / 1, s = '';
        var bw = 100;
        for (var b = 0; b < whole; b++) {
          var filled = Math.max(0, Math.min(d, n - b * d)), px = 10 + b * 105;
          for (var i = 0; i < d; i++) s += '<rect x="' + (px + i * bw / d) + '" y="10" width="' + (bw / d) + '" height="36" style="fill:' + (i < filled ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
        }
        $('#mbar', root).innerHTML = A.svg(540, 56, s, n + '/' + d + ' drawn as bars');
        var w = Math.floor(n / d), rem = n % d;
        $('#mout', root).innerHTML = '<p><span class="big">' + n + '/' + d + ' = ' + mixed(n, d).replace(' ', '&nbsp;') + '</span></p>' +
          '<p>' + (w ? w + ' whole' + (w > 1 ? 's' : '') : '') + (w && rem ? ' and ' : '') + (rem ? rem + '/' + d : '') + (n < d ? ' (less than one whole)' : '') + '.</p>';
      }
      A.bind(root, ['md', 'mn'], f3);

      function wholes(parts, d, colourOf, maxW) {
        var count = Math.max(1, Math.ceil(parts.length / d)), bw = Math.min(150, (maxW - 10) / count - 6), sw = '';
        for (var w = 0; w < count; w++) {
          var px = 6 + w * (bw + 6);
          for (var i = 0; i < d; i++) {
            var k = w * d + i;
            sw += '<rect x="' + (px + i * bw / d) + '" y="6" width="' + (bw / d) + '" height="36" style="fill:' + (k < parts.length ? colourOf(parts[k]) : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
            if (parts[k] === 'x') sw += '<line x1="' + (px + i * bw / d + 2) + '" y1="10" x2="' + (px + (i + 1) * bw / d - 2) + '" y2="38" style="stroke:var(--bad)" stroke-width="3"/>';
          }
        }
        return sw;
      }
      function f4() {
        var d = +$('#ad', root).value, ra = $('#an', root), rb = $('#bn', root), op = $('#ao', root).value;
        ra.max = 2 * d; rb.max = 2 * d;
        var a = Math.min(+ra.value, 2 * d), b = Math.min(+rb.value, 2 * d);
        $('#ano', root).textContent = a + '/' + d; $('#bno', root).textContent = b + '/' + d;
        var o = $('#aout', root), f = $('#afig', root);
        if (op === '-' && b > a) { f.innerHTML = ''; o.innerHTML = '<p>The second fraction is bigger than the first. Make the first one bigger, or switch to add.</p>'; return; }
        var r = op === '+' ? a + b : a - b, parts = [], i;
        for (i = 0; i < a; i++) parts.push(op === '-' && i >= a - b ? 'x' : 'a');
        if (op === '+') for (i = 0; i < b; i++) parts.push('b');
        f.innerHTML = A.svg(540, 48, wholes(parts, d, function (t) { return t === 'b' ? 'var(--hi)' : t === 'x' ? 'color-mix(in srgb,var(--bad) 18%,var(--card))' : 'var(--strand)'; }, 540),
          op === '+' ? a + ' blue and ' + b + ' yellow pieces of size 1/' + d : a + ' pieces with ' + b + ' crossed out');
        var g = r ? A.gcd(r, d) : 1;
        o.innerHTML = '<p><span class="big">' + a + '/' + d + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + '/' + d + ' = ' + r + '/' + d + '</span></p>' +
          '<p>' + (op === '+' ? a + ' pieces and ' + b + ' more pieces make ' + r + ' pieces.' : a + ' pieces take away ' + b + ' pieces leaves ' + r + ' pieces.') + ' Each piece is still 1/' + d + '.</p>' +
          (r && g > 1 ? '<p>Simplest form: ' + (r / g) + '/' + (d / g) + '.</p>' : '') +
          (r > d ? '<p>As a mixed number: ' + mixed(r, d).replace(' ', '&nbsp;') + '.</p>' : '');
      }
      A.bind(root, ['ad', 'an', 'ao', 'bn'], f4);

      function cmp() {
        var b = +$('#cb', root).value, d = +$('#cd', root).value;
        var a = Math.max(0, Math.min(b, parseInt($('#ca', root).value, 10) || 0)), c = Math.max(0, Math.min(d, parseInt($('#cc', root).value, 10) || 0));
        var L = lcm(b, d);
        $('#cfig', root).innerHTML = D.fbars([{ n: a, d: b }, { n: c, d: d, col: 'var(--hi)' }], { w: 480 });
        $('#cline', root).innerHTML = D.fline(1, L <= 24 ? L : 2, [{ v: a / b, label: a + '/' + b, col: 'var(--strand)' }, { v: c / d, label: c + '/' + d, up: false }], 'Number line from 0 to 1 with ' + a + '/' + b + ' and ' + c + '/' + d, 480);
        var x = a * L / b, y = c * L / d, sym = x > y ? '&gt;' : x < y ? '&lt;' : '=';
        $('#cout', root).innerHTML = '<p><span class="big">' + a + '/' + b + ' ' + sym + ' ' + c + '/' + d + '</span></p><p>' +
          (b === d ? 'Same size pieces, so compare the tops: ' + a + ' and ' + c + '.' : 'Cut both into ' + L + ' equal pieces: ' + a + '/' + b + ' = ' + x + '/' + L + ' and ' + c + '/' + d + ' = ' + y + '/' + L + '.') +
          (x === y ? ' They are the same size.' : ' The longer bar, and the point further right, is the greater fraction.') + '</p>' +
          '<p class="t2" style="font-size:.9rem">Tops can go up to the bottom number (one whole).</p>';
      }
      A.bind(root, ['ca', 'cb', 'cc', 'cd'], cmp);

      function f5() {
        var w = +$('#uw', root).value, d = +$('#ud', root).value, op = $('#uo', root).value, parts = [], i;
        $('#uwo', root).textContent = w;
        if (op === 'x') {
          for (i = 0; i < w; i++) parts.push('a');
          $('#ufig', root).innerHTML = A.svg(540, 48, wholes(parts, d, function () { return 'var(--strand)'; }, 540), w + ' pieces of size 1/' + d);
          $('#uout', root).innerHTML = '<p><span class="big">' + w + ' &times; 1/' + d + ' = ' + w + '/' + d + '</span></p><p>' + w + ' groups of one ' + (d === 2 ? 'half' : '1/' + d + ' piece') + ' is ' + w + ' pieces.' +
            (w >= d ? ' That is ' + mixed(w, d).replace(' ', '&nbsp;') + '.' : '') + '</p>';
        } else {
          var tot = w * d;
          for (i = 0; i < tot; i++) parts.push(i % 2 ? 'b' : 'a');
          $('#ufig', root).innerHTML = A.svg(540, 48, wholes(parts, d, function (t) { return t === 'b' ? 'var(--hi)' : 'var(--strand)'; }, 540), w + ' wholes, each cut into ' + d + ' pieces');
          $('#uout', root).innerHTML = '<p><span class="big">' + w + ' &divide; 1/' + d + ' = ' + tot + '</span></p><p>Each whole holds ' + d + ' pieces of size 1/' + d + '. ' + w + ' wholes hold ' + w + ' &times; ' + d + ' = ' + tot + ' pieces.</p>';
        }
      }
      A.bind(root, ['uw', 'uo', 'ud'], f5);
    },

    quiz: [
      { q: 'Which fraction is equivalent to 2/3?', type: 'mc', options: ['3/4', '4/6', '2/6', '5/6'], answer: 1, fig: D.fbars([{ n: 2, d: 3 }], { w: 400 }), hint: 'What could the 2 and the 3 both be multiplied by?', explain: 'Multiplying top and bottom by 2 gives 4/6.' },
      { q: 'Write 7/4 as a mixed number.', type: 'mc', options: ['1 1/4', '1 3/4', '2 1/4', '3 4/7'], answer: 1, fig: D.fbars([{ n: 7, d: 4, label: '7/4' }], { unit: 200, w: 560 }), hint: '7 &divide; 4 = 1 remainder 3.', explain: '7 &divide; 4 is 1 with 3 left over, so 1&nbsp;3/4.' },
      { q: 'Write 2&nbsp;1/3 as an improper fraction.', type: 'mc', options: ['3/7', '6/3', '7/3', '5/3'], answer: 2, hint: '2 wholes is 6 thirds.', explain: '2 &times; 3 + 1 = 7, so 7/3.' },
      { q: 'Which is greater, 5/8 or 3/4?', type: 'mc', options: ['5/8', '3/4', 'They are equal'], answer: 1, fig: D.fbars([{ n: 5, d: 8 }, { n: 3, d: 4, col: 'var(--hi)' }], { w: 440 }), hint: 'Write 3/4 in eighths.', explain: '3/4 = 6/8, and 6/8 is more than 5/8.' },
      { q: 'What is 3/8 + 4/8?', type: 'mc', options: ['7/16', '7/8', '1/8', '12/8'], answer: 1, fig: D.fbars([{ n: 7, d: 8, label: '?', cols: rep('var(--strand)', 3).concat(rep('var(--hi)', 4)) }], { w: 440 }), hint: 'The pieces are all eighths. Count the pieces.', explain: '3 eighths + 4 eighths = 7 eighths, or 7/8.' },
      { q: 'What is <span class="math">4 &times; 1/5</span>?', type: 'mc', options: ['4/5', '1/20', '20', '5/4'], answer: 0, hint: '4 groups of one fifth.', explain: '4 groups of 1/5 is 4 fifths, or 4/5.' },
      { q: 'A ribbon is 3 m long. How many pieces 1/2 m long can you cut from it?', type: 'num', answer: 6, unit: 'pieces', fig: D.fline(3, 2, [], 'A 3 metre ribbon drawn as a number line with a mark every half metre'), hint: 'How many halves are in one metre? Then in 3 metres?', explain: '3 &divide; 1/2 = 6, because each metre gives 2 halves.' }
    ],

    quick: ['fr-name', 'fr-equiv', 'fr-mixed', 'fr-compare', 'fr-add', 'fr-unit'],

    practice: [
      { id: 'fr-name', name: 'Name the fraction', code: 'B1.3', gen: function (lv) {
        var d, n, fig, q, ans, wrong, steps;
        if (lv < 3) {
          d = lv === 1 ? R.int(2, 10) : R.pick([3, 4, 5, 6, 8, 10, 12]); n = R.int(1, d - 1);
          fig = lv === 1 ? A.draw.bar(n, d, 400) : A.draw.pie(n, d, 60);
          q = 'What fraction of the ' + (lv === 1 ? 'bar' : 'circle') + ' is shaded?';
          ans = n + '/' + d;
          wrong = [(d - n) + '/' + d, n + '/' + (d - n), d + '/' + n, n + '/' + (d + 1)].filter(function (w) { var t = w.split('/'); return +t[1] > 0 && +t[0] * d !== n * +t[1]; });
          steps = ['Count all the equal parts: ' + d + '. That is the bottom number.', 'Count the shaded parts: ' + n + '. That is the top number.', 'The shaded fraction is ' + ans + '.'];
        } else {
          d = R.pick([2, 3, 4, 5, 6, 8]); n = R.int(1, 2 * d - 1); if (n === d) n++;
          fig = A.draw.fline(2, d, [{ v: n / d }], 'Number line from 0 to 2 with a point marked');
          q = 'What fraction does the yellow point show?';
          ans = n + '/' + d;
          wrong = [n + '/' + (2 * d), (n + 1) + '/' + d, (n - 1 || n + 2) + '/' + d, n + '/' + (d + 1)];
          steps = ['Look between 0 and 1. It is cut into ' + d + ' equal jumps, so each jump is 1/' + d + '.', 'Count the jumps from 0 to the point: ' + n + '.', 'The point is at ' + ans + (n > d ? ', which is ' + mixed(n, d) + '' : '') + '. Do not count all the jumps to 2.'];
        }
        var o = R.mc(ans, wrong);
        return { q: q, type: 'mc', options: o.options, answer: o.answer, fig: fig,
          hint: lv < 3 ? 'The bottom number is how many equal parts in all. The top is how many are shaded.' : 'How many jumps make one whole? Count jumps from 0.',
          steps: steps, explain: 'The answer is ' + ans + '.' };
      } },
      { id: 'fr-equiv', name: 'Equivalent fractions', code: 'B1.3', gen: function (lv) {
        var ds = [2, 3, 4, 5, 6], d = R.pick(ds), n = R.int(1, d - 1), k = lv === 1 ? 2 : R.int(2, lv === 2 ? 4 : 3);
        if (d * k > 12) k = 2;
        if (lv < 3) {
          var askTop = lv === 1 || R.int(0, 1);
          return { q: 'Fill in the missing number: <span class="math">' + n + '/' + d + ' = ' + (askTop ? '?' : n * k) + '/' + (askTop ? d * k : '?') + '</span>', type: 'num', answer: askTop ? n * k : d * k,
            fig: A.draw.bar(n, d, 360) + A.draw.bar(n * k, d * k, 360),
            hint: 'What was the ' + (askTop ? 'bottom' : 'top') + ' number multiplied by? Do the same to the other number.',
            steps: [(askTop ? d + ' became ' + d * k : n + ' became ' + n * k) + ', so it was multiplied by ' + k + '.', 'Multiply the other number by ' + k + ' too.', (askTop ? n + ' &times; ' + k + ' = ' + n * k : d + ' &times; ' + k + ' = ' + d * k) + '.'],
            explain: n + '/' + d + ' = ' + n * k + '/' + d * k + '. Both parts were multiplied by ' + k + '.' };
        }
        var N = n * k, D = d * k, g = A.gcd(n, d), sn = n / g, sd = d / g;
        var o = R.mc(sn + '/' + sd, [N / 2 + '/' + D, (sn + 1) + '/' + sd, sn + '/' + (sd + 1), (N - 1) + '/' + (D - 1)].filter(function (x) { return x.indexOf('.') < 0 && x !== sn + '/' + sd; }));
        return { q: 'Write <span class="math">' + N + '/' + D + '</span> in simplest form.', type: 'mc', options: o.options, answer: o.answer,
          fig: A.draw.fbars([{ n: N, d: D }, { n: sn, d: sd, label: '?', col: 'var(--hi)' }], { w: 440, mark: n / d }),
          hint: 'Find the biggest number that divides both ' + N + ' and ' + D + '.',
          steps: ['The biggest number that divides ' + N + ' and ' + D + ' is ' + A.gcd(N, D) + '.', N + ' &divide; ' + A.gcd(N, D) + ' = ' + sn + ' and ' + D + ' &divide; ' + A.gcd(N, D) + ' = ' + sd + '.', 'So ' + N + '/' + D + ' = ' + sn + '/' + sd + '.'],
          explain: N + '/' + D + ' = ' + sn + '/' + sd + '.' };
      } },
      { id: 'fr-mixed', name: 'Mixed numbers and improper fractions', code: 'B1.3', gen: function (lv) {
        var d = lv === 1 ? R.pick([2, 3, 4]) : R.pick([3, 4, 5, 6, 8]), w = R.int(1, lv === 3 ? 5 : 2), r = R.int(1, d - 1), N = w * d + r;
        var toMixed = lv === 1 ? true : R.int(0, 1) === 1;
        if (toMixed) {
          var o = R.mc(w + ' ' + r + '/' + d, [(w + 1) + ' ' + r + '/' + d, r + ' ' + w + '/' + d, w + ' ' + (d - r) + '/' + d, (w - 1 > 0 ? w - 1 : w + 2) + ' ' + r + '/' + d]);
          return { q: 'Write <span class="math">' + N + '/' + d + '</span> as a mixed number.', type: 'mc', options: o.options, answer: o.answer,
            fig: lv < 3 ? A.draw.fbars([{ n: N, d: d, label: N + '/' + d }], { unit: Math.min(200, 480 / (w + 1)), w: 560 }) : '',
            hint: 'How many groups of ' + d + ' fit in ' + N + '? What is left over?',
            steps: [N + ' &divide; ' + d + ' = ' + w + ' remainder ' + r + '.', 'The ' + w + ' is the number of wholes. The remainder ' + r + ' is the number of pieces left.', 'So ' + N + '/' + d + ' = ' + w + ' ' + r + '/' + d + '.'],
            explain: N + '/' + d + ' = ' + w + '&nbsp;' + r + '/' + d + '.' };
        }
        var o2 = R.mc(N + '/' + d, [(w + r) + '/' + d, (w * r + d) + '/' + d, (w * d) + '/' + d, (N + 1) + '/' + d]);
        return { q: 'Write <span class="math">' + w + '&nbsp;' + r + '/' + d + '</span> as an improper fraction.', type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'Each whole has ' + d + ' pieces. How many pieces are in ' + w + ' wholes?',
          fig: lv < 3 ? A.draw.fline(w + 1, d, [{ v: N / d, label: w + ' ' + r + '/' + d }]) : '',
          steps: [w + ' wholes = ' + w + ' &times; ' + d + ' = ' + w * d + ' pieces.', 'Add the ' + r + ' extra pieces: ' + w * d + ' + ' + r + ' = ' + N + '.', 'So ' + w + ' ' + r + '/' + d + ' = ' + N + '/' + d + '.'],
          explain: w + ' &times; ' + d + ' + ' + r + ' = ' + N + ', so ' + N + '/' + d + '.' };
      } },
      { id: 'fr-compare', name: 'Compare fractions', code: 'B1.4', gen: function (lv) {
        var a, b, c, d, why;
        if (lv === 1) { d = R.pick([5, 6, 8, 10, 12]); b = d; a = R.int(1, d - 1); c = R.int(1, d - 1); while (c === a) c = R.int(1, d - 1); why = 'The pieces are the same size, so more pieces is more.'; }
        else if (lv === 2) { a = c = R.int(1, 3); b = R.pick([4, 5, 6]); d = R.pick([8, 10, 12]); why = 'The tops are the same. Smaller pieces (bigger bottom) means less.'; }
        else { b = R.pick([2, 3, 4, 6]); d = b * 2; a = R.int(1, b - 1); c = R.int(1, d - 1); while (c === 2 * a) c = R.int(1, d - 1); why = 'Rewrite ' + a + '/' + b + ' as ' + (2 * a) + '/' + d + ' so both use the same size pieces.'; }
        var big = a / b > c / d ? a + '/' + b : c + '/' + d;
        var o = R.mc(big, [a / b > c / d ? c + '/' + d : a + '/' + b, 'They are equal']);
        return { q: 'Which is greater: <span class="math">' + a + '/' + b + '</span> or <span class="math">' + c + '/' + d + '</span>?', type: 'mc', options: o.options, answer: o.answer,
          fig: A.draw.fbars([{ n: a, d: b }, { n: c, d: d, col: 'var(--hi)' }], { w: 440 }) + (lv === 3 ? A.draw.fline(1, d, [{ v: a / b, label: a + '/' + b, col: 'var(--strand)' }, { v: c / d, label: c + '/' + d, up: false }], null, 440) : ''), hint: lv === 1 ? 'Compare the tops.' : lv === 2 ? 'Which has bigger pieces?' : 'Rewrite one fraction so the bottoms match.',
          steps: [why, 'Compare the shaded lengths in the bars.', big + ' is greater.'], explain: why + ' ' + big + ' is greater.' };
      } },
      { id: 'fr-add', name: 'Add and subtract like fractions', code: 'B2.5', gen: function (lv) {
        var d = R.pick([4, 5, 6, 8, 10, 12]), a, b, op = lv === 1 ? '+' : R.pick(['+', '-']);
        if (lv === 1) { a = R.int(1, d - 2); b = R.int(1, d - 1 - a); }
        else if (lv === 2) { a = R.int(2, d - 1); b = R.int(1, a - 1); if (op === '+') b = R.int(1, d - a); }
        else { a = R.int(d - 2, d + 4); b = R.int(2, d - 1); if (op === '-' && b >= a) a = b + R.int(1, 3); }
        var r = op === '+' ? a + b : a - b;
        var o = R.mc(r + '/' + d, [r + '/' + (2 * d), (op === '+' ? Math.abs(a - b) : a + b) + '/' + d, (r + 1) + '/' + d]);
        var ctx = lv === 3 && op === '+' ? 'Jo ran ' + a + '/' + d + ' km before lunch and ' + b + '/' + d + ' km after. How far did Jo run in all?' : 'What is <span class="math">' + a + '/' + d + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + '/' + d + '</span>?';
        var cols = [], i;
        for (i = 0; i < (op === '+' ? a + b : a); i++) cols.push(op === '+' ? (i < a ? 'var(--strand)' : 'var(--hi)') : (i < a - b ? 'var(--strand)' : 'color-mix(in srgb,var(--bad) 30%,var(--card))'));
        return { q: ctx, type: 'mc', options: o.options, answer: o.answer,
          fig: lv < 3 ? A.draw.fbars([{ n: cols.length, d: d, label: op === '+' ? a + '/' + d + '+' + b + '/' + d : a + '/' + d, cols: cols }], { lw: 90, unit: cols.length > d ? 220 : 400, w: 560 }) + (op === '-' ? '<p class="t2" style="text-align:center;font-size:.9rem">The pale pieces are the ' + b + ' taken away.</p>' : '') : '',
          hint: 'The pieces are all 1/' + d + '. Count pieces and keep the bottom the same.',
          steps: ['Every piece is 1/' + d + '.', a + ' pieces ' + (op === '+' ? 'plus ' : 'take away ') + b + ' pieces = ' + r + ' pieces.', 'The answer is ' + r + '/' + d + (r > d ? ', which is ' + mixed(r, d) : '') + '.'],
          explain: a + '/' + d + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + '/' + d + ' = ' + r + '/' + d + (r > d ? ' = ' + mixed(r, d) : '') + '. The denominator stays ' + d + '.' };
      } },
      { id: 'fr-unit', name: 'Multiply and divide by unit fractions', code: 'B2.8', gen: function (lv) {
        var w = R.int(2, 9), d = R.pick([2, 3, 4, 5, 6, 8]), mul = lv === 1 ? true : lv === 2 ? false : R.int(0, 1) === 1;
        if (mul) {
          var o = R.mc(w + '/' + d, ['1/' + (w * d), String(w * d), d + '/' + w]);
          return { q: lv === 3 ? 'Each muffin uses 1/' + d + ' cup of oats. How much oats do ' + w + ' muffins use?' : 'What is <span class="math">' + w + ' &times; 1/' + d + '</span>?', type: 'mc', options: o.options, answer: o.answer,
            fig: A.draw.wholes(w, d), hint: 'Think of ' + w + ' groups of one 1/' + d + ' piece.',
            steps: ['Each group is one piece of size 1/' + d + '.', w + ' groups make ' + w + ' pieces.', 'So the answer is ' + w + '/' + d + (lv === 3 ? ' cup' : '') + '.'],
            explain: w + ' &times; 1/' + d + ' = ' + w + '/' + d + '.' };
        }
        return { q: lv === 3 ? 'A pizza place cuts each pizza into pieces that are 1/' + d + ' of a pizza. How many pieces come from ' + w + ' pizzas?' : 'What is <span class="math">' + w + ' &divide; 1/' + d + '</span>?', type: 'num', answer: w * d,
          fig: A.draw.bar(d, d, 300, 'One whole cut into ' + d + ' pieces'), hint: 'How many 1/' + d + ' pieces fit in one whole? Then in ' + w + ' wholes?',
          steps: ['One whole holds ' + d + ' pieces of size 1/' + d + '.', w + ' wholes hold ' + w + ' &times; ' + d + ' pieces.', w + ' &times; ' + d + ' = ' + w * d + '.'],
          explain: w + ' &divide; 1/' + d + ' = ' + w * d + '.' };
      } }
    ]
  });

  /* ---------- more ways to ask each practice skill (docs/QUESTIONS.md); answer checks in tests/verify/grade5.js ---------- */
  var K = A.kit, nm = function () { return A.Q.name(); };
  function f(n, d) { return n + '/' + d; }
  function mf(x) { return '<span class="math">' + x + '</span>'; }
  /* k fractions [n, d] from make(), no two of equal value */
  function fracSet(k, make) {
    var out = [], seen = {}, t = 0;
    while (out.length < k && t++ < 80) { var x = make(); if (!seen[x[0] / x[1]]) { seen[x[0] / x[1]] = 1; out.push(x); } }
    return out;
  }
  function list(set) { return set.map(function (x) { return f(x[0], x[1]); }).join(', '); }
  var SHAPES = {
    'fr-name': [
      [1, 'tap', function (lv) {
        var d = R.pick([3, 4, 5, 6, 8]), n = R.int(1, d - 1);
        var others = fracSet(4, function () { return R.pick([[d - n, d], [n, d + 2], [n < d - 1 ? n + 1 : n - 1, d], [n, d + 1]]); }).filter(function (x) { return x[0] > 0 && x[0] * d !== n * x[1]; });
        var set = R.shuffle([[n, d]].concat(others.slice(0, 2)));
        return { q: 'Tap the bar that shows <b>' + f(n, d) + '</b>.', type: 'tap', tiles: set.map(function (x) { return A.draw.bar(x[0], x[1], 240); }), answer: set.map(String).indexOf(String([n, d])), answerText: 'the bar with ' + n + ' of ' + d + ' parts shaded',
          hint: 'Look for a bar cut into ' + d + ' equal parts.', steps: ['The bottom number, ' + d + ', is the number of equal parts.', 'The top number, ' + n + ', is how many are shaded.'],
          explain: f(n, d) + ' means ' + n + ' of ' + d + ' equal parts are shaded.', meta: { k: 'g5fr-tap' } };
      }],
      [1, 'line', function (lv) {
        var d = R.pick(lv === 1 ? [2, 3, 4, 5] : [3, 4, 5, 6, 8, 10]), n = R.int(1, d - 1);
        return { q: 'Put <b>' + f(n, d) + '</b> on the number line.', type: 'line', min: 0, max: 1, tick: 1 / d, every: 1, snap: 1 / d, answer: n / d, tol: 1e-4, place: f(n, d), hideValue: true,
          hint: 'The line from 0 to 1 is cut into ' + d + ' equal jumps.', steps: ['Each jump is 1/' + d + '.', 'Count ' + n + ' jumps from 0.'],
          explain: f(n, d) + ' is ' + n + ' jumps of 1/' + d + ' from 0.', meta: { k: 'g5fr-line' } };
      }],
      [1, 'match', function (lv) {
        var set = fracSet(3, function () { var d = R.pick([2, 3, 4, 5, 6, 8]); return [R.int(1, d - 1), d]; });
        return { q: 'Match each bar to its fraction.', type: 'match', pairs: set.map(function (x) { return [A.draw.bar(x[0], x[1], 150), f(x[0], x[1])]; }),
          hint: 'Count all the parts for the bottom. Count the shaded parts for the top.', steps: ['Bottom: how many equal parts in all.', 'Top: how many are shaded.'],
          explain: 'Each fraction is shaded parts over all parts: ' + list(set) + '.', meta: { k: 'g5fr-match' } };
      }],
      [2, 'mistake', function (lv) {
        var d = R.pick([5, 6, 8, 10]), n = R.int(1, d - 1), who = nm();
        if (n * 2 === d) n++;
        var truth = !R.int(0, 2), said = truth ? f(n, d) : R.pick([f(n, d - n), f(d - n, d)]);
        var right = 'There are ' + d + ' equal parts and ' + n + ' are shaded, so the fraction is ' + f(n, d) + '.';
        return K.tf(who, 'the shaded part is <b>' + said + '</b>.', truth, right,
          ['The bottom number is how many parts are not shaded.', 'Count the white parts for the top.', 'The fraction is always 1 over the number of parts.'],
          { fig: A.draw.bar(n, d, 360), hint: 'Count all the parts, then the shaded parts.', meta: { k: 'g5fr-tf', said: said } });
      }]
    ],
    'fr-equiv': [
      [1, 'pick', function (lv) {
        var d = R.pick([2, 3, 4, 5]), n = R.int(1, d - 1), opts = [];
        [2, 3, 4].forEach(function (k) { opts.push(f(n * k, d * k)); });
        opts = R.shuffle(opts).slice(0, R.int(1, 3));
        [f(n + 1, d + 1), f(n * 2, d + 2), f(n + 2, d * 2), f(n * 3, d * 2)].forEach(function (x) { var t = x.split('/'); if (opts.length < 5 && +t[0] * d !== n * +t[1] && opts.indexOf(x) < 0) opts.push(x); });
        opts = R.shuffle(opts);
        return K.pick('Pick every fraction equal to <b>' + f(n, d) + '</b>.', opts, function (x) { var t = x.split('/'); return +t[0] * d === n * +t[1]; }, String, {
          hint: 'An equal fraction multiplies the top and the bottom by the same number.', steps: ['For each one, ask: is the bottom ' + d + ' times something?', 'Is the top ' + n + ' times the same number?'],
          explain: 'Fractions equal to ' + f(n, d) + ' come from multiplying ' + n + ' and ' + d + ' by the same number.', meta: { k: 'g5fr-equivpick' } });
      }],
      [1, 'match', function (lv) {
        var set = fracSet(3, function () { var d = R.pick([2, 3, 4, 5]); return [R.int(1, d - 1), d]; }), k = lv === 1 ? 2 : R.int(2, 4);
        return { q: 'Match each fraction to an equal fraction.', type: 'match', pairs: set.map(function (x) { return [f(x[0], x[1]), f(x[0] * k, x[1] * k)]; }),
          hint: 'Multiply the top and bottom by the same number.', steps: ['Each pair uses the same multiplier: ' + k + '.'],
          explain: set.map(function (x) { return f(x[0], x[1]) + ' = ' + f(x[0] * k, x[1] * k); }).join('. ') + '.', meta: { k: 'g5fr-equivmatch' } };
      }],
      [1, 'fill', function (lv) {
        var d = R.pick([2, 3, 4, 5]), n = R.int(1, d - 1), k2 = lv === 1 ? 3 : R.int(3, 5);
        return { q: 'Fill in the blanks to make equal fractions.', type: 'fill', fill: (f(n, d) + ' = [[]]/' + d * 2 + ' = ' + n * k2 + '/[[]]'), answers: [n * 2, d * k2],
          fig: A.draw.bar(n, d, 300) + A.draw.bar(n * 2, d * 2, 300),
          hint: 'What was ' + d + ' multiplied by? Do the same to the top.', steps: [d + ' &times; 2 = ' + d * 2 + ', so the top is ' + n + ' &times; 2 = ' + n * 2 + '.', n + ' &times; ' + k2 + ' = ' + n * k2 + ', so the bottom is ' + d + ' &times; ' + k2 + ' = ' + d * k2 + '.'],
          explain: f(n, d) + ' = ' + f(n * 2, d * 2) + ' = ' + f(n * k2, d * k2) + '.', meta: { k: 'g5fr-equivfill' } };
      }],
      [2, 'mistake', function (lv) {
        var d = R.pick([3, 4, 5]), n = R.int(1, d - 1), k = R.int(2, 3), who = nm(), truth = !R.int(0, 2);
        var said = truth ? f(n * k, d * k) : f(n + k, d + k);
        var right = 'Equal fractions multiply the top and bottom by the same number: ' + f(n, d) + ' = ' + f(n * k, d * k) + '.';
        return K.tf(who, mf(f(n, d) + ' = <b>' + said + '</b>') + '.', truth, right,
          ['Adding the same number to the top and bottom keeps a fraction equal.', 'Bigger numbers always make a bigger fraction.', 'Only the bottom number changes.'],
          { hint: 'Draw both as bars. Are they the same length?', meta: { k: 'g5fr-equivtf' } });
      }]
    ],
    'fr-mixed': [
      [1, 'line', function (lv) {
        var d = R.pick(lv === 1 ? [2, 3, 4] : [3, 4, 5, 6]), w = R.int(1, 2), r = R.int(1, d - 1), imp = lv > 1 && !R.int(0, 1);
        var label = imp ? f(w * d + r, d) : w + '&nbsp;' + f(r, d);
        return { q: 'Put <b>' + label + '</b> on the number line.', type: 'line', min: 0, max: 3, tick: 1 / d, every: 1, snap: 1 / d, answer: w + r / d, tol: 1e-4, place: label, hideValue: true,
          hint: imp ? d + ' pieces make 1 whole. How many wholes are in ' + f(w * d + r, d) + '?' : 'Go to ' + w + ', then count ' + r + ' more jumps of 1/' + d + '.',
          steps: [imp ? f(w * d + r, d) + ' = ' + w + ' ' + f(r, d) + '.' : w + ' ' + f(r, d) + ' is ' + w + ' wholes and ' + r + ' more pieces.', 'Find ' + w + ' on the line. Then count ' + r + ' jumps of 1/' + d + ' past it.'],
          explain: w + ' ' + f(r, d) + ' is ' + r + ' jumps past ' + w + '.', meta: { k: 'g5fr-mixline', label: label } };
      }],
      [1, 'match', function (lv) {
        var set = [], seen = {};
        while (set.length < 3) { var d = R.pick(lv === 1 ? [2, 3, 4] : [3, 4, 5, 6, 8]), w = R.int(1, 3), r = R.int(1, d - 1), N = w * d + r; if (!seen[N / d]) { seen[N / d] = 1; set.push([N, d, w, r]); } }
        return { q: 'Match each improper fraction to its mixed number.', type: 'match', pairs: set.map(function (x) { return [f(x[0], x[1]), x[2] + ' ' + f(x[3], x[1])]; }),
          hint: 'How many groups of the bottom number fit in the top?', steps: ['Divide the top by the bottom.', 'The answer is the wholes. The remainder is the pieces left.'],
          explain: set.map(function (x) { return f(x[0], x[1]) + ' = ' + x[2] + ' ' + f(x[3], x[1]); }).join('. ') + '.', meta: { k: 'g5fr-mixmatch' } };
      }],
      [1, 'fill', function (lv) {
        var d = R.pick(lv === 1 ? [2, 3, 4] : [3, 4, 5, 6, 8]), w = R.int(1, lv === 3 ? 6 : 3), r = R.int(1, d - 1), N = w * d + r;
        return { q: 'Write <span class="math">' + f(N, d) + '</span> as a mixed number.', type: 'fill', fill: (f(N, d) + ' = [[]] and [[]]/' + d), answers: [w, r],
          fig: lv === 1 ? A.draw.wholes(N, d) : '', hint: 'How many groups of ' + d + ' fit in ' + N + '?', steps: [N + ' &divide; ' + d + ' = ' + w + ' remainder ' + r + '.', 'So ' + f(N, d) + ' = ' + w + ' ' + f(r, d) + '.'],
          explain: f(N, d) + ' = ' + w + ' ' + f(r, d) + '.', meta: { k: 'g5fr-mixfill', N: N, d: d } };
      }],
      [2, 'mistake', function (lv) {
        var d = R.pick([3, 4, 5, 6]), w = R.int(2, 4), r = R.int(1, d - 1), who = nm(), truth = !R.int(0, 2);
        var said = truth ? w * d + r : w + r;
        var right = w + ' wholes are ' + w + ' &times; ' + d + ' = ' + w * d + ' pieces. Add ' + r + ' more to get ' + (w * d + r) + ', so it is ' + f(w * d + r, d) + '.';
        return K.tf(who, mf(w + '&nbsp;' + f(r, d) + ' = <b>' + f(said, d) + '</b>') + '.', truth, right,
          ['Add the whole number to the top.', 'Multiply the whole number by the top.', 'The whole number goes on the bottom.'],
          { hint: 'How many 1/' + d + ' pieces are in one whole?', meta: { k: 'g5fr-mixtf', w: w, r: r, d: d, said: said } });
      }]
    ],
    'fr-compare': [
      [1, 'order', function (lv) {
        var set, d, n;
        if (lv === 1) { d = R.pick([6, 8, 10, 12]); set = R.shuffle([1, 2, 3, 4, 5]).slice(0, 3).sort(function (a, b) { return a - b; }).map(function (x) { return [x, d]; }); }
        else if (lv === 2) { n = R.int(1, 2); set = R.shuffle([3, 4, 5, 6, 8, 10]).slice(0, 3).sort(function (a, b) { return b - a; }).map(function (x) { return [n, x]; }); }
        else set = fracSet(4, function () { var dd = R.pick([2, 3, 4, 5, 6, 8]); return [R.int(1, dd - 1), dd]; }).sort(function (a, b) { return a[0] / a[1] - b[0] / b[1]; });
        return { q: 'Put these fractions in order from <b>least to greatest</b>.', type: 'order', items: set.map(function (x) { return f(x[0], x[1]); }), first: 'least', last: 'greatest',
          hint: lv === 1 ? 'Same size pieces: compare the tops.' : lv === 2 ? 'Same tops: a bigger bottom means smaller pieces.' : 'Is each one more or less than 1/2?',
          steps: [lv === 1 ? 'The pieces are all 1/' + d + '. Fewer pieces is less.' : lv === 2 ? 'More equal parts means each part is smaller.' : 'Compare each fraction with 1/2 first, then compare the close ones.', 'In order: ' + list(set) + '.'],
          explain: 'From least to greatest: ' + list(set) + '.', meta: { k: 'g5fr-order' } };
      }],
      [1, 'story', function (lv) {
        var who = A.Q.two(), c = R.pick(['pizza', 'pan of lasagna', 'loaf of bannock']), a, b, x, y;
        if (lv === 1) { b = y = R.pick([6, 8, 10]); a = R.int(1, b - 2); x = R.int(a + 1, b - 1); if (R.int(0, 1)) { var t = a; a = x; x = t; } }
        else { a = x = R.int(1, 3); b = R.pick([4, 5, 6]); y = R.pick([8, 10, 12]); if (R.int(0, 1)) { var t2 = b; b = y; y = t2; } }
        return { q: who[0] + ' ate ' + f(a, b) + ' of a ' + c + '. ' + who[1] + ' ate ' + f(x, y) + ' of the same size ' + c + '. Who ate more?', type: 'mc', options: who, answer: a / b > x / y ? 0 : 1,
          fig: A.draw.fbars([{ n: a, d: b, label: who[0] }, { n: x, d: y, label: who[1], col: 'var(--hi)' }], { w: 440, lw: 80 }),
          hint: b === y ? 'Same size pieces. Who has more pieces?' : 'Same number of pieces. Whose pieces are bigger?', steps: [b === y ? 'Both are cut into ' + b + ' pieces, so compare the tops.' : 'Both ate ' + a + ' pieces. Fewer cuts make bigger pieces.', 'Look at the bars to check.'],
          explain: (a / b > x / y ? who[0] : who[1]) + ' ate more.', meta: { k: 'g5fr-story', a: a, b: b, x: x, y: y } };
      }],
      [1, 'mistake', function (lv) {
        var p = R.pick([2, 3, 4, 5]), q2 = p * 2, who = nm(), truth = !R.int(0, 2);
        var claim = truth ? mf('1/' + p + ' &gt; 1/' + q2) + ' because cutting into more parts makes smaller pieces.' : mf('1/' + q2 + ' &gt; 1/' + p) + ' because ' + q2 + ' is bigger than ' + p + '.';
        var right = 'Cutting into ' + q2 + ' parts makes smaller pieces than cutting into ' + p + ', so 1/' + p + ' is greater than 1/' + q2 + '.';
        return K.tf(who, claim, truth, right, ['A bigger bottom number always means a bigger fraction.', 'All unit fractions are equal.', 'You cannot compare fractions with different bottoms.'],
          { fig: A.draw.fbars([{ n: 1, d: p }, { n: 1, d: q2, col: 'var(--hi)' }], { w: 400 }), hint: 'Look at the bars. Which piece is longer?', meta: { k: 'g5fr-cmptf', p: p, q: q2, big: truth ? p : q2 } });
      }],
      [2, 'pick', function (lv) {
        var set = fracSet(5, function () { var d = R.pick([3, 4, 5, 6, 8, 10]); return [R.int(1, d - 1), d]; }).filter(function (x) { return x[0] * 2 !== x[1]; });
        var fits = function (x) { return x[0] * 2 > x[1]; };
        if (!set.some(fits)) set.push([7, 9]);
        if (set.every(fits)) set.push([2, 9]);
        return K.pick('Pick every fraction <b>greater than 1/2</b>.', set, fits, function (x) { return f(x[0], x[1]); }, {
          hint: 'Find half of the bottom number. Is the top more than that?', steps: ['For each fraction, find half of the bottom.', 'If the top is more than half the bottom, the fraction is greater than 1/2.'],
          explain: 'Greater than 1/2: ' + list(set.filter(fits)) + '.', meta: { k: 'g5fr-half' } });
      }]
    ],
    'fr-add': [
      [1, 'fill', function (lv) {
        var d = R.pick([4, 5, 6, 8, 10]), a = R.int(1, d - 2), b = R.int(1, d - 1 - a), sub = lv > 1 && !R.int(0, 1);
        if (sub) a += b;
        var r = sub ? a - b : a + b, op = sub ? ' &minus; ' : ' + ';
        return { q: 'Fill in the blank.', type: 'fill', fill: (f(a, d) + op + f(b, d) + ' = [[]]/' + d), answers: [r],
          fig: lv === 1 ? A.draw.bar(a, d, 300) + A.draw.bar(b, d, 300) : '', hint: 'The pieces are the same size. ' + (sub ? 'Take away' : 'Add') + ' the tops only.',
          steps: [a + op + b + ' = ' + r + ' pieces of size 1/' + d + '.', 'The bottom stays ' + d + '.'],
          explain: f(a, d) + op + f(b, d) + ' = ' + f(r, d) + '.', meta: { k: 'g5fr-addfill', a: a, b: b, d: d, sub: sub } };
      }],
      [1, 'story', function (lv) {
        var who = nm(), d = R.pick([4, 5, 8, 10]), a = R.int(1, d - 2), b = R.int(1, d - 1 - a), c = R.pick([['walked', 'km to school', 'km to the park', 'km'], ['poured', 'L of juice into one jug', 'L into another', 'L'], ['read', 'of a book on Monday', 'of it on Tuesday', 'of the book']]);
        return { q: who + ' ' + c[0] + ' ' + f(a, d) + ' ' + c[1] + ' and ' + f(b, d) + ' ' + c[2] + '. How much is that in all?', type: 'fill', fill: '[[]]/' + d + ' ' + c[3], answers: [a + b],
          hint: 'Add the two fractions. The bottom stays ' + d + '.', steps: [f(a, d) + ' + ' + f(b, d) + ': add the tops, ' + a + ' + ' + b + ' = ' + (a + b) + '.', 'The answer is ' + f(a + b, d) + '.'],
          explain: f(a, d) + ' + ' + f(b, d) + ' = ' + f(a + b, d) + '.', meta: { k: 'g5fr-addstory', a: a, b: b, d: d } };
      }],
      [1, 'mistake', function (lv) {
        var d = R.pick([4, 5, 6, 8]), a = R.int(1, d - 2), b = R.int(1, d - 1 - a), who = nm(), truth = !R.int(0, 2);
        var said = truth ? f(a + b, d) : f(a + b, d * 2);
        var right = 'The pieces stay the same size, 1/' + d + '. Add only the tops: ' + f(a, d) + ' + ' + f(b, d) + ' = ' + f(a + b, d) + '.';
        return K.tf(who, mf(f(a, d) + ' + ' + f(b, d) + ' = <b>' + said + '</b>') + '.', truth, right,
          ['Add the tops and add the bottoms.', 'Multiply the bottoms together.', 'Fractions cannot be added.'],
          { hint: 'When you put two slices of pizza together, does each slice get smaller?', meta: { k: 'g5fr-addtf', a: a, b: b, d: d, said: said } });
      }],
      [2, 'which', function (lv) {
        var who = nm(), d = R.pick([5, 6, 8, 10]), a = R.int(3, d - 1), b = R.int(1, a - 1), sub = !R.int(0, 1);
        var q = sub ? who + ' had ' + f(a, d) + ' of a cake. The family ate ' + f(b, d) + ' of the cake. How much is left?' : who + ' painted ' + f(b, d) + ' of a fence in the morning and ' + f(a - b, d) + ' after lunch. How much is painted?';
        var right = sub ? f(a, d) + ' &minus; ' + f(b, d) : f(b, d) + ' + ' + f(a - b, d), wrong = sub ? [f(a, d) + ' + ' + f(b, d), f(b, d) + ' &minus; ' + f(a, d)] : [f(a - b, d) + ' &minus; ' + f(b, d), f(b, d) + ' &times; ' + f(a - b, d)];
        return K.mc('Which number sentence solves this? ' + q, right, wrong, {
          hint: sub ? 'Some is taken away. Which operation is that?' : 'Two parts are put together. Which operation is that?', steps: [sub ? '"Left" after eating means take away.' : '"Painted in all" means put the parts together.', 'So the sentence is ' + right + '.'],
          explain: right + ' = ' + f(sub ? a - b : a, d) + '.', meta: { k: 'g5fr-which', sub: sub } });
      }]
    ],
    'fr-unit': [
      [1, 'fill', function (lv) {
        var w = R.int(2, 9), d = R.pick([2, 3, 4, 5, 6, 8]);
        return { q: 'Fill in the blank.', type: 'fill', fill: (w + ' &times; 1/' + d + ' = [[]]/' + d), answers: [w], fig: A.draw.wholes(w, d),
          hint: w + ' groups of one 1/' + d + ' piece.', steps: ['Each group is one 1/' + d + ' piece.', w + ' groups make ' + w + ' pieces: ' + f(w, d) + '.'],
          explain: w + ' &times; 1/' + d + ' = ' + f(w, d) + '.', meta: { k: 'g5fr-unitfill', w: w, d: d } };
      }],
      [1, 'tap', function (lv) {
        var w = R.int(2, 5), d = R.pick([3, 4, 5, 6]), set = R.shuffle([[w, d], [w + 1, d], [w, d + 2]]);
        return { q: 'Which picture shows <b>' + w + ' &times; 1/' + d + '</b>? Tap it.', type: 'tap', tiles: set.map(function (x) { return A.draw.wholes(x[0], x[1]); }), answer: set.map(String).indexOf(String([w, d])), answerText: w + ' pieces of size 1/' + d,
          hint: 'Look for ' + w + ' shaded pieces, each 1/' + d + ' of a bar.', steps: [w + ' &times; 1/' + d + ' means ' + w + ' pieces of size 1/' + d + '.', 'Count the shaded pieces. Check the bar is cut into ' + d + ' parts.'],
          explain: w + ' &times; 1/' + d + ' = ' + f(w, d) + '.', meta: { k: 'g5fr-unittap', w: w, d: d } };
      }],
      [1, 'story', function (lv) {
        var w = R.int(2, lv === 1 ? 4 : 8), d = R.pick([2, 3, 4]), c = R.pick([['A scoop holds 1/' + d + ' cup of flour.', 'scoops fill', 'cups'], ['A ribbon is cut into pieces 1/' + d + ' m long.', 'pieces come from', 'm of ribbon'], ['Each glass holds 1/' + d + ' L.', 'glasses can you fill from', 'L of milk']]);
        return { q: c[0] + ' How many ' + c[1] + ' ' + w + ' ' + c[2] + '?', type: 'num', answer: w * d,
          fig: A.draw.wholes(w * d, d), hint: 'How many 1/' + d + ' parts are in 1 whole? Then in ' + w + '?', steps: ['1 whole holds ' + d + ' parts of 1/' + d + '.', w + ' wholes hold ' + w + ' &times; ' + d + ' = ' + w * d + '.'],
          explain: w + ' &divide; 1/' + d + ' = ' + w * d + '.', meta: { k: 'g5fr-unitstory', w: w, d: d } };
      }],
      [2, 'which', function (lv) {
        var w = R.int(2, 6), d = R.pick([3, 4, 5]), mul = !R.int(0, 1);
        var q = mul ? 'Each of ' + w + ' friends drinks 1/' + d + ' L of milk. How much milk do they drink in all?' : 'How many 1/' + d + ' L cups can you fill from ' + w + ' L of milk?';
        var right = mul ? w + ' &times; 1/' + d : w + ' &divide; 1/' + d;
        return K.mc('Which way solves this? ' + q, right, [mul ? w + ' &divide; 1/' + d : w + ' &times; 1/' + d, w + ' + 1/' + d], {
          hint: mul ? 'The same amount, many times over: which operation?' : 'How many fit inside: which operation?', steps: [mul ? w + ' groups of 1/' + d + ' is multiplying.' : '"How many 1/' + d + ' fit in ' + w + '" is dividing.', 'So use ' + right + '.'],
          explain: right + ' = ' + (mul ? f(w, d) + ' L' : w * d + ' cups') + '.', meta: { k: 'g5fr-unitwhich', mul: mul, w: w, d: d } });
      }]
    ]
  };
  Atlas.Q.shapes('fractions', SHAPES);
})();
