(function () {
  var A = Atlas, R = A.R;
  function cl(x) { return Math.round(x * 1000) / 1000; }
  function f(x) { return x < 0 ? '−' + A.fmt(cl(-x)) : A.fmt(cl(x)); }
  /* "3n + 2" style expression text */
  function expr(m, b, v) {
    v = v || 'n';
    var s = (m === 1 ? '' : m === -1 ? '−' : f(m)) + v;
    if (b > 0) s += ' + ' + f(b); else if (b < 0) s += ' − ' + f(-b);
    return s;
  }
  /* tile figures for terms 1..k: term n has m*n + b squares, laid out as b in a column plus n columns of m */
  function figs(m, b, k, label) {
    var u = 14, s = '', x = 6, H = 0;
    for (var n = 1; n <= k; n++) {
      var cols = n + (b > 0 ? 1 : 0), w = cols * u, top = 24, h = Math.max(m, b) * u;
      H = Math.max(H, h);
      if (b > 0) for (var j = 0; j < b; j++) s += '<rect x="' + x + '" y="' + (top + j * u) + '" width="' + (u - 2) + '" height="' + (u - 2) + '" rx="2" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1"/>';
      for (var c = 0; c < n; c++) for (var r = 0; r < m; r++) s += '<rect x="' + (x + (b > 0 ? u : 0) + c * u) + '" y="' + (top + r * u) + '" width="' + (u - 2) + '" height="' + (u - 2) + '" rx="2" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1"/>';
      s += '<text x="' + (x + w / 2) + '" y="16" text-anchor="middle" font-size="16" class="tb">Term ' + n + '</text>';
      x += Math.max(w, 60) + 22;
    }
    return A.svg(x, H + 30, s, label || 'Tile pattern: each term has ' + m + ' more squares than the one before, starting with ' + (m + b));
  }
  /* graph of points (n, m*n + b) for n = 1..k */
  function graph(m, b, k) {
    var W = 420, H = 260, x0 = 50, y0 = 225, vals = [], mx = 1, mn = 0;
    for (var n = 1; n <= k; n++) { var v = m * n + b; vals.push(v); mx = Math.max(mx, v); mn = Math.min(mn, v); }
    var step = mx > 50 ? 10 : mx > 20 ? 5 : mx > 10 ? 2 : 1, top = Math.ceil(mx / step) * step, s = '';
    function X(n) { return x0 + (W - x0 - 20) * n / (k + 1); }
    function Y(v) { return y0 - (y0 - 20) * v / top; }
    for (var g = 0; g <= top; g += step) s += '<line x1="' + x0 + '" y1="' + Y(g) + '" x2="' + (W - 10) + '" y2="' + Y(g) + '" style="stroke:var(--line)"/><text x="' + (x0 - 8) + '" y="' + (Y(g) + 5) + '" text-anchor="end" font-size="15">' + g + '</text>';
    for (var n2 = 1; n2 <= k; n2++) s += '<text x="' + X(n2) + '" y="' + (y0 + 22) + '" text-anchor="middle" font-size="15">' + n2 + '</text>';
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (W - 10) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="12" style="stroke:var(--ink)" stroke-width="2"/>';
    vals.forEach(function (v, i) { if (v >= 0) s += '<circle cx="' + X(i + 1) + '" cy="' + Y(v) + '" r="7" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/>'; });
    s += '<text x="' + ((x0 + W) / 2) + '" y="' + (y0 + 34) + '" text-anchor="middle" font-size="14" class="t2">term number</text>';
    return A.svg(W, H + 14, s, 'Graph of the pattern: the points go up in a straight line');
  }
  /* algebra tiles: a long tiles (x) and c unit tiles, in a group */
  function atiles(a, c, col) {
    var s = '', x = 4;
    for (var i = 0; i < a; i++) { s += '<rect x="' + x + '" y="4" width="20" height="56" rx="3" style="fill:' + (col || 'var(--strand)') + ';stroke:var(--ink)" stroke-width="1.5"/><text x="' + (x + 10) + '" y="38" text-anchor="middle" font-size="16" font-weight="700" style="fill:#fff">x</text>'; x += 26; }
    for (var j = 0; j < c; j++) { s += '<rect x="' + x + '" y="40" width="20" height="20" rx="3" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/>'; x += 26; }
    return A.svg(Math.max(x, 30), 64, s, a + ' x tiles and ' + c + ' unit tiles');
  }
  /* balance: left has a x-boxes and b units, right has c units */
  function balance(a, b, c, label) {
    var s = '', W = 520;
    s += '<polygon points="260,170 240,200 280,200" style="fill:var(--ink2)"/><line x1="40" y1="170" x2="480" y2="170" style="stroke:var(--ink)" stroke-width="5" stroke-linecap="round"/>';
    s += '<path d="M40 170 L20 150 H230 L210 170" fill="none" style="stroke:var(--ink2)" stroke-width="2"/><path d="M310 170 L290 150 H500 L480 170" fill="none" style="stroke:var(--ink2)" stroke-width="2"/>';
    var x = 30, items = [];
    for (var i = 0; i < a; i++) items.push('x');
    for (var j = 0; j < Math.min(b, 20); j++) items.push('1');
    var perRow = 8, size = 24;
    items.forEach(function (t, k) {
      var cx = 30 + (k % perRow) * size, cy = 124 - Math.floor(k / perRow) * size;
      s += t === 'x' ? '<rect x="' + cx + '" y="' + cy + '" width="' + (size - 3) + '" height="' + (size - 3) + '" rx="3" style="fill:var(--strand);stroke:var(--ink)"/><text x="' + (cx + 10.5) + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="14" font-weight="700" style="fill:#fff">x</text>' :
        '<circle cx="' + (cx + 10.5) + '" cy="' + (cy + 10.5) + '" r="9" style="fill:var(--hi);stroke:var(--ink)"/>';
    });
    if (b > 20) s += '<text x="120" y="40" text-anchor="middle" font-size="16" class="tb">+ ' + b + ' units</text>';
    var rc = Math.min(c, 40);
    for (var r = 0; r < rc; r++) { var rx = 300 + (r % 8) * size, ry = 124 - Math.floor(r / 8) * size; s += '<circle cx="' + (rx + 10.5) + '" cy="' + (ry + 10.5) + '" r="9" style="fill:var(--hi);stroke:var(--ink)"/>'; }
    if (c > 40) s += '<text x="400" y="20" text-anchor="middle" font-size="16" class="tb">' + c + ' units</text>';
    s += '<text x="125" y="226" text-anchor="middle" font-size="19" font-weight="700">' + (a ? (a === 1 ? '' : a) + 'x' : '') + (b ? (a ? ' + ' : '') + b : '') + '</text><text x="260" y="226" text-anchor="middle" font-size="19" font-weight="700">=</text><text x="395" y="226" text-anchor="middle" font-size="19" font-weight="700">' + c + '</text>';
    return A.svg(W, 236, s, label || 'Balance: ' + a + ' x boxes and ' + b + ' units on the left, ' + c + ' units on the right');
  }
  /* inequality on a number line: x op v */
  function iqline(op, v, lo, hi) {
    lo = lo === undefined ? Math.max(0, v - 8) : lo; hi = hi === undefined ? lo + 16 : hi;
    var W = 560, x0 = 30, x1 = 530, s = '';
    function X(t) { return x0 + (x1 - x0) * (t - lo) / (hi - lo); }
    s += '<line x1="' + (x0 - 10) + '" y1="40" x2="' + (x1 + 10) + '" y2="40" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var t = lo; t <= hi; t++) s += '<line x1="' + X(t) + '" y1="32" x2="' + X(t) + '" y2="48" style="stroke:var(--ink)" stroke-width="1.5"/>' + ((hi - lo <= 16 || t % 2 === 0) ? '<text x="' + X(t) + '" y="72" text-anchor="middle" font-size="18">' + t + '</text>' : '');
    var right = op === '>' || op === '≥', closed = op === '≤' || op === '≥', xe = right ? x1 + 10 : x0 - 10;
    s += '<line x1="' + X(v) + '" y1="40" x2="' + xe + '" y2="40" style="stroke:var(--strand)" stroke-width="7"/>';
    s += '<path d="M' + xe + ' 40 l' + (right ? -14 : 14) + ' -10 v20z" style="fill:var(--strand)"/>';
    s += '<circle cx="' + X(v) + '" cy="40" r="10" style="fill:' + (closed ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--strand)" stroke-width="4"/>';
    return A.svg(W, 82, s, 'Number line showing x ' + op + ' ' + v + (closed ? ', closed dot' : ', open dot'));
  }
  var OPS = { '<': 'is less than', '>': 'is greater than', '≤': 'is less than or equal to', '≥': 'is greater than or equal to' };
  /* small programs for the coding section */
  function runA(start, limit, step) {
    var x = start, out = [], guard = 0;
    while (x <= limit && guard++ < 50) { if (x % 2 === 0) out.push(x + ' is even'); else out.push(x + ' is odd'); x += step; }
    return out;
  }
  function codeA(start, limit, step) {
    return '<code class="mono">x = ' + start + '\nrepeat while x ≤ ' + limit + ':\n    if x is divisible by 2:\n        say x, "is even"\n    else:\n        say x, "is odd"\n    x = x + ' + step + '</code>';
  }

  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var CH = 'patterns-algebra', g = G6.g, lab = G6.lab, play = G6.play;
  var LESSONS = [
    { id: 'patterns', title: 'Linear patterns', sub: 'the same change every time', concepts: [
      { id: 'grow', title: 'Growing patterns', exp: ['C1.1', 'C1.4'], skill: 'pa-next',
        body: '<p>In a <b>growing pattern</b> each term gets bigger. When it grows by the <b>same amount</b> every time, the pattern is <b>linear</b>.</p>',
        watch: play([
          ['Term 1: 2 orange tiles that stay, and 3 purple tiles.', figs(3, 2, 1), '5 tiles'],
          ['Term 2: 3 more purple tiles.', figs(3, 2, 2), '5, 8'],
          ['Term 3: 3 more again.', figs(3, 2, 3), '5, 8, 11'],
          ['Term 4: still 3 more. Same change each time, so it is linear.', figs(3, 2, 4), '5, 8, 11, 14']
        ]),
        try: lab(CH, 0, 'Make a pattern that adds <b>4</b> each time with <b>1</b> tile that stays.', function (h) { return +h.querySelector('#gpm').value === 4 && +h.querySelector('#gpb').value === 1; }, 'Yes: 5, 9, 13, 17. The rule is 4n + 1.'),
        key: '<p>Find the change between each pair of terms. Same change means linear.</p>',
        check: [{ q: 'The pattern is 0.25, 0.5, 0.75, 1, &hellip; What is the next term?', type: 'num', answer: 1.25, hint: 'What is added each time?', explain: 'It adds 0.25 each time. 1 + 0.25 = 1.25.' }, g(CH, 'pa-next', 1), g(CH, 'pa-next', 2)] },
      { id: 'linear', title: 'Linear or not?', exp: ['C1.1'], skill: 'pa-next', hard: true,
        body: '<p>A linear pattern makes a <b>straight line</b> of points on a graph. A pattern like 1, 2, 4, 8 doubles, so the change keeps growing and the points curve up.</p>',
        watch: play([
          ['5, 8, 11, 14: adds 3 every time.', graph(3, 2, 4)],
          ['Its points sit on a straight line. Linear.', graph(3, 2, 6), '+3, +3, +3']
        ]),
        ways: [
          { label: 'Look at the changes', html: '<div class="tbl"><table><thead><tr><th class="l">Pattern</th><th class="l">Changes</th><th class="l">Linear?</th></tr></thead><tbody><tr><td class="l">2, 5, 8, 11</td><td class="l">+3, +3, +3</td><td class="l"><b>Yes</b></td></tr><tr><td class="l">1, 2, 4, 8</td><td class="l">+1, +2, +4</td><td class="l">No</td></tr><tr><td class="l">20, 17, 14, 11</td><td class="l">&minus;3, &minus;3, &minus;3</td><td class="l"><b>Yes</b> (shrinking)</td></tr></tbody></table></div>' },
          { label: 'Shrinking patterns', html: '<p>A gift card starts at $50 and loses $4 a week: 50, 46, 42, 38. The change is &minus;4 every time, so it is linear too. The line just goes down.</p>' }
        ],
        key: '<p>Same change every time (up or down) = linear.</p>',
        check: [{ q: 'Which pattern is linear?', type: 'mc', options: ['3, 6, 12, 24', '2, 5, 8, 11', '1, 4, 9, 16', '1, 2, 4, 7'], answer: 1, hint: 'Find the change between each pair.', explain: '2, 5, 8, 11 adds 3 every time.' },
          { q: 'Is 40, 35, 30, 25 a linear pattern?', type: 'mc', options: ['Yes: it goes down by 5 every time', 'No: it gets smaller', 'No: linear patterns must grow'], answer: 0, hint: 'Is the change the same each time?', explain: 'It changes by &minus;5 every time, so it is linear.' }, g(CH, 'pa-next', 2)] }
    ] },
    { id: 'rules', title: 'Pattern rules', sub: 'jump to any term', concepts: [
      { id: 'rule', title: 'Write the rule', exp: ['C1.2'], skill: 'pa-rule',
        body: '<p>The <b>change</b> goes in front of n. Then fix term 1 with the part that stays. For 5, 8, 11, 14 the rule is <b>3n + 2</b>.</p>',
        watch: play([
          ['5, 8, 11, 14 adds 3 each time.', '<p class="g6-big">5, 8, 11, 14</p>', '+3 each time'],
          ['So start with 3n. For term 1, 3n is 3.', '<p class="g6-big">3 &times; 1 = 3</p>'],
          ['But term 1 is 5. We need 2 more.', '<p class="g6-big">5 &minus; 3 = 2</p>'],
          ['The rule is 3n + 2. Check term 4: 12 + 2 = 14. It works.', figs(3, 2, 4), '3n + 2']
        ]),
        key: '<p>Rule = (change) &times; n + (what is left over). Always check with term 1.</p>',
        mistake: '<p>Using only the change in the rule. 5, 8, 11, 14 is not 3n, because 3 &times; 1 = 3, not 5. Ask the student to test the rule on term 1 every time.</p>',
        check: [{ q: 'The pattern is 7, 11, 15, 19. Which rule matches it?', type: 'mc', options: ['4n', 'n + 4', '4n + 3', '7n + 4'], answer: 2, hint: 'The change goes in front of n. Then check term 1.', explain: '4 &times; 1 = 4 and 7 &minus; 4 = 3, so 4n + 3.' }, g(CH, 'pa-rule', 1), g(CH, 'pa-rule', 2)] },
      { id: 'predict', title: 'Predict and work backwards', exp: ['C1.3'], skill: 'pa-rule', hard: true,
        body: '<p>With a rule you can jump straight to any term. For 3n + 2, term 20 is 3 &times; 20 + 2 = <b>62</b>. To find which term has 47, undo the rule.</p>',
        watch: play([
          ['Which term of 3n + 2 has 47 tiles?', '<p class="g6-big">3n + 2 = 47</p>'],
          ['Undo the + 2: take 2 away.', '<p class="g6-big">3n = 45</p>'],
          ['Undo the &times; 3: divide by 3.', '<p class="g6-big">n = 15</p>', 'Term 15'],
          ['Check: 3 &times; 15 + 2 = 47.', '<p class="g6-big">45 + 2 = 47 &check;</p>']
        ]),
        ways: [{ label: 'Use a table', html: '<div class="tbl"><table><thead><tr><th class="l">n</th><td>1</td><td>2</td><td>3</td><td>10</td><td>20</td></tr></thead><tbody><tr><th class="l">3n + 2</th><td>5</td><td>8</td><td>11</td><td>32</td><td><b>62</b></td></tr></tbody></table></div><p>The table works for small terms. The rule is faster for big ones.</p>' },
          { label: 'Count on in jumps', html: '<p>Term 10 is 32. Term 15 is 5 more jumps of 3: 32 + 15 = 47.</p>' }],
        key: '<p>Forward: put n in. Backward: undo the adding, then undo the multiplying.</p>',
        check: [{ q: 'The rule is 4n + 1. What is term 12?', type: 'num', answer: 49, hint: 'Put 12 in place of n. Multiply first.', explain: '4 &times; 12 + 1 = 49.' },
          { q: 'The rule is 5n &minus; 2. Which term number has the value 48?', type: 'num', answer: 10, hint: 'Solve 5n &minus; 2 = 48.', explain: '5n = 50, so n = 10.' }, g(CH, 'pa-rule', 2)] }
    ] },
    { id: 'expressions', title: 'Expressions', sub: 'letters that stand for numbers', concepts: [
      { id: 'evaluate', title: 'Variables and evaluating', exp: ['C2.2'], skill: 'pa-eval',
        body: '<p>A <b>variable</b> is a letter that stands for a number. 3x means 3 &times; x. To <b>evaluate</b>, put the number in place of the letter and calculate. Multiply first.</p>',
        watch: play([
          ['Evaluate 3x + 2 when x = 4.', '<p class="g6-big">3x + 2</p>'],
          ['3x means 3 times x.', '<p class="g6-big">3 &times; x + 2</p>'],
          ['Put 4 in place of x.', '<p class="g6-big">3 &times; 4 + 2</p>'],
          ['Multiply first, then add.', '<p class="g6-big">12 + 2 = 14</p>', 'Not 34 + 2']
        ]),
        key: '<p>Replace the letter, multiply, then add or subtract.</p>',
        mistake: '<p>Reading 3x as a two-digit number. When x = 4, the student writes 34 instead of 3 &times; 4 = 12.</p>',
        check: [{ q: 'Evaluate <span class="math">5a &minus; 3</span> when a = 2.4.', type: 'num', answer: 9, hint: 'Replace a with 2.4, multiply first, then subtract.', explain: '5 &times; 2.4 = 12. 12 &minus; 3 = 9.' }, g(CH, 'pa-eval', 1), g(CH, 'pa-eval', 2), g(CH, 'pa-eval', 3)] },
      { id: 'like', title: 'Adding like terms', exp: ['C2.1'], skill: 'pa-combine',
        body: '<p>Terms with the same letter can join, like apples with apples. 3x + 4x = <b>7x</b>. A plain number is a different kind of term, so it stays separate.</p>',
        watch: { tool: 'tiles', opts: {}, steps: [
          { say: 'Three x tiles: 3x.', act: function (t) { return t.add('x', 1).then(function () { return t.add('x', 1); }).then(function () { return t.add('x', 1); }); }, ms: 1200 },
          { say: 'Add two more x tiles: 3x + 2x.', act: function (t) { return t.add('x', 1).then(function () { return t.add('x', 1); }); }, ms: 1200 },
          { say: 'Add 4 unit tiles.', act: function (t) { return t.add('one', 1).then(function () { return t.add('one', 1); }).then(function () { return t.add('one', 1); }).then(function () { return t.add('one', 1); }); }, ms: 1200 },
          { say: 'The x tiles join to make 5x. The units stay: 5x + 4.', act: function (t) { return t.wait(400); }, ms: 1600 }
        ] },
        try: { tool: 'tiles', opts: {}, tasks: [
          { do: 'Show <b>2x + 3 + 4x</b> with tiles.', goal: function (s) { return s.x === 6 && s.one === 3 && s.n === 9; }, yes: 'Yes: 6 x tiles and 3 units, so 6x + 3.' },
          { do: 'Show <b>x + 5 + 2x</b>.', goal: function (s) { return s.x === 3 && s.one === 5 && s.n === 8; }, yes: 'Yes: 3x + 5.' }
        ] },
        ways: [{ label: 'With a picture', html: '<div class="fig">' + atiles(6, 3) + '</div><p>4m + 3 + 2m: the long tiles join (4 + 2 = 6). The 3 small squares stay. 6m + 3.</p>', }],
        key: '<p>Add the numbers in front of the same letter. Leave plain numbers alone.</p>',
        mistake: '<p>Adding everything together: 4m + 3 + 2m written as 9m. The 3 is not an m term.</p>',
        check: [{ q: 'Simplify: <span class="math">4m + 3 + 2m</span>', type: 'mc', options: ['9m', '6m + 3', '7m + 2', '6m + 3m'], answer: 1, hint: 'Add the m terms. The 3 stays.', explain: '4m + 2m = 6m, so 6m + 3.' }, g(CH, 'pa-combine', 1), g(CH, 'pa-combine', 2)] }
    ] },
    { id: 'equations', title: 'Equations', sub: 'keep it balanced', concepts: [
      { id: 'balance', title: 'Solve with a balance', exp: ['C2.3'], skill: 'pa-solve',
        body: '<p>An <b>equation</b> is like a balance: both sides are equal. Do the <b>same thing to both sides</b> and it stays balanced.</p>',
        watch: play([
          ['3x + 5 = 17. The sides balance.', balance(3, 5, 17)],
          ['Take 5 units off both sides.', balance(3, 0, 12), '3x = 12'],
          ['Split both sides into 3 equal groups.', balance(1, 0, 4), 'x = 4'],
          ['Check: 3 &times; 4 + 5 = 17.', balance(3, 5, 17), '12 + 5 = 17 ✓']
        ]),
        try: lab(CH, 2, 'Set the balance to <b>4 x</b> and press "Next step" until it is solved.', function (h) { return +h.querySelector('#bqa').value === 4 && h.querySelector('#bqstep').disabled; }, 'Solved. First take away the extra units, then share into equal groups.'),
        key: '<p>Undo in reverse order: first the adding, then the multiplying. Check your answer.</p>',
        check: [{ q: 'Solve: <span class="math">4x + 7 = 31</span>', type: 'num', answer: 6, hint: 'Take 7 from both sides, then divide by 4.', explain: '4x = 24, so x = 6.' }, g(CH, 'pa-solve', 1), g(CH, 'pa-solve', 2)] },
      { id: 'twox', title: 'More than one x term', exp: ['C2.3', 'C2.1'], skill: 'pa-solve', hard: true,
        body: '<p>When an equation has two x terms, <b>join them first</b>. Then solve as usual.</p>',
        watch: play([
          ['2x + 3x + 4 = 29', '<p class="g6-big">2x + 3x + 4 = 29</p>'],
          ['Join the x terms.', balance(5, 4, 29), '5x + 4 = 29'],
          ['Take 4 from both sides.', balance(5, 0, 25), '5x = 25'],
          ['Divide both sides by 5.', balance(1, 0, 5), 'x = 5']
        ]),
        ways: [{ label: 'Guess and check', html: '<p>Try x = 4: 8 + 12 + 4 = 24. Too small. Try x = 5: 10 + 15 + 4 = 29. Yes. Guessing works, but undoing is faster for big numbers.</p>' },
          { label: 'Think backwards', html: '<p>Something plus 4 makes 29, so the something is 25. Five x make 25, so one x is 5.</p>' }],
        key: '<p>Join like terms, undo the adding, undo the multiplying, check.</p>',
        check: [{ q: 'Solve: <span class="math">3x + 2x + 6 = 41</span>', type: 'num', answer: 7, hint: 'Join the x terms first.', explain: '5x + 6 = 41. 5x = 35. x = 7.' }, g(CH, 'pa-solve', 2), g(CH, 'pa-solve', 3)] }
    ] },
    { id: 'inequalities', title: 'Inequalities', sub: 'many answers at once', concepts: [
      { id: 'line', title: 'Inequalities on a number line', exp: ['C2.4'], skill: 'pa-ineq',
        body: '<p>An <b>inequality</b> uses &lt;, &gt;, &le; or &ge;. It has many answers. An <b>open dot</b> means the number is not included. A <b>closed dot</b> means it is.</p>',
        watch: play([
          ['x &gt; 4: every number bigger than 4.', iqline('>', 4, 0, 12), 'Open dot: 4 is not included'],
          ['x &ge; 4: 4 counts too.', iqline('≥', 4, 0, 12), 'Closed dot: 4 is included'],
          ['x &lt; 4: every number smaller than 4.', iqline('<', 4, 0, 12), 'Arrow points left']
        ]),
        try: lab(CH, 3, 'Show <b>x &lt; 3</b> on the number line.', function (h) { return h.querySelector('#iqo').value === '<' && +h.querySelector('#iqv').value === 3; }, 'Yes: open dot at 3, arrow to the left.'),
        key: '<p>&lt; and &gt;: open dot. &le; and &ge;: closed dot. The arrow points to the answers.</p>',
        check: [{ q: 'Which inequality has a closed dot at 6 and an arrow to the left?', type: 'mc', options: ['x &lt; 6', 'x &le; 6', 'x &gt; 6', 'x &ge; 6'], answer: 1, hint: 'Closed means 6 is included. Left means smaller.', explain: 'x &le; 6.' }, { q: 'Is 5 a solution of x &gt; 5?', type: 'mc', options: ['Yes', 'No'], answer: 1, hint: 'Is 5 greater than 5?', explain: '5 is not greater than 5, so no.' }] },
      { id: 'solveineq', title: 'Solving inequalities', exp: ['C2.4'], skill: 'pa-ineq', hard: true,
        body: '<p>Solve an inequality like an equation: do the same thing to both sides. Then check one number.</p>',
        watch: play([
          ['2x &minus; 3 &ge; 11', '<p class="g6-big">2x &minus; 3 &ge; 11</p>'],
          ['Add 3 to both sides.', '<p class="g6-big">2x &ge; 14</p>'],
          ['Divide both sides by 2.', iqline('≥', 7, 0, 14), 'x &ge; 7'],
          ['Check x = 7: 14 &minus; 3 = 11, and 11 &ge; 11. True.', iqline('≥', 7, 0, 14), '✓']
        ]),
        ways: [{ label: 'Test numbers', html: '<p>Try x = 6: 12 &minus; 3 = 9. Is 9 &ge; 11? No. Try x = 7: 11 &ge; 11. Yes. Try x = 8: 13 &ge; 11. Yes. So 7 and bigger work.</p>' }],
        key: '<p>Same steps as an equation. Keep the sign. Check a number.</p>',
        check: [{ q: 'Solve: <span class="math">2x &minus; 3 &ge; 11</span>', type: 'mc', options: ['x &ge; 4', 'x &ge; 7', 'x &le; 7', 'x &ge; 8'], answer: 1, hint: 'Add 3, then divide by 2.', explain: '2x &ge; 14, so x &ge; 7.' }, g(CH, 'pa-ineq', 1), g(CH, 'pa-ineq', 2)] }
    ] },
    { id: 'code', title: 'Code', sub: 'loops and choices', concepts: [
      { id: 'loops', title: 'Loops and conditions', exp: ['C3.1', 'C3.2'], skill: 'pa-code',
        body: '<p>A <b>loop</b> ("repeat while") runs the same lines again. A <b>condition</b> ("if &hellip; else") makes a choice. To predict code, write down x after every pass.</p>',
        watch: play([
          ['x = 10. Repeat while x &gt; 0: say x, then take 3.', '<code class="mono">x = 10\nrepeat while x &gt; 0:\n    say x\n    x = x &minus; 3</code>'],
          ['Pass 1 says 10. Pass 2 says 7.', '<div class="tbl"><table><thead><tr><th>x</th><th>says</th></tr></thead><tbody><tr><td>10</td><td>10</td></tr><tr><td>7</td><td>7</td></tr></tbody></table></div>'],
          ['Pass 3 says 4. Pass 4 says 1.', '<div class="tbl"><table><thead><tr><th>x</th><th>says</th></tr></thead><tbody><tr><td>10</td><td>10</td></tr><tr><td>7</td><td>7</td></tr><tr><td>4</td><td>4</td></tr><tr><td>1</td><td>1</td></tr></tbody></table></div>'],
          ['Now x = &minus;2. That is not greater than 0, so it stops. 4 numbers.', '<div class="tbl"><table><thead><tr><th>x</th><th>says</th></tr></thead><tbody><tr><td>10</td><td>10</td></tr><tr><td>7</td><td>7</td></tr><tr><td>4</td><td>4</td></tr><tr><td>1</td><td>1</td></tr><tr><td>&minus;2</td><td>stop</td></tr></tbody></table></div>']
        ]),
        try: lab(CH, 4, 'Change the code so it says exactly <b>5</b> lines.', function (h) { return /Output \(5 lines\)/.test(h.querySelector('#cdout').textContent); }, 'Yes: 5 passes through the loop.'),
        key: '<p>Make a trace table: the value of x on every pass, and when it stops.</p>',
        check: [{ q: 'x = 10. repeat while x &gt; 0: say x, then x = x &minus; 3. How many numbers does it say?', type: 'num', answer: 4, hint: 'Trace it: 10, 7, &hellip;', explain: 'It says 10, 7, 4, 1.' }, g(CH, 'pa-code', 1), g(CH, 'pa-code', 2)] }
    ] }
  ];
  A.register('patterns-algebra', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Growing and shrinking patterns</h2>' +
'<p>In a <b>growing pattern</b> the terms get bigger. In a <b>shrinking pattern</b> they get smaller. When the change is the <b>same every time</b>, the pattern is <b>linear</b>: its points sit on a straight line.</p>' +
'<div class="fig">' + figs(3, 2, 4) + '</div>' +
'<div class="tbl"><table><thead><tr><th class="l">Term number (n)</th><td>1</td><td>2</td><td>3</td><td>4</td></tr></thead><tbody><tr><th class="l">Number of tiles</th><td>5</td><td>8</td><td>11</td><td>14</td></tr></tbody></table></div>' +
'<p>Each term adds 3 purple tiles. The 2 orange tiles never change. So term n has <b>3n + 2</b> tiles.</p>' +
'<div class="lab"><span class="lt">Try it: build a linear pattern</span>' +
'<div class="ctrl"><label for="gpm">Add each time: <output id="gpmo"></output><input type="range" id="gpm" min="1" max="5" value="2"></label><label for="gpb">Tiles that stay: <output id="gpbo"></output><input type="range" id="gpb" min="0" max="5" value="3"></label></div>' +
'<div class="fig" id="gpfig"></div><div class="row2"><div class="fig" id="gpgraph"></div><div class="out" id="gpout"></div></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>In a linear pattern, the number you add each time goes <b>in front of n</b>. The number that stays the same is <b>added on</b>. Pattern rule: term = (change) &times; n + (start part).</p></div>' +
'<p>Not every pattern is linear. 1, 2, 4, 8, 16 doubles each time, so the change grows. Its points curve upward.</p>' +
A.yt({ q: 'Which pattern is linear?', type: 'mc', options: ['3, 6, 12, 24', '2, 5, 8, 11', '1, 4, 9, 16', '1, 2, 4, 7'], answer: 1,
  hint: 'Say the rule: linear means the same change every time. Find the change between each pair.', explain: '2, 5, 8, 11 adds 3 every time. The others change by different amounts.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Pattern rules and predictions</h2>' +
'<p>A pattern rule lets you jump straight to any term without drawing them all. For 3n + 2, term 20 has 3 &times; 20 + 2 = <b>62</b> tiles.</p>' +
'<p>You can also work backwards: which term has 47 tiles? Solve 3n + 2 = 47. Take away 2: 3n = 45. Divide by 3: n = <b>15</b>.</p>' +
'<div class="eg"><b class="t">Worked example: a shrinking pattern</b><p>A gift card starts at $50 and you spend $4 each week. After n weeks it holds 50 &minus; 4n dollars. After 6 weeks: 50 &minus; 24 = <b>$26</b>.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Week (n)</th><td>0</td><td>1</td><td>2</td><td>3</td><td>6</td></tr></thead><tbody><tr><th class="l">Balance ($)</th><td>50</td><td>46</td><td>42</td><td>38</td><td><b>26</b></td></tr></tbody></table></div></div>' +
'<p>Patterns work with decimals too. 0.25, 0.5, 0.75, 1, &hellip; adds 0.25 each time, so term n is 0.25n. Term 10 is 2.5.</p>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Using only the change. 5, 8, 11, 14 adds 3, but the rule is not 3n: 3 &times; 1 = 3, not 5. Check your rule with term 1 every time: 3 &times; 1 + 2 = 5. It works.</p></div>' +
A.yt({ q: 'The rule is 4n + 1. What is term 12?', type: 'num', answer: 49,
  hint: 'Say the steps: put 12 in place of n. Multiply first, then add.', explain: '4 &times; 12 + 1 = 48 + 1 = 49.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Variables and expressions</h2>' +
'<p>A <b>variable</b> is a letter that stands for a number. An <b>expression</b> like 2x + 5 uses variables, numbers and operations. 2x means 2 &times; x.</p>' +
'<p>Terms with the same variable can be added, like adding apples to apples. With algebra tiles, a long tile is x and a small square is 1.</p>' +
'<div class="lab"><span class="lt">Try it: add like terms</span>' +
'<div class="ctrl"><label for="mta">First: x tiles<input type="number" id="mta" min="0" max="8" value="3"></label><label for="mtb">Second: x tiles<input type="number" id="mtb" min="0" max="8" value="4"></label><label for="mtc">Unit tiles<input type="number" id="mtc" min="0" max="8" value="2"></label></div>' +
'<div class="fig" id="mtfig"></div><div class="out" id="mtout"></div></div>' +
'<p>To <b>evaluate</b> an expression, replace the variable with its value and calculate. Multiply before you add.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>Evaluate 3x + 2 when x = 1.5. Replace x: 3 &times; 1.5 + 2 = 4.5 + 2 = <b>6.5</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Reading 3x as "thirty-something". When x = 4, 3x is 3 &times; 4 = 12, not 34.</p></div>' +
A.yt({ q: 'Evaluate <span class="math">5a &minus; 3</span> when a = 2.4.', type: 'num', answer: 9,
  hint: 'Say the steps: replace a with 2.4, multiply first, then subtract.', explain: '5 &times; 2.4 = 12. 12 &minus; 3 = 9.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Solving equations</h2>' +
'<p>An <b>equation</b> says two things are equal, like a balance. To keep it balanced, do the <b>same thing to both sides</b>.</p>' +
'<div class="lab"><span class="lt">Try it: balance and solve</span>' +
'<div class="ctrl"><label for="bqa">Number of x<input type="number" id="bqa" min="1" max="6" value="3"></label><label for="bqx">Secret x<input type="number" id="bqx" min="1" max="9" value="4"></label><label for="bqb">Extra units<input type="number" id="bqb" min="0" max="12" value="5"></label></div>' +
'<div class="fig" id="bqfig"></div><div class="btnrow"><button type="button" class="btn alt" id="bqstep">Next step</button><button type="button" class="btn alt" id="bqreset">Start again</button></div><div class="out" id="bqout"></div></div>' +
'<div class="eg"><b class="t">Worked example: more than one x term</b><p>2x + 3x + 4 = 29. First combine like terms: 5x + 4 = 29. Take 4 from both sides: 5x = 25. Divide both sides by 5: x = <b>5</b>.</p><p><b>Verify:</b> 2 &times; 5 + 3 &times; 5 + 4 = 10 + 15 + 4 = 29. It checks.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Undo in reverse order: first undo the adding or subtracting, then undo the multiplying. Always check by putting your answer back into the equation.</p></div>' +
A.yt({ q: 'Solve: <span class="math">4x + 7 = 31</span>', type: 'num', answer: 6,
  hint: 'Say the steps: take 7 from both sides, then divide both sides by 4.', explain: '4x = 24, so x = 6. Check: 4 &times; 6 + 7 = 31.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Inequalities</h2>' +
'<p>An <b>inequality</b> uses &lt;, &gt;, &le; or &ge;. It has many solutions, not just one. Solve it like an equation, then show all the solutions on a number line.</p>' +
'<div class="tbl"><table><thead><tr><th>Symbol</th><th class="l">Means</th><th class="l">Dot on the line</th></tr></thead><tbody>' +
'<tr><td>&lt;</td><td class="l">less than</td><td class="l">open (the number is not included)</td></tr><tr><td>&gt;</td><td class="l">greater than</td><td class="l">open</td></tr>' +
'<tr><td>&le;</td><td class="l">less than or equal to</td><td class="l">closed (the number is included)</td></tr><tr><td>&ge;</td><td class="l">greater than or equal to</td><td class="l">closed</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Worked example</b><p>3x + 4 &lt; 19. Take 4 from both sides: 3x &lt; 15. Divide by 3: <b>x &lt; 5</b>. Check one value: x = 4 gives 16 &lt; 19. True.</p><div class="fig">' + iqline('<', 5, 0, 12) + '</div></div>' +
'<div class="lab"><span class="lt">Try it: graph an inequality</span>' +
'<div class="ctrl"><label for="iqo">x is<select id="iqo"><option>&lt;</option><option>&gt;</option><option>&le;</option><option selected>&ge;</option></select></label><label for="iqv">Number (0 to 100)<input type="number" id="iqv" min="0" max="100" value="7"></label></div>' +
'<div class="fig" id="iqfig"></div><div class="out" id="iqout"></div></div>' +
A.yt({ q: 'Solve: <span class="math">2x &minus; 3 &ge; 11</span>', type: 'mc', options: ['x &ge; 4', 'x &ge; 7', 'x &le; 7', 'x &ge; 8'], answer: 1,
  hint: 'Say the steps: add 3 to both sides, then divide by 2.', explain: '2x &ge; 14, so x &ge; 7. Check x = 7: 14 &minus; 3 = 11, and 11 &ge; 11. True.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Code with conditions</h2>' +
'<p>A <b>conditional statement</b> ("if &hellip; else") lets code make a choice. A <b>loop</b> ("repeat while") runs the same lines again and again. Reading code carefully, line by line, lets you predict what it will do.</p>' +
'<div class="lab"><span class="lt">Try it: change the code and run it</span>' +
'<div class="ctrl"><label for="cda">Start x at<input type="number" id="cda" min="0" max="20" value="1"></label><label for="cdb">Stop after<input type="number" id="cdb" min="0" max="30" value="7"></label><label for="cdc">Add each time<select id="cdc"><option>1</option><option selected>2</option><option>3</option><option>5</option></select></label></div>' +
'<div id="cdcode"></div><div class="out" id="cdout"></div></div>' +
'<p><b>Efficient</b> code does the job with fewer steps. To say the numbers 1 to 100, a loop with 3 lines is much more efficient than 100 separate "say" lines.</p>' +
'<div class="key"><b class="t">Key idea</b><p>To predict what code does, make a trace table: write the value of each variable after every line.</p></div>' +
A.yt({ q: 'x = 10. repeat while x &gt; 0: say x, then x = x &minus; 3. How many numbers does it say?', type: 'num', answer: 4,
  hint: 'Make a trace: 10, then 7, then &hellip; Stop when x is no longer greater than 0.', explain: 'It says 10, 7, 4, 1. Then x = &minus;2, which is not greater than 0, so it stops. 4 numbers.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function gp() {
        var m = +$('#gpm', root).value, b = +$('#gpb', root).value;
        $('#gpmo', root).textContent = m; $('#gpbo', root).textContent = b;
        $('#gpfig', root).innerHTML = figs(m, b, 4);
        $('#gpgraph', root).innerHTML = graph(m, b, 6);
        var h = '<div class="tbl"><table><thead><tr><th>n</th>', i;
        for (i = 1; i <= 6; i++) h += '<td>' + i + '</td>';
        h += '</tr></thead><tbody><tr><th>tiles</th>';
        for (i = 1; i <= 6; i++) h += '<td>' + (m * i + b) + '</td>';
        $('#gpout', root).innerHTML = h + '</tr></tbody></table></div><p><span class="big">' + expr(m, b) + '</span></p><p>Adds ' + m + ' each time. Term 20: ' + m + ' &times; 20 + ' + b + ' = ' + (m * 20 + b) + '.</p>';
      }
      A.bind(root, ['gpm', 'gpb'], gp);
      function mt() {
        var a = Math.max(0, Math.min(8, parseInt($('#mta', root).value, 10) || 0)), b = Math.max(0, Math.min(8, parseInt($('#mtb', root).value, 10) || 0)), c = Math.max(0, Math.min(8, parseInt($('#mtc', root).value, 10) || 0));
        $('#mtfig', root).innerHTML = '<div class="vrow"><figure><figcaption>' + a + 'x</figcaption>' + atiles(a, 0) + '</figure><figure><figcaption>+ ' + b + 'x</figcaption>' + atiles(b, 0, 'var(--sc)') + '</figure><figure><figcaption>+ ' + c + '</figcaption>' + atiles(0, c) + '</figure></div>';
        var t = a + b;
        $('#mtout', root).innerHTML = '<p><span class="big">' + a + 'x + ' + b + 'x + ' + c + ' = ' + (t ? (t === 1 ? '' : t) + 'x' : '0') + (c ? ' + ' + c : '') + '</span></p><p>The x tiles join: ' + a + ' + ' + b + ' = ' + t + '. The unit tiles are a different kind, so they stay separate.</p>';
      }
      A.bind(root, ['mta', 'mtb', 'mtc'], mt);
      var st = 0;
      function bq() {
        var a = Math.max(1, Math.min(6, parseInt($('#bqa', root).value, 10) || 1)), x = Math.max(1, Math.min(9, parseInt($('#bqx', root).value, 10) || 1)), b = Math.max(0, Math.min(12, parseInt($('#bqb', root).value, 10) || 0)), c = a * x + b, h, msg;
        if (st === 0) { h = balance(a, b, c); msg = 'The equation is <b>' + (a > 1 ? a : '') + 'x' + (b ? ' + ' + b : '') + ' = ' + c + '</b>. Press "Next step".'; }
        else if (st === 1) { h = balance(a, 0, a * x); msg = (b ? 'Take ' + b + ' units off <b>both</b> sides: ' : 'There are no extra units to remove: ') + (a > 1 ? a : '') + 'x = ' + a * x + '.'; }
        else { h = balance(1, 0, x); msg = (a > 1 ? 'Split both sides into ' + a + ' equal groups. ' : '') + 'One x balances ' + x + ', so <b>x = ' + x + '</b>. Check: ' + a + ' &times; ' + x + (b ? ' + ' + b : '') + ' = ' + c + '.'; }
        $('#bqfig', root).innerHTML = h; $('#bqout', root).innerHTML = '<p>' + msg + '</p>';
        $('#bqstep', root).disabled = st >= 2;
      }
      $('#bqstep', root).addEventListener('click', function () { st++; bq(); });
      $('#bqreset', root).addEventListener('click', function () { st = 0; bq(); });
      ['bqa', 'bqx', 'bqb'].forEach(function (i) { $('#' + i, root).addEventListener('input', function () { st = 0; bq(); }); });
      bq();
      function iq() {
        var op = $('#iqo', root).value, v = Math.max(0, Math.min(100, parseInt($('#iqv', root).value, 10) || 0));
        $('#iqfig', root).innerHTML = iqline(op, v);
        var ex = op === '<' ? [v - 1, v] : op === '>' ? [v + 1, v] : op === '≤' ? [v, v + 1] : [v, v - 1];
        $('#iqout', root).innerHTML = '<p><span class="big">x ' + op + ' ' + v + '</span></p><p>x ' + OPS[op] + ' ' + v + '. ' + ex[0] + ' is a solution. ' + ex[1] + ' is not. The dot is ' + (op === '<' || op === '>' ? '<b>open</b>, because ' + v + ' itself is not a solution.' : '<b>closed</b>, because ' + v + ' itself is a solution.') + '</p>';
      }
      A.bind(root, ['iqo', 'iqv'], iq);
      function cd() {
        var a = Math.max(0, Math.min(20, parseInt($('#cda', root).value, 10) || 0)), b = Math.max(0, Math.min(30, parseInt($('#cdb', root).value, 10) || 0)), c = +$('#cdc', root).value, out = runA(a, b, c);
        $('#cdcode', root).innerHTML = codeA(a, b, c);
        $('#cdout', root).innerHTML = '<p><b>Output (' + out.length + ' line' + (out.length === 1 ? '' : 's') + '):</b></p>' + (out.length ? '<code class="mono">' + out.join('\n') + '</code>' : '<p>Nothing. ' + a + ' is already more than ' + b + ', so the loop never runs.</p>');
      }
      A.bind(root, ['cda', 'cdb', 'cdc'], cd);
    },

    quiz: [
      { q: 'The pattern is 7, 11, 15, 19, &hellip; Which rule matches it?', type: 'mc', options: ['4n', 'n + 4', '4n + 3', '7n + 4'], answer: 2,
        hint: 'The change goes in front of n. Then check term 1.', explain: 'It adds 4 each time, so 4n. Term 1: 4 &times; 1 = 4, and 7 &minus; 4 = 3. Rule: 4n + 3.' },
      { q: 'Using the rule 5n &minus; 2, which term number has the value 48?', type: 'num', answer: 10,
        hint: 'Solve 5n &minus; 2 = 48.', explain: '5n = 50, so n = 10. Check: 5 &times; 10 &minus; 2 = 48.' },
      { q: 'Simplify: <span class="math">4m + 3 + 2m</span>', type: 'mc', options: ['9m', '6m + 3', '7m + 2', '6m + 3m'], answer: 1, fig: atiles(6, 3),
        hint: 'Add the m terms. The 3 is a different kind of term.', explain: '4m + 2m = 6m. The 3 stays. 6m + 3.' },
      { q: 'Evaluate <span class="math">2y + 0.5</span> when y = 3.2', type: 'num', answer: 6.9,
        hint: 'Multiply first: 2 &times; 3.2.', explain: '2 &times; 3.2 = 6.4. 6.4 + 0.5 = 6.9.' },
      { q: 'Solve: <span class="math">3x + 2x + 6 = 41</span>', type: 'num', answer: 7, fig: balance(5, 6, 41),
        hint: 'Combine the x terms first, then undo the + 6.', explain: '5x + 6 = 41. 5x = 35. x = 7. Check: 21 + 14 + 6 = 41.' },
      { q: 'Which number line shows the solution to <span class="math">2x + 1 &gt; 9</span>?', type: 'mc', options: ['open dot at 4, arrow right', 'closed dot at 4, arrow right', 'open dot at 5, arrow right', 'open dot at 4, arrow left'], answer: 0, fig: iqline('>', 4, 0, 12),
        hint: 'Solve it: subtract 1, then divide by 2. Is 4 itself a solution?', explain: '2x &gt; 8, so x &gt; 4. 4 is not included (open dot) and the solutions go right.' },
      { q: 'What is the last line this code says?<code class="mono">x = 3\nrepeat while x &lt; 20:\n    if x &gt; 10:\n        say "big"\n    else:\n        say x\n    x = x + 4</code>', type: 'mc', options: ['19', '"big"', '23', '11'], answer: 1,
        hint: 'Trace it: x = 3, 7, 11, 15, 19. What does it say for each?', explain: 'It says 3, 7, then "big" for 11, 15 and 19. Then x = 23, which is not less than 20, so it stops. The last line is "big".' }
    ],

    practice: [
      { id: 'pa-next', name: 'Extend a pattern', code: 'C1.3', gen: function (lv) {
        var m = R.int(2, 9) * (lv === 3 && R.int(0, 1) ? -1 : 1), b = R.int(lv === 1 ? 0 : -3, 9), start = m + b;
        if (m < 0) { b = R.int(60, 99); start = m + b; }
        var terms = [1, 2, 3, 4].map(function (n) { return m * n + b; });
        if (lv === 1) return { q: 'What is the next term? <span class="math">' + terms.map(f).join(', ') + ', ?</span>', type: 'num', answer: m * 5 + b, v: { t: terms },
          fig: m > 0 && b >= 0 && m <= 5 && b <= 5 ? figs(m, b, 4) : '', hint: 'Find the change from one term to the next.', steps: ['The change is ' + f(terms[1] - terms[0]) + ' each time.', 'Add it to the last term: ' + f(terms[3]) + ' + ' + f(m) + '.', 'The next term is ' + f(m * 5 + b) + '.'], explain: 'The pattern ' + (m > 0 ? 'adds ' + m : 'subtracts ' + -m) + ' each time, so the next term is ' + f(m * 5 + b) + '.' };
        var k = lv === 2 ? R.int(8, 15) : R.int(20, 50);
        return { q: 'The pattern is <span class="math">' + terms.map(f).join(', ') + ', &hellip;</span> What is term ' + k + '?', type: 'num', answer: m * k + b, v: { t: terms, k: k },
          hint: 'Find the rule first: (change) &times; n + (start part). Check it with term 1.', steps: ['The change is ' + f(m) + ', so the rule starts ' + f(m) + 'n.', 'Term 1 is ' + f(start) + ', and ' + f(m) + ' &times; 1 = ' + f(m) + '. So add ' + f(b) + ': rule ' + expr(m, b) + '.', 'Term ' + k + ': ' + f(m) + ' &times; ' + k + (b < 0 ? ' &minus; ' + f(-b) : ' + ' + f(b)) + ' = ' + f(m * k + b) + '.'],
          explain: 'Rule ' + expr(m, b) + '. Term ' + k + ' = ' + f(m * k + b) + '.' };
      } },
      { id: 'pa-rule', name: 'Find the pattern rule', code: 'C1.2', gen: function (lv) {
        var m = R.int(2, lv === 1 ? 5 : 9), b = R.int(lv === 3 ? -5 : 1, 9); if (b === 0) b = 1;
        var terms = [1, 2, 3, 4].map(function (n) { return m * n + b; });
        var o = R.mc(expr(m, b), [expr(b, m), expr(m, 0), expr(1, m), expr(m, terms[0]), expr(m + 1, b - 1)].filter(function (x) { return x !== expr(m, b); }));
        if (lv === 3) { var tgt = R.int(10, 30), val = m * tgt + b;
          return { q: 'The rule is <span class="math">' + expr(m, b) + '</span>. Which term number has the value ' + val + '?', type: 'num', answer: tgt, v: { m: m, b: b, val: val },
            hint: 'Solve ' + expr(m, b) + ' = ' + val + '.', steps: ['Write the equation: ' + expr(m, b) + ' = ' + val + '.', (b > 0 ? 'Take ' + b + ' from' : 'Add ' + -b + ' to') + ' both sides: ' + m + 'n = ' + (val - b) + '.', 'Divide by ' + m + ': n = ' + tgt + '.'],
            explain: m + ' &times; ' + tgt + (b > 0 ? ' + ' + b : ' &minus; ' + -b) + ' = ' + val + ', so it is term ' + tgt + '.' }; }
        var tbl = '<div class="tbl"><table><thead><tr><th class="l">n</th><td>1</td><td>2</td><td>3</td><td>4</td></tr></thead><tbody><tr><th class="l">term</th>' + terms.map(function (t) { return '<td>' + t + '</td>'; }).join('') + '</tr></tbody></table></div>';
        return { q: 'Which rule matches this table?', type: 'mc', options: o.options, answer: o.answer, fig: tbl + (lv === 1 && b > 0 && b <= 5 ? figs(m, b, 3) : ''), v: { t: terms },
          hint: 'The change goes in front of n. Then check term 1.', steps: ['The change is ' + m + ', so the rule has ' + m + 'n.', m + ' &times; 1 = ' + m + ', but term 1 is ' + terms[0] + '. The difference is ' + b + '.', 'Rule: ' + expr(m, b) + '. Check term 4: ' + m + ' &times; 4 + ' + b + ' = ' + terms[3] + '.'],
          explain: 'The rule is ' + expr(m, b) + '.' };
      } },
      { id: 'pa-eval', name: 'Evaluate expressions', code: 'C2.2', gen: function (lv) {
        var a = R.int(2, 9), b = R.int(1, 20), v = R.pick(['x', 'y', 'n', 'k']), x = lv === 1 ? R.int(2, 10) : lv === 2 ? R.int(2, 12) : R.int(11, 49) / 10, op = lv === 1 ? '+' : R.pick(['+', '−']);
        if (op === '−' && a * x - b < 0) op = '+';
        var val = cl(op === '+' ? a * x + b : a * x - b);
        return { q: 'Evaluate <span class="math">' + a + v + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + '</span> when ' + v + ' = ' + f(x) + '.', type: 'num', answer: val, v: { a: a, b: b, x: x, op: op },
          hint: 'Replace ' + v + ' with ' + f(x) + '. Multiply first.', steps: ['Replace ' + v + ': ' + a + ' &times; ' + f(x) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + '.', 'Multiply: ' + a + ' &times; ' + f(x) + ' = ' + f(cl(a * x)) + '.', (op === '+' ? 'Add' : 'Subtract') + ': ' + f(val) + '.'],
          explain: a + ' &times; ' + f(x) + ' = ' + f(cl(a * x)) + ', and ' + f(cl(a * x)) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + ' = ' + f(val) + '.' };
      } },
      { id: 'pa-combine', name: 'Add like terms', code: 'C2.1', gen: function (lv) {
        var v = R.pick(['x', 'a', 'm', 'p']), a = R.int(1, 9), b = R.int(1, 9), c = lv === 1 ? 0 : R.int(1, 9), d = lv === 3 ? R.int(1, 6) : 0;
        var parts = [a + v, b + v]; if (c) parts.push(String(c)); if (d) parts.push(d + v);
        if (lv > 1) parts = R.shuffle(parts);
        var t = a + b + d, right = t + v + (c ? ' + ' + c : '');
        var o = R.mc(right, [(t + c) + v, t + v + ' + ' + (c + 1), (a + b) + v + (c ? ' + ' + c : '') + (d ? ' + ' + d + v : ''), (t - 1) + v + (c ? ' + ' + c : ''), t + v + ' + ' + c + v].filter(function (x) { return x !== right; }));
        return { q: 'Simplify: <span class="math">' + parts.join(' + ').replace(/(^|\+ )1([a-z])/g, '$1$2') + '</span>', type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? atiles(a + b, c) : '', v: { a: a, b: b, c: c, d: d, v: v },
          hint: 'Add the ' + v + ' terms together. Numbers without ' + v + ' stay separate.', steps: ['Find the ' + v + ' terms: ' + [a, b, d].filter(Boolean).map(function (k) { return k + v; }).join(', ') + '.', 'Add them: ' + [a, b, d].filter(Boolean).join(' + ') + ' = ' + t + ', so ' + t + v + '.', c ? 'The ' + c + ' is not a ' + v + ' term, so it stays: ' + right + '.' : 'Answer: ' + right + '.'],
          explain: right + '.' };
      } },
      { id: 'pa-solve', name: 'Solve equations', code: 'C2.3', gen: function (lv) {
        var x = R.int(2, 12), a = R.int(2, 9), b = R.int(1, 30);
        if (lv === 1) return { q: 'Solve: <span class="math">' + a + 'x = ' + a * x + '</span>', type: 'num', answer: x, v: { a: a, b: 0, c: a * x }, fig: balance(a, 0, a * x),
          hint: 'Divide both sides by ' + a + '.', steps: [a + 'x means ' + a + ' &times; x.', 'Divide both sides by ' + a + ': ' + a * x + ' &divide; ' + a + '.', 'x = ' + x + '.'], explain: a + ' &times; ' + x + ' = ' + a * x + ', so x = ' + x + '.' };
        if (lv === 2) return { q: 'Solve: <span class="math">' + a + 'x + ' + b + ' = ' + (a * x + b) + '</span>', type: 'num', answer: x, v: { a: a, b: b, c: a * x + b }, fig: a * x + b <= 40 && b <= 20 ? balance(a, b, a * x + b) : '',
          hint: 'Take ' + b + ' from both sides first. Then divide.', steps: ['Take ' + b + ' from both sides: ' + a + 'x = ' + a * x + '.', 'Divide both sides by ' + a + '.', 'x = ' + x + '. Check: ' + a + ' &times; ' + x + ' + ' + b + ' = ' + (a * x + b) + '.'], explain: 'x = ' + x + '.' };
        var a1 = R.int(1, 5), a2 = R.int(1, 5), sum = a1 + a2;
        return { q: 'Solve: <span class="math">' + (a1 === 1 ? '' : a1) + 'x + ' + (a2 === 1 ? '' : a2) + 'x + ' + b + ' = ' + (sum * x + b) + '</span>', type: 'num', answer: x, v: { a: sum, b: b, c: sum * x + b },
          hint: 'Combine the x terms first.', steps: ['Combine: ' + a1 + 'x + ' + a2 + 'x = ' + sum + 'x. Now ' + sum + 'x + ' + b + ' = ' + (sum * x + b) + '.', 'Take ' + b + ' from both sides: ' + sum + 'x = ' + sum * x + '.', 'Divide by ' + sum + ': x = ' + x + '.'], explain: 'x = ' + x + '. Check: ' + a1 * x + ' + ' + a2 * x + ' + ' + b + ' = ' + (sum * x + b) + '.' };
      } },
      { id: 'pa-ineq', name: 'Solve inequalities', code: 'C2.4', gen: function (lv) {
        var op = R.pick(lv === 1 ? ['<', '>'] : ['<', '>', '≤', '≥']), x = R.int(2, 12), a = lv === 1 ? 1 : R.int(2, 8), b = R.int(1, 20), c = a * x + b;
        var opH = { '<': '&lt;', '>': '&gt;', '≤': '&le;', '≥': '&ge;' }, flip = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
        var right = 'x ' + opH[op] + ' ' + x;
        var o = R.mc(right, ['x ' + opH[flip[op]] + ' ' + x, 'x ' + opH[op] + ' ' + (c - b), 'x ' + opH[op] + ' ' + (x + 1), 'x ' + opH[op] + ' ' + Math.round((c + b) / a)].filter(function (z) { return z !== right; }));
        return { q: 'Solve: <span class="math">' + (a === 1 ? '' : a) + 'x + ' + b + ' ' + opH[op] + ' ' + c + '</span>', type: 'mc', options: o.options, answer: o.answer, v: { a: a, b: b, c: c, op: op },
          hint: 'Solve it like an equation: take ' + b + ' from both sides' + (a > 1 ? ', then divide by ' + a : '') + '. Keep the same symbol.',
          steps: ['Take ' + b + ' from both sides: ' + (a === 1 ? '' : a) + 'x ' + opH[op] + ' ' + (c - b) + '.', a > 1 ? 'Divide both sides by ' + a + ': x ' + opH[op] + ' ' + x + '.' : 'That gives x ' + opH[op] + ' ' + x + '.', 'Graph it:<div class="fig">' + iqline(op, x) + '</div>'],
          explain: right + '. ' + (op === '<' || op === '>' ? 'Open dot at ' + x + '.' : 'Closed dot at ' + x + '.') };
      } },
      { id: 'pa-code', name: 'Read code', code: 'C3.2', gen: function (lv) {
        var s = R.int(1, 6), lim = R.int(10, 25), st = R.pick([2, 3, 4, 5]), big = R.int(6, 15);
        var vals = []; for (var x = s; x < lim; x += st) vals.push(x);
        if (vals.length < 2) { lim = s + st * 3; vals = [s, s + st, s + st * 2]; }
        if (lv === 1) return { q: 'How many numbers does this code say?<code class="mono">x = ' + s + '\nrepeat while x &lt; ' + lim + ':\n    say x\n    x = x + ' + st + '</code>', type: 'num', answer: vals.length, v: { s: s, lim: lim, st: st, kind: 'count' },
          hint: 'Trace it. Write each value of x and stop when x is no longer less than ' + lim + '.', steps: ['Start at ' + s + ' and add ' + st + ' each time.', 'Values said: ' + vals.join(', ') + '.', 'Next would be ' + (vals[vals.length - 1] + st) + ', which is not less than ' + lim + '. So ' + vals.length + ' numbers.'], explain: 'It says ' + vals.join(', ') + ': ' + vals.length + ' numbers.' };
        var sayBig = vals.filter(function (v) { return v > big; }).length;
        if (lv === 2) return { q: 'How many times does this code say "big"?<code class="mono">x = ' + s + '\nrepeat while x &lt; ' + lim + ':\n    if x &gt; ' + big + ':\n        say "big"\n    else:\n        say x\n    x = x + ' + st + '</code>', type: 'num', answer: sayBig, v: { s: s, lim: lim, st: st, big: big, kind: 'big' },
          hint: 'List every value of x. Count the ones greater than ' + big + '.', steps: ['Values of x: ' + vals.join(', ') + '.', 'Greater than ' + big + ': ' + (vals.filter(function (v) { return v > big; }).join(', ') || 'none') + '.', 'It says "big" ' + sayBig + ' time' + (sayBig === 1 ? '' : 's') + '.'], explain: '"big" is said ' + sayBig + ' time' + (sayBig === 1 ? '' : 's') + '.' };
        var total = vals.reduce(function (p, q) { return p + q; }, 0);
        return { q: 'What is <b>total</b> when this code ends?<code class="mono">total = 0\nx = ' + s + '\nrepeat while x &lt; ' + lim + ':\n    total = total + x\n    x = x + ' + st + '</code>', type: 'num', answer: total, v: { s: s, lim: lim, st: st, kind: 'sum' },
          hint: 'Make a trace table with columns for x and total.', steps: ['x takes the values ' + vals.join(', ') + '.', 'total adds each one: ' + vals.join(' + ') + '.', 'total = ' + total + '.'], explain: vals.join(' + ') + ' = ' + total + '.' };
      } }
    ]
  });
})();
