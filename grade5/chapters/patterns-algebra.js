(function () {
  var A = Atlas, R = A.R;
  /* small point graph of a pattern: values v for terms 1..n */
  function graph(v, label) {
    var mx = Math.max.apply(null, v), top = Math.max(5, Math.ceil(mx / 5) * 5), W = 300, H = 170, s = '';
    for (var i = 0; i <= 5; i++) {
      var y = 140 - i * 24;
      s += '<line x1="40" y1="' + y + '" x2="' + (W - 10) + '" y2="' + y + '" style="stroke:var(--line)"/><text x="34" y="' + (y + 4) + '" text-anchor="end" font-size="11" class="t2">' + A.clean(top * i / 5) + '</text>';
    }
    v.forEach(function (n, k) {
      var x = 60 + k * ((W - 80) / Math.max(1, v.length - 1)), y = 140 - (n / top) * 120;
      s += '<circle cx="' + x + '" cy="' + y + '" r="5" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/><text x="' + x + '" y="158" text-anchor="middle" font-size="11">' + (k + 1) + '</text>';
    });
    s += '<line x1="40" y1="140" x2="' + (W - 10) + '" y2="140" style="stroke:var(--ink)" stroke-width="2"/><text x="' + (W / 2 + 20) + '" y="170" text-anchor="middle" font-size="11" class="t2">term number</text>';
    return A.svg(W, H + 4, s, label || 'Graph of the pattern');
  }

  /* a row of values with curved "+k" jumps between them */
  function jumps(vals, labs, step) {
    var n = vals.length, cw = Math.min(110, 540 / n), s = '', x0 = (560 - cw * n) / 2;
    s += '<defs><marker id="paj" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>';
    vals.forEach(function (v, i) {
      var x = x0 + cw * (i + 0.5), q = v === '?';
      s += '<rect x="' + (x - cw / 2 + 6) + '" y="44" width="' + (cw - 12) + '" height="40" rx="8" style="fill:' + (q ? 'color-mix(in srgb,var(--hi) 35%,var(--card))' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"' + (q ? ' stroke-dasharray="5 4"' : '') + '/>' +
        '<text x="' + x + '" y="72" text-anchor="middle" font-size="20" font-weight="800">' + (labs ? labs[i] : v) + '</text>';
      if (i < n - 1) s += '<path d="M' + (x + 6) + ' 42 Q' + (x + cw / 2) + ' 8 ' + (x + cw - 8) + ' 40" fill="none" style="stroke:var(--accent)" stroke-width="2" marker-end="url(#paj)"/><text x="' + (x + cw / 2) + '" y="20" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--accent)">' + step + '</text>';
    });
    return A.svg(560, 92, s, 'Pattern ' + vals.join(', ') + ', changing by ' + step + ' each time');
  }
  /* figures 1..show of k*n + c tiles: purple groups, yellow extras */
  function tiles(k, c, show) {
    var s = '', x = 10;
    for (var n = 1; n <= show; n++) {
      s += '<text x="' + x + '" y="18" class="tb" font-size="15">Fig. ' + n + '</text>';
      var gx = x;
      for (var g = 0; g < n; g++) { for (var t = 0; t < k; t++) s += '<rect x="' + gx + '" y="' + (28 + t * 20) + '" width="18" height="18" rx="3" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/>'; gx += 22; }
      for (var e = 0; e < c; e++) s += '<rect x="' + gx + '" y="' + (28 + e * 20) + '" width="18" height="18" rx="3" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/>';
      x = Math.max(gx + (c ? 22 : 0), x + 50) + 18;
    }
    return A.svg(Math.max(300, x), 28 + Math.max(k, c) * 20 + 8, s, 'Figures 1 to ' + show + ': ' + k + ' tiles per group and ' + c + ' extra');
  }
  /* repeating core of colours, with the core boxed */
  function repeating(core, reps) {
    var cols = { r: '#d63a3a', b: 'var(--strand)', y: 'var(--hi)' }, s = '', n = core.length * reps;
    for (var i = 0; i < n; i++) {
      var c = core[i % core.length], x = 22 + i * 34;
      s += c === 'r' ? '<circle cx="' + x + '" cy="30" r="13" style="fill:' + cols.r + ';stroke:var(--ink)" stroke-width="1.5"/>' : '<rect x="' + (x - 13) + '" y="17" width="26" height="26" rx="4" style="fill:' + cols[c] + ';stroke:var(--ink)" stroke-width="1.5"/>';
    }
    s += '<rect x="4" y="8" width="' + (core.length * 34 + 2) + '" height="44" rx="8" fill="none" style="stroke:var(--accent)" stroke-width="2.5" stroke-dasharray="6 4"/><text x="' + (6 + core.length * 17) + '" y="70" text-anchor="middle" font-size="16" font-weight="700" style="fill:var(--accent)">core</text>';
    return A.svg(n * 34 + 16, 76, s, 'Repeating pattern. The core repeats ' + reps + ' times.');
  }
  /* bars for a shrinking or growing pattern */
  function bars(vals) {
    var mx = Math.max.apply(null, vals), s = '';
    vals.forEach(function (v, i) {
      var h = 110 * v / mx, x = 20 + i * 70;
      s += '<rect x="' + x + '" y="' + (144 - h) + '" width="48" height="' + h + '" rx="4" style="fill:var(--strand)"/><text x="' + (x + 24) + '" y="' + (138 - h) + '" text-anchor="middle" font-size="17" font-weight="700">' + v + '</text>';
    });
    return A.svg(vals.length * 70 + 20, 150, s, 'Bars for ' + vals.join(', '));
  }
  /* bags of n and extra counters for an expression */
  function bags(k, c, nLabel) {
    var s = '', px = 6;
    for (var i = 0; i < k; i++) { s += '<path d="M' + (px + 8) + ' 18 h40 l8 40 h-56z" style="fill:color-mix(in srgb,var(--strand) 22%,var(--card));stroke:var(--strand)" stroke-width="2.5" stroke-linejoin="round"/><text x="' + (px + 28) + '" y="48" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--strand)">' + (nLabel || 'n') + '</text>'; px += 66; }
    for (var j = 0; j < c; j++) s += '<circle cx="' + (px + 14 + (j % 5) * 22) + '" cy="' + (28 + Math.floor(j / 5) * 22) + '" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/>';
    return A.svg(Math.max(140, px + Math.min(c, 5) * 22 + 20), 66, s, k + ' bags of n and ' + c + ' extra counters');
  }
  /* balance scale with labels on each pan */
  function scale(lt, rt) {
    return A.svg(400, 130, '<polygon points="200,100 182,124 218,124" style="fill:var(--ink)"/><rect x="60" y="66" width="280" height="8" rx="4" style="fill:var(--ink)"/>' +
      '<line x1="200" y1="70" x2="200" y2="100" style="stroke:var(--ink)" stroke-width="3"/>' +
      '<rect x="20" y="22" width="140" height="40" rx="8" style="fill:var(--strand)"/><text x="90" y="49" text-anchor="middle" font-size="20" font-weight="800" style="fill:#fff">' + lt + '</text>' +
      '<rect x="240" y="22" width="140" height="40" rx="8" style="fill:var(--hi)"/><text x="310" y="49" text-anchor="middle" font-size="20" font-weight="800" style="fill:#13203a">' + rt + '</text>', 'Balance scale: ' + lt + ' balances ' + rt);
  }
  /* trace table for a loop: totals as growing bars */
  function trace(start, add, times, lim) {
    var t = start, vals = [];
    for (var i = 0; i < times; i++) { t += add; vals.push(t); }
    var mx = t, s = '<text x="4" y="20" font-size="15" class="t2">start ' + start + '</text>';
    vals.forEach(function (v, i) {
      var w = 380 * v / mx, y = 30 + i * 30, big = lim !== undefined && v > lim;
      s += '<text x="4" y="' + (y + 18) + '" font-size="15" class="t2">pass ' + (i + 1) + '</text><rect x="70" y="' + y + '" width="' + w + '" height="22" rx="4" style="fill:' + (big ? 'var(--hi)' : 'var(--strand)') + '"/><text x="' + (76 + w) + '" y="' + (y + 17) + '" font-size="16" font-weight="700">' + v + (big ? ' &#8594; "big"' : '') + '</text>';
    });
    if (lim !== undefined) { var lx = 70 + 380 * lim / mx; s += '<line x1="' + lx + '" y1="26" x2="' + lx + '" y2="' + (30 + times * 30) + '" style="stroke:var(--bad)" stroke-width="2" stroke-dasharray="5 4"/><text x="' + lx + '" y="' + (44 + times * 30) + '" text-anchor="middle" font-size="14" style="fill:var(--bad)">' + lim + '</text>'; }
    return A.svg(560, 50 + times * 30, s, 'Trace of the loop: totals ' + vals.join(', '));
  }

  /* whole numbers near the edge; the ones that solve the inequality are filled */
  function ineq(edge, lt) {
    var lo = Math.max(0, edge - 5), s = '<line x1="10" y1="30" x2="550" y2="30" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var v = lo; v <= lo + 10; v++) {
      var x = 30 + (v - lo) * 50, on = lt ? v < edge : v > edge;
      s += '<circle cx="' + x + '" cy="30" r="10" style="fill:' + (on ? 'var(--strand)' : 'var(--card)') + ';stroke:' + (v === edge ? 'var(--bad)' : 'var(--ink)') + '" stroke-width="2.5"/><text x="' + x + '" y="62" text-anchor="middle" font-size="17"' + (v === edge ? ' style="fill:var(--bad)" font-weight="700"' : '') + '>' + v + '</text>';
    }
    return A.svg(560, 72, s, 'Number line: filled dots are solutions. ' + edge + ' itself is not a solution.');
  }

  /* ---------- Lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = A.kit;
  function P(id, lv) { return K.P('patterns-algebra', id, lv); }
  function an(svg) { return '<div class="g5-anim">' + svg + '</div>'; }
  var LESSONS = [
    { id: 'kinds', title: 'Kinds of patterns', sub: 'Repeating, growing and shrinking.', concepts: [
      { id: 'kinds', title: 'Repeat, grow or shrink', exp: ['C1.1'], skill: 'al-next',
        body: '<p>A <b>repeating</b> pattern has a core that repeats. A <b>growing</b> pattern goes up by the same amount each time. A <b>shrinking</b> pattern goes down.</p>',
        watch: K.watch([
          { say: 'Repeating: the core circle, square, square repeats.', fig: an(repeating(['r', 'b', 'b'], 3)) },
          { say: 'Growing: 5, 9, 13, 17. Add 4 each time.', fig: an(jumps([5, 9, 13, 17], null, '+4')) },
          { say: 'Shrinking: 100, 92, 84, 76. Take away 8 each time.', fig: an(bars([100, 92, 84, 76])) },
          { say: 'To find the next term, find the change and keep it going.', fig: an(jumps([5, 9, 13, 17, '?'], null, '+4')), ms: 2200 }
        ]),
        try: { tool: 'numberline', opts: { min: 0, max: 40, tick: 1, every: 5, start: 5, step: 4 }, tasks: [
          { do: 'The pattern starts at 5 and grows by 4. Jump until you land on <b>21</b>.', goal: function (s) { return s.at === 21; }, yes: 'Yes. 5, 9, 13, 17, 21.' },
          { do: 'Keep jumping. What comes after 29?', reset: false, goal: function (s) { return s.at === 33; }, yes: 'Yes. 29 + 4 = 33.' }
        ] },
        key: '<p>Find <b>what changes</b> from one term to the next. Keep that change going.</p>',
        check: [P('al-next', 1), P('al-next', 2)] }
    ] },

    { id: 'rule', title: 'Pattern rules', sub: 'Tables of values and graphs.', concepts: [
      { id: 'tiles', title: 'A rule for any figure', exp: ['C1.2', 'C1.3'], skill: 'al-rule', hard: true,
        body: '<p>Each figure has <b>groups</b> that repeat plus <b>extra</b> tiles that never change. Figure <i>n</i> has groups &times; <i>n</i> + extra tiles.</p>',
        watch: K.watch([
          { say: 'Figure 1: one group of 3 purple tiles, and 1 yellow extra. 4 tiles.', fig: an(tiles(3, 1, 1)) },
          { say: 'Figure 2: two groups of 3, and the same 1 extra. 7 tiles.', fig: an(tiles(3, 1, 2)) },
          { say: 'Figure 3: three groups. 10 tiles. It grows by 3 each time.', fig: an(tiles(3, 1, 3)) },
          { say: 'Rule: <b>3 &times; n + 1</b>. Figure 50 has 3 &times; 50 + 1 = 151 tiles.', fig: an(graph([4, 7, 10, 13, 16], 'Graph of 3n + 1 for figures 1 to 5')), ms: 2600 }
        ]),
        try: K.widget('patterns-algebra', 0, 'Nice. Change the figure number to 30 and use the rule instead of counting.'),
        ways: [
          { label: 'Table', html: '<div class="tbl"><table><tr><th>Figure</th><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>Tiles</th><td>4</td><td>7</td><td>10</td><td>13</td></tr></table></div><p>The tiles go up by 3, so the rule starts with 3 &times; n. Figure 1 has 4, which is 3 + 1.</p>' },
          { label: 'Graph', html: '<div class="fig">' + graph([4, 7, 10, 13, 16]) + '</div><p>The points climb by the same step, so they make a straight line.</p>' },
          { label: 'In words', html: '<p>"Three tiles for every figure number, plus one more." Say it, then write it: 3n + 1.</p>' }
        ],
        key: '<p>The <b>step</b> is the number in front of n. The <b>extra</b> is what never changes.</p>',
        mistake: '<p>Counting figure by figure to reach figure 50, or using only "add 3" (which needs the previous figure). Have the child say the rule for any figure, then put 50 into it.</p>',
        check: [P('al-rule', 1), P('al-rule', 2)] }
    ] },

    { id: 'decimal', title: 'Decimal patterns', sub: 'Counting by tenths and hundredths.', concepts: [
      { id: 'tenths', title: 'Count past a whole', exp: ['C1.4'], skill: 'al-dec', hard: true,
        body: '<p>Counting by 0.1 is a growing pattern too. After 0.9 comes <b>1.0</b>, because ten tenths make one whole.</p>',
        watch: { tool: 'numberline', opts: { min: 0.5, max: 1.5, tick: 0.1, every: 0.5, start: 0.7 }, steps: [
          { say: 'Start at 0.7 and count by 0.1.', ms: 1200 },
          { say: '0.8', act: function (t) { return t.hop(0.8, '+0.1'); } },
          { say: '0.9', act: function (t) { return t.hop(0.9, '+0.1'); } },
          { say: '<b>1.0</b>. Ten tenths make one whole.', act: function (t) { return t.hop(1, '+0.1'); } },
          { say: '1.1, then 1.2.', act: function (t) { return t.hop(1.1, '+0.1').then(function () { return t.hop(1.2, '+0.1'); }); }, ms: 2000 }
        ] },
        try: K.widget('patterns-algebra', 1, 'Good. Try counting by 0.01 from 2.47. Watch what happens after 2.49.'),
        ways: [
          { label: 'With money', html: '<p>Count dimes: $0.70, $0.80, $0.90, $1.00. Ten dimes make a dollar.</p>' },
          { label: 'Hundredths', html: '<div class="fig">' + jumps([1, 2, 3, 4], ['2.47', '2.48', '2.49', '2.50'], '+0.01') + '</div><p>10 hundredths make 1 tenth, so 2.49 + 0.01 = 2.50.</p>' }
        ],
        key: '<p><b>10 tenths make 1 whole. 10 hundredths make 1 tenth.</b> The next place goes up by 1.</p>',
        mistake: '<p>Writing 0.10 after 0.9, or 0.010 after 0.09. Count with dimes and pennies, or on a number line, so the child sees the whole being made.</p>',
        check: [P('al-dec', 1), P('al-dec', 2)] }
    ] },

    { id: 'expr', title: 'Variables and expressions', sub: 'A letter stands for a number.', concepts: [
      { id: 'variables', title: 'Evaluate an expression', exp: ['C2.1', 'C2.2'], skill: 'al-eval',
        body: '<p>A <b>variable</b> like <i>n</i> stands for a number. <b>3n + 2</b> means 3 &times; n, plus 2. To evaluate it, put in a number for n.</p>',
        watch: K.watch([
          { say: 'Think of n as a bag holding an unknown number of counters.', fig: an(bags(1, 0)) },
          { say: '3n is 3 bags.', fig: an(bags(3, 0)) },
          { say: '3n + 2 is 3 bags and 2 extra counters.', fig: an(bags(3, 2)) },
          { say: 'If each bag holds 5: 3 &times; 5 + 2 = <b>17</b>.', fig: an(bags(3, 2, '5')), ms: 2200 }
        ]),
        try: K.widget('patterns-algebra', 2, 'Nice. Try n = 0. What is left?'),
        key: '<p><b>3n means 3 &times; n.</b> Replace n with the number, multiply, then add.</p>',
        mistake: '<p>Reading 3n as 3 + n (so 3n = 8 when n = 5). Use bags: 3n is three bags, not three counters and a bag.</p>',
        check: [P('al-eval', 1), P('al-eval', 2)] }
    ] },

    { id: 'equations', title: 'Equations and inequalities', sub: 'Keep the balance.', concepts: [
      { id: 'balance', title: 'Solve an equation', exp: ['C2.3'], skill: 'al-solve', hard: true,
        body: '<p>An <b>equation</b> is like a balanced scale. To solve it, do the <b>same thing to both sides</b>. Then check your answer.</p>',
        watch: K.watch([
          { say: 'n &minus; 12 = 30. The two sides balance.', fig: an(scale('n &#8722; 12', '30')) },
          { say: 'To get n alone, add 12 to both sides.', fig: an(scale('n', '30 + 12')) },
          { say: 'n = <b>42</b>.', fig: an(scale('n', '42')) },
          { say: 'Check: 42 &minus; 12 = 30. It balances.', fig: an(scale('42 &#8722; 12', '30')), ms: 2200 }
        ]),
        try: K.widget('patterns-algebra', 3, 'Good. Guess, check, and adjust until the scale balances.'),
        ways: [
          { label: 'Undo it', html: '<p>What was done to n? 12 was taken away. Undo it: add 12. 30 + 12 = 42.</p>' },
          { label: 'Fact family', html: '<p>4 &times; n = 36 is part of a fact family: 36 &divide; 4 = n, so n = 9.</p>' },
          { label: 'Guess and check', html: '<p>Try n = 40: 40 &minus; 12 = 28, too small. Try 42: 42 &minus; 12 = 30. Yes.</p>' }
        ],
        key: '<p><b>Same thing to both sides.</b> Then put the answer back in to check.</p>',
        mistake: '<p>Doing the operation shown instead of undoing it (n &minus; 12 = 30, so n = 18). Ask "what number take away 12 gives 30?" and check by substituting.</p>',
        check: [P('al-solve', 1), P('al-solve', 2)] },

      { id: 'inequality', title: 'Inequalities have many answers', exp: ['C2.4'], skill: 'al-ineq', hard: true,
        body: '<p>An <b>inequality</b> uses &lt; or &gt;. Solve it like an equation to find the edge, then test numbers on each side.</p>',
        watch: K.watch([
          { say: 'n + 3 &lt; 10. Find the edge: n + 3 = 10 when n = 7.', fig: an(ineq(7, true).replace(/var\(--strand\)/g, 'var(--card)')) },
          { say: 'Test 5: 5 + 3 = 8, less than 10. It works.', fig: an(ineq(7, true)) },
          { say: 'Test 7: 7 + 3 = 10, not less than 10. The edge never works.', fig: an(ineq(7, true)) },
          { say: 'The answers are <b>every number less than 7</b>.', fig: an(ineq(7, true)), ms: 2200 }
        ]),
        try: K.widget('patterns-algebra', 4, 'Nice. Switch the symbol and watch the answers flip to the other side.'),
        ways: [
          { label: 'In words', html: '<p>"A number plus 3 is less than 10." Which numbers fit? 0, 1, 2, 3, 4, 5, 6. Not 7: 7 + 3 is exactly 10.</p>' },
          { label: 'Money', html: '<p>You have $10 and a toy costs $3 plus some amount n. You can spend any n that keeps the total under $10.</p>' }
        ],
        key: '<p>Find the edge with =. <b>The edge is not an answer</b> for &lt; or &gt;. Test a number on each side.</p>',
        mistake: '<p>Including the edge number (n + 3 &lt; 10, so n = 7), or giving only one answer. Test the edge out loud: "7 + 3 = 10. Is 10 less than 10?"</p>',
        check: [P('al-ineq', 1), P('al-ineq', 2)] }
    ] },

    { id: 'code', title: 'Code', sub: 'Loops and conditions.', concepts: [
      { id: 'loops', title: 'Loops and conditions', exp: ['C3.1', 'C3.2'], skill: 'al-code',
        body: '<p>A <b>loop</b> repeats instructions. A <b>condition</b> checks if something is true, then chooses what to do. Trace the code one pass at a time.</p>',
        watch: K.watch([
          { say: 'total = 2. Repeat 4 times: total = total + 3.', fig: an(trace(2, 3, 1)) },
          { say: 'Pass 2: 5 + 3 = 8.', fig: an(trace(2, 3, 2)) },
          { say: 'Pass 3: 11. Pass 4: 14.', fig: an(trace(2, 3, 4)) },
          { say: 'Add a condition: say "big" if total &gt; 10.', fig: an(trace(2, 3, 4, 10)), ms: 2400 }
        ]),
        try: K.widget('patterns-algebra', 5, 'Good. Change the start value and see every total move.'),
        key: '<p>Trace a loop <b>one pass at a time</b>, and write the total after each pass.</p>',
        mistake: '<p>Forgetting the start value, or running the loop one time too many. Have the child keep a written trace table: pass, total.</p>',
        check: [P('al-code', 1), P('al-code', 2)] }
    ] }
  ];
  A.register('patterns-algebra', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Kinds of patterns</h2>' +
'<p><b>Repeating:</b> the <i>core</i> (circle, square, square) repeats over and over.</p><div class="fig">' + repeating(['r', 'b', 'b'], 4) + '</div>' +
'<p><b>Growing:</b> 5, 9, 13, 17, &hellip; It goes up by 4 each time.</p><div class="fig">' + jumps([5, 9, 13, 17], null, '+4') + '</div>' +
'<p><b>Shrinking:</b> 100, 92, 84, 76, &hellip; It goes down by 8 each time.</p><div class="fig">' + bars([100, 92, 84, 76]) + '</div>' +
'<p>A good rule tells you how to get <b>any</b> term, not just the next one. "Add 4" gets you the next term. "4 times the term number, plus 1" gets you the 50th term straight away: 4 &times; 50 + 1 = 201.</p>' +
'<div class="key"><b class="t">Key idea</b><p>Patterns are all around: the days of the week repeat, a savings account can grow by the same amount each week, and a tank can drain by the same amount each minute.</p></div>' +
'<div class="eg"><p><b>Example.</b> 3, 7, 11, 15, &hellip; The rule is add 4, so the next term is <b>19</b>.</p><div class="fig">' + jumps([3, 7, 11, 15, 19], null, '+4') + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Tables of values and graphs</h2>' +
'<p>Each figure is made of <b>groups</b> that repeat, plus some <b>extra</b> tiles that never change. Figure <i>n</i> has <i>k</i> &times; <i>n</i> + <i>c</i> tiles. A table of values and a graph show the same pattern in two other ways.</p>' +
'<div class="lab"><span class="lt">Try it: build a pattern</span>' +
'<div class="ctrl"><label for="pk">Tiles in each group<select id="pk"><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option></select></label>' +
'<label for="pc">Extra tiles<select id="pc"><option>0</option><option selected>1</option><option>2</option><option>3</option></select></label>' +
'<label for="pf">Figure number: <output id="pfo"></output><input type="range" id="pf" min="1" max="30" value="4"></label></div>' +
'<div class="fig" id="pfig"></div><div class="tbl" id="ptbl"></div><div class="fig" id="pgr"></div><div class="out" id="pout"></div></div>' +
'<p>A <b>shrinking</b> pattern goes down by the same amount each time. 50, 44, 38, 32 subtracts 6. Its graph slopes down.</p>' +
'<div class="eg"><p><b>Example.</b> Figures with 2 tiles in each group and 3 extra tiles follow the rule 2 &times; n + 3. Figure 10 has 2 &times; 10 + 3 = <b>23</b> tiles.</p><div class="fig">' + tiles(2, 3, 3) + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Counting up one figure at a time to reach figure 50. It is slow and easy to get wrong. Put 50 into the rule instead.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Patterns with decimals</h2>' +
'<p>Counting by 0.1 or 0.01 makes a pattern too. Watch what happens when you pass a whole number: 0.8, 0.9, <b>1.0</b>, 1.1. Ten tenths make one whole.</p>' +
'<div class="lab"><span class="lt">Try it: count by tenths or hundredths</span>' +
'<div class="ctrl"><label for="ds">Start at<input type="text" id="ds" value="0.7" inputmode="decimal" autocomplete="off"></label>' +
'<label for="dp">Count by<select id="dp"><option value="0.1">0.1</option><option value="0.01">0.01</option><option value="0.05">0.05</option><option value="0.25">0.25</option></select></label>' +
'<label for="dd">Direction<select id="dd"><option value="1">up</option><option value="-1">down</option></select></label></div>' +
'<div class="out" id="dout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>After 0.9 comes 1.0, not 0.10. And after 0.09 comes 0.10, not 0.010.</p><div class="fig">' + jumps([0.7, 0.8, 0.9, 1.0, 1.1], ['0.7', '0.8', '0.9', '1.0', '1.1'], '+0.1') + '</div></div>' +
'<div class="eg"><p><b>Example.</b> 2.47, 2.48, 2.49, &hellip; The next term is <b>2.50</b>, because 10 hundredths make 1 tenth.</p><div class="fig">' + jumps([1, 2, 3, 4], ['2.47', '2.48', '2.49', '2.50'], '+0.01') + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Variables and expressions</h2>' +
'<p>A <b>variable</b> is a letter, like <i>n</i>, that stands for a number. An <b>expression</b> is a math phrase with numbers, variables and operations, like 3<i>n</i> + 2. 3<i>n</i> means 3 &times; <i>n</i>. To <b>evaluate</b> an expression, replace the variable with a number and calculate.</p>' +
'<div class="lab"><span class="lt">Try it: evaluate an expression</span>' +
'<div class="ctrl"><label for="xk">Multiply n by<select id="xk"><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option><option>10</option></select></label>' +
'<label for="xc">Then add<select id="xc"><option>0</option><option>1</option><option selected>2</option><option>5</option><option>10</option></select></label>' +
'<label for="xn">n = <output id="xno"></output><input type="range" id="xn" min="0" max="20" value="5"></label></div>' +
'<div class="fig" id="xfig"></div><div class="out" id="xout"></div></div>' +
'<div class="eg"><p><b>Example.</b> Think of <i>n</i> as a bag holding an unknown number of counters.</p>' +
'<div class="pies"><figure>' + bags(1, 4) + '<figcaption>"four more than a number": n + 4</figcaption></figure><figure>' + bags(2, 0) + '<figcaption>"twice a number": 2n</figcaption></figure><figure>' + bags(3, 2) + '<figcaption>3n + 2</figcaption></figure></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Reading 3n as 3 + n. 3n means 3 &times; n. When n = 5, 3n is 15, not 8.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Equations and inequalities</h2>' +
'<p>An <b>equation</b> says two things are equal, like a balanced scale. To solve it, do the <b>same thing to both sides</b>. Then check by putting your answer back in.</p>' +
'<div class="lab"><span class="lt">Try it: balance the scale</span>' +
'<div class="ctrl"><label for="et">Equation<select id="et"><option value="add">n + a = b</option><option value="mul">a &times; n = b</option><option value="sub">n &minus; a = b</option></select></label>' +
'<label for="ea">a<input type="number" id="ea" min="1" max="20" value="14"></label>' +
'<label for="eb">b<input type="number" id="eb" min="1" max="100" value="31"></label>' +
'<label for="en">Guess for n: <output id="eno"></output><input type="range" id="en" min="0" max="100" value="10"></label></div>' +
'<div class="fig" id="efig"></div><div class="out" id="eout"></div></div>' +
'<p>An <b>inequality</b> uses &lt; or &gt; instead of =. It usually has many answers. Solve it like an equation, then test numbers near the answer.</p>' +
'<div class="lab"><span class="lt">Try it: graph an inequality</span>' +
'<div class="ctrl"><label for="ia">n +<input type="number" id="ia" min="0" max="40" value="3"></label>' +
'<label for="io">Symbol<select id="io"><option value="lt">&lt;</option><option value="gt">&gt;</option></select></label>' +
'<label for="ib">Number (up to 50)<input type="number" id="ib" min="1" max="50" value="10"></label></div>' +
'<div class="fig" id="ifig"></div><div class="out" id="iout"></div></div>' +
'<div class="eg"><p><b>Example.</b> Solve n &minus; 12 = 30. Add 12 to both sides: n = 42. Check: 42 &minus; 12 = 30. It works.</p>' +
'<div class="pies"><figure>' + scale('n &#8722; 12', '30') + '<figcaption>start</figcaption></figure><figure>' + scale('n', '30 + 12') + '<figcaption>add 12 to both sides</figcaption></figure></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>An equation usually has one answer. An inequality can have many. The edge number never works for &lt; or &gt;.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Code: loops and conditions</h2>' +
'<p>A <b>loop</b> repeats instructions. A <b>condition</b> checks if something is true or false, then chooses what to do. Read the code line by line to predict what it will do.</p>' +
'<div class="lab"><span class="lt">Try it: change the code</span>' +
'<div class="ctrl"><label for="ls">Start at<input type="number" id="ls" min="0" max="100" value="2"></label>' +
'<label for="lp">Add each time<input type="number" id="lp" min="1" max="20" value="3"></label>' +
'<label for="lr">Repeat: <output id="lro"></output> times<input type="range" id="lr" min="1" max="10" value="5"></label>' +
'<label for="lc">Condition<select id="lc"><option value="none">no condition</option><option value="even">say only even totals</option><option value="big">say "big" if total &gt; 15</option></select></label></div>' +
'<span class="mono" id="lcode"></span><div class="fig" id="ltr"></div><div class="out" id="lout"></div></div>' +
'<div class="eg"><p><b>Example.</b> total = 0, then repeat 4 times: total = total + 5. The totals are 5, 10, 15, 20, so the final total is <b>20</b>.</p><div class="fig">' + trace(0, 5, 4) + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Forgetting the start value. If total starts at 3 instead of 0, every total in the loop is 3 more.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function p() {
        var k = +$('#pk', root).value, c = +$('#pc', root).value, f = +$('#pf', root).value;
        $('#pfo', root).textContent = f;
        $('#pfig', root).innerHTML = tiles(k, c, 4);
        var show = 0, s = '', x = 10;
        for (var n = 1; n <= show; n++) {
          s += '<text x="' + x + '" y="18" class="tb" font-size="13">Fig. ' + n + '</text>';
          var gx = x;
          for (var g = 0; g < n; g++) {
            for (var t = 0; t < k; t++) s += '<rect x="' + gx + '" y="' + (28 + t * 20) + '" width="18" height="18" rx="3" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/>';
            gx += 22;
          }
          for (var e = 0; e < c; e++) s += '<rect x="' + gx + '" y="' + (28 + e * 20) + '" width="18" height="18" rx="3" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/>';
          x = Math.max(gx + (c ? 22 : 0), x + 50) + 18;
        }

        var th = '<table><thead><tr><th>Figure</th>', tr = '<tr><th>Tiles</th>', vals = [];
        for (var i = 1; i <= 6; i++) { th += '<th>' + i + '</th>'; tr += '<td>' + (k * i + c) + '</td>'; vals.push(k * i + c); }
        $('#ptbl', root).innerHTML = th + '</tr></thead><tbody>' + tr + '</tr></tbody></table>';
        $('#pgr', root).innerHTML = graph(vals, 'Graph of tiles for figures 1 to 6');
        $('#pout', root).innerHTML = '<p>Rule: <span class="big">' + (k === 1 ? '' : k + ' × ') + 'n' + (c ? ' + ' + c : '') + '</span></p>' +
          '<p>Figure ' + f + ' has ' + k + ' × ' + f + (c ? ' + ' + c : '') + ' = <b>' + (k * f + c) + '</b> tiles. Purple tiles are the repeating groups, yellow tiles are the extras. Each figure adds ' + k + ' tile' + (k > 1 ? 's' : '') + '.</p>';
      }
      A.bind(root, ['pk', 'pc', 'pf'], p);

      function d() {
        var v = $('#ds', root).value.trim(), st = +$('#dp', root).value, dir = +$('#dd', root).value, o = $('#dout', root);
        if (!/^\d{1,2}(\.\d{1,2})?$/.test(v)) { o.innerHTML = '<p>Type a start number like 0.7 or 2.35.</p>'; return; }
        var c = Math.round(parseFloat(v) * 100), stc = Math.round(st * 100), seq = [];
        for (var i = 0; i < 8; i++) { var x = c + dir * i * stc; if (x < 0) break; seq.push(x); }
        var two = stc % 10 !== 0 || c % 10 !== 0;
        o.innerHTML = '<p class="math" style="white-space:normal"><span class="big">' + seq.map(function (x) { var t = two ? (x / 100).toFixed(2) : (x / 100).toFixed(1); return (x % 100 === 0 ? '<u>' + t + '</u>' : t); }).join(', ') + '</span></p>' +
          '<p>Each term ' + (dir > 0 ? 'adds ' : 'subtracts ') + st + '. Underlined terms are whole numbers.</p>';
      }
      A.bind(root, ['ds', 'dp', 'dd'], d);

      function x() {
        var k = +$('#xk', root).value, c = +$('#xc', root).value, n = +$('#xn', root).value;
        $('#xno', root).textContent = n;
        var expr = (k === 1 ? '' : k) + 'n' + (c ? ' + ' + c : ''), s = '', px = 6;
        for (var i = 0; i < Math.min(k, 5); i++) {
          s += '<rect x="' + px + '" y="10" width="54" height="44" rx="8" style="fill:color-mix(in srgb,var(--strand) 20%,var(--card));stroke:var(--strand)" stroke-width="2"/><text x="' + (px + 27) + '" y="38" text-anchor="middle" class="tb">n=' + n + '</text>';
          px += 60;
        }
        if (k > 5) { s += '<text x="' + (px + 4) + '" y="38" class="tb">&#8230; ' + k + ' bags</text>'; px += 80; }
        for (var j = 0; j < Math.min(c, 10); j++) s += '<circle cx="' + (px + 12 + (j % 5) * 18) + '" cy="' + (22 + Math.floor(j / 5) * 20) + '" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/>';
        $('#xfig', root).innerHTML = A.svg(Math.max(240, px + 100), 64, s, k + ' bags of n and ' + c + ' extra counters');
        $('#xout', root).innerHTML = '<p>Expression: <b>' + expr + '</b></p><p><span class="big">' + (k === 1 ? '' : k + ' × ') + n + (c ? ' + ' + c : '') + ' = ' + (k * n + c) + '</span></p><p>Each bag holds n = ' + n + ' counters. There ' + (k === 1 ? 'is 1 bag' : 'are ' + k + ' bags') + (c ? ' and ' + c + ' extra' : '') + '.</p>';
      }
      A.bind(root, ['xk', 'xc', 'xn'], x);

      function e() {
        var t = $('#et', root).value, a = Math.max(1, +$('#ea', root).value || 1), b = Math.max(1, Math.min(100, +$('#eb', root).value || 1)), n = +$('#en', root).value;
        var l, ans, ok = true, msg = '';
        if (t === 'mul') { if (b % a !== 0) { ok = false; msg = 'Choose b so that a divides it evenly, like a = 6 and b = 54.'; } ans = b / a; l = a * n; }
        else if (t === 'add') { if (b < a) { ok = false; msg = 'Make b at least as big as a.'; } ans = b - a; l = n + a; }
        else { ans = b + a; l = n - a; if (ans > 100) { ok = false; msg = 'Keep a + b at 100 or less.'; } }
        $('#eno', root).textContent = n;
        if (!ok) { $('#efig', root).innerHTML = ''; $('#eout', root).innerHTML = '<p>' + msg + '</p>'; return; }
        var diff = Math.max(-100, Math.min(100, l - b)), ang = Math.max(-14, Math.min(14, -diff * 0.5));
        var lt = t === 'mul' ? a + ' × ' + n : t === 'add' ? n + ' + ' + a : n + ' − ' + a;
        var s = '<polygon points="200,150 180,172 220,172" style="fill:var(--ink)"/><g transform="rotate(' + ang + ' 200 110)">' +
          '<rect x="60" y="106" width="280" height="8" rx="4" style="fill:var(--ink)"/>' +
          '<line x1="80" y1="106" x2="80" y2="84" style="stroke:var(--ink)" stroke-width="2"/><rect x="34" y="60" width="92" height="24" rx="6" style="fill:var(--strand)"/><text x="80" y="77" text-anchor="middle" class="tb" style="fill:#fff">' + lt + '</text>' +
          '<line x1="320" y1="106" x2="320" y2="84" style="stroke:var(--ink)" stroke-width="2"/><rect x="274" y="60" width="92" height="24" rx="6" style="fill:var(--hi)"/><text x="320" y="77" text-anchor="middle" class="tb" style="fill:#13203a">' + b + '</text></g>' +
          '<line x1="200" y1="110" x2="200" y2="150" style="stroke:var(--ink)" stroke-width="3"/>';
        $('#efig', root).innerHTML = A.svg(400, 180, s, 'Balance scale: left side ' + l + ', right side ' + b);
        var inv = t === 'add' ? 'subtract ' + a + ' from both sides: n = ' + b + ' − ' + a : t === 'sub' ? 'add ' + a + ' to both sides: n = ' + b + ' + ' + a : 'divide both sides by ' + a + ': n = ' + b + ' ÷ ' + a;
        $('#eout', root).innerHTML = '<p>Left side is <b>' + l + '</b>, right side is <b>' + b + '</b>. ' + (l === b ? '<b style="color:var(--good)">Balanced. n = ' + n + '.</b>' : l < b ? 'The right side is heavier. Try a bigger n.' : 'The left side is heavier. Try a smaller n.') + '</p><p>Solve it exactly: ' + inv + ' = <b>' + ans + '</b>.</p>';
      }
      A.bind(root, ['et', 'ea', 'eb', 'en'], e);

      function iq() {
        var a = Math.max(0, Math.min(40, parseInt($('#ia', root).value, 10) || 0)), b = Math.max(1, Math.min(50, parseInt($('#ib', root).value, 10) || 1)), lt = $('#io', root).value === 'lt';
        var edge = b - a, sym = lt ? '&lt;' : '&gt;', o = $('#iout', root);
        if (lt && edge <= 0) { $('#ifig', root).innerHTML = ''; o.innerHTML = '<p>No whole number works: n + ' + a + ' is never less than ' + b + '. Make the number bigger.</p>'; return; }
        var lo = Math.max(0, edge - 6), hi = lo + 12, s = '<line x1="16" y1="34" x2="444" y2="34" style="stroke:var(--ink)" stroke-width="2"/>';
        for (var v = lo; v <= hi; v++) {
          var x = 30 + (v - lo) * 33, on = lt ? v < edge : v > edge;
          s += '<circle cx="' + x + '" cy="34" r="8" style="fill:' + (on ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="62" text-anchor="middle" font-size="13">' + v + '</text>';
        }
        s += lt ? '<text x="8" y="18" font-size="12" class="t2">&#8592; continues to 0</text>' : '<text x="444" y="18" text-anchor="end" font-size="12" class="t2">continues &#8594;</text>';
        $('#ifig', root).innerHTML = A.svg(460, 70, s, 'Number line with the whole number solutions filled in');
        o.innerHTML = '<p>Solve like an equation: n + ' + a + ' = ' + b + ' when n = ' + edge + '.</p><p><span class="big">n ' + sym + ' ' + edge + '</span></p>' +
          '<p>Test: n = ' + (lt ? edge - 1 : edge + 1) + ' gives ' + ((lt ? edge - 1 : edge + 1) + a) + ' ' + sym + ' ' + b + ', which is true. n = ' + edge + ' gives ' + b + ', which is not ' + (lt ? 'less' : 'more') + ' than ' + b + '.</p>';
      }
      A.bind(root, ['ia', 'io', 'ib'], iq);

      function l() {
        var s = Math.max(0, +$('#ls', root).value || 0), a = Math.max(1, +$('#lp', root).value || 1), r = +$('#lr', root).value, c = $('#lc', root).value;
        $('#lro', root).textContent = r;
        var code = 'total = ' + s + '\nrepeat ' + r + ' times:\n    total = total + ' + a + '\n';
        code += c === 'none' ? '    say total' : c === 'even' ? '    if total is even:\n        say total' : '    if total > 15:\n        say "big"\n    else:\n        say total';
        $('#lcode', root).textContent = code;
        var said = [], t = s;
        for (var i = 0; i < r; i++) { t += a; if (c === 'none') said.push(t); else if (c === 'even') { if (t % 2 === 0) said.push(t); } else said.push(t > 15 ? '"big"' : t); }
        $('#ltr', root).innerHTML = trace(s, a, r, c === 'big' ? 15 : undefined);
        $('#lout', root).innerHTML = '<p><b>The computer says:</b> <span class="math" style="white-space:normal">' + (said.length ? said.join(', ') : '(nothing)') + '</span></p><p>The final total is <b>' + t + '</b>. ' +
          (c === 'none' ? 'The loop makes a growing pattern that adds ' + a + ' each time.' : c === 'even' ? 'The condition skips the odd totals.' : 'The condition checks each total. Once it passes 15, the computer says "big" instead.') + '</p>';
      }
      A.bind(root, ['ls', 'lp', 'lr', 'lc'], l);
    },

    quiz: [
      { q: 'What number comes next? <span class="math">5, 9, 13, 17, ?</span>', type: 'num', answer: 21, fig: jumps([5, 9, 13, 17, '?'], null, '+?'), hint: 'Find how much it goes up each time.', explain: 'The rule is add 4, and 17 + 4 = 21.' },
      { q: 'What number comes next? <span class="math">100, 92, 84, 76, ?</span>', type: 'num', answer: 68, fig: bars([100, 92, 84, 76]), hint: 'This pattern shrinks.', explain: 'Subtract 8 each time: 76 &minus; 8 = 68.' },
      { q: 'What comes next? <span class="math">0.7, 0.8, 0.9, ?</span>', type: 'mc', options: ['0.10', '1.0', '0.91', '10'], answer: 1, hint: 'Ten tenths make one whole.', explain: '0.9 + 0.1 = 1.0.' },
      { q: 'Evaluate <span class="math">3<i>n</i> + 2</span> when <i>n</i> = 10.', type: 'num', answer: 32, fig: bags(3, 2, '10'), hint: 'Replace n with 10. Multiply first, then add.', explain: '3 &times; 10 + 2 = 32.' },
      { q: 'Solve: <span class="math">6 &times; <i>n</i> = 54</span>', type: 'num', answer: 9, fig: scale('6 &#215; n', '54'), hint: 'The inverse of multiplying is dividing.', explain: '54 &divide; 6 = 9. Check: 6 &times; 9 = 54.' },
      { q: 'Which whole numbers make <span class="math"><i>n</i> + 3 &lt; 7</span> true?', type: 'mc', options: ['0, 1, 2, 3', '0, 1, 2, 3, 4', '4 only', '5, 6, 7'], answer: 0, hint: 'n + 3 = 7 when n = 4. Is 4 itself allowed?', explain: '4 + 3 = 7, which is not less than 7. So n can be 0, 1, 2 or 3.' },
      { q: 'What does this code say last?<span class="mono">total = 2\nrepeat 5 times:\n    total = total + 3\n    if total > 10:\n        say "big"\n    else:\n        say total</span>', type: 'mc', options: ['17', '"big"', '14', '5'], answer: 1, hint: 'Find the final total, then check the condition.', explain: 'The totals are 5, 8, 11, 14, 17. The last one, 17, is more than 10, so it says "big".' }
    ],

    quick: ['al-next', 'al-rule', 'al-dec', 'al-eval', 'al-solve', 'al-code'],

    practice: [
      { id: 'al-next', name: 'Extend a pattern', code: 'C1.3', gen: function (lv) {
        var grow = lv === 1 ? true : R.int(0, 1) === 1, step = R.int(2, lv === 1 ? 5 : 12), start = grow ? R.int(1, 30) : R.int(60, 120), seq = [];
        for (var i = 0; i < 5; i++) seq.push(start + (grow ? 1 : -1) * step * i);
        if (lv < 3) return { q: 'What number comes next? <span class="math">' + seq.slice(0, 4).join(', ') + ', ?</span>', type: 'num', answer: seq[4],
          hint: 'Find the difference between two terms next to each other.', fig: lv === 1 ? graph(seq.slice(0, 4)) : '',
          steps: [seq[1] + ' &minus; ' + seq[0] + ' = ' + (seq[1] - seq[0]) + '.', 'The pattern ' + (grow ? 'adds ' : 'subtracts ') + step + ' each time.', seq[3] + (grow ? ' + ' : ' &minus; ') + step + ' = ' + seq[4] + '.'],
          explain: 'The rule is ' + (grow ? 'add ' : 'subtract ') + step + '. The next term is ' + seq[4] + '.' };
        var miss = R.int(1, 3), shown = seq.map(function (v, i) { return i === miss ? '?' : v; });
        return { q: 'What is the missing term? <span class="math">' + shown.join(', ') + '</span>', type: 'num', answer: seq[miss], hint: 'Use two terms next to each other to find the step.',
          steps: ['Find two neighbours with no gap: ' + (miss > 1 ? seq[0] + ' and ' + seq[1] : seq[3] + ' and ' + seq[4]) + '. The step is ' + step + '.', 'Start from the term before the gap: ' + seq[miss - 1] + '.', seq[miss - 1] + (grow ? ' + ' : ' &minus; ') + step + ' = ' + seq[miss] + '.'],
          explain: 'The pattern ' + (grow ? 'adds ' : 'subtracts ') + step + ', so the missing term is ' + seq[miss] + '.' };
      } },
      { id: 'al-rule', name: 'Find the pattern rule', code: 'C1.2', gen: function (lv) {
        var k = R.int(2, lv === 1 ? 5 : 9), c = lv === 1 ? 0 : R.int(1, 9), vals = [1, 2, 3, 4].map(function (n) { return k * n + c; });
        var tbl = '<div class="tbl"><table><tbody><tr><th>Term number</th><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>Value</th>' + vals.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr></tbody></table></div>';
        if (lv === 3) {
          var n = R.int(10, 20);
          return { q: 'The table follows a rule. What is the value of term ' + n + '?', fig: tbl, type: 'num', answer: k * n + c, hint: 'Find the rule first: how much does it go up each time? What is added on?',
            steps: ['It goes up by ' + k + ' each time, so the rule starts with ' + k + ' &times; n.', k + ' &times; 1 = ' + k + ', and the first value is ' + vals[0] + ', so add ' + c + '.', 'Rule: ' + k + 'n + ' + c + '. Term ' + n + ': ' + k + ' &times; ' + n + ' + ' + c + ' = ' + (k * n + c) + '.'],
            explain: 'The rule is ' + k + 'n + ' + c + ', so term ' + n + ' is ' + (k * n + c) + '.' };
        }
        var right = k + 'n' + (c ? ' + ' + c : ''), o = R.mc(right, [(k + 1) + 'n' + (c ? ' + ' + c : ''), 'n + ' + k, k + 'n + ' + (c + 1), (c ? c : k + 1) + 'n' + ' + ' + k]);
        return { q: 'Which rule matches the table?', fig: tbl, type: 'mc', options: o.options, answer: o.answer, hint: 'How much does the value go up each time? That number multiplies n.',
          steps: ['The values go up by ' + k + ', so the rule has ' + k + 'n.', 'Check term 1: ' + k + ' &times; 1 = ' + k + '. The table says ' + vals[0] + (c ? ', so add ' + c : ', so nothing is added') + '.', 'The rule is ' + right + '.'],
          explain: 'Rule: ' + right + '. Check term 4: ' + k + ' &times; 4' + (c ? ' + ' + c : '') + ' = ' + vals[3] + '.' };
      } },
      { id: 'al-dec', name: 'Decimal patterns', code: 'C1.4', gen: function (lv) {
        var st = lv === 1 ? 10 : lv === 2 ? R.pick([10, 1]) : R.pick([5, 25, 1]), up = lv === 1 || R.int(0, 1) === 1, c;
        if (st === 10) c = R.int(5, 25) * 10; else if (st === 1) c = R.int(1, 9) * 10 + R.int(5, 8); else c = R.int(2, 20) * 5;
        if (!up) c += 4 * st;
        var seq = [];
        for (var i = 0; i < 5; i++) seq.push(c + (up ? 1 : -1) * st * i);
        var two = st % 10 !== 0 || seq.some(function (v) { return v % 10 !== 0; });
        function f(v) { return two ? (v / 100).toFixed(2) : (v / 100).toFixed(1); }
        return { q: 'What comes next? <span class="math">' + seq.slice(0, 4).map(f).join(', ') + ', ?</span>', type: 'num', answer: A.clean(seq[4] / 100),
          fig: jumps(seq.slice(0, 4).concat(['?']), seq.slice(0, 4).map(f).concat(['?']), (up ? '+' : '&#8722;') + '?'),
          hint: 'Find the step. Remember that 10 tenths make 1 whole, and 10 hundredths make 1 tenth.',
          steps: ['The step is ' + (up ? '+' : '&minus;') + (st / 100) + '.', 'Start at ' + f(seq[3]) + '.', f(seq[3]) + (up ? ' + ' : ' &minus; ') + (st / 100) + ' = ' + f(seq[4]) + '.'],
          explain: 'Each term ' + (up ? 'adds ' : 'subtracts ') + (st / 100) + ', so the next term is ' + f(seq[4]) + '.' };
      } },
      { id: 'al-eval', name: 'Evaluate expressions', code: 'C2.2', gen: function (lv) {
        var k = R.int(2, 9), c = R.int(1, 20), n = R.int(2, lv === 1 ? 5 : 12);
        var form = lv === 1 ? 'kn' : lv === 2 ? 'kn+c' : R.pick(['kn-c', 'n/k+c']);
        if (form === 'kn-c' && k * n <= c) c = R.int(1, k * n - 1);
        var expr, val;
        if (form === 'kn') { expr = k + '<i>n</i>'; val = k * n; }
        else if (form === 'kn+c') { expr = k + '<i>n</i> + ' + c; val = k * n + c; }
        else if (form === 'kn-c') { expr = k + '<i>n</i> &minus; ' + c; val = k * n - c; }
        else { n = k * R.int(2, 9); expr = '<i>n</i> &divide; ' + k + ' + ' + c; val = n / k + c; }
        return { q: 'Evaluate <span class="math">' + expr + '</span> when <i>n</i> = ' + n + '.', type: 'num', answer: val, fig: form === 'kn' || form === 'kn+c' ? bags(k, form === 'kn+c' && c <= 10 ? c : 0, String(n)) + (form === 'kn+c' && c > 10 ? '<p class="t2" style="text-align:center;font-size:.9rem">plus ' + c + ' extra</p>' : '') : '', hint: 'Replace n with ' + n + '. Multiply or divide first, then add or subtract.',
          steps: ['Replace n with ' + n + ': ' + expr.replace('<i>n</i>', (form === 'n/k+c' ? n : '(' + n + ')')).replace(k + '(' + n + ')', k + ' &times; ' + n) + '.', form === 'n/k+c' ? n + ' &divide; ' + k + ' = ' + n / k + '.' : k + ' &times; ' + n + ' = ' + k * n + '.', 'The value is ' + val + '.'],
          explain: 'With n = ' + n + ', the expression equals ' + val + '.' };
      } },
      { id: 'al-solve', name: 'Solve equations', code: 'C2.3', gen: function (lv) {
        var t = lv === 1 ? 'add' : lv === 2 ? R.pick(['add', 'sub', 'mul']) : R.pick(['mul', 'sub', 'add2']), a, b, n;
        if (t === 'add') { a = R.int(3, 40); n = R.int(2, 100 - a); b = n + a; }
        else if (t === 'sub') { a = R.int(3, 40); n = R.int(a + 1, 100); b = n - a; }
        else if (t === 'mul') { a = R.int(2, 12); n = R.int(2, Math.floor(100 / a)); b = a * n; }
        else { a = R.int(10, 50); n = R.int(2, 100 - a); b = a + n; }
        var eq = t === 'add' ? '<i>n</i> + ' + a + ' = ' + b : t === 'sub' ? '<i>n</i> &minus; ' + a + ' = ' + b : t === 'mul' ? a + ' &times; <i>n</i> = ' + b : a + ' + <i>n</i> = ' + b;
        var inv = t === 'sub' ? 'Add ' + a + ' to both sides: ' + b + ' + ' + a + ' = ' + n + '.' : t === 'mul' ? 'Divide both sides by ' + a + ': ' + b + ' &divide; ' + a + ' = ' + n + '.' : 'Subtract ' + a + ' from both sides: ' + b + ' &minus; ' + a + ' = ' + n + '.';
        return { q: 'Solve: <span class="math">' + eq + '</span>', type: 'num', answer: n, fig: lv < 3 ? scale(eq.replace(/<\/?i>/g, '').split(' = ')[0], b) : '', hint: 'Do the opposite operation to both sides.',
          steps: ['The equation is ' + eq + '.', inv, 'Check: put ' + n + ' back in. ' + eq.replace('<i>n</i>', n) + ' is true.'], explain: 'n = ' + n + '.' };
      } },
      { id: 'al-ineq', name: 'Solve inequalities', code: 'C2.4', gen: function (lv) {
        var a = R.int(2, 20), b = R.int(a + 4, 50), edge = b - a, lt = lv === 1 ? true : R.int(0, 1) === 1;
        if (lv < 3) {
          var right = lt ? edge - 1 : edge + 1;
          return { q: 'What is the ' + (lt ? 'greatest' : 'least') + ' whole number that makes <span class="math"><i>n</i> + ' + a + ' ' + (lt ? '&lt;' : '&gt;') + ' ' + b + '</span> true?', type: 'num', answer: right,
            hint: 'First solve n + ' + a + ' = ' + b + '. Then step one number ' + (lt ? 'down' : 'up') + '.',
            steps: ['n + ' + a + ' = ' + b + ' when n = ' + edge + '.', 'n = ' + edge + ' makes the two sides equal, so it does not work.' + '<div class="fig">' + ineq(edge, lt) + '</div>', 'The ' + (lt ? 'greatest' : 'least') + ' number that works is ' + right + '. Check: ' + right + ' + ' + a + ' = ' + (right + a) + '.'],
            explain: 'n ' + (lt ? '&lt; ' : '&gt; ') + edge + ', so the answer is ' + right + '.' };
        }
        var k = R.int(2, 6), m = R.int(3, 8), bb = k * m;
        var opts = R.mc('n &lt; ' + m, ['n &lt; ' + (m + 1), 'n &gt; ' + m, 'n &lt; ' + bb]);
        return { q: 'Which describes all the solutions of <span class="math">' + k + ' &times; <i>n</i> &lt; ' + bb + '</span>?', type: 'mc', options: opts.options, answer: opts.answer,
          hint: 'Solve ' + k + ' &times; n = ' + bb + ' first.', steps: [k + ' &times; n = ' + bb + ' when n = ' + m + '.', 'Smaller numbers give smaller products, so n must be less than ' + m + '.', 'Solutions: n &lt; ' + m + '.'],
          explain: k + ' &times; ' + m + ' = ' + bb + ', so n &lt; ' + m + '.' };
      } },
      { id: 'al-code', name: 'Read and change code', code: 'C3.2', gen: function (lv) {
        var s = R.int(0, 10), a = R.int(2, 6), r = R.int(3, lv === 1 ? 4 : 6), t = s + a * r;
        if (lv === 1) return { q: 'What is the final value of <i>total</i>?<span class="mono">total = ' + s + '\nrepeat ' + r + ' times:\n    total = total + ' + a + '</span>', type: 'num', answer: t,
          hint: 'Add ' + a + ', ' + r + ' times, starting from ' + s + '.',
          steps: ['Start: total = ' + s + '.' + '<div class="fig">' + trace(s, a, r) + '</div>', 'Each time through the loop, add ' + a + ': ' + (function () { var l = [], x = s; for (var i = 0; i < r; i++) { x += a; l.push(x); } return l.join(', '); })() + '.', 'Final total: ' + t + '.'], explain: s + ' + ' + a + ' &times; ' + r + ' = ' + t + '.' };
        if (lv === 2) {
          var r2 = r + R.int(1, 3), t2 = s + a * r2;
          return { q: 'This code ends with total = ' + t + '. If you change <b>repeat ' + r + ' times</b> to <b>repeat ' + r2 + ' times</b>, what is the new final total?<span class="mono">total = ' + s + '\nrepeat ' + r + ' times:\n    total = total + ' + a + '</span>', type: 'num', answer: t2,
            hint: 'Each extra time through the loop adds ' + a + ' more.', steps: ['The loop now runs ' + (r2 - r) + ' more time' + (r2 - r > 1 ? 's' : '') + '.', 'Each extra time adds ' + a + ': ' + (r2 - r) + ' &times; ' + a + ' = ' + a * (r2 - r) + '.', t + ' + ' + a * (r2 - r) + ' = ' + t2 + '.'],
            explain: s + ' + ' + a + ' &times; ' + r2 + ' = ' + t2 + '.' };
        }
        var lim = s + a * R.int(1, r - 1), cnt = 0, x = s, said = [];
        for (var i = 0; i < r; i++) { x += a; if (x > lim) { cnt++; said.push('"big"'); } else said.push(x); }
        return { q: 'How many times does this code say <b>"big"</b>?<span class="mono">total = ' + s + '\nrepeat ' + r + ' times:\n    total = total + ' + a + '\n    if total > ' + lim + ':\n        say "big"\n    else:\n        say total</span>', type: 'num', answer: cnt,
          hint: 'Write down the total after each pass. Check the condition each time.', steps: ['<div class="fig">' + trace(s, a, r, lim) + '</div>' + 'The totals are: ' + (function () { var l = [], y = s; for (var j = 0; j < r; j++) { y += a; l.push(y); } return l.join(', '); })() + '.', 'The condition is true when the total is more than ' + lim + '.', 'It says: ' + said.join(', ') + '. That is ' + cnt + ' times "big".'],
          explain: 'The computer says ' + said.join(', ') + '.' };
      } }
    ]
  });
})();
